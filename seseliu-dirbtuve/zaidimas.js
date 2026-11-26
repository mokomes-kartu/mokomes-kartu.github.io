/* Šešėlių dirbtuvė – žaidimo eiga ir 3D vaizdas (Three.js r160, MIT; biblioteka bendra su „Slibino sala“). */
import * as THREE from "/slibino-sala/three.module.min.js";
const T = window.MK_T, D = window.MK_DAIKTAI, MK = window.MK;
const GAME = "seseliu-dirbtuve", CKEY = "mk-" + GAME + "-kelione", $ = id => document.getElementById(id);
const rad = d => d * Math.PI / 180, TAU = Math.PI * 2, EL_MIN = rad(36), EL_MAX = rad(72), HALF = 3.6, LR = 2.9, PLASTER = "#efece5";
const DMAP = {}; D.forEach(([id, parts]) => { DMAP[id] = parts; });
/* „Lempos pamoka“ – trumpas įvadas (senosios užduotys); pagrindiniai režimai – atskiruose failuose (teatras.js, molbertas.js, slepynes.js) */
const LEVELS = [{ id: "ivadas", kinds: ["dir", "len", "lamp", "spot", "tone", "len"], n: 6, col: "#f5871f", paper: "#fff6e3", wall: ["#ffd9a8", "#f7b267"], fixed: true }];
const MODES = {}, MODE_LIST = [["teatras", "#8b5cf6"], ["molbertas", "#2bb3a3"], ["slepynes", "#3b5bdb"], ["ivadas", "#f5871f"]];
let MODE = null, ovAgain = null;
const store = () => Object.assign({ seen: [] }, MK.get(CKEY, {}));
const lightDir = (az, el, v) => (v || new THREE.Vector3()).set(Math.cos(el) * Math.cos(az), Math.sin(el), Math.cos(el) * Math.sin(az));
const angDiff = (a, b) => { let d = (a - b) % TAU; if(d > Math.PI) d -= TAU; if(d < -Math.PI) d += TAU; return d; };
const rnd = (a, b) => a + Math.random() * (b - a);

/* ============================== meniu ============================== */
const STAR = on => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.4l3 6.1 6.7 1-4.9 4.7 1.2 6.7L12 17.7l-6 3.2 1.2-6.7L2.3 9.5l6.7-1z" fill="${on ? "#ffd23f" : "#fff"}" stroke="#2b2f3a" stroke-width="1.8" stroke-linejoin="round"/></svg>`;
function showMenu(){
  if(MODE){ MODE.stop && MODE.stop(); MODE = null; } S = null; $("game").hidden = true; $("game").dataset.mode = ""; $("mh").innerHTML = ""; $("app").hidden = false; $("ov").innerHTML = "";
  const best = MK.best(GAME), C = store();
  $("ll").innerHTML = MODE_LIST.map(([id, col], i) => { const t = T.modes[id], st = +best[id] || 0;
    return `<button class="lc" type="button" data-m="${id}"><span class="dot" style="background:${col}">${i + 1}</span><span><b>${t.name}</b><span class="s">${t.sub}</span></span><span class="st">${[0, 1, 2].map(k => STAR(k < st)).join("")}</span></button>`; }).join("");
  $("seen").textContent = T.seen(C.seen.filter(id => DMAP[id]).length, D.length); window.scrollTo(0, 0);
}
$("ll").addEventListener("click", e => { const b = e.target.closest("[data-m]"); if(!b) return; MK.sfx.tap(); if(b.dataset.m === "ivadas") start(0); else startMode(b.dataset.m); });
function startMode(name){
  if(!MODES[name]) return; $("app").hidden = true; $("game").hidden = false;
  if(!initWorld()){ $("game").hidden = true; $("app").hidden = false; alert("WebGL"); return; }
  clearTask(); S = null; MODE = MODES[name]; $("game").dataset.mode = name; $("ov").innerHTML = ""; say(""); $("hint").textContent = ""; $("ord").textContent = ""; $("bMain").hidden = true; sliders(false, false);
  lampG.visible = lampArm.visible = lampBase.visible = true; outline.visible = false; lastT = performance.now(); MODE.name = name; MODE.start();
}
/* bendras režimo pabaigos langas */
function result(o){
  MK.best(GAME, o.key, o.stars); if(o.stars >= 2) MK.sfx.win(); if(o.stars === 3 && MK.confetti) MK.confetti(60); ovAgain = o.again;
  $("ov").innerHTML = `<div class="rc" role="dialog"><h3>${o.title}</h3><div class="st">${[0, 1, 2].map(k => STAR(k < o.stars)).join("")}</div>${o.lines.map(l => `<p>${l}</p>`).join("")}<div class="bt"><button class="pri" type="button" data-a="again">${T.rep.again}</button><button type="button" data-a="menu">${T.rep.menu}</button></div></div>`;
}
function seenAdd(ids){ const C = store(); let n = 0; for(const id of ids) if(!C.seen.includes(id)){ C.seen.push(id); n++; } if(C.seen.length >= D.length) C.seen = ids.slice(); MK.set(CKEY, C); return n; }

/* ============================== 3D pasaulis ============================== */
let renderer, scene, camera, camT, amb, sun, ready = false, paper, outline, wall, rug, lampG, lampArm, lampBase, beam, glow, dust, objs = [], cands = [], marks = [], pins = [], stars = [];
const ray = new THREE.Raycaster(), nm3 = new THREE.Matrix3(), v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), v3 = new THREE.Vector3();
const cnv = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d")]; };
const tex = c => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
const std = (c, o) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.85, metalness: 0 }, o || {}));
const mesh = (g, m, x, y, z, p) => { const o = new THREE.Mesh(g, m); o.position.set(x || 0, y || 0, z || 0); if(p) p.add(o); return o; };
const hs = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

function partMesh(p, plaster){
  let g; const seg = p.n || 30;
  if(p.t === "L") g = new THREE.LatheGeometry(p.pts.map(q => new THREE.Vector2(Math.max(0.0005, q[0]), q[1])), 36);
  else if(p.t === "S") g = new THREE.SphereGeometry(p.r, 30, 22);
  else if(p.t === "I") g = new THREE.IcosahedronGeometry(p.r, 1);
  else if(p.t === "C") g = new THREE.CylinderGeometry(p.rt, p.rb, p.h, seg);
  else if(p.t === "B") g = new THREE.BoxGeometry(p.w, p.h, p.d);
  else if(p.t === "T"){ g = new THREE.TorusGeometry(p.R, p.r, 14, 44, p.arc || TAU); if(!p.up) g.rotateX(Math.PI / 2); }
  else { g = new THREE.ExtrudeGeometry(new THREE.Shape(p.pts.map(q => new THREE.Vector2(q[0], q[1]))), { depth: p.d, bevelEnabled: false }); g.translate(0, 0, -p.d / 2); }
  const m = new THREE.Mesh(g, std(plaster ? PLASTER : p.c, { flatShading: p.t === "I" || (p.t === "C" && seg <= 12), side: p.t === "L" ? THREE.DoubleSide : THREE.FrontSide }));
  if(p.p) m.position.set(p.p[0], p.p[1], p.p[2]); if(p.rot) m.rotation.set(p.rot[0], p.rot[1], p.rot[2]); if(p.s) m.scale.set(p.s[0], p.s[1], p.s[2]);
  m.castShadow = m.receiveShadow = true; return m;
}
function buildObj(id, plaster, fit){
  const g = new THREE.Group(), inner = new THREE.Group(); DMAP[id].forEach(p => inner.add(partMesh(p, plaster))); g.add(inner);
  const bx = new THREE.Box3().setFromObject(inner, true), sz = bx.getSize(new THREE.Vector3()), c = bx.getCenter(new THREE.Vector3());
  const s = Math.min(fit.h / sz.y, fit.w / Math.max(sz.x, sz.z)); inner.scale.setScalar(s); inner.position.set(-c.x * s, -bx.min.y * s, -c.z * s);
  g.userData = { id, h: sz.y * s, r: Math.max(sz.x, sz.z) * s / 2 }; return g;
}
function disposeObj(o){ o.traverse(m => { if(m.isMesh || m.isSprite){ m.isMesh && m.geometry && m.geometry.dispose(); if(m.material){ m.material.map && m.material.map.dispose(); m.material.dispose(); } } }); }

