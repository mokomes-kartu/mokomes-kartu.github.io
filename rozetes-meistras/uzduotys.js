/* MokomėsKartu.lt – „Rozetės meistras“: brėžinių ir užduočių generatoriai (be sąsajos).
   Brėžinys aprašomas vienetiniame apskritime (centras O = (0; 0), spindulys 1); visi kampai, lankai ir ilgiai
   brėžinyje yra tikslūs – testai juos patikrina pagal koordinates. */
(function(){
"use strict";
const tx = window.MK_T.tasks;
const RN = (a, b) => a + Math.floor(Math.random() * (b - a + 1)), PK = a => a[RN(0, a.length - 1)];
const EV = (a, b) => 2 * RN(Math.ceil(a / 2), Math.floor(b / 2));
const rad = d => d * Math.PI / 180, md = x => ((x % 360) + 360) % 360;
const cos = d => Math.cos(rad(d)), sin = d => Math.sin(rad(d));

/* ---------- brėžinys ---------- */
function Dg(rot, fl){
  this.rot = rot == null ? RN(0, 359) : rot; this.fl = fl == null ? (Math.random() < .5 ? -1 : 1) : fl;
  this.P = { O: [0, 0] }; this.th = {}; this.seg = []; this.ang = []; this.arc = []; this.len = []; this.tk = []; this.sec = []; this.free = []; this.dots = [];
}
const p = Dg.prototype;
p.tr = function(x, y){ y *= this.fl; const c = cos(this.rot), s = sin(this.rot); return [x * c - y * s, x * s + y * c]; };
p.c = function(n, th){ this.th[n] = md(this.fl * th + this.rot); this.P[n] = this.tr(cos(th), sin(th)); return this; };            /* taškas apskritime */
p.pt = function(n, x, y){ this.P[n] = this.tr(x, y); return this; };                                                               /* bet kuris taškas */
p.dot = function(th){ this.dots.push(this.tr(cos(th), sin(th))); return this; };
p.s = function(a, b, k, e1, e2){ this.seg.push({ a, b, k: k || "", e1: e1 || 0, e2: e2 || 0 }); return this; };                    /* k: "" styga, "r" spindulys, "s" – tik po sprendimo */
p.a = function(v, a, b, val, k, o){ this.ang.push(Object.assign({ v, a, b, val, k }, o || {})); return this; };                    /* k: g – duota, q – ieškoma, s – statusis (po sprendimo), r – statusis (rodomas) */
p.ar = function(a, b, val, k){ this.arc.push(this.fl > 0 ? { a, b, val, k } : { a: b, b: a, val, k }); return this; };             /* lankas nuo a iki b prieš laikrodžio rodyklę */
p.sc = function(a, b){ this.sec.push(this.fl > 0 ? { a, b } : { a: b, b: a }); return this; };
p.l = function(a, b, val, k){ this.len.push({ a, b, val, k }); return this; };
p.t = function(a, b, n){ this.tk.push({ a, b, n: n || 1 }); return this; };
p.f = function(id, val, unit){ this.free.push({ id, val, unit: unit || "" }); return this; };

function mk(key, d, prm, sk){
  const t = tx[key](prm || {}), unk = [];
  const add = (o, unit) => { if(!o.id) o.id = "x"; if(!unk.some(u => u.id === o.id)) unk.push({ id: o.id, val: o.val, unit }); };
  d.ang.forEach(a => { if(a.k === "q") add(a, "°"); }); d.arc.forEach(a => { if(a.k === "q") add(a, "°"); });
  d.len.forEach(l => { if(l.k === "q") add(l, ""); }); d.free.forEach(f => unk.push({ id: f.id, val: f.val, unit: f.unit }));
  unk.sort((a, b) => a.id < b.id ? -1 : 1);
  return { key, sk: sk || key, d, q: t.q, hint: t.hint, why: t.why, unk, prm: prm || {} };
}
/* taškas C didesniajame lanke (nuo a iki 360), toliau nuo skersmenų per A ir B, kad stygos nesutaptų su spinduliais */
function pickC(a, lo, hi){
  lo = lo == null ? a + 28 : lo; hi = hi == null ? 332 : hi;
  for(let i = 0; i < 200; i++){ const c = RN(lo, hi); if(Math.abs(c - 180) > 14 && Math.abs(c - (a + 180)) > 14) return c; }
  return Math.round((lo + hi) / 2);
}
const base = a => new Dg().c("A", 0).c("B", a);
const dia = t => new Dg(PK([0, 180]) + RN(-20, 20)).c("A", 180).c("B", 0).c("C", t).s("A", "B");
function tan2(h, single){ const d = new Dg(PK([0, 180]) + RN(-14, 14)); d.c("A", h); if(!single) d.c("B", -h); d.pt("P", 1 / cos(h), 0); return d; }
/* dvi susikertančios stygos: AE = a, EB = b, CE = c, ED = d (a·b = c·d), kampas tarp stygų phi */
function chords(a, b, c, dd, phi){
  const d = new Dg(RN(-25, 25) + PK([0, 180])), C = [c * cos(phi), c * sin(phi)], cx = (b - a) / 2;
  const cy = ((C[0] - cx) ** 2 + C[1] ** 2 - (-a - cx) ** 2) / (2 * C[1]), R = Math.hypot(-a - cx, cy), N = (x, y) => [(x - cx) / R, (y - cy) / R];
  [["A", -a, 0], ["B", b, 0], ["C", C[0], C[1]], ["D", -dd * cos(phi), -dd * sin(phi)], ["E", 0, 0]].forEach(([n, x, y]) => { const q = N(x, y); d.pt(n, q[0], q[1]); });
  d.R = R; return d.s("A", "B").s("C", "D");
}
/* apskritimas, liečiantis trikampio kraštines; liestinių atkarpos iš A, B, C: a, b, c */
function incircle(a, b, c){
  const d = new Dg(RN(-12, 12) + PK([0, 180])), AB = a + b, AC = a + c, BC = b + c, Cx = (AC * AC + AB * AB - BC * BC) / (2 * AB), Cy = Math.sqrt(AC * AC - Cx * Cx), r = Math.sqrt(a * b * c / (a + b + c));
  const N = (x, y) => [(x - a) / r, (y - r) / r];
  [["A", 0, 0], ["B", AB, 0], ["C", Cx, Cy], ["K", a, 0], ["L", AB + b * (Cx - AB) / BC, b * Cy / BC], ["M", a * Cx / AC, a * Cy / AC]].forEach(([n, x, y]) => { const q = N(x, y); d.pt(n, q[0], q[1]); });
  return d.s("A", "B").s("B", "C").s("C", "A");
}
const NG = [3, 4, 5, 6, 8, 9, 10, 12];
const FR = [[1, 3], [1, 4], [1, 5], [2, 5], [1, 6], [1, 8], [3, 8], [1, 9], [2, 9], [4, 9], [1, 10], [3, 10], [1, 12], [5, 12]];
const TRI = [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13], [8, 15, 17], [15, 8, 17], [9, 12, 15], [12, 9, 15], [12, 16, 20], [16, 12, 20], [20, 21, 29], [21, 20, 29], [10, 24, 26], [15, 20, 25], [20, 15, 25]];
const SQ = [[2, 8, 4], [1, 4, 2], [3, 12, 6], [4, 9, 6], [2, 18, 6], [4, 16, 8], [8, 18, 12], [5, 20, 10], [9, 16, 12], [8, 2, 4], [9, 4, 6], [12, 3, 6], [16, 4, 8], [18, 8, 12]];
const PERP = [[2, 4], [1, 3], [2, 6], [4, 8], [8, 12], [6, 12], [8, 4], [9, 3], [16, 8], [18, 12], [18, 6]];
/* visos keturių skirtingų atkarpų kombinacijos a·b = c·d */
const QUAD = (() => { const o = []; for(let a = 2; a <= 16; a++) for(let b = a; b <= 18; b++) for(let c = a + 1; c <= 16; c++) for(let d = c; d <= 18; d++){
  if(a * b === c * d && c !== b && Math.max(a, b, c, d) / Math.min(a, b, c, d) <= 5) o.push([a, b, c, d]); } return o; })();
function quad(){ let [a, b, c, d] = PK(QUAD); if(Math.random() < .5) [a, b] = [b, a]; if(Math.random() < .5) [c, d] = [d, c]; if(Math.random() < .5) [a, b, c, d] = [c, d, a, b]; return [a, b, c, d]; }
function ngon(needInt){ for(;;){ const n = PK(NG), k = RN(1, 4), v = k * 360 / n; if(v >= 30 && v <= (needInt ? 140 : 160) && (!needInt || Number.isInteger((180 - v) / 2))) return { n, k, v, u: 360 / n }; } }
function parts(n){ for(;;){ const g = []; let s = 0; for(let i = 0; i < n - 1; i++){ const v = n === 3 ? RN(70, 165) : RN(40, 150); g.push(v); s += v; } const r = 360 - s; if(r >= 40 && r <= 165){ g.push(r); return g; } } }
function arcs3(lo, hi){ for(;;){ const a = EV(lo, hi), b = EV(lo, hi), c = 360 - a - b; if(c >= lo && c <= hi) return [a, b, c]; } }
function tanLen(){ for(;;){ const r = RN(3, 12), a = RN(4, 20), q = a / r; if(q >= .7 && q <= 2.1 && a !== r) return { r, a, h: Math.atan(q) * 180 / Math.PI }; } }
function xcut(d){ /* stygų AB ir CD susikirtimo taškas E */
  const A = d.P.A, B = d.P.B, C = d.P.C, D = d.P.D, r = [B[0] - A[0], B[1] - A[1]], s = [D[0] - C[0], D[1] - C[1]], den = r[0] * s[1] - r[1] * s[0], t = ((C[0] - A[0]) * s[1] - (C[1] - A[1]) * s[0]) / den;
  d.P.E = [A[0] + t * r[0], A[1] + t * r[1]]; return d;
}
function cross(){ for(;;){ const u = RN(22, 50), v = RN(22, 50), w1 = EV(56, 150), w2 = 360 - 2 * u - 2 * v - w1; if(w2 >= 56 && w2 <= 190 && u !== v) return { u, v, d: xcut(new Dg().c("A", 0).c("C", 2 * u).c("B", 2 * u + w1).c("D", 2 * u + w1 + 2 * v)).s("A", "B").s("C", "D").s("A", "D").s("C", "B") }; } }

const G = {
  /* ----- 1 lygis ----- */
  c1(){ const a = RN(40, 165); return mk("c1", base(a).s("O", "A", "r").s("O", "B", "r").a("O", "A", "B", a, "g").ar("A", "B", a, "q"), { a }); },
  c1b(){ const a = RN(50, 165), d = base(a).c("C", a + (360 - a) / 2 + PK([-1, 1]) * RN(26, 40)); return mk("c1b", d.s("O", "A", "r").s("O", "B", "r").a("O", "A", "B", a, "g").ar("B", "A", 360 - a, "q"), { a }); },
  c2(){ const a = RN(40, 165); return mk("c2", base(a).s("O", "A", "r").s("O", "B", "r").ar("A", "B", a, "g").a("O", "A", "B", a, "q"), { a }); },
  c3(n){ const g = parts(n), qi = RN(0, n - 1), d = new Dg(), N = "ABCDE"; let th = 0;
    g.forEach((v, i) => { d.c(N[i], th); d.s("O", N[i], "r"); th += v; });
    g.forEach((v, i) => d.a("O", N[i], N[(i + 1) % n], v, i === qi ? "q" : "g"));
    return mk("c3", d, { n, g: g.filter((v, i) => i !== qi), x: g[qi] }, "c3_" + n); },
  c3_3(){ return G.c3(3); }, c3_4(){ return G.c3(4); }, c3_5(){ return G.c3(5); },
  c4(){ const a = RN(35, 145); return mk("c4", new Dg().c("A", 0).c("B", 180).c("C", a).s("A", "B").s("O", "C", "r").a("O", "A", "C", a, "g").a("O", "C", "B", 180 - a, "q"), { a }); },
  c5(){ const a = EV(40, 150); return mk("c5", base(a).s("O", "A", "r").s("O", "B", "r").s("A", "B").a("O", "A", "B", a, "g").a("A", "O", "B", (180 - a) / 2, "q"), { a }); },
  c6(){ const b = RN(20, 70); return mk("c6", base(180 - 2 * b).s("O", "A", "r").s("O", "B", "r").s("A", "B").a("A", "O", "B", b, "g").a("O", "A", "B", 180 - 2 * b, "q"), { b }); },
  c7(){ const g = ngon(false), d = new Dg(); for(let i = 0; i < g.n; i++) d.dot(i * g.u); d.c("A", 0).c("B", g.v).s("O", "A", "r").s("O", "B", "r").a("O", "A", "B", g.v, "q"); return mk("c7", d, g); },
  c8(){ const g = ngon(true), d = new Dg(); for(let i = 0; i < g.n; i++) d.dot(i * g.u); d.c("A", 0).c("B", g.v).s("O", "A", "r").s("O", "B", "r").s("A", "B").a("A", "O", "B", (180 - g.v) / 2, "q"); return mk("c8", d, g); },
  c9(){ for(;;){ const a = EV(96, 160), b = EV(96, 160), x = 360 - a - b; if(x < 40 || x > 160) continue;
    return mk("c9", new Dg().c("A", 0).c("B", a).c("C", a + b).s("O", "A", "r").s("O", "C", "r").ar("A", "B", a, "g").ar("B", "C", b, "g").a("O", "C", "A", x, "q"), { a, b, x }); } },
  c10(){ const [k, n] = PK(FR), v = 360 * k / n; return mk("c10", base(v).s("O", "A", "r").s("O", "B", "r").sc("A", "B").a("O", "A", "B", v, "q"), { k, n, v }); },
  c11(){ const b = RN(20, 65); return mk("c11", new Dg().c("A", 0).c("C", 180).c("B", 180 - 2 * b).s("A", "C").s("O", "B", "r").s("A", "B").a("A", "O", "B", b, "g").a("O", "B", "C", 2 * b, "q"), { b }); },

  /* ----- 2 lygis ----- */
  i1(){ const a = EV(50, 160); return mk("i1", base(a).c("C", pickC(a)).s("O", "A", "r").s("O", "B", "r").s("C", "A").s("C", "B").a("O", "A", "B", a, "g").a("C", "A", "B", a / 2, "q"), { a }); },
  i2(){ const a = EV(50, 160); return mk("i2", base(a).c("C", pickC(a)).s("O", "A", "r").s("O", "B", "r").s("C", "A").s("C", "B").a("C", "A", "B", a / 2, "g").a("O", "A", "B", a, "q"), { a }); },
  i3(){ const a = EV(50, 170); return mk("i3", base(a).c("C", pickC(a)).s("C", "A").s("C", "B").ar("A", "B", a, "g").a("C", "A", "B", a / 2, "q"), { a }); },
  i4(){ const a = EV(50, 170); return mk("i4", base(a).c("C", pickC(a)).s("C", "A").s("C", "B").a("C", "A", "B", a / 2, "g").ar("A", "B", a, "q"), { a }); },
  i5(){ const a = EV(50, 130), sp = 360 - a, m = a + sp / 2; return mk("i5", base(a).c("C", RN(a + 28, m - 20)).c("D", RN(m + 20, 332)).s("C", "A").s("C", "B").s("D", "A").s("D", "B").a("C", "A", "B", a / 2, "g").a("D", "A", "B", a / 2, "q"), { a }); },
  i6(){ const a = EV(100, 170); return mk("i6", base(a).c("C", RN(Math.ceil(.3 * a), Math.floor(.7 * a))).s("O", "A", "r").s("O", "B", "r").s("C", "A").s("C", "B").a("O", "A", "B", a, "g").a("C", "A", "B", 180 - a / 2, "q"), { a }); },
  i7(){ const a = EV(100, 170); return mk("i7", base(a).c("C", RN(Math.ceil(.3 * a), Math.floor(.7 * a))).s("C", "A").s("C", "B").ar("B", "A", 360 - a, "g").a("C", "A", "B", 180 - a / 2, "q"), { a }); },
  i8(){ for(;;){ const a = EV(70, 150), b = EV(70, 150); if(a + b < 160 || a + b > 290) continue;
    return mk("i8", new Dg().c("A", 0).c("B", a).c("C", a + b).s("A", "B").s("B", "C").s("C", "A").ar("A", "B", a, "g").ar("B", "C", b, "g").a("B", "A", "C", (360 - a - b) / 2, "q"), { a, b }); } },
  i9(){ const [a, b, c] = arcs3(70, 170); return mk("i9", new Dg().c("A", 0).c("B", a).c("C", a + b).s("A", "B").s("B", "C").s("C", "A").a("A", "B", "C", b / 2, "g").a("B", "A", "C", c / 2, "g").ar("A", "B", a, "q"), { A: b / 2, B: c / 2, C: a / 2 }); },
  i10(){ const [a, b] = arcs3(70, 170); return mk("i10", new Dg().c("A", 0).c("B", a).c("C", a + b).s("A", "B").s("B", "C").s("C", "A").ar("A", "B", a, "g").ar("B", "C", b, "g").a("A", "B", "C", b / 2, "q", { id: "x" }).a("C", "A", "B", a / 2, "q", { id: "y" }), { a, b }); },
  i11(){ const g = RN(100, 150), a = 360 - 2 * g; return mk("i11", base(a).c("C", RN(Math.ceil(.3 * a), Math.floor(.7 * a))).s("O", "A", "r").s("O", "B", "r").s("C", "A").s("C", "B").a("C", "A", "B", g, "g").a("O", "A", "B", a, "q"), { g }); },
  i13(){ const v = EV(40, 110); return mk("i13", new Dg().c("A", 90).c("B", 270 - v).c("C", v - 90).s("A", "B").s("B", "C").s("C", "A").t("A", "B").t("A", "C").a("A", "B", "C", v, "g").ar("A", "B", 180 - v, "q"), { v }); },
  i14(){ const b = RN(25, 70), a = 2 * b; return mk("i14", base(a).c("C", pickC(a)).s("O", "A", "r").s("O", "B", "r").s("A", "B").s("C", "A").s("C", "B").a("C", "A", "B", b, "g").a("A", "O", "B", 90 - b, "q"), { b }); },

  /* ----- 3 lygis ----- */
  d1(){ const t = EV(40, 140); return mk("d1", dia(t).s("A", "C").s("B", "C").a("A", "C", "B", t / 2, "g").a("B", "A", "C", 90 - t / 2, "q").a("C", "A", "B", 90, "s"), { A: t / 2 }); },
  d2(){ const t = EV(40, 140); return mk("d2", dia(t).s("A", "C").s("B", "C").ar("B", "C", t, "g").a("B", "A", "C", 90 - t / 2, "q").a("C", "A", "B", 90, "s"), { t }); },
  d3a(){ const t = EV(44, 136); return mk("d3a", dia(t).s("A", "C").s("B", "C").s("O", "C", "r").a("A", "C", "B", t / 2, "g").a("C", "O", "B", 90 - t / 2, "q"), { A: t / 2 }); },
  d3b(){ const t = EV(44, 136); return mk("d3b", dia(t).s("A", "C").s("B", "C").s("O", "C", "r").a("C", "O", "B", 90 - t / 2, "g").a("C", "O", "A", t / 2, "q"), { A: t / 2 }); },
  d4(){ const t = EV(44, 136); return mk("d4", dia(t).s("A", "C").s("B", "C").s("O", "C", "r").a("O", "B", "C", t, "g").a("A", "C", "B", t / 2, "q", { id: "x" }).a("B", "A", "C", 90 - t / 2, "q", { id: "y" }), { t }); },
  d5(){ const t = EV(44, 136), f = EV(44, 136); return mk("d5", dia(t).c("D", 360 - f).s("A", "C").s("C", "B").s("B", "D").s("D", "A").a("A", "C", "B", t / 2, "g").a("B", "A", "D", 90 - f / 2, "g").a("B", "C", "D", 180 - t / 2 - f / 2, "q"), { A: t / 2, Bd: 90 - f / 2 }); },
  d6(){ const t = EV(36, 80), f = EV(t + 36, 146); return mk("d6", dia(t).c("D", f).s("A", "C").s("C", "B").s("A", "D").s("D", "B").a("A", "C", "B", t / 2, "g").a("D", "A", "B", 90, "q"), { A: t / 2 }); },
  d8(){ const t = EV(40, 140); return mk("d8", dia(t).s("A", "C").s("B", "C").a("A", "C", "B", t / 2, "g").ar("C", "A", 180 - t, "q"), { A: t / 2 }); },
  d9(){ let b; do b = RN(22, 68); while(Math.abs(b - 45) < 6); return mk("d9", new Dg(PK([0, 180]) + RN(-15, 15)).c("A", 180).c("B", 360 - 2 * b).c("C", 0).c("D", 180 - 2 * b).s("A", "B").s("B", "C").s("C", "D").s("D", "A").s("A", "C").s("B", "D").a("A", "C", "B", b, "g").a("O", "A", "B", 180 - 2 * b, "q"), { b }); },
  d10(){ const w = RN(0, 1), d = dia(60).s("A", "C").s("B", "C").s("O", "C", "s").t("B", "C").t("O", "B"); return mk("d10", w ? d.a("A", "C", "B", 30, "q") : d.a("B", "A", "C", 60, "q"), { w }); },
  d11(){ const t = EV(44, 136); return mk("d11", dia(t).s("A", "C").s("B", "C").s("O", "C", "r").a("A", "C", "B", t / 2, "g").a("O", "A", "C", 180 - t, "q"), { A: t / 2 }); },

  /* ----- 4 lygis ----- */
  t1(){ const h = RN(25, 62); return mk("t1", tan2(h, 1).s("O", "A", "r").s("O", "P").s("P", "A", "", .25, .5).a("O", "A", "P", h, "g").a("P", "A", "O", 90 - h, "q").a("A", "O", "P", 90, "s"), { h }); },
  t2(){ const h = RN(25, 62); return mk("t2", tan2(h, 1).s("O", "A", "r").s("O", "P").s("P", "A", "", .25, .5).a("P", "A", "O", 90 - h, "g").a("O", "A", "P", h, "q").a("A", "O", "P", 90, "s"), { h }); },
  t3(){ const h = RN(30, 75); return mk("t3", tan2(h).s("O", "A", "r").s("O", "B", "r").s("P", "A", "", .1, .35).s("P", "B", "", .1, .35).a("P", "A", "B", 180 - 2 * h, "g").a("O", "A", "B", 2 * h, "q").a("A", "O", "P", 90, "s").a("B", "O", "P", 90, "s"), { h }); },
  t4(){ const h = RN(30, 75); return mk("t4", tan2(h).s("O", "A", "r").s("O", "B", "r").s("P", "A", "", .1, .35).s("P", "B", "", .1, .35).a("O", "A", "B", 2 * h, "g").a("P", "A", "B", 180 - 2 * h, "q").a("A", "O", "P", 90, "s").a("B", "O", "P", 90, "s"), { h }); },
  t5(){ const h = RN(40, 72); return mk("t5", tan2(h).s("P", "A", "", .1, .35).s("P", "B", "", .1, .35).s("A", "B").a("P", "A", "B", 180 - 2 * h, "g").a("A", "P", "B", h, "q"), { h }); },
  t6(){ const h = RN(30, 70); return mk("t6", tan2(h).s("O", "A", "r").s("O", "P").s("P", "A", "", .1, .35).s("P", "B", "", .1, .35).a("P", "A", "B", 180 - 2 * h, "g").a("O", "A", "P", h, "q").a("A", "O", "P", 90, "s"), { h }); },
  t15(){ const h = RN(30, 70); return mk("t15", tan2(h).s("O", "A", "r").s("O", "B", "r").s("O", "P").s("P", "A", "", .1, .35).s("P", "B", "", .1, .35).a("P", "O", "A", 90 - h, "g").a("O", "A", "B", 2 * h, "q", { lf: .26 }).a("A", "O", "P", 90, "s"), { h }); },
  t16(){ const h = RN(32, 68); return mk("t16", tan2(h).c("C", h + 180).s("A", "C").s("O", "B", "r").s("P", "A", "", .1, .35).s("P", "B", "", .1, .35).a("P", "A", "B", 180 - 2 * h, "g").a("O", "B", "C", 180 - 2 * h, "q"), { h }); },
  t7(){ const a = EV(50, 150); return mk("t7", base(a).pt("K", 1, .85).s("O", "A", "r").s("O", "B", "r").s("A", "B").s("A", "K", "", .8, .2).a("O", "A", "B", a, "g").a("A", "K", "B", a / 2, "q").a("A", "O", "K", 90, "s"), { a }); },
  t13(){ const h = RN(30, 72); return mk("t13", tan2(h).c("C", 180 + RN(-38, 38)).s("P", "A", "", .1, .35).s("P", "B", "", .1, .35).s("C", "A").s("C", "B").s("O", "A", "s").s("O", "B", "s").a("P", "A", "B", 180 - 2 * h, "g").a("C", "A", "B", h, "q"), { h }); },

  /* ----- 5 lygis ----- */
  t8(){ const o = tanLen(); return mk("t8", tan2(o.h).s("O", "A", "r").s("O", "B", "r").s("P", "A", "", 0, .3).s("P", "B", "", 0, .3).l("O", "A", o.r, "g").l("P", "A", o.a, "g").l("P", "B", o.a, "q"), o); },
  tp(key, u){ const [r, a, c] = PK(TRI), h = Math.atan(a / r) * 180 / Math.PI;
    return mk(key, tan2(h, 1).s("O", "A", "r").s("O", "P").s("P", "A", "", .2, .45).l("O", "A", r, u === 0 ? "q" : "g").l("P", "A", a, u === 1 ? "q" : "g").l("O", "P", c, u === 2 ? "q" : "g").a("A", "O", "P", 90, "s"), { r, a, c }); },
  t9(){ return G.tp("t9", 2); }, t10(){ return G.tp("t10", 1); }, t11(){ return G.tp("t11", 0); },
  t12(){ const o = tanLen(); return mk("t12", tan2(o.h).s("O", "A", "r").s("O", "B", "r").s("P", "A").s("P", "B").l("O", "A", o.r, "g").l("P", "A", o.a, "g").f("P", 2 * (o.r + o.a)), o); },
  tri3(){ for(;;){ const a = RN(3, 9), b = RN(3, 9), c = RN(3, 9); if(Math.max(a, b, c) / Math.min(a, b, c) <= 2.2 && new Set([a, b, c]).size > 1) return { a, b, c }; } },
  t14a(){ const o = G.tri3(); return mk("t14a", incircle(o.a, o.b, o.c).l("A", "K", o.a, "g").l("K", "B", o.b, "g").l("C", "L", o.c, "g").f("P", 2 * (o.a + o.b + o.c)), o); },
  t14b(){ const o = G.tri3(); return mk("t14b", incircle(o.a, o.b, o.c).l("A", "K", o.a, "g").l("C", "M", o.c, "q"), o); },
  s1(){ const [a, b, c, d] = quad(), u = PK(["a", "b", "c", "d"]), k = x => x === u ? "q" : "g";
    return mk("s1", chords(a, b, c, d, RN(55, 125)).l("A", "E", a, k("a")).l("E", "B", b, k("b")).l("C", "E", c, k("c")).l("E", "D", d, k("d")), { a, b, c, d, u }); },
  s2(){ const [a, b, x] = PK(SQ); return mk("s2", chords(a, b, x, x, RN(55, 125)).t("C", "E").t("E", "D").l("A", "E", a, "g").l("E", "B", b, "g").l("C", "E", x, "q"), { a, b, x }); },
  s3(){ const [a, b, c, d] = quad(); return mk("s3", chords(a, b, c, d, RN(55, 125)).l("A", "E", a, "g").l("E", "B", b, "g").l("C", "E", c, "g").f("CD", c + d), { a, b, c, d }); },
  s4(){ const [a, h] = PK(PERP), e = h * h / a, d = chords(a, e, h, h, 90); return mk("s4", d.t("C", "E").t("E", "D").l("A", "E", a, "g").l("C", "E", h, "g").a("E", "A", "C", 90, "r").f("r", (a + e) / 2), { a, h, e }); },
  s8(){ for(;;){ let [a, b, c, d] = quad(); if(c === d) continue; if(c > d) [c, d] = [d, c]; return mk("s8", chords(a, b, c, d, RN(55, 125)).l("A", "E", a, "g").l("E", "B", b, "g").l("C", "E", c, "q"), { a, b, c, d }); } },

  /* ----- egzaminas ----- */
  s5(){ const o = cross(); return mk("s5", o.d.a("A", "D", "B", o.v, "g").a("B", "A", "C", o.u, "g").a("E", "A", "D", 180 - o.u - o.v, "q"), o); },
  s6(){ const o = cross(); return mk("s6", o.d.a("C", "B", "D", o.v, "g").a("D", "A", "C", o.u, "g").a("A", "D", "B", o.v, "q", { id: "x" }).a("E", "A", "D", 180 - o.u - o.v, "q", { id: "y" }), o); },
  m1(){ const [a, b, c] = arcs3(92, 150); return mk("m1", new Dg().c("A", 0).c("B", a).c("C", a + b).s("A", "B").s("B", "C").s("C", "A").s("O", "A", "r").s("O", "B", "r").s("O", "C", "r").a("A", "O", "B", 90 - a / 2, "g").a("B", "O", "C", 90 - b / 2, "g").a("C", "O", "A", 90 - c / 2, "q"), { p: 90 - a / 2, q: 90 - b / 2 }); },
  m2(){ const t = EV(50, 130); return mk("m2", new Dg(PK([0, 180]) + RN(-12, 12), 1).c("A", 180).c("B", 0).c("C", t).pt("K", 1, .8).s("A", "B").s("A", "C").s("B", "C").s("B", "K", "", .7, .2).a("A", "B", "C", t / 2, "g").a("B", "C", "K", t / 2, "q").a("B", "A", "K", 90, "s"), { A: t / 2 }); }
};
/* lygių užduočių rinkiniai – nuo lengvesnių prie sunkesnių */
const POOL = [
  ["c1", "c2", "c4", "c1b", "c3_3", "c7", "c10", "c5", "c6", "c3_4", "c9", "c8", "c3_5", "c11"],
  ["i1", "i3", "i2", "i4", "i5", "i8", "i6", "i7", "i11", "i9", "i13", "i14", "i10"],
  ["d1", "d2", "d6", "d8", "d3a", "d3b", "d11", "d10", "d4", "d9", "d5"],
  ["t1", "t2", "t3", "t4", "t5", "t6", "t15", "t16", "t7", "t13"],
  ["t8", "s1", "t9", "t10", "t11", "s3", "t12", "s2", "t14a", "s4", "t14b", "s8"],
  ["c11", "i13", "i14", "d9", "i10", "d4", "t16", "t7", "d5", "t13", "t14b", "s4", "s5", "s8", "s6", "m1", "m2"]
];
const SIZE = [8, 8, 8, 8, 8, 10];
/* raundas: pirmiausia seniausiai matytos struktūros; recent – neseniai matytų raktų sąrašas (naujausi gale) */
function round(L, recent){
  recent = recent || []; const pool = POOL[L];
  const pick = pool.map(k => ({ k, r: recent.lastIndexOf(k), z: Math.random() })).sort((a, b) => a.r - b.r || a.z - b.z).slice(0, SIZE[L]).map(o => o.k);
  pick.sort((a, b) => pool.indexOf(a) - pool.indexOf(b));
  return pick.map(k => G[k]());
}
/* brėžinys turi būti įskaitomas: pavadinti taškai negali būti per arti vienas kito */
const tooClose = t => { const n = Object.values(t.d.P); for(let i = 0; i < n.length; i++) for(let j = i + 1; j < n.length; j++) if(Math.hypot(n[i][0] - n[j][0], n[i][1] - n[j][1]) < .27) return true; return false; };
Object.keys(G).forEach(k => { const f = G[k]; if(["c3", "tp", "tri3"].includes(k)) return; G[k] = function(){ let t; for(let i = 0; i < 60; i++){ t = f(); if(!tooClose(t)) break; } return t; }; });
window.MK_RZ = { G, POOL, SIZE, round, Dg };
})();
