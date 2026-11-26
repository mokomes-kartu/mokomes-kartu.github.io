/* Žodžių slalomas – žaidimo eiga ir 3D vaizdas (Three.js r160, MIT; biblioteka bendra su „Slibino sala“). */
import * as THREE from "/slibino-sala/three.module.min.js";
const T = window.MK_T, Z = window.MK_ZODZIAI, MK = window.MK;
const GAME = "zodziu-slalomas", CKEY = "mk-" + GAME + "-kelione";
const $ = id => document.getElementById(id);
/* trasos posūkiai: vaizdas išlenkiamas viršūnių šešėliuoklėje (žaidimo logika lieka tiesi) */
const BEND = { value: 0 }, BEND_K = 0.0017, bendAt = d => BEND.value * Math.min(d, 380) * d;
THREE.Material.prototype.onBeforeCompile = function(sh){
  if(this.isMeshDepthMaterial || this.isMeshDistanceMaterial || sh.vertexShader.indexOf("#include <project_vertex>") < 0) return;
  sh.uniforms.uBend = BEND;
  sh.vertexShader = "uniform float uBend;\n" + sh.vertexShader.replace("#include <project_vertex>", "#include <project_vertex>\n\t{ float bz = -mvPosition.z; mvPosition.x += uBend * min(bz, 380.0) * bz; gl_Position = projectionMatrix * mvPosition; }");
};

/* ============================== žodžiai ============================== */
const WORDS = [], BY = {};
Z.forEach(([inf, f], vi) => { for(const c in f) f[c].split(" ").forEach(w => { BY[c] = BY[c] || []; BY[c].push(WORDS.length); WORDS.push({ w, c, v: vi }); }); });
const ALLC = Object.keys(T.cats);
const TG = { B: ["B"], E: ["E"], K: ["K"], D: ["D"], S: ["S"], TIES: ["E", "K", "D", "S"], T: ["T"], L: ["L"], DAL: ["VE", "VB", "NE", "NB"], P: ["P"], A: ["A"], VEIK: ["VE", "VB"], NEV: ["NE", "NB"], DES: ["VE", "NE"], DBUT: ["VB", "NB"] };
const TRACKS = [
  { id: "t1", col: "#2fbf71", targets: ["E", "K", "D", "S", "B"], uni: ["B", "E", "K", "D", "S"], v: 17 },
  { id: "t2", col: "#2f80ff", targets: ["TIES", "T", "L"], uni: ["E", "K", "D", "S", "T", "L"], v: 18 },
  { id: "t3", col: "#ef4a3c", targets: ["DAL", "P", "A"], uni: ["VE", "VB", "NE", "NB", "P", "A", "B", "E", "K", "S", "T"], v: 19 },
  { id: "t4", col: "#ef4a3c", targets: ["VEIK", "NEV"], uni: ["VE", "VB", "NE", "NB", "P", "A"], v: 19 },
  { id: "t5", col: "#14213d", targets: ["DES", "DBUT"], uni: ["VE", "VB", "NE", "NB", "P", "A"], v: 19 },
  { id: "t6", col: "#14213d", targets: ["B", "E", "K", "D", "S", "T", "L", "DAL", "P", "A"], uni: ALLC, v: 22 }
];
const ROWS = 12, SEG = 3, GAP = 100, LANES = [-4.6, 0, 4.6];
const store = () => Object.assign({ cr: 0, outfit: 0, seen: [], ctrl: "cards" }, MK.get(CKEY, {}));
const OUTFITS = [["#ef4a3c", 0], ["#2f80ff", 30], ["#2fbf71", 80], ["#8a4fff", 150], ["#ff8a1f", 250], ["#ffc531", 400]];

/* pamaina: 12 vartų eilių; tikslas keičiasi kas 3 eilės; žodis trasoje nesikartoja; pirmiausia – dar nematyti žodžiai */
function buildRun(tr, seenArr){
  const seen = new Set(seenArr || []), used = new Set(), sh = MK.shuffle;
  let tg = sh(tr.targets); while(tg.length < ROWS / SEG) tg = tg.concat(sh(tr.targets).filter((t, i) => i || t !== tg[tg.length - 1]));
  tg = tg.slice(0, ROWS / SEG);
  const take = (codes, verb) => {
    let pool = []; for(const c of codes) pool = pool.concat(BY[c]);
    pool = pool.filter(i => !used.has(i)); if(verb != null){ const p2 = pool.filter(i => WORDS[i].v === verb); if(p2.length) pool = p2; }
    const fresh = pool.filter(i => !seen.has(i)); const i = MK.pick(fresh.length ? fresh : pool); used.add(i); return i;
  };
  const rows = [];
  for(let r = 0; r < ROWS; r++){
    const key = tg[Math.floor(r / SEG)], codes = TG[key], others = tr.uni.filter(c => !codes.includes(c));
    const good = take(codes), v = WORDS[good].v, usedC = new Set();
    const bad = [0, 1].map(k => { const cs = sh(others.filter(c => !usedC.has(c))); const c = cs[0]; usedC.add(c); return take([c], k === 0 && Math.random() < 0.6 ? v : null); });
    const order = sh([good, bad[0], bad[1]]);
    rows.push({ key, words: order, good: order.indexOf(good), z: -(110 + r * GAP + Math.floor(r / SEG) * 60), done: false });
  }
  return rows;
}

/* ============================== meniu ============================== */
const STAR = on => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.4l3 6.1 6.7 1-4.9 4.7 1.2 6.7L12 17.7l-6 3.2 1.2-6.7L2.3 9.5l6.7-1z" fill="${on ? "#ffd23f" : "#fff"}" stroke="#14213d" stroke-width="1.8" stroke-linejoin="round"/></svg>`;
const CRY = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1l6 5-6 9-6-9z" fill="#5fd0ff" stroke="#14213d" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
function showMenu(){
  S = null; $("game").hidden = true; $("app").hidden = false; $("ov").innerHTML = "";
  const best = MK.best(GAME), C = store();
  $("tl").innerHTML = TRACKS.map((tr, i) => { const t = T.tracks[tr.id], st = +best[tr.id] || 0;
    return `<button class="tc" type="button" data-t="${i}"><span class="dot" style="background:${tr.col}">${i + 1}</span><span><b>${t.name}<span class="g">${T.grade(t.grade)}</span></b><span class="s">${t.sub}</span></span><span class="st">${[0, 1, 2].map(k => STAR(k < st)).join("")}</span></button>`; }).join("");
  $("ct").innerHTML = ["cards", "free"].map(k => `<button type="button" class="cb${C.ctrl === k ? " sel" : ""}" data-c="${k}"><b>${T.ctrl[k][0]}</b><span>${T.ctrl[k][1]}</span></button>`).join("");
  $("crT").innerHTML = T.crystalsT(C.cr);
  $("of").innerHTML = OUTFITS.map(([col, need], i) => `<button type="button" class="oc${C.outfit === i ? " sel" : ""}${C.cr < need ? " lock" : ""}" data-o="${i}"><i style="background:${col}"></i>${C.cr < need ? T.outfitLock(need) : T.outfits[i]}</button>`).join("");
  window.scrollTo(0, 0);
}
$("tl").addEventListener("click", e => { const b = e.target.closest("[data-t]"); if(!b) return; MK.sfx.tap(); start(+b.dataset.t); });
$("ct").addEventListener("click", e => { const b = e.target.closest("[data-c]"); if(!b) return; const C = store(); C.ctrl = b.dataset.c; MK.set(CKEY, C); MK.sfx.tap(); showMenu(); });
$("of").addEventListener("click", e => { const b = e.target.closest("[data-o]"); if(!b) return; const C = store(), i = +b.dataset.o; if(C.cr < OUTFITS[i][1]) return; C.outfit = i; MK.set(CKEY, C); MK.sfx.tap(); showMenu(); });

