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
    // words belong to one line when their boxes overlap vertically (mixed font sizes have different bottoms)
    let L = 1e9, T = 1e9, Rr = -1e9, B = -1e9; const ws = [];
    document.querySelectorAll(`#${id} .g`).forEach((g) => { const r = g.getBoundingClientRect(); ws.push({ t: g.textContent, top: r.top, bot: r.bottom, l: r.left }); L = Math.min(L, r.left); T = Math.min(T, r.top); Rr = Math.max(Rr, r.right); B = Math.max(B, r.bottom); });
    const lines = [];
    for (const w of ws) { const ln = lines.find((x) => Math.min(x.bot, w.bot) - Math.max(x.top, w.top) > 0.5 * Math.min(x.bot - x.top, w.bot - w.top)); if (ln) { ln.w.push(w); ln.top = Math.min(ln.top, w.top); ln.bot = Math.max(ln.bot, w.bot); } else lines.push({ top: w.top, bot: w.bot, w: [w] }); }
    lines.sort((a, b) => a.top - b.top);
    return { lines: lines.map((x) => x.w.sort((a, b) => a.l - b.l).map((w) => w.t)), box: [L, T, Rr, B].map(Math.round) };
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
