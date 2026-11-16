// Generator for Folge 1 "Der Emu-Krieg": writes index.html and compositions/*.html
import fs from "node:fs";
import path from "node:path";

const OUT = process.argv[2];
const DUR = 32.5;
fs.mkdirSync(path.join(OUT, "compositions"), { recursive: true });

// ---------- seeded random ----------
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const R = mulberry32(1932);
const r = (a, b) => +(a + (b - a) * R()).toFixed(2);

// ---------- shared drawings (flat, own shapes) ----------
const EMU_BODY = `
  <g stroke="#E0A060" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="M85 178 L76 214 L88 246 M88 246 L72 252 M88 246 L104 252"/>
    <path d="M116 178 L124 214 L114 246 M114 246 L98 252 M114 246 L130 252"/>
  </g>
  <path d="M146 116 C150 84 144 62 150 44" stroke="#8FB8E0" stroke-width="22" stroke-linecap="round" fill="none"/>
  <ellipse cx="100" cy="140" rx="72" ry="54" fill="#8A6A50"/>
  <g fill="#8A6A50"><circle cx="40" cy="122" r="18"/><circle cx="60" cy="100" r="21"/><circle cx="88" cy="90" r="23"/><circle cx="118" cy="93" r="20"/><circle cx="142" cy="106" r="17"/><circle cx="36" cy="152" r="16"/><circle cx="164" cy="138" r="14"/></g>
  <ellipse cx="110" cy="150" rx="42" ry="26" fill="#A8876C"/>
  <g stroke="#5E4634" stroke-width="5" fill="none" stroke-linecap="round"><path d="M62 124 q18 -10 36 0"/><path d="M76 146 q16 -8 30 0"/></g>
  <circle cx="152" cy="38" r="22" fill="#6E5442"/>
  <path d="M170 31 L198 39 L170 47 Z" fill="#F2C14E"/>
  <circle cx="157" cy="32" r="8.5" fill="#fff"/><circle cx="159.5" cy="32" r="4.6" fill="#111"/>`;
const HELMET_ON_HEAD = `
  <path d="M124 34 Q124 4 154 4 Q182 4 182 30 Z" fill="#6B8E3D"/>
  <path d="M116 33 L190 30 Q192 38 184 39 L120 41 Q112 40 116 33 Z" fill="#4A6629"/>
  <path d="M136 16 Q144 9 156 9" stroke="#9CC06A" stroke-width="5" fill="none" stroke-linecap="round"/>`;
const symEmu = (id) => `<symbol id="${id}" viewBox="0 0 200 260">${EMU_BODY}</symbol>`;
const symEmuHelmet = (id) => `<symbol id="${id}" viewBox="0 0 200 260">${EMU_BODY}${HELMET_ON_HEAD}</symbol>`;
const symMG = (id) => `<symbol id="${id}" viewBox="0 0 420 170">
  <path d="M10 72 L94 60 L102 112 L18 132 Z" fill="#8B5A2B"/><path d="M18 80 L90 70" stroke="#A8743E" stroke-width="6" stroke-linecap="round"/>
  <path d="M120 100 L142 100 L134 142 L112 142 Z" fill="#2D3540"/>
  <rect x="90" y="55" width="124" height="52" rx="9" fill="#3B4552"/>
  <rect x="200" y="58" width="172" height="42" rx="19" fill="#4B5563"/>
  <rect x="210" y="62" width="150" height="7" rx="3" fill="#6B7684"/>
  <g stroke="#2D3540" stroke-width="4">${Array.from({ length: 11 }, (_, i) => `<line x1="${216 + i * 14}" y1="72" x2="${216 + i * 14}" y2="96"/>`).join("")}</g>
  <rect x="366" y="70" width="46" height="17" rx="6" fill="#2D3540"/>
  <ellipse cx="160" cy="42" rx="64" ry="19" fill="#5B6573"/><ellipse cx="160" cy="38" rx="64" ry="15" fill="#6B7684"/><ellipse cx="160" cy="38" rx="20" ry="6" fill="#2D3540"/>
  <g stroke="#2D3540" stroke-width="8" stroke-linecap="round"><line x1="330" y1="98" x2="302" y2="160"/><line x1="330" y1="98" x2="360" y2="160"/></g>
</symbol>`;
const symBullet = (id) => `<symbol id="${id}" viewBox="0 0 40 120">
  <path d="M6 44 L6 28 Q20 -6 34 28 L34 44 Z" fill="#C9653A"/><path d="M12 30 Q16 14 20 10" stroke="#E89A6E" stroke-width="4" fill="none" stroke-linecap="round"/>
  <rect x="6" y="42" width="28" height="70" rx="4" fill="#E0A93A"/><rect x="11" y="48" width="6" height="58" rx="3" fill="#F5CF7A"/>
  <rect x="3" y="106" width="34" height="12" rx="3" fill="#C68F25"/></symbol>`;
const symHelmet = (id) => `<symbol id="${id}" viewBox="0 0 240 150">
  <path d="M34 112 Q34 18 120 18 Q206 18 206 112 Z" fill="#6B8E3D"/>
  <path d="M70 52 Q88 34 116 32" stroke="#9CC06A" stroke-width="12" fill="none" stroke-linecap="round"/>
  <ellipse cx="120" cy="116" rx="114" ry="20" fill="#4A6629"/></symbol>`;
const symCross = (id) => `<symbol id="${id}" viewBox="0 0 200 200">
  <g stroke="#FF3B3B" stroke-width="10" fill="none" stroke-linecap="round"><circle cx="100" cy="100" r="78"/><circle cx="100" cy="100" r="30" stroke-width="6"/>
  <line x1="100" y1="6" x2="100" y2="58"/><line x1="100" y1="142" x2="100" y2="194"/><line x1="6" y1="100" x2="58" y2="100"/><line x1="142" y1="100" x2="194" y2="100"/></g>
  <circle cx="100" cy="100" r="7" fill="#FF3B3B"/></symbol>`;
const symWheat = (id) => `<symbol id="${id}" viewBox="0 0 60 200">
  <path d="M30 200 L30 40" stroke="#C99A3A" stroke-width="6"/>
  <g fill="#F2C14E">${[0, 1, 2, 3, 4].map((i) => `<ellipse cx="20" cy="${50 + i * 22}" rx="9" ry="15" transform="rotate(-25 20 ${50 + i * 22})"/><ellipse cx="40" cy="${50 + i * 22}" rx="9" ry="15" transform="rotate(25 40 ${50 + i * 22})"/>`).join("")}
  <ellipse cx="30" cy="30" rx="8" ry="16"/></g></symbol>`;
const symTrophy = (id) => `<symbol id="${id}" viewBox="0 0 120 140">
  <g stroke="#E0A93A" stroke-width="10" fill="none" stroke-linecap="round"><path d="M28 22 Q2 22 8 46 Q14 62 32 64"/><path d="M92 22 Q118 22 112 46 Q106 62 88 64"/></g>
  <path d="M24 8 H96 V40 Q96 86 60 90 Q24 86 24 40 Z" fill="#FFD23F"/><path d="M38 18 V44 Q40 66 54 74" stroke="#FFF2B0" stroke-width="7" fill="none" stroke-linecap="round"/>
  <rect x="52" y="88" width="16" height="22" fill="#E0A93A"/><rect x="28" y="108" width="64" height="24" rx="6" fill="#E0A93A"/><rect x="36" y="114" width="48" height="8" rx="3" fill="#FFD23F"/></symbol>`;
const symGlove = (id) => `<symbol id="${id}" viewBox="0 0 100 110">
  <path d="M20 44 Q18 10 56 10 Q92 10 92 48 Q92 82 58 84 L36 84 Q18 82 18 62 Z" fill="#FF3B3B"/>
  <ellipse cx="26" cy="54" rx="14" ry="20" fill="#E02A2A"/><path d="M48 24 Q66 18 78 30" stroke="#FF8A8A" stroke-width="7" fill="none" stroke-linecap="round"/>
  <rect x="30" y="82" width="46" height="22" rx="6" fill="#fff"/></symbol>`;
const symTank = (id) => `<symbol id="${id}" viewBox="0 0 540 330">
  <path d="M244 112 C246 84 240 66 246 48" stroke="#8FB8E0" stroke-width="20" stroke-linecap="round" fill="none"/>
  <circle cx="248" cy="42" r="20" fill="#6E5442"/><path d="M264 36 L290 43 L264 50 Z" fill="#F2C14E"/>
  <circle cx="253" cy="37" r="7.5" fill="#fff"/><circle cx="255" cy="37" r="4" fill="#111"/>
  <path d="M222 38 Q222 10 250 10 Q276 10 276 34 Z" fill="#6B8E3D"/><path d="M214 37 L284 34 Q286 42 278 43 L218 45 Q210 44 214 37 Z" fill="#4A6629"/>
  <rect x="344" y="122" width="186" height="26" rx="9" fill="#4A6629"/><rect x="514" y="116" width="22" height="38" rx="6" fill="#3A5220"/>
  <path d="M150 182 Q158 110 258 104 Q352 110 362 182 Z" fill="#6B8E3D"/><path d="M186 140 Q206 120 244 116" stroke="#9CC06A" stroke-width="9" fill="none" stroke-linecap="round"/>
  <ellipse cx="250" cy="110" rx="40" ry="11" fill="#3A5220"/>
  <path d="M50 236 L92 180 L448 180 L492 236 Z" fill="#5E7D3B"/><rect x="92" y="186" width="350" height="8" rx="4" fill="#7FA34C"/>
  <rect x="28" y="230" width="484" height="76" rx="38" fill="#2E3A24"/>
  <g fill="#556B3A">${[76, 152, 228, 304, 380, 456].map((x) => `<circle cx="${x}" cy="268" r="25"/>`).join("")}</g>
  <g fill="#2E3A24">${[76, 152, 228, 304, 380, 456].map((x) => `<circle cx="${x}" cy="268" r="9"/>`).join("")}</g></symbol>`;
// Australia, simplified outline (own drawing)
const AUS = `M60 232 L112 192 L170 150 L208 104 L258 92 L290 60 L330 70 L346 100 L380 86 L396 122 L382 160 L410 192 L440 170 L452 110 L470 30 L492 92 L512 152 L546 220 L576 282 L582 342 L562 402 L532 442 L482 452 L442 432 L412 402 L392 420 L372 382 L332 372 L262 346 L200 352 L142 382 L82 396 L60 362 L54 300 Z`;
const TAS = `M466 482 L512 476 L506 512 L482 520 Z`;

const svgUse = (sym, vb) => `<svg viewBox="${vb}" width="100%" height="100%" overflow="visible"><use href="#${sym}"/></svg>`;

