// Caption layout check: lines, words per line and the text block box of every caption while fully shown.
// Usage: PUPPETEER_CORE=<path> node tools/layout.mjs <preview_url>
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const puppeteer = require(process.env.PUPPETEER_CORE);
const [url] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox"], headless: true });
const p = await b.newPage(); await p.setViewport({ width: 1080, height: 1920 });
await p.goto(url, { waitUntil: "networkidle0", timeout: 90000 });
await p.waitForFunction(() => window.__player && window.__playerReady !== false, { timeout: 60000 });
await new Promise((r) => setTimeout(r, 1500));
const caps = await p.evaluate(() => [...document.querySelectorAll('[data-composition-id="captions"] .cap')].map((c) => ({ id: c.id, s: +c.dataset.start, d: +c.dataset.duration })));
let bad = 0;
for (const c of caps) {
  const t = c.s + c.d - 0.2;
  await p.evaluate(async (t) => { window.__player.renderSeek(t); if (window.__hfWaitForSeekCompletion) await window.__hfWaitForSeekCompletion(); }, t);
  const res = await p.evaluate((id) => {
    const lines = {}; let L = 1e9, T = 1e9, Rr = -1e9, B = -1e9;
    document.querySelectorAll(`#${id} .g`).forEach((g) => { const r = g.getBoundingClientRect(); const k = Math.round(r.bottom / 25); (lines[k] ||= []).push(g.textContent); L = Math.min(L, r.left); T = Math.min(T, r.top); Rr = Math.max(Rr, r.right); B = Math.max(B, r.bottom); });
    return { lines: Object.keys(lines).sort((a, b) => a - b).map((k) => lines[k]), box: [L, T, Rr, B].map(Math.round) };
  }, c.id);
  const last = res.lines[res.lines.length - 1];
  const issues = [];
  if (res.lines.length > 1 && last.length === 1) issues.push("ORPHAN");
  if (res.box[0] < 80 || res.box[2] > 1000) issues.push("SIDE");
  if (res.box[1] < 280 || res.box[3] > 1500) issues.push("Y");
  if (res.box[2] - res.box[0] > 920) issues.push("WIDE");
  if (issues.length) bad++;
  console.log(`${c.id} @${t.toFixed(2)} box ${res.box.join(",")} w${res.box[2] - res.box[0]} | ${res.lines.map((l) => l.join(" ")).join(" / ")} ${issues.join(" ")}`);
}
console.log(bad ? bad + " captions with issues" : "captions ok");
await b.close();
