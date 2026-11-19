/* Slibino sala, 2 pasaulis – „Kalno požemis“: žaidimo logika (meniu, valdymas, fizika, sąveikos, užduotys, kova, žemėlapis, išsaugojimas).
   Bendri dalykai (užduočių generatorius, slibino modelis, bendri tekstai) imami iš Slibino salos. */
import * as THREE from "../three.module.min.js";
import { makeDragon, animateDragon, glowTex } from "../sala-pasaulis.js";
import { buildCave, C, YU, YD } from "./pozemis-pasaulis.js";

const T = window.MK_T, TP = window.MK_T_P, TD = window.MK_T_D, UZ = window.MK_SALA_U, INK = "#121a33";
const GAME = "slibino-sala", SKEY = "mk-slibino-sala-pozemis", QKEY = "mk-slibino-sala-grafika", ISLAND = "mk-slibino-sala-kl5", OPENKEY = "mk-slibino-sala-pozemis-atv";
const $ = id => document.getElementById(id);
const TEST = /[?&]test=1/.test(location.search);
const RUNES = ["r1", "r2", "r3", "r4", "r5", "r6", "r7"], KEYS = ["gold", "silver", "bronze"], KCOL = { gold: "#ffc61a", silver: "#cfd6e4", bronze: "#c98a4a" };
/* užduočių dalykai: kiekvienoje vietoje – matematika ir kitas dalykas pakaitomis */
const TOPIC = { r1: ["frac", "gam", "frac"], r2: ["lt", "dec", "lt"], r4: ["geo", "en", "geo"], r6: ["eq", "ist", "eq"], queen: ["gam", "div", "lt"], gremlin: ["prob", "en", "eq", "ist"] };

/* ---------- piktogramos ---------- */
const ic = d => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const I = {
  menu: ic('<path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>'),
  map: ic('<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" fill="#fff6d6" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 4v14M15 6v14" stroke="currentColor" stroke-width="2"/>'),
  notes: ic('<path d="M5 3h14v18H5z" fill="#fff" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8 9l1.5 1.5L12 8M8 15l1.5 1.5L12 14M14 9.5h3M14 15.5h3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'),
  jump: ic('<path d="M12 20V6M6 11l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>'),
  act: ic('<path d="M8 13V6a1.6 1.6 0 0 1 3.2 0v5V4.6a1.6 1.6 0 0 1 3.2 0V11V6a1.6 1.6 0 0 1 3.2 0v7c0 4.5-2.6 8-6.6 8-3 0-4.6-1.6-6-4l-1.8-3.2a1.5 1.5 0 0 1 2.6-1.5L8 13" fill="#fff" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>'),
  torch: ic(`<path d="M3 10h9v4H3z" fill="#d8443a" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 9l5-3v12l-5-3z" fill="#9aa3b2" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/><path d="M19 8l2.5-1.5M19.5 12h3M19 16l2.5 1.5" stroke="#f0a800" stroke-width="2" stroke-linecap="round"/>`),
  sword: ic(`<path d="M20 3l1 1-10 11-2.2-2.2z" fill="#dfe6f2" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/><path d="M6.5 11.5l6 6M9 15l-5 5" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`),
  chute: ic(`<path d="M3 11a9 8 0 0 1 18 0q-2.2-2-4.5 0-2.2-2-4.5 0-2.2-2-4.5 0-2.3-2-4.5 0z" fill="#ff8a2a" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/><path d="M3 11l9 9 9-9M7.5 11L12 20l4.5-9" fill="none" stroke="${INK}" stroke-width="1.2"/>`),
  key: c => ic(`<circle cx="7.5" cy="12" r="4.5" fill="${c}" stroke="${INK}" stroke-width="1.8"/><circle cx="7.5" cy="12" r="1.3" fill="#fff" stroke="${INK}" stroke-width="1"/><path d="M12 12h9v3.5M17 12v3" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`)
};
const runeSvg = on => `<svg viewBox="0 0 20 26" aria-hidden="true"><path d="M4 3h12l3 8-3 12H4L1 11z" fill="${on ? "#9fe8ff" : "#e8e4da"}" stroke="${on ? INK : "#b4ad9c"}" stroke-width="1.8" stroke-linejoin="round"/>${on ? `<path d="M10 7v12M10 10l4-3M10 14l-4-3" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>` : ""}</svg>`;

/* ---------- išsaugojimas ---------- */
const fresh = () => ({ v: 1, pos: null, yaw: 0, intro: false, torch: false, sword: false, chute: false, mush: {}, webs: {}, runes: {}, keys: {}, opened: {}, queen: false, gremlin: false, cage: false, rgate: false, black: false, landed: false, rings: 0, gnomeTry: 0, mist: 0, dials: {}, seenU: [], seenD: [], time: 0, lastProg: 0, done: false });
let S = Object.assign(fresh(), MK.get(SKEY, {}));
const save = () => MK.set(SKEY, S);
const hasSave = () => !!MK.get(SKEY, null);
const nRunes = () => RUNES.filter(r => S.runes[r]).length, nMush = () => Object.keys(S.mush).length;

/* ===================== MENIU ===================== */
function heroSvg(){
  return `<svg viewBox="0 0 400 230" role="img" aria-label="Požemio tunelis su žibintu, nykštuku, šviečiančiais grybais ir juodojo slibino akimis tamsoje">
  <rect width="400" height="230" fill="#2a2740"/>
  <path d="M0 230V70q40-60 110-52 50-30 100-8 60-22 110 14 50 6 80 50v156z" fill="#4b4766" stroke="${INK}" stroke-width="3"/>
  <path d="M60 230V120q30-58 90-54 40-24 80-2 50-10 80 30 30 20 30 136z" fill="#15131f" stroke="${INK}" stroke-width="3"/>
  <g fill="#6a6690" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"><path d="M96 20l10 44 12-40z"/><path d="M180 8l9 36 11-34z"/><path d="M262 16l10 40 12-36z"/><path d="M330 52l8 30 10-26z"/></g>
  <path d="M0 230v-34q60-16 120-8 80-14 160-2 70-8 120 6v38z" fill="#8a84a6" stroke="${INK}" stroke-width="3"/>
  <circle cx="204" cy="150" r="46" fill="#ffd98a" opacity=".16"/>
  <path d="M204 66v40" stroke="${INK}" stroke-width="3"/><path d="M194 106h20l4 22h-28z" fill="#ffe2a8" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>
  <g fill="#ff5a5a"><ellipse cx="262" cy="118" rx="7" ry="4"/><ellipse cx="290" cy="116" rx="7" ry="4"/></g><g fill="${INK}"><ellipse cx="262" cy="118" rx="2" ry="4"/><ellipse cx="290" cy="116" rx="2" ry="4"/></g>
  <g transform="translate(96 150)"><path d="M0 44q0-26 16-26t16 26z" fill="#3f78d8" stroke="${INK}" stroke-width="2.6"/><circle cx="16" cy="14" r="11" fill="#f2c9a0" stroke="${INK}" stroke-width="2.6"/><path d="M5 10q11-40 22 0z" fill="#d8443a" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/><path d="M8 20q8 22 16 0z" fill="#fff" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><circle cx="12" cy="13" r="1.6" fill="${INK}"/><circle cx="20" cy="13" r="1.6" fill="${INK}"/></g>
  <g transform="translate(318 178)" stroke="${INK}" stroke-width="2.2"><path d="M8 16V6M22 18V2" stroke-width="5" stroke="#f4f1ea"/><path d="M0 8q8-12 16 0z M12 4q10-14 20 0z" fill="#6ff0c0" stroke-linejoin="round"/></g>
  <g transform="translate(150 176)"><path d="M6 0h16l4 10-4 16H6L2 10z" fill="#9fe8ff" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><path d="M14 5v16M14 9l5-4M14 14l-5-4" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/></g>
</svg>`;
}
let Q = MK.get(QKEY, null) || (matchMedia("(pointer:coarse)").matches ? "low" : "high");
const unlocked = () => hasSave() || !!MK.get(OPENKEY, null) || !!(MK.get(ISLAND, {}) || {}).vaultDone || TEST;
function drawMenu(){
  $("h1").innerHTML = TP.h1; $("heroP").textContent = TP.hero; $("note").textContent = TP.proto;
  $("heroArt").innerHTML = heroSvg();
  $("backL").textContent = TP.back;
  if(!unlocked()){
    $("starts").innerHTML = `<div class="card" style="margin:0"><h2>${TP.lockT}</h2><p style="margin:0 0 10px">${TP.lockB}</p><div class="starts"><a class="mk-btn" href="../" style="text-decoration:none">${TP.lockGo}</a><button type="button" class="mk-btn ghost" data-go="skip">${TP.lockSkip}</button></div></div>`;
  } else {
    const has = hasSave();
    $("starts").innerHTML = (has ? `<button type="button" class="mk-btn" data-go="cont">${TP.cont}</button><button type="button" class="mk-btn alt" data-go="new">${TP.newGame}</button>` : `<button type="button" class="mk-btn" data-go="new">${TP.start}</button>`);
  }
  $("qL").textContent = T.quality;
  $("qSeg").innerHTML = [["high", T.qHigh], ["low", T.qLow]].map(([k, l]) => `<button type="button" data-q="${k}" aria-pressed="${Q === k}">${l}</button>`).join("");
  $("qN").textContent = T.qNote;
  $("collT").textContent = TP.collTitle;
  $("mGems").innerHTML = RUNES.map(r => `<div class="${S.runes[r] ? "on" : ""}">${runeSvg(S.runes[r])}</div>`).join("");
  $("mDrg").innerHTML = itemsHtml(true) || "";
  $("ctrlT").textContent = T.ctrlTitle;
  $("ctrlK").innerHTML = TP.ctrlPc.concat(TP.ctrlPhone).map(([a, b]) => `<b>${a}</b><span>${b}</span>`).join("");
  $("ctrlTip").textContent = T.ctrlTip;
}
function itemsHtml(names){
  const L = [];
  for(const k of ["torch", "sword", "chute"]) if(S[k]) L.push([I[k], TP.items[k]]);
  for(const k of KEYS) if(S.keys[k]) L.push([I.key(KCOL[k]), TP.items[k]]);
  return L.map(([svg, n]) => names ? `<span class="it">${svg}${n}</span>` : `<span class="it" title="${n}">${svg}</span>`).join("");
}
const app = $("app");
app.prepend(MK.top({ title: TP.title, grade: 5 }));
drawMenu();
$("starts").addEventListener("click", e => {
  const b = e.target.closest("[data-go]"); if(!b) return; MK.unlock(); MK.music.stop();
  if(b.dataset.go === "skip"){ MK.set(OPENKEY, 1); drawMenu(); return; }
  if(b.dataset.go === "new"){ if(hasSave() && !confirm(TP.newConfirm)) return; S = fresh(); MK.set(SKEY, S); if(world){ location.reload(); return; } }
  enterGame();
});
$("qSeg").addEventListener("click", e => { const b = e.target.closest("[data-q]"); if(!b) return; Q = b.dataset.q; MK.set(QKEY, Q); drawMenu(); if(world) location.reload(); });

