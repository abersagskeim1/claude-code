// Builds the upload thumbnail (frame-1 motif: knighted penguin, enlarged; Klotz shocked bottom right; "SIR PINGUIN?!") and screenshots it to PNG.
// Usage: PUPPETEER_CORE=<path> node tools/thumb.mjs <video_dir> <thumb_dir> <out_png>
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const V = process.argv[2], OUTD = process.argv[3], PNG = process.argv[4];
fs.mkdirSync(path.join(OUTD, "assets", "fonts"), { recursive: true });
fs.copyFileSync(path.join(V, "assets/fonts/LilitaOne-latin.woff2"), path.join(OUTD, "assets/fonts/LilitaOne-latin.woff2"));

// Klotz in the frame-0 shock pose (no salute arm, no medal)
const k = fs.readFileSync(path.join(V, "compositions/klotz.html"), "utf8");
const a = k.indexOf('<svg viewBox="0 0 300 330"');
let svg = k.slice(a, k.indexOf("</svg>\n", a) + 6);
const T = (id, tr) => { svg = svg.replace(`id="${id}"`, `id="${id}" transform="${tr}"`); };
T("k-armL", "rotate(70 48 190)"); T("k-armR", "rotate(-70 252 190)");
T("k-eyeL", "translate(108 140) scale(1.14) translate(-108 -140)"); T("k-eyeR", "translate(192 140) scale(1.14) translate(-192 -140)");
T("k-pupL", "translate(108 142) scale(0.58) translate(-108 -142)"); T("k-pupR", "translate(192 142) scale(0.58) translate(-192 -142)");
T("k-lidL", "scale(1 0)"); T("k-lidR", "scale(1 0)");
T("k-browL", "translate(0 -20) rotate(-8 109 81)"); T("k-browR", "translate(0 -20) rotate(8 191 81)");
T("k-mouth", "translate(150 228) scale(1.05 1.25) translate(-150 -228)"); T("k-grin", "scale(0)");
for (const id of ["k-sal", "k-med"]) svg = svg.replace(`id="${id}"`, `id="${id}" opacity="0"`);
const pod = k.slice(k.indexOf('<div id="k-pod">') + 16, k.indexOf("</div>", k.indexOf('<div id="k-pod">')));

// background and hook picture from the generated compositions
const bg = fs.readFileSync(path.join(V, "compositions/bg.html"), "utf8");
const bgCss = bg.slice(bg.indexOf("<style>") + 7, bg.indexOf("</style>")).replace(/#root\s*\{[^}]*\}/, "");
const bgBody = bg.slice(bg.indexOf("data-layout-allow-overflow>") + 27, bg.indexOf("</div>\n  <script>"));
const hook = fs.readFileSync(path.join(V, "compositions/hook.html"), "utf8");
const css = hook.slice(hook.indexOf("<style>") + 7, hook.indexOf("</style>")).replace(/#root\s*\{[^}]*\}/, "").replace(/@font-face\{[^}]*\}/, "");
const body = hook.slice(hook.indexOf('<div id="hook-kb">') + 18, hook.lastIndexOf("</div></div>"));

const html = `<!doctype html>
<html lang="de"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1080, height=1920"/>
<style>
@font-face{font-family:'Lilita One';src:url('assets/fonts/LilitaOne-latin.woff2') format('woff2');font-display:block;}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:#0E1530}
#root{position:relative;width:1080px;height:1920px;overflow:hidden;background:#0E1530}
#bgw{position:absolute;inset:0}
${bgCss}
${css}
#stage{position:absolute;inset:0;transform:scale(1.1);transform-origin:520px 1400px}
#txt{position:absolute;left:80px;top:300px;width:920px;text-align:center;font-family:'Lilita One';color:#FFD23F;line-height:.98;-webkit-text-stroke:28px #0A0F22;paint-order:stroke fill;text-shadow:0 18px 0 #050814}
#txt .a{font-size:200px} #txt .b{font-size:178px}
#pod{position:absolute;left:620px;top:1760px;width:420px;height:130px}
#klotz{position:absolute;left:665px;top:1430px;width:310px;height:341px;transform:rotate(-6deg)}
</style></head><body>
<div id="root">
<div id="bgw">${bgBody}</div>
<div id="stage">${body}</div>
<div id="txt"><span class="a">SIR</span><br/><span class="b">PINGUIN?!</span></div>
<div id="pod">${pod}</div><div id="klotz">${svg}</div>
</div>
</body></html>`;
fs.writeFileSync(path.join(OUTD, "index.html"), html);
const puppeteer = require(process.env.PUPPETEER_CORE);
const b = await puppeteer.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox", "--allow-file-access-from-files"], headless: true });
const p = await b.newPage(); await p.setViewport({ width: 1080, height: 1920 });
await p.goto("file://" + path.resolve(OUTD, "index.html"), { waitUntil: "networkidle0" });
await p.evaluate(() => document.fonts.ready);
const box = await p.evaluate(() => { return [...document.querySelectorAll("#txt span")].map((e) => { const r = e.getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom].map(Math.round).join(","); }).join(" / "); });
await p.screenshot({ path: PNG, type: "png" });
await b.close();
console.log("ok text spans", box);
