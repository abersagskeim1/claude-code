"""Frame-by-frame check for brightness/content holes at every scene cut and at the loop seam.
Usage: python3 tools/cutcheck.py <video.mp4> <cut1,cut2,...>
For each frame it measures, in the graphics area (y 600-1450, x 0-1080 without Klotz's corner),
the mean luma and the edge energy (mean absolute gradient). A frame is flagged when its edge energy
drops below 55 % of the lower of the two neighbouring 3-frame windows (a near-empty frame at a cut)."""
import subprocess, sys
import numpy as np

src, cuts = sys.argv[1], [float(x) for x in sys.argv[2].split(",")]
W, H = 270, 480  # quarter resolution
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-vf", f"scale={W}:{H}", "-f", "rawvideo", "-pix_fmt", "gray", "-"], capture_output=True, check=True).stdout
fr = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)
n = len(fr)
y0, y1 = 600 // 4, 1450 // 4
reg = fr[:, y0:y1, :]
mask = np.ones(reg.shape[1:], bool)
mask[(1440 - 600) // 4:, 640 // 4:] = False  # Klotz corner (he is always there)
luma = (reg * mask).sum((1, 2)) / mask.sum()
gx = np.abs(np.diff(reg, axis=2))[:, :-1, :]  # (n, h-1, w-1)
gy = np.abs(np.diff(reg, axis=1))[:, :, :-1]
m2 = mask[:-1, :-1]
edge = ((gx + gy) * m2).sum((1, 2)) / m2.sum()
print(f"frames {n} ({n / 30:.3f} s)")
bad = 0
def show(i0, i1, label):
    global bad
    print(f"-- {label}")
    for i in range(max(0, i0), min(n, i1)):
        a = edge[max(0, i - 3):i].mean() if i > 0 else edge[i]
        b = edge[i + 1:i + 4].mean() if i + 1 < n else edge[i]
        flag = edge[i] < 0.55 * min(a, b)
        bad += flag
        print(f"   f{i:4d} t={i / 30:6.3f}  luma {luma[i]:6.1f}  edge {edge[i]:5.2f} {'HOLE' if flag else ''}")
for c in cuts:
    f = round(c * 30)
    show(f - 5, f + 5, f"cut {c}")
show(n - 18, n, "loop end (last 0.6 s)")
show(0, 4, "loop start")
print("holes:", bad)
