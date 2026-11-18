// Generator for Folge 2 "Corrupted Blood": writes index.html and compositions/*.html
// Usage: node tools/gen.mjs <project_dir>
import fs from "node:fs";
import path from "node:path";

const OUT = process.argv[2];
export const DUR = 38.6;
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
const R = mulberry32(2005);
const r = (a, b) => +(a + (b - a) * R()).toFixed(2);

// ================= pixel sprites (own designs) =================
const K = "#0A0F22";
function sprite(rows, pal) {
  const w = Math.max(...rows.map((x) => x.length)), h = rows.length;
  let rects = "";
  rows.forEach((row, y) => {
    row = row.padEnd(w, ".");
    let x = 0;
    while (x < w) {
      const c = row[x];
      if (c === "." || c === " ") { x++; continue; }
      let x2 = x;
      while (x2 < w && row[x2] === c) x2++;
      if (!pal[c]) throw new Error("no colour for " + c);
      rects += `<rect x="${x}" y="${y}" width="${x2 - x + 0.03}" height="1.03" fill="${pal[c]}"/>`;
      x = x2;
    }
  });
  return { w, h, rects };
}
const HERO_ROWS = [
  "..kkkk..",
  ".khhhhk.",
  "khhhhhhk",
  "kssssssk",
  "kskssksk",
  "kssssssk",
  ".kbbbbk.",
  "kbbbbbbk",
  "ksbbbbsk",
  ".kbbbbk.",
  ".kl..lk.",
  ".kk..kk.",
];
const HEROES = [
  { h: "#8B5A2B", b: "#4FC3F7" }, { h: "#FFD23F", b: "#3FAE6A" }, { h: "#2A2A2A", b: "#B76CFF" },
  { h: "#FF7A1A", b: "#FF5A9E" }, { h: "#E8EDF3", b: "#FF9A3C" },
];
const SPR = {};
HEROES.forEach((c, i) => { SPR["hero" + i] = sprite(HERO_ROWS, { k: K, h: c.h, s: "#F2C29B", b: c.b, l: "#3B4552" }); });
// simple human icon for the split screen (not pixel)
SPR.drop = sprite([
  "...k...",
  "..kRk..",
  ".kRRRk.",
  ".kRRRk.",
  "kRWRRRk",
  "kRWRRRk",
  "kRRRRDk",
  ".kRRDk.",
  "..kkk..",
], { k: K, R: "#FF3B3B", W: "#FFB3B3", D: "#B01E2E" });
SPR.boss = sprite([
  "..y...y..y...y..",
  "..yy.yyyyyy.yy..",
  "..yyyyyyyyyyyy..",
  "..yryyygyyyryy..",
  "..kkkkkkkkkkkk..",
  ".kppppppppppppk.",
  ".kpEEppppppEEpk.",
  ".kpEkppppppkEpk.",
  ".kppppppppppppk.",
  ".kppkwkwwkwkppk.",
  ".kpppkkkkkkpppk.",
  "kkppppppppppppkk",
  "kppkppppppppkppk",
  "kppkppppppppkppk",
  ".kkkppkkkkppkkk.",
  "...kppk..kppk...",
  "...kkkk..kkkk...",
], { k: K, y: "#FFD23F", r: "#FF3B3B", g: "#3FE07A", p: "#7A3FC9", E: "#FF3B3B", w: "#FFFFFF" });
SPR.wolf = sprite([
  "............k.k...",
  "kk.........kgkgk..",
  "kgk........kggggk.",
  ".kgk......kggwkggk",
  "..kgkkkkkkggggggggk",
  "..kggggggggggggkkkk",
  "..kgggggggggggggk",
  "..kgGkkkkkkkGgk",
  "..kgk......kgk",
  "..kkk......kkk",
], { k: K, g: "#9AA6B4", G: "#6B7684", w: "#FFD23F" });
SPR.gate = sprite([
  "k.kk.kk.kk.kk.kk.k",
  "kkkkkkkkkkkkkkkkkk",
  "kssSssSssSssSssSsk",
  "kssssssssssssssssk",
  "kSsskkkkkkkkkksSsk",
  "kssk..........kssk",
  "kssk..........kssk",
  "kSsk..........kSsk",
  "kssk..........kssk",
  "kssk..........kssk",
  "kSsk..........kSsk",
  "kssk..........kssk",
  "kkkk..........kkkk",
], { k: K, s: "#A8B3C2", S: "#6B7684" });
const HOUSE_ROWS = [
  ".....kk.....",
  "....kRRk....",
  "...kRRRRk...",
  "..kRRRRRRk..",
  ".kRRRRRRRRk.",
  "kRRRRRRRRRRk",
  "kkwwwwwwwwkk",
  ".kwyywwyywk.",
  ".kwyywwyywk.",
  ".kwwwddwwwk.",
  ".kwwwddwwwk.",
  ".kkkkkkkkkk.",
];
["#FF3B3B", "#4FC3F7", "#3FAE6A", "#B76CFF"].forEach((c, i) => { SPR["house" + i] = sprite(HOUSE_ROWS, { k: K, R: c, w: "#F5E6C8", y: "#FFD23F", d: "#8B5A2B" }); });
SPR.grave = sprite([
  "..kkkk..",
  ".kggggk.",
  "kgggkggk",
  "kggkkkgk",
  "kgggkggk",
  "kgggkggk",
  "kggggggk",
  "kGGGGGGk",
  "kkkkkkkk",
], { k: K, g: "#C9D3E0", G: "#8A96A6" });
SPR.healer = sprite([
  "..kkkk....kk.",
  ".kwwwwk..kGGk",
  "kwwwwwwk.kGGk",
  "kssssssk..kk.",
  "kskssksk..b..",
  "kssssssk..b..",
  ".kwwwwk...b..",
  "kwwywwwkkbb..",
  "kswwwwwskb...",
  ".kwwwwk..b...",
  ".kwwwwk..b...",
  ".kwwwwk..b...",
  ".kk..kk..b...",
], { k: K, w: "#E8F7FF", y: "#3FE07A", s: "#F2C29B", G: "#6BFF8A", b: "#8B5A2B" });
SPR.griefer = sprite([
  "..kkkk..",
  ".kppppk.",
  "kppppppk",
  "kpkkkkpk",
  "kpykkypk",
  "kpkkkkpk",
  "kpkwwwpk",
  "kppppppk",
  ".kppppk.",
  "kppppppk",
  "kppppppk",
  ".kpkkpk.",
  ".kk..kk.",
], { k: K, p: "#4B2A7A", y: "#FFD23F", w: "#FFFFFF" });
SPR.tree = sprite([
  "...kkkk...",
  "..kGGGGk..",
  ".kGGgGGGk.",
  "kGGGGGgGGk",
  "kGgGGGGGGk",
  "kGGGGGgGGk",
  ".kGGGGGGk.",
  "..kkkkkk..",
  "....kbk...",
  "....kbk...",
  "....kbk...",
  "...kkkkk..",
], { k: K, G: "#3FAE6A", g: "#7FE08F", b: "#8B5A2B" });
SPR.plus = sprite([
  "..kkk..",
  "..kGk..",
  "kkkGkkk",
  "kGGGGGk",
  "kkkGkkk",
  "..kGk..",
  "..kkk..",
], { k: K, G: "#3FE07A" });
SPR.heart = sprite([
  ".kk.kk.",
  "kRRkRRk",
  "kRWRRRk",
  "kRRRRRk",
  ".kRRRk.",
  "..kRk..",
  "...k...",
], { k: K, R: "#FF3B3B", W: "#FFFFFF" });
SPR.castle = sprite([
  "k.k.k........k.k.k",
  "kkkkk...k.k..kkkkk",
  "kgggk..kkkkk.kgggk",
  "kgkgk..kgRgk.kgkgk",
  "kgggk..kgggk.kgggk",
  "kgggkkkkgggkkkgggk",
  "kggggggggggggggggk",
  "kgkggggkkkkggggkgk",
  "kggggggkoookgggggk",
  "kggggggkoookgggggk",
  "kkkkkkkkkkkkkkkkkk",
], { k: K, g: "#C9D3E0", R: "#FF3B3B", o: "#2B1A10" });
SPR.mount = sprite([
  "..........kk..........",
  ".........kwwk.........",
  "........kwwwwk........",
  ".......kmwwmmmk...kk..",
  "......kmmmmmmmmk.kmmk.",
  ".....kmmmmmmmmmmkmmmmk",
  "....kmmmmmmmmmmmmmmmmmk",
  "...kmmmmmmmmmmmmmmmmmmmk",
], { k: "#1B2550", w: "#FFFFFF", m: "#5B6FB0" });
SPR.cursor = sprite([
  "k.......",
  "kk......",
  "kwk.....",
  "kwwk....",
  "kwwwk...",
  "kwwwwk..",
  "kwwwwwk.",
  "kwwwwwwk",
  "kwwwkkkk",
  "kwkwk...",
  "kk.kwk..",
  "....kwk.",
  ".....k..",
], { k: K, w: "#FFFFFF" });
SPR.cloud = sprite([
  "...wwww.....",
  ".wwwwwwww...",
  "wwwwwwwwwwww",
  ".wwwwwwwwww.",
], { w: "#E8EDF3" });

const sym = (p, name) => { const s = SPR[name]; return `<symbol id="${p}-${name}" viewBox="0 0 ${s.w} ${s.h}" shape-rendering="crispEdges">${s.rects}</symbol>`; };
const syms = (p, names) => names.map((n) => sym(p, n)).join("");
const pxSvg = (p, name, sc, flip) => { const s = SPR[name]; return `<svg viewBox="0 0 ${s.w} ${s.h}" width="${s.w * sc}" height="${s.h * sc}" overflow="visible" shape-rendering="crispEdges" style="display:block;${flip ? "transform:scaleX(-1);" : ""}"><use href="#${p}-${name}"/></svg>`; };
// positioned pixel element: id, sprite, scale, x, y
const px = (id, p, name, sc, x, y, extra = "", cls = "", flip = false) => { const s = SPR[name]; return `<div id="${id}" class="pxe ${cls}" style="left:${Math.round(x)}px;top:${Math.round(y)}px;width:${s.w * sc}px;height:${s.h * sc}px;${extra}">${pxSvg(p, name, sc, flip)}</div>`; };
const pxW = (name, sc) => SPR[name].w * sc, pxH = (name, sc) => SPR[name].h * sc;

// ================= vector drawings =================
// green virus blob with spikes and an angry face (own design)
const BLOB = (() => {
  const cx = 200, cy = 200;
  let spikes = "", knobs = "";
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 + 0.13;
    const x1 = cx + Math.cos(a) * 110, y1 = cy + Math.sin(a) * 110, x2 = cx + Math.cos(a) * 168, y2 = cy + Math.sin(a) * 168;
    spikes += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
    knobs += `<circle cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" r="21"/>`;
  }
  const pts = [];
  const RB = mulberry32(77);
  for (let i = 0; i < 18; i++) { const a = (i / 18) * Math.PI * 2; const rr = 128 + (RB() - 0.5) * 18; pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); }
  let d = "";
  for (let i = 0; i < pts.length; i++) {
    const p0 = pts[i], p1 = pts[(i + 1) % pts.length];
    const mx = (p0[0] + p1[0]) / 2, my = (p0[1] + p1[1]) / 2;
    if (i === 0) d += `M${((pts[pts.length - 1][0] + p0[0]) / 2).toFixed(1)} ${((pts[pts.length - 1][1] + p0[1]) / 2).toFixed(1)} `;
    d += `Q${p0[0].toFixed(1)} ${p0[1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)} `;
  }
  return `<svg viewBox="0 0 400 400" width="100%" height="100%" overflow="visible">
    <g stroke="${K}" stroke-width="30" stroke-linecap="round">${spikes}</g>
    <g stroke="#3FAE6A" stroke-width="16" stroke-linecap="round">${spikes}</g>
    <g fill="#9BFF7A" stroke="${K}" stroke-width="6">${knobs}</g>
    <path d="${d}Z" fill="#5BE36A" stroke="${K}" stroke-width="9"/>
    <g fill="#3FAE6A"><circle cx="128" cy="262" r="20"/><circle cx="292" cy="138" r="15"/><circle cx="276" cy="276" r="12"/><circle cx="116" cy="150" r="10"/></g>
    <ellipse cx="150" cy="118" rx="44" ry="20" fill="#fff" opacity=".35" transform="rotate(-30 150 118)"/>
    <ellipse cx="160" cy="196" rx="34" ry="38" fill="#fff" stroke="${K}" stroke-width="6"/><ellipse cx="240" cy="196" rx="34" ry="38" fill="#fff" stroke="${K}" stroke-width="6"/>
    <circle cx="170" cy="206" r="15" fill="${K}"/><circle cx="230" cy="206" r="15" fill="${K}"/>
    <path d="M118 154 L196 178" stroke="${K}" stroke-width="16" stroke-linecap="round"/><path d="M282 154 L204 178" stroke="${K}" stroke-width="16" stroke-linecap="round"/>
    <path d="M150 262 Q200 300 250 262 Q200 276 150 262 Z" fill="${K}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
    <path d="M170 268 L178 282 L186 270 M214 270 L222 282 L230 268" fill="#fff"/>
  </svg>`;
})();

