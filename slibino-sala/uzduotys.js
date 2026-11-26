/* Slibino sala – 5 klasės užduočių generatoriai (pagal Matematikos bendrąją programą, 5 kl.).
   Kiekviena užduotis: { topic, q, type: "num" | "opt", a (skaičius arba teisingo varianto indeksas), opts, show, why, fig }.
   Tekstai – window.MK_T.U (tekstai.lt.js). */
(function(){
"use strict";
const U = window.MK_T.U, R = MK.rnd, P = MK.pick, SH = MK.shuffle;
const gcd = (a, b) => b ? gcd(b, a % b) : a, lcm = (a, b) => a / gcd(a, b) * b;
const fmt = x => { const r = Math.round(x * 1e6) / 1e6; return String(r).replace(".", ","); };
const eur = x => (Math.round(x * 100) / 100).toFixed(2).replace(".", ",");
const Q = (window.MK_T_B || {}).Q || {};
const fr = (a, b) => MK.frac(a, b);
const mixed = (w, n, d) => n === 0 ? String(w) : (w ? `${w}&#8239;` : "") + fr(n, d);
const divisors = n => { const r = []; for(let i = 1; i <= n; i++) if(n % i === 0) r.push(i); return r; };
const isPrime = n => { if(n < 2) return false; for(let i = 2; i * i <= n; i++) if(n % i === 0) return false; return true; };
const digitSum = n => String(n).split("").reduce((s, c) => s + +c, 0);
/* trupmena tot/d kaip mišrusis skaičius (sutrumpinta) */
const showFr = (tot, d) => { const w = Math.floor(tot / d), n = tot % d, g = gcd(n, d) || d; return mixed(w, n / g, d / g); };
function wrongMixed(tot, d, cands){ const seen = new Set([tot * 720 / d]), out = [];
  for(const c of cands.concat([tot + 2, tot - 2, tot + 3, tot + d + 1])){ if(out.length >= 3) break; if(c <= 0) continue; const v = c * 720 / d; if(seen.has(v)) continue; seen.add(v); out.push(showFr(c, d)); }
  return out; }
const multiples = (a, k) => Array.from({ length: k }, (_, i) => a * (i + 1)).join(", ");

/* variantų užduotis: opts – HTML eilutės, ok – teisingo indeksas po sumaišymo */
function opt(topic, q, correct, wrong, why, fig){
  const all = SH([correct].concat(wrong.slice(0, 3)));
  return { topic, q, type: "opt", opts: all, a: all.indexOf(correct), show: correct, why, fig };
}
const num = (topic, q, a, why, fig) => ({ topic, q, type: "num", a, show: fmt(a), why, fig });
/* skirtingų reikšmių atrinkimas */
function distinct(cands, n, bad){ const out = []; for(const c of cands){ if(out.length >= n) break; if(c == null || bad(c) || out.some(o => o === c)) continue; out.push(c); } return out; }

/* ---------- paprasti brėžiniai ---------- */
const SVG = (w, h, body) => `<svg class="fig" viewBox="0 0 ${w} ${h}" aria-hidden="true">${body}</svg>`;
const tx = (x, y, t, a) => `<text x="${x}" y="${y}" text-anchor="${a || "middle"}" font-size="14" font-weight="800" font-family="Manrope,system-ui,sans-serif" fill="#121a33">${t}</text>`;
const F = {
  rect: (a, b, u) => SVG(220, 110, `<rect x="30" y="14" width="140" height="70" rx="2" fill="#dff1ff" stroke="#121a33" stroke-width="2.5"/>${tx(100, 102, a + " " + u)}${tx(176, 54, b + " " + u, "start")}`),
  sq: () => SVG(200, 110, `<rect x="60" y="14" width="80" height="80" fill="#fff2c4" stroke="#121a33" stroke-width="2.5"/>${tx(100, 60, "?")}`),
  rtri: (a, b) => SVG(220, 120, `<path d="M70 100V20L200 100Z" fill="#e3f7e0" stroke="#121a33" stroke-width="2.5" stroke-linejoin="round"/><path d="M70 88h12v12" fill="none" stroke="#121a33" stroke-width="2"/>${tx(62, 64, a + " cm", "end")}${tx(135, 116, b + " cm")}`),
  box: (a, b, c) => SVG(220, 130, `<path d="M40 50h110v65H40Z" fill="#ffe1d6" stroke="#121a33" stroke-width="2.5"/><path d="M40 50l30-28h110l-30 28Z" fill="#ffd0bd" stroke="#121a33" stroke-width="2.5" stroke-linejoin="round"/><path d="M150 115l30-28V22" fill="#f6b8a2" stroke="#121a33" stroke-width="2.5" stroke-linejoin="round"/><path d="M150 50l30-28v65l-30 28Z" fill="#f6b8a2" stroke="#121a33" stroke-width="2.5" stroke-linejoin="round"/>${tx(95, 128, a + " cm")}${tx(192, 70, c + " cm", "start")}${tx(172, 104, b, "start")}`),
  adj: a => { const r = a * Math.PI / 180, x = 110 + 80 * Math.cos(r), y = 95 - 80 * Math.sin(r);
    return SVG(220, 110, `<path d="M20 95H200M110 95L${x.toFixed(1)} ${y.toFixed(1)}" stroke="#121a33" stroke-width="2.5" stroke-linecap="round"/><path d="M140 95A30 30 0 0 0 ${(110 + 30 * Math.cos(r)).toFixed(1)} ${(95 - 30 * Math.sin(r)).toFixed(1)}" fill="none" stroke="#2b8a3e" stroke-width="3"/>${tx(150 + 10 * Math.cos(r / 2), 88 - 18 * Math.sin(r / 2), a + "°", "start")}${tx(70, 80, "?")}`); },
  vert: a => { const r = a * Math.PI / 180, dx = 85 * Math.cos(r / 2), dy = 85 * Math.sin(r / 2);
    return SVG(220, 120, `<path d="M${110 - dx} ${60 + dy}L${110 + dx} ${60 - dy}M${110 - dx} ${60 - dy}L${110 + dx} ${60 + dy}" stroke="#121a33" stroke-width="2.5" stroke-linecap="round"/>${tx(160, 65, a + "°", "start")}${tx(50, 65, "?", "end")}`); }
};

/* ================= 1. Dalumas (Kriauklės kristalas) ================= */
const DIV = [
  function divBy(){
    const d = P([2, 3, 4, 5, 9, 10, 100]);
    const okN = d === 100 ? R(11, 99) * 100 : (() => { let n; do { n = R(102, 998); } while(n % d); return n; })();
    const tricky = n => {
      if(d === 9) return n % 3 === 0 && n % 9 !== 0;
      if(d === 4) return n % 2 === 0 && n % 4 !== 0;
      if(d === 3) return n % 3 !== 0 && (digitSum(n) % 3 === 1 || digitSum(n) % 3 === 2);
      if(d === 10) return n % 5 === 0 && n % 10 !== 0 || n % 10 !== 0;
      if(d === 100) return n % 10 === 0 && n % 100 !== 0;
      if(d === 5) return n % 5 !== 0;
      return n % 2 !== 0;
    };
    const cands = [];
    for(let i = 0; i < 300 && cands.length < 3; i++){
      const n = d === 100 ? R(101, 999) * 10 : R(102, 998);
      if(n % d && tricky(n) && !cands.includes(n) && n !== okN) cands.push(n);
    }
    let det = "";
    if(d === 3 || d === 9) det = [okN].concat(cands).map(n => U.digitSum(n, digitSum(n))).join("<br>");
    if(d === 4) det = [okN].concat(cands).map(n => U.lastTwo(n, n % 100)).join("<br>");
    return opt("div", U.divBy(d), String(okN), cands.map(String), U.divWhy[d] + (det ? "<br>" + det : ""));
  },
  function missDigit(){
    const d = P([3, 9]);
    let a, b, pos, good;
    do { a = R(1, 9); b = R(0, 9); pos = R(0, 1); const base = a + b; good = []; for(let x = 0; x <= 9; x++) if((base + x) % d === 0) good.push(x); } while(!good.length);
    const ok = P(good), bad = SH([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(x => !good.includes(x))).slice(0, 3);
    const pat = pos ? `${a}★${b}` : `${a}${b}★`;
    const full = pos ? `${a}${ok}${b}` : `${a}${b}${ok}`;
    return opt("div", U.missDigit(pat, d), String(ok), bad.map(String), U.divWhy[d] + "<br>" + U.digitSum(full, digitSum(+full)));
  },
  function nDiv(){
    const n = P([12, 16, 18, 20, 24, 28, 30, 32, 36, 40, 42, 44, 45, 48, 50, 54, 56, 60, 63, 64, 66, 70, 72, 75, 80, 84, 90, 96, 98, 100]);
    const ds = divisors(n);
    return num("div", U.nDiv(n), ds.length, U.nDivWhy(n, ds.join(", ")));
  },
  function lcmQ(){
    let a, b; do { a = R(3, 15); b = R(4, 18); } while(a === b || a % b === 0 || b % a === 0 || lcm(a, b) > 120 || lcm(a, b) === a * b && R(0, 2));
    const L = lcm(a, b);
    return num("div", U.lcm(a, b), L, U.lcmWhy(a, multiples(a, L / a), b, multiples(b, L / b), L));
  },
  function gcdQ(){
    let a, b; do { a = R(12, 96); b = R(12, 96); } while(a === b || gcd(a, b) < 3 || a % b === 0 || b % a === 0);
    const G = gcd(a, b);
    return num("div", U.gcd(a, b), G, U.gcdWhy(a, divisors(a).join(", "), b, divisors(b).join(", "), G));
  },
  function primeQ(){
    const p = P([23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]);
    const comps = SH([21, 27, 33, 39, 49, 51, 57, 63, 69, 77, 81, 87, 91, 93, 95, 99]).slice(0, 3);
    const sd = n => { for(let i = 3; i < n; i++) if(n % i === 0) return i; };
    return opt("div", U.prime, String(p), comps.map(String), U.primeWhy(p, comps.map(n => U.compWhy(n, sd(n))).join(", ") + "."));
  },
  function factorQ(){
    let fs, n; do { fs = Array.from({ length: R(3, 4) }, () => P([2, 2, 3, 3, 5, 7])).sort((x, y) => x - y); n = fs.reduce((s, x) => s * x, 1); } while(n > 300 || n < 24);
    const miss = fs[fs.length - 1], shown = fs.slice(0, -1).join(" · ");
    return num("div", U.factor(n, shown), miss, U.factorWhy(n, fs.join(" · ")));
  },
  function busQ(){
    let a, b; do { a = P([6, 8, 9, 10, 12, 15, 18, 20]); b = P([8, 10, 12, 14, 15, 16, 18, 24, 25, 30]); } while(a === b || a % b === 0 || b % a === 0 || lcm(a, b) > 120);
    const L = lcm(a, b);
    return num("div", U.busLcm(a, b), L, U.lcmWhy(a, multiples(a, L / a), b, multiples(b, L / b), L));
  },
  function basketQ(){
    let a, b; do { a = R(12, 60); b = R(12, 72); } while(a === b || gcd(a, b) < 4 || a % b === 0 || b % a === 0);
    const G = gcd(a, b);
    return num("div", U.basketGcd(a, U.fruitA, b, U.fruitB), G, U.gcdWhy(a, divisors(a).join(", "), b, divisors(b).join(", "), G));
  },
  function multQ(){
    const a = R(6, 19), k = R(3, 12), n = a * k; const bad = distinct(SH([n - 1, n + 1, n - 2, n + 2, n + 3, n - 3, n + a - 1, n + 5]), 3, c => c % a === 0 || c <= 0);
    return opt("div", Q.mult(a), String(n), bad.map(String), Q.multWhy(n, a, k));
  },
  function divisorQ(){
    const n = P([24, 30, 36, 40, 42, 48, 54, 56, 60, 63, 64, 72, 80, 84, 90, 96, 100, 105, 108, 112, 120]);
    const ds = divisors(n), mid = ds.filter(d => d > 2 && d < n / 2 + 1), ok = P(mid);
    const bad = distinct(SH(Array.from({ length: Math.floor(n / 2) - 2 }, (_, i) => i + 3)), 3, c => n % c === 0);
    return opt("div", Q.divisor(n), String(ok), bad.map(String), Q.divisorWhy(n, ds.join(", ")));
  },
  function remQ(){ const d = R(3, 12), q = R(4, 25), r = R(1, d - 1), n = d * q + r; return num("div", Q.rem(n, d), r, Q.remWhy(n, d, q, r)); },
  function edgeQ(){
    const d = P([3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17]);
    if(R(0, 1)){ const r = Math.ceil(100 / d) * d; return num("div", Q.small3(d), r, Q.edgeWhy(d, [r - d, r, r + d].join(", "))); }
    const r = Math.floor(99 / d) * d; return num("div", Q.big2(d), r, Q.edgeWhy(d, [r - d, r, r + d].join(", ")));
  },
  function primeCountQ(){ const a = R(1, 8) * 10, b = a + P([10, 20]); const ps = []; for(let i = a + 1; i < b; i++) if(isPrime(i)) ps.push(i); return num("div", Q.primeCount(a, b), ps.length, Q.primeCountWhy(ps.join(", "))); }
];

/* ================= 2. Trupmenos (Lapo kristalas) ================= */
const FRAC = [
  function reduceQ(){
    let a, b; do { b = R(3, 12); a = R(1, b - 1); } while(gcd(a, b) !== 1);
    const g = P([4, 6, 8, 9, 2, 3, 5]);
    const A = a * g, B = b * g;
    const wrong = [];
    const partial = []; for(const k of [2, 3]) if(g % k === 0 && g !== k){ wrong.push(fr(A / k, B / k)); partial.push(fr(A / k, B / k)); }
    wrong.push(fr(b, a + b), fr(a + 1, b), fr(a, b + 1), fr(A - g, B));
    const w = distinct(wrong, 3, c => c === fr(a, b));
    return opt("frac", U.reduce(fr(A, B)), fr(a, b), w, U.reduceWhy(fr(A, B), g, fr(a, b)) + (partial.length ? "<br>" + partial.map(c => `${c} – ${U.reduceNot}`).join("<br>") : ""));
  },
  function cmpQ(){
    const ds = [2, 3, 4, 6, 8, 12];
    let fs, vals; do { fs = SH(ds).slice(0, 4).map(d => [R(1, d - 1), d]); vals = fs.map(f => f[0] * 24 / f[1]); } while(new Set(vals).size < 4);
    const mx = Math.max(...vals), i = vals.indexOf(mx);
    const list = fs.map(f => `${fr(f[0], f[1])} = ${fr(f[0] * 24 / f[1], 24)}`).join(", ");
    return opt("frac", U.cmp, fr(fs[i][0], fs[i][1]), fs.filter((_, k) => k !== i).map(f => fr(f[0], f[1])), U.cmpWhy(list, 24));
  },
  function mixToImpQ(){
    const d = R(2, 9), n = R(1, d - 1), w = R(1, 6);
    return num("frac", U.mixToImp(mixed(w, n, d), d), w * d + n, U.mixToImpWhy(w, n, d, w * d + n));
  },
  function impToMixQ(){
    const d = R(3, 9), w = R(1, 7), n = R(1, d - 1), a = w * d + n;
    return num("frac", U.impToMix(fr(a, d), w, d), n, U.impToMixWhy(a, d, w, n));
  },
  function addQ(){
    let b, k, a, c; do { b = R(2, 6); k = R(2, 3); a = R(1, b - 1); c = R(1, b * k - 1); } while(gcd(c, b * k) === 0);
    const d = b * k, top = a * k + c;
    return num("frac", U.addFr(`${fr(a, b)} + ${fr(c, d)}`, d), top, U.addFrWhy(`${fr(a * k, d)} + ${fr(c, d)} = ${fr(top, d)}`));
  },
  function addCoprimeQ(){
    let b, d; do { b = R(2, 5); d = R(3, 7); } while(gcd(b, d) !== 1);
    const a = R(1, b - 1), c = R(1, d - 1), D = b * d, top = a * d + c * b;
    return num("frac", U.addFr(`${fr(a, b)} + ${fr(c, d)}`, D), top, U.addFrWhy(`${fr(a * d, D)} + ${fr(c * b, D)} = ${fr(top, D)}`));
  },
  function mixAddQ(){
    const b = R(2, 5), k = R(2, 3), d = b * k;
    const w1 = R(1, 4), w2 = R(1, 3), n1 = R(1, b - 1), n2 = R(1, d - 1);
    const tot = (w1 + w2) * d + n1 * k + n2;
    const res = showFr(tot, d);
    const wrong = wrongMixed(tot, d, [(w1 + w2) * d + ((n1 * k + n2) % d), (w1 + w2) * (b + d) + n1 + n2, tot + d, tot - d, tot + 1, tot - 1]);
    return opt("frac", U.mixSub + " " + `${mixed(w1, n1, b)} + ${mixed(w2, n2, d)}`, res, wrong,
      U.addFrWhy(`${mixed(w1, n1 * k, d)} + ${mixed(w2, n2, d)} = ${mixed(w1 + w2, n1 * k + n2, d)} = ${res}`));
  },
  function mixSubQ(){
    const d = R(3, 9), w1 = R(3, 6), w2 = R(1, w1 - 1), n1 = R(1, d - 1), n2 = R(1, d - 1);
    if(n1 === n2) return mixSubQ();
    const tot = (w1 * d + n1) - (w2 * d + n2);
    if(tot <= 0) return mixSubQ();
    const borrow = n1 < n2 ? `${mixed(w1, n1, d)} = ${mixed(w1 - 1, n1 + d, d)}; ` : "";
    const res = showFr(tot, d);
    const wrong = wrongMixed(tot, d, [(w1 - w2) * d + Math.abs(n1 - n2), tot + d, tot - d, tot + 1, tot - 1, tot + 2]);
    return opt("frac", U.mixSub + " " + `${mixed(w1, n1, d)} − ${mixed(w2, n2, d)}`, res, wrong,
      U.subFrWhy(`${borrow}${mixed(w1 - (borrow ? 1 : 0), n1 + (borrow ? d : 0), d)} − ${mixed(w2, n2, d)} = ${res}`));
  },
  function mulQ(){
    const b = R(3, 11), a = R(1, b - 1), n = R(2, 5);
    const steps = Array(n).fill(fr(a, b)).join(" + ") + " = " + fr(n * a, b);
    return num("frac", U.mulFr(n, fr(a, b), b), n * a, U.mulFrWhy(n, fr(a, b), steps));
  },
  function partOfQ(){
    let b, a; do { b = R(3, 10); a = R(1, b - 1); } while(gcd(a, b) !== 1); const N = b * R(2, 12), th = P(U.things);
    return num("frac", U.partOf(fr(a, b), N, th), N / b * a, U.partOfWhy(N, b, a, N / b * a));
  },
  function frToDecQ(){
    const [a, b] = P([[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 10], [3, 10], [7, 10], [9, 10], [1, 20], [7, 20], [3, 25], [1, 25], [9, 50], [11, 20], [13, 25]]);
    const v = a / b, k = 100 / b;
    const eq = Number.isInteger(10 / b) ? fr(a * 10 / b, 10) : fr(a * k, 100);
    const wrong = distinct([fmt(a / 10), fmt(b / 100 + a / 10), "0," + a + b, fmt(v * 10), fmt(v / 10), fmt(1 - v)], 3, c => c === fmt(v) || c === "0");
    return opt("frac", U.frToDec(fr(a, b)), fmt(v), wrong, U.frToDecWhy(fr(a, b), eq, fmt(v)));
  },
  function equivQ(){ let a, b; do { b = R(2, 9); a = R(1, b - 1); } while(gcd(a, b) !== 1); const k = R(2, 9); return num("frac", Q.equiv(fr(a, b), b * k), a * k, Q.equivWhy(k, `${fr(a, b)} = ${fr(a * k, b * k)}`)); },
  function subSameQ(){ const d = R(5, 15), a = R(3, d - 1), c = R(1, a - 1); return num("frac", Q.subSame(`${fr(a, d)} − ${fr(c, d)}`, d), a - c, Q.subSameWhy(`${fr(a, d)} − ${fr(c, d)} = ${fr(a - c, d)}`)); },
  function wholeQ(){ let a, b; do { b = R(3, 10); a = R(1, b - 1); } while(gcd(a, b) !== 1); const m = R(2, 9); return num("frac", Q.whole(fr(a, b), a * m), b * m, Q.wholeWhy(a * m, a, b, b * m)); },
  function partUnitQ(){
    const n = P([60, 100, 1000]), list = { 60: [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [1, 6], [5, 6], [1, 10], [3, 10], [1, 12], [5, 12]], 100: [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [1, 10], [7, 10], [1, 20], [3, 25]], 1000: [[1, 2], [1, 4], [3, 4], [1, 5], [3, 5], [1, 8], [3, 8], [1, 10], [9, 10]] }[n];
    const [a, b] = P(list), r = n / b * a; return num("frac", Q.partUnit(fr(a, b), Q.unitsBig[n], Q.unitsSmall[n]), r, Q.partUnitWhy(Q.unitsOne[n], n, Q.unitsSmall[n], b, a, r));
  },
  function cmpNumQ(){ const a = R(1, 5); const ds = SH(Array.from({ length: 12 }, (_, i) => a + 1 + i)).slice(0, 4); const mn = Math.min(...ds); return opt("frac", Q.cmpNum, fr(a, mn), ds.filter(d => d !== mn).map(d => fr(a, d)), Q.cmpNumWhy(a)); }
];

/* ================= 3. Dešimtainiai ir procentai (Grybo kristalas) ================= */
const d1 = () => R(11, 99) / 10, d2 = () => R(101, 999) / 100;
const DEC = [
  function addQ(){ const a = P([d1, d2])(), b = P([d1, d2])(); return num("dec", U.decAdd(fmt(a), fmt(b)), Math.round((a + b) * 100) / 100, U.decWhy + ` ${fmt(a)} + ${fmt(b)} = ${fmt(a + b)}.`); },
  function subQ(){ let a, b; do { a = P([d1, d2, () => R(2, 9)])(); b = P([d1, d2])(); } while(b >= a); const r = Math.round((a - b) * 100) / 100; return num("dec", U.decSub(fmt(a), fmt(b)), r, U.decWhy + ` ${fmt(a)} − ${fmt(b)} = ${fmt(r)}.`); },
  function mul10Q(){ const a = P([d1, d2])(), k = P([10, 100, 1000]), z = String(k).length - 1; return num("dec", U.decMul10(fmt(a), k), Math.round(a * k * 1000) / 1000, U.decMul10Why(k, z) + ` ${fmt(a)} · ${k} = ${fmt(a * k)}.`); },
  function div10Q(){ const a = P([() => R(12, 980), d1])(), k = P([10, 100]), z = String(k).length - 1; const r = Math.round(a / k * 1e5) / 1e5; return num("dec", U.decDiv10(fmt(a), k), r, U.decDiv10Why(k, z) + ` ${fmt(a)} : ${k} = ${fmt(r)}.`); },
  function mulNQ(){ const a = P([d1, d2])(), n = R(2, 9), r = Math.round(a * n * 100) / 100; return num("dec", U.decMulN(fmt(a), n), r, U.decMulNWhy(fmt(a), n, fmt(r))); },
  function maxQ(){
    const w = R(0, 5), x = R(1, 8), y = R(1, 8);
    const c = [w + x / 10, w + (x - 1) / 10 + y / 100 + 0.009 * (y % 2), w + x / 100 + y / 1000, w + x / 10 - 0.01 * R(1, 3)].map(v => Math.round(v * 1000) / 1000);
    const mx = Math.max(...c); if(new Set(c).size < 4 || c.filter(v => v === mx).length > 1) return maxQ();
    return opt("dec", U.decMax, fmt(mx), c.filter(v => v !== mx).map(fmt), U.decMaxWhy + ` ${SH(c).sort((p, q) => q - p).map(fmt).join(" > ")}.`);
  },
  function roundQ(){
    const place = P([0, 1, 2]), dig = place + 1;
    let a; do { a = R(1, 99) + R(1, Math.pow(10, dig) - 1) / Math.pow(10, dig); a = Math.round(a * 1e4) / 1e4; } while(Math.round(a * Math.pow(10, dig)) % 10 === 0);
    const nextD = Math.floor(Math.round(a * Math.pow(10, dig)) % 10);
    const r = Math.round(a * Math.pow(10, place)) / Math.pow(10, place);
    return num("dec", U.round(fmt(a), U.places[place]), r, U.roundWhy(fmt(a), nextD, fmt(r)));
  },
  function pctOfQ(){ const p = P([10, 20, 25, 50, 75, 5, 30, 40, 60, 15]); let n; do { n = R(2, 40) * 10; } while((n * p) % 100); return num("dec", U.pctOf(p, n), n * p / 100, U.pctOfWhy(p, n, n * p / 100)); },
  function pctWhatQ(){ const p = P([10, 20, 25, 50, 75, 5, 40, 60, 80]); let n; do { n = R(2, 30) * 4; } while((n * p) % 100); const a = n * p / 100; return num("dec", U.pctWhat(a, n), p, U.pctWhatWhy(a, n, p)); },
  function pctWholeQ(){ const p = P([10, 20, 25, 50, 5, 40]); let w; do { w = R(2, 40) * 10; } while((w * p) % 100); const a = w * p / 100; return num("dec", U.pctWhole(p, a), w, U.pctWholeWhy(p, a, w)); },
  function saleQ(){ const p = P([10, 20, 25, 50, 30, 15]); let price; do { price = R(2, 30) * 4; } while((price * p) % 100); const d = price * p / 100; const item = P(U.items); return num("dec", U.sale(item, price, p), price - d, U.saleWhy(price, p, d, price - d)); },
  function riseQ(){ const p = P([10, 20, 25, 50, 30]); let n; do { n = R(2, 30) * 4; } while((n * p) % 100); const d = n * p / 100; return num("dec", U.rise(n, p), n + d, U.riseWhy(n, p, d, n + d)); },
  function placeQ(){ const ds = SH([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4), x = `${ds[0]},${ds[1]}${ds[2]}${ds[3]}`, k = R(0, 2);
    return num("dec", Q.place(x, Q.placeNames[k]), ds[k + 1], Q.placeWhy(x, Q.placeNames.map((p, i) => `${p} – ${ds[i + 1]}`).join(", "))); },
  function decDivNQ(){ const r = P([d1, d2])(), n = R(2, 9), a = Math.round(r * n * 100) / 100; return num("dec", Q.decDivN(fmt(a), n), r, Q.decDivNWhy(fmt(a), n, fmt(r))); },
  function changeQ(){ const a = R(50, 450) / 100, b = R(50, 600) / 100, s = Math.round((a + b) * 100) / 100, p = s < 5 ? P([5, 10]) : s < 10 ? P([10, 20]) : 20; const r = Math.round((p - s) * 100) / 100;
    return num("dec", Q.change(eur(a), eur(b), p), r, Q.changeWhy(eur(a), eur(b), eur(s), p, eur(r))); },
  function pctFrQ(){ const L = [[50, [1, 2]], [25, [1, 4]], [75, [3, 4]], [20, [1, 5]], [10, [1, 10]], [40, [2, 5]], [60, [3, 5]], [80, [4, 5]], [5, [1, 20]], [30, [3, 10]], [70, [7, 10]]]; const [p, f] = P(L);
    const bad = [fr(1, p)].concat(SH(L.filter(q => q[0] !== p)).map(q => fr(q[1][0], q[1][1]))); return opt("dec", Q.pctFr(p), fr(f[0], f[1]), distinct(bad, 3, c => c === fr(f[0], f[1])), Q.pctFrWhy(p, fr(f[0], f[1]))); },
  function minQ(){
    const w = R(1, 6), x = R(1, 8), y = R(1, 8);
    const c = [w + x / 10, w + x / 100 + y / 1000 + 0.1, w + (x + 1) / 10 - 0.01 * y, w + x / 10 + 0.001 * R(1, 9)].map(v => Math.round(v * 1000) / 1000);
    const mn = Math.min(...c); if(new Set(c).size < 4 || c.filter(v => v === mn).length > 1) return minQ();
    return opt("dec", Q.decMin, fmt(mn), c.filter(v => v !== mn).map(fmt), Q.decMinWhy + ` ${c.slice().sort((p, q) => p - q).map(fmt).join(" < ")}.`);
  }
];

/* ================= 4. Geometrija (Erelio uola, žaliasis slibinas) ================= */
const UNITS = [["m", "cm", 100], ["km", "m", 1000], ["dm", "cm", 10], ["m²", "dm²", 100], ["dm²", "cm²", 100], ["m³", "dm³", 1000], ["dm³", "cm³", 1000], ["kg", "g", 1000], ["t", "kg", 1000], ["h", "min", 60]];
const GEO = [
  function rectP(){ const a = R(5, 25), b = R(2, a - 1); return num("geo", U.rectP(a, b), 2 * (a + b), U.rectPWhy(a, b, 2 * (a + b)), F.rect(a, b, "cm")); },
  function rectS(){ const a = R(4, 15), b = R(2, 12); return num("geo", U.rectS(a, b), a * b, U.rectSWhy(a, b, a * b), F.rect(a, b, "m")); },
  function sqSide(){ const a = R(3, 25); return num("geo", U.sqSide(4 * a), a, U.sqSideWhy(4 * a, a), F.sq()); },
  function sqArea(){ const a = R(2, 12); return num("geo", U.sqArea(4 * a), a * a, U.sqAreaWhy(4 * a, a, a * a), F.sq()); },
  function rtri(){ let a, b; do { a = R(3, 14); b = R(4, 16); } while((a * b) % 2); return num("geo", U.rtri(a, b), a * b / 2, U.rtriWhy(a, b, a * b / 2), F.rtri(a, b)); },
  function box(){ const a = R(2, 10), b = R(2, 8), c = R(2, 6); return num("geo", U.box(a, b, c), a * b * c, U.boxWhy(a, b, c, a * b * c), F.box(a, b, c)); },
  function cube(){ const a = R(2, 9); return num("geo", U.cube(a), a * a * a, U.cubeWhy(a, a * a * a)); },
  function adj(){ const a = R(25, 155); return num("geo", U.adj(a), 180 - a, U.adjWhy(a, 180 - a), F.adj(a)); },
  function vert(){ const a = R(30, 150); return num("geo", U.vert(a), a, U.vertWhy(a), F.vert(a)); },
  function vert2(){ const a = R(30, 150); return num("geo", U.vert2(a), 180 - a, U.adjWhy(a, 180 - a), F.vert(a)); },
  function tri(){ let a, b; do { a = R(25, 100); b = R(20, 100); } while(a + b >= 165); return num("geo", U.tri(a, b), 180 - a - b, U.triWhy(a, b, 180 - a - b)); },
  function unit(){ const [u1, u2, k] = P(UNITS); const v = k === 60 ? R(2, 5) : P([R(2, 9), R(2, 9) + 0.5, R(11, 30)]); return num("geo", U.unit(fmt(v), u1, u2), v * k, U.unitWhy(k, u1, u2) + ` ${fmt(v)} · ${k} = ${fmt(v * k)}.`); },
  function angleT(){ const k = R(0, 3), a = [R(10, 85), 90, R(95, 175), 180][k]; return opt("geo", Q.angleT(a), Q.angleNames[k], Q.angleNames.filter((_, i) => i !== k), Q.angleWhy); },
  function rectSide(){ const a = R(5, 15), b = R(2, a - 1); return num("geo", Q.rectSide(a * b, a), b, Q.rectSideWhy(a * b, a, b), F.rect(a, "?", "cm")); },
  function triP(){ let a, b, c; do { a = R(3, 20); b = R(3, 20); c = R(3, 20); } while(a + b <= c || a + c <= b || b + c <= a); return num("geo", Q.triP(a, b, c), a + b + c, Q.triPWhy(a, b, c, a + b + c)); },
  function eqTri(){ const a = R(3, 30); return num("geo", Q.eqTri(3 * a), a, Q.eqTriWhy(3 * a, a)); },
  function diam(){ const r = R(2, 25); return R(0, 1) ? num("geo", Q.diam(r), 2 * r, Q.diamWhy(r, 2 * r)) : num("geo", Q.rad(2 * r), r, Q.diamWhy(r, 2 * r)); },
  function floorQ(){ const a = R(3, 9), b = R(2, a); return num("geo", Q.floor(a, b), a * b, U.rectSWhy(a, b, a * b), F.rect(a, b, "m")); }
];

/* ================= 5. Lygtys ir judėjimas (Žuvies kristalas, tiltas) ================= */
const SPEED = [[10, 20], [3, 6], [50, 90], [12, 30], [50, 90]];
const mover = () => { const i = R(0, U.who.length - 1), [lo, hi] = SPEED[i] || [5, 20]; return [U.who[i], R(lo, hi)]; };
const EQ = [
  function eqAdd(){ const x = R(12, 90), a = R(11, 80); return num("eq", U.eqAdd(a, x + a), x, `x = ${x + a} − ${a} = ${x}.`); },
  function eqSub(){ const x = R(30, 120), a = R(5, x - 5); return num("eq", U.eqSub(a, x - a), x, `x = ${x - a} + ${a} = ${x}.`); },
  function eqMul(){ const x = R(3, 25), a = R(3, 12); return num("eq", U.eqMul(a, a * x), x, `x = ${a * x} : ${a} = ${x}.`); },
  function eqDiv(){ const b = R(3, 15), a = R(2, 9); return num("eq", U.eqDivL(a, b), a * b, `x = ${b} · ${a} = ${a * b}.`); },
  function eq2(){ const x = R(2, 15), a = R(2, 9), b = R(1, 30); return num("eq", U.eq2(a, b, a * x + b), x, `${a}x = ${a * x + b} − ${b} = ${a * x};<br>x = ${a * x} : ${a} = ${x}.`); },
  function eq2m(){ const x = R(3, 15), a = R(2, 9), b = R(1, a * x - 1); return num("eq", U.eq2m(a, b, a * x - b), x, `${a}x = ${a * x - b} + ${b} = ${a * x};<br>x = ${a * x} : ${a} = ${x}.`); },
  function eq3(){ const x = R(1, 12), a = R(2, 6), b = R(1, 9); return num("eq", U.eq3(a, b, a * (x + b)), x, `x + ${b} = ${a * (x + b)} : ${a} = ${x + b};<br>x = ${x + b} − ${b} = ${x}.`); },
  function like(){
    const k = Array.from({ length: R(3, 4) }, () => R(1, 9)), s = k.map((v, i) => i && R(0, 2) === 0 ? -v : v);
    const r = s.reduce((p, q) => p + q, 0); if(r <= 0) return like();
    const exp = s.map((v, i) => (i ? (v < 0 ? " − " : " + ") : "") + (Math.abs(v) === 1 ? "" : Math.abs(v)) + "a").join("");
    return num("eq", U.like(exp), r, U.likeWhy(s.map((v, i) => (i ? (v < 0 ? " − " : " + ") : "") + Math.abs(v)).join(""), r));
  },
  function longDiv(){ const b = R(12, 48), r = R(11, 39); return num("eq", U.longDiv(b * r, b), r, U.longDivWhy(b * r, b, r)); },
  function pathS(){ const [who, v] = mover(), t = R(2, 6); return num("eq", U.pathS(who, v, t), v * t, U.pathWhy(`s = ${v} · ${t}`, v * t + " km")); },
  function pathV(){ const [who, v] = mover(), t = R(2, 6); return num("eq", U.pathV(who, v * t, t), v, U.pathWhy(`v = s : t = ${v * t} : ${t}`, v + " km/h")); },
  function pathT(){ const [who, v] = mover(), t = R(2, 6); return num("eq", U.pathT(who, v * t, v), t, U.pathWhy(`t = s : v = ${v * t} : ${v}`, t + " h")); },
  function meet(){ const v1 = R(8, 18), v2 = R(10, 22), t = R(2, 4); return num("eq", U.meet(v1, v2, (v1 + v2) * t), t, U.meetWhy(v1, v2, (v1 + v2) * t, t)); },
  function think(){ const x = R(3, 25), a = R(2, 9), b = R(2, 40); return num("eq", Q.think(a, b, a * x + b), x, Q.thinkWhy(a, b, a * x + b, x)); },
  function orderQ(){ const a = R(5, 60), b = R(2, 9), c = R(2, 12), k = R(0, 2);
    const [e, r] = k === 0 ? [`${a} + ${b} · ${c}`, a + b * c] : k === 1 ? [`(${a} + ${b}) · ${c}`, (a + b) * c] : [`${b * c * 2} : ${b} − ${c}`, c * 2 - c];
    return num("eq", Q.order(e), r, Q.orderWhy + ` ${e} = ${r}.`); },
  function exprQ(){ const k = R(2, 9), m = R(1, 30), v = R(2, 12), sub = R(0, 1) && k * v > m; const e = `${k}a ${sub ? "−" : "+"} ${m}`, r = sub ? k * v - m : k * v + m;
    return num("eq", Q.expr(e, v), r, Q.exprWhy(`${k} · ${v} ${sub ? "−" : "+"} ${m}`, r)); },
  function costQ(){ const n = R(2, 9), one = R(15, 180) / 10 * (R(0, 1) ? 1 : 0.5), p = Math.round(one * n * 100) / 100; const o = Math.round(one * 100) / 100;
    return num("eq", Q.cost(n, P(Q.costItems), eur(p)), o, Q.costWhy(eur(p), n, eur(o))); }
];

/* ================= 6. Tikimybė ir romėniški skaitmenys (tik raudonajam slibinui) ================= */
const ROM = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
const toRoman = n => { let s = "", parts = []; for(const [v, r] of ROM) while(n >= v){ s += r; parts.push(v); n -= v; } return { s, parts }; };
const PROB = [
  function balls(){
    const [ca, cb] = SH(U.colors).slice(0, 2); const a = R(2, 6), b = R(2, 9 - a + 1); const n = a + b; if(n > 10) return balls();
    const wrong = distinct([fr(a, b), fr(b, n), fr(1, n), fr(a, n + 1)], 3, c => c === fr(a, n));
    return opt("prob", U.prob(a, ca[0], b, cb[0], ca[1]), fr(a, n), wrong, U.probWhy(a, n));
  },
  function die(){
    const [k, list] = P(U.dieKinds), m = list.length;
    const wrong = distinct([fr(6 - m, 6), fr(1, m), fr(m, 5), fr(1, 6), fr(m + 1, 6)], 3, c => c === fr(m, 6));
    return opt("prob", U.die(k), fr(m, 6), wrong, U.dieWhy(list.join(", "), m));
  },
  function roman(){ const v = R(14, 2999); const { s, parts } = toRoman(v); return num("prob", U.roman(s), v, U.romanWhy(s, parts.join(" + "), v)); },
  function letterQ(){ const w = P(Q.letterWords), ls = [...new Set(w)], l = P(ls), m = w.split(l).length - 1, n = w.length;
    const seenV = [m / n], wrong = []; for(const [p, q] of [[1, n], [m, ls.length], [m + 1, n], [n - m, n], [1, m + 1], [m, n - m], [m, n + 1]]){ const v = p / q; if(wrong.length < 3 && v < 1 && !seenV.some(x => Math.abs(x - v) < 1e-9)){ seenV.push(v); wrong.push(fr(p, q)); } }
    return opt("prob", Q.letter(w, l), fr(m, n), wrong, Q.letterWhy(l, m, n)); },
  function toRomanQ(){ const v = R(14, 1999), o = toRoman(v); const bad = distinct([v + 1, v - 1, v + 10, v - 10, v + 5, v + 100].map(x => toRoman(x).s), 3, c => c === o.s);
    return opt("prob", Q.toRoman(v), o.s, bad, Q.toRomanWhy(v, o.parts.join(" + "), o.s)); },
  function combosQ(){ const a = R(2, 9), b = R(2, 9); return num("prob", P(Q.combos)(a, b), a * b, Q.combosWhy(a, b, a * b)); }
];

/* ================= 7. Kiti mokomieji dalykai (tekstai-dalykai.lt.js + uzduociu-bankas.lt.js) ================= */
const D = window.MK_T_D, B = window.MK_T_B || {}, ZW = window.MK_ZODZIAI || [];
const rowGen = (topic, row) => function(){ return opt(topic, row[0], row[1], SH(row[2]), row[3]); };
const rowsOf = k => (D[k] || []).concat(B[k] || []);
const IST = rowsOf("ist").map(r => rowGen("ist", r)), GAM = rowsOf("gam").map(r => rowGen("gam", r));
/* nematytų elementų kaladė (įsimenama naršyklėje): kol neparodyti visi, tas pats nesikartoja */
const SEEN_KEY = "mk-slibino-sala-matyta", SEEN = MK.get(SEEN_KEY, {});
function deck(key, n){ let s = SEEN[key] || []; if(s.length >= n) s = []; const free = []; for(let i = 0; i < n; i++) if(!s.includes(i)) free.push(i); const i = P(free); s.push(i); SEEN[key] = s; MK.set(SEEN_KEY, SEEN); return i; }
const times = (n, f) => Array.from({ length: n }, () => f);
/* lietuvių kalba: veiksmažodžių laikai iš patikrinto „Žodžių slalomo“ sąrašo */
const VF = { E: [], K: [], D: [], S: [] }; ZW.forEach(([inf, f]) => { for(const c in VF) if(f[c]) f[c].split(" ").forEach(w => VF[c].push([w, inf, f])); });
function tenseQ(){ const c = P(Object.keys(VF)), [w, inf] = P(VF[c]); return opt("lt", Q.tense(w), Q.tenseNames[c], Object.keys(VF).filter(k => k !== c).map(k => Q.tenseNames[k]), Q.tenseWhy[c](w, inf)); }
function infQ(){ const [inf, f] = P(ZW), bad = SH(["E", "K", "D", "S"].filter(c => f[c])).slice(0, 3).map(c => P(f[c].split(" "))); return opt("lt", Q.inf, inf, bad, Q.infWhy(inf)); }
function posQ(){ const [w, p] = B.ltPos[deck("ltPos", B.ltPos.length)], names = Object.keys(Q.posNames); return opt("lt", Q.pos(w), Q.posNames[p], SH(names.filter(n => n !== p)).slice(0, 3).map(n => Q.posNames[n]), Q.posWhy[p]); }
function synQ(){ const [w, s2, bad] = B.ltSyn[deck("ltSyn", B.ltSyn.length)]; return opt("lt", Q.syn(w), s2, SH(bad), Q.synWhy(w, s2)); }
function antQ(){ const [w, s2, bad] = B.ltAnt[deck("ltAnt", B.ltAnt.length)]; return opt("lt", Q.ant(w), s2, SH(bad), Q.antWhy(w, s2)); }
const LT = rowsOf("lt").map(r => rowGen("lt", r)).concat(ZW.length ? times(40, tenseQ).concat(times(10, infQ)) : [], B.ltPos ? times(40, posQ).concat(times(15, synQ), times(15, antQ)) : []);
/* anglų kalba */
const VERBS = B.enVerbs || D.enVerbs, PLUR = B.enPlurals || D.enPlurals;
const verbGen = v => function(){ const reg = v[0].endsWith("e") ? v[0] + "d" : v[0] + "ed"; const bad = distinct([reg, v[2], v[3], v[0], v[0] + "s"], 3, c => c === v[1]); return opt("en", D.enPastQ(v[0]), v[1], SH(bad), D.enPastWhy(v[0], v[1], v[2])); };
function vocabQ(){ const V = B.enVocab, [en, lt, cat] = V[deck("enVocab", V.length)], same = SH(V.filter(x => x[2] === cat && x[0] !== en && x[1] !== lt));
  if(R(0, 1)) return opt("en", Q.enToLt(en), lt, distinct(same.map(x => x[1]), 3, c => c === lt), Q.vocabWhy(en, lt));
  return opt("en", Q.ltToEn(lt), en, distinct(same.map(x => x[0]), 3, c => c === en), Q.vocabWhy(en, lt)); }
const EN = rowsOf("en").map(r => rowGen("en", r)).concat(VERBS.map(verbGen), PLUR.map(w => function(){ return opt("en", D.enPluralQ(w[0]), w[1], SH(w[2]), D.enPluralWhy(w[0], w[1])); }), B.enVocab ? times(110, vocabQ) : []);

const SETS = { div: DIV, frac: FRAC, dec: DEC, geo: GEO, eq: EQ, prob: PROB, ist: IST, lt: LT, en: EN, gam: GAM };
const SUBJ = { div: "mat", frac: "mat", dec: "mat", geo: "mat", eq: "mat", prob: "mat", ist: "ist", lt: "lt", en: "en", gam: "gam" };
/* sunkesni generatoriai raudonajam slibinui */
const HARD = [DIV[3], DIV[4], DIV[7], DIV[8], FRAC[5], FRAC[6], FRAC[7], FRAC[9], DEC[5], DEC[9], DEC[10], DEC[11], GEO[3], GEO[5], GEO[9], GEO[10], EQ[6], EQ[7], EQ[11], EQ[12], PROB[0], PROB[1], PROB[2],
  DIV[13], FRAC[13], DEC[14], GEO[13], EQ[13], EQ[16], PROB[5]];
/* raudonojo slibino kova: dalykai keičiasi ratu, kad būtų visi */
const MIXSEQ = ["mat", "lt", "gam", "mat", "ist", "en"];
let mixI = Math.floor(Math.random() * MIXSEQ.length);

/* užduočių parinkimas: kaladė per visą rinkinį + neseniai matytų klausimų tekstų vengimas */
const recentQ = [];
function gen(topic){
  let key = topic, pool;
  if(topic === "mix"){ const k = MIXSEQ[mixI++ % MIXSEQ.length]; key = k === "mat" ? "hard" : k; pool = k === "mat" ? HARD : SETS[k]; }
  else pool = SETS[topic];
  let t;
  for(let k = 0; k < 8; k++){ t = pool[deck("g:" + key, pool.length)](); if(!recentQ.includes(t.q)) break; }
  recentQ.push(t.q); if(recentQ.length > 60) recentQ.shift();
  t.subj = SUBJ[t.topic] || "mat"; return t;
}
/* atsakymo tikrinimas: „4,15“, „4.15“, „ 4,150 “ */
function check(t, input){
  if(t.type === "opt") return +input === t.a;
  const s = String(input).trim().replace(/\s/g, "").replace(".", ",");
  if(!/^-?\d+(,\d+)?$/.test(s)) return false;
  return Math.abs(parseFloat(s.replace(",", ".")) - t.a) < 1e-6;
}
window.MK_SALA_U = { gen, check, SETS, HARD, fmt, SUBJ };
})();
