// Generator for Folge 3 "Die Bitcoin-Pizza": writes index.html and compositions/*.html
// Usage: node tools/gen.mjs <project_dir>
// Technique from Folge 1/2 (scene helper, overlapping exits, Klotz rig, captions with fixed word gap).
// Scenes, drawings and the Klotz gag are new: pizzeria, forum window, stock chart, coins, vault.
import fs from "node:fs";
import path from "node:path";

const OUT = process.argv[2];
export const DUR = 39.5;
fs.mkdirSync(path.join(OUT, "compositions"), { recursive: true });

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const R = mulberry32(2010);
const r = (a, b) => +(a + (b - a) * R()).toFixed(2);

const K = "#0A0F22";
const GOLD = "#FFC52E", GOLD_D = "#C98400", GOLD_L = "#FFE58A", GREEN = "#3FE07A", RED = "#FF3B3B", YEL = "#FFD23F";

// ================= drawings (own designs) =================
// coin, front view: own "B with strokes" glyph (no logo)
const coinSym = (p) => `<symbol id="${p}-sym-coin" viewBox="0 0 200 200">
  <circle cx="100" cy="100" r="94" fill="${GOLD_D}" stroke="${K}" stroke-width="8"/>
  <circle cx="100" cy="94" r="86" fill="${GOLD}"/>
  <circle cx="100" cy="94" r="68" fill="none" stroke="${GOLD_D}" stroke-width="7"/>
  <g fill="${GOLD_D}"><rect x="80" y="38" width="11" height="22" rx="4"/><rect x="104" y="38" width="11" height="22" rx="4"/><rect x="80" y="128" width="11" height="22" rx="4"/><rect x="104" y="128" width="11" height="22" rx="4"/></g>
  <text x="100" y="135" text-anchor="middle" font-family="Lilita One" font-size="104" fill="${GOLD_D}">B</text>
  <path d="M46 70 Q60 40 96 30" stroke="#FFF6CF" stroke-width="10" fill="none" stroke-linecap="round" opacity=".8"/>
</symbol>`;
const coin = (id, p, x, y, s, extra = "") => `<div id="${id}" class="cn" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px;${extra}"><svg viewBox="0 0 200 200" width="100%" height="100%" overflow="visible"><use href="#${p}-sym-coin"/></svg></div>`;

// coin column (side view), n coins, 120 wide
const column = (n) => {
  const h = n * 22 + 26;
  let g = "";
  for (let i = n - 1; i >= 0; i--) {
    const y = h - 30 - (n - 1 - i) * 22;
    g += `<rect x="4" y="${y}" width="112" height="28" rx="12" fill="${i % 2 ? GOLD : "#FFB81F"}" stroke="${K}" stroke-width="5"/>`;
    g += `<path d="M22 ${y + 6} v16 M42 ${y + 6} v16 M62 ${y + 6} v16 M82 ${y + 6} v16 M102 ${y + 6} v16" stroke="${GOLD_D}" stroke-width="3"/>`;
  }
  g += `<ellipse cx="60" cy="${h - 30 - (n - 1) * 22 + 2}" rx="54" ry="10" fill="${GOLD_L}" stroke="${K}" stroke-width="4"/>`;
  return { h, svg: `<svg viewBox="0 0 120 ${h}" width="120" height="${h}" overflow="visible">${g}</svg>` };
};

// closed pizza box, slight top view: 500 x 190
const BOX = `<svg viewBox="0 0 500 190" width="100%" height="100%" overflow="visible">
  <path d="M40 8 L460 8 L494 66 L6 66 Z" fill="#F6E6C4" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>
  <rect x="6" y="66" width="488" height="116" rx="8" fill="#E0BF86" stroke="${K}" stroke-width="7"/>
  <ellipse cx="250" cy="37" rx="78" ry="22" fill="#E8A54B" stroke="${K}" stroke-width="5"/><ellipse cx="250" cy="37" rx="62" ry="15" fill="#FFD86B"/>
  <g fill="#D9412B"><ellipse cx="222" cy="33" rx="10" ry="5"/><ellipse cx="262" cy="28" rx="10" ry="5"/><ellipse cx="282" cy="42" rx="10" ry="5"/><ellipse cx="240" cy="45" rx="10" ry="5"/></g>
  <path d="M40 96 L96 96 L68 160 Z" fill="#FFD86B" stroke="${RED}" stroke-width="6" stroke-linejoin="round"/><path d="M36 94 Q68 84 100 94" stroke="${RED}" stroke-width="9" fill="none" stroke-linecap="round"/>
  <rect x="124" y="100" width="336" height="16" rx="8" fill="${RED}"/><rect x="124" y="132" width="250" height="12" rx="6" fill="#C9A26A"/>
  <path d="M20 74 L480 74" stroke="#FFF3D6" stroke-width="5" opacity=".7"/>
</svg>`;

