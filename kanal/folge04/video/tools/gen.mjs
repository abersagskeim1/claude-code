// Generator for Folge 4 "Der Whisky-Krieg": writes index.html and compositions/*.html
// Usage: node tools/gen.mjs <project_dir>
// Technique from Folge 1-3 (scene helper, overlapping exits, Klotz rig, captions with fixed word gap, id checks).
// Scenes, drawings and the Klotz gag are new: arctic sea, Hans rock, boats, flags, bottles, mittens, cocoa.
import fs from "node:fs";
import path from "node:path";

const OUT = process.argv[2];
export const DUR = 39.2;
fs.mkdirSync(path.join(OUT, "compositions"), { recursive: true });

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const R = mulberry32(1973);
const r = (a, b) => +(a + (b - a) * R()).toFixed(2);

const K = "#0A0F22";
const YEL = "#FFD23F", RED = "#FF3B3B", FRED = "#E3202F", FRED_D = "#9E1020";
const ICE = "#DDF3FF", ICE_M = "#9FD6F5", ICE_D = "#4A90C0";
const ROCK = "#7D8796", ROCK_D = "#5B6475", ROCK_L = "#A6B0BD", ROCK_DD = "#3E4555";
const SEA_F = "#2464A8", SEA_C = "#BFE6FF";

// ================= drawings (own designs) =================
// bare rock, side view, viewBox 760 x 420; RTOP is its outline (used to put things on its surface)
const RTOP = [[20, 420], [60, 300], [130, 230], [200, 150], [290, 110], [360, 60], [440, 80], [520, 140], [600, 170], [660, 250], [720, 320], [745, 420]];
const surf = (x) => { for (let i = 0; i < RTOP.length - 1; i++) { const [a, b] = [RTOP[i], RTOP[i + 1]]; if (x >= a[0] && x <= b[0]) return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); } return 420; };
const ROCK_OUT = `M${RTOP.map((p) => p.join(" ")).join(" L")} Z`;
const ROCK_INNER = `<path d="${ROCK_OUT}" fill="${ROCK}"/>
  <path d="M360 60 L440 80 L520 140 L600 170 L660 250 L720 320 L745 420 L470 420 L430 260 Z" fill="${ROCK_D}"/>
  <path d="M200 150 L290 110 L360 60 L332 172 L238 232 Z" fill="${ROCK_L}"/>
  <path d="M60 300 L130 230 L178 262 L118 344 Z" fill="${ROCK_L}" opacity=".7"/>
  <path d="M520 140 L600 170 L560 230 Z" fill="${ROCK}" opacity=".8"/>
  <path d="M332 172 L300 262 L322 334 M566 214 L528 296 L540 352 M150 304 L190 364 M640 300 L612 372" stroke="${ROCK_DD}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M228 150 L282 124" stroke="#D3DAE3" stroke-width="8" stroke-linecap="round"/>
  <path d="${ROCK_OUT}" fill="none" stroke="${K}" stroke-width="9" stroke-linejoin="round"/>`;
const ROCK_SVG = `<svg viewBox="0 0 760 420" width="100%" height="100%" overflow="visible">${ROCK_INNER}</svg>`;

// flags (simplified, own): Canada red-white-red with a simple own leaf, Denmark red with white cross
const LEAF = "M150 30 L162 58 L180 50 L174 82 L198 74 L190 98 L208 106 L170 124 L176 140 L154 130 L154 156 L146 156 L146 130 L124 140 L130 124 L92 106 L110 98 L102 74 L126 82 L120 50 L138 58 Z";
const FLAG_CA = `<svg viewBox="0 0 300 180" width="100%" height="100%" overflow="visible"><rect x="4" y="4" width="292" height="172" rx="6" fill="#fff"/><rect x="4" y="4" width="76" height="172" fill="${FRED}"/><rect x="220" y="4" width="76" height="172" fill="${FRED}"/><path d="${LEAF}" fill="${FRED}" stroke="${FRED_D}" stroke-width="3" stroke-linejoin="round"/><rect x="4" y="4" width="292" height="172" rx="6" fill="none" stroke="${K}" stroke-width="8"/></svg>`;
const FLAG_DK = `<svg viewBox="0 0 300 180" width="100%" height="100%" overflow="visible"><rect x="4" y="4" width="292" height="172" rx="6" fill="${FRED}"/><rect x="92" y="4" width="40" height="172" fill="#fff"/><rect x="4" y="70" width="292" height="40" fill="#fff"/><rect x="4" y="4" width="292" height="172" rx="6" fill="none" stroke="${K}" stroke-width="8"/></svg>`;
const POLE_CSS = `background:linear-gradient(90deg,#8A96A6,#E6ECF2 45%,#8A96A6);border:4px solid ${K};border-radius:7px;`;

// bottles without any brand: whisky (amber, square), schnaps (clear, slim). Plain label bands, no text.
const WHISKY = `<svg viewBox="0 0 120 300" width="100%" height="100%" overflow="visible">
  <rect x="44" y="2" width="32" height="26" rx="6" fill="#8A5A2B" stroke="${K}" stroke-width="6"/>
  <path d="M46 28 L74 28 L74 78 Q110 92 112 120 L112 280 Q112 296 96 296 L24 296 Q8 296 8 280 L8 120 Q10 92 46 78 Z" fill="#C8742A" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>
  <path d="M14 150 L106 150 L106 280 Q106 290 96 290 L24 290 Q14 290 14 280 Z" fill="#A85A1A" opacity=".55"/>
  <rect x="18" y="168" width="84" height="62" rx="6" fill="#F4E6C8" stroke="${K}" stroke-width="5"/><rect x="28" y="184" width="64" height="8" rx="4" fill="#C8742A"/><rect x="36" y="204" width="48" height="8" rx="4" fill="#C8742A"/>
  <path d="M24 112 Q22 140 24 160" stroke="#FFE2B0" stroke-width="9" fill="none" stroke-linecap="round" opacity=".8"/>
</svg>`;
const SCHNAPS = `<svg viewBox="0 0 100 300" width="100%" height="100%" overflow="visible">
  <rect x="34" y="2" width="32" height="24" rx="6" fill="#B8C4D2" stroke="${K}" stroke-width="6"/>
  <path d="M38 26 L62 26 L62 104 Q90 116 90 150 L90 280 Q90 296 74 296 L26 296 Q10 296 10 280 L10 150 Q10 116 38 104 Z" fill="#CFF3F2" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>
  <path d="M16 170 L84 170 L84 280 Q84 290 74 290 L26 290 Q16 290 16 280 Z" fill="#9EE3E6" opacity=".7"/>
  <rect x="12" y="196" width="76" height="34" rx="4" fill="#2B5BD7" stroke="${K}" stroke-width="5"/>
  <path d="M24 130 Q20 160 24 186" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round" opacity=".9"/>
</svg>`;

// snowflake, 6 arms
const FLAKE = (col = "#fff") => `<svg viewBox="0 0 100 100" width="100%" height="100%" overflow="visible"><g stroke="${K}" stroke-width="14" stroke-linecap="round"><path d="M50 6 V94 M12 28 L88 72 M12 72 L88 28"/></g><g stroke="${col}" stroke-width="7" stroke-linecap="round" fill="none"><path d="M50 6 V94 M12 28 L88 72 M12 72 L88 28"/><path d="M38 14 L50 24 L62 14 M38 86 L50 76 L62 86"/></g></svg>`;

// boat, side view, bow to the right (flip with sx=-1): 300 x 150
const BOAT = (hull, deck, mini, flip = false) => `<svg viewBox="0 0 300 150" width="100%" height="100%" overflow="visible"><g${flip ? ' transform="translate(300 0) scale(-1 1)"' : ""}>
  <rect x="146" y="10" width="8" height="70" fill="#5A4636" stroke="${K}" stroke-width="4"/>
  <g transform="translate(154 12) scale(0.24)">${mini}</g>
  <rect x="70" y="52" width="110" height="46" rx="10" fill="${deck}" stroke="${K}" stroke-width="7"/>
  <rect x="88" y="62" width="30" height="24" rx="6" fill="#BFE6FF" stroke="${K}" stroke-width="5"/><rect x="130" y="62" width="30" height="24" rx="6" fill="#BFE6FF" stroke="${K}" stroke-width="5"/>
  <path d="M8 92 L292 92 Q280 140 236 144 L56 144 Q22 140 8 92 Z" fill="${hull}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
  <path d="M26 110 L276 110" stroke="#fff" stroke-width="9"/>
</g></svg>`;
const MINI_CA = `<rect width="300" height="180" fill="#fff" stroke="${K}" stroke-width="16"/><rect width="76" height="180" fill="${FRED}"/><rect x="224" width="76" height="180" fill="${FRED}"/><path d="${LEAF}" fill="${FRED}"/>`;
const MINI_DK = `<rect width="300" height="180" fill="${FRED}" stroke="${K}" stroke-width="16"/><rect x="92" width="40" height="180" fill="#fff"/><rect y="70" width="300" height="40" fill="#fff"/>`;
// small person in a parka (no weapons): 50 x 90
const PERSON = (parka, hood) => `<svg viewBox="0 0 50 90" width="100%" height="100%" overflow="visible"><rect x="8" y="34" width="34" height="48" rx="14" fill="${parka}" stroke="${K}" stroke-width="5"/><circle cx="25" cy="22" r="17" fill="${hood}" stroke="${K}" stroke-width="5"/><circle cx="25" cy="24" r="10" fill="#F2C29B"/><circle cx="21" cy="23" r="2.4" fill="${K}"/><circle cx="29" cy="23" r="2.4" fill="${K}"/><rect x="12" y="78" width="10" height="12" rx="4" fill="${K}"/><rect x="28" y="78" width="10" height="12" rx="4" fill="${K}"/></svg>`;

// front waves (in front of rock and boats), strip 1800 wide, period 180
const WAVE_PATH = (y0, amp, w) => { let d = `M0 ${y0}`; for (let x = 0; x < w; x += 180) d += ` Q${x + 45} ${y0 - amp} ${x + 90} ${y0} T${x + 180} ${y0}`; return d; };
const FRONTWAVE = (id) => `<div id="${id}" class="fw"><svg viewBox="0 0 1800 540" width="1800" height="540" overflow="visible"><defs><linearGradient id="${id}-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${SEA_F}"/><stop offset=".35" stop-color="#1A4E92"/><stop offset="1" stop-color="#0E2E66"/></linearGradient></defs><path d="${WAVE_PATH(30, 26, 1800)} L1800 540 L0 540 Z" fill="url(#${id}-g)"/><path d="${WAVE_PATH(30, 26, 1800)}" fill="none" stroke="${K}" stroke-width="7"/><path d="${WAVE_PATH(110, 12, 1800)}" fill="none" stroke="rgba(191,230,255,.25)" stroke-width="7"/><path d="${WAVE_PATH(30, 26, 1800)}" fill="none" stroke="${SEA_C}" stroke-width="6" transform="translate(0 6)"/></svg></div>`;

// ---------- common CSS ----------
const STK = `filter: drop-shadow(5px 0 0 #fff) drop-shadow(-5px 0 0 #fff) drop-shadow(0 5px 0 #fff) drop-shadow(0 -5px 0 #fff) drop-shadow(0 14px 0 rgba(0,0,0,.35));`;
const FONTFACE = `@font-face{font-family:'Lilita One';src:url('assets/fonts/LilitaOne-latin.woff2') format('woff2');font-weight:400;font-style:normal;font-display:block;}`;
const abs = (l, t, w, h) => `position:absolute;left:${l}px;top:${t}px;width:${w}px;${h != null ? `height:${h}px;` : ""}`;
const LBL = (size) => `font-family:'Lilita One';font-size:${size}px;line-height:1;color:#fff;-webkit-text-stroke:12px ${K};paint-order:stroke fill;text-shadow:0 8px 0 rgba(0,0,0,.35);white-space:nowrap;`;

function scene(id, title, start, dur, css, body, js, defs = "", opts = {}) {
  const exit = opts.exit !== false, kb = opts.kb !== false, exDur = opts.exitDur || 0.24, exLead = opts.exitLead ?? 0.18;
  const html = `<template>
  <style>
    ${FONTFACE}
    #root { position: absolute; inset: 0; overflow: hidden; }
    #${id}-out, #${id}-kb { position: absolute; inset: 0; transform-origin: 540px 1200px; }
    .${id}-stk { ${STK} }
    .fw { position: absolute; left: -360px; top: 1385px; width: 1800px; height: 540px; }
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
${opts.hold0 || opts.reveal0 ? "" : `      // the new picture shows up only once the old one is (nearly) gone: no graphic covers the fading one
      tl.fromTo("#${id}-out", { opacity: 0 }, { opacity: 1, duration: 0.01, ease: "none" }, 0.04);`}
${kb ? `      // slow drift so the frame never stands still
      tl.fromTo("#${id}-kb", { scale: 1 }, { scale: 1.04, duration: ${dur}, ease: "none" }, 0);` : ""}
${js}
${exit ? `      // overlap exit: old graphic is gone 0.06 s after the cut, the next scene builds up from the cut on
      tl.to("#${id}-out", { opacity: 0, scale: 0.93, duration: ${exDur}, ease: "power3.in" }, ${+(dur - exLead).toFixed(2)});` : ""}
      window.__timelines["${id}"] = tl;
    })();
  </script>
</template>
`;
  fs.writeFileSync(path.join(OUT, "compositions", `${id}.html`), html);
  return { id, title, start, dur, host: +(dur + (exit ? 0.3 : 0)).toFixed(2) };
}
const shake = (sel, at, a = 18, d = 0.32) => `      tl.to("${sel}", { keyframes: { x: [0, ${-a}, ${+(a * 0.8).toFixed(1)}, ${+(-a * 0.5).toFixed(1)}, ${+(a * 0.3).toFixed(1)}, 0], y: [0, ${+(a * 0.5).toFixed(1)}, ${+(-a * 0.4).toFixed(1)}, ${+(a * 0.2).toFixed(1)}, 0, 0] }, duration: ${d}, ease: "none" }, ${at});`;
// waving flag: one cycle 0.9 s, starts and ends flat
const wave = (sel, at, n, amp = 5) => `      tl.to("${sel}", { keyframes: { skewY: [0, ${amp}, ${-amp * 0.8}, ${amp * 0.6}, 0], scaleX: [1, 0.93, 1, 0.95, 1] }, duration: 0.9, ease: "none", repeat: ${n - 1} }, ${at});`;
const waveMove = (id, d, endAtZero = false) => endAtZero
  ? `      tl.fromTo("#${id}", { x: ${+(d * 60).toFixed(1)} }, { x: 0, duration: ${d}, ease: "none" }, 0);`
  : `      tl.fromTo("#${id}", { x: 0 }, { x: ${-(d * 60).toFixed(1)}, duration: ${d}, ease: "none" }, 0);`;

