// Generator for Folge 10 "Leeroy Jenkins" (Staffelfinale): writes index.html and compositions/*.html
// Usage: node tools/gen.mjs <project_dir>
// Technique from Folge 1-9 (scene helper, Klotz rig, captions with fixed word gap, id checks, exit before the cut).
// New in Folge 10: fantasy pixel-dungeon look (own pixel sprites, no game assets). Own drawings: pixel hero with a raised
// sword, pixel group members, dragon eggs, cute baby dragons, pixel bitmap font for the battle cry, two "??" speech bubbles,
// dungeon entrance with torches, chalk strategy board with drawn arrows, calculator "32,33" with the period bar, headphones,
// chicken leg, comic tombstones, multiplying screens with hearts/share icons, generic quiz board, stage curtain,
// film clapperboard, trophy, pixel comment bubble.
// Klotz gag: listens at the strategy board and takes notes (notepad + pencil), then runs off himself shouting "KLOTZ!"
// (and comes straight back); at the end he holds a chicken leg and winks (one eye only).
// All graphics stay in x 80-1000 and in y 700-1400 (under the captions, above Klotz).
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
const YEL = "#FFD23F", RED = "#FF3B3B", RED_D = "#B81E2A", CREAM = "#FFF1D6";
const STONE = "#5A6488", STONE_D = "#3A4266", STONE_L = "#7E89B0";
const GREEN = "#3BC96B", GREEN_D = "#1F8F45", PURP = "#9B5DE5", PURP_D = "#5E2CA5", BLUE = "#3A7BFF", BLUE_D = "#1F4FB8";
const CHALK = "#2F6B52", CHALK_D = "#1E4A38", WOOD = "#9A6232", WOOD_D = "#5E3A1A", GOLD = "#F2B705", GOLD_D = "#B07A00", GOLD_L = "#FFE58A";
const MEAT = "#C8733A", MEAT_D = "#8A4520", MEAT_L = "#E9A065", FLAME = "#FF9F1C";

// ================= timing: one row per caption; one scene per caption; cuts on whole tenths =================
// a caption with n words needs n x 0.35 s (min 1.1 s) fully readable + the word pop-in + the exit
const CD = [["c01", 2.2], ["c02", 2.0], ["c03", 2.4], ["c04", 2.4], ["c05", 2.0], ["c06", 2.4], ["c07", 2.4], ["c08", 2.4], ["c09", 2.0],
  ["c10", 2.0], ["c11", 2.0], ["c12", 2.4], ["c13", 2.2], ["c14", 1.6], ["c15", 2.4], ["c16", 2.6], ["c17", 2.8], ["c18", 0.6]];
const C = {};
{ let t = 0; for (const [id, d] of CD) { C[id] = [f2(t), f2(t + d)]; t += d; } }
export const DUR = C.c18[1];
const LAST = f2(DUR - 1 / 30);
const T = {
  hook: C.c01, worte: C.c02, dungeon: C.c03, tafel: C.c04, plan: C.c05, rechner: C.c06, kopfhoerer: C.c07, keule: C.c08, schrei: C.c09,
  hinterher: C.c10, ko: C.c11, meme: C.c12, quiz: C.c13, vorhang: C.c14, klappe: C.c15, pokal: C.c16, frage: [C.c17[0], DUR],
};
const S = (k) => [T[k][0], f2(T[k][1] - T[k][0])];
const scenes = [];

// ================= pixel art (own designs) =================
// rows of characters, one per pixel; "." is empty. Runs of the same colour are merged into one rect.
const pixRects = (rows, pal, y0 = 0) => rows.map((row, y) => {
  let s = "", x = 0;
  while (x < row.length) {
    const c = row[x]; let n = 1;
    while (x + n < row.length && row[x + n] === c) n++;
    if (c !== "." && pal[c]) s += `<rect x="${x}" y="${y + y0}" width="${n + 0.04}" height="1.04" fill="${pal[c]}"/>`;
    x += n;
  }
  return s;
}).join("");
const PIXSVG = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" overflow="visible" shape-rendering="crispEdges">${inner}</svg>`;

// hero (14 x 16): helmet, raised sword on the right; two leg poses (run cycle)
const HERO_TOP = [
  ".....kkkk..ww.",
  "....kssssk.wW.",
  "...ksssssskwW.",
  "...kSSSSSSkwW.",
  "...kpeppepkwW.",
  "...kppppppkwW.",
  "....kkppkkyyyy",
  "..kkrrrrrrkpp.",
  ".kprryyyyrrpk.",
  ".kprrrrrrrrk..",
  "..kkrrrrrrkk..",
];
const MATE_TOP = [
  ".....kkkk.....",
  "....kssssk....",
  "...kssssssk...",
  "...kSSSSSSk...",
  "...kpeppepk...",
  "...kppppppk...",
  "....kkppkk....",
  "..kkrrrrrrkk..",
  ".kprryyyyrrpk.",
  ".kprrrrrrrrpk.",
  "..kkrrrrrrkk..",
];
const LEGS_A = ["...kRRkkRRk...", "...kRRk.kRRk..", "...kbbk.kbbk..", "..kbbbk.kbbbk.", "..kkkkk.kkkkk."];
const LEGS_B = ["...kRRRRRRk...", "..kRRk..kRRk..", ".kbbk....kbbk.", "kbbbk....kbbbk", "kkkkk....kkkkk"];
const HPAL = (r = "#E03A3A", R = "#8E1F2A", s = "#C9CEDD", S2 = "#7D839C") => ({ k: K, s, S: S2, p: "#F2C29A", e: "#141414", r, R, y: YEL, b: "#6B3E1F", w: "#EEF2FF", W: "#9AA3C0" });
const MATES = [HPAL(BLUE, BLUE_D, "#9FD3FF", "#4A7AB0"), HPAL(GREEN, GREEN_D, "#B8F0A0", "#5C9A4A"), HPAL(PURP, PURP_D, "#D9C2FF", "#8A6AC0"), HPAL("#FF9F1C", "#B0600A", "#FFE0A0", "#B08A40")];
// figure svg with ids p-la / p-lb for the two leg poses (p-lb hidden); mate = no sword
const FIG = (p, pal, mate = false) => PIXSVG(14, 16, pixRects(mate ? MATE_TOP : HERO_TOP, pal) +
  `<g id="${p}-la">${pixRects(LEGS_A, pal, 11)}</g><g id="${p}-lb" opacity="0">${pixRects(LEGS_B, pal, 11)}</g>`);
const FIGS = (pal, mate = true) => PIXSVG(14, 16, pixRects(mate ? MATE_TOP : HERO_TOP, pal) + pixRects(LEGS_A, pal, 11));
// run cycle: alternate the two leg poses every `step` s from t0 for d s
const runLegs = (p, t0, d, step = 0.12) => { let s = ""; for (let k = 1, t = f2(t0 + step); t < t0 + d - 1e-6; k++, t = f2(t + step)) s += `      tl.set("#${p}-la", { opacity: ${k % 2 ? 0 : 1} }, ${t}); tl.set("#${p}-lb", { opacity: ${k % 2 ? 1 : 0} }, ${t});\n`; return s; };

// dragon egg (8 x 10)
const EGG = (spot = PURP) => PIXSVG(8, 10, pixRects(["..kkkk..", ".kccddk.", "kcccdddk", "kddcccck", "kdddccck", "kcccccdk", "kccddcck", "kccdddck", ".kcccck.", "..kkkk.."], { k: K, c: CREAM, d: spot }));
// cute baby dragon (14 x 11), facing right
const DRAGON = (g = GREEN, v = PURP) => PIXSVG(14, 11, pixRects([
  "........k..k..", ".......kgkkgk.", "......kggggggk", ".kk...kggwwegk", "kvvk..kggggggk", "kvvvkkgggggpgk",
  ".kvkggggggggk.", "..kggllllgggk.", "kkgggllllggk..", "..kggkkkkggk..", "..kkk....kkk.."], { k: K, g, v, w: "#fff", e: "#141414", p: "#FF8FA3", l: GOLD_L }));
// pixel dust puff (10 x 8)
const PUFF = () => PIXSVG(10, 8, pixRects(["...kkkk...", "..kwwwwk..", ".kwwwwwwkk", "kwwwwwwwwk", "kwwgwwwwwk", ".kwwwwggk.", "..kkwwkk..", "....kk...."], { k: K, w: "#E9E6F5", g: "#B8B4CC" }));
// pixel heart (7 x 6)
const HEART = () => PIXSVG(7, 6, pixRects([".kk.kk.", "krrkrrk", "krrrrrk", ".krrrk.", "..krk..", "...k..."], { k: K, r: RED }));
// pixel "!" (3 x 7)
const BANG = () => PIXSVG(3, 7, pixRects(["kyk", "kyk", "kyk", "kyk", "kkk", "kyk", "kkk"], { k: K, y: YEL }));

// pixel bitmap font (5 x 7), own glyphs
const GLY = {
  L: ["1....", "1....", "1....", "1....", "1....", "1....", "11111"], E: ["11111", "1....", "1....", "1111.", "1....", "1....", "11111"],
  R: ["1111.", "1...1", "1...1", "1111.", "1.1..", "1..1.", "1...1"], O: [".111.", "1...1", "1...1", "1...1", "1...1", "1...1", ".111."],
  Y: ["1...1", "1...1", ".1.1.", "..1..", "..1..", "..1..", "..1.."], J: ["..111", "...1.", "...1.", "...1.", "1..1.", "1..1.", ".11.."],
  N: ["1...1", "11..1", "1.1.1", "1..11", "1...1", "1...1", "1...1"], K: ["1...1", "1..1.", "1.1..", "11...", "1.1..", "1..1.", "1...1"],
  I: ["11111", "..1..", "..1..", "..1..", "..1..", "..1..", "11111"], S: [".1111", "1....", "1....", ".111.", "....1", "....1", "1111."],
  "!": ["..1..", "..1..", "..1..", "..1..", "..1..", ".....", "..1.."],
};
// one line of pixel text; width in cells = 6 * n - 1 (1 cell gap between letters), height 7; dark 3D edge below right
const PTXT = (str, col = YEL) => {
  let fg = "", sh = "";
  [...str].forEach((ch, i) => GLY[ch].forEach((r, y) => [...r].forEach((b, x) => { if (b === "1") { fg += `<rect x="${i * 6 + x}" y="${y}" width="1.02" height="1.02"/>`; sh += `<rect x="${i * 6 + x + 0.3}" y="${y + 0.35}" width="1.02" height="1.02"/>`; } })));
  return PIXSVG(6 * str.length - 1, 7, `<g fill="${K}">${sh}</g><g fill="${col}">${fg}</g>`);
};

// ================= vector drawings (own designs) =================
const SPARK = (col = YEL) => `<svg viewBox="0 0 100 100" width="100%" height="100%" overflow="visible"><path d="M50 2 Q56 44 98 50 Q56 56 50 98 Q44 56 2 50 Q44 44 50 2 Z" fill="${col}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/></svg>`;
// speech bubble outline (viewBox 360 x 300), tail bottom-left or bottom-right
const SBUB = (right = false) => `<svg viewBox="0 0 360 300" width="100%" height="100%" overflow="visible"><g transform="${right ? "translate(360 0) scale(-1 1)" : ""}">
  <path d="M60 14 H300 Q346 14 346 60 V180 Q346 226 300 226 H140 L70 290 L88 226 H60 Q14 226 14 180 V60 Q14 14 60 14 Z" fill="#1A2350" stroke="${K}" stroke-width="22" stroke-linejoin="round"/>
  <path d="M60 14 H300 Q346 14 346 60 V180 Q346 226 300 226 H140 L70 290 L88 226 H60 Q14 226 14 180 V60 Q14 14 60 14 Z" fill="none" stroke="#fff" stroke-width="10" stroke-linejoin="round"/></g></svg>`;
