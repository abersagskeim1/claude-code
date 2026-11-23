// Generator for Folge 7 "Der Eimer-Krieg": writes index.html and compositions/*.html
// Usage: node tools/gen.mjs <project_dir>
// Technique from Folge 1-6 (scene helper, Klotz rig, captions with fixed word gap, id checks, exit before the cut).
// New in Folge 7: medieval parchment look on night blue. Own drawings: wooden bucket (hero), colour-only shields
// (Modena = yellow/blue, Bologna = red/white, simplified, no real coats of arms), parchment scroll, parchment map,
// sneaking hooded figure, castle silhouette with flags, flag pole, magnifier, FAKT-CHECK stamp, winner pedestal,
// laurel wreath, drawn question mark, book with quill, generic tower. Klotz gag: bucket as knight's helmet, later a stamp.
// No fighting, no fallen, no casualty numbers. All graphics stay in x 80-1000 (target 100-980) and under the captions.
import fs from "node:fs";
import path from "node:path";

const OUT = process.argv[2];
fs.mkdirSync(path.join(OUT, "compositions"), { recursive: true });
for (const f of fs.readdirSync(path.join(OUT, "compositions"))) fs.unlinkSync(path.join(OUT, "compositions", f));

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const f2 = (x) => +(+x).toFixed(3);

const K = "#0A0F22";
const YEL = "#FFD23F", GOLD = "#F2B705", GOLD_D = "#B07A00", RED = "#FF3B3B", NAVY = "#1A2238";
const BLUE = "#2F6BFF", BLUE_D = "#1E47B8", MRED = "#E0302F", WHITE = "#FFFFFF";
const PAPER = "#F3E2B8", PAPER_D = "#D9BC80", PAPER_L = "#FFF3D6", INK = "#5A3A1A";
const WOOD = "#C8873F", WOOD_D = "#8E5A26", WOOD_L = "#E0A35C", IRON = "#5E6678", STONE = "#9AA3B8", STONE_D = "#6E7790", STONE_L = "#C3CAD9";
const STAMP = "#D7262E";

// ================= timing: one row per caption; one scene per caption; cuts on whole tenths =================
// a caption with n words needs n x 0.35 s (min 1.1 s) fully readable + the word pop-in + the exit
const CD = [["c01", 2.3], ["c02", 2.4], ["c03", 2.0], ["c04", 1.7], ["c05", 2.8], ["c06", 2.4], ["c07", 2.8], ["c08", 1.6], ["c09", 2.4],
  ["c10", 2.8], ["c11", 2.8], ["c12", 2.8], ["c13", 1.7], ["c14", 1.6], ["c15", 2.0], ["c16", 2.4], ["c17", 2.8], ["c18", 0.6]];
const C = {};
{ let t = 0; for (const [id, d] of CD) { C[id] = [f2(t), f2(t + d)]; t += d; } }
export const DUR = C.c18[1];
const T = {
  hook: C.c01, rolle: C.c02, karte: C.c03, schilde: C.c04, legende: C.c05, zittern: C.c06, zappo: C.c07, sieg: C.c08, aber: C.c09,
  stempel: C.c10, burg: C.c11, podest: C.c12, lorbeer: C.c13, mythos: C.c14, gedicht: C.c15, turm: C.c16, frage: [C.c17[0], DUR],
};
const S = (k) => [T[k][0], f2(T[k][1] - T[k][0])];
const scenes = [];

// ================= drawings (own designs) =================
const SPARK = (col = YEL) => `<svg viewBox="0 0 100 100" width="100%" height="100%" overflow="visible"><path d="M50 2 Q56 44 98 50 Q56 56 50 98 Q44 56 2 50 Q44 44 50 2 Z" fill="${col}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/></svg>`;

// wooden bucket, viewBox 300 x 330 (rim centre 150/120, bottom y 306)
const bx = (y, side) => (side < 0 ? 30 + ((y - 120) * 32) / 186 : 270 - ((y - 120) * 32) / 186);
function bandPath(y0, y1) { return `M${f2(bx(y0, -1))} ${y0} L${f2(bx(y0, 1))} ${y0} L${f2(bx(y1, 1))} ${y1} L${f2(bx(y1, -1))} ${y1} Z`; }
function BUCKET(p, { handle = true } = {}) {
  const planks = [0.2, 0.4, 0.6, 0.8].map((f) => `<path d="M${30 + 240 * f} 128 L${62 + 176 * f} 312" stroke="${WOOD_D}" stroke-width="5"/>`).join("");
  const rivets = (y) => [-1, 1].map((s) => `<circle cx="${f2(bx(y, s) - s * 16)}" cy="${y}" r="5" fill="#C9CFDB"/>`).join("") + `<circle cx="150" cy="${y}" r="5" fill="#C9CFDB"/>`;
  return `<svg viewBox="0 0 300 330" width="100%" height="100%" overflow="visible">
    ${handle ? `<g id="${p}-hdl"><path d="M36 128 Q150 -26 264 128" fill="none" stroke="${K}" stroke-width="22" stroke-linecap="round"/><path d="M36 128 Q150 -26 264 128" fill="none" stroke="${IRON}" stroke-width="11" stroke-linecap="round"/><path d="M80 70 Q150 18 220 70" fill="none" stroke="#B8C0D0" stroke-width="4" stroke-linecap="round"/></g>` : ""}
    <path d="M30 120 L62 306 Q150 330 238 306 L270 120 Z" fill="${WOOD}" stroke="${K}" stroke-width="9" stroke-linejoin="round"/>
    <path d="M30 120 L62 306 Q80 312 96 314 L72 124 Z" fill="${WOOD_D}" opacity=".45"/>
    <path d="M232 132 L214 308" stroke="${WOOD_L}" stroke-width="9" stroke-linecap="round" opacity=".7"/>
    ${planks}
    <path d="${bandPath(150, 178)}" fill="${IRON}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>${rivets(164)}
    <path d="${bandPath(258, 284)}" fill="${IRON}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>${rivets(271)}
    <ellipse cx="150" cy="120" rx="120" ry="28" fill="${WOOD_D}" stroke="${K}" stroke-width="9"/>
    <ellipse cx="150" cy="122" rx="100" ry="18" fill="#4A2A10"/>
    ${handle ? `<circle cx="36" cy="128" r="13" fill="${IRON}" stroke="${K}" stroke-width="6"/><circle cx="264" cy="128" r="13" fill="${IRON}" stroke="${K}" stroke-width="6"/>` : ""}
  </svg>`;
}
// heater shield in two colours (per pale), viewBox 200 x 240 - simplified colour fields only, no real coat of arms
const SHIELD = (c1, c2) => `<svg viewBox="0 0 200 240" width="100%" height="100%" overflow="visible">
    <path d="M10 10 H100 V232 Q10 200 10 110 Z" fill="${c1}"/><path d="M100 10 H190 V110 Q190 200 100 232 Z" fill="${c2}"/>
    <path d="M24 22 H84 V60 Q50 52 24 70 Z" fill="#fff" opacity=".28"/>
    <path d="M10 10 H190 V110 Q190 200 100 232 Q10 200 10 110 Z" fill="none" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>
    <path d="M22 22 H178 V110 Q178 190 100 218 Q22 190 22 110 Z" fill="none" stroke="${K}" stroke-width="3" opacity=".35"/></svg>`;
const MOD = [YEL, BLUE], BOL = [MRED, WHITE];
// waving banner, viewBox 160 x 100, two colours side by side
const FLAG = (id, c1, c2) => `<svg viewBox="0 0 160 100" width="100%" height="100%" overflow="visible"><g id="${id}">
    <path d="M0 6 Q40 -6 80 6 L80 94 Q40 82 0 94 Z" fill="${c1}" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M80 6 Q120 18 156 6 L156 94 Q120 106 80 94 Z" fill="${c2}" stroke="${K}" stroke-width="7" stroke-linejoin="round"/></g></svg>`;
// horizontal parchment sheet with rolled ends; returns html with ids p-paper, p-rl, p-rr; w x h
function SCROLL(p, w, h, content = "") {
  return `<div id="${p}-paper" style="position:absolute;left:30px;top:20px;width:${w - 60}px;height:${h - 40}px;">
      <svg viewBox="0 0 ${w - 60} ${h - 40}" width="${w - 60}" height="${h - 40}" overflow="visible">
        <path d="M0 0 H${w - 60} V${h - 40} H0 Z" fill="${PAPER}" stroke="${K}" stroke-width="8"/>
        <path d="M14 14 H${w - 74} V${h - 54} H14 Z" fill="none" stroke="${PAPER_D}" stroke-width="5" stroke-dasharray="18 10"/>
        <ellipse cx="${(w - 60) * 0.3}" cy="${(h - 40) * 0.7}" rx="${(w - 60) * 0.18}" ry="${(h - 40) * 0.12}" fill="${PAPER_D}" opacity=".35"/>
        ${content}</svg></div>
    <div id="${p}-rl" style="position:absolute;left:0;top:0;width:60px;height:${h}px;"><svg viewBox="0 0 60 ${h}" width="60" height="${h}" overflow="visible">
        <rect x="6" y="0" width="48" height="${h}" rx="24" fill="${PAPER_D}" stroke="${K}" stroke-width="8"/><rect x="18" y="14" width="10" height="${h - 28}" rx="5" fill="${PAPER_L}" opacity=".7"/>
        <rect x="14" y="-18" width="32" height="26" rx="8" fill="${WOOD_D}" stroke="${K}" stroke-width="6"/><rect x="14" y="${h - 8}" width="32" height="26" rx="8" fill="${WOOD_D}" stroke="${K}" stroke-width="6"/></svg></div>
    <div id="${p}-rr" style="position:absolute;left:${w - 60}px;top:0;width:60px;height:${h}px;"><svg viewBox="0 0 60 ${h}" width="60" height="${h}" overflow="visible">
        <rect x="6" y="0" width="48" height="${h}" rx="24" fill="${PAPER_D}" stroke="${K}" stroke-width="8"/><rect x="18" y="14" width="10" height="${h - 28}" rx="5" fill="${PAPER_L}" opacity=".7"/>
        <rect x="14" y="-18" width="32" height="26" rx="8" fill="${WOOD_D}" stroke="${K}" stroke-width="6"/><rect x="14" y="${h - 8}" width="32" height="26" rx="8" fill="${WOOD_D}" stroke="${K}" stroke-width="6"/></svg></div>`;
}
// scribble "handwriting" lines (no readable text), drawn on with stroke-dashoffset
const SCRIB = (id, x, y, w, seed) => {
  const R = mulberry32(seed);
  let d = `M${x} ${y}`; let cx = x;
  while (cx < x + w - 20) { const s = 14 + R() * 10; d += ` q${f2(s / 2)} ${f2(-12 - R() * 10)} ${f2(s)} 0`; cx += s; if (R() < 0.18 && cx < x + w - 60) { cx += 16; d += ` m16 0`; } }
  return `<path id="${id}" d="${d}" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 1.2" stroke-dashoffset="1.1"/>`;
};
// castle silhouette, viewBox 480 x 400 (towers left/right, keep in the middle), flags via FLAG in html
const CASTLE = (fill = "#3B4670", line = K) => {
  const cren = (x0, x1, y) => { let d = ""; for (let x = x0; x < x1 - 1; x += 28) d += `M${x} ${y} h16 v-22 h-16 Z `; return d; };
  return `<svg viewBox="0 0 480 400" width="100%" height="100%" overflow="visible">
    <path d="${cren(20, 140, 120)}${cren(340, 460, 120)}${cren(160, 330, 80)}" fill="${fill}" stroke="${line}" stroke-width="6" stroke-linejoin="round"/>
    <rect x="20" y="120" width="120" height="276" fill="${fill}" stroke="${line}" stroke-width="8"/>
    <rect x="340" y="120" width="120" height="276" fill="${fill}" stroke="${line}" stroke-width="8"/>
    <rect x="150" y="80" width="180" height="316" fill="${fill}" stroke="${line}" stroke-width="8"/>
    <path d="M200 396 V300 Q240 250 280 300 V396 Z" fill="#141B33" stroke="${line}" stroke-width="7"/>
    <path d="M214 396 V306 M240 396 V284 M266 396 V306" stroke="#2A3352" stroke-width="5"/>
    <rect x="66" y="180" width="28" height="52" rx="14" fill="${YEL}" stroke="${line}" stroke-width="5"/><rect x="386" y="180" width="28" height="52" rx="14" fill="${YEL}" stroke="${line}" stroke-width="5"/>
    <rect x="226" y="130" width="28" height="52" rx="14" fill="${YEL}" stroke="${line}" stroke-width="5"/>
    <path d="M40 260 h30 M100 300 h26 M360 250 h30 M410 320 h30 M170 200 h30 M290 220 h26" stroke="#56628F" stroke-width="5" stroke-linecap="round"/></svg>`;
};
// sneaking hooded figure (own cartoon), viewBox 200 x 260, bucket carried in front
const SNEAK = (p) => `<svg viewBox="0 0 200 260" width="100%" height="100%" overflow="visible">
    <g id="${p}-legs"><path id="${p}-legL" d="M78 196 L66 246 L48 250" fill="none" stroke="${K}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
      <path id="${p}-legR" d="M118 196 L132 242 L150 236" fill="none" stroke="${K}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/></g>
    <path d="M100 14 Q160 22 164 96 L172 206 Q100 222 28 206 L38 96 Q42 22 100 14 Z" fill="#4B3B8C" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
    <path d="M100 30 Q146 36 146 92 Q140 126 100 128 Q60 126 56 92 Q56 36 100 30 Z" fill="#1A1433" stroke="${K}" stroke-width="5"/>
    <ellipse cx="86" cy="86" rx="11" ry="14" fill="#fff"/><ellipse cx="122" cy="86" rx="11" ry="14" fill="#fff"/>
    <circle id="${p}-pupL" cx="92" cy="88" r="6" fill="${K}"/><circle id="${p}-pupR" cx="128" cy="88" r="6" fill="${K}"/>
    <path d="M100 14 Q120 -6 150 8" fill="none" stroke="${K}" stroke-width="8" stroke-linecap="round"/>
    <g transform="translate(106 118) scale(.36)">${BUCKET(p + "-b").replace(/<svg[^>]*>|<\/svg>/g, "")}</g>
    <circle cx="112" cy="178" r="13" fill="#4B3B8C" stroke="${K}" stroke-width="6"/><circle cx="196" cy="178" r="13" fill="#4B3B8C" stroke="${K}" stroke-width="6"/></svg>`;