/* ============================== 3D pasaulis ============================== */
let renderer, scene, camera, sun, ready = false, tiles = [], backdrop, treeI, manI, flagI, flakes, skier, blob, trail, spray = [], crystals = [], gates = [], arches = [], sparks = [], bsprites = [], fin, hiQ = true;
const INK = 0x14213d, FORCE_HQ = /[?&]q=1/.test(location.search), DBG = { orbit: null, ts: 1 };
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const flat = (c, o) => new THREE.MeshLambertMaterial(Object.assign({ color: c, flatShading: true }, o || {}));
const toon = c => new THREE.MeshToonMaterial({ color: c });
const mesh = (g, m, x, y, z, p) => { const o = new THREE.Mesh(g, m); o.position.set(x || 0, y || 0, z || 0); if(p) p.add(o); return o; };
const cnv = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d")]; };
const tex = (c, rep) => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; if(rep){ t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); } return t; };
const hs = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
/* kelių dalių sujungimas į vieną geometriją su viršūnių spalvomis */
function merge(parts){
  const pos = [], nor = [], col = [], m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), c = new THREE.Color();
  for(const p of parts){
    const g = p.g.index ? p.g.toNonIndexed() : p.g.clone(); m.compose(V3(p.x || 0, p.y || 0, p.z || 0), q.setFromEuler(e.set(p.rx || 0, p.ry || 0, p.rz || 0)), V3(p.sx || 1, p.sy || 1, p.sz || 1)); g.applyMatrix4(m);
    const a = g.attributes.position.array, n = g.attributes.normal.array, vc = g.attributes.color; for(let i = 0; i < a.length; i++){ pos.push(a[i]); nor.push(n[i]); }
    if(vc) for(let i = 0; i < vc.array.length; i++) col.push(vc.array[i]); else { c.set(p.c); for(let i = 0; i < a.length / 3; i++) col.push(c.r, c.g, c.b); }
  }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3)); g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3)); return g;
}
function signTex(text, bg, fg, w, h, border){
  const [c, g] = cnv(w || 512, h || 176), W = c.width, H = c.height;
  g.fillStyle = bg; g.strokeStyle = border || "#14213d"; g.lineWidth = 14; g.beginPath(); g.roundRect(9, 9, W - 18, H - 18, 26); g.fill(); g.stroke();
  let fs = Math.round(H * 0.6); g.textAlign = "center"; g.textBaseline = "middle";
  do { g.font = `900 ${fs}px "Trebuchet MS",Verdana,"Segoe UI",sans-serif`; fs -= 4; } while(g.measureText(text).width > W - 60 && fs > 20);
  g.fillStyle = fg || "#14213d"; g.fillText(text, W / 2, H / 2 + 4); return tex(c);
}
function snowTex(){
  const [c, g] = cnv(512, 512); g.fillStyle = "#f1f7fd"; g.fillRect(0, 0, 512, 512);
  for(let i = 0; i < 46; i++){ const x = hs(i) * 512, y = hs(i + 99) * 512, r = 30 + hs(i + 7) * 70; for(const [ox, oy] of [[0, 0], [512, 0], [-512, 0], [0, 512], [0, -512]]){ const gr = g.createRadialGradient(x + ox, y + oy, 0, x + ox, y + oy, r); gr.addColorStop(0, i % 3 ? "rgba(196,219,242,.42)" : "rgba(255,255,255,.9)"); gr.addColorStop(1, "rgba(196,219,242,0)"); g.fillStyle = gr; g.fillRect(x + ox - r, y + oy - r, r * 2, r * 2); } }
  for(let i = 0; i < 260; i++){ g.fillStyle = "rgba(255,255,255,.95)"; g.fillRect(hs(i * 3.1) * 512, hs(i * 1.7 + 5) * 512, 2, 2); }
  return tex(c, [30, 45]);
}
function pisteTex(){
  const [c, g] = cnv(512, 512); g.fillStyle = "#fbfdff"; g.fillRect(0, 0, 512, 512);
  for(let x = 0; x < 512; x += 8){ g.fillStyle = "rgba(160,196,232,.26)"; g.fillRect(x, 0, 3, 512); }
  for(let i = 0; i < 9; i++){ const y = hs(i + 3) * 512, h = 14 + hs(i) * 30; g.fillStyle = "rgba(170,203,236,.16)"; g.fillRect(0, y, 512, h); g.fillRect(0, y - 512, 512, h); }
  g.strokeStyle = "rgba(140,180,222,.34)"; g.lineWidth = 3; for(let i = 0; i < 5; i++){ const x = 90 + hs(i * 9) * 330; g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + 70, 170, x - 70, 340, x, 512); g.stroke(); }
  for(const s of [0, 1]){ const gr = g.createLinearGradient(s ? 512 : 0, 0, s ? 440 : 72, 0); gr.addColorStop(0, "rgba(150,190,230,.7)"); gr.addColorStop(1, "rgba(150,190,230,0)"); g.fillStyle = gr; g.fillRect(s ? 440 : 0, 0, 72, 512); }
  return tex(c, [1, 90]);
}
function netTex(){
  const [c, g] = cnv(64, 64); g.clearRect(0, 0, 64, 64); g.strokeStyle = "#ff7a1a"; g.lineWidth = 5; for(let i = -64; i < 128; i += 16){ g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 64, 64); g.stroke(); g.beginPath(); g.moveTo(i + 64, 0); g.lineTo(i, 64); g.stroke(); }
  g.fillStyle = "#ff7a1a"; g.fillRect(0, 0, 64, 9); g.fillRect(0, 56, 64, 8); g.fillStyle = "#14213d"; g.fillRect(28, 0, 8, 64); return tex(c, [560, 1]);
}
function mountainGeo(rad, h, seed, rock, rock2){
  const g = new THREE.ConeGeometry(rad, h, 9, 5, true).toNonIndexed(), a = g.attributes.position, col = [], c = new THREE.Color(), base = new THREE.Color("#d5e9fa");
  const hh = (x, y, z) => hs(Math.round(x) * 0.013 + Math.round(y) * 0.071 + Math.round(z) * 0.037 + seed);
  for(let i = 0; i < a.count; i++){ const x = a.getX(i), y = a.getY(i), z = a.getZ(i), t = (y + h / 2) / h; if(t > 0.01 && t < 0.99){ const k = (hh(x, y, z) - 0.5) * rad * 0.3 * (1 - t * 0.5); a.setXYZ(i, x + k, y + k * 0.35, z + k * 0.8); } }
  for(let f = 0; f < a.count; f += 3){ const t = ((a.getY(f) + a.getY(f + 1) + a.getY(f + 2)) / 3 + h / 2) / h, sn = t > 0.5 + (hs(f + seed) - 0.5) * 0.2;
    c.set(sn ? (hs(f * 1.3 + seed) > 0.5 ? "#ffffff" : "#e3eefb") : (hs(f * 0.7 + seed) > 0.5 ? rock : rock2)); if(!sn) c.lerp(base, Math.max(0, 0.75 - t * 2.6)); for(let k = 0; k < 3; k++) col.push(c.r, c.g, c.b); }
  g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3)); g.computeVertexNormals(); return g;
}
function buildSkier(){
  const g = new THREE.Group(), u = g.userData;
  const jacket = toon(OUTFITS[0][0]), pants = toon("#22357a"), dark = toon("#14213d"), skin = toon("#f6c9a4"), white = toon("#ffffff"), yel = toon("#ffd23f"), lens = toon("#5fd0ff"), grey = toon("#d5dcec");
  const om = new THREE.MeshBasicMaterial({ color: INK, side: THREE.BackSide }); u.jacket = jacket;
  const add = (geo, mat, x, y, z, parent, rx, ol) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); if(rx) m.rotation.x = rx; m.castShadow = true; parent.add(m); if(ol !== 0){ const o = new THREE.Mesh(geo, om); o.scale.setScalar(ol || 1.1); m.add(o); } return m; };
  const cap = (r, l) => new THREE.CapsuleGeometry(r, l, 5, 12), sph = r => new THREE.SphereGeometry(r, 16, 12);
  /* slidės su užriestais galais */
  const sh = new THREE.Shape(); sh.moveTo(-0.92, 0); sh.lineTo(0.72, 0); sh.quadraticCurveTo(1.0, 0, 1.1, 0.19); sh.lineTo(1.05, 0.21); sh.quadraticCurveTo(0.95, 0.06, 0.72, 0.05); sh.lineTo(-0.92, 0.05); sh.closePath();
  const skiG = new THREE.ExtrudeGeometry(sh, { depth: 0.16, bevelEnabled: false, curveSegments: 6 }); skiG.translate(0, 0, -0.08); skiG.rotateY(Math.PI / 2);
  const skiO = new THREE.ExtrudeGeometry(sh, { depth: 0.2, bevelEnabled: false, curveSegments: 6 }); skiO.translate(0, -0.012, -0.1); skiO.rotateY(Math.PI / 2);
  u.skis = [];
  for(const s of [-1, 1]){ const sk = new THREE.Group(); sk.position.set(s * 0.21, 0.02, 0); g.add(sk); u.skis.push(sk);
    add(skiO, dark, 0, 0, 0, sk, 0, 0); add(skiG, yel, 0, 0.012, 0, sk, 0, 0); add(new THREE.BoxGeometry(0.08, 0.014, 0.7), jacket, 0, 0.066, -0.42, sk, 0, 0);
    add(new THREE.BoxGeometry(0.15, 0.07, 0.4), dark, 0, 0.09, 0.04, sk, 0, 0); add(new THREE.BoxGeometry(0.2, 0.22, 0.36), dark, 0, 0.22, 0.03, sk, 0, 1.08); add(new THREE.BoxGeometry(0.21, 0.05, 0.1), yel, 0, 0.26, -0.12, sk, 0, 0); }
  const body = new THREE.Group(); g.add(body); u.body = body;
  for(const s of [-1, 1]){ add(cap(0.105, 0.36), pants, s * 0.21, 0.5, -0.075, body, -0.46); add(cap(0.13, 0.3), pants, s * 0.2, 0.84, -0.05, body, 0.675); add(sph(0.12), pants, s * 0.21, 0.69, -0.17, body, 0, 1.06); }
  const hips = add(sph(0.25), pants, 0, 0.99, 0.08, body); hips.scale.set(1.2, 0.82, 0.95);
  const torso = new THREE.Group(); torso.position.set(0, 1.02, 0.06); torso.rotation.x = -0.62; body.add(torso); u.torso = torso;
  const chest = add(cap(0.235, 0.34), jacket, 0, 0.36, 0, torso); chest.scale.set(1.18, 1, 0.95);
  add(new THREE.CylinderGeometry(0.262, 0.262, 0.09, 16), white, 0, 0.22, 0, torso, 0, 0).scale.set(1.18, 1, 0.95);
  const [bc, bg] = cnv(96, 96); bg.fillStyle = "#fff"; bg.beginPath(); bg.roundRect(3, 3, 90, 90, 16); bg.fill(); bg.lineWidth = 6; bg.strokeStyle = "#14213d"; bg.stroke(); bg.fillStyle = "#14213d"; bg.font = "900 62px sans-serif"; bg.textAlign = "center"; bg.textBaseline = "middle"; bg.fillText("7", 48, 52);
  mesh(new THREE.PlaneGeometry(0.27, 0.27), new THREE.MeshBasicMaterial({ map: tex(bc), transparent: true }), 0, 0.46, 0.232, torso);
  add(new THREE.CylinderGeometry(0.12, 0.14, 0.12, 12), white, 0, 0.7, 0, torso, 0, 1.12);
  /* galva */
  const head = new THREE.Group(); head.position.set(0, 0.8, -0.01); head.rotation.x = 0.5; torso.add(head); u.head = head;
  add(sph(0.185), skin, 0, 0.09, -0.01, head, 0, 1.06);
  const helm = add(new THREE.SphereGeometry(0.215, 16, 12, 0, 6.3, 0, 1.95), yel, 0, 0.115, 0.015, head, 0.3, 1.07);
  const strap = add(new THREE.TorusGeometry(0.213, 0.03, 6, 20), dark, 0, 0.1, 0.005, head, Math.PI / 2, 0);
  add(new THREE.BoxGeometry(0.3, 0.11, 0.1), lens, 0, 0.1, -0.165, head, 0, 1.12);
  add(new THREE.BoxGeometry(0.07, 0.035, 0.34), jacket, 0, 0.325, 0.0, head, 0.12, 0);
  /* šalikas */
  u.scarf = []; for(const s of [-1, 1]){ const sg = new THREE.BoxGeometry(0.1, 0.03, 0.46); sg.translate(0, 0, 0.23); const sc = add(sg, white, s * 0.06, 0.72, 0.13, torso, 0, 0); sc.userData.s = s; u.scarf.push(sc); }
  /* rankos ir lazdos */
  u.arms = [];
  for(const s of [-1, 1]){ const a = new THREE.Group(); a.position.set(s * 0.31, 0.6, 0); a.rotation.set(1.4, 0, s * 0.38); torso.add(a); u.arms.push(a);
    add(sph(0.12), jacket, 0, 0, 0, a, 0, 1.08); add(cap(0.085, 0.24), jacket, 0, -0.2, 0, a);
    const f = new THREE.Group(); f.position.set(0, -0.4, 0); f.rotation.x = 0.65; a.add(f); a.userData.fore = f;
    add(cap(0.078, 0.2), jacket, 0, -0.15, 0, f); add(sph(0.1), dark, 0, -0.34, 0, f, 0, 1.1);
    const p = new THREE.Group(); p.position.set(0, -0.34, 0); p.rotation.x = -2.5; p.rotation.z = s * 0.42; f.add(p); a.userData.pole = p;
    add(new THREE.CylinderGeometry(0.02, 0.016, 1.25, 6), grey, 0, -0.5, 0, p, 0, 1.6); add(new THREE.CylinderGeometry(0.03, 0.03, 0.2, 6), dark, 0, 0.05, 0, p, 0, 0); add(new THREE.CylinderGeometry(0.075, 0.075, 0.02, 10), jacket, 0, -1.02, 0, p, 0, 0); }
  g.scale.setScalar(1.3); return g;
}
function initWorld(){
  if(ready) return true;
  try { renderer = new THREE.WebGLRenderer({ canvas: $("gl"), antialias: true, powerPreference: "high-performance" }); } catch(e){ return false; }
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  scene = new THREE.Scene();
  const [sc, sg] = cnv(8, 256), gr = sg.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "#2b86e6"); gr.addColorStop(0.42, "#86c8ff"); gr.addColorStop(0.7, "#d5e9fa"); gr.addColorStop(1, "#d5e9fa"); sg.fillStyle = gr; sg.fillRect(0, 0, 8, 256);
  scene.background = tex(sc); scene.fog = new THREE.Fog(0xd5e9fa, 110, 720);
  camera = new THREE.PerspectiveCamera(60, 1, 0.5, 2400);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xb4d2f0, 1.25));
  sun = new THREE.DirectionalLight(0xfff0cf, 1.9); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); const sc2 = sun.shadow.camera; sc2.left = -30; sc2.right = 30; sc2.top = 46; sc2.bottom = -22; sc2.near = 1; sc2.far = 170; sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.03; scene.add(sun); scene.add(sun.target);
  /* sniegas, trasa, tinklai */
  const tile = (o, len) => { scene.add(o); tiles.push({ o, len }); return o; };
  const ground = tile(mesh(new THREE.PlaneGeometry(900, 1350, 6, 90), new THREE.MeshLambertMaterial({ map: snowTex() }), 0, -0.02, 0), 30); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true;
  const piste = tile(mesh(new THREE.PlaneGeometry(18, 1350, 1, 90), new THREE.MeshLambertMaterial({ map: pisteTex() }), 0, 0, 0), 15); piste.rotation.x = -Math.PI / 2; piste.receiveShadow = true;
  const nm = new THREE.MeshBasicMaterial({ map: netTex(), transparent: true, alphaTest: 0.35, side: THREE.DoubleSide });
  for(const s of [-1, 1]){ const n = tile(mesh(new THREE.PlaneGeometry(1350, 1.15, 90, 1), nm, s * 9.1, 0.58, 0), 1350 / 560 * 4); n.rotation.y = Math.PI / 2; }
  /* tolimas fonas: kalnai, debesys, saulė */
  backdrop = new THREE.Group(); scene.add(backdrop); const mp = [];
  for(let i = 0; i < 9; i++){ const a = -1.3 + i * 0.325, r = 1250, h = 300 + hs(i * 3) * 200; mp.push({ g: mountainGeo(300 + hs(i) * 160, h, i * 7 + 1, "#b7cbe8", "#a8bfe2"), x: Math.sin(a) * r, y: h / 2 - 30, z: -Math.cos(a) * r, ry: i }); }
  for(let i = 0; i < 12; i++){ const a = -1.45 + i * 0.265 + hs(i) * 0.08, r = 800 + hs(i + 4) * 90, h = 120 + hs(i * 5 + 2) * 120; mp.push({ g: mountainGeo(170 + hs(i + 9) * 110, h, i * 13 + 5, "#8ea6d2", "#7f99c9"), x: Math.sin(a) * r, y: h / 2 - 18, z: -Math.cos(a) * r, ry: i * 2 }); }
  backdrop.add(new THREE.Mesh(merge(mp), new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true, fog: false })));
  const [gc, gg] = cnv(128, 128), rg = gg.createRadialGradient(64, 64, 0, 64, 64, 64); rg.addColorStop(0, "rgba(255,255,255,1)"); rg.addColorStop(0.22, "rgba(255,246,196,.95)"); rg.addColorStop(0.4, "rgba(255,236,160,.35)"); rg.addColorStop(1, "rgba(255,236,160,0)"); gg.fillStyle = rg; gg.fillRect(0, 0, 128, 128);
  const sunS = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex(gc), fog: false, transparent: true, depthWrite: false })); sunS.scale.set(520, 520, 1); sunS.position.set(-520, 640, -1300); sunS.userData = { x0: -520, d: 1300 }; backdrop.add(sunS); bsprites.push(sunS);
  const [cc, cg] = cnv(256, 128); cg.fillStyle = "#fff"; cg.shadowColor = "#fff"; cg.shadowBlur = 14; for(const [x, y, r] of [[70, 80, 34], [112, 62, 44], [158, 72, 38], [196, 86, 26], [128, 90, 40]]){ cg.beginPath(); cg.arc(x, y, r, 0, 7); cg.fill(); }
  const cm = new THREE.SpriteMaterial({ map: tex(cc), fog: false, transparent: true, opacity: 0.93, depthWrite: false });
  for(let i = 0; i < 9; i++){ const a = -1.3 + i * 0.33 + hs(i + 20) * 0.2, c = new THREE.Sprite(cm), s = 190 + hs(i + 30) * 200; c.scale.set(s * 2, s, 1); c.position.set(Math.sin(a) * 1400, 520 + hs(i + 40) * 420, -Math.cos(a) * 1400); c.userData.x0 = c.position.x; c.userData.d = 1400 * Math.cos(a); backdrop.add(c); bsprites.push(c); }
  /* eglės, sniego seniai, vėliavos – po vieną bendrą geometriją */
  const cone = (r, h) => new THREE.ConeGeometry(r, h, 8), tp = [{ g: new THREE.CylinderGeometry(0.34, 0.46, 2.4, 6), c: "#7a5a3a", y: 1.2 }];
  [[3.2, 4.6, 4.3, "#2c8a5f"], [2.5, 3.9, 6.7, "#277b56"], [1.7, 3.2, 8.8, "#33996b"]].forEach(([r, h, y, c]) => { tp.push({ g: cone(r, h), c, y }); tp.push({ g: cone(r * 0.7, h * 0.62), c: "#ffffff", y: y + h * 0.2 }); });
  treeI = new THREE.InstancedMesh(merge(tp), new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }), 84); treeI.castShadow = true; treeI.frustumCulled = false; scene.add(treeI);
  const sp = (r, c, x, y, z) => ({ g: new THREE.SphereGeometry(r, 10, 8), c, x, y, z });
  manI = new THREE.InstancedMesh(merge([sp(0.75, "#ffffff", 0, 0.6, 0), sp(0.55, "#ffffff", 0, 1.55, 0), sp(0.4, "#ffffff", 0, 2.3, 0), { g: cone(0.09, 0.42), c: "#ff8a1f", y: 2.3, z: 0.52, rx: Math.PI / 2 }, sp(0.06, "#14213d", -0.15, 2.42, 0.34), sp(0.06, "#14213d", 0.15, 2.42, 0.34),
    { g: new THREE.CylinderGeometry(0.3, 0.3, 0.42, 10), c: "#14213d", y: 2.82 }, { g: new THREE.CylinderGeometry(0.46, 0.46, 0.06, 10), c: "#14213d", y: 2.62 }, { g: new THREE.TorusGeometry(0.4, 0.09, 6, 12), c: "#ef4a3c", y: 1.98, rx: Math.PI / 2 }, sp(0.07, "#14213d", 0, 1.7, 0.52), sp(0.07, "#14213d", 0, 1.4, 0.53)]),
    new THREE.MeshLambertMaterial({ vertexColors: true }), 5); manI.castShadow = true; manI.frustumCulled = false; scene.add(manI);
  const fs = new THREE.Shape(); fs.moveTo(0, 0); fs.lineTo(0, 3.4); fs.quadraticCurveTo(0.2, 4.3, 0.9, 4.2); fs.quadraticCurveTo(1.25, 2.4, 0.9, 0.5); fs.closePath(); const fgm = new THREE.ShapeGeometry(fs); fgm.translate(0.06, 1.0, 0);
  flagI = new THREE.InstancedMesh(fgm, new THREE.MeshLambertMaterial({ side: THREE.DoubleSide }), 12); flagI.frustumCulled = false; const fc = new THREE.Color(); ["#ef4a3c", "#ffd23f", "#2f80ff", "#2fbf71", "#8a4fff", "#ff8a1f"].forEach((c, i) => { flagI.setColorAt(i, fc.set(c)); flagI.setColorAt(i + 6, fc.set(c)); }); scene.add(flagI);
  /* snaigės */
  const N = 420, fp = new Float32Array(N * 3); for(let i = 0; i < N; i++){ fp[i * 3] = (Math.random() - 0.5) * 70; fp[i * 3 + 1] = Math.random() * 30; fp[i * 3 + 2] = -Math.random() * 90 + 12; }
  const fgeo = new THREE.BufferGeometry(); fgeo.setAttribute("position", new THREE.BufferAttribute(fp, 3)); const [fl, flg] = cnv(32, 32), fr = flg.createRadialGradient(16, 16, 0, 16, 16, 16); fr.addColorStop(0, "rgba(255,255,255,1)"); fr.addColorStop(0.5, "rgba(255,255,255,.8)"); fr.addColorStop(1, "rgba(255,255,255,0)"); flg.fillStyle = fr; flg.fillRect(0, 0, 32, 32);
  flakes = new THREE.Points(fgeo, new THREE.PointsMaterial({ map: tex(fl), color: 0xffffff, size: 0.38, transparent: true, opacity: 0.95, depthWrite: false })); flakes.frustumCulled = false; scene.add(flakes);
  skier = buildSkier(); scene.add(skier);
  blob = mesh(new THREE.CircleGeometry(1.1, 20), new THREE.MeshBasicMaterial({ color: INK, transparent: true, opacity: 0.2, depthWrite: false }), 0, 0.03, 0); blob.rotation.x = -Math.PI / 2; blob.scale.set(1, 1.7, 1); blob.visible = false; scene.add(blob);
  /* slidžių vėžės */
  const TN = 36, tg = new THREE.BufferGeometry(), ti = []; tg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(TN * 12), 3));
  for(let i = 0; i < TN - 1; i++) for(const k of [0, 2]){ const a = i * 4 + k; ti.push(a, a + 1, a + 4, a + 1, a + 5, a + 4); } tg.setIndex(ti);
  trail = new THREE.Mesh(tg, new THREE.MeshBasicMaterial({ color: 0xb9d2ec, transparent: true, opacity: 0.8, depthWrite: false, side: THREE.DoubleSide })); trail.frustumCulled = false; trail.userData = { n: TN, pts: [] }; scene.add(trail);
  const sm = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 });
  for(let i = 0; i < 60; i++){ const p = mesh(new THREE.IcosahedronGeometry(0.17, 0), sm, 0, -5, 0); p.userData = { t: 9 }; scene.add(p); spray.push(p); }
  const km = [0xffd23f, 0x2fbf71, 0xffffff].map(c => new THREE.MeshBasicMaterial({ color: c }));
  for(let i = 0; i < 30; i++){ const p = mesh(new THREE.OctahedronGeometry(0.3, 0), km[i % 3], 0, -5, 0); p.userData = { t: 9 }; scene.add(p); sparks.push(p); }
  resize(); ready = true; return true;
}
function quality(hi){ hiQ = hi; sun.castShadow = hi; blob.visible = !hi; renderer.setPixelRatio(hi ? Math.min(2, window.devicePixelRatio || 1) : 1); resize(); }
function resize(){ if(!renderer) return; const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
addEventListener("resize", resize);
function clearRun(){ for(const o of gates.concat(arches, crystals)){ scene.remove(o); o.traverse(m => { if(m.material && m.material.map) m.material.map.dispose(); }); } gates = []; arches = []; crystals = []; if(fin){ scene.remove(fin); fin = null; } }
function archAt(z, text, colA, colB, bg, fg){
  const g = new THREE.Group(), W = 10.2, H = 11, pts = []; for(let i = 0; i <= 14; i++){ const a = Math.PI * i / 14; pts.push(V3(-Math.cos(a) * W, Math.pow(Math.sin(a), 0.55) * H, 0)); }
  const tg = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, 0.62, 8), n = tg.attributes.position.count, col = new Float32Array(n * 3), ca = new THREE.Color(colA), cb = new THREE.Color(colB);
  for(let i = 0; i < n; i++){ const c = Math.floor(i / 9 / 4) % 2 ? cb : ca; col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b; } tg.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const tube = new THREE.Mesh(tg, new THREE.MeshLambertMaterial({ vertexColors: true })); tube.castShadow = true; g.add(tube);
  g.userData.ban = mesh(new THREE.PlaneGeometry(15.4, 2.5), new THREE.MeshBasicMaterial({ map: signTex(text, bg, fg, 1024, 168), side: THREE.DoubleSide, transparent: true }), 0, 9.0, 0, g);
  for(const s of [-1, 1]) mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.3, 5), flat("#14213d"), s * 6.6, 10.2, 0, g);
  g.position.z = z; scene.add(g); return g;
}
function buildGates(){
  clearRun(); const poleG = new THREE.CylinderGeometry(0.085, 0.085, 4.5, 8), topG = new THREE.SphereGeometry(0.16, 8, 6), lineG = new THREE.PlaneGeometry(17.4, 0.5);
  S.rows.forEach((row, r) => {
    const col = r % 2 ? "#2f80ff" : "#ef4a3c", pm = flat(col); row.objs = [];
    const ln = mesh(lineG, new THREE.MeshBasicMaterial({ color: r % 2 ? 0x8fb8ff : 0xffa49b, transparent: true, opacity: 0.75, depthWrite: false }), 0, 0.02, row.z); ln.rotation.x = -Math.PI / 2; scene.add(ln); gates.push(ln);
    row.words.forEach((wi, l) => {
      const g = new THREE.Group(); for(const x of [-2.12, 2.12]){ const p = mesh(poleG, pm, x, 2.25, 0, g); p.castShadow = true; mesh(topG, flat("#ffd23f"), x, 4.55, 0, g); }
      const mat = new THREE.MeshBasicMaterial({ map: signTex(WORDS[wi].w, "#ffffff", "#14213d", 512, 176, col), side: THREE.DoubleSide }); const b = mesh(new THREE.PlaneGeometry(4.24, 1.46), mat, 0, 3.55, 0, g); b.castShadow = true;
      g.position.set(LANES[l], 0, row.z); g.userData.sign = mat; g.userData.b = b; scene.add(g); gates.push(g); row.objs.push(g);
    });
    if(r % SEG === 0) arches.push(archAt(row.z + (r ? 52 : 62), T.targets[row.key][1], "#ffd23f", "#ef4a3c", "#fff8d6", "#ef4a3c"));
    let lane = Math.floor(Math.random() * 3);
    for(let k = 0; k < 3; k++){ if(Math.random() < 0.5) lane = Math.max(0, Math.min(2, lane + (Math.random() < 0.5 ? -1 : 1)));
      const c = mesh(new THREE.OctahedronGeometry(0.5, 0), new THREE.MeshLambertMaterial({ color: 0x5fd0ff, emissive: 0x1a78c2, flatShading: true }), LANES[lane], 1.1, row.z - 18 - k * 13); c.scale.y = 1.45; c.castShadow = true; scene.add(c); crystals.push(c); }
  });
  /* posūkiai tarp atkarpų: zona ir rodyklių skydai išorinėje pusėje */
  S.turns = []; let dir = Math.random() < 0.5 ? 1 : -1;
  const [hc, hg] = cnv(256, 128); hg.fillStyle = "#ffd23f"; hg.fillRect(0, 0, 256, 128); hg.strokeStyle = "#14213d"; hg.lineWidth = 10; hg.strokeRect(5, 5, 246, 118); hg.lineWidth = 22; hg.lineJoin = "miter"; for(const x of [50, 112, 174]){ hg.beginPath(); hg.moveTo(x, 26); hg.lineTo(x + 38, 64); hg.lineTo(x, 102); hg.stroke(); }
  const ht = tex(hc), hm = new THREE.MeshBasicMaterial({ map: ht, side: THREE.DoubleSide }), postG = new THREE.CylinderGeometry(0.08, 0.08, 2.4, 6), pm2 = flat("#14213d");
  for(let k = 1; k < ROWS / SEG; k++){ const zA = S.rows[k * SEG - 1].z - 6, zB = S.rows[k * SEG].z + 64; S.turns.push({ zA, zB, dir });
    for(let i = 0; i < 5; i++){ const g = new THREE.Group(), b = mesh(new THREE.PlaneGeometry(3.4, 1.7), hm, 0, 2.5, 0, g); b.scale.x = dir; mesh(postG, pm2, -1.2, 1.2, 0, g); mesh(postG, pm2, 1.2, 1.2, 0, g); g.position.set(-dir * 11.2, 0, zA - 6 - i * 15); g.rotation.y = dir * 0.35; scene.add(g); gates.push(g); }
    dir = -dir; }
  arches.push(archAt(-9, T.hud.startArch, "#2f80ff", "#ffffff", "#14213d", "#ffffff"));
  S.finZ = S.rows[ROWS - 1].z - 70; fin = archAt(S.finZ, T.hud.finish, "#14213d", "#ffffff", "#14213d", "#ffd23f");
  const [qc, qg] = cnv(256, 32); for(let i = 0; i < 16; i++) for(let j = 0; j < 2; j++){ qg.fillStyle = (i + j) % 2 ? "#14213d" : "#ffffff"; qg.fillRect(i * 16, j * 16, 16, 16); }
  const q = mesh(new THREE.PlaneGeometry(17.6, 2.2), new THREE.MeshBasicMaterial({ map: tex(qc) }), 0, 0.022, 0, fin); q.rotation.x = -Math.PI / 2;
}

