/* Slibino sala – nuotykių priedai: pasiklydęs nykštukas (kardas), senas dviratis, parašiutas, nakties vilkai.
   Viskas piešiama kodu (savi modeliai). */
import * as THREE from "./three.module.min.js";
import { glowTex, POI, PLATEAU_TOP } from "./sala-pasaulis.js";

const lam = (col, o) => new THREE.MeshLambertMaterial(Object.assign({ color: col, flatShading: true }, o || {}));
const basic = col => new THREE.MeshBasicMaterial({ color: col });
const glowS = (col, s) => { const g = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), color: col, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); g.scale.set(s, s, 1); return g; };
const mesh = (g, m, x, y, z, par) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); par.add(o); return o; };

function gnome(){
  const g = new THREE.Group(), blue = lam("#3f78d8"), skin = lam("#f2c9a0"), red = lam("#d8443a"), white = lam("#f4f1ea"), dark = lam("#2a2530");
  mesh(new THREE.CylinderGeometry(0.32, 0.4, 0.7, 8), blue, 0, 0.55, 0, g); mesh(new THREE.SphereGeometry(0.3, 10, 8), skin, 0, 1.12, 0, g);
  mesh(new THREE.ConeGeometry(0.34, 0.9, 8), red, 0, 1.75, 0, g).rotation.z = 0.12;
  mesh(new THREE.ConeGeometry(0.27, 0.6, 7), white, 0, 0.82, 0.16, g).rotation.x = Math.PI; mesh(new THREE.SphereGeometry(0.07, 6, 5), lam("#f29bb8"), 0, 1.1, 0.3, g);
  for(const s of [-1, 1]){ mesh(new THREE.SphereGeometry(0.05, 8, 6), basic("#fff"), s * 0.11, 1.2, 0.26, g); mesh(new THREE.SphereGeometry(0.025, 6, 5), basic("#121a33"), s * 0.11, 1.2, 0.3, g);
    mesh(new THREE.BoxGeometry(0.2, 0.2, 0.34), dark, s * 0.16, 0.1, 0.06, g); mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.5, 6), blue, s * 0.42, 0.62, 0, g).rotation.z = s * 0.5; }
  /* žibintas rankoje – kad būtų matomas ir sutemus */
  mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.2, 6), basic("#ffe2a8"), 0.62, 0.5, 0.1, g); const gl = glowS("#ffcf8a", 2.2); gl.position.set(0.62, 0.5, 0.1); g.add(gl);
  return g;
}
function wolf(){
  const g = new THREE.Group(), fur = lam("#6f7480"), fur2 = lam("#4d515b"), light = lam("#c9ccd4");
  const b = mesh(new THREE.BoxGeometry(0.46, 0.5, 1.15), fur, 0, 0.78, 0, g); mesh(new THREE.BoxGeometry(0.4, 0.3, 0.9), light, 0, 0.6, 0.02, g);
  const head = new THREE.Group(); head.position.set(0, 1.02, 0.66); g.add(head);
  mesh(new THREE.BoxGeometry(0.4, 0.38, 0.4), fur, 0, 0, 0, head); mesh(new THREE.BoxGeometry(0.2, 0.18, 0.34), light, 0, -0.08, 0.32, head); mesh(new THREE.BoxGeometry(0.1, 0.08, 0.06), lam("#1b1722"), 0, -0.02, 0.5, head);
  for(const s of [-1, 1]){ mesh(new THREE.ConeGeometry(0.09, 0.22, 4), fur2, s * 0.13, 0.28, -0.08, head); mesh(new THREE.SphereGeometry(0.045, 6, 5), basic("#ffd23a"), s * 0.11, 0.06, 0.2, head); }
  const tail = mesh(new THREE.ConeGeometry(0.12, 0.7, 5), fur2, 0, 0.85, -0.85, g); tail.rotation.x = -2.0;
  const legs = []; for(const [x, z] of [[-0.16, 0.42], [0.16, 0.42], [-0.16, -0.42], [0.16, -0.42]]){ const l = new THREE.Group(); l.position.set(x, 0.56, z); mesh(new THREE.BoxGeometry(0.13, 0.58, 0.14), fur2, 0, -0.28, 0, l); g.add(l); legs.push(l); }
  g.userData = { legs, head, tail }; return g;
}
function bike(){
  const g = new THREE.Group(), rust = lam("#a8552f"), dark = lam("#2a2530"), steel = lam("#9aa3b2");
  for(const z of [-0.55, 0.55]){ const w = mesh(new THREE.TorusGeometry(0.34, 0.04, 6, 18), dark, 0, 0.38, z, g); w.rotation.y = Math.PI / 2; const h = mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.66, 4), steel, 0, 0.38, z, g); h.rotation.x = Math.PI / 2; mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.66, 4), steel, 0, 0.38, z, g); }
  const bar = (x0, y0, z0, x1, y1, z1, m) => { const a = new THREE.Vector3(x0, y0, z0), b = new THREE.Vector3(x1, y1, z1), d = b.clone().sub(a), o = mesh(new THREE.CylinderGeometry(0.03, 0.03, d.length(), 5), m || rust, 0, 0, 0, g); o.position.copy(a).add(b).multiplyScalar(0.5); o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); };
  bar(0, 0.38, -0.55, 0, 0.8, -0.2); bar(0, 0.8, -0.2, 0, 0.85, 0.4); bar(0, 0.38, -0.55, 0, 0.4, 0); bar(0, 0.4, 0, 0, 0.8, -0.2); bar(0, 0.4, 0, 0, 0.85, 0.4); bar(0, 0.38, 0.55, 0, 1.02, 0.36); bar(-0.28, 1.02, 0.36, 0.28, 1.02, 0.36, dark);
  mesh(new THREE.BoxGeometry(0.16, 0.06, 0.3), dark, 0, 0.9, -0.24, g);
  return g;
}
function pack(){
  const g = new THREE.Group(); mesh(new THREE.BoxGeometry(0.6, 0.7, 0.4), lam("#ff8a2a"), 0, 0.35, 0, g); mesh(new THREE.BoxGeometry(0.64, 0.14, 0.44), lam("#fff6e0"), 0, 0.45, 0, g);
  for(const s of [-1, 1]) mesh(new THREE.BoxGeometry(0.08, 0.6, 0.06), lam("#6f4520"), s * 0.18, 0.36, 0.22, g);
  const gl = glowS("#ffd23a", 2.4); gl.position.y = 1.1; g.add(gl); return g;
}

