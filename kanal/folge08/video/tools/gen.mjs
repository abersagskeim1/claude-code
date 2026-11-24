// Generator for Folge 8 "Der Kuchen-Krieg": writes index.html and compositions/*.html
// Usage: node tools/gen.mjs <project_dir>
// Technique from Folge 1-7 (scene helper, Klotz rig, captions with fixed word gap, id checks, exit before the cut).
// New in Folge 8: pastel patisserie look on night blue. Own drawings: fruit tartlet on a cake stand (hero), simplified
// tricolour flags without any emblem (France blue-white-red, Mexico green-white-red), calendar sheet + cactus, patisserie
// shop front with PATISSERIE sign, the same shop emptied (crumbs), price tag "< 1.000", receipt rolling out with 60.000,
// pointing glove, note pile, giant note tower, harbour with sailing-ship silhouettes, balance scale (tartlet vs. receipts),
// cake slice with rays, handshake + coins over a scale, stage curtain, single riding boot on a cushion, small gravestone
// with a boot engraving and a flower, comment bubble with a cake slice.
// Klotz gag: pastry-chef toque, defends one tartlet, chokes on a crumb when the bill grows, salutes confused at the
// grave, finally eats the tartlet himself in protest. No fighting, no cannons, no injuries, no casualties.
// All graphics stay in x 80-1000 and in y 760-1340 (under the captions, above Klotz's toque).
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
const YEL = "#FFD23F", GOLD = "#F2B705", GOLD_D = "#B07A00", RED = "#FF3B3B";
const PINK = "#FFB3C7", PINK_D = "#E07A98", MINT = "#9FE3C9", MINT_D = "#5DBF9C", LAV = "#C7B8FF", LAV_D = "#8F7FD6";
const CREAM = "#FFF1D6", PEACH = "#FFC9A3", CRUST = "#E9A65A", CRUST_D = "#C7843A", STRAW = "#FF4D6D";
const CHOC = "#7A4428", CHOC_D = "#4A2414", PAPER = "#FFFDF4", PAPER_D = "#D8D2C0", INKC = "#4A4E6A";
const FR = ["#2F5BD3", "#FFFFFF", "#E63946"], MX = ["#1F9D55", "#FFFFFF", "#D62828"];
const STONE = "#A9A7C7", STONE_D = "#7B79A0", STONE_L = "#CFCDE6", STAMP = "#D7262E";

// ================= timing: one row per caption; one scene per caption; cuts on whole tenths =================
// a caption with n words needs n x 0.35 s (min 1.1 s) fully readable + the word pop-in + the exit
const CD = [["c01", 2.0], ["c02", 2.4], ["c03", 2.4], ["c04", 1.8], ["c05", 2.4], ["c06", 2.1], ["c07", 2.4], ["c08", 2.4], ["c09", 1.6],
  ["c10", 2.4], ["c11", 2.1], ["c12", 2.4], ["c13", 2.1], ["c14", 2.0], ["c15", 2.0], ["c15b", 1.6], ["c16", 2.8], ["c17", 2.3], ["c18", 0.6]];
const C = {};
{ let t = 0; for (const [id, d] of CD) { C[id] = [f2(t), f2(t + d)]; t += d; } }
export const DUR = C.c18[1];
const LAST = f2(DUR - 1 / 30); // time of the last frame: all loop cycles end here, so it equals frame 0
const T = {
  hook: C.c01, kal: C.c02, laden: C.c03, leer: C.c04, preis: C.c05, rechn: C.c06, anlass: C.c07, zettel: C.c08, stapel: C.c09,
  hafen: C.c10, waage: C.c11, torte: C.c12, frieden: C.c13, vorhang: C.c14, stiefel: [C.c15[0], C.c15b[1]], grab: C.c16, frage: [C.c17[0], DUR],
};
const S = (k) => [T[k][0], f2(T[k][1] - T[k][0])];
const scenes = [];

// ================= drawings (own designs) =================
const SPARK = (col = YEL) => `<svg viewBox="0 0 100 100" width="100%" height="100%" overflow="visible"><path d="M50 2 Q56 44 98 50 Q56 56 50 98 Q44 56 2 50 Q44 44 50 2 Z" fill="${col}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/></svg>`;
const inner = (svg) => svg.replace(/<svg[^>]*>|<\/svg>/g, "");

// fruit tartlet, viewBox 200 x 170
const TART = (fruit = STRAW) => `<svg viewBox="0 0 200 170" width="100%" height="100%" overflow="visible">
    <path d="M14 96 L36 156 Q100 170 164 156 L186 96 Z" fill="${CRUST}" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M44 106 L56 154 M72 104 L78 160 M100 104 V162 M128 104 L122 160 M156 106 L144 154" stroke="${CRUST_D}" stroke-width="5" stroke-linecap="round"/>
    <path d="M10 98 Q16 62 58 64 Q68 36 100 42 Q132 36 142 64 Q184 62 190 98 Q100 118 10 98 Z" fill="${CREAM}" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M34 84 Q50 74 66 80 M124 78 Q140 72 160 82" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M100 22 Q130 10 134 38 Q132 64 100 76 Q68 64 66 38 Q70 10 100 22 Z" fill="${fruit}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
    <ellipse cx="86" cy="40" rx="3" ry="5" fill="#FFE08A"/><ellipse cx="112" cy="36" rx="3" ry="5" fill="#FFE08A"/><ellipse cx="100" cy="56" rx="3" ry="5" fill="#FFE08A"/><ellipse cx="120" cy="54" rx="3" ry="5" fill="#FFE08A"/><ellipse cx="80" cy="56" rx="3" ry="5" fill="#FFE08A"/>
    <path d="M100 22 Q92 6 80 10 Q90 16 100 22 Q108 4 122 8 Q112 16 100 22 Z" fill="#3FAE5A" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>
    <ellipse cx="82" cy="30" rx="7" ry="4" fill="#fff" opacity=".6" transform="rotate(-30 82 30)"/></svg>`;
// cake stand, viewBox 360 x 240
const STAND = () => `<svg viewBox="0 0 360 240" width="100%" height="100%" overflow="visible">
    <path d="M150 46 H210 L224 196 H136 Z" fill="${LAV}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
    <path d="M166 56 L160 186" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".5"/>
    <ellipse cx="180" cy="208" rx="96" ry="26" fill="${LAV_D}" stroke="${K}" stroke-width="8"/>
    <ellipse cx="180" cy="34" rx="172" ry="28" fill="${MINT}" stroke="${K}" stroke-width="8"/>
    <path d="M14 38 Q30 62 50 50 Q70 70 92 54 Q114 72 136 56 Q158 74 180 58 Q202 74 224 56 Q246 72 268 54 Q290 70 310 50 Q330 62 346 38" fill="${MINT_D}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
    <ellipse cx="120" cy="26" rx="50" ry="7" fill="#fff" opacity=".55"/></svg>`;
// simplified tricolour flag (three vertical bands, no emblem), viewBox 240 x 160, waving; unique clip id
const FLAG3 = (id, cols, emb = false) => {
  const wave = "M0 10 Q60 -8 120 10 T240 10 V150 Q180 168 120 150 T0 150 Z";
  return `<svg viewBox="0 0 240 160" width="100%" height="100%" overflow="visible"><defs><clipPath id="${id}-cp"><path d="${wave}"/></clipPath></defs>
    <g id="${id}"><g clip-path="url(#${id}-cp)"><rect x="0" y="-20" width="80" height="200" fill="${cols[0]}"/><rect x="80" y="-20" width="80" height="200" fill="${cols[1]}"/><rect x="160" y="-20" width="80" height="200" fill="${cols[2]}"/>
    <path d="M0 40 Q60 22 120 40 T240 40" stroke="#000" stroke-opacity=".08" stroke-width="22" fill="none"/>
    ${emb ? `<g transform="translate(120 82)"><circle r="27" fill="#8B5A2B" stroke="${K}" stroke-width="5"/><path d="M-4 16 V-14 Q-4 -19 0 -19 Q4 -19 4 -14 V16 Z M-4 4 H-10 Q-13 4 -13 1 V-7 Q-13 -10 -10.5 -10 Q-8 -10 -8 -7 V-1 H-4 M4 -2 H10 Q13 -2 13 -5 V-11 Q13 -14 10.5 -14 Q8 -14 8 -11 V-7 H4" fill="#2FA35A" stroke="#14331F" stroke-width="2.5" stroke-linejoin="round"/></g>` : ""}</g>
    <path d="${wave}" fill="none" stroke="${K}" stroke-width="8" stroke-linejoin="round"/></g></svg>`;
};
const POLE = (h) => `<svg viewBox="0 0 30 ${h}" width="100%" height="100%" overflow="visible"><rect x="8" y="10" width="14" height="${h - 10}" rx="7" fill="#D9DCE8" stroke="${K}" stroke-width="6"/><circle cx="15" cy="12" r="12" fill="${GOLD}" stroke="${K}" stroke-width="6"/></svg>`;
// calendar sheet without numbers, viewBox 340 x 380
const CALBASE = () => `<svg viewBox="0 0 340 380" width="100%" height="100%" overflow="visible">
    <rect x="10" y="30" width="320" height="340" rx="22" fill="${PAPER}" stroke="${K}" stroke-width="9"/>
    <path d="M10 52 Q10 30 32 30 H308 Q330 30 330 52 V110 H10 Z" fill="${RED}" stroke="${K}" stroke-width="9" stroke-linejoin="round"/>
    ${[0, 1, 2, 3].map((r) => [0, 1, 2, 3, 4].map((c) => `<rect x="${34 + c * 58}" y="${132 + r * 56}" width="40" height="38" rx="8" fill="${(r * 5 + c) % 7 === 3 ? PINK : "#E9E6F5"}"/>`).join("")).join("")}
    <path d="M206 244 l30 30 m0 -30 l-30 30" stroke="${RED}" stroke-width="9" stroke-linecap="round"/></svg>`;
const CALRINGS = () => `<svg viewBox="0 0 340 60" width="100%" height="100%" overflow="visible">${[90, 170, 250].map((x) => `<rect x="${x - 9}" y="0" width="18" height="56" rx="9" fill="#D9DCE8" stroke="${K}" stroke-width="6"/>`).join("")}</svg>`;
const CALPAGE = () => `<svg viewBox="0 0 320 260" width="100%" height="100%" overflow="visible"><path d="M0 0 H320 V230 Q160 270 0 230 Z" fill="${PAPER}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
    ${[0, 1, 2].map((r) => [0, 1, 2, 3, 4].map((c) => `<rect x="${24 + c * 58}" y="${30 + r * 56}" width="40" height="38" rx="8" fill="#E9E6F5"/>`).join("")).join("")}</svg>`;
// cactus silhouette, viewBox 220 x 420
const CACTUS = () => `<svg viewBox="0 0 220 420" width="100%" height="100%" overflow="visible">
    <path d="M82 410 V60 Q82 20 110 20 Q138 20 138 60 V410 Z" fill="#3FA66A" stroke="${K}" stroke-width="9" stroke-linejoin="round"/>
    <path d="M82 230 H52 Q24 230 24 200 V120 Q24 100 40 100 Q56 100 56 120 V190 H82" fill="#3FA66A" stroke="${K}" stroke-width="9" stroke-linejoin="round"/>
    <path d="M138 200 H170 Q198 200 198 170 V90 Q198 70 182 70 Q166 70 166 90 V160 H138" fill="#3FA66A" stroke="${K}" stroke-width="9" stroke-linejoin="round"/>
    <path d="M110 50 V400 M40 126 V200 M182 96 V170" stroke="#2C7F4F" stroke-width="6" stroke-linecap="round"/>
    <path d="M96 40 Q110 10 124 40 Q110 30 96 40 Z" fill="${PINK}" stroke="${K}" stroke-width="5"/></svg>`;
// patisserie shop front, viewBox 820 x 560; full = shelves with tartlets/eclairs, otherwise empty with crumbs
const ECLAIR = (x, y) => `<rect x="${x}" y="${y}" width="96" height="34" rx="17" fill="#E9B872" stroke="${K}" stroke-width="5"/><rect x="${x + 6}" y="${y}" width="84" height="16" rx="8" fill="${CHOC}"/>`;
function SHOP(p, full) {
  const tartsVb = (x, y, s, fr) => `<g transform="translate(${x} ${y}) scale(${s})">${inner(TART(fr))}</g>`;
  const goods = full
    ? `<g id="${p}-row1">${tartsVb(92, 196, 0.42, STRAW)}${tartsVb(186, 196, 0.42, "#8E6BFF")}${tartsVb(280, 196, 0.42, "#FFB000")}${tartsVb(374, 196, 0.42, STRAW)}</g>
       <g id="${p}-row2">${ECLAIR(100, 318)}${ECLAIR(214, 318)}${ECLAIR(328, 318)}</g>`
    : [[110, 252], [160, 262], [300, 258], [360, 250], [420, 262], [140, 362], [250, 358], [380, 364], [330, 352]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${4 + (i % 3) * 2}" fill="${CRUST}" stroke="${K}" stroke-width="3"/>`).join("");
  return `<svg viewBox="0 0 820 560" width="100%" height="100%" overflow="visible">
    <rect x="20" y="70" width="780" height="480" fill="${PINK}" stroke="${K}" stroke-width="9"/>
    <path d="M20 120 H800" stroke="${PINK_D}" stroke-width="6"/>
    <rect x="70" y="180" width="440" height="300" rx="10" fill="#26305A" stroke="${K}" stroke-width="9"/>
    <path d="M90 282 H490 M90 392 H490" stroke="#fff" stroke-width="8" opacity=".85"/>
    ${goods}
    <path d="M90 200 L160 200 L100 280 Z" fill="#fff" opacity=".12"/>
    <rect x="560" y="200" width="190" height="350" rx="12" fill="${LAV}" stroke="${K}" stroke-width="9"/>
    <circle cx="655" cy="290" r="44" fill="#26305A" stroke="${K}" stroke-width="7"/><circle cx="726" cy="400" r="10" fill="${GOLD}" stroke="${K}" stroke-width="5"/>
    <rect x="40" y="500" width="740" height="50" fill="${PINK_D}" stroke="${K}" stroke-width="8"/></svg>`;
}
// striped awning with scallops, viewBox 840 x 130
const AWNING = () => {
  let st = ""; for (let i = 0; i < 12; i++) st += `<path d="M${i * 70} 0 H${i * 70 + 70} V84 H${i * 70} Z" fill="${i % 2 ? "#fff" : MINT}"/>`;
  let sc = ""; for (let i = 0; i < 12; i++) sc += `<path d="M${i * 70} 84 Q${i * 70 + 35} 130 ${i * 70 + 70} 84 Z" fill="${i % 2 ? "#fff" : MINT}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>`;
  return `<svg viewBox="0 0 840 130" width="100%" height="100%" overflow="visible">${st}<rect x="0" y="0" width="840" height="84" fill="none" stroke="${K}" stroke-width="8"/>${sc}</svg>`;
};
// price tag, viewBox 560 x 290 (hole at the left)
const TAG = () => `<svg viewBox="0 0 560 290" width="100%" height="100%" overflow="visible">
    <path d="M100 20 H530 Q550 20 550 40 V250 Q550 270 530 270 H100 L12 145 Z" fill="${YEL}" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>
    <path d="M110 40 H520 V250 H110 L36 145 Z" fill="none" stroke="${GOLD_D}" stroke-width="5" stroke-dasharray="16 10"/>
    <circle cx="86" cy="145" r="20" fill="#26305A" stroke="${K}" stroke-width="7"/></svg>`;
