// Generator for Folge 9 "Der Mann, der den Eiffelturm verkaufte": writes index.html and compositions/*.html
// Usage: node tools/gen.mjs <project_dir>
// Technique from Folge 1-8 (scene helper, Klotz rig, captions with fixed word gap, id checks, exit before the cut).
// New in Folge 9: 1920s art-deco look (gold, cream, teal on night blue). Own drawings: art-deco frames (stepped corners),
// own simplified tower silhouette, top hat + moustache (+ monocle) as the symbol for the con man (no face), flat cap above a
// money sack as the symbol for the buyer (no face), red sign with a euro symbol (no text), playing-card fan with a hat joker,
// ID card with a "?" stamp, wrench + rust spots, platform scrap scale with dial, fishing hook with a tower as bait, cheque +
// footprints + dust cloud, candlestick telephone, siren light + police whistle, ocean liner, bars + island, browser window,
// art-deco comment bubble.
// Klotz gag: mini top hat + moustache sticker, pulls out a mini wallet (wants to buy the tower himself), hides it when the
// police come, finally looks suspicious (brows only, lids stay open) and sticks a "not for sale" sign (crossed-out euro) on himself.
// All graphics stay in x 80-1000 and in y 720-1350 (under the captions, above Klotz's top hat).
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
const YEL = "#FFD23F", GOLD = "#F2B705", GOLD_D = "#B07A00", GOLD_L = "#FFE58A", RED = "#FF3B3B", RED_D = "#B81E2A";
const CREAM = "#FFF1D6", PAPER = "#FFFDF4", INKC = "#4A4E6A", TEAL = "#3BC9B0", TEAL_D = "#1F8F7C";
const BRZ = "#C8734A", BRZ_D = "#8A4526", BRZ_L = "#E8A070", RUST = "#7A3A14";
const HATC = "#262636", HAT_L = "#4A4A66", MUSC = "#3A2414";
const TWEED = "#A07C50", TWEED_D = "#6E5233", SACKC = "#D2B06E", SACK_D = "#8A6A2A";
const STEEL = "#C9CEDD", STEEL_D = "#7D839C", NAVY2 = "#26305A", BLUE = "#3A7BFF";

// ================= timing: one row per caption; one scene per caption; cuts on whole tenths =================
// a caption with n words needs n x 0.35 s (min 1.1 s) fully readable + the word pop-in + the exit
const CD = [["c01", 2.0], ["c02", 2.0], ["c03", 2.4], ["c04", 2.8], ["c05", 2.8], ["c06", 2.4], ["c07", 2.0], ["c08", 2.4], ["c09", 1.6],
  ["c10", 2.4], ["c11", 2.0], ["c12", 2.2], ["c13", 2.8], ["c14", 2.4], ["c15", 2.4], ["c16", 2.4], ["c17", 2.2], ["c18", 0.6]];
const C = {};
{ let t = 0; for (const [id, d] of CD) { C[id] = [f2(t), f2(t + d)]; t += d; } }
export const DUR = C.c18[1];
const LAST = f2(DUR - 1 / 30); // time of the last frame: all loop cycles end here, so it equals frame 0
const T = {
  hook: C.c01, name: C.c02, karten: C.c03, ausweis: C.c04, turm: C.c05, waage: C.c06, angel: C.c07, scheck: C.c08, kaeufer: C.c09,
  peinlich: C.c10, zurueck: C.c11, nochmal: C.c12, polizei: C.c13, schiff: C.c14, gitter: C.c15, browser: C.c16, frage: [C.c17[0], DUR],
};
const S = (k) => [T[k][0], f2(T[k][1] - T[k][0])];
const scenes = [];

// ================= drawings (own designs) =================
const SPARK = (col = YEL) => `<svg viewBox="0 0 100 100" width="100%" height="100%" overflow="visible"><path d="M50 2 Q56 44 98 50 Q56 56 50 98 Q44 56 2 50 Q44 44 50 2 Z" fill="${col}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/></svg>`;
const inner = (svg) => svg.replace(/<svg[^>]*>|<\/svg>/g, "");

// own tower silhouette (four-legged lattice tower, three platforms, arch), viewBox 300 x 560; rust spots in a group (hidden by default)
const TOWER = (id, rust = false) => `<svg viewBox="0 0 300 560" width="100%" height="100%" overflow="visible">
    <path d="M150 0 V24" stroke="${K}" stroke-width="8" stroke-linecap="round"/>
    <path d="M14 552 L96 352 L112 262 L130 98 L140 34 H160 L170 98 L188 262 L204 352 L286 552 H226 Q150 430 74 552 Z" fill="${BRZ}" stroke="${K}" stroke-width="9" stroke-linejoin="round"/>
    <path d="M44 520 L120 380 M256 520 L180 380 M62 470 L238 470 M112 330 L144 270 M188 330 L156 270 M132 240 L150 110 M168 240 L150 110 M126 190 H174" stroke="${BRZ_D}" stroke-width="7" stroke-linecap="round" fill="none"/>
    <path d="M112 300 L128 120" stroke="${BRZ_L}" stroke-width="7" stroke-linecap="round" opacity=".8"/>
    <rect x="80" y="336" width="140" height="24" rx="5" fill="${BRZ_D}" stroke="${K}" stroke-width="7"/>
    <rect x="102" y="248" width="96" height="18" rx="4" fill="${BRZ_D}" stroke="${K}" stroke-width="7"/>
    <rect x="122" y="88" width="56" height="14" rx="4" fill="${BRZ_D}" stroke="${K}" stroke-width="6"/>
    <rect x="136" y="18" width="28" height="20" rx="6" fill="${GOLD}" stroke="${K}" stroke-width="6"/>
    ${rust ? `<g id="${id}-rust">${[[118, 400, 16], [196, 450, 20], [150, 300, 12], [140, 200, 10], [170, 160, 9], [90, 500, 14], [214, 512, 12]].map(([x, y, r], i) => `<ellipse id="${id}-r${i}" cx="${x}" cy="${y}" rx="${r}" ry="${f2(r * 0.7)}" fill="${RUST}" stroke="${K}" stroke-width="3"/>`).join("")}</g>` : ""}</svg>`;
// red sign (no text: a euro symbol only), viewBox 300 x 220; mark: "eur" | "?" | "no" (crossed-out euro on white)
const SIGN = (mark = "eur") => {
  const eur = (col, w = 26) => `<path d="M196 64 A58 58 0 1 0 196 156" stroke="${col}" stroke-width="${w}" stroke-linecap="round" fill="none"/><path d="M80 98 H166 M80 126 H158" stroke="${col}" stroke-width="${f2(w * 0.7)}" stroke-linecap="round"/>`;
  const base = mark === "no" ? "#fff" : RED;
  const body = mark === "eur" ? eur("#fff") : mark === "no" ? `${eur(K, 22)}<circle cx="150" cy="110" r="84" fill="none" stroke="${RED}" stroke-width="18"/><path d="M92 52 L208 168" stroke="${RED}" stroke-width="18" stroke-linecap="round"/>`
    : `<text x="150" y="172" text-anchor="middle" font-family="Lilita One" font-size="170" fill="#fff">?</text>`;
  return `<svg viewBox="0 0 300 220" width="100%" height="100%" overflow="visible"><rect x="8" y="8" width="284" height="204" rx="24" fill="${base}" stroke="${K}" stroke-width="10"/>
    <rect x="28" y="28" width="244" height="164" rx="14" fill="none" stroke="${mark === "no" ? RED : "#fff"}" stroke-width="6" stroke-dasharray="18 10" opacity=".8"/>${body}
    <circle cx="40" cy="40" r="7" fill="${K}"/><circle cx="260" cy="40" r="7" fill="${K}"/></svg>`;
};
// con man symbol parts: top hat (viewBox 240 x 200), moustache (viewBox 240 x 80), monocle (viewBox 120 x 200)
const HAT = () => `<svg viewBox="0 0 240 200" width="100%" height="100%" overflow="visible">
    <path d="M58 170 L66 22 Q120 6 174 22 L182 170 Z" fill="${HATC}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
    <path d="M61 118 H179 L181 152 H59 Z" fill="${RED}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M86 34 L82 106" stroke="${HAT_L}" stroke-width="11" stroke-linecap="round"/>
    <path d="M8 168 Q120 144 232 168 Q238 190 214 194 Q120 178 26 194 Q2 190 8 168 Z" fill="${HATC}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/></svg>`;
const MUST = () => `<svg viewBox="0 0 240 80" width="100%" height="100%" overflow="visible"><path d="M120 28 Q92 8 62 26 Q34 46 10 26 Q10 62 52 66 Q92 68 120 46 Q148 68 188 66 Q230 62 230 26 Q206 46 178 26 Q148 8 120 28 Z" fill="${MUSC}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><path d="M72 36 Q92 28 108 36" stroke="#6A4A30" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`;
const MONO = () => `<svg viewBox="0 0 120 200" width="100%" height="100%" overflow="visible"><path d="M60 104 Q30 150 70 196" stroke="${GOLD}" stroke-width="6" fill="none" stroke-dasharray="10 6" stroke-linecap="round"/>
    <circle cx="60" cy="60" r="44" fill="#BFE6FF" fill-opacity=".35" stroke="${K}" stroke-width="16"/><circle cx="60" cy="60" r="44" fill="none" stroke="${GOLD}" stroke-width="8"/>
    <path d="M36 44 Q44 30 60 28" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/></svg>`;
// buyer symbol parts: flat cap (viewBox 260 x 140), money sack (viewBox 220 x 240)
const CAP = () => `<svg viewBox="0 0 260 140" width="100%" height="100%" overflow="visible">
    <path d="M20 104 Q14 34 116 22 Q206 18 222 76 L226 96 Q120 120 20 104 Z" fill="${TWEED}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
    <path d="M60 42 Q70 72 64 100 M112 30 V108 M162 32 Q172 62 174 98" stroke="${TWEED_D}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M150 92 Q236 84 252 110 Q204 134 118 112 Z" fill="${TWEED_D}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
    <circle cx="116" cy="24" r="10" fill="${TWEED_D}" stroke="${K}" stroke-width="5"/></svg>`;
const SACK = (id) => `<svg viewBox="0 0 220 240" width="100%" height="100%" overflow="visible">
    <path d="M70 58 Q8 110 18 172 Q28 234 110 234 Q192 234 202 172 Q212 110 150 58 Z" fill="${SACKC}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
    ${id ? `<path id="${id}" d="M70 58 Q8 110 18 172 Q28 234 110 234 Q192 234 202 172 Q212 110 150 58 Z" fill="${RED}" opacity="0"/>` : ""}
    <path d="M78 40 Q58 10 84 6 Q100 22 110 8 Q120 22 136 6 Q162 10 142 40 Z" fill="${SACKC}" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M70 60 Q110 76 150 60 L142 40 Q110 52 78 40 Z" fill="${SACK_D}" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M140 132 A40 40 0 1 0 140 196" stroke="${SACK_D}" stroke-width="15" fill="none" stroke-linecap="round"/><path d="M72 154 H124 M72 176 H118" stroke="${SACK_D}" stroke-width="11" stroke-linecap="round"/>
    <path d="M40 120 Q34 150 40 176" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" opacity=".45"/></svg>`;