// magnifier, viewBox 260 x 300
const MAGNI = (p) => `<svg viewBox="0 0 260 300" width="100%" height="100%" overflow="visible">
    <path d="M180 196 L246 282" stroke="${K}" stroke-width="40" stroke-linecap="round"/><path d="M180 196 L246 282" stroke="${WOOD}" stroke-width="26" stroke-linecap="round"/>
    <circle cx="110" cy="110" r="100" fill="#BFE6FF" fill-opacity=".35" stroke="${K}" stroke-width="14"/><circle cx="110" cy="110" r="100" fill="none" stroke="${GOLD}" stroke-width="7"/>
    <path id="${p}-gl" d="M54 74 Q70 46 104 40" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".85"/></svg>`;
// rubber stamp tool, viewBox 260 x 220 (face at the bottom, y 196)
const STAMPTOOL = (w = 260) => `<svg viewBox="0 0 ${w} 220" width="100%" height="100%" overflow="visible">
    <circle cx="${w / 2}" cy="36" r="32" fill="${WOOD}" stroke="${K}" stroke-width="8"/><circle cx="${w / 2 - 10}" cy="26" r="9" fill="#fff" opacity=".45"/>
    <rect x="${w / 2 - 20}" y="62" width="40" height="66" fill="${WOOD_D}" stroke="${K}" stroke-width="7"/>
    <rect x="8" y="124" width="${w - 16}" height="56" rx="12" fill="${WOOD}" stroke="${K}" stroke-width="8"/><path d="M24 140 H${w - 60}" stroke="${WOOD_L}" stroke-width="7" stroke-linecap="round"/>
    <rect x="14" y="176" width="${w - 28}" height="22" rx="6" fill="${STAMP}" stroke="${K}" stroke-width="6"/></svg>`;
// laurel branch (one side), viewBox 200 x 420; mirrored for the other side
const LAUREL = () => {
  let leaves = "";
  for (let i = 0; i < 9; i++) {
    const a = (-80 + i * 20) * Math.PI / 180; const x = 190 - Math.cos(a) * 170 - 0, y = 210 + Math.sin(a) * 190;
    const rot = (-80 + i * 20) - 50;
    leaves += `<ellipse cx="${f2(x - 10)}" cy="${f2(y)}" rx="34" ry="15" transform="rotate(${rot} ${f2(x - 10)} ${f2(y)})" fill="#3FAE5A" stroke="${K}" stroke-width="5"/>`;
    leaves += `<ellipse cx="${f2(x + 18)}" cy="${f2(y + 4)}" rx="30" ry="13" transform="rotate(${-rot} ${f2(x + 18)} ${f2(y + 4)})" fill="#59C870" stroke="${K}" stroke-width="5"/>`;
  }
  let d = ""; for (let i = 0; i <= 20; i++) { const a = (-85 + i * 8.5) * Math.PI / 180; d += (i ? " L" : "M") + f2(190 - Math.cos(a) * 172) + " " + f2(210 + Math.sin(a) * 192); }
  return `<svg viewBox="0 0 200 420" width="100%" height="100%" overflow="visible"><path d="${d}" fill="none" stroke="${K}" stroke-width="12" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#2E8A45" stroke-width="5" stroke-linecap="round"/>${leaves}</svg>`;
};
// drawn question mark (a shape, not a font glyph), viewBox 300 x 520
const QMARK = (fill = YEL) => `<svg viewBox="0 0 300 520" width="100%" height="100%" overflow="visible">
    <path d="M40 150 Q40 20 150 20 Q262 20 262 140 Q262 214 196 250 Q168 268 168 320 V350 H112 V306 Q112 236 172 204 Q206 184 206 142 Q206 80 150 80 Q100 80 100 150 Z" fill="${fill}" stroke="${K}" stroke-width="14" stroke-linejoin="round"/>
    <circle cx="140" cy="440" r="44" fill="${fill}" stroke="${K}" stroke-width="14"/>
    <path d="M70 120 Q80 60 140 48" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".55"/></svg>`;
// quill (feather pen), viewBox 120 x 320, tip at (20, 312)
const QUILL = () => `<svg viewBox="0 0 120 320" width="100%" height="100%" overflow="visible">
    <path d="M20 312 L34 250 Q30 120 108 6 Q118 120 62 236 Z" fill="#fff" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M34 250 Q60 150 104 20" fill="none" stroke="${K}" stroke-width="5"/>
    <path d="M60 170 l26 -18 M52 200 l24 -14 M70 130 l24 -22 M80 96 l20 -24" stroke="#C9D3DE" stroke-width="5" stroke-linecap="round"/>
    <path d="M20 312 L30 268 L40 272 Z" fill="${K}"/></svg>`;
// pedestal (stone, gold trim), viewBox 420 x 220
const PEDESTAL = () => `<svg viewBox="0 0 420 220" width="100%" height="100%" overflow="visible">
    <rect x="20" y="10" width="380" height="44" rx="12" fill="${STONE_L}" stroke="${K}" stroke-width="8"/>
    <rect x="44" y="54" width="332" height="128" fill="${STONE}" stroke="${K}" stroke-width="8"/>
    <path d="M44 100 H376 M44 142 H376 M120 54 V100 M260 54 V100 M190 100 V142 M320 100 V142 M100 142 V182 M240 142 V182" stroke="${STONE_D}" stroke-width="6"/>
    <rect x="8" y="176" width="404" height="40" rx="12" fill="${STONE_L}" stroke="${K}" stroke-width="8"/>
    <path d="M30 24 H390" stroke="${GOLD}" stroke-width="8" stroke-linecap="round"/></svg>`;

// ---------- common CSS ----------
const STK = `filter: drop-shadow(5px 0 0 #fff) drop-shadow(-5px 0 0 #fff) drop-shadow(0 5px 0 #fff) drop-shadow(0 -5px 0 #fff) drop-shadow(0 14px 0 rgba(0,0,0,.35));`;
const FONTFACE = `@font-face{font-family:'Lilita One';src:url('assets/fonts/LilitaOne-latin.woff2') format('woff2');font-weight:400;font-style:normal;font-display:block;}`;
const abs = (l, t, w, h) => `position:absolute;left:${l}px;top:${t}px;width:${w}px;${h != null ? `height:${h}px;` : ""}`;
const LBL = (size, col = "#fff") => `font-family:'Lilita One';font-size:${size}px;line-height:1;color:${col};-webkit-text-stroke:12px ${K};paint-order:stroke fill;text-shadow:0 8px 0 rgba(0,0,0,.35);white-space:nowrap;`;

const EXD = 0.1; // exit: shrink + dim over the last 3 frames, gone exactly at the cut
function scene(id, title, start, dur, css, body, js, opts = {}) {
  const exit = opts.exit !== false, kb = opts.kb !== false;
  const html = `<template>
  <style>
    ${FONTFACE}
    #root { position: absolute; inset: 0; overflow: hidden; }
    #${id}-out, #${id}-kb { position: absolute; inset: 0; transform-origin: 540px 1060px; }
    .${id}-stk { ${STK} }
    .spk { position: absolute; }
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
${kb ? `      tl.fromTo("#${id}-kb", { scale: 1 }, { scale: 1.03, duration: ${dur}, ease: "none" }, 0);` : ""}
${js}
${exit ? `      // exit: the old picture is gone exactly at the cut, the next one is there in the same frame
      tl.to("#${id}-out", { keyframes: { opacity: [1, 1, 0.5], scale: [1, 0.95, 0.88] }, duration: ${EXD}, ease: "none" }, ${f2(dur - EXD)});` : ""}
      window.__timelines["${id}"] = tl;
    })();
  </script>
</template>
`;
  fs.writeFileSync(path.join(OUT, "compositions", `${id}.html`), html);
  return { id, title, start, dur };
}
const shake = (sel, at, a = 10, d = 0.4) => `      tl.to("${sel}", { keyframes: { x: [0, ${-a}, ${f2(a * 0.7)}, ${f2(-a * 0.4)}, 0], y: [0, ${f2(a * 0.3)}, ${f2(-a * 0.2)}, 0, 0] }, duration: ${d}, ease: "sine.inOut" }, ${at});`;
function burst(p, n, cx, cy, size, rad, seed, cols = [YEL, "#fff"]) {
  const RS = mulberry32(seed);
  const items = Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2 + RS() * 0.5; const rr = rad * (0.7 + RS() * 0.5); return { x: Math.round(Math.cos(a) * rr), y: Math.round(Math.sin(a) * rr), s: Math.round(size * (0.7 + RS() * 0.6)) }; });
  const html = items.map((it, i) => `<div id="${p}-${i}" class="spk" style="left:${cx - it.s / 2}px;top:${cy - it.s / 2}px;width:${it.s}px;height:${it.s}px;">${SPARK(cols[i % cols.length])}</div>`).join("");
  const js = (at) => items.map((it, i) => `      tl.fromTo("#${p}-${i}", { x: 0, y: 0, scale: 0, rotation: 0, opacity: 1 }, { keyframes: { x: [0, ${it.x}], y: [0, ${it.y}], scale: [0, 1.1, 0], rotation: [0, 120] }, duration: 0.6, ease: "power1.out", immediateRender: true }, ${at});`).join("\n");
  return { html, js };
}
// twinkling sparkles at fixed spots (scale pulses), stay in place
function twinkle(p, spots, d, seed) {
  const RS = mulberry32(seed);
  const html = spots.map(([x, y, s], i) => `<div id="${p}-${i}" class="spk" style="left:${x - s / 2}px;top:${y - s / 2}px;width:${s}px;height:${s}px;">${SPARK(i % 2 ? "#fff" : YEL)}</div>`).join("");
  const js = spots.map((_, i) => { const per = f2(0.6 + RS() * 0.4); return `      tl.fromTo("#${p}-${i}", { scale: 0.3, rotation: 0 }, { keyframes: { scale: [0.3, 1, 0.3], rotation: [0, 45, 90] }, duration: ${per}, ease: "sine.inOut", repeat: ${Math.max(0, Math.ceil(d / per) - 1)} }, ${f2(RS() * 0.2)});`; }).join("\n");
  return { html, js };
}

// ================= HOOK picture (frame 0 = thumbnail motif): giant bucket on a pedestal in a beam of light, two shields =================
const hookCss = (p) => `
   #${p}-beam{${abs(300, 770, 480, 620)}}
   #${p}-ped{${abs(300, 1218, 480, 170)}}
   #${p}-hb{${abs(330, 800, 420, 462)}transform-origin:50% 100%;}
   #${p}-shL{${abs(112, 930, 180, 216)}transform-origin:50% 100%;}
   #${p}-shR{${abs(788, 930, 180, 216)}transform-origin:50% 100%;}`;
const hookBody = (p) => `      <svg id="${p}-beam" viewBox="0 0 480 620" overflow="visible"><defs><linearGradient id="${p}-bg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE58A" stop-opacity=".05"/><stop offset=".7" stop-color="#FFE58A" stop-opacity=".42"/><stop offset="1" stop-color="#FFE58A" stop-opacity=".55"/></linearGradient></defs>
        <path d="M170 0 H310 L470 520 Q240 560 10 520 Z" fill="url(#${p}-bg1)"/></svg>
      <div id="${p}-ped" class="${p}-stk">${PEDESTAL()}</div>
      <div id="${p}-shL" class="${p}-stk">${SHIELD(...MOD)}</div>
      <div id="${p}-shR" class="${p}-stk">${SHIELD(...BOL)}</div>
      <div id="${p}-hb" class="${p}-stk">${BUCKET(p)}</div>`;
// idle motion of the hook picture; all moves are whole periods starting from the rest pose
const hookIdle = (p, t0, d) => {
  const n = Math.max(1, Math.round(d / 1.1));
  const per = f2(d / n);
  return `      tl.to("#${p}-hb", { keyframes: { y: [0, -16, 0], rotation: [0, -2, 0] }, duration: ${per}, ease: "sine.inOut", repeat: ${n - 1} }, ${t0});
      tl.to("#${p}-shL", { keyframes: { rotation: [0, 5, 0] }, duration: ${per}, ease: "sine.inOut", repeat: ${n - 1} }, ${t0});
      tl.to("#${p}-shR", { keyframes: { rotation: [0, -5, 0] }, duration: ${per}, ease: "sine.inOut", repeat: ${n - 1} }, ${t0});
      tl.to("#${p}-beam", { keyframes: { opacity: [1, 0.7, 1] }, duration: ${per}, ease: "sine.inOut", repeat: ${n - 1} }, ${t0});`;
};
{
  const p = "hook";
  const [s, d] = S(p);
  const tw = twinkle("hook-t", [[290, 860, 50], [800, 840, 44], [262, 1180, 40], [826, 1200, 46]], d, 1325);
  scenes.push(scene(p, "Hook: Eimer auf dem Sockel", s, d, hookCss(p), hookBody(p) + "\n      " + tw.html,
    `      // frame 0 already shows the full motif (thumbnail picture)
${hookIdle(p, 0, d)}
${tw.js}`, { kb: false }));
}

