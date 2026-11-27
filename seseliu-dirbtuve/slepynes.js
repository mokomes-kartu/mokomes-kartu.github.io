/* Šešėlių dirbtuvė – „Šešėlių slėpynės“: naktis dirbtuvėje, pelytė turi pasiekti duris nepakliūdama į lempų šviesą.
   Ji slepiasi daiktų šešėliuose, stumdo dėžes, graužia sūrį, virves ir kabelius, junginėja jungiklius ir mygtukus. Taisyklės (šviesa, kliūtys, veiksmai) – faile slepynes-logika.js,
   kambariai – slepynes-kambariai.js (visi patikrinti programa: įveikiami, o be šešėlių ar be veiksmų – ne). */
const SD = window.MK_SD, { THREE, T, MK, $, rad } = SD, X = T.slepynes, L = window.MK_SL, K = window.MK_SLK;
const { RW, RL, MR, SPEED, cx, cz } = L, CKEY = "mk-seseliu-dirbtuve-kelione", GAME = "seseliu-dirbtuve";
const ROOMS = []; K.floors.forEach((f, fi) => f.rooms.forEach((lv, ri) => ROOMS.push({ lv, fi, ri, id: f.id + "-" + (ri + 1) })));
const prog = () => MK.get(CKEY, {}).rooms || {};
function saveRoom(id, stars){ const C = Object.assign({ seen: [] }, MK.get(CKEY, {})); C.rooms = C.rooms || {}; if(!(C.rooms[id] >= stars)) C.rooms[id] = stars; MK.set(CKEY, C);
  const done = ROOMS.filter(r => C.rooms[r.id]).length, all3 = ROOMS.every(r => C.rooms[r.id] === 3), s = all3 ? 3 : done >= ROOMS.length ? 2 : done >= 5 ? 1 : 0; if(s) MK.best(GAME, "slepynes", s); }
const open = (R, P) => R.ri === 0 || !!P[ROOMS[ROOMS.indexOf(R) - 1].id];

