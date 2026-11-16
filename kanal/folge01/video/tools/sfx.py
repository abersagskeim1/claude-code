"""Synthesise simple, free sound effects and a light beat for Folge 1 (no external sources)."""
import sys, wave
import numpy as np

OUT = sys.argv[1]
SR = 44100
rng = np.random.default_rng(1932)


def save(name, x, peak_db=-3.0):
    x = np.asarray(x, dtype=np.float64)
    m = np.max(np.abs(x)) or 1.0
    x = x / m * (10 ** (peak_db / 20))
    # tiny fade in/out to avoid clicks
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


# pop: fast pitch drop blip
def pop(f0, f1, d=0.12):
    tt = t(d)
    f = f1 + (f0 - f1) * np.exp(-tt * 40)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * env(d, 0.001, 35)

save("pop1", pop(900, 300))
save("pop2", pop(1200, 420, 0.1))

# whoosh: band noise with swelling envelope
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

# thud/impact: low sine drop + noise click
def thud(d=0.45, f0=140, f1=45):
    tt = t(d)
    f = f1 + (f0 - f1) * np.exp(-tt * 18)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(d, 0.002, 7)
    click = bandnoise(d, 0.05, 0.6) * env(d, 0.0005, 60) * 0.6
    # add harmonic so phones hear it
    harm = np.sin(4 * np.pi * np.cumsum(f) / SR) * env(d, 0.002, 12) * 0.35
    return body + click + harm

save("impact", thud(0.6, 160, 42), -2)
save("stamp", thud(0.35, 220, 70) + bandnoise(0.35, 0.02, 0.3) * env(0.35, 0.001, 30) * 0.8)

# klack: metallic click, two transients
def klack():
    d = 0.3
    x = np.zeros(int(SR * d))
    for off, g in ((0.0, 1.0), (0.06, 0.8)):
        i = int(off * SR)
        n = bandnoise(d - off, 0.2, 0.9) * env(d - off, 0.0003, 70) * g
        tt = t(d - off)
        ring = (np.sin(2 * np.pi * 2300 * tt) + 0.6 * np.sin(2 * np.pi * 3400 * tt)) * env(d - off, 0.0003, 45) * 0.4 * g
        x[i:] += n + ring
    return x

save("klack", klack(), -2)

# drumroll: dense snare hits, crescendo
def drumroll(d=0.75):
    x = np.zeros(int(SR * d))
    hit = bandnoise(0.06, 0.08, 0.7) * env(0.06, 0.0005, 70)
    k = 0; tpos = 0.0
    while tpos < d - 0.06:
        i = int(tpos * SR)
        g = 0.35 + 0.65 * (tpos / d) * (0.85 + 0.3 * rng.random())
        x[i:i + len(hit)] += hit * g
        tpos += 0.032
        k += 1
    return x

save("drumroll", drumroll(0.75), -4)

# crash/cymbal for the winner
def crash(d=1.6):
    n = bandnoise(d, 0.25, 0.95)
    return n * env(d, 0.002, 2.6)

save("crash", crash(), -5)

# beat: 120 bpm, kick + hat + clap + bass pluck; with a break before the winner
def beat(total=32.5, gap=(27.5, 28.2)):
    N = int(SR * total)
    x = np.zeros(N)
    spb = 0.5
    kick = thud(0.3, 150, 50) * 0.9
    hat = bandnoise(0.05, 0.5, 0.98) * env(0.05, 0.0005, 90) * 0.18
    clap = bandnoise(0.14, 0.1, 0.6) * env(0.14, 0.001, 30) * 0.45
    def bass(f, d=0.22):
        tt = t(d)
        s = np.sign(np.sin(2 * np.pi * f * tt)) * 0.5 + np.sin(2 * np.pi * 2 * f * tt) * 0.3
        return lowpass(s, 0.15) * env(d, 0.003, 9) * 0.5
    notes = [110, 110, 98, 130.8]  # A2 A2 G2 C3
    b = 0
    while b * spb < total:
        tb = b * spb
        def put(sig, at):
            i = int(at * SR)
            if at >= gap[0] and at < gap[1]:
                return
            j = min(N, i + len(sig))
            if i < N:
                x[i:j] += sig[: j - i]
        put(kick, tb)
        if b % 2 == 1:
            put(clap, tb)
        put(hat, tb + spb / 2)
        put(bass(notes[(b // 4) % 4]), tb + spb / 2)
        b += 1
    # short fades at loop ends
    fi = int(0.02 * SR); x[:fi] *= np.linspace(0, 1, fi)
    fo = int(0.25 * SR); x[-fo:] *= np.linspace(1, 0, fo)
    return x

save("beat", beat(), -6)
print("ok")
