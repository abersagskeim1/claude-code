// Generator for Folge 11 "Die Schweiz erobert Liechtenstein" (Staffel 2, Auftakt): writes index.html and compositions/*.html
// Usage: node tools/gen.mjs <project_dir>
// Technique from Folge 1-10 (scene helper, Klotz rig, captions with fixed word gap, id checks, exit before the cut,
// Lilita One embedded as a data URI so the check scripts measure the real font).
// New in Folge 11: Alps at night. Own vector drawings: friendly cartoon soldiers with flashlights (no weapons), border line
// with country signs (SCHWEIZ / LIECHTENSTEIN), crescent moon with rain and fog, counter plate "170", compass with a
// spinning needle, hiking map with footprints crossing the border, big LIECHTENSTEIN sign with a waving flag (blue-red,
// no crown), empty cartridge box with the word LEER (no cartridges, no rifles), U-turn arrow, sleeping village with "Zzz"
// from the houses, ringing telephone with a Swiss-flag speech bubble, letter ENTSCHULDIGUNG with a wax seal, flashlight
// beam, wooden board with a tally, postcard with a "?".
// Klotz gag: he holds the hiking map upside down while he follows the troop, pulls it away later; at the end a border line
// appears at his feet: he hops over it, notices it and hops back, embarrassed (short hop, back on his usual spot).
// All scene graphics stay in x 100-980 (Ken Burns 1.03 keeps them inside 80-1000) and in y 740-1370 (under the captions, above Klotz).
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
const YEL = "#FFD23F", RED = "#FF3B3B", CREAM = "#FFF1D6";
const CH_RED = "#E3262B", LI_BLUE = "#1B3FA0", LI_RED = "#D8262E";
const STONE = "#5A6488", STONE_D = "#3A4266", STONE_L = "#8C97BE", SNOW = "#EAF0FF";
const GREEN = "#5B9A44", GREEN_D = "#3C5A2A", CAP = "#3F7A30", CAP_D = "#2F5F24";
const WOOD = "#9A6232", WOOD_D = "#5E3A1A", GOLD = "#F2B705", GOLD_D = "#B07A00", SKIN = "#F2C29A";
const MAPG = "#CFE8B0", MAPG2 = "#E6F2C8", BROWN = "#A0703C", WATER = "#5BB2F0";

// ================= timing: one row per caption; one scene per caption; cuts on whole tenths =================
// a caption with n words needs n x 0.35 s (min 1.1 s) fully readable + the word pop-in + the exit
const CD = [["c01", 2.2], ["c02", 2.8], ["c03", 2.8], ["c04", 2.4], ["c05", 2.0], ["c06", 2.0], ["c07", 2.0], ["c08", 2.0], ["c09", 2.8],
  ["c10", 1.8], ["c11", 2.4], ["c12", 2.8], ["c13", 2.0], ["c14", 1.6], ["c15", 3.0], ["c16", 2.8], ["c17", 0.6]];
const C = {};
{ let t = 0; for (const [id, d] of CD) { C[id] = [f2(t), f2(t + d)]; t += d; } }
export const DUR = C.c17[1];
const LAST = f2(DUR - 1 / 30);
const T = {
  hook: C.c01, mond: C.c02, trupp: C.c03, nebel: C.c04, kompass: C.c05, karte: C.c06, schild: C.c07, munition: C.c08, umkehr: C.c09,
  fahne: C.c10, dorf: C.c11, telefon: C.c12, brief: C.c13, lampe: C.c14, strich: C.c15, frage: [C.c16[0], DUR],
};
const S = (k) => [T[k][0], f2(T[k][1] - T[k][0])];
const scenes = [];

// ================= drawings (own designs, flat vector) =================
const SV = (w, h, inner, extra = "") => `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" overflow="visible"${extra}>${inner}</svg>`;
// friendly cartoon soldier (viewBox 220 x 170, figure in x 20-132, light cone to x 218), facing right; flip = facing left.
// ids: p-la / p-lb leg poses (p-lb hidden), p-cone light cone, p-cg cone gradient. No weapon: a flashlight and a backpack.
const LEGA = `<rect x="42" y="112" width="16" height="40" rx="6" fill="${GREEN_D}" stroke="${K}" stroke-width="5"/><rect x="64" y="112" width="16" height="40" rx="6" fill="${GREEN_D}" stroke="${K}" stroke-width="5"/>
  <rect x="36" y="146" width="28" height="15" rx="7" fill="#2A1A10" stroke="${K}" stroke-width="4"/><rect x="60" y="146" width="28" height="15" rx="7" fill="#2A1A10" stroke="${K}" stroke-width="4"/>`;
const LEGB = `<g transform="rotate(18 52 114)"><rect x="44" y="112" width="16" height="40" rx="6" fill="${GREEN_D}" stroke="${K}" stroke-width="5"/><rect x="38" y="146" width="28" height="15" rx="7" fill="#2A1A10" stroke="${K}" stroke-width="4"/></g>
  <g transform="rotate(-18 70 114)"><rect x="62" y="112" width="16" height="40" rx="6" fill="${GREEN_D}" stroke="${K}" stroke-width="5"/><rect x="58" y="146" width="28" height="15" rx="7" fill="#2A1A10" stroke="${K}" stroke-width="4"/></g>`;
const SOLDIER = (p, flip = false) => SV(220, 170, `<g transform="${flip ? "translate(220 0) scale(-1 1)" : "translate(0 0)"}">
  <defs><linearGradient id="${p}-cg" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#FFE58A" stop-opacity=".9"/><stop offset="1" stop-color="#FFE58A" stop-opacity="0"/></linearGradient></defs>
  <path id="${p}-cone" d="M130 83 L218 46 L218 132 Z" fill="url(#${p}-cg)"/>
  <g id="${p}-la">${LEGA}</g><g id="${p}-lb" opacity="0">${LEGB}</g>
  <rect x="22" y="64" width="26" height="46" rx="8" fill="${GREEN_D}" stroke="${K}" stroke-width="5"/>
  <rect x="36" y="60" width="50" height="60" rx="20" fill="${GREEN}" stroke="${K}" stroke-width="6"/>
  <rect x="39" y="102" width="44" height="8" fill="${GREEN_D}"/>
  <rect x="54" y="70" width="18" height="18" rx="3" fill="${CH_RED}" stroke="${K}" stroke-width="3"/><rect x="61" y="73" width="4" height="12" fill="#fff"/><rect x="57" y="77" width="12" height="4" fill="#fff"/>
  <circle cx="60" cy="36" r="25" fill="${SKIN}" stroke="${K}" stroke-width="6"/>
  <path d="M35 34 Q35 8 60 8 Q85 8 85 34 Z" fill="${CAP}" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>
  <path d="M78 29 H100 Q103 36 96 37 H78 Z" fill="${CAP_D}" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>
  <circle cx="68" cy="41" r="4.5" fill="${K}"/><circle cx="80" cy="41" r="4.5" fill="${K}"/><ellipse cx="84" cy="50" rx="6" ry="4" fill="#FF8FA3" opacity=".7"/>
  <path d="M66 50 Q74 58 82 50" fill="none" stroke="${K}" stroke-width="4" stroke-linecap="round"/>
  <rect x="72" y="76" width="40" height="14" rx="7" fill="${GREEN}" stroke="${K}" stroke-width="5"/>
  <rect x="104" y="74" width="22" height="18" rx="4" fill="#9AA3C0" stroke="${K}" stroke-width="4"/><rect x="123" y="71" width="9" height="24" rx="3" fill="${YEL}" stroke="${K}" stroke-width="3"/>
  <circle cx="108" cy="83" r="7" fill="${SKIN}" stroke="${K}" stroke-width="4"/></g>`);
// march cycle: alternate the two leg poses every `step` s from t0 for d s
const runLegs = (p, t0, d, step = 0.2) => { let s = ""; for (let k = 1, t = f2(t0 + step); t < t0 + d - 1e-6; k++, t = f2(t + step)) s += `      tl.set("#${p}-la", { opacity: ${k % 2 ? 0 : 1} }, ${t}); tl.set("#${p}-lb", { opacity: ${k % 2 ? 1 : 0} }, ${t});\n`; return s; };

const SPARK = (col = YEL) => SV(100, 100, `<path d="M50 2 Q56 44 98 50 Q56 56 50 98 Q44 56 2 50 Q44 44 50 2 Z" fill="${col}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>`);
// foreground ridge of the hook (viewBox 900 x 490)
const RIDGE = () => SV(900, 490, `<path d="M0 490 L0 250 L130 140 L220 190 L350 50 L470 160 L560 100 L700 220 L820 130 L900 200 L900 490 Z" fill="#2A3466" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
  <path d="M350 50 L392 90 L370 104 L346 88 L322 102 L310 86 Z M130 140 L162 167 L140 176 L116 162 Z M560 100 L598 136 L576 146 L556 130 L534 140 L526 126 Z M820 130 L852 160 L830 168 L810 156 Z" fill="${SNOW}" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>
  <path d="M0 330 Q220 280 450 320 Q680 360 900 300 L900 490 L0 490 Z" fill="#333F7A"/>
  <path d="M0 410 Q260 370 470 400 Q700 430 900 390 L900 490 L0 490 Z" fill="#3B4888"/>`);
