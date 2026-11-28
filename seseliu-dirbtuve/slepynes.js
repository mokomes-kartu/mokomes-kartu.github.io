/* Šešėlių dirbtuvė – „Šešėlių slėpynės“: naktis dirbtuvėje, pelytė turi pasiekti duris nepakliūdama į lempų šviesą.
   Ji slepiasi daiktų šešėliuose, stumdo dėžes, graužia sūrį, virves ir kabelius, junginėja jungiklius ir mygtukus. Taisyklės (šviesa, kliūtys, veiksmai) – faile slepynes-logika.js,
   kambariai – slepynes-kambariai.js (visi patikrinti programa: įveikiami, o be šešėlių ar be veiksmų – ne). */
const SD = window.MK_SD, { THREE, T, MK, $, rad } = SD, X = T.slepynes, L = window.MK_SL, K = window.MK_SLK;
const PELE = window.MK_PELE, MS = 1.35;
/* pinigėliai ir namelis (namelis.js): saugoma – papildomos pajamos (tūbelės), išlaidos, turimi daiktai, tūbelių surinkimo laikai */
const NM = window.MK_NAMAS, NKEY = "mk-seseliu-dirbtuve-namas", FL = K.floors.map(f => ({ id: f.id, n: f.rooms.length }));
const nst = () => Object.assign({ extra: 0, spent: 0, own: [], tb: {}, view: "l" }, MK.get(NKEY, {})), nsave = S => MK.set(NKEY, S), coins = () => NM.balance(FL, prog(), nst()), CN = '<i class="cn"></i>';
const ICOL = { kilimelis: "#e5484d", vazonas: "#ff7eb6", pastas: "#e5484d", suoliukas: "#c58a4e", zibintas: "#ffe9a8", tvorele: "#f4f1ea", girlianda: "#4dd0e1", masina: "#3b82e6", lova: "#3b82e6", kilimas: "#ffd23f", stalas: "#e86a92", lentyna: "#8a5a34", paveikslas: "#8fd3ff", lempa: "#ffe2a0", fotelis: "#8b5cf6", molbertas: "#c58a4e", takelis: "#3b82e6", lysve: "#ff7eb6", medis: "#4caf50", supynes: "#ffd23f", baseinas: "#49c6f0", augalas: "#4caf50", uzuolaidos: "#ff8fa3", laikrodis: "#f4f1ea", komoda: "#c58a4e", akvariumas: "#9fe3ff", televizorius: "#2b2f3a", saldytuvas: "#f4f1ea" };
const { RW, RL, MR, SPEED, cx, cz } = L, CKEY = "mk-seseliu-dirbtuve-kelione", GAME = "seseliu-dirbtuve";
const ROOMS = []; K.floors.forEach((f, fi) => f.rooms.forEach((lv, ri) => ROOMS.push({ lv, fi, ri, id: f.id + "-" + (ri + 1) })));
const prog = () => MK.get(CKEY, {}).rooms || {};
function saveRoom(id, stars){ const C = Object.assign({ seen: [] }, MK.get(CKEY, {})); C.rooms = C.rooms || {}; if(!(C.rooms[id] >= stars)) C.rooms[id] = stars; MK.set(CKEY, C);
  const done = ROOMS.filter(r => C.rooms[r.id]).length, all3 = ROOMS.every(r => C.rooms[r.id] === 3), s = all3 ? 3 : done >= ROOMS.length ? 2 : done >= 5 ? 1 : 0; if(s) MK.best(GAME, "slepynes", s); }
const open = (R, P) => R.ri === 0 || !!P[ROOMS[ROOMS.indexOf(R) - 1].id];