// jagged shout bubble (viewBox 780 x 330)
const SHOUT = () => {
  const pts = []; const n = 26;
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; const r = i % 2 ? 0.86 : 1; pts.push(`${f2(390 + Math.cos(a) * 380 * r)} ${f2(165 + Math.sin(a) * 160 * r)}`); }
  return `<svg viewBox="0 0 780 330" width="100%" height="100%" overflow="visible"><path d="M${pts.join(" L")} Z" fill="${RED}" stroke="${K}" stroke-width="14" stroke-linejoin="round"/><path d="M${pts.map((q) => q.split(" ").map((v, j) => f2(j ? 165 + (v - 165) * 0.9 : 390 + (v - 390) * 0.93)).join(" ")).join(" L")} Z" fill="${RED_D}" opacity=".35"/></svg>`;
};
// dungeon entrance: pixel stone wall with an arched dark doorway (viewBox 640 x 500, drawn in 20 px bricks)
const DUNGEON = () => {
  let b = "";
  for (let r = 0; r < 25; r++) for (let c = -1; c < 17; c++) {
    const x = c * 40 + (r % 2 ? 20 : 0), y = r * 20;
    const cx = x + 20 - 320, cy = y + 10 - 260;
    const inArch = (cy > 0 && Math.abs(cx) < 170) || (cy <= 0 && Math.hypot(cx, cy) < 170);
    if (inArch || x < 0 || x > 600) continue;
    const shade = [STONE, STONE_L, STONE, STONE_D][(r * 7 + c * 3) % 4];
    b += `<rect x="${x + 1}" y="${y + 1}" width="38" height="18" fill="${shade}"/>`;
  }
  return `<svg viewBox="0 0 640 500" width="100%" height="100%" overflow="visible" shape-rendering="crispEdges">
  <rect x="0" y="0" width="640" height="500" fill="${K}"/>${b}
  <path d="M150 500 V260 A170 170 0 0 1 490 260 V500 Z" fill="#05070F"/>
  <path d="M190 500 V270 A130 130 0 0 1 450 270 V500 Z" fill="#0B1024"/>
  <rect x="0" y="0" width="640" height="500" fill="none" stroke="${K}" stroke-width="10"/></svg>`;
};
// torch (viewBox 80 x 200): holder + flame group (id p-fl)
const TORCH = (p) => `<svg viewBox="0 0 80 200" width="100%" height="100%" overflow="visible"><rect x="30" y="90" width="20" height="100" fill="${WOOD}" stroke="${K}" stroke-width="6"/><rect x="18" y="82" width="44" height="22" fill="${STONE_D}" stroke="${K}" stroke-width="6"/>
  <g id="${p}"><path d="M40 0 Q70 40 60 66 Q52 84 40 84 Q28 84 20 66 Q10 40 40 0 Z" fill="${FLAME}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><path d="M40 30 Q54 52 48 66 Q44 76 40 76 Q34 76 32 66 Q28 52 40 30 Z" fill="${YEL}"/></g></svg>`;
// chalkboard (viewBox 800 x 520)
const BOARD = () => `<svg viewBox="0 0 800 520" width="100%" height="100%" overflow="visible"><rect x="8" y="8" width="784" height="504" rx="18" fill="${WOOD}" stroke="${K}" stroke-width="12"/><rect x="40" y="40" width="720" height="440" rx="8" fill="${CHALK}" stroke="${WOOD_D}" stroke-width="8"/>
  <path d="M90 90 Q200 80 260 110 M520 420 Q620 400 700 430" stroke="#fff" stroke-width="5" opacity=".12" fill="none"/><rect x="300" y="482" width="200" height="22" rx="8" fill="${WOOD_D}" stroke="${K}" stroke-width="6"/><rect x="330" y="474" width="60" height="14" rx="4" fill="#F4F4F4" stroke="${K}" stroke-width="4"/></svg>`;
// calculator (viewBox 480 x 640) - no digits on the keys
const CALC = () => `<svg viewBox="0 0 480 640" width="100%" height="100%" overflow="visible"><rect x="8" y="8" width="464" height="624" rx="44" fill="#3A4270" stroke="${K}" stroke-width="14"/><rect x="24" y="22" width="432" height="16" rx="8" fill="#5A649A"/>
  <rect x="44" y="52" width="392" height="170" rx="18" fill="#9FD9A8" stroke="${K}" stroke-width="10"/><rect x="56" y="64" width="368" height="20" rx="8" fill="#BDEBC2"/>
  ${[0, 1, 2, 3].map((r) => [0, 1, 2, 3].map((c) => `<rect id="rechner-k${r}${c}" x="${52 + c * 98}" y="${262 + r * 90}" width="80" height="70" rx="16" fill="${c === 3 ? (r === 3 ? RED : "#FF9F1C") : "#E9E6F5"}" stroke="${K}" stroke-width="8"/>`).join("")).join("")}
  <path d="M367 287 H389 M378 276 V298 M367 373 H389 M370 459 L386 475 M386 459 L370 475 M367 552 H389 M367 562 H389" stroke="${K}" stroke-width="7" stroke-linecap="round"/></svg>`;
// headphones (viewBox 340 x 260)
const PHONES = () => `<svg viewBox="0 0 340 260" width="100%" height="100%" overflow="visible"><path d="M40 170 Q40 20 170 20 Q300 20 300 170" fill="none" stroke="${K}" stroke-width="36" stroke-linecap="round"/><path d="M40 170 Q40 20 170 20 Q300 20 300 170" fill="none" stroke="${RED}" stroke-width="18" stroke-linecap="round"/>
  <rect x="6" y="140" width="70" height="114" rx="26" fill="${RED}" stroke="${K}" stroke-width="10"/><rect x="264" y="140" width="70" height="114" rx="26" fill="${RED}" stroke="${K}" stroke-width="10"/><rect x="22" y="160" width="20" height="70" rx="10" fill="#FF8080"/></svg>`;
const NOTE = (col = YEL) => `<svg viewBox="0 0 80 110" width="100%" height="100%" overflow="visible"><path d="M30 86 V14 L72 4 V70" fill="none" stroke="${K}" stroke-width="14" stroke-linejoin="round"/><path d="M30 86 V14 L72 4 V70" fill="none" stroke="${col}" stroke-width="6" stroke-linejoin="round"/><ellipse cx="20" cy="88" rx="18" ry="14" fill="${col}" stroke="${K}" stroke-width="6"/><ellipse cx="62" cy="74" rx="18" ry="14" fill="${col}" stroke="${K}" stroke-width="6"/></svg>`;
// chicken leg (viewBox 300 x 300), bone bottom-left
const LEG = (bite = false) => `<svg viewBox="0 0 300 300" width="100%" height="100%" overflow="visible">
  <path d="M120 200 L62 262" stroke="${K}" stroke-width="44" stroke-linecap="round"/><path d="M120 200 L62 262" stroke="${CREAM}" stroke-width="26" stroke-linecap="round"/>
  <circle cx="46" cy="258" r="20" fill="${CREAM}" stroke="${K}" stroke-width="8"/><circle cx="66" cy="280" r="20" fill="${CREAM}" stroke="${K}" stroke-width="8"/>
  <path d="M170 24 Q270 30 276 120 Q280 196 196 216 Q150 228 116 206 Q84 184 86 130 Q90 22 170 24 Z" fill="${MEAT}" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>
  <path d="M150 54 Q214 50 234 100" stroke="${MEAT_L}" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M120 180 Q160 200 210 186" stroke="${MEAT_D}" stroke-width="10" fill="none" stroke-linecap="round"/>
  ${bite ? `<path d="M276 96 Q254 92 252 112 Q236 112 238 132 Q222 136 230 156 Q246 166 268 150 Q282 126 276 96 Z" fill="#1A2350" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>` : ""}</svg>`;
const STEAM = () => `<svg viewBox="0 0 60 120" width="100%" height="100%" overflow="visible"><path d="M30 116 Q6 90 30 62 Q54 34 30 6" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".85"/></svg>`;
// comic tombstone (viewBox 160 x 210) - no text, a groove cross and a crack
const TOMB = () => `<svg viewBox="0 0 160 210" width="100%" height="100%" overflow="visible"><path d="M14 196 V80 Q14 10 80 10 Q146 10 146 80 V196 Z" fill="#A9AFC8" stroke="${K}" stroke-width="10" stroke-linejoin="round"/><path d="M30 190 V84 Q30 30 80 26" fill="none" stroke="#D4D8EA" stroke-width="10" stroke-linecap="round"/>
  <path d="M80 56 V132 M52 82 H108" stroke="#6E7594" stroke-width="12" stroke-linecap="round"/><path d="M118 30 L104 62 L120 84 L108 110" fill="none" stroke="#6E7594" stroke-width="6" stroke-linejoin="round"/>
  <path d="M0 200 H160" stroke="${K}" stroke-width="12" stroke-linecap="round"/><path d="M8 196 Q20 176 28 196 M132 196 Q142 178 152 196" stroke="${GREEN_D}" stroke-width="8" fill="${GREEN}"/></svg>`;
// monitor (viewBox 240 x 200) with a mini pixel hero on screen
const MONITOR = (p) => `<svg viewBox="0 0 240 200" width="100%" height="100%" overflow="visible"><rect x="96" y="150" width="48" height="30" fill="${STONE_D}" stroke="${K}" stroke-width="8"/><rect x="60" y="176" width="120" height="18" rx="8" fill="${STONE}" stroke="${K}" stroke-width="8"/>
  <rect x="8" y="8" width="224" height="150" rx="16" fill="#222A50" stroke="${K}" stroke-width="10"/><rect x="24" y="22" width="192" height="122" rx="6" fill="#2E66D9"/><rect x="24" y="118" width="192" height="26" fill="${STONE}"/>
  <svg x="92" y="40" width="56" height="78" viewBox="0 0 14 16" shape-rendering="crispEdges">${pixRects(HERO_TOP, HPAL())}${pixRects(LEGS_A, HPAL(), 11)}</svg>
  <circle cx="204" cy="34" r="7" fill="${RED}"/></svg>`;
const SHARE = () => `<svg viewBox="0 0 100 100" width="100%" height="100%" overflow="visible"><circle cx="50" cy="50" r="46" fill="${BLUE}" stroke="${K}" stroke-width="8"/><path d="M34 52 L64 34 M34 52 L64 68" stroke="#fff" stroke-width="7"/><circle cx="32" cy="52" r="10" fill="#fff"/><circle cx="66" cy="32" r="10" fill="#fff"/><circle cx="66" cy="70" r="10" fill="#fff"/></svg>`;
// stage curtain (viewBox 840 x 620): valance + two halves (ids p-l / p-r)
const CURT = (p) => {
  const half = (flip) => `<g transform="${flip ? "translate(840 0) scale(-1 1)" : ""}"><path d="M10 40 H420 Q400 300 360 610 H10 Z" fill="${RED_D}" stroke="${K}" stroke-width="12" stroke-linejoin="round"/>${[80, 170, 260].map((x) => `<path d="M${x} 50 Q${x + 20} 330 ${x - 10} 600" stroke="#7E1020" stroke-width="16" fill="none"/>`).join("")}<path d="M40 50 Q50 330 36 600" stroke="#E25A5A" stroke-width="10" fill="none" opacity=".6"/></g>`;
  return `<svg viewBox="0 0 840 620" width="100%" height="100%" overflow="visible"><rect x="10" y="30" width="820" height="580" fill="#05070F"/><g id="${p}-l">${half(false)}</g><g id="${p}-r">${half(true)}</g>
  <path d="M0 10 H840 V70 Q780 100 720 70 Q660 100 600 70 Q540 100 480 70 Q420 100 360 70 Q300 100 240 70 Q180 100 120 70 Q60 100 0 70 Z" fill="${RED}" stroke="${K}" stroke-width="12" stroke-linejoin="round"/><path d="M0 22 H840" stroke="${GOLD}" stroke-width="10"/></svg>`;
};
// film clapperboard: slate (viewBox 600 x 420) and the arm (viewBox 600 x 110), no text
const SLATE = () => `<svg viewBox="0 0 600 420" width="100%" height="100%" overflow="visible"><rect x="10" y="10" width="580" height="400" rx="20" fill="#20243A" stroke="${K}" stroke-width="14"/>
  <rect x="10" y="10" width="580" height="90" fill="#fff" stroke="${K}" stroke-width="14"/>${[0, 1, 2, 3, 4].map((i) => `<path d="M${40 + i * 120} 14 L${100 + i * 120} 14 L${60 + i * 120} 96 L${0 + i * 120 + 10} 96 Z" fill="${K}"/>`).join("")}
  <path d="M40 180 H560 M40 270 H560 M300 180 V400" stroke="#fff" stroke-width="8" opacity=".55"/></svg>`;
const ARM = () => `<svg viewBox="0 0 600 110" width="100%" height="100%" overflow="visible"><rect x="10" y="10" width="580" height="90" rx="10" fill="#fff" stroke="${K}" stroke-width="14"/>${[0, 1, 2, 3, 4].map((i) => `<path d="M${50 + i * 120} 14 L${110 + i * 120} 14 L${70 + i * 120} 96 L${10 + i * 120 + 10} 96 Z" fill="${K}"/>`).join("")}<circle cx="44" cy="55" r="18" fill="${STONE_L}" stroke="${K}" stroke-width="8"/></svg>`;
// trophy (viewBox 420 x 460)
const CUP = () => `<svg viewBox="0 0 420 460" width="100%" height="100%" overflow="visible"><path d="M90 60 Q10 60 20 140 Q30 210 120 220" fill="none" stroke="${K}" stroke-width="34"/><path d="M330 60 Q410 60 400 140 Q390 210 300 220" fill="none" stroke="${K}" stroke-width="34"/>
  <path d="M90 60 Q10 60 20 140 Q30 210 120 220" fill="none" stroke="${GOLD}" stroke-width="16"/><path d="M330 60 Q410 60 400 140 Q390 210 300 220" fill="none" stroke="${GOLD}" stroke-width="16"/>
  <path d="M70 20 H350 Q350 230 230 270 V340 H190 V270 Q70 230 70 20 Z" fill="${GOLD}" stroke="${K}" stroke-width="14" stroke-linejoin="round"/><path d="M110 50 Q118 180 190 236" stroke="${GOLD_L}" stroke-width="18" fill="none" stroke-linecap="round"/>
  <rect x="120" y="336" width="180" height="40" rx="8" fill="${GOLD_D}" stroke="${K}" stroke-width="12"/><rect x="80" y="372" width="260" height="76" rx="12" fill="${WOOD}" stroke="${K}" stroke-width="12"/>
  <path d="M210 92 L226 130 L266 132 L234 156 L246 196 L210 172 L174 196 L186 156 L154 132 L194 130 Z" fill="${GOLD_L}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/></svg>`;