// dashed border line (two strokes: dark under, yellow dashes)
const DASH = (w, h, d, p) => SV(w, h, `<path d="${d}" fill="none" stroke="${K}" stroke-width="22" stroke-linecap="round" stroke-dasharray="40 26" id="${p}-dk"/><path d="${d}" fill="none" stroke="${YEL}" stroke-width="10" stroke-linecap="round" stroke-dasharray="40 26" id="${p}-dy"/>`);
// country plate: Switzerland red, Liechtenstein blue over red (flag colours, no coat of arms, no crown)
const CHBG = `background:${CH_RED};`;
const LIBG = `background:linear-gradient(180deg, ${LI_BLUE} 0%, ${LI_BLUE} 50%, ${LI_RED} 50%, ${LI_RED} 100%);`;
const MOON = () => SV(280, 280, `<path d="M190 20 A120 120 0 1 0 260 200 A100 100 0 1 1 190 20 Z" fill="#FFF3C4" stroke="${K}" stroke-width="10" stroke-linejoin="round"/><circle cx="120" cy="190" r="14" fill="#F2DE9A"/><circle cx="90" cy="130" r="9" fill="#F2DE9A"/>`);
const CLOUD = (col = "#3C4A86") => SV(360, 150, `<path d="M40 130 Q0 130 10 96 Q20 66 60 74 Q70 26 124 30 Q160 4 200 30 Q250 18 268 64 Q330 60 344 100 Q356 132 314 132 Z" fill="${col}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>`);
// rain: streaks in a 120 px tile, repeated; the inner group moves down by one tile per period
const RAIN = (p, w, h, seed, n = 26) => {
  const RS = mulberry32(seed); let s = "";
  for (let k = -1; k <= Math.ceil(h / 120); k++) for (let i = 0; i < n; i++) { const x = Math.round(RS() * w), y = Math.round(RS() * 120) + k * 120; s += `<path d="M${x} ${y} l-10 34" stroke="#9FC4FF" stroke-width="5" stroke-linecap="round" opacity=".55"/>`; }
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" overflow="hidden"><g id="${p}-rg">${s}</g></svg>`;
};
const FOG = (w, h, op = 0.35) => SV(w, h, `<rect x="0" y="${h * 0.25}" width="${w}" height="${h * 0.5}" rx="${h * 0.25}" fill="#C9D3F0" opacity="${op}"/><rect x="${w * 0.12}" y="${h * 0.05}" width="${w * 0.5}" height="${h * 0.4}" rx="${h * 0.2}" fill="#C9D3F0" opacity="${op * 0.8}"/><rect x="${w * 0.5}" y="${h * 0.55}" width="${w * 0.45}" height="${h * 0.4}" rx="${h * 0.2}" fill="#C9D3F0" opacity="${op * 0.8}"/>`);
// compass (viewBox 430 x 430): brass ring, ticks, needle group (red north half) p-nd
const COMPASS = (p) => SV(430, 430, `<circle cx="215" cy="230" r="196" fill="${GOLD_D}" stroke="${K}" stroke-width="12"/><circle cx="215" cy="215" r="196" fill="${GOLD}" stroke="${K}" stroke-width="12"/>
  <circle cx="215" cy="215" r="160" fill="${CREAM}" stroke="${K}" stroke-width="8"/>
  ${Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2, r0 = i % 4 ? 138 : 120; return `<path d="M${f2(215 + Math.sin(a) * r0)} ${f2(215 - Math.cos(a) * r0)} L${f2(215 + Math.sin(a) * 152)} ${f2(215 - Math.cos(a) * 152)}" stroke="${K}" stroke-width="${i % 4 ? 5 : 9}" stroke-linecap="round"/>`; }).join("")}
  <path d="M215 95 L240 215 L190 215 Z" fill="#EDEDF5" stroke="${K}" stroke-width="5" stroke-linejoin="round" transform="rotate(45 215 215)" opacity=".35"/>
  <g id="${p}-nd"><path d="M215 78 L242 215 L188 215 Z" fill="${RED}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><path d="M215 352 L242 215 L188 215 Z" fill="#fff" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><circle cx="215" cy="215" r="16" fill="${GOLD}" stroke="${K}" stroke-width="6"/></g>
  <rect x="195" y="0" width="40" height="34" rx="10" fill="${GOLD}" stroke="${K}" stroke-width="8"/>`);
// hiking map sheet (viewBox 860 x 610): folds, green areas, contours, river, red dashed border, footprints p-fp0..
const FOOT = (x, y, a, id) => `<g id="${id}" transform="translate(${x} ${y}) rotate(${a})"><ellipse cx="0" cy="0" rx="11" ry="17" fill="${K}"/><ellipse cx="0" cy="-24" rx="8" ry="7" fill="${K}"/></g>`;
const FP = (() => { const a = [], n = 10; for (let i = 0; i < n; i++) { const t = i / (n - 1); const x = 90 + t * 620, y = 440 - t * 200; const ang = 72; const side = i % 2 ? 1 : -1; a.push([f2(x + side * 10), f2(y + side * 18), ang]); } return a; })();
const MAP = (p) => SV(860, 610, `<rect x="6" y="6" width="848" height="598" rx="14" fill="${MAPG2}" stroke="${K}" stroke-width="12"/>
  <path d="M20 420 Q160 360 260 420 Q360 480 300 590 L20 590 Z" fill="${MAPG}"/><path d="M520 20 Q500 140 620 160 Q760 180 840 120 L840 20 Z" fill="${MAPG}"/>
  ${[0, 1, 2, 3].map((i) => `<path d="M${560 + i * 26} ${300 + i * 4} q${90 - i * 18} -${70 - i * 12} ${180 - i * 40} 0 q-${60 - i * 10} ${60 - i * 10} -${180 - i * 40} 0" fill="none" stroke="${BROWN}" stroke-width="5" opacity=".7"/>`).join("")}
  ${[0, 1, 2].map((i) => `<path d="M${60 + i * 24} ${170 + i * 6} q${100 - i * 22} -${60 - i * 12} ${200 - i * 44} 0 q-${70 - i * 14} ${50 - i * 10} -${200 - i * 44} 0" fill="none" stroke="${BROWN}" stroke-width="5" opacity=".7"/>`).join("")}
  <path d="M10 250 Q120 240 170 300 Q220 360 180 420 Q150 470 10 480" fill="none" stroke="${WATER}" stroke-width="14" stroke-linecap="round"/>
  <path d="M287 6 V604 M573 6 V604" stroke="#B9C7A0" stroke-width="5" opacity=".8"/>
  <path d="M130 10 L850 600" fill="none" stroke="${K}" stroke-width="18" stroke-dasharray="34 22" stroke-linecap="round"/><path d="M130 10 L850 600" fill="none" stroke="${RED}" stroke-width="9" stroke-dasharray="34 22" stroke-linecap="round"/>
  ${FP.map(([x, y, a], i) => FOOT(x, y, a, `${p}-fp${i}`)).join("")}`);
// waving flag of Liechtenstein: vertical strips, blue over red (no crown); ids p-k0..
const FLAG_N = 10;
const LIFLAG = (p, w = 440, h = 300) => { const sw = w / FLAG_N; return SV(w, h, Array.from({ length: FLAG_N }, (_, i) => `<g id="${p}-k${i}"><rect x="${f2(i * sw - 0.5)}" y="0" width="${f2(sw + 1)}" height="${h / 2}" fill="${LI_BLUE}"/><rect x="${f2(i * sw - 0.5)}" y="${h / 2}" width="${f2(sw + 1)}" height="${h / 2}" fill="${LI_RED}"/></g>`).join("") + `<rect x="0" y="0" width="${w}" height="${h}" fill="none" stroke="${K}" stroke-width="8"/>`); };
const flagWave = (p, t0, d, amp = 10) => { const n = Math.max(1, Math.round(d / 0.6)), per = f2(d / n); return Array.from({ length: FLAG_N }, (_, i) => { const ph = (i / FLAG_N) * Math.PI * 2; const a = f2(Math.sin(ph) * amp), b = f2(Math.sin(ph + Math.PI / 2) * amp), c = f2(Math.sin(ph + Math.PI) * amp), e = f2(Math.sin(ph + Math.PI * 1.5) * amp); return `      tl.fromTo("#${p}-k${i}", { y: ${a} }, { keyframes: { y: [${a}, ${b}, ${c}, ${e}, ${a}] }, duration: ${per}, ease: "none", repeat: ${n - 1}, immediateRender: true }, ${t0});`; }).join("\n"); };
const SWISSFLAG = () => SV(100, 100, `<rect x="4" y="4" width="92" height="92" rx="6" fill="${CH_RED}" stroke="${K}" stroke-width="7"/><rect x="40" y="20" width="20" height="60" fill="#fff"/><rect x="20" y="40" width="60" height="20" fill="#fff"/>`);
// cardboard box, opened, empty inside (viewBox 480 x 400)
const BOX = () => SV(480, 400, `<path d="M20 70 L460 70 L460 390 L20 390 Z" fill="#C8894A" stroke="${K}" stroke-width="12" stroke-linejoin="round"/><path d="M20 70 L460 70 L420 130 L60 130 Z" fill="#2A1A10" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>
  <path d="M60 130 L420 130 L460 70" fill="none" stroke="#5E3A1A" stroke-width="8"/><rect x="200" y="130" width="80" height="260" fill="#B57638" opacity=".6"/>`);
const FLAP = () => SV(240, 70, `<path d="M10 60 L230 60 L200 10 L40 10 Z" fill="#D9A064" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>`);
const MOTH = (p) => SV(90, 70, `<g id="${p}-wl"><path d="M45 35 Q10 0 4 30 Q2 58 45 40 Z" fill="#E9E6F5" stroke="${K}" stroke-width="5" stroke-linejoin="round"/></g><g id="${p}-wr"><path d="M45 35 Q80 0 86 30 Q88 58 45 40 Z" fill="#E9E6F5" stroke="${K}" stroke-width="5" stroke-linejoin="round"/></g><ellipse cx="45" cy="38" rx="7" ry="16" fill="#8A7A9A" stroke="${K}" stroke-width="4"/>`);
const UTURN = () => SV(340, 170, `<path d="M300 160 V80 Q300 20 230 20 H110 Q40 20 40 80 V110" fill="none" stroke="${K}" stroke-width="44" stroke-linecap="round"/><path d="M300 160 V80 Q300 20 230 20 H110 Q40 20 40 80 V110" fill="none" stroke="${YEL}" stroke-width="26" stroke-linecap="round"/>
  <path d="M0 100 L40 165 L80 100 Z" fill="${YEL}" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>`);
// little houses (viewBox 200 x 250 scaled to box), dark windows; church with tower
const HOUSE = (w, h, col) => SV(200, 250, `<path d="M20 110 L100 30 L180 110 Z" fill="#7A3B44" stroke="${K}" stroke-width="10" stroke-linejoin="round"/><path d="M100 30 L180 110 L160 110 L100 52 L40 110 L20 110 Z" fill="${SNOW}" opacity=".9"/>
  <rect x="34" y="106" width="132" height="138" fill="${col}" stroke="${K}" stroke-width="10"/><rect x="132" y="40" width="22" height="44" fill="${STONE_D}" stroke="${K}" stroke-width="7"/>
  <rect x="54" y="132" width="36" height="36" rx="4" fill="#141B42" stroke="${K}" stroke-width="6"/><rect x="110" y="132" width="36" height="36" rx="4" fill="#141B42" stroke="${K}" stroke-width="6"/>
  <rect x="84" y="186" width="32" height="58" rx="4" fill="${WOOD_D}" stroke="${K}" stroke-width="6"/>`, ` preserveAspectRatio="none"`);
const CHURCH = () => SV(160, 360, `<path d="M40 110 L80 10 L120 110 Z" fill="#7A3B44" stroke="${K}" stroke-width="9" stroke-linejoin="round"/><rect x="44" y="106" width="72" height="250" fill="#C9C3B8" stroke="${K}" stroke-width="9"/>
  <circle cx="80" cy="150" r="20" fill="${CREAM}" stroke="${K}" stroke-width="6"/><path d="M80 150 V136 M80 150 H92" stroke="${K}" stroke-width="5" stroke-linecap="round"/>
  <path d="M66 200 Q80 184 94 200 V240 H66 Z" fill="#141B42" stroke="${K}" stroke-width="6"/><path d="M60 300 Q80 280 100 300 V356 H60 Z" fill="${WOOD_D}" stroke="${K}" stroke-width="6"/>`);
