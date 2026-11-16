import fs from "node:fs";
const V = "/home/user/kanal/folge01/video/compositions/";
const k = fs.readFileSync(V + "klotz.html", "utf8");
let svg = k.slice(k.indexOf("<svg"), k.indexOf("</svg>") + 6);
const T = (id, tr) => { svg = svg.replace(`id="${id}"`, `id="${id}" transform="${tr}"`); };
T("k-armL", "rotate(70 48 190)"); T("k-armR", "rotate(-70 252 190)");
T("k-eyeL", "translate(108 140) scale(1.14) translate(-108 -140)"); T("k-eyeR", "translate(192 140) scale(1.14) translate(-192 -140)");
T("k-pupL", "translate(108 142) scale(0.58) translate(-108 -142)"); T("k-pupR", "translate(192 142) scale(0.58) translate(-192 -142)");
T("k-lidL", "scale(1 0)"); T("k-lidR", "scale(1 0)");
T("k-browL", "translate(0 -20) rotate(-8 109 81)"); T("k-browR", "translate(0 -20) rotate(8 191 81)");
T("k-mouth", "translate(150 228) scale(1.05 1.25) translate(-150 -228)"); T("k-grin", "scale(0)");
const hook = fs.readFileSync(V + "hook.html", "utf8");
const mapSvg = hook.slice(hook.indexOf('<div id="hook-map"'), hook.indexOf('<div id="hook-emu"'));
const sym = hook.slice(hook.indexOf("<defs>") + 6, hook.indexOf("</defs>"));
const burst = hook.slice(hook.indexOf('<div id="hook-burst"'), hook.indexOf('<div id="hook-map"'));
const html = `<!doctype html>
<html lang="de"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1080, height=1920"/>
<style>
@font-face{font-family:'Lilita One';src:url('assets/fonts/LilitaOne-latin.woff2') format('woff2');font-display:block;}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:#0E1530}
#root{position:relative;width:1080px;height:1920px;overflow:hidden;background:#0E1530}
#glow{position:absolute;inset:0;background:radial-gradient(circle at 50% 52%,#24387A 0%,#16224A 38%,#0E1530 72%)}
#rays{position:absolute;left:-760px;top:-200px;width:2600px;height:2600px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(255,255,255,.055) 0deg 6deg,rgba(255,255,255,0) 6deg 15deg)}
#vig{position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,rgba(0,0,0,0) 55%,rgba(4,7,20,.6) 100%)}
.hook-stk{filter:drop-shadow(5px 0 0 #fff) drop-shadow(-5px 0 0 #fff) drop-shadow(0 5px 0 #fff) drop-shadow(0 -5px 0 #fff) drop-shadow(0 14px 0 rgba(0,0,0,.35))}
#hook-burst{position:absolute;left:110px;top:780px;width:800px;height:800px;opacity:.9}
#hook-map{position:absolute;left:120px;top:880px;width:720px;height:624px}
#hook-emu{position:absolute;left:370px;top:940px;width:250px;height:325px}
#stage{position:absolute;inset:0;transform:scale(1.12);transform-origin:480px 1180px}
#txt{position:absolute;left:80px;top:300px;width:920px;text-align:center;font-family:'Lilita One';color:#FFD23F;line-height:1;-webkit-text-stroke:24px #0A0F22;paint-order:stroke fill;text-shadow:0 16px 0 #050814}
#txt .a{font-size:150px} #txt .b{font-size:220px}
#klotz{position:absolute;left:690px;top:1480px;width:260px;height:286px}
#kshadow{position:absolute;left:715px;top:1748px;width:210px;height:30px;border-radius:50%;background:rgba(0,0,0,.35)}
</style></head><body>
<div id="root" data-composition-id="thumb" data-start="0" data-duration="1" data-width="1080" data-height="1920" data-no-timeline>
<svg width="0" height="0" style="position:absolute"><defs>${sym}</defs></svg>
<div id="glow"></div><div id="rays"></div><div id="vig"></div>
<div id="stage">${burst}${mapSvg}<div id="hook-emu" class="hook-stk"><svg viewBox="0 0 200 260" width="100%" height="100%" overflow="visible"><use href="#hook-emuh"/></svg></div></div>
<div id="txt"><span class="a">KRIEG GEGEN</span><br/><span class="b">EMUS?!</span></div>
<div id="kshadow"></div><div id="klotz">${svg}</div>
</div></body></html>`;
fs.writeFileSync("/home/user/kanal/folge01/thumb/index.html", html);
console.log("ok");