// ================= ROLLE: a parchment scroll unrolls (c02) =================
{
  const p = "rolle";
  const [s, d] = S(p);
  const W = 800, H = 470;
  const content = `<g transform="translate(40 70) scale(.62)">${BUCKET("rolle-b").replace(/<svg[^>]*>|<\/svg>/g, "")}</g>
        ${SCRIB("rolle-s1", 270, 110, 420, 11)}${SCRIB("rolle-s2", 270, 180, 380, 12)}${SCRIB("rolle-s3", 270, 250, 430, 13)}${SCRIB("rolle-s4", 60, 330, 360, 14)}
        <circle cx="620" cy="340" r="40" fill="${STAMP}" stroke="${K}" stroke-width="6"/><circle cx="620" cy="340" r="24" fill="none" stroke="#8E1219" stroke-width="5"/>`;
  scenes.push(scene(p, "Schriftrolle", s, d,
    `#rolle-sc{${abs(140, 760, W, H)}}`,
    `      <div id="rolle-sc" class="rolle-stk">${SCROLL(p, W, H, content)}</div>`,
    `      // closed scroll at the cut, unrolls from the middle
      tl.fromTo("#rolle-paper", { scaleX: 0.08 }, { scaleX: 1, duration: 0.55, ease: "power2.out" }, 0.05);
      tl.fromTo("#rolle-rl", { x: ${W / 2 - 60} }, { x: 0, duration: 0.55, ease: "power2.out" }, 0.05);
      tl.fromTo("#rolle-rr", { x: ${-(W / 2 - 60)} }, { x: 0, duration: 0.55, ease: "power2.out" }, 0.05);
      tl.fromTo("#rolle-sc", { y: 20, rotation: -2 }, { y: 0, rotation: 0, duration: 0.5, ease: "back.out(1.6)" }, 0);
${["rolle-s1", "rolle-s2", "rolle-s3", "rolle-s4"].map((id, i) => `      tl.to("#${id}", { strokeDashoffset: 0, duration: 0.45, ease: "none" }, ${f2(0.55 + i * 0.3)});`).join("\n")}
      tl.to("#rolle-sc", { keyframes: { rotation: [0, 1.5, -1.5, 0] }, duration: 1.2, ease: "sine.inOut" }, 0.8);`));
}

// ================= KARTE: parchment map with two cities (pins in the shield colours) (c03) =================
{
  const p = "karte";
  const [s, d] = S(p);
  const ML = 130, MT = 700, MW = 820, MH = 620;
  const P1 = [300, 330], P2 = [540, 370]; // local pin points
  const hills = [[120, 470], [200, 500], [620, 160], [700, 190]].map(([x, y]) => `<path d="M${x - 46} ${y + 30} L${x} ${y - 34} L${x + 46} ${y + 30} Z" fill="#B9965A" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M${x - 12} ${y - 14} L${x} ${y - 34} L${x + 12} ${y - 14}" fill="#fff" stroke="${INK}" stroke-width="4"/>`).join("");
  const map = `<svg viewBox="0 0 ${MW} ${MH}" width="${MW}" height="${MH}" overflow="visible">
      <path d="M10 18 Q200 0 410 14 Q620 2 810 20 L800 600 Q600 618 410 604 Q200 620 14 602 Z" fill="${PAPER}" stroke="${K}" stroke-width="9" stroke-linejoin="round"/>
      <path d="M40 60 Q260 90 380 200 Q470 280 640 250 Q760 230 790 300 L780 580 L40 580 Z" fill="#E7D29E"/>
      <path d="M40 60 Q260 90 380 200 Q470 280 640 250 Q760 230 790 300" fill="none" stroke="${INK}" stroke-width="5" stroke-dasharray="2 12" stroke-linecap="round"/>
      <path d="M60 120 q20 -10 40 0 t40 0 M90 160 q20 -10 40 0 t40 0 M560 120 q20 -10 40 0 t40 0" fill="none" stroke="#6FA7C9" stroke-width="5" stroke-linecap="round"/>
      <path d="M120 560 Q260 440 400 470 Q560 500 760 420" fill="none" stroke="#6FA7C9" stroke-width="12" stroke-linecap="round"/>
      ${hills}
      <path id="karte-route" d="M${P1[0]} ${P1[1]} Q${(P1[0] + P2[0]) / 2} ${P1[1] - 90} ${P2[0]} ${P2[1]}" fill="none" stroke="${STAMP}" stroke-width="8" stroke-linecap="round" stroke-dasharray="4 18" pathLength="1"/>
      <g transform="translate(700 520)"><circle r="44" fill="none" stroke="${INK}" stroke-width="5"/><path d="M0 -60 L12 0 L0 60 L-12 0 Z" fill="${INK}"/><path d="M-60 0 L0 -10 L60 0 L0 10 Z" fill="${INK}" opacity=".6"/></g></svg>`;
  const pin = (id, x, y, cols) => `<div id="${id}" style="${abs(ML + x - 60, MT + y - 230, 120, 230)}transform-origin:50% 100%;"><div id="${id}-sh" style="${abs(10, 0, 100, 120)}">${SHIELD(...cols)}</div>
      <svg style="position:absolute;left:0;top:120px;" viewBox="0 0 120 110" width="120" height="110" overflow="visible"><path d="M60 110 L40 40 A30 30 0 1 1 80 40 Z" fill="${RED}" stroke="${K}" stroke-width="7" stroke-linejoin="round"/><circle cx="60" cy="30" r="11" fill="#fff"/></svg></div>`;
  scenes.push(scene(p, "Karte mit zwei Staedten", s, d,
    `#karte-map{${abs(ML, MT, MW, MH)}}`,
    `      <div id="karte-map" class="karte-stk">${map}</div>
      ${pin("karte-p1", ...P1, MOD)}
      ${pin("karte-p2", ...P2, BOL)}`,
    `      tl.fromTo("#karte-map", { scale: 0.9, rotation: -2 }, { scale: 1, rotation: 0, duration: 0.35, ease: "back.out(1.8)" }, 0);
      tl.fromTo("#karte-p1", { scale: 0, y: -60 }, { scale: 1, y: 0, duration: 0.35, ease: "back.out(2.4)" }, 0.2);
      tl.fromTo("#karte-p2", { scale: 0, y: -60 }, { scale: 1, y: 0, duration: 0.35, ease: "back.out(2.4)" }, 0.45);
      tl.fromTo("#karte-route", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, ease: "none" }, 0.75);
      tl.to("#karte-p1", { keyframes: { y: [0, -18, 0] }, duration: 0.45, ease: "sine.inOut" }, 1.05);
      tl.to("#karte-p2", { keyframes: { y: [0, -18, 0] }, duration: 0.45, ease: "sine.inOut" }, 1.35);`));
}

// ================= SCHILDE: two shields slide in and bump into each other (c04), sparks =================
{
  const p = "schilde";
  const [s, d] = S(p);
  const b = burst("schilde-b", 9, 540, 1010, 54, 200, 704);
  scenes.push(scene(p, "Schilde prallen", s, d,
    `#schilde-l{${abs(240, 820, 290, 348)}transform-origin:50% 100%;}
     #schilde-r{${abs(550, 820, 290, 348)}transform-origin:50% 100%;}
     #schilde-fl{${abs(470, 1210, 140, 120)}}`,
    `      <div id="schilde-l" class="schilde-stk">${SHIELD(...MOD)}</div>
      <div id="schilde-r" class="schilde-stk">${SHIELD(...BOL)}</div>
      ${b.html}`,
    `      // they start apart (visible at the cut), rush together, bump, bounce back a little
      tl.fromTo("#schilde-l", { x: -40, rotation: -5 }, { x: 0, rotation: 6, duration: 0.32, ease: "power3.in" }, 0);
      tl.fromTo("#schilde-r", { x: 40, rotation: 5 }, { x: 0, rotation: -6, duration: 0.32, ease: "power3.in" }, 0);
      tl.to("#schilde-l", { x: -26, rotation: -4, duration: 0.3, ease: "back.out(2.4)" }, 0.32);
      tl.to("#schilde-r", { x: 26, rotation: 4, duration: 0.3, ease: "back.out(2.4)" }, 0.32);
${shake("#schilde-kb", 0.32, 14, 0.35)}
${b.js(0.3)}
      tl.to("#schilde-l", { keyframes: { rotation: [-4, -8, -4], y: [0, -10, 0] }, duration: 0.5, ease: "sine.inOut", repeat: 1 }, 0.65);
      tl.to("#schilde-r", { keyframes: { rotation: [4, 8, 4], y: [0, -10, 0] }, duration: 0.5, ease: "sine.inOut", repeat: 1 }, 0.7);`));
}

// ================= LEGENDE: a hooded figure tiptoes away with the bucket (c05); Klotz puts a bucket on as a helmet =================
{
  const p = "legende";
  const [s, d] = S(p);
  const steps = 6, x0 = 150, x1 = 620;
  const prints = Array.from({ length: 5 }, (_, i) => `<svg id="legende-f${i}" class="legende-fp" style="left:${x0 + 70 + i * 90}px;top:${1300 + (i % 2) * 18}px;" viewBox="0 0 50 30" width="50" height="30"><ellipse cx="25" cy="15" rx="22" ry="11" fill="#2A3360"/></svg>`).join("");
  scenes.push(scene(p, "Legende: Eimer wird geklaut", s, d,
    `#legende-moon{${abs(760, 780, 170, 170)}}
     #legende-gr{${abs(110, 1290, 860, 70)}}
     #legende-fig{${abs(x0, 1010, 220, 286)}transform-origin:50% 100%;}
     .legende-fp{position:absolute;width:50px;height:30px;}
     #legende-bush{${abs(800, 1150, 170, 150)}}`,
    `      <svg id="legende-moon" viewBox="0 0 170 170" overflow="visible"><circle cx="85" cy="85" r="78" fill="#FFF3C4" stroke="${K}" stroke-width="7"/><circle cx="58" cy="66" r="14" fill="#EAD9A0"/><circle cx="108" cy="110" r="20" fill="#EAD9A0"/><circle cx="112" cy="54" r="9" fill="#EAD9A0"/></svg>
      <svg id="legende-bush" class="legende-stk" viewBox="0 0 170 150" overflow="visible"><path d="M10 140 Q0 80 50 70 Q60 20 100 30 Q150 30 150 80 Q172 100 160 140 Z" fill="#2E7A4A" stroke="${K}" stroke-width="7" stroke-linejoin="round"/><path d="M50 100 q10 -10 20 0 M100 70 q10 -10 20 0" stroke="#4FA66A" stroke-width="6" fill="none" stroke-linecap="round"/></svg>
      <svg id="legende-gr" viewBox="0 0 860 70" overflow="visible"><path d="M0 30 Q215 0 430 26 Q645 52 860 24 L860 70 L0 70 Z" fill="#26305A" stroke="${K}" stroke-width="7" stroke-linejoin="round"/></svg>
      ${prints}
      <div id="legende-fig" class="legende-stk">${SNEAK("legende-s")}</div>`,
    `      // tiptoe: ${steps} little hops to the right, the legs swap, a footprint stays behind
      gsap.set("#legende-s-legL", { svgOrigin: "78 196" }); gsap.set("#legende-s-legR", { svgOrigin: "118 196" });
      tl.fromTo("#legende-fig", { x: 0 }, { x: ${x1 - x0}, duration: ${f2(d - 0.3)}, ease: "none" }, 0);
      tl.to("#legende-fig", { keyframes: { y: [0, -34, 0], rotation: [0, 4, 0] }, duration: ${f2((d - 0.3) / steps)}, ease: "sine.inOut", repeat: ${steps - 1} }, 0);
      tl.to("#legende-s-legL", { keyframes: { rotation: [0, -24, 0] }, duration: ${f2((d - 0.3) / steps)}, ease: "sine.inOut", repeat: ${steps - 1} }, 0);
      tl.to("#legende-s-legR", { keyframes: { rotation: [0, 24, 0] }, duration: ${f2((d - 0.3) / steps)}, ease: "sine.inOut", repeat: ${steps - 1} }, 0);
      tl.to(["#legende-s-pupL", "#legende-s-pupR"], { keyframes: { x: [0, -10, -10, 6, 0] }, duration: 1.2, ease: "none", repeat: 1 }, 0.1);
${Array.from({ length: 5 }, (_, i) => `      tl.fromTo("#legende-f${i}", { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.15 }, ${f2(0.25 + i * (d - 0.3) / steps)});`).join("\n")}
      tl.to("#legende-moon", { keyframes: { y: [0, -8, 0] }, duration: 1.4, ease: "sine.inOut", repeat: 1 }, 0);
      tl.to("#legende-bush", { keyframes: { scaleY: [1, 1.05, 1] }, duration: 0.7, ease: "sine.inOut", repeat: 3, transformOrigin: "50% 100%" }, 0);`));
}