// ================= timing (one row per caption / scene) =================
const C = {
  c01: [0, 2.3], c02: [2.3, 4.8], c03: [4.8, 6.5], c04: [6.5, 8.4], c05: [8.4, 10.45], c06: [10.45, 13.4], c07: [13.4, 15.9], c08: [15.9, 18.4],
  c09: [18.4, 20.9], c10: [20.9, 22.95], c11: [22.95, 25.0], c12: [25.0, 27.05], c13: [27.05, 30.0], c14: [30.0, 31.8], c15: [31.8, 33.85],
  c16: [33.85, 36.05], c17: [36.05, 38.55], c18: [38.55, DUR],
};
const T = {
  hook: [0, 2.3], jahre: [2.3, 4.8], waffen: [4.8, 6.5], flaschen: [6.5, 8.4], hans: [8.4, 10.45], karte: [10.45, 18.4],
  insel: [18.4, 30.0], frieden: [30.0, 31.8], geteilt: [31.8, 33.85], drink: [33.85, 36.05], frage: [36.05, DUR],
};
const S = (k) => [T[k][0], +(T[k][1] - T[k][0]).toFixed(2)];
const scenes = [];

// ================= HOOK picture (frame 0 = thumbnail motif): rock in the ice sea, a flag on each side =================
// hook caption ends ~650; flags start at y 760
const HK = { x: 160, y: 1010, s: 1 };
const hookCss = (p) => `
   #${p}-glow{${abs(40, 820, 1000, 760)}border-radius:50%;background:radial-gradient(circle,rgba(159,214,245,.42) 0%,rgba(159,214,245,.12) 45%,rgba(159,214,245,0) 68%);}
   #${p}-rock{${abs(160, 1010, 760, 420)}transform-origin:50% 100%;}
   .${p}-pole{position:absolute;width:16px;${POLE_CSS}transform-origin:50% 100%;}
   .${p}-flag{position:absolute;width:250px;height:150px;transform-origin:0% 50%;}`;
const hookBody = (p) => `      <div id="${p}-glow"></div>
      <div id="${p}-pl" class="${p}-pole" style="left:352px;top:760px;height:410px;"><div id="${p}-fl" class="${p}-flag" style="left:10px;top:4px;">${FLAG_CA}</div></div>
      <div id="${p}-pr" class="${p}-pole" style="left:712px;top:770px;height:405px;"><div id="${p}-fr" class="${p}-flag" style="left:10px;top:4px;">${FLAG_DK}</div></div>
      <div id="${p}-rock" class="${p}-stk">${ROCK_SVG}</div>
      ${FRONTWAVE(p + "-fw")}`;
{
  const p = "hook";
  const [s, d] = S(p);
  scenes.push(scene(p, "Hook: Felsen mit zwei Fahnen", s, d, hookCss(p), hookBody(p),
    `      // frame 0 already shows the full motif (thumbnail picture)
${waveMove("hook-fw", d)}
${wave("#hook-fl", 0, 3)}
${wave("#hook-fr", 0.1, 3, 6)}
      tl.to("#hook-glow", { scale: 1.08, opacity: 0.7, duration: 0.55, yoyo: true, repeat: 3, ease: "sine.inOut" }, 0);
      // 0.35 s FELSEN: the rock thumps, the poles start a tug of war
      tl.to("#hook-rock", { keyframes: { scaleY: [1, 0.94, 1.03, 1], scaleX: [1, 1.03, 0.99, 1] }, duration: 0.35, ease: "none" }, 0.35);
      tl.to("#hook-pl", { keyframes: { rotation: [0, 7, -3, 6, 0] }, duration: 1.2, ease: "sine.inOut" }, 0.7);
      tl.to("#hook-pr", { keyframes: { rotation: [0, -7, 3, -6, 0] }, duration: 1.2, ease: "sine.inOut" }, 0.75);`,
    "", { hold0: true }));
}

// ================= JAHRE: tear-off calendar, sheets fly from 1973 to 2022 (2.3 - 4.8) =================
{
  const p = "jahre";
  const [s, d] = S(p);
  const N = 6; // blank sheets between 1973 and 2022 (no other numbers in the picture)
  const sheet = (id, txt, col) => `<div id="${id}" class="jahre-sh">${txt ? `<span style="color:${col}">${txt}</span>` : `<i></i><i style="top:250px;width:300px"></i><i style="top:330px;width:340px"></i>`}</div>`;
  let sheets = sheet("jahre-s2022", "2022", YEL);
  for (let i = N - 1; i >= 0; i--) sheets += sheet("jahre-sb" + i, "", "");
  sheets += sheet("jahre-s1973", "1973", "#fff");
  scenes.push(scene(p, "Fast 50 Jahre", s, d,
    `#jahre-cal{${abs(250, 690, 580, 640)}}
     #jahre-back{position:absolute;left:0;top:30px;width:580px;height:610px;border-radius:28px;background:#2B5BD7;border:10px solid ${K};box-shadow:0 16px 0 rgba(0,0,0,.35);}
     #jahre-head{position:absolute;left:0;top:30px;width:580px;height:120px;border-radius:28px 28px 0 0;background:${FRED};border:10px solid ${K};}
     .jahre-ring{position:absolute;top:0;width:34px;height:80px;border-radius:17px;background:#C9D3DE;border:7px solid ${K};}
     .jahre-sh{position:absolute;left:30px;top:160px;width:520px;height:450px;border-radius:14px;background:${ICE};border:8px solid ${K};transform-origin:50% 0%;}
     .jahre-sh span{position:absolute;left:0;right:0;top:110px;text-align:center;${LBL(200)}-webkit-text-stroke:16px ${K};}
     .jahre-sh i{position:absolute;left:90px;top:170px;width:340px;height:34px;border-radius:17px;background:#B8D4E8;}
     #jahre-arrow{${abs(120, 1370, 0, 0)}}`,
    `      <div id="jahre-cal">
        <div id="jahre-back"></div><div id="jahre-head"></div>
${sheets}
        <div class="jahre-ring" style="left:120px"></div><div class="jahre-ring" style="left:273px"></div><div class="jahre-ring" style="left:426px"></div>
      </div>`,
    `      tl.fromTo("#jahre-cal", { y: 900, rotation: -8 }, { y: 0, rotation: 0, duration: 0.38, ease: "back.out(1.4)" }, 0);
      tl.to("#jahre-cal", { keyframes: { rotation: [0, -2, 2, 0] }, duration: 0.5, ease: "sine.inOut" }, 0.4);
      // 1973 tears off, blank sheets fly away fast, 2022 stays
      const ids = ["#jahre-s1973", ${Array.from({ length: N }, (_, i) => `"#jahre-sb${N - 1 - i}"`).join(", ")}];
      ids.forEach((id, i) => {
        const at = 0.75 + i * 0.13, side = i % 2 ? 1 : -1;
        tl.to(id, { keyframes: { y: [0, -30, 260], x: [0, side * 160, side * 820], rotation: [0, side * 14, side * 70] }, opacity: 0.0, duration: 0.42, ease: "power1.in" }, at);
      });
      tl.set("#jahre-s2022 span", { opacity: 0 }, 0);
      tl.fromTo("#jahre-s2022 span", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(3)", immediateRender: false }, ${(0.75 + N * 0.13 + 0.12).toFixed(2)});
${shake("#jahre-cal", +(0.75 + N * 0.13 + 0.15).toFixed(2), 14, 0.3)}`,
    "", { reveal0: true }));
}

// ================= WAFFEN?: two shy cannons on ice floes, a big question mark (4.8 - 6.5) =================
{
  const p = "waffen";
  const [s, d] = S(p);
  const cannon = (flip) => `<svg viewBox="0 0 360 260" width="100%" height="100%" overflow="visible"><g${flip ? ' transform="translate(360 0) scale(-1 1)"' : ""}>
    <g transform="rotate(-18 150 150)"><rect x="80" y="104" width="250" height="80" rx="38" fill="#3B4552" stroke="${K}" stroke-width="9"/><rect x="300" y="96" width="44" height="96" rx="16" fill="#4E5A6A" stroke="${K}" stroke-width="9"/><path d="M110 122 L290 122" stroke="#6E7A8A" stroke-width="10" stroke-linecap="round"/></g>
    <rect x="40" y="170" width="210" height="50" rx="14" fill="#8A5A2B" stroke="${K}" stroke-width="8"/>
    <circle cx="110" cy="200" r="54" fill="#B07A3E" stroke="${K}" stroke-width="9"/><circle cx="110" cy="200" r="14" fill="${K}"/><path d="M110 150 V250 M60 200 H160 M75 165 L145 235 M145 165 L75 235" stroke="${K}" stroke-width="7"/>
  </g></svg>`;
  const floe = `<svg viewBox="0 0 440 90" width="100%" height="100%" overflow="visible"><path d="M10 30 L60 6 L380 10 L430 34 L410 80 L30 84 Z" fill="${ICE}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/><path d="M30 40 L410 42" stroke="${ICE_M}" stroke-width="8"/></svg>`;
  scenes.push(scene(p, "Die Waffen?", s, d,
    `#waffen-L{${abs(40, 950, 440, 360)}transform-origin:50% 100%;} #waffen-R{${abs(600, 950, 440, 360)}transform-origin:50% 100%;}
     .waffen-c{position:absolute;left:30px;top:20px;width:360px;height:260px;}
     .waffen-f{position:absolute;left:0;top:270px;width:440px;height:90px;}
     #waffen-q{${abs(380, 600, 320, 340)}text-align:center;${LBL(330)}color:${YEL};-webkit-text-stroke:22px ${K};transform-origin:50% 90%;}
     .waffen-puff{position:absolute;width:70px;height:70px;border-radius:50%;background:#E8EDF3;border:6px solid #8A96A6;opacity:0;}`,
    `      <div id="waffen-L" class="waffen-stk"><div id="waffen-cL" class="waffen-c">${cannon(false)}</div><div class="waffen-f">${floe}</div></div>
      <div id="waffen-R" class="waffen-stk"><div id="waffen-cR" class="waffen-c">${cannon(true)}</div><div class="waffen-f">${floe}</div></div>
      <div id="waffen-pL" class="waffen-puff" style="left:390px;top:930px;"></div><div id="waffen-pR" class="waffen-puff" style="left:620px;top:930px;"></div>
      <div id="waffen-q">?</div>`,
    `      tl.fromTo("#waffen-L", { x: -600 }, { x: 0, duration: 0.35, ease: "back.out(1.3)" }, 0);
      tl.fromTo("#waffen-R", { x: 600 }, { x: 0, duration: 0.35, ease: "back.out(1.3)" }, 0.06);
      tl.to(["#waffen-L", "#waffen-R"], { y: -10, rotation: (i) => (i ? -2 : 2), duration: 0.4, yoyo: true, repeat: 3, ease: "sine.inOut" }, 0.35);
      tl.fromTo("#waffen-q", { scale: 0, rotation: -40 }, { scale: 1, rotation: 0, duration: 0.32, ease: "back.out(2.6)" }, 0.3);
      tl.to("#waffen-q", { keyframes: { rotation: [0, -10, 10, -6, 0] }, duration: 0.8, ease: "sine.inOut" }, 0.7);
      // the cannons only cough a tiny puff
      tl.to("#waffen-cL", { keyframes: { x: [0, -24, 0] }, duration: 0.25, ease: "power1.out" }, 0.75);
      tl.fromTo("#waffen-pL", { opacity: 0, scale: 0.3 }, { keyframes: { opacity: [0, 1, 0], scale: [0.3, 1.1, 1.5] }, duration: 0.5, ease: "none", immediateRender: false }, 0.78);
      tl.to("#waffen-cR", { keyframes: { x: [0, 24, 0] }, duration: 0.25, ease: "power1.out" }, 1.05);
      tl.fromTo("#waffen-pR", { opacity: 0, scale: 0.3 }, { keyframes: { opacity: [0, 1, 0], scale: [0.3, 1.1, 1.5] }, duration: 0.5, ease: "none", immediateRender: false }, 1.08);`,
    ""));
}