const PHONE = () => SV(440, 340, `<path d="M60 120 Q60 80 110 80 H330 Q380 80 380 120 L420 320 Q424 336 404 336 H36 Q16 336 20 320 Z" fill="${RED}" stroke="${K}" stroke-width="12" stroke-linejoin="round"/>
  <circle cx="220" cy="226" r="78" fill="${CREAM}" stroke="${K}" stroke-width="10"/>${Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 1.6 + 2.2; return `<circle cx="${f2(220 + Math.cos(a) * 52)}" cy="${f2(226 + Math.sin(a) * 52)}" r="11" fill="#fff" stroke="${K}" stroke-width="5"/>`; }).join("")}<circle cx="220" cy="226" r="18" fill="${RED}" stroke="${K}" stroke-width="6"/>`);
const HANDSET = () => SV(420, 130, `<path d="M20 70 Q20 20 80 20 H340 Q400 20 400 70 V96 Q400 116 380 116 H310 Q290 116 290 96 V80 H130 V96 Q130 116 110 116 H40 Q20 116 20 96 Z" fill="${RED}" stroke="${K}" stroke-width="12" stroke-linejoin="round"/>`);
const RINGS = (right) => SV(100, 160, `<g transform="${right ? "translate(100 0) scale(-1 1)" : "translate(0 0)"}"><path d="M80 20 Q30 80 80 140" fill="none" stroke="${YEL}" stroke-width="14" stroke-linecap="round"/><path d="M44 0 Q-14 80 44 160" fill="none" stroke="${YEL}" stroke-width="14" stroke-linecap="round" opacity=".8"/></g>`);
const BUBBLE = () => SV(330, 200, `<path d="M40 10 H290 Q320 10 320 40 V130 Q320 160 290 160 H110 L40 196 L60 160 H40 Q10 160 10 130 V40 Q10 10 40 10 Z" fill="#fff" stroke="${K}" stroke-width="12" stroke-linejoin="round"/>`);
const ENV_BACK = () => SV(700, 240, `<rect x="8" y="8" width="684" height="224" rx="16" fill="#E9D3A8" stroke="${K}" stroke-width="12"/>`);
const ENV_FRONT = () => SV(700, 190, `<path d="M8 8 L350 120 L692 8 V172 Q692 182 682 182 H18 Q8 182 8 172 Z" fill="#F4E2BC" stroke="${K}" stroke-width="12" stroke-linejoin="round"/>`);
const LETTER = () => SV(660, 520, `<rect x="6" y="6" width="648" height="508" rx="12" fill="#fff" stroke="${K}" stroke-width="10"/>${[0, 1, 2, 3, 4].map((i) => `<rect x="60" y="${150 + i * 52}" width="${[540, 500, 520, 460, 300][i]}" height="16" rx="8" fill="#B9C2DE"/>`).join("")}`);
const SEAL = () => SV(150, 150, `<path d="M75 6 Q98 10 110 22 Q134 30 138 54 Q148 75 138 96 Q132 122 108 130 Q92 146 70 142 Q44 146 30 126 Q8 116 8 90 Q0 66 14 46 Q22 18 50 12 Z" fill="#B3121C" stroke="${K}" stroke-width="8" stroke-linejoin="round"/><circle cx="75" cy="75" r="46" fill="#D42A2A" stroke="#7A0A10" stroke-width="5"/>
  <rect x="66" y="45" width="18" height="60" fill="#fff"/><rect x="45" y="66" width="60" height="18" fill="#fff"/>`);
const TORCH = () => SV(300, 140, `<rect x="10" y="30" width="190" height="80" rx="24" fill="#3A4270" stroke="${K}" stroke-width="10"/><rect x="40" y="50" width="70" height="40" rx="10" fill="${RED}" stroke="${K}" stroke-width="6"/>
  <path d="M196 20 L270 6 V134 L196 120 Z" fill="#9AA3C0" stroke="${K}" stroke-width="10" stroke-linejoin="round"/><rect x="262" y="10" width="30" height="120" rx="8" fill="${YEL}" stroke="${K}" stroke-width="8"/>`);
const BEAM = (p) => SV(560, 440, `<defs><linearGradient id="${p}-bg" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#FFF3B0" stop-opacity=".85"/><stop offset="1" stop-color="#FFF3B0" stop-opacity="0"/></linearGradient></defs><path d="M0 170 L560 0 L560 440 L0 270 Z" fill="url(#${p}-bg)"/>`);
const BOARD = (p) => SV(740, 560, `<rect x="110" y="400" width="34" height="160" fill="${WOOD_D}" stroke="${K}" stroke-width="8"/><rect x="596" y="400" width="34" height="160" fill="${WOOD_D}" stroke="${K}" stroke-width="8"/>
  <rect x="8" y="8" width="724" height="420" rx="18" fill="${WOOD}" stroke="${K}" stroke-width="12"/>${[0, 1, 2, 3].map((i) => `<path d="M30 ${100 + i * 90} H710" stroke="${WOOD_D}" stroke-width="5" opacity=".6"/>`).join("")}
  <rect x="30" y="30" width="680" height="376" rx="10" fill="none" stroke="#7A4A22" stroke-width="6"/>
  <g opacity=".55"><path d="M210 110 L196 330" stroke="#fff" stroke-width="30" stroke-linecap="round"/><path d="M320 108 L310 332" stroke="#fff" stroke-width="30" stroke-linecap="round"/></g>
  <path id="${p}-m2" d="M436 104 L428 334" stroke="#fff" stroke-width="34" stroke-linecap="round"/>`);
const POSTCARD = () => SV(780, 500, `<rect x="8" y="8" width="764" height="484" rx="18" fill="${CREAM}" stroke="${K}" stroke-width="12"/>
  <rect x="34" y="34" width="420" height="432" rx="10" fill="#1E2A66" stroke="${K}" stroke-width="7"/><path d="M38 400 L140 250 L200 310 L290 170 L400 330 L452 290 V462 H38 Z" fill="${STONE}" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>
  <path d="M290 170 L322 216 L300 228 L284 214 L262 224 L258 212 Z M140 250 L166 286 L146 294 L128 280 Z" fill="${SNOW}"/><circle cx="380" cy="100" r="34" fill="#FFF3C4" stroke="${K}" stroke-width="6"/>
  <rect x="600" y="40" width="140" height="150" rx="6" fill="#fff" stroke="${K}" stroke-width="6" stroke-dasharray="14 8"/><rect x="618" y="58" width="104" height="114" fill="${CH_RED}"/><rect x="660" y="80" width="20" height="70" fill="#fff"/><rect x="635" y="105" width="70" height="20" fill="#fff"/>
  ${[0, 1, 2].map((i) => `<rect x="490" y="${300 + i * 56}" width="250" height="12" rx="6" fill="#B9C2DE"/>`).join("")}<path d="M470 40 V460" stroke="#D8C8A8" stroke-width="5"/>`);
// Klotz' hiking map, drawn the right way and then rotated 180 deg as a whole: he holds it upside down
// (the mountain icon points down, the red compass needle points down)
const KMAP = () => SV(130, 110, `<g transform="rotate(180 65 55)"><rect x="5" y="5" width="40" height="100" fill="${MAPG}" stroke="${K}" stroke-width="5"/><rect x="45" y="5" width="40" height="100" fill="${MAPG2}" stroke="${K}" stroke-width="5"/><rect x="85" y="5" width="40" height="100" fill="${MAPG}" stroke="${K}" stroke-width="5"/>
  <path d="M14 90 Q40 60 64 76 Q90 92 116 60" fill="none" stroke="${RED}" stroke-width="5" stroke-dasharray="8 6"/><path d="M70 62 L90 26 L110 62 Z" fill="${STONE}" stroke="${K}" stroke-width="4" stroke-linejoin="round"/><path d="M90 26 L98 40 L82 40 Z" fill="${SNOW}"/>
  <circle cx="26" cy="28" r="15" fill="#fff" stroke="${K}" stroke-width="4"/><path d="M26 15 L31 28 L21 28 Z" fill="${RED}"/><path d="M26 41 L31 28 L21 28 Z" fill="${STONE_D}"/></g>`);

// ---------- common CSS ----------
const STK = `filter: drop-shadow(5px 0 0 #fff) drop-shadow(-5px 0 0 #fff) drop-shadow(0 5px 0 #fff) drop-shadow(0 -5px 0 #fff) drop-shadow(0 14px 0 rgba(0,0,0,.35));`;
// the font is embedded as a data URI too (the sandboxed preview page has an opaque origin and cannot fetch font files), the file stays as fallback
const LILITA64 = fs.readFileSync(path.join(OUT, "assets", "fonts", "LilitaOne-latin.woff2")).toString("base64");
const FONTFACE = `@font-face{font-family:'Lilita One';src:url('data:font/woff2;base64,${LILITA64}') format('woff2'),url('assets/fonts/LilitaOne-latin.woff2') format('woff2');font-weight:400;font-style:normal;font-display:block;}`;
const abs = (l, t, w, h) => `position:absolute;left:${l}px;top:${t}px;width:${w}px;${h != null ? `height:${h}px;` : ""}`;
const LBL = (size, col = K) => `font-family:'Lilita One';font-size:${size}px;line-height:1;color:${col};white-space:nowrap;text-align:center;letter-spacing:0.02em;`;
// plate with a label; white labels on the country plates get a dark outline for contrast
const plate = (id, l, t, w, h, txt, size = 80, bg = `background:${CREAM};`, col = K) => `      <div id="${id}" class="plate" style="${abs(l, t, w, h)}${bg}"><div id="${id}-t" style="position:absolute;left:0;top:${Math.round((h - 14 - size) / 2) + 4}px;width:100%;${LBL(size, col)}${col === "#fff" ? `-webkit-text-stroke:10px ${K};paint-order:stroke fill;` : ""}">${txt}</div></div>`;
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
// soldier element: box at (l, t), scale s of the 220 x 170 drawing
const SOLD = (id, l, t, s, flip = false, cls = "STKC") => `      <div id="${id}" class="${cls} sold" style="${abs(l, t, Math.round(220 * s), Math.round(170 * s))}">${SOLDIER(id, flip)}</div>`;
// march in place: legs + a small bob, from t0 for d s, whole periods
const march = (ids, t0, d, step = 0.2) => ids.map((id, i) => runLegs(id, t0, d, step) + `      tl.to("#${id}", { keyframes: { y: [0, -6, 0] }, duration: ${f2(step * 2)}, ease: "sine.inOut", repeat: ${Math.max(0, Math.round(d / (step * 2)) - 1)} }, ${t0});\n`).join("");
const flicker = (ids, t0, d) => ids.map((id, i) => { const n = Math.max(1, Math.round(d / 0.8)); return `      tl.to("#${id}-cone", { keyframes: { opacity: [1, ${0.55 + (i % 3) * 0.1}, 1, ${0.75 - (i % 2) * 0.1}, 1] }, duration: ${f2(d / n)}, ease: "none", repeat: ${n - 1} }, ${t0});\n`; }).join("");

