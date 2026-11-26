/* Šešėlių dirbtuvė – „Šešėlių slėpynės“: naktis dirbtuvėje, pelytė turi pasiekti duris nepakliūdama į lempų šviesą – slepiasi daiktų šešėliuose.
   Ar taškas apšviestas, skaičiuojama tiksliai (spindulys nuo lempos iki pelytės ir kliūtys), todėl žaidimo logika sutampa su matomais šešėliais. */
const SD = window.MK_SD, { THREE, T, MK, $, rad } = SD, X = T.slepynes;
const RW = 4.5, RL = 7.5, MR = 0.32, SPEED = 3.4, EYE = 0.3;
/* kliūtys: ["b", x, z, plotis, gylis, aukštis, spalva] – dėžė, ["c", x, z, spindulys, aukštis, spalva] – kolona ar vaza
   lempos: x, z, h – vieta ir aukštis; a – kryptis (0 – į dešinę, 90° – žemyn ekrane); reach – kur spindulio ašis pasiekia grindis; cone – kūgio puskampis;
   rot – sukimosi greitis; sw – [amplitudė, greitis] švytavimui; hv – [amplitudė, greitis] kilnojimui */
const LEVELS = [
  { start: [3.2, 6.6], tubes: [[-3.1, 3.1], [-3.6, 0.1], [-0.9, -6.4]],
    obs: [["b", 1.1, 2.2, 1.6, 1.1, 2, "#b9824f"], ["c", -2.7, -2.2, 0.6, 1.8, "#e8e2d4"], ["b", -1.8, 0.2, 1.2, 1.5, 2, "#8b5a2b"], ["c", 2, -1, 0.6, 1.8, "#f7c948"], ["c", 0, -4.8, 0.6, 1.8, "#2bb3a3"], ["b", 3.9, -4.5, 1.2, 1.3, 1.6, "#8b5a2b"], ["b", -1.7, 3.2, 1.2, 1.3, 2, "#a8743f"], ["b", 1.9, 4.6, 1.6, 1.3, 2, "#8b5a2b"], ["b", -2.7, -4.4, 1.4, 1.1, 2, "#8b5a2b"]],
    lamps: [{ x: 0, z: -0.4, h: 3.4, a: 0, reach: 0.01, cone: 1.05 }] },
  { start: [-3.8, 6.8], tubes: [[-1.4, 5.4], [3.9, 0.1], [3.6, -3.1]],
    obs: [["b", -3, 0, 3, 2.4, 0.6, "#8b5a2b"], ["c", 2.1, 2.5, 0.6, 1.8, "#e8e2d4"], ["c", 1.5, 4.8, 0.6, 1.8, "#e8e2d4"], ["c", -2.1, 2.9, 0.7, 1.8, "#2bb3a3"], ["c", 2.7, -2.1, 0.7, 1.8, "#2bb3a3"], ["b", -0.3, -4.7, 1.2, 1.1, 1.6, "#8b5a2b"], ["b", 2.5, 0.3, 1.4, 1.3, 2, "#b9824f"]],
    lamps: [{ x: -4.1, z: 0, h: 2.8, a: 0, reach: 6, cone: 0.95, sw: [0.4, 0.6] }] },
  { start: [-3.7, 6.8], tubes: [[-0.6, 5.9], [2.1, -0.9], [1.6, -5.6]],
    obs: [["b", -2.9, 3, 3.2, 2, 0.6, "#8b5a2b"], ["b", 2.9, -2.6, 3.2, 2, 0.6, "#8b5a2b"], ["b", 0.7, 3.6, 2, 1.5, 2, "#b9824f"], ["b", -2.5, -0.4, 1.4, 1.3, 1.6, "#8b5a2b"], ["b", -2.7, -5.2, 1.4, 1.5, 1.6, "#a8743f"], ["b", 2, 1.2, 1.2, 1.3, 2, "#b9824f"], ["c", 3.8, 4.7, 0.7, 1.8, "#2bb3a3"], ["b", -0.4, -4.2, 1.2, 1.1, 1.6, "#a8743f"], ["c", -2.7, -2.8, 0.6, 1.8, "#f7c948"]],
    lamps: [{ x: -4.1, z: 3.0, h: 2.8, a: 0, reach: 6, cone: 0.55 }, { x: 4.1, z: -2.6, h: 2.8, a: rad(180), reach: 6, cone: 0.55 }] },
  { start: [3.8, 6.7], tubes: [[3.4, 2.9], [2.9, -0.1], [0.9, -2.6]],
    obs: [["b", 3.3, 5.3, 1.8, 1.1, 2, "#6b4423"], ["c", 1.8, -1.4, 0.6, 1.8, "#2bb3a3"], ["b", 2.7, 1.1, 1.2, 1.3, 1.6, "#8b5a2b"], ["b", -0.9, -4.4, 2, 1.3, 1.6, "#a8743f"], ["b", -3.8, -1.8, 1.4, 1.1, 1.6, "#a8743f"]],
    lamps: [{ x: -2.6, z: -7.0, h: 3.2, a: rad(72), reach: 8, cone: 1.0, hv: [1.4, 0.7] }] },
  { start: [-3.4, 6.7], tubes: [[2.1, 5.1], [-3.4, -2.4], [-1.6, -6.4]],
    obs: [["b", -3, 5.3, 1.8, 1.1, 2, "#6b4423"], ["b", 3.9, -5.4, 1.2, 1.3, 2, "#b9824f"], ["c", -2.3, -0.2, 0.7, 1.8, "#e8e2d4"], ["c", 2, 3.5, 0.7, 1.8, "#f7c948"], ["c", -1.7, 2.3, 0.6, 1.8, "#f7c948"], ["c", 1.6, -2, 0.7, 1.8, "#2bb3a3"], ["c", -0.8, -4.8, 0.7, 1.8, "#2bb3a3"]],
    lamps: [{ x: 0.3, z: 1.6, h: 3.4, a: 0, reach: 3.6, cone: 0.7, rot: 0.5 }, { x: 2.8, z: -7.0, h: 3.0, a: rad(110), reach: 7, cone: 0.8, hv: [1.2, 0.8] }] }
];
const lampAngle = (L, t) => L.a + (L.rot || 0) * t + (L.sw ? L.sw[0] * Math.sin(L.sw[1] * t) : 0), lampH = (L, t) => L.h + (L.hv ? L.hv[0] * Math.sin(L.hv[1] * t) : 0);
/* ar atkarpą nuo lempos (px, py, pz) iki taško (x, EYE, z) kerta kliūtis */
function blocked(lv, px, py, pz, x, z){
  const dx = x - px, dy = EYE - py, dz = z - pz;
  for(const o of lv.obs){
    if(o[0] === "b"){ let t0 = 0, t1 = 1; const lo = [o[1] - o[3] / 2, 0, o[2] - o[4] / 2], hi = [o[1] + o[3] / 2, o[5], o[2] + o[4] / 2], p = [px, py, pz], d = [dx, dy, dz]; let hit = true;
      for(let k = 0; k < 3 && hit; k++){ if(Math.abs(d[k]) < 1e-9){ if(p[k] < lo[k] || p[k] > hi[k]) hit = false; } else { let a = (lo[k] - p[k]) / d[k], b = (hi[k] - p[k]) / d[k]; if(a > b){ const s = a; a = b; b = s; } t0 = Math.max(t0, a); t1 = Math.min(t1, b); if(t0 > t1) hit = false; } }
      if(hit) return true; }
    else { const fx = px - o[1], fz = pz - o[2], A = dx * dx + dz * dz, B = 2 * (fx * dx + fz * dz), C = fx * fx + fz * fz - o[3] * o[3], D = B * B - 4 * A * C; if(D < 0 || A < 1e-9) continue;
      const s = Math.sqrt(D), t0 = Math.max(0, (-B - s) / (2 * A)), t1 = Math.min(1, (-B + s) / (2 * A)); if(t0 > t1) continue; if(py + dy * t1 <= o[4]) return true; }
  }
  return false;
}
function litBy(lv, L, x, z, t){
  const a = lampAngle(L, t), h = lampH(L, t), ax = Math.cos(a) * L.reach, az = Math.sin(a) * L.reach, al = Math.hypot(ax, h, az), vx = x - L.x, vy = EYE - h, vz = z - L.z, vl = Math.hypot(vx, vy, vz);
  if((vx * ax + vy * -h + vz * az) / (vl * al) < Math.cos(L.cone * 0.94)) return false; return !blocked(lv, L.x, h, L.z, x, z);
}
const lit = (lv, x, z, t) => lv.lamps.some(L => litBy(lv, L, x, z, t));
function solid(lv, x, z, r){ if(Math.abs(x) > RW - r || Math.abs(z) > RL - r) return true; for(const o of lv.obs){ if(o[0] === "b"){ const qx = Math.max(o[1] - o[3] / 2, Math.min(x, o[1] + o[3] / 2)), qz = Math.max(o[2] - o[4] / 2, Math.min(z, o[2] + o[4] / 2)); if(Math.hypot(x - qx, z - qz) < r) return true; } else if(Math.hypot(x - o[1], z - o[2]) < o[3] + r) return true; } for(const L of lv.lamps) if(Math.hypot(x - L.x, z - L.z) < 0.3 + r) return true; return false; }

