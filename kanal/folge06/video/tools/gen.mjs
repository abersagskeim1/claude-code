// Generator for Folge 6 "Twitch Plays Pokémon": writes index.html and compositions/*.html
// Usage: node tools/gen.mjs <project_dir>
// Technique from Folge 1-5 (scene helper, Klotz rig, captions with fixed word gap, id checks, exit before the cut).
// New in Folge 6: generic landscape handheld (own shape), chat-bubble rain (arrows / A / B), own pixel hero and two
// invented pixel monsters, chat window, pixel map, game menu, balance scale, inventory, spiral fossil cult, tear-off
// calendar, trophy with arrow confetti, award statuette, vote buttons. Retro grid background.
// All graphics stay in the graphics zone (y >= 620 under the captions, y <= 1390 next to Klotz).
import fs from "node:fs";
import path from "node:path";

const OUT = process.argv[2];
fs.mkdirSync(path.join(OUT, "compositions"), { recursive: true });

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
const YEL = "#FFD23F", GOLD = "#F2B705", GOLD_D = "#B07A00", RED = "#FF3B3B", TEAL = "#2EC4B6", TEAL_D = "#1E978C";
const MINT = "#7CF0C2", PINK = "#FF8FC8", SKY = "#9FDcFF".toUpperCase(), GRASS = "#49B85A", GRASS_L = "#57C868";
const PURP = "#8E5CFF", NAVY = "#1A2238";

// ================= timing: one row per caption; scenes follow the captions =================
// c01 ends as early as its reading time (4 words x 0.35 s + exit) and the frame grid allow
// scene cuts sit on whole tenths of a second (on the 30 fps frame grid), captions inside a scene may split freely
const CD = [["c01", 1.6], ["c02", 2.0], ["c03", 2.8], ["c04", 2.8], ["c05", 2.4], ["c06", 2.4], ["c07", 1.6], ["c08", 1.95], ["c09", 1.95], ["c09b", 2.8],
  ["c10", 2.35], ["c11", 1.95], ["c12", 2.8], ["c13", 2.0], ["c14", 2.0], ["c15", 2.8], ["c16", 2.8], ["c17", 0.5]];
const C = {};
{ let t = 0; for (const [id, d] of CD) { C[id] = [f2(t), f2(t + d)]; t += d; } }
export const DUR = C.c17[1];
const T = {
  hook: [C.c01[0], C.c01[1]], figur: C.c02, twitch: C.c03, befehle: C.c04, alles: C.c05, menu: C.c06, chaos: C.c07,
  waage: [C.c08[0], C.c09b[1]], fossil: [C.c10[0], C.c11[1]], kult: C.c12, kalender: C.c13, finale: C.c14, award: C.c15, frage: [C.c16[0], DUR],
};
const S = (k) => [T[k][0], f2(T[k][1] - T[k][0])];
const scenes = [];

// ================= drawings (own designs) =================
const SPARK = (col = YEL) => `<svg viewBox="0 0 100 100" width="100%" height="100%" overflow="visible"><path d="M50 2 Q56 44 98 50 Q56 56 50 98 Q44 56 2 50 Q44 44 50 2 Z" fill="${col}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/></svg>`;
const STAR_D = "M50 4 L62 36 L96 38 L70 60 L79 94 L50 75 L21 94 L30 60 L4 38 L38 36 Z";
const STAR = (fill = YEL, sw = 7) => `<svg viewBox="0 0 100 100" width="100%" height="100%" overflow="visible"><path d="${STAR_D}" fill="${fill}" stroke="${K}" stroke-width="${sw}" stroke-linejoin="round"/></svg>`;
// arrow pointing up in a 100 x 100 box; dir: up, right, down, left
const ARROW_D = "M50 6 L92 50 L66 50 L66 94 L34 94 L34 50 L8 50 Z";
const ROT = { up: 0, right: 90, down: 180, left: 270 };

// pixel art: rows of characters, palette maps a character to a colour, "." is empty
function PIX(rows, pal, px, extra = "") {
  const w = rows[0].length, h = rows.length;
  let r = "";
  rows.forEach((row, y) => {
    let x = 0;
    while (x < w) {
      const c = row[x];
      let e = x; while (e < w && row[e] === c) e++;
      if (c !== ".") r += `<rect x="${x}" y="${y}" width="${e - x}" height="1" fill="${pal[c]}"/>`;
      x = e;
    }
  });
  return `<svg viewBox="0 0 ${w} ${h}" width="${w * px}" height="${h * px}" shape-rendering="crispEdges" overflow="visible" ${extra}>${r}</svg>`;
}
// own pixel hero (beanie, blue shirt) 10 x 14
const HERO = ["...GGGG...", "..GGGGGG..", ".GGGGGGWG.", ".SSSSSSSS.", ".SKSSSSKS.", ".SSSSSSSS.", "..SSMMSS..", "..BBBBBB..", ".BBBBBBBB.", "SBBBBBBBBS", "S.PPPPPP.S", "..PP..PP..", "..PP..PP..", ".DDD..DDD."];
const HERO_P = { G: "#2BD47D", W: "#FFFFFF", S: "#F2C29B", K: "#141414", M: "#B03030", B: "#3D7BFF", P: "#1E2A55", D: "#141414" };
// invented monster 1: "Blubbo", a one-eyed purple blob, 12 x 10
const BLOB = ["....MMMM....", "..MMMMMMMM..", ".MMMWWWWMMM.", ".MMWWKKWWMM.", "MMMWWKKWWMMM", "MMMMWWWWMMMM", "MLMMMMMMMMLM", "MMMMTTTTMMMM", ".MMMMMMMMMM.", "M.MM.MM.MM.M"];
const BLOB_P = { M: PURP, L: "#C9A2FF", W: "#FFFFFF", K: "#141414", T: "#3A1466" };
// invented monster 2: "Flattwürfel", a pink cube with bat wings, 14 x 8
const BAT = ["WW..........WW", "WWW..CCCC..WWW", "WWWWCCCCCCWWWW", ".WWCCKCCKCCWW.", "..WCCCCCCCCW..", "...CCTCCTCC...", "...CCCCCCCC...", "....C....C...."];
const BAT_P = { W: "#4B3B8C", C: PINK, K: "#141414", T: "#FFFFFF" };
const TREE = ["..LLLL..", ".LLDLLL.", "LLLLLDLL", "LDLLLLLL", "LLLLDLLL", ".LLLLLL.", "...TT...", "...TT..."];
const TREE_P = { L: "#3CC266", D: "#2E9E4F", T: "#8A5A2B" };
const EXCL = ["YYY", "YYY", "YYY", "YYY", "YYY", "...", "YYY", "YYY"];

// chat bubble 150 x 134 with a glyph (arrow or letter, letters 80 px)
function BUB(k, col = "#fff") {
  const g = ROT[k] != null
    ? `<g transform="translate(37 20) scale(.76)"><path d="${ARROW_D}" transform="rotate(${ROT[k]} 50 50)" fill="${K}"/></g>`
    : `<text x="75" y="86" text-anchor="middle" font-family="Lilita One" font-size="80" fill="${K}">${k}</text>`;
  return `<svg viewBox="0 0 150 134" width="150" height="134" overflow="visible"><path d="M22 6 H128 Q144 6 144 22 V92 Q144 108 128 108 H66 L40 130 L46 108 H22 Q6 108 6 92 V22 Q6 6 22 6 Z" fill="${col}" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>${g}</svg>`;
}
const BCOL = ["#FFFFFF", YEL, MINT, PINK, "#9FD3FF"];

// spiral fossil (own drawing), viewBox 240 x 240
function FOSSIL(p) {
  let d = "";
  for (let i = 0; i <= 160; i++) { const a = (i / 160) * Math.PI * 5.2; const r = 10 + 17.5 * a / Math.PI * 1.25; const x = 120 + Math.cos(a) * r * 0.95, y = 124 + Math.sin(a) * r * 0.95; d += (i ? " L" : "M") + x.toFixed(1) + " " + y.toFixed(1); }
  let ribs = "";
  for (let i = 0; i < 18; i++) { const a = (i / 18) * Math.PI * 2; ribs += `<path d="M${(120 + Math.cos(a) * 62).toFixed(1)} ${(124 + Math.sin(a) * 62).toFixed(1)} L${(120 + Math.cos(a) * 104).toFixed(1)} ${(124 + Math.sin(a) * 104).toFixed(1)}" stroke="#A8845A" stroke-width="5" stroke-linecap="round"/>`; }
  return `<svg viewBox="0 0 240 240" width="100%" height="100%" overflow="visible">
    <circle cx="120" cy="124" r="108" fill="#E3C796" stroke="${K}" stroke-width="9"/>
    ${ribs}
    <path d="${d}" fill="none" stroke="#8C6A3E" stroke-width="13" stroke-linecap="round"/>
    <path d="${d}" fill="none" stroke="#F3DDB3" stroke-width="5" stroke-linecap="round"/>
    <circle cx="120" cy="124" r="108" fill="none" stroke="${K}" stroke-width="9"/>
    <ellipse cx="82" cy="70" rx="30" ry="14" fill="#fff" opacity=".45" transform="rotate(-30 82 70)"/>
    <g id="${p}-glint"><path d="M178 40 Q182 62 204 66 Q182 70 178 92 Q174 70 152 66 Q174 62 178 40 Z" fill="#fff" stroke="${K}" stroke-width="4"/></g></svg>`;
}

// generic landscape handheld (own shape: wide pill body, centred screen, d-pad left, two round buttons right), 900 x 470
function HANDHELD(p, screen) {
  return `<div id="${p}-hh" class="hh"><svg viewBox="0 0 900 470" width="900" height="470" overflow="visible">
      <rect x="40" y="0" width="190" height="70" rx="30" fill="${TEAL_D}" stroke="${K}" stroke-width="9"/><rect x="670" y="0" width="190" height="70" rx="30" fill="${TEAL_D}" stroke="${K}" stroke-width="9"/>
      <rect x="6" y="30" width="888" height="434" rx="200" fill="${TEAL}" stroke="${K}" stroke-width="11"/>
      <path d="M60 330 Q160 430 300 440 L600 440 Q740 430 840 330 Q800 450 600 456 L300 456 Q100 450 60 330 Z" fill="${TEAL_D}"/>
      <ellipse cx="200" cy="110" rx="90" ry="28" fill="#fff" opacity=".22" transform="rotate(-14 200 110)"/>
      <rect x="218" y="48" width="464" height="344" rx="34" fill="${NAVY}" stroke="${K}" stroke-width="8"/>
      <path d="M100 205 h40 v-40 h40 v40 h40 v40 h-40 v40 h-40 v-40 h-40 Z" fill="${NAVY}" stroke="${K}" stroke-width="6" stroke-linejoin="round" transform="translate(-30 20)"/>
      <circle cx="770" cy="200" r="40" fill="${YEL}" stroke="${K}" stroke-width="8"/><circle cx="700" cy="290" r="40" fill="${RED}" stroke="${K}" stroke-width="8"/>
      <circle cx="758" cy="188" r="10" fill="#fff" opacity=".6"/><circle cx="688" cy="278" r="10" fill="#fff" opacity=".6"/>
      <path d="M770 360 l40 -30 M790 380 l40 -30 M810 400 l40 -30" stroke="${TEAL_D}" stroke-width="10" stroke-linecap="round"/>
    </svg>
    <div id="${p}-scr" class="hh-scr">${screen}</div></div>`;
}
const HH_CSS = `.hh{position:absolute;left:0;top:0;width:900px;height:470px;}
     .hh-scr{position:absolute;left:236px;top:66px;width:428px;height:308px;border-radius:20px;overflow:hidden;background:linear-gradient(180deg,#8FD3FF 0%,#C8ECFF 62%,${GRASS} 62%,${GRASS} 100%);}
     .hh-scr .tuft{position:absolute;}`;
