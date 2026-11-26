/* Šešėlių dirbtuvė – „Kieno šešėlis?“: ant širmos rodomas paslėpto besivartančio daikto šešėlis, reikia kuo greičiau atpažinti daiktą iš 6 panašių.
   Etapai (kas 4 teisingi atsakymai): daiktas vartosi → šešėlis suspaustas → matyti tik dalis šešėlio → viskas kartu. */
const TIME = 45, STAGES = 4;
const SD = window.MK_SD, { THREE, T, D, MK, $, rad, rnd } = SD, X = T.teatras;
/* daiktų grupės (panašesni variantai sunkesniuose etapuose) ir beveik vienodų siluetų grupės (kartu nerodomos) */
const CAT_START = ["kubas", "puodelis", "obuolys", "suris", "kamuolys"], IDS = D.map(d => d[0]), CAT = {}; { let c = -1; IDS.forEach(id => { if(CAT_START.includes(id)) c++; CAT[id] = c; }); }
const TWINS = [["rutulys", "apelsinas", "kamuolys", "arbuzas", "slyva", "kiausinis", "citrina", "pomidoras", "obuolys", "gaublys", "planeta"], ["kubas", "gretasienis", "dovana", "knyga", "lagaminas"], ["ritinys", "vamzdis", "termosas", "zvake", "stikline", "siulu-rite", "bugnas"],
  ["kugis", "kelio-kugis", "piramide", "tetraedras", "obeliskas", "palapine", "prizme3"], ["vaza", "puodyne", "butelis", "keglis", "kolona", "druskine"], ["toras", "spurga"], ["dubuo", "lekste", "pusrutulis", "ufo", "skrybele"], ["pestininkas", "rikis", "bokstas-s", "matrioska"], ["suris", "laiptai"]];
const twin = {}; TWINS.forEach((g, i) => g.forEach(id => { twin[id] = i; }));
let st = null, shScene, shCam, rt, screenG, dark, thumbR, thumbScene, thumbCam, ready = false; const thumbs = new Map();

function init(){
  if(ready) return; ready = true;
  shScene = new THREE.Scene(); shScene.add(new THREE.HemisphereLight(0xffffff, 0xd8c9b8, 1.3)); const dl = new THREE.DirectionalLight(0xfff3da, 2.0); dl.position.set(3, 5, 6); shScene.add(dl);
  const [bc, bg] = SD.cnv(256, 256), gr = bg.createRadialGradient(128, 118, 10, 128, 128, 190); gr.addColorStop(0, "#fffdf0"); gr.addColorStop(0.6, "#f6ecd2"); gr.addColorStop(1, "#d9c9a4"); bg.fillStyle = gr; bg.fillRect(0, 0, 256, 256); shScene.background = SD.tex(bc);
  shCam = new THREE.PerspectiveCamera(21, 1.2, 1, 40); shCam.position.set(0, 0, 11);
  rt = new THREE.WebGLRenderTarget(720, 600, { samples: 4 }); dark = new THREE.MeshBasicMaterial({ color: 0x33343f, side: THREE.DoubleSide });
  /* širma ant stalo */
  screenG = new THREE.Group(); const wood = SD.std("#8b5a2b"), W = 5.2, H = 4.3;
  SD.mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshBasicMaterial({ map: rt.texture }), 0, 0, 0.02, screenG);
  for(const [w, h, x, y] of [[W + 0.5, 0.26, 0, H / 2 + 0.1], [W + 0.5, 0.26, 0, -H / 2 - 0.1], [0.26, H + 0.46, -W / 2 - 0.12, 0], [0.26, H + 0.46, W / 2 + 0.12, 0]]) SD.mesh(new THREE.BoxGeometry(w, h, 0.28), wood, x, y, 0, screenG).castShadow = true;
  for(const x of [-W / 2 - 0.12, W / 2 + 0.12]) SD.mesh(new THREE.BoxGeometry(0.5, 0.2, 1.6), wood, x, -H / 2 - 0.3, 0, screenG);
  SD.mesh(new THREE.PlaneGeometry(W + 0.4, H + 0.4), SD.std("#5d3b1a"), 0, 0, -0.1, screenG).rotation.y = Math.PI;
  screenG.position.set(0, H / 2 + 0.42, 0); screenG.visible = false; SD.scene.add(screenG);
  /* miniatiūros variantams */
  thumbR = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); thumbR.setSize(176, 176, false); thumbR.outputColorSpace = THREE.SRGBColorSpace; thumbR.setClearColor(0xffffff, 0);
  thumbScene = new THREE.Scene(); thumbScene.add(new THREE.HemisphereLight(0xffffff, 0xcfc2b0, 1.5)); const tl = new THREE.DirectionalLight(0xffffff, 2.2); tl.position.set(-3, 5, 5); thumbScene.add(tl);
  thumbCam = new THREE.PerspectiveCamera(30, 1, 1, 40); thumbCam.position.set(3.2, 3.6, 7.2); thumbCam.lookAt(0, 1.05, 0);
}
function thumb(id){
  if(thumbs.has(id)) return thumbs.get(id);
  const o = SD.buildObj(id, false, { h: 2.3, w: 2.9 }); o.rotation.y = -0.45; thumbScene.add(o); thumbR.render(thumbScene, thumbCam); const url = thumbR.domElement.toDataURL("image/png"); thumbScene.remove(o); SD.disposeObj(o); thumbs.set(id, url); return url;
}
function pose(){ const asp = innerWidth / innerHeight, th = Math.tan(rad(23)), port = asp < 1, d = Math.max(3.05 / (th * asp), port ? 0 : 7.6), view = 2 * d * th, cy = 2.57 - view * (port ? 0.17 : 0.1);
  SD.camT.position.set(0, cy + d * 0.1, d); SD.camT.lookAt(0, cy, 0); SD.camT.updateMatrixWorld(); }