// retro CRT monitor body (screen area is left empty, HTML sits on top): 740 x 560
const MONITOR_SVG = `<svg viewBox="0 0 740 560" width="100%" height="100%" overflow="visible">
  <rect x="290" y="462" width="160" height="56" fill="#C9BB9A" stroke="${K}" stroke-width="7"/>
  <rect x="190" y="506" width="360" height="50" rx="18" fill="#E8DCC0" stroke="${K}" stroke-width="7"/>
  <rect x="4" y="4" width="732" height="466" rx="46" fill="#E8DCC0" stroke="${K}" stroke-width="8"/>
  <rect x="34" y="32" width="672" height="410" rx="32" fill="#C9BB9A"/>
  <path d="M40 60 Q40 36 70 36 L300 36" stroke="#F7F0DE" stroke-width="8" fill="none" stroke-linecap="round"/>
  <g fill="#B3A580"><rect x="80" y="450" width="60" height="8" rx="4"/><rect x="160" y="450" width="60" height="8" rx="4"/></g>
  <circle cx="650" cy="452" r="9" fill="#3FE07A" stroke="${K}" stroke-width="4"/>
</svg>`;

// ---------- common CSS ----------
const STK = `filter: drop-shadow(5px 0 0 #fff) drop-shadow(-5px 0 0 #fff) drop-shadow(0 5px 0 #fff) drop-shadow(0 -5px 0 #fff) drop-shadow(0 14px 0 rgba(0,0,0,.35));`;
const FONTFACE = `@font-face{font-family:'Lilita One';src:url('assets/fonts/LilitaOne-latin.woff2') format('woff2');font-weight:400;font-style:normal;font-display:block;}`;
const LABEL = `font-family:'Lilita One';color:#FFD23F;-webkit-text-stroke:14px ${K};paint-order:stroke fill;text-shadow:0 8px 0 #050814;`;
const abs = (l, t, w, h) => `position:absolute;left:${l}px;top:${t}px;width:${w}px;${h != null ? `height:${h}px;` : ""}`;

function scene(id, title, start, dur, css, body, js, defs = "", opts = {}) {
  const exit = opts.exit !== false, kb = opts.kb !== false, exDur = opts.exitDur || 0.28;
  const html = `<template>
  <style>
    ${FONTFACE}
    #root { position: absolute; inset: 0; overflow: hidden; }
    #${id}-out, #${id}-kb { position: absolute; inset: 0; transform-origin: 540px 1080px; }
    .${id}-stk { ${STK} }
    .pxe { position: absolute; }
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
${kb ? `      // slow Ken-Burns drift so the frame never stands still
      tl.fromTo("#${id}-kb", { scale: 1 }, { scale: 1.05, duration: ${dur}, ease: "none" }, 0);` : ""}
${js}
${exit ? `      // overlap exit: fades while the next scene is already entering (no empty frames)
      tl.to("#${id}-out", { opacity: 0, scale: 0.93, duration: ${exDur}, ease: "power2.in" }, ${dur});` : ""}
      window.__timelines["${id}"] = tl;
    })();
  </script>
</template>
`;
  fs.writeFileSync(path.join(OUT, "compositions", `${id}.html`), html);
  return { id, title, start, dur, host: +(dur + (exit ? 0.3 : 0)).toFixed(2) };
}
const shake = (sel, at, a = 18, d = 0.32) => `      tl.to("${sel}", { keyframes: { x: [0, ${-a}, ${+(a * 0.8).toFixed(1)}, ${+(-a * 0.5).toFixed(1)}, ${+(a * 0.3).toFixed(1)}, 0], y: [0, ${+(a * 0.5).toFixed(1)}, ${+(-a * 0.4).toFixed(1)}, ${+(a * 0.2).toFixed(1)}, 0, 0] }, duration: ${d}, ease: "none" }, ${at});`;

const scenes = [];

// ================= HOOK picture (frame 0 = thumbnail motif) =================
// monitor 740x560 at (170, 960); screen 620x360 at (230, 1015); blob 400x400 centred at (540, 880)
const hookCss = (p) => `
   #${p}-glow{${abs(90, 430, 900, 900)}border-radius:50%;background:radial-gradient(circle,rgba(91,227,106,.55) 0%,rgba(91,227,106,.18) 40%,rgba(91,227,106,0) 68%);}
   #${p}-mon{${abs(170, 960, 740, 560)}}
   #${p}-scr{${abs(230, 1015, 620, 360)}border-radius:30px;overflow:hidden;background:linear-gradient(#123A2A,#0B2219);border:6px solid ${K};}
   #${p}-scr .gr{position:absolute;left:0;right:0;bottom:0;height:70px;background:repeating-linear-gradient(90deg,#2E8B4A 0 30px,#3FAE6A 30px 60px);border-top:6px solid ${K};}
   #${p}-scr .scan{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.22) 0 3px,rgba(0,0,0,0) 3px 7px);}
   #${p}-scr .glare{position:absolute;left:-60px;top:-120px;width:420px;height:260px;border-radius:50%;background:rgba(255,255,255,.08);transform:rotate(-18deg);}
   #${p}-blob{${abs(345, 715, 390, 390)}}
   .${p}-sq{position:absolute;width:22px;height:22px;background:#7CF08A;border:4px solid ${K};}`;
const hookFig = [[40, 218, 0], [150, 218, 1], [270, 218, 2], [390, 218, 3], [500, 218, 4]];
const hookSq = [[150, 760], [890, 720], [110, 990], [930, 1000], [250, 640], [820, 600]];
const hookBody = (p) => `      <div id="${p}-glow"></div>
      <div id="${p}-monw">
      <div id="${p}-mon" class="${p}-stk">${MONITOR_SVG}</div>
      <div id="${p}-scr"><div class="gr"></div>
${hookFig.map(([x, y, i], k) => "        " + px(`${p}-f${k}`, p, "hero" + i, 6, x, y)).join("\n")}
${[0, 2, 4].map((k) => "        " + px(`${p}-fd${k}`, p, "drop", 4, hookFig[k][0] + 10, 168)).join("\n")}
        <div class="scan"></div><div class="glare"></div></div>
      </div>
${hookSq.map(([x, y], i) => `      <div id="${p}-sq${i}" class="${p}-sq" style="left:${x}px;top:${y}px;"></div>`).join("\n")}
      <div id="${p}-blob">${BLOB}</div>`;
const hookDefs = (p) => syms(p, ["hero0", "hero1", "hero2", "hero3", "hero4", "drop"]);

scenes.push(scene("hook", "Hook: Seuche", 0, 2.6, hookCss("hook"), hookBody("hook"),
  `      // frame 0 already shows everything (thumbnail picture)
      tl.to("#hook-blob", { keyframes: { scaleX: [1, 1.06, 0.97, 1.03, 1], scaleY: [1, 0.95, 1.04, 0.98, 1], rotation: [0, -4, 3, -2, 0] }, duration: 1.2, ease: "sine.inOut" }, 0.05);
      tl.to("#hook-blob", { y: -16, duration: 0.3, yoyo: true, repeat: 3, ease: "sine.inOut" }, 1.25);
      tl.to("#hook-kb", { keyframes: { x: [0, -20, 16, -12, 8, -4, 0], y: [0, 8, -6, 4, -2, 0, 0] }, duration: 0.42, ease: "none" }, 0.28);
      tl.to("#hook-glow", { scale: 1.12, opacity: 0.8, duration: 0.6, yoyo: true, repeat: 3, ease: "sine.inOut" }, 0);
      ${JSON.stringify(hookSq.map((_, i) => i))}.forEach((i) => tl.to("#hook-sq" + i, { y: (i % 2 ? -26 : 22), rotation: (i % 2 ? 20 : -15), duration: 0.65, yoyo: true, repeat: 3, ease: "sine.inOut" }, 0.02 * i));
      [0, 1, 2, 3, 4].forEach((k) => tl.to("#hook-f" + k, { y: -14, duration: 0.16, yoyo: true, repeat: 7, ease: "sine.inOut" }, 0.05 + k * 0.05));
      [0, 2, 4].forEach((k, j) => tl.fromTo("#hook-fd" + k, { scale: 1 }, { scale: 1.35, duration: 0.2, yoyo: true, repeat: 3, ease: "sine.inOut" }, 0.4 + j * 0.12));`,
  hookDefs("hook")));

// ================= S02 zoom into the monitor (2.6 - 4.6) =================
scenes.push(scene("zoom", "Zoom in den Monitor", 2.6, 2.0, hookCss("zoom") + `#zoom-monw{position:absolute;inset:0;transform-origin:540px 1195px;}`, hookBody("zoom"),
  `      tl.to("#zoom-blob", { y: -900, rotation: 40, scale: 0.6, duration: 0.45, ease: "power3.in" }, 0.05);
      tl.to("#zoom-glow", { opacity: 0, duration: 0.3 }, 0.05);
      tl.to(".zoom-sq", { opacity: 0, scale: 0, duration: 0.25, stagger: 0.03 }, 0.0);
      tl.fromTo("#zoom-monw", { scale: 1 }, { scale: 4.4, duration: 1.45, ease: "power2.inOut" }, 0.35);
      [0, 1, 2, 3, 4].forEach((k) => tl.to("#zoom-f" + k, { x: 26, duration: 0.25, yoyo: true, repeat: 5, ease: "sine.inOut" }, 0.1 + k * 0.04));`,
  hookDefs("zoom"), { kb: false }));

// ================= S03 the online game world (4.6 - 6.6) =================
{
  const p = "welt";
  scenes.push(scene(p, "Online-Spiel", 4.6, 2.0,
    `#welt-frame{${abs(80, 700, 920, 640)}border-radius:34px;overflow:hidden;border:12px solid ${K};background:linear-gradient(#2B3C8F 0 25%,#3F55B5 25% 45%,#5B73D6 45% 62%,#7C93E8 62% 100%);}
     #welt-sun{position:absolute;left:700px;top:60px;width:96px;height:96px;background:#FFD23F;box-shadow:0 0 0 12px rgba(255,210,63,.35);}
     #welt-ground{position:absolute;left:0;right:0;top:470px;bottom:0;background:repeating-linear-gradient(90deg,#3FAE6A 0 40px,#2E8B4A 40px 80px);border-top:10px solid ${K};}
     #welt-path{position:absolute;left:0;right:0;top:530px;height:40px;background:repeating-linear-gradient(90deg,#C99A5A 0 40px,#B5854A 40px 80px);}
     #welt-tag{${abs(140, 1360, 800, 96)}display:flex;align-items:center;justify-content:center;border-radius:48px;background:${K};border:6px solid #FFD23F;font-family:'Inter';font-weight:900;font-size:72px;color:#fff;letter-spacing:-.01em;}
     #welt-scan{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.12) 0 3px,rgba(0,0,0,0) 3px 8px);}`,
    `      <div id="welt-frame" class="welt-stk">
        <div id="welt-sun"></div>
        ${px("welt-c0", p, "cloud", 10, 60, 70)}${px("welt-c1", p, "cloud", 8, 430, 140)}
        ${px("welt-m0", p, "mount", 18, -60, 326)}${px("welt-m1", p, "mount", 14, 470, 358)}
        ${px("welt-castle", p, "castle", 16, 520, 290)}
        <div id="welt-ground"></div><div id="welt-path"></div>
        ${px("welt-t0", p, "tree", 9, 30, 380)}${px("welt-t1", p, "tree", 9, 790, 380)}
        ${[0, 1, 2].map((i) => px("welt-h" + i, p, "hero" + i, 8, 120 + i * 120, 440)).join("")}
        <div id="welt-scan"></div>
      </div>
      <div id="welt-tag">World of Warcraft</div>`,
    `      tl.fromTo("#welt-frame", { scale: 1.6, opacity: 0.2 }, { scale: 1, opacity: 1, duration: 0.45, ease: "power3.out" }, 0);
      tl.fromTo(["#welt-m0", "#welt-m1"], { y: 160 }, { y: 0, duration: 0.4, ease: "back.out(1.6)", stagger: 0.08 }, 0.15);
      tl.fromTo("#welt-castle", { y: 220, scale: 0.6 }, { y: 0, scale: 1, duration: 0.45, ease: "back.out(1.8)", transformOrigin: "50% 100%" }, 0.3);
      tl.fromTo(["#welt-t0", "#welt-t1"], { scale: 0 }, { scale: 1, duration: 0.3, ease: "back.out(2.5)", stagger: 0.07, transformOrigin: "50% 100%" }, 0.4);
      tl.fromTo("#welt-c0", { x: -40 }, { x: 140, duration: 2.0, ease: "none" }, 0);
      tl.fromTo("#welt-c1", { x: 0 }, { x: 110, duration: 2.0, ease: "none" }, 0);
      tl.fromTo("#welt-sun", { rotation: 0 }, { rotation: 90, duration: 2.0, ease: "none" }, 0);
      [0, 1, 2].forEach((i) => {
        tl.fromTo("#welt-h" + i, { x: -420 }, { x: 0, duration: 0.7, ease: "power2.out" }, 0.35 + i * 0.1);
        tl.to("#welt-h" + i, { y: -16, duration: 0.12, yoyo: true, repeat: 9, ease: "sine.inOut" }, 0.35 + i * 0.1);
      });
      tl.fromTo("#welt-tag", { y: 140, opacity: 0, rotation: -4 }, { y: 0, opacity: 1, rotation: -2, duration: 0.3, ease: "back.out(2)" }, 0.3);`,
    syms(p, ["cloud", "mount", "castle", "tree", "hero0", "hero1", "hero2"])));
}