/* ===================== 3D ===================== */
let renderer, scene, camera, world = null, amb, aura, spot, clock, running = false;
let blackD = null, bolts = [], fires = [], canopy = null, swordV = null, swingT = 0;
const P = { x: 0, y: 0, z: 0, vy: 0, yaw: 0, pitch: 0, ground: true, eye: 1.65, bob: 0 };
const RAD = 0.35;
let mode = "walk"; // walk | ui | fight
function enterGame(){
  const g = $("game"); g.hidden = false; document.body.style.overflow = "hidden";
  if(matchMedia("(pointer:coarse)").matches) g.classList.add("touch");
  try{ if(g.requestFullscreen && matchMedia("(pointer:coarse)").matches) g.requestFullscreen().then(() => { try{ screen.orientation.lock("landscape").catch(() => {}); }catch(_){} }).catch(() => {}); }catch(_){}
  if(world){ placePlayer(); running = true; mode = "walk"; return; }
  $("loading").textContent = TP.loading; $("loading").hidden = false;
  setTimeout(() => {
    try{ init3D(); }catch(err){ console.error(err); $("loading").textContent = T.noGL; return; }
    $("loading").hidden = true; running = true; requestAnimationFrame(loop);
    if(!S.intro){ S.intro = true; save(); openDlg(`<h2>${TP.intro.t}</h2>${MK.guide(TP.intro.b)}<button type="button" class="mk-btn" data-close>${T.task.next}</button>`); }
  }, 40);
}
function exitGame(){
  running = false; savePos(); if(document.pointerLockElement) document.exitPointerLock();
  try{ if(document.fullscreenElement) document.exitFullscreen(); }catch(_){}
  $("game").hidden = true; document.body.style.overflow = ""; drawMenu(); window.scrollTo(0, 0);
}
function savePos(){ if(world && P.ground && mode !== "fight"){ S.pos = [P.x, P.y, P.z]; S.yaw = P.yaw; } save(); }

function init3D(){
  const high = Q === "high";
  renderer = new THREE.WebGLRenderer({ antialias: high, powerPreference: "high-performance" });
  if(!renderer.getContext()) throw new Error("no gl");
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, high ? 1.75 : 1.15));
  renderer.setSize(innerWidth, innerHeight);
  $("view").appendChild(renderer.domElement);
  scene = new THREE.Scene();
  const BG = new THREE.Color("#0a0812");
  scene.background = BG; scene.fog = new THREE.Fog(BG.clone(), 10, high ? 85 : 64);
  camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 300); scene.add(camera);
  amb = new THREE.AmbientLight("#dfe2ff", 1.7); scene.add(amb);
  aura = new THREE.PointLight("#ffd9a0", 5, 9, 1); scene.add(aura);
  spot = new THREE.SpotLight("#fff2cc", 0, 48, 0.6, 0.55, 1); spot.position.set(0.25, -0.15, 0); camera.add(spot);
  const tg = new THREE.Object3D(); tg.position.set(0, -0.3, -6); camera.add(tg); spot.target = tg;
  world = buildCave(scene, Q);
  const p = world.poi;
  /* juodasis slibinas ir jo salės šviesos */
  blackD = makeDragon({ body: "#2b2438", belly: "#75649a", wing: "#4a3d66", horn: "#d8d2e8", eye: "#ff5a5a" });
  blackD.scale.setScalar(1.5); blackD.position.set(p.dragon[0], YD, p.dragon[1]); blackD.traverse(o => o.castShadow = false); scene.add(blackD);
  for(const dz of [2, 14]){ const l = new THREE.PointLight("#c9a8ff", 26, 46, 1); l.position.set(p.dragon[0], YD + 10, p.dragon[1] + dz); scene.add(l); }
  /* parašiutas (matomas pažvelgus į viršų) */
  canopy = new THREE.Group();
  { const g = new THREE.SphereGeometry(2.6, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), cols = [], c1 = new THREE.Color("#ff8a2a"), c2 = new THREE.Color("#fff6e0");
    for(let i = 0; i < g.attributes.position.count; i++){ const a = Math.atan2(g.attributes.position.getZ(i), g.attributes.position.getX(i)), c = Math.floor((a + Math.PI) / (Math.PI / 4)) % 2 ? c1 : c2; cols.push(c.r, c.g, c.b); }
    g.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide })); m.position.y = 3.6; m.scale.y = 0.6; canopy.add(m);
    const lm = new THREE.LineBasicMaterial({ color: "#f4f1ea" }), pts = [];
    for(let k = 0; k < 8; k++){ const a = k * Math.PI / 4; pts.push(Math.cos(a) * 2.5, 3.6, Math.sin(a) * 2.5, 0, 1.9, 0); }
    const lg = new THREE.BufferGeometry(); lg.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3)); canopy.add(new THREE.LineSegments(lg, lm)); }
  canopy.visible = false; scene.add(canopy);
  /* kardas rankoje */
  swordV = new THREE.Group();
  { const bl = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.62, 0.012), new THREE.MeshBasicMaterial({ color: "#e6ecf5" })); bl.position.y = 0.36; swordV.add(bl);
    const gd = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.035, 0.04), new THREE.MeshBasicMaterial({ color: "#c9a23f" })); gd.position.y = 0.04; swordV.add(gd);
    const hd = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.13, 6), new THREE.MeshBasicMaterial({ color: "#6f4520" })); hd.position.y = -0.04; swordV.add(hd); }
  swordV.scale.setScalar(0.6); swordV.position.set(0.36, -0.34, -0.7); camera.add(swordV);
  applySave();
  clock = new THREE.Clock();
  addEventListener("resize", onResize);
  initInput(); buildHud();
  if(TEST) window.__poz = { P, S: () => S, world, mode: () => mode, setMode: m => mode = m, tp: (x, z, y) => { P.x = x; P.z = z; P.y = y != null ? y : world.groundAt(x, z, P.y + 1, 1); P.vy = 0; P.ground = y == null; }, quiz: () => quiz, fight: () => F, act: () => doAct(), inter: () => curInter, solve: () => quizSolve(), gnome: () => GP, apply: applySave, hud: updateHud, cam: camera, scene, spot, amb, aura, render: () => renderer.render(scene, camera),
    sim: (keys, sec, jump) => { const old = mode; mode = "walk"; keys.forEach(k => K[k] = true); if(jump) wantJump = true; for(let t = 0; t < sec; t += 1 / 60){ movePlayer(1 / 60); tickWorld(1 / 60); } keys.forEach(k => K[k] = false); mode = old; return [P.x, P.y, P.z]; } };
}
function onResize(){ if(!renderer) return; renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); }