// pixel-style comment bubble (viewBox 780 x 480): stepped corners, tail down right towards Klotz
const PBUB = () => `<svg viewBox="0 0 780 480" width="100%" height="100%" overflow="visible" shape-rendering="crispEdges"><path d="M40 10 H740 V40 H770 V350 H740 V380 H620 V440 H580 V400 H540 V380 H40 V350 H10 V40 H40 Z" fill="#1A2350" stroke="${K}" stroke-width="20" stroke-linejoin="miter"/>
  <path d="M40 10 H740 V40 H770 V350 H740 V380 H620 V440 H580 V400 H540 V380 H40 V350 H10 V40 H40 Z" fill="none" stroke="${YEL}" stroke-width="8"/></svg>`;
// stone floor strip in pixel bricks (viewBox 840 x 60)
const FLOOR = () => `<svg viewBox="0 0 840 60" width="100%" height="100%" overflow="visible" shape-rendering="crispEdges"><rect x="0" y="0" width="840" height="60" fill="${K}"/>${Array.from({ length: 2 }, (_, r) => Array.from({ length: 22 }, (_, c) => { const x = c * 40 - (r ? 20 : 0); return x < -20 || x > 820 ? "" : `<rect x="${Math.max(2, x + 2)}" y="${r * 30 + 2}" width="${Math.min(36, 838 - x - 2)}" height="26" fill="${[STONE, STONE_L, STONE_D][(c + r) % 3]}"/>`; }).join("")).join("")}</svg>`;

// ---------- common CSS ----------
const STK = `filter: drop-shadow(5px 0 0 #fff) drop-shadow(-5px 0 0 #fff) drop-shadow(0 5px 0 #fff) drop-shadow(0 -5px 0 #fff) drop-shadow(0 14px 0 rgba(0,0,0,.35));`;
// the font is embedded as a data URI too (the sandboxed preview page has an opaque origin and cannot fetch font files), the file stays as fallback
const LILITA64 = fs.readFileSync(path.join(OUT, "assets", "fonts", "LilitaOne-latin.woff2")).toString("base64");
const FONTFACE = `@font-face{font-family:'Lilita One';src:url('data:font/woff2;base64,${LILITA64}') format('woff2'),url('assets/fonts/LilitaOne-latin.woff2') format('woff2');font-weight:400;font-style:normal;font-display:block;}`;
const abs = (l, t, w, h) => `position:absolute;left:${l}px;top:${t}px;width:${w}px;${h != null ? `height:${h}px;` : ""}`;
const LBL = (size, col = K) => `font-family:'Lilita One';font-size:${size}px;line-height:1;color:${col};white-space:nowrap;text-align:center;letter-spacing:0.02em;`;
const plate = (id, l, t, w, h, txt, size = 80, bg = CREAM, col = K) => `      <div id="${id}" class="plate" style="${abs(l, t, w, h)}background:${bg};"><div id="${id}-t" style="position:absolute;left:0;top:${Math.round((h - 14 - size) / 2) + 4}px;width:100%;${LBL(size, col)}">${txt}</div></div>`;
const box = (id, l, t, w, h, inner, cls = "STKC", extra = "") => `      <div id="${id}" class="${cls}" style="${abs(l, t, w, h)}${extra}">${inner}</div>`;
const stk = (s, p) => s.replace(/STKC/g, p + "-stk");

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
// sparkle burst: n stars from (cx, cy) outwards to radius rad (stays inside the given radius)
function burst(p, n, cx, cy, size, rad, seed, cols = [YEL, "#fff"]) {
  const RS = mulberry32(seed);
  const items = Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2 + RS() * 0.5; const rr = rad * (0.75 + RS() * 0.25); return { x: Math.round(Math.cos(a) * rr), y: Math.round(Math.sin(a) * rr), s: Math.round(size * (0.7 + RS() * 0.6)) }; });
  const html = items.map((it, i) => `<div id="${p}-${i}" class="spk" style="left:${cx - it.s / 2}px;top:${cy - it.s / 2}px;width:${it.s}px;height:${it.s}px;">${SPARK(cols[i % cols.length])}</div>`).join("");
  const js = (at) => items.map((it, i) => `      tl.fromTo("#${p}-${i}", { x: 0, y: 0, scale: 0, rotation: 0, opacity: 1 }, { keyframes: { x: [0, ${it.x}], y: [0, ${it.y}], scale: [0, 1.1, 0], rotation: [0, 120] }, duration: 0.6, ease: "power1.out", immediateRender: true }, ${at});`).join("\n");
  return { html, js };
}

// ================= HOOK picture (frame 0 = thumbnail motif): pixel hero with raised sword runs at a pile of dragon eggs, dust cloud =================
const EGGS = [[600, 1170, PURP], [700, 1170, GREEN], [800, 1170, BLUE], [650, 1060, "#FF9F1C"], [750, 1060, PURP], [700, 950, GREEN]];
const PUFFS = [[100, 1196, 120], [176, 1136, 90], [150, 1236, 84]];
const hookCss = (p) => `
   #${p}-glow{${abs(160, 760, 760, 620)}border-radius:50%;background:radial-gradient(circle,rgba(255,159,28,.28) 0%,rgba(255,159,28,0) 66%);}
   #${p}-fl{${abs(120, 1290, 840, 60)}}
   #${p}-hero{${abs(222, 970, 280, 320)}transform-origin:50% 100%;}
   .${p}-egg{position:absolute;width:96px;height:120px;transform-origin:50% 100%;}
   .${p}-pf{position:absolute;transform-origin:50% 50%;}
   #${p}-bang{${abs(866, 880, 36, 84)}transform-origin:50% 100%;}`;
const hookBody = (p) => stk(`      <div id="${p}-glow"></div>
${box(p + "-fl", 0, 0, 0, 0, FLOOR(), "STKC").replace(/style="[^"]*"/, "")}
${EGGS.map(([x, y, c], i) => `      <div id="${p}-e${i}" class="${p}-egg STKC" style="left:${x}px;top:${y}px;">${EGG(c)}</div>`).join("\n")}
${PUFFS.map(([x, y, w], i) => `      <div id="${p}-pf${i}" class="${p}-pf" style="left:${x}px;top:${y}px;width:${w}px;height:${Math.round(w * 0.8)}px;">${PUFF()}</div>`).join("\n")}
      <div id="${p}-hero" class="STKC">${FIG(p + "-h", HPAL())}</div>
      <div id="${p}-bang" class="STKC">${BANG()}</div>`, p);
// idle motion of the hook picture from t0 for d seconds; every move is whole periods from the rest pose
const hookIdle = (p, t0, d) => {
  const n = Math.max(1, Math.round(d / 0.3)), per = f2(d / n);
  return runLegs(p + "-h", t0, d, 0.1) +
`      tl.to("#${p}-hero", { keyframes: { y: [0, -14, 0], rotation: [0, 3, 0] }, duration: ${per}, ease: "sine.inOut", repeat: ${n - 1} }, ${t0});
${EGGS.map((_, i) => `      tl.to("#${p}-e${i}", { keyframes: { rotation: [0, ${i % 2 ? -5 : 5}, 0, ${i % 2 ? 5 : -5}, 0] }, duration: ${f2(per * 2)}, ease: "sine.inOut", repeat: ${Math.max(0, Math.round(n / 2) - 1)} }, ${t0});`).join("\n")}
${PUFFS.map((_, i) => `      tl.to("#${p}-pf${i}", { keyframes: { scale: [1, ${1.12 + i * 0.04}, 1], x: [0, -10, 0] }, duration: ${per}, ease: "sine.inOut", repeat: ${n - 1} }, ${t0});`).join("\n")}
      tl.to("#${p}-bang", { keyframes: { scaleY: [1, 1.15, 1], rotation: [0, 8, 0] }, duration: ${per}, ease: "sine.inOut", repeat: ${n - 1} }, ${t0});
      tl.to("#${p}-glow", { keyframes: { opacity: [1, 0.6, 1] }, duration: ${f2(per * 2)}, ease: "sine.inOut", repeat: ${Math.max(0, Math.round(n / 2) - 1)} }, ${t0});
`;
};
{
  const p = "hook";
  const [s, d] = S(p);
  scenes.push(scene(p, "Hook: Pixel-Held stuermt auf Drachen-Eier", s, d, hookCss(p), hookBody(p),
    `      // frame 0 already shows the full motif (thumbnail picture)
${hookIdle(p, 0, d)}`, { kb: false }));
}

// ================= WORTE: two speech bubble outlines pop up, each with "??" (c02) =================
{
  const p = "worte";
  const [s, d] = S(p);
  const q = (id, l, t) => `      <div id="${id}" style="${abs(l, t, 380, 140)}${LBL(130, YEL)}-webkit-text-stroke:14px ${K};paint-order:stroke fill;">??</div>`;
  scenes.push(scene(p, "Zwei Sprechblasen", s, d,
    `#worte-a{${abs(130, 760, 380, 316)}transform-origin:20% 100%;} #worte-b{${abs(570, 900, 380, 316)}transform-origin:80% 100%;}
     #worte-hero{${abs(484, 1236, 112, 128)}transform-origin:50% 100%;}`,
    stk(`      <div id="worte-a">${SBUB(false)}
  ${q("worte-qa", 0, 62)}</div>
      <div id="worte-b">${SBUB(true)}
  ${q("worte-qb", 0, 62)}</div>
      <div id="worte-hero" class="STKC">${FIGS(HPAL(), true)}</div>`, p),
    `      tl.fromTo("#worte-a", { scale: 0.7, rotation: -6 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2.4)" }, 0);
      tl.fromTo("#worte-b", { scale: 0.7, rotation: 6 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2.4)" }, 0.25);
      tl.to("#worte-qa", { keyframes: { scale: [1, 1.15, 1], rotation: [0, -6, 0] }, duration: 0.4, ease: "sine.inOut", repeat: 2 }, 0.4);
      tl.to("#worte-qb", { keyframes: { scale: [1, 1.15, 1], rotation: [0, 6, 0] }, duration: 0.4, ease: "sine.inOut", repeat: 2 }, 0.6);
      tl.to("#worte-hero", { keyframes: { y: [0, -24, 0], scaleY: [1, 1.06, 1] }, duration: 0.35, ease: "power1.out", repeat: 3, repeatDelay: 0.1 }, 0.15);`));
}