export function addAdventure(scene, W, camera){
  const A = {};
  const put = (g, x, z, ry) => { g.position.set(x, W.terrain(x, z), z); g.rotation.y = ry || 0; scene.add(g); return { g, x, z }; };
  A.gnome = put(gnome(), POI.cross[0] + 6, POI.cross[1] + 5, -2.2); W.addCircle(A.gnome.x, A.gnome.z, 0.55, A.gnome.g.position.y - 1, A.gnome.g.position.y + 2.2);
  A.bike = put(bike(), POI.mill[0] + 9, POI.mill[1] + 9, 0.7); A.bike.g.rotation.z = 0.22;
  { const gl = glowS("#ffd23a", 2.2); gl.position.y = 1.5; A.bike.g.add(gl); }
  A.pack = put(pack(), POI.plateau[0] + 14, POI.plateau[1] + 7, 0.4); A.pack.g.position.y = Math.max(A.pack.g.position.y, PLATEAU_TOP - 0.2);
  A.wolves = [0, 1, 2].map(k => { const g = wolf(); g.visible = false; g.scale.setScalar(1.15); scene.add(g); return { g, x: 0, z: 0, on: false, flee: 0, t: k * 2 }; });
  /* parašiutas virš galvos */
  A.canopy = new THREE.Group();
  { const g = new THREE.SphereGeometry(2.6, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), cols = [], c1 = new THREE.Color("#ff8a2a"), c2 = new THREE.Color("#fff6e0");
    for(let i = 0; i < g.attributes.position.count; i++){ const a = Math.atan2(g.attributes.position.getZ(i), g.attributes.position.getX(i)), c = Math.floor((a + Math.PI) / (Math.PI / 4)) % 2 ? c1 : c2; cols.push(c.r, c.g, c.b); }
    g.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide, fog: false })); m.position.y = 3.6; m.scale.y = 0.6; A.canopy.add(m);
    const pts = []; for(let k = 0; k < 8; k++){ const a = k * Math.PI / 4; pts.push(Math.cos(a) * 2.5, 3.6, Math.sin(a) * 2.5, 0, 1.9, 0); }
    const lg = new THREE.BufferGeometry(); lg.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3)); A.canopy.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: "#f4f1ea" }))); }
  A.canopy.visible = false; scene.add(A.canopy);
  /* kardas ir dviračio vairas – matomi žaidėjo akimis */
  A.sword = new THREE.Group();
  mesh(new THREE.BoxGeometry(0.05, 0.62, 0.012), basic("#e6ecf5"), 0, 0.36, 0, A.sword); mesh(new THREE.BoxGeometry(0.2, 0.035, 0.04), basic("#c9a23f"), 0, 0.04, 0, A.sword); mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.13, 6), basic("#6f4520"), 0, -0.04, 0, A.sword);
  A.sword.scale.setScalar(0.6); A.sword.position.set(0.36, -0.34, -0.7); A.sword.visible = false; camera.add(A.sword);
  A.bars = new THREE.Group();
  { const b = mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.8, 6), basic("#2a2530"), 0, 0, 0, A.bars); b.rotation.z = Math.PI / 2; mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3, 6), basic("#a8552f"), 0, -0.14, 0.02, A.bars);
    for(const s of [-1, 1]){ const h = mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.16, 6), basic("#6f4520"), s * 0.36, 0, 0, A.bars); h.rotation.z = Math.PI / 2; } }
  A.bars.position.set(0, -0.42, -0.62); A.bars.visible = false; camera.add(A.bars);
  return A;
}
/* nykštuko loginė mįslė: trys skrynelės, tik vienas užrašas teisingas; sprendinio vienatinumas tikrinamas kodu */
let lastSig = "";
export function gnomePuzzle(G){
  for(let tries = 0; tries < 500; tries++){
    const st = [0, 1, 2].map(i => { const k = Math.floor(Math.random() * 4), o = (i + 1 + Math.floor(Math.random() * 2)) % 3;
      return k === 0 ? { k, o: i, txt: G.here, f: s => s === i } : k === 1 ? { k, o: i, txt: G.notHere, f: s => s !== i } : k === 2 ? { k, o, txt: G.inX(G.boxIn[o]), f: s => s === o } : { k, o, txt: G.notInX(G.boxIn[o]), f: s => s !== o }; });
    const cnt = [0, 1, 2].map(s => st.filter(q => q.f(s)).length), sol = [0, 1, 2].filter(s => cnt[s] === 1), sig = st.map(q => (q.k % 2) + "" + q.o).join("-");
    if(sol.length !== 1 || sig === lastSig || new Set(st.map(q => (q.k % 2) + "" + q.o)).size < 3 || st.every(q => q.k % 2 === st[0].k % 2)) continue;
    lastSig = sig; return { st, cnt, a: sol[0] };
  }
  return null;
}