function placePlayer(){
  if(S.pos){ [P.x, P.y, P.z] = S.pos; P.yaw = S.yaw || 0; }
  else { const [sx, sz] = world.start; P.x = sx; P.z = sz; P.y = YU; P.yaw = -Math.PI / 2; }
  P.vy = 0; P.ground = true; P.pitch = 0;
}
function applySave(){
  placePlayer();
  const W = world;
  W.flags.chute = !!S.chute; W.flags.bgate = !!S.gremlin; W.flags.rgate = !!S.rgate;
  for(const w of W.poi.webs) W.setWeb(w.id, !!S.webs[w.id]);
  for(const id in W.chests){ const c = W.chests[id]; c.open = !!S.opened[id]; c.lid.rotation.x = c.open ? -1.9 : 0; c.lock.visible = !c.open; }
  W.torchMesh.visible = !S.torch; swordV.visible = !!S.sword;
  W.mush.forEach(m => m.g.visible = !S.mush[m.k]);
  W.rune5.visible = !S.runes.r5;
  W.queen.visible = !S.queen; W.queenCol.on = !S.queen; W.spiders.forEach(s => { s.on = !S.queen; s.g.visible = !S.queen; });
  W.bgate.position.y = S.gremlin ? YD - 7 : YD; W.rgate.position.y = S.rgate ? YD - 7.2 : YD;
  W.cage.visible = !S.cage; W.cageCol.on = !S.cage;
  blackD.visible = !S.black;
  updateHud();
}
function updateHud(){
  const n = nRunes();
  W_sockets(n);
  $("hgems").innerHTML = `<span class="rn">${runeSvg(true)}<b>${n}/7</b></span>` + itemsHtml(false);
}
function W_sockets(n){ if(!world) return; world.sockets.forEach((s, k) => s.material.color.set(S.rgate || (placedRunes && k < n) ? "#9ff0ff" : "#2f3350")); }
let placedRunes = false;

/* ===================== VALDYMAS ===================== */
const K = {}; let lookDX = 0, lookDY = 0; const joy = { id: null, x0: 0, y0: 0, x: 0, y: 0 }, looks = new Map();
let wantJump = false, wantAct = false;
function initInput(){
  addEventListener("keydown", e => {
    if($("game").hidden) return;
    const k = e.key.toLowerCase();
    if(mode !== "walk"){ if(quiz && !$("tp").hidden && quiz.keys(e)) return; if(k === "escape") closeTop(); return; }
    if(k === "escape"){ openPause(); return; }
    K[e.code] = true;
    if(e.code === "Space"){ wantJump = true; e.preventDefault(); }
    if(k === "e" || k === "enter" || k === "f") wantAct = true;
    if(k === "m") openMap();
    if(k === "j") openNotes();
    if(e.code.startsWith("Arrow")) e.preventDefault();
  });
  addEventListener("keyup", e => { K[e.code] = false; });
  const cv = renderer.domElement;
  cv.addEventListener("click", () => { if(mode === "walk" && !$("game").classList.contains("touch") && cv.requestPointerLock) cv.requestPointerLock(); });
  addEventListener("mousemove", e => { if(document.pointerLockElement === cv){ lookDX += e.movementX; lookDY += e.movementY; } });
  const jz = $("joyZone"), lz = $("lookZone"), base = $("joyBase"), knob = $("joyKnob");
  $("game").addEventListener("touchstart", () => { $("game").classList.add("touch"); }, { passive: true });
  jz.addEventListener("pointerdown", e => { if(joy.id !== null) return; joy.id = e.pointerId; joy.x0 = e.clientX; joy.y0 = e.clientY; joy.x = joy.y = 0; base.style.display = "block"; base.style.left = e.clientX + "px"; base.style.top = (e.clientY - jz.getBoundingClientRect().top) + "px"; knob.style.transform = ""; try{ jz.setPointerCapture(e.pointerId); }catch(_){} $("joyHint").style.display = "none"; });
  jz.addEventListener("pointermove", e => { if(e.pointerId !== joy.id) return; let dx = e.clientX - joy.x0, dy = e.clientY - joy.y0; const l = Math.hypot(dx, dy), m = 56; if(l > m){ dx *= m / l; dy *= m / l; } joy.x = dx / m; joy.y = dy / m; knob.style.transform = `translate(${dx}px,${dy}px)`; });
  const jEnd = e => { if(e.pointerId !== joy.id) return; joy.id = null; joy.x = joy.y = 0; base.style.display = "none"; };
  jz.addEventListener("pointerup", jEnd); jz.addEventListener("pointercancel", jEnd);
  lz.addEventListener("pointerdown", e => { looks.set(e.pointerId, [e.clientX, e.clientY]); try{ lz.setPointerCapture(e.pointerId); }catch(_){} });
  lz.addEventListener("pointermove", e => { const p = looks.get(e.pointerId); if(!p) return; lookDX += (e.clientX - p[0]) * 2.2; lookDY += (e.clientY - p[1]) * 2.2; looks.set(e.pointerId, [e.clientX, e.clientY]); });
  const lEnd = e => looks.delete(e.pointerId);
  lz.addEventListener("pointerup", lEnd); lz.addEventListener("pointercancel", lEnd);
  const tap = (id, f) => $(id).addEventListener("pointerdown", e => { e.preventDefault(); e.stopPropagation(); MK.unlock(); MK.music.stop(); f(); });
  tap("bJump", () => wantJump = true); tap("bAct", () => wantAct = true);
  $("hMenu").onclick = openPause; $("hMap").onclick = openMap; $("hNotes").onclick = openNotes;
  $("game").addEventListener("click", e => { const c = e.target.closest("[data-close]"); if(c){ MK.sfx.tap(); closeOv(c.closest(".ov")); } });
  document.addEventListener("visibilitychange", () => { if(document.hidden) savePos(); });
  addEventListener("pagehide", savePos);
}
function buildHud(){
  $("hMenu").innerHTML = I.menu; $("hMap").innerHTML = I.map; $("hNotes").innerHTML = I.notes;
  $("hMenu").setAttribute("aria-label", T.hud.menu); $("hMap").setAttribute("aria-label", T.hud.map); $("hNotes").setAttribute("aria-label", TP.hudNotes);
  $("bJump").innerHTML = I.jump + T.hud.jump; $("bAct").innerHTML = I.act + `<span id="actL">${T.hud.act}</span>`;
  $("joyHint").textContent = T.joy; $("rot").textContent = T.hud.rotate; $("rot").classList.add("show");
  setTimeout(() => $("rot").classList.remove("show"), 9000);
}