// ================= DUNGEON: pixel dungeon entrance, torches, eyes in the dark, label "World of Warcraft" as plain text (c03) =================
{
  const p = "dungeon";
  const [s, d] = S(p);
  scenes.push(scene(p, "Dungeon-Eingang", s, d,
    `#dungeon-gate{${abs(220, 740, 640, 500)}}
     .dungeon-tc{position:absolute;top:860px;width:80px;height:200px;}
     #dungeon-eyes{${abs(500, 1090, 80, 22)}transform-origin:50% 50%;}
     #dungeon-pl{transform-origin:50% 0%;}`,
    stk(`      <div id="dungeon-gate" class="STKC">${DUNGEON()}</div>
      <div id="dungeon-t1" class="dungeon-tc STKC" style="left:126px;">${TORCH("dungeon-f1")}</div>
      <div id="dungeon-t2" class="dungeon-tc STKC" style="left:874px;">${TORCH("dungeon-f2")}</div>
      <div id="dungeon-eyes"><svg viewBox="0 0 80 22" width="100%" height="100%" shape-rendering="crispEdges"><rect x="0" y="0" width="22" height="22" fill="${YEL}"/><rect x="58" y="0" width="22" height="22" fill="${YEL}"/></svg></div>
${plate("dungeon-pl", 190, 1272, 700, 100, "World of Warcraft", 76, CREAM, K)}`, p),
    `      gsap.set(["#dungeon-f1", "#dungeon-f2"], { transformOrigin: "50% 100%" });
      tl.fromTo("#dungeon-gate", { scale: 0.94 }, { scale: 1, duration: 0.35, ease: "back.out(2)" }, 0);
      tl.to("#dungeon-f1", { keyframes: { scaleY: [1, 1.2, 0.9, 1.1, 1], scaleX: [1, 0.9, 1.08, 0.95, 1] }, duration: 0.4, ease: "none", repeat: 5 }, 0);
      tl.to("#dungeon-f2", { keyframes: { scaleY: [1, 0.9, 1.2, 0.95, 1], scaleX: [1, 1.08, 0.9, 1.05, 1] }, duration: 0.4, ease: "none", repeat: 5 }, 0.1);
      // eyes in the doorway: open, look left/right, close quickly (blink) - no Klotz eyes involved
      tl.fromTo("#dungeon-eyes", { scaleY: 0 }, { scaleY: 1, duration: 0.15, ease: "power2.out" }, 0.5);
      tl.to("#dungeon-eyes", { keyframes: { x: [0, -30, 30, 0] }, duration: 0.9, ease: "sine.inOut" }, 0.7);
      tl.to("#dungeon-eyes", { keyframes: { scaleY: [1, 0.1, 1] }, duration: 0.18, ease: "none" }, 1.7);
      tl.fromTo("#dungeon-pl", { rotation: -5 }, { keyframes: { rotation: [-5, 4, -2, 1, 0] }, duration: 1.0, ease: "sine.out" }, 0.05);`));
}

// ================= TAFEL: strategy board, pixel figures standing in a circle, label GRUPPE (c04) =================
{
  const p = "tafel";
  const [s, d] = S(p);
  const ring = Array.from({ length: 6 }, (_, i) => { const a = -Math.PI / 2 + (i / 6) * Math.PI * 2; return [Math.round(540 + Math.cos(a) * 230 - 42), Math.round(990 + Math.sin(a) * 140 - 48)]; });
  scenes.push(scene(p, "Strategie-Tafel", s, d,
    `#tafel-bd{${abs(140, 740, 800, 520)}}
     .tafel-fg{position:absolute;width:84px;height:96px;transform-origin:50% 100%;}
     #tafel-ch{${abs(140, 740, 800, 520)}}`,
    stk(`      <div id="tafel-bd" class="STKC">${BOARD()}</div>
      <svg id="tafel-ch" viewBox="0 0 800 520" overflow="visible"><ellipse cx="400" cy="250" rx="290" ry="180" fill="none" stroke="#fff" stroke-width="7" stroke-dasharray="20 16" opacity=".7"/><path d="M380 230 L420 270 M420 230 L380 270" stroke="${YEL}" stroke-width="10" stroke-linecap="round"/></svg>
${ring.map(([x, y], i) => `      <div id="tafel-f${i}" class="tafel-fg" style="left:${x}px;top:${y}px;">${FIGS(MATES[i % 4])}</div>`).join("\n")}
${plate("tafel-pl", 380, 1290, 300, 100, "GRUPPE", 80, CREAM, K)}`, p),
    `      tl.fromTo("#tafel-bd", { scale: 0.95, rotation: -1.5 }, { scale: 1, rotation: 0, duration: 0.35, ease: "back.out(2)" }, 0);
${ring.map((_, i) => `      tl.to("#tafel-f${i}", { keyframes: { y: [0, -22, 0], scaleY: [1, 1.08, 1] }, duration: 0.3, ease: "power1.out", repeat: 1, repeatDelay: 0.6 }, ${f2(0.2 + i * 0.15)});`).join("\n")}
      tl.to("#tafel-ch", { keyframes: { rotation: [0, 2, 0] }, duration: 0.8, ease: "sine.inOut", repeat: 1 }, 0.3);`));
}

// ================= PLAN: board close-up, chalk arrows draw themselves from the group to the egg, PLAN heading (c05) =================
{
  const p = "plan";
  const [s, d] = S(p);
  const arrows = ["M150 190 Q330 120 520 270", "M150 300 Q330 300 510 310", "M150 410 Q330 480 520 350"];
  scenes.push(scene(p, "Pfeile auf der Tafel", s, d,
    `#plan-bd{${abs(110, 730, 860, 560)}}
     #plan-ar{${abs(110, 730, 860, 560)}}
     .plan-fg{position:absolute;left:196px;width:70px;height:80px;transform-origin:50% 100%;}
     #plan-egg{${abs(700, 990, 72, 90)}transform-origin:50% 100%;}
     #plan-hd{${abs(110, 786, 860, 96)}${LBL(90, "#F4F4F4")}}`,
    stk(`      <div id="plan-bd" class="STKC">${BOARD().replace('viewBox="0 0 800 520"', 'viewBox="0 0 800 520" preserveAspectRatio="none"')}</div>
      <div id="plan-hd">PLAN</div>
      <svg id="plan-ar" viewBox="0 0 860 560" overflow="visible">${arrows.map((dd, i) => `<path id="plan-a${i}" d="${dd}" pathLength="1" fill="none" stroke="#F4F4F4" stroke-width="10" stroke-linecap="round" stroke-dasharray="1 1"/>`).join("")}
        <circle cx="626" cy="306" r="86" fill="none" stroke="${YEL}" stroke-width="9" stroke-dasharray="1 1" pathLength="1" id="plan-ring"/>
        ${[[528, 250], [520, 312], [528, 362]].map(([x, y], i) => `<path id="plan-h${i}" d="M${x - 26} ${y - 18} L${x} ${y} L${x - 28} ${y + 14}" fill="none" stroke="#F4F4F4" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>`).join("")}</svg>
${[0, 1, 2].map((i) => `      <div id="plan-f${i}" class="plan-fg" style="top:${886 + i * 110}px;">${FIGS(MATES[i])}</div>`).join("\n")}
      <div id="plan-egg">${EGG(PURP)}</div>`, p),
    `${arrows.map((_, i) => `      tl.fromTo("#plan-a${i}", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.4, ease: "power1.inOut", immediateRender: true }, ${f2(0.1 + i * 0.35)});
      tl.set("#plan-h${i}", { opacity: 1 }, ${f2(0.5 + i * 0.35)});`).join("\n")}
      tl.fromTo("#plan-ring", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.4, ease: "power1.inOut", immediateRender: true }, 1.2);
      tl.to("#plan-egg", { keyframes: { rotation: [0, -8, 8, -4, 0] }, duration: 0.5, ease: "sine.inOut", repeat: 1 }, 1.2);
      tl.fromTo("#plan-hd", { scale: 0.85 }, { scale: 1, duration: 0.3, ease: "back.out(2.4)" }, 0);
${[0, 1, 2].map((i) => `      tl.to("#plan-f${i}", { keyframes: { y: [0, -16, 0] }, duration: 0.3, ease: "power1.out" }, ${f2(0.12 + i * 0.35)});`).join("\n")}`));
}

// ================= RECHNER: calculator shows "32,33" with the period bar, keys pressed, display flashes (c06) =================
{
  const p = "rechner";
  const [s, d] = S(p);
  const keys = ["00", "11", "02", "21", "30", "12", "33"];
  const B = burst("rechner-s", 6, 540, 878, 50, 230, 3233);
  scenes.push(scene(p, "Taschenrechner 32,33", s, d,
    `#rechner-c{${abs(300, 740, 480, 640)}transform-origin:50% 100%;}
     #rechner-lcd{${abs(344, 806, 392, 140)}${LBL(120, "#1E3A28")}letter-spacing:0.04em;}
     #rechner-per{display:inline-block;line-height:0.74;padding-top:8px;border-top:10px solid #1E3A28;}`,
    stk(`      <div id="rechner-c" class="STKC">${CALC()}
        <div id="rechner-lcd" style="left:44px;top:76px;">32,<span id="rechner-per">33</span></div></div>
      ${B.html}`, p),
    `      tl.fromTo("#rechner-c", { scale: 0.92, rotation: 3 }, { scale: 1, rotation: 0, duration: 0.35, ease: "back.out(2.2)" }, 0);
${keys.map((k, i) => `      tl.to("#rechner-k${k}", { keyframes: { scale: [1, 0.82, 1] }, transformOrigin: "50% 50%", duration: 0.14, ease: "none" }, ${f2(0.15 + i * 0.12)});`).join("\n")}
      tl.to("#rechner-lcd", { keyframes: { opacity: [1, 0.25, 1, 0.25, 1] }, duration: 0.4, ease: "none" }, 1.05);
${B.js(1.05)}
${shake("#rechner-c", 1.05, 8, 0.35)}
      tl.to("#rechner-c", { keyframes: { scaleY: [1, 1.03, 1] }, duration: 0.4, ease: "sine.inOut", repeat: 1 }, 1.5);`));
}

// ================= KOPFHOERER: the hero (LEEROY) with headphones chews, music notes; the group talks to him in vain (c07) =================
{
  const p = "kopfhoerer";
  const [s, d] = S(p);
  scenes.push(scene(p, "Held mit Kopfhoerer", s, d,
    `#kopfhoerer-h{${abs(560, 860, 252, 288)}transform-origin:50% 100%;}
     #kopfhoerer-ph{${abs(576, 836, 220, 168)}transform-origin:50% 100%;}
     #kopfhoerer-m{${abs(668, 952, 36, 14)}background:#3A0A0A;transform-origin:50% 0%;}
     .kopfhoerer-n{position:absolute;width:60px;height:82px;}
     .kopfhoerer-fg{position:absolute;top:1010px;width:126px;height:144px;transform-origin:50% 100%;}
     #kopfhoerer-bb{${abs(150, 790, 300, 250)}transform-origin:30% 100%;}
     #kopfhoerer-dt{${abs(0, 48, 300, 110)}${LBL(110, "#fff")}}`,
    stk(`      <div id="kopfhoerer-bb">${SBUB(false)}<div id="kopfhoerer-dt">...</div></div>
${[0, 1, 2].map((i) => `      <div id="kopfhoerer-f${i}" class="kopfhoerer-fg STKC" style="left:${120 + i * 112}px;">${FIGS(MATES[i])}</div>`).join("\n")}
      <div id="kopfhoerer-hb" style="position:absolute;inset:0;"><div id="kopfhoerer-h" class="STKC">${FIGS(HPAL(), true)}</div>
      <div id="kopfhoerer-m"></div>
      <div id="kopfhoerer-ph" class="STKC">${PHONES()}</div></div>
      <div id="kopfhoerer-n0" class="kopfhoerer-n STKC" style="left:850px;top:860px;">${NOTE(YEL)}</div>
      <div id="kopfhoerer-n1" class="kopfhoerer-n STKC" style="left:880px;top:1010px;">${NOTE("#9FD3FF")}</div>
${plate("kopfhoerer-pl", 536, 1190, 300, 100, "LEEROY", 80, YEL, K)}`, p),
    `      tl.fromTo("#kopfhoerer-bb", { scale: 0.75 }, { scale: 1, duration: 0.3, ease: "back.out(2.4)" }, 0);
      tl.to("#kopfhoerer-dt", { keyframes: { x: [0, 6, -6, 0] }, duration: 0.5, ease: "none", repeat: 3 }, 0.3);
      // chewing: the mouth opens and closes, the head nods to the music
      tl.to("#kopfhoerer-m", { keyframes: { scaleY: [1, 0.2, 1] }, duration: 0.24, ease: "none", repeat: 8 }, 0);
      tl.to("#kopfhoerer-hb", { keyframes: { y: [0, 8, 0] }, duration: 0.48, ease: "sine.inOut", repeat: 4 }, 0);
      tl.to("#kopfhoerer-ph", { keyframes: { rotation: [0, -3, 0, 3, 0] }, duration: 0.96, ease: "sine.inOut", repeat: 1 }, 0);
      tl.to("#kopfhoerer-n0", { keyframes: { y: [0, -50, 0], rotation: [0, 14, 0] }, duration: 1.1, ease: "sine.inOut", repeat: 1 }, 0);
      tl.to("#kopfhoerer-n1", { keyframes: { y: [0, -60, 0], rotation: [0, -14, 0] }, duration: 1.1, ease: "sine.inOut", repeat: 1 }, 0.3);
${[0, 1, 2].map((i) => `      tl.to("#kopfhoerer-f${i}", { keyframes: { y: [0, -14, 0] }, duration: 0.3, ease: "power1.out", repeat: 2, repeatDelay: 0.25 }, ${f2(0.1 + i * 0.12)});`).join("\n")}
      tl.fromTo("#kopfhoerer-pl", { rotation: -5 }, { keyframes: { rotation: [-5, 4, -2, 1, 0] }, duration: 1.0, ease: "sine.out" }, 0.05);`));
}

