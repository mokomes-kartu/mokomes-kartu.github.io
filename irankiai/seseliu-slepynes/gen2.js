/* Kambarių paieška ant langelių tinklelio: node gen2.js <šablonas> <bandymų> <sėkla> <kiek rodyti> [dėžių] [minGylis] [maxGylis] */
const S = require('./solver.js'), L = S.L, rad = d => d * Math.PI / 180;
let seed = +(process.argv[4] || 1); const R = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }, ri = (a, b) => a + Math.floor(R() * (b - a + 1)), pick = a => a[Math.floor(R() * a.length)];
const SIDE = { x: -4, z: 0, h: 2.8, a: 0, reach: 6, cone: 0.62 }, SWEEP = { x: -4, z: 0, h: 2.8, a: 0, reach: 6, cone: 0.95, sw: [0.4, 0.6] }, END = { x: -3, z: -7, h: 3.2, a: rad(72), reach: 8, cone: 1.0 }, ROT = { x: 0, z: 1, h: 3.4, a: 0, reach: 3.6, cone: 0.7, rot: 0.5 };
const TPL = {
  over: { start: [7, 14], lamps: [{ x: 0, z: 0, h: 3.4, a: 0, reach: 0.01, cone: 1.05 }], n: [7, 10] },
  side: { start: [0, 14], bench: [[0, 7, 1]], lamps: [SIDE], n: [6, 9], zones: [[3, 8, 3, 11]] },
  end: { start: [8, 14], fixed: [['#', 7, 12]], lamps: [END], n: [5, 8] },
  two: { start: [0, 14], bench: [[0, 10, 1], [8, 4, -1]], lamps: [{ x: -4, z: 3, h: 2.8, a: 0, reach: 6, cone: 0.55 }, { x: 4, z: -3, h: 2.8, a: Math.PI, reach: 6, cone: 0.55 }], n: [7, 10], zones: [[3, 8, 8, 12], [0, 5, 2, 6]] },
  over2: { start: [7, 14], lamps: [{ x: -1, z: -3, h: 3.2, a: 0, reach: 0.01, cone: 1.0 }, { x: 1, z: 3, h: 3.2, a: 0, reach: 0.01, cone: 1.0 }], n: [9, 13] },
  sweep: { start: [0, 14], bench: [[0, 7, 1]], lamps: [SWEEP], n: [5, 8] },
  hv: { start: [8, 14], fixed: [['#', 7, 12]], lamps: [Object.assign({}, END, { hv: [1.4, 0.7] })], n: [5, 8] },
  rot: { start: [0, 14], fixed: [['#', 1, 12]], lamps: [ROT], n: [6, 9] },
  rothv: { start: [0, 14], fixed: [['#', 1, 12]], lamps: [ROT, { x: 3, z: -7, h: 3.0, a: rad(110), reach: 7, cone: 0.8, hv: [1.2, 0.8] }], n: [6, 9] }
};
const name = process.argv[2] || 'over', tp = TPL[name], NTRY = +(process.argv[3] || 200), TOP = +(process.argv[5] || 3), NBOX = +(process.argv[6] || 0), DMIN = +(process.argv[7] || 1), DMAX = +(process.argv[8] || 6);
const dyn = tp.lamps.some(l => l.rot || l.sw || l.hv), TS = dyn ? Array.from({ length: 42 }, (_, i) => i * 0.45) : [0];
function make(){ const g = Array.from({ length: 15 }, () => Array(9).fill('.')), ban = new Set(), key = (c, r) => c + ',' + r, B = (c, r) => ban.add(key(c, r));
  g[tp.start[1]][tp.start[0]] = 'M'; for(let dc = -1; dc <= 1; dc++) for(let dr = -1; dr <= 1; dr++) B(tp.start[0] + dc, tp.start[1] + dr); for(const c of [3, 4, 5]) B(c, 0); B(4, 1);
  for(const l of tp.lamps){ const c = Math.round(l.x + 4), r = Math.round(l.z + 7); B(c, r); if(!tp.bench) for(const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) B(c + dc, r + dr); }
  for(const [c0, r0, d] of tp.bench || []) for(let k = 0; k < 3; k++) for(let dr = -1; dr <= 1; dr++){ g[r0 + dr][c0 + k * d] = '='; B(c0 + k * d, r0 + dr); }
  for(const [ch, c, r] of tp.fixed || []){ g[r][c] = ch; B(c, r); }
  const put = ch => { for(let k = 0; k < 60; k++){ const z = tp.zones && R() < 0.8 ? pick(tp.zones) : [0, 8, 1, 13], c = ri(z[0], z[1]), r = ri(z[2], z[3]); if(ban.has(key(c, r)) || g[r][c] !== '.') continue; g[r][c] = ch; return [c, r]; } return null; };
  const n = ri(tp.n[0], tp.n[1]); for(let i = 0; i < n; i++) put(R() < 0.3 ? 'O' : '#'); for(let i = 0; i < NBOX; i++){ const p = put('B'); if(!p) return null; }
  return { map: g.map(r => r.join('')), lamps: tp.lamps }; }