/* ===================== FIZIKA ===================== */
const BH = 1.8;
let warnT = 0;
function warn(s){ if(performance.now() - warnT > 3500){ warnT = performance.now(); toast(s, 3200); } }
/* 0 – laisva, 1 – siena ar daiktas, 2 – lava, 3 – tamsa be žibintuvėlio, 4 – šachta be parašiuto */
function blocked(x, z, feet, step){
  const c = world.cell(x, z, feet);
  if(c.dark && !S.torch) return 3;
  if(c.hole && !S.chute) return 4;
  const g = world.groundAt(x, z, feet, step);
  if(g > feet + step) return 1;
  if(g < -1 && P.ground && feet < 5) return 2;
  const hh = feet + BH;
  for(const o of world.cols){
    if(!o.on || o.y1 <= feet + step || o.y0 >= hh) continue;
    if(o.t === "c"){ if(Math.hypot(x - o.x, z - o.z) < o.r + RAD) return 1; }
    else if(x > o.x0 - RAD && x < o.x1 + RAD && z > o.z0 - RAD && z < o.z1 + RAD) return 1;
  }
  return 0;
}
const GL = { on: false, n: 0, prevY: 0 };
function movePlayer(dt){
  P.yaw -= lookDX * 0.0024; P.pitch -= lookDY * 0.0024; lookDX = lookDY = 0;
  P.pitch = Math.max(-1.45, Math.min(1.3, P.pitch));
  let fx = 0, fz = 0, run = false;
  if(K.KeyW || K.ArrowUp) fz += 1; if(K.KeyS || K.ArrowDown) fz -= 1; if(K.KeyA || K.ArrowLeft) fx -= 1; if(K.KeyD || K.ArrowRight) fx += 1;
  if(K.ShiftLeft || K.ShiftRight) run = true;
  if(joy.id !== null){ fx += joy.x; fz += -joy.y; if(Math.hypot(joy.x, joy.y) > 0.92) run = true; }
  const l = Math.hypot(fx, fz); if(l > 1){ fx /= l; fz /= l; }
  const sp = GL.on ? 6 : run ? 8.5 : 5.2;
  const sy = Math.sin(P.yaw), cy = Math.cos(P.yaw);
  const dx = (-sy * fz + cy * fx) * sp * dt, dz = (-cy * fz - sy * fx) * sp * dt;
  const step = P.ground ? 0.5 : 0.06;
  const dl = Math.hypot(dx, dz), n = Math.max(1, Math.ceil(dl / 0.3));
  for(let i = 0; i < n; i++){
    const sx = dx / n, sz = dz / n;
    const b = blocked(P.x + sx, P.z + sz, P.y, step);
    if(!b){ P.x += sx; P.z += sz; continue; }
    if(b === 2) warn(TP.lava); else if(b === 3) warn(TP.dark); else if(b === 4) warn(TP.holeNo);
    if(!blocked(P.x + sx, P.z, P.y, step)) P.x += sx; else if(!blocked(P.x, P.z + sz, P.y, step)) P.z += sz;
  }
  if(l > 0.1 && P.ground) P.bob += dt * sp * 1.6;
  if(wantJump && P.ground){ P.vy = 8; P.ground = false; MK.sfx.hop(2); }
  wantJump = false;
  if(P.ground){
    const g = world.groundAt(P.x, P.z, P.y, 0.5);
    if(g >= P.y - 0.65) P.y = g; else { P.ground = false; P.vy = 0; }
  }
  if(!P.ground){
    const sup = world.groundAt(P.x, P.z, P.y, 0.06);
    P.vy -= 24 * dt;
    /* parašiutas: išsiskleidžia krintant iš aukštai */
    if(S.chute && P.vy < -4 && P.y - sup > 5){ if(!GL.on){ GL.on = true; GL.n = 0; world.rings.forEach(r => { r.got = false; r.m.visible = true; }); toast(TP.glide.start, 3600); MK.sfx.whoosh(); } }
    if(GL.on) P.vy = Math.max(P.vy, -7);
    const ny = P.y + P.vy * dt;
    if(GL.on) for(const r of world.rings) if(!r.got && P.y + 1 >= r.y && ny + 1 < r.y && Math.hypot(P.x - r.x, P.z - r.z) < 2.5){ r.got = true; r.m.visible = false; GL.n++; MK.sfx.star(GL.n); toast(TP.glide.ring(GL.n), 1800); }
    if(ny <= sup){ P.y = sup; P.vy = 0; P.ground = true; if(GL.on) landed(); else if(P.y < -1){ rescue(); toast(TP.lava, 3600); } } else P.y = ny;
  }
  safeTrack(dt, l);
}
function landed(){
  GL.on = false;
  if(P.y < -1){ /* lava */
    P.x = (9 + 0.5) * C; P.z = (15 + 0.5) * C; P.y = YU; P.yaw = Math.PI / 2; P.pitch = 0; MK.sfx.bad(); toast(TP.glide.lava, 5200);
    $("vign").classList.add("on"); setTimeout(() => $("vign").classList.remove("on"), 700); return;
  }
  const first = !S.landed; S.landed = true; S.rings = Math.max(S.rings || 0, GL.n); progress();
  MK.sfx.win(); toast((GL.n === 3 ? TP.glide.master : TP.glide.ok) + (first ? " " + TP.liftOn : ""), 4500); if(GL.n === 3) inGame(() => MK.confetti(30));
  savePos();
}
/* saugios vietos ir išlaisvinimas įstrigus */
const safeList = []; let safeT = 0, trapN = 0;
function isTrapped(){ for(let k = 0; k < 8; k++){ const a = k * Math.PI / 4; if(!blocked(P.x + Math.cos(a) * 0.4, P.z + Math.sin(a) * 0.4, P.y, 0.5)) return false; } return true; }
function safeTrack(dt){
  safeT -= dt; if(safeT > 0) return; safeT = 0.6;
  if(!P.ground) return;
  if(isTrapped()){ if(++trapN >= 2){ trapN = 0; rescue(); } return; }
  trapN = 0;
  let free = 0; for(let k = 0; k < 8; k++){ const a = k * Math.PI / 4; if(!blocked(P.x + Math.cos(a) * 1.2, P.z + Math.sin(a) * 1.2, P.y, 0.5)) free++; }
  if(free < 8) return;
  const last = safeList[safeList.length - 1];
  if(!last || Math.hypot(P.x - last[0], P.z - last[2]) > 4 || Math.abs(P.y - last[1]) > 5){ safeList.push([P.x, P.y, P.z]); if(safeList.length > 8) safeList.shift(); }
}
function rescue(){
  let t = null;
  for(let k = safeList.length - 1; k >= 0; k--){ const s = safeList[k]; if(Math.abs(s[1] - P.y) < 5 && Math.hypot(P.x - s[0], P.z - s[2]) > 2.5){ t = s; break; } }
  if(!t) t = P.y > 35 ? [world.start[0], YU, world.start[1]] : [world.poi.liftD[0] - 3, YD, world.poi.liftD[1]];
  P.x = t[0]; P.y = t[1]; P.z = t[2]; P.vy = 0; P.ground = true; GL.on = false;
  toast(TP.rescued, 3800); MK.sfx.whoosh();
}

