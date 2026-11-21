// Generator for Folge 5 "Sir Nils Olav": writes index.html and compositions/*.html
// Usage: node tools/gen.mjs <project_dir>
// Technique from Folge 1-4 (scene helper, Klotz rig, captions with fixed word gap, id checks).
// New in Folge 5: parade-ground background, king penguin rig, epaulette, zoo gate, guards, Norway flag,
// certificate with footprint stamp, ladder, coat of arms, drum, three silhouettes, comment bubbles.
// Cuts: the old scene fades out and is gone exactly at the cut, the new scene is visible from the cut frame on.
import fs from "node:fs";
import path from "node:path";

const OUT = process.argv[2];
export const DUR = 39.7;
fs.mkdirSync(path.join(OUT, "compositions"), { recursive: true });

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const R = mulberry32(1972);
const r = (a, b) => +(a + (b - a) * R()).toFixed(2);

const K = "#0A0F22";
const YEL = "#FFD23F", GOLD = "#F2B705", GOLD_D = "#B07A00", RED = "#FF3B3B", CRED = "#C8202F", CRED_D = "#8E1220";
const NAVY = "#1E3A8A", NAVY_D = "#142766", NBLUE = "#1F3F9E";
const PB = "#1F2636"; // penguin back

// ================= drawings (own designs) =================
// four-point sparkle, 100 x 100
const SPARK = (col = YEL) => `<svg viewBox="0 0 100 100" width="100%" height="100%" overflow="visible"><path d="M50 2 Q56 44 98 50 Q56 56 50 98 Q44 56 2 50 Q44 44 50 2 Z" fill="${col}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/></svg>`;
// five-point star path in a 100 x 100 box
const STAR_D = "M50 4 L62 36 L96 38 L70 60 L79 94 L50 75 L21 94 L30 60 L4 38 L38 36 Z";
const STAR = (fill = "#E9EEF5", stroke = K, sw = 7) => `<svg viewBox="0 0 100 100" width="100%" height="100%" overflow="visible"><path d="${STAR_D}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/><path d="M50 18 L57 38" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".8"/></svg>`;

// king penguin, viewBox 300 x 430. o: { sword, medal, hat, flipL (deg), sil (silhouette) }
// viewer-left flipper = penguin's right flipper (pivot 58 172), viewer-right flipper pivot 242 172
function PENG(p, o = {}) {
  if (o.sil) {
    const f = o.silFill || "#16204A", s = o.silStroke || YEL;
    return `<svg viewBox="0 0 300 430" width="100%" height="100%" overflow="visible">
    <g fill="${f}" stroke="${s}" stroke-width="9" stroke-linejoin="round">
      <ellipse cx="112" cy="410" rx="42" ry="16"/><ellipse cx="188" cy="410" rx="42" ry="16"/>
      <path d="M54 168 C 16 206 8 262 22 300 C 38 276 54 236 64 200 Z"/><path d="M246 168 C 284 206 292 262 278 300 C 262 276 246 236 236 200 Z"/>
      <path d="M150 18 C 236 18 268 130 268 250 C 268 350 226 412 150 412 C 74 412 32 350 32 250 C 32 130 64 18 150 18 Z"/>
      <path d="M132 100 Q150 92 168 100 L152 150 Q150 154 148 150 Z" stroke-width="7"/>
    </g></svg>`;
  }
  const sword = `<g id="${p}-sw" transform="translate(22 296) rotate(14)">
        <rect x="-7" y="-14" width="14" height="34" rx="5" fill="${CRED}" stroke="${K}" stroke-width="4"/><circle cx="0" cy="-17" r="8" fill="${GOLD}" stroke="${K}" stroke-width="4"/>
        <rect x="-30" y="18" width="60" height="12" rx="6" fill="${GOLD}" stroke="${K}" stroke-width="4"/>
        <path d="M-8 30 L8 30 L8 128 L0 150 L-8 128 Z" fill="#E6ECF2" stroke="${K}" stroke-width="5" stroke-linejoin="round"/><path d="M0 40 V124" stroke="#A9B6C6" stroke-width="4" stroke-linecap="round"/></g>`;
  const medal = `<g id="${p}-med">
      <path d="M128 182 L146 236 L158 236 L140 182 Z" fill="${CRED}" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M172 182 L154 236 L142 236 L160 182 Z" fill="${NBLUE}" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>
      <circle cx="150" cy="254" r="24" fill="${YEL}" stroke="${K}" stroke-width="5"/>
      <path d="M150 238 L155 249 L167 250 L158 258 L161 270 L150 263 L139 270 L142 258 L133 250 L145 249 Z" fill="${GOLD}" stroke="${GOLD_D}" stroke-width="2.5" stroke-linejoin="round"/></g>`;
  const hat = `<g id="${p}-hat"><path d="M80 74 C 60 -70 240 -70 220 74 Q150 90 80 74 Z" fill="#12151E" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
      <path d="M104 -10 q8 -10 16 0 M150 -32 q8 -10 16 0 M180 10 q8 -10 16 0 M118 34 q8 -10 16 0 M160 50 q8 -10 16 0" stroke="#323A4E" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M84 72 Q150 88 216 72" stroke="${GOLD}" stroke-width="7" fill="none"/><circle cx="214" cy="40" r="10" fill="${CRED}" stroke="${K}" stroke-width="4"/></g>`;
  return `<svg viewBox="0 0 300 430" width="100%" height="100%" overflow="visible">
    <defs><linearGradient id="${p}-bel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFB627"/><stop offset=".2" stop-color="#FFE08A"/><stop offset=".42" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E9EEF6"/></linearGradient></defs>
    <ellipse cx="112" cy="410" rx="42" ry="16" fill="#FF9A1F" stroke="${K}" stroke-width="6"/><ellipse cx="188" cy="410" rx="42" ry="16" fill="#FF9A1F" stroke="${K}" stroke-width="6"/>
    <path d="M150 18 C 236 18 268 130 268 250 C 268 350 226 412 150 412 C 74 412 32 350 32 250 C 32 130 64 18 150 18 Z" fill="${PB}" stroke="${K}" stroke-width="8"/>
    <path d="M70 70 C 80 40 110 26 140 24" stroke="#3A4560" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M150 128 C 214 128 236 200 236 268 C 236 350 200 396 150 396 C 100 396 64 350 64 268 C 64 200 86 128 150 128 Z" fill="url(#${p}-bel)"/>
    <path d="M86 70 C 66 92 66 134 96 156 C 100 136 98 104 114 86 Z" fill="#FFB627" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M214 70 C 234 92 234 134 204 156 C 200 136 202 104 186 86 Z" fill="#FFB627" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>
    <g id="${p}-eyes"><circle cx="122" cy="84" r="18" fill="#fff" stroke="${K}" stroke-width="5"/><circle cx="178" cy="84" r="18" fill="#fff" stroke="${K}" stroke-width="5"/>
      <g id="${p}-pup"><circle cx="124" cy="87" r="8.5" fill="${K}"/><circle cx="180" cy="87" r="8.5" fill="${K}"/><circle cx="127" cy="83" r="3" fill="#fff"/><circle cx="183" cy="83" r="3" fill="#fff"/></g></g>
    <ellipse cx="98" cy="122" rx="12" ry="7" fill="#FF8FA3" opacity=".6"/><ellipse cx="202" cy="122" rx="12" ry="7" fill="#FF8FA3" opacity=".6"/>
    <path d="M132 100 Q150 92 168 100 L152 150 Q150 154 148 150 Z" fill="#1A1F2C" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M140 112 Q150 108 160 112 L151 140 Z" fill="#FF8A1F"/>
    ${o.medal ? medal : ""}
    ${o.hat ? hat : ""}
    <g id="${p}-fR"><path d="M246 168 C 284 206 292 262 278 300 C 262 276 246 236 236 200 Z" fill="${PB}" stroke="${K}" stroke-width="7" stroke-linejoin="round"/></g>
    <g${o.flipL ? ` transform="rotate(${o.flipL} 58 172)"` : ""}><g id="${p}-fL">${o.sword ? sword : ""}<path d="M54 168 C 16 206 8 262 22 300 C 38 276 54 236 64 200 Z" fill="${PB}" stroke="${K}" stroke-width="7" stroke-linejoin="round"/></g></g>
  </svg>`;
}

// friendly guard with bearskin hat, no weapons: viewBox 140 x 330
function GUARD(p) {
  return `<svg viewBox="0 0 140 330" width="100%" height="100%" overflow="visible">
    <g id="${p}-lL"><rect x="42" y="250" width="24" height="60" rx="6" fill="#20242E" stroke="${K}" stroke-width="6"/><rect x="51" y="254" width="6" height="52" fill="${CRED}"/><rect x="34" y="304" width="38" height="20" rx="9" fill="${K}"/></g>
    <g id="${p}-lR"><rect x="74" y="250" width="24" height="60" rx="6" fill="#20242E" stroke="${K}" stroke-width="6"/><rect x="83" y="254" width="6" height="52" fill="${CRED}"/><rect x="68" y="304" width="38" height="20" rx="9" fill="${K}"/></g>
    <rect x="30" y="166" width="80" height="96" rx="16" fill="${NAVY}" stroke="${K}" stroke-width="7"/>
    <rect x="33" y="224" width="74" height="12" fill="#fff"/><circle cx="70" cy="186" r="5" fill="${GOLD}" stroke="${K}" stroke-width="2"/><circle cx="70" cy="206" r="5" fill="${GOLD}" stroke="${K}" stroke-width="2"/>
    <rect x="40" y="160" width="60" height="16" rx="6" fill="${CRED}" stroke="${K}" stroke-width="5"/>
    <rect x="38" y="104" width="64" height="62" rx="27" fill="#F2C29B" stroke="${K}" stroke-width="6"/>
    <circle cx="58" cy="132" r="5" fill="${K}"/><circle cx="82" cy="132" r="5" fill="${K}"/>
    <path d="M60 146 Q70 155 80 146" stroke="${K}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="50" cy="146" rx="7" ry="4" fill="#FF8FA3" opacity=".7"/><ellipse cx="90" cy="146" rx="7" ry="4" fill="#FF8FA3" opacity=".7"/>
    <path d="M40 150 Q70 184 100 150" stroke="${GOLD}" stroke-width="5" fill="none"/>
    <path d="M28 118 C 12 40 38 -4 70 -4 C 102 -4 128 40 112 118 Q70 128 28 118 Z" fill="#12151E" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M44 24 q7 -9 14 0 M76 8 q7 -9 14 0 M90 50 q7 -9 14 0 M46 74 q7 -9 14 0 M70 96 q7 -9 14 0" stroke="#323A4E" stroke-width="5" fill="none" stroke-linecap="round"/>
    <g id="${p}-aL"><rect x="12" y="170" width="22" height="80" rx="11" fill="${NAVY}" stroke="${K}" stroke-width="6"/><circle cx="23" cy="252" r="12" fill="#fff" stroke="${K}" stroke-width="5"/></g>
    <g id="${p}-aR"><rect x="106" y="170" width="22" height="80" rx="11" fill="${NAVY}" stroke="${K}" stroke-width="6"/><circle cx="117" cy="252" r="12" fill="#fff" stroke="${K}" stroke-width="5"/></g>
  </svg>`;
}
const guardOrigins = (p) => `gsap.set("#${p}-lL", { svgOrigin: "54 254" }); gsap.set("#${p}-lR", { svgOrigin: "86 254" }); gsap.set("#${p}-aL", { svgOrigin: "23 178" }); gsap.set("#${p}-aR", { svgOrigin: "117 178" });`;
// marching: n steps of 0.5 s, legs and arms swing, ends in the standing pose
const march = (p, at, n) => `      tl.to("#${p}-lL", { keyframes: { rotation: [0, 20, 0, -20, 0] }, duration: 0.5, ease: "none", repeat: ${n - 1} }, ${at});
      tl.to("#${p}-lR", { keyframes: { rotation: [0, -20, 0, 20, 0] }, duration: 0.5, ease: "none", repeat: ${n - 1} }, ${at});
      tl.to("#${p}-aL", { keyframes: { rotation: [0, -22, 0, 22, 0] }, duration: 0.5, ease: "none", repeat: ${n - 1} }, ${at});
      tl.to("#${p}-aR", { keyframes: { rotation: [0, 22, 0, -22, 0] }, duration: 0.5, ease: "none", repeat: ${n - 1} }, ${at});`;

// simplified Norway flag: red, white-bordered blue cross shifted to the hoist side. viewBox 300 x 218
const FLAG_NO = `<svg viewBox="0 0 300 218" width="100%" height="100%" overflow="visible"><rect x="4" y="4" width="292" height="210" rx="6" fill="${CRED}"/><rect x="84" y="4" width="54" height="210" fill="#fff"/><rect x="4" y="82" width="292" height="54" fill="#fff"/><rect x="98" y="4" width="26" height="210" fill="${NBLUE}"/><rect x="4" y="96" width="292" height="26" fill="${NBLUE}"/><rect x="4" y="4" width="292" height="210" rx="6" fill="none" stroke="${K}" stroke-width="8"/></svg>`;

