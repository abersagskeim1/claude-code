// Generator for Folge 12 "Atari vergräbt Spiele in der Wüste" (Staffel 2): writes index.html and compositions/*.html
// Usage: node tools/gen.mjs <project_dir>
// Technique from Folge 1-11 (scene helper, Klotz rig, captions with fixed word gap, id checks, exit before the cut,
// Lilita One embedded as a data URI so the check scripts measure the real font).
// New in Folge 12: desert at sunset. Own vector drawings: generic game modules (own shape, label = colour blocks only, no logo,
// no game art), sand dunes, saguaro cactus, low sun, parchment with a "MYTHOS?" stamp, thumbs-down rain, shelf full of
// modules with a falling price tag, truck with a dust cloud, town sign ALAMOGORDO (plain text) and a junk hill with flies,
// excavator with barrier tape, modules rising out of the sand, crate filling up ("RUND 1.300"), checkbox "LEGENDE ?",
// crossed-out "MILLIONEN", heap "RUND 700.000", museum display case with spotlight and rope posts, comment bubble.
// Klotz gag: he digs along with a mini shovel, finds only a sock and then a tiny cactus; at the end he holds up a module of
// his own like a trophy (all on his usual spot; every prop is gone again at the loop, as in frame 0).
// All scene graphics stay in x 100-980 (Ken Burns 1.03 keeps them inside 80-1000) and in y 790-1370 (under the captions, above Klotz).
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
const YEL = "#FFD23F", RED = "#FF3B3B", CREAM = "#FFF1D6", ORANGE = "#FF7A1A";
const SAND = "#F4BE5E", SAND_D = "#D18F3A", SAND_L = "#FFE0A0";
const CAC = "#3E9E52", CAC_D = "#28703A";
const MODG = "#4A4E66", MODG_D = "#30334A";
const WOOD = "#9A6232", WOOD_D = "#5E3A1A", GOLD = "#F2B705", METAL = "#9AA3C0", SKY = "#5BB2F0";
const SKIN = "#FFC93C", SKIN_D = "#E0A21A";
const LABELS = [[RED, "#fff"], [SKY, "#fff"], [YEL, ORANGE], ["#7AD36B", YEL], ["#C77DFF", "#fff"], [ORANGE, YEL]];
const ET = ["#3D8BFF", YEL]; // colours of the generic "E.T." module (own design: colour blocks and a "?")

// ================= timing: one row per caption; one scene per caption; cuts on whole tenths =================
// a caption with n words needs n x 0.35 s (min 1.1 s) fully readable + the word pop-in + the exit
const CD = [["c01", 2.6], ["c02", 2.8], ["c03", 2.0], ["c04", 2.0], ["c05", 2.4], ["c06", 2.4], ["c07", 2.4], ["c08", 2.8], ["c09", 2.4],
  ["c10", 2.2], ["c11", 2.4], ["c12", 2.0], ["c13", 2.8], ["c14", 2.4], ["c15", 2.8], ["c16", 2.4], ["c17", 0.6]];
const C = {};
{ let t = 0; for (const [id, d] of CD) { C[id] = [f2(t), f2(t + d)]; t += d; } }
export const DUR = C.c17[1];
const LAST = f2(DUR - 1 / 30);
const T = {
  hook: C.c01, mythos: C.c02, firma: C.c03, spiel: C.c04, schlecht: C.c05, regal: C.c06, lkw: C.c07, kippe: C.c08, graben: C.c09,
  fund: C.c10, kiste: C.c11, legende: C.c12, millionen: C.c13, haufen: C.c14, museum: C.c15, frage: [C.c16[0], DUR],
};
const S = (k) => [T[k][0], f2(T[k][1] - T[k][0])];
const scenes = [];

// ================= drawings (own designs, flat vector) =================
const SV = (w, h, inner, extra = "") => `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" overflow="visible"${extra}>${inner}</svg>`;
// generic game module (viewBox 200 x 240): own shape - rounded case with a notched bottom, grip grooves, label of two colour
// blocks; optional "?" on the label (only where the module is drawn large enough for a >= 72 px sign)
const MODULE = (c1, c2, q = "", qid = "") => SV(200, 240, `<path d="M30 10 H170 Q190 10 190 30 V196 Q190 212 176 218 L158 230 H42 L24 218 Q10 212 10 196 V30 Q10 10 30 10 Z" fill="${MODG}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
  <rect x="34" y="30" width="132" height="128" rx="12" fill="${c1}" stroke="${K}" stroke-width="6"/>
  <path d="M40 72 H160" stroke="${K}" stroke-width="5"/><rect x="37" y="33" width="126" height="37" rx="9" fill="${c2}"/>
  <path d="M52 182 H148 M52 200 H148" stroke="${MODG_D}" stroke-width="9" stroke-linecap="round"/>
  ${q ? `<text ${qid ? `id="${qid}" ` : ""}x="100" y="148" text-anchor="middle" font-family="'Lilita One'" font-size="92" fill="#fff" stroke="${K}" stroke-width="10" paint-order="stroke fill">${q}</text>` : ""}`);
const modBox = (id, l, t, s, lab, cls = "STKC", q = "", extra = "") => `      <div id="${id}" class="${cls} mod" style="${abs(l, t, Math.round(200 * s), Math.round(240 * s))}${extra}">${MODULE(lab[0], lab[1], q, q ? id + "-q" : "")}</div>`;
const SPARK = (col = YEL) => SV(100, 100, `<path d="M50 2 Q56 44 98 50 Q56 56 50 98 Q44 56 2 50 Q44 44 50 2 Z" fill="${col}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>`);
// saguaro cactus (viewBox 160 x 400): trunk and two arms as rounded shapes (smooth arcs, no steps)
const CACTUS = () => SV(160, 400, `<path d="M58 392 V60 Q58 22 80 22 Q102 22 102 60 V392 Z" fill="${CAC}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
  <path d="M60 230 H40 Q20 230 20 205 V120 Q20 100 34 100 Q48 100 48 120 V198 H60" fill="${CAC}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
  <path d="M100 180 H120 Q140 180 140 155 V90 Q140 70 126 70 Q112 70 112 90 V150 H100" fill="${CAC}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
  <path d="M80 40 V380 M34 118 V200 M126 88 V160" stroke="${CAC_D}" stroke-width="5" stroke-linecap="round" opacity=".7"/>`);
const SUN = () => SV(240, 240, `<circle cx="120" cy="120" r="118" fill="#FFD66B" opacity=".35"/><circle cx="120" cy="120" r="88" fill="#FFB43B" stroke="${K}" stroke-width="8"/><path d="M60 150 Q120 170 180 150" fill="none" stroke="#FF8A2B" stroke-width="10" stroke-linecap="round" opacity=".7"/><path d="M70 176 Q120 192 170 176" fill="none" stroke="#FF8A2B" stroke-width="9" stroke-linecap="round" opacity=".6"/>`);
// hook dune: back layer (viewBox 900 x 410) and front lip (viewBox 900 x 180) that covers the lower part of the modules
const DUNE_BACK = () => SV(900, 410, `<path d="M0 410 L0 220 C150 140 270 96 430 112 C590 128 720 196 900 176 L900 410 Z" fill="${SAND}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
  <path d="M430 112 C590 128 720 196 900 176 L900 410 L540 410 C580 300 540 190 430 112 Z" fill="${SAND_D}" opacity=".5"/>
  <path d="M80 260 C180 230 260 230 340 250 M520 250 C620 236 700 240 800 262" fill="none" stroke="${SAND_D}" stroke-width="7" stroke-linecap="round" opacity=".8"/>`);
const DUNE_FRONT = () => SV(900, 180, `<path d="M0 180 L0 70 C170 30 330 18 480 40 C640 62 760 40 900 30 L900 180 Z" fill="${SAND_L}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
  <path d="M120 110 C220 90 300 92 380 108 M560 100 C660 86 740 90 840 104" fill="none" stroke="${SAND}" stroke-width="7" stroke-linecap="round"/>`);
// parchment (viewBox 740 x 520) with rolled ends
const PARCH = () => SV(740, 520, `<rect x="44" y="40" width="652" height="440" fill="#F6E3B8" stroke="${K}" stroke-width="10"/>
  ${[0, 1, 2, 3, 4].map((i) => `<rect x="110" y="${120 + i * 62}" width="${[520, 470, 500, 430, 300][i]}" height="18" rx="9" fill="#D8BE8A"/>`).join("")}
  <rect x="8" y="10" width="724" height="60" rx="30" fill="#E9CC92" stroke="${K}" stroke-width="10"/><rect x="8" y="450" width="724" height="60" rx="30" fill="#E9CC92" stroke="${K}" stroke-width="10"/>
  <ellipse cx="40" cy="40" rx="14" ry="22" fill="#C9A464" stroke="${K}" stroke-width="6"/><ellipse cx="700" cy="480" rx="14" ry="22" fill="#C9A464" stroke="${K}" stroke-width="6"/>`);
// thumbs down (viewBox 120 x 150): fist with the thumb pointing down, sleeve cuff on top
const THUMB = (cuff = SKY) => SV(120, 150, `<rect x="66" y="6" width="46" height="68" rx="10" fill="${cuff}" stroke="${K}" stroke-width="7"/>
  <rect x="12" y="16" width="70" height="72" rx="22" fill="${SKIN}" stroke="${K}" stroke-width="7"/>
  <path d="M26 38 H62 M26 56 H62" stroke="${SKIN_D}" stroke-width="6" stroke-linecap="round"/>
  <rect x="20" y="70" width="30" height="72" rx="15" fill="${SKIN}" stroke="${K}" stroke-width="7"/>`);
// shelf (viewBox 780 x 560)
const SHELF = () => SV(780, 560, `<rect x="8" y="8" width="764" height="544" rx="14" fill="#6E4524" stroke="${K}" stroke-width="12"/><rect x="34" y="30" width="712" height="500" fill="#3E2614"/>
  ${[0, 1, 2].map((i) => `<rect x="20" y="${178 + i * 168}" width="740" height="26" rx="6" fill="${WOOD}" stroke="${K}" stroke-width="8"/>`).join("")}
  <path d="M746 30 Q690 40 680 100 M746 30 Q700 70 712 120 M746 30 Q720 90 746 130 M700 52 Q724 66 732 92 M688 82 Q708 98 712 118" fill="none" stroke="#E8E8F4" stroke-width="3" opacity=".75"/>`);
const TAG = () => SV(120, 190, `<path d="M60 0 V70" stroke="${K}" stroke-width="4"/><path d="M24 70 H96 L110 96 V176 Q110 186 100 186 H20 Q10 186 10 176 V96 Z" fill="${CREAM}" stroke="${K}" stroke-width="7" stroke-linejoin="round"/><circle cx="60" cy="96" r="9" fill="#6E4524" stroke="${K}" stroke-width="4"/>
  <path d="M30 130 H90 M30 154 H74" stroke="#C9B48A" stroke-width="9" stroke-linecap="round"/>`);
