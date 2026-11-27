/* Kambarių tikrintuvas: naudoja tą pačią logiką kaip žaidimas (slepynes-logika.js). */
const L = require('' + __dirname + '/../../seseliu-dirbtuve/slepynes-logika.js');
/* tinklelio taškai – kas 0,25, sutampa su langelių centrais (kad vieno langelio pločio tarpai būtų praeinami) */
const G = 0.25, NX = 37, NZ = 61, N = NX * NZ, PAD = 0.08, gx = i => -L.RW + i * G, gz = j => -L.RL + j * G, HT = G / L.SPEED / 2;
const cellOf = p => Math.round((p[1] + L.RL) / G) * NX + Math.round((p[0] + L.RW) / G), X = c => gx(c % NX), Z = c => gz((c / NX) | 0);
/* atsargus apšvietimo vertinimas: taškas laikomas apšviestu, jei apšviestas bent vienas iš 4 taškų aplink jį (±0,1) – kelias laikosi šešėlio vidury, ne ant krašto */
const MG = 0.1, litC = (obs, lamps, on, x, z, t) => L.lit(obs, lamps, on, x - MG, z - MG, t) || L.lit(obs, lamps, on, x + MG, z - MG, t) || L.lit(obs, lamps, on, x - MG, z + MG, t) || L.lit(obs, lamps, on, x + MG, z + MG, t);
/* palankus vertinimas (o.opt) – tikrinant, ar kambario NEGALIMA įveikti kitaip: apšviesta tik jei apšviesti visi 4 taškai, be atsargos prie kliūčių, visa pastebėjimo juosta */
const litO = (obs, lamps, on, x, z, t) => L.lit(obs, lamps, on, x - MG, z - MG, t) && L.lit(obs, lamps, on, x + MG, z - MG, t) && L.lit(obs, lamps, on, x - MG, z + MG, t) && L.lit(obs, lamps, on, x + MG, z + MG, t);
const NB = [[1, 0, 2], [-1, 0, 2], [0, 1, 2], [0, -1, 2], [1, 1, 3], [1, -1, 3], [-1, 1, 3], [-1, -1, 3]];
const isDyn = P => P.lamps.some(l => l.rot || l.sw || l.hv) || !!P.cat;
/* žybsinti lempa statiniame tikrintuve: per tamsos tarpą galima nueiti toliau, todėl leidžiamas ilgesnis „šuolis“ tarp šešėlių.
   Atsargiai: (tamsos trukmė − 0,2 s reakcijai) × greitis + 1,6; palankiai: visa juosta prieš ir po + visa tamsos trukmė. Vienetai: 16 juostos vienetų vienam ilgio vienetui. */