// crown, viewBox 220 x 130
const CROWN = `<svg viewBox="0 0 220 130" width="100%" height="100%" overflow="visible"><path d="M14 120 L4 30 L60 70 L110 6 L160 70 L216 30 L206 120 Z" fill="${YEL}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/><rect x="14" y="96" width="192" height="26" rx="6" fill="${GOLD}" stroke="${K}" stroke-width="7"/><circle cx="60" cy="109" r="7" fill="${CRED}"/><circle cx="110" cy="109" r="7" fill="${NBLUE}"/><circle cx="160" cy="109" r="7" fill="${CRED}"/><circle cx="4" cy="30" r="9" fill="#fff" stroke="${K}" stroke-width="5"/><circle cx="110" cy="6" r="10" fill="#fff" stroke="${K}" stroke-width="5"/><circle cx="216" cy="30" r="9" fill="#fff" stroke="${K}" stroke-width="5"/></svg>`;

// ---------- common CSS ----------
const STK = `filter: drop-shadow(5px 0 0 #fff) drop-shadow(-5px 0 0 #fff) drop-shadow(0 5px 0 #fff) drop-shadow(0 -5px 0 #fff) drop-shadow(0 14px 0 rgba(0,0,0,.35));`;
const FONTFACE = `@font-face{font-family:'Lilita One';src:url('assets/fonts/LilitaOne-latin.woff2') format('woff2');font-weight:400;font-style:normal;font-display:block;}`;
const abs = (l, t, w, h) => `position:absolute;left:${l}px;top:${t}px;width:${w}px;${h != null ? `height:${h}px;` : ""}`;
const LBL = (size) => `font-family:'Lilita One';font-size:${size}px;line-height:1;color:#fff;-webkit-text-stroke:12px ${K};paint-order:stroke fill;text-shadow:0 8px 0 rgba(0,0,0,.35);white-space:nowrap;`;

const EXD = 0.1; // exit: shrink + dim over the last 3 frames, gone exactly at the cut (no near-empty frame)
function scene(id, title, start, dur, css, body, js, opts = {}) {
  const exit = opts.exit !== false, kb = opts.kb !== false;
  const html = `<template>
  <style>
    ${FONTFACE}
    #root { position: absolute; inset: 0; overflow: hidden; }
    #${id}-out, #${id}-kb { position: absolute; inset: 0; transform-origin: 540px 1100px; }
    .${id}-stk { ${STK} }
    ${css}
  </style>
  <div id="root" data-composition-id="${id}" data-width="1080" data-height="1920" data-layout-allow-overflow>
    <div id="${id}-out"><div id="${id}-kb">
${body}
    </div></div>
  </div>
  <script>
    (function () {
      const tl = gsap.timeline({ paused: true });
      // visible from the cut frame on (no delayed fade-in), so no cut shows an empty picture
${kb ? `      // slow drift so the frame never stands still
      tl.fromTo("#${id}-kb", { scale: 1 }, { scale: 1.04, duration: ${dur}, ease: "none" }, 0);` : ""}
${js}
${exit ? `      // exit: the old picture is gone exactly at the cut, the next one is there in the same frame
      tl.to("#${id}-out", { keyframes: { opacity: [1, 1, 0.5], scale: [1, 0.95, 0.88] }, duration: ${EXD}, ease: "none" }, ${+(dur - EXD).toFixed(3)});` : ""}
      window.__timelines["${id}"] = tl;
    })();
  </script>
</template>
`;
  fs.writeFileSync(path.join(OUT, "compositions", `${id}.html`), html);
  return { id, title, start, dur };
}
const shake = (sel, at, a = 18, d = 0.32) => `      tl.to("${sel}", { keyframes: { x: [0, ${-a}, ${+(a * 0.8).toFixed(1)}, ${+(-a * 0.5).toFixed(1)}, ${+(a * 0.3).toFixed(1)}, 0], y: [0, ${+(a * 0.5).toFixed(1)}, ${+(-a * 0.4).toFixed(1)}, ${+(a * 0.2).toFixed(1)}, 0, 0] }, duration: ${d}, ease: "none" }, ${at});`;
const wave = (sel, at, n, amp = 5) => `      tl.to("${sel}", { keyframes: { skewY: [0, ${amp}, ${-amp * 0.8}, ${amp * 0.6}, 0], scaleX: [1, 0.94, 1, 0.96, 1] }, duration: 0.9, ease: "none", repeat: ${n - 1} }, ${at});`;
// sparkle burst: n sparkles fly out from a point and fade
function burst(p, n, cx, cy, size, rad, seed) {
  const RS = mulberry32(seed);
  const items = Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2 + RS() * 0.5; const rr = rad * (0.7 + RS() * 0.5); return { x: Math.round(Math.cos(a) * rr), y: Math.round(Math.sin(a) * rr), s: Math.round(size * (0.7 + RS() * 0.6)) }; });
  const html = items.map((it, i) => `<div id="${p}-${i}" class="spk" style="left:${cx - it.s / 2}px;top:${cy - it.s / 2}px;width:${it.s}px;height:${it.s}px;">${SPARK(i % 3 ? YEL : "#fff")}</div>`).join("");
  const js = (at) => items.map((it, i) => `      tl.fromTo("#${p}-${i}", { x: 0, y: 0, scale: 0, rotation: 0, opacity: 1 }, { keyframes: { x: [0, ${it.x}], y: [0, ${it.y}], scale: [0, 1.1, 0], rotation: [0, 120] }, duration: 0.6, ease: "power1.out", immediateRender: true }, ${at});`).join("\n");
  return { html, js };
}

// ================= timing (one row per caption / scene) =================
const C = {
  c01: [0, 2.6], c02: [2.6, 4.65], c03: [4.65, 7.1], c04: [7.1, 9.55], c05: [9.55, 11.6], c06: [11.6, 14.05], c07: [14.05, 15.8],
  c08: [15.8, 18.65], c09: [18.65, 21.1], c10: [21.1, 22.85], c11: [22.85, 24.7], c12: [24.7, 27.55], c13: [27.55, 30.0],
  c14: [30.0, 31.65], c15: [31.65, 34.15], c16: [34.15, 36.6], c17: [36.6, 39.1], c18: [39.1, DUR],
};
const T = {
  hook: [0, 2.6], befo: [2.6, 4.65], zoo: [4.65, 7.1], garde: [7.1, 9.55], norw: [9.55, 11.6], urk: [11.6, 14.05], mask: [14.05, 15.8],
  leiter: [15.8, 24.7], wappen: [24.7, 27.55], insp: [27.55, 30.0], trom: [30.0, 31.65], dritte: [31.65, 36.6], frage: [36.6, DUR],
};
const S = (k) => [T[k][0], +(T[k][1] - T[k][0]).toFixed(2)];
const scenes = [];

// ================= HOOK picture (frame 0 = thumbnail motif): the knighted king penguin with a tiny sword and a medal =================
const HP = { l: 390, t: 830, w: 393, h: 563 }; // penguin box (scale 1.31)
const hookCss = (p) => `
   #${p}-glow{${abs(170, 760, 840, 620)}border-radius:50%;background:radial-gradient(circle,rgba(255,210,63,.40) 0%,rgba(255,210,63,.13) 42%,rgba(255,210,63,0) 68%);}
   #${p}-pg{${abs(HP.l, HP.t, HP.w, HP.h)}transform-origin:50% 100%;}
   #${p}-ring{${abs(300, 1352, 560, 44)}border-radius:50%;background:radial-gradient(ellipse,rgba(10,15,34,.45),rgba(10,15,34,0) 70%);}
   .spk{position:absolute;}`;
const hookSp = [[300, 905, 74], [214, 1010, 52], [356, 1068, 44]];
const hookBody = (p) => `      <div id="${p}-glow"></div>
      <div id="${p}-ring"></div>
      <div id="${p}-pg" class="${p}-stk">${PENG(p, { sword: true, medal: true, flipL: 96 })}</div>
${hookSp.map(([x, y, s], i) => `      <div id="${p}-sp${i}" class="spk" style="left:${x - s / 2}px;top:${y - s / 2}px;width:${s}px;height:${s}px;">${SPARK(i ? "#fff" : YEL)}</div>`).join("\n")}`;
// idle motion that starts and ends in the frame-0 state (used by hook and loop scene)
const hookIdle = (p, t0, d) => {
  const n = Math.max(1, Math.floor(d / 0.9));
  return `      tl.to("#${p}-glow", { keyframes: { scale: [1, 1.07, 1], opacity: [1, 0.75, 1] }, duration: ${+(d / 2).toFixed(3)}, ease: "sine.inOut", repeat: 1 }, ${t0});
${hookSp.map((_, i) => `      tl.to("#${p}-sp${i}", { keyframes: { scale: [1, 0.55, 1], rotation: [0, 45, 90] }, duration: ${+(d / n).toFixed(3)}, ease: "sine.inOut", repeat: ${n - 1} }, ${t0});`).join("\n")}`;
};
{
  const p = "hook";
  const [s, d] = S(p);
  scenes.push(scene(p, "Hook: Ritter-Pinguin", s, d, hookCss(p), hookBody(p),
    `      // frame 0 already shows the full motif (thumbnail picture)
      gsap.set("#hook-fL", { svgOrigin: "58 172" }); gsap.set("#hook-med", { svgOrigin: "150 182" });
${hookIdle(p, 0, d)}
      // 0.35 s: the knighting gesture, the sword taps twice
      tl.to("#hook-fL", { keyframes: { rotation: [0, -14, 6, -10, 0] }, duration: 0.9, ease: "sine.inOut" }, 0.35);
      tl.to("#hook-pg", { keyframes: { scaleY: [1, 0.96, 1.03, 1], scaleX: [1, 1.03, 0.99, 1] }, duration: 0.4, ease: "none" }, 0.35);
      tl.to("#hook-med", { keyframes: { rotation: [0, 10, -8, 5, 0] }, duration: 1.1, ease: "sine.inOut" }, 0.5);
      tl.to("#hook-pup", { keyframes: { x: [0, -6, -6, 0] }, duration: 1.2, ease: "sine.inOut" }, 1.2);`));
}

// ================= BEFOERDERT: epaulette, stars multiply (2.6 - 4.65) =================
{
  const p = "befo";
  const [s, d] = S(p);
  const fr = Array.from({ length: 15 }, (_, i) => `<rect x="${44 + i * 40}" y="196" width="22" height="${90 + (i % 2) * 14}" rx="11" fill="${GOLD}" stroke="${K}" stroke-width="5"/>`).join("");
  const slots = [[190, 108], [330, 108], [470, 108], [610, 108]];
  scenes.push(scene(p, "Befoerdert: Schulterklappe", s, d,
    `#befo-ep{${abs(130, 880, 820, 330)}transform-origin:50% 40%;}
     .befo-st{position:absolute;width:118px;height:118px;}
     #befo-glow{${abs(100, 760, 880, 600)}border-radius:50%;background:radial-gradient(circle,rgba(255,210,63,.30),rgba(255,210,63,0) 66%);}
     #befo-shine{position:absolute;left:0;top:0;width:90px;height:240px;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.55),rgba(255,255,255,0));transform:skewX(-20deg);}
     #befo-clip{position:absolute;left:30px;top:20px;width:740px;height:176px;border-radius:88px;overflow:hidden;}
     .spk{position:absolute;}`,
    `      <div id="befo-glow"></div>
      <div id="befo-ep" class="befo-stk">
        <svg viewBox="0 0 820 330" width="820" height="330" overflow="visible">
          ${fr}
          <rect x="30" y="20" width="740" height="176" rx="88" fill="${NAVY}" stroke="${K}" stroke-width="10"/>
          <rect x="52" y="40" width="696" height="136" rx="68" fill="none" stroke="${GOLD}" stroke-width="10"/>
          <circle cx="706" cy="108" r="32" fill="${YEL}" stroke="${K}" stroke-width="7"/><circle cx="706" cy="108" r="14" fill="${GOLD}"/>
        </svg>
        <div id="befo-clip"><div id="befo-shine"></div></div>
${slots.map(([x, y], i) => `        <div id="befo-s${i}" class="befo-st" style="left:${x - 59}px;top:${y - 59}px;">${STAR("#E9EEF5")}</div>`).join("\n")}
      </div>
      ${burst("befo-b", 8, 540, 990, 54, 260, 7).html}`,
    `      tl.fromTo("#befo-ep", { scale: 0.8, rotation: -6 }, { scale: 1, rotation: 0, duration: 0.36, ease: "back.out(1.6)" }, 0);
      tl.fromTo("#befo-glow", { opacity: 0.3, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }, 0);
      // stars multiply: 1, 2, 3, 4
${slots.map((_, i) => `      tl.fromTo("#befo-s${i}", { scale: ${i ? 0 : 0.5}, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.24, ease: "back.out(3)" }, ${i ? +(0.45 + i * 0.32).toFixed(2) : 0.05});`).join("\n")}
      tl.to("#befo-ep", { keyframes: { y: [0, -14, 0] }, duration: 0.22, ease: "power1.out", repeat: 3 }, 0.75);
      tl.fromTo("#befo-shine", { x: -120 }, { x: 820, duration: 0.6, ease: "power1.inOut" }, 1.5);
${burst("befo-b", 8, 540, 990, 54, 260, 7).js(1.5)}
      tl.to(["#befo-s0", "#befo-s1", "#befo-s2", "#befo-s3"], { keyframes: { scale: [1, 1.15, 1] }, duration: 0.3, ease: "sine.inOut", stagger: 0.06 }, 1.55);`));
}