// ---------- common CSS ----------
const STK = `filter: drop-shadow(5px 0 0 #fff) drop-shadow(-5px 0 0 #fff) drop-shadow(0 5px 0 #fff) drop-shadow(0 -5px 0 #fff) drop-shadow(0 14px 0 rgba(0,0,0,.35));`;
const LABEL = `font-family:'Lilita One';color:#FFD23F;-webkit-text-stroke:16px #0A0F22;paint-order:stroke fill;text-shadow:0 10px 0 #050814;`;
const FONTFACE = `@font-face{font-family:'Lilita One';src:url('assets/fonts/LilitaOne-latin.woff2') format('woff2');font-weight:400;font-style:normal;font-display:block;}`;

const abs = (l, t, w, h) => `position:absolute;left:${l}px;top:${t}px;width:${w}px;${h != null ? `height:${h}px;` : ""}`;

function scene(id, title, start, dur, css, body, js, defs = "", opts = {}) {
  const exit = opts.exit !== false, kb = opts.kb !== false, exLead = opts.exitLead || 0, exDur = opts.exitDur || 0.28;
  const html = `<template>
  <style>
    ${FONTFACE}
    #root { position: absolute; inset: 0; overflow: hidden; }
    #${id}-out, #${id}-kb { position: absolute; inset: 0; transform-origin: 540px 1120px; }
    .${id}-stk { ${STK} }
    ${css}
  </style>
  <div id="root" data-composition-id="${id}" data-width="1080" data-height="1920" data-layout-allow-overflow>
    <svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${defs}</defs></svg>
    <div id="${id}-out"><div id="${id}-kb">
${body}
    </div></div>
  </div>
  <script>
    (function () {
      const tl = gsap.timeline({ paused: true });
      // slow Ken-Burns drift on the graphics so the frame never stands still
${kb ? `      tl.fromTo("#${id}-kb", { scale: 1 }, { scale: 1.06, duration: ${dur}, ease: "none" }, 0);` : ""}
${js}
${exit ? `      // overlap exit: fades while the next scene is already entering
      tl.to("#${id}-out", { opacity: 0, scale: 0.92, duration: ${exDur}, ease: "power2.in" }, ${+(dur - exLead).toFixed(2)});` : ""}
      window.__timelines["${id}"] = tl;
    })();
  </script>
</template>
`;
  fs.writeFileSync(path.join(OUT, "compositions", `${id}.html`), html);
  return { id, title, start, dur, host: +(dur + (exit ? 0.3 : 0)).toFixed(2) };
}

const scenes = [];

// ===== S01 hook: Australia + emu with helmet, visible from frame 0 (0 - 2.6) =====
const BURST = (() => { let d = ""; for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; const rr = i % 2 ? 62 : 98; d += (i ? "L" : "M") + (100 + Math.cos(a) * rr).toFixed(1) + " " + (100 + Math.sin(a) * rr).toFixed(1) + " "; } return d + "Z"; })();
const hookCss = (p) => `#${p}-burst{${abs(110, 780, 800, 800)}opacity:.9;}
   #${p}-map{${abs(120, 880, 720, 624)}}
   #${p}-emu{${abs(370, 940, 250, 325)}}`;
const hookBody = (p) => `      <div id="${p}-burst"><svg viewBox="0 0 200 200" width="100%" height="100%"><path fill="#FF3B3B" d="${BURST}"/></svg></div>
      <div id="${p}-map" class="${p}-stk"><svg viewBox="0 0 600 530" width="100%" height="100%"><path d="${AUS}" fill="#3FAE6A" stroke="#1E6B3F" stroke-width="8" stroke-linejoin="round"/><path d="${TAS}" fill="#3FAE6A" stroke="#1E6B3F" stroke-width="8" stroke-linejoin="round"/><path d="M150 250 Q260 220 330 260" stroke="#57C783" stroke-width="10" fill="none" stroke-linecap="round" opacity=".7"/></svg></div>
      <div id="${p}-emu" class="${p}-stk">${svgUse(p + "-emuh", "0 0 200 260")}</div>`;
scenes.push(scene("hook", "Hook: Australien", 0, 2.6, hookCss("hook"), hookBody("hook"),
  `      // frame 0 = thumbnail picture; everything already in place
      tl.fromTo("#hook-burst", { rotation: 0 }, { rotation: 50, duration: 2.6, ease: "none" }, 0);
      tl.to("#hook-kb", { keyframes: { x: [0, -22, 18, -14, 10, -5, 0], y: [0, 8, -6, 4, -2, 0, 0] }, duration: 0.42, ease: "none" }, 0.62);
      tl.fromTo("#hook-emu", { scaleY: 1, scaleX: 1 }, { keyframes: { scaleY: [1, 0.78, 1.08, 1], scaleX: [1, 1.18, 0.96, 1] }, duration: 0.45, ease: "none", transformOrigin: "50% 100%" }, 0.62);
      tl.to("#hook-emu", { rotation: -7, duration: 0.25, yoyo: true, repeat: 5, ease: "sine.inOut", transformOrigin: "50% 100%" }, 1.1);`,
  symEmuHelmet("hook-emuh")));

// ===== S02 who wins: helmet VS emu (2.5 - 3.9) =====
scenes.push(scene("vs", "Rate mal", 2.6, 1.4,
  `#vs-helm{${abs(110, 1010, 340, 212)}}
   #vs-emu{${abs(650, 900, 290, 377)}}
   #vs-txt{${abs(380, 1020, 320, 200)}text-align:center;font-size:180px;line-height:200px;${LABEL}}
   .vs-q{position:absolute;font-size:200px;line-height:1;${LABEL}color:#fff;}
   #vs-q1{left:180px;top:770px;} #vs-q2{left:470px;top:720px;color:#FFD23F;} #vs-q3{left:760px;top:780px;}`,
  `      <div id="vs-helm" class="vs-stk">${svgUse("vs-helmet", "0 0 240 150")}</div>
      <div id="vs-emu" class="vs-stk">${svgUse("vs-emusym", "0 0 200 260")}</div>
      <div id="vs-txt">VS</div>
      <div id="vs-q1" class="vs-q">?</div><div id="vs-q2" class="vs-q">?</div><div id="vs-q3" class="vs-q">?</div>`,
  `      tl.fromTo("#vs-helm", { x: -620, rotation: -40 }, { x: 0, rotation: 0, duration: 0.4, ease: "back.out(1.6)" }, 0);
      tl.fromTo("#vs-emu", { x: 620, rotation: 30 }, { x: 0, rotation: 0, duration: 0.4, ease: "back.out(1.6)" }, 0.05);
      tl.fromTo("#vs-txt", { scale: 3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25, ease: "power4.in" }, 0.25);
      tl.to("#vs-txt", { keyframes: { x: [0, -10, 10, -6, 0] }, duration: 0.2 }, 0.5);
      ["#vs-q1", "#vs-q2", "#vs-q3"].forEach((q, i) => {
        tl.fromTo(q, { scale: 0, rotation: -40 }, { scale: 1, rotation: [-14, 6, 16][i], duration: 0.3, ease: "back.out(3)" }, 0.45 + i * 0.13);
        tl.to(q, { y: -18, rotation: "+=10", duration: 0.3, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0.8 + i * 0.05);
      });
      tl.to("#vs-emu", { rotation: 6, duration: 0.2, yoyo: true, repeat: 3, ease: "sine.inOut", transformOrigin: "50% 100%" }, 0.5);`,
  symHelmet("vs-helmet") + symEmu("vs-emusym")));

// ===== S03 horde: emus fill the frame (3.9 - 6.2) =====
{
  const cells = [];
  const cols = 6, rows = 6;
  for (let rr = 0; rr < rows; rr++) for (let c = 0; c < cols; c++) {
    const x = 70 + c * 152 + (rr % 2 ? 40 : 0) + r(-14, 14);
    const y = 770 + rr * 112 + r(-10, 10);
    cells.push({ x: Math.round(x - (rr % 2 && c === cols - 1 ? 30 : 0)), y: Math.round(y), flip: R() < 0.35 });
  }
  const order = cells.map((_, i) => i).sort(() => R() - 0.5);
  const delays = order.map((_, k) => +(0.05 + Math.pow(k / cells.length, 0.8) * 1.3).toFixed(3));
  const body = cells.map((c, i) => `      <div id="horde-e${i}" class="horde-e horde-stk" style="${abs(c.x, c.y, 150, 195)}"><div class="horde-in" style="${c.flip ? "transform:scaleX(-1);" : ""}">${svgUse("horde-emu", "0 0 200 260")}</div></div>`).join("\n");
  scenes.push(scene("horde", "20.000 Emus", 4.0, 2.2,
    `.horde-in{width:100%;height:100%;}`,
    body,
    `      const D = ${JSON.stringify(order.map((idx, k) => [idx, delays[k]]))};
      D.forEach(([i, d]) => {
        tl.fromTo("#horde-e" + i, { scale: 0, y: 40 }, { scale: 1, y: 0, duration: 0.3, ease: "back.out(2.4)", transformOrigin: "50% 100%" }, d);
        tl.to("#horde-e" + i, { rotation: (i % 2 ? 10 : -10), duration: 0.18, yoyo: true, repeat: 3, ease: "sine.inOut", transformOrigin: "50% 100%" }, d + 0.35);
      });`,
    symEmu("horde-emu")));
}

// ===== S04 wheat: bar shrinks, emus peck (6.2 - 8.4) =====
{
  const stalks = Array.from({ length: 14 }, (_, i) => ({ x: 90 + i * 64 + r(-8, 8), h: r(170, 230) }));
  scenes.push(scene("weizen", "Weizen", 6.2, 2.2,
    `#weizen-barbox{${abs(150, 820, 860, 96)}border-radius:48px;background:#1B2550;border:8px solid #fff;overflow:hidden;}
     #weizen-fill{position:absolute;left:0;top:0;bottom:0;width:100%;background:linear-gradient(#FFE27A,#FFC21A);transform-origin:0 50%;}
     #weizen-red{position:absolute;inset:0;background:linear-gradient(#FF7A7A,#FF3B3B);opacity:0;}
     #weizen-icon{${abs(70, 790, 150, 150)}}
     .weizen-st{position:absolute;bottom:${1920 - 1450}px;width:60px;transform-origin:50% 100%;}
     .weizen-emu{position:absolute;width:210px;height:273px;}
     #weizen-e1{left:130px;top:1060px;} #weizen-e2{left:440px;top:1020px;} #weizen-e3{left:740px;top:1070px;}`,
    `      <div id="weizen-barbox"><div id="weizen-fill"><div id="weizen-red"></div></div></div>
      <div id="weizen-icon" class="weizen-stk">${svgUse("weizen-wheat", "0 0 60 200")}</div>
${stalks.map((s, i) => `      <div id="weizen-s${i}" class="weizen-st" style="left:${Math.round(s.x)}px;height:${Math.round(s.h)}px;">${svgUse("weizen-wheat", "0 0 60 200").replace('width="100%" height="100%"', 'width="100%" height="100%" preserveAspectRatio="none"')}</div>`).join("\n")}
      <div id="weizen-e1" class="weizen-emu weizen-stk">${svgUse("weizen-emu", "0 0 200 260")}</div>
      <div id="weizen-e2" class="weizen-emu weizen-stk"><div style="width:100%;height:100%;transform:scaleX(-1)">${svgUse("weizen-emu", "0 0 200 260")}</div></div>
      <div id="weizen-e3" class="weizen-emu weizen-stk">${svgUse("weizen-emu", "0 0 200 260")}</div>`,
    `      tl.fromTo("#weizen-barbox", { scaleX: 0.2, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.3, ease: "back.out(1.6)" }, 0);
      tl.fromTo("#weizen-icon", { scale: 0, rotation: -30 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2.5)" }, 0.08);
      tl.fromTo("#weizen-fill", { scaleX: 1 }, { scaleX: 0.12, duration: 1.6, ease: "power1.inOut" }, 0.35);
      tl.fromTo("#weizen-red", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 1.5);
      ${JSON.stringify(stalks.map((_, i) => i))}.forEach((i) => {
        tl.fromTo("#weizen-s" + i, { scaleY: 0 }, { scaleY: 1, duration: 0.3, ease: "back.out(2)" }, 0.02 * i);
        tl.to("#weizen-s" + i, { scaleY: 0.15, rotation: (i % 2 ? 25 : -25), duration: 0.25, ease: "power2.in" }, 0.5 + ((i * 7) % 14) * 0.1);
      });
      ["#weizen-e1", "#weizen-e2", "#weizen-e3"].forEach((e, i) => {
        tl.fromTo(e, { y: 500 }, { y: 0, duration: 0.35, ease: "back.out(1.4)" }, 0.1 + i * 0.08);
        tl.to(e, { rotation: i === 1 ? -22 : 22, duration: 0.14, yoyo: true, repeat: 9, ease: "power1.inOut", transformOrigin: "50% 95%" }, 0.5 + i * 0.07);
      });`,
    symWheat("weizen-wheat") + symEmu("weizen-emu")));
}