// ================= HOOK picture (frame 0 = thumbnail motif): border line over a ridge, signs SCHWEIZ / LIECHTENSTEIN,
// little soldiers with flashlights walking across =================
const HS = [[120, 1134], [300, 1072], [480, 994], [660, 916]];
const hookCss = (p) => `
   #${p}-mt{${abs(90, 880, 900, 490)}}
   #${p}-ln{${abs(90, 990, 900, 200)}}
   #${p}-lip{${abs(686, 878, 18, 200)}background:${WOOD};border:5px solid ${K};}
   #${p}-li{transform-origin:50% 100%;}
   #${p}-ch{transform-origin:50% 100%;}
   .sold{transform-origin:50% 100%;}`;
const hookBody = (p) => stk(`      <div id="${p}-mt">${RIDGE()}</div>
      <div id="${p}-ln">${DASH(900, 200, "M10 20 L890 170", p + "-ln")}</div>
      <div id="${p}-lip"></div>
${plate(p + "-li", 400, 770, 580, 112, "LIECHTENSTEIN", 72, LIBG, "#fff")}
${plate(p + "-ch", 110, 1262, 350, 108, "SCHWEIZ", 72, CHBG, "#fff")}
${HS.map(([x, y], i) => SOLD(`${p}-s${i}`, x, y, 0.7)).join("\n")}`, p);
// idle motion of the hook picture from t0 for d seconds
const hookIdle = (p, t0, d) => {
  const ids = HS.map((_, i) => `${p}-s${i}`);
  const n = Math.max(1, Math.round(d / 0.8)), per = f2(d / n);
  return march(ids, t0, d) + flicker(ids, t0, d) +
`      tl.fromTo(["#${p}-ln-dk", "#${p}-ln-dy"], { attr: { "stroke-dashoffset": 0 } }, { attr: { "stroke-dashoffset": -132 }, duration: ${d}, ease: "none", immediateRender: false }, ${t0});
      tl.to("#${p}-li", { keyframes: { rotation: [0, 1.2, 0, -1.2, 0] }, duration: ${f2(per * 2)}, ease: "sine.inOut", repeat: ${Math.max(0, Math.round(n / 2) - 1)} }, ${t0});
      tl.to("#${p}-ch", { keyframes: { rotation: [0, -1.5, 0, 1.5, 0] }, duration: ${f2(per * 2)}, ease: "sine.inOut", repeat: ${Math.max(0, Math.round(n / 2) - 1)} }, ${t0});
`;
};
{
  const p = "hook";
  const [s, d] = S(p);
  scenes.push(scene(p, "Hook: Soldaten laufen ueber die Grenze", s, d, hookCss(p), hookBody(p),
    `      // frame 0 already shows the full motif (thumbnail picture)
${hookIdle(p, 0, d)}`, { kb: false }));
}

// ================= MOND: crescent moon, clouds drift, rain and fog over the mountains (c02) =================
{
  const p = "mond";
  const [s, d] = S(p);
  scenes.push(scene(p, "Mond, Regen und Nebel", s, d,
    `#mond-gl{${abs(600, 760, 360, 340)}border-radius:50%;background:radial-gradient(circle,rgba(255,243,196,.35) 0%,rgba(255,243,196,0) 66%);}
     #mond-mo{${abs(650, 790, 260, 260)}transform-origin:50% 50%;}
     #mond-c0{${abs(130, 800, 360, 150)}} #mond-c1{${abs(470, 980, 300, 125)}}
     #mond-rn{${abs(100, 1000, 880, 370)}}
     #mond-fg{${abs(110, 1230, 860, 140)}}`,
    stk(`      <div id="mond-gl"></div>
      <div id="mond-mo" class="STKC">${MOON()}</div>
      <div id="mond-rn">${RAIN("mond-rn", 880, 370, 2007)}</div>
      <div id="mond-c0" class="STKC">${CLOUD()}</div>
      <div id="mond-c1" class="STKC">${CLOUD("#33407A")}</div>
      <div id="mond-fg">${FOG(860, 140, 0.4)}</div>`, p),
    `      tl.fromTo("#mond-mo", { rotation: -8, scale: 0.92 }, { rotation: 0, scale: 1, duration: 0.4, ease: "back.out(2)" }, 0);
      tl.to("#mond-mo", { keyframes: { rotation: [0, 4, 0] }, duration: 2.2, ease: "sine.inOut" }, 0.4);
      tl.fromTo("#mond-c0", { x: -20 }, { x: 60, duration: ${d}, ease: "none" }, 0);
      tl.fromTo("#mond-c1", { x: 30 }, { x: -50, duration: ${d}, ease: "none" }, 0);
      tl.fromTo("#mond-rn-rg", { y: 0 }, { y: 120, duration: 0.4, ease: "none", repeat: ${Math.round(d / 0.4) - 1} }, 0);
      tl.fromTo("#mond-fg", { x: -10, opacity: 0.7 }, { x: 10, opacity: 1, duration: ${d}, ease: "sine.inOut" }, 0);
      tl.to("#mond-gl", { keyframes: { opacity: [1, 0.6, 1, 0.6, 1] }, duration: ${d}, ease: "sine.inOut" }, 0);`));
}

// ================= TRUPP: three rows of little soldiers march, plate "170" (c03) =================
{
  const p = "trupp";
  const [s, d] = S(p);
  const pos = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) pos.push([150 + c * 250 + r * 40, 1000 + r * 118]);
  const ids = pos.map((_, i) => `trupp-s${i}`);
  scenes.push(scene(p, "Trupp marschiert, Zahl 170", s, d,
    `#trupp-g{position:absolute;left:0;top:0;width:1080px;height:1920px;}
     #trupp-n{transform-origin:50% 50%;} .sold{transform-origin:50% 100%;}`,
    stk(`${plate("trupp-n", 370, 772, 340, 170, "170", 130)}
      <div id="trupp-g">
${pos.map(([x, y], i) => SOLD(ids[i], x, y, 0.55)).join("\n")}
      </div>`, p),
    `      tl.fromTo("#trupp-n", { scale: 0.5, rotation: -8 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2.6)" }, 0);
      tl.to("#trupp-n", { keyframes: { scale: [1, 1.08, 1], rotation: [0, 3, 0] }, duration: 0.5, ease: "sine.inOut", repeat: 2 }, 0.6);
      tl.fromTo("#trupp-g", { x: -40 }, { x: 40, duration: ${d}, ease: "none" }, 0);
${march(ids, 0, d)}${flicker(ids, 0, d)}`));
}

// ================= NEBEL: fog gets denser, flashlight cones flicker gently, moon behind a cloud (c04) =================
{
  const p = "nebel";
  const [s, d] = S(p);
  const pos = [[140, 1150], [420, 1100], [700, 1170]];
  const ids = pos.map((_, i) => `nebel-s${i}`);
  scenes.push(scene(p, "Nebel wird dichter", s, d,
    `#nebel-mo{${abs(700, 780, 180, 180)}} #nebel-cl{${abs(560, 820, 360, 150)}}
     #nebel-f0{${abs(140, 1000, 800, 160)}} #nebel-f1{${abs(140, 1140, 800, 180)}} #nebel-f2{${abs(140, 1230, 800, 140)}}
     .sold{transform-origin:50% 100%;}`,
    stk(`      <div id="nebel-mo" class="STKC">${MOON()}</div>
      <div id="nebel-cl" class="STKC">${CLOUD()}</div>
      <div id="nebel-f0">${FOG(800, 160, 0.3)}</div>
${pos.map(([x, y], i) => SOLD(ids[i], x, y, 0.75)).join("\n")}
      <div id="nebel-f1">${FOG(800, 180, 0.35)}</div>
      <div id="nebel-f2">${FOG(800, 140, 0.4)}</div>`, p),
    `      tl.fromTo("#nebel-cl", { x: 60 }, { x: -40, duration: ${d}, ease: "none" }, 0);
      tl.fromTo("#nebel-f0", { x: -40, opacity: 0.5 }, { x: 30, opacity: 1, duration: ${d}, ease: "none" }, 0);
      tl.fromTo("#nebel-f1", { x: 40, opacity: 0.4 }, { x: -30, opacity: 1, duration: ${d}, ease: "none" }, 0);
      tl.fromTo("#nebel-f2", { x: -20, opacity: 0.3 }, { x: 20, opacity: 1, duration: ${d}, ease: "none" }, 0);
${march(ids, 0, d, 0.24)}${flicker(ids, 0, d)}`));
}

// ================= KOMPASS: compass needle spins, a red arrow turns off the dashed trail (c05) =================
{
  const p = "kompass";
  const [s, d] = S(p);
  scenes.push(scene(p, "Kompass dreht sich, Pfeil biegt falsch ab", s, d,
    `#kompass-c{${abs(120, 810, 420, 420)}transform-origin:50% 50%;}
     #kompass-tr{${abs(620, 800, 340, 540)}}`,
    stk(`      <div id="kompass-c" class="STKC">${COMPASS("kompass")}</div>
      <div id="kompass-tr" class="STKC">${SV(340, 540, `<path d="M110 530 V60" fill="none" stroke="${CREAM}" stroke-width="16" stroke-dasharray="30 22" stroke-linecap="round" opacity=".8"/>
        <path id="kompass-ar" d="M110 520 V330 Q110 220 220 220 H270" fill="none" stroke="${K}" stroke-width="54" stroke-linecap="round"/>
        <path id="kompass-ar2" d="M110 520 V330 Q110 220 220 220 H270" fill="none" stroke="${RED}" stroke-width="34" stroke-linecap="round"/>
        <path id="kompass-tip" d="M262 160 L336 220 L262 280 Z" fill="${RED}" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>`)}</div>`, p),
    `      gsap.set("#kompass-nd", { svgOrigin: "215 215" });
      tl.fromTo("#kompass-c", { scale: 0.85, rotation: -10 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2.4)" }, 0);
      tl.fromTo("#kompass-nd", { rotation: 0 }, { keyframes: { rotation: [0, 260, 150, 420, 330, 470] }, duration: 1.6, ease: "power1.inOut", immediateRender: true }, 0.05);
      tl.fromTo(["#kompass-ar", "#kompass-ar2"], { attr: { "stroke-dasharray": "0 900" } }, { attr: { "stroke-dasharray": "460 900" }, duration: 0.6, ease: "power2.out", immediateRender: true }, 0.15);
      tl.fromTo("#kompass-tip", { opacity: 0, scale: 0.4, svgOrigin: "300 220" }, { opacity: 1, scale: 1, svgOrigin: "300 220", duration: 0.2, ease: "back.out(3)", immediateRender: true }, 0.7);
      tl.to("#kompass-tip", { keyframes: { x: [0, 10, 0] }, duration: 0.4, ease: "sine.inOut", repeat: 2 }, 0.9);
      tl.to("#kompass-c", { keyframes: { rotation: [0, -4, 4, 0] }, duration: 0.6, ease: "sine.inOut" }, 1.2);`));
}