/* ============================== trasa ============================== */
let S = null, lastT = 0;
function start(ti){
  $("app").hidden = true; $("game").hidden = false;
  if(!initWorld()){ $("game").hidden = true; $("app").hidden = false; alert("WebGL"); return; }
  const tr = TRACKS[ti], C = store();
  S = { ti, tr, rows: buildRun(tr, C.seen), ri: 0, px: 0, pz: 0, lane: 1, v: 0, run: false, free: C.ctrl === "free", fx: 0, steer: 0, turn: 0, ok: 0, cr: 0, mistakes: [], t: 0, wob: 0, slow: 0, fin: false, msgT: 0, lean: 0, camW: 0, cheer: 0 };
  trail.userData.pts = []; if(!hiQ && FORCE_HQ) quality(true);
  skier.userData.jacket.color.set(OUTFITS[C.outfit][0]);
  BEND.value = 0; $("game").classList.toggle("free", S.free); buildGates(); showRow(true); hud(); const coarse = matchMedia("(pointer:coarse)").matches; say(S.free ? (coarse ? T.hud.startFree : T.hud.startFreeKeys) : coarse ? T.hud.start : T.hud.start + " " + T.hud.startKeys, "new", 60);
  lastT = performance.now(); resize();
}
function hud(){ $("pGate").textContent = T.hud.gate(Math.min(S.ri + 1, ROWS), ROWS); $("pCr").innerHTML = CRY + " " + S.cr; $("bExit").setAttribute("aria-label", T.hud.exit); }
function showRow(first){
  const row = S.rows[S.ri]; if(!row) return;
  const cards = document.querySelectorAll(".wc"); cards.forEach((b, l) => { b.textContent = WORDS[row.words[l]].w; b.className = "wc" + (l === S.lane ? " cur" : ""); b.disabled = false; });
  const newT = first || row.key !== S.rows[S.ri - 1].key;
  $("goalS").textContent = T.hud.go; $("goalB").textContent = T.targets[row.key][1];
  if(newT){ const g = $("goal"); g.classList.remove("pop"); void g.offsetWidth; g.classList.add("pop"); if(!first){ say(T.hud.newTarget + " " + T.hud.go + " " + T.targets[row.key][1], "new", 3.5); MK.sfx.whoosh(); } }
}
function say(text, cls, sec){ $("msg").innerHTML = `<span class="${cls || ""}">${text}</span>`; S.msgT = sec || 3; }
function beginRun(){ if(S && !S.run && !S.fin){ S.run = true; $("msg").innerHTML = ""; MK.sfx.whoosh(); } }
function setLane(l){ if(!S || S.fin) return; l = Math.max(0, Math.min(2, l)); beginRun(); if(S.free) S.fx = LANES[l]; if(l !== S.lane){ S.lane = l; MK.sfx.tap(); } document.querySelectorAll(".wc").forEach((b, i) => b.classList.toggle("cur", i === l)); }
function passRow(){
  const row = S.rows[S.ri]; let l = 0, bd = 1e9; LANES.forEach((x, i) => { const d = Math.abs(S.px - x); if(d < bd){ bd = d; l = i; } });
  const wi = row.words[l], ok = l === row.good, cards = document.querySelectorAll(".wc"); row.done = true;
  cards.forEach((b, i) => { b.disabled = true; if(i === row.good) b.classList.add("ok"); else if(i === l) b.classList.add("no"); });
  row.objs[row.good].userData.sign.color.set(0xa8f5bd); if(!ok) row.objs[l].userData.sign.color.set(0xffb3aa);
  const C = store(); row.words.forEach(i => { if(!C.seen.includes(i)) C.seen.push(i); }); if(C.seen.length > WORDS.length * 0.9) C.seen = []; MK.set(CKEY, C);
  row.hit = l; row.shake = 1;
  if(ok){ S.ok++; S.cheer = 0.9; MK.sfx.good(); say(MK.pick(T.fb.ok), "good", 1.6); burst(LANES[l], row.z); }
  else { MK.sfx.bad(); S.wob = 1; S.slow = 1.6; S.mistakes.push(wi); say(T.fb.wrong(WORDS[wi].w, T.cats[WORDS[wi].c], WORDS[row.words[row.good]].w), "bad", 6); }
  S.ri++; hud(); if(S.ri < ROWS) setTimeout(() => { if(S && !S.fin) showRow(false); }, ok ? 500 : 1500);
}
function burst(x, z){ sparks.forEach((s, i) => { const a = i / sparks.length * 6.28; s.position.set(x, 3.2, z); s.userData = { t: 0, vx: Math.cos(a) * (3 + i % 4), vy: 5 + (i % 5) * 1.5, vz: -S.v * 0.7 + Math.sin(a) * 3 }; }); }
function finish(){
  S.fin = true; S.cheer = 9; const st = S.ok >= 11 ? 3 : S.ok >= 8 ? 2 : 1, C = store(), before = OUTFITS.filter(o => C.cr >= o[1]).length;
  C.cr += S.cr; MK.set(CKEY, C); MK.best(GAME, S.tr.id, st); const after = OUTFITS.filter(o => C.cr >= o[1]).length;
  if(st >= 2) MK.sfx.win(); if(st === 3 && MK.confetti) MK.confetti(60);
  const R = T.rep, uniq = [...new Set(S.mistakes)];
  $("ov").innerHTML = `<div class="rc" role="dialog"><h3>${R.title}</h3><div class="st">${[0, 1, 2].map(k => STAR(k < st)).join("")}</div><p>${R.line[st - 1]}</p><p>${R.gates(S.ok, ROWS)}<br>${R.crystals(S.cr)}</p>${after > before ? `<p><b>${R.outfit(T.outfits[after - 1])}</b></p>` : ""}${uniq.length ? `<h4>${R.mistakes}</h4><ul>${uniq.map(i => `<li>${R.row(WORDS[i].w, T.cats[WORDS[i].c])}</li>`).join("")}</ul>` : ""}<div class="bt"><button class="pri" type="button" data-a="again">${R.again}</button>${S.ti < TRACKS.length - 1 ? `<button type="button" data-a="next">${R.next}</button>` : ""}<button type="button" data-a="menu">${R.menu}</button></div></div>`;
}
$("ov").addEventListener("click", e => { const b = e.target.closest("[data-a]"); if(!b) return; MK.sfx.tap(); const ti = S ? S.ti : 0; $("ov").innerHTML = ""; if(b.dataset.a === "again") start(ti); else if(b.dataset.a === "next") start(ti + 1); else showMenu(); });