// ===== S05 army: stamp, two MGs, cartridge belt (8.4 - 12.6) =====
scenes.push(scene("armee", "Armee", 8.4, 4.2,
  `#armee-stamp{${abs(190, 960, 700, 250)}display:flex;align-items:center;justify-content:center;font-family:'Lilita One';font-size:190px;color:#FF3B3B;border:16px solid #FF3B3B;border-radius:30px;background:rgba(14,21,48,.6);letter-spacing:.04em;}
   .armee-mg{position:absolute;width:520px;height:210px;}
   #armee-mg1{left:40px;top:880px;} #armee-mg2{left:520px;top:1090px;}
   #armee-belt{${abs(-120, 1330, 1400, 130)}display:flex;gap:14px;}
   .armee-b{width:46px;height:130px;flex:0 0 46px;}
   #armee-flash{${abs(520, 905, 120, 120)}border-radius:50%;background:radial-gradient(#fff,#FFD23F 45%,rgba(255,122,26,0) 70%);opacity:0;}`,
  `      <div id="armee-stamp">ARMEE</div>
      <div id="armee-mg1" class="armee-mg armee-stk">${svgUse("armee-mgsym", "0 0 420 170")}</div>
      <div id="armee-mg2" class="armee-mg armee-stk"><div style="width:100%;height:100%;transform:scaleX(-1)">${svgUse("armee-mgsym", "0 0 420 170")}</div></div>
      <div id="armee-belt" class="armee-stk">${Array.from({ length: 26 }, () => `<div class="armee-b">${svgUse("armee-bullet", "0 0 40 120")}</div>`).join("")}</div>`,
  `      tl.fromTo("#armee-stamp", { scale: 3.2, opacity: 0, rotation: -18 }, { scale: 1, opacity: 1, rotation: -8, duration: 0.2, ease: "power4.in" }, 0.05);
      tl.to("#armee-kb", { keyframes: { x: [0, -16, 12, -8, 4, 0], y: [0, 10, -6, 3, 0, 0] }, duration: 0.3, ease: "none" }, 0.25);
      tl.to("#armee-stamp", { rotation: -4, duration: 0.85, ease: "sine.inOut" }, 0.4);
      tl.to("#armee-stamp", { y: -150, scale: 0.42, rotation: -8, duration: 0.35, ease: "power3.inOut" }, 1.3);
      tl.fromTo("#armee-mg1", { x: -700 }, { x: 0, duration: 0.42, ease: "back.out(1.3)" }, 1.4);
      tl.fromTo("#armee-mg2", { x: 700 }, { x: 0, duration: 0.42, ease: "back.out(1.3)" }, 1.55);
      tl.to("#armee-mg1", { x: -12, duration: 0.06, yoyo: true, repeat: 1 }, 1.9);
      tl.to("#armee-mg2", { x: 12, duration: 0.06, yoyo: true, repeat: 1 }, 2.0);
      tl.fromTo("#armee-belt", { x: 1400 }, { x: 0, duration: 0.35, ease: "power3.out" }, 2.55);
      tl.to("#armee-belt", { x: -260, duration: 1.3, ease: "none" }, 2.9);
      tl.to(["#armee-mg1", "#armee-mg2"], { y: -6, duration: 0.25, yoyo: true, repeat: 5, ease: "sine.inOut" }, 2.6);`,
  symMG("armee-mgsym") + symBullet("armee-bullet")));

// ===== S06 target: crosshair, emus scatter (12.6 - 16.6) =====
{
  const dirs = [[-430, -260, -30], [430, -240, 30], [-470, 120, -20], [470, 140, 25], [-260, 330, -15], [280, 340, 15], [0, -330, 10]];
  scenes.push(scene("ziel", "Ziel", 12.6, 4.0,
    `#ziel-emu{${abs(390, 960, 300, 390)}}
     .ziel-run{position:absolute;left:440px;top:1040px;width:200px;height:260px;opacity:0;}
     #ziel-cross{${abs(390, 940, 300, 300)}}
     .ziel-dust{position:absolute;width:90px;height:90px;border-radius:50%;background:#C9D3E0;opacity:0;}`,
    `      <div id="ziel-emu" class="ziel-stk">${svgUse("ziel-emusym", "0 0 200 260")}</div>
${dirs.map((d, i) => `      <div id="ziel-r${i}" class="ziel-run ziel-stk"><div style="width:100%;height:100%;${d[0] < 0 ? "transform:scaleX(-1);" : ""}">${svgUse("ziel-emusym", "0 0 200 260")}</div></div>`).join("\n")}
${[0, 1, 2, 3, 4].map((i) => `      <div id="ziel-d${i}" class="ziel-dust" style="left:${400 + i * 60}px;top:${1250 + (i % 2) * 40}px;"></div>`).join("\n")}
      <div id="ziel-cross">${svgUse("ziel-crosssym", "0 0 200 200")}</div>`,
    `      tl.fromTo("#ziel-emu", { scale: 0, y: 60 }, { scale: 1, y: 0, duration: 0.35, ease: "back.out(2)", transformOrigin: "50% 100%" }, 0);
      tl.to("#ziel-emu", { rotation: 8, duration: 0.3, yoyo: true, repeat: 5, ease: "sine.inOut", transformOrigin: "50% 100%" }, 0.35);
      tl.fromTo("#ziel-cross", { x: 420, y: -380, scale: 1.6, rotation: 90, opacity: 0 }, { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, duration: 0.55, ease: "power3.out" }, 0.15);
      tl.to("#ziel-cross", { scale: 0.85, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.inOut" }, 0.75);
      tl.to("#ziel-cross", { rotation: 12, duration: 1.0, ease: "sine.inOut" }, 1.0);
      // 2.0: the emus scatter in every direction
      tl.to("#ziel-emu", { scale: 0, opacity: 0, duration: 0.12, ease: "power2.in" }, 2.0);
      ${JSON.stringify(dirs)}.forEach((d, i) => {
        tl.fromTo("#ziel-r" + i, { opacity: 1, x: 0, y: 0, scale: 0.7, rotation: 0 }, { x: d[0] * 1.15, y: d[1] * 1.1, scale: 1.05, rotation: d[2], duration: 0.9, ease: "power2.out", immediateRender: false }, 2.02 + i * 0.03);
        tl.to("#ziel-r" + i, { y: "-=24", duration: 0.12, yoyo: true, repeat: 7, ease: "sine.inOut" }, 2.1);
      });
      [0, 1, 2, 3, 4].forEach((i) => tl.fromTo("#ziel-d" + i, { opacity: 0.8, scale: 0.4 }, { opacity: 0, scale: 2.2, y: -60, duration: 0.6, ease: "power2.out", immediateRender: false }, 2.0 + i * 0.04));
      tl.to("#ziel-cross", { keyframes: [
        { x: -380, y: -230, rotation: -20, duration: 0.25 },
        { x: 390, y: 120, rotation: 25, duration: 0.25 },
        { x: -300, y: 300, rotation: -10, duration: 0.25 },
        { x: 330, y: -260, rotation: 30, duration: 0.25 },
        { x: -60, y: 60, rotation: 0, duration: 0.25 },
        { x: 250, y: 260, rotation: 20, duration: 0.25 },
        { x: -350, y: -40, rotation: -15, duration: 0.25 } ], ease: "power2.inOut" }, 2.05);`,
    symEmu("ziel-emusym") + symCross("ziel-crosssym")));
}

// ===== S07 jam: MG smokes, KLACK (16.6 - 18.4) =====
{
  const puffs = Array.from({ length: 9 }, (_, i) => ({ x: 700 + r(-60, 80), d: +(0.15 + i * 0.16).toFixed(2), s: r(0.8, 1.5) }));
  scenes.push(scene("klemmt", "MG klemmt", 16.6, 1.8,
    `#klemmt-mg{${abs(110, 1000, 820, 332)}}
     .klemmt-p{position:absolute;top:1010px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#E8EDF3,#9AA6B4);opacity:0;}
     #klemmt-boom{${abs(560, 740, 420, 300)}}
     #klemmt-btxt{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:110px;${LABEL}color:#fff;-webkit-text-stroke:14px #0A0F22;}`,
    `      <div id="klemmt-mg" class="klemmt-stk">${svgUse("klemmt-mgsym", "0 0 420 170")}</div>
${puffs.map((p, i) => `      <div id="klemmt-p${i}" class="klemmt-p" style="left:${Math.round(p.x)}px;"></div>`).join("\n")}
      <div id="klemmt-boom"><svg viewBox="0 0 420 300" width="100%" height="100%"><path fill="#FF3B3B" stroke="#0A0F22" stroke-width="10" stroke-linejoin="round" d="M40 150 L110 120 L70 50 L170 90 L200 20 L240 90 L330 40 L310 120 L400 140 L320 180 L370 260 L260 210 L220 285 L180 210 L80 250 L120 180 Z"/></svg><div id="klemmt-btxt">KLACK!</div></div>`,
    `      tl.fromTo("#klemmt-mg", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.2, ease: "back.out(2)" }, 0);
      tl.fromTo("#klemmt-boom", { scale: 0, rotation: -25 }, { scale: 1, rotation: 6, duration: 0.22, ease: "back.out(3)" }, 0.12);
      tl.to("#klemmt-kb", { keyframes: { x: [0, -24, 20, -14, 8, -4, 0], y: [0, 12, -10, 6, -2, 0, 0] }, duration: 0.4, ease: "none" }, 0.12);
      tl.to("#klemmt-mg", { rotation: 7, y: 30, duration: 0.6, ease: "power2.out", transformOrigin: "20% 60%" }, 0.45);
      tl.to("#klemmt-boom", { rotation: -4, scale: 0.92, duration: 0.8, ease: "sine.inOut" }, 0.5);
      ${JSON.stringify(puffs.map((p) => [p.d, p.s]))}.forEach(([d, s], i) => {
        tl.fromTo("#klemmt-p" + i, { opacity: 0.95, scale: 0.3, y: 0, x: 0 }, { opacity: 0, scale: s * 2, y: -330, x: (i % 2 ? 40 : -40), duration: 1.1, ease: "power1.out", immediateRender: false }, d);
      });`,
    symMG("klemmt-mgsym")));
}