// receipt strip (zigzag bottom), viewBox 360 x 500
const RECEIPT = (h = 500) => {
  let zz = `M0 0 H360 V${h - 20}`; for (let x = 360; x > 0; x -= 30) zz += ` L${x - 15} ${h} L${x - 30} ${h - 20}`; zz += " Z";
  const lines = [60, 110, 160, 210, 260].map((y, i) => `<path d="M30 ${y} H${150 + (i % 3) * 30}" stroke="${INKC}" stroke-width="10" stroke-linecap="round" opacity=".45"/><path d="M250 ${y} H330" stroke="${INKC}" stroke-width="10" stroke-linecap="round" opacity=".45"/>`).join("");
  return `<svg viewBox="0 0 360 ${h}" width="100%" height="100%" overflow="visible"><path d="${zz}" fill="${PAPER}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>${lines}<path d="M24 300 H336" stroke="${INKC}" stroke-width="6" stroke-dasharray="12 10"/></svg>`;
};
// paper roll (cylinder lying), viewBox 460 x 110
const ROLL = () => `<svg viewBox="0 0 460 110" width="100%" height="100%" overflow="visible"><rect x="20" y="10" width="420" height="90" rx="45" fill="${PAPER}" stroke="${K}" stroke-width="9"/><ellipse cx="420" cy="55" rx="22" ry="45" fill="${PAPER_D}" stroke="${K}" stroke-width="7"/><ellipse cx="420" cy="55" rx="9" ry="18" fill="#8B8BA8"/><path d="M60 34 H360" stroke="#fff" stroke-width="10" stroke-linecap="round"/></svg>`;
// pointing glove (index finger to the right), viewBox 300 x 170
const GLOVE = () => `<svg viewBox="0 0 300 170" width="100%" height="100%" overflow="visible">
    <rect x="4" y="44" width="70" height="96" rx="16" fill="${FR[0]}" stroke="${K}" stroke-width="8"/>
    <path d="M70 52 Q100 34 150 50 L270 56 Q296 58 296 78 Q296 98 270 98 L190 100 Q200 116 186 128 Q196 142 180 152 Q170 168 140 160 L100 156 Q70 150 70 130 Z" fill="#fff" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
    <path d="M150 100 H190 M146 128 H186" stroke="${K}" stroke-width="6" stroke-linecap="round"/><path d="M110 64 Q140 58 170 66" stroke="#DDE2F0" stroke-width="7" fill="none" stroke-linecap="round"/></svg>`;
// one note sheet lying flat, viewBox 380 x 90
const SHEET = (col, seed) => {
  const R = mulberry32(seed);
  const l = Array.from({ length: 3 }, (_, i) => `<path d="M${40 + R() * 20} ${28 + i * 18} H${200 + R() * 120}" stroke="${INKC}" stroke-width="6" stroke-linecap="round" opacity=".35"/>`).join("");
  return `<svg viewBox="0 0 380 90" width="100%" height="100%" overflow="visible"><path d="M6 14 L374 6 L370 80 L10 86 Z" fill="${col}" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>${l}</svg>`;
};
// sailing ship silhouette (no guns), viewBox 200 x 240, pennant in simplified tricolour
const SHIP = (id) => `<svg viewBox="0 0 200 240" width="100%" height="100%" overflow="visible">
    <path d="M70 40 V188 M138 56 V188" stroke="${K}" stroke-width="9" stroke-linecap="round"/>
    <path d="M70 52 Q112 92 70 140 Q38 96 70 52 Z" fill="#F4F1FF" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M76 52 Q120 94 78 148" fill="none" stroke="#D3CCF5" stroke-width="5"/>
    <path d="M138 66 Q176 102 138 150 Q108 108 138 66 Z" fill="#F4F1FF" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
    <g id="${id}-pn"><path d="M70 40 L102 30 L70 22 Z" fill="${FR[2]}" stroke="${K}" stroke-width="4" stroke-linejoin="round"/></g>
    <path d="M10 186 H190 L168 230 H34 Z" fill="#5B4A8C" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
    <path d="M24 200 H178" stroke="#8F7FD6" stroke-width="6"/></svg>`;
// harbour silhouette with houses and a small lighthouse, viewBox 300 x 300
const HARBOUR = () => `<svg viewBox="0 0 300 300" width="100%" height="100%" overflow="visible">
    <path d="M10 300 V150 L50 110 L90 150 V300 Z" fill="${PEACH}" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M90 300 V170 L130 130 L170 170 V300 Z" fill="${MINT}" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M170 300 V190 H240 V300 Z" fill="${LAV}" stroke="${K}" stroke-width="7"/>
    <rect x="34" y="180" width="30" height="40" rx="6" fill="#FFE58A" stroke="${K}" stroke-width="5"/><rect x="116" y="200" width="30" height="40" rx="6" fill="#FFE58A" stroke="${K}" stroke-width="5"/><rect x="192" y="214" width="26" height="34" rx="6" fill="#FFE58A" stroke="${K}" stroke-width="5"/>
    <path d="M250 300 L258 60 H282 L290 300 Z" fill="#fff" stroke="${K}" stroke-width="7" stroke-linejoin="round"/><path d="M254 140 H286 M252 220 H288" stroke="${RED}" stroke-width="16"/>
    <rect x="252" y="30" width="36" height="34" rx="6" fill="${YEL}" stroke="${K}" stroke-width="6"/><path d="M248 30 L270 8 L292 30 Z" fill="${RED}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/></svg>`;
// balance scale parts: pillar (viewBox 200 x 460), beam (viewBox 680 x 60), pan with chains (viewBox 220 x 200)
const PILLAR = () => `<svg viewBox="0 0 200 460" width="100%" height="100%" overflow="visible">
    <path d="M84 40 H116 L124 400 H76 Z" fill="${GOLD}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
    <path d="M20 450 Q20 400 100 396 Q180 400 180 450 Z" fill="${GOLD_D}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
    <circle cx="100" cy="34" r="28" fill="${YEL}" stroke="${K}" stroke-width="8"/></svg>`;
const BEAM = () => `<svg viewBox="0 0 680 60" width="100%" height="100%" overflow="visible"><rect x="10" y="18" width="660" height="24" rx="12" fill="${YEL}" stroke="${K}" stroke-width="8"/><circle cx="340" cy="30" r="18" fill="${GOLD}" stroke="${K}" stroke-width="7"/><circle cx="24" cy="30" r="10" fill="${GOLD_D}" stroke="${K}" stroke-width="5"/><circle cx="656" cy="30" r="10" fill="${GOLD_D}" stroke="${K}" stroke-width="5"/></svg>`;
const PAN = () => `<svg viewBox="0 0 220 200" width="100%" height="100%" overflow="visible"><path d="M110 4 L24 150 M110 4 L196 150" stroke="${K}" stroke-width="7"/><path d="M110 4 L24 150 M110 4 L196 150" stroke="#D9DCE8" stroke-width="3"/>
    <path d="M6 150 H214 Q200 196 110 196 Q20 196 6 150 Z" fill="${YEL}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/><path d="M30 164 H120" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".6"/></svg>`;
// cake slice (wedge), viewBox 520 x 420
const SLICE = () => `<svg viewBox="0 0 520 420" width="100%" height="100%" overflow="visible">
    <path d="M20 170 L380 60 L500 150 L500 380 L20 400 Z" fill="${PEACH}" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>
    <path d="M20 170 L380 60 L500 150 L140 230 Z" fill="${PINK}" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>
    <path d="M140 230 L500 150 L500 380 L140 400 Z" fill="#FFE0B8" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>
    <path d="M140 290 L500 230 M140 350 L500 306" stroke="${PINK_D}" stroke-width="22"/>
    <path d="M140 290 L500 230 M140 350 L500 306" stroke="${PINK}" stroke-width="10"/>
    <path d="M30 230 L140 230 M30 300 L140 290 M30 360 L140 350" stroke="${PINK_D}" stroke-width="14"/>
    <path d="M140 230 L140 400" stroke="${K}" stroke-width="10"/>
    ${[[120, 150], [210, 122], [300, 96], [390, 114]].map(([x, y]) => `<path d="M${x - 34} ${y} Q${x - 30} ${y - 40} ${x} ${y - 46} Q${x + 30} ${y - 40} ${x + 34} ${y} Z" fill="#fff" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>`).join("")}
    <circle cx="300" cy="32" r="30" fill="${STRAW}" stroke="${K}" stroke-width="7"/><path d="M300 4 Q310 -20 330 -24" fill="none" stroke="#3FAE5A" stroke-width="6" stroke-linecap="round"/><circle cx="290" cy="22" r="8" fill="#fff" opacity=".6"/></svg>`;
// sunburst rays (rotate the inner group), viewBox 700 x 700
const RAYS = (id, col = "#FFE58A") => `<svg viewBox="0 0 700 700" width="100%" height="100%" overflow="visible"><g id="${id}">${Array.from({ length: 12 }, (_, i) => { const a = (i * 30) * Math.PI / 180, b = (i * 30 + 13) * Math.PI / 180; return `<path d="M350 350 L${f2(350 + Math.cos(a) * 340)} ${f2(350 + Math.sin(a) * 340)} L${f2(350 + Math.cos(b) * 340)} ${f2(350 + Math.sin(b) * 340)} Z" fill="${col}" opacity=".22"/>`; }).join("")}</g></svg>`;
// hand + sleeve reaching to the right, viewBox 400 x 160
// tricolour cuff: cols in screen order left to right (the mirrored arm gets them reversed in the source)
const ARMHAND = (sleeve, cols) => `<svg viewBox="0 0 400 160" width="100%" height="100%" overflow="visible">
    <path d="M0 40 H230 L240 124 H0 Z" fill="${sleeve}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
    ${cols.map((c, i) => `<rect x="${172 + i * 26}" y="32" width="26" height="100" fill="${c}"/>`).join("")}
    <rect x="172" y="32" width="78" height="100" rx="8" fill="none" stroke="${K}" stroke-width="7"/><path d="M198 32 V132 M224 32 V132" stroke="${K}" stroke-width="4"/>
    <path d="M246 52 Q300 36 350 52 Q392 60 392 84 Q392 104 360 106 L340 108 Q346 132 320 136 L272 134 Q248 130 246 110 Z" fill="${PEACH}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
    <path d="M300 60 Q330 52 360 62" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".6"/></svg>`;
const COIN = () => `<svg viewBox="0 0 80 80" width="100%" height="100%" overflow="visible"><circle cx="40" cy="40" r="34" fill="${YEL}" stroke="${K}" stroke-width="7"/><circle cx="40" cy="40" r="20" fill="none" stroke="${GOLD_D}" stroke-width="5"/><path d="M26 26 Q34 18 44 18" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/></svg>`;
// stage curtain half, viewBox 440 x 560 (folds), mirrored for the right
const CURTAIN = () => `<svg viewBox="0 0 440 560" width="100%" height="100%" overflow="visible">
    <path d="M0 0 H440 V520 Q400 556 360 520 Q320 556 280 520 Q240 556 200 520 Q160 556 120 520 Q80 556 40 520 Q20 540 0 520 Z" fill="#D83A5C" stroke="${K}" stroke-width="9" stroke-linejoin="round"/>
    <path d="M60 20 V510 M140 20 V510 M220 20 V510 M300 20 V510 M380 20 V510" stroke="#A8223F" stroke-width="16" stroke-linecap="round"/>
    <path d="M100 20 V500 M260 20 V500" stroke="#F26A88" stroke-width="7" stroke-linecap="round" opacity=".7"/></svg>`;
