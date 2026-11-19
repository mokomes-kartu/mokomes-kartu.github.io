/* Slibino sala, 2 pasaulis – „Kalno požemis“: požemio statyba (du aukštai: senosios kasyklos viršuje ir gelmių urvai apačioje, sujungti Didžiąja šachta).
   Viskas piešiama kodu (savi modeliai). Susidūrimai: uolos – per groundAt (uola = neperžengiamas aukštis), daiktai – apskritimai / dėžės. */
import * as THREE from "../three.module.min.js";
import { glowTex } from "../sala-pasaulis.js";

export const C = 6, YU = 70, YD = 0;
/* viršutinis aukštas: S pradžia, T žibintuvėlis, K kurmis, G nykštukas, 1 2 4 – runų skrynios, m – šviečiantys grybai, w – voratinklis, Q – vorų karalienė, s – vorai, O – šachta, L – keltuvas; , – tamsa */
const UP = [
  "############################",
  "#....#######################",
  "#.S..#######,,,m,,,#########",
  "#..T...K...,,#####,#########",
  "#....#.#####,#####,###,,,,,#",
  "######.#####1#####,###,s,s,#",
  "######.###########m###,,Q,,#",
  "####G..###########,###,s4s,#",
  "######.###########,###,,,,,#",
  "######.###########,#####,###",
  "######.........,,,,,w,,,,###",
  "##########.####w############",
  "##########.####m############",
  "#####......####2############",
  "#####.OOO..#################",
  "#####.OOO..#################",
  "#####.OOO..#################",
  "#####.....L#################",
  "############################",
  "############################"
];
/* apatinis aukštas: 5 – runa ant aikštelės, L – keltuvas, R – gremlinas, B – gremlino vartai, C – princesės narvas, 6 – skrynia, D – runų vartai, X – juodasis slibinas, ~ – lava */
const DN = [
  "############################",
  "#############.......########",
  "#############.......########",
  "#############...X...########",
  "#############.......########",
  "################D###########",
  "####......,,,,,,,,,,,,######",
  "####.C..####,########,######",
  "####....####,########6######",
  "############B###############",
  "#########.R..,##############",
  "#############,##############",
  "###~~~~~~~~~#,##############",
  "###~~~~~~~~~#,##############",
  "###~~~~~~~~~#,##############",
  "###~~~~5.....L##############",
  "###~~~~~~~~~################",
  "###~~~~~~~~~################",
  "###~~~~~~~~~################",
  "############################"
];
const NI = 28, NJ = 20;
const hash3 = (x, y, z) => { let h = Math.imul(Math.round(x * 10) | 0, 374761393) ^ Math.imul(Math.round(y * 10) | 0, 668265263) ^ Math.imul(Math.round(z * 10) | 0, 2147483647 % 1000003); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const cx = i => (i + 0.5) * C;
const lam = (col, o) => new THREE.MeshLambertMaterial(Object.assign({ color: col, flatShading: true }, o || {}));
const glowS = (col, s) => { const g = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), color: col, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); g.scale.set(s, s, 1); return g; };

