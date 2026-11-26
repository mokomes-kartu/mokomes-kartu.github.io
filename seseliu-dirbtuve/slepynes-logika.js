/* Šešėlių slėpynės – žaidimo taisyklės be vaizdo: kambario langeliai, kliūtys, šviesa ir šešėlis, pelytės veiksmai.
   Tą patį failą naudoja ir žaidimas (slepynes.js), ir kambarių tikrintuvas, todėl patikrinti kambariai žaidime elgiasi lygiai taip pat.
   Kambarys – 9 × 15 langelių (langelis 1 × 1). Žemėlapio ženklai:
     .  grindys      #  dėžė           O  vaza (kolona)     =  žemas darbastalis (šviesos neužstoja)
     X  siena        B  stumiama dėžė  S  sūris (galima pragraužti)
     M  pelytės pradžia               T  dažų tūbelė
   Durys visada viršuje per vidurį. Kiti dalykai aprašomi atskirai: lamps (lempos), ropes ([kuoliuko c, r, maišo c, r]),
   cables ([c, r, lempos nr.]), cat ({ p: kelio taškai, v: greitis }). */
(function(root){
"use strict";
const RW = 4.5, RL = 7.5, COLS = 9, ROWS = 15, MR = 0.32, SPEED = 3.4, EYE = 0.3;
const T_SEE = 0.75, T_HIDE = 0.5, T_GNAW = 1.0;          /* per kiek laiko lempa pastebi, per kiek juosta ištuštėja, kiek trunka graužimas */
const REACH = 1.12, SIDE = 0.46, NEAR = 0.85, CAT_R = 0.45, CAT_TOUCH = CAT_R + MR + 0.08;
const cx = c => c - 4, cz = r => r - 7;
const SHAPE = { "#": ["b", 0.92, 0.92, 1.7], X: ["b", 1, 1, 2.6], "=": ["b", 1, 1, 0.6], O: ["c", 0.42, 1.8], B: ["b", 0.9, 0.9, 1.5], S: ["b", 1, 1, 1.7], sack: ["c", 0.45, 1.4], cat: ["c", CAT_R, 1.3] };
/* kliūtis: ["b", x, z, plotis, gylis, aukštis, rūšis, nr.] arba ["c", x, z, spindulys, aukštis, rūšis, nr.] */
function ob(kind, x, z, id){ const s = SHAPE[kind]; return s[0] === "b" ? ["b", x, z, s[1], s[2], s[3], kind, id] : ["c", x, z, s[1], s[2], kind, id]; }
function parse(lv){
  const P = { fixed: [], boxes: [], cheese: [], tubes: [], start: [0, 6.5], ropes: lv.ropes || [], cables: lv.cables || [], lamps: lv.lamps || [], cat: lv.cat || null };
  lv.map.forEach((row, r) => { for(let c = 0; c < COLS; c++){ const ch = row[c];
    if(ch === "#" || ch === "X" || ch === "=" || ch === "O") P.fixed.push(ob(ch, cx(c), cz(r))); else if(ch === "B") P.boxes.push([c, r]); else if(ch === "S") P.cheese.push([c, r]);
    else if(ch === "T") P.tubes.push([cx(c), cz(r)]); else if(ch === "M") P.start = [cx(c), cz(r)]; } });
  return P;
}
/* kambario būsena: kur stumiamos dėžės, kuris sūris dar sveikas, kurios virvės nugraužtos, kurios lempos dega */
const world0 = P => ({ boxes: P.boxes.map(b => b.slice()), cheese: P.cheese.map(() => true), ropes: P.ropes.map(() => false), on: P.lamps.map(L => !L.off) });
function obstacles(P, w){
  const o = P.fixed.slice(); w.boxes.forEach((b, i) => o.push(ob("B", cx(b[0]), cz(b[1]), i))); P.cheese.forEach((s, i) => { if(w.cheese[i]) o.push(ob("S", cx(s[0]), cz(s[1]), i)); });
  P.ropes.forEach((q, i) => { if(w.ropes[i]) o.push(ob("sack", cx(q[2]), cz(q[3]), i)); }); return o;
}
const lampAngle = (L, t) => L.a + (L.rot || 0) * t + (L.sw ? L.sw[0] * Math.sin(L.sw[1] * t) : 0), lampH = (L, t) => L.h + (L.hv ? L.hv[0] * Math.sin(L.hv[1] * t) : 0);
/* katino vieta laiku t: eina keliu pirmyn ir atgal */
function catPos(cat, t){
  const p = cat.p, seg = []; let len = 0; for(let i = 1; i < p.length; i++){ const d = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); seg.push(d); len += d; }
  let s = (t * cat.v) % (2 * len), back = false; if(s > len){ s = 2 * len - s; back = true; }
  for(let i = 0; i < seg.length; i++){ if(s <= seg[i] || i === seg.length - 1){ const k = seg[i] ? Math.min(1, s / seg[i]) : 0, dx = (p[i + 1][0] - p[i][0]) / (seg[i] || 1), dz = (p[i + 1][1] - p[i][1]) / (seg[i] || 1);
    return [p[i][0] + (p[i + 1][0] - p[i][0]) * k, p[i][1] + (p[i + 1][1] - p[i][1]) * k, back ? -dx : dx, back ? -dz : dz]; } s -= seg[i]; }
  return [p[0][0], p[0][1], 0, -1];
}
const withCat = (obs, cat, t) => { if(!cat) return obs; const c = catPos(cat, t); return obs.concat([ob("cat", c[0], c[1])]); };
/* ar spindulį nuo lempos (px, py, pz) iki pelytės akių (x, EYE, z) užstoja kliūtis */
function blocked(obs, px, py, pz, x, z){
  const dx = x - px, dy = EYE - py, dz = z - pz;
  for(const o of obs){
    if(o[0] === "b"){ let t0 = 0, t1 = 1, hit = true; const lo = [o[1] - o[3] / 2, 0, o[2] - o[4] / 2], hi = [o[1] + o[3] / 2, o[5], o[2] + o[4] / 2], p = [px, py, pz], d = [dx, dy, dz];
      for(let k = 0; k < 3 && hit; k++){ if(Math.abs(d[k]) < 1e-9){ if(p[k] < lo[k] || p[k] > hi[k]) hit = false; } else { let a = (lo[k] - p[k]) / d[k], b = (hi[k] - p[k]) / d[k]; if(a > b){ const s = a; a = b; b = s; } t0 = Math.max(t0, a); t1 = Math.min(t1, b); if(t0 > t1) hit = false; } }
      if(hit) return true; }
    else { const fx = px - o[1], fz = pz - o[2], A = dx * dx + dz * dz, B = 2 * (fx * dx + fz * dz), C = fx * fx + fz * fz - o[3] * o[3], D = B * B - 4 * A * C; if(D < 0 || A < 1e-9) continue;
      const s = Math.sqrt(D), t0 = Math.max(0, (-B - s) / (2 * A)), t1 = Math.min(1, (-B + s) / (2 * A)); if(t0 > t1) continue; if(py + dy * t1 <= o[4]) return true; }
  }
  return false;
}
function litBy(obs, L, x, z, t){
  const a = lampAngle(L, t), h = lampH(L, t), ax = Math.cos(a) * L.reach, az = Math.sin(a) * L.reach, al = Math.hypot(ax, h, az), vx = x - L.x, vy = EYE - h, vz = z - L.z, vl = Math.hypot(vx, vy, vz);
  if((vx * ax + vy * -h + vz * az) / (vl * al) < Math.cos(L.cone * 0.94)) return false; return !blocked(obs, L.x, h, L.z, x, z);
}
function lit(obs, lamps, on, x, z, t){ for(let i = 0; i < lamps.length; i++) if(on[i] && litBy(obs, lamps[i], x, z, t)) return true; return false; }
function solid(obs, lamps, x, z, r){
  if(Math.abs(x) > RW - r || Math.abs(z) > RL - r) return true;
  for(const o of obs){ if(o[0] === "b"){ const qx = Math.max(o[1] - o[3] / 2, Math.min(x, o[1] + o[3] / 2)), qz = Math.max(o[2] - o[4] / 2, Math.min(z, o[2] + o[4] / 2)); if(Math.hypot(x - qx, z - qz) < r) return true; } else if(Math.hypot(x - o[1], z - o[2]) < o[3] + r) return true; }
  for(const L of lamps) if(Math.hypot(x - L.x, z - L.z) < 0.3 + r) return true; return false;
}
const atDoor = (x, z) => z < -RL + 0.75 && Math.abs(x) < 1.15;
/* ar į langelį galima įstumti dėžę */
function cellFree(P, w, c, r){
  if(c < 0 || r < 0 || c >= COLS || r >= ROWS || (r === 0 && c >= 3 && c <= 5)) return false; const x = cx(c), z = cz(r);
  for(const o of obstacles(P, w)) if(Math.abs(o[1] - x) < 0.5 && Math.abs(o[2] - z) < 0.5) return false;
  for(const L of P.lamps) if(Math.abs(L.x - x) < 0.5 && Math.abs(L.z - z) < 0.5) return false;
  for(const q of P.ropes) if((q[0] === c && q[1] === r) || (q[2] === c && q[3] === r)) return false; for(const k of P.cables) if(k[0] === c && k[1] === r) return false; return true;
}
/* ar pelytė stovi prie pat daikto šono: grąžina kryptį ir atstumą */
function facing(x, z, ox, oz){ const dx = ox - x, dz = oz - z;
  if(Math.abs(dx) >= Math.abs(dz)) return Math.abs(dx) <= REACH && Math.abs(dz) <= SIDE ? [Math.sign(dx), 0, Math.abs(dx)] : null; return Math.abs(dz) <= REACH && Math.abs(dx) <= SIDE ? [0, Math.sign(dz), Math.abs(dz)] : null; }
/* ką pelytė gali padaryti stovėdama taške (x, z): arčiausias daiktas, su kuriuo galima ką nors veikti */
function action(P, w, x, z){
  let best = null; const take = (a, d) => { if(!best || d < best.d){ best = a; best.d = d; } };
  w.boxes.forEach((b, i) => { const f = facing(x, z, cx(b[0]), cz(b[1])); if(f) take({ type: "push", i, dc: f[0], dr: f[1], ok: cellFree(P, w, b[0] + f[0], b[1] + f[1]) }, f[2]); });
  P.cheese.forEach((s, i) => { if(!w.cheese[i]) return; const f = facing(x, z, cx(s[0]), cz(s[1])); if(f) take({ type: "cheese", i, ok: true }, f[2]); });
  P.ropes.forEach((q, i) => { if(w.ropes[i]) return; const d = Math.hypot(cx(q[0]) - x, cz(q[1]) - z); if(d <= NEAR) take({ type: "rope", i, ok: true }, d); });
  P.cables.forEach((k, i) => { if(!w.on[k[2]]) return; const d = Math.hypot(cx(k[0]) - x, cz(k[1]) - z); if(d <= NEAR) take({ type: "cable", i, ok: true }, d); });
  return best;
}
function apply(P, w, a){
  const n = { boxes: w.boxes.map(b => b.slice()), cheese: w.cheese.slice(), ropes: w.ropes.slice(), on: w.on.slice() };
  if(a.type === "push"){ n.boxes[a.i][0] += a.dc; n.boxes[a.i][1] += a.dr; } else if(a.type === "cheese") n.cheese[a.i] = false; else if(a.type === "rope") n.ropes[a.i] = true; else if(a.type === "cable") n.on[P.cables[a.i][2]] = false;
  return n;
}
const API = { RW, RL, COLS, ROWS, MR, SPEED, EYE, T_SEE, T_HIDE, T_GNAW, NEAR, CAT_R, CAT_TOUCH, SHAPE, cx, cz, parse, world0, obstacles, lampAngle, lampH, catPos, withCat, lit, solid, atDoor, cellFree, action, apply };
if(typeof module !== "undefined" && module.exports) module.exports = API; else root.MK_SL = API;
})(typeof window !== "undefined" ? window : this);