// single riding boot (no leg, no injury), viewBox 300 x 420
const BOOT = (engr = false) => engr
  ? `<path d="M110 30 H210 V250 Q210 270 230 276 L290 296 Q310 304 306 334 V350 H96 V320 L110 300 Z" fill="none" stroke="${STONE_D}" stroke-width="12" stroke-linejoin="round"/>`
  : `<svg viewBox="0 0 320 400" width="100%" height="100%" overflow="visible">
    <path d="M110 30 H210 V250 Q210 270 230 276 L290 296 Q316 304 312 336 V352 H96 V320 L110 300 Z" fill="#3A2A44" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>
    <path d="M100 18 H220 V60 H100 Z" fill="#5A4468" stroke="${K}" stroke-width="9" stroke-linejoin="round"/>
    <path d="M96 352 H312 V376 H96 Z" fill="${CHOC_D}" stroke="${K}" stroke-width="8"/><path d="M96 352 H150 V392 H96 Z" fill="${CHOC_D}" stroke="${K}" stroke-width="8"/>
    <path d="M130 80 Q128 200 136 290" stroke="#7A6290" stroke-width="12" fill="none" stroke-linecap="round" opacity=".8"/>
    <rect x="196" y="282" width="40" height="22" rx="6" fill="${GOLD}" stroke="${K}" stroke-width="5"/></svg>`;
const CUSHION = () => `<svg viewBox="0 0 440 130" width="100%" height="100%" overflow="visible"><path d="M30 40 Q220 0 410 40 Q440 80 410 110 Q220 136 30 110 Q0 80 30 40 Z" fill="${LAV}" stroke="${K}" stroke-width="9" stroke-linejoin="round"/><path d="M70 56 Q220 30 370 56" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" opacity=".55"/>
    <circle cx="30" cy="104" r="14" fill="${GOLD}" stroke="${K}" stroke-width="6"/><circle cx="410" cy="104" r="14" fill="${GOLD}" stroke="${K}" stroke-width="6"/></svg>`;
// small gravestone with a boot engraving, viewBox 320 x 380
const STONEG = () => `<svg viewBox="0 0 320 380" width="100%" height="100%" overflow="visible">
    <path d="M20 370 V140 Q20 20 160 20 Q300 20 300 140 V370 Z" fill="${STONE}" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>
    <path d="M44 360 V146 Q44 46 160 46" stroke="${STONE_L}" stroke-width="10" fill="none" stroke-linecap="round"/>
    <g transform="translate(76 90) scale(.52)">${BOOT(true)}</g>
    <path d="M90 320 H230" stroke="${STONE_D}" stroke-width="10" stroke-linecap="round"/></svg>`;
const FLOWER = () => `<svg viewBox="0 0 120 260" width="100%" height="100%" overflow="visible">
    <path d="M60 250 Q56 170 62 90" stroke="#3FAE5A" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M60 180 Q20 150 18 120 Q50 130 60 170 Z" fill="#59C870" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>
    <g id="flw-head">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="62" cy="58" rx="20" ry="32" transform="rotate(${a} 62 74)" fill="${PINK}" stroke="${K}" stroke-width="5"/>`).join("")}<circle cx="62" cy="74" r="16" fill="${YEL}" stroke="${K}" stroke-width="5"/></g></svg>`;
// comment bubble, viewBox 760 x 470 (tail down right, towards Klotz)
const BUBBLE = () => `<svg viewBox="0 0 760 470" width="100%" height="100%" overflow="visible"><path d="M60 10 H700 Q750 10 750 60 V330 Q750 380 700 380 H640 L670 460 L560 380 H60 Q10 380 10 330 V60 Q10 10 60 10 Z" fill="${LAV}" stroke="${K}" stroke-width="10" stroke-linejoin="round"/><path d="M40 44 Q40 34 60 34 H300" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" opacity=".6"/></svg>`;
const FORK = () => `<svg viewBox="0 0 70 260" width="100%" height="100%" overflow="visible"><path d="M12 10 V70 Q12 96 35 100 Q58 96 58 70 V10 M35 10 V80" fill="none" stroke="${K}" stroke-width="18" stroke-linecap="round"/><path d="M12 10 V70 Q12 96 35 100 Q58 96 58 70 V10 M35 10 V80" fill="none" stroke="#D9DCE8" stroke-width="8" stroke-linecap="round"/><rect x="24" y="96" width="22" height="156" rx="11" fill="#D9DCE8" stroke="${K}" stroke-width="7"/></svg>`;
const HEART = () => `<svg viewBox="0 0 120 110" width="100%" height="100%" overflow="visible"><path d="M60 104 Q4 66 8 34 Q14 4 44 8 Q56 12 60 26 Q64 12 76 8 Q106 4 112 34 Q116 66 60 104 Z" fill="${RED}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/><path d="M28 30 Q34 20 46 22" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".7"/></svg>`;

// ---------- common CSS ----------
const STK = `filter: drop-shadow(5px 0 0 #fff) drop-shadow(-5px 0 0 #fff) drop-shadow(0 5px 0 #fff) drop-shadow(0 -5px 0 #fff) drop-shadow(0 14px 0 rgba(0,0,0,.35));`;
const FONTFACE = `@font-face{font-family:'Lilita One';src:url('assets/fonts/LilitaOne-latin.woff2') format('woff2');font-weight:400;font-style:normal;font-display:block;}`;
const abs = (l, t, w, h) => `position:absolute;left:${l}px;top:${t}px;width:${w}px;${h != null ? `height:${h}px;` : ""}`;
const LBL = (size, col = K) => `font-family:'Lilita One';font-size:${size}px;line-height:1;color:${col};white-space:nowrap;text-align:center;`;