const blinkLIM = (P, opt) => { const b = P.lamps.filter(l => l.blink); if(!b.length) return opt ? 40 : 26; const off = Math.min(...b.map(l => l.blink[1])); return Math.round(16 * (opt ? 5.1 + off * L.SPEED + 0.5 : (off - 0.2) * L.SPEED + 1.6)); };
const lim = L.RW - L.MR - PAD - 0.001, limZ = L.RL - L.MR - PAD - 0.001;
function freeMap(P, obs, pad){ if(pad === undefined) pad = PAD; const f = new Uint8Array(N); for(let c = 0; c < N; c++){ const x = X(c), z = Z(c); f[c] = Math.abs(x) > L.RW - L.MR || Math.abs(z) > L.RL - L.MR || L.solid(obs, P.lamps, Math.max(-lim, Math.min(lim, x)), Math.max(-limZ, Math.min(limZ, z)), L.MR + pad) ? 0 : 1; } return f; }
/* o.win – laikmačio langas: laikmačio lempos laikomos užgesusiomis */
function fields(P, w, o){ const obs = L.obstacles(P, w), free = freeMap(P, obs, o.opt ? 0.005 : PAD), lit = new Uint8Array(N), lobs = o.noShadow ? [] : obs, lf = o.opt ? litO : litC, w2 = o.win ? Object.assign({}, w, { tmr: P.timers.map(() => 1e9) }) : w, tt = o.win ? 0 : null; if(!o.noLight) for(let c = 0; c < N; c++) lit[c] = free[c] && lf(lobs, P.lamps, L.onAt(P, w2, X(c), Z(c), tt), X(c), Z(c), 0) ? 1 : 0; return { obs, free, lit }; }
/* mažiausia pastebėjimo juostos reikšmė kiekviename langelyje (vienetas 0,025; šviesoje +2, tamsoje −3 per pustaktį) */
function reach(F, seeds, LIM){ const m = new Int16Array(N).fill(32000), par = new Int32Array(N).fill(-1), q = []; for(const s of seeds) if(F.free[s.c] && s.m < m[s.c]){ m[s.c] = s.m; q.push(s.c); }
  for(let h = 0; h < q.length; h++){ const c = q[h], i = c % NX, j = (c / NX) | 0, mc = m[c];
    for(const [di, dj, k] of NB){ const ni = i + di, nj = j + dj; if(ni < 0 || nj < 0 || ni >= NX || nj >= NZ) continue; const n = nj * NX + ni; if(!F.free[n]) continue; if(k === 3 && (!F.free[j * NX + ni] || !F.free[nj * NX + i])) continue;
      const nm = F.lit[n] ? mc + 2 * k : Math.max(0, mc - 3 * k); if(nm >= LIM || nm >= m[n]) continue; m[n] = nm; par[n] = c; q.push(n); } }
  return { m, par }; }
const goalOf = (R, LIM) => { let g = -1; for(let c = 0; c < N; c++) if(R.m[c] < LIM && L.atDoor(X(c), Z(c)) && (g < 0 || R.m[c] < R.m[g])) g = c; return g; };
/* tikslus kelias su laukimais: paieška per (langelis, juosta) nuo vienos ar kelių pradžių – tik planui atkurti. Kelio taškas: [x, z, pustakčių] */
function pathBFS(F, starts, target, LIM){ const par = new Int32Array(N * LIM).fill(-2), q = []; for(const [c0, m0] of starts){ const t = c0 * LIM + m0; if(par[t] === -2){ par[t] = -1; q.push(t); } } let end = -1;
  for(let h = 0; h < q.length && end < 0; h++){ const s = q[h], c = (s / LIM) | 0, m = s % LIM, i = c % NX, j = (c / NX) | 0; if(target(c)){ end = s; break; }
    const go = (n, k) => { const nm = F.lit[n] ? m + 2 * k : Math.max(0, m - 3 * k); if(nm >= LIM) return; const t = n * LIM + nm; if(par[t] !== -2) return; par[t] = s; q.push(t); };
    go(c, 2); for(const [di, dj, k] of NB){ const ni = i + di, nj = j + dj; if(ni < 0 || nj < 0 || ni >= NX || nj >= NZ) continue; const n = nj * NX + ni; if(!F.free[n]) continue; if(k === 3 && (!F.free[j * NX + ni] || !F.free[nj * NX + i])) continue; go(n, k); } }
  if(end < 0) return null; const p = []; for(let s = end; s >= 0; s = par[s]) p.push((s / LIM) | 0); p.reverse(); return p; }