// standard screen: grass, two tufts, hero standing in the middle
const SCREEN = (p, px = 9, extra = "") => `<div id="${p}-sg" style="position:absolute;left:0;top:200px;width:428px;height:12px;background:${GRASS_L};"></div>
      <div class="tuft" style="left:40px;top:236px;">${PIX(["G.G.G", "GGGGG"], { G: "#2E9E4F" }, 8)}</div><div class="tuft" style="left:340px;top:250px;">${PIX(["G.G.G", "GGGGG"], { G: "#2E9E4F" }, 8)}</div>
      ${extra}
      <div id="${p}-hw" style="position:absolute;left:${214 - 5 * px}px;top:${226 - 14 * px}px;width:${10 * px}px;height:${14 * px}px;"><div id="${p}-hero" style="position:absolute;inset:0;transform-origin:50% 100%;">${PIX(HERO, HERO_P, px)}</div></div>`;

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
    .bw { position: absolute; width: 150px; height: 134px; }
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
${kb ? `      tl.fromTo("#${id}-kb", { scale: 1 }, { scale: 1.035, duration: ${dur}, ease: "none" }, 0);` : ""}
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
function burst(p, n, cx, cy, size, rad, seed) {
  const RS = mulberry32(seed);
  const items = Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2 + RS() * 0.5; const rr = rad * (0.7 + RS() * 0.5); return { x: Math.round(Math.cos(a) * rr), y: Math.round(Math.sin(a) * rr), s: Math.round(size * (0.7 + RS() * 0.6)) }; });
  const html = items.map((it, i) => `<div id="${p}-${i}" class="spk" style="left:${cx - it.s / 2}px;top:${cy - it.s / 2}px;width:${it.s}px;height:${it.s}px;">${SPARK(i % 3 ? YEL : "#fff")}</div>`).join("");
  const js = (at) => items.map((it, i) => `      tl.fromTo("#${p}-${i}", { x: 0, y: 0, scale: 0, rotation: 0, opacity: 1 }, { keyframes: { x: [0, ${it.x}], y: [0, ${it.y}], scale: [0, 1.1, 0], rotation: [0, 120] }, duration: 0.6, ease: "power1.out", immediateRender: true }, ${at});`).join("\n");
  return { html, js };
}
// a motion along a sampled path: f(ph) -> {x, y, s, o, r}; linear between 9 samples
// clamp: a chat bubble (150 px wide, rotated up to ~15 deg -> half width <= 90 px) whose centre rests at cx stays inside x 80-1000
const BHW = 90;
const clampX = (x, cx) => (cx == null ? x : Math.min(1000 - BHW - cx, Math.max(80 + BHW - cx, x)));
function pathTween(sel, f, ph0, ph1, dur, at, repeat = 0, n = 8, cx = null) {
  const ks = { x: [], y: [], scale: [], opacity: [], rotation: [] };
  for (let i = 0; i <= n; i++) { const v = f(ph0 + (ph1 - ph0) * i / n); ks.x.push(f2(clampX(v.x, cx))); ks.y.push(f2(v.y)); ks.scale.push(f2(v.s)); ks.opacity.push(f2(v.o)); ks.rotation.push(f2(v.r || 0)); }
  return `      tl.to("${sel}", { keyframes: { ...${JSON.stringify(ks)}, easeEach: "none" }, duration: ${f2(dur)}, ease: "none"${repeat ? `, repeat: ${repeat}` : ""} }, ${f2(at)});\n`;
}
// endless flight: starts at phase ph at time t0, covers `total` seconds
function loopFly(sel, f, ph, D, t0, total, cx = null) {
  const v = f(ph);
  let s = `      gsap.set("${sel}", { x: ${f2(clampX(v.x, cx))}, y: ${f2(v.y)}, scale: ${f2(v.s)}, opacity: ${f2(v.o)}, rotation: ${f2(v.r || 0)} });\n`;
  const first = D * (1 - ph);
  s += pathTween(sel, f, ph, 1, first, t0, 0, 8, cx);
  const rest = total - first;
  if (rest > 0) s += pathTween(sel, f, 0, 1, D, t0 + first, Math.ceil(rest / D) - 1, 8, cx);
  return s;
}
// straight rain flight from start (sx,sy) to end (ex,ey); the element sits at the end point
const rainF = (sx, sy, ex, ey) => (ph) => ({ x: (sx - ex) * (1 - ph), y: (sy - ey) * (1 - ph), s: 1 - 0.6 * ph, o: ph < 0.72 ? 1 : Math.max(0, (1 - ph) / 0.28), r: 8 * Math.sin(ph * Math.PI * 2) });
// bounce: in from (sx,sy) to the hit point (0,0), out to (rx,ry) spinning, fading
const bounceF = (sx, sy, rx, ry) => (ph) => ph < 0.5
  ? { x: sx * (1 - ph / 0.5), y: sy * (1 - ph / 0.5), s: 1, o: 1, r: 0 }
  : { x: rx * ((ph - 0.5) / 0.5), y: ry * ((ph - 0.5) / 0.5) - 120 * Math.sin((ph - 0.5) / 0.5 * Math.PI), s: 1 - 0.4 * (ph - 0.5) / 0.5, o: ph < 0.8 ? 1 : (1 - ph) / 0.2, r: 300 * (ph - 0.5) };

// ================= HOOK picture (frame 0 = thumbnail motif): handheld, chat bubbles rain from all sides onto one pixel hero =================
const HH0 = { l: 90, t: 870 };
const RAIN = [ // [glyph, colour, start x, start y, end x, end y] in frame coordinates (bubble centre)
  // all bubbles stay inside x 80-1000 (the rain zone clips at the side margins)
  ["up", 0, 170, 690, 420, 990], ["A", 1, 880, 690, 680, 985], ["left", 2, 920, 1090, 740, 1100], ["right", 3, 160, 1100, 340, 1110],
  ["B", 4, 280, 1330, 430, 1210], ["down", 1, 540, 680, 560, 950], ["A", 0, 860, 1310, 690, 1200], ["up", 3, 160, 860, 360, 1020],
  ["right", 2, 920, 880, 730, 1020], ["left", 4, 720, 680, 620, 960],
];
const RAIN_D = 1.3;
const hookCss = (p) => `${HH_CSS}
   #${p}-glow{${abs(110, 780, 860, 600)}border-radius:50%;background:radial-gradient(circle,rgba(46,196,182,.42) 0%,rgba(46,196,182,.12) 45%,rgba(46,196,182,0) 70%);}
   #${p}-hhw{${abs(HH0.l, HH0.t, 900, 470)}transform-origin:50% 60%;}
   #${p}-rain{${abs(80, 620, 920, 770)}overflow:hidden;}
   #${p}-rin{position:absolute;left:-80px;top:-620px;width:1080px;height:1920px;}`;
const hookBody = (p) => `      <div id="${p}-glow"></div>
      <div id="${p}-hhw" class="${p}-stk">${HANDHELD(p, SCREEN(p))}</div>
      <div id="${p}-rain"><div id="${p}-rin">
${RAIN.map(([k, c, , , ex, ey], i) => `        <div id="${p}-r${i}" class="bw" style="left:${ex - 75}px;top:${ey - 67}px;">${BUB(k, BCOL[c])}</div>`).join("\n")}
      </div></div>`;
// the rain: phase i/n at local time t0; `shift` moves all phases (the loop scene ends in the frame-0 phase)
const rainJs = (p, t0, total, shift = 0) => RAIN.map(([, , sx, sy, ex, ey], i) => loopFly(`#${p}-r${i}`, rainF(sx, sy, ex, ey), (((i / RAIN.length + shift) % 1) + 1) % 1, RAIN_D, t0, total, ex)).join("");
// the hero on the screen fidgets (x, flips), ends where it starts
const fidget = (p, t0, d) => {
  const n = Math.max(1, Math.round(d / 0.4));
  return `      tl.to("#${p}-hero", { keyframes: { x: [0, -10, 0, 10, 0], scaleX: [1, 1, -1, -1, 1], y: [0, -14, 0, -14, 0] }, duration: ${f2(d / n)}, ease: "none", repeat: ${n - 1} }, ${t0});
      tl.to("#${p}-glow", { keyframes: { scale: [1, 1.06, 1], opacity: [1, 0.8, 1] }, duration: ${f2(d)}, ease: "sine.inOut" }, ${t0});`;
};
{
  const p = "hook";
  const [s, d] = S(p);
  scenes.push(scene(p, "Hook: Chat-Regen auf eine Figur", s, d, hookCss(p), hookBody(p),
    `      // frame 0 already shows the full motif (thumbnail picture): the bubbles are mid-flight
${rainJs(p, 0, d)}${fidget(p, 0, d)}
      tl.to("#hook-hhw", { keyframes: { rotation: [0, -1.5, 1.5, 0] }, duration: ${d}, ease: "sine.inOut" }, 0);`, { kb: false }));
}

// ================= FIGUR: one big pixel hero, bubbles bounce off him (c02) =================
{
  const p = "figur";
  const [s, d] = S(p);
  const HX = 410, HY = 900, PX = 26; // hero 260 x 364
  const hits = [ // hit point (bubble centre), approach from (dx,dy), rebound to (rx,ry)
    [400, 1000, -330, -240, -260, -60, "A", 1], [700, 980, 300, -250, 250, -40, "up", 0], [420, 1180, -340, 80, -300, -200, "left", 2],
    [690, 1170, 330, 60, 300, -220, "B", 3], [560, 890, -60, -230, 160, -120, "down", 4], [380, 1090, -320, -60, -280, -260, "right", 0],
  ];
  const b1 = burst("figur-b", 7, 540, 1080, 50, 230, 14);
  scenes.push(scene(p, "Eine Spielfigur", s, d,
    `#figur-hw{${abs(HX, HY, 10 * PX, 14 * PX)}}
     #figur-hero{position:absolute;inset:0;transform-origin:50% 100%;}
     #figur-plat{${abs(270, HY + 14 * PX - 6, 540, 104)}}
     #figur-ex{${abs(HX + 5 * PX - 21 + 150, HY - 150, 42, 112)}transform-origin:50% 100%;}
     #figur-zone{${abs(80, 640, 920, 750)}overflow:hidden;}
     #figur-zin{position:absolute;left:-80px;top:-640px;width:1080px;height:1920px;}`,
    `      <div id="figur-plat" class="figur-stk">${PIX(["GLGLGLGLGLGLGLGLGLGLGLGLGLGL", "GGGGGGGGGGGGGGGGGGGGGGGGGGGG", "DDDDDDDDDDDDDDDDDDDDDDDDDDDD", "DdDDdDDDdDDdDDDdDDdDDDdDDdDD", "DDDDDDDDDDDDDDDDDDDDDDDDDDDD"], { G: GRASS, L: GRASS_L, D: "#9A6B3C", d: "#7A5028" }, 19.3)}</div>
      <div id="figur-hw" class="figur-stk"><div id="figur-hero">${PIX(HERO, HERO_P, PX)}</div></div>
      <div id="figur-ex" class="figur-stk">${PIX(EXCL, { Y: YEL }, 14)}</div>
      <div id="figur-zone"><div id="figur-zin">
${hits.map(([hx, hy, , , , , k, c], i) => `        <div id="figur-r${i}" class="bw" style="left:${hx - 75}px;top:${hy - 67}px;">${BUB(k, BCOL[c])}</div>`).join("\n")}
        ${b1.html}
      </div></div>`,
    `      // the hero is there from the cut frame; he fidgets, bubbles hit him and bounce off
      tl.fromTo("#figur-hw", { scale: 0.85 }, { scale: 1, duration: 0.3, ease: "back.out(2)" }, 0);
      tl.to("#figur-hero", { keyframes: { rotation: [0, -7, 7, -7, 7, 0], x: [0, -12, 12, -12, 12, 0], scaleY: [1, 0.94, 1.04, 0.94, 1.04, 1] }, duration: 0.8, ease: "none", repeat: ${Math.ceil(d / 0.8) - 1} }, 0.05);
      tl.fromTo("#figur-ex", { scale: 0, rotation: -20 }, { scale: 1, rotation: 0, duration: 0.25, ease: "back.out(3)" }, 0.25);
      tl.to("#figur-ex", { keyframes: { y: [0, -16, 0] }, duration: 0.4, ease: "sine.inOut", repeat: ${Math.floor((d - 0.6) / 0.4) - 1} }, 0.55);
${hits.map(([hx, , sx, sy, rx, ry], i) => loopFly(`#figur-r${i}`, bounceF(sx, sy, rx, ry), (i / hits.length * 0.9 + 0.35) % 1, 1.0, 0, d, hx)).join("")}
${b1.js(0.9)}`));
}

// ================= TWITCH: chat window (rows of commands scroll) + small handheld + LIVE tag (c03) =================
{
  const p = "twitch";
  const [s, d] = S(p);
  const RS = mulberry32(2014);
  const glyphs = ["up", "A", "left", "B", "down", "right", "A", "up", "A", "left", "right", "B"];
  const ava = [RED, YEL, MINT, PINK, "#9FD3FF", PURP];
  const rows = glyphs.map((g, i) => {
    const two = i % 3 === 1;
    const glyph = (k, x) => ROT[k] != null ? `<g transform="translate(${x} 14) scale(.8)"><path d="${ARROW_D}" transform="rotate(${ROT[k]} 50 50)" fill="${K}"/></g>` : `<text x="${x + 40}" y="84" text-anchor="middle" font-family="Lilita One" font-size="80" fill="${K}">${k}</text>`;
    const w = two ? 230 : 140;
    return `<div id="twitch-row${i}" class="twitch-row" style="top:${i * 118}px;"><svg viewBox="0 0 420 108" width="420" height="108" overflow="visible">
        <circle cx="48" cy="54" r="34" fill="${ava[Math.floor(RS() * ava.length)]}" stroke="${K}" stroke-width="6"/><circle cx="38" cy="46" r="5" fill="${K}"/><circle cx="58" cy="46" r="5" fill="${K}"/><path d="M36 64 Q48 72 60 64" stroke="${K}" stroke-width="5" fill="none" stroke-linecap="round"/>
        <rect x="100" y="6" width="${w}" height="96" rx="24" fill="#fff" stroke="${K}" stroke-width="6"/>${glyph(g, 118)}${two ? glyph(glyphs[(i + 5) % glyphs.length], 206) : ""}</svg></div>`;
  }).join("\n");
  scenes.push(scene(p, "Chat und Handheld", s, d, HH_CSS + `
     #twitch-win{${abs(70, 730, 470, 650)}border-radius:30px;background:#1B2444;border:10px solid ${K};overflow:hidden;}
     #twitch-head{${abs(0, 0, 450, 104)}background:${TEAL};border-bottom:8px solid ${K};}
     #twitch-ht{position:absolute;left:26px;top:14px;${LBL(76)}}
     #twitch-dots{position:absolute;right:24px;top:36px;width:110px;height:30px;}
     #twitch-body{${abs(10, 116, 430, 520)}overflow:hidden;}
     #twitch-list{position:absolute;left:0;top:0;width:430px;height:${glyphs.length * 118}px;}
     .twitch-row{position:absolute;left:0;width:420px;height:108px;}
     #twitch-hhs{${abs(570, 860, 450, 235)}}
     #twitch-hhw{position:absolute;left:0;top:0;width:900px;height:470px;transform:scale(.5);transform-origin:0 0;}
     #twitch-live{${abs(650, 1170, 290, 120)}border-radius:30px;background:${RED};border:9px solid ${K};}
     #twitch-lt{position:absolute;left:96px;top:13px;${LBL(76)}-webkit-text-stroke:10px ${K};}
     #twitch-ld{position:absolute;left:30px;top:34px;width:42px;height:42px;border-radius:50%;background:#fff;border:6px solid ${K};}`,
    `      <div id="twitch-win" class="twitch-stk"><div id="twitch-head"><div id="twitch-ht">CHAT</div>
        <svg id="twitch-dots" viewBox="0 0 110 30"><circle cx="15" cy="15" r="12" fill="${YEL}" stroke="${K}" stroke-width="4"/><circle cx="55" cy="15" r="12" fill="${MINT}" stroke="${K}" stroke-width="4"/><circle cx="95" cy="15" r="12" fill="${PINK}" stroke="${K}" stroke-width="4"/></svg></div>
        <div id="twitch-body"><div id="twitch-list">
${rows}
        </div></div></div>
      <div id="twitch-hhs" class="twitch-stk"><div id="twitch-hhw">${HANDHELD(p, SCREEN(p))}</div></div>
      <div id="twitch-live" class="twitch-stk"><div id="twitch-ld"></div><div id="twitch-lt">LIVE</div></div>`,
    `      tl.fromTo("#twitch-win", { scale: 0.86, rotation: -3 }, { scale: 1, rotation: 0, duration: 0.32, ease: "back.out(1.8)" }, 0);
      tl.fromTo("#twitch-hhs", { scale: 0.8, y: 30 }, { scale: 1, y: 0, duration: 0.32, ease: "back.out(1.8)" }, 0.06);
      tl.fromTo("#twitch-live", { scale: 0.8 }, { scale: 1, duration: 0.28, ease: "back.out(2.4)" }, 0.2);
      // the chat never stops: rows scroll up, new rows pop in at the bottom
      tl.fromTo("#twitch-list", { y: 0 }, { y: ${-118 * 6}, duration: ${d}, ease: "none" }, 0);
${glyphs.map((_, i) => i >= 4 ? `      tl.fromTo("#twitch-row${i}", { scale: 0.6, x: -30 }, { scale: 1, x: 0, duration: 0.25, ease: "back.out(2)" }, ${f2(Math.max(0, (i * 118 - 520 + 108) / (118 * 6) * d))});` : "").join("\n")}
      tl.to("#twitch-ld", { keyframes: { scale: [1, 0.7, 1] }, duration: 0.7, ease: "sine.inOut", repeat: ${Math.ceil(d / 0.7) - 1} }, 0);
      tl.to("#twitch-hero", { keyframes: { x: [0, -24, -24, 24, 24, 0], scaleX: [1, -1, -1, 1, 1, 1] }, duration: 1.4, ease: "none", repeat: 1 }, 0.2);`));
}

