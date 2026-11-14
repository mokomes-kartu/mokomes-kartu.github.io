/* Slibino sala – paskutinė užduotis „Slibino lobynas“ (2D loginis žaidimas):
   1) paveiksle rasti penkis paslėptus ženklus (kriauklė, lapas, grybas, plunksna, žuvis) – ant kiekvieno yra spynos užuomina;
   2) pagal užuominas išsiaiškinti trijų skaitmenų spynos kodą (sprendimas visada vienintelis – tikrinama kodu). */
const INK = "#121a33";
const st = `stroke="${INK}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"`;
function rngF(a){ return function(){ a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

/* ---------- spynos kodas ir užuominos ---------- */
const fb = (code, g) => { let a = 0, b = 0; for(let i = 0; i < 3; i++){ if(g[i] === code[i]) a++; else if(code.includes(g[i])) b++; } return [a, b]; };
const ALL = []; for(let a = 0; a < 10; a++) for(let b = 0; b < 10; b++) for(let c = 0; c < 10; c++) if(a !== b && a !== c && b !== c) ALL.push([a, b, c]);
export function solutions(clues){ return ALL.filter(c => clues.every(q => { const f = fb(c, q.g); return f[0] === q.f[0] && f[1] === q.f[1]; })); }
export function makeLock(rnd){
  const R = rnd || Math.random, pick = () => ALL[Math.floor(R() * ALL.length)];
  for(let t = 0; t < 5000; t++){
    const code = pick(), clues = [];
    for(let k = 0; k < 5; k++){ const g = pick(); clues.push({ g, f: fb(code, g) }); }
    if(clues.some(q => q.f[0] === 3)) continue;
    if(!clues.some(q => q.f[0] + q.f[1] === 0)) continue;              // bent viena „nė vieno teisingo“
    if(clues.filter(q => q.f[0] >= 1).length < 1) continue;            // bent viena „savo vietoje“
    if(clues.filter(q => q.f[0] + q.f[1] === 0).length > 2) continue;
    if(new Set(clues.map(q => q.g.join(""))).size < 5) continue;
    const sol = solutions(clues); if(sol.length !== 1) continue;
    /* nė viena užuomina neturi būti perteklinė iki trivialumo: be bet kurių dviejų užuominų sprendinių turi būti daugiau */
    if(solutions(clues.slice(0, 3)).length < 2) continue;
    return { code, clues };
  }
  return { code: [0, 4, 2], clues: [[6, 8, 2, 1, 0], [6, 1, 4, 0, 1], [2, 0, 6, 0, 2], [7, 3, 8, 0, 0], [7, 8, 0, 0, 1]].map(r => ({ g: r.slice(0, 3), f: [r[3], r[4]] })) };
}

/* ---------- piešiniai ---------- */
const ICON = {
  shell: (f, s) => `<path d="M0 15L-15 -3A15.5 15.5 0 0 1 15 -3Z" fill="${f}" stroke="${s}" stroke-width="2" stroke-linejoin="round"/><path d="M0 15L-8 -12M0 15V-15M0 15L8 -12" stroke="${s}" stroke-width="1.5"/>`,
  leaf: (f, s) => `<path d="M0 -17C13 -8 13 8 0 17C-13 8 -13 -8 0 -17Z" fill="${f}" stroke="${s}" stroke-width="2" stroke-linejoin="round"/><path d="M0 -15V17M0 -4l7 -5M0 4l-7 -5M0 10l6 -4" stroke="${s}" stroke-width="1.4" fill="none"/>`,
  mushroom: (f, s) => `<path d="M-5 1h10l2 14q-7 3 -14 0z" fill="${f}" stroke="${s}" stroke-width="2" stroke-linejoin="round"/><path d="M-16 2A16 14 0 0 1 16 2Z" fill="${f}" stroke="${s}" stroke-width="2" stroke-linejoin="round"/><circle cx="-6" cy="-5" r="2.2" fill="${s}"/><circle cx="5" cy="-7" r="2.6" fill="${s}"/><circle cx="9" cy="-1.5" r="1.6" fill="${s}"/>`,
  feather: (f, s) => `<path d="M-5 17C-15 2 -8 -14 6 -17C12 -5 7 9 -5 17Z" fill="${f}" stroke="${s}" stroke-width="2" stroke-linejoin="round"/><path d="M-7 19L5 -14M-4 6l6 -1M-2 0l6 -2M0 -6l5 -2" stroke="${s}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`,
  fish: (f, s) => `<path d="M9 0L18 -8V8Z" fill="${f}" stroke="${s}" stroke-width="2" stroke-linejoin="round"/><ellipse cx="-3" cy="0" rx="14" ry="8.5" fill="${f}" stroke="${s}" stroke-width="2"/><circle cx="-10" cy="-2" r="1.8" fill="${s}"/><path d="M-3 -5q4 5 0 10" stroke="${s}" stroke-width="1.4" fill="none"/>`
};
export const IDS = ["shell", "leaf", "mushroom", "feather", "fish"];
const COL = { shell: "#ff8a2a", leaf: "#3fd16a", mushroom: "#b16bff", feather: "#ffc61a", fish: "#2f9bff" };
/* slėptuvės: [x, y, mastelis, posūkis, užpildas, kontūras] – spalvos artimos aplinkai */
const SPOTS = [
  [118, 137, 0.72, 8, "#b0563c", "#6e2f1f"],     // lentynoje tarp knygų
  [652, 372, 0.8, -12, "#9a6a3c", "#5e3b1c"],    // ant statinės šono
  [205, 432, 0.8, 20, "#f0bd3a", "#a8741a"],     // monetų krūvoje
  [400, 118, 0.85, 0, "#a83246", "#5e1626"],     // ant vėliavos
  [650, 140, 0.7, -8, "#8fb4c9", "#4d7388"],     // palangėje
  [336, 462, 0.8, 90, "#8a3a52", "#4e1a2c"],     // kilimo rašte
  [44, 46, 0.7, -30, "#8a8496", "#55505f"],      // voratinklio kampe
  [540, 432, 0.75, 15, "#f0bd3a", "#a8741a"],    // monetose prie skrynios
  [78, 410, 0.8, -6, "#a8784a", "#63401f"],      // ant dėžės
  [283, 200, 0.62, 0, "#6f6a7c", "#3f3b48"],     // ant sienos akmens prie fakelo
  [163, 404, 0.75, 10, "#c9b08a", "#8a7350"],    // ant maišo
  [523, 152, 0.74, 0, "#b8bcc8", "#6b7080"]      // ant skydo
];
function sceneSvg(seed, placed, found){
  const r = rngF(seed); let s = "";
  /* siena ir grindys */
  s += `<rect width="800" height="500" fill="#5f5a6e"/>`;
  for(let j = 0; j < 9; j++) for(let i = -1; i < 9; i++){ const x = i * 100 + (j % 2) * 50, y = j * 38; s += `<rect x="${x + 2}" y="${y + 2}" width="96" height="34" rx="5" fill="${["#6f6a7c", "#676276", "#7a7588", "#6b6679"][Math.floor(r() * 4)]}"/>`; }
  s += `<path d="M0 340h800v160H0z" fill="#7a5a44"/>`;
  for(let i = 0; i < 9; i++) s += `<path d="M${i * 100 - 20} 500L${150 + i * 62} 340" stroke="#5e4332" stroke-width="2.5"/>`;
  s += `<path d="M0 340h800" stroke="${INK}" stroke-width="3"/>`;
  /* voratinklis */
  s += `<g stroke="#cfcbd8" stroke-width="1.6" fill="none" opacity=".8"><path d="M0 0L95 70M0 0L60 100M0 0L110 30M0 0L20 110"/><path d="M30 8Q28 24 12 34M58 16Q52 46 22 62M86 26Q76 68 34 90"/></g>`;
  /* langas */
  s += `<path d="M600 150V80a50 50 0 0 1 100 0v70z" fill="#9fd3ee" ${st}/><path d="M650 30v120M600 100h100" ${st}/><circle cx="676" cy="62" r="11" fill="#fff3b0"/><rect x="592" y="150" width="116" height="12" rx="3" fill="#8a8496" ${st}/>`;
  /* vėliava */
  s += `<path d="M352 40h96" ${st} stroke-width="4"/><path d="M360 42h80v120l-40 -22l-40 22z" fill="#c13a52" ${st}/><path d="M372 60h56M372 74h56" stroke="#f0bd3a" stroke-width="4"/><circle cx="400" cy="100" r="0" />`;
  /* lentyna su knygomis ir ąsočiais */
  s += `<rect x="40" y="158" width="210" height="12" rx="3" fill="#8a5a36" ${st}/><path d="M56 170v22M234 170v22" ${st}/>`;
  const bc = ["#c9503c", "#3d6fb0", "#e0a52c", "#3f9d6b", "#8a4fb0", "#b0563c", "#2f8a9a"]; let bx = 50;
  for(let k = 0; k < 9; k++){ const w = 14 + Math.floor(r() * 9), h = 34 + Math.floor(r() * 22); if(k === 4){ bx += 30; } s += `<rect x="${bx}" y="${158 - h}" width="${w}" height="${h}" rx="2" fill="${bc[k % bc.length]}" ${st}/><path d="M${bx + 3} ${158 - h + 8}h${w - 6}" stroke="#fff" stroke-width="2" opacity=".6"/>`; bx += w + 2; }
  s += `<path d="M222 158v-22q-8 -4 -8 -12h28q0 8 -8 12v22z" fill="#d9c7a0" ${st}/>`;
  /* fakelas */
  s += `<path d="M300 250l-8 -70h16z" fill="#8a5a36" ${st}/><path d="M292 180q-14 -22 8 -46q6 14 14 16q6 -8 2 -18q16 20 2 48z" fill="#ff8a2a" ${st}/><path d="M298 176q-4 -12 4 -22q8 10 4 22z" fill="#ffd23a"/><path d="M270 214h60" ${st} stroke-width="4"/>`;
  /* skydas ir kardai */
  s += `<path d="M560 108l-74 88M486 108l74 88" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M560 108l-74 88M486 108l74 88" stroke="#c9ced8" stroke-width="3.5" stroke-linecap="round"/><path d="M493 118h60v32q0 26 -30 38q-30 -12 -30 -38z" fill="#b8bcc8" ${st}/><path d="M523 118v70M493 146h60" stroke="${INK}" stroke-width="2"/>`;
  /* antra lentyna su ąsočiais ir žvake, grandinė su žibintu, sienos įtrūkimai, pelės urvelis */
  s += `<rect x="560" y="246" width="200" height="11" rx="3" fill="#8a5a36" ${st}/><path d="M576 257v18M744 257v18" ${st}/>`;
  s += `<path d="M584 246v-20q-9 -5 -9 -16h30q0 11 -9 16v20z" fill="#c98b5c" ${st}/><path d="M622 246q-12 -14 0 -30h16q12 16 0 30z" fill="#7f9fb8" ${st}/><rect x="666" y="218" width="12" height="28" fill="#fff4dc" ${st}/><path d="M672 218v-6" ${st}/><path d="M672 200q6 7 0 12q-6 -5 0 -12z" fill="#ffb02e" ${st}/><path d="M700 246l6 -22h22l6 22z" fill="#b0563c" ${st}/><path d="M704 232h30" stroke="#f0bd3a" stroke-width="3"/>`;
  s += `<path d="M168 0v60" stroke="#3f3b48" stroke-width="3" stroke-dasharray="6 4"/><path d="M152 60h32l6 34h-44z" fill="#ffe9a8" ${st}/><path d="M148 94h40" ${st} stroke-width="4"/>`;
  s += `<path d="M450 230l12 16 -8 14 14 18M130 250l-10 18 12 12" stroke="#3f3b48" stroke-width="2" fill="none"/>`;
  s += `<path d="M768 340v-22a16 16 0 0 1 32 0v22z" fill="#2a2632" ${st}/>`;
  /* maišai, ritinėliai ir knygos ant grindų */
  s += `<path d="M148 372q-22 26 -10 62h54q12 -36 -10 -62q-4 -10 -17 -10t-17 10z" fill="#c9b08a" ${st}/><path d="M152 372q13 8 26 0" ${st} fill="none"/>`;
  s += `<rect x="470" y="462" width="70" height="12" rx="2" fill="#3d6fb0" ${st}/><rect x="476" y="450" width="60" height="12" rx="2" fill="#c9503c" ${st}/><rect x="600" y="470" width="54" height="13" rx="6" fill="#f3e6c4" ${st}/><rect x="612" y="458" width="54" height="13" rx="6" fill="#ead9b0" ${st}/>`;
  s += `<path d="M700 470l10 -70" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M700 470l10 -70" stroke="#c9ced8" stroke-width="3" stroke-linecap="round"/><path d="M696 404h28" ${st} stroke-width="4"/>`;
  /* kilimas */
  s += `<path d="M250 440h300l40 50H210z" fill="#a8455e" ${st}/><path d="M262 452h276M246 474h308" stroke="#f0bd3a" stroke-width="3"/>`;
  for(let k = 0; k < 6; k++) s += `<path d="M${275 + k * 45} 463l10 -7 10 7 -10 7z" fill="#8a3a52" stroke="#f0bd3a" stroke-width="1.5"/>`;
  /* dėžės */
  s += `<rect x="30" y="368" width="96" height="84" rx="4" fill="#a8784a" ${st}/><path d="M30 396h96M30 424h96M62 368v84M94 368v84" stroke="#63401f" stroke-width="2"/>`;
  /* statinės */
  for(const [x, y] of [[652, 402], [730, 446]]){ s += `<path d="M${x - 34} ${y - 58}q-8 30 0 62h68q8 -32 0 -62z" fill="#9a6a3c" ${st}/><ellipse cx="${x}" cy="${y - 58}" rx="34" ry="9" fill="#b98a58" ${st}/><path d="M${x - 37} ${y - 40}h74M${x - 37} ${y - 14}h74" stroke="#4a4a56" stroke-width="4"/>`; }
  /* vaza */
  s += `<path d="M722 398q-12 -22 2 -40h22q14 18 2 40q16 24 -4 46h-18q-20 -22 -4 -46z" fill="#3f8f9f" ${st} transform="translate(26 -58) scale(.8)"/>`;
  /* monetų krūvos ir taurės */
  const coins = (cx, cy, w, h, n) => { let o = `<path d="M${cx - w} ${cy}q${w} ${-h * 2} ${w * 2} 0z" fill="#e8ad2c" ${st}/>`; for(let k = 0; k < n; k++){ const a = r() * Math.PI, d = Math.sqrt(r()), x = cx + Math.cos(a) * d * w * 0.86, y = cy - Math.sin(a) * d * h * 0.82 - 2; o += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="8" ry="3.4" fill="${r() < 0.5 ? "#ffd23a" : "#f0bd3a"}" stroke="#a8741a" stroke-width="1.3"/>`; } return o; };
  s += coins(215, 448, 78, 44, 46) + coins(560, 446, 62, 30, 30);
  s += `<path d="M150 440l-6 -26h30l-6 26zM157 440v12M147 454h22" fill="#f0bd3a" ${st}/>`;
  for(const [x, y, c] of [[188, 404, "#ff5d8f"], [246, 418, "#3fd1c8"], [596, 430, "#7ee08a"]]) s += `<path d="M${x} ${y - 8}l8 8 -8 10 -8 -10z" fill="${c}" stroke="${INK}" stroke-width="1.6"/>`;
  /* didžioji skrynia */
  s += `<g id="vChest"><rect x="340" y="352" width="132" height="76" rx="6" fill="#8a5a34" ${st}/><path d="M340 352q0 -44 66 -44t66 44z" fill="#a8713f" ${st} id="vLid"/><path d="M362 352v76M450 352v76M362 312v40M450 312v40" stroke="#c9a43b" stroke-width="6"/><rect x="394" y="344" width="24" height="30" rx="5" fill="#c9a43b" ${st}/><circle cx="406" cy="356" r="4" fill="${INK}"/><path d="M406 356v9" stroke="${INK}" stroke-width="3" stroke-linecap="round"/></g>`;
  /* paslėpti ženklai */
  placed.forEach((sp, k) => {
    const [x, y, sc, rot, f, s2] = SPOTS[sp], id = IDS[k], on = found.includes(id);
    s += `<g class="vit${on ? " on" : ""}" data-it="${id}" transform="translate(${x} ${y})"><circle r="30" fill="transparent"/><g transform="rotate(${on ? 0 : rot}) scale(${on ? 1.15 : sc})">${on ? `<circle r="21" fill="#fff" stroke="${COL[id]}" stroke-width="4"/>` : ""}${ICON[id](on ? COL[id] : f, on ? INK : s2)}</g></g>`;
  });
  return `<svg viewBox="0 0 800 500" class="vsc" role="img" aria-label="Slibino lobynas">${s}</svg>`;
}
const iconSvg = (id, on) => `<svg viewBox="-22 -22 44 44" aria-hidden="true">${ICON[id](on ? COL[id] : "#e8e4da", on ? INK : "#b4ad9c")}</svg>`;

/* ---------- žaidimas ---------- */
export function openVault(el, T, sfx, state, cb){
  /* state: išsaugoma būsena { seed, spots, found, lock, tries, guesses } */
  const V = T.vault;
  if(!state.seed){
    state.seed = 1 + Math.floor(Math.random() * 1e6);
    const idx = SPOTS.map((_, i) => i); for(let i = idx.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    state.spots = idx.slice(0, 5); state.found = []; state.lock = makeLock(); state.tries = 0; state.guesses = []; state.miss = 0;
  }
  let dial = [0, 0, 0], msg = "", opened = false;
  const clueLine = (q, mine) => { const [a, b] = q.f; return `<li class="${mine ? "mine" : ""}"><b>${q.g.join(" ")}</b><span>${V.fb(a, b)}</span></li>`; };
  function draw(){
    const allFound = state.found.length === 5;
    const list = `<div class="vlist">${IDS.map(id => `<span class="${state.found.includes(id) ? "on" : ""}">${iconSvg(id, state.found.includes(id))}<i>${V.items[id]}</i></span>`).join("")}</div>`;
    const clues = state.found.length ? `<ol class="vclues">${IDS.filter(id => state.found.includes(id)).map(id => { const q = state.lock.clues[IDS.indexOf(id)]; return `<li><em>${iconSvg(id, true)}</em><b>${q.g.join(" ")}</b><span>${V.fb(q.f[0], q.f[1])}</span></li>`; }).join("")}${state.guesses.map(q => clueLine(q, true)).join("")}</ol>` : "";
    const lock = allFound ? `<div class="vlock"><div class="vdials">${dial.map((d, i) => `<div class="vd"><button type="button" data-d="${i}" data-s="1" aria-label="${V.up}">▲</button><b>${d}</b><button type="button" data-d="${i}" data-s="-1" aria-label="${V.down}">▼</button></div>`).join("")}</div>
      <button type="button" class="mk-btn" id="vTry">${V.unlock}</button></div>` : "";
    el.innerHTML = `<h2>${V.title}</h2><p class="vtask">${opened ? V.done : allFound ? V.task2 : V.task1(5 - state.found.length)}</p>
      <div class="vgrid"><div class="vleft">${sceneSvg(state.seed, state.spots, state.found)}${list}</div>
      <div class="vright">${clues || `<p class="vmsg">${V.cluesEmpty}</p>`}${lock}${msg ? `<p class="vmsg">${msg}</p>` : ""}
      ${opened ? `<button type="button" class="mk-btn" id="vEnd">${V.finish}</button>` : `<button type="button" class="mk-btn ghost" id="vLater">${V.later}</button>`}</div></div>`;
    if(opened){ const lid = el.querySelector("#vLid"); if(lid) lid.setAttribute("transform", "rotate(-38 340 352)"); const ch = el.querySelector("#vChest"); if(ch) ch.insertAdjacentHTML("beforeend", `<path d="M352 352q54 -70 108 0z" fill="#ffd23a" opacity=".9"/><path d="M406 300v-40M370 310l-24 -30M442 310l24 -30" stroke="#ffe27a" stroke-width="5" stroke-linecap="round"/>`); }
  }
  el.onclick = e => {
    if(opened){ if(e.target.closest("#vEnd")){ sfx.tap(); cb.done(state.tries, state.miss); } return; }
    if(e.target.closest("#vLater")){ sfx.tap(); cb.later(); return; }
    const it = e.target.closest("[data-it]");
    if(it){ const id = it.dataset.it; if(!state.found.includes(id)){ state.found.push(id); sfx.good(); msg = V.found(V.items[id]) + (state.found.length === 5 ? " " + V.allFound : ""); cb.save(); draw(); } return; }
    if(e.target.closest(".vsc") && state.found.length < 5){ state.miss++; return; }
    const d = e.target.closest("[data-d]");
    if(d){ const i = +d.dataset.d; dial[i] = (dial[i] + +d.dataset.s + 10) % 10; sfx.tap(); el.querySelectorAll(".vd b")[i].textContent = dial[i]; return; }
    if(e.target.closest("#vTry")){
      if(dial.every((x, i) => x === state.lock.code[i])){ opened = true; msg = ""; sfx.win(); cb.save(); draw(); cb.opened(); return; }
      state.tries++; sfx.bad();
      const f = fb(state.lock.code, dial);
      if(!state.guesses.some(q => q.g.join("") === dial.join(""))) state.guesses.push({ g: dial.slice(), f });
      msg = new Set(dial).size < 3 ? V.distinct : V.wrong; cb.save(); draw();
      const lk = el.querySelector(".vlock"); if(lk){ lk.classList.add("mk-shake"); }
    }
  };
  draw();
  return { solve: () => { state.found = IDS.slice(); dial = state.lock.code.slice(); draw(); }, state };
}