/* pasiekiamumas su laikmačio langu: m[l][c] – mažiausia juosta langelyje c, kai lango (lempa užgesusi) liko l pustakčių; l = 0 – langas baigėsi */
function reachT(Fon, Foff, seeds, LIM, S, wantPar){
  const m = [], par = wantPar ? [] : null; for(let l = 0; l <= S; l++){ m.push(new Int16Array(N).fill(32000)); if(par) par.push(new Int32Array(N).fill(-1)); }
  for(const s of seeds){ const l = Math.min(S, s.left || 0); if(Fon.free[s.c] && s.m < m[l][s.c]) m[l][s.c] = s.m; }
  for(let l = S; l >= 1; l--){ const cur = m[l]; for(let c = 0; c < N; c++){ const mc = cur[c]; if(mc >= LIM) continue; const i = c % NX, j = (c / NX) | 0, put = (n, nl, nm) => { if(nm < LIM && nm < m[nl][n]){ m[nl][n] = nm; if(par) par[nl][n] = l * N + c; } };
      put(c, l - 1, Foff.lit[c] ? mc + 2 : Math.max(0, mc - 3));
      for(const [di, dj, k] of NB){ const ni = i + di, nj = j + dj; if(ni < 0 || nj < 0 || ni >= NX || nj >= NZ) continue; const n = nj * NX + ni; if(!Fon.free[n]) continue; if(k === 3 && (!Fon.free[j * NX + ni] || !Fon.free[nj * NX + i])) continue; const F = l >= k ? Foff : Fon; put(n, Math.max(0, l - k), F.lit[n] ? mc + 2 * k : Math.max(0, mc - 3 * k)); } } }
  const entry = wantPar ? m[0].slice() : null, m0 = m[0], q = []; for(let c = 0; c < N; c++) if(m0[c] < LIM) q.push(c);
  for(let h = 0; h < q.length; h++){ const c = q[h], i = c % NX, j = (c / NX) | 0, mc = m0[c];
    for(const [di, dj, k] of NB){ const ni = i + di, nj = j + dj; if(ni < 0 || nj < 0 || ni >= NX || nj >= NZ) continue; const n = nj * NX + ni; if(!Fon.free[n]) continue; if(k === 3 && (!Fon.free[j * NX + ni] || !Fon.free[nj * NX + i])) continue;
      const nm = Fon.lit[n] ? mc + 2 * k : Math.max(0, mc - 3 * k); if(nm >= LIM || nm >= m0[n]) continue; m0[n] = nm; q.push(n); } }
  return { m, par, entry };
}
/* kelias nuo mazgo pradžios iki tikslo: tl > 0 – langelis tc lange (liko tl), tl = 0 – po lango; grąžina [[x, z, pustakčių], ...] */
function pathNode(Fon, Foff, seeds, LIM, S, isT, tl){
  const out = c => [X(c), Z(c)], R = reachT(Fon, Foff, seeds, LIM, S, true), timed = (l, c) => { const p = []; let cl = l, cc = c; for(;;){ p.push(cc); const q = R.par[cl][cc]; if(q < 0) break; cl = (q / N) | 0; cc = q % N; } return p.reverse(); };
  if(tl > 0){ let c = -1; for(let k = 0; k < N; k++) if(isT(k) && R.m[tl][k] < LIM){ c = k; break; } return c < 0 ? null : timed(tl, c).map(out); }
  const starts = []; for(let c = 0; c < N; c++) if(R.entry[c] < LIM) starts.push([c, R.entry[c]]); const p0 = pathBFS(Fon, starts, isT, LIM); if(!p0) return null; return timed(0, p0[0]).concat(p0.slice(1)).map(out);
}
const INSTANT = { push: 1, switch: 1, timer: 1 }, GNAW_T = Math.round(L.T_GNAW / HT);
/* kambarys be judančių lempų: paieška per kambario būsenas (veiksmus); grąžina mažiausią veiksmų skaičių ir planą.
   o.opt – palankus vertinimas (tikrinant, ar NEĮMANOMA kitaip), o.skip(a) – uždrausti veiksmą, o.noAct – jokių veiksmų, o.plan – grąžinti kelius */