// art-deco frame with stepped corners, gold on dark outline, inner hairline and a small fan at the bottom; w x h viewBox
const DECO = (w, h, s = 28) => {
  const pts = [[2 * s, 0], [w - 2 * s, 0], [w - 2 * s, s], [w - s, s], [w - s, 2 * s], [w, 2 * s], [w, h - 2 * s], [w - s, h - 2 * s], [w - s, h - s], [w - 2 * s, h - s], [w - 2 * s, h], [2 * s, h], [2 * s, h - s], [s, h - s], [s, h - 2 * s], [0, h - 2 * s], [0, 2 * s], [s, 2 * s], [s, s], [2 * s, s]];
  const d = "M" + pts.map((p) => p.join(" ")).join(" L") + " Z";
  const fan = Array.from({ length: 7 }, (_, i) => { const a = Math.PI + (i + 0.5) * Math.PI / 7; return `M${w / 2} ${h - 8} L${f2(w / 2 + Math.cos(a) * 70)} ${f2(h - 8 + Math.sin(a) * 70)}`; }).join(" ");
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" overflow="visible">
    <path d="${d}" fill="none" stroke="${K}" stroke-width="24" stroke-linejoin="miter"/><path d="${d}" fill="none" stroke="${GOLD}" stroke-width="12" stroke-linejoin="miter"/>
    <rect x="${s + 14}" y="${s + 14}" width="${w - 2 * s - 28}" height="${h - 2 * s - 28}" fill="none" stroke="${GOLD_L}" stroke-width="4" opacity=".7"/>
    <path d="${fan}" stroke="${GOLD}" stroke-width="6" stroke-linecap="round"/><path d="M${w / 2 - 80} ${h - 8} A80 80 0 0 1 ${w / 2 + 80} ${h - 8}" fill="none" stroke="${GOLD}" stroke-width="7"/>
    ${[[s, s], [w - s, s], [s, h - s], [w - s, h - s]].map(([x, y]) => `<path d="M${x} ${y - 14} L${x + 14} ${y} L${x} ${y + 14} L${x - 14} ${y} Z" fill="${TEAL}" stroke="${K}" stroke-width="5"/>`).join("")}</svg>`;
};
// oval art-deco portrait frame, viewBox 460 x 520
const OVAL = () => `<svg viewBox="0 0 460 520" width="100%" height="100%" overflow="visible">
    <ellipse cx="230" cy="260" rx="218" ry="248" fill="#1A2350" stroke="${K}" stroke-width="22"/><ellipse cx="230" cy="260" rx="218" ry="248" fill="none" stroke="${GOLD}" stroke-width="12"/>
    <ellipse cx="230" cy="260" rx="190" ry="220" fill="none" stroke="${GOLD_L}" stroke-width="4" stroke-dasharray="4 12" stroke-linecap="round"/>
    ${[0, 90, 180, 270].map((a) => { const r = a * Math.PI / 180; const x = f2(230 + Math.cos(r) * 218), y = f2(260 + Math.sin(r) * 248); return `<path d="M${x} ${y - 16} L${x + 16} ${y} L${x} ${y + 16} L${x - 16} ${y} Z" fill="${TEAL}" stroke="${K}" stroke-width="5"/>`; }).join("")}</svg>`;
// label plate with text (>= 72 px)
const plate = (id, l, t, w, h, txt, size = 80, bg = CREAM, col = NAVY2) => `      <div id="${id}" class="plate" style="${abs(l, t, w, h)}background:${bg};"><div id="${id}-t" style="position:absolute;left:0;top:${Math.round((h - 14 - size) / 2) + 4}px;width:100%;${LBL(size, col)}">${txt}</div></div>`;
// playing card, viewBox 220 x 316; suit: h d s c, or "joker" (hat + moustache), or "back"
const SUITS = {
  h: [RED, "M50 88 Q4 54 8 26 Q14 2 38 6 Q48 10 50 22 Q52 10 62 6 Q86 2 92 26 Q96 54 50 88 Z"],
  d: [RED, "M50 2 L90 48 L50 94 L10 48 Z"],
  s: [K, "M50 4 Q96 40 92 62 Q88 84 60 74 Q62 88 72 96 H28 Q38 88 40 74 Q12 84 8 62 Q4 40 50 4 Z"],
  c: [K, "M50 6 A20 20 0 1 1 49.9 6 Z M24 40 A20 20 0 1 1 23.9 40 Z M76 40 A20 20 0 1 1 75.9 40 Z M44 60 H56 L64 96 H36 Z"],
};
const CARD = (suit) => {
  const face = suit === "back"
    ? `<rect x="22" y="22" width="176" height="272" rx="12" fill="${TEAL_D}"/><path d="M22 22 L198 294 M198 22 L22 294 M110 22 V294 M22 158 H198" stroke="${TEAL}" stroke-width="8"/><rect x="22" y="22" width="176" height="272" rx="12" fill="none" stroke="${GOLD}" stroke-width="6"/>`
    : suit === "joker"
      ? `<g transform="translate(40 52) scale(.58)">${inner(HAT())}</g><g transform="translate(46 186) scale(.53)">${inner(MUST())}</g><path d="M30 280 L60 250 L90 280 L120 250 L150 280 L180 250" stroke="${GOLD}" stroke-width="7" fill="none" stroke-linejoin="round"/>`
      : `<g transform="translate(60 108) scale(1)"><path d="${SUITS[suit][1]}" fill="${SUITS[suit][0]}" stroke="${K}" stroke-width="5" stroke-linejoin="round"/></g>
         <g transform="translate(22 22) scale(.34)"><path d="${SUITS[suit][1]}" fill="${SUITS[suit][0]}"/></g><g transform="translate(198 294) rotate(180) scale(.34)"><path d="${SUITS[suit][1]}" fill="${SUITS[suit][0]}"/></g>`;
  return `<svg viewBox="0 0 220 316" width="100%" height="100%" overflow="visible"><rect x="6" y="6" width="208" height="304" rx="22" fill="${PAPER}" stroke="${K}" stroke-width="9"/>${face}</svg>`;
};
// ID card (no text), viewBox 740 x 470: header band with deco chevrons, photo box with the hat symbol, text bars
const IDCARD = () => `<svg viewBox="0 0 740 470" width="100%" height="100%" overflow="visible">
    <rect x="8" y="8" width="724" height="454" rx="30" fill="${CREAM}" stroke="${K}" stroke-width="10"/>
    <path d="M8 96 V38 Q8 8 38 8 H702 Q732 8 732 38 V96 Z" fill="${TEAL_D}" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>
    <path d="M300 74 L340 34 L380 74 L420 34 L460 74" stroke="${GOLD}" stroke-width="9" fill="none" stroke-linejoin="round"/>
    <rect x="44" y="130" width="230" height="290" rx="16" fill="${NAVY2}" stroke="${K}" stroke-width="8"/>
    <g transform="translate(74 168) scale(.71)">${inner(HAT())}</g><g transform="translate(80 320) scale(.71)">${inner(MUST())}</g>
    ${[160, 220, 280, 340].map((y, i) => `<rect x="312" y="${y}" width="${[360, 300, 340, 220][i]}" height="22" rx="11" fill="${INKC}" opacity=".35"/>`).join("")}
    <path d="M312 400 Q340 376 362 400 T412 400 T462 396" stroke="${INKC}" stroke-width="7" fill="none" stroke-linecap="round"/></svg>`;
const STAMPQ = () => `<svg viewBox="0 0 260 260" width="100%" height="100%" overflow="visible"><circle cx="130" cy="130" r="116" fill="none" stroke="${RED}" stroke-width="16"/><circle cx="130" cy="130" r="92" fill="none" stroke="${RED}" stroke-width="6" stroke-dasharray="14 9"/>
    <text x="130" y="186" text-anchor="middle" font-family="Lilita One" font-size="170" fill="${RED}">?</text></svg>`;
const WRENCH = () => `<svg viewBox="0 0 260 80" width="100%" height="100%" overflow="visible"><path d="M70 30 H236 Q252 30 252 40 Q252 50 236 50 H70 Z" fill="${STEEL}" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M74 40 A34 34 0 1 1 30 10 L42 30 L56 26 L64 40 L56 54 L42 50 L30 70 A34 34 0 0 1 74 40 Z" fill="${STEEL}" stroke="${K}" stroke-width="7" stroke-linejoin="round"/><path d="M100 36 H220" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"/></svg>`;
const BOLT = () => `<svg viewBox="0 0 40 40" width="100%" height="100%" overflow="visible"><path d="M20 2 L36 11 V29 L20 38 L4 29 V11 Z" fill="${STEEL_D}" stroke="${K}" stroke-width="5" stroke-linejoin="round"/><circle cx="20" cy="20" r="6" fill="${K}"/></svg>`;
// platform scrap scale, viewBox 760 x 520: deck + column + dial (needle in its own group, pivot 630 130)
const SCALE = (id) => `<svg viewBox="0 0 760 520" width="100%" height="100%" overflow="visible">
    <path d="M604 440 V220 H656 V440 Z" fill="${TEAL_D}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
    <rect x="20" y="430" width="680" height="70" rx="12" fill="${TEAL_D}" stroke="${K}" stroke-width="9"/>
    <rect x="40" y="396" width="540" height="40" rx="8" fill="${STEEL}" stroke="${K}" stroke-width="8"/><path d="M60 410 H560" stroke="#fff" stroke-width="5" opacity=".6"/>
    <circle cx="80" cy="500" r="18" fill="${K}"/><circle cx="640" cy="500" r="18" fill="${K}"/>
    <circle cx="630" cy="130" r="112" fill="${GOLD}" stroke="${K}" stroke-width="9"/><circle cx="630" cy="130" r="92" fill="${PAPER}" stroke="${K}" stroke-width="6"/>
    ${Array.from({ length: 9 }, (_, i) => { const a = (-150 + i * 15) * Math.PI / 180 + Math.PI / 2 * 0; const aa = (-60 + i * 15 - 90) * Math.PI / 180; return `<path d="M${f2(630 + Math.cos(aa) * 70)} ${f2(130 + Math.sin(aa) * 70)} L${f2(630 + Math.cos(aa) * 86)} ${f2(130 + Math.sin(aa) * 86)}" stroke="${i > 6 ? RED : INKC}" stroke-width="7" stroke-linecap="round"/>`; }).join("")}
    <path d="M${f2(630 + Math.cos(-0.524) * 78)} ${f2(130 + Math.sin(-0.524) * 78)} A78 78 0 0 1 ${f2(630 + Math.cos(0) * 78)} ${130}" stroke="${RED}" stroke-width="10" fill="none" opacity=".35"/>
    <g id="${id}"><path d="M624 136 L630 52 L636 136 Z" fill="${RED}" stroke="${K}" stroke-width="4" stroke-linejoin="round"/></g><circle cx="630" cy="130" r="13" fill="${K}"/></svg>`;
// lattice girder (a tower piece), viewBox 360 x 60
const GIRDER = () => `<svg viewBox="0 0 360 60" width="100%" height="100%" overflow="visible"><rect x="6" y="6" width="348" height="48" rx="6" fill="${BRZ}" stroke="${K}" stroke-width="8"/>
    <path d="M14 50 L54 10 L94 50 L134 10 L174 50 L214 10 L254 50 L294 10 L334 50" stroke="${BRZ_D}" stroke-width="7" fill="none" stroke-linejoin="round"/>${[20, 340].map((x) => `<circle cx="${x}" cy="30" r="6" fill="${BRZ_D}"/>`).join("")}</svg>`;
// fishing line + hook, viewBox 80 x 300 (line from the top, hook at the bottom)
const HOOKLINE = () => `<svg viewBox="0 0 80 300" width="100%" height="100%" overflow="visible"><path d="M40 0 V230" stroke="#E9E6F5" stroke-width="5"/>
    <path d="M40 226 V262 Q40 292 62 290 Q80 286 76 262 L68 270" fill="none" stroke="${K}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M40 226 V262 Q40 292 62 290 Q80 286 76 262 L68 270" fill="none" stroke="${STEEL}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="40" cy="200" r="12" fill="${RED}" stroke="${K}" stroke-width="5"/></svg>`;
// cheque (no numbers, no words), viewBox 520 x 240
const CHEQUE = () => `<svg viewBox="0 0 520 240" width="100%" height="100%" overflow="visible"><rect x="8" y="8" width="504" height="224" rx="14" fill="#D9F2E4" stroke="${K}" stroke-width="9"/>
    <rect x="24" y="24" width="472" height="192" rx="8" fill="none" stroke="${TEAL_D}" stroke-width="4" stroke-dasharray="10 8"/>
    <rect x="44" y="52" width="220" height="18" rx="9" fill="${INKC}" opacity=".35"/><rect x="44" y="92" width="300" height="18" rx="9" fill="${INKC}" opacity=".35"/>
    <rect x="370" y="44" width="110" height="70" rx="10" fill="#fff" stroke="${K}" stroke-width="6"/><path d="M450 64 A20 20 0 1 0 450 94" stroke="${TEAL_D}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M406 74 H440 M406 86 H436" stroke="${TEAL_D}" stroke-width="6" stroke-linecap="round"/>
    <path d="M280 186 Q300 140 320 180 Q336 206 352 168 Q366 140 384 180 Q396 196 430 170" stroke="${K}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M270 196 H460" stroke="${INKC}" stroke-width="4"/></svg>`;
const FOOT = (left = false) => `<svg viewBox="0 0 60 40" width="100%" height="100%" overflow="visible"><g transform="${left ? "translate(60 0) scale(-1 1)" : ""}"><ellipse cx="34" cy="20" rx="22" ry="13" fill="#E9E6F5" opacity=".75"/><ellipse cx="8" cy="20" rx="7" ry="9" fill="#E9E6F5" opacity=".75"/></g></svg>`;
const DUST = () => `<svg viewBox="0 0 260 200" width="100%" height="100%" overflow="visible"><g fill="#E9E6F5" stroke="${K}" stroke-width="6"><circle cx="70" cy="130" r="54"/><circle cx="140" cy="90" r="66"/><circle cx="200" cy="138" r="50"/><circle cx="120" cy="150" r="44"/></g><path d="M90 92 Q110 72 136 72" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round"/></svg>`;
// spotlight cone, viewBox 420 x 580
const CONE = () => `<svg viewBox="0 0 420 580" width="100%" height="100%" overflow="visible"><path d="M170 0 H250 L410 520 Q210 600 10 520 Z" fill="${GOLD_L}" opacity=".22"/><ellipse cx="210" cy="520" rx="200" ry="44" fill="${GOLD_L}" opacity=".3"/></svg>`;
// candlestick telephone body (viewBox 200 x 420) and receiver (viewBox 120 x 200)
const PHONE = () => `<svg viewBox="0 0 200 420" width="100%" height="100%" overflow="visible">
    <path d="M30 410 Q30 350 100 344 Q170 350 170 410 Z" fill="${HATC}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
    <rect x="86" y="80" width="28" height="270" rx="10" fill="${HATC}" stroke="${K}" stroke-width="7"/><path d="M95 100 V330" stroke="${HAT_L}" stroke-width="6" stroke-linecap="round"/>
    <path d="M60 40 Q100 20 140 40 L130 90 H70 Z" fill="${HATC}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/><ellipse cx="100" cy="40" rx="40" ry="12" fill="${HAT_L}" stroke="${K}" stroke-width="6"/>
    <path d="M114 160 H160 V196" stroke="${GOLD}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M100 410 Q60 440 20 418" stroke="${HATC}" stroke-width="6" fill="none"/></svg>`;
const RECV = () => `<svg viewBox="0 0 120 200" width="100%" height="100%" overflow="visible"><rect x="44" y="40" width="30" height="140" rx="12" fill="${HATC}" stroke="${K}" stroke-width="7"/>
    <path d="M24 10 Q60 -4 96 10 L84 48 H36 Z" fill="${HATC}" stroke="${K}" stroke-width="7" stroke-linejoin="round"/><path d="M60 180 Q66 198 90 196" stroke="${HAT_L}" stroke-width="6" fill="none"/></svg>`;
const STEAM = () => `<svg viewBox="0 0 100 100" width="100%" height="100%" overflow="visible"><circle cx="50" cy="50" r="40" fill="#fff" opacity=".8" stroke="${K}" stroke-width="5"/></svg>`;
const DROP = () => `<svg viewBox="0 0 40 56" width="100%" height="100%" overflow="visible"><path d="M20 2 Q38 30 34 40 Q28 54 20 54 Q12 54 6 40 Q2 30 20 2 Z" fill="#9FD3FF" stroke="#2A4A7A" stroke-width="4"/></svg>`;
// siren light (viewBox 200 x 200), police whistle (viewBox 300 x 170)
const SIREN = () => `<svg viewBox="0 0 200 200" width="100%" height="100%" overflow="visible"><rect x="20" y="150" width="160" height="40" rx="10" fill="${STEEL_D}" stroke="${K}" stroke-width="8"/>
    <path d="M36 154 V100 Q36 20 100 20 Q164 20 164 100 V154 Z" fill="${BLUE}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/><path d="M62 132 V100 Q62 52 96 46" stroke="#BFD6FF" stroke-width="12" fill="none" stroke-linecap="round"/></svg>`;
const WHISTLE = () => `<svg viewBox="0 0 300 170" width="100%" height="100%" overflow="visible"><path d="M20 70 H170 V40 H200 V70 Q270 70 270 120 Q270 166 210 166 Q150 166 150 120 V108 H20 Z" fill="${STEEL}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
    <rect x="20" y="70" width="40" height="38" fill="${STEEL_D}" stroke="${K}" stroke-width="6"/><circle cx="210" cy="120" r="20" fill="${STEEL_D}" stroke="${K}" stroke-width="5"/><path d="M80 84 H150" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".7"/>
    <path d="M200 40 Q232 10 262 30" stroke="${GOLD}" stroke-width="8" fill="none" stroke-linecap="round"/></svg>`;
// ocean liner with two funnels and a top hat on deck, viewBox 460 x 300
const SHIP = (p) => `<svg viewBox="0 0 460 300" width="100%" height="100%" overflow="visible">
    <rect x="150" y="80" width="54" height="110" rx="6" fill="${RED}" stroke="${K}" stroke-width="7"/><rect x="150" y="80" width="54" height="22" fill="${K}"/>
    <rect x="240" y="70" width="54" height="120" rx="6" fill="${RED}" stroke="${K}" stroke-width="7"/><rect x="240" y="70" width="54" height="22" fill="${K}"/>
    <rect x="90" y="160" width="290" height="50" rx="8" fill="${CREAM}" stroke="${K}" stroke-width="7"/>${[120, 160, 200, 240, 280, 320].map((x) => `<circle cx="${x}" cy="185" r="9" fill="${GOLD_L}" stroke="${K}" stroke-width="4"/>`).join("")}
    <path d="M10 200 H450 L410 290 H60 Z" fill="${HATC}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/><path d="M30 222 H430" stroke="${RED}" stroke-width="10"/>
    <g id="${p}-hat" transform="translate(326 112) scale(.22)">${inner(HAT())}</g></svg>`;
// island with rocks and a lighthouse block, viewBox 720 x 160
const ISLAND = () => `<svg viewBox="0 0 720 160" width="100%" height="100%" overflow="visible"><path d="M0 150 Q60 70 160 80 Q220 40 320 56 Q420 30 520 64 Q640 60 720 150 Z" fill="#5C5A78" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
    <rect x="250" y="20" width="180" height="56" rx="4" fill="${STEEL}" stroke="${K}" stroke-width="7"/>${[275, 315, 355, 395].map((x) => `<rect x="${x}" y="34" width="16" height="24" rx="3" fill="${NAVY2}"/>`).join("")}
    <rect x="470" y="-10" width="30" height="80" fill="${STEEL}" stroke="${K}" stroke-width="7"/><path d="M462 -10 L485 -36 L508 -10 Z" fill="${RED}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/></svg>`;
const BARS = () => `<svg viewBox="0 0 360 330" width="100%" height="100%" overflow="visible"><rect x="6" y="6" width="348" height="318" rx="10" fill="none" stroke="${K}" stroke-width="22"/><rect x="6" y="6" width="348" height="318" rx="10" fill="none" stroke="${STEEL_D}" stroke-width="12"/>
    ${[60, 120, 180, 240, 300].map((x) => `<rect x="${x - 9}" y="10" width="18" height="310" rx="8" fill="${STEEL}" stroke="${K}" stroke-width="6"/>`).join("")}<rect x="10" y="150" width="340" height="22" rx="8" fill="${STEEL_D}" stroke="${K}" stroke-width="6"/></svg>`;
// browser window (generic, no logos or text), viewBox 800 x 520
const BROWSER = (p) => `<svg viewBox="0 0 800 520" width="100%" height="100%" overflow="visible"><defs><clipPath id="${p}-cp"><rect x="14" y="80" width="772" height="426"/></clipPath></defs>
    <rect x="6" y="6" width="788" height="508" rx="24" fill="${PAPER}" stroke="${K}" stroke-width="10"/><path d="M6 80 V30 Q6 6 30 6 H770 Q794 6 794 30 V80 Z" fill="#DCD8EC" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>
    ${[44, 84, 124].map((x, i) => `<circle cx="${x}" cy="43" r="13" fill="${[RED, YEL, TEAL][i]}" stroke="${K}" stroke-width="5"/>`).join("")}<rect x="170" y="24" width="580" height="38" rx="19" fill="#fff" stroke="${K}" stroke-width="5"/>
    <g clip-path="url(#${p}-cp)"><g id="${p}-pg"><rect x="40" y="110" width="250" height="330" rx="14" fill="${NAVY2}" stroke="${K}" stroke-width="6"/><g transform="translate(95 130) scale(.47)">${inner(TOWER(p + "-tw"))}</g>
    ${[120, 170, 220, 270, 320, 370, 420, 470, 520].map((y, i) => `<rect id="${p}-l${i}" x="320" y="${y}" width="${[420, 380, 440, 300, 410, 360, 420, 330, 390][i]}" height="22" rx="11" fill="${INKC}" opacity=".35"/>`).join("")}</g></g></svg>`;
const CURSOR = () => `<svg viewBox="0 0 70 100" width="100%" height="100%" overflow="visible"><path d="M6 4 L6 80 L26 62 L40 94 L54 88 L40 56 L66 56 Z" fill="#fff" stroke="${K}" stroke-width="6" stroke-linejoin="round"/></svg>`;
// art-deco comment bubble (stepped top corners, tail down right towards Klotz), viewBox 740 x 470
const DBUBBLE = () => `<svg viewBox="0 0 740 470" width="100%" height="100%" overflow="visible"><path d="M60 10 H680 V40 H730 V340 Q730 380 690 380 H640 L670 460 L550 380 H50 Q10 380 10 340 V40 H60 Z" fill="${NAVY2}" stroke="${K}" stroke-width="20" stroke-linejoin="round"/>
    <path d="M60 10 H680 V40 H730 V340 Q730 380 690 380 H640 L670 460 L550 380 H50 Q10 380 10 340 V40 H60 Z" fill="none" stroke="${GOLD}" stroke-width="9" stroke-linejoin="round"/>
    <path d="M80 340 L120 300 L160 340 L200 300 L240 340" stroke="${TEAL}" stroke-width="7" fill="none" stroke-linejoin="round"/></svg>`;
// sunburst rays (rotate the inner group), viewBox 700 x 700
const RAYS = (id, col = GOLD_L) => `<svg viewBox="0 0 700 700" width="100%" height="100%" overflow="visible"><g id="${id}">${Array.from({ length: 12 }, (_, i) => { const a = (i * 30) * Math.PI / 180, b = (i * 30 + 13) * Math.PI / 180; return `<path d="M350 350 L${f2(350 + Math.cos(a) * 340)} ${f2(350 + Math.sin(a) * 340)} L${f2(350 + Math.cos(b) * 340)} ${f2(350 + Math.sin(b) * 340)} Z" fill="${col}" opacity=".22"/>`; }).join("")}</g></svg>`;

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
    .plate { border-radius: 18px; border: 7px solid ${K}; ${STK} }
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
  const html = spots.map(([x, y, s], i) => `<div id="${p}-${i}" class="spk" style="left:${x - s / 2}px;top:${y - s / 2}px;width:${s}px;height:${s}px;">${SPARK(i % 2 ? "#fff" : GOLD_L)}</div>`).join("");
  const js = spots.map((_, i) => { const per = f2(0.6 + RS() * 0.4); return `      tl.fromTo("#${p}-${i}", { scale: 0.3, rotation: 0 }, { keyframes: { scale: [0.3, 1, 0.3], rotation: [0, 45, 90] }, duration: ${per}, ease: "sine.inOut", repeat: ${Math.max(0, Math.ceil(d / per) - 1)} }, ${f2(RS() * 0.2)});`; }).join("\n");
  return { html, js };
}
// the con man symbol (hat floating above a moustache, no face): ids p-hat, p-must
const lustig = (p, hx, hy, hw) => {
  const mw = Math.round(hw * 0.9), mh = Math.round(mw / 3), hh = Math.round(hw * 200 / 240);
  return { css: `#${p}-hat{${abs(hx, hy, hw, hh)}transform-origin:50% 100%;} #${p}-must{${abs(hx + Math.round((hw - mw) / 2), hy + hh + Math.round(hw * 0.32), mw, mh)}}`,
    html: `<div id="${p}-hat" class="STKC">${HAT()}</div><div id="${p}-must" class="STKC">${MUST()}</div>`, mustTop: hy + hh + Math.round(hw * 0.32), mustBot: hy + hh + Math.round(hw * 0.32) + mh };
};
// the buyer symbol (cap above a money sack, no face): ids p-cap, p-sack (+ p-sred red overlay)
const buyer = (p, x, y, w) => {
  const ch = Math.round(w * 140 / 260), sw = Math.round(w * 0.85), sh = Math.round(sw * 240 / 220);
  return { css: `#${p}-cap{${abs(x, y, w, ch)}transform-origin:50% 100%;} #${p}-sack{${abs(x + Math.round((w - sw) / 2), y + ch + 12, sw, sh)}transform-origin:50% 100%;}`,
    html: `<div id="${p}-cap" class="STKC">${CAP()}</div><div id="${p}-sack" class="STKC">${SACK(p + "-sred")}</div>`, bottom: y + ch + 12 + sh };
};
const stk = (s, p) => s.replace(/STKC/g, p + "-stk");

