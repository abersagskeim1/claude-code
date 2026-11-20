"""Synthesise free sound effects and a light 'polar' tune for Folge 4 (no external sources).
Usage: python3 sfx.py <out_dir> <total_seconds>"""
import sys, wave
import numpy as np

OUT = sys.argv[1]
TOTAL = float(sys.argv[2])
SR = 44100
rng = np.random.default_rng(1984)


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


# --- arctic ---
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

save("chatter", chatter(), -6)


def splash(d=0.7):
    tt = t(d)
    body = bandnoise(d, 0.01, 0.35) * np.exp(-tt * 5) * np.minimum(1, tt / 0.02)
    drops = sum(pop(1400 + 300 * k, 600, 0.06) * 0.25 for k in range(1))
    return mix(d, [(0, body, 1.0), (0.12, drops, 1.0), (0.22, pop(1700, 700, 0.05), 0.2), (0.3, pop(1200, 500, 0.05), 0.2)])

save("splash", splash(), -4)


def motor(d=0.9):
    x = np.zeros(int(SR * d))
    k = 0
    while k * 0.075 < d - 0.06:
        c = thud(0.06, 120, 70) * 0.8 + bandnoise(0.06, 0.02, 0.2) * env(0.06, 0.001, 40) * 0.4
        j = int(k * 0.075 * SR); x[j:j + len(c)] += c[: len(x) - j]
        k += 1
    return x * np.sin(np.pi * t(d) / d) ** 0.5

save("motor", motor(), -6)


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

save("tear", tear(), -5)


def puff(d=0.3):
    return bandnoise(d, 0.01, 0.15) * env(d, 0.01, 10)

save("puff", puff(), -6)


def cork():
    return mix(0.25, [(0, pop(600, 1600, 0.09), 1.0), (0, bandnoise(0.05, 0.2, 0.9) * env(0.05, 0.0005, 80), 0.6)])

save("cork", cork(), -5)


def glug(n=4):
    parts = []
    for k in range(n):
        d = 0.12; tt = t(d)
        parts.append((k * 0.16, sine(260 + 500 * tt / d, d) * env(d, 0.004, 12), 1.0))
    return mix(n * 0.16 + 0.1, parts)

save("glug", glug(), -7)


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

save("ticks", ticks(), -8)


def buzz(d=0.45):
    tt = t(d)
    return np.sign(np.sin(2 * np.pi * 140 * tt)) * 0.5 * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 8 * tt))) * env(d, 0.005, 3)

save("buzz", lowpass(buzz(), 0.2), -9)


def clink(f0=3100, d=0.6):
    parts = [1, 2.32, 4.25, 6.63]
    x = sum(sine(f0 * p, d) * env(d, 0.0005, 5 + 4 * k) / (k + 1) for k, p in enumerate(parts))
    return x + bandnoise(d, 0.3, 0.95) * env(d, 0.0003, 150) * 0.4

save("clink", clink(), -4)
save("clinkS", clink(2500, 0.3), -8)


def nope():
    return mix(0.55, [(0, sine(420, 0.18) * env(0.18, 0.005, 6), 1.0), (0.22, sine(300, 0.25) * env(0.25, 0.005, 6), 1.0)])

save("nope", nope(), -6)


def sparkle():
    notes = [1760, 2217, 2637, 3520]
    return np.concatenate([sine(f, 0.07) * env(0.07, 0.001, 18) for f in notes] + [sine(4186, 0.3) * env(0.3, 0.001, 10) * 0.6])

save("sparkle", sparkle(), -9)


def rewind(d=0.6):
    tt = t(d)
    f = 500 + 1500 * (tt / d) ** 2
    am = 0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 30 * tt))
    return sine(f, d) * am * np.sin(np.pi * tt / d) * 0.6

save("rewind", rewind(), -9)


def crack():
    return mix(0.4, [(0, bandnoise(0.06, 0.1, 0.9) * env(0.06, 0.0003, 90), 1.0), (0.05, thud(0.3, 200, 60), 0.6)])

save("crack", crack(), -4)


def slurp(d=0.5):
    tt = t(d)
    n = rng.standard_normal(int(SR * d))
    out = np.zeros_like(n); s = 0.0
    for i, v in enumerate(n):
        a = 0.05 + 0.25 * (i / len(n)); s += a * (v - s); out[i] = s
    am = 0.6 + 0.4 * np.sin(2 * np.pi * 14 * tt)
    return out * am * np.sin(np.pi * tt / d)

save("slurp", slurp(), -6)


# --- music: light 'polar' tune, 100 bpm, celesta + pizzicato bass + shaker, pauses before the punchline ---
def polar(total, gaps=((33.6, 34.35),)):
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

    kick = thud(0.22, 130, 50) * 0.7
    shk = bandnoise(0.05, 0.5, 0.98) * env(0.05, 0.004, 60) * 0.12

    def pluck(f, d=0.3):
        return (sine(f, d) + 0.4 * sine(2 * f, d)) * env(d, 0.002, 11) * 0.34

    def celesta(f, d=0.35):
        return (sine(f, d) + 0.35 * sine(2 * f, d) + 0.15 * sine(3 * f, d)) * env(d, 0.001, 9) * 0.11

    roots = [146.8, 146.8, 196.0, 220.0]          # D3 D3 G3 A3
    mel = [587, 740, 880, 740, 659, 587, 659, 740, 880, 988, 880, 740, 659, 740, 587, 0]
    b = 0
    while b * spb < total:
        tb = b * spb
        bar = (b // 4) % 4
        if b % 4 in (0, 2):
            put(kick, tb)
        for h in range(4):
            put(shk * (1.0 if h % 2 else 0.6), tb + h * spb / 4)
        put(pluck(roots[bar] / 2), tb)
        put(pluck(roots[bar] * 0.75 / 2, 0.2), tb + spb * 0.5)
        for h in range(2):
            m = mel[(b * 2 + h) % 16]
            if m:
                put(celesta(m * (roots[bar] / 146.8) ** 0.25), tb + h * spb / 2)
        b += 1
    fi = int(0.02 * SR); x[:fi] *= np.linspace(0, 1, fi)
    fo = int(0.25 * SR); x[-fo:] *= np.linspace(1, 0.5, fo)
    return x

save("polar", polar(TOTAL), -6)
print("ok")