// ================= WHISKY und SCHNAPS: two bottles pop up, corks fly (6.5 - 8.4) =================
{
  const p = "flaschen";
  const [s, d] = S(p);
  const cork = (id, x, y, col) => `<div id="${id}" class="flaschen-cork" style="left:${x}px;top:${y}px;background:${col};"></div>`;
  scenes.push(scene(p, "Whisky und Schnaps", s, d,
    `#flaschen-W{${abs(160, 770, 232, 580)}transform-origin:50% 100%;} #flaschen-S{${abs(670, 760, 194, 584)}transform-origin:50% 100%;}
     .flaschen-cork{position:absolute;width:60px;height:46px;border-radius:10px;border:6px solid ${K};opacity:0;}
     .flaschen-b{position:absolute;width:26px;height:26px;border-radius:50%;border:5px solid rgba(255,255,255,.85);}
     #flaschen-glow{${abs(60, 760, 960, 700)}border-radius:50%;background:radial-gradient(circle,rgba(255,210,63,.32),rgba(255,210,63,0) 64%);}`,
    `      <div id="flaschen-glow"></div>
      <div id="flaschen-W" class="flaschen-stk">${WHISKY.replace('<rect x="44" y="2" width="32" height="26" rx="6" fill="#8A5A2B" stroke="#0A0F22" stroke-width="6"/>', "")}</div>
      <div id="flaschen-S" class="flaschen-stk">${SCHNAPS.replace('<rect x="34" y="2" width="32" height="24" rx="6" fill="#B8C4D2" stroke="#0A0F22" stroke-width="6"/>', "")}</div>
      ${cork("flaschen-kW", 246, 760, "#8A5A2B")}${cork("flaschen-kS", 737, 750, "#B8C4D2")}
      <div id="flaschen-b0" class="flaschen-b" style="left:240px;top:1180px;"></div><div id="flaschen-b1" class="flaschen-b" style="left:300px;top:1230px;"></div>
      <div id="flaschen-b2" class="flaschen-b" style="left:740px;top:1190px;"></div><div id="flaschen-b3" class="flaschen-b" style="left:790px;top:1240px;"></div>`,
    `      tl.fromTo("#flaschen-glow", { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }, 0);
      tl.fromTo("#flaschen-W", { scale: 0, rotation: -25 }, { scale: 1, rotation: -4, duration: 0.34, ease: "back.out(1.4)" }, 0.02);
      tl.fromTo("#flaschen-S", { scale: 0, rotation: 25 }, { scale: 1, rotation: 4, duration: 0.34, ease: "back.out(1.4)" }, 0.5);
      tl.fromTo("#flaschen-kW", { opacity: 1, x: 0, y: 0, rotation: 0 }, { keyframes: { x: [0, -90, -380], y: [0, -50, 260] }, rotation: -400, duration: 0.6, ease: "none", immediateRender: false }, 0.36);
      tl.fromTo("#flaschen-kS", { opacity: 1, x: 0, y: 0, rotation: 0 }, { keyframes: { x: [0, 90, 400], y: [0, -50, 260] }, rotation: 400, duration: 0.6, ease: "none", immediateRender: false }, 0.84);
      tl.to("#flaschen-W", { rotation: 4, duration: 0.45, yoyo: true, repeat: 2, ease: "sine.inOut" }, 0.4);
      tl.to("#flaschen-S", { rotation: -4, duration: 0.45, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0.85);
      [0, 1, 2, 3].forEach((i) => tl.fromTo("#flaschen-b" + i, { opacity: 0, y: 0, scale: 0.4 }, { keyframes: { opacity: [0, 1, 1, 0] }, y: -160, scale: 1, duration: 0.8, ease: "none" }, (i < 2 ? 0.45 : 0.95) + (i % 2) * 0.25));`,
    ""));
}

// ================= HANS-INSEL: zoom onto the rock, a wooden name sign (8.4 - 10.45) =================
{
  const p = "hans";
  const [s, d] = S(p);
  const sc = 1.316, rx = 40, ry = 940;
  const postX = rx + 300 * sc, postY = ry + surf(300) * sc;
  scenes.push(scene(p, "Hans-Insel", s, d,
    `#hans-cam{position:absolute;inset:0;transform-origin:540px 1150px;}
     #hans-rock{${abs(rx, ry, 760 * sc, 420 * sc)}}
     #hans-post{${abs(postX - 14, 820, 28, postY - 820 + 20)}background:#8A5A2B;border:7px solid ${K};border-radius:8px;transform-origin:50% 100%;}
     #hans-sign{${abs(postX - 210, 700, 420, 170)}transform-origin:50% 0%;}
     #hans-board{position:absolute;inset:0;border-radius:24px;background:linear-gradient(#D49A55,#B07A3E);border:10px solid ${K};box-shadow:0 12px 0 rgba(0,0,0,.35);}
     #hans-board i{position:absolute;left:24px;right:24px;height:8px;border-radius:4px;background:rgba(122,74,30,.45);}
     #hans-txt{position:absolute;left:0;right:0;top:22px;text-align:center;${LBL(124)}}
     .hans-n{position:absolute;top:30px;width:22px;height:22px;border-radius:50%;background:#5A4636;border:5px solid ${K};}
     #hans-ring{${abs(rx + 150, ry - 10, 760 * sc - 300, 560)}border-radius:50%;border:12px dashed ${YEL};opacity:0;}`,
    `      <div id="hans-cam">
      <div id="hans-ring"></div>
      <div id="hans-rock" class="hans-stk">${ROCK_SVG}</div>
      <div id="hans-post"></div>
      <div id="hans-sign"><div id="hans-board"><i style="top:56px"></i><i style="top:104px"></i></div><div class="hans-n" style="left:28px"></div><div class="hans-n" style="right:28px"></div><div id="hans-txt">HANS</div></div>
      ${FRONTWAVE("hans-fw")}
      </div>`,
    `${waveMove("hans-fw", d)}
      tl.fromTo("#hans-cam", { scale: 0.62, y: 120 }, { scale: 1, y: 0, duration: 0.5, ease: "back.out(1.2)" }, 0);
      tl.fromTo("#hans-post", { scaleY: 0 }, { scaleY: 1, duration: 0.22, ease: "back.out(2)" }, 0.45);
      tl.fromTo("#hans-sign", { scale: 0, rotation: -20 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2.2)" }, 0.55);
      tl.to("#hans-sign", { keyframes: { rotation: [0, 7, -5, 3, -1.5, 0] }, duration: 1.0, ease: "none" }, 0.85);
      tl.fromTo("#hans-ring", { opacity: 0, scale: 1.3, rotation: 0 }, { opacity: 0.9, scale: 1, rotation: 30, duration: 0.4, ease: "power2.out" }, 1.0);
      tl.to("#hans-ring", { rotation: 80, duration: 0.95, ease: "none" }, 1.4);`,
    ""));
}

// ================= KARTE: map with two coasts, 1973 border line, rock stays open (10.45 - 18.4) =================
{
  const p = "karte";
  const [s, d] = S(p);
  const L1 = 2.95, L2 = 5.45; // local beats: border line (13.4), open rock (15.9)
  const CA = "M0 0 L250 0 L290 60 L270 130 L310 190 L290 260 L330 330 L300 400 L350 470 L330 540 L380 610 L360 730 L0 730 Z";
  const GL = "M900 0 L478 0 L482 160 L540 196 L590 220 L580 250 L630 250 L610 330 L650 400 L630 480 L680 550 L660 640 L700 730 L900 730 Z";
  const ticks = Array.from({ length: 9 }, (_, i) => { const x = 330 + (i % 3) * 90 + (i > 2 ? 30 : 0), y = 90 + Math.floor(i / 3) * 230 + (i % 2) * 40; if (x + 48 > 470 && y < 240) return ""; return `<path d="M${x} ${y} q12 -10 24 0 t24 0" stroke="#8CC4F0" stroke-width="5" fill="none" stroke-linecap="round"/>`; }).join("");
  const dashB = [700, 654, 608, 562, 516, 470], dashT = [0, 46, 92, 138, 184, 230, 276];
  const dash = (id, y) => `<rect id="${id}" class="karte-d" x="452" y="${y}" width="16" height="30" rx="5" fill="${YEL}" stroke="${K}" stroke-width="4"/>`;
  scenes.push(scene(p, "Karte und Grenze", s, d,
    `#karte-pan{${abs(80, 690, 920, 750)}border-radius:34px;background:#2A6FB8;border:10px solid ${K};overflow:hidden;box-shadow:0 16px 0 rgba(0,0,0,.35);}
     #karte-map{position:absolute;left:0;top:0;width:900px;height:730px;}
     .karte-lbl{position:absolute;${LBL(78)}}
     #karte-q{${abs(470, 812, 160, 220)}text-align:center;${LBL(210)}color:${YEL};-webkit-text-stroke:18px ${K};transform-origin:50% 100%;}
     .karte-d{transform-box:fill-box;transform-origin:50% 50%;}`,
    `      <div id="karte-pan">
        <svg id="karte-map" viewBox="0 0 900 730" width="900" height="730" overflow="visible">
          <g id="karte-zoom">
            ${ticks}
            <path id="karte-ca" d="${CA}" fill="${ICE}" stroke="${K}" stroke-width="9" stroke-linejoin="round"/>
            <path id="karte-gl" d="${GL}" fill="${ICE}" stroke="${K}" stroke-width="9" stroke-linejoin="round"/>
            <path d="M40 300 l40 -40 l40 40 M120 420 l30 -30 l30 30 M700 330 l40 -40 l40 40 M760 470 l30 -30 l30 30" stroke="${ICE_M}" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            ${dashB.map((y, i) => dash("karte-db" + i, y)).join("")}
            ${dashT.map((y, i) => dash("karte-dt" + i, y)).join("")}
            <circle id="karte-ring" cx="460" cy="375" r="40" fill="none" stroke="${YEL}" stroke-width="8"/>
            <path id="karte-rock" d="M436 392 L442 366 L458 352 L474 358 L486 380 L482 396 Z" fill="${ROCK}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
            <path id="karte-redl" d="M436 392 L442 366 L458 352 L474 358 L486 380 L482 396 Z" fill="none" stroke="${RED}" stroke-width="7" stroke-linejoin="round" opacity="0"/>
          </g>
        </svg>
        <div id="karte-lca" class="karte-lbl" style="left:28px;top:576px;">KANADA</div>
        <div id="karte-lgl" class="karte-lbl" style="left:494px;top:62px;font-size:78px;">GRÖNLAND</div>
      </div>
      <div id="karte-q">?</div>`,
    `      tl.fromTo("#karte-pan", { y: 900, rotation: 5 }, { y: 0, rotation: 0, duration: 0.38, ease: "back.out(1.3)" }, 0);
      tl.fromTo("#karte-ca", { x: -420 }, { x: 0, duration: 0.4, ease: "back.out(1.3)" }, 0.25);
      tl.fromTo("#karte-gl", { x: 420 }, { x: 0, duration: 0.4, ease: "back.out(1.3)" }, 0.35);
      tl.fromTo(["#karte-lca", "#karte-lgl"], { scale: 0 }, { scale: 1, duration: 0.28, ease: "back.out(2.4)", stagger: 0.12 }, 0.75);
      tl.fromTo("#karte-rock", { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.3, ease: "back.out(3)" }, 1.05);
      tl.fromTo("#karte-ring", { scale: 0.4, opacity: 1, transformOrigin: "50% 50%" }, { scale: 1.8, opacity: 0, duration: 0.7, ease: "power1.out", repeat: 2 }, 1.2);
      tl.to("#karte-pan", { rotation: -1.2, duration: 0.6, yoyo: true, repeat: 1, ease: "sine.inOut" }, 1.6);
      // ${L1}: 1973 border line drawn from both ends, stops at the rock
      tl.fromTo([${dashB.map((_, i) => `"#karte-db${i}"`).join(", ")}], { scale: 0 }, { scale: 1, duration: 0.14, ease: "back.out(3)", stagger: 0.13 }, ${L1 + 0.15});
      tl.fromTo([${dashT.map((_, i) => `"#karte-dt${i}"`).join(", ")}], { scale: 0 }, { scale: 1, duration: 0.14, ease: "back.out(3)", stagger: 0.11 }, ${L1 + 0.15});
      tl.fromTo("#karte-ring", { scale: 0.4, opacity: 1 }, { scale: 1.8, opacity: 0, duration: 0.6, ease: "power1.out", immediateRender: false }, ${L1 + 1.05});
      tl.to("#karte-pan", { keyframes: { y: [0, -14, 0] }, duration: 0.3, ease: "power1.out" }, ${L1 + 0.95});
      // ${L2}: zoom onto the rock, it stays OPEN
      tl.to("#karte-zoom", { scale: 1.8, svgOrigin: "460 375", duration: 0.45, ease: "power3.inOut" }, ${L2});
      tl.to(["#karte-lca", "#karte-lgl"], { opacity: 0, duration: 0.2 }, ${L2});
      tl.fromTo("#karte-q", { scale: 0, rotation: -30 }, { scale: 1, rotation: 0, duration: 0.32, ease: "back.out(2.6)" }, ${L2 + 0.35});
      tl.to("#karte-q", { keyframes: { rotation: [0, -12, 12, -8, 0] }, duration: 0.9, ease: "sine.inOut", repeat: 1 }, ${L2 + 0.7});
      tl.to("#karte-redl", { keyframes: { opacity: [0, 1, 0.2, 1, 0.2, 1] }, duration: 1.0, ease: "none" }, ${L2 + 0.5});
      tl.to("#karte-zoom", { keyframes: { rotation: [0, 2, -2, 0] }, svgOrigin: "460 375", duration: 1.2, ease: "sine.inOut" }, ${L2 + 0.9});`,
    ""));
}

