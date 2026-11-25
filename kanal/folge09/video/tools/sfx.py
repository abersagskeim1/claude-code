"""Synthesise free sound effects and a 1920s charleston for Folge 9 "Der Mann, der den Eiffelturm verkaufte" (no external sources, nothing paid).
Usage: python3 sfx.py <out_dir> <total_seconds> <music_gap_start>"""
import sys, wave
import numpy as np

OUT = sys.argv[1]
TOTAL = float(sys.argv[2])
GAP0 = float(sys.argv[3])
SR = 44100
rng = np.random.default_rng(1925)


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

# --- shared with Folge 8 (same recipes) ---
def coin(f=2600):
    d = 0.35
    return sum(sine(f * p, d) * env(d, 0.0005, 14 + 6 * i) / (i + 1) for i, p in enumerate([1, 1.52, 2.31, 3.1]))


def kaching():  # cash register: drawer clack + bell + coin
    d = 0.9
    clack = bandnoise(0.08, 0.1, 0.7) * env(0.08, 0.0005, 70)
    return mix(d, [(0.0, clack, 0.8), (0.05, bell(2093, 0.8, 3), 0.7), (0.1, coin(2900), 0.4)])

save("kaching", kaching(), -4)


def paper():  # paper flap
    d = 0.22
    return bandnoise(d, 0.1, 0.7) * env(d, 0.004, 25) + sine(160 - 80 * t(d) / d, d) * env(d, 0.002, 30) * 0.5

save("paper", paper(), -6)


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


def creak(d=0.6):  # metal groan (tower wobbles)
    tt = t(d)
    f = 220 + 90 * np.sin(np.pi * tt / d)
    x = sum(sine(f * h, d) / h for h in range(1, 7)) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 21 * tt)))
    return lowpass(x * np.sin(np.pi * tt / d), 0.3)

save("creak", creak(), -9)

# --- new for Folge 9 ---
def glint():  # monocle glint: two high bell pings
    return mix(0.5, [(0.0, bell(3520, 0.4, 9), 0.8), (0.08, bell(4699, 0.4, 10), 0.6)])

save("glint", glint(), -11)


def cards(d=0.5, n=6):  # cards fanning out: quick flicks
    x = np.zeros(int(SR * d))
    for k in range(n):
        c = bandnoise(0.03, 0.2, 0.85) * env(0.03, 0.0005, 120)
        j = int(k * 0.06 * SR); x[j:j + len(c)] += c * (0.7 + 0.3 * (k % 2))
    return x

save("cards", cards(), -6)


def clank(f=520, d=0.5):  # metal clank (wrench, girders, bars)
    hit = bandnoise(0.03, 0.15, 0.9) * env(0.03, 0.0003, 90)
    ring = sum(sine(f * p, d) * env(d, 0.0005, 8 + 4 * i) / (i + 1) for i, p in enumerate([1, 2.76, 5.4, 8.9]))
    return mix(d, [(0, hit, 0.8), (0, ring, 0.6)])

save("clank", clank(), -5)
save("clank2", clank(380, 0.6), -5)
save("bars", mix(0.9, [(0, clank(300, 0.9), 1), (0.05, clank(450, 0.8), 0.6)]), -4)


def heavy():  # scrap lands on the scale
    return thud(0.5, 110, 38) + clank(240, 0.5) * 0.4

save("heavy", heavy(), -3)


def needle(d=0.5):  # scale needle swings: rising whistle-like squeal with ticks
    tt = t(d)
    return sine(600 + 700 * tt / d, d) * np.sin(np.pi * tt / d) * 0.5 + cards(d, 6) * 0.4

save("needle", needle(), -10)


def reel(d=0.6):  # fishing reel ratchet
    x = np.zeros(int(SR * d)); k = 0
    while k * 0.022 < d - 0.02:
        c = sine(2400, 0.008) * env(0.008, 0.0002, 300)
        j = int(k * 0.022 * SR); x[j:j + len(c)] += c; k += 1
    return x

save("reel", reel(), -9)


def splash():  # the bite: blub
    d = 0.35
    tt = t(d)
    return sine(300 + 900 * np.exp(-tt * 14), d) * env(d, 0.002, 12) + bandnoise(d, 0.05, 0.5) * env(d, 0.002, 20) * 0.4

save("splash", splash(), -6)


def steps(n=5, gap=0.13):  # running steps
    return mix(n * gap + 0.1, [(k * gap, thud(0.08, 220 - 30 * (k % 2), 90), 0.9) for k in range(n)])

save("steps", steps(), -6)


def poof():  # dust cloud
    d = 0.45
    return lowpass(bandnoise(d, 0.02, 0.5) * env(d, 0.01, 9), 0.4)

save("poof", poof(), -6)


def phone():  # old telephone bell: two short trills
    def trill(d):
        tt = t(d)
        return (bell(1500, d, 6) + bell(1580, d, 6)) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 22 * tt)))
    return mix(0.8, [(0, trill(0.3), 1), (0.42, trill(0.3), 1)])

save("phone", phone(), -9)