// ================= KARTE: hiking map, footprints walk across the dashed border, labels SCHWEIZ / LIECHTENSTEIN (c06) =================
{
  const p = "karte";
  const [s, d] = S(p);
  scenes.push(scene(p, "Wanderkarte mit Fussspuren ueber die Grenze", s, d,
    `#karte-m{${abs(110, 760, 860, 610)}}
     #karte-li{${abs(400, 792, 540, 76)}${LBL(72, LI_BLUE)}} #karte-ch{${abs(140, 1272, 330, 76)}${LBL(72, CH_RED)}}`,
    stk(`      <div id="karte-m" class="STKC">${MAP("karte")}</div>
      <div id="karte-li">LIECHTENSTEIN</div>
      <div id="karte-ch">SCHWEIZ</div>`, p),
    `      gsap.set([${FP.map((_, i) => `"#karte-fp${i}"`).join(", ")}], { opacity: 0 });
${FP.map((_, i) => `      tl.fromTo("#karte-fp${i}", { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: 0.12, ease: "back.out(2)", immediateRender: false }, ${f2(0.1 + i * 0.15)});`).join("\n")}
      tl.fromTo("#karte-li", { scale: 0.8 }, { scale: 1, duration: 0.25, ease: "back.out(2.4)" }, 0);
      tl.fromTo("#karte-ch", { scale: 0.8 }, { scale: 1, duration: 0.25, ease: "back.out(2.4)" }, 0.05);
      tl.to("#karte-li", { keyframes: { scale: [1, 1.06, 1] }, duration: 0.4, ease: "sine.inOut" }, 1.4);`));
}

// ================= SCHILD: the LIECHTENSTEIN sign grows big, the flag (blue-red, no crown) waves (c07) =================
{
  const p = "schild";
  const [s, d] = S(p);
  scenes.push(scene(p, "Schild LIECHTENSTEIN wird gross", s, d,
    `#schild-pl{transform-origin:50% 50%;}
     #schild-po{${abs(320, 1000, 22, 370)}background:${STONE_L};border:5px solid ${K};border-radius:8px;}
     #schild-fl{${abs(342, 1010, 400, 270)}}`,
    stk(`      <div id="schild-po" class="STKC"></div>
      <div id="schild-fl" class="STKC">${LIFLAG("schild", 400, 270)}</div>
${plate("schild-pl", 160, 790, 760, 160, "LIECHTENSTEIN", 90, LIBG, "#fff")}`, p),
    `      tl.fromTo("#schild-pl", { scale: 0.55 }, { scale: 1, duration: 0.45, ease: "back.out(1.4)" }, 0);
      tl.to("#schild-pl", { keyframes: { rotation: [0, -2, 2, 0] }, duration: 0.6, ease: "sine.inOut" }, 0.6);
      tl.fromTo("#schild-fl", { scaleX: 0.6, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 0.35, ease: "back.out(2)" }, 0.1);
${flagWave("schild", 0, d, 9)}`));
}

// ================= MUNITION: an empty cardboard box with the word LEER, a moth flutters out (c08) =================
{
  const p = "munition";
  const [s, d] = S(p);
  scenes.push(scene(p, "Leere Schachtel LEER", s, d,
    `#mun-bx{${abs(300, 960, 480, 400)}} #mun-fl{${abs(300, 912, 240, 70)}transform-origin:0% 100%;} #mun-fr{${abs(540, 912, 240, 70)}transform-origin:100% 100%;}
     #mun-lr{${abs(372, 1160, 336, 130)}border:9px solid ${RED};border-radius:16px;transform-origin:50% 50%;}
     #mun-lr-t{position:absolute;left:0;top:9px;width:100%;${LBL(100, RED)}}
     #mun-mo{${abs(495, 940, 90, 70)}transform-origin:50% 50%;}`,
    stk(`      <div id="mun-bx" class="STKC">${BOX()}</div>
      <div id="mun-fl" class="STKC">${FLAP()}</div>
      <div id="mun-fr" class="STKC">${FLAP()}</div>
      <div id="mun-lr"><div id="mun-lr-t">LEER</div></div>
      <div id="mun-mo" class="STKC">${MOTH("mun-mo")}</div>`, p),
    `      gsap.set("#mun-mo-wl", { svgOrigin: "45 38" }); gsap.set("#mun-mo-wr", { svgOrigin: "45 38" });
      tl.fromTo("#mun-fl", { rotation: 0 }, { rotation: -28, duration: 0.3, ease: "back.out(2)" }, 0);
      tl.fromTo("#mun-fr", { rotation: 0 }, { rotation: 28, duration: 0.3, ease: "back.out(2)" }, 0.05);
      tl.fromTo("#mun-lr", { scale: 1.8, rotation: -14, opacity: 0 }, { scale: 1, rotation: -6, opacity: 1, duration: 0.22, ease: "power3.in", immediateRender: true }, 0.35);
${shake("#mun-bx", 0.57, 8, 0.3)}
      tl.fromTo("#mun-mo", { x: 0, y: 0, scale: 0.5, opacity: 0 }, { keyframes: { x: [0, 60, 140, 200], y: [0, -60, -100, -150], scale: [0.5, 1, 1, 1], opacity: [0, 1, 1, 1] }, duration: 1.3, ease: "sine.inOut", immediateRender: true }, 0.5);
      tl.to(["#mun-mo-wl", "#mun-mo-wr"], { keyframes: { scaleX: [1, 0.3, 1] }, duration: 0.14, ease: "none", repeat: 9 }, 0.5);`));
}

// ================= UMKEHR: soldiers notice, turn around and walk back over the line; U-turn arrow (c09) =================
{
  const p = "umkehr";
  const [s, d] = S(p);
  const pos = [[600, 1180], [760, 1086], [690, 1240]];
  const TURN = 0.5, WALK = 0.7, DX = -430;
  scenes.push(scene(p, "Trupp kehrt um", s, d,
    `#umkehr-ln{${abs(540, 770, 30, 600)}}
     #umkehr-ar{${abs(620, 930, 340, 170)}transform-origin:50% 100%;}
     #umkehr-lf{${abs(810, 790, 150, 102)}}
     .umkehr-g{position:absolute;left:0;top:0;width:1080px;height:1920px;} .sold{transform-origin:50% 100%;}`,
    stk(`      <div id="umkehr-ln">${DASH(30, 600, "M15 12 V588", "umkehr-ln")}</div>
${plate("umkehr-ch", 110, 790, 340, 104, "SCHWEIZ", 72, CHBG, "#fff")}
      <div id="umkehr-lf" class="STKC">${LIFLAG("umkehr-lf", 150, 102)}</div>
      <div id="umkehr-ar" class="STKC">${UTURN()}</div>
${pos.map(([x, y], i) => `      <div id="umkehr-g${i}" class="umkehr-g">
${SOLD(`umkehr-r${i}`, x, y, 0.7)}
${SOLD(`umkehr-l${i}`, x, y, 0.7, true)}
      </div>`).join("\n")}`, p),
    `      gsap.set([${pos.map((_, i) => `"#umkehr-l${i}"`).join(", ")}], { opacity: 0 });
      tl.fromTo("#umkehr-ar", { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25, ease: "back.out(2.6)", immediateRender: true }, ${TURN});
      tl.to("#umkehr-ar", { keyframes: { y: [0, -10, 0] }, duration: 0.5, ease: "sine.inOut", repeat: 3 }, ${f2(TURN + 0.3)});
${pos.map((_, i) => `      tl.fromTo("#umkehr-g${i}", { x: 0 }, { x: 24, duration: ${TURN}, ease: "none" }, 0);
      tl.set("#umkehr-r${i}", { opacity: 0 }, ${f2(TURN + i * 0.05)}); tl.set("#umkehr-l${i}", { opacity: 1 }, ${f2(TURN + i * 0.05)});
      tl.to("#umkehr-g${i}", { x: ${DX + 24}, duration: ${f2(d - WALK - 0.1)}, ease: "power1.inOut" }, ${f2(WALK + i * 0.05)});`).join("\n")}
${march(pos.map((_, i) => `umkehr-r${i}`), 0, TURN)}${march(pos.map((_, i) => `umkehr-l${i}`), TURN, f2(d - TURN))}${flicker(pos.map((_, i) => `umkehr-l${i}`), TURN, f2(d - TURN))}
      tl.fromTo(["#umkehr-ln-dk", "#umkehr-ln-dy"], { attr: { "stroke-dashoffset": 0 } }, { attr: { "stroke-dashoffset": 66 }, duration: ${d}, ease: "none" }, 0);
${flagWave("umkehr-lf", 0, d, 4)}`));
}

// ================= FAHNE: Liechtenstein's flag waves, label LIECHTENSTEIN, a big "?" (c10) =================
{
  const p = "fahne";
  const [s, d] = S(p);
  scenes.push(scene(p, "Fahne Liechtenstein und Fragezeichen", s, d,
    `#fahne-po{${abs(250, 800, 24, 560)}background:${STONE_L};border:5px solid ${K};border-radius:8px;}
     #fahne-fl{${abs(274, 812, 420, 290)}}
     #fahne-q{${abs(760, 800, 200, 260)}${LBL(240, YEL)}-webkit-text-stroke:16px ${K};paint-order:stroke fill;transform-origin:50% 90%;}
     #fahne-lb{transform-origin:50% 50%;}`,
    stk(`      <div id="fahne-po" class="STKC"></div>
      <div id="fahne-fl" class="STKC">${LIFLAG("fahne", 420, 290)}</div>
      <div id="fahne-q">?</div>
${plate("fahne-lb", 320, 1172, 600, 110, "LIECHTENSTEIN", 72, `background:${CREAM};`, LI_BLUE)}`, p),
    `      tl.fromTo("#fahne-q", { scale: 0.5, rotation: 20 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2.6)" }, 0.1);
      tl.to("#fahne-q", { keyframes: { rotation: [0, -8, 6, -4, 0] }, duration: 0.8, ease: "sine.inOut", repeat: 1 }, 0.4);
      tl.fromTo("#fahne-lb", { scale: 0.8 }, { scale: 1, duration: 0.25, ease: "back.out(2.4)" }, 0);
${flagWave("fahne", 0, d, 10)}`));
}

