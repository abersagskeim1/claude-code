"""Synthesise free sound effects and a musette waltz for Folge 8 "Der Kuchen-Krieg" (no external sources, nothing paid).
Usage: python3 sfx.py <out_dir> <total_seconds> <music_gap_start>"""
import sys, wave
import numpy as np

OUT = sys.argv[1]
TOTAL = float(sys.argv[2])
GAP0 = float(sys.argv[3])
SR = 44100
rng = np.random.default_rng(1838)


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

# --- new for Folge 8 ---
def coin(f=2600):
    d = 0.35
    return sum(sine(f * p, d) * env(d, 0.0005, 14 + 6 * i) / (i + 1) for i, p in enumerate([1, 1.52, 2.31, 3.1]))


def kaching():  # cash register: drawer clack + bell + coin
    d = 0.9
    clack = bandnoise(0.08, 0.1, 0.7) * env(0.08, 0.0005, 70)
    return mix(d, [(0.0, clack, 0.8), (0.05, bell(2093, 0.8, 3), 0.7), (0.1, coin(2900), 0.4)])

save("kaching", kaching(), -4)


def ratchet(d=0.6):  # receipt printing / rolling out: fast clicks with paper hiss
    x = np.zeros(int(SR * d))
    k = 0
    while k * 0.028 < d - 0.03:
        c = bandnoise(0.012, 0.2, 0.9) * env(0.012, 0.0003, 200)
        j = int(k * 0.028 * SR); x[j:j + len(c)] += c
        k += 1
    return x + bandnoise(d, 0.3, 0.95) * 0.15 * np.sin(np.pi * t(d) / d)

save("ratchet", ratchet(), -7)


def paper():  # one sheet lands on the pile
    d = 0.22
    return bandnoise(d, 0.1, 0.7) * env(d, 0.004, 25) + sine(160 - 80 * t(d) / d, d) * env(d, 0.002, 30) * 0.5

save("paper", paper(), -6)


def crumbs(d=0.5):  # tiny crunchy clicks
    x = np.zeros(int(SR * d))
    for k in range(18):
        c = bandnoise(0.008, 0.4, 0.98) * env(0.008, 0.0002, 300)
        j = int(rng.uniform(0, d - 0.01) * SR); x[j:j + len(c)] += c * rng.uniform(0.3, 1)
    return x

save("crumbs", crumbs(), -9)


def cough():  # cartoon cough: three short filtered bursts with a voiced tone
    parts = []
    for k, f in enumerate([220, 200, 240]):
        d = 0.13
        burst = bandnoise(d, 0.03, 0.35) * env(d, 0.004, 22) + sine(f, d) * env(d, 0.004, 18) * 0.5
        parts.append((k * 0.19, burst, 1.0 - 0.15 * k))
    return mix(0.7, parts)

save("cough", cough(), -5)


def munch():  # biting a tart: crunch + soft squelch
    d = 0.25
    return bandnoise(d, 0.15, 0.9) * env(d, 0.001, 30) * 0.8 + sine(120 + 60 * np.sin(2 * np.pi * 14 * t(d)), d) * env(d, 0.003, 14) * 0.5

save("munch", munch(), -5)


def gulp():
    d = 0.25
    tt = t(d)
    return sine(500 - 380 * tt / d, d) * env(d, 0.002, 12)

save("gulp", gulp(), -7)


def waves(d=2.2):  # sea wash
    n = bandnoise(d, 0.01, 0.2)
    tt = t(d)
    return n * (0.4 + 0.6 * np.sin(np.pi * tt / d) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.9 * tt)))

save("waves", waves(), -9)


def shipbell():
    return bell(880, 1.0, 2.5) + bell(1320, 1.0, 3.5) * 0.3

save("shipbell", shipbell(), -8)


def creak(d=0.6):  # wooden scale tipping
    tt = t(d)
    f = 300 + 140 * tt / d
    x = sum(sine(f * h, d) / h for h in range(1, 7)) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 26 * tt)))
    return lowpass(x * np.sin(np.pi * tt / d), 0.3)