/* ===================== SĄVEIKOS ===================== */
let curInter = null;
const d2 = (x, z) => Math.hypot(P.x - x, P.z - z);
const isUp = () => P.y > 35;
function interactions(){
  const W = world, p = W.poi, L = [], up = isUp();
  const add = (lvlUp, x, z, r, label, f) => { if(lvlUp === up) L.push({ d: d2(x, z), r, label, f }); };
  if(!P.ground) return null;
  if(!S.torch) add(true, p.torch[0], p.torch[1], 3, TP.act.take, takeTorch);
  add(true, W.npc.mole.position.x, W.npc.mole.position.z, 3.4, TP.act.talk, talkMole);
  add(true, W.npc.gnome.position.x, W.npc.gnome.position.z, 3.4, TP.act.talk, talkGnome);
  for(const m of W.mush) if(!S.mush[m.k]) add(true, m.x, m.z, 2.6, TP.act.pick, () => pickMush(m));
  for(const w of p.webs) if(!S.webs[w.id]) add(true, w.x, w.z, 5, S.sword ? TP.act.cut : TP.act.web, () => cutWeb(w));
  for(const id in W.chests){ const c = W.chests[id]; if(!c.open) add(id !== "r6", c.x, c.z, 3, TP.act.unlock, () => lockChest(id)); }
  if(!S.queen){ add(true, W.queen.position.x, W.queen.position.z, 5.2, TP.act.queen, queenQuiz);
    let ds = 99; for(const s of W.spiders) if(s.on && !s.flee) ds = Math.min(ds, d2(s.x, s.z)); if(ds < 4.6 && S.sword && up) L.push({ d: ds - 3, r: 4.6, label: TP.act.swing, f: swing }); }
  add(true, p.liftU[0], p.liftU[1], 2.8, TP.act.lift, () => lift(true));
  add(false, p.liftD[0], p.liftD[1], 2.8, TP.act.lift, () => lift(false));
  add(false, W.npc.gremlin.position.x, W.npc.gremlin.position.z, 3.6, S.gremlin ? TP.act.talk : TP.act.duel, talkGremlin);
  add(false, p.cage[0], p.cage[1], 4.2, S.cage ? TP.act.talk : TP.act.cage, talkPrincess);
  if(!S.rgate) add(false, p.rgate[0], p.rgate[1] + 3, 5, nRunes() === 7 ? TP.act.place : TP.act.gate, gateAct);
  else if(!S.black && blackD.visible) add(false, blackD.position.x, blackD.position.z, 17, TP.act.fight, startFight);
  let best = null; for(const it of L) if(it.d < it.r && (!best || it.d - it.r < best.d - best.r)) best = it;
  return best;
}
function updatePrompt(){
  curInter = mode === "walk" ? interactions() : null;
  const p = $("prompt"), touch = $("game").classList.contains("touch");
  if(curInter){ p.hidden = touch; p.innerHTML = `<kbd>E</kbd>${curInter.label}`; $("actL").textContent = curInter.label; $("bAct").classList.add("ready"); }
  else { p.hidden = true; $("actL").textContent = S.sword ? TP.act.swing : T.hud.act; $("bAct").classList.remove("ready"); }
}
function doAct(){ if(mode !== "walk") return; if(curInter){ MK.sfx.tap(); curInter.f(); } else if(S.sword) swing(); }
const say = (name, html, btn) => openDlg(`<button type="button" class="x" data-close aria-label="${T.close}">✕</button><h2>${name}</h2>${MK.guide(html)}${btn || `<button type="button" class="mk-btn" data-close>${T.task.next}</button>`}`);
function gotRune(id, extra){
  S.runes[id] = true; progress(); updateHud(); MK.sfx.win(); inGame(() => MK.confetti(24));
  const n = nRunes(); toast((extra ? extra + " " : "") + TP.rune(n, n === 7), 4600); save();
}
function takeTorch(){ S.torch = true; world.torchMesh.visible = false; progress(); updateHud(); MK.sfx.coins(); toast(TP.gotTorch, 4200); save(); }
function pickMush(m){ S.mush[m.k] = true; m.g.visible = false; progress(); MK.sfx.star(nMush()); toast(TP.mushGot(nMush()) + (nMush() === 3 ? " " + TP.mushAll : ""), 3800); save(); }
function cutWeb(w){
  if(!S.sword){ toast(TP.webNo, 4200); return; }
  swingT = 0.35; S.webs[w.id] = true; world.setWeb(w.id, true); progress(); MK.sfx.whoosh(); toast(TP.webCut); save();
  for(let k = 0; k < 14; k++) fires.push(particle(w.x + (Math.random() - 0.5) * 4, YU + 1 + Math.random() * 4, w.z + (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 2, -1 - Math.random() * 2, (Math.random() - 0.5) * 2, "#e8eef8", 0.9, 0.5, false));
}
function talkMole(){
  const M = TP.mole;
  if(S.chute){ say(M.n, M.after); return; }
  if(nMush() < 3){ say(M.n, (S.metMole ? "" : M.hello + "<br><br>") + M.need(nMush())); S.metMole = true; save(); return; }
  S.chute = true; world.flags.chute = true; progress(); updateHud(); MK.sfx.win(); save(); say(M.n, M.give); toast(TP.gotChute, 4000);
}
/* nykštuko loginė mįslė: trys skrynelės, tik vienas užrašas teisingas (sprendinys tikrinamas kodu – visada vienintelis) */
let GP = null, lastGP = "";
function gnomePuzzle(){
  const G = TP.gnome;
  for(let tries = 0; tries < 500; tries++){
    const st = [0, 1, 2].map(i => { const k = Math.floor(Math.random() * 4), o = (i + 1 + Math.floor(Math.random() * 2)) % 3;
      return k === 0 ? { k, o: i, txt: G.here, f: s => s === i } : k === 1 ? { k, o: i, txt: G.notHere, f: s => s !== i } : k === 2 ? { k, o, txt: G.inX(G.boxIn[o]), f: s => s === o } : { k, o, txt: G.notInX(G.boxIn[o]), f: s => s !== o }; });
    const cnt = [0, 1, 2].map(s => st.filter(q => q.f(s)).length), sol = [0, 1, 2].filter(s => cnt[s] === 1);
    const sig = st.map(q => (q.k % 2) + "" + q.o).join("-");
    /* vengiame per lengvų (visi trys užrašai tos pačios rūšies) ir ką tik matytų mįslių */
    if(sol.length !== 1 || sig === lastGP || new Set(st.map(q => (q.k % 2) + "" + q.o)).size < 3 || st.every(q => q.k % 2 === st[0].k % 2)) continue;
    lastGP = sig; return { st, cnt, a: sol[0] };
  }
  return null;
}
function talkGnome(){
  const G = TP.gnome;
  if(S.sword){ say(G.n, G.after); return; }
  GP = gnomePuzzle(); drawGnome(G.hello);
}
function drawGnome(msg){
  const G = TP.gnome, cols = ["#ff8f80", "#8fc0ff", "#8fe0a0"];
  openDlg(`<button type="button" class="x" data-close aria-label="${T.close}">✕</button><h2>${G.n}</h2>${MK.guide(msg)}<p class="grule">${G.rule}</p>
    <div class="gbox">${GP.st.map((q, i) => `<button type="button" data-gb="${i}" style="--bc:${cols[i]}"><b>${G.boxes[i]}</b><span>„${q.txt}“</span></button>`).join("")}</div>`);
  $("dlgP").querySelector(".gbox").onclick = e => { const b = e.target.closest("[data-gb]"); if(!b) return; gnomePick(+b.dataset.gb); };
}
function gnomePick(i){
  const G = TP.gnome;
  if(i !== GP.a){ S.gnomeTry++; save(); MK.sfx.bad(); GP = gnomePuzzle(); drawGnome(G.wrong); return; }
  const why = GP.cnt.map((n, s) => G.whyRow(G.boxIn[s], n, n === 1)).join("<br>");
  S.sword = true; swordV.visible = true; progress(); updateHud(); MK.sfx.win(); inGame(() => MK.confetti(30)); save();
  openDlg(`<h2>${G.n}</h2>${MK.guide(G.right)}${MK.why({ ok: true, head: TP.gotSword, body: "", more: why, sum: G.why, open: true })}<button type="button" class="mk-btn" data-close>${T.task.next}</button>`);
}
function lockChest(id){
  if(id === "r4" && !S.queen){ toast(TP.chestQueen, 3600); return; }
  openQuiz({ title: TP.chest.t, intro: TP.chest.b, topic: TOPIC[id], need: 3, key: id, onDone: () => {
    const c = world.chests[id]; c.open = true; S.opened[id] = true; c.lock.visible = false; openingChests.push({ c, t: 0 }); MK.sfx.coins();
    if(id === "r6"){ S.keys.bronze = true; gotRune(id, TP.bronze); } else gotRune(id);
  } });
}
const openingChests = [];
/* vorai ir karalienė */
function swing(){
  if(swingT > 0) return; swingT = 0.35; MK.sfx.whoosh();
  let n = 0; for(const s of world.spiders) if(s.on && d2(s.x, s.z) < 5 && isUp()){ s.flee = 7; n++; }
  if(n) toast(TP.spiderAway, 1800);
}
function queenQuiz(){
  openQuiz({ title: TP.queen.n, intro: TP.queen.intro, topic: TOPIC.queen, need: 3, key: "queen", onDone: () => {
    S.queen = true; S.keys.gold = true; progress(); updateHud(); save();
    world.queen.visible = false; world.queenCol.on = false; world.spiders.forEach(s => { s.on = false; s.g.visible = false; });
    MK.sfx.win(); inGame(() => MK.confetti(30)); say(TP.queen.n, TP.queen.won);
  } });
}
function lift(fromUp){
  if(!S.landed){ toast(TP.liftStuck, 4600); return; }
  const p = world.poi, t = fromUp ? p.liftD : p.liftU;
  liftFade = 1.1; MK.sfx.vroom(); toast(TP.liftGo, 1600); mode = "ui";
  setTimeout(() => { P.x = t[0]; P.z = t[1]; P.y = fromUp ? YD : YU; P.vy = 0; P.ground = true; mode = "walk"; savePos(); }, 750);
}
function talkGremlin(){
  const G = TP.gremlin;
  if(S.gremlin){ say(G.n, G.after); return; }
  say(G.n, G.hello, `<button type="button" class="mk-btn" id="gGo">${TP.act.duel}</button>`);
  $("gGo").onclick = () => { closeOv($("dlg")); openQuiz({ title: G.n, intro: G.quiz, topic: TOPIC.gremlin, need: 4, key: "gremlin", onDone: () => {
    S.gremlin = true; S.keys.silver = true; world.flags.bgate = true; gateAnim.push({ g: world.bgate, to: YD - 7 }); MK.sfx.vroom(); say(G.n, G.won); gotRune("r3");
  } }); };
}
function talkPrincess(){
  const R = TP.princess;
  if(S.cage){ say(R.n, R.after); return; }
  const miss = KEYS.filter(k => !S.keys[k]);
  if(miss.length){ say(R.n, R.locked(miss.map(k => R.hints[k]).join("; "))); return; }
  S.cage = true; world.cageCol.on = false; gateAnim.push({ g: world.cage, to: YD - 3.4, hide: true }); MK.sfx.coins(); say(R.n, R.free); gotRune("r7");
}
const gateAnim = []; let liftFade = 0;
function gateAct(){
  const n = nRunes(); placedRunes = true; W_sockets(n);
  if(n < 7){ MK.sfx.star(n); say(TP.gate.t, TP.gate.need(n)); return; }
  S.rgate = true; world.flags.rgate = true; gateAnim.push({ g: world.rgate, to: YD - 7.2 }); progress(); save(); W_sockets(7); MK.sfx.vroom(); toast(TP.gate.open, 5000);
}

/* ===================== UŽDUOTYS ===================== */
let quiz = null; const askedQ = new Set();
function openQuiz(o){
  if(document.pointerLockElement) document.exitPointerLock();
  mode = "ui";
  quiz = Object.assign({ got: o.key && S.dials[o.key] || 0, t: null, input: "", done: false, first: true }, o);
  quiz.keys = e => {
    if(!quiz || quiz.answered || !quiz.t){ if(e.key === "Enter" && quiz && quiz.answered){ const b = $("tGo"); if(b) b.click(); return true; } return e.key !== "Escape"; }
    if(quiz.t.type === "num"){
      if(/^[0-9]$/.test(e.key)) padKey(e.key); else if(e.key === "," || e.key === ".") padKey(","); else if(e.key === "Backspace") padKey("bs"); else if(e.key === "Enter") padKey("go"); else return e.key !== "Escape";
      e.preventDefault(); return true;
    }
    if(/^[1-4]$/.test(e.key)){ answerOpt(+e.key - 1); return true; }
    return e.key !== "Escape";
  };
  $("tp").classList.toggle("fight", !!o.fight);
  $("tp").hidden = false;
  nextTask();
}
function nextTask(){
  const q = quiz; q.asked = (q.asked || 0) + 1;
  const tp = Array.isArray(q.topic) ? q.topic[(q.fight ? q.asked - 1 : q.got) % q.topic.length] : q.topic;
  /* per vieną apsilankymą ta pati užduotis nekartojama */
  let t, k = 0; do { t = UZ.gen(tp); k++; } while(askedQ.has(t.q) && k < 12);
  askedQ.add(t.q); q.t = t; q.input = ""; q.answered = false; drawQuiz();
}
function dialsHtml(){
  const q = quiz;
  if(q.fight) return "";
  return `<div class="dls">${Array.from({ length: q.need }, (_, i) => `<span class="dl${i < q.got ? " ok" : ""}">${i < q.got ? "✓" : i + 1}</span>`).join("")}</div>`;
}
function drawQuiz(why){
  const q = quiz, t = q.t;
  const intro = q.first && q.intro ? MK.guide(q.intro) : "";
  let inp = "";
  if(t.type === "num"){
    const cls = q.answered ? (q.ok ? " ok" : " bad") : "";
    inp = `<div class="ans${cls}" aria-live="polite">${q.input || ""}${q.answered ? "" : '<span class="cur"></span>'}</div>
      <div class="pad">${["7", "8", "9", "bs", "4", "5", "6", "go", "1", "2", "3", "0", ","].map(k => k === "bs" ? `<button type="button" data-k="bs" class="bs" aria-label="Trinti" ${q.answered ? "disabled" : ""}>⌫</button>` : k === "go" ? `<button type="button" data-k="go" class="go" ${q.answered ? "disabled" : ""}>${T.task.check}</button>` : `<button type="button" data-k="${k}" ${q.answered ? "disabled" : ""}>${k}</button>`).join("")}</div>`;
  } else {
    const longest = Math.max(...t.opts.map(o => String(o).replace(/<[^>]+>/g, "").length));
    inp = `<div class="opts${longest > 26 ? " txt" : longest > 11 ? " mid" : ""}">${t.opts.map((o, i) => `<button type="button" data-o="${i}" class="${q.answered ? (i === t.a ? "ok" : i === q.pick ? "no" : "") : ""}" ${q.answered ? "disabled" : ""}>${o}</button>`).join("")}</div>`;
  }
  $("tpP").innerHTML = `<button type="button" class="x" id="tX" aria-label="${T.close}">✕</button><h2>${q.title}</h2>${intro}${dialsHtml()}<div class="subj s-${t.subj}">${TD.subj[t.subj]}</div>
    <div class="tgrid"><div><div class="tq">${t.q}${t.fig || ""}</div></div><div>${inp}</div></div><div id="tWhy">${why || ""}</div>`;
  $("tX").hidden = !!q.fight;
}
function padKey(k){
  const q = quiz; if(!q || q.answered) return;
  if(k === "bs") q.input = q.input.slice(0, -1);
  else if(k === "go"){ if(q.input) return answer(UZ.check(q.t, q.input)); return; }
  else if(k === ","){ if(!q.input.includes(",") && q.input) q.input += ","; }
  else if(q.input.length < 9) q.input = (q.input === "0" ? "" : q.input) + k;
  MK.sfx.tap();
  const a = $("tpP").querySelector(".ans"); if(a) a.innerHTML = (q.input || "") + '<span class="cur"></span>';
}
function answerOpt(i){ const q = quiz; if(!q || q.answered) return; q.pick = i; answer(UZ.check(q.t, i)); }
function answer(ok){
  const q = quiz; q.answered = true; q.ok = ok; q.first = false;
  if(ok){ q.got++; if(q.key) S.dials[q.key] = q.got; MK.sfx.good(); } else MK.sfx.bad();
  const t = q.t, done = !q.fight && q.got >= q.need;
  const head = ok ? MK.praise() : T.task.bad + " " + T.task.answerIs(t.show);
  const why = MK.why({ ok, head, body: "", more: t.why, sum: T.task.explain, open: !ok });
  drawQuiz(why + `<button type="button" class="mk-btn" id="tGo">${T.task.next}</button>`);
  if(q.onAnswer) q.onAnswer(ok);
  if(done) q.done = true;
  const w = $("tWhy"); if(w) setTimeout(() => w.scrollIntoView({ behavior: "smooth", block: "nearest" }), 60);
}
function quizSolve(){ const q = quiz; if(!q || !q.t) return; if(q.t.type === "opt") answerOpt(q.t.a); else { q.input = UZ.fmt(q.t.a); answer(true); } }
$("tp").addEventListener("click", e => {
  const q = quiz; if(!q) return;
  if(e.target.closest("#tX")){ MK.sfx.tap(); closeQuiz(); save(); return; }
  const k = e.target.closest("[data-k]"); if(k){ padKey(k.dataset.k); return; }
  const o = e.target.closest("[data-o]"); if(o){ answerOpt(+o.dataset.o); return; }
  if(e.target.closest("#tGo")){
    MK.sfx.tap();
    if(q.done){ closeQuiz(); q.onDone && q.onDone(); return; }
    if(q.beforeNext && q.beforeNext() === false) return;
    nextTask();
  }
});
function closeQuiz(){ $("tp").hidden = true; quiz = null; if(mode === "ui") mode = "walk"; }

/* ===================== KOVA SU JUODUOJU SLIBINU ===================== */
let F = null;
function startFight(){
  const d = blackD;
  if(document.pointerLockElement) document.exitPointerLock();
  F = { d, hp: 7, max: 7, sh: 3, mist: 0, hit: 0, roar: 1.2, fire: 0 };
  const dist = innerWidth > innerHeight ? 17 : 19.5;
  P.x = d.position.x; P.z = d.position.z + dist; P.y = YD; P.ground = true; P.vy = 0;
  d.rotation.y = 0;
  MK.sfx.vroom(); mode = "fight";
  drawFHud(); $("fhud").hidden = false;
  openQuiz({ title: TP.black.n, intro: T.fight.intro(TP.black.n), topic: "mix", fight: true, need: 999,
    onAnswer: ok => { if(ok){ shootBolt(); F.hp--; } else { breatheFire(); F.sh--; F.mist++; } drawFHud(); },
    beforeNext: () => { if(F.hp <= 0){ closeQuiz(); winFight(); return false; } if(F.sh <= 0){ closeQuiz(); loseFight(); return false; } return true; }
  });
  mode = "fight";
}
function drawFHud(){
  if(!F) return;
  $("fhud").innerHTML = `<div>${T.fight.hp}</div><div class="bar hp">${Array.from({ length: F.max }, (_, i) => `<i class="${i < F.hp ? "on" : ""}"></i>`).join("")}</div>
    <div>${T.fight.shields}</div><div class="bar sh">${Array.from({ length: 3 }, (_, i) => `<i class="${i < F.sh ? "on" : ""}"></i>`).join("")}</div>`;
}
function mouthPos(d){ const v = new THREE.Vector3(0, 0.1, 1.5); d.userData.head.localToWorld(v); return v; }
function chestPos(d){ return d.position.clone().add(new THREE.Vector3(0, 2.2 * d.scale.y, 0)); }
function shootBolt(){
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), color: "#7fe8ff", transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  s.scale.set(1.6, 1.6, 1); scene.add(s);
  bolts.push({ s, from: camera.position.clone().add(new THREE.Vector3(0, -0.4, 0)), to: chestPos(F.d), t: 0 }); MK.sfx.whoosh();
}
function breatheFire(){ F.roar = 1.3; F.fire = 1.0; MK.sfx.vroom(); setTimeout(() => { $("vign").classList.add("on"); setTimeout(() => $("vign").classList.remove("on"), 700); }, 350); }
function particle(x, y, z, vx, vy, vz, col, life, size, glow){
  const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), color: col, transparent: true, depthWrite: false, blending: glow === false ? THREE.NormalBlending : THREE.AdditiveBlending }));
  m.position.set(x, y, z); m.scale.set(size, size, 1); scene.add(m); return { m, vx, vy, vz, life, max: life, size, grav: glow === false };
}
function winFight(){
  const f = F; $("fhud").hidden = true; F = null; f.d.userData.flyAway = 0.001; MK.sfx.win(); inGame(() => MK.confetti(60));
  S.black = true; S.mist = f.mist; S.done = true; progress(); mode = "ui";
  const pen = f.mist + (S.gnomeTry || 0), stars = pen <= 1 ? 3 : pen <= 4 ? 2 : 1; MK.best(GAME, "pozemis", stars); savePos();
  setTimeout(() => {
    inGame(() => MK.result({ stars, title: TP.winTitle, text: TP.black.won + " " + TP.winText(Math.max(1, Math.round(S.time / 60)), f.mist, S.gnomeTry || 0, S.rings || 0) + " " + TP.winMore,
      next: () => { mode = "walk"; }, nextLabel: TP.winBtn, again: () => { S = fresh(); MK.set(SKEY, S); location.reload(); }, menu: () => { mode = "walk"; exitGame(); }, menuLabel: T.pause.exit }));
  }, 1800);
}
function loseFight(){
  $("fhud").hidden = true; F = null; mode = "ui";
  openDlg(`<h2>${TP.black.n}</h2>${MK.guide(T.fight.lost)}<div class="mrow"><button type="button" class="mk-btn" id="fRetry">${T.fight.retry}</button><button type="button" class="mk-btn alt" id="fLeave">${T.fight.leave}</button></div>`);
  $("fRetry").onclick = () => { closeOv($("dlg")); startFight(); };
  $("fLeave").onclick = () => { closeOv($("dlg")); const g = world.poi.rgate; P.x = g[0]; P.z = g[1] + 5; P.y = YD; P.yaw = Math.PI; mode = "walk"; };
}