// ================= DORF: sleeping village, dark windows, "Zzz" rises from the houses (not from Klotz) (c11) =================
{
  const p = "dorf";
  const [s, d] = S(p);
  const H = [[110, 1150, 170, 190, "#D9CBB0"], [290, 1090, 190, 250, "#E8D8B8"], [660, 1120, 170, 220, "#D0C0A4"], [840, 1170, 140, 170, "#E2D4BA"]];
  const Z = [[300, 980, 0.0], [690, 1010, 0.45], [120, 1050, 0.9]];
  scenes.push(scene(p, "Schlafendes Dorf", s, d,
    `#dorf-hl{${abs(115, 1300, 850, 70)}}
     #dorf-mo{${abs(840, 780, 130, 130)}}
     #dorf-ch{${abs(490, 980, 160, 360)}}
     ${H.map(([x, y, w, h], i) => `#dorf-h${i}{${abs(x, y, w, h)}}`).join(" ")}
     .dorf-z{position:absolute;width:150px;height:90px;${LBL(84, "#fff")}-webkit-text-stroke:12px ${K};paint-order:stroke fill;transform-origin:50% 50%;}`,
    stk(`      <div id="dorf-mo" class="STKC">${MOON()}</div>
      <div id="dorf-hl" class="STKC">${SV(850, 70, `<path d="M0 70 V30 Q212 0 425 20 Q637 40 850 10 V70 Z" fill="${SNOW}" stroke="${K}" stroke-width="8"/>`)}</div>
      <div id="dorf-ch" class="STKC">${CHURCH()}</div>
${H.map(([, , , , c], i) => `      <div id="dorf-h${i}" class="STKC">${HOUSE(0, 0, c)}</div>`).join("\n")}
${Z.map(([x, y], i) => `      <div id="dorf-z${i}" class="dorf-z" style="left:${x}px;top:${y}px;">Zzz</div>`).join("\n")}`, p),
    `      gsap.set([${[0, 1, 2, 3].map((i) => `"#dorf-h${i}"`).join(", ")}], { transformOrigin: "50% 100%" });
${Z.map(([, , t0], i) => `      tl.fromTo("#dorf-z${i}", { y: 40, x: 0, scale: 0.4, opacity: 0 }, { keyframes: { y: [40, -20, -80, -130], x: [0, 14, -8, 10], scale: [0.4, 1, 1, 1.05], opacity: [0, 1, 1, 0] }, duration: 1.5, ease: "none", immediateRender: true }, ${t0});`).join("\n")}
${[0, 1, 2, 3].map((i) => `      tl.to("#dorf-h${i}", { keyframes: { scaleY: [1, 0.97, 1] }, duration: 1.2, ease: "sine.inOut", repeat: 1 }, ${f2(i * 0.2)});`).join("\n")}
      tl.to("#dorf-mo", { keyframes: { rotation: [0, 6, 0] }, duration: ${d}, ease: "sine.inOut" }, 0);`));
}

// ================= TELEFON: an old telephone rings, speech bubble with the Swiss flag (c12) =================
{
  const p = "telefon";
  const [s, d] = S(p);
  scenes.push(scene(p, "Telefon klingelt", s, d,
    `#tel-ph{${abs(290, 1010, 440, 340)}} #tel-hs{${abs(300, 930, 420, 130)}transform-origin:50% 100%;}
     #tel-r0{${abs(160, 940, 100, 160)}transform-origin:100% 50%;} #tel-r1{${abs(760, 940, 100, 160)}transform-origin:0% 50%;}
     #tel-bb{${abs(610, 772, 330, 200)}transform-origin:10% 100%;} #tel-sf{${abs(715, 795, 110, 110)}}`,
    stk(`      <div id="tel-ph" class="STKC">${PHONE()}</div>
      <div id="tel-hs" class="STKC">${HANDSET()}</div>
      <div id="tel-r0">${RINGS(false)}</div>
      <div id="tel-r1">${RINGS(true)}</div>
      <div id="tel-bb" class="STKC">${BUBBLE()}</div>
      <div id="tel-sf">${SWISSFLAG()}</div>`, p),
    `      tl.to("#tel-hs", { keyframes: { y: [0, -18, 0, -14, 0], rotation: [0, -4, 3, -3, 0] }, duration: 0.4, ease: "none", repeat: 5 }, 0);
      tl.fromTo(["#tel-r0", "#tel-r1"], { scale: 0.6, opacity: 1 }, { keyframes: { scale: [0.6, 1.1, 0.6], opacity: [1, 1, 0.4] }, duration: 0.4, ease: "none", repeat: 5, immediateRender: true }, 0);
      tl.fromTo(["#tel-bb", "#tel-sf"], { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2.4)", immediateRender: true }, 0.5);
      tl.to("#tel-sf", { keyframes: { rotation: [0, -6, 6, 0] }, duration: 0.6, ease: "sine.inOut", repeat: 1 }, 1.0);
      tl.to("#tel-hs", { y: -30, rotation: -8, duration: 0.25, ease: "back.out(2)" }, 2.4);`));
}

// ================= BRIEF: a letter ENTSCHULDIGUNG slides out of the envelope, a wax seal with the Swiss cross stamps (c13) =================
{
  const p = "brief";
  const [s, d] = S(p);
  scenes.push(scene(p, "Brief mit Siegel", s, d,
    `#brief-eb{${abs(190, 1130, 700, 240)}} #brief-ef{${abs(190, 1180, 700, 190)}}
     #brief-cl{${abs(150, 740, 780, 470)}overflow:hidden;}
     #brief-lt{position:absolute;left:60px;top:50px;width:660px;height:520px;}
     #brief-h{position:absolute;left:0;top:46px;width:660px;${LBL(72, K)}}
     #brief-se{${abs(660, 1040, 150, 150)}transform-origin:50% 50%;}`,
    stk(`      <div id="brief-eb" class="STKC">${ENV_BACK()}</div>
      <div id="brief-cl"><div id="brief-lt">${LETTER()}<div id="brief-h">ENTSCHULDIGUNG</div></div></div>
      <div id="brief-ef" class="STKC">${ENV_FRONT()}</div>
      <div id="brief-se" class="STKC">${SEAL()}</div>`, p),
    `      tl.fromTo("#brief-lt", { y: 230 }, { y: 0, duration: 0.5, ease: "back.out(1.4)" }, 0);
      tl.fromTo("#brief-se", { scale: 2.2, opacity: 0, rotation: -20 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.2, ease: "power3.in", immediateRender: true }, 0.7);
${shake("#brief-ef", 0.9, 6, 0.3)}
      tl.to("#brief-se", { keyframes: { scale: [1, 1.08, 1] }, duration: 0.5, ease: "sine.inOut", repeat: 1 }, 1.0);`));
}

// ================= LAMPE: a big flashlight clicks on, the beam sweeps, the moth from the box flutters in it (c14) =================
{
  const p = "lampe";
  const [s, d] = S(p);
  scenes.push(scene(p, "Taschenlampe geht an", s, d,
    `#lampe-to{${abs(110, 950, 300, 140)}transform-origin:0% 50%;}
     #lampe-bm{${abs(400, 800, 560, 440)}transform-origin:0% 50%;}
     #lampe-mo{${abs(700, 960, 90, 70)}transform-origin:50% 50%;}`,
    stk(`      <div id="lampe-bm">${BEAM("lampe")}</div>
      <div id="lampe-to" class="STKC">${TORCH()}</div>
      <div id="lampe-mo" class="STKC">${MOTH("lampe-mo")}</div>`, p),
    `      gsap.set("#lampe-mo-wl", { svgOrigin: "45 38" }); gsap.set("#lampe-mo-wr", { svgOrigin: "45 38" });
      tl.fromTo("#lampe-bm", { opacity: 0.15 }, { keyframes: { opacity: [0.15, 1, 0.5, 1] }, duration: 0.3, ease: "none", immediateRender: true }, 0.2);
      tl.fromTo(["#lampe-bm", "#lampe-to"], { rotation: -4 }, { keyframes: { rotation: [-4, 4, -2] }, duration: ${f2(d - 0.1)}, ease: "sine.inOut", immediateRender: true }, 0);
      tl.fromTo("#lampe-mo", { x: 0, y: 0 }, { keyframes: { x: [0, 60, 20, 80], y: [0, -40, 20, -10] }, duration: ${f2(d - 0.1)}, ease: "sine.inOut" }, 0);
      tl.to(["#lampe-mo-wl", "#lampe-mo-wr"], { keyframes: { scaleX: [1, 0.3, 1] }, duration: 0.14, ease: "none", repeat: 10 }, 0);`));
}

// ================= STRICH: wooden board with a tally, a new stroke is painted (punchline ERSTE), sparks, shake (c15) =================
{
  const p = "strich";
  const [s, d] = S(p);
  const b = burst("strich-sp", 10, 540, 1020, 60, 270, 2007);
  scenes.push(scene(p, "Strichliste auf der Holztafel", s, d,
    `#strich-bd{${abs(170, 800, 740, 560)}}`,
    stk(`      <div id="strich-bd" class="STKC">${BOARD("strich")}</div>
${b.html}`, p),
    `      gsap.set("#strich-m2", { svgOrigin: "436 104" });
      tl.fromTo("#strich-m2", { scaleY: 0 }, { scaleY: 1, duration: 0.35, ease: "power2.out", immediateRender: true }, 0.4);
${shake("#strich-bd", 0.8, 12, 0.45)}
${b.js(0.78)}
      tl.to("#strich-bd", { keyframes: { rotation: [0, -1.5, 1.5, 0] }, duration: 1.2, ease: "sine.inOut" }, 1.5);`));
}