const EXD = 0.1; // exit: shrink + dim over the last 3 frames, gone exactly at the cut
function scene(id, title, start, dur, css, body, js, opts = {}) {
  const exit = opts.exit !== false, kb = opts.kb !== false;
  const html = `<template>
  <style>
    ${FONTFACE}
    #root { position: absolute; inset: 0; overflow: hidden; }
    #${id}-out, #${id}-kb { position: absolute; inset: 0; transform-origin: 540px 1050px; }
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
function burst(p, n, cx, cy, size, rad, seed, cols = [YEL, "#fff"], r0 = 0, arc = null) {
  const RS = mulberry32(seed);
  const items = Array.from({ length: n }, (_, i) => { const a0 = (i / n) * Math.PI * 2 + RS() * 0.5; const a = arc ? (arc[0] + (arc[1] - arc[0]) * (i + 0.5) / n) * Math.PI / 180 : a0; const rr = rad * (0.7 + RS() * 0.5); return { x: Math.round(Math.cos(a) * rr), y: Math.round(Math.sin(a) * rr), s: Math.round(size * (0.7 + RS() * 0.6)) }; });
  const html = items.map((it, i) => `<div id="${p}-${i}" class="spk" style="left:${cx - it.s / 2}px;top:${cy - it.s / 2}px;width:${it.s}px;height:${it.s}px;">${SPARK(cols[i % cols.length])}</div>`).join("");
  const js = (at) => items.map((it, i) => `      tl.fromTo("#${p}-${i}", { x: ${Math.round(it.x * r0)}, y: ${Math.round(it.y * r0)}, scale: 0, rotation: 0, opacity: 1 }, { keyframes: { x: [${Math.round(it.x * r0)}, ${it.x}], y: [${Math.round(it.y * r0)}, ${it.y}], scale: [0, 1.1, 0], rotation: [0, 120] }, duration: 0.6, ease: "power1.out", immediateRender: true }, ${at});`).join("\n");
  return { html, js };
}
function twinkle(p, spots, d, seed) {
  const RS = mulberry32(seed);
  const html = spots.map(([x, y, s], i) => `<div id="${p}-${i}" class="spk" style="left:${x - s / 2}px;top:${y - s / 2}px;width:${s}px;height:${s}px;">${SPARK(i % 2 ? "#fff" : PINK)}</div>`).join("");
  const js = spots.map((_, i) => { const per = f2(0.6 + RS() * 0.4); return `      tl.fromTo("#${p}-${i}", { scale: 0.3, rotation: 0 }, { keyframes: { scale: [0.3, 1, 0.3], rotation: [0, 45, 90] }, duration: ${per}, ease: "sine.inOut", repeat: ${Math.max(0, Math.ceil(d / per) - 1)} }, ${f2(RS() * 0.2)});`; }).join("\n");
  return { html, js };
}

// ================= HOOK picture (frame 0 = thumbnail motif): giant tartlet on a cake stand, two simplified flags behind =================
const hookCss = (p) => `
   #${p}-glow{${abs(260, 840, 560, 480)}border-radius:50%;background:radial-gradient(circle,rgba(255,179,199,.40) 0%,rgba(255,179,199,0) 66%);}
   #${p}-plL{${abs(140, 620, 30, 280)}} #${p}-plR{${abs(910, 620, 30, 280)}}
   #${p}-flL{${abs(166, 634, 250, 167)}} #${p}-flR{${abs(664, 634, 250, 167)}}
   #${p}-lbL{${abs(118, 808, 346, 92)}border-radius:18px;background:${CREAM};border:7px solid ${K};}
   #${p}-lbR{${abs(494, 808, 484, 92)}border-radius:18px;background:${CREAM};border:7px solid ${K};}
   #${p}-lbLt,#${p}-lbRt{position:absolute;left:0;top:6px;width:100%;${LBL(74, "#26305A")}}
   #${p}-st{${abs(380, 1128, 320, 213)}}
   #${p}-tt{${abs(380, 902, 320, 272)}transform-origin:50% 95%;}`;
const hookBody = (p) => `      <div id="${p}-glow"></div>
      <div id="${p}-plL">${POLE(280)}</div><div id="${p}-flL" class="${p}-stk">${FLAG3(p + "-fgL", MX, true)}</div>
      <div id="${p}-plR">${POLE(280)}</div><div id="${p}-flR" class="${p}-stk">${FLAG3(p + "-fgR", FR)}</div>
      <div id="${p}-lbL" class="${p}-stk"><div id="${p}-lbLt">MEXIKO</div></div>
      <div id="${p}-lbR" class="${p}-stk"><div id="${p}-lbRt">FRANKREICH</div></div>
      <div id="${p}-st" class="${p}-stk">${STAND()}</div>
      <div id="${p}-tt" class="${p}-stk">${TART()}</div>`;
// idle motion of the hook picture; all moves are whole periods starting from the rest pose
const hookIdle = (p, t0, d) => {
  const n = Math.max(1, Math.round(d / 1.1));
  const per = f2(d / n);
  return `      gsap.set("#${p}-fgL", { svgOrigin: "0 80" }); gsap.set("#${p}-fgR", { svgOrigin: "0 80" });
      tl.to("#${p}-tt", { keyframes: { y: [0, -18, 0], rotation: [0, 2, 0], scaleY: [1, 1.03, 1] }, duration: ${per}, ease: "sine.inOut", repeat: ${n - 1} }, ${t0});
      tl.to("#${p}-fgL", { keyframes: { skewY: [0, 5, 0], scaleX: [1, 0.96, 1] }, duration: ${per}, ease: "sine.inOut", repeat: ${n - 1} }, ${t0});
      tl.to("#${p}-fgR", { keyframes: { skewY: [0, -5, 0], scaleX: [1, 0.96, 1] }, duration: ${per}, ease: "sine.inOut", repeat: ${n - 1} }, ${t0});
      tl.to("#${p}-glow", { keyframes: { opacity: [1, 0.65, 1] }, duration: ${per}, ease: "sine.inOut", repeat: ${n - 1} }, ${t0});`;
};
const HOOK_TW = [[250, 1050, 50], [840, 1040, 44], [282, 1250, 40], [800, 1250, 46]];
{
  const p = "hook";
  const [s, d] = S(p);
  const tw = twinkle("hook-t", HOOK_TW, d, 1838);
  scenes.push(scene(p, "Hook: Toertchen auf dem Kuchenstaender", s, d, hookCss(p), hookBody(p) + "\n      " + tw.html,
    `      // frame 0 already shows the full motif (thumbnail picture)
${hookIdle(p, 0, d)}
${tw.js}`, { kb: false }));
}

// ================= KAL: calendar sheet (no numbers) tears off, cactus sways in the desert (c02) =================
{
  const p = "kal";
  const [s, d] = S(p);
  scenes.push(scene(p, "Kalenderblatt und Kaktus", s, d,
    `#kal-sun{${abs(760, 790, 150, 150)}}
     #kal-sand{${abs(110, 1250, 860, 90)}}
     #kal-cal{${abs(150, 820, 340, 380)}transform-origin:50% 100%;}
     #kal-rg{${abs(150, 796, 340, 60)}}
     #kal-pg{${abs(160, 940, 320, 260)}transform-origin:50% 0%;}
     #kal-pg2{${abs(160, 940, 320, 260)}transform-origin:50% 0%;}
     #kal-ca{${abs(620, 880, 220, 420)}transform-origin:50% 100%;}`,
    `      <svg id="kal-sun" viewBox="0 0 150 150" overflow="visible"><circle cx="75" cy="75" r="66" fill="${YEL}" stroke="${K}" stroke-width="8"/><path d="M40 60 Q50 40 74 36" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round" opacity=".6"/></svg>
      <svg id="kal-sand" viewBox="0 0 860 90" overflow="visible"><path d="M0 40 Q200 0 430 30 Q660 60 860 24 L860 90 L0 90 Z" fill="${PEACH}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/><path d="M120 60 q20 -10 40 0 M520 64 q20 -10 40 0" stroke="${CRUST_D}" stroke-width="6" fill="none" stroke-linecap="round"/></svg>
      <div id="kal-ca" class="kal-stk">${CACTUS()}</div>
      <div id="kal-cal" class="kal-stk">${CALBASE()}</div>
      <div id="kal-pg2">${CALPAGE()}</div>
      <div id="kal-pg">${CALPAGE()}</div>
      <div id="kal-rg">${CALRINGS()}</div>`,
    `      tl.fromTo("#kal-cal", { scale: 0.92, rotation: -3 }, { scale: 1, rotation: 0, duration: 0.35, ease: "back.out(2)" }, 0);
      // pages tear off one after another (time flies back): flip up and fade away
${[0, 1].map((i) => `      tl.fromTo("#kal-pg${i ? "2" : ""}", { rotationX: 0, y: 0, opacity: 1 }, { keyframes: { rotationX: [0, 70, 110], y: [0, -40, -110], opacity: [1, 1, 0] }, duration: 0.5, ease: "power1.in" }, ${f2(0.5 + i * 0.6)});`).join("\n")}
      gsap.set("#kal-ca", { transformOrigin: "50% 100%" });
      tl.to("#kal-ca", { keyframes: { rotation: [0, 3, -2, 0], scaleY: [1, 1.03, 0.99, 1] }, duration: 1.1, ease: "sine.inOut", repeat: 1 }, 0);
      tl.to("#kal-sun", { keyframes: { y: [0, -10, 0], rotation: [0, 20, 40] }, duration: 1.1, ease: "sine.inOut", repeat: 1 }, 0);`));
}

// ================= LADEN: patisserie shop front with PATISSERIE sign (c03) =================
{
  const p = "laden";
  const [s, d] = S(p);
  scenes.push(scene(p, "Konditorei-Schaufenster", s, d,
    `#laden-shop{${abs(130, 780, 820, 560)}}
     #laden-aw{${abs(120, 860, 840, 130)}transform-origin:50% 0%;}
     #laden-sg{${abs(290, 760, 500, 104)}border-radius:20px;background:${CREAM};border:8px solid ${K};transform-origin:50% 0%;}
     #laden-sgt{position:absolute;left:0;top:10px;width:484px;${LBL(76, PINK_D)}}`,
    `      <div id="laden-shop" class="laden-stk">${SHOP("laden-s", true)}</div>
      <div id="laden-aw">${AWNING()}</div>
      <div id="laden-sg" class="laden-stk"><div id="laden-sgt">PÂTISSERIE</div></div>`,
    `      tl.fromTo("#laden-shop", { scale: 0.94 }, { scale: 1, duration: 0.35, ease: "back.out(1.8)", transformOrigin: "50% 100%" }, 0);
      tl.fromTo("#laden-aw", { scaleY: 0.6 }, { scaleY: 1, duration: 0.3, ease: "back.out(2.4)" }, 0.1);
      tl.fromTo("#laden-sg", { rotation: -8 }, { keyframes: { rotation: [-8, 5, -3, 2, 0] }, duration: 1.0, ease: "sine.out" }, 0.05);
      gsap.set(["#laden-s-row1", "#laden-s-row2"], { transformOrigin: "50% 100%" });
      tl.to("#laden-s-row1", { keyframes: { y: [0, -8, 0] }, duration: 0.5, ease: "sine.inOut", repeat: 3 }, 0.3);
      tl.to("#laden-s-row2", { keyframes: { y: [0, -6, 0] }, duration: 0.5, ease: "sine.inOut", repeat: 3 }, 0.55);`));
}

// ================= LEER: the same shop emptied, door swings, crumbs fall (c04); Klotz grabs the last tartlet =================
{
  const p = "leer";
  const [s, d] = S(p);
  const RS = mulberry32(804);
  const cr = Array.from({ length: 8 }, (_, i) => ({ x: 210 + Math.round(RS() * 380), y: 1000 + Math.round(RS() * 60), r: 7 + Math.round(RS() * 6), t: f2(0.2 + i * 0.16) }));
  scenes.push(scene(p, "Leeres Schaufenster", s, d,
    `#leer-shop{${abs(130, 780, 820, 560)}}
     #leer-aw{${abs(120, 860, 840, 130)}transform-origin:50% 0%;}
     #leer-door{${abs(692, 984, 186, 346)}}
     .leer-cr{position:absolute;}
     #leer-puff{${abs(250, 1170, 300, 140)}}`,
    `      <div id="leer-shop" class="leer-stk">${SHOP("leer-s", false)}</div>
      <div id="leer-aw">${AWNING()}</div>
      <svg id="leer-door" viewBox="0 0 186 346" overflow="visible"><g id="leer-dg"><rect x="4" y="4" width="178" height="338" rx="12" fill="${LAV_D}" stroke="${K}" stroke-width="8"/><circle cx="90" cy="90" r="40" fill="#1A2140" stroke="${K}" stroke-width="7"/><circle cx="24" cy="200" r="9" fill="${GOLD}" stroke="${K}" stroke-width="5"/></g></svg>
      <svg id="leer-puff" viewBox="0 0 300 140" overflow="visible"><g id="leer-pg"><circle cx="70" cy="90" r="46" fill="#E9E6F5" opacity=".5"/><circle cx="150" cy="70" r="60" fill="#E9E6F5" opacity=".45"/><circle cx="230" cy="92" r="44" fill="#E9E6F5" opacity=".5"/></g></svg>
${cr.map((c, i) => `      <svg id="leer-c${i}" class="leer-cr" style="left:${c.x - c.r}px;top:${c.y - c.r}px;" width="${2 * c.r}" height="${2 * c.r}" viewBox="0 0 ${2 * c.r} ${2 * c.r}" overflow="visible"><circle cx="${c.r}" cy="${c.r}" r="${c.r - 2}" fill="${CRUST}" stroke="${K}" stroke-width="3"/></svg>`).join("\n")}`,
    `      tl.fromTo("#leer-shop", { scale: 1.04 }, { scale: 1, duration: 0.3, ease: "power2.out", transformOrigin: "50% 100%" }, 0);
      // door swings open and shut (skew, stays in its frame)
      gsap.set("#leer-dg", { svgOrigin: "182 170" });
      tl.to("#leer-dg", { keyframes: { scaleX: [1, 0.45, 0.8, 0.55, 1], skewY: [0, -8, -3, -6, 0] }, duration: 1.4, ease: "sine.inOut" }, 0.1);
      tl.fromTo("#leer-pg", { scale: 0.6, opacity: 0.2 }, { keyframes: { scale: [0.6, 1.05, 1.15], opacity: [0.2, 1, 0] }, duration: 1.0, ease: "power1.out", transformOrigin: "50% 100%" }, 0.15);
${cr.map((c, i) => `      tl.fromTo("#leer-c${i}", { y: 0, opacity: 0, rotation: 0 }, { keyframes: { y: [0, 60, 240], opacity: [0, 1, 1], rotation: [0, 90, 200] }, duration: 0.6, ease: "power2.in" }, ${c.t});
      tl.to("#leer-c${i}", { opacity: 0, duration: 0.08 }, ${f2(c.t + 0.6)});`).join("\n")}
      tl.to("#leer-aw", { keyframes: { scaleY: [1, 0.9, 1.04, 1] }, duration: 0.6, ease: "sine.inOut" }, 0.2);`));
}

// ================= PREIS: price tag "< 1.000" swings from a nail (c05) =================
{
  const p = "preis";
  const [s, d] = S(p);
  scenes.push(scene(p, "Preisschild", s, d,
    `#preis-str{${abs(240, 770, 600, 220)}}
     #preis-tag{${abs(250, 950, 560, 290)}}
     #preis-tt{position:absolute;left:110px;top:88px;width:430px;${LBL(112, K)}}
     #preis-sw{position:absolute;left:0;top:0;width:1080px;height:1920px;transform-origin:540px 792px;}
     #preis-mini{${abs(120, 1180, 150, 128)}transform-origin:50% 100%;}`,
    `      <div id="preis-sw">
        <svg id="preis-str" viewBox="0 0 600 220" overflow="visible"><path d="M300 22 L86 196 M300 22 L170 200" stroke="${K}" stroke-width="7" fill="none"/><circle cx="300" cy="22" r="16" fill="#D9DCE8" stroke="${K}" stroke-width="6"/></svg>
        <div id="preis-tag" class="preis-stk">${TAG()}<div id="preis-tt">&lt; 1.000</div></div>
      </div>
      <div id="preis-mini" class="preis-stk">${TART("#8E6BFF")}</div>`,
    `      tl.fromTo("#preis-sw", { rotation: 7 }, { keyframes: { rotation: [7, -5, 3, -2, 1, 0] }, duration: 1.6, ease: "sine.out" }, 0);
      tl.fromTo("#preis-tt", { scale: 0.85 }, { scale: 1, duration: 0.3, ease: "back.out(2.4)" }, 0.15);
      tl.to("#preis-tt", { keyframes: { scale: [1, 1.08, 1] }, duration: 0.4, ease: "sine.inOut" }, 1.1);
      // the tiny tartlet below shrugs: that is all the shop was worth
      tl.to("#preis-mini", { keyframes: { scaleY: [1, 0.85, 1.08, 1], y: [0, 0, -20, 0] }, duration: 0.55, ease: "none", repeat: 1 }, 0.4);`));
}

// ================= RECHN: a receipt rolls out from a paper roll, 60.000 jumps up (c06) =================
{
  const p = "rechn";
  const [s, d] = S(p);
  const b = burst("rechn-b", 8, 540, 1060, 46, 230, 6000, [YEL, "#fff", PINK], 0.45, [210, 330]);
  scenes.push(scene(p, "Rechnung rollt aus", s, d,
    `#rechn-rc{${abs(360, 830, 360, 500)}transform-origin:50% 0%;}
     #rechn-roll{${abs(310, 776, 460, 110)}}
     #rechn-tot{position:absolute;left:360px;top:1176px;width:360px;${LBL(92, STAMP)}transform-origin:50% 100%;}`,
    `      <div id="rechn-rc" class="rechn-stk">${RECEIPT()}</div>
      <div id="rechn-roll" class="rechn-stk">${ROLL()}</div>
      <div id="rechn-tot">60.000</div>
      ${b.html}`,
    `      // the strip is already out a little at the cut, then rolls down to full length
      tl.fromTo("#rechn-rc", { scaleY: 0.25 }, { scaleY: 1, duration: 0.7, ease: "power2.out" }, 0);
      tl.to("#rechn-roll", { keyframes: { scaleY: [1, 0.9, 1, 0.9, 1] }, duration: 0.7, ease: "none" }, 0);
      tl.fromTo("#rechn-tot", { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(3)" }, 0.62);
      // the number jumps
      tl.to("#rechn-tot", { keyframes: { y: [0, -46, 0, -22, 0], scaleY: [1, 1.1, 0.86, 1.05, 1], scaleX: [1, 0.94, 1.1, 0.98, 1] }, duration: 0.6, ease: "none" }, 0.9);
${b.js(0.88)}
      tl.to("#rechn-rc", { keyframes: { rotation: [0, 1.5, -1.5, 0] }, duration: 0.8, ease: "sine.inOut" }, 1.0);`));
}

// ================= ANLASS: French flag (simplified) + a pointing glove pokes at the bill (c07) =================
{
  const p = "anlass";
  const [s, d] = S(p);
  scenes.push(scene(p, "Fahne und Zeigefinger", s, d,
    `#anlass-pl{${abs(130, 790, 30, 520)}}
     #anlass-fl{${abs(156, 806, 270, 180)}}
     #anlass-rc{${abs(600, 800, 300, 420)}transform-origin:50% 0%;}
     #anlass-tot{position:absolute;left:600px;top:1070px;width:300px;${LBL(76, STAMP)}}
     #anlass-gl{${abs(250, 1060, 330, 187)}transform-origin:0% 50%;}`,
    `      <div id="anlass-pl">${POLE(520)}</div><div id="anlass-fl" class="anlass-stk">${FLAG3("anlass-fg", FR)}</div>
      <div id="anlass-rc" class="anlass-stk">${RECEIPT(500)}</div>
      <div id="anlass-tot">60.000</div>
      <div id="anlass-gl" class="anlass-stk">${GLOVE()}</div>`,
    `      gsap.set("#anlass-fg", { svgOrigin: "0 80" });
      tl.to("#anlass-fg", { keyframes: { skewY: [0, 6, -4, 0], scaleX: [1, 0.95, 1.02, 1] }, duration: 0.8, ease: "none", repeat: 2 }, 0);
      tl.fromTo("#anlass-gl", { x: -40, rotation: -4 }, { x: 0, rotation: 0, duration: 0.3, ease: "back.out(2)" }, 0);
      // poke, poke, poke
      tl.to("#anlass-gl", { keyframes: { x: [0, 26, 0] }, duration: 0.3, ease: "power2.inOut", repeat: 2 }, 0.45);
${[0, 1, 2].map((i) => `      tl.to(["#anlass-rc", "#anlass-tot"], { keyframes: { x: [0, 8, 0], rotation: [0, 1.5, 0] }, duration: 0.2, ease: "power1.out" }, ${f2(0.58 + i * 0.3)});`).join("\n")}
      tl.to("#anlass-tot", { keyframes: { scale: [1, 1.1, 1] }, duration: 0.4, ease: "sine.inOut" }, 1.5);`));
}

// ================= ZETTEL: further demands: note sheets land on a pile (c08) =================
{
  const p = "zettel";
  const [s, d] = S(p);
  const cols = [PAPER, PINK, MINT, "#FFE58A", LAV, PAPER, PEACH, MINT];
  const N = 8, base = 1250, step = 58;
  const sh = cols.slice(0, N).map((c, i) => ({ c, x: 340 + ((i * 37) % 5) * 8 - 16, y: base - i * step, r: ((i * 53) % 7) - 3 }));
  scenes.push(scene(p, "Zettel stapeln sich", s, d,
    `.zettel-sh{position:absolute;width:380px;height:90px;}
     #zettel-tbl{${abs(180, 1316, 720, 30)}}`,
    `      <svg id="zettel-tbl" viewBox="0 0 720 30" overflow="visible"><rect x="4" y="4" width="712" height="22" rx="11" fill="${CHOC}" stroke="${K}" stroke-width="7"/></svg>
${sh.map((q, i) => `      <div id="zettel-s${i}" class="zettel-sh zettel-stk" style="left:${q.x}px;top:${q.y}px;">${SHEET(q.c, 80 + i)}</div>`).join("\n")}`,
    `${sh.map((q, i) => i < 2 ? `      gsap.set("#zettel-s${i}", { rotation: ${q.r} });` : `      tl.fromTo("#zettel-s${i}", { y: -150, opacity: 0, rotation: ${q.r * 4} }, { y: 0, opacity: 1, rotation: ${q.r}, duration: 0.24, ease: "power2.in" }, ${f2(0.1 + (i - 2) * 0.24)});
      tl.to("#zettel-s${i}", { keyframes: { scaleY: [1, 0.7, 1.08, 1] }, duration: 0.18, ease: "none", transformOrigin: "50% 100%" }, ${f2(0.34 + (i - 2) * 0.24)});`).join("\n")}
      tl.to([${sh.map((_, i) => `"#zettel-s${i}"`).join(", ")}], { keyframes: { x: [0, 6, -6, 0] }, duration: 0.5, ease: "sine.inOut", stagger: 0.04 }, 1.8);`));
}

// ================= STAPEL: the pile grows into a giant tower and sways (c09); Klotz chokes on a crumb =================
{
  const p = "stapel";
  const [s, d] = S(p);
  const cols = [PAPER, PINK, MINT, "#FFE58A", LAV, PEACH];
  const N = 13, base = 1270, step = 38;
  scenes.push(scene(p, "Riesiger Zettelstapel", s, d,
    `.stapel-sh{position:absolute;width:380px;height:90px;}
     #stapel-tw{position:absolute;left:0;top:0;width:1080px;height:1920px;transform-origin:430px 1340px;}
     #stapel-tbl{${abs(150, 1316, 560, 30)}}
     #stapel-fl{${abs(720, 860, 190, 46)}}`,
    `      <svg id="stapel-tbl" viewBox="0 0 560 30" overflow="visible"><rect x="4" y="4" width="552" height="22" rx="11" fill="${CHOC}" stroke="${K}" stroke-width="7"/></svg>
      <div id="stapel-tw">
${Array.from({ length: N }, (_, i) => `        <div id="stapel-s${i}" class="stapel-sh stapel-stk" style="left:${240 + ((i * 29) % 5) * 7 - 14}px;top:${base - i * step}px;">${SHEET(cols[i % cols.length], 200 + i)}</div>`).join("\n")}
      </div>
      <div id="stapel-fl" class="stapel-stk">${SHEET(PINK, 300)}</div>`,
    `${Array.from({ length: N }, (_, i) => i < 7 ? `      gsap.set("#stapel-s${i}", { rotation: ${((i * 41) % 7) - 3} });` : `      tl.fromTo("#stapel-s${i}", { y: -90, opacity: 0 }, { y: 0, opacity: 1, rotation: ${((i * 41) % 7) - 3}, duration: 0.14, ease: "power2.in" }, ${f2(0.04 + (i - 7) * 0.09)});`).join("\n")}
      // the tower sways (pivot at its foot)
      tl.to("#stapel-tw", { keyframes: { rotation: [0, -2.5, 2, -1.2, 0] }, duration: 1.2, ease: "sine.inOut" }, 0.55);
      // one sheet flutters down on the right
      tl.fromTo("#stapel-fl", { y: 0, rotation: -10 }, { keyframes: { y: [0, 120, 260, 380], x: [0, -40, 20, -30], rotation: [-10, 14, -12, 8] }, duration: 1.6, ease: "none" }, 0.05);`));
}

// ================= HAFEN: harbour silhouette, sailing ships line up in front of it (c10) - a blockade, no shooting =================
{
  const p = "hafen";
  const [s, d] = S(p);
  const ships = [[380, 0.35], [560, 0.6], [740, 0.85]];
  scenes.push(scene(p, "Hafen und Segelschiffe", s, d,
    `#hafen-hb{${abs(110, 930, 300, 300)}}
     #hafen-sea{${abs(100, 1180, 880, 160)}}
     .hafen-sp{position:absolute;width:180px;height:216px;transform-origin:50% 100%;}
     #hafen-rope{${abs(380, 1150, 580, 40)}}`,
    `      <div id="hafen-hb" class="hafen-stk">${HARBOUR()}</div>
${ships.map(([x], i) => `      <div id="hafen-sh${i}" class="hafen-sp hafen-stk" style="left:${x}px;top:${980}px;">${SHIP("hafen-sh" + i)}</div>`).join("\n")}
      <svg id="hafen-sea" viewBox="0 0 880 160" overflow="visible"><defs><clipPath id="hafen-cp"><rect x="0" y="0" width="880" height="160" rx="26"/></clipPath></defs>
        <rect x="0" y="0" width="880" height="160" rx="26" fill="#4C7BD9" stroke="${K}" stroke-width="8"/>
        <g clip-path="url(#hafen-cp)"><g id="hafen-wv">${[30, 80, 125].map((y, k) => { let dd = `M-200 ${y}`; for (let x = -200; x < 1080; x += 80) dd += ` q20 -16 40 0 t40 0`; return `<path d="${dd}" fill="none" stroke="${k % 2 ? "#9FC3FF" : "#fff"}" stroke-width="7" stroke-linecap="round" opacity=".7"/>`; }).join("")}</g></g></svg>`,
    `      tl.fromTo("#hafen-hb", { scaleY: 0.9 }, { scaleY: 1, duration: 0.3, ease: "back.out(2)", transformOrigin: "50% 100%" }, 0);
      tl.fromTo("#hafen-wv", { x: 0 }, { x: 80, duration: ${f2(d / 2)}, ease: "none", repeat: 1 }, 0);
${ships.map(([, t], i) => `      tl.fromTo("#hafen-sh${i}", { x: 40, opacity: 0, rotation: 4 }, { x: 0, opacity: 1, rotation: 0, duration: 0.35, ease: "back.out(1.6)" }, ${t});
      tl.to("#hafen-sh${i}", { keyframes: { y: [0, -10, 0], rotation: [0, -3, 0] }, duration: 0.6, ease: "sine.inOut", repeat: 1 }, ${f2(t + 0.35)});`).join("\n")}
${ships.map((_, i) => `      gsap.set("#hafen-sh${i}-pn", { svgOrigin: "70 30" });
      tl.to("#hafen-sh${i}-pn", { keyframes: { scaleX: [1, 0.7, 1] }, duration: 0.4, ease: "sine.inOut", repeat: 4 }, 0);`).join("\n")}`));
}

// ================= WAAGE: a balance scale tips: one tartlet against a heap of bills (c11); the caption KRIEG is stamped =================
{
  const p = "waage";
  const [s, d] = S(p);
  // pivot at (540, 900); beam half length 320; pans hang from the beam ends
  const TILT = 11, dy = f2(Math.sin(TILT * Math.PI / 180) * 320);
  scenes.push(scene(p, "Waage kippt", s, d,
    `#waage-pi{${abs(440, 870, 200, 460)}}
     #waage-bm{${abs(200, 870, 680, 60)}transform-origin:340px 30px;}
     #waage-pL{${abs(114, 900, 220, 200)}} #waage-pR{${abs(746, 900, 220, 200)}}
     #waage-tL{${abs(170, 978, 110, 94)}}
     .waage-rs{position:absolute;width:150px;height:36px;}`,
    `      <div id="waage-pi" class="waage-stk">${PILLAR()}</div>
      <div id="waage-gL"><div id="waage-pL" class="waage-stk">${PAN()}</div><div id="waage-tL">${TART()}</div></div>
      <div id="waage-gR"><div id="waage-pR" class="waage-stk">${PAN()}</div>
${[0, 1, 2].map((i) => `        <div id="waage-r${i}" class="waage-rs" style="left:${780 + (i % 2) * 6}px;top:${1012 - i * 30}px;">${SHEET([PAPER, PINK, MINT][i], 500 + i)}</div>`).join("\n")}</div>
      <div id="waage-bm" class="waage-stk">${BEAM()}</div>`,
    `      // level at the cut, then the bills side sinks (with a little overshoot)
      tl.fromTo("#waage-bm", { rotation: 0 }, { keyframes: { rotation: [0, ${TILT + 3}, ${TILT - 2}, ${TILT}] }, duration: 0.7, ease: "power2.out" }, 0.35);
      tl.fromTo("#waage-gL", { y: 0 }, { keyframes: { y: [0, ${-dy - 16}, ${-dy + 10}, ${-dy}] }, duration: 0.7, ease: "power2.out" }, 0.35);
      tl.fromTo("#waage-gR", { y: 0 }, { keyframes: { y: [0, ${dy + 16}, ${dy - 10}, ${dy}] }, duration: 0.7, ease: "power2.out" }, 0.35);
      tl.to("#waage-tL", { keyframes: { y: [0, -30, 0], rotation: [0, -10, 0] }, duration: 0.4, ease: "power2.out" }, 0.55);
${shake("#waage-kb", 0.58, 10, 0.35)}`));
}

// ================= TORTE: the name: a cake slice with rays (c12, punchline KUCHEN-KRIEG) =================
{
  const p = "torte";
  const [s, d] = S(p);
  const b = burst("torte-b", 10, 540, 1110, 50, 190, 1212, [YEL, PINK, "#fff"]);
  scenes.push(scene(p, "Tortenstueck", s, d,
    `#torte-ry{${abs(300, 838, 480, 480)}}
     #torte-sl{${abs(290, 880, 500, 404)}transform-origin:50% 100%;}`,
    `      <div id="torte-ry">${RAYS("torte-rg")}</div>
      <div id="torte-sl" class="torte-stk">${SLICE()}</div>
      ${b.html}`,
    `      gsap.set("#torte-rg", { svgOrigin: "350 350" });
      tl.fromTo("#torte-rg", { rotation: 0 }, { rotation: 40, duration: ${d}, ease: "none" }, 0);
      tl.fromTo("#torte-sl", { scale: 0.86, rotation: -5 }, { scale: 1, rotation: 0, duration: 0.4, ease: "back.out(2.4)" }, 0);
${b.js(0.25)}
      tl.to("#torte-sl", { keyframes: { scaleY: [1, 0.94, 1.04, 1], rotation: [0, 2, -2, 0] }, duration: 0.6, ease: "sine.inOut", repeat: 2 }, 0.6);
${shake("#torte-kb", 0.6, 8, 0.35)}`));
}

// ================= FRIEDEN: handshake, coins hop over a level scale from Mexico's pan to France's pan (c13) =================
{
  const p = "frieden";
  const [s, d] = S(p);
  const coins = [0.55, 0.8, 1.05, 1.3];
  scenes.push(scene(p, "Handschlag und Muenzen", s, d,
    `#frieden-aL{${abs(150, 800, 400, 160)}} #frieden-aR{${abs(530, 800, 400, 160)}transform:scaleX(-1);}
     #frieden-hs{position:absolute;left:0;top:0;width:1080px;height:1920px;}
     #frieden-pi{${abs(470, 1040, 140, 300)}}
     #frieden-bm{${abs(220, 1030, 640, 56)}}
     #frieden-pL{${abs(150, 1060, 200, 182)}} #frieden-pR{${abs(730, 1060, 200, 182)}}
     .frieden-cn{position:absolute;width:64px;height:64px;}
     #frieden-fL{${abs(170, 1270, 120, 80)}} #frieden-fR{${abs(790, 1270, 120, 80)}}`,
    `      <div id="frieden-hs"><div id="frieden-aL" class="frieden-stk">${ARMHAND("#3A4270", MX)}</div><div id="frieden-aR" class="frieden-stk">${ARMHAND("#3A4270", FR.slice().reverse())}</div></div>
      <div id="frieden-pi" class="frieden-stk">${PILLAR()}</div>
      <div id="frieden-pL" class="frieden-stk">${PAN()}</div><div id="frieden-pR" class="frieden-stk">${PAN()}</div>
      <div id="frieden-bm" class="frieden-stk">${BEAM()}</div>
${coins.map((_, i) => `      <div id="frieden-c${i}" class="frieden-cn" style="left:${218 + (i % 2) * 16}px;top:${1158 - (i % 2) * 8}px;">${COIN()}</div>`).join("\n")}`,
    `      tl.fromTo("#frieden-aL", { x: -30 }, { x: 0, duration: 0.3, ease: "back.out(2)" }, 0);
      tl.fromTo("#frieden-aR", { x: 30 }, { x: 0, duration: 0.3, ease: "back.out(2)" }, 0);
      // shake hands: up and down
      tl.to("#frieden-hs", { keyframes: { y: [0, -22, 0, -22, 0, -12, 0] }, duration: 0.9, ease: "sine.inOut" }, 0.3);
      // coins hop in an arc from the left pan to the right pan
${coins.map((t, i) => `      tl.fromTo("#frieden-c${i}", { x: 0, y: 0, rotation: 0 }, { keyframes: { x: [0, 260, 520], y: [0, -120, ${-(i % 2) * 16 + i * -14}], rotation: [0, 180, 360] }, duration: 0.45, ease: "none" }, ${t});`).join("\n")}`));
}

// ================= VORHANG: the curtain opens a crack: a spotlight and a mysterious silhouette (c14) =================
{
  const p = "vorhang";
  const [s, d] = S(p);
  scenes.push(scene(p, "Vorhang", s, d,
    `#vorhang-val{${abs(110, 780, 860, 80)}}
     #vorhang-cL{${abs(120, 800, 420, 540)}transform-origin:0% 50%;}
     #vorhang-cR{${abs(540, 800, 420, 540)}transform-origin:100% 50%;}
     #vorhang-sp{${abs(330, 840, 420, 500)}}
     #vorhang-sil{${abs(450, 1000, 180, 225)}}`,
    `      <svg id="vorhang-sp" viewBox="0 0 420 500" overflow="visible"><path d="M170 0 H250 L410 440 Q210 520 10 440 Z" fill="#FFE58A" opacity=".35"/><ellipse cx="210" cy="440" rx="200" ry="40" fill="#FFE58A" opacity=".4"/></svg>
      <div id="vorhang-sil">${BOOT().replace(/fill="[^"]+"/g, 'fill="#121833"').replace(/stroke="[^"]+"/g, 'stroke="#121833"')}</div>
      <div id="vorhang-cL" class="vorhang-stk">${CURTAIN()}</div>
      <div id="vorhang-cR" class="vorhang-stk" style="transform:scaleX(-1);">${CURTAIN()}</div>
      <svg id="vorhang-val" viewBox="0 0 860 80" overflow="visible"><path d="M0 0 H860 V40 Q805 84 750 40 Q695 84 640 40 Q585 84 530 40 Q475 84 420 40 Q365 84 310 40 Q255 84 200 40 Q145 84 90 40 Q45 84 0 40 Z" fill="#A8223F" stroke="${K}" stroke-width="8" stroke-linejoin="round"/><path d="M20 16 H840" stroke="${GOLD}" stroke-width="8" stroke-linecap="round"/></svg>`,
    `      // closed at the cut, opens a gap (scaleX from the outer edges)
      tl.fromTo("#vorhang-cL", { scaleX: 1 }, { scaleX: 0.62, duration: 0.55, ease: "power2.inOut" }, 0.2);
      tl.fromTo("#vorhang-cR", { scaleX: -1 }, { scaleX: -0.62, duration: 0.55, ease: "power2.inOut" }, 0.2);
      tl.to("#vorhang-cL", { keyframes: { scaleX: [0.62, 0.58, 0.62] }, duration: 0.8, ease: "sine.inOut" }, 0.8);
      tl.to("#vorhang-cR", { keyframes: { scaleX: [-0.62, -0.58, -0.62] }, duration: 0.8, ease: "sine.inOut" }, 0.8);
      tl.fromTo("#vorhang-sp", { opacity: 0.3 }, { opacity: 1, duration: 0.4, ease: "power1.out" }, 0.4);`));
}

// ================= STIEFEL: a single riding boot on a cushion in a spotlight (c15) - nothing else, no injury =================
{
  const p = "stiefel";
  const [s, d] = S(p);
  const tw = twinkle("stiefel-t", [[300, 900, 46], [790, 930, 50], [270, 1180, 40], [820, 1170, 44]], d, 1842);
  scenes.push(scene(p, "Ein einzelner Stiefel", s, d,
    `#stiefel-ry{${abs(270, 790, 540, 540)}}
     #stiefel-cu{${abs(320, 1210, 440, 130)}}
     #stiefel-bt{${abs(380, 840, 320, 400)}transform-origin:50% 92%;}`,
    `      <div id="stiefel-ry">${RAYS("stiefel-rg", "#FFFFFF")}</div>
      <div id="stiefel-cu" class="stiefel-stk">${CUSHION()}</div>
      <div id="stiefel-bt" class="stiefel-stk">${BOOT()}</div>
      ${tw.html}`,
    `      gsap.set("#stiefel-rg", { svgOrigin: "350 350" });
      tl.fromTo("#stiefel-rg", { rotation: 0 }, { rotation: -45, duration: ${d}, ease: "none" }, 0);
      tl.fromTo("#stiefel-bt", { scale: 0.9, y: -20 }, { scale: 1, y: 0, duration: 0.35, ease: "back.out(2.4)" }, 0);
      // the boot hops on its cushion, proud
      tl.to("#stiefel-bt", { keyframes: { y: [0, -40, 0], rotation: [0, -6, 0], scaleY: [1, 1.04, 0.94] }, duration: 0.5, ease: "power1.inOut", repeat: 3 }, 0.5);
      tl.to("#stiefel-cu", { keyframes: { scaleY: [1, 1, 0.9, 1] }, duration: 0.5, ease: "none", repeat: 3, transformOrigin: "50% 100%" }, 0.5);
      tl.to("#stiefel-bt", { y: 0, rotation: 0, scaleY: 1, duration: 0.2 }, 2.5);
${tw.js}`));
}

// ================= GRAB: a small gravestone with a boot engraving and a flower (c16); Klotz salutes, confused =================
{
  const p = "grab";
  const [s, d] = S(p);
  scenes.push(scene(p, "Grabstein mit Stiefel", s, d,
    `#grab-hill{${abs(170, 1220, 740, 120)}}
     #grab-st{${abs(380, 880, 320, 380)}transform-origin:50% 100%;}
     #grab-fl{${abs(700, 1080, 110, 240)}transform-origin:50% 100%;}
     #grab-moon{${abs(170, 800, 130, 130)}}`,
    `      <svg id="grab-moon" viewBox="0 0 130 130" overflow="visible"><path d="M90 10 Q30 20 30 70 Q34 118 90 122 Q20 140 10 70 Q12 6 90 10 Z" fill="#FFF3C4" stroke="${K}" stroke-width="7" stroke-linejoin="round"/></svg>
      <svg id="grab-hill" viewBox="0 0 740 120" overflow="visible"><path d="M0 120 Q60 30 370 26 Q680 30 740 120 Z" fill="#3E9B62" stroke="${K}" stroke-width="8" stroke-linejoin="round"/><path d="M120 80 l10 -20 l10 20 M600 82 l10 -20 l10 20 M480 50 l8 -16 l8 16" stroke="#7ED79A" stroke-width="6" fill="none" stroke-linecap="round"/></svg>
      <div id="grab-st" class="grab-stk">${STONEG()}</div>
      <div id="grab-fl" class="grab-stk">${FLOWER()}</div>`,
    `      tl.fromTo("#grab-st", { scaleY: 0.9 }, { scaleY: 1, duration: 0.35, ease: "back.out(2)" }, 0);
      tl.fromTo("#grab-fl", { scale: 0.7, rotation: -10 }, { scale: 1, rotation: 0, duration: 0.35, ease: "back.out(2.6)" }, 0.2);
      tl.to("#grab-fl", { keyframes: { rotation: [0, 6, -5, 0] }, duration: 1.1, ease: "sine.inOut", repeat: 1 }, 0.55);
      gsap.set("#flw-head", { svgOrigin: "62 74" });
      tl.to("#flw-head", { rotation: 72, duration: ${f2(d - 0.2)}, ease: "none" }, 0);
      tl.to("#grab-moon", { keyframes: { y: [0, -8, 0] }, duration: 1.3, ease: "sine.inOut", repeat: 1 }, 0);`));
}

// ================= FRAGE + loop: comment bubble with a cake slice and a fork, then the hook picture again (c17 + c18) =================
{
  const p = "frage";
  const [s, d] = S(p);
  const LOOP = f2(C.c18[0] - s);
  const tw = twinkle("frage-t", HOOK_TW, d, 1838);
  scenes.push(scene(p, "Frage und Loop", s, d, hookCss(p) + `
     #frage-bb{${abs(160, 800, 760, 470)}transform-origin:80% 100%;}
     #frage-sl{${abs(300, 870, 300, 242)}transform-origin:50% 100%;}
     #frage-fk{${abs(650, 850, 60, 223)}transform-origin:50% 100%;}
     #frage-ht{${abs(740, 880, 110, 101)}}`,
    hookBody(p) + "\n      " + tw.html + `
      <div id="frage-bb" class="frage-stk">${BUBBLE()}</div>
      <div id="frage-sl">${SLICE()}</div>
      <div id="frage-fk">${FORK()}</div>
      <div id="frage-ht">${HEART()}</div>`,
    `      gsap.set(["#frage-glow", "#frage-plL", "#frage-flL", "#frage-plR", "#frage-flR", "#frage-lbL", "#frage-lbR", "#frage-st", "#frage-tt"], { opacity: 0 });
      tl.fromTo("#frage-bb", { scale: 0.85, rotation: -3 }, { scale: 1, rotation: 0, duration: 0.35, ease: "back.out(2)" }, 0);
      tl.fromTo("#frage-sl", { scale: 0.6 }, { scale: 1, duration: 0.3, ease: "back.out(2.6)" }, 0.1);
      tl.fromTo("#frage-fk", { scale: 0.5, rotation: 30 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2.6)" }, 0.2);
      tl.fromTo("#frage-ht", { scale: 0, opacity: 1 }, { scale: 1, duration: 0.3, ease: "back.out(3)", immediateRender: true }, 0.45);
      tl.to("#frage-ht", { keyframes: { scale: [1, 1.18, 1] }, duration: 0.5, ease: "sine.inOut", repeat: 2 }, 0.8);
      tl.to("#frage-fk", { keyframes: { rotation: [0, -10, 8, 0] }, duration: 0.8, ease: "sine.inOut", repeat: 1 }, 0.5);
      // loop (${LOOP}): hard switch in one frame - bubble gone, hook picture in its frame-0 pose (incl. sparkles at their start scale)
      gsap.set([${[0, 1, 2, 3].map((i) => `"#frage-t-${i}"`).join(", ")}], { scale: 0.3, rotation: 0, opacity: 0 });
      tl.set(["#frage-bb", "#frage-sl", "#frage-fk", "#frage-ht"], { opacity: 0 }, ${LOOP});
      tl.set(["#frage-glow", "#frage-plL", "#frage-flL", "#frage-plR", "#frage-flR", "#frage-lbL", "#frage-lbR", "#frage-st", "#frage-tt", ${[0, 1, 2, 3].map((i) => `"#frage-t-${i}"`).join(", ")}], { opacity: 1 }, ${LOOP});
      // the last frame is frame 0 again`,
    { exit: false, kb: false }));
}

// ================= background: night blue, pastel sprinkles drifting (all loop-seamless) =================
{
  const RS = mulberry32(1839);
  const cols = [PINK, MINT, YEL, LAV, "#fff"];
  const sq = (n, minS, maxS, op) => Array.from({ length: n }, () => ({ x: Math.round(40 + RS() * 1000), y: Math.round(RS() * 1920), s: Math.round(minS + RS() * (maxS - minS)), r: Math.round(RS() * 180), c: cols[Math.floor(RS() * cols.length)], o: +(op * (0.6 + RS() * 0.4)).toFixed(2) }));
  const far = sq(22, 14, 22, 0.28), near = sq(12, 22, 32, 0.38);
  const tile = (fl, k) => fl.map((f) => `<rect x="${f.x - f.s / 2}" y="${f.y + k * 1920 - 4}" width="${f.s}" height="8" rx="4" fill="${f.c}" opacity="${f.o}" transform="rotate(${f.r} ${f.x} ${f.y + k * 1920})"/>`).join("");
  const stars = Array.from({ length: 26 }, () => `<circle cx="${Math.round(RS() * 1080)}" cy="${Math.round(40 + RS() * 1300)}" r="${(1.5 + RS() * 2).toFixed(1)}" fill="#fff" opacity="${(0.25 + RS() * 0.4).toFixed(2)}"/>`).join("");
  fs.writeFileSync(path.join(OUT, "compositions", "bg.html"), `<template>
  <style>
    #root { position: absolute; inset: 0; overflow: hidden; background: #0E1530; }
    #bg-sky { position: absolute; inset: 0; background: linear-gradient(180deg, #0B1230 0%, #0E1530 45%, #1A2150 78%, #22285C 100%); }
    #bg-stars { position: absolute; left: 0; top: 0; }
    #bg-glow { position: absolute; left: 140px; top: 640px; width: 800px; height: 800px; border-radius: 50%; background: radial-gradient(circle, rgba(255,179,199,.10) 0%, rgba(255,179,199,0) 65%); }
    #bg-floor { position: absolute; left: 0; top: 1500px; }
    .bg-px { position: absolute; left: 0; top: 0; }
  </style>
  <div id="root" data-composition-id="bg" data-width="1080" data-height="1920" data-layout-allow-overflow>
    <div id="bg-sky"></div>
    <svg id="bg-stars" width="1080" height="1400">${stars}</svg>
    <div id="bg-glow"></div>
    <svg id="bg-floor" width="1080" height="420" viewBox="0 0 1080 420"><path d="M0 60 Q270 20 540 50 Q810 80 1080 40 V420 H0 Z" fill="#161E45"/>${Array.from({ length: 10 }, (_, i) => `<path d="M${i * 120 - 20} 420 L${i * 120 + 40} 70" stroke="#1C2552" stroke-width="30"/>`).join("")}</svg>
    <svg id="bg-p1" class="bg-px" width="1080" height="3840">${tile(far, 0)}${tile(far, 1)}</svg>
    <svg id="bg-p2" class="bg-px" width="1080" height="5760">${tile(near, 0)}${tile(near, 1)}${tile(near, 2)}</svg>
  </div>
  <script>
    (function () {
      const tl = gsap.timeline({ paused: true });
      // every move covers whole periods, so the last frame leads straight back into frame 0
      tl.fromTo("#bg-p1", { y: 0 }, { y: -1920, duration: ${LAST}, ease: "none" }, 0);
      tl.fromTo("#bg-p2", { y: 0 }, { y: -3840, duration: ${LAST}, ease: "none" }, 0);
      tl.fromTo("#bg-glow", { opacity: 1 }, { keyframes: { opacity: [1, 0.6, 1] }, duration: ${(LAST / 4).toFixed(5)}, ease: "sine.inOut", repeat: 3 }, 0);
      window.__timelines["bg"] = tl;
    })();
  </script>
</template>
`);
}

// ================= captions =================
// "*" keyword (yellow Lilita, 140 px), "#" the same with tighter letters, "%" tightest (hook KUCHEN?!), "!" punchline (largest, 200 px). "/" line break.
// "+" glues a word to the one before (no gap, e.g. "zwei-" + "hundert"): counted as one word.
// Fixed word gap: every word has 11 px margins.
const HOOKW = ["Ein", "Krieg", "/", "wegen", "%KUCHEN?!"];
const caps = [
  { id: "c01", words: HOOKW, still: true },
  { id: "c02", words: ["Mexiko,", "/", "vor", "fast", "zwei-", "/", "+hundert", "Jahren."] },
  { id: "c03", words: ["Ein", "französischer", "/", "Konditor", "hat", "Pech."] },
  { id: "c04", words: ["*GEPLÜNDERT:", "/", "seine", "Konditorei."], shake: true },
  { id: "c05", words: ["Wert", "des", "Ladens:", "/", "*< 1.000", "Pesos."] },
  { id: "c06", words: ["Er", "fordert:", "/", "*60.000", "Pesos."] },
  { id: "c07", words: ["Frankreich", "nimmt", "/", "das", "zum", "Anlass."] },
  { id: "c08", words: ["Mit", "anderen", "/", "Forderungen", "/", "sind", "es:"] },
  { id: "c09", words: ["#600.000", "Pesos."], shake: true },
  { id: "c10", words: ["*1838:", "Frankreich", "/", "sperrt", "die", "Häfen."] },
  { id: "c11", words: ["Mexiko", "erklärt", "/", "den", "*KRIEG."], stamp: true },
  { id: "c12", words: ["!KUCHEN-", "/", "+!KRIEG", "/", "heißt", "er", "seitdem."], shake: true },
  { id: "c13", words: ["*1839:", "Frieden.", "/", "Mexiko", "zahlt."] },
  { id: "c14", words: ["Und", "jetzt", "/", "das", "Skurrilste?"] },
  { id: "c15", words: ["Mexikos", "General", "/", "Santa", "Anna\u00a0…"] },
  { id: "c15b", words: ["verliert", "ein", "*BEIN."] },
  { id: "c16", words: ["Das", "Bein", "/", "bekommt", "später", "/", "ein", "#BEGRÄBNIS."] },
  { id: "c17", words: ["Wofür", "würdest", "du", "/", "Krieg", "führen?"], hard: true },
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
  const kind = (w) => (w === "/" ? "br" : "*!#%".includes(core(w)[0]) && core(w).length > 1 ? core(w)[0] : "");
  const spans = c.words.map((w, i) => {
    const k = kind(w);
    if (k === "br") return `<br/>`;
    const txt = (k ? core(w).slice(1) : core(w)).replace(/</g, "&lt;");
    const nx = c.words[i + 1] === "/" ? c.words[i + 2] : c.words[i + 1];
    const gl = [glue(w) ? "gl" : "", nx && glue(nx) ? "gr" : ""].filter(Boolean).join(" ");
    const cls = { "*": "w kw", "#": "w kw kwn", "%": "w kw kwx", "!": "w pt", "": "w" }[k] + (gl ? " " + gl : "");
    return `<span id="${c.id}-o${i}" class="${cls}"><span id="${c.id}-w${i}" class="g">${txt}</span></span>`;
  });
  let inner = "";
  spans.forEach((sp, i) => { inner += (i && !glue(c.words[i]) ? " " : "") + sp; });
  capHtml += `      <div id="${c.id}" class="cap clip" data-start="${c.s}" data-duration="${d}" data-track-index="${track}" data-layout-allow-overlap>${inner.replace(/ <br\/> /g, "<br/>").replace(/ <br\/>/g, "<br/>")}</div>\n`;
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
    if (c.loop) { full = c.s; return; }
    const at = f2(c.s + 0.02 + n * ST);
    if (!glue(w)) n++;
    if (k) {
      if (c.stamp) capJs += `      tl.fromTo("#${c.id}-w${i}", { opacity: 0, scale: 1.9, rotation: -8 }, { opacity: 1, scale: 1, rotation: -3, duration: ${KD}, ease: "power4.in" }, ${at});\n`
        + `      tl.to("#${c.id}-w${i}", { keyframes: { x: [0, -8, 8, -4, 0] }, duration: 0.3, ease: "none" }, ${f2(at + KD)});\n`;
      else capJs += `      tl.fromTo("#${c.id}-w${i}", { opacity: 0, scale: 1.15, rotation: -6 }, { opacity: 1, scale: 1, rotation: 0, duration: ${KD}, ease: "back.out(2.2)" }, ${at});\n`;
      if (c.shake) capJs += `      tl.to("#${c.id}-w${i}", { keyframes: { x: [0, -10, 10, -6, 4, 0], rotation: [0, -3, 3, -2, 0, 0] }, duration: 0.36, ease: "none" }, ${f2(at + 0.28)});\n`;
      full = Math.max(full, at + KD);
    } else {
      capJs += `      tl.fromTo("#${c.id}-w${i}", { opacity: 0, scale: 0.4, y: 26 }, { opacity: 1, scale: 1, y: 0, duration: ${PD}, ease: "back.out(1.6)" }, ${at});\n`;
      full = Math.max(full, at + PD);
    }
  });
  if (wc > 6) throw new Error(c.id + " has more than 6 words");
  if (c.loop) { report.push(`${c.id} loop copy of c01, complete @${full.toFixed(2)} (end ${c.e})`); if (full > DUR - 0.1) throw new Error("loop caption not complete before the end"); continue; }
  const ex = c.hard ? c.e : f2(c.e - EXIT - 0.01);
  if (!c.hard) capJs += `      tl.to("#${c.id} .g", { opacity: 0, scale: 0.85, duration: ${EXIT}, ease: "power2.in" }, ${ex});\n`;
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
    .kwn { letter-spacing: -0.06em; } .kwx { letter-spacing: -0.09em; }
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