// ================= S04 boss shoots the curse (6.6 - 9.0) =================
{
  const p = "boss";
  const heroes = [[110, 1220], [330, 1250], [610, 1250], [840, 1220]];
  scenes.push(scene(p, "Boss", 6.6, 2.4,
    `#boss-aura{${abs(240, 640, 600, 600)}border-radius:50%;background:radial-gradient(circle,rgba(255,59,59,.45),rgba(255,59,59,0) 65%);}
     #boss-floor{${abs(60, 1360, 960, 40)}background:repeating-linear-gradient(90deg,#3B4552 0 40px,#2D3540 40px 80px);border:6px solid ${K};}`,
    `      <div id="boss-aura"></div>
      <div id="boss-floor"></div>
      ${px("boss-b", p, "boss", 21, 540 - pxW("boss", 21) / 2, 700, "", "boss-stk")}
${heroes.map(([x, y], i) => "      " + px("boss-h" + i, p, "hero" + i, 9, x, y, "", "boss-stk")).join("\n")}
${heroes.map(([x, y], i) => "      " + px("boss-d" + i, p, "drop", 9, 508, 920)).join("\n")}`,
    `      tl.fromTo("#boss-b", { y: -700 }, { y: 0, duration: 0.35, ease: "power3.in" }, 0);
      tl.fromTo("#boss-b", { scaleY: 0.75, scaleX: 1.2 }, { scaleY: 1, scaleX: 1, duration: 0.4, ease: "elastic.out(1,0.4)", transformOrigin: "50% 100%", immediateRender: false }, 0.35);
${shake("#boss-kb", 0.35, 20, 0.36)}
      tl.fromTo("#boss-aura", { scale: 0.5, opacity: 0 }, { scale: 1.1, opacity: 1, duration: 0.5, ease: "power2.out" }, 0.3);
      tl.to("#boss-aura", { scale: 0.9, duration: 0.3, yoyo: true, repeat: 4, ease: "sine.inOut" }, 0.8);
      tl.fromTo(["#boss-h0", "#boss-h1", "#boss-h2", "#boss-h3"], { y: 260 }, { y: 0, duration: 0.3, ease: "back.out(1.6)", stagger: 0.05 }, 0.15);
      ${JSON.stringify(heroes)}.forEach(([x, y], i) => {
        const t0 = 0.75 + i * 0.25;
        tl.to("#boss-b", { keyframes: { scaleY: [1, 0.92, 1.04, 1] }, duration: 0.22, ease: "none", transformOrigin: "50% 100%" }, t0 - 0.05);
        tl.fromTo("#boss-d" + i, { x: 0, y: 0, scale: 0.4, opacity: 1, rotation: 0 }, { keyframes: { x: [0, (x - 508) * 0.5, x - 508 + 9], y: [0, -180, y - 920 - 80] }, scale: 1, rotation: (i < 2 ? -180 : 180), duration: 0.42, ease: "power1.in", immediateRender: true }, t0);
        tl.to("#boss-d" + i, { rotation: 0, duration: 0.01 }, t0 + 0.42);
        tl.to("#boss-d" + i, { y: "-=24", duration: 0.2, yoyo: true, repeat: 3, ease: "sine.inOut" }, t0 + 0.45);
        tl.to("#boss-h" + i, { keyframes: { x: [0, -14, 12, -8, 0], rotation: [0, -10, 8, -4, 0] }, duration: 0.3, ease: "none" }, t0 + 0.42);
      });`,
    syms(p, ["boss", "hero0", "hero1", "hero2", "hero3", "drop"])));
}

// ================= S05 drop symbol, health bar, "nur hier!" arena (9.0 - 11.4) =================
{
  const p = "blut";
  scenes.push(scene(p, "Verdorbenes Blut", 9.0, 2.4,
    `#blut-arena{${abs(110, 760, 860, 650)}border-radius:30px;border:12px dashed #FFD23F;background:rgba(255,210,63,.07);}
     #blut-floor{${abs(122, 1250, 836, 148)}border-radius:0 0 20px 20px;background:repeating-linear-gradient(90deg,#3B4552 0 44px,#2D3540 44px 88px);}
     #blut-tag{${abs(130, 690, 380, 110)}display:flex;align-items:center;justify-content:center;background:#FF3B3B;border:7px solid ${K};border-radius:22px;font-family:'Lilita One';font-size:84px;color:#fff;-webkit-text-stroke:10px ${K};paint-order:stroke fill;}
     #blut-bar{${abs(330, 1290, 600, 70)}border:7px solid ${K};background:#1B2550;}
     #blut-fill{position:absolute;left:0;top:0;bottom:0;width:100%;background:repeating-linear-gradient(90deg,#3FE07A 0 44px,#2EBF62 44px 50px);transform-origin:0 50%;}
     #blut-red{position:absolute;inset:0;background:repeating-linear-gradient(90deg,#FF3B3B 0 44px,#D92B2B 44px 50px);opacity:0;}`,
    `      <div id="blut-arena"></div>
      <div id="blut-floor"></div>
      ${px("blut-drop", p, "drop", 22, 190, 850, "", "blut-stk")}
      ${px("blut-h", p, "hero1", 13, 620, 1000, "", "blut-stk")}
      ${px("blut-heart", p, "heart", 12, 220, 1280)}
      <div id="blut-bar"><div id="blut-fill"><div id="blut-red"></div></div></div>
${[0, 1, 2].map((i) => "      " + px("blut-s" + i, p, "drop", 6, 640 + i * 40, 980)).join("\n")}
      <div id="blut-tag">nur hier!</div>`,
    `      tl.fromTo("#blut-arena", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.8)" }, 0);
      tl.fromTo("#blut-drop", { scale: 0, rotation: -40 }, { scale: 1, rotation: 0, duration: 0.35, ease: "back.out(2.4)" }, 0.08);
      tl.to("#blut-drop", { y: -22, rotation: 6, duration: 0.3, yoyo: true, repeat: 5, ease: "sine.inOut" }, 0.45);
      tl.fromTo("#blut-h", { x: 500 }, { x: 0, duration: 0.35, ease: "back.out(1.4)" }, 0.12);
      tl.fromTo(["#blut-heart", "#blut-bar"], { scale: 0 }, { scale: 1, duration: 0.3, ease: "back.out(2)", stagger: 0.06 }, 0.25);
      tl.fromTo("#blut-fill", { scaleX: 1 }, { scaleX: 0.16, duration: 1.4, ease: "steps(7)" }, 0.45);
      tl.fromTo("#blut-red", { opacity: 0 }, { opacity: 1, duration: 0.2 }, 1.2);
      [0, 1, 2].forEach((i) => {
        tl.fromTo("#blut-s" + i, { y: 0, opacity: 1, scale: 0.5 }, { y: -170, x: (i - 1) * 70, opacity: 0, scale: 1.2, duration: 0.5, ease: "power2.out", immediateRender: false }, 0.5 + i * 0.4);
        tl.to("#blut-h", { keyframes: { x: [0, -12, 10, 0] }, duration: 0.2, ease: "none" }, 0.5 + i * 0.4);
      });
      tl.to("#blut-heart", { scale: 1.2, duration: 0.15, yoyo: true, repeat: 5, ease: "sine.inOut" }, 0.6);
      tl.fromTo("#blut-tag", { scale: 2.6, opacity: 0, rotation: -20 }, { scale: 1, opacity: 1, rotation: -6, duration: 0.2, ease: "power4.in" }, 0.55);
${shake("#blut-kb", 0.75, 12, 0.26)}
      tl.to("#blut-tag", { rotation: -2, duration: 0.6, yoyo: true, repeat: 1, ease: "sine.inOut" }, 1.0);`,
    syms(p, ["drop", "hero1", "heart"])));
}

// ================= S06 pets carry it out through the gate (11.4 - 13.8) =================
{
  const p = "tier";
  scenes.push(scene(p, "Haustiere", 11.4, 2.4,
    `#tier-arena{${abs(40, 860, 360, 520)}border-radius:26px;border:10px dashed #FFD23F;background:rgba(255,210,63,.07);}
     #tier-ground{${abs(0, 1290, 1080, 100)}background:repeating-linear-gradient(90deg,#3FAE6A 0 40px,#2E8B4A 40px 80px);border-top:8px solid ${K};}
     .tier-trail{position:absolute;top:1300px;}
     .tier-line{position:absolute;height:12px;border-radius:6px;background:#fff;opacity:0;}`,
    `      <div id="tier-arena"></div>
      <div id="tier-ground"></div>
      ${px("tier-owner", p, "hero2", 9, 90, 1180, "", "tier-stk")}
      ${px("tier-gate", p, "gate", 17, 400, 1070, "", "tier-stk")}
${[0, 1, 2, 3, 4, 5].map((i) => "      " + px("tier-t" + i, p, "drop", 5, 260 + i * 120, 1310, "", "tier-trail")).join("\n")}
      <div id="tier-wolfw" class="pxe" style="left:80px;top:1080px;width:${pxW("wolf", 11)}px;height:${pxH("wolf", 11) + 120}px;">
        ${px("tier-wd0", p, "drop", 6, 50, 0)}${px("tier-wd1", p, "drop", 6, 105, 10)}${px("tier-wd2", p, "drop", 6, 160, 0)}
        ${px("tier-wolf", p, "wolf", 11, 0, 100, "", "tier-stk")}
        <div id="tier-l0" class="tier-line" style="left:-120px;top:150px;width:90px;"></div><div id="tier-l1" class="tier-line" style="left:-160px;top:180px;width:120px;"></div>
      </div>`,
    `      tl.fromTo("#tier-arena", { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.8)" }, 0);
      tl.fromTo("#tier-gate", { y: 300, scale: 0.6 }, { y: 0, scale: 1, duration: 0.35, ease: "back.out(1.8)", transformOrigin: "50% 100%" }, 0.08);
      tl.fromTo("#tier-owner", { scale: 0 }, { scale: 1, duration: 0.3, ease: "back.out(2.4)", transformOrigin: "50% 100%" }, 0.12);
      tl.to("#tier-owner", { y: -18, duration: 0.15, yoyo: true, repeat: 7, ease: "sine.inOut" }, 0.5);
      tl.fromTo("#tier-wolfw", { x: 0 }, { x: 780, duration: 1.7, ease: "power1.inOut" }, 0.3);
      tl.to("#tier-wolf", { y: -20, rotation: -4, duration: 0.11, yoyo: true, repeat: 15, ease: "sine.inOut" }, 0.3);
      [0, 1, 2].forEach((i) => tl.to("#tier-wd" + i, { y: -18, duration: 0.13, yoyo: true, repeat: 13, ease: "sine.inOut" }, 0.3 + i * 0.05));
      tl.fromTo(["#tier-l0", "#tier-l1"], { opacity: 0, x: 40 }, { opacity: 0.8, x: 0, duration: 0.2, stagger: 0.05 }, 0.45);
      tl.to(["#tier-l0", "#tier-l1"], { opacity: 0, duration: 0.2 }, 1.8);
      [0, 1, 2, 3, 4, 5].forEach((i) => tl.fromTo("#tier-t" + i, { scale: 0 }, { scale: 1, duration: 0.2, ease: "back.out(3)" }, 0.55 + i * 0.2));`,
    syms(p, ["gate", "wolf", "drop", "hero2"])));
}

