"""Synthesise free sound effects and a desert-western groove for Folge 12 "Atari vergraebt Spiele in der Wueste" (no external sources, nothing paid).
Usage: python3 sfx.py <out_dir> <total_seconds> <music_gap_start>"""
import sys, wave
import numpy as np

OUT = sys.argv[1]
TOTAL = float(sys.argv[2])
GAP0 = float(sys.argv[3])
SR = 44100
rng = np.random.default_rng(1983)


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
save("zoom", sine(300 + 1500 * (t(0.35) / 0.35), 0.35) * np.sin(np.pi * t(0.35) / 0.35), -12)
save("error", mix(0.4, [(0, sine(330, 0.18) * env(0.18, 0.002, 4), 1), (0.2, sine(247, 0.2) * env(0.2, 0.002, 4), 1)]), -9)

# --- new for Folge 12 (desert at sunset, landfill, excavator) ---
def wind(d=2.4):
    tt = t(d)
    n = rng.standard_normal(int(SR * d))
    out = np.zeros_like(n); s = 0.0
    a = 0.015 + 0.025 * (0.5 + 0.5 * np.sin(2 * np.pi * 0.7 * tt))
    for i, v in enumerate(n):
        s += a[i] * (v - s); out[i] = s
    return out * np.sin(np.pi * tt / d)

save("wind", wind(), -9)
save("click", bandnoise(0.05, 0.3, 0.95) * env(0.05, 0.0002, 120) + sine(2400, 0.05) * env(0.05, 0.0005, 90) * 0.5, -6)
save("tick", bandnoise(0.03, 0.4, 0.95) * env(0.03, 0.0002, 160), -10)
save("paper", lowpass(bandnoise(0.35, 0.1, 0.9), 0.7) * np.sin(np.pi * t(0.35) / 0.35) ** 2, -9)
save("brush", lowpass(bandnoise(0.4, 0.05, 0.8), 0.5) * np.sin(np.pi * t(0.4) / 0.4), -8)
save("thud", thud(0.35, 120, 55), -5)

def clack(d=0.08):  # plastic case hitting plastic
    return (sine(1900, d) * 0.5 + sine(2900, d) * 0.3 + bandnoise(d, 0.3, 0.95)) * env(d, 0.0003, 70)

save("clack", clack(), -8)
save("rattle", mix(0.6, [(k * 0.05 + rng.uniform(0, 0.02), clack(0.06), rng.uniform(0.5, 1.0)) for k in range(10)]), -9)

def sand(d=0.5):  # sand trickling
    x = np.zeros(int(SR * d))
    for k in range(260):
        g = bandnoise(0.006, 0.4, 0.95) * env(0.006, 0.0001, 500)
        j = int(rng.uniform(0, d - 0.01) * SR); x[j:j + len(g)] += g * rng.uniform(0.2, 1.0)
    tt = t(d)
    return x * np.sin(np.pi * tt / d)

save("sand", sand(), -10)

def dig(d=0.3):  # shovel into sand: scrape + soft thump
    tt = t(d)
    scrape = lowpass(bandnoise(d, 0.08, 0.7), 0.6) * np.exp(-((tt - 0.08) / 0.06) ** 2)
    return scrape + thud(d, 110, 60) * 0.5

save("dig", dig(), -6)

def engine(d, f0, wob=6.0, grit=0.3):
    tt = t(d)
    f = f0 * (1 + 0.04 * np.sin(2 * np.pi * wob * tt))
    x = square(f, d, 0.35) * 0.5 + sine(f * 0.5, d) * 0.6 + bandnoise(d, 0.02, 0.3) * grit
    return lowpass(x, 0.08) * np.minimum(1, tt / 0.15) * np.minimum(1, (d - tt) / 0.3)

save("truck", engine(2.1, 52, 7, 0.4), -6)

def digger(d=2.3):
    tt = t(d)
    whine = sine(380 + 140 * np.sin(2 * np.pi * 0.55 * tt), d) * 0.25 * np.minimum(1, tt / 0.3) * np.minimum(1, (d - tt) / 0.3)
    return engine(d, 44, 9, 0.5) + whine

save("digger", digger(), -6)

def buzz(d=1.0):  # flies
    tt = t(d)
    f = 210 + 40 * np.sin(2 * np.pi * 3.1 * tt) + 25 * np.sin(2 * np.pi * 7.3 * tt)
    x = square(f, d, 0.2) * 0.6 + square(f * 1.07, d, 0.25) * 0.4
    return lowpass(x, 0.18) * (0.6 + 0.4 * np.sin(2 * np.pi * 2.0 * tt)) * np.sin(np.pi * tt / d)

