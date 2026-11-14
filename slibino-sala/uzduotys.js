/* Slibino sala – 5 klasės užduočių generatoriai (pagal Matematikos bendrąją programą, 5 kl.).
   Kiekviena užduotis: { topic, q, type: "num" | "opt", a (skaičius arba teisingo varianto indeksas), opts, show, why, fig }.
   Tekstai – window.MK_T.U (tekstai.lt.js). */
(function(){
"use strict";
const U = window.MK_T.U, R = MK.rnd, P = MK.pick, SH = MK.shuffle;
const gcd = (a, b) => b ? gcd(b, a % b) : a, lcm = (a, b) => a / gcd(a, b) * b;
const fmt = x => { const r = Math.round(x * 1e6) / 1e6; return String(r).replace(".", ","); };
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
  }
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
  }
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
  function riseQ(){ const p = P([10, 20, 25, 50, 30]); let n; do { n = R(2, 30) * 4; } while((n * p) % 100); const d = n * p / 100; return num("dec", U.rise(n, p), n + d, U.riseWhy(n, p, d, n + d)); }
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
  function unit(){ const [u1, u2, k] = P(UNITS); const v = k === 60 ? R(2, 5) : P([R(2, 9), R(2, 9) + 0.5, R(11, 30)]); return num("geo", U.unit(fmt(v), u1, u2), v * k, U.unitWhy(k, u1, u2) + ` ${fmt(v)} · ${k} = ${fmt(v * k)}.`); }
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
  function meet(){ const v1 = R(8, 18), v2 = R(10, 22), t = R(2, 4); return num("eq", U.meet(v1, v2, (v1 + v2) * t), t, U.meetWhy(v1, v2, (v1 + v2) * t, t)); }
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
  function roman(){ const v = R(14, 2999); const { s, parts } = toRoman(v); return num("prob", U.roman(s), v, U.romanWhy(s, parts.join(" + "), v)); }
];

/* ================= 7. Kiti mokomieji dalykai (tekstai-dalykai.lt.js) ================= */
const D = window.MK_T_D;
const rowGen = (topic, row) => function(){ return opt(topic, row[0], row[1], SH(row[2]), row[3]); };
const IST = D.ist.map(r => rowGen("ist", r)), LT = D.lt.map(r => rowGen("lt", r)), GAM = D.gam.map(r => rowGen("gam", r));
const EN = D.en.map(r => rowGen("en", r))
  .concat(D.enVerbs.map(v => function(){ const reg = v[0].endsWith("e") ? v[0] + "d" : v[0] + "ed"; return opt("en", D.enPastQ(v[0]), v[1], SH([reg, v[2], v[3]]), D.enPastWhy(v[0], v[1], v[2])); }))
  .concat(D.enPlurals.map(w => function(){ return opt("en", D.enPluralQ(w[0]), w[1], SH(w[2]), D.enPluralWhy(w[0], w[1])); }));

const SETS = { div: DIV, frac: FRAC, dec: DEC, geo: GEO, eq: EQ, prob: PROB, ist: IST, lt: LT, en: EN, gam: GAM };
const SUBJ = { div: "mat", frac: "mat", dec: "mat", geo: "mat", eq: "mat", prob: "mat", ist: "ist", lt: "lt", en: "en", gam: "gam" };
/* sunkesni generatoriai raudonajam slibinui */
const HARD = [DIV[3], DIV[4], DIV[7], DIV[8], FRAC[5], FRAC[6], FRAC[7], FRAC[9], DEC[5], DEC[9], DEC[10], DEC[11], GEO[3], GEO[5], GEO[9], GEO[10], EQ[6], EQ[7], EQ[11], EQ[12], PROB[0], PROB[1], PROB[2]];
/* raudonojo slibino kova: dalykai keičiasi ratu, kad būtų visi */
const MIXSEQ = ["mat", "lt", "gam", "mat", "ist", "en"];
let mixI = Math.floor(Math.random() * MIXSEQ.length);

/* neseniai matytų generatorių vengimas (atskirai kiekvienam rinkiniui) */
const recent = new Map();
function gen(topic){
  let pool;
  if(topic === "mix"){ const k = MIXSEQ[mixI++ % MIXSEQ.length]; pool = k === "mat" ? HARD : SETS[k]; }
  else pool = SETS[topic];
  let rc = recent.get(pool); if(!rc){ rc = []; recent.set(pool, rc); }
  let f, k = 0; do { f = P(pool); k++; } while(rc.includes(f) && k < 30);
  rc.push(f); if(rc.length > Math.min(12, pool.length - 1)) rc.shift();
  const t = f(); t.gen = f.name; t.subj = SUBJ[t.topic] || "mat"; return t;
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
