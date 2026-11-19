/* Genetikos konsultacija – genetikos logika (be tekstų ir be DOM): genealoginių medžių generatorius, tikimybių skaičiuoklė, kryžminimų stalo užduotys.
   Prielaida visuose medžiuose (kaip retų ligų uždaviniuose): į šeimą atėję sveiki asmenys ligos alelio neturi. */
(function(){
"use strict";
const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1)), P = a => a[R(0, a.length - 1)];
const SH = a => { a = a.slice(); for(let i = a.length - 1; i > 0; i--){ const j = R(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const fr = (n, d) => { const g = gcd(Math.round(n), Math.round(d)) || 1; return { n: Math.round(n) / g, d: Math.round(d) / g }; };
const toFr = x => { for(const d of [1, 2, 3, 4, 6, 8, 9, 12, 16, 18, 24, 32, 36, 64, 128, 256]){ const n = x * d; if(Math.abs(n - Math.round(n)) < 1e-9) return fr(Math.round(n), d); } return { n: x, d: 1 }; };

/* ---------- paveldėjimas: d – ligos alelių skaičius ---------- */
const aff = (mode, sex, d) => mode === "AR" ? d === 2 : mode === "AD" ? d >= 1 : (sex === "M" ? d === 1 : d === 2);
/* vaiko d skirstinys, kai žinomi tėvų d (fa, mo) ir vaiko lytis */
function kidDist(mode, fa, mo, sex){
  const pm = mo / 2, out = {};
  if(mode === "XR"){ if(sex === "M"){ out[1] = pm; out[0] = 1 - pm; } else { out[fa + 1] = pm; out[fa] = (out[fa] || 0) + 1 - pm; } return out; }
  const pf = fa / 2; out[0] = (1 - pf) * (1 - pm); out[1] = pf * (1 - pm) + (1 - pf) * pm; out[2] = pf * pm; return out;
}
const draw = dist => { let r = Math.random(); for(const k in dist){ r -= dist[k]; if(r <= 0) return +k; } return +Object.keys(dist).pop(); };
/* Įvykio tikimybė. spec: { mode, fa: {d: p}, mo: {d: p}, ev, n, sons }.
   ev: aff | carrier | affBoy | affGirl | healthyBoy | sonAff | dauCar | homoDom | allHealthy | atLeast1 */
function prob(spec){
  let tot = 0;
  for(const f in spec.fa) for(const m in spec.mo){
    const w = spec.fa[f] * spec.mo[m]; if(!w) continue;
    const one = (pred, sexes) => { let p = 0; for(const sx of sexes){ const kd = kidDist(spec.mode, +f, +m, sx); for(const d in kd) if(pred(sx, +d)) p += kd[d] / sexes.length; } return p; };
    const A = (sx, d) => aff(spec.mode, sx, d), both = ["M", "F"];
    let p;
    switch(spec.ev){
      case "aff": p = one(A, both); break;
      case "carrier": p = one((sx, d) => !A(sx, d) && d === 1, both); break;
      case "affBoy": p = one((sx, d) => sx === "M" && A(sx, d), both); break;
      case "affGirl": p = one((sx, d) => sx === "F" && A(sx, d), both); break;
      case "healthyBoy": p = one((sx, d) => sx === "M" && !A(sx, d), both); break;
      case "sonAff": p = one(A, ["M"]); break;
      case "dauCar": p = one((sx, d) => d === 1, ["F"]); break;
      case "homoDom": p = one((sx, d) => d === 2, both); break;
      case "allHealthy": p = Math.pow(1 - one(A, spec.sons ? ["M"] : both), spec.n); break;
      case "atLeast1": p = 1 - Math.pow(1 - one(A, both), spec.n); break;
    }
    tot += w * p;
  }
  return tot;
}

/* ---------- genealoginis medis ---------- */
function tree(mode){
  for(let tries = 0; tries < 200; tries++){
    const ppl = [], add = (gen, sex, fa, mo, d, inlaw) => { const p = { id: ppl.length, gen, sex, fa: fa ? fa.id : -1, mo: mo ? mo.id : -1, d, inlaw: !!inlaw, aff: aff(mode, sex, d), kids: [], sp: -1 }; ppl.push(p); return p; };
    const sx = () => P(["M", "F"]), kid = (gen, fa, mo, sex) => { sex = sex || sx(); const k = add(gen, sex, fa, mo, draw(kidDist(mode, fa.d, mo.d, sex))); fa.kids.push(k.id); mo.kids.push(k.id); return k; };
    const marry = p => { const s = add(p.gen, p.sex === "M" ? "F" : "M", null, null, 0, true); p.sp = s.id; s.sp = p.id; return p.sex === "M" ? [p, s] : [s, p]; };
    let I1, I2, II = [], evid = [], ask = [], t = { mode };
    if(mode === "AR"){
      I1 = add(1, "M", null, null, 1); I2 = add(1, "F", null, null, 1);
      const c1 = kid(2, I1, I2, "F"); c1.d = 2; c1.aff = true; const o = [kid(2, I1, I2), kid(2, I1, I2)];
      if(o.every(x => x.aff)) continue; II = SH([c1, ...o]);
      const h = P(o.filter(x => !x.aff)); const [f1, m1] = marry(c1), [f2, m2] = marry(h);
      const k1 = []; for(let i = R(2, 3); i--;) k1.push(kid(3, f1, m1)); const k2 = []; for(let i = 2; i--;) k2.push(kid(3, f2, m2));
      evid = II.filter(x => x.aff && x.sex === "F").map(x => x.id);
      ask = [P([I1, I2]).id, c1.id, P(k1).id, h.id, ppl[c1.sp].id];
      Object.assign(t, { c1: c1.id, h: h.id, k1: k1.map(x => x.id), k2: k2.map(x => x.id) });
    } else if(mode === "AD"){
      const fatherAff = Math.random() < 0.6; I1 = add(1, "M", null, null, fatherAff ? 1 : 0); I2 = add(1, "F", null, null, fatherAff ? 0 : 1);
      const a = kid(2, I1, I2, "M"); a.d = 1; a.aff = true; const o = [kid(2, I1, I2), kid(2, I1, I2)];
      if(o.every(x => x.aff)) continue; II = SH([a, ...o]);
      const h = P(o.filter(x => !x.aff)); const [f1, m1] = marry(a), [f2, m2] = marry(h);
      const k1 = [kid(3, f1, m1, "M")]; k1[0].d = 1; k1[0].aff = true; for(let i = R(1, 2); i--;) k1.push(kid(3, f1, m1)); if(k1.every(x => x.aff)) continue;
      const k2 = []; for(let i = 2; i--;) k2.push(kid(3, f2, m2));
      evid = ppl.filter(x => x.aff && x.sex === "M" && x.fa >= 0 && ppl[x.fa].aff).map(x => x.id);
      ask = [(fatherAff ? I1 : I2).id, h.id, k1[0].id, ppl[a.sp].id, P(k1.filter(x => !x.aff)).id];
      Object.assign(t, { a: a.id, h: h.id, k1: k1.map(x => x.id), affK: k1.filter(x => x.aff).map(x => x.id), healK: k1.filter(x => !x.aff).map(x => x.id) });
    } else {
      I1 = add(1, "M", null, null, 0); I2 = add(1, "F", null, null, 1);
      const c1 = kid(2, I1, I2, "M"); c1.d = 1; c1.aff = true; const c2 = kid(2, I1, I2, "F"); c2.d = 1; const c3 = kid(2, I1, I2); II = SH([c1, c2, c3]);
      const [f1, m1] = marry(c2); const k1 = [kid(3, f1, m1, "M")]; k1[0].d = 1; k1[0].aff = true; k1.push(kid(3, f1, m1, "F")); k1.push(kid(3, f1, m1));
      let k2 = []; if(Math.random() < 0.65){ const [f2, m2] = marry(c1); k2 = [kid(3, f2, m2, "F"), kid(3, f2, m2)]; }
      evid = k1.filter(x => x.aff).map(x => x.id);
      const dau = k1.filter(x => x.sex === "F"), obl = k2.filter(x => x.sex === "F");
      ask = [I2.id, c2.id, k1[0].id, dau[0].id, obl.length ? obl[0].id : ppl[c2.sp].id];
      Object.assign(t, { c1: c1.id, c2: c2.id, c3: c3.id, dau: dau.map(x => x.id), obl: obl.map(x => x.id) });
    }
    const nAff = ppl.filter(x => x.aff).length; if(nAff < 2 || nAff > 5 || !evid.length) continue;
    /* išdėstymas ir kodai: I – pora; II – vaikai su sutuoktiniais; III – po savo tėvais */
    const g2 = []; II.forEach(c => { if(c.sp >= 0){ const s = ppl[c.sp]; g2.push(...(c.sex === "M" ? [c, s] : [s, c])); } else g2.push(c); });
    const g3 = []; II.forEach(c => { if(c.sp >= 0) c.kids.forEach(k => g3.push(ppl[k])); });
    const rom = ["", "I", "II", "III"]; [[I1, I2], g2, g3].forEach(row => row.forEach((p, i) => p.code = rom[p.gen] + "-" + (i + 1)));
    /* teisingos genotipų žymės ir pagrindimo raktai */
    ppl.forEach(p => {
      const fa = ppl[p.fa], mo = ppl[p.mo], hasAffKid = p.kids.some(k => ppl[k].aff), affPar = (fa && fa.aff) || (mo && mo.aff);
      if(mode === "AR"){ if(p.aff){ p.gt = "aa"; p.why = "aff"; } else if(p.inlaw){ p.gt = "AA"; p.why = "inlaw"; } else if(hasAffKid){ p.gt = "Aa"; p.why = "parAff"; } else if(affPar){ p.gt = "Aa"; p.why = "kidAff"; } else { p.gt = "A?"; p.why = p.gen === 2 ? "unk23" : "unk"; } }
      else if(mode === "AD"){ if(p.aff){ p.gt = "Aa"; p.why = "adAff"; } else { p.gt = "aa"; p.why = p.inlaw ? "adIn" : "adH"; } }
      else if(p.sex === "M"){ p.gt = p.aff ? "XaY" : "XAY"; p.why = p.aff ? "xM1" : "xM0"; }
      else if(p.inlaw){ p.gt = "XAXA"; p.why = "inlaw"; } else if(hasAffKid){ p.gt = "XAXa"; p.why = "xCarKid"; } else if(fa && fa.aff){ p.gt = "XAXa"; p.why = "xCarFa"; } else { p.gt = "XA?"; p.why = "xUnk"; }
    });
    t.ppl = ppl; t.rows = [[I1, I2], g2, g3].map(r => r.map(p => p.id)); t.II = II.map(c => c.id); t.evid = evid; t.ask = [...new Set(ask)];
    return t;
  }
  throw new Error("medis");
}
const OPTS = { AR: ["AA", "Aa", "aa", "A?"], AD: ["AA", "Aa", "aa"], XRF: ["XAXA", "XAXa", "XaXa", "XA?"], XRM: ["XAY", "XaY"] };

/* ---------- tikimybių klausimai apie medį ---------- */
const one = d => ({ [d]: 1 }), D23 = { 0: 1 / 3, 1: 2 / 3 }, D13 = { 0: 2 / 3, 1: 1 / 3 }, D12 = { 0: 0.5, 1: 0.5 };
const QS = [
  /* id, mode, hard, build(t) → { who: [asmenų id], fa, mo, ev, n, sons } arba null */
  ["A1", "AR", 0, t => ({ who: [P(t.k1)], x: one(1), y: one(1), ev: "aff" })],
  ["A2", "AR", 1, t => ({ who: [P(t.k1)], x: one(1), y: D23, ev: "aff" })],
  ["A3", "AR", 0, t => ({ who: [P(t.k1)], x: one(1), y: one(2), ev: "aff" })],
  ["A4", "AR", 1, t => ({ who: [t.h], x: D23, y: one(1), ev: "aff", sib: 1 })],
  ["A5", "AR", 1, t => ({ who: [P(t.k2)], x: D13, y: one(1), ev: "aff" })],
  ["A6", "AR", 0, t => ({ who: [0, 1], x: one(1), y: one(1), ev: "carrier" })],
  ["A7", "AR", 0, t => ({ who: [0, 1], x: one(1), y: one(1), ev: "allHealthy", n: 2 })],
  ["A8", "AR", 1, t => ({ who: [0, 1], x: one(1), y: one(1), ev: "atLeast1", n: 3 })],
  ["A9", "AR", 0, t => ({ who: [0, 1], x: one(1), y: one(1), ev: "affGirl" })],
  ["A10", "AR", 1, t => ({ who: [t.h], x: D23, y: D23, ev: "aff", sib: 1 })],
  ["A11", "AR", 1, t => ({ who: [P(t.k1)], x: one(1), y: one(1), ev: "atLeast1", n: 2 })],
  ["D1", "AD", 0, t => ({ who: [P(t.affK)], x: one(1), y: one(0), ev: "aff" })],
  ["D2", "AD", 1, t => ({ who: [P(t.affK)], x: one(1), y: one(0), ev: "atLeast1", n: 3 })],
  ["D3", "AD", 0, t => ({ who: [P(t.affK)], x: one(1), y: one(0), ev: "healthyBoy" })],
  ["D4", "AD", 1, t => ({ who: [P(t.affK)], x: one(1), y: one(1), ev: "aff" })],
  ["D5", "AD", 1, t => ({ who: [P(t.affK)], x: one(1), y: one(1), ev: "homoDom" })],
  ["D6", "AD", 0, t => ({ who: [P(t.affK)], x: one(1), y: one(0), ev: "allHealthy", n: 2 })],
  ["D7", "AD", 0, t => ({ who: [P(t.healK)], x: one(0), y: one(0), ev: "aff" })],
  ["X1", "XR", 0, t => ({ who: [t.c2], x: one(1), y: one(0), ev: "sonAff" })],
  ["X2", "XR", 0, t => ({ who: [t.c2], x: one(1), y: one(0), ev: "aff" })],
  ["X3", "XR", 1, t => ({ who: [P(t.dau)], x: D12, y: one(0), ev: "aff" })],
  ["X4", "XR", 1, t => ({ who: [P(t.dau)], x: D12, y: one(0), ev: "sonAff" })],
  ["X5", "XR", 0, t => ({ who: [t.c1], x: one(0), y: one(1), ev: "dauCar", man: 1 })],
  ["X6", "XR", 1, t => t.obl.length ? { who: [P(t.obl)], x: one(1), y: one(1), ev: "aff" } : null],
  ["X7", "XR", 1, t => ({ who: [t.c2], x: one(1), y: one(0), ev: "allHealthy", n: 2, sons: 1 })],
  ["X8", "XR", 1, t => ({ who: [P(t.dau)], x: D12, y: one(0), ev: "allHealthy", n: 2, sons: 1 })],
  ["X9", "XR", 1, t => t.obl.length ? { who: [P(t.obl)], x: one(1), y: one(0), ev: "affBoy" } : null]
];
/* x – medžio asmens (arba motinos) skirstinys, y – partnerio; XR atveju motina visada x, išskyrus man: 1 (medžio asmuo – vyras). */
/* hardOnly: true – tik sunkesni, false – tik paprastesni, null – bet kurie */
function question(t, used, hardOnly){
  const cand = SH(QS.filter(q => q[1] === t.mode && !used.has(q[0]) && (hardOnly == null || !!q[2] === !!hardOnly)));
  for(const q of cand){
    const b = q[3](t); if(!b) continue;
    const spec = { mode: t.mode, ev: b.ev, n: b.n, sons: b.sons };
    if(t.mode === "XR"){ spec.mo = b.x; spec.fa = b.y; } else { spec.fa = b.x; spec.mo = b.y; }
    return { id: q[0], hard: q[2], who: b.who.map(i => t.ppl[i].code), b, spec, ans: toFr(prob(spec)) };
  }
  return null;
}

/* ---------- kryžminimų stalas ---------- */
/* lokusas: { p1: "Aa", p2: "Aa", cls: genotipas → klasės raktas }; X lokusas: { x: 1, mo: "Hh", fa: "H" } */
const sortG = g => g.split("").sort((a, b) => (a.toLowerCase() < b.toLowerCase() ? -1 : a.toLowerCase() > b.toLowerCase() ? 1 : a < b ? -1 : 1)).join("");
function locDist(L){
  const out = {};
  if(L.x){ for(const a of L.mo) for(const s of ["M", "F"]){ const g = s === "M" ? a + "Y" : sortG(a + L.fa); out[g] = (out[g] || 0) + 0.25; } return out; }
  for(const a of L.p1) for(const b of L.p2){ const g = sortG(a + b); out[g] = (out[g] || 0) + 0.25; } return out;
}
const dom = g => g[0] === g[0].toUpperCase() ? g[0] + "_" : g;                      /* A_ arba aa */
const ABO = g => ({ AA: "A", AO: "A", BB: "B", BO: "B", AB: "AB", OO: "0" })[g.split("").sort().join("")];
function benchProb(loci, want){ let p = 1; loci.forEach((L, i) => { const d = locDist(L); let s = 0; for(const g in d) if(want[i](g)) s += d[g]; p *= s; }); return p; }
const pickG = L => { const d = locDist(L); let r = Math.random(); for(const g in d){ r -= d[g]; if(r <= 0) return g; } return Object.keys(d).pop(); };
function benchSample(loci, n, keyOf){ const m = {}; for(let i = 0; i < n; i++){ const k = keyOf(loci.map(pickG)); m[k] = (m[k] || 0) + 1; } return m; }
const BT = {
  B1: () => { const tg = P([["A_", "B_"], ["A_", "bb"], ["aa", "B_"], ["aa", "bb"]]); return { loci: [{ p1: "Aa", p2: "Aa" }, { p1: "Bb", p2: "Bb" }], want: [g => dom(g) === tg[0], g => dom(g) === tg[1]], v: { tg } }; },
  B1g: () => { const tg = P([["Aa", "Bb"], ["AA", "Bb"], ["aa", "Bb"], ["AA", "bb"], ["Aa", "BB"]]); return { loci: [{ p1: "Aa", p2: "Aa" }, { p1: "Bb", p2: "Bb" }], want: [g => g === tg[0], g => g === tg[1]], v: { tg } }; },
  B2: () => { const pr = P([["Aa", "Aa", "Bb", "bb"], ["Aa", "aa", "Bb", "Bb"], ["Aa", "aa", "Bb", "bb"], ["Aa", "Aa", "BB", "bb"], ["AA", "Aa", "Bb", "Bb"]]); const loci = [{ p1: pr[0], p2: pr[1] }, { p1: pr[2], p2: pr[3] }]; let tg, p; do { tg = [P(["A_", "aa"]), P(["B_", "bb"])]; p = benchProb(loci, [g => dom(g) === tg[0], g => dom(g) === tg[1]]); } while(p <= 0 || p >= 1); return { loci, want: [g => dom(g) === tg[0], g => dom(g) === tg[1]], v: { tg, pr } }; },
  B3: () => { const tg = P([["A_", "B_", "cc"], ["aa", "bb", "cc"], ["A_", "bb", "cc"], ["A_", "B_", "C_"], ["aa", "B_", "C_"]]); return { loci: [{ p1: "Aa", p2: "Aa" }, { p1: "Bb", p2: "Bb" }, { p1: "Cc", p2: "Cc" }], want: tg.map(x => g => dom(g) === x), v: { tg } }; },
  B4: () => { const pr = P([["AO", "BO", "Dd", "Dd"], ["AO", "AO", "Dd", "dd"], ["AB", "OO", "Dd", "Dd"], ["AO", "BO", "Dd", "dd"], ["AB", "AO", "Dd", "Dd"]]); const loci = [{ p1: pr[0], p2: pr[1] }, { p1: pr[2], p2: pr[3] }]; let grp, rh, p; do { grp = P(["A", "B", "AB", "0"]); rh = P(["D_", "dd"]); p = benchProb(loci, [g => ABO(g) === grp, g => dom(g) === rh]); } while(p <= 0 || p >= 1); return { loci, want: [g => ABO(g) === grp, g => dom(g) === rh], v: { pr, grp, rh } }; },
  B5: () => { const un = P(["AABB", "AaBB", "AABb", "AaBb"]), loci = [{ p1: un.slice(0, 2), p2: "aa" }, { p1: un.slice(2), p2: "bb" }]; let cnt; do { cnt = benchSample(loci, 48, gs => gs.map(dom).join(" ")); } while(Object.keys(cnt).length !== (un === "AABB" ? 1 : un === "AaBb" ? 4 : 2)); return { kind: "geno", loci, cnt, ans: un, v: { n: 48 } }; },
  B6: () => { const rf = P([8, 10, 12, 16, 20, 24]), n = P([200, 400, 500]); const c = { "A_ B_": 0, "aa bb": 0, "A_ bb": 0, "aa B_": 0 }; for(let i = 0; i < n; i++){ const rec = Math.random() < rf / 100, k = rec ? P(["A_ bb", "aa B_"]) : P(["A_ B_", "aa bb"]); c[k]++; } const r = c["A_ bb"] + c["aa B_"]; return { kind: "num", dec: 1, cnt: c, ans: Math.round(r / n * 1000) / 10, exact: r / n * 100, v: { n, r } }; },
  B7: () => { const tg = P([["A_", "bb"], ["aa", "B_"], ["aa", "bb"], ["A_", "B_"]]), n = P([160, 320, 480, 640]); const loci = [{ p1: "Aa", p2: "Aa" }, { p1: "Bb", p2: "Bb" }], p = benchProb(loci, [g => dom(g) === tg[0], g => dom(g) === tg[1]]); return { kind: "num", dec: 0, loci, ans: n * p, exact: n * p, v: { tg, n, p: toFr(p) } }; },
  B8: () => { const k = P(["sonBoth", "healthy", "dauCarAlb", "hemNonAlb"]); const loci = [{ p1: "Aa", p2: "Aa" }, { x: 1, mo: "Hh", fa: "H" }]; const W = { sonBoth: [g => g === "aa", g => g === "hY"], healthy: [g => dom(g) === "A_", g => g !== "hY"], dauCarAlb: [g => g === "aa", g => g === "Hh"], hemNonAlb: [g => dom(g) === "A_", g => g === "hY"] }; return { loci, want: W[k], v: { k } }; },
  B9: () => { const tg = P([["Rr", "T_"], ["RR", "tt"], ["rr", "T_"], ["Rr", "tt"], ["RR", "T_"]]); return { loci: [{ p1: "Rr", p2: "Rr" }, { p1: "Tt", p2: "Tt" }], want: [g => g === tg[0], g => dom(g) === tg[1]], v: { tg } }; }
};
function bench(id){
  const b = BT[id](); b.id = id; b.kind = b.kind || "frac";
  if(b.kind === "frac"){ b.p = benchProb(b.loci, b.want); b.ans = toFr(b.p); }
  if(b.loci && !b.cnt) b.grow = n => benchSample(b.loci, n, gs => gs.map((g, i) => b.want[i](g) ? 1 : 0).every(x => x) ? "hit" : "miss");
  return b;
}
const BIDS = Object.keys(BT);
/* atsakymo tikrinimas: trupmena „3/16“, dešimtainis „0,1875“ arba procentai netaikomi */
function parse(s){ s = String(s).trim().replace(",", "."); if(/^\d+\/\d+$/.test(s)){ const [a, b] = s.split("/").map(Number); return b ? a / b : NaN; } return /^\d+(\.\d+)?$/.test(s) ? parseFloat(s) : NaN; }
const okFrac = (ans, s) => { const x = parse(s); return isFinite(x) && Math.abs(x - ans.n / ans.d) < (/\//.test(s) ? 1e-9 : 0.0051); };
window.GK = { tree, question, prob, kidDist, aff, OPTS, QS, bench, BIDS, benchProb, locDist, parse, okFrac, toFr, fr, SH, P, R, dom, ABO };
})();