// ================= Klotz (rig from Folge 1-7; new gag: pastry-chef toque, a tartlet he defends and finally eats) =================
// eyes always open: no mood closes the lids. The right arm never points to the right outward (hand would pass x 1000).
// While he holds the tartlet (TART_ON .. EAT_T) the left arm stays at 70 deg (the hand next to the tartlet).
const M = {
  shock:     { eye: 1.12, ps: 0.6, px: 0, py: 0, bL: -18, bR: -18, tL: -6, tR: -6, mx: 1, my: 1.1, g: 0, aL: 70, aR: -45 },
  surprised: { eye: 1.08, ps: 0.8, px: 0, py: 6, bL: -16, bR: -16, tL: 0, tR: 0, mx: 0.55, my: 0.6, g: 0, aL: 55, aR: -45 },
  curious:   { eye: 1.05, ps: 1.1, px: -14, py: -10, bL: -18, bR: -4, tL: 0, tR: 0, mx: 0.5, my: 0.35, g: 0, aL: 40, aR: -40 },
  look:      { eye: 1.06, ps: 1.0, px: -14, py: -12, bL: -14, bR: -14, tL: -4, tR: -4, mx: 0.5, my: 0.5, g: 0, aL: 40, aR: -40 },
  wary:      { eye: 1.04, ps: 0.9, px: -16, py: 0, bL: -4, bR: -4, tL: 10, tR: 10, mx: 0.45, my: 0.25, g: 0, aL: 70, aR: -35 },
  impressed: { eye: 1.05, ps: 0.9, px: -6, py: -4, bL: -12, bR: -12, tL: -4, tR: -4, mx: 0.45, my: 0.45, g: 0, aL: 40, aR: -40 },
  jawdrop:   { eye: 1.18, ps: 0.55, px: -6, py: -8, bL: -22, bR: -22, tL: -4, tR: -4, mx: 1.1, my: 1.7, jy: 14, g: 0, aL: 60, aR: -45 },
  choke:     { eye: 1.2, ps: 0.5, px: 0, py: 0, bL: -22, bR: -22, tL: -6, tR: -6, mx: 0.7, my: 0.9, g: 0, aL: 70, aR: -30 },
  happy:     { eye: 1.04, ps: 1, px: 0, py: 0, bL: -10, bR: -10, tL: -4, tR: -4, mx: 0, my: 0, g: 1, gs: 0.8, aL: 35, aR: -35 },
  proud:     { eye: 1.05, ps: 1.0, px: 0, py: -2, bL: -14, bR: -14, tL: -4, tR: -4, mx: 0, my: 0, g: 1, gs: 0.75, aL: 30, aR: -30 },
  confused:  { eye: 1.08, ps: 0.9, px: -10, py: -6, bL: -4, bR: -22, tL: 10, tR: -8, mx: 0.5, my: 0.3, g: 0, aL: 70, aR: -40 },
  chew:      { eye: 1.05, ps: 1, px: 0, py: 0, bL: -12, bR: -12, tL: -6, tR: -6, mx: 0.6, my: 0.45, g: 0, aL: 150, aR: -40 },
};
const LOOPK = C.c18[0];
const TART_ON = f2(C.c04[0] + 0.25), CHOKE = f2(C.c09[0] + 0.1), SALUTE = f2(C.c16[0] + 0.45), EAT_T = f2(C.c17[0] + 0.3);
const moods = [
  [C.c02[0], "curious"], [C.c03[0], "look"], [C.c04[0], "surprised"], [TART_ON + 0.1, "wary"], [C.c05[0], "look"],
  [C.c06[0] + 0.55, "jawdrop"], [C.c07[0], "look"], [C.c08[0], "surprised"], [CHOKE, "choke"], [C.c10[0], "impressed"],
  [C.c11[0], "shock"], [C.c12[0] + 0.2, "happy"], [C.c13[0], "proud"], [C.c14[0], "curious"], [C.c15[0], "surprised"],
  [C.c16[0] + 0.3, "confused"], [C.c16[1] - 0.35, "look"], [EAT_T, "chew"], [f2(EAT_T + 1.55), "happy"], [LOOPK + 0.08, "shock"],
];
const holding = (t) => t >= TART_ON - 0.2 && t < EAT_T;

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
  <g id="k-armS"><rect x="235" y="186" width="34" height="84" rx="17" fill="#F06A0C" stroke="#7A2E00" stroke-width="6"/><circle cx="252" cy="270" r="21" fill="#FF7A1A" stroke="#7A2E00" stroke-width="6"/></g>
  <g id="k-hat" class="k-prop">
    <path d="M76 52 Q40 46 44 4 Q50 -34 92 -30 Q104 -70 150 -66 Q196 -70 208 -30 Q250 -34 256 4 Q260 46 224 52 Z" fill="#fff" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
    <path d="M100 -24 Q110 10 104 40 M150 -50 V40 M200 -24 Q190 10 196 40" stroke="#DDE2F0" stroke-width="7" fill="none" stroke-linecap="round"/>
    <rect x="72" y="22" width="156" height="34" rx="10" fill="#fff" stroke="${K}" stroke-width="8"/>
    <path d="M86 40 H214" stroke="${PINK}" stroke-width="8" stroke-linecap="round"/>
  </g>