// whole pizza, top view
const PIZZA = (missing = false) => {
  let pep = "";
  const RP = mulberry32(22);
  for (let i = 0; i < 11; i++) {
    const a = RP() * Math.PI * 2, rr = 40 + RP() * 100;
    const x = 200 + Math.cos(a) * rr, y = 200 + Math.sin(a) * rr;
    if (missing && x > 200 && y < 200 && Math.atan2(200 - y, x - 200) < Math.PI / 4 + 0.1) continue;
    pep += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="20" fill="#D9412B" stroke="#8E2215" stroke-width="4"/><circle cx="${(x - 6).toFixed(1)}" cy="${(y - 6).toFixed(1)}" r="5" fill="#F07A5E"/>`;
  }
  const basil = `<path d="M140 150 q14 -18 28 0 q-14 14 -28 0Z M250 260 q14 -18 28 0 q-14 14 -28 0Z M120 270 q14 -18 28 0 q-14 14 -28 0Z" fill="#3FAE6A" stroke="#1E6B3A" stroke-width="3"/>`;
  const cut = `<g stroke="#C98A3B" stroke-width="5"><line x1="200" y1="30" x2="200" y2="370"/><line x1="30" y1="200" x2="370" y2="200"/><line x1="80" y1="80" x2="320" y2="320"/><line x1="320" y1="80" x2="80" y2="320"/></g>`;
  const body = `<circle cx="200" cy="200" r="182" fill="#E8A54B" stroke="${K}" stroke-width="8"/><circle cx="200" cy="200" r="150" fill="#FFD86B"/><circle cx="200" cy="200" r="150" fill="none" stroke="#F2B544" stroke-width="10" stroke-dasharray="30 22"/>${pep}${basil}${cut}`;
  if (!missing) return `<svg viewBox="0 0 400 400" width="100%" height="100%" overflow="visible">${body}</svg>`;
  // one slice missing (upper right octant): mask it out, show the box floor
  return `<svg viewBox="0 0 400 400" width="100%" height="100%" overflow="visible">${body}
    <path d="M200 200 L200 12 A188 188 0 0 1 333 67 Z" fill="#EBD3A4"/><path d="M200 200 L200 18 M200 200 L329 71" stroke="${K}" stroke-width="7" stroke-linecap="round"/>
    <path d="M200 50 L200 200 L306 94" stroke="#E2C38F" stroke-width="10" fill="none" stroke-dasharray="4 18" stroke-linecap="round"/></svg>`;
};

// single slice, tip down: 300 x 380
const SLICE = (p) => `<svg viewBox="0 0 300 380" width="100%" height="100%" overflow="visible">
  <defs><linearGradient id="${p}-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF2A8"/><stop offset=".5" stop-color="${GOLD}"/><stop offset="1" stop-color="${GOLD_D}"/></linearGradient></defs>
  <path d="M20 60 Q150 0 280 60 L150 370 Z" fill="#FFD86B" stroke="${K}" stroke-width="9" stroke-linejoin="round"/>
  <path d="M14 58 Q150 -16 286 58 L276 84 Q150 24 24 84 Z" fill="#E8A54B" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
  <g fill="#D9412B" stroke="#8E2215" stroke-width="4"><circle cx="110" cy="130" r="26"/><circle cx="190" cy="150" r="24"/><circle cx="148" cy="230" r="20"/><circle cx="150" cy="300" r="13"/></g>
  <path d="M60 110 q10 40 0 70 M230 120 q-6 30 4 50" stroke="#FFE9A8" stroke-width="10" fill="none" stroke-linecap="round"/>
  <path id="${p}-goldl" d="M20 60 Q150 0 280 60 L150 370 Z" fill="url(#${p}-gold)" stroke="${K}" stroke-width="9" stroke-linejoin="round" opacity="0"/>
</svg>`;

// avatars for the forum (own generic people icons)
const AVATAR = (kind) => {
  if (kind === "dev") return `<svg viewBox="0 0 200 200" width="100%" height="100%"><rect x="6" y="6" width="188" height="188" rx="36" fill="#4FC3F7" stroke="${K}" stroke-width="10"/>
    <path d="M40 194 Q40 130 100 130 Q160 130 160 194 Z" fill="#2B5BD7" stroke="${K}" stroke-width="8"/>
    <circle cx="100" cy="86" r="48" fill="#F2C29B" stroke="${K}" stroke-width="8"/><path d="M52 78 Q60 30 100 34 Q142 30 150 78 Q120 56 52 78Z" fill="#5A3A1E" stroke="${K}" stroke-width="6"/>
    <g fill="#fff" stroke="${K}" stroke-width="6"><rect x="64" y="76" width="30" height="24" rx="8"/><rect x="106" y="76" width="30" height="24" rx="8"/></g><path d="M94 88 h12" stroke="${K}" stroke-width="6"/>
    <path d="M86 112 Q100 122 114 112" stroke="${K}" stroke-width="6" fill="none" stroke-linecap="round"/></svg>`;
  return `<svg viewBox="0 0 200 200" width="100%" height="100%"><rect x="6" y="6" width="188" height="188" rx="36" fill="#7FE08F" stroke="${K}" stroke-width="10"/>
    <path d="M40 194 Q40 130 100 130 Q160 130 160 194 Z" fill="${RED}" stroke="${K}" stroke-width="8"/>
    <circle cx="100" cy="88" r="46" fill="#C98A5B" stroke="${K}" stroke-width="8"/>
    <path d="M50 74 Q54 30 100 30 Q146 30 150 74 Z" fill="${YEL}" stroke="${K}" stroke-width="7"/><path d="M140 70 L184 74" stroke="${K}" stroke-width="12" stroke-linecap="round"/><path d="M140 70 L180 73" stroke="${YEL}" stroke-width="5" stroke-linecap="round"/>
    <circle cx="84" cy="90" r="7" fill="${K}"/><circle cx="116" cy="90" r="7" fill="${K}"/>
    <path d="M80 110 Q100 128 120 110" stroke="${K}" stroke-width="6" fill="none" stroke-linecap="round"/></svg>`;
};

// ---------- common CSS ----------
const STK = `filter: drop-shadow(5px 0 0 #fff) drop-shadow(-5px 0 0 #fff) drop-shadow(0 5px 0 #fff) drop-shadow(0 -5px 0 #fff) drop-shadow(0 14px 0 rgba(0,0,0,.35));`;
const FONTFACE = `@font-face{font-family:'Lilita One';src:url('assets/fonts/LilitaOne-latin.woff2') format('woff2');font-weight:400;font-style:normal;font-display:block;}`;
const abs = (l, t, w, h) => `position:absolute;left:${l}px;top:${t}px;width:${w}px;${h != null ? `height:${h}px;` : ""}`;

function scene(id, title, start, dur, css, body, js, defs = "", opts = {}) {
  const exit = opts.exit !== false, kb = opts.kb !== false, exDur = opts.exitDur || 0.24, exLead = opts.exitLead ?? 0.18;
  const html = `<template>
  <style>
    ${FONTFACE}
    #root { position: absolute; inset: 0; overflow: hidden; }
    #${id}-out, #${id}-kb { position: absolute; inset: 0; transform-origin: 540px 1200px; }
    .${id}-stk { ${STK} }
    .cn, .pe { position: absolute; }
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
${kb ? `      // slow drift so the frame never stands still
      tl.fromTo("#${id}-kb", { scale: 1 }, { scale: 1.04, duration: ${dur}, ease: "none" }, 0);` : ""}
${js}
${exit ? `      // overlap exit: fades while the next scene is already entering (no empty frames)
      tl.to("#${id}-out", { opacity: 0, scale: 0.93, duration: ${exDur}, ease: "power2.in" }, ${+(dur - exLead).toFixed(2)});` : ""}
      window.__timelines["${id}"] = tl;
    })();
  </script>
</template>
`;
  fs.writeFileSync(path.join(OUT, "compositions", `${id}.html`), html);
  return { id, title, start, dur, host: +(dur + (exit ? 0.3 : 0)).toFixed(2) };
}
const shake = (sel, at, a = 18, d = 0.32) => `      tl.to("${sel}", { keyframes: { x: [0, ${-a}, ${+(a * 0.8).toFixed(1)}, ${+(-a * 0.5).toFixed(1)}, ${+(a * 0.3).toFixed(1)}, 0], y: [0, ${+(a * 0.5).toFixed(1)}, ${+(-a * 0.4).toFixed(1)}, ${+(a * 0.2).toFixed(1)}, 0, 0] }, duration: ${d}, ease: "none" }, ${at});`;

// ================= timing (one row per caption / scene) =================
const T = {
  hook: [0, 3.4], forum: [3.4, 5.9], bubble: [5.9, 8.0], deal: [8.0, 10.1], phone: [10.1, 12.6], wert: [12.6, 15.45],
  bon: [15.45, 17.55], gut: [17.55, 19.25], chart: [19.25, 21.35], steil: [21.35, 23.45], gipfel: [23.45, 25.65],
  rechnung: [25.65, 28.15], milliarde: [28.15, 30.75], stueck: [30.75, 33.25], kalender: [33.25, 36.1], frage: [36.1, 39.0],
  loopend: [39.0, DUR],
};
const S = (k) => [T[k][0], +(T[k][1] - T[k][0]).toFixed(2)];
const scenes = [];

// ================= HOOK picture (frame 0 = thumbnail motif) =================
// graphics stay below y 740 (hook captions end ~680)
const HCOLS = [[150, 9], [235, 13], [320, 16], [405, 14], [490, 11], [565, 7]];
const hookCss = (p) => `
   #${p}-glow{${abs(90, 800, 900, 720)}border-radius:50%;background:radial-gradient(circle,rgba(255,197,46,.5) 0%,rgba(255,197,46,.16) 42%,rgba(255,197,46,0) 68%);}
   #${p}-boxB{${abs(100, 1300, 500, 190)}} #${p}-boxA{${abs(130, 1150, 500, 190)}}
   .${p}-col{position:absolute;transform-origin:50% 100%;}
   #${p}-heap{position:absolute;inset:0;}`;
const hookBody = (p) => {
  const cols = HCOLS.map(([x, n], i) => { const c = column(n); return `<div id="${p}-col${i}" class="${p}-col ${p}-stk" style="left:${x}px;top:${1196 - c.h}px;width:120px;height:${c.h}px;">${c.svg}</div>`; }).join("\n");
  return `      <div id="${p}-glow"></div>
      <div id="${p}-boxB" class="${p}-stk">${BOX}</div>
      <div id="${p}-boxA" class="${p}-stk">${BOX}</div>
      <div id="${p}-heap">
${cols}
      ${coin(p + "-fc0", p, 70, 1020, 170, "")}
      ${coin(p + "-fc1", p, 330, 1070, 140, "")}
      ${coin(p + "-fc2", p, 560, 980, 180, "")}
      </div>
      ${coin(p + "-fl0", p, 770, 860, 130, "")}
      ${coin(p + "-fl1", p, 900, 1050, 100, "")}
      ${coin(p + "-fl2", p, 760, 1230, 110, "")}`;
};
{
  const p = "hook";
  const [s, d] = S("hook");
  scenes.push(scene(p, "Hook: Pizza gegen Münzen", s, d, hookCss(p), hookBody(p),
    `      // frame 0 already shows the full motif (thumbnail picture)
      tl.to("#hook-glow", { scale: 1.08, opacity: 0.75, duration: 0.6, yoyo: true, repeat: 4, ease: "sine.inOut" }, 0);
      [0, 1, 2, 3, 4, 5].forEach((i) => tl.to("#hook-col" + i, { rotation: (i % 2 ? 2.5 : -2.5), duration: 0.32, yoyo: true, repeat: 2, ease: "sine.inOut" }, 0.02 * i));
      [0, 1, 2].forEach((i) => tl.to("#hook-fl" + i, { y: (i % 2 ? -26 : 22), rotation: (i % 2 ? 18 : -14), duration: 0.6, yoyo: true, repeat: 4, ease: "sine.inOut" }, 0.05 * i));
      [0, 1, 2].forEach((i) => tl.to("#hook-fl" + i, { keyframes: { scaleX: [1, 0.15, 1, 0.15, 1] }, duration: 0.8, ease: "none" }, 0.3 + 0.2 * i));
      // 1.2 s: 10.000 BITCOIN, the heap wobbles hard
${shake("#hook-kb", 1.22, 16, 0.4)}
      [0, 1, 2, 3, 4, 5].forEach((i) => tl.to("#hook-col" + i, { keyframes: { y: [0, -34, 0, -12, 0], scaleY: [1, 1.06, 0.94, 1.02, 1] }, duration: 0.5, ease: "none" }, 1.22 + 0.03 * i));
      [0, 1, 2].forEach((i) => tl.to("#hook-fc" + i, { keyframes: { y: [0, -40, 0], rotation: [0, i % 2 ? 12 : -12, 0] }, duration: 0.45, ease: "power1.inOut" }, 1.25 + 0.05 * i));
      tl.to(["#hook-boxA", "#hook-boxB"], { keyframes: { scaleY: [1, 0.9, 1.03, 1] }, duration: 0.35, ease: "none", transformOrigin: "50% 100%", stagger: 0.04 }, 1.22);
      [0, 1, 2, 3, 4, 5].forEach((i) => tl.to("#hook-col" + i, { rotation: (i % 2 ? -2 : 2), duration: 0.4, yoyo: true, repeat: 2, ease: "sine.inOut" }, 1.9 + 0.03 * i));`,
    coinSym(p)));
}

// ================= forum window, cursor types (3.4 - 5.9) =================
const WIN_CSS = (p, top, h) => `#${p}-win{${abs(80, top, 920, h)}border-radius:26px;background:#EEF0F6;border:10px solid ${K};overflow:hidden;}
     #${p}-bar{position:absolute;left:0;top:0;right:0;height:78px;background:linear-gradient(90deg,#2B5BD7,#5B8BFF);border-bottom:8px solid ${K};}
     #${p}-bar b{position:absolute;left:30px;top:18px;width:250px;height:34px;border-radius:17px;background:rgba(255,255,255,.85);}
     #${p}-bar i{position:absolute;top:18px;width:38px;height:38px;border-radius:10px;border:5px solid ${K};}`;
const WIN_BAR = (p) => `<div id="${p}-bar"><b></b><i style="right:130px;background:#FFD23F"></i><i style="right:80px;background:#3FE07A"></i><i style="right:30px;background:#FF3B3B"></i></div>`;
{
  const p = "forum";
  const [s, d] = S(p);
  const lines = [[300, 520], [300, 470], [300, 380], [300, 300]];
  scenes.push(scene(p, "Forum", s, d,
    WIN_CSS(p, 720, 700) + `
     #forum-av{${abs(40, 120, 200, 200)}}
     #forum-name{${abs(270, 140, 260, 36)}border-radius:18px;background:#2B5BD7;}
     #forum-time{${abs(550, 146, 160, 26)}border-radius:13px;background:#B8C0D6;}
     .forum-ln{position:absolute;height:34px;border-radius:17px;background:#3B4552;transform-origin:0 50%;}
     #forum-caret{${abs(300, 222, 16, 50)}background:${K};}
     #forum-post{${abs(40, 500, 820, 120)}border-radius:20px;border:6px dashed #9AA6C4;}
     #forum-send{${abs(600, 520, 240, 80)}border-radius:40px;background:#3FE07A;border:6px solid ${K};}
     #forum-send svg{position:absolute;left:84px;top:8px;}`,
    `      <div id="forum-win" class="forum-stk">${WIN_BAR(p)}
        <div id="forum-av">${AVATAR("dev")}</div>
        <div id="forum-name"></div><div id="forum-time"></div>
${lines.map(([x, w], i) => `        <div id="forum-ln${i}" class="forum-ln" style="left:${x}px;top:${226 + i * 62}px;width:${w}px;"></div>`).join("\n")}
        <div id="forum-caret"></div>
        <div id="forum-post"></div>
        <div id="forum-send"><svg viewBox="0 0 60 60" width="60" height="60"><path d="M6 30 L54 8 L42 54 L30 36 Z" fill="#fff" stroke="${K}" stroke-width="6" stroke-linejoin="round"/></svg></div>
      </div>`,
    `      tl.fromTo("#forum-win", { y: 900, rotation: 6 }, { y: 0, rotation: 0, duration: 0.4, ease: "back.out(1.3)" }, 0);
      tl.fromTo("#forum-av", { scale: 0 }, { scale: 1, duration: 0.3, ease: "back.out(2.4)" }, 0.3);
      tl.fromTo(["#forum-name", "#forum-time"], { scaleX: 0, transformOrigin: "0 50%" }, { scaleX: 1, duration: 0.25, stagger: 0.08 }, 0.4);
      const L = ${JSON.stringify(lines)};
      L.forEach(([x, w], i) => {
        const t0 = 0.6 + i * 0.42;
        tl.fromTo("#forum-ln" + i, { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: "steps(8)" }, t0);
        tl.fromTo("#forum-caret", { x: 0, y: i * 62 }, { x: w + 6, y: i * 62, duration: 0.4, ease: "steps(8)", immediateRender: false }, t0);
      });
      tl.to("#forum-caret", { keyframes: { opacity: [1, 0, 1, 0, 1] }, duration: 0.6, ease: "steps(4)" }, 2.3);
      tl.fromTo("#forum-send", { scale: 0 }, { scale: 1, duration: 0.25, ease: "back.out(2.5)" }, 1.4);
      tl.to("#forum-send", { scale: 0.88, duration: 0.08, yoyo: true, repeat: 1 }, 2.25);`,
    ""));
}

// ================= speech bubble with pizza (5.9 - 8.0) =================
{
  const p = "bubble";
  const [s, d] = S(p);
  scenes.push(scene(p, "Wer bringt Pizza", s, d,
    `#bubble-av{${abs(90, 1200, 230, 230)}}
     #bubble-b{${abs(250, 720, 740, 500)}border-radius:70px;background:#fff;border:12px solid ${K};}
     #bubble-tail{${abs(250, 1120, 160, 140)}}
     #bubble-pz{${abs(440, 760, 400, 400)}}
     .bubble-q{position:absolute;font-family:'Lilita One';font-size:130px;line-height:1;color:${YEL};-webkit-text-stroke:12px ${K};paint-order:stroke fill;}`,
    `      <div id="bubble-tail" class="bubble-stk"><svg viewBox="0 0 160 140" width="160" height="140" overflow="visible"><path d="M60 0 L150 0 L10 136 Z" fill="#fff" stroke="${K}" stroke-width="12" stroke-linejoin="round"/><rect x="50" y="-14" width="110" height="20" fill="#fff"/></svg></div>
      <div id="bubble-b" class="bubble-stk"></div>
      <div id="bubble-pz">${PIZZA()}</div>
      <div id="bubble-q0" class="bubble-q" style="left:300px;top:800px;">?</div>
      <div id="bubble-q1" class="bubble-q" style="left:880px;top:1030px;">?</div>
      <div id="bubble-av" class="bubble-stk">${AVATAR("dev")}</div>`,
    `      tl.fromTo("#bubble-av", { x: -400 }, { x: 0, duration: 0.35, ease: "back.out(1.5)" }, 0);
      tl.fromTo(["#bubble-b", "#bubble-tail"], { scale: 0, transformOrigin: "10% 100%" }, { scale: 1, duration: 0.35, ease: "back.out(1.7)" }, 0.12);
      tl.fromTo("#bubble-pz", { scale: 0, rotation: -200 }, { scale: 1, rotation: 0, duration: 0.45, ease: "back.out(1.8)" }, 0.3);
      tl.to("#bubble-pz", { rotation: 30, duration: 1.4, ease: "sine.inOut" }, 0.75);
      tl.to("#bubble-pz", { keyframes: { scale: [1, 1.1, 1] }, duration: 0.3, ease: "sine.inOut" }, 0.62);
      tl.fromTo(["#bubble-q0", "#bubble-q1"], { scale: 0, rotation: -30 }, { scale: 1, rotation: (i) => (i ? 14 : -12), duration: 0.3, ease: "back.out(2.6)", stagger: 0.15 }, 0.55);
      tl.to(["#bubble-q0", "#bubble-q1"], { y: -18, duration: 0.3, yoyo: true, repeat: 3, ease: "sine.inOut", stagger: 0.1 }, 0.9);
      tl.to("#bubble-av", { y: -16, duration: 0.18, yoyo: true, repeat: 5, ease: "sine.inOut" }, 0.4);`,
    ""));
}

// ================= second user says DEAL: handshake (8.0 - 10.1) =================
{
  const p = "deal";
  const [s, d] = S(p);
  const star = (id, x, y, sz) => `<div id="${id}" class="pe" style="left:${x}px;top:${y}px;width:${sz}px;height:${sz}px;"><svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M50 2 L62 38 L98 50 L62 62 L50 98 L38 62 L2 50 L38 38 Z" fill="${YEL}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/></svg></div>`;
  scenes.push(scene(p, "Deal", s, d,
    `#deal-a1{${abs(90, 760, 250, 250)}} #deal-a2{${abs(740, 760, 250, 250)}}
     #deal-hs{${abs(240, 1030, 600, 360)}}
     #deal-ok{${abs(860, 730, 120, 120)}border-radius:50%;background:${GREEN};border:8px solid ${K};}
     #deal-ok svg{position:absolute;left:18px;top:20px;}`,
    `      <div id="deal-a1" class="deal-stk">${AVATAR("dev")}</div>
      <div id="deal-a2" class="deal-stk">${AVATAR("teen")}</div>
      <div id="deal-hs" class="deal-stk"><svg viewBox="0 0 600 360" width="100%" height="100%" overflow="visible">
        <path d="M0 150 L190 150 L230 210 L190 270 L0 270 Z" fill="#2B5BD7" stroke="${K}" stroke-width="9" stroke-linejoin="round"/>
        <path d="M600 150 L410 150 L370 210 L410 270 L600 270 Z" fill="${RED}" stroke="${K}" stroke-width="9" stroke-linejoin="round"/>
        <path d="M180 140 Q260 110 330 140 L410 200 Q420 240 380 240 L300 200 Q250 260 200 270 Q170 240 180 140 Z" fill="#C98A5B" stroke="${K}" stroke-width="9" stroke-linejoin="round"/>
        <path d="M420 150 Q350 120 300 150 Q270 180 300 200 Q340 190 360 175 L420 270 Q300 300 230 250 Q220 210 250 190" fill="#F2C29B" stroke="${K}" stroke-width="9" stroke-linejoin="round"/>
        <path d="M260 210 q30 -10 50 6 M270 236 q30 -6 46 10" stroke="${K}" stroke-width="7" fill="none" stroke-linecap="round"/>
      </svg></div>
      ${star("deal-s0", 200, 1000, 90)}${star("deal-s1", 800, 1020, 70)}${star("deal-s2", 500, 960, 60)}
      <div id="deal-ok"><svg viewBox="0 0 80 80" width="70" height="70"><path d="M10 42 L32 62 L72 16" stroke="#fff" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`,
    `      tl.fromTo("#deal-a1", { x: -450 }, { x: 0, duration: 0.35, ease: "back.out(1.4)" }, 0);
      tl.fromTo("#deal-a2", { x: 450 }, { x: 0, duration: 0.35, ease: "back.out(1.4)" }, 0.08);
      tl.fromTo("#deal-hs", { scale: 0.2, opacity: 0, y: 120 }, { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: "back.out(2)" }, 0.22);
      tl.to("#deal-hs", { keyframes: { y: [0, -30, 0, -30, 0, -20, 0] }, duration: 0.9, ease: "none" }, 0.55);
${shake("#deal-kb", 0.24, 16, 0.3)}
      ["#deal-s0", "#deal-s1", "#deal-s2"].forEach((id, i) => {
        tl.fromTo(id, { scale: 0, rotation: -60 }, { scale: 1, rotation: 0, duration: 0.25, ease: "back.out(3)" }, 0.4 + i * 0.1);
        tl.to(id, { rotation: 45, scale: 0.8, duration: 0.5, yoyo: true, repeat: 2, ease: "sine.inOut" }, 0.7 + i * 0.1);
      });
      tl.fromTo("#deal-ok", { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2.6)" }, 0.6);
      tl.to("#deal-a2", { rotation: 6, duration: 0.3, yoyo: true, repeat: 3, ease: "sine.inOut" }, 0.7);`,
    ""));
}

// ================= phone rings, two boxes slide in (10.1 - 12.6) =================
{
  const p = "phone";
  const [s, d] = S(p);
  scenes.push(scene(p, "Bestellung", s, d,
    `#phone-ph{${abs(100, 860, 400, 380)}transform-origin:50% 100%;}
     #phone-rings{${abs(60, 760, 480, 200)}}
     #phone-b1{${abs(540, 1180, 460, 175)}} #phone-b2{${abs(570, 1040, 460, 175)}}
     .phone-st{position:absolute;width:24px;height:90px;border-radius:12px;background:#E8EDF3;opacity:0;}`,
    `      <div id="phone-rings"><svg viewBox="0 0 480 200" width="100%" height="100%" overflow="visible"><g fill="none" stroke="${YEL}" stroke-width="16" stroke-linecap="round">
        <path id="phone-r0" d="M150 150 Q120 100 150 50"/><path id="phone-r1" d="M100 170 Q50 100 100 30"/><path id="phone-r2" d="M330 150 Q360 100 330 50"/><path id="phone-r3" d="M380 170 Q430 100 380 30"/></g></svg></div>
      <div id="phone-ph" class="phone-stk"><svg viewBox="0 0 400 380" width="100%" height="100%" overflow="visible">
        <path id="phone-hand" d="M40 70 Q40 20 100 24 L300 24 Q360 20 360 70 L360 100 Q360 120 330 120 L290 120 Q270 120 270 100 L270 82 L130 82 L130 100 Q130 120 110 120 L70 120 Q40 120 40 100 Z" fill="${RED}" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>
        <path d="M70 160 Q80 130 120 130 L280 130 Q320 130 330 160 L380 350 Q382 372 360 372 L40 372 Q18 372 20 350 Z" fill="${RED}" stroke="${K}" stroke-width="10" stroke-linejoin="round"/>
        <circle cx="200" cy="262" r="78" fill="#fff" stroke="${K}" stroke-width="9"/>
        <g fill="${K}">${Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 1.6 + Math.PI * 0.7; return `<circle cx="${(200 + Math.cos(a) * 52).toFixed(1)}" cy="${(262 + Math.sin(a) * 52).toFixed(1)}" r="10"/>`; }).join("")}</g>
        <circle cx="200" cy="262" r="20" fill="${YEL}" stroke="${K}" stroke-width="6"/>
      </svg></div>
      <div id="phone-b1" class="phone-stk">${BOX}</div>
      <div id="phone-b2" class="phone-stk">${BOX}</div>
      <div id="phone-st0" class="phone-st" style="left:680px;top:960px;"></div><div id="phone-st1" class="phone-st" style="left:780px;top:940px;"></div><div id="phone-st2" class="phone-st" style="left:880px;top:960px;"></div>`,
    `      tl.fromTo("#phone-ph", { y: 700 }, { y: 0, duration: 0.35, ease: "back.out(1.4)" }, 0);
      tl.to("#phone-ph", { keyframes: { rotation: [0, -7, 7, -7, 7, -5, 5, 0] }, duration: 0.6, ease: "none" }, 0.3);
      tl.to("#phone-ph", { keyframes: { rotation: [0, -7, 7, -7, 7, -5, 5, 0] }, duration: 0.6, ease: "none" }, 1.1);
      tl.to("#phone-hand", { y: -40, rotation: -8, svgOrigin: "200 70", duration: 0.25, ease: "power2.out" }, 1.8);
      ["#phone-r0", "#phone-r1", "#phone-r2", "#phone-r3"].forEach((id, i) => tl.fromTo(id, { opacity: 0 }, { keyframes: { opacity: [0, 1, 0, 1, 0] }, duration: 1.4, ease: "none" }, 0.3 + (i % 2) * 0.08));
      tl.fromTo("#phone-b1", { x: 700 }, { x: 0, duration: 0.4, ease: "back.out(1.3)" }, 0.9);
      tl.fromTo("#phone-b2", { x: 700 }, { x: 0, duration: 0.4, ease: "back.out(1.3)" }, 1.1);
      tl.to(["#phone-b1", "#phone-b2"], { keyframes: { scaleY: [1, 0.9, 1.04, 1] }, duration: 0.3, ease: "none", transformOrigin: "50% 100%", stagger: 0.15 }, 1.3);
      [0, 1, 2].forEach((i) => tl.fromTo("#phone-st" + i, { opacity: 0, y: 30, scaleY: 0.5 }, { keyframes: { opacity: [0, 0.8, 0], y: [30, -20, -90], x: [0, 12, -8] }, scaleY: 1.1, duration: 0.9, ease: "none", immediateRender: false }, 1.5 + i * 0.2));`,
    ""));
}

// ================= coin worth almost nothing: shrinks, magnifier, price tag (12.6 - 15.45) =================
{
  const p = "wert";
  const [s, d] = S(p);
  scenes.push(scene(p, "Fast nichts wert", s, d,
    `#wert-c{${abs(300, 800, 300, 300)}}
     #wert-lens{${abs(250, 760, 440, 520)}}
     #wert-tag{${abs(560, 760, 400, 170)}transform-origin:12% 50%;}
     #wert-str{${abs(470, 830, 160, 160)}}
     #wert-arrow{${abs(110, 1080, 150, 220)}}
     .wert-puff{position:absolute;width:60px;height:60px;border-radius:50%;background:#E8EDF3;opacity:0;}`,
    `      <div id="wert-str"><svg viewBox="0 0 160 160" width="100%" height="100%" overflow="visible"><path id="wert-sp" d="M10 140 Q60 120 140 15" stroke="#E8EDF3" stroke-width="8" fill="none" stroke-linecap="round" stroke-dasharray="300" stroke-dashoffset="300"/></svg></div>
      ${coin("wert-c", p, 300, 800, 300)}
${[0, 1, 2, 3].map((i) => `      <div id="wert-pf${i}" class="wert-puff" style="left:${[330, 520, 340, 510][i]}px;top:${[830, 830, 1020, 1020][i]}px;"></div>`).join("\n")}
      <div id="wert-tag" class="wert-stk"><svg viewBox="0 0 400 170" width="100%" height="100%" overflow="visible">
        <path d="M60 8 L380 8 Q394 8 394 22 L394 148 Q394 162 380 162 L60 162 L6 85 Z" fill="#fff" stroke="${K}" stroke-width="9" stroke-linejoin="round"/>
        <circle cx="54" cy="85" r="14" fill="#0E1530" stroke="${K}" stroke-width="5"/>
        <text x="238" y="112" text-anchor="middle" font-family="Lilita One" font-size="76" fill="${RED}">&lt; 1 Cent</text></svg></div>
      <div id="wert-lens"><svg viewBox="0 0 440 520" width="100%" height="100%" overflow="visible">
        <path d="M300 330 L410 480" stroke="${K}" stroke-width="64" stroke-linecap="round"/><path d="M300 330 L410 480" stroke="#8B5A2B" stroke-width="40" stroke-linecap="round"/>
        <circle cx="200" cy="200" r="160" fill="rgba(191,230,255,.18)" stroke="${K}" stroke-width="38"/><circle cx="200" cy="200" r="160" fill="none" stroke="#A8B3C2" stroke-width="14"/>
        <path d="M110 130 Q140 90 190 80" stroke="#fff" stroke-width="16" fill="none" stroke-linecap="round" opacity=".8"/></svg></div>
      <div id="wert-arrow" class="wert-stk"><svg viewBox="0 0 150 220" width="100%" height="100%" overflow="visible"><path d="M45 0 L105 0 L105 130 L145 130 L75 215 L5 130 L45 130 Z" fill="${RED}" stroke="${K}" stroke-width="9" stroke-linejoin="round"/></svg></div>`,
    `      tl.fromTo("#wert-c", { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2)" }, 0);
      tl.to("#wert-c", { scale: 0.22, duration: 0.35, ease: "back.in(2)" }, 0.55);
      [0, 1, 2, 3].forEach((i) => tl.fromTo("#wert-pf" + i, { opacity: 0, scale: 0.3 }, { keyframes: { opacity: [0, 0.9, 0] }, scale: 1.6, x: [-50, 50, -50, 50][i], y: [-40, -40, 40, 40][i], duration: 0.5, ease: "power2.out", immediateRender: false }, 0.85));
      tl.fromTo("#wert-arrow", { y: -300, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "bounce.out" }, 0.6);
      tl.fromTo("#wert-lens", { x: 600, y: 300, rotation: 30, opacity: 0 }, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 0.45, ease: "back.out(1.3)" }, 1.0);
      tl.to("#wert-c", { scale: 0.4, duration: 0.25, ease: "back.out(2)" }, 1.4);
      tl.to("#wert-lens", { x: 26, y: -14, duration: 0.5, yoyo: true, repeat: 2, ease: "sine.inOut" }, 1.5);
      tl.to("#wert-sp", { strokeDashoffset: 0, duration: 0.3, ease: "power1.out" }, 1.2);
      tl.fromTo("#wert-tag", { scale: 0, rotation: -40 }, { scale: 1, rotation: 8, duration: 0.35, ease: "back.out(2)" }, 1.35);
      tl.to("#wert-tag", { rotation: -4, duration: 0.45, yoyo: true, repeat: 2, ease: "sine.inOut" }, 1.7);
      tl.to("#wert-c", { rotation: 20, duration: 0.3, yoyo: true, repeat: 5, ease: "sine.inOut" }, 1.0);`,
    coinSym(p)));
}

// ================= receipt prints ≈ 41 $ (15.45 - 17.55) =================
{
  const p = "bon";
  const [s, d] = S(p);
  const zig = Array.from({ length: 13 }, (_, i) => `${i * 30} ${i % 2 ? 0 : 16}`).join(" L");
  scenes.push(scene(p, "Kassenzettel", s, d,
    `#bon-clip{position:absolute;left:0;top:720px;width:1080px;height:520px;overflow:hidden;}
     #bon-paper{${abs(330, 30, 360, 500)}}
     #bon-reg{${abs(200, 1200, 680, 260)}}`,
    `      <div id="bon-clip"><div id="bon-paper"><svg viewBox="0 0 360 500" width="100%" height="100%" overflow="visible">
        <path d="M0 16 L${zig} L360 16 L360 500 L0 500 Z" fill="#FFFDF4" stroke="${K}" stroke-width="7"/>
        <rect x="80" y="44" width="200" height="30" rx="10" fill="#0E1530"/>
        <g fill="#C9D3E0"><rect x="40" y="110" width="280" height="14" rx="7"/><rect x="40" y="140" width="220" height="14" rx="7"/></g>
        <circle cx="72" cy="206" r="28" fill="#FFD86B" stroke="#C98A3B" stroke-width="6"/><circle cx="64" cy="200" r="7" fill="#D9412B"/><circle cx="80" cy="214" r="6" fill="#D9412B"/>
        <text x="120" y="222" font-family="Lilita One" font-size="52" fill="${K}">PIZZA ×2</text>
        <path d="M30 270 H330" stroke="${K}" stroke-width="6" stroke-dasharray="14 10"/>
        <text x="180" y="390" text-anchor="middle" font-family="Lilita One" font-size="118" fill="${RED}">≈ 41 $</text>
        <path d="M30 430 H330" stroke="${K}" stroke-width="6" stroke-dasharray="14 10"/>
      </svg></div></div>
      <div id="bon-reg" class="bon-stk"><svg viewBox="0 0 680 260" width="100%" height="100%" overflow="visible">
        <rect x="100" y="10" width="480" height="70" rx="22" fill="#5B6577" stroke="${K}" stroke-width="9"/>
        <rect x="150" y="30" width="380" height="22" rx="11" fill="${K}"/>
        <path d="M30 90 L650 90 L640 250 L40 250 Z" fill="#8A96A6" stroke="${K}" stroke-width="9" stroke-linejoin="round"/>
        <g fill="#E8EDF3" stroke="${K}" stroke-width="5">${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${90 + i * 85}" y="120" width="64" height="44" rx="10"/>`).join("")}${[0, 1, 2, 3].map((i) => `<rect x="${130 + i * 110}" y="182" width="84" height="44" rx="10"/>`).join("")}</g>
        <rect x="560" y="182" width="70" height="44" rx="10" fill="${GREEN}" stroke="${K}" stroke-width="5"/>
      </svg></div>`,
    `      tl.fromTo("#bon-reg", { y: 600 }, { y: 0, duration: 0.35, ease: "back.out(1.4)" }, 0);
      tl.fromTo("#bon-paper", { y: 520 }, { y: 0, duration: 1.1, ease: "steps(14)" }, 0.3);
      tl.to("#bon-reg", { keyframes: { y: [0, -6, 0, -6, 0, -6, 0] }, duration: 1.1, ease: "none" }, 0.3);
      tl.to("#bon-paper", { rotation: -3, duration: 0.5, yoyo: true, repeat: 1, ease: "sine.inOut" }, 1.45);`,
    ""));
}

// ================= good deal? open box with a slice missing, check stamp (17.55 - 19.25) =================
{
  const p = "gut";
  const [s, d] = S(p);
  scenes.push(scene(p, "Guter Deal", s, d,
    `#gut-box{${abs(170, 720, 740, 700)}}
     #gut-pz{${abs(310, 960, 460, 460)}}
     #gut-ok{${abs(700, 1140, 230, 230)}}
     .gut-st{position:absolute;width:26px;height:90px;border-radius:13px;background:#E8EDF3;opacity:0;}`,
    `      <div id="gut-box" class="gut-stk"><svg viewBox="0 0 740 700" width="100%" height="100%" overflow="visible">
        <path d="M80 10 L660 10 L700 250 L40 250 Z" fill="#E0BF86" stroke="${K}" stroke-width="9" stroke-linejoin="round"/>
        <ellipse cx="370" cy="130" rx="120" ry="50" fill="none" stroke="${RED}" stroke-width="10"/>
        <path d="M20 250 L720 250 L720 680 L20 680 Z" fill="#F6E6C4" stroke="${K}" stroke-width="9" stroke-linejoin="round"/>
        <path d="M50 280 L690 280 L690 650 L50 650 Z" fill="#EBD3A4"/>
      </svg></div>
      <div id="gut-pz">${PIZZA(true)}</div>
      <div id="gut-ok" class="gut-stk"><svg viewBox="0 0 230 230" width="100%" height="100%"><circle cx="115" cy="115" r="105" fill="${GREEN}" stroke="${K}" stroke-width="12"/><path d="M60 120 L100 160 L170 76" stroke="#fff" stroke-width="26" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <div id="gut-st0" class="gut-st" style="left:420px;top:900px;"></div><div id="gut-st1" class="gut-st" style="left:520px;top:880px;"></div><div id="gut-st2" class="gut-st" style="left:620px;top:900px;"></div>`,
    `      tl.fromTo(["#gut-box", "#gut-pz"], { y: 800 }, { y: 0, duration: 0.35, ease: "back.out(1.3)", stagger: 0.05 }, 0);
      tl.fromTo("#gut-ok", { scale: 2.6, opacity: 0, rotation: -30 }, { scale: 1, opacity: 1, rotation: -8, duration: 0.2, ease: "power4.in" }, 0.45);
${shake("#gut-kb", 0.65, 12, 0.26)}
      tl.to("#gut-pz", { rotation: 12, duration: 1.2, ease: "sine.inOut" }, 0.4);
      [0, 1, 2].forEach((i) => tl.fromTo("#gut-st" + i, { opacity: 0, y: 30, scaleY: 0.5 }, { keyframes: { opacity: [0, 0.8, 0], y: [30, -20, -90], x: [0, 12, -8] }, scaleY: 1.1, duration: 0.9, ease: "none", immediateRender: false }, 0.3 + i * 0.25));`,
    ""));
}

// ================= stock chart: candles + line shoot up (19.25 - 21.35) =================
const PANEL_CSS = (p, top = 720, h = 700) => `#${p}-pan{${abs(80, top, 920, h)}border-radius:30px;background:#0B1226;border:10px solid ${K};overflow:hidden;}
     #${p}-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.07) 2px,transparent 2px),linear-gradient(90deg,rgba(255,255,255,.07) 2px,transparent 2px);background-size:100px 100px;}`;
const candle = (cls, x, yTop, h, up) => `<g class="${cls}"><line x1="${x + 22}" y1="${yTop - 26}" x2="${x + 22}" y2="${yTop + h + 26}" stroke="${up ? GREEN : RED}" stroke-width="7"/><rect x="${x}" y="${yTop}" width="44" height="${h}" rx="6" fill="${up ? GREEN : RED}" stroke="${K}" stroke-width="4"/></g>`;
{
  const p = "chart";
  const [s, d] = S(p);
  const cs = [[60, 560, 60, 1], [140, 540, 50, 0], [220, 520, 70, 1], [300, 470, 60, 1], [380, 470, 40, 0], [460, 380, 90, 1], [540, 300, 100, 1], [620, 190, 120, 1], [700, 100, 110, 1]];
  scenes.push(scene(p, "Kurs steigt", s, d,
    PANEL_CSS(p) + `#chart-arw{${abs(700, 40, 160, 160)}}`,
    `      <div id="chart-pan" class="chart-stk"><div id="chart-grid"></div>
        <svg viewBox="0 0 900 680" width="900" height="680" style="position:absolute;left:0;top:0" overflow="visible">
          ${cs.map(([x, y, h, u], i) => candle("chart-cd", x, y, h, u)).join("")}
          <path id="chart-line" d="M40 620 L160 600 L240 590 L320 520 L400 540 L480 430 L560 340 L640 230 L740 120" stroke="${YEL}" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 2" stroke-dashoffset="1.2"/>
        </svg>
        <div id="chart-arw"><svg viewBox="0 0 160 160" width="160" height="160" overflow="visible"><path d="M20 140 L110 50 M60 40 L120 40 L120 100" stroke="${K}" stroke-width="40" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 140 L110 50 M60 40 L120 40 L120 100" stroke="${GREEN}" stroke-width="22" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      </div>`,
    `      tl.fromTo("#chart-pan", { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.6)" }, 0);
      tl.fromTo(".chart-cd", { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 0.2, ease: "back.out(2.5)", stagger: 0.11 }, 0.2);
      tl.to("#chart-line", { strokeDashoffset: 0, duration: 1.1, ease: "power2.in" }, 0.25);
      tl.fromTo("#chart-arw", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2.5)" }, 1.3);
      tl.to("#chart-arw", { x: 14, y: -14, duration: 0.2, yoyo: true, repeat: 3, ease: "sine.inOut" }, 1.6);`,
    ""));
}

// ================= chart grows out of the frame, the view pans up (21.35 - 23.45) =================
{
  const p = "steil";
  const [s, d] = S(p);
  const H = 2000;
  const pts = []; for (let i = 0; i <= 12; i++) pts.push([60 + i * 64, Math.round(H - 80 - Math.pow(i / 12, 1.6) * (H - 160) + (i % 3 === 1 ? 40 : 0))]);
  const cds = pts.slice(0, 12).map(([x, y], i) => candle("steil-cd", x - 10, y - 90, 110, i % 4 !== 2)).join("");
  scenes.push(scene(p, "Kurs steigt weiter", s, d,
    PANEL_CSS(p) + `#steil-in{position:absolute;left:0;top:0;width:900px;height:${H}px;}
     .steil-sp{position:absolute;width:12px;border-radius:6px;background:rgba(255,255,255,.5);}`,
    `      <div id="steil-pan" class="steil-stk"><div id="steil-in"><div id="steil-grid" style="position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.07) 2px,transparent 2px),linear-gradient(90deg,rgba(255,255,255,.07) 2px,transparent 2px);background-size:100px 100px;"></div>
        <svg viewBox="0 0 900 ${H}" width="900" height="${H}" style="position:absolute;left:0;top:0" overflow="visible">${cds}
          <path id="steil-line" d="M${pts.map((q) => q.join(" ")).join(" L")}" stroke="${YEL}" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 2" stroke-dashoffset="1.2"/></svg>
      </div>
      <div id="steil-s0" class="steil-sp" style="left:120px;top:120px;height:160px;"></div><div id="steil-s1" class="steil-sp" style="left:260px;top:60px;height:220px;"></div><div id="steil-s2" class="steil-sp" style="left:420px;top:180px;height:140px;"></div></div>`,
    `      tl.set("#steil-pan", { opacity: 1 }, 0);
      tl.fromTo("#steil-in", { y: -${H - 680} }, { y: 0, duration: 1.9, ease: "power1.in" }, 0.05);
      tl.fromTo("#steil-line", { strokeDashoffset: 0.66 }, { strokeDashoffset: 0, duration: 1.9, ease: "power1.in" }, 0.05);
      tl.fromTo(".steil-cd", { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 0.18, ease: "back.out(2.5)", stagger: 0.12 }, 0.05);
      ["#steil-s0", "#steil-s1", "#steil-s2"].forEach((id, i) => tl.fromTo(id, { y: -200, opacity: 0 }, { y: 500, opacity: 0.8, duration: 0.5, ease: "none", repeat: 2, immediateRender: false }, 0.4 + i * 0.15));
      tl.to(["#steil-s0", "#steil-s1", "#steil-s2"], { opacity: 0, duration: 0.1 }, 1.95);
${shake("#steil-kb", 1.9, 10, 0.3)}`,
    "", { kb: false }));
}

// ================= peak with pennant: record ≈ 126.000 $ (23.45 - 25.65) =================
{
  const p = "gipfel";
  const [s, d] = S(p);
  scenes.push(scene(p, "Rekordhoch", s, d,
    PANEL_CSS(p, 740, 680) + `
     #gipfel-flag{${abs(320, 50, 560, 300)}transform-origin:62% 100%;}
     .gipfel-cf{position:absolute;width:20px;height:34px;border-radius:5px;}`,
    `      <div id="gipfel-pan" class="gipfel-stk"><div id="gipfel-grid"></div>
        <svg viewBox="0 0 900 660" width="900" height="660" style="position:absolute;left:0;top:0" overflow="visible">
          <path id="gipfel-area" d="M0 660 L0 600 L120 560 L220 590 L320 470 L400 500 L500 380 L580 410 L660 330 L760 420 L860 470 L900 460 L900 660 Z" fill="rgba(63,224,122,.25)"/>
          <path id="gipfel-line" d="M0 600 L120 560 L220 590 L320 470 L400 500 L500 380 L580 410 L660 330 L760 420 L860 470 L900 460" stroke="${GREEN}" stroke-width="14" fill="none" stroke-linejoin="round" stroke-linecap="round" pathLength="1" stroke-dasharray="1 2" stroke-dashoffset="1.2"/>
          <circle id="gipfel-dot" cx="660" cy="330" r="22" fill="${YEL}" stroke="${K}" stroke-width="7"/>
        </svg>
        <div id="gipfel-flag"><svg viewBox="0 0 560 300" width="100%" height="100%" overflow="visible">
          <rect x="332" y="70" width="14" height="230" rx="6" fill="#E8EDF3" stroke="${K}" stroke-width="5"/>
          <path d="M346 74 L548 74 L520 140 L548 206 L346 206 Z" fill="${RED}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
          <g transform="translate(400 96)"><path d="M10 0 L70 0 L66 40 Q60 66 40 66 Q20 66 14 40 Z" fill="${YEL}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><path d="M10 10 Q-8 10 -4 26 Q0 40 16 42 M70 10 Q88 10 84 26 Q80 40 64 42" stroke="${K}" stroke-width="6" fill="none"/><rect x="30" y="66" width="20" height="16" fill="${YEL}" stroke="${K}" stroke-width="5"/><rect x="18" y="82" width="44" height="14" rx="4" fill="${YEL}" stroke="${K}" stroke-width="5"/></g>
          <rect x="-170" y="-14" width="490" height="190" rx="24" fill="#fff" stroke="${K}" stroke-width="8"/>
          <text x="75" y="62" text-anchor="middle" font-family="Lilita One" font-size="76" fill="${K}">≈ 126.000 $</text>
          <text x="30" y="150" text-anchor="middle" font-family="Lilita One" font-size="76" fill="#5B6577">pro</text>
          <g transform="translate(96 84) scale(.42)"><use href="#gipfel-sym-coin"/></g>
        </svg></div>
${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `        <div id="gipfel-cf${i}" class="gipfel-cf" style="left:${560 + r(-40, 260)}px;top:${80 + r(0, 120)}px;background:${[YEL, GREEN, RED, "#4FC3F7"][i % 4]};"></div>`).join("\n")}
      </div>`,
    `      tl.fromTo("#gipfel-pan", { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25, ease: "back.out(1.6)" }, 0);
      tl.to("#gipfel-line", { strokeDashoffset: 0, duration: 0.7, ease: "power1.inOut" }, 0.1);
      tl.fromTo("#gipfel-area", { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.4);
      tl.fromTo("#gipfel-dot", { scale: 0, svgOrigin: "660 330" }, { scale: 1, duration: 0.25, ease: "back.out(3)", svgOrigin: "660 330" }, 0.5);
      tl.fromTo("#gipfel-flag", { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.35, ease: "back.out(2)" }, 0.6);
      tl.to("#gipfel-flag", { rotation: -2, duration: 0.4, yoyo: true, repeat: 3, ease: "sine.inOut" }, 1.0);
      ${JSON.stringify([0, 1, 2, 3, 4, 5, 6, 7])}.forEach((i) => tl.fromTo("#gipfel-cf" + i, { y: -120, opacity: 0, rotation: 0 }, { y: 200 + i * 30, opacity: 1, rotation: (i % 2 ? 360 : -300), duration: 1.3, ease: "power1.in", immediateRender: false }, 0.75 + i * 0.05));`,
    coinSym(p)));
}

// ================= calculator: 10.000 × 126.000 $ (25.65 - 28.15), graphics below y 850 =================
{
  const p = "rechnung";
  const [s, d] = S(p);
  scenes.push(scene(p, "Rechnung", s, d,
    `#rechnung-calc{${abs(200, 860, 680, 560)}}
     #rechnung-disp{position:absolute;left:50px;top:44px;width:580px;height:210px;border-radius:18px;background:#BFE6C9;border:8px solid ${K};font-family:'Lilita One';font-size:78px;line-height:92px;padding-top:6px;color:${K};text-align:center;white-space:nowrap;overflow:hidden;}
     #rechnung-q{position:absolute;left:50px;top:44px;width:580px;height:210px;font-family:'Lilita One';font-size:120px;line-height:210px;color:${RED};text-align:center;opacity:0;}
     #rechnung-eq{position:absolute;left:470px;top:410px;width:160px;height:96px;border-radius:20px;background:${YEL};border:7px solid ${K};}`,
    `      <div id="rechnung-calc" class="rechnung-stk"><svg viewBox="0 0 680 560" width="680" height="560" style="position:absolute;left:0;top:0" overflow="visible">
        <rect x="6" y="6" width="668" height="548" rx="50" fill="#5B6577" stroke="${K}" stroke-width="10"/>
        <g fill="#E8EDF3" stroke="${K}" stroke-width="6">${[0, 1].map((row) => [0, 1, 2, 3].map((c) => `<rect x="${50 + c * 150}" y="${280 + row * 130}" width="130" height="96" rx="20"/>`).join("")).join("").replace(/<rect x="500" y="410"[^>]*\/>/, "")}</g>
      </svg>
        <div id="rechnung-disp"><span id="rechnung-tx">10.000 ×<br/>126.000 $</span></div>
        <div id="rechnung-q">= ???</div>
        <div id="rechnung-eq"></div>
      </div>`,
    `      tl.fromTo("#rechnung-calc", { y: 700, rotation: 8 }, { y: 0, rotation: -2, duration: 0.35, ease: "back.out(1.3)" }, 0);
      tl.fromTo("#rechnung-tx", { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "steps(2)" }, 0.3);
      tl.to("#rechnung-eq", { scale: 0.86, duration: 0.08, yoyo: true, repeat: 1 }, 1.92);
      tl.to("#rechnung-disp", { opacity: 0, duration: 0.05 }, 2.0);
      tl.to("#rechnung-q", { keyframes: { opacity: [0, 1, 0.3, 1] }, duration: 0.4, ease: "steps(3)" }, 2.0);
      tl.to("#rechnung-calc", { keyframes: { rotation: [-2, 2, -2, 1, -2] }, duration: 0.5, ease: "none" }, 1.95);`,
    ""));
}

// ================= punchline: 1,26 billion, gold rain (28.15 - 30.75), graphics below y 860 =================
{
  const p = "milliarde";
  const [s, d] = S(p);
  const drops = Array.from({ length: 22 }, (_, i) => ({ x: r(20, 960), s: r(70, 120), t: +(0.1 + i * 0.075 + r(0, 0.05)).toFixed(2), rot: r(-360, 360) }));
  const bar = (id, x, y) => `<div id="${id}" class="milliarde-bar milliarde-stk" style="left:${x}px;top:${y}px;"><svg viewBox="0 0 260 120" width="260" height="120" overflow="visible"><path d="M40 0 L220 0 L258 116 L2 116 Z" fill="${GOLD}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/><path d="M50 16 L210 16" stroke="#FFF6CF" stroke-width="10" stroke-linecap="round"/><path d="M30 100 L230 100" stroke="${GOLD_D}" stroke-width="8"/></svg></div>`;
  scenes.push(scene(p, "1,26 Milliarden", s, d,
    `#milliarde-rain{position:absolute;left:0;top:880px;width:1080px;height:1040px;overflow:hidden;}
     .milliarde-bar{position:absolute;}
     #milliarde-glow{${abs(140, 960, 800, 560)}border-radius:50%;background:radial-gradient(circle,rgba(255,197,46,.55),rgba(255,197,46,0) 66%);}`,
    `      <div id="milliarde-glow"></div>
      ${bar("milliarde-b0", 160, 1360)}${bar("milliarde-b1", 420, 1360)}${bar("milliarde-b2", 290, 1240)}${bar("milliarde-b3", 160, 1120)}${bar("milliarde-b4", 420, 1120)}
      <div id="milliarde-rain">
${drops.map((q, i) => "        " + coin("milliarde-d" + i, p, q.x, -140, q.s)).join("\n")}
      </div>`,
    `      tl.fromTo("#milliarde-glow", { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" }, 0.1);
      tl.to("#milliarde-glow", { scale: 1.12, duration: 0.4, yoyo: true, repeat: 4, ease: "sine.inOut" }, 0.5);
      ["#milliarde-b0", "#milliarde-b1", "#milliarde-b2", "#milliarde-b3", "#milliarde-b4"].forEach((id, i) => tl.fromTo(id, { y: 700 }, { y: 0, duration: 0.3, ease: "back.out(1.6)" }, 0.2 + i * 0.12));
${shake("#milliarde-kb", 0.3, 26, 0.42)}
${shake("#milliarde-kb", 1.1, 12, 0.3)}
      const D = ${JSON.stringify(drops)};
      D.forEach((q, i) => tl.fromTo("#milliarde-d" + i, { y: 0, rotation: 0 }, { y: 1250, rotation: q.rot, duration: 0.9, ease: "power1.in", immediateRender: false }, q.t));`,
    coinSym(p)));
}

// ================= the slice now has a price tag, shines (30.75 - 33.25) =================
{
  const p = "stueck";
  const [s, d] = S(p);
  const spk = (id, x, y, sz) => `<div id="${id}" class="pe" style="left:${x}px;top:${y}px;width:${sz}px;height:${sz}px;"><svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M50 0 Q56 44 100 50 Q56 56 50 100 Q44 56 0 50 Q44 44 50 0Z" fill="#FFF6CF"/></svg></div>`;
  scenes.push(scene(p, "Preis pro Pizza", s, d,
    `#stueck-sl{${abs(150, 740, 400, 506)}transform-origin:50% 50%;}
     #stueck-glint{position:absolute;left:0;top:0;width:70px;height:506px;background:rgba(255,255,255,.7);transform:skewX(-18deg);opacity:0;}
     #stueck-mask{position:absolute;inset:0;overflow:hidden;clip-path:polygon(5% 12%,50% 0%,95% 12%,50% 98%);}
     #stueck-str{${abs(380, 960, 140, 260)}}
     #stueck-tag{${abs(430, 1100, 560, 190)}transform-origin:6% 50%;}`,
    `      <div id="stueck-str"><svg viewBox="0 0 140 260" width="140" height="260" overflow="visible"><path id="stueck-sp" d="M20 10 Q50 130 100 232" stroke="#E8EDF3" stroke-width="8" fill="none" stroke-linecap="round" stroke-dasharray="260" stroke-dashoffset="260"/></svg></div>
      <div id="stueck-sl" class="stueck-stk">${SLICE(p)}<div id="stueck-mask"><div id="stueck-glint"></div></div></div>
      <div id="stueck-tag" class="stueck-stk"><svg viewBox="0 0 560 190" width="100%" height="100%" overflow="visible">
        <path d="M60 8 L546 8 Q554 8 554 18 L554 172 Q554 182 546 182 L60 182 L6 95 Z" fill="${YEL}" stroke="${K}" stroke-width="9" stroke-linejoin="round"/>
        <circle cx="52" cy="95" r="14" fill="#0E1530" stroke="${K}" stroke-width="5"/>
        <text x="306" y="122" text-anchor="middle" font-family="Lilita One" font-size="78" fill="${K}">≈ 630 Mio. $</text></svg></div>
      ${spk("stueck-k0", 170, 760, 90)}${spk("stueck-k1", 600, 960, 70)}${spk("stueck-k2", 120, 1100, 60)}${spk("stueck-k3", 860, 1250, 80)}`,
    `      tl.fromTo("#stueck-sl", { scale: 0, rotation: -40 }, { scale: 1, rotation: -10, duration: 0.35, ease: "back.out(1.8)" }, 0);
      tl.to("#stueck-goldl", { opacity: 0.7, duration: 0.4 }, 0.5);
      tl.to("#stueck-sp", { strokeDashoffset: 0, duration: 0.25 }, 0.45);
      tl.fromTo("#stueck-tag", { scale: 0, rotation: 30 }, { scale: 1, rotation: -6, duration: 0.35, ease: "back.out(2.2)" }, 0.55);
      tl.to("#stueck-tag", { rotation: 3, duration: 0.5, yoyo: true, repeat: 2, ease: "sine.inOut" }, 0.95);
      tl.fromTo("#stueck-glint", { x: -120, opacity: 0.9 }, { x: 480, opacity: 0.9, duration: 0.5, ease: "power2.inOut", immediateRender: false }, 0.9);
      tl.fromTo("#stueck-glint", { x: -120 }, { x: 480, duration: 0.5, ease: "power2.inOut", immediateRender: false }, 1.8);
      tl.to("#stueck-sl", { rotation: -4, y: -14, duration: 0.6, yoyo: true, repeat: 2, ease: "sine.inOut" }, 0.5);
      ["#stueck-k0", "#stueck-k1", "#stueck-k2", "#stueck-k3"].forEach((id, i) => tl.fromTo(id, { scale: 0, rotation: 0 }, { keyframes: { scale: [0, 1.2, 0, 1, 0] }, rotation: 90, duration: 1.4, ease: "none" }, 0.6 + i * 0.18));`,
    ""));
}

// ================= calendar sheet 22 MAI, Bitcoin Pizza Day (33.25 - 36.1) =================
{
  const p = "kalender";
  const [s, d] = S(p);
  const sheet = (id, day, front) => `<div id="${id}" class="kalender-sh" style="${front ? "" : ""}"><div class="kalender-hd">MAI</div><div class="kalender-day">${day}</div>${front ? `<div class="kalender-ft">BITCOIN<br/>PIZZA DAY</div>` : ""}</div>`;
  scenes.push(scene(p, "Pizza-Tag", s, d,
    `#kalender-wrap{${abs(240, 760, 600, 640)}}
     .kalender-sh{position:absolute;left:0;top:30px;width:600px;height:600px;border-radius:30px;background:#fff;border:10px solid ${K};overflow:hidden;transform-origin:50% 0%;}
     .kalender-hd{position:absolute;left:0;right:0;top:0;height:130px;background:${RED};border-bottom:10px solid ${K};font-family:'Lilita One';font-size:100px;line-height:130px;text-align:center;color:#fff;-webkit-text-stroke:10px ${K};paint-order:stroke fill;}
     .kalender-day{position:absolute;left:0;right:0;top:130px;height:256px;font-family:'Lilita One';font-size:236px;line-height:256px;text-align:center;color:${K};}
     .kalender-ft{position:absolute;left:30px;right:30px;bottom:14px;height:176px;border-radius:34px;background:${YEL};border:6px solid ${K};font-family:'Lilita One';font-size:74px;line-height:80px;padding-top:4px;text-align:center;color:${K};}
     .kalender-ring{position:absolute;top:0;width:36px;height:76px;border-radius:18px;background:#A8B3C2;border:7px solid ${K};}
     .kalender-cf{position:absolute;width:22px;height:36px;border-radius:5px;}`,
    `${Array.from({ length: 10 }, (_, i) => `      <div id="kalender-cf${i}" class="kalender-cf" style="left:${r(120, 920)}px;top:${r(780, 900)}px;background:${[YEL, GREEN, RED, "#4FC3F7", "#FF7A1A"][i % 5]};"></div>`).join("\n")}
      <div id="kalender-wrap" class="kalender-stk" data-layout-allow-overlap>
        ${sheet("kalender-s22", 22, true)}
        ${sheet("kalender-s21", 21, false)}
        ${sheet("kalender-s20", 20, false)}
        <div id="kalender-r0" class="kalender-ring" style="left:130px;"></div><div id="kalender-r1" class="kalender-ring" style="left:434px;"></div>
      </div>
`,
    `      tl.fromTo("#kalender-wrap", { y: 800, rotation: 10 }, { y: 0, rotation: -3, duration: 0.4, ease: "back.out(1.3)" }, 0);
      tl.to("#kalender-s20", { rotationX: -100, y: -60, opacity: 0, duration: 0.3, ease: "power2.in", transformPerspective: 900 }, 0.45);
      tl.to("#kalender-s21", { rotationX: -100, y: -60, opacity: 0, duration: 0.3, ease: "power2.in", transformPerspective: 900 }, 0.75);
      tl.fromTo(".kalender-day", { scale: 1 }, { scale: 1, duration: 0.01 }, 0);
      tl.to("#kalender-s22 .kalender-day", { keyframes: { scale: [1, 1.15, 1] }, duration: 0.3, ease: "sine.inOut" }, 1.05);
${shake("#kalender-kb", 1.05, 12, 0.26)}
      tl.to("#kalender-wrap", { rotation: 2, duration: 0.7, yoyo: true, repeat: 2, ease: "sine.inOut" }, 1.2);
      ${JSON.stringify(Array.from({ length: 10 }, (_, i) => i))}.forEach((i) => tl.fromTo("#kalender-cf" + i, { y: -60, opacity: 0, rotation: 0 }, { y: 520 + (i % 3) * 60, opacity: 1, rotation: (i % 2 ? 400 : -380), duration: 1.4, ease: "power1.in", immediateRender: false }, 1.1 + i * 0.06));`,
    ""));
}

// ================= question: two buttons with a live poll bar (36.1 - 39.0) =================
{
  const p = "frage";
  const [s, d] = S(p);
  scenes.push(scene(p, "Frage", s, d,
    `.frage-btn{position:absolute;left:150px;width:780px;height:180px;border-radius:44px;border:10px solid ${K};overflow:hidden;box-shadow:0 16px 0 #050814;}
     .frage-btn span{position:absolute;left:230px;top:24px;font-family:'Lilita One';font-size:116px;line-height:1;color:#fff;-webkit-text-stroke:12px ${K};paint-order:stroke fill;}
     .frage-ic{position:absolute;left:40px;top:14px;width:150px;height:150px;}
     .frage-fill{position:absolute;left:0;bottom:0;height:22px;width:100%;background:rgba(255,255,255,.55);transform-origin:0 50%;}
     #frage-b1{top:770px;background:#FF7A1A;} #frage-b2{top:1000px;background:#2B5BD7;}`,
    `      <div id="frage-b1" class="frage-btn"><div class="frage-ic"><svg viewBox="0 0 300 380" width="120" height="150" style="margin-left:15px">${SLICE("frage-a").replace(/<defs>.*?<\/defs>/s, "").replace(/<path id="frage-a-goldl"[^>]*\/>/, "")}</svg></div><span>ESSEN</span><div id="frage-f1" class="frage-fill"></div></div>
      <div id="frage-b2" class="frage-btn"><div class="frage-ic"><svg viewBox="0 0 200 200" width="150" height="150"><use href="#frage-sym-coin"/></svg></div><span>BEHALTEN</span><div id="frage-f2" class="frage-fill"></div></div>`,
    `      tl.fromTo("#frage-b1", { x: -900, rotation: -8 }, { x: 0, rotation: -2, duration: 0.4, ease: "back.out(1.5)" }, 0.05);
      tl.fromTo("#frage-b2", { x: 900, rotation: 8 }, { x: 0, rotation: 2, duration: 0.4, ease: "back.out(1.5)" }, 0.2);
      tl.fromTo("#frage-f1", { scaleX: 0 }, { keyframes: { scaleX: [0, 0.55, 0.42, 0.61, 0.5] }, duration: 2.0, ease: "none" }, 0.6);
      tl.fromTo("#frage-f2", { scaleX: 0 }, { keyframes: { scaleX: [0, 0.45, 0.58, 0.39, 0.5] }, duration: 2.0, ease: "none" }, 0.6);
      tl.to(["#frage-b1", "#frage-b2"], { rotation: 0, duration: 0.5, yoyo: true, repeat: 3, ease: "sine.inOut", stagger: 0.15 }, 0.5);
      tl.to("#frage-b1", { scale: 1.05, duration: 0.15, yoyo: true, repeat: 1 }, 1.0);
      tl.to("#frage-b2", { scale: 1.05, duration: 0.15, yoyo: true, repeat: 1 }, 1.6);`,
    coinSym(p), { exitLead: 0.35, exitDur: 0.22 }));
}

// ================= loop end: rebuilds the frame-0 picture (39.0 - 39.5) =================
{
  const p = "loopend";
  const [s, d] = S(p);
  scenes.push(scene(p, "Loop zurück", s, d, hookCss(p), hookBody(p),
    `      tl.fromTo(["#loopend-boxA", "#loopend-boxB"], { opacity: 0, y: 500 }, { opacity: 1, y: 0, duration: 0.28, ease: "back.out(1.3)", stagger: 0.03 }, 0.0);
      tl.fromTo("#loopend-glow", { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.3, ease: "power3.out" }, 0.04);
      tl.fromTo(".loopend-col", { opacity: 0, scaleY: 0 }, { opacity: 1, scaleY: 1, duration: 0.28, ease: "back.out(1.6)", stagger: 0.02 }, 0.06);
      tl.fromTo(["#loopend-fc0", "#loopend-fc1", "#loopend-fc2", "#loopend-fl0", "#loopend-fl1", "#loopend-fl2"], { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(1.6)", stagger: 0.025 }, 0.12);`,
    coinSym(p), { exit: false, kb: false }));
}

// ================= background: night blue + coin-dot pattern + slow rays =================
fs.writeFileSync(path.join(OUT, "compositions", "bg.html"), `<template>
  <style>
    #root { position: absolute; inset: 0; overflow: hidden; background: #0E1530; }
    #bg-glow { position: absolute; inset: 0; background: radial-gradient(circle at 50% 58%, #2A3A80 0%, #17234D 42%, #0E1530 76%); }
    #bg-rays { position: absolute; left: -760px; top: -200px; width: 2600px; height: 2600px; border-radius: 50%;
      background: repeating-conic-gradient(from 0deg, rgba(255,210,63,.045) 0deg 7.5deg, rgba(255,255,255,0) 7.5deg 20deg); }
    #bg-dots { position: absolute; left: -80px; top: -80px; width: 1240px; height: 2080px;
      background-image: radial-gradient(circle, rgba(255,255,255,.05) 7px, transparent 8px); background-size: 80px 80px; }
    #bg-vig { position: absolute; inset: 0; background: radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 55%, rgba(4,7,20,.6) 100%); }
  </style>
  <div id="root" data-composition-id="bg" data-width="1080" data-height="1920" data-layout-allow-overflow>
    <div id="bg-glow"></div>
    <div id="bg-rays"></div>
    <div id="bg-dots"></div>
    <div id="bg-vig"></div>
  </div>
  <script>
    (function () {
      const tl = gsap.timeline({ paused: true });
      // 40 degrees = two ray periods, 80 px = one dot cell: both land on the frame-0 state for the loop
      tl.fromTo("#bg-rays", { rotation: 0 }, { rotation: -40, duration: ${DUR}, ease: "none" }, 0);
      tl.fromTo("#bg-dots", { x: 0, y: 0 }, { x: 80, y: 80, duration: ${DUR}, ease: "none" }, 0);
      window.__timelines["bg"] = tl;
    })();
  </script>
</template>
`);

// ================= captions =================
// "*" keyword (yellow Lilita, caption kwsize). "~" yellow Lilita as written. "!" punchline size. "#" year, visible at frame 0. "/" line break.
const capT = (k) => T[k];
const caps = [
  { id: "c01", s: 0, e: 3.4, words: ["#2010.", "Zwei", "/", "Pizzen", "kosten …"], first: 0.08 },
  { id: "c02", s: 1.2, e: 3.4, top: 565, words: ["*10.000", "*BITCOIN."], kwsize: 110, counter: 0 },
  { id: "c03", s: capT("forum")[0], e: capT("forum")[1], words: ["Ein", "Programmierer", "/", "fragt", "im", "Forum:"] },
  { id: "c04", s: capT("bubble")[0], e: capT("bubble")[1], words: ["„Wer", "bringt", "/", "mir", "*PIZZA?“"] },
  { id: "c05", s: capT("deal")[0], e: capT("deal")[1], words: ["Ein", "19-Jähriger", "/", "sagt:", "*DEAL."], shake: true },
  { id: "c06", s: capT("phone")[0], e: capT("phone")[1], words: ["Er", "bestellt", "zwei", "/", "große", "Pizzen."] },
  { id: "c07", s: capT("wert")[0], e: capT("wert")[1], words: ["Bitcoin", "war", "/", "damals", "fast", "/", "nichts", "wert."] },
  { id: "c08", s: capT("bon")[0], e: capT("bon")[1], words: ["Gesamtwert:", "rund", "/", "*41", "*DOLLAR."] },
  { id: "c09", s: capT("gut")[0], e: capT("gut")[1], words: ["Guter", "Deal,", "oder?"] },
  { id: "c10", s: capT("chart")[0], e: capT("chart")[1], words: ["Dann", "*STEIGT", "/", "der", "Kurs."] },
  { id: "c11", s: capT("steil")[0], e: capT("steil")[1], words: ["Und", "steigt.", "/", "Und", "*STEIGT."], shake: true },
  { id: "c12", s: capT("gipfel")[0], e: capT("gipfel")[1], words: ["*REKORDHOCH", "/", "im", "Oktober", "2025."], kwsize: 134 },
  { id: "c13", s: capT("rechnung")[0], e: capT("rechnung")[1], words: ["Die", "10.000", "Bitcoin", "/", "wären", "dann:"] },
  { id: "c14", s: capT("milliarde")[0], e: capT("milliarde")[1], words: ["!1,26", "/", "*MILLIARDEN", "/", "Dollar", "wert."], kwsize: 154, shake: true },
  { id: "c15", s: capT("stueck")[0], e: capT("stueck")[1], words: ["Pro", "Pizza:", "über", "/", "*600", "*MILLIONEN."], kwsize: 110 },
  { id: "c16", s: capT("kalender")[0], e: capT("kalender")[1], words: ["Der", "*22.", "*MAI", "ist", "/", "heute", "~Pizza-Tag."] },
  { id: "c17", s: capT("frage")[0], e: capT("frage")[1], words: ["Pizza", "essen", "oder", "/", "Bitcoin", "behalten?"] },
  { id: "c18", s: T.loopend[0], e: DUR, words: ["#2010.", "Zwei", "/", "Pizzen", "kosten …"], loop: true },
];
const ST = 0.065, PD = 0.22, KD = 0.24, EXIT = 0.12;
let capHtml = "", capJs = "";
const report = [];
for (const c of caps) {
  const d = +(c.e - c.s).toFixed(2);
  const track = caps.indexOf(c) % 2;
  const style = `top:${c.top ?? 290}px;${c.size ? `font-size:${c.size}px;` : ""}`;
  const kind = (w) => (w === "/" ? "br" : "*~!#".includes(w[0]) ? w[0] : "");
  const spans = c.words.map((w, i) => {
    const k = kind(w);
    if (k === "br") return `<br/>`;
    const txt = k ? w.slice(1) : w;
    const cls = { "*": "w kw", "~": "w q", "!": "w pt", "#": "w yr", "": "w" }[k];
    const st = k === "*" && c.kwsize ? ` style="font-size:${c.kwsize}px"` : "";
    return `<span id="${c.id}-o${i}" class="${cls}"${st}><span id="${c.id}-w${i}" class="g">${txt}</span></span>`;
  });
  capHtml += `      <div id="${c.id}" class="cap clip" data-start="${c.s}" data-duration="${d}" data-track-index="${track}" data-layout-allow-overlap style="${style}">${spans.join(" ").replace(/ <br\/> /g, "<br/>")}</div>\n`;
  capJs += `      // ${c.id}\n`;
  let full = 0, n = 0, wc = 0;
  c.words.forEach((w, i) => {
    const k = kind(w);
    if (k === "br") return;
    wc++;
    if (k === "#" && !c.loop) { full = Math.max(full, c.s); return; } // year: on screen at frame 0
    const at = +(c.s + (c.loop ? 0.02 : (c.first ?? 0.02)) + n * ST).toFixed(3);
    n++;
    if (k === "#") {
      capJs += `      tl.fromTo("#${c.id}-w${i}", { scale: 2.4, opacity: 0, rotation: 8 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.22, ease: "power4.in" }, ${at});\n`;
      return;
    }
    if (c.loop) return; // loop copy: the other words stay hidden, like frame 0
    if (k === "*" || k === "!") {
      capJs += `      tl.fromTo("#${c.id}-w${i}", { opacity: 0, scale: 1.3, rotation: -6 }, { opacity: 1, scale: 1, rotation: 0, duration: ${KD}, ease: "back.out(2.2)" }, ${at});\n`;
      if (c.shake) capJs += `      tl.to("#${c.id}-w${i}", { keyframes: { x: [0, -12, 12, -8, 6, 0], rotation: [0, -4, 4, -2, 0, 0] }, duration: 0.32, ease: "none" }, ${+(at + 0.28).toFixed(3)});\n`;
      full = Math.max(full, at + KD);
    } else {
      capJs += `      tl.fromTo("#${c.id}-w${i}", { opacity: 0, scale: 0.4, y: 26 }, { opacity: 1, scale: 1, y: 0, duration: ${PD}, ease: "back.out(1.6)" }, ${at});\n`;
      full = Math.max(full, at + PD);
    }
    if (c.counter === i) capJs += `      { const o = { v: 0 }; const el = document.querySelector("#${c.id}-w${i}"); const f = (v) => String(Math.round(v)).replace(/\\B(?=(\\d{3})+(?!\\d))/g, "."); tl.fromTo(o, { v: 0 }, { v: 10000, duration: 0.3, ease: "power2.out", onUpdate: () => { el.textContent = f(o.v); } }, ${at}); }\n`;
  });
  if (c.loop) {
    capJs += `      tl.set(${JSON.stringify(c.words.map((w, i) => (kind(w) && kind(w) !== "~") || w === "/" ? null : `#${c.id}-w${i}`).filter(Boolean))}, { opacity: 0 }, ${c.s});\n`;
    continue;
  }
  const ex = +(c.e - EXIT - 0.01).toFixed(3);
  capJs += `      tl.to("#${c.id} .g", { opacity: 0, scale: 0.85, duration: ${EXIT}, ease: "power2.in" }, ${ex});\n`;
  const readable = +(ex - full).toFixed(2), need = Math.max(1.1, 0.35 * wc);
  report.push(`${c.id} ${wc}w full@${full.toFixed(2)} readable ${readable}s need ${need.toFixed(2)}s ${readable >= need - 1e-6 ? "ok" : "TOO SHORT"}`);
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
    .pt { font-family: 'Lilita One'; font-weight: 400; color: ${YEL}; font-size: 230px; line-height: 0.95; letter-spacing: 0.01em; -webkit-text-stroke: 22px ${K}; text-shadow: 0 16px 0 #050814; }
    .yr { font-family: 'Lilita One'; font-weight: 400; color: ${YEL}; font-size: 140px; line-height: 1; letter-spacing: 0.01em; -webkit-text-stroke: 20px ${K}; text-shadow: 0 14px 0 #050814; }
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

// ================= Klotz (rig from Folge 1/2; new gag: pizza slice, chokes, slice goes into a vault) =================
const M = {
  shock:      { eye: 1.12, ps: 0.6, px: 0, py: 0, lL: 0, lR: 0, bL: -18, bR: -18, tL: -6, tR: -6, mx: 1, my: 1.1, g: 0, aL: 70, aR: -70, sw: 1 },
  surprised:  { eye: 1.08, ps: 0.8, px: 0, py: 6, lL: 0, lR: 0, bL: -16, bR: -16, tL: 0, tR: 0, mx: 0.55, my: 0.6, g: 0, aL: 55, aR: -55, sw: 0 },
  impressed:  { eye: 1.05, ps: 0.9, px: -6, py: -4, lL: 0, lR: 0, bL: -12, bR: -12, tL: -4, tR: -4, mx: 0.45, my: 0.45, g: 0, aL: 40, aR: -40, sw: 0 },
  smug:       { eye: 1, ps: 1, px: 8, py: 0, lL: 0.45, lR: 0.45, bL: -4, bR: -10, tL: 6, tR: -2, mx: 0, my: 0, g: 1, aL: 20, aR: -40, sw: 0 },
  suspicious: { eye: 1, ps: 1, px: -14, py: 2, lL: 0.55, lR: 0.1, bL: 4, bR: -20, tL: 14, tR: 4, mx: 0.7, my: 0.18, g: 0, aL: 30, aR: -30, sw: 0 },
  jawdrop:    { eye: 1.18, ps: 0.55, px: -6, py: -8, lL: 0, lR: 0, bL: -22, bR: -22, tL: -4, tR: -4, mx: 1.1, my: 1.7, g: 0, aL: 60, aR: -60, sw: 1 },
  happy:      { eye: 1, ps: 1, px: 0, py: 0, lL: 0.2, lR: 0.2, bL: -10, bR: -10, tL: -4, tR: -4, mx: 0, my: 0, g: 1, aL: 35, aR: -35, sw: 0 },
  munch:      { eye: 1, ps: 1, px: 4, py: 0, lL: 0.62, lR: 0.62, bL: -8, bR: -8, tL: -6, tR: -6, mx: 0.55, my: 0.3, g: 0, aL: 30, aR: -30, sw: 0 },
  cheer:      { eye: 1, ps: 1, px: 0, py: 0, lL: 0.55, lR: 0.55, bL: -16, bR: -16, tL: -6, tR: -6, mx: 0.55, my: 0.3, g: 0, aL: 168, aR: -160, sw: 0 },
  curious:    { eye: 1.05, ps: 1.1, px: -14, py: -10, lL: 0.1, lR: 0.1, bL: -18, bR: -4, tL: 0, tR: 0, mx: 0.5, my: 0.35, g: 0, aL: 40, aR: -40, sw: 0 },
  frozen:     { eye: 1.14, ps: 0.6, px: -10, py: -12, lL: 0, lR: 0, bL: -20, bR: -20, tL: -4, tR: -4, mx: 0.5, my: 0.5, g: 0, aL: 40, aR: -40, sw: 1 },
  choke:      { eye: 0.9, ps: 1, px: 0, py: 0, lL: 1, lR: 1, bL: 8, bR: 8, tL: 20, tR: 20, mx: 0.8, my: 0.9, g: 0, aL: 110, aR: -40, sw: 1 },
  look:       { eye: 1.06, ps: 1.0, px: 14, py: 6, lL: 0, lR: 0, bL: -14, bR: -14, tL: -4, tR: -4, mx: 0.5, my: 0.5, g: 0, aL: 40, aR: -40, sw: 0 },
};
const HOLD0 = 15.55, HOLD1 = 37.3; // slice in his right hand
const moods = [
  [3.4, "curious"], [5.9, "surprised"], [8.0, "impressed"], [10.1, "happy"], [12.6, "suspicious"],
  [15.45, "munch"], [17.55, "cheer"], [19.25, "curious"], [21.35, "frozen"], [23.45, "jawdrop"], [25.65, "suspicious"],
  [28.15, "choke"], [29.6, "jawdrop"], [30.75, "look"], [33.25, "happy"], [36.1, "smug"], [39.0, "shock"],
];
const blinks = [2.2, 5.0, 9.2, 11.6, 14.4, 20.3, 24.8, 27.0, 31.9, 35.2];

const klotzSvg = `<svg viewBox="0 0 300 330" width="100%" height="100%" overflow="visible">
  <defs>
    <clipPath id="k-clipL"><ellipse cx="108" cy="140" rx="40" ry="46"/></clipPath>
    <clipPath id="k-clipR"><ellipse cx="192" cy="140" rx="40" ry="46"/></clipPath>
    <mask id="k-bitemask" maskUnits="userSpaceOnUse" x="150" y="140" width="220" height="200"><rect x="150" y="140" width="220" height="200" fill="#fff"/><circle id="k-bite1" cx="214" cy="236" r="22" fill="#000"/><circle id="k-bite2" cx="238" cy="222" r="26" fill="#000"/><circle id="k-bite3" cx="236" cy="252" r="24" fill="#000"/></mask>
    <linearGradient id="k-goldg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF2A8"/><stop offset=".5" stop-color="${GOLD}"/><stop offset="1" stop-color="${GOLD_D}"/></linearGradient>
  </defs>
  <g id="k-armL"><rect x="31" y="186" width="34" height="84" rx="17" fill="#F06A0C" stroke="#7A2E00" stroke-width="6"/><circle cx="48" cy="270" r="21" fill="#FF7A1A" stroke="#7A2E00" stroke-width="6"/><rect id="k-thumb" x="38" y="278" width="20" height="34" rx="10" fill="#FF7A1A" stroke="#7A2E00" stroke-width="6"/></g>
  <g id="k-armR"><rect x="235" y="186" width="34" height="84" rx="17" fill="#F06A0C" stroke="#7A2E00" stroke-width="6"/><circle cx="252" cy="270" r="21" fill="#FF7A1A" stroke="#7A2E00" stroke-width="6"/></g>
  <ellipse cx="105" cy="304" rx="36" ry="17" fill="#D95F0A" stroke="#7A2E00" stroke-width="6"/>
  <ellipse cx="195" cy="304" rx="36" ry="17" fill="#D95F0A" stroke="#7A2E00" stroke-width="6"/>
  <rect x="40" y="48" width="220" height="250" rx="72" fill="#FF7A1A" stroke="#7A2E00" stroke-width="8"/>
  <rect id="k-red" x="44" y="52" width="212" height="242" rx="68" fill="#FF2E3E" opacity="0"/>
  <path d="M48 220 Q60 290 150 292 Q240 290 252 220 L252 236 Q246 294 150 294 Q54 294 48 236 Z" fill="#E8650C"/>
  <ellipse cx="92" cy="86" rx="38" ry="18" fill="#fff" opacity=".28" transform="rotate(-24 92 86)"/>
  <ellipse id="k-chkL" cx="72" cy="196" rx="20" ry="12" fill="#FF5A6E" opacity=".45"/><ellipse id="k-chkR" cx="228" cy="196" rx="20" ry="12" fill="#FF5A6E" opacity=".45"/>
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
  <g id="k-crumbs">
    ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<circle id="k-cr${i}" cx="150" cy="232" r="${6 + (i % 3) * 3}" fill="${["#FFD86B", "#E8A54B", "#D9412B"][i % 3]}" stroke="#7A2E00" stroke-width="3"/>`).join("")}
  </g>
  <g id="k-puffs" fill="#E8EDF3" stroke="#8A96A6" stroke-width="4">
    <circle id="k-pf0" cx="150" cy="232" r="16"/><circle id="k-pf1" cx="150" cy="232" r="22"/><circle id="k-pf2" cx="150" cy="232" r="14"/>
  </g>
  <g id="k-slice">
    <g mask="url(#k-bitemask)">
      <path d="M206 238 L310 190 Q324 238 304 286 Z" fill="#FFD86B" stroke="#7A2E00" stroke-width="6" stroke-linejoin="round"/>
      <path d="M306 186 Q330 238 308 292 L296 286 Q314 238 296 194 Z" fill="#E8A54B" stroke="#7A2E00" stroke-width="5" stroke-linejoin="round"/>
      <g fill="#D9412B" stroke="#8E2215" stroke-width="3"><circle cx="262" cy="228" r="11"/><circle cx="282" cy="258" r="10"/><circle cx="240" cy="246" r="8"/></g>
      <path id="k-sgold" d="M206 238 L310 190 Q324 238 304 286 Z M306 186 Q330 238 308 292 L296 286 Q314 238 296 194 Z" fill="url(#k-goldg)" stroke="#7A2E00" stroke-width="6" stroke-linejoin="round" opacity="0"/>
    </g>
  </g>
</svg>`;

let kJs = "";
const setMood = (m, t, dur) => {
  const p = M[m];
  const hold = t >= HOLD0 && t < HOLD1;
  const aR = hold ? -37 : p.aR;
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
      tl.to("#k-armR", { rotation: ${aR}, duration: ${+(dur * 1.3).toFixed(3)}, ease: "back.out(1.6)" }, ${+(t + 0.08).toFixed(2)});
      tl.to("#k-sweat", { opacity: ${p.sw}, scale: ${p.sw ? 1 : 0.3}, duration: ${dur}, ease: "power2.out" }, ${t});
`;
};
// chewing: mouth squash cycles (munch mouth is a small oval)
const chew = (t0, n, per = 0.22) => `      tl.to("#k-mouth", { keyframes: { scaleY: [0.3, 0.08, 0.3] , scaleX: [0.55, 0.7, 0.55] }, duration: ${per}, ease: "none", repeat: ${n - 1} }, ${t0});
      tl.to(["#k-chkL", "#k-chkR"], { keyframes: { scale: [1, 1.25, 1] }, duration: ${per}, ease: "none", repeat: ${n - 1} }, ${t0});\n`;
const bite = (t0, id) => `      tl.to("#k-slice", { keyframes: { x: [0, -66, 0], y: [0, -8, 0] }, duration: 0.3, ease: "power1.inOut" }, ${t0});
      tl.fromTo("#${id}", { scale: 0 }, { scale: 1, duration: 0.05, immediateRender: false }, ${+(t0 + 0.14).toFixed(2)});
      tl.to("#k-wrap", { keyframes: { scaleY: [1, 0.95, 1] }, duration: 0.2, ease: "none" }, ${+(t0 + 0.12).toFixed(2)});\n`;
const p0 = M.shock;
kJs += `      gsap.set("#k-armL", { svgOrigin: "48 190" }); gsap.set("#k-armR", { svgOrigin: "252 190" });
      gsap.set(["#k-eyeL"], { svgOrigin: "108 140" }); gsap.set(["#k-eyeR"], { svgOrigin: "192 140" });
      gsap.set("#k-pupL", { svgOrigin: "108 142" }); gsap.set("#k-pupR", { svgOrigin: "192 142" });
      gsap.set("#k-lidL", { svgOrigin: "108 90" }); gsap.set("#k-lidR", { svgOrigin: "192 90" });
      gsap.set("#k-browL", { svgOrigin: "109 81" }); gsap.set("#k-browR", { svgOrigin: "191 81" });
      gsap.set("#k-mouth", { svgOrigin: "150 228" }); gsap.set("#k-grin", { svgOrigin: "150 230" }); gsap.set("#k-sweat", { svgOrigin: "260 100" });
      gsap.set("#k-chkL", { svgOrigin: "72 196" }); gsap.set("#k-chkR", { svgOrigin: "228 196" });
      gsap.set("#k-bite1", { svgOrigin: "214 236" }); gsap.set("#k-bite2", { svgOrigin: "238 222" }); gsap.set("#k-bite3", { svgOrigin: "236 252" });
      gsap.set("#k-slice", { svgOrigin: "260 238" });
      gsap.set(["#k-eyeL", "#k-eyeR"], { scale: ${p0.eye} });
      gsap.set(["#k-pupL", "#k-pupR"], { x: 0, y: 0, scale: ${p0.ps} });
      gsap.set(["#k-lidL", "#k-lidR"], { scaleY: 0 });
      gsap.set("#k-browL", { y: ${p0.bL}, rotation: ${p0.tL} }); gsap.set("#k-browR", { y: ${p0.bR}, rotation: ${-p0.tR} });
      gsap.set("#k-mouth", { scaleX: ${p0.mx}, scaleY: ${p0.my}, opacity: 1 }); gsap.set("#k-grin", { scale: 0.2, opacity: 0 });
      gsap.set("#k-armL", { rotation: ${p0.aL} }); gsap.set("#k-armR", { rotation: ${p0.aR} });
      gsap.set("#k-sweat", { opacity: 1, scale: 1 });
      gsap.set("#k-thumb", { opacity: 0 }); gsap.set("#k-red", { opacity: 0 });
      gsap.set(["#k-bite1", "#k-bite2", "#k-bite3"], { scale: 0 });
      gsap.set("#k-slice", { opacity: 0, scale: 1, x: 0, y: 0, rotation: 0 }); gsap.set("#k-sgold", { opacity: 0 });
      gsap.set("#k-crumbs circle, #k-puffs circle", { opacity: 0 });
      gsap.set("#k-wrap", { x: 0, y: 0, rotation: 0 }); gsap.set("#k-sq", { scaleX: 1, scaleY: 1 });
      gsap.set(["#k-vault", "#k-door"], { y: 600 }); gsap.set("#k-door", { rotationY: 0 });
      // idle bob: 80 half-cycles over the film, ends where it starts
      tl.fromTo("#k-bob", { y: 0 }, { y: -12, duration: ${(DUR / 80).toFixed(5)}, ease: "sine.inOut", yoyo: true, repeat: 79 }, 0);
      // shock tremble in the hook, jolt on 10.000 BITCOIN
      tl.to("#k-wrap", { keyframes: { x: [0, -5, 5, -4, 4, -3, 3, 0] }, duration: 0.5, ease: "none" }, 0.02);
      tl.to("#k-wrap", { keyframes: { x: [0, -16, 14, -10, 6, 0], rotation: [0, -6, 5, -3, 1, 0] }, duration: 0.4, ease: "none" }, 1.22);
      tl.to("#k-sweat", { y: 14, duration: 0.5, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0.3);
`;
for (const [t, m] of moods) {
  kJs += `      // ${m} @ ${t}\n`;
  if (m !== "choke") kJs += `      tl.to("#k-sq", { keyframes: { scaleY: [1, 0.9, 1.06, 1], scaleX: [1, 1.07, 0.97, 1] }, duration: 0.3, ease: "none" }, ${+(t - 0.05).toFixed(2)});\n`;
  kJs += setMood(m, +(t + 0.03).toFixed(2), 0.22);
}
for (const b of blinks) kJs += `      tl.to(["#k-lidL", "#k-lidR"], { scaleY: 1, duration: 0.06, yoyo: true, repeat: 1, ease: "power1.inOut" }, ${b});\n`;
kJs += `      // GAG 1: Klotz grabs a slice and eats with delight
      tl.fromTo("#k-slice", { opacity: 0, scale: 0, rotation: -40 }, { opacity: 1, scale: 1.35, rotation: 0, duration: 0.3, ease: "back.out(2.4)", immediateRender: false }, ${HOLD0});
${bite(16.15, "k-bite1")}${chew(16.5, 5)}
      // thumbs up (Guter Deal, oder?), still chewing
      tl.to("#k-thumb", { opacity: 1, duration: 0.05 }, 17.6);
      tl.to("#k-thumb", { opacity: 0, duration: 0.05 }, 19.2);
${bite(18.05, "k-bite2")}${chew(18.4, 6, 0.24)}
      // chart goes up: chewing slows, then he freezes (mouth stays half full)
${chew(19.85, 3, 0.36)}
      tl.to("#k-wrap", { keyframes: { y: [0, -10, 0] }, duration: 0.25, ease: "power1.inOut" }, 21.4);
      tl.to("#k-slice", { y: 18, rotation: 10, duration: 0.3, ease: "power2.out" }, 21.4);
      tl.to("#k-slice", { y: 0, rotation: 0, duration: 0.3, ease: "power2.out" }, 25.7);
      // GAG 2: punchline, he chokes: red face, coughing puffs, crumbs, shaking
      tl.to("#k-red", { opacity: 0.55, duration: 0.25 }, 28.2);
      tl.to("#k-red", { opacity: 0, duration: 0.4 }, 29.55);
      tl.to("#k-wrap", { keyframes: { x: [0, -12, 12, -10, 10, -8, 8, -4, 0], rotation: [0, -5, 5, -4, 4, -3, 3, 0, 0] }, duration: 1.1, ease: "none" }, 28.3);
      tl.to("#k-armL", { keyframes: { rotation: [110, 80, 110, 80, 110] }, duration: 0.9, ease: "none" }, 28.45);
      ${JSON.stringify([0, 1, 2])}.forEach((i) => tl.fromTo("#k-pf" + i, { opacity: 0.95, x: 0, y: 0, scale: 0.4 }, { opacity: 0, x: -90 - i * 30, y: -40 + i * 30, scale: 1.6, duration: 0.45, ease: "power2.out", immediateRender: false }, 28.55 + i * 0.3));
      ${JSON.stringify([0, 1, 2, 3, 4, 5, 6])}.forEach((i) => {
        const a = (190 + i * 22) * Math.PI / 180;
        tl.fromTo("#k-cr" + i, { opacity: 1, x: 0, y: 0, scale: 0.6 }, { opacity: 0, x: Math.cos(a) * (140 + i * 14), y: Math.sin(a) * (90 + i * 10) + 40, scale: 1.1, duration: 0.55, ease: "power2.out", immediateRender: false }, 28.6 + (i % 3) * 0.3);
      });
      // the slice turns to gold (price-tag scene)
      tl.to("#k-sgold", { opacity: 0.75, duration: 0.5 }, 31.3);
      tl.to("#k-slice", { keyframes: { scale: [1.35, 1.55, 1.35] }, duration: 0.4, ease: "sine.inOut" }, 31.3);
      tl.to("#k-thumb", { opacity: 1, duration: 0.05 }, 33.3);
      tl.to("#k-thumb", { opacity: 0, duration: 0.05 }, 36.05);
      // GAG 3: the vault rises, the golden slice goes in like a gold bar, door shuts, vault sinks away
      tl.to(["#k-vault", "#k-door"], { y: 0, duration: 0.4, ease: "back.out(1.4)" }, 36.25);
      tl.to("#k-door", { rotationY: -115, duration: 0.35, ease: "power2.out", transformPerspective: 900, transformOrigin: "0% 50%" }, 36.7);
      tl.to("#k-armR", { rotation: -120, duration: 0.3, ease: "power2.out" }, 37.15);
      tl.to("#k-slice", { keyframes: { x: [0, -240, -456], y: [0, -170, -42] }, rotation: -90, scale: 0.85, duration: 0.55, ease: "power1.in" }, 37.3);
      tl.to("#k-armR", { rotation: -40, duration: 0.3, ease: "back.out(1.6)" }, 37.6);
      tl.to("#k-door", { rotationY: 0, duration: 0.25, ease: "power3.in", transformPerspective: 900, transformOrigin: "0% 50%" }, 37.9);
      tl.set("#k-slice", { opacity: 0 }, 38.16);
      tl.to("#k-wheel", { rotation: 360, duration: 0.45, ease: "power2.inOut" }, 38.2);
      tl.to(["#k-vault", "#k-door"], { keyframes: { y: [0, -10, 0] }, duration: 0.18, ease: "none" }, 38.15);
      tl.to("#k-wrap", { keyframes: { rotation: [0, -6, 0] }, duration: 0.4, ease: "sine.inOut" }, 38.2);
      tl.to(["#k-vault", "#k-door"], { y: 600, duration: 0.3, ease: "back.in(1.4)" }, 38.65);
      // loop: shock jolt lands back on the frame-0 pose
      tl.to("#k-wrap", { keyframes: { x: [0, -8, 6, 0], y: [0, -24, 0, 0] }, duration: 0.3, ease: "none" }, 39.02);
`;
const VAULT_BODY = `<svg viewBox="0 0 260 260" width="100%" height="100%" overflow="visible"><rect x="6" y="6" width="248" height="248" rx="26" fill="#6B7684" stroke="${K}" stroke-width="10"/><rect x="34" y="34" width="192" height="192" rx="14" fill="#1B2230" stroke="${K}" stroke-width="6"/><rect x="40" y="200" width="180" height="20" fill="#2B3446"/><rect x="30" y="250" width="40" height="20" rx="6" fill="#4B5566" stroke="${K}" stroke-width="6"/><rect x="190" y="250" width="40" height="20" rx="6" fill="#4B5566" stroke="${K}" stroke-width="6"/></svg>`;
const VAULT_DOOR = `<svg viewBox="0 0 208 208" width="100%" height="100%" overflow="visible"><rect x="4" y="4" width="200" height="200" rx="16" fill="#A8B3C2" stroke="${K}" stroke-width="9"/><rect x="18" y="18" width="172" height="172" rx="12" fill="none" stroke="#6B7684" stroke-width="6"/>
  <g id="k-wheel"><circle cx="104" cy="104" r="46" fill="#8A96A6" stroke="${K}" stroke-width="8"/><path d="M104 50 V158 M50 104 H158 M66 66 L142 142 M142 66 L66 142" stroke="${K}" stroke-width="9" stroke-linecap="round"/><circle cx="104" cy="104" r="14" fill="${YEL}" stroke="${K}" stroke-width="6"/></g>
  <rect x="170" y="80" width="18" height="48" rx="6" fill="${YEL}" stroke="${K}" stroke-width="5"/></svg>`;
fs.writeFileSync(path.join(OUT, "compositions", "klotz.html"), `<template>
  <style>
    #root { position: absolute; inset: 0; pointer-events: none; }
    #k-wrap { position: absolute; left: 700px; top: 1480px; width: 260px; height: 286px; transform-origin: 50% 100%; }
    #k-bob, #k-sq { position: absolute; inset: 0; transform-origin: 50% 100%; }
    #k-shadow { position: absolute; left: 725px; top: 1748px; width: 210px; height: 30px; border-radius: 50%; background: rgba(0,0,0,.35); }
    #k-vault { position: absolute; left: 400px; top: 1520px; width: 260px; height: 260px; }
    #k-door { position: absolute; left: 426px; top: 1546px; width: 208px; height: 208px; }
    #k-wheel { transform-box: fill-box; transform-origin: 50% 50%; }
  </style>
  <div id="root" data-composition-id="klotz" data-width="1080" data-height="1920" data-layout-allow-overflow>
    <div id="k-vault">${VAULT_BODY}</div>
    <div id="k-shadow"></div>
    <div id="k-wrap"><div id="k-bob"><div id="k-sq">
${klotzSvg}
    </div></div></div>
    <div id="k-door">${VAULT_DOOR}</div>
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
  [0.0, "impact", 0.8], [0.05, "coin", 0.5], [0.3, "coin2", 0.4], [1.2, "kaching", 0.7], [1.25, "impact", 0.5],
  [3.4, "whoosh1", 0.5], [3.7, "pop1", 0.4], [4.0, "typing", 0.55], [4.84, "typing", 0.5], [5.65, "click", 0.0],
  [5.9, "whoosh2", 0.45], [6.2, "pop2", 0.5], [6.45, "pop1", 0.4],
  [8.0, "whoosh1", 0.45], [8.22, "stamp", 0.7], [8.6, "sparkle", 0.4],
  [10.1, "whoosh2", 0.4], [10.4, "ring", 0.6], [11.2, "ring", 0.55], [11.0, "whoosh1", 0.4], [11.2, "whoosh1", 0.35],
  [12.6, "pop1", 0.45], [13.15, "whoosh2", 0.45], [13.6, "pop2", 0.4], [13.95, "pop1", 0.4],
  [15.45, "whoosh1", 0.35], [15.6, "pop2", 0.45], [15.75, "printer", 0.6], [16.29, "chomp", 0.7], [16.9, "kaching", 0.4],
  [17.55, "pop1", 0.4], [18.0, "stamp", 0.7], [18.19, "chomp", 0.65],
  [19.25, "whoosh2", 0.4], [19.5, "rise", 0.55], [20.55, "sparkle", 0.4],
  [21.35, "rise2", 0.55], [23.25, "impact", 0.45],
  [23.45, "whoosh1", 0.4], [24.0, "pop2", 0.4], [24.2, "sparkle", 0.5],
  [25.65, "whoosh2", 0.4], [26.05, "typing", 0.4], [27.05, "click", 0.0], [27.15, "pop1", 0.45],
  [28.15, "impact", 0.95], [28.2, "kaching", 0.75], [28.55, "cough", 0.75], [28.5, "coin", 0.4], [28.8, "coin2", 0.35], [29.1, "coin", 0.35], [29.4, "coin2", 0.3],
  [30.75, "whoosh1", 0.4], [31.3, "pop1", 0.45], [31.65, "sparkle", 0.55], [32.6, "sparkle", 0.4],
  [33.25, "whoosh2", 0.4], [33.7, "whoosh1", 0.3], [34.0, "whoosh1", 0.3], [34.3, "stamp", 0.65], [34.4, "sparkle", 0.4],
  [36.15, "whoosh1", 0.4], [36.3, "whoosh2", 0.35], [36.35, "impact", 0.4], [36.75, "whoosh2", 0.3], [37.3, "whoosh1", 0.35], [37.95, "safe", 0.8], [38.2, "coin", 0.3], [38.65, "whoosh2", 0.35],
  [39.0, "whoosh2", 0.5], [39.1, "coin", 0.4],
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
}
console.log(report.join("\n"));
console.log("written", scenes.length, "scenes,", sfx.length, "sfx, lanes", lanes.length);