let st = null, hs, hcam, room, mouse, bang, glow, ready = false, keys = new Set(), joy = null, joyEl = null;
function init(){
  if(ready) return; ready = true;
  hs = new THREE.Scene(); hs.background = new THREE.Color("#141829"); hs.add(new THREE.HemisphereLight(0x9fb4ff, 0x20243a, 0.62));
  hcam = new THREE.PerspectiveCamera(46, 1, 1, 120);
  const [fc, fg] = SD.cnv(512, 512); fg.fillStyle = "#b98a5c"; fg.fillRect(0, 0, 512, 512); for(let y = 0; y < 512; y += 64) for(let x = -128; x < 512; x += 256){ const o = (y / 64) % 2 ? 128 : 0, k = SD.hs(x * 0.7 + y * 3.1); fg.fillStyle = `hsl(${27 + k * 6},${40 + k * 10}%,${50 + k * 10}%)`; fg.fillRect(x + o + 2, y + 2, 252, 60); }
  const ft = SD.tex(fc); ft.wrapS = ft.wrapT = THREE.RepeatWrapping; ft.repeat.set(3, 5);
  const floor = SD.mesh(new THREE.PlaneGeometry(RW * 2, RL * 2), new THREE.MeshStandardMaterial({ map: ft, roughness: 0.9 }), 0, 0, 0); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; hs.add(floor);
  const wm = SD.std("#3b4162"); for(const [w, d, x, z] of [[RW * 2 + 0.8, 0.4, 0, -RL - 0.2], [RW * 2 + 0.8, 0.4, 0, RL + 0.2], [0.4, RL * 2, -RW - 0.2, 0], [0.4, RL * 2, RW + 0.2, 0]]) hs.add(SD.mesh(new THREE.BoxGeometry(w, 1.1, d), wm, x, 0.55, z));
  /* durys ir starto kilimėlis */
  const door = new THREE.Group(); SD.mesh(new THREE.BoxGeometry(2.3, 2.4, 0.3), SD.std("#6b4423"), 0, 1.2, 0, door); SD.mesh(new THREE.BoxGeometry(1.7, 2.0, 0.34), new THREE.MeshBasicMaterial({ color: 0x9dffb8 }), 0, 1.0, 0, door); door.position.set(0, 0, -RL - 0.15); hs.add(door);
  const mat = SD.mesh(new THREE.PlaneGeometry(2.4, 1.0), new THREE.MeshBasicMaterial({ color: 0x2fbf71, transparent: true, opacity: 0.55 }), 0, 0.012, -RL + 0.55); mat.rotation.x = -Math.PI / 2; hs.add(mat);
  /* pelytė su berete */
  mouse = new THREE.Group(); const body = new THREE.Group(); mouse.add(body); mouse.userData.body = body; const gm = SD.std("#c9cfdb", { emissive: 0x4a5266 }), pk = SD.std("#f4a6b7", { emissive: 0x5a2f3a }), dk = SD.std("#2b2f3a");
  const add = (g, m, x, y, z, sx, sy, sz) => { const o = SD.mesh(g, m, x, y, z, body); if(sx) o.scale.set(sx, sy, sz); o.castShadow = true; return o; }, sp = r => new THREE.SphereGeometry(r, 14, 10);
  add(sp(0.3), gm, 0, 0.26, -0.05, 1, 0.85, 1.35); add(sp(0.21), gm, 0, 0.32, 0.36); add(sp(0.12), gm, -0.17, 0.5, 0.3); add(sp(0.12), gm, 0.17, 0.5, 0.3); add(sp(0.07), pk, -0.17, 0.5, 0.36); add(sp(0.07), pk, 0.17, 0.5, 0.36);
  add(sp(0.045), pk, 0, 0.3, 0.57); add(sp(0.035), dk, -0.08, 0.38, 0.52); add(sp(0.035), dk, 0.08, 0.38, 0.52); const rd = SD.std("#e5484d", { emissive: 0x5a1518 }); add(sp(0.17), rd, 0.03, 0.5, 0.33, 1.15, 0.38, 1.15); add(sp(0.03), rd, 0.03, 0.58, 0.33);
  const tail = add(new THREE.CylinderGeometry(0.025, 0.012, 0.6, 6), pk, 0, 0.22, -0.68); tail.rotation.x = 1.25; mouse.scale.setScalar(1.25); hs.add(mouse);
  const [gc, gg] = SD.cnv(128, 128), rg = gg.createRadialGradient(64, 64, 8, 64, 64, 62); rg.addColorStop(0, "rgba(170,200,255,0.55)"); rg.addColorStop(0.6, "rgba(150,180,255,0.22)"); rg.addColorStop(1, "rgba(150,180,255,0)"); gg.fillStyle = rg; gg.fillRect(0, 0, 128, 128);
  glow = SD.mesh(new THREE.PlaneGeometry(2.1, 2.1), new THREE.MeshBasicMaterial({ map: SD.tex(gc), transparent: true, depthWrite: false }), 0, 0.02, 0); glow.rotation.x = -Math.PI / 2; hs.add(glow);
  const [bc, bg] = SD.cnv(64, 64); bg.fillStyle = "#e5484d"; bg.beginPath(); bg.arc(32, 32, 28, 0, 7); bg.fill(); bg.fillStyle = "#fff"; bg.font = "900 44px sans-serif"; bg.textAlign = "center"; bg.textBaseline = "middle"; bg.fillText("!", 32, 35);
  bang = new THREE.Sprite(new THREE.SpriteMaterial({ map: SD.tex(bc), depthTest: false, transparent: true })); bang.scale.set(0.7, 0.7, 1); bang.visible = false; bang.renderOrder = 5; hs.add(bang);
}
function pose(){ const asp = innerWidth / innerHeight, th = Math.tan(rad(23)), wide = asp > 1, d = Math.max((RW + 0.5) / (th * asp), (RL + 1.4) / th * (wide ? 1.04 : 0.93)), p = rad(64), cz = wide ? 1.3 : 0.4; hcam.aspect = asp; hcam.position.set(0, d * Math.sin(p), d * Math.cos(p) + cz); hcam.lookAt(0, 0, cz); hcam.updateProjectionMatrix(); }
function buildRoom(){
  if(room){ hs.remove(room); room.traverse(o => { if(o.isMesh){ o.geometry.dispose(); o.material.dispose(); } if(o.isLight && o.shadow && o.shadow.map) o.shadow.map.dispose(); }); }
  room = new THREE.Group(); hs.add(room); const lv = st.lv; st.lampObjs = [];
  for(const o of lv.obs){ const m = o[0] === "b" ? SD.mesh(new THREE.BoxGeometry(o[3], o[5], o[4]), SD.std(o[6]), o[1], o[5] / 2, o[2], room) : SD.mesh(new THREE.CylinderGeometry(o[3], o[3] * 1.04, o[4], 28), SD.std(o[5]), o[1], o[4] / 2, o[2], room); m.castShadow = m.receiveShadow = true;
    if(o[0] === "b"){ const e = SD.mesh(new THREE.BoxGeometry(o[3] + 0.06, 0.1, o[4] + 0.06), SD.std("#5d3b1a"), o[1], o[5] - 0.02, o[2], room); e.castShadow = true; } }
  for(const L of lv.lamps){ const g = new THREE.Group(), sl = new THREE.SpotLight(0xfff0c4, 4.2, 0, L.cone, 0.14, 0); sl.castShadow = true; sl.shadow.mapSize.set(1024, 1024); sl.shadow.camera.near = 0.6; sl.shadow.camera.far = 22; sl.shadow.bias = -0.0008; room.add(sl); room.add(sl.target);
    const pole = SD.mesh(new THREE.CylinderGeometry(0.07, 0.09, 1, 8), SD.std("#2b2f3a"), L.x, 0.5, L.z, room), base = SD.mesh(new THREE.CylinderGeometry(0.34, 0.4, 0.14, 16), SD.std("#2b2f3a"), L.x, 0.07, L.z, room);
    const head = new THREE.Group(); const sh = SD.mesh(new THREE.CylinderGeometry(0.42, 0.14, 0.5, 20, 1, true), SD.std("#1f6f8b", { side: THREE.DoubleSide, emissive: 0x0a2a36 }), 0, 0, 0, head); sh.geometry.rotateX(Math.PI / 2); SD.mesh(new THREE.SphereGeometry(0.15, 12, 8), new THREE.MeshBasicMaterial({ color: 0xfff6c9 }), 0, 0, 0.1, head);
    const len = 1.9, cg = new THREE.ConeGeometry(Math.tan(L.cone) * len, len, 28, 1, true); cg.translate(0, -len / 2, 0); cg.rotateX(-Math.PI / 2); SD.mesh(cg, new THREE.MeshBasicMaterial({ color: 0xfff0b0, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }), 0, 0, 0, head);
    room.add(head); st.lampObjs.push({ L, sl, pole, head }); }
  st.tubeObjs = lv.tubes.map(([x, z], i) => { const g = new THREE.Group(); SD.mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.5, 12), new THREE.MeshBasicMaterial({ color: [0xe5484d, 0x3b82f6, 0xf7c948][i % 3] }), 0, 0, 0, g); SD.mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.14, 10), new THREE.MeshBasicMaterial({ color: 0xffffff }), 0, 0.3, 0, g); g.position.set(x, 0.45, z); g.rotation.z = 0.5; room.add(g); return g; });
}
function startRoom(i){
  st.li = i; st.lv = LEVELS[i]; st.hearts = 3; st.meter = 0; st.safe = 0; st.t = 0; st.doneT = 0; st.x = st.lv.start[0]; st.z = st.lv.start[1]; st.face = Math.PI; st.gotR = 0; buildRoom(); hud(); say(X.tips[i], "new"); st.msgT = 6; MK.sfx.whoosh();
}
function start(){
  init(); pose(); $("mh").innerHTML = `<div class="mtop"><div class="mcard" id="hR"></div><div class="mbar low" id="hBar"><i style="width:0"></i></div><div class="mcard hearts" id="hH"></div></div><div class="mbot"><div class="mmsg" id="hMsg"></div></div>`;
  st = { lost: 0, tubes: 0, total: LEVELS.reduce((s, l) => s + l.tubes.length, 0), over: false }; startRoom(0);
}
function stop(){ st = null; keys.clear(); joy = null; if(joyEl){ joyEl.remove(); joyEl = null; } }
function hud(){ $("hR").innerHTML = `<small>${X.room(st.li + 1, LEVELS.length)}</small>${X.tubes(st.tubes)}`; $("hH").textContent = "♥".repeat(st.hearts) + "♡".repeat(3 - st.hearts); }
function say(m, cls){ const e = $("hMsg"); if(!e) return; e.textContent = m || ""; e.className = "mmsg " + (cls || ""); }
function caught(){
  st.hearts--; st.lost++; st.meter = 0; st.safe = 1.2; MK.sfx.bad(); st.x = st.lv.start[0]; st.z = st.lv.start[1];
  if(st.hearts <= 0){ say(X.lost, "bad"); st.msgT = 3; const i = st.li, tb = st.gotR; st.tubes -= tb; startRoom(i); say(X.lost, "bad"); st.msgT = 3; } else { say(X.seen, "bad"); st.msgT = 2.5; hud(); }
}
function finish(){ st.over = true; const need = Math.round(st.total * 0.8), stars = st.lost <= 2 && st.tubes >= need ? 3 : st.lost <= 6 ? 2 : 1; SD.result({ key: "slepynes", stars, title: X.title, lines: [X.lines[stars - 1], X.res(st.tubes, st.total) + "<br>" + X.hearts(st.lost)].concat(stars < 3 ? [X.hint(need)] : []), again: start }); }
function frame(dt){
  if(!st || st.over) return; st.t += dt; const lv = st.lv, t = st.t;
  /* lempos */
  for(const o of st.lampObjs){ const L = o.L, a = lampAngle(L, t), h = lampH(L, t); o.sl.position.set(L.x, h, L.z); o.sl.target.position.set(L.x + Math.cos(a) * L.reach, 0, L.z + Math.sin(a) * L.reach); o.pole.scale.y = h; o.pole.position.y = h / 2; o.head.position.set(L.x, h, L.z); o.head.lookAt(o.sl.target.position); }
  for(const g of st.tubeObjs) if(g.visible) g.rotation.y += dt * 2.5;
  if(st.doneT > 0){ st.doneT -= dt; if(st.doneT <= 0){ if(st.li + 1 >= LEVELS.length) return finish(); startRoom(st.li + 1); } }
  else {
    /* judėjimas */
    let vx = (keys.has("R") ? 1 : 0) - (keys.has("L") ? 1 : 0), vz = (keys.has("D") ? 1 : 0) - (keys.has("U") ? 1 : 0); if(joy){ vx += joy.vx; vz += joy.vz; } const vl = Math.hypot(vx, vz);
    if(vl > 0.08){ const k = Math.min(1, vl) / vl * SPEED * dt, nx = st.x + vx * k, nz = st.z + vz * k; if(!solid(lv, nx, st.z, MR)) st.x = nx; if(!solid(lv, st.x, nz, MR)) st.z = nz; st.face = Math.atan2(vx, vz); st.hop = (st.hop || 0) + dt * 13; }
    for(const [i, g] of st.tubeObjs.entries()) if(g.visible && Math.hypot(g.position.x - st.x, g.position.z - st.z) < 0.6){ g.visible = false; st.tubes++; st.gotR++; MK.sfx.star(st.tubes); say(X.tube, "good"); st.msgT = 1.2; hud(); }
    /* šviesa */
    const isLit = st.safe > 0 ? false : lit(lv, st.x, st.z, t); st.isLit = isLit; if(st.safe > 0) st.safe -= dt;
    st.meter = Math.max(0, Math.min(1, st.meter + (isLit ? dt / 0.75 : -dt / 0.5))); if(st.meter >= 1) caught();
    else if(st.z < -RL + 0.75 && Math.abs(st.x) < 1.15){ st.doneT = 1.3; say(X.door, "good"); st.msgT = 1.3; MK.sfx.good(); }
  }
  $("hBar").firstChild.style.width = st.meter * 100 + "%";
  if(st.msgT > 0){ st.msgT -= dt; if(st.msgT <= 0) say(""); }
  mouse.position.set(st.x, 0, st.z); glow.position.set(st.x, 0.02, st.z); glow.material.opacity = st.isLit ? 0 : 1; mouse.rotation.y += Math.atan2(Math.sin(st.face - mouse.rotation.y), Math.cos(st.face - mouse.rotation.y)) * Math.min(1, dt * 12); mouse.userData.body.position.y = Math.abs(Math.sin(st.hop || 0)) * 0.07;
  bang.visible = !!st.isLit; bang.position.set(st.x, 1.25 + Math.sin(t * 16) * 0.05, st.z);
}
function render(){ SD.renderer.render(hs, hcam); }
function key(e, up){ const k = { ArrowLeft: "L", a: "L", ArrowRight: "R", d: "R", ArrowUp: "U", w: "U", ArrowDown: "D", s: "D" }[e.key]; if(!k) return; if(e.preventDefault) e.preventDefault(); if(up) keys.delete(k); else keys.add(k); }
addEventListener("keyup", e => { if(st) key(e, true); }); addEventListener("blur", () => keys.clear());
/* vairalazdė: atsiranda ten, kur paliečiamas ekranas */
const gl = $("gl");
gl.addEventListener("pointerdown", e => { if(!st || st.over) return; joy = { x: e.clientX, y: e.clientY, vx: 0, vz: 0 }; if(!joyEl){ joyEl = document.createElement("div"); joyEl.className = "joy"; joyEl.innerHTML = "<i></i>"; $("mh").appendChild(joyEl); } joyEl.style.left = e.clientX + "px"; joyEl.style.top = e.clientY + "px"; joyEl.hidden = false; joyEl.firstChild.style.transform = ""; try { gl.setPointerCapture(e.pointerId); } catch(_){} });
gl.addEventListener("pointermove", e => { if(!st || !joy) return; let dx = (e.clientX - joy.x) / 44, dy = (e.clientY - joy.y) / 44; const l = Math.hypot(dx, dy); if(l > 1){ dx /= l; dy /= l; } joy.vx = dx; joy.vz = dy; if(joyEl) joyEl.firstChild.style.transform = `translate(${dx * 30}px,${dy * 30}px)`; });
const jend = () => { joy = null; if(joyEl) joyEl.hidden = true; }; gl.addEventListener("pointerup", jend); gl.addEventListener("pointercancel", jend);
SD.MODES.slepynes = { start, stop, frame, render, key, resize: pose, get st(){ return st; }, api: { LEVELS, lit, solid, RW, RL, MR, SPEED, startRoom: i => startRoom(i) } };
