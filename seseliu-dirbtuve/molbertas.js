/* Šešėlių dirbtuvė – „Tapytojo molbertas“: daikto piešinys padalytas į tonų zonas (šviesa, pustonis, atspindys, savasis ir krintantis šešėlis);
   mokinys jas nuspalvina pagal lempos vietą arba pagal gatavą piešinį nustato lempą. Zonos gaunamos iš tikro 3D daikto (atskiras piešimo praėjimas). */
const SD = window.MK_SD, { THREE, T, MK, $, rad, rnd } = SD, X = T.molbertas;
const SIMPLE = ["rutulys", "ritinys", "kugis", "kubas", "piramide", "pusrutulis", "nupjautinis", "prizme6", "gretasienis", "tetraedras", "oktaedras", "obeliskas", "laiptuota", "vaza", "butelis", "puodyne", "statine", "obuolys", "kriause", "apelsinas", "citrina", "slyva", "arbuzas", "pomidoras", "kiausinis", "svogunas", "baravykas", "keglis", "pestininkas", "bokstas-s", "rikis", "matrioska", "kolona", "zvake", "termosas", "druskine", "varpelis", "kepure", "vilkelis", "akmuo", "duona", "kelio-kugis", "paprika", "braske", "gile", "kibiras", "vamzdis"].filter(id => SD.DMAP[id]);
const TONES = [[246, 243, 236], [210, 204, 190], [163, 156, 143], [98, 93, 85], [48, 45, 41]], PAPER = [255, 253, 246], INK = [43, 47, 58], N = 288, KINDS = ["paint", "paint", "match", "paint", "paint", "match"];
const OB = v => v >= 1 && v <= 4;
let st = null, rt, buf, zs, zf, maskMat, maskMesh, drawCam, ready = false, cv, cx;
const VS = `varying vec3 vN; varying vec3 vP; varying float vY; void main(){ vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position, 1.0); vP = mv.xyz; vY = (modelMatrix * vec4(position, 1.0)).y; gl_Position = projectionMatrix * mv; }`;
const FS = flat => `uniform vec3 uL; uniform float uH; varying vec3 vN; varying vec3 vP; varying float vY;
void main(){ ${flat ? "vec3 n = normalize(cross(dFdx(vP), dFdy(vP)));" : "vec3 n = normalize(vN); if(!gl_FrontFacing) n = -n;"} float nl = dot(n, uL);
  float z = nl > 0.72 ? 1.0 : nl > 0.28 ? 2.0 : (nl < -0.45 && vY < uH * 0.4) ? 3.0 : 4.0; gl_FragColor = vec4(z / 8.0, clamp(nl, 0.0, 1.0), 0.0, 1.0); }`;