// ================= KEULE: a big chicken leg with steam, the hero walks back in; a bite (c08) =================
{
  const p = "keule";
  const [s, d] = S(p);
  const B = burst("keule-s", 6, 700, 1000, 40, 150, 2005, [MEAT_L, "#fff"]);
  scenes.push(scene(p, "Huehnchenkeule", s, d,
    `#keule-lg{${abs(330, 820, 420, 420)}transform-origin:50% 60%;}
     .keule-lv{position:absolute;inset:0;}
     .keule-st{position:absolute;top:700px;width:50px;height:100px;transform-origin:50% 100%;}
     #keule-h{${abs(130, 1180, 140, 160)}transform-origin:50% 100%;}`,
    stk(`${[470, 550, 630].map((x, i) => `      <div id="keule-st${i}" class="keule-st" style="left:${x}px;">${STEAM()}</div>`).join("\n")}
      <div id="keule-lg" class="STKC"><div id="keule-l0" class="keule-lv">${LEG(false)}</div><div id="keule-l1" class="keule-lv" style="opacity:0;">${LEG(true)}</div></div>
      ${B.html}
      <div id="keule-h" class="STKC">${FIG("keule-hf", HPAL())}</div>`, p),
    `      tl.fromTo("#keule-lg", { scale: 0.85, rotation: -20 }, { scale: 1, rotation: -8, duration: 0.4, ease: "back.out(2)" }, 0);
      tl.to("#keule-lg", { keyframes: { rotation: [-8, 4, -8] }, duration: 1.0, ease: "sine.inOut" }, 0.4);
${[0, 1, 2].map((i) => `      tl.fromTo("#keule-st${i}", { y: 0, opacity: 0.9, scaleY: 0.8 }, { keyframes: { y: [0, -30, 0], opacity: [0.9, 0.5, 0.9], scaleY: [0.8, 1.1, 0.8] }, duration: 0.8, ease: "sine.inOut", repeat: 2 }, ${f2(i * 0.2)});`).join("\n")}
      // the bite
      tl.set("#keule-l0", { opacity: 0 }, 1.05); tl.set("#keule-l1", { opacity: 1 }, 1.05);
${B.js(1.05)}
${shake("#keule-lg", 1.05, 8, 0.3)}
      // the hero walks back in
      tl.fromTo("#keule-h", { x: 0 }, { x: 120, duration: 1.8, ease: "none" }, 0);
      tl.to("#keule-h", { keyframes: { y: [0, -10, 0] }, duration: 0.24, ease: "sine.inOut", repeat: 7 }, 0);
${runLegs("keule-hf", 0, 1.9, 0.12)}`));
}

// ================= SCHREI: the hero charges, a jagged shout bubble with the battle cry in an own pixel font (c09) =================
{
  const p = "schrei";
  const [s, d] = S(p);
  scenes.push(scene(p, "Schlachtruf", s, d,
    `#schrei-bb{${abs(150, 720, 780, 330)}transform-origin:30% 100%;}
     #schrei-t1{${abs(312, 780, 455, 91)}} #schrei-t2{${abs(234, 890, 611, 91)}}
     #schrei-h{${abs(370, 1110, 224, 256)}transform-origin:50% 100%;}
     .schrei-sp{position:absolute;height:14px;border-radius:7px;background:#E9E6F5;}
     .schrei-pf{position:absolute;width:100px;height:80px;}`,
    stk(`      <div id="schrei-bb" class="STKC">${SHOUT()}</div>
      <div id="schrei-t1">${PTXT("LEEROY")}</div>
      <div id="schrei-t2">${PTXT("JENKINS!")}</div>
${[[140, 1170, 170], [180, 1230, 150], [130, 1300, 190]].map(([x, y, w], i) => `      <div id="schrei-sp${i}" class="schrei-sp" style="left:${x}px;top:${y}px;width:${w}px;"></div>`).join("\n")}
${[[250, 1290], [180, 1250]].map(([x, y], i) => `      <div id="schrei-pf${i}" class="schrei-pf" style="left:${x}px;top:${y}px;">${PUFF()}</div>`).join("\n")}
      <div id="schrei-h" class="STKC">${FIG("schrei-hf", HPAL())}</div>`, p),
    `      tl.fromTo("#schrei-bb", { scale: 0.8, rotation: -4 }, { scale: 1, rotation: 0, duration: 0.25, ease: "back.out(2.6)" }, 0);
      tl.fromTo(["#schrei-t1", "#schrei-t2"], { scale: 0.8 }, { scale: 1, duration: 0.25, ease: "back.out(2.6)" }, 0.02);
      tl.to(["#schrei-bb", "#schrei-t1", "#schrei-t2"], { keyframes: { x: [0, -6, 6, -4, 4, 0], y: [0, 3, -3, 2, 0, 0] }, duration: 0.3, ease: "none", repeat: 4 }, 0.3);
      tl.to("#schrei-h", { keyframes: { x: [0, 40, 20, 40, 0], y: [0, -16, 0, -16, 0], rotation: [0, 6, 0, 6, 0] }, duration: 0.9, ease: "sine.inOut", repeat: 1 }, 0);
${[0, 1, 2].map((i) => `      tl.fromTo("#schrei-sp${i}", { x: 0, scaleX: 1 }, { keyframes: { x: [0, -30, 0], scaleX: [1, 0.6, 1] }, duration: 0.3, ease: "none", repeat: 5 }, ${f2(i * 0.08)});`).join("\n")}
${[0, 1].map((i) => `      tl.to("#schrei-pf${i}", { keyframes: { scale: [1, 1.2, 1], x: [0, -16, 0] }, duration: 0.4, ease: "sine.inOut", repeat: 3 }, ${f2(i * 0.15)});`).join("\n")}
${runLegs("schrei-hf", 0, 1.95, 0.09)}`));
}

// ================= HINTERHER: the group runs after him, panic "!" and sweat drops, label GRUPPE (c10) =================
{
  const p = "hinterher";
  const [s, d] = S(p);
  const X = [150, 340, 530, 720];
  const DROP = () => `<svg viewBox="0 0 40 56" width="100%" height="100%" overflow="visible"><path d="M20 2 Q38 30 34 40 Q28 54 20 54 Q12 54 6 40 Q2 30 20 2 Z" fill="#9FD3FF" stroke="#2A4A7A" stroke-width="4"/></svg>`;
  scenes.push(scene(p, "Gruppe rennt hinterher", s, d,
    `.hinterher-fg{position:absolute;top:1060px;width:154px;height:176px;transform-origin:50% 100%;}
     .hinterher-bg{position:absolute;top:960px;width:30px;height:70px;transform-origin:50% 100%;}
     .hinterher-dr{position:absolute;top:1060px;width:28px;height:40px;}
     .hinterher-pf{position:absolute;top:1190px;width:80px;height:64px;}`,
    stk(`${plate("hinterher-pl", 390, 770, 300, 100, "GRUPPE", 80, CREAM, K)}
${X.map((x, i) => `      <div id="hinterher-pf${i}" class="hinterher-pf" style="left:${x - 40}px;">${PUFF()}</div>
      <div id="hinterher-f${i}" class="hinterher-fg STKC" style="left:${x}px;">${FIG("hinterher-g" + i, MATES[i], true)}</div>
      <div id="hinterher-b${i}" class="hinterher-bg STKC" style="left:${x + 62}px;">${BANG()}</div>
      <div id="hinterher-d${i}" class="hinterher-dr" style="left:${x + 132}px;">${DROP()}</div>`).join("\n")}`, p),
    `${X.map((_, i) => `      tl.to("#hinterher-f${i}", { keyframes: { y: [0, -18, 0], rotation: [0, 5, 0] }, duration: 0.24, ease: "sine.inOut", repeat: 7 }, ${f2(i * 0.06)});
      tl.fromTo("#hinterher-b${i}", { scaleY: 0.6 }, { keyframes: { scaleY: [0.6, 1.2, 1] }, duration: 0.25, ease: "power2.out" }, ${f2(0.1 + i * 0.1)});
      tl.to("#hinterher-b${i}", { keyframes: { rotation: [0, -10, 10, 0] }, duration: 0.4, ease: "none", repeat: 2 }, ${f2(0.4 + i * 0.1)});
      tl.fromTo("#hinterher-d${i}", { y: 0, opacity: 1 }, { keyframes: { y: [0, 40], opacity: [1, 0] }, duration: 0.5, ease: "power1.in", repeat: 2 }, ${f2(0.2 + i * 0.12)});
      tl.to("#hinterher-pf${i}", { keyframes: { scale: [1, 1.2, 1], x: [0, -10, 0] }, duration: 0.4, ease: "sine.inOut", repeat: 3 }, ${f2(i * 0.1)});
${runLegs("hinterher-g" + i, f2(i * 0.03), 1.9, 0.1)}`).join("\n")}
      tl.fromTo("#hinterher-pl", { rotation: 5 }, { keyframes: { rotation: [5, -4, 2, -1, 0] }, duration: 1.0, ease: "sine.out" }, 0.05);`));
}

// ================= KO: comic tombstones, little baby dragons dance on top (c11); Klotz runs off with "KLOTZ!" =================
{
  const p = "ko";
  const [s, d] = S(p);
  const TX = [140, 340, 580, 790];
  const DX = [[250, GREEN, PURP], [470, PURP, GREEN], [680, "#FF9F1C", BLUE]];
  scenes.push(scene(p, "Grabsteine und Drachen", s, d,
    `.ko-tb{position:absolute;top:1050px;width:160px;height:210px;transform-origin:50% 100%;}
     .ko-dr{position:absolute;top:900px;width:140px;height:110px;transform-origin:50% 100%;}
     .ko-ht{position:absolute;top:770px;width:56px;height:48px;}`,
    stk(`${TX.map((x, i) => `      <div id="ko-t${i}" class="ko-tb STKC" style="left:${x}px;">${TOMB()}</div>`).join("\n")}
${DX.map(([x, g, v], i) => `      <div id="ko-d${i}" class="ko-dr STKC" style="left:${x}px;">${DRAGON(g, v)}</div>`).join("\n")}
${[[300, 0], [560, 1], [800, 2]].map(([x], i) => `      <div id="ko-h${i}" class="ko-ht" style="left:${x}px;">${HEART()}</div>`).join("\n")}`, p),
    `${TX.map((_, i) => `      tl.fromTo("#ko-t${i}", { scaleY: 0.6 }, { scaleY: 1, duration: 0.25, ease: "back.out(2.6)" }, ${f2(i * 0.08)});`).join("\n")}
${DX.map((_, i) => `      tl.to("#ko-d${i}", { keyframes: { y: [0, -40, 0], scaleX: [1, 1, -1], rotation: [0, ${i % 2 ? -10 : 10}, 0] }, duration: 0.4, ease: "power1.inOut", repeat: 3 }, ${f2(0.1 + i * 0.13)});`).join("\n")}
${[0, 1, 2].map((i) => `      tl.fromTo("#ko-h${i}", { y: 0, scale: 0.6, opacity: 1 }, { keyframes: { y: [0, -20, 0], scale: [0.6, 1.1, 1] }, duration: 0.6, ease: "sine.inOut", repeat: 2 }, ${f2(0.2 + i * 0.15)});`).join("\n")}`));
}

// ================= MEME: one screen multiplies into nine, hearts and share icons pop (c12) =================
{
  const p = "meme";
  const [s, d] = S(p);
  const M = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) M.push([186 + c * 244, 750 + r * 203]);
  const ICONS = [[392, 920, "h"], [636, 920, "s"], [392, 1123, "s"], [636, 1123, "h"], [880, 860, "h"], [150, 1290, "s"], [880, 1290, "h"]];
  scenes.push(scene(p, "Bildschirme vervielfachen sich", s, d,
    `.meme-mn{position:absolute;width:220px;height:183px;transform-origin:50% 50%;}
     .meme-ic{position:absolute;width:64px;height:58px;transform-origin:50% 50%;}`,
    stk(`${M.map(([x, y], i) => `      <div id="meme-m${i}" class="meme-mn STKC" style="left:${x}px;top:${y}px;">${MONITOR("meme-m" + i)}</div>`).join("\n")}
${ICONS.map(([x, y, k], i) => `      <div id="meme-i${i}" class="meme-ic STKC" style="left:${x - 32}px;top:${y - 29}px;">${k === "h" ? HEART() : SHARE()}</div>`).join("\n")}`, p),
    `      // the center screen fills the picture at the cut, then shrinks while the copies pop in
      tl.fromTo("#meme-m4", { scale: 2.1 }, { scale: 1, duration: 0.35, ease: "power3.inOut" }, 0.15);
${M.map((_, i) => i === 4 ? "" : `      tl.fromTo("#meme-m${i}", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25, ease: "back.out(2.4)", immediateRender: true }, ${f2(0.45 + ((i * 5) % 8) * 0.07)});`).join("\n")}
${ICONS.map((_, i) => `      tl.fromTo("#meme-i${i}", { scale: 0, opacity: 0 }, { keyframes: { scale: [0, 1.25, 1], opacity: [0, 1, 1] }, duration: 0.3, ease: "power2.out", immediateRender: true }, ${f2(1.0 + i * 0.08)});
      tl.to("#meme-i${i}", { keyframes: { y: [0, -14, 0] }, duration: 0.4, ease: "sine.inOut", repeat: 1 }, ${f2(1.3 + i * 0.08)});`).join("\n")}`));
}