// ================= S07 the cities: drops hop figure to figure (13.8 - 15.8) =================
{
  const p = "stadt";
  const hx = [100, 250, 400, 550, 700, 850];
  scenes.push(scene(p, "Städte", 13.8, 2.0,
    `#stadt-road{${abs(0, 1330, 1080, 80)}background:#3B4552;border-top:8px solid ${K};}
     #stadt-road i{position:absolute;top:30px;width:70px;height:12px;background:#FFD23F;}`,
    `${[0, 1, 2, 3].map((i) => "      " + px("stadt-house" + i, p, "house" + i, 18, 30 + i * 260, 900 + (i % 2) * 40, "", "stadt-stk")).join("\n")}
      <div id="stadt-road">${[0, 1, 2, 3, 4, 5, 6].map((i) => `<i style="left:${40 + i * 150}px"></i>`).join("")}</div>
${hx.map((x, i) => "      " + px("stadt-h" + i, p, "hero" + (i % 5), 9, x, 1222, "", "stadt-stk")).join("\n")}
${hx.map((x, i) => "      " + px("stadt-m" + i, p, "drop", 5, x + 18, 1160)).join("\n")}
      ${px("stadt-hop", p, "drop", 8, hx[0] + 8, 1100)}`,
    `      ${JSON.stringify([0, 1, 2, 3])}.forEach((i) => tl.fromTo("#stadt-house" + i, { y: 500 }, { y: 0, duration: 0.35, ease: "back.out(1.5)" }, 0.03 + i * 0.06));
      tl.fromTo("#stadt-road", { y: 120 }, { y: 0, duration: 0.3, ease: "power2.out" }, 0);
      ${JSON.stringify(hx.map((_, i) => i))}.forEach((i) => tl.fromTo("#stadt-h" + i, { scale: 0 }, { scale: 1, duration: 0.25, ease: "back.out(2.5)", transformOrigin: "50% 100%" }, 0.15 + i * 0.04));
      tl.fromTo("#stadt-hop", { scale: 0 }, { scale: 1, duration: 0.2, ease: "back.out(3)" }, 0.3);
      const HX = ${JSON.stringify(hx)};
      for (let i = 1; i < HX.length; i++) {
        const t0 = 0.3 + i * 0.25;
        tl.to("#stadt-hop", { keyframes: { x: [ (HX[i - 1] - HX[0]), (HX[i - 1] + HX[i]) / 2 - HX[0], HX[i] - HX[0] ], y: [0, -140, 0] }, duration: 0.24, ease: "none" }, t0 - 0.24);
      }
      ${JSON.stringify(hx.map((_, i) => i))}.forEach((i) => {
        const t1 = 0.32 + i * 0.25;
        tl.fromTo("#stadt-m" + i, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.2, ease: "back.out(3)" }, t1);
        tl.to("#stadt-h" + i, { keyframes: { scaleY: [1, 0.8, 1.1, 1], scaleX: [1, 1.15, 0.95, 1] }, duration: 0.25, ease: "none", transformOrigin: "50% 100%" }, t1);
        tl.to("#stadt-m" + i, { y: -12, duration: 0.18, yoyo: true, repeat: 3, ease: "sine.inOut" }, t1 + 0.2);
      });`,
    syms(p, ["house0", "house1", "house2", "house3", "hero0", "hero1", "hero2", "hero3", "hero4", "drop"])));
}

// ================= S08 thousands K.O.: figures tip over, graves pop (15.8 - 17.8) =================
{
  const p = "ko";
  const cells = [];
  for (let row = 0; row < 3; row++) for (let c = 0; c < 5; c++) cells.push({ x: 100 + c * 185 + (row % 2) * 40 + r(-10, 10), y: 760 + row * 210, i: (row * 5 + c) % 5 });
  const order = cells.map((_, i) => i).sort(() => R() - 0.5);
  scenes.push(scene(p, "K.O.", 15.8, 2.0,
    `.ko-gr{opacity:0;}`,
    `${cells.map((c, k) => "      " + px("ko-h" + k, p, "hero" + c.i, 9, c.x, c.y, "", "ko-stk")).join("\n")}
${cells.map((c, k) => "      " + px("ko-g" + k, p, "grave", 10, c.x - 4, c.y + 18, "", "ko-gr ko-stk")).join("\n")}`,
    `      ${JSON.stringify(cells.map((_, k) => k))}.forEach((k) => tl.fromTo("#ko-h" + k, { scale: 0 }, { scale: 1, duration: 0.22, ease: "back.out(2.5)", transformOrigin: "50% 100%" }, 0.02 * k));
      const O = ${JSON.stringify(order)};
      O.forEach((k, j) => {
        const t0 = 0.35 + j * 0.055;
        tl.to("#ko-h" + k, { rotation: (k % 2 ? 90 : -90), y: 30, duration: 0.25, ease: "bounce.out", transformOrigin: "50% 100%" }, t0);
        tl.to("#ko-h" + k, { opacity: 0, duration: 0.12 }, t0 + 0.45);
        tl.fromTo("#ko-g" + k, { opacity: 0, scale: 0, y: -40 }, { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: "back.out(2.6)", transformOrigin: "50% 100%" }, t0 + 0.42);
      });
${shake("#ko-kb", 0.4, 10, 0.3)}`,
    syms(p, ["hero0", "hero1", "hero2", "hero3", "hero4", "grave"])));
}

// ================= S09 healers help (17.8 - 20.2) =================
{
  const p = "heil";
  const sick = [[560, 1060], [720, 1160], [880, 1060]];
  scenes.push(scene(p, "Heiler", 17.8, 2.4,
    `#heil-ring{${abs(60, 860, 440, 440)}border-radius:50%;background:radial-gradient(circle,rgba(63,224,122,.5),rgba(63,224,122,0) 65%);}
     .heil-bar{position:absolute;width:110px;height:22px;border:5px solid ${K};background:#1B2550;}
     .heil-fill{position:absolute;inset:0;background:#FF3B3B;transform-origin:0 50%;}
     .heil-plus{opacity:0;}`,
    `      <div id="heil-ring"></div>
      ${px("heil-healer", p, "healer", 18, 110, 900, "", "heil-stk")}
${sick.map(([x, y], i) => `      ${px("heil-s" + i, p, "hero" + (i + 2), 10, x, y, "", "heil-stk")}
      ${px("heil-sd" + i, p, "drop", 5, x + 22, y - 70)}
      <div id="heil-bar${i}" class="heil-bar" style="left:${x - 15}px;top:${y - 110}px;"><div id="heil-fill${i}" class="heil-fill"></div></div>`).join("\n")}
${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => "      " + px("heil-p" + i, p, "plus", 8, sick[i % 3][0] + r(-30, 50), sick[i % 3][1] + 20, "", "heil-plus")).join("\n")}`,
    `      tl.fromTo("#heil-healer", { x: -500 }, { x: 0, duration: 0.4, ease: "back.out(1.4)" }, 0);
      tl.to("#heil-healer", { y: -20, duration: 0.14, yoyo: true, repeat: 3, ease: "sine.inOut" }, 0.05);
      tl.fromTo("#heil-ring", { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" }, 0.4);
      tl.to("#heil-ring", { scale: 1.15, duration: 0.35, yoyo: true, repeat: 3, ease: "sine.inOut" }, 0.8);
      ${JSON.stringify([0, 1, 2])}.forEach((i) => {
        tl.fromTo("#heil-s" + i, { scale: 0 }, { scale: 1, duration: 0.25, ease: "back.out(2.4)", transformOrigin: "50% 100%" }, 0.1 + i * 0.06);
        tl.fromTo(["#heil-sd" + i, "#heil-bar" + i], { scale: 0 }, { scale: 1, duration: 0.2, ease: "back.out(3)" }, 0.25 + i * 0.06);
        tl.fromTo("#heil-fill" + i, { scaleX: 0.25, backgroundColor: "#FF3B3B" }, { scaleX: 1, backgroundColor: "#3FE07A", duration: 0.5, ease: "steps(5)" }, 0.8 + i * 0.25);
        tl.to("#heil-sd" + i, { scale: 0, rotation: 90, duration: 0.2, ease: "back.in(2)" }, 1.0 + i * 0.25);
        tl.to("#heil-s" + i, { y: -40, duration: 0.15, yoyo: true, repeat: 3, ease: "power1.out" }, 1.15 + i * 0.25);
      });
      ${JSON.stringify([0, 1, 2, 3, 4, 5, 6, 7])}.forEach((i) => tl.fromTo("#heil-p" + i, { opacity: 1, y: 0, scale: 0.4 }, { opacity: 0, y: -260, scale: 1.1, duration: 0.9, ease: "power1.out", immediateRender: false }, 0.75 + i * 0.12));
      tl.to("#heil-healer", { rotation: -6, duration: 0.25, yoyo: true, repeat: 5, ease: "sine.inOut", transformOrigin: "50% 100%" }, 0.7);`,
    syms(p, ["healer", "hero2", "hero3", "hero4", "drop", "plus"])));
}

// ================= S10 griefer spreads it on purpose (20.2 - 22.6) =================
{
  const p = "grief";
  const walkers = [0, 1, 3];
  scenes.push(scene(p, "Absicht", 20.2, 2.4,
    `#grief-ground{${abs(0, 1330, 1080, 80)}background:repeating-linear-gradient(90deg,#A8B3C2 0 50px,#8A96A6 50px 100px);border-top:8px solid ${K};}
     #grief-spark{${abs(70, 840, 360, 360)}border-radius:50%;background:radial-gradient(circle,rgba(183,108,255,.55),rgba(183,108,255,0) 65%);}`,
    `      <div id="grief-ground"></div>
      ${px("grief-gate", p, "gate", 20, 560, 1070, "", "grief-stk")}
      <div id="grief-spark"></div>
      ${px("grief-g", p, "griefer", 18, 120, 1100, "", "grief-stk")}
${walkers.map((h, i) => "      " + px("grief-w" + i, p, "hero" + h, 9, 760, 1225, "", "grief-stk")).join("\n")}
${walkers.map((h, i) => "      " + px("grief-d" + i, p, "drop", 6, 300, 1160)).join("\n")}`,
    `      tl.fromTo("#grief-gate", { y: 260, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "back.out(1.6)" }, 0);
      tl.fromTo("#grief-g", { y: 420, rotation: -15 }, { y: 0, rotation: 0, duration: 0.35, ease: "back.out(1.6)" }, 0.05);
      tl.fromTo("#grief-spark", { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4 }, 0.3);
      tl.to("#grief-g", { keyframes: { y: [0, -14, 0, -10, 0, -14, 0] }, duration: 0.9, ease: "none" }, 0.45);
      ${JSON.stringify(walkers.map((_, i) => i))}.forEach((i) => {
        const t0 = 0.25 + i * 0.45;
        tl.fromTo("#grief-w" + i, { x: 300 }, { x: -260 - i * 60, duration: 1.6, ease: "none" }, t0);
        tl.to("#grief-w" + i, { y: -14, duration: 0.1, yoyo: true, repeat: 15, ease: "sine.inOut" }, t0);
        const hit = t0 + 0.75;
        tl.to("#grief-g", { rotation: 10, duration: 0.1, yoyo: true, repeat: 1, ease: "power2.out", transformOrigin: "50% 100%" }, hit - 0.3);
        tl.fromTo("#grief-d" + i, { x: 0, y: 0, scale: 0.4, opacity: 1 }, { keyframes: { x: [0, 160, 300 - i * 30 + 120], y: [0, -150, -20] }, scale: 1, duration: 0.32, ease: "none", immediateRender: true }, hit - 0.3);
        tl.to("#grief-d" + i, { x: "-=" + (330 + i * 40), duration: 0.85, ease: "none" }, hit + 0.02);
      });`,
    syms(p, ["gate", "griefer", "hero0", "hero1", "hero3", "drop"])));
}