function solveStatic(lv, o = {}){
  const P = L.parse(lv), LIM = o.LIM || blinkLIM(P, o.opt), maxD = o.maxDepth === undefined ? 8 : o.maxDepth, maxS = o.maxStates || 3000, seen = new Set();
  const S = P.timers.length ? (o.opt ? Math.ceil(P.timers[0][3] / HT) + 2 : Math.floor((P.timers[0][3] - 0.4) / HT)) : 0, FF = w => { const Fon = fields(P, w, o); return [Fon, S ? fields(P, w, Object.assign({ win: true }, o)) : Fon]; };
  let queue = [{ w: L.world0(P), seeds: [{ c: cellOf(P.start), m: 0, left: 0 }], d: 0, prev: null }], count = 0;
  for(let h = 0; h < queue.length; h++){ const nd = queue[h], [Fon, Foff] = FF(nd.w), R = reachT(Fon, Foff, nd.seeds, LIM, S), m0 = R.m[0]; let sig = 0, rest = 0; for(let c = 0; c < N; c++) if(m0[c] === 0){ sig = (sig * 31 + c) >>> 0; rest++; }
    const sd = nd.seeds[0], key = JSON.stringify(nd.w) + '|' + (rest ? sig + ':' + rest : 's' + sd.c + ':' + sd.m) + (sd.left ? '|T' + sd.c + ':' + sd.left : ''); if(seen.has(key)) continue; seen.add(key); if(++count > maxS) return { ok: false, over: true, states: count };
    let gl = -1; for(let l = S; l >= 0 && gl < 0; l--) for(let c = 0; c < N; c++) if(R.m[l][c] < LIM && L.atDoor(X(c), Z(c))){ gl = l; break; }
    if(gl >= 0){ let plan = null; if(o.plan){ const chain = []; for(let k = nd; k; k = k.prev) chain.push(k); chain.reverse(); plan = chain.map((k, i) => { const [A, B] = FF(k.w), nx = chain[i + 1]; return nx ? { path: pathNode(A, B, k.seeds, LIM, S, c => c === nx.via.c, nx.via.l), act: nx.via.a } : { path: pathNode(A, B, k.seeds, LIM, S, c => L.atDoor(X(c), Z(c)), gl), act: null }; }); } return { ok: true, depth: nd.d, states: count, plan }; }
    if(o.noAct || nd.d >= maxD) continue; const acts = new Map();
    for(let c = 0; c < N; c++){ if(!Fon.free[c]) continue; let l = -1; for(let k = S; k >= 0; k--) if(R.m[k][c] < LIM){ l = k; break; } if(l < 0) continue; const a = L.action(P, nd.w, X(c), Z(c)); if(!a || !a.ok || (o.skip && o.skip(a))) continue;
      if(!INSTANT[a.type] && ((l >= GNAW_T ? Foff : Fon).lit[c] || Fon.lit[c] && l < GNAW_T)) continue; const k = a.type + a.i + ',' + (a.dc || 0) + ',' + (a.dr || 0), b = acts.get(k), mm = R.m[l][c]; if(!b || l > b.l || (l === b.l && mm < b.m)) acts.set(k, { a, c, m: mm, l }); }
    for(const v of acts.values()){ const t = v.a.type; queue.push({ w: t === 'timer' ? nd.w : L.apply(P, nd.w, v.a, 0), seeds: [{ c: v.c, m: INSTANT[t] ? v.m : 0, left: t === 'timer' ? S : INSTANT[t] ? v.l : Math.max(0, v.l - GNAW_T) }], d: nd.d + 1, prev: nd, via: v }); } }
  return { ok: false, states: count };
}
/* judančios lempos ar katinas: paieška laike (be veiksmų). mode: real | noshadow | nolight; grąžina trukmę arba -1; su path – ir kelią kas pustaktį */
function solveDyn(lv, o = {}){
  const P = L.parse(lv), w = L.world0(P), LIM = o.LIM || (o.opt ? 40 : 26), M = 41, W = 3, K = M * W, obs = L.obstacles(P, w), free = freeMap(P, obs, o.opt ? 0.005 : PAD), lf = o.opt ? litO : litC, lobs = o.noShadow ? [] : obs, maxT = o.maxT || 1100, layers = [], lits = [], bans = [];
  let cur = new Uint8Array(N * K); cur[cellOf(o.from || P.start) * K] = 1; const goal = o.goal || L.atDoor, t0 = o.t0 || 0; let end = null, T = -1;
  for(let step = 0; step < maxT && !end; step++){ const t = t0 + (step + 1) * HT, nxt = new Uint8Array(N * K), litM = new Int8Array(N).fill(-1), cat = P.cat ? L.catPos(P.cat, t) : null, ob2 = cat ? L.withCat(lobs, P.cat, t) : lobs; let any = false;
    const sees = (x, z) => L.catSees(obs, P.cat, cat, x, z), gz = c => { const x = X(c), z = Z(c), a = sees(x - MG, z - MG), b = sees(x + MG, z - MG), d = sees(x - MG, z + MG), e = sees(x + MG, z + MG); return o.opt ? a && b && d && e : a || b || d || e; };
    /* 0 – tamsu, 1 – apšviesta lempos, 2 – mato katinas (juosta pildosi greičiau) */
    const isLit = c => { if(litM[c] < 0) litM[c] = cat && !o.noGaze && gz(c) ? 2 : !o.noLight && lf(ob2, P.lamps, L.onAt(P, w, X(c), Z(c), t), X(c), Z(c), t) ? 1 : 0; return litM[c]; }, stp = (m, v) => v === 2 ? m + 4 : v === 1 ? m + 2 : Math.max(0, m - 3), ban = c => cat && Math.hypot(X(c) - cat[0], Z(c) - cat[1]) < L.CAT_TOUCH + 0.3;
    if(o.path){ layers.push(cur); lits.push(litM); bans.push(cat); }
    for(let c = 0; c < N && !end; c++){ const i = c % NX, j = (c / NX) | 0; for(let k = 0; k < K; k++){ if(!cur[c * K + k]) continue; any = true; const m = (k / W) | 0, wt = k % W; if(ban(c)) continue;
      if(wt > 0){ const nm = stp(m, isLit(c)); if(nm < LIM) nxt[(c * M + nm) * W + wt - 1] = 1; continue; }
      { const nm = stp(m, isLit(c)); if(nm < LIM) nxt[(c * M + nm) * W] = 1; }
      for(const [di, dj, kk] of NB){ const ni = i + di, nj = j + dj; if(ni < 0 || nj < 0 || ni >= NX || nj >= NZ) continue; const n = nj * NX + ni; if(!free[n] || ban(n)) continue; if(kk === 3 && (!free[j * NX + ni] || !free[nj * NX + i])) continue;
        const nm = stp(m, isLit(n)); if(nm >= LIM) continue; nxt[(n * M + nm) * W + kk - 1] = 1; if(goal(X(n), Z(n))){ end = [n, nm, kk - 1]; T = t - t0; break; } } } }
    cur = nxt; if(!any) break; }
  if(!end) return { ok: false, t: -1 }; if(!o.path) return { ok: true, t: T };
  /* kelio atkūrimas atgal per sluoksnius */
  const out = []; let [c, m, wt] = end;
  for(let step = layers.length - 1; step >= 0; step--){ out.push([X(c), Z(c)]); const Ly = layers[step], litM = lits[step], inc = litM[c] === 2 ? 4 : litM[c] === 1 ? 2 : 0, pm = inc ? (m >= inc ? [m - inc] : []) : (m === 0 ? [0, 1, 2, 3] : [m + 3]); let got = null;
    if(wt + 1 < W) for(const q of pm) if(q < M && Ly[(c * M + q) * W + wt + 1]){ got = [c, q, wt + 1]; break; }
    if(!got && wt === 0) for(const q of pm) if(q < M && Ly[(c * M + q) * W]){ got = [c, q, 0]; break; }
    if(!got){ const i = c % NX, j = (c / NX) | 0; for(const [di, dj, kk] of NB){ if(kk - 1 !== wt) continue; const pi = i - di, pj = j - dj; if(pi < 0 || pj < 0 || pi >= NX || pj >= NZ) continue; const pc = pj * NX + pi; if(kk === 3 && (!free[pj * NX + i] || !free[j * NX + pi])) continue; for(const q of pm) if(q < M && Ly[(pc * M + q) * W]){ got = [pc, q, 0]; break; } if(got) break; } }
    if(!got) throw new Error('nėra pirmtako ' + step); [c, m, wt] = got; }
  out.push([X(c), Z(c)]); return { ok: true, t: T, path: out.reverse() };
}
function map(lv, times, w){ const P = L.parse(lv); w = w || L.world0(P); const obs0 = L.obstacles(P, w);
  const one = t => { const obs = L.withCat(obs0, P.cat, t), rows = []; for(let j = 0; j < NZ; j += 2){ let s = ''; for(let i = 0; i < NX; i++){ const x = gx(i), z = gz(j); let ch = L.solid(obs, [], x, z, 0.01) ? '#' : L.lit(obs, P.lamps, L.onAt(P, w, x, z, null), x, z, t) ? '.' : ' ';
      for(const o of obs) if(Math.abs(o[1] - x) < 0.3 && Math.abs(o[2] - z) < 0.3 && ch === '#') ch = o[6] === 'B' ? 'B' : o[6] === 'S' ? 'S' : o[6] === '=' ? '=' : o[6] === 'cat' ? 'C' : o[6] === 'X' ? 'X' : '#';
      if(P.tubes.some(q => Math.hypot(q[0] - x, q[1] - z) < 0.2)) ch = 'T'; if(Math.hypot(P.start[0] - x, P.start[1] - z) < 0.2) ch = 'M'; for(const l of P.lamps) if(Math.hypot(l.x - x, l.z - z) < 0.2) ch = 'L';
      for(const q of P.ropes) if(Math.hypot(L.cx(q[0]) - x, L.cz(q[1]) - z) < 0.2) ch = 'r'; for(const q of P.cables) if(Math.hypot(L.cx(q[0]) - x, L.cz(q[1]) - z) < 0.2) ch = 'k'; for(const q of P.switches) if(Math.hypot(L.cx(q[0]) - x, L.cz(q[1]) - z) < 0.2) ch = 'j'; for(const q of P.buttons) if(Math.hypot(L.cx(q[0]) - x, L.cz(q[1]) - z) < 0.2 && ch !== 'B') ch = 'm'; s += ch; } rows.push('|' + s + '|'); } return rows; };
  const ms = (times || [0]).map(one); return ms[0].map((r, k) => ms.map(m => m[k]).join('  ')).join('\n'); }
/* ar pradžios vieta visada saugi (nei lempos, nei katino žvilgsnio) */
function startSafe(lv){ const P = L.parse(lv), w = L.world0(P), obs = L.obstacles(P, w), dyn = isDyn(P); for(let t = 0; t < (dyn ? 60 : 0.1); t += 0.15){ const cat = P.cat ? L.catPos(P.cat, t) : null, ob2 = L.withCat(obs, P.cat, t); for(const [dx, dz] of [[0, 0], [0.4, 0], [-0.4, 0], [0, 0.4], [0, -0.4]]){ const x = P.start[0] + dx, z = P.start[1] + dz; if(Math.abs(x) > 4.2 || Math.abs(z) > 7.2) continue; if(L.lit(ob2, P.lamps, L.onAt(P, w, x, z, dyn ? t : null), x, z, t) || (cat && L.catSees(obs, P.cat, cat, x, z))) return false; } } return true; }
module.exports = { L, startSafe, blinkLIM, pathBFS, reachT, solveStatic, solveDyn, fields, reach, goalOf, map, isDyn, cellOf, X, Z, N, NX, NZ, HT, gx, gz };