function wallTex(a, b){
  const [c, g] = cnv(1024, 512), gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(0, 0, 1024, 512);
  g.fillStyle = "rgba(255,255,255,.10)"; for(let i = 0; i < 26; i++){ g.beginPath(); g.arc(hs(i) * 1024, hs(i + 50) * 512, 30 + hs(i + 9) * 90, 0, 7); g.fill(); }
  /* langas */
  g.fillStyle = "#fffdf2"; g.strokeStyle = "#2b2f3a"; g.lineWidth = 8; g.beginPath(); g.roundRect(70, 120, 230, 300, 16); g.fill(); g.stroke();
  const sk = g.createLinearGradient(0, 130, 0, 410); sk.addColorStop(0, "#9fd8ff"); sk.addColorStop(1, "#eafaff"); g.fillStyle = sk; g.fillRect(84, 134, 202, 272);
  g.fillStyle = "#fff6c2"; g.beginPath(); g.arc(240, 190, 34, 0, 7); g.fill(); g.fillStyle = "#fff"; for(const [x, y, r] of [[130, 300, 24], [160, 290, 30], [195, 304, 22]]){ g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
  g.beginPath(); g.moveTo(185, 126); g.lineTo(185, 414); g.moveTo(76, 270); g.lineTo(294, 270); g.stroke();
  /* paveikslai */
  const frame = (x, y, w, h, fn) => { g.fillStyle = "#fff8ea"; g.strokeStyle = "#2b2f3a"; g.lineWidth = 8; g.beginPath(); g.rect(x, y, w, h); g.fill(); g.stroke(); g.save(); g.beginPath(); g.rect(x + 8, y + 8, w - 16, h - 16); g.clip(); fn(); g.restore(); };
  frame(400, 150, 150, 190, () => { g.fillStyle = "#f7c948"; g.beginPath(); g.arc(475, 215, 34, 0, 7); g.fill(); g.fillStyle = "#3b82f6"; g.beginPath(); g.moveTo(420, 320); g.lineTo(475, 250); g.lineTo(530, 320); g.fill(); g.fillStyle = "rgba(43,47,58,.25)"; g.beginPath(); g.ellipse(500, 322, 46, 9, 0, 0, 7); g.fill(); });
  frame(610, 190, 190, 140, () => { g.fillStyle = "#bfe8c9"; g.fillRect(610, 190, 190, 140); g.fillStyle = "#e5484d"; g.beginPath(); g.arc(670, 270, 30, 0, 7); g.fill(); g.fillStyle = "#f5871f"; g.beginPath(); g.arc(728, 280, 24, 0, 7); g.fill(); g.fillStyle = "rgba(43,47,58,.25)"; g.beginPath(); g.ellipse(716, 306, 62, 9, 0, 0, 7); g.fill(); });
  frame(850, 130, 120, 160, () => { g.fillStyle = "#8b5cf6"; g.fillRect(880, 180, 60, 80); g.fillStyle = "#6d43d8"; g.beginPath(); g.moveTo(940, 180); g.lineTo(958, 166); g.lineTo(958, 246); g.lineTo(940, 260); g.fill(); g.fillStyle = "#a98bf8"; g.beginPath(); g.moveTo(880, 180); g.lineTo(898, 166); g.lineTo(958, 166); g.lineTo(940, 180); g.fill(); });
  /* grindjuostė */
  g.fillStyle = "#2b2f3a"; g.fillRect(0, 488, 1024, 24); g.fillStyle = "rgba(43,47,58,.12)"; g.fillRect(0, 440, 1024, 48); return tex(c);
}
function floorTex(){
  const [c, g] = cnv(1024, 1024); g.fillStyle = "#c58f5c"; g.fillRect(0, 0, 1024, 1024);
  for(let y = 0; y < 1024; y += 32) for(let x = -64; x < 1024; x += 128){ const o = (y / 32) % 2 ? 64 : 0, k = hs(x * 0.7 + y * 3.1); g.fillStyle = `hsl(${26 + k * 6},${44 + k * 10}%,${52 + k * 12}%)`; g.fillRect(x + o + 1, y + 1, 126, 30); }
  const v = g.createRadialGradient(512, 512, 200, 512, 512, 720); v.addColorStop(0, "rgba(60,30,10,0)"); v.addColorStop(1, "rgba(60,30,10,.55)"); g.fillStyle = v; g.fillRect(0, 0, 1024, 1024); return tex(c);
}
function rugTex(col){
  const [c, g] = cnv(512, 512); g.clearRect(0, 0, 512, 512); [[250, col], [226, "#fff8ea"], [212, col], [150, "#fff8ea"], [140, "#2b2f3a"], [134, col]].forEach(([r, f]) => { g.fillStyle = f; g.beginPath(); g.arc(256, 256, r, 0, 7); g.fill(); });
  g.fillStyle = "rgba(0,0,0,.18)"; g.beginPath(); g.arc(256, 256, 128, 0, 7); g.fill(); return tex(c);
}
function paperTex(){
  const [c, g] = cnv(512, 512); g.fillStyle = "#fff"; g.fillRect(0, 0, 512, 512); for(let i = 0; i < 2600; i++){ g.fillStyle = `rgba(120,110,90,${0.03 + hs(i) * 0.05})`; g.fillRect(hs(i * 1.7) * 512, hs(i * 2.9 + 3) * 512, 2, 2); }
  g.strokeStyle = "rgba(43,47,58,.5)"; g.lineWidth = 6; g.beginPath(); g.arc(256, 256, 250, 0, 7); g.stroke(); return tex(c);
}
function woodTex(){
  const [c, g] = cnv(512, 512); g.fillStyle = "#b9824f"; g.fillRect(0, 0, 512, 512); g.strokeStyle = "rgba(90,50,20,.28)"; for(let r = 10; r < 380; r += 9 + hs(r) * 8){ g.lineWidth = 1.5 + hs(r + 1) * 2.5; g.beginPath(); g.ellipse(256 + hs(r) * 14, 256, r, r * (0.92 + hs(r + 2) * 0.1), 0, 0, 7); g.stroke(); } return tex(c);
}
function labelTex(text, bg, fg, ring){
  const [c, g] = cnv(128, 160);
  if(ring){ g.strokeStyle = "#fff"; g.lineWidth = 11; g.beginPath(); g.arc(64, 128, 20, 0, 7); g.stroke(); g.strokeStyle = bg; g.lineWidth = 6; g.beginPath(); g.arc(64, 128, 20, 0, 7); g.stroke(); }
  g.fillStyle = bg; g.strokeStyle = "#fff"; g.lineWidth = 7; g.beginPath(); g.arc(64, 52, 42, 0, 7); g.fill(); g.stroke(); if(ring){ g.beginPath(); g.moveTo(52, 90); g.lineTo(64, 106); g.lineTo(76, 90); g.fill(); }
  g.fillStyle = fg; g.font = '900 54px "Trebuchet MS",Verdana,sans-serif'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(text, 64, 55); return tex(c);
}
function initWorld(){
  if(ready) return true;
  try { renderer = new THREE.WebGLRenderer({ canvas: $("gl"), antialias: true, powerPreference: "high-performance" }); } catch(e){ return false; }
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  scene = new THREE.Scene(); scene.background = new THREE.Color("#3a2a1e");
  camera = new THREE.PerspectiveCamera(46, 1, 0.5, 140); camT = camera.clone();
  amb = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.8); scene.add(amb);
  sun = new THREE.DirectionalLight(0xfff3da, 2.5); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); const sc = sun.shadow.camera; sc.left = -4.6; sc.right = 4.6; sc.top = 4.6; sc.bottom = -4.6; sc.near = 2; sc.far = 28; sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.025; scene.add(sun); scene.add(sun.target);
  /* kambarys */
  const floor = mesh(new THREE.PlaneGeometry(46, 46), new THREE.MeshBasicMaterial({ map: floorTex() }), 0, -3.4, 0); floor.rotation.x = -Math.PI / 2; scene.add(floor);
  rug = mesh(new THREE.PlaneGeometry(15, 15), new THREE.MeshBasicMaterial({ transparent: true }), 0, -3.38, 0); rug.rotation.x = -Math.PI / 2; scene.add(rug);
  wall = mesh(new THREE.PlaneGeometry(46, 23), new THREE.MeshBasicMaterial({ color: 0xffffff }), 0, 8.1, -12); scene.add(wall);
  /* stalas ir lapas */
  const tm = new THREE.MeshStandardMaterial({ map: woodTex(), roughness: 0.7 }), top = mesh(new THREE.CylinderGeometry(3.95, 3.85, 0.3, 64), [std("#9a6a3c"), tm, std("#9a6a3c")], 0, -0.16, 0); top.receiveShadow = true; scene.add(top);
  scene.add(mesh(new THREE.CylinderGeometry(0.5, 0.7, 3.1, 20), std("#7a5230"), 0, -1.85, 0)); scene.add(mesh(new THREE.CylinderGeometry(1.8, 2.0, 0.2, 28), std("#7a5230"), 0, -3.3, 0));
  paper = mesh(new THREE.CircleGeometry(HALF, 72), new THREE.MeshStandardMaterial({ map: paperTex(), roughness: 0.95 }), 0, 0.004, 0); paper.rotation.x = -Math.PI / 2; paper.receiveShadow = true; scene.add(paper);
  outline = mesh(new THREE.PlaneGeometry(HALF * 2, HALF * 2), new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false }), 0, 0.012, 0); outline.rotation.x = -Math.PI / 2; outline.visible = false; outline.renderOrder = 2; scene.add(outline);
  /* dirbtuvės daiktai aplink: molbertas, kėdutė su dažais, teptukų indas */
  const prop = new THREE.Group(); scene.add(prop); const lam = c => new THREE.MeshLambertMaterial({ color: c });
  const ez = new THREE.Group(); ez.position.set(6.6, -3.4, -6.2); ez.rotation.y = -0.5; prop.add(ez);
  for(const s of [-1, 1]){ const l = mesh(new THREE.BoxGeometry(0.22, 8, 0.22), lam("#8b5a2b"), s * 1.3, 3.9, 0, ez); l.rotation.z = -s * 0.14; } const bl = mesh(new THREE.BoxGeometry(0.22, 8, 0.22), lam("#7a4d24"), 0, 3.8, -1.2, ez); bl.rotation.x = -0.3;
  mesh(new THREE.BoxGeometry(3.6, 0.2, 0.5), lam("#8b5a2b"), 0, 2.4, 0.2, ez); mesh(new THREE.BoxGeometry(3.3, 4.2, 0.14), lam("#fffaf0"), 0, 4.6, 0.12, ez);
  const [pc, pg] = cnv(256, 320); pg.fillStyle = "#fffaf0"; pg.fillRect(0, 0, 256, 320); pg.fillStyle = "#e5484d"; pg.beginPath(); pg.arc(110, 170, 62, 0, 7); pg.fill(); pg.fillStyle = "rgba(43,47,58,.35)"; pg.beginPath(); pg.arc(130, 185, 62, -0.6, 1.9); pg.arc(110, 170, 62, 1.2, -0.2, true); pg.fill(); pg.fillStyle = "rgba(43,47,58,.3)"; pg.beginPath(); pg.ellipse(170, 248, 70, 14, 0, 0, 7); pg.fill();
  mesh(new THREE.PlaneGeometry(3.0, 3.9), new THREE.MeshBasicMaterial({ map: tex(pc) }), 0, 4.6, 0.2, ez);
  const st = new THREE.Group(); st.position.set(-6.4, -3.4, -5.4); prop.add(st); mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.25, 20), lam("#c99a6b"), 0, 2.2, 0, st); for(let i = 0; i < 3; i++){ const a = i * 2.1; mesh(new THREE.CylinderGeometry(0.12, 0.16, 2.2, 8), lam("#8b5a2b"), Math.cos(a) * 0.85, 1.1, Math.sin(a) * 0.85, st); }
  [["#e5484d", -0.5, 0.2], ["#3b82f6", 0.45, 0.3], ["#f7c948", 0, -0.5]].forEach(([c, x, z]) => { mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.7, 16), lam("#d7dce6"), x, 2.68, z, st); mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.06, 16), lam(c), x, 3.04, z, st); });
  const jar = new THREE.Group(); jar.position.set(-4.4, -3.4, 5.6); prop.add(jar); mesh(new THREE.CylinderGeometry(0.6, 0.5, 1.2, 16), lam("#2bb3a3"), 0, 0.6, 0, jar); [["#e5484d", 0.2, 0.25], ["#f7c948", -0.25, -0.2], ["#8b5cf6", 0.05, -0.3]].forEach(([c, x, rz], i) => { const b = mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.2, 6), lam("#c99a6b"), x, 1.7, i * 0.12 - 0.1, jar); b.rotation.z = rz; mesh(new THREE.SphereGeometry(0.13, 8, 6), lam(c), x - Math.sin(rz) * 1.1, 1.7 + Math.cos(rz) * 1.1, i * 0.12 - 0.1, jar); });
  /* lempa */
  lampG = new THREE.Group(); scene.add(lampG);
  const shade = mesh(new THREE.CylinderGeometry(0.5, 0.15, 0.62, 28, 1, true), std("#1f6f8b", { side: THREE.DoubleSide, roughness: 0.5, emissive: 0x0a2a36 }), 0, 0, 0, lampG); shade.geometry.rotateX(Math.PI / 2);
  mesh(new THREE.SphereGeometry(0.17, 14, 10), new THREE.MeshBasicMaterial({ color: 0xfff6c9 }), 0, 0, 0.12, lampG); mesh(new THREE.SphereGeometry(0.16, 12, 8), std("#14495c"), 0, 0, -0.33, lampG);
  const rim = mesh(new THREE.TorusGeometry(0.5, 0.035, 8, 28), std("#ffd23f", { emissive: 0x7a5a00 }), 0, 0, 0.31, lampG);
  const [gc, gg] = cnv(128, 128), rg = gg.createRadialGradient(64, 64, 0, 64, 64, 64); rg.addColorStop(0, "rgba(255,246,190,.95)"); rg.addColorStop(0.35, "rgba(255,226,120,.4)"); rg.addColorStop(1, "rgba(255,226,120,0)"); gg.fillStyle = rg; gg.fillRect(0, 0, 128, 128);
  glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex(gc), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); glow.scale.set(2.2, 2.2, 1); glow.position.z = 0.2; lampG.add(glow);
  beam = mesh(new THREE.CylinderGeometry(1.5, 0.3, 2.6, 28, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff0b0, transparent: true, opacity: 0.075, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }), 0, 0, 1.6, lampG); beam.geometry.rotateX(Math.PI / 2);
  lampArm = mesh(new THREE.BufferGeometry(), std("#2b2f3a", { roughness: 0.5 })); scene.add(lampArm);
  lampBase = mesh(new THREE.CylinderGeometry(0.34, 0.4, 0.22, 18), std("#2b2f3a", { roughness: 0.5 })); scene.add(lampBase);
  /* dulkelės šviesoje */
  const N = 70, dp = new Float32Array(N * 3); for(let i = 0; i < N; i++){ dp[i * 3] = rnd(-3.5, 3.5); dp[i * 3 + 1] = rnd(0.3, 4); dp[i * 3 + 2] = rnd(-3.5, 3.5); }
  const dg = new THREE.BufferGeometry(); dg.setAttribute("position", new THREE.BufferAttribute(dp, 3)); const [fc, fg] = cnv(32, 32), fr = fg.createRadialGradient(16, 16, 0, 16, 16, 16); fr.addColorStop(0, "rgba(255,250,220,1)"); fr.addColorStop(1, "rgba(255,250,220,0)"); fg.fillStyle = fr; fg.fillRect(0, 0, 32, 32);
  dust = new THREE.Points(dg, new THREE.PointsMaterial({ map: tex(fc), size: 0.09, transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending })); scene.add(dust);
  /* žvaigždutės pavykus */
  const [sc2, sg2] = cnv(64, 64); sg2.fillStyle = "#ffd23f"; sg2.strokeStyle = "#fff"; sg2.lineWidth = 4; sg2.beginPath(); for(let i = 0; i < 10; i++){ const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 12 : 28; sg2[i ? "lineTo" : "moveTo"](32 + Math.cos(a) * r, 32 + Math.sin(a) * r); } sg2.closePath(); sg2.fill(); sg2.stroke();
  const sm = new THREE.SpriteMaterial({ map: tex(sc2), transparent: true, depthWrite: false, depthTest: false });
  for(let i = 0; i < 22; i++){ const s = new THREE.Sprite(sm); s.visible = false; s.userData = { t: 9 }; s.renderOrder = 5; scene.add(s); stars.push(s); }
  resize(); ready = true; return true;
}
function resize(){ if(!renderer) return; const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = camT.aspect = w / h; camera.updateProjectionMatrix(); camT.updateProjectionMatrix(); if(S) frameCam(true); if(MODE && MODE.resize) MODE.resize(); }
addEventListener("resize", resize);
/* kameros vieta: toli – matyti visas stalas ir lempa; arti – daiktas ir jo šešėlis */
function camPose(near, out){
  const asp = innerWidth / innerHeight, th = Math.tan(rad(23)), need = near ? 2.5 : 3.75, d = Math.max(need / (th * asp), (near ? 3.4 : 5.5) / th), pitch = rad(asp < 1 ? 40 : 34);
  const ty = asp < 1 ? (near ? 0.75 : 0.5) : (near ? 0.3 : 0.9); out.position.set(0, ty + d * Math.sin(pitch), d * Math.cos(pitch)); out.lookAt(0, ty, 0); out.updateMatrixWorld(); return out;
}
function frameCam(snap){ camPose(S && S.task && S.task.near, camT); if(snap){ camera.position.copy(camT.position); camera.quaternion.copy(camT.quaternion); } }
let LAZ = 1, LEL = 1;
function setLamp(az, el, free){
  LAZ = az; LEL = free ? el : Math.max(EL_MIN, Math.min(EL_MAX, el)); if(S){ S.az = LAZ; S.el = LEL; } const l = lightDir(LAZ, LEL, v1); syncSliders();
  sun.position.copy(l).multiplyScalar(14); sun.target.position.set(0, 0, 0);
  lampG.position.copy(l).multiplyScalar(LR).setY(l.y * LR + 0.9); lampG.lookAt(0, 0.9, 0);
  const bx = Math.cos(LAZ) * 3.72, bz = Math.sin(LAZ) * 3.72; lampBase.position.set(bx, 0.11, bz);
  const p = lampG.position, curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(bx, 0.2, bz), new THREE.Vector3(bx * 1.12, p.y + 0.9, bz * 1.12), new THREE.Vector3(p.x - l.x * 0.3 + 0, p.y - l.y * 0.3 + 0.02, p.z - l.z * 0.3));
  lampArm.geometry.dispose(); lampArm.geometry = new THREE.TubeGeometry(curve, 18, 0.055, 7);
}
/* punktyru pažymėtas plotas: daiktų šešėlis, kai lempa tikslo vietoje */
function shadowMask(list, az, el, N){
  const [c, g] = cnv(N, N), l = lightDir(az, el), kx = l.x / l.y, kz = l.z / l.y, sc = N / (2 * HALF), P = [0, 0, 0, 0, 0, 0];
  g.fillStyle = g.strokeStyle = "#000"; g.lineWidth = 2; g.lineJoin = "round"; g.beginPath();
  for(const o of list) o.traverse(m => { if(!m.isMesh) return; const a = m.geometry.attributes.position, ix = m.geometry.index, n = ix ? ix.count : a.count;
    for(let i = 0; i < n; i += 3){ for(let k = 0; k < 3; k++){ const j = ix ? ix.getX(i + k) : i + k; v1.fromBufferAttribute(a, j).applyMatrix4(m.matrixWorld); P[k * 2] = (v1.x - v1.y * kx) * sc + N / 2; P[k * 2 + 1] = (v1.z - v1.y * kz) * sc + N / 2; }
      if((P[2] - P[0]) * (P[5] - P[1]) - (P[3] - P[1]) * (P[4] - P[0]) < 0){ g.moveTo(P[0], P[1]); g.lineTo(P[4], P[5]); g.lineTo(P[2], P[3]); } else { g.moveTo(P[0], P[1]); g.lineTo(P[2], P[3]); g.lineTo(P[4], P[5]); } g.closePath(); } });
  g.fill(); g.stroke(); return c;
}
function outlineTex(az, el){
  const N = 1024, c = shadowMask(objs, az, el, N), g = c.getContext("2d");
  const d = g.getImageData(0, 0, N, N).data, [oc, og] = cnv(N, N), od = og.createImageData(N, N), q = od.data, edge = [];
  for(let y = 1; y < N - 1; y++) for(let x = 1; x < N - 1; x++){ const i = (y * N + x) * 4 + 3; if(d[i] < 128) continue; q[i - 3] = 255; q[i - 2] = 140; q[i - 1] = 30; q[i] = 64;
    if(d[i - 4] < 128 || d[i + 4] < 128 || d[i - N * 4] < 128 || d[i + N * 4] < 128) edge.push(x, y); }
  og.putImageData(od, 0, 0);
  for(const [col, r] of [["#ffffff", 9.5], ["#ff6a00", 6.4]]){ og.fillStyle = col; for(let i = 0; i < edge.length; i += 2){ const x = edge[i], y = edge[i + 1]; if(((x / 27 | 0) + (y / 35 | 0)) % 2) continue; og.beginPath(); og.arc(x, y, r, 0, 7); og.fill(); } }
  return tex(oc);
}
/* šviesumas taške: 0 – šešėlis, 1 – paviršius atsuktas tiesiai į lempą */
function meshes(){ const a = []; for(const o of objs) o.traverse(m => { if(m.isMesh) a.push(m); }); return a; }
function shadowed(p, l, ms){ ray.set(v3.copy(p).addScaledVector(l, 0.03), l); ray.far = 30; return ray.intersectObjects(ms, false).length > 0; }
function valueAt(hit, l, ms, viewDir){
  const n = v2.copy(hit.face.normal).applyMatrix3(nm3.getNormalMatrix(hit.object.matrixWorld)).normalize(); if(n.dot(viewDir) > 0) n.negate();
  const nl = n.dot(l), p = hit.point.clone().addScaledVector(n, 0.02); if(nl <= 0) return { v: 0, nl, p };
  const b = shadowed(p, l, ms); return { v: b ? 0 : nl, nl, p, blocked: b };
}
function castAt(ndcX, ndcY, cam, ms){ ray.setFromCamera({ x: ndcX, y: ndcY }, cam); ray.far = 200; const h = ray.intersectObjects(ms, false); return h.length ? { hit: h[0], dir: ray.ray.direction.clone() } : { dir: ray.ray.direction.clone(), org: ray.ray.origin.clone() }; }
function sprite(t, scale, center){ const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthTest: false, depthWrite: false })); s.scale.set(scale * 0.8, scale, 1); if(center) s.center.set(center[0], center[1]); s.renderOrder = 6; scene.add(s); return s; }
function clearTask(){
  for(const o of objs.concat(cands, marks, pins)){ scene.remove(o); disposeObj(o); } objs = []; cands = []; marks = []; pins = [];
  if(outline.material.map){ outline.material.map.dispose(); outline.material.map = null; } outline.visible = false;
}

