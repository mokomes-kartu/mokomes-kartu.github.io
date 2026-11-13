/* Slibino sala – žaidimo logika: meniu, valdymas, fizika, sąveikos, užduotys, kovos, žemėlapis, išsaugojimas. */
import * as THREE from "./three.module.min.js";
import { buildWorld, makeDragon, animateDragon, glowTex, POI, HALF, SEG, PLATEAU_TOP } from "./sala-pasaulis.js";

const T = window.MK_T, UZ = window.MK_SALA_U, INK = "#121a33";
const GAME = "slibino-sala", SKEY = "mk-slibino-sala-kl5", QKEY = "mk-slibino-sala-grafika";
const $ = id => document.getElementById(id);
const IDS = ["shell", "leaf", "mushroom", "eagle", "fish"];
const TOPIC = { shell: "div", leaf: "frac", mushroom: "dec", fish: "eq", eagle: "geo" };
const COL = { shell: "#ff8a2a", leaf: "#3fd16a", mushroom: "#b16bff", eagle: "#ffc61a", fish: "#2f9bff" };
const TEST = /[?&]test=1/.test(location.search);

/* ---------- piktogramos ---------- */
const ic = d => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const I = {
  menu: ic('<path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>'),
  map: ic('<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" fill="#fff6d6" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 4v14M15 6v14" stroke="currentColor" stroke-width="2"/>'),
  notes: ic('<path d="M5 3h11l3 3v15H5z" fill="#fff" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8 9h8M8 13h8M8 17h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
  jump: ic('<path d="M12 20V6M6 11l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>'),
  crouch: ic('<path d="M12 4v11M7 11l5 5 5-5M5 20h14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'),
  dig: ic('<path d="M14 3l7 7-3 3-7-7z" fill="#c9a43b" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12.5 8.5L4 17" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M2.5 15.5l6 6" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>'),
  act: ic('<path d="M8 13V6a1.6 1.6 0 0 1 3.2 0v5V4.6a1.6 1.6 0 0 1 3.2 0V11V6a1.6 1.6 0 0 1 3.2 0v7c0 4.5-2.6 8-6.6 8-3 0-4.6-1.6-6-4l-1.8-3.2a1.5 1.5 0 0 1 2.6-1.5L8 13" fill="#fff" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>')
};
const gemSvg = (id, on) => `<svg viewBox="0 0 20 26" aria-hidden="true"><path d="M10 1l8 8-8 16L2 9z" fill="${on ? COL[id] : "#e8e4da"}" stroke="${on ? INK : "#b4ad9c"}" stroke-width="1.8" stroke-linejoin="round"/>${on ? '<path d="M2 9h16M10 1l-3 8 3 16 3-16z" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="1.1"/>' : ""}</svg>`;

/* ---------- išsaugojimas ---------- */
const fresh = () => ({ v: 1, pos: null, yaw: 0, found: {}, opened: {}, dug: false, bridge: false, placed: {}, green: false, red: false, gate: false, clues: [], seen: [], mask: "", time: 0, lastProg: 0, redMist: 0, lever: 0, dials: {} });
let S = Object.assign(fresh(), MK.get(SKEY, {}));
const save = () => { if(world) S.mask = maskStr(); MK.set(SKEY, S); };
const hasSave = () => !!MK.get(SKEY, null);

/* ===================== MENIU ===================== */
function heroSvg(){
  return `<svg viewBox="0 0 400 230" role="img" aria-label="Sala su kalnu ir raudonuoju slibinu, priekyje – keliautoja su kristalu">
  <defs><linearGradient id="hs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc4f0"/><stop offset="1" stop-color="#d8efff"/></linearGradient></defs>
  <rect width="400" height="230" fill="url(#hs)"/>
  <circle cx="330" cy="46" r="20" fill="#ffe27a"/>
  <path d="M40 40q10-10 24-4 8-10 22-2 14 0 14 10H36q-2-4 4-4z M250 70q8-8 18-3 7-8 18-2 11 0 11 8h-50q0-3 3-3z" fill="#fff"/>
  <rect y="150" width="400" height="80" fill="#3d9fd8"/><path d="M0 162h400M0 180h400" stroke="#7fd0ee" stroke-width="2" stroke-dasharray="14 18" opacity=".7"/>
  <path d="M30 160q40-40 110-46 40-46 80-80 30 30 70 70 60 4 90 56z" fill="#6fbf53" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
  <path d="M150 116l70-82 66 78q-30-10-50 2-20-12-42 4-22-10-44-2z" fill="#9a97a2" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
  <path d="M206 50l14-16 14 16-6 6-8-6-8 8z" fill="#fff" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>
  <path d="M206 120v-18h24v18" fill="#3a3540" stroke="${INK}" stroke-width="2.6"/><path d="M200 102h36" stroke="${INK}" stroke-width="4"/>
  <g fill="#2f7d45" stroke="${INK}" stroke-width="2"><path d="M70 150l10-26 10 26z"/><path d="M92 148l9-22 9 22z"/><path d="M300 150l10-26 10 26z"/><path d="M322 152l8-20 8 20z"/></g>
  <path d="M30 160q40 6 70 0 40 8 80 2 60 8 120 0 40 6 70-2" fill="none" stroke="#ead59c" stroke-width="6"/>
  <!-- slibinas -->
  <g transform="translate(262 60) rotate(-8)">
    <path d="M0 22q-20 10-38 4" fill="none" stroke="#b8302a" stroke-width="7" stroke-linecap="round"/><path d="M-38 26l-8-6 2 10z" fill="#b8302a" stroke="${INK}" stroke-width="2"/>
    <path d="M10 14L-4-30 34 6z" fill="#ff8a70" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>
    <ellipse cx="14" cy="20" rx="24" ry="11" fill="#d8443a" stroke="${INK}" stroke-width="2.6"/>
    <path d="M30 14q12-16 22-14" fill="none" stroke="${INK}" stroke-width="11" stroke-linecap="round"/><path d="M30 14q12-16 22-14" fill="none" stroke="#d8443a" stroke-width="7" stroke-linecap="round"/>
    <path d="M48-6h14l6 6-6 5H48z" fill="#d8443a" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><circle cx="55" cy="-2" r="2.4" fill="#fff6b0" stroke="${INK}" stroke-width="1.2"/>
    <path d="M50-6l-4-8M55-6l-1-9" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M18 10L30-26 44 4z" fill="#ffad99" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>
  </g>
  <!-- keliautoja -->
  <g transform="translate(70 126)">
    <ellipse cx="22" cy="92" rx="22" ry="5" fill="#2b7fb4" opacity=".5"/>
    <path d="M12 60l-2 30M30 60l3 30" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M12 60l-2 30M30 60l3 30" stroke="#3b4a7a" stroke-width="6" stroke-linecap="round"/>
    <path d="M5 92h11M28 92h11" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
    <rect x="-4" y="22" width="14" height="26" rx="4" fill="#c9773a" stroke="${INK}" stroke-width="2.4"/>
    <path d="M8 22h26l4 40H4z" fill="#2f9e6e" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M34 30l18-14" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M34 30l18-14" stroke="#f5c9a0" stroke-width="5" stroke-linecap="round"/>
    <path d="M52 30V-14" stroke="#8a5a34" stroke-width="4" stroke-linecap="round"/>
    <path d="M52-30l7 10-7 10-7-10z" fill="#2f9bff" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><circle cx="52" cy="-20" r="13" fill="#9fdcff" opacity=".45"/>
    <path d="M10 30l-8 18" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M10 30l-8 18" stroke="#f5c9a0" stroke-width="5" stroke-linecap="round"/>
    <circle cx="21" cy="8" r="13" fill="#f5c9a0" stroke="${INK}" stroke-width="2.6"/>
    <path d="M8 6q2-16 14-15 14 0 13 14-6-6-14-6-7 1-13 7z" fill="#5a3a22" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>
    <circle cx="17" cy="10" r="1.8" fill="${INK}"/><circle cx="26" cy="10" r="1.8" fill="${INK}"/><path d="M18 15q3 3 6 0" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>
  </g>
  <g transform="translate(330 128)"><path d="M0 0l8 10-8 12-8-12z" fill="#ffc61a" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/></g>
  <g transform="translate(150 134)"><path d="M0 0l6 8-6 9-6-9z" fill="#b16bff" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/></g>
</svg>`;
}
let Q = MK.get(QKEY, null) || (matchMedia("(pointer:coarse)").matches ? "low" : "high");
function drawMenu(){
  $("h1").innerHTML = T.h1; $("heroP").textContent = T.hero; $("note").textContent = T.proto;
  $("heroArt").innerHTML = heroSvg();
  const has = hasSave();
  $("starts").innerHTML = (has ? `<button type="button" class="mk-btn" data-go="cont">${T.cont}</button><button type="button" class="mk-btn alt" data-go="new">${T.newGame}</button>` : `<button type="button" class="mk-btn" data-go="new">${T.start}</button>`);
  $("qL").textContent = T.quality;
  $("qSeg").innerHTML = [["high", T.qHigh], ["low", T.qLow]].map(([k, l]) => `<button type="button" data-q="${k}" aria-pressed="${Q === k}">${l}</button>`).join("");
  $("qN").textContent = T.qNote;
  $("collT").textContent = T.collTitle;
  $("mGems").innerHTML = IDS.map(id => `<div class="${S.found[id] ? "on" : ""}">${gemSvg(id, S.found[id])}<span>${T.crystals[id].n}</span></div>`).join("");
  $("mDrg").innerHTML = [["green", "#3fae4a"], ["red", "#d8443a"]].map(([k, c]) => `<span><i style="background:${S[k] ? c : "#fff"}"></i>${T.fight[k].n}${S[k] ? " ✓" : ""}</span>`).join("");
  $("ctrlT").textContent = T.ctrlTitle;
  $("ctrlK").innerHTML = T.ctrlPc.concat(T.ctrlPhone).map(([a, b]) => `<b>${a}</b><span>${b}</span>`).join("");
  $("ctrlTip").textContent = T.ctrlTip;
  MK.learn($("learn"), { topics: T.learn, onPlay(){} });
}
const app = $("app");
app.prepend(MK.top({ title: T.title, grade: 5 }));
drawMenu();
$("starts").addEventListener("click", e => {
  const b = e.target.closest("[data-go]"); if(!b) return; MK.unlock(); MK.music.stop();
  if(b.dataset.go === "new"){ if(hasSave() && !confirm(T.newConfirm)) return; S = fresh(); MK.set(SKEY, S); }
  enterGame();
});
$("qSeg").addEventListener("click", e => { const b = e.target.closest("[data-q]"); if(!b) return; Q = b.dataset.q; MK.set(QKEY, Q); drawMenu(); if(world) location.reload(); });

/* ===================== 3D ===================== */
let renderer, scene, camera, world = null, sun, hemi, lantern, sky, clock, running = false;
let greenD = null, redD = null, holes = [], bolts = [], fires = [];
const P = { x: 0, y: 0, z: 0, vy: 0, yaw: 0, pitch: 0, ground: true, crouch: false, eye: 1.65, bob: 0 };
const RAD = 0.35;
let mode = "walk"; // walk | ui | fight | cut
function enterGame(){
  const g = $("game"); g.hidden = false; document.body.style.overflow = "hidden";
  if(matchMedia("(pointer:coarse)").matches) g.classList.add("touch");
  try{ if(g.requestFullscreen && matchMedia("(pointer:coarse)").matches) g.requestFullscreen().then(() => { try{ screen.orientation.lock("landscape").catch(() => {}); }catch(_){} }).catch(() => {}); }catch(_){}
  if(world){ placePlayer(); running = true; mode = "walk"; return; }
  $("loading").textContent = T.loading; $("loading").hidden = false;
  setTimeout(() => {
    try{ init3D(); }catch(err){ console.error(err); $("loading").textContent = T.noGL; return; }
    $("loading").hidden = true; running = true; requestAnimationFrame(loop);
  }, 40);
}
function exitGame(){
  running = false; save(); if(document.pointerLockElement) document.exitPointerLock();
  try{ if(document.fullscreenElement) document.exitFullscreen(); }catch(_){}
  $("game").hidden = true; document.body.style.overflow = ""; drawMenu(); window.scrollTo(0, 0);
}

function init3D(){
  const high = Q === "high";
  renderer = new THREE.WebGLRenderer({ antialias: high, powerPreference: "high-performance" });
  if(!renderer.getContext()) throw new Error("no gl");
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, high ? 1.75 : 1.15));
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = high; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  $("view").appendChild(renderer.domElement);
  scene = new THREE.Scene();
  const HOR = new THREE.Color("#cde8f7");
  scene.background = HOR.clone();
  scene.fog = new THREE.Fog(HOR.clone(), 70, high ? 360 : 250);
  camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 1100);
  hemi = new THREE.HemisphereLight("#d6ecff", "#5f7f45", 1.9); scene.add(hemi);
  sun = new THREE.DirectionalLight("#fff1d6", 2.6); sun.position.set(-60, 110, 40); scene.add(sun); scene.add(sun.target);
  if(high){ sun.castShadow = true; sun.shadow.mapSize.set(1536, 1536); const c = sun.shadow.camera; c.left = c.bottom = -55; c.right = c.top = 55; c.near = 10; c.far = 300; sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.4; }
  lantern = new THREE.PointLight("#ffd9a0", 0, 18, 1.6); scene.add(lantern);
  /* dangus */
  const sg = new THREE.SphereGeometry(900, 24, 12), cols = [], top = new THREE.Color("#4d9de0");
  for(let i = 0; i < sg.attributes.position.count; i++){ const y = sg.attributes.position.getY(i) / 900; const c = HOR.clone().lerp(top, Math.pow(Math.max(0, y), 0.6)); cols.push(c.r, c.g, c.b); }
  sg.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
  sky = new THREE.Mesh(sg, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false })); sky.renderOrder = -1; scene.add(sky);
  const sunS = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), color: "#fff3c0", fog: false, depthWrite: false })); sunS.scale.set(140, 140, 1); sunS.position.set(-300, 560, 200); sky.add(sunS);
  world = buildWorld(scene, Q);
  /* slibinai */
  greenD = makeDragon({ body: "#3fae4a", belly: "#c8ef9a", wing: "#7fd36a", horn: "#f2e6c4" });
  greenD.scale.setScalar(1.15); greenD.position.set(POI.plateau[0] - 3, PLATEAU_TOP, POI.plateau[1] + 3); greenD.rotation.y = Math.PI / 2; scene.add(greenD);
  redD = makeDragon({ body: "#d8443a", belly: "#ffb38a", wing: "#ff8a70", horn: "#2a2530", eye: "#ffe27a" });
  redD.scale.setScalar(2.4); redD.visible = false; scene.add(redD);
  if(!high) [greenD, redD].forEach(d => d.traverse(o => o.castShadow = false));
  applySave();
  clock = new THREE.Clock();
  addEventListener("resize", onResize);
  initInput(); buildHud(); initMap();
  if(TEST) window.__sala = { P, S, world, setMode: m => mode = m, tp: (x, z) => { P.x = x; P.z = z; P.y = world.groundAt(x, z, 999, 999); P.vy = 0; }, quiz: () => quiz, fight: () => F, act: () => doAct(), dig: () => doDig(), render: () => renderer.render(scene, camera), cam: camera, solve: () => quizSolve(), inter: () => curInter,
    sim: (keys, sec, jump) => { const old = mode; mode = "walk"; keys.forEach(k => K[k] = true); if(jump) wantJump = true; for(let t = 0; t < sec; t += 1 / 60) movePlayer(1 / 60); keys.forEach(k => K[k] = false); mode = old; return [P.x, P.y, P.z]; } };
}
function onResize(){ if(!renderer) return; renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); }