// ================= ZOO: gate silhouette with EDINBURGH sign, doors open, a small penguin peeks (4.65 - 7.1) =================
{
  const p = "zoo";
  const [s, d] = S(p);
  const bars = (x0, x1) => { let o = ""; for (let x = x0; x <= x1; x += 38) o += `<rect x="${x}" y="0" width="12" height="380" rx="5" fill="#2C3650" stroke="${K}" stroke-width="5"/>`; return o; };
  const door = (id, left, flip) => `<div id="${id}" class="zoo-door" style="left:${left}px;transform-origin:${flip ? "100%" : "0%"} 50%;"><svg viewBox="0 0 230 380" width="230" height="380" overflow="visible">
      ${bars(12, 206)}<rect x="0" y="20" width="230" height="16" rx="6" fill="#2C3650" stroke="${K}" stroke-width="5"/><rect x="0" y="190" width="230" height="16" rx="6" fill="#2C3650" stroke="${K}" stroke-width="5"/><rect x="0" y="340" width="230" height="16" rx="6" fill="#2C3650" stroke="${K}" stroke-width="5"/>
      <circle cx="115" cy="112" r="34" fill="none" stroke="${K}" stroke-width="13"/><circle cx="115" cy="112" r="34" fill="none" stroke="${GOLD}" stroke-width="6"/>
      <circle cx="115" cy="272" r="34" fill="none" stroke="${K}" stroke-width="13"/><circle cx="115" cy="272" r="34" fill="none" stroke="${GOLD}" stroke-width="6"/></svg></div>`;
  const pillar = (x) => `<rect x="${x}" y="200" width="118" height="440" fill="#6E7B93" stroke="${K}" stroke-width="8"/><path d="M${x} 300 H${x + 118} M${x} 400 H${x + 118} M${x} 500 H${x + 118} M${x + 59} 200 V300 M${x + 30} 300 V400 M${x + 88} 300 V400 M${x + 59} 400 V500 M${x + 30} 500 V640 M${x + 88} 500 V640" stroke="#4E5A72" stroke-width="6"/><rect x="${x - 14}" y="176" width="146" height="34" rx="8" fill="#8A96AC" stroke="${K}" stroke-width="7"/><circle cx="${x + 59}" cy="148" r="28" fill="#8A96AC" stroke="${K}" stroke-width="7"/>`;
  scenes.push(scene(p, "Zoo-Tor Edinburgh", s, d,
    `#zoo-gate{${abs(160, 745, 760, 640)}transform-origin:50% 100%;}
     .zoo-door{position:absolute;top:258px;width:230px;height:380px;}
     #zoo-path{${abs(310, 1250, 460, 150)}}
     #zoo-pg{${abs(316, 360, 128, 184)}transform-origin:50% 100%;}
     #zoo-sign{${abs(140, 0, 480, 128)}transform-origin:50% 0%;}
     #zoo-board{position:absolute;inset:0;border-radius:24px;background:linear-gradient(#E0AA62,#B87E3C);border:10px solid ${K};box-shadow:0 12px 0 rgba(0,0,0,.35);}
     #zoo-txt{position:absolute;left:0;right:0;top:20px;text-align:center;${LBL(78)}color:${YEL};}
     .zoo-ch{position:absolute;top:-36px;width:8px;height:46px;background:#9AA6BA;border:3px solid ${K};}`,
    `      <div id="zoo-gate" class="zoo-stk">
        <svg viewBox="0 0 760 640" width="760" height="640" overflow="visible" style="position:absolute;left:0;top:0;">
          <path d="M128 640 L230 500 L530 500 L632 640 Z" fill="#9C8A6E" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>
          <path d="M118 250 Q380 70 642 250" fill="none" stroke="${K}" stroke-width="26"/><path d="M118 250 Q380 70 642 250" fill="none" stroke="#3A4664" stroke-width="14"/>
          <path d="M118 290 Q380 130 642 290" fill="none" stroke="${K}" stroke-width="16"/><path d="M118 290 Q380 130 642 290" fill="none" stroke="${GOLD}" stroke-width="6"/>
          ${pillar(0)}${pillar(642)}
        </svg>
        <div id="zoo-pg">${PENG("zoo")}</div>
        ${door("zoo-dL", 118, false)}${door("zoo-dR", 412, true)}
        <div id="zoo-sign"><div class="zoo-ch" style="left:90px"></div><div class="zoo-ch" style="right:90px"></div><div id="zoo-board"></div><div id="zoo-txt">EDINBURGH</div></div>
      </div>`,
    `      tl.fromTo("#zoo-gate", { scale: 0.82, y: 30 }, { scale: 1, y: 0, duration: 0.38, ease: "back.out(1.5)" }, 0);
      tl.fromTo("#zoo-sign", { rotation: -14 }, { keyframes: { rotation: [-14, 8, -5, 3, 0] }, duration: 1.0, ease: "none" }, 0.1);
      // doors swing open, the little penguin steps forward
      tl.to("#zoo-dL", { scaleX: 0.18, duration: 0.5, ease: "back.out(1.2)" }, 0.75);
      tl.to("#zoo-dR", { scaleX: 0.18, duration: 0.5, ease: "back.out(1.2)" }, 0.8);
      tl.fromTo("#zoo-pg", { scale: 0.6, y: -40 }, { scale: 1.3, y: 60, duration: 1.0, ease: "power1.out" }, 1.05);
      tl.to("#zoo-pg", { keyframes: { rotation: [0, 7, -7, 7, -7, 0] }, duration: 1.0, ease: "none" }, 1.05);
      tl.to("#zoo-sign", { keyframes: { rotation: [0, 4, -3, 0] }, duration: 0.6, ease: "sine.inOut" }, 1.55);`));
}

// ================= GARDE: three guards with bearskin hats march in (7.1 - 9.55) =================
{
  const p = "garde";
  const [s, d] = S(p);
  const G = [["garde-g0", 120], ["garde-g1", 410], ["garde-g2", 700]];
  scenes.push(scene(p, "Garde marschiert", s, d,
    `.garde-g{position:absolute;top:900px;width:220px;height:518px;transform-origin:50% 100%;}
     #garde-row{position:absolute;inset:0;}`,
    `      <div id="garde-row">
${G.map(([id, x]) => `        <div id="${id}" class="garde-g garde-stk" style="left:${x}px;">${GUARD(id)}</div>`).join("\n")}
      </div>`,
    `      ${G.map(([id]) => guardOrigins(id)).join(" ")}
      // they march in from the left (already on screen at the cut) and step on the spot
      tl.fromTo("#garde-row", { x: -330 }, { x: 0, duration: 1.5, ease: "power1.out" }, 0);
${G.map(([id], i) => march(id, +(i * 0.06).toFixed(2), 4)).join("\n")}
${G.map(([id], i) => `      tl.to("#${id}", { keyframes: { y: [0, -16, 0] }, duration: 0.25, ease: "sine.inOut", repeat: 7 }, ${+(i * 0.06).toFixed(2)});`).join("\n")}
      // halt: stand to attention
      tl.to([${G.map(([id]) => `"#${id}"`).join(", ")}], { keyframes: { scaleY: [1, 1.06, 1] }, duration: 0.3, ease: "power1.out", stagger: 0.07 }, 2.05);`));
}

// ================= NORWEGEN: simplified flag rises and waves (9.55 - 11.6) =================
{
  const p = "norw";
  const [s, d] = S(p);
  scenes.push(scene(p, "Norwegen-Fahne", s, d,
    `#norw-pole{${abs(196, 720, 22, 720)}background:linear-gradient(90deg,#8A96A6,#E6ECF2 45%,#8A96A6);border:5px solid ${K};border-radius:8px;}
     #norw-ball{${abs(184, 690, 46, 46)}border-radius:50%;background:${YEL};border:6px solid ${K};}
     #norw-flag{${abs(214, 740, 620, 450)}transform-origin:0% 50%;}
     #norw-base{${abs(150, 1404, 114, 36)}border-radius:10px;background:#6E7B93;border:6px solid ${K};}
     #norw-glow{${abs(160, 700, 820, 640)}border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.22),rgba(255,255,255,0) 64%);}
     .spk{position:absolute;}`,
    `      <div id="norw-glow"></div>
      <div id="norw-pole"></div><div id="norw-ball"></div><div id="norw-base"></div>
      <div id="norw-flag" class="norw-stk">${FLAG_NO}</div>
      ${burst("norw-b", 7, 560, 960, 50, 300, 11).html}`,
    `      tl.fromTo("#norw-flag", { y: 160, scaleY: 0.75 }, { y: 0, scaleY: 1, duration: 0.45, ease: "back.out(1.5)" }, 0);
      tl.fromTo("#norw-glow", { opacity: 0.4 }, { opacity: 1, duration: 0.4 }, 0);
${wave("#norw-flag", 0.45, 2, 5)}
${burst("norw-b", 7, 560, 960, 50, 300, 11).js(0.5)}`));
}

// ================= URKUNDE: certificate, a footprint stamp slams down (11.6 - 14.05) =================
{
  const p = "urk";
  const [s, d] = S(p);
  const FOOT = `<svg viewBox="0 0 200 220" width="100%" height="100%" overflow="visible"><g fill="#2B4FB0" opacity=".9"><path d="M100 120 L96 20 Q100 4 108 20 L112 120 Z"/><path d="M96 124 L30 54 Q22 40 38 44 L108 116 Z"/><path d="M112 124 L178 54 Q186 40 170 44 L100 116 Z"/><ellipse cx="104" cy="150" rx="34" ry="44"/></g></svg>`;
  scenes.push(scene(p, "Adoptions-Urkunde", s, d,
    `#urk-paper{${abs(240, 718, 600, 680)}transform-origin:50% 100%;}
     #urk-sheet{position:absolute;left:0;top:40px;width:600px;height:600px;background:#F6E9C8;border:10px solid ${K};border-radius:14px;}
     .urk-roll{position:absolute;left:-20px;width:640px;height:64px;border-radius:32px;background:linear-gradient(#E9D3A0,#C9AA6C);border:10px solid ${K};}
     .urk-ln{position:absolute;left:70px;height:22px;border-radius:11px;background:#C9B48A;}
     #urk-head{position:absolute;left:110px;top:110px;width:380px;height:40px;border-radius:20px;background:#8E6B3C;}
     #urk-foot{position:absolute;left:300px;top:390px;width:200px;height:220px;transform-origin:50% 50%;}
     #urk-stamp{${abs(560, 798, 200, 300)}transform-origin:50% 100%;}
     #urk-seal{position:absolute;left:60px;top:470px;width:130px;height:170px;}`,
    `      <div id="urk-paper" class="urk-stk">
        <div id="urk-sheet">
          <div id="urk-head"></div>
          <div class="urk-ln" style="top:200px;width:460px"></div><div class="urk-ln" style="top:250px;width:400px"></div><div class="urk-ln" style="top:300px;width:440px"></div>
          <div id="urk-seal"><svg viewBox="0 0 130 170" width="130" height="170" overflow="visible"><path d="M40 90 L22 166 L52 146 L64 168 L74 90 Z M90 90 L108 166 L78 146 L66 168 L56 90 Z" fill="${NBLUE}" stroke="${K}" stroke-width="5" stroke-linejoin="round"/><circle cx="65" cy="62" r="54" fill="${CRED}" stroke="${K}" stroke-width="7"/><circle cx="65" cy="62" r="34" fill="none" stroke="#FFB0B8" stroke-width="5" stroke-dasharray="10 8"/></svg></div>
          <div id="urk-foot">${FOOT}</div>
        </div>
        <div class="urk-roll" style="top:0"></div><div class="urk-roll" style="top:616px"></div>
      </div>
      <div id="urk-stamp"><svg viewBox="0 0 200 300" width="200" height="300" overflow="visible"><rect x="70" y="0" width="60" height="150" rx="26" fill="#B07A3E" stroke="${K}" stroke-width="8"/><rect x="20" y="146" width="160" height="60" rx="14" fill="#8A5A2B" stroke="${K}" stroke-width="8"/><rect x="10" y="200" width="180" height="40" rx="8" fill="#2B4FB0" stroke="${K}" stroke-width="8"/></svg></div>`,
    `      tl.fromTo("#urk-paper", { scale: 0.8, rotation: -5 }, { scale: 1, rotation: 0, duration: 0.38, ease: "back.out(1.4)" }, 0);
      tl.set("#urk-foot", { opacity: 0 }, 0);
      tl.fromTo("#urk-stamp", { opacity: 0, x: 120, y: -40, rotation: 20 }, { opacity: 1, x: 0, y: 0, rotation: 0, duration: 0.35, ease: "power2.out" }, 0.3);
      // slam: the stamp comes down onto the paper, lifts again, the footprint stays
      tl.to("#urk-stamp", { x: -230, y: 260, rotation: -12, duration: 0.18, ease: "power3.in" }, 0.8);
      tl.set("#urk-foot", { opacity: 1 }, 0.98);
      tl.fromTo("#urk-foot", { scale: 1.25, rotation: -12 }, { scale: 1, rotation: -12, duration: 0.2, ease: "back.out(3)", immediateRender: false }, 0.98);
${shake("#urk-paper", 0.98, 12, 0.3)}
      tl.to("#urk-stamp", { x: 120, y: -30, rotation: 24, opacity: 0, duration: 0.35, ease: "power2.in" }, 1.2);
      tl.to("#urk-seal", { keyframes: { rotation: [0, -8, 6, 0] }, duration: 0.6, ease: "sine.inOut" }, 1.4);`));
}