// truck (viewBox 460 x 280): open cargo box with module tops, cab, wheels (groups p-w0..2 rotate)
const WHEEL = (p, cx) => `<g id="${p}"><circle cx="${cx}" cy="232" r="40" fill="#2A2D3E" stroke="${K}" stroke-width="8"/><circle cx="${cx}" cy="232" r="16" fill="${METAL}" stroke="${K}" stroke-width="5"/><path d="M${cx} 198 V214 M${cx} 250 V266 M${cx - 34} 232 H${cx - 18} M${cx + 18} 232 H${cx + 34}" stroke="#5A5E78" stroke-width="6" stroke-linecap="round"/></g>`;
const TRUCK = (p) => SV(460, 280, `${[[40, RED], [96, SKY], [152, YEL], [208, "#7AD36B"]].map(([x, c], i) => `<g transform="rotate(${[-8, 5, -4, 9][i]} ${x + 24} 40)"><rect x="${x}" y="6" width="48" height="60" rx="8" fill="${MODG}" stroke="${K}" stroke-width="6"/><rect x="${x + 8}" y="14" width="32" height="24" rx="4" fill="${c}"/></g>`).join("")}
  <rect x="10" y="40" width="282" height="160" rx="10" fill="#E6E9F5" stroke="${K}" stroke-width="10"/><path d="M60 40 V200 M130 40 V200 M200 40 V200" stroke="#BFC4DA" stroke-width="6"/>
  <path d="M292 80 H372 Q392 80 404 100 L440 150 Q448 162 448 176 V200 H292 Z" fill="${RED}" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>
  <path d="M312 96 H366 Q378 96 386 108 L410 144 H312 Z" fill="#BFE6FF" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>
  <rect x="420" y="178" width="34" height="20" rx="6" fill="${YEL}" stroke="${K}" stroke-width="5"/>
  ${WHEEL(p + "-w0", 80)}${WHEEL(p + "-w1", 200)}${WHEEL(p + "-w2", 372)}`);
const PUFF = (col = "#F7D9A0") => SV(120, 90, `<path d="M24 80 Q2 80 6 60 Q10 42 30 46 Q36 16 64 20 Q90 6 104 36 Q124 44 114 66 Q110 82 92 80 Z" fill="${col}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>`);
// junk hill (viewBox 600 x 360): grey-brown mound with a tyre, a box, cans and a few module cases
const JUNK = () => SV(600, 360, `<path d="M0 360 C60 250 150 150 300 140 C450 130 540 240 600 360 Z" fill="#9A8466" stroke="${K}" stroke-width="9" stroke-linejoin="round"/>
  <path d="M60 330 C140 290 220 280 300 290 C400 300 470 290 560 330" fill="none" stroke="#7A664C" stroke-width="7" stroke-linecap="round"/>
  <ellipse cx="190" cy="230" rx="52" ry="34" fill="#2A2D3E" stroke="${K}" stroke-width="8"/><ellipse cx="190" cy="230" rx="22" ry="13" fill="#9A8466" stroke="${K}" stroke-width="6"/>
  <g transform="rotate(-12 380 210)"><rect x="330" y="170" width="100" height="74" rx="6" fill="#C8894A" stroke="${K}" stroke-width="8"/><path d="M330 196 H430" stroke="${K}" stroke-width="5"/></g>
  <g transform="rotate(20 300 160)"><rect x="276" y="128" width="46" height="58" rx="8" fill="${MODG}" stroke="${K}" stroke-width="6"/><rect x="284" y="136" width="30" height="22" rx="4" fill="${RED}"/></g>
  <g transform="rotate(-25 470 270)"><rect x="448" y="240" width="46" height="58" rx="8" fill="${MODG}" stroke="${K}" stroke-width="6"/><rect x="456" y="248" width="30" height="22" rx="4" fill="${SKY}"/></g>
  <rect x="96" y="276" width="34" height="48" rx="8" fill="${METAL}" stroke="${K}" stroke-width="6"/><rect x="250" y="286" width="30" height="40" rx="8" fill="#7AD36B" stroke="${K}" stroke-width="6"/>`);
const FLY = () => SV(40, 30, `<ellipse cx="12" cy="10" rx="9" ry="7" fill="#E9F4FF" stroke="${K}" stroke-width="3"/><ellipse cx="26" cy="10" rx="9" ry="7" fill="#E9F4FF" stroke="${K}" stroke-width="3"/><ellipse cx="20" cy="19" rx="9" ry="8" fill="${K}"/>`);
// excavator (viewBox 560 x 420): tracks, body, cab; boom p-bm (pivot 150 250), stick p-st (pivot 330 96), bucket p-bk (pivot 470 236)
const DIGGER = (p) => SV(560, 420, `<rect x="16" y="342" width="300" height="66" rx="33" fill="#2A2D3E" stroke="${K}" stroke-width="9"/>${[56, 126, 196, 266].map((x) => `<circle cx="${x}" cy="375" r="17" fill="${METAL}" stroke="${K}" stroke-width="5"/>`).join("")}
  <rect x="34" y="236" width="256" height="112" rx="18" fill="${GOLD}" stroke="${K}" stroke-width="9"/><rect x="34" y="300" width="256" height="20" fill="${K}" opacity=".25"/>
  <path d="M180 240 V150 Q180 136 194 136 H262 Q290 136 290 166 V240 Z" fill="${GOLD}" stroke="${K}" stroke-width="9" stroke-linejoin="round"/><path d="M198 154 H256 Q272 154 272 172 V214 H198 Z" fill="#BFE6FF" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
  <g id="${p}-bm"><path d="M130 250 L310 80" stroke="${K}" stroke-width="50" stroke-linecap="round"/><path d="M130 250 L310 80" stroke="${GOLD}" stroke-width="34" stroke-linecap="round"/>
    <g id="${p}-st"><path d="M320 92 L466 232" stroke="${K}" stroke-width="40" stroke-linecap="round"/><path d="M320 92 L466 232" stroke="${GOLD}" stroke-width="24" stroke-linecap="round"/><circle cx="324" cy="94" r="14" fill="${METAL}" stroke="${K}" stroke-width="6"/>
      <g id="${p}-bk"><path d="M456 226 Q512 214 530 260 Q540 300 500 316 L470 300 Q486 270 456 250 Z" fill="#6A6E86" stroke="${K}" stroke-width="8" stroke-linejoin="round"/><circle cx="466" cy="234" r="12" fill="${METAL}" stroke="${K}" stroke-width="5"/></g></g>
    <circle cx="136" cy="246" r="16" fill="${METAL}" stroke="${K}" stroke-width="6"/></g>`);
// barrier tape: smooth wave (cubic curves), yellow with dark blocks; ids p-t0 (outline), p-t1 (yellow), p-t2 (blocks)
const TAPE_D = (ph) => { const a = 18 * Math.sin(ph), b = 18 * Math.cos(ph); return `M30 ${f2(56 + a)} C180 ${f2(30 - b)} 300 ${f2(82 + b)} 440 ${f2(56 - a)} C580 ${f2(30 + a)} 700 ${f2(82 - b)} 850 ${f2(56 + a)}`; };
const TAPE = (p) => SV(880, 110, `<rect x="6" y="20" width="26" height="90" rx="6" fill="${RED}" stroke="${K}" stroke-width="6"/><rect x="848" y="20" width="26" height="90" rx="6" fill="${RED}" stroke="${K}" stroke-width="6"/>
  <path id="${p}-t0" d="${TAPE_D(0)}" fill="none" stroke="${K}" stroke-width="44" stroke-linecap="round"/><path id="${p}-t1" d="${TAPE_D(0)}" fill="none" stroke="${YEL}" stroke-width="30" stroke-linecap="round"/>
  <path id="${p}-t2" d="${TAPE_D(0)}" fill="none" stroke="${K}" stroke-width="30" stroke-dasharray="34 34"/>`);
const tapeWave = (p, t0, d) => { const n = Math.max(1, Math.round(d / 1.0)), per = f2(d / n); const ph = [1, 2, 3, 4].map((k) => TAPE_D((k * Math.PI) / 2));
  return ["t0", "t1", "t2"].map((c) => `      tl.to("#${p}-${c}", { keyframes: [${ph.map((q) => `{ attr: { d: "${q}" }, duration: ${f2(per / 4)}, ease: "sine.inOut" }`).join(", ")}], repeat: ${n - 1} }, ${t0});`).join("\n"); };
const PILE = () => SV(260, 210, `<path d="M0 210 C30 120 80 40 130 40 C180 40 230 120 260 210 Z" fill="${SAND_D}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/><path d="M50 160 C90 140 170 140 210 160" fill="none" stroke="${SAND}" stroke-width="7" stroke-linecap="round"/>`);
const CLOD = () => SV(40, 40, `<circle cx="20" cy="20" r="15" fill="${SAND_D}" stroke="${K}" stroke-width="5"/>`);
const CRATE = (front) => SV(480, 240, front ? `<rect x="6" y="60" width="468" height="174" rx="10" fill="${WOOD}" stroke="${K}" stroke-width="10"/><path d="M6 118 H474 M6 176 H474" stroke="${WOOD_D}" stroke-width="7"/><path d="M40 66 L120 228 M440 66 L360 228" stroke="${WOOD_D}" stroke-width="10" stroke-linecap="round"/>`
  : `<rect x="20" y="20" width="440" height="120" rx="8" fill="#5E3A1A" stroke="${K}" stroke-width="10"/>`);
const CHECKBOX = () => SV(240, 240, `<rect x="10" y="10" width="220" height="220" rx="30" fill="#fff" stroke="${K}" stroke-width="12"/>`);
const LENS = () => SV(220, 280, `<path d="M150 160 L206 258" stroke="${K}" stroke-width="40" stroke-linecap="round"/><path d="M150 160 L206 258" stroke="${WOOD}" stroke-width="24" stroke-linecap="round"/>
  <circle cx="92" cy="92" r="80" fill="#BFE6FF" fill-opacity=".45" stroke="${K}" stroke-width="12"/><circle cx="92" cy="92" r="66" fill="none" stroke="${METAL}" stroke-width="8"/><path d="M50 70 Q60 46 84 40" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round"/>`);
const STRIKE = () => SV(760, 220, `<path id="mil-sk" d="M30 150 C220 130 520 100 730 70" fill="none" stroke="${K}" stroke-width="30" stroke-linecap="round"/><path id="mil-sr" d="M30 150 C220 130 520 100 730 70" fill="none" stroke="${RED}" stroke-width="16" stroke-linecap="round"/>`);
// heap of module cases on sand (viewBox 820 x 380)
const HEAP = () => { const RS = mulberry32(7000); let m = "";
  const rows = [[6, 300, 250], [8, 230, 180], [6, 160, 110], [4, 90, 60]];
  for (const [n, y0] of rows) { const span = n * 92; for (let i = 0; i < n; i++) { const x = 410 - span / 2 + i * 92 + RS() * 18 - 9, y = y0 + RS() * 16, a = Math.round(RS() * 40 - 20), c = LABELS[Math.floor(RS() * LABELS.length)];
    m += `<g transform="rotate(${a} ${f2(x + 38)} ${f2(y + 46)})"><rect x="${f2(x)}" y="${f2(y)}" width="76" height="92" rx="12" fill="${MODG}" stroke="${K}" stroke-width="6"/><rect x="${f2(x + 12)}" y="${f2(y + 12)}" width="52" height="46" rx="6" fill="${c[0]}"/><rect x="${f2(x + 12)}" y="${f2(y + 12)}" width="52" height="16" rx="6" fill="${c[1]}"/></g>`; } }
  return SV(820, 380, `<path d="M0 380 C80 300 200 250 410 250 C620 250 740 300 820 380 Z" fill="${SAND}" stroke="${K}" stroke-width="9" stroke-linejoin="round"/>${m}`); };
// museum: display case glass, pedestal, spotlight cone, rope posts with a smooth sagging rope
const GLASS = () => SV(320, 330, `<rect x="8" y="8" width="304" height="314" rx="10" fill="#BFE6FF" fill-opacity=".28" stroke="${K}" stroke-width="10"/><rect x="8" y="8" width="304" height="34" rx="10" fill="${METAL}" stroke="${K}" stroke-width="8"/>
  <path d="M40 80 L90 60 M40 130 L140 80 M240 280 L290 250" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".8"/>`);