// ================= HOOK picture (frame 0 = thumbnail motif): art-deco frame, own tower with the red euro sign, hat + moustache floating =================
const hookCss = (p) => `
   #${p}-glow{${abs(180, 780, 720, 560)}border-radius:50%;background:radial-gradient(circle,rgba(255,229,138,.30) 0%,rgba(255,229,138,0) 66%);}
   #${p}-fr{${abs(150, 760, 780, 580)}}
   #${p}-tw{${abs(214, 796, 270, 504)}transform-origin:50% 100%;}
   #${p}-str{${abs(330, 960, 180, 90)}}
   #${p}-sw{position:absolute;left:0;top:0;width:1080px;height:1920px;transform-origin:420px 980px;}
   #${p}-sg{${abs(292, 1040, 290, 213)}}
   ${lustig(p, 650, 830, 220).css}`;
const hookBody = (p) => stk(`      <div id="${p}-glow"></div>
      <div id="${p}-fr">${DECO(780, 580)}</div>
      <div id="${p}-tw" class="STKC">${TOWER(p + "-t")}</div>
      <div id="${p}-sw"><svg id="${p}-str" viewBox="0 0 180 90" overflow="visible"><path d="M90 20 L20 86 M90 20 L160 86" stroke="${K}" stroke-width="10" fill="none"/><path d="M90 20 L20 86 M90 20 L160 86" stroke="#E9E6F5" stroke-width="4" fill="none"/><circle cx="90" cy="20" r="12" fill="${STEEL}" stroke="${K}" stroke-width="5"/></svg>
      <div id="${p}-sg" class="STKC">${SIGN("eur")}</div></div>
      ${lustig(p, 650, 830, 220).html}`, p);