// ================= INSEL: soldiers land, flags swap, bottles pile up (18.4 - 30.0) =================
{
  const p = "insel";
  const [s, d] = S(p);
  const sc = 0.816, rx = 230, ry = 1060;
  const P = (x) => [Math.round(rx + x * sc), Math.round(ry + surf(x) * sc)];
  const [px, py] = P(360);
  // local beats
  const A = 0, FL = 2.5, CAOUT = 3.6, DK = 4.55, SW = 6.6, DKOUT = 7.7, TL = 8.65;
  const [wx, wy] = P(230), [sx, sy] = P(500);
  const stackPos = [90, 640, 140, 600, 175, 680].map(P);
  const [f1x, f1y] = P(270), [f2x, f2y] = P(430);
  const person = (id, x, y, parka, hood) => `<div id="${id}" class="insel-pp" style="left:${x - 25}px;top:${y - 88}px;">${PERSON(parka, hood)}</div>`;
  const bottle = (id, x, y, w, h, kind) => `<div id="${id}" class="insel-bt" style="left:${x - w / 2}px;top:${y - h + 8}px;width:${w}px;height:${h}px;">${kind ? WHISKY : SCHNAPS}</div>`;
  // jump arcs from the boat deck to a spot on the rock (relative to the person's final place)
  const hop = (id, fromX, fromY, at) => `      tl.set("${id}", { opacity: 1 }, ${at});
      tl.fromTo("${id}", { x: ${fromX}, y: ${fromY} }, { keyframes: { x: [${fromX}, ${fromX / 2}, 0], y: [${fromY}, ${Math.min(fromY, 0) - 140}, 0] }, duration: 0.42, ease: "none", immediateRender: false }, ${at});`;
  const back = (id, toX, toY, at) => `      tl.to("${id}", { keyframes: { x: [0, ${toX / 2}, ${toX}], y: [0, ${Math.min(toY, 0) - 140}, ${toY}] }, duration: 0.38, ease: "none" }, ${at});
      tl.set("${id}", { opacity: 0 }, ${+(at + 0.38).toFixed(2)});`;
  const swapTo = (on, off, at) => `      tl.to("${off}", { y: 230, scaleY: 0.3, opacity: 0, duration: 0.22, ease: "power2.in" }, ${at});
      tl.fromTo("${on}", { y: 230, scaleY: 0.3, opacity: 0 }, { y: 0, scaleY: 1, opacity: 1, duration: 0.26, ease: "back.out(1.8)", immediateRender: false }, ${+(at + 0.18).toFixed(2)});`;
  let tlJs = "";
  [[TL + 0.35, "#insel-fdk", "#insel-fca"], [TL + 0.95, "#insel-fca", "#insel-fdk"], [TL + 1.55, "#insel-fdk", "#insel-fca"], [TL + 2.15, "#insel-fca", "#insel-fdk"]].forEach(([at, on, off]) => { tlJs += swapTo(on, off, +at.toFixed(2)) + "\n"; });
  [[TL + 0.1, "#insel-bca", -1], [TL + 0.7, "#insel-bdk", 1], [TL + 1.3, "#insel-bca", -1], [TL + 1.9, "#insel-bdk", 1]].forEach(([at, id, side]) => {
    tlJs += `      tl.fromTo("${id}", { x: ${side * -460} }, { x: 0, duration: 0.2, ease: "power2.out", immediateRender: false }, ${+at.toFixed(2)});
      tl.to("${id}", { x: ${side * -460}, duration: 0.2, ease: "power2.in" }, ${+(at + 0.45).toFixed(2)});\n`;
  });
  stackPos.forEach((_, i) => { tlJs += `      tl.fromTo("#insel-st${i}", { scale: 0, rotation: ${i % 2 ? 30 : -30} }, { scale: 1, rotation: ${i % 2 ? 6 : -6}, duration: 0.22, ease: "back.out(2.6)" }, ${+(TL + 0.4 + i * 0.4).toFixed(2)});\n`; });
  scenes.push(scene(p, "Soldaten, Fahnen, Flaschen", s, d,
    `#insel-rock{${abs(rx, ry, 760 * sc, 420 * sc)}transform-origin:50% 100%;}
     #insel-pole{${abs(px - 8, 770, 16, py - 770 + 12)}${POLE_CSS}transform-origin:50% 100%;}
     .insel-flag{${abs(px + 4, 776, 240, 144)}transform-origin:0% 100%;}
     .insel-boat{position:absolute;top:1262px;width:300px;height:150px;}
     #insel-bca{left:-10px;} #insel-bdk{left:790px;}
     .insel-pp{position:absolute;width:50px;height:90px;}
     .insel-bt{position:absolute;transform-origin:50% 100%;}
     #insel-ff{${abs(110, 640, 190, 110)}}`,
    `      <div id="insel-pole"></div>
      <div id="insel-fca" class="insel-flag">${FLAG_CA}</div>
      <div id="insel-fdk" class="insel-flag">${FLAG_DK}</div>
      <div id="insel-rock" class="insel-stk">${ROCK_SVG}</div>
      ${bottle("insel-bw", wx, wy, 64, 160, 1)}
      ${bottle("insel-bs", sx, sy, 56, 168, 0)}
${stackPos.map(([x, y], i) => "      " + bottle("insel-st" + i, x, y, 46, 116, i % 2 === 0)).join("\n")}
      ${person("insel-c1", f1x, f1y, FRED, "#B0182A")}${person("insel-c2", f2x, f2y, FRED, "#B0182A")}
      ${person("insel-d1", f1x, f1y, "#2B5BD7", "#F4F6FA")}${person("insel-d2", f2x, f2y, "#2B5BD7", "#F4F6FA")}
      <div id="insel-bca" class="insel-boat">${BOAT(FRED, "#F4F6FA", MINI_CA)}</div>
      <div id="insel-bdk" class="insel-boat">${BOAT("#F4F6FA", FRED, MINI_DK, true)}</div>
      ${FRONTWAVE("insel-fw")}
      <div id="insel-ff"><svg viewBox="0 0 190 110" width="190" height="110" overflow="visible"><path d="M8 8 L92 55 L8 102 Z M96 8 L180 55 L96 102 Z" fill="${YEL}" stroke="${K}" stroke-width="9" stroke-linejoin="round"/></svg></div>`,
    `${waveMove("insel-fw", d)}
      tl.set(["#insel-fca", "#insel-fdk", "#insel-pole", "#insel-bw", "#insel-bs", "#insel-ff", ${stackPos.map((_, i) => `"#insel-st${i}"`).join(", ")}], { opacity: 0 }, 0);
      tl.set(["#insel-c1", "#insel-c2", "#insel-d1", "#insel-d2"], { opacity: 0 }, 0);
      tl.fromTo("#insel-rock", { y: 420 }, { y: 0, duration: 0.36, ease: "back.out(1.3)" }, ${A});
      tl.fromTo("#insel-bdk", { x: 460 }, { x: 460, duration: 0.01 }, 0);
      // 1984: Canadian boat comes, two people hop onto the rock
      tl.fromTo("#insel-bca", { x: -460 }, { x: 0, duration: 0.6, ease: "power2.out" }, 0.1);
      tl.to("#insel-bca", { keyframes: { rotation: [0, -3, 2, 0] }, duration: 0.8, ease: "sine.inOut" }, 0.7);
${hop("#insel-c1", 150 - f1x, 1290 - f1y, 0.75)}
${hop("#insel-c2", 170 - f2x, 1290 - f2y, 1.0)}
      tl.to(["#insel-c1", "#insel-c2"], { y: -14, duration: 0.18, yoyo: true, repeat: 5, ease: "sine.inOut", stagger: 0.09 }, 1.5);
      // ${FL}: flag in, whisky next to it
      tl.set(["#insel-pole", "#insel-fca"], { opacity: 1 }, ${FL});
      tl.fromTo("#insel-pole", { scaleY: 0 }, { scaleY: 1, duration: 0.25, ease: "back.out(1.6)" }, ${FL});
      tl.fromTo("#insel-fca", { y: 230, scaleY: 0.3 }, { y: 0, scaleY: 1, duration: 0.3, ease: "back.out(1.8)" }, ${FL + 0.15});
${wave("#insel-fca", FL + 0.5, 3)}
      tl.set("#insel-bw", { opacity: 1 }, ${FL + 0.55});
      tl.fromTo("#insel-bw", { scale: 0, rotation: -40 }, { scale: 1, rotation: -6, duration: 0.3, ease: "back.out(2.4)" }, ${FL + 0.55});
${back("#insel-c1", 150 - f1x, 1290 - f1y, CAOUT - 0.4)}
${back("#insel-c2", 170 - f2x, 1290 - f2y, CAOUT - 0.25)}
      tl.to("#insel-bca", { x: -460, duration: 0.45, ease: "power2.in" }, ${CAOUT});
      // ${DK}: Danish boat from the right
      tl.fromTo("#insel-bdk", { x: 460 }, { x: 0, duration: 0.6, ease: "power2.out", immediateRender: false }, ${DK});
      tl.to("#insel-bdk", { keyframes: { rotation: [0, 3, -2, 0] }, duration: 0.8, ease: "sine.inOut" }, ${DK + 0.6});
${hop("#insel-d1", 930 - f1x, 1290 - f1y, DK + 0.55)}
${hop("#insel-d2", 910 - f2x, 1290 - f2y, DK + 0.75)}
      tl.to(["#insel-d1", "#insel-d2"], { rotation: 8, duration: 0.2, yoyo: true, repeat: 5, ease: "sine.inOut", stagger: 0.1 }, ${DK + 1.25});
      // ${SW}: flag swapped, schnaps added
${swapTo("#insel-fdk", "#insel-fca", SW)}
${wave("#insel-fdk", SW + 0.5, 2, 6)}
      tl.set("#insel-bs", { opacity: 1 }, ${SW + 0.5});
      tl.fromTo("#insel-bs", { scale: 0, rotation: 40 }, { scale: 1, rotation: 6, duration: 0.3, ease: "back.out(2.4)" }, ${SW + 0.5});
${shake("#insel-kb", SW + 0.55, 10, 0.28)}
${back("#insel-d1", 930 - f1x, 1290 - f1y, DKOUT - 0.4)}
${back("#insel-d2", 910 - f2x, 1290 - f2y, DKOUT - 0.25)}
      tl.to("#insel-bdk", { x: 460, duration: 0.45, ease: "power2.in" }, ${DKOUT});
      // ${TL}: back and forth in fast motion, bottles pile up
      tl.set("#insel-ff", { opacity: 1 }, ${TL});
      tl.fromTo("#insel-ff", { scale: 0 }, { scale: 1, duration: 0.25, ease: "back.out(2.6)" }, ${TL});
      tl.to("#insel-ff", { keyframes: { x: [0, 14, 0] }, duration: 0.3, ease: "none", repeat: 8 }, ${TL + 0.25});
      tl.set([${stackPos.map((_, i) => `"#insel-st${i}"`).join(", ")}], { opacity: 1 }, ${TL + 0.4});
${tlJs}      tl.to("#insel-rock", { keyframes: { rotation: [0, -1.5, 1.5, -1, 0] }, duration: 2.4, ease: "none" }, ${TL + 0.3});`,
    "", { reveal0: true }));
}

// ================= FRIEDEN 2022: two mittens shake hands, snowflake confetti (30.0 - 31.8) =================
{
  const p = "frieden";
  const [s, d] = S(p);
  const flakes = Array.from({ length: 14 }, (_, i) => {
    const a = (-10 + i * (200 / 13)) * Math.PI / 180; // 0..190 deg: right, down, left
    const rr = r(260, 430);
    return { x: Math.round(Math.cos(a) * rr), y: Math.round(Math.abs(Math.sin(a)) * rr * 0.9 - 60), s: r(54, 90), rot: r(-200, 200), t: +(0.42 + (i % 4) * 0.04).toFixed(2) };
  });
  const arm = (fill, cuff, cross) => `<svg viewBox="0 0 560 300" width="100%" height="100%" overflow="visible">
    <path d="M-40 110 L300 110 L300 250 L-40 250 Z" fill="${fill}" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>
    ${cross ? `<path d="M120 110 V250" stroke="#fff" stroke-width="22"/>` : `<path d="M60 128 L60 232 M100 128 L100 232" stroke="${FRED_D}" stroke-width="8" opacity=".5"/>`}
    <rect x="270" y="96" width="70" height="168" rx="22" fill="${cuff}" stroke="${K}" stroke-width="10"/>
    <path d="M330 104 Q470 70 520 150 Q540 210 470 254 L340 256 Z" fill="${fill === "#fff" ? "#F4F6FA" : FRED}" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>
    <path d="M420 104 Q440 50 486 70 Q506 90 470 122" fill="${fill === "#fff" ? "#F4F6FA" : FRED}" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>
  </svg>`;
  scenes.push(scene(p, "Frieden 2022", s, d,
    `#frieden-L{${abs(-40, 860, 560, 300)}} #frieden-R{${abs(560, 900, 560, 300)}}
     #frieden-shake{position:absolute;inset:0;}
     .frieden-fk{position:absolute;left:510px;top:1000px;}
     #frieden-glow{${abs(140, 760, 800, 560)}border-radius:50%;background:radial-gradient(circle,rgba(255,210,63,.4),rgba(255,210,63,0) 64%);}`,
    `      <div id="frieden-glow"></div>
${flakes.map((f, i) => `      <div id="frieden-f${i}" class="frieden-fk" style="width:${f.s}px;height:${f.s}px;">${FLAKE(i % 3 ? "#fff" : ICE_M)}</div>`).join("\n")}
      <div id="frieden-shake">
        <div id="frieden-L" class="frieden-stk">${arm(FRED, "#fff", false)}</div>
        <div id="frieden-R" class="frieden-stk"><svg viewBox="0 0 560 300" width="100%" height="100%" overflow="visible"><g transform="translate(560 0) scale(-1 1)">${arm("#fff", FRED, true).replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "")}</g></svg></div>
      </div>`,
    `      tl.fromTo("#frieden-L", { x: -620 }, { x: 0, duration: 0.32, ease: "back.out(1.4)" }, 0);
      tl.fromTo("#frieden-R", { x: 620 }, { x: -40, duration: 0.32, ease: "back.out(1.4)" }, 0.04);
      tl.fromTo("#frieden-glow", { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }, 0.3);
      tl.to("#frieden-shake", { keyframes: { y: [0, -36, 0, -36, 0, -24, 0] }, duration: 0.95, ease: "none" }, 0.4);
${shake("#frieden-kb", 0.36, 12, 0.26)}
      const F = ${JSON.stringify(flakes)};
      F.forEach((f, i) => {
        tl.fromTo("#frieden-f" + i, { x: 0, y: 0, scale: 0, rotation: 0 }, { x: f.x, y: f.y, scale: 1, rotation: f.rot, duration: 0.5, ease: "power3.out" }, f.t);
        tl.to("#frieden-f" + i, { y: f.y + 120, rotation: f.rot + 60, duration: 0.85, ease: "sine.in" }, f.t + 0.5);
      });`,
    ""));
}

