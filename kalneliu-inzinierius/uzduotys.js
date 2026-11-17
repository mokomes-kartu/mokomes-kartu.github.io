/* Kalnelių inžinierius – užduočių generatoriai (matematika be tekstų; visi sakiniai – tekstai.lt.js, window.MK_T).
   Užduotis: { type, head, graph, steps[], sol, reveal, dbg }.
   Žingsnių rūšys: num (laukeliai), choice (variantai), gchoice (grafikų variantai), signs (ženklų juosta). */
(function(root){
"use strict";
const T = root.MK_T;
const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = a.slice(); for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const nz = (a, b) => { let v; do v = R(a, b); while(!v); return v; };
const M = "−";
const num = n => { n = Math.round(n * 1000) / 1000; return (n < 0 ? M : "") + String(Math.abs(n)).replace(".", ","); };
const par = n => n < 0 ? "(" + num(n) + ")" : num(n);
const V = v => `<i>${v}</i>`;
const pw = (v, e) => e === 0 ? "" : e === 1 ? V(v) : V(v) + `<sup>${e}</sup>`;
const fx = (n, v) => `${V(n || "f")}(${V(v || "x")})`;
const dfx = (n, v) => `${V(n || "f")}′(${V(v || "x")})`;
const fat = (n, x) => `${V(n || "f")}(${num(x)})`;
const dfat = (n, x) => `${V(n || "f")}′(${num(x)})`;
const frac = (a, b) => `<span class="fr"><span>${a}</span><span>${b}</span></span>`;
const rnd = x => Math.round(x * 1e6) / 1e6;

/* daugianariai: P[i] – koeficientas prie x^i */
const deriv = P => P.slice(1).map((c, i) => c * (i + 1));
const ev = (P, x) => P.reduce((s, c, i) => s + c * Math.pow(x, i), 0);
const mul = (A, B) => { const C = Array(A.length + B.length - 1).fill(0); A.forEach((a, i) => B.forEach((b, j) => C[i + j] += a * b)); return C; };
const trim = P => { P = P.map(rnd); while(P.length > 1 && !P[P.length - 1]) P.pop(); return P; };
function term(c, e, v, first){
  const a = Math.abs(c), s = c < 0 ? (first ? M : " " + M + " ") : (first ? "" : " + ");
  return s + (e === 0 ? num(a) : (a === 1 ? "" : num(a)) + pw(v, e));
}
function poly(P, v, asc){
  v = v || "x"; let idx = P.map((c, i) => i).filter(i => P[i]); if(!asc) idx.reverse();
  if(!idx.length) return "0";
  return idx.map((e, k) => term(P[e], e, v, k === 0)).join("");
}
const lin = (a, b, v) => poly([b, a], v);
const fac = r => r === 0 ? V("x") : "(" + poly([-r, 1]) + ")";   // (x − r)                 // ax + b
const bin = (a, b, v) => "(" + lin(a, b, v) + ")";
/* kubinė funkcija, kurios išvestinė 3a(x − p)(x − q) */
const cubic = (a, p, q, d) => [d || 0, 3 * a * p * q, -1.5 * a * (p + q), a].map(rnd);
const quad = (a, h, c) => [a * h * h + c, -2 * a * h, a];  // a(x − h)² + c
const iv = (a, b, br) => `${br ? "[" : "("}${a === -Infinity ? M + "∞" : num(a)}; ${b === Infinity ? "+∞" : num(b)}${br ? "]" : ")"}`;

/* ---------- žingsnių pagalbininkai ---------- */
function coefStep(d, name, v){
  return { kind: "num", coef: true, q: T.q.coef(dfx(name, v)), pre: dfx(name, v) + " =",
    fields: [3, 2, 1, 0].map(e => ({ ans: d[e] || 0, post: pw(v, e), sep: e ? "+" : "" })) };
}
const numStep = (q, fields, extra) => Object.assign({ kind: "num", q, fields }, extra || {});
const F = (pre, ans, post) => ({ pre: pre || "", ans: rnd(ans), post: post || "" });
function choice(q, correct, wrongs, n){
  n = n || 4; const seen = new Set([correct]), w = [];
  for(const x of shuffle(wrongs)){ if(!seen.has(x)){ seen.add(x); w.push(x); } if(w.length === n - 1) break; }
  const opts = shuffle([correct].concat(w));
  return { kind: "choice", q, opts, ans: opts.indexOf(correct) };
}
const fixedChoice = (q, opts, ans) => ({ kind: "choice", q, opts, ans });
function signStep(q, labels, ans, vals, axis){ return { kind: "signs", q, labels, ans, vals: vals || ["+", M], axis: axis || null }; }
const sg = x => x > 1e-9 ? "+" : x < -1e-9 ? M : "0";
function intervals(pts){ const a = [-Infinity].concat(pts, [Infinity]); return a.slice(0, -1).map((x, i) => [x, a[i + 1]]); }
const mid = ([a, b]) => a === -Infinity ? b - 1 : b === Infinity ? a + 1 : (a + b) / 2;

/* ---------- grafikų aprašai ---------- */
function win(P, xs, pad){ // x langas aplink svarbius taškus
  const lo = Math.min.apply(null, xs), hi = Math.max.apply(null, xs), p = pad == null ? 2 : pad;
  return [Math.floor(lo - p), Math.ceil(hi + p)];
}
const gr = (x, curves, o) => Object.assign({ x, curves }, o || {});
const C1 = "#e0422f", C2 = "#2b59d9";

/* =====================================================================
   1 LYGIS. Išvestinės radimas (bendrasis kursas: funkcijos, išreikštos daugianariais)
   ===================================================================== */
function polyTask(type, P, o){
  o = o || {}; const name = o.name || "f", v = o.v || "x"; P = trim(P); const d = deriv(P);
  const shown = o.shown || poly(P, v, o.asc);
  const lines = []; for(let e = P.length - 1; e >= 0; e--) if(P[e]) lines.push(e ? `(${term(P[e], e, v, true)})′ = ${poly(Array(e - 1).fill(0).concat([P[e] * e]), v)}` : `(${num(P[e])})′ = 0`);
  return { type, head: T.h.fn(`${fx(name, v)} = ${shown}`), steps: [coefStep(d, name, v)],
    sol: (o.expanded ? T.s.expand(`${fx(name, v)} = ${poly(P, v)}`) : "") + (o.note || "") + T.s.power(lines, `${dfx(name, v)} = ${poly(d, v)}`),
    dbg: { P, d } };
}
const G = {};
G.d_quad = () => polyTask("d_quad", [nz(-9, 9), nz(-9, 9), nz(-6, 6)]);
G.d_cubic = () => polyTask("d_cubic", [nz(-9, 9), nz(-9, 9), nz(-6, 6), nz(-4, 4)]);
G.d_gap = () => { const k = R(0, 2); return polyTask("d_gap", k === 0 ? [nz(-9, 9), nz(-12, 12), 0, nz(-3, 3)] : k === 1 ? [nz(-9, 9), 0, nz(-6, 6), nz(-3, 3)] : [0, nz(-9, 9), 0, nz(-3, 3)]); };
G.d_quart = () => { const k = R(0, 1); return polyTask("d_quart", k ? [nz(-9, 9), nz(-9, 9), nz(-5, 5), 0, nz(-2, 2)] : [0, nz(-9, 9), nz(-5, 5), nz(-3, 3), nz(-2, 2)]); };
G.d_asc = () => polyTask("d_asc", [nz(-9, 9), nz(-9, 9), R(0, 1) ? nz(-5, 5) : 0, nz(-3, 3)], { asc: true });
G.d_lin = () => R(0, 1) ? polyTask("d_lin", [nz(-9, 9), nz(-9, 9)], { note: T.s.linNote }) : polyTask("d_lin", [nz(-15, 15)], { note: T.s.constNote });
G.d_binprod = () => { const a = nz(-7, 7), b = nz(-7, 7), k = R(1, 3); return polyTask("d_binprod", mul([a, k], [b, 1]), { shown: bin(k, a) + bin(1, b), expanded: true }); };
G.d_xprod = () => { if(R(0, 1)){ const a = nz(-3, 3), b = nz(-9, 9); return polyTask("d_xprod", mul([0, 1], [b, 0, a]), { shown: V("x") + "(" + poly([b, 0, a]) + ")", expanded: true }); }
  const a = nz(-4, 4), b = nz(-6, 6); return polyTask("d_xprod", mul([0, 0, 1], [b, a]), { shown: V("x") + "<sup>2</sup>" + bin(a, b), expanded: true }); };
G.d_square = () => { const a = pick([1, 1, 2, 3, -1, -2]), b = nz(-6, 6); return polyTask("d_square", mul([b, a], [b, a]), { shown: bin(a, b) + "<sup>2</sup>", expanded: true }); };
G.d_quadprod = () => { const a = nz(-5, 5), b = nz(-5, 5); return polyTask("d_quadprod", mul([a, 0, 1], [b, 1]), { shown: "(" + poly([a, 0, 1]) + ")" + bin(1, b), expanded: true }); };
G.d_letter = () => { const [n, v] = pick([["s", "t"], ["h", "t"], ["g", "x"], ["v", "t"], ["p", "u"]]); return polyTask("d_letter", [nz(-9, 9), nz(-9, 9), nz(-6, 6), R(0, 1) ? nz(-2, 2) : 0], { name: n, v }); };
G.d_frac = () => {
  const a = pick([1, 2, 4, 5, -1, -2]), b = pick([1, 3, 5, -1, -3]), c = nz(-8, 8), d = nz(-9, 9);
  const t3 = (a < 0 ? M : "") + frac(Math.abs(a), 3) + pw("x", 3), t2 = (b < 0 ? " " + M + " " : " + ") + frac(Math.abs(b), 2) + pw("x", 2);
  return polyTask("d_frac", [d, c, b / 2, a / 3], { shown: t3 + t2 + (c < 0 ? " " + M + " " : " + ") + term(Math.abs(c), 1, "x", true) + (d < 0 ? " " + M + " " : " + ") + num(Math.abs(d)), note: T.s.fracNote });
};
/* polyTask spausdina P – trupmeniniams koeficientams sprendimo eilutės rašomos atskirai */
const _df = G.d_frac;
G.d_frac = () => { const t = _df(); const d = t.dbg.d.map(Math.round); t.steps = [coefStep(d, "f", "x")]; t.sol = T.s.fracNote + T.s.power([], `${dfx()} = ${poly(d)}`); t.dbg.d = d; return t; };

/* =====================================================================
   2 LYGIS. Išvestinės reikšmė, liestinė, fizikinė prasmė
   ===================================================================== */
function rq(){ return [nz(-8, 8), nz(-8, 8), pick([1, 1, 2, 3, -1, -2, -3])]; }
function rc(){ return [nz(-6, 6), nz(-9, 9), nz(-4, 4), pick([1, 1, -1, 2])]; }
function tanReveal(P, x0, pad){ const k = ev(deriv(P), x0), y0 = ev(P, x0); return gr(win(P, [x0], pad || 3), [{ P, color: C2 }], { tan: { x0, k, y0 }, pts: [{ x: x0, y: y0 }], cart: { P, at: x0 } }); }
G.v_quad = () => { const P = rq(), x0 = R(-4, 4), d = deriv(P), k = ev(d, x0);
  return { type: "v_quad", head: T.h.fn(`${fx()} = ${poly(P)}`), steps: [numStep(T.q.valueAt(dfat("f", x0)), [F(dfat("f", x0) + " =", k)])],
    sol: T.s.valueAt(`${dfx()} = ${poly(d)}`, `${dfat("f", x0)} = ${subst(d, x0)} = <b>${num(k)}</b>`), reveal: tanReveal(P, x0), dbg: { P, x0, k } }; };
G.v_cubic = () => { const P = rc(), x0 = R(-2, 3), d = deriv(P), k = ev(d, x0);
  return { type: "v_cubic", head: T.h.fn(`${fx()} = ${poly(P)}`), steps: [numStep(T.q.valueAt(dfat("f", x0)), [F(dfat("f", x0) + " =", k)])],
    sol: T.s.valueAt(`${dfx()} = ${poly(d)}`, `${dfat("f", x0)} = ${subst(d, x0)} = <b>${num(k)}</b>`), reveal: tanReveal(P, x0, 2), dbg: { P, x0, k } }; };
function subst(P, x){ // įstatytas reiškinys, pvz. 3 · (−2)² − 4 · (−2) + 1
  const idx = P.map((c, i) => i).filter(i => P[i]).reverse(); if(!idx.length) return "0";
  return idx.map((e, k) => { const c = P[e], a = Math.abs(c), s = c < 0 ? (k ? " " + M + " " : M) : (k ? " + " : "");
    return s + (e === 0 ? num(a) : (a === 1 ? "" : num(a) + " · ") + par(x) + (e > 1 ? `<sup>${e}</sup>` : "")); }).join("");
}
G.v_slope = () => { const P = quad(pick([1, -1, 0.5, -0.5, 2]), R(-3, 3), R(-4, 4)), x0 = R(-3, 4), d = deriv(P), k = ev(d, x0);
  return { type: "v_slope", head: T.h.slope(`${fx()} = ${polyH(P)}`, num(x0)), steps: [numStep(T.q.slope, [F(V("k") + " =", k)])],
    sol: T.s.slope(`${dfx()} = ${polyH(d)}`, `${V("k")} = ${dfat("f", x0)} = <b>${num(k)}</b>`), reveal: tanReveal(P, x0), dbg: { P, x0, k } }; };
/* daugianaris su 0,5 koeficientais */
function polyH(P){ return poly(P.map(rnd)); }
G.v_zero_quad = () => { const a = pick([1, -1, 2, -2, 3]), h = nz(-5, 5), P = quad(a, h, R(-6, 6)), d = deriv(P);
  return { type: "v_zero_quad", head: T.h.fn(`${fx()} = ${poly(P)}`), steps: [numStep(T.q.zeroDeriv, [F(V("x") + " =", h)])],
    sol: T.s.zero(`${dfx()} = ${poly(d)}`, `${poly(d)} = 0`, `${V("x")} = <b>${num(h)}</b>`), reveal: tanReveal(P, h), dbg: { P, x0: h, k: 0 } }; };
G.v_par_quad = () => { const a = pick([1, -1, 2, -2]), b = nz(-6, 6), P = [R(-5, 5), b, a], x0 = nz(-4, 4), d = deriv(P), k = ev(d, x0), m = nz(-7, 7);
  return { type: "v_par_quad", head: T.h.parallel(`${fx()} = ${poly(P)}`, `${V("y")} = ${lin(k, m)}`), steps: [numStep(T.q.parallelX, [F(V("x") + " =", x0)])],
    sol: T.s.parallel(num(k), `${dfx()} = ${poly(d)}`, `${poly(d)} = ${num(k)}`, `${V("x")} = <b>${num(x0)}</b>`),
    reveal: gr(win(P, [x0], 3), [{ P, color: C2 }], { tan: { x0, k, y0: ev(P, x0) }, pts: [{ x: x0, y: ev(P, x0) }], lines: [{ k, b: m, color: "#8a93ad", dash: true }] }), dbg: { P, x0, k } }; };
G.v_zero_cubic = () => { let p, q; do { p = R(-4, 3); q = R(p + 1, 5); } while((p + q) % 2); const a = pick([1, -1]), P = cubic(a, p, q, R(-5, 5)), d = deriv(P);
  return { type: "v_zero_cubic", head: T.h.fn(`${fx()} = ${poly(P)}`), steps: [numStep(T.q.zeroDeriv2, [F(V("x") + "<sub>1</sub> =", p), F(V("x") + "<sub>2</sub> =", q)])],
    sol: T.s.zero2(`${dfx()} = ${poly(d)}`, `${poly(d)} = 0`, `${poly(d.map(c => c / (3 * a)))} = 0`, `${V("x")}<sub>1</sub> = <b>${num(p)}</b>, ${V("x")}<sub>2</sub> = <b>${num(q)}</b>`),
    reveal: gr(win(P, [p, q], 2), [{ P, color: C2 }], { pts: [{ x: p, y: ev(P, p) }, { x: q, y: ev(P, q) }], hl: [p, q] }), dbg: { P, roots: [p, q] } }; };
function tangentTask(type, P, x0, pad){ const d = deriv(P), k = ev(d, x0), y0 = ev(P, x0), b = y0 - k * x0;
  return { type, head: T.h.tangent(`${fx()} = ${poly(P)}`, num(x0)), steps: [numStep(T.q.tangentEq, [F(V("y") + " =", k, V("x") + " +"), F("", b)])],
    sol: T.s.tangent(`${fat("f", x0)} = <b>${num(y0)}</b>`, `${dfx()} = ${poly(d)}`, `${dfat("f", x0)} = <b>${num(k)}</b>`, `${V("y")} = ${num(y0)} + ${par(k)}(${V("x")} ${x0 < 0 ? "+" : M} ${num(Math.abs(x0))})`, `${V("y")} = ${lin(k, b)}`),
    reveal: tanReveal(P, x0, pad), dbg: { P, x0, k, b } }; }
G.v_tan_quad = () => tangentTask("v_tan_quad", [R(-5, 5), nz(-5, 5), pick([1, -1, 2])], nz(-3, 3));
G.v_tan_cubic = () => tangentTask("v_tan_cubic", [R(-4, 4), R(-5, 5), R(-2, 2), pick([1, -1])], pick([-2, -1, 1, 2]), 2);
G.v_speed = () => { const P = [0, nz(1, 9), R(1, 4), R(0, 1)], t0 = R(1, 4), d = deriv(P), k = ev(d, t0);
  return { type: "v_speed", head: T.h.motion(`${fx("s", "t")} = ${poly(P, "t")}`), steps: [numStep(T.q.speed(num(t0)), [F(V("v") + " =", k, T.u.ms)])],
    sol: T.s.speed(`${fx("v", "t")} = ${dfx("s", "t")} = ${poly(d, "t")}`, `${fat("v", t0)} = ${subst(d, t0)} = <b>${num(k)}</b>`), dbg: { P, x0: t0, k } }; };
G.v_stop = () => { const v0 = pick([10, 20, 30, 40, 50]), h0 = pick([0, 0, 2, 5, 10]), P = [h0, v0, -5], d = deriv(P), t = v0 / 10;
  return { type: "v_stop", head: T.h.ball(`${fx("h", "t")} = ${poly(P, "t", true)}`), steps: [numStep(T.q.stop, [F(V("t") + " =", t, T.u.s)])],
    sol: T.s.stop(`${fx("v", "t")} = ${dfx("h", "t")} = ${poly(d, "t", true)}`, `${poly(d, "t", true)} = 0`, `${V("t")} = <b>${num(t)}</b>`),
    reveal: gr([0, Math.ceil(v0 / 5) + 1], [{ P, color: C2 }], { pts: [{ x: t, y: ev(P, t) }], tan: { x0: t, k: 0, y0: ev(P, t) }, ymin: 0, ax: ["t", "h"] }), dbg: { P, x0: t, k: 0 } }; };
G.v_par_point = () => { const a = pick([1, -1, 2]), P = [R(-4, 4), nz(-4, 4), a], x0 = nz(-3, 3), d = deriv(P), k = ev(d, x0), y0 = ev(P, x0), m = nz(-6, 6);
  return { type: "v_par_point", head: T.h.parallel(`${fx()} = ${poly(P)}`, `${V("y")} = ${lin(k, m)}`), steps: [numStep(T.q.parallelPt, [F("(", x0, ";"), F("", y0, ")")])],
    sol: T.s.parallelPt(num(k), `${dfx()} = ${poly(d)}`, `${poly(d)} = ${num(k)}`, `${V("x")} = ${num(x0)}`, `${fat("f", x0)} = ${num(y0)}`, `(${num(x0)}; ${num(y0)})`),
    reveal: gr(win(P, [x0], 3), [{ P, color: C2 }], { tan: { x0, k, y0 }, pts: [{ x: x0, y: y0 }], lines: [{ k, b: m, color: "#8a93ad", dash: true }] }), dbg: { P, x0, k, y0 } }; };
G.v_read = () => { // liestinė nubrėžta – krypties koeficientą reikia perskaityti iš dviejų pažymėtų taškų
  const a = pick([0.5, -0.5, 0.25, -0.25]), h = R(-2, 2), x0 = h + (Math.abs(a) === 0.25 ? pick([-4, -2, 2, 4]) : pick([-2, -1, 1, 2])), P = quad(a, h, R(-2, 3)), d = deriv(P), k = ev(d, x0), y0 = ev(P, x0), x1 = x0 + pick([-2, 2]), y1 = y0 + k * (x1 - x0);
  return { type: "v_read", head: T.h.read(num(x0)), graph: gr([Math.min(x0, x1, h) - 3, Math.max(x0, x1, h) + 3], [{ P, color: C2 }], { tan: { x0, k, y0 }, pts: [{ x: x0, y: y0, label: `A(${num(x0)}; ${num(y0)})` }, { x: x1, y: y1, label: `B(${num(x1)}; ${num(y1)})`, color: C1 }] }),
    steps: [numStep(T.q.read(dfat("f", x0)), [F(dfat("f", x0) + " =", k)])],
    sol: T.s.read(`${V("k")} = (${num(y1)} ${M} ${par(y0)}) : (${num(x1)} ${M} ${par(x0)}) = <b>${num(k)}</b>`, `${dfat("f", x0)} = ${num(k)}`), dbg: { P, x0, k } }; };

/* =====================================================================
   3 LYGIS. Didėjimo ir mažėjimo intervalai, ekstremumo taškai
   ===================================================================== */
function pq(even){ let p, q; do { p = R(-4, 2); q = p + R(2, 5); } while(even && (p + q) % 2); return [p, q]; }
function signData(d, pts){ const ivs = intervals(pts); return { labels: ivs.map(i => iv(i[0], i[1])), ans: ivs.map(i => sg(ev(d, mid(i)))), axis: pts }; }
function trackReveal(P, pts, o){ return gr(win(P, pts.length ? pts : [0], 2), [{ P, color: C2 }], Object.assign({ pts: pts.map(x => ({ x, y: ev(P, x) })), cart: { P }, track: true }, o || {})); }
const arrows = ans => ans.map(s => s === "+" ? "↗" : "↘").join(" ");
G.m_quad = () => { const a = pick([1, -1, 2, -2, 3]), h = nz(-5, 5), P = quad(a, h, R(-6, 6)), d = deriv(P), S = signData(d, [h]);
  return { type: "m_quad", head: T.h.fn(`${fx()} = ${poly(P)}`), steps: [
      numStep(T.q.crit1, [F(V("x") + " =", h)]),
      signStep(T.q.signs(dfx()), S.labels, S.ans, null, S.axis),
      fixedChoice(T.q.kind(num(h)), T.o.kinds, a > 0 ? 1 : 0)],
    sol: T.s.mono(`${dfx()} = ${poly(d)}`, `${poly(d)} = 0, ${V("x")} = ${num(h)}`, S.labels.map((l, i) => `${l}: ${S.ans[i]}`).join(", "), arrows(S.ans), a > 0 ? T.s.isMin(num(h)) : T.s.isMax(num(h))),
    reveal: trackReveal(P, [h]), dbg: { P, crit: [h] } }; };
function cubicMono(type, a){ const [p, q] = pq(a % 2 !== 0), P = cubic(a, p, q, R(-4, 4)), d = deriv(P), S = signData(d, [p, q]), xmax = a > 0 ? p : q;
  return { type, head: T.h.fn(`${fx()} = ${poly(P)}`), steps: [
      numStep(T.q.crit2, [F(V("x") + "<sub>1</sub> =", p), F(V("x") + "<sub>2</sub> =", q)]),
      signStep(T.q.signs(dfx()), S.labels, S.ans, null, S.axis),
      fixedChoice(T.q.whichMax, [`${V("x")} = ${num(p)}`, `${V("x")} = ${num(q)}`, T.o.noMax], a > 0 ? 0 : 1)],
    sol: T.s.mono(`${dfx()} = ${poly(d)} = ${num(3 * a)}${fac(p)}${fac(q)}`, `${V("x")}<sub>1</sub> = ${num(p)}, ${V("x")}<sub>2</sub> = ${num(q)}`, S.labels.map((l, i) => `${l}: ${S.ans[i]}`).join(", "), arrows(S.ans), T.s.maxMin(num(xmax), num(a > 0 ? q : p))),
    reveal: trackReveal(P, [p, q]), dbg: { P, crit: [p, q] } }; }
G.m_cubic_up = () => cubicMono("m_cubic_up", pick([1, 2]));
G.m_cubic_down = () => cubicMono("m_cubic_down", pick([-1, -2]));
G.m_double = () => { const a = pick([1, -1, 2]), p = nz(-3, 3), P = [-a * p * p * p + R(-4, 4), 3 * a * p * p, -3 * a * p, a], d = deriv(P), S = signData(d, [p]);
  return { type: "m_double", head: T.h.fn(`${fx()} = ${poly(P)}`), steps: [
      numStep(T.q.crit1, [F(V("x") + " =", p)]),
      signStep(T.q.signs(dfx()), S.labels, S.ans, null, S.axis),
      fixedChoice(T.q.kind(num(p)), T.o.kinds, 2)],
    sol: T.s.mono(`${dfx()} = ${poly(d)} = ${num(3 * a)}${fac(p)}<sup>2</sup>`, `${V("x")} = ${num(p)}`, S.labels.map((l, i) => `${l}: ${S.ans[i]}`).join(", "), arrows(S.ans), T.s.noExt(num(p))),
    reveal: trackReveal(P, [p]), dbg: { P, crit: [p] } }; };
G.m_factored = () => { const [p, q] = pq(false), k = pick([1, 2, 3, -1, -2, -3]), d = mul([-p * k, k], [-q, 1]), S = signData(d, [p, q]);
  const inc = k > 0 ? `${iv(-Infinity, p, 0).replace(")", "]")} ${T.w.and} [${num(q)}; +∞)` : iv(p, q, true), dec = k > 0 ? iv(p, q, true) : `${iv(-Infinity, p, 0).replace(")", "]")} ${T.w.and} [${num(q)}; +∞)`;
  return { type: "m_factored", head: T.h.dgiven(`${dfx()} = ${k === 1 ? "" : k === -1 ? M : num(k)}${fac(p)}${fac(q)}`), steps: [
      signStep(T.q.signs(dfx()), S.labels, S.ans, null, S.axis),
      choice(T.q.incWhere, inc, [dec, k > 0 ? `[${num(q)}; +∞)` : iv(-Infinity, q, 0).replace(")", "]"), k > 0 ? iv(-Infinity, q, 0).replace(")", "]") : `[${num(p)}; +∞)`, `${iv(-Infinity, -q, 0).replace(")", "]")} ${T.w.and} [${num(-p)}; +∞)`])],
    sol: T.s.factored(`${num(p)} ${T.w.and} ${num(q)}`, S.labels.map((l, i) => `${l}: ${S.ans[i]}`).join(", "), arrows(S.ans), inc), dbg: { d, crit: [p, q] } }; };
G.m_dgraph = () => { const [p, q] = pq(false), k = pick([0.5, -0.5, 1, -1]), d = mul([-p * k, k], [-q, 1]), xmax = k > 0 ? p : q;
  const inc = k > 0 ? `${iv(-Infinity, p, 0).replace(")", "]")} ${T.w.and} [${num(q)}; +∞)` : iv(p, q, true), dec = k > 0 ? iv(p, q, true) : `${iv(-Infinity, p, 0).replace(")", "]")} ${T.w.and} [${num(q)}; +∞)`;
  return { type: "m_dgraph", head: T.h.dgraph, graph: gr([p - 2, q + 2], [{ P: d, color: C1 }], { label: `${V("y")} = ${dfx()}`, pts: [{ x: p, y: 0, label: num(p) }, { x: q, y: 0, label: num(q) }] }), steps: [
      choice(T.q.incWhere, inc, [dec, `[${num((p + q) / 2)}; +∞)`, iv(-Infinity, (p + q) / 2, 0).replace(")", "]")]),
      numStep(T.q.maxPoint, [F(V("x") + " =", xmax)])],
    sol: T.s.dgraph(inc, num(xmax), k > 0), dbg: { d, crit: [p, q], xmax } }; };
G.m_extval = () => { const a = pick([1, -1]), [p, q] = pq(true), P = cubic(a, p, q, R(-5, 5)), d = deriv(P), xmax = a > 0 ? p : q, xmin = a > 0 ? q : p;
  return { type: "m_extval", head: T.h.fn(`${fx()} = ${poly(P)}`), steps: [
      numStep(T.q.maxPoint, [F(V("x") + "<sub>max</sub> =", xmax)]),
      numStep(T.q.maxVal, [F(fat("f", xmax) + " =", ev(P, xmax))])],
    sol: T.s.extval(`${dfx()} = ${poly(d)}`, `${num(p)} ${T.w.and} ${num(q)}`, num(xmax), `${fat("f", xmax)} = ${subst(P, xmax)} = <b>${num(ev(P, xmax))}</b>`),
    reveal: trackReveal(P, [p, q]), dbg: { P, crit: [p, q], xmax, xmin } }; };
G.m_decint = () => { const a = pick([1, -1, 2]), [p, q] = pq(a % 2 !== 0), P = cubic(a, p, q, R(-5, 5)), d = deriv(P);
  return { type: "m_decint", head: T.h.fn(`${fx()} = ${poly(P)}`), steps: [numStep(a > 0 ? T.q.decInt : T.q.incInt, [F("[", p, ";"), F("", q, "]")])],
    sol: T.s.decint(`${dfx()} = ${poly(d)}`, `${num(p)} ${T.w.and} ${num(q)}`, a > 0, iv(p, q, true)), reveal: trackReveal(P, [p, q]), dbg: { P, crit: [p, q] } }; };
G.m_nocrit = () => { const a = pick([1, -1, 2]), m = R(1, 3), s = pick([0, 1, -1]), P = s ? [R(-5, 5), a * (3 + 3 * m), 3 * a * s, a] : [R(-5, 5), a * R(1, 9), 0, a], d = deriv(P);
  return { type: "m_nocrit", head: T.h.fn(`${fx()} = ${poly(P)}`), steps: [
      fixedChoice(T.q.howManyCrit, ["0", "1", "2", "3"], 0),
      fixedChoice(T.q.behaviour, T.o.behave, a > 0 ? 0 : 1)],
    sol: T.s.nocrit(`${dfx()} = ${poly(d)}`, `${poly(d)} = 0`, a > 0), reveal: trackReveal(P, []), dbg: { P, crit: [] } }; };
G.m_points = () => { const a = pick([0.5, -0.5, 0.25, -0.25]), [p, q] = pq(false), P = cubic(a / 3 * 2, p, q, 0), d = deriv(P);
  const cand = shuffle([p - 1, (p + q) / 2, q + 1, pick([p, q])]).slice(0, 3).sort((x, y) => x - y), names = ["A", "B", "C"];
  return { type: "m_points", head: T.h.points, graph: gr([p - 2, q + 2], [{ P, color: C2 }], { pts: cand.map((x, i) => ({ x, y: ev(P, x), label: names[i], color: C1 })), plain: true }), steps: [
      signStep(T.q.signAt, names, cand.map(x => sg(ev(d, x))), ["+", M, "0"])],
    sol: T.s.points(cand.map((x, i) => `${names[i]}: ${T.s.pt[sg(ev(d, x))]}`)), dbg: { P, cand } }; };

/* =====================================================================
   4 LYGIS. Didžiausioji ir mažiausioji reikšmės uždarame intervale
   ===================================================================== */
function closedTask(type, P, a, b, o){ o = o || {}; const d = deriv(P), crit = critOf(d).filter(x => x > a && x < b), cand = [a].concat(crit, [b]), vals = cand.map(x => ev(P, x)), mx = Math.max.apply(null, vals), mn = Math.min.apply(null, vals);
  const all = critOf(d), table = cand.map((x, i) => `${fat("f", x)} = ${num(vals[i])}`).join(", ");
  const steps = o.withX ? [numStep(T.q.closedMaxX(iv(a, b, true)), [F(V("x") + " =", cand[vals.indexOf(mx)]), F(T.w.maxv + " =", mx)])]
    : [numStep(T.q.closed(iv(a, b, true)), [F(T.w.maxv + " =", mx), F(T.w.minv + " =", mn)])];
  return { type, head: o.head ? o.head(`${fx(o.n, "x")} = ${poly(P)}`, iv(a, b, true)) : T.h.closed(`${fx()} = ${poly(P)}`, iv(a, b, true)), steps,
    sol: T.s.closed(`${dfx(o.n)} = ${poly(d)}`, all.length ? all.map(num).join(` ${T.w.and} `) : "", crit.length ? crit.map(num).join(` ${T.w.and} `) : "", iv(a, b, true), table.replace(/<i>f<\/i>/g, V(o.n || "f")), num(mx), num(mn)),
    reveal: gr([a - 1, b + 1], [{ P, color: "#b9c2dc" }, { P, color: C2, dom: [a, b] }], { pts: cand.map((x, i) => ({ x, y: vals[i], color: vals[i] === mx ? C1 : vals[i] === mn ? "#1f8a52" : null })), vl: [a, b], cart: { P, dom: [a, b] }, track: true }),
    dbg: { P, a, b, mx, mn, withX: !!o.withX } }; }
function critOf(d){ d = trim(d); if(d.length === 2) return [rnd(-d[0] / d[1])]; if(d.length === 3){ const D = d[1] * d[1] - 4 * d[2] * d[0]; if(D < -1e-9) return []; const r = Math.sqrt(Math.max(D, 0)); return [rnd((-d[1] - r) / (2 * d[2])), rnd((-d[1] + r) / (2 * d[2]))].sort((x, y) => x - y).filter((x, i, A) => !i || x !== A[i - 1]); } return []; }
G.c_quad_in = () => { const a = pick([1, -1, 2, -2]), h = R(-3, 3), l = R(1, 3), r = R(1, 4); return closedTask("c_quad_in", quad(a, h, R(-6, 6)), h - l, h + (r === l ? r + 1 : r)); };
G.c_quad_out = () => { const a = pick([1, -1, 2]), h = R(-3, 3), s = pick([-1, 1]), l = R(1, 2); return closedTask("c_quad_out", quad(a, h, R(-6, 6)), s > 0 ? h + l : h - l - R(2, 4), s > 0 ? h + l + R(2, 4) : h - l); };
G.c_cubic_both = () => { const a = pick([1, -1]), [p, q] = pq(true); return closedTask("c_cubic_both", cubic(a, p, q, R(-4, 4)), p - R(1, 2), q + R(1, 2)); };
G.c_cubic_one = () => { const a = pick([1, -1]), [p, q] = pq(true), left = R(0, 1); return closedTask("c_cubic_one", cubic(a, p, q, R(-4, 4)), left ? p - R(1, 2) : p + 1, left ? q - 1 : q + R(1, 2)); };
G.c_cubic_none = () => { const a = pick([1, -1]), [p, q] = pq(true), k = R(0, 1); return closedTask("c_cubic_none", cubic(a, p, q, R(-4, 4)), k ? q + 1 : p - 3, k ? q + 3 : p - 1); };
G.c_maxx = () => { for(;;){ const a = pick([1, -1]), [p, q] = pq(true), P = cubic(a, p, q, R(-4, 4)), A = p - R(1, 2), B = q + R(1, 2), mx = Math.max(ev(P, A), ev(P, p), ev(P, q), ev(P, B));
  if([A, p, q, B].filter(x => Math.abs(ev(P, x) - mx) < 1e-9).length === 1) return closedTask("c_maxx", P, A, B, { withX: true }); } };
G.c_track = () => { const p = R(1, 2), q = p + pick([2, 4]); let P = cubic(1, p, q, 0); const b = q + R(1, 2), lo = Math.min(ev(P, 0), ev(P, q)); P[0] = (lo < 2 ? 2 - lo : 0) + R(0, 4);
  return closedTask("c_track", P, 0, b, { head: T.h.track, n: "h" }); };

/* =====================================================================
   5 LYGIS. Grafikai: funkcija ir jos išvestinė
   ===================================================================== */
const XS = [-5, 5];
const sm = (P, color) => gr(XS, [{ P, color }], { small: true });
function gchoice(q, correct, wrongs){ const opts = shuffle([correct].concat(wrongs)); return { kind: "gchoice", q, opts, ans: opts.indexOf(correct) }; }
G.g_par_line = () => { const a = pick([0.5, -0.5, 0.25, -0.25]), h = pick([-2, -1, 1, 2]), P = quad(a, h, a > 0 ? -2 : 2), k = 2 * a, b = -2 * a * h;
  return { type: "g_par_line", head: T.h.gFtoD, graph: gr(XS, [{ P, color: C2 }], { label: `${V("y")} = ${fx()}` }),
    steps: [gchoice(T.q.gFtoD, sm([b, k], C1), [sm([-b, -k], C1), sm([-b, k], C1), sm([b, -k], C1)])], sol: T.s.gParLine(num(h), a > 0), dbg: { P, kind: "FtoD" } }; };
function pq5(){ let p, q; do { p = R(-3, 1); q = p + R(2, 4); } while(p + q === 0 || q > 3); return [p, q]; }
G.g_cub_par = () => { const a = pick([0.2, -0.2]), [p, q] = pq5(), P = cubic(a, p, q, 0), dd = (s, m) => mul([-(m ? -q : p) * 3 * a * s, 3 * a * s], [-(m ? -p : q), 1]);
  return { type: "g_cub_par", head: T.h.gFtoD, graph: gr(XS, [{ P, color: C2 }], { label: `${V("y")} = ${fx()}` }),
    steps: [gchoice(T.q.gFtoD, sm(dd(1, 0), C1), [sm(dd(-1, 0), C1), sm(dd(1, 1), C1), sm(dd(-1, 1), C1)])], sol: T.s.gCubPar(num(p), num(q), a > 0), dbg: { P, kind: "FtoD" } }; };
G.g_line_par = () => { const a = pick([0.5, -0.5, 0.25, -0.25]), h = pick([-2, -1, 1, 2]), c = a > 0 ? -2 : 2, d = [-2 * a * h, 2 * a];
  return { type: "g_line_par", head: T.h.gDtoF, graph: gr(XS, [{ P: d, color: C1 }], { label: `${V("y")} = ${dfx()}` }),
    steps: [gchoice(T.q.gDtoF, sm(quad(a, h, c), C2), [sm(quad(-a, h, -c), C2), sm(quad(a, -h, c), C2), sm(quad(-a, -h, -c), C2)])], sol: T.s.gLinePar(num(h), a > 0), dbg: { d, kind: "DtoF" } }; };
G.g_par_cub = () => { const a = pick([0.2, -0.2]), [p, q] = pq5(), d = mul([-p * 1.5 * a, 1.5 * a], [-q, 1]).map(c => c * 2 / 2);
  return { type: "g_par_cub", head: T.h.gDtoF, graph: gr(XS, [{ P: d.map(c => c), color: C1 }], { label: `${V("y")} = ${dfx()}` }),
    steps: [gchoice(T.q.gDtoF, sm(cubic(a / 2, p, q, 0), C2), [sm(cubic(-a / 2, p, q, 0), C2), sm(cubic(a / 2, -q, -p, 0), C2), sm(cubic(-a / 2, -q, -p, 0), C2)])], sol: T.s.gParCub(num(p), num(q), a > 0), dbg: { d, kind: "DtoF" } }; };
G.g_maxfromd = () => { const lineCase = R(0, 2) === 0; let d, x, why;
  if(lineCase){ const h = R(-3, 3), k = pick([-1, -0.5]); d = [-k * h, k]; x = h; why = T.s.gMaxLine(num(h)); }
  else { const [p, q] = pq5(), k = pick([0.5, -0.5]); d = mul([-p * k, k], [-q, 1]); x = k > 0 ? p : q; why = T.s.gMaxPar(num(p), num(q), num(x)); }
  return { type: "g_maxfromd", head: T.h.dgraph, graph: gr(XS, [{ P: d, color: C1 }], { label: `${V("y")} = ${dfx()}` }), steps: [numStep(T.q.maxPoint, [F(V("x") + " =", x)])], sol: why, dbg: { d, xmax: x } }; };
function fourPts(){ const a = pick([0.25, -0.25]), [p, q] = pq5(), P = cubic(a / 1.5, p, q, 0), d = deriv(P); return { P, d, p, q, a }; }
G.g_steepest = () => { let o, xs, sl; do { o = fourPts(); xs = shuffle([o.p - 1.5, o.p - 0.5, o.p, (o.p + o.q) / 2, o.q, o.q + 0.5, o.q + 1.5]).slice(0, 4).sort((x, y) => x - y); sl = xs.map(x => rnd(ev(o.d, x))); } while(sl.filter(s => s === Math.max.apply(null, sl)).length > 1 || Math.max.apply(null, sl) <= 0 || xs[0] < -4.6 || xs[3] > 4.6);
  const names = ["A", "B", "C", "D"], best = sl.indexOf(Math.max.apply(null, sl));
  return { type: "g_steepest", head: T.h.points, graph: gr(XS, [{ P: o.P, color: C2 }], { pts: xs.map((x, i) => ({ x, y: ev(o.P, x), label: names[i], color: C1 })), plain: true }),
    steps: [fixedChoice(T.q.steepest, names, best)], sol: T.s.steepest(names[best]), dbg: { P: o.P, xs, best } }; };
G.g_zero = () => { let o, xs; do { o = fourPts(); const z = pick([o.p, o.q]); xs = shuffle([o.p - 1.5, o.p - 1, (o.p + o.q) / 2, o.q + 1, o.q + 1.5].filter(x => x !== z)).slice(0, 3).concat([z]).sort((x, y) => x - y); } while(xs[0] < -4.6 || xs[3] > 4.6 || xs.filter(x => Math.abs(ev(o.d, x)) < 1e-9).length !== 1);
  const names = ["A", "B", "C", "D"], zi = xs.findIndex(x => Math.abs(ev(o.d, x)) < 1e-9);
  return { type: "g_zero", head: T.h.points, graph: gr(XS, [{ P: o.P, color: C2 }], { pts: xs.map((x, i) => ({ x, y: ev(o.P, x), label: names[i], color: C1 })), plain: true }),
    steps: [fixedChoice(T.q.zeroAt, names, zi)], sol: T.s.zeroAt(names[zi]), dbg: { P: o.P, xs, best: zi } }; };
G.g_count = () => { const k = R(0, 3); let d, n;
  if(k === 0){ const h = R(-3, 3), s = pick([1, -1]); d = [-s * h * 0.5, s * 0.5]; n = 1; }
  else if(k === 1){ const [p, q] = pq5(), s = pick([0.5, -0.5]); d = mul([-p * s, s], [-q, 1]); n = 2; }
  else if(k === 2){ const h = R(-2, 2), s = pick([0.5, -0.5]); d = mul([-h * s, s], [-h, 1]); n = 0; }
  else { const h = R(-2, 2), s = pick([0.5, -0.5]); d = quad(s, h, s > 0 ? 1 : -1); n = 0; }
  return { type: "g_count", head: T.h.dgraph, graph: gr(XS, [{ P: d, color: C1 }], { label: `${V("y")} = ${dfx()}` }), steps: [fixedChoice(T.q.howManyExt, ["0", "1", "2", "3"], n)], sol: T.s.count[k], dbg: { d, n } }; };

/* =====================================================================
   6 LYGIS. Optimizavimo uždaviniai
   ===================================================================== */
function opt(type, o){ // o: text, fnName, v, P (tikslo funkcija), wrongs (kitų funkcijų html), x, val, units, min
  const d = deriv(o.P), n = o.fnName, v = o.v || "x", steps = [];
  const shown = o.shown || poly(o.P, v);
  if(o.wrongs) steps.push(choice(T.q.model(fx(n, v)), `${fx(n, v)} = ${shown}`, o.wrongs.map(w => `${fx(n, v)} = ${w}`)));
  steps.push(numStep(o.qx, [F(V(v) + " =", o.x, o.ux || "")]));
  steps.push(numStep(o.qv, [F(o.vl || (fat(n, o.x) + " ="), o.val, o.uv || "")]));
  return { type, head: T.h.word(o.text, o.wrongs ? "" : `${fx(n, v)} = ${shown}`), steps,
    sol: T.s.opt(o.wrongs ? `${fx(n, v)} = ${shown}${o.shown ? " = " + poly(o.P, v) : ""}` : "", `${dfx(n, v)} = ${poly(d, v)}`, `${poly(d, v)} = 0`, num(o.x), o.dom, !!o.min, `${fat(n, o.x)} = <b>${num(o.val)}</b>`),
    reveal: o.rev === false ? null : gr(o.win, [{ P: o.P, color: C2, dom: o.win }], { pts: [{ x: o.x, y: o.val, color: C1 }], tan: { x0: o.x, k: 0, y0: o.val }, ax: [v, n], ymin: o.ymin }),
    dbg: { P: o.P, x: o.x, val: o.val, dom: o.domN, min: !!o.min } };
}
const xl = (a, b, v) => `${V(v || "x")}(${lin(a, b, v)})`;   // x(ax + b)
G.o_wall = () => { const L = pick([20, 24, 28, 32, 40, 48, 60, 80]), x = L / 4;
  return opt("o_wall", { text: T.w6.wall(L), fnName: "S", P: [0, L, -2], shown: `${V("x")}(${poly([L, -2], "x", true)})`, wrongs: [`${V("x")}(${poly([L, -1], "x", true)})`, `${V("x")}(${poly([L / 2, -1], "x", true)})`, `2${V("x")}(${poly([L, -2], "x", true)})`],
    qx: T.q.optX.wall, ux: T.u.m, qv: T.q.optV.area, uv: T.u.m2, x, val: L * L / 8, dom: `0 &lt; ${V("x")} &lt; ${L / 2}`, domN: [0, L / 2], win: [0, L / 2] }); };
G.o_perim = () => { const Pm = pick([20, 28, 36, 44, 52, 60]), x = Pm / 4;
  return opt("o_perim", { text: T.w6.perim(Pm), fnName: "S", P: [0, Pm / 2, -1], shown: `${V("x")}(${poly([Pm / 2, -1], "x", true)})`, wrongs: [`${V("x")}(${poly([Pm, -1], "x", true)})`, `${V("x")}(${poly([Pm, -2], "x", true)})`, `2${V("x")} + 2(${poly([Pm / 2, -1], "x", true)})`],
    qx: T.q.optX.side, ux: T.u.cm, qv: T.q.optV.area, uv: T.u.cm2, x, val: x * x, dom: `0 &lt; ${V("x")} &lt; ${Pm / 2}`, domN: [0, Pm / 2], win: [0, Pm / 2] }); };
G.o_box = () => { const a = pick([6, 12, 18, 24, 30]), x = a / 6, P = mul([0, 1], mul([a, -2], [a, -2])), sq = e => `(${poly([e, -2], "x", true)})`;
  return opt("o_box", { text: T.w6.box(a), fnName: "V", P, shown: `${V("x")}${sq(a)}<sup>2</sup>`, wrongs: [`${V("x")}(${poly([a, -1], "x", true)})<sup>2</sup>`, `${V("x")}<sup>2</sup>${sq(a)}`, `${V("x")}${sq(a)}`],
    qx: T.q.optX.cut, ux: T.u.cm, qv: T.q.optV.vol, uv: T.u.cm3, x, val: 2 * a * a * a / 27, dom: `0 &lt; ${V("x")} &lt; ${a / 2}`, domN: [0, a / 2], win: [0, a / 2] }); };
G.o_openbox = () => { const x = pick([2, 4, 6, 8, 10]), S = 3 * x * x, P = [0, S / 4, 0, -0.25];
  return opt("o_openbox", { text: T.w6.openbox(S), fnName: "V", P, shown: `${frac(1, 4)}${V("x")}(${poly([S, 0, -1], "x", true)})`, wrongs: [`${V("x")}(${poly([S, 0, -1], "x", true)})`, `${frac(1, 4)}${V("x")}<sup>2</sup>(${poly([S, -1], "x", true)})`, `${frac(1, 4)}${V("x")}(${poly([S, 0, -4], "x", true)})`],
    qx: T.q.optX.base, ux: T.u.cm, qv: T.q.optV.vol, uv: T.u.cm3, x, val: x * x * x / 2, dom: `${V("x")} &gt; 0`, domN: [0, Math.sqrt(S)], win: [0, Math.ceil(Math.sqrt(S))] });
};
G.o_ball = () => { const v0 = pick([10, 20, 30, 40]), h0 = pick([0, 2, 5, 10]), t = v0 / 10;
  return opt("o_ball", { text: T.w6.ball, fnName: "h", v: "t", P: [h0, v0, -5], shown: poly([h0, v0, -5], "t", true), qx: T.q.optX.time, ux: T.u.s, qv: T.q.optV.height, uv: T.u.m, x: t, val: h0 + v0 * v0 / 20, dom: `${V("t")} ≥ 0`, domN: [0, v0 / 5], win: [0, Math.ceil(v0 / 5) + 1], ymin: 0 }); };
G.o_profit = () => { const b = pick([8, 10, 12, 14, 16, 18, 20]), c = R(5, 30), x = b / 2;
  return opt("o_profit", { text: T.w6.profit, fnName: "P", P: [-c, b, -1], qx: T.q.optX.amount, ux: T.u.hund, qv: T.q.optV.profit, uv: T.u.keur, x, val: x * x - c, dom: `${V("x")} ≥ 0`, domN: [0, b], win: [0, b] }); };
G.o_numbers = () => { const S = pick([3, 6, 9, 12, 15]), x = 2 * S / 3;
  return opt("o_numbers", { text: T.w6.numbers(S), fnName: "f", P: [0, 0, S, -1], shown: `${V("x")}<sup>2</sup>(${poly([S, -1], "x", true)})`, wrongs: [`${V("x")}(${poly([S, -1], "x", true)})<sup>2</sup>`, `${V("x")}<sup>2</sup> + (${poly([S, -1], "x", true)})`, `${V("x")}(${poly([S, -1], "x", true)})`],
    qx: T.q.optX.number, qv: T.q.optV.product, x, val: 4 * S * S * S / 27, dom: `0 &lt; ${V("x")} &lt; ${S}`, domN: [0, S], win: [0, S] }); };
G.o_squares = () => { const S = pick([6, 8, 10, 12, 14, 16, 20]), x = S / 2;
  return opt("o_squares", { text: T.w6.squares(S), fnName: "f", P: [S * S, -2 * S, 2], shown: `${V("x")}<sup>2</sup> + (${poly([S, -1], "x", true)})<sup>2</sup>`, wrongs: [`${V("x")}<sup>2</sup>(${poly([S, -1], "x", true)})<sup>2</sup>`, `${V("x")}<sup>2</sup> + ${poly([S, -1], "x", true)}`, `(${V("x")} + ${S})<sup>2</sup>`],
    qx: T.q.optX.number, qv: T.q.optV.sum, x, val: S * S / 2, dom: `0 &lt; ${V("x")} &lt; ${S}`, domN: [0, S], win: [0, S], min: true }); };
G.o_parab = () => { const x = pick([1, 2, 3, 4]), c = 3 * x * x;
  return opt("o_parab", { text: T.w6.parab(`${V("y")} = ${poly([c, 0, -1], "x", true)}`), fnName: "S", P: [0, 2 * c, 0, -2], shown: `2${V("x")}(${poly([c, 0, -1], "x", true)})`, wrongs: [`${V("x")}(${poly([c, 0, -1], "x", true)})`, `2${V("x")}(${poly([c, -1], "x", true)})`, `2${V("x")} + 2(${poly([c, 0, -1], "x", true)})`],
    qx: T.q.optX.vertex, qv: T.q.optV.area, x, val: 4 * x * x * x, dom: `0 &lt; ${V("x")} &lt; √${c}`, domN: [0, Math.sqrt(c)], win: [0, Math.ceil(Math.sqrt(c))] }); };
G.o_cubprofit = () => { let p, q; do { p = R(4, 9); q = R(1, 3); } while((p - q) % 2); const d0 = R(0, 30), P = [-d0, 3 * p * q, 1.5 * (p - q), -1], m = p + R(1, 3);
  return opt("o_cubprofit", { text: T.w6.cubprofit(m), fnName: "P", P, qx: T.q.optX.amount, ux: T.u.hund, qv: T.q.optV.profit, uv: T.u.keur, x: p, val: ev(P, p), dom: `0 ≤ ${V("x")} ≤ ${m}`, domN: [0, m], win: [0, m] }); };
G.o_pens = () => { const L = pick([12, 24, 36, 48, 60]), x = L / 6;
  return opt("o_pens", { text: T.w6.pens(L), fnName: "S", P: [0, L / 2, -1.5], shown: `${frac(1, 2)}${V("x")}(${poly([L, -3], "x", true)})`, wrongs: [`${frac(1, 2)}${V("x")}(${poly([L, -2], "x", true)})`, `${V("x")}(${poly([L, -3], "x", true)})`, `${frac(1, 3)}${V("x")}(${poly([L, -2], "x", true)})`],
    qx: T.q.optX.pens, ux: T.u.m, qv: T.q.optV.area, uv: T.u.m2, x, val: L * L / 24, dom: `0 &lt; ${V("x")} &lt; ${L / 3}`, domN: [0, L / 3], win: [0, L / 3] }); };

/* =====================================================================
   7 LYGIS. Išplėstinis kursas: sandaugos, dalmens, sudėtinės funkcijos išvestinė; eˣ, ln x
   ===================================================================== */
const E = s => `${V("e")}<sup>${s}</sup>`, X = V("x"), ln = s => `ln ${s}`;
const xp = (c, e) => { const a = Math.abs(c), s = c < 0 ? M : ""; return e === 0 ? s + num(a) : s + (a === 1 ? "" : num(a)) + pw("x", e); };
const A7 = (type, f, st, sol, dbg) => ({ type, head: T.h.fn(`${fx()} = ${f}`), steps: [st], sol, dbg: dbg || {} });
G.a_xn_ex = () => { const n = R(2, 4);
  return A7("a_xn_ex", `${pw("x", n)}${E(X)}`, choice(T.q.pickDeriv, `${E(X)}(${pw("x", n)} + ${xp(n, n - 1)})`, [`${xp(n, n - 1)}${E(X)}`, `${xp(n, n - 1)} + ${E(X)}`, `${pw("x", n)}${E(X)}`, `${E(X)}(${xp(n, n - 1)} ${M} ${pw("x", n)})`]),
    T.s.product(`(${pw("x", n)})′ = ${xp(n, n - 1)}`, `(${E(X)})′ = ${E(X)}`, `${dfx()} = ${xp(n, n - 1)} · ${E(X)} + ${pw("x", n)} · ${E(X)} = <b>${E(X)}(${pw("x", n)} + ${xp(n, n - 1)})</b>`), { f: x => Math.pow(x, n) * Math.exp(x), d: x => Math.exp(x) * (Math.pow(x, n) + n * Math.pow(x, n - 1)) }); };
G.a_lin_ex = () => { const a = pick([1, 2, 3, -1, -2]), b = nz(-5, 5);
  return A7("a_lin_ex", `${bin(a, b)}${E(X)}`, choice(T.q.pickDeriv, `${E(X)}(${lin(a, a + b) === "0" ? "0" : lin(a, a + b)})`, [`${num(a)}${E(X)}`, `${E(X)}${bin(a, b)}`, `${E(X)}(${lin(a, b - a)})`, `${num(a)} + ${E(X)}`]),
    T.s.product(`(${lin(a, b)})′ = ${num(a)}`, `(${E(X)})′ = ${E(X)}`, `${dfx()} = ${par(a)} · ${E(X)} + ${bin(a, b)} · ${E(X)} = <b>${E(X)}(${lin(a, a + b)})</b>`), { f: x => (a * x + b) * Math.exp(x), d: x => Math.exp(x) * (a * x + a + b) }); };
G.a_xn_ln = () => { const n = R(1, 3), c = n === 1 ? `${ln(X)} + 1` : `${xp(n, n - 1)} ${ln(X)} + ${xp(1, n - 1)}`;
  return A7("a_xn_ln", `${pw("x", n)} ${ln(X)}`, choice(T.q.pickDeriv, c, n === 1 ? [frac(1, X), ln(X), `${X} ${ln(X)} + 1`, `${ln(X)} + ${X}`] : [`${xp(n, n - 1)} ${ln(X)}`, `${xp(n, n - 1)} ${ln(X)} + ${pw("x", n)}`, xp(n, n - 2 || 0), `${xp(n, n - 1)} ${ln(X)} + ${xp(1, n + 1)}`]),
    T.s.product(`(${pw("x", n)})′ = ${xp(n, n - 1)}`, `(${ln(X)})′ = ${frac(1, X)}`, `${dfx()} = ${xp(n, n - 1)} · ${ln(X)} + ${pw("x", n)} · ${frac(1, X)} = <b>${c}</b>`), { f: x => Math.pow(x, n) * Math.log(x), d: x => n * Math.pow(x, n - 1) * Math.log(x) + Math.pow(x, n - 1), pos: true }); };
G.a_chain_pow = () => { const a = pick([2, 3, 4, -1, -2, 5]), b = nz(-5, 5), n = R(3, 6), u = bin(a, b);
  return A7("a_chain_pow", `${u}<sup>${n}</sup>`, choice(T.q.pickDeriv, `${num(n * a)}${u}<sup>${n - 1}</sup>`, [`${n}${u}<sup>${n - 1}</sup>`, `${num(a)}${u}<sup>${n - 1}</sup>`, `${num(n * a)}${u}<sup>${n}</sup>`, `${n}${u}<sup>${n}</sup>`]),
    T.s.chain(`${V("u")} = ${lin(a, b)}`, `${V("u")}′ = ${num(a)}`, `(${V("u")}<sup>${n}</sup>)′ = ${n}${V("u")}<sup>${n - 1}</sup> · ${V("u")}′`, `${dfx()} = ${n}${u}<sup>${n - 1}</sup> · ${par(a)} = <b>${num(n * a)}${u}<sup>${n - 1}</sup></b>`), { f: x => Math.pow(a * x + b, n), d: x => n * a * Math.pow(a * x + b, n - 1) }); };
G.a_chain_exp = () => { const a = pick([2, 3, 4, -1, -2, -3, 5]), b = R(-4, 4), u = lin(a, b), co = a === -1 ? M : num(a);
  return A7("a_chain_exp", E(u), choice(T.q.pickDeriv, `${co}${E(u)}`, [E(u), `(${u})${E(lin(a, b - 1))}`, `${co}${E(X)}`, `${co}${E(u)} + ${num(b || 1)}`]),
    T.s.chain(`${V("u")} = ${u}`, `${V("u")}′ = ${num(a)}`, `(${E(V("u"))})′ = ${E(V("u"))} · ${V("u")}′`, `${dfx()} = ${E(u)} · ${par(a)} = <b>${co}${E(u)}</b>`), { f: x => Math.exp(a * x + b), d: x => a * Math.exp(a * x + b) }); };
G.a_chain_ln = () => { const a = pick([2, 3, 4, 5]), b = R(1, 6), u = lin(a, b);
  return A7("a_chain_ln", `ln(${u})`, choice(T.q.pickDeriv, frac(a, u), [frac(1, u), frac(a, X), `${a} ln(${u})`, frac(1, `${a}${X}`)]),
    T.s.chain(`${V("u")} = ${u}`, `${V("u")}′ = ${a}`, `(${ln(V("u"))})′ = ${frac(1, V("u"))} · ${V("u")}′`, `${dfx()} = ${frac(1, u)} · ${a} = <b>${frac(a, u)}</b>`), { f: x => Math.log(a * x + b), d: x => a / (a * x + b), pos: true }); };
G.a_quot = () => { let a, b, c, d; do { a = nz(-4, 4); b = nz(-5, 5); c = pick([1, 1, 2, 3]); d = nz(-5, 5); } while(a * d - b * c === 0);
  return A7("a_quot", frac(lin(a, b), lin(c, d)), numStep(T.q.quot, [F(dfx() + " =", a * d - b * c, `: ${bin(c, d)}<sup>2</sup>`)]),
    T.s.quot(`${V("u")} = ${lin(a, b)}, ${V("u")}′ = ${num(a)}`, `${V("v")} = ${lin(c, d)}, ${V("v")}′ = ${num(c)}`, `${par(a)}${bin(c, d)} ${M} ${bin(a, b)} · ${par(c)} = ${lin(a * c, a * d)} ${M} (${lin(a * c, b * c)}) = <b>${num(a * d - b * c)}</b>`), { f: x => (a * x + b) / (c * x + d), d: x => (a * d - b * c) / Math.pow(c * x + d, 2), numr: a * d - b * c, avoid: -d / c }); };
G.a_value = () => { const k = R(0, 4); let f, x0, val, fh, sol, ff;
  if(k === 0){ const a = pick([1, 2, 3, -2]), b = nz(-4, 4); fh = `${bin(a, b)}${E(X)}`; x0 = 0; val = a + b; ff = x => (a * x + b) * Math.exp(x); sol = `${dfx()} = ${E(X)}(${lin(a, a + b)}), ${dfat("f", 0)} = ${E("0")} · ${par(a + b)} = <b>${num(val)}</b>`; }
  else if(k === 1){ const n = R(2, 4); fh = `${pw("x", n)} ${ln(X)}`; x0 = 1; val = 1; ff = x => Math.pow(x, n) * Math.log(x); sol = `${dfx()} = ${xp(n, n - 1)} ${ln(X)} + ${xp(1, n - 1)}, ${dfat("f", 1)} = ${n} · ln 1 + 1 = <b>1</b>`; }
  else if(k === 2){ const a = pick([2, 3, -2]), n = R(3, 4), b = pick([1, -1, 2]) - a; fh = `${bin(a, b)}<sup>${n}</sup>`; x0 = 1; val = n * a * Math.pow(a + b, n - 1); ff = x => Math.pow(a * x + b, n); sol = `${dfx()} = ${num(n * a)}${bin(a, b)}<sup>${n - 1}</sup>, ${dfat("f", 1)} = ${num(n * a)} · ${par(a + b)}<sup>${n - 1}</sup> = <b>${num(val)}</b>`; }
  else if(k === 3){ const a = pick([2, 4, 6, 3]), b = 1; fh = `ln(${lin(a, b)})`; x0 = 0; val = a; ff = x => Math.log(a * x + b); sol = `${dfx()} = ${frac(a, lin(a, b))}, ${dfat("f", 0)} = ${a} : 1 = <b>${a}</b>`; }
  else { const a = pick([2, 3, -2, 4]), x1 = pick([1, 2, -1]), b = -a * x1; fh = E(lin(a, b)); x0 = x1; val = a; ff = x => Math.exp(a * x + b); sol = `${dfx()} = ${num(a)}${E(lin(a, b))}, ${dfat("f", x0)} = ${num(a)} · ${E("0")} = <b>${num(a)}</b>`; }
  return A7("a_value", fh, numStep(T.q.valueAt(dfat("f", x0)), [F(dfat("f", x0) + " =", val)]), T.s.aval(sol), { f: ff, x0, val }); };
G.a_power = () => { const k = R(0, 2);
  if(k === 0){ const n = R(2, 4);
    return A7("a_power", frac(1, pw("x", n)), choice(T.q.pickDeriv, `${M}${frac(n, pw("x", n + 1))}`, [frac(n, pw("x", n + 1)), `${M}${frac(n, pw("x", n - 1))}`, frac(1, xp(n, n - 1)), `${M}${frac(1, pw("x", n + 1))}`]),
      T.s.power2(`${frac(1, pw("x", n))} = ${X}<sup>${M}${n}</sup>`, `${dfx()} = ${M}${n}${X}<sup>${M}${n + 1}</sup> = <b>${M}${frac(n, pw("x", n + 1))}</b>`), { f: x => Math.pow(x, -n), d: x => -n * Math.pow(x, -n - 1), pos: true }); }
  if(k === 1){ const c = pick([1, 3, 4, 6, 8]), sq = `√${X}`, co = v => v === 1 ? "" : num(v), cor = c % 2 ? frac(c, "2" + sq) : frac(c / 2, sq);
    return A7("a_power", co(c) + sq, choice(T.q.pickDeriv, cor, [frac(c, sq), co(c / 2) + sq, frac(2 * c, sq), frac(c, "2" + X)]),
      T.s.power2(`${sq} = ${X}<sup>${frac(1, 2)}</sup>`, `(${sq})′ = ${frac(1, 2)}${X}<sup>${M}${frac(1, 2)}</sup> = ${frac(1, "2" + sq)}, ${dfx()} = <b>${cor}</b>`), { f: x => c * Math.sqrt(x), d: x => c / (2 * Math.sqrt(x)), pos: true }); }
  const a = pick([2, 3, 5, 10]);
  return R(0, 1) ? A7("a_power", `${a}<sup>${X}</sup>`, choice(T.q.pickDeriv, `${a}<sup>${X}</sup> ln ${a}`, [`${X} · ${a}<sup>${X} ${M} 1</sup>`, `${a}<sup>${X}</sup>`, frac(`${a}<sup>${X}</sup>`, `ln ${a}`), `${a}<sup>${X}</sup> ${ln(X)}`]), T.s.expa(`(${V("a")}<sup>${X}</sup>)′ = ${V("a")}<sup>${X}</sup> ln ${V("a")}`, `${dfx()} = <b>${a}<sup>${X}</sup> ln ${a}</b>`), { f: x => Math.pow(a, x), d: x => Math.pow(a, x) * Math.log(a) })
    : A7("a_power", `log<sub>${a}</sub> ${X}`, choice(T.q.pickDeriv, frac(1, `${X} ln ${a}`), [frac(1, X), frac(`ln ${a}`, X), frac(1, `${a}${X}`), frac(a, X)]), T.s.expa(`(log<sub>${V("a")}</sub> ${X})′ = ${frac(1, `${X} ln ${V("a")}`)}`, `${dfx()} = <b>${frac(1, `${X} ln ${a}`)}</b>`), { f: x => Math.log(x) / Math.log(a), d: x => 1 / (x * Math.log(a)), pos: true }); };
G.a_prod_poly = () => { const a = nz(-4, 4), b = nz(-5, 5), P = mul([a, 0, 1], [b, 1]), d = deriv(P);
  return { type: "a_prod_poly", head: T.h.fn(`${fx()} = (${poly([a, 0, 1])})${bin(1, b)}`), steps: [coefStep(d, "f", "x")],
    sol: T.s.prodPoly(`${V("u")} = ${poly([a, 0, 1])}, ${V("u")}′ = 2${X}`, `${V("v")} = ${lin(1, b)}, ${V("v")}′ = 1`, `${dfx()} = 2${X}${bin(1, b)} + (${poly([a, 0, 1])}) · 1 = <b>${poly(d)}</b>`), dbg: { P, d } }; };

/* ---------- lygių sudėtis ---------- */
const LV = {
  l1: ["d_quad", "d_lin", "d_cubic", "d_gap", "d_asc", "d_letter", "d_quart", "d_square", "d_binprod", "d_xprod", "d_quadprod", "d_frac"],
  l2: ["v_quad", "v_slope", "v_zero_quad", "v_cubic", "v_read", "v_speed", "v_par_quad", "v_stop", "v_tan_quad", "v_zero_cubic", "v_par_point", "v_tan_cubic"],
  l3: ["m_quad", "m_factored", "m_points", "m_cubic_up", "m_dgraph", "m_cubic_down", "m_nocrit", "m_decint", "m_double", "m_extval"],
  l4: ["c_quad_in", "c_quad_out", "c_cubic_both", "c_track", "c_cubic_one", "c_cubic_none", "c_maxx"],
  l5: ["g_par_line", "g_zero", "g_line_par", "g_steepest", "g_maxfromd", "g_cub_par", "g_count", "g_par_cub"],
  l6: ["o_perim", "o_ball", "o_profit", "o_wall", "o_squares", "o_numbers", "o_pens", "o_box", "o_cubprofit", "o_parab", "o_openbox"],
  l7: ["a_chain_pow", "a_chain_exp", "a_power", "a_xn_ex", "a_chain_ln", "a_lin_ex", "a_xn_ln", "a_prod_poly", "a_quot", "a_value"]
};
const SIZE = { l1: 8, l2: 8, l3: 6, l4: 6, l5: 8, l6: 6, l7: 8, l8: 10 };
/* raundas: pirmiau seniausiai matyti tipai, raunde – nuo lengvesnių prie sunkesnių (sąrašų tvarka) */
function round(lv, seen){
  let types;
  if(lv === "l8"){ const plan = [["l1", 2], ["l2", 2], ["l3", 2], ["l4", 1], ["l5", 2], ["l6", 1]]; types = []; plan.forEach(([k, n]) => { types = types.concat(order(LV[k], seen).slice(0, n)); }); }
  else { const pool = LV[lv]; types = order(pool, seen).slice(0, SIZE[lv]); types.sort((a, b) => pool.indexOf(a) - pool.indexOf(b)); }
  return types.map(t => G[t]());
}
function order(pool, seen){ const s = seen || []; return shuffle(pool).sort((a, b) => s.lastIndexOf(a) - s.lastIndexOf(b)); }

root.MK_KI = { G, LV, SIZE, round, ev, deriv, poly, num, critOf };
})(typeof window !== "undefined" ? window : globalThis);