function placePlayer(){
  if(S.pos){ [P.x, P.y, P.z] = S.pos; P.yaw = S.yaw || 0; }
  else { const [sx, sz] = world.start; P.x = sx; P.z = sz; P.y = world.groundAt(sx, sz, 999, 999); P.yaw = 0; }
  P.vy = 0; P.ground = true; P.pitch = 0;
}
function applySave(){
  placePlayer();
  const W = world;
  if(S.dug){ const c = W.chests.shell; c.g.position.y = c.y; W.makeChestCollider(c); }
  for(const id of IDS){ const c = W.chests[id]; if(S.opened[id]){ c.open = true; c.lid.rotation.x = -1.9; c.lock.visible = false; } if(S.opened[id] && !S.found[id]){ c.cr.visible = true; c.cr.children[0].visible = true; } }
  if(S.bridge){ W.bridge.raise(true); W.lever.arm.rotation.z = -0.6; }
  for(const id of IDS) if(S.placed[id]) W.gate.sockets[id].visible = true;
  if(S.gate){ W.gate.open = true; W.gate.opening = 1; W.gate.doorCol.on = false; }
  if(S.green) greenD.visible = false;
  if(S.gate && !S.red){ redD.visible = true; redD.position.set(POI.gate[0], world.groundAt(POI.gate[0], POI.gate[1] + 22, 999, 999), POI.gate[1] + 22); redD.rotation.y = 0; }
  updateGems();
}