save("buzz", buzz(), -14)

def cricket(d=1.2):  # desert night insect
    x = np.zeros(int(SR * d))
    for k in range(4):
        at = 0.1 + k * 0.28
        for j in range(5):
            g = sine(4200, 0.012) * env(0.012, 0.0005, 150)
            i = int((at + j * 0.022) * SR); x[i:i + len(g)] += g
    return x

save("cricket", cricket(), -14)

def womp():  # sad trombone-ish "womp womp"
    parts = []
    for k, (f0, d) in enumerate([(233, 0.32), (220, 0.32), (207, 0.32), (196, 0.7)]):
        tt = t(d)
        f = f0 * (1 + 0.012 * np.sin(2 * np.pi * 5.5 * tt)) * (1 - (0.06 * tt / d if k == 3 else 0))
        x = sum(sine(f * h, d) / h ** 0.9 for h in range(1, 7))
        parts.append((k * 0.34, lowpass(x, 0.2) * np.minimum(1, tt / 0.03) * np.minimum(1, (d - tt) / 0.08), 1))
    return mix(1.75, parts)

save("womp", womp(), -9)

def deflate(d=0.6):
    tt = t(d)
    return sine(500 - 380 * (tt / d), d) * (0.5 + 0.5 * np.sin(2 * np.pi * 18 * tt)) * np.sin(np.pi * tt / d)

save("deflate", deflate(), -13)
save("shine", np.concatenate([sine(f, 0.06) * env(0.06, 0.001, 14) for f in [2093, 2637, 3136, 4186]]) , -12)

def tada():
    return mix(1.0, [(0, sum(bell(f, 0.9, 3) for f in (523, 659, 784)), 0.6), (0.14, sum(bell(f, 0.85, 3) for f in (659, 784, 1047)), 0.8)])

save("tada", tada(), -7)
save("type", mix(1.6, [(k * 0.13 + rng.uniform(0, 0.03), bandnoise(0.025, 0.3, 0.9) * env(0.025, 0.0002, 140), rng.uniform(0.5, 1)) for k in range(11)]), -12)

# --- music: slow desert-western groove (100 bpm): plucked guitar bass + melody (A minor), shaker, soft kick; short gap before the punchline ---
def pluck(f, d, bright=0.5):
    tt = t(d)
    return sum(sine(f * h, d) * np.exp(-tt * (3 + h * 2.2)) * (bright ** (h - 1)) for h in range(1, 7)) * env(d, 0.002, 0.1)

def music(total, gaps):
    N = int(round(SR * total))
    x = np.zeros(N)
    spb = 60 / 100

    def put(sig, at, g=1.0):
        for g0, g1 in gaps:
            if g0 <= at < g1:
                return
        i = int(at * SR); j = min(N, i + len(sig))
        if i < N:
            x[i:j] += sig[: j - i] * g

    st = lambda s: 220.0 * 2 ** (s / 12)
    prog = [0, -2, -4, -5]  # Am, G, F, E
    mel = [[12, 15, 19, 15], [10, 14, 17, 14], [8, 12, 15, 12], [7, 11, 14, 11]]
    shaker = bandnoise(0.05, 0.5, 0.98) * env(0.05, 0.004, 60)
    kick = thud(0.25, 110, 45)
    bar = 0
    while bar * 4 * spb < total:
        tb = bar * 4 * spb
        r = prog[bar % 4]
        for beat in range(4):
            at = tb + beat * spb
            put(pluck(st(r - 12), spb * 0.9, 0.35), at, 0.55 if beat % 2 == 0 else 0.3)
            if beat in (0, 2):
                put(kick, at, 0.35)
            put(shaker, at + spb / 2, 0.12); put(shaker, at, 0.07)
            if (bar + beat) % 2 == 0 or beat == 3:
                put(pluck(st(mel[bar % 4][beat]), spb * 1.2, 0.6), at + (spb * 0.5 if beat == 3 else 0), 0.22)
        bar += 1
    fi = int(0.02 * SR); x[:fi] *= np.linspace(0, 1, fi)
    fo = int(0.2 * SR); x[-fo:] *= np.linspace(1, 0.6, fo)
    return x

save("music", music(TOTAL, ((GAP0, GAP0 + 0.3),)), -6)
print("ok")
