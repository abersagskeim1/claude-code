// Per-frame check (successor of bubbles.mjs): every visible graphic and every graphic label, incl. its animation,
// must stay inside x 80-1000. Two measurements over ALL frames:
//  1. DOM: bounding box (incl. rotation/scale) of every visible graphic element of the scenes and of Klotz's layer
//     (top-level svgs, boxes with a background/border, text labels) - the same element choice as overlap.mjs.
//  2. INK: a screenshot with captions and background hidden on a magenta ground (half resolution); the leftmost and
//     rightmost painted pixel (strokes, white outline, drop shadows included).
//  3. CAPTION INK (Folge 12): every frame again with only the captions on the magenta ground: the painted caption pixels
//     (fill, stroke, shadow, umlaut dots) incl. pop-in, shake and exit must stay in x 80-1000 and y 280-1500.
// Usage: PUPPETEER_CORE=<path> node tools/bounds.mjs <preview_url> [t0 t1]
import { createRequire } from "module";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
const require = createRequire(import.meta.url);
const puppeteer = require(process.env.PUPPETEER_CORE);
const [url, t0s, t1s] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox"], headless: true });
const p = await b.newPage(); await p.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 0.5 });
await p.goto(url, { waitUntil: "networkidle0", timeout: 90000 });
await p.waitForFunction(() => window.__player && window.__playerReady !== false, { timeout: 60000 });
await new Promise((r) => setTimeout(r, 1500));
const dur = await p.evaluate(() => window.__player.getDuration());
const T0 = t0s ? +t0s : 0, T1 = t1s ? +t1s : dur;
await p.evaluate(() => { const st = document.createElement("style"); st.textContent = '[data-composition-id="captions"], [data-composition-id="bg"] { opacity: 0 !important; } html, body, #root { background: #FF00FF !important; }'; document.head.appendChild(st); });
const dir = fs.mkdtempSync(path.join(process.env.BOUNDS_DIR || os.tmpdir(), "bounds-"));
let minL = 1e9, maxR = -1e9, bad = 0;
const frames = [];
for (let f = Math.round(T0 * 30); f < Math.round(T1 * 30); f++) {
  const t = f / 30;
  await p.evaluate(async (t) => { window.__player.renderSeek(t); if (window.__hfWaitForSeekCompletion) await window.__hfWaitForSeekCompletion(); }, t);
  const res = await p.evaluate(() => {
    const op = (el) => { let o = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === "none" || cs.visibility === "hidden") return 0; o *= +cs.opacity; } return o; };
    const out = [];
    const hosts = [...document.querySelectorAll("#root > [data-composition-id]")].filter((h) => !["captions", "bg"].includes(h.getAttribute("data-composition-id")));
    for (const h of hosts) {
      h.querySelectorAll("*").forEach((el) => {
        if (el.closest("defs") || el.closest("symbol")) return;
        const tag = el.tagName.toLowerCase();
        let isG = false;
        if (tag === "svg") { const r = el.getBoundingClientRect(); isG = r.width > 4 && r.height > 4 && !el.parentElement.closest("svg"); }
        else if (el.namespaceURI === "http://www.w3.org/1999/xhtml") {
          const cs = getComputedStyle(el);
          if (el.querySelector("*")) isG = (cs.backgroundColor !== "rgba(0, 0, 0, 0)" || cs.backgroundImage !== "none" || parseFloat(cs.borderTopWidth) > 0) && !el.id.endsWith("-out") && !el.id.endsWith("-kb");
          else isG = cs.backgroundColor !== "rgba(0, 0, 0, 0)" || cs.backgroundImage !== "none" || parseFloat(cs.borderTopWidth) > 0 || (el.textContent || "").trim().length > 0;
        }
        if (!isG || op(el) < 0.03) return;
        const r = el.getBoundingClientRect();
        out.push([h.getAttribute("data-composition-id") + ":" + (el.id || (el.parentElement && el.parentElement.id) + ">" + tag), Math.round(r.left), Math.round(r.right)]);
      });
    }
    return out;
  });
  for (const [id, l, r] of res) {
    minL = Math.min(minL, l); maxR = Math.max(maxR, r);
    if (l < 80 || r > 1000) { bad++; console.log(`DOM f${f} t=${t.toFixed(2)} ${id} x ${l}-${r}`); }
  }
  const png = path.join(dir, `f${String(f).padStart(5, "0")}.png`);
  await p.screenshot({ path: png, type: "png" });
  frames.push(png);
}
// pass 3: captions only
await p.evaluate(() => { const st = document.createElement("style"); st.textContent = '#root > [data-composition-id]:not([data-composition-id="captions"]) { opacity: 0 !important; } [data-composition-id="captions"] { opacity: 1 !important; }'; document.head.appendChild(st); });
const capDir = fs.mkdtempSync(path.join(process.env.BOUNDS_DIR || os.tmpdir(), "capink-"));
for (let f = Math.round(T0 * 30); f < Math.round(T1 * 30); f++) {
  const t = f / 30;
  await p.evaluate(async (t) => { window.__player.renderSeek(t); if (window.__hfWaitForSeekCompletion) await window.__hfWaitForSeekCompletion(); }, t);
  await p.screenshot({ path: path.join(capDir, `f${String(f).padStart(5, "0")}.png`), type: "png" });
}
await b.close();
const pyc = spawnSync("python3", ["-c", `import sys, glob
from PIL import Image
import numpy as np
L, R, T, B, bad = 9999, -1, 9999, -1, 0
for fn in sorted(glob.glob(sys.argv[1] + "/f*.png")):
    a = np.asarray(Image.open(fn).convert("RGB")).astype(int)
    m = (abs(a[:,:,0]-255) + a[:,:,1] + abs(a[:,:,2]-255)) > 60
    xs = np.nonzero(m.any(0))[0]; ys = np.nonzero(m.any(1))[0]
    if not len(xs): continue
    l, r, t, b = xs.min() * 2, xs.max() * 2 + 1, ys.min() * 2, ys.max() * 2 + 1
    L, R, T, B = min(L, l), max(R, r), min(T, t), max(B, b)
    if l < 80 or r > 1000 or t < 280 or b > 1500:
        bad += 1; print("CAP-INK", fn.split("/")[-1], "x", l, "-", r, "y", t, "-", b)
print("caption ink x", L, "-", R, "y", T, "-", B, ";", (str(bad) + " frames outside x 80-1000 / y 280-1500") if bad else "all frames inside x 80-1000, y 280-1500")
`, capDir], { encoding: "utf8", maxBuffer: 1 << 26 });
process.stdout.write(pyc.stdout + pyc.stderr);
fs.rmSync(capDir, { recursive: true, force: true });
const py = spawnSync("python3", ["-c", `import sys, glob
from PIL import Image
import numpy as np
L, R, bad = 9999, -1, 0
for fn in sorted(glob.glob(sys.argv[1] + "/f*.png")):
    a = np.asarray(Image.open(fn).convert("RGB")).astype(int)
    m = (abs(a[:,:,0]-255) + a[:,:,1] + abs(a[:,:,2]-255)) > 60
    xs = np.nonzero(m.any(0))[0]
    if not len(xs): continue
    l, r = xs.min() * 2, xs.max() * 2 + 1
    L, R = min(L, l), max(R, r)
    if l < 80 or r > 1000:
        bad += 1; print("INK", fn.split("/")[-1], "x", l, "-", r)
print("ink min left", L, "max right", R, ";", (str(bad) + " frames outside x 80-1000") if bad else "all frames inside x 80-1000")
`, dir], { encoding: "utf8", maxBuffer: 1 << 26 });
process.stdout.write(py.stdout + py.stderr);
fs.rmSync(dir, { recursive: true, force: true });
console.log(`DOM boxes: min left ${minL}, max right ${maxR}; ${bad ? bad + " boxes outside x 80-1000" : "all inside x 80-1000"} (${frames.length} frames)`);