// ================= S11 many flee to the country (22.6 - 24.6) =================
{
  const p = "flucht";
  const runners = [[0, 0], [1, 60], [2, -30], [3, 40], [4, 10]];
  scenes.push(scene(p, "Fliehen", 22.6, 2.0,
    `#flucht-ground{${abs(0, 1330, 1080, 80)}background:repeating-linear-gradient(90deg,#3FAE6A 0 40px,#2E8B4A 40px 80px);border-top:8px solid ${K};}
     .flucht-dust{position:absolute;width:56px;height:56px;border-radius:50%;background:#E8EDF3;opacity:0;}`,
    `      <div id="flucht-ground"></div>
      ${px("flucht-hs0", p, "house0", 17, 760, 1130, "", "flucht-stk")}${px("flucht-hs1", p, "house1", 14, 900, 1170, "", "flucht-stk")}
      ${px("flucht-t0", p, "tree", 15, 40, 1150, "", "flucht-stk")}${px("flucht-t1", p, "tree", 12, 230, 1190, "", "flucht-stk")}
${runners.map(([h, dy], i) => "      " + px("flucht-r" + i, p, "hero" + h, 9, 760, 1225 + dy * 0, "", "flucht-stk")).join("\n")}
${runners.map((_, i) => `      <div id="flucht-du${i}" class="flucht-dust" style="left:820px;top:1290px;"></div>`).join("\n")}`,
    `      tl.fromTo(["#flucht-hs0", "#flucht-hs1"], { y: 400 }, { y: 0, duration: 0.3, ease: "back.out(1.5)", stagger: 0.05 }, 0);
      tl.fromTo(["#flucht-t0", "#flucht-t1"], { scale: 0 }, { scale: 1, duration: 0.3, ease: "back.out(2.4)", stagger: 0.06, transformOrigin: "50% 100%" }, 0.1);
      tl.to(["#flucht-t0", "#flucht-t1"], { rotation: 3, duration: 0.4, yoyo: true, repeat: 3, ease: "sine.inOut", transformOrigin: "50% 100%" }, 0.4);
      ${JSON.stringify(runners.map((_, i) => i))}.forEach((i) => {
        const t0 = 0.2 + i * 0.16;
        tl.fromTo("#flucht-r" + i, { x: 0, opacity: 1 }, { x: -480 - (i % 3) * 70, duration: 1.0, ease: "power1.in" }, t0);
        tl.to("#flucht-r" + i, { y: -22, rotation: -8, duration: 0.09, yoyo: true, repeat: 11, ease: "sine.inOut" }, t0);
        tl.fromTo("#flucht-du" + i, { opacity: 0.85, scale: 0.4, x: 0 }, { opacity: 0, scale: 1.8, x: 60, y: -40, duration: 0.5, ease: "power2.out", immediateRender: false }, t0 + 0.1);
      });`,
    syms(p, ["house0", "house1", "tree", "hero0", "hero1", "hero2", "hero3", "hero4"])));
}

// ================= S12 restart: soft flicker, power symbol (24.6 - 27.0) =================
{
  const p = "reset";
  const fig = [[60, 218, 0], [190, 218, 1], [330, 218, 2], [470, 218, 3]];
  scenes.push(scene(p, "Neustart", 24.6, 2.4,
    `#reset-mon{${abs(170, 820, 740, 560)}}
     #reset-scr{${abs(230, 875, 620, 360)}border-radius:30px;overflow:hidden;background:#06100C;border:6px solid ${K};}
     #reset-world{position:absolute;inset:0;background:linear-gradient(#123A2A,#0B2219);}
     #reset-world .gr{position:absolute;left:0;right:0;bottom:0;height:70px;background:repeating-linear-gradient(90deg,#2E8B4A 0 30px,#3FAE6A 30px 60px);border-top:6px solid ${K};}
     #reset-new{position:absolute;inset:0;background:linear-gradient(#2B3C8F,#5B73D6);opacity:0;}
     #reset-new .gr{position:absolute;left:0;right:0;bottom:0;height:70px;background:repeating-linear-gradient(90deg,#3FAE6A 0 30px,#2E8B4A 30px 60px);border-top:6px solid ${K};}
     #reset-line{position:absolute;left:0;right:0;top:174px;height:12px;background:#BFFFD0;opacity:0;}
     #reset-scan{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.22) 0 3px,rgba(0,0,0,0) 3px 7px);}
     #reset-pow{${abs(410, 925, 260, 260)}opacity:0;}`,
    `      <div id="reset-mon" class="reset-stk">${MONITOR_SVG}</div>
      <div id="reset-scr">
        <div id="reset-world"><div class="gr"></div>
${fig.map(([x, y, i], k) => `          ${px("reset-f" + k, p, "hero" + i, 6, x, y)}${px("reset-fd" + k, p, "drop", 4, x + 10, 170)}`).join("\n")}
          ${px("reset-gv", p, "grave", 7, 520, 230)}
        </div>
        <div id="reset-new"><div class="gr"></div>
${fig.map(([x, y, i], k) => `          ${px("reset-n" + k, p, "hero" + i, 6, x + 20, y)}`).join("\n")}
        </div>
        <div id="reset-line"></div>
        <div id="reset-scan"></div>
      </div>
      <div id="reset-pow"><svg viewBox="0 0 200 200" width="100%" height="100%"><g fill="none" stroke-linecap="round"><path d="M62 52 A70 70 0 1 0 138 52" stroke="${K}" stroke-width="40"/><line x1="100" y1="24" x2="100" y2="96" stroke="${K}" stroke-width="40"/><path d="M62 52 A70 70 0 1 0 138 52" stroke="#FFD23F" stroke-width="22"/><line x1="100" y1="24" x2="100" y2="96" stroke="#FFD23F" stroke-width="22"/></g></svg></div>`,
    `      tl.fromTo(["#reset-mon", "#reset-scr"], { y: 700 }, { y: 0, duration: 0.35, ease: "back.out(1.3)" }, 0);
      [0, 1, 2, 3].forEach((k) => tl.to("#reset-fd" + k, { y: -10, duration: 0.15, yoyo: true, repeat: 3, ease: "sine.inOut" }, 0.3 + k * 0.05));
      // soft flicker: slow, shallow brightness dips (no strobe)
      tl.to("#reset-world", { keyframes: { opacity: [1, 0.55, 0.9, 0.5, 0.85, 0.45] }, duration: 0.6, ease: "sine.inOut" }, 0.4);
      // power off: CRT collapses to a line, then the line fades
      tl.to("#reset-world", { scaleY: 0.02, duration: 0.16, ease: "power2.in" }, 1.0);
      tl.fromTo("#reset-line", { opacity: 0, scaleX: 1 }, { opacity: 0.85, duration: 0.1 }, 1.08);
      tl.to("#reset-line", { scaleX: 0, opacity: 0, duration: 0.25, ease: "power2.in" }, 1.18);
      tl.set("#reset-world", { opacity: 0 }, 1.2);
      tl.fromTo("#reset-pow", { scale: 0, opacity: 0, rotation: -90 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.3, ease: "back.out(2.4)" }, 1.25);
      tl.to("#reset-pow", { scale: 0.82, duration: 0.08, yoyo: true, repeat: 1, ease: "power2.inOut" }, 1.62);
      tl.to("#reset-pow", { scale: 0, opacity: 0, duration: 0.18, ease: "back.in(2)" }, 1.8);
      // back on: fresh world, everyone healthy
      tl.fromTo("#reset-new", { opacity: 0, scaleY: 0.02 }, { opacity: 1, scaleY: 1, duration: 0.25, ease: "power2.out" }, 1.82);
      [0, 1, 2, 3].forEach((k) => tl.fromTo("#reset-n" + k, { y: 0 }, { y: -40, duration: 0.14, yoyo: true, repeat: 1, ease: "power1.out" }, 2.0 + k * 0.05));`,
    syms(p, ["hero0", "hero1", "hero2", "hero3", "drop", "grave"])));
}

// ================= S13 researchers get curious: glasses, clipboard, coffee (27.0 - 29.4) =================
{
  const p = "forsch";
  scenes.push(scene(p, "Forscher", 27.0, 2.4,
    `#forsch-glasses{${abs(170, 760, 740, 250)}}
     #forsch-board{${abs(110, 1030, 480, 400)}}
     #forsch-cup{${abs(660, 1120, 300, 300)}}
     .forsch-steam{position:absolute;width:26px;height:90px;border-radius:13px;background:#E8EDF3;opacity:0;}
     #forsch-glint{position:absolute;left:0;top:0;width:60px;height:250px;background:rgba(255,255,255,.75);transform:skewX(-20deg);opacity:0;}`,
    `      <div id="forsch-glasses" class="forsch-stk"><svg viewBox="0 0 740 250" width="100%" height="100%">
        <rect x="20" y="30" width="300" height="200" rx="60" fill="#BFE6FF" stroke="${K}" stroke-width="28"/>
        <rect x="420" y="30" width="300" height="200" rx="60" fill="#BFE6FF" stroke="${K}" stroke-width="28"/>
        <path d="M320 110 Q370 70 420 110" stroke="${K}" stroke-width="26" fill="none" stroke-linecap="round"/>
        <path d="M70 80 L150 60" stroke="#fff" stroke-width="18" stroke-linecap="round"/><path d="M470 80 L550 60" stroke="#fff" stroke-width="18" stroke-linecap="round"/>
      </svg><div id="forsch-glint"></div></div>
      <div id="forsch-board" class="forsch-stk"><svg viewBox="0 0 480 400" width="100%" height="100%">
        <rect x="10" y="20" width="460" height="370" rx="30" fill="#C98A4B" stroke="${K}" stroke-width="8"/>
        <rect x="40" y="60" width="400" height="300" rx="14" fill="#FFFDF4"/>
        <rect x="170" y="0" width="140" height="60" rx="16" fill="#A8B3C2" stroke="${K}" stroke-width="7"/>
        <g shape-rendering="crispEdges">
          <rect class="forsch-bar" x="80" y="230" width="44" height="100" fill="#3FE07A" stroke="${K}" stroke-width="5"/>
          <rect class="forsch-bar" x="150" y="170" width="44" height="160" fill="#FFD23F" stroke="${K}" stroke-width="5"/>
          <rect class="forsch-bar" x="220" y="110" width="44" height="220" fill="#FF3B3B" stroke="${K}" stroke-width="5"/>
          <rect class="forsch-bar" x="290" y="200" width="44" height="130" fill="#FFD23F" stroke="${K}" stroke-width="5"/>
          <rect class="forsch-bar" x="360" y="270" width="44" height="60" fill="#3FE07A" stroke="${K}" stroke-width="5"/>
        </g>
        <path id="forsch-curve" d="M70 300 Q170 230 240 100 Q300 200 410 290" stroke="#0E1530" stroke-width="9" fill="none" stroke-linecap="round" stroke-dasharray="520" stroke-dashoffset="520"/>
      </svg></div>
      <div id="forsch-cup" class="forsch-stk"><svg viewBox="0 0 300 300" width="100%" height="100%">
        <path d="M216 120 Q290 120 280 180 Q270 230 210 226" stroke="${K}" stroke-width="22" fill="none"/>
        <path d="M216 120 Q290 120 280 180 Q270 230 210 226" stroke="#FFFFFF" stroke-width="10" fill="none"/>
        <path d="M40 90 L240 90 L216 270 Q214 290 194 290 L86 290 Q66 290 64 270 Z" fill="#FFFFFF" stroke="${K}" stroke-width="9" stroke-linejoin="round"/>
        <ellipse cx="140" cy="94" rx="96" ry="16" fill="#6B3E1E" stroke="${K}" stroke-width="7"/>
        <rect x="104" y="160" width="72" height="72" fill="#5BE36A" stroke="${K}" stroke-width="6" shape-rendering="crispEdges"/>
        <rect x="122" y="178" width="14" height="14" fill="${K}"/><rect x="146" y="178" width="14" height="14" fill="${K}"/>
      </svg>
        <div id="forsch-st0" class="forsch-steam" style="left:90px;top:-40px;"></div><div id="forsch-st1" class="forsch-steam" style="left:140px;top:-70px;"></div><div id="forsch-st2" class="forsch-steam" style="left:190px;top:-40px;"></div>
      </div>`,
    `      tl.fromTo("#forsch-glasses", { scale: 3, opacity: 0, rotation: -14 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.25, ease: "power4.in" }, 0.05);
${shake("#forsch-kb", 0.3, 22, 0.36)}
      tl.fromTo("#forsch-glint", { x: -80, opacity: 0.9 }, { x: 760, opacity: 0.9, duration: 0.45, ease: "power2.inOut" }, 0.7);
      tl.to("#forsch-glint", { opacity: 0, duration: 0.05 }, 1.15);
      tl.fromTo("#forsch-board", { y: 800, rotation: -18 }, { y: 0, rotation: -4, duration: 0.4, ease: "back.out(1.4)" }, 0.35);
      tl.fromTo(".forsch-bar", { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 0.25, ease: "back.out(2)", stagger: 0.06 }, 0.7);
      tl.to("#forsch-curve", { strokeDashoffset: 0, duration: 0.7, ease: "power1.inOut" }, 1.0);
      tl.fromTo("#forsch-cup", { x: 600, rotation: 20 }, { x: 0, rotation: 4, duration: 0.4, ease: "back.out(1.4)" }, 0.5);
      tl.to("#forsch-cup", { rotation: -3, duration: 0.6, yoyo: true, repeat: 2, ease: "sine.inOut" }, 0.95);
      [0, 1, 2].forEach((i) => tl.fromTo("#forsch-st" + i, { opacity: 0, y: 30, scaleY: 0.5 }, { keyframes: { opacity: [0, 0.8, 0], y: [30, -30, -110], x: [0, 14, -10] }, scaleY: 1.2, duration: 1.0, ease: "none", immediateRender: false }, 0.9 + i * 0.25));
      tl.to("#forsch-glasses", { y: -14, duration: 0.4, yoyo: true, repeat: 3, ease: "sine.inOut" }, 0.8);`,
    ""));
}