let st = null, hs, hcam, ds, dcam, dmouse, dance = null, heroKey = "", room, mouse, bang, glow, ring, ringG, tx, ready = false, picking = false, keys = new Set(), joy = null, joyEl = null;
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
  /* peliukas (pele.js): žaidime šiek tiek sumažintas; susidūrimo dydis (MR) nuo išvaizdos nepriklauso */
  mouse = new THREE.Group(); hs.add(mouse);
  /* šokio scena: įveikus kambarį trimis žvaigždutėmis peliukas šoka per visą ekraną */
  ds = new THREE.Scene(); ds.background = new THREE.Color("#232a4a"); ds.add(new THREE.HemisphereLight(0xdfe6ff, 0x3a2f55, 1.15)); const dl = new THREE.DirectionalLight(0xfff0d0, 2.0); dl.position.set(2.2, 5, 4); dl.castShadow = true; dl.shadow.mapSize.set(1024, 1024); Object.assign(dl.shadow.camera, { left: -2, right: 2, top: 2.5, bottom: -1 }); ds.add(dl);
  const stage = SD.mesh(new THREE.CircleGeometry(1.9, 48), SD.std("#3d3570"), 0, 0, 0); stage.rotation.x = -Math.PI / 2; stage.receiveShadow = true; ds.add(stage); const rim = SD.mesh(new THREE.RingGeometry(1.9, 2.02, 48), new THREE.MeshBasicMaterial({ color: 0xffd23f }), 0, 0.002, 0); rim.rotation.x = -Math.PI / 2; ds.add(rim);
  dmouse = new THREE.Group(); ds.add(dmouse); dcam = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
  const [gc, gg] = SD.cnv(128, 128), rg = gg.createRadialGradient(64, 64, 8, 64, 64, 62); rg.addColorStop(0, "rgba(170,200,255,0.55)"); rg.addColorStop(0.6, "rgba(150,180,255,0.22)"); rg.addColorStop(1, "rgba(150,180,255,0)"); gg.fillStyle = rg; gg.fillRect(0, 0, 128, 128);
  glow = SD.mesh(new THREE.PlaneGeometry(2.1, 2.1), new THREE.MeshBasicMaterial({ map: SD.tex(gc), transparent: true, depthWrite: false }), 0, 0.02, 0); glow.rotation.x = -Math.PI / 2; hs.add(glow);
  const [bc, bg] = SD.cnv(64, 64); bg.fillStyle = "#e5484d"; bg.beginPath(); bg.arc(32, 32, 28, 0, 7); bg.fill(); bg.fillStyle = "#fff"; bg.font = "900 44px sans-serif"; bg.textAlign = "center"; bg.textBaseline = "middle"; bg.fillText("!", 32, 35);
  bang = new THREE.Sprite(new THREE.SpriteMaterial({ map: SD.tex(bc), depthTest: false, transparent: true })); bang.scale.set(0.7, 0.7, 1); bang.visible = false; bang.renderOrder = 5; hs.add(bang);
  /* graužimo eigos žiedas */
  const [rc, rgx] = SD.cnv(64, 64); ringG = rgx; ring = new THREE.Sprite(new THREE.SpriteMaterial({ map: SD.tex(rc), depthTest: false, transparent: true })); ring.scale.set(0.95, 0.95, 1); ring.visible = false; ring.renderOrder = 6; hs.add(ring);
}
function drawRing(k){ const g = ringG; g.clearRect(0, 0, 64, 64); g.lineWidth = 9; g.lineCap = "butt"; g.strokeStyle = "rgba(43,47,58,.75)"; g.beginPath(); g.arc(32, 32, 24, 0, 7); g.stroke(); g.strokeStyle = "#ffd23f"; g.lineCap = "round"; g.beginPath(); g.arc(32, 32, 24, -Math.PI / 2, -Math.PI / 2 + k * Math.PI * 2); g.stroke(); ring.material.map.needsUpdate = true; }
function pose(){ if(!hcam) return; const asp = innerWidth / innerHeight, th = Math.tan(rad(23)), wide = asp > 1, d = Math.max((RW + 0.5) / (th * asp), (RL + 1.4) / th * (wide ? 1.04 : 0.93)), p = rad(64), z0 = wide ? 1.3 : 0.4; hcam.aspect = asp; hcam.position.set(0, d * Math.sin(p), d * Math.cos(p) + z0); hcam.lookAt(0, 0, z0); hcam.updateProjectionMatrix(); }
/* šokio kamera: peliukas – laisvoje ekrano dalyje virš rezultato kortelės */
function poseDance(){ if(!dcam) return; const asp = innerWidth / innerHeight, c = document.querySelector("#ov .rc"), cf = c ? Math.min(0.62, (c.offsetHeight + 28) / innerHeight) : 0.4, f = 1 - cf, Hv = Math.max(1.5 / (0.86 * f), 1.45 / asp), d = Hv / (2 * Math.tan(rad(15))); dcam.aspect = asp; dcam.position.set(0, 0.66 - cf / 2 * Hv + 0.5, d); dcam.lookAt(0, 0.66 - cf / 2 * Hv, 0); dcam.updateProjectionMatrix(); }
/* herojus: peliukas (b) arba pelytė (g) su pasirinktais rūbais; pasikeitus – perkuriami žaidimo ir šokio modeliai */
const who = () => nst().hero || "b", wipe = g => g.traverse(o => { if(o.geometry) o.geometry.dispose(); if(o.material) o.material.dispose(); });
function mkHero(S, w){ return PELE.make(THREE, NM.outfit(S, w)); }
function dress(){ const S = nst(), w = S.hero || "b", key = w + JSON.stringify(S.wear || {}); if(key === heroKey) return; heroKey = key;
  for(const [old, sc, k] of [[mouse, hs, MS], [dmouse, ds, 1]]){ const vis = old.visible; sc.remove(old); wipe(old); const m = mkHero(S, w); m.scale.setScalar(k); m.visible = vis; sc.add(m); if(sc === hs) mouse = m; else dmouse = m; } }
/* ---------- namelis per visą ekraną (pagrindinė drobė) ----------
   hv.place: l – kiemas, v – kambarys; hv.mode: home | shop | wear | rooms | hero; hv.prev – peržiūrimas (dar nenupirktas) daiktas ar rūbas */