</svg>`;
let kJs = "";
const setMood = (m, t, dur) => {
  const p = { ...M[m] };
  if (holding(t) && m !== "chew") p.aL = 70;
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
kJs += `      gsap.set("#k-armL", { svgOrigin: "48 190" }); gsap.set("#k-armR", { svgOrigin: "252 190" }); gsap.set("#k-armS", { svgOrigin: "252 190", rotation: -40, opacity: 0 });
      gsap.set(["#k-eyeL"], { svgOrigin: "108 140" }); gsap.set(["#k-eyeR"], { svgOrigin: "192 140" });
      gsap.set("#k-pupL", { svgOrigin: "108 142" }); gsap.set("#k-pupR", { svgOrigin: "192 142" });
      gsap.set("#k-lidL", { svgOrigin: "108 90" }); gsap.set("#k-lidR", { svgOrigin: "192 90" });
      gsap.set("#k-browL", { svgOrigin: "109 81" }); gsap.set("#k-browR", { svgOrigin: "191 81" });
      gsap.set("#k-mouth", { svgOrigin: "150 228" }); gsap.set("#k-grin", { svgOrigin: "150 230" });
      gsap.set("#k-hat", { svgOrigin: "150 52" });
      gsap.set(["#k-chkL", "#k-chkR"], { svgOrigin: "150 198" });
      gsap.set("#k-sweat", { svgOrigin: "262 92", opacity: 0, scale: 0 });
      gsap.set("#k-tart", { opacity: 0, scale: 0, x: 0, y: 0, rotation: 0, transformOrigin: "50% 80%" });
      gsap.set(["#k-crumb", ${[0, 1, 2, 3, 4].map((i) => `"#k-cb${i}"`).join(", ")}], { opacity: 0, x: 0, y: 0 });
      gsap.set(["#k-eyeL", "#k-eyeR"], { scale: ${p0.eye} });
      gsap.set(["#k-pupL", "#k-pupR"], { x: 0, y: 0, scale: ${p0.ps} });
      gsap.set(["#k-lidL", "#k-lidR"], { scaleY: 0 });
      gsap.set("#k-browL", { y: ${p0.bL}, rotation: ${p0.tL} }); gsap.set("#k-browR", { y: ${p0.bR}, rotation: ${-p0.tR} });
      gsap.set("#k-mouth", { scaleX: ${p0.mx}, scaleY: ${p0.my}, y: 0, opacity: 1 }); gsap.set("#k-grin", { scale: 0.2, opacity: 0 });
      gsap.set("#k-armL", { rotation: ${p0.aL} }); gsap.set("#k-armR", { rotation: ${p0.aR} });
      gsap.set("#k-wrap", { x: 0, y: 0, rotation: 0, scale: 1 }); gsap.set("#k-sq", { scaleX: 1, scaleY: 1 });
      // idle bob: whole half-cycles over the film, ends where it starts
      tl.fromTo("#k-bob", { y: 0 }, { y: -12, duration: ${(LAST / 80).toFixed(5)}, ease: "sine.inOut", yoyo: true, repeat: 79 }, 0);
      // toque wobbles a little with every bob (whole cycles)
      tl.fromTo("#k-hat", { rotation: 0 }, { keyframes: { rotation: [0, 3, 0, -3, 0] }, duration: ${(LAST / 20).toFixed(5)}, ease: "sine.inOut", repeat: 19 }, 0);
      // hook: shocked jump
      tl.to("#k-wrap", { keyframes: { y: [0, -18, 0, -8, 0] }, duration: 0.6, ease: "none" }, 0.3);