/* ============================== valdymas ============================== */
document.querySelectorAll(".wc").forEach(b => b.addEventListener("pointerdown", e => { if(S && S.free) return; e.preventDefault(); setLane(+b.dataset.l); }));
/* „Vairuoju pats“: pirštas ar pelė tempia slidininką į šonus; „Kortelėmis“: braukimas ar bakstelėjimas keičia vėžę */
let sw = null;
$("game").addEventListener("pointerdown", e => { if(!S || S.fin || e.target.closest("#bExit")) return; if(S.free){ sw = { x: e.clientX }; beginRun(); } else if(e.target === $("gl")) sw = { x: e.clientX, x0: e.clientX }; });
$("game").addEventListener("pointermove", e => { if(!sw || !S || !S.free) return; S.fx = Math.max(-6.3, Math.min(6.3, S.fx + (e.clientX - sw.x) * 15 / Math.min(innerWidth, 620))); sw.x = e.clientX; });
const swEnd = e => { if(!sw || !S){ sw = null; return; } if(!S.free && e.type === "pointerup"){ const dx = e.clientX - sw.x0; if(Math.abs(dx) > 28) setLane(S.lane + (dx > 0 ? 1 : -1)); else setLane(e.clientX < innerWidth / 3 ? 0 : e.clientX > innerWidth * 2 / 3 ? 2 : 1); } sw = null; };
$("game").addEventListener("pointerup", swEnd); $("game").addEventListener("pointercancel", swEnd);
$("bExit").addEventListener("click", () => { MK.sfx.tap(); showMenu(); });
const keysDown = new Set();
addEventListener("keydown", e => {
  if(!S) return;
  if($("ov").innerHTML){ if(e.key === "Enter"){ const b = $("ov").querySelector(".pri"); b && b.click(); } return; }
  const L = e.key === "ArrowLeft" || e.key === "a", R2 = e.key === "ArrowRight" || e.key === "d";
  if(e.key === "Escape") return showMenu();
  if(L || R2 || e.key === "ArrowUp" || e.key === "w" || e.key === " ") e.preventDefault();
  if(S.free){ if(L || R2){ keysDown.add(L ? "L" : "R"); S.steer = (keysDown.has("R") ? 1 : 0) - (keysDown.has("L") ? 1 : 0); } if(L || R2 || e.key === "ArrowUp" || e.key === "w" || e.key === " " || e.key === "Enter") beginRun(); return; }
  if(L){ if(!e.repeat) setLane(S.lane - 1); }
  else if(R2){ if(!e.repeat) setLane(S.lane + 1); }
  else if(e.key === "1" || e.key === "2" || e.key === "3") setLane(+e.key - 1);
  else if(e.key === "ArrowUp" || e.key === "w" || e.key === " ") setLane(S.lane);
});
addEventListener("keyup", e => { const L = e.key === "ArrowLeft" || e.key === "a", R2 = e.key === "ArrowRight" || e.key === "d"; if(L) keysDown.delete("L"); if(R2) keysDown.delete("R"); if(S && S.free) S.steer = (keysDown.has("R") ? 1 : 0) - (keysDown.has("L") ? 1 : 0); });
addEventListener("blur", () => { keysDown.clear(); if(S) S.steer = 0; });
document.addEventListener("visibilitychange", () => { lastT = performance.now(); });