/* ============================== užduotys ============================== */
let S = null, lastT = 0;
function start(li){
  $("app").hidden = true; $("game").hidden = false;
  if(!initWorld()){ $("game").hidden = true; $("app").hidden = false; alert("WebGL"); return; }
  const lv = LEVELS[li]; let seq = []; while(seq.length < lv.n) seq = seq.concat(MK.shuffle(lv.kinds)); seq = seq.slice(0, lv.n);
  if(lv.fixed) seq = lv.kinds.slice(); $("game").dataset.mode = "ivadas"; $("mh").innerHTML = "";
  S = { li, lv, seq, ti: -1, pts: 0, fresh: 0, used: [], az: 1, el: 1, t: 0, task: null, drag: null };
  paper.material.color.set(lv.paper); if(wall.material.map) wall.material.map.dispose(); wall.material.map = wallTex(lv.wall[0], lv.wall[1]); wall.material.needsUpdate = true;
  if(rug.material.map) rug.material.map.dispose(); rug.material.map = rugTex(lv.col); rug.material.needsUpdate = true;
  lastT = performance.now(); nextTask(); frameCam(true);
}
function pickObjs(n, tall, plaster, fit){
  const C = store(), out = []; let bag = MK.shuffle(D.map(d => d[0]).filter(id => !C.seen.includes(id) && !S.used.includes(id)));
  if(bag.length < n * 4) bag = bag.concat(MK.shuffle(D.map(d => d[0]).filter(id => !S.used.includes(id) && !bag.includes(id))));
  for(const id of bag){ if(out.length >= n) break; const o = buildObj(id, plaster, fit); if(tall && o.userData.h < fit.h * 0.6){ disposeObj(o); continue; } out.push(o); }
  return out;
}
function commitObjs(){ const C = store(); for(const o of objs){ const id = o.userData.id; S.used.push(id); if(!C.seen.includes(id)){ C.seen.push(id); S.fresh++; } } if(C.seen.length >= D.length) C.seen = objs.map(o => o.userData.id); MK.set(CKEY, C); }
function nextTask(){
  S.ti++; if(S.ti >= S.lv.n) return finish();
  clearTask(); const lv = S.lv, kind = S.seq[S.ti], combo = lv.combo, plaster = lv.plaster || (combo && kind === "tone"), tall = kind === "dir" || kind === "len" || kind === "lamp";
  const n = combo ? (tall ? 2 : MK.pick([2, 3])) : 1, fit = n === 1 ? { h: 2.1, w: 2.5 } : n === 2 ? { h: 1.7, w: 1.6 } : { h: 1.45, w: 1.3 };
  const pos = n === 1 ? [[0, 0]] : n === 2 ? [[-1.0, 0.25], [1.0, -0.25]] : [[-1.2, 0.45], [1.2, 0.3], [0, -0.9]];
  const place = () => { objs = pickObjs(n, tall, plaster, fit); objs.forEach((o, i) => { o.position.set(pos[i][0], 0, pos[i][1]); o.rotation.y = rnd(-0.5, 0.5); scene.add(o); o.updateMatrixWorld(true); }); }; place();
  paper.material.color.set(plaster ? PLASTER : lv.paper);
  const t = S.task = { kind, h: Math.max(...objs.map(o => o.userData.h)), miss: 0, done: false, step: 0, near: kind === "spot" || kind === "tone", inT: 0 };
  frameCam(false); lampG.visible = lampArm.visible = lampBase.visible = true;
  const azBack = () => rad(rnd(128, 412)); /* ne iš priekio – kad šešėlio neuždengtų pats daiktas */
  if(kind === "dir"){ t.el = rad(MK.pick([42, 50, 58])); t.az = azBack(); setLamp(t.az + rnd(1.5, 4.7), t.el); }
  else if(kind === "len"){ t.az = azBack(); t.el = rad(rnd(38, 68)); setLamp(t.az + rnd(1.3, 5), t.el > rad(53) ? rad(rnd(37, 43)) : rad(rnd(63, 70))); }
  else if(kind === "lamp"){
    const low = Math.random() < 0.5; t.az = azBack(); t.el = rad(low ? rnd(37, 42) : rnd(62, 68)); const other = rad(low ? rnd(64, 70) : rnd(37, 41));
    t.cands = MK.shuffle([{ az: t.az, el: t.el, ok: 1 }, { az: t.az + Math.PI, el: t.el, why: "lampOpp" }, { az: t.az, el: other, why: low ? "lampHigh" : "lampLow" }, { az: t.az + Math.PI / 2, el: rad(rnd(40, 64)), why: "lampSide" }, { az: t.az - Math.PI / 2, el: rad(rnd(40, 64)), why: "lampSide" }]);
    setLamp(t.az, t.el); lampG.visible = lampArm.visible = lampBase.visible = false;
    t.cands.forEach((c, i) => { const l = lightDir(c.az, c.el), g = new THREE.Group(); g.position.copy(l).multiplyScalar(LR).setY(l.y * LR + 0.9);
      mesh(new THREE.SphereGeometry(0.3, 16, 12), new THREE.MeshBasicMaterial({ color: 0xd9dee8 }), 0, 0, 0, g); mesh(new THREE.SphereGeometry(0.34, 16, 12), new THREE.MeshBasicMaterial({ color: 0x2b2f3a, side: THREE.BackSide }), 0, 0, 0, g);
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: labelTex(String(i + 1), "#2b2f3a", "#fff"), transparent: true, depthTest: false })); s.scale.set(0.66, 0.82, 1); s.center.set(0.5, 0.675); s.renderOrder = 6; g.add(s); c.g = g; scene.add(g); cands.push(g); });
  } else {
    /* šviesa iš priekio ir šono, kad matytųsi ir šviesioji, ir tamsioji pusė */
    let ok = false;
    for(let oi = 0; oi < 4 && !ok; oi++){
      if(oi){ objs.forEach(o => { scene.remove(o); disposeObj(o); }); place(); t.h = Math.max(...objs.map(o => o.userData.h)); }
      for(let k = 0; k < 10 && !ok; k++){ t.az = rad(Math.random() < 0.5 ? rnd(-12, 42) : rnd(138, 192)); t.el = rad(rnd(40, 58)); setLamp(t.az, t.el); ok = kind === "spot" ? prepSpot(t) : prepTone(t, combo ? 4 : 3); }
    }
    if(!ok){ S.seq[S.ti] = "lamp"; S.ti--; return nextTask(); }
  }
  if(kind === "dir" || kind === "len"){ outline.material.map = outlineTex(t.az, t.el); outline.material.color.set(0xffffff); outline.material.needsUpdate = true; outline.visible = true; }
  commitObjs(); objs.forEach(o => { o.userData.in = 0; o.scale.setScalar(0.001); });
  hud(); MK.sfx.whoosh();
}
function samples(t, withTable){
  const ms = meshes(), l = lightDir(t.az, t.el), out = [], G = 26;
  for(let i = 0; i < G; i++) for(let j = 0; j < G; j++){
    const x = -0.82 + 1.64 * (i + 0.5) / G, y = -0.62 + 1.24 * (j + 0.5) / G, c = castAt(x, y, camT, ms);
    if(c.hit){ const r = valueAt(c.hit, l, ms, c.dir); if(r.blocked) continue; out.push({ v: r.v, nl: r.nl, p: r.p, obj: 1, sx: x, sy: y, k: i * 100 + j }); }
    else if(withTable && c.dir.y < -0.05){ const k = -c.org.y / c.dir.y, p = c.org.clone().addScaledVector(c.dir, k); if(Math.hypot(p.x, p.z) > 2.3) continue; p.y = 0.02;
      const sh = [[0, 0], [0.2, 0], [-0.2, 0], [0, 0.2], [0, -0.2]].map(([a, b]) => shadowed(v2.set(p.x + a, 0.02, p.z + b), l, ms)); if(sh.some(s => s !== sh[0])) continue;
      out.push({ v: sh[0] ? 0 : l.y, nl: l.y, p, obj: 0, sx: x, sy: y }); }
  }
  return out;
}
function prepSpot(t){
  const s = samples(t, false); if(s.length < 12) return false; const vs = s.map(a => a.v).sort((a, b) => a - b); t.vmax = vs[Math.floor(vs.length * 0.9)];
  const darks = s.filter(a => a.nl < -0.25); if(t.vmax < 0.6 || darks.length < 6) return false;
  /* atsakymui parodyti imamas taškas srities viduryje, ne ant krašto */
  const map = {}; s.forEach(a => { map[a.k] = a; }); const inner = (a, f) => [1, -1, 100, -100].reduce((m, d) => Math.min(m, map[a.k + d] ? f(map[a.k + d]) : -1), 9), pickIn = (list, f) => list.reduce((b, a) => inner(a, f) > inner(b, f) ? a : b, list[0]);
  t.best = pickIn(s.filter(a => a.v >= t.vmax), a => a.v); t.dark = pickIn(darks, a => -a.v - (a.nl < -0.25 ? 0 : 1)); return true;
}
function prepTone(t, want){
  const s = MK.shuffle(samples(t, true)), ok = a => a.obj ? (a.nl >= 0.3 || a.nl <= -0.2) : true, far = (a, list) => list.every(b => Math.hypot((a.sx - b.sx) * innerWidth, (a.sy - b.sy) * innerHeight) / 2 > 54);
  const vmax = Math.max(...s.map(a => a.v)), pick = []; const add = f => { const c = s.find(a => ok(a) && f(a) && far(a, pick) && pick.every(b => Math.abs(b.v - a.v) >= 0.2)); if(c) pick.push(c); return !!c; };
  if(!add(a => a.obj && a.v >= vmax - 0.08) || !add(a => a.v === 0) || !add(a => a.v > 0.28 && a.v < vmax - 0.25)) return false;
  if(want > 3) add(a => a.v > 0.2);
  t.marks = MK.shuffle(pick).map((a, i) => ({ v: a.v, p: a.p, name: "ABCD"[i], done: false })); t.order = t.marks.slice().sort((a, b) => b.v - a.v).map(m => m.name);
  t.marks.forEach(m => { const sp = sprite(labelTex(m.name, "#2b2f3a", "#fff", true), 0.74, [0.5, 0.2]); sp.position.copy(m.p); m.s = sp; marks.push(sp); });
  return true;
}
function hud(){
  const t = S.task, lv = S.lv, coarse = matchMedia("(pointer:coarse)").matches, many = objs.length > 1;
  $("insL").textContent = T.modes.ivadas.name + " · " + T.hud.task(S.ti + 1, lv.n); sliders(drag0(t), !t.done && t.kind === "len", () => { const f = $("msg").firstChild; if(f && f.className !== "good") say(""); });
  $("insB").textContent = t.kind === "spot" ? T.ins[(t.step ? "spot2" : "spot1") + (many ? "m" : "")] : T.ins[t.kind];
  $("objN").textContent = objs.map(o => T.daiktai[o.userData.id]).join(" · ");
  $("pPts").innerHTML = STAR(true) + " " + S.pts; $("bExit").setAttribute("aria-label", T.btn.exit);
  const b = $("bMain"), drag = t.kind === "dir" || t.kind === "len";
  b.hidden = !(t.done || drag); b.textContent = t.done ? (S.ti + 1 >= lv.n ? T.btn.finish : T.btn.next) : T.btn.check; b.className = t.done ? "next" : "";
  $("hint").textContent = t.done ? "" : drag ? T.hint[t.kind + (coarse ? "T" : "K")] : T.hint[t.kind];
  $("ord").textContent = t.kind === "tone" && t.marks && t.marks.some(m => m.done) ? T.hud.order + " " + t.marks.filter(m => m.done).sort((a, b) => a.n - b.n).map(m => m.name).join(" → ") : "";
}
const drag0 = t => !t.done && (t.kind === "dir" || t.kind === "len");
function say(text, cls){ $("msg").innerHTML = text ? `<span class="${cls || ""}">${text}</span>` : ""; }
function burst(p){ stars.forEach((s, i) => { const a = i / stars.length * TAU; s.position.copy(p); s.userData = { t: 0, vx: Math.cos(a) * rnd(1, 2.6), vy: rnd(2.5, 5), vz: Math.sin(a) * rnd(1, 2.6) }; s.visible = true; }); }
function done(msg, revealed){
  const t = S.task; t.done = true; const pts = revealed ? 0 : Math.max(1, 3 - t.miss); S.pts += pts; say(msg, revealed ? "bad" : "good");
  if(!revealed){ MK.sfx.good(); burst(v1.set(0, t.h + 0.3, 0)); } hud();
}
function miss(msg){ const t = S.task; t.miss++; MK.sfx.bad(); say(msg, "bad"); return t.miss >= 3; }
function check(){
  const t = S.task; if(t.done || (t.kind !== "dir" && t.kind !== "len")) return;
  const tip = (az, el) => [-Math.cos(az) / Math.tan(el) * t.h, -Math.sin(az) / Math.tan(el) * t.h], a = tip(S.az, S.el), b = tip(t.az, t.el), d = Math.hypot(a[0] - b[0], a[1] - b[1]), tol = 0.1 * t.h + 0.06;
  if(d <= tol){ outline.material.color.set(0x7dff9b); S.goto = { az: t.az, el: t.el }; return done(t.kind === "dir" ? T.fb.okDir : T.fb.okLen); }
  const da = Math.abs(angDiff(S.az, t.az)), m = da > rad(28) ? T.fb.missSide : d < tol * 2.2 || t.kind === "dir" ? T.fb.missNear : S.el > t.el ? T.fb.missShort : T.fb.missLong;
  if(miss(m)){ S.goto = { az: t.az, el: t.el }; done(T.fb.reveal, true); }
}
function pickCand(i){
  const t = S.task, c = t.cands[i]; if(t.done || !c || c.tried) return; c.tried = true;
  const show = () => { cands.forEach(g => { g.visible = false; }); lampG.visible = lampArm.visible = lampBase.visible = true; };
  if(c.ok){ show(); return done(T.fb.okLamp); }
  c.g.children[0].material.color.set(0xff9d94); if(miss(T.fb[c.why])){ show(); done(T.fb.reveal, true); }
}
function pin(p, ok){ const s = sprite(labelTex(ok ? "✓" : "✕", ok ? "#2fbf71" : "#e5484d", "#fff", true), 0.6, [0.5, 0.2]); s.position.copy(p); pins.push(s); }
function tapSpot(x, y){
  const t = S.task, ms = meshes(); let c = castAt(x / innerWidth * 2 - 1, -(y / innerHeight) * 2 + 1, camera, ms);
  for(const [ox, oy] of [[9, 0], [-9, 0], [0, 9], [0, -9]]){ if(c.hit) break; c = castAt((x + ox) / innerWidth * 2 - 1, -((y + oy) / innerHeight) * 2 + 1, camera, ms); }
  if(!c.hit){ say(T.fb.spotMiss, "new"); return; }
  const l = lightDir(t.az, t.el), r = valueAt(c.hit, l, ms, c.dir);
  /* piršto tikslumas: vertinama ir artimiausia aplinka */
  for(const [ox, oy] of [[8, 0], [-8, 0], [0, 8], [0, -8]]){ const c2 = castAt((x + ox) / innerWidth * 2 - 1, -((y + oy) / innerHeight) * 2 + 1, camera, ms); if(!c2.hit) continue; const r2 = valueAt(c2.hit, l, ms, c2.dir); if(t.step === 0 ? r2.v > r.v : r2.v < r.v) r.v = r2.v; }
  if(t.step === 0){ if(r.v >= t.vmax - 0.12){ pin(r.p, true); t.step = 1; MK.sfx.good(); say(T.fb.okSpot1, "good"); hud(); } else { pin(r.p, false); if(miss(T.fb.noSpot1)){ pin(t.best.p, true); t.step = 1; t.rev = true; say(T.fb.reveal, "bad"); hud(); } } }
  else { if(r.v <= 0.06){ pin(r.p, true); done(T.fb.okSpot2, t.rev); } else { pin(r.p, false); if(miss(T.fb.noSpot2)){ pin(t.dark.p, true); done(T.fb.reveal, true); } } }
}
function tapMark(name){
  const t = S.task, m = t.marks.find(a => a.name === name); if(t.done || !m || m.done) return; const k = t.marks.filter(a => a.done).length;
  if(t.order[k] === name){ m.done = true; m.n = k; m.s.material.map.dispose(); m.s.material.map = labelTex(String(k + 1), "#2fbf71", "#fff", true); MK.sfx.tap();
    if(k + 2 >= t.marks.length){ const last = t.marks.find(a => !a.done); last.done = true; last.n = k + 1; last.s.material.map.dispose(); last.s.material.map = labelTex(String(k + 2), "#2fbf71", "#fff", true); done(T.fb.toneDone); } else { say(T.fb.toneOk, "good"); hud(); } }
  else if(miss(T.fb.toneNo)){ t.order.forEach((nm, i) => { const a = t.marks.find(q => q.name === nm); a.done = true; a.n = i; a.s.material.map.dispose(); a.s.material.map = labelTex(String(i + 1), "#2fbf71", "#fff", true); }); done(T.fb.reveal, true); }
}
function nearest(list, x, y, lim){ let bi = -1, bd = lim; list.forEach((o, i) => { if(o.visible === false) return; v1.setFromMatrixPosition(o.matrixWorld).project(camera); const d = Math.hypot((v1.x + 1) / 2 * innerWidth - x, (1 - v1.y) / 2 * innerHeight - (o.isSprite ? 16 : 0) - y); if(d < bd){ bd = d; bi = i; } }); return bi; }
function tap(x, y){
  const t = S.task; if(!t || t.done) return;
  if(t.kind === "lamp"){ const i = nearest(cands, x, y, 54); if(i >= 0) pickCand(i); }
  else if(t.kind === "spot") tapSpot(x, y);
  else if(t.kind === "tone"){ const i = nearest(t.marks.map(m => m.s), x, y, 50); if(i >= 0) tapMark(t.marks[i].name); }
}
function finish(){
  const max = S.lv.n * 3, st = S.pts >= max * 0.85 ? 3 : S.pts >= max * 0.55 ? 2 : 1, R = T.rep; MK.best(GAME, S.lv.id, st); S.task = null; say(""); sliders(false, false);
  if(st >= 2) MK.sfx.win(); if(st === 3 && MK.confetti) MK.confetti(60);
  $("ov").innerHTML = `<div class="rc" role="dialog"><h3>${R.title}</h3><div class="st">${[0, 1, 2].map(k => STAR(k < st)).join("")}</div><p>${R.line[st - 1]}</p><p>${R.points(S.pts, max)}${S.fresh ? "<br>" + R.fresh(S.fresh) : ""}</p><div class="bt"><button class="pri" type="button" data-a="again">${R.again}</button><button type="button" data-a="menu">${R.menu}</button></div></div>`;
}
$("ov").addEventListener("click", e => { const b = e.target.closest("[data-a]"); if(!b) return; MK.sfx.tap(); $("ov").innerHTML = ""; if(b.dataset.a === "again"){ if(MODE && ovAgain) ovAgain(); else start(0); } else showMenu(); });