// ================= ZITTERN: the two shields face each other and tremble, sparks fly between (c06) =================
{
  const p = "zittern";
  const [s, d] = S(p);
  const RS = mulberry32(611);
  const sp = Array.from({ length: 7 }, (_, i) => ({ x: 470 + Math.round(RS() * 140), y: 880 + Math.round(RS() * 200), s: 40 + Math.round(RS() * 30), t: f2(0.15 + i * 0.28) }));
  scenes.push(scene(p, "Schilde zittern", s, d,
    `#zittern-l{${abs(130, 840, 280, 336)}transform-origin:50% 100%;}
     #zittern-r{${abs(670, 840, 280, 336)}transform-origin:50% 100%;}
     #zittern-bk{${abs(470, 1110, 140, 154)}}
     #zittern-gl{${abs(380, 830, 320, 300)}border-radius:50%;background:radial-gradient(circle,rgba(255,59,59,.45) 0%,rgba(255,59,59,0) 68%);}`,
    `      <div id="zittern-gl"></div>
      <div id="zittern-l" class="zittern-stk">${SHIELD(...MOD)}</div>
      <div id="zittern-r" class="zittern-stk">${SHIELD(...BOL)}</div>
      <div id="zittern-bk" class="zittern-stk">${BUCKET("zittern-b")}</div>
${sp.map((q, i) => `      <div id="zittern-s${i}" class="spk" style="left:${q.x - q.s / 2}px;top:${q.y - q.s / 2}px;width:${q.s}px;height:${q.s}px;">${SPARK(i % 2 ? "#fff" : YEL)}</div>`).join("\n")}`,
    `      tl.fromTo(["#zittern-l", "#zittern-r"], { scale: 0.88 }, { scale: 1, duration: 0.3, ease: "back.out(2)" }, 0);
      // trembling: fast small x/rotation jitter, both shields leaning towards each other
      tl.to("#zittern-l", { keyframes: { x: [0, -6, 5, -4, 6, 0], rotation: [6, 4, 8, 5, 7, 6] }, duration: 0.3, ease: "none", repeat: ${Math.floor((d - 0.3) / 0.3) - 1} }, 0.15);
      tl.to("#zittern-r", { keyframes: { x: [0, 6, -5, 4, -6, 0], rotation: [-6, -4, -8, -5, -7, -6] }, duration: 0.3, ease: "none", repeat: ${Math.floor((d - 0.3) / 0.3) - 1} }, 0.15);
      tl.to("#zittern-bk", { keyframes: { y: [0, -14, 0], rotation: [0, -6, 6, 0] }, duration: 0.6, ease: "sine.inOut", repeat: 2 }, 0.2);
      tl.fromTo("#zittern-gl", { opacity: 0.4, scale: 0.8 }, { keyframes: { opacity: [0.4, 1, 0.6, 1], scale: [0.8, 1.05, 0.95, 1.05] }, duration: ${f2(d - 0.2)}, ease: "sine.inOut" }, 0);
${sp.map((q, i) => `      tl.fromTo("#zittern-s${i}", { scale: 0, rotation: 0 }, { keyframes: { scale: [0, 1.2, 0], rotation: [0, 90] }, duration: 0.4, ease: "power1.out", immediateRender: true }, ${q.t});`).join("\n")}`));
}

// ================= ZAPPOLINO: castle silhouette on a hill, flags wave (c07) - no fighting =================
{
  const p = "zappo";
  const [s, d] = S(p);
  const flags = [["zappo-fl1", 360, 780, ...MOD], ["zappo-fl2", 600, 780, ...BOL]];
  scenes.push(scene(p, "Burg bei Zappolino", s, d,
    `#zappo-hill{${abs(110, 1190, 860, 140)}}
     #zappo-cs{${abs(300, 880, 480, 400)}}
     .zappo-pole{position:absolute;width:12px;height:150px;background:#C9CFDB;border:4px solid ${K};border-radius:6px;}
     .zappo-fw{position:absolute;width:150px;height:94px;}
     #zappo-c1{${abs(130, 800, 200, 90)}} #zappo-c2{${abs(760, 830, 200, 90)}}`,
    `      <svg id="zappo-c1" viewBox="0 0 200 90" overflow="visible"><path d="M20 80 Q0 50 40 44 Q50 10 96 20 Q130 0 150 34 Q196 34 184 80 Z" fill="#3A4774" opacity=".8"/></svg>
      <svg id="zappo-c2" viewBox="0 0 200 90" overflow="visible"><path d="M20 80 Q0 50 40 44 Q50 10 96 20 Q130 0 150 34 Q196 34 184 80 Z" fill="#3A4774" opacity=".8"/></svg>
      <svg id="zappo-hill" viewBox="0 0 860 140" overflow="visible"><path d="M0 140 Q120 40 430 30 Q740 40 860 140 Z" fill="#2B6A47" stroke="${K}" stroke-width="8" stroke-linejoin="round"/><path d="M200 90 q14 -12 28 0 M600 80 q14 -12 28 0 M420 60 q14 -12 28 0" stroke="#4FA66A" stroke-width="6" fill="none" stroke-linecap="round"/></svg>
      <div id="zappo-cs" class="zappo-stk">${CASTLE()}</div>
${flags.map(([id, x, y, c1, c2]) => `      <div id="${id}-p" class="zappo-pole" style="left:${x}px;top:${y}px;"></div><div id="${id}" class="zappo-fw" style="left:${x + 14}px;top:${y}px;">${FLAG(id + "-g", c1, c2)}</div>`).join("\n")}`,
    `      tl.fromTo("#zappo-cs", { scaleY: 0.86 }, { scaleY: 1, duration: 0.35, ease: "back.out(1.8)", transformOrigin: "50% 100%" }, 0);
      tl.fromTo("#zappo-hill", { y: 30 }, { y: 0, duration: 0.3, ease: "power2.out" }, 0);
${flags.map(([id], i) => `      tl.fromTo("#${id}", { scaleX: 0.2 }, { scaleX: 1, duration: 0.3, ease: "back.out(2)", transformOrigin: "0% 50%" }, ${f2(0.2 + i * 0.12)});
      gsap.set("#${id}-g", { svgOrigin: "0 50" });
      tl.to("#${id}-g", { keyframes: { skewY: [0, 8, -6, 0], scaleX: [1, 0.94, 1.02, 1] }, duration: 0.6, ease: "none", repeat: ${Math.floor(d / 0.6) - 1} }, ${f2(i * 0.1)});`).join("\n")}
      tl.to("#zappo-c1", { x: 40, duration: ${d}, ease: "none" }, 0);
      tl.to("#zappo-c2", { x: -40, duration: ${d}, ease: "none" }, 0);`));
}

// ================= SIEG: the yellow-blue flag goes up the pole, confetti (c08) =================
{
  const p = "sieg";
  const [s, d] = S(p);
  const b = burst("sieg-b", 10, 640, 820, 48, 190, 1615, [YEL, BLUE, "#fff"]);
  scenes.push(scene(p, "Modena gewinnt", s, d,
    `#sieg-mound{${abs(330, 1260, 420, 120)}}
     #sieg-pole{${abs(450, 690, 24, 600)}background:linear-gradient(90deg,#8C95AA,#E4E8F0,#8C95AA);border:6px solid ${K};border-radius:12px;}
     #sieg-knob{${abs(440, 664, 44, 44)}border-radius:50%;background:${GOLD};border:6px solid ${K};}
     #sieg-fw{${abs(476, 720, 300, 186)}transform-origin:0% 50%;}
     #sieg-sh{${abs(160, 1010, 170, 204)}}`,
    `      <svg id="sieg-mound" viewBox="0 0 420 120" overflow="visible"><path d="M0 120 Q60 20 210 14 Q360 20 420 120 Z" fill="#2B6A47" stroke="${K}" stroke-width="8" stroke-linejoin="round"/></svg>
      <div id="sieg-pole"></div><div id="sieg-knob"></div>
      <div id="sieg-fw" class="sieg-stk">${FLAG("sieg-g", ...MOD)}</div>
      <div id="sieg-sh" class="sieg-stk">${SHIELD(...MOD)}</div>
      ${b.html}`,
    `      // the flag starts low on the pole (visible at the cut) and is hoisted
      tl.fromTo("#sieg-fw", { y: 380, scaleX: 0.6 }, { y: 0, scaleX: 1, duration: 0.6, ease: "power2.out" }, 0);
      gsap.set("#sieg-g", { svgOrigin: "0 50" });
      tl.to("#sieg-g", { keyframes: { skewY: [0, 7, -5, 0], scaleX: [1, 0.95, 1.02, 1] }, duration: 0.5, ease: "none", repeat: ${Math.floor(d / 0.5) - 1} }, 0);
      tl.fromTo("#sieg-sh", { scale: 0.7, rotation: -12 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2.4)" }, 0.1);
      tl.to("#sieg-sh", { keyframes: { y: [0, -20, 0] }, duration: 0.4, ease: "sine.inOut", repeat: 1 }, 0.6);
${b.js(0.55)}`));
}

// ================= ABER: a magnifier sweeps over the legend scroll (c09); Klotz pulls the bucket off his head =================
{
  const p = "aber";
  const [s, d] = S(p);
  const W = 780, H = 400;
  const content = `<g transform="translate(250 40) scale(.66)">${BUCKET("aber-b").replace(/<svg[^>]*>|<\/svg>/g, "")}</g>
        <path d="M60 80 h120 M60 130 h100 M60 180 h130 M520 80 h120 M540 130 h100 M520 180 h120 M60 260 h130 M540 260 h110" stroke="${INK}" stroke-width="7" stroke-linecap="round" opacity=".55"/>`;
  scenes.push(scene(p, "Lupe", s, d,
    `#aber-sc{${abs(150, 760, W, H)}}
     #aber-mg{${abs(220, 900, 260, 300)}}`,
    `      <div id="aber-sc" class="aber-stk">${SCROLL(p, W, H, content)}</div>
      <div id="aber-mg" class="aber-stk">${MAGNI(p)}</div>`,
    `      tl.fromTo("#aber-sc", { scale: 0.9 }, { scale: 1, duration: 0.3, ease: "back.out(1.8)" }, 0);
      // the magnifier searches the scroll: left, centre (stops on the bucket), right, back to the bucket
      tl.fromTo("#aber-mg", { x: -40, y: 40, rotation: -10 }, { keyframes: { x: [-40, 120, 210, 210, 420, 210], y: [40, -60, -80, -80, -40, -90], rotation: [-10, 0, 6, 6, 10, 0] }, duration: 2.0, ease: "sine.inOut" }, 0);
      tl.to("#aber-gl", { keyframes: { opacity: [0.85, 0.3, 0.85] }, duration: 0.5, ease: "sine.inOut", repeat: 3 }, 0.1);`));
}

// ================= STEMPEL: FAKT-CHECK stamp slams onto the legend scroll (c10, punchline) =================
{
  const p = "stempel";
  const [s, d] = S(p);
  const W = 820, H = 470;
  const content = `<g transform="translate(30 60) scale(.62)">${BUCKET("stempel-b").replace(/<svg[^>]*>|<\/svg>/g, "")}</g>
        ${SCRIB("stempel-s1", 250, 90, 450, 21).replace('stroke-dashoffset="1.1"', 'stroke-dashoffset="0"')}${SCRIB("stempel-s2", 250, 160, 420, 22).replace('stroke-dashoffset="1.1"', 'stroke-dashoffset="0"')}
        ${SCRIB("stempel-s3", 250, 330, 450, 23).replace('stroke-dashoffset="1.1"', 'stroke-dashoffset="0"')}`;
  const SL = 236, ST = 790, SW = 600; // stamp tool box (600 x 508 scaled from 260 x 220)
  const b = burst("stempel-b", 8, 540, 1100, 46, 300, 2024, ["#fff", YEL]);
  scenes.push(scene(p, "Fakt-Check-Stempel", s, d,
    `#stempel-sc{${abs(130, 820, W, H)}}
     #stempel-imp{${abs(170, 960, 740, 220)}transform-origin:50% 50%;}
     #stempel-it{position:absolute;left:0;top:44px;width:740px;text-align:center;font-family:'Lilita One';font-size:118px;line-height:1;color:${STAMP};letter-spacing:0.02em;}
     #stempel-tool{${abs(SL, ST, SW, Math.round(SW * 220 / 260))}transform-origin:50% 100%;}`,
    `      <div id="stempel-sc" class="stempel-stk">${SCROLL(p, W, H, content)}</div>
      <div id="stempel-imp"><svg viewBox="0 0 740 220" width="740" height="220" overflow="visible" style="position:absolute;left:0;top:0;"><rect x="10" y="10" width="720" height="200" rx="22" fill="rgba(255,255,255,.35)" stroke="${STAMP}" stroke-width="14"/><rect x="28" y="28" width="684" height="164" rx="14" fill="none" stroke="${STAMP}" stroke-width="5"/></svg><div id="stempel-it">FAKT-CHECK</div></div>
      <div id="stempel-tool" class="stempel-stk">${STAMPTOOL()}</div>
      ${b.html}`,
    `      gsap.set("#stempel-imp", { rotation: -7, opacity: 0, scale: 1.1 });
      tl.fromTo("#stempel-sc", { scale: 0.92 }, { scale: 1, duration: 0.3, ease: "back.out(1.8)" }, 0);
      // the stamp hangs above the scroll (scaled down, so it never reaches the captions), slams down, lifts away
      tl.fromTo("#stempel-tool", { scale: 0.45, y: -40, rotation: 8 }, { scale: 0.55, y: -30, rotation: -4, duration: 0.35, ease: "back.out(2)" }, 0);
      tl.to("#stempel-tool", { y: 40, scale: 0.6, rotation: -7, duration: 0.14, ease: "power4.in" }, 0.55);
      tl.to("#stempel-imp", { opacity: 1, scale: 1, duration: 0.08, ease: "power2.out" }, 0.69);
${shake("#stempel-kb", 0.69, 18, 0.4)}
${b.js(0.69)}
      tl.to("#stempel-tool", { y: -10, scale: 0.4, rotation: 14, opacity: 0, duration: 0.35, ease: "back.in(1.6)" }, 0.95);
      tl.to("#stempel-imp", { keyframes: { scale: [1, 1.05, 1] }, duration: 0.5, ease: "sine.inOut", repeat: 2 }, 1.2);`));
}

