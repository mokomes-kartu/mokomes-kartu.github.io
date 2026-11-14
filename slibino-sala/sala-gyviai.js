/* Slibino sala – papuošimai ir gyviai: tekstūros (lapai, žolė, vanduo), labirinto vijokliai su gėlėmis,
   voverės ir paukščiukai ant gyvatvorių, boružės ant sienų, drugeliai, žuvėdros. Viskas piešiama kodu (savi modeliai). */
import * as THREE from "./three.module.min.js";

function rngF(a){ return function(){ a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

/* ---------- tekstūros ---------- */
function canvasTex(size, draw, rep){
  const c = document.createElement("canvas"); c.width = c.height = size; draw(c.getContext("2d"), size);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  if(rep) t.repeat.set(rep, rep); return t;
}
/* gyvatvorės lapija: daug mažų lapelių keliais žalios atspalviais */
export function leafTex(){
  return canvasTex(256, (x, S) => {
    const r = rngF(91); x.fillStyle = "#2f6f2c"; x.fillRect(0, 0, S, S);
    const cols = ["#3c8a36", "#4ea043", "#2a6427", "#5fb24f", "#377f33", "#6cc05a", "#255a24"];
    for(let k = 0; k < 900; k++){
      const px = r() * S, py = r() * S, a = r() * Math.PI, w = 5 + r() * 6, h = 2.5 + r() * 3;
      x.fillStyle = cols[Math.floor(r() * cols.length)];
      for(const [ox, oy] of [[0, 0], [S, 0], [-S, 0], [0, S], [0, -S]]){ x.beginPath(); x.ellipse(px + ox, py + oy, w, h, a, 0, 7); x.fill(); }
    }
    for(let k = 0; k < 260; k++){ x.fillStyle = "rgba(20,50,20,.35)"; x.beginPath(); x.arc(r() * S, r() * S, 2 + r() * 3, 0, 7); x.fill(); }
  });
}
/* žemės detalės: šviesi tekstūra, dauginama su viršūnių spalvomis */
export function groundTex(){
  return canvasTex(256, (x, S) => {
    const r = rngF(17); x.fillStyle = "#e9e9e9"; x.fillRect(0, 0, S, S);
    for(let k = 0; k < 2600; k++){ const v = 200 + Math.floor(r() * 55); x.strokeStyle = `rgb(${v - 10},${v},${v - 14})`; x.lineWidth = 1 + r();
      const px = r() * S, py = r() * S, a = -Math.PI / 2 + (r() - 0.5) * 1.2, l = 3 + r() * 6; x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke(); }
    for(let k = 0; k < 500; k++){ x.fillStyle = `rgba(90,110,80,${0.10 + r() * 0.12})`; x.beginPath(); x.arc(r() * S, r() * S, 1 + r() * 2.5, 0, 7); x.fill(); }
    for(let k = 0; k < 120; k++){ x.fillStyle = "rgba(255,255,255,.5)"; x.beginPath(); x.arc(r() * S, r() * S, 1 + r() * 1.5, 0, 7); x.fill(); }
  });
}
/* vandens raibuliai */
export function waterTex(){
  return canvasTex(256, (x, S) => {
    const r = rngF(5); x.fillStyle = "#ffffff"; x.fillRect(0, 0, S, S);
    for(let k = 0; k < 140; k++){ const px = r() * S, py = r() * S, w = 10 + r() * 26; x.strokeStyle = `rgba(${r() < 0.5 ? "120,170,205" : "255,255,255"},${0.25 + r() * 0.3})`; x.lineWidth = 1.5 + r() * 1.5;
      for(const ox of [0, S, -S]){ x.beginPath(); x.moveTo(px + ox - w, py); x.quadraticCurveTo(px + ox, py - 4 - r() * 4, px + ox + w, py); x.stroke(); } }
  });
}

/* ---------- maži modeliai ---------- */
const lam = (c, o) => new THREE.MeshLambertMaterial(Object.assign({ color: c, flatShading: true }, o || {}));
function part(geo, mat, x, y, z, parent, sx, sy, sz){ const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); if(sx) m.scale.set(sx, sy, sz); parent.add(m); return m; }
const SPH = new THREE.IcosahedronGeometry(1, 1), SPH0 = new THREE.IcosahedronGeometry(1, 0), CONE = new THREE.ConeGeometry(1, 1, 5);

/* voverė: žiūri +z kryptimi */
function makeSquirrel(col){
  const g = new THREE.Group(), fur = lam(col), belly = lam("#f6e2c6"), dark = lam("#2a1c14");
  part(SPH, fur, 0, 0.26, 0, g, 0.17, 0.2, 0.26);
  part(SPH, belly, 0, 0.22, 0.1, g, 0.12, 0.15, 0.16);
  const head = part(SPH, fur, 0, 0.47, 0.22, g, 0.13, 0.12, 0.15);
  part(CONE, fur, -0.07, 0.61, 0.2, g, 0.035, 0.12, 0.035); part(CONE, fur, 0.07, 0.61, 0.2, g, 0.035, 0.12, 0.035);
  part(SPH0, dark, -0.075, 0.5, 0.33, g, 0.022, 0.022, 0.022); part(SPH0, dark, 0.075, 0.5, 0.33, g, 0.022, 0.022, 0.022);
  part(SPH0, dark, 0, 0.45, 0.375, g, 0.02, 0.02, 0.02);
  const tail = new THREE.Group(); tail.position.set(0, 0.2, -0.2); g.add(tail);
  part(SPH, fur, 0, 0.2, -0.1, tail, 0.11, 0.24, 0.13); part(SPH, fur, 0, 0.47, -0.02, tail, 0.13, 0.16, 0.15);
  const legs = [];
  for(const [x, z] of [[-0.1, 0.14], [0.1, 0.14], [-0.11, -0.12], [0.11, -0.12]]) legs.push(part(SPH0, fur, x, 0.07, z, g, 0.05, 0.07, 0.08));
  g.userData = { tail, head, legs }; return g;
}
/* paukščiukas */
function makeBird(col, bellyC){
  const g = new THREE.Group(), body = lam(col), belly = lam(bellyC), dark = lam("#20202a"), beak = lam("#f2a51e");
  part(SPH, body, 0, 0.17, 0, g, 0.12, 0.12, 0.16);
  part(SPH, belly, 0, 0.14, 0.05, g, 0.1, 0.09, 0.12);
  part(SPH, body, 0, 0.3, 0.1, g, 0.085, 0.085, 0.09);
  const bk = part(CONE, beak, 0, 0.29, 0.21, g, 0.03, 0.08, 0.03); bk.rotation.x = Math.PI / 2;
  part(SPH0, dark, -0.05, 0.33, 0.16, g, 0.016, 0.016, 0.016); part(SPH0, dark, 0.05, 0.33, 0.16, g, 0.016, 0.016, 0.016);
  const tl = part(new THREE.BoxGeometry(0.09, 0.02, 0.18), body, 0, 0.2, -0.2, g); tl.rotation.x = 0.5;
  const w1 = part(SPH0, body, -0.12, 0.19, -0.01, g, 0.03, 0.08, 0.12), w2 = part(SPH0, body, 0.12, 0.19, -0.01, g, 0.03, 0.08, 0.12);
  for(const x of [-0.04, 0.04]) part(new THREE.CylinderGeometry(0.008, 0.008, 0.08, 3), beak, x, 0.04, 0, g);
  g.userData = { wings: [w1, w2], tail: tl }; return g;
}
/* drugelis: du sparnai, plaka apie z ašį */
function makeButterfly(col){
  const g = new THREE.Group(), m = new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide });
  const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.bezierCurveTo(0.05, 0.16, 0.22, 0.2, 0.2, 0.05); sh.bezierCurveTo(0.24, -0.05, 0.12, -0.16, 0, -0.04);
  const wg = new THREE.ShapeGeometry(sh, 4); wg.rotateX(-Math.PI / 2);
  const a = new THREE.Mesh(wg, m), b = new THREE.Mesh(wg, m); b.scale.x = -1; g.add(a, b);
  part(SPH0, lam("#2a2030"), 0, 0, 0, g, 0.018, 0.018, 0.09);
  g.userData = { a, b }; return g;
}
/* boružė */
function makeLadybug(){
  const g = new THREE.Group();
  part(SPH, lam("#e02d2d"), 0, 0.03, 0, g, 0.07, 0.05, 0.085);
  part(SPH0, lam("#1b1b22"), 0, 0.03, 0.075, g, 0.04, 0.035, 0.035);
  const d = lam("#1b1b22"); for(const [x, z] of [[-0.035, 0.02], [0.035, 0.02], [-0.03, -0.04], [0.03, -0.04], [0, -0.005]]) part(SPH0, d, x, 0.068, z, g, 0.013, 0.008, 0.013);
  return g;
}
/* žuvėdra */
function makeGull(){
  const g = new THREE.Group(), w = lam("#f7f7f2"), gr = lam("#c9ced6");
  part(SPH, w, 0, 0, 0, g, 0.16, 0.14, 0.4);
  const mk = s => { const p = new THREE.Group(); const m = part(new THREE.BoxGeometry(0.9, 0.03, 0.28), gr, s * 0.45, 0, 0, p); m.geometry = m.geometry; g.add(p); return p; };
  g.userData = { l: mk(-1), r: mk(1) }; return g;
}