/* ============================== valdymas ============================== */
/* lempa valdoma dviem atskirais slankikliais: apačioje – sukimas aplink, dešinėje – aukštis (judesiai nesimaišo) */
let onLamp = null;
function sliders(az, el, cb){ $("slAz").hidden = !az; $("slEl").hidden = !el; onLamp = cb || null; syncSliders(); }
function syncSliders(){ const a = ((LAZ - Math.PI / 2) / TAU % 1 + 1.5) % 1, e = (LEL - EL_MIN) / (EL_MAX - EL_MIN); $("slAz").firstElementChild.style.left = (1 - a) * 100 + "%"; $("slEl").firstElementChild.style.top = (1 - Math.max(0, Math.min(1, e))) * 100 + "%"; }
function bindSlider(el, vert){
  const set = e => { const r = el.getBoundingClientRect(), k = Math.max(0, Math.min(1, vert ? (e.clientY - r.top) / r.height : (e.clientX - r.left) / r.width));
    if(vert) setLamp(LAZ, EL_MIN + (1 - k) * (EL_MAX - EL_MIN)); else setLamp(Math.PI / 2 + (0.5 - k) * TAU, LEL); if(S) S.goto = null; onLamp && onLamp(); };
  let on = false; el.addEventListener("pointerdown", e => { on = true; try { el.setPointerCapture(e.pointerId); } catch(_){} set(e); e.preventDefault(); });
  el.addEventListener("pointermove", e => { if(on) set(e); }); ["pointerup", "pointercancel"].forEach(ev => el.addEventListener(ev, () => { on = false; }));
}
bindSlider($("slAz"), false); bindSlider($("slEl"), true);
const gl = $("gl");
gl.addEventListener("pointerdown", e => { if(!S || !S.task) return; S.drag = { x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, moved: 0 }; try { gl.setPointerCapture(e.pointerId); } catch(_){} });
gl.addEventListener("pointermove", e => { const d = S && S.drag; if(!d || !S.task) return; d.moved += Math.abs(e.clientX - d.x) + Math.abs(e.clientY - d.y); d.x = e.clientX; d.y = e.clientY; });
const up = e => { const d = S && S.drag; if(!d) return; S.drag = null; if(d.moved < 10 && e.type === "pointerup") tap(e.clientX, e.clientY); };
gl.addEventListener("pointerup", up); gl.addEventListener("pointercancel", up);
$("bMain").addEventListener("click", () => { if(!S || !S.task) return; MK.sfx.tap(); if(S.task.done){ say(""); nextTask(); } else check(); });
$("bExit").addEventListener("click", () => { MK.sfx.tap(); clearTask(); showMenu(); });
addEventListener("keydown", e => {
  if($("game").hidden) return; if($("ov").innerHTML){ if(e.key === "Enter"){ const b = $("ov").querySelector(".pri"); b && b.click(); } return; }
  if(MODE){ if(e.key === "Escape") showMenu(); else MODE.key && MODE.key(e); return; }
  if(!S) return; const t = S.task; if(!t) return; const drag = !t.done && (t.kind === "dir" || t.kind === "len");
  if(e.key === "Escape"){ clearTask(); showMenu(); }
  else if(e.key === "Enter" || e.key === " "){ e.preventDefault(); $("bMain").hidden || $("bMain").click(); }
  else if(drag && (e.key === "ArrowLeft" || e.key === "ArrowRight")){ e.preventDefault(); S.goto = null; setLamp(S.az + (e.key === "ArrowLeft" ? 1 : -1) * rad(4), S.el); }
  else if(drag && t.kind === "len" && (e.key === "ArrowUp" || e.key === "ArrowDown")){ e.preventDefault(); S.goto = null; setLamp(S.az, S.el + (e.key === "ArrowUp" ? 1 : -1) * rad(3)); }
  else if(t.kind === "lamp" && /^[1-5]$/.test(e.key)) pickCand(+e.key - 1);
  else if(t.kind === "tone" && /^[a-dA-D]$/.test(e.key)) tapMark(e.key.toUpperCase());
});
document.addEventListener("visibilitychange", () => { lastT = performance.now(); });