let st = null, hs, hcam, room, mouse, bang, glow, ring, ringG, tx, ready = false, picking = false, keys = new Set(), joy = null, joyEl = null;
function init(){
  if(ready) return; ready = true;
  hs = new THREE.Scene(); hs.background = new THREE.Color("#141829"); hs.add(new THREE.HemisphereLight(0x9fb4ff, 0x20243a, 0.62));
  hcam = new THREE.PerspectiveCamera(46, 1, 1, 120);
  const mk = (w, h, fn) => { const [c, g] = SD.cnv(w, h); fn(g); return SD.tex(c); };
  const ft = mk(512, 512, g => { g.fillStyle = "#b98a5c"; g.fillRect(0, 0, 512, 512); for(let y = 0; y < 512; y += 64) for(let x = -128; x < 512; x += 256){ const o = (y / 64) % 2 ? 128 : 0, k = SD.hs(x * 0.7 + y * 3.1); g.fillStyle = `hsl(${27 + k * 6},${40 + k * 10}%,${50 + k * 10}%)`; g.fillRect(x + o + 2, y + 2, 252, 60); } });
  ft.wrapS = ft.wrapT = THREE.RepeatWrapping; ft.repeat.set(3, 5);
  const floor = SD.mesh(new THREE.PlaneGeometry(RW * 2, RL * 2), new THREE.MeshStandardMaterial({ map: ft, roughness: 0.9 }), 0, 0, 0); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; hs.add(floor);
  const wm = SD.std("#3b4162"); for(const [w, d, x, z, h] of [[RW * 2 + 0.8, 0.4, 0, -RL - 0.2, 1.1], [RW * 2 + 0.8, 0.4, 0, RL + 0.2, 0.25], [0.4, RL * 2, -RW - 0.2, 0, 1.1], [0.4, RL * 2, RW + 0.2, 0, 1.1]]) hs.add(SD.mesh(new THREE.BoxGeometry(w, h, d), wm, x, h / 2, z));
  /* durys ir kilimėlis prie jų */
  const door = new THREE.Group(); SD.mesh(new THREE.BoxGeometry(2.3, 2.4, 0.3), SD.std("#6b4423"), 0, 1.2, 0, door); SD.mesh(new THREE.BoxGeometry(1.7, 2.0, 0.34), new THREE.MeshBasicMaterial({ color: 0x9dffb8 }), 0, 1.0, 0, door); door.position.set(0, 0, -RL - 0.15); hs.add(door);
  const mat = SD.mesh(new THREE.PlaneGeometry(2.4, 1.0), new THREE.MeshBasicMaterial({ color: 0x2fbf71, transparent: true, opacity: 0.55 }), 0, 0.012, -RL + 0.55); mat.rotation.x = -Math.PI / 2; hs.add(mat);
  /* daiktų paviršiai */
  tx = {
    crate: mk(128, 128, g => { g.fillStyle = "#b9824f"; g.fillRect(0, 0, 128, 128); g.strokeStyle = "#7a5230"; g.lineWidth = 10; g.strokeRect(5, 5, 118, 118); g.lineWidth = 4; for(const x of [44, 84]){ g.beginPath(); g.moveTo(x, 8); g.lineTo(x, 120); g.stroke(); } }),
    push: mk(128, 128, g => { g.fillStyle = "#4f8fe8"; g.fillRect(0, 0, 128, 128); g.strokeStyle = "#1f4fa8"; g.lineWidth = 12; g.strokeRect(6, 6, 116, 116); g.fillStyle = "#fff"; for(let k = 0; k < 4; k++){ g.save(); g.translate(64, 64); g.rotate(k * Math.PI / 2); g.beginPath(); g.moveTo(44, 0); g.lineTo(26, -13); g.lineTo(26, 13); g.fill(); g.fillRect(8, -5, 20, 10); g.restore(); } }),
    cheese: mk(128, 128, g => { g.fillStyle = "#f7c948"; g.fillRect(0, 0, 128, 128); g.fillStyle = "#d9a520"; for(const [x, y, r] of [[30, 34, 14], [88, 26, 9], [66, 72, 17], [104, 96, 11], [24, 100, 9], [112, 54, 6]]){ g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); } }),
    grate: mk(64, 64, g => { g.fillStyle = "#2b2f3a"; g.fillRect(0, 0, 64, 64); g.strokeStyle = "#8a93a8"; g.lineWidth = 3; for(let k = 8; k < 64; k += 12){ g.beginPath(); g.moveTo(k, 4); g.lineTo(k, 60); g.stroke(); } g.lineWidth = 5; g.strokeRect(3, 3, 58, 58); }),
    wall: mk(128, 128, g => { g.fillStyle = "#59608c"; g.fillRect(0, 0, 128, 128); g.strokeStyle = "#3b4162"; g.lineWidth = 4; for(let y = 0; y <= 128; y += 32){ g.beginPath(); g.moveTo(0, y); g.lineTo(128, y); g.stroke(); for(let x = (y / 32) % 2 ? 32 : 0; x <= 128; x += 64){ g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 32); g.stroke(); } } })
  };
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
  /* graužimo eigos žiedas */
  const [rc, rgx] = SD.cnv(64, 64); ringG = rgx; ring = new THREE.Sprite(new THREE.SpriteMaterial({ map: SD.tex(rc), depthTest: false, transparent: true })); ring.scale.set(0.95, 0.95, 1); ring.visible = false; ring.renderOrder = 6; hs.add(ring);
}
function drawRing(k){ const g = ringG; g.clearRect(0, 0, 64, 64); g.lineWidth = 9; g.lineCap = "butt"; g.strokeStyle = "rgba(43,47,58,.75)"; g.beginPath(); g.arc(32, 32, 24, 0, 7); g.stroke(); g.strokeStyle = "#ffd23f"; g.lineCap = "round"; g.beginPath(); g.arc(32, 32, 24, -Math.PI / 2, -Math.PI / 2 + k * Math.PI * 2); g.stroke(); ring.material.map.needsUpdate = true; }
function pose(){ if(!hcam) return; const asp = innerWidth / innerHeight, th = Math.tan(rad(23)), wide = asp > 1, d = Math.max((RW + 0.5) / (th * asp), (RL + 1.4) / th * (wide ? 1.04 : 0.93)), p = rad(64), z0 = wide ? 1.3 : 0.4; hcam.aspect = asp; hcam.position.set(0, d * Math.sin(p), d * Math.cos(p) + z0); hcam.lookAt(0, 0, z0); hcam.updateProjectionMatrix(); }

/* ---------- kambario vaizdas ---------- */
const CYL = ["#e8e2d4", "#2bb3a3", "#f7c948", "#e58fb1"], GAZE_N = 28;
/* katino žvilgsnio vėduoklė ant grindų: kiekvienas spindulys sustoja ties kliūtimi */
function drawGaze(c){ const cat = st.P.cat, R = cat.range || 6, F = cat.fov || 0.7, a0 = Math.atan2(c[3], c[2]), pos = st.gaze.geometry.attributes.position; st.gaze.visible = c[4]; if(!c[4]) return; pos.setXYZ(0, c[0], 0.035, c[1]);
  for(let i = 0; i <= GAZE_N; i++){ const a = a0 - F + 2 * F * i / GAZE_N, dx = Math.cos(a), dz = Math.sin(a); let d = 0.5; while(d < R && !L.blocked(st.obs, c[0], L.CAT_EYE, c[1], c[0] + dx * (d + 0.25), c[1] + dz * (d + 0.25)) && Math.abs(c[0] + dx * (d + 0.25)) < RW && Math.abs(c[1] + dz * (d + 0.25)) < RL) d += 0.25; pos.setXYZ(i + 1, c[0] + dx * d, 0.035, c[1] + dz * d); }
  pos.needsUpdate = true; }
