// Builds the upload thumbnail (frame-1 motif, enlarged, "41 DOLLAR?!") and screenshots it to PNG.
// Usage: PUPPETEER_CORE=<path> node tools/thumb.mjs <video_dir> <thumb_dir> <out_png>
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const V = process.argv[2], OUTD = process.argv[3], PNG = process.argv[4];
fs.mkdirSync(path.join(OUTD, "assets", "fonts"), { recursive: true });
fs.copyFileSync(path.join(V, "assets/fonts/LilitaOne-latin.woff2"), path.join(OUTD, "assets/fonts/LilitaOne-latin.woff2"));

// Klotz, frozen in the shock pose (no slice, thumb, crumbs or red face)
const k = fs.readFileSync(path.join(V, "compositions/klotz.html"), "utf8");
let svg = k.slice(k.indexOf("<svg viewBox=\"0 0 300 330\""), k.indexOf("</svg>", k.indexOf("<svg viewBox=\"0 0 300 330\"")) + 6);
const T = (id, tr) => { svg = svg.replace(`id="${id}"`, `id="${id}" transform="${tr}"`); };
T("k-armL", "rotate(70 48 190)"); T("k-armR", "rotate(-70 252 190)");
T("k-eyeL", "translate(108 140) scale(1.14) translate(-108 -140)"); T("k-eyeR", "translate(192 140) scale(1.14) translate(-192 -140)");
T("k-pupL", "translate(108 142) scale(0.58) translate(-108 -142)"); T("k-pupR", "translate(192 142) scale(0.58) translate(-192 -142)");
T("k-lidL", "scale(1 0)"); T("k-lidR", "scale(1 0)");
T("k-browL", "translate(0 -20) rotate(-8 109 81)"); T("k-browR", "translate(0 -20) rotate(8 191 81)");
T("k-mouth", "translate(150 228) scale(1.05 1.25) translate(-150 -228)"); T("k-grin", "scale(0)");
for (const id of ["k-slice", "k-thumb", "k-crumbs", "k-puffs", "k-red"]) svg = svg.replace(`id="${id}"`, `id="${id}" opacity="0"`);

// hook picture from the generated hook scene
const hook = fs.readFileSync(path.join(V, "compositions/hook.html"), "utf8");
const css = hook.slice(hook.indexOf("<style>") + 7, hook.indexOf("</style>")).replace(/#root\s*\{[^}]*\}/, "");
const defs = hook.slice(hook.indexOf("<defs>") + 6, hook.indexOf("</defs>"));
const body = hook.slice(hook.indexOf('<div id="hook-kb">') + 18, hook.lastIndexOf("</div></div>"));

const html = `<!doctype html>
<html lang="de"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1080, height=1920"/>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:#0E1530}
#root{position:relative;width:1080px;height:1920px;overflow:hidden;background:#0E1530}
#glow{position:absolute;inset:0;background:radial-gradient(circle at 50% 58%,#2A3A80 0%,#17234D 42%,#0E1530 76%)}
#rays{position:absolute;left:-760px;top:-200px;width:2600px;height:2600px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(255,210,63,.045) 0deg 7.5deg,rgba(255,255,255,0) 7.5deg 20deg)}
#dots{position:absolute;left:-80px;top:-80px;width:1240px;height:2080px;background-image:radial-gradient(circle,rgba(255,255,255,.05) 7px,transparent 8px);background-size:80px 80px}
#vig{position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,rgba(0,0,0,0) 55%,rgba(4,7,20,.6) 100%)}
${css}
#stage{position:absolute;inset:0;transform:scale(1.16);transform-origin:430px 1150px}
#txt{position:absolute;left:80px;top:290px;width:920px;text-align:center;font-family:'Lilita One';color:#FFD23F;line-height:.95;-webkit-text-stroke:28px #0A0F22;paint-order:stroke fill;text-shadow:0 18px 0 #050814}
#txt .a{font-size:250px} #txt .b{font-size:205px}
#klotz{position:absolute;left:690px;top:1440px;width:300px;height:330px;transform:rotate(-6deg)}
#kshadow{position:absolute;left:720px;top:1752px;width:240px;height:34px;border-radius:50%;background:rgba(0,0,0,.35)}
</style></head><body>
<div id="root">
<svg width="0" height="0" style="position:absolute"><defs>${defs}</defs></svg>
<div id="glow"></div><div id="rays"></div><div id="dots"></div><div id="vig"></div>
<div id="stage">${body}</div>
<div id="txt"><span class="a">41</span><br/><span class="b">DOLLAR?!</span></div>
<div id="kshadow"></div><div id="klotz">${svg}</div>
</div>
</body></html>`;
fs.writeFileSync(path.join(OUTD, "index.html"), html);
const puppeteer = require(process.env.PUPPETEER_CORE);
const b = await puppeteer.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox", "--allow-file-access-from-files"], headless: true });
const p = await b.newPage(); await p.setViewport({ width: 1080, height: 1920 });
await p.goto("file://" + path.resolve(OUTD, "index.html"), { waitUntil: "networkidle0" });
await p.evaluate(() => document.fonts.ready);
const box = await p.evaluate(() => { const r = document.getElementById("txt").getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom].map(Math.round); });
await p.screenshot({ path: PNG, type: "png" });
await b.close();
console.log("ok text box", box.join(","));