// ================= BURG: the real reason: a conquered castle, arrow ECHTER GRUND (c11); the flag changes colours =================
{
  const p = "burg";
  const [s, d] = S(p);
  scenes.push(scene(p, "Der echte Grund: eine Burg", s, d,
    `#burg-cs{${abs(560, 900, 380, 316)}}
     #burg-pole{${abs(738, 770, 12, 150)}background:#C9CFDB;border:4px solid ${K};border-radius:6px;}
     #burg-fa{${abs(752, 772, 150, 94)}transform-origin:0% 50%;} #burg-fb{${abs(752, 772, 150, 94)}transform-origin:0% 50%;}
     #burg-lb{${abs(120, 800, 520, 80)}${LBL(78, YEL)}}
     #burg-ar{${abs(170, 900, 380, 280)}}
     #burg-bk{${abs(130, 1150, 150, 165)}}`,
    `      <div id="burg-cs" class="burg-stk">${CASTLE()}</div>
      <div id="burg-pole"></div>
      <div id="burg-fa" class="burg-stk">${FLAG("burg-ga", ...BOL)}</div>
      <div id="burg-fb" class="burg-stk">${FLAG("burg-gb", ...MOD)}</div>
      <div id="burg-lb">ECHTER GRUND</div>
      <svg id="burg-ar" viewBox="0 0 380 280" overflow="visible"><path id="burg-arp" d="M40 10 Q60 200 330 210" fill="none" stroke="${K}" stroke-width="30" stroke-linecap="round"/><path d="M40 10 Q60 200 330 210" fill="none" stroke="${YEL}" stroke-width="16" stroke-linecap="round"/>
        <path d="M300 160 L372 212 L298 262 Z" fill="${YEL}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/></svg>
      <div id="burg-bk" class="burg-stk">${BUCKET("burg-b")}</div>`,
    `      tl.fromTo("#burg-cs", { scaleY: 0.85 }, { scaleY: 1, duration: 0.35, ease: "back.out(1.8)", transformOrigin: "50% 100%" }, 0);
      tl.fromTo("#burg-lb", { scale: 0.6, rotation: -6 }, { scale: 1, rotation: -3, duration: 0.3, ease: "back.out(2.4)" }, 0.15);
      tl.fromTo("#burg-ar", { scale: 0.3, opacity: 0, transformOrigin: "10% 4%" }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.8)" }, 0.3);
      tl.to("#burg-ar", { keyframes: { x: [0, 14, 0], y: [0, 6, 0] }, duration: 0.5, ease: "sine.inOut", repeat: 3 }, 0.6);
      // the bucket is only a side note: small and greyed out
      tl.fromTo("#burg-bk", { scale: 1, rotation: 0 }, { scale: 0.8, rotation: -14, opacity: 0.55, duration: 0.4, ease: "power2.out" }, 0.5);
      // the castle changes hands: red-white flag down, yellow-blue flag up (no fighting shown)
      gsap.set("#burg-fb", { scaleX: 0 });
      tl.to("#burg-fa", { scaleX: 0, duration: 0.2, ease: "back.in(2)" }, 1.25);
      tl.to("#burg-fb", { scaleX: 1, duration: 0.3, ease: "back.out(2.4)" }, 1.45);
      gsap.set(["#burg-ga", "#burg-gb"], { svgOrigin: "0 50" });
      tl.to(["#burg-ga", "#burg-gb"], { keyframes: { skewY: [0, 7, -5, 0] }, duration: 0.55, ease: "none", repeat: ${Math.floor(d / 0.55) - 1} }, 0);`));
}

// ================= PODEST: the bucket travels as a trophy onto a pedestal (c12) =================
{
  const p = "podest";
  const [s, d] = S(p);
  const tw = twinkle("podest-t", [[300, 900, 46], [790, 880, 52], [260, 1150, 40], [830, 1140, 44]], d, 2612);
  scenes.push(scene(p, "Eimer auf das Podest", s, d,
    `#podest-ped{${abs(330, 1160, 420, 220)}}
     #podest-bk{${abs(420, 880, 240, 264)}transform-origin:50% 100%;}
     #podest-bl{${abs(150, 790, 130, 300)}} #podest-br{${abs(800, 790, 130, 300)}}`,
    `      <svg id="podest-bl" class="podest-stk" viewBox="0 0 130 300" overflow="visible"><rect x="10" y="0" width="110" height="14" rx="7" fill="${WOOD_D}" stroke="${K}" stroke-width="6"/><path d="M18 10 H112 V250 L65 290 L18 250 Z" fill="${BLUE}" stroke="${K}" stroke-width="7" stroke-linejoin="round"/><path d="M42 10 V262 M88 10 V262" stroke="${YEL}" stroke-width="16"/></svg>
      <svg id="podest-br" class="podest-stk" viewBox="0 0 130 300" overflow="visible"><rect x="10" y="0" width="110" height="14" rx="7" fill="${WOOD_D}" stroke="${K}" stroke-width="6"/><path d="M18 10 H112 V250 L65 290 L18 250 Z" fill="${BLUE}" stroke="${K}" stroke-width="7" stroke-linejoin="round"/><path d="M42 10 V262 M88 10 V262" stroke="${YEL}" stroke-width="16"/></svg>
      <div id="podest-ped" class="podest-stk">${PEDESTAL()}</div>
      <div id="podest-bk" class="podest-stk">${BUCKET("podest-b")}</div>
      ${tw.html}`,
    `      tl.fromTo("#podest-ped", { scaleY: 0.8 }, { scaleY: 1, duration: 0.3, ease: "back.out(1.8)", transformOrigin: "50% 100%" }, 0);
      tl.fromTo(["#podest-bl", "#podest-br"], { scaleY: 0.3 }, { scaleY: 1, duration: 0.35, ease: "back.out(1.6)", transformOrigin: "50% 0%", stagger: 0.08 }, 0.05);
      // the bucket arrives from the left in an arc (small at the cut), lands on the pedestal and squashes
      tl.fromTo("#podest-bk", { x: -260, y: -40, scale: 0.55, rotation: -30 }, { keyframes: { x: [-260, -150, 0], y: [-40, -110, 0], scale: [0.55, 0.8, 1], rotation: [-30, -15, 0] }, duration: 0.7, ease: "power1.inOut" }, 0);
      tl.to("#podest-bk", { keyframes: { scaleY: [1, 0.86, 1.05, 1], scaleX: [1, 1.1, 0.97, 1] }, duration: 0.35, ease: "none" }, 0.7);
      tl.to("#podest-bk", { keyframes: { y: [0, -12, 0] }, duration: 0.8, ease: "sine.inOut", repeat: 1 }, 1.1);
${tw.js}`));
}

// ================= LORBEER: laurel wreath around the bucket, rays (c13) =================
{
  const p = "lorbeer";
  const [s, d] = S(p);
  const rays = Array.from({ length: 14 }, (_, i) => { const a0 = (i / 14) * 360, a1 = a0 + 12; const pt = (a) => `${(300 + Math.cos((a * Math.PI) / 180) * 300).toFixed(1)} ${(300 + Math.sin((a * Math.PI) / 180) * 300).toFixed(1)}`; return `<path d="M300 300 L${pt(a0)} L${pt(a1)} Z" fill="#FFE58A" opacity=".22"/>`; }).join("");
  scenes.push(scene(p, "Lorbeerkranz", s, d,
    `#lorbeer-rays{${abs(240, 700, 600, 600)}}
     #lorbeer-bk{${abs(395, 830, 290, 319)}}
     #lorbeer-wl{${abs(280, 760, 220, 462)}transform-origin:100% 50%;} #lorbeer-wr{${abs(580, 760, 220, 462)}transform-origin:0% 50%;}
     #lorbeer-rib{${abs(420, 1180, 240, 150)}}`,
    `      <svg id="lorbeer-rays" viewBox="0 0 600 600" overflow="visible"><g id="lorbeer-rg">${rays}</g></svg>
      <div id="lorbeer-bk" class="lorbeer-stk">${BUCKET("lorbeer-b")}</div>
      <div id="lorbeer-wl" class="lorbeer-stk">${LAUREL()}</div>
      <div id="lorbeer-wr" class="lorbeer-stk"><div style="position:absolute;inset:0;transform:scaleX(-1);">${LAUREL()}</div></div>
      <svg id="lorbeer-rib" class="lorbeer-stk" viewBox="0 0 240 150" overflow="visible"><path d="M120 20 L60 140 L40 104 L4 112 L70 10 Z" fill="${BLUE}" stroke="${K}" stroke-width="7" stroke-linejoin="round"/><path d="M120 20 L180 140 L200 104 L236 112 L170 10 Z" fill="${YEL}" stroke="${K}" stroke-width="7" stroke-linejoin="round"/><circle cx="120" cy="30" r="28" fill="${GOLD}" stroke="${K}" stroke-width="7"/></svg>`,
    `      gsap.set("#lorbeer-rg", { svgOrigin: "300 300" });
      tl.to("#lorbeer-rg", { rotation: 30, duration: ${d}, ease: "none" }, 0);
      tl.fromTo("#lorbeer-bk", { scale: 0.85 }, { scale: 1, duration: 0.3, ease: "back.out(2)" }, 0);
      tl.fromTo("#lorbeer-wl", { scaleX: 0.3, rotation: -20 }, { scaleX: 1, rotation: 0, duration: 0.4, ease: "back.out(2)" }, 0.1);
      tl.fromTo("#lorbeer-wr", { scaleX: 0.3, rotation: 20 }, { scaleX: 1, rotation: 0, duration: 0.4, ease: "back.out(2)" }, 0.18);
      tl.fromTo("#lorbeer-rib", { scale: 0, rotation: -20 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2.6)" }, 0.4);
      tl.to("#lorbeer-bk", { keyframes: { rotation: [0, -4, 4, 0] }, duration: 0.8, ease: "sine.inOut", repeat: 1 }, 0.4);`));
}

// ================= MYTHOS: a big drawn question mark wobbles, puffs around (c14) =================
{
  const p = "mythos";
  const [s, d] = S(p);
  const puffs = [[220, 960, 120], [860, 1000, 110], [300, 1240, 90], [790, 1250, 100]];
  scenes.push(scene(p, "Und der Mythos", s, d,
    `#mythos-q{${abs(410, 700, 260, 451)}transform-origin:50% 90%;}
     #mythos-sh{${abs(440, 1190, 200, 60)}border-radius:50%;background:rgba(0,0,0,.35);}
     .mythos-pf{position:absolute;}`,
    `      <div id="mythos-sh"></div>
      <div id="mythos-q" class="mythos-stk">${QMARK()}</div>
${puffs.map(([x, y, r], i) => `      <svg id="mythos-p${i}" class="mythos-pf" style="left:${x - r / 2}px;top:${y - r / 2}px;" width="${r}" height="${r}" viewBox="0 0 100 100" overflow="visible"><path d="M20 80 Q0 60 20 44 Q20 16 50 18 Q80 10 84 40 Q100 60 82 80 Z" fill="#C9D3E6" stroke="${K}" stroke-width="6" stroke-linejoin="round"/></svg>`).join("\n")}`,
    `      tl.fromTo("#mythos-q", { scale: 0.7, rotation: -14 }, { scale: 1, rotation: 0, duration: 0.35, ease: "back.out(2.6)" }, 0);
      tl.to("#mythos-q", { keyframes: { rotation: [0, 10, -8, 6, 0], y: [0, -16, 0, -10, 0] }, duration: 1.1, ease: "sine.inOut" }, 0.35);
${puffs.map((_, i) => `      tl.fromTo("#mythos-p${i}", { scale: 0.3, opacity: 0.4 }, { keyframes: { scale: [0.3, 1, 0.9], opacity: [0.4, 1, 1], y: [0, -20, -30] }, duration: 1.2, ease: "power1.out" }, ${f2(0.05 + i * 0.12)});`).join("\n")}`));
}

// ================= GEDICHT: a book opens with 1622, a quill writes (c15) =================
{
  const p = "gedicht";
  const [s, d] = S(p);
  const lines = [0, 1, 2, 3].map((i) => SCRIB(`gedicht-s${i}`, 40, 90 + i * 70, 280, 40 + i)).join("");
  scenes.push(scene(p, "Spottgedicht", s, d,
    `#gedicht-bk{${abs(150, 820, 780, 470)}}
     #gedicht-lp{${abs(0, 0, 390, 470)}}
     #gedicht-rp{${abs(390, 0, 390, 470)}transform-origin:0% 50%;}
     #gedicht-yr{position:absolute;left:0;top:150px;width:390px;text-align:center;font-family:'Lilita One';font-size:130px;line-height:1;color:${INK};}
     #gedicht-ql{${abs(700, 820, 120, 320)}transform-origin:17% 97%;}`,
    `      <div id="gedicht-bk" class="gedicht-stk">
        <svg style="position:absolute;left:-20px;top:20px;" viewBox="0 0 820 470" width="820" height="470" overflow="visible"><rect x="0" y="0" width="820" height="470" rx="24" fill="#7A2E2E" stroke="${K}" stroke-width="9"/></svg>
        <div id="gedicht-lp"><svg viewBox="0 0 390 470" width="390" height="470" overflow="visible"><path d="M10 20 Q200 0 390 30 V460 Q200 430 10 450 Z" fill="${PAPER}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/><path d="M60 110 H330 M60 380 H330" stroke="${PAPER_D}" stroke-width="6" stroke-linecap="round"/></svg><div id="gedicht-yr">1622</div></div>
        <div id="gedicht-rp"><svg viewBox="0 0 390 470" width="390" height="470" overflow="visible"><path d="M0 30 Q190 0 380 20 V450 Q190 430 0 460 Z" fill="${PAPER_L}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>${lines}</svg></div>
      </div>
      <div id="gedicht-ql" class="gedicht-stk">${QUILL()}</div>`,
    `      // the right page swings open, the year appears, the quill writes four lines
      tl.fromTo("#gedicht-rp", { scaleX: -0.2 }, { scaleX: 1, duration: 0.4, ease: "back.out(1.4)" }, 0);
      tl.fromTo("#gedicht-yr", { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2.4)" }, 0.3);
      tl.fromTo("#gedicht-bk", { scale: 0.92 }, { scale: 1, duration: 0.3, ease: "back.out(1.8)" }, 0);
${[0, 1, 2, 3].map((i) => `      tl.to("#gedicht-s${i}", { strokeDashoffset: 0, duration: 0.3, ease: "none" }, ${f2(0.45 + i * 0.32)});
      tl.fromTo("#gedicht-ql", { x: ${-150 + 0}, y: ${f2(-160 + 90 + i * 70)} }, { x: ${-150 + 260}, y: ${f2(-160 + 90 + i * 70)}, duration: 0.3, ease: "none", immediateRender: ${i === 0} }, ${f2(0.45 + i * 0.32)});`).join("\n")}
      tl.to("#gedicht-ql", { keyframes: { rotation: [0, -8, 6, -8, 6, 0] }, duration: 1.3, ease: "none" }, 0.45);`));
}