// ===== S08 calendar + stamp (18.4 - 20.4) =====
{
  const days = ["10.12.", "30.11.", "23.11.", "16.11.", "9.11.", "2.11."]; // bottom to top
  scenes.push(scene("abbruch", "Abbruch", 18.4, 2.0,
    `.abbruch-pg{${abs(300, 800, 480, 470)}border-radius:30px;background:#fff;box-shadow:0 14px 0 rgba(0,0,0,.35);overflow:hidden;border:6px solid #0A0F22;}
     .abbruch-hd{height:120px;background:#FF3B3B;display:flex;align-items:center;justify-content:center;font-family:'Lilita One';font-size:84px;color:#fff;}
     .abbruch-day{height:330px;display:flex;align-items:center;justify-content:center;font-family:'Inter';font-weight:900;font-size:136px;color:#0E1530;letter-spacing:-.03em;}
     #abbruch-stamp{${abs(270, 1170, 540, 180)}display:flex;align-items:center;justify-content:center;font-family:'Lilita One';font-size:140px;color:#FF3B3B;border:14px solid #FF3B3B;border-radius:24px;background:rgba(255,255,255,.9);opacity:0;}`,
    `${days.map((d, i) => `      <div id="abbruch-p${i}" class="abbruch-pg" data-layout-allow-overlap><div class="abbruch-hd">1932</div><div class="abbruch-day">${d}</div></div>`).join("\n")}
      <div id="abbruch-stamp" data-layout-allow-overlap data-layout-allow-occlusion>ENDE</div>`,
    `      tl.fromTo(".abbruch-pg", { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.22, ease: "back.out(2)" }, 0);
      // tear off the pages from 2.11. to 30.11.
      [5, 4, 3, 2, 1].forEach((i, k) => {
        tl.to("#abbruch-p" + i, { y: -700, x: (k % 2 ? 380 : -380), rotation: (k % 2 ? 40 : -40), opacity: 0, duration: 0.32, ease: "power2.in" }, 0.25 + k * 0.17);
      });
      tl.fromTo("#abbruch-p0", { rotation: 0 }, { rotation: -3, duration: 0.2, ease: "back.out(3)" }, 1.1);
      tl.fromTo("#abbruch-stamp", { scale: 3, opacity: 0, rotation: -25 }, { scale: 1, opacity: 1, rotation: -12, duration: 0.18, ease: "power4.in" }, 1.2);
      tl.to("#abbruch-kb", { keyframes: { x: [0, -18, 14, -8, 0], y: [0, 10, -6, 2, 0] }, duration: 0.3, ease: "none" }, 1.38);
      tl.to("#abbruch-stamp", { rotation: -9, scale: 1.04, duration: 0.5, ease: "sine.inOut" }, 1.5);`,
    ""));
}

// ===== S09 tally: clipboard 986* (20.4 - 22.6) =====
scenes.push(scene("bilanz", "Bilanz 986", 20.4, 2.2,
  `#bilanz-board{${abs(190, 800, 700, 520)}border-radius:36px;background:#C98A4B;border:6px solid #0A0F22;}
   #bilanz-paper{position:absolute;left:34px;right:34px;top:70px;bottom:30px;background:#FFFDF4;border-radius:16px;}
   #bilanz-clip{${abs(270, -30, 160, 90)}background:linear-gradient(#C9D3E0,#8A96A6);border-radius:18px;border:6px solid #0A0F22;}
   #bilanz-emu{${abs(40, 40, 170, 221)}}
   #bilanz-num{${abs(205, 75, 420, 170)}font-family:'Inter';font-weight:900;font-size:124px;line-height:170px;color:#0E1530;letter-spacing:-.04em;}
   #bilanz-tally{${abs(40, 270, 550, 120)}}
   #bilanz-note{${abs(150, 1350, 780, 100)}text-align:center;font-family:'Inter';font-weight:900;font-size:72px;color:#fff;-webkit-text-stroke:14px #0A0F22;paint-order:stroke fill;text-shadow:0 8px 0 #050814;}`,
  `      <div id="bilanz-board" class="bilanz-stk"><div id="bilanz-clip"></div><div id="bilanz-paper">
        <div id="bilanz-emu">${svgUse("bilanz-emusym", "0 0 200 260")}</div>
        <div id="bilanz-num">×986*</div>
        <div id="bilanz-tally"><svg viewBox="0 0 550 120" width="100%" height="100%"><g stroke="#0E1530" stroke-width="9" stroke-linecap="round">${[0, 1, 2].map((g) => [0, 1, 2, 3].map((k) => `<line class="bilanz-tl" x1="${30 + g * 180 + k * 30}" y1="20" x2="${30 + g * 180 + k * 30}" y2="100"/>`).join("") + `<line class="bilanz-tl" x1="${18 + g * 180}" y1="88" x2="${136 + g * 180}" y2="32"/>`).join("")}</g></svg></div>
      </div></div>
      <div id="bilanz-note">*eigene Angabe</div>`,
  `      tl.fromTo("#bilanz-board", { y: 900, rotation: 14 }, { y: 0, rotation: -2, duration: 0.45, ease: "back.out(1.3)" }, 0);
      tl.to("#bilanz-board", { rotation: 1.5, duration: 1.6, ease: "sine.inOut" }, 0.5);
      const o = { v: 0 }; const el = document.querySelector("#bilanz-num");
      tl.fromTo(o, { v: 0 }, { v: 986, duration: 0.8, ease: "power2.out", onUpdate: () => { el.textContent = "×" + Math.round(o.v) + "*"; } }, 0.25);
      tl.fromTo(".bilanz-tl", { strokeDasharray: 140, strokeDashoffset: 140 }, { strokeDashoffset: 0, duration: 0.09, stagger: 0.06, ease: "none" }, 0.4);
      tl.fromTo("#bilanz-note", { scale: 0, rotation: -10 }, { scale: 1, rotation: -3, duration: 0.3, ease: "back.out(2.5)" }, 1.05);
      tl.to("#bilanz-note", { rotation: 2, duration: 0.25, yoyo: true, repeat: 2, ease: "sine.inOut" }, 1.4);`,
  symEmu("bilanz-emusym")));

// ===== S10 ten bullets = one emu (22.6 - 24.8) =====
scenes.push(scene("kugeln", "10 Kugeln", 22.6, 2.2,
  `.kugeln-b{position:absolute;width:74px;height:222px;}
   #kugeln-eq{${abs(560, 1010, 140, 200)}text-align:center;font-size:200px;line-height:200px;${LABEL}}
   #kugeln-emu{${abs(720, 920, 270, 351)}}`,
  `${Array.from({ length: 10 }, (_, i) => `      <div id="kugeln-b${i}" class="kugeln-b kugeln-stk" style="left:${100 + (i % 5) * 90}px;top:${i < 5 ? 880 : 1140}px;">${svgUse("kugeln-bul", "0 0 40 120")}</div>`).join("\n")}
      <div id="kugeln-eq">=</div>
      <div id="kugeln-emu" class="kugeln-stk">${svgUse("kugeln-emusym", "0 0 200 260")}</div>`,
  `      for (let i = 0; i < 10; i++) tl.fromTo("#kugeln-b" + i, { x: -760, rotation: -40 }, { x: 0, rotation: 0, duration: 0.3, ease: "back.out(1.6)" }, 0.05 + i * 0.09);
      tl.fromTo("#kugeln-emu", { scale: 0 }, { scale: 1, duration: 0.35, ease: "back.out(2)", transformOrigin: "50% 100%" }, 0.15);
      tl.fromTo("#kugeln-eq", { scale: 0 }, { scale: 1, duration: 0.25, ease: "back.out(3)" }, 1.05);
      tl.to("#kugeln-emu", { keyframes: { y: [0, -60, 0, -30, 0], scaleY: [1, 1.05, 0.9, 1.02, 1] }, duration: 0.7, ease: "none", transformOrigin: "50% 100%" }, 1.2);
      tl.to(".kugeln-b", { rotation: 8, duration: 0.25, yoyo: true, repeat: 3, stagger: 0.03, ease: "sine.inOut" }, 1.2);`,
  symBullet("kugeln-bul") + symEmu("kugeln-emusym")));

