/* Kambarių tikrintuvas: naudoja tą pačią logiką kaip žaidimas (slepynes-logika.js). */
const L = require('' + __dirname + '/../../seseliu-dirbtuve/slepynes-logika.js');
/* tinklelio taškai – kas 0,25, sutampa su langelių centrais (kad vieno langelio pločio tarpai būtų praeinami) */
const G = 0.25, NX = 37, NZ = 61, N = NX * NZ, PAD = 0.08, gx = i => -L.RW + i * G, gz = j => -L.RL + j * G, HT = G / L.SPEED / 2;
const cellOf = p => Math.round((p[1] + L.RL) / G) * NX + Math.round((p[0] + L.RW) / G), X = c => gx(c % NX), Z = c => gz((c / NX) | 0);
/* atsargus apšvietimo vertinimas: taškas laikomas apšviestu, jei apšviestas bent vienas iš 4 taškų aplink jį (±0,1) – kelias laikosi šešėlio vidury, ne ant krašto */
const MG = 0.1, litC = (obs, lamps, on, x, z, t) => L.lit(obs, lamps, on, x - MG, z - MG, t) || L.lit(obs, lamps, on, x + MG, z - MG, t) || L.lit(obs, lamps, on, x - MG, z + MG, t) || L.lit(obs, lamps, on, x + MG, z + MG, t);
const NB = [[1, 0, 2], [-1, 0, 2], [0, 1, 2], [0, -1, 2], [1, 1, 3], [1, -1, 3], [-1, 1, 3], [-1, -1, 3]];
const isDyn = P => P.lamps.some(l => l.rot || l.sw || l.hv) || !!P.cat;
const lim = L.RW - L.MR - PAD - 0.001, limZ = L.RL - L.MR - PAD - 0.001;
function freeMap(P, obs){ const f = new Uint8Array(N); for(let c = 0; c < N; c++){ const x = X(c), z = Z(c); f[c] = Math.abs(x) > L.RW - L.MR || Math.abs(z) > L.RL - L.MR || L.solid(obs, P.lamps, Math.max(-lim, Math.min(lim, x)), Math.max(-limZ, Math.min(limZ, z)), L.MR + PAD) ? 0 : 1; } return f; }
function fields(P, w, o){ const obs = L.obstacles(P, w), free = freeMap(P, obs), lit = new Uint8Array(N), lobs = o.noShadow ? [] : obs; if(!o.noLight) for(let c = 0; c < N; c++) lit[c] = free[c] && litC(lobs, P.lamps, w.on, X(c), Z(c), 0) ? 1 : 0; return { obs, free, lit }; }
/* mažiausia pastebėjimo juostos reikšmė kiekviename langelyje (vienetas 0,025; šviesoje +2, tamsoje −3 per pustaktį) */
function reach(F, seeds, LIM){ const m = new Int16Array(N).fill(32000), par = new Int32Array(N).fill(-1), q = []; for(const s of seeds) if(F.free[s.c] && s.m < m[s.c]){ m[s.c] = s.m; q.push(s.c); }
  for(let h = 0; h < q.length; h++){ const c = q[h], i = c % NX, j = (c / NX) | 0, mc = m[c];
    for(const [di, dj, k] of NB){ const ni = i + di, nj = j + dj; if(ni < 0 || nj < 0 || ni >= NX || nj >= NZ) continue; const n = nj * NX + ni; if(!F.free[n]) continue; if(k === 3 && (!F.free[j * NX + ni] || !F.free[nj * NX + i])) continue;
      const nm = F.lit[n] ? mc + 2 * k : Math.max(0, mc - 3 * k); if(nm >= LIM || nm >= m[n]) continue; m[n] = nm; par[n] = c; q.push(n); } }
  return { m, par }; }
const goalOf = (R, LIM) => { let g = -1; for(let c = 0; c < N; c++) if(R.m[c] < LIM && L.atDoor(X(c), Z(c)) && (g < 0 || R.m[c] < R.m[g])) g = c; return g; };
/* tikslus kelias su laukimais: paieška per (langelis, juosta) – tik planui atkurti */
function pathBFS(F, c0, m0, target, LIM){ const par = new Int32Array(N * LIM).fill(-2), q = [c0 * LIM + m0]; par[q[0]] = -1; let end = -1;
  for(let h = 0; h < q.length && end < 0; h++){ const s = q[h], c = (s / LIM) | 0, m = s % LIM, i = c % NX, j = (c / NX) | 0; if(target(c)){ end = s; break; }
    const go = (n, k) => { const nm = F.lit[n] ? m + 2 * k : Math.max(0, m - 3 * k); if(nm >= LIM) return; const t = n * LIM + nm; if(par[t] !== -2) return; par[t] = s; q.push(t); };
    go(c, 2); for(const [di, dj, k] of NB){ const ni = i + di, nj = j + dj; if(ni < 0 || nj < 0 || ni >= NX || nj >= NZ) continue; const n = nj * NX + ni; if(!F.free[n]) continue; if(k === 3 && (!F.free[j * NX + ni] || !F.free[nj * NX + i])) continue; go(n, k); } }
  if(end < 0) return null; const p = []; for(let s = end; s >= 0; s = par[s]) p.push([X((s / LIM) | 0), Z((s / LIM) | 0)]); return p.reverse(); }
