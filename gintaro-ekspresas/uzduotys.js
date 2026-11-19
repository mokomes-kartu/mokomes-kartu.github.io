/* Gintaro ekspresas – ruožų (dispečerio nurodymų) generatorius.
   Visi mokiniui rodomi tekstai – tekstai.lt.js (window.MK_T); čia tik skaičiai ir struktūros. */
(function(){
"use strict";
const GE = window.GE = {};
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = a.slice(); for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const isInt = x => Math.abs(x - Math.round(x)) < 1e-9;
const isHalf = x => isInt(x * 2);
const nf = GE.nf = x => { let s = (Math.round(x * 100) / 100).toString(); return s.replace(".", ","); };
const clock = GE.clock = m => { m = ((Math.round(m) % 1440) + 1440) % 1440; return Math.floor(m / 60) + ":" + String(m % 60).padStart(2, "0"); };
const fmt = GE.fmt = (s, p) => String(s).replace(/\{(\w+)\}/g, (m, k) => p && p[k] != null ? p[k] : m);

/* Fizika (SI vienetai; žaidimo laikas suspaustas tik rodant). */
const PH = GE.PH = { acc: 0.8, brk: 0.8, mu: { dry: 1, wet: 0.7, leaf: 0.4, frost: 0.5 }, trac: { dry: 1, wet: 1, leaf: 0.3, frost: 0.6 }, vmax: 160 };
GE.brakeDist = (vKmh, cond) => { const v = vKmh / 3.6; return v * v / (2 * PH.brk * PH.mu[cond || "dry"]); };
const r50 = m => Math.round(m / 50) * 50;

/* Visi „patogūs“ trejetai: v (km/h), t (min), s (km). */
const TR = [];
for(let v = 40; v <= 140; v += 5) for(let t = 4; t <= 16; t++){ const s = v * t / 60; if(isHalf(s) && s >= 3 && s <= 30) TR.push({ v, t, s }); }
const trip = f => pick(TR.filter(f));
const timed = x => x.t >= 8 && x.t <= 15 && x.s >= 6 && x.v % 10 === 0;

function leg(ctx, o){
  const L = Object.assign({ mode: "plat", timed: true, cond: [], lim: [], sand: 0, dial: Object.assign({}, ctx.dial), live: false, input: null, graph: null, table: null, mid: null, soft: false }, o);
  L.p = Object.assign({ A: ctx.A, B: ctx.B, C: ctx.C, ka: ctx.ka, kb: nf(ctx.ka + L.s), s: nf(L.s), t: L.T != null ? nf(L.T) : "", v: L.v, dep: clock(ctx.dep), arr: clock(ctx.dep + (L.T || 0)) }, o.p || {});
  return L;
}
/* Greičio skaičiavimo sakinys paaiškinimui. */
function calcV(s, t, v){
  const T = window.MK_T.calc;
  return 60 % t === 0 ? fmt(T.k, { s: nf(s), t, k: 60 / t, v }) : fmt(T.g, { s: nf(s), t, s60: nf(s * 60), v });
}
const calcS = (v, t, s) => fmt(window.MK_T.calc.s, { v, t, vt: v * t, s: nf(s) });
const calcT = (s, v, t) => fmt(window.MK_T.calc.t, { s: nf(s), v, s60: nf(s * 60), t });
function brakeTable(conds, v){
  const T = window.MK_T, vs = [60, 90, 120]; if(vs.indexOf(v) < 0 && v >= 40){ vs.push(v); vs.sort((a, b) => a - b); }
  return `<table class="tb"><tr><th>${T.tb.v}</th>${vs.map(x => `<th>${x}</th>`).join("")}</tr>` +
    conds.map(c => `<tr><td>${T.cond[c]}</td>${vs.map(x => `<td>${r50(GE.brakeDist(x, c))} m</td>`).join("")}</tr>`).join("") + "</table>";
}
function graphOf(pts, o){
  o = o || {}; const all = pts.concat.apply(pts, o.others || []);
  let tM = Math.max.apply(null, all.map(p => p[0])), sM = Math.max.apply(null, all.map(p => p[1]));
  const tStep = tM <= 10 ? 1 : 2, sStep = sM <= 12 ? 2 : sM <= 20 ? 4 : 5;
  return { pts, others: o.others || [], tMax: Math.ceil(tM / tStep) * tStep, sMax: Math.ceil(sM / sStep) * sStep, tStep, sStep, mark: o.mark || null, hideEnd: !!o.hideEnd };
}

GE.graphOf = graphOf;
const G = GE.TYPES = {};
/* ---------- GREITIS: v = s : t ---------- */
G.g1 = c => { const x = trip(timed); return leg(c, { s: x.s, T: x.t, v: x.v, p: { calc: calcV(x.s, x.t, x.v) } }); };
G.g2 = c => { const x = trip(timed); return leg(c, { s: x.s, T: x.t, v: x.v, p: { calc: calcV(x.s, x.t, x.v) } }); };
G.g3 = c => { const x = trip(y => timed(y) && isInt(y.s)); return leg(c, { s: x.s, T: x.t, v: x.v, p: { calc: calcV(x.s, x.t, x.v) } }); };
G.g4 = c => { const x = trip(y => timed(y) && [10, 12, 15].indexOf(y.t) >= 0); return leg(c, { s: x.s, T: x.t, v: x.v, p: { tw: window.MK_T.frac[x.t], calc: calcV(x.s, x.t, x.v) } }); };
G.g5 = c => { const cs = []; TR.filter(timed).forEach(x => [40, 45, 50, 60].forEach(v0 => { const t0 = x.s * 60 / v0; if(v0 <= x.v - 20 && isInt(t0) && t0 <= 30 && isInt(x.s)) cs.push({ x, v0, t0 }); }));
  const q = pick(cs), x = q.x; return leg(c, { s: x.s, T: x.t, v: x.v, hideLen: true, p: { v0: q.v0, t0: q.t0, vt0: q.v0 * q.t0, calc: calcV(x.s, x.t, x.v) } }); };
G.g6 = c => { const cs = []; [30, 36, 40, 45, 60, 72, 90].forEach(sec => { for(let s = 6; s <= 28; s++){ const t = s * sec / 60; if(isInt(t) && t >= 8 && t <= 15) cs.push({ sec, s, t, v: 3600 / sec }); } });
  const q = pick(cs); return leg(c, { s: q.s, T: q.t, v: q.v, p: { sec: q.sec } }); };
G.g7 = c => { const cs = []; [0.75, 1, 1.25, 1.5, 1.75, 2].forEach(k => { for(let s = 6; s <= 28; s++){ const t = s / k; if(isInt(t) && t >= 8 && t <= 15) cs.push({ k, s, t, v: 60 * k }); } });
  const q = pick(cs); return leg(c, { s: q.s, T: q.t, v: q.v, p: { kpm: nf(q.k) } }); };
G.g8 = c => { const cs = []; TR.filter(timed).forEach(x => [2, 1.5].forEach(k => { const v0 = x.v / k, t0 = x.t * k; if(isInt(v0) && v0 % 5 === 0 && v0 >= 30 && isInt(t0) && isInt(x.s)) cs.push({ x, k, v0, t0 }); }));
  const q = pick(cs), x = q.x; return leg(c, { s: x.s, T: x.t, v: x.v, hideLen: true, p: { v0: q.v0, t0: q.t0, k: window.MK_T.times[String(q.k)], calc: calcV(x.s, x.t, x.v) } }); };

/* ---------- KELIAS: s = v · t (stotelė rūke) ---------- */
const fogTr = () => trip(x => [45, 60, 75, 90, 105, 120].indexOf(x.v) >= 0 && x.t >= 6 && x.t <= 14 && isInt(x.s) && x.s >= 6);
const fog = (c, x, p, o) => leg(c, Object.assign({ s: x.s, T: x.t, v: x.v, mode: "fog", soft: true, p: Object.assign({ calc: calcS(x.v, x.t, x.s) }, p || {}) }, o || {}));
G.k1 = c => fog(c, fogTr());
G.k2 = c => fog(c, fogTr());
G.k3 = c => { const q = pick([[15, 10, 9], [20, 5, 6], [20, 10, 12], [25, 4, 6], [25, 6, 9], [25, 8, 12], [25, 10, 15], [25, 12, 18], [30, 5, 9], [30, 10, 18]]);
  return fog(c, { s: q[2], t: q[1], v: q[0] * 3.6 }, { vms: q[0], tsec: q[1] * 60, m: q[0] * q[1] * 60 }); };
G.k4 = c => { const b = pick([[90, 4, 6], [60, 3, 3], [120, 2, 4], [45, 4, 3], [75, 4, 5], [90, 2, 3], [60, 4, 4], [120, 3, 6]]), ms = [2, 3, 4].filter(m => b[1] * m <= 14 && b[2] * m >= 6 && b[2] * m <= 24), m = pick(ms);
  return fog(c, { s: b[2] * m, t: b[1] * m, v: b[0] }, { t1: b[1], s1: b[2], m }); };
G.k5 = c => { const a = TR.filter(x => isInt(x.s) && x.t >= 3 && x.t <= 8 && x.v % 15 === 0), cs = []; a.forEach(x => a.forEach(y => { if(Math.abs(x.v - y.v) >= 30 && x.t + y.t <= 14 && x.s + y.s >= 8 && x.s + y.s <= 24) cs.push([x, y]); }));
  const q = pick(cs), x = q[0], y = q[1]; return leg(c, { s: x.s + y.s, T: x.t + y.t, v: y.v, mode: "fog", soft: true, p: { v1: x.v, t1: x.t, s1: x.s, v2: y.v, t2: y.t, s2: y.s } }); };
G.k6 = c => { const x = fogTr(), cs = TR.filter(y => y.v === x.v && isInt(y.s) && y.t >= 4 && y.t <= 10), r = pick(cs);
  return fog(c, x, { S: x.s + r.s, tr: r.t, sr: r.s, kc: c.ka + x.s + r.s }); };

/* ---------- LAIKAS: t = s : v (atsakymas įvedamas) ---------- */
const inp = (ans, kind, hh) => ({ ans, kind: kind || "min", hh });
G.t1 = c => { const x = trip(timed); return leg(c, { s: x.s, T: x.t, v: x.v, input: inp(x.t), lim: [{ a: 0, b: x.s, v: x.v, quiet: true }], p: { calc: calcT(x.s, x.v, x.t) } }); };
G.t2 = c => { const x = trip(timed), arr = c.dep + x.t; return leg(c, { s: x.s, T: x.t, v: x.v, input: inp(arr % 60, "clock", Math.floor(arr / 60) % 24), lim: [{ a: 0, b: x.s, v: x.v, quiet: true }], p: { calc: calcT(x.s, x.v, x.t), hh: Math.floor(arr / 60) % 24 } }); };
const MS = [[15, 10, 9], [20, 10, 12], [20, 15, 18], [25, 8, 12], [25, 10, 15], [25, 12, 18], [30, 10, 18], [35, 10, 21], [40, 10, 24]];
G.t3 = c => { const q = pick(MS), v = q[0] * 3.6; return leg(c, { s: q[2], T: q[1], v, input: inp(q[1]), lim: [{ a: 0, b: q[2], v, quiet: true }], p: { vms: q[0], v: nf(v), m: q[2] * 1000, sec: q[2] * 1000 / q[0], calc: calcT(q[2], nf(v), q[1]) } }); };
function twoPart(){ const a = TR.filter(x => [40, 45, 50, 60].indexOf(x.v) >= 0 && x.s >= 3 && x.s <= 6 && isInt(x.s)), b = TR.filter(x => x.v >= 80 && x.v % 10 === 0 && x.t >= 4 && x.t <= 10 && isInt(x.s)), cs = [];
  a.forEach(x => b.forEach(y => { if(x.t + y.t <= 16 && x.t + y.t >= 9) cs.push([x, y]); })); return pick(cs); }
G.t4 = c => { const q = twoPart(), x = q[0], y = q[1]; return leg(c, { s: x.s + y.s, T: x.t + y.t, v: y.v, input: inp(x.t + y.t), lim: [{ a: 0, b: x.s, v: x.v }, { a: x.s, b: x.s + y.s, v: y.v, quiet: true }], p: { s1: x.s, v1: x.v, t1: x.t, s2: y.s, v2: y.v, t2: y.t } }); };

/* ---------- GRAFIKAI ---------- */
G.d1 = c => { const x = trip(y => timed(y) && isInt(y.s)); return leg(c, { s: x.s, T: x.t, v: x.v, live: true, hideLen: true, graph: graphOf([[0, 0], [x.t, x.s]]), p: { calc: calcV(x.s, x.t, x.v) } }); };
function twoSeg(){ const a = TR.filter(x => isInt(x.s) && x.t >= 3 && x.t <= 9 && x.v % 10 === 0 && x.v <= 130 && x.s >= 4), cs = [];
  a.forEach(x => a.forEach(y => { if(Math.abs(x.v - y.v) >= 30 && x.t + y.t <= 15 && x.t + y.t >= 9 && x.s + y.s <= 26) cs.push([x, y]); })); return pick(cs); }
function seg2(c, live){ const q = twoSeg(), x = q[0], y = q[1];
  return leg(c, { s: x.s + y.s, T: x.t + y.t, v: y.v, v1: x.v, sw: x.s, live, hideLen: true, graph: graphOf([[0, 0], [x.t, x.s], [x.t + y.t, x.s + y.s]]),
    p: { v1: x.v, t1: x.t, s1: x.s, v2: y.v, t2: y.t, s2: y.s, T2: x.t + y.t, S2: x.s + y.s, ksw: c.ka + x.s, c1: calcV(x.s, x.t, x.v), c2: calcV(y.s, y.t, y.v) } }); }
G.d2 = c => seg2(c, true);
G.d8 = c => seg2(c, false);
G.d3 = c => { const a = TR.filter(x => isInt(x.s) && x.t >= 4 && x.t <= 6 && x.v % 10 === 0 && x.v >= 60 && x.v <= 120 && x.s >= 4), x = pick(a), y = pick(a), w = pick([2, 3]);
  return leg(c, { s: x.s + y.s, T: x.t + w + y.t, v: y.v, v1: x.v, live: true, hideLen: true, mid: { km: x.s, wait: w, t0: x.t }, graph: graphOf([[0, 0], [x.t, x.s], [x.t + w, x.s], [x.t + w + y.t, x.s + y.s]]),
    p: { v1: x.v, t1: x.t, s1: x.s, v2: y.v, t2: y.t, s2: y.s, w, ta: x.t, tb: x.t + w, c1: calcV(x.s, x.t, x.v), c2: calcV(y.s, y.t, y.v) } }); };
G.d4 = c => { const cs = []; TR.filter(timed).forEach(x => [2, 3, 4, 5].forEach(dt => { if(isHalf(x.v * dt / 60) && dt * 3 < x.t) cs.push({ x, dt }); })); const q = pick(cs), x = q.x;
  const rows = [0, 1, 2, 3].map(i => [i * q.dt, x.v * q.dt * i / 60]);
  return leg(c, { s: x.s, T: x.t, v: x.v, table: rows, p: { dt: q.dt, ds: nf(rows[1][1]), calc: calcV(rows[1][1], q.dt, x.v), tT: x.t } }); };
G.d5 = c => { const x = fogTr(), tE = Math.min(20, x.t + rnd(3, 6)); return leg(c, { s: x.s, T: x.t, v: x.v, mode: "fog", soft: true, hideLen: true, graph: graphOf([[0, 0], [tE, x.v * tE / 60]], { mark: null }), p: { calc: calcS(x.v, x.t, x.s) } }); };
G.d6 = c => { const x = trip(y => timed(y) && isInt(y.s)), tE = Math.min(18, x.t + rnd(2, 4)); return leg(c, { s: x.s, T: x.t, v: x.v, input: inp(x.t), graph: graphOf([[0, 0], [tE, x.v * tE / 60]]), p: { calc: calcV(x.s, x.t, x.v) } }); };
G.d7 = c => { const cs = []; TR.filter(y => timed(y) && isInt(y.s)).forEach(x => TR.forEach(y => { if(y.t === x.t && Math.abs(y.v - x.v) >= 30 && isInt(y.s) && y.v >= 40) cs.push([x, y]); }));
  const q = pick(cs), x = q[0], y = q[1], fast = x.v > y.v, tE = x.t;
  return leg(c, { s: x.s, T: x.t, v: x.v, hideLen: true, graph: graphOf([[0, 0], [tE, x.s]], { others: [[[0, 0], [tE, y.s]]] }), p: { which: window.MK_T.which[fast ? 1 : 0], steep: window.MK_T.steep[fast ? 1 : 0], vo: y.v, so: y.s, calc: calcV(x.s, x.t, x.v) } }); };

/* ---------- TRINTIS IR VIENETAI ---------- */
G.f1 = c => { const x = trip(y => timed(y) && y.v >= 80 && y.v <= 120); return leg(c, { s: x.s, T: x.t, v: x.v, cond: [{ a: x.s - 3, b: x.s + 1, c: "leaf" }], p: { tbl: brakeTable(["dry", "leaf"], x.v), bd: r50(GE.brakeDist(x.v, "leaf")), bd0: r50(GE.brakeDist(x.v, "dry")), calc: calcV(x.s, x.t, x.v) } }); };
G.f2 = c => { const x = trip(y => timed(y) && y.v >= 80 && y.v <= 130); return leg(c, { s: x.s, T: x.t, v: x.v, cond: [{ a: -1, b: x.s + 1, c: "wet" }], p: { tbl: brakeTable(["dry", "wet"], x.v), bd: r50(GE.brakeDist(x.v, "wet")), bd0: r50(GE.brakeDist(x.v, "dry")), calc: calcV(x.s, x.t, x.v) } }); };
G.f3 = c => { const x = trip(y => timed(y) && y.v >= 80 && y.v <= 120); return leg(c, { s: x.s, T: x.t, v: x.v, sand: 2.2, cond: [{ a: 1.5, b: x.s + 1, c: "frost" }], p: { tbl: brakeTable(["dry", "frost"], x.v), bd: r50(GE.brakeDist(x.v, "frost")), bd0: r50(GE.brakeDist(x.v, "dry")), calc: calcV(x.s, x.t, x.v) } }); };
G.f4 = c => { const x = trip(y => timed(y) && y.v >= 70 && y.v <= 110); return leg(c, { s: x.s, T: x.t, v: x.v, sand: 1.6, cond: [{ a: -1, b: 2.5, c: "leaf" }], slope: [{ a: 0, b: 2.5, g: 1 }], p: { calc: calcV(x.s, x.t, x.v) } }); };
G.e1 = c => { const q = pick(MS.filter(m => m[0] <= 30)), v = q[0] * 3.6; return leg(c, { s: q[2], T: q[1], v, lim: [{ a: 0, b: q[2], v, ms: q[0] }], p: { vms: q[0], v: nf(v) } }); };
G.e2 = c => { const q = pick(MS.concat([[20, 5, 6], [40, 5, 12]]).filter(m => m[1] >= 8)), v = q[0] * 3.6; return leg(c, { s: q[2], T: q[1], v, dial: { unit: "ms", max: 45, major: 5, minor: 1, digital: false }, p: { vms: q[0], v: nf(v), calc: calcV(q[2], q[1], nf(v)) } }); };
G.e3 = c => { const x = trip(y => timed(y) && y.v % 20 === 10); return leg(c, { s: x.s, T: x.t, v: x.v, dial: { unit: "kmh", max: 160, major: 40, minor: 20, digital: false }, p: { calc: calcV(x.s, x.t, x.v) } }); };

/* ---------- EGZAMINAS: daugiažingsnės ---------- */
G.x1 = c => { const q = twoPart(), x = q[0], y = q[1]; return leg(c, { s: x.s + y.s, T: x.t + y.t, v: y.v, lim: [{ a: 0, b: x.s, v: x.v }], p: { s1: x.s, v1: x.v, t1: x.t, s2: y.s, v2: y.v, t2: y.t, S: nf(x.s + y.s), T: x.t + y.t, calc: calcV(y.s, y.t, y.v) } }); };
G.x2 = c => { const cs = []; TR.filter(x => x.t >= 8 && x.t <= 13 && x.v % 10 === 0 && x.v >= 80 && isInt(x.s)).forEach(x => [2, 3, 4, 5].forEach(d => { const v0 = x.s * 60 / (x.t + d); if(isInt(v0) && v0 % 5 === 0 && v0 >= 50) cs.push({ x, d, v0 }); }));
  const q = pick(cs), x = q.x; return leg(c, { s: x.s, T: x.t, v: x.v, p: { d: q.d, v0: q.v0, t0: x.t + q.d, calc: calcV(x.s, x.t, x.v) } }); };
G.x3 = c => { const cs = []; [60, 75, 90, 105, 120].forEach(v1 => [30, 45, 60].forEach(v2 => { for(let t = 6; t <= 12; t++){ const s = v1 * t / 60, S = (v1 + v2) * t / 60; if(isInt(s) && isInt(S) && s >= 6 && S <= 36) cs.push({ v1, v2, t, s, S }); } }));
  const q = pick(cs); return leg(c, { s: q.s, T: q.t, v: q.v1, mode: "fog", soft: true, meet: { v: q.v2 }, hideLen: true, p: { v1: q.v1, v2: q.v2, S: q.S, vs: q.v1 + q.v2, vm: nf((q.v1 + q.v2) / 60), tm: q.t, calc: calcS(q.v1, q.t, q.s), kc: c.ka + q.S } }); };
G.x4 = c => { const x = trip(y => timed(y) && [40, 45, 50, 60, 72, 75, 80, 90, 100, 120].indexOf(y.v) >= 0); return leg(c, { s: x.s, T: x.t, v: x.v, dial: Object.assign({}, c.dial, { broken: true, digital: false }), p: { sec: 3600 / x.v, calc: calcV(x.s, x.t, x.v) } }); };
G.x6 = c => { const cs = []; [[6, [[40, 9], [45, 8], [60, 6], [90, 4], [120, 3]]], [10, [[40, 15], [50, 12], [60, 10], [75, 8], [100, 6], [120, 5]]], [12, [[45, 16], [60, 12], [80, 9], [90, 8], [120, 6]]]].forEach(h => h[1].forEach(a => h[1].forEach(b => { if(a !== b && a[1] + b[1] <= 18 && a[1] + b[1] >= 10 && Math.abs(a[0] - b[0]) >= 30) cs.push({ h: h[0], a, b }); })));
  const q = pick(cs), T = q.a[1] + q.b[1]; return leg(c, { s: 2 * q.h, T, v: q.b[0], input: inp(T), lim: [{ a: 0, b: q.h, v: q.a[0] }, { a: q.h, b: 2 * q.h, v: q.b[0] }],
    p: { h: q.h, v1: q.a[0], t1: q.a[1], v2: q.b[0], t2: q.b[1], avg: nf((q.a[0] + q.b[0]) / 2), tw: nf(Math.round(2 * q.h / ((q.a[0] + q.b[0]) / 2) * 60 * 10) / 10) } }); };

/* ---------- LINIJOS ---------- */
const D0 = { unit: "kmh", max: 160, major: 20, minor: 10, digital: false };
GE.LINES = [
  { id: "l1", n: 5, pool: ["g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8"], first: "g1", theme: "sea", km0: 12, dep: 8 * 60 + 5, dial: Object.assign({}, D0, { digital: true }), slopes: 0.6 },
  { id: "l2", n: 5, pool: ["k1", "k2", "k3", "k4", "k5", "k6", "t1", "t2", "t3", "t4"], groups: [["k1", "k2", "k3", "k4", "k5", "k6"], ["t1", "t2", "t3", "t4"]], theme: "forest", km0: 40, dep: 9 * 60 + 40, dial: Object.assign({}, D0, { minor: 5 }), slopes: 1 },
  { id: "l3", n: 5, pool: ["d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8"], first: "d1", theme: "lake", km0: 7, dep: 11 * 60 + 15, dial: Object.assign({}, D0, { minor: 5 }), slopes: 1 },
  { id: "l4", n: 5, pool: ["f1", "f2", "f3", "f4", "e1", "e2", "e3"], groups: [["f1", "f2", "f3", "f4"], ["e1", "e2", "e3"]], theme: "hill", km0: 63, dep: 14 * 60 + 30, dial: Object.assign({}, D0), slopes: 1 },
  { id: "l5", n: 6, pool: ["x1", "x2", "x3", "x4", "x6", "d8", "e2", "f3", "k5", "k6", "t4", "d7"], must: ["x1", "x2", "x3", "x4", "x6"], mustN: 4, theme: "eve", km0: 120, dep: 17 * 60 + 50, dial: Object.assign({}, D0), slopes: 1.2 }
];
GE.line = id => GE.LINES.find(l => l.id === id);

/* Reiso sudarymas: tipai raunde nesikartoja; pirmiausia – dar nematyti. */
GE.pickTypes = function(line, seen){
  seen = seen || {};
  const byNew = a => shuffle(a).sort((x, y) => (seen[x] || 0) - (seen[y] || 0));
  let out = [];
  if(line.first) out.push(line.first);
  if(line.groups) line.groups.forEach(g => byNew(g.filter(t => out.indexOf(t) < 0)).slice(0, 2).forEach(t => out.push(t)));
  if(line.must) byNew(line.must).slice(0, line.mustN).forEach(t => out.push(t));
  byNew(line.pool.filter(t => out.indexOf(t) < 0)).forEach(t => { if(out.length < line.n) out.push(t); });
  const head = line.first ? [out[0]] : [];
  return head.concat(shuffle(out.slice(head.length)));
};
GE.buildRun = function(lineId, seen){
  const line = GE.line(lineId), names = window.MK_T.lines[lineId].st, types = GE.pickTypes(line, seen), legs = [];
  let ka = line.km0, dep = line.dep;
  types.forEach((ty, i) => {
    const ctx = { A: names[i], B: names[i + 1], C: names[Math.min(i + 2, names.length - 1)], ka, dep, dial: line.dial, line };
    const L = G[ty](ctx); L.type = ty; L.i = i; L.ka = ka; L.dep = dep; L.A = ctx.A; L.B = ctx.B;
    if(!L.slope) L.slope = [];
    if(line.slopes && !(line.first === ty && !seen[ty]) && !L.dial.broken){
      let x = 1.5 + Math.random() * 2; const end = L.s - 2.2;
      while(x < end){ const len = 1 + Math.random() * 1.6, g = (Math.random() < 0.5 ? -1 : 1) * line.slopes;
        if(x + len < end && !L.slope.some(q => x < q.b + 0.5 && x + len > q.a - 0.5)) L.slope.push({ a: x, b: x + len, g });
        x += len + 1.2 + Math.random() * 3; }
    }
    legs.push(L); ka = Math.ceil(ka + L.s); dep += Math.ceil(L.T || 10) + 3;
  });
  return legs;
};
/* Ruožo vertinimas pagal laiką: loss – įsibėgėjimo ir stabdymo sugaištis (min). */
GE.loss = v => { const m = v / 3.6; return (m / (2 * PH.acc) + m / (2 * PH.brk)) / 60; };
GE.judgeTime = function(L, tArr){
  const d = tArr - L.T, k = Math.max(1, L.T / 10), loss = GE.loss(L.v);
  if(L.soft) return d <= L.T * 0.5 + 2 ? 2 : d <= L.T + 4 ? 1 : 0;
  if(d >= -0.3 * k && d <= loss + 0.4 * k) return 2;
  if(d >= -1.2 * k - 0.2 && d <= loss + 1.5 * k) return 1;
  return 0;
};
})();