/* ===================== LANGAI ===================== */
function openDlg(html){ if(document.pointerLockElement) document.exitPointerLock(); $("dlgP").innerHTML = html; $("dlg").hidden = false; if(mode === "walk") mode = "ui"; }
function closeOv(ov){ if(!ov) return; ov.hidden = true; if(ov.id === "tp"){ quiz = null; } if(mode === "ui" && !anyOpen()) mode = F ? "fight" : "walk"; }
const anyOpen = () => ["dlg", "tp", "mapOv", "notesOv", "pauseOv"].some(id => !$(id).hidden) || !!document.querySelector(".mk-ov");
function closeTop(){ for(const id of ["mapOv", "notesOv", "pauseOv", "dlg"]) if(!$(id).hidden){ closeOv($(id)); return true; } if(!$("tp").hidden && quiz && !quiz.fight){ closeQuiz(); return true; } return false; }
function openPause(){
  if(mode === "fight" || GL.on) return;
  if(document.pointerLockElement) document.exitPointerLock();
  $("pauseP").innerHTML = `<button type="button" class="x" data-close aria-label="${T.close}">✕</button><h2>${T.pause.t}</h2><div class="mrow">
    <button type="button" class="mk-btn" data-close>${T.pause.cont}</button>
    <button type="button" class="mk-btn alt" id="pMap">${T.pause.map}</button>
    <button type="button" class="mk-btn alt" id="pNotes">${TP.hudNotes}</button>
    <button type="button" class="mk-btn alt" id="pStuck">${T.pause.stuck}</button>
    <details class="mk-lt"><summary>${T.pause.ctrl}</summary><div class="keys">${TP.ctrlPc.concat(TP.ctrlPhone).map(([a, b]) => `<b>${a}</b><span>${b}</span>`).join("")}</div></details>
    <button type="button" class="mk-btn ghost" id="pExit">${T.pause.exit}</button></div>`;
  $("pauseOv").hidden = false; mode = "ui";
  $("pMap").onclick = () => { closeOv($("pauseOv")); openMap(); };
  $("pNotes").onclick = () => { closeOv($("pauseOv")); openNotes(); };
  $("pExit").onclick = () => { closeOv($("pauseOv")); exitGame(); };
  $("pStuck").onclick = () => { closeOv($("pauseOv")); rescue(); };
}
/* tikslų sąrašas: [raktas, ar atlikta, tekstas] – eilės tvarka tokia, kokia verta eiti */
function goals(){
  const G = TP.goals, n = nRunes();
  return [["torch", S.torch, G.torch], ["sword", S.sword, G.sword], ["mush", nMush() === 3, G.mush(nMush())], ["chute", S.chute, G.chute], ["queen", S.queen, G.queen], ["land", S.landed, G.land],
    ["gremlin", S.gremlin, G.gremlin], ["bronze", !!S.keys.bronze, G.bronze], ["princess", S.cage, G.princess], ["runes", n === 7, G.runes(n)], ["gate", S.rgate, G.gate], ["black", S.black, G.black]];
}
function openNotes(){
  if(mode === "fight") return;
  if(document.pointerLockElement) document.exitPointerLock();
  const gl = goals();
  $("notesP").innerHTML = `<button type="button" class="x" data-close aria-label="${T.close}">✕</button><h2>${TP.notesTitle}</h2>
    <div class="inv">${RUNES.map(r => runeSvg(S.runes[r])).join("")}</div><div class="inv">${itemsHtml(true)}</div>
    <ul class="goals">${gl.map(([, ok, t]) => `<li class="${ok ? "ok" : ""}"><i>${ok ? "✓" : ""}</i>${t}</li>`).join("")}</ul>
    <button type="button" class="mk-btn alt" id="hintB">${TP.hintBtn}</button><div id="hintT"></div>`;
  $("notesOv").hidden = false; mode = "ui";
  $("hintB").onclick = () => { const w = Math.max(0, Math.round(90 - (S.time - S.lastProg))), next = gl.find(g => !g[1]); $("hintT").innerHTML = MK.guide(!next ? TP.winMore : w > 0 ? T.hintWait(w) : TP.hints[next[0]]); };
}
function inGame(f){ f(); const g = $("game"); for(const el of [...document.body.children]) if(el.classList && (el.classList.contains("mk-ov") || el.classList.contains("mk-confetti"))) g.appendChild(el); }
let toastT = 0;
function toast(s, ms){ const t = $("toast"); t.innerHTML = s; t.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), ms || 2800); }
function progress(){ S.lastProg = S.time; }

