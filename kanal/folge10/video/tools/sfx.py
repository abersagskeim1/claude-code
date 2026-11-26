"""Synthesise free sound effects and an 8-bit chiptune for Folge 10 "Leeroy Jenkins" (no external sources, nothing paid).
Usage: python3 sfx.py <out_dir> <total_seconds> <music_gap_start>"""
import sys, wave
import numpy as np

OUT = sys.argv[1]
TOTAL = float(sys.argv[2])
GAP0 = float(sys.argv[3])
SR = 44100
rng = np.random.default_rng(2005)


def save(name, x, peak_db=-3.0):
    x = np.asarray(x, dtype=np.float64)
    m = np.max(np.abs(x)) or 1.0
    x = x / m * (10 ** (peak_db / 20))
    n = min(64, len(x) // 4)
    x[:n] *= np.linspace(0, 1, n)
    x[-n:] *= np.linspace(1, 0, n)
    pcm = (x * 32767).astype(np.int16)
    st = np.stack([pcm, pcm], axis=1)
    with wave.open(f"{OUT}/{name}.wav", "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(st.tobytes())


def t(d):
    return np.arange(int(SR * d)) / SR


def env(d, a=0.003, k=20.0):
    tt = t(d)
    e = np.exp(-tt * k)
    na = max(1, int(a * SR))
    e[:na] *= np.linspace(0, 1, na)
    return e


def lowpass(x, a):
    y = np.zeros_like(x); s = 0.0
    for i, v in enumerate(x):
        s += a * (v - s); y[i] = s
    return y


def bandnoise(d, lo_a, hi_a):
    n = rng.standard_normal(int(SR * d))
    return lowpass(n, hi_a) - lowpass(n, lo_a)


def sine(f, d):
    f = np.broadcast_to(np.asarray(f, dtype=np.float64), (int(SR * d),))
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def square(f, d, duty=0.5):
    f = np.broadcast_to(np.asarray(f, dtype=np.float64), (int(SR * d),))
    ph = (np.cumsum(f) / SR) % 1.0
    return np.where(ph < duty, 1.0, -1.0)


def tri(f, d):
    f = np.broadcast_to(np.asarray(f, dtype=np.float64), (int(SR * d),))
    ph = (np.cumsum(f) / SR) % 1.0
    return 4 * np.abs(ph - 0.5) - 1


def mix(d, parts):
    x = np.zeros(int(SR * d))
    for at, sig, g in parts:
        i = int(at * SR); j = min(len(x), i + len(sig))
        x[i:j] += sig[: j - i] * g
    return x



# --- cartoon basics (same recipes as before) ---
def pop(f0, f1, d=0.12):
    tt = t(d)
    f = f1 + (f0 - f1) * np.exp(-tt * 40)
    return sine(f, d) * env(d, 0.001, 35)

save("pop1", pop(900, 300))
save("pop2", pop(1250, 420, 0.1))


def whoosh(d, rev=False):
    n = rng.standard_normal(int(SR * d))
    tt = t(d)
    out = np.zeros_like(n); s = 0.0
    for i, v in enumerate(n):
        a = 0.03 + 0.2 * (i / len(n))
        s += a * (v - s); out[i] = s
    e = np.sin(np.pi * tt / d) ** 2
    if rev:
        e = e * (tt / d) ** 0.5
    return out * e

save("whoosh1", whoosh(0.3))
save("whoosh2", whoosh(0.24, True))
save("swish", whoosh(0.18), -6)


def thud(d=0.45, f0=140, f1=45):
    tt = t(d)
    f = f1 + (f0 - f1) * np.exp(-tt * 18)
    body = sine(f, d) * env(d, 0.002, 7)
    click = bandnoise(d, 0.05, 0.6) * env(d, 0.0005, 60) * 0.6
    return body + click

save("impact", thud(0.55, 150, 40), -2)


def boing(d=0.5):
    tt = t(d)
    f = 180 + 120 * np.sin(2 * np.pi * 9 * tt) * np.exp(-tt * 4) + 140 * tt
    return (sine(f, d) + 0.3 * sine(2 * f, d)) * env(d, 0.002, 6)

save("boing", boing(), -5)


def bell(f, d=0.8, k0=4.0):
    return sum(sine(f * p, d) * env(d, 0.001, k0 + 2 * i) / (i + 1) for i, p in enumerate([1, 2.0, 3.01, 4.2]))

save("ding", bell(1320, 0.7), -7)


def sparkle():
    notes = [1760, 2217, 2637, 3520]
    return np.concatenate([sine(f, 0.07) * env(0.07, 0.001, 18) for f in notes] + [sine(4186, 0.3) * env(0.3, 0.001, 10) * 0.6])

save("sparkle", sparkle(), -9)


def jump():
    d = 0.22
    tt = t(d)
    return sine(300 + 900 * (tt / d) ** 0.7, d) * env(d, 0.002, 9)

save("jump", jump(), -9)


def stamp():
    d = 0.45
    return thud(d, 120, 50) + bandnoise(d, 0.1, 0.8) * env(d, 0.0003, 45) * 0.9

save("stamp", stamp(), -2)


def hmm():
    d = 0.55
    tt = t(d)
    f = np.where(tt < 0.3, 180, 180 + 120 * (tt - 0.3) / 0.25)
    x = sum(sine(f * h, d) / h ** 1.3 for h in range(1, 6))
    return lowpass(x * np.minimum(1, tt / 0.04) * np.minimum(1, (d - tt) / 0.1), 0.25)

save("hmm", hmm(), -8)


def confetti(d=0.7):
    x = np.zeros(int(SR * d))
    for k in range(14):
        c = pop(rng.uniform(1500, 2600), 700, 0.05)
        j = int(rng.uniform(0, d - 0.06) * SR); x[j:j + len(c)] += c * rng.uniform(0.4, 1.0)
    return x

save("confetti", confetti(), -9)

def gulp():
    d = 0.25
    tt = t(d)
    return sine(500 - 380 * tt / d, d) * env(d, 0.002, 12)

save("gulp", gulp(), -7)




def steps(n=5, gap=0.13):  # running steps
    return mix(n * gap + 0.1, [(k * gap, thud(0.08, 220 - 30 * (k % 2), 90), 0.9) for k in range(n)])

save("steps", steps(), -6)

# --- new for Folge 10 (8-bit flavoured) ---
def chip(f, d, duty=0.5, k=8.0):
    return square(f, d, duty) * env(d, 0.002, k)

def arp(notes, step, duty=0.25, k=10):
    return np.concatenate([chip(f, step, duty, k) for f in notes])

save("charge", arp([392, 523, 659, 784, 1047, 1319], 0.07, 0.25, 6), -9)
save("blip", chip(1568, 0.07, 0.25, 30), -12)
save("beep", chip(2093, 0.09, 0.5, 18), -13)
save("error", mix(0.4, [(0, chip(220, 0.18, 0.5, 4), 1), (0.2, chip(165, 0.2, 0.5, 4), 1)]), -9)
save("ping", mix(0.3, [(0, chip(1760, 0.1, 0.25, 20), 1), (0.08, chip(2637, 0.18, 0.25, 14), 0.8)]), -12)
save("wink", mix(0.4, [(0, bell(2637, 0.35, 8), 1), (0.06, bell(3520, 0.3, 10), 0.6)]), -11)
save("fanfare", np.concatenate([chip(f, d, 0.25, 3) for f, d in [(523, 0.12), (523, 0.12), (523, 0.12), (784, 0.5)]]), -9)
save("yelp", square(500 + 900 * (t(0.35) / 0.35) ** 0.6, 0.35, 0.25) * np.minimum(1, (0.35 - t(0.35)) / 0.08), -12)

def chirp():  # baby dragon squeak
    d = 0.22; tt = t(d)
    return sine(1200 + 900 * np.sin(np.pi * tt / d), d) * env(d, 0.003, 9)

save("chirp", mix(0.4, [(0, chirp(), 1), (0.14, chirp(), 0.7)]), -10)

def wobble(d=0.5):  # eggs wobble
    tt = t(d)
    return sine(260 + 60 * np.sin(2 * np.pi * 12 * tt), d) * env(d, 0.003, 6)

save("wobble", wobble(), -10)

def torch(d=0.9):  # fire crackle
    x = bandnoise(d, 0.02, 0.4) * 0.3
    for k in range(10):
        c = bandnoise(0.02, 0.2, 0.9) * env(0.02, 0.0003, 160)
        j = int(rng.uniform(0, d - 0.03) * SR); x[j:j + len(c)] += c * rng.uniform(0.5, 1)
    return x * np.sin(np.pi * t(d) / d)

save("torch", torch(), -8)

def growl(d=0.7):  # low rumble from the dungeon
    tt = t(d)
    x = sum(square(70 * h + 6 * np.sin(2 * np.pi * 7 * tt), d) / h for h in (1, 2))
    return lowpass(x * np.sin(np.pi * tt / d), 0.05)

save("growl", growl(), -8)

def chalk(d=0.35):  # chalk screech-scratch
    tt = t(d)
    n = bandnoise(d, 0.25, 0.9) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 30 * tt)))
    return n * np.sin(np.pi * tt / d)