// ================= MASKOTTCHEN: penguin with mini bearskin hat salutes correctly and hops (14.05 - 15.8) =================
{
  const p = "mask";
  const [s, d] = S(p);
  scenes.push(scene(p, "Maskottchen", s, d,
    `#mask-pg{${abs(250, 860, 384, 550)}transform-origin:50% 100%;}
     #mask-glow{${abs(110, 760, 700, 660)}border-radius:50%;background:radial-gradient(circle,rgba(255,210,63,.32),rgba(255,210,63,0) 64%);}
     .spk{position:absolute;}`,
    `      <div id="mask-glow"></div>
      <div id="mask-pg" class="mask-stk">${PENG("mask", { hat: true })}</div>
      ${burst("mask-b", 6, 442, 900, 50, 230, 3).html}`,
    `      gsap.set("#mask-fL", { svgOrigin: "58 172" }); gsap.set("#mask-hat", { svgOrigin: "150 74" });
      tl.fromTo("#mask-pg", { scale: 0.8 }, { scale: 1, duration: 0.36, ease: "back.out(1.6)" }, 0);
      tl.fromTo("#mask-hat", { scale: 0.7 }, { scale: 1, duration: 0.3, ease: "back.out(2.6)" }, 0.12);
      // proper salute with the flipper on the other side than Klotz's
      tl.to("#mask-fL", { rotation: 186, duration: 0.3, ease: "back.out(1.6)" }, 0.45);
      tl.to("#mask-pg", { keyframes: { y: [0, -60, 0, -40, 0] }, duration: 0.7, ease: "none" }, 0.8);
${burst("mask-b", 6, 442, 900, 50, 230, 3).js(0.5)}
      tl.to("#mask-pup", { keyframes: { x: [0, 8, 8, 0] }, duration: 0.6, ease: "sine.inOut" }, 0.9);`));
}

// ================= LEITER: career ladder, the penguin hops up rung by rung; knight, brigadier, major general (15.8 - 24.7) =================
{
  const p = "leiter";
  const [s, d] = S(p);
  const RUNG = [1380, 1260, 1140, 1020], LT = 975;
  const PW = 142, PH = 204; // small penguin
  const L9 = +(C.c09[0] - s).toFixed(2), L10 = +(C.c10[0] - s).toFixed(2), L11 = +(C.c11[0] - s).toFixed(2);
  const rungs = RUNG.map((y) => `<rect x="0" y="${y - LT - 10}" width="280" height="22" rx="9" fill="#C98A46" stroke="${K}" stroke-width="7"/>`).join("");
  const hop = (from, to, at) => `      tl.to("#leiter-pw", { keyframes: { y: [${RUNG[from] - RUNG[0]}, ${RUNG[to] - RUNG[0] - 34}, ${RUNG[to] - RUNG[0]}] }, duration: 0.42, ease: "power1.inOut" }, ${at});
      tl.to("#leiter-pg", { keyframes: { scaleY: [1, 0.86, 1.08, 1], scaleX: [1, 1.08, 0.96, 1] }, duration: 0.5, ease: "none" }, ${+(at - 0.04).toFixed(2)});`;
  const b1 = burst("leiter-k", 7, 600, RUNG[1] - 140, 46, 150, 21), b2 = burst("leiter-m", 8, 220, 1000, 46, 170, 31);
  scenes.push(scene(p, "Karriere-Leiter", s, d,
    `#leiter-lad{${abs(400, LT, 280, 1420 - LT)}transform-origin:50% 100%;}
     #leiter-pw{${abs(540 - PW / 2, RUNG[0] - PH + 6, PW, PH)}}
     #leiter-pg{position:absolute;inset:0;transform-origin:50% 100%;}
     #leiter-plq{${abs(110, 830, 230, 430)}transform-origin:50% 100%;}
     .leiter-st{position:absolute;left:52px;width:126px;height:126px;}
     #leiter-sword{${abs(585, RUNG[1] - 215, 300, 80)}transform-origin:100% 50%;}
     .spk{position:absolute;}`,
    `      <div id="leiter-plq" class="leiter-stk"><svg viewBox="0 0 230 430" width="230" height="430" overflow="visible"><path d="M10 10 L220 10 L220 300 Q220 390 115 424 Q10 390 10 300 Z" fill="${NAVY}" stroke="${K}" stroke-width="10" stroke-linejoin="round"/><path d="M28 28 L202 28 L202 296 Q202 372 115 402 Q28 372 28 296 Z" fill="none" stroke="${GOLD}" stroke-width="7"/><path d="M${115 - 40} 112 h80 M${115 - 40} 262 h80" stroke="#2E4CA6" stroke-width="0"/></svg>
        <div id="leiter-s0" class="leiter-st" style="top:70px;">${STAR("#E9EEF5")}</div>
        <div id="leiter-s1" class="leiter-st" style="top:224px;">${STAR("#E9EEF5")}</div>
      </div>
      <div id="leiter-lad" class="leiter-stk"><svg viewBox="0 0 280 ${1420 - LT}" width="280" height="${1420 - LT}" overflow="visible">
        <rect x="0" y="0" width="30" height="${1420 - LT}" rx="12" fill="#B07A3E" stroke="${K}" stroke-width="8"/><rect x="250" y="0" width="30" height="${1420 - LT}" rx="12" fill="#B07A3E" stroke="${K}" stroke-width="8"/>
        ${rungs}</svg></div>
      <div id="leiter-pw"><div id="leiter-pg" class="leiter-stk">${PENG("leiter", { medal: true })}</div></div>
      <div id="leiter-sword"><svg viewBox="0 0 300 80" width="300" height="80" overflow="visible"><path d="M10 32 L190 32 L214 40 L190 48 L10 48 Z" fill="#E6ECF2" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><path d="M24 40 H180" stroke="#A9B6C6" stroke-width="4"/><rect x="196" y="6" width="20" height="68" rx="8" fill="${GOLD}" stroke="${K}" stroke-width="5"/><rect x="214" y="28" width="60" height="24" rx="10" fill="${CRED}" stroke="${K}" stroke-width="5"/><circle cx="282" cy="40" r="13" fill="${GOLD}" stroke="${K}" stroke-width="5"/></svg></div>
      ${b1.html}${b2.html}`,
    `      gsap.set("#leiter-med", { opacity: 0, scale: 0, svgOrigin: "150 236" });
      tl.set(["#leiter-s0", "#leiter-s1", "#leiter-sword"], { opacity: 0 }, 0);
      tl.fromTo("#leiter-lad", { scaleY: 0.82 }, { scaleY: 1, duration: 0.36, ease: "back.out(1.5)" }, 0);
      tl.fromTo("#leiter-plq", { scale: 0.8 }, { scale: 1, duration: 0.34, ease: "back.out(1.6)" }, 0.05);
      tl.fromTo("#leiter-pw", { y: 0 }, { y: 0, duration: 0.01 }, 0);
      // the penguin waddles on the bottom rung, then hops up
      tl.to("#leiter-pg", { keyframes: { rotation: [0, 8, -8, 0] }, duration: 0.5, ease: "none" }, 0.2);
${hop(0, 1, 0.8)}
      tl.to("#leiter-pg", { keyframes: { rotation: [0, 7, -7, 0] }, duration: 0.5, ease: "none" }, 1.6);
      // ${L9}: 2008 knight - the ceremonial sword taps the shoulder, sparkle, medal
      tl.to("#leiter-pg", { keyframes: { scaleY: [1, 0.92, 1] }, duration: 0.3, ease: "sine.inOut" }, ${L9 + 0.1});
      tl.set("#leiter-sword", { opacity: 1 }, ${L9 + 0.35});
      tl.fromTo("#leiter-sword", { x: 360, rotation: 0 }, { x: 0, rotation: 0, duration: 0.35, ease: "back.out(1.3)", immediateRender: false }, ${L9 + 0.35});
      tl.to("#leiter-sword", { keyframes: { rotation: [0, -14, 0, -14, 0] }, duration: 0.7, ease: "power1.inOut" }, ${L9 + 0.75});
${b1.js(L9 + 0.9)}
      tl.to("#leiter-med", { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2.6)" }, ${L9 + 1.0});
      tl.to("#leiter-sword", { x: 360, duration: 0.3, ease: "power2.in" }, ${L9 + 1.6});
      tl.set("#leiter-sword", { opacity: 0 }, ${L9 + 1.9});
      // ${L10}: 2016 brigadier - one rung higher, the first star
${hop(1, 2, L10 + 0.05)}
      tl.set("#leiter-s0", { opacity: 1 }, ${L10 + 0.4});
      tl.fromTo("#leiter-s0", { scale: 0, rotation: -120 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(3)", immediateRender: false }, ${L10 + 0.4});
${shake("#leiter-plq", L10 + 0.6, 10, 0.28)}
      // ${L11}: 2023 major general - top rung, the second star, both sparkle
${hop(2, 3, L11 + 0.05)}
      tl.set("#leiter-s1", { opacity: 1 }, ${L11 + 0.4});
      tl.fromTo("#leiter-s1", { scale: 0, rotation: -120 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(3)", immediateRender: false }, ${L11 + 0.4});
${b2.js(L11 + 0.55)}
      tl.to(["#leiter-s0", "#leiter-s1"], { keyframes: { scale: [1, 1.2, 1], rotation: [0, 20, 0] }, duration: 0.35, ease: "sine.inOut", repeat: 1, stagger: 0.1 }, ${L11 + 0.75});
      tl.to("#leiter-pg", { keyframes: { rotation: [0, -6, 6, 0] }, duration: 0.5, ease: "none" }, ${L11 + 1.1});`));
}