`;
for (const [t, m] of moods) {
  kJs += `      // ${m} @ ${f2(t)}\n`;
  kJs += `      tl.to("#k-sq", { keyframes: { scaleY: [1, 0.9, 1.06, 1], scaleX: [1, 1.07, 0.97, 1] }, duration: 0.3, ease: "none" }, ${f2(t - 0.05)});\n`;
  kJs += setMood(m, f2(t + 0.03), 0.22);
}
// crumbs for the bites (fly out from the mouth)
const RSK = mulberry32(2017);
const CB = Array.from({ length: 5 }, () => ({ x: Math.round(-70 + RSK() * 140), y: Math.round(-40 - RSK() * 50) }));
kJs += `      // GAG 1 (${TART_ON}): a tartlet pops into his arms - he guards it, eyes darting
      tl.to("#k-tart", { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(2.6)" }, ${TART_ON});
      tl.to("#k-wrap", { keyframes: { rotation: [0, -4, -2, -4, 0], x: [0, -6, -4, -6, 0] }, duration: 1.4, ease: "sine.inOut" }, ${f2(TART_ON + 0.2)});
      tl.to(["#k-pupL", "#k-pupR"], { keyframes: { x: [-16, 12, -16, 12, 0] }, duration: 1.2, ease: "power1.inOut" }, ${f2(TART_ON + 0.35)});
      tl.to("#k-tart", { keyframes: { x: [0, 10, 0], rotation: [0, 6, 0] }, duration: 0.6, ease: "sine.inOut", repeat: 1 }, ${f2(TART_ON + 0.3)});
      // GAG 2 (${CHOKE}): the bill grows, he nibbles nervously and chokes on a crumb
      tl.to("#k-tart", { keyframes: { x: [0, 120, 0], y: [0, -20, 0], scale: [1, 0.9, 1] }, duration: 0.4, ease: "power1.inOut" }, ${f2(CHOKE - 0.35)});
      tl.to("#k-wrap", { keyframes: { x: [0, -8, 8, -6, 6, -3, 0], y: [0, -10, 0, -10, 0, -4, 0], scaleY: [1, 0.94, 1.04, 0.95, 1.03, 1, 1] }, duration: 0.75, ease: "none" }, ${f2(CHOKE + 0.1)});
      tl.to(["#k-chkL", "#k-chkR"], { keyframes: { opacity: [0.4, 0.95, 0.95, 0.4], scale: [1, 1.3, 1.3, 1] }, duration: 1.2, ease: "none" }, ${f2(CHOKE + 0.1)});
      tl.fromTo("#k-crumb", { x: 0, y: 0, opacity: 0 }, { keyframes: { x: [0, -60, -130], y: [0, -90, -40], opacity: [1, 1, 0] }, duration: 0.5, ease: "power1.out", immediateRender: false }, ${f2(CHOKE + 0.55)});
      tl.to("#k-sweat", { opacity: 1, scale: 1, duration: 0.2, ease: "back.out(2)" }, ${f2(CHOKE + 0.2)});
      tl.to("#k-sweat", { keyframes: { y: [0, 30] }, duration: 0.5, ease: "power1.in" }, ${f2(CHOKE + 0.4)});
      tl.to("#k-sweat", { opacity: 0, scale: 0, y: 0, duration: 0.15 }, ${f2(C.c10[0] + 0.1)});
      // c12: a happy little hop (KUCHEN-KRIEG)
      tl.to("#k-wrap", { keyframes: { y: [0, -24, 0, -14, 0] }, duration: 0.7, ease: "none" }, ${f2(C.c12[0] + 0.3)});
      // c14: he leans forward (towards the stage) and back
      tl.to("#k-wrap", { keyframes: { rotation: [0, -9, -9, 0], y: [0, 4, 4, 0] }, duration: 1.4, ease: "power2.inOut" }, ${f2(C.c14[0] + 0.1)});
      // GAG 3 (${SALUTE}): salute at the grave (right hand up to the toque brim), confused brows
      tl.to("#k-wrap", { keyframes: { y: [0, -10, 0] }, duration: 0.3, ease: "power2.out" }, ${SALUTE});
      // the saluting arm is drawn in front of the body (the normal right arm sits behind it); it stops beside the right eye
      tl.set("#k-armR", { opacity: 0 }, ${SALUTE});
      tl.set("#k-armS", { opacity: 1, rotation: -40 }, ${SALUTE});
      tl.to("#k-armS", { rotation: 185, duration: 0.22, ease: "back.out(2)" }, ${SALUTE});
      tl.to("#k-armS", { keyframes: { rotation: [185, 179, 185] }, duration: 0.5, ease: "sine.inOut", repeat: 1 }, ${f2(SALUTE + 0.3)});
      tl.to("#k-armS", { rotation: -40, duration: 0.2, ease: "power2.in" }, ${f2(C.c16[1] - 0.55)});
      tl.set("#k-armS", { opacity: 0 }, ${f2(C.c16[1] - 0.35)});
      tl.set("#k-armR", { opacity: 1 }, ${f2(C.c16[1] - 0.35)});
      tl.to("#k-browR", { keyframes: { rotation: [8, 14, 8] }, duration: 0.6, ease: "sine.inOut" }, ${f2(SALUTE + 0.5)});
      // GAG 4 (${EAT_T}): in protest he eats the tartlet himself: up to the mouth, three bites, crumbs, a big grin
      tl.to("#k-tart", { x: 178, y: 30, scale: 0.72, rotation: -8, duration: 0.3, ease: "power2.out" }, ${EAT_T});
${[0, 1, 2].map((i) => { const tb = f2(EAT_T + 0.45 + i * 0.35); return `      tl.to("#k-mouth", { keyframes: { scaleY: [0.45, 0.08, 0.45], scaleX: [0.6, 0.75, 0.6] }, duration: 0.25, ease: "none" }, ${tb});
      tl.to("#k-tart", { scale: ${[0.55, 0.36, 0][i]}, duration: 0.1, ease: "power2.in" }, ${f2(tb + 0.1)});
      tl.to("#k-sq", { keyframes: { scaleY: [1, 0.95, 1] }, duration: 0.25, ease: "none" }, ${tb});