function init(){
  if(ready) return; ready = true;
  rt = new THREE.WebGLRenderTarget(N, N); buf = new Uint8Array(N * N * 4);
  const mk = flat => new THREE.ShaderMaterial({ side: THREE.DoubleSide, uniforms: { uL: { value: new THREE.Vector3() }, uH: { value: 2 } }, vertexShader: VS, fragmentShader: FS(flat) }); zs = mk(false); zf = mk(true);
  maskMat = new THREE.ShaderMaterial({ uniforms: { uM: { value: null } }, vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`, fragmentShader: `uniform sampler2D uM; varying vec2 vUv; void main(){ if(texture2D(uM, vUv).a < 0.5) discard; gl_FragColor = vec4(5.0 / 8.0, 0.0, 0.0, 1.0); }` });
  maskMesh = SD.mesh(new THREE.PlaneGeometry(SD.HALF * 2, SD.HALF * 2), maskMat, 0, 0.004, 0); maskMesh.rotation.x = -Math.PI / 2; maskMesh.layers.set(3); SD.scene.add(maskMesh);
  drawCam = new THREE.PerspectiveCamera(36, 1, 0.5, 60); const d = 9.6, p = rad(32); drawCam.position.set(0, 0.7 + d * Math.sin(p), d * Math.cos(p)); drawCam.lookAt(0, 0.7, 0); drawCam.updateMatrixWorld();
}
/* piešimo praėjimas: grąžina zonų ir tęstinio tono masyvus */
function zonePass(az, el){
  const r = SD.renderer, sc = SD.scene, L = SD.lightDir(az, el).transformDirection(drawCam.matrixWorldInverse), o = st.task.obj;
  for(const m of [zs, zf]){ m.uniforms.uL.value.copy(L); m.uniforms.uH.value = o.userData.h; }
  if(maskMat.uniforms.uM.value) maskMat.uniforms.uM.value.dispose(); maskMat.uniforms.uM.value = new THREE.CanvasTexture(SD.shadowMask([o], az, el, 512));
  o.traverse(m => { if(m.isMesh){ m.userData.mat = m.material; m.material = m.material.flatShading ? zf : zs; m.layers.enable(2); } });
  const bg = sc.background, ac = r.autoClear; sc.background = null; r.setRenderTarget(rt); r.setClearColor(0x000000, 0); r.clear(); r.autoClear = false;
  drawCam.layers.set(2); r.render(sc, drawCam); drawCam.layers.set(3); r.render(sc, drawCam);
  r.autoClear = ac; r.setRenderTarget(null); sc.background = bg; o.traverse(m => { if(m.isMesh) m.material = m.userData.mat; });
  r.readRenderTargetPixels(rt, 0, 0, N, N, buf);
  const zone = new Uint8Array(N * N), tone = new Uint8Array(N * N), cnt = [0, 0, 0, 0, 0, 0];
  for(let y = 0; y < N; y++) for(let x = 0; x < N; x++){ const i = ((N - 1 - y) * N + x) * 4, z = buf[i + 3] ? Math.round(buf[i] / 32) : 0, k = y * N + x; zone[k] = z; tone[k] = buf[i + 1]; cnt[z]++; }
  /* smulkios zonos prijungiamos prie gretimų pagal prasmę */
  const objPix = cnt[1] + cnt[2] + cnt[3] + cnt[4], thr = Math.max(60, objPix * 0.035), map = [0, 1, 2, 3, 4, 5];
  if(cnt[3] < thr) map[3] = 4; if(cnt[1] < thr) map[1] = 2; if(cnt[2] + (map[1] === 2 ? cnt[1] : 0) < thr) map[2] = cnt[1] >= thr ? 1 : 4; if(map[1] === 2 && map[2] !== 2) map[1] = map[2];
  if(cnt[4] + (map[3] === 4 ? cnt[3] : 0) < thr && map[3] === 3) map[4] = 3;
  const c2 = [0, 0, 0, 0, 0, 0]; for(let k = 0; k < zone.length; k++){ zone[k] = map[zone[k]]; c2[zone[k]]++; }
  const present = [1, 2, 3, 4, 5].filter(z => c2[z] > 0);
  return { zone, tone, present, ok: c2[5] >= 90 && c2[4] >= thr && (c2[1] >= thr || c2[2] >= thr) && present.length >= 3 };
}
/* piešinio vaizdas: zonos (nuspalvintos ar ne) arba gatavas štrichuotas piešinys iki x < wipe */
function draw(){
  const t = st.task, z = t.z, img = cx.createImageData(N, N), q = img.data, wipe = t.wipe * N, fin = (k, x, y) => { const zz = z.zone[k]; let v = zz === 5 ? 0.2 : zz === 3 ? 0.5 : 0.24 + 0.76 * z.tone[k] / 255; const h = ((x * 0.8 + y) | 0) % 5 < 2 ? 0.88 : 1; v = Math.min(1, v * 1.02) * (v < 0.9 ? h : 1); return [246 * v, 243 * v, 236 * v]; };
  for(let y = 0; y < N; y++) for(let x = 0; x < N; x++){ const k = y * N + x, zz = z.zone[k]; let c = PAPER;
    if(zz){ if(x < wipe) c = fin(k, x, y); else { const p = t.paint[zz]; if(p == null) c = t.hot === zz ? [255, 243, 184] : PAPER; else { c = TONES[p]; if(((x * 0.8 + y) | 0) % 6 < 2) c = [c[0] * 0.92, c[1] * 0.92, c[2] * 0.92]; } if(t.bad && t.bad.includes(zz) && ((x + y) >> 2) % 2) c = [255, 190, 180]; } }
    const r = x < N - 1 ? z.zone[k + 1] : zz, d = y < N - 1 ? z.zone[k + N] : zz, l = x ? z.zone[k - 1] : zz, u = y ? z.zone[k - N] : zz;
    if(zz !== r || zz !== d || ((zz === 0) !== (l === 0)) || ((zz === 0) !== (u === 0))){ if(x >= wipe) c = INK; else { const a = OB(zz); if(a !== OB(r) || a !== OB(d) || a !== OB(l) || a !== OB(u)) c = INK; } }
    q[k * 4] = c[0]; q[k * 4 + 1] = c[1]; q[k * 4 + 2] = c[2]; q[k * 4 + 3] = 255; }
  cx.putImageData(img, 0, 0);
  if(t.kind === "paint" && t.wipe < 0.02) for(const zz of z.present){ const [bx, by] = t.cen[zz]; cx.fillStyle = "#fff"; cx.strokeStyle = "#2b2f3a"; cx.lineWidth = 2; cx.beginPath(); cx.arc(bx, by, 9.5, 0, 7); cx.fill(); cx.stroke(); cx.fillStyle = "#2b2f3a"; cx.font = "900 12px sans-serif"; cx.textAlign = "center"; cx.textBaseline = "middle"; cx.fillText(t.label[zz], bx, by + 1); }
}
function centroids(z){ const s = {}; for(let k = 0; k < z.zone.length; k++){ const zz = z.zone[k]; if(!zz) continue; const a = s[zz] || (s[zz] = [0, 0, 0]); a[0] += k % N; a[1] += (k / N) | 0; a[2]++; }
  const out = {}; for(const zz in s){ const mx = s[zz][0] / s[zz][2], my = s[zz][1] / s[zz][2]; let bd = 1e9, bx = mx, by = my; for(let k = 0; k < z.zone.length; k += 3){ if(z.zone[k] !== +zz) continue; const x = k % N, y = (k / N) | 0, d = (x - mx) * (x - mx) + (y - my) * (y - my); if(d < bd){ bd = d; bx = x; by = y; } } out[zz] = [bx, by]; } return out; }
function lampOn(on){ SD.sun.intensity = on ? 2.5 : 0; SD.amb.intensity = on ? 0.8 : 1.7; const g = SD.lamp[0]; g.children[g.children.length - 1].visible = on; g.children.forEach(c => { if(c.isSprite) c.visible = on; }); }
function pose(){ const asp = innerWidth / innerHeight, port = asp < 1, th = Math.tan(rad(23)), d = port ? Math.max(11, 3.1 / (th * asp)) : 11.5, p = rad(port ? 34 : 30);
  SD.camT.position.set(0, 0.9 + d * Math.sin(p), d * Math.cos(p)); SD.camT.lookAt(0, 0.9, 0); SD.camT.updateMatrixWorld(); if(port) SD.camera.setViewOffset(innerWidth, innerHeight, 0, innerHeight * 0.25, innerWidth, innerHeight); else SD.camera.setViewOffset(innerWidth, innerHeight, innerWidth * 0.15, 0, innerWidth, innerHeight); }
function start(){
  init(); if(st && st.task) clear(); SD.theme("#eafaf4", "#bdeee2", "#63c7b5", "#2bb3a3"); pose(); SD.camera.position.copy(SD.camT.position); SD.camera.quaternion.copy(SD.camT.quaternion);
  $("mh").innerHTML = `<div class="mtop"><div class="mcard" style="flex:1"><small id="mT"></small><span id="mI"></span></div></div>
    <div class="mbot mol"><div class="mmsg" id="mMsg"></div><div class="easel"><canvas id="mCv" width="${N}" height="${N}"></canvas><div class="pal" id="mPal"></div><div id="mSl"></div></div><button type="button" class="mbtn" id="mGo"></button></div>`;
  cv = $("mCv"); cx = cv.getContext("2d"); $("mSl").appendChild($("slAz"));
  $("mPal").innerHTML = TONES.map((c, i) => `<button type="button" data-p="${i}" style="background:rgb(${c})" aria-label="${X.tones[i]}" title="${X.tones[i]}"></button>`).join("");
  $("mPal").onclick = e => { const b = e.target.closest("[data-p]"); if(!b) return; st.sel = +b.dataset.p; MK.sfx.tap(); pal(); };
  cv.onpointerdown = e => { const r = cv.getBoundingClientRect(); tapCanvas((e.clientX - r.left) / r.width * N, (e.clientY - r.top) / r.height * N); e.preventDefault(); };
  $("mGo").onclick = () => { MK.sfx.tap(); if(st.task.done) next(); else check(); };
  st = { ti: -1, n: KINDS.length, pts: 0, sel: 0, used: [], seenIds: [], task: null }; next();
}
function pal(){ [...$("mPal").children].forEach((b, i) => b.classList.toggle("sel", i === st.sel)); }
function clear(){ const o = st.task.obj; SD.scene.remove(o); SD.disposeObj(o); st.task = null; }
function stop(){ if(st && st.task) clear(); st = null; lampOn(true); SD.sliders(false, false); const bot = document.querySelector(".bot"); bot.insertBefore($("slAz"), $("hint")); if(SD.camera) SD.camera.clearViewOffset(); }
function next(){
  if(st.task) clear(); st.ti++; if(st.ti >= st.n) return finish();
  const kind = KINDS[st.ti], off = kind === "paint" && st.ti >= 3; let t = null;
  for(let tries = 0; tries < 12 && !t; tries++){
    const pool = SIMPLE.filter(id => !st.used.includes(id)), id = MK.pick(pool.length ? pool : SIMPLE), obj = SD.buildObj(id, false, { h: 2.0, w: 2.3 }); obj.rotation.y = rnd(-0.4, 0.4); SD.scene.add(obj); obj.updateMatrixWorld(true);
    st.task = { obj }; const az = rad(Math.random() < 0.5 ? rnd(-28, 30) : rnd(150, 208)), el = rad(rnd(42, 60)); drawCam.clearViewOffset(); let z = zonePass(az, el);
    if(z.ok){ /* piešinys apkarpomas iki daikto ir jo šešėlio */
      let x0 = N, y0 = N, x1 = 0, y1 = 0; for(let k = 0; k < z.zone.length; k++) if(z.zone[k]){ const x = k % N, y = (k / N) | 0; if(x < x0) x0 = x; if(x > x1) x1 = x; if(y < y0) y0 = y; if(y > y1) y1 = y; }
      const side = Math.min(N, Math.max(x1 - x0, y1 - y0) * 1.22 + 10), cxm = (x0 + x1) / 2, cym = (y0 + y1) / 2, ox = Math.max(0, Math.min(N - side, cxm - side / 2)), oy = Math.max(0, Math.min(N - side, cym - side / 2));
      drawCam.setViewOffset(N, N, ox, oy, side, side); z = zonePass(az, el); }
    if(z.ok){ t = st.task = { kind, id, obj, az, el, z, paint: {}, miss: 0, done: false, wipe: kind === "match" ? 1 : 0, off, hot: 0 }; st.used.push(id); st.seenIds.push(id); } else { SD.scene.remove(obj); SD.disposeObj(obj); st.task = null; }
  }
  if(!t){ st.ti = st.n; return finish(); }
  t.cen = centroids(t.z); t.label = {}; MK.shuffle(t.z.present).forEach((zz, i) => { t.label[zz] = i + 1; });
  if(kind === "paint"){ SD.setLamp(t.az, t.el); lampOn(!off); SD.sliders(false, false); $("mPal").hidden = false; }
  else { SD.setLamp(t.az + Math.PI + rnd(-0.6, 0.6), t.el > rad(51) ? rad(40) : rad(64)); lampOn(true); SD.sliders(true, true, () => { if(!st.task.done) $("mMsg").textContent = ""; }); $("mPal").hidden = true; }
  $("mT").textContent = X.task(st.ti + 1, st.n) + " · " + T.daiktai[id0()]; $("mI").textContent = kind === "match" ? X.match : off ? X.paintOff : X.paint; $("mMsg").textContent = ""; $("mMsg").className = "mmsg";
  btn(); pal(); draw(); MK.sfx.whoosh();
}
const id0 = () => st.task.id;
function btn(){ const t = st.task, b = $("mGo"); b.textContent = t.done ? (st.ti + 1 >= st.n ? X.finish : X.next) : X.check; b.className = "mbtn" + (t.done ? " go" : ""); b.disabled = !t.done && t.kind === "paint" && t.z.present.some(z => t.paint[z] == null); }
function tapCanvas(x, y){
  const t = st.task; if(!t || t.done || t.kind !== "paint") return; let zz = 0, bd = 99;
  for(let dy = -8; dy <= 8; dy += 2) for(let dx = -8; dx <= 8; dx += 2){ const px = Math.round(x + dx), py = Math.round(y + dy); if(px < 0 || py < 0 || px >= N || py >= N) continue; const v = t.z.zone[py * N + px], d = dx * dx + dy * dy; if(v && d < bd){ bd = d; zz = v; } }
  if(!zz) return; t.paint[zz] = st.sel; t.bad = null; MK.sfx.tap(); btn(); draw();
}
function say(m, cls){ const e = $("mMsg"); e.textContent = m; e.className = "mmsg " + (cls || ""); }
function finishTask(msg, revealed){ const t = st.task; t.done = true; if(!revealed){ st.pts += Math.max(1, 3 - t.miss); MK.sfx.good(); SD.burst(new THREE.Vector3(0, t.obj.userData.h + 0.3, 0)); } say(msg, revealed ? "bad" : "good"); SD.sliders(false, false); btn(); }
function check(){
  const t = st.task; if(!t || t.done) return;
  if(t.kind === "paint"){
    const bad = t.z.present.filter(z => t.paint[z] !== z - 1);
    if(!bad.length){ lampOn(true); t.anim = true; return finishTask(X.okPaint); }
    t.miss++; MK.sfx.bad(); if(t.miss >= 3){ t.z.present.forEach(z => { t.paint[z] = z - 1; }); t.bad = null; lampOn(true); t.anim = true; return finishTask(X.reveal, true); }
    t.bad = bad; say(X.noPaint(bad.length), "bad"); draw();
  } else {
    const a = SD.lightDir(SD.laz, SD.lel), b = SD.lightDir(t.az, t.el), ang = a.angleTo(b);
    if(ang < rad(13)){ SD.setLamp(t.az, t.el); return finishTask(X.okMatch); }
    t.miss++; MK.sfx.bad(); if(t.miss >= 3){ SD.setLamp(t.az, t.el); return finishTask(X.reveal, true); }
    const da = Math.abs(SD.angDiff(SD.laz, t.az)); say(da > rad(32) ? X.noSide : ang < rad(22) ? X.near : SD.lel > t.el ? X.noHigh : X.noLow, "bad");
  }
}
function finish(){ SD.seenAdd(st.seenIds); const max = st.n * 3, stars = st.pts >= max * 0.85 ? 3 : st.pts >= max * 0.55 ? 2 : 1; SD.result({ key: "molbertas", stars, title: X.title, lines: [X.lines[stars - 1], X.points(st.pts, max)], again: start }); }
function frame(dt){ if(!st || !st.task) return; const t = st.task, o = t.obj; if(t.anim && t.wipe < 1){ t.wipe = Math.min(1, t.wipe + dt / 1.1); draw(); } }
function key(e){ const t = st && st.task; if(!t) return; if(e.key === "Enter"){ const b = $("mGo"); if(!b.disabled) b.click(); } else if(/^[1-5]$/.test(e.key) && t.kind === "paint"){ st.sel = +e.key - 1; pal(); }
  else if(t.kind === "match" && !t.done){ const d = { ArrowLeft: [1, 0], ArrowRight: [-1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key]; if(d){ e.preventDefault(); SD.setLamp(SD.laz + d[0] * rad(4), SD.lel + d[1] * rad(3)); } } }
SD.MODES.molbertas = { start, stop, frame, key, resize: pose, get st(){ return st; } };