// ================= WAPPEN: coat of arms with an ice island, crown on top (24.7 - 27.55) =================
{
  const p = "wappen";
  const [s, d] = S(p);
  const SH = "M20 20 L480 20 L480 300 Q480 500 250 600 Q20 500 20 300 Z";
  const leaf = (x, y, rot) => `<ellipse cx="${x}" cy="${y}" rx="34" ry="15" transform="rotate(${rot} ${x} ${y})" fill="#3FA34D" stroke="${K}" stroke-width="5"/>`;
  const laurel = (flip) => `<svg viewBox="0 0 140 520" width="140" height="520" overflow="visible"><g${flip ? ' transform="translate(140 0) scale(-1 1)"' : ""}><path d="M110 500 Q20 300 100 40" fill="none" stroke="#2E7A38" stroke-width="10" stroke-linecap="round"/>${[80, 150, 220, 290, 360, 430].map((y, i) => leaf(i % 2 ? 98 : 50, y, i % 2 ? 40 : -40)).join("")}</g></svg>`;
  scenes.push(scene(p, "Wappen Bouvetinsel", s, d,
    `#wappen-sh{${abs(309, 836, 462, 564)}transform-origin:50% 50%;}
     #wappen-cr{${abs(440, 750, 200, 118)}transform-origin:50% 100%;}
     .wappen-lr{position:absolute;top:870px;width:140px;height:520px;}
     .spk{position:absolute;}`,
    `      <div id="wappen-lL" class="wappen-lr" style="left:150px;">${laurel(false)}</div>
      <div id="wappen-lR" class="wappen-lr" style="left:790px;">${laurel(true)}</div>
      <div id="wappen-sh" class="wappen-stk"><svg viewBox="0 0 500 610" width="462" height="564" overflow="visible">
        <defs><clipPath id="wappen-clip"><path d="${SH}"/></clipPath></defs>
        <g clip-path="url(#wappen-clip)">
          <rect x="0" y="0" width="500" height="620" fill="#2B4FB0"/>
          <g fill="#fff"><path transform="translate(80 70) scale(.5)" d="${STAR_D}"/><path transform="translate(370 60) scale(.4)" d="${STAR_D}"/><path transform="translate(300 130) scale(.3)" d="${STAR_D}"/></g>
          <g id="wappen-isl"><path d="M70 420 L150 330 L200 350 L250 230 L310 330 L360 320 L440 420 Z" fill="#F4FAFF" stroke="${K}" stroke-width="8" stroke-linejoin="round"/><path d="M250 230 L270 300 L240 340 M150 330 L170 380" stroke="#9FD6F5" stroke-width="8" fill="none" stroke-linecap="round"/></g>
          <rect x="0" y="410" width="500" height="220" fill="#173C8C"/>
          <path id="wappen-wv" d="M-60 440 q30 -18 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#9FD6F5" stroke-width="8" stroke-linecap="round"/>
          <path d="M-60 500 q30 -18 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#5E8FD8" stroke-width="7" stroke-linecap="round"/>
          <rect id="wappen-shine" x="-140" y="0" width="70" height="620" fill="#fff" opacity=".35" transform="skewX(-18)"/>
        </g>
        <path d="${SH}" fill="none" stroke="${K}" stroke-width="22" stroke-linejoin="round"/><path d="${SH}" fill="none" stroke="${GOLD}" stroke-width="10" stroke-linejoin="round"/>
      </svg></div>
      <div id="wappen-cr" class="wappen-stk">${CROWN}</div>
      ${burst("wappen-b", 7, 540, 1110, 46, 260, 41).html}`,
    `      tl.fromTo("#wappen-sh", { scale: 0.8, rotation: 6 }, { scale: 1, rotation: 0, duration: 0.38, ease: "back.out(1.5)" }, 0);
      tl.fromTo(["#wappen-lL", "#wappen-lR"], { scaleY: 0.4, opacity: 0.6, transformOrigin: "50% 100%" }, { scaleY: 1, opacity: 1, duration: 0.35, ease: "back.out(1.6)", stagger: 0.05 }, 0.05);
      tl.fromTo("#wappen-isl", { y: 200 }, { y: 0, duration: 0.6, ease: "back.out(1.2)" }, 0.35);
      tl.fromTo("#wappen-wv", { x: 0 }, { x: -120, duration: ${d}, ease: "none" }, 0);
      tl.fromTo("#wappen-cr", { scale: 0, rotation: -20 }, { scale: 1, rotation: 0, duration: 0.32, ease: "back.out(2.6)" }, 0.9);
${burst("wappen-b", 7, 540, 1110, 46, 260, 41).js(1.05)}
      tl.fromTo("#wappen-shine", { x: -140 }, { x: 720, duration: 0.7, ease: "power1.inOut" }, 1.5);
      tl.to("#wappen-cr", { keyframes: { rotation: [0, -6, 5, 0] }, duration: 0.6, ease: "sine.inOut" }, 1.9);`));
}

// ================= INSPEKTION: the guard halts, the penguin inspects them (27.55 - 30.0) =================
{
  const p = "insp";
  const [s, d] = S(p);
  const G = [["insp-g0", 120], ["insp-g1", 330], ["insp-g2", 540]];
  scenes.push(scene(p, "Inspektion", s, d,
    `.insp-g{position:absolute;top:860px;width:150px;height:354px;transform-origin:50% 100%;}
     #insp-row{position:absolute;inset:0;}
     #insp-pw{${abs(780, 1166, 165, 236)}}
     #insp-pg{position:absolute;inset:0;transform-origin:50% 100%;}`,
    `      <div id="insp-row">
${G.map(([id, x]) => `        <div id="${id}" class="insp-g insp-stk" style="left:${x}px;">${GUARD(id)}</div>`).join("\n")}
      </div>
      <div id="insp-pw"><div id="insp-pg" class="insp-stk">${PENG("insp", { medal: true })}</div></div>`,
    `      ${G.map(([id]) => guardOrigins(id)).join(" ")}
      gsap.set("#insp-fR", { svgOrigin: "242 172" });
      tl.fromTo("#insp-row", { x: -220 }, { x: 0, duration: 0.9, ease: "power1.out" }, 0);
${G.map(([id], i) => march(id, +(i * 0.05).toFixed(2), 2)).join("\n")}
      // stand to attention
      tl.to([${G.map(([id]) => `"#${id}"`).join(", ")}], { keyframes: { scaleY: [1, 1.07, 1] }, duration: 0.3, ease: "power1.out", stagger: 0.06 }, 1.0);
      // the penguin waddles past from the right and nods at every guard
      tl.fromTo("#insp-pw", { x: 0 }, { x: -650, duration: ${+(d - 0.35).toFixed(2)}, ease: "none" }, 0.1);
      tl.to("#insp-pg", { keyframes: { rotation: [0, 8, 0, -8, 0] }, duration: 0.5, ease: "none", repeat: ${Math.floor((d - 0.4) / 0.5) - 1} }, 0.1);
      tl.to("#insp-fR", { keyframes: { rotation: [0, -40, 0] }, duration: 0.5, ease: "sine.inOut", repeat: 1 }, 1.1);`));
}

// ================= TROMMEL: drum roll before the twist (30.0 - 31.65) =================
{
  const p = "trom";
  const [s, d] = S(p);
  const zig = Array.from({ length: 7 }, (_, i) => `${40 + i * 60} ${i % 2 ? 300 : 160}`).join(" L");
  const stick = (id, x, rot) => `<div id="${id}" class="trom-stick" style="left:${x}px;transform:rotate(${rot}deg);"><svg viewBox="0 0 40 320" width="40" height="320" overflow="visible"><rect x="12" y="20" width="16" height="290" rx="8" fill="#B07A3E" stroke="${K}" stroke-width="6"/><circle cx="20" cy="20" r="18" fill="#F4EEE0" stroke="${K}" stroke-width="6"/></svg></div>`;
  scenes.push(scene(p, "Trommelwirbel", s, d,
    `#trom-drum{${abs(290, 930, 500, 420)}transform-origin:50% 100%;}
     .trom-stick{position:absolute;top:700px;width:40px;height:320px;transform-origin:50% 100%;}
     #trom-sticks{position:absolute;inset:0;}
     .trom-ln{position:absolute;width:70px;height:16px;border-radius:8px;background:${YEL};border:5px solid ${K};}`,
    `      <div id="trom-drum" class="trom-stk"><svg viewBox="0 0 500 420" width="500" height="420" overflow="visible">
        <path d="M20 90 L20 340 Q250 420 480 340 L480 90 Z" fill="${CRED}" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>
        <path d="M${zig}" fill="none" stroke="${YEL}" stroke-width="10" stroke-linejoin="round"/>
        <path d="M20 120 Q250 200 480 120" fill="none" stroke="${GOLD}" stroke-width="16"/><path d="M20 120 Q250 200 480 120" fill="none" stroke="${K}" stroke-width="5"/>
        <path d="M20 320 Q250 400 480 320" fill="none" stroke="${GOLD}" stroke-width="16"/>
        <ellipse cx="250" cy="90" rx="230" ry="66" fill="#F4EEE0" stroke="${K}" stroke-width="10"/>
      </svg></div>
      <div id="trom-sticks">${stick("trom-sL", 400, -24)}${stick("trom-sR", 640, 24)}</div>
      <div id="trom-l0" class="trom-ln" style="left:200px;top:920px;transform:rotate(-30deg);"></div><div id="trom-l1" class="trom-ln" style="left:810px;top:920px;transform:rotate(30deg);"></div>`,
    `      tl.fromTo("#trom-drum", { scale: 0.8 }, { scale: 1, duration: 0.34, ease: "back.out(1.6)" }, 0);
      tl.fromTo("#trom-sticks", { y: 60 }, { y: 0, duration: 0.3, ease: "back.out(1.6)" }, 0.05);
      // drum roll: sticks alternate fast, the drum vibrates
      tl.to("#trom-sL", { keyframes: { rotation: [-24, -10, -24] }, duration: 0.12, ease: "none", repeat: 9 }, 0.3);
      tl.to("#trom-sR", { keyframes: { rotation: [24, 10, 24] }, duration: 0.12, ease: "none", repeat: 9 }, 0.36);
      tl.to("#trom-drum", { keyframes: { x: [0, -4, 4, -4, 4, 0] }, duration: 0.3, ease: "none", repeat: 3 }, 0.3);
      tl.fromTo(["#trom-l0", "#trom-l1"], { opacity: 0 }, { keyframes: { opacity: [0, 1, 0, 1, 0, 1, 0] }, duration: 1.0, ease: "none" }, 0.35);`));
}

// ================= DRITTE: three penguin silhouettes I, II, III; then the crown wanders on (31.65 - 36.6) =================
{
  const p = "dritte";
  const [s, d] = S(p);
  const L16 = +(C.c16[0] - s).toFixed(2);
  const X = [105, 415, 725], W = 250, H = 358, TOP = 830;
  const crownAt = (i) => [X[i] + W / 2 - 80, TOP - 64];
  const bb = burst("dritte-b", 9, X[2] + W / 2, TOP + 180, 52, 230, 51);
  scenes.push(scene(p, "Drei Pinguine", s, d,
    `.dritte-sil{position:absolute;top:${TOP}px;width:${W}px;height:${H}px;transform-origin:50% 100%;}
     .dritte-lb{position:absolute;top:${TOP + H + 16}px;width:${W}px;text-align:center;${LBL(104)}color:${YEL};-webkit-text-stroke:14px ${K};}
     #dritte-cr{${abs(crownAt(0)[0], crownAt(0)[1], 160, 95)}transform-origin:50% 100%;}
     #dritte-spot{${abs(X[2] - 60, 760, W + 120, 600)}border-radius:50%;background:radial-gradient(circle,rgba(255,210,63,.4),rgba(255,210,63,0) 66%);}
     .spk{position:absolute;}`,
    `      <div id="dritte-spot"></div>
${X.map((x, i) => `      <div id="dritte-p${i}" class="dritte-sil" style="left:${x}px;">${PENG("dritte" + i, { sil: true, silFill: i === 2 ? "#24307A" : "#16204A" })}</div>
      <div id="dritte-l${i}" class="dritte-lb" style="left:${x}px;">${["I", "II", "III"][i]}</div>`).join("\n")}
      <div id="dritte-cr">${CROWN}</div>
      ${bb.html}`,
    `      tl.set("#dritte-cr", { opacity: 0 }, 0);
      tl.fromTo("#dritte-p0", { scale: 0.85, opacity: 1 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.8)" }, 0);
      tl.fromTo("#dritte-l0", { scale: 0.8 }, { scale: 1, duration: 0.25, ease: "back.out(2.4)" }, 0.05);
      tl.fromTo(["#dritte-p1", "#dritte-l1"], { scale: 0.5, opacity: 1 }, { scale: 1, duration: 0.28, ease: "back.out(2)" }, 0.12);
      tl.fromTo(["#dritte-p2", "#dritte-l2"], { scale: 0 }, { scale: 1, duration: 0.32, ease: "back.out(2.6)" }, 0.3);
      tl.fromTo("#dritte-spot", { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }, 0.3);
${shake("#dritte-kb", 0.62, 16, 0.34)}
${bb.js(0.62)}
      tl.to(["#dritte-p0", "#dritte-p1", "#dritte-l0", "#dritte-l1"], { opacity: 0.55, duration: 0.3 }, 1.1);
      tl.to("#dritte-p2", { keyframes: { scaleY: [1, 1.06, 1] }, duration: 0.4, ease: "sine.inOut", repeat: 2 }, 1.0);
      // ${L16}: the crown is handed on: I -> II -> III
      tl.to(["#dritte-p0", "#dritte-l0"], { opacity: 1, duration: 0.2 }, ${L16 + 0.05});
      tl.set("#dritte-cr", { opacity: 1 }, ${L16 + 0.12});
      tl.fromTo("#dritte-cr", { scale: 0, x: 0, y: 0 }, { scale: 1, duration: 0.28, ease: "back.out(2.6)", immediateRender: false }, ${L16 + 0.12});
      tl.to("#dritte-cr", { keyframes: { x: [0, ${(X[1] - X[0]) / 2}, ${X[1] - X[0]}], y: [0, -70, 0] }, duration: 0.5, ease: "none" }, ${L16 + 0.75});
      tl.to(["#dritte-p0", "#dritte-l0"], { opacity: 0.55, duration: 0.2 }, ${L16 + 0.8});
      tl.to(["#dritte-p1", "#dritte-l1"], { opacity: 1, duration: 0.2 }, ${L16 + 1.1});
      tl.to("#dritte-cr", { keyframes: { x: [${X[1] - X[0]}, ${(X[1] - X[0]) + (X[2] - X[1]) / 2}, ${X[2] - X[0]}], y: [0, -70, 0] }, duration: 0.5, ease: "none" }, ${L16 + 1.45});
      tl.to(["#dritte-p1", "#dritte-l1"], { opacity: 0.55, duration: 0.2 }, ${L16 + 1.5});
      tl.to("#dritte-cr", { keyframes: { scaleY: [1, 0.8, 1.1, 1] }, duration: 0.3, ease: "none" }, ${L16 + 1.95});
      tl.to("#dritte-p2", { keyframes: { y: [0, -24, 0] }, duration: 0.3, ease: "power1.out" }, ${L16 + 1.95});`));
}