// ================= BEFEHLE: three big bubbles (up, A, left) fly into the handheld, the hero obeys (c04) =================
{
  const p = "befehle";
  const [s, d] = S(p);
  const HS = 0.72, HL = 216, HT = 1040; // handheld 648 x 338
  const SC = [HL + 450 * HS, HT + 220 * HS]; // screen centre (540, 1198)
  const B3 = [["up", 1, 200, 800], ["A", 2, 540, 780], ["left", 3, 880, 800]];
  const stream = [["right", 0, 90, 700], ["B", 4, 990, 700], ["down", 1, 120, 880], ["A", 3, 960, 880]];
  scenes.push(scene(p, "Befehle fliegen", s, d, HH_CSS + `
     #befehle-hhs{${abs(HL, HT, 900 * HS, 470 * HS)}}
     #befehle-hhw{position:absolute;left:0;top:0;width:900px;height:470px;transform:scale(${HS});transform-origin:0 0;}
     .befehle-big{position:absolute;width:150px;height:134px;}
     #befehle-zone{${abs(80, 600, 920, 790)}overflow:hidden;}
     #befehle-zin{position:absolute;left:-80px;top:-600px;width:1080px;height:1920px;}`,
    `      <div id="befehle-hhs" class="befehle-stk"><div id="befehle-hhw">${HANDHELD(p, SCREEN(p))}</div></div>
      <div id="befehle-zone"><div id="befehle-zin">
${B3.map(([k, c, x, y], i) => `        <div id="befehle-b${i}" class="befehle-big" style="left:${x - 75}px;top:${y - 67}px;">${BUB(k, BCOL[c])}</div>`).join("\n")}
${stream.map(([k, c], i) => `        <div id="befehle-s${i}" class="bw" style="left:${SC[0] - 75}px;top:${SC[1] - 67}px;">${BUB(k, BCOL[c])}</div>`).join("\n")}
      </div></div>`,
    `      tl.fromTo("#befehle-hhs", { scale: 0.85 }, { scale: 1, duration: 0.3, ease: "back.out(1.8)" }, 0);
${stream.map((_, i) => `      gsap.set("#befehle-s${i}", { opacity: 0 });`).join("\n")}
${B3.map(([, , x, y], i) => {
      const t0 = f2(0.05 + i * 0.45), tf = f2(0.6 + i * 0.5);
      return `      tl.fromTo("#befehle-b${i}", { scale: ${i ? 0 : 0.8}, rotation: -12 }, { scale: 1.25, rotation: 0, duration: 0.28, ease: "back.out(2.4)" }, ${t0});
      tl.to("#befehle-b${i}", { x: ${SC[0] - x}, y: ${SC[1] - y}, scale: 0.3, rotation: 20, duration: 0.42, ease: "power2.in" }, ${tf});
      tl.to("#befehle-b${i}", { opacity: 0, duration: 0.06 }, ${f2(tf + 0.38)});`;
    }).join("\n")}
      // the hero obeys: up, jump (A), turn left
      tl.to("#befehle-hero", { y: -50, duration: 0.25, ease: "power2.out" }, 1.03);
      tl.to("#befehle-hero", { keyframes: { y: [-50, -110, -50] }, duration: 0.4, ease: "power1.inOut" }, 1.53);
      tl.to("#befehle-hero", { scaleX: -1, x: -60, y: 0, duration: 0.3, ease: "power2.out" }, 2.03);
${stream.map(([, , sx, sy], i) => loopFly(`#befehle-s${i}`, rainF(sx, sy, SC[0], SC[1]), (i * 0.25) % 1, 0.9, 2.1, d - 2.1, SC[0]).replace(/gsap\.set\("#befehle-s\d+", \{[^}]*\}\);\n/, "")).join("")}
${stream.map((_, i) => `      tl.set("#befehle-s${i}", { opacity: 1 }, 2.1);`).join("\n")}`));
}

// ================= ALLES: pixel map, the hero runs back and forth and in a circle, a monster peeks out of the grass (c05) =================
const MAP = { l: 90, t: 720, w: 900, h: 660 };
function MAPSVG(p, withGrassFront = true) {
  let tiles = "";
  for (let y = 0; y < 11; y++) for (let x = 0; x < 15; x++) if ((x + y) % 2) tiles += `<rect x="${x * 60}" y="${y * 60}" width="60" height="60" fill="${GRASS_L}"/>`;
  const tall = (x0, y0) => { let o = ""; for (let i = 0; i < 4; i++) o += `<path d="M${x0 + i * 45} ${y0 + 90} l12 -60 l12 60 l12 -48 l9 48 Z" fill="#2E9E4F" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>`; return o; };
  return {
    back: `<svg viewBox="0 0 900 660" width="900" height="660" shape-rendering="crispEdges"><rect width="900" height="660" fill="${GRASS}"/>${tiles}
      <rect x="0" y="300" width="900" height="120" fill="#E2C27A"/><rect x="0" y="300" width="900" height="10" fill="#C9A35C"/><rect x="0" y="410" width="900" height="10" fill="#C9A35C"/>
      <rect x="40" y="470" width="200" height="140" rx="0" fill="#5BB8F0"/><rect x="60" y="490" width="60" height="12" fill="#BFE6FF"/><rect x="140" y="560" width="50" height="12" fill="#BFE6FF"/></svg>
      <div style="position:absolute;left:40px;top:40px;">${PIX(TREE, TREE_P, 18)}</div><div style="position:absolute;left:720px;top:40px;">${PIX(TREE, TREE_P, 18)}</div><div style="position:absolute;left:740px;top:470px;">${PIX(TREE, TREE_P, 18)}</div>`,
    front: withGrassFront ? `<svg id="${p}-tall" viewBox="0 0 200 100" width="200" height="100" overflow="visible" style="position:absolute;left:420px;top:540px;">${tall(4, 6)}</svg>` : "",
  };
}
{
  const p = "alles";
  const [s, d] = S(p);
  const m = MAPSVG(p);
  const PX = 8, hw = 10 * PX, hh = 14 * PX;
  const H0 = [300, 360]; // hero foot point on the map (map coordinates)
  scenes.push(scene(p, "Held rennt ueberall hin", s, d,
    `#alles-map{${abs(MAP.l, MAP.t, MAP.w, MAP.h)}border-radius:34px;border:14px solid ${NAVY};outline:6px solid ${K};overflow:hidden;background:${GRASS};}
     #alles-hw{${abs(H0[0] - hw / 2, H0[1] - hh, hw, hh)}}
     #alles-hero{position:absolute;inset:0;transform-origin:50% 100%;}
     #alles-mon{${abs(452, 476, 96, 80)}}`,
    `      <div id="alles-mw" class="alles-stk" style="position:absolute;left:0;top:0;width:1080px;height:1920px;"><div id="alles-map">
        ${m.back}
        <div id="alles-mon">${PIX(BLOB, BLOB_P, 8)}</div>
        ${m.front}
        <div id="alles-hw"><div id="alles-hero">${PIX(HERO, HERO_P, PX)}</div></div>
      </div></div>`,
    `      tl.fromTo("#alles-map", { scale: 0.9 }, { scale: 1, duration: 0.3, ease: "back.out(1.6)" }, 0);
      gsap.set("#alles-mon", { y: 90 });
      // right, left, right, then round in a circle (map coordinates relative to the start point)
      tl.to("#alles-hw", { x: 480, duration: 0.5, ease: "none" }, 0.08);
      tl.set("#alles-hero", { scaleX: -1 }, 0.6);
      tl.to("#alles-hw", { x: 0, duration: 0.5, ease: "none" }, 0.62);
      tl.set("#alles-hero", { scaleX: 1 }, 1.14);
      tl.to("#alles-hw", { x: 240, duration: 0.26, ease: "none" }, 1.16);
      tl.to("#alles-hw", { keyframes: { x: [240, 330, 360, 330, 240, 150, 120, 150, 240], y: [0, -40, -130, -220, -260, -220, -130, -40, 0], easeEach: "none" }, duration: 0.8, ease: "none" }, 1.45);
      tl.to("#alles-hero", { keyframes: { scaleX: [1, 1, -1, -1, 1] }, duration: 0.8, ease: "none" }, 1.45);
      tl.to("#alles-hero", { keyframes: { y: [0, -10, 0] }, duration: 0.18, ease: "none", repeat: ${Math.floor(2.2 / 0.18) - 1} }, 0.08);
      // the monster peeks out of the tall grass, then ducks
      tl.to("#alles-mon", { y: 0, duration: 0.3, ease: "back.out(2)" }, 0.75);
      tl.to("#alles-mon", { keyframes: { rotation: [0, -8, 8, 0] }, duration: 0.5, ease: "sine.inOut" }, 1.1);
      tl.to("#alles-mon", { y: 90, duration: 0.25, ease: "back.in(2)" }, 1.95);`));
}

// ================= MENU: rauf, runter, rauf, the menu opens and closes in the beat (c06) =================
{
  const p = "menu";
  const [s, d] = S(p);
  const m = MAPSVG(p, false);
  const ROWS = ["MONSTER", "TASCHE", "KARTE", "ZURÜCK"], RY = [74, 204, 334, 464];
  const cur = (row, at) => `      tl.to("#menu-cur", { y: ${RY[row] - RY[1]}, duration: 0.12, ease: "power2.out" }, ${at});`;
  scenes.push(scene(p, "Menue auf und zu", s, d,
    `#menu-map{${abs(MAP.l, MAP.t, MAP.w, MAP.h)}border-radius:34px;border:14px solid ${NAVY};outline:6px solid ${K};overflow:hidden;background:${GRASS};}
     #menu-hw{${abs(150, 240, 120, 168)}}
     #menu-hero{position:absolute;inset:0;transform-origin:50% 100%;}
     #menu-pan{${abs(416, 16, 446, 600)}transform-origin:100% 0%;}
     #menu-box{position:absolute;inset:0;border-radius:26px;background:#fff;border:10px solid ${K};box-shadow:inset 0 0 0 8px #CFE3FF;}
     .menu-it{position:absolute;left:96px;${LBL(72, NAVY)}-webkit-text-stroke:0;text-shadow:none;}
     #menu-cur{${abs(32, RY[1] + 8, 52, 60)}}`,
    `      <div id="menu-mw" class="menu-stk" style="position:absolute;left:0;top:0;width:1080px;height:1920px;"><div id="menu-map">
        ${m.back}
        <div id="menu-hw"><div id="menu-hero">${PIX(HERO, HERO_P, 12)}</div></div>
        <div id="menu-pan"><div id="menu-box"></div>
${ROWS.map((r, i) => `          <div id="menu-i${i}" class="menu-it" style="top:${RY[i]}px;">${r}</div>`).join("\n")}
          <svg id="menu-cur" viewBox="0 0 52 60"><path d="M4 4 L48 30 L4 56 Z" fill="${RED}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/></svg>
        </div>
      </div></div>`,
    `      tl.fromTo("#menu-map", { scale: 0.92 }, { scale: 1, duration: 0.3, ease: "back.out(1.6)" }, 0);
      tl.fromTo("#menu-pan", { scaleY: 0.7 }, { scaleY: 1, duration: 0.25, ease: "back.out(2)" }, 0);
      // rauf, runter, rauf
${cur(0, 0.3)}
${cur(1, 0.65)}
${cur(0, 1.0)}
      // the menu flaps shut and open again in the beat (a fold, not a flash)
      tl.to("#menu-pan", { keyframes: { scaleY: [1, 0.08, 1] }, duration: 0.42, ease: "sine.inOut", repeat: 1, repeatDelay: 0.1 }, 1.3);
${cur(2, 1.55)}
${cur(3, 2.05)}
      tl.to("#menu-hero", { keyframes: { scaleX: [1, -1, 1, -1, 1], y: [0, -16, 0, -16, 0] }, duration: 1.2, ease: "none", repeat: 1 }, 0.1);`));
}

