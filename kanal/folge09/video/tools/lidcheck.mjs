// Per-frame check of Klotz's eyelids: no frame may show both lids (partly) closed, i.e. a sleepy look.
// A one-eye wink is allowed; frames with exactly one lid closing are listed as WINK.
// Usage: PUPPETEER_CORE=<path> node tools/lidcheck.mjs <preview_url>
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const puppeteer = require(process.env.PUPPETEER_CORE);
const [url] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox"], headless: true });
const p = await b.newPage(); await p.setViewport({ width: 1080, height: 1920 });
await p.goto(url, { waitUntil: "networkidle0", timeout: 90000 });
await p.waitForFunction(() => window.__player && window.__playerReady !== false, { timeout: 60000 });
await new Promise((r) => setTimeout(r, 1500));
const dur = await p.evaluate(() => window.__player.getDuration());
let bad = 0, wink = [];
for (let f = 0; f < Math.round(dur * 30); f++) {
  const t = f / 30;
  await p.evaluate(async (t) => { window.__player.renderSeek(t); if (window.__hfWaitForSeekCompletion) await window.__hfWaitForSeekCompletion(); }, t);
  // lid cover = the lid's scaleY (0 open, 1 closed), read from GSAP (rotation of Klotz does not distort it)
  const [l, r] = await p.evaluate(() => ["#k-lidL", "#k-lidR"].map((id) => +gsap.getProperty(document.querySelector(id), "scaleY")));
  const cl = l > 0.04, cr = r > 0.04;
  if (cl && cr) { bad++; console.log(`f${f} t=${t.toFixed(3)} BOTH lids closing L ${l.toFixed(2)} R ${r.toFixed(2)}`); }
  else if (cl || cr) wink.push(`f${f}(${(cl ? "L" : "R")}${Math.max(l, r).toFixed(2)})`);
}
console.log("one-eye frames (wink):", wink.join(" ") || "none");
console.log(bad ? `${bad} frames with both lids closing` : "lids ok: no frame with both lids (partly) closed");
await b.close();