/* ===================== ŽEMĖLAPIS ===================== */
function reveal(){
  const c = world.cell(P.x, P.z, P.y), M = c.up ? world.UP : world.DN, seen = c.up ? S.seenU : S.seenD;
  for(const [di, dj] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]){
    const i = c.i + di, j = c.j + dj; if(i < 0 || j < 0 || i >= world.NI || j >= world.NJ || M[j][i] === "#") continue;
    const k = j * world.NI + i; if(!seen.includes(k)) seen.push(k);
  }
}
function openMap(){
  if(mode === "fight" || GL.on) return;
  if(document.pointerLockElement) document.exitPointerLock();
  const up = isUp(), M = up ? world.UP : world.DN, seen = up ? S.seenU : S.seenD, NI = world.NI, NJ = world.NJ, p = world.poi;
  $("mapT").textContent = TP.mapTitle + " – " + (up ? TP.levels.up : TP.levels.dn); $("mapN").textContent = TP.mapNote;
  const cv = $("mapC"), x = cv.getContext("2d"), s = 512 / NI, oy = (512 - NJ * s) / 2;
  x.fillStyle = "#e9dfc4"; x.fillRect(0, 0, 512, 512);
  const darkSet = up ? "1m24sQw," : ",6";
  for(const k of seen){ const i = k % NI, j = Math.floor(k / NI), ch = M[j][i];
    x.fillStyle = ch === "~" ? "#ff9a4a" : ch === "O" ? "#5a5f86" : darkSet.includes(ch) ? "#cfc6ae" : "#fffaf0"; x.fillRect(i * s, oy + j * s, s + 0.5, s + 0.5);
    x.strokeStyle = "rgba(18,26,51,.18)"; x.lineWidth = 1; x.strokeRect(i * s, oy + j * s, s, s); }
  const fs = Math.round(512 / Math.max(260, cv.clientWidth || 300) * 12); x.font = `800 ${fs}px Manrope, system-ui, sans-serif`; x.textAlign = "center";
  const spots = up ? { start: p.start, mole: p.mole, gnome: p.gnome, shaft: [...p.shaft, 7, 15], lift: p.liftU, queen: p.queen } : { pad: p.rune5, lift: p.liftD, gremlin: p.gremlin, cage: p.cage, rgate: p.rgate, dragon: [p.dragon[0], p.dragon[1], 16, 2] };
  for(const id in spots){ const [wx, wz, ci, cj] = spots[id]; if(!seen.includes(cj * NI + ci)) continue; const X = wx / C * s, Y = oy + wz / C * s;
    x.fillStyle = id === "dragon" || id === "rgate" ? "#d8443a" : INK; x.beginPath(); x.arc(X, Y, fs * 0.4, 0, 7); x.fill(); x.strokeStyle = "#fff"; x.lineWidth = 2; x.stroke();
    x.lineWidth = fs * 0.3; x.strokeStyle = "rgba(255,255,255,.9)"; const tw = x.measureText(TP.places[id]).width / 2 + 4, TX = Math.max(tw, Math.min(512 - tw, X)); x.strokeText(TP.places[id], TX, Y - fs * 0.7); x.fillStyle = INK; x.fillText(TP.places[id], TX, Y - fs * 0.7); }
  const X = P.x / C * s, Y = oy + P.z / C * s; x.save(); x.translate(X, Y); x.rotate(-P.yaw); x.scale(fs / 13, fs / 13); x.fillStyle = "#d8443a"; x.strokeStyle = "#fff"; x.lineWidth = 2.5;
  x.beginPath(); x.moveTo(0, -11); x.lineTo(7, 8); x.lineTo(0, 4); x.lineTo(-7, 8); x.closePath(); x.stroke(); x.fill(); x.restore();
  x.fillStyle = INK; x.font = "800 18px Unbounded, system-ui"; x.fillText(T.compass.N, 490, 28); x.beginPath(); x.moveTo(490, 34); x.lineTo(484, 48); x.lineTo(496, 48); x.fill();
  $("mapOv").hidden = false; mode = "ui";
}
function compass(){
  const el = $("compass"), w = el.clientWidth, bear = ((-P.yaw * 180 / Math.PI) % 360 + 360) % 360;
  if(!el.firstChild){ el.innerHTML = [["N", 0], ["", 45], ["E", 90], ["", 135], ["S", 180], ["", 225], ["W", 270], ["", 315]].map(([k, a]) => `<span data-a="${a}" class="${k ? "m" : ""}${k === "N" ? " n" : ""}">${k ? T.compass[k] : "·"}</span>`).join(""); }
  for(const s of el.children){ let d = +s.dataset.a - bear; d = ((d + 540) % 360) - 180; s.style.left = (w / 2 + d / 60 * (w / 2)) + "px"; s.style.display = Math.abs(d) > 62 ? "none" : ""; }
}