export function buildCave(scene, Q){
  const low = Q === "low";
  const W = { anim: [], flags: {}, cols: [], poi: { mush: [], spiders: [], webs: [], lamps: [] }, C, YU, YD, NI, NJ, UP, DN };
  const at = (M, i, j) => (j < 0 || j >= NJ || i < 0 || i >= NI) ? "#" : M[j][i];
  const underHole = (i, j) => at(UP, i, j) === "O";
  const openCh = ch => ch !== "#";
  /* ---------- žymės ---------- */
  const find = (M, ch) => { const r = []; for(let j = 0; j < NJ; j++) for(let i = 0; i < NI; i++) if(M[j][i] === ch) r.push([i, j]); return r; };
  const P1 = (M, ch) => { const [i, j] = find(M, ch)[0]; return [cx(i), cx(j), i, j]; };
  const p = W.poi;
  p.start = P1(UP, "S"); p.torch = P1(UP, "T"); p.mole = P1(UP, "K"); p.gnome = P1(UP, "G"); p.queen = P1(UP, "Q"); p.liftU = P1(UP, "L");
  p.chest = { r1: P1(UP, "1"), r2: P1(UP, "2"), r4: P1(UP, "4"), r6: P1(DN, "6") };
  p.mush = find(UP, "m").map(([i, j]) => [cx(i), cx(j)]); p.spiders = find(UP, "s").map(([i, j]) => [cx(i), cx(j)]);
  p.webs = find(UP, "w").map(([i, j]) => ({ i, j, x: cx(i), z: cx(j), id: "w" + i + "_" + j }));
  p.rune5 = P1(DN, "5"); p.liftD = P1(DN, "L"); p.gremlin = P1(DN, "R"); p.bgate = P1(DN, "B"); p.cage = P1(DN, "C"); p.rgate = P1(DN, "D"); p.dragon = P1(DN, "X"); p.dragon[1] = cx(1) + 1;
  const holes = find(UP, "O"); p.shaft = [cx(7), cx(15)];
  W.start = [p.start[0], p.start[1]];
  /* tamsios vietos: kablelis ir daiktai tamsiuose tuneliuose */
  const DARKU = new Set(["1", "m", "2", "4", "s", "Q", "w"]);
  const isDark = (up, ch) => ch === "," || (up && DARKU.has(ch)) || (!up && ch === "6");
  /* ---------- aukščiai ---------- */
  const ceilH = (up, i, j) => up ? ((i >= 22 && j >= 4 && j <= 8) ? 10 : (i >= 5 && i <= 10 && j >= 13 && j <= 17) ? 11 : (i <= 4 && j <= 4) ? 9 : 6.5)
    : (j <= 4 ? 15 : (j >= 12 && i <= 11) ? 16 : (j >= 6 && j <= 8 && i <= 9) ? 10 : 6.5);
  /* ---------- susidūrimai ---------- */
  const deepG = (i, j) => { const ch = at(DN, i, j); if(ch === "#") return 999; if(ch === "~") return -1.5; if((ch === "D" && !W.flags.rgate) || (ch === "B" && !W.flags.bgate)) return 999; return YD; };
  W.groundAt = (x, z, feet, step) => {
    const i = Math.floor(x / C), j = Math.floor(z / C);
    let g;
    if(feet > 35){ const ch = at(UP, i, j); if(ch === "#") return 999; if(ch === "O"){ if(!W.flags.chute) return 999; g = deepG(i, j); } else if(ch === "w" && !W.flags["w" + i + "_" + j]) return 999; else g = YU; }
    else { if(feet > 16.5 && !underHole(i, j)) return 999; g = deepG(i, j); }
    for(const o of W.cols) if(o.on && o.t === "b" && x >= o.x0 && x <= o.x1 && z >= o.z0 && z <= o.z1 && o.y1 <= feet + step && o.y1 > g) g = o.y1;
    return g;
  };
  W.near = () => W.cols;
  W.addCircle = (x, z, r, y0, y1, tag) => { const o = { t: "c", x, z, r, y0, y1, x0: x - r, x1: x + r, z0: z - r, z1: z + r, tag, on: true }; W.cols.push(o); return o; };
  W.addBox = (x0, x1, y0, y1, z0, z1, tag) => { const o = { t: "b", x0, x1, y0, y1, z0, z1, tag, on: true }; W.cols.push(o); return o; };
  W.cell = (x, z, feet) => { const i = Math.floor(x / C), j = Math.floor(z / C), up = feet > 35, ch = at(up ? UP : DN, i, j); return { i, j, up, ch, dark: isDark(up, ch), hole: up && ch === "O" }; };
  W.terrain = (x, z) => W.groundAt(x, z, 999, 999);

  /* ---------- šviesos šaltiniai (įkepami į viršūnių spalvas) ---------- */
  const L = [];   /* [x, y, z, spindulys, stiprumas, r, g, b] */
  const addL = (x, y, z, r, k, col) => { const c = new THREE.Color(col); L.push([x, y, z, r, k, c.r, c.g, c.b]); };
  const lampAt = (i, j, up) => { const x = cx(i), z = cx(j), y = (up ? YU : YD) + ceilH(up, i, j) - 1.3; addL(x, y - 1, z, 15, 1.0, "#ffd9a0"); p.lamps.push([x, y, z]); };
  for(let j = 0; j < NJ; j++) for(let i = 0; i < NI; i++){
    for(const up of [true, false]){ const ch = at(up ? UP : DN, i, j); if(!openCh(ch) || ch === "~" || ch === "O" || isDark(up, ch)) continue; if((i + j * 2) % 3 === 0) lampAt(i, j, up); }
    if(DN[j][i] === "~" && (i + j) % 2 === 0) addL(cx(i), -1, cx(j), 17, 0.75, "#ff6a2a");
  }
  for(const [x, z] of p.mush) addL(x, YU + 0.6, z, 7, 0.7, "#6ff0c0");
  addL(p.rune5[0], 1, p.rune5[1], 9, 0.9, "#9fe8ff"); addL(p.cage[0], 3, p.cage[1], 12, 0.7, "#e8c8ff"); addL(p.rgate[0], 3, p.rgate[1] + 4, 9, 0.5, "#9fe8ff");
  const shade = (x, y, z, dark, base) => {
    let r = dark ? 0.07 : 0.2, g = r, b = dark ? 0.085 : 0.2;
    for(const l of L){ const d = Math.hypot(x - l[0], (y - l[1]) * 1.3, z - l[2]); if(d < l[3]){ const k = l[4] * (1 - d / l[3]) * (1 - d / l[3]); r += k * l[5]; g += k * l[6]; b += k * l[7]; } }
    r = Math.min(1.25, r); g = Math.min(1.25, g); b = Math.min(1.25, b);
    return base ? [base.r * r, base.g * g, base.b * b] : [r, g, b];
  };
  /* ---------- geometrija: grindys, lubos, sienos ---------- */
  const pos = [], col = [], bake = [];
  const dv = (x, y, z, k) => [x + (hash3(x, y, z) - 0.5) * k, y + (hash3(z, x, y) - 0.5) * k * 0.6, z + (hash3(y, z, x) - 0.5) * k];
  /* keturkampis tinklelis: p0 + u*s + v*t; rough – paviršiaus nelygumas */
  function grid(p0, u, v, nu, nv, base, dark, rough, flip){
    const pt = (a, b) => { const x = p0[0] + u[0] * a / nu + v[0] * b / nv, y = p0[1] + u[1] * a / nu + v[1] * b / nv, z = p0[2] + u[2] * a / nu + v[2] * b / nv; return dv(x, y, z, (Math.abs(y - YU) < 0.01 || Math.abs(y - YD) < 0.01) ? 0.16 : rough ? 0.6 : 0); };
    for(let a = 0; a < nu; a++) for(let b = 0; b < nv; b++){
      const q = [pt(a, b), pt(a + 1, b), pt(a + 1, b + 1), pt(a, b + 1)], tri = flip ? [0, 2, 1, 0, 3, 2] : [0, 1, 2, 0, 2, 3];
      const tone = 0.82 + hash3(q[0][0], q[0][1] + 3, q[0][2]) * 0.36;
      for(const k of tri){ const w = q[k]; pos.push(w[0], w[1], w[2]); const s = shade(w[0], w[1], w[2], dark, null); col.push(base.r * tone, base.g * tone, base.b * tone); bake.push(s[0], s[1], s[2]); }
    }
  }
  const ROCKU = new THREE.Color("#b09a84"), FLOORU = new THREE.Color("#9c8a76"), ROCKD = new THREE.Color("#8d8fb0"), FLOORD = new THREE.Color("#7f819c");
  for(const up of [true, false]){
    const M = up ? UP : DN, y0 = up ? YU : YD, rock = up ? ROCKU : ROCKD, floor = up ? FLOORU : FLOORD;
    for(let j = 0; j < NJ; j++) for(let i = 0; i < NI; i++){
      const ch = M[j][i]; if(!openCh(ch)) continue;
      const dark = isDark(up, ch), H = ceilH(up, i, j), x0 = i * C, z0 = j * C, lava = ch === "~", hole = ch === "O";
      if(!lava && !hole) grid([x0, y0, z0], [C, 0, 0], [0, 0, C], 2, 2, floor, dark, 0.16, true);
      if(!(up ? false : underHole(i, j))) grid([x0, y0 + H, z0], [C, 0, 0], [0, 0, C], 2, 2, rock, dark, 0.9, false);
      for(const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]){
        const nch = at(M, i + di, j + dj), nOpen = openCh(nch), nH = nOpen ? ceilH(up, i + di, j + dj) : 0;
        const a = di === 1 ? [x0 + C, z0] : di === -1 ? [x0, z0 + C] : dj === 1 ? [x0 + C, z0 + C] : [x0, z0], u = di === 1 ? [0, 0, C] : di === -1 ? [0, 0, -C] : dj === 1 ? [-C, 0, 0] : [C, 0, 0];
        const yb = lava ? y0 - 2 : y0;
        if(!nOpen) grid([a[0], yb, a[1]], u, [0, H - (yb - y0), 0], 3, Math.max(3, Math.round(H / 2.2)), rock, dark, 0.55, false);
        else { if(nH < H - 0.1) grid([a[0], y0 + nH, a[1]], u, [0, H - nH, 0], 3, 2, rock, dark, 0.5, false);
          if(lava && nch !== "~") grid([a[0], y0 - 2, a[1]], u, [0, 2, 0], 3, 1, rock, false, 0.3, false);
          if(hole && nch !== "O") grid([a[0], y0 - 3, a[1]], u, [0, 3, 0], 3, 1, rock, false, 0.3, false); }
      }
    }
  }
  /* šachtos sienos nuo apatinės salės lubų iki viršutinio aukšto grindų */
  for(const [i, j] of holes) for(const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]){ if(underHole(i + di, j + dj)) continue; const x0 = i * C, z0 = j * C;
    const a = di === 1 ? [x0 + C, z0] : di === -1 ? [x0, z0 + C] : dj === 1 ? [x0 + C, z0 + C] : [x0, z0], u = di === 1 ? [0, 0, C] : di === -1 ? [0, 0, -C] : dj === 1 ? [-C, 0, 0] : [C, 0, 0];
    grid([a[0], YD + 16, a[1]], u, [0, YU - 3 - 16, 0], 3, 12, ROCKD, true, 0.7, false); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3)); geo.setAttribute("bake", new THREE.Float32BufferAttribute(bake, 3)); geo.computeVertexNormals();
  /* uolos: įkepta žibintų šviesa (bake) + tikros šviesos (žibintuvėlis); bendra aplinkos šviesa uoloms netaikoma, kad tamsūs tuneliai liktų tamsūs */
  const rockMat = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true });
  rockMat.onBeforeCompile = sh => {
    sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nattribute vec3 bake;\nvarying vec3 vBake;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvBake = bake;");
    sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec3 vBake;").replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\ntotalEmissiveRadiance += diffuseColor.rgb * vBake;").replace("#include <aomap_fragment>", "reflectedLight.indirectDiffuse = vec3(0.0);\n#include <aomap_fragment>");
  };
  const rockMesh = new THREE.Mesh(geo, rockMat); scene.add(rockMesh); W.rock = rockMesh;
  /* ---------- lava ---------- */
  { const lg = [], lc = []; for(let j = 0; j < NJ; j++) for(let i = 0; i < NI; i++) if(DN[j][i] === "~"){ const x0 = i * C, z0 = j * C; lg.push(x0, -1.4, z0, x0, -1.4, z0 + C, x0 + C, -1.4, z0 + C, x0, -1.4, z0, x0 + C, -1.4, z0 + C, x0 + C, -1.4, z0); }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(lg, 3));
    const cv = document.createElement("canvas"); cv.width = cv.height = 128; const c2 = cv.getContext("2d"); c2.fillStyle = "#ff5a1a"; c2.fillRect(0, 0, 128, 128);
    for(let k = 0; k < 60; k++){ c2.fillStyle = ["#ffb347", "#ffd66b", "#c9300a", "#ff8a2a"][k % 4]; c2.beginPath(); c2.ellipse(hash3(k, 1, 2) * 128, hash3(k, 5, 1) * 128, 6 + hash3(k, 2, 7) * 16, 3 + hash3(k, 9, 3) * 7, hash3(k, 4, 4) * 3, 0, 7); c2.fill(); }
    const tex = new THREE.CanvasTexture(cv); tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    const uv = []; for(let k = 0; k < lg.length; k += 3) uv.push(lg[k] / 14, lg[k + 2] / 14); g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ map: tex, fog: true })); scene.add(m);
    W.anim.push(t => { tex.offset.set(t * 0.012, Math.sin(t * 0.3) * 0.03); }); }
  /* ---------- žibintai, stalaktitai, kristalai ---------- */
  const lampG = new THREE.Group(); scene.add(lampG);
  { const body = new THREE.CylinderGeometry(0.16, 0.22, 0.42, 6), bm = new THREE.MeshBasicMaterial({ color: "#ffe2a8" }), cm = lam("#3a2f2a");
    for(const [x, y, z] of p.lamps){ const b = new THREE.Mesh(body, bm); b.position.set(x, y, z); lampG.add(b); const c = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.3, 4), cm); c.position.set(x, y + 0.85, z); lampG.add(c); const gl = glowS("#ffcf8a", 3.4); gl.position.set(x, y, z); lampG.add(gl); } }
  { const cone = new THREE.ConeGeometry(0.34, 1.6, 5), list = [];
    for(const up of [true, false]){ const M = up ? UP : DN; for(let j = 0; j < NJ; j++) for(let i = 0; i < NI; i++){ const ch = M[j][i]; if(!openCh(ch) || ch === "O" || (!up && underHole(i, j))) continue; const n = low ? 1 : 3;
      for(let k = 0; k < n; k++){ if(hash3(i, j, k + (up ? 9 : 0)) < 0.45) continue; const x = i * C + 0.6 + hash3(i, k, j) * 4.8, z = j * C + 0.6 + hash3(j, i, k) * 4.8, s = 0.6 + hash3(k, i, j) * 1.5; list.push([x, (up ? YU : YD) + ceilH(up, i, j) - 0.8 * s + 0.2, z, s, isDark(up, ch), up]); } } }
    const im = new THREE.InstancedMesh(cone, new THREE.MeshLambertMaterial({ flatShading: true }), list.length), mm = new THREE.Matrix4(), q = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI, 0, 0)), cc = new THREE.Color();
    list.forEach(([x, y, z, s, dark, up], k) => { mm.compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(s, s, s)); im.setMatrixAt(k, mm); const sh = shade(x, y, z, dark, up ? ROCKU : ROCKD); cc.setRGB(sh[0], sh[1], sh[2]); im.setColorAt(k, cc); });
    scene.add(im); }
  const crystalAt = (x, y, z, colr, n, s) => { const g = new THREE.Group(); for(let k = 0; k < n; k++){ const m = new THREE.Mesh(new THREE.OctahedronGeometry(0.3, 0), new THREE.MeshLambertMaterial({ color: colr, emissive: colr, emissiveIntensity: 0.8, flatShading: true })); m.scale.set(s * (0.6 + hash3(x, k, z) * 0.6), s * (1.4 + hash3(k, x, z) * 1.6), s * 0.7); m.position.set((hash3(k, z, x) - 0.5) * 1.4 * s, 0.3 * s, (hash3(z, k, x) - 0.5) * 1.4 * s); m.rotation.set((hash3(k, 1, x) - 0.5) * 0.7, hash3(k, 2, z) * 3, (hash3(k, 3, z) - 0.5) * 0.7); g.add(m); } const gl = glowS(colr, 3.2 * s); gl.position.y = 0.6; g.add(gl); g.position.set(x, y, z); scene.add(g); return g; };
  for(let j = 0; j < NJ; j++) for(let i = 0; i < NI; i++){ if(DN[j][i] !== "#" && DN[j][i] !== "~" && hash3(i, 7, j) < 0.3 && !isDark(false, DN[j][i])) crystalAt(i * C + 0.9, YD, j * C + 0.9, ["#7fe8ff", "#c79bff", "#8dffc4"][(i + j) % 3], 3, 0.9); }
  /* ---------- daiktų ir veikėjų modeliai ---------- */
  const M_ = { wood: lam("#8a5a2b"), wood2: lam("#6f4520"), metal: lam("#c9a23f"), iron: lam("#59606b"), skin: lam("#f2c9a0"), red: lam("#d8443a"), white: lam("#f4f1ea"), dark: lam("#2a2530"), green: lam("#5fae4a"), blue: lam("#3f78d8"), fur: lam("#5b4a42"), pink: lam("#f29bb8"), gold: lam("#ffd23a", { emissive: "#a87400", emissiveIntensity: 0.35 }) };
  const mesh = (g, m, x, y, z, par) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); (par || scene).add(o); return o; };
  const eyes = (g, y, z, dx, r) => { for(const s of [-1, 1]){ mesh(new THREE.SphereGeometry(r, 8, 6), new THREE.MeshBasicMaterial({ color: "#fff" }), s * dx, y, z, g); mesh(new THREE.SphereGeometry(r * 0.5, 6, 5), new THREE.MeshBasicMaterial({ color: "#121a33" }), s * dx, y, z + r * 0.7, g); } };
  function chest(id, x, z, y, rot, colr){
    const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = rot || 0;
    mesh(new THREE.BoxGeometry(1.4, 0.8, 0.9), M_.wood2, 0, 0.4, 0, g); for(const bx of [-0.45, 0.45]) mesh(new THREE.BoxGeometry(0.12, 0.84, 0.94), M_.metal, bx, 0.4, 0, g);
    const lid = new THREE.Group(); lid.position.set(0, 0.8, -0.45); g.add(lid); const l = mesh(new THREE.CylinderGeometry(0.45, 0.45, 1.4, 8, 1, false, 0, Math.PI), M_.wood, 0, 0, 0.45, lid); l.rotation.z = Math.PI / 2;
    const lock = mesh(new THREE.BoxGeometry(0.26, 0.3, 0.1), M_.metal, 0, 0.62, 0.47, g);
    const gl = glowS(colr || "#9fe8ff", 2.2); gl.position.y = 1.5; g.add(gl); scene.add(g);
    W.addBox(x - 0.75, x + 0.75, y, y + 0.9, z - 0.55, z + 0.55);
    return { id, g, lid, lock, x, z, y, open: false, t: 0 };
  }
  W.chests = {}; for(const id in p.chest){ const [x, z] = p.chest[id]; W.chests[id] = chest(id, x, z + (id === "r4" ? 1.6 : 0), id === "r6" ? YD : YU, id === "r4" ? Math.PI : 0); }
  /* runa (akmuo su šviečiančiu ženklu) */
  W.runeMesh = (x, y, z) => { const g = new THREE.Group(); const s = mesh(new THREE.DodecahedronGeometry(0.42, 0), lam("#6d7396"), 0, 0, 0, g); s.scale.set(0.8, 1.15, 0.45); const r = mesh(new THREE.TorusGeometry(0.17, 0.045, 5, 10), new THREE.MeshBasicMaterial({ color: "#9ff0ff" }), 0, 0.05, 0.2, g); const gl = glowS("#7fe8ff", 2.4); g.add(gl); g.position.set(x, y, z); scene.add(g); W.anim.push(t => { g.rotation.y = t * 1.2; g.position.y = y + Math.sin(t * 2) * 0.1; }); return g; };
  W.rune5 = W.runeMesh(p.rune5[0], YD + 1.3, p.rune5[1]);
  /* žibintuvėlis ant dėžės */
  { const [x, z] = p.torch; mesh(new THREE.BoxGeometry(1.2, 0.8, 1.2), M_.wood, x, YU + 0.4, z); W.addBox(x - 0.6, x + 0.6, YU, YU + 0.8, z - 0.6, z + 0.6);
    const g = new THREE.Group(); const b = mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.42, 8), M_.red, 0, 0, 0, g); b.rotation.z = Math.PI / 2; const h = mesh(new THREE.CylinderGeometry(0.12, 0.08, 0.14, 8), M_.iron, 0.27, 0, 0, g); h.rotation.z = -Math.PI / 2; g.add(glowS("#fff2b0", 1.6)); g.position.set(x, YU + 0.92, z); scene.add(g); W.torchMesh = g; W.anim.push(t => { g.rotation.y = t; }); }
  /* šviečiantys grybai */
  W.mush = p.mush.map(([x, z], k) => { const g = new THREE.Group(); for(let q = 0; q < 3; q++){ const s = 0.5 + q * 0.25, ox = (q - 1) * 0.35; mesh(new THREE.CylinderGeometry(0.05 * s, 0.07 * s, 0.5 * s, 6), M_.white, ox, 0.25 * s, q * 0.15, g); const cap = mesh(new THREE.SphereGeometry(0.24 * s, 8, 5, 0, 7, 0, 1.6), new THREE.MeshBasicMaterial({ color: "#6ff0c0" }), ox, 0.5 * s, q * 0.15, g); } const gl = glowS("#6ff0c0", 2.6); gl.position.y = 0.5; g.add(gl); g.position.set(x + 1.6, YU, z + 1.2); scene.add(g); return { g, x: x + 1.6, z: z + 1.2, k }; });
  /* voratinkliai */
  { const cv = document.createElement("canvas"); cv.width = cv.height = 256; const c2 = cv.getContext("2d"); c2.strokeStyle = "rgba(235,240,250,.9)"; c2.lineWidth = 2;
    for(let a = 0; a < 12; a++){ c2.beginPath(); c2.moveTo(128, 128); c2.lineTo(128 + Math.cos(a * Math.PI / 6) * 180, 128 + Math.sin(a * Math.PI / 6) * 180); c2.stroke(); }
    for(let r = 18; r < 180; r += 18){ c2.beginPath(); for(let a = 0; a <= 12; a++){ const rr = r * (a % 2 ? 0.93 : 1), x = 128 + Math.cos(a * Math.PI / 6) * rr, y = 128 + Math.sin(a * Math.PI / 6) * rr; a ? c2.lineTo(x, y) : c2.moveTo(x, y); } c2.stroke(); }
    const tex = new THREE.CanvasTexture(cv), mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide, depthWrite: false });
    for(const w of p.webs){ const horiz = at(UP, w.i + 1, w.j) !== "#" || at(UP, w.i - 1, w.j) !== "#"; const m = new THREE.Mesh(new THREE.PlaneGeometry(C + 0.6, 6.6), mat); m.position.set(w.x, YU + 3.3, w.z); if(horiz) m.rotation.y = Math.PI / 2; scene.add(m); w.mesh = m; } }
  /* veikėjai */
  function gnome(){ const g = new THREE.Group(); mesh(new THREE.CylinderGeometry(0.32, 0.4, 0.7, 8), M_.blue, 0, 0.55, 0, g); mesh(new THREE.SphereGeometry(0.3, 10, 8), M_.skin, 0, 1.12, 0, g); const hat = mesh(new THREE.ConeGeometry(0.34, 0.9, 8), M_.red, 0, 1.75, 0, g); hat.rotation.z = 0.12;
    const beard = mesh(new THREE.ConeGeometry(0.27, 0.6, 7), M_.white, 0, 0.82, 0.16, g); beard.rotation.x = Math.PI; mesh(new THREE.SphereGeometry(0.07, 6, 5), M_.pink, 0, 1.1, 0.3, g); eyes(g, 1.2, 0.26, 0.11, 0.05);
    for(const s of [-1, 1]){ mesh(new THREE.BoxGeometry(0.2, 0.2, 0.34), M_.dark, s * 0.16, 0.1, 0.06, g); const a = mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.5, 6), M_.blue, s * 0.42, 0.62, 0, g); a.rotation.z = s * 0.5; } return g; }
  function mole(){ const g = new THREE.Group(); const b = mesh(new THREE.SphereGeometry(0.5, 10, 8), M_.fur, 0, 0.55, 0, g); b.scale.set(1, 1.15, 0.95); const n = mesh(new THREE.ConeGeometry(0.2, 0.5, 8), M_.fur, 0, 0.95, 0.36, g); n.rotation.x = Math.PI / 2; mesh(new THREE.SphereGeometry(0.08, 6, 5), M_.pink, 0, 0.95, 0.62, g);
    for(const s of [-1, 1]){ const gl = mesh(new THREE.TorusGeometry(0.1, 0.02, 5, 10), M_.metal, s * 0.14, 1.07, 0.3, g); const h = mesh(new THREE.BoxGeometry(0.28, 0.08, 0.22), M_.pink, s * 0.5, 0.45, 0.2, g); h.rotation.z = s * 0.4; mesh(new THREE.BoxGeometry(0.22, 0.1, 0.3), M_.pink, s * 0.2, 0.05, 0.12, g); }
    const hat = mesh(new THREE.SphereGeometry(0.3, 8, 5, 0, 7, 0, 1.5), lam("#ffc61a"), 0, 1.1, 0, g); mesh(new THREE.SphereGeometry(0.07, 6, 5), new THREE.MeshBasicMaterial({ color: "#fff6c0" }), 0, 1.3, 0.24, g); return g; }
  function gremlin(){ const g = new THREE.Group(); const b = mesh(new THREE.SphereGeometry(0.34, 8, 7), M_.green, 0, 0.55, 0, g); b.scale.y = 1.2; mesh(new THREE.SphereGeometry(0.3, 8, 7), M_.green, 0, 1.1, 0, g);
    for(const s of [-1, 1]){ const e = mesh(new THREE.ConeGeometry(0.13, 0.6, 5), M_.green, s * 0.42, 1.22, 0, g); e.rotation.z = -s * 1.2; const a = mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6, 5), M_.green, s * 0.4, 0.6, 0.1, g); a.rotation.z = s * 0.7; mesh(new THREE.BoxGeometry(0.18, 0.1, 0.3), M_.green, s * 0.15, 0.05, 0.08, g); }
    for(const s of [-1, 1]){ mesh(new THREE.SphereGeometry(0.09, 8, 6), new THREE.MeshBasicMaterial({ color: "#ffe27a" }), s * 0.12, 1.16, 0.24, g); mesh(new THREE.SphereGeometry(0.04, 6, 5), new THREE.MeshBasicMaterial({ color: "#121a33" }), s * 0.12, 1.16, 0.32, g); }
    const m = mesh(new THREE.BoxGeometry(0.26, 0.04, 0.05), M_.dark, 0, 0.98, 0.28, g); return g; }
  function princess(){ const g = new THREE.Group(); mesh(new THREE.ConeGeometry(0.55, 1.2, 10), M_.pink, 0, 0.6, 0, g); mesh(new THREE.CylinderGeometry(0.2, 0.26, 0.5, 8), M_.pink, 0, 1.3, 0, g); mesh(new THREE.SphereGeometry(0.26, 10, 8), M_.skin, 0, 1.78, 0, g);
    const hair = mesh(new THREE.SphereGeometry(0.29, 10, 8, 0, 7, 0, 1.9), lam("#e9b343"), 0, 1.8, -0.04, g); const br = mesh(new THREE.CylinderGeometry(0.1, 0.05, 0.9, 6), lam("#e9b343"), 0, 1.35, -0.26, g);
    const cr = mesh(new THREE.CylinderGeometry(0.17, 0.14, 0.14, 5, 1, true), M_.gold, 0, 2.08, 0, g); eyes(g, 1.82, 0.22, 0.09, 0.04);
    for(const s of [-1, 1]){ const a = mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.55, 6), M_.skin, s * 0.3, 1.25, 0.05, g); a.rotation.z = s * 0.35; } return g; }
  function spider(big){ const g = new THREE.Group(), s = big ? 2.3 : 1; mesh(new THREE.SphereGeometry(0.36, 8, 6), M_.dark, 0, 0.42, -0.3, g).scale.set(1, 0.8, 1.25); mesh(new THREE.SphereGeometry(0.22, 8, 6), M_.dark, 0, 0.4, 0.22, g);
    for(const sx of [-1, 1]){ mesh(new THREE.SphereGeometry(0.05, 6, 5), new THREE.MeshBasicMaterial({ color: big ? "#ff5a5a" : "#ffd23a" }), sx * 0.08, 0.46, 0.4, g); for(let k = 0; k < 4; k++){ const leg = new THREE.Group(); leg.position.set(sx * 0.18, 0.42, 0.18 - k * 0.16); const a = mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.6, 4), M_.dark, sx * 0.25, 0.14, 0, leg); a.rotation.z = -sx * 1.0; const b2 = mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.66, 4), M_.dark, sx * 0.6, -0.02, 0, leg); b2.rotation.z = sx * 0.55; leg.userData.k = k + (sx > 0 ? 0.5 : 0); g.add(leg); } }
    if(big){ const cr = mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.1, 5, 1, true), M_.gold, 0, 0.66, 0.2, g); } g.scale.setScalar(s); g.userData.legs = g.children.filter(c => c.isGroup); return g; }
  const place = (g, x, z, y, ry, r) => { g.position.set(x, y, z); g.rotation.y = ry || 0; scene.add(g); if(r) W.addCircle(x, z, r, y - 1, y + 2.2); return g; };
  W.npc = {};
  W.npc.mole = place(mole(), p.mole[0], p.mole[1] - 1.7, YU, 0, 0.6);
  W.npc.gnome = place(gnome(), p.gnome[0] - 0.8, p.gnome[1], YU, Math.PI / 2, 0.55);
  { const [x, z] = p.gnome; const lan = mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.3, 6), new THREE.MeshBasicMaterial({ color: "#ffe2a8" }), x - 0.2, YU + 0.2, z + 1.2); const gl = glowS("#ffcf8a", 3); gl.position.set(x - 0.2, YU + 0.3, z + 1.2); scene.add(gl); addL; }
  W.npc.gremlin = place(gremlin(), p.gremlin[0], p.gremlin[1] - 1.4, YD, 0, 0.5);
  W.npc.princess = place(princess(), p.cage[0], p.cage[1], YD, Math.PI / 2, 0);
  /* narvas */
  { const [x, z] = p.cage; const g = new THREE.Group(), barM = new THREE.MeshLambertMaterial({ color: "#bfe6ff", emissive: "#5fa8d8", emissiveIntensity: 0.5, flatShading: true });
    for(let k = 0; k < 14; k++){ const a = k / 14 * Math.PI * 2; mesh(new THREE.CylinderGeometry(0.05, 0.05, 3, 5), barM, Math.cos(a) * 1.25, 1.5, Math.sin(a) * 1.25, g); }
    mesh(new THREE.CylinderGeometry(1.35, 1.35, 0.14, 14), barM, 0, 3.05, 0, g); mesh(new THREE.CylinderGeometry(1.4, 1.5, 0.16, 14), M_.iron, 0, 0.08, 0, g); g.position.set(x, YD, z); scene.add(g); W.cage = g; W.cageCol = W.addCircle(x, z, 1.5, YD - 1, YD + 4); }
  /* vorai */
  W.spiders = p.spiders.map(([x, z], k) => { const g = place(spider(false), x, z, YU, 0, 0); return { g, x, z, hx: x, hz: z, on: true, t: k * 1.7, flee: 0 }; });
  W.queen = place(spider(true), p.queen[0], p.queen[1] - 1.2, YU, 0, 0); W.queenCol = W.addCircle(p.queen[0], p.queen[1] - 1.2, 1.5, YU - 1, YU + 3);
  /* vartai: gremlino grotos ir runų vartai */
  { const [x, z] = p.bgate; const g = new THREE.Group(); for(let k = -2; k <= 2; k++) mesh(new THREE.CylinderGeometry(0.09, 0.09, 6.2, 6), M_.iron, k * 1.1, 3.1, 0, g); mesh(new THREE.BoxGeometry(5.8, 0.25, 0.25), M_.iron, 0, 4.6, 0, g); mesh(new THREE.BoxGeometry(5.8, 0.25, 0.25), M_.iron, 0, 1.4, 0, g); g.position.set(x, YD, z); scene.add(g); W.bgate = g; }
  { const [x, z] = p.rgate; const g = new THREE.Group(); const door = mesh(new THREE.BoxGeometry(C, 6.5, 0.9), lam("#55597a"), 0, 3.25, 0, g); W.sockets = [];
    for(let k = 0; k < 7; k++){ const a = Math.PI * (0.12 + 0.76 * k / 6), s = mesh(new THREE.TorusGeometry(0.22, 0.06, 5, 10), new THREE.MeshBasicMaterial({ color: "#2f3350" }), Math.cos(a) * 2.1, 2.3 + Math.sin(a) * 2.4, 0.5, g); W.sockets.push(s); }
    mesh(new THREE.TorusGeometry(0.9, 0.09, 6, 20), lam("#8d8fb0"), 0, 2.6, 0.5, g); g.position.set(x, YD, z); scene.add(g); W.rgate = g; }
  /* keltuvai */
  for(const [x, z, , , y] of [[...p.liftU, YU], [...p.liftD, YD]]){ mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.12, 12), M_.iron, x, y + 0.06, z); for(const s of [-1, 1]) mesh(new THREE.CylinderGeometry(0.07, 0.07, 6, 5), M_.wood, x + s * 1.4, y + 3, z); const gl = glowS("#ffd23a", 2); gl.position.set(x, y + 2.6, z); scene.add(gl); }
  /* šachtos žiedai ir nusileidimo aikštelės žiburys */
  W.rings = [[38.5, 54, 88.5], [51, 37, 96], [40, 20, 97]].map(([x, y, z], k) => { const m = mesh(new THREE.TorusGeometry(2.3, 0.14, 6, 24), new THREE.MeshBasicMaterial({ color: "#ffd23a" }), x, y, z); m.rotation.x = Math.PI / 2; const gl = glowS("#ffd23a", 7); gl.material.opacity = 0.5; m.add(gl); return { m, x, y, z, got: false }; });
  { const b = mesh(new THREE.CylinderGeometry(2.4, 2.4, 0.08, 20), new THREE.MeshBasicMaterial({ color: "#7fe8ff", transparent: true, opacity: 0.55 }), p.rune5[0], YD + 0.06, p.rune5[1]); W.anim.push(t => { b.material.opacity = 0.4 + Math.sin(t * 3) * 0.2; }); }
  /* šikšnosparniai ir žiburiai */
  { const n = low ? 6 : 14, bats = []; const wg = new THREE.BufferGeometry(); wg.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0, 0.5, 0.12, -0.1, 0.3, 0, 0.25], 3));
    const spots = [[cx(2), YU + 6, cx(2)], [cx(8), YU + 8, cx(15)], [cx(24), YU + 7, cx(6)], [cx(16), YD + 11, cx(2)], [cx(7), YD + 10, cx(15)], [cx(6), YD + 7, cx(7)]];
    for(let k = 0; k < n; k++){ const g = new THREE.Group(), bm = new THREE.MeshBasicMaterial({ color: "#1b1722", side: THREE.DoubleSide }); mesh(new THREE.SphereGeometry(0.09, 5, 4), bm, 0, 0, 0, g); const wl = new THREE.Mesh(wg, bm), wr = new THREE.Mesh(wg, bm); wr.scale.x = -1; g.add(wl, wr); scene.add(g); bats.push({ g, wl, wr, c: spots[k % spots.length], a: k * 2.1, r: 2.5 + (k % 3) * 1.4, v: 0.9 + (k % 4) * 0.25 }); }
    W.anim.push(t => { for(const b of bats){ const a = b.a + t * b.v; b.g.position.set(b.c[0] + Math.cos(a) * b.r, b.c[1] + Math.sin(a * 1.7) * 0.8, b.c[2] + Math.sin(a) * b.r); b.g.rotation.y = -a; const f = Math.sin(t * 16 + b.a) * 0.8; b.wl.rotation.z = f; b.wr.rotation.z = -f; } }); }
  /* slibino salės kristalai (apšvietimas) */
  for(const [dx, dz] of [[-17, -1], [17, -1], [-17, 14], [17, 14]]) crystalAt(p.dragon[0] + dx, YD, p.dragon[1] + dz, "#c79bff", 4, 1.5);
  W.setWeb = (id, open) => { W.flags[id] = open; const w = p.webs.find(q => q.id === id); if(w) w.mesh.visible = !open; };
  W.counts = { tris: pos.length / 9, lamps: p.lamps.length };
  return W;
}