// ================= FRAGE + loop: postcard with the Swiss stamp and a "?", then the hook picture again (c16 + c17) =================
{
  const p = "frage";
  const [s, d] = S(p);
  const LOOP = f2(C.c17[0] - s);
  const hookIds = ["#frage-mt", "#frage-ln", "#frage-lip", "#frage-li", "#frage-ch", ...HS.map((_, i) => `#frage-s${i}`)];
  scenes.push(scene(p, "Frage und Loop", s, d, hookCss(p) + `
     #frage-pc{${abs(150, 790, 780, 500)}transform-origin:50% 100%;}
     #frage-q{${abs(560, 880, 200, 280)}${LBL(240, YEL)}-webkit-text-stroke:16px ${K};paint-order:stroke fill;transform-origin:50% 90%;}`,
    hookBody(p) + `
      <div id="frage-pc" class="frage-stk">${POSTCARD()}</div>
      <div id="frage-q">?</div>`,
    `      gsap.set([${hookIds.map((x) => `"${x}"`).join(", ")}], { opacity: 0 });
      tl.fromTo("#frage-pc", { scale: 0.85, rotation: -4 }, { scale: 1, rotation: 0, duration: 0.35, ease: "back.out(2)" }, 0);
      tl.fromTo("#frage-q", { scale: 0.6, rotation: 20 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2.6)" }, 0.2);
      tl.to("#frage-q", { keyframes: { rotation: [0, -8, 6, -4, 0] }, duration: 0.9, ease: "sine.inOut", repeat: 1 }, 0.5);
      tl.to("#frage-pc", { keyframes: { rotation: [0, 1.5, -1.5, 0] }, duration: 1.6, ease: "sine.inOut" }, 0.5);
      // loop (${LOOP}): hard switch in one frame - postcard gone, hook picture in its frame-0 pose
      tl.set(["#frage-pc", "#frage-q"], { opacity: 0 }, ${LOOP});
      tl.set([${hookIds.map((x) => `"${x}"`).join(", ")}], { opacity: 1 }, ${LOOP});
${hookIdle(p, LOOP, f2(d - LOOP))}`,
    { exit: false, kb: false }));
}

