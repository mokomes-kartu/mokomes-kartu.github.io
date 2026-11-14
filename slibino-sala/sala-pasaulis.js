/* Slibino sala – 3D pasaulis: reljefas, augmenija, statiniai, susidūrimai, slibinų modeliai.
   Koordinatės: x – į rytus, z – į pietus, y – aukštyn (metrais). Sala ~900 m skersmens. */
import * as THREE from "./three.module.min.js";
import { leafTex, groundTex, waterTex, decorateMaze, addWildlife } from "./sala-gyviai.js";

/* ---------- triukšmas ir atsitiktinumas (fiksuotas – sala visada tokia pati) ---------- */
function mulberry(a){ return function(){ a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const hash = (i, j) => { let h = i * 374761393 + j * 668265263; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const sm = t => t * t * (3 - 2 * t);
function vnoise(x, z){ const i = Math.floor(x), j = Math.floor(z), fx = sm(x - i), fz = sm(z - j);
  const a = hash(i, j), b = hash(i + 1, j), c = hash(i, j + 1), d = hash(i + 1, j + 1);
  return a + (b - a) * fx + (c - a) * fz + (a - b - c + d) * fx * fz; }
function fbm(x, z, o){ let s = 0, a = 0.5, f = 1, n = 0; for(let k = 0; k < (o || 4); k++){ s += a * vnoise(x * f, z * f); n += a; a *= 0.5; f *= 2.03; } return s / n; }
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const sstep = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
const mix = (a, b, t) => a + (b - a) * t;
const dist = (x, z, p) => Math.hypot(x - p[0], z - p[1]);

/* ---------- svarbiausios vietos ---------- */
export const HALF = 520, SEG = 208, CS = HALF * 2 / SEG;
export const POI = {
  mountain: [0, -330], gate: [0, -160], cross: [0, 160],
  maze: [235, 150], mill: [180, 92],
  lake: [-250, -50], islet: [-212, -50],
  plateau: [292, -112],
  ruins: [-150, -6]
};
export const MAZE_N = 13, MAZE_C = 4;
export const CAVE = { x0: -262, x1: -186, z0: 178, z1: 266 };

function baseH(x, z){
  const r = Math.hypot(x, z), ang = Math.atan2(z, x);
  const coast = 438 + 26 * Math.sin(ang * 3 + 1) + 18 * Math.sin(ang * 5 - 2) + 30 * (fbm(Math.cos(ang) * 2 + 5, Math.sin(ang) * 2 + 5, 3) - 0.5);
  const inl = clamp((coast - r) / 75, 0, 1);
  const land = 2.6 + 11 * fbm(x * 0.0045 + 11, z * 0.0045 - 7, 4) - 3 + 1.6 * vnoise(x * 0.035, z * 0.035);
  let h = mix(-8, Math.max(land, 2.2), sm(inl));
  const dM = dist(x, z, POI.mountain);
  if(dM < 200){ const k = 1 - dM / 200; h += 105 * Math.pow(k, 1.55) * (0.8 + 0.4 * fbm(x * 0.012 + 3, z * 0.012 + 9, 3)); }
  return h;
}
const bP = baseH(POI.plateau[0], POI.plateau[1]);
export const PLATEAU_TOP = bP + 21;
const MAZE_Y = baseH(POI.maze[0], POI.maze[1]);
const CAVE_Y = Math.max(3, baseH(-224, 222));
const GATE_Y = baseH(POI.gate[0], POI.gate[1] + 6);
export function rawH(x, z){
  let h = baseH(x, z);
  /* ežeras ir salelė */
  const dL = dist(x, z, POI.lake);
  if(dL < 100) h = mix(h, -5.5, sstep(100, 58, dL));
  const dI = dist(x, z, POI.islet);
  if(dI < 23) h = Math.max(h, mix(-5.5, 2.4, sstep(23, 7, dI)));
  /* Erelio uola */
  const dP = dist(x, z, POI.plateau);
  if(dP < 33) h = mix(h, PLATEAU_TOP + 0.6 * vnoise(x * 0.2, z * 0.2), sstep(31.5, 24.5, dP));
  /* labirintas – lyguma */
  const mx = Math.abs(x - POI.maze[0]), mz = Math.abs(z - POI.maze[1]);
  const mE = Math.max(mx, mz);
  if(mE < 46) h = mix(h, MAZE_Y, sstep(46, 33, mE));
  /* urvo aikštelė */
  const cx = Math.max(CAVE.x0 - x, x - CAVE.x1, 0), cz = Math.max(CAVE.z0 - z, z - CAVE.z1, 0), cE = Math.hypot(cx, cz);
  if(cE < 18) h = mix(h, CAVE_Y, sstep(18, 0, cE));
  /* vartų aikštelė */
  const dG = dist(x, z, [POI.gate[0], POI.gate[1] + 14]);
  if(dG < 34) h = mix(h, GATE_Y, sstep(34, 18, dG));
  return h;
}

/* ---------- takai (rodo kryptį, bet ne į paslėptas vietas) ---------- */
let START = null;
function beachPoint(bearing, target){
  const sx = Math.sin(bearing * Math.PI / 180), sz = -Math.cos(bearing * Math.PI / 180);
  for(let r = 470; r > 200; r -= 1){ if(rawH(sx * r, sz * r) >= target) return [sx * r, sz * r]; }
  return [sx * 300, sz * 300];
}

/* ===================================================================== */
export function buildWorld(scene, Q){
  const rng = mulberry(20261113);
  const low = Q === "low";
  const W = { boxes: [], circles: [], grid: new Map(), anim: [], inter: {} };
  START = beachPoint(180, 3.4);
  const LIGHT = beachPoint(166, 2.2);
  const STONES = beachPoint(214, 1.6);
  W.start = START; W.light = LIGHT; W.stones = STONES;
  const PATHS = [
    [START, [0, 300], [10, 230], POI.cross],
    [POI.cross, [-8, 60], [6, -40], [0, -110], [POI.gate[0], POI.gate[1] + 30]],
    [POI.cross, [70, 150], [130, 118], POI.mill, [215, 112], [POI.maze[0], POI.maze[1] + 34]],
    [POI.cross, [-60, 110], [-110, 50], POI.ruins],
    [POI.cross, [-90, 200], [-170, 250], [-180, 274]],
    [[6, -40], [110, -60], [200, -100], [POI.plateau[0] - 40, POI.plateau[1]]],
    [LIGHT, [60, 380], [40, 330], [10, 300]]
  ];
  W.paths = PATHS;
  const segDist = (x, z) => { let m = 1e9; for(const p of PATHS) for(let i = 0; i < p.length - 1; i++){ const [ax, az] = p[i], [bx, bz] = p[i + 1]; const vx = bx - ax, vz = bz - az; const t = clamp(((x - ax) * vx + (z - az) * vz) / (vx * vx + vz * vz), 0, 1); m = Math.min(m, Math.hypot(x - ax - vx * t, z - az - vz * t)); } return m; };

  /* ---------- reljefas ---------- */
  const N1 = SEG + 1, HG = new Float32Array(N1 * N1);
  for(let j = 0; j < N1; j++) for(let i = 0; i < N1; i++) HG[j * N1 + i] = rawH(-HALF + i * CS, -HALF + j * CS);
  W.HG = HG;
  const ground = (x, z) => {
    let fi = (x + HALF) / CS, fj = (z + HALF) / CS;
    if(fi < 0 || fj < 0 || fi >= SEG || fj >= SEG) return -10;
    const i = Math.floor(fi), j = Math.floor(fj), fx = fi - i, fz = fj - j;
    const h00 = HG[j * N1 + i], h10 = HG[j * N1 + i + 1], h01 = HG[(j + 1) * N1 + i], h11 = HG[(j + 1) * N1 + i + 1];
    return fx + fz <= 1 ? h00 + (h10 - h00) * fx + (h01 - h00) * fz : h11 + (h01 - h11) * (1 - fx) + (h10 - h11) * (1 - fz);
  };
  W.terrain = ground;
  const pathMask = new Float32Array(N1 * N1);
  for(let j = 0; j < N1; j++) for(let i = 0; i < N1; i++){ const x = -HALF + i * CS, z = -HALF + j * CS; if(Math.hypot(x, z) < 470) pathMask[j * N1 + i] = segDist(x, z); else pathMask[j * N1 + i] = 99; }
  W.pathDist = (x, z) => { const i = clamp(Math.round((x + HALF) / CS), 0, SEG), j = clamp(Math.round((z + HALF) / CS), 0, SEG); return pathMask[j * N1 + i]; };
  {
    const pos = new Float32Array(SEG * SEG * 6 * 3), col = new Float32Array(SEG * SEG * 6 * 3);
    const C = { sand: new THREE.Color("#ead59c"), wet: new THREE.Color("#cdb47e"), g1: new THREE.Color("#7fc75a"), g2: new THREE.Color("#5fae49"), g3: new THREE.Color("#93cf62"),
      rock: new THREE.Color("#8d8f98"), rock2: new THREE.Color("#a3a3a8"), snow: new THREE.Color("#f3f6fb"), path: new THREE.Color("#c29c64"), bottom: new THREE.Color("#b9a874"), dark: new THREE.Color("#4f9a40") };
    const tc = new THREE.Color();
    let p = 0;
    const put = (i, j) => { pos[p++] = -HALF + i * CS; pos[p++] = HG[j * N1 + i]; pos[p++] = -HALF + j * CS; };
    const face = (ia, ja, ib, jb, ic, jc, k) => {
      const ya = HG[ja * N1 + ia], yb = HG[jb * N1 + ib], yc = HG[jc * N1 + ic];
      const h = (ya + yb + yc) / 3, x = -HALF + (ia + ib + ic) / 3 * CS, z = -HALF + (ja + jb + jc) / 3 * CS;
      /* nuolydis */
      const ux = (ib - ia) * CS, uy = yb - ya, uz = (jb - ja) * CS, vx = (ic - ia) * CS, vy = yc - ya, vz = (jc - ja) * CS;
      const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx, ln = Math.hypot(nx, ny, nz), up = Math.abs(ny / ln);
      const n = fbm(x * 0.02, z * 0.02, 2), pd = W.pathDist(x, z);
      if(h < -0.2) tc.copy(C.bottom).lerp(C.wet, n * 0.5);
      else if(up < 0.62) tc.copy(C.rock).lerp(C.rock2, n);
      else if(h > 78) tc.copy(C.snow);
      else if(h < 1.6 || (h < 2.6 && Math.hypot(x, z) > 330)) tc.copy(h < 0.5 ? C.wet : C.sand);
      else if(pd < 3.2) tc.copy(C.g1).lerp(C.path, 0.25);
      else if(up < 0.8) tc.copy(C.rock2).lerp(C.g2, 0.45);
      else { tc.copy(C.g1).lerp(C.g2, n); if(n > 0.62) tc.lerp(C.g3, (n - 0.62) * 2); if(h > 50) tc.lerp(C.rock2, clamp((h - 50) / 30, 0, 0.7)); }
      const jit = 0.94 + 0.12 * hash(ia * 7 + k, ja * 13);
      for(let v = 0; v < 3; v++){ const o = (p / 3 - 3 + v) * 3; col[o] = tc.r * jit; col[o + 1] = tc.g * jit; col[o + 2] = tc.b * jit; }
    };
    for(let j = 0; j < SEG; j++) for(let i = 0; i < SEG; i++){
      put(i, j); put(i, j + 1); put(i + 1, j); face(i, j, i, j + 1, i + 1, j, 0);
      put(i + 1, j); put(i, j + 1); put(i + 1, j + 1); face(i + 1, j, i, j + 1, i + 1, j + 1, 1);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const uv = new Float32Array(pos.length / 3 * 2); for(let k = 0, q = 0; k < pos.length; k += 3){ uv[q++] = pos[k] / 7; uv[q++] = pos[k + 2] / 7; }
    g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, new THREE.MeshLambertMaterial({ vertexColors: true, map: groundTex() }));
    m.receiveShadow = !low; scene.add(m); W.terrainMesh = m;
  }
  /* takai – juostos virš reljefo */
  {
    const pos = [], col = [], pc = new THREE.Color("#c9a06a"), pc2 = new THREE.Color("#b88f5b");
    for(const p of PATHS){
      const pts = [];
      for(let i = 0; i < p.length - 1; i++){ const [ax, az] = p[i], [bx, bz] = p[i + 1], L = Math.hypot(bx - ax, bz - az), n = Math.max(1, Math.ceil(L / 2)); for(let k = 0; k < n; k++) pts.push([ax + (bx - ax) * k / n, az + (bz - az) * k / n]); }
      pts.push(p[p.length - 1]);
      for(let i = 0; i < pts.length - 1; i++){
        const [ax, az] = pts[i], [bx, bz] = pts[i + 1];
        const pa = i ? pts[i - 1] : pts[i], pb = pts[Math.min(pts.length - 1, i + 2)];
        const n1 = [-(bz - pa[1]), bx - pa[0]], n2 = [-(pb[1] - az), pb[0] - ax];
        const l1 = Math.hypot(...n1) || 1, l2 = Math.hypot(...n2) || 1, w = 1.7 + 0.25 * Math.sin(i * 0.7);
        const A = [ax + n1[0] / l1 * w, az + n1[1] / l1 * w], B = [ax - n1[0] / l1 * w, az - n1[1] / l1 * w];
        const C2 = [bx + n2[0] / l2 * w, bz + n2[1] / l2 * w], D = [bx - n2[0] / l2 * w, bz - n2[1] / l2 * w];
        const y = q => Math.max(ground(q[0], q[1]), 0.05) + 0.07;
        const quad = [A, B, C2, B, D, C2];
        const c = i % 2 ? pc : pc2;
        for(const q of quad){ pos.push(q[0], y(q), q[1]); col.push(c.r, c.g, c.b); }
      }
    }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3)); g.computeVertexNormals();
    const m = new THREE.Mesh(g, new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
    m.receiveShadow = !low; scene.add(m);
  }
  /* vanduo */
  {
    const g = new THREE.PlaneGeometry(2400, 2400, 1, 1); g.rotateX(-Math.PI / 2);
    const wt = waterTex(); wt.repeat.set(260, 260);
    const m = new THREE.Mesh(g, new THREE.MeshLambertMaterial({ color: "#3d9fd8", transparent: true, opacity: 0.84, map: wt }));
    m.position.y = 0; scene.add(m); W.water = m;
    W.anim.push((t) => { wt.offset.set(t * 0.012, Math.sin(t * 0.25) * 0.01 + t * 0.006); });
    /* šviesesnė juosta prie kranto */
    const g2 = new THREE.RingGeometry(380, 470, 64, 1); g2.rotateX(-Math.PI / 2);
    const m2 = new THREE.Mesh(g2, new THREE.MeshBasicMaterial({ color: "#7fd0ee", transparent: true, opacity: 0.25, depthWrite: false }));
    m2.position.y = 0.03; scene.add(m2);
  }

  /* ---------- susidūrimai ---------- */
  const GC = 10;
  const key = (i, j) => i * 4096 + j;
  function reg(o){ const i0 = Math.floor(o.x0 / GC), i1 = Math.floor(o.x1 / GC), j0 = Math.floor(o.z0 / GC), j1 = Math.floor(o.z1 / GC);
    for(let i = i0; i <= i1; i++) for(let j = j0; j <= j1; j++){ const k = key(i, j); let a = W.grid.get(k); if(!a){ a = []; W.grid.set(k, a); } a.push(o); } }
  W.addBox = (x0, x1, y0, y1, z0, z1, tag) => { const o = { t: "b", x0, x1, y0, y1, z0, z1, tag, on: true }; W.boxes.push(o); reg(o); return o; };
  W.addCircle = (x, z, r, y0, y1, tag) => { const o = { t: "c", x, z, r, y0, y1, x0: x - r, x1: x + r, z0: z - r, z1: z + r, tag, on: true }; W.circles.push(o); reg(o); return o; };
  W.near = (x, z) => { const a = W.grid.get(key(Math.floor(x / GC), Math.floor(z / GC))); return a || []; };
  /* aukščiausias pagrindas po kojomis (reljefas arba dėžės viršus) */
  W.groundAt = (x, z, feet, step) => {
    let g = ground(x, z);
    for(const o of W.near(x, z)) if(o.on && o.t === "b" && x >= o.x0 && x <= o.x1 && z >= o.z0 && z <= o.z1 && o.y1 <= feet + step && o.y1 > g) g = o.y1;
    return g;
  };

  /* ---------- medžiagos ir pagalbinės funkcijos ---------- */
  const lam = (c, o) => new THREE.MeshLambertMaterial(Object.assign({ color: c, flatShading: true }, o || {}));
  const MAT = { wood: lam("#8a5a34"), wood2: lam("#a8713f"), stone: lam("#9b9aa0"), stone2: lam("#b7b4ad"), dark: lam("#3d3a44"), red: lam("#d8443a"), white: lam("#f4f1e8"),
    metal: lam("#c9a43b"), hedge: lam("#3f8f3a"), roof: lam("#b8452f"), leaf: lam("#5aa845") };
  const mesh = (geo, mat, x, y, z, cast) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); if(!low && cast !== false){ m.castShadow = true; m.receiveShadow = true; } scene.add(m); return m; };
  const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
  const solidBox = (cx, y0, cz, w, h, d, mat, tag) => { const m = mesh(box(w, h, d), mat, cx, y0 + h / 2, cz); W.addBox(cx - w / 2, cx + w / 2, y0, y0 + h, cz - d / 2, cz + d / 2, tag); return m; };
  const exclude = [];
  const isFree = (x, z, r) => { for(const e of exclude) if(e.t === "c" ? Math.hypot(x - e.x, z - e.z) < e.r + r : x > e.x0 - r && x < e.x1 + r && z > e.z0 - r && z < e.z1 + r) return false; return true; };
  const exC = (x, z, r) => exclude.push({ t: "c", x, z, r });
  const exR = (x0, x1, z0, z1) => exclude.push({ t: "r", x0, x1, z0, z1 });

  /* ---------- švyturys ---------- */
  {
    const [x, z] = LIGHT, y = ground(x, z) - 0.5;
    for(let k = 0; k < 5; k++){ const r0 = 3.2 - k * 0.22, r1 = 3.2 - (k + 1) * 0.22; mesh(new THREE.CylinderGeometry(r1, r0, 3.6, 12), k % 2 ? MAT.white : MAT.red, x, y + 1.8 + k * 3.6, z); }
    mesh(new THREE.CylinderGeometry(2.4, 2.4, 0.5, 12), MAT.dark, x, y + 18.25, z);
    const lamp = mesh(new THREE.CylinderGeometry(1.5, 1.5, 2.2, 10), new THREE.MeshBasicMaterial({ color: "#fff2a8" }), x, y + 19.6, z, false);
    mesh(new THREE.ConeGeometry(2.2, 2.4, 10), MAT.red, x, y + 21.9, z);
    W.addCircle(x, z, 3.3, -50, 200, "light"); exC(x, z, 12);
    W.anim.push(t => { lamp.material.color.setHSL(0.14, 1, 0.75 + 0.15 * Math.sin(t * 2)); });
  }
  /* ---------- užrašų akmenys ---------- */
  W.clueSpots = {};
  const runeMat = new THREE.MeshBasicMaterial({ color: "#f2c94c" });
  function clueStone(id, x, z, face){
    const y = ground(x, z);
    const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = face || 0;
    const s = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.6, 0.5), MAT.stone); s.position.y = 0.8; s.rotation.x = -0.12;
    if(!low){ s.castShadow = true; }
    g.add(s);
    for(let k = 0; k < 4; k++){ const l = new THREE.Mesh(new THREE.BoxGeometry(0.9 + (k % 2) * 0.4, 0.07, 0.04), runeMat); l.position.set(0, 1.2 - k * 0.22, 0.27 + k * 0.026); l.rotation.x = -0.12; g.add(l); }
    scene.add(g); W.addCircle(x, z, 1.0, y - 1, y + 1.6);
    W.clueSpots[id] = [x, y, z]; exC(x, z, 4);
  }
  clueStone("start", START[0] + 6, START[1] - 8, 0.4);
  clueStone("cross", POI.cross[0] + 4, POI.cross[1] - 4, 0.3);
  clueStone("maze", POI.maze[0] + 6, POI.maze[1] + 33, 0);
  clueStone("lake", POI.ruins[0] - 6, POI.ruins[1] + 10, -0.8);
  clueStone("cave", -178, 270, 0.6);
  clueStone("eagle", POI.plateau[0] - 38, POI.plateau[1] + 3, -1.57);
  /* kryžkelės stulpas su rodyklėmis */
  {
    const [x, z] = POI.cross, y = ground(x, z);
    mesh(new THREE.CylinderGeometry(0.18, 0.22, 3.6, 6), MAT.wood, x, y + 1.8, z); W.addCircle(x, z, 0.4, y, y + 4);
    [[0, "#e8d7a8"], [Math.PI / 2, "#d8c18b"], [-2.2, "#e8d7a8"], [2.0, "#d8c18b"]].forEach(([a, c], k) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.36, 0.08), lam(c)); const gp = new THREE.Group(); gp.position.set(x, y + 2.9 - k * 0.42, z); gp.rotation.y = a; b.position.x = 0.85; gp.add(b);
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.3, 3), lam(c)); tip.rotation.z = -Math.PI / 2; tip.position.x = 1.8; gp.add(tip); scene.add(gp); });
    exC(x, z, 8);
  }

  /* ---------- trys akmenys ir užkasta skrynia ---------- */
  {
    const [x, z] = STONES;
    for(let k = 0; k < 3; k++){ const a = k * 2.094 + 0.5, sx = x + Math.cos(a) * 4.6, sz = z + Math.sin(a) * 4.6, y = ground(sx, sz);
      const m = mesh(new THREE.BoxGeometry(1.3, 3.4 + k * 0.3, 1.0), MAT.stone, sx, y + 1.5, sz); m.rotation.set(0.06 * k, a, 0.08); W.addCircle(sx, sz, 0.9, y - 1, y + 4); }
    exC(x, z, 8);
    W.buried = { x, z };
  }

  /* ---------- skrynios ir kristalai ---------- */
  const CRYS = { shell: "#ff8a2a", leaf: "#3fd16a", mushroom: "#b16bff", eagle: "#ffc61a", fish: "#2f9bff" };
  W.CRYS = CRYS;
  W.chests = {};
  function makeChest(id, x, z, rot, hidden){
    const y = ground(x, z);
    const g = new THREE.Group(); g.position.set(x, hidden ? y - 1.4 : y, z); g.rotation.y = rot || 0;
    const b = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.8, 0.9), MAT.wood2); b.position.y = 0.4; g.add(b);
    for(const bx of [-0.45, 0.45]){ const s = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.84, 0.94), MAT.metal); s.position.set(bx, 0.4, 0); g.add(s); }
    const lid = new THREE.Group(); lid.position.set(0, 0.8, -0.45); g.add(lid);
    const l = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 1.4, 8, 1, false, 0, Math.PI), MAT.wood); l.rotation.z = Math.PI / 2; l.position.z = 0.45; lid.add(l);
    const lock = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.3, 0.1), MAT.metal); lock.position.set(0, 0.62, 0.47); g.add(lock);
    const cr = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), new THREE.MeshLambertMaterial({ color: CRYS[id], emissive: CRYS[id], emissiveIntensity: 0.65, flatShading: true }));
    cr.scale.y = 1.5; cr.position.y = 0.5; cr.visible = false; g.add(cr);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), color: CRYS[id], transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    glow.scale.set(2.6, 2.6, 1); glow.visible = false; cr.add(glow);
    if(!low){ b.castShadow = true; }
    scene.add(g);
    const c = { id, g, lid, cr, lock, x, z, y, open: false, col: null };
    if(!hidden) c.col = W.addBox(x - 0.75, x + 0.75, y, y + 0.9, z - 0.55, z + 0.55);
    W.chests[id] = c; exC(x, z, 3);
    return c;
  }
  W.makeChestCollider = c => { if(!c.col) c.col = W.addBox(c.x - 0.75, c.x + 0.75, c.y, c.y + 0.9, c.z - 0.55, c.z + 0.55); };
  makeChest("shell", STONES[0], STONES[1], 0.4, true);

  /* ---------- labirintas ---------- */
  {
    const n = MAZE_N, c = MAZE_C, ox = POI.maze[0] - n * c / 2, oz = POI.maze[1] - n * c / 2, y = MAZE_Y;
    const r = mulberry(777), walls = { h: [], v: [] }; // h[j][i] – siena virš langelio (j eilutė), v[j][i] – kairė siena
    for(let j = 0; j <= n; j++){ walls.h[j] = []; for(let i = 0; i < n; i++) walls.h[j][i] = true; }
    for(let j = 0; j < n; j++){ walls.v[j] = []; for(let i = 0; i <= n; i++) walls.v[j][i] = true; }
    const seen = Array.from({ length: n }, () => Array(n).fill(false)), st = [[6, 12]]; seen[12][6] = true;
    while(st.length){ const [i, j] = st[st.length - 1]; const nb = [[0, -1], [1, 0], [0, 1], [-1, 0]].map(([a, b]) => [i + a, j + b, a, b]).filter(([a, b]) => a >= 0 && b >= 0 && a < n && b < n && !seen[b][a]);
      if(!nb.length){ st.pop(); continue; }
      const [ni, nj, a, b] = nb[Math.floor(r() * nb.length)];
      if(a === 1) walls.v[j][i + 1] = false; if(a === -1) walls.v[j][i] = false; if(b === 1) walls.h[j + 1][i] = false; if(b === -1) walls.h[j][i] = false;
      seen[nj][ni] = true; st.push([ni, nj]); }
    walls.h[n][6] = false; // įėjimas pietuose
    /* papildomi praėjimai, kad labirintas turėtų kelis kelius */
    for(let k = 0; k < 7; k++){ const i = 1 + Math.floor(r() * (n - 2)), j = 1 + Math.floor(r() * (n - 2)); if(r() < 0.5) walls.v[j][i] = false; else walls.h[j][i] = false; }
    const segs = [], T = 0.9, HH = 3.3;
    for(let j = 0; j <= n; j++){ let s = -1; for(let i = 0; i <= n; i++){ const w = i < n && walls.h[j][i]; if(w && s < 0) s = i; if(!w && s >= 0){ segs.push([ox + s * c - T / 2, ox + i * c + T / 2, oz + j * c - T / 2, oz + j * c + T / 2]); s = -1; } } }
    for(let i = 0; i <= n; i++){ let s = -1; for(let j = 0; j <= n; j++){ const w = j < n && walls.v[j][i]; if(w && s < 0) s = j; if(!w && s >= 0){ segs.push([ox + i * c - T / 2, ox + i * c + T / 2, oz + s * c - T / 2, oz + j * c + T / 2]); s = -1; } } }
    /* gyvatvorės: viena sulieta geometrija su lapijos tekstūra (UV pagal sienos dydį) */
    const hPos = [], hUv = [], hCol = [], col = new THREE.Color(), segInfo = [];
    segs.forEach(([x0, x1, z0, z1]) => {
      const hh = HH + (r() - 0.5) * 0.5, w = x1 - x0, d = z1 - z0, g = box(w, hh, d).toNonIndexed();
      g.translate((x0 + x1) / 2, y + hh / 2 - 0.2, (z0 + z1) / 2);
      const gp = g.attributes.position, gn = g.attributes.normal, gu = g.attributes.uv;
      col.setHSL(0.31 + 0.03 * r(), 0.42, 0.52 + 0.1 * r());
      for(let i = 0; i < gp.count; i++){
        const nx = Math.abs(gn.getX(i)), ny = gn.getY(i), top = ny > 0.5;
        const fw = nx > 0.5 ? d : w, fh = Math.abs(ny) > 0.5 ? d : hh;
        hPos.push(gp.getX(i), gp.getY(i), gp.getZ(i)); hUv.push(gu.getX(i) * fw / 2.6, gu.getY(i) * fh / 2.6);
        const k = top ? 1.35 : 0.7 + (gp.getY(i) - (y - 0.2)) / hh * 0.45; hCol.push(col.r * k, col.g * k, col.b * k);
      }
      W.addBox(x0, x1, y - 2, y + HH - 0.2, z0, z1, "hedge");
      segInfo.push([x0, x1, z0, z1, y + hh - 0.2, y]);
    });
    const hgeo = new THREE.BufferGeometry();
    hgeo.setAttribute("position", new THREE.Float32BufferAttribute(hPos, 3)); hgeo.setAttribute("uv", new THREE.Float32BufferAttribute(hUv, 2)); hgeo.setAttribute("color", new THREE.Float32BufferAttribute(hCol, 3));
    hgeo.computeVertexNormals();
    const im = new THREE.Mesh(hgeo, new THREE.MeshLambertMaterial({ color: "#ffffff", vertexColors: true, map: leafTex() }));
    if(!low){ im.castShadow = true; im.receiveShadow = true; }
    scene.add(im);
    /* įėjimo arka su žibintais */
    {
      const ax = ox + 6.5 * c, az = oz + n * c + 0.2, wm = MAT.wood2;
      solidBox(ax - 1.75, y - 0.2, az, 0.4, 4.3, 0.4, wm); solidBox(ax + 1.75, y - 0.2, az, 0.4, 4.3, 0.4, wm);
      mesh(box(4.6, 0.35, 0.5), wm, ax, y + 4.2, az); mesh(box(3.6, 0.25, 0.4), MAT.wood, ax, y + 4.65, az);
      const lm = new THREE.MeshLambertMaterial({ color: "#ffe9a8", emissive: "#ffc94d", emissiveIntensity: 0.9 });
      for(const sx of [-1.2, 1.2]){ mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 4), MAT.dark, ax + sx, y + 3.8, az, false); mesh(new THREE.OctahedronGeometry(0.2, 0), lm, ax + sx, y + 3.45, az, false); }
    }
    exR(ox - 6, ox + n * c + 6, oz - 6, oz + n * c + 6);
    W.maze = { ox, oz, walls, segs: segInfo, n, c, y };
    W.mazeStats = decorateMaze(scene, W, low);
    makeChest("leaf", ox + 6.5 * c, oz + 6.5 * c, Math.PI);
  }
  /* ---------- vėjo malūnas ---------- */
  {
    const [x, z] = POI.mill, y = ground(x, z) - 0.3;
    mesh(new THREE.CylinderGeometry(2.4, 3.6, 10, 8), MAT.white, x, y + 5, z);
    mesh(new THREE.ConeGeometry(3.2, 3.2, 8), MAT.roof, x, y + 11.6, z);
    const hub = new THREE.Group(); hub.position.set(x, y + 9.6, z + 2.9); scene.add(hub);
    for(let k = 0; k < 4; k++){ const bl = new THREE.Mesh(new THREE.BoxGeometry(0.9, 6.5, 0.12), MAT.wood2); bl.position.y = 3.4; const a = new THREE.Group(); a.rotation.z = k * Math.PI / 2; a.add(bl); hub.add(a); }
    W.addCircle(x, z, 3.6, -20, 40); exC(x, z, 8);
    W.anim.push((t, dt) => { hub.rotation.z -= dt * 0.6; });
  }
  /* ---------- griuvėsiai prie ežero ---------- */
  {
    const [x, z] = POI.ruins;
    for(let k = 0; k < 7; k++){ const a = k / 7 * Math.PI * 2, cx = x + Math.cos(a) * 7, cz = z + Math.sin(a) * 7, y = ground(cx, cz), hh = [5, 2.2, 4.4, 1.4, 5, 3.1, 0.9][k];
      mesh(new THREE.CylinderGeometry(0.55, 0.65, hh, 8), MAT.stone2, cx, y + hh / 2, cz); W.addCircle(cx, cz, 0.7, y - 1, y + hh); }
    exC(x, z, 12);
  }
  /* ---------- ežeras: tiltas ir svirtis ---------- */
  {
    const yI = 0.55;
    let bx0 = POI.islet[0]; while(ground(bx0, POI.islet[1]) > 0.5 && bx0 < POI.islet[0] + 30) bx0 += 0.5; bx0 -= 1.5;
    let bx1 = bx0 + 3; while(ground(bx1, POI.islet[1]) < 0.5 && bx1 < bx0 + 70) bx1 += 0.5; bx1 += 1.5;
    const bridge = new THREE.Group(); scene.add(bridge);
    const len = bx1 - bx0, nP = Math.ceil(len / 0.8);
    for(let k = 0; k < nP; k++){ const p = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.18, 3.2), k % 2 ? MAT.wood : MAT.wood2); p.position.set(bx0 + 0.4 + k * len / nP, 0, POI.islet[1]); p.rotation.y = (hash(k, 3) - 0.5) * 0.05; bridge.add(p); }
    for(const s of [-1.5, 1.5]){ const r1 = new THREE.Mesh(new THREE.BoxGeometry(len, 0.14, 0.14), MAT.wood); r1.position.set((bx0 + bx1) / 2, 0.95, POI.islet[1] + s); bridge.add(r1); }
    bridge.position.y = -2.4;
    const col = { o: null };
    W.bridge = { g: bridge, x0: bx0, x1: bx1, z: POI.islet[1], up: false, y: yI,
      raise(inst){ this.up = true; if(!col.o) col.o = W.addBox(bx0 - 1, bx1, -3, yI + 0.1, POI.islet[1] - 1.6, POI.islet[1] + 1.6, "bridge"); if(inst) bridge.position.y = yI - 0.1; } };
    W.anim.push((t, dt) => { if(W.bridge.up && bridge.position.y < yI - 0.1) bridge.position.y = Math.min(yI - 0.1, bridge.position.y + dt * 1.2); else if(!W.bridge.up) bridge.position.y = -2.4 + 0.05 * Math.sin(t); });
    /* svirtis rytiniame krante */
    const lx = bx1 + 1.5, lz = POI.islet[1] + 3.2, ly = ground(lx, lz);
    mesh(new THREE.BoxGeometry(1.2, 1.0, 0.8), MAT.stone, lx, ly + 0.5, lz);
    const arm = new THREE.Group(); arm.position.set(lx, ly + 1.0, lz); scene.add(arm);
    const st = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.4, 6), MAT.metal); st.position.y = 0.7; arm.add(st);
    const kn = new THREE.Mesh(new THREE.SphereGeometry(0.17, 8, 6), MAT.red); kn.position.y = 1.4; arm.add(kn);
    arm.rotation.z = 0.6; W.lever = { x: lx, y: ly, z: lz, arm };
    W.addCircle(lx, lz, 0.8, ly - 1, ly + 2.2);
    makeChest("fish", POI.islet[0] - 2, POI.islet[1], Math.PI / 2);
    exC(POI.islet[0], POI.islet[1], 10);
  }
  /* ---------- Erelio uola: akmeniniai stulpai rytuose ---------- */
  {
    const [px, pz] = POI.plateau, n = 20, R0 = 36.6, PW = 2.9;
    const a0 = -4 * Math.PI / 180, a1 = -84 * Math.PI / 180; // nuo rytų (0) link šiaurės
    W.pillars = [];
    const flagM = lam("#ffc61a");
    for(let k = 0; k < n; k++){
      const a = a0 + (a1 - a0) * (n - 1 - k) / (n - 1); // paskutinis stulpas – rytuose
      const cx = px + Math.cos(a) * R0, cz = pz + Math.sin(a) * R0, g = ground(cx, cz);
      const startG = ground(px + Math.cos(a1) * R0, pz + Math.sin(a1) * R0);
      const top = startG + (k + 1) * (PLATEAU_TOP - startG) / n;
      const hh = Math.max(top - g + 0.8, 0.8);
      const cp = k % 5 === 4 && k < n - 1, w = cp ? PW + 0.7 : PW; // kas penktas stulpas – platesnė poilsio aikštelė (grįžimo vieta nukritus)
      mesh(new THREE.BoxGeometry(w, hh, w), cp ? MAT.stone2 : MAT.stone, cx, top - hh / 2, cz); // ašims lygiagretūs – kaip susidūrimai
      W.addBox(cx - w / 2, cx + w / 2, top - hh, top, cz - w / 2, cz + w / 2, "pillar");
      if(cp){ const ox2 = Math.cos(a) * (w / 2 - 0.2), oz2 = Math.sin(a) * (w / 2 - 0.2); mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.6, 5), MAT.wood, cx + ox2, top + 0.8, cz + oz2, false); const fl = mesh(new THREE.BoxGeometry(0.7, 0.4, 0.04), flagM, cx + ox2 + 0.36, top + 1.38, cz + oz2, false); W.anim.push(t => { fl.rotation.y = Math.sin(t * 3 + k) * 0.35; }); }
      W.pillars.push({ x: cx, z: cz, top, cp, half: w / 2 });
    }
    W.pillarStart = [px + Math.cos(a1) * (R0 + 4.5), pz + Math.sin(a1) * (R0 + 4.5)];
    /* paskutinis tiltelis ant viršaus */
    const t = PLATEAU_TOP;
    mesh(new THREE.BoxGeometry(15.4, 0.6, 5), MAT.stone2, px + 30.7, t - 0.3, pz - 1.2);
    W.addBox(px + 23, px + 38.4, t - 0.6, t, pz - 3.7, pz + 1.3, "pillar");
    exC(px, pz, 45);
    makeChest("eagle", px + 3, pz - 4, 0.3);
    W.eagleTop = [px, t, pz];
  }
  /* ---------- urvas ---------- */
  {
    const y = CAVE_Y, cells = new Set();
    const floor = (x0, x1, z0, z1) => { for(let x = x0; x < x1; x++) for(let z = z0; z < z1; z++) cells.add(x + "," + z); };
    floor(-237, -233, 184, 216); floor(-237, -209, 212, 216); floor(-213, -209, 212, 240); floor(-219, -203, 238, 254);
    const isF = (x, z) => cells.has(x + "," + z);
    const wallCells = new Set();
    for(const k of cells){ const [x, z] = k.split(",").map(Number); for(let a = -1; a <= 1; a++) for(let b = -1; b <= 1; b++){ const q = (x + a) + "," + (z + b); if(!cells.has(q) && !(z + b < 184)) wallCells.add(q); } }
    const wallMat = lam("#6f6a72"), roofMat = lam("#7b7480");
    const addRow = (set, h0, h1, mat, tag) => { // sujungiam eilutėmis pagal x
      const byZ = new Map(); for(const k of set){ const [x, z] = k.split(",").map(Number); if(!byZ.has(z)) byZ.set(z, []); byZ.get(z).push(x); }
      const list = [];
      for(const [z, xs] of byZ){ xs.sort((a, b) => a - b); let s = xs[0], p = xs[0]; for(let i = 1; i <= xs.length; i++){ if(i < xs.length && xs[i] === p + 1){ p = xs[i]; continue; } list.push([s, p + 1, z, z + 1]); if(i < xs.length){ s = p = xs[i]; } } }
      const im = new THREE.InstancedMesh(box(1, 1, 1), mat, list.length), mm = new THREE.Matrix4();
      list.forEach(([x0, x1, z0, z1], k) => { mm.makeScale(x1 - x0, h1 - h0, z1 - z0); mm.setPosition((x0 + x1) / 2, (h0 + h1) / 2, (z0 + z1) / 2); im.setMatrixAt(k, mm); if(tag) W.addBox(x0, x1, h0, h1, z0, z1, tag); });
      scene.add(im); return im;
    };
    addRow(wallCells, y - 1, y + 4.4, wallMat, "cave");
    const roofSet = new Set([...cells, ...wallCells]);
    for(const k of [...roofSet]){ const [, z] = k.split(",").map(Number); if(z < 186) roofSet.delete(k); }
    addRow(roofSet, y + 2.9, y + 4.4, roofMat, "cave");
    addRow(cells, y - 0.1, y + 0.03, new THREE.MeshLambertMaterial({ color: "#5d5560" }), null);
    /* uolų kalva aplink */
    const cellList = [...cells].map(c => c.split(",").map(Number));
    const rk = new THREE.DodecahedronGeometry(1, 0);
    const rocks = new THREE.InstancedMesh(rk, lam("#857f88"), 60), mm = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), r = mulberry(55);
    for(let k = 0; k < 60; k++){
      const s = 3 + r() * 4.5;
      let x, z, tries = 0; do { x = CAVE.x0 + 2 + r() * (CAVE.x1 - CAVE.x0 - 4); z = CAVE.z0 + 9 + r() * (CAVE.z1 - CAVE.z0 - 10); tries++; } while(tries < 200 && cellList.some(([a, b]) => Math.hypot(a + 0.5 - x, b + 0.5 - z) < s * 0.95 + 1.6));
      if(tries >= 200) continue; e.set(r() * 3, r() * 3, r() * 3); q.setFromEuler(e); mm.compose(new THREE.Vector3(x, y + s * 0.5, z), q, new THREE.Vector3(s, s * (0.8 + r() * 0.6), s)); rocks.setMatrixAt(k, mm);
      W.addCircle(x, z, s * 0.75, y - 2, y + s * 1.4);
    }
    if(!low){ rocks.castShadow = true; rocks.receiveShadow = true; }
    scene.add(rocks);
    /* užvirtęs medis prie angos */
    const log = mesh(new THREE.CylinderGeometry(0.32, 0.36, 6.2, 7), MAT.wood, -235, y + 1.6, 184.6); log.rotation.z = Math.PI / 2 + 0.04;
    for(let k = 0; k < 3; k++){ const br = mesh(new THREE.CylinderGeometry(0.06, 0.1, 1.4, 5), MAT.wood, -237.5 + k * 2.2, y + 2.1, 184.6); br.rotation.z = 0.6 - k * 0.5; }
    W.addBox(-238, -232, y + 1.28, y + 1.95, 184.1, 185.1, "log");
    /* švytintys grybai ir kristalai */
    const gm = new THREE.MeshBasicMaterial({ color: "#c58bff" }), gm2 = new THREE.MeshBasicMaterial({ color: "#7fe0ff" });
    const glowM = new THREE.SpriteMaterial({ map: glowTex(), color: "#b37dff", transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const spots = [[-236.3, 192], [-233.6, 200], [-236.4, 207], [-230, 214.6], [-222, 212.5], [-212.6, 220], [-209.6, 229], [-212.5, 236], [-218.4, 240], [-203.6, 246], [-218.2, 252.8], [-206, 253.2], [-210, 239]];
    spots.forEach(([sx, sz], k) => { const s = 0.5 + hash(k, 9) * 0.5;
      const st = mesh(new THREE.CylinderGeometry(0.06 * s * 2, 0.08 * s * 2, 0.5 * s, 5), MAT.white, sx, y + 0.25 * s, sz, false);
      const cap = mesh(new THREE.SphereGeometry(0.32 * s, 7, 4, 0, Math.PI * 2, 0, Math.PI / 2), k % 3 ? gm : gm2, sx, y + 0.5 * s, sz, false);
      const sp = new THREE.Sprite(glowM); sp.scale.set(2.2, 2.2, 1); sp.position.set(sx, y + 0.6, sz); scene.add(sp); });
    W.cave = { y, inside: (x, z) => x > -240 && x < -200 && z > 186 && z < 256, cells };
    makeChest("mushroom", -211, 249, Math.PI);
  }
  /* ---------- slibino vartai ---------- */
  {
    const [x, z] = POI.gate, y = GATE_Y - 0.5;
    const pillarM = lam("#6d6873"), lintM = lam("#7b7682");
    solidBox(x - 7.5, y, z, 4, 15, 4.5, pillarM); solidBox(x + 7.5, y, z, 4, 15, 4.5, pillarM);
    mesh(box(20, 3.6, 5), lintM, x, y + 16.6, z); W.addBox(x - 10, x + 10, y + 14.8, y + 18.4, z - 2.5, z + 2.5);
    /* uolų sienos šonuose */
    for(const s of [-1, 1]) for(let k = 0; k < 6; k++){ const rx = x + s * (13 + k * 6.5), rz = z - 2 - k * 2.5, rr = 6 + hash(k, s + 5) * 3; const rm = mesh(new THREE.DodecahedronGeometry(rr, 0), lam("#7d7883"), rx, ground(rx, rz) + rr * 0.6, rz); rm.scale.y = 1.4; W.addCircle(rx, rz, rr * 0.9, -20, 80); }
    mesh(box(11, 13.5, 1), lam("#2a2530"), x, y + 6.75, z - 1.6, false);
    const doors = [];
    for(const s of [-1, 1]){ const piv = new THREE.Group(); piv.position.set(x + s * 5.5, y, z + 0.4); scene.add(piv);
      const d = new THREE.Mesh(box(5.4, 13, 0.6), MAT.wood); d.position.set(-s * 2.7, 6.5, 0); piv.add(d);
      for(let k = 0; k < 3; k++){ const band = new THREE.Mesh(box(5.5, 0.35, 0.7), MAT.dark); band.position.set(-s * 2.7, 2.5 + k * 4, 0); piv.add(band); }
      doors.push(piv); }
    const doorCol = W.addBox(x - 5.5, x + 5.5, y, y + 13, z - 0.2, z + 1.0, "door");
    /* penki lizdai ant sąramos */
    const sockets = {};
    ["shell", "leaf", "mushroom", "eagle", "fish"].forEach((id, k) => {
      const sx = x - 6 + k * 3, sy = y + 16.6, sz = z + 2.56;
      const plate = mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.2, 6), MAT.dark, sx, sy, sz, false); plate.rotation.x = Math.PI / 2;
      const ring = mesh(new THREE.TorusGeometry(0.85, 0.09, 4, 6), new THREE.MeshBasicMaterial({ color: CRYS[id] }), sx, sy, sz + 0.12, false);
      const cr = mesh(new THREE.OctahedronGeometry(0.55, 0), new THREE.MeshLambertMaterial({ color: CRYS[id], emissive: CRYS[id], emissiveIntensity: 0.8, flatShading: true }), sx, sy, sz + 0.35, false);
      cr.visible = false; sockets[id] = cr; });
    W.gate = { x, y, z, doors, doorCol, sockets, open: false, opening: 0 };
    W.anim.push((t, dt) => { const G = W.gate; if(G.open && G.opening < 1){ G.opening = Math.min(1, G.opening + dt * 0.35); }
      G.doors[0].rotation.y = -G.opening * 1.75; G.doors[1].rotation.y = G.opening * 1.75;
      for(const id in G.sockets) if(G.sockets[id].visible) G.sockets[id].rotation.z = t * 1.2; });
    exC(x, z + 12, 30);
  }
  /* ---------- auginiai: medžiai, akmenys, žolė ---------- */
  exC(START[0], START[1], 14);
  exR(CAVE.x0 - 4, CAVE.x1 + 4, CAVE.z0 - 8, CAVE.z1 + 4);
  {
    const pines = [], broads = [], rocks = [], bushes = [];
    const dens = low ? 0.72 : 1;
    for(let x = -460; x < 460; x += 6.5) for(let z = -460; z < 460; z += 6.5){
      const px = x + (rng() - 0.5) * 6, pz = z + (rng() - 0.5) * 6, h = ground(px, pz);
      if(h < 2.4 || h > 72) continue;
      const slope = Math.abs(ground(px + 1.5, pz) - h) + Math.abs(ground(px, pz + 1.5) - h);
      const forest = fbm(px * 0.0085 + 40, pz * 0.0085 - 13, 3);
      if(W.pathDist(px, pz) < 4.5 || !isFree(px, pz, 1.5)) continue;
      const rr = rng();
      if(slope > 2.4){ if(rr < 0.08) rocks.push([px, pz, h]); continue; }
      if(forest > 0.56 && rr < 0.72 * dens || rr < 0.035 * dens){
        (h > 26 || forest > 0.63 ? pines : broads).push([px, pz, h, 0.75 + rng() * 0.6]);
      } else if(rr < 0.06) rocks.push([px, pz, h]);
      else if(rr < 0.1) bushes.push([px, pz, h]);
    }
    const mm = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), sc = new THREE.Vector3(), col = new THREE.Color();
    const inst = (geo, mat, list, f) => { const im = new THREE.InstancedMesh(geo, mat, list.length); list.forEach((it, k) => { f(it, k); im.setMatrixAt(k, mm); }); if(!low){ im.castShadow = true; } scene.add(im); return im; };
    /* eglės: kamienas + trys kūgiai */
    const trunkG = new THREE.CylinderGeometry(0.22, 0.32, 1, 5); trunkG.translate(0, 0.5, 0);
    inst(trunkG, MAT.wood, pines.concat(broads), ([x, z, h, s]) => { mm.compose(v.set(x, h - 0.2, z), q.identity(), sc.set(s, s * 2.6, s)); });
    const pineG = (() => { const parts = []; for(let k = 0; k < 3; k++){ const c = new THREE.ConeGeometry(2.1 - k * 0.55, 2.6, 7); c.translate(0, 2.6 + k * 1.45, 0); parts.push(c); } return mergeGeos(parts); })();
    const pineIm = inst(pineG, lam("#ffffff"), pines, ([x, z, h, s], k) => { e.set(0, hash(k, 1) * 6, 0); q.setFromEuler(e); mm.compose(v.set(x, h, z), q, sc.set(s, s * (1 + hash(k, 2) * 0.35), s)); });
    pines.forEach((_, k) => pineIm.setColorAt(k, col.setHSL(0.38 + hash(k, 4) * 0.05, 0.45, 0.3 + hash(k, 5) * 0.08)));
    const crownG = new THREE.IcosahedronGeometry(2.3, 0); crownG.translate(0, 4.3, 0);
    const brIm = inst(crownG, lam("#ffffff"), broads, ([x, z, h, s], k) => { e.set(hash(k, 7), hash(k, 1) * 6, 0); q.setFromEuler(e); mm.compose(v.set(x, h, z), q, sc.set(s * 1.1, s * (0.9 + hash(k, 3) * 0.4), s * 1.1)); });
    broads.forEach((_, k) => brIm.setColorAt(k, col.setHSL(0.24 + hash(k, 4) * 0.08, 0.5, 0.38 + hash(k, 5) * 0.1)));
    pines.concat(broads).forEach(([x, z, h, s]) => W.addCircle(x, z, 0.45 * s, h - 2, h + 9));
    const rockG = new THREE.DodecahedronGeometry(1, 0);
    const rIm = inst(rockG, lam("#9a979e"), rocks, ([x, z, h], k) => { const s = 0.8 + hash(k, 8) * 2.2; e.set(hash(k, 1) * 3, hash(k, 2) * 3, 0); q.setFromEuler(e); mm.compose(v.set(x, h + s * 0.25, z), q, sc.set(s, s * 0.7, s * 1.1)); if(s > 1.6) W.addCircle(x, z, s * 0.85, h - 2, h + s); });
    rIm.receiveShadow = !low;
    const bushG = new THREE.IcosahedronGeometry(1, 0); bushG.translate(0, 0.55, 0);
    const bIm = inst(bushG, lam("#ffffff"), bushes, ([x, z, h], k) => { const s = 0.7 + hash(k, 3) * 0.7; mm.compose(v.set(x, h, z), q.identity(), sc.set(s * 1.3, s, s * 1.2)); });
    bushes.forEach((_, k) => bIm.setColorAt(k, col.setHSL(0.27 + hash(k, 6) * 0.06, 0.48, 0.34 + hash(k, 9) * 0.08)));
    /* žolės kuokšteliai ir gėlės (be susidūrimų) */
    const nG = low ? 2600 : 7000, gr = [], fl = [];
    for(let k = 0; k < nG * 3 && gr.length < nG; k++){ const x = (rng() - 0.5) * 860, z = (rng() - 0.5) * 860, h = ground(x, z); if(h < 2.6 || h > 45 || !isFree(x, z, 0.5) || W.pathDist(x, z) < 2) continue; if(Math.abs(ground(x + 1, z) - h) > 0.6) continue; (rng() < 0.12 ? fl : gr).push([x, z, h]); }
    const grassG = (() => { const parts = []; for(let k = 0; k < 3; k++){ const c = new THREE.ConeGeometry(0.09, 0.7, 3); c.translate(0, 0.33, 0); c.rotateZ((k - 1) * 0.35); c.rotateY(k * 2.1); parts.push(c); } return mergeGeos(parts); })();
    const gIm = new THREE.InstancedMesh(grassG, lam("#ffffff"), gr.length);
    gr.forEach(([x, z, h], k) => { e.set(0, hash(k, 3) * 6, 0); q.setFromEuler(e); const s = 0.7 + hash(k, 4) * 0.8; mm.compose(v.set(x, h - 0.05, z), q, sc.set(s, s, s)); gIm.setMatrixAt(k, mm); gIm.setColorAt(k, col.setHSL(0.25 + hash(k, 5) * 0.06, 0.5, 0.4 + hash(k, 6) * 0.1)); });
    scene.add(gIm);
    const flG = new THREE.IcosahedronGeometry(0.16, 0); flG.translate(0, 0.35, 0);
    const fIm = new THREE.InstancedMesh(flG, new THREE.MeshLambertMaterial({ color: "#ffffff" }), fl.length);
    const FC = ["#ffd84d", "#ff7aa8", "#ffffff", "#b38cff", "#ff8a3d"];
    fl.forEach(([x, z, h], k) => { mm.makeTranslation(x, h, z); fIm.setMatrixAt(k, mm); fIm.setColorAt(k, col.set(FC[k % FC.length])); });
    scene.add(fIm);
    W.counts = { pines: pines.length, broads: broads.length, rocks: rocks.length, grass: gr.length };
  }
  /* ---------- debesys ---------- */
  {
    const cg = new THREE.IcosahedronGeometry(1, 0), cm = new THREE.MeshLambertMaterial({ color: "#ffffff", flatShading: true, emissive: "#d9e6f2", emissiveIntensity: 0.4 });
    const clouds = new THREE.Group(); scene.add(clouds);
    for(let k = 0; k < 22; k++){ const c = new THREE.Group(); const n = 3 + Math.floor(rng() * 3);
      for(let i = 0; i < n; i++){ const m = new THREE.Mesh(cg, cm); const s = 8 + rng() * 9; m.scale.set(s * 1.4, s * 0.7, s); m.position.set(i * 10 - n * 5, rng() * 4, rng() * 8 - 4); c.add(m); }
      c.position.set((rng() - 0.5) * 1100, 130 + rng() * 50, (rng() - 0.5) * 1100); clouds.add(c); }
    W.anim.push((t, dt) => { clouds.position.x = (t * 1.5) % 200 - 100; });
  }
  addWildlife(scene, W, [[START[0], START[1] - 22], POI.cross, [POI.mill[0] + 10, POI.mill[1] + 14], [POI.maze[0], POI.maze[1] + 44], [POI.ruins[0], POI.ruins[1] + 12]], LIGHT, low);
  return W;
}