/* ============================== kadras ============================== */
let TIME = 0;
function ambient(dt){
  glow.material.opacity = 0.85 + Math.sin(TIME * 3) * 0.1; beam.material.opacity = 0.07 + Math.sin(TIME * 1.7) * 0.012;
  const da = dust.geometry.attributes.position; for(let i = 0; i < da.count; i++){ let y = da.getY(i) + dt * (0.05 + (i % 5) * 0.02); if(y > 4.2) y = 0.3; da.setY(i, y); da.setX(i, da.getX(i) + Math.sin(TIME * 0.6 + i) * dt * 0.05); } da.needsUpdate = true;
  for(const s of stars){ const q = s.userData; if(q.t > 1){ s.visible = false; continue; } q.t += dt; q.vy -= 9 * dt; s.position.x += q.vx * dt; s.position.y += q.vy * dt; s.position.z += q.vz * dt; const z = 0.42 * (1 - q.t * 0.6); s.scale.set(z, z, 1); }
}
function frame(now){
  requestAnimationFrame(frame); if(!ready || (!S && !MODE)) return;
  const dt = Math.min(0.05, (now - lastT) / 1000 || 0) * (window.__sd.ts || 1); lastT = now; TIME += dt;
  if(MODE){ MODE.frame(dt); if(!MODE) return; const k = Math.min(1, dt * 4.5); camera.position.lerp(camT.position, k); camera.quaternion.slerp(camT.quaternion, k); ambient(dt); if(MODE.render) MODE.render(); else renderer.render(scene, camera); return; }
  S.t += dt;
  if(S.goto){ const da = angDiff(S.goto.az, S.az), de = S.goto.el - S.el, k = Math.min(1, dt * 5); setLamp(S.az + da * k, S.el + de * k); if(Math.abs(da) + Math.abs(de) < 0.004) S.goto = null; }
  for(const o of objs){ const u = o.userData; if(u.in < 1){ u.in = Math.min(1, u.in + dt / 0.55); const k = u.in, e = 1 - Math.pow(1 - k, 3), b = 1 + Math.sin(k * Math.PI) * 0.18; o.scale.set(e * (2 - b), e * b, e * (2 - b)); o.position.y = (1 - e) * 1.6; } }
  const k = Math.min(1, dt * 4.5); camera.position.lerp(camT.position, k); camera.quaternion.slerp(camT.quaternion, k);
  ambient(dt);
  for(const m of marks) if(m.visible){ const s = 0.74 * (1 + Math.sin(S.t * 4 + m.position.x * 3) * 0.05); m.scale.set(s * 0.8, s, 1); }
  for(const g of cands){ const z = 1 + Math.sin(S.t * 3 + g.position.x) * 0.06; g.scale.setScalar(z); }
  if(outline.visible && !(S.task && S.task.done)) outline.material.opacity = 0.82 + Math.sin(S.t * 3.2) * 0.18; else outline.material.opacity = 1;
  renderer.render(scene, camera);
}

