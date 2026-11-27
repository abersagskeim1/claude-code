"""Synthesise free sound effects and an a light alpine march for Folge 11 "Die Schweiz erobert Liechtenstein" (no external sources, nothing paid).
Usage: python3 sfx.py <out_dir> <total_seconds> <music_gap_start>"""
import sys, wave
import numpy as np

OUT = sys.argv[1]
TOTAL = float(sys.argv[2])
GAP0 = float(sys.argv[3])
SR = 44100
rng = np.random.default_rng(2007)


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

# --- new for Folge 11 (Alps at night) ---
def crunch(d=0.1):  # boot on gravel / snow
    return lowpass(bandnoise(d, 0.08, 0.7), 0.6) * env(d, 0.002, 30) + thud(d, 160, 70) * 0.5

save("step", crunch(0.12), -6)
save("march", mix(1.0, [(k * 0.2, crunch(0.1), 1.0 - 0.15 * (k % 2)) for k in range(5)]), -7)

def rain(d=2.6):
    x = bandnoise(d, 0.15, 0.95) * 0.25
    for k in range(160):
        c = bandnoise(0.012, 0.3, 0.95) * env(0.012, 0.0002, 300)
        j = int(rng.uniform(0, d - 0.02) * SR); x[j:j + len(c)] += c * rng.uniform(0.2, 0.7)
    tt = t(d)
    return x * np.minimum(1, tt / 0.3) * np.minimum(1, (d - tt) / 0.4)

save("rain", rain(), -10)

def wind(d=2.2):
    tt = t(d)
    n = rng.standard_normal(int(SR * d))
    out = np.zeros_like(n); s = 0.0
    a = 0.02 + 0.03 * (0.5 + 0.5 * np.sin(2 * np.pi * 0.9 * tt))
    for i, v in enumerate(n):
        s += a[i] * (v - s); out[i] = s
    return out * np.sin(np.pi * tt / d)

save("wind", wind(), -8)
save("click", bandnoise(0.05, 0.3, 0.95) * env(0.05, 0.0002, 120) + sine(2400, 0.05) * env(0.05, 0.0005, 90) * 0.5, -6)
save("tick", mix(1.2, [(k * 0.09 * (1 + k * 0.06), bandnoise(0.02, 0.4, 0.95) * env(0.02, 0.0002, 200), 1) for k in range(10)]), -9)
save("paper", lowpass(bandnoise(0.35, 0.1, 0.9), 0.7) * np.sin(np.pi * t(0.35) / 0.35) ** 2, -9)
save("brush", lowpass(bandnoise(0.4, 0.05, 0.8), 0.5) * np.sin(np.pi * t(0.4) / 0.4), -8)
save("flap", mix(0.3, [(0, lowpass(bandnoise(0.08, 0.1, 0.8), 0.5) * env(0.08, 0.001, 40), 1), (0.06, thud(0.15, 140, 70), 0.6)]), -7)

def flag(d=0.6):  # cloth flutter
    tt = t(d)
    x = lowpass(bandnoise(d, 0.05, 0.7), 0.5) * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 14 * tt)))
    return x * np.sin(np.pi * tt / d)

save("flag", flag(), -10)
save("flutter", mix(0.5, [(k * 0.07, bandnoise(0.03, 0.2, 0.8) * env(0.03, 0.001, 90), 1) for k in range(7)]), -12)

def snore(d=0.9):  # soft "zzz" from a house: low buzz in and out
    tt = t(d)
    x = sum(square(95 + 10 * tt, d, 0.3) / h for h in (1, 2)) * 0.4 + bandnoise(d, 0.05, 0.4) * 0.6
    return lowpass(x * np.sin(np.pi * tt / d) ** 2, 0.12)

save("snore", snore(), -8)

def ring(d=1.0):  # old telephone bell
    tt = t(d)
    gate = (np.sin(2 * np.pi * 20 * tt) > 0).astype(float)
    return (sine(1100, d) + 0.6 * sine(1650, d)) * (0.4 + 0.6 * gate) * np.minimum(1, (d - tt) / 0.1)

save("ring", ring(), -12)

# --- music: light alpine march (112 bpm): oom-pah bass, glockenspiel melody, soft snare; a short gap before the punchline ---
def music(total, gaps):
    N = int(round(SR * total))
    x = np.zeros(N)
    spb = 60 / 112

    def put(sig, at, g=1.0):
        for g0, g1 in gaps:
            if g0 <= at < g1:
                return
        i = int(at * SR); j = min(N, i + len(sig))
        if i < N:
            x[i:j] += sig[: j - i] * g

    A = 220.0
    st = lambda s: A * 2 ** (s / 12)
    prog = [3, 10, 3, -2]  # C, G, C, F (relative to A) - simple tonic/dominant march
    mel = [[15, 19, 22, 19], [14, 17, 22, 17], [15, 19, 27, 22], [13, 17, 20, 17]]
    snare = bandnoise(0.08, 0.3, 0.95) * env(0.08, 0.001, 45)
    bar = 0
    while bar * 4 * spb < total:
        tb = bar * 4 * spb
        r = prog[bar % 4]
        for beat in range(4):
            at = tb + beat * spb
            if beat % 2 == 0:
                put(tri(st(r - 12), spb * 0.5) * env(spb * 0.5, 0.004, 5), at, 0.6)   # oom
            else:
                put((tri(st(r + 4), spb * 0.3) + tri(st(r + 7), spb * 0.3)) * env(spb * 0.3, 0.003, 12), at, 0.22)  # pah
                put(snare, at, 0.18)
            put(bell(st(mel[bar % 4][beat] + 12), spb * 0.9, 6) * 0.9, at, 0.16 if bar % 2 == 0 else 0.12)
        bar += 1
    fi = int(0.02 * SR); x[:fi] *= np.linspace(0, 1, fi)
    fo = int(0.2 * SR); x[-fo:] *= np.linspace(1, 0.6, fo)
    return x

save("music", music(TOTAL, ((GAP0, GAP0 + 0.3),)), -6)
print("ok")
