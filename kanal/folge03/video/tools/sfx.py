"""Synthesise free sound effects and a light funk beat for Folge 3 (no external sources).
Usage: python3 sfx.py <out_dir> <total_seconds>"""
import sys, wave
import numpy as np

OUT = sys.argv[1]
TOTAL = float(sys.argv[2])
SR = 44100
rng = np.random.default_rng(2010)


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


# --- cartoon basics ---
def pop(f0, f1, d=0.12):
    tt = t(d)
    f = f1 + (f0 - f1) * np.exp(-tt * 40)
    return sine(f, d) * env(d, 0.001, 35)

save("pop1", pop(850, 280))
save("pop2", pop(1150, 400, 0.1))


def whoosh(d, rev=False):
    n = rng.standard_normal(int(SR * d))
    tt = t(d)
    out = np.zeros_like(n); s = 0.0
    for i, v in enumerate(n):
        a = 0.02 + 0.25 * (i / len(n))
        s += a * (v - s); out[i] = s
    e = np.sin(np.pi * tt / d) ** 2
    if rev:
        e = e * (tt / d) ** 0.5
    return out * e

save("whoosh1", whoosh(0.35))
save("whoosh2", whoosh(0.28, True))


def thud(d=0.45, f0=140, f1=45):
    tt = t(d)
    f = f1 + (f0 - f1) * np.exp(-tt * 18)
    body = sine(f, d) * env(d, 0.002, 7)
    click = bandnoise(d, 0.05, 0.6) * env(d, 0.0005, 60) * 0.6
    return body + click

save("impact", thud(0.6, 160, 42), -2)
save("stamp", thud(0.35, 220, 70) + bandnoise(0.35, 0.02, 0.3) * env(0.35, 0.001, 30) * 0.8)


# --- metal / money ---
def clink(f0=2600, d=0.35):
    parts = [1, 2.76, 5.4, 8.93]
    x = sum(sine(f0 * p, d) * env(d, 0.0005, 9 + 5 * k) / (k + 1) for k, p in enumerate(parts))
    return x + bandnoise(d, 0.3, 0.95) * env(d, 0.0003, 120) * 0.5

save("coin", clink(), -6)
save("coin2", clink(3100, 0.3), -7)


def kaching():
    bell = sum(sine(f, 0.9) * env(0.9, 0.001, 3.5 + k) / (k + 1) for k, f in enumerate([1568, 2093, 3136, 4186]))
    drawer = thud(0.25, 300, 90) * 0.7
    x = np.zeros(int(SR * 1.0))
    x[: len(drawer)] += drawer
    i = int(0.08 * SR)
    x[i:i + len(bell)] += bell[: len(x) - i]
    for k in range(4):
        c = clink(2400 + 300 * k, 0.25) * 0.4
        j = int((0.15 + 0.07 * k) * SR)
        x[j:j + len(c)] += c[: len(x) - j]
    return x

save("kaching", kaching(), -4)


# --- keyboard typing: short clicky bursts ---
def typing(n=9, gap=0.075):
    x = np.zeros(int(SR * (n * gap + 0.1)))
    for k in range(n):
        d = 0.035
        c = bandnoise(d, 0.15, 0.9) * env(d, 0.0003, 160) + sine(1800 + 200 * (k % 3), d) * env(d, 0.0003, 200) * 0.3
        j = int((k * gap + rng.uniform(0, 0.015)) * SR)
        x[j:j + len(c)] += c * rng.uniform(0.6, 1.0)
    return x

save("typing", typing(), -6)

# --- phone ring: two-tone trill ---
def ring(d=0.9):
    tt = t(d)
    trill = (np.sin(2 * np.pi * 22 * tt) > 0).astype(float) * 0.7 + 0.3
    x = (sine(1300, d) + sine(1700, d) * 0.7) * trill
    e = np.ones_like(tt); e[int(0.38 * SR):int(0.5 * SR)] = 0
    return x * e * np.exp(-tt * 0.8)

save("ring", ring(), -8)

# --- receipt printer: fast stepper ticks ---
def printer(d=0.9):
    x = bandnoise(d, 0.05, 0.6) * 0.15
    for k in range(int(d / 0.028)):
        c = bandnoise(0.012, 0.2, 0.9) * env(0.012, 0.0002, 300)
        j = int(k * 0.028 * SR)
        x[j:j + len(c)] += c
    return x * np.minimum(1, (t(d) / 0.05))