const why = {}, no = k => { why[k] = (why[k] || 0) + 1; return null; };
function evalLv(lv){ const P = L.parse(lv), w = L.world0(P), obs = L.obstacles(P, w);
  for(const t of TS) for(const [dx, dz] of [[0, 0], [0.45, 0], [-0.45, 0], [0, -0.45], [0, 0.45]]){ const x = P.start[0] + dx, z = P.start[1] + dz; if(Math.abs(x) < 4.2 && Math.abs(z) < 7.2 && L.lit(obs, P.lamps, w.on, x, z, t)) return no('start'); }
  if(!dyn){ const st = S.solveStatic(lv, { noAct: true, noLight: true, plan: true }); if(!st.ok) return no('blocked'); if(S.solveStatic(lv, { noAct: true, noShadow: true, LIM: 40 }).ok) return no('noshadow');
    if(NBOX){ if(S.solveStatic(lv, { noAct: true, LIM: 40 }).ok) return no('noPushNeeded'); const r = S.solveStatic(lv, { maxDepth: DMAX, maxStates: 1500 }); if(!r.ok) return no(r.over ? 'over' : 'unsolv'); if(r.depth < DMIN) return no('shallow'); return { d: r.depth, states: r.states, score: r.depth * 10 + Math.min(9, r.states / 50) }; }
    const r = S.solveStatic(lv, { noAct: true, plan: true }); if(!r.ok) return no('t26NO'); const a = st.plan[0].path.length, b = r.plan[0].path.length; return { st: +(a * 2 * S.HT).toFixed(1), t26: +(b * 2 * S.HT).toFixed(1), score: b - a }; }
  const st = S.solveDyn(lv, { noLight: true, LIM: 40 }); if(!st.ok) return no('blocked'); if(S.solveDyn(lv, { noShadow: true, LIM: 40, maxT: 800 }).ok) return no('noshadow');
  const t40 = S.solveDyn(lv, { LIM: 40, maxT: 800 }); if(!t40.ok) return no('t40NO'); if(t40.t < st.t + 1) return no('easy'); const t26 = S.solveDyn(lv, { maxT: 800 }); if(!t26.ok) return no('t26NO');
  return { st: +st.t.toFixed(1), t40: +t40.t.toFixed(1), t26: +t26.t.toFixed(1), score: (t40.t - st.t) + 0.3 * (t26.t - st.t) }; }
function tubes(lv, want){ const P = L.parse(lv), w = L.world0(P), obs = L.obstacles(P, w), cand = []; let rest = null; if(!dyn){ const F = S.fields(P, w, {}), Rr = S.reach(F, [{ c: S.cellOf(P.start), m: 0 }], 26); rest = c => Rr.m[c] === 0; }
  for(let r = 0; r < 15; r++) for(let c = 0; c < 9; c++){ if(lv.map[r][c] !== '.' || (r === 0 && c >= 3 && c <= 5)) continue; const x = L.cx(c), z = L.cz(r); if(Math.hypot(x - P.start[0], z - P.start[1]) < 2.2 || L.solid(obs, P.lamps, x, z, 0.45)) continue; if(TS.some(t => L.lit(obs, P.lamps, w.on, x, z, t))) continue; if(rest && !rest(S.cellOf([x, z]))) continue; cand.push([c, r]); }
  const out = []; for(const [lo, hi] of [[10, 14], [5, 9], [0, 4]].slice(0, want)){ const cs = cand.filter(p => p[1] >= lo && p[1] <= hi); for(let k = 0; k < 10 && cs.length; k++){ const p = pick(cs); if(out.some(o => Math.hypot(o[0] - p[0], o[1] - p[1]) < 2.5)) continue;
      if(dyn){ const x = L.cx(p[0]), z = L.cz(p[1]); if(!S.solveDyn(lv, { goal: (a, b) => Math.hypot(a - x, b - z) < 0.45, maxT: 800 }).ok || !S.solveDyn(lv, { from: [x, z], maxT: 800 }).ok) continue; } out.push(p); break; } }
  return out; }
const found = []; for(let k = 0; k < NTRY; k++){ const lv = make(); if(!lv) continue; const e = evalLv(lv); if(e) found.push({ lv, e }); }
found.sort((a, b) => b.e.score - a.e.score); const res = [];
const idx = found.length <= TOP ? found.map((_, i) => i) : Array.from({ length: TOP }, (_, i) => Math.round(i * (found.length - 1) / (TOP - 1)));   /* nuo sunkiausio iki lengviausio */
for(const i of idx){ const c = found[i], tb = tubes(c.lv, NBOX ? 2 : 3); if(tb.length < (NBOX ? 1 : 2)){ no('tubes'); continue; } const g = c.lv.map.map(r => r.split('')); for(const [cc, rr] of tb) g[rr][cc] = 'T'; c.lv.map = g.map(r => r.join('')); res.push(c); }
console.log('#', name, 'rasta', found.length, 'iš', NTRY, JSON.stringify(why));
for(const c of res){ console.log(JSON.stringify({ tpl: name, e: c.e, lv: c.lv })); console.log(c.lv.map.join('\n')); console.log(S.map(c.lv, dyn ? [0, 2.2, 4.5, 6.7] : [0])); }
