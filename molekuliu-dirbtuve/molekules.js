/* Molekulių dirbtuvė: organinių molekulių variklis (medžiai: be žiedų).
   Molekulė: { a: ["C","O",...], b: [[i, j, eilė], ...] }. Vandeniliai skaičiuojami (valentingumas).
   Pavadinimai – Lietuvos VBE stiliumi (vieta prieš kamieną: 2-butanolis, 2-butenas, 2-metilbutanas). */
(function(root){
"use strict";
const VAL = { C: 4, O: 2, F: 1, Cl: 1, Br: 1, I: 1 };
const HALN = { F: "fluor", Cl: "chlor", Br: "brom", I: "jod" };
const STEM = ["", "met", "et", "prop", "but", "pent", "heks", "hept", "okt", "non", "dek"];
const MULT = ["", "", "di", "tri", "tetra", "penta", "heksa"];
const ALPHA = ["brom", "chlor", "etil", "fluor", "jod", "metil"];
const M = {};

/* ---------- SMILES (tik testams ir užduočių aprašams) ---------- */
M.parse = function(s){
  const a = [], b = [], stack = []; let prev = -1, order = 1, i = 0;
  while(i < s.length){
    const ch = s[i];
    if(ch === "("){ stack.push(prev); i++; continue; }
    if(ch === ")"){ prev = stack.pop(); i++; continue; }
    if(ch === "="){ order = 2; i++; continue; }
    if(ch === "#"){ order = 3; i++; continue; }
    let el = ch;
    if((ch === "C" && s[i + 1] === "l") || (ch === "B" && s[i + 1] === "r")){ el = ch + s[i + 1]; i++; }
    i++;
    a.push(el); const k = a.length - 1;
    if(prev >= 0) b.push([prev, k, order]);
    prev = k; order = 1;
  }
  return { a, b };
};

/* ---------- pagrindai ---------- */
const adj = m => { const g = m.a.map(() => []); m.b.forEach(([i, j, o]) => { g[i].push([j, o]); g[j].push([i, o]); }); return g; };
M.adj = adj;
const used = (m, i) => { let s = 0; m.b.forEach(([x, y, o]) => { if(x === i || y === i) s += o; }); return s; };
M.hCount = (m, i) => VAL[m.a[i]] - used(m, i);
M.free = (m, i) => VAL[m.a[i]] - used(m, i);
M.clone = m => ({ a: m.a.slice(), b: m.b.map(x => x.slice()) });

M.formula = function(m){
  const f = {}; m.a.forEach((e, i) => { f[e] = (f[e] || 0) + 1; f.H = (f.H || 0) + M.hCount(m, i); });
  return f;
};
M.formulaStr = function(m, html){
  const f = M.formula(m), keys = Object.keys(f).filter(k => k !== "C" && k !== "H" && f[k] > 0).sort();
  const order = (f.C ? ["C"] : []).concat(f.H ? ["H"] : [], keys);
  const sub = n => n === 1 ? "" : html ? `<sub>${n}</sub>` : String(n).split("").map(d => "₀₁₂₃₄₅₆₇₈₉"[+d]).join("");
  return order.map(k => k + sub(f[k])).join("");
};

M.canon = function(m){
  const g = adj(m), n = m.a.length; if(!n) return "";
  let best = null;
  const rc = (v, p) => { const ch = []; for(const [w, o] of g[v]) if(w !== p) ch.push(o + rc(w, v)); ch.sort(); return m.a[v] + "(" + ch.join(",") + ")"; };
  for(let r = 0; r < n; r++){ const s = rc(r, -1); if(best === null || s < best) best = s; }
  return best;
};

/* ---------- pavadinimų sudarymas ---------- */
const cmpArr = (x, y) => {
  for(let i = 0; i < Math.max(x.length, y.length); i++){
    const a = x[i], b = y[i];
    if(a === undefined) return -1; if(b === undefined) return 1;
    if(Array.isArray(a) || Array.isArray(b)){ const c = cmpArr([].concat(a), [].concat(b)); if(c) return c; }
    else if(a !== b) return a < b ? -1 : 1;
  }
  return 0;
};

/* grąžina { ok, kind, cands[], best } arba null, jei molekulė nepatenka į žaidimo ribas */
function analyze(m){
  const g = adj(m), n = m.a.length;
  if(!n || m.b.length !== n - 1) return null;
  const cs = []; for(let i = 0; i < n; i++) if(m.a[i] === "C") cs.push(i);
  if(!cs.length) return null;
  const info = {}; cs.forEach(c => info[c] = { oxo: 0, ol: 0, hal: [], cn: 0, het: [] });
  for(let i = 0; i < n; i++){
    if(m.a[i] === "C") continue;
    if(g[i].length !== 1 || m.a[g[i][0][0]] !== "C") return null;
    const [c, o] = g[i][0], I = info[c];
    if(m.a[i] === "O"){ if(o === 2) I.oxo++; else I.ol++; I.het.push(i); }
    else { if(o !== 1) return null; I.hal.push(m.a[i]); I.het.push(i); }
  }
  cs.forEach(c => { g[c].forEach(([w]) => { if(m.a[w] === "C") info[c].cn++; }); });
  /* pagrindinė grupė */
  let kind = null, pc = -1, groups = 0, hals = 0;
  cs.forEach(c => {
    const I = info[c]; hals += I.hal.length;
    let k = null;
    if(I.oxo === 1 && I.ol === 1) k = "acid";
    else if(I.oxo === 1 && I.ol === 0){ k = I.cn <= 1 ? "ald" : "ket"; if(I.cn > 2) return; }
    else if(I.ol === 1 && I.oxo === 0) k = "alc";
    else if(I.oxo || I.ol) k = "bad";
    if(k){ groups++; kind = k; pc = c; }
  });
  if(kind === "bad" || groups > 1) return null;
  if(groups && hals) return null;
  if(hals > 2) return null;
  /* nesotieji ryšiai */
  const un = []; m.b.forEach(([i, j, o]) => { if(m.a[i] === "C" && m.a[j] === "C" && o > 1) un.push([i, j, o]); });
  if(un.length > 1 || (un.length && (groups || hals))) return null;
  const cg = {}; cs.forEach(c => cg[c] = g[c].filter(([w]) => m.a[w] === "C").map(([w]) => w));
  /* visi keliai tarp anglies atomų */
  const paths = [];
  cs.forEach(u => {
    const walk = (v, p, path) => { paths.push(path.slice()); cg[v].forEach(w => { if(w !== p){ path.push(w); walk(w, v, path); path.pop(); } }); };
    walk(u, -1, [u]);
  });
  const cands = [];
  paths.forEach(P0 => {
    [P0, P0.slice().reverse()].forEach((P, di) => {
      if(P0.length === 1 && di) return;
      if(pc >= 0 && !P.includes(pc)) return;
      if(un.length && !(P.includes(un[0][0]) && P.includes(un[0][1]))) return;
      if((kind === "acid" || kind === "ald") && P[0] !== pc) return;
      const loc = new Map(); P.forEach((c, k) => loc.set(c, k + 1));
      const subs = []; let bad = false;
      P.forEach(c => {
        g[c].forEach(([w, o]) => {
          if(loc.has(w)) return;
          if(m.a[w] === "C"){
            if(o !== 1){ bad = true; return; }
            const kids = g[w].filter(([x]) => x !== c);
            if(!kids.length) subs.push({ loc: loc.get(c), nm: "metil" });
            else if(kids.length === 1 && m.a[kids[0][0]] === "C" && kids[0][1] === 1 && g[kids[0][0]].length === 1) subs.push({ loc: loc.get(c), nm: "etil" });
            else bad = true;
          } else if(HALN[m.a[w]]) subs.push({ loc: loc.get(c), nm: HALN[m.a[w]] });
          /* O grupės – pagrindinė grupė, praleidžiama */
        });
      });
      if(bad) return;
      const sl = subs.map(s => s.loc).sort((x, y) => x - y);
      const al = subs.slice().sort((x, y) => ALPHA.indexOf(x.nm) - ALPHA.indexOf(y.nm) || x.loc - y.loc).map(s => s.loc);
      const pcl = pc >= 0 ? loc.get(pc) : 0;
      const ul = un.length ? Math.min(loc.get(un[0][0]), loc.get(un[0][1])) : 0;
      const key = [-P.length, -subs.length, pcl, ul, sl, al];
      cands.push({ P, len: P.length, subs, pcl, ul, key, sl, al });
    });
  });
  if(!cands.length) return null;
  cands.sort((x, y) => cmpArr(x.key, y.key));
  const type = un.length ? (un[0][2] === 2 ? "ene" : "yne") : "ane";
  const res = { kind, type, un, hals, cands, best: cands[0], cn: cs.length };
  cands.forEach(c => { c.name = compose(res, c); });
  return res;
}

function compose(res, c){
  if(c.len > 10) return null;
  const by = {};
  c.subs.forEach(s => { (by[s.nm] = by[s.nm] || []).push(s.loc); });
  const names = Object.keys(by).sort((x, y) => ALPHA.indexOf(x) - ALPHA.indexOf(y));
  if(c.subs.length > 6) return null;
  const noLoc = !res.kind && res.type === "ane" && res.hals && (c.len === 1 || (c.len === 2 && c.subs.length === 1));
  const pre = names.map(nm => (noLoc ? "" : by[nm].sort((x, y) => x - y).join(",") + "-") + MULT[by[nm].length] + nm).join("-");
  const st = STEM[c.len];
  let tail, loc = "";
  switch(res.kind){
    case "acid": tail = st + "ano rūgštis"; break;
    case "ald": tail = st + "analis"; break;
    case "ket": tail = st + "anonas"; if(c.len >= 5 || c.subs.length) loc = c.pcl; break;
    case "alc": tail = st + "anolis"; if(c.len >= 3) loc = c.pcl; break;
    default:
      if(res.type === "ene"){ tail = st + "enas"; if(c.len >= 4) loc = c.ul; }
      else if(res.type === "yne"){ tail = st + "inas"; if(c.len >= 4) loc = c.ul; }
      else tail = st + "anas";
  }
  if(loc !== "") tail = loc + "-" + tail;
  if(!pre) return tail;
  return pre + (loc !== "" ? "-" : "") + tail;
}

M.analyze = analyze;
M.name = m => { const r = analyze(m); return r ? r.best.name : null; };
M.nameStr = M.name;

M.fstr = function(f, html){
  const keys = Object.keys(f).filter(k => k !== "C" && k !== "H" && f[k] > 0).sort();
  const order = (f.C ? ["C"] : []).concat(f.H ? ["H"] : [], keys);
  const sub = n => n === 1 ? "" : html ? `<sub>${n}</sub>` : String(n).split("").map(d => "₀₁₂₃₄₅₆₇₈₉"[+d]).join("");
  return order.map(k => k + sub(f[k])).join("");
};
M.stem = n => STEM[n];

/* numeracijos paaiškinimo duomenys */
M.trace = function(m){
  const r = analyze(m); if(!r) return null;
  const b = r.best;
  const rev = r.cands.find(c => c !== b && c.P.length === b.P.length && c.P.every((x, i) => x === b.P[b.P.length - 1 - i]));
  let reason = null;
  if(r.kind === "acid" || r.kind === "ald") reason = b.len > 1 ? "fixed" : null;
  else if(rev){
    const nm = ["", "", "pc", "ul", "sl", "al"];
    for(let i = 2; i <= 5; i++){ if(cmpArr([].concat(b.key[i]), [].concat(rev.key[i])) !== 0){ reason = nm[i]; break; } }
    if(!reason) reason = "sym";
  }
  return { kind: r.kind, type: r.type, len: b.len, stem: STEM[b.len], pcl: b.pcl, ul: b.ul, subs: b.subs.slice(), sl: b.sl, revSl: rev ? rev.sl : null,
    reason, name: b.name, hals: r.hals };
};

/* klasė */
M.classOf = function(m){
  const r = analyze(m); if(!r) return null;
  if(r.kind) return { acid: "acid", ald: "ald", ket: "ket", alc: "alc" }[r.kind];
  if(r.hals) return "hal";
  return r.type === "ane" ? "ane" : r.type === "ene" ? "ene" : "yne";
};

/* painiojami pavadinimai: kita numeracija ir trumpesnė grandinė */
M.wrongNames = function(m){
  const r = analyze(m); if(!r) return { num: null, short: null };
  const b = r.best; let num = null, short = null;
  const rev = r.cands.find(c => c !== b && c.P.length === b.P.length && c.P.every((x, i) => x === b.P[b.P.length - 1 - i]));
  if(rev && rev.name !== b.name) num = rev.name;
  const sh = r.cands.filter(c => c.len < b.len && c.name !== b.name && !c.subs.some(x => (x.nm === "metil" && (x.loc === 1 || x.loc === c.len)) || (x.nm === "etil" && (x.loc <= 2 || x.loc >= c.len - 1))));
  if(sh.length){ sh.sort((x, y) => cmpArr(x.key, y.key)); short = sh[0].name; }
  return { num, short };
};

/* ---------- išdėstymas tinklelyje (rodomiems pavyzdžiams) ---------- */
const D = { E: [1, 0], W: [-1, 0], N: [0, -1], S: [0, 1] };
M.DIRS = D;
M.layout = function(m){
  const g = adj(m), n = m.a.length;
  if(n === 1) return [[0, 0]];
  /* šaknis – ilgiausio anglies kelio galas */
  const cs = []; for(let i = 0; i < n; i++) if(m.a[i] === "C") cs.push(i);
  let root = cs[0], bl = -1;
  cs.forEach(u => {
    const dfs = (v, p, d) => { if(d > bl){ bl = d; root = u; } g[v].forEach(([w]) => { if(w !== p && m.a[w] === "C") dfs(w, v, d + 1); }); };
    dfs(u, -1, 0);
  });
  const size = (v, p) => 1 + g[v].reduce((s, [w]) => w === p ? s : s + size(w, v), 0);
  const tries = [["E", "N", "S", "W"], ["E", "S", "N", "W"]];
  for(const pref of tries){
    const pos = Array(n).fill(null), occ = new Set();
    const key = (x, y) => x + "," + y;
    const place = (v, p, dirIn, x, y, par) => {
      pos[v] = [x, y]; occ.add(key(x, y));
      const ch = g[v].filter(([w]) => w !== p).map(([w]) => w);
      ch.sort((u, w) => (m.a[w] === "C") - (m.a[u] === "C") || size(w, v) - size(u, w));
      let order;
      if(!dirIn) order = pref;
      else {
        const horiz = dirIn === "E" || dirIn === "W";
        const perp = horiz ? ["N", "S"] : ["E", "W"];
        order = [dirIn].concat(par ? perp.slice().reverse() : perp);
      }
      const usedD = new Set();
      for(const w of ch){
        let ok = false;
        for(const d of order.concat(["E", "N", "S", "W"])){
          if(usedD.has(d)) continue;
          if(dirIn && ((dirIn === "E" && d === "W") || (dirIn === "W" && d === "E") || (dirIn === "N" && d === "S") || (dirIn === "S" && d === "N"))) continue;
          const nx = x + D[d][0], ny = y + D[d][1];
          if(occ.has(key(nx, ny))) continue;
          usedD.add(d);
          if(place(w, v, d, nx, ny, (nx + ny) & 1)) { ok = true; break; }
          usedD.delete(d);
        }
        if(!ok) return false;
      }
      return true;
    };
    if(place(root, -1, null, 0, 0, 0)) return pos;
  }
  return null;
};

/* ---------- išvardijimas (izomerų medžioklė) ---------- */
const skCache = {};
M.skeletons = function(n){
  if(skCache[n]) return skCache[n];
  if(n === 1) return skCache[1] = [{ a: ["C"], b: [] }];
  const prev = M.skeletons(n - 1), seen = new Map();
  prev.forEach(t => {
    t.a.forEach((_, i) => {
      if(used(t, i) >= 4) return;
      const m = M.clone(t); m.a.push("C"); m.b.push([i, m.a.length - 1, 1]);
      const k = M.canon(m); if(!seen.has(k)) seen.set(k, m);
    });
  });
  return skCache[n] = [...seen.values()];
};
M.enumerate = function(spec){
  const out = new Map(), add = m => { const k = M.canon(m); if(!out.has(k)) out.set(k, m); };
  M.skeletons(spec.n).forEach(t => {
    const deg = t.a.map((_, i) => used(t, i));
    const withO = (i, o) => { const m = M.clone(t); m.a.push("O"); m.b.push([i, m.a.length - 1, o]); return m; };
    switch(spec.cls){
      case "ane": add(t); break;
      case "ene": t.b.forEach(([i, j]) => { if(deg[i] <= 3 && deg[j] <= 3){ const m = M.clone(t); m.b.find(x => x[0] === i && x[1] === j)[2] = 2; add(m); } }); break;
      case "yne": t.b.forEach(([i, j]) => { if(deg[i] <= 2 && deg[j] <= 2){ const m = M.clone(t); m.b.find(x => x[0] === i && x[1] === j)[2] = 3; add(m); } }); break;
      case "alc": t.a.forEach((_, i) => { if(deg[i] <= 3) add(withO(i, 1)); }); break;
      case "ald": t.a.forEach((_, i) => { if(deg[i] <= 1) add(withO(i, 2)); }); break;
      case "ket": t.a.forEach((_, i) => { if(deg[i] === 2) add(withO(i, 2)); }); break;
      case "acid": t.a.forEach((_, i) => { if(deg[i] <= 1){ const m = withO(i, 2); m.a.push("O"); m.b.push([i, m.a.length - 1, 1]); add(m); } }); break;
      case "hal": {
        const X = spec.x || "Cl", k = spec.k || 1;
        const rec = (start, left, m, dg) => {
          if(!left){ add(m); return; }
          for(let i = start; i < t.a.length; i++){
            if(dg[i] >= 4) continue;
            const m2 = M.clone(m); m2.a.push(X); m2.b.push([i, m2.a.length - 1, 1]);
            const d2 = dg.slice(); d2[i]++;
            rec(i, left - 1, m2, d2);
          }
        };
        rec(0, k, t, deg);
        break;
      }
    }
  });
  return [...out.values()];
};

root.MK_CHEM = M;
if(typeof module !== "undefined") module.exports = M;
})(typeof window !== "undefined" ? window : global);