// ================= QUIZ: generic quiz board (no logo), label TV-QUIZ, a card flips and shows the pixel hero (c13) =================
{
  const p = "quiz";
  const [s, d] = S(p);
  const cells = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) cells.push([159 + c * 194, 850 + r * 134, r, c]);
  const HIT = 6;
  scenes.push(scene(p, "Quiz-Tafel", s, d,
    `#quiz-fr{${abs(139, 830, 802, 428)}background:#0B1024;border:8px solid ${K};border-radius:20px;}
     .quiz-c{position:absolute;width:180px;height:120px;background:${BLUE_D};border:6px solid ${K};border-radius:10px;transform-origin:50% 50%;}
     .quiz-q{position:absolute;left:0;top:14px;width:100%;${LBL(84, YEL)}-webkit-text-stroke:8px ${K};paint-order:stroke fill;}
     #quiz-hero{position:absolute;left:58px;top:8px;width:56px;height:96px;opacity:0;}`,
    stk(`${plate("quiz-pl", 360, 718, 360, 100, "TV-QUIZ", 80, YEL, K)}
      <div id="quiz-fr" class="STKC"></div>
${cells.map(([x, y], i) => `      <div id="quiz-c${i}" class="quiz-c" style="left:${x}px;top:${y}px;"><div id="quiz-q${i}" class="quiz-q">?</div>${i === HIT ? `<div id="quiz-hero">${FIGS(HPAL(), false)}</div>` : ""}</div>`).join("\n")}`, p),
    `      tl.fromTo("#quiz-fr", { scale: 0.95 }, { scale: 1, duration: 0.3, ease: "back.out(2)" }, 0);
${cells.map(([, , r, c], i) => `      tl.to("#quiz-q${i}", { keyframes: { scale: [1, 1.2, 1] }, duration: 0.3, ease: "sine.inOut" }, ${f2(0.15 + (r + c) * 0.08)});`).join("\n")}
      // one card flips: "?" -> pixel hero
      tl.to("#quiz-c${HIT}", { keyframes: { scaleX: [1, 0, 1], scale: [1, 1.1, 1.1] }, duration: 0.36, ease: "none" }, 0.8);
      tl.set("#quiz-q${HIT}", { opacity: 0 }, 0.98); tl.set("#quiz-hero", { opacity: 1 }, 0.98);
      tl.to("#quiz-c${HIT}", { keyframes: { y: [0, -12, 0] }, duration: 0.4, ease: "sine.inOut", repeat: 1 }, 1.2);
      tl.fromTo("#quiz-pl", { rotation: -4 }, { keyframes: { rotation: [-4, 3, -1, 0] }, duration: 0.9, ease: "sine.out" }, 0.05);`));
}

// ================= VORHANG: closed stage curtain with a spotlight and a big "?" (c14) =================
{
  const p = "vorhang";
  const [s, d] = S(p);
  scenes.push(scene(p, "Vorhang mit Fragezeichen", s, d,
    `#vorhang-cv{${abs(120, 740, 840, 620)}}
     #vorhang-sp{${abs(330, 800, 420, 520)}background:radial-gradient(ellipse at 50% 70%,rgba(255,229,138,.45) 0%,rgba(255,229,138,0) 65%);}
     #vorhang-q{${abs(440, 880, 200, 260)}${LBL(240, YEL)}-webkit-text-stroke:16px ${K};paint-order:stroke fill;transform-origin:50% 90%;}`,
    stk(`      <div id="vorhang-cv" class="STKC">${CURT("vorhang-c")}</div>
      <div id="vorhang-sp"></div>
      <div id="vorhang-q">?</div>`, p),
    `      gsap.set("#vorhang-c-l", { svgOrigin: "10 40" }); gsap.set("#vorhang-c-r", { svgOrigin: "830 40" });
      tl.to("#vorhang-c-l", { keyframes: { scaleX: [1, 0.94, 1, 0.97, 1] }, duration: 1.2, ease: "sine.inOut" }, 0.1);
      tl.to("#vorhang-c-r", { keyframes: { scaleX: [1, 0.96, 1, 0.94, 1] }, duration: 1.2, ease: "sine.inOut" }, 0.2);
      tl.fromTo("#vorhang-q", { scale: 0.7, rotation: -10 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2.6)" }, 0);
      tl.to("#vorhang-q", { keyframes: { rotation: [0, 8, -6, 4, 0] }, duration: 1.0, ease: "sine.inOut" }, 0.4);
      tl.to("#vorhang-sp", { keyframes: { opacity: [1, 0.6, 1] }, duration: 0.7, ease: "sine.inOut", repeat: 1 }, 0);`));
}

// ================= KLAPPE: film clapperboard snaps shut, sparks, shake (c15, punchline INSZENIERT) =================
{
  const p = "klappe";
  const [s, d] = S(p);
  const B = burst("klappe-s", 10, 540, 1110, 56, 250, 2005);
  scenes.push(scene(p, "Filmklappe", s, d,
    `#klappe-sl{${abs(240, 920, 600, 420)}}
     #klappe-arm{${abs(240, 812, 600, 110)}transform-origin:44px 55px;}`,
    stk(`      <div id="klappe-sl" class="STKC">${SLATE()}</div>
      <div id="klappe-arm" class="STKC">${ARM()}</div>
      ${B.html}`, p),
    `      // open at the cut, SNAP shut, open a little and snap again
      tl.fromTo("#klappe-arm", { rotation: -14 }, { rotation: 0, duration: 0.18, ease: "power4.in", immediateRender: true }, 0.12);
${B.js(0.3)}
${shake("#klappe-kb", 0.3, 14, 0.4)}
      tl.to("#klappe-arm", { keyframes: { rotation: [0, -10, 0] }, duration: 0.4, ease: "power2.inOut" }, 1.3);
      tl.to("#klappe-sl", { keyframes: { scale: [1, 1.04, 1] }, duration: 0.2, ease: "none" }, 1.7);`));
}

// ================= POKAL: trophy with the pixel hero on top, pixel confetti (c16) =================
{
  const p = "pokal";
  const [s, d] = S(p);
  const RS = mulberry32(3233);
  const conf = Array.from({ length: 16 }, (_, i) => ({ x: Math.round(130 + RS() * 800), c: [YEL, RED, GREEN, BLUE, PURP, "#fff"][i % 6], t: f2(RS() * 1.0), r: Math.round(RS() * 360) }));
  scenes.push(scene(p, "Pokal", s, d,
    `#pokal-cup{${abs(330, 860, 420, 460)}transform-origin:50% 100%;}
     #pokal-h{${abs(477, 722, 126, 144)}transform-origin:50% 100%;}
     .pokal-cf{position:absolute;top:730px;width:22px;height:22px;border:4px solid ${K};}`,
    stk(`      <div id="pokal-cup" class="STKC">${CUP()}</div>
      <div id="pokal-h" class="STKC">${FIG("pokal-hf", HPAL())}</div>
${conf.map((c, i) => `      <div id="pokal-c${i}" class="pokal-cf" style="left:${c.x}px;background:${c.c};"></div>`).join("\n")}`, p),
    `      tl.fromTo("#pokal-cup", { scale: 0.85 }, { scale: 1, duration: 0.35, ease: "back.out(2.2)" }, 0);
      tl.to("#pokal-h", { keyframes: { y: [0, -28, 0], rotation: [0, -6, 0] }, duration: 0.45, ease: "power1.out", repeat: 3, repeatDelay: 0.1 }, 0.1);
      tl.to("#pokal-cup", { keyframes: { rotation: [0, 2, -2, 0] }, duration: 0.8, ease: "sine.inOut", repeat: 2 }, 0.4);
${conf.map((c, i) => `      tl.fromTo("#pokal-c${i}", { y: 0, rotation: ${c.r}, opacity: 1 }, { keyframes: { y: [0, 620], rotation: [${c.r}, ${c.r + 360}], opacity: [1, 1, 1, 0] }, duration: 1.4, ease: "none", immediateRender: true }, ${c.t});`).join("\n")}`));
}

// ================= FRAGE + loop: pixel comment bubble with a bitten chicken leg and "?", then the hook picture again (c17 + c18) =================
{
  const p = "frage";
  const [s, d] = S(p);
  const LOOP = f2(C.c18[0] - s);
  const hookIds = ["#frage-glow", "#frage-fl", "#frage-hero", "#frage-bang", ...EGGS.map((_, i) => `#frage-e${i}`), ...PUFFS.map((_, i) => `#frage-pf${i}`)];
  scenes.push(scene(p, "Frage und Loop", s, d, hookCss(p) + `
     #frage-bb{${abs(150, 740, 780, 480)}transform-origin:80% 100%;}
     #frage-lg{${abs(250, 800, 300, 300)}transform-origin:50% 60%;}
     #frage-q{${abs(600, 790, 220, 280)}${LBL(240, YEL)}-webkit-text-stroke:16px ${K};paint-order:stroke fill;transform-origin:50% 90%;}`,
    hookBody(p) + `
      <div id="frage-bb" class="frage-stk">${PBUB()}</div>
      <div id="frage-lg">${LEG(true)}</div>
      <div id="frage-q">?</div>`,
    `      gsap.set([${hookIds.map((x) => `"${x}"`).join(", ")}], { opacity: 0 });
      tl.fromTo("#frage-bb", { scale: 0.85, rotation: -3 }, { scale: 1, rotation: 0, duration: 0.35, ease: "back.out(2)" }, 0);
      tl.fromTo("#frage-lg", { scale: 0.7, rotation: -20 }, { scale: 1, rotation: -6, duration: 0.3, ease: "back.out(2.6)" }, 0.1);
      tl.fromTo("#frage-q", { scale: 0.6, rotation: 20 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2.6)" }, 0.2);
      tl.to("#frage-q", { keyframes: { rotation: [0, -8, 6, -4, 0] }, duration: 0.9, ease: "sine.inOut", repeat: 1 }, 0.5);
      tl.to("#frage-lg", { keyframes: { rotation: [-6, 4, -6] }, duration: 0.8, ease: "sine.inOut", repeat: 1 }, 0.5);
      // loop (${LOOP}): hard switch in one frame - bubble gone, hook picture in its frame-0 pose
      tl.set(["#frage-bb", "#frage-lg", "#frage-q"], { opacity: 0 }, ${LOOP});
      tl.set([${hookIds.map((x) => `"${x}"`).join(", ")}], { opacity: 1 }, ${LOOP});
${hookIdle(p, LOOP, f2(d - LOOP))}`,
    { exit: false, kb: false }));
}