/* ---------- labirinto papuošimas ---------- */
export function decorateMaze(scene, W, low){
  const M = W.maze, r = rngF(4242), segs = M.segs;
  const stemParts = [], leafM = [], flowerM = [];
  const FC = ["#ff7aa8", "#ffffff", "#ffd84d", "#c79bff", "#ff9a52", "#ff5d6c"];
  const perSeg = low ? 0.55 : 1;
  /* sienos plokštumos: kiekviena ilgoji pusė */
  const faces = [];
  for(const s of segs){
    const [x0, x1, z0, z1, top, y] = s, lx = x1 - x0, lz = z1 - z0;
    if(lx >= lz){ faces.push({ ax: "x", a0: x0, a1: x1, c: z0, n: -1, y, top }); faces.push({ ax: "x", a0: x0, a1: x1, c: z1, n: 1, y, top }); }
    else { faces.push({ ax: "z", a0: z0, a1: z1, c: x0, n: -1, y, top }); faces.push({ ax: "z", a0: z0, a1: z1, c: x1, n: 1, y, top }); }
  }
  const P3 = (f, a, h, off) => f.ax === "x" ? new THREE.Vector3(a, h, f.c + f.n * off) : new THREE.Vector3(f.c + f.n * off, h, a);
  const dummy = new THREE.Object3D();
  for(const f of faces){
    const len = f.a1 - f.a0, nV = Math.max(0, Math.round(len / 3.2 * perSeg * (0.5 + r())));
    for(let v = 0; v < nV; v++){
      /* vijoklis: kyla nuo žemės iki viršaus vingiuodamas */
      const a0 = f.a0 + 0.5 + r() * (len - 1), amp = 0.35 + r() * 0.6, ph = r() * 6, H = f.top - f.y, pts = [], hang = r() < 0.3;
      const n = 7;
      for(let k = 0; k <= n; k++){ const t = k / n, h = hang ? f.top - t * H * (0.35 + r() * 0.1) : f.y + t * (H + 0.05);
        const a = Math.max(f.a0 + 0.15, Math.min(f.a1 - 0.15, a0 + Math.sin(t * 5 + ph) * amp * (hang ? 0.4 : 1)));
        pts.push(P3(f, a, h, 0.05)); }
      if(!hang) pts.push(P3(f, pts[pts.length - 1][f.ax], f.top + 0.03, -0.25));
      const curve = new THREE.CatmullRomCurve3(pts);
      stemParts.push(new THREE.TubeGeometry(curve, low ? 7 : 10, 0.03, 3, false));
      const col = FC[Math.floor(r() * FC.length)], nL = low ? 7 : 13;
      for(let k = 0; k < nL; k++){ const p = curve.getPoint(0.05 + 0.9 * r()), side = (r() - 0.5) * 0.5;
        if(f.ax === "x") p.x += side; else p.z += side; p.y += (r() - 0.5) * 0.2;
        leafM.push([p, f, r() * 6, 0.16 + r() * 0.14]); }
      const nF = Math.floor((low ? 2 : 3) + r() * 4);
      for(let k = 0; k < nF; k++){ const p = curve.getPoint(0.15 + 0.8 * r()); if(f.ax === "x"){ p.x += (r() - 0.5) * 0.5; p.z += f.n * 0.06; } else { p.z += (r() - 0.5) * 0.5; p.x += f.n * 0.06; }
        flowerM.push([p, f, col, 0.07 + r() * 0.05]); }
    }
  }
  /* stiebai */
  if(stemParts.length){
    let n = 0; const gs = stemParts.map(g => g.toNonIndexed()); gs.forEach(g => n += g.attributes.position.count);
    const pos = new Float32Array(n * 3); let o = 0; gs.forEach(g => { pos.set(g.attributes.position.array, o); o += g.attributes.position.array.length; });
    const sg = new THREE.BufferGeometry(); sg.setAttribute("position", new THREE.BufferAttribute(pos, 3)); sg.computeVertexNormals();
    scene.add(new THREE.Mesh(sg, lam("#6b4a2a")));
  }
  /* lapai: maži rombai, priglausti prie sienos */
  {
    const lg = new THREE.BufferGeometry();
    lg.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0, 0.5, 0.45, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, -0.5, 0.45, 0], 3)); lg.computeVertexNormals();
    const im = new THREE.InstancedMesh(lg, new THREE.MeshLambertMaterial({ color: "#ffffff", side: THREE.DoubleSide }), leafM.length), c = new THREE.Color();
    leafM.forEach(([p, f, rot, s], k) => { dummy.position.copy(p); dummy.rotation.set(0, f.ax === "x" ? (f.n > 0 ? 0 : Math.PI) : (f.n > 0 ? Math.PI / 2 : -Math.PI / 2), 0); dummy.rotateX(-0.35); dummy.rotateZ(rot); dummy.scale.setScalar(s); dummy.updateMatrix();
      im.setMatrixAt(k, dummy.matrix); im.setColorAt(k, c.setHSL(0.27 + r() * 0.1, 0.6, 0.42 + r() * 0.2)); });
    scene.add(im);
  }
  /* žiedai */
  {
    const fg = new THREE.OctahedronGeometry(1, 0);
    const im = new THREE.InstancedMesh(fg, new THREE.MeshLambertMaterial({ color: "#ffffff", emissive: "#ffffff", emissiveIntensity: 0.12 }), flowerM.length), c = new THREE.Color();
    flowerM.forEach(([p, f, col, s], k) => { dummy.position.copy(p); dummy.rotation.set(r() * 3, r() * 3, 0); dummy.scale.set(s, s, s); dummy.updateMatrix(); im.setMatrixAt(k, dummy.matrix); im.setColorAt(k, c.set(col)); });
    scene.add(im);
    const cg = new THREE.TetrahedronGeometry(1, 0), im2 = new THREE.InstancedMesh(cg, new THREE.MeshLambertMaterial({ color: "#ffd23a" }), flowerM.length);
    flowerM.forEach(([p, f, col, s], k) => { dummy.position.copy(p); if(f.ax === "x") dummy.position.z += f.n * s * 0.8; else dummy.position.x += f.n * s * 0.8; dummy.scale.setScalar(s * 0.45); dummy.rotation.set(0, 0, 0); dummy.updateMatrix(); im2.setMatrixAt(k, dummy.matrix); });
    scene.add(im2);
  }

  /* ---------- gyviai ---------- */
  const cx = M.ox + M.n * M.c / 2, cz = M.oz + M.n * M.c / 2;
  const long = segs.filter(s => Math.max(s[1] - s[0], s[3] - s[2]) > 7.5);
  const pick = () => long[Math.floor(r() * long.length)];
  const track = s => { const alongX = s[1] - s[0] >= s[3] - s[2]; return { alongX, a0: (alongX ? s[0] : s[2]) + 0.5, a1: (alongX ? s[1] : s[3]) - 0.5, c: alongX ? (s[2] + s[3]) / 2 : (s[0] + s[1]) / 2, top: s[4] }; };
  const setOn = (g, tr, a, y) => { if(tr.alongX) g.position.set(a, y, tr.c); else g.position.set(tr.c, y, a); };
  const face = (g, tr, dir) => { g.rotation.y = tr.alongX ? (dir > 0 ? Math.PI / 2 : -Math.PI / 2) : (dir > 0 ? 0 : Math.PI); };
  const critters = [];
  /* voverės: bėga gyvatvorės viršumi, stabteli, apsidairo */
  const SQC = ["#c9682b", "#b5561f", "#8a5a34", "#d97b35"];
  for(let k = 0; k < (low ? 4 : 7); k++){
    const g = makeSquirrel(SQC[k % SQC.length]), tr = track(pick()); g.scale.setScalar(1.25); scene.add(g); if(!k) W.testSq = g;
    const st = { a: tr.a0 + r() * (tr.a1 - tr.a0), dir: r() < 0.5 ? 1 : -1, pause: r() * 2, ph: r() * 6, sp: 2.2 + r() * 1.2 };
    critters.push((t, dt) => {
      const u = g.userData;
      if(st.pause > 0){ st.pause -= dt; u.tail.rotation.x = Math.sin(t * 6 + st.ph) * 0.18; u.head.rotation.y = Math.sin(t * 1.7 + st.ph) * 0.6; setOn(g, tr, st.a, tr.top); g.rotation.x = -0.35; face(g, tr, st.dir); g.rotateX(-0.3); return; }
      st.a += st.dir * st.sp * dt; u.head.rotation.y = 0;
      if(st.a > tr.a1){ st.a = tr.a1; st.dir = -1; st.pause = 0.6 + r() * 2.5; } else if(st.a < tr.a0){ st.a = tr.a0; st.dir = 1; st.pause = 0.6 + r() * 2.5; }
      else if(r() < dt * 0.25) st.pause = 0.8 + r() * 1.8;
      const hop = Math.abs(Math.sin(t * 9 + st.ph));
      setOn(g, tr, st.a, tr.top + hop * 0.16); face(g, tr, st.dir); g.rotateX(-hop * 0.25);
      u.tail.rotation.x = -0.3 + hop * 0.35; u.legs.forEach((l, i) => l.position.y = 0.07 + (i < 2 ? hop : 1 - hop) * 0.05);
    });
  }
  /* paukščiukai: striksi vietoje ir palei sieną, kartais perskrenda ant kitos sienos */
  const BC = [["#4f86d9", "#f3e7c9"], ["#e0a52c", "#fff3c9"], ["#c9503c", "#f4d9c9"], ["#6a6f7a", "#eceff3"], ["#3f9d6b", "#e9f4c9"]];
  for(let k = 0; k < (low ? 5 : 9); k++){
    const [c1, c2] = BC[k % BC.length], g = makeBird(c1, c2); g.scale.setScalar(1.3); scene.add(g); if(!k) W.testBird = g;
    let tr = track(pick());
    const st = { a: tr.a0 + r() * (tr.a1 - tr.a0), dir: 1, hopT: r() * 2, y: 0, vy: 0, fly: null, ph: r() * 6 };
    critters.push((t, dt) => {
      const u = g.userData;
      if(st.fly){ const F = st.fly; F.t += dt / F.dur; const k2 = Math.min(1, F.t);
        g.position.lerpVectors(F.from, F.to, k2); g.position.y += Math.sin(k2 * Math.PI) * 2.2; g.rotation.set(0, Math.atan2(F.to.x - F.from.x, F.to.z - F.from.z), 0);
        u.wings.forEach((w, i) => { w.rotation.z = (i ? -1 : 1) * (0.9 + Math.sin(t * 38) * 0.9); });
        if(k2 >= 1){ st.fly = null; u.wings.forEach(w => w.rotation.z = 0); } return; }
      st.hopT -= dt;
      if(st.hopT <= 0 && st.y <= 0){
        if(r() < 0.12){ const from = g.position.clone(); tr = track(pick()); st.a = tr.a0 + r() * (tr.a1 - tr.a0); const to = new THREE.Vector3(); to.set(tr.alongX ? st.a : tr.c, tr.top, tr.alongX ? tr.c : st.a); st.fly = { from, to, t: 0, dur: 0.9 + from.distanceTo(to) / 14 }; st.hopT = 1 + r() * 2; return; }
        st.vy = 1.6; st.dir = r() < 0.5 ? 1 : -1; st.hopT = 0.35 + r() * 1.6; st.move = r() < 0.7 ? 0.9 : 0;
      }
      if(st.y > 0 || st.vy > 0){ st.vy -= 9 * dt; st.y = Math.max(0, st.y + st.vy * dt); st.a = Math.max(tr.a0, Math.min(tr.a1, st.a + st.dir * (st.move || 0) * dt)); if(st.y === 0) st.vy = 0; }
      setOn(g, tr, st.a, tr.top + st.y); face(g, tr, st.dir); g.rotation.x = 0;
      u.tail.rotation.x = 0.5 + Math.sin(t * 5 + st.ph) * 0.2;
    });
  }
  /* boružės: ropoja sienomis aukštyn ir žemyn */
  for(let k = 0; k < (low ? 5 : 10); k++){
    const g = makeLadybug(), f = faces[Math.floor(r() * faces.length)]; g.scale.setScalar(1.5); scene.add(g);
    const a = f.a0 + 0.3 + r() * Math.max(0.1, f.a1 - f.a0 - 0.6), st = { h: r(), dir: 1, sp: 0.1 + r() * 0.1 };
    const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, f.ax === "x" ? (f.n > 0 ? 0 : Math.PI) : (f.n > 0 ? Math.PI / 2 : -Math.PI / 2), 0));
    const qUp = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)), qDn = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, Math.PI));
    critters.push((t, dt) => {
      st.h += st.dir * st.sp * dt; if(st.h > 0.92){ st.h = 0.92; st.dir = -1; } if(st.h < 0.1){ st.h = 0.1; st.dir = 1; }
      g.position.copy(P3(f, a + Math.sin(t * 0.3 + k) * 0.25, f.y + st.h * (f.top - f.y), 0.02));
      g.quaternion.copy(q0).multiply(st.dir > 0 ? qUp : qDn);
    });
  }
  /* drugeliai: sklando takais tarp sienų */
  const BF = ["#ffd23a", "#ff7aa8", "#7fc8ff", "#ffffff", "#ff9a3d", "#c79bff"];
  const half = M.n * M.c / 2;
  for(let k = 0; k < (low ? 8 : 16); k++){
    const g = makeButterfly(BF[k % BF.length]); g.scale.setScalar(1.1); scene.add(g);
    const ci = Math.floor(r() * M.n), cj = Math.floor(r() * M.n), bx = M.ox + (ci + 0.5) * M.c, bz = M.oz + (cj + 0.5) * M.c, ph = r() * 6, sp = 0.5 + r() * 0.5, hh = 1.2 + r() * 2.4;
    critters.push((t, dt) => {
      const x = bx + Math.sin(t * sp + ph) * 1.1 + Math.sin(t * sp * 2.3 + ph) * 0.25, z = bz + Math.cos(t * sp * 0.8 + ph * 2) * 1.1;
      const y = M.y + hh + Math.sin(t * 1.3 + ph) * 0.5 + Math.sin(t * 7 + ph) * 0.05;
      g.rotation.y = Math.atan2(x - g.position.x, z - g.position.z); g.position.set(x, y, z);
      const fl = Math.sin(t * 16 + ph) * 0.9 + 0.5; g.userData.a.rotation.z = fl; g.userData.b.rotation.z = -fl;
    });
  }
  W.anim.push((t, dt) => { const cam = W.camPos; if(cam && Math.hypot(cam.x - cx, cam.z - cz) > half + 90) return; for(const f of critters) f(t, dt); });
  return { vines: stemParts.length, leaves: leafM.length, flowers: flowerM.length, critters: critters.length };
}