function solidMesh(o, par){
  const sh = m => { m.castShadow = m.receiveShadow = true; return m; };
  if(o[0] === "c"){ const k = o[5], col = k === "sack" ? "#c9a36b" : CYL[Math.floor(SD.hs(o[1] * 7.3 + o[2] * 3.7) * CYL.length)]; return sh(SD.mesh(new THREE.CylinderGeometry(o[3], o[3] * (k === "sack" ? 0.86 : 1.04), o[4], 24), SD.std(col), o[1], o[4] / 2, o[2], par)); }
  const k = o[6], m = k === "#" ? SD.std("#ffffff", { map: tx.crate }) : k === "B" ? SD.std("#ffffff", { map: tx.push, emissive: 0x16305c }) : k === "S" ? SD.std("#ffffff", { map: tx.cheese, emissive: 0x4a3a08 }) : k === "X" ? SD.std("#ffffff", { map: tx.wall }) : SD.std("#8b5a2b");
  return sh(SD.mesh(new THREE.BoxGeometry(o[3], o[5], o[4]), m, o[1], o[5] / 2, o[2], par));
}
function buildRoom(){
  if(room){ hs.remove(room); room.traverse(o => { if(o.isMesh || o.isLine){ o.geometry.dispose(); o.material.dispose(); } if(o.isLight && o.shadow && o.shadow.map) o.shadow.map.dispose(); }); }
  room = new THREE.Group(); hs.add(room); const P = st.P, w = st.w, S = L.SHAPE; st.lampObjs = [];
  for(const o of P.fixed) solidMesh(o, room);
  st.mb = w.boxes.map(b => solidMesh(["b", cx(b[0]), cz(b[1]), S.B[1], S.B[2], S.B[3], "B"], room));
  st.mc = P.cheese.map(s => solidMesh(["b", cx(s[0]), cz(s[1]), S.S[1], S.S[2], S.S[3], "S"], room));
  st.ms = P.ropes.map(q => { const g = new THREE.Group(), sack = solidMesh(["c", 0, 0, S.sack[1], S.sack[2], "sack"], g); sack.castShadow = false; SD.mesh(new THREE.SphereGeometry(0.16, 10, 8), SD.std("#8a6a3a"), 0, 1.45, 0, g); g.position.set(cx(q[2]), 3.4, cz(q[3])); room.add(g);
    const peg = SD.mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.45, 8), SD.std("#d9c7a0", { emissive: 0x3a3320 }), cx(q[0]), 0.22, cz(q[1]), room); peg.castShadow = true;
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(cx(q[0]), 0.42, cz(q[1])), new THREE.Vector3(cx(q[2]), 4.9, cz(q[3]))]), new THREE.LineBasicMaterial({ color: 0xe9dcb8 })); room.add(line);
    const mark = SD.mesh(new THREE.RingGeometry(0.34, 0.44, 24), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35, side: THREE.DoubleSide }), cx(q[2]), 0.02, cz(q[3]), room); mark.rotation.x = -Math.PI / 2;
    return { g, sack, line, mark, y: 3.4, v: 0, fall: false }; });
  st.mk = P.cables.map(k => { const Lm = P.lamps[k[2]], g = new THREE.Group(), cm = SD.std("#15171f"), seg = (x1, z1, x2, z2) => { const len = Math.hypot(x2 - x1, z2 - z1); if(len < 0.01) return; const m = SD.mesh(new THREE.BoxGeometry(len + 0.07, 0.035, 0.07), cm, (x1 + x2) / 2, 0.02, (z1 + z2) / 2, g); m.rotation.y = -Math.atan2(z2 - z1, x2 - x1); };
    const x = cx(k[0]), z = cz(k[1]), wx = x < 0 ? -RW : RW; seg(Lm.x, Lm.z, x, Lm.z); seg(x, Lm.z, x, z); seg(x, z, wx, z);
    const plug = SD.mesh(new THREE.BoxGeometry(0.22, 0.1, 0.16), SD.std("#e5484d", { emissive: 0x4a1012 }), x, 0.05, z, g); room.add(g); return { g, plug }; });
  const wire = (k, col) => { const g = new THREE.Group(), cm = SD.std(col), x = cx(k[0]), z = cz(k[1]), seg = (x1, z1, x2, z2) => { const len = Math.hypot(x2 - x1, z2 - z1); if(len < 0.01) return; const m = SD.mesh(new THREE.BoxGeometry(len + 0.06, 0.03, 0.06), cm, (x1 + x2) / 2, 0.018, (z1 + z2) / 2, g); m.rotation.y = -Math.atan2(z2 - z1, x2 - x1); }; for(const i of k[2]){ const Lm = P.lamps[i]; seg(x, z, Lm.x, z); seg(Lm.x, z, Lm.x, Lm.z); } room.add(g); };
  for(const q of P.grates){ const m = SD.mesh(new THREE.PlaneGeometry(0.98, 0.98), new THREE.MeshStandardMaterial({ map: tx.grate, roughness: 0.6, metalness: 0.3 }), cx(q[0]), 0.014, cz(q[1]), room); m.rotation.x = -Math.PI / 2; m.receiveShadow = true; }
  st.mbt = P.buttons.map(k => { wire(k, "#b8651a"); SD.mesh(new THREE.CylinderGeometry(0.46, 0.48, 0.05, 28), SD.std("#5a3a1a"), cx(k[0]), 0.025, cz(k[1]), room); const cap = SD.mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.1, 28), SD.std("#f5871f", { emissive: 0x5a2a05 }), cx(k[0]), 0.09, cz(k[1]), room); return { cap, down: false }; });
  const post = (k, col) => { const g = new THREE.Group(); SD.mesh(new THREE.BoxGeometry(0.14, 0.95, 0.14), SD.std("#2b2f3a"), 0, 0.475, 0, g).castShadow = true; SD.mesh(new THREE.BoxGeometry(0.4, 0.46, 0.12), SD.std("#f4f1e8", { emissive: 0x3a382f }), 0, 0.95, 0.02, g); const knob = SD.mesh(new THREE.SphereGeometry(0.1, 12, 8), new THREE.MeshBasicMaterial({ color: col }), 0, 0.95, 0.12, g); g.position.set(cx(k[0]), 0, cz(k[1])); g.rotation.x = -0.35; g.scale.setScalar(1.35); room.add(g); return { g, knob }; };
  st.msw = P.switches.map(k => { wire(k, "#3b6fd6"); return post(k, 0x3b82f6); });
  st.mtm = P.timers.map(k => { wire(k, "#8b5cf6"); const o = post(k, 0x8b5cf6); const face = SD.mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.05, 20), new THREE.MeshBasicMaterial({ color: 0xffffff }), 0, 1.38, 0.02, o.g); face.rotation.x = Math.PI / 2; o.hand = SD.mesh(new THREE.BoxGeometry(0.04, 0.17, 0.02), new THREE.MeshBasicMaterial({ color: 0xe5484d }), 0, 1.38, 0.06, o.g); o.hand.geometry.translate(0, 0.07, 0); return o; });
  for(const Lm of P.lamps){ const sl = new THREE.SpotLight(0xfff0c4, 4.2, 0, Lm.cone, 0.14, 0); sl.castShadow = true; sl.shadow.mapSize.set(1024, 1024); sl.shadow.camera.near = 0.6; sl.shadow.camera.far = 22; sl.shadow.bias = -0.0008; room.add(sl); room.add(sl.target);
    const pole = SD.mesh(new THREE.CylinderGeometry(0.07, 0.09, 1, 8), SD.std("#2b2f3a"), Lm.x, 0.5, Lm.z, room); SD.mesh(new THREE.CylinderGeometry(0.34, 0.4, 0.14, 16), SD.std("#2b2f3a"), Lm.x, 0.07, Lm.z, room);
    const head = new THREE.Group(), shade = SD.mesh(new THREE.CylinderGeometry(0.42, 0.14, 0.5, 20, 1, true), SD.std("#1f6f8b", { side: THREE.DoubleSide, emissive: 0x0a2a36 }), 0, 0, 0, head); shade.geometry.rotateX(Math.PI / 2);
    const bulb = SD.mesh(new THREE.SphereGeometry(0.15, 12, 8), new THREE.MeshBasicMaterial({ color: 0xfff6c9 }), 0, 0, 0.1, head);
    const len = 1.9, cg = new THREE.ConeGeometry(Math.tan(Lm.cone) * len, len, 28, 1, true); cg.translate(0, -len / 2, 0); cg.rotateX(-Math.PI / 2); const cone = SD.mesh(cg, new THREE.MeshBasicMaterial({ color: 0xfff0b0, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }), 0, 0, 0, head);
    room.add(head); st.lampObjs.push({ L: Lm, sl, pole, head, bulb, cone }); }
  st.tubeObjs = P.tubes.map(([x, z], i) => { const g = new THREE.Group(); SD.mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.5, 12), new THREE.MeshBasicMaterial({ color: [0xe5484d, 0x3b82f6, 0xf7c948][i % 3] }), 0, 0, 0, g); SD.mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.14, 10), new THREE.MeshBasicMaterial({ color: 0xffffff }), 0, 0.3, 0, g); g.position.set(x, 0.45, z); g.rotation.z = 0.5; room.add(g); return g; });
  st.cat = null; if(P.cat){ const g = new THREE.Group(), om = SD.std("#f5871f", { emissive: 0x4a2606 }), part = (geo, x, y, z, sx, sy, sz) => { const m = SD.mesh(geo, om, x, y, z, g); if(sx) m.scale.set(sx, sy, sz); m.castShadow = true; return m; };
    part(new THREE.SphereGeometry(0.45, 16, 12), 0, 0.5, -0.1, 0.95, 1.05, 1.35); part(new THREE.SphereGeometry(0.3, 14, 10), 0, 1.0, 0.42); part(new THREE.ConeGeometry(0.1, 0.2, 6), -0.16, 1.32, 0.42); part(new THREE.ConeGeometry(0.1, 0.2, 6), 0.16, 1.32, 0.42);
    const tl = part(new THREE.CylinderGeometry(0.06, 0.04, 0.9, 6), 0, 0.75, -0.75); tl.rotation.x = -0.6; for(const sx of [-0.11, 0.11]) SD.mesh(new THREE.SphereGeometry(0.045, 8, 6), new THREE.MeshBasicMaterial({ color: 0xd8ff7a }), sx, 1.05, 0.69, g); room.add(g); st.cat = g;
    const gz = new THREE.BufferGeometry(); gz.setAttribute("position", new THREE.BufferAttribute(new Float32Array((GAZE_N + 2) * 3), 3)); const ix = []; for(let i = 1; i <= GAZE_N; i++) ix.push(0, i + 1, i); gz.setIndex(ix);
    st.gaze = new THREE.Mesh(gz, new THREE.MeshBasicMaterial({ color: 0xc8ff5a, transparent: true, opacity: 0.3, depthWrite: false, side: THREE.DoubleSide })); st.gaze.frustumCulled = false; st.gaze.renderOrder = 2; room.add(st.gaze); }
  syncLamps();
}
/* lempų ir valdiklių vaizdas pagal tai, kurios lempos dabar iš tikrųjų šviečia (st.on) */
function syncLamps(){ const P = st.P; st.lampObjs.forEach((o, i) => { const on = st.on[i]; o.sl.intensity = on ? 4.2 : 0; o.cone.visible = on; o.bulb.material.color.set(on ? 0xfff6c9 : 0x565b6e); });
  st.msw.forEach((o, i) => { const on = P.switches[i][2].some(k => st.w.on[k]); o.knob.position.y = on ? 1.02 : 0.88; o.knob.material.color.set(on ? 0xffd23f : 0x3b82f6); }); }