// ================= FRAGE + loop: comment bubbles (pets with titles), then the hook picture builds up again (36.6 - end) =================
{
  const p = "frage";
  const [s, d] = S(p);
  const LOOP = +(C.c18[0] - s).toFixed(2); // local start of the loop caption
  const PEN0 = +(LOOP - 0.18).toFixed(2), BUB0 = +(PEN0 - 0.1).toFixed(2);
  const bub = (id, x, y, icon, tail) => `<div id="${id}" class="frage-bub" style="left:${x}px;top:${y}px;"><svg viewBox="0 0 400 290" width="100%" height="100%" overflow="visible">
    <path d="${tail ? "M36 10 L364 10 Q392 10 392 38 L392 206 Q392 234 364 234 L300 234 L316 284 L250 234 L36 234 Q8 234 8 206 L8 38 Q8 10 36 10 Z" : "M36 10 L364 10 Q392 10 392 38 L392 206 Q392 234 364 234 L150 234 L84 284 L100 234 L36 234 Q8 234 8 206 L8 38 Q8 10 36 10 Z"}" fill="#fff" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>
    ${icon}</svg></div>`;
  // cat with a crown
  const cat = `<g transform="translate(130 40)"><path d="M10 70 L20 10 L60 50 L100 50 L140 10 L150 70 Q160 170 80 176 Q0 170 10 70 Z" fill="#F2A65A" stroke="${K}" stroke-width="8" stroke-linejoin="round"/><circle cx="55" cy="100" r="9" fill="${K}"/><circle cx="105" cy="100" r="9" fill="${K}"/><path d="M72 124 L88 124 L80 134 Z" fill="#FF8FA3" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><path d="M20 120 L-14 112 M20 134 L-14 140 M140 120 L174 112 M140 134 L174 140" stroke="${K}" stroke-width="5" stroke-linecap="round"/><g transform="translate(36 -36) scale(.4)">${CROWN.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "")}</g></g>`;
  // dog with a medal
  const dog = `<g transform="translate(120 36)"><ellipse cx="22" cy="70" rx="24" ry="50" fill="#7A4A26" stroke="${K}" stroke-width="7"/><ellipse cx="158" cy="70" rx="24" ry="50" fill="#7A4A26" stroke="${K}" stroke-width="7"/><rect x="24" y="20" width="132" height="140" rx="60" fill="#D49A55" stroke="${K}" stroke-width="8"/><circle cx="66" cy="78" r="9" fill="${K}"/><circle cx="114" cy="78" r="9" fill="${K}"/><ellipse cx="90" cy="108" rx="18" ry="12" fill="${K}"/><path d="M76 128 Q90 140 104 128" stroke="${K}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M78 160 L90 186 L102 160" fill="${CRED}" stroke="${K}" stroke-width="4"/><circle cx="90" cy="194" r="16" fill="${YEL}" stroke="${K}" stroke-width="5"/></g>`;
  scenes.push(scene(p, "Frage und Loop", s, d, hookCss(p) + `
     .frage-bub{position:absolute;width:400px;height:290px;transform-origin:50% 100%;}`,
    hookBody(p) + `
      ${bub("frage-b1", 110, 760, cat, false)}
      ${bub("frage-b2", 560, 1000, dog, true)}`,
    `      gsap.set("#frage-fL", { svgOrigin: "58 172" });
      tl.set(["#frage-pg", "#frage-glow", "#frage-ring", "#frage-sp0", "#frage-sp1", "#frage-sp2"], { opacity: 0 }, 0);
      tl.fromTo("#frage-b1", { scale: 0.8, rotation: -8 }, { scale: 1, rotation: -3, duration: 0.32, ease: "back.out(2.2)" }, 0);
      tl.fromTo("#frage-b2", { scale: 0.5, rotation: 10 }, { scale: 1, rotation: 3, duration: 0.32, ease: "back.out(2.2)" }, 0.12);
      tl.to(["#frage-b1", "#frage-b2"], { y: -14, duration: 0.35, yoyo: true, repeat: 1, ease: "sine.inOut", stagger: 0.15 }, 0.85);
      // loop: the bubbles shrink away and are gone in the frame the hook picture starts to grow (no graphic covers another);
      // the question caption is still on screen, so no frame is empty
      tl.to(["#frage-b1", "#frage-b2"], { keyframes: { opacity: [1, 1, 0.5], scale: [1, 0.9, 0.75] }, duration: 0.1, ease: "none" }, ${BUB0});
      tl.set(["#frage-b1", "#frage-b2"], { opacity: 0 }, ${PEN0});
      tl.set(["#frage-pg", "#frage-ring"], { opacity: 1 }, ${PEN0});
      tl.fromTo("#frage-pg", { scale: 0.6 }, { scale: 1, duration: 0.4, ease: "back.out(1.5)", immediateRender: false }, ${PEN0});
      tl.fromTo("#frage-glow", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out", immediateRender: false }, ${+(PEN0 + 0.1).toFixed(2)});
      tl.fromTo(["#frage-sp0", "#frage-sp1", "#frage-sp2"], { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(2.4)", stagger: 0.05, immediateRender: false }, ${+(PEN0 + 0.25).toFixed(2)});`,
    { exit: false, kb: false }));
}

// ================= background: parade ground at night, red carpet, bunting, spotlights, rising sparkles (all loop-seamless) =================
{
  const RS = mulberry32(44);
  const dots = (n, minR, maxR, op) => Array.from({ length: n }, () => ({ x: Math.round(RS() * 1080), y: Math.round(RS() * 1920), r: +(minR + RS() * (maxR - minR)).toFixed(1), o: +(op * (0.6 + RS() * 0.4)).toFixed(2) }));
  const far = dots(30, 2, 3.5, 0.45), near = dots(14, 3.5, 6, 0.6);
  const tile = (fl, k, col) => fl.map((f) => `<circle cx="${f.x}" cy="${f.y + k * 1920}" r="${f.r}" fill="${col}" opacity="${f.o}"/>`).join("");
  const stars = Array.from({ length: 24 }, () => `<circle cx="${Math.round(RS() * 1080)}" cy="${Math.round(40 + RS() * 1100)}" r="${(1.5 + RS() * 2).toFixed(1)}" fill="#fff" opacity="${(0.25 + RS() * 0.45).toFixed(2)}"/>`).join("");
  const flags = (y0, sag, n, off) => { let o = ""; const cols = [YEL, CRED, "#F4F6FA", NBLUE]; for (let i = 0; i < n; i++) { const x = -40 + i * (1160 / (n - 1)); const yy = y0 + sag * Math.sin(Math.PI * (x + 40) / 1160); o += `<path d="M${x - 26} ${yy} L${x + 26} ${yy} L${x} ${yy + 56} Z" fill="${cols[(i + off) % 4]}" stroke="${K}" stroke-width="4" stroke-linejoin="round" opacity=".9"/>`; } return o; };
  const line = (y0, sag) => `<path d="M-60 ${y0} Q540 ${y0 + sag * 2} 1140 ${y0}" fill="none" stroke="#C9D3DE" stroke-width="4" opacity=".7"/>`;
  fs.writeFileSync(path.join(OUT, "compositions", "bg.html"), `<template>
  <style>
    #root { position: absolute; inset: 0; overflow: hidden; background: #0E1530; }
    #bg-sky { position: absolute; inset: 0; background: linear-gradient(180deg, #0B1430 0%, #111F48 45%, #1C2F66 69%, #26305A 69.3%, #1B2349 100%); }
    #bg-stars { position: absolute; left: 0; top: 0; }
    .bg-beam { position: absolute; top: -200px; width: 360px; height: 1700px; transform-origin: 50% 0%; background: linear-gradient(180deg, rgba(255,240,190,.16), rgba(255,240,190,.03) 80%, rgba(255,240,190,0)); clip-path: polygon(45% 0, 55% 0, 100% 100%, 0 100%); }
    #bg-b1 { left: -60px; } #bg-b2 { left: 780px; }
    #bg-carpet { position: absolute; left: 0; top: 1330px; }
    .bg-bunt { position: absolute; left: 0; width: 1080px; height: 200px; transform-origin: 50% 0%; }
    .bg-spk { position: absolute; left: 0; top: 0; }
  </style>
  <div id="root" data-composition-id="bg" data-width="1080" data-height="1920" data-layout-allow-overflow>
    <div id="bg-sky"></div>
    <svg id="bg-stars" width="1080" height="1300">${stars}</svg>
    <div id="bg-b1" class="bg-beam"></div><div id="bg-b2" class="bg-beam"></div>
    <svg id="bg-carpet" width="1080" height="590" viewBox="0 0 1080 590"><path d="M450 0 L630 0 L960 590 L120 590 Z" fill="#A81A28"/><path d="M470 0 L610 0 L900 590 L180 590 Z" fill="${CRED}"/><path d="M450 0 L120 590 M630 0 L960 590" stroke="${GOLD}" stroke-width="8"/><path d="M0 2 H1080" stroke="#33407A" stroke-width="4"/></svg>
    <svg id="bg-u1" class="bg-bunt" style="top:70px" viewBox="0 0 1080 200">${line(0, 60)}${flags(0, 60, 13, 0)}</svg>
    <svg id="bg-u2" class="bg-bunt" style="top:150px" viewBox="0 0 1080 200">${line(0, 50)}${flags(0, 50, 11, 2)}</svg>
    <svg id="bg-s1" class="bg-spk" width="1080" height="3840">${tile(far, 0, YEL)}${tile(far, 1, YEL)}</svg>
    <svg id="bg-s2" class="bg-spk" width="1080" height="5760">${tile(near, 0, "#FFE9A0")}${tile(near, 1, "#FFE9A0")}${tile(near, 2, "#FFE9A0")}</svg>
  </div>
  <script>
    (function () {
      const tl = gsap.timeline({ paused: true });
      // every move covers whole periods, so the last frame leads straight back into frame 0
      tl.fromTo("#bg-s1", { y: 0 }, { y: -1920, duration: ${DUR}, ease: "none" }, 0);
      tl.fromTo("#bg-s2", { y: 0 }, { y: -3840, duration: ${DUR}, ease: "none" }, 0);
      tl.fromTo("#bg-b1", { rotation: -18 }, { rotation: 8, duration: ${(DUR / 6).toFixed(4)}, ease: "sine.inOut", yoyo: true, repeat: 5 }, 0);
      tl.fromTo("#bg-b2", { rotation: 18 }, { rotation: -8, duration: ${(DUR / 4).toFixed(4)}, ease: "sine.inOut", yoyo: true, repeat: 3 }, 0);
      tl.fromTo("#bg-u1", { rotation: 0 }, { keyframes: { rotation: [0, 0.8, 0, -0.8, 0] }, duration: ${(DUR / 10).toFixed(4)}, ease: "none", repeat: 9 }, 0);
      tl.fromTo("#bg-u2", { rotation: 0 }, { keyframes: { rotation: [0, -0.7, 0, 0.7, 0] }, duration: ${(DUR / 8).toFixed(4)}, ease: "none", repeat: 7 }, 0);
      window.__timelines["bg"] = tl;
    })();
  </script>
</template>
`);
}

