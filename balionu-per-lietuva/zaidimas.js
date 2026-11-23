/* Balionu per Lietuvą – žaidimo eiga ir 3D vaizdas (Three.js r160, MIT; biblioteka bendra su „Slibino sala“).
   Žemėlapis piešiamas iš Natural Earth duomenų (karta.js) į tekstūrą; balionas, debesys, paukščiai ir ženklai – 3D. */
import * as THREE from "/slibino-sala/three.module.min.js";
const T = window.MK_T, K = window.MK_KARTA, V = window.MK_VIETOS, MK = window.MK;
const GAME = "balionu-per-lietuva", CKEY = "mk-" + GAME + "-albumas";
const $ = id => document.getElementById(id);
const BYID = {}; V.list.forEach(v => { BYID[v.id] = v; });
const nameOf = id => T.p[id][0], factOf = id => T.p[id][1];

/* ============================== geografija ============================== */
const LON0 = 23.85, LAT0 = 55.225, KX = 111.32 * Math.cos(55.2 * Math.PI / 180), KY = 111.2;
const wx = lon => (lon - LON0) * KX, wz = lat => -(lat - LAT0) * KY, toLon = x => x / KX + LON0, toLat = z => -z / KY + LAT0;
const [BX0, BY0, BX1, BY1] = K.bb;
const kmDist = (a, b) => Math.hypot((a[1] - b[1]) * KX, (a[0] - b[0]) * KY);           /* [platuma, ilguma] */
function inPoly(lon, lat, p){ let c = false; for(let i = 0, j = p.length - 1; i < p.length; j = i++){ const a = p[i], b = p[j]; if((a[1] > lat) !== (b[1] > lat) && lon < (b[0] - a[0]) * (lat - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; }
const inLand = (code, lon, lat) => K.land[code].some(p => inPoly(lon, lat, p));
function countryAt(lon, lat){ for(const c of ["LTU", "LVA", "BLR", "POL", "RUS"]) if(inLand(c, lon, lat)) return c; return null; }
const spitLon = lat => lat >= 55.3 ? 21.0 + (lat - 55.3) / 0.42 * 0.1 : lat >= 55.15 ? 20.86 + (lat - 55.15) / 0.15 * 0.14 : 20.55 + (lat - 54.96) / 0.19 * 0.31;
function zoneAt(lon, lat){ const c = countryAt(lon, lat); if(c) return c; if(lat < 55.72 && lat > 54.9 && lon > spitLon(lat)) return "marios"; return "jura"; }
function regionAt(lon, lat){ if(!inLand("LTU", lon, lat)) return null; for(const r of ["mazoji", "zemaitija", "suvalkija", "dzukija"]) if(inPoly(lon, lat, V.regions[r])) return r; return "aukstaitija"; }
function riverDist(key, lat, lon){
  let best = 1e9; const px = lon * KX, py = lat * KY;
  for(const s of K.rivers[key]) for(let i = 1; i < s.length; i++){
    const ax = s[i - 1][0] * KX, ay = s[i - 1][1] * KY, bx = s[i][0] * KX, by = s[i][1] * KY, dx = bx - ax, dy = by - ay, l = dx * dx + dy * dy;
    const t = l ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l)) : 0, d = Math.hypot(px - ax - t * dx, py - ay - t * dy); if(d < best) best = d;
  }
  return best;
}
const RAD = 12, RIVER_TOL = 7, REG_TOL = 9;
/* ar atvirutė, numesta taške (lat, lon), pataikė į vietą v */
function hits(v, lat, lon){
  if(v.t === "m" || v.t === "v") return kmDist(v.at, [lat, lon]) <= RAD;
  if(v.t === "e") return kmDist(v.at, [lat, lon]) <= v.rad;
  if(v.t === "u") return riverDist(v.r, lat, lon) <= RIVER_TOL;
  if(v.t === "j") return zoneAt(lon, lat) === v.z;
  if(v.t === "k") return countryAt(lon, lat) === v.c;
  if(v.t === "r"){ if(regionAt(lon, lat) === v.id) return true; for(let i = 0; i < 8; i++){ const a = i * Math.PI / 4; if(regionAt(lon + Math.cos(a) * REG_TOL / KX, lat + Math.sin(a) * REG_TOL / KY) === v.id) return true; } return false; }
  if(v.t === "d"){ if(!inLand("LTU", lon, lat)) return false; return v.d === "N" ? lat > 56.05 : v.d === "S" ? lat < 54.25 : v.d === "E" ? lon > 26.0 : lon < 21.75; }
  return false;
}
const CITIES = V.list.filter(v => v.t === "m");
function describe(lat, lon){
  const z = zoneAt(lon, lat);
  if(z === "jura") return T.fb.wrongSea; if(z === "marios") return T.fb.wrongLagoon; if(z !== "LTU") return T.fb.wrongCountry(T.countryNames[z]);
  let b = null, bd = 1e9; for(const c of CITIES){ const d = kmDist(c.at, [lat, lon]); if(d < bd){ bd = d; b = c; } }
  return bd <= 14 ? T.fb.wrongHere(nameOf(b.id)) : T.fb.wrongNear(nameOf(b.id));
}
function bearing(lat, lon, to){ const dx = (to[1] - lon) * KX, dy = (to[0] - lat) * KY; return { ang: Math.atan2(dx, dy), km: Math.hypot(dx, dy) }; }   /* 0 – šiaurė, pagal laikrodį */

/* ============================== albumas ir meniu ============================== */
const album = () => Object.assign({ cards: {} }, MK.get(CKEY, {}));
const STAR = on => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.4l3 6.1 6.7 1-4.9 4.7 1.2 6.7L12 17.7l-6 3.2 1.2-6.7L2.3 9.5l6.7-1z" fill="${on ? "#ffd23f" : "#fff"}" stroke="#1b2340" stroke-width="1.8" stroke-linejoin="round"/></svg>`;
const I = (b, col) => `<svg viewBox="0 0 40 40" aria-hidden="true" fill="none" stroke="#1b2340" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round">${b}</svg>`;
const ICON = {
  m: I('<path d="M5 34V19l7-6 7 6v15zM19 34V11h14v23z" fill="#fff"/><path d="M24 17h4M24 23h4M24 29h4M10 26h4"/>'),
  u: I('<path d="M4 14c6-6 10 6 16 0s10 6 16 0M4 26c6-6 10 6 16 0s10 6 16 0" stroke="#2f80ff" stroke-width="4"/>'),
  e: I('<path d="M6 22c0-8 8-12 15-11s14 4 13 11-9 9-16 9S6 29 6 22z" fill="#6bb8ff"/><path d="M14 21c3-2 5 2 8 0"/>'),
  j: I('<path d="M3 30c5-5 8 5 13 0s8 5 13 0 5 2 8 0" stroke="#2f80ff" stroke-width="4"/><path d="M20 24V8l10 6-10 5" fill="#fff"/>'),
  k: I('<path d="M9 36V5"/><path d="M9 7h22l-5 7 5 7H9z" fill="#ff5d5d"/>'),
  r: I('<path d="M20 4l14 16-14 16L6 20z" fill="#ffd23f"/><path d="M20 12l7 8-7 8-7-8z" fill="#e2452f"/>'),
  d: I('<circle cx="20" cy="20" r="15" fill="#fff"/><path d="M20 8l5 12-5 12-5-12z" fill="#e2452f"/><path d="M20 20h0"/>'),
  v: I('<path d="M6 35V15h6v5h5v-9h6v9h5v-5h6v20z" fill="#e88a6a"/><path d="M17 35v-7a3 3 0 0 1 6 0v7"/>'),
  free: I('<circle cx="20" cy="16" r="11" fill="#ff5d5d"/><path d="M15 26l2 6h6l2-6M20 5v22" /><rect x="16" y="32" width="8" height="5" fill="#b77a45"/>')
};
const FCOL = { s1: "#ffd98a", s2: "#a8d8ff", s3: "#ffb3c7", s4: "#c9f0b0", s5: "#e3d0ff", s6: "#ffe680" }, FICO = { s1: "m", s2: "u", s3: "d", s4: "r", s5: "v", s6: "free" };
function showMenu(){
  S = null; $("game").hidden = true; $("app").hidden = false; $("ov").innerHTML = "";
  const best = MK.best(GAME), A = album();
  $("fl").innerHTML = V.flights.map((F, i) => { const f = T.flights[F.id], st = +best[F.id] || 0;
    return `<button class="fc" type="button" data-f="${i}"><span class="ic" style="background:${FCOL[F.id]}">${ICON[FICO[F.id]]}</span><span><b>${f.name}<span class="g">${T.grade(f.grade)}</span></b><span class="s">${f.sub}</span></span><span style="display:flex;gap:1px">${[0, 1, 2].map(k => `<span style="width:20px;height:20px">${STAR(k < st)}</span>`).join("")}</span></button>`; }).join("")
    + `<button class="fc free" type="button" data-f="free"><span class="ic" style="background:#fff">${ICON.free}</span><span><b>${T.free}</b><span class="s">${T.freeSub}</span></span><span></span></button>`;
  const n = V.list.filter(v => A.cards[v.id]).length;
  $("albP").textContent = T.albumOf(n, V.list.length); $("albBar").style.width = Math.round(n / V.list.length * 100) + "%";
  $("alb").innerHTML = V.list.map(v => `<span class="ac${A.cards[v.id] ? " on" : ""}${A.cards[v.id] >= 2 ? " gold" : ""}">${A.cards[v.id] ? nameOf(v.id) : "?"}</span>`).join("");
  window.scrollTo(0, 0);
}
$("fl").addEventListener("click", e => { const b = e.target.closest("[data-f]"); if(!b) return; MK.sfx.tap(); start(b.dataset.f === "free" ? null : V.flights[+b.dataset.f]); });

/* ============================== 3D pasaulis ============================== */
let renderer, scene, camera, ground, balloon, flame, shadow, ring, clouds = [], birds = [], labels = [], markers = [], beacon, envelope, sparks = [], ready = false;
const ALT = 22, BS = 2.3, SKY = 0xbfe6ff;
function paintMap(){
  const TW = 2048, wKm = (BX1 - BX0) * KX, hKm = (BY1 - BY0) * KY, sc = TW / wKm, TH = Math.round(hKm * sc);
  const c = document.createElement("canvas"); c.width = TW; c.height = TH; const g = c.getContext("2d");
  const X = lon => (lon - BX0) * KX * sc, Y = lat => (BY1 - lat) * KY * sc;
  const path = p => { g.beginPath(); p.forEach((q, i) => i ? g.lineTo(X(q[0]), Y(q[1])) : g.moveTo(X(q[0]), Y(q[1]))); };
  /* jūra */
  const sea = g.createLinearGradient(0, 0, TW * 0.4, 0); sea.addColorStop(0, "#63b6f0"); sea.addColorStop(1, "#8fd0f7"); g.fillStyle = sea; g.fillRect(0, 0, TW, TH);
  g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 3; g.lineCap = "round";
  for(let i = 0; i < 90; i++){ const x = (i * 97) % 460, y = (i * 191) % TH; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 14, y - 7, x + 28, y); g.stroke(); }
  /* kaimynai */
  const ncol = { LVA: "#f3ead2", BLR: "#f0e4cb", POL: "#f4ecd9", RUS: "#eadfc9" };
  for(const a of ["LVA", "BLR", "POL", "RUS"]) for(const p of K.land[a]){ path(p); g.closePath(); g.fillStyle = ncol[a]; g.fill(); g.strokeStyle = "#b9a888"; g.lineWidth = 2; g.stroke(); }
  /* Lietuva: regionų spalvos švelniais perėjimais */
  g.save(); g.beginPath(); for(const p of K.land.LTU){ p.forEach((q, i) => i ? g.lineTo(X(q[0]), Y(q[1])) : g.moveTo(X(q[0]), Y(q[1]))); g.closePath(); } g.clip();
  g.fillStyle = V.regionColor.aukstaitija; g.fillRect(0, 0, TW, TH);
  for(const r of ["zemaitija", "dzukija", "suvalkija", "mazoji"]){ g.save(); g.shadowColor = V.regionColor[r]; g.shadowBlur = 46; g.shadowOffsetX = 6000; g.translate(-6000, 0); for(let k = 0; k < 2; k++){ path(V.regions[r]); g.closePath(); g.fillStyle = "#000"; g.fill(); } g.restore(); }
  /* švelni faktūra */
  for(let i = 0; i < 2600; i++){ const x = (i * 733 + (i * i) % 977) % TW, y = (i * 419 + (i * 7) % 613) % TH; g.fillStyle = i % 3 ? "rgba(60,130,40,.07)" : "rgba(255,255,255,.10)"; g.beginPath(); g.arc(x, y, 3 + (i % 5), 0, 7); g.fill(); }
  g.restore();
  /* kitų šalių upės ir visi ežerai */
  const river = (key, w, col) => { for(const s of K.rivers[key]){ path(s); g.strokeStyle = col; g.lineWidth = w; g.lineJoin = "round"; g.lineCap = "round"; g.stroke(); } };
  ["kiti", "dauguva", "dysna", "nemunelis", "musa"].forEach(k => river(k, 3.2, "#5aa5e8"));
  ["venta", "sesupe", "merkys", "nevezis", "sventoji"].forEach(k => { river(k, 6.5, "#2f7fd6"); river(k, 2.4, "#8fd0ff"); });
  river("neris", 8.5, "#2f7fd6"); river("neris", 3.2, "#8fd0ff"); river("nemunas", 11, "#2a74cc"); river("nemunas", 4.4, "#8fd0ff");
  g.fillStyle = "#5fb0f2"; g.strokeStyle = "#2a74cc"; g.lineWidth = 2;
  for(const l of K.lakes) for(const p of l.p){ path(p); g.closePath(); g.fill(); g.stroke(); }
  for(const [la, lo, a, b, rot] of V.handLakes){ g.beginPath(); g.ellipse(X(lo), Y(la), a * sc, b * sc, -rot * Math.PI / 180, 0, 7); g.fill(); g.stroke(); }
  /* valstybės siena */
  for(const p of K.land.LTU){ path(p); g.closePath(); g.strokeStyle = "rgba(255,255,255,.75)"; g.lineWidth = 9; g.lineJoin = "round"; g.stroke(); g.strokeStyle = "#2f7d32"; g.lineWidth = 4.5; g.stroke(); }
  /* miestai ir žymios vietos */
  for(const v of V.list){
    if(v.t === "m"){ const r = v.s === 1 ? 13 : v.s === 2 ? 10 : 7; g.beginPath(); g.arc(X(v.at[1]), Y(v.at[0]), r, 0, 7); g.fillStyle = v.s === 1 ? "#e2452f" : "#fff"; g.fill(); g.strokeStyle = "#1b2340"; g.lineWidth = 3.5; g.stroke(); if(v.s === 1){ g.beginPath(); g.arc(X(v.at[1]), Y(v.at[0]), 4.5, 0, 7); g.fillStyle = "#fff"; g.fill(); } }
    if(v.t === "v"){ const x = X(v.at[1]), y = Y(v.at[0]); g.beginPath(); g.moveTo(x, y - 8); g.lineTo(x + 8, y); g.lineTo(x, y + 8); g.lineTo(x - 8, y); g.closePath(); g.fillStyle = "#ffb02e"; g.fill(); g.strokeStyle = "#1b2340"; g.lineWidth = 3; g.stroke(); }
  }
  return { canvas: c, wKm, hKm };
}
function labelSprite(text, h, o){
  o = o || {}; const c = document.createElement("canvas"), g = c.getContext("2d"), fs = 52, font = `${o.italic ? "italic " : ""}900 ${fs}px "Trebuchet MS",Verdana,sans-serif`;
  g.font = font; const w = Math.ceil(g.measureText(text).width) + 28; c.width = w; c.height = 72; g.font = font; g.textBaseline = "middle"; g.lineJoin = "round";
  if(o.plate){ g.fillStyle = o.plate; g.strokeStyle = "#1b2340"; g.lineWidth = 5; const r = 18; g.beginPath(); g.roundRect(3, 5, w - 6, 62, r); g.fill(); g.stroke(); g.fillStyle = o.color || "#1b2340"; g.fillText(text, 14, 38); }
  else { g.strokeStyle = o.stroke || "#fff"; g.lineWidth = 10; g.strokeText(text, 14, 38); g.fillStyle = o.color || "#1b2340"; g.fillText(text, 14, 38); }
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, opacity: o.opacity || 1 }));
  sp.scale.set(h * w / 72, h, 1); sp.center.set(0.5, 0); return sp;
}
const M = (col, o) => new THREE.MeshLambertMaterial(Object.assign({ color: col, flatShading: true }, o || {}));
function mesh(geo, mat, x, y, z){ const m = new THREE.Mesh(geo, mat); m.position.set(x || 0, y || 0, z || 0); return m; }
function buildBalloon(){
  const gr = new THREE.Group();
  const prof = [[0.7, 0], [1.7, 1.3], [3.0, 3.1], [3.7, 5.0], [3.4, 6.7], [2.3, 7.9], [0.01, 8.5]].map(p => new THREE.Vector2(p[0], p[1]));
  let geo = new THREE.LatheGeometry(prof, 16).toNonIndexed(); const pos = geo.attributes.position, col = new Float32Array(pos.count * 3), cA = new THREE.Color("#ff5d5d"), cB = new THREE.Color("#ffd23f"), cC = new THREE.Color("#ffffff");
  for(let i = 0; i < pos.count; i += 3){ const cx = (pos.getX(i) + pos.getX(i + 1) + pos.getX(i + 2)) / 3, cz = (pos.getZ(i) + pos.getZ(i + 1) + pos.getZ(i + 2)) / 3, cy = (pos.getY(i) + pos.getY(i + 1) + pos.getY(i + 2)) / 3;
    const seg = Math.floor(((Math.atan2(cz, cx) + Math.PI) / (2 * Math.PI)) * 16 + 0.0001) % 16, c = cy > 4.2 && cy < 5.9 ? (seg % 2 ? cC : cA) : seg % 2 ? cB : cA;
    for(let k = 0; k < 3; k++){ col[(i + k) * 3] = c.r; col[(i + k) * 3 + 1] = c.g; col[(i + k) * 3 + 2] = c.b; } }
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3)); geo.computeVertexNormals();
  gr.add(mesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide }), 0, 0, 0));
  gr.add(mesh(new THREE.BoxGeometry(1.5, 1.1, 1.5), M("#b77a45"), 0, -2.3, 0)); gr.add(mesh(new THREE.BoxGeometry(1.7, 0.25, 1.7), M("#8a5a2f"), 0, -1.75, 0));
  for(const [x, z] of [[-0.6, -0.6], [0.6, -0.6], [-0.6, 0.6], [0.6, 0.6]]){ const r = mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.1, 4), M("#5a4630"), x, -0.8, z); gr.add(r); }
  flame = mesh(new THREE.ConeGeometry(0.35, 1.1, 6), new THREE.MeshBasicMaterial({ color: 0xff9a2e }), 0, -0.7, 0); gr.add(flame);
  return gr;
}
function modelFor(v){
  const g = new THREE.Group(), red = M("#d9553f"), wall = M("#f1e2c6"), roof = M("#c8452f"), green = M("#63b34a"), grey = M("#9aa3ad");
  const kind = v.t === "m" ? "namai" : v.t === "v" ? v.m : v.t === "u" || v.t === "e" || v.t === "j" ? "banga" : "veliava";
  if(kind === "namai"){ const n = v.s === 1 ? 6 : v.s === 2 ? 5 : 3; for(let i = 0; i < n; i++){ const a = i / n * 6.28, r = i ? 1.7 : 0, h = 1 + ((i * 7) % 3) * 0.6 + (v.s < 3 ? 0.6 : 0); g.add(mesh(new THREE.BoxGeometry(1.1, h, 1.1), wall, Math.cos(a) * r, h / 2, Math.sin(a) * r)); const rf = mesh(new THREE.ConeGeometry(0.95, 0.8, 4), roof, Math.cos(a) * r, h + 0.4, Math.sin(a) * r); rf.rotation.y = Math.PI / 4; g.add(rf); }
    if(v.s === 1){ g.add(mesh(new THREE.CylinderGeometry(0.5, 0.6, 3.6, 8), red, 0, 1.8, 0)); g.add(mesh(new THREE.BoxGeometry(0.08, 1.4, 0.08), grey, 0, 4.2, 0)); g.add(mesh(new THREE.BoxGeometry(1, 0.6, 0.05), M("#ffd23f"), 0.5, 4.5, 0)); } }
  else if(kind === "pilis"){ g.add(mesh(new THREE.BoxGeometry(3, 1.4, 2.2), red, 0, 0.7, 0)); for(const [x, z] of [[-1.5, -1.1], [1.5, -1.1], [-1.5, 1.1], [1.5, 1.1]]){ g.add(mesh(new THREE.CylinderGeometry(0.55, 0.6, 2.6, 8), red, x, 1.3, z)); g.add(mesh(new THREE.ConeGeometry(0.75, 1, 8), roof, x, 3.1, z)); } }
  else if(kind === "kalva" || kind === "kryziai"){ const h = mesh(new THREE.SphereGeometry(2.6, 10, 6, 0, 6.3, 0, 1.57), green, 0, 0, 0); h.scale.y = 0.7; g.add(h);
    if(kind === "kryziai") for(const [x, z, s] of [[0, 0, 1.2], [-1, 0.5, 0.8], [1, -0.4, 0.9], [0.4, 0.9, 0.7]]){ g.add(mesh(new THREE.BoxGeometry(0.12, 1.4 * s, 0.12), M("#6b4a2b"), x, 1.6 + 0.4 * s, z)); g.add(mesh(new THREE.BoxGeometry(0.7 * s, 0.12, 0.12), M("#6b4a2b"), x, 1.9 + 0.6 * s, z)); }
    else { g.add(mesh(new THREE.BoxGeometry(0.1, 1.6, 0.1), grey, 0, 2.6, 0)); g.add(mesh(new THREE.BoxGeometry(0.9, 0.5, 0.05), M("#ffd23f"), 0.45, 3.1, 0)); } }
  else if(kind === "kopa"){ const d = mesh(new THREE.ConeGeometry(3, 2.2, 9), M("#f1d58a"), 0, 1.1, 0); g.add(d); const d2 = mesh(new THREE.ConeGeometry(2, 1.4, 8), M("#ecc873"), 2.2, 0.7, 1); g.add(d2); }
  else if(kind === "tiltas"){ g.add(mesh(new THREE.BoxGeometry(6, 0.25, 0.9), M("#b98a5e"), -2.5, 0.9, 0)); for(let i = 0; i < 4; i++) g.add(mesh(new THREE.BoxGeometry(0.2, 0.9, 0.2), M("#7a5a3a"), -0.5 - i * 1.5, 0.45, 0)); }
  else if(kind === "sodyba"){ g.add(mesh(new THREE.BoxGeometry(2.2, 1.1, 1.5), M("#a9743f"), 0, 0.55, 0)); const r = mesh(new THREE.ConeGeometry(1.7, 1.1, 4), M("#d9b45a"), 0, 1.65, 0); r.rotation.y = Math.PI / 4; r.scale.z = 0.75; g.add(r); g.add(mesh(new THREE.SphereGeometry(0.9, 7, 6), green, 2, 1.4, 0.4)); g.add(mesh(new THREE.CylinderGeometry(0.12, 0.12, 1, 5), M("#6b4a2b"), 2, 0.5, 0.4)); }
  else if(kind === "akmuo"){ const s = mesh(new THREE.DodecahedronGeometry(1.6, 0), grey, 0, 1.1, 0); s.scale.set(1.3, 0.8, 1); g.add(s); }
  else if(kind === "medis"){ g.add(mesh(new THREE.CylinderGeometry(0.5, 0.7, 2, 7), M("#6b4a2b"), 0, 1, 0)); g.add(mesh(new THREE.IcosahedronGeometry(2.1, 0), green, 0, 3.3, 0)); }
  else if(kind === "stulpas"){ g.add(mesh(new THREE.CylinderGeometry(0.3, 0.4, 3.4, 8), M("#ffffff"), 0, 1.7, 0)); g.add(mesh(new THREE.IcosahedronGeometry(0.6, 0), M("#ffd23f"), 0, 3.8, 0)); }
  else if(kind === "svyturys"){ for(let i = 0; i < 4; i++) g.add(mesh(new THREE.CylinderGeometry(0.55 - i * 0.05, 0.6 - i * 0.05, 0.9, 8), i % 2 ? M("#ffffff") : red, 0, 0.45 + i * 0.9, 0)); g.add(mesh(new THREE.ConeGeometry(0.6, 0.7, 8), grey, 0, 3.95, 0)); }
  else if(kind === "baznycia"){ g.add(mesh(new THREE.BoxGeometry(2.4, 1.6, 1.6), wall, 0, 0.8, 0)); g.add(mesh(new THREE.SphereGeometry(0.9, 8, 6, 0, 6.3, 0, 1.57), M("#7fb7a8"), 0, 1.6, 0)); for(const x of [-1, 1]){ g.add(mesh(new THREE.BoxGeometry(0.6, 2.8, 0.6), wall, x, 1.4, 0.7)); g.add(mesh(new THREE.ConeGeometry(0.5, 0.9, 4), M("#7fb7a8"), x, 3.2, 0.7)); } }
  else if(kind === "banga"){ const r = mesh(new THREE.TorusGeometry(2.6, 0.28, 6, 24), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 }), 0, 0.3, 0); r.rotation.x = Math.PI / 2; r.userData.pulse = 1; g.add(r); const r2 = r.clone(); r2.scale.setScalar(0.55); g.add(r2); }
  else { g.add(mesh(new THREE.CylinderGeometry(0.12, 0.12, 5, 6), grey, 0, 2.5, 0)); const f = mesh(new THREE.BoxGeometry(2.6, 1.6, 0.08), M(V.regionColor[v.id] || "#ff5d5d"), 1.35, 4.2, 0); g.add(f); }
  return g;
}
function initWorld(){
  if(ready) return true;
  const cv = $("gl");
  try { renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, powerPreference: "high-performance" }); } catch(e){ return false; }
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); renderer.outputColorSpace = THREE.SRGBColorSpace;
  scene = new THREE.Scene(); scene.background = new THREE.Color(SKY); scene.fog = new THREE.Fog(SKY, 600, 1900);
  camera = new THREE.PerspectiveCamera(50, 1, 2, 3200);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xb9d6a0, 1.25)); const sun = new THREE.DirectionalLight(0xfff3d6, 1.5); sun.position.set(-60, 120, 40); scene.add(sun);
  const map = paintMap(), tex = new THREE.CanvasTexture(map.canvas); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = renderer.capabilities.getMaxAnisotropy(); tex.generateMipmaps = true;
  ground = mesh(new THREE.PlaneGeometry(map.wKm, map.hKm), new THREE.MeshBasicMaterial({ map: tex }), wx((BX0 + BX1) / 2), 0, wz((BY0 + BY1) / 2)); ground.rotation.x = -Math.PI / 2; scene.add(ground);
  const out = mesh(new THREE.PlaneGeometry(4000, 4000), new THREE.MeshBasicMaterial({ color: 0xd9ecd0 }), 0, -0.4, 0); out.rotation.x = -Math.PI / 2; scene.add(out);
  const seaOut = mesh(new THREE.PlaneGeometry(2000, 4000), new THREE.MeshBasicMaterial({ color: 0x63b6f0 }), wx(BX0) - 1000, -0.3, 0); seaOut.rotation.x = -Math.PI / 2; scene.add(seaOut);
  balloon = buildBalloon(); balloon.scale.setScalar(BS); scene.add(balloon);
  shadow = mesh(new THREE.CircleGeometry(3.4 * BS, 24), new THREE.MeshBasicMaterial({ color: 0x1b2340, transparent: true, opacity: 0.22, depthWrite: false }), 0, 0.12, 0); shadow.rotation.x = -Math.PI / 2; scene.add(shadow);
  ring = mesh(new THREE.RingGeometry(RAD - 0.7, RAD, 56), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55, depthWrite: false, side: THREE.DoubleSide }), 0, 0.16, 0); ring.rotation.x = -Math.PI / 2; scene.add(ring);
  /* debesys (po balionu) */
  const cm = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.88, flatShading: true });
  for(let i = 0; i < 13; i++){ const g = new THREE.Group(), n = 3 + (i % 3); for(let k = 0; k < n; k++){ const s = mesh(new THREE.IcosahedronGeometry(2.4 + (k * 37 % 10) / 6, 1), cm, k * 3 - n * 1.5, (k % 2) * 0.8, (k * 53 % 7) / 3 - 1); s.scale.y = 0.55; g.add(s); } g.scale.setScalar(2.1);
    g.position.set(wx(BX0) + (i * 173) % 460, 7 + (i % 4), wz(BY1) + (i * 97) % 380); g.userData.v = 2.5 + (i % 3); scene.add(g); clouds.push(g); }
  /* paukščiai */
  const bm = new THREE.MeshBasicMaterial({ color: 0x2b345a, side: THREE.DoubleSide });
  for(let f = 0; f < 3; f++){ const g = new THREE.Group(); for(let i = 0; i < 5; i++){ const b = new THREE.Group(); for(const s of [-1, 1]){ const tri = new THREE.BufferGeometry(); tri.setAttribute("position", new THREE.BufferAttribute(new Float32Array([0, 0, 0, s * 1.1, 0, -0.35, s * 1.1, 0, 0.35]), 3)); const w = new THREE.Mesh(tri, bm); w.userData.s = s; b.add(w); } b.position.set(-Math.abs(i - 2) * 1.6, 0, (i - 2) * 1.5); b.userData.ph = i; g.add(b); }
    g.position.set(-200 + f * 130, 15, -120 + f * 90); g.scale.setScalar(2.2); g.userData = { vx: 13 + f * 3, vz: f === 1 ? 4 : -3 }; g.rotation.y = -Math.atan2(g.userData.vz, g.userData.vx); scene.add(g); birds.push(g); }
  /* užrašai */
  const add = (sp, lat, lon, y, grp, id) => { sp.position.set(wx(lon), y, wz(lat)); sp.userData = { grp, id, bx: sp.scale.x, by: sp.scale.y }; scene.add(sp); labels.push(sp); };
  for(const v of V.list){
    if(v.t === "m") add(labelSprite(nameOf(v.id), v.s === 1 ? 7 : v.s === 2 ? 6 : 4.6, { color: v.s === 1 ? "#b3261a" : "#1b2340" }), v.at[0] + 0.035, v.at[1], 0.6, "n", v.id);
    if(v.t === "u") add(labelSprite(nameOf(v.id), 4.6, { italic: 1, color: "#1b5fb8" }), v.at[0], v.at[1], 0.6, "n", v.id);
    if(v.t === "e") add(labelSprite(nameOf(v.id), 4.2, { italic: 1, color: "#1b5fb8" }), v.at[0] + 0.04, v.at[1], 0.6, "n", v.id);
    if(v.t === "v") add(labelSprite(nameOf(v.id), 4.0, { color: "#8a4b00" }), v.at[0] - 0.12, v.at[1], 0.6, "n", v.id);
    if(v.t === "r") add(labelSprite(T.regionLabels[v.id], 9.5, { color: "#2c5a1e", stroke: "rgba(255,255,255,.7)", opacity: 0.85 }), v.at[0], v.at[1], 0.4, "n", v.id);
    if(v.t === "k") add(labelSprite(T.mapLabels[v.c], 10, { color: "#8a7a5c", stroke: "rgba(255,255,255,.8)" }), v.at[0], v.at[1], 0.4, "n", v.id);
  }
  add(labelSprite(T.mapLabels.jura, 8.5, { italic: 1, color: "#fff", stroke: "#2a74cc" }), 55.75, 20.65, 0.4, "n", "baltija");
  add(labelSprite(T.mapLabels.marios, 3.8, { italic: 1, color: "#fff", stroke: "#2a74cc" }), 55.2, 21.12, 0.4, "n", "kursiumarios");
  beacon = mesh(new THREE.CylinderGeometry(2.2, 2.2, 90, 16, 1, true), new THREE.MeshBasicMaterial({ color: 0xffe14d, transparent: true, opacity: 0.45, depthWrite: false, side: THREE.DoubleSide }), 0, 45, 0); beacon.visible = false; scene.add(beacon);
  envelope = mesh(new THREE.BoxGeometry(1.9, 0.18, 1.3), new THREE.MeshBasicMaterial({ color: 0xffffff }), 0, 0, 0); envelope.visible = false; scene.add(envelope);
  const sm = new THREE.MeshBasicMaterial({ color: 0xffd23f });
  for(let i = 0; i < 22; i++){ const s = mesh(new THREE.OctahedronGeometry(0.7, 0), sm, 0, 0, 0); s.visible = false; scene.add(s); sparks.push(s); }
  /* mažasis žemėlapis */
  const mc = document.createElement("canvas"); mc.width = 192; mc.height = 160; const g = mc.getContext("2d"), s = 192 / ((BX1 - BX0) * KX);
  g.fillStyle = "#9fd3f5"; g.fillRect(0, 0, 192, 160);
  for(const a of ["LVA", "BLR", "POL", "RUS", "LTU"]) for(const p of K.land[a]){ g.beginPath(); p.forEach((q, i) => { const x = (q[0] - BX0) * KX * s, y = (BY1 - q[1]) * KY * s; i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.closePath(); g.fillStyle = a === "LTU" ? "#a8dc86" : "#efe6cf"; g.fill(); if(a === "LTU"){ g.strokeStyle = "#2f7d32"; g.lineWidth = 2; g.stroke(); } }
  miniBase = mc; miniS = s;
  resize(); ready = true; return true;
}
let miniBase, miniS;
function resize(){ if(!renderer) return; const w = window.innerWidth, h = window.innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
addEventListener("resize", resize);

/* ============================== skrydis ============================== */
let S = null, lastT = 0;
function pickCards(F){
  const A = album().cards, best = MK.best(GAME), sh = MK.shuffle;
  const pri = l => sh(l).sort((a, b) => (A[a.id] ? 1 : 0) - (A[b.id] ? 1 : 0));
  if(F.id === "s4") return sh(V.list.filter(v => v.t === "r").concat(pri(F.fill.map(id => BYID[id])).slice(0, F.n - 5)));
  if(F.id === "s6"){ const by = {}; F.types.forEach(t => { by[t] = pri(V.list.filter(v => v.t === t)); }); const out = []; let i = 0; const order = sh(F.types); while(out.length < F.n){ const t = order[i++ % order.length]; if(by[t].length) out.push(by[t].shift()); } return sh(out); }
  let pool = V.list.filter(v => F.types.includes(v.t)).concat((F.extra || []).map(id => BYID[id]));
  if(F.first && !best[F.id]){ const f = F.first.map(id => BYID[id]); return f.concat(pri(pool.filter(v => !F.first.includes(v.id))).slice(0, F.n - f.length)); }
  return sh(pri(pool).slice(0, F.n));
}
function start(F){
  $("app").hidden = true; $("game").hidden = false; MK.music.stop();
  if(!initWorld()){ $("game").hidden = true; $("app").hidden = false; alert("WebGL"); return; }
  markers.forEach(m => scene.remove(m)); markers = []; beacon.visible = false;
  S = { F, free: !F, cards: F ? pickCards(F) : [], ci: -1, pts: 0, first: 0, nolab: 0, newCards: 0, labels: F ? !F.noLabels : true, zoom: 0, x: wx(24.1), z: wz(55.2), vx: 0, vz: 0, ix: 0, iz: 0, tries: 0, busy: 0, wait: false, done: {}, t: 0, camZ: 0, hintT: 0, msgT: 0, keys: {} };
  $("bLab").hidden = S.free || (F && F.noLabels); $("bDrop").hidden = S.free; $("cNext").hidden = true; $("arrow").hidden = true; $("msg").innerHTML = "";
  $("tip").hidden = false; $("tip").textContent = matchMedia("(pointer:coarse)").matches ? T.hud.tipTouch : T.hud.tipKeys; S.tipT = 7;
  hudLabels(); resize();
  if(S.free){ setCard("free", T.hud.freeTitle, "", T.hud.freeTip, ""); } else nextCard();
  lastT = performance.now();
}
function setCard(icon, name, kind, fact, prog, ok){
  $("cIc").innerHTML = ICON[icon] || ICON.v; $("cName").textContent = name; $("cKind").textContent = kind; $("cFact").textContent = fact; $("cProg").textContent = prog;
  const c = $("card"); c.classList.toggle("ok", !!ok); c.classList.remove("pop"); void c.offsetWidth; c.classList.add("pop");
}
function nextCard(){
  S.ci++; S.tries = 0; S.wait = false; beacon.visible = false; $("arrow").hidden = true; $("cNext").hidden = true;
  if(S.ci >= S.cards.length){ report(); return; }
  const v = S.cards[S.ci]; S.cur = v; setCard(v.t, nameOf(v.id), T.hud.carry + " " + T.kinds[v.t].toLowerCase(), "", T.hud.of(S.ci + 1, S.cards.length)); $("bDrop").disabled = false; MK.sfx.whoosh();
}
function hudLabels(){ $("bLab").textContent = S.labels ? T.hud.labelsOn : T.hud.labelsOff; $("bLab").classList.toggle("on", S.labels); $("bZoom").textContent = S.zoom ? T.hud.zoomIn : T.hud.zoomOut; $("bExit").setAttribute("aria-label", T.hud.exit); $("dropL").textContent = T.hud.drop; $("cNext").textContent = T.hud.next; }
function say(text, cls, sec){ $("msg").innerHTML = `<span class="${cls || ""}">${text}</span>`; S.msgT = sec || 3.2; }
function drop(){
  if(!S || S.free || S.busy || S.wait || !S.cur) return;
  S.busy = 0.75; S.dropAt = { x: S.x, z: S.z }; envelope.visible = true; MK.sfx.whoosh(); $("tip").hidden = true;
}
function landed(){
  const lat = toLat(S.dropAt.z), lon = toLon(S.dropAt.x), v = S.cur; envelope.visible = false;
  if(hits(v, lat, lon)){
    const p = S.tries ? 1 : S.labels ? 2 : 3; S.pts += p; if(!S.tries) S.first++; if(!S.tries && !S.labels) S.nolab++;
    const A = album(); if(!A.cards[v.id]) S.newCards++; A.cards[v.id] = Math.max(A.cards[v.id] || 0, p === 3 ? 2 : 1); MK.set(CKEY, A);
    S.done[v.id] = 1; S.wait = true; beacon.visible = false; $("arrow").hidden = true; $("bDrop").disabled = true;
    const m = modelFor(v), area = v.t === "k" || v.t === "r" || v.t === "d" || v.t === "j" || v.t === "u";
    m.position.set(area ? S.dropAt.x : wx(v.at[1]), 0, area ? S.dropAt.z : wz(v.at[0])); m.scale.setScalar(0.01); m.userData.born = S.t; scene.add(m); markers.push(m);
    if(area || v.t === "d"){ const sign = labelSprite(nameOf(v.id), 3.1, { plate: "#fffdf3" }); sign.position.set(0, 6.6, 0); m.add(sign); }
    sparks.forEach((s, i) => { const a = i / sparks.length * 6.28; s.visible = true; s.position.set(m.position.x, 1, m.position.z); s.userData = { vx: Math.cos(a) * (12 + i % 5 * 3), vz: Math.sin(a) * (12 + i % 5 * 3), vy: 30 + (i % 4) * 6, t: 0 }; s.scale.setScalar(2); });
    MK.sfx.good(); setTimeout(() => MK.sfx.coins(), 220);
    setCard(v.t, nameOf(v.id), MK.pick(T.fb.ok) + " " + T.fb.pts(p), factOf(v.id), T.hud.of(S.ci + 1, S.cards.length), true); $("cNext").hidden = false;
    if(p === 2 && S.ci === 0) say(T.fb.okLabels, "good", 4.5); else $("msg").innerHTML = "";
  } else {
    S.tries++; MK.sfx.bad(); const b = bearing(lat, lon, v.at), dir = T.dirs[Math.round(b.ang / (Math.PI / 4) + 8) % 8], area = v.t === "k" || v.t === "r" || v.t === "d" || v.t === "j";
    say(describe(lat, lon) + " " + (S.tries >= 2 ? T.fb.beacon : area ? T.fb.hintArea(dir) : T.fb.hint(dir, Math.max(10, Math.round(b.km / 10) * 10))), "bad", 6);
    $("arrow").hidden = false; S.hintT = 7;
    if(S.tries >= 2){ beacon.visible = true; beacon.position.set(wx(v.at[1]), 45, wz(v.at[0])); }
  }
}
function report(){
  const n = S.cards.length, r = S.pts / (n * 3), st = r >= 0.8 ? 3 : r >= 0.5 ? 2 : 1; MK.best(GAME, S.F.id, st); S.cur = null; S.wait = true; $("bDrop").disabled = true;
  if(st >= 2) MK.sfx.win(); if(st === 3) MK.confetti && MK.confetti(60);
  const R = T.rep;
  $("ov").innerHTML = `<div class="rc" role="dialog"><h3>${R.title}</h3><div class="st">${[0, 1, 2].map(k => STAR(k < st)).join("")}</div><p>${R.line[st - 1]}</p><p>${R.delivered(n)}<br>${R.first(S.first)}<br>${R.noLabels(S.nolab)}</p>${S.newCards ? `<p><b>${R.newCards(S.newCards)}</b></p>` : ""}<div class="bt"><button class="pri" type="button" data-a="again">${R.again}</button><button type="button" data-a="menu">${R.menu}</button></div></div>`;
}
$("ov").addEventListener("click", e => { const b = e.target.closest("[data-a]"); if(!b) return; MK.sfx.tap(); const F = S && S.F; $("ov").innerHTML = ""; if(b.dataset.a === "again" && F) start(F); else showMenu(); });

/* ============================== valdymas ============================== */
const stick = $("stick"); let sp = null;
$("gl").addEventListener("pointerdown", e => { if(!S) return; sp = { id: e.pointerId, x: e.clientX, y: e.clientY }; stick.style.display = "block"; stick.style.left = e.clientX + "px"; stick.style.top = e.clientY + "px"; stick.firstElementChild.style.transform = ""; try { $("gl").setPointerCapture(e.pointerId); } catch(_){} $("tip").hidden = true; });
$("gl").addEventListener("pointermove", e => { if(!sp || e.pointerId !== sp.id || !S) return; let dx = e.clientX - sp.x, dy = e.clientY - sp.y; const l = Math.hypot(dx, dy), m = 52; if(l > m){ dx *= m / l; dy *= m / l; } S.ix = dx / m; S.iz = dy / m; stick.firstElementChild.style.transform = `translate(${dx}px,${dy}px)`; });
const endStick = e => { if(sp && e.pointerId === sp.id){ sp = null; stick.style.display = "none"; if(S){ S.ix = 0; S.iz = 0; } } };
["pointerup", "pointercancel", "lostpointercapture"].forEach(ev => $("gl").addEventListener(ev, endStick));
$("bDrop").addEventListener("pointerdown", e => { e.preventDefault(); drop(); });
$("cNext").addEventListener("click", () => { MK.sfx.tap(); nextCard(); });
$("bLab").addEventListener("click", () => { if(!S) return; S.labels = !S.labels; MK.sfx.tap(); hudLabels(); });
$("bZoom").addEventListener("click", () => { if(!S) return; S.zoom = S.zoom ? 0 : 1; MK.sfx.tap(); hudLabels(); });
$("bExit").addEventListener("click", () => { MK.sfx.tap(); showMenu(); });
const KEYS = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1], a: [-1, 0], d: [1, 0], w: [0, -1], s: [0, 1] };
addEventListener("keydown", e => { if(!S) return; if(KEYS[e.key]){ e.preventDefault(); S.keys[e.key] = 1; } else if(e.key === " " || e.key === "Enter"){ e.preventDefault(); if(e.repeat) return; if($("ov").innerHTML){ const b = $("ov").querySelector(".pri"); b && b.click(); } else if(S.wait && !$("cNext").hidden) nextCard(); else drop(); } else if(e.key === "Escape") showMenu(); });
addEventListener("keyup", e => { if(S && KEYS[e.key]) delete S.keys[e.key]; });