/* ---------- pagalbinės ---------- */
let _glow = null;
export function glowTex(){
  if(_glow) return _glow;
  const c = document.createElement("canvas"); c.width = c.height = 64; const x = c.getContext("2d");
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.35, "rgba(255,255,255,.45)"); g.addColorStop(1, "rgba(255,255,255,0)");
  x.fillStyle = g; x.fillRect(0, 0, 64, 64); _glow = new THREE.CanvasTexture(c); return _glow;
}
export function mergeGeos(list){
  const geos = list.map(g => g.index ? g.toNonIndexed() : g);
  let n = 0; geos.forEach(g => n += g.attributes.position.count);
  const pos = new Float32Array(n * 3); let o = 0;
  geos.forEach(g => { pos.set(g.attributes.position.array, o); o += g.attributes.position.array.length; });
  const out = new THREE.BufferGeometry(); out.setAttribute("position", new THREE.BufferAttribute(pos, 3)); out.computeVertexNormals(); return out;
}

/* ===================== slibinas ===================== */
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
function bone(a, b, r0, r1, mat){ const d = b.clone().sub(a), L = d.length(); const g = new THREE.CylinderGeometry(r1, r0, L, 6); g.translate(0, L / 2, 0);
  const m = new THREE.Mesh(g, mat); m.position.copy(a); m.quaternion.setFromUnitVectors(V3(0, 1, 0), d.normalize()); m.castShadow = true; return m; }
