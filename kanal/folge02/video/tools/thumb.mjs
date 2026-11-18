// Builds the upload thumbnail page (frame-1 motif, enlarged) from the generated compositions.
// Usage: node tools/thumb.mjs <video_dir> <thumb_dir>
import fs from "node:fs";
import path from "node:path";
const V = process.argv[2], OUTD = process.argv[3];
fs.mkdirSync(path.join(OUTD, "assets", "fonts"), { recursive: true });
fs.copyFileSync(path.join(V, "assets/fonts/LilitaOne-latin.woff2"), path.join(OUTD, "assets/fonts/LilitaOne-latin.woff2"));

// Klotz, frozen in the shock pose
const k = fs.readFileSync(path.join(V, "compositions/klotz.html"), "utf8");
let svg = k.slice(k.indexOf("<svg"), k.indexOf("</svg>") + 6);
const T = (id, tr) => { svg = svg.replace(`id="${id}"`, `id="${id}" transform="${tr}"`); };
T("k-armL", "rotate(70 48 190)"); T("k-armR", "rotate(-70 252 190)");
T("k-eyeL", "translate(108 140) scale(1.14) translate(-108 -140)"); T("k-eyeR", "translate(192 140) scale(1.14) translate(-192 -140)");
T("k-pupL", "translate(108 142) scale(0.58) translate(-108 -142)"); T("k-pupR", "translate(192 142) scale(0.58) translate(-192 -142)");
T("k-lidL", "scale(1 0)"); T("k-lidR", "scale(1 0)");
T("k-browL", "translate(0 -20) rotate(-8 109 81)"); T("k-browR", "translate(0 -20) rotate(8 191 81)");
T("k-mouth", "translate(150 228) scale(1.05 1.25) translate(-150 -228)"); T("k-grin", "scale(0)");
svg = svg.replace('<g id="k-mask">', '<g id="k-mask" opacity="0">').replace('<g id="k-spray"', '<g id="k-spray" opacity="0"');

// hook picture: styles, symbols and markup from the generated hook scene
const hook = fs.readFileSync(path.join(V, "compositions/hook.html"), "utf8");
const css = hook.slice(hook.indexOf("<style>") + 7, hook.indexOf("</style>")).replace(/#root\s*\{[^}]*\}/, "").replace(/@font-face\{[^}]*\}/, "");
const defs = hook.slice(hook.indexOf("<defs>") + 6, hook.indexOf("</defs>"));
const body = hook.slice(hook.indexOf('<div id="hook-kb">') + 18, hook.lastIndexOf("</div></div>"));

const html = `<!doctype html>
<html lang="de"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1080, height=1920"/>
<style>
@font-face{font-family:'Lilita One';src:url('assets/fonts/LilitaOne-latin.woff2') format('woff2');font-display:block;}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:#0E1530}
#root{position:relative;width:1080px;height:1920px;overflow:hidden;background:#0E1530}
#glow{position:absolute;inset:0;background:radial-gradient(circle at 50% 55%,#24387A 0%,#16224A 40%,#0E1530 74%)}
#rays{position:absolute;left:-760px;top:-240px;width:2600px;height:2600px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(255,255,255,.05) 0deg 6deg,rgba(255,255,255,0) 6deg 15deg)}
#grid{position:absolute;left:0;top:-60px;width:1080px;height:2040px;background-image:linear-gradient(rgba(255,255,255,.035) 2px,transparent 2px),linear-gradient(90deg,rgba(255,255,255,.035) 2px,transparent 2px);background-size:60px 60px}
#vig{position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,rgba(0,0,0,0) 55%,rgba(4,7,20,.6) 100%)}
${css}
#stage{position:absolute;inset:0;transform:scale(1.13);transform-origin:500px 1330px}
#txt{position:absolute;left:80px;top:280px;width:920px;text-align:center;font-family:'Lilita One';color:#FFD23F;line-height:.98;-webkit-text-stroke:26px #0A0F22;paint-order:stroke fill;text-shadow:0 16px 0 #050814}
#txt .a{font-size:180px} #txt .b{font-size:230px}
#klotz{position:absolute;left:700px;top:1480px;width:260px;height:286px;transform:rotate(-6deg)}
#kshadow{position:absolute;left:725px;top:1748px;width:210px;height:30px;border-radius:50%;background:rgba(0,0,0,.35)}
</style></head><body>
<div id="root" data-composition-id="thumb" data-start="0" data-duration="1" data-width="1080" data-height="1920">
<svg width="0" height="0" style="position:absolute"><defs>${defs}</defs></svg>
<div id="glow"></div><div id="rays"></div><div id="grid"></div><div id="vig"></div>
<div id="stage">${body}</div>
<div id="txt"><span class="a">TAUSENDE</span><br/><span class="b">K.O.?!</span></div>
<div id="kshadow"></div><div id="klotz">${svg}</div>
</div>
<script>window.__timelines = window.__timelines || {}; window.__timelines["thumb"] = gsap.timeline({ paused: true });</script>
</body></html>`;
fs.writeFileSync(path.join(OUTD, "index.html"), html.replace("<style>", '<script src="assets/gsap.min.js"></script>\n<style>'));
fs.copyFileSync(path.join(V, "assets/vendor/gsap.min.js"), path.join(OUTD, "assets/gsap.min.js"));
console.log("ok");