// ================= CHAOS: the handheld wobbles gently, bubbles circle it; three bubbles shove Klotz (c07) =================
const CHAOS_HITS = [0.6, 0.85, 1.1]; // local arrival times of the shove bubbles
{
  const p = "chaos";
  const [s, d] = S(p);
  const orb = [["up", 0], ["A", 1], ["left", 2], ["B", 3], ["right", 4], ["down", 1]];
  const OC = [540, 995], RX = 370, RY = 290; // orbit stays inside x 80-1000 with the bubble width
  const orbF = (k) => (ph) => { const a = (ph + k / orb.length) * Math.PI * 2; return { x: Math.cos(a) * RX, y: Math.sin(a) * RY, s: 1, o: 1, r: 12 * Math.sin(a * 2) }; };
  const shove = [["A", 1, 190, 700], ["up", 2, 180, 900], ["A", 3, 360, 690]];
  const HIT = [580, 1320];
  scenes.push(scene(p, "Totales Chaos", s, d, HH_CSS + `
     #chaos-hhw{${abs(90, 760, 900, 470)}transform-origin:50% 50%;}
     #chaos-zone{${abs(80, 540, 920, 860)}overflow:hidden;}
     #chaos-zin{position:absolute;left:-80px;top:-540px;width:1080px;height:1920px;}
     #chaos-mm{position:absolute;left:250px;top:24px;width:160px;height:150px;border-radius:14px;background:#fff;border:6px solid ${K};transform-origin:100% 0%;}
     #chaos-mm i{position:absolute;left:18px;width:110px;height:16px;border-radius:8px;background:${NAVY};}`,
    `      <div id="chaos-hhw" class="chaos-stk">${HANDHELD(p, SCREEN(p, 9, `<div id="chaos-mm"><i style="top:22px"></i><i style="top:58px"></i><i style="top:94px"></i></div>`))}</div>
      <div id="chaos-zone"><div id="chaos-zin">
${orb.map(([k, c], i) => `        <div id="chaos-o${i}" class="bw" style="left:${OC[0] - 75}px;top:${OC[1] - 67}px;">${BUB(k, BCOL[c])}</div>`).join("\n")}
${shove.map(([k, c], i) => `        <div id="chaos-s${i}" class="bw" style="left:${HIT[0] - 75}px;top:${HIT[1] - 67}px;">${BUB(k, BCOL[c])}</div>`).join("\n")}
      </div></div>`,
    `      // gentle wobble only (no flashing): slow sine sway of the handheld
      tl.to("#chaos-hhw", { keyframes: { rotation: [0, 2.5, 0, -2.5, 0], y: [0, -8, 0, -8, 0] }, duration: 1.0, ease: "none", repeat: ${Math.ceil(d) - 1} }, 0);
      tl.to("#chaos-hero", { rotation: 720, duration: ${d}, ease: "none" }, 0);
      tl.to("#chaos-mm", { keyframes: { scaleY: [1, 0.15, 1] }, duration: 0.9, ease: "sine.inOut", repeat: 1 }, 0.2);
${orb.map((_, i) => loopFly(`#chaos-o${i}`, orbF(i), 0, 2.2, 0, d, OC[0])).join("")}
${shove.map(([, , sx, sy], i) => {
      const at = CHAOS_HITS[i], st = f2(at - 0.4);
      return `      gsap.set("#chaos-s${i}", { opacity: 0 });
      tl.set("#chaos-s${i}", { opacity: 1 }, ${st});
      tl.fromTo("#chaos-s${i}", { x: ${sx - HIT[0]}, y: ${sy - HIT[1]}, rotation: -20 }, { x: 0, y: 0, rotation: 0, duration: 0.4, ease: "power2.in", immediateRender: false }, ${st});
      tl.to("#chaos-s${i}", { x: ${-160 - i * 40}, y: -260, rotation: -200, scale: 0.6, opacity: 0, duration: 0.4, ease: "power2.out" }, ${at});`;
    }).join("\n")}`));
}

// ================= WAAGE: balance scale ANARCHIE / DEMOKRATIE, the pointer swings (c08 + c09) =================
{
  const p = "waage";
  const [s, d] = S(p);
  const L9 = f2(C.c09[0] - s), L9B = f2(C.c09b[0] - s);
  const PV = [540, 960], HALF = 310;
  const tilt = (degs, dur, at) => {
    const ry = degs.map((g) => f2(Math.sin((g * Math.PI) / 180) * HALF));
    return `      tl.to("#waage-beam", { keyframes: { rotation: ${JSON.stringify(degs)}, easeEach: "sine.inOut" }, duration: ${dur}, ease: "none" }, ${at});
      tl.to("#waage-pl", { keyframes: { y: ${JSON.stringify(ry.map((v) => -v))}, easeEach: "sine.inOut" }, duration: ${dur}, ease: "none" }, ${at});
      tl.to("#waage-pr", { keyframes: { y: ${JSON.stringify(ry)}, easeEach: "sine.inOut" }, duration: ${dur}, ease: "none" }, ${at});`;
  };
  const pan = (id, cx, content) => `<div id="${id}" class="waage-pan" style="left:${cx - 150}px;top:${PV[1]}px;"><svg viewBox="0 0 300 250" width="300" height="250" overflow="visible">
      <path d="M150 0 L22 180 M150 0 L278 180" stroke="#C9D3DE" stroke-width="6"/><circle cx="150" cy="0" r="12" fill="${GOLD}" stroke="${K}" stroke-width="5"/>
      ${content}
      <path d="M8 176 H292 Q282 236 150 238 Q18 236 8 176 Z" fill="${GOLD}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/><path d="M40 196 Q150 214 260 196" stroke="#FFE38A" stroke-width="7" fill="none" stroke-linecap="round"/></svg></div>`;
  const pile = [["up", 40, 104, -18], ["A", 118, 92, 12], ["left", 196, 104, -6], ["B", 80, 40, 20], ["right", 160, 36, -24]].map(([k, x, y, r]) => ROT[k] != null
    ? `<g transform="translate(${x} ${y}) rotate(${r} 32 32)"><rect width="64" height="64" rx="14" fill="#fff" stroke="${K}" stroke-width="5"/><g transform="translate(8 8) scale(.48)"><path d="${ARROW_D}" transform="rotate(${ROT[k]} 50 50)" fill="${K}"/></g></g>`
    : `<g transform="translate(${x} ${y}) rotate(${r} 32 32)"><rect width="64" height="64" rx="14" fill="${YEL}" stroke="${K}" stroke-width="5"/><path d="M18 52 L32 12 L46 52 M23 38 H41" stroke="${K}" stroke-width="7" fill="none" stroke-linejoin="round" stroke-linecap="round"/></g>`).join("");
  const ballot = `<rect x="80" y="70" width="140" height="110" rx="10" fill="#9FD3FF" stroke="${K}" stroke-width="7"/><rect x="110" y="62" width="80" height="16" rx="6" fill="${NAVY}"/>
      <g transform="translate(118 10) rotate(8)"><rect width="66" height="74" rx="6" fill="#fff" stroke="${K}" stroke-width="5"/><path d="M14 38 L28 54 L54 20" stroke="#21A35B" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>
      <path d="M100 130 H200" stroke="${NAVY}" stroke-width="6" stroke-linecap="round"/>`;
  scenes.push(scene(p, "Waage Anarchie Demokratie", s, d,
    `.waage-pan{position:absolute;width:300px;height:250px;}
     #waage-post{${abs(PV[0] - 18, PV[1], 36, 370)}background:linear-gradient(90deg,${GOLD_D},${GOLD},${GOLD_D});border:7px solid ${K};border-radius:10px;}
     #waage-base{${abs(508, 1322, 64, 70)}}
     #waage-beam{${abs(PV[0] - HALF - 20, PV[1] - 140, (HALF + 20) * 2, 160)}transform-origin:50% 87.5%;}
     #waage-dial{${abs(PV[0] - 110, PV[1] - 130, 220, 120)}}
     .waage-lb{position:absolute;top:1292px;${LBL(72)}}
     #waage-l1{left:100px;color:${YEL};transform-origin:0% 50%;} #waage-l2{left:572px;transform-origin:100% 50%;color:#9FD3FF;letter-spacing:-0.04em;}`,
    `      <svg id="waage-dial" viewBox="0 0 220 120" overflow="visible"><path d="M14 112 A96 96 0 0 1 206 112" fill="#1B2444" stroke="${K}" stroke-width="8"/><path d="M40 108 A70 70 0 0 1 180 108" fill="none" stroke="${YEL}" stroke-width="8" stroke-dasharray="6 16"/></svg>
      <div id="waage-post" class="waage-stk"></div>
      <svg id="waage-base" class="waage-stk" viewBox="0 0 64 70" overflow="visible"><path d="M16 6 H48 L62 64 H2 Z" fill="${GOLD}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/></svg>
      <div id="waage-beam" class="waage-stk"><svg viewBox="0 0 ${(HALF + 20) * 2} 160" width="${(HALF + 20) * 2}" height="160" overflow="visible">
        <path d="M${HALF + 20} 140 L${HALF + 20} 30" stroke="${K}" stroke-width="16" stroke-linecap="round"/><path d="M${HALF + 20} 140 L${HALF + 20} 30" stroke="${RED}" stroke-width="8" stroke-linecap="round"/>
        <rect x="10" y="128" width="${HALF * 2 + 20}" height="24" rx="12" fill="${GOLD}" stroke="${K}" stroke-width="7"/><circle cx="${HALF + 20}" cy="140" r="20" fill="${YEL}" stroke="${K}" stroke-width="7"/></svg></div>
      ${pan("waage-pl", PV[0] - HALF, pile)}
      ${pan("waage-pr", PV[0] + HALF, ballot)}
      <div id="waage-l1" class="waage-lb">ANARCHIE</div><div id="waage-l2" class="waage-lb">DEMOKRATIE</div>`,
    `      tl.fromTo(["#waage-post", "#waage-base", "#waage-dial"], { scaleY: 0.85 }, { scaleY: 1, duration: 0.3, ease: "back.out(1.8)" }, 0);
      tl.fromTo(["#waage-pl", "#waage-pr", "#waage-beam"], { scale: 0.85 }, { scale: 1, duration: 0.3, ease: "back.out(1.8)" }, 0);
      tl.fromTo(["#waage-l1", "#waage-l2"], { scale: 0.8 }, { scale: 1, duration: 0.25, ease: "back.out(2.4)", stagger: 0.12 }, 0.2);
      // the vote is undecided: slow tilt one way, then the other
${tilt([0, -9, 7, -4], 1.85, 0.1)}
      tl.to("#waage-l1", { keyframes: { scale: [1, 1.12, 1] }, duration: 0.4, ease: "sine.inOut" }, 0.5);
      tl.to("#waage-l2", { keyframes: { scale: [1, 1.12, 1] }, duration: 0.4, ease: "sine.inOut" }, 1.15);
      // ${L9}: ANARCHIE? DEMOKRATIE? - one side, then the other
${tilt([-4, 9, -9, 0], 1.5, L9)}
      tl.to("#waage-l1", { keyframes: { scale: [1, 1.12, 1] }, duration: 0.4, ease: "sine.inOut" }, ${f2(L9 + 0.1)});
      tl.to("#waage-l2", { keyframes: { scale: [1, 1.12, 1] }, duration: 0.4, ease: "sine.inOut" }, ${f2(L9 + 0.6)});
      // ${L9B}: the chat switches back and forth, the pointer swings with it
${tilt([0, 12, -12, 12, -12, 12, -12, 0], 2.3, L9B)}`, { kb: false }));
}

// ================= FOSSIL: inventory, the cursor keeps landing on the spiral fossil (c10 + c11) =================
{
  const p = "fossil";
  const [s, d] = S(p);
  const L11 = f2(C.c11[0] - s);
  const RY = [40, 195, 350, 505]; // row tops inside the panel (panel at 140, 740)
  const items = [
    ["TRANK", `<svg viewBox="0 0 110 110" width="110" height="110" overflow="visible"><rect x="40" y="6" width="30" height="22" rx="5" fill="#A8845A" stroke="${K}" stroke-width="5"/><path d="M42 28 H68 V44 L92 82 Q100 104 78 104 H32 Q10 104 18 82 L42 44 Z" fill="#E9F6FF" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><path d="M26 76 H84 L90 88 Q94 100 78 100 H32 Q16 100 20 88 Z" fill="${PINK}"/><circle cx="46" cy="66" r="5" fill="#fff"/></svg>`],
    ["SCHLÜSSEL", `<svg viewBox="0 0 110 110" width="110" height="110" overflow="visible"><circle cx="34" cy="55" r="24" fill="none" stroke="${K}" stroke-width="16"/><circle cx="34" cy="55" r="24" fill="none" stroke="${GOLD}" stroke-width="8"/><path d="M56 55 H104 M88 55 V76 M100 55 V70" stroke="${K}" stroke-width="16" stroke-linecap="round"/><path d="M56 55 H104 M88 55 V76 M100 55 V70" stroke="${GOLD}" stroke-width="8" stroke-linecap="round"/></svg>`],
    ["FOSSIL", `<div id="fossil-ic" style="position:absolute;inset:0;">${FOSSIL("fossil")}</div>`],
    ["KARTE", `<svg viewBox="0 0 110 110" width="110" height="110" overflow="visible"><path d="M8 20 L38 10 L72 22 L102 12 V92 L72 102 L38 90 L8 100 Z" fill="#F3E2B3" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><path d="M38 10 V90 M72 22 V102" stroke="#C9A35C" stroke-width="5"/><path d="M22 70 Q44 40 60 60 T92 36" stroke="${RED}" stroke-width="6" fill="none" stroke-dasharray="8 8"/></svg>`],
  ];
  const bb = burst("fossil-b", 7, 300, 1145, 44, 140, 66);
  const hop = (row, at) => `      tl.to(["#fossil-cur", "#fossil-hl"], { y: ${RY[row] - RY[0]}, duration: 0.12, ease: "power2.out" }, ${f2(at)});` +
    (row === 2 ? `\n      tl.to("#fossil-iw2", { keyframes: { scale: [1, 1.22, 1], rotation: [0, -14, 0] }, duration: 0.28, ease: "sine.out" }, ${f2(at + 0.1)});` : "");
  scenes.push(scene(p, "Inventar mit Fossil", s, d,
    `#fossil-pan{${abs(140, 740, 800, 650)}border-radius:30px;background:#fff;border:10px solid ${K};box-shadow:inset 0 0 0 8px #CFE3FF;overflow:hidden;}
     #fossil-hl{${abs(70, RY[0] - 6, 690, 136)}border-radius:22px;background:#FFE58A;}
     #fossil-cur{${abs(22, RY[0] + 34, 46, 56)}}
     .fossil-iw{position:absolute;left:96px;width:110px;height:110px;}
     .fossil-lb{position:absolute;left:236px;${LBL(72, NAVY)}-webkit-text-stroke:0;text-shadow:none;}
     #fossil-shine{position:absolute;left:0;top:0;width:60px;height:160px;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.85),rgba(255,255,255,0));transform:skewX(-20deg);}
     #fossil-clip{position:absolute;left:96px;top:${RY[2]}px;width:110px;height:110px;border-radius:50%;overflow:hidden;}`,
    `      <div id="fossil-pan" class="fossil-stk">
        <div id="fossil-hl"></div>
${items.map(([lb, ic], i) => `        <div id="fossil-iw${i}" class="fossil-iw" style="top:${RY[i]}px;">${ic}</div>
        <div id="fossil-l${i}" class="fossil-lb" style="top:${RY[i] + 22}px;">${lb}</div>`).join("\n")}
        <div id="fossil-clip"><div id="fossil-shine"></div></div>
        <svg id="fossil-cur" viewBox="0 0 46 56"><path d="M4 4 L42 28 L4 52 Z" fill="${RED}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/></svg>
      </div>
      ${bb.html}`,
    `      tl.fromTo("#fossil-pan", { scale: 0.9, rotation: -2 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(1.8)" }, 0);
      gsap.set("#fossil-iw2", { transformOrigin: "50% 50%" });
      // the cursor walks down to the fossil, the fossil glints
${hop(1, 0.3)}
${hop(2, 0.6)}
      tl.fromTo("#fossil-shine", { x: -80 }, { x: 160, duration: 0.5, ease: "power1.inOut" }, 0.85);
      tl.fromTo("#fossil-glint", { scale: 0, svgOrigin: "178 66" }, { scale: 1.2, duration: 0.3, ease: "back.out(3)" }, 0.9);
      tl.to("#fossil-glint", { keyframes: { scale: [1.2, 0.6, 1.2], rotation: [0, 45, 90] }, duration: 0.6, ease: "sine.inOut", repeat: 4 }, 1.2);
${bb.js(1.0)}
      // ${L11}: chosen again and again
${[[0, 0.1], [2, 0.42], [3, 0.74], [2, 1.06], [1, 1.38], [2, 1.7]].map(([r, t]) => hop(r, L11 + t)).join("\n")}
      tl.fromTo("#fossil-shine", { x: -80 }, { x: 160, duration: 0.4, ease: "power1.inOut", immediateRender: false }, ${f2(L11 + 1.8)});`));
}

// ================= KULT: the fossil on a pedestal, halo, rays, candles (c12); Klotz kneels with a candle =================
{
  const p = "kult";
  const [s, d] = S(p);
  const candle = (id, x, h) => `<div id="${id}" class="kult-cd" style="left:${x}px;top:${1390 - h - 70}px;height:${h + 70}px;"><svg viewBox="0 0 70 ${h + 70}" width="70" height="${h + 70}" overflow="visible">
      <rect x="12" y="70" width="46" height="${h}" rx="8" fill="#FFF4DC" stroke="${K}" stroke-width="6"/><path d="M22 80 V${h + 50}" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".8"/>
      <path d="M35 70 V60" stroke="${K}" stroke-width="5"/><g id="${id}-f"><path d="M35 4 Q58 34 46 52 Q35 64 24 52 Q12 34 35 4 Z" fill="#FFB020" stroke="${K}" stroke-width="5"/><path d="M35 26 Q44 40 40 48 Q35 54 30 48 Q26 40 35 26 Z" fill="#FFF0A0"/></g></svg></div>`;
  const rays = Array.from({ length: 12 }, (_, i) => { const a0 = (i / 12) * 360, a1 = a0 + 13; const pt = (a) => `${(300 + Math.cos((a * Math.PI) / 180) * 420).toFixed(1)} ${(300 + Math.sin((a * Math.PI) / 180) * 420).toFixed(1)}`; return `<path d="M300 300 L${pt(a0)} L${pt(a1)} Z" fill="#FFE58A" opacity=".22"/>`; }).join("");
  const CDS = [["kult-c0", 120, 150], ["kult-c1", 236, 210], ["kult-c2", 774, 210], ["kult-c3", 890, 150]];
  const bb = burst("kult-b", 8, 540, 950, 46, 210, 77);
  scenes.push(scene(p, "Fossil-Kult", s, d,
    `#kult-rw{${abs(240, 650, 600, 600)}overflow:hidden;border-radius:50%;}
     #kult-rays{position:absolute;inset:0;}
     #kult-halo{${abs(420, 742, 240, 70)}}
     #kult-fo{${abs(395, 800, 290, 290)}}
     #kult-ped{${abs(392, 1100, 296, 290)}}
     #kult-plq{position:absolute;left:30px;top:96px;width:236px;height:96px;border-radius:16px;background:${GOLD};border:7px solid ${K};}
     #kult-pt{position:absolute;left:0;top:10px;width:222px;text-align:center;${LBL(72, NAVY)}-webkit-text-stroke:0;text-shadow:none;}
     .kult-cd{position:absolute;width:70px;}`,
    `      <div id="kult-rw"><svg id="kult-rays" viewBox="0 0 600 600" width="600" height="600">${rays}</svg></div>
      <div id="kult-ped" class="kult-stk"><svg viewBox="0 0 296 290" width="296" height="290" overflow="visible"><rect x="20" y="0" width="256" height="40" rx="10" fill="#B9C3D6" stroke="${K}" stroke-width="8"/><rect x="40" y="40" width="216" height="210" fill="#D4DCEA" stroke="${K}" stroke-width="8"/><path d="M80 52 V238 M216 52 V238" stroke="#A7B2C6" stroke-width="8"/><rect x="6" y="246" width="284" height="40" rx="10" fill="#B9C3D6" stroke="${K}" stroke-width="8"/></svg>
        <div id="kult-plq"><div id="kult-pt">HEILIG</div></div></div>
      <svg id="kult-halo" viewBox="0 0 240 70" overflow="visible"><ellipse cx="120" cy="35" rx="112" ry="26" fill="none" stroke="${K}" stroke-width="18"/><ellipse cx="120" cy="35" rx="112" ry="26" fill="none" stroke="${YEL}" stroke-width="9"/></svg>
      <div id="kult-fo" class="kult-stk">${FOSSIL("kult")}</div>
${CDS.map(([id, x, h]) => "      " + candle(id, x, h)).join("\n")}
      ${bb.html}`,
    `      tl.fromTo("#kult-fo", { scale: 0.85, y: 20 }, { scale: 1, y: 0, duration: 0.35, ease: "back.out(1.8)" }, 0);
      tl.fromTo("#kult-ped", { scaleY: 0.85 }, { scaleY: 1, duration: 0.3, ease: "back.out(1.8)", transformOrigin: "50% 100%" }, 0);
      tl.to("#kult-rays", { rotation: 40, duration: ${d}, ease: "none" }, 0);
      tl.fromTo("#kult-halo", { scale: 0.4, y: 30 }, { scale: 1, y: 0, duration: 0.4, ease: "back.out(2.2)" }, 0.25);
      tl.to("#kult-halo", { keyframes: { y: [0, -10, 0] }, duration: 0.9, ease: "sine.inOut", repeat: 2 }, 0.65);
      tl.to("#kult-fo", { keyframes: { y: [0, -14, 0], rotation: [0, 4, 0] }, duration: 1.1, ease: "sine.inOut", repeat: 1 }, 0.4);
      gsap.set("#kult-glint", { svgOrigin: "178 66" });
      tl.to("#kult-glint", { keyframes: { scale: [1, 0.5, 1], rotation: [0, 45, 90] }, duration: 0.7, ease: "sine.inOut", repeat: 3 }, 0);
${CDS.map(([id], i) => `      tl.fromTo("#${id}", { scaleY: 0 }, { scaleY: 1, duration: 0.25, ease: "back.out(2)", transformOrigin: "50% 100%" }, ${f2(0.1 + i * 0.08)});
      gsap.set("#${id}-f", { svgOrigin: "35 56" });
      tl.to("#${id}-f", { keyframes: { scaleY: [1, 1.15, 0.92, 1], skewX: [0, 6, -5, 0] }, duration: 0.6, ease: "none", repeat: ${Math.ceil(d / 0.6) - 1} }, ${f2(i * 0.13)});`).join("\n")}
${bb.js(0.5)}`));
}

// ================= KALENDER: tear-off calendar, START 12.02.2014 -> blank pages rattle -> ENDE 01.03.2014 (c13) =================
{
  const p = "kalender";
  const [s, d] = S(p);
  const NB = 6; // blank pages in between (no numbers: only the two dates from the fact check are shown)
  const page = (id, head, date, extra = "") => `<div id="${id}" class="kal-pg"><div class="kal-hd">${head ? `<span class="kal-ht">${head}</span>` : ""}</div>
      ${date ? `<div class="kal-dt">${date}</div>` : `<div class="kal-ln" style="top:200px"></div><div class="kal-ln" style="top:260px;width:300px"></div>`}
      <div class="kal-grid"></div>${extra}</div>`;
  scenes.push(scene(p, "Kalender rattert", s, d,
    `#kal-wrap{${abs(250, 770, 580, 580)}perspective:1400px;}
     .kal-pg{position:absolute;left:0;top:0;width:580px;height:560px;border-radius:26px;background:#fff;border:10px solid ${K};overflow:hidden;transform-origin:50% 0%;}
     .kal-hd{position:absolute;left:0;top:0;width:100%;height:130px;background:${RED};border-bottom:8px solid ${K};}
     .kal-ht{position:absolute;left:0;top:26px;width:560px;text-align:center;${LBL(80)}}
     .kal-dt{position:absolute;left:0;top:170px;width:560px;text-align:center;${LBL(100, NAVY)}-webkit-text-stroke:0;text-shadow:none;}
     .kal-ln{position:absolute;left:130px;width:300px;height:26px;border-radius:13px;background:#DDE4EF;}
     .kal-grid{position:absolute;left:50px;top:320px;width:460px;height:190px;background-image:linear-gradient(#DDE4EF 6px,transparent 6px),linear-gradient(90deg,#DDE4EF 6px,transparent 6px);background-size:66px 64px;}
     #kal-rings{${abs(300, 742, 480, 60)}}
     #kal-ok{position:absolute;left:380px;top:330px;width:160px;height:160px;}`,
    `      <div id="kal-wrap" class="kalender-stk" data-layout-allow-overlap data-layout-allow-occlusion>
        ${page("kal-end", "ENDE", "01.03.2014", `<svg id="kal-ok" viewBox="0 0 160 160"><circle cx="80" cy="80" r="70" fill="#21A35B" stroke="${K}" stroke-width="9"/><path d="M44 82 L70 108 L118 52" stroke="#fff" stroke-width="18" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`)}
${Array.from({ length: NB }, (_, i) => "        " + page(`kal-b${NB - 1 - i}`, "", "")).join("\n")}
        ${page("kal-start", "START", "12.02.2014")}
      </div>
      <svg id="kal-rings" viewBox="0 0 480 60" overflow="visible">${[30, 120, 210, 300, 390].map((x) => `<rect x="${x + 10}" y="0" width="26" height="60" rx="13" fill="#C9D3DE" stroke="${K}" stroke-width="7"/>`).join("")}</svg>`,
    `      tl.fromTo("#kal-wrap", { scale: 0.88, rotation: -3 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(1.8)" }, 0);
      gsap.set("#kal-ok", { scale: 0, transformOrigin: "50% 50%" });
      // the start page and the blank pages flip away one after the other (rotation stays below 90 deg, then they fade)
${["kal-start", ...Array.from({ length: NB }, (_, i) => `kal-b${i}`)].map((id, i) => { const at = f2(0.42 + i * 0.12); return `      tl.to("#${id}", { rotationX: 78, opacity: 0, duration: 0.16, ease: "power1.in" }, ${at});`; }).join("\n")}
      tl.to("#kal-wrap", { keyframes: { y: [0, -6, 0] }, duration: 0.12, ease: "none", repeat: ${NB} }, 0.42);
      tl.to("#kal-ok", { scale: 1, duration: 0.3, ease: "back.out(3)" }, ${f2(0.42 + NB * 0.12 + 0.2)});
      tl.to("#kal-wrap", { keyframes: { scale: [1, 1.05, 1] }, duration: 0.3, ease: "sine.inOut" }, ${f2(0.42 + NB * 0.12 + 0.2)});`));
}

// ================= FINALE: trophy, credit stars rise, confetti in arrow shape, the hero and a monster cheer (c14, punchline) =================
{
  const p = "finale";
  const [s, d] = S(p);
  const RS = mulberry32(301);
  const conf = Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2 + RS() * 0.3; const rr = 300 + RS() * 160; return { k: ["up", "right", "down", "left"][i % 4], c: [YEL, RED, MINT, PINK, "#9FD3FF"][i % 5], x: Math.round(Math.cos(a) * rr), y: Math.round(Math.sin(a) * rr * 0.8), r: Math.round(RS() * 360) }; });
  const stars = Array.from({ length: 10 }, (_, i) => ({ x: Math.round(80 + RS() * 880), y: Math.round(760 + RS() * 900), s: Math.round(36 + RS() * 30) }));
  scenes.push(scene(p, "Durchgespielt", s, d,
    `#fin-zone{${abs(40, 730, 1000, 660)}overflow:hidden;}
     #fin-zin{position:absolute;left:-40px;top:-730px;width:1080px;height:1920px;}
     #fin-glow{${abs(170, 760, 740, 600)}border-radius:50%;background:radial-gradient(circle,rgba(255,210,63,.5),rgba(255,210,63,0) 66%);}
     #fin-cup{${abs(380, 800, 320, 460)}transform-origin:50% 100%;}
     .fin-cf{position:absolute;width:60px;height:60px;}
     .fin-st{position:absolute;}
     #fin-hw{${abs(170, 1170, 80, 112)}} #fin-hero{position:absolute;inset:0;transform-origin:50% 100%;}
     #fin-mw{${abs(790, 1150, 112, 64)}}`,
    `      <div id="fin-zone"><div id="fin-zin">
        <div id="fin-glow"></div>
${stars.map((st, i) => `        <div id="fin-s${i}" class="fin-st" style="left:${st.x}px;top:${st.y}px;width:${st.s}px;height:${st.s}px;">${STAR(i % 2 ? "#fff" : YEL, 8)}</div>`).join("\n")}
        <div id="fin-cup" class="finale-stk"><svg viewBox="0 0 320 460" width="320" height="460" overflow="visible">
          <path d="M70 60 Q-10 60 14 140 Q34 200 96 210" fill="none" stroke="${K}" stroke-width="30" stroke-linecap="round"/><path d="M70 60 Q-10 60 14 140 Q34 200 96 210" fill="none" stroke="${GOLD}" stroke-width="16" stroke-linecap="round"/>
          <path d="M250 60 Q330 60 306 140 Q286 200 224 210" fill="none" stroke="${K}" stroke-width="30" stroke-linecap="round"/><path d="M250 60 Q330 60 306 140 Q286 200 224 210" fill="none" stroke="${GOLD}" stroke-width="16" stroke-linecap="round"/>
          <path d="M50 30 H270 Q270 220 160 250 Q50 220 50 30 Z" fill="${YEL}" stroke="${K}" stroke-width="10" stroke-linejoin="round"/><path d="M84 60 Q90 170 140 214" stroke="#FFF1B0" stroke-width="16" fill="none" stroke-linecap="round"/>
          <rect x="136" y="246" width="48" height="80" fill="${GOLD}" stroke="${K}" stroke-width="9"/><rect x="74" y="320" width="172" height="40" rx="10" fill="${GOLD}" stroke="${K}" stroke-width="9"/><rect x="46" y="356" width="228" height="90" rx="14" fill="#5A3A22" stroke="${K}" stroke-width="9"/>
          <path transform="translate(112 66) scale(.96)" d="${STAR_D}" fill="#fff" stroke="${K}" stroke-width="8" stroke-linejoin="round"/></svg></div>
        <div id="fin-hw"><div id="fin-hero" class="finale-stk">${PIX(HERO, HERO_P, 8)}</div></div>
        <div id="fin-mw" class="finale-stk">${PIX(BAT, BAT_P, 8)}</div>
${conf.map((c, i) => `        <div id="fin-c${i}" class="fin-cf" style="left:510px;top:960px;"><svg viewBox="0 0 100 100" width="60" height="60" overflow="visible"><path d="${ARROW_D}" transform="rotate(${ROT[c.k]} 50 50)" fill="${c.c}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/></svg></div>`).join("\n")}
      </div></div>`,
    `      tl.fromTo("#fin-cup", { scale: 0.7, rotation: -8 }, { scale: 1, rotation: 0, duration: 0.4, ease: "back.out(2)" }, 0);
      tl.fromTo("#fin-glow", { scale: 0.6, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" }, 0);
      // credits: stars rise slowly and twinkle (smooth scale, no flashing)
${stars.map((_, i) => `      tl.fromTo("#fin-s${i}", { y: 0 }, { y: -320, duration: ${d}, ease: "none" }, 0);
      tl.to("#fin-s${i}", { keyframes: { scale: [1, 0.55, 1], rotation: [0, 36, 72] }, duration: 0.8, ease: "sine.inOut", repeat: 2 }, ${f2((i % 4) * 0.2)});`).join("\n")}
      // punchline: arrow confetti bursts out of the trophy, one gentle shake
${conf.map((c, i) => `      tl.fromTo("#fin-c${i}", { x: 0, y: 0, scale: 0, rotation: 0, opacity: 1 }, { keyframes: { x: [0, ${f2(c.x * 0.7)}, ${c.x}], y: [0, ${f2(c.y * 0.7 - 60)}, ${c.y + 60}], scale: [0, 1.2, 0.9], rotation: [0, ${c.r}, ${c.r + 90}], opacity: [1, 1, 0] }, duration: 1.3, ease: "power1.out", immediateRender: true }, ${f2(0.35 + (i % 3) * 0.06)});`).join("\n")}
${shake("#finale-kb", 0.35, 10, 0.4)}
      tl.to("#fin-cup", { keyframes: { scaleY: [1, 0.94, 1.05, 1] }, duration: 0.4, ease: "none" }, 0.35);
      tl.to("#fin-hw", { keyframes: { y: [0, -70, 0] }, duration: 0.45, ease: "power1.inOut", repeat: 3 }, 0.3);
      tl.to("#fin-mw", { keyframes: { y: [0, -30, 0], rotation: [0, 8, 0] }, duration: 0.35, ease: "sine.inOut", repeat: 5 }, 0.2);`));
}

// ================= AWARD: generic statuette (star on a column), plaque FAN-KREATION, both monsters cheer (c15) =================
{
  const p = "award";
  const [s, d] = S(p);
  const bb = burst("award-b", 8, 540, 900, 46, 170, 93);
  scenes.push(scene(p, "Preis", s, d,
    `#aw-glow{${abs(240, 720, 600, 520)}border-radius:50%;background:radial-gradient(circle,rgba(255,210,63,.45),rgba(255,210,63,0) 66%);}
     #aw-star{${abs(425, 740, 230, 230)}}
     #aw-col{${abs(500, 950, 80, 210)}}
     #aw-base{${abs(280, 1150, 520, 170)}}
     #aw-pt{position:absolute;left:0;top:58px;width:520px;text-align:center;${LBL(72, YEL)}-webkit-text-stroke:10px ${K};}
     #aw-m1{${abs(100, 1196, 144, 120)}transform-origin:50% 100%;}
     #aw-m2{${abs(816, 1210, 140, 80)}}`,
    `      <div id="aw-glow"></div>
      <svg id="aw-col" class="award-stk" viewBox="0 0 80 210" overflow="visible"><path d="M24 0 H56 L66 210 H14 Z" fill="${GOLD}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/><path d="M34 10 L30 200" stroke="#FFE38A" stroke-width="7"/></svg>
      <div id="aw-star" class="award-stk">${STAR(YEL, 6)}</div>
      <div id="aw-base" class="award-stk"><svg viewBox="0 0 520 170" width="520" height="170" overflow="visible"><path d="M70 0 H450 L510 164 H10 Z" fill="#3A2A55" stroke="${K}" stroke-width="9" stroke-linejoin="round"/><rect x="40" y="44" width="440" height="100" rx="14" fill="#241A3A" stroke="${GOLD}" stroke-width="6"/></svg><div id="aw-pt">FAN-KREATION</div></div>
      <div id="aw-m1" class="award-stk">${PIX(BLOB, BLOB_P, 12)}</div>
      <div id="aw-m2" class="award-stk">${PIX(BAT, BAT_P, 10)}</div>
      ${bb.html}`,
    `      tl.fromTo("#aw-star", { scale: 0.5, rotation: -40 }, { scale: 1, rotation: 0, duration: 0.4, ease: "back.out(2.4)" }, 0);
      tl.fromTo(["#aw-col", "#aw-base"], { scaleY: 0.8 }, { scaleY: 1, duration: 0.3, ease: "back.out(2)", transformOrigin: "50% 100%" }, 0);
      tl.fromTo("#aw-glow", { scale: 0.6, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" }, 0);
      tl.to("#aw-star", { keyframes: { rotation: [0, 12, -12, 0], scale: [1, 1.06, 1.06, 1] }, duration: 1.2, ease: "sine.inOut", repeat: 1 }, 0.5);
${bb.js(0.4)}
      tl.fromTo("#aw-pt", { scale: 0.8 }, { scale: 1, duration: 0.3, ease: "back.out(2.4)" }, 0.25);
      tl.to("#aw-m1", { keyframes: { y: [0, -50, 0], scaleY: [1, 1.08, 0.92, 1] }, duration: 0.5, ease: "power1.inOut", repeat: 4 }, 0.3);
      tl.to("#aw-m2", { keyframes: { y: [0, -36, 0], rotation: [0, -10, 0] }, duration: 0.4, ease: "sine.inOut", repeat: 5 }, 0.45);`));
}

// ================= FRAGE + loop: two vote buttons A / CHAOS, then the hook picture builds up again (c16 + c17) =================
{
  const p = "frage";
  const [s, d] = S(p);
  const LOOP = f2(C.c17[0] - s);
  const PEN0 = f2(LOOP - 0.18), BUB0 = f2(PEN0 - 0.1);
  const tail = d - PEN0;
  scenes.push(scene(p, "Frage und Loop", s, d, hookCss(p) + `
     #frage-ba{${abs(120, 800, 320, 320)}}
     #frage-bc{${abs(500, 860, 470, 210)}}
     #frage-bct{position:absolute;left:0;top:44px;width:470px;text-align:center;${LBL(110, NAVY)}-webkit-text-stroke:0;text-shadow:none;}
     #frage-cm{${abs(450, 1170, 180, 150)}}`,
    hookBody(p) + `
      <div id="frage-ba" class="frage-stk"><svg viewBox="0 0 320 320" width="320" height="320" overflow="visible"><circle cx="160" cy="176" r="146" fill="#A3161D" stroke="${K}" stroke-width="10"/><circle cx="160" cy="156" r="146" fill="${RED}" stroke="${K}" stroke-width="10"/><ellipse cx="110" cy="96" rx="44" ry="22" fill="#fff" opacity=".35" transform="rotate(-30 110 96)"/>
        <text x="160" y="222" text-anchor="middle" font-family="Lilita One" font-size="190" fill="#fff" stroke="${K}" stroke-width="12" paint-order="stroke">A</text></svg></div>
      <div id="frage-bc" class="frage-stk"><svg viewBox="0 0 470 210" width="470" height="210" overflow="visible"><rect x="6" y="26" width="458" height="178" rx="60" fill="${GOLD_D}" stroke="${K}" stroke-width="10"/><rect x="6" y="6" width="458" height="178" rx="60" fill="${YEL}" stroke="${K}" stroke-width="10"/></svg><div id="frage-bct">CHAOS</div></div>
      <svg id="frage-cm" class="frage-stk" viewBox="0 0 180 150" overflow="visible"><path d="M28 8 H152 Q172 8 172 28 V92 Q172 112 152 112 H80 L44 142 L50 112 H28 Q8 112 8 92 V28 Q8 8 28 8 Z" fill="#fff" stroke="${K}" stroke-width="8" stroke-linejoin="round"/><circle cx="56" cy="60" r="12" fill="${K}"/><circle cx="90" cy="60" r="12" fill="${K}"/><circle cx="124" cy="60" r="12" fill="${K}"/></svg>`,
    `      gsap.set(["#frage-hhw", "#frage-glow", "#frage-rain"], { opacity: 0 });
      tl.fromTo("#frage-ba", { scale: 0.8, rotation: -8 }, { scale: 1, rotation: 0, duration: 0.32, ease: "back.out(2.2)" }, 0);
      tl.fromTo("#frage-bc", { scale: 0.6, rotation: 6 }, { scale: 1, rotation: 0, duration: 0.32, ease: "back.out(2.2)" }, 0.1);
      tl.fromTo("#frage-cm", { scale: 0.6 }, { scale: 1, duration: 0.3, ease: "back.out(2.4)" }, 0.25);
      // the buttons are pressed in turn (A ... or CHAOS?)
      tl.to("#frage-ba", { keyframes: { y: [0, 18, 0], scale: [1, 0.95, 1] }, duration: 0.3, ease: "power1.inOut" }, 0.7);
      tl.to("#frage-bc", { keyframes: { y: [0, 18, 0], scale: [1, 0.95, 1] }, duration: 0.3, ease: "power1.inOut" }, 1.25);
      tl.to("#frage-ba", { keyframes: { y: [0, 18, 0], scale: [1, 0.95, 1] }, duration: 0.3, ease: "power1.inOut" }, 1.8);
      tl.to("#frage-bc", { keyframes: { rotation: [0, -4, 4, -3, 0] }, duration: 0.5, ease: "sine.inOut" }, 2.2);
      tl.to("#frage-cm", { keyframes: { y: [0, -12, 0] }, duration: 0.5, ease: "sine.inOut", repeat: 3 }, 0.6);
      // loop: the buttons shrink away and are gone in the frame the hook picture appears (the question text is still on screen)
      tl.to(["#frage-ba", "#frage-bc", "#frage-cm"], { keyframes: { opacity: [1, 1, 0.5], scale: [1, 0.9, 0.75] }, duration: 0.1, ease: "none" }, ${BUB0});
      tl.set(["#frage-ba", "#frage-bc", "#frage-cm"], { opacity: 0 }, ${PEN0});
      tl.set("#frage-hhw", { opacity: 1 }, ${PEN0});
      tl.set("#frage-rain", { opacity: 1 }, ${LOOP});
      tl.fromTo("#frage-hhw", { scale: 0.8 }, { scale: 1, duration: 0.3, ease: "back.out(1.6)", immediateRender: false }, ${PEN0});
      tl.fromTo("#frage-glow", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out", immediateRender: false }, ${f2(PEN0 + 0.05)});
      // the rain runs so that the last frame is in the frame-0 phase again
${rainJs(p, PEN0, tail, -(tail / RAIN_D))}`,
    { exit: false, kb: false }));
}

// ================= background: night blue, retro grid floor, drifting pixel sparks (all loop-seamless) =================
{
  const RS = mulberry32(606);
  const sq = (n, minS, maxS, op) => Array.from({ length: n }, () => ({ x: Math.round(RS() * 1080), y: Math.round(RS() * 1920), s: Math.round(minS + RS() * (maxS - minS)), o: +(op * (0.6 + RS() * 0.4)).toFixed(2), c: [YEL, MINT, PINK, "#9FD3FF"][Math.floor(RS() * 4)] }));
  const far = sq(26, 6, 10, 0.35), near = sq(12, 10, 16, 0.5);
  const tile = (fl, k) => fl.map((f) => `<rect x="${f.x}" y="${f.y + k * 1920}" width="${f.s}" height="${f.s}" fill="${f.c}" opacity="${f.o}"/>`).join("");
  const stars = Array.from({ length: 24 }, () => `<rect x="${Math.round(RS() * 1080)}" y="${Math.round(40 + RS() * 1250)}" width="4" height="4" fill="#fff" opacity="${(0.25 + RS() * 0.45).toFixed(2)}"/>`).join("");
  let grid = "";
  for (let i = -10; i <= 10; i++) grid += `<path d="M${540 + i * 34} 0 L${540 + i * 260} 520" stroke="#6E4BD8" stroke-width="4" opacity=".55"/>`;
  let hl = ""; for (let k = 0; k < 9; k++) { const y = Math.round(520 * Math.pow(k / 8, 1.8)); hl += `<path d="M0 ${y} H1080" stroke="#6E4BD8" stroke-width="4" opacity=".55"/>`; }
  fs.writeFileSync(path.join(OUT, "compositions", "bg.html"), `<template>
  <style>
    #root { position: absolute; inset: 0; overflow: hidden; background: #0E1530; }
    #bg-sky { position: absolute; inset: 0; background: linear-gradient(180deg, #0B1230 0%, #0E1530 40%, #1B1C52 72%, #2A1E5E 74%, #160F38 100%); }
    #bg-stars { position: absolute; left: 0; top: 0; }
    #bg-sun { position: absolute; left: 290px; top: 1190px; width: 500px; height: 260px; border-radius: 250px 250px 0 0; background: linear-gradient(180deg, rgba(255,122,26,.30), rgba(255,59,59,.10)); }
    #bg-grid { position: absolute; left: 0; top: 1420px; }
    .bg-px { position: absolute; left: 0; top: 0; }
  </style>
  <div id="root" data-composition-id="bg" data-width="1080" data-height="1920" data-layout-allow-overflow>
    <div id="bg-sky"></div>
    <svg id="bg-stars" width="1080" height="1300">${stars}</svg>
    <div id="bg-sun"></div>
    <svg id="bg-grid" width="1080" height="520" viewBox="0 0 1080 520">${grid}${hl}</svg>
    <svg id="bg-p1" class="bg-px" width="1080" height="3840">${tile(far, 0)}${tile(far, 1)}</svg>
    <svg id="bg-p2" class="bg-px" width="1080" height="5760">${tile(near, 0)}${tile(near, 1)}${tile(near, 2)}</svg>
  </div>
  <script>
    (function () {
      const tl = gsap.timeline({ paused: true });
      // every move covers whole periods, so the last frame leads straight back into frame 0
      tl.fromTo("#bg-p1", { y: 0 }, { y: -1920, duration: ${DUR}, ease: "none" }, 0);
      tl.fromTo("#bg-p2", { y: 0 }, { y: -3840, duration: ${DUR}, ease: "none" }, 0);
      tl.fromTo("#bg-sun", { opacity: 1 }, { keyframes: { opacity: [1, 0.7, 1] }, duration: ${f2(DUR / 4)}, ease: "sine.inOut", repeat: 3 }, 0);
      window.__timelines["bg"] = tl;
    })();
  </script>
</template>
`);
}

// ================= captions =================
// "*" keyword (yellow Lilita, 140 px), "#" the same with tighter letters (long words), "!" punchline (largest, 172 px). "/" line break.
// Fixed word gap: every word has 11 px margins. A non-breaking space keeps "Leute…"/"Tagen …"/"gedrückt –" as one word.
const NB = " ";
const HOOKW = ["Über", "eine", "/", "#MILLION", "Leute…"];
const caps = [
  { id: "c01", words: HOOKW, still: true, wide: true },
  { id: "c02", words: ["steuern", "alle", "/", "*EINE", "Figur."], shake: true },
  { id: "c03", words: ["*2014", "auf", "Twitch.", "/", "Spiel:", "/", "Pokémon", "Rot."] },
  { id: "c04", words: ["Jeder", "tippt", "Befehle", "/", "in", "den", "Chat."] },
  { id: "c05", words: ["Das", "Spiel", "macht", "/", "einfach", "*ALLES."], shake: true },
  { id: "c06", words: ["Rauf.", "Runter.", "/", "Rauf.", "Ins", "*MENÜ."] },
  { id: "c07", words: ["Totales", "*CHAOS."], shake: true },
  { id: "c08", words: ["Dann", "kommt", "/", "eine", "Abstimmung:"] },
  { id: "c09", words: ["#ANARCHIE?", "/", "#DEMOKRATIE?", "/", "Per", "Mehrheit."], wide: true },
  { id: "c09b", words: ["Der", "Chat", "wechselt", "/", "hin", "und", "her."] },
  { id: "c10", words: ["Und", "ein", "*FOSSIL", "/", "ohne", "Nutzen."] },
  { id: "c11", words: ["Ständig", "wird", "/", "es", "ausgewählt."] },
  { id: "c12", words: ["Der", "Chat", "macht", "/", "es", "zum", "*KULT."], shake: true },
  { id: "c13", words: ["Nach", "gut", "/", "*16", `Tagen${NB}…`] },
  { id: "c14", words: ["Durchgespielt.", "/", "!WIRKLICH.", "/", "Kein", "Witz."], shake: true, wide: true },
  { id: "c15", words: ["Später:", "*PREIS", "/", "Beste", "Fan-Kreation", "/", "des", "Jahres."] },
  { id: "c16", words: ["Hättest", "du", "„A“", "/", `gedrückt${NB}–`, "/", "oder", "*CHAOS?"] },
  { id: "c17", words: HOOKW, loop: true, wide: true },
].map((c) => ({ ...c, s: C[c.id][0], e: C[c.id][1] }));
const ST = 0.055, PD = 0.2, KD = 0.22, EXIT = 0.12;
let capHtml = "", capJs = "";
const report = [];
for (const c of caps) {
  const d = f2(c.e - c.s);
  const track = caps.indexOf(c) % 2;
  const kind = (w) => (w === "/" ? "br" : "*!#".includes(w[0]) && w.length > 1 ? w[0] : "");
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
    wc++;
    if (c.still) { // frame 0: the whole hook line is already readable
      if (k) capJs += `      tl.to("#${c.id}-w${i}", { keyframes: { scale: [1, 1.08, 1], rotation: [0, -3, 0] }, duration: 0.4, ease: "power1.inOut" }, 0.3);\n`;
      return;
    }
    const at = f2(c.s + 0.02 + n * step);
    n++;
    if (k) {
      capJs += `      tl.fromTo("#${c.id}-w${i}", { opacity: 0, scale: ${c.wide ? 1 : 1.15}, rotation: ${c.wide ? -2 : -6} }, { opacity: 1, scale: 1, rotation: 0, duration: ${KD}, ease: "back.out(2.2)" }, ${at});\n`;
      if (c.shake) capJs += `      tl.to("#${c.id}-w${i}", { keyframes: { x: [0, -10, 10, -6, 4, 0], rotation: [0, -3, 3, -2, 0, 0] }, duration: 0.36, ease: "none" }, ${f2(at + 0.28)});\n`;
      full = Math.max(full, at + KD);
    } else {
      capJs += `      tl.fromTo("#${c.id}-w${i}", { opacity: 0, scale: 0.4, y: 26 }, { opacity: 1, scale: 1, y: 0, duration: ${PD}, ease: "${c.wide ? "power2.out" : "back.out(1.6)"}" }, ${at});\n`;
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
    .g { display: inline-block; }
    .kw { font-family: 'Lilita One'; font-weight: 400; color: ${YEL}; font-size: 140px; line-height: 1.0; text-transform: uppercase; letter-spacing: 0.01em; }
    .kwn { letter-spacing: -0.04em; }
    .pt { font-family: 'Lilita One'; font-weight: 400; color: ${YEL}; font-size: 172px; line-height: 0.95; letter-spacing: 0; -webkit-text-stroke: 22px ${K}; text-shadow: 0 14px 0 #050814; }
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

// ================= Klotz (rig from Folge 1-5; new gag: presses "A" and gets shoved by the chat, kneels before the fossil with a candle) =================
// eyes always open: no mood closes the lids; one single one-eye wink at the end
const M = {
  shock:     { eye: 1.12, ps: 0.6, px: 0, py: 0, bL: -18, bR: -18, tL: -6, tR: -6, mx: 1, my: 1.1, g: 0, aL: 70, aR: -70 },
  surprised: { eye: 1.08, ps: 0.8, px: 0, py: 6, bL: -16, bR: -16, tL: 0, tR: 0, mx: 0.55, my: 0.6, g: 0, aL: 55, aR: -55 },
  curious:   { eye: 1.05, ps: 1.1, px: -14, py: -10, bL: -18, bR: -4, tL: 0, tR: 0, mx: 0.5, my: 0.35, g: 0, aL: 40, aR: -40 },
  impressed: { eye: 1.05, ps: 0.9, px: -6, py: -4, bL: -12, bR: -12, tL: -4, tR: -4, mx: 0.45, my: 0.45, g: 0, aL: 40, aR: -40 },
  look:      { eye: 1.06, ps: 1.0, px: -14, py: -12, bL: -14, bR: -14, tL: -4, tR: -4, mx: 0.5, my: 0.5, g: 0, aL: 40, aR: -40 },
  proud:     { eye: 1.05, ps: 1.0, px: 0, py: -2, bL: -14, bR: -14, tL: -4, tR: -4, mx: 0, my: 0, g: 1, gs: 0.75, aL: 30, aR: -30 },
  jawdrop:   { eye: 1.18, ps: 0.55, px: -6, py: -8, bL: -22, bR: -22, tL: -4, tR: -4, mx: 1.1, my: 1.7, jy: 14, g: 0, aL: 60, aR: -60 },
  happy:     { eye: 1.04, ps: 1, px: 0, py: 0, bL: -10, bR: -10, tL: -4, tR: -4, mx: 0, my: 0, g: 1, gs: 0.8, aL: 35, aR: -35 },
  cheer:     { eye: 1.05, ps: 1, px: 0, py: -4, bL: -16, bR: -16, tL: -6, tR: -6, mx: 0, my: 0, g: 1, gs: 0.9, aL: 160, aR: -160 },
  press:     { eye: 1.1, ps: 0.8, px: -16, py: 8, bL: -8, bR: -20, tL: 6, tR: -6, mx: 0.35, my: 0.3, g: 0, aL: 80, aR: -40 },
  pray:      { eye: 1.06, ps: 0.9, px: -14, py: -14, bL: -16, bR: -16, tL: -4, tR: -4, mx: 0, my: 0, g: 1, gs: 0.6, aL: 130, aR: -20 },
};
const LOOPK = C.c17[0];
const A0 = C.c07[0]; // chaos gag start
const KN = [C.c12[0] + 0.1, C.c12[1] - 0.2]; // kneeling before the fossil
const WINK = f2(C.c16[0] + 1.5);
const moods = [
  [C.c02[0], "surprised"], [C.c03[0], "curious"], [C.c04[0], "look"], [C.c05[0], "happy"], [C.c06[0], "look"],
  [A0 + 0.08, "press"], [A0 + 0.58, "surprised"], [A0 + 1.08, "jawdrop"],
  [C.c08[0], "curious"], [C.c09[0], "look"], [C.c09b[0], "curious"], [C.c10[0], "surprised"], [C.c11[0], "impressed"], [KN[0], "pray"], [C.c13[0], "curious"],
  [C.c14[0], "jawdrop"], [C.c14[0] + 0.8, "cheer"], [C.c15[0], "proud"], [C.c16[0], "happy"], [LOOPK + 0.08, "shock"],
];

const klotzSvg = `<svg viewBox="0 0 300 330" width="100%" height="100%" overflow="visible">
  <defs>
    <clipPath id="k-clipL"><ellipse cx="108" cy="140" rx="40" ry="46"/></clipPath>
    <clipPath id="k-clipR"><ellipse cx="192" cy="140" rx="40" ry="46"/></clipPath>
  </defs>
  <g id="k-armL"><rect x="31" y="186" width="34" height="84" rx="17" fill="#F06A0C" stroke="#7A2E00" stroke-width="6"/><circle cx="48" cy="270" r="21" fill="#FF7A1A" stroke="#7A2E00" stroke-width="6"/></g>
  <g id="k-armR"><rect x="235" y="186" width="34" height="84" rx="17" fill="#F06A0C" stroke="#7A2E00" stroke-width="6"/>
    <g id="k-cand"><rect x="240" y="196" width="24" height="58" rx="5" fill="#FFF4DC" stroke="#5A2200" stroke-width="5"/><path d="M252 196 V186" stroke="#5A2200" stroke-width="4"/><g id="k-flame"><path d="M252 150 Q268 172 260 184 Q252 192 244 184 Q236 172 252 150 Z" fill="#FFB020" stroke="#5A2200" stroke-width="4"/><path d="M252 166 Q258 176 255 181 Q252 184 249 181 Q246 176 252 166 Z" fill="#FFF0A0"/></g></g>
    <circle cx="252" cy="270" r="21" fill="#FF7A1A" stroke="#7A2E00" stroke-width="6"/></g>
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
// the big "A" button the gag uses (left of Klotz, below the graphics zone); label 84 px
const kBtn = `<svg viewBox="0 0 150 130" width="150" height="130" overflow="visible">
  <rect x="10" y="64" width="130" height="58" rx="18" fill="#3A4560" stroke="${K}" stroke-width="7"/>
  <g id="k-bcap"><ellipse cx="75" cy="66" rx="60" ry="24" fill="#A3161D" stroke="${K}" stroke-width="7"/><path d="M15 66 V44 Q15 18 75 18 Q135 18 135 44 V66 Q135 90 75 90 Q15 90 15 66 Z" fill="${RED}" stroke="${K}" stroke-width="7"/>
  <text x="75" y="80" text-anchor="middle" font-family="Lilita One" font-size="84" fill="#fff" stroke="${K}" stroke-width="7" paint-order="stroke">A</text></g></svg>`;

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
      tl.to("#k-armL", { rotation: ${p.aL}, duration: ${f2(dur * 1.3)}, ease: "back.out(1.6)" }, ${f2(t + 0.04)});
      tl.to("#k-armR", { rotation: ${p.aR}, duration: ${f2(dur * 1.3)}, ease: "back.out(1.6)" }, ${f2(t + 0.08)});
`;
};
const p0 = M.shock;
kJs += `      gsap.set("#k-armL", { svgOrigin: "48 190" }); gsap.set("#k-armR", { svgOrigin: "252 190" });
      gsap.set(["#k-eyeL"], { svgOrigin: "108 140" }); gsap.set(["#k-eyeR"], { svgOrigin: "192 140" });
      gsap.set("#k-pupL", { svgOrigin: "108 142" }); gsap.set("#k-pupR", { svgOrigin: "192 142" });
      gsap.set("#k-lidL", { svgOrigin: "108 90" }); gsap.set("#k-lidR", { svgOrigin: "192 90" });
      gsap.set("#k-browL", { svgOrigin: "109 81" }); gsap.set("#k-browR", { svgOrigin: "191 81" });
      gsap.set("#k-mouth", { svgOrigin: "150 228" }); gsap.set("#k-grin", { svgOrigin: "150 230" });
      gsap.set("#k-cand", { svgOrigin: "252 262", opacity: 0, scale: 0 }); gsap.set("#k-flame", { svgOrigin: "252 184" });
      gsap.set("#k-sweat", { svgOrigin: "262 92", opacity: 0, scale: 0 });
      gsap.set("#k-btn", { scale: 0, opacity: 0, transformOrigin: "50% 100%" }); gsap.set("#k-bcap", { svgOrigin: "75 90" });
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
// GAG 1 (chaos): Klotz wants to help and presses A twice, then three chat bubbles shove him away (they stop short of him)
kJs += `      // GAG: Klotz presses "A" ...
      tl.to("#k-btn", { scale: 1, opacity: 1, duration: 0.22, ease: "back.out(2.4)" }, ${f2(A0 + 0.02)});
      tl.to("#k-wrap", { rotation: -8, x: -10, duration: 0.15, ease: "power2.out" }, ${f2(A0 + 0.1)});
      tl.to("#k-bcap", { keyframes: { y: [0, 14, 0] }, duration: 0.18, ease: "power1.inOut", repeat: 1, repeatDelay: 0.1 }, ${f2(A0 + 0.16)});
      tl.to("#k-armL", { keyframes: { rotation: [80, 92, 80] }, duration: 0.18, ease: "power1.inOut", repeat: 1, repeatDelay: 0.1 }, ${f2(A0 + 0.16)});
      // ... and gets shoved by the chat: every bubble that arrives pushes him a bit further to the right
${CHAOS_HITS.map((h, i) => `      tl.to("#k-wrap", { x: ${24 + i * 22}, rotation: ${6 + i * 4}, duration: 0.12, ease: "power2.out" }, ${f2(A0 + h)});
      tl.to("#k-wrap", { x: ${14 + i * 22}, rotation: ${2 + i * 3}, duration: 0.12, ease: "sine.inOut" }, ${f2(A0 + h + 0.12)});`).join("\n")}
      tl.to("#k-sweat", { opacity: 1, scale: 1, duration: 0.2, ease: "back.out(2)" }, ${f2(A0 + CHAOS_HITS[0])});
      tl.to("#k-sweat", { keyframes: { y: [0, 30] }, duration: 0.5, ease: "power1.in", repeat: 1 }, ${f2(A0 + CHAOS_HITS[0] + 0.2)});
      tl.to("#k-sweat", { opacity: 0, scale: 0, duration: 0.15 }, ${f2(C.c07[1] - 0.25)});
      tl.to("#k-btn", { scale: 0, opacity: 0, duration: 0.18, ease: "back.in(2)" }, ${f2(C.c07[1] - 0.25)});
      tl.to("#k-wrap", { x: 0, rotation: 0, duration: 0.25, ease: "back.out(1.6)" }, ${f2(C.c07[1] - 0.2)});
      // GAG 2 (cult): Klotz kneels before the holy fossil with a candle and bows
      tl.to("#k-cand", { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(2)" }, ${f2(KN[0])});
      tl.to("#k-cand", { rotation: 20, duration: 0.25 }, ${f2(KN[0] + 0.1)});
      tl.to("#k-wrap", { y: 26, rotation: -10, duration: 0.3, ease: "back.out(1.6)" }, ${f2(KN[0])});
      tl.to("#k-sq", { scaleY: 0.9, duration: 0.3 }, ${f2(KN[0] + 0.3)});
      tl.to("#k-wrap", { keyframes: { rotation: [-10, -18, -10] }, duration: 0.6, ease: "sine.inOut", repeat: ${Math.floor((KN[1] - KN[0] - 0.8) / 0.6) - 1} }, ${f2(KN[0] + 0.35)});
      tl.to("#k-flame", { keyframes: { scaleY: [1, 1.18, 0.9, 1], skewX: [0, 6, -5, 0] }, duration: 0.5, ease: "none", repeat: ${Math.floor((KN[1] - KN[0]) / 0.5) - 1} }, ${f2(KN[0])});
      tl.to("#k-sq", { scaleY: 1, duration: 0.2 }, ${f2(KN[1])});
      tl.to("#k-wrap", { y: 0, rotation: 0, duration: 0.2, ease: "back.out(1.6)" }, ${f2(KN[1])});
      tl.to("#k-cand", { opacity: 0, scale: 0, rotation: 0, duration: 0.15 }, ${f2(KN[1])});
      // waage: the eyes follow the swinging pointer
      tl.to(["#k-pupL", "#k-pupR"], { keyframes: { x: [-14, 14, -14, 14, -14, 14, -14, 0] }, duration: 2.2, ease: "sine.inOut" }, ${f2(C.c09b[0] + 0.15)});
      // kalender: the eyes follow the pages
      tl.to(["#k-pupL", "#k-pupR"], { keyframes: { y: [-10, 6, -10, 6, -10] }, duration: 0.84, ease: "none" }, ${f2(C.c13[0] + 0.42)});
      // finale: cheering jump
      tl.to("#k-wrap", { keyframes: { y: [0, -30, 0, -20, 0] }, duration: 0.7, ease: "none" }, ${f2(C.c14[0] + 0.85)});
      // frage: a single one-eye wink (the other eye stays open)
      tl.to("#k-lidR", { scaleY: 1, duration: 0.1, yoyo: true, repeat: 1, ease: "power1.inOut" }, ${WINK});
      tl.to("#k-browR", { y: 0, duration: 0.1, yoyo: true, repeat: 1 }, ${WINK});
      // loop (${LOOPK}): frame-0 shock pose with the jump
      tl.to("#k-wrap", { keyframes: { y: [0, -22, 0] }, duration: 0.3, ease: "none" }, ${f2(LOOPK + 0.05)});
`;
fs.writeFileSync(path.join(OUT, "compositions", "klotz.html"), `<template>
  <style>
    ${FONTFACE}
    #root { position: absolute; inset: 0; pointer-events: none; }
    #k-pod { position: absolute; left: 640px; top: 1748px; width: 380px; height: 120px; }
    #k-wrap { position: absolute; left: 700px; top: 1480px; width: 260px; height: 286px; transform-origin: 50% 100%; }
    #k-bob, #k-sq { position: absolute; inset: 0; transform-origin: 50% 100%; }
    #k-btn { position: absolute; left: 540px; top: 1640px; width: 150px; height: 130px; }
  </style>
  <div id="root" data-composition-id="klotz" data-width="1080" data-height="1920" data-layout-allow-overflow>
    <div id="k-pod"><svg viewBox="0 0 380 120" width="100%" height="100%" overflow="visible"><rect x="10" y="10" width="360" height="104" rx="14" fill="${NAVY}" stroke="${K}" stroke-width="8"/><rect x="10" y="10" width="360" height="26" rx="10" fill="${TEAL}" stroke="${K}" stroke-width="6"/>${[0, 1, 2, 3, 4].map((i) => `<rect x="${52 + i * 60}" y="58" width="36" height="36" fill="${[YEL, MINT, PINK, "#9FD3FF", YEL][i]}" stroke="${K}" stroke-width="5"/>`).join("")}</svg></div>
    <div id="k-btn">${kBtn}</div>
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
const c = (id) => C[id][0];
const sfx = [
  [0.0, "impact", 0.6], [0.0, "chatter", 0.5], [0.05, "blip1", 0.4], [0.3, "boing", 0.35], [0.6, "blip2", 0.35], [0.95, "blip1", 0.35], [1.25, "blip3", 0.35],
  [c("c02"), "whoosh1", 0.4], [c("c02") + 0.3, "pop1", 0.4], [c("c02") + 0.5, "bonk", 0.45], [c("c02") + 0.85, "bonk", 0.4], [c("c02") + 1.2, "bonk", 0.45], [c("c02") + 1.55, "bonk", 0.4],
  [c("c03"), "whoosh2", 0.4], [c("c03") + 0.1, "chatter", 0.45], [c("c03") + 0.25, "pop2", 0.35], [c("c03") + 1.3, "chatter", 0.4], [c("c03") + 2.2, "blip2", 0.3],
  [c("c04"), "whoosh1", 0.35], [c("c04") + 0.05, "pop1", 0.4], [c("c04") + 0.5, "pop2", 0.4], [c("c04") + 0.95, "pop1", 0.4], [c("c04") + 1.0, "blip1", 0.45], [c("c04") + 1.5, "jump", 0.45], [c("c04") + 2.0, "blip3", 0.45], [c("c04") + 2.2, "chatter", 0.35],
  [c("c05"), "whoosh2", 0.4], [c("c05") + 0.1, "steps", 0.45], [c("c05") + 0.75, "pop2", 0.4], [c("c05") + 1.45, "spin", 0.4], [c("c05") + 1.95, "pop1", 0.3],
  [c("c06"), "whoosh1", 0.35], [c("c06") + 0.3, "blip2", 0.45], [c("c06") + 0.65, "blip1", 0.45], [c("c06") + 1.0, "blip2", 0.45], [c("c06") + 1.3, "menu", 0.45], [c("c06") + 1.82, "menu", 0.45], [c("c06") + 2.05, "blip1", 0.35],
  [c("c07"), "whoosh2", 0.4], [c("c07"), "chatter", 0.5], [c("c07") + 0.16, "click", 0.55], [c("c07") + 0.44, "click", 0.55], [c("c07") + 0.6, "bonk", 0.5], [c("c07") + 0.85, "bonk", 0.5], [c("c07") + 1.1, "bonk", 0.55], [c("c07") + 1.15, "boing", 0.35],
  [c("c08"), "whoosh1", 0.35], [c("c08") + 0.1, "creak", 0.45], [c("c08") + 0.25, "pop1", 0.35], [c("c08") + 1.1, "creak", 0.4],
  [c("c09"), "pop1", 0.4], [c("c09") + 0.5, "tick", 0.4], [c("c09b"), "tick", 0.45], [c("c09b") + 0.33, "tick", 0.45], [c("c09b") + 0.66, "tick", 0.45], [c("c09b") + 1.0, "tick", 0.45], [c("c09b") + 1.33, "tick", 0.45], [c("c09b") + 1.66, "tick", 0.4], [c("c09b") + 0.2, "chatter", 0.35],
  [c("c10"), "whoosh2", 0.4], [c("c10") + 0.3, "blip2", 0.4], [c("c10") + 0.6, "blip2", 0.4], [c("c10") + 0.9, "sparkle", 0.45], [c("c10") + 1.0, "ding", 0.35],
  [c("c11") + 0.1, "blip1", 0.4], [c("c11") + 0.42, "select", 0.45], [c("c11") + 0.74, "blip1", 0.4], [c("c11") + 1.06, "select", 0.45], [c("c11") + 1.38, "blip1", 0.4], [c("c11") + 1.7, "select", 0.5],
  [c("c12"), "choir", 0.5], [c("c12") + 0.1, "pop1", 0.3], [c("c12") + 0.5, "sparkle", 0.4], [c("c12") + 1.4, "chime", 0.35],
  [c("c13"), "whoosh1", 0.35], [c("c13") + 0.42, "riffle", 0.55], [c("c13") + 1.34, "ding", 0.5],
  [c("c14"), "impact", 0.65], [c("c14") + 0.3, "fanfare", 0.55], [c("c14") + 0.35, "confetti", 0.45], [c("c14") + 0.6, "sparkle", 0.4],
  [c("c15"), "whoosh2", 0.4], [c("c15") + 0.05, "shing", 0.45], [c("c15") + 0.4, "sparkle", 0.45], [c("c15") + 0.3, "jump", 0.3], [c("c15") + 1.3, "jump", 0.3],
  [c("c16"), "pop1", 0.4], [c("c16") + 0.1, "pop2", 0.4], [c("c16") + 0.7, "click", 0.5], [c("c16") + 1.25, "click", 0.5], [c("c16") + 1.5, "ping", 0.35], [c("c16") + 1.8, "click", 0.5],
  [LOOPK - 0.2, "whoosh2", 0.4], [LOOPK - 0.15, "chatter", 0.4],
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
      <audio id="music-chip" class="clip" src="assets/sfx/chiptune.wav" data-start="0" data-duration="${DUR}" data-track-index="5" data-volume="0.4"></audio>
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
console.log("written", scenes.length, "scenes,", sfx.length, "sfx, lanes", lanes.length, "DUR", DUR, "cuts", scenes.slice(1).map((s) => s.start).join(","));