/* ============================== paleidimas ============================== */
$("app").prepend(MK.top({ title: T.title, grade: 7 }));
$("h1").textContent = T.h1; $("lead").textContent = T.lead; $("note").textContent = T.note(D.length); $("llT").textContent = T.levelsT; $("slAzT").textContent = T.sl.az; $("slElT").textContent = T.sl.el; $("lrT").textContent = T.learnT; $("gr").textContent = T.grade;
$("lr").innerHTML = T.learn.map(m => `<details class="lr"><summary>${m.name}</summary>${m.html}</details>`).join("");
/* derinimui: daiktų apžiūra tinkleliu ir užduoties sprendimas */
window.MK_SD = { THREE, T, D, DMAP, MK, $, GAME, rad, rnd, TAU, HALF, PLASTER, EL_MIN, EL_MAX, STAR, MODES, hs, cnv, tex, std, mesh, lightDir, angDiff, buildObj, disposeObj, labelTex, shadowMask, setLamp, sliders, say, burst, result, seenAdd, showMenu,
  get renderer(){ return renderer; }, get scene(){ return scene; }, get camera(){ return camera; }, get camT(){ return camT; }, get sun(){ return sun; }, get amb(){ return amb; }, get paper(){ return paper; }, get lamp(){ return [lampG, lampArm, lampBase]; }, get laz(){ return LAZ; }, get lel(){ return LEL; }, get time(){ return TIME; },
  theme(paperCol, w0, w1, rugCol){ paper.material.color.set(paperCol); if(wall.material.map) wall.material.map.dispose(); wall.material.map = wallTex(w0, w1); wall.material.needsUpdate = true; if(rug.material.map) rug.material.map.dispose(); rug.material.map = rugTex(rugCol); rug.material.needsUpdate = true; } };