// idle motion of the hook picture; all moves are whole periods starting from the rest pose
const hookIdle = (p, t0, d) => {
  const n = Math.max(1, Math.round(d / 1.0));
  const per = f2(d / n);
  return `      tl.to("#${p}-sw", { keyframes: { rotation: [0, 4, 0, -4, 0] }, duration: ${per}, ease: "sine.inOut", repeat: ${n - 1} }, ${t0});
      tl.to("#${p}-hat", { keyframes: { y: [0, -16, 0], rotation: [0, -4, 0] }, duration: ${per}, ease: "sine.inOut", repeat: ${n - 1} }, ${t0});
      tl.to("#${p}-must", { keyframes: { y: [0, -8, 0], scaleX: [1, 1.08, 1] }, duration: ${per}, ease: "sine.inOut", repeat: ${n - 1} }, ${t0});
      tl.to("#${p}-glow", { keyframes: { opacity: [1, 0.6, 1] }, duration: ${per}, ease: "sine.inOut", repeat: ${n - 1} }, ${t0});`;
};
const HOOK_TW = [[230, 850, 40], [880, 1260, 40], [600, 1200, 34], [880, 850, 36]];
{
  const p = "hook";
  const [s, d] = S(p);
  const tw = twinkle("hook-t", HOOK_TW, d, 1925);
  scenes.push(scene(p, "Hook: Turm mit rotem Euro-Schild", s, d, hookCss(p), hookBody(p) + "\n      " + tw.html,
    `      // frame 0 already shows the full motif (thumbnail picture)
${hookIdle(p, 0, d)}
${tw.js}`, { kb: false }));
}

// ================= NAME: oval art-deco portrait: hat, monocle, moustache, name plate LUSTIG (c02) =================
{
  const p = "name";
  const [s, d] = S(p);
  const L = lustig(p, 430, 806, 220);
  scenes.push(scene(p, "Portrait-Rahmen mit Namensschild", s, d,
    `#name-ov{${abs(310, 760, 460, 520)}transform-origin:50% 50%;}
     ${L.css}
     #name-mo{${abs(586, 1000, 76, 127)}transform-origin:50% 30%;}
     #name-pl{transform-origin:50% 0%;}
     #name-gl{position:absolute;left:578px;top:990px;width:40px;height:40px;}`,
    stk(`      <div id="name-ov" class="STKC">${OVAL()}</div>
      ${L.html}
      <div id="name-mo">${MONO()}</div>
      <div id="name-gl" class="spk">${SPARK("#fff")}</div>
${plate("name-pl", 370, 1222, 340, 104, "LUSTIG", 80, GOLD, K)}`, p),
    `      tl.fromTo("#name-ov", { scale: 0.92 }, { scale: 1, duration: 0.35, ease: "back.out(2)" }, 0);
      // hat tip: lifts and bows twice
      tl.to("#name-hat", { keyframes: { y: [0, -40, 0], rotation: [0, -12, 0] }, duration: 0.5, ease: "power1.inOut", repeat: 1, repeatDelay: 0.3 }, 0.3);
      tl.to("#name-must", { keyframes: { scaleX: [1, 1.12, 0.96, 1.08, 1], rotation: [0, 3, -3, 2, 0] }, duration: 0.6, ease: "none" }, 0.5);
      tl.fromTo("#name-mo", { rotation: 8 }, { keyframes: { rotation: [8, -6, 4, -2, 0] }, duration: 1.2, ease: "sine.out" }, 0);
      tl.fromTo("#name-gl", { scale: 0, rotation: 0 }, { keyframes: { scale: [0, 1.1, 0], rotation: [0, 90] }, duration: 0.5, ease: "power1.out", immediateRender: true }, 0.9);
      tl.fromTo("#name-pl", { rotation: -6 }, { keyframes: { rotation: [-6, 4, -2, 1, 0] }, duration: 1.0, ease: "sine.out" }, 0.05);`));
}

// ================= KARTEN: playing cards fan out, the middle card turns into the hat joker (c03); the hat tips above =================
{
  const p = "karten";
  const [s, d] = S(p);
  const suits = ["h", "s", "back", "c", "d"], rots = [-36, -18, 0, 18, 36];
  const L = lustig(p, 460, 744, 160);
  scenes.push(scene(p, "Spielkarten faechern auf", s, d,
    `.karten-cd{position:absolute;left:430px;top:984px;width:220px;height:316px;transform-origin:110px 356px;}
     ${L.css}`,
    stk(`${suits.map((su, i) => i === 2 ? "" : `      <div id="karten-c${i}" class="karten-cd STKC">${CARD(su)}</div>`).join("\n")}
      <div id="karten-c2" class="karten-cd STKC"><div id="karten-bk" style="position:absolute;inset:0;">${CARD("back")}</div><div id="karten-jk" style="position:absolute;inset:0;opacity:0;">${CARD("joker")}</div></div>
      <div id="karten-hh">${L.html}</div>`, p),
    `${rots.map((r, i) => `      tl.fromTo("#karten-c${i}", { rotation: ${f2(r * 0.15)} }, { rotation: ${r}, duration: 0.4, ease: "back.out(1.8)" }, ${f2(0.05 + Math.abs(i - 2) * 0.04)});`).join("\n")}
      // the middle card flips: back -> joker (hat + moustache)
      tl.to("#karten-c2", { keyframes: { scaleX: [1, 0, 1] }, duration: 0.36, ease: "none" }, 0.7);
      tl.set("#karten-bk", { opacity: 0 }, 0.88); tl.set("#karten-jk", { opacity: 1 }, 0.88);
      tl.to("#karten-c2", { keyframes: { y: [0, -30, 0] }, duration: 0.4, ease: "power2.out" }, 1.06);
      tl.to("#karten-hat", { keyframes: { y: [0, -24, 0], rotation: [0, -14, 0] }, duration: 0.5, ease: "power1.inOut" }, 1.1);
      tl.to("#karten-must", { keyframes: { scaleX: [1, 1.15, 1] }, duration: 0.4, ease: "sine.inOut", repeat: 1 }, 1.2);
${[0, 1, 3, 4].map((i) => `      tl.to("#karten-c${i}", { keyframes: { y: [0, -10, 0] }, duration: 0.5, ease: "sine.inOut" }, ${f2(1.4 + (i % 3) * 0.1)});`).join("\n")}`));
}

// ================= AUSWEIS: ID card with the hat in the photo box, a red "?" stamp slams on (c04) =================
{
  const p = "ausweis";
  const [s, d] = S(p);
  scenes.push(scene(p, "Ausweis mit Stempel", s, d,
    `#ausweis-id{${abs(170, 790, 740, 470)}transform-origin:50% 50%;}
     #ausweis-st{${abs(640, 1010, 240, 240)}transform-origin:50% 50%;}
     #ausweis-ink{${abs(640, 1010, 240, 240)}}`,
    stk(`      <div id="ausweis-id" class="STKC">${IDCARD()}</div>
      <div id="ausweis-st">${STAMPQ()}</div>`, p),
    `      tl.fromTo("#ausweis-id", { rotation: -5, scale: 0.94 }, { rotation: 0, scale: 1, duration: 0.4, ease: "back.out(2)" }, 0);
      tl.to("#ausweis-id", { keyframes: { rotation: [0, 1.5, -1, 0] }, duration: 0.9, ease: "sine.inOut" }, 0.4);
      // stamp: big and transparent above, then SLAM
      tl.fromTo("#ausweis-st", { opacity: 0, scale: 1.35, rotation: 10 }, { opacity: 1, scale: 1, rotation: -12, duration: 0.2, ease: "power4.in", immediateRender: true }, 0.9);
${shake("#ausweis-kb", 1.1, 10, 0.35)}
      tl.to("#ausweis-st", { keyframes: { scale: [1, 1.08, 1] }, duration: 0.5, ease: "sine.inOut", repeat: 1 }, 1.6);`));
}

// ================= TURM: the tower wobbles, a wrench knocks, rust spots appear, bolts drop (c05) =================
{
  const p = "turm";
  const [s, d] = S(p);
  const bolts = [[440, 1080, 0.6], [600, 1000, 1.1], [500, 1150, 1.6]];
  scenes.push(scene(p, "Turm wackelt", s, d,
    `#turm-tw{${abs(330, 774, 300, 560)}transform-origin:50% 100%;}
     #turm-wr{${abs(690, 950, 240, 74)}transform-origin:100% 50%;}
     .turm-bt{position:absolute;width:36px;height:36px;}`,
    stk(`      <div id="turm-tw" class="STKC">${TOWER("turm-t", true)}</div>
      <div id="turm-wr" class="STKC">${WRENCH()}</div>
${bolts.map(([x, y], i) => `      <div id="turm-b${i}" class="turm-bt" style="left:${x}px;top:${y}px;">${BOLT()}</div>`).join("\n")}`, p),
    `      gsap.set([${[0, 1, 2, 3, 4, 5, 6].map((i) => `"#turm-t-r${i}"`).join(", ")}], { opacity: 0, scale: 0, transformOrigin: "50% 50%" });
      // the wrench knocks three times, the tower wobbles after each knock
${[0.3, 0.9, 1.5].map((t, i) => `      tl.to("#turm-wr", { keyframes: { rotation: [0, 18, -6, 0], x: [0, 20, -20, 0] }, duration: 0.4, ease: "power2.inOut" }, ${t});
      tl.to("#turm-tw", { keyframes: { rotation: [0, -2.5, 2, -1, 0] }, duration: 0.55, ease: "sine.out" }, ${f2(t + 0.15)});`).join("\n")}
${[0, 1, 2, 3, 4, 5, 6].map((i) => `      tl.to("#turm-t-r${i}", { opacity: 1, scale: 1, duration: 0.2, ease: "back.out(2.6)" }, ${f2(0.35 + i * 0.22)});`).join("\n")}
${bolts.map(([, , t], i) => `      tl.fromTo("#turm-b${i}", { y: 0, rotation: 0, opacity: 0 }, { keyframes: { y: [0, 40, 170], rotation: [0, 90, 260], opacity: [0, 1, 1] }, duration: 0.55, ease: "power2.in" }, ${t});
      tl.to("#turm-b${i}", { opacity: 0, duration: 0.08 }, ${f2(t + 0.55)});`).join("\n")}`));
}

// ================= WAAGE: tower pieces drop onto a platform scrap scale, the needle swings into the red (c06) =================
{
  const p = "waage";
  const [s, d] = S(p);
  const g = [[0.15, 1146, -2], [0.45, 1094, 3], [0.75, 1042, -1]];
  scenes.push(scene(p, "Schrottwaage", s, d,
    `#waage-sc{${abs(160, 800, 760, 520)}}
     .waage-gd{position:absolute;left:224px;width:360px;height:60px;}
     #waage-mt{${abs(300, 846, 150, 280)}transform-origin:50% 100%;}`,
    stk(`      <div id="waage-sc" class="STKC">${SCALE("waage-nd")}</div>
${g.map(([, y], i) => `      <div id="waage-g${i}" class="waage-gd STKC" style="top:${y}px;">${GIRDER()}</div>`).join("\n")}
      <div id="waage-mt" class="STKC">${TOWER("waage-t")}</div>`, p),
    `      gsap.set("#waage-nd", { svgOrigin: "630 130", rotation: -60 });
      // two girders lie on the deck at the cut, more pieces drop
      gsap.set("#waage-g0", { rotation: ${g[0][2]} });
${g.slice(1).map(([t, , r], i) => `      tl.fromTo("#waage-g${i + 1}", { y: -160, opacity: 0, rotation: ${r * 5} }, { y: 0, opacity: 1, rotation: ${r}, duration: 0.22, ease: "power2.in", immediateRender: true }, ${t});`).join("\n")}
      tl.fromTo("#waage-mt", { y: -90, opacity: 0, rotation: -20 }, { y: 0, opacity: 1, rotation: -8, duration: 0.25, ease: "power2.in", immediateRender: true }, 1.05);
      tl.to("#waage-mt", { keyframes: { scaleY: [1, 0.9, 1.04, 1] }, duration: 0.3, ease: "none" }, 1.3);
      // needle: jumps with each landing, ends deep in the red
      tl.to("#waage-nd", { keyframes: { rotation: [-60, -20, -30] }, duration: 0.3, ease: "power2.out" }, ${f2(g[1][0] + 0.2)});
      tl.to("#waage-nd", { keyframes: { rotation: [-30, 20, 5] }, duration: 0.3, ease: "power2.out" }, ${f2(g[2][0] + 0.2)});
      tl.to("#waage-nd", { keyframes: { rotation: [5, 72, 54, 64] }, duration: 0.6, ease: "power2.out" }, 1.3);
      tl.to("#waage-nd", { keyframes: { rotation: [64, 68, 64] }, duration: 0.3, ease: "sine.inOut", repeat: 1 }, 1.9);
${shake("#waage-kb", 1.3, 9, 0.35)}`));
}