// ================= TURM: the bucket peeks out of a generic tower window (c16); Klotz stamps his own scroll =================
{
  const p = "turm";
  const [s, d] = S(p);
  const TL = 760, TT = 800, TW = 210, TH = 380; // tower box (bottom 1220, keeps clear of Klotz's scroll and stamp)
  const cren = (() => { let d2 = ""; for (let x = 0; x < TW; x += 46) d2 += `M${x} 40 h28 v-30 h-28 Z `; return d2; })();
  scenes.push(scene(p, "Eimer im Turm", s, d,
    `#turm-tw{${abs(TL, TT, TW, TH)}}
     #turm-bk{${abs(TL + 52, TT + 118, 106, 117)}}
     #turm-fp{${abs(TL + 92, TT - 50, 10, 60)}background:#C9CFDB;border:3px solid ${K};}
     #turm-moon{${abs(170, 800, 140, 140)}}
     #turm-st{${abs(340, 880, 300, 200)}}`,
    `      <svg id="turm-moon" viewBox="0 0 140 140" overflow="visible"><path d="M100 10 A64 64 0 1 0 130 100 A52 52 0 1 1 100 10 Z" fill="#FFF3C4" stroke="${K}" stroke-width="6" stroke-linejoin="round"/></svg>
      <svg id="turm-st" viewBox="0 0 300 200" overflow="visible"><g fill="#FFF3C4"><circle cx="20" cy="40" r="6"/><circle cx="140" cy="20" r="5"/><circle cx="260" cy="70" r="7"/><circle cx="80" cy="150" r="5"/><circle cx="210" cy="170" r="6"/></g></svg>
      <div id="turm-tw" class="turm-stk"><svg viewBox="0 0 ${TW} ${TH}" width="${TW}" height="${TH}" overflow="visible">
        <path d="${cren}" fill="${STONE}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
        <rect x="0" y="40" width="${TW}" height="${TH - 40}" fill="${STONE}" stroke="${K}" stroke-width="8"/>
        <path d="M0 110 H${TW} M0 250 H${TW} M0 330 H${TW} M60 40 V110 M170 40 V110 M110 250 V330 M50 330 V${TH} M180 330 V${TH}" stroke="${STONE_D}" stroke-width="6"/>
        <path d="M44 240 V150 Q105 90 166 150 V240 Z" fill="#141B33" stroke="${K}" stroke-width="8"/>
        <rect x="30" y="238" width="150" height="20" rx="6" fill="${STONE_L}" stroke="${K}" stroke-width="6"/></svg></div>
      <div id="turm-bk">${BUCKET("turm-b")}</div>
      <div id="turm-fp"></div>
      <div id="turm-fw" class="turm-stk" style="${abs(TL + 102, TT - 50, 100, 62)}">${FLAG("turm-g", ...MOD)}</div>`,
    `      tl.fromTo("#turm-tw", { scaleY: 0.85 }, { scaleY: 1, duration: 0.35, ease: "back.out(1.8)", transformOrigin: "50% 100%" }, 0);
      // the bucket peeks out of the window, ducks, peeks again
      tl.fromTo("#turm-bk", { y: 60, scale: 0.6 }, { keyframes: { y: [60, 0, 0, 40, 0], scale: [0.6, 1, 1, 0.8, 1] }, duration: 1.6, ease: "sine.inOut" }, 0.15);
      tl.to("#turm-bk", { keyframes: { rotation: [0, -8, 8, 0] }, duration: 0.6, ease: "sine.inOut" }, 1.75);
      gsap.set("#turm-g", { svgOrigin: "0 50" });
      tl.to("#turm-g", { keyframes: { skewY: [0, 8, -6, 0] }, duration: 0.6, ease: "none", repeat: ${Math.floor(d / 0.6) - 1} }, 0);
      tl.to("#turm-st", { keyframes: { opacity: [1, 0.5, 1] }, duration: 0.8, ease: "sine.inOut", repeat: 2 }, 0);`));
}

// ================= FRAGE + loop: a parchment comment bubble with a question mark, then the hook picture builds up again (c17 + c18) =================
{
  const p = "frage";
  const [s, d] = S(p);
  const LOOP = f2(C.c18[0] - s);
  const PEN0 = f2(LOOP - 0.18), BUB0 = f2(PEN0 - 0.1);
  const tail = f2(d - PEN0);
  scenes.push(scene(p, "Frage und Loop", s, d, hookCss(p) + `
     #frage-bb{${abs(170, 770, 740, 520)}}
     #frage-q{${abs(250, 830, 170, 295)}transform-origin:50% 90%;}
     #frage-bk{${abs(520, 860, 300, 330)}transform-origin:50% 100%;}`,
    hookBody(p) + `
      <svg id="frage-bb" class="frage-stk" viewBox="0 0 740 520" overflow="visible"><path d="M60 10 H680 Q730 10 730 60 V380 Q730 430 680 430 H300 L180 510 L200 430 H60 Q10 430 10 380 V60 Q10 10 60 10 Z" fill="${PAPER}" stroke="${K}" stroke-width="10" stroke-linejoin="round"/><path d="M40 40 H700" stroke="${PAPER_D}" stroke-width="6" stroke-dasharray="18 10"/></svg>
      <div id="frage-q">${QMARK(RED)}</div>
      <div id="frage-bk">${BUCKET("frage-b")}</div>`,
    `      gsap.set(["#frage-beam", "#frage-ped", "#frage-shL", "#frage-shR", "#frage-hb"], { opacity: 0 });
      tl.fromTo("#frage-bb", { scale: 0.8, rotation: -4, transformOrigin: "30% 100%" }, { scale: 1, rotation: 0, duration: 0.35, ease: "back.out(2)" }, 0);
      tl.fromTo("#frage-q", { scale: 0.4 }, { scale: 1, duration: 0.3, ease: "back.out(2.6)" }, 0.15);
      tl.fromTo("#frage-bk", { scale: 0.4, rotation: 20 }, { scale: 0.9, rotation: 0, duration: 0.3, ease: "back.out(2.6)" }, 0.25);
      tl.to("#frage-q", { keyframes: { rotation: [0, 10, -8, 0] }, duration: 0.8, ease: "sine.inOut", repeat: 1 }, 0.5);
      tl.to("#frage-bk", { keyframes: { y: [0, -16, 0], rotation: [0, -5, 0] }, duration: 0.6, ease: "sine.inOut", repeat: 2 }, 0.6);
      // loop: the bubble shrinks away and is gone in the frame the hook picture appears (the question text is still on screen)
      tl.to(["#frage-bb", "#frage-q", "#frage-bk"], { keyframes: { opacity: [1, 1, 0.5], scale: [1, 0.9, 0.75] }, duration: 0.1, ease: "none" }, ${BUB0});
      tl.set(["#frage-bb", "#frage-q", "#frage-bk"], { opacity: 0 }, ${PEN0});
      tl.set(["#frage-beam", "#frage-ped", "#frage-shL", "#frage-shR", "#frage-hb"], { opacity: 1 }, ${PEN0});
      tl.fromTo("#frage-hb", { scale: 0.8 }, { scale: 1, duration: 0.2, ease: "back.out(1.6)", immediateRender: false }, ${PEN0});
      tl.fromTo(["#frage-shL", "#frage-shR"], { scale: 0.8 }, { scale: 1, duration: 0.2, ease: "back.out(1.6)", immediateRender: false }, ${PEN0});
      tl.fromTo("#frage-ped", { scaleY: 0.8 }, { scaleY: 1, duration: 0.2, ease: "back.out(1.6)", immediateRender: false, transformOrigin: "50% 100%" }, ${PEN0});
      tl.fromTo("#frage-beam", { opacity: 0 }, { opacity: 1, duration: 0.15, ease: "power2.out", immediateRender: false }, ${PEN0});
      // the hook pose: the last frame is (nearly) frame 0 again (tail ${tail} s)`,
    { exit: false, kb: false }));
}
// ================= background: night blue, parchment dust, distant hills (all loop-seamless) =================
{
  const RS = mulberry32(1325);
  const sq = (n, minS, maxS, op) => Array.from({ length: n }, () => ({ x: Math.round(RS() * 1080), y: Math.round(RS() * 1920), s: Math.round(minS + RS() * (maxS - minS)), o: +(op * (0.6 + RS() * 0.4)).toFixed(2) }));
  const far = sq(24, 4, 8, 0.35), near = sq(12, 7, 12, 0.45);
  const tile = (fl, k) => fl.map((f) => `<circle cx="${f.x}" cy="${f.y + k * 1920}" r="${f.s / 2}" fill="#F3E2B8" opacity="${f.o}"/>`).join("");
  const stars = Array.from({ length: 30 }, () => `<circle cx="${Math.round(RS() * 1080)}" cy="${Math.round(40 + RS() * 1300)}" r="${(1.5 + RS() * 2).toFixed(1)}" fill="#fff" opacity="${(0.25 + RS() * 0.45).toFixed(2)}"/>`).join("");
  fs.writeFileSync(path.join(OUT, "compositions", "bg.html"), `<template>
  <style>
    #root { position: absolute; inset: 0; overflow: hidden; background: #0E1530; }
    #bg-sky { position: absolute; inset: 0; background: linear-gradient(180deg, #0B1230 0%, #0E1530 45%, #17214A 78%, #1C2756 100%); }
    #bg-stars { position: absolute; left: 0; top: 0; }
    #bg-glow { position: absolute; left: 140px; top: 640px; width: 800px; height: 800px; border-radius: 50%; background: radial-gradient(circle, rgba(243,226,184,.10) 0%, rgba(243,226,184,0) 65%); }
    #bg-hills { position: absolute; left: 0; top: 1460px; }
    .bg-px { position: absolute; left: 0; top: 0; }
  </style>
  <div id="root" data-composition-id="bg" data-width="1080" data-height="1920" data-layout-allow-overflow>
    <div id="bg-sky"></div>
    <svg id="bg-stars" width="1080" height="1400">${stars}</svg>
    <div id="bg-glow"></div>
    <svg id="bg-hills" width="1080" height="460" viewBox="0 0 1080 460"><path d="M0 120 Q180 40 360 100 Q560 160 760 70 Q920 10 1080 90 V460 H0 Z" fill="#141D40"/><path d="M150 90 h20 v-40 h12 v14 h12 v-14 h12 v14 h12 v-14 h12 v40 h20 v40 h-100 Z" fill="#141D40"/><path d="M0 220 Q260 150 540 210 Q820 270 1080 190 V460 H0 Z" fill="#101836"/></svg>
    <svg id="bg-p1" class="bg-px" width="1080" height="3840">${tile(far, 0)}${tile(far, 1)}</svg>
    <svg id="bg-p2" class="bg-px" width="1080" height="5760">${tile(near, 0)}${tile(near, 1)}${tile(near, 2)}</svg>
  </div>
  <script>
    (function () {
      const tl = gsap.timeline({ paused: true });
      // every move covers whole periods, so the last frame leads straight back into frame 0
      tl.fromTo("#bg-p1", { y: 0 }, { y: -1920, duration: ${DUR}, ease: "none" }, 0);
      tl.fromTo("#bg-p2", { y: 0 }, { y: -3840, duration: ${DUR}, ease: "none" }, 0);
      tl.fromTo("#bg-glow", { opacity: 1 }, { keyframes: { opacity: [1, 0.6, 1] }, duration: ${f2(DUR / 4)}, ease: "sine.inOut", repeat: 3 }, 0);
      window.__timelines["bg"] = tl;
    })();
  </script>
</template>
`);
}