export function makeDragon(c){
  const lam = (col, o) => new THREE.MeshLambertMaterial(Object.assign({ color: col }, o || {}));
  const M = { body: lam(c.body, { flatShading: true }), belly: lam(c.belly, { flatShading: true }), wing: lam(c.wing, { side: THREE.DoubleSide }), horn: lam(c.horn, { flatShading: true }),
    eye: new THREE.MeshBasicMaterial({ color: c.eye || "#fff6b0" }), pupil: new THREE.MeshBasicMaterial({ color: "#121a33" }), dark: lam("#2a2530"), tooth: lam("#fffaf0") };
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const add = (geo, mat, x, y, z, p) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; (p || body).add(m); return m; };
  /* liemuo */
  const torso = add(new THREE.SphereGeometry(1, 10, 8), M.body, 0, 2.05, 0); torso.scale.set(1.15, 1.0, 1.75);
  const bel = add(new THREE.SphereGeometry(1, 10, 8), M.belly, 0, 1.78, 0.35); bel.scale.set(0.92, 0.78, 1.45);
  const chest = add(new THREE.SphereGeometry(0.85, 9, 7), M.belly, 0, 2.15, 1.45); chest.scale.set(1, 1.05, 0.9);
  /* kojos */
  for(const [sx, sz, big] of [[-1, 1.05, 0], [1, 1.05, 0], [-1, -0.95, 1], [1, -0.95, 1]]){
    const r = big ? 0.62 : 0.48;
    add(new THREE.SphereGeometry(r, 8, 6), M.body, sx * 0.88, 1.65, sz);
    body.add(bone(V3(sx * 0.95, 1.6, sz), V3(sx * 1.0, 0.35, sz + (big ? -0.15 : 0.2)), r * 0.62, r * 0.45, M.body));
    add(new THREE.BoxGeometry(0.62, 0.32, 0.86), M.body, sx * 1.0, 0.16, sz + (big ? 0.05 : 0.38));
    for(let k = -1; k <= 1; k++){ const cl = add(new THREE.ConeGeometry(0.08, 0.32, 4), M.horn, sx * 1.0 + k * 0.2, 0.12, sz + (big ? 0.5 : 0.85)); cl.rotation.x = Math.PI / 2; }
  }
  /* nugaros spygliai */
  for(let k = 0; k < 7; k++){ const sp = add(new THREE.ConeGeometry(0.2 - k * 0.012, 0.55, 4), M.horn, 0, 3.0 - Math.abs(k - 2) * 0.06, 1.2 - k * 0.48); sp.rotation.x = -0.35; }
  /* uodega */
  const tail = new THREE.Group(); tail.position.set(0, 1.95, -1.6); body.add(tail);
  let parent = tail; const tailSeg = [];
  for(let k = 0; k < 7; k++){ const sgm = new THREE.Group(); sgm.position.z = k ? -0.82 : 0; sgm.rotation.x = k ? 0.07 : -0.5; parent.add(sgm);
    const m = add(new THREE.CylinderGeometry(0.48 - k * 0.058, 0.42 - k * 0.055, 0.95, 7), M.body, 0, 0, -0.42, sgm); m.rotation.x = Math.PI / 2;
    if(k < 6){ const sp = add(new THREE.ConeGeometry(0.13 - k * 0.012, 0.34, 4), M.horn, 0, 0.42 - k * 0.04, -0.4, sgm); sp.rotation.x = -0.4; }
    tailSeg.push(sgm); parent = sgm; }
  const tip = add(new THREE.ConeGeometry(0.42, 0.9, 3), M.horn, 0, 0, -1.05, parent); tip.rotation.x = -Math.PI / 2; tip.scale.set(1.7, 1, 0.35);
  /* kaklas */
  const neck = new THREE.Group(); neck.position.set(0, 2.45, 1.55); body.add(neck);
  const curve = new THREE.CatmullRomCurve3([V3(0, -0.2, -0.2), V3(0, 0.5, 0.45), V3(0, 1.35, 0.85), V3(0, 2.05, 1.05)]);
  const nm = new THREE.Mesh(new THREE.TubeGeometry(curve, 10, 0.44, 8), M.body); nm.castShadow = true; neck.add(nm);
  const nb = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V3(0, -0.3, 0.1), V3(0, 0.45, 0.72), V3(0, 1.25, 1.1), V3(0, 1.85, 1.3)]), 8, 0.28, 6), M.belly); neck.add(nb);
  for(let k = 0; k < 4; k++){ const pt = curve.getPoint(0.15 + k * 0.22); const sp = add(new THREE.ConeGeometry(0.13, 0.4, 4), M.horn, 0, pt.y + 0.4, pt.z - 0.18, neck); sp.rotation.x = -0.6; }
  /* galva */
  const head = new THREE.Group(); head.position.set(0, 2.15, 1.15); neck.add(head);
  const skull = add(new THREE.SphereGeometry(0.62, 9, 7), M.body, 0, 0.05, 0, head); skull.scale.set(1, 0.85, 1.05);
  add(new THREE.BoxGeometry(0.66, 0.44, 0.95), M.body, 0, -0.05, 0.78, head);
  add(new THREE.BoxGeometry(0.5, 0.16, 0.55), M.body, 0, 0.2, 0.62, head);
  const jaw = new THREE.Group(); jaw.position.set(0, -0.26, 0.25); head.add(jaw);
  add(new THREE.BoxGeometry(0.58, 0.18, 1.02), M.belly, 0, -0.05, 0.55, jaw);
  const eyes = [];
  for(const s of [-1, 1]){
    const e = add(new THREE.SphereGeometry(0.17, 8, 6), M.eye, s * 0.36, 0.2, 0.36, head); eyes.push(e);
    add(new THREE.SphereGeometry(0.085, 6, 5), M.pupil, s * 0.45, 0.21, 0.44, head);
    add(new THREE.BoxGeometry(0.26, 0.08, 0.22), M.body, s * 0.34, 0.37, 0.38, head).rotation.z = -s * 0.25;
    const h = add(new THREE.ConeGeometry(0.13, 0.95, 5), M.horn, s * 0.3, 0.42, -0.3, head); h.rotation.set(-1.05, 0, -s * 0.22);
    const fr = add(new THREE.ConeGeometry(0.1, 0.45, 4), M.horn, s * 0.58, -0.05, -0.12, head); fr.rotation.set(-0.6, 0, -s * 1.2);
    add(new THREE.SphereGeometry(0.055, 5, 4), M.dark, s * 0.15, 0.08, 1.26, head);
    for(let k = 0; k < 3; k++){ const t = add(new THREE.ConeGeometry(0.045, 0.16, 4), M.tooth, s * 0.27, -0.27, 0.62 + k * 0.22, head); t.rotation.x = Math.PI; }
  }
  /* sparnai */
  const wings = [];
  for(const s of [-1, 1]){
    const w = new THREE.Group(); w.position.set(s * 0.75, 2.75, 0.65); body.add(w);
    const A = V3(0, 0, 0), B = V3(s * 1.6, 1.15, -0.25), C = V3(s * 3.0, 1.75, -0.55), D = V3(s * 4.7, 1.25, -1.0), E = V3(s * 4.1, 0.25, -2.0), Fp = V3(s * 2.6, -0.35, -2.35), G = V3(s * 0.25, -0.35, -1.75);
    w.add(bone(A, B, 0.16, 0.12, M.horn), bone(B, C, 0.12, 0.09, M.horn), bone(C, D, 0.07, 0.03, M.horn), bone(C, E, 0.07, 0.03, M.horn), bone(C, Fp, 0.06, 0.03, M.horn));
    const tri = [A, B, G, B, C, G, C, Fp, G, C, E, Fp, C, D, E], pos = [];
    for(const v of tri) pos.push(v.x, v.y, v.z);
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals();
    const mem = new THREE.Mesh(g, M.wing); mem.castShadow = true; w.add(mem);
    const cl = add(new THREE.ConeGeometry(0.07, 0.3, 4), M.horn, C.x, C.y + 0.2, C.z, w);
    wings.push(w);
  }
  root.userData = { body, neck, head, jaw, wings, tailSeg, torso, eyes };
  return root;
}
export function animateDragon(d, t, o){
  const u = d.userData, s = o.fly ? 7 : 1.5;
  u.wings.forEach((w, i) => { const k = i ? 1 : -1;
    const a = o.sleep ? -0.55 : o.fly ? 0.15 + 0.85 * Math.sin(t * s) : 0.05 + 0.12 * Math.sin(t * s);
    w.rotation.z = k * a; w.rotation.y = k * (o.sleep ? 0.9 : 0.25); w.rotation.x = o.sleep ? 0.2 : 0; });
  u.torso.scale.y = 1.0 + 0.035 * Math.sin(t * 2.1);
  const nx = o.sleep ? 0.95 : o.roar ? -0.25 : 0.05 * Math.sin(t * 1.1);
  u.neck.rotation.x = nx; u.neck.rotation.y = o.sleep ? 0.35 : 0.1 * Math.sin(t * 0.7);
  u.head.rotation.x = (o.sleep ? 0.2 : o.roar ? -0.15 : 0.12) - nx * 0.6 + 0.03 * Math.sin(t * 1.7);
  u.jaw.rotation.x = o.roar ? 0.6 : o.sleep ? 0 : 0.04 + 0.03 * Math.sin(t * 3);
  u.eyes.forEach(e => e.scale.y = o.sleep ? 0.15 : (Math.sin(t * 0.9) > 0.97 ? 0.2 : 1));
  u.tailSeg.forEach((g, k) => { g.rotation.y = 0.16 * Math.sin(t * 1.3 - k * 0.6); });
  u.body.rotation.z = o.hit ? 0.1 * Math.sin(t * 40) * o.hit : 0;
  u.body.position.y = o.sleep ? -0.5 : 0;
}