save("printer", printer(), -8)

# --- rising slide whistle (chart goes up) ---
def rise(d=0.9, f0=300, f1=1400):
    tt = t(d)
    f = f0 * (f1 / f0) ** (tt / d)
    vib = 1 + 0.02 * np.sin(2 * np.pi * 7 * tt)
    return (sine(f * vib, d) + 0.3 * sine(2 * f * vib, d)) * np.sin(np.pi * tt / d) ** 0.6

save("rise", rise(), -8)
save("rise2", rise(1.2, 400, 2200), -8)

# --- chomp: crunchy bite ---
def chomp():
    d = 0.18
    return bandnoise(d, 0.05, 0.5) * env(d, 0.001, 25) + thud(d, 200, 90) * 0.5

save("chomp", chomp(), -5)

# --- cough: two breathy bursts ---
def cough():
    out = []
    for k in range(3):
        d = 0.16
        b = bandnoise(d, 0.04, 0.4) * env(d, 0.004, 18) + sine(180 - 20 * k, d) * env(d, 0.004, 22) * 0.4
        out += [b, np.zeros(int(0.07 * SR))]
    return np.concatenate(out)

save("cough", cough(), -4)

# --- safe door: heavy clunk + latch click ---
def safe():
    a = thud(0.5, 110, 38)
    c = bandnoise(0.05, 0.3, 0.95) * env(0.05, 0.0003, 120)
    x = np.zeros(int(SR * 0.6))
    x[: len(a)] += a
    j = int(0.18 * SR); x[j:j + len(c)] += c * 0.8
    return x

save("safe", safe(), -3)

# --- sparkle: high soft arpeggio ---
def sparkle():
    notes = [1760, 2217, 2637, 3520]
    return np.concatenate([sine(f, 0.07) * env(0.07, 0.001, 18) for f in notes] + [sine(4186, 0.3) * env(0.3, 0.001, 10) * 0.6])

save("sparkle", sparkle(), -9)


# --- funky beat, 112 bpm, drops out before the punchline ---
def beat(total, gaps=((27.95, 28.2),)):
    N = int(round(SR * total))
    x = np.zeros(N)
    spb = 60 / 112
    kick = thud(0.25, 150, 48) * 0.85
    clap = bandnoise(0.12, 0.1, 0.8) * env(0.12, 0.001, 30) * 0.45
    hat = bandnoise(0.03, 0.55, 0.98) * env(0.03, 0.0005, 120) * 0.14

    def bass(f, d=0.22):
        return (sine(f, d) + 0.35 * sine(2 * f, d)) * env(d, 0.003, 9) * 0.32

    def marimba(f, d=0.18):
        return (sine(f, d) + 0.25 * sine(4 * f, d)) * env(d, 0.001, 22) * 0.1

    roots = [98.0, 98.0, 130.8, 116.5]          # G2 G2 C3 Bb2
    mel = [587, 784, 698, 587, 523, 587, 466, 523]

    def put(sig, at):
        for g0, g1 in gaps:
            if g0 <= at < g1:
                return
        i = int(at * SR)
        j = min(N, i + len(sig))
        if i < N:
            x[i:j] += sig[: j - i]

    b = 0
    while b * spb < total:
        tb = b * spb
        bar = (b // 4) % 4
        if b % 4 in (0, 2) or (b % 8 == 7):
            put(kick, tb)
        if b % 2 == 1:
            put(clap, tb)
        put(hat, tb + spb / 2)
        put(hat * 0.6, tb + spb * 0.75)
        put(bass(roots[bar]), tb)
        if b % 2 == 0:
            put(bass(roots[bar] * 1.5, 0.12), tb + spb * 0.75)
        put(marimba(mel[b % 8] * (roots[bar] / 98.0) ** 0.5), tb + spb / 2)
        b += 1
    fi = int(0.02 * SR); x[:fi] *= np.linspace(0, 1, fi)
    fo = int(0.3 * SR); x[-fo:] *= np.linspace(1, 0.4, fo)
    return x

save("beat", beat(TOTAL), -6)
print("ok")