/* ===================== VALDYMAS ===================== */
const K = {}; let lookDX = 0, lookDY = 0; const joy = { id: null, x0: 0, y0: 0, x: 0, y: 0 }, looks = new Map();
let wantJump = false, wantAct = false, wantDig = false;
function initInput(){
  addEventListener("keydown", e => {
    if($("game").hidden) return;
    const k = e.key.toLowerCase();
    if(mode !== "walk"){ if(quiz && !$("tp").hidden && quiz.keys(e)) return; if(k === "escape") closeTop(); return; }
    if(k === "escape"){ openPause(); return; }
    K[e.code] = true;
    if(e.code === "Space"){ wantJump = true; e.preventDefault(); }
    if(k === "c" || e.code === "ControlLeft") toggleCrouch();
    if(k === "f") wantDig = true;
    if(k === "e" || k === "enter") wantAct = true;
    if(k === "m") openMap();
    if(k === "j") openNotes();
    if(e.code.startsWith("Arrow")) e.preventDefault();
  });
  addEventListener("keyup", e => { K[e.code] = false; });
  const cv = renderer.domElement;
  cv.addEventListener("click", () => { if(mode === "walk" && !$("game").classList.contains("touch") && cv.requestPointerLock) cv.requestPointerLock(); });
  addEventListener("mousemove", e => { if(document.pointerLockElement === cv){ lookDX += e.movementX; lookDY += e.movementY; } });
  /* lietimas */
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
  tap("bJump", () => wantJump = true); tap("bCrouch", toggleCrouch); tap("bDig", () => wantDig = true); tap("bAct", () => wantAct = true);
  $("hMenu").onclick = openPause; $("hMap").onclick = openMap; $("hNotes").onclick = openNotes;
  $("game").addEventListener("click", e => { const c = e.target.closest("[data-close]"); if(c){ MK.sfx.tap(); closeOv(c.closest(".ov")); } });
  document.addEventListener("visibilitychange", () => { if(document.hidden) save(); });
  addEventListener("pagehide", save);
}
function buildHud(){
  $("hMenu").innerHTML = I.menu; $("hMap").innerHTML = I.map + `<span class="lbl" style="display:none"></span>`; $("hNotes").innerHTML = I.notes;
  $("hMenu").setAttribute("aria-label", T.hud.menu); $("hMap").setAttribute("aria-label", T.hud.map); $("hNotes").setAttribute("aria-label", T.hud.notes);
  $("bJump").innerHTML = I.jump + T.hud.jump; $("bCrouch").innerHTML = I.crouch + T.hud.crouch; $("bDig").innerHTML = I.dig + T.hud.dig; $("bAct").innerHTML = I.act + `<span id="actL">${T.hud.act}</span>`;
  $("joyHint").textContent = T.joy; $("rot").textContent = T.hud.rotate; $("rot").classList.add("show");
  setTimeout(() => $("rot").classList.remove("show"), 9000);
}
function toggleCrouch(){
  if(mode !== "walk") return;
  if(P.crouch && headBlocked(P.x, P.z, P.y)){ toast(T.crouchStuck); return; }
  P.crouch = !P.crouch; $("bCrouch").classList.toggle("on", P.crouch); MK.sfx.tap();
}
function updateGems(){ $("hgems").innerHTML = IDS.map(id => gemSvg(id, S.found[id])).join(""); }