const PEDESTAL = () => SV(360, 190, `<rect x="10" y="8" width="340" height="40" rx="8" fill="#E6E9F5" stroke="${K}" stroke-width="9"/><rect x="34" y="48" width="292" height="134" fill="#C9CEE4" stroke="${K}" stroke-width="9"/><path d="M90 60 V170 M180 60 V170 M270 60 V170" stroke="#AEB4D0" stroke-width="7"/>`);
const CONE = (p) => SV(520, 600, `<defs><linearGradient id="${p}-cg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#FFF6C8" stop-opacity=".85"/><stop offset="1" stop-color="#FFF6C8" stop-opacity=".1"/></linearGradient></defs><path d="M200 0 H320 L520 600 H0 Z" fill="url(#${p}-cg)"/>`);
const ROPE = (flip) => SV(250, 200, `<g transform="${flip ? "translate(250 0) scale(-1 1)" : "translate(0 0)"}"><rect x="10" y="60" width="26" height="130" rx="8" fill="${GOLD}" stroke="${K}" stroke-width="7"/><circle cx="23" cy="52" r="20" fill="${GOLD}" stroke="${K}" stroke-width="7"/><rect x="0" y="176" width="46" height="18" rx="6" fill="${GOLD}" stroke="${K}" stroke-width="6"/>
  <path d="M30 70 C90 150 170 150 248 90" fill="none" stroke="${K}" stroke-width="26" stroke-linecap="round"/><path d="M30 70 C90 150 170 150 248 90" fill="none" stroke="#C3122E" stroke-width="14" stroke-linecap="round"/></g>`);
const BUBBLE = () => SV(740, 440, `<path d="M60 14 H680 Q726 14 726 60 V300 Q726 346 680 346 H250 L140 426 L164 346 H60 Q14 346 14 300 V60 Q14 14 60 14 Z" fill="#fff" stroke="${K}" stroke-width="14" stroke-linejoin="round"/>`);

// ---------- common CSS ----------
const STK = `filter: drop-shadow(5px 0 0 #fff) drop-shadow(-5px 0 0 #fff) drop-shadow(0 5px 0 #fff) drop-shadow(0 -5px 0 #fff) drop-shadow(0 14px 0 rgba(0,0,0,.35));`;
// the font is embedded as a data URI too (the sandboxed preview page has an opaque origin and cannot fetch font files), the file stays as fallback
const LILITA64 = fs.readFileSync(path.join(OUT, "assets", "fonts", "LilitaOne-latin.woff2")).toString("base64");
const FONTFACE = `@font-face{font-family:'Lilita One';src:url('data:font/woff2;base64,${LILITA64}') format('woff2'),url('assets/fonts/LilitaOne-latin.woff2') format('woff2');font-weight:400;font-style:normal;font-display:block;}`;
const abs = (l, t, w, h) => `position:absolute;left:${l}px;top:${t}px;width:${w}px;${h != null ? `height:${h}px;` : ""}`;
const LBL = (size, col = K) => `font-family:'Lilita One';font-size:${size}px;line-height:1;color:${col};white-space:nowrap;text-align:center;letter-spacing:0.02em;`;
// plate with a label; white labels get a dark outline for contrast
const plate = (id, l, t, w, h, txt, size = 80, bg = `background:${CREAM};`, col = K) => `      <div id="${id}" class="plate" style="${abs(l, t, w, h)}${bg}"><div id="${id}-t" style="position:absolute;left:0;top:${Math.round((h - 14 - size) / 2) + 4}px;width:100%;${LBL(size, col)}${col === "#fff" ? `-webkit-text-stroke:10px ${K};paint-order:stroke fill;` : ""}">${NUMDOT(txt)}</div></div>`;
const stk = (s, p) => s.replace(/STKC/g, p + "-stk");
// a dot between digits ("1.300", "700.000") gets its own element with 0.08 em space on both sides (no negative letter spacing)
const NUMDOT = (t) => t.replace(/(\d)\.(\d)/g, '$1<span class="nd" style="display:inline-block;margin:0 0.08em;">.</span>$2');

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
function burst(p, n, cx, cy, size, rad, seed, cols = [YEL, "#fff"], ry = 1) {
  const RS = mulberry32(seed);
  const items = Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2 + RS() * 0.5; const rr = rad * (0.75 + RS() * 0.25); return { x: Math.round(Math.cos(a) * rr), y: Math.round(Math.sin(a) * rr * ry), s: Math.round(size * (0.7 + RS() * 0.6)) }; });
  const html = items.map((it, i) => `<div id="${p}-${i}" class="spk" style="left:${cx - it.s / 2}px;top:${cy - it.s / 2}px;width:${it.s}px;height:${it.s}px;">${SPARK(cols[i % cols.length])}</div>`).join("");
  const js = (at) => items.map((it, i) => `      tl.fromTo("#${p}-${i}", { x: 0, y: 0, scale: 0, rotation: 0, opacity: 1 }, { keyframes: { x: [0, ${it.x}], y: [0, ${it.y}], scale: [0, 1.1, 0], rotation: [0, 120] }, duration: 0.6, ease: "power1.out", immediateRender: true }, ${at});`).join("\n");
  return { html, js };
}
// endless fall inside a clipped box: element starts at y0 and moves down at speed v (px/s); on leaving the box (y > H) it
// re-enters from -size. Deterministic: only finite tweens.
const fall = (sel, y0, H, size, v, d, rot = 0) => {
  let s = "", t = 0, y = y0;
  const r = (dy) => (rot ? `, rotation: "+=${f2((rot * dy) / v)}"` : "");
  while (t < d - 1e-6) { const dt = Math.min(f2((H - y) / v), f2(d - t)); s += `      tl.fromTo("${sel}", { y: ${f2(y)} }, { y: ${f2(y + dt * v)}${r(dt * v)}, duration: ${dt}, ease: "none", immediateRender: ${t === 0} }, ${f2(t)});\n`; t = f2(t + dt); y = -size; }
  return s;
};

// ================= HOOK picture (frame 0 = thumbnail motif): dune at sunset, game modules sticking out of the sand, cactus, sun =================
const HM = [[300, 990, 0.95, -16, 0], [500, 930, 1.15, 7, 1], [700, 1010, 0.9, 20, 2], [840, 1100, 0.62, -10, 3]];
const hookCss = (p) => `
   #${p}-sun{${abs(680, 790, 240, 240)}transform-origin:50% 50%;}
   #${p}-db{${abs(90, 960, 900, 410)}}
   #${p}-df{${abs(90, 1190, 900, 180)}}
   #${p}-ca{${abs(130, 850, 160, 400)}transform-origin:50% 100%;}
   #${p}-gr{${abs(100, 1120, 880, 240)}overflow:hidden;}
   .${p}-g{position:absolute;width:12px;height:12px;border-radius:6px;background:${SAND_L};border:3px solid ${SAND_D};}
   .mod{transform-origin:50% 80%;}`;
const HG = [[30, 40], [200, 120], [380, 20], [560, 150], [720, 70], [860, 180], [120, 200], [640, 210]];
const hookBody = (p) => stk(`      <div id="${p}-sun">${SUN()}</div>
      <div id="${p}-db" class="STKC">${DUNE_BACK()}</div>
      <div id="${p}-ca" class="STKC">${CACTUS()}</div>
${HM.map(([x, y, s, a, li]) => modBox(`${p}-m${li}`, x, y, s, LABELS[li], "STKC", "", `transform:rotate(${a}deg);`)).join("\n")}
      <div id="${p}-df" class="STKC">${DUNE_FRONT()}</div>
      <div id="${p}-gr">${HG.map(([x, y], i) => `<div id="${p}-g${i}" class="${p}-g" style="left:${x}px;top:${y}px;"></div>`).join("")}</div>`, p);
// idle motion of the hook picture from t0 for d seconds
const hookIdle = (p, t0, d) => {
  const n = Math.max(1, Math.round(d / 0.8)), per = f2(d / n);
  return HM.map(([, , , a, li], i) => `      tl.fromTo("#${p}-m${li}", { rotation: ${a} }, { keyframes: { rotation: [${a}, ${a + (i % 2 ? 3 : -3)}, ${a}] }, duration: ${per}, ease: "sine.inOut", repeat: ${n - 1}, immediateRender: false }, ${t0});`).join("\n") + `
      tl.fromTo("#${p}-sun", { scale: 1 }, { keyframes: { scale: [1, 1.05, 1] }, duration: ${per}, ease: "sine.inOut", repeat: ${n - 1}, immediateRender: false }, ${t0});
      tl.fromTo("#${p}-ca", { rotation: 0 }, { keyframes: { rotation: [0, 1.5, 0, -1.5, 0] }, duration: ${f2(per * 2)}, ease: "sine.inOut", repeat: ${Math.max(0, Math.round(n / 2) - 1)}, immediateRender: false }, ${t0});
${HG.map(([x], i) => `      tl.fromTo("#${p}-g${i}", { x: 0, opacity: 1 }, { x: ${Math.min(140 + (i % 3) * 30, 850 - x)}, opacity: 0.2, duration: ${d}, ease: "none", immediateRender: false }, ${t0});`).join("\n")}
`;
};
{
  const p = "hook";
  const [s, d] = S(p);
  scenes.push(scene(p, "Hook: Module ragen aus der Duene", s, d, hookCss(p), hookBody(p),
    `      // frame 0 already shows the full motif (thumbnail picture)
${hookIdle(p, 0, d)}`, { kb: false }));
}

// ================= MYTHOS: parchment, a red stamp "MYTHOS?" slams down (c02) =================
{
  const p = "mythos";
  const [s, d] = S(p);
  const b = burst("mythos-sp", 8, 540, 1100, 50, 330, 1983, [YEL, "#fff"], 0.6);
  scenes.push(scene(p, "Pergament mit Stempel MYTHOS?", s, d,
    `#mythos-pa{${abs(170, 800, 740, 520)}transform-origin:50% 50%;}
     #mythos-st{${abs(260, 1020, 560, 170)}border:12px solid ${RED};border-radius:22px;background:rgba(255,241,214,.6);transform-origin:50% 50%;}
     #mythos-st-t{position:absolute;left:0;top:18px;width:100%;${LBL(110, RED)}}`,
    stk(`      <div id="mythos-pa" class="STKC">${PARCH()}</div>
      <div id="mythos-st"><div id="mythos-st-t">MYTHOS?</div></div>
${b.html}`, p),
    `      tl.fromTo("#mythos-pa", { scaleY: 0.8, rotation: -3 }, { scaleY: 1, rotation: 0, duration: 0.35, ease: "back.out(2)" }, 0);
      tl.fromTo("#mythos-st", { scale: 1.4, rotation: -16, opacity: 0 }, { scale: 1, rotation: -8, opacity: 1, duration: 0.22, ease: "power3.in", immediateRender: true }, 0.45);
${shake("#mythos-pa", 0.67, 9, 0.3)}
${b.js(0.67)}
      tl.to("#mythos-st", { keyframes: { scale: [1, 1.05, 1], rotation: [-8, -6, -8] }, duration: 0.6, ease: "sine.inOut", repeat: 1 }, 1.2);`));
}

// ================= FIRMA: big generic module in a spotlight, plate ATARI as plain text (no logo) (c03) =================
{
  const p = "firma";
  const [s, d] = S(p);
  scenes.push(scene(p, "Modul im Licht, Schild ATARI", s, d,
    `#firma-gl{${abs(250, 790, 580, 470)}border-radius:50%;background:radial-gradient(ellipse,rgba(255,230,150,.5) 0%,rgba(255,230,150,0) 68%);}
     #firma-m{transform-origin:50% 60%;}
     #firma-sh{${abs(363, 800, 354, 420)}overflow:hidden;border-radius:30px;}
     #firma-sb{position:absolute;left:-120px;top:-40px;width:70px;height:520px;background:rgba(255,255,255,.45);transform:rotate(20deg);}
     #firma-pl{transform-origin:50% 50%;}`,
    stk(`      <div id="firma-gl"></div>
${modBox("firma-m", 360, 790, 1.8, LABELS[1])}
      <div id="firma-sh"><div id="firma-sb"></div></div>
${plate("firma-pl", 300, 1222, 480, 140, "ATARI", 110)}`, p),
    `      tl.fromTo("#firma-m", { scale: 0.86, y: 20 }, { scale: 1, y: 0, duration: 0.35, ease: "back.out(2)" }, 0);
      tl.fromTo("#firma-pl", { scale: 0.6, rotation: -6 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2.6)" }, 0.1);
      tl.fromTo("#firma-sb", { x: 0 }, { x: 560, duration: 0.7, ease: "power2.inOut" }, 0.5);
      tl.to("#firma-gl", { keyframes: { opacity: [1, 0.7, 1] }, duration: 1.6, ease: "sine.inOut" }, 0.2);
      tl.to("#firma-m", { keyframes: { rotation: [0, -3, 3, 0] }, duration: 1.2, ease: "sine.inOut" }, 0.6);`));
}