// ================= ANGEL: a tower dangles on a fishing hook, the buyer (cap + money sack, label KAEUFER) bites (c07) =================
{
  const p = "angel";
  const [s, d] = S(p);
  const B = buyer(p, 610, 812, 250);
  scenes.push(scene(p, "Angelhaken mit Turm, Kaeufer beisst an", s, d,
    `#angel-sw{position:absolute;left:0;top:0;width:1080px;height:1920px;transform-origin:330px 730px;}
     #angel-ln{${abs(290, 740, 80, 300)}}
     #angel-bt{${abs(260, 1024, 140, 261)}transform-origin:50% 0%;}
     ${B.css}
     #angel-bb{position:absolute;left:0;top:0;width:1080px;height:1920px;transform-origin:735px 1250px;}`,
    stk(`      <div id="angel-sw"><div id="angel-ln">${HOOKLINE()}</div><div id="angel-bt" class="STKC">${TOWER("angel-t")}</div></div>
      <div id="angel-bb">${B.html}</div>
${plate("angel-pl", 590, 1236, 290, 100, "KÄUFER", 76)}`, p),
    `      // the bait swings
      tl.fromTo("#angel-sw", { rotation: 5 }, { keyframes: { rotation: [5, -5, 4, -3, 0] }, duration: 1.4, ease: "sine.inOut" }, 0);
      // the buyer leans towards the bait, twice, then bites (sack jumps)
      tl.to("#angel-bb", { keyframes: { rotation: [0, -6, 0, -8, 0], x: [0, -24, 0, -30, 0] }, duration: 0.9, ease: "sine.inOut" }, 0.15);
      tl.to("#angel-sack", { keyframes: { y: [0, -40, 0], scaleY: [1, 1.08, 0.92, 1] }, duration: 0.4, ease: "power2.out" }, 1.05);
      tl.to("#angel-cap", { keyframes: { y: [0, -60, 0], rotation: [0, -10, 0] }, duration: 0.45, ease: "power2.out" }, 1.02);
      tl.to("#angel-sw", { keyframes: { y: [0, -24, 0] }, duration: 0.4, ease: "power2.out" }, 1.1);`));
}

// ================= SCHECK: a cheque flutters into the top hat; hat + moustache run off into a dust cloud, footprints remain (c08) =================
{
  const p = "scheck";
  const [s, d] = S(p);
  const L = lustig(p, 300, 1040, 180);
  const fp = Array.from({ length: 7 }, (_, i) => [330 + i * 82, 1296 - (i % 2) * 18, f2(0.95 + i * 0.07)]);
  scenes.push(scene(p, "Scheck, Fussspuren, Staubwolke", s, d,
    `#scheck-ch{${abs(280, 780, 520, 240)}transform-origin:50% 50%;}
     #scheck-lu{position:absolute;left:0;top:0;width:1080px;height:1920px;transform-origin:390px 1250px;}
     ${L.css}
     .scheck-fp{position:absolute;width:60px;height:40px;}
     #scheck-du{${abs(700, 1060, 260, 200)}transform-origin:50% 80%;}`,
    stk(`      <div id="scheck-ch" class="STKC">${CHEQUE()}</div>
      <div id="scheck-lu">${L.html}</div>
${fp.map(([x, y], i) => `      <div id="scheck-f${i}" class="scheck-fp" style="left:${x}px;top:${y}px;">${FOOT()}</div>`).join("\n")}
      <div id="scheck-du">${DUST()}</div>`, p),
    `      // the cheque flutters, then flies into the hat
      tl.fromTo("#scheck-ch", { rotation: -6 }, { keyframes: { rotation: [-6, 6, -4, 3], y: [0, -14, 6, 0] }, duration: 0.6, ease: "sine.inOut" }, 0);
      tl.to("#scheck-ch", { x: -150, y: 300, scale: 0.15, rotation: 40, opacity: 0, duration: 0.3, ease: "power2.in" }, 0.6);
      tl.to("#scheck-hat", { keyframes: { scaleY: [1, 0.85, 1.1, 1] }, duration: 0.3, ease: "none" }, 0.85);
      // ...and he is gone: dash to the right, vanish in a dust cloud
      tl.to("#scheck-lu", { keyframes: { x: [0, -20, 420], rotation: [0, -6, 8], scale: [1, 1, 0.7] }, duration: 0.45, ease: "power2.in" }, 0.95);
      tl.set("#scheck-lu", { opacity: 0 }, 1.4);
      tl.fromTo("#scheck-du", { scale: 0.3, opacity: 0 }, { keyframes: { scale: [0.3, 1.05, 1], opacity: [1, 1, 1] }, duration: 0.3, ease: "back.out(2)", immediateRender: true }, 1.35);
      tl.to("#scheck-du", { keyframes: { scale: [1, 1.08, 0.9], opacity: [1, 1, 0] }, duration: 0.7, ease: "power1.in" }, 1.6);
${fp.map(([, , t], i) => `      tl.fromTo("#scheck-f${i}", { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.12, ease: "back.out(3)", immediateRender: true }, ${t});`).join("\n")}`));
}

// ================= KAEUFER?: the buyer alone in a spotlight, a big question mark (c09) =================
{
  const p = "kaeufer";
  const [s, d] = S(p);
  const B = buyer(p, 410, 880, 260);
  scenes.push(scene(p, "Kaeufer im Spotlight", s, d,
    `#kaeufer-cn{${abs(330, 760, 420, 580)}}
     ${B.css}
     #kaeufer-q{position:absolute;left:690px;top:850px;width:200px;${LBL(240, YEL)}-webkit-text-stroke:18px ${K};paint-order:stroke fill;transform-origin:50% 90%;}`,
    stk(`      <div id="kaeufer-cn">${CONE()}</div>
      ${B.html}
      <div id="kaeufer-q">?</div>`, p),
    `      tl.fromTo("#kaeufer-cn", { opacity: 0.5 }, { opacity: 1, duration: 0.3, ease: "power1.out" }, 0);
      tl.fromTo("#kaeufer-q", { scale: 0.6, rotation: 14 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(3)" }, 0.1);
      tl.to("#kaeufer-q", { keyframes: { rotation: [0, -10, 8, 0], y: [0, -14, 0, 0] }, duration: 0.8, ease: "sine.inOut" }, 0.5);
      tl.to("#kaeufer-cap", { keyframes: { rotation: [0, -8, 8, 0] }, duration: 1.0, ease: "sine.inOut" }, 0.2);
      tl.to("#kaeufer-sack", { keyframes: { scaleY: [1, 0.95, 1.03, 1] }, duration: 0.5, ease: "sine.inOut", repeat: 1 }, 0.3);`));
}

// ================= PEINLICH: the buyer blushes (red sack, steam, sweat), the candlestick phone receiver goes back down (c10) =================
{
  const p = "peinlich";
  const [s, d] = S(p);
  const B = buyer(p, 590, 812, 250);
  const puffs = [[640, 790, 0.5], [760, 780, 0.75], [700, 790, 1.0], [820, 796, 1.25]];
  scenes.push(scene(p, "Telefon und roter Kaeufer", s, d,
    `#peinlich-ph{${abs(170, 880, 200, 420)}}
     #peinlich-rc{${abs(300, 1000, 110, 183)}transform-origin:50% 90%;}
     ${B.css}
     .peinlich-pf{position:absolute;width:56px;height:56px;}
     .peinlich-dr{position:absolute;width:34px;height:48px;}
     #peinlich-rg{${abs(250, 820, 200, 120)}}`,
    stk(`      <svg id="peinlich-rg" viewBox="0 0 200 120" overflow="visible"><path d="M40 90 Q30 60 50 30 M160 90 Q170 60 150 30 M70 80 Q64 62 76 46 M130 80 Q136 62 124 46" stroke="${YEL}" stroke-width="9" fill="none" stroke-linecap="round"/></svg>
      <div id="peinlich-ph" class="STKC">${PHONE()}</div>
      <div id="peinlich-rc" class="STKC">${RECV()}</div>
      ${B.html}
${puffs.map(([x, y], i) => `      <div id="peinlich-p${i}" class="peinlich-pf" style="left:${x}px;top:${y}px;">${STEAM()}</div>`).join("\n")}
      <div id="peinlich-d0" class="peinlich-dr" style="left:556px;top:1030px;">${DROP()}</div><div id="peinlich-d1" class="peinlich-dr" style="left:866px;top:1060px;">${DROP()}</div>
${plate("peinlich-pl", 570, 1236, 290, 100, "KÄUFER", 76)}`, p),
    `      // the phone rings (vibration rings) and the receiver lifts ... then is put back, slowly: no call to the police
      tl.fromTo("#peinlich-rg", { opacity: 1, scale: 0.8 }, { keyframes: { opacity: [1, 1, 0], scale: [0.8, 1.1, 1.2] }, duration: 0.5, ease: "power1.out" }, 0);
      tl.fromTo("#peinlich-rc", { x: 0, y: 0, rotation: 0 }, { keyframes: { x: [0, 120, 150], y: [0, -60, -70], rotation: [0, -25, -30] }, duration: 0.4, ease: "power2.out" }, 0.25);
      tl.to("#peinlich-rc", { keyframes: { x: [150, 150, 0], y: [-70, -70, 0], rotation: [-30, -30, 0] }, duration: 0.5, ease: "power2.in" }, 1.0);
      tl.to("#peinlich-ph", { keyframes: { y: [0, 6, 0] }, duration: 0.15, ease: "none" }, 1.5);
      // the buyer goes red, steams and sweats
      tl.to("#peinlich-sred", { opacity: 0.7, duration: 0.4, ease: "power1.out" }, 0.5);
      tl.to("#peinlich-cap", { keyframes: { y: [0, -10, 0], rotation: [0, 4, 0] }, duration: 0.3, ease: "sine.inOut", repeat: 3 }, 0.6);
${puffs.map(([, , t], i) => `      tl.fromTo("#peinlich-p${i}", { y: 0, scale: 0.3, opacity: 0 }, { keyframes: { y: [0, -10, -24], scale: [0.3, 1, 1.2], opacity: [1, 1, 0] }, duration: 0.6, ease: "power1.out", immediateRender: true }, ${t});`).join("\n")}
${[0, 1].map((i) => `      tl.fromTo("#peinlich-d${i}", { y: 0, opacity: 0 }, { keyframes: { y: [0, 20, 90], opacity: [1, 1, 0] }, duration: 0.6, ease: "power1.in", immediateRender: true }, ${f2(0.9 + i * 0.35)});`).join("\n")}`));
}

// ================= ZURUECK: footprints turn round, hat + moustache slide back in, the tower waits (c11) =================
{
  const p = "zurueck";
  const [s, d] = S(p);
  const L = lustig(p, 540, 870, 200);
  const fp = Array.from({ length: 7 }, (_, i) => [900 - i * 82, 1296 - (i % 2) * 18, f2(0.05 + i * 0.1)]);
  scenes.push(scene(p, "Fussspuren kehren um", s, d,
    `#zurueck-tw{${abs(150, 960, 160, 299)}transform-origin:50% 100%;}
     #zurueck-lu{position:absolute;left:0;top:0;width:1080px;height:1920px;transform-origin:640px 1150px;}
     ${L.css}
     .zurueck-fp{position:absolute;width:60px;height:40px;}`,
    stk(`      <div id="zurueck-tw" class="STKC">${TOWER("zurueck-t")}</div>
      <div id="zurueck-lu">${L.html}</div>
${fp.map(([x, y], i) => `      <div id="zurueck-f${i}" class="zurueck-fp" style="left:${x}px;top:${y}px;">${FOOT(true)}</div>`).join("\n")}`, p),
    `${fp.map(([, , t], i) => `      tl.fromTo("#zurueck-f${i}", { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.12, ease: "back.out(3)", immediateRender: true }, ${t});`).join("\n")}
      // he sneaks back from the right (hops), a sly moustache twitch at the end
      tl.fromTo("#zurueck-lu", { x: 190 }, { x: 0, duration: 0.9, ease: "power2.out" }, 0);
      tl.to("#zurueck-lu", { keyframes: { y: [0, -24, 0, -24, 0, -12, 0] }, duration: 0.9, ease: "none" }, 0);
      tl.to("#zurueck-must", { keyframes: { scaleX: [1, 1.15, 0.95, 1.1, 1], rotation: [0, 4, -4, 3, 0] }, duration: 0.6, ease: "none" }, 1.1);
      tl.to("#zurueck-hat", { keyframes: { rotation: [0, -10, 0] }, duration: 0.5, ease: "sine.inOut" }, 1.2);
      tl.to("#zurueck-tw", { keyframes: { scaleY: [1, 1.04, 1] }, duration: 0.5, ease: "sine.inOut", repeat: 1 }, 0.9);`));
}