/* ---------- kambarių sąrašas ---------- */
function showPicker(){
  picking = true; st = null; keys.clear(); joy = null; if(room){ hs.remove(room); room = null; } mouse.visible = glow.visible = bang.visible = ring.visible = false; const P = prog(), done = ROOMS.filter(r => P[r.id]).length;
  $("mh").innerHTML = `<div class="rooms"><h3>${X.pickT}</h3><p>${X.pickS(done, ROOMS.length)}</p>${K.floors.map((f, fi) => `<h4>${X.floor[f.id].name} <small>${X.floor[f.id].sub}</small></h4><div class="rgrid">${ROOMS.filter(r => r.fi === fi).map(r => { const s = P[r.id] || 0, ok = open(r, P);
    return `<button type="button" class="rb${s ? " done" : ""}" data-r="${ROOMS.indexOf(r)}"${ok ? "" : " disabled"}><b>${r.ri + 1}</b><i>${"★".repeat(s)}${"☆".repeat(3 - s)}</i></button>`; }).join("")}</div>`).join("")}<p class="soon">${X.soon}</p></div>`;
  $("mh").firstChild.onclick = e => { const b = e.target.closest("[data-r]"); if(b && !b.disabled){ MK.sfx.tap(); startRoom(+b.dataset.r); } };
}
function startRoom(idx){
  const R = ROOMS[idx]; picking = false; mouse.visible = glow.visible = true;
  $("mh").innerHTML = `<div class="mtop"><div class="mcard" id="hR"></div><div class="mcard hearts" id="hH"></div><button type="button" class="hbtn" id="hRe" aria-label="${X.restart}" title="${X.restart}">↺</button></div><div class="mrow"><div class="mbar low" id="hBar"><i style="width:0"></i></div><div class="mcard" id="hT"></div><div class="mcard tmr" id="hC" hidden></div></div><div class="mmsg top" id="hMsg"></div><button type="button" class="abtn" id="hAct" disabled><b></b>${navigator.maxTouchPoints > 0 ? "" : `<small>${X.keyHint}</small>`}</button>`;
  $("hRe").onclick = () => { MK.sfx.tap(); reset(); }; $("hAct").addEventListener("pointerdown", e => { e.preventDefault(); press(); });
  st = { idx, R, P: L.parse(R.lv), fails: 0, over: false, t: 0, doneT: 0, msgT: 0, actKey: "?" }; reset(true); say(tipFor(R), "new"); st.msgT = 7; MK.sfx.whoosh();
}
const tipFor = R => X.tips[R.id] || "";   /* tik naujo dalyko paaiškinimas, ne sprendimo užuomina */
function reset(first){ st.w = L.world0(st.P); st.obs = L.obstacles(st.P, st.w); st.on = L.onAt(st.P, st.w, st.P.start[0], st.P.start[1], st.t); st.onKey = st.on.join(); st.tmrS = -1; st.x = st.P.start[0]; st.z = st.P.start[1]; st.face = Math.PI; st.meter = 0; st.safe = 0.2; st.got = 0; st.gn = null; st.doneT = 0; st.isLit = false; ring.visible = false; buildRoom(); hud(); if(!first) say(""); }
function start(){ init(); pose(); showPicker(); }
function stop(){ st = null; picking = false; keys.clear(); joy = null; if(joyEl){ joyEl.remove(); joyEl = null; } }
function back(){ if(picking || !st) return false; $("ov").innerHTML = ""; showPicker(); return true; }
function hud(){ const R = st.R, n = st.P.tubes.length; $("hR").innerHTML = `<small>${X.floor[K.floors[R.fi].id].name}</small>${X.room(R.ri + 1)}`; $("hT").textContent = X.tubes(st.got, n); $("hT").hidden = !n; const h = Math.max(0, 3 - st.fails); $("hH").textContent = "♥".repeat(h) + "♡".repeat(3 - h); }
function say(m, cls){ const e = $("hMsg"); if(!e) return; e.textContent = m || ""; e.className = "mmsg top " + (cls || ""); }
function fail(msg){ st.fails++; MK.sfx.bad(); reset(); say(msg, "bad"); st.msgT = 3; }
function win(){
  st.over = true; const R = st.R, idx = st.idx, n = st.P.tubes.length, stars = st.fails === 0 && st.got >= n ? 3 : st.fails <= 2 ? 2 : 1, nx = ROOMS[idx + 1]; saveRoom(R.id, stars);
  SD.result({ stars, title: X.won, lines: [X.wonL[stars - 1], X.res(st.got, n, st.fails)].concat(stars < 3 ? [X.hint3] : []), again: () => nx ? startRoom(idx + 1) : showPicker(), againT: nx ? X.next : X.rooms, menu: () => showPicker(), menuT: X.rooms });
}
/* ---------- veiksmai ---------- */
function unstuck(){ if(!L.solid(st.obs, st.P.lamps, st.x, st.z, MR)) return; for(let r = 0.1; r < 2; r += 0.1) for(let k = 0; k < 16; k++){ const x = st.x + Math.cos(k * 0.3927) * r, z = st.z + Math.sin(k * 0.3927) * r; if(!L.solid(st.obs, st.P.lamps, x, z, MR)){ st.x = x; st.z = z; return; } } }
function doAct(a){
  st.w = L.apply(st.P, st.w, a, st.t); st.obs = L.obstacles(st.P, st.w);
  if(a.type === "push") MK.sfx.whoosh(); else if(a.type === "cheese"){ st.mc[a.i].userData.gone = 1; MK.sfx.good(); } else if(a.type === "rope"){ const s = st.ms[a.i]; s.fall = true; s.line.visible = false; s.mark.visible = false; MK.sfx.whoosh(); }
  else if(a.type === "cable"){ const p = st.mk[a.i].plug.material; p.color.set("#565b6e"); p.emissive.set(0x000000); MK.sfx.good(); } else if(a.type === "switch") MK.sfx.tap(); else if(a.type === "timer") MK.sfx.whoosh();
  unstuck();
}
function press(){
  if(!st || st.over || st.doneT > 0) return; const a = L.action(st.P, st.w, st.x, st.z); if(!a) return;
  if(a.type === "push"){ if(a.ok) doAct(a); else { MK.sfx.bad(); say(X.stuck, "bad"); st.msgT = 1.6; } } else if(a.type === "switch" || a.type === "timer") doAct(a); else if(!st.gn){ st.gn = { type: a.type, i: a.i, t: 0 }; MK.sfx.tap(); }
}
function gnawSpot(g){ const P = st.P; if(g.type === "cheese") return [cx(P.cheese[g.i][0]), 2.3, cz(P.cheese[g.i][1])]; if(g.type === "rope") return [cx(P.ropes[g.i][0]), 1.2, cz(P.ropes[g.i][1])]; return [cx(P.cables[g.i][0]), 1.0, cz(P.cables[g.i][1])]; }
function frame(dt){
  if(!st || st.over) return; st.t += dt; const P = st.P, t = st.t;
  for(const o of st.lampObjs){ const Lm = o.L, a = L.lampAngle(Lm, t), h = L.lampH(Lm, t); o.sl.position.set(Lm.x, h, Lm.z); o.sl.target.position.set(Lm.x + Math.cos(a) * Lm.reach, 0, Lm.z + Math.sin(a) * Lm.reach); o.pole.scale.y = h; o.pole.position.y = h / 2; o.head.position.set(Lm.x, h, Lm.z); o.head.lookAt(o.sl.target.position); }
  for(const g of st.tubeObjs) if(g.visible) g.rotation.y += dt * 2.5;
  st.mb.forEach((m, i) => { const b = st.w.boxes[i], k = Math.min(1, dt * 14); m.position.x += (cx(b[0]) - m.position.x) * k; m.position.z += (cz(b[1]) - m.position.z) * k; });
  for(const m of st.mc) if(m.userData.gone && m.visible){ m.userData.gone += dt * 5; const k = Math.max(0, 2 - m.userData.gone); m.scale.set(k, k, k); m.position.y = 0.85 * k; if(k <= 0) m.visible = false; }
  for(const s of st.ms) if(s.fall && s.y > 0){ s.v += dt * 30; s.y = Math.max(0, s.y - s.v * dt); s.g.position.y = s.y; if(s.y === 0){ s.sack.castShadow = true; MK.sfx.bad(); } }
  let cat = null; if(P.cat){ cat = L.catPos(P.cat, t); st.cat.position.set(cat[0], cat[4] ? Math.abs(Math.sin(t * 6)) * 0.05 : 0, cat[1]); st.cat.rotation.y = Math.atan2(cat[2], cat[3]); drawGaze(cat); }
  if(st.doneT > 0){ st.doneT -= dt; if(st.doneT <= 0) return win(); }
  else {
    let vx = (keys.has("R") ? 1 : 0) - (keys.has("L") ? 1 : 0), vz = (keys.has("D") ? 1 : 0) - (keys.has("U") ? 1 : 0); if(joy){ vx += joy.vx; vz += joy.vz; } const vl = Math.hypot(vx, vz);
    if(vl > 0.08){ const k = Math.min(1, vl) / vl * SPEED * dt, nx = st.x + vx * k, nz = st.z + vz * k; if(!L.solid(st.obs, P.lamps, nx, st.z, MR)) st.x = nx; if(!L.solid(st.obs, P.lamps, st.x, nz, MR)) st.z = nz; st.face = Math.atan2(vx, vz); st.hop = (st.hop || 0) + dt * 13; }
    for(const g of st.tubeObjs) if(g.visible && Math.hypot(g.position.x - st.x, g.position.z - st.z) < 0.6){ g.visible = false; st.got++; MK.sfx.star(st.got); say(X.tube, "good"); st.msgT = 1.2; hud(); }
    /* veiksmo mygtukas ir graužimas */
    const a = L.action(P, st.w, st.x, st.z), ak = a ? (a.type === "push" ? "push" : a.type === "switch" || a.type === "timer" ? "sw" : "gnaw") : ""; if(ak !== st.actKey){ st.actKey = ak; const b = $("hAct"); b.disabled = !ak; b.firstChild.textContent = ak ? X.act[ak] : X.act.none; }
    if(st.gn){ if(!a || a.type !== st.gn.type || a.i !== st.gn.i){ st.gn = null; ring.visible = false; } else { const p = gnawSpot(st.gn); st.gn.t += dt; st.face = Math.atan2(p[0] - st.x, p[2] - st.z); st.hop = (st.hop || 0) + dt * 30; ring.position.set(p[0], p[1], p[2]); ring.visible = true; drawRing(Math.min(1, st.gn.t / L.T_GNAW)); if(st.gn.t >= L.T_GNAW){ st.gn = null; ring.visible = false; doAct(a); } } }
    /* kurios lempos dabar šviečia: jungikliai, mygtukai (dėžė ar pati pelytė), laikmačiai, žybsėjimas */
    const on = L.onAt(P, st.w, st.x, st.z, t), ok2 = on.join(); if(ok2 !== st.onKey){ st.on = on; st.onKey = ok2; syncLamps(); }
    st.mbt.forEach((o, i) => { const d = L.pressed(P, st.w, i, st.x, st.z); if(d !== o.down){ o.down = d; MK.sfx.tap(); } o.cap.position.y += ((d ? 0.035 : 0.09) - o.cap.position.y) * Math.min(1, dt * 18); });
    let left = -1; P.timers.forEach((k, i) => { const r = st.w.tmr[i] - t; if(r > 0) left = Math.max(left, r); st.mtm[i].hand.rotation.z = r > 0 ? -r / k[3] * Math.PI * 2 : 0; }); const ls = left > 0 ? Math.ceil(left) : -1; if(ls !== st.tmrS){ st.tmrS = ls; const e = $("hC"); e.hidden = ls < 0; if(ls >= 0){ e.textContent = X.timer(ls); MK.sfx.tap(); } }
    /* šviesa ir katinas */
    const lamp = st.safe > 0 ? false : L.lit(cat ? L.withCat(st.obs, P.cat, t) : st.obs, P.lamps, st.on, st.x, st.z, t), eyes = !!cat && st.safe <= 0 && L.catSees(st.obs, P.cat, cat, st.x, st.z); st.isLit = lamp || eyes; if(st.safe > 0) st.safe -= dt;
    st.meter = Math.max(0, Math.min(1, st.meter + (eyes ? dt / L.T_CAT : lamp ? dt / L.T_SEE : -dt / L.T_HIDE)));
    if(st.meter >= 1) fail(eyes ? X.catSaw : X.seen); else if(cat && st.safe <= 0 && Math.hypot(cat[0] - st.x, cat[1] - st.z) < L.CAT_TOUCH) fail(X.cat);
    else if(L.atDoor(st.x, st.z)){ st.doneT = 1.0; say(X.door, "good"); st.msgT = 1.2; MK.sfx.good(); }
  }
  const bar = $("hBar"); if(bar) bar.firstChild.style.width = st.meter * 100 + "%";
  if(st.msgT > 0){ st.msgT -= dt; if(st.msgT <= 0) say(""); }
  mouse.position.set(st.x, 0, st.z); glow.position.set(st.x, 0.02, st.z); glow.material.opacity = st.isLit ? 0 : 1; mouse.rotation.y += Math.atan2(Math.sin(st.face - mouse.rotation.y), Math.cos(st.face - mouse.rotation.y)) * Math.min(1, dt * 12); mouse.userData.body.position.y = Math.abs(Math.sin(st.hop || 0)) * 0.07;
  bang.visible = !!st.isLit; bang.position.set(st.x, 1.25 + Math.sin(t * 16) * 0.05, st.z);
}
function render(){ SD.renderer.render(hs, hcam); }
function key(e, up){
  if(!st) return; if(!up && (e.key === " " || e.key === "Enter" || e.key === "e")){ if(e.preventDefault) e.preventDefault(); if(!e.repeat) press(); return; } if(!up && e.key === "r"){ reset(); return; }
  const k = { ArrowLeft: "L", a: "L", ArrowRight: "R", d: "R", ArrowUp: "U", w: "U", ArrowDown: "D", s: "D" }[e.key]; if(!k) return; if(e.preventDefault) e.preventDefault(); if(up) keys.delete(k); else keys.add(k);
}
addEventListener("keyup", e => { if(st) key(e, true); }); addEventListener("blur", () => keys.clear());
/* vairalazdė: atsiranda ten, kur paliečiamas ekranas */
const gl = $("gl");
gl.addEventListener("pointerdown", e => { if(!st || st.over) return; joy = { x: e.clientX, y: e.clientY, vx: 0, vz: 0, id: e.pointerId }; if(!joyEl || !joyEl.isConnected){ joyEl = document.createElement("div"); joyEl.className = "joy"; joyEl.innerHTML = "<i></i>"; $("mh").appendChild(joyEl); } joyEl.style.left = e.clientX + "px"; joyEl.style.top = e.clientY + "px"; joyEl.hidden = false; joyEl.firstChild.style.transform = ""; try { gl.setPointerCapture(e.pointerId); } catch(_){} });
gl.addEventListener("pointermove", e => { if(!st || !joy || e.pointerId !== joy.id) return; let dx = (e.clientX - joy.x) / 44, dy = (e.clientY - joy.y) / 44; const l = Math.hypot(dx, dy); if(l > 1){ dx /= l; dy /= l; } joy.vx = dx; joy.vz = dy; if(joyEl) joyEl.firstChild.style.transform = `translate(${dx * 30}px,${dy * 30}px)`; });
const jend = e => { if(joy && e.pointerId !== joy.id) return; joy = null; if(joyEl) joyEl.hidden = true; }; gl.addEventListener("pointerup", jend); gl.addEventListener("pointercancel", jend);
SD.MODES.slepynes = { start, stop, frame, render, key, back, resize: pose, get st(){ return st; }, api: { L, ROOMS, startRoom, press, reset, showPicker } };
