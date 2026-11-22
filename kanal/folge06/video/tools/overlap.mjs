// Per-frame check: does any visible graphic come closer than GAP px to visible caption text or to Klotz?
// Folge 5: Klotz (#k-wrap, with bob/squash/lean transforms) is an obstacle for every scene graphic too.
// Usage: node tools/overlap.mjs <preview_url> <gap_px> [t0 t1]
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const puppeteer = require(process.env.PUPPETEER_CORE);
const [url, gapS, t0s, t1s] = process.argv.slice(2);
const GAP = +gapS;
const b = await puppeteer.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox"], headless: true });
const p = await b.newPage(); await p.setViewport({ width: 1080, height: 1920 });
await p.goto(url, { waitUntil: "networkidle0", timeout: 90000 });
await p.waitForFunction(() => window.__player && window.__playerReady !== false, { timeout: 60000 });
await new Promise((r) => setTimeout(r, 1500));
const dur = await p.evaluate(() => window.__player.getDuration());
const T0 = t0s ? +t0s : 0, T1 = t1s ? +t1s : dur;
const hits = {};
for (let f = Math.round(T0 * 30); f < Math.round(T1 * 30); f++) {
  const t = f / 30;
  await p.evaluate(async (t) => { window.__player.renderSeek(t); if (window.__hfWaitForSeekCompletion) await window.__hfWaitForSeekCompletion(); }, t);
  const res = await p.evaluate((GAP) => {
    const op = (el) => { let o = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === "none" || cs.visibility === "hidden") return 0; o *= +cs.opacity; } return o; };
    const clip = (el, r) => { let { left, top, right, bottom } = r; for (let e = el.parentElement; e && e.nodeType === 1; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.overflow === "hidden" || cs.overflowX === "hidden") { const q = e.getBoundingClientRect(); left = Math.max(left, q.left); top = Math.max(top, q.top); right = Math.min(right, q.right); bottom = Math.min(bottom, q.bottom); } } return { left, top, right, bottom }; };
    const capRoot = document.querySelector('[data-composition-id="captions"]');
    const texts = [];
    capRoot.querySelectorAll(".g, .yr").forEach((g) => { if (op(g) < 0.03) return; const r = g.getBoundingClientRect(); if (r.width < 2) return; texts.push({ id: g.id, l: r.left - 8, t: r.top - 8, r: r.right + 8, b: r.bottom + 8 }); });
    const kw = document.querySelector("#k-wrap");
    const klotzBox = (() => { const r = kw.getBoundingClientRect(); return { id: "KLOTZ", l: r.left, t: r.top, r: r.right, b: r.bottom }; })();
    const out = [];
    const hosts = [...document.querySelectorAll('#root > [data-composition-id]')].filter((h) => !["captions", "bg"].includes(h.getAttribute("data-composition-id")));
    for (const h of hosts) {
      h.querySelectorAll("*").forEach((el) => {
        if (el.closest("defs") || el.closest("symbol")) return;
        const tag = el.tagName.toLowerCase();
        let isG = false;
        if (tag === "svg") { const r = el.getBoundingClientRect(); isG = r.width > 4 && r.height > 4 && !el.parentElement.closest("svg"); }
        else if (el.namespaceURI === "http://www.w3.org/1999/xhtml") {
          if (el.querySelector("*")) { const cs = getComputedStyle(el); isG = (cs.backgroundColor !== "rgba(0, 0, 0, 0)" || cs.backgroundImage !== "none" || parseFloat(cs.borderTopWidth) > 0) && !el.id.endsWith("-out") && !el.id.endsWith("-kb"); }
          else { const cs = getComputedStyle(el); isG = cs.backgroundColor !== "rgba(0, 0, 0, 0)" || cs.backgroundImage !== "none" || parseFloat(cs.borderTopWidth) > 0 || (el.textContent || "").trim().length > 0; }
        }
        if (!isG) return;
        if (el.id === "k-shadow") return;
        const o = op(el); if (o < 0.03) return;
        const c = clip(el, el.getBoundingClientRect());
        if (c.right - c.left < 2 || c.bottom - c.top < 2) return;
        const isKlotz = h.getAttribute("data-composition-id") === "klotz";
        for (const tx of isKlotz ? texts : texts.concat([klotzBox])) {
          const dx = Math.max(tx.l - c.right, c.left - tx.r, 0), dy = Math.max(tx.t - c.bottom, c.top - tx.b, 0);
          const d = Math.max(dx, dy) > 0 ? Math.hypot(dx, dy) : 0;
          if (d <= GAP) out.push([h.getAttribute("data-composition-id") + ":" + (el.id || ((el.parentElement && el.parentElement.id) || "?") + ">" + tag), tx.id.replace(/-w\d+$/, ""), Math.round(d)]);
        }
      });
    }
    return out;
  }, GAP);
  for (const [g, c, d] of res) { const k = g + " ~ " + c; if (!hits[k]) hits[k] = { from: t, to: t, min: d }; hits[k].to = t; hits[k].min = Math.min(hits[k].min, d); }
}
const rows = Object.entries(hits).sort((a, b) => a[1].from - b[1].from);
for (const [k, v] of rows) console.log(`${v.from.toFixed(2)}-${v.to.toFixed(2)}s  min ${v.min}px  ${k}`);
console.log(rows.length ? `${rows.length} problems` : "no problems");
await b.close();