// ================= captions =================
// "*" keyword (yellow Lilita, 140 px), "#" the same with tighter letters, "!" punchline (largest, 200 px). "/" line break.
// "+" glues a word to the one before (no gap, e.g. "Spott-" + "GEDICHT."): counted as one word.
// Fixed word gap: every word has 11 px margins.
const HOOKW = ["*1325.", "/", "Krieg", "wegen", "/", "eines", "#EIMERS?!"];
const caps = [
  { id: "c01", words: HOOKW, still: true },
  { id: "c02", words: ["So", "erzählt", "man", "/", "es", "jedenfalls."] },
  { id: "c03", words: ["Zwei", "Städte", "/", "in", "Italien:"] },
  { id: "c04", words: ["*MODENA", "/", "gegen", "#BOLOGNA"], shake: true },
  { id: "c05", words: ["Die", "Legende:", "/", "Ein", "Eimer", "/", "wird", "geklaut."] },
  { id: "c06", words: ["Und", "deshalb", "/", "gibt", "es", "*KRIEG."] },
  { id: "c07", words: ["Es", "kommt", "zur", "/", "Schlacht", "/", "von", "Zappolino."] },
  { id: "c08", words: ["Modena", "gewinnt."] },
  { id: "c09", words: ["Aber", "jetzt", "/", "kommt", "der", "Clou:"] },
  { id: "c10", words: ["Der", "Eimer", "/", "war", "nicht", "/", "der", "!GRUND."], shake: true },
  { id: "c11", words: ["Es", "ging", "um", "eine", "/", "eroberte", "*BURG."] },
  { id: "c12", words: ["Den", "Eimer", "/", "nahm", "Modena", "/", "*DANACH", "mit."] },
  { id: "c13", words: ["Als", "Siegertrophäe."] },
  { id: "c14", words: ["Und", "der", "Mythos?"] },
  { id: "c15", words: ["Kam", "von", "einem", "/", "Spott-", "+*GEDICHT."] },
  { id: "c16", words: ["Der", "Eimer", "blieb", "/", "in", "*MODENA."] },
  { id: "c17", words: ["Welche", "Legende", "/", "glaubst", "du", "/", "bis", "*HEUTE?"] },
  { id: "c18", words: HOOKW, loop: true },
].map((c) => ({ ...c, s: C[c.id][0], e: C[c.id][1] }));
const ST = 0.055, PD = 0.2, KD = 0.22, EXIT = 0.12;
let capHtml = "", capJs = "";
const report = [];
for (const c of caps) {
  const d = f2(c.e - c.s);
  const track = caps.indexOf(c) % 2;
  const glue = (w) => w[0] === "+";
  const core = (w) => (glue(w) ? w.slice(1) : w);
  const kind = (w) => (w === "/" ? "br" : "*!#".includes(core(w)[0]) && core(w).length > 1 ? core(w)[0] : "");
  const spans = c.words.map((w, i) => {
    const k = kind(w);
    if (k === "br") return `<br/>`;
    const txt = k ? core(w).slice(1) : core(w);
    const gl = [glue(w) ? "gl" : "", c.words[i + 1] && glue(c.words[i + 1]) ? "gr" : ""].filter(Boolean).join(" ");
    const cls = { "*": "w kw", "#": "w kw kwn", "!": "w pt", "": "w" }[k] + (gl ? " " + gl : "");
    return `<span id="${c.id}-o${i}" class="${cls}"><span id="${c.id}-w${i}" class="g">${txt}</span></span>`;
  });
  // glued words sit without whitespace between them
  let inner = "";
  spans.forEach((sp, i) => { inner += (i && !glue(c.words[i]) ? " " : "") + sp; });
  capHtml += `      <div id="${c.id}" class="cap clip" data-start="${c.s}" data-duration="${d}" data-track-index="${track}" data-layout-allow-overlap>${inner.replace(/ <br\/> /g, "<br/>")}</div>\n`;
  capJs += `      // ${c.id}\n`;
  let full = c.s, n = 0, wc = 0;
  c.words.forEach((w, i) => {
    const k = kind(w);
    if (k === "br") return;
    if (!glue(w)) wc++;
    if (c.still) { // frame 0: the whole hook line is already readable
      if (k) capJs += `      tl.to("#${c.id}-w${i}", { keyframes: { scale: [1, 1.08, 1], rotation: [0, -3, 0] }, duration: 0.4, ease: "power1.inOut" }, 0.3);\n`;
      return;
    }
    if (c.loop) { // loop copy: the whole line pops in at once and is complete before the last frames
      capJs += `      tl.fromTo("#${c.id}-w${i}", { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.15, ease: "power2.out" }, ${f2(c.s)});\n`;
      full = Math.max(full, c.s + 0.15);
      return;
    }
    const at = f2(c.s + 0.02 + n * ST);
    if (!glue(w)) n++;
    if (k) {
      capJs += `      tl.fromTo("#${c.id}-w${i}", { opacity: 0, scale: 1.15, rotation: -6 }, { opacity: 1, scale: 1, rotation: 0, duration: ${KD}, ease: "back.out(2.2)" }, ${at});\n`;
      if (c.shake) capJs += `      tl.to("#${c.id}-w${i}", { keyframes: { x: [0, -10, 10, -6, 4, 0], rotation: [0, -3, 3, -2, 0, 0] }, duration: 0.36, ease: "none" }, ${f2(at + 0.28)});\n`;
      full = Math.max(full, at + KD);
    } else {
      capJs += `      tl.fromTo("#${c.id}-w${i}", { opacity: 0, scale: 0.4, y: 26 }, { opacity: 1, scale: 1, y: 0, duration: ${PD}, ease: "back.out(1.6)" }, ${at});\n`;
      full = Math.max(full, at + PD);
    }
  });
  if (wc > 6) throw new Error(c.id + " has more than 6 words");
  if (c.loop) { report.push(`${c.id} loop copy of c01, complete @${full.toFixed(2)} (end ${c.e})`); if (full > DUR - 0.1) throw new Error("loop caption not complete before the end"); continue; }
  const ex = f2(c.e - EXIT - 0.01);
  capJs += `      tl.to("#${c.id} .g", { opacity: 0, scale: 0.85, duration: ${EXIT}, ease: "power2.in" }, ${ex});\n`;
  const readable = f2(ex - full), need = Math.max(1.1, 0.35 * wc);
  report.push(`${c.id} ${wc}w ${c.s}-${c.e} full@${full.toFixed(2)} readable ${readable}s need ${need.toFixed(2)}s ${readable >= need - 1e-6 ? "ok" : "TOO SHORT"}`);
  if (readable < need - 1e-6) throw new Error(c.id + " too short");
  if (c.still && full > 1.0) throw new Error("hook not readable by 1.0 s");
}
fs.writeFileSync(path.join(OUT, "compositions", "captions.html"), `<template>
  <style>
    ${FONTFACE}
    #root { position: absolute; inset: 0; }
    .cap { position: absolute; left: 60px; top: 300px; width: 960px; text-align: center; font-family: 'Inter', sans-serif; font-weight: 900;
      font-size: 92px; line-height: 1.12; color: #fff; letter-spacing: -0.01em; word-spacing: 0; }
    .w { display: inline-block; margin: 0 11px; -webkit-text-stroke: 16px ${K}; paint-order: stroke fill; text-shadow: 0 9px 0 #050814; }
    .w.gl { margin-left: 0; } .w.gr { margin-right: 0; }
    .g { display: inline-block; }
    .kw { font-family: 'Lilita One'; font-weight: 400; color: ${YEL}; font-size: 140px; line-height: 1.0; text-transform: uppercase; letter-spacing: 0.01em; }
    .kwn { letter-spacing: -0.04em; }
    .pt { font-family: 'Lilita One'; font-weight: 400; color: ${YEL}; font-size: 200px; line-height: 0.95; letter-spacing: 0; -webkit-text-stroke: 24px ${K}; text-shadow: 0 14px 0 #050814; }
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

// ================= Klotz (rig from Folge 1-6; new gag: bucket as a knight's helmet, later a FAKT-CHECK stamp) =================
// eyes always open: no mood closes the lids, there is no wink in this episode
// the right arm never points to the right (its hand would pass x 1000): raised arms swing up behind the body (aR 190-200)
const M = {
  shock:     { eye: 1.12, ps: 0.6, px: 0, py: 0, bL: -18, bR: -18, tL: -6, tR: -6, mx: 1, my: 1.1, g: 0, aL: 70, aR: -45 },
  surprised: { eye: 1.08, ps: 0.8, px: 0, py: 6, bL: -16, bR: -16, tL: 0, tR: 0, mx: 0.55, my: 0.6, g: 0, aL: 55, aR: -45 },
  curious:   { eye: 1.05, ps: 1.1, px: -14, py: -10, bL: -18, bR: -4, tL: 0, tR: 0, mx: 0.5, my: 0.35, g: 0, aL: 40, aR: -40 },
  impressed: { eye: 1.05, ps: 0.9, px: -6, py: -4, bL: -12, bR: -12, tL: -4, tR: -4, mx: 0.45, my: 0.45, g: 0, aL: 40, aR: -40 },
  look:      { eye: 1.06, ps: 1.0, px: -14, py: -12, bL: -14, bR: -14, tL: -4, tR: -4, mx: 0.5, my: 0.5, g: 0, aL: 40, aR: -40 },
  proud:     { eye: 1.05, ps: 1.0, px: 0, py: -2, bL: -14, bR: -14, tL: -4, tR: -4, mx: 0, my: 0, g: 1, gs: 0.75, aL: 30, aR: -30 },
  jawdrop:   { eye: 1.18, ps: 0.55, px: -6, py: -8, bL: -22, bR: -22, tL: -4, tR: -4, mx: 1.1, my: 1.7, jy: 14, g: 0, aL: 60, aR: -45 },
  happy:     { eye: 1.04, ps: 1, px: 0, py: 0, bL: -10, bR: -10, tL: -4, tR: -4, mx: 0, my: 0, g: 1, gs: 0.8, aL: 35, aR: -35 },
  cheer:     { eye: 1.05, ps: 1, px: 0, py: -4, bL: -16, bR: -16, tL: -6, tR: -6, mx: 0, my: 0, g: 1, gs: 0.9, aL: 160, aR: 200 },
  helm:      { eye: 1.05, ps: 1, px: 0, py: 0, bL: -10, bR: -10, tL: 0, tR: 0, mx: 0.45, my: 0.5, g: 0, aL: 25, aR: -25 },
  grope:     { eye: 1.05, ps: 1, px: 0, py: 0, bL: -10, bR: -10, tL: 0, tR: 0, mx: 0.6, my: 0.4, g: 0, aL: 105, aR: -30 },
  stamp:     { eye: 1.1, ps: 0.9, px: -16, py: 4, bL: -6, bR: -18, tL: 8, tR: -4, mx: 0, my: 0, g: 1, gs: 0.6, aL: 150, aR: -40 },
};
const LOOPK = C.c18[0];
const HELM_ON = f2(C.c05[0] + 0.6), HELM_OFF = f2(C.c09[0] + 0.25);
const STAMP_T = f2(C.c16[0] + 0.3); // stamp gag start
const moods = [
  [C.c02[0], "curious"], [C.c03[0], "look"], [C.c04[0], "surprised"], [C.c05[0], "look"],
  [HELM_ON + 0.25, "helm"], [C.c06[0], "grope"], [C.c07[0] + 0.1, "helm"], [C.c08[0], "cheer"],
  [HELM_OFF + 0.2, "shock"], [C.c10[0] + 0.6, "jawdrop"], [C.c11[0], "impressed"], [C.c12[0], "happy"], [C.c13[0], "proud"],
  [C.c14[0], "curious"], [C.c15[0], "look"], [STAMP_T, "stamp"], [C.c16[1] - 0.3, "happy"], [C.c17[0] + 0.3, "curious"], [LOOPK + 0.08, "shock"],
];

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
  <g id="k-sweat"><path d="M262 92 Q276 112 270 124 Q262 132 254 124 Q248 112 262 92 Z" fill="#9FD3FF" stroke="#2A4A7A" stroke-width="4"/></g>
  <g id="k-helm" class="k-prop">
    <path d="M36 196 Q150 372 264 196" fill="none" stroke="${K}" stroke-width="16" stroke-linecap="round"/><path d="M36 196 Q150 372 264 196" fill="none" stroke="${IRON}" stroke-width="8" stroke-linecap="round"/>
    <path d="M28 202 L60 16 Q150 -4 240 16 L272 202 Q150 222 28 202 Z" fill="${WOOD}" stroke="${K}" stroke-width="9" stroke-linejoin="round"/>
    <path d="M28 202 L60 16 Q76 12 92 10 L68 206 Z" fill="${WOOD_D}" opacity=".45"/>
    <path d="M84 20 L66 204 M120 14 L114 208 M180 14 L186 208 M216 20 L234 204" stroke="${WOOD_D}" stroke-width="5"/>
    <path d="M44 120 L256 120 L262 150 L38 150 Z" fill="${IRON}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M58 40 L242 40 L246 64 L54 64 Z" fill="${IRON}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M26 192 Q150 214 274 192 L276 214 Q150 236 24 214 Z" fill="${WOOD_D}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
    <circle cx="36" cy="200" r="11" fill="${IRON}" stroke="${K}" stroke-width="5"/><circle cx="264" cy="200" r="11" fill="${IRON}" stroke="${K}" stroke-width="5"/>
  </g>
</svg>`;
// the scroll on a little easel left of Klotz (FAKT-CHECK imprint at 72 px, inside y 280-1500), and the stamp he uses
const kScroll = `<svg viewBox="0 0 280 520" width="280" height="520" overflow="visible">
    <path d="M40 230 L14 516 M240 230 L266 516 M140 230 V516" stroke="${K}" stroke-width="16" stroke-linecap="round"/><path d="M40 230 L14 516 M240 230 L266 516 M140 230 V516" stroke="${WOOD_D}" stroke-width="8" stroke-linecap="round"/>
    <rect x="12" y="20" width="256" height="210" fill="${PAPER}" stroke="${K}" stroke-width="8"/>
    <rect x="0" y="0" width="280" height="32" rx="16" fill="${PAPER_D}" stroke="${K}" stroke-width="7"/><rect x="0" y="222" width="280" height="32" rx="16" fill="${PAPER_D}" stroke="${K}" stroke-width="7"/>
    <path d="M40 70 h90 M40 110 h150 M40 190 h120" stroke="${INK}" stroke-width="6" stroke-linecap="round" opacity=".4"/></svg>`;
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
      tl.to("#k-armL", { rotation: ${p.aL}, duration: ${f2(dur * 1.3)}, ease: "power3.out" }, ${f2(t + 0.04)});
      tl.to("#k-armR", { rotation: ${p.aR}, duration: ${f2(dur * 1.3)}, ease: "power3.out" }, ${f2(t + 0.08)});
`;
};
const p0 = M.shock;
kJs += `      gsap.set("#k-armL", { svgOrigin: "48 190" }); gsap.set("#k-armR", { svgOrigin: "252 190" });
      gsap.set(["#k-eyeL"], { svgOrigin: "108 140" }); gsap.set(["#k-eyeR"], { svgOrigin: "192 140" });
      gsap.set("#k-pupL", { svgOrigin: "108 142" }); gsap.set("#k-pupR", { svgOrigin: "192 142" });
      gsap.set("#k-lidL", { svgOrigin: "108 90" }); gsap.set("#k-lidR", { svgOrigin: "192 90" });
      gsap.set("#k-browL", { svgOrigin: "109 81" }); gsap.set("#k-browR", { svgOrigin: "191 81" });
      gsap.set("#k-mouth", { svgOrigin: "150 228" }); gsap.set("#k-grin", { svgOrigin: "150 230" });
      gsap.set("#k-sweat", { svgOrigin: "262 92", opacity: 0, scale: 0 });
      gsap.set("#k-helm", { svgOrigin: "150 210", opacity: 0, y: -90 });
      gsap.set("#k-scroll", { opacity: 0, scale: 0, transformOrigin: "50% 100%" }); gsap.set("#k-imp", { opacity: 0, scale: 1.4, rotation: -8 });
      gsap.set("#k-stamp", { opacity: 0, scale: 0, transformOrigin: "50% 100%" });
      gsap.set(["#k-eyeL", "#k-eyeR"], { scale: ${p0.eye} });
      gsap.set(["#k-pupL", "#k-pupR"], { x: 0, y: 0, scale: ${p0.ps} });
      gsap.set(["#k-lidL", "#k-lidR"], { scaleY: 0 });
      gsap.set("#k-browL", { y: ${p0.bL}, rotation: ${p0.tL} }); gsap.set("#k-browR", { y: ${p0.bR}, rotation: ${-p0.tR} });
      gsap.set("#k-mouth", { scaleX: ${p0.mx}, scaleY: ${p0.my}, y: 0, opacity: 1 }); gsap.set("#k-grin", { scale: 0.2, opacity: 0 });
      gsap.set("#k-armL", { rotation: ${p0.aL} }); gsap.set("#k-armR", { rotation: ${p0.aR} });
      gsap.set("#k-wrap", { x: 0, y: 0, rotation: 0, scale: 1 }); gsap.set("#k-sq", { scaleX: 1, scaleY: 1 });
      // idle bob: whole half-cycles over the film, ends where it starts
      tl.fromTo("#k-bob", { y: 0 }, { y: -12, duration: ${(DUR / 80).toFixed(5)}, ease: "sine.inOut", yoyo: true, repeat: 79 }, 0);
      // hook: shocked jump
      tl.to("#k-wrap", { keyframes: { y: [0, -18, 0, -8, 0] }, duration: 0.6, ease: "none" }, 0.3);
`;
for (const [t, m] of moods) {
  kJs += `      // ${m} @ ${f2(t)}\n`;
  kJs += `      tl.to("#k-sq", { keyframes: { scaleY: [1, 0.9, 1.06, 1], scaleX: [1, 1.07, 0.97, 1] }, duration: 0.3, ease: "none" }, ${f2(t - 0.05)});\n`;
  kJs += setMood(m, f2(t + 0.03), 0.22);
}
// GAG 1: the bucket comes down from above onto Klotz's head: a knight's helmet; he sees nothing and stumbles
const STUMBLE0 = f2(HELM_ON + 0.5), STUMBLE1 = f2(C.c08[0] - 0.1);
const stN = Math.floor((STUMBLE1 - STUMBLE0) / 0.8);
kJs += `      // GAG 1: bucket helmet on (${HELM_ON})
      tl.to("#k-armL", { rotation: 165, duration: 0.18, ease: "power2.out" }, ${f2(HELM_ON - 0.15)});
      tl.to("#k-armR", { rotation: 195, duration: 0.18, ease: "power2.out" }, ${f2(HELM_ON - 0.15)});
      tl.to("#k-helm", { opacity: 1, duration: 0.12 }, ${HELM_ON});
      tl.to("#k-helm", { y: 0, duration: 0.25, ease: "power2.in" }, ${HELM_ON});
      tl.to("#k-sq", { keyframes: { scaleY: [1, 0.84, 1.05, 1], scaleX: [1, 1.1, 0.97, 1] }, duration: 0.35, ease: "none" }, ${f2(HELM_ON + 0.18)});
      // he cannot see: small stumbling steps on the spot (x stays within +-18 px), tilting
      tl.to("#k-wrap", { keyframes: { x: [0, -18, -8, 6, 2, 0], rotation: [0, -7, -2, 4, 1, 0], y: [0, -10, 0, -10, 0, 0] }, duration: 0.8, ease: "none", repeat: ${stN - 1} }, ${STUMBLE0});
      tl.to("#k-sweat", { opacity: 1, scale: 1, duration: 0.2, ease: "back.out(2)" }, ${f2(C.c06[0] + 0.2)});
      tl.to("#k-sweat", { keyframes: { y: [0, 30] }, duration: 0.5, ease: "power1.in", repeat: 2 }, ${f2(C.c06[0] + 0.4)});
      tl.to("#k-sweat", { opacity: 0, scale: 0, y: 0, duration: 0.15 }, ${f2(C.c07[0] + 0.1)});
      // c08: cheering blindly (arms up, hopping)
      tl.to("#k-wrap", { keyframes: { y: [0, -24, 0, -18, 0], rotation: [0, 4, 0, -4, 0] }, duration: 0.8, ease: "none" }, ${f2(C.c08[0] + 0.1)});
      // c09: pulls the bucket off (${HELM_OFF}): arms up, the helmet pops up and away (fades, does not fly into the picture)
      tl.to("#k-armL", { rotation: 170, duration: 0.15, ease: "power2.out" }, ${f2(HELM_OFF - 0.15)});
      tl.to("#k-armR", { rotation: 190, duration: 0.15, ease: "power2.out" }, ${f2(HELM_OFF - 0.15)});
      tl.to("#k-helm", { keyframes: { y: [0, -40, -90], rotation: [0, -10, -30], scale: [1, 0.9, 0.4], opacity: [1, 1, 0] }, duration: 0.3, ease: "power2.out" }, ${HELM_OFF});
      tl.to("#k-sq", { keyframes: { scaleY: [1, 1.12, 0.94, 1], scaleX: [1, 0.94, 1.05, 1] }, duration: 0.35, ease: "none" }, ${HELM_OFF});
      // GAG 2 (${STAMP_T}): a scroll on an easel pops up left of him, he grabs a stamp and stamps FAKT-CHECK on it, then grins
      tl.to("#k-scroll", { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2)" }, ${f2(STAMP_T - 0.25)});
      tl.fromTo("#k-stamp", { x: 0, y: 0, rotation: 0 }, { opacity: 1, scale: 1, duration: 0.2, ease: "back.out(2.4)", immediateRender: false }, ${STAMP_T});
      tl.to("#k-stamp", { x: -150, y: -40, rotation: -12, duration: 0.3, ease: "power2.out" }, ${f2(STAMP_T + 0.2)});
      tl.to("#k-stamp", { y: 30, rotation: 0, duration: 0.12, ease: "power4.in" }, ${f2(STAMP_T + 0.6)});
      tl.to("#k-wrap", { keyframes: { rotation: [0, -9, -6], y: [0, -16, 0] }, duration: 0.3, ease: "none" }, ${f2(STAMP_T + 0.45)});
      tl.to("#k-imp", { opacity: 1, scale: 1, duration: 0.08, ease: "power2.out" }, ${f2(STAMP_T + 0.72)});
      tl.to("#k-scroll", { keyframes: { y: [0, 8, 0], scaleY: [1, 0.96, 1] }, duration: 0.2, ease: "none" }, ${f2(STAMP_T + 0.72)});
      tl.to("#k-stamp", { x: 0, y: 0, rotation: 10, scale: 0, opacity: 0, duration: 0.3, ease: "back.in(1.6)" }, ${f2(STAMP_T + 0.95)});
      tl.to("#k-wrap", { rotation: 0, y: 0, duration: 0.25, ease: "back.out(1.6)" }, ${f2(STAMP_T + 0.95)});
      tl.to("#k-wrap", { keyframes: { y: [0, -20, 0] }, duration: 0.35, ease: "none" }, ${f2(STAMP_T + 1.3)});
      tl.to("#k-scroll", { opacity: 0, scale: 0, duration: 0.2, ease: "back.in(2)" }, ${f2(C.c16[1] - 0.25)});
      // loop (${LOOPK}): frame-0 shock pose with the jump
      tl.to("#k-wrap", { keyframes: { y: [0, -22, 0] }, duration: 0.3, ease: "none" }, ${f2(LOOPK + 0.05)});
`;
fs.writeFileSync(path.join(OUT, "compositions", "klotz.html"), `<template>
  <style>
    ${FONTFACE}
    #root { position: absolute; inset: 0; pointer-events: none; }
    #k-pod { position: absolute; left: 650px; top: 1748px; width: 350px; height: 120px; }
    #k-wrap { position: absolute; left: 700px; top: 1480px; width: 260px; height: 286px; transform-origin: 50% 100%; }
    #k-bob, #k-sq { position: absolute; inset: 0; transform-origin: 50% 100%; }
    #k-scroll { position: absolute; left: 400px; top: 1230px; width: 280px; height: 520px; }
    #k-imp { position: absolute; left: 30px; top: 46px; width: 220px; height: 166px; }
    #k-impt { position: absolute; left: 0; top: 12px; width: 220px; text-align: center; font-family: 'Lilita One'; font-size: 72px; line-height: 0.98; color: ${STAMP}; }
    #k-stamp { position: absolute; left: 650px; top: 1300px; width: 200px; height: 169px; }
  </style>
  <div id="root" data-composition-id="klotz" data-width="1080" data-height="1920" data-layout-allow-overflow>
    <div id="k-pod"><svg viewBox="0 0 350 120" width="100%" height="100%" overflow="visible"><rect x="10" y="10" width="330" height="104" rx="12" fill="${STONE}" stroke="${K}" stroke-width="8"/><path d="M10 46 H340 M10 80 H340 M90 10 V46 M200 10 V46 M300 10 V46 M140 46 V80 M250 46 V80 M60 80 V114 M180 80 V114 M290 80 V114" stroke="${STONE_D}" stroke-width="6"/><rect x="10" y="10" width="330" height="18" rx="8" fill="${GOLD}" stroke="${K}" stroke-width="6"/></svg></div>
    <div id="k-scroll" class="k-prop">${kScroll}<div id="k-imp"><svg viewBox="0 0 220 166" width="220" height="166" overflow="visible" style="position:absolute;left:0;top:0;"><rect x="4" y="4" width="212" height="158" rx="14" fill="none" stroke="${STAMP}" stroke-width="9"/></svg><div id="k-impt">FAKT-<br/>CHECK</div></div></div>
    <div id="k-wrap"><div id="k-bob"><div id="k-sq">
${klotzSvg}
    </div></div></div>
    <div id="k-stamp" class="k-prop">${STAMPTOOL()}</div>
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
const c = (id) => C[id][0];
const sfx = [
  [0.0, "impact", 0.35], [0.0, "choir", 0.35], [0.05, "knock", 0.45], [0.3, "boing", 0.35], [0.6, "sparkle", 0.3],
  [c("c02"), "whoosh1", 0.4], [c("c02") + 0.05, "unroll", 0.55], [c("c02") + 0.6, "scratch", 0.35],
  [c("c03"), "whoosh2", 0.35], [c("c03") + 0.2, "pop1", 0.4], [c("c03") + 0.45, "pop2", 0.4], [c("c03") + 0.75, "scratch", 0.3],
  [c("c04"), "whoosh1", 0.4], [c("c04") + 0.32, "clang", 0.4], [c("c04") + 0.34, "sparkle", 0.35],
  [c("c05"), "whoosh2", 0.35], [c("c05") + 0.05, "tiptoe", 0.5], [c("c05") + 0.35, "whistle", 0.25], [HELM_ON, "whoosh1", 0.3], [HELM_ON + 0.22, "bonk", 0.35],
  [c("c06"), "rattle", 0.5], [c("c06") + 0.15, "sparkle", 0.3], [c("c06") + 0.9, "knock", 0.35], [c("c06") + 1.5, "knock", 0.3],
  [c("c07"), "whoosh2", 0.35], [c("c07") + 0.1, "horn", 0.3], [c("c07") + 0.2, "flap", 0.35], [c("c07") + 1.0, "knock", 0.3], [c("c07") + 1.8, "knock", 0.3],
  [c("c08"), "fanfare", 0.4], [c("c08") + 0.55, "confetti", 0.45], [c("c08") + 0.15, "jump", 0.3],
  [c("c09"), "whoosh1", 0.35], [HELM_OFF, "cork", 0.55], [c("c09") + 0.6, "hmm", 0.4],
  [c("c10") - 0.02, "whoosh2", 0.3], [c("c10") + 0.69, "stamp", 0.4], [c("c10") + 0.7, "impact", 0.25], [c("c10") + 0.72, "sparkle", 0.3],
  [c("c11"), "whoosh1", 0.35], [c("c11") + 0.15, "pop1", 0.4], [c("c11") + 0.3, "swish", 0.35], [c("c11") + 1.25, "pop2", 0.35], [c("c11") + 1.45, "horn", 0.35],
  [c("c12"), "whoosh2", 0.4], [c("c12") + 0.7, "knock", 0.5], [c("c12") + 0.72, "ding", 0.4],
  [c("c13"), "choir", 0.45], [c("c13") + 0.1, "swish", 0.35], [c("c13") + 0.4, "sparkle", 0.35],
  [c("c14"), "boing", 0.4], [c("c14") + 0.05, "hmm", 0.35],
  [c("c15"), "page", 0.5], [c("c15") + 0.3, "pop1", 0.35], [c("c15") + 0.45, "scratch", 0.45],
  [c("c16"), "whoosh2", 0.35], [STAMP_T - 0.25, "pop2", 0.4], [STAMP_T + 0.72, "stamp", 0.4], [STAMP_T + 1.3, "ding", 0.35],
  [c("c17"), "pop1", 0.4], [c("c17") + 0.15, "pop2", 0.35], [c("c17") + 0.55, "hmm", 0.3],
  [LOOPK - 0.2, "whoosh2", 0.4], [LOOPK - 0.15, "impact", 0.35],
].map(([t, n, v]) => [f2(t), n, v]).filter(([t, , v]) => v > 0 && t < DUR - 0.05);
const wavDur = (n) => { const st = fs.statSync(path.join(OUT, "assets", "sfx", n + ".wav")); return f2((st.size - 44) / (44100 * 4)); };
const lanes = [];
const sfxTags = sfx.slice().sort((a, b) => a[0] - b[0]).map(([t, n, v], i) => {
  const dd = f2(Math.min(wavDur(n), DUR - t));
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
      <audio id="music-lute" class="clip" src="assets/sfx/music.wav" data-start="0" data-duration="${DUR}" data-track-index="5" data-volume="0.55"></audio>
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
fs.writeFileSync(path.join(OUT, "tools", "cuts.txt"), scenes.slice(1).map((s) => s.start).join(","));
console.log(report.join("\n"));
console.log("written", scenes.length, "scenes,", sfx.length, "sfx, lanes", lanes.length, "DUR", DUR, "cuts", scenes.slice(1).map((s) => s.start).join(","));
