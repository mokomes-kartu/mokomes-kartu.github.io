/* Šešėlių dirbtuvė – pelytės namelis ir pinigėliai (naudoja „Šešėlių slėpynės“).
   Pinigėliai: už kambarį pagal GERIAUSIĄ rezultatą (1★ 20, 2★ 40, 3★ 70 – pakartojus sumokamas tik trūkstamas skirtumas), aukšto premijos (visi kambariai – 100, visi trimis žvaigždutėmis – dar 200)
   ir dažų tūbelės (5 × aukšto numeris; surinkta tūbelė vėl prisipildo po valandos). Likutis = uždirbta − išleista.
   MK_NAMAS.build(THREE, own, inside) – namelio vaizdas lauke arba viduje su turimais daiktais (own – Set). Daiktų pavadinimai – tekstai.lt.js */
(function(){
const REWARD = [0, 20, 40, 70], FLOOR_DONE = 100, FLOOR_STARS = 200, TUBE = 5, TUBE_MS = 3600e3;
/* daiktai: [id, kaina, vieta: l – lauke, v – viduje] */
const ITEMS = [["kilimelis", 40, "l"], ["vazonas", 60, "l"], ["pastas", 80, "l"], ["suoliukas", 100, "l"], ["zibintas", 120, "l"], ["tvorele", 120, "l"], ["girlianda", 150, "l"], ["masina", 400, "l"],
  ["lova", 60, "v"], ["kilimas", 60, "v"], ["stalas", 80, "v"], ["lentyna", 100, "v"], ["paveikslas", 100, "v"], ["lempa", 120, "v"], ["fotelis", 140, "v"], ["molbertas", 180, "v"]];
/* floors: [{ id, n }] – aukštai ir kambarių skaičius; rooms: { "1-3": žvaigždutės } */
function earned(floors, rooms){ let s = 0; for(const f of floors){ let done = 0, three = 0; for(let i = 1; i <= f.n; i++){ const v = rooms[f.id + "-" + i] || 0; s += REWARD[v] || 0; if(v) done++; if(v === 3) three++; } if(f.id !== "b"){ if(done === f.n) s += FLOOR_DONE; if(three === f.n) s += FLOOR_STARS; } } return s; }
const balance = (floors, rooms, S) => earned(floors, rooms) + (S.extra || 0) - (S.spent || 0);
const tubeValue = fid => fid === "b" ? 2 * TUBE : TUBE * (+fid || 1);
const ripe = (S, rid, i, now) => !(S.tb && S.tb[rid] && S.tb[rid][i] > now - TUBE_MS);
/* rūbai: [id, vieta (top – marškinėliai ar suknelė, shoes, scarf, hat), kaina, kam (b – peliukui, g – pelytei, * – abiem), išvaizda] */
const WEAR = [
  ["m0", "top", 0, "b", { shirt: "#19b5a5", stripe: "#ffd23f", shorts: "#3b5bdb" }], ["m1", "top", 30, "b", { shirt: "#f5871f", stripe: "#ffffff", shorts: "#2b2f3a" }], ["m2", "top", 30, "b", { shirt: "#8b5cf6", stripe: "#ffd23f", shorts: "#1f6f8b" }],
  ["m3", "top", 30, "b", { shirt: "#e5484d", stripe: "#ffffff", shorts: "#3b5bdb" }], ["m4", "top", 30, "b", { shirt: "#ffd23f", stripe: "#e5484d", shorts: "#2f8f4e" }], ["m5", "top", 40, "b", { shirt: "#2b2f3a", stripe: "#ffd23f", shorts: "#e5484d" }],
  ["s0", "top", 0, "g", { shirt: "#ff5fa2", stripe: "#ffffff" }], ["s1", "top", 30, "g", { shirt: "#8b5cf6", stripe: "#ffd23f" }], ["s2", "top", 30, "g", { shirt: "#19b5a5", stripe: "#ffffff" }],
  ["s3", "top", 30, "g", { shirt: "#ffd23f", stripe: "#ff5fa2" }], ["s4", "top", 30, "g", { shirt: "#3b82e6", stripe: "#ffffff" }], ["s5", "top", 40, "g", { shirt: "#e5484d", stripe: "#ffffff" }],
  ["b0", "shoes", 20, "*", { shoe: "#e5484d" }], ["b1", "shoes", 20, "*", { shoe: "#3b82e6" }], ["b2", "shoes", 20, "*", { shoe: "#ffd23f" }], ["b3", "shoes", 20, "*", { shoe: "#2f8f4e" }], ["b4", "shoes", 20, "*", { shoe: "#8b5cf6" }], ["b5", "shoes", 20, "*", { shoe: "#f4f1ea" }],
  ["k0", "scarf", 0, "*", { scarf: null }], ["k1", "scarf", 25, "*", { scarf: "#e5484d" }], ["k2", "scarf", 25, "*", { scarf: "#ffd23f" }], ["k3", "scarf", 25, "*", { scarf: "#3b82e6" }], ["k4", "scarf", 25, "*", { scarf: "#2f8f4e" }],
  ["h0", "hat", 0, "*", { hat: "beret", hatC: "#e5484d" }], ["h1", "hat", 25, "*", { hat: "beret", hatC: "#3b82e6" }], ["h2", "hat", 35, "*", { hat: "cap", hatC: "#3b82e6" }], ["h3", "hat", 35, "*", { hat: "cap", hatC: "#ffd23f" }], ["h4", "hat", 35, "*", { hat: "beanie", hatC: "#2f8f4e" }], ["h5", "hat", 35, "*", { hat: "beanie", hatC: "#ff5fa2" }]
], SLOTS = ["top", "shoes", "scarf", "hat"], DEF = { b: { top: "m0", shoes: "b0", scarf: "k0", hat: "h0" }, g: { top: "s0", shoes: "b4", scarf: "k0", hat: "h0" } };
const wearOf = id => WEAR.find(q => q[0] === id), worn = (S, who, slot) => (S.wear && S.wear[who] && S.wear[who][slot]) || DEF[who][slot];
/* ar daiktą herojus turi: nupirktas arba pradinis (nemokamas arba šio herojaus pradinių rūbų dalis) */
const hasWear = (S, who, id) => { const w = wearOf(id); return !!w && (w[2] === 0 || DEF[who][w[1]] === id || (S.own || []).includes(id)); };
/* herojaus išvaizda pagal dėvimus rūbus – parinktys MK_PELE.make */
function outfit(S, who){ const o = { girl: who === "g" }; for(const slot of SLOTS){ const w = wearOf(worn(S, who, slot)); if(w) Object.assign(o, w[4]); } if(o.girl) o.shorts = o.shirt; return o; }
const price = id => { const it = ITEMS.find(q => q[0] === id) || wearOf(id); return it ? (it.length > 3 ? it[2] : it[1]) : 0; };
function build(THREE, own, inside){
  const std = (c, e, o) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.85, emissive: e || 0x000000 }, o || {})), g = new THREE.Group();
  const M = (geo, mat, x, y, z, p) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; (p || g).add(m); return m; }, box = (w, h, d) => new THREE.BoxGeometry(w, h, d), cyl = (a, b, h, s) => new THREE.CylinderGeometry(a, b, h, s || 16), sp = r => new THREE.SphereGeometry(r, 14, 10), has = id => own.has(id);
  const wood = std("#8a5a34"), woodL = std("#c58a4e"), red = std("#e5484d", 0x3a0e10), blue = std("#3b82e6", 0x0d2550), yel = std("#ffd23f", 0x5a4500), grn = std("#4caf50", 0x103a12), wht = std("#f4f1ea", 0x333333), dark = std("#2b2f3a"), glowM = c => new THREE.MeshBasicMaterial({ color: c });
  if(!inside){
    M(box(9, 3.4, 0.2), std("#e9dfcd"), 0, 1.7, -0.1); M(box(9, 0.55, 0.14), wood, 0, 0.275, 0.02); M(box(9, 0.06, 0.2), woodL, 0, 0.57, 0.03);
    /* durys */
    M(box(0.86, 0.72, 0.1), dark, 0, 0.36, 0.06); const ar = M(cyl(0.43, 0.43, 0.1, 24, 1), dark, 0, 0.72, 0.06); ar.rotation.x = Math.PI / 2; const fr = M(new THREE.TorusGeometry(0.46, 0.05, 8, 24, Math.PI), woodL, 0, 0.72, 0.1); M(box(0.07, 0.72, 0.1), woodL, -0.46, 0.36, 0.1); M(box(0.07, 0.72, 0.1), woodL, 0.46, 0.36, 0.1);
    const door = new THREE.Group(); door.position.set(-0.4, 0, 0.12); door.rotation.y = -0.55; g.add(door); M(box(0.78, 0.74, 0.05), std("#b9763f"), 0.39, 0.37, 0, door); const dt = M(cyl(0.39, 0.39, 0.05, 24), std("#b9763f"), 0.39, 0.74, 0, door); dt.rotation.x = Math.PI / 2; M(sp(0.04), yel, 0.66, 0.42, 0.04, door);
    /* langas */
    const wn = M(cyl(0.27, 0.27, 0.06, 24), glowM(0xffdf8a), -1.15, 0.98, 0.04); wn.rotation.x = Math.PI / 2; const wf = M(new THREE.TorusGeometry(0.28, 0.04, 8, 24), woodL, -1.15, 0.98, 0.08); M(box(0.56, 0.035, 0.04), woodL, -1.15, 0.98, 0.09); M(box(0.035, 0.56, 0.04), woodL, -1.15, 0.98, 0.09);
    if(has("kilimelis")){ M(box(0.9, 0.025, 0.5), red, 0.1, 0.013, 0.55); M(box(0.74, 0.03, 0.34), yel, 0.1, 0.015, 0.55); }
    if(has("vazonas")){ M(cyl(0.16, 0.12, 0.26, 16), std("#b8c0cc", 0x222222, { metalness: 0.6, roughness: 0.35 }), -0.85, 0.13, 0.4); for(const [dx, c, h] of [[-0.06, "#ff7eb6", 0.5], [0.05, "#ffd23f", 0.6], [0, "#ff9f43", 0.42]]){ M(cyl(0.012, 0.012, h, 6), grn, -0.85 + dx, 0.26 + h / 2, 0.4); M(sp(0.07), std(c, 0x331111), -0.85 + dx, 0.28 + h, 0.4); } }
    if(has("pastas")){ M(cyl(0.025, 0.025, 0.6, 8), wood, 0.85, 0.3, 0.35); M(box(0.26, 0.17, 0.18), red, 0.85, 0.66, 0.35); M(box(0.03, 0.14, 0.02), yel, 0.99, 0.74, 0.35); }
    if(has("suoliukas")){ M(box(0.9, 0.05, 0.28), woodL, -1.9, 0.26, 0.4); M(box(0.9, 0.22, 0.04), woodL, -1.9, 0.44, 0.27); for(const dx of [-0.38, 0.38]) M(box(0.06, 0.26, 0.26), wood, -1.9 + dx, 0.13, 0.4); }
    if(has("zibintas")){ M(cyl(0.03, 0.04, 1.25, 8), dark, 1.5, 0.625, 0.45); M(box(0.2, 0.24, 0.2), glowM(0xffe9a8), 1.5, 1.36, 0.45); const cp = M(cyl(0.02, 0.17, 0.12, 4), dark, 1.5, 1.54, 0.45); cp.rotation.y = Math.PI / 4; const pl = new THREE.PointLight(0xffd98a, 2.2, 3.5); pl.position.set(1.5, 1.36, 0.6); g.add(pl); }
    if(has("tvorele")){ for(const [x0, n] of [[-2.0, 5], [2.15, 4]]){ for(let k = 0; k < n; k++){ const x = x0 + k * 0.2; M(box(0.05, 0.42, 0.05), wht, x, 0.21, 1.0); M(sp(0.045), red, x, 0.44, 1.0); } M(box((n - 1) * 0.2 + 0.1, 0.04, 0.03), wht, x0 + (n - 1) * 0.1, 0.26, 1.0); } }
    if(has("girlianda")){ const cs = [0xff5d73, 0xffd23f, 0x4dd0e1, 0x7ee081, 0xb388ff]; for(let k = 0; k <= 12; k++){ const u = k / 12, x = -1.7 + u * 3.4, y = 1.62 - Math.sin(u * Math.PI) * 0.22 + (k % 2 ? -0.03 : 0); M(sp(0.045), glowM(cs[k % 5]), x, y, 0.08); } const w = M(box(3.4, 0.012, 0.012), dark, 0, 1.6, 0.06); }
    if(has("masina")){ const c = new THREE.Group(); c.position.set(2.55, 0, 0.42); c.rotation.y = -0.3; g.add(c); M(box(1.2, 0.26, 0.62), blue, 0, 0.3, 0, c); M(box(1.24, 0.04, 0.66), std("#cfd6e2", 0x222222, { metalness: 0.5, roughness: 0.4 }), 0, 0.44, 0, c); M(box(0.5, 0.2, 0.5), red, -0.1, 0.56, 0, c); const ws = M(box(0.04, 0.24, 0.5), std("#bfe6ff", 0x224455, { transparent: true, opacity: 0.7 }), 0.2, 0.6, 0, c); ws.rotation.z = -0.3;
      for(const [x, z] of [[-0.4, 0.34], [0.4, 0.34], [-0.4, -0.34], [0.4, -0.34]]){ const w = M(cyl(0.2, 0.2, 0.07, 20), dark, x, 0.2, z, c); w.rotation.x = Math.PI / 2; const h = M(cyl(0.11, 0.11, 0.08, 16), yel, x, 0.2, z, c); h.rotation.x = Math.PI / 2; } M(sp(0.06), glowM(0xfff3b0), 0.61, 0.33, 0.2, c); M(sp(0.06), glowM(0xfff3b0), 0.61, 0.33, -0.2, c); }
  } else {
    /* kambarys: grindys, galinė ir šoninės sienos */
    M(box(4.6, 0.1, 2.6), std("#b98554"), 0, -0.05, 1.2); M(box(4.6, 2.3, 0.1), std("#f3d9b0"), 0, 1.15, -0.05); M(box(0.1, 2.3, 2.6), std("#eac99a"), -2.3, 1.15, 1.2); M(box(0.1, 2.3, 2.6), std("#eac99a"), 2.3, 1.15, 1.2); M(box(4.6, 0.3, 0.06), std("#8a5a34"), 0, 0.15, 0.02);
    const wn = M(cyl(0.3, 0.3, 0.05, 24), glowM(0x9fd3ff), 1.3, 1.45, 0.02); wn.rotation.x = Math.PI / 2; M(new THREE.TorusGeometry(0.31, 0.04, 8, 24), woodL, 1.3, 1.45, 0.05);
    if(has("kilimas")){ M(cyl(0.95, 0.95, 0.02, 32), red, 0.1, 0.012, 1.4); M(cyl(0.7, 0.7, 0.025, 32), yel, 0.1, 0.014, 1.4); M(cyl(0.42, 0.42, 0.03, 32), blue, 0.1, 0.016, 1.4); }
    if(has("lova")){ M(box(1.15, 0.26, 0.7), blue, -1.55, 0.13, 0.5); M(box(1.19, 0.06, 0.74), yel, -1.55, 0.02, 0.5); M(box(0.3, 0.1, 0.5), wht, -1.92, 0.31, 0.5); M(box(0.74, 0.08, 0.72), red, -1.33, 0.3, 0.5); }
    if(has("stalas")){ M(cyl(0.36, 0.36, 0.05, 24), woodL, 0.2, 0.52, 0.75); M(cyl(0.14, 0.14, 0.45, 16), std("#e86a92"), 0.2, 0.27, 0.75); M(cyl(0.34, 0.34, 0.05, 24), woodL, 0.2, 0.025, 0.75); const ch = M(cyl(0.16, 0.16, 0.12, 3), yel, 0.2, 0.61, 0.75); }
    if(has("lentyna")){ M(box(1.0, 0.05, 0.22), wood, -0.6, 1.5, 0.12); M(box(1.0, 0.05, 0.22), wood, -0.6, 1.1, 0.12); const cs = ["#e5484d", "#3b82e6", "#ffd23f", "#4caf50", "#8b5cf6", "#f5871f"]; cs.forEach((c, k) => { M(box(0.1, 0.28, 0.17), std(c), -0.98 + k * 0.12, 1.27, 0.12); if(k < 4) M(box(0.1, 0.24, 0.17), std(cs[(k + 3) % 6]), -0.75 + k * 0.13, 1.65, 0.12); }); }
    if(has("paveikslas")){ M(box(0.66, 0.5, 0.04), yel, 0.35, 1.5, 0.02); M(box(0.54, 0.38, 0.05), std("#8fd3ff"), 0.35, 1.5, 0.03); M(sp(0.09), std("#ffd23f", 0x554400), 0.5, 1.58, 0.05); M(box(0.54, 0.12, 0.055), grn, 0.35, 1.37, 0.03); }
    if(has("lempa")){ M(cyl(0.16, 0.18, 0.04, 16), dark, 2.0, 0.02, 0.4); M(cyl(0.02, 0.02, 1.2, 8), dark, 2.0, 0.6, 0.4); M(cyl(0.12, 0.24, 0.26, 16, 1), glowM(0xffe2a0), 2.0, 1.3, 0.4); const pl = new THREE.PointLight(0xffd98a, 2.5, 4); pl.position.set(1.9, 1.2, 0.7); g.add(pl); }
    if(has("fotelis")){ M(box(0.62, 0.28, 0.56), std("#8b5cf6", 0x1d0f44), 1.45, 0.14, 1.0); M(box(0.62, 0.5, 0.14), std("#8b5cf6", 0x1d0f44), 1.45, 0.5, 0.75); M(box(0.12, 0.2, 0.56), std("#7446e0"), 1.14, 0.36, 1.0); M(box(0.12, 0.2, 0.56), std("#7446e0"), 1.76, 0.36, 1.0); }
    if(has("molbertas")){ const e = new THREE.Group(); e.position.set(-0.75, 0, 1.25); e.rotation.y = 0.5; g.add(e); for(const dx of [-0.2, 0.2]){ const l = M(box(0.035, 0.95, 0.035), woodL, dx, 0.47, 0, e); l.rotation.z = -dx * 0.5; } const b = M(box(0.035, 0.95, 0.035), woodL, 0, 0.45, -0.2, e); b.rotation.x = -0.4; M(box(0.5, 0.42, 0.03), wht, 0, 0.62, 0.04, e); M(sp(0.07), red, -0.1, 0.66, 0.06, e); M(sp(0.06), blue, 0.08, 0.58, 0.06, e); M(sp(0.05), yel, 0.02, 0.72, 0.06, e); }
  }
  return g;
}
window.MK_NAMAS = { ITEMS, WEAR, SLOTS, DEF, wearOf, worn, hasWear, outfit, REWARD, FLOOR_DONE, FLOOR_STARS, TUBE_MS, earned, balance, tubeValue, ripe, price, build };
})();