save("creak", creak(), -9)


def coins(n=6, gap=0.16):
    return mix(n * gap + 0.4, [(k * gap, coin(rng.uniform(2300, 3200)), rng.uniform(0.6, 1)) for k in range(n)])

save("coins", coins(), -7)


def bugle():  # short salute: four notes
    def note(f, d):
        tt = t(d)
        x = sum(sine(f * h, d) * (0.8 ** h) for h in range(1, 7))
        return lowpass(x * np.minimum(1, tt / 0.02) * np.minimum(1, (d - tt) / 0.04), 0.4)
    return mix(1.0, [(0.0, note(392, 0.12), 1), (0.14, note(523, 0.12), 1), (0.28, note(659, 0.12), 1), (0.42, note(784, 0.5), 1)])

save("bugle", bugle(), -7)


def curtain(d=0.5):  # heavy velvet swoosh
    return lowpass(whoosh(d), 0.3)

save("curtain", curtain(), -5)


def squeak():  # boot squeak
    d = 0.3
    tt = t(d)
    return sine(700 + 500 * np.sin(np.pi * tt / d), d) * np.sin(np.pi * tt / d) * 0.8

save("squeak", squeak(), -10)


# --- music: light musette waltz (3/4, 156 bpm): accordion chords oom-pah-pah, bass, melody; a short gap before the punchline ---
def accordion(f, d, g=1.0):
    tt = t(d)
    x = np.zeros_like(tt)
    for det in (1.0, 1.006):  # two detuned reeds = musette sound
        x += sum(sine(f * det * h, d) * (0.62 ** h) for h in range(1, 8))
    a = np.minimum(1, tt / 0.015) * np.minimum(1, (d - tt) / 0.04)
    return x * a * g


def music(total, gaps):
    N = int(round(SR * total))
    x = np.zeros(N)
    spb = 60 / 156

    def put(sig, at, g=1.0):
        for g0, g1 in gaps:
            if g0 <= at < g1:
                return
        i = int(at * SR); j = min(N, i + len(sig))
        if i < N:
            x[i:j] += sig[: j - i] * g

    C = 261.63
    st = lambda s: C * 2 ** (s / 12)
    # chords per bar (C, G7, C, F, C, G7, Am, G)
    prog = [(0, [0, 4, 7]), (-5, [-1, 2, 5]), (0, [0, 4, 7]), (5, [5, 9, 12]), (0, [0, 4, 7]), (-5, [-1, 2, 5]), (-3, [0, 4, 9]), (-5, [-1, 2, 7])]
    # melody: 3 notes per bar (semitones over C)
    mel = [16, 19, 24, 23, 19, 17, 16, 19, 24, 21, 17, 24, 19, 16, 12, 14, 17, 23, 16, 21, 24, 19, 17, 14]
    tick = bandnoise(0.04, 0.3, 0.9) * env(0.04, 0.0005, 90) * 0.12
    b = 0
    while b * spb < total:
        tb = b * spb
        bar = (b // 3) % len(prog)
        root, ch = prog[bar]
        if b % 3 == 0:
            put(sum(sine(st(root - 24) * h, 0.35) / h ** 1.5 for h in range(1, 5)) * env(0.35, 0.003, 6), tb, 0.55)
        else:
            put(sum(accordion(st(n - 12), 0.18) for n in ch) / 3, tb, 0.22)
        put(tick, tb + (spb / 2 if b % 3 else 0))
        m = mel[(b) % len(mel)]
        put(accordion(st(m), spb * 0.92), tb, 0.30)
        b += 1
    fi = int(0.02 * SR); x[:fi] *= np.linspace(0, 1, fi)
    fo = int(0.2 * SR); x[-fo:] *= np.linspace(1, 0.6, fo)
    return x

save("music", music(TOTAL, ((GAP0, GAP0 + 0.24),)), -6)
print("ok")