// ================= SPIEL: generic module with a "?" label, plate E.T. as plain text (c04) =================
{
  const p = "spiel";
  const [s, d] = S(p);
  const b = burst("spiel-sp", 8, 330, 1000, 50, 230, 2600);
  scenes.push(scene(p, "Modul mit Fragezeichen, Schild E.T.", s, d,
    `#spiel-m{transform-origin:50% 80%;} #spiel-pl{transform-origin:50% 50%;}`,
    stk(`${modBox("spiel-m", 170, 810, 1.6, ET, "STKC", "?")}
${plate("spiel-pl", 570, 930, 360, 170, "E.T.", 120)}
${b.html}`, p),
    `      tl.fromTo("#spiel-m", { scale: 0.85, rotation: -8 }, { scale: 1, rotation: 0, duration: 0.35, ease: "back.out(2.2)" }, 0);
      tl.fromTo("#spiel-pl", { scale: 0.6, rotation: 8 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2.6)" }, 0.12);
${b.js(0.3)}
      tl.to("#spiel-m", { keyframes: { rotation: [0, -5, 5, -3, 0] }, duration: 1.2, ease: "sine.inOut" }, 0.6);
      tl.to("#spiel-pl", { keyframes: { y: [0, -12, 0] }, duration: 0.6, ease: "sine.inOut", repeat: 1 }, 0.7);`));
}