window.__sd = { ts: 1, get mode(){ return MODE; }, startMode, get S(){ return S; }, D, LEVELS, check, tap, setLamp, pickCand, tapMark, get objs(){ return objs; }, get camera(){ return camera; }, get camT(){ return camT; },
  grid(from, n, plaster){ clearTask(); S.task = null; lampG.visible = lampArm.visible = lampBase.visible = false; paper.visible = false; const cols = 6; const pl = mesh(new THREE.PlaneGeometry(40, 40), std("#f4f1ea"), 0, 0.001, 0); pl.rotation.x = -Math.PI / 2; pl.receiveShadow = true; scene.add(pl); objs.push(pl);
    for(let i = 0; i < n && from + i < D.length; i++){ const o = buildObj(D[from + i][0], plaster, { h: 1.8, w: 2.2 }); o.position.set((i % cols - (cols - 1) / 2) * 2.7, 0, (Math.floor(i / cols) - 1.5) * 3.3); scene.add(o); objs.push(o); }
    sc0(); setLamp(rad(60), rad(52)); camT.position.set(0, 15, 19); camT.lookAt(0, 0, -0.5); camera.position.copy(camT.position); camera.quaternion.copy(camT.quaternion); } };
function sc0(){ const c = sun.shadow.camera; c.left = -9; c.right = 9; c.top = 9; c.bottom = -9; c.updateProjectionMatrix(); }
showMenu(); requestAnimationFrame(frame);
