"""Synthesise free sound effects and a chiptune loop for Folge 6 (no external sources, nothing paid).
Usage: python3 sfx.py <out_dir> <total_seconds>"""
import sys, wave
import numpy as np

OUT = sys.argv[1]
TOTAL = float(sys.argv[2])
SR = 44100
rng = np.random.default_rng(2014)


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


# --- cartoon basics ---
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


# --- 8-bit game sounds (square waves) ---
def blip(f, d=0.07, duty=0.25):
    return square(f, d, duty) * env(d, 0.001, 30) * 0.5

save("blip1", blip(988), -9)
save("blip2", blip(1319, 0.06), -9)
save("blip3", np.concatenate([blip(784, 0.05), blip(1175, 0.07)]), -9)
save("select", np.concatenate([blip(1047, 0.05, 0.5), blip(1568, 0.09, 0.5)]), -8)
save("click", thud(0.12, 400, 160) * 0.7 + bandnoise(0.12, 0.1, 0.8) * env(0.12, 0.0005, 80) * 0.5, -6)


def bonk():
    d = 0.22
    tt = t(d)
    return square(520 - 300 * tt / d, d, 0.5) * env(d, 0.001, 16) * 0.5 + thud(d, 200, 90) * 0.6

save("bonk", bonk(), -6)


def jump():
    d = 0.22
    tt = t(d)
    return square(300 + 900 * (tt / d) ** 0.7, d, 0.25) * env(d, 0.002, 9) * 0.5

save("jump", jump(), -9)


def steps(n=8, gap=0.14):
    parts = [(k * gap, square(220 if k % 2 else 180, 0.05, 0.5) * env(0.05, 0.001, 50) * 0.5, 1.0) for k in range(n)]
    return mix(n * gap + 0.06, parts)

save("steps", steps(), -10)


def spin(d=0.8):
    tt = t(d)
    f = 600 + 400 * np.sin(2 * np.pi * 5 * tt)
    return square(f, d, 0.25) * np.sin(np.pi * tt / d) * 0.4

save("spin", spin(), -11)


def menu():
    return np.concatenate([blip(660, 0.05, 0.5), blip(880, 0.05, 0.5), blip(1320, 0.08, 0.5)])

save("menu", menu(), -9)


def chatter(n=16, gap=0.045, d=0.8):
    x = np.zeros(int(SR * (n * gap + 0.08)))
    for k in range(n):
        c = bandnoise(0.02, 0.2, 0.9) * env(0.02, 0.0002, 250) + square(1800 + 300 * (k % 3), 0.02, 0.5) * env(0.02, 0.0002, 260) * 0.25
        j = int((k * gap + rng.uniform(0, 0.015)) * SR)
        x[j:j + len(c)] += c[: len(x) - j] * rng.uniform(0.5, 1.0)
    return x

save("chatter", chatter(), -8)


def creak(d=0.45):
    tt = t(d)
    f = 180 + 90 * np.sin(2 * np.pi * 3 * tt) + 120 * tt / d
    x = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * (0.5 + 0.5 * np.sin(2 * np.pi * 37 * tt))
    return lowpass(x, 0.15) * np.sin(np.pi * tt / d)

save("creak", creak(), -10)


def ticks(n=1):
    return sine(2600, 0.04) * env(0.04, 0.0003, 120) + thud(0.04, 900, 400) * 0.3

save("tick", ticks(), -8)


def bell(f, d=0.8, k0=4.0):
    return sum(sine(f * p, d) * env(d, 0.001, k0 + 2 * i) / (i + 1) for i, p in enumerate([1, 2.0, 3.01, 4.2]))

save("ding", bell(1320, 0.7), -7)
save("ping", bell(1980, 0.35, 9), -9)
save("chime", np.concatenate([bell(f, 0.16, 12)[: int(0.12 * SR)] for f in [1047, 1319, 1568]] + [bell(2093, 0.6, 5)]), -6)


def sparkle():
    notes = [1760, 2217, 2637, 3520]
    return np.concatenate([sine(f, 0.07) * env(0.07, 0.001, 18) for f in notes] + [sine(4186, 0.3) * env(0.3, 0.001, 10) * 0.6])

