"""Synthesise free sound effects and a medieval lute loop for Folge 7 (no external sources, nothing paid).
Usage: python3 sfx.py <out_dir> <total_seconds>"""
import sys, wave
import numpy as np

OUT = sys.argv[1]
TOTAL = float(sys.argv[2])
SR = 44100
rng = np.random.default_rng(1325)


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


def choir(d=1.4):
    tt = t(d)
    x = np.zeros_like(tt)
    for f in [293.7, 370, 440, 587]:
        vib = 1 + 0.006 * np.sin(2 * np.pi * 5.5 * tt)
        x += sum(sine(f * h * vib, d) / h ** 1.6 for h in range(1, 5))
    a = np.minimum(1, tt / 0.2) * np.minimum(1, (d - tt) / 0.5)
    return lowpass(x * a, 0.2)

save("choir", choir(), -8)


def confetti(d=0.7):
    x = np.zeros(int(SR * d))
    for k in range(14):
        c = pop(rng.uniform(1500, 2600), 700, 0.05)
        j = int(rng.uniform(0, d - 0.06) * SR); x[j:j + len(c)] += c * rng.uniform(0.4, 1.0)
    return x

save("confetti", confetti(), -9)


def jump():
    d = 0.22
    tt = t(d)
    return sine(300 + 900 * (tt / d) ** 0.7, d) * env(d, 0.002, 9)

save("jump", jump(), -9)

# --- new for Folge 7 ---
def knock():  # hollow wooden bucket knock
    d = 0.25
    tt = t(d)
    body = sum(sine(f, d) * env(d, 0.001, k) * g for f, k, g in [(220, 22, 1.0), (470, 30, 0.6), (930, 45, 0.3)])
    return body + bandnoise(d, 0.08, 0.5) * env(d, 0.0005, 90) * 0.5

save("knock", knock(), -4)


def bonk():  # bucket lands on Klotz's head: wooden knock + low pitch drop
    d = 0.4
    tt = t(d)
    k = np.concatenate([knock(), np.zeros(int(SR * 0.15))])[: int(SR * d)]
    return k + sine(300 - 200 * tt / d, d) * env(d, 0.002, 9) * 0.6

save("bonk", bonk(), -4)


def clang():  # metallic shield bump (inharmonic partials)
    d = 0.9
    return sum(sine(f, d) * env(d, 0.0008, k) / (i + 1) ** 0.7 for i, (f, k) in enumerate([(523, 4), (1187, 5), (1730, 7), (2410, 9), (3320, 12)])) + bandnoise(d, 0.2, 0.9) * env(d, 0.0005, 50) * 0.6

save("clang", clang(), -5)


def unroll(d=0.6):  # paper rustle that grows
    n = bandnoise(d, 0.15, 0.85)
    tt = t(d)
    flutter = 0.6 + 0.4 * np.abs(np.sin(2 * np.pi * 23 * tt))
    return n * flutter * np.sin(np.pi * tt / d) ** 0.7

save("unroll", unroll(), -6)


def page():
    d = 0.35
    tt = t(d)
    return bandnoise(d, 0.2, 0.9) * np.sin(np.pi * tt / d) ** 2 * (0.5 + 0.5 * np.sin(2 * np.pi * 9 * tt)) + whoosh(d) * 0.5

save("page", page(), -6)


def scratch(n=10, gap=0.11):  # quill scratching
    x = np.zeros(int(SR * (n * gap + 0.1)))
    for k in range(n):
        c = bandnoise(0.07, 0.3, 0.95) * np.sin(np.pi * t(0.07) / 0.07)
        j = int((k * gap + rng.uniform(0, 0.02)) * SR); x[j:j + len(c)] += c * rng.uniform(0.5, 1)
    return x

save("scratch", scratch(), -10)


def tiptoe(n=6, gap=0.42):  # pizzicato sneaking steps
    parts = []
    notes = [196, 220, 196, 247, 196, 220]
    for k in range(n):
        d = 0.18
        parts.append((k * gap, (tri(notes[k % 6], d) + 0.4 * sine(notes[k % 6] * 2, d)) * env(d, 0.001, 22), 1.0))
    return mix(n * gap + 0.2, parts)

save("tiptoe", tiptoe(), -7)


def whistle():  # innocent little whistle
    d = 0.7
    tt = t(d)
    f = 1400 + 300 * np.sin(2 * np.pi * 1.6 * tt) + 40 * np.sin(2 * np.pi * 6 * tt)
    return sine(f, d) * np.minimum(1, tt / 0.05) * np.minimum(1, (d - tt) / 0.2)

save("whistle", whistle(), -12)


def rattle(d=2.0):  # shields trembling: fast metallic ticks
    x = np.zeros(int(SR * d))
    k = 0
    while k * 0.055 < d - 0.05:
        c = sum(sine(f, 0.04) for f in (1900, 2700)) * env(0.04, 0.0003, 90)
        j = int(k * 0.055 * SR); x[j:j + len(c)] += c * (0.5 + 0.5 * (k % 2))
        k += 1
    return x * np.minimum(1, t(d) / 0.1) * np.minimum(1, (d - t(d)) / 0.3)