// ================= SCHLECHT: big thumbs down, small thumbs-down icons rain inside the graphics box (never near the text) (c05) =================
{
  const p = "schlecht";
  const [s, d] = S(p);
  const RS = mulberry32(1983);
  const H = 580, items = Array.from({ length: 14 }, (_, i) => ({ x: Math.round(20 + ((i * 61) % 740) + RS() * 20), y0: Math.round(-80 + RS() * (H + 60)), sz: Math.round(64 + RS() * 30), v: Math.round(300 + RS() * 160), r: i % 2 ? 40 : -40 }));
  scenes.push(scene(p, "Daumen runter regnen", s, d,
    `#schlecht-rn{${abs(100, 790, 880, H)}overflow:hidden;}
     .schlecht-r{position:absolute;top:0;}
     #schlecht-bg{${abs(370, 860, 340, 340)}border-radius:50%;background:${RED};border:10px solid ${K};}
     #schlecht-bt{${abs(410, 860, 260, 325)}transform-origin:50% 30%;}`,
    stk(`      <div id="schlecht-rn">
${items.map((it, i) => `        <div id="schlecht-r${i}" class="schlecht-r" style="left:${it.x}px;width:${it.sz}px;height:${Math.round(it.sz * 1.25)}px;opacity:.85;">${THUMB(i % 3 ? SKY : "#C77DFF")}</div>`).join("\n")}
      </div>
      <div id="schlecht-bg"></div>
      <div id="schlecht-bt" class="STKC">${THUMB(SKY)}</div>`, p),
    `      tl.fromTo("#schlecht-bt", { scale: 0.6, rotation: 20 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2.6)" }, 0);
      tl.fromTo("#schlecht-bg", { scale: 0.7 }, { scale: 1, duration: 0.3, ease: "back.out(2.2)" }, 0);
      tl.to("#schlecht-bt", { keyframes: { y: [0, 22, 0], rotation: [0, -6, 0] }, duration: 0.5, ease: "sine.inOut", repeat: 3 }, 0.4);
${items.map((it, i) => fall(`#schlecht-r${i}`, it.y0, H, Math.round(it.sz * 1.25), it.v, d, it.r)).join("")}`));
}

// ================= REGAL: shelf full of modules, cobweb, a price tag swings and falls (c06) =================
{
  const p = "regal";
  const [s, d] = S(p);
  const mods = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) mods.push([200 + c * 112 + (r % 2) * 20, 852 + r * 168, LABELS[(r * 2 + c) % LABELS.length]]);
  scenes.push(scene(p, "Regal voller Module, Preisschild faellt", s, d,
    `#regal-sh{${abs(150, 800, 780, 560)}}
     .mod{transform-origin:50% 100%;}
     #regal-tg{${abs(760, 990, 120, 190)}transform-origin:50% 0%;}
     #regal-du{${abs(180, 830, 720, 500)}}
     .regal-d{position:absolute;width:10px;height:10px;border-radius:5px;background:#E8D8B8;opacity:.6;}`,
    stk(`      <div id="regal-sh" class="STKC">${SHELF()}</div>
${mods.map(([x, y, lab], i) => modBox(`regal-m${i}`, x, y, 0.5, lab, "")).join("\n")}
      <div id="regal-du">${[[80, 60], [300, 200], [520, 120], [640, 360], [200, 420], [420, 300]].map(([x, y], i) => `<div id="regal-d${i}" class="regal-d" style="left:${x}px;top:${y}px;"></div>`).join("")}</div>
      <div id="regal-tg" class="STKC">${TAG()}</div>`, p),
    `      tl.fromTo("#regal-sh", { scale: 0.95 }, { scale: 1, duration: 0.3, ease: "back.out(2)" }, 0);
${mods.map((_, i) => `      tl.fromTo("#regal-m${i}", { scaleY: 0.85 }, { scaleY: 1, duration: 0.25, ease: "back.out(3)" }, ${f2(0.02 * i)});`).join("\n")}
      tl.fromTo("#regal-tg", { rotation: -24 }, { keyframes: { rotation: [-24, 18, -12, 8] }, duration: 1.0, ease: "sine.inOut", immediateRender: true }, 0);
      tl.to("#regal-tg", { keyframes: { y: [0, 40, 170], rotation: [8, 30, 70], opacity: [1, 1, 0] }, duration: 0.7, ease: "power2.in" }, 1.1);
${[0, 1, 2, 3, 4, 5].map((i) => `      tl.fromTo("#regal-d${i}", { y: 0, x: 0 }, { y: ${20 + i * 6}, x: ${i % 2 ? 14 : -14}, duration: ${d}, ease: "sine.inOut" }, 0);`).join("\n")}`));
}

// ================= LKW: a truck with modules drives into the desert, dust clouds, cacti pass by (c07) =================
{
  const p = "lkw";
  const [s, d] = S(p);
  const cac = [[120, 0.55], [520, 0.4], [760, 0.5]];
  scenes.push(scene(p, "LKW faehrt in die Wueste", s, d,
    `#lkw-cl{${abs(100, 800, 880, 570)}overflow:hidden;}
     .lkw-c{position:absolute;top:0;transform-origin:50% 100%;}
     #lkw-gd{${abs(110, 1250, 860, 120)}}
     #lkw-tr{${abs(360, 990, 460, 280)}}
     .lkw-pf{position:absolute;width:150px;height:112px;transform-origin:50% 50%;}`,
    stk(`      <div id="lkw-cl">
${cac.map(([x, sc], i) => `        <div id="lkw-c${i}" class="lkw-c STKC" style="left:${x}px;top:${Math.round(470 - 400 * sc)}px;width:${Math.round(160 * sc)}px;height:${Math.round(400 * sc)}px;">${CACTUS()}</div>`).join("\n")}
      </div>
      <div id="lkw-gd" class="STKC">${SV(880, 120, `<path d="M0 120 V40 C150 10 300 10 440 30 C580 50 730 50 880 26 V120 Z" fill="${SAND}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/><path d="M60 80 H180 M300 76 H420 M560 84 H680" stroke="${SAND_D}" stroke-width="10" stroke-linecap="round"/>`)}</div>
${[0, 1, 2].map((i) => `      <div id="lkw-pf${i}" class="lkw-pf STKC" style="left:${210 - i * 20}px;top:${1110 + (i % 2) * 40}px;">${PUFF()}</div>`).join("\n")}
      <div id="lkw-tr" class="STKC">${TRUCK("lkw")}</div>`, p),
    `      ${["#lkw-w0", "#lkw-w1", "#lkw-w2"].map((w, i) => `gsap.set("${w}", { svgOrigin: "${[80, 200, 372][i]} 232" });`).join(" ")}
      tl.fromTo("#lkw-tr", { x: -150 }, { x: 110, duration: ${f2(d - 0.1)}, ease: "power1.inOut" }, 0);
      tl.to("#lkw-tr", { keyframes: { y: [0, -8, 0, -6, 0] }, duration: 0.5, ease: "none", repeat: 3 }, 0);
      tl.fromTo(["#lkw-w0", "#lkw-w1", "#lkw-w2"], { rotation: 0 }, { rotation: 720, duration: ${f2(d - 0.1)}, ease: "power1.inOut" }, 0);
${cac.map((_, i) => `      tl.fromTo("#lkw-c${i}", { x: 0 }, { x: ${-60 - i * 30}, duration: ${d}, ease: "none" }, 0);`).join("\n")}
${[0, 1, 2].map((i) => `      tl.fromTo("#lkw-pf${i}", { scale: 0.3, opacity: 1, x: 0, y: 0 }, { keyframes: { scale: [0.3, 1, 1.15], opacity: [1, 0.9, 0], x: [0, -10, -20], y: [0, -20, -40] }, duration: 0.8, ease: "power1.out", repeat: 1, immediateRender: true }, ${f2(i * 0.25)});`).join("\n")}`));
}

// ================= KIPPE: town sign ALAMOGORDO (plain text), junk hill with flies (c08) =================
{
  const p = "kippe";
  const [s, d] = S(p);
  const fl = [[640, 1030, 0], [780, 1000, 0.3], [880, 1070, 0.6]];
  scenes.push(scene(p, "Ortsschild und Muellhuegel", s, d,
    `#kippe-p0{${abs(170, 930, 24, 440)}background:${METAL};border:5px solid ${K};border-radius:8px;}
     #kippe-p1{${abs(600, 930, 24, 300)}background:${METAL};border:5px solid ${K};border-radius:8px;}
     #kippe-pl{transform-origin:50% 100%;}
     #kippe-jk{${abs(360, 1010, 600, 360)}transform-origin:50% 100%;}
     .kippe-f{position:absolute;width:40px;height:30px;}`,
    stk(`      <div id="kippe-p0" class="STKC"></div>
      <div id="kippe-p1" class="STKC"></div>
      <div id="kippe-jk" class="STKC">${JUNK()}</div>
${plate("kippe-pl", 110, 810, 640, 150, "ALAMOGORDO", 84, `background:#2E8B4E;`, "#fff")}
${fl.map(([x, y], i) => `      <div id="kippe-f${i}" class="kippe-f" style="left:${x}px;top:${y}px;">${FLY()}</div>`).join("\n")}`, p),
    `      tl.fromTo("#kippe-pl", { scale: 0.7, rotation: -5 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2.6)" }, 0);
      tl.fromTo("#kippe-jk", { scaleY: 0.85 }, { scaleY: 1, duration: 0.35, ease: "back.out(2)" }, 0.05);
      tl.to("#kippe-pl", { keyframes: { rotation: [0, -1.5, 1.5, 0] }, duration: 1.4, ease: "sine.inOut" }, 0.6);
${fl.map(([, , t0], i) => `      tl.fromTo("#kippe-f${i}", { x: 0, y: 0 }, { keyframes: { x: [0, 30, 0, -30, 0], y: [0, -20, -36, -20, 0] }, duration: 0.7, ease: "none", repeat: ${Math.floor(d / 0.7) - 1}, immediateRender: true }, ${t0 * 0.3});`).join("\n")}`));
}

// ================= GRABEN: excavator digs behind barrier tape, sand pile grows (c09) =================
{
  const p = "graben";
  const [s, d] = S(p);
  scenes.push(scene(p, "Bagger und Absperrband", s, d,
    `#graben-dg{${abs(120, 830, 560, 420)}}
     #graben-pi{${abs(700, 1110, 260, 210)}transform-origin:50% 100%;}
     #graben-tp{${abs(100, 1250, 880, 110)}}
     .graben-cl{position:absolute;width:40px;height:40px;}`,
    stk(`      <div id="graben-dg" class="STKC">${DIGGER("graben")}</div>
      <div id="graben-pi" class="STKC">${PILE()}</div>
${[0, 1, 2].map((i) => `      <div id="graben-cl${i}" class="graben-cl STKC" style="left:${700 + i * 40}px;top:${1110 + i * 10}px;">${CLOD()}</div>`).join("\n")}
      <div id="graben-tp" class="STKC">${TAPE("graben")}</div>`, p),
    `      gsap.set("#graben-bm", { svgOrigin: "136 246" }); gsap.set("#graben-st", { svgOrigin: "324 94" }); gsap.set("#graben-bk", { svgOrigin: "466 234" });
      tl.fromTo("#graben-bm", { rotation: 0 }, { keyframes: { rotation: [0, 10, 10, -8, -8, 0] }, duration: 1.8, ease: "sine.inOut", immediateRender: true }, 0);
      tl.fromTo("#graben-st", { rotation: 0 }, { keyframes: { rotation: [0, 14, 14, -6, -6, 0] }, duration: 1.8, ease: "sine.inOut", immediateRender: true }, 0);
      tl.fromTo("#graben-bk", { rotation: 0 }, { keyframes: { rotation: [0, 25, 25, -40, -40, 0] }, duration: 1.8, ease: "sine.inOut", immediateRender: true }, 0);
      tl.fromTo("#graben-pi", { scaleY: 0.7 }, { keyframes: { scaleY: [0.7, 0.7, 0.85, 1] }, duration: 1.6, ease: "none", immediateRender: true }, 0);
${[0, 1, 2].map((i) => `      tl.fromTo("#graben-cl${i}", { x: 0, y: 0, opacity: 0 }, { keyframes: { x: [0, ${20 + i * 30}, ${40 + i * 40}], y: [0, -50, 60], opacity: [1, 1, 0] }, duration: 0.6, ease: "power1.in", immediateRender: true }, ${f2(1.0 + i * 0.08)});`).join("\n")}
${tapeWave("graben", 0, d)}`));
}

// ================= FUND: E.T. modules rise out of the sand, sparkles (c10) =================
{
  const p = "fund";
  const [s, d] = S(p);
  const xs = [150, 340, 530, 720];
  const b = burst("fund-sp", 10, 540, 1010, 56, 380, 2014, [YEL, "#fff"], 0.5);
  scenes.push(scene(p, "Module tauchen aus dem Sand auf", s, d,
    `#fund-bk{${abs(110, 1080, 860, 290)}}
     #fund-fr{${abs(110, 1190, 860, 180)}}
     .mod{transform-origin:50% 100%;}`,
    stk(`      <div id="fund-bk" class="STKC">${SV(880, 290, `<path d="M0 290 V90 C200 40 360 30 440 40 C560 52 720 70 880 50 V290 Z" fill="${SAND}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>`)}</div>
${xs.map((x, i) => modBox(`fund-m${i}`, x, 930 + (i % 2) * 30, 0.85, ET, "STKC", "?")).join("\n")}
      <div id="fund-fr" class="STKC">${DUNE_FRONT()}</div>
${b.html}`, p),
    `${xs.map((_, i) => `      tl.fromTo("#fund-m${i}", { y: 150, rotation: ${i % 2 ? 8 : -8} }, { y: 0, rotation: ${i % 2 ? -4 : 4}, duration: 0.45, ease: "back.out(1.8)" }, ${f2(0.1 + i * 0.15)});`).join("\n")}
${b.js(0.75)}
${xs.map((_, i) => `      tl.to("#fund-m${i}", { keyframes: { y: [0, -10, 0] }, duration: 0.5, ease: "sine.inOut", repeat: 1 }, ${f2(1.0 + i * 0.07)});`).join("\n")}`));
}

// ================= KISTE: plate "RUND 1.300", modules drop into a crate (c11) =================
{
  const p = "kiste";
  const [s, d] = S(p);
  const ms = Array.from({ length: 9 }, (_, i) => [330 + (i % 5) * 80 + (i >= 5 ? 40 : 0), LABELS[i % LABELS.length], f2(0.15 + i * 0.16)]);
  scenes.push(scene(p, "Kiste fuellt sich, RUND 1.300", s, d,
    `#kiste-pl{transform-origin:50% 50%;}
     #kiste-cb{${abs(300, 1130, 480, 240)}} #kiste-cf{${abs(300, 1130, 480, 240)}}
     #kiste-cl{${abs(300, 1000, 480, 290)}overflow:hidden;}
     .kiste-m{position:absolute;top:150px;}`,
    stk(`${plate("kiste-pl", 210, 806, 660, 160, "RUND 1.300", 110)}
      <div id="kiste-cb" class="STKC">${CRATE(false)}</div>
      <div id="kiste-cl">
${ms.map(([x, lab], i) => `        <div id="kiste-m${i}" class="kiste-m" style="left:${x - 300}px;width:70px;height:84px;">${MODULE(lab[0], lab[1])}</div>`).join("\n")}
      </div>
      <div id="kiste-cf" class="STKC">${CRATE(true)}</div>`, p),
    `      tl.fromTo("#kiste-pl", { scale: 0.6, rotation: -6 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2.6)" }, 0);
      tl.to("#kiste-pl", { keyframes: { scale: [1, 1.06, 1] }, duration: 0.5, ease: "sine.inOut", repeat: 1 }, 0.9);
${ms.map(([, , t0], i) => `      tl.fromTo("#kiste-m${i}", { y: -150, rotation: ${i % 2 ? 20 : -20} }, { y: ${20 + (i % 3) * 14}, rotation: ${i % 2 ? -10 : 10}, duration: 0.35, ease: "bounce.out", immediateRender: true }, ${t0});`).join("\n")}
${shake("#kiste-cf", 1.6, 5, 0.3)}`));
}

// ================= LEGENDE: plate LEGENDE, checkbox with a "?", magnifier sweeps (c12) =================
{
  const p = "legende";
  const [s, d] = S(p);
  scenes.push(scene(p, "LEGENDE mit Fragezeichen-Kaestchen", s, d,
    `#legende-pl{transform-origin:50% 50%;}
     #legende-cb{${abs(400, 1050, 240, 240)}transform-origin:50% 50%;}
     #legende-q{${abs(400, 1080, 240, 200)}${LBL(180, YEL)}-webkit-text-stroke:16px ${K};paint-order:stroke fill;transform-origin:50% 80%;}
     #legende-ln{${abs(660, 1010, 220, 280)}transform-origin:50% 50%;}`,
    stk(`${plate("legende-pl", 240, 820, 600, 150, "LEGENDE", 100, `background:#F6E3B8;`)}
      <div id="legende-cb" class="STKC">${CHECKBOX()}</div>
      <div id="legende-q">?</div>
      <div id="legende-ln" class="STKC">${LENS()}</div>`, p),
    `      tl.fromTo("#legende-pl", { scale: 0.7 }, { scale: 1, duration: 0.3, ease: "back.out(2.4)" }, 0);
      tl.fromTo("#legende-cb", { scale: 0.6, rotation: -10 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2.6)" }, 0.05);
      tl.fromTo("#legende-q", { scale: 0.5 }, { scale: 1, duration: 0.3, ease: "back.out(3)" }, 0.25);
      tl.to("#legende-q", { keyframes: { rotation: [0, -10, 8, -5, 0] }, duration: 0.9, ease: "sine.inOut" }, 0.6);
      tl.fromTo("#legende-ln", { x: 0, y: 0, rotation: 0 }, { keyframes: { x: [0, -380, -460, -40], y: [0, -40, 30, 10], rotation: [0, -10, 6, 0] }, duration: 1.8, ease: "sine.inOut" }, 0);`));
}

// ================= MILLIONEN: plate MILLIONEN gets crossed out with a red line (c13) =================
{
  const p = "millionen";
  const [s, d] = S(p);
  scenes.push(scene(p, "MILLIONEN durchgestrichen", s, d,
    `#mil-pl{transform-origin:50% 50%;}
     #mil-sx{${abs(160, 880, 760, 220)}}
     #mil-hp{${abs(230, 1150, 620, 220)}transform-origin:50% 100%;}`,
    stk(`${plate("mil-pl", 170, 900, 740, 180, "MILLIONEN", 120)}
      <div id="mil-hp" class="STKC">${SV(620, 220, `<path d="M0 220 C60 150 160 110 310 110 C460 110 560 150 620 220 Z" fill="${SAND}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>${[[90, 140, -14, 0], [180, 120, 10, 1], [270, 100, -6, 2], [360, 110, 16, 3], [450, 130, -10, 4]].map(([x, y, a, li]) => `<g transform="rotate(${a} ${x + 34} ${y + 40})"><rect x="${x}" y="${y}" width="68" height="82" rx="10" fill="${MODG}" stroke="${K}" stroke-width="6"/><rect x="${x + 10}" y="${y + 10}" width="48" height="36" rx="6" fill="${LABELS[li][0]}"/></g>`).join("")}`)}</div>
      <div id="mil-sx">${STRIKE()}</div>`, p),
    `      tl.fromTo("#mil-pl", { scale: 0.6 }, { scale: 1, duration: 0.3, ease: "back.out(2.4)" }, 0);
      tl.fromTo(["#mil-sk", "#mil-sr"], { attr: { "stroke-dasharray": "0 900" } }, { attr: { "stroke-dasharray": "800 900" }, duration: 0.35, ease: "power2.out", immediateRender: true }, 0.7);
${shake("#mil-pl", 1.05, 12, 0.4)}
      tl.fromTo("#mil-hp", { scaleY: 1 }, { scaleY: 0.82, duration: 0.5, ease: "power2.inOut" }, 1.1);`));
}

// ================= HAUFEN (punchline): heap of modules, plate RUND 700.000 (smaller than the caption), sparkles, shake (c14) =================
{
  const p = "haufen";
  const [s, d] = S(p);
  const b = burst("haufen-sp", 12, 540, 1150, 60, 400, 700, [YEL, "#fff", ORANGE], 0.45);
  scenes.push(scene(p, "Haufen Module, RUND 700.000", s, d,
    `#haufen-pl{transform-origin:50% 50%;}
     #haufen-hp{${abs(142, 990, 796, 380)}transform-origin:50% 100%;}`,
    stk(`      <div id="haufen-hp" class="STKC">${HEAP()}</div>
${plate("haufen-pl", 180, 820, 720, 150, "RUND 700.000", 96, `background:${YEL};`)}
${b.html}`, p),
    `      tl.fromTo("#haufen-hp", { scaleY: 0.75, scaleX: 0.92 }, { scaleY: 1, scaleX: 1, duration: 0.4, ease: "back.out(2)" }, 0);
      tl.fromTo("#haufen-pl", { scale: 0.5, rotation: -8 }, { scale: 1, rotation: 0, duration: 0.25, ease: "back.out(2.6)" }, 0.2);
${shake("#haufen-hp", 0.45, 12, 0.45)}
${b.js(0.45)}
      tl.to("#haufen-pl", { keyframes: { scale: [1, 1.06, 1], rotation: [0, 2, 0] }, duration: 0.5, ease: "sine.inOut", repeat: 2 }, 0.9);`));
}

// ================= MUSEUM: display case with a module, spotlight, rope posts, glints (c15) =================
{
  const p = "museum";
  const [s, d] = S(p);
  scenes.push(scene(p, "Vitrine im Museum", s, d,
    `#museum-co{${abs(280, 790, 520, 580)}transform-origin:50% 0%;}
     #museum-pd{${abs(360, 1180, 360, 190)}}
     #museum-gl{${abs(380, 856, 320, 330)}}
     #museum-m{transform-origin:50% 50%;}
     #museum-r0{${abs(110, 1170, 250, 200)}} #museum-r1{${abs(720, 1170, 250, 200)}}
     .museum-gs{position:absolute;width:60px;height:60px;}`,
    stk(`      <div id="museum-co">${CONE("museum")}</div>
      <div id="museum-pd" class="STKC">${PEDESTAL()}</div>
${modBox("museum-m", 450, 930, 0.9, ET, "STKC", "?")}
      <div id="museum-gl">${GLASS()}</div>
      <div id="museum-r0" class="STKC">${ROPE(false)}</div>
      <div id="museum-r1" class="STKC">${ROPE(true)}</div>
${[[400, 880], [640, 1000], [420, 1110]].map(([x, y], i) => `      <div id="museum-g${i}" class="museum-gs" style="left:${x}px;top:${y}px;">${SPARK("#fff")}</div>`).join("\n")}`, p),
    `      tl.fromTo("#museum-co", { opacity: 0.3, scaleX: 0.8 }, { keyframes: { opacity: [0.3, 1, 0.6, 1], scaleX: [0.8, 1, 1, 1] }, duration: 0.4, ease: "none", immediateRender: true }, 0);
      tl.fromTo("#museum-m", { scale: 0.9, y: 10 }, { scale: 1, y: 0, duration: 0.35, ease: "back.out(2)" }, 0.05);
      tl.to("#museum-m", { keyframes: { rotation: [0, -4, 4, 0], y: [0, -8, 0, 0] }, duration: 1.6, ease: "sine.inOut" }, 0.6);
${[0, 1, 2].map((i) => `      tl.fromTo("#museum-g${i}", { scale: 0, rotation: 0 }, { keyframes: { scale: [0, 1, 0], rotation: [0, 90] }, duration: 0.6, ease: "power1.inOut", repeat: 1, repeatDelay: 0.4, immediateRender: true }, ${f2(0.3 + i * 0.3)});`).join("\n")}`));
}

// ================= FRAGE + loop: comment bubble with typing dots and a "?", then the hook picture again (c16 + c17) =================
{
  const p = "frage";
  const [s, d] = S(p);
  const LOOP = f2(C.c17[0] - s);
  const hookIds = ["#frage-sun", "#frage-db", "#frage-df", "#frage-ca", "#frage-gr", ...HM.map(([, , , , li]) => `#frage-m${li}`)];
  scenes.push(scene(p, "Frage und Loop", s, d, hookCss(p) + `
     #frage-bb{${abs(170, 800, 740, 440)}transform-origin:30% 100%;}
     .frage-dt{position:absolute;width:70px;height:70px;border-radius:35px;background:${MODG};border:7px solid ${K};}
     #frage-q{${abs(700, 860, 180, 190)}${LBL(170, YEL)}-webkit-text-stroke:16px ${K};paint-order:stroke fill;transform-origin:50% 90%;}`,
    hookBody(p) + `
      <div id="frage-bb" class="frage-stk">${BUBBLE()}</div>
${[0, 1, 2].map((i) => `      <div id="frage-dt${i}" class="frage-dt" style="left:${330 + i * 120}px;top:960px;"></div>`).join("\n")}
      <div id="frage-q">?</div>`,
    `      gsap.set([${hookIds.map((x) => `"${x}"`).join(", ")}], { opacity: 0 });
      tl.fromTo("#frage-bb", { scale: 0.85, rotation: -4 }, { scale: 1, rotation: 0, duration: 0.35, ease: "back.out(2)" }, 0);
      tl.fromTo("#frage-q", { scale: 0.6, rotation: 20 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2.6)" }, 0.2);
      tl.to("#frage-q", { keyframes: { rotation: [0, -8, 6, -4, 0] }, duration: 0.9, ease: "sine.inOut", repeat: 1 }, 0.5);
${[0, 1, 2].map((i) => `      tl.fromTo("#frage-dt${i}", { y: 0 }, { keyframes: { y: [0, -26, 0, 0] }, duration: 0.6, ease: "sine.inOut", repeat: 3, immediateRender: true }, ${f2(i * 0.15)});`).join("\n")}
      // loop (${LOOP}): hard switch in one frame - bubble gone, hook picture in its frame-0 pose
      tl.set(["#frage-bb", "#frage-q", "#frage-dt0", "#frage-dt1", "#frage-dt2"], { opacity: 0 }, ${LOOP});
      tl.set([${hookIds.map((x) => `"${x}"`).join(", ")}], { opacity: 1 }, ${LOOP});
${hookIdle(p, LOOP, f2(d - LOOP))}`,
    { exit: false, kb: false }));
}

// ================= background: desert at sunset - sky gradient, a few stars at the top, distant dunes and cactus silhouettes (loop-seamless) =================
{
  const RS = mulberry32(1200);
  const stars = Array.from({ length: 22 }, (_, i) => ({ x: Math.round(40 + RS() * 1000), y: Math.round(30 + RS() * 230), r: +(2 + RS() * 2.5).toFixed(1), g: i % 3 }));
  const far = "M0 1330 C160 1280 300 1270 440 1300 C600 1334 760 1270 900 1262 C980 1258 1040 1270 1080 1280 L1080 1920 L0 1920 Z";
  const near = "M0 1470 C180 1420 360 1410 520 1440 C700 1474 880 1420 1080 1430 L1080 1920 L0 1920 Z";
  const sil = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-12 0 V-150 Q-12 -170 0 -170 Q12 -170 12 -150 V0 Z M-12 -70 H-30 Q-42 -70 -42 -84 V-120 Q-42 -130 -34 -130 Q-26 -130 -26 -120 V-86 H-12 Z M12 -96 H30 Q42 -96 42 -110 V-136 Q42 -146 34 -146 Q26 -146 26 -136 V-112 H12 Z" fill="#3A1C46"/></g>`;
  fs.writeFileSync(path.join(OUT, "compositions", "bg.html"), `<template>
  <style>
    #root { position: absolute; inset: 0; overflow: hidden; background: #0E1530; }
    #bg-sky { position: absolute; inset: 0; background: linear-gradient(180deg, #0E1530 0%, #1A1C4E 28%, #3B2462 46%, #8A3468 60%, #E2574C 70%, #FF9A3C 76%, #FFC36B 80%, #8A3468 80.5%, #5A2A5E 100%); }
    #bg-dn { position: absolute; left: 0; top: 0; }
    .bg-st { position: absolute; left: 0; top: 0; }
  </style>
  <div id="root" data-composition-id="bg" data-width="1080" data-height="1920" data-layout-allow-overflow>
    <div id="bg-sky"></div>
${[0, 1, 2].map((g) => `    <svg id="bg-st${g}" class="bg-st" width="1080" height="1920">${stars.filter((s) => s.g === g).map((s) => `<circle cx="${s.x}" cy="${s.y}" r="${s.r}" fill="#fff" opacity=".7"/>`).join("")}</svg>`).join("\n")}
    <svg id="bg-dn" width="1080" height="1920" viewBox="0 0 1080 1920"><path d="${far}" fill="#B0475E"/>${sil(60, 1300, 0.8)}${sil(1010, 1276, 0.7)}<path d="${near}" fill="#6A2E5C"/>${sil(560, 1446, 0.55)}<path d="M0 1600 C220 1570 420 1580 600 1600 C800 1622 960 1590 1080 1596 L1080 1920 L0 1920 Z" fill="#4A2350"/></svg>
  </div>
  <script>
    (function () {
      const tl = gsap.timeline({ paused: true });
      // twinkle: whole periods over the film, so the last frame leads straight back into frame 0
${[0, 1, 2].map((g) => `      tl.fromTo("#bg-st${g}", { opacity: 1 }, { keyframes: { opacity: [1, ${[0.35, 0.5, 0.4][g]}, 1] }, duration: ${(LAST / (6 + g * 2)).toFixed(5)}, ease: "sine.inOut", repeat: ${5 + g * 2} }, 0);`).join("\n")}
      window.__timelines["bg"] = tl;
    })();
  </script>
</template>
`);
}

// ================= captions =================
// "*" keyword (yellow Lilita, 140 px), "!" punchline (largest, 200 px). "/" line break.
// "+" glues a word to the one before (no gap): counted as one word.
// Fixed word gap: every word has 11 px margins. No negative letter spacing anywhere.
// Against orphans / over-wide lines (each change keeps the meaning): hook "1983. / In der WÜSTE / Spiele vergraben?!",
// "UNVERKAUFT: / viele Module / bleiben liegen.", "Die Legende: / MILLIONEN / sind verbuddelt.", "Auf einer / Müllkippe in / New Mexico.", "Und tatsächlich: / echte E.T.-Module!", "Geborgen: rund / 1.300 Stück.",
// "Fast. Aber / MILLIONEN / waren es nicht.", "Sondern rund / 700.000 / Module insgesamt.", "Welchen Gaming- / Mythos sollen / wir checken?".
const HOOKW = ["*1983.", "/", "In", "der", "*WÜSTE", "/", "Spiele", "vergraben?!"];
const caps = [
  { id: "c01", words: HOOKW, still: true },
  { id: "c02", words: ["Jahrzehntelang", "/", "hieß", "es:", "nur", "/", "ein", "*MYTHOS."] },
  { id: "c03", words: ["Die", "Firma:", "Atari."] },
  { id: "c04", words: ["Das", "Spiel:", "E.T."] },
  { id: "c05", words: ["Eines", "der", "/", "schlechtesten", "/", "Spiele", "überhaupt."] },
  { id: "c06", words: ["*UNVERKAUFT:", "/", "viele", "Module", "/", "bleiben", "liegen."], shake: true, wide: true },
  { id: "c07", words: ["Die", "Legende:", "/", "*MILLIONEN", "/", "sind", "verbuddelt."] },
  { id: "c08", words: ["Auf", "einer", "/", "Müllkippe", "in", "/", "New", "Mexico."] },
  { id: "c09", words: ["2014:", "Ein", "Team", "/", "*GRÄBT", "nach."], shake: true },
  { id: "c10", words: ["Und", "tatsächlich:", "/", "echte", "E.T.-Module!"], cls: "s88" },
  { id: "c11", words: ["Geborgen:", "rund", "/", "*1.300", "Stück."] },
  { id: "c12", words: ["Die", "Legende", "/", "stimmte", "also?"] },
  { id: "c13", words: ["Fast.", "Aber", "/", "*MILLIONEN", "/", "waren", "es", "nicht."], shake: true },
  { id: "c14", words: ["Sondern", "rund", "/", "!700.000", "/", "Module", "insgesamt."], shake: true },
  { id: "c15", words: ["Ein", "Modul", "steht", "/", "heute", "im", "Museum."], cls: "s88" },
  { id: "c16", words: ["Welchen", "Gaming-", "/", "+Mythos", "sollen", "/", "wir", "checken?"], hard: true },
  { id: "c17", words: HOOKW, loop: true },
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
    const txt = NUMDOT((k ? core(w).slice(1) : core(w)).replace(/</g, "&lt;"));
    const nx = c.words[i + 1] === "/" ? c.words[i + 2] : c.words[i + 1];
    const gl = [glue(w) ? "gl" : "", nx && glue(nx) ? "gr" : ""].filter(Boolean).join(" ");
    const cls = { "*": "w kw", "!": "w pt", "": "w" }[k] + (gl ? " " + gl : "");
    return `<span id="${c.id}-o${i}" class="${cls}"><span id="${c.id}-w${i}" class="g">${txt}</span></span>`;
  });
  let inner = "";
  spans.forEach((sp, i) => { inner += (i && !glue(c.words[i]) ? " " : "") + sp; });
  capHtml += `      <div id="${c.id}" class="cap clip${c.cls ? " " + c.cls : ""}" data-start="${c.s}" data-duration="${d}" data-track-index="${track}" data-layout-allow-overlap>${inner.replace(/ <br\/> /g, "<br/>").replace(/ <br\/>/g, "<br/>").replace(/<br\/> /g, "<br/>")}</div>\n`;
  capJs += `      // ${c.id}\n`;
  let full = c.s, n = 0, wc = 0;
  c.words.forEach((w, i) => {
    const k = kind(w);
    if (k === "br") return;
    if (!glue(w)) wc++;
    if (c.still) { // frame 0: the whole hook line is already readable
      if (k) capJs += `      tl.to("#${c.id}-w${i}", { keyframes: { scale: [1, 0.95, 1], y: [0, -8, 0] }, duration: 0.4, ease: "power1.inOut" }, 0.3);\n`;
      return;
    }
    if (c.loop) { full = c.s; return; }
    const at = f2(c.s + 0.02 + n * ST);
    if (!glue(w)) n++;
    if (k) {
      // no scale overshoot: the ink of the keyword never gets wider than in its rest pose (x 80-1000 in every frame)
      capJs += `      tl.fromTo("#${c.id}-w${i}", { opacity: 0, scale: 0.7, rotation: ${c.wide ? 0 : -6} }, { opacity: 1, scale: 1, rotation: 0, duration: ${KD}, ease: "power3.out" }, ${at});\n`;
      capJs += `      tl.fromTo("#${c.id}-o${i}", { y: 22 }, { y: 0, duration: ${KD}, ease: "back.out(2.6)" }, ${at});\n`;
      if (c.shake) capJs += c.wide ? `      tl.to("#${c.id}-w${i}", { keyframes: { y: [0, -10, 8, -5, 3, 0], scale: [1, 0.97, 1, 0.98, 1, 1] }, duration: 0.36, ease: "none" }, ${f2(at + 0.28)});\n`
        : `      tl.to("#${c.id}-w${i}", { keyframes: { x: [0, -10, 10, -6, 4, 0], rotation: [0, -3, 3, -2, 0, 0] }, duration: 0.36, ease: "none" }, ${f2(at + 0.28)});\n`;
      full = Math.max(full, at + KD);
    } else {
      capJs += `      tl.fromTo("#${c.id}-w${i}", { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: ${PD}, ease: "power3.out" }, ${at});\n`;
      capJs += `      tl.fromTo("#${c.id}-o${i}", { y: 26 }, { y: 0, duration: ${PD}, ease: "back.out(1.6)" }, ${at});\n`;
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
    .cap.s88 { font-size: 88px; } /* long lines ("echte E.T.-Module!", "heute im Museum.") stay under 920 px without a smaller word gap */
    .w.gl { margin-left: 0; } .w.gr { margin-right: 0; }
    .g { display: inline-block; }
    .kw { font-family: 'Lilita One'; font-weight: 400; color: ${YEL}; font-size: 140px; line-height: 1.0; text-transform: uppercase; letter-spacing: 0.02em; }
    .pt { font-family: 'Lilita One'; font-weight: 400; color: ${YEL}; font-size: 200px; line-height: 1.0; letter-spacing: 0.02em; -webkit-text-stroke: 16px ${K}; text-shadow: 0 14px 0 #050814; }
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

// ================= Klotz (rig from Folge 1-11; new gag: mini shovel - finds a sock and a tiny cactus - and a module trophy) =================
// eyes always open: no mood closes the lids, no wink. The right arm never points outward to the right.
// While he holds the shovel the left arm stays at 70 deg (hand on the grip); while he holds the trophy it stays raised at 135 deg.
const M = {
  shock:      { eye: 1.12, ps: 0.6, px: 0, py: 0, bL: -18, bR: -18, tL: -6, tR: -6, mx: 1, my: 1.1, g: 0, aL: 70, aR: -45 },
  surprised:  { eye: 1.08, ps: 0.8, px: 0, py: 6, bL: -16, bR: -16, tL: 0, tR: 0, mx: 0.55, my: 0.6, g: 0, aL: 55, aR: -45 },
  curious:    { eye: 1.05, ps: 1.1, px: -14, py: -10, bL: -18, bR: -4, tL: 0, tR: 0, mx: 0.5, my: 0.35, g: 0, aL: 40, aR: -40 },
  look:       { eye: 1.06, ps: 1.0, px: -14, py: -12, bL: -14, bR: -14, tL: -4, tR: -4, mx: 0.5, my: 0.5, g: 0, aL: 40, aR: -40 },
  dig:        { eye: 1.06, ps: 1.0, px: -16, py: 14, bL: -10, bR: -14, tL: -4, tR: 2, mx: 0.4, my: 0.35, g: 0, aL: 70, aR: -40 },
  down:       { eye: 1.14, ps: 0.75, px: -10, py: 16, bL: -20, bR: -20, tL: -4, tR: -4, mx: 0.8, my: 0.9, g: 0, aL: 55, aR: -45 },
  impressed:  { eye: 1.05, ps: 0.9, px: -6, py: -4, bL: -12, bR: -12, tL: -4, tR: -4, mx: 0.45, my: 0.45, g: 0, aL: 40, aR: -40 },
  jawdrop:    { eye: 1.18, ps: 0.55, px: -6, py: -8, bL: -22, bR: -22, tL: -4, tR: -4, mx: 1.1, my: 1.7, jy: 14, g: 0, aL: 60, aR: -45 },
  happy:      { eye: 1.04, ps: 1, px: 0, py: 0, bL: -10, bR: -10, tL: -4, tR: -4, mx: 0, my: 0, g: 1, gs: 0.8, aL: 35, aR: -35 },
  proud:      { eye: 1.04, ps: 1, px: -10, py: -10, bL: -14, bR: -14, tL: -4, tR: -4, mx: 0, my: 0, g: 1, gs: 0.9, aL: 135, aR: -35 },
  eager:      { eye: 1.08, ps: 1.05, px: -10, py: -6, bL: -16, bR: -16, tL: -4, tR: -4, mx: 0, my: 0, g: 1, gs: 0.75, aL: 70, aR: -40 },
};
const LOOPK = C.c17[0];
const DIG_ON = f2(C.c09[0] + 0.3), SOCK_T = f2(C.c09[0] + 1.45), CAC_T = f2(C.c10[0] + 1.15), DIG_OFF = f2(C.c11[0] + 0.3);
const TRO_ON = f2(C.c15[0] + 0.5);
const moods = [
  [C.c02[0], "curious"], [C.c03[0], "look"], [C.c04[0], "surprised"], [C.c05[0], "down"], [C.c06[0], "look"], [C.c07[0], "eager"],
  [C.c08[0], "curious"], [C.c09[0], "dig"], [f2(SOCK_T + 0.1), "surprised"], [C.c10[0], "dig"], [f2(CAC_T + 0.05), "shock"],
  [C.c11[0], "impressed"], [C.c12[0], "curious"], [C.c13[0], "surprised"], [f2(C.c13[0] + 0.75), "jawdrop"], [C.c14[0], "shock"],
  [f2(C.c14[0] + 1.3), "happy"], [C.c15[0], "eager"], [TRO_ON, "proud"], [f2(LOOPK + 0.03), "shock"],
];
const armL = (t, def) => (t >= DIG_ON - 0.2 && t < DIG_OFF ? 70 : t >= TRO_ON - 0.05 && t < LOOPK ? 135 : def);

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
// Klotz props: mini shovel (in his left hand), sock and tiny cactus (pop out of the sand left of him), sand puffs, module trophy
const SHOVEL = () => SV(140, 150, `<path d="M117 38 L52 104" stroke="${K}" stroke-width="16" stroke-linecap="round"/><path d="M117 38 L52 104" stroke="${WOOD}" stroke-width="8" stroke-linecap="round"/>
  <path d="M104 26 L130 52" stroke="${K}" stroke-width="16" stroke-linecap="round"/><path d="M104 26 L130 52" stroke="${WOOD_D}" stroke-width="8" stroke-linecap="round"/>
  <path d="M58 92 Q70 112 56 128 Q40 146 16 140 Q6 116 22 100 Q38 86 58 92 Z" fill="${METAL}" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>`);
const SOCK = () => SV(90, 120, `<path d="M20 6 H62 V70 Q62 78 70 82 Q88 92 84 106 Q80 116 62 114 L30 108 Q14 104 16 86 Z" fill="#fff" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>
  <path d="M20 22 H62 M20 38 H62" stroke="${RED}" stroke-width="8"/><path d="M60 112 Q70 96 84 104" fill="none" stroke="${SKY}" stroke-width="8" stroke-linecap="round"/>`);
const MINICAC = () => SV(70, 100, `<path d="M26 96 V30 Q26 14 36 14 Q46 14 46 30 V96 Z" fill="${CAC}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><path d="M28 60 H18 Q8 60 8 48 V36 Q8 28 14 28 Q20 28 20 36 V48 H28" fill="${CAC}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
  <circle cx="36" cy="10" r="8" fill="#FF6FAE" stroke="${K}" stroke-width="5"/><rect x="14" y="88" width="44" height="12" rx="5" fill="${SAND_D}" stroke="${K}" stroke-width="5"/>`);
let kJs = "";
const setMood = (m, t, dur) => {
  const p = { ...M[m] };
  p.aL = armL(t, p.aL);
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
const PROPS = ["#k-shovel", "#k-sock", "#k-cac", "#k-trophy", "#k-pf0", "#k-pf1", "#k-ts0", "#k-ts1", "#k-ts2"];
kJs += `      gsap.set("#k-armL", { svgOrigin: "48 190" }); gsap.set("#k-armR", { svgOrigin: "252 190" });
      gsap.set(["#k-eyeL"], { svgOrigin: "108 140" }); gsap.set(["#k-eyeR"], { svgOrigin: "192 140" });
      gsap.set("#k-pupL", { svgOrigin: "108 142" }); gsap.set("#k-pupR", { svgOrigin: "192 142" });
      gsap.set("#k-lidL", { svgOrigin: "108 90" }); gsap.set("#k-lidR", { svgOrigin: "192 90" });
      gsap.set("#k-browL", { svgOrigin: "109 81" }); gsap.set("#k-browR", { svgOrigin: "191 81" });
      gsap.set("#k-mouth", { svgOrigin: "150 228" }); gsap.set("#k-grin", { svgOrigin: "150 230" });
      gsap.set(["#k-chkL", "#k-chkR"], { svgOrigin: "150 198", opacity: 0.4 });
      gsap.set("#k-sweat", { svgOrigin: "262 92", opacity: 0, scale: 0 });
      gsap.set([${PROPS.map((x) => `"${x}"`).join(", ")}], { opacity: 0, scale: 0, x: 0, y: 0, rotation: 0 });
      gsap.set("#k-shovel", { transformOrigin: "83% 25%" }); gsap.set(["#k-sock", "#k-cac"], { transformOrigin: "50% 100%" }); gsap.set("#k-trophy", { transformOrigin: "70% 100%" });
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
      tl.to("#k-sweat", { opacity: 1, scale: 1, duration: 0.2, ease: "back.out(2)" }, 0.2);
      tl.to("#k-sweat", { keyframes: { y: [0, 30], opacity: [1, 0] }, duration: 0.6, ease: "power1.in" }, 1.2);
`;
for (const [t, m] of moods) {
  kJs += `      // ${m} @ ${f2(t)}\n`;
  kJs += `      tl.to("#k-sq", { keyframes: { scaleY: [1, 0.9, 1.06, 1], scaleX: [1, 1.07, 0.97, 1] }, duration: 0.3, ease: "none" }, ${f2(t - 0.05)});\n`;
  kJs += setMood(m, f2(t + 0.03), 0.22);
}
const dig = (t0, n) => `      tl.to("#k-shovel", { keyframes: { rotation: [0, -22, 12, 0], y: [0, 10, -6, 0] }, duration: 0.42, ease: "sine.inOut", repeat: ${n - 1} }, ${t0});
      tl.to("#k-wrap", { keyframes: { rotation: [0, -4, 2, 0] }, duration: 0.42, ease: "sine.inOut", repeat: ${n - 1} }, ${t0});
${[0, 1].map((i) => `      tl.set("#k-pf${i}", { scale: 0.3, opacity: 1, x: 0, y: 0 }, ${f2(t0 + 0.12 + i * 0.05)});
      tl.to("#k-pf${i}", { keyframes: { scale: [0.3, 1, 1.1], opacity: [1, 0.9, 0], x: [0, ${i ? 18 : -22}, ${i ? 30 : -36}], y: [0, -24, -40] }, duration: 0.42, ease: "power1.out", repeat: ${n - 1} }, ${f2(t0 + 0.12 + i * 0.05)});`).join("\n")}
`;
kJs += `      // GAG 1 (${DIG_ON}): mini shovel - he digs along with the team, finds a sock
      tl.to("#k-shovel", { opacity: 1, scale: 1, duration: 0.22, ease: "back.out(2.6)" }, ${DIG_ON});
${dig(f2(DIG_ON + 0.25), 2)}      tl.to("#k-sock", { keyframes: { opacity: [0, 1, 1], scale: [0.3, 1.15, 1], y: [30, -40, 0], rotation: [0, -20, 8] }, duration: 0.45, ease: "power2.out" }, ${SOCK_T});
      tl.to("#k-sock", { keyframes: { rotation: [8, -6, 8] }, duration: 0.5, ease: "sine.inOut", repeat: 0 }, ${f2(SOCK_T + 0.5)});
      tl.to("#k-sock", { keyframes: { x: [0, -30], y: [0, 60], opacity: [1, 0], rotation: [8, -40] }, duration: 0.3, ease: "power2.in" }, ${f2(C.c10[0] + 0.15)});
      // c10: digs again, finds only a tiny cactus (sweat)
${dig(f2(C.c10[0] + 0.3), 2)}      tl.to("#k-cac", { keyframes: { opacity: [0, 1, 1], scale: [0.3, 1.2, 1], y: [30, -20, 0] }, duration: 0.4, ease: "back.out(2)" }, ${CAC_T});
      tl.to("#k-sweat", { opacity: 1, scale: 1, y: 0, duration: 0.2, ease: "back.out(2)" }, ${f2(CAC_T + 0.1)});
      tl.to("#k-sweat", { keyframes: { y: [0, 30], opacity: [1, 0] }, duration: 0.5, ease: "power1.in" }, ${f2(C.c11[0] + 0.3)});
      tl.to("#k-cac", { keyframes: { opacity: [1, 0], scale: [1, 0.3], y: [0, 30] }, duration: 0.3, ease: "power2.in" }, ${f2(C.c11[0] + 0.2)});
      tl.to("#k-shovel", { keyframes: { opacity: [1, 0], scale: [1, 0.4], rotation: [0, -30] }, duration: 0.3, ease: "power2.in" }, ${DIG_OFF});
      // c12: he leans forward and back (on his spot)
      tl.to("#k-wrap", { keyframes: { rotation: [0, -9, -9, 0], y: [0, 4, 4, 0] }, duration: 1.4, ease: "power2.inOut" }, ${f2(C.c12[0] + 0.1)});
      // GAG 2 (${TRO_ON}): he holds up a module of his own like a trophy, little sparkles
      tl.to("#k-trophy", { opacity: 1, scale: 1, rotation: -6, duration: 0.28, ease: "back.out(2.6)" }, ${f2(TRO_ON + 0.08)});
      tl.to("#k-trophy", { keyframes: { rotation: [-6, 6, -6], y: [0, -6, 0] }, duration: 0.8, ease: "sine.inOut", repeat: ${Math.floor((LOOPK - TRO_ON - 0.5) / 0.8) - 1} }, ${f2(TRO_ON + 0.4)});
${[0, 1, 2].map((i) => `      tl.fromTo("#k-ts${i}", { scale: 0, opacity: 1, rotation: 0 }, { opacity: 1, keyframes: { scale: [0, 1, 0], rotation: [0, 120] }, duration: 0.6, ease: "power1.inOut", repeat: 2, repeatDelay: 0.5, immediateRender: false }, ${f2(TRO_ON + 0.35 + i * 0.25)});`).join("\n")}
      // loop (${LOOPK}): every prop off, cheeks normal, frame-0 shock pose with the jump (frame 0 has no prop and no sweat drop)
      tl.set([${PROPS.map((x) => `"${x}"`).join(", ")}], { opacity: 0, scale: 0, x: 0, y: 0, rotation: 0 }, ${LOOPK});
      tl.set(["#k-chkL", "#k-chkR"], { opacity: 0.4, scale: 1 }, ${LOOPK});
      tl.set("#k-sweat", { opacity: 0, scale: 0, y: 0 }, ${LOOPK});
      tl.set("#k-wrap", { rotation: 0 }, ${LOOPK});
      tl.to("#k-wrap", { keyframes: { y: [0, -16, 0] }, duration: 0.3, ease: "none" }, ${f2(LOOPK + 0.05)});
`;
fs.writeFileSync(path.join(OUT, "compositions", "klotz.html"), `<template>
  <style>
    ${FONTFACE}
    #root { position: absolute; inset: 0; pointer-events: none; }
    #k-pod { position: absolute; left: 640px; top: 1730px; width: 360px; height: 140px; }
    #k-wrap { position: absolute; left: 700px; top: 1480px; width: 260px; height: 286px; transform-origin: 50% 100%; }
    #k-bob, #k-sq { position: absolute; inset: 0; transform-origin: 50% 100%; }
    #k-shovel { position: absolute; left: -140px; top: 150px; width: 140px; height: 150px; }
    #k-trophy { position: absolute; left: -62px; top: 16px; width: 84px; height: 101px; }
    #k-sock { position: absolute; left: 455px; top: 1650px; width: 90px; height: 120px; }
    #k-cac { position: absolute; left: 475px; top: 1666px; width: 70px; height: 100px; }
    .k-pf { position: absolute; width: 80px; height: 60px; }
    .k-ts { position: absolute; width: 44px; height: 44px; }
  </style>
  <div id="root" data-composition-id="klotz" data-width="1080" data-height="1920" data-layout-allow-overflow>
    <div id="k-pod"><svg viewBox="0 0 360 140" width="100%" height="100%" overflow="visible"><path d="M8 136 C30 70 110 34 186 32 C262 30 330 70 352 136 Z" fill="${SAND}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
      <path d="M60 104 C110 84 170 80 220 90 M240 112 C270 106 300 108 320 116" fill="none" stroke="${SAND_D}" stroke-width="7" stroke-linecap="round"/><ellipse cx="300" cy="74" rx="14" ry="9" fill="${SAND_D}" stroke="${K}" stroke-width="5"/></svg></div>
    <div id="k-sock" class="k-prop">${SOCK()}</div>
    <div id="k-cac" class="k-prop">${MINICAC()}</div>
    <div id="k-pf0" class="k-pf k-prop" style="left:560px;top:1720px;">${PUFF()}</div>
    <div id="k-pf1" class="k-pf k-prop" style="left:600px;top:1730px;">${PUFF()}</div>
    <div id="k-wrap"><div id="k-bob"><div id="k-sq">
${klotzSvg}
      <div id="k-shovel" class="k-prop">${SHOVEL()}</div>
      <div id="k-trophy" class="k-prop">${MODULE(YEL, ORANGE)}</div>
${[[-96, -10], [10, -24], [-110, 70]].map(([x, y], i) => `      <div id="k-ts${i}" class="k-ts k-prop" style="left:${x}px;top:${y}px;">${SPARK(i % 2 ? "#fff" : YEL)}</div>`).join("\n")}
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
  [0.0, "impact", 0.35], [0.0, "wind", 0.35], [0.3, "boing", 0.3], [0.5, "rattle", 0.3], [1.4, "sand", 0.3],
  [c("c02"), "whoosh1", 0.35], [c("c02") + 0.05, "paper", 0.35], [c("c02") + 0.45, "stamp", 0.5], [c("c02") + 0.67, "sparkle", 0.25],
  [c("c03"), "pop1", 0.4], [c("c03") + 0.1, "ding", 0.3], [c("c03") + 0.5, "shine", 0.3],
  [c("c04"), "pop2", 0.4], [c("c04") + 0.12, "pop1", 0.35], [c("c04") + 0.3, "sparkle", 0.3], [c("c04") + 0.7, "hmm", 0.3],
  [c("c05"), "womp", 0.45], [c("c05") + 0.4, "boing", 0.2], ...Array.from({ length: 5 }, (_, i) => [c("c05") + 0.2 + i * 0.4, "tick", 0.25]),
  [c("c06"), "whoosh2", 0.3], [c("c06") + 0.05, "rattle", 0.35], [c("c06") + 1.1, "swish", 0.3], [c("c06") + 1.75, "click", 0.35], [c("c06") + 0.4, "cricket", 0.3],
  [c("c07"), "truck", 0.45], [c("c07") + 0.2, "sand", 0.3], [c("c07") + 1.0, "sand", 0.3],
  [c("c08"), "pop1", 0.4], [c("c08") + 0.05, "thud", 0.35], [c("c08") + 0.3, "buzz", 0.35], [c("c08") + 1.6, "buzz", 0.3],
  [c("c09"), "digger", 0.45], [c("c09") + 1.0, "sand", 0.35], [DIG_ON, "pop2", 0.3], [DIG_ON + 0.3, "dig", 0.4], [DIG_ON + 0.72, "dig", 0.35], [SOCK_T, "boing", 0.35], [SOCK_T + 0.1, "hmm", 0.3],
  [c("c10"), "sand", 0.35], [c("c10") + 0.1, "rattle", 0.35], [c("c10") + 0.3, "dig", 0.35], [c("c10") + 0.72, "dig", 0.3], [c("c10") + 0.75, "sparkle", 0.35], [CAC_T, "pop1", 0.35], [CAC_T + 0.05, "error", 0.3],
  [c("c11"), "pop2", 0.4], ...Array.from({ length: 9 }, (_, i) => [c("c11") + 0.4 + i * 0.16, "clack", 0.3]), [c("c11") + 1.6, "thud", 0.3],
  [c("c12"), "hmm", 0.35], [c("c12") + 0.25, "pop1", 0.3], [c("c12") + 0.1, "swish", 0.25],
  [c("c13"), "pop2", 0.35], [c("c13") + 0.7, "brush", 0.45], [c("c13") + 1.05, "error", 0.35], [c("c13") + 1.1, "deflate", 0.3],
  [c("c14") - 0.05, "impact", 0.45], [c("c14") + 0.2, "stamp", 0.35], [c("c14") + 0.45, "tada", 0.4], [c("c14") + 0.45, "sparkle", 0.35], [c("c14") + 0.5, "rattle", 0.3],
  [c("c15"), "shine", 0.35], [c("c15") + 0.05, "pop1", 0.3], [TRO_ON + 0.08, "jump", 0.35], [TRO_ON + 0.35, "sparkle", 0.3], [c("c15") + 1.2, "ding", 0.25],
  [c("c16"), "pop1", 0.4], [c("c16") + 0.2, "pop2", 0.35], [c("c16") + 0.1, "type", 0.3],
  [LOOPK - 0.15, "whoosh2", 0.4], [LOOPK, "impact", 0.3], [LOOPK + 0.05, "wind", 0.3],
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
      <audio id="music-desert" class="clip" src="assets/sfx/music.wav" data-start="0" data-duration="${DUR}" data-track-index="5" data-volume="0.5"></audio>
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
console.log("written", scenes.length, "scenes,", sfx.length, "sfx, lanes", lanes.length, "DUR", DUR, "cuts", scenes.slice(1).map((s) => s.start).join(","), "punch", c("c14"), "musicgap", f2(c("c14") - 0.3));