save("sparkle", sparkle(), -9)


def choir(d=1.4):
    tt = t(d)
    x = np.zeros_like(tt)
    for f in [392, 494, 587, 784]:
        vib = 1 + 0.006 * np.sin(2 * np.pi * 5.5 * tt)
        x += sum(sine(f * h * vib, d) / h ** 1.6 for h in range(1, 5))
    a = np.minimum(1, tt / 0.25) * np.minimum(1, (d - tt) / 0.5)
    return lowpass(x * a, 0.2)

save("choir", choir(), -8)


def riffle(n=7, gap=0.12):
    parts = [(k * gap, bandnoise(0.06, 0.05, 0.7) * env(0.06, 0.001, 45), 1.0) for k in range(n)]
    return mix(n * gap + 0.1, parts)

save("riffle", riffle(), -6)


def shing(d=0.6):
    tt = t(d)
    ring = sum(sine(f, d) * env(d, 0.002, 5 + 3 * k) / (k + 1) for k, f in enumerate([2900, 4100, 5600]))
    sweep = bandnoise(d, 0.2, 0.95) * np.exp(-tt * 14) * np.minimum(1, tt / 0.04)
    return ring * 0.7 + sweep * 0.6

save("shing", shing(), -6)


def confetti(d=0.7):
    x = np.zeros(int(SR * d))
    for k in range(14):
        c = pop(rng.uniform(1500, 2600), 700, 0.05)
        j = int(rng.uniform(0, d - 0.06) * SR); x[j:j + len(c)] += c * rng.uniform(0.4, 1.0)
    return x

save("confetti", confetti(), -9)


def fanfare():
    notes = [(0.0, 523, 0.11), (0.12, 659, 0.11), (0.24, 784, 0.11), (0.36, 1047, 0.5)]
    parts = [(at, (square(f, d, 0.5) * 0.5 + square(f * 1.5, d, 0.25) * 0.25 * (at > 0.3)) * np.minimum(1, t(d) / 0.01) * np.exp(-t(d) * 2.2), 1.0) for at, f, d in notes]
    return mix(0.9, parts)

save("fanfare", fanfare(), -6)


# --- music: light chiptune, 128 bpm; pulse lead, triangle bass, noise hats; a short gap before the punchline ---
def chiptune(total, gaps=((30.95, 31.4),)):
    N = int(round(SR * total))
    x = np.zeros(N)
    spb = 60 / 128

    def put(sig, at, g=1.0):
        for g0, g1 in gaps:
            if g0 <= at < g1:
                return
        i = int(at * SR); j = min(N, i + len(sig))
        if i < N:
            x[i:j] += sig[: j - i] * g

    hat = bandnoise(0.03, 0.4, 0.98) * env(0.03, 0.0005, 120) * 0.12
    kick = thud(0.16, 160, 50) * 0.5

    def bass(f, d=0.2):
        return tri(f, d) * np.minimum(1, t(d) / 0.005) * np.exp(-t(d) * 4) * 0.35

    def lead(f, d=0.18):
        return square(f, d, 0.25) * np.minimum(1, t(d) / 0.004) * np.exp(-t(d) * 7) * 0.09

    roots = [110.0, 87.3, 98.0, 82.4]  # A2 F2 G2 E2
    mel = [880, 0, 784, 659, 0, 659, 784, 880, 1047, 0, 880, 784, 659, 0, 587, 659]
    b = 0
    while b * spb < total:
        tb = b * spb
        bar = (b // 4) % 4
        if b % 2 == 0:
            put(kick, tb)
        put(hat, tb + spb / 2)
        put(bass(roots[bar]), tb)
        put(bass(roots[bar] * 2, 0.12), tb + spb / 2, 0.6)
        for h in range(2):
            m = mel[(b * 2 + h) % 16]
            if m:
                put(lead(m * (1.0 if bar != 1 else 0.8909)), tb + h * spb / 2)
        b += 1
    fi = int(0.02 * SR); x[:fi] *= np.linspace(0, 1, fi)
    fo = int(0.2 * SR); x[-fo:] *= np.linspace(1, 0.6, fo)
    return x

save("chiptune", chiptune(TOTAL), -6)
print("ok")