// ================= captions =================
// "*" keyword (yellow Lilita, 140 px), "#" the same with tighter letters (one very long word). "!" punchline (largest). "/" line break. Fixed word gap: every word has 11 px margins.
const HOOKW = ["Dieser", "*RITTER", "/", "ist", "ein", "Pinguin."];
const caps = [
  { id: "c01", words: HOOKW, still: true },
  { id: "c02", words: ["*BEFÖRDERT", "/", "wird", "er", "ständig."], shake: true },
  { id: "c03", words: ["Er", "lebt", "im", "/", "Zoo", "Edinburgh."] },
  { id: "c04", words: ["Aber", "er", "gehört", "/", "zur", "Garde."] },
  { id: "c05", words: ["Zur", "Königsgarde", "/", "in", "*NORWEGEN."], wide: true },
  { id: "c06", words: ["*1972:", "Die", "Garde", "/", "adoptiert", "ihn."] },
  { id: "c07", words: ["#MASKOTTCHEN", "/", "der", "Garde."], wide: true },
  { id: "c08", words: ["Dann", "klettert", "er", "/", "die", "Leiter", "hoch."] },
  { id: "c09", words: ["*2008:", "Er", "wird", "/", "zum", "*RITTER."], shake: true },
  { id: "c10", words: ["*BRIGADIER", "/", "ab", "*2016."] },
  { id: "c11", words: ["*GENERAL-", "/", "*MAJOR", "/", "ab", "*2023."], shake: true },
  { id: "c12", words: ["*BARON", "/", "der", "Bouvetinsel", "/", "ist", "er", "auch."] },
  { id: "c13", words: ["Die", "Garde", "/", "marschiert", "/", "zu", "ihm."] },
  { id: "c14", words: ["Und", "das", "Beste?"] },
  { id: "c15", words: ["Es", "ist", "schon", "/", "der", "!DRITTE."], shake: true },
  { id: "c16", words: ["Der", "Titel", "wird", "/", "einfach", "vererbt."] },
  { id: "c17", words: ["Welchen", "Titel", "/", "verdient", "/", "dein", "Haustier?"] },
  { id: "c18", words: HOOKW, loop: true },
].map((c) => ({ ...c, s: C[c.id][0], e: C[c.id][1] }));
const ST = 0.065, PD = 0.22, KD = 0.24, EXIT = 0.12;
let capHtml = "", capJs = "";
const report = [];
for (const c of caps) {
  const d = +(c.e - c.s).toFixed(2);
  const track = caps.indexOf(c) % 2;
  const kind = (w) => (w === "/" ? "br" : "*!#".includes(w[0]) ? w[0] : "");
  const spans = c.words.map((w, i) => {
    const k = kind(w);
    if (k === "br") return `<br/>`;
    const txt = k ? w.slice(1) : w;
    const cls = { "*": "w kw", "#": "w kw kwn", "!": "w pt", "": "w" }[k];
    return `<span id="${c.id}-o${i}" class="${cls}"><span id="${c.id}-w${i}" class="g">${txt}</span></span>`;
  });
  capHtml += `      <div id="${c.id}" class="cap clip" data-start="${c.s}" data-duration="${d}" data-track-index="${track}" data-layout-allow-overlap>${spans.join(" ").replace(/ <br\/> /g, "<br/>")}</div>\n`;
  capJs += `      // ${c.id}\n`;
  let full = c.s, n = 0, wc = 0;
  const step = c.loop ? 0.05 : ST;
  c.words.forEach((w, i) => {
    const k = kind(w);
    if (k === "br") return;
    if (!w.endsWith("-")) wc++; // a hyphenated word split over two lines counts once
    if (c.still) { // frame 0: the whole hook line is already readable
      if (k === "*") capJs += `      tl.to("#${c.id}-w${i}", { keyframes: { scale: [1, 1.18, 1], rotation: [0, -5, 0] }, duration: 0.35, ease: "power1.inOut" }, 0.35);\n`;
      return;
    }
    const at = +(c.s + 0.02 + n * step).toFixed(3);
    n++;
    if (k === "*" || k === "!" || k === "#") {
      // pop-in stays inside the 80 px side margins: lines that fill the width pop without overshooting scale
      capJs += `      tl.fromTo("#${c.id}-w${i}", { opacity: 0, scale: ${c.wide ? 1 : 1.15}, rotation: ${c.wide ? -2 : -6} }, { opacity: 1, scale: 1, rotation: 0, duration: ${KD}, ease: "back.out(2.2)" }, ${at});\n`;
      if (c.shake) capJs += `      tl.to("#${c.id}-w${i}", { keyframes: { x: [0, -12, 12, -8, 6, 0], rotation: [0, -4, 4, -2, 0, 0] }, duration: 0.32, ease: "none" }, ${+(at + 0.28).toFixed(3)});\n`;
      full = Math.max(full, at + KD);
    } else {
      capJs += `      tl.fromTo("#${c.id}-w${i}", { opacity: 0, scale: 0.4, y: 26 }, { opacity: 1, scale: 1, y: 0, duration: ${PD}, ease: "back.out(1.6)" }, ${at});\n`;
      full = Math.max(full, at + PD);
    }
  });
  if (wc > 6) throw new Error(c.id + " has more than 6 words");
  if (c.loop) { report.push(`${c.id} loop copy of c01, complete @${full.toFixed(2)} (end ${c.e})`); if (full > DUR - 0.05) throw new Error("loop caption not complete before the end"); continue; }
  const ex = +(c.e - EXIT - 0.01).toFixed(3);
  capJs += `      tl.to("#${c.id} .g", { opacity: 0, scale: 0.85, duration: ${EXIT}, ease: "power2.in" }, ${ex});\n`;
  const readable = +(ex - full).toFixed(2), need = Math.max(1.1, 0.35 * wc);
  report.push(`${c.id} ${wc}w full@${full.toFixed(2)} readable ${readable}s need ${need.toFixed(2)}s ${readable >= need - 1e-6 ? "ok" : "TOO SHORT"}`);
  if (readable < need - 1e-6) throw new Error(c.id + " too short");
  if (c.still && full > 1.0) throw new Error("hook not readable by 1.0 s");
}
fs.writeFileSync(path.join(OUT, "compositions", "captions.html"), `<template>
  <style>
    ${FONTFACE}
    #root { position: absolute; inset: 0; }
    .cap { position: absolute; left: 80px; top: 300px; width: 920px; text-align: center; font-family: 'Inter', sans-serif; font-weight: 900;
      font-size: 92px; line-height: 1.12; color: #fff; letter-spacing: -0.01em; word-spacing: 0; }
    .w { display: inline-block; margin: 0 11px; -webkit-text-stroke: 16px ${K}; paint-order: stroke fill; text-shadow: 0 9px 0 #050814; }
    .g { display: inline-block; }
    .kw { font-family: 'Lilita One'; font-weight: 400; color: ${YEL}; font-size: 140px; line-height: 1.0; text-transform: uppercase; letter-spacing: 0.01em; }
    .kwn { letter-spacing: -0.035em; }
    .pt { font-family: 'Lilita One'; font-weight: 400; color: ${YEL}; font-size: 184px; line-height: 0.95; letter-spacing: 0.01em; -webkit-text-stroke: 24px ${K}; text-shadow: 0 16px 0 #050814; }
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

// ================= Klotz (rig from Folge 1-4; new gag: salutes the wrong way round, gets a tiny cardboard medal) =================
// eyes always open: no mood closes the lids (blinks and one wink only)
const M = {
  shock:     { eye: 1.12, ps: 0.6, px: 0, py: 0, bL: -18, bR: -18, tL: -6, tR: -6, mx: 1, my: 1.1, g: 0, aL: 70, aR: -70 },
  surprised: { eye: 1.08, ps: 0.8, px: 0, py: 6, bL: -16, bR: -16, tL: 0, tR: 0, mx: 0.55, my: 0.6, g: 0, aL: 55, aR: -55 },
  curious:   { eye: 1.05, ps: 1.1, px: -14, py: -10, bL: -18, bR: -4, tL: 0, tR: 0, mx: 0.5, my: 0.35, g: 0, aL: 40, aR: -40 },
  impressed: { eye: 1.05, ps: 0.9, px: -6, py: -4, bL: -12, bR: -12, tL: -4, tR: -4, mx: 0.45, my: 0.45, g: 0, aL: 40, aR: -40 },
  look:      { eye: 1.06, ps: 1.0, px: -14, py: -12, bL: -14, bR: -14, tL: -4, tR: -4, mx: 0.5, my: 0.5, g: 0, aL: 40, aR: -40 },
  lookup:    { eye: 1.06, ps: 1.0, px: -10, py: -16, bL: -16, bR: -16, tL: -4, tR: -4, mx: 0.45, my: 0.4, g: 0, aL: 40, aR: -40 },
  proud:     { eye: 1.05, ps: 1.0, px: 0, py: -2, bL: -14, bR: -14, tL: -4, tR: -4, mx: 0, my: 0, g: 1, gs: 0.75, aL: 30, aR: -30 },
  jawdrop:   { eye: 1.18, ps: 0.55, px: -6, py: -8, bL: -22, bR: -22, tL: -4, tR: -4, mx: 1.1, my: 1.7, jy: 14, g: 0, aL: 60, aR: -60 },
  happy:     { eye: 1.04, ps: 1, px: 0, py: 0, bL: -10, bR: -10, tL: -4, tR: -4, mx: 0, my: 0, g: 1, gs: 0.8, aL: 35, aR: -35 },
  cheer:     { eye: 1.05, ps: 1, px: 0, py: -4, bL: -16, bR: -16, tL: -6, tR: -6, mx: 0, my: 0, g: 1, gs: 0.9, aL: 160, aR: -30 },
};
const LOOPK = C.c18[0];
const SAL = [[14.35, 15.65], [28.05, 29.6]]; // wrong-way salute (Klotz's left hand, hand upside down, wobbling)
const MED0 = 36.95; // cardboard medal
const moods = [
  [2.6, "surprised"], [4.65, "curious"], [7.1, "impressed"], [9.55, "look"], [11.6, "surprised"], [14.05, "proud"], [15.8, "lookup"],
  [18.65, "impressed"], [21.1, "surprised"], [22.85, "jawdrop"], [24.7, "curious"], [27.55, "proud"], [30.0, "curious"], [31.65, "shock"],
  [34.15, "look"], [36.6, "happy"], [MED0 + 0.35, "cheer"], [38.1, "proud"], [LOOPK + 0.08, "shock"],
];
const blinks = [3.9, 8.3, 12.9, 17.4, 20.3, 26.1, 33.0, 35.6];

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
  <ellipse id="k-chkL" cx="72" cy="198" rx="20" ry="12" fill="#FF5A6E" opacity=".4"/><ellipse id="k-chkR" cx="228" cy="198" rx="20" ry="12" fill="#FF5A6E" opacity=".4"/>
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
  <g id="k-med">
    <path d="M78 214 L86 240 L96 240 L90 214 Z" fill="${CRED}" stroke="#5A2200" stroke-width="3"/><path d="M104 214 L96 240 L86 240 L94 214 Z" fill="${NBLUE}" stroke="#5A2200" stroke-width="3"/>
    <path d="M91 238 Q114 240 114 262 Q112 284 90 284 Q68 282 68 260 Q70 240 91 238 Z" fill="#C89B62" stroke="#6B4A22" stroke-width="5"/>
    <path d="M91 248 L95 258 L105 259 L97 265 L100 275 L91 269 L82 274 L85 265 L78 258 L88 258 Z" fill="none" stroke="#E8C27A" stroke-width="3.5" stroke-linejoin="round"/>
    <g id="k-medsp"><path d="M122 222 Q124 232 134 234 Q124 236 122 246 Q120 236 110 234 Q120 232 122 222 Z" fill="${YEL}" stroke="#5A2200" stroke-width="3"/></g>
  </g>
  <g id="k-sal">
    <path d="M258 204 Q336 176 304 112 L262 76" fill="none" stroke="#7A2E00" stroke-width="44" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M258 204 Q336 176 304 112 L262 76" fill="none" stroke="#F06A0C" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="rotate(200 238 64)"><rect x="206" y="48" width="64" height="32" rx="14" fill="#FF7A1A" stroke="#7A2E00" stroke-width="6"/><path d="M222 54 V74 M236 54 V74 M250 54 V74" stroke="#7A2E00" stroke-width="4" stroke-linecap="round"/><ellipse cx="270" cy="72" rx="10" ry="14" fill="#FF7A1A" stroke="#7A2E00" stroke-width="5"/></g>
  </g>
</svg>`;

let kJs = "";
const setMood = (m, t, dur) => {
  const p = M[m];
  const o = `duration: ${dur}, ease: "back.out(1.8)"`;
  return `      tl.to(["#k-eyeL", "#k-eyeR"], { scale: ${p.eye}, ${o} }, ${t});
      tl.to(["#k-pupL", "#k-pupR"], { x: ${p.px}, y: ${p.py}, scale: ${p.ps}, ${o} }, ${t});
      tl.to(["#k-lidL", "#k-lidR"], { scaleY: 0, duration: ${dur}, ease: "power2.out" }, ${t});
      tl.to("#k-browL", { y: ${p.bL}, rotation: ${p.tL}, ${o} }, ${t});
      tl.to("#k-browR", { y: ${p.bR}, rotation: ${-p.tR}, ${o} }, ${t});
      tl.to("#k-mouth", { scaleX: ${p.mx || 0.001}, scaleY: ${p.my || 0.001}, y: ${p.jy || 0}, opacity: ${p.g ? 0 : 1}, ${o} }, ${t});
      tl.to("#k-grin", { scale: ${p.g ? (p.gs || 1) : 0.2}, opacity: ${p.g}, ${o} }, ${t});
      tl.to("#k-armL", { rotation: ${p.aL}, duration: ${+(dur * 1.3).toFixed(3)}, ease: "back.out(1.6)" }, ${+(t + 0.04).toFixed(2)});
      tl.to("#k-armR", { rotation: ${p.aR}, duration: ${+(dur * 1.3).toFixed(3)}, ease: "back.out(1.6)" }, ${+(t + 0.08).toFixed(2)});
`;
};
const p0 = M.shock;
kJs += `      gsap.set("#k-armL", { svgOrigin: "48 190" }); gsap.set("#k-armR", { svgOrigin: "252 190" });
      gsap.set(["#k-eyeL"], { svgOrigin: "108 140" }); gsap.set(["#k-eyeR"], { svgOrigin: "192 140" });
      gsap.set("#k-pupL", { svgOrigin: "108 142" }); gsap.set("#k-pupR", { svgOrigin: "192 142" });
      gsap.set("#k-lidL", { svgOrigin: "108 90" }); gsap.set("#k-lidR", { svgOrigin: "192 90" });
      gsap.set("#k-browL", { svgOrigin: "109 81" }); gsap.set("#k-browR", { svgOrigin: "191 81" });
      gsap.set("#k-mouth", { svgOrigin: "150 228" }); gsap.set("#k-grin", { svgOrigin: "150 230" });
      gsap.set("#k-sal", { svgOrigin: "258 204", opacity: 0, rotation: 30 }); gsap.set("#k-med", { svgOrigin: "91 214", opacity: 0, scale: 0 }); gsap.set("#k-medsp", { svgOrigin: "122 234" });
      gsap.set(["#k-eyeL", "#k-eyeR"], { scale: ${p0.eye} });
      gsap.set(["#k-pupL", "#k-pupR"], { x: 0, y: 0, scale: ${p0.ps} });
      gsap.set(["#k-lidL", "#k-lidR"], { scaleY: 0 });
      gsap.set("#k-browL", { y: ${p0.bL}, rotation: ${p0.tL} }); gsap.set("#k-browR", { y: ${p0.bR}, rotation: ${-p0.tR} });
      gsap.set("#k-mouth", { scaleX: ${p0.mx}, scaleY: ${p0.my}, y: 0, opacity: 1 }); gsap.set("#k-grin", { scale: 0.2, opacity: 0 });
      gsap.set("#k-armL", { rotation: ${p0.aL} }); gsap.set("#k-armR", { rotation: ${p0.aR}, opacity: 1 });
      gsap.set("#k-wrap", { x: 0, y: 0, rotation: 0, scale: 1 }); gsap.set("#k-sq", { scaleX: 1, scaleY: 1 });
      // idle bob: 80 half-cycles over the film, ends where it starts
      tl.fromTo("#k-bob", { y: 0 }, { y: -12, duration: ${(DUR / 80).toFixed(5)}, ease: "sine.inOut", yoyo: true, repeat: 79 }, 0);
      // hook: shocked jump
      tl.to("#k-wrap", { keyframes: { y: [0, -18, 0, -8, 0] }, duration: 0.6, ease: "none" }, 0.3);
`;
for (const [t, m] of moods) {
  kJs += `      // ${m} @ ${t}\n`;
  kJs += `      tl.to("#k-sq", { keyframes: { scaleY: [1, 0.9, 1.06, 1], scaleX: [1, 1.07, 0.97, 1] }, duration: 0.3, ease: "none" }, ${+(t - 0.05).toFixed(2)});\n`;
  kJs += setMood(m, +(t + 0.03).toFixed(2), 0.22);
}
for (const b of blinks) kJs += `      tl.to(["#k-lidL", "#k-lidR"], { scaleY: 1, duration: 0.06, yoyo: true, repeat: 1, ease: "power1.inOut" }, ${b});\n`;
for (const [a, b] of SAL) {
  const n = Math.floor((b - a - 0.5) / 0.3);
  kJs += `      // GAG: salute with the wrong (left) hand, hand upside down, wobbling
      tl.set("#k-armR", { opacity: 0 }, ${a});
      tl.set("#k-sal", { opacity: 1 }, ${a});
      tl.fromTo("#k-sal", { rotation: 40 }, { rotation: 0, duration: 0.25, ease: "back.out(2)", immediateRender: false }, ${a});
      tl.to("#k-sal", { keyframes: { rotation: [0, -7, 5, -6, 0] }, duration: 0.3, ease: "none", repeat: ${n - 1} }, ${+(a + 0.25).toFixed(2)});
      tl.to("#k-wrap", { keyframes: { rotation: [0, -3, 3, -2, 0] }, duration: 0.6, ease: "sine.inOut", repeat: ${Math.max(0, Math.floor(n / 2) - 1)} }, ${+(a + 0.25).toFixed(2)});
      tl.to("#k-sq", { keyframes: { scaleY: [1, 1.05, 1.05, 1] }, duration: ${+(b - a - 0.3).toFixed(2)}, ease: "none" }, ${+(a + 0.2).toFixed(2)});
      tl.to("#k-sal", { rotation: 40, opacity: 0, duration: 0.18, ease: "power2.in" }, ${+(b - 0.2).toFixed(2)});
      tl.set("#k-armR", { opacity: 1 }, ${+(b - 0.05).toFixed(2)});
`;
}
kJs += `      // 30.0: Klotz leans forward (Und das Beste?)
      tl.to("#k-wrap", { rotation: -9, x: -16, y: -14, scale: 1.05, duration: 0.3, ease: "back.out(1.6)" }, 30.05);
      tl.to("#k-wrap", { rotation: 0, x: 0, y: 0, scale: 1, duration: 0.25, ease: "back.out(2)" }, 31.6);
      // 34.15: the eyes follow the crown from left to right
      tl.to(["#k-pupL", "#k-pupR"], { x: -16, duration: 0.2 }, 34.4);
      tl.to(["#k-pupL", "#k-pupR"], { x: 0, duration: 0.3 }, 35.0);
      tl.to(["#k-pupL", "#k-pupR"], { x: 14, duration: 0.3 }, 35.65);
      // GAG end: a tiny cardboard medal, Klotz is proud (eyes open, a wink)
      tl.to("#k-med", { opacity: 1, scale: 1.35, duration: 0.3, ease: "back.out(2.6)" }, ${MED0});
      tl.to("#k-medsp", { keyframes: { scale: [1, 0.4, 1], rotation: [0, 45, 90] }, duration: 0.45, ease: "sine.inOut", repeat: 3 }, ${MED0 + 0.3});
      tl.to("#k-sq", { keyframes: { scaleY: [1, 1.08, 1.08, 1] }, duration: 1.4, ease: "none" }, ${MED0 + 0.35});
      tl.to("#k-wrap", { keyframes: { rotation: [0, -4, 0, 4, 0] }, duration: 1.2, ease: "sine.inOut" }, ${MED0 + 0.5});
      tl.to("#k-lidR", { scaleY: 1, duration: 0.1, yoyo: true, repeat: 1, ease: "power1.inOut" }, 38.4);
      tl.to("#k-browR", { y: 0, duration: 0.1, yoyo: true, repeat: 1 }, 38.4);
      // loop (${LOOPK}): medal pops away, frame-0 shock pose
      tl.to("#k-med", { scale: 0, opacity: 0, duration: 0.16, ease: "back.in(2)" }, ${LOOPK});
      tl.to("#k-wrap", { keyframes: { y: [0, -24, 0], rotation: [0, 0, 0] }, duration: 0.3, ease: "none" }, ${+(LOOPK + 0.05).toFixed(2)});
`;
fs.writeFileSync(path.join(OUT, "compositions", "klotz.html"), `<template>
  <style>
    #root { position: absolute; inset: 0; pointer-events: none; }
    #k-pod { position: absolute; left: 640px; top: 1748px; width: 380px; height: 120px; }
    #k-wrap { position: absolute; left: 700px; top: 1480px; width: 260px; height: 286px; transform-origin: 50% 100%; }
    #k-bob, #k-sq { position: absolute; inset: 0; transform-origin: 50% 100%; }
  </style>
  <div id="root" data-composition-id="klotz" data-width="1080" data-height="1920" data-layout-allow-overflow>
    <div id="k-pod"><svg viewBox="0 0 380 120" width="100%" height="100%" overflow="visible"><rect x="10" y="10" width="360" height="104" rx="14" fill="${CRED}" stroke="${K}" stroke-width="8"/><rect x="10" y="10" width="360" height="26" rx="10" fill="${GOLD}" stroke="${K}" stroke-width="6"/><path transform="translate(160 50) scale(.6)" d="${STAR_D}" fill="${YEL}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/></svg></div>
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
  [0.0, "impact", 0.7], [0.0, "fanfare", 0.5], [0.05, "sparkle", 0.4], [0.35, "shing", 0.45], [0.6, "tap", 0.5], [0.9, "tap", 0.45], [0.3, "boing", 0.4],
  [2.6, "whoosh1", 0.45], [2.65, "ding", 0.4], [3.42, "ding", 0.4], [3.74, "ding", 0.45], [4.06, "ding", 0.5], [4.1, "sparkle", 0.45],
  [4.65, "whoosh2", 0.45], [4.75, "creak", 0.5], [5.4, "creak", 0.45], [5.75, "waddle", 0.45], [6.1, "waddle", 0.45],
  [7.1, "whoosh1", 0.4], [7.1, "step", 0.55], [7.6, "step", 0.55], [8.1, "step", 0.55], [8.6, "step", 0.55], [9.15, "stamp", 0.5],
  [9.55, "whoosh2", 0.45], [9.65, "flap", 0.5], [10.05, "sparkle", 0.4], [10.5, "flap", 0.4],
  [11.6, "pop1", 0.45], [11.95, "whoosh2", 0.35], [12.58, "stamp", 0.7], [12.6, "impact", 0.4],
  [14.05, "pop2", 0.45], [14.2, "pop1", 0.4], [14.4, "boing", 0.4], [14.55, "sparkle", 0.4], [14.85, "waddle", 0.4], [15.15, "waddle", 0.4],
  [15.8, "whoosh1", 0.4], [16.6, "hop", 0.5], [18.7, "hop", 0.5], [19.0, "whoosh2", 0.35], [19.4, "shing", 0.5], [19.55, "tap", 0.5], [19.9, "tap", 0.5], [19.6, "sparkle", 0.5], [19.65, "chime", 0.45],
  [21.15, "hop", 0.5], [21.5, "ding", 0.5], [21.7, "impact", 0.35], [22.9, "hop", 0.5], [23.25, "ding", 0.5], [23.4, "sparkle", 0.5], [23.45, "boing", 0.4], [23.6, "chime", 0.4],
  [24.7, "whoosh2", 0.45], [25.05, "whoosh1", 0.3], [25.6, "impact", 0.45], [25.75, "sparkle", 0.45], [26.2, "ding", 0.35],
  [27.55, "step", 0.5], [28.05, "step", 0.5], [28.55, "stamp", 0.5], [28.1, "boing", 0.3], [28.8, "waddle", 0.4], [29.3, "waddle", 0.4],
  [30.0, "drumroll", 0.6],
  [31.65, "impact", 0.75], [31.95, "fanfare", 0.55], [32.25, "sparkle", 0.5],
  [34.25, "pop1", 0.4], [34.9, "whoosh1", 0.35], [35.6, "whoosh1", 0.35], [36.1, "ding", 0.45], [36.1, "sparkle", 0.4],
  [36.6, "pop1", 0.45], [37.0, "pop2", 0.45], [36.95, "chime", 0.4], [38.4, "ping", 0.35],
  [38.8, "whoosh2", 0.45], [38.92, "pop1", 0.35], [39.2, "sparkle", 0.4],
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
${scenes.map((s, i) => host(s.id, s.start, s.dur, 1 + (i % 2), 2)).join("\n")}
${host("klotz", 0, DUR, 3, 3)}
${host("captions", 0, DUR, 4, 4, "captions")}
      <audio id="music-march" class="clip" src="assets/sfx/march.wav" data-start="0" data-duration="${DUR}" data-track-index="5" data-volume="0.4"></audio>
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