// ================= background: Alps at night - sky, a few stars outside the text area, two mountain ranges (loop-seamless) =================
{
  const RS = mulberry32(1100);
  const stars = Array.from({ length: 34 }, (_, i) => { const top = i < 14; return { x: Math.round(40 + RS() * 1000), y: Math.round(top ? 30 + RS() * 220 : 720 + RS() * 380), r: +(2 + RS() * 3).toFixed(1), g: i % 3 }; });
  const far = "M0 1300 L90 1180 L170 1240 L290 1090 L380 1180 L470 1120 L560 1210 L680 1060 L790 1170 L880 1110 L1000 1200 L1080 1150 L1080 1920 L0 1920 Z";
  const near = "M0 1460 L120 1380 L240 1450 L360 1330 L500 1440 L620 1370 L760 1470 L900 1360 L1080 1440 L1080 1920 L0 1920 Z";
  fs.writeFileSync(path.join(OUT, "compositions", "bg.html"), `<template>
  <style>
    #root { position: absolute; inset: 0; overflow: hidden; background: #0E1530; }
    #bg-sky { position: absolute; inset: 0; background: linear-gradient(180deg, #080D24 0%, #0E1530 40%, #172058 75%, #1C2560 100%); }
    #bg-mt { position: absolute; left: 0; top: 0; }
    .bg-st { position: absolute; left: 0; top: 0; }
  </style>
  <div id="root" data-composition-id="bg" data-width="1080" data-height="1920" data-layout-allow-overflow>
    <div id="bg-sky"></div>
${[0, 1, 2].map((g) => `    <svg id="bg-st${g}" class="bg-st" width="1080" height="1920">${stars.filter((s) => s.g === g).map((s) => `<circle cx="${s.x}" cy="${s.y}" r="${s.r}" fill="#fff" opacity=".7"/>`).join("")}</svg>`).join("\n")}
    <svg id="bg-mt" width="1080" height="1920" viewBox="0 0 1080 1920"><path d="${far}" fill="#1A2458"/><path d="M290 1090 L330 1140 L305 1150 L282 1134 L262 1146 L256 1130 Z M680 1060 L722 1110 L698 1118 L676 1104 L654 1116 L650 1100 Z" fill="#8E9AD0" opacity=".55"/><path d="${near}" fill="#121A44"/><path d="M360 1330 L400 1372 L378 1380 L356 1366 L336 1376 L332 1362 Z M900 1360 L940 1400 L918 1408 L896 1394 L874 1404 L872 1390 Z" fill="#7A86BE" opacity=".5"/></svg>
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
// "*" keyword (yellow Lilita, 140 px), "!" punchline (largest, 160 px). "/" line break.
// "+" glues a word to the one before (no gap): counted as one word.
// Fixed word gap: every word has 11 px margins. No negative letter spacing anywhere.
const HOOKW = ["Die", "*SCHWEIZ", "/", "marschiert", "ein?!"];
const caps = [
  { id: "c01", words: HOOKW, still: true },
  { id: "c02", words: ["März", "*2007.", "/", "Mitten", "in", "/", "der", "Nacht."] },
  { id: "c03", words: ["Rund", "*170", "/", "Schweizer", "Soldaten", "/", "beim", "Training."], cls: "s88" },
  { id: "c04", words: ["Schlechtes", "/", "Wetter.", "Dunkel.", "/", "Und", "dann:"] },
  { id: "c05", words: ["Sie", "biegen", "/", "*FALSCH", "ab."], shake: true },
  { id: "c06", words: ["Über", "einen", "/", "Kilometer", "weit …"] },
  { id: "c07", words: ["nach", "Liechtenstein."], cls: "s86" },
  { id: "c08", words: ["Die", "Gewehre?", "/", "Ohne", "Munition."] },
  { id: "c09", words: ["Sie", "merken", "es", "/", "und", "kehren", "um."] },
  { id: "c10", words: ["Und", "Liechtenstein?"], cls: "s88" },
  { id: "c11", words: ["Hat", "es", "nicht", "/", "mal", "*GEMERKT."], shake: true },
  { id: "c12", words: ["Die", "Schweiz", "/", "meldet", "es", "/", "ganz", "*SELBST."] },
  { id: "c13", words: ["Und", "entschuldigt", "/", "sich", "offiziell."] },
  { id: "c14", words: ["Und", "das", "Beste?"] },
  { id: "c15", words: ["Es", "war", "nicht", "das", "/", "!ERSTE", "Mal."], shake: true },
  { id: "c16", words: ["Welchen", "Nachbarn", "/", "würdest", "du", "/", "gern", "„besuchen“?"], cls: "s88", hard: true },
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
    const txt = (k ? core(w).slice(1) : core(w)).replace(/</g, "&lt;");
    const nx = c.words[i + 1] === "/" ? c.words[i + 2] : c.words[i + 1];
    const gl = [glue(w) ? "gl" : "", nx && glue(nx) ? "gr" : ""].filter(Boolean).join(" ");
    const cls = { "*": "w kw", "!": "w pt", "": "w" }[k] + (gl ? " " + gl : "");
    return `<span id="${c.id}-o${i}" class="${cls}"><span id="${c.id}-w${i}" class="g">${txt}</span></span>`;
  });
  let inner = "";
  spans.forEach((sp, i) => { inner += (i && !glue(c.words[i]) ? " " : "") + sp; });
  capHtml += `      <div id="${c.id}" class="cap clip${c.cls ? " " + c.cls : ""}" data-start="${c.s}" data-duration="${d}" data-track-index="${track}" data-layout-allow-overlap>${inner.replace(/ <br\/> /g, "<br/>").replace(/ <br\/>/g, "<br/>")}</div>\n`;
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
    .cap.s88 { font-size: 88px; } /* long German words ("Liechtenstein", "Schweizer Soldaten") stay under 920 px without a smaller word gap */
    .cap.s86 { font-size: 86px; }
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

// ================= Klotz (rig from Folge 1-10; new gag: hiking map upside down, border hop at the end) =================
// eyes always open: no mood closes the lids, and there is no wink in this episode. The right arm never points outward to the right.
// While he holds the map the left arm stays at 70 deg (the hand next to the map).
const M = {
  shock:      { eye: 1.12, ps: 0.6, px: 0, py: 0, bL: -18, bR: -18, tL: -6, tR: -6, mx: 1, my: 1.1, g: 0, aL: 70, aR: -45 },
  surprised:  { eye: 1.08, ps: 0.8, px: 0, py: 6, bL: -16, bR: -16, tL: 0, tR: 0, mx: 0.55, my: 0.6, g: 0, aL: 55, aR: -45 },
  curious:    { eye: 1.05, ps: 1.1, px: -14, py: -10, bL: -18, bR: -4, tL: 0, tR: 0, mx: 0.5, my: 0.35, g: 0, aL: 40, aR: -40 },
  look:       { eye: 1.06, ps: 1.0, px: -14, py: -12, bL: -14, bR: -14, tL: -4, tR: -4, mx: 0.5, my: 0.5, g: 0, aL: 40, aR: -40 },
  map:        { eye: 1.06, ps: 1.0, px: -16, py: 12, bL: -10, bR: -14, tL: -4, tR: 2, mx: 0.4, my: 0.35, g: 0, aL: 70, aR: -40 },
  down:       { eye: 1.14, ps: 0.75, px: -10, py: 16, bL: -20, bR: -20, tL: -4, tR: -4, mx: 0.8, my: 0.9, g: 0, aL: 55, aR: -45 },
  impressed:  { eye: 1.05, ps: 0.9, px: -6, py: -4, bL: -12, bR: -12, tL: -4, tR: -4, mx: 0.45, my: 0.45, g: 0, aL: 40, aR: -40 },
  jawdrop:    { eye: 1.18, ps: 0.55, px: -6, py: -8, bL: -22, bR: -22, tL: -4, tR: -4, mx: 1.1, my: 1.7, jy: 14, g: 0, aL: 60, aR: -45 },
  happy:      { eye: 1.04, ps: 1, px: 0, py: 0, bL: -10, bR: -10, tL: -4, tR: -4, mx: 0, my: 0, g: 1, gs: 0.8, aL: 35, aR: -35 },
  sheepish:   { eye: 1.04, ps: 0.95, px: 10, py: 4, bL: -6, bR: -16, tL: 6, tR: -6, mx: 0, my: 0, g: 1, gs: 0.6, aL: 35, aR: -35 },
  eager:      { eye: 1.08, ps: 1.05, px: -10, py: -6, bL: -16, bR: -16, tL: -4, tR: -4, mx: 0, my: 0, g: 1, gs: 0.75, aL: 70, aR: -40 },
};
const LOOPK = C.c17[0];
const MAP_ON = f2(C.c05[0] + 0.35), MAP_OFF = f2(C.c14[0] + 0.35);
const HOP_T = f2(C.c16[0] + 0.7), BACK_T = f2(HOP_T + 1.0), LINE_ON = f2(C.c16[0] + 0.3);
const moods = [
  [C.c02[0], "curious"], [C.c03[0], "impressed"], [C.c04[0], "look"], [C.c05[0], "surprised"], [f2(MAP_ON + 0.2), "map"], [C.c06[0], "eager"],
  [C.c07[0], "map"], [C.c08[0], "surprised"], [C.c09[0], "look"], [C.c10[0], "curious"], [C.c11[0], "jawdrop"], [f2(C.c11[0] + 1.2), "happy"],
  [C.c12[0], "surprised"], [C.c13[0], "impressed"], [C.c14[0], "eager"], [f2(C.c15[0] + 0.3), "jawdrop"], [C.c16[0], "happy"],
  [f2(HOP_T + 0.35), "down"], [f2(BACK_T + 0.3), "sheepish"], [f2(LOOPK + 0.03), "shock"],
];
const holding = (t) => t >= MAP_ON - 0.2 && t < MAP_OFF;

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
      gsap.set(["#k-chkL", "#k-chkR"], { svgOrigin: "150 198", opacity: 0.4 });
      gsap.set("#k-sweat", { svgOrigin: "262 92", opacity: 0, scale: 0 });
      gsap.set("#k-map", { opacity: 0, scale: 0, x: 0, y: 0, rotation: 0, transformOrigin: "85% 70%" });
      gsap.set(["#k-bl", "#k-lf"], { opacity: 0 });
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
kJs += `      // GAG 1 (${MAP_ON}): he holds the hiking map - upside down - and follows the troop (walks in place)
      tl.to("#k-map", { opacity: 1, scale: 1, rotation: -6, duration: 0.25, ease: "back.out(2.6)" }, ${MAP_ON});
      tl.to("#k-map", { keyframes: { rotation: [-6, 4, -6] }, duration: 0.8, ease: "sine.inOut", repeat: 1 }, ${f2(MAP_ON + 0.3)});
      tl.to("#k-bob", { keyframes: { y: [0, -10, 0, -10, 0, -10, 0, -10, 0] }, duration: 1.6, ease: "none" }, ${f2(C.c06[0] + 0.1)});
      tl.to("#k-wrap", { keyframes: { rotation: [0, -3, 0, 3, 0] }, duration: 1.6, ease: "sine.inOut" }, ${f2(C.c06[0] + 0.1)});
      tl.to("#k-map", { keyframes: { y: [0, -8, 0], rotation: [-6, -12, -6] }, duration: 0.6, ease: "sine.inOut", repeat: 1 }, ${f2(C.c09[0] + 0.3)});
      // c10: he leans forward and back
      tl.to("#k-wrap", { keyframes: { rotation: [0, -9, -9, 0], y: [0, 4, 4, 0] }, duration: 1.4, ease: "power2.inOut" }, ${f2(C.c10[0] + 0.1)});
      // c14 (${MAP_OFF}): he pulls the map away
      tl.to("#k-map", { keyframes: { x: [0, 20, -90], rotation: [-6, 10, -40], opacity: [1, 1, 0], scale: [1, 1.05, 0.5] }, duration: 0.4, ease: "power2.in" }, ${MAP_OFF});
      // GAG 2 (${HOP_T}): a border line appears at his feet; he hops over it, notices it and hops back (short hop, back on his spot)
      tl.to(["#k-bl", "#k-lf"], { opacity: 1, duration: 0.2, ease: "none" }, ${LINE_ON});
      tl.to("#k-wrap", { keyframes: { x: [0, -36, -72], y: [0, -46, 0] }, duration: 0.35, ease: "none" }, ${HOP_T});
      tl.to("#k-sweat", { opacity: 1, scale: 1, duration: 0.2, ease: "back.out(2)" }, ${f2(HOP_T + 0.4)});
      tl.to("#k-wrap", { keyframes: { x: [-72, -36, 0], y: [0, -40, 0] }, duration: 0.35, ease: "none" }, ${BACK_T});
      tl.to("#k-sweat", { keyframes: { y: [0, 30], opacity: [1, 0] }, duration: 0.5, ease: "power1.in" }, ${f2(BACK_T + 0.3)});
      tl.to(["#k-chkL", "#k-chkR"], { opacity: 0.95, scale: 1.2, duration: 0.25, ease: "power2.out" }, ${f2(BACK_T + 0.3)});
      // loop (${LOOPK}): border props off, cheeks normal, frame-0 shock pose with the jump
      tl.set(["#k-bl", "#k-lf"], { opacity: 0 }, ${LOOPK});
      tl.set(["#k-chkL", "#k-chkR"], { opacity: 0.4, scale: 1 }, ${LOOPK});
      tl.set("#k-sweat", { opacity: 1, scale: 1, y: 0 }, ${LOOPK});
      tl.to("#k-wrap", { keyframes: { y: [0, -16, 0] }, duration: 0.3, ease: "none" }, ${f2(LOOPK + 0.05)});
`;
fs.writeFileSync(path.join(OUT, "compositions", "klotz.html"), `<template>
  <style>
    ${FONTFACE}
    #root { position: absolute; inset: 0; pointer-events: none; }
    #k-pod { position: absolute; left: 640px; top: 1730px; width: 360px; height: 140px; }
    #k-bl { position: absolute; left: 662px; top: 1560px; width: 30px; height: 300px; }
    #k-lf { position: absolute; left: 520px; top: 1590px; width: 120px; height: 200px; }
    #k-wrap { position: absolute; left: 700px; top: 1480px; width: 260px; height: 286px; transform-origin: 50% 100%; }
    #k-bob, #k-sq { position: absolute; inset: 0; transform-origin: 50% 100%; }
    #k-map { position: absolute; left: -112px; top: 118px; width: 130px; height: 110px; }
  </style>
  <div id="root" data-composition-id="klotz" data-width="1080" data-height="1920" data-layout-allow-overflow>
    <div id="k-pod"><svg viewBox="0 0 360 140" width="100%" height="100%" overflow="visible"><path d="M10 136 L30 60 Q60 26 120 30 L190 14 Q260 10 300 40 L344 70 L352 136 Z" fill="${STONE}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
      <path d="M30 60 Q60 26 120 30 L190 14 Q260 10 300 40 L344 70 Q300 60 270 66 Q240 50 200 58 Q150 46 120 60 Q80 50 30 60 Z" fill="${SNOW}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M90 100 L130 84 M230 96 L276 108" stroke="${STONE_D}" stroke-width="7" stroke-linecap="round"/></svg></div>
    <div id="k-bl">${SV(30, 300, `<path d="M15 10 V290" fill="none" stroke="${K}" stroke-width="20" stroke-dasharray="36 22" stroke-linecap="round"/><path d="M15 10 V290" fill="none" stroke="${YEL}" stroke-width="9" stroke-dasharray="36 22" stroke-linecap="round"/>`)}</div>
    <div id="k-lf">${SV(120, 200, `<rect x="8" y="10" width="12" height="186" rx="5" fill="${STONE_L}" stroke="${K}" stroke-width="5"/><rect x="20" y="14" width="94" height="32" fill="${LI_BLUE}" stroke="${K}" stroke-width="5"/><rect x="20" y="46" width="94" height="32" fill="${LI_RED}" stroke="${K}" stroke-width="5"/>`)}</div>
    <div id="k-wrap"><div id="k-bob"><div id="k-sq">
${klotzSvg}
      <div id="k-map" class="k-prop">${KMAP()}</div>
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
  [0.0, "impact", 0.35], [0.0, "march", 0.4], [0.3, "boing", 0.3], [0.9, "march", 0.35], [1.5, "click", 0.3],
  [c("c02"), "whoosh1", 0.35], [c("c02"), "rain", 0.4], [c("c02") + 0.1, "wind", 0.35], [c("c02") + 0.4, "ding", 0.25],
  [c("c03"), "pop1", 0.4], [c("c03") + 0.05, "march", 0.45], [c("c03") + 0.9, "march", 0.4], [c("c03") + 1.8, "march", 0.4], [c("c03") + 0.6, "ding", 0.25],
  [c("c04"), "wind", 0.4], [c("c04") + 0.2, "click", 0.3], [c("c04") + 0.8, "click", 0.25], [c("c04") + 1.5, "march", 0.3], [c("c04") + 1.9, "hmm", 0.3],
  [c("c05"), "tick", 0.4], [c("c05") + 0.15, "swish", 0.35], [c("c05") + 0.7, "error", 0.35], [c("c05") + 0.5, "paper", 0.3],
  [c("c06"), "whoosh2", 0.3], ...Array.from({ length: 10 }, (_, i) => [c("c06") + 0.1 + i * 0.15, "step", 0.4]),
  [c("c07"), "zoom", 0.35], [c("c07") + 0.1, "flag", 0.35], [c("c07") + 0.45, "ding", 0.3], [c("c07") + 0.5, "sparkle", 0.3],
  [c("c08"), "flap", 0.4], [c("c08") + 0.35, "stamp", 0.5], [c("c08") + 0.5, "flutter", 0.35], [c("c08") + 1.0, "flutter", 0.3],
  [c("c09"), "march", 0.35], [c("c09") + 0.5, "boing", 0.3], [c("c09") + 0.6, "pop2", 0.35], [c("c09") + 0.8, "march", 0.4], [c("c09") + 1.6, "march", 0.35],
  [c("c10"), "flag", 0.35], [c("c10") + 0.1, "hmm", 0.35], [c("c10") + 0.2, "pop1", 0.3],
  [c("c11"), "snore", 0.45], [c("c11") + 0.45, "snore", 0.4], [c("c11") + 0.9, "snore", 0.35], [c("c11") + 0.35, "impact", 0.25],
  [c("c12"), "ring", 0.4], [c("c12") + 1.2, "ring", 0.35], [c("c12") + 0.5, "pop2", 0.35], [c("c12") + 2.4, "click", 0.3],
  [c("c13"), "paper", 0.4], [c("c13") + 0.7, "stamp", 0.45], [c("c13") + 0.75, "sparkle", 0.25],
  [c("c14"), "whoosh1", 0.3], [c("c14") + 0.2, "click", 0.45], [c("c14") + 0.35, "paper", 0.3], [c("c14") + 0.4, "flutter", 0.25],
  [c("c15") + 0.4, "brush", 0.45], [c("c15") + 0.78, "impact", 0.4], [c("c15") + 0.8, "sparkle", 0.35], [c("c15") + 0.8, "stamp", 0.3],
  [c("c16"), "pop1", 0.4], [c("c16") + 0.2, "pop2", 0.35], [LINE_ON, "swish", 0.3], [HOP_T, "jump", 0.4], [HOP_T + 0.35, "step", 0.35], [HOP_T + 0.4, "hmm", 0.3], [BACK_T, "jump", 0.35], [BACK_T + 0.35, "step", 0.3],
  [LOOPK - 0.15, "whoosh2", 0.4], [LOOPK, "impact", 0.3], [LOOPK + 0.05, "march", 0.35],
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
      <audio id="music-march" class="clip" src="assets/sfx/music.wav" data-start="0" data-duration="${DUR}" data-track-index="5" data-volume="0.5"></audio>
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
