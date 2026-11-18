/* Bokštinis kranas – užduočių generatorius (be tekstų; matiniai skaičiai užrašomi tarptautiniais vienetų žymenimis).
   Ilgis skaičiuojamas milimetrais, masė – kilogramais. Kiekviena užduotis turi vienintelį sprendimą (tikrinama perrinkimu). */
(function(root){
"use strict";
const U = { mm: 1, cm: 10, dm: 100, m: 1000, kg: 1, t: 1000 };
const NB = " ";
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = a.slice(); for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* Matinio skaičiaus užrašas: f – vienetų sąrašas, pvz. ["m"], ["m","cm"]. Grąžina null, jei taip užrašyti negalima. */
function label(v, f){
  if(f.length === 1){ return v % U[f[0]] === 0 && v > 0 ? (v / U[f[0]]) + NB + f[0] : null; }
  const a = Math.floor(v / U[f[0]]), r = v - a * U[f[0]];
  if(a < 1 || r <= 0 || r % U[f[1]] !== 0) return null;
  if(f[0] === "dm" && a > 9) return null; /* „22 dm 5 cm“ nerašome – tada jau metrai */
  return a + NB + f[0] + NB + (r / U[f[1]]) + NB + f[1];
}
const fkey = f => f.join("_");

/* Vienetų šeimos (lygiai). step – tinklelis; p* – detalių ribos; t* – tikslo ribos; tf / pf – galimi užrašai. */
const FAM = {
  mcm:  { kind: "ilgis", step: 100, pmin: 500, pmax: 2500, tmin: 2000, tmax: 5000,
          tf: [["m"], ["m", "cm"], ["cm"]], pf: [["cm"], ["m"], ["m", "cm"]] },
  dm:   { kind: "ilgis", step: 50, pmin: 350, pmax: 2000, tmin: 1500, tmax: 4000,
          tf: [["m"], ["dm"], ["m", "dm"], ["cm"]], pf: [["dm"], ["cm"], ["m", "dm"], ["dm", "cm"], ["m"]] },
  mm:   { kind: "ilgis", step: 5, pmin: 45, pmax: 220, tmin: 180, tmax: 450,
          tf: [["cm"], ["mm"], ["cm", "mm"], ["dm"], ["dm", "cm"]], pf: [["mm"], ["cm"], ["cm", "mm"], ["dm"]] },
  mase: { kind: "mase", step: 50, pmin: 200, pmax: 1800, tmin: 1200, tmax: 4000,
          tf: [["t"], ["t", "kg"], ["kg"]], pf: [["kg"], ["t"], ["t", "kg"]] },
  mix:  { kind: "ilgis", step: 50, pmin: 450, pmax: 2500, tmin: 2400, tmax: 5000,
          tf: [["m"], ["m", "dm"], ["m", "cm"], ["dm"], ["cm"], ["mm"]],
          pf: [["mm"], ["cm"], ["dm"], ["m"], ["m", "dm"], ["m", "cm"], ["dm", "cm"]] }
};

function grid(fam, lo, hi){ const s = FAM[fam].step; return rnd(Math.ceil(lo / s), Math.floor(hi / s)) * s; }
function fmts(v, list){ return list.filter(f => label(v, f)); }
/* Detalės užrašas: stengiamasi, kad formatas skirtųsi nuo „avoid“ ir nuo jau panaudotų. */
function mkItem(fam, v, avoid, used){
  let c = fmts(v, FAM[fam].pf); if(!c.length) return null;
  let best = c.filter(f => fkey(f) !== avoid && !(used && used[fkey(f)]));
  if(!best.length) best = c.filter(f => fkey(f) !== avoid);
  if(!best.length) best = c;
  const f = pick(best); if(used) used[fkey(f)] = 1;
  return { v, f: fkey(f), label: label(v, f) };
}
function mkTarget(fam, v, want){
  let c = fmts(v, FAM[fam].tf); if(!c.length) return null;
  if(want){ const w = c.filter(f => fkey(f) === want); if(w.length) c = w; }
  const f = pick(c); return { v, f: fkey(f), label: label(v, f) };
}
/* Kiek poaibių (pagal indeksus) duoda sumą s. */
function countSubsets(vals, s){
  let n = 0; const N = vals.length;
  for(let m = 1; m < (1 << N); m++){ let t = 0; for(let i = 0; i < N; i++) if(m >> i & 1) t += vals[i]; if(t === s) n++; }
  return n;
}
function canReach(vals, s){ if(s === 0) return true; return countSubsets(vals, s) > 0; }
/* Dviem tikslams: kiek būdų priskirti detales (0 – nenaudoti, 1 – pirmam, 2 – antram). */
function countTwo(vals, a, b){
  let n = 0; const N = vals.length, tot = Math.pow(3, N);
  for(let m = 0; m < tot; m++){ let x = m, sa = 0, sb = 0; for(let i = 0; i < N; i++){ const d = x % 3; x = (x - d) / 3; if(d === 1) sa += vals[i]; else if(d === 2) sb += vals[i]; } if(sa === a && sb === b) n++; }
  return n;
}
function canTwo(vals, a, b){ return countTwo(vals, a, b) > 0; }

function distinctParts(fam, k, lo, hi, allowEqual){
  const out = [];
  for(let g = 0; g < 60 && out.length < k; g++){ const v = grid(fam, lo, hi); if(allowEqual || !out.includes(v)) out.push(v); }
  return out.length === k ? out : null;
}
/* Klaidinančios detalės: artimos teisingoms (per vieną–tris tinklelio žingsnius) arba atsitiktinės. */
function distractors(fam, parts, n, lo, hi, forbid){
  const F = FAM[fam], out = [];
  for(let g = 0; g < 200 && out.length < n; g++){
    let v = Math.random() < 0.6 ? pick(parts) + pick([-3, -2, -1, 1, 2, 3]) * F.step : grid(fam, lo, hi);
    if(v < lo * 0.8 || v > hi * 1.15 || parts.includes(v) || out.includes(v) || (forbid && forbid.includes(v))) continue;
    if(!fmts(v, F.pf).length) continue;
    out.push(v);
  }
  return out.length === n ? out : null;
}

/* ---- užduočių rūšys ---- */
/* Sumos užduotis: iš sandėlio detalių reikia sudėti lygiai tikslą. o: { k, d, pre, shape, ref } */
function genSum(fam, o){
  const F = FAM[fam];
  for(let g = 0; g < 400; g++){
    const k = o.k, pre = o.pre || 0, all = k + pre;
    const tv = grid(fam, F.tmin, F.tmax);
    const lo = Math.max(F.pmin, Math.ceil(tv / 7 / F.step) * F.step), hi = Math.min(F.pmax, tv - lo * (all - 1));
    if(hi < lo) continue;
    const vs = distinctParts(fam, all - 1, lo, hi, true); if(!vs) continue;
    const last = tv - vs.reduce((a, b) => a + b, 0);
    if(last < lo || last > F.pmax) continue; vs.push(last);
    const sv = shuffle(vs), preV = sv.slice(0, pre), parts = sv.slice(pre);
    if(preV.some(v => v < tv / 4.4)) continue; /* jau padėtos detalės turi būti pakankamai didelės užrašui */
    if(new Set(parts).size !== parts.length && o.shape === "dvi") continue;
    const T = mkTarget(fam, tv, o.tf); if(!T) continue;
    const dv = distractors(fam, parts, o.d, lo, Math.min(F.pmax, tv), null); if(!dv) continue;
    const used = {}; let bad = false;
    const items = parts.concat(dv).map(v => { const it = mkItem(fam, v, T.f, used); if(!it) bad = true; return it; });
    if(bad) continue;
    const preI = preV.map(v => mkItem(fam, v, T.f, {})); if(preI.some(x => !x)) continue;
    const need = tv - preV.reduce((a, b) => a + b, 0);
    if(countSubsets(items.map(i => i.v), need) !== 1) continue;
    /* bent viena reikalinga detalė turi būti užrašyta kitais vienetais nei tikslas */
    if(!items.slice(0, k).some(i => i.f !== T.f)) continue;
    const order = shuffle(items.map((_, i) => i));
    const beams = order.map(i => items[i]);
    const sol = order.map((i, j) => i < k ? j : -1).filter(j => j >= 0);
    const st = { shape: o.shape, fam, kind: F.kind, target: T, pre: preI, beams, sol, need };
    if(o.ref){ /* „antra eilė“: tikslas neparašomas – jį reikia susidėti iš apatinės eilės sijų */
      const r = splitRef(fam, tv, T.f); if(!r) continue; st.ref = r;
    }
    return st;
  }
  return null;
}
function splitRef(fam, tv, avoid){
  const F = FAM[fam];
  for(let g = 0; g < 80; g++){
    const a = grid(fam, Math.max(F.pmin, tv * 0.3), Math.min(F.pmax, tv * 0.7)), b = tv - a;
    if(b < F.pmin || b > F.pmax || a === b) continue;
    const used = {}, A = mkItem(fam, a, null, used), B = mkItem(fam, b, null, used);
    if(A && B && A.f !== B.f) return [A, B];
  }
  return null;
}
/* Du tikslai iš to paties sandėlio. */
function genTwo(fam, o){
  const F = FAM[fam];
  for(let g = 0; g < 600; g++){
    const mk = k => { const tv = grid(fam, F.tmin * 0.7, F.tmax * 0.75); const lo = Math.max(F.pmin, Math.ceil(tv / 5 / F.step) * F.step);
      if(k === 1) return { tv, vs: [tv] };
      const vs = distinctParts(fam, k - 1, lo, Math.min(F.pmax, tv - lo * (k - 1)), false); if(!vs) return null;
      const last = tv - vs.reduce((a, b) => a + b, 0); if(last < lo || last > F.pmax || vs.includes(last)) return null; vs.push(last); return { tv, vs }; };
    const A = mk(o.k1), B = mk(o.k2); if(!A || !B || A.tv === B.tv) continue;
    const parts = A.vs.concat(B.vs); if(new Set(parts).size !== parts.length) continue;
    if(parts.some(v => v > F.pmax || !fmts(v, F.pf).length)) continue;
    const TA = mkTarget(fam, A.tv), TB = mkTarget(fam, B.tv, null); if(!TA || !TB) continue;
    if(TA.f === TB.f && FAM[fam].tf.length > 2){ continue; }
    const dv = distractors(fam, parts, o.d, Math.min.apply(null, parts) * 0.9, Math.max.apply(null, parts), parts); if(!dv) continue;
    const used = {}; const items = parts.concat(dv).map((v, i) => mkItem(fam, v, i < A.vs.length ? TA.f : i < parts.length ? TB.f : null, used));
    if(items.some(x => !x)) continue;
    if(countTwo(items.map(i => i.v), A.tv, B.tv) !== 1) continue;
    const order = shuffle(items.map((_, i) => i)), beams = order.map(i => items[i]);
    const solA = order.map((i, j) => i < A.vs.length ? j : -1).filter(j => j >= 0);
    const solB = order.map((i, j) => i >= A.vs.length && i < parts.length ? j : -1).filter(j => j >= 0);
    return { shape: o.shape, fam, kind: F.kind, targets: [TA, TB], beams, sols: [solA, solB] };
  }
  return null;
}
/* Rikiavimas: nuo didžiausio iki mažiausio; reikšmės artimos, užrašai skirtingi. */
function genOrder(fam, o){
  const F = FAM[fam];
  for(let g = 0; g < 400; g++){
    const c = grid(fam, F.pmin * 2, F.pmax * 0.85), vs = [];
    for(let q = 0; q < 80 && vs.length < o.n; q++){ const v = grid(fam, Math.max(F.pmin, c * 0.45), Math.min(F.pmax, c * 1.3)); if(!vs.includes(v) && fmts(v, F.pf).length) vs.push(v); }
    if(vs.length < o.n) continue;
    const used = {}, items = vs.map(v => mkItem(fam, v, null, used));
    if(items.some(x => !x) || new Set(items.map(i => i.f)).size < Math.min(3, F.pf.length)) continue;
    const beams = shuffle(items);
    const order = beams.map((_, i) => i).sort((a, b) => beams[b].v - beams[a].v);
    /* kad nepakaktų žiūrėti vien į skaičių: didžiausias skaitmuo užraše neturi priklausyti didžiausiai detalei */
    const num = it => parseInt(it.label, 10);
    if(num(beams[order[0]]) === Math.max.apply(null, beams.map(num)) && Math.random() < 0.8) continue;
    return { shape: o.shape, fam, kind: F.kind, beams, order };
  }
  return null;
}
/* Svarstyklės: kairėje lėkštėje – dvi dėžės, dešinę reikia išlyginti. */
function genBalance(fam, o){ return genSum(fam, { k: o.k, d: o.d, shape: "svarstykles", ref: true }); }

/* ---- lygiai: kiekviename raunde užduočių rūšys skirtingos ---- */
const LEVELS = [
  { id: "s1", fam: "mcm", stages: [ ["tarpas", { k: 2, d: 2 }], ["trukstama", { k: 1, d: 3, pre: 1 }], ["kolona", { k: 2, d: 2 }], ["antra", { k: 2, d: 2, ref: true }], ["stogas", { n: 4 }] ], first: 1 },
  { id: "s2", fam: "dm", stages: [ ["tarpas", { k: 3, d: 2 }], ["trukstama", { k: 1, d: 4, pre: 2 }], ["kolona", { k: 3, d: 2 }], ["dvi", { k1: 2, k2: 1, d: 1 }], ["stogas", { n: 5 }] ] },
  { id: "s3", fam: "mm", stages: [ ["tarpas", { k: 3, d: 2 }], ["trukstama", { k: 2, d: 3, pre: 1 }], ["antra", { k: 2, d: 3, ref: true }], ["dvi", { k1: 2, k2: 2, d: 1 }], ["stogas", { n: 5 }] ] },
  { id: "s4", fam: "mase", stages: [ ["krova", { k: 3, d: 2 }], ["trukstama", { k: 2, d: 3, pre: 1 }], ["priekaba", { k1: 2, k2: 2, d: 1 }], ["svarstykles", { k: 2, d: 3 }], ["rikiavimas", { n: 5 }] ] },
  { id: "s5", fam: "mix", stages: [ ["tarpas", { k: 4, d: 2 }], ["antra", { k: 3, d: 3, ref: true }], ["kolona", { k: 3, d: 3 }], ["dvi", { k1: 2, k2: 2, d: 2 }], ["stogas", { n: 5 }] ] },
  { id: "s6", fam: "mix", stages: [ ["tarpas", { k: 4, d: 3 }], ["trukstama", { k: 2, d: 4, pre: 2 }], ["antra", { k: 3, d: 3, ref: true, fam: "dm" }], ["kolona", { k: 3, d: 3, fam: "mm" }], ["dvi", { k1: 3, k2: 2, d: 1 }], ["stogas", { n: 6 }] ] }
];
function genStage(fam, shape, o){
  fam = o.fam || fam;
  const oo = Object.assign({}, o, { shape });
  if(shape === "dvi" || shape === "priekaba") return genTwo(fam, oo);
  if(shape === "stogas" || shape === "rikiavimas") return genOrder(fam, oo);
  if(shape === "svarstykles") return genBalance(fam, oo);
  return genSum(fam, oo);
}
function sig(st){
  const t = st.targets ? st.targets.map(x => x.f).sort().join("+") : st.target ? st.target.f : "-";
  const idx = st.sols ? st.sols[0].concat(st.sols[1]) : st.sol || st.order;
  return st.shape + "|" + st.fam + "|" + t + "|" + idx.map(i => st.beams[i].f).sort().join(",");
}
function round(li){
  const L = LEVELS[li];
  for(let g = 0; g < 50; g++){
    let list = L.stages.slice(0, -1); const lastS = L.stages[L.stages.length - 1];
    list = L.first ? [list[0]].concat(shuffle(list.slice(1))) : shuffle(list);
    list.push(lastS);
    const out = []; let ok = true; const seenT = {};
    for(const [shape, o] of list){
      let st = null;
      for(let q = 0; q < 30 && !st; q++){
        const c = genStage(L.fam, shape, o); if(!c) continue;
        const tk = c.targets ? c.targets.map(x => x.v).join("/") : c.target ? "" + c.target.v : "o" + c.beams.map(b => b.v).join(",");
        if(seenT[tk]) continue; seenT[tk] = 1; st = c;
      }
      if(!st){ ok = false; break; }
      st.sig = sig(st); out.push(st);
    }
    if(ok) return out;
  }
  throw new Error("round " + li);
}
const API = { U, FAM, LEVELS, label, round, genStage, sig, countSubsets, canReach, countTwo, canTwo };
if(typeof module !== "undefined" && module.exports) module.exports = API; else root.MK_KRANAS = API;
})(typeof window !== "undefined" ? window : globalThis);