save("chalk", chalk(), -10)
save("scribble", mix(0.4, [(k * 0.1, chalk(0.08), 1) for k in range(4)]), -11)

def chew():  # munch munch
    return mix(0.45, [(k * 0.2, lowpass(bandnoise(0.12, 0.05, 0.6), 0.5) * env(0.12, 0.005, 25) + thud(0.12, 160, 90) * 0.4, 1) for k in range(2)])

save("chew", chew(), -7)
save("bite", bandnoise(0.2, 0.15, 0.9) * env(0.2, 0.0005, 30) + thud(0.2, 200, 80) * 0.5, -5)
save("panic", mix(0.6, [(k * 0.15, chip(880 if k % 2 else 660, 0.13, 0.5, 6), 1) for k in range(4)]), -12)
save("tomb", thud(0.45, 90, 40) + bandnoise(0.45, 0.05, 0.5) * env(0.45, 0.001, 30) * 0.5, -3)
save("dash", whoosh(0.22), -6)
save("zoom", sine(300 + 1500 * (t(0.35) / 0.35), 0.35) * np.sin(np.pi * t(0.35) / 0.35), -12)
save("flip", mix(0.25, [(0, bandnoise(0.05, 0.2, 0.9) * env(0.05, 0.0005, 80), 1), (0.12, bandnoise(0.05, 0.2, 0.9) * env(0.05, 0.0005, 80), 1)]), -7)
save("clap", bandnoise(0.25, 0.2, 0.95) * env(0.25, 0.0002, 45) + thud(0.25, 300, 120) * 0.6, -1.5)