// ================= NOCHMAL: the tower gets a second red euro sign, rays, sparks (c12, punchline) =================
{
  const p = "nochmal";
  const [s, d] = S(p);
  const b = burst("nochmal-b", 8, 700, 1010, 44, 150, 1925, [YEL, "#fff", GOLD_L]);
  scenes.push(scene(p, "Zweites Euro-Schild", s, d,
    `#nochmal-ry{${abs(260, 780, 560, 560)}}
     #nochmal-tw{${abs(400, 826, 260, 485)}transform-origin:50% 100%;}
     #nochmal-s1{${abs(236, 1090, 250, 183)}transform-origin:50% 0%;}
     #nochmal-s2{${abs(570, 912, 260, 191)}transform-origin:50% 50%;}`,
    stk(`      <div id="nochmal-ry">${RAYS("nochmal-rg")}</div>
      <div id="nochmal-tw" class="STKC">${TOWER("nochmal-t")}</div>
      <div id="nochmal-s1" class="STKC">${SIGN("eur")}</div>
      <div id="nochmal-s2" class="STKC">${SIGN("eur")}</div>
      ${b.html}`, p),
    `      gsap.set("#nochmal-rg", { svgOrigin: "350 350" });
      gsap.set("#nochmal-s1", { rotation: -8 });
      tl.fromTo("#nochmal-rg", { rotation: 0 }, { rotation: 40, duration: ${d}, ease: "none" }, 0);
      tl.fromTo("#nochmal-s2", { opacity: 0, scale: 1.35, rotation: 20 }, { opacity: 1, scale: 1, rotation: 8, duration: 0.2, ease: "power4.in", immediateRender: true }, 0.1);
${shake("#nochmal-kb", 0.3, 12, 0.4)}
${b.js(0.3)}
      tl.to("#nochmal-s1", { keyframes: { rotation: [-8, 6, -5, 3, -8] }, duration: 1.0, ease: "sine.inOut" }, 0.3);
      tl.to("#nochmal-s2", { keyframes: { scale: [1, 1.08, 1] }, duration: 0.5, ease: "sine.inOut", repeat: 2 }, 0.7);
      tl.to("#nochmal-tw", { keyframes: { scaleY: [1, 0.96, 1.03, 1] }, duration: 0.4, ease: "none" }, 0.3);`));
}

// ================= POLIZEI: siren light with a pulsing glow, police whistle with sound lines, the buyer marches (c13) =================
{
  const p = "polizei";
  const [s, d] = S(p);
  const B = buyer(p, 660, 1010, 220);
  scenes.push(scene(p, "Sirene, Pfeife, Kaeufer", s, d,
    `#polizei-gl{${abs(400, 760, 280, 280)}border-radius:50%;background:radial-gradient(circle,rgba(90,150,255,.55) 0%,rgba(90,150,255,0) 68%);}
     #polizei-sr{${abs(450, 800, 180, 180)}}
     #polizei-bm{${abs(380, 740, 320, 320)}}
     #polizei-wh{${abs(150, 1110, 300, 170)}transform-origin:20% 50%;}
     #polizei-ln{${abs(170, 1010, 200, 100)}}
     #polizei-bb{position:absolute;left:0;top:0;width:1080px;height:1920px;transform-origin:770px 1330px;}
     ${B.css}`,
    stk(`      <div id="polizei-gl"></div>
      <svg id="polizei-bm" viewBox="0 0 320 320" overflow="visible"><g id="polizei-bg"><path d="M160 160 L310 110 L310 210 Z M160 160 L10 110 L10 210 Z" fill="#9CC2FF" opacity=".35"/></g></svg>
      <div id="polizei-sr" class="STKC">${SIREN()}</div>
      <svg id="polizei-ln" viewBox="0 0 200 100" overflow="visible"><path d="M30 80 Q20 50 40 20 M90 84 V16 M150 80 Q160 50 140 20" stroke="${YEL}" stroke-width="9" fill="none" stroke-linecap="round"/></svg>
      <div id="polizei-wh" class="STKC">${WHISTLE()}</div>
      <div id="polizei-bb">${B.html}</div>`, p),
    `      gsap.set("#polizei-bg", { svgOrigin: "160 160" }); gsap.set("#polizei-ln", { opacity: 0, scale: 0.6 });
      tl.fromTo("#polizei-bg", { rotation: 0 }, { rotation: 360, duration: 1.4, ease: "none", repeat: 1 }, 0);
      tl.fromTo("#polizei-gl", { scale: 0.85, opacity: 1 }, { keyframes: { scale: [0.85, 1.08, 0.85], opacity: [1, 0.5, 1] }, duration: 0.7, ease: "sine.inOut", repeat: 3 }, 0);
      tl.to("#polizei-sr", { keyframes: { y: [0, -8, 0] }, duration: 0.35, ease: "sine.inOut", repeat: 7 }, 0);
      // whistle blows twice
${[0.3, 1.3].map((t) => `      tl.to("#polizei-wh", { keyframes: { scale: [1, 1.1, 0.96, 1.06, 1], rotation: [0, -4, 3, -2, 0] }, duration: 0.6, ease: "none" }, ${t});
      tl.to("#polizei-ln", { keyframes: { opacity: [0, 1, 1, 0], scale: [0.6, 0.6, 1.05, 1.15] }, duration: 0.6, ease: "power1.out" }, ${t});`).join("\n")}
      // the buyer marches on the spot (determined)
      tl.to("#polizei-bb", { keyframes: { y: [0, -18, 0], rotation: [0, -4, 0] }, duration: 0.35, ease: "power1.inOut", repeat: 6 }, 0.1);`));
}

