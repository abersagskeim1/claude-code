// Upload thumbnail (Folge 9): the frame-0 motif (art-deco frame, own tower with the red euro sign without text, hat + moustache, Klotz with mini top hat shocked bottom right),
// rendered from the real composition at t = 0, captions hidden, the picture moved down under the text, "GEKAUFT?!" in yellow with a thick outline.
// Usage: PUPPETEER_CORE=<path> node tools/thumb.mjs <preview_url> <out_png>
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
    #hook-out { transform: translateY(40px) !important; }
    #hook-glow { scale: 1.1; }
    #thumb-txt { position: absolute; left: 70px; top: 290px; width: 940px; text-align: center; z-index: 99; font-family: 'Lilita One'; color: #FFD23F;
      line-height: 1.0; -webkit-text-stroke: 28px #0A0F22; paint-order: stroke fill; text-shadow: 0 18px 0 #050814; }
    #thumb-txt span { display: block; } #thumb-txt .a { font-size: 180px; margin-top: 110px; } #thumb-txt .b { font-size: 140px; letter-spacing: -0.01em; }`;
  document.head.appendChild(st);
  const d = document.createElement("div"); d.id = "thumb-txt"; d.innerHTML = '<span class="a">GEKAUFT?!</span>';
  document.querySelector("#root").appendChild(d);
});
await p.evaluate(() => document.fonts.ready);
await seek(0.05); await seek(0);
const box = await p.evaluate(() => [...document.querySelectorAll("#thumb-txt span")].map((e) => { const r = e.getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom].map(Math.round).join(","); }).join(" / "));
await p.screenshot({ path: png, type: "png" });
await b.close();
console.log("ok text", box);
