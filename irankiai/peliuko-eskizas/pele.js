/* Naujas peliukas – dvikojis, su marškinėliais ir berete. Bandomasis modelis eskizui (vėliau keliamas į žaidimą).
   makeMouse(THREE, { shirt, shorts }) → Group (aukštis ~1, kojos ant y = 0, žiūri +z);  animate(m, mode, t, k) – mode: idle | run | dance */
export function makeMouse(THREE, o = {}){
  const std = (c, e) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.8, metalness: 0, emissive: e || 0x000000 });
  const fur = std("#c9cfdb", 0x3a4152), pink = std("#f4a6b7", 0x4a2530), dark = std("#23262f"), white = std("#ffffff", 0x666666), dim = c => new THREE.Color(c).multiplyScalar(0.28).getHex(), shirt = std(o.shirt || "#19b5a5", dim(o.shirt || "#19b5a5")), stripe = std(o.stripe || "#ffd23f", dim(o.stripe || "#ffd23f")), shorts = std(o.shorts || "#3b5bdb", dim(o.shorts || "#3b5bdb")), red = std("#e5484d", 0x5a1518);
  const sp = (r, w, h) => new THREE.SphereGeometry(r, w || 18, h || 12), cyl = (a, b, h, s) => new THREE.CylinderGeometry(a, b, h, s || 12);
  const G = p => { const g = new THREE.Group(); if(p) p.add(g); return g; }, M = (geo, mat, p, x, y, z, sx, sy, sz) => { const m = new THREE.Mesh(geo, mat); m.position.set(x || 0, y || 0, z || 0); if(sx) m.scale.set(sx, sy, sz); m.castShadow = true; p.add(m); return m; };
  /* v2 (2026-11-28): lieknesnis – ilgesnės kojos ir rankos, siauras liemuo, mažesnė galva, sportbačiai */
  const HY = 0.44, root = G(), hips = G(root); hips.position.y = HY; const R = { root, hips, hy: HY }, sole = std(o.sole || "#ffffff", 0x555555), shoe = std(o.shoe || "#e5484d", 0x3a0e10);
  /* kojos: šlaunis → kelis → blauzda → sportbatis */
  R.knees = []; R.legs = [-1, 1].map(s => { const leg = G(hips); leg.position.set(0.062 * s, 0, 0); M(cyl(0.05, 0.043, 0.19), shorts, leg, 0, -0.085, 0); const kn = G(leg); kn.position.y = -0.2; M(sp(0.034, 10, 8), fur, kn, 0, 0, 0); M(cyl(0.031, 0.027, 0.17), fur, kn, 0, -0.09, 0);
    M(sp(0.06), shoe, kn, 0, -0.195, 0.03, 0.8, 0.55, 1.45); M(cyl(0.05, 0.052, 0.022, 12), sole, kn, 0, -0.228, 0.03, 0.82, 1, 1.5); M(sp(0.02, 8, 6), sole, kn, 0, -0.17, 0.085); R.knees.push(kn); return leg; });
  /* liemuo: siauras, marškinėliai šiek tiek platėja į apačią */
  const torso = R.torso = G(hips); M(sp(0.115), shorts, torso, 0, 0.0, 0, 1, 0.75, 0.8); M(cyl(0.105, 0.128, 0.27, 20), shirt, torso, 0, 0.165, 0, 1, 1, 0.78); M(sp(0.107), shirt, torso, 0, 0.3, 0, 1.12, 0.5, 0.8); M(cyl(0.126, 0.129, 0.04, 24), stripe, torso, 0, 0.13, 0, 1, 1, 0.78); M(cyl(0.04, 0.05, 0.07, 12), fur, torso, 0, 0.345, 0);
  /* rankos: petys → alkūnė → plaštaka */
  R.arms = [-1, 1].map(s => { const sh = G(torso); sh.position.set(0.128 * s, 0.285, 0); M(sp(0.048), shirt, sh, 0, 0, 0); M(cyl(0.04, 0.038, 0.08), shirt, sh, 0, -0.045, 0); M(cyl(0.029, 0.027, 0.1), fur, sh, 0, -0.12, 0); const el = G(sh); el.position.y = -0.17; M(sp(0.029, 10, 8), fur, el, 0, 0, 0); M(cyl(0.027, 0.024, 0.15), fur, el, 0, -0.075, 0); const hand = G(el); hand.position.y = -0.165; M(sp(0.04), pink, hand, 0, 0, 0, 1, 1, 0.8);
    const fingers = G(hand); for(const f of [-1, 1]){ const fg = M(cyl(0.012, 0.012, 0.09, 6), pink, fingers, 0.019 * f, -0.06, 0); fg.rotation.z = 0.2 * f; M(sp(0.014, 8, 6), pink, fingers, 0.028 * f, -0.105, 0); } fingers.visible = false; return { sh, el, hand, fingers, s }; });
  /* galva – mažesnė (0,72 ankstesnės), ausys palyginti didesnės */
  const head = R.head = G(torso); head.position.y = 0.485; head.scale.setScalar(0.72); M(sp(0.2), fur, head, 0, 0, 0, 1.05, 0.95, 1); M(sp(0.11), fur, head, 0, -0.04, 0.16, 1, 0.8, 1.1); M(sp(0.04), pink, head, 0, -0.02, 0.275);
  for(const s of [-1, 1]){ M(sp(0.045), white, head, 0.085 * s, 0.04, 0.165, 1, 1.15, 0.6); M(sp(0.027), dark, head, 0.088 * s, 0.035, 0.19, 1, 1.15, 0.6); M(sp(0.009, 6, 4), white, head, 0.096 * s, 0.05, 0.205);
    const ear = G(head); ear.position.set(0.18 * s, 0.16, -0.02); M(sp(0.125), fur, ear, 0, 0, 0, 1, 1, 0.35); M(sp(0.082), pink, ear, 0, 0, 0.024, 1, 1, 0.3); (R.ears = R.ears || []).push(ear);
    for(const k of [-1, 0, 1]){ const w = M(cyl(0.004, 0.004, 0.16, 4), dark, head, 0.13 * s, -0.04 + k * 0.012, 0.2); w.rotation.z = Math.PI / 2 + k * 0.22 * s; w.rotation.y = -0.5 * s; } }
  const sm = M(new THREE.TorusGeometry(0.035, 0.008, 6, 12, Math.PI), dark, head, 0, -0.065, 0.235); sm.rotation.z = Math.PI; sm.rotation.x = -0.35;
  M(sp(0.17), red, head, 0.03, 0.17, 0.0, 1.15, 0.36, 1.15).rotation.z = -0.18; M(sp(0.028, 8, 6), red, head, 0.045, 0.235, 0);
  /* uodega iš grandžių */
  R.tail = []; let p = G(hips); p.position.set(0, 0.0, -0.085); p.rotation.x = -1.9; for(let k = 0; k < 6; k++){ const r0 = 0.024 - k * 0.003; M(cyl(r0 - 0.003, r0, 0.11, 6), pink, p, 0, 0.055, 0); R.tail.push(p); const n = G(p); n.position.y = 0.11; p = n; }
  root.userData.rig = R; return root;
}
const lerp = (a, b, k) => a + (b - a) * k, sm = k => k * k * (3 - 2 * k);
/* rankos poza: [peties x, peties z, alkūnės x, alkūnės z] kairei ir dešinei */
function arm(a, sx, sz, ex, ez, V){ a.sh.rotation.set(sx, 0, sz * a.s); a.el.rotation.set(ex, 0, (ez || 0) * a.s); a.fingers.visible = !!V; a.hand.rotation.set(0, 0, 0); }
export const DANCE = ["6-7", "pergalė", "malūnėlis", "klubai"], DANCE_T = 1.8;
export function animate(m, mode, t, k){
  const R = m.userData.rig, [L, Rr] = R.arms, S = Math.sin, C = Math.cos; R.root.rotation.z = 0; const HY = R.hy; R.hips.position.set(0, HY, 0); R.knees.forEach(k => k.rotation.set(0, 0, 0)); R.hips.rotation.set(0, 0, 0); R.torso.rotation.set(0, 0, 0); R.head.rotation.set(0, 0, 0); R.legs.forEach(l => l.rotation.set(0, 0, 0));
  R.tail.forEach((g, i) => { if(i) g.rotation.set(0.28, 0, 0); });
  if(mode === "run"){ const w = t * 14, a = S(w); R.legs[0].rotation.x = a * 0.95; R.legs[1].rotation.x = -a * 0.95; R.hips.position.y = HY - 0.02 + Math.abs(C(w)) * 0.035; R.knees[0].rotation.x = 0.15 + Math.max(0, -C(w)) * 1.3; R.knees[1].rotation.x = 0.15 + Math.max(0, C(w)) * 1.3; R.torso.rotation.x = 0.22; R.head.rotation.x = -0.12;
    arm(L, -a * 0.9, 0.18, -0.9, 0); arm(Rr, a * 0.9, 0.18, -0.9, 0); R.tail.forEach((g, i) => { if(i) g.rotation.z = S(w * 0.5 - i * 0.6) * 0.16; }); R.ears.forEach((e, i) => e.rotation.x = -0.25); return; }
  R.ears.forEach(e => e.rotation.x = 0);
  if(mode === "idle"){ const b = S(t * 2.2); R.torso.rotation.x = b * 0.015; R.hips.position.y = HY + b * 0.006; arm(L, b * 0.05, 0.16, -0.15, 0); arm(Rr, -b * 0.05, 0.16, -0.15, 0); R.head.rotation.y = S(t * 0.7) * 0.25; R.head.rotation.z = S(t * 1.1) * 0.04;
    R.tail.forEach((g, i) => { if(i) g.rotation.z = S(t * 2.4 - i * 0.7) * 0.22; }); return; }
  /* šokis: klubai linguoja visą laiką, rankų judesiai keičiasi kas DANCE_T s */
  const beat = t * 7.2, sway = S(beat), i = (k !== undefined ? k : Math.floor(t / DANCE_T)) % DANCE.length;
  R.hips.position.x = sway * 0.05; R.hips.position.y = HY - Math.abs(S(beat)) * 0.03; R.knees[0].rotation.x = Math.max(0, sway) * 0.5; R.knees[1].rotation.x = Math.max(0, -sway) * 0.5; R.hips.rotation.z = sway * 0.14; R.torso.rotation.z = -sway * 0.22; R.head.rotation.z = sway * 0.12; R.legs[0].rotation.z = -sway * 0.14 - 0.06; R.legs[1].rotation.z = -sway * 0.14 + 0.06; R.legs[0].rotation.x = Math.max(0, sway) * 0.35; R.legs[1].rotation.x = Math.max(0, -sway) * 0.35;
  R.tail.forEach((g, j) => { if(j) g.rotation.z = S(beat - j * 0.8) * 0.3; });
  if(i === 0){ /* „6–7“: delnai į viršų, rankos pakaitomis aukštyn–žemyn */ const a = S(beat) * 0.3; arm(L, -0.15, 0.55, -1.25 - a, 0.25); arm(Rr, -0.15, 0.55, -1.25 + a, 0.25); R.head.rotation.x = -0.1; }
  else if(i === 1){ /* du pirštai į viršų abiem rankom */ const a = S(beat) * 0.12; arm(L, -0.25, 2.35 + a, 0, 0.35, true); arm(Rr, -0.25, 2.35 - a, 0, 0.35, true); R.head.rotation.x = -0.18; }
  else if(i === 2){ /* malūnėlis: plaštakos sukasi viena aplink kitą priešais krūtinę */ const w = t * 13; arm(L, -1.25 + S(w) * 0.32, -0.55, -1.5 + C(w) * 0.45, 0); arm(Rr, -1.25 - S(w) * 0.32, -0.55, -1.5 - C(w) * 0.45, 0); }
  else { /* klubai į vieną pusę, tiesios rankos – į kitą */ const a = sway; arm(L, -a * 0.5, 0.35 - a * 0.25, -0.1, 0); arm(Rr, a * 0.5, 0.35 + a * 0.25, -0.1, 0); R.hips.rotation.z = sway * 0.22; R.hips.position.x = sway * 0.08; }
}