// ================= SCHIFF: an ocean liner sails off to the right, smoke puffs, waves (c14) =================
{
  const p = "schiff";
  const [s, d] = S(p);
  const puffs = [[0.2, 0], [0.55, 1], [0.9, 0], [1.25, 1], [1.6, 0]];
  scenes.push(scene(p, "Ozeandampfer", s, d,
    `#schiff-sea{${abs(100, 1170, 880, 170)}}
     #schiff-mv{position:absolute;left:0;top:0;width:1080px;height:1920px;}
     #schiff-sh{${abs(150, 900, 460, 300)}transform-origin:50% 100%;}
     .schiff-pf{position:absolute;width:70px;height:70px;}`,
    stk(`      <div id="schiff-mv">
        <div id="schiff-sh" class="STKC">${SHIP("schiff")}</div>
${puffs.map(([, k], i) => `        <div id="schiff-p${i}" class="schiff-pf" style="left:${[292, 382][k] - 35}px;top:${930}px;">${STEAM()}</div>`).join("\n")}
      </div>
      <svg id="schiff-sea" viewBox="0 0 880 170" overflow="visible"><defs><clipPath id="schiff-cp"><rect x="0" y="0" width="880" height="170" rx="26"/></clipPath></defs>
        <rect x="0" y="0" width="880" height="170" rx="26" fill="#2F6BD0" stroke="${K}" stroke-width="8"/>
        <g clip-path="url(#schiff-cp)"><g id="schiff-wv">${[34, 86, 134].map((y, k) => { let dd = `M-200 ${y}`; for (let x = -200; x < 1080; x += 80) dd += ` q20 -16 40 0 t40 0`; return `<path d="${dd}" fill="none" stroke="${k % 2 ? "#9FC3FF" : "#fff"}" stroke-width="7" stroke-linecap="round" opacity=".7"/>`; }).join("")}</g></g></svg>`, p),
    `      tl.fromTo("#schiff-mv", { x: 0 }, { x: 330, duration: ${f2(d - 0.1)}, ease: "power1.in" }, 0);
      tl.to("#schiff-sh", { keyframes: { rotation: [0, -2, 0, 2, 0], y: [0, -8, 0, -8, 0] }, duration: 1.1, ease: "sine.inOut", repeat: 1 }, 0);
      tl.fromTo("#schiff-wv", { x: 0 }, { x: -80, duration: ${f2(d / 2)}, ease: "none", repeat: 1 }, 0);
${puffs.map(([t], i) => `      tl.fromTo("#schiff-p${i}", { y: 0, x: 0, scale: 0.3, opacity: 0 }, { keyframes: { y: [0, -70, -150], x: [0, -30, -60], scale: [0.3, 1, 1.3], opacity: [1, 1, 0] }, duration: 0.7, ease: "power1.out", immediateRender: true }, ${t});`).join("\n")}`));
}

// ================= GITTER: bars slam down in front of hat + moustache, island with label ALCATRAZ (c15) =================
{
  const p = "gitter";
  const [s, d] = S(p);
  const L = lustig(p, 440, 800, 200);
  scenes.push(scene(p, "Gitter und Insel", s, d,
    `${L.css}
     #gitter-br{${abs(360, 770, 360, 330)}}
     #gitter-is{${abs(180, 1130, 720, 160)}}`,
    stk(`      ${L.html}
      <div id="gitter-br" class="STKC">${BARS()}</div>
      <div id="gitter-is" class="STKC">${ISLAND()}</div>
${plate("gitter-pl", 330, 1236, 420, 100, "ALCATRAZ", 80)}`, p),
    `      tl.fromTo("#gitter-br", { y: -40, opacity: 0.6 }, { y: 0, opacity: 1, duration: 0.25, ease: "power3.in" }, 0.15);
${shake("#gitter-kb", 0.4, 8, 0.3)}
      tl.to("#gitter-hat", { keyframes: { y: [0, -16, 0], rotation: [0, 6, 0] }, duration: 0.4, ease: "power2.out" }, 0.42);
      tl.to("#gitter-must", { keyframes: { scaleX: [1, 0.85, 0.9], y: [0, 6, 6] }, duration: 0.5, ease: "sine.out" }, 0.6);
      tl.to("#gitter-must", { keyframes: { rotation: [0, -3, 3, 0] }, duration: 0.8, ease: "sine.inOut" }, 1.1);
      tl.fromTo("#gitter-pl", { rotation: -5 }, { keyframes: { rotation: [-5, 3, -2, 0] }, duration: 0.9, ease: "sine.out" }, 0.1);`));
}

// ================= BROWSER: a generic browser window with a tower picture; the cursor clicks, the page scrolls, a line lights up (c16) =================
{
  const p = "browser";
  const [s, d] = S(p);
  scenes.push(scene(p, "Browser-Fenster", s, d,
    `#browser-wn{${abs(140, 790, 800, 520)}transform-origin:50% 50%;}
     #browser-cu{${abs(640, 1080, 70, 100)}}`,
    stk(`      <div id="browser-wn" class="STKC">${BROWSER("browser")}</div>
      <div id="browser-cu" class="STKC">${CURSOR()}</div>`, p),
    `      tl.fromTo("#browser-wn", { scale: 0.94, y: 20 }, { scale: 1, y: 0, duration: 0.35, ease: "back.out(2)" }, 0);
      tl.fromTo("#browser-cu", { x: 120, y: 100 }, { x: 0, y: 0, duration: 0.5, ease: "power2.out" }, 0.1);
      tl.to("#browser-cu", { keyframes: { scale: [1, 0.8, 1] }, duration: 0.2, ease: "none" }, 0.65);
      tl.to("#browser-pg", { y: -60, duration: 0.6, ease: "power2.inOut" }, 0.8);
      tl.to(["#browser-l2", "#browser-l3"], { fill: "${YEL}", opacity: 0.9, duration: 0.25, ease: "power1.out", stagger: 0.12 }, 1.4);
      tl.to("#browser-cu", { keyframes: { x: [0, -60, -60], y: [0, -40, -40] }, duration: 0.5, ease: "power2.inOut" }, 1.3);`));
}

// ================= FRAGE + loop: art-deco comment bubble with a tower and a red "?" sign, then the hook picture again (c17 + c18) =================
{
  const p = "frage";
  const [s, d] = S(p);
  const LOOP = f2(C.c18[0] - s);
  const tw = twinkle("frage-t", HOOK_TW, d, 1925);
  const hookIds = ["#frage-glow", "#frage-fr", "#frage-tw", "#frage-sw", "#frage-hat", "#frage-must"];
  scenes.push(scene(p, "Frage und Loop", s, d, hookCss(p) + `
     #frage-bb{${abs(170, 790, 740, 470)}transform-origin:80% 100%;}
     #frage-mt{${abs(290, 850, 130, 243)}transform-origin:50% 100%;}
     #frage-qs{${abs(480, 880, 290, 213)}transform-origin:50% 0%;}`,
    hookBody(p) + "\n      " + tw.html + `
      <div id="frage-bb" class="frage-stk">${DBUBBLE()}</div>
      <div id="frage-mt">${TOWER("frage-mtw")}</div>
      <div id="frage-qs">${SIGN("?")}</div>`,
    `      gsap.set([${hookIds.map((x) => `"${x}"`).join(", ")}], { opacity: 0 });
      tl.fromTo("#frage-bb", { scale: 0.85, rotation: -3 }, { scale: 1, rotation: 0, duration: 0.35, ease: "back.out(2)" }, 0);
      tl.fromTo("#frage-mt", { scale: 0.6 }, { scale: 1, duration: 0.3, ease: "back.out(2.6)" }, 0.1);
      tl.fromTo("#frage-qs", { scale: 0.5, rotation: 20 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2.6)" }, 0.2);
      tl.to("#frage-qs", { keyframes: { rotation: [0, -8, 6, -4, 0] }, duration: 0.9, ease: "sine.inOut", repeat: 1 }, 0.5);
      tl.to("#frage-mt", { keyframes: { scaleY: [1, 1.05, 1] }, duration: 0.5, ease: "sine.inOut", repeat: 2 }, 0.6);
      // loop (${LOOP}): hard switch in one frame - bubble gone, hook picture in its frame-0 pose (incl. sparkles at their start scale)
      gsap.set([${[0, 1, 2, 3].map((i) => `"#frage-t-${i}"`).join(", ")}], { scale: 0.3, rotation: 0, opacity: 0 });
      tl.set(["#frage-bb", "#frage-mt", "#frage-qs"], { opacity: 0 }, ${LOOP});
      tl.set([${hookIds.map((x) => `"${x}"`).join(", ")}, ${[0, 1, 2, 3].map((i) => `"#frage-t-${i}"`).join(", ")}], { opacity: 1 }, ${LOOP});
      // the last frame is frame 0 again`,
    { exit: false, kb: false }));
}

// ================= background: night blue, art-deco fan on the floor, gold diamonds drifting (all loop-seamless) =================
{
  const RS = mulberry32(1925);
  const cols = [GOLD, GOLD_L, TEAL, "#fff"];
  const sq = (n, minS, maxS, op) => Array.from({ length: n }, () => ({ x: Math.round(40 + RS() * 1000), y: Math.round(RS() * 1920), s: Math.round(minS + RS() * (maxS - minS)), c: cols[Math.floor(RS() * cols.length)], o: +(op * (0.6 + RS() * 0.4)).toFixed(2) }));
  const far = sq(22, 10, 16, 0.28), near = sq(12, 16, 24, 0.36);
  const tile = (fl, k) => fl.map((f) => { const y = f.y + k * 1920, h = f.s / 2; return `<path d="M${f.x} ${y - h} L${f.x + h * 0.6} ${y} L${f.x} ${y + h} L${f.x - h * 0.6} ${y} Z" fill="${f.c}" opacity="${f.o}"/>`; }).join("");
  const stars = Array.from({ length: 26 }, () => `<circle cx="${Math.round(RS() * 1080)}" cy="${Math.round(40 + RS() * 1300)}" r="${(1.5 + RS() * 2).toFixed(1)}" fill="#fff" opacity="${(0.25 + RS() * 0.4).toFixed(2)}"/>`).join("");
  const fan = Array.from({ length: 13 }, (_, i) => { const a = Math.PI + (i + 0.5) * Math.PI / 13; return `<path d="M540 420 L${f2(540 + Math.cos(a) * 900)} ${f2(420 + Math.sin(a) * 900)}" stroke="#1F2A5C" stroke-width="18"/>`; }).join("");
  fs.writeFileSync(path.join(OUT, "compositions", "bg.html"), `<template>
  <style>
    #root { position: absolute; inset: 0; overflow: hidden; background: #0E1530; }
    #bg-sky { position: absolute; inset: 0; background: linear-gradient(180deg, #0B1230 0%, #0E1530 45%, #1A2150 78%, #22285C 100%); }
    #bg-stars { position: absolute; left: 0; top: 0; }
    #bg-glow { position: absolute; left: 140px; top: 640px; width: 800px; height: 800px; border-radius: 50%; background: radial-gradient(circle, rgba(242,183,5,.09) 0%, rgba(242,183,5,0) 65%); }
    #bg-floor { position: absolute; left: 0; top: 1500px; }
    .bg-px { position: absolute; left: 0; top: 0; }
  </style>
  <div id="root" data-composition-id="bg" data-width="1080" data-height="1920" data-layout-allow-overflow>
    <div id="bg-sky"></div>
    <svg id="bg-stars" width="1080" height="1400">${stars}</svg>
    <div id="bg-glow"></div>
    <svg id="bg-floor" width="1080" height="420" viewBox="0 0 1080 420"><rect x="0" y="40" width="1080" height="380" fill="#161E45"/>${fan}<path d="M0 40 H1080" stroke="#2B3770" stroke-width="8"/><path d="M0 58 H1080" stroke="#2B3770" stroke-width="3"/></svg>
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
// "*" keyword (yellow Lilita, 140 px), "#" the same with tighter letters, "%" tightest, "!" punchline (largest, 200 px). "/" line break.
// "+" glues a word to the one before (no gap): counted as one word.
// Fixed word gap: every word has 11 px margins.
const HOOKW = ["*1925.", "Er", "verkauft", "/", "den", "%EIFFELTURM."];
const caps = [
  { id: "c01", words: HOOKW, still: true },
  { id: "c02", words: ["Er", "heißt", "/", "Victor", "Lustig."] },
  { id: "c03", words: ["Ein", "*BETRÜGER.", "/", "Ein", "sehr", "guter."] },
  { id: "c04", words: ["Er", "gibt", "sich", "/", "als", "Beamter", "aus."] },
  { id: "c05", words: ["Seine", "Story:", "/", "Turm", "muss", "weg!"] },
  { id: "c06", words: ["Zu", "teuer.", "/", "Verkauf", "/", "als", "*SCHROTT."], shake: true },
  { id: "c07", words: ["Ein", "Schrotthändler", "/", "beißt", "an."] },
  { id: "c08", words: ["Er", "zahlt.", "/", "Lustig", "ist", "*WEG."] },
  { id: "c09", words: ["Und", "der", "Käufer?"] },
  { id: "c10", words: ["Zu", "peinlich", "für", "/", "die", "*POLIZEI."] },
  { id: "c11", words: ["Also", "kommt", "/", "Lustig", "zurück …"] },
  { id: "c12", words: ["!NOCHMAL", "/", "verkauft", "er", "ihn!"], shake: true },
  { id: "c13", words: ["Diesmal", "geht", "/", "der", "Käufer", "/", "zur", "Polizei."] },
  { id: "c14", words: ["Lustig", "flieht", "/", "in", "die", "*USA."] },
  { id: "c15", words: ["Später", "landet", "er", "/", "hinter", "Gittern."] },
  { id: "c16", words: ["Sogar", "die", "/", "Eiffelturm-Seite", "/", "erzählt", "das."] },
  { id: "c17", words: ["Hättest", "du", "/", "den", "Turm", "gekauft?"], hard: true },
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
    .kwn { letter-spacing: -0.04em; } .kwx { letter-spacing: -0.09em; }
    .pt { font-family: 'Lilita One'; font-weight: 400; color: ${YEL}; font-size: 190px; line-height: 0.95; letter-spacing: 0; -webkit-text-stroke: 24px ${K}; text-shadow: 0 14px 0 #050814; }
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

// ================= Klotz (rig from Folge 1-8; new gag: mini top hat + moustache sticker, a mini wallet, a "not for sale" sign) =================
// eyes always open: no mood closes the lids; "suspicious" works with the brows only. The right arm never points outward to the right.
// While he holds the wallet (WAL_ON .. WAL_OFF) the left arm stays at 70 deg (the hand next to the wallet).
const M = {
  shock:      { eye: 1.12, ps: 0.6, px: 0, py: 0, bL: -18, bR: -18, tL: -6, tR: -6, mx: 1, my: 1.1, g: 0, aL: 70, aR: -45 },
  surprised:  { eye: 1.08, ps: 0.8, px: 0, py: 6, bL: -16, bR: -16, tL: 0, tR: 0, mx: 0.55, my: 0.6, g: 0, aL: 55, aR: -45 },
  curious:    { eye: 1.05, ps: 1.1, px: -14, py: -10, bL: -18, bR: -4, tL: 0, tR: 0, mx: 0.5, my: 0.35, g: 0, aL: 40, aR: -40 },
  look:       { eye: 1.06, ps: 1.0, px: -14, py: -12, bL: -14, bR: -14, tL: -4, tR: -4, mx: 0.5, my: 0.5, g: 0, aL: 40, aR: -40 },
  impressed:  { eye: 1.05, ps: 0.9, px: -6, py: -4, bL: -12, bR: -12, tL: -4, tR: -4, mx: 0.45, my: 0.45, g: 0, aL: 40, aR: -40 },
  jawdrop:    { eye: 1.18, ps: 0.55, px: -6, py: -8, bL: -22, bR: -22, tL: -4, tR: -4, mx: 1.1, my: 1.7, jy: 14, g: 0, aL: 60, aR: -45 },
  happy:      { eye: 1.04, ps: 1, px: 0, py: 0, bL: -10, bR: -10, tL: -4, tR: -4, mx: 0, my: 0, g: 1, gs: 0.8, aL: 35, aR: -35 },
  eager:      { eye: 1.08, ps: 1.05, px: -10, py: -6, bL: -16, bR: -16, tL: -4, tR: -4, mx: 0, my: 0, g: 1, gs: 0.75, aL: 70, aR: -40 },
  suspicious: { eye: 1.04, ps: 0.85, px: -16, py: 2, bL: 2, bR: 2, tL: 16, tR: 16, mx: 0.4, my: 0.2, g: 0, aL: 40, aR: -35 },
};
const LOOPK = C.c18[0];
const WAL_ON = f2(C.c07[0] + 0.4), WAL_OFF = f2(C.c13[0] + 0.4), SIGN_T = f2(C.c17[0] + 0.6);
const moods = [
  [C.c02[0], "curious"], [C.c03[0], "impressed"], [C.c04[0], "look"], [C.c05[0], "surprised"], [C.c06[0] + 0.4, "jawdrop"],
  [WAL_ON, "eager"], [C.c08[0], "look"], [C.c08[0] + 1.0, "shock"], [C.c09[0], "curious"], [C.c10[0], "surprised"],
  [C.c11[0], "look"], [C.c12[0] + 0.1, "jawdrop"], [C.c12[0] + 1.0, "eager"], [C.c13[0], "shock"], [C.c13[0] + 1.2, "look"],
  [C.c14[0], "look"], [C.c15[0], "surprised"], [C.c16[0], "impressed"], [C.c17[0], "suspicious"], [f2(SIGN_T + 0.5), "happy"], [LOOPK + 0.08, "shock"],
];
const holding = (t) => t >= WAL_ON - 0.2 && t < WAL_OFF;

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
  <g id="k-must"><path d="M150 198 Q138 188 124 194 Q114 200 106 194 Q108 210 124 210 Q140 210 150 204 Q160 210 176 210 Q192 210 194 194 Q186 200 176 194 Q162 188 150 198 Z" fill="${MUSC}" stroke="${K}" stroke-width="4" stroke-linejoin="round"/></g>
  <g id="k-sweat"><path d="M262 92 Q276 112 270 124 Q262 132 254 124 Q248 112 262 92 Z" fill="#9FD3FF" stroke="#2A4A7A" stroke-width="4"/></g>
  <g id="k-hat" class="k-prop">
    <path d="M104 50 L110 -36 Q150 -46 190 -36 L196 50 Z" fill="${HATC}" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M107 18 H193 L195 40 H105 Z" fill="${RED}" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M124 -28 L121 10" stroke="${HAT_L}" stroke-width="8" stroke-linecap="round"/>
    <path d="M70 50 Q150 34 230 50 Q234 64 216 66 Q150 56 84 66 Q66 64 70 50 Z" fill="${HATC}" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>
  </g>
</svg>`;
let kJs = "";
const setMood = (m, t, dur) => {
  const p = { ...M[m] };
  if (holding(t)) p.aL = 70;
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
      gsap.set("#k-mouth", { svgOrigin: "150 228" }); gsap.set("#k-grin", { svgOrigin: "150 230" }); gsap.set("#k-must", { svgOrigin: "150 200" });
      gsap.set("#k-hat", { svgOrigin: "150 56" });
      gsap.set(["#k-chkL", "#k-chkR"], { svgOrigin: "150 198" });
      gsap.set("#k-sweat", { svgOrigin: "262 92", opacity: 0, scale: 0 });
      gsap.set("#k-wal", { opacity: 0, scale: 0, x: 0, y: 0, rotation: 0, transformOrigin: "80% 80%" });
      gsap.set("#k-sign", { opacity: 0, scale: 1, x: 0, y: 0, rotation: 12, transformOrigin: "50% 50%" });
      gsap.set(["#k-eyeL", "#k-eyeR"], { scale: ${p0.eye} });
      gsap.set(["#k-pupL", "#k-pupR"], { x: 0, y: 0, scale: ${p0.ps} });
      gsap.set(["#k-lidL", "#k-lidR"], { scaleY: 0 });
      gsap.set("#k-browL", { y: ${p0.bL}, rotation: ${p0.tL} }); gsap.set("#k-browR", { y: ${p0.bR}, rotation: ${-p0.tR} });
      gsap.set("#k-mouth", { scaleX: ${p0.mx}, scaleY: ${p0.my}, y: 0, opacity: 1 }); gsap.set("#k-grin", { scale: 0.2, opacity: 0 });
      gsap.set("#k-armL", { rotation: ${p0.aL} }); gsap.set("#k-armR", { rotation: ${p0.aR} });
      gsap.set("#k-wrap", { x: 0, y: 0, rotation: 0, scale: 1 }); gsap.set("#k-sq", { scaleX: 1, scaleY: 1 });
      // idle bob: whole half-cycles over the film, ends where it starts
      tl.fromTo("#k-bob", { y: 0 }, { y: -12, duration: ${(LAST / 80).toFixed(5)}, ease: "sine.inOut", yoyo: true, repeat: 79 }, 0);
      // top hat wobbles a little (whole cycles)
      tl.fromTo("#k-hat", { rotation: 0 }, { keyframes: { rotation: [0, 3, 0, -3, 0] }, duration: ${(LAST / 20).toFixed(5)}, ease: "sine.inOut", repeat: 19 }, 0);
      // moustache sticker twitches (whole cycles)
      tl.fromTo("#k-must", { scaleX: 1 }, { keyframes: { scaleX: [1, 1.06, 1] }, duration: ${(LAST / 30).toFixed(5)}, ease: "sine.inOut", repeat: 29 }, 0);
      // hook: shocked jump
      tl.to("#k-wrap", { keyframes: { y: [0, -18, 0, -8, 0] }, duration: 0.6, ease: "none" }, 0.3);
`;
for (const [t, m] of moods) {
  kJs += `      // ${m} @ ${f2(t)}\n`;
  kJs += `      tl.to("#k-sq", { keyframes: { scaleY: [1, 0.9, 1.06, 1], scaleX: [1, 1.07, 0.97, 1] }, duration: 0.3, ease: "none" }, ${f2(t - 0.05)});\n`;
  kJs += setMood(m, f2(t + 0.03), 0.22);
}
kJs += `      // GAG 1 (${WAL_ON}): he pulls out a mini wallet - he wants to buy the tower too
      tl.to("#k-wal", { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(2.6)" }, ${WAL_ON});
      tl.to("#k-wal", { keyframes: { y: [0, -16, 0], rotation: [0, -10, 0] }, duration: 0.35, ease: "sine.inOut", repeat: 1 }, ${f2(WAL_ON + 0.3)});
      tl.to("#k-wrap", { keyframes: { y: [0, -16, 0] }, duration: 0.3, ease: "none" }, ${f2(WAL_ON + 0.1)});
      // c08 (+1.0): Lustig is gone - wallet pulled in close, sweat
      tl.to("#k-wal", { keyframes: { x: [0, 30, 30], scale: [1, 0.85, 0.85] }, duration: 0.3, ease: "power2.out" }, ${f2(C.c08[0] + 1.0)});
      tl.to("#k-sweat", { opacity: 1, scale: 1, duration: 0.2, ease: "back.out(2)" }, ${f2(C.c08[0] + 1.1)});
      tl.to("#k-sweat", { keyframes: { y: [0, 30] }, duration: 0.5, ease: "power1.in" }, ${f2(C.c08[0] + 1.3)});
      tl.to("#k-sweat", { opacity: 0, scale: 0, y: 0, duration: 0.15 }, ${f2(C.c09[0] + 0.1)});
      tl.to("#k-wal", { x: 0, scale: 1, duration: 0.25, ease: "power2.out" }, ${f2(C.c09[0] + 0.1)});
      // c09: he leans forward (towards the question) and back
      tl.to("#k-wrap", { keyframes: { rotation: [0, -9, -9, 0], y: [0, 4, 4, 0] }, duration: 1.3, ease: "power2.inOut" }, ${f2(C.c09[0] + 0.1)});
      // c12 (+1.0): NOCHMAL - he waves the wallet: me too!
      tl.to("#k-wal", { keyframes: { y: [0, -30, 0, -30, 0], rotation: [0, -14, 0, -14, 0] }, duration: 0.7, ease: "sine.inOut" }, ${f2(C.c12[0] + 1.05)});
      tl.to("#k-wrap", { keyframes: { y: [0, -20, 0, -12, 0] }, duration: 0.6, ease: "none" }, ${f2(C.c12[0] + 1.05)});
      // GAG 2 (${WAL_OFF}): police! the wallet disappears behind his back
      tl.to("#k-wal", { x: 90, scale: 0, opacity: 0, duration: 0.25, ease: "power2.in" }, ${WAL_OFF});
      tl.to("#k-wrap", { keyframes: { x: [0, -6, 6, -4, 0] }, duration: 0.4, ease: "none" }, ${f2(WAL_OFF + 0.2)});
      // GAG 3 (${SIGN_T}): suspicious brows, then he sticks a "not for sale" sign (crossed-out euro) on himself
      tl.to(["#k-pupL", "#k-pupR"], { keyframes: { x: [-16, 14, -16, 0] }, duration: 0.6, ease: "power1.inOut" }, ${f2(C.c17[0] + 0.1)});
      tl.fromTo("#k-sign", { opacity: 1, x: -150, y: -40, rotation: -30, scale: 0.6 }, { opacity: 1, x: 0, y: 0, rotation: 12, scale: 1.15, duration: 0.25, ease: "power2.out", immediateRender: false }, ${SIGN_T});
      tl.to("#k-sign", { keyframes: { scale: [1.15, 0.92, 1] }, duration: 0.25, ease: "none" }, ${f2(SIGN_T + 0.25)});
      tl.to("#k-sq", { keyframes: { scaleY: [1, 0.94, 1] }, duration: 0.25, ease: "none" }, ${f2(SIGN_T + 0.25)});
      tl.to("#k-sign", { keyframes: { rotation: [12, 8, 12] }, duration: 0.5, ease: "sine.inOut", repeat: 1 }, ${f2(SIGN_T + 0.6)});
      // loop (${LOOPK}): sign off, frame-0 shock pose with the jump
      tl.set("#k-sign", { opacity: 0 }, ${LOOPK});
      tl.to("#k-wrap", { keyframes: { y: [0, -16, 0] }, duration: 0.3, ease: "none" }, ${f2(LOOPK + 0.05)});
`;
const WALLET = () => `<svg viewBox="0 0 110 86" width="100%" height="100%" overflow="visible"><rect x="20" y="4" width="70" height="40" rx="4" fill="#9FE3B0" stroke="${K}" stroke-width="5" transform="rotate(-8 55 24)"/><rect x="4" y="22" width="102" height="60" rx="12" fill="#8A4A22" stroke="${K}" stroke-width="6"/><path d="M60 40 H106 V64 H60 Q50 52 60 40 Z" fill="#6A3414" stroke="${K}" stroke-width="5"/><circle cx="72" cy="52" r="7" fill="${GOLD}" stroke="${K}" stroke-width="3"/></svg>`;
fs.writeFileSync(path.join(OUT, "compositions", "klotz.html"), `<template>
  <style>
    ${FONTFACE}
    #root { position: absolute; inset: 0; pointer-events: none; }
    #k-pod { position: absolute; left: 650px; top: 1748px; width: 350px; height: 120px; }
    #k-wrap { position: absolute; left: 700px; top: 1480px; width: 260px; height: 286px; transform-origin: 50% 100%; }
    #k-bob, #k-sq { position: absolute; inset: 0; transform-origin: 50% 100%; }
    #k-wal { position: absolute; left: -104px; top: 140px; width: 110px; height: 86px; }
    #k-sign { position: absolute; left: 150px; top: 196px; width: 110px; height: 81px; }
  </style>
  <div id="root" data-composition-id="klotz" data-width="1080" data-height="1920" data-layout-allow-overflow>
    <div id="k-pod"><svg viewBox="0 0 350 120" width="100%" height="100%" overflow="visible"><rect x="10" y="10" width="330" height="104" rx="14" fill="${TEAL_D}" stroke="${K}" stroke-width="8"/><path d="M10 52 H340" stroke="${GOLD}" stroke-width="6"/>${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${30 + i * 52} 96 L${56 + i * 52} 66 L${82 + i * 52} 96" fill="none" stroke="${GOLD_L}" stroke-width="6" stroke-linejoin="round" opacity=".7"/>`).join("")}<rect x="10" y="10" width="330" height="22" rx="10" fill="${GOLD}" stroke="${K}" stroke-width="6"/></svg></div>
    <div id="k-wrap"><div id="k-bob"><div id="k-sq">
${klotzSvg}
      <div id="k-wal" class="k-prop">${WALLET()}</div>
      <div id="k-sign" class="k-prop">${SIGN("no")}</div>
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
  [c("c02"), "whoosh1", 0.4], [c("c02") + 0.3, "pop1", 0.35], [c("c02") + 0.5, "hmm", 0.3], [c("c02") + 0.9, "glint", 0.4], [c("c02") + 1.1, "pop2", 0.3],
  [c("c03"), "whoosh2", 0.35], [c("c03") + 0.05, "cards", 0.5], [c("c03") + 0.7, "swish", 0.35], [c("c03") + 0.9, "sparkle", 0.35], [c("c03") + 1.1, "pop1", 0.3],
  [c("c04"), "whoosh1", 0.4], [c("c04") + 0.05, "paper", 0.4], [c("c04") + 1.1, "stamp", 0.5], [c("c04") + 1.15, "boing", 0.25],
  [c("c05"), "whoosh2", 0.35], ...[0.3, 0.9, 1.5].map((t, i) => [c("c05") + t + 0.1, i % 2 ? "clank2" : "clank", 0.4]), [c("c05") + 0.5, "creak", 0.4], [c("c05") + 1.6, "creak", 0.35],
  ...[0.6, 1.1, 1.6].map((t) => [c("c05") + t + 0.5, "click", 0.4]),
  [c("c06"), "whoosh1", 0.35], [c("c06") + 0.65, "heavy", 0.4], [c("c06") + 0.95, "heavy", 0.4], [c("c06") + 1.3, "heavy", 0.45], [c("c06") + 1.3, "needle", 0.4], [c("c06") + 1.35, "kaching", 0.3],
  [c("c07"), "reel", 0.4], [WAL_ON, "pop2", 0.4], [WAL_ON + 0.05, "coin", 0], [c("c07") + 1.05, "splash", 0.5], [c("c07") + 1.1, "reel", 0.35],
  [c("c08"), "paper", 0.4], [c("c08") + 0.3, "paper", 0.35], [c("c08") + 0.85, "gulp", 0.35], [c("c08") + 0.95, "steps", 0.45], [c("c08") + 1.35, "poof", 0.5], [c("c08") + 1.1, "whoosh1", 0.35],
  [c("c09"), "whoosh2", 0.3], [c("c09") + 0.1, "hmm", 0.35], [c("c09") + 0.12, "pop1", 0.3],
  [c("c10"), "phone", 0.35], [c("c10") + 0.3, "whoosh2", 0.25], [c("c10") + 0.6, "boing", 0.25], [c("c10") + 1.5, "clack", 0.5],
  [c("c11"), "steps", 0.4], [c("c11") + 0.7, "steps", 0.35], [c("c11") + 1.15, "hmm", 0.3],
  [c("c12"), "impact", 0.35], [c("c12") + 0.28, "stamp", 0.45], [c("c12") + 0.3, "kaching", 0.4], [c("c12") + 0.32, "sparkle", 0.35], [c("c12") + 1.05, "jump", 0.3],
  [c("c13"), "siren", 0.4], [c("c13") + 0.3, "whistle", 0.35], [c("c13") + 1.3, "whistle", 0.3], [WAL_OFF, "swish", 0.35], [c("c13") + 1.5, "steps", 0.3],
  [c("c14"), "waves", 0.45], [c("c14") + 0.2, "horn", 0.4], [c("c14") + 1.4, "horn", 0.3],
  [c("c15") + 0.38, "bars", 0.45], [c("c15") + 0.6, "gulp", 0.3],
  [c("c16"), "whoosh1", 0.35], [c("c16") + 0.65, "click", 0.45], [c("c16") + 0.8, "swish", 0.25], [c("c16") + 1.4, "pop1", 0.3], [c("c16") + 1.52, "pop1", 0.3],
  [c("c17"), "pop1", 0.4], [c("c17") + 0.2, "pop2", 0.35], [c("c17") + 0.15, "hmm", 0.35], [SIGN_T, "peel", 0.45], [SIGN_T + 0.5, "boing", 0.25],
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
      <audio id="music-charleston" class="clip" src="assets/sfx/music.wav" data-start="0" data-duration="${DUR}" data-track-index="5" data-volume="0.5"></audio>
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