// ===== S11 quote frame, emu becomes tank (24.8 - 28.2) =====
scenes.push(scene("panzer", "Panzer", 24.8, 3.4,
  `#panzer-frame{${abs(110, 310, 860, 560)}border:10px solid #FFD23F;border-radius:40px;background:rgba(255,210,63,.07);}
   .panzer-q{position:absolute;font-family:'Lilita One';font-size:240px;line-height:1;color:#FFD23F;-webkit-text-stroke:12px #0A0F22;paint-order:stroke fill;}
   #panzer-q1{left:116px;top:296px;font-size:150px;} #panzer-q2{left:880px;top:812px;font-size:150px;}
   #panzer-emu{${abs(380, 900, 320, 416)}}
   #panzer-tank{${abs(160, 940, 760, 464)}opacity:0;}
   #panzer-flash{${abs(240, 860, 600, 600)}border-radius:50%;background:radial-gradient(#fff 30%,rgba(255,255,255,0) 70%);opacity:0;}
   .panzer-bul{position:absolute;left:-120px;width:44px;height:132px;}
   .panzer-sp{position:absolute;width:120px;height:120px;opacity:0;}`,
  `      <div id="panzer-frame"></div>
      <div id="panzer-q1" class="panzer-q">„</div><div id="panzer-q2" class="panzer-q">“</div>
      <div id="panzer-emu" class="panzer-stk">${svgUse("panzer-emusym", "0 0 200 260")}</div>
      <div id="panzer-tank" class="panzer-stk">${svgUse("panzer-tanksym", "0 0 540 330")}</div>
      <div id="panzer-flash"></div>
${[0, 1, 2].map((i) => `      <div id="panzer-b${i}" class="panzer-bul" style="top:${1120 + i * 70}px;"><div style="width:100%;height:100%;transform:rotate(90deg)">${svgUse("panzer-bulsym", "0 0 40 120")}</div></div>
      <div id="panzer-s${i}" class="panzer-sp" style="left:${180}px;top:${1120 + i * 70}px;"><svg viewBox="0 0 100 100" width="100%" height="100%"><path fill="#FFD23F" stroke="#0A0F22" stroke-width="5" d="M50 0 L60 38 L100 50 L60 62 L50 100 L40 62 L0 50 L40 38 Z"/></svg></div>`).join("\n")}`,
  `      tl.fromTo("#panzer-frame", { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.6)" }, 0);
      tl.fromTo("#panzer-q1", { scale: 0, rotation: -30 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(3)" }, 0.1);
      tl.fromTo("#panzer-q2", { scale: 0, rotation: 30 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(3)" }, 0.2);
      tl.fromTo("#panzer-emu", { scale: 0, y: 80 }, { scale: 1, y: 0, duration: 0.35, ease: "back.out(2)", transformOrigin: "50% 100%" }, 0.15);
      tl.to("#panzer-emu", { scaleY: 1.08, scaleX: 0.95, duration: 0.25, yoyo: true, repeat: 1, ease: "sine.inOut", transformOrigin: "50% 100%" }, 0.6);
      // morph at 1.2 (26.0): squash, flash, tank pops with the emu in the turret
      tl.to("#panzer-emu", { scaleY: 0.25, scaleX: 1.5, duration: 0.14, ease: "power3.in", transformOrigin: "50% 100%" }, 1.12);
      tl.to("#panzer-emu", { opacity: 0, duration: 0.05 }, 1.26);
      tl.fromTo("#panzer-flash", { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1.3, duration: 0.12, ease: "power2.out" }, 1.2);
      tl.to("#panzer-flash", { opacity: 0, duration: 0.3, ease: "power2.in" }, 1.34);
      tl.fromTo("#panzer-tank", { opacity: 0, scale: 0.3, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(2.2)", transformOrigin: "50% 100%" }, 1.24);
      tl.to("#panzer-kb", { keyframes: { x: [0, -20, 16, -10, 5, 0], y: [0, 12, -8, 4, 0, 0] }, duration: 0.36, ease: "none" }, 1.26);
      tl.to("#panzer-tank", { y: -6, duration: 0.12, yoyo: true, repeat: 9, ease: "sine.inOut" }, 1.7);
      [0, 1, 2].forEach((i) => {
        const t0 = 1.75 + i * 0.4;
        tl.fromTo("#panzer-b" + i, { x: 0, y: 0, rotation: 0, opacity: 1 }, { x: 300, duration: 0.14, ease: "none", immediateRender: false }, t0);
        tl.to("#panzer-b" + i, { x: 90, y: 260, rotation: -260, opacity: 0, duration: 0.45, ease: "power2.in" }, t0 + 0.14);
        tl.fromTo("#panzer-s" + i, { opacity: 1, scale: 0.2, rotation: 0 }, { opacity: 0, scale: 1.4, rotation: 45, duration: 0.3, ease: "power2.out", immediateRender: false }, t0 + 0.13);
      });`,
  symEmu("panzer-emusym") + symTank("panzer-tanksym") + symBullet("panzer-bulsym"), { exitLead: 0.25, exitDur: 0.2 }));

// ===== S12 podium + confetti (28.2 - 30.0) =====
{
  const cols = ["#FFD23F", "#FF3B3B", "#3FAE6A", "#4FC3F7", "#FF7A1A", "#FFFFFF"];
  const conf = Array.from({ length: 70 }, (_, i) => ({ x: r(0, 1060), y0: r(-420, -40), dx: r(-160, 160), rot: r(-720, 720), d: r(0, 0.35), dur: r(1.4, 2.1), c: cols[i % cols.length], w: r(14, 24), h: r(24, 38) }));
  scenes.push(scene("sieger", "Sieger", 28.2, 1.8,
    `#sieger-rays{${abs(-260, 140, 1600, 1600)}background:repeating-conic-gradient(from 0deg, rgba(255,210,63,.28) 0deg 8deg, rgba(255,210,63,0) 8deg 20deg);border-radius:50%;-webkit-mask-image:radial-gradient(circle,#000 25%,transparent 65%);mask-image:radial-gradient(circle,#000 25%,transparent 65%);}
     .sieger-blk{position:absolute;bottom:${1920 - 1470}px;border-radius:18px 18px 0 0;border:8px solid #0A0F22;display:flex;justify-content:center;font-family:'Lilita One';font-size:130px;color:#fff;-webkit-text-stroke:12px #0A0F22;paint-order:stroke fill;padding-top:10px;}
     #sieger-b1{left:390px;width:300px;height:300px;background:#FFD23F;}
     #sieger-b2{left:100px;width:290px;height:210px;background:#C9D3E0;}
     #sieger-b3{left:690px;width:290px;height:150px;background:#E08A4A;}
     #sieger-emu{${abs(425, 862, 230, 299)}}
     #sieger-tro{${abs(600, 830, 120, 140)}}
     #sieger-helm{${abs(140, 1132, 210, 131)}}
     #sieger-mg{${abs(705, 1215, 260, 105)}}
     .sieger-c{position:absolute;top:0;border-radius:4px;}`,
    `      <div id="sieger-rays"></div>
      <div id="sieger-b2" class="sieger-blk" data-layout-ignore>2</div><div id="sieger-b3" class="sieger-blk" data-layout-ignore>3</div><div id="sieger-b1" class="sieger-blk" data-layout-ignore>1</div>
      <div id="sieger-helm" class="sieger-stk">${svgUse("sieger-helmsym", "0 0 240 150")}</div>
      <div id="sieger-mg" class="sieger-stk">${svgUse("sieger-mgsym", "0 0 420 170")}</div>
      <div id="sieger-emu" class="sieger-stk">${svgUse("sieger-emusym", "0 0 200 260")}</div>
      <div id="sieger-tro" class="sieger-stk">${svgUse("sieger-trosym", "0 0 120 140")}</div>
${conf.map((c, i) => `      <div id="sieger-c${i}" class="sieger-c" style="left:${Math.round(c.x)}px;width:${Math.round(c.w)}px;height:${Math.round(c.h)}px;background:${c.c};"></div>`).join("\n")}`,
    `      tl.fromTo("#sieger-rays", { scale: 0.4, opacity: 0, rotation: 0 }, { scale: 1, opacity: 1, rotation: 30, duration: 1.8, ease: "power2.out" }, 0);
      tl.fromTo(["#sieger-b2", "#sieger-b1", "#sieger-b3"], { y: 520 }, { y: 0, duration: 0.35, ease: "back.out(1.4)", stagger: 0.05 }, 0);
      tl.fromTo("#sieger-emu", { scale: 0, y: 60 }, { scale: 1, y: 0, duration: 0.35, ease: "back.out(2)", transformOrigin: "50% 100%" }, 0.2);
      tl.fromTo("#sieger-emu", { scaleY: 0.7, scaleX: 1.2 }, { scaleY: 1, scaleX: 1, duration: 0.45, ease: "elastic.out(1, 0.4)", transformOrigin: "50% 100%", immediateRender: false }, 0.56);
      tl.fromTo("#sieger-tro", { scale: 0, rotation: -40 }, { scale: 1, rotation: 12, duration: 0.35, ease: "back.out(3)" }, 0.55);
      tl.to("#sieger-tro", { y: -30, rotation: -6, duration: 0.25, yoyo: true, repeat: 3, ease: "sine.inOut" }, 0.9);
      tl.to("#sieger-emu", { rotation: 7, duration: 0.2, yoyo: true, repeat: 4, ease: "sine.inOut", transformOrigin: "50% 100%" }, 0.95);
      tl.fromTo(["#sieger-helm", "#sieger-mg"], { scale: 0 }, { scale: 1, duration: 0.3, ease: "back.out(2)", stagger: 0.08 }, 0.25);
      tl.to("#sieger-helm", { rotation: -12, duration: 0.3, yoyo: true, repeat: 3, ease: "sine.inOut" }, 0.6);
      const C = ${JSON.stringify(conf.map((c) => [c.y0, c.dx, c.rot, c.d, c.dur]))};
      C.forEach(([y0, dx, rot, d, dur], i) => {
        tl.fromTo("#sieger-c" + i, { y: y0, x: 0, rotation: 0 }, { y: y0 + 2300, x: dx, rotation: rot, duration: dur, ease: "power1.in" }, 0.05 + d);
      });`,
    symHelmet("sieger-helmsym") + symMG("sieger-mgsym") + symEmu("sieger-emusym") + symTrophy("sieger-trosym"), { exitLead: 0.1, exitDur: 0.18 }));
}

// ===== S13 comment question: boxer emu + typing bubble (30.0 - 32.1) =====
scenes.push(scene("frage", "Frage", 30.0, 2.0,
  `#frage-bub{${abs(110, 860, 480, 280)}}
   .frage-dot{position:absolute;top:110px;width:62px;height:62px;border-radius:50%;background:#0E1530;}
   #frage-emu{${abs(600, 900, 300, 390)}}
   .frage-gl{position:absolute;width:120px;height:132px;}
   #frage-g1{left:830px;top:1020px;} #frage-g2{left:560px;top:1060px;}`,
  `      <div id="frage-bub" class="frage-stk"><svg viewBox="0 0 480 280" width="100%" height="100%"><path d="M40 0 H440 Q480 0 480 40 V190 Q480 230 440 230 H170 L90 280 L110 230 H40 Q0 230 0 190 V40 Q0 0 40 0 Z" fill="#fff"/></svg>
        <div id="frage-d0" class="frage-dot" style="left:110px"></div><div id="frage-d1" class="frage-dot" style="left:209px"></div><div id="frage-d2" class="frage-dot" style="left:308px"></div></div>
      <div id="frage-emu" class="frage-stk"><div style="width:100%;height:100%;transform:scaleX(-1)">${svgUse("frage-emusym", "0 0 200 260")}</div></div>
      <div id="frage-g1" class="frage-gl frage-stk">${svgUse("frage-glove", "0 0 100 110")}</div>
      <div id="frage-g2" class="frage-gl frage-stk"><div style="width:100%;height:100%;transform:scaleX(-1)">${svgUse("frage-glove", "0 0 100 110")}</div></div>`,
  `      tl.fromTo("#frage-bub", { scale: 0, rotation: -12 }, { scale: 1, rotation: 0, duration: 0.35, ease: "back.out(2.2)", transformOrigin: "20% 100%" }, 0.15);
      [0, 1, 2].forEach((i) => tl.fromTo("#frage-d" + i, { y: 0 }, { y: -26, duration: 0.18, yoyo: true, repeat: 7, ease: "sine.inOut" }, 0.3 + i * 0.09));
      tl.fromTo("#frage-emu", { x: 600 }, { x: 0, duration: 0.4, ease: "back.out(1.5)" }, 0.1);
      tl.fromTo(["#frage-g1", "#frage-g2"], { scale: 0 }, { scale: 1, duration: 0.25, ease: "back.out(3)", stagger: 0.08 }, 0.4);
      tl.to("#frage-emu", { y: -22, duration: 0.17, yoyo: true, repeat: 7, ease: "sine.inOut" }, 0.55);
      tl.to("#frage-g1", { x: -60, y: -14, duration: 0.12, yoyo: true, repeat: 5, ease: "power2.out" }, 0.7);
      tl.to("#frage-g2", { y: -30, duration: 0.17, yoyo: true, repeat: 5, ease: "sine.inOut" }, 0.65);
`,
  symEmu("frage-emusym") + symGlove("frage-glove")));