// ================= S14 generic journal page + 2007 stamp (29.4 - 31.8) =================
{
  const p = "paper";
  const lines = (x, y, n, w) => Array.from({ length: n }, (_, i) => `<rect x="${x}" y="${y + i * 26}" width="${i === n - 1 ? w * 0.6 : w}" height="12" rx="6" fill="#C9D3E0"/>`).join("");
  scenes.push(scene(p, "Fachartikel", 29.4, 2.4,
    `#paper-pg{${abs(200, 720, 680, 720)}}
     #paper-stamp{${abs(420, 1080, 470, 210)}display:flex;align-items:center;justify-content:center;font-family:'Lilita One';font-size:150px;color:#FF3B3B;border:16px solid #FF3B3B;border-radius:26px;background:rgba(255,255,255,.88);opacity:0;}`,
    `      <div id="paper-pg" class="paper-stk"><svg viewBox="0 0 680 720" width="100%" height="100%">
        <rect x="0" y="0" width="680" height="720" rx="18" fill="#FFFFFF" stroke="${K}" stroke-width="8"/>
        <rect x="4" y="4" width="672" height="96" rx="14" fill="#1B2550"/>
        <rect x="40" y="34" width="300" height="34" rx="10" fill="#FFFFFF"/><rect x="520" y="34" width="120" height="34" rx="10" fill="#FFD23F"/>
        <rect x="40" y="130" width="560" height="30" rx="10" fill="#0E1530"/><rect x="40" y="172" width="400" height="30" rx="10" fill="#0E1530"/>
        ${lines(40, 230, 6, 280)}
        <rect x="350" y="226" width="290" height="230" rx="10" fill="#EEF3FA" stroke="#8A96A6" stroke-width="4"/>
        <path d="M370 430 Q440 420 480 330 Q510 260 540 330 Q570 410 620 430" stroke="#FF3B3B" stroke-width="8" fill="none" stroke-linecap="round"/>
        <g shape-rendering="crispEdges" fill="#5BE36A" stroke="${K}" stroke-width="3"><rect x="470" y="250" width="40" height="40"/></g>
        ${lines(40, 400, 3, 280)}
        ${lines(40, 490, 8, 600)}
      </svg></div>
      <div id="paper-stamp">2007</div>`,
    `      tl.fromTo("#paper-pg", { y: 900, rotation: 16 }, { y: 0, rotation: -3, duration: 0.45, ease: "back.out(1.3)" }, 0);
      tl.to("#paper-pg", { rotation: 1.5, duration: 1.6, ease: "sine.inOut" }, 0.5);
      tl.fromTo("#paper-stamp", { scale: 3, opacity: 0, rotation: -28 }, { scale: 1, opacity: 1, rotation: -12, duration: 0.18, ease: "power4.in" }, 0.85);
${shake("#paper-kb", 1.03, 18, 0.3)}
      tl.to("#paper-stamp", { rotation: -9, scale: 1.04, duration: 0.6, ease: "sine.inOut" }, 1.2);`,
    ""));
}

// ================= S15 split screen: game vs. real, same arrows (31.8 - 34.7) =================
{
  const p = "split";
  const pos = [[0, -150], [-130, 70], [130, 70], [0, 190]];
  const human = (id, x, y, red) => `<div id="${id}" class="split-hu" style="left:${x}px;top:${y}px;"><svg viewBox="0 0 80 120" width="80" height="120"><circle cx="40" cy="28" r="22" fill="${red ? "#FF3B3B" : "#FFFFFF"}" stroke="${K}" stroke-width="6"/><path d="M8 116 Q8 60 40 60 Q72 60 72 116 Z" fill="${red ? "#FF3B3B" : "#FFFFFF"}" stroke="${K}" stroke-width="6"/></svg></div>`;
  const arrows = (side) => `<svg viewBox="0 0 450 640" width="450" height="640" style="position:absolute;left:-10px;top:0;overflow:visible">
    <g stroke="#FFD23F" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path class="split-ar-${side}" d="M200 270 Q120 280 110 330" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
      <path class="split-ar-${side}" d="M250 270 Q330 280 340 330" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
      <path class="split-ar-${side}" d="M225 300 L225 430" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
    </g></svg>`;
  scenes.push(scene(p, "Gleiches Muster", 31.8, 2.9,
    `.split-pan{position:absolute;top:740px;width:430px;height:660px;border-radius:30px;border:8px solid ${K};overflow:hidden;}
     #split-l{left:80px;background:#1B2550;} #split-r{left:570px;background:#24387A;}
     .split-lab{position:absolute;left:0;right:0;top:24px;text-align:center;font-size:92px;line-height:1;${LABEL}color:#fff;}
     .split-hu{position:absolute;}
     #split-eq{${abs(455, 1000, 140, 140)}border-radius:50%;background:#FFD23F;border:8px solid ${K};display:flex;align-items:center;justify-content:center;font-family:'Lilita One';font-size:120px;line-height:1;color:${K};padding-bottom:10px;}`,
    `      <div id="split-l" class="split-pan"><div class="split-lab">SPIEL</div>${arrows("l")}
${pos.map(([dx, dy], i) => "        " + px("split-px" + i, p, "hero" + i, 8, 215 - 32 + dx, 330 + dy - 48)).join("\n")}
        ${px("split-pd", p, "drop", 5, 215 - 17, 330 - 150 - 100)}
      </div>
      <div id="split-r" class="split-pan"><div class="split-lab">ECHT</div>${arrows("r")}
${pos.map(([dx, dy], i) => "        " + human("split-hu" + i, 215 - 40 + dx, 330 + dy - 60, false)).join("\n")}
${pos.map(([dx, dy], i) => "        " + human("split-hr" + i, 215 - 40 + dx, 330 + dy - 60, true).replace('class="split-hu"', 'class="split-hu split-red"')).join("\n")}
      </div>
      <div id="split-eq">=</div>`,
    `      tl.fromTo("#split-l", { x: -600 }, { x: 0, duration: 0.35, ease: "back.out(1.3)" }, 0);
      tl.fromTo("#split-r", { x: 600 }, { x: 0, duration: 0.35, ease: "back.out(1.3)" }, 0.06);
      tl.fromTo("#split-eq", { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2.5)" }, 0.4);
      tl.to("#split-eq", { scale: 1.12, duration: 0.25, yoyo: true, repeat: 5, ease: "sine.inOut" }, 0.9);
      tl.set(".split-red", { opacity: 0 }, 0);
      tl.fromTo("#split-pd", { scale: 0 }, { scale: 1, duration: 0.25, ease: "back.out(3)" }, 0.5);
      tl.to("#split-pd", { y: 30, duration: 0.25, ease: "power2.in" }, 0.8);
      tl.to("#split-hr0", { opacity: 1, duration: 0.15 }, 0.95);
      tl.to(".split-ar-l", { strokeDashoffset: 0, duration: 0.35, ease: "power1.inOut", stagger: 0.12 }, 1.05);
      tl.to(".split-ar-r", { strokeDashoffset: 0, duration: 0.35, ease: "power1.inOut", stagger: 0.12 }, 1.05);
      [1, 2, 3].forEach((i, k) => {
        tl.to("#split-px" + i, { keyframes: { y: [0, -24, 0], rotation: [0, -10, 0] }, duration: 0.3, ease: "none" }, 1.35 + k * 0.12);
        tl.to("#split-hr" + i, { opacity: 1, duration: 0.15 }, 1.35 + k * 0.12);
        tl.to("#split-hu" + i, { keyframes: { y: [0, -24, 0] }, duration: 0.3, ease: "none" }, 1.35 + k * 0.12);
        tl.to("#split-hr" + i, { keyframes: { y: [0, -24, 0] }, duration: 0.3, ease: "none" }, 1.35 + k * 0.12);
      });
      tl.to("#split-px0", { y: -12, duration: 0.2, yoyo: true, repeat: 5, ease: "sine.inOut" }, 0.5);
      tl.to(["#split-hu0", "#split-hr0"], { y: -12, duration: 0.2, yoyo: true, repeat: 5, ease: "sine.inOut" }, 0.5);`,
    syms(p, ["hero0", "hero1", "hero2", "hero3", "drop"])));
}

// ================= S16 comment question: two buttons + pixel cursor (34.7 - 38.1) =================
{
  const p = "frage";
  scenes.push(scene(p, "Frage", 34.7, 3.4,
    `.frage-btn{position:absolute;left:170px;width:740px;height:180px;border-radius:40px;border:10px solid ${K};display:flex;align-items:center;justify-content:center;gap:34px;font-family:'Lilita One';font-size:118px;line-height:1;color:#fff;-webkit-text-stroke:12px ${K};paint-order:stroke fill;box-shadow:0 16px 0 #050814;}
     #frage-b1{top:820px;background:#3FAE6A;} #frage-b2{top:1060px;background:#FF3B3B;}
     #frage-cur{left:700px;top:1300px;}`,
    `      <div id="frage-b1" class="frage-btn">${pxSvg(p, "plus", 13)}<span>HELFEN</span></div>
      <div id="frage-b2" class="frage-btn"><svg viewBox="0 0 100 100" width="100" height="100"><path d="M10 50 H70 M50 22 L82 50 L50 78" stroke="${K}" stroke-width="30" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 50 H70 M50 22 L82 50 L50 78" stroke="#fff" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg><span>FLIEHEN</span></div>
      ${px("frage-cur", p, "cursor", 11, 700, 1300, "", "frage-stk")}`,
    `      tl.fromTo("#frage-b1", { x: -900, rotation: -8 }, { x: 0, rotation: -2, duration: 0.4, ease: "back.out(1.5)" }, 0.05);
      tl.fromTo("#frage-b2", { x: 900, rotation: 8 }, { x: 0, rotation: 2, duration: 0.4, ease: "back.out(1.5)" }, 0.2);
      tl.fromTo("#frage-cur", { x: 300, y: 300, opacity: 0 }, { x: -40, y: -380, opacity: 1, duration: 0.5, ease: "power2.inOut" }, 0.6);
      tl.to("#frage-cur", { scale: 0.85, duration: 0.08, yoyo: true, repeat: 1 }, 1.1);
      tl.to("#frage-b1", { scale: 0.94, duration: 0.08, yoyo: true, repeat: 1 }, 1.1);
      tl.to("#frage-cur", { x: 60, y: -150, duration: 0.45, ease: "power2.inOut" }, 1.5);
      tl.to("#frage-cur", { scale: 0.85, duration: 0.08, yoyo: true, repeat: 1 }, 2.0);
      tl.to("#frage-b2", { scale: 0.94, duration: 0.08, yoyo: true, repeat: 1 }, 2.0);
      tl.to("#frage-cur", { x: -20, y: -260, duration: 0.5, ease: "sine.inOut" }, 2.4);
      tl.to(["#frage-b1", "#frage-b2"], { rotation: 0, duration: 0.5, yoyo: true, repeat: 3, ease: "sine.inOut", stagger: 0.15 }, 0.5);`,
    syms(p, ["plus", "cursor"])));
}

// ================= loop end: rebuilds the frame-0 picture (38.1 - 38.6) =================
scenes.push(scene("loopend", "Loop zurück", 38.1, 0.5, hookCss("loopend"), hookBody("loopend"),
  `      tl.fromTo("#loopend-monw", { opacity: 0, y: 500, scale: 0.7 }, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(1.4)" }, 0.0);
      tl.fromTo("#loopend-glow", { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.3, ease: "power3.out" }, 0.04);
      tl.fromTo(".loopend-sq", { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.2, stagger: 0.02, ease: "back.out(2)" }, 0.1);
      tl.fromTo("#loopend-blob", { opacity: 0, y: -620, rotation: 30 }, { opacity: 1, y: 0, rotation: 0, duration: 0.26, ease: "power3.in" }, 0.08);
      tl.fromTo("#loopend-blob", { scaleX: 1.25, scaleY: 0.78 }, { scaleX: 1, scaleY: 1, duration: 0.14, ease: "power2.out", immediateRender: false }, 0.34);`,
  hookDefs("loopend"), { exit: false, kb: false }));

// ================= background: night blue + pixel grid + slow rays =================
fs.writeFileSync(path.join(OUT, "compositions", "bg.html"), `<template>
  <style>
    #root { position: absolute; inset: 0; overflow: hidden; background: #0E1530; }
    #bg-glow { position: absolute; inset: 0; background: radial-gradient(circle at 50% 55%, #24387A 0%, #16224A 40%, #0E1530 74%); }
    #bg-rays { position: absolute; left: -760px; top: -240px; width: 2600px; height: 2600px; border-radius: 50%;
      background: repeating-conic-gradient(from 0deg, rgba(255,255,255,.05) 0deg 6deg, rgba(255,255,255,0) 6deg 15deg); }
    #bg-grid { position: absolute; left: 0; top: -60px; width: 1080px; height: 2040px;
      background-image: linear-gradient(rgba(255,255,255,.035) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.035) 2px, transparent 2px);
      background-size: 60px 60px; }
    #bg-vig { position: absolute; inset: 0; background: radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 55%, rgba(4,7,20,.6) 100%); }
  </style>
  <div id="root" data-composition-id="bg" data-width="1080" data-height="1920" data-layout-allow-overflow>
    <div id="bg-glow"></div>
    <div id="bg-rays"></div>
    <div id="bg-grid"></div>
    <div id="bg-vig"></div>
  </div>
  <script>
    (function () {
      const tl = gsap.timeline({ paused: true });
      // 45 degrees = three ray periods, 60 px = one grid cell: both land on the frame-0 state for the loop
      tl.fromTo("#bg-rays", { rotation: 0 }, { rotation: 45, duration: ${DUR}, ease: "none" }, 0);
      tl.fromTo("#bg-grid", { y: 0 }, { y: 60, duration: ${DUR}, ease: "none" }, 0);
      window.__timelines["bg"] = tl;
    })();
  </script>
</template>
`);