${[0, 1, 2, 3, 4].filter((k) => k % 3 === i % 3 || i === 2).map((k) => `      tl.set("#k-cb${k}", { x: 0, y: 0, opacity: 1 }, ${f2(tb + 0.1)});
      tl.to("#k-cb${k}", { keyframes: { x: [0, ${CB[k].x}], y: [0, ${CB[k].y}, ${CB[k].y + 60}] }, duration: 0.45, ease: "power1.out" }, ${f2(tb + 0.1)});
      tl.to("#k-cb${k}", { opacity: 0, duration: 0.1 }, ${f2(tb + 0.28)});`).join("\n")}`; }).join("\n")}
      tl.set("#k-tart", { opacity: 0, x: 0, y: 0, rotation: 0 }, ${f2(EAT_T + 1.2)});
      tl.to(["#k-chkL", "#k-chkR"], { keyframes: { scale: [1, 1.35, 1], opacity: [0.4, 0.8, 0.4] }, duration: 0.6, ease: "sine.inOut" }, ${f2(EAT_T + 1.25)});
      tl.to("#k-wrap", { keyframes: { y: [0, -22, 0] }, duration: 0.35, ease: "none" }, ${f2(EAT_T + 1.6)});
      // loop (${LOOPK}): frame-0 shock pose with the jump
      tl.to("#k-wrap", { keyframes: { y: [0, -16, 0] }, duration: 0.3, ease: "none" }, ${f2(LOOPK + 0.05)});
`;
fs.writeFileSync(path.join(OUT, "compositions", "klotz.html"), `<template>
  <style>
    ${FONTFACE}
    #root { position: absolute; inset: 0; pointer-events: none; }
    #k-pod { position: absolute; left: 650px; top: 1748px; width: 350px; height: 120px; }
    #k-wrap { position: absolute; left: 700px; top: 1480px; width: 260px; height: 286px; transform-origin: 50% 100%; }
    #k-bob, #k-sq { position: absolute; inset: 0; transform-origin: 50% 100%; }
    #k-tart { position: absolute; left: -122px; top: 112px; width: 130px; height: 110px; }
    #k-crumb { position: absolute; left: 118px; top: 186px; width: 20px; height: 20px; }
    .k-cb { position: absolute; left: 122px; top: 190px; width: 16px; height: 16px; }
  </style>
  <div id="root" data-composition-id="klotz" data-width="1080" data-height="1920" data-layout-allow-overflow>
    <div id="k-pod"><svg viewBox="0 0 350 120" width="100%" height="100%" overflow="visible"><rect x="10" y="10" width="330" height="104" rx="14" fill="${PINK}" stroke="${K}" stroke-width="8"/><path d="M10 52 H340" stroke="${PINK_D}" stroke-width="6"/>${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${30 + i * 52} 66 Q${56 + i * 52} 96 ${82 + i * 52} 66" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".7"/>`).join("")}<rect x="10" y="10" width="330" height="22" rx="10" fill="${MINT}" stroke="${K}" stroke-width="6"/></svg></div>
    <div id="k-wrap"><div id="k-bob"><div id="k-sq">
${klotzSvg}
      <div id="k-tart" class="k-prop">${TART()}</div>
      <svg id="k-crumb" class="k-prop" viewBox="0 0 20 20" overflow="visible"><circle cx="10" cy="10" r="8" fill="${CRUST}" stroke="${K}" stroke-width="3"/></svg>
${[0, 1, 2, 3, 4].map((i) => `      <svg id="k-cb${i}" class="k-cb k-prop" viewBox="0 0 16 16" overflow="visible"><circle cx="8" cy="8" r="${5 + (i % 2)}" fill="${i % 2 ? CREAM : CRUST}" stroke="${K}" stroke-width="3"/></svg>`).join("\n")}
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
const c = (id) => C[id][0];
const sfx = [
  [0.0, "impact", 0.35], [0.0, "kaching", 0.3], [0.3, "boing", 0.35], [0.6, "sparkle", 0.3],
  [c("c02"), "whoosh1", 0.4], [c("c02") + 0.5, "paper", 0.4], [c("c02") + 1.1, "paper", 0.35],
  [c("c03"), "whoosh2", 0.35], [c("c03") + 0.05, "ding", 0.4], [c("c03") + 0.3, "pop1", 0.35], [c("c03") + 0.55, "pop2", 0.35],
  [c("c04"), "whoosh1", 0.4], [c("c04") + 0.15, "crumbs", 0.5], [c("c04") + 0.6, "crumbs", 0.4], [TART_ON, "pop2", 0.45], [TART_ON + 0.05, "sparkle", 0.3],
  [c("c05"), "swish", 0.4], [c("c05") + 0.15, "pop1", 0.4], [c("c05") + 0.45, "boing", 0.3],
  [c("c06"), "ratchet", 0.5], [c("c06") + 0.62, "kaching", 0.5], [c("c06") + 0.9, "jump", 0.35], [c("c06") + 0.6, "hmm", 0.3],
  [c("c07"), "whoosh2", 0.35], [c("c07") + 0.5, "pop1", 0.3], [c("c07") + 0.8, "pop1", 0.3], [c("c07") + 1.1, "pop1", 0.3],
  ...[0, 1, 2, 3, 4, 5].map((i) => [c("c08") + 0.32 + i * 0.24, "paper", 0.35]),
  [c("c09"), "whoosh1", 0.35], [c("c09") + 0.04, "ratchet", 0.35], [CHOKE - 0.35, "munch", 0.4], [CHOKE + 0.1, "cough", 0.55], [c("c09") + 0.6, "kaching", 0.35],
  [c("c10"), "waves", 0.45], [c("c10") + 0.35, "shipbell", 0.35], [c("c10") + 0.6, "swish", 0.3], [c("c10") + 0.85, "swish", 0.3],
  [c("c11") + 0.02, "whoosh2", 0.3], [c("c11") + 0.3, "stamp", 0.45], [c("c11") + 0.35, "creak", 0.45], [c("c11") + 0.58, "impact", 0.3],
  [c("c12"), "impact", 0.35], [c("c12") + 0.02, "kaching", 0.35], [c("c12") + 0.25, "confetti", 0.45], [c("c12") + 0.3, "jump", 0.3], [c("c12") + 0.4, "sparkle", 0.35],
  [c("c13"), "whoosh1", 0.35], [c("c13") + 0.3, "pop2", 0.3], [c("c13") + 0.55, "coins", 0.45],
  [c("c14"), "curtain", 0.5], [c("c14") + 0.1, "hmm", 0.35],
  [c("c15"), "whoosh2", 0.35], [c("c15") + 0.05, "sparkle", 0.35], [c("c15") + 0.55, "squeak", 0.35], [c("c15") + 1.05, "squeak", 0.3], [c("c15") + 1.55, "squeak", 0.3],
  [c("c16"), "whoosh1", 0.3], [c("c16") + 0.2, "pop1", 0.3], [SALUTE + 0.1, "bugle", 0.35], [c("c16") + 1.7, "hmm", 0.3],
  [c("c17"), "pop1", 0.4], [c("c17") + 0.45, "pop2", 0.35], [EAT_T + 0.45, "munch", 0.5], [EAT_T + 0.8, "munch", 0.5], [EAT_T + 1.15, "munch", 0.5], [EAT_T + 1.3, "gulp", 0.4],
  [LOOPK - 0.15, "whoosh2", 0.4], [LOOPK, "impact", 0.3],
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
      <audio id="music-waltz" class="clip" src="assets/sfx/music.wav" data-start="0" data-duration="${DUR}" data-track-index="5" data-volume="0.5"></audio>
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
