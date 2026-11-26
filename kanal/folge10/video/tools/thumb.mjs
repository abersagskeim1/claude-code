// Upload thumbnail (Folge 10): the frame-0 motif (pixel hero with raised sword charging a pile of dragon eggs, dust cloud,
// Klotz shocked bottom right), rendered from the real composition at t = 0, captions hidden, "32,33 %?!" in yellow with a thick outline.
// No negative letter spacing. Usage: PUPPETEER_CORE=<path> node tools/thumb.mjs <preview_url> <out_png>
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const puppeteer = require(process.env.PUPPETEER_CORE);
const [url, png] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox"], headless: true });
const p = await b.newPage(); await p.setViewport({ width: 1080, height: 1920 });
await p.goto(url, { waitUntil: "networkidle0", timeout: 90000 });
await p.waitForFunction(() => window.__player && window.__playerReady !== false, { timeout: 60000 });
await new Promise((r) => setTimeout(r, 1500));
const seek = (t) => p.evaluate(async (t) => { window.__player.renderSeek(t); if (window.__hfWaitForSeekCompletion) await window.__hfWaitForSeekCompletion(); }, t);
await p.evaluate(() => {
  const st = document.createElement("style");
  st.textContent = `[data-composition-id="captions"] { opacity: 0 !important; }
    #hook-glow { scale: 1.15; }
    #thumb-txt { position: absolute; left: 80px; top: 420px; width: 920px; text-align: center; z-index: 99; font-family: 'Lilita One'; color: #FFD23F;
      line-height: 1.0; letter-spacing: 0.02em; -webkit-text-stroke: 30px #0A0F22; paint-order: stroke fill; text-shadow: 0 18px 0 #050814; }
    #thumb-txt span { display: inline-block; font-size: 190px; }`;
  document.head.appendChild(st);
  const d = document.createElement("div"); d.id = "thumb-txt"; d.innerHTML = '<span id="thumb-a">32,33 %?!</span>';
  document.querySelector("#root").appendChild(d);
});
await p.evaluate(() => document.fonts.ready);
await seek(0.05); await seek(0);
const box = await p.evaluate(() => { const r = document.querySelector("#thumb-a").getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom].map(Math.round).join(","); });
await p.screenshot({ path: png, type: "png" });
await b.close();
console.log("ok text", box);