// ===== loop end: rebuilds the frame-0 picture (32.0 - 32.5) =====
scenes.push(scene("loopend", "Loop zurück", 32.0, 0.5, hookCss("loopend"), hookBody("loopend"),
  `      tl.fromTo("#loopend-map", { opacity: 0, scale: 0.5, rotation: -8 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.3, ease: "back.out(1.6)" }, 0.0);
      tl.fromTo("#loopend-burst", { opacity: 0, scale: 0.3, rotation: -50 }, { opacity: 0.9, scale: 1, rotation: 0, duration: 0.32, ease: "power3.out" }, 0.04);
      tl.fromTo("#loopend-emu", { opacity: 0, y: -520 }, { opacity: 1, y: 0, duration: 0.24, ease: "power3.in" }, 0.08);`,
  symEmuHelmet("loopend-emuh"), { exit: false, kb: false }));

// ================= background =================
fs.writeFileSync(path.join(OUT, "compositions", "bg.html"), `<template>
  <style>
    #root { position: absolute; inset: 0; overflow: hidden; background: #0E1530; }
    #bg-glow { position: absolute; inset: 0; background: radial-gradient(circle at 50% 52%, #24387A 0%, #16224A 38%, #0E1530 72%); }
    #bg-rays { position: absolute; left: -760px; top: -200px; width: 2600px; height: 2600px; border-radius: 50%;
      background: repeating-conic-gradient(from 0deg, rgba(255,255,255,.055) 0deg 6deg, rgba(255,255,255,0) 6deg 15deg); }
    #bg-vig { position: absolute; inset: 0; background: radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 55%, rgba(4,7,20,.6) 100%); }
  </style>
  <div id="root" data-composition-id="bg" data-width="1080" data-height="1920" data-layout-allow-overflow>
    <div id="bg-glow"></div>
    <div id="bg-rays"></div>
    <div id="bg-vig"></div>
  </div>
  <script>
    (function () {
      const tl = gsap.timeline({ paused: true });
      // 45 degrees over the whole film = three ray periods, so the loop point matches
      tl.fromTo("#bg-rays", { rotation: 0 }, { rotation: 45, duration: ${DUR}, ease: "none" }, 0);
      window.__timelines["bg"] = tl;
    })();
  </script>
</template>
`);

// ================= captions =================
// k: keyword (yellow, uppercase Lilita). c: counter target.
const caps = [
  { id: "c01", s: 0, e: 2.6, special: "year" },
  { id: "c02", s: 0.26, e: 2.6, top: 520, words: ["Australien", "erklärt", "*EMUS", "den", "Krieg."], shake: true },
  { id: "c03", s: 2.6, e: 4.0, words: ["Rate", "mal,", "wer", "gewinnt."] },
  { id: "c04", s: 4.0, e: 6.2, words: ["Der", "Gegner:", "rund", "*20.000", "Emus."], counter: 20000 },
  { id: "c05", s: 6.2, e: 8.4, words: ["Sie", "fressen", "den", "*WEIZEN", "der", "Farmer."] },
  { id: "c06", s: 8.4, e: 9.8, words: ["Also", "schickt", "die", "Armee:"] },
  { id: "c07", s: 9.8, e: 11.0, words: ["*2", "Maschinengewehre."], size: 76 },
  { id: "c08", s: 11.0, e: 12.6, words: ["*10.000", "Schuss", "Munition."], counter: 10000 },
  { id: "c09", s: 12.6, e: 14.6, words: ["Plan:", "Emus", "treffen.", "Easy,", "oder?"] },
  { id: "c10", s: 14.6, e: 16.6, words: ["Die", "Emus:", "rennen", "*AUSEINANDER."], kwsize: 124 },
  { id: "c11", s: 16.6, e: 18.4, words: ["Dann", "klemmt", "ein", "*MG."], shake: true },
  { id: "c12", s: 18.4, e: 20.4, words: ["Nach", "gut", "5", "Wochen:", "*ABBRUCH."], shake: true },
  { id: "c13", s: 20.4, e: 22.6, words: ["Bilanz", "laut", "Major:", "*986", "Emus."] },
  { id: "c14", s: 22.6, e: 24.8, words: ["Also", "rund", "*10 KUGELN", "pro", "Emu."] },
  { id: "c15", s: 24.8, e: 28.1, top: 345, words: ["Sein", "Fazit:", "Emus", "sind"], narrow: true },
  { id: "c16", s: 26.0, e: 28.1, top: 545, words: ["unverwundbar", "wie", "*PANZER."], shake: true, narrow: true, kwsize: 205 },
  { id: "c17", s: 28.2, e: 30.0, words: ["Sieger:", "die", "*EMUS.", "#trophy"], kwsize: 220 },
  { id: "c18", s: 30.0, e: 32.1, words: ["Du", "gegen", "einen", "Emu –", "wer", "gewinnt?"] },
  { id: "c19", s: 32.1, e: DUR, special: "year" },
];
const TROPHY_INLINE = `<svg viewBox="0 0 120 140" width="120" height="140" style="vertical-align:-10px"><use href="#cap-trophy"/></svg>`;

let capHtml = "";
let capJs = "";
for (const c of caps) {
  const d = +(c.e - c.s).toFixed(2);
  if (c.special === "year") {
    capHtml += `      <div id="${c.id}" class="cap clip" data-start="${c.s}" data-duration="${d}" data-track-index="0" style="top:300px;"><span id="${c.id}-t" class="yr">1932.</span></div>\n`;
    continue;
  }
  const style = `top:${c.top ?? 300}px;${c.narrow ? "left:110px;width:860px;" : ""}${c.size ? `font-size:${c.size}px;` : ""}`;
  const spans = c.words.map((w, i) => {
    if (w === "#trophy") return `<span id="${c.id}-o${i}" class="w tro"><span id="${c.id}-w${i}" class="g">${TROPHY_INLINE}</span></span>`;
    if (w.startsWith("*")) return `<span id="${c.id}-o${i}" class="w kw"${c.kwsize ? ` style="font-size:${c.kwsize}px"` : ""}><span id="${c.id}-w${i}" class="g">${w.slice(1)}</span></span>`;
    return `<span id="${c.id}-o${i}" class="w"><span id="${c.id}-w${i}" class="g">${w}</span></span>`;
  });
  const dOv = d;
  capHtml += `      <div id="${c.id}" class="cap clip" data-start="${c.s}" data-duration="${dOv}" data-track-index="${caps.indexOf(c) % 2}" data-layout-allow-overlap style="${style}">${spans.join(" ")}</div>\n`;
  const kwIdx = c.words.findIndex((w) => w.startsWith("*") || w === "#trophy");
  const plain = c.words.map((w, i) => i).filter((i) => !c.words[i].startsWith("*") && c.words[i] !== "#trophy");
  // word-by-word pop
  capJs += `      // ${c.id}\n`;
  plain.forEach((i, k) => {
    const at = +(c.s + 0.02 + k * 0.085 + (kwIdx >= 0 && i > kwIdx ? 0.12 : 0)).toFixed(3);
    capJs += `      tl.fromTo("#${c.id}-w${i}", { opacity: 0, scale: 0.4, y: 26 }, { opacity: 1, scale: 1, y: 0, duration: 0.26, ease: "back.out(1.6)" }, ${at});\n`;
  });
  c.words.forEach((w, i) => {
    if (!(w.startsWith("*") || w === "#trophy")) return;
    const before = plain.filter((j) => j < i).length;
    const at = +(c.s + 0.04 + before * 0.085).toFixed(3);
    capJs += `      tl.fromTo("#${c.id}-w${i}", { opacity: 0, scale: 1.25, rotation: -6 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.28, ease: "back.out(2.2)" }, ${at});\n`;
    if (c.shake) capJs += `      tl.to("#${c.id}-w${i}", { keyframes: { x: [0, -12, 12, -8, 6, 0], rotation: [0, -4, 4, -2, 0, 0] }, duration: 0.32, ease: "none" }, ${+(at + 0.3).toFixed(3)});\n`;
    if (c.counter) capJs += `      { const o = { v: 0 }; const el = document.querySelector("#${c.id}-w${i}"); tl.fromTo(o, { v: 0 }, { v: ${c.counter}, duration: 1.0, ease: "power2.out", onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString("de-DE"); } }, ${at}); }\n`;
    if (w === "#trophy") capJs += `      tl.to("#${c.id}-w${i}", { rotation: 10, y: -10, duration: 0.25, yoyo: true, repeat: 3, ease: "sine.inOut" }, ${+(at + 0.35).toFixed(3)});\n`;
  });
  // exit (not for the last frame before the loop word)
  capJs += `      tl.to("#${c.id} .g", { opacity: 0, scale: 0.85, filter: "blur(6px)", duration: 0.1, stagger: 0.005, ease: "power2.in" }, ${+(c.e - 0.13).toFixed(3)});\n`;
}
// the year: frame 0 already shows it; punch, then move up; loop version lands on the same state
capJs += `      // c01: 1932. is on screen at frame 0, above the map; slides up to make room for the sentence
      tl.fromTo("#c01-t", { y: 300, scale: 1, rotation: 0 }, { y: 0, scale: 1, rotation: 0, duration: 0.26, ease: "power3.inOut" }, 0.02);
      tl.to("#c01-t", { opacity: 0, scale: 0.85, filter: "blur(6px)", duration: 0.12, ease: "power2.in" }, 2.54);
      // c19: loop back, lands exactly on the frame-0 state
      tl.fromTo("#c19-t", { y: 300, scale: 2.4, opacity: 0, rotation: 8 }, { y: 300, scale: 1, opacity: 1, rotation: 0, duration: 0.22, ease: "power4.in" }, 32.1);
`;