let home = null; const hv = { place: "l", mode: "home", prev: null };
function homeInit(){
  if(home) return; const sc = new THREE.Scene(); sc.background = new THREE.Color("#1a1f33"); sc.add(new THREE.HemisphereLight(0xdfe6ff, 0x30283a, 1.05)); const d = new THREE.DirectionalLight(0xfff0d0, 1.9); d.position.set(3, 7, 6); d.castShadow = true; d.shadow.mapSize.set(2048, 2048); Object.assign(d.shadow.camera, { left: -5, right: 5, top: 6, bottom: -4, far: 30 }); sc.add(d);
  const mark = SD.mesh(new THREE.ConeGeometry(0.16, 0.34, 4), new THREE.MeshBasicMaterial({ color: 0xffd23f }), 0, 0, 0); mark.rotation.x = Math.PI; mark.visible = false; sc.add(mark);
  const fade = document.createElement("div"); fade.id = "nfade"; $("mh").parentNode.appendChild(fade);
  home = { sc, cam: new THREE.PerspectiveCamera(32, 1, 0.1, 200), root: null, heroes: [], key: "", t: 0, mark, markY: 0, box: null, pitch: [0.4, 0.4], tr: null, fade }; hv.place = nst().view === "v" ? "v" : "l";
}
/* scenos turinys pagal būseną: daiktai (su peržiūrimu), herojus su rūbais (su peržiūrimu), rodyklė virš peržiūrimo daikto */
function homeSync(){
  const S = nst(), w = S.hero || "b", m = hv.mode, pvW = m === "wear" && hv.prev ? NM.wearOf(hv.prev) : null, S2 = pvW ? Object.assign({}, S, { wear: Object.assign({}, S.wear, { [w]: Object.assign({}, (S.wear || {})[w], { [pvW[1]]: pvW[0] }) }) }) : S;
  const own = new Set(S.own); if(m === "shop" && hv.prev) own.add(hv.prev); const key = [m === "hero" ? "h" : hv.place, [...own].join(), w, JSON.stringify(S2.wear || {})].join("|");
  if(key !== home.key){ home.key = key; if(home.root){ home.sc.remove(home.root); wipe(home.root); } home.heroes = [];
    const put = (hw, x, z, ry, k) => { const h = mkHero(S2, hw); h.position.set(x, 0, z); h.rotation.y = ry; h.scale.setScalar(k); home.root.add(h); home.heroes.push(h); h.userData.home = [x, z, ry]; };
    if(m === "hero"){ home.root = new THREE.Group(); const st2 = SD.mesh(new THREE.CircleGeometry(2.2, 48), SD.std("#3d3570"), 0, 0, 0); st2.rotation.x = -Math.PI / 2; st2.receiveShadow = true; home.root.add(st2); put("b", -0.55, 0, 0.25, 1); put("g", 0.55, 0, -0.25, 1); home.root.userData = { box: [-1.15, 0, -0.4, 1.15, 1.3, 0.4] }; home.sc.background.set("#232a4a"); }
    else { home.root = NM.build(THREE, hv.place, own); const sp = home.root.userData.spot; put(w, sp[0], sp[1], sp[2], 0.8); home.sc.background.set(hv.place === "v" ? "#16121f" : "#1a1f33"); }
    home.sc.add(home.root); }
  const pv = m === "shop" && hv.prev ? home.root.getObjectByName(hv.prev) : null; home.mark.visible = !!pv; if(pv){ const bx = new THREE.Box3().setFromObject(pv), c = bx.getCenter(new THREE.Vector3()); home.mark.position.set(c.x, bx.max.y + 0.4, c.z); home.markY = bx.max.y + 0.4; }
  const h0 = home.heroes[0]; home.box = m === "wear" ? [h0.position.x - 0.6, 0, h0.position.z - 0.4, h0.position.x + 0.6, 1.05, h0.position.z + 0.4] : home.root.userData.box; home.pitch = m === "hero" || m === "wear" ? [0.16, 0.16] : hv.place === "v" ? [0.5, 1.0] : [0.36, 0.8];
  homeFit();
}
/* kamera: visa scena (ar herojus) telpa laisvoje ekrano dalyje – tarp viršutinės juostos ir apatinio skydelio */
function homeFit(){
  if(!home || !home.box) return; const W = innerWidth, H = innerHeight, bot = $("hmB"), top = 58, bh = bot ? bot.offsetHeight + 8 : 0, free = Math.max(120, H - top - bh), cam = home.cam, B = home.box, tg = new THREE.Vector3((B[0] + B[3]) / 2, (B[1] + B[4]) / 2, (B[2] + B[5]) / 2), dir = new THREE.Vector3(), v = new THREE.Vector3();
  cam.aspect = W / H; cam.clearViewOffset(); cam.updateProjectionMatrix(); let cy = 0, mx = 0, vf = 0;
  const test = d => { cam.position.copy(tg).addScaledVector(dir, d); cam.lookAt(tg); cam.updateMatrixWorld(); let y0 = 9, y1 = -9; mx = 0; for(let k = 0; k < 8; k++){ v.set(B[k & 1 ? 3 : 0], B[k & 2 ? 4 : 1], B[k & 4 ? 5 : 2]).project(cam); mx = Math.max(mx, Math.abs(v.x)); y0 = Math.min(y0, v.y); y1 = Math.max(y1, v.y); } cy = (y0 + y1) / 2; vf = (y1 - y0) / (2 * free / H * 0.94); return mx <= 0.95 && vf <= 1; };
  const fit = p => { dir.set(0, Math.sin(p), Math.cos(p)); let lo = 2, hi = 120; for(let k = 0; k < 18; k++){ const mid = (lo + hi) / 2; if(test(mid)) hi = mid; else lo = mid; } test(hi); return hi; };
  /* žiūrėjimo kampas parenkamas taip, kad scena kuo geriau užpildytų laisvą plotą: aukštame (telefono) ekrane žiūrima labiau iš viršaus */
  let best = home.pitch[0], score = -1; for(let p = home.pitch[0]; p <= home.pitch[1] + 1e-6; p += 0.05){ fit(p); const sc = mx + Math.min(1, vf); if(sc > score + 0.01){ score = sc; best = p; } } fit(best);
  const want = 1 - 2 * (top + free / 2) / H; cam.setViewOffset(W, H, 0, Math.round((want - cy) / 2 * H), W, H); cam.updateProjectionMatrix();
}
function homeFrame(dt){
  if(!home || !home.root) return; home.t += dt; const t = home.t, h = home.heroes[0], tr = home.tr; home.heroes.forEach((q, i) => { if(!(tr && i === 0)) PELE.animate(q, "idle", t + i * 1.7); });
  if(hv.mode === "wear" && !tr) h.rotation.y = h.userData.home[2] + Math.sin(t * 0.8) * 0.7; if(home.mark.visible){ home.mark.position.y = home.markY + Math.abs(Math.sin(t * 5)) * 0.18; home.mark.rotation.y = t * 3; }
  /* įėjimas ar išėjimas: herojus nubėga prie durų, ekranas pritemsta, kita vieta, herojus ateina į savo vietą */
  if(tr){ tr.t += dt; const T1 = 0.75, T2 = 0.7, mv = (a, b, k) => { h.position.x = a[0] + (b[0] - a[0]) * k; h.position.z = a[1] + (b[1] - a[1]) * k; h.rotation.y = Math.atan2(b[0] - a[0], b[1] - a[1]); PELE.animate(h, "run", t); };
    if(tr.ph === 0){ const k = Math.min(1, tr.t / T1); mv(tr.from, tr.door, k); home.fade.style.opacity = Math.max(0, (tr.t - T1 * 0.5) / (T1 * 0.5)); if(k >= 1){ hv.place = tr.to; setView(tr.to); tr.ph = 1; tr.t = 0; homeSync(); const q = home.heroes[0], d2 = home.root.userData.door; tr.from = [d2[0], d2[1]]; tr.door = [q.userData.home[0], q.userData.home[1]]; q.position.set(d2[0], 0, d2[1]); showHome(true); } }
    else { const k = Math.min(1, tr.t / T2); mv(tr.from, tr.door, k); home.fade.style.opacity = Math.max(0, 1 - tr.t / (T2 * 0.6)); if(k >= 1){ h.rotation.y = h.userData.home[2]; home.fade.style.opacity = 0; home.tr = null; } } }
}
function homeGo(){ if(home.tr) return; const h = home.heroes[0], d = home.root.userData.door; home.tr = { ph: 0, t: 0, to: hv.place === "l" ? "v" : "l", from: [h.position.x, h.position.z], door: [d[0], d[1]] }; MK.sfx.whoosh(); }
const coinP = () => `<span class="coin" title="${X.nm.coins}">${CN}<b>${coins()}</b></span>`;
function setView(v){ const S = nst(); S.view = v; nsave(S); }
/* laukiamasis: namelis, parduotuvė, rūbai, kambarių sąrašas ar herojaus pasirinkimas – kambario nėra */
function lobby(){ stopDance(); homeInit(); picking = true; st = null; keys.clear(); joy = null; if(room){ hs.remove(room); room = null; } mouse.visible = glow.visible = bang.visible = ring.visible = false; }
function homeUI(mode, html, click){ hv.mode = mode; const old = document.querySelector("#mh .sheet .shop"), y = old && homeUI.keep ? old.scrollTop : 0; homeUI.keep = false; $("mh").innerHTML = `<div class="hm">${html}</div>`; const nw = document.querySelector("#mh .sheet .shop"); if(nw) nw.scrollTop = y; homeSync(); $("mh").firstChild.onclick = e => { if(home.tr) return; click(e); }; }
function showHome(keepTr){
  lobby(); hv.prev = null; if(!keepTr){ home.tr = null; home.fade.style.opacity = 0; }
  homeUI("home", `${coinP()}<div class="hbar" id="hmB"><button type="button" class="play" data-a="play">${X.nm.play}</button><button type="button" data-a="go">${hv.place === "l" ? X.nm.goIn : X.nm.goOut}</button><button type="button" data-a="shop">${X.nm.shop}</button><button type="button" data-a="wear">${X.nm.wear}</button></div>`,
    e => { const b = e.target.closest("[data-a]"); if(!b) return; const a = b.dataset.a; if(a === "go") return homeGo(); MK.sfx.tap(); if(a === "play") showPicker(); else if(a === "shop") showShop(); else showWear(); });
}
const sheet = (title, hint, list) => `${coinP()}<div class="sheet" id="hmB"><div class="shd"><b>${title}</b><button type="button" data-close aria-label="${X.nm.close}">✕</button></div><p>${hint}</p><div class="shop">${list}</div></div>`;
/* eilutė: turimas – žymė; pasirinktas peržiūrai – mygtukas „Pirkti“; kitaip – kaina (palietus eilutę daiktas parodomas) */
const rowH = (id, pr, name, col, state, bal) => `<div class="it${state === "sel" ? " sel" : ""}${state === "on" || state === "own" ? " own" : ""}" data-id="${id}"><i class="ic" style="background:${col}"></i><b>${name}</b>${state === "on" ? `<span class="ok">${X.nm.on}</span>` : state === "own" ? `<span class="ok">${X.nm.have}</span>` : state === "put" ? `<span class="tag">${X.nm.put}</span>` : state === "sel" ? `<button type="button" data-buy="${id}"${pr > bal ? " disabled" : ""}>${pr > bal ? X.nm.poor(pr - bal) : X.nm.buy(pr)} ${CN}</button>` : `<span class="pr">${pr} ${CN}</span>`}</div>`;
function buy(id, pr, S){ if(pr > coins()) return false; S.own.push(id); S.spent += pr; MK.sfx.star(3); if(MK.confetti) MK.confetti(24); return true; }
function showShop(){
  lobby(); const S = nst(), bal = coins();
  homeUI("shop", sheet(X.nm.shopT[hv.place], X.nm.look, NM.ITEMS.filter(q => q[2] === hv.place).map(([id, pr]) => rowH(id, pr, X.items[id], ICOL[id] || "#ccc", S.own.includes(id) ? "own" : hv.prev === id ? "sel" : "", bal)).join("")),
    e => { const b = e.target.closest("[data-buy]"), r = e.target.closest("[data-id]"); homeUI.keep = true; if(e.target.closest("[data-close]")){ MK.sfx.tap(); showHome(); }
      else if(b){ if(b.disabled) return; const S2 = nst(), id = b.dataset.buy; if(!S2.own.includes(id) && buy(id, NM.price(id), S2)){ nsave(S2); hv.prev = null; showShop(); } }
      else if(r && !nst().own.includes(r.dataset.id)){ MK.sfx.tap(); hv.prev = hv.prev === r.dataset.id ? null : r.dataset.id; showShop(); } });
}
function showWear(){
  lobby(); const S = nst(), bal = coins(), w = S.hero || "b";
  const list = NM.SLOTS.map(slot => `<h5>${typeof X.slots[slot] === "string" ? X.slots[slot] : X.slots[slot][w]}</h5>` + NM.WEAR.filter(q => q[1] === slot && (q[3] === "*" || q[3] === w)).map(q => rowH(q[0], q[2], X.wear[q[0]], q[4].shirt || q[4].shoe || q[4].hatC || q[4].scarf || "#fff", NM.worn(S, w, slot) === q[0] ? "on" : NM.hasWear(S, w, q[0]) ? "put" : hv.prev === q[0] ? "sel" : "", bal)).join("")).join("") + `<button type="button" class="chg" data-hero>${X.hero.change}</button>`;
  homeUI("wear", sheet(X.nm.wearT, X.nm.lookW, list), e => { const b = e.target.closest("[data-buy]"), r = e.target.closest("[data-id]"); homeUI.keep = true; if(e.target.closest("[data-close]")){ MK.sfx.tap(); showHome(); } else if(e.target.closest("[data-hero]")){ MK.sfx.tap(); showHero(); }
    else if(b || r){ const id = (b || r).dataset.buy || (b || r).dataset.id, S2 = nst(), q = NM.wearOf(id); if(!q) return; const has = NM.hasWear(S2, w, id);
      if(!has && !b){ MK.sfx.tap(); hv.prev = hv.prev === id ? null : id; return showWear(); } if(!has){ if(b.disabled || !buy(id, q[2], S2)) return; } else MK.sfx.tap();
      S2.wear = S2.wear || {}; (S2.wear[w] = S2.wear[w] || {})[q[1]] = id; nsave(S2); hv.prev = null; dress(); showWear(); } });
}
function showHero(){
  lobby(); hv.prev = null; homeUI("hero", `<div class="htitle"><h3>${X.hero.title}</h3><p>${X.hero.sub}</p></div><div class="hbar two" id="hmB"><button type="button" class="play" data-h="b">${X.hero.b}</button><button type="button" class="play" data-h="g">${X.hero.g}</button></div>`,
    e => { const b = e.target.closest("[data-h]"); if(!b) return; MK.sfx.star(2); const S = nst(); S.hero = b.dataset.h; nsave(S); dress(); showHome(); });
}
function startDance(){ dance = { t: 0 }; $("mh").innerHTML = ""; $("ov").classList.add("dance"); poseDance(); }
function stopDance(){ dance = null; $("ov").classList.remove("dance"); }

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
  /* tūbelė, surinkta mažiau nei prieš valandą, dar tuščia (pilka): žvaigždutėms ji skaičiuojama, bet pinigėlių neduoda */
  { const S = nst(), now = Date.now(); st.tubeObjs.forEach((g, i) => { g.userData.i = i; g.userData.ripe = NM.ripe(S, st.R.id, i, now); if(!g.userData.ripe) g.children[0].material.color.set(0x70758a); }); }
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
  lobby(); hv.mode = "rooms"; hv.prev = null; home.tr = null; home.fade.style.opacity = 0; homeSync(); const P = prog(), done = ROOMS.filter(r => P[r.id]).length;
  $("mh").innerHTML = `<div class="rooms"><div class="rtop"><button type="button" data-home>${X.nm.home}</button>${coinP()}</div><h3>${X.pickT}</h3><p>${X.pickS(done, ROOMS.length)}</p>${K.floors.map((f, fi) => `<h4>${X.floor[f.id].name} <small>${X.floor[f.id].sub}</small></h4><div class="rgrid">${ROOMS.filter(r => r.fi === fi).map(r => { const s = P[r.id] || 0, ok = open(r, P);
    return `<button type="button" class="rb${s ? " done" : ""}" data-r="${ROOMS.indexOf(r)}"${ok ? "" : " disabled"}><b>${r.ri + 1}</b><i>${"★".repeat(s)}${"☆".repeat(3 - s)}</i></button>`; }).join("")}</div>`).join("")}<p class="soon">${X.soon}</p></div>`;
  $("mh").firstChild.onclick = e => { const b = e.target.closest("[data-r]"); if(e.target.closest("[data-home]")){ MK.sfx.tap(); showHome(); } else if(b && !b.disabled){ MK.sfx.tap(); startRoom(+b.dataset.r); } };
}
function startRoom(idx){
  stopDance(); dress(); const R = ROOMS[idx]; picking = false; mouse.visible = glow.visible = true;
  $("mh").innerHTML = `<div class="mtop"><div class="mcard" id="hR"></div><div class="mcard hearts" id="hH"></div><button type="button" class="hbtn" id="hRe" aria-label="${X.restart}" title="${X.restart}">↺</button></div><div class="mrow"><div class="mbar low" id="hBar"><i style="width:0"></i></div><div class="mcard" id="hT"></div><div class="mcard tmr" id="hC" hidden></div></div><div class="mmsg top" id="hMsg"></div><button type="button" class="abtn" id="hAct" disabled><b></b>${navigator.maxTouchPoints > 0 ? "" : `<small>${X.keyHint}</small>`}</button>`;
  $("hRe").onclick = () => { MK.sfx.tap(); reset(); }; $("hAct").addEventListener("pointerdown", e => { e.preventDefault(); press(); });
  st = { idx, R, P: L.parse(R.lv), fails: 0, over: false, t: 0, doneT: 0, msgT: 0, actKey: "?", tubeCoins: 0 }; reset(true); say(tipFor(R), "new"); st.msgT = 7; MK.sfx.whoosh();
}
const tipFor = R => { const t = X.tips[R.id]; return typeof t === "function" ? t(X.who[who()]) : t || ""; };   /* tik naujo dalyko paaiškinimas, ne sprendimo užuomina */
function reset(first){ st.w = L.world0(st.P); st.obs = L.obstacles(st.P, st.w); st.on = L.onAt(st.P, st.w, st.P.start[0], st.P.start[1], st.t); st.onKey = st.on.join(); st.tmrS = -1; st.x = st.P.start[0]; st.z = st.P.start[1]; st.face = Math.PI; st.meter = 0; st.safe = 0.2; st.got = 0; st.gn = null; st.doneT = 0; st.isLit = false; ring.visible = false; buildRoom(); hud(); if(!first) say(""); }
function start(){ init(); pose(); dress(); homeInit(); if(nst().hero) showHome(); else showHero(); }
function stop(){ stopDance(); st = null; picking = false; keys.clear(); joy = null; if(joyEl){ joyEl.remove(); joyEl = null; } }
function back(){ if(picking && hv.mode !== "home" && hv.mode !== "hero" && nst().hero){ showHome(); return true; } if(picking || !st) return false; $("ov").innerHTML = ""; showPicker(); return true; }
function hud(){ const R = st.R, n = st.P.tubes.length; $("hR").innerHTML = `<small>${X.floor[K.floors[R.fi].id].name}</small>${X.room(R.ri + 1)}`; $("hT").textContent = X.tubes(st.got, n); $("hT").hidden = !n; const h = Math.max(0, 3 - st.fails); $("hH").textContent = "♥".repeat(h) + "♡".repeat(3 - h); }
function say(m, cls){ const e = $("hMsg"); if(!e) return; e.textContent = m || ""; e.className = "mmsg top " + (cls || ""); }
function fail(msg){ st.fails++; MK.sfx.bad(); reset(); say(msg, "bad"); st.msgT = 3; }
function win(){
  st.over = true; const R = st.R, idx = st.idx, n = st.P.tubes.length, stars = st.fails === 0 && st.got >= n ? 3 : st.fails <= 2 ? 2 : 1, nx = ROOMS[idx + 1];
  /* atlygis: skirtumas iki geriausio rezultato, aukšto premija (jei ką tik užbaigtas aukštas) ir šiame kambaryje surinktų tūbelių pinigėliai */
  const prev = prog()[R.id] || 0, e0 = NM.earned(FL, prog()); saveRoom(R.id, stars); const gain = NM.earned(FL, prog()) - e0, roomC = Math.max(0, NM.REWARD[stars] - NM.REWARD[prev]), earn = { room: roomC, bonus: gain - roomC, tubes: st.tubeCoins, total: gain + st.tubeCoins };
  SD.result({ stars, title: X.won, lines: [X.wonL[stars - 1], X.res(st.got, n, st.fails)].concat(earn.total > 0 ? [X.earn(earn, CN)] : [], stars < 3 ? [X.hint3] : []), again: () => nx ? startRoom(idx + 1) : showPicker(), againT: nx ? X.next : X.rooms, menu: () => showPicker(), menuT: X.rooms });
  if(stars === 3) startDance();
}
/* ---------- veiksmai ---------- */
function unstuck(){ if(!L.solid(st.obs, st.P.lamps, st.x, st.z, MR)) return; for(let r = 0.1; r < 2; r += 0.1) for(let k = 0; k < 16; k++){ const x = st.x + Math.cos(k * 0.3927) * r, z = st.z + Math.sin(k * 0.3927) * r; if(!L.solid(st.obs, st.P.lamps, x, z, MR)){ st.x = x; st.z = z; return; } } }
function doAct(a){
  st.w = L.apply(st.P, st.w, a, st.t); st.obs = L.obstacles(st.P, st.w);
  if(a.type === "push"){ MK.sfx.whoosh(); st.pushT = 0.24; } else if(a.type === "cheese"){ st.mc[a.i].userData.gone = 1; MK.sfx.good(); } else if(a.type === "rope"){ const s = st.ms[a.i]; s.fall = true; s.line.visible = false; s.mark.visible = false; MK.sfx.whoosh(); }
  else if(a.type === "cable"){ const p = st.mk[a.i].plug.material; p.color.set("#565b6e"); p.emissive.set(0x000000); MK.sfx.good(); } else if(a.type === "switch") MK.sfx.tap(); else if(a.type === "timer") MK.sfx.whoosh();
  unstuck();
}
function press(){
  if(!st || st.over || st.doneT > 0) return; const a = L.action(st.P, st.w, st.x, st.z); if(!a) return;
  if(a.type === "push"){ if(a.ok) doAct(a); else { MK.sfx.bad(); say(X.stuck, "bad"); st.msgT = 1.6; } } else if(a.type === "switch" || a.type === "timer") doAct(a); else if(!st.gn){ st.gn = { type: a.type, i: a.i, t: 0 }; MK.sfx.tap(); }
}
function gnawSpot(g){ const P = st.P; if(g.type === "cheese") return [cx(P.cheese[g.i][0]), 2.3, cz(P.cheese[g.i][1])]; if(g.type === "rope") return [cx(P.ropes[g.i][0]), 1.2, cz(P.ropes[g.i][1])]; return [cx(P.cables[g.i][0]), 1.0, cz(P.cables[g.i][1])]; }
function frame(dt){
  if(picking) homeFrame(dt);
  if(dance){ dance.t += dt; PELE.animate(dmouse, "dance", dance.t); dmouse.rotation.y = Math.sin(dance.t * 0.9) * 0.25; return; }
  if(!st || st.over) return; st.t += dt; const P = st.P, t = st.t; st.moving = false; if(st.pushT > 0) st.pushT -= dt;
  for(const o of st.lampObjs){ const Lm = o.L, a = L.lampAngle(Lm, t), h = L.lampH(Lm, t); o.sl.position.set(Lm.x, h, Lm.z); o.sl.target.position.set(Lm.x + Math.cos(a) * Lm.reach, 0, Lm.z + Math.sin(a) * Lm.reach); o.pole.scale.y = h; o.pole.position.y = h / 2; o.head.position.set(Lm.x, h, Lm.z); o.head.lookAt(o.sl.target.position); }
  for(const g of st.tubeObjs) if(g.visible) g.rotation.y += dt * 2.5;
  st.mb.forEach((m, i) => { const b = st.w.boxes[i], k = Math.min(1, dt * 14); m.position.x += (cx(b[0]) - m.position.x) * k; m.position.z += (cz(b[1]) - m.position.z) * k; });
  for(const m of st.mc) if(m.userData.gone && m.visible){ m.userData.gone += dt * 5; const k = Math.max(0, 2 - m.userData.gone); m.scale.set(k, k, k); m.position.y = 0.85 * k; if(k <= 0) m.visible = false; }
  for(const s of st.ms) if(s.fall && s.y > 0){ s.v += dt * 30; s.y = Math.max(0, s.y - s.v * dt); s.g.position.y = s.y; if(s.y === 0){ s.sack.castShadow = true; MK.sfx.bad(); } }
  let cat = null; if(P.cat){ cat = L.catPos(P.cat, t); st.cat.position.set(cat[0], cat[4] ? Math.abs(Math.sin(t * 6)) * 0.05 : 0, cat[1]); st.cat.rotation.y = Math.atan2(cat[2], cat[3]); drawGaze(cat); }
  if(st.doneT > 0){ st.doneT -= dt; if(st.doneT <= 0) return win(); }
  else {
    let vx = (keys.has("R") ? 1 : 0) - (keys.has("L") ? 1 : 0), vz = (keys.has("D") ? 1 : 0) - (keys.has("U") ? 1 : 0); if(joy){ vx += joy.vx; vz += joy.vz; } const vl = Math.hypot(vx, vz);
    if(vl > 0.08){ const k = Math.min(1, vl) / vl * SPEED * dt, nx = st.x + vx * k, nz = st.z + vz * k; if(!L.solid(st.obs, P.lamps, nx, st.z, MR)) st.x = nx; if(!L.solid(st.obs, P.lamps, st.x, nz, MR)) st.z = nz; st.face = Math.atan2(vx, vz); st.moving = true; }
    for(const g of st.tubeObjs) if(g.visible && Math.hypot(g.position.x - st.x, g.position.z - st.z) < 0.6){ g.visible = false; st.got++; MK.sfx.star(st.got); const v = g.userData.ripe ? NM.tubeValue(K.floors[st.R.fi].id) : 0; if(v){ const S = nst(); (S.tb[st.R.id] = S.tb[st.R.id] || [])[g.userData.i] = Date.now(); S.extra += v; nsave(S); st.tubeCoins += v; } say(v ? X.tubeCoin(v) : X.tubeEmpty, "good"); st.msgT = v ? 1.2 : 2; hud(); }
    /* veiksmo mygtukas ir graužimas */
    const a = L.action(P, st.w, st.x, st.z), ak = a ? (a.type === "push" ? "push" : a.type === "switch" || a.type === "timer" ? "sw" : "gnaw") : ""; if(ak !== st.actKey){ st.actKey = ak; const b = $("hAct"); b.disabled = !ak; b.firstChild.textContent = ak ? X.act[ak] : X.act.none; }
    if(st.gn){ if(!a || a.type !== st.gn.type || a.i !== st.gn.i){ st.gn = null; ring.visible = false; } else { const p = gnawSpot(st.gn); st.gn.t += dt; st.face = Math.atan2(p[0] - st.x, p[2] - st.z); ring.position.set(p[0], p[1], p[2]); ring.visible = true; drawRing(Math.min(1, st.gn.t / L.T_GNAW)); if(st.gn.t >= L.T_GNAW){ st.gn = null; ring.visible = false; doAct(a); } } }
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
  mouse.position.set(st.x, 0, st.z); glow.position.set(st.x, 0.02, st.z); glow.material.opacity = st.isLit ? 0 : 1; mouse.rotation.y += Math.atan2(Math.sin(st.face - mouse.rotation.y), Math.cos(st.face - mouse.rotation.y)) * Math.min(1, dt * 12);
  PELE.animate(mouse, st.doneT > 0 ? "cheer" : st.gn ? "gnaw" : st.pushT > 0 ? "push" : st.moving ? "run" : "idle", t);
  bang.visible = !!st.isLit; bang.position.set(st.x, 1.25 + Math.sin(t * 16) * 0.05, st.z);
}
function render(){ if(dance) SD.renderer.render(ds, dcam); else if(picking && home && home.root) SD.renderer.render(home.sc, home.cam); else SD.renderer.render(hs, hcam); }
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
SD.MODES.slepynes = { start, stop, frame, render, key, back, resize: () => { pose(); if(dance) poseDance(); if(picking) homeFit(); }, get st(){ return st; }, get dance(){ return dance; }, api: { L, ROOMS, startRoom, press, reset, showPicker, showHome, hv } };