// ================= captions =================
// "*" keyword (yellow, Lilita, uppercase). "~" quote/name (yellow, Lilita, as written).
const caps = [
  { id: "c00", s: 0, e: 2.6, special: "year" },
  { id: "c01", s: 0.12, e: 2.6, top: 490, words: ["Eine", "*SEUCHE", "bricht", "aus."], shake: true },
  { id: "c02", s: 2.6, e: 4.6, words: ["Aber", "nicht", "in", "echt."] },
  { id: "c03", s: 4.6, e: 6.6, words: ["Sondern", "in", "einem", "*ONLINE-SPIEL."], kwsize: 124 },
  { id: "c04", s: 6.6, e: 9.0, words: ["Ein", "Boss", "verteilt", "einen", "*FLUCH."] },
  { id: "c05", s: 9.0, e: 11.4, top: 290, words: ["~„Verdorbenes", "~Blut“.", "Nur", "im", "Kampf."], size: 80 },
  { id: "c06", s: 11.4, e: 13.8, words: ["Doch", "*HAUSTIERE", "tragen", "ihn", "raus."], kwsize: 150 },
  { id: "c07", s: 13.8, e: 15.8, words: ["Direkt", "in", "die", "*STÄDTE."] },
  { id: "c08", s: 15.8, e: 17.8, words: ["Tausende", "Figuren:", "*K.O."], shake: true },
  { id: "c09", s: 17.8, e: 20.2, words: ["Heiler", "rennen", "los", "und", "*HELFEN."] },
  { id: "c10", s: 20.2, e: 22.6, words: ["Andere", "verbreiten", "es", "mit", "*ABSICHT."] },
  { id: "c11", s: 22.6, e: 24.6, words: ["Viele", "*FLIEHEN", "aufs", "Land."] },
  { id: "c12", s: 24.6, e: 27.0, words: ["Am", "Ende", "hilft", "nur:", "*NEUSTART."] },
  { id: "c13", s: 27.0, e: 29.4, words: ["Und", "dann?", "*FORSCHER", "werden", "neugierig."], kwsize: 205, shake: true },
  { id: "c14", s: 29.4, e: 31.8, words: ["*2007:", "Artikel", "in", "~The", "~Lancet."] },
  { id: "c15", s: 31.8, e: 34.7, words: ["Spieler", "handeln", "wie", "bei", "echten", "*SEUCHEN."], kwsize: 140 },
  { id: "c16", s: 34.7, e: 38.1, top: 290, words: ["Hättest", "du", "geholfen"], size: 88 },
  { id: "c17", s: 35.05, e: 38.1, top: 500, words: ["oder", "wärst", "du", "geflohen?"], size: 88 },
  { id: "c18", s: 38.1, e: DUR, special: "year" },
];
const ST = 0.065, PD = 0.22, KD = 0.24, EXIT = 0.12;
let capHtml = "", capJs = "";
const report = [];
for (const c of caps) {
  const d = +(c.e - c.s).toFixed(2);
  const track = caps.indexOf(c) % 2;
  if (c.special === "year") {
    capHtml += `      <div id="${c.id}" class="cap clip" data-start="${c.s}" data-duration="${d}" data-track-index="${track}" style="top:290px;"><span id="${c.id}-t" class="yr">2005.</span></div>\n`;
    continue;
  }
  const style = `top:${c.top ?? 300}px;${c.size ? `font-size:${c.size}px;` : ""}`;
  const isK = (w) => w.startsWith("*"), isQ = (w) => w.startsWith("~");
  const spans = c.words.map((w, i) => {
    if (isK(w)) return `<span id="${c.id}-o${i}" class="w kw"${c.kwsize ? ` style="font-size:${c.kwsize}px"` : ""}><span id="${c.id}-w${i}" class="g">${w.slice(1)}</span></span>`;
    if (isQ(w)) return `<span id="${c.id}-o${i}" class="w q"><span id="${c.id}-w${i}" class="g">${w.slice(1)}</span></span>`;
    return `<span id="${c.id}-o${i}" class="w"><span id="${c.id}-w${i}" class="g">${w}</span></span>`;
  });
  capHtml += `      <div id="${c.id}" class="cap clip" data-start="${c.s}" data-duration="${d}" data-track-index="${track}" data-layout-allow-overlap style="${style}">${spans.join(" ")}</div>\n`;
  // word-by-word pop: the outer span keeps a fixed gap, only the inner span scales
  capJs += `      // ${c.id}\n`;
  let full = 0;
  c.words.forEach((w, i) => {
    const at = +(c.s + 0.02 + i * ST).toFixed(3);
    if (isK(w)) {
      capJs += `      tl.fromTo("#${c.id}-w${i}", { opacity: 0, scale: 1.3, rotation: -6 }, { opacity: 1, scale: 1, rotation: 0, duration: ${KD}, ease: "back.out(2.2)" }, ${at});\n`;
      if (c.shake) capJs += `      tl.to("#${c.id}-w${i}", { keyframes: { x: [0, -12, 12, -8, 6, 0], rotation: [0, -4, 4, -2, 0, 0] }, duration: 0.32, ease: "none" }, ${+(at + 0.28).toFixed(3)});\n`;
      full = Math.max(full, at + KD);
    } else {
      capJs += `      tl.fromTo("#${c.id}-w${i}", { opacity: 0, scale: 0.4, y: 26 }, { opacity: 1, scale: 1, y: 0, duration: ${PD}, ease: "back.out(1.6)" }, ${at});\n`;
      full = Math.max(full, at + PD);
    }
  });
  const ex = +(c.e - EXIT - 0.01).toFixed(3);
  capJs += `      tl.to("#${c.id} .g", { opacity: 0, scale: 0.85, duration: ${EXIT}, ease: "power2.in" }, ${ex});\n`;
  const readable = +(ex - full).toFixed(2), need = Math.max(1.1, 0.35 * c.words.length);
  report.push(`${c.id} ${c.words.length}w readable ${readable}s need ${need.toFixed(2)}s ${readable >= need ? "ok" : "TOO SHORT"}`);
}
capJs += `      // c00: 2005. is on screen at frame 0 and leaves with the hook
      tl.fromTo("#c00-t", { scale: 1 }, { keyframes: { scale: [1, 1.12, 1] }, duration: 0.3, ease: "sine.inOut" }, 0.3);
      tl.to("#c00-t", { opacity: 0, scale: 0.85, duration: 0.12, ease: "power2.in" }, 2.47);
      // c18: loop back, lands exactly on the frame-0 state
      tl.fromTo("#c18-t", { scale: 2.4, opacity: 0, rotation: 8 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.22, ease: "power4.in" }, 38.1);
`;
fs.writeFileSync(path.join(OUT, "compositions", "captions.html"), `<template>
  <style>
    ${FONTFACE}
    #root { position: absolute; inset: 0; }
    .cap { position: absolute; left: 80px; width: 920px; text-align: center; font-family: 'Inter', sans-serif; font-weight: 900;
      font-size: 84px; line-height: 1.12; color: #fff; letter-spacing: -0.01em; }
    .w { display: inline-block; margin: 0 0.14em; -webkit-text-stroke: 16px ${K}; paint-order: stroke fill; text-shadow: 0 9px 0 #050814; }
    .g { display: inline-block; }
    .kw { font-family: 'Lilita One'; font-weight: 400; color: #FFD23F; font-size: 160px; line-height: 1.0; text-transform: uppercase; letter-spacing: 0.01em; padding: 0 6px; }
    .q { font-family: 'Lilita One'; font-weight: 400; color: #FFD23F; font-size: 112px; line-height: 1.05; letter-spacing: 0.01em; }
    .yr { display: inline-block; font-family: 'Lilita One'; color: #FFD23F; font-size: 180px; line-height: 1; -webkit-text-stroke: 20px ${K}; paint-order: stroke fill; text-shadow: 0 16px 0 #050814; }
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

// ================= Klotz (rig from Folge 1, new gag: mini mask + sneeze) =================
const M = {
  shock:      { eye: 1.12, ps: 0.6, px: 0, py: 0, lL: 0, lR: 0, bL: -18, bR: -18, tL: -6, tR: -6, mx: 1, my: 1.1, g: 0, aL: 70, aR: -70, sw: 1 },
  surprised:  { eye: 1.08, ps: 0.8, px: 0, py: 6, lL: 0, lR: 0, bL: -16, bR: -16, tL: 0, tR: 0, mx: 0.55, my: 0.6, g: 0, aL: 55, aR: -55, sw: 0 },
  annoyed:    { eye: 1, ps: 1, px: -12, py: 4, lL: 0.42, lR: 0.42, bL: 4, bR: 4, tL: 16, tR: 16, mx: 0.9, my: 0.22, g: 0, aL: 18, aR: -18, sw: 0 },
  impressed:  { eye: 1.05, ps: 0.9, px: -6, py: -4, lL: 0, lR: 0, bL: -12, bR: -12, tL: -4, tR: -4, mx: 0.45, my: 0.45, g: 0, aL: 40, aR: -40, sw: 0 },
  smug:       { eye: 1, ps: 1, px: 8, py: 0, lL: 0.45, lR: 0.45, bL: -4, bR: -10, tL: 6, tR: -2, mx: 0, my: 0, g: 1, aL: 20, aR: -165, sw: 0 },
  confused:   { eye: 1, ps: 0.7, px: 0, py: 0, lL: 0, lR: 0.2, bL: -12, bR: -4, tL: -12, tR: -12, mx: 0.5, my: 0.4, g: 0, aL: 85, aR: -60, sw: 1 },
  wince:      { eye: 0.95, ps: 1, px: 0, py: 0, lL: 0.85, lR: 0.85, bL: 6, bR: 6, tL: 18, tR: 18, mx: 1.5, my: 0.25, g: 0, aL: 100, aR: -100, sw: 1 },
  suspicious: { eye: 1, ps: 1, px: 14, py: 2, lL: 0.55, lR: 0.1, bL: 4, bR: -20, tL: 14, tR: 4, mx: 0.7, my: 0.18, g: 0, aL: 30, aR: -30, sw: 0 },
  jawdrop:    { eye: 1.18, ps: 0.55, px: 0, py: 0, lL: 0, lR: 0, bL: -22, bR: -22, tL: -4, tR: -4, mx: 1.1, my: 1.7, g: 0, aL: 60, aR: -60, sw: 1 },
  neutral:    { eye: 1, ps: 1, px: 0, py: 0, lL: 0.15, lR: 0.15, bL: -6, bR: -6, tL: 0, tR: 0, mx: 0.6, my: 0.3, g: 0, aL: 35, aR: -35, sw: 0 },
  cheer:      { eye: 1, ps: 1, px: 0, py: 0, lL: 0.2, lR: 0.2, bL: -16, bR: -16, tL: -6, tR: -6, mx: 0, my: 0, g: 1, aL: 160, aR: -160, sw: 0 },
  curious:    { eye: 1.05, ps: 1.1, px: 0, py: 4, lL: 0.1, lR: 0.1, bL: -18, bR: -4, tL: 0, tR: 0, mx: 0.5, my: 0.5, g: 0, aL: 40, aR: -120, sw: 0 },
  sneezeup:   { eye: 0.95, ps: 1, px: 0, py: -6, lL: 0.7, lR: 0.7, bL: -20, bR: -20, tL: -10, tR: -10, mx: 0.8, my: 0.9, g: 0, aL: 50, aR: -50, sw: 0 },
  squeeze:    { eye: 0.9, ps: 1, px: 0, py: 0, lL: 1, lR: 1, bL: 8, bR: 8, tL: 20, tR: 20, mx: 1.3, my: 0.6, g: 0, aL: 110, aR: -110, sw: 1 },
};
const moods = [
  [2.6, "suspicious"], [4.6, "surprised"], [6.6, "wince"], [9.0, "annoyed"], [11.4, "jawdrop"], [13.8, "confused"],
  [15.8, "shock"], [17.8, "impressed"], [20.2, "annoyed"], [22.6, "confused"], [24.6, "neutral"],
  [25.15, "sneezeup"], [25.72, "squeeze"], [26.05, "surprised"], [27.0, "curious"], [29.4, "impressed"],
  [31.8, "smug"], [34.7, "curious"], [38.1, "shock"],
];
const blinks = [1.9, 5.6, 8.2, 12.5, 14.9, 19.3, 23.7, 28.6, 33.2, 36.4];

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
  <g id="k-spray" fill="#BFE9FF" stroke="#2A5A80" stroke-width="3">
    ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<circle id="k-sp${i}" cx="150" cy="232" r="${7 + (i % 3) * 3}"/>`).join("")}
  </g>
  <g id="k-mask">
    <path d="M100 214 L46 188 M200 214 L254 188" stroke="#E8F7FF" stroke-width="7" stroke-linecap="round"/>
    <path d="M100 206 Q150 192 200 206 L200 248 Q150 272 100 248 Z" fill="#CFEFFF" stroke="#2A5A80" stroke-width="6" stroke-linejoin="round"/>
    <path d="M112 220 Q150 210 188 220 M112 234 Q150 226 188 234 M114 248 Q150 244 186 248" stroke="#8FC8E8" stroke-width="4" fill="none"/>
  </g>
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
      tl.to("#k-armL", { rotation: ${p.aL}, duration: ${+(dur * 1.3).toFixed(3)}, ease: "back.out(1.6)" }, ${+(t + 0.04).toFixed(2)});
      tl.to("#k-armR", { rotation: ${p.aR}, duration: ${+(dur * 1.3).toFixed(3)}, ease: "back.out(1.6)" }, ${+(t + 0.08).toFixed(2)});
      tl.to("#k-sweat", { opacity: ${p.sw}, scale: ${p.sw ? 1 : 0.3}, duration: ${dur}, ease: "power2.out" }, ${t});