fs.writeFileSync(path.join(OUT, "compositions", "captions.html"), `<template>
  <style>
    ${FONTFACE}
    #root { position: absolute; inset: 0; }
    .cap { position: absolute; left: 80px; width: 920px; text-align: center; font-family: 'Inter', sans-serif; font-weight: 900;
      font-size: 84px; line-height: 1.12; color: #fff; letter-spacing: -0.01em; }
    .w { display: inline-block; margin: 0 0.14em; -webkit-text-stroke: 16px #0A0F22; paint-order: stroke fill; text-shadow: 0 9px 0 #050814; }
    .g { display: inline-block; }
    .kw { font-family: 'Lilita One'; font-weight: 400; color: #FFD23F; font-size: 160px; line-height: 1.0; text-transform: uppercase; letter-spacing: 0.01em; padding: 0 6px; }
    .tro { filter: drop-shadow(4px 0 0 #0A0F22) drop-shadow(-4px 0 0 #0A0F22) drop-shadow(0 4px 0 #0A0F22) drop-shadow(0 -4px 0 #0A0F22); }
    .yr { display: inline-block; font-family: 'Lilita One'; color: #FFD23F; font-size: 200px; line-height: 1; -webkit-text-stroke: 20px #0A0F22; paint-order: stroke fill; text-shadow: 0 16px 0 #050814; }
  </style>
  <div id="root" data-composition-id="captions" data-width="1080" data-height="1920">
    <svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${symTrophy("cap-trophy")}</defs></svg>
${capHtml}  </div>
  <script>
    (function () {
      const tl = gsap.timeline({ paused: true });
${capJs}      window.__timelines["captions"] = tl;
    })();
  </script>
</template>
`);

// ================= Klotz =================
// mood presets: eye scale, pupil scale, pupil x/y, lids L/R, brow L/R y, brow tilt L/R, mouth sx/sy, grin, arms L/R, sweat
const M = {
  shock:      { eye: 1.12, ps: 0.6, px: 0, py: 0, lL: 0, lR: 0, bL: -18, bR: -18, tL: -6, tR: -6, mx: 1, my: 1.1, g: 0, aL: 70, aR: -70, sw: 1 },
  shrug:      { eye: 1, ps: 1, px: -12, py: -10, lL: 0.25, lR: 0.25, bL: -14, bR: -14, tL: -14, tR: -14, mx: 1.3, my: 0.2, g: 0, aL: 140, aR: -140, sw: 0 },
  surprised:  { eye: 1.08, ps: 0.8, px: 0, py: 6, lL: 0, lR: 0, bL: -16, bR: -16, tL: 0, tR: 0, mx: 0.55, my: 0.6, g: 0, aL: 55, aR: -55, sw: 0 },
  annoyed:    { eye: 1, ps: 1, px: -12, py: 4, lL: 0.42, lR: 0.42, bL: 4, bR: 4, tL: 16, tR: 16, mx: 0.9, my: 0.22, g: 0, aL: 18, aR: -18, sw: 0 },
  determined: { eye: 1, ps: 1, px: 0, py: 0, lL: 0.3, lR: 0.3, bL: 2, bR: 2, tL: 12, tR: 12, mx: 0.7, my: 0.2, g: 0, aL: 35, aR: -155, sw: 0 },
  impressed:  { eye: 1.05, ps: 0.9, px: -6, py: -4, lL: 0, lR: 0, bL: -12, bR: -12, tL: -4, tR: -4, mx: 0.45, my: 0.45, g: 0, aL: 40, aR: -40, sw: 0 },
  smug:       { eye: 1, ps: 1, px: 8, py: 0, lL: 0.45, lR: 0.45, bL: -4, bR: -10, tL: 6, tR: -2, mx: 0, my: 0, g: 1, aL: 20, aR: -165, sw: 0 },
  confused:   { eye: 1, ps: 0.7, px: 0, py: 0, lL: 0, lR: 0.2, bL: -12, bR: -4, tL: -12, tR: -12, mx: 0.5, my: 0.4, g: 0, aL: 85, aR: -60, sw: 1 },
  wince:      { eye: 0.95, ps: 1, px: 0, py: 0, lL: 0.85, lR: 0.85, bL: 6, bR: 6, tL: 18, tR: 18, mx: 1.5, my: 0.25, g: 0, aL: 100, aR: -100, sw: 1 },
  sad:        { eye: 1, ps: 1, px: 0, py: 10, lL: 0.3, lR: 0.3, bL: -6, bR: -6, tL: -18, tR: -18, mx: 0.6, my: 0.2, g: 0, aL: 15, aR: -15, sw: 0 },
  suspicious: { eye: 1, ps: 1, px: 14, py: 2, lL: 0.55, lR: 0.1, bL: 4, bR: -20, tL: 14, tR: 4, mx: 0.7, my: 0.18, g: 0, aL: 30, aR: -30, sw: 0 },
  jawdrop:    { eye: 1.18, ps: 0.55, px: 0, py: 0, lL: 0, lR: 0, bL: -22, bR: -22, tL: -4, tR: -4, mx: 1.1, my: 1.7, g: 0, aL: 60, aR: -60, sw: 1 },
  neutral:    { eye: 1, ps: 1, px: 0, py: 0, lL: 0.15, lR: 0.15, bL: -6, bR: -6, tL: 0, tR: 0, mx: 0.6, my: 0.3, g: 0, aL: 35, aR: -35, sw: 0 },
  cheer:      { eye: 1, ps: 1, px: 0, py: 0, lL: 0.2, lR: 0.2, bL: -16, bR: -16, tL: -6, tR: -6, mx: 0, my: 0, g: 1, aL: 160, aR: -160, sw: 0 },
  curious:    { eye: 1.05, ps: 1.1, px: 0, py: 4, lL: 0.1, lR: 0.1, bL: -18, bR: -4, tL: 0, tR: 0, mx: 0.5, my: 0.5, g: 0, aL: 40, aR: -120, sw: 0 },
};
const moods = [
  [2.6, "shrug"], [4.0, "surprised"], [6.2, "annoyed"], [8.4, "determined"], [9.8, "impressed"], [12.6, "smug"],
  [14.6, "confused"], [16.6, "wince"], [18.4, "sad"], [20.4, "suspicious"], [22.6, "jawdrop"], [24.8, "neutral"],
  [26.0, "jawdrop"], [26.45, "wince"], [28.2, "cheer"], [30.0, "curious"], [32.1, "shock"],
];
const blinks = [1.9, 5.3, 7.7, 11.4, 13.9, 19.8, 24.2, 29.5, 31.3];

const klotzSvg = `<svg viewBox="0 0 300 330" width="100%" height="100%" overflow="visible">
  <defs>
    <clipPath id="k-clipL"><ellipse cx="108" cy="140" rx="40" ry="46"/></clipPath>
    <clipPath id="k-clipR"><ellipse cx="192" cy="140" rx="40" ry="46"/></clipPath>
  </defs>
  <g id="k-armL"><rect x="31" y="186" width="34" height="84" rx="17" fill="#F06A0C" stroke="#7A2E00" stroke-width="6"/><circle cx="48" cy="270" r="21" fill="#FF7A1A" stroke="#7A2E00" stroke-width="6"/></g>
  <g id="k-armR"><rect x="235" y="186" width="34" height="84" rx="17" fill="#F06A0C" stroke="#7A2E00" stroke-width="6"/><circle cx="252" cy="270" r="21" fill="#FF7A1A" stroke="#7A2E00" stroke-width="6"/></g>
  <ellipse cx="105" cy="304" rx="36" ry="17" fill="#D95F0A" stroke="#7A2E00" stroke-width="6"/>
  <ellipse cx="195" cy="304" rx="36" ry="17" fill="#D95F0A" stroke="#7A2E00" stroke-width="6"/>
  <rect x="40" y="48" width="220" height="250" rx="72" fill="#FF7A1A" stroke="#7A2E00" stroke-width="8"/>
  <path d="M48 220 Q60 290 150 292 Q240 290 252 220 L252 236 Q246 294 150 294 Q54 294 48 236 Z" fill="#E8650C"/>
  <ellipse cx="92" cy="86" rx="38" ry="18" fill="#fff" opacity=".28" transform="rotate(-24 92 86)"/>
  <ellipse cx="72" cy="196" rx="20" ry="12" fill="#FF5A6E" opacity=".45"/><ellipse cx="228" cy="196" rx="20" ry="12" fill="#FF5A6E" opacity=".45"/>
  <g id="k-eyes">
    <g id="k-eyeL"><ellipse cx="108" cy="140" rx="40" ry="46" fill="#fff" stroke="#3A1400" stroke-width="5"/>
      <g clip-path="url(#k-clipL)"><g id="k-pupL"><circle cx="108" cy="142" r="18" fill="#141414"/><circle cx="114" cy="135" r="6" fill="#fff"/></g>
      <rect id="k-lidL" x="64" y="90" width="88" height="100" fill="#FF7A1A"/></g></g>
    <g id="k-eyeR"><ellipse cx="192" cy="140" rx="40" ry="46" fill="#fff" stroke="#3A1400" stroke-width="5"/>
      <g clip-path="url(#k-clipR)"><g id="k-pupR"><circle cx="192" cy="142" r="18" fill="#141414"/><circle cx="198" cy="135" r="6" fill="#fff"/></g>
      <rect id="k-lidR" x="148" y="90" width="88" height="100" fill="#FF7A1A"/></g></g>
  </g>
  <rect id="k-browL" x="80" y="74" width="58" height="15" rx="7.5" fill="#5A2200"/>
  <rect id="k-browR" x="162" y="74" width="58" height="15" rx="7.5" fill="#5A2200"/>
  <g id="k-mouth"><ellipse cx="150" cy="228" rx="26" ry="28" fill="#3A0A0A" stroke="#2A0505" stroke-width="4"/><ellipse cx="150" cy="244" rx="15" ry="8" fill="#FF5A6E"/></g>
  <g id="k-grin"><path d="M98 212 Q150 278 202 212 Q150 226 98 212 Z" fill="#3A0A0A" stroke="#2A0505" stroke-width="4" stroke-linejoin="round"/><path d="M128 246 Q150 256 172 246 Q150 238 128 246 Z" fill="#FF5A6E"/></g>
  <path id="k-sweat" d="M262 70 Q274 92 266 102 Q254 108 250 96 Q250 86 262 70 Z" fill="#7FD3FF" stroke="#2A5A80" stroke-width="4"/>
</svg>`;