/* ===================== FIZIKA ===================== */
const bodyH = () => P.crouch ? 1.15 : 1.8;
function nearAll(x, z){ const a = world.near(x - RAD, z - RAD), b = world.near(x + RAD, z + RAD); return a === b ? a : a.concat(b, world.near(x + RAD, z - RAD), world.near(x - RAD, z + RAD)); }
function blocked(x, z, feet, step){
  const g = world.groundAt(x, z, feet, step);
  if(g > feet + step) return 1;
  if(g < -0.6 && g < world.groundAt(P.x, P.z, P.y, 0.5) - 0.01) return 2;
  const hh = feet + bodyH();
  for(const o of nearAll(x, z)){
    if(!o.on || o.y1 <= feet + step || o.y0 >= hh) continue;
    if(o.t === "c"){ if(Math.hypot(x - o.x, z - o.z) < o.r + RAD) return 1; }
    else if(x > o.x0 - RAD && x < o.x1 + RAD && z > o.z0 - RAD && z < o.z1 + RAD) return 1;
  }
  return 0;
}
function headBlocked(x, z, feet){ for(const o of nearAll(x, z)) if(o.on && o.t === "b" && x > o.x0 - RAD && x < o.x1 + RAD && z > o.z0 - RAD && z < o.z1 + RAD && o.y0 < feet + 1.8 && o.y1 > feet + 1.15) return true; return false; }
let waterWarn = 0;
function movePlayer(dt){
  /* žiūrėjimas */
  P.yaw -= lookDX * 0.0024; P.pitch -= lookDY * 0.0024; lookDX = lookDY = 0;
  P.pitch = Math.max(-1.35, Math.min(1.25, P.pitch));
  /* kryptis */
  let fx = 0, fz = 0, run = false;
  if(K.KeyW || K.ArrowUp) fz += 1; if(K.KeyS || K.ArrowDown) fz -= 1; if(K.KeyA || K.ArrowLeft) fx -= 1; if(K.KeyD || K.ArrowRight) fx += 1;
  if(K.ShiftLeft || K.ShiftRight) run = true;
  if(joy.id !== null){ fx += joy.x; fz += -joy.y; if(Math.hypot(joy.x, joy.y) > 0.92) run = true; }
  const l = Math.hypot(fx, fz); if(l > 1){ fx /= l; fz /= l; }
  const sp = P.crouch ? 2.3 : run ? 8.5 : 5.2;
  const sy = Math.sin(P.yaw), cy = Math.cos(P.yaw);
  let dx = (-sy * fz + cy * fx) * sp * dt, dz = (-cy * fz - sy * fx) * sp * dt;
  const step = P.ground ? 0.5 : 0.06;
  const dl = Math.hypot(dx, dz), n = Math.max(1, Math.ceil(dl / 0.3));
  for(let i = 0; i < n; i++){
    const sx = dx / n, sz = dz / n;
    let b = blocked(P.x + sx, P.z + sz, P.y, step);
    if(!b){ P.x += sx; P.z += sz; continue; }
    if(b === 2 && performance.now() - waterWarn > 4000){ waterWarn = performance.now(); toast(T.cantSwim); }
    if(!blocked(P.x + sx, P.z, P.y, step)) P.x += sx; else if(!blocked(P.x, P.z + sz, P.y, step)) P.z += sz;
  }
  if(l > 0.1 && P.ground) P.bob += dt * sp * 1.6;
  /* vertikalė */
  if(wantJump && P.ground && !P.crouch){ P.vy = 8; P.ground = false; MK.sfx.hop(2); }
  wantJump = false;
  if(P.ground){
    const g = world.groundAt(P.x, P.z, P.y, 0.5);
    if(g >= P.y - 0.65) P.y = g; else { P.ground = false; P.vy = 0; }
  }
  if(!P.ground){
    P.vy -= 24 * dt; let ny = P.y + P.vy * dt;
    if(P.vy > 0){ for(const o of nearAll(P.x, P.z)) if(o.on && o.t === "b" && P.x > o.x0 - RAD && P.x < o.x1 + RAD && P.z > o.z0 - RAD && P.z < o.z1 + RAD && o.y0 >= P.y + bodyH() - 0.01 && o.y0 < ny + bodyH()){ ny = o.y0 - bodyH(); P.vy = 0; } }
    const sup = world.groundAt(P.x, P.z, P.y, 0.06);
    if(ny <= sup){ P.y = sup; P.vy = 0; P.ground = true; } else P.y = ny;
  }
  if(P.y < -20){ placeSafe(); }
}
function placeSafe(){ const [sx, sz] = world.start; P.x = sx; P.z = sz; P.y = world.groundAt(sx, sz, 999, 999); P.vy = 0; }

/* ===================== SĄVEIKOS ===================== */
let curInter = null;
const d2 = (x, z) => Math.hypot(P.x - x, P.z - z);
function interactions(){
  const W = world, L = [];
  for(const id in W.clueSpots){ const [x, , z] = W.clueSpots[id]; L.push({ d: d2(x, z), r: 3.2, label: T.act.read, f: () => openClue(id) }); }
  for(const id of IDS){ const c = W.chests[id]; const d = d2(c.x, c.z), dy = Math.abs(P.y - c.y);
    if(dy > 3) continue;
    if(id === "shell" && !S.dug) continue;
    if(!c.open){
      if(id === "eagle"){ if(S.green) L.push({ d, r: 3, label: T.act.open, f: () => openChest(id) }); }
      else L.push({ d, r: 3, label: T.act.unlock, f: () => lockChest(id) });
    } else if(!S.found[id]) L.push({ d, r: 3.2, label: T.act.take, f: () => takeCrystal(id) });
  }
  if(!S.bridge) L.push({ d: d2(W.lever.x, W.lever.z), r: 3, label: T.act.lever, f: leverTasks });
  if(!S.green && greenD.visible && Math.abs(P.y - PLATEAU_TOP) < 2.5) L.push({ d: d2(greenD.position.x, greenD.position.z), r: 13, label: T.act.fight, f: () => startFight("green") });
  const gx = W.gate.x, gz = W.gate.z + 4;
  if(!S.gate){ const d = d2(gx, gz); const have = IDS.filter(i => S.found[i] && !S.placed[i]).length; L.push({ d, r: 8, label: have ? T.act.place : T.act.gate, f: gateAct }); }
  else if(!S.red && redD.visible) L.push({ d: d2(redD.position.x, redD.position.z), r: 26, label: T.act.fight, f: () => startFight("red") });
  let best = null; for(const it of L) if(it.d < it.r && (!best || it.d - it.r < best.d - best.r)) best = it;
  return best;
}
function updatePrompt(){
  curInter = mode === "walk" ? interactions() : null;
  const p = $("prompt"), touch = $("game").classList.contains("touch");
  if(curInter){ p.hidden = touch; p.innerHTML = `<kbd>E</kbd>${curInter.label}`; $("actL").textContent = curInter.label; $("bAct").classList.add("ready"); }
  else { p.hidden = true; $("actL").textContent = T.hud.act; $("bAct").classList.remove("ready"); }
}
function doAct(){ if(mode !== "walk") return; if(curInter){ MK.sfx.tap(); curInter.f(); } }