/* ============================== kadras ============================== */
const dummy = new THREE.Object3D(), cA = new THREE.Vector3(), cB = new THREE.Vector3(), lA = new THREE.Vector3(), lB = new THREE.Vector3();
function loop(inst, n, L, fn){ for(let i = 0; i < n; i++){ const zi = (i + 0.5) * L / n, k = Math.ceil((-S.pz - 34 - zi) / L); dummy.rotation.set(0, 0, 0); dummy.scale.setScalar(1); fn(i, k, -(zi + k * L)); dummy.updateMatrix(); inst.setMatrixAt(i, dummy.matrix); } inst.instanceMatrix.needsUpdate = true; }
function frame(now){
  requestAnimationFrame(frame); if(!S || !ready) return;
  const raw = (now - lastT) / 1000 || 0, dt = Math.min(0.05, raw) * DBG.ts; lastT = now; S.t += dt;
  /* kokybės prisitaikymas: jei įrenginys nespėja – be šešėlių */
  if(hiQ && !FORCE_HQ && S.run && raw < 0.5){ S.fN = (S.fN || 0) + 1; S.fT = (S.fT || 0) + raw; if(S.fN === 70){ if(S.fT / 70 > 1 / 27) quality(false); S.fN = S.fT = 0; } }
  /* greitis */
  /* atkarpoje (3 vartų eilės su tuo pačiu tikslu) tempas auga; pasikeitus tikslui – nukrinta ir vėl auga */
  const seg = Math.min(ROWS / SEG - 1, Math.floor(S.ri / SEG)), z0 = seg ? S.rows[seg * SEG - 1].z : 0, z1 = S.rows[seg * SEG + SEG - 1].z, prog = Math.max(0, Math.min(1, (z0 - S.pz) / (z0 - z1)));
  let vt = !S.run || S.fin ? 0 : S.tr.v * (0.82 + 0.5 * prog) * (1 + 0.04 * seg); if(S.slow > 0){ S.slow -= dt; vt = Math.min(vt, S.tr.v * 0.6); }
  S.v += (vt - S.v) * Math.min(1, dt * (S.fin ? 2.6 : vt < S.v ? 1.5 : 2.0)); S.pz -= S.v * dt;
  let dx;
  if(S.free){ S.fx = Math.max(-6.3, Math.min(6.3, S.fx + S.steer * 13 * dt)); dx = S.fx - S.px; if(S.run) S.px += dx * Math.min(1, dt * 12); dx = dx * 2.2 + S.steer * 1.4;
    let nl = 0; LANES.forEach((x, i) => { if(Math.abs(S.px - x) < Math.abs(S.px - LANES[nl])) nl = i; }); if(nl !== S.lane){ S.lane = nl; document.querySelectorAll(".wc").forEach((b, i) => b.classList.toggle("cur", i === nl)); } }
  else { dx = LANES[S.lane] - S.px; if(S.run) S.px += dx * Math.min(1, dt * (2.2 + S.v / 5)); }
  const leanT = Math.max(-1, Math.min(1, dx / 2.6)); S.lean += (leanT - S.lean) * Math.min(1, dt * 7);
  /* posūkis */
  let turn = 0; for(const q of S.turns) if(S.pz < q.zA && S.pz > q.zB){ const u2 = (q.zA - S.pz) / (q.zA - q.zB); turn = q.dir * Math.pow(Math.sin(Math.PI * u2), 0.8); }
  S.turn += (turn - S.turn) * Math.min(1, dt * 4); BEND.value = S.turn * BEND_K;
  for(const c of bsprites) c.position.x = c.userData.x0 + bendAt(c.userData.d);
  if(S.wob > 0) S.wob = Math.max(0, S.wob - dt * 0.9); if(S.cheer > 0) S.cheer = Math.max(0, S.cheer - dt);
  if(S.run && S.camW < 1) S.camW = Math.min(1, S.camW + dt / 1.3);
  /* slidininkas */
  const u = skier.userData, sp = S.v / 16, wob = Math.sin(S.t * 26) * S.wob * 0.4, br = S.fin ? 1 : 0; u.br = (u.br || 0) + (br - (u.br || 0)) * Math.min(1, dt * 6);
  const bob = Math.sin(S.t * 8.5) * 0.02 * sp, ch = Math.min(1, S.cheer * 3) * (S.fin ? 1 : Math.min(1, S.cheer * 3));
  skier.position.set(S.px, 0, S.pz); skier.rotation.z = -S.lean * 0.4 - S.turn * 0.3 + wob; skier.rotation.y = -S.lean * 0.42 - S.turn * 0.25;
  u.body.position.y = bob - Math.abs(S.lean) * 0.07 - u.br * 0.03; u.torso.rotation.x = -0.62 + u.br * 0.34 + ch * 0.3 - S.wob * 0.25 - Math.abs(S.lean) * 0.08; u.head.rotation.x = 0.5 - u.br * 0.25 - ch * 0.2; u.head.rotation.y = -S.lean * 0.3;
  u.skis[0].rotation.y = -u.br * 0.34; u.skis[1].rotation.y = u.br * 0.34; u.skis[0].position.z = S.lean * 0.12; u.skis[1].position.z = -S.lean * 0.12;
  u.arms.forEach((a, i) => { const s = i ? 1 : -1, fl = S.wob * Math.sin(S.t * 21 + i * 2) * 0.9, up = i === 1 || S.fin ? ch : 0;
    a.rotation.x = 1.4 + Math.sin(S.t * 3 + i) * 0.05 + fl + up * 1.5 - u.br * 0.2; a.rotation.z = s * (0.38 + Math.abs(S.lean) * 0.3 + u.br * 0.25 + up * 0.3); a.userData.fore.rotation.x = 0.65 - up * 0.5; a.userData.pole.rotation.x = -2.5 + up * 1.2 + u.br * 0.3; });
  u.scarf.forEach((sc, i) => { sc.rotation.y = Math.sin(S.t * 14 + i * 1.7) * (0.12 + sp * 0.3) + S.lean * 0.5; sc.rotation.x = 0.45 + Math.sin(S.t * 18 + i) * 0.14 * sp + (1 - Math.min(1, sp)) * 1.3; });
  blob.position.set(S.px, 0.03, S.pz + 0.2);
  sun.position.set(S.px - 34, 52, S.pz - 44); sun.target.position.set(S.px, 0, S.pz - 6);
  /* vėžės */
  const tu = trail.userData, pts = tu.pts; if(!pts.length || Math.abs(pts[0].z - S.pz) > 0.5) { pts.unshift({ x: S.px, z: S.pz, y: skier.rotation.y }); if(pts.length > tu.n) pts.pop(); }
  const ta = trail.geometry.attributes.position; for(let i = 0; i < tu.n; i++){ const p = i === 0 ? { x: S.px, z: S.pz + 0.9 } : pts[Math.min(i, pts.length - 1)]; [-0.36, -0.2, 0.2, 0.36].forEach((o, k) => ta.setXYZ(i * 4 + k, p.x + o, 0.03, p.z + (i === 0 ? 0 : 0.9))); } ta.needsUpdate = true;
  /* sniego purslai */
  const tcar = Math.abs(S.turn) > 0.25, carve = Math.abs(S.lean) > 0.12 || tcar, n = S.v > 2 && (carve || u.br > 0.3) ? (tcar ? 3 : 2) : 0;
  for(let k = 0; k < n; k++){ const p = spray.find(q => q.userData.t > 0.7); if(!p) break; const side = carve ? ((tcar ? S.turn : S.lean) > 0 ? -1 : 1) : (Math.random() < 0.5 ? -1 : 1); p.position.set(S.px + side * (0.3 + Math.random() * 0.6), 0.2, S.pz + 0.4 + Math.random() * 0.8); p.userData = { t: 0, vx: side * (2 + Math.random() * 4), vy: 2.5 + Math.random() * 3.5, vz: 1 + Math.random() * 3 - (u.br > 0.3 ? S.v * 0.5 : 0) }; p.scale.setScalar(0.6 + Math.random() * 1.2); }
  for(const p of spray){ const q = p.userData; if(q.t > 0.7){ p.visible = false; continue; } p.visible = true; q.t += dt; q.vy -= 12 * dt; p.position.x += q.vx * dt; p.position.y = Math.max(0.05, p.position.y + q.vy * dt); p.position.z += q.vz * dt; }
  for(const p of sparks){ const q = p.userData; if(q.t > 1){ p.visible = false; continue; } p.visible = true; q.t += dt; q.vy -= 14 * dt; p.position.x += q.vx * dt; p.position.y += q.vy * dt; p.position.z += q.vz * dt; p.rotation.y += dt * 9; p.rotation.x += dt * 7; }
  /* kamera: prieš startą – iš šono, važiuojant – iš paskos */
  const port = camera.aspect < 1, w = S.camW * S.camW * (3 - 2 * S.camW), oa = Math.sin(S.t * 0.5) * 0.35;
  cA.set(S.px - 4.6 * Math.cos(oa) , 2.7, S.pz + 5.2 + 2.4 * Math.sin(oa)); lA.set(S.px + 0.2, port ? 1.0 : 0.8, S.pz - 3);
  cB.set(S.px * 0.72, port ? 7.4 : 5.6, S.pz + (port ? 12 : 10.2)); lB.set(S.px * 0.86, port ? -0.9 : -4.4, S.pz - (port ? 16 : 24));
  if(DBG.orbit){ const o = DBG.orbit; cB.set(S.px + Math.sin(o.a) * o.d, o.h, S.pz + Math.cos(o.a) * o.d); lB.set(S.px, 1.2, S.pz); }
  camera.position.lerpVectors(cA, cB, w); lA.lerp(lB, w); camera.lookAt(lA); camera.rotation.z += (-S.lean * 0.04 - S.turn * 0.09) * w;
  const fov = (port ? 66 : 54) + sp * 4 * w; if(Math.abs(fov - camera.fov) > 0.05){ camera.fov = fov; camera.updateProjectionMatrix(); }
  /* aplinka */
  for(const t of tiles) t.o.position.z = Math.round(S.pz / t.len) * t.len - 500;
  backdrop.position.z = S.pz; backdrop.position.x = S.px * 0.3;
  loop(treeI, 84, 588, (i, k, z) => { const h = hs(i * 7.13 + k * 3.7), side = i % 2 ? 1 : -1; dummy.position.set(side * (13 + h * h * 70), 0, z + hs(i + k) * 5); dummy.scale.setScalar(0.75 + hs(i * 3.3 + k) * 0.95); dummy.rotation.y = h * 6; });
  loop(manI, 5, 590, (i, k, z) => { const side = (i + k) % 2 ? 1 : -1; dummy.position.set(side * (10.9 + hs(i + k * 5) * 1.2), 0, z); dummy.rotation.y = -side * 1.1; });
  loop(flagI, 12, 600, (i, k, z) => { const side = i % 2 ? 1 : -1; dummy.position.set(side * 10.1, 0, z); dummy.rotation.set(0, Math.PI / 2 + Math.sin(S.t * 5 + i) * 0.25, 0); });
  const fa = flakes.geometry.attributes.position; for(let i = 0; i < fa.count; i++){ let y = fa.getY(i) - dt * (2.5 + (i % 5)), z = fa.getZ(i) + S.v * dt * 0.9; if(y < 0) y += 30; if(z > 14) z -= 100; fa.setY(i, y); fa.setZ(i, z); } fa.needsUpdate = true; flakes.position.set(S.px * 0.6, 0, S.pz);
  for(const c of crystals){ if(!c.visible) continue; c.rotation.y += dt * 3; c.position.y = 1.15 + Math.sin(S.t * 4 + c.position.z) * 0.16; if(Math.abs(c.position.z - S.pz) < 1.6 && Math.abs(c.position.x - S.px) < 1.7){ c.visible = false; S.cr++; MK.sfx.star(S.cr); hud(); } }
  for(const a of arches){ const d = S.pz - a.position.z; a.userData.ban.material.opacity = Math.max(0, Math.min(1, (d - 16) / 14)); }
  /* vartai ir finišas */
  const row = S.rows[S.ri]; if(row && S.pz <= row.z) passRow();
  for(const r of S.rows) if(r.shake > 0){ r.shake -= dt; const k = Math.max(0, (r.shake - 0.72) / 0.28); r.objs.forEach(g => { const b = g.userData.b; b.scale.set(k, k, 1); b.position.y = 3.55 + (1 - k) * 1.6; b.visible = k > 0.02; }); }
  if(!S.fin && S.ri >= ROWS && S.pz < S.finZ - 6) finish();
  if(S.msgT > 0){ S.msgT -= dt; if(S.msgT <= 0) $("msg").innerHTML = ""; }
  renderer.render(scene, camera);
}

/* ============================== paleidimas ============================== */
$("app").prepend(MK.top({ title: T.title, grade: 7 }));
$("h1").textContent = T.h1; $("lead").textContent = T.lead; $("note").textContent = T.note(WORDS.length); $("trT").textContent = T.tracksT; $("ofT").textContent = T.outfitsT; $("ctT").textContent = T.ctrlT; $("lrT").textContent = T.learnT;
$("lr").innerHTML = T.learn.map(m => `<details class="lr"><summary>${m.name}</summary>${m.html}</details>`).join("");
window.__sl = { get S(){ return S; }, WORDS, BY, TRACKS, TG, buildRun, setLane, LANES, DBG, BEND, steer: x => { if(S){ S.fx = x; beginRun(); } } };
showMenu(); requestAnimationFrame(frame);
