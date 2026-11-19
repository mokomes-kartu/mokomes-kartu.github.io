/* Nusileidimo modulis – užduočių generatoriai (tik skaičiai ir fizika; visi tekstai – tekstai.lt.js).
   Kiekviena struktūra: id, grupė, gen(c) → reikšmių objektas su ans (atsakymas) ir dec (apvalinimo tikslumas).
   c – misijos kontekstas: g (m/s²), m (kg), F (N), u (m/s), M (kg), R (km), live (skrydžio būsena arba null). */
(function(){
"use strict";
const G = 6.67e-11, GE = 9.8;
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const rd = (x, d) => { const k = Math.pow(10, d); return Math.round(x * k + (x >= 0 ? 1e-9 : -1e-9)) / k; };
const mm = c => c.m + 100 * rnd(-2, 2);
const an = c => c.F / c.m - c.g;                       /* stabdymo pagreitis su visa trauka */
const lv = (c, lo, hi, alt) => c.live ? Math.max(lo, Math.min(hi, Math.round(c.live.v))) : alt();
const S = [];
const add = (id, grp, dec, unit, gen, o) => S.push(Object.assign({ id, grp, dec, unit, gen }, o || {}));

/* ---------- N: Niutono dėsniai ir laisvasis kritimas ---------- */
add("N1", "N", 0, "N", c => { const m = mm(c); return { m, ans: m * c.g }; }, { warm: 1 });
add("N2", "N", 2, "m/s²", c => { const m = mm(c); return { m, F: c.F, ans: c.F / m - c.g }; });
add("N3", "N", 0, "N", c => { const m = mm(c), a = pick([1, 1.5, 2, 2.5, 3]); return { m, a, ans: m * (c.g + a) }; });
add("N4", "N", 0, "m", c => { const v = lv(c, 8, 60, () => rnd(3, 12) * 3); return { m: c.m, F: c.F, v, a: an(c), ans: v * v / (2 * an(c)) }; }, { live: 1 });
add("N5", "N", 1, "s", c => { const v = lv(c, 8, 60, () => rnd(3, 12) * 3); return { m: c.m, F: c.F, v, a: an(c), ans: v / an(c) }; }, { live: 1 });
add("N6", "N", 1, "m/s", c => { const v0 = pick([0, 5, 10]), dh = rnd(4, 30) * 10; return { v0, dh, ans: Math.sqrt(v0 * v0 + 2 * c.g * dh) }; });
add("N7", "N", 1, "s", c => { const h = rnd(5, 40) * 10; return { h, ans: Math.sqrt(2 * h / c.g) }; });
add("N8", "N", 0, "N", c => { const m = mm(c), v = pick([10, 15, 20, 30]), h = pick([50, 75, 100, 150, 200]); return { m, v, h, a: v * v / (2 * h), ans: m * (c.g + v * v / (2 * h)) }; });
add("N9", "N", 1, "s", c => { const t1 = rnd(4, 12); return { m: c.m, F: c.F, t1, v: c.g * t1, a: an(c), ans: c.g * t1 / an(c) }; });
add("N10", "N", 1, "m/s", c => { const H = pick([200, 250, 300, 400]), a = an(c), hs = c.g * H / (c.g + a), h1 = Math.max(10, 10 * Math.floor(0.7 * hs / 10)), q1 = 2 * c.g * (H - h1), q = q1 - 2 * a * h1; return { m: c.m, F: c.F, H, h1, a, v1: Math.sqrt(q1), ans: Math.sqrt(q) }; }, { hard: 1 });
add("N11", "N", 2, "m/s²", c => ({ m: c.m, F: c.F, P: c.m * c.g, Fx: Math.sqrt(c.F * c.F - c.m * c.g * c.m * c.g), ans: Math.sqrt(c.F * c.F - c.m * c.g * c.m * c.g) / c.m }), { hard: 1 });
add("N12", "N", 0, "N", c => { const m = mm(c), a = pick([0.2, 0.4, 0.5, 0.6, 0.8]); return { m, a, ans: m * (c.g - a) }; });

/* ---------- S: svoris ir visuotinė trauka ---------- */
add("S1", "S", 1, "N", c => { const ma = rnd(12, 18) * 5, a = pick([1.5, 2, 2.5, 3, 4]); return { ma, a, ans: ma * (c.g + a) }; });
add("S2", "S", 1, "N", c => { const ma = rnd(12, 18) * 5, a = pick([0.3, 0.5, 0.8, 1]); return { ma, a, ans: ma * (c.g - a) }; });
add("S3", "S", 1, "m/s²", c => { const ma = rnd(12, 18) * 5, a0 = pick([1.2, 1.5, 1.8, 2.4, 3]), P = rd(ma * (c.g + a0), 0); return { ma, P, ans: P / ma - c.g }; });
add("S4", "S", 2, "m/s²", c => ({ M: c.M, R: c.R, ans: G * c.M / Math.pow(c.R * 1e3, 2) }));
add("S5", "S", 2, "m/s²", c => { const k = pick([1, 0.5, 2, 0.25, 3]), h = rd(k * c.R, 0), ans = c.g * Math.pow(c.R / (c.R + h), 2); return { R: c.R, h, dec: ans < 0.3 ? 3 : 2, ans }; });
add("S6", "S", 0, "km", c => { const n = pick([4, 9, 16, 2.25]); return { R: c.R, n, gh: c.g / n, ans: c.R * (Math.sqrt(n) - 1) }; }, { hard: 1 });
add("S7", "S", 1, "N", c => { const ma = rnd(12, 18) * 5, PE = rd(ma * GE, 0); return { PE, ma: PE / GE, ans: PE / GE * c.g }; });
add("S8", "S", 2, "kN", c => { const mc = pick([8000, 10000, 12000, 15000]), h = pick([100, 200, 300, 500]); return { M: c.M, R: c.R, mc, h, ans: G * c.M * mc / Math.pow((c.R + h) * 1e3, 2) / 1000 }; });
add("S9", "S", 2, "m/s²", c => { const k = pick([2, 4, 8, 3]), n = pick([2, 3, 0.5]); return { k, n, ans: c.g * k / (n * n) }; });
add("S10", "S", 1, "m", c => { const n = pick([2, 2.5, 3, 4]), v = lv(c, 8, 60, () => pick([10, 20, 30])); return { n, v, a: (n - 1) * c.g, ans: v * v / (2 * (n - 1) * c.g) }; }, { hard: 1, live: 1 });

/* ---------- J: judesio kiekis, jėgos impulsas, reaktyvusis judėjimas ---------- */
add("J2", "J", 1, "m/s", c => { const dt = pick([2, 3, 4, 5, 6, 8]); return { m: c.m, F: c.F, dt, Fa: c.F - c.m * c.g, ans: (c.F - c.m * c.g) * dt / c.m }; });
add("J3", "J", 1, "kN", c => { const m = mm(c), v = pick([2, 3, 4]), dt = pick([0.2, 0.25, 0.4, 0.5]); return { m, v, dt, ans: (m * v / dt + m * c.g) / 1000 }; });
add("J4", "J", 2, "m/s", c => { const Mc = pick([6000, 8000, 10000]), v = pick([20, 30, 40]), dv = pick([2, 3, 4, 5]); return { m: c.m, Mc, v, v1: v - dv, ans: ((Mc + c.m) * v - c.m * (v - dv)) / Mc }; });
add("J5", "J", 2, "m/s", c => { const Mc = pick([6000, 8000, 10000]), v1 = pick([3, 4, 5, 6]), v2 = pick([1, 2]); return { m: c.m, Mc, v1, v2, ans: (c.m * v1 + Mc * v2) / (c.m + Mc) }; });
add("J6", "J", 2, "m/s", c => { const dm = pick([2, 4, 5, 8, 10]); return { m: c.m, dm, u: c.u, ans: dm * c.u / (c.m - dm) }; });
add("J7", "J", 2, "m/s²", c => { const mu = pick([2, 3, 4, 5]); return { m: c.m, mu, u: c.u, F: mu * c.u, ans: mu * c.u / c.m - c.g }; });
add("J8", "J", 1, "kg", c => { const t = pick([10, 20, 30, 40, 60]); return { m: c.m, u: c.u, t, mu: c.m * c.g / c.u, ans: c.m * c.g / c.u * t }; }, { hard: 1 });
add("J9", "J", 1, "s", c => { const m1 = pick([120, 125, 140, 150, 160]), m2 = pick([2, 3, 4, 5]), v2 = pick([6, 8, 10, 12]), d = pick([5, 10, 20]); return { m1, m2, v2, d, v1: m2 * v2 / m1, ans: d / (m2 * v2 / m1) }; });
add("J10", "J", 0, "N", c => { const mp = pick([2, 4, 5, 8]), v1 = pick([5, 6, 8]), v2 = pick([2, 3, 4]), dt = pick([0.02, 0.04, 0.05, 0.1]); return { mp, v1, v2, dt, ans: mp * (v1 + v2) / dt + mp * c.g }; });
add("J11", "J", 2, "kJ", c => { const m1 = pick([400, 500, 600, 800]), m2 = pick([1200, 1500, 1600, 2000]), v1 = pick([3, 4, 6]), v2 = m1 * v1 / m2; return { m1, m2, v1, v2, ans: (m1 * v1 * v1 + m2 * v2 * v2) / 2000 }; }, { hard: 1 });

/* ---------- E: energija, darbas, galia ---------- */
add("E1", "E", 2, "m", c => { const hE = pick([0.4, 0.5, 0.6]); return { hE, ans: hE * GE / c.g }; });
add("E2", "E", 0, "kJ", c => { const m = c.m, h = pick([100, 150, 200, 300]), v0 = pick([0, 10, 20]), v = pick([1, 2, 3]); return { m, h, v0, v, ans: (m * c.g * h + m * v0 * v0 / 2 - m * v * v / 2) / 1000 }; });
add("E3", "E", 1, "W", c => { const mc = pick([40, 50, 60, 80, 120]), h = pick([5, 8, 10, 12, 20]), t = pick([10, 20, 25, 40]), eta = pick([0.5, 0.6, 0.75, 0.8]); return { mc, h, t, eta, Pn: mc * c.g * h / t, ans: mc * c.g * h / (t * eta) }; });
add("E4", "E", 1, "W", c => { const mr = pick([150, 200, 250, 300, 400]), v = pick([0.5, 1, 1.5, 2]), L = pick([10, 5, 4, 2]); return { mr, v, L, ans: mr * c.g * v / L }; });
add("E5", "E", 0, "kN/m", c => { const m = mm(c), v = pick([2, 3, 4]), x = pick([0.2, 0.25, 0.4, 0.5]); return { m, v, x, ans: m * v * v / (x * x) / 1000 }; });
add("E6", "E", 1, "m", c => { const v = pick([2, 3, 4, 5, 6]), mu = pick([0.2, 0.25, 0.4, 0.5]); return { v, mu, ans: v * v / (2 * mu * c.g) }; });
add("E7", "E", 0, "m", c => { const h = pick([10, 20, 30, 40, 50]), mu = pick([0.1, 0.2, 0.25, 0.4, 0.5]); return { h, mu, ans: h / mu }; }, { hard: 1 });
add("E9", "E", 1, "%", c => { const mr = pick([200, 250, 300, 400]), h = pick([20, 40, 50, 80]), An = mr * c.g * h / 1000, W = rd(An / pick([0.4, 0.5, 0.6, 0.7, 0.8]), 0); return { mr, h, W, An, ans: An / W * 100 }; });
add("E10", "E", 1, "kJ", c => { const m = mm(c), v = pick([10, 20, 30, 40]); return { m, p: m * v, ans: m * v * v / 2000 }; });
add("E11", "E", 1, "m", c => { const k = pick([2000, 4000, 5000, 8000]), x = pick([0.1, 0.2, 0.3]), mk = pick([0.5, 1, 2, 4]); return { k, x, mk, E: k * x * x / 2, ans: k * x * x / (2 * mk * c.g) }; });
add("E12", "E", 1, "W", c => { const rate = pick([30, 60, 90, 120, 180]), h = pick([4, 5, 8, 10]); return { rate, h, ans: rate / 60 * c.g * h }; });

/* ---------- K: judėjimas plokštumoje, greičių sudėtis ---------- */
add("K1", "K", 0, "m", c => { const v = pick([5, 10, 15, 20]), h = pick([50, 80, 100, 200]); return { v, h, t: Math.sqrt(2 * h / c.g), ans: v * Math.sqrt(2 * h / c.g) }; });
add("K2", "K", 1, "m/s", c => { const v = pick([5, 10, 15, 20]), h = pick([50, 80, 100, 200]); return { v, h, ans: Math.sqrt(v * v + 2 * c.g * h) }; });
add("K3", "K", 0, "m", c => { const v0 = pick([10, 20, 30, 40]), al = pick([15, 30, 45, 60, 75]); return { v0, al, ans: v0 * v0 * Math.sin(2 * al * Math.PI / 180) / c.g }; });
add("K4", "K", 0, "m", c => { const p = pick([[3, 4], [6, 8], [5, 12], [8, 6], [9, 12]]), t = pick([5, 10, 20]); return { v1: p[0], v2: p[1], t, vv: Math.hypot(p[0], p[1]), ans: t * Math.hypot(p[0], p[1]) }; }, { warm: 1 });
add("K5", "K", 1, "s", c => { const a = pick([1, 2, 4]), d = pick([100, 200, 400, 800]); return { a, d, ans: 2 * Math.sqrt(d / a) }; }, { hard: 1 });
add("K6", "K", 0, "m", c => { const v1 = pick([20, 30, 40]), v2 = pick([2, 4, 5, 10]), t = pick([5, 8, 10, 12]); return { v1, v2, t, ans: (v1 + v2) / 2 * t }; }, { warm: 1 });
add("K7", "K", 1, "m", c => { const v0 = pick([10, 20, 30, 40]); return { v0, vy: v0 / 2, ans: v0 * v0 / (8 * c.g) }; });

/* ---------- M: daugiažingsnės (VBE III dalies tipo) ---------- */
add("M1", "M", 0, "N", c => { const H = pick([200, 300, 400, 500]), h1 = pick([40, 50, 80, 100]); return { m: c.m, H, h1, v1: Math.sqrt(2 * c.g * (H - h1)), a: c.g * (H - h1) / h1, ans: c.m * c.g * H / h1 }; }, { hard: 1 });
add("M2", "M", 1, "kg", c => { const v = lv(c, 8, 60, () => pick([20, 30, 40])); return { m: c.m, F: c.F, u: c.u, v, a: an(c), t: v / an(c), mu: c.F / c.u, ans: c.F / c.u * v / an(c) }; }, { hard: 1, live: 1 });
add("M3", "M", 1, "s", c => { const d = pick([50, 100, 200]), ax = Math.sqrt(c.F * c.F - c.m * c.g * c.m * c.g) / c.m; return { m: c.m, F: c.F, d, ax, ans: Math.sqrt(2 * d / ax) }; }, { hard: 1 });
add("M4", "M", 1, "N", c => { const ma = rnd(12, 18) * 5, v = pick([20, 30, 40]), h = pick([100, 200, 250, 400]); return { ma, v, h, a: v * v / (2 * h), ans: ma * (c.g + v * v / (2 * h)) }; }, { hard: 1 });
add("M5", "M", 1, "J", c => { let mp, v1, h2, Q; do { mp = pick([2, 4, 5]); v1 = pick([6, 8, 10]); h2 = pick([2, 3, 5]); Q = mp * v1 * v1 / 2 - mp * c.g * h2; } while(Q <= 1); return { mp, v1, h2, ans: Q }; }, { hard: 1 });
add("M6", "M", 2, "m", c => { const Hc = pick([20, 40, 50, 80]), mk = pick([1, 2, 4]), k = pick([2000, 4000, 5000, 8000]); return { Hc, mk, k, E: mk * c.g * Hc, ans: Math.sqrt(2 * mk * c.g * Hc / k) }; }, { hard: 1 });
add("M7", "M", 2, "kJ", c => { const Mc = pick([6000, 8000, 10000]), v1 = pick([3, 4, 5, 6]), v2 = pick([1, 2]), vb = (c.m * v1 + Mc * v2) / (c.m + Mc); return { m: c.m, Mc, v1, v2, vb, ans: (c.m * v1 * v1 / 2 + Mc * v2 * v2 / 2 - (c.m + Mc) * vb * vb / 2) / 1000 }; }, { hard: 1 });

const byId = {}; S.forEach(s => byId[s.id] = s);

/* Sugeneruoja užduotį: atsakymas suapvalinamas iki dec skaitmenų po kablelio. */
function make(id, c){
  const s = byId[id], v = s.gen(c); let dec = v.dec != null ? v.dec : s.dec;
  while(dec < 3 && Math.abs(v.ans) * Math.pow(10, dec) < 30) dec++;      /* mažiems atsakymams – daugiau skaitmenų */
  v.g = c.g; v.exact = v.ans; v.ans = rd(v.ans, dec);
  return { id, grp: s.grp, unit: s.unit, dec, v, live: !!(s.live && c.live) };
}
/* Atsakymas tinka, jei sutampa suapvalinimo tikslumu arba skiriasi ne daugiau kaip 1,2 % (skirtingas tarpinis apvalinimas). */
function check(task, x){
  if(!isFinite(x)) return false;
  const e = task.v.exact, tol = Math.max(0.5 * Math.pow(10, -task.dec) * 1.02, Math.abs(e) * 0.012);
  return Math.abs(x - e) <= tol;
}
/* Parenka n skirtingų struktūrų misijai: pools – grupių sąrašas, seen – kiek kartų kuri jau matyta (mažiausiai matytos pirmos).
   opts.live – kiek užduočių turi būti „gyvos“ (skrydžio metu), opts.hard – ar imti tik sunkesnes. */
function choose(pools, n, seen, opts){
  opts = opts || {}; seen = seen || {};
  const sh = a => { a = a.slice(); for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  let cand = S.filter(s => pools.includes(s.grp) && (!opts.hard || !s.warm));
  cand = sh(cand).sort((a, b) => (seen[a.id] || 0) - (seen[b.id] || 0));
  const out = [], used = new Set(), grpCount = {};
  const take = s => { out.push(s.id); used.add(s.id); grpCount[s.grp] = (grpCount[s.grp] || 0) + 1; };
  /* po vieną iš kiekvienos grupės (jei grupių kelios), tada likusios */
  if(pools.length > 1) pools.forEach(g => { const s = cand.find(x => x.grp === g && !used.has(x.id)); if(s && out.length < n) take(s); });
  for(const s of cand){ if(out.length >= n) break; if(!used.has(s.id)) take(s); }
  /* apšilimo užduotis – daugiausia viena ir pirmoje vietoje */
  const warm = out.filter(id => byId[id].warm);
  warm.slice(1).forEach(id => { const rep = cand.find(x => !used.has(x.id) && !x.warm); if(rep){ out[out.indexOf(id)] = rep.id; used.add(rep.id); } });
  out.sort((a, b) => (byId[b].warm ? 1 : 0) - (byId[a].warm ? 1 : 0) || (byId[a].hard ? 1 : 0) - (byId[b].hard ? 1 : 0) || Math.random() - 0.5);
  return out;
}
window.NM_U = { list: S, byId, make, check, choose, rd, G, GE };
})();