/* užrašai */
function openClue(id){
  const c = T.clues[id]; if(!S.clues.includes(id)){ S.clues.push(id); progress(); }
  openDlg(`<button type="button" class="x" data-close aria-label="${T.close}">✕</button><h2>${c.t}</h2>${MK.guide(c.b)}<button type="button" class="mk-btn" data-close>${T.close}</button>`);
}
/* kasimas */
let digT = 0;
function doDig(){
  if(mode !== "walk" || !P.ground) return;
  const g = world.terrain(P.x, P.z);
  if(g < 0.3){ toast(T.dig.water); return; }
  if(world.groundAt(P.x, P.z, P.y, 0.5) > g + 0.2 || world.cave.inside(P.x, P.z)){ toast(T.dig.rock); return; }
  digT = 0.5; MK.sfx.dig();
  const fx = P.x - Math.sin(P.yaw) * 1.3, fz = P.z - Math.cos(P.yaw) * 1.3;
  addHole(fx, fz);
  const b = world.buried;
  if(!S.dug && Math.hypot(fx - b.x, fz - b.z) < 3.4){ S.dug = true; progress(); toast(T.dig.found); MK.sfx.coins(); const c = world.chests.shell; riseChest = { c, t: 0 }; save(); }
  else setTimeout(() => toast(T.dig.nothing), 350);
}
let riseChest = null;
function addHole(x, z){
  const y = world.terrain(x, z);
  let m;
  if(holes.length >= 24){ m = holes.shift(); }
  else { m = new THREE.Mesh(new THREE.CircleGeometry(0.75, 9), new THREE.MeshLambertMaterial({ color: "#6b4a2b", polygonOffset: true, polygonOffsetFactor: -2 })); m.rotation.x = -Math.PI / 2; scene.add(m); }
  m.position.set(x, y + 0.06, z); holes.push(m);
  /* žemių grumstai */
  for(let k = 0; k < 8; k++) fires.push(particle(x, y + 0.2, z, (Math.random() - 0.5) * 3, 3 + Math.random() * 2, (Math.random() - 0.5) * 3, "#8a5a34", 0.6, 0.35, false));
}
/* skrynios */
function lockChest(id){
  openQuiz({ title: T.chest.t, intro: T.chest.b, topic: TOPIC[id], need: 3, key: id, onDone: () => { openChest(id); } });
}
function openChest(id){
  const c = world.chests[id]; c.open = true; S.opened[id] = true; c.lock.visible = false;
  openingChests.push({ c, t: 0 }); MK.sfx.coins(); toast(T.chestOpen); progress(); save();
}
const openingChests = [];
function takeCrystal(id){
  const c = world.chests[id]; c.cr.visible = false; S.found[id] = true; progress(); updateGems(); MK.sfx.win(); inGame(() => MK.confetti(30));
  const n = IDS.filter(i => S.found[i]).length;
  toast(T.got(T.crystals[id].n) + (n === 5 ? " " + T.gotAll : ""), 4200); save();
}
/* svirtis */
function leverTasks(){
  openQuiz({ title: T.lever.t, intro: T.lever.b, topic: "eq", need: 3, key: "lever", onDone: () => { S.bridge = true; world.bridge.raise(false); leverAnim = 1; toast(T.bridgeUp); MK.sfx.whoosh(); progress(); save(); } });
}
let leverAnim = 0;
/* vartai */
function gateAct(){
  const W = world, have = IDS.filter(i => S.found[i] && !S.placed[i]);
  if(!have.length){ const miss = IDS.filter(i => !S.placed[i]).length; openClue("gate"); toast(T.needMore(miss)); return; }
  have.forEach(i => { S.placed[i] = true; W.gate.sockets[i].visible = true; });
  const n = IDS.filter(i => S.placed[i]).length; MK.sfx.star(n); toast(T.placed(n)); progress(); save();
  if(n === 5) setTimeout(openGate, 900);
}
let cut = null;
function openGate(){
  S.gate = true; save(); const G = world.gate; G.open = true; G.doorCol.on = false; toast(T.gateOpens, 4500); MK.sfx.vroom();
  /* žaidėjas atsitraukia, slibinas išeina pro vartus */
  const fx = G.x, fz = G.z + 40; P.x = fx; P.z = fz; P.y = world.groundAt(fx, fz, 999, 999); P.yaw = 0; P.pitch = 0.18;
  redD.visible = true; redD.position.set(G.x, G.y + 0.5, G.z - 4); redD.rotation.y = 0;
  cut = { t: 0, from: G.z - 4, to: G.z + 22 }; mode = "cut";
}

/* ===================== UŽDUOTYS ===================== */
let quiz = null;
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
  const q = quiz; q.t = UZ.gen(q.topic); q.input = ""; q.answered = false; drawQuiz();
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
    inp = `<div class="opts">${t.opts.map((o, i) => `<button type="button" data-o="${i}" class="${q.answered ? (i === t.a ? "ok" : i === q.pick ? "no" : "") : ""}" ${q.answered ? "disabled" : ""}>${o}</button>`).join("")}</div>`;
  }
  $("tpP").innerHTML = `<button type="button" class="x" id="tX" aria-label="${T.close}">✕</button><h2>${q.title}</h2>${intro}${dialsHtml()}
    <div class="tgrid"><div><div class="tq">${t.q}${t.fig || ""}</div></div><div>${inp}</div></div><div id="tWhy">${why || ""}</div>`;
  $("tX").hidden = !!q.fight && !q.canLeave;
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
  if(e.target.closest("#tX")){ MK.sfx.tap(); closeQuiz(); if(q.onClose) q.onClose(); return; }
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

/* ===================== KOVA ===================== */
let F = null;
function startFight(which){
  const d = which === "green" ? greenD : redD;
  if(document.pointerLockElement) document.exitPointerLock();
  const max = which === "green" ? 3 : 6;
  F = { which, d, hp: max, max, sh: 3, mist: 0, hit: 0, roar: 1.2, t: 0, fly: 0 };
  /* žaidėjas – priešais slibiną */
  const dist = (which === "green" ? 12 : 31) * (innerWidth > innerHeight ? 1 : 1.45);
  let ax = P.x - d.position.x, az = P.z - d.position.z; const l = Math.hypot(ax, az) || 1; ax /= l; az /= l;
  if(which === "red"){ ax = 0; az = 1; }
  let px = d.position.x + ax * dist, pz = d.position.z + az * dist;
  if(which === "green"){ const [cx, , cz] = world.eagleTop; const r = Math.hypot(px - cx, pz - cz); if(r > 20){ px = cx + (px - cx) * 20 / r; pz = cz + (pz - cz) * 20 / r; } }
  P.x = px; P.z = pz; P.y = world.groundAt(px, pz, P.y + 3, 3);
  d.rotation.y = Math.atan2(P.x - d.position.x, P.z - d.position.z);
  MK.sfx.vroom(); mode = "fight";
  drawFHud(); $("fhud").hidden = false;
  openQuiz({ title: T.fight[which].n, intro: T.fight.intro(T.fight[which].n), topic: which === "green" ? "geo" : "mix", fight: true, need: 999,
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
  const from = camera.position.clone().add(new THREE.Vector3(0, -0.4, 0)), to = chestPos(F.d);
  bolts.push({ s, from, to, t: 0 }); MK.sfx.whoosh();
}
function breatheFire(){ F.roar = 1.3; F.fire = 1.0; MK.sfx.vroom(); setTimeout(() => { $("vign").classList.add("on"); setTimeout(() => $("vign").classList.remove("on"), 700); }, 350); }
function particle(x, y, z, vx, vy, vz, col, life, size, glow){
  const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), color: col, transparent: true, depthWrite: false, blending: glow === false ? THREE.NormalBlending : THREE.AdditiveBlending }));
  m.position.set(x, y, z); m.scale.set(size, size, 1); scene.add(m); return { m, vx, vy, vz, life, max: life, size, grav: glow === false };
}
function winFight(){
  const f = F, n = T.fight[f.which].n; $("fhud").hidden = true; F = null; f.d.userData.flyAway = 0.001; MK.sfx.win(); inGame(() => MK.confetti(50));
  if(f.which === "green"){ S.green = true; progress(); save(); mode = "walk"; openDlg(`<h2>${T.fight.won(n)}</h2>${MK.guide(T.fight.greenWon)}<button type="button" class="mk-btn" data-close>${T.task.next}</button>`); }
  else {
    S.red = true; S.redMist = f.mist; progress(); save();
    const stars = f.mist <= 1 ? 3 : f.mist <= 3 ? 2 : 1; MK.best(GAME, "kl5", stars);
    mode = "ui";
    setTimeout(() => inGame(() => MK.result({ stars, title: T.winTitle, text: T.winText(Math.max(1, Math.round(S.time / 60)), f.mist) + " " + T.winMore, next: () => { mode = "walk"; }, nextLabel: T.winBtn, again: () => { S = fresh(); MK.set(SKEY, S); location.reload(); }, menu: () => { mode = "walk"; exitGame(); }, menuLabel: T.pause.exit })), 1600);
  }
}
function loseFight(){
  const f = F; $("fhud").hidden = true; F = null; mode = "ui";
  openDlg(`<h2>${T.fight[f.which].n}</h2>${MK.guide(T.fight.lost)}<div class="mrow"><button type="button" class="mk-btn" id="fRetry">${T.fight.retry}</button><button type="button" class="mk-btn alt" id="fLeave">${T.fight.leave}</button></div>`);
  $("fRetry").onclick = () => { closeOv($("dlg")); startFight(f.which); };
  $("fLeave").onclick = () => { closeOv($("dlg")); const d = f.d; let ax = P.x - d.position.x, az = P.z - d.position.z; const l = Math.hypot(ax, az) || 1; const back = f.which === "green" ? 5 : 20; const nx = P.x + ax / l * back, nz = P.z + az / l * back; if(!blocked(nx, nz, P.y, 3)){ P.x = nx; P.z = nz; P.y = world.groundAt(nx, nz, P.y + 3, 3); } mode = "walk"; };
}