// ================= GETEILT: the rock gets a line along its ridge, both flags stand (31.8 - 33.85) =================
{
  const p = "geteilt";
  const [s, d] = S(p);
  const sc = 1.184, rx = 90, ry = 900;
  const P = (x) => [Math.round(rx + x * sc), Math.round(ry + surf(x) * sc)];
  const [lx, ly] = P(230), [qx, qy] = P(560);
  const RIDGE = "M360 60 L372 150 L358 240 L386 330 L396 420";
  scenes.push(scene(p, "Insel geteilt", s, d,
    `#geteilt-rock{${abs(rx, ry, 760 * sc, 420 * sc)}}
     .geteilt-pole{position:absolute;width:16px;${POLE_CSS}transform-origin:50% 100%;}
     .geteilt-flag{position:absolute;top:4px;width:220px;height:132px;}`,
    `      <div id="geteilt-pl" class="geteilt-pole" style="left:${lx - 8}px;top:${ly - 300}px;height:310px;"><div id="geteilt-fl" class="geteilt-flag" style="left:-216px;transform-origin:100% 50%;">${FLAG_CA}</div></div>
      <div id="geteilt-pr" class="geteilt-pole" style="left:${qx - 8}px;top:${qy - 300}px;height:310px;"><div id="geteilt-fr" class="geteilt-flag" style="left:12px;transform-origin:0% 50%;">${FLAG_DK}</div></div>
      <div id="geteilt-rock" class="geteilt-stk"><svg viewBox="0 0 760 420" width="100%" height="100%" overflow="visible">
        <defs>
          <clipPath id="geteilt-cl"><path d="M-20 -20 L360 -20 L360 60 L372 150 L358 240 L386 330 L396 420 L396 460 L-20 460 Z"/></clipPath>
          <clipPath id="geteilt-cr"><path d="M780 -20 L360 -20 L360 60 L372 150 L358 240 L386 330 L396 420 L396 460 L780 460 Z"/></clipPath>
          <clipPath id="geteilt-reveal"><rect id="geteilt-rv" x="300" y="40" width="160" height="0"/></clipPath>
        </defs>
        <g id="geteilt-hl"><g clip-path="url(#geteilt-cl)">${ROCK_INNER}</g></g>
        <g id="geteilt-hr"><g clip-path="url(#geteilt-cr)">${ROCK_INNER}</g></g>
        <g clip-path="url(#geteilt-reveal)"><path d="${RIDGE}" fill="none" stroke="${K}" stroke-width="20" stroke-linejoin="round"/><path d="${RIDGE}" fill="none" stroke="${YEL}" stroke-width="10" stroke-dasharray="26 16" stroke-linejoin="round"/></g>
      </svg></div>
      ${FRONTWAVE("geteilt-fw")}`,
    `${waveMove("geteilt-fw", d)}
      tl.fromTo("#geteilt-rock", { y: 520 }, { y: 0, duration: 0.36, ease: "back.out(1.3)" }, 0);
      tl.fromTo("#geteilt-rv", { attr: { height: 0 } }, { attr: { height: 400 }, duration: 0.5, ease: "power1.inOut" }, 0.35);
      tl.to("#geteilt-hl", { keyframes: { x: [0, -22, -22, 0] }, duration: 0.8, ease: "power2.inOut" }, 0.85);
      tl.to("#geteilt-hr", { keyframes: { x: [0, 22, 22, 0] }, duration: 0.8, ease: "power2.inOut" }, 0.85);
      tl.fromTo(["#geteilt-pl", "#geteilt-pr"], { scaleY: 0 }, { scaleY: 1, duration: 0.28, ease: "back.out(1.8)", stagger: 0.1 }, 0.5);
      tl.fromTo(["#geteilt-fl", "#geteilt-fr"], { scaleX: 0 }, { scaleX: 1, duration: 0.25, ease: "back.out(2)", stagger: 0.1 }, 0.72);
      tl.to("#geteilt-pl", { keyframes: { x: [0, -22, -22, 0] }, duration: 0.8, ease: "power2.inOut" }, 0.85);
      tl.to("#geteilt-pr", { keyframes: { x: [0, 22, 22, 0] }, duration: 0.8, ease: "power2.inOut" }, 0.85);
${wave("#geteilt-fl", 1.0, 1, -5)}
${wave("#geteilt-fr", 1.05, 1, 5)}`,
    ""));
}

// ================= DRINK: two glasses clink (33.85 - 36.05) =================
{
  const p = "drink";
  const [s, d] = S(p);
  const TUMBLER = `<svg viewBox="0 0 300 300" width="100%" height="100%" overflow="visible">
    <path d="M30 30 L270 30 L250 280 Q248 292 236 292 L64 292 Q52 292 50 280 Z" fill="#E9F7FF" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>
    <path d="M44 150 L256 150 L246 278 L54 278 Z" fill="#E09A3E"/>
    <rect x="80" y="120" width="64" height="64" rx="12" fill="#F4FCFF" stroke="${ICE_D}" stroke-width="6" transform="rotate(-12 112 152)"/>
    <rect x="150" y="128" width="60" height="60" rx="12" fill="#F4FCFF" stroke="${ICE_D}" stroke-width="6" transform="rotate(14 180 158)"/>
    <path d="M72 60 L62 250" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".8"/>
    <path d="M30 30 L270 30 L250 280 Q248 292 236 292 L64 292 Q52 292 50 280 Z" fill="none" stroke="${K}" stroke-width="10" stroke-linejoin="round"/></svg>`;
  const SHOT = `<svg viewBox="0 0 220 380" width="100%" height="100%" overflow="visible">
    <path d="M20 20 L200 20 L160 200 Q150 230 110 230 Q70 230 60 200 Z" fill="#E9F7FF" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>
    <path d="M44 110 L176 110 L158 196 Q148 216 110 216 Q72 216 62 196 Z" fill="#BDEFF2"/>
    <rect x="98" y="228" width="24" height="110" fill="#E9F7FF" stroke="${K}" stroke-width="9"/>
    <ellipse cx="110" cy="350" rx="80" ry="20" fill="#E9F7FF" stroke="${K}" stroke-width="9"/>
    <path d="M56 46 L76 180" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".85"/></svg>`;
  scenes.push(scene(p, "Ein Drink", s, d,
    `#drink-T{${abs(150, 900, 320, 320)}transform-origin:50% 100%;} #drink-S{${abs(600, 850, 230, 400)}transform-origin:50% 100%;}
     #drink-star{${abs(450, 720, 180, 180)}}
     .drink-ln{position:absolute;width:90px;height:16px;border-radius:8px;background:${YEL};border:5px solid ${K};transform-origin:0% 50%;}
     #drink-glow{${abs(90, 740, 900, 640)}border-radius:50%;background:radial-gradient(circle,rgba(255,210,63,.35),rgba(255,210,63,0) 64%);}`,
    `      <div id="drink-glow"></div>
      <div id="drink-T" class="drink-stk">${TUMBLER}</div>
      <div id="drink-S" class="drink-stk">${SHOT}</div>
      <div id="drink-star"><svg viewBox="0 0 100 100" width="100%" height="100%" overflow="visible"><path d="M50 2 L60 40 L98 50 L60 60 L50 98 L40 60 L2 50 L40 40 Z" fill="${YEL}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/></svg></div>
      <div id="drink-l0" class="drink-ln" style="left:600px;top:820px;"></div><div id="drink-l1" class="drink-ln" style="left:390px;top:820px;"></div>`,
    `      tl.fromTo("#drink-glow", { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }, 0.05);
      tl.fromTo("#drink-T", { x: -620, rotation: -20 }, { x: 0, rotation: 0, duration: 0.34, ease: "back.out(1.4)" }, 0);
      tl.fromTo("#drink-S", { x: 620, rotation: 20 }, { x: 0, rotation: 0, duration: 0.34, ease: "back.out(1.4)" }, 0.06);
      // clink
      tl.to("#drink-T", { keyframes: { x: [0, 70, 40], rotation: [0, 14, 6] }, duration: 0.3, ease: "power2.out" }, 0.5);
      tl.to("#drink-S", { keyframes: { x: [0, -70, -40], rotation: [0, -14, -6] }, duration: 0.3, ease: "power2.out" }, 0.5);
      tl.fromTo("#drink-star", { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.25, ease: "back.out(3)" }, 0.62);
      tl.to("#drink-star", { rotation: 90, scale: 0.85, duration: 0.6, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0.9);
      tl.fromTo("#drink-l0", { scaleX: 0, rotation: -30 }, { scaleX: 1, duration: 0.2, ease: "back.out(2)" }, 0.65);
      tl.fromTo("#drink-l1", { scaleX: 0, rotation: -150 }, { scaleX: 1, duration: 0.2, ease: "back.out(2)" }, 0.68);
      tl.to(["#drink-l0", "#drink-l1"], { opacity: 0, duration: 0.2 }, 1.2);
${shake("#drink-kb", 0.62, 12, 0.3)}
      tl.to(["#drink-T", "#drink-S"], { y: -16, duration: 0.3, yoyo: true, repeat: 3, ease: "sine.inOut", stagger: 0.12 }, 1.0);`,
    ""));
}

// ================= FRAGE + loop: the frame-0 picture is already standing, two comment bubbles fade before the cut (36.05 - end) =================
{
  const p = "frage";
  const [s, d] = S(p);
  const LOOP = +(T.frage[1] - C.c18[0]).toFixed(2); // last 0.6 s
  const bub = (id, x, icon) => `<div id="${id}" class="frage-bub" style="left:${x}px;"><svg viewBox="0 0 300 220" width="100%" height="100%" overflow="visible">
    <path d="M30 10 L270 10 Q292 10 292 32 L292 148 Q292 170 270 170 L130 170 L84 214 L92 170 L30 170 Q8 170 8 148 L8 32 Q8 10 30 10 Z" fill="#fff" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>
    ${icon}</svg></div>`;
  const glassIcon = `<g transform="translate(40 30) scale(0.4)"><path d="M30 30 L270 30 L250 280 L50 280 Z" fill="#E9F7FF" stroke="${K}" stroke-width="16" stroke-linejoin="round"/><path d="M44 150 L256 150 L246 272 L54 272 Z" fill="#E09A3E"/></g><g fill="${K}"><circle cx="190" cy="92" r="11"/><circle cx="222" cy="92" r="11"/><circle cx="254" cy="92" r="11"/></g>`;
  const mugIcon = `<g transform="translate(36 34)"><rect x="0" y="20" width="96" height="96" rx="16" fill="#7FC4EA" stroke="${K}" stroke-width="8"/><path d="M96 44 Q130 44 130 70 Q130 96 96 96" fill="none" stroke="${K}" stroke-width="10"/><ellipse cx="48" cy="24" rx="44" ry="12" fill="#6B3A1E" stroke="${K}" stroke-width="6"/><rect x="18" y="6" width="22" height="20" rx="6" fill="#fff" stroke="${K}" stroke-width="5"/><rect x="50" y="2" width="22" height="20" rx="6" fill="#FFC7D6" stroke="${K}" stroke-width="5"/></g><path d="M200 70 q20 -26 40 0 q-20 26 -40 0 Z M218 100 h4" fill="none" stroke="${FRED}" stroke-width="0"/><path d="M220 112 C190 90 180 62 204 56 C214 54 220 62 220 68 C220 62 226 54 236 56 C260 62 250 90 220 112 Z" fill="${FRED}" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>`;
  const n = Math.floor((d - 0.02) / 0.9);
  scenes.push(scene(p, "Frage und Loop", s, d, hookCss(p) + `
     .frage-bub{position:absolute;top:1150px;width:300px;height:220px;transform-origin:30% 100%;}`,
    hookBody(p) + `
      ${bub("frage-b1", 120, glassIcon)}
      ${bub("frage-b2", 560, mugIcon)}`,
    `      // the hook picture rises out of the sea right away and ends exactly in its frame-0 state
${waveMove("frage-fw", d, true)}
      tl.fromTo("#frage-rock", { y: 520 }, { y: 0, duration: 0.36, ease: "back.out(1.3)" }, 0);
      tl.fromTo(["#frage-pl", "#frage-pr"], { scaleY: 0 }, { scaleY: 1, duration: 0.3, ease: "back.out(1.6)", stagger: 0.08 }, 0.2);
      tl.fromTo("#frage-glow", { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.1);
      tl.to("#frage-kb", { keyframes: { scale: [1, 1.03, 1] }, duration: ${+(d - 0.05).toFixed(2)}, ease: "sine.inOut" }, 0);
${wave("#frage-fl", +(d - n * 0.9).toFixed(2), n)}
${wave("#frage-fr", +(d - n * 0.9).toFixed(2), n, 6)}
      tl.fromTo("#frage-b1", { scale: 0, rotation: -12 }, { scale: 1, rotation: -3, duration: 0.3, ease: "back.out(2.4)" }, 0.55);
      tl.fromTo("#frage-b2", { scale: 0, rotation: 12 }, { scale: 1, rotation: 3, duration: 0.3, ease: "back.out(2.4)" }, 0.8);
      tl.to(["#frage-b1", "#frage-b2"], { y: -14, duration: 0.35, yoyo: true, repeat: 3, ease: "sine.inOut", stagger: 0.15 }, 1.1);
      // loop: the bubbles are gone before the hook caption builds up again
      tl.to(["#frage-b1", "#frage-b2"], { opacity: 0, scale: 0.6, duration: 0.2, ease: "power2.in", stagger: 0.04 }, ${+(d - LOOP - 0.08).toFixed(2)});`,
    "", { exit: false, kb: false }));
}