// ================= background: night blue dungeon, faint brick wall, pixel embers drifting up, stone floor (all loop-seamless) =================
{
  const RS = mulberry32(2005);
  const cols = [FLAME, YEL, PURP, "#fff"];
  const sq = (n, minS, maxS, op) => Array.from({ length: n }, () => ({ x: Math.round(40 + RS() * 1000), y: Math.round(RS() * 1920), s: Math.round(minS + RS() * (maxS - minS)), c: cols[Math.floor(RS() * cols.length)], o: +(op * (0.6 + RS() * 0.4)).toFixed(2) }));
  const far = sq(22, 8, 14, 0.3), near = sq(12, 14, 22, 0.38);
  const tile = (fl, k) => fl.map((f) => `<rect x="${f.x}" y="${f.y + k * 1920}" width="${f.s}" height="${f.s}" fill="${f.c}" opacity="${f.o}"/>`).join("");
  let bricks = "";
  for (let r = 0; r < 30; r++) for (let c = -1; c < 14; c++) { const x = c * 84 + (r % 2 ? 42 : 0), y = 80 + r * 46; if ((r * 13 + c * 7) % 5 === 0) bricks += `<rect x="${x}" y="${y}" width="80" height="42" fill="#172056" opacity=".55"/>`; }
  fs.writeFileSync(path.join(OUT, "compositions", "bg.html"), `<template>
  <style>
    #root { position: absolute; inset: 0; overflow: hidden; background: #0E1530; }
    #bg-sky { position: absolute; inset: 0; background: linear-gradient(180deg, #0B1230 0%, #0E1530 45%, #161D4A 78%, #1C2356 100%); }
    #bg-wall { position: absolute; left: 0; top: 0; }
    #bg-glow { position: absolute; left: 140px; top: 640px; width: 800px; height: 800px; border-radius: 50%; background: radial-gradient(circle, rgba(255,159,28,.08) 0%, rgba(255,159,28,0) 65%); }
    #bg-floor { position: absolute; left: 0; top: 1500px; }
    .bg-px { position: absolute; left: 0; top: 0; }
  </style>
  <div id="root" data-composition-id="bg" data-width="1080" data-height="1920" data-layout-allow-overflow>
    <div id="bg-sky"></div>
    <svg id="bg-wall" width="1080" height="1500" shape-rendering="crispEdges">${bricks}</svg>
    <div id="bg-glow"></div>
    <svg id="bg-floor" width="1080" height="420" viewBox="0 0 1080 420" shape-rendering="crispEdges"><rect x="0" y="40" width="1080" height="380" fill="#141B42"/>${Array.from({ length: 6 }, (_, r) => Array.from({ length: 15 }, (_, c) => `<rect x="${c * 80 - (r % 2 ? 40 : 0) + 3}" y="${48 + r * 60}" width="74" height="54" fill="${["#1B2352", "#202A60", "#182049"][(r + c) % 3]}"/>`).join("")).join("")}<path d="M0 40 H1080" stroke="#2B3770" stroke-width="8"/></svg>
    <svg id="bg-p1" class="bg-px" width="1080" height="3840" shape-rendering="crispEdges">${tile(far, 0)}${tile(far, 1)}</svg>
    <svg id="bg-p2" class="bg-px" width="1080" height="5760" shape-rendering="crispEdges">${tile(near, 0)}${tile(near, 1)}${tile(near, 2)}</svg>
  </div>
  <script>
    (function () {
      const tl = gsap.timeline({ paused: true });
      // every move covers whole periods, so the last frame leads straight back into frame 0 (embers rise: start one tile down)
      tl.fromTo("#bg-p1", { y: -1920 }, { y: 0, duration: ${LAST}, ease: "none" }, 0);
      tl.fromTo("#bg-p2", { y: -3840 }, { y: 0, duration: ${LAST}, ease: "none" }, 0);
      tl.fromTo("#bg-glow", { opacity: 1 }, { keyframes: { opacity: [1, 0.6, 1] }, duration: ${(LAST / 4).toFixed(5)}, ease: "sine.inOut", repeat: 3 }, 0);
      window.__timelines["bg"] = tl;
    })();
  </script>
</template>
`);
}

// ================= captions =================
// "*" keyword (yellow Lilita, 140 px), "!" punchline (largest, 160 px). "/" line break.
// "+" glues a word to the one before (no gap): counted as one word.
// Fixed word gap: every word has 11 px margins. No negative letter spacing anywhere.
const HOOKW = ["Ein", "Typ", "/", "ruiniert", "*ALLES."];
const caps = [
  { id: "c01", words: HOOKW, still: true },
  { id: "c02", words: ["Mit", "nur", "/", "zwei", "Wörtern."] },
  { id: "c03", words: ["*2005.", "Ein", "/", "Rollenspiel", "/", "im", "Internet."] },
  { id: "c04", words: ["Eine", "Gruppe", "plant", "/", "den", "Angriff."] },
  { id: "c05", words: ["Ganz", "genau.", "/", "Mit", "Strategie."] },
  { id: "c06", words: ["Chance", "laut", "/", "Rechnung:", "/", "*32,33", "*%"] },
  { id: "c07", words: ["Nur", "einer", "/", "hört", "nicht", "zu."] },
  { id: "c08", words: ["Er", "kommt", "zurück", "/", "vom", "Essen …"] },
  { id: "c09", words: ["und", "rennt", "/", "einfach", "*LOS."], shake: true },
  { id: "c10", words: ["Die", "Gruppe", "/", "rennt", "hinterher."] },
  { id: "c11", words: ["Ergebnis:", "/", "alle", "*K.O."], shake: true },
  { id: "c12", words: ["Das", "Video", "wird", "/", "zum", "*MEME."] },
  { id: "c13", words: ["Sogar", "„Jeopardy!“", "/", "fragt", "danach."] },
  { id: "c14", words: ["Und", "die", "Wahrheit?"] },
  { id: "c15", words: ["!INSZENIERT", "/", "war", "alles."], shake: true },
  { id: "c16", words: ["Trotzdem", "/", "feierte", "ihn", "/", "die", "Spielefirma."] },
  { id: "c17", words: ["Rennst", "du", "auch", "/", "mal", "einfach", "los?"], hard: true },
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
  const kind = (w) => (w === "/" ? "br" : "*!".includes(core(w)[0]) && core(w).length > 1 ? core(w)[0] : "");
  const spans = c.words.map((w, i) => {
    const k = kind(w);
    if (k === "br") return `<br/>`;
    const txt = (k ? core(w).slice(1) : core(w)).replace(/</g, "&lt;");
    const nx = c.words[i + 1] === "/" ? c.words[i + 2] : c.words[i + 1];
    const gl = [glue(w) ? "gl" : "", nx && glue(nx) ? "gr" : ""].filter(Boolean).join(" ");
    const cls = { "*": "w kw", "!": "w pt", "": "w" }[k] + (gl ? " " + gl : "");
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
      if (k) capJs += `      tl.to("#${c.id}-w${i}", { keyframes: { scale: [1, 1.06, 1], rotation: [0, -3, 0] }, duration: 0.4, ease: "power1.inOut" }, 0.3);\n`;
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
      font-size: 92px; line-height: 1.12; color: #fff; letter-spacing: 0; word-spacing: 0; }
    .w { display: inline-block; margin: 0 11px; -webkit-text-stroke: 16px ${K}; paint-order: stroke fill; text-shadow: 0 9px 0 #050814; }
    .w.gl { margin-left: 0; } .w.gr { margin-right: 0; }
    .g { display: inline-block; }
    .kw { font-family: 'Lilita One'; font-weight: 400; color: ${YEL}; font-size: 140px; line-height: 1.0; text-transform: uppercase; letter-spacing: 0.02em; }
    .pt { font-family: 'Lilita One'; font-weight: 400; color: ${YEL}; font-size: 160px; line-height: 1.0; letter-spacing: 0.02em; -webkit-text-stroke: 22px ${K}; text-shadow: 0 12px 0 #050814; }
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

// ================= Klotz (rig from Folge 1-9; new gag: notepad + pencil, runs off himself shouting "KLOTZ!", chicken leg + wink) =================
// eyes always open: no mood closes the lids; the only lid move is the one-eye wink at the end. The right arm never points outward to the right.
// While he holds the notepad or the chicken leg the left arm stays at 70 deg (the hand next to the prop).
const M = {
  shock:      { eye: 1.12, ps: 0.6, px: 0, py: 0, bL: -18, bR: -18, tL: -6, tR: -6, mx: 1, my: 1.1, g: 0, aL: 70, aR: -45 },
  surprised:  { eye: 1.08, ps: 0.8, px: 0, py: 6, bL: -16, bR: -16, tL: 0, tR: 0, mx: 0.55, my: 0.6, g: 0, aL: 55, aR: -45 },
  curious:    { eye: 1.05, ps: 1.1, px: -14, py: -10, bL: -18, bR: -4, tL: 0, tR: 0, mx: 0.5, my: 0.35, g: 0, aL: 40, aR: -40 },
  look:       { eye: 1.06, ps: 1.0, px: -14, py: -12, bL: -14, bR: -14, tL: -4, tR: -4, mx: 0.5, my: 0.5, g: 0, aL: 40, aR: -40 },
  notes:      { eye: 1.04, ps: 1.0, px: -16, py: 10, bL: -10, bR: -10, tL: -4, tR: -4, mx: 0.35, my: 0.3, g: 0, aL: 70, aR: -40 },
  impressed:  { eye: 1.05, ps: 0.9, px: -6, py: -4, bL: -12, bR: -12, tL: -4, tR: -4, mx: 0.45, my: 0.45, g: 0, aL: 40, aR: -40 },
  jawdrop:    { eye: 1.18, ps: 0.55, px: -6, py: -8, bL: -22, bR: -22, tL: -4, tR: -4, mx: 1.1, my: 1.7, jy: 14, g: 0, aL: 60, aR: -45 },
  happy:      { eye: 1.04, ps: 1, px: 0, py: 0, bL: -10, bR: -10, tL: -4, tR: -4, mx: 0, my: 0, g: 1, gs: 0.8, aL: 35, aR: -35 },
  eager:      { eye: 1.08, ps: 1.05, px: -10, py: -6, bL: -16, bR: -16, tL: -4, tR: -4, mx: 0, my: 0, g: 1, gs: 0.75, aL: 70, aR: -40 },
  yell:       { eye: 1.14, ps: 0.7, px: -18, py: 0, bL: -20, bR: -20, tL: 6, tR: 6, mx: 1.05, my: 1.3, g: 0, aL: 100, aR: -45 },
};
const LOOPK = C.c18[0];
const NOTE_ON = f2(C.c04[0] + 0.4), NOTE_OFF = f2(C.c06[0] + 0.3), RUN_T = f2(C.c11[0] + 0.35), LEG_ON = f2(C.c17[0] + 0.3), WINK_T = f2(C.c17[0] + 1.3);
const moods = [
  [C.c02[0], "curious"], [C.c03[0], "impressed"], [C.c04[0], "look"], [f2(NOTE_ON + 0.2), "notes"], [C.c05[0] + 1.2, "look"], [C.c06[0], "jawdrop"],
  [C.c07[0], "look"], [C.c08[0], "eager"], [C.c09[0], "shock"], [C.c10[0], "surprised"], [RUN_T, "yell"], [f2(RUN_T + 1.25), "happy"],
  [C.c12[0], "impressed"], [C.c13[0], "curious"], [C.c14[0], "curious"], [C.c15[0] + 0.1, "jawdrop"], [C.c16[0], "happy"], [C.c17[0], "eager"], [LOOPK + 0.08, "shock"],
];
const holding = (t) => (t >= NOTE_ON - 0.2 && t < NOTE_OFF) || (t >= LEG_ON - 0.2 && t < LOOPK);

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
      gsap.set("#k-mouth", { svgOrigin: "150 228" }); gsap.set("#k-grin", { svgOrigin: "150 230" });
      gsap.set(["#k-chkL", "#k-chkR"], { svgOrigin: "150 198" });
      gsap.set("#k-sweat", { svgOrigin: "262 92", opacity: 0, scale: 0 });
      gsap.set("#k-note", { opacity: 0, scale: 0, x: 0, y: 0, rotation: 0, transformOrigin: "80% 80%" });
      gsap.set("#k-pen", { rotation: 0, x: 0, y: 0, transformOrigin: "10% 90%" });
      gsap.set(["#k-ln0", "#k-ln1", "#k-ln2"], { scaleX: 0, transformOrigin: "0% 50%" });
      gsap.set("#k-shout", { opacity: 0, scale: 0.5, transformOrigin: "60% 100%" });
      gsap.set("#k-leg", { opacity: 0, scale: 0, rotation: 0, transformOrigin: "70% 80%" });
      gsap.set(["#k-eyeL", "#k-eyeR"], { scale: ${p0.eye} });
      gsap.set(["#k-pupL", "#k-pupR"], { x: 0, y: 0, scale: ${p0.ps} });
      gsap.set(["#k-lidL", "#k-lidR"], { scaleY: 0 });
      gsap.set("#k-browL", { y: ${p0.bL}, rotation: ${p0.tL} }); gsap.set("#k-browR", { y: ${p0.bR}, rotation: ${-p0.tR} });
      gsap.set("#k-mouth", { scaleX: ${p0.mx}, scaleY: ${p0.my}, y: 0, opacity: 1 }); gsap.set("#k-grin", { scale: 0.2, opacity: 0 });
      gsap.set("#k-armL", { rotation: ${p0.aL} }); gsap.set("#k-armR", { rotation: ${p0.aR} });
      gsap.set("#k-wrap", { x: 0, y: 0, rotation: 0, scale: 1 }); gsap.set("#k-sq", { scaleX: 1, scaleY: 1 });
      // idle bob: whole half-cycles over the film, ends where it starts
      tl.fromTo("#k-bob", { y: 0 }, { y: -12, duration: ${(LAST / 80).toFixed(5)}, ease: "sine.inOut", yoyo: true, repeat: 79 }, 0);
      // hook: shocked jump
      tl.to("#k-wrap", { keyframes: { y: [0, -18, 0, -8, 0] }, duration: 0.6, ease: "none" }, 0.3);
`;
for (const [t, m] of moods) {
  kJs += `      // ${m} @ ${f2(t)}\n`;
  kJs += `      tl.to("#k-sq", { keyframes: { scaleY: [1, 0.9, 1.06, 1], scaleX: [1, 1.07, 0.97, 1] }, duration: 0.3, ease: "none" }, ${f2(t - 0.05)});\n`;
  kJs += setMood(m, f2(t + 0.03), 0.22);
}
kJs += `      // GAG 1 (${NOTE_ON}): he listens at the strategy board and takes notes - notepad + pencil
      tl.to("#k-note", { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(2.6)" }, ${NOTE_ON});
${[0, 1, 2].map((i) => `      tl.to("#k-ln${i}", { scaleX: 1, duration: 0.4, ease: "none" }, ${f2(NOTE_ON + 0.5 + i * 0.6)});
      tl.to("#k-pen", { keyframes: { x: [0, 30, 0, 30, 0], y: [${i * 14}, ${i * 14 + 4}, ${i * 14}, ${i * 14 + 4}, ${i * 14 + 14}], rotation: [0, -8, 0, -8, 0] }, duration: 0.4, ease: "none" }, ${f2(NOTE_ON + 0.5 + i * 0.6)});`).join("\n")}
      tl.to("#k-wrap", { keyframes: { rotation: [0, -3, 0, -3, 0] }, duration: 1.2, ease: "sine.inOut" }, ${f2(NOTE_ON + 0.5)});
      tl.to("#k-note", { x: 80, scale: 0, opacity: 0, duration: 0.25, ease: "power2.in" }, ${NOTE_OFF});
      // GAG 2 (${RUN_T}): K.O. - he runs off himself, shouting "KLOTZ!", and comes straight back to his spot
      tl.to("#k-wrap", { keyframes: { x: [0, -250, -250, 0], rotation: [0, -10, -10, 0] }, duration: 1.2, ease: "power1.inOut" }, ${RUN_T});
      tl.to("#k-bob", { keyframes: { y: [0, -16, 0, -16, 0, -16, 0] }, duration: 0.6, ease: "none", repeat: 1 }, ${RUN_T});
      tl.to("#k-shout", { opacity: 1, scale: 1, duration: 0.18, ease: "back.out(3)" }, ${f2(RUN_T + 0.1)});
      tl.to("#k-shout", { keyframes: { rotation: [0, -4, 4, -2, 0] }, duration: 0.5, ease: "none" }, ${f2(RUN_T + 0.3)});
      tl.to("#k-shout", { opacity: 0, scale: 0.6, duration: 0.15, ease: "power2.in" }, ${f2(RUN_T + 0.95)});
      // c14: he leans forward (towards the truth) and back
      tl.to("#k-wrap", { keyframes: { rotation: [0, -9, -9, 0], y: [0, 4, 4, 0] }, duration: 1.3, ease: "power2.inOut" }, ${f2(C.c14[0] + 0.1)});
      // GAG 3 (${LEG_ON}): he holds a chicken leg, takes a bite and winks (one eye only)
      tl.to("#k-leg", { opacity: 1, scale: 1, rotation: -10, duration: 0.25, ease: "back.out(2.6)" }, ${LEG_ON});
      tl.to("#k-leg", { keyframes: { y: [0, -24, 0], rotation: [-10, 10, -10] }, duration: 0.4, ease: "sine.inOut" }, ${f2(LEG_ON + 0.4)});
      tl.to("#k-lidR", { keyframes: { scaleY: [0, 1, 1, 0] }, duration: 0.45, ease: "none" }, ${WINK_T});
      tl.to("#k-browR", { keyframes: { y: [-16, -4, -4, -16] }, duration: 0.45, ease: "none" }, ${WINK_T});
      tl.to("#k-sq", { keyframes: { scaleY: [1, 0.95, 1] }, duration: 0.3, ease: "none" }, ${WINK_T});
      tl.to("#k-leg", { keyframes: { rotation: [-10, -24, -10] }, duration: 0.5, ease: "sine.inOut" }, ${f2(WINK_T + 0.6)});
      // loop (${LOOPK}): leg off, frame-0 shock pose with the jump
      tl.set("#k-leg", { opacity: 0 }, ${LOOPK});
      tl.to("#k-wrap", { keyframes: { y: [0, -16, 0] }, duration: 0.3, ease: "none" }, ${f2(LOOPK + 0.05)});
`;
const NOTEPAD = () => `<svg viewBox="0 0 110 120" width="100%" height="100%" overflow="visible"><rect x="6" y="14" width="98" height="100" rx="8" fill="${CREAM}" stroke="${K}" stroke-width="6"/>${[0, 1, 2, 3, 4].map((i) => `<circle cx="${22 + i * 17}" cy="14" r="6" fill="${STONE_L}" stroke="${K}" stroke-width="3"/>`).join("")}
  ${[0, 1, 2].map((i) => `<rect id="k-ln${i}" x="20" y="${42 + i * 22}" width="${70 - i * 12}" height="8" rx="4" fill="${BLUE}"/>`).join("")}</svg>`;
const PENCIL = () => `<svg viewBox="0 0 30 110" width="100%" height="100%" overflow="visible"><g transform="rotate(30 15 55)"><rect x="6" y="8" width="18" height="78" fill="${YEL}" stroke="${K}" stroke-width="5"/><rect x="6" y="2" width="18" height="12" rx="3" fill="#FF8FA3" stroke="${K}" stroke-width="5"/><path d="M6 86 L15 106 L24 86 Z" fill="#F2C29A" stroke="${K}" stroke-width="5" stroke-linejoin="round"/></g></svg>`;
fs.writeFileSync(path.join(OUT, "compositions", "klotz.html"), `<template>
  <style>
    ${FONTFACE}
    #root { position: absolute; inset: 0; pointer-events: none; }
    #k-pod { position: absolute; left: 650px; top: 1748px; width: 350px; height: 120px; }
    #k-wrap { position: absolute; left: 700px; top: 1480px; width: 260px; height: 286px; transform-origin: 50% 100%; }
    #k-bob, #k-sq { position: absolute; inset: 0; transform-origin: 50% 100%; }
    #k-note { position: absolute; left: -100px; top: 120px; width: 110px; height: 120px; }
    #k-pen { position: absolute; left: 20px; top: -20px; width: 30px; height: 110px; }
    #k-shout { position: absolute; left: -30px; top: -150px; width: 300px; height: 120px; background: #fff; border: 8px solid ${K}; border-radius: 26px; }
    #k-shout-t { position: absolute; left: 0; top: 14px; width: 100%; ${LBL(80, RED)} }
    #k-leg { position: absolute; left: -96px; top: 110px; width: 120px; height: 120px; }
  </style>
  <div id="root" data-composition-id="klotz" data-width="1080" data-height="1920" data-layout-allow-overflow>
    <div id="k-pod"><svg viewBox="0 0 350 120" width="100%" height="100%" overflow="visible" shape-rendering="crispEdges"><rect x="10" y="10" width="330" height="104" fill="${STONE}" stroke="${K}" stroke-width="8"/>${[0, 1].map((r) => [0, 1, 2, 3, 4].map((c) => `<rect x="${18 + c * 64 + (r ? 32 : 0)}" y="${36 + r * 38}" width="${r && c === 4 ? 26 : 58}" height="32" fill="${(r + c) % 2 ? STONE_L : STONE_D}"/>`).join("")).join("")}<rect x="10" y="10" width="330" height="22" fill="${STONE_L}" stroke="${K}" stroke-width="6"/></svg></div>
    <div id="k-wrap"><div id="k-bob"><div id="k-sq">
${klotzSvg}
      <div id="k-note" class="k-prop">${NOTEPAD()}<div id="k-pen">${PENCIL()}</div></div>
      <div id="k-leg" class="k-prop">${LEG(true)}</div>
    </div></div>
      <div id="k-shout" class="k-prop"><div id="k-shout-t">KLOTZ!</div></div>
    </div>
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
  [0.0, "impact", 0.35], [0.0, "charge", 0.35], [0.05, "steps", 0.4], [0.3, "boing", 0.3], [0.6, "wobble", 0.3], [1.2, "steps", 0.35],
  [c("c02"), "whoosh1", 0.35], [c("c02"), "pop1", 0.4], [c("c02") + 0.25, "pop2", 0.4], [c("c02") + 0.45, "hmm", 0.3], [c("c02") + 0.65, "hmm", 0.25],
  [c("c03"), "whoosh2", 0.35], [c("c03") + 0.05, "torch", 0.4], [c("c03") + 0.5, "growl", 0.4], [c("c03") + 1.7, "blip", 0.3],
  [c("c04"), "chalk", 0.4], [c("c04") + 0.2, "blip", 0.3], [c("c04") + 0.5, "blip", 0.3], [c("c04") + 0.8, "blip", 0.3], [NOTE_ON, "pop2", 0.35],
  [c("c05"), "whoosh1", 0.3], [c("c05") + 0.1, "chalk", 0.4], [c("c05") + 0.45, "chalk", 0.35], [c("c05") + 0.8, "chalk", 0.35], [c("c05") + 1.2, "chalk", 0.35], [NOTE_ON + 0.5, "scribble", 0.4], [NOTE_ON + 1.1, "scribble", 0.35], [NOTE_ON + 1.7, "scribble", 0.35],
  [c("c06"), "whoosh2", 0.3], ...[0, 1, 2, 3, 4, 5].map((i) => [c("c06") + 0.15 + i * 0.12, "beep", 0.3]), [c("c06") + 1.05, "error", 0.4], [c("c06") + 1.05, "sparkle", 0.3],
  [c("c07"), "chew", 0.45], [c("c07") + 0.5, "chew", 0.4], [c("c07") + 1.0, "chew", 0.4], [c("c07") + 1.5, "chew", 0.35], [c("c07") + 0.3, "hmm", 0.25],
  [c("c08"), "steps", 0.35], [c("c08") + 0.6, "steps", 0.3], [c("c08") + 1.05, "bite", 0.5], [c("c08") + 1.1, "gulp", 0.3],
  [c("c09"), "charge", 0.5], [c("c09"), "impact", 0.35], [c("c09") + 0.1, "steps", 0.45], [c("c09") + 0.75, "steps", 0.4], [c("c09") + 1.4, "steps", 0.35],
  [c("c10"), "whoosh1", 0.3], [c("c10") + 0.1, "panic", 0.35], [c("c10") + 0.05, "steps", 0.4], [c("c10") + 0.7, "steps", 0.35], [c("c10") + 1.3, "steps", 0.3],
  [c("c11"), "tomb", 0.45], [c("c11") + 0.16, "tomb", 0.35], [c("c11") + 0.24, "tomb", 0.3], [RUN_T, "dash", 0.4], [RUN_T + 0.1, "yelp", 0.4], [c("c11") + 0.3, "chirp", 0.3], [c("c11") + 0.9, "chirp", 0.3], [RUN_T + 0.8, "dash", 0.3],
  [c("c12"), "whoosh2", 0.3], [c("c12") + 0.15, "zoom", 0.35], ...[0, 1, 2, 3].map((i) => [c("c12") + 0.45 + i * 0.12, "blip", 0.3]), [c("c12") + 1.0, "ping", 0.3], [c("c12") + 1.2, "ping", 0.3], [c("c12") + 1.4, "ping", 0.3],
  [c("c13"), "ding", 0.4], [c("c13") + 0.8, "flip", 0.4], [c("c13") + 1.0, "sparkle", 0.35],
  [c("c14"), "swish", 0.35], [c("c14") + 0.1, "hmm", 0.35], [c("c14") + 0.5, "creak", 0.3],
  [c("c15") + 0.3, "clap", 0.55], [c("c15") + 0.3, "impact", 0.35], [c("c15") + 0.35, "sparkle", 0.35], [c("c15") + 1.7, "clap", 0.35],
  [c("c16"), "fanfare", 0.45], [c("c16") + 0.1, "confetti", 0.35], [c("c16") + 0.6, "confetti", 0.3],
  [c("c17"), "pop1", 0.4], [c("c17") + 0.2, "pop2", 0.35], [LEG_ON, "pop2", 0.35], [LEG_ON + 0.45, "bite", 0.35], [WINK_T, "wink", 0.4],
  [LOOPK - 0.15, "whoosh2", 0.4], [LOOPK, "impact", 0.3], [LOOPK + 0.05, "steps", 0.35],
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
      <audio id="music-chiptune" class="clip" src="assets/sfx/music.wav" data-start="0" data-duration="${DUR}" data-track-index="5" data-volume="0.5"></audio>
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
console.log("written", scenes.length, "scenes,", sfx.length, "sfx, lanes", lanes.length, "DUR", DUR, "cuts", scenes.slice(1).map((s) => s.start).join(","), "punch", c("c15"));