/* ===================== LANGAI ===================== */
function openDlg(html){ if(document.pointerLockElement) document.exitPointerLock(); $("dlgP").innerHTML = html; $("dlg").hidden = false; if(mode === "walk") mode = "ui"; }
function closeOv(ov){ if(!ov) return; ov.hidden = true; if(ov.id === "tp"){ quiz = null; } if(mode === "ui" && !anyOpen()) mode = F ? "fight" : "walk"; }
const anyOpen = () => ["dlg", "tp", "mapOv", "notesOv", "pauseOv"].some(id => !$(id).hidden);
function closeTop(){ for(const id of ["mapOv", "notesOv", "pauseOv", "dlg"]) if(!$(id).hidden){ closeOv($(id)); return true; } if(!$("tp").hidden && quiz && !quiz.fight){ closeQuiz(); return true; } return false; }
function openPause(){
  if(mode === "fight" || mode === "cut") return;
  if(document.pointerLockElement) document.exitPointerLock();
  $("pauseP").innerHTML = `<button type="button" class="x" data-close aria-label="${T.close}">✕</button><h2>${T.pause.t}</h2><div class="mrow">
    <button type="button" class="mk-btn" data-close>${T.pause.cont}</button>
    <button type="button" class="mk-btn alt" id="pMap">${T.pause.map}</button>
    <button type="button" class="mk-btn alt" id="pNotes">${T.pause.notes}</button>
    <details class="mk-lt"><summary>${T.pause.ctrl}</summary><div class="keys">${T.ctrlPc.concat(T.ctrlPhone).map(([a, b]) => `<b>${a}</b><span>${b}</span>`).join("")}</div></details>
    <button type="button" class="mk-btn ghost" id="pExit">${T.pause.exit}</button></div>`;
  $("pauseOv").hidden = false; mode = "ui";
  $("pMap").onclick = () => { closeOv($("pauseOv")); openMap(); };
  $("pNotes").onclick = () => { closeOv($("pauseOv")); openNotes(); };
  $("pExit").onclick = () => { closeOv($("pauseOv")); exitGame(); };
}
function openNotes(){
  if(mode === "fight" || mode === "cut") return;
  if(document.pointerLockElement) document.exitPointerLock();
  const gems = IDS.map(id => `<div style="display:flex;align-items:center;gap:10px">${gemSvg(id, S.found[id]).replace("<svg", '<svg width="22" height="28"')}<b>${T.crystals[id].n}</b><span class="small" style="margin:0">${S.placed[id] ? T.gemPlaced : S.found[id] ? T.gemFound : T.gemMissing}</span></div>`).join("");
  const notes = S.clues.length ? S.clues.map(id => `<details><summary>${T.clues[id].t}</summary><p>${T.clues[id].b}</p></details>`).join("") : `<p>${T.notesEmpty}</p>`;
  const wait = Math.max(0, Math.round(150 - (S.time - S.lastProg)));
  $("notesP").innerHTML = `<button type="button" class="x" data-close aria-label="${T.close}">✕</button><h2>${T.notesTitle}</h2>
    <h3 style="margin:4px 0 6px;font:800 14px/1.2 var(--kid)">${T.gemsTitle}</h3><div class="mrow">${gems}</div>
    <h3 style="margin:14px 0 6px;font:800 14px/1.2 var(--kid)">${T.notesTitle}</h3><div class="notes">${notes}</div>
    <button type="button" class="mk-btn alt" id="hintB">${T.hintBtn}</button><div id="hintT"></div>`;
  $("notesOv").hidden = false; mode = "ui";
  $("hintB").onclick = () => { const w = Math.max(0, Math.round(150 - (S.time - S.lastProg))); $("hintT").innerHTML = MK.guide(w > 0 ? T.hintWait(w) : hintText()); };
}
function hintText(){
  const W = world, targets = { shell: W.stones, leaf: [POI.maze[0], POI.maze[1] + 26], mushroom: [-235, 180], fish: [W.lever.x, W.lever.z], eagle: [POI.plateau[0] + 36, POI.plateau[1] - 20] };
  const left = IDS.filter(i => !S.found[i]);
  const dir = (x, z) => { const b = (Math.atan2(x - P.x, -(z - P.z)) * 180 / Math.PI + 360) % 360; return T.dirs[Math.round(b / 45) % 8]; };
  if(!left.length){ const g = W.gate; return T.hintGate(dir(g.x, g.z), Math.round(d2(g.x, g.z) / 10) * 10); }
  let best = null; for(const i of left){ const [x, z] = targets[i], d = d2(x, z); if(!best || d < best.d) best = { i, x, z, d }; }
  return T.hint(T.crystals[best.i].n, dir(best.x, best.z), Math.max(10, Math.round(best.d / 10) * 10));
}
/* viso ekrano režime matomas tik #game – iššokančius langus perkeliame į jį */
function inGame(f){ f(); const g = $("game"); for(const el of [...document.body.children]) if(el.classList && (el.classList.contains("mk-ov") || el.classList.contains("mk-confetti"))) g.appendChild(el); }
let toastT = 0;
function toast(s, ms){ const t = $("toast"); t.innerHTML = s; t.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), ms || 2800); }
function progress(){ S.lastProg = S.time; }