`;
};
const p0 = M.shock;
kJs += `      gsap.set("#k-armL", { svgOrigin: "48 190" }); gsap.set("#k-armR", { svgOrigin: "252 190" });
      gsap.set(["#k-eyeL"], { svgOrigin: "108 140" }); gsap.set(["#k-eyeR"], { svgOrigin: "192 140" });
      gsap.set("#k-pupL", { svgOrigin: "108 142" }); gsap.set("#k-pupR", { svgOrigin: "192 142" });
      gsap.set("#k-lidL", { svgOrigin: "108 90" }); gsap.set("#k-lidR", { svgOrigin: "192 90" });
      gsap.set("#k-browL", { svgOrigin: "109 81" }); gsap.set("#k-browR", { svgOrigin: "191 81" });
      gsap.set("#k-mouth", { svgOrigin: "150 228" }); gsap.set("#k-grin", { svgOrigin: "150 230" }); gsap.set("#k-sweat", { svgOrigin: "260 100" });
      gsap.set("#k-mask", { svgOrigin: "150 230" });
      gsap.set(["#k-eyeL", "#k-eyeR"], { scale: ${p0.eye} });
      gsap.set(["#k-pupL", "#k-pupR"], { x: 0, y: 0, scale: ${p0.ps} });
      gsap.set(["#k-lidL", "#k-lidR"], { scaleY: 0 });
      gsap.set("#k-browL", { y: ${p0.bL}, rotation: ${p0.tL} }); gsap.set("#k-browR", { y: ${p0.bR}, rotation: ${-p0.tR} });
      gsap.set("#k-mouth", { scaleX: ${p0.mx}, scaleY: ${p0.my}, opacity: 1 }); gsap.set("#k-grin", { scale: 0.2, opacity: 0 });
      gsap.set("#k-armL", { rotation: ${p0.aL} }); gsap.set("#k-armR", { rotation: ${p0.aR} });
      gsap.set("#k-sweat", { opacity: 1, scale: 1 });
      gsap.set("#k-mask", { opacity: 0, x: 0, y: 0, rotation: 0, scale: 1 });
      gsap.set("#k-spray circle", { opacity: 0 });
      gsap.set("#k-wrap", { x: 0, y: 0, rotation: 0 }); gsap.set("#k-sq", { scaleX: 1, scaleY: 1 });
      // idle bob: 78 half-cycles over the film, ends where it starts
      tl.fromTo("#k-bob", { y: 0 }, { y: -12, duration: ${(DUR / 78).toFixed(5)}, ease: "sine.inOut", yoyo: true, repeat: 77 }, 0);
      // shock tremble in the hook, jolt on SEUCHE
      tl.to("#k-wrap", { keyframes: { x: [0, -5, 5, -4, 4, -3, 3, 0] }, duration: 0.5, ease: "none" }, 0.02);
      tl.to("#k-wrap", { keyframes: { x: [0, -16, 14, -10, 6, 0], rotation: [0, -6, 5, -3, 1, 0] }, duration: 0.4, ease: "none" }, 0.5);
      tl.to("#k-sweat", { y: 14, duration: 0.5, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0.3);
`;
for (const [t, m] of moods) {
  kJs += `      // ${m} @ ${t}\n`;
  if (!["squeeze", "sneezeup"].includes(m)) kJs += `      tl.to("#k-sq", { keyframes: { scaleY: [1, 0.9, 1.06, 1], scaleX: [1, 1.07, 0.97, 1] }, duration: 0.3, ease: "none" }, ${+(t - 0.05).toFixed(2)});\n`;
  kJs += setMood(m, +(t + 0.03).toFixed(2), 0.22);
}
for (const b of blinks) kJs += `      tl.to(["#k-lidL", "#k-lidR"], { scaleY: 1, duration: 0.06, yoyo: true, repeat: 1, ease: "power1.inOut" }, ${b});\n`;
kJs += `      // pupils follow the action
      tl.to(["#k-pupL", "#k-pupR"], { keyframes: { x: [0, -16, 14, -14, 10, 0] }, duration: 1.4, ease: "sine.inOut" }, 12.0);
      tl.to(["#k-pupL", "#k-pupR"], { keyframes: { x: [0, -16, 16, -12, 14, 0] }, duration: 1.2, ease: "none" }, 14.3);
      // GAG part 1 (K.O.): Klotz puts on a mini mask
      tl.to("#k-armR", { rotation: -165, duration: 0.2, ease: "power2.out" }, 16.2);
      tl.fromTo("#k-mask", { opacity: 1, x: 150, y: -260, rotation: 40, scale: 0.6 }, { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1, duration: 0.32, ease: "back.out(1.6)", immediateRender: false }, 16.22);
      tl.to("#k-mask", { scaleX: 1.12, scaleY: 0.9, duration: 0.08, yoyo: true, repeat: 1 }, 16.54);
      tl.to("#k-armR", { rotation: -70, duration: 0.3, ease: "back.out(1.6)" }, 16.56);
      tl.to("#k-wrap", { keyframes: { y: [0, -22, 0] }, duration: 0.3, ease: "power1.inOut" }, 16.6);
      // GAG part 2 (NEUSTART): ha... ha... HATSCHI, the mask flies away
      tl.to("#k-wrap", { rotation: -9, y: -14, duration: 0.5, ease: "power1.in" }, 25.15);
      tl.to("#k-wrap", { keyframes: { rotation: [-9, 12, 3, 0], x: [0, -30, -8, 0], y: [-14, 6, 0, 0] }, duration: 0.45, ease: "none" }, 25.68);
      tl.to("#k-mask", { x: -560, y: -820, rotation: -620, scale: 0.8, duration: 0.95, ease: "power2.out" }, 25.72);
      tl.to("#k-mask", { opacity: 0, duration: 0.15 }, 26.5);
      ${JSON.stringify([0, 1, 2, 3, 4, 5, 6])}.forEach((i) => {
        const a = (200 + i * 14) * Math.PI / 180;
        tl.fromTo("#k-sp" + i, { opacity: 1, x: 0, y: 0, scale: 0.5 }, { opacity: 0, x: Math.cos(a) * (160 + i * 18), y: Math.sin(a) * (120 + i * 12) + 30, scale: 1.2, duration: 0.5, ease: "power2.out", immediateRender: false }, 25.72 + i * 0.015);
      });
      tl.to("#k-wrap", { keyframes: { y: [0, -30, 0] }, duration: 0.35, ease: "power1.inOut" }, 26.1);
      // FORSCHER: little hop
      tl.to("#k-wrap", { keyframes: { y: [0, -40, 0] }, duration: 0.4, ease: "power1.inOut" }, 27.05);
      // question: head tilt to the viewer
      tl.to("#k-wrap", { rotation: -8, duration: 0.35, ease: "back.out(2)" }, 34.75);
      tl.to("#k-wrap", { rotation: 5, duration: 0.6, ease: "sine.inOut" }, 35.8);
      tl.to("#k-wrap", { rotation: 0, duration: 0.3, ease: "power2.out" }, 37.6);
      // loop: shock jolt lands back on the frame-0 pose
      tl.to("#k-wrap", { keyframes: { x: [0, -8, 6, 0], y: [0, -24, 0, 0] }, duration: 0.3, ease: "none" }, 38.12);
`;
fs.writeFileSync(path.join(OUT, "compositions", "klotz.html"), `<template>
  <style>
    #root { position: absolute; inset: 0; pointer-events: none; }
    #k-wrap { position: absolute; left: 700px; top: 1480px; width: 260px; height: 286px; transform-origin: 50% 100%; }
    #k-bob, #k-sq { position: absolute; inset: 0; transform-origin: 50% 100%; }
    #k-shadow { position: absolute; left: 725px; top: 1748px; width: 210px; height: 30px; border-radius: 50%; background: rgba(0,0,0,.35); }
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

// ================= index.html + sound =================
const sfx = [
  [0.0, "impact", 0.8], [0.27, "stamp", 0.55], [0.5, "hit8", 0.45],
  [2.6, "whoosh1", 0.5], [2.95, "whoosh2", 0.5], [3.3, "whoosh1", 0.35],
  [4.6, "powerup", 0.45], [5.0, "blip", 0.35], [5.35, "blip", 0.3],
  [6.95, "impact", 0.6], [7.35, "zap", 0.4], [7.6, "zap", 0.38], [7.85, "zap", 0.38], [8.1, "zap", 0.38], [7.8, "hit8", 0.35],
  [9.0, "whoosh2", 0.45], [9.5, "hit8", 0.4], [9.6, "stamp", 0.55], [9.9, "hit8", 0.38], [10.3, "hit8", 0.38],
  [11.4, "whoosh1", 0.45], [11.95, "blip", 0.3], [12.35, "blip", 0.3], [12.75, "blip", 0.3], [13.15, "blip", 0.3],
  [13.8, "pop1", 0.5], [14.37, "blip", 0.32], [14.62, "blip", 0.32], [14.87, "blip", 0.32], [15.12, "blip", 0.32], [15.37, "blip", 0.32],
  [15.8, "ko", 0.55], [16.22, "whoosh2", 0.35], [16.54, "pop2", 0.45], [16.6, "pop1", 0.4], [16.95, "pop2", 0.4], [17.3, "pop1", 0.4],
  [17.8, "whoosh1", 0.4], [18.6, "heal", 0.5], [19.1, "heal", 0.35],
  [20.2, "whoosh2", 0.45], [20.75, "zap", 0.35], [21.2, "zap", 0.35], [21.65, "zap", 0.35],
  [22.6, "whoosh1", 0.45], [22.85, "whoosh2", 0.3], [23.2, "whoosh2", 0.3],
  [24.6, "whoosh1", 0.4], [25.0, "click", 0.45], [25.45, "powerdown", 0.55], [25.42, "sneeze", 0.8], [25.87, "pop2", 0.35], [26.24, "click", 0.55], [26.42, "powerup", 0.45],
  [27.0, "impact", 0.85], [27.05, "stamp", 0.5], [27.4, "pop1", 0.45], [27.55, "pop2", 0.45], [28.0, "blip", 0.3],
  [29.4, "whoosh1", 0.45], [30.25, "stamp", 0.85],
  [31.8, "whoosh2", 0.45], [32.2, "pop1", 0.45], [32.85, "blip", 0.3], [33.15, "blip", 0.3], [33.27, "blip", 0.3], [33.39, "blip", 0.3],
  [34.75, "whoosh1", 0.4], [34.9, "whoosh2", 0.35], [35.8, "click", 0.55], [36.7, "click", 0.55],
  [38.08, "whoosh2", 0.55], [38.32, "pop2", 0.4],
];
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
      <audio id="music-beat" class="clip" src="assets/sfx/beat.wav" data-start="0" data-duration="${DUR}" data-track-index="5" data-volume="0.4"></audio>
${sfxTags.join("\n")}
    </div>
    <script>
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`;
fs.writeFileSync(path.join(OUT, "index.html"), index);
console.log(report.join("\n"));
console.log("written", scenes.length, "scenes,", sfx.length, "sfx, lanes", lanes.length);