def clack():  # receiver put down
    d = 0.18
    return bandnoise(d, 0.08, 0.7) * env(d, 0.0005, 50) + thud(d, 200, 90) * 0.5

save("clack", clack(), -5)


def whistle(d=0.7):  # police whistle (trilling)
    tt = t(d)
    f = 2300 + 160 * np.sign(np.sin(2 * np.pi * 26 * tt))
    a = np.minimum(1, tt / 0.03) * np.minimum(1, (d - tt) / 0.08)
    return (sine(f, d) + bandnoise(d, 0.3, 0.9) * 0.15) * a

save("whistle", whistle(), -11)


def siren(d=1.2):  # wobbling siren
    tt = t(d)
    f = 650 + 250 * np.sin(2 * np.pi * 1.6 * tt)
    return tri(f, d) * np.minimum(1, tt / 0.1) * np.minimum(1, (d - tt) / 0.15)

save("siren", siren(), -13)


def horn(d=0.9):  # ship horn
    tt = t(d)
    x = sum(sine(110 * h, d) * (0.7 ** h) for h in range(1, 9)) + sum(sine(138.6 * h, d) * (0.7 ** h) for h in range(1, 6)) * 0.6
    return lowpass(x * np.minimum(1, tt / 0.06) * np.minimum(1, (d - tt) / 0.15), 0.2)

save("horn", horn(), -5)


def click():  # mouse click
    d = 0.06
    return bandnoise(d, 0.3, 0.95) * env(d, 0.0002, 160)

save("click", click(), -8)


def peel():  # sticker pressed on: zip + pat
    d = 0.35
    tt = t(d)
    z = bandnoise(0.2, 0.3, 0.9) * np.sin(np.pi * t(0.2) / 0.2) * 0.6
    return mix(d, [(0, z, 1), (0.2, thud(0.12, 260, 120), 0.8)])

save("peel", peel(), -6)


# --- music: 1920s charleston (4/4, 200 bpm): stride piano (bass on 1/3, chord on 2/4), muted-trumpet melody, brushed snare; a short gap before the punchline ---
def piano(f, d):
    tt = t(d)
    return sum(sine(f * h, d) * env(d, 0.002, 5 + 3 * h) / h ** 1.2 for h in range(1, 6)) * np.minimum(1, (d - tt) / 0.03)


def trumpet(f, d):
    tt = t(d)
    vib = 1 + 0.006 * np.sin(2 * np.pi * 5.5 * tt)
    x = sum(sine(f * h * vib, d) * (0.75 ** h) for h in range(1, 8))
    return lowpass(x * np.minimum(1, tt / 0.02) * np.minimum(1, (d - tt) / 0.03), 0.35)


def music(total, gaps):
    N = int(round(SR * total))
    x = np.zeros(N)
    spb = 60 / 200

    def put(sig, at, g=1.0):
        for g0, g1 in gaps:
            if g0 <= at < g1:
                return
        i = int(at * SR); j = min(N, i + len(sig))
        if i < N:
            x[i:j] += sig[: j - i] * g

    C = 261.63
    st = lambda s: C * 2 ** (s / 12)
    # one chord per bar: C, A7, D7, G7 (the classic charleston turn-around)
    prog = [(0, [0, 4, 7]), (-3, [1, 4, 7]), (2, [2, 6, 9]), (-5, [2, 5, 11])]
    # charleston rhythm melody: (beat offset in the bar, semitones, length in beats)
    mel = [[(0, 16, 1.2), (1.5, 19, 0.5), (2, 16, 0.5), (3, 12, 0.8)],
           [(0, 13, 1.2), (1.5, 16, 0.5), (2, 19, 0.5), (3, 21, 0.8)],
           [(0, 18, 1.2), (1.5, 14, 0.5), (2, 18, 0.5), (3, 21, 0.8)],
           [(0, 19, 1.2), (1.5, 17, 0.5), (2, 14, 0.5), (3, 11, 0.8)]]
    brush = bandnoise(0.07, 0.3, 0.95) * env(0.07, 0.003, 40) * 0.25
    bar = 0
    while bar * 4 * spb < total:
        tb = bar * 4 * spb
        root, ch = prog[bar % 4]
        for beat in range(4):
            at = tb + beat * spb
            if beat % 2 == 0:
                put(piano(st(root - 24 + (7 if beat == 2 else 0)), 0.3), at, 0.6)
            else:
                put(sum(piano(st(n - 12), 0.18) for n in ch) / 3, at, 0.45)
            put(brush, at + (0 if beat % 2 else spb / 2), 1.0)
        for off, n, ln in mel[bar % 4]:
            put(trumpet(st(n), ln * spb * 0.9), tb + off * spb, 0.22)
        bar += 1
    fi = int(0.02 * SR); x[:fi] *= np.linspace(0, 1, fi)
    fo = int(0.2 * SR); x[-fo:] *= np.linspace(1, 0.6, fo)
    return x

save("music", music(TOTAL, ((GAP0, GAP0 + 0.24),)), -6)
print("ok")
