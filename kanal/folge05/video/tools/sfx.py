"""Synthesise free sound effects and a light parade march for Folge 5 (no external sources).
Usage: python3 sfx.py <out_dir> <total_seconds>"""
import sys, wave
import numpy as np

OUT = sys.argv[1]
TOTAL = float(sys.argv[2])
SR = 44100
rng = np.random.default_rng(1972)


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

save("whoosh1", whoosh(0.32))
save("whoosh2", whoosh(0.26, True))


def thud(d=0.45, f0=140, f1=45):
    tt = t(d)
    f = f1 + (f0 - f1) * np.exp(-tt * 18)
    body = sine(f, d) * env(d, 0.002, 7)
    click = bandnoise(d, 0.05, 0.6) * env(d, 0.0005, 60) * 0.6
    return body + click

save("impact", thud(0.55, 150, 40), -2)
save("stamp", thud(0.32, 230, 75) + bandnoise(0.32, 0.02, 0.3) * env(0.32, 0.001, 30) * 0.8)


def boing(d=0.5):
    tt = t(d)
    f = 180 + 120 * np.sin(2 * np.pi * 9 * tt) * np.exp(-tt * 4) + 140 * tt
    return (sine(f, d) + 0.3 * sine(2 * f, d)) * env(d, 0.002, 6)

save("boing", boing(), -5)


# --- parade ---
def flap(d=0.45):
    tt = t(d)
    am = 0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 13 * tt))
    return bandnoise(d, 0.04, 0.5) * am * np.sin(np.pi * tt / d)

save("flap", flap(), -6)


def chatter(n=10, gap=0.05):
    x = np.zeros(int(SR * (n * gap + 0.05)))
    for k in range(n):
        c = bandnoise(0.02, 0.2, 0.9) * env(0.02, 0.0002, 250) + sine(2300, 0.02) * env(0.02, 0.0002, 260) * 0.4
        j = int((k * gap + rng.uniform(0, 0.008)) * SR)
        x[j:j + len(c)] += c * rng.uniform(0.6, 1.0)
    return x



def splash(d=0.7):
    tt = t(d)
    body = bandnoise(d, 0.01, 0.35) * np.exp(-tt * 5) * np.minimum(1, tt / 0.02)
    drops = sum(pop(1400 + 300 * k, 600, 0.06) * 0.25 for k in range(1))
    return mix(d, [(0, body, 1.0), (0.12, drops, 1.0), (0.22, pop(1700, 700, 0.05), 0.2), (0.3, pop(1200, 500, 0.05), 0.2)])



def motor(d=0.9):
    x = np.zeros(int(SR * d))
    k = 0
    while k * 0.075 < d - 0.06:
        c = thud(0.06, 120, 70) * 0.8 + bandnoise(0.06, 0.02, 0.2) * env(0.06, 0.001, 40) * 0.4
        j = int(k * 0.075 * SR); x[j:j + len(c)] += c[: len(x) - j]
        k += 1
    return x * np.sin(np.pi * t(d) / d) ** 0.5



def hop():
    d = 0.16
    tt = t(d)
    return sine(300 + 900 * tt / d, d) * env(d, 0.002, 14)

save("hop", hop(), -7)


def tear(d=0.28):
    x = bandnoise(d, 0.15, 0.95)
    tt = t(d)
    am = (rng.random(len(x)) > 0.55).astype(float)
    am = lowpass(am, 0.05)
    return x * am * np.sin(np.pi * tt / d) ** 0.5



def puff(d=0.3):
    return bandnoise(d, 0.01, 0.15) * env(d, 0.01, 10)



def cork():
    return mix(0.25, [(0, pop(600, 1600, 0.09), 1.0), (0, bandnoise(0.05, 0.2, 0.9) * env(0.05, 0.0005, 80), 0.6)])



def glug(n=4):
    parts = []
    for k in range(n):
        d = 0.12; tt = t(d)
        parts.append((k * 0.16, sine(260 + 500 * tt / d, d) * env(d, 0.004, 12), 1.0))
    return mix(n * 0.16 + 0.1, parts)



def bell(f, d=0.8, k0=4.0):
    return sum(sine(f * p, d) * env(d, 0.001, k0 + 2 * i) / (i + 1) for i, p in enumerate([1, 2.0, 3.01, 4.2]))

save("ding", bell(1320, 0.7), -7)
save("ping", bell(1980, 0.35, 9), -9)
save("chime", np.concatenate([bell(f, 0.16, 12)[: int(0.12 * SR)] for f in [1047, 1319, 1568]] + [bell(2093, 0.6, 5)]), -6)


def ticks(n=8, gap=0.13):
    x = np.zeros(int(SR * (n * gap + 0.05)))
    for k in range(n):
        c = sine(2600 + 120 * k, 0.03) * env(0.03, 0.0003, 120)
        j = int(k * gap * SR); x[j:j + len(c)] += c
    return x



def buzz(d=0.45):
    tt = t(d)
    return np.sign(np.sin(2 * np.pi * 140 * tt)) * 0.5 * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 8 * tt))) * env(d, 0.005, 3)



def clink(f0=3100, d=0.6):
    parts = [1, 2.32, 4.25, 6.63]
    x = sum(sine(f0 * p, d) * env(d, 0.0005, 5 + 4 * k) / (k + 1) for k, p in enumerate(parts))
    return x + bandnoise(d, 0.3, 0.95) * env(d, 0.0003, 150) * 0.4



def nope():
    return mix(0.55, [(0, sine(420, 0.18) * env(0.18, 0.005, 6), 1.0), (0.22, sine(300, 0.25) * env(0.25, 0.005, 6), 1.0)])