/* ---------- drugelių būreliai pievose ir žuvėdros prie kranto ---------- */
export function addWildlife(scene, W, spots, gullAt, low){
  const r = rngF(99), list = [];
  const BF = ["#ffd23a", "#ff7aa8", "#7fc8ff", "#ffffff", "#ff9a3d", "#c79bff"];
  spots.forEach(([sx, sz]) => {
    for(let k = 0; k < (low ? 3 : 6); k++){
      const g = makeButterfly(BF[Math.floor(r() * BF.length)]); scene.add(g);
      const bx = sx + (r() - 0.5) * 22, bz = sz + (r() - 0.5) * 22, ph = r() * 6, sp = 0.4 + r() * 0.5, rad = 1.5 + r() * 3;
      list.push([sx, sz, (t) => {
        const x = bx + Math.sin(t * sp + ph) * rad, z = bz + Math.cos(t * sp * 0.7 + ph) * rad, y = W.terrain(x, z) + 0.8 + Math.sin(t * 1.1 + ph) * 0.4 + 0.5;
        g.rotation.y = Math.atan2(x - g.position.x, z - g.position.z); g.position.set(x, y, z);
        const fl = Math.sin(t * 16 + ph) * 0.9 + 0.5; g.userData.a.rotation.z = fl; g.userData.b.rotation.z = -fl; }]);
    }
  });
  for(let k = 0; k < (low ? 3 : 6); k++){
    const g = makeGull(); g.scale.setScalar(2.2); scene.add(g);
    const ph = r() * 6, rad = 18 + r() * 30, h = 16 + r() * 14, sp = 0.18 + r() * 0.12, cx = gullAt[0] + (r() - 0.5) * 40, cz = gullAt[1] + (r() - 0.5) * 40;
    list.push([cx, cz, (t) => { const a = t * sp + ph; g.position.set(cx + Math.cos(a) * rad, h + Math.sin(t * 0.5 + ph) * 2, cz + Math.sin(a) * rad); g.rotation.set(0, -a, 0.25);
      const fl = Math.sin(t * 3 + ph) * 0.45; g.userData.l.rotation.z = -fl; g.userData.r.rotation.z = fl; }, 260]);
  }
  W.anim.push((t) => { const cam = W.camPos; for(const [x, z, f, far] of list){ if(cam && Math.hypot(cam.x - x, cam.z - z) > (far || 110)) continue; f(t); } });
}