def creak(d=0.6):
    tt = t(d)
    f = 220 + 90 * np.sin(np.pi * tt / d)
    x = sum(sine(f * h, d) / h for h in range(1, 7)) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 21 * tt)))
    return lowpass(x * np.sin(np.pi * tt / d), 0.3)

save("creak", creak(), -11)

# --- music: 8-bit chiptune (150 bpm): square lead, triangle bass, noise hats; a short gap before the punchline ---
def music(total, gaps):
    N = int(round(SR * total))
    x = np.zeros(N)
    spb = 60 / 150

    def put(sig, at, g=1.0):
        for g0, g1 in gaps:
            if g0 <= at < g1:
                return
        i = int(at * SR); j = min(N, i + len(sig))
        if i < N:
            x[i:j] += sig[: j - i] * g

    A = 220.0
    st = lambda s: A * 2 ** (s / 12)
    prog = [0, -4, -7, -2]  # Am, F, D(m), G-ish adventure turn-around
    lead = [[12, 15, 19, 15, 12, 15, 19, 22], [8, 12, 15, 12, 8, 12, 15, 20], [5, 9, 12, 9, 5, 9, 12, 17], [10, 14, 17, 14, 10, 14, 19, 22]]
    hat = bandnoise(0.04, 0.4, 0.98) * env(0.04, 0.001, 80)
    kick = thud(0.12, 160, 50)
    bar = 0
    while bar * 4 * spb < total:
        tb = bar * 4 * spb
        r = prog[bar % 4]
        for e in range(8):
            at = tb + e * spb / 2
            put(chip(st(lead[bar % 4][e]), spb / 2 * 0.9, 0.25, 5), at, 0.16)
            put(hat, at, 0.25)
            put(tri(st(r - 12 + (7 if e % 4 == 2 else 0)), spb / 2 * 0.95) * env(spb / 2 * 0.95, 0.002, 3), at, 0.5)
        for beat in (0, 2):
            put(kick, tb + beat * spb, 0.5)
        bar += 1
    fi = int(0.02 * SR); x[:fi] *= np.linspace(0, 1, fi)
    fo = int(0.2 * SR); x[-fo:] *= np.linspace(1, 0.6, fo)
    return x

save("music", music(TOTAL, ((GAP0, GAP0 + 0.3),)), -6)
print("ok")