/* ============================== kadras ============================== */
function frame(now){
  requestAnimationFrame(frame); if(!S || !ready) return;
  const dt = Math.min(0.05, (now - lastT) / 1000 || 0); lastT = now; S.t += dt;
  let ix = S.ix, iz = S.iz; for(const k in S.keys){ ix += KEYS[k][0]; iz += KEYS[k][1]; } const l = Math.hypot(ix, iz); if(l > 1){ ix /= l; iz /= l; }
  const VM = 46, resp = l > 0.05 ? 3.2 : 6; S.vx += (ix * VM - S.vx) * Math.min(1, dt * resp); S.vz += (iz * VM - S.vz) * Math.min(1, dt * resp);
  S.x = Math.max(wx(BX0) + 6, Math.min(wx(BX1) - 6, S.x + S.vx * dt)); S.z = Math.max(wz(BY1) + 6, Math.min(wz(BY0) - 6, S.z + S.vz * dt));
  const bob = Math.sin(S.t * 1.6) * 0.5; balloon.position.set(S.x, ALT + bob, S.z); balloon.rotation.z = -S.vx * 0.005; balloon.rotation.x = S.vz * 0.005;
  flame.scale.y = 0.7 + Math.abs(Math.sin(S.t * 17)) * 0.6 + Math.hypot(S.vx, S.vz) / VM; shadow.position.set(S.x + 3, 0.12, S.z + 2); ring.position.set(S.x, 0.16, S.z); ring.visible = !S.free && !S.wait; ring.material.opacity = 0.4 + 0.2 * Math.sin(S.t * 4);
  /* kamera – visada žiūri į šiaurę */
  const zf = S.zoom ? 1.9 : 1; if(!S.camZ) S.camZ = zf; S.camZ += (zf - S.camZ) * Math.min(1, dt * 3);
  const hf = Math.atan(Math.tan(25 * Math.PI / 180) * camera.aspect), d = Math.max(92 / (2 * Math.tan(hf)), 150) * S.camZ, ls = Math.pow(S.camZ, 0.8) * (camera.aspect > 1 ? 1.25 : 1);
  camera.position.set(S.x, d * 0.8, S.z + d * 0.6); camera.lookAt(S.x, 0, S.z - d * 0.07);
  /* nuleista atvirutė */
  if(S.busy > 0){ S.busy -= dt; const q = 1 - Math.max(0, S.busy) / 0.75; envelope.position.set(S.dropAt.x, (ALT - 6) * (1 - q * q), S.dropAt.z); envelope.scale.setScalar(1.8); envelope.rotation.set(q * 9, q * 5, 0); if(S.busy <= 0){ S.busy = 0; landed(); } }
  /* debesys, paukščiai, ženklai, kibirkštys */
  for(const c of clouds){ c.position.x += c.userData.v * dt; if(c.position.x > wx(BX1) + 30) c.position.x = wx(BX0) - 30; }
  for(const f of birds){ f.position.x += f.userData.vx * dt; f.position.z += f.userData.vz * dt; if(f.position.x > 260){ f.position.x = -260; f.position.z = -150 + Math.random() * 300; } for(const b of f.children) for(const w of b.children) w.rotation.z = w.userData.s * Math.sin(S.t * 9 + b.userData.ph) * 0.6; }
  for(const m of markers){ const a = Math.min(1, (S.t - m.userData.born) / 0.5), s = a < 1 ? 2.3 * (1 + 0.35 * Math.sin(a * Math.PI)) * a : 2.3; m.scale.setScalar(Math.max(0.01, s)); m.traverse(o => { if(o.userData.pulse){ const p = (S.t * 0.8) % 1; o.scale.setScalar(0.5 + p * 0.9); o.material.opacity = 0.9 * (1 - p); } }); }
  for(const s of sparks) if(s.visible){ const u = s.userData; u.t += dt; u.vy -= 60 * dt; s.position.x += u.vx * dt; s.position.y += u.vy * dt; s.position.z += u.vz * dt; s.rotation.y += dt * 8; if(u.t > 1.1 || s.position.y < 0) s.visible = false; }
  if(beacon.visible) beacon.material.opacity = 0.3 + 0.2 * Math.sin(S.t * 6);
  for(const sp of labels){ const lt = BYID[sp.userData.id].t; sp.visible = S.free || !!S.done[sp.userData.id] || (S.labels && ((lt !== "v" && lt !== "e") || S.F.types.includes(lt))); sp.scale.set(sp.userData.bx * ls, sp.userData.by * ls, 1); }
  /* užuominos rodyklė */
  if(S.hintT > 0 && S.cur){ S.hintT -= dt; const b = bearing(toLat(S.z), toLon(S.x), S.cur.at); $("arrG").setAttribute("transform", `rotate(${b.ang * 180 / Math.PI})`); if(S.hintT <= 0 && S.tries < 2) $("arrow").hidden = true; }
  if(S.msgT > 0){ S.msgT -= dt; if(S.msgT <= 0) $("msg").innerHTML = ""; }
  if(S.tipT > 0){ S.tipT -= dt; if(S.tipT <= 0) $("tip").hidden = true; }
  /* laisvas skrydis: kas po balionu */
  if(S.free){ const lat = toLat(S.z), lon = toLon(S.x); let b = null, bd = 13; for(const v of V.list){ if(v.t !== "m" && v.t !== "v" && v.t !== "e") continue; const d = kmDist(v.at, [lat, lon]); if(d < bd){ bd = d; b = v; } }
    if(!b) for(const v of V.list) if(v.t === "u" && riverDist(v.r, lat, lon) < 5){ b = v; break; }
    const id = b ? b.id : zoneAt(lon, lat) !== "LTU" ? V.list.find(v => (v.t === "k" && v.c === zoneAt(lon, lat)) || (v.t === "j" && v.z === zoneAt(lon, lat))).id : regionAt(lon, lat);
    if(id !== S.freeId){ S.freeId = id; const v = BYID[id]; setCard(v.t, nameOf(id), T.kinds[v.t], factOf(id), ""); } }
  /* mažasis žemėlapis */
  const mg = $("mini").getContext("2d"); mg.drawImage(miniBase, 0, 0); const mx = (toLon(S.x) - BX0) * KX * miniS, my = (BY1 - toLat(S.z)) * KY * miniS;
  mg.fillStyle = "#e2452f"; mg.strokeStyle = "#fff"; mg.lineWidth = 3; mg.beginPath(); mg.arc(mx, my, 7, 0, 7); mg.fill(); mg.stroke();
  mg.fillStyle = "#1b2340"; mg.font = "900 20px sans-serif"; mg.fillText(T.hud.north, 168, 40); mg.beginPath(); mg.moveTo(175, 4); mg.lineTo(182, 18); mg.lineTo(168, 18); mg.closePath(); mg.fill();
  renderer.render(scene, camera);
}

/* ============================== paleidimas ============================== */
$("app").prepend(MK.top({ title: T.title, grade: 3 }));
$("h1").textContent = T.h1; $("lead").textContent = T.lead; $("flT").textContent = T.flightsT; $("albT").textContent = T.albumT; $("lrT").textContent = T.learnT;
$("lr").innerHTML = T.learn.map(m => `<details class="lr"><summary>${m.name}</summary>${m.html}</details>`).join("");
window.__bl = { get S(){ return S; }, V, K, hits, describe, regionAt, zoneAt, countryAt, riverDist, kmDist, wx, wz, toLat, toLon, drop, nextCard, pickCards, BYID };
showMenu(); requestAnimationFrame(frame);