function start(){
  init(); if(st && st.cur) drop(); SD.theme("#f4efff", "#dccbff", "#a98be8", "#8b5cf6"); SD.lamp.forEach(o => { o.visible = false; }); screenG.visible = true; SD.sun.position.set(3, 9, 9); pose(); SD.camera.position.copy(SD.camT.position); SD.camera.quaternion.copy(SD.camT.quaternion);
  $("mh").innerHTML = `<div class="mtop"><div class="mbar" id="tBar"><i></i></div><div class="mcard" id="tSc"></div><div class="combo" id="tCo"></div></div><div class="mbot"><div class="mmsg" id="tMsg"></div><div class="tgrid" id="tGr"></div></div>`;
  $("tGr").onclick = e => { const b = e.target.closest("[data-i]"); if(b) answer(+b.dataset.i); };
  st = { time: TIME, score: 0, combo: 0, best: 0, ok: 0, n: 0, stage: 0, cur: null, lock: 0, used: [], seenIds: [], over: false, t: 0 };
  next(); hud();
}
function stop(){ if(st && st.cur) drop(); st = null; if(screenG) screenG.visible = false; SD.lamp.forEach(o => { o.visible = true; }); }
const paint = on => st.cur.obj.traverse(m => { if(m.isMesh){ if(!m.userData.mat) m.userData.mat = m.material; m.material = on ? dark : m.userData.mat; } });
function drop(){ paint(false); shScene.remove(st.cur.pivot); SD.disposeObj(st.cur.obj); st.cur = null; }
function next(){
  if(st.cur) drop(); const stage = st.stage, pool = IDS.filter(id => !st.used.includes(id)); if(pool.length < 8) st.used = [];
  const id = MK.pick(pool.length ? pool : IDS); st.used.push(id);
  let cand = MK.shuffle(IDS.filter(o => o !== id && (twin[o] === undefined || twin[o] !== twin[id]))); { const same = cand.filter(o => CAT[o] === CAT[id]); cand = same.concat(cand.filter(o => CAT[o] !== CAT[id])); }
  const opts = [id]; for(const o of cand){ if(opts.length >= 6) break; if(opts.some(q => twin[q] !== undefined && twin[q] === twin[o])) continue; opts.push(o); }
  const obj = SD.buildObj(id, false, { h: 2.7, w: 2.7 }), pivot = new THREE.Group(); obj.position.y = -obj.userData.h / 2; pivot.add(obj); pivot.rotation.y = rnd(0, 6.28); shScene.add(pivot);
  if(stage >= 2) shCam.setViewOffset(720, 600, rnd(72, 252), rnd(60, 210), 396, 330); else shCam.clearViewOffset(); shCam.updateProjectionMatrix(); st.sq = 0; if(stage === 1 || stage === 3){ st.sq = Math.random() < 0.5 ? 1 : 2; shCam.projectionMatrix.elements[st.sq === 1 ? 0 : 5] *= 0.52; shCam.projectionMatrixInverse.copy(shCam.projectionMatrix).invert(); }
  st.cur = { id, opts: MK.shuffle(opts), obj, pivot, ph: rnd(0, 6.28) }; st.lock = 0; paint(true);
  $("tGr").innerHTML = st.cur.opts.map((o, i) => `<button type="button" class="tb" data-i="${i}"><img src="${thumb(o)}" alt=""><span>${T.daiktai[o]}</span></button>`).join("");
}
function hud(){ const b = $("tBar"); b.firstChild.style.width = Math.max(0, st.time / TIME * 100) + "%"; b.classList.toggle("low", st.time < 10); $("tSc").innerHTML = `<small>${X.stage[st.stage]}</small>${X.score(st.score)}`; $("tCo").textContent = "×" + mult(); }
const mult = () => Math.min(5, 1 + Math.floor(st.combo / 2));
function answer(i){
  if(!st || st.over || st.lock > 0 || !st.cur) return; const c = st.cur, ok = c.opts[i] === c.id, bs = $("tGr").children; st.n++;
  bs[c.opts.indexOf(c.id)].classList.add("ok"); if(!ok) bs[i].classList.add("no");
  if(ok){ st.score += 100 * mult(); st.combo++; st.best = Math.max(st.best, st.combo); st.ok++; st.time = Math.min(TIME, st.time + 1.2); st.seenIds.push(c.id); MK.sfx.good(); $("tMsg").className = "mmsg good"; $("tMsg").textContent = MK.pick(X.ok); const co = $("tCo"); co.classList.remove("pop"); void co.offsetWidth; co.classList.add("pop");
    const ns = Math.min(STAGES - 1, Math.floor(st.ok / 4)); if(ns !== st.stage){ st.stage = ns; $("tMsg").textContent = X.stageUp + " " + X.stage[ns]; MK.sfx.whoosh(); } }
  else { st.combo = 0; st.time -= 5; MK.sfx.bad(); $("tMsg").className = "mmsg bad"; $("tMsg").textContent = X.no(T.daiktai[c.id].toLowerCase()); }
  st.lock = ok ? 0.7 : 1.5; paint(false); hud();
}
function over(){
  st.over = true; if(st.cur) paint(false); SD.seenAdd(st.seenIds); const stars = st.score >= 6000 ? 3 : st.score >= 2500 ? 2 : 1;
  SD.result({ key: "teatras", stars, title: X.title, lines: [X.lines[stars - 1], X.score(st.score), X.res(st.ok, st.n) + "<br>" + X.best(st.best)], again: start });
}
function frame(dt){
  if(!st) return; st.t += dt; const c = st.cur;
  if(c){ const sp = [0.9, 1.0, 1.1, 1.3][st.stage]; c.pivot.rotation.y += dt * sp; c.pivot.rotation.x = Math.sin(st.t * 0.8 + c.ph) * 1.15; c.pivot.rotation.z = Math.sin(st.t * 0.5 + c.ph * 2) * 0.5; }
  if(st.over) return;
  if(st.lock > 0){ st.lock -= dt; if(st.lock <= 0){ $("tMsg").textContent = ""; if(st.time <= 0) return over(); next(); } }
  else { st.time -= dt; if(st.time <= 0){ st.time = 0; hud(); return over(); } }
  if(Math.floor(st.t * 5) !== Math.floor((st.t - dt) * 5)) hud();
}
function render(){ const r = SD.renderer; r.setRenderTarget(rt); r.render(shScene, shCam); r.setRenderTarget(null); r.render(SD.scene, SD.camera); }
function key(e){ if(/^[1-6]$/.test(e.key)) answer(+e.key - 1); }
SD.MODES.teatras = { start, stop, frame, render, key, resize: pose, get st(){ return st; } };
