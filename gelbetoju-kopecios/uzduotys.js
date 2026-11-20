/* Gelbėtojų kopėčios – iškvietimų (užduočių) generatorius, tikrinimas ir sprendimų sudarymas.
   Tekstų čia nėra – jie faile tekstai.lt.js (window.MK_T).
   Geometrija (metrais): siena ties x = 0, autokopėčių posūkio ašis ties x = −d, 2 m aukštyje.
   Iškvietimo tipas = matavimo būdas (h) × sąlyga (p) × taikinys (t):
     h: 1 – aukštis duotas, 2 – aukštis iš aukštų skaičiaus, 3 – kampamatis ir tolimatis,
        4 – kampamatis ir lazerinis tolimatis (atstumas iki taikinio), 5 – tik kampamatis ir odometras (du matavimai);
     p: 0 – laisva, 1 – viena stovėjimo vieta, 2 – užstrigęs kėlimo kampas, 3 – vėjas (ribotas ilgis),
        4 – užtvara (negalima privažiuoti arčiau), 5 – priestatas ir vėjas;
     t: 0 – langas, 1 – stogas (viršūnė 1 m virš krašto), 2 – balkonas (turėklai išsikišę nuo sienos). */
(function(){
"use strict";
const PIV = 2, AMAX = 75, AMIN = 8, LMAX = 30, LMIN = 8, DMIN = 8, TOL = 0.5, CLEAR = 0.5;
const rad = a => a * Math.PI / 180, deg = r => r * 180 / Math.PI;
const r1 = x => Math.round(x * 10) / 10, r2 = x => Math.round(x * 100) / 100;
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = a.slice(); for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* ---------- leidžiami tipai ---------- */
function valid(h, p, t){
  if(h === 4 && t === 2) return false;
  if(h === 5 && (t === 2 || p === 1)) return false;
  if(h === 4 && t === 0 && p <= 1) return false;          /* akivaizdu: kampas = kampamačio rodmuo, ilgis = lazerio rodmuo */
  return true;
}
const ALL = [];
for(let h = 1; h <= 5; h++) for(let p = 0; p <= 5; p++) for(let t = 0; t <= 2; t++) if(valid(h, p, t)) ALL.push({ h, p, t, id: `${h}${p}${t}` });
const warm = c => (c.h === 3 && c.p <= 1 && c.t === 0);   /* vieno žingsnio: tik apšilimui */

/* rajonai: kokie matavimo būdai ir sąlygos; need – kiek iškvietimų privalo turėti tam tikrą požymį */
const DISTRICTS = [
  { id: "r1", n: 5, h: [1, 2], p: [0, 1, 2], t: [0, 1, 2] },
  { id: "r2", n: 5, h: [1, 2, 4], p: [2, 3, 4], t: [0, 1, 2] },
  { id: "r3", n: 5, h: [3, 4], p: [1, 2, 3, 4], t: [0, 1, 2] },
  { id: "r4", n: 5, h: [1, 3, 4], p: [3, 4, 5], t: [0, 1, 2], need: { key: "p", val: 5, n: 3 } },
  { id: "r5", n: 6, h: [1, 3, 4, 5], p: [0, 2, 3, 4, 5], t: [0, 1, 2], need: { key: "h", val: 5, n: 3 }, noWarm: true }
];
function pool(D){ return ALL.filter(c => D.h.includes(c.h) && D.p.includes(c.p) && D.t.includes(c.t) && !(D.noWarm && warm(c))); }

/* pamaina: tipai (h, p, t) ir poros (h, p) nesikartoja; gretimi iškvietimai skiriasi sąlyga; pirmiausia – dar nematyti tipai */
function round(D, seen){
  seen = seen || {};
  for(let tries = 0; tries < 400; tries++){
    const P = shuffle(pool(D)).sort((a, b) => (seen[a.id] ? 1 : 0) - (seen[b.id] ? 1 : 0) + (Math.random() - 0.5) * 0.8);
    const out = [], pairs = new Set();
    const take = c => { out.push(c); pairs.add(c.h + "" + c.p); };
    const ok = c => !pairs.has(c.h + "" + c.p) && !(warm(c) && out.some(warm));
    if(D.need){ for(const c of P){ if(out.length >= D.need.n) break; if(c[D.need.key] === D.need.val && ok(c)) take(c); } if(out.length < D.need.n) continue; }
    for(const c of P){ if(out.length >= D.n) break; if(ok(c) && !(D.need && c[D.need.key] === D.need.val)) take(c); }
    if(out.length < D.n) continue;
    /* tvarka: gretimi skiriasi sąlyga p; apšilimas – pirmas */
    for(let k = 0; k < 60; k++){
      const o = shuffle(out); o.sort((a, b) => (warm(b) ? 1 : 0) - (warm(a) ? 1 : 0));
      if(o.every((c, i) => i === 0 || c.p !== o[i - 1].p)) return o;
    }
  }
  return shuffle(pool(D)).slice(0, D.n);
}

/* ---------- tikrinimas ---------- */
function tip(d, a, L){ return { x: -d + L * Math.cos(rad(a)), y: PIV + L * Math.sin(rad(a)) }; }
/* kopėčių aukštis virš priestato kampo (−xo; yo) */
function clearance(task, d, a){ return PIV + (d - task.xo) * Math.tan(rad(a)) - task.yo; }
function check(task, d, a, L){
  const tp = tip(d, a, L), dx = tp.x - task.tx, dy = tp.y - task.ty;
  const res = { dx, dy, hit: false, ok: false };
  if(task.p === 5 && tp.x > -task.xo && clearance(task, d, a) < CLEAR - 0.1) res.hit = true;
  res.ok = !res.hit && Math.abs(dx) <= TOL && Math.abs(dy) <= TOL;
  return res;
}
/* ar taip pastatyti iš viso leidžiama (mechaninės ribos) */
function allowed(task, d, a, L){
  if(d < task.dmin - 1e-6 || a > AMAX || a < AMIN || L > task.lmax + 1e-6 || L < LMIN) return false;
  if(task.p === 1 && Math.abs(d - task.bay) > 1e-6) return false;
  if(task.p === 2 && a !== task.jam) return false;
  return true;
}
/* visų tinkamų sprendinių paieška (kampas sveikais laipsniais, atstumas kas 0,1 m) – generatoriui ir testams */
function feasible(task){
  let dLo = Infinity, dHi = -Infinity, n = 0; const angs = new Set();
  for(let a = AMIN; a <= AMAX; a++){
    if(task.p === 2 && a !== task.jam) continue;
    for(let di = Math.round(task.dmin * 10); di <= 450; di++){
      const d = di / 10; if(task.p === 1 && di !== Math.round(task.bay * 10)) continue;
      const reach = d + task.tx; if(reach <= 0) continue;
      const L = r1(reach / Math.cos(rad(a)));
      if(!allowed(task, d, a, L)) continue;
      if(check(task, d, a, L).ok){ n++; angs.add(a); if(d < dLo) dLo = d; if(d > dHi) dHi = d; }
    }
  }
  return { n, dLo, dHi, angs: angs.size };
}

/* ---------- pavyzdinis sprendinys ---------- */
function fromD(task, d){ const reach = d + task.tx, hp = task.ty - PIV; return { d, a: Math.round(deg(Math.atan2(hp, reach))), L: r1(Math.hypot(hp, reach)) }; }
function fromA(task, a){ const hp = task.ty - PIV; return { d: r1(hp / Math.tan(rad(a)) - task.tx), a, L: r1(hp / Math.sin(rad(a))) }; }
function ref(task){
  const hp = task.ty - PIV; let s;
  if(task.p === 1) s = fromD(task, task.bay);
  else if(task.p === 2) s = fromA(task, task.jam);
  else if(task.p === 4) s = fromD(task, task.dmin);
  else if(task.p === 5) s = fromD(task, r1((task.dlo + task.dhi) / 2));
  else if(task.p === 3){ let a = Math.ceil(deg(Math.asin(Math.min(1, hp / task.lmax)))) + 1; s = fromA(task, a); }
  else { let a = 70; while(a > 20 && (fromA(task, a).d < task.dmin + 0.2 || fromA(task, a).L > task.lmax)) a--; s = fromA(task, a); }
  return s;
}

/* ---------- generavimas ---------- */
function gen(c, opts){
  opts = opts || {};
  for(let tries = 0; tries < 3000; tries++){
    const task = { h: c.h, p: c.p, t: c.t, id: c.id, lmax: LMAX, dmin: DMIN, clear: !!opts.clear };
    /* matuojamas taškas M (−off; mh) ir taikinys (−off; mh + up) */
    const off = c.t === 2 ? pick([1.2, 1.5, 1.8, 2]) : 0, up = c.t === 1 ? 1 : 0; let mh;
    if(c.h === 2){
      task.fh = pick([2.8, 3, 3.2]);
      if(c.t === 1){ task.floors = rnd(3, 8); mh = task.floors * task.fh; }
      else { task.floor = rnd(3, 9); task.sill = c.t === 2 ? 1 : pick([0.8, 0.9, 1]); mh = (task.floor - 1) * task.fh + task.sill; }
      mh = r1(mh);
    } else mh = r1(rnd(70, 270) / 10);
    if(mh + up > 29 || mh < 7) continue;
    task.off = off; task.up = up; task.mh = mh; task.tx = -off; task.ty = r1(mh + up);
    const hp = task.ty - PIV;
    if(c.p === 1){ const a0 = rnd(40, 72); task.bay = r1(hp / Math.tan(rad(a0)) + off); if(task.bay < DMIN + 0.5 || task.bay > 30) continue; }
    if(c.p === 2){ task.jam = rnd(35, 66); const s = fromA(task, task.jam); if(s.d < DMIN + 0.6 || s.d > 32 || s.L > LMAX - 0.5 || s.L < LMIN + 1) continue; }
    if(c.p === 3){ const a0 = rnd(50, 70); task.lmax = Math.round(hp / Math.sin(rad(a0)) * 2) / 2; if(task.lmax > 28 || task.lmax < 10) continue; }
    if(c.p === 4){ const L0 = rnd(240, 285) / 10; if(L0 <= hp + 1) continue; task.dmin = r1(Math.sqrt(L0 * L0 - hp * hp) + off); if(task.dmin < DMIN + 2) continue; }
    if(c.p === 5){
      task.xo = rnd(5, 8); const dlo = task.xo + DMIN + rnd(10, 50) / 10;
      task.yo = r1(PIV - CLEAR + hp * (dlo - task.xo) / (dlo - off)); if(task.yo < 4 || task.yo > task.ty - 2.5) continue;
      task.dmin = task.xo + DMIN;
      const cc = task.yo + CLEAR - PIV; task.dlo = (hp * task.xo - cc * off) / (hp - cc);
      const L0 = Math.hypot(hp, task.dlo - off) + rnd(8, 22) / 10; task.lmax = Math.round(L0 * 2) / 2; if(task.lmax > 29) continue;
      task.dhi = Math.sqrt(task.lmax * task.lmax - hp * hp) + off;
      if(task.dhi - task.dlo < 1.4) continue;
    }
    const f = feasible(task); if(!f.n) continue;
    const w = f.dHi - f.dLo;
    if(c.p === 3 && (w < 1.2 || w > 5 || f.dHi > 30)) continue;
    if(c.p === 4 && (w < 1.2 || w > 5)) continue;
    if(c.p === 5 && (w < 1.2 || w > 4.5 || f.dLo < task.dmin + 0.8)) continue;
    if(c.p === 2 && w < 0.35) continue;
    const s = ref(task); if(!allowed(task, s.d, s.a, s.L) || !check(task, s.d, s.a, s.L).ok) continue;
    task.ref = s; task.feas = f;
    /* pradinė automobilio vieta (nuo jos skaičiuoja odometras) */
    task.start = -Math.max(58, Math.ceil(f.dHi) + 26);
    return task;
  }
  throw new Error("gen " + c.id);
}

/* ---------- prietaisų rodmenys ---------- */
function instruments(task, d){
  const reach = d - task.off, hm = task.mh - PIV;
  return { d: r1(d), beta: r2(deg(Math.atan2(hm, reach))), r: r1(Math.hypot(hm, reach)),
    has: { tol: task.h <= 3, kamp: task.h >= 3, laz: task.h === 4 } };
}

/* ---------- sprendimo eilutės (tekstai – T.s) ---------- */
function solution(task, T, live){
  const S = T.s, n = T.num, out = [], hp = task.ty - PIV, hm = task.mh - PIV, s = task.ref;
  const I = instruments(task, live.d); let reachNow = null;
  if(task.h === 1) out.push(S.h1(task.t, n(task.mh), n(hm)));
  if(task.h === 2) out.push(task.t === 1 ? S.h2roof(task.floors, n(task.fh), n(task.mh), n(hm)) : S.h2(task.floor, n(task.fh), n(task.sill), n(task.mh), n(hm)));
  if(task.h === 3){ const reach = I.d - task.off, v = reach * Math.tan(rad(I.beta)); out.push(S.h3(n(I.d), task.off ? n(task.off) : null, n(r1(reach)), n(I.beta), n(r1(v)))); }
  if(task.h === 4){ const v = I.r * Math.sin(rad(I.beta)); reachNow = I.r * Math.cos(rad(I.beta)); out.push(S.h4(n(I.r), n(I.beta), n(r1(v)), n(r1(reachNow)))); }
  if(task.h === 5){
    const I2 = instruments(task, live.d + 10), t1 = Math.tan(rad(I.beta)), t2 = Math.tan(rad(I2.beta)), v = 10 / (1 / t2 - 1 / t1); reachNow = v / t1;
    out.push(S.h5(n(I.beta), n(I2.beta), n(Math.round(1000 / t2) / 1000), n(Math.round(1000 / t1) / 1000), n(r1(v)), n(r1(reachNow))));
  }
  if(task.up) out.push(S.up(n(r1(hm)), n(r1(hp))));
  const reach = r1(s.d - task.off);
  if(task.p === 0) out.push(S.p0(s.a, n(r1(hp)), n(reach), n(s.L)));
  if(task.p === 1) out.push(S.p1(n(task.bay), task.off ? n(task.off) : null, n(reach), n(r1(hp)), n(r2(hp / reach)), s.a, n(s.L)));
  if(task.p === 2) out.push(S.p2(task.jam, n(r1(hp)), n(reach), n(s.L)));
  if(task.p === 3) out.push(S.p3(n(task.lmax), n(r1(hp)), n(r2(hp / task.lmax)), Math.ceil(deg(Math.asin(hp / task.lmax))), s.a, n(reach), n(s.L)));
  if(task.p === 4) out.push(S.p4(n(task.dmin), task.off ? n(task.off) : null, n(reach), n(r1(hp)), n(s.L), s.a));
  if(task.p === 5) out.push(S.p5(n(task.xo), n(task.yo), n(r1(task.yo + CLEAR - PIV)), n(r1(hp)), n(r1(Math.ceil(task.dlo * 10) / 10)), n(task.lmax), n(r1(Math.floor(task.dhi * 10) / 10)), n(s.d), n(reach), s.a, n(s.L)));
  if(task.h <= 3) out.push(S.finalD(n(s.d), s.a, n(s.L)));
  else { const mv = r1(reach - reachNow); out.push(S.finalMove(n(reach), n(r1(reachNow)), n(Math.abs(mv)), mv < 0 ? 1 : mv > 0 ? -1 : 0, s.a, n(s.L))); }
  return out;
}

window.MK_GK = { PIV, AMAX, AMIN, LMAX, LMIN, DMIN, TOL, CLEAR, ALL, DISTRICTS, pool, round, gen, check, allowed, feasible, ref, tip, clearance, instruments, solution, warm, rad, deg, r1 };
})();
