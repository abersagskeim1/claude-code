"""Synthesise free sound effects and a light chiptune beat for Folge 2 (no external sources).
Usage: python3 sfx.py <out_dir> <total_seconds>"""
import sys, wave
import numpy as np

OUT = sys.argv[1]
TOTAL = float(sys.argv[2])
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


def sq(f, d, duty=0.5):
    """square wave with a per-sample frequency array or constant"""
    f = np.broadcast_to(np.asarray(f, dtype=np.float64), (int(SR * d),))
    ph = np.cumsum(f) / SR
    return np.where((ph % 1.0) < duty, 1.0, -1.0)


# --- cartoon layer ---
def pop(f0, f1, d=0.12):
    tt = t(d)
    f = f1 + (f0 - f1) * np.exp(-tt * 40)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(d, 0.001, 35)

save("pop1", pop(900, 300))
save("pop2", pop(1200, 420, 0.1))


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
save("whoosh2", whoosh(0.3, True))


def thud(d=0.45, f0=140, f1=45):
    tt = t(d)
    f = f1 + (f0 - f1) * np.exp(-tt * 18)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(d, 0.002, 7)
    click = bandnoise(d, 0.05, 0.6) * env(d, 0.0005, 60) * 0.6
    harm = np.sin(4 * np.pi * np.cumsum(f) / SR) * env(d, 0.002, 12) * 0.35
    return body + click + harm

save("impact", thud(0.6, 160, 42), -2)
save("stamp", thud(0.35, 220, 70) + bandnoise(0.35, 0.02, 0.3) * env(0.35, 0.001, 30) * 0.8)

# --- 8-bit layer ---
# coin / blip: two quick square notes
def blip():
    a = sq(988, 0.05, 0.25) * 0.8
    b = sq(1319, 0.11, 0.25) * env(0.11, 0.001, 18)
    return np.concatenate([a, b])

save("blip", blip(), -6)

# zap: falling square sweep (boss shoots)
def zap(d=0.22):
    tt = t(d)
    f = 1400 * np.exp(-tt * 9) + 180
    return sq(f, d, 0.5) * env(d, 0.001, 10)

save("zap", zap(), -7)

# 8-bit hit: crushed noise burst + low square
def hit8(d=0.16):
    n = np.sign(rng.standard_normal(int(SR * d)))
    n = np.repeat(n[::12], 12)[: int(SR * d)]
    return (n * 0.6 + sq(110, d) * 0.5) * env(d, 0.001, 22)

save("hit8", hit8(), -6)

# KO: descending arpeggio
def ko():
    notes = [523, 392, 311, 196, 131]
    return np.concatenate([sq(f, 0.09, 0.5) * env(0.09, 0.001, 8) for f in notes])

save("ko", ko(), -6)

# heal: rising sparkly arpeggio
def heal():
    notes = [523, 659, 784, 1047, 1319, 1568]
    out = np.concatenate([sq(f, 0.06, 0.125) * env(0.06, 0.001, 10) for f in notes])
    tail = sq(2093, 0.25, 0.125) * env(0.25, 0.001, 12) * 0.6
    return np.concatenate([out, tail])

save("heal", heal(), -7)

# power down: long falling square, slightly soft
def powerdown(d=0.7):
    tt = t(d)
    f = 660 * np.exp(-tt * 3.2) + 40
    x = sq(f, d, 0.5) * np.linspace(1, 0.05, len(tt))
    return lowpass(x, 0.35)

save("powerdown", powerdown(), -6)

# power up / game start jingle
def powerup():
    notes = [262, 330, 392, 523, 659, 784]
    return np.concatenate([sq(f, 0.055, 0.25) * env(0.055, 0.001, 5) for f in notes] + [sq(1047, 0.2, 0.25) * env(0.2, 0.001, 9)])

save("powerup", powerup(), -7)

# click: small UI tick
save("click", sq(2400, 0.03, 0.5) * env(0.03, 0.0005, 120) + bandnoise(0.03, 0.2, 0.9) * env(0.03, 0.0005, 150), -8)

# sneeze: "ha-" (breathy rising vowel) then "tschi" (bright noise burst)
def sneeze():
    d1 = 0.32
    tt = t(d1)
    breath = bandnoise(d1, 0.03, 0.25) * (tt / d1) ** 1.6 * 0.5
    voice = np.sin(2 * np.pi * np.cumsum(300 + 180 * tt / d1) / SR) * (tt / d1) ** 2 * 0.35
    d2 = 0.38
    burst = bandnoise(d2, 0.35, 0.97) * env(d2, 0.002, 9)
    gap = np.zeros(int(0.03 * SR))
    return np.concatenate([breath + voice, gap, burst * 1.3])

save("sneeze", sneeze(), -3)


# --- chiptune beat, 120 bpm, gap for the restart ---
def beat(total, gaps=((25.45, 27.0),)):
    N = int(round(SR * total))
    x = np.zeros(N)
    spb = 0.5
    kick = thud(0.25, 160, 50) * 0.8
    hat = bandnoise(0.04, 0.5, 0.98) * env(0.04, 0.0005, 100) * 0.16
    snare = hit8(0.12) * 0.32

    def bass(f, d=0.2):
        return sq(f, d, 0.5) * env(d, 0.002, 7) * 0.22

    def lead(f, d=0.12):
        return sq(f, d, 0.25) * env(d, 0.002, 12) * 0.08

    roots = [110, 110, 87.3, 98]           # A2 A2 F2 G2
    arp = [440, 523, 659, 523]             # light arpeggio on top

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
        put(kick, tb)
        if b % 2 == 1:
            put(snare, tb)
        put(hat, tb + spb / 2)
        put(bass(roots[bar]), tb)
        put(bass(roots[bar] * 2, 0.12), tb + spb / 2)
        put(lead(arp[b % 4] * (roots[bar] / 110)), tb + spb / 4)
        b += 1
    fi = int(0.02 * SR); x[:fi] *= np.linspace(0, 1, fi)
    fo = int(0.3 * SR); x[-fo:] *= np.linspace(1, 0, fo)
    return x

save("beat", beat(TOTAL), -6)
print("ok")