/* statinis kambarys: paieška per kambario būsenas (veiksmus); grąžina mažiausią veiksmų skaičių ir planą */
function solveStatic(lv, o = {}){
  const P = L.parse(lv), LIM = o.LIM || 26, maxD = o.maxDepth === undefined ? 8 : o.maxDepth, maxS = o.maxStates || 3000, seen = new Set(); let queue = [{ w: L.world0(P), seeds: [{ c: cellOf(P.start), m: 0 }], d: 0, prev: null }], count = 0;
  for(let h = 0; h < queue.length; h++){ const nd = queue[h], F = fields(P, nd.w, o), R = reach(F, nd.seeds, LIM); let sig = 0, rest = 0; for(let c = 0; c < N; c++) if(R.m[c] === 0){ sig = (sig * 31 + c) >>> 0; rest++; }
    const key = JSON.stringify(nd.w) + '|' + (rest ? sig + ':' + rest : 's' + nd.seeds[0].c + ':' + nd.seeds[0].m); if(seen.has(key)) continue; seen.add(key); if(++count > maxS) return { ok: false, over: true, states: count };
    const g = goalOf(R, LIM); if(g >= 0){ let plan = null; if(o.plan){ const chain = []; for(let k = nd; k; k = k.prev) chain.push(k); chain.reverse(); plan = chain.map((k, i) => { const Fk = fields(P, k.w, o), sd = k.seeds[0], nx = chain[i + 1]; return nx ? { path: pathBFS(Fk, sd.c, sd.m, c => c === nx.via.c, LIM), act: nx.via.a } : { path: pathBFS(Fk, sd.c, sd.m, c => L.atDoor(X(c), Z(c)), LIM), act: null }; }); } return { ok: true, depth: nd.d, states: count, plan }; }
    if(o.noAct || nd.d >= maxD) continue; const acts = new Map();
    for(let c = 0; c < N; c++){ if(R.m[c] >= LIM) continue; const a = L.action(P, nd.w, X(c), Z(c)); if(!a || !a.ok) continue; const gn = a.type !== 'push'; if(gn && F.lit[c]) continue; const k = a.type + a.i + ',' + (a.dc || 0) + ',' + (a.dr || 0), b = acts.get(k); if(!b || R.m[c] < b.m) acts.set(k, { a, c, m: R.m[c] }); }
    for(const v of acts.values()) queue.push({ w: L.apply(P, nd.w, v.a), seeds: [{ c: v.c, m: v.a.type === 'push' ? v.m : 0 }], d: nd.d + 1, prev: nd, via: v }); }
  return { ok: false, states: count };
}
/* judančios lempos ar katinas: paieška laike (be veiksmų). mode: real | noshadow | nolight; grąžina trukmę arba -1; su path – ir kelią kas pustaktį */
function solveDyn(lv, o = {}){
  const P = L.parse(lv), w = L.world0(P), LIM = o.LIM || 26, M = 41, W = 3, K = M * W, obs = L.obstacles(P, w), free = freeMap(P, obs), lobs = o.noShadow ? [] : obs, maxT = o.maxT || 1100, layers = [], lits = [], bans = [];
  let cur = new Uint8Array(N * K); cur[cellOf(o.from || P.start) * K] = 1; const goal = o.goal || L.atDoor, t0 = o.t0 || 0; let end = null, T = -1;
  for(let step = 0; step < maxT && !end; step++){ const t = t0 + (step + 1) * HT, nxt = new Uint8Array(N * K), litM = new Int8Array(N).fill(-1), cat = P.cat ? L.catPos(P.cat, t) : null, ob2 = cat ? L.withCat(lobs, P.cat, t) : lobs; let any = false;
    const isLit = c => { if(litM[c] < 0) litM[c] = !o.noLight && litC(ob2, P.lamps, w.on, X(c), Z(c), t) ? 1 : 0; return litM[c]; }, ban = c => cat && Math.hypot(X(c) - cat[0], Z(c) - cat[1]) < L.CAT_TOUCH + 0.3;
    if(o.path){ layers.push(cur); lits.push(litM); bans.push(cat); }
    for(let c = 0; c < N && !end; c++){ const i = c % NX, j = (c / NX) | 0; for(let k = 0; k < K; k++){ if(!cur[c * K + k]) continue; any = true; const m = (k / W) | 0, wt = k % W; if(ban(c)) continue;
      if(wt > 0){ const nm = isLit(c) ? m + 2 : Math.max(0, m - 3); if(nm < LIM) nxt[(c * M + nm) * W + wt - 1] = 1; continue; }
      { const nm = isLit(c) ? m + 2 : Math.max(0, m - 3); if(nm < LIM) nxt[(c * M + nm) * W] = 1; }
      for(const [di, dj, kk] of NB){ const ni = i + di, nj = j + dj; if(ni < 0 || nj < 0 || ni >= NX || nj >= NZ) continue; const n = nj * NX + ni; if(!free[n] || ban(n)) continue; if(kk === 3 && (!free[j * NX + ni] || !free[nj * NX + i])) continue;
        const nm = isLit(n) ? m + 2 : Math.max(0, m - 3); if(nm >= LIM) continue; nxt[(n * M + nm) * W + kk - 1] = 1; if(goal(X(n), Z(n))){ end = [n, nm, kk - 1]; T = t - t0; break; } } } }
    cur = nxt; if(!any) break; }
  if(!end) return { ok: false, t: -1 }; if(!o.path) return { ok: true, t: T };
  /* kelio atkūrimas atgal per sluoksnius */
  const out = []; let [c, m, wt] = end;
  for(let step = layers.length - 1; step >= 0; step--){ out.push([X(c), Z(c)]); const Ly = layers[step], litM = lits[step], lt = litM[c] === 1, pm = lt ? (m >= 2 ? [m - 2] : []) : (m === 0 ? [0, 1, 2, 3] : [m + 3]); let got = null;
    if(wt + 1 < W) for(const q of pm) if(q < M && Ly[(c * M + q) * W + wt + 1]){ got = [c, q, wt + 1]; break; }
    if(!got && wt === 0) for(const q of pm) if(q < M && Ly[(c * M + q) * W]){ got = [c, q, 0]; break; }
    if(!got){ const i = c % NX, j = (c / NX) | 0; for(const [di, dj, kk] of NB){ if(kk - 1 !== wt) continue; const pi = i - di, pj = j - dj; if(pi < 0 || pj < 0 || pi >= NX || pj >= NZ) continue; const pc = pj * NX + pi; if(kk === 3 && (!free[pj * NX + i] || !free[j * NX + pi])) continue; for(const q of pm) if(q < M && Ly[(pc * M + q) * W]){ got = [pc, q, 0]; break; } if(got) break; } }
    if(!got) throw new Error('nėra pirmtako ' + step); [c, m, wt] = got; }
  out.push([X(c), Z(c)]); return { ok: true, t: T, path: out.reverse() };
}
function map(lv, times, w){ const P = L.parse(lv); w = w || L.world0(P); const obs0 = L.obstacles(P, w);
  const one = t => { const obs = L.withCat(obs0, P.cat, t), rows = []; for(let j = 0; j < NZ; j += 2){ let s = ''; for(let i = 0; i < NX; i++){ const x = gx(i), z = gz(j); let ch = L.solid(obs, [], x, z, 0.01) ? '#' : L.lit(obs, P.lamps, w.on, x, z, t) ? '.' : ' ';
      for(const o of obs) if(Math.abs(o[1] - x) < 0.3 && Math.abs(o[2] - z) < 0.3 && ch === '#') ch = o[6] === 'B' ? 'B' : o[6] === 'S' ? 'S' : o[6] === '=' ? '=' : o[6] === 'cat' ? 'C' : o[6] === 'X' ? 'X' : '#';
      if(P.tubes.some(q => Math.hypot(q[0] - x, q[1] - z) < 0.2)) ch = 'T'; if(Math.hypot(P.start[0] - x, P.start[1] - z) < 0.2) ch = 'M'; for(const l of P.lamps) if(Math.hypot(l.x - x, l.z - z) < 0.2) ch = 'L';
      for(const q of P.ropes) if(Math.hypot(L.cx(q[0]) - x, L.cz(q[1]) - z) < 0.2) ch = 'r'; for(const q of P.cables) if(Math.hypot(L.cx(q[0]) - x, L.cz(q[1]) - z) < 0.2) ch = 'k'; s += ch; } rows.push('|' + s + '|'); } return rows; };
  const ms = (times || [0]).map(one); return ms[0].map((r, k) => ms.map(m => m[k]).join('  ')).join('\n'); }
module.exports = { L, solveStatic, solveDyn, fields, reach, goalOf, map, isDyn, cellOf, X, Z, N, NX, NZ, HT, gx, gz };