save("rattle", rattle(), -12)


def brass(f, d):
    tt = t(d)
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5 * tt)
    x = sum(sine(f * h * vib, d) * (0.9 ** h) for h in range(1, 7))
    a = np.minimum(1, tt / 0.03) * np.exp(-tt * 1.2)
    return lowpass(x * a, 0.35)

save("horn", np.concatenate([brass(294, 0.25), brass(440, 0.55)]), -6)
save("fanfare", mix(1.1, [(0.0, brass(392, 0.14), 1), (0.15, brass(392, 0.14), 1), (0.3, brass(523, 0.14), 1), (0.45, brass(659, 0.6), 1), (0.45, brass(523, 0.6), 0.6)]), -5)


def flap(n=5):  # flag flapping
    return mix(n * 0.12 + 0.1, [(k * 0.12, bandnoise(0.08, 0.05, 0.5) * env(0.08, 0.002, 30), 1) for k in range(n)])

save("flap", flap(), -8)


def cork():  # bucket pulled off: pop with a rising squeak
    return np.concatenate([pop(500, 1500, 0.1), sine(900 + 1500 * t(0.2) / 0.2, 0.2) * env(0.2, 0.002, 14) * 0.5])

save("cork", cork(), -5)


def hmm():  # questioning "hmm?" (two-tone rising hum)
    d = 0.55
    tt = t(d)
    f = np.where(tt < 0.3, 180, 180 + 120 * (tt - 0.3) / 0.25)
    x = sum(sine(f * h, d) / h ** 1.3 for h in range(1, 6))
    return lowpass(x * np.minimum(1, tt / 0.04) * np.minimum(1, (d - tt) / 0.1), 0.25)

save("hmm", hmm(), -8)


def stamp():  # rubber stamp: thud + slap
    d = 0.45
    return thud(d, 120, 50) + bandnoise(d, 0.1, 0.8) * env(d, 0.0003, 45) * 0.9

save("stamp", stamp(), -2)


# --- music: light medieval jig, 116 bpm, plucked lute (Karplus-Strong), drone, frame drum; a short gap before the punchline ---
def pluck(f, d=0.5, damp=0.996):
    N = int(SR * d); p = int(SR / f)
    buf = rng.uniform(-1, 1, p)
    out = np.zeros(N)
    for i in range(N):
        v = buf[i % p]
        out[i] = v
        buf[i % p] = damp * 0.5 * (v + buf[(i + 1) % p])
    return out

_pc = {}
def pl(f, d=0.45):
    k = (round(f, 2), d)
    if k not in _pc:
        _pc[k] = pluck(f, d) * env(d, 0.001, 3)
    return _pc[k]


def music(total, gaps=((20.1, 20.32),)):
    N = int(round(SR * total))
    x = np.zeros(N)
    spb = 60 / 116

    def put(sig, at, g=1.0):
        for g0, g1 in gaps:
            if g0 <= at < g1:
                return
        i = int(at * SR); j = min(N, i + len(sig))
        if i < N:
            x[i:j] += sig[: j - i] * g

    drum = thud(0.25, 110, 60) * 0.6 + bandnoise(0.25, 0.05, 0.4) * env(0.25, 0.001, 25) * 0.3
    tap = bandnoise(0.05, 0.3, 0.9) * env(0.05, 0.0005, 80) * 0.2
    D = 146.8
    scale = [D * 2 ** (s / 12) for s in (0, 2, 3, 5, 7, 9, 10, 12, 14, 15)]  # D dorian
    mel = [7, 5, 4, 5, 7, 7, 4, 2, 3, 4, 5, 4, 2, 0, 2, 4, 7, 8, 7, 5, 4, 5, 4, 2, 0, 2, 3, 4, 2, 1, 0, 0]
    roots = [D / 2, D / 2 * 2 ** (10 / 12), D / 2 * 2 ** (3 / 12), D / 2 * 2 ** (7 / 12)]  # D, C, F, A
    b = 0
    while b * spb < total:
        tb = b * spb
        bar = (b // 4) % 4
        if b % 4 == 0:
            put(drum, tb)
        if b % 4 == 2:
            put(drum, tb, 0.7)
        put(tap, tb + spb / 2)
        put(pl(roots[bar], 0.9), tb, 0.55)
        for h in range(2):
            m = mel[(b * 2 + h) % len(mel)]
            put(pl(scale[m] * 2, 0.4), tb + h * spb / 2, 0.5)
        b += 1
    # drone (fifth) underneath
    tt = np.arange(N) / SR
    x += (np.sin(2 * np.pi * D / 2 * tt) + 0.6 * np.sin(2 * np.pi * D * 0.75 * tt)) * 0.06
    fi = int(0.02 * SR); x[:fi] *= np.linspace(0, 1, fi)
    fo = int(0.2 * SR); x[-fo:] *= np.linspace(1, 0.6, fo)
    return x

save("music", music(TOTAL), -6)
print("ok")
