/* Mažo dėžių galvosūkio paieška 3 eilučių arenoje (12–14 eil.): node sok.js <bandymų> <sėkla> <min> <max> */
let seed = +(process.argv[3] || 1); const R = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }, ri = (a, b) => a + Math.floor(R() * (b - a + 1));
const W = 9, H = 3, N = +(process.argv[2] || 2000), DMIN = +(process.argv[4] || 7), DMAX = +(process.argv[5] || 11), id = (c, r) => r * W + c;
function solve(wall, boxes, btn, start){
  const key = (b, m) => b.slice().sort((x, y) => x - y).join(',') + '|' + m, comp = (b, m) => { const seen = new Uint8Array(W * H), q = [m]; seen[m] = 1; let mn = m; for(let h = 0; h < q.length; h++){ const c = q[h] % W, r = (q[h] / W) | 0; for(const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]){ const nc = c + dc, nr = r + dr; if(nc < 0 || nr < 0 || nc >= W || nr >= H) continue; const n = id(nc, nr); if(seen[n] || wall[n] || b.includes(n)) continue; seen[n] = 1; q.push(n); if(n < mn) mn = n; } } return [seen, mn]; };
  let [s0, m0] = comp(boxes, start); const seenS = new Set([key(boxes, m0)]); let layer = [{ b: boxes, seen: s0, path: [] }];
  for(let d = 0; d <= DMAX && layer.length; d++){ const next = []; for(const st of layer){ if(st.b.every(x => btn.includes(x))) return { d, path: st.path };
      st.b.forEach((bx, i) => { const c = bx % W, r = (bx / W) | 0; for(const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]){ const mc = c - dc, mr = r - dr, tc = c + dc, tr = r + dr; if(mc < 0 || mr < 0 || mc >= W || mr >= H || tc < 0 || tr < 0 || tc >= W || tr >= H) continue; const t = id(tc, tr); if(!st.seen[id(mc, mr)] || wall[t] || st.b.includes(t)) continue;
          const nb = st.b.slice(); nb[i] = t; const [sn, mn] = comp(nb, bx), k = key(nb, mn); if(seenS.has(k)) continue; seenS.add(k); next.push({ b: nb, seen: sn, path: st.path.concat([[i, dc, dr]]) }); } }); } layer = next; }
  return null; }
const out = [];
for(let k = 0; k < N; k++){ const wall = new Uint8Array(W * H), used = new Set(), pick = () => { for(;;){ const c = id(ri(0, W - 1), ri(0, H - 1)); if(!used.has(c)){ used.add(c); return c; } } };
  const nw = ri(1, 4); for(let i = 0; i < nw; i++) wall[pick()] = 1; const btn = [pick(), pick()], boxes = [pick(), pick()], start = pick(); if(wall[id(7, 0)] && wall[id(8, 0)]) continue;
  const r = solve(wall, boxes, btn, start); if(!r || r.d < DMIN) continue;
  /* ar „artimiausias“ paskirstymas klaidingas: kuri dėžė baigia ant kurio mygtuko */
  const fin = boxes.slice(); for(const [i, dc, dr] of r.path) fin[i] += dc + dr * W; const dist = (a, b) => Math.abs(a % W - b % W) + Math.abs(((a / W) | 0) - ((b / W) | 0)), near0 = dist(boxes[0], btn[0]) <= dist(boxes[0], btn[1]) ? btn[0] : btn[1], crossed = fin[0] !== near0, dirs = new Set(r.path.map(p => p[0] + ':' + p[1] + ',' + p[2])).size;
  out.push({ d: r.d, crossed, dirs, wall: [...wall], btn, boxes, start, path: r.path }); }
out.sort((a, b) => (b.crossed - a.crossed) || (b.dirs - a.dirs) || (a.d - b.d)); console.log('rasta', out.length);
for(const o of out.slice(0, 6)){ const g = []; for(let r = 0; r < H; r++){ let s = ''; for(let c = 0; c < W; c++){ const i = id(c, r); s += o.wall[i] ? 'X' : o.boxes.includes(i) ? 'B' : o.btn.includes(i) ? 'm' : i === o.start ? 'M' : '.'; } g.push(s); } console.log('stūmimų', o.d, 'kryžminis', o.crossed, 'krypčių', o.dirs, JSON.stringify({ btn: o.btn.map(b => [b % W, 12 + ((b / W) | 0)]), path: o.path.map(p => p.join('')).join(' ') })); console.log(g.join('\n')); }