/* ===================== ŽEMĖLAPIS ===================== */
const MN = 64; let mask = new Uint8Array(MN * MN), baseMap = null, revCan = null;
const maskStr = () => { let s = ""; for(let i = 0; i < mask.length; i += 6){ let v = 0; for(let b = 0; b < 6; b++) v = v * 2 + (mask[i + b] || 0); s += String.fromCharCode(48 + v); } return s; };
function maskLoad(s){ if(!s) return; for(let i = 0, k = 0; k < s.length; k++){ const v = s.charCodeAt(k) - 48; for(let b = 5; b >= 0; b--){ if(i + (5 - b) < mask.length) mask[i + (5 - b)] = (v >> b) & 1; } i += 6; } }
function initMap(){
  maskLoad(S.mask);
  baseMap = document.createElement("canvas"); baseMap.width = baseMap.height = 512;
  const x = baseMap.getContext("2d"), img = x.createImageData(512, 512), W = world;
  for(let j = 0; j < 512; j++) for(let i = 0; i < 512; i++){
    const wx = -HALF + (i + 0.5) / 512 * HALF * 2, wz = -HALF + (j + 0.5) / 512 * HALF * 2, h = W.terrain(wx, wz), h2 = W.terrain(wx + 3, wz - 3);
    let c;
    if(h < -0.2) c = h < -3 ? [70, 150, 205] : [110, 180, 220];
    else if(h < 1.8) c = [234, 213, 156];
    else if(W.pathDist(wx, wz) < 2.6) c = [190, 150, 100];
    else if(h > 75) c = [244, 246, 250];
    else if(h > 38) c = [160, 158, 165];
    else c = [120 + h, 185 - h * 0.6, 95];
    const sh = Math.max(-30, Math.min(30, (h2 - h) * 9));
    const o = (j * 512 + i) * 4; img.data[o] = c[0] + sh; img.data[o + 1] = c[1] + sh; img.data[o + 2] = c[2] + sh; img.data[o + 3] = 255;
  }
  x.putImageData(img, 0, 0);
  /* labirinto sienos žemėlapyje nerodomos – tik žalias kvadratas */
  const mz = W.maze, s = 512 / (HALF * 2); x.fillStyle = "#3f8f3a"; x.fillRect((mz.ox + HALF) * s, (mz.oz + HALF) * s, 13 * 4 * s, 13 * 4 * s);
  revCan = document.createElement("canvas"); revCan.width = revCan.height = 512;
  const r = revCan.getContext("2d"); r.fillStyle = "#e9dfc4"; r.fillRect(0, 0, 512, 512);
  for(let j = 0; j < MN; j++) for(let i = 0; i < MN; i++) if(mask[j * MN + i]) r.drawImage(baseMap, i * 8, j * 8, 8, 8, i * 8, j * 8, 8, 8);
}
let revT = 0;
function reveal(){
  const c = 1040 / MN, r = 48, ci = Math.floor((P.x + HALF) / c), cj = Math.floor((P.z + HALF) / c), k = Math.ceil(r / c) + 1, ctx = revCan.getContext("2d");
  for(let j = cj - k; j <= cj + k; j++) for(let i = ci - k; i <= ci + k; i++){
    if(i < 0 || j < 0 || i >= MN || j >= MN || mask[j * MN + i]) continue;
    const cx = -HALF + (i + 0.5) * c, cz = -HALF + (j + 0.5) * c;
    if(Math.hypot(cx - P.x, cz - P.z) < r){ mask[j * MN + i] = 1; ctx.drawImage(baseMap, i * 8, j * 8, 8, 8, i * 8, j * 8, 8, 8); }
  }
  /* atrastos vietos */
  const W = world, spots = { light: W.light, cross: POI.cross, gate: POI.gate, maze: POI.maze, lake: POI.lake, plateau: POI.plateau, cave: [-224, 222], mill: POI.mill, ruins: POI.ruins, stones: W.stones, mountain: POI.mountain };
  for(const id in spots) if(!S.seen.includes(id) && d2(spots[id][0], spots[id][1]) < (id === "mountain" ? 160 : id === "lake" ? 110 : 70)) S.seen.push(id);
}
function openMap(){
  if(mode === "fight" || mode === "cut") return;
  if(document.pointerLockElement) document.exitPointerLock();
  $("mapT").textContent = T.mapTitle; $("mapN").textContent = T.mapNote;
  const cv = $("mapC"), x = cv.getContext("2d"), E = 470, s = 512 / (E * 2), px = p => (p + E) * s, sc = (HALF * 2) / (E * 2);
  x.fillStyle = "#e9dfc4"; x.fillRect(0, 0, 512, 512); x.drawImage(revCan, (HALF - E) / (HALF * 2) * 512, (HALF - E) / (HALF * 2) * 512, 512 / sc, 512 / sc, 0, 0, 512, 512);
  const W = world, spots = { light: W.light, cross: POI.cross, gate: POI.gate, maze: POI.maze, lake: POI.lake, plateau: POI.plateau, cave: [-224, 222], mill: POI.mill, ruins: POI.ruins, stones: W.stones, mountain: POI.mountain };
  const fs = Math.round(512 / Math.max(260, cv.clientWidth || 300) * 13); x.font = `800 ${fs}px Manrope, system-ui, sans-serif`; x.textAlign = "center";
  for(const id of S.seen){ const [wx, wz] = spots[id], X = px(wx), Y = px(wz);
    x.fillStyle = id === "gate" ? "#d8443a" : "#121a33"; x.beginPath(); x.arc(X, Y, fs * 0.42, 0, 7); x.fill(); x.strokeStyle = "#fff"; x.lineWidth = 2; x.stroke();
    x.lineWidth = fs * 0.3; x.strokeStyle = "rgba(255,255,255,.9)"; x.strokeText(T.places[id], X, Y - fs * 0.7); x.fillStyle = "#121a33"; x.fillText(T.places[id], X, Y - fs * 0.7); }
  /* žaidėjas */
  const X = px(P.x), Y = px(P.z); x.save(); x.translate(X, Y); x.rotate(-P.yaw); x.scale(fs / 13, fs / 13); x.fillStyle = "#d8443a"; x.strokeStyle = "#fff"; x.lineWidth = 2.5;
  x.beginPath(); x.moveTo(0, -11); x.lineTo(7, 8); x.lineTo(0, 4); x.lineTo(-7, 8); x.closePath(); x.stroke(); x.fill(); x.restore();
  /* šiaurė */
  x.fillStyle = "#121a33"; x.font = "800 18px Unbounded, system-ui"; x.fillText("Š", 490, 28); x.beginPath(); x.moveTo(490, 34); x.lineTo(484, 48); x.lineTo(496, 48); x.fill();
  $("mapOv").hidden = false; mode = "ui";
}

/* ===================== KOMPASAS ===================== */
function compass(){
  const el = $("compass"), w = el.clientWidth, bear = ((-P.yaw * 180 / Math.PI) % 360 + 360) % 360;
  if(!el.firstChild){ el.innerHTML = [["N", 0], ["", 45], ["E", 90], ["", 135], ["S", 180], ["", 225], ["W", 270], ["", 315]].map(([k, a]) => `<span data-a="${a}" class="${k ? "m" : ""}${k === "N" ? " n" : ""}">${k ? T.compass[k] : "·"}</span>`).join(""); }
  for(const s of el.children){ let d = +s.dataset.a - bear; d = ((d + 540) % 360) - 180; s.style.left = (w / 2 + d / 60 * (w / 2)) + "px"; s.style.display = Math.abs(d) > 62 ? "none" : ""; }
}