/* ===================== PASAULIO GYVENIMAS ===================== */
const DEN = [22 * C + 0.7, 27 * C - 0.7, 4 * C + 0.7, 9 * C - 0.7];
function tickWorld(dt){
  const W = world;
  /* vorai: vejasi žaidėją karalienės oloje; kardo mostas juos nubaido */
  if(!S.queen && mode === "walk" && isUp()){
    const inDen = P.x > DEN[0] - 0.7 && P.x < DEN[1] + 0.7 && P.z > DEN[2] - 0.7 && P.z < DEN[3] + 0.7;
    for(const s of W.spiders){ if(!s.on) continue;
      let tx = s.hx, tz = s.hz, v = 2.2;
      if(s.flee > 0){ s.flee -= dt; if(s.flee <= 0) s.flee = 0; const ax = s.x - P.x, az = s.z - P.z, l = Math.hypot(ax, az) || 1; tx = s.x + ax / l * 4; tz = s.z + az / l * 4; v = 6; }
      else if(inDen){ tx = P.x; tz = P.z; v = 3.3; }
      const ax = tx - s.x, az = tz - s.z, l = Math.hypot(ax, az);
      if(l > 0.15){ s.x = Math.max(DEN[0], Math.min(DEN[1], s.x + ax / l * v * dt)); s.z = Math.max(DEN[2], Math.min(DEN[3], s.z + az / l * v * dt)); s.g.rotation.y = Math.atan2(ax, az); s.t += dt * v * 3; }
      s.g.position.set(s.x, YU, s.z);
      for(const lg of s.g.userData.legs) lg.rotation.x = Math.sin(s.t + lg.userData.k * 1.6) * 0.35;
      if(!s.flee && inDen && d2(s.x, s.z) < 1.25){ /* įkando – atgal prie olos angos */
        P.x = 24.5 * C; P.z = 10.5 * C; P.y = YU; P.vy = 0; MK.sfx.bad(); toast(TP.spiderBite, 4200);
        $("vign").classList.add("on"); setTimeout(() => $("vign").classList.remove("on"), 600);
        for(const q of W.spiders){ q.x = q.hx; q.z = q.hz; q.flee = 0; } break; }
    }
  }
  /* runos nuo aikštelės paėmimas */
  if(!S.runes.r5 && !isUp() && P.ground && d2(W.poi.rune5[0], W.poi.rune5[1]) < 1.8){ W.rune5.visible = false; gotRune("r5"); }
  /* auto kova priartėjus prie slibino */
  if(S.rgate && !S.black && !F && mode === "walk" && !isUp() && blackD.visible && d2(blackD.position.x, blackD.position.z) < 11) startFight();
}

/* ===================== CIKLAS ===================== */
let saveT = 0, tAll = 0, revT = 0, darkK = 0;
function loop(){
  if(!running){ requestAnimationFrame(loop); return; }
  const dt = Math.min(0.08, clock.getDelta()); tAll += dt;
  const W = world;
  if(mode === "walk"){
    movePlayer(dt);
    if(wantAct) doAct();
    tickWorld(dt);
    S.time += dt;
  } else if(mode === "fight") S.time += dt;
  wantAct = false; wantJump = false;
  updatePrompt();
  const ey = P.y + P.eye + Math.sin(P.bob) * 0.04;
  camera.position.set(P.x, ey, P.z);
  if(mode === "fight" && F){
    const target = F.d.position.clone().add(new THREE.Vector3(0, 3.3 * F.d.scale.y, 0));
    const land = innerWidth > innerHeight, vh = Math.tan(camera.fov * Math.PI / 360), hh = vh * camera.aspect;
    const yawOff = land && !$("tp").hidden ? Math.atan(0.42 * hh) : 0, pitOff = !land && !$("tp").hidden ? Math.atan(0.55 * vh) : 0;
    const want = Math.atan2(-(target.x - P.x), -(target.z - P.z)) - yawOff, dy = target.y - ey, dh = Math.hypot(target.x - P.x, target.z - P.z);
    const dyaw = ((want - P.yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI; P.yaw += dyaw * Math.min(1, dt * 4);
    P.pitch += (Math.atan2(dy, dh) - pitOff - P.pitch) * Math.min(1, dt * 4);
  }
  camera.rotation.set(P.pitch, P.yaw, 0, "YXZ");
  /* šviesos: žibintuvėlis įsijungia tamsoje, šachtoje ir kovoje */
  const cell = W.cell(P.x, P.z, P.y), wantSpot = S.torch && (cell.dark || GL.on) ? 1 : 0;
  darkK += (wantSpot - darkK) * Math.min(1, dt * 4);
  spot.intensity = 34 * darkK; aura.position.set(P.x, ey + 0.4, P.z); aura.intensity = 5 + 3 * darkK;
  liftFade = Math.max(0, liftFade - dt); $("dark").style.opacity = cell.dark ? 0.55 : 0.2; $("fade").style.opacity = liftFade > 0 ? 1 : 0;
  /* parašiutas ir kardas */
  canopy.visible = GL.on; if(GL.on){ canopy.position.set(P.x, P.y, P.z); canopy.rotation.y = P.yaw; canopy.rotation.z = Math.sin(tAll * 1.3) * 0.06; }
  if(swingT > 0){ swingT = Math.max(0, swingT - dt); const k = 1 - swingT / 0.35; swordV.rotation.set(-0.9 - Math.sin(k * Math.PI) * 0.9, 0, 0.35 + Math.sin(k * Math.PI) * 1.2); } else swordV.rotation.set(-0.9 + Math.sin(P.bob) * 0.03, 0, 0.35);
  swordV.visible = !!S.sword && !GL.on && mode !== "fight";
  /* animacijos */
  for(const f of W.anim) f(tAll, dt);
  const ty = tAll * 2; W.npc.mole.position.y = YU + Math.abs(Math.sin(ty * 0.6)) * 0.05; W.npc.gremlin.position.y = YD + Math.abs(Math.sin(ty)) * 0.12; W.npc.gremlin.rotation.y = Math.sin(tAll * 0.8) * 0.5; W.npc.princess.rotation.y = Math.PI / 2 + Math.sin(tAll * 0.7) * 0.25;
  { const g = W.npc.gnome, a = Math.atan2(P.x - g.position.x, P.z - g.position.z); if(isUp() && d2(g.position.x, g.position.z) < 12) g.rotation.y += (((a - g.rotation.y + Math.PI * 3) % (Math.PI * 2)) - Math.PI) * Math.min(1, dt * 3); }
  if(W.queen.visible){ W.queen.position.y = YU + Math.sin(tAll * 1.4) * 0.08; W.queen.rotation.y = Math.atan2(P.x - W.queen.position.x, P.z - W.queen.position.z); for(const lg of W.queen.userData.legs) lg.rotation.x = Math.sin(tAll * 2 + lg.userData.k * 1.6) * 0.15; }
  for(const c of openingChests){ c.t += dt; c.c.lid.rotation.x = -Math.min(1.9, c.t * 2.5); }
  for(let i = gateAnim.length - 1; i >= 0; i--){ const a = gateAnim[i]; a.g.position.y = Math.max(a.to, a.g.position.y - dt * 2.4); if(a.g.position.y <= a.to){ if(a.hide) a.g.visible = false; gateAnim.splice(i, 1); } }
  if(blackD.visible){ const d = blackD, u = d.userData;
    if(u.flyAway){ u.flyAway += dt; d.position.y -= dt * (1 + u.flyAway * 2); d.rotation.y += dt * 2; animateDragon(d, tAll, { fly: true }); if(u.flyAway > 5) d.visible = false; }
    else if(F){ F.hit = Math.max(0, F.hit - dt); F.roar = Math.max(0, F.roar - dt); animateDragon(d, tAll, { roar: F.roar > 0, hit: F.hit }); }
    else animateDragon(d, tAll, !isUp() && S.rgate && d2(d.position.x, d.position.z) < 30 ? { calm: true } : { sleep: true }); }
  for(let i = bolts.length - 1; i >= 0; i--){ const b = bolts[i]; b.t += dt / 0.45; b.s.position.lerpVectors(b.from, b.to, Math.min(1, b.t)); b.s.position.y += Math.sin(b.t * Math.PI) * 1.2;
    if(b.t >= 1){ scene.remove(b.s); bolts.splice(i, 1); if(F){ F.hit = 0.6; } MK.sfx.beep(true); for(let k = 0; k < 14; k++) fires.push(particle(b.to.x, b.to.y, b.to.z, (Math.random() - 0.5) * 8, (Math.random() - 0.3) * 8, (Math.random() - 0.5) * 8, "#9ff0ff", 0.5, 1.0)); } }
  if(F && F.fire > 0){ F.fire -= dt; if(F.fire < 0.8){ const m = mouthPos(F.d), dir = camera.position.clone().sub(m).normalize(); for(let k = 0; k < 3; k++){ const sp = 16 + Math.random() * 6; fires.push(particle(m.x, m.y, m.z, dir.x * sp + (Math.random() - 0.5) * 4, dir.y * sp + (Math.random() - 0.5) * 3, dir.z * sp + (Math.random() - 0.5) * 4, Math.random() < 0.5 ? "#b06bff" : "#ff7ad9", 0.7, 1.2)); } } }
  for(let i = fires.length - 1; i >= 0; i--){ const p = fires[i]; p.life -= dt; if(p.life <= 0){ scene.remove(p.m); p.m.material.dispose(); fires.splice(i, 1); continue; }
    if(p.grav) p.vy -= 14 * dt; p.m.position.x += p.vx * dt; p.m.position.y += p.vy * dt; p.m.position.z += p.vz * dt; const k = p.life / p.max; p.m.material.opacity = k; if(!p.grav) p.m.scale.setScalar(p.size * (1.6 - k)); }
  compass();
  revT -= dt; if(revT <= 0){ revT = 0.5; reveal(); }
  saveT -= dt; if(saveT <= 0){ saveT = 4; if(mode === "walk" && !GL.on) savePos(); }
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}
