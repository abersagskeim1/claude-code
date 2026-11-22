// Per-frame check: every visible chat bubble (unclipped bounding box incl. rotation/scale) must stay inside x 80-1000.
// Usage: PUPPETEER_CORE=<path> node tools/bubbles.mjs <preview_url> [t0 t1]
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const puppeteer = require(process.env.PUPPETEER_CORE);
const [url, t0s, t1s] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox"], headless: true });
const p = await b.newPage(); await p.setViewport({ width: 1080, height: 1920 });
await p.goto(url, { waitUntil: "networkidle0", timeout: 90000 });
await p.waitForFunction(() => window.__player && window.__playerReady !== false, { timeout: 60000 });
await new Promise((r) => setTimeout(r, 1500));
const dur = await p.evaluate(() => window.__player.getDuration());
const T0 = t0s ? +t0s : 0, T1 = t1s ? +t1s : dur;
let minL = 1e9, maxR = -1e9, bad = 0;
for (let f = Math.round(T0 * 30); f < Math.round(T1 * 30); f++) {
  const t = f / 30;
  await p.evaluate(async (t) => { window.__player.renderSeek(t); if (window.__hfWaitForSeekCompletion) await window.__hfWaitForSeekCompletion(); }, t);
  const res = await p.evaluate(() => {
    const op = (el) => { let o = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === "none" || cs.visibility === "hidden") return 0; o *= +cs.opacity; } return o; };
    return [...document.querySelectorAll(".bw, .befehle-big")].filter((e) => op(e) > 0.03).map((e) => { const r = e.querySelector("svg").getBoundingClientRect(); return [e.id, Math.round(r.left), Math.round(r.right)]; });
  });
  for (const [id, l, r] of res) {
    minL = Math.min(minL, l); maxR = Math.max(maxR, r);
    if (l < 80 || r > 1000) { bad++; console.log(`f${f} t=${t.toFixed(2)} ${id} x ${l}-${r}`); }
  }
}
console.log(`bubbles min left ${minL}, max right ${maxR}; ${bad ? bad + " outside x 80-1000" : "all inside x 80-1000"}`);
await b.close();