/* ===================== CIKLAS ===================== */
let saveT = 0, tAll = 0;
const camTarget = new THREE.Vector3();
function loop(){
  if(!running){ requestAnimationFrame(loop); return; }
  const dt = Math.min(0.08, clock.getDelta()); tAll += dt;
  const W = world;
  if(mode === "walk"){
    movePlayer(dt);
    if(wantAct){ doAct(); } if(wantDig){ doDig(); }
    S.time += dt;
  } else if(mode === "fight") S.time += dt;
  wantAct = wantDig = false;
  updatePrompt();
  /* kamera */
  P.eye += ((P.crouch ? 1.05 : 1.65) - P.eye) * Math.min(1, dt * 10);
  let ey = P.y + P.eye + Math.sin(P.bob) * 0.04 - (digT > 0 ? Math.sin(digT / 0.5 * Math.PI) * 0.35 : 0); digT = Math.max(0, digT - dt);
  camera.position.set(P.x, ey, P.z);
  if(mode === "fight" && F){
    const target = F.d.position.clone().add(new THREE.Vector3(0, 3.3 * F.d.scale.y, 0));
    /* slibinas – laisvoje ekrano dalyje (gulsčiai – kairėje, stačiai – viršuje) */
    const land = innerWidth > innerHeight, vh = Math.tan(camera.fov * Math.PI / 360), hh = vh * camera.aspect;
    const yawOff = land && !$("tp").hidden ? Math.atan(0.42 * hh) : 0, pitOff = !land && !$("tp").hidden ? Math.atan(0.55 * vh) : 0;
    const want = Math.atan2(-(target.x - P.x), -(target.z - P.z)) - yawOff, dy = target.y - ey, dh = Math.hypot(target.x - P.x, target.z - P.z);
    let dyaw = ((want - P.yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI; P.yaw += dyaw * Math.min(1, dt * 4);
    P.pitch += (Math.atan2(dy, dh) - pitOff - P.pitch) * Math.min(1, dt * 4);
  }
  if(mode === "cut" && cut){
    cut.t += dt; const k = Math.min(1, cut.t / 5);
    redD.position.z = cut.from + (cut.to - cut.from) * k; redD.position.y = W.groundAt(redD.position.x, redD.position.z, 999, 999) + Math.sin(k * Math.PI) * 9;
    const tgt = chestPos(redD); P.pitch = Math.atan2(tgt.y + 3 - ey, Math.hypot(tgt.x - P.x, tgt.z - P.z)); P.yaw = 0;
    if(cut.t > 5.6){ cut = null; mode = "walk"; startFight("red"); }
  }
  camera.rotation.set(P.pitch, P.yaw, 0, "YXZ");
  sky.position.copy(camera.position);
  if(sun.castShadow){ sun.position.set(P.x - 60, P.y + 110, P.z + 40); sun.target.position.set(P.x, P.y, P.z); sun.target.updateMatrixWorld(); }
  /* urvas: tamsa ir žibintas */
  const inCave = W.cave.inside(P.x, P.z) ? 1 : 0;
  caveK += (inCave - caveK) * Math.min(1, dt * 2.5);
  scene.fog.color.setRGB(0.80 * (1 - caveK) + 0.07 * caveK, 0.91 * (1 - caveK) + 0.05 * caveK, 0.97 * (1 - caveK) + 0.1 * caveK);
  scene.fog.near = 70 * (1 - caveK) + 2 * caveK; scene.fog.far = (Q === "high" ? 360 : 250) * (1 - caveK) + 24 * caveK;
  hemi.intensity = 1.9 * (1 - caveK) + 0.25 * caveK; sun.intensity = 2.6 * (1 - caveK) + 0.05 * caveK;
  lantern.intensity = 26 * caveK; lantern.position.set(P.x, ey + 0.3, P.z);
  $("dark").style.opacity = caveK * 0.9;
  /* animacijos */
  for(const f of W.anim) f(tAll, dt);
  if(greenD.visible) animGreen(dt);
  if(redD.visible) animRed(dt);
  for(const c of openingChests){ c.t += dt; c.c.lid.rotation.x = -Math.min(1.9, c.t * 2.5); if(c.t > 0.4) { c.c.cr.visible = !S.found[c.c.id]; c.c.cr.children[0].visible = true; } }
  for(const id of IDS){ const cr = W.chests[id].cr; if(cr.visible){ cr.rotation.y += dt * 1.6; cr.position.y = 1.35 + Math.sin(tAll * 2) * 0.12; } }
  if(riseChest){ const r = riseChest; r.t += dt; const c = r.c; c.g.position.y = c.y - 1.4 + Math.min(1, r.t / 1.4) * 1.4; if(r.t >= 1.4){ const d = d2(c.x, c.z); if(d < 1.6){ const k = 1.7 / Math.max(d, 0.01); P.x = c.x + (P.x - c.x) * k; P.z = c.z + (P.z - c.z) * k; P.y = W.groundAt(P.x, P.z, P.y + 1, 1); } W.makeChestCollider(c); riseChest = null; } }
  if(leverAnim > 0){ leverAnim = Math.max(0, leverAnim - dt); W.lever.arm.rotation.z = 0.6 - (1 - leverAnim) * 1.2; }
  /* strėlės ir ugnis */
  for(let i = bolts.length - 1; i >= 0; i--){ const b = bolts[i]; b.t += dt / 0.45; b.s.position.lerpVectors(b.from, b.to, Math.min(1, b.t)); b.s.position.y += Math.sin(b.t * Math.PI) * 1.2;
    if(b.t >= 1){ scene.remove(b.s); bolts.splice(i, 1); if(F){ F.hit = 0.6; } MK.sfx.beep(true); for(let k = 0; k < 14; k++) fires.push(particle(b.to.x, b.to.y, b.to.z, (Math.random() - 0.5) * 8, (Math.random() - 0.3) * 8, (Math.random() - 0.5) * 8, "#9ff0ff", 0.5, 1.0)); } }
  if(F && F.fire > 0){ F.fire -= dt; if(F.fire < 0.8){ const m = mouthPos(F.d), dir = camera.position.clone().sub(m).normalize(); for(let k = 0; k < 3; k++){ const sp = 18 + Math.random() * 6; fires.push(particle(m.x, m.y, m.z, dir.x * sp + (Math.random() - 0.5) * 4, dir.y * sp + (Math.random() - 0.5) * 3, dir.z * sp + (Math.random() - 0.5) * 4, Math.random() < 0.5 ? "#ff7a1a" : "#ffd23a", 0.7, 1.4 * F.d.scale.x * 0.5)); } } }
  for(let i = fires.length - 1; i >= 0; i--){ const p = fires[i]; p.life -= dt; if(p.life <= 0){ scene.remove(p.m); p.m.material.dispose(); fires.splice(i, 1); continue; }
    if(p.grav) p.vy -= 14 * dt; p.m.position.x += p.vx * dt; p.m.position.y += p.vy * dt; p.m.position.z += p.vz * dt; const k = p.life / p.max; p.m.material.opacity = k; if(!p.grav) p.m.scale.setScalar(p.size * (1.6 - k)); }
  /* HUD */
  compass();
  revT -= dt; if(revT <= 0){ revT = 0.4; reveal(); }
  saveT -= dt; if(saveT <= 0){ saveT = 4; S.pos = [P.x, P.y, P.z]; S.yaw = P.yaw; if(mode === "walk") save(); }
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}
let caveK = 0;
function animGreen(dt){
  const d = greenD, u = d.userData;
  if(u.flyAway){ u.flyAway += dt; d.position.y += dt * (4 + u.flyAway * 6); d.position.x -= dt * 10; animateDragon(d, tAll, { fly: true }); if(u.flyAway > 6) d.visible = false; return; }
  const near = d2(d.position.x, d.position.z) < 30 && Math.abs(P.y - PLATEAU_TOP) < 3;
  if(F && F.d === d){ F.hit = Math.max(0, F.hit - dt); F.roar = Math.max(0, F.roar - dt); animateDragon(d, tAll, { roar: F.roar > 0, hit: F.hit, calm: false }); d.position.y = PLATEAU_TOP; }
  else animateDragon(d, tAll, near ? { calm: true } : { sleep: true });
  if(!F && mode === "walk" && near && d2(d.position.x, d.position.z) < 9 && !S.green) startFight("green");
}
function animRed(dt){
  const d = redD, u = d.userData;
  if(u.flyAway){ u.flyAway += dt; d.position.y += dt * (5 + u.flyAway * 7); d.position.z -= dt * 14; animateDragon(d, tAll, { fly: true }); if(u.flyAway > 7) d.visible = false; return; }
  if(mode === "cut"){ animateDragon(d, tAll, { fly: true }); return; }
  if(F && F.d === d){ F.hit = Math.max(0, F.hit - dt); F.roar = Math.max(0, F.roar - dt); animateDragon(d, tAll, { roar: F.roar > 0, hit: F.hit }); }
  else animateDragon(d, tAll, { calm: true });
}