let kJs = "";
const setMood = (m, t, dur) => {
  const p = M[m];
  const o = `duration: ${dur}, ease: "back.out(1.8)"`;
  return `      tl.to(["#k-eyeL", "#k-eyeR"], { scale: ${p.eye}, ${o} }, ${t});
      tl.to(["#k-pupL", "#k-pupR"], { x: ${p.px}, y: ${p.py}, scale: ${p.ps}, ${o} }, ${t});
      tl.to("#k-lidL", { scaleY: ${p.lL}, duration: ${dur}, ease: "power2.out" }, ${t});
      tl.to("#k-lidR", { scaleY: ${p.lR}, duration: ${dur}, ease: "power2.out" }, ${t});
      tl.to("#k-browL", { y: ${p.bL}, rotation: ${p.tL}, ${o} }, ${t});
      tl.to("#k-browR", { y: ${p.bR}, rotation: ${-p.tR}, ${o} }, ${t});
      tl.to("#k-mouth", { scaleX: ${p.mx || 0.001}, scaleY: ${p.my || 0.001}, opacity: ${p.g ? 0 : 1}, ${o} }, ${t});
      tl.to("#k-grin", { scale: ${p.g ? 1 : 0.2}, opacity: ${p.g}, ${o} }, ${t});
      tl.to("#k-armL", { rotation: ${p.aL}, duration: ${dur * 1.3}, ease: "back.out(1.6)" }, ${+(t + 0.04).toFixed(2)});
      tl.to("#k-armR", { rotation: ${p.aR}, duration: ${dur * 1.3}, ease: "back.out(1.6)" }, ${+(t + 0.08).toFixed(2)});
      tl.to("#k-sweat", { opacity: ${p.sw}, scale: ${p.sw ? 1 : 0.3}, duration: ${dur}, ease: "power2.out" }, ${t});
`;
};
// initial state = shock (frame 0 and the loop end)
const p0 = M.shock;
kJs += `      gsap.set("#k-armL", { svgOrigin: "48 190" }); gsap.set("#k-armR", { svgOrigin: "252 190" });
      gsap.set(["#k-eyeL"], { svgOrigin: "108 140" }); gsap.set(["#k-eyeR"], { svgOrigin: "192 140" });
      gsap.set("#k-pupL", { svgOrigin: "108 142" }); gsap.set("#k-pupR", { svgOrigin: "192 142" });
      gsap.set("#k-lidL", { svgOrigin: "108 90" }); gsap.set("#k-lidR", { svgOrigin: "192 90" });
      gsap.set("#k-browL", { svgOrigin: "109 81" }); gsap.set("#k-browR", { svgOrigin: "191 81" });
      gsap.set("#k-mouth", { svgOrigin: "150 228" }); gsap.set("#k-grin", { svgOrigin: "150 230" }); gsap.set("#k-sweat", { svgOrigin: "260 100" });
      gsap.set(["#k-eyeL", "#k-eyeR"], { scale: ${p0.eye} });
      gsap.set(["#k-pupL", "#k-pupR"], { x: 0, y: 0, scale: ${p0.ps} });
      gsap.set(["#k-lidL", "#k-lidR"], { scaleY: 0 });
      gsap.set("#k-browL", { y: ${p0.bL}, rotation: ${p0.tL} }); gsap.set("#k-browR", { y: ${p0.bR}, rotation: ${-p0.tR} });
      gsap.set("#k-mouth", { scaleX: ${p0.mx}, scaleY: ${p0.my}, opacity: 1 }); gsap.set("#k-grin", { scale: 0.2, opacity: 0 });
      gsap.set("#k-armL", { rotation: ${p0.aL} }); gsap.set("#k-armR", { rotation: ${p0.aR} });
      gsap.set("#k-sweat", { opacity: 1, scale: 1 });
      gsap.set("#k-wrap", { x: 0, y: 0, rotation: 0 }); gsap.set("#k-sq", { scaleX: 1, scaleY: 1 });
      // idle bob: 66 half-cycles over the film, ends where it starts
      tl.fromTo("#k-bob", { y: 0 }, { y: -12, duration: ${(DUR / 66).toFixed(5)}, ease: "sine.inOut", yoyo: true, repeat: 65 }, 0);
      // shock tremble in the hook, big jolt on VÖGELN
      tl.to("#k-wrap", { keyframes: { x: [0, -5, 5, -4, 4, -3, 3, 0] }, duration: 0.55, ease: "none" }, 0.05);
      tl.to("#k-wrap", { keyframes: { x: [0, -16, 14, -10, 6, 0], rotation: [0, -6, 5, -3, 1, 0] }, duration: 0.4, ease: "none" }, 0.66);
      tl.to("#k-sweat", { y: 14, duration: 0.5, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0.3);
`;
for (const [t, m] of moods) {
  // anticipation squash, then the new face
  kJs += `      // ${m} @ ${t}\n`;
  kJs += `      tl.to("#k-sq", { keyframes: { scaleY: [1, 0.9, 1.06, 1], scaleX: [1, 1.07, 0.97, 1] }, duration: 0.3, ease: "none" }, ${+(t - 0.05).toFixed(2)});\n`;
  kJs += setMood(m, +(t + 0.03).toFixed(2), 0.22);
}
for (const b of blinks) kJs += `      tl.to(["#k-lidL", "#k-lidR"], { scaleY: 1, duration: 0.06, yoyo: true, repeat: 1, ease: "power1.inOut" }, ${b});\n`;
kJs += `      // pupils follow the action
      tl.to(["#k-pupL", "#k-pupR"], { keyframes: { x: [0, -16, 14, -14, 10, 0] }, duration: 1.4, ease: "sine.inOut" }, 4.4);
      tl.to(["#k-pupL", "#k-pupR"], { keyframes: { x: [0, -16, 16, -12, 14, -10, 0], y: [0, -8, 6, 8, -6, 4, 0] }, duration: 1.6, ease: "none" }, 14.8);
      // KLACK: flinch
      tl.to("#k-wrap", { keyframes: { x: [0, 10, -10, 6, 0], y: [0, -20, 0, -6, 0] }, duration: 0.35, ease: "none" }, 16.7);
      // jaw drop: little hop
      tl.to("#k-wrap", { keyframes: { y: [0, -40, 0] }, duration: 0.4, ease: "power1.inOut" }, 22.62);
      // PANZER: falls over, lies there, jumps back up for the winner
      tl.to("#k-wrap", { rotation: -86, x: -40, duration: 0.42, ease: "bounce.out" }, 26.4);
      tl.to("#k-wrap", { rotation: -82, duration: 0.3, yoyo: true, repeat: 3, ease: "sine.inOut" }, 26.9);
      tl.to("#k-wrap", { keyframes: { rotation: [-86, -20, 0, 0], y: [0, -140, -60, 0], x: [-40, -20, 0, 0] }, duration: 0.5, ease: "power1.out" }, 28.15);
      tl.to("#k-wrap", { keyframes: { y: [0, -50, 0, -30, 0] }, duration: 0.8, ease: "sine.inOut" }, 28.75);
      // question: head tilt to the viewer
      tl.to("#k-wrap", { rotation: -8, duration: 0.35, ease: "back.out(2)" }, 30.05);
      tl.to("#k-wrap", { rotation: 4, duration: 0.5, ease: "sine.inOut" }, 30.9);
      tl.to("#k-wrap", { rotation: 0, duration: 0.25, ease: "power2.out" }, 31.75);
      // loop: shock jolt lands back on the frame-0 pose
      tl.to("#k-wrap", { keyframes: { x: [0, -8, 6, 0], y: [0, -24, 0, 0] }, duration: 0.3, ease: "none" }, 32.12);
`;
fs.writeFileSync(path.join(OUT, "compositions", "klotz.html"), `<template>
  <style>
    #root { position: absolute; inset: 0; pointer-events: none; }
    #k-wrap { position: absolute; left: 690px; top: 1480px; width: 260px; height: 286px; transform-origin: 18% 100%; }
    #k-bob, #k-sq { position: absolute; inset: 0; transform-origin: 50% 100%; }
    #k-shadow { position: absolute; left: 715px; top: 1748px; width: 210px; height: 30px; border-radius: 50%; background: rgba(0,0,0,.35); }
  </style>
  <div id="root" data-composition-id="klotz" data-width="1080" data-height="1920" data-layout-allow-overflow>
    <div id="k-shadow"></div>
    <div id="k-wrap"><div id="k-bob"><div id="k-sq">
${klotzSvg}
    </div></div></div>
  </div>
  <script>
    (function () {
      const tl = gsap.timeline({ paused: true });
${kJs}      window.__timelines["klotz"] = tl;
    })();
  </script>
</template>
`);

// ================= index.html =================
const sfx = [
  [0.0, "impact", 0.8], [0.35, "pop2", 0.45], [0.66, "stamp", 0.7], [2.62, "pop1", 0.6], [2.88, "stamp", 0.55], [3.08, "pop2", 0.5],
  [4.05, "pop1", 0.5], [4.5, "pop2", 0.45], [5.0, "pop1", 0.45], [6.22, "whoosh2", 0.5], [8.47, "stamp", 0.8], [9.75, "whoosh1", 0.5],
  [10.3, "klack", 0.45], [11.0, "pop2", 0.5], [11.35, "whoosh2", 0.45], [12.82, "klack", 0.4], [14.6, "whoosh1", 0.6], [16.73, "klack", 0.9],
  [18.62, "whoosh2", 0.45], [19.6, "stamp", 0.85], [20.45, "pop1", 0.55], [22.68, "pop2", 0.45], [23.0, "pop1", 0.45], [23.35, "pop2", 0.45],
  [24.85, "whoosh1", 0.45], [26.02, "impact", 0.85], [26.55, "stamp", 0.55], [27.45, "drumroll", 0.6], [28.22, "crash", 0.55], [28.25, "impact", 0.5],
  [30.02, "pop1", 0.55], [31.92, "whoosh2", 0.6], [32.12, "pop2", 0.4],
];
const sfxDur = { impact: 0.6, whoosh1: 0.35, whoosh2: 0.28, stamp: 0.35, pop1: 0.12, pop2: 0.1, klack: 0.3, drumroll: 0.75, crash: 1.6 };
// lanes: one lane unless overlapping
const lanes = [];
const sfxTags = sfx.map(([t, n, v], i) => {
  const end = t + sfxDur[n];
  let lane = lanes.findIndex((e) => e <= t + 1e-6);
  if (lane < 0) { lanes.push(end); lane = lanes.length - 1; } else lanes[lane] = end;
  const dd = Math.min(sfxDur[n], +(DUR - t).toFixed(2));
  return `      <audio id="sfx-${String(i + 1).padStart(2, "0")}-${n}" class="clip" src="assets/sfx/${n}.wav" data-start="${t}" data-duration="${dd}" data-track-index="${6 + lane}" data-volume="${v}"></audio>`;
});

const host = (id, start, dur, track, z, kind = "graphics") => `      <div id="${id}" data-composition-id="${id}" data-composition-src="compositions/${id}.html" data-start="${start}" data-duration="${dur}" data-track-index="${track}" data-track-kind="${kind}" data-width="1080" data-height="1920" style="z-index:${z}"></div>`;

const index = `<!doctype html>
<html lang="de" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="assets/vendor/gsap.min.js"></script>
    <style>
      ${FONTFACE}
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { margin: 0; width: 1080px; height: 1920px; overflow: hidden; background: #0E1530; }
      #root { position: relative; width: 100%; height: 100%; background: #0E1530; font-family: 'Inter', sans-serif; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${DUR}" data-width="1080" data-height="1920">
${host("bg", 0, DUR, 0, 1)}
${scenes.map((s, i) => host(s.id, s.start, s.host, 1 + (i % 2), 2)).join("\n")}
${host("klotz", 0, DUR, 3, 3)}
${host("captions", 0, DUR, 4, 4, "captions")}
      <audio id="music-beat" class="clip" src="assets/sfx/beat.wav" data-start="0" data-duration="${DUR}" data-track-index="5" data-volume="0.42"></audio>
${sfxTags.join("\n")}
    </div>
    <script>
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`;
fs.writeFileSync(path.join(OUT, "index.html"), index);
console.log("written", scenes.length, "scenes,", sfx.length, "sfx, lanes", lanes.length);