// ================= background: arctic night sky, aurora, snow, sea with waves (all loop-seamless) =================
{
  const RS = mulberry32(44);
  const flakes = (n, minR, maxR, op) => Array.from({ length: n }, () => ({ x: Math.round(RS() * 1080), y: Math.round(RS() * 1920), r: +(minR + RS() * (maxR - minR)).toFixed(1), o: +(op * (0.6 + RS() * 0.4)).toFixed(2) }));
  const far = flakes(46, 2.5, 4.5, 0.55), near = flakes(22, 5, 8, 0.75);
  const tile = (fl, k) => fl.map((f) => `<circle cx="${f.x}" cy="${f.y + k * 1920}" r="${f.r}" fill="#fff" opacity="${f.o}"/>`).join("");
  const bgWave = (y, amp, col, w) => `<path d="${WAVE_PATH(y, amp, w)}" fill="none" stroke="${col}" stroke-width="7" stroke-linecap="round"/>`;
  const stars = Array.from({ length: 26 }, () => `<circle cx="${Math.round(RS() * 1080)}" cy="${Math.round(60 + RS() * 900)}" r="${(1.5 + RS() * 2.5).toFixed(1)}" fill="#fff" opacity="${(0.3 + RS() * 0.5).toFixed(2)}"/>`).join("");
  fs.writeFileSync(path.join(OUT, "compositions", "bg.html"), `<template>
  <style>
    #root { position: absolute; inset: 0; overflow: hidden; background: #0E1530; }
    #bg-sky { position: absolute; inset: 0; background: linear-gradient(180deg, #0B1430 0%, #0E1D45 45%, #1C3F78 70%, #2E6AA8 72.5%); }
    #bg-aur1 { position: absolute; left: -200px; top: 120px; width: 1100px; height: 520px; border-radius: 50%; background: radial-gradient(ellipse at center, rgba(63,224,170,.22) 0%, rgba(63,224,170,.08) 45%, rgba(63,224,170,0) 70%); }
    #bg-aur2 { position: absolute; left: 300px; top: 300px; width: 1000px; height: 460px; border-radius: 50%; background: radial-gradient(ellipse at center, rgba(120,170,255,.2) 0%, rgba(120,170,255,.07) 45%, rgba(120,170,255,0) 70%); }
    #bg-stars { position: absolute; left: 0; top: 0; }
    #bg-berg { position: absolute; left: 0; top: 1290px; }
    #bg-sea { position: absolute; left: 0; top: 1392px; width: 1080px; height: 528px; background: linear-gradient(180deg, #1F5A9E 0%, #154585 40%, #0E2E66 100%); }
    .bg-wv { position: absolute; left: -360px; width: 1800px; height: 60px; }
    .bg-snow { position: absolute; left: 0; top: 0; }
  </style>
  <div id="root" data-composition-id="bg" data-width="1080" data-height="1920" data-layout-allow-overflow>
    <div id="bg-sky"></div>
    <svg id="bg-stars" width="1080" height="1100">${stars}</svg>
    <div id="bg-aur1"></div><div id="bg-aur2"></div>
    <svg id="bg-berg" width="1080" height="110" viewBox="0 0 1080 110"><path d="M-10 106 L40 40 L80 60 L130 10 L190 70 L220 106 Z M820 106 L870 50 L900 64 L950 20 L1010 66 L1090 106 Z" fill="#9FC7E8" stroke="#3E6E9E" stroke-width="5" stroke-linejoin="round"/><path d="M130 10 L150 60 L120 106 M950 20 L940 70 L960 106" stroke="#6E9CC6" stroke-width="5" fill="none"/></svg>
    <div id="bg-sea"></div>
    <svg id="bg-w1" class="bg-wv" style="top:1440px" viewBox="0 0 1800 60">${bgWave(30, 12, "rgba(191,230,255,.35)", 1800)}</svg>
    <svg id="bg-w2" class="bg-wv" style="top:1560px" viewBox="0 0 1800 60">${bgWave(30, 14, "rgba(191,230,255,.25)", 1800)}</svg>
    <svg id="bg-w3" class="bg-wv" style="top:1700px" viewBox="0 0 1800 60">${bgWave(30, 16, "rgba(191,230,255,.2)", 1800)}</svg>
    <svg id="bg-snow1" class="bg-snow" width="1080" height="3840">${tile(far, 0)}${tile(far, 1)}</svg>
    <svg id="bg-snow2" class="bg-snow" width="1080" height="5760">${tile(near, 0)}${tile(near, 1)}${tile(near, 2)}</svg>
  </div>
  <script>
    (function () {
      const tl = gsap.timeline({ paused: true });
      // every move covers whole periods, so the last frame leads straight back into frame 0
      tl.fromTo("#bg-snow1", { y: -1920 }, { y: 0, duration: ${DUR}, ease: "none" }, 0);
      tl.fromTo("#bg-snow2", { y: -3840 }, { y: 0, duration: ${DUR}, ease: "none" }, 0);
      tl.fromTo("#bg-w1", { x: 0 }, { x: -180 * 8, duration: ${DUR}, ease: "none" }, 0);
      tl.fromTo("#bg-w2", { x: -180 * 8 }, { x: 0, duration: ${DUR}, ease: "none" }, 0);
      tl.fromTo("#bg-w3", { x: 0 }, { x: -180 * 6, duration: ${DUR}, ease: "none" }, 0);
      tl.to("#bg-aur1", { x: 120, scaleY: 1.2, duration: ${(DUR / 4).toFixed(4)}, ease: "sine.inOut", yoyo: true, repeat: 3 }, 0);
      tl.to("#bg-aur2", { x: -140, scaleX: 1.15, duration: ${(DUR / 6).toFixed(4)}, ease: "sine.inOut", yoyo: true, repeat: 5 }, 0);
      window.__timelines["bg"] = tl;
    })();
  </script>
</template>
`);
}

// ================= captions =================
// "*" keyword (yellow Lilita, caption kwsize). "~" yellow Lilita as written. "!" punchline size (largest). "/" line break.
const HOOKW = ["Zwei", "Länder", "/", "kämpfen", "um", "/", "einen", "*FELSEN."];
const caps = [
  { id: "c01", words: HOOKW, kwsize: 140, still: true },
  { id: "c02", words: ["Und", "zwar", "/", "fast", "*50", "*JAHRE."] },
  { id: "c03", words: ["Die", "*WAFFEN?"] },
  { id: "c04", words: ["*WHISKY", "/", "und", "*SCHNAPS."], shake: true },
  { id: "c05", words: ["*HANS-INSEL", "/", "heißt", "der", "Felsen."] },
  { id: "c06", words: ["Kahl,", "winzig,", "/", "zwischen", "Kanada", "/", "und", "Grönland."] },
  { id: "c07", words: ["*1973:", "Grenze", "/", "im", "Meer", "gezogen."] },
  { id: "c08", words: ["Nur", "der", "Felsen", "/", "bleibt", "*OFFEN."], shake: true },
  { id: "c09", words: ["*1984:", "/", "Kanadas", "Soldaten", "/", "landen", "dort."] },
  { id: "c10", words: ["Fahne", "rein.", "/", "*WHISKY", "dazu."] },
  { id: "c11", words: ["*DÄNEMARK", "/", "rückt", "an."] },
  { id: "c12", words: ["Fahne", "getauscht.", "/", "*SCHNAPS", "dazu."] },
  { id: "c13", words: ["Und", "so", "geht's", "/", "hin", "und", "her."] },
  { id: "c14", words: ["*FRIEDEN!", "/", "Endlich,", "*2022."] },
  { id: "c15", words: ["Die", "Insel", "/", "wird", "*GETEILT."], shake: true },
  { id: "c16", words: ["Besiegelt", "mit …", "/", "einem", "!DRINK."], shake: true },
  { id: "c17", words: ["Welcher", "Streit", "/", "verdient", "/", "ein", "Getränk?"] },
  { id: "c18", words: HOOKW, kwsize: 140, loop: true },
].map((c) => ({ ...c, s: C[c.id][0], e: C[c.id][1] }));
const ST = 0.065, PD = 0.22, KD = 0.24, EXIT = 0.12;
let capHtml = "", capJs = "";
const report = [];
for (const c of caps) {
  const d = +(c.e - c.s).toFixed(2);
  const track = caps.indexOf(c) % 2;
  const kind = (w) => (w === "/" ? "br" : "*~!".includes(w[0]) ? w[0] : "");
  const spans = c.words.map((w, i) => {
    const k = kind(w);
    if (k === "br") return `<br/>`;
    const txt = k ? w.slice(1) : w;
    const cls = { "*": "w kw", "~": "w q", "!": "w pt", "": "w" }[k];
    const st = k === "*" && c.kwsize ? ` style="font-size:${c.kwsize}px"` : "";
    return `<span id="${c.id}-o${i}" class="${cls}"${st}><span id="${c.id}-w${i}" class="g">${txt}</span></span>`;
  });
  capHtml += `      <div id="${c.id}" class="cap clip" data-start="${c.s}" data-duration="${d}" data-track-index="${track}" data-layout-allow-overlap style="top:290px;">${spans.join(" ").replace(/ <br\/> /g, "<br/>")}</div>\n`;
  capJs += `      // ${c.id}\n`;
  let full = c.s, n = 0, wc = 0;
  const step = c.loop ? 0.05 : ST;
  c.words.forEach((w, i) => {
    const k = kind(w);
    if (k === "br") return;
    wc++;
    if (c.still) { // frame 0: the whole hook line is already readable
      if (k === "*") capJs += `      tl.to("#${c.id}-w${i}", { keyframes: { scale: [1, 1.18, 1], rotation: [0, -5, 0] }, duration: 0.35, ease: "power1.inOut" }, 0.35);\n`;
      return;
    }
    const at = +(c.s + 0.02 + n * step).toFixed(3);
    n++;
    if (k === "*" || k === "!") {
      capJs += `      tl.fromTo("#${c.id}-w${i}", { opacity: 0, scale: 1.3, rotation: -6 }, { opacity: 1, scale: 1, rotation: 0, duration: ${KD}, ease: "back.out(2.2)" }, ${at});\n`;
      if (c.shake) capJs += `      tl.to("#${c.id}-w${i}", { keyframes: { x: [0, -12, 12, -8, 6, 0], rotation: [0, -4, 4, -2, 0, 0] }, duration: 0.32, ease: "none" }, ${+(at + 0.28).toFixed(3)});\n`;
      full = Math.max(full, at + KD);
    } else {
      capJs += `      tl.fromTo("#${c.id}-w${i}", { opacity: 0, scale: 0.4, y: 26 }, { opacity: 1, scale: 1, y: 0, duration: ${PD}, ease: "back.out(1.6)" }, ${at});\n`;
      full = Math.max(full, at + PD);
    }
  });
  if (c.loop) { report.push(`${c.id} loop copy of c01, complete @${full.toFixed(2)} (end ${c.e})`); continue; }
  const ex = +(c.e - EXIT - 0.01).toFixed(3);
  capJs += `      tl.to("#${c.id} .g", { opacity: 0, scale: 0.85, duration: ${EXIT}, ease: "power2.in" }, ${ex});\n`;
  const readable = +(ex - full).toFixed(2), need = Math.max(1.1, 0.35 * wc);
  report.push(`${c.id} ${wc}w full@${full.toFixed(2)} readable ${readable}s need ${need.toFixed(2)}s ${readable >= need - 1e-6 ? "ok" : "TOO SHORT"}`);
  if (readable < need - 1e-6) throw new Error(c.id + " too short");
  if (wc > 6) throw new Error(c.id + " has more than 6 words");
}
fs.writeFileSync(path.join(OUT, "compositions", "captions.html"), `<template>
  <style>
    ${FONTFACE}
    #root { position: absolute; inset: 0; }
    .cap { position: absolute; left: 80px; width: 920px; text-align: center; font-family: 'Inter', sans-serif; font-weight: 900;
      font-size: 92px; line-height: 1.12; color: #fff; letter-spacing: -0.01em; }
    .w { display: inline-block; margin: 0 0.12em; -webkit-text-stroke: 16px ${K}; paint-order: stroke fill; text-shadow: 0 9px 0 #050814; }
    .g { display: inline-block; }
    .kw { font-family: 'Lilita One'; font-weight: 400; color: ${YEL}; font-size: 140px; line-height: 1.0; text-transform: uppercase; letter-spacing: 0.01em; margin: 0 0.08em; }
    .q { font-family: 'Lilita One'; font-weight: 400; color: ${YEL}; font-size: 104px; line-height: 1.05; letter-spacing: 0.01em; }
    .pt { font-family: 'Lilita One'; font-weight: 400; color: ${YEL}; font-size: 168px; line-height: 0.95; letter-spacing: 0.01em; margin: 0 0.06em; -webkit-text-stroke: 22px ${K}; text-shadow: 0 16px 0 #050814; }
  </style>
  <div id="root" data-composition-id="captions" data-width="1080" data-height="1920">
${capHtml}  </div>
  <script>
    (function () {
      const tl = gsap.timeline({ paused: true });
${capJs}      window.__timelines["captions"] = tl;
    })();
  </script>
</template>
`);

// ================= Klotz (rig from Folge 1-3; new gag: freezes, refuses two bottles, gets cosy with a scarf, drinks cocoa) =================
const M = {
  shock:     { eye: 1.12, ps: 0.6, px: 0, py: 0, lL: 0, lR: 0, bL: -18, bR: -18, tL: -6, tR: -6, mx: 1, my: 1.1, g: 0, aL: 70, aR: -70 },
  surprised: { eye: 1.08, ps: 0.8, px: 0, py: 6, lL: 0, lR: 0, bL: -16, bR: -16, tL: 0, tR: 0, mx: 0.55, my: 0.6, g: 0, aL: 55, aR: -55 },
  fists:     { eye: 1.0, ps: 0.9, px: 0, py: -4, lL: 0.25, lR: 0.25, bL: 4, bR: 4, tL: 16, tR: 16, mx: 0.45, my: 0.3, g: 0, aL: 150, aR: -150 },
  impressed: { eye: 1.05, ps: 0.9, px: -6, py: -4, lL: 0, lR: 0, bL: -12, bR: -12, tL: -4, tR: -4, mx: 0.45, my: 0.45, g: 0, aL: 40, aR: -40 },
  curious:   { eye: 1.05, ps: 1.1, px: -14, py: -10, lL: 0.1, lR: 0.1, bL: -18, bR: -4, tL: 0, tR: 0, mx: 0.5, my: 0.35, g: 0, aL: 40, aR: -40 },
  suspicious:{ eye: 1, ps: 1, px: -14, py: 2, lL: 0.55, lR: 0.1, bL: 4, bR: -20, tL: 14, tR: 4, mx: 0.7, my: 0.18, g: 0, aL: 30, aR: -30 },
  look:      { eye: 1.06, ps: 1.0, px: -14, py: -8, lL: 0, lR: 0, bL: -14, bR: -14, tL: -4, tR: -4, mx: 0.5, my: 0.5, g: 0, aL: 40, aR: -40 },
  happy:     { eye: 1.04, ps: 1, px: 0, py: 0, lL: 0, lR: 0, bL: -10, bR: -10, tL: -4, tR: -4, mx: 0, my: 0, g: 1, gs: 0.8, aL: 35, aR: -35 },
  jawdrop:   { eye: 1.18, ps: 0.55, px: -6, py: -8, lL: 0, lR: 0, bL: -22, bR: -22, tL: -4, tR: -4, mx: 1.1, my: 1.7, g: 0, aL: 60, aR: -60 },
  stern:     { eye: 1.02, ps: 1, px: 0, py: 0, lL: 0.1, lR: 0.1, bL: 6, bR: 6, tL: 14, tR: 14, mx: 0.55, my: 0.2, g: 0, aL: 30, aR: -30 },
  content:   { eye: 1.04, ps: 1, px: 0, py: 0, lL: 0, lR: 0, bL: -10, bR: -10, tL: -4, tR: -4, mx: 0, my: 0, g: 1, gs: 0.6, aL: 25, aR: -30 },
  cheer:     { eye: 1.04, ps: 1, px: 0, py: 0, lL: 0, lR: 0, bL: -16, bR: -16, tL: -6, tR: -6, mx: 0.55, my: 0.3, g: 0, aL: 168, aR: -160 },
  smug:      { eye: 1, ps: 1, px: 8, py: 0, lL: 0.45, lR: 0.45, bL: -4, bR: -10, tL: 6, tR: -2, mx: 0, my: 0, g: 1, aL: 20, aR: -40 },
};
const CUP0 = 26.4, CUP1 = 38.6; // cocoa mug in the right hand
const LOOPK = C.c18[0];
const moods = [
  [2.3, "surprised"], [4.8, "fists"], [6.5, "impressed"], [8.4, "curious"], [10.45, "suspicious"], [13.4, "look"], [15.9, "jawdrop"],
  [18.4, "impressed"], [20.9, "surprised"], [22.95, "look"], [25.0, "stern"], [26.45, "content"], [30.0, "cheer"], [31.8, "happy"],
  [33.85, "content"], [36.05, "smug"], [LOOPK + 0.08, "shock"],
];
const blinks = [3.7, 7.4, 9.6, 12.2, 14.8, 17.2, 19.8, 23.9, 28.4, 31.2, 37.4];