def sparkle():
    notes = [1760, 2217, 2637, 3520]
    return np.concatenate([sine(f, 0.07) * env(0.07, 0.001, 18) for f in notes] + [sine(4186, 0.3) * env(0.3, 0.001, 10) * 0.6])

save("sparkle", sparkle(), -9)


def rewind(d=0.6):
    tt = t(d)
    f = 500 + 1500 * (tt / d) ** 2
    am = 0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 30 * tt))
    return sine(f, d) * am * np.sin(np.pi * tt / d) * 0.6



def crack():
    return mix(0.4, [(0, bandnoise(0.06, 0.1, 0.9) * env(0.06, 0.0003, 90), 1.0), (0.05, thud(0.3, 200, 60), 0.6)])



def slurp(d=0.5):
    tt = t(d)
    n = rng.standard_normal(int(SR * d))
    out = np.zeros_like(n); s = 0.0
    for i, v in enumerate(n):
        a = 0.05 + 0.25 * (i / len(n)); s += a * (v - s); out[i] = s
    am = 0.6 + 0.4 * np.sin(2 * np.pi * 14 * tt)
    return out * am * np.sin(np.pi * tt / d)





def shing(d=0.6):
    tt = t(d)
    ring = sum(sine(f, d) * env(d, 0.002, 5 + 3 * k) / (k + 1) for k, f in enumerate([2900, 4100, 5600]))
    sweep = bandnoise(d, 0.2, 0.95) * np.exp(-tt * 14) * np.minimum(1, tt / 0.04)
    return ring * 0.7 + sweep * 0.6

save("shing", shing(), -6)
save("tap", clink(1900, 0.25) * 0.8 + thud(0.25, 300, 120) * 0.3, -7)


def fanfare():
    def brass(f, d):
        tt = t(d)
        x = sum(sine(f * h, d) / h ** 0.9 for h in range(1, 8))
        a = np.minimum(1, tt / 0.03) * np.exp(-tt * 1.5)
        return lowpass(x * a, 0.25)
    notes = [(0.0, 392, 0.14), (0.15, 392, 0.14), (0.3, 523, 0.5)]
    parts = [(at, brass(f, d) + 0.6 * brass(f * 1.26, d) * (at > 0.25) + 0.5 * brass(f * 1.5, d) * (at > 0.25), 1.0) for at, f, d in notes]
    return mix(0.85, parts)

save("fanfare", fanfare(), -5)


def creak(d=0.45):
    tt = t(d)
    f = 180 + 90 * np.sin(2 * np.pi * 3 * tt) + 120 * tt / d
    x = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * (0.5 + 0.5 * np.sin(2 * np.pi * 37 * tt))
    return lowpass(x, 0.15) * np.sin(np.pi * tt / d)

save("creak", creak(), -10)


def waddle():
    d = 0.14
    tt = t(d)
    return sine(700 - 300 * tt / d, d) * env(d, 0.004, 18) + sine(1400 - 600 * tt / d, d) * env(d, 0.004, 22) * 0.3

save("waddle", waddle(), -8)


def step():
    return thud(0.2, 170, 60) + bandnoise(0.2, 0.05, 0.5) * env(0.2, 0.001, 45) * 0.5

save("step", step(), -5)


def snare(d=0.18):
    return bandnoise(d, 0.08, 0.9) * env(d, 0.0008, 22) + sine(190, d) * env(d, 0.001, 30) * 0.5


def drumroll(d=1.6):
    x = np.zeros(int(SR * (d + 0.3)))
    k = 0
    while k * 0.045 < d:
        g = 0.35 + 0.65 * (k * 0.045 / d)
        s = snare(0.1)
        j = int(k * 0.045 * SR); x[j:j + len(s)] += s * g * rng.uniform(0.8, 1.0)
        k += 1
    j = int(d * SR); hit = snare(0.3) * 1.6 + thud(0.3, 120, 45)
    x[j:j + len(hit)] += hit[: len(x) - j]
    return x

save("drumroll", drumroll(), -3)


# --- music: light parade march, 112 bpm: snare, tuba-like bass, glockenspiel; pause for the drum roll before the twist ---
def march(total, gaps=((30.25, 31.95),)):
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

    kick = thud(0.2, 120, 50) * 0.6
    sn = snare(0.14) * 0.22

    def tuba(f, d=0.32):
        tt = t(d)
        y = sum(sine(f * h, d) / h ** 1.4 for h in range(1, 5))
        return y * np.minimum(1, tt / 0.015) * np.exp(-tt * 6) * 0.3

    def glock(f, d=0.45):
        return (sine(f, d) + 0.25 * sine(2.76 * f, d)) * env(d, 0.001, 7) * 0.12

    roots = [98.0, 130.8, 98.0, 146.8]  # G2 C3 G2 D3
    mel = [784, 0, 659, 784, 880, 784, 659, 587, 523, 587, 659, 784, 659, 0, 587, 0]
    b = 0
    while b * spb < total:
        tb = b * spb
        bar = (b // 4) % 4
        put(kick, tb, 1.0 if b % 2 == 0 else 0.6)
        if b % 2 == 1:
            put(sn, tb)
        put(sn * 0.45, tb + spb * 0.75)
        put(tuba(roots[bar] if b % 2 == 0 else roots[bar] * 1.5), tb)
        for h in range(2):
            m = mel[(b * 2 + h) % 16]
            if m:
                put(glock(m * (1.0 if bar != 1 else 1.122)), tb + h * spb / 2)
        b += 1
    fi = int(0.02 * SR); x[:fi] *= np.linspace(0, 1, fi)
    fo = int(0.25 * SR); x[-fo:] *= np.linspace(1, 0.5, fo)
    return x

save("march", march(TOTAL), -6)
print("ok")