const klotzSvg = `<svg viewBox="0 0 300 330" width="100%" height="100%" overflow="visible">
  <defs>
    <clipPath id="k-clipL"><ellipse cx="108" cy="140" rx="40" ry="46"/></clipPath>
    <clipPath id="k-clipR"><ellipse cx="192" cy="140" rx="40" ry="46"/></clipPath>
  </defs>
  <g id="k-armL"><rect x="31" y="186" width="34" height="84" rx="17" fill="#F06A0C" stroke="#7A2E00" stroke-width="6"/><circle cx="48" cy="270" r="21" fill="#FF7A1A" stroke="#7A2E00" stroke-width="6"/></g>
  <g id="k-armR"><rect x="235" y="186" width="34" height="84" rx="17" fill="#F06A0C" stroke="#7A2E00" stroke-width="6"/>
    <circle cx="252" cy="270" r="21" fill="#FF7A1A" stroke="#7A2E00" stroke-width="6"/></g>
  <ellipse cx="105" cy="304" rx="36" ry="17" fill="#D95F0A" stroke="#7A2E00" stroke-width="6"/>
  <ellipse cx="195" cy="304" rx="36" ry="17" fill="#D95F0A" stroke="#7A2E00" stroke-width="6"/>
  <rect x="40" y="48" width="220" height="250" rx="72" fill="#FF7A1A" stroke="#7A2E00" stroke-width="8"/>
  <rect id="k-frost" x="44" y="52" width="212" height="242" rx="68" fill="#BFE6FF" opacity=".28"/>
  <path d="M48 220 Q60 290 150 292 Q240 290 252 220 L252 236 Q246 294 150 294 Q54 294 48 236 Z" fill="#E8650C"/>
  <ellipse cx="92" cy="86" rx="38" ry="18" fill="#fff" opacity=".28" transform="rotate(-24 92 86)"/>
  <path id="k-snow" d="M66 64 Q78 34 118 42 Q146 26 178 40 Q222 30 236 62 Q232 78 212 72 Q194 84 172 72 Q150 86 128 74 Q104 86 88 74 Q70 80 66 64 Z" fill="#fff" stroke="#8FB8D8" stroke-width="5"/>
  <ellipse id="k-chkL" cx="72" cy="198" rx="20" ry="12" fill="#FF5A6E" opacity=".45"/><ellipse id="k-chkR" cx="228" cy="198" rx="20" ry="12" fill="#FF5A6E" opacity=".45"/>
  <ellipse id="k-rosyL" cx="72" cy="198" rx="24" ry="14" fill="#FF5A72" opacity="0"/><ellipse id="k-rosyR" cx="228" cy="198" rx="24" ry="14" fill="#FF5A72" opacity="0"/>
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
  <circle id="k-nose" cx="150" cy="184" r="12" fill="#F28A3A" stroke="#7A2E00" stroke-width="5"/>
  <g id="k-ice"><path d="M140 192 L160 192 L151 244 Z" fill="${ICE}" stroke="${ICE_D}" stroke-width="4" stroke-linejoin="round"/><path d="M146 198 L149 226" stroke="#fff" stroke-width="4" stroke-linecap="round"/></g>
  <g id="k-scarf">
    <path d="M226 270 L262 268 L270 338 L238 342 Z" fill="${FRED}" stroke="#7A0E14" stroke-width="6" stroke-linejoin="round"/>
    <path d="M232 296 L266 294 M236 318 L268 316" stroke="#fff" stroke-width="8"/>
    <path d="M40 252 Q150 288 260 252 L262 286 Q150 322 38 286 Z" fill="${FRED}" stroke="#7A0E14" stroke-width="6" stroke-linejoin="round"/>
    <path d="M86 268 L80 302 M150 276 L150 312 M214 268 L220 302" stroke="#fff" stroke-width="10"/>
  </g>
  <g id="k-mugarm">
    <g id="k-mug">
      <path d="M286 236 Q312 236 312 256 Q312 276 286 276" fill="none" stroke="#2A4A66" stroke-width="9"/>
      <rect x="232" y="226" width="58" height="62" rx="12" fill="#7FC4EA" stroke="#2A4A66" stroke-width="6"/>
      <ellipse cx="261" cy="230" rx="27" ry="8" fill="#6B3A1E" stroke="#2A4A66" stroke-width="4"/>
      <rect x="242" y="216" width="16" height="14" rx="5" fill="#fff" stroke="#7A2E00" stroke-width="3"/><rect x="262" y="213" width="16" height="14" rx="5" fill="#FFC7D6" stroke="#7A2E00" stroke-width="3"/>
      <path d="M244 250 Q261 262 278 250" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>
      <g id="k-steam" stroke="#E8EDF3" stroke-width="5" fill="none" stroke-linecap="round" opacity=".85"><path d="M252 206 q-8 -12 0 -24 q8 -12 0 -24"/><path d="M272 204 q-8 -12 0 -24 q8 -12 0 -24"/></g>
    </g>
    <circle cx="252" cy="270" r="21" fill="#FF7A1A" stroke="#7A2E00" stroke-width="6"/>
  </g>
</svg>`;

let kJs = "";
const setMood = (m, t, dur) => {
  const p = M[m];
  const hold = t >= CUP0 && t < CUP1;
  const aR = hold ? -25 : p.aR;
  const o = `duration: ${dur}, ease: "back.out(1.8)"`;
  return `      tl.to(["#k-eyeL", "#k-eyeR"], { scale: ${p.eye}, ${o} }, ${t});
      tl.to(["#k-pupL", "#k-pupR"], { x: ${p.px}, y: ${p.py}, scale: ${p.ps}, ${o} }, ${t});
      tl.to("#k-lidL", { scaleY: ${p.lL}, duration: ${dur}, ease: "power2.out" }, ${t});
      tl.to("#k-lidR", { scaleY: ${p.lR}, duration: ${dur}, ease: "power2.out" }, ${t});
      tl.to("#k-browL", { y: ${p.bL}, rotation: ${p.tL}, ${o} }, ${t});
      tl.to("#k-browR", { y: ${p.bR}, rotation: ${-p.tR}, ${o} }, ${t});
      tl.to("#k-mouth", { scaleX: ${p.mx || 0.001}, scaleY: ${p.my || 0.001}, opacity: ${p.g ? 0 : 1}, ${o} }, ${t});
      tl.to("#k-grin", { scale: ${p.g ? (p.gs || 1) : 0.2}, opacity: ${p.g}, ${o} }, ${t});
      tl.to("#k-armL", { rotation: ${p.aL}, duration: ${+(dur * 1.3).toFixed(3)}, ease: "back.out(1.6)" }, ${+(t + 0.04).toFixed(2)});
      tl.to("#k-armR", { rotation: ${aR}, duration: ${+(dur * 1.3).toFixed(3)}, ease: "back.out(1.6)" }, ${+(t + 0.08).toFixed(2)});
${hold ? `      tl.to("#k-mugarm", { rotation: ${aR}, duration: ${+(dur * 1.3).toFixed(3)}, ease: "back.out(1.6)" }, ${+(t + 0.08).toFixed(2)});
      tl.to("#k-mug", { rotation: ${-aR}, duration: ${+(dur * 1.3).toFixed(3)}, ease: "back.out(1.6)" }, ${+(t + 0.08).toFixed(2)});\n` : ""}`;
};
// shiver: fast small x jitter, starts and ends at 0
const shiver = (t0, dur, a = 5) => { const n = Math.round(dur / 0.07); const xs = Array.from({ length: n + 1 }, (_, i) => (i === 0 || i === n ? 0 : (i % 2 ? -a : a))); return `      tl.to("#k-wrap", { keyframes: { x: ${JSON.stringify(xs)} }, duration: ${(n * 0.07).toFixed(2)}, ease: "none" }, ${t0});\n`; };
const p0 = M.shock;
kJs += `      gsap.set("#k-armL", { svgOrigin: "48 190" }); gsap.set("#k-armR", { svgOrigin: "252 190" });
      gsap.set(["#k-eyeL"], { svgOrigin: "108 140" }); gsap.set(["#k-eyeR"], { svgOrigin: "192 140" });
      gsap.set("#k-pupL", { svgOrigin: "108 142" }); gsap.set("#k-pupR", { svgOrigin: "192 142" });
      gsap.set("#k-lidL", { svgOrigin: "108 90" }); gsap.set("#k-lidR", { svgOrigin: "192 90" });
      gsap.set("#k-browL", { svgOrigin: "109 81" }); gsap.set("#k-browR", { svgOrigin: "191 81" });
      gsap.set("#k-mouth", { svgOrigin: "150 228" }); gsap.set("#k-grin", { svgOrigin: "150 230" });
      gsap.set("#k-ice", { svgOrigin: "150 192" }); gsap.set("#k-scarf", { svgOrigin: "150 280" });
      gsap.set("#k-mug", { svgOrigin: "261 257" }); gsap.set("#k-mugarm", { svgOrigin: "252 190", rotation: -30, opacity: 0 }); gsap.set("#k-steam", { svgOrigin: "262 200" });
      gsap.set(["#k-eyeL", "#k-eyeR"], { scale: ${p0.eye} });
      gsap.set(["#k-pupL", "#k-pupR"], { x: 0, y: 0, scale: ${p0.ps} });
      gsap.set(["#k-lidL", "#k-lidR"], { scaleY: 0 });
      gsap.set("#k-browL", { y: ${p0.bL}, rotation: ${p0.tL} }); gsap.set("#k-browR", { y: ${p0.bR}, rotation: ${-p0.tR} });
      gsap.set("#k-mouth", { scaleX: ${p0.mx}, scaleY: ${p0.my}, opacity: 1 }); gsap.set("#k-grin", { scale: 0.2, opacity: 0 });
      gsap.set("#k-armL", { rotation: ${p0.aL} }); gsap.set("#k-armR", { rotation: ${p0.aR} });
      gsap.set("#k-ice", { scaleY: 1, opacity: 1 }); gsap.set("#k-scarf", { scale: 0, opacity: 0 });
      gsap.set("#k-mug", { scale: 0, opacity: 0, rotation: 0 }); gsap.set(["#k-rosyL", "#k-rosyR"], { opacity: 0 }); gsap.set("#k-frost", { opacity: 0.28 });
      gsap.set("#k-wrap", { x: 0, y: 0, rotation: 0 }); gsap.set("#k-sq", { scaleX: 1, scaleY: 1 });
      gsap.set(["#k-botL", "#k-botR"], { opacity: 0, x: 0, y: 0, rotation: 0, scale: 1 });
      // idle bob: 80 half-cycles over the film, ends where it starts; the floe rocks in whole cycles too
      tl.fromTo("#k-bob", { y: 0 }, { y: -12, duration: ${(DUR / 80).toFixed(5)}, ease: "sine.inOut", yoyo: true, repeat: 79 }, 0);
      tl.fromTo("#k-floe", { rotation: 0 }, { keyframes: { rotation: [0, 1.6, 0, -1.6, 0] }, duration: ${(DUR / 9).toFixed(5)}, ease: "none", repeat: 8 }, 0);
      // frozen: shivering in the hook, the icicle wobbles
${shiver(0.0, 2.1, 4)}      tl.to("#k-ice", { keyframes: { rotation: [0, 8, -8, 6, -4, 0] }, duration: 0.9, ease: "none" }, 0.2);
`;
for (const [t, m] of moods) {
  kJs += `      // ${m} @ ${t}\n`;
  kJs += `      tl.to("#k-sq", { keyframes: { scaleY: [1, 0.9, 1.06, 1], scaleX: [1, 1.07, 0.97, 1] }, duration: 0.3, ease: "none" }, ${+(t - 0.05).toFixed(2)});\n`;
  kJs += setMood(m, +(t + 0.03).toFixed(2), 0.22);
}
for (const b of blinks) kJs += `      tl.to(["#k-lidL", "#k-lidR"], { scaleY: 1, duration: 0.06, yoyo: true, repeat: 1, ease: "power1.inOut" }, ${b});\n`;
kJs += `      // GAG 1: fists up while shivering (Die Waffen?)
      tl.to(["#k-armL", "#k-armR"], { keyframes: { rotation: [0, 0] }, duration: 0.01 }, 4.6);
      tl.to("#k-armL", { keyframes: { rotation: [150, 120, 150, 120, 150] }, duration: 0.9, ease: "none" }, 5.2);
      tl.to("#k-armR", { keyframes: { rotation: [-150, -150, -120, -150, -120, -150] }, duration: 0.9, ease: "none" }, 5.2);
${shiver(4.85, 1.4, 5)}${shiver(10.5, 0.7, 4)}${shiver(15.95, 0.84, 5)}
      // GAG 2: a bottle is offered from each side; Klotz says no, the bottles slide away, he gets a scarf
      tl.set("#k-botL", { opacity: 1 }, 21.2);
      tl.fromTo("#k-botL", { x: -260, rotation: -30 }, { x: 0, rotation: 10, duration: 0.35, ease: "back.out(1.6)" }, 21.2);
      tl.to("#k-botL", { rotation: 16, duration: 0.4, yoyo: true, repeat: 5, ease: "sine.inOut" }, 21.6);
      tl.to(["#k-pupL", "#k-pupR"], { x: -16, duration: 0.2 }, 21.3);
      tl.set("#k-botR", { opacity: 1 }, 25.15);
      tl.fromTo("#k-botR", { x: 220, rotation: 30 }, { x: 0, rotation: -10, duration: 0.35, ease: "back.out(1.6)" }, 25.15);
      tl.to(["#k-pupL", "#k-pupR"], { x: 16, duration: 0.2 }, 25.25);
      // clear "no": the whole head shakes, eyes and brows go with it, then both arms push the bottles away
      tl.to("#k-wrap", { keyframes: { rotation: [0, -12, 12, -12, 12, -8, 0], x: [0, -14, 14, -14, 14, -8, 0] }, duration: 0.6, ease: "none" }, 25.35);
      tl.to(["#k-browL", "#k-browR"], { y: 6, duration: 0.15 }, 25.35);
      tl.to("#k-armL", { keyframes: { rotation: [30, 115, 115, 30] }, duration: 0.5, ease: "power1.inOut" }, 25.95);
      tl.to("#k-armR", { keyframes: { rotation: [-30, -115, -115, -30] }, duration: 0.5, ease: "power1.inOut" }, 25.95);
      tl.to("#k-botL", { x: -360, y: 40, rotation: -50, duration: 0.4, ease: "power2.in" }, 26.08);
      tl.to("#k-botR", { x: 300, y: 40, rotation: 50, duration: 0.4, ease: "power2.in" }, 26.1);
      tl.set(["#k-botL", "#k-botR"], { opacity: 0 }, 26.52);
      // cosy because of the scarf and the cocoa (slight cold cheeks only)
      tl.to("#k-scarf", { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2.4)" }, 26.45);
      tl.to("#k-ice", { scaleY: 0, opacity: 0, duration: 0.35, ease: "power2.in" }, 26.5);
      tl.to("#k-frost", { opacity: 0, duration: 0.4 }, 26.5);
      tl.to(["#k-rosyL", "#k-rosyR"], { opacity: 0.3, duration: 0.3 }, 26.5);
      tl.set("#k-mugarm", { opacity: 1 }, 26.45);
      tl.to("#k-mug", { scale: 1.45, opacity: 1, duration: 0.3, ease: "back.out(2.4)" }, 26.45);
      tl.to("#k-steam", { keyframes: { y: [0, -10, 0], opacity: [0.85, 0.4, 0.85] }, duration: 0.8, ease: "sine.inOut", repeat: 13 }, 26.7);
      // a sip during the fast motion, eyes stay open
      tl.to(["#k-armR", "#k-mugarm"], { rotation: 62, duration: 0.3, ease: "power2.out" }, 28.3);
      tl.to("#k-mug", { rotation: -87, duration: 0.3, ease: "power2.out" }, 28.3);
      tl.to(["#k-armR", "#k-mugarm"], { rotation: -25, duration: 0.3, ease: "back.out(1.6)" }, 28.85);
      tl.to("#k-mug", { rotation: 25, duration: 0.3, ease: "back.out(1.6)" }, 28.85);
      // GAG 3: the drink scene - Klotz lifts a cocoa mug with marshmallows, sips, winks
      tl.to(["#k-armR", "#k-mugarm"], { rotation: 62, duration: 0.3, ease: "power2.out" }, 34.45);
      tl.to("#k-mug", { rotation: -87, duration: 0.3, ease: "power2.out" }, 34.45);
      tl.to(["#k-armR", "#k-mugarm"], { rotation: -25, duration: 0.3, ease: "back.out(1.6)" }, 35.05);
      tl.to("#k-mug", { rotation: 25, duration: 0.3, ease: "back.out(1.6)" }, 35.05);
      tl.to("#k-lidR", { scaleY: 0, duration: 0.12 }, 35.15);
      tl.to("#k-lidL", { scaleY: 1, duration: 0.1 }, 35.15);
      tl.to("#k-browL", { y: 4, rotation: 10, duration: 0.15 }, 35.15);
      tl.to("#k-lidL", { scaleY: 0, duration: 0.12 }, 35.75);
      tl.to("#k-wrap", { keyframes: { rotation: [0, -5, 0] }, duration: 0.5, ease: "sine.inOut" }, 35.15);
      // second sip in the question scene
      tl.to(["#k-armR", "#k-mugarm"], { rotation: 62, duration: 0.3, ease: "power2.out" }, 37.0);
      tl.to("#k-mug", { rotation: -87, duration: 0.3, ease: "power2.out" }, 37.0);
      tl.to(["#k-armR", "#k-mugarm"], { rotation: -25, duration: 0.3, ease: "back.out(1.6)" }, 37.55);
      tl.to("#k-mug", { rotation: 25, duration: 0.3, ease: "back.out(1.6)" }, 37.55);
      // loop (${LOOPK}): mug and scarf pop away, the icicle grows back, frame-0 shock pose
      tl.to("#k-mug", { scale: 0, opacity: 0, duration: 0.15, ease: "back.in(2)" }, ${LOOPK});
      tl.set("#k-mugarm", { opacity: 0 }, ${+(LOOPK + 0.15).toFixed(2)});
      tl.to("#k-scarf", { scale: 0, opacity: 0, duration: 0.18, ease: "back.in(2)" }, ${+(LOOPK + 0.03).toFixed(2)});
      tl.to(["#k-rosyL", "#k-rosyR"], { opacity: 0, duration: 0.2 }, ${LOOPK});
      tl.to("#k-frost", { opacity: 0.28, duration: 0.2 }, ${LOOPK});
      tl.to("#k-ice", { scaleY: 1, opacity: 1, duration: 0.25, ease: "back.out(2)" }, ${+(LOOPK + 0.12).toFixed(2)});
      tl.to("#k-wrap", { keyframes: { y: [0, -24, 0], rotation: [0, 0, 0] }, duration: 0.3, ease: "none" }, ${+(LOOPK + 0.05).toFixed(2)});
${shiver(+(LOOPK + 0.38).toFixed(2), 0.21, 4)}`;
const BOT_SMALL = (svg) => svg.replace('width="100%" height="100%"', 'width="100%" height="100%"');
fs.writeFileSync(path.join(OUT, "compositions", "klotz.html"), `<template>
  <style>
    #root { position: absolute; inset: 0; pointer-events: none; }
    #k-floe { position: absolute; left: 560px; top: 1722px; width: 490px; height: 110px; transform-origin: 50% 50%; }
    #k-wrap { position: absolute; left: 700px; top: 1480px; width: 260px; height: 286px; transform-origin: 50% 100%; }
    #k-bob, #k-sq { position: absolute; inset: 0; transform-origin: 50% 100%; }
    #k-shadow { position: absolute; left: 725px; top: 1748px; width: 210px; height: 30px; border-radius: 50%; background: rgba(0,0,0,.25); }
    #k-botL { position: absolute; left: 590px; top: 1570px; width: 70px; height: 175px; transform-origin: 50% 100%; }
    #k-botR { position: absolute; left: 972px; top: 1570px; width: 60px; height: 180px; transform-origin: 50% 100%; }
  </style>
  <div id="root" data-composition-id="klotz" data-width="1080" data-height="1920" data-layout-allow-overflow>
    <div id="k-floe"><svg viewBox="0 0 490 110" width="100%" height="100%" overflow="visible"><path d="M14 40 L70 10 L420 8 L478 40 L460 98 L40 102 Z" fill="${ICE}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/><path d="M30 52 L462 50" stroke="${ICE_M}" stroke-width="10"/><path d="M90 24 L200 22" stroke="#fff" stroke-width="8" stroke-linecap="round"/></svg></div>
    <div id="k-shadow"></div>
    <div id="k-botL">${BOT_SMALL(WHISKY)}</div>
    <div id="k-botR">${BOT_SMALL(SCHNAPS)}</div>
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

// ================= index.html + sound =================
const sfx = [
  [0.0, "impact", 0.7], [0.0, "flap", 0.5], [0.05, "chatter", 0.55], [0.35, "boing", 0.5], [0.75, "flap", 0.4], [1.3, "flap", 0.35],
  [2.3, "whoosh1", 0.45], [2.4, "pop1", 0.4], [3.05, "tear", 0.55], [3.35, "tear", 0.4], [3.6, "tear", 0.4], [3.98, "stamp", 0.6],
  [4.8, "whoosh2", 0.45], [5.1, "pop2", 0.45], [5.15, "chatter", 0.5], [5.57, "puff", 0.55], [5.87, "puff", 0.5],
  [6.5, "pop1", 0.5], [6.86, "cork", 0.6], [7.0, "pop2", 0.45], [7.34, "cork", 0.55], [7.0, "glug", 0.35],
  [8.4, "whoosh1", 0.45], [8.95, "impact", 0.55], [9.4, "ding", 0.4],
  [10.45, "whoosh2", 0.4], [10.7, "pop1", 0.4], [10.85, "pop2", 0.35], [11.2, "pop1", 0.35], [11.5, "ding", 0.4], [11.65, "ping", 0.3],
  [13.55, "ticks", 0.55], [14.4, "stamp", 0.55], [14.45, "ping", 0.3],
  [15.9, "whoosh1", 0.45], [16.3, "boing", 0.5], [16.4, "buzz", 0.35],
  [18.4, "splash", 0.55], [18.5, "motor", 0.5], [19.15, "hop", 0.45], [19.4, "hop", 0.45],
  [20.9, "pop2", 0.45], [21.05, "flap", 0.45], [21.2, "pop1", 0.45], [21.45, "clinkS", 0.4],
  [22.6, "whoosh2", 0.35], [22.95, "splash", 0.45], [23.0, "motor", 0.45], [23.5, "hop", 0.45], [23.7, "hop", 0.45],
  [25.0, "whoosh1", 0.4], [25.25, "flap", 0.45], [25.15, "pop1", 0.45], [25.4, "nope", 0.5], [26.1, "whoosh2", 0.4], [26.5, "pop1", 0.4], [26.0, "splash", 0.4], [26.2, "sparkle", 0.45],
  [27.05, "rewind", 0.5], [27.45, "pop2", 0.3], [27.85, "pop1", 0.3], [28.25, "pop2", 0.3], [28.65, "pop1", 0.3], [29.05, "pop2", 0.3], [29.45, "pop1", 0.3],
  [30.0, "whoosh2", 0.4], [30.35, "impact", 0.6], [30.45, "sparkle", 0.55], [30.5, "chime", 0.45],
  [31.8, "splash", 0.4], [32.15, "ticks", 0.4], [32.65, "crack", 0.55],
  [33.85, "whoosh1", 0.4], [34.4, "clink", 0.8], [34.45, "impact", 0.5], [34.5, "slurp", 0.55], [35.2, "ding", 0.4],
  [36.05, "splash", 0.45], [36.6, "pop1", 0.4], [36.85, "pop2", 0.4], [37.0, "slurp", 0.45],
  [38.55, "whoosh2", 0.45], [38.6, "pop1", 0.35], [38.7, "boing", 0.35],
].filter(([, , v]) => v > 0);
const wavDur = (n) => { const st = fs.statSync(path.join(OUT, "assets", "sfx", n + ".wav")); return +((st.size - 44) / (44100 * 4)).toFixed(3); };
const lanes = [];
const sfxTags = sfx.slice().sort((a, b) => a[0] - b[0]).map(([t, n, v], i) => {
  const dd = +Math.min(wavDur(n), DUR - t).toFixed(3);
  let lane = lanes.findIndex((e) => e <= t + 1e-6);
  if (lane < 0) { lanes.push(t + dd); lane = lanes.length - 1; } else lanes[lane] = t + dd;
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
${scenes.map((s, i) => host(s.id, s.start, Math.min(s.host, +(DUR - s.start).toFixed(2)), 1 + (i % 2), 2)).join("\n")}
${host("klotz", 0, DUR, 3, 3)}
${host("captions", 0, DUR, 4, 4, "captions")}
      <audio id="music-polar" class="clip" src="assets/sfx/polar.wav" data-start="0" data-duration="${DUR}" data-track-index="5" data-volume="0.42"></audio>
${sfxTags.join("\n")}
    </div>
    <script>
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`;
fs.writeFileSync(path.join(OUT, "index.html"), index);
for (const f of fs.readdirSync(path.join(OUT, "compositions"))) {
  const ids = [...fs.readFileSync(path.join(OUT, "compositions", f), "utf8").matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
  if (dup.length) throw new Error("duplicate ids in " + f + ": " + [...new Set(dup)].join(", "));
}
{ // ids must also be unique across the whole film (all compositions share one document)
  const all = {};
  for (const f of fs.readdirSync(path.join(OUT, "compositions"))) for (const m of fs.readFileSync(path.join(OUT, "compositions", f), "utf8").matchAll(/\sid="([^"]+)"/g)) { if (m[1] === "root") continue; (all[m[1]] ||= new Set()).add(f); }
  const multi = Object.entries(all).filter(([, s]) => s.size > 1);
  if (multi.length) throw new Error("ids shared between compositions: " + multi.map(([k, s]) => k + " (" + [...s].join(",") + ")").join("; "));
  const idx = [...index.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]).filter((x) => all[x]);
  if (idx.length) throw new Error("index ids also used in compositions: " + idx.join(", "));
}
console.log(report.join("\n"));
console.log("written", scenes.length, "scenes,", sfx.length, "sfx, lanes", lanes.length, "DUR", DUR);
