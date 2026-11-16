/* MokomėsKartu.lt – „Procesoriaus akimis“ (8–10 kl., informatika): programų modelis.
   Programa – eilučių sąrašas [atitraukimas, sakinys]; iš to paties modelio gaunamas Python ir C++ tekstas,
   programa įvykdoma pažingsniui (vykdymo eiga su kintamųjų reikšmėmis) ir generuojamos užduotys.
   Mokiniui rodomų tekstų čia nėra – jie faile tekstai.lt.js. */
(function(root){
"use strict";
const set = (v, e) => ["set", v, e], aug = (v, o, e) => ["aug", v, o, e], If = c => ["if", c], Elif = c => ["elif", c], Else = () => ["else"],
  For = (v, a, b, s) => ["for", v, a, b, s || 1], Wh = c => ["while", c], pr = (...e) => ["print", ...e], prs = e => ["prints", e],
  def = (n, ps) => ["def", n, ps], ret = e => ["ret", e], doo = e => ["do", e], S = s => ["str", s], call = (n, ...a) => ["call", n, a];
const OPEN = { if: 1, elif: 1, else: 1, for: 1, while: 1, def: 1 };

/* ================= tekstas: Python ir C++ ================= */
const PREC = { or: 1, and: 2, "==": 4, "!=": 4, "<": 4, "<=": 4, ">": 4, ">=": 4, "+": 5, "-": 5, "*": 6, "//": 6, "%": 6 };
const CPP = { or: "||", and: "&&", "//": "/" };
function ex(e, L, pp){
  pp = pp || 0;
  if(typeof e === "number") return e < 0 && pp > 4 ? "(" + e + ")" : String(e);
  if(typeof e === "string") return e;
  const k = e[0];
  if(k === "str") return '"' + e[1] + '"';
  if(k === "call") return e[1] + "(" + e[2].map(x => ex(x, L)).join(", ") + ")";
  if(k === "not") return (L === "py" ? "not " : "!") + "(" + ex(e[1], L) + ")";
  const p = PREC[k], s = ex(e[1], L, p) + " " + (L === "cpp" && CPP[k] || k) + " " + ex(e[2], L, p + 1);
  return p < pp ? "(" + s + ")" : s;
}
function lineTxt(s, L, decl, isInt){
  const py = L === "py", sc = py ? "" : ";";
  switch(s[0]){
    case "set": return (decl ? "int " : "") + s[1] + " = " + ex(s[2], L) + sc;
    case "aug": return s[1] + " " + s[2] + "= " + ex(s[3], L) + sc;
    case "if": return py ? "if " + ex(s[1], L) + ":" : "if (" + ex(s[1], L) + ") {";
    case "elif": return py ? "elif " + ex(s[1], L) + ":" : "else if (" + ex(s[1], L) + ") {";
    case "else": return py ? "else:" : "else {";
    case "while": return py ? "while " + ex(s[1], L) + ":" : "while (" + ex(s[1], L) + ") {";
    case "for": {
      const v = s[1], a = ex(s[2], L), to = s[3], st = s[4], minus1 = Array.isArray(to) && to[0] === "-" && to[2] === 1;
      if(py){
        const end = st > 0 ? (typeof to === "number" ? to + 1 : minus1 ? ex(to[1], L) : ex(["+", to, 1], L)) : (typeof to === "number" ? to - 1 : ex(["-", to, 1], L));
        return "for " + v + " in range(" + a + ", " + end + (st === 1 ? "" : ", " + st) + "):";
      }
      const cond = st > 0 ? (minus1 ? v + " < " + ex(to[1], L) : v + " <= " + ex(to, L)) : v + " >= " + ex(to, L);
      const inc = st === 1 ? v + "++" : st === -1 ? v + "--" : st > 0 ? v + " += " + st : v + " -= " + (-st);
      return "for (" + (decl ? "int " : "") + v + " = " + a + "; " + cond + "; " + inc + ") {";
    }
    case "print": return py ? "print(" + s.slice(1).map(x => ex(x, L)).join(", ") + ")" : "cout << " + s.slice(1).map(x => ex(x, L)).join(' << " " << ') + " << endl;";
    case "prints": return py ? "print(" + ex(s[1], L) + ', end=" ")' : "cout << " + ex(s[1], L) + ' << " ";';
    case "def": return py ? "def " + s[1] + "(" + s[2].join(", ") + "):" : (isInt ? "int " : "void ") + s[1] + "(" + s[2].map(p => "int " + p).join(", ") + ") {";
    case "ret": return "return " + ex(s[1], L) + sc;
    case "do": return ex(s[1], L) + sc;
  }
  return "?";
}
/* Grąžina rodomas eilutes: { t – tekstas, d – atitraukimas, src – modelio eilutės numeris arba −1 (C++ skliaustas, aprašas) }.
   opt.declTop – C++ kintamieji aprašomi vienoje eilutėje viršuje (užduotyse „Sudėk programą“). */
function render(lines, L, opt){
  opt = opt || {}; const out = [];
  if(L === "py"){ lines.forEach((l, i) => out.push({ t: lineTxt(l[1], L), d: l[0], src: i })); return out; }
  const hasRet = i => { for(let j = i + 1; j < lines.length && lines[j][0] > 0; j++) if(lines[j][1][0] === "ret") return true; return false; };
  const top = new Set(); let scope = top, inDef = false, open = 0;
  if(opt.declTop){
    const vs = []; let f = false;
    lines.forEach(l => { const s = l[1]; if(l[0] === 0) f = s[0] === "def"; if(!f && (s[0] === "set" || s[0] === "for") && !vs.includes(s[1])) vs.push(s[1]); });
    (opt.extra || []).forEach(v => { if(!vs.includes(v)) vs.push(v); });
    if(vs.length) out.push({ t: "int " + vs.join(", ") + ";", d: 0, src: -1 }); vs.forEach(v => top.add(v));
  }
  /* kintamieji, kuriems pirmą kartą priskiriama bloko viduje, aprašomi prieš tą bloką: „int m;“ */
  const before = {}; { let known = new Set(top), base = 0, anchor = 0;
    lines.forEach((l, i) => { const d = l[0], s = l[1];
      if(d === 0){ if(s[0] === "def"){ known = new Set(s[2]); base = 1; } else if(base === 1){ known = new Set(top); base = 0; } }
      if(d === base && s[0] !== "elif" && s[0] !== "else") anchor = i;
      if(s[0] === "set" && !known.has(s[1])){ known.add(s[1]); if(d > base) (before[anchor] = before[anchor] || []).push(s[1]); } }); }
  lines.forEach((l, i) => {
    const d = l[0], s = l[1]; let pre = "";
    while(open > d){ open--; if(open === d && (s[0] === "else" || s[0] === "elif")) pre = "} "; else out.push({ t: "}", d: open, src: -1 }); }
    if(d === 0 && inDef && s[0] !== "def"){ inDef = false; scope = top; }
    if(s[0] === "def"){ inDef = true; scope = new Set(s[2]); }
    if(before[i]){ out.push({ t: "int " + before[i].join(", ") + ";", d, src: -1 }); before[i].forEach(v => scope.add(v)); }
    let decl = false;
    if(s[0] === "set" && !scope.has(s[1])){ decl = true; scope.add(s[1]); }
    if(s[0] === "for" && !scope.has(s[1])) decl = true;
    out.push({ t: pre + lineTxt(s, L, decl, s[0] === "def" && hasRet(i)), d, src: i });
    if(OPEN[s[0]]) open = d + 1;
  });
  while(open > 0){ open--; out.push({ t: "}", d: open, src: -1 }); }
  return out;
}

/* ================= vykdymas pažingsniui ================= */
function build(lines){
  let i = 0;
  function sub(d, me){ if(i >= lines.length || lines[i][0] <= d) throw { err: "empty", i: me }; return block(d + 1); }
  function block(d){
    const ns = [];
    while(i < lines.length){
      const ld = lines[i][0], s = lines[i][1]; if(ld < d) break; if(ld > d) throw { err: "indent", i };
      const k = s[0], me = i; i++;
      if(k === "elif" || k === "else"){
        const last = ns[ns.length - 1]; if(!last || last.t !== "if" || last.els) throw { err: "else", i: me };
        const body = sub(d, me); if(k === "elif") last.br.push({ i: me, c: s[1], body }); else last.els = { i: me, body }; continue;
      }
      if(k === "if"){ ns.push({ t: "if", br: [{ i: me, c: s[1], body: sub(d, me) }], els: null }); continue; }
      if(k === "for" || k === "while"){ ns.push({ t: k, i: me, s, body: sub(d, me) }); continue; }
      if(k === "def"){ if(d !== 0) throw { err: "indent", i: me }; ns.push({ t: "def", i: me, s, body: sub(d, me) }); continue; }
      ns.push({ t: k, i: me, s });
    }
    return ns;
  }
  return block(0);
}
function run(lines, lim){
  lim = lim || 400;
  const st = { steps: [], out: [], err: null, neg: false, big: false };
  let tree; try{ tree = build(lines); }catch(e){ if(e && e.err){ st.err = e; st.tokens = []; return st; } throw e; }
  const defs = {}; let fr = { vars: {}, fn: null }, openLine = false, cur = 0;
  const rec = (i, n) => { if(st.steps.length >= lim) throw { err: "loop" }; st.steps.push({ i, fn: fr.fn, vars: Object.assign({}, fr.vars), out: st.out.slice(), n }); };
  function ev(e){
    if(typeof e === "number") return e;
    if(typeof e === "string"){ if(!(e in fr.vars)) throw { err: "name", v: e, i: cur }; return fr.vars[e]; }
    const k = e[0];
    if(k === "str") return e[1];
    if(k === "call"){
      const f = defs[e[1]]; if(!f) throw { err: "nofn", v: e[1], i: cur };
      const args = e[2].map(ev), save = fr, line = cur; rec(cur, { k: "call", f: e[1], a: args });
      fr = { vars: {}, fn: e[1] }; f.s[2].forEach((p, j) => { fr.vars[p] = args[j]; });
      let rv = 0; try{ exec(f.body); }catch(x){ if(x && x.ret !== undefined) rv = x.ret; else throw x; }
      fr = save; cur = line; return rv;
    }
    if(k === "not") return !ev(e[1]);
    if(k === "and") return ev(e[1]) && ev(e[2]);
    if(k === "or") return ev(e[1]) || ev(e[2]);
    const a = ev(e[1]), b = ev(e[2]); let r;
    switch(k){
      case "+": r = a + b; break; case "-": r = a - b; break; case "*": r = a * b; break;
      case "//": if(b === 0) throw { err: "zero", i: cur }; if(a < 0 || b < 0) st.neg = true; r = Math.floor(a / b); break;
      case "%": if(b === 0) throw { err: "zero", i: cur }; if(a < 0 || b < 0) st.neg = true; r = ((a % b) + b) % b; break;
      case "==": return a === b; case "!=": return a !== b; case "<": return a < b; case "<=": return a <= b; case ">": return a > b; case ">=": return a >= b;
    }
    if(Math.abs(r) > 99999) st.big = true;
    return r;
  }
  function exec(ns){
    for(const n of ns){
      const s = n.s;
      switch(n.t){
        case "set": { cur = n.i; const v = ev(s[2]); fr.vars[s[1]] = v; rec(n.i, { k: "set", v: s[1], val: v }); break; }
        case "aug": { cur = n.i; const v = ev([s[2], s[1], s[3]]); fr.vars[s[1]] = v; rec(n.i, { k: "set", v: s[1], val: v }); break; }
        case "print": { cur = n.i; const t = s.slice(1).map(ev).join(" ");
          if(openLine){ st.out[st.out.length - 1] += " " + t; openLine = false; } else st.out.push(t);
          rec(n.i, { k: "out", val: t }); break; }
        case "prints": { cur = n.i; const t = String(ev(s[1]));
          if(openLine) st.out[st.out.length - 1] += " " + t; else { st.out.push(t); openLine = true; }
          rec(n.i, { k: "out", val: t }); break; }
        case "if": { let done = false;
          for(const b of n.br){ cur = b.i; const c = !!ev(b.c); rec(b.i, { k: "if", c }); if(c){ exec(b.body); done = true; break; } }
          if(!done && n.els){ rec(n.els.i, { k: "else" }); exec(n.els.body); } break; }
        case "for": { cur = n.i; const a = ev(s[2]), b = ev(s[3]), stp = s[4];
          for(let v = a; stp > 0 ? v <= b : v >= b; v += stp){ fr.vars[s[1]] = v; rec(n.i, { k: "for", v: s[1], val: v }); exec(n.body); }
          rec(n.i, { k: "forend" }); break; }
        case "while": { for(;;){ cur = n.i; const c = !!ev(s[1]); rec(n.i, { k: "wh", c }); if(!c) break; exec(n.body); } break; }
        case "def": defs[s[1]] = n; break;
        case "ret": { cur = n.i; const v = ev(s[1]); rec(n.i, { k: "ret", val: v }); throw { ret: v }; }
        case "do": { cur = n.i; ev(s[1]); break; }
      }
    }
  }
  try{ exec(tree); }catch(e){ if(e && e.err) st.err = e; else if(e && e.ret !== undefined) st.err = { err: "ret" }; else throw e; }
  st.vars = fr.vars; st.tokens = st.out.join(" ").split(/\s+/).filter(Boolean);
  return st;
}

/* ================= užduočių šablonai ================= */
const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1)), pk = a => a[Math.floor(Math.random() * a.length)];
const out = { k: "out" }, val = v => ({ k: "val", v }), cnt = line => ({ k: "count", line });
/* Kiekvienas šablonas: lv – lygis, t – sunkumas (1–3), r – taisyklės raktas, g() → { lines, ask } */
const TPL = [];
const add = (id, lv, t, r, g) => TPL.push({ id, lv, t, r, g });

/* ----- k: kintamieji ir reikšmių priskyrimas ----- */
add("k1", "k", 1, "prec", () => { const m = R(0, 1); return { lines: [[0, set("a", R(2, 9))], [0, set("b", R(2, 9))], [0, set("c", m ? ["*", ["+", "a", "b"], R(2, 5)] : ["+", "a", ["*", "b", R(2, 5)]])], [0, pr("c")]], ask: out }; });
add("k2", "k", 1, "seq", () => ({ lines: [[0, set("x", R(2, 9))], [0, set("x", ["+", "x", R(2, 9)])], [0, set("x", ["*", "x", R(2, 4)])], [0, pr("x")]], ask: out }));
add("k3", "k", 1, "copy", () => ({ lines: [[0, set("a", R(3, 12))], [0, set("b", "a")], [0, set("a", [pk(["+", "*"]), "a", R(2, 6)])]], ask: val("b") }));
add("k4", "k", 2, "swap", () => { const a = R(2, 20), b = R(21, 40); return { lines: [[0, set("a", a)], [0, set("b", b)], [0, set("t", "a")], [0, set("a", "b")], [0, set("b", "t")], [0, pr("a", "b")]], ask: out }; });
add("k5", "k", 2, "swapbad", () => { const a = R(2, 20), b = R(21, 40); return { lines: [[0, set("a", a)], [0, set("b", b)], [0, set("a", "b")], [0, set("b", "a")], [0, pr("a", "b")]], ask: out }; });
add("k6", "k", 2, "divmod", () => { const m = R(0, 1); let n = R(23, 98); if(n % 10 === 0) n += 3; return { lines: [[0, set("n", n)], [0, set("d", ["//", "n", 10])], [0, set("v", ["%", "n", 10])], [0, pr(m ? ["+", "d", "v"] : ["+", ["*", "v", 10], "d"])]], ask: out }; });
add("k7", "k", 2, "divmod", () => ({ lines: [[0, set("minutes", R(65, 290))], [0, set("valandos", ["//", "minutes", 60])], [0, set("lieka", ["%", "minutes", 60])], [0, pr("valandos", "lieka")]], ask: out }));
add("k8", "k", 1, "aug", () => ({ lines: [[0, set("x", R(3, 9))], [0, aug("x", "+", R(2, 8))], [0, aug("x", "*", R(2, 3))], [0, aug("x", "-", R(1, 5))], [0, pr("x")]], ask: out }));
add("k9", "k", 3, "seq", () => ({ lines: [[0, set("a", R(3, 15))], [0, set("b", R(16, 30))], [0, set("a", ["+", "a", "b"])], [0, set("b", ["-", "a", "b"])], [0, set("a", ["-", "a", "b"])], [0, pr("a", "b")]], ask: out }));
add("k10", "k", 2, "divmod", () => ({ lines: [[0, set("a", R(4, 10))], [0, set("b", R(4, 10))], [0, set("c", R(4, 10))], [0, set("s", ["+", ["+", "a", "b"], "c"])], [0, set("v", ["//", "s", 3])], [0, set("liek", ["%", "s", 3])], [0, pr("v", "liek")]], ask: out }));
add("k11", "k", 3, "divmod", () => { const m = R(0, 1), n = R(1, 9) * 100 + R(0, 9) * 10 + R(1, 9); return { lines: [[0, set("n", n)], [0, set("s", ["//", "n", 100])], [0, set("d", ["%", ["//", "n", 10], 10])], [0, set("v", ["%", "n", 10])], [0, pr(m ? ["+", ["+", "s", "d"], "v"] : ["+", ["+", ["*", "v", 100], ["*", "d", 10]], "s"])]], ask: out }; });
add("k12", "k", 1, "seq", () => { const k = R(2, 6), n = R(2, 5); return { lines: [[0, set("kaina", k)], [0, set("kiekis", n)], [0, set("pinigai", k * n + R(3, 20))], [0, set("suma", ["*", "kaina", "kiekis"])], [0, set("graza", ["-", "pinigai", "suma"])]], ask: val("graza") }; });
add("k13", "k", 2, "seq", () => ({ lines: [[0, set("x", R(4, 9))], [0, set("y", ["*", "x", 2])], [0, set("x", ["-", "y", R(1, 3)])], [0, set("y", ["+", "x", "y"])], [0, pr("y")]], ask: out }));
add("k14", "k", 2, "divmod", () => { const m = R(0, 2); let n = R(23, 98); if(n % 10 === 0) n += 7; return { lines: [[0, set("n", n)], [0, set("r", m === 0 ? ["-", "n", ["%", "n", 10]] : m === 1 ? ["*", ["//", "n", 10], 10] : ["+", ["%", "n", 2], ["%", "n", 5]])], [0, pr("r")]], ask: out }; });
add("k15", "k", 3, "swapbad", () => ({ lines: [[0, set("a", R(1, 9))], [0, set("b", R(10, 19))], [0, set("c", R(20, 29))], [0, set("a", "b")], [0, set("b", "c")], [0, set("c", "a")], [0, pr("a", "b", "c")]], ask: out }));
add("k16", "k", 1, "prec", () => ({ lines: [[0, set("a", R(2, 6))], [0, set("b", R(2, 6))], [0, set("c", R(7, 9))], [0, set("x", ["-", ["*", ["+", "a", "b"], "c"], ["*", "a", "b"]])]], ask: val("x") }));
add("k17", "k", 3, "seq", () => ({ lines: [[0, set("x", R(3, 9))], [0, set("y", R(2, 6))], [0, set("x", ["+", "x", "y"])], [0, set("y", ["*", "x", 2])], [0, set("x", ["-", "y", "x"])], [0, set("y", ["%", "y", "x"])], [0, pr("x", "y")]], ask: out }));
add("k18", "k", 2, "prec", () => ({ lines: [[0, set("ilgis", R(5, 9))], [0, set("plotis", R(2, 4))], [0, set("p", ["*", 2, ["+", "ilgis", "plotis"]])], [0, set("s", ["*", "ilgis", "plotis"])], [0, pr(["-", "s", "p"])]], ask: out }));
add("k19", "k", 3, "divmod", () => ({ lines: [[0, set("sek", R(3700, 7100))], [0, set("val", ["//", "sek", 3600])], [0, set("sek", ["%", "sek", 3600])], [0, set("mnt", ["//", "sek", 60])], [0, set("sek", ["%", "sek", 60])], [0, pr("val", "mnt", "sek")]], ask: out }));

/* ----- p: pasirinkimo komanda ----- */
const two = () => { const a = R(3, 30); let b = R(3, 30); if(a === b) b++; return [a, b]; };
add("p1", "p", 1, "ifelse", () => { const [a, b] = two(), op = pk([">", "<"]); return { lines: [[0, set("a", a)], [0, set("b", b)], [0, If([op, "a", "b"])], [1, set("m", "a")], [0, Else()], [1, set("m", "b")], [0, pr("m")]], ask: out }; });
add("p2", "p", 1, "ifelse", () => ({ lines: [[0, set("x", R(5, 20))], [0, If(["==", ["%", "x", 2], 0])], [1, set("x", ["//", "x", 2])], [0, Else()], [1, set("x", ["+", ["*", 3, "x"], 1])], [0, pr("x")]], ask: out }));
add("p3", "p", 2, "elif", () => { const p = R(3, 6), q = p + R(2, 5); return { lines: [[0, set("amzius", pk([R(3, 6), 7, R(8, 17), 18, R(19, 60)]))], [0, If(["<", "amzius", 7])], [1, set("kaina", 0)], [0, Elif(["<", "amzius", 18])], [1, set("kaina", p)], [0, Else()], [1, set("kaina", q)], [0, pr("kaina")]], ask: out }; });
add("p4", "p", 2, "twoif", () => { const lim = R(4, 8), sub = R(2, 4); return { lines: [[0, set("x", R(lim - 2, lim + sub + 6))], [0, If([">", "x", lim])], [1, set("x", ["-", "x", sub])], [0, If([">", "x", lim])], [1, set("x", ["*", "x", 2])], [0, pr("x")]], ask: out }; });
add("p5", "p", 3, "nested", () => { const v = [R(2, 30), R(2, 30), R(2, 30)]; if(v[0] === v[1]) v[1]++; if(v[1] === v[2]) v[2] += 2; if(v[0] === v[2]) v[0] += 3;
  return { lines: [[0, set("a", v[0])], [0, set("b", v[1])], [0, set("c", v[2])], [0, If([">", "a", "b"])], [1, If([">", "a", "c"])], [2, set("m", "a")], [1, Else()], [2, set("m", "c")], [0, Else()], [1, If([">", "b", "c"])], [2, set("m", "b")], [1, Else()], [2, set("m", "c")], [0, pr("m")]], ask: out }; });
add("p6", "p", 2, "and", () => ({ lines: [[0, set("t", pk([R(5, 14), 15, R(16, 24), 25, R(26, 33)]))], [0, If(["and", [">=", "t", 15], ["<=", "t", 25]])], [1, pr(S("Malonu"))], [0, Else()], [1, pr(S("Nemalonu"))]], ask: out, opts: ["Malonu", "Nemalonu", "@both", "@none"] }));
add("p7", "p", 2, "or", () => ({ lines: [[0, set("diena", R(1, 7))], [0, If(["or", ["==", "diena", 6], ["==", "diena", 7]])], [1, pr(S("Savaitgalis"))], [0, Else()], [1, pr(S("Darbo diena"))]], ask: out, opts: ["Savaitgalis", "Darbo diena", "@both", "@none"] }));
add("p8", "p", 2, "ifonly", () => ({ lines: [[0, set("x", pk([-R(2, 15), R(2, 15)]))], [0, If(["<", "x", 0])], [1, set("x", ["-", 0, "x"])], [0, set("x", ["+", "x", R(1, 5)])], [0, pr("x")]], ask: out }));
add("p9", "p", 2, "ifonly", () => { const [a, b] = two(); return { lines: [[0, set("a", a)], [0, set("b", b)], [0, If([">", "a", "b"])], [1, set("t", "a")], [1, set("a", "b")], [1, set("b", "t")], [0, pr("a", "b")]], ask: out }; });
add("p10", "p", 3, "elif", () => ({ lines: [[0, set("x", pk([R(21, 40), R(11, 20), R(1, 10)]))], [0, If([">", "x", 10])], [1, set("k", 1)], [0, Elif([">", "x", 20])], [1, set("k", 2)], [0, Else()], [1, set("k", 3)], [0, pr("k")]], ask: out }));
add("p11", "p", 2, "twoif", () => { const v = [R(2, 20), R(2, 20), R(2, 20)]; return { lines: [[0, set("a", v[0])], [0, set("b", v[1])], [0, set("c", v[2])], [0, set("k", 0)], [0, If([">", "a", "b"])], [1, aug("k", "+", 1)], [0, If([">", "b", "c"])], [1, aug("k", "+", 1)], [0, If([">", "a", "c"])], [1, aug("k", "+", 1)], [0, pr("k")]], ask: out }; });
add("p12", "p", 1, "ifelse", () => { const [a, b] = two(); return { lines: [[0, set("a", a)], [0, set("b", b)], [0, If([">", "a", "b"])], [1, set("d", ["-", "a", "b"])], [0, Else()], [1, set("d", ["-", "b", "a"])], [0, pr("d")]], ask: out }; });
add("p13", "p", 3, "elif", () => ({ lines: [[0, set("n", pk([15, 30, 45, 9, 12, 18, 10, 20, 25, 7, 14, 22]))], [0, If(["and", ["==", ["%", "n", 3], 0], ["==", ["%", "n", 5], 0]])], [1, pr(S("abu"))], [0, Elif(["==", ["%", "n", 3], 0])], [1, pr(S("trys"))], [0, Elif(["==", ["%", "n", 5], 0])], [1, pr(S("penki"))], [0, Else()], [1, pr(S("joks"))]], ask: out, opts: ["abu", "trys", "penki", "joks"] }));
add("p14", "p", 3, "not", () => { const [a, b] = two(); return { lines: [[0, set("a", a)], [0, set("b", b)], [0, If(["not", [">", "a", "b"]])], [1, set("a", ["+", "a", "b"])], [0, pr("a")]], ask: out }; });
add("p15", "p", 2, "ifelse", () => { const [a, b] = two(); return { lines: [[0, set("a", a)], [0, set("b", b)], [0, If([">", "a", "b"])], [1, set("a", ["-", "a", "b"])], [0, Else()], [1, set("b", ["-", "b", "a"])], [0, pr("a", "b")]], ask: out }; });
add("p16", "p", 3, "elif", () => ({ lines: [[0, set("metai", pk([2000, 2400, 1900, 2100, 2024, 2028, 2032, 2023, 2026, 2030]))], [0, If(["==", ["%", "metai", 400], 0])], [1, set("d", 366)], [0, Elif(["==", ["%", "metai", 100], 0])], [1, set("d", 365)], [0, Elif(["==", ["%", "metai", 4], 0])], [1, set("d", 366)], [0, Else()], [1, set("d", 365)], [0, pr("d")]], ask: out, opts: [365, 366, 28, 29] }));
add("p17", "p", 1, "ifonly", () => { const k = R(5, 15); return { lines: [[0, set("pinigai", pk([k - R(1, 4), k, k + R(1, 9)]))], [0, set("kaina", k)], [0, If([">=", "pinigai", "kaina"])], [1, set("pinigai", ["-", "pinigai", "kaina"])], [0, pr("pinigai")]], ask: out }; });
add("p18", "p", 3, "nested", () => ({ lines: [[0, set("x", R(1, 30))], [0, set("k", 0)], [0, If([">", "x", 10])], [1, aug("k", "+", 1)], [1, If([">", "x", 20])], [2, aug("k", "+", 2)], [0, Else()], [1, If(["==", ["%", "x", 2], 0])], [2, aug("k", "+", 5)], [0, pr("k")]], ask: out }));
add("p19", "p", 1, "ifelse", () => { const lim = R(40, 60); return { lines: [[0, set("suma", pk([lim - R(5, 20), lim, lim + R(5, 30)]))], [0, If([">=", "suma", lim])], [1, set("nuolaida", 10)], [0, Else()], [1, set("nuolaida", 0)], [0, set("suma", ["-", "suma", "nuolaida"])], [0, pr("suma")]], ask: out }; });

/* ----- c: kartojimo komanda ----- */
add("c1", "c", 1, "acc", () => ({ lines: [[0, set("s", 0)], [0, For("i", 1, R(3, 6))], [1, aug("s", "+", "i")], [0, pr("s")]], ask: out }));
add("c2", "c", 1, "range", () => { const a = R(1, 4); return { lines: [[0, For("i", a, a + R(2, 4))], [1, prs(["*", "i", R(2, 5)])]], ask: out }; });
add("c3", "c", 1, "step", () => { const a = pk([2, 4, 1, 3]); return { lines: [[0, set("s", 0)], [0, For("i", a, a + pk([6, 7, 8, 9]), 2)], [1, aug("s", "+", "i")], [0, pr("s")]], ask: out }; });
add("c4", "c", 1, "step", () => { const st = pk([-1, -1, -2, -3]), a = R(6, 10); return { lines: [[0, For("i", a, R(1, 3), st)], [1, prs("i")]], ask: out }; });
add("c5", "c", 2, "acc", () => ({ lines: [[0, set("sand", 1)], [0, For("i", pk([1, 2]), R(3, 5))], [1, set("sand", ["*", "sand", "i"])], [0, pr("sand")]], ask: out }));
add("c6", "c", 2, "forif", () => { const a = R(1, 6), k = pk([2, 3, 4]), rem = R(0, 1) && k > 2 ? 1 : 0; return { lines: [[0, set("kiek", 0)], [0, For("i", a, a + R(6, 10))], [1, If(["==", ["%", "i", k], rem])], [2, aug("kiek", "+", 1)], [0, pr("kiek")]], ask: out }; });
add("c7", "c", 2, "while", () => ({ lines: [[0, set("x", pk([1, 1, 3, 5]))], [0, Wh(["<", "x", R(20, 70)])], [1, set("x", ["*", "x", 2])], [0, pr("x")]], ask: out }));
add("c8", "c", 2, "while", () => ({ lines: [[0, set("n", R(9, 70))], [0, set("k", 0)], [0, Wh([">", "n", 1])], [1, set("n", ["//", "n", 2])], [1, aug("k", "+", 1)], [0, pr("k")]], ask: out }));
add("c9", "c", 3, "digits", () => ({ lines: [[0, set("n", R(102, 987))], [0, set("s", 0)], [0, Wh([">", "n", 0])], [1, aug("s", "+", ["%", "n", 10])], [1, set("n", ["//", "n", 10])], [0, pr("s")]], ask: out }));
add("c10", "c", 2, "acc", () => ({ lines: [[0, set("p", 1)], [0, For("i", 1, R(3, 5))], [1, set("p", ["*", "p", pk([2, 3])])], [0, pr("p")]], ask: out }));
add("c11", "c", 3, "forif", () => ({ lines: [[0, set("s", 0)], [0, For("i", 1, R(5, 8))], [1, If(["==", ["%", "i", 2], 0])], [2, aug("s", "+", "i")], [1, Else()], [2, aug("s", "-", "i")], [0, pr("s")]], ask: out }));
add("c12", "c", 3, "fib", () => ({ lines: [[0, set("a", pk([0, 1, 2]))], [0, set("b", 1)], [0, For("i", 1, R(4, 6))], [1, set("c", ["+", "a", "b"])], [1, set("a", "b")], [1, set("b", "c")], [0, pr("a")]], ask: out }));
add("c13", "c", 3, "nestloop", () => { const tri = R(0, 1); return { lines: [[0, set("k", 0)], [0, For("i", 1, R(3, 4))], [1, For("j", 1, tri ? "i" : R(2, 4))], [2, aug("k", "+", 1)], [0, pr("k")]], ask: out }; });
add("c14", "c", 3, "euclid", () => { const g = pk([2, 3, 4, 5, 6, 7]), a = g * R(3, 9); let b = g * R(2, 8); if(a === b) b += g; return { lines: [[0, set("a", a)], [0, set("b", b)], [0, Wh(["!=", "b", 0])], [1, set("t", ["%", "a", "b"])], [1, set("a", "b")], [1, set("b", "t")], [0, pr("a")]], ask: out }; });
add("c15", "c", 2, "while", () => ({ lines: [[0, set("x", R(1, 6))], [0, Wh(["<", "x", R(18, 40)])], [1, aug("x", "+", R(3, 7))]], ask: cnt(2) }));
add("c16", "c", 2, "while", () => { const k = pk([5, 10, 15, 20]); return { lines: [[0, set("suma", pk([0, 10, 20, 25]))], [0, set("men", 0)], [0, Wh(["<", "suma", k * R(3, 6) + pk([0, 5])])], [1, aug("suma", "+", k)], [1, aug("men", "+", 1)], [0, pr("men")]], ask: out }; });
add("c17", "c", 2, "acc", () => ({ lines: [[0, set("s", 0)], [0, For("i", 1, R(3, 5))], [1, aug("s", "+", ["*", "i", "i"])], [0, pr("s")]], ask: out }));
add("c18", "c", 3, "while", () => ({ lines: [[0, set("n", pk([35, 49, 55, 77, 91, 25, 39, 51, 65, 85, 21, 33]))], [0, set("d", 2)], [0, Wh(["!=", ["%", "n", "d"], 0])], [1, aug("d", "+", 1)], [0, pr("d")]], ask: out }));
add("c19", "c", 1, "last", () => ({ lines: [[0, set("s", 0)], [0, For("i", 1, R(3, 6))], [1, set("s", ["*", "i", R(2, 4)])], [0, pr("s")]], ask: out }));
add("c20", "c", 3, "forif", () => ({ lines: [[0, set("n", pk([6, 8, 9, 10, 12, 7]))], [0, set("k", 0)], [0, For("i", 1, "n")], [1, If(["==", ["%", "n", "i"], 0])], [2, aug("k", "+", 1)], [0, pr("k")]], ask: out }));
add("c21", "c", 2, "while", () => ({ lines: [[0, set("x", pk([1, 2, 3]))], [0, Wh(["<=", "x", R(20, 50)])], [1, prs("x")], [1, set("x", ["*", "x", pk([2, 3])])]], ask: out }));
add("c22", "c", 3, "digits", () => { let n = R(123, 987); if(n % 10 === 0) n += 4; return { lines: [[0, set("n", n)], [0, set("r", 0)], [0, Wh([">", "n", 0])], [1, set("r", ["+", ["*", "r", 10], ["%", "n", 10]])], [1, set("n", ["//", "n", 10])], [0, pr("r")]], ask: out }; });
add("c23", "c", 2, "acc", () => ({ lines: [[0, set("s", R(1, 4))], [0, For("i", 1, R(3, 4))], [1, set("s", ["-", ["*", "s", 2], 1])], [0, pr("s")]], ask: out }));
add("c24", "c", 3, "nestloop", () => ({ lines: [[0, For("i", 1, 3)], [1, For("j", 1, "i")], [2, prs(pk(["j", "i", ["*", "i", "j"]]))]], ask: out }));
add("c25", "c", 2, "while", () => { const d = R(3, 7); return { lines: [[0, set("n", d * R(3, 6) + R(1, d - 1))], [0, set("k", 0)], [0, Wh([">=", "n", d])], [1, set("n", ["-", "n", d])], [1, aug("k", "+", 1)], [0, pr("k", "n")]], ask: out }; });
add("c26", "c", 1, "range", () => ({ lines: [[0, set("k", 0)], [0, For("i", R(2, 5), R(8, 12))], [1, aug("k", "+", 1)], [0, pr("k")]], ask: out }));
add("c27", "c", 3, "forif", () => { const v = R(4, 9); return { lines: [[0, set("did", 0)], [0, For("i", 1, R(4, 6))], [1, set("x", ["%", ["*", "i", v], 7])], [1, If([">", "x", "did"])], [2, set("did", "x")], [0, pr("did")]], ask: out }; });

/* ----- f: paprogramės ir parametrai ----- */
add("f1", "f", 1, "fn", () => ({ lines: [[0, def("kv", ["x"])], [1, ret(["*", "x", "x"])], [0, pr(["+", call("kv", R(2, 5)), call("kv", R(2, 5))])]], ask: out }));
add("f2", "f", 2, "fnret", () => ({ lines: [[0, def("didz", ["a", "b"])], [1, If([">", "a", "b"])], [2, ret("a")], [1, ret("b")], [0, pr(call("didz", call("didz", R(2, 30), R(2, 30)), R(2, 30)))]], ask: out }));
add("f3", "f", 1, "fn", () => ({ lines: [[0, def("f", ["x"])], [1, ret(["+", ["*", 2, "x"], R(1, 3)])], [0, set("y", call("f", call("f", R(1, 5))))], [0, pr("y")]], ask: out }));
add("f4", "f", 2, "byval", () => ({ lines: [[0, def("didink", ["a"])], [1, set("a", ["+", "a", R(1, 5)])], [1, ret("a")], [0, set("a", R(3, 9))], [0, set("b", call("didink", "a"))], [0, pr("a", "b")]], ask: out }));
add("f5", "f", 2, "proc", () => ({ lines: [[0, def("eile", ["n"])], [1, For("i", 1, "n")], [2, prs("i")], [0, doo(call("eile", R(2, 3)))], [0, doo(call("eile", R(1, 3)))]], ask: out }));
add("f6", "f", 2, "fn", () => { const a = R(4, 6); return { lines: [[0, def("suma", ["n"])], [1, set("s", 0)], [1, For("i", 1, "n")], [2, aug("s", "+", "i")], [1, ret("s")], [0, pr(["-", call("suma", a), call("suma", a - R(1, 2))])]], ask: out }; });
add("f7", "f", 2, "fnret", () => ({ lines: [[0, def("lyginis", ["n"])], [1, If(["==", ["%", "n", 2], 0])], [2, ret(1)], [1, ret(0)], [0, set("k", ["+", ["+", call("lyginis", R(2, 30)), call("lyginis", R(2, 30))], call("lyginis", R(2, 30))])], [0, pr("k")]], ask: out }));
add("f8", "f", 1, "order", () => { const [a, b] = two(); return { lines: [[0, def("skirt", ["a", "b"])], [1, ret(["-", "a", "b"])], [0, set("a", Math.min(a, b))], [0, set("b", Math.max(a, b))], [0, pr(call("skirt", "b", "a"))]], ask: out }; });
add("f9", "f", 3, "fn", () => ({ lines: [[0, def("sand", ["a", "b"])], [1, ret(["*", "a", "b"])], [0, def("g", ["x"])], [1, ret(call("sand", "x", ["+", "x", 1]))], [0, pr(call("g", R(2, 7)))]], ask: out }));
add("f10", "f", 3, "fnret", () => ({ lines: [[0, def("f", ["x"])], [1, If(["==", ["%", "x", 2], 0])], [2, ret(["//", "x", 2])], [1, ret(["*", "x", 3])], [0, set("s", 0)], [0, For("i", 1, R(3, 5))], [1, aug("s", "+", call("f", "i"))], [0, pr("s")]], ask: out }));
add("f11", "f", 3, "fn", () => ({ lines: [[0, def("skaitm", ["n"])], [1, set("s", 0)], [1, Wh([">", "n", 0])], [2, aug("s", "+", ["%", "n", 10])], [2, set("n", ["//", "n", 10])], [1, ret("s")], [0, pr(["+", call("skaitm", R(12, 99)), call("skaitm", R(101, 250))])]], ask: out }));
add("f12", "f", 1, "order", () => ({ lines: [[0, def("f", ["a", "b"])], [1, ret(["-", ["*", "a", 10], "b"])], [0, set("x", R(2, 5))], [0, set("y", R(2, 5))], [0, pr(call("f", ["+", "x", 1], ["*", "y", 2]))]], ask: out }));
add("f13", "f", 2, "params", () => { const n = pk(["plotas", "perim"]); return { lines: [[0, def(n, ["a", "b"])], [1, ret(n === "plotas" ? ["*", "a", "b"] : ["*", 2, ["+", "a", "b"]])], [0, set("ilgis", R(4, 9))], [0, set("p", call(n, "ilgis", R(2, 5)))], [0, pr("p")]], ask: { k: pk(["formal", "actual"]), fn: n } }; });
add("f14", "f", 3, "fnret", () => ({ lines: [[0, def("pirminis", ["n"])], [1, For("d", 2, ["-", "n", 1])], [2, If(["==", ["%", "n", "d"], 0])], [3, ret(0)], [1, ret(1)], [0, pr(["+", call("pirminis", pk([7, 9, 5, 15])), call("pirminis", pk([11, 4, 3, 8]))])]], ask: out }));
add("f15", "f", 2, "proc", () => ({ lines: [[0, def("rodyk", ["a", "k"])], [1, For("i", 1, "k")], [2, prs("a")], [0, set("a", R(2, 4))], [0, doo(call("rodyk", ["+", "a", 1], 2))], [0, doo(call("rodyk", "a", R(1, 2)))]], ask: out }));
add("f16", "f", 3, "byval", () => ({ lines: [[0, def("keisk", ["x", "y"])], [1, set("t", "x")], [1, set("x", "y")], [1, set("y", "t")], [1, ret(["-", "x", "y"])], [0, set("x", R(2, 9))], [0, set("y", R(11, 20))], [0, set("r", call("keisk", "x", "y"))], [0, pr("x", "y", "r")]], ask: out }));
add("f17", "f", 1, "fn", () => ({ lines: [[0, def("vid", ["a", "b"])], [1, ret(["//", ["+", "a", "b"], 2])], [0, set("x", call("vid", R(2, 10), R(11, 20)))], [0, pr(call("vid", "x", R(2, 9)))]], ask: out }));

/* ================= „Sudėk programą“ ir „Rask klaidą“ ================= */
/* par(k) – k-asis duomenų rinkinys (0 – rodomas; kiti – papildomam tikrinimui); mk(p) → { goal, lock, sol, dis, bugs:[[eil., sakinys, raktas]] } */
const PAR = [];
const addP = (id, t, par, mk) => PAR.push({ id, t, par, mk });
addP("d1", 1, () => ({ n: R(4, 9) }), p => ({ goal: ["sum", p.n], lock: 0, sol: [[0, set("s", 0)], [0, For("i", 1, p.n)], [1, aug("s", "+", "i")], [0, pr("s")]], dis: [[1, set("s", "i")]],
  bugs: [[0, set("s", 1), "init"], [1, For("i", 1, p.n - 1), "bound"], [2, set("s", "i"), "accum"]] }));
addP("d2", 1, k => { const a = R(3, 40), d = R(1, 20); return k % 2 ? { a, b: a + d } : { a: a + d, b: a }; }, p => ({ goal: ["max2"], lock: 2, sol: [[0, set("a", p.a)], [0, set("b", p.b)], [0, If([">", "a", "b"])], [1, pr("a")], [0, Else()], [1, pr("b")]], dis: [[1, pr(["+", "a", "b"])]],
  bugs: [[2, If(["<", "a", "b"]), "cond"], [5, pr("a"), "branch"]] }));
addP("d3", 2, () => { const a = R(1, 6); return { a, b: a + R(5, 9) }; }, p => ({ goal: ["evens", p.a, p.b], lock: 0, sol: [[0, set("kiek", 0)], [0, For("i", p.a, p.b)], [1, If(["==", ["%", "i", 2], 0])], [2, aug("kiek", "+", 1)], [0, pr("kiek")]], dis: [[2, aug("kiek", "+", "i")]],
  bugs: [[2, If(["==", ["%", "i", 2], 1]), "cond"], [3, aug("kiek", "+", "i"), "accum"], [0, set("kiek", 1), "init"]] }));
addP("d4", 1, () => { const a = R(2, 30); return { a, b: a + R(1, 30) }; }, p => ({ goal: ["swap"], lock: 2, sol: [[0, set("a", p.a)], [0, set("b", p.b)], [0, set("t", "a")], [0, set("a", "b")], [0, set("b", "t")], [0, pr("a", "b")]], dis: [[0, set("b", "a")]],
  bugs: [[4, set("b", "a"), "swap"], [2, set("t", "b"), "swap"]] }));
addP("d5", 2, () => ({ n: R(3, 6) }), p => ({ goal: ["fact", p.n], lock: 0, sol: [[0, set("sand", 1)], [0, For("i", 1, p.n)], [1, set("sand", ["*", "sand", "i"])], [0, pr("sand")]], dis: [[1, set("sand", ["+", "sand", "i"])]],
  bugs: [[0, set("sand", 0), "init0"], [2, set("sand", ["+", "sand", "i"]), "accum"], [1, For("i", 0, p.n), "bound0"]] }));
addP("d6", 3, () => ({ n: R(123, 987) }), p => ({ goal: ["digsum"], lock: 1, sol: [[0, set("n", p.n)], [0, set("s", 0)], [0, Wh([">", "n", 0])], [1, aug("s", "+", ["%", "n", 10])], [1, set("n", ["//", "n", 10])], [0, pr("s")]], dis: [[1, aug("s", "+", ["//", "n", 10])]],
  bugs: [[3, aug("s", "+", ["//", "n", 10]), "divmod"], [2, Wh([">", "n", 9]), "cond"], [5, pr("n"), "wrongvar"]] }));
addP("d7", 1, () => ({ n: R(4, 9) }), p => ({ goal: ["down", p.n], lock: 0, sol: [[0, set("x", p.n)], [0, Wh([">=", "x", 1])], [1, prs("x")], [1, set("x", ["-", "x", 1])]], dis: [[1, set("x", ["+", "x", 1])]],
  bugs: [[1, Wh([">", "x", 1]), "cond"], [3, set("x", ["-", "x", 2]), "stepbug"]] }));
addP("d9", 2, () => ({ n: pk([20, 40, 50, 70, 100, 150, 200]) }), p => ({ goal: ["dbl", p.n], lock: 0, sol: [[0, set("x", 1)], [0, set("k", 0)], [0, Wh(["<", "x", p.n])], [1, set("x", ["*", "x", 2])], [1, aug("k", "+", 1)], [0, pr("k")]], dis: [[1, aug("k", "+", "x")]],
  bugs: [[1, set("k", 1), "init"], [3, set("x", ["+", "x", 2]), "accum"], [5, pr("x"), "wrongvar"]] }));
addP("d10", 2, () => ({ a: R(3, 9), b: R(3, 9) }), p => ({ goal: ["sqsum", p.a, p.b], lock: 0, sol: [[0, def("kv", ["x"])], [1, ret(["*", "x", "x"])], [0, set("s", ["+", call("kv", p.a), call("kv", p.b)])], [0, pr("s")]], dis: [[1, ret(["+", "x", "x"])]],
  bugs: [[1, ret(["*", "x", 2]), "fnbody"], [2, set("s", ["+", call("kv", p.a), p.b]), "nocall"]] }));
addP("d11", 1, k => { const a = R(3, 40), d = R(1, 20); return k % 2 ? { a, b: a + d } : { a: a + d, b: a }; }, p => ({ goal: ["absd"], lock: 2, sol: [[0, set("a", p.a)], [0, set("b", p.b)], [0, If([">", "a", "b"])], [1, set("d", ["-", "a", "b"])], [0, Else()], [1, set("d", ["-", "b", "a"])], [0, pr("d")]], dis: [[1, set("d", ["+", "a", "b"])]],
  bugs: [[2, If(["<", "a", "b"]), "cond"], [5, set("d", ["-", "a", "b"]), "branch"]] }));
addP("d12", 2, () => ({ a: pk([2, 3, 5]), k: R(2, 5) }), p => ({ goal: ["pow", p.a, p.k], lock: 0, sol: [[0, set("p", 1)], [0, For("i", 1, p.k)], [1, set("p", ["*", "p", p.a])], [0, pr("p")]], dis: [[1, set("p", ["+", "p", p.a])]],
  bugs: [[0, set("p", 0), "init0"], [2, set("p", ["*", p.a, "i"]), "accum"], [1, For("i", 0, p.k), "bound"]] }));
addP("d13", 2, () => ({ n: R(10, 20), k: pk([3, 4, 5]) }), p => ({ goal: ["mult", p.n, p.k], lock: 0, sol: [[0, For("i", 1, p.n)], [1, If(["==", ["%", "i", p.k], 0])], [2, prs("i")]], dis: [[1, If(["==", ["//", "i", p.k], 0])]],
  bugs: [[1, If(["==", ["%", "i", p.k], 1]), "cond"], [1, If(["==", ["//", "i", p.k], 0]), "divmod"], [0, For("i", 1, p.n - p.n % p.k - 1), "bound"]] }));
addP("d14", 3, () => { const g = pk([2, 3, 4, 5, 6]), a = g * R(4, 9); let b = g * R(2, 7); if(a === b) b += g; return { a, b }; }, p => ({ goal: ["gcd"], lock: 2, sol: [[0, set("a", p.a)], [0, set("b", p.b)], [0, Wh(["!=", "b", 0])], [1, set("t", ["%", "a", "b"])], [1, set("a", "b")], [1, set("b", "t")], [0, pr("a")]], dis: [[1, set("a", "t")]],
  bugs: [[6, pr("b"), "wrongvar"], [3, set("t", ["//", "a", "b"]), "divmod"]] }));
addP("d15", 1, () => ({ n: pk([7, 9, 11, 13, 8, 10]) }), p => ({ goal: ["odds", p.n], lock: 0, sol: [[0, set("s", 0)], [0, For("i", 1, p.n, 2)], [1, aug("s", "+", "i")], [0, pr("s")]], dis: [[0, For("i", 2, p.n, 2)]],
  bugs: [[1, For("i", 0, p.n, 2), "bound"], [1, For("i", 1, p.n), "stepbug"], [2, aug("s", "+", 1), "accum"]] }));
addP("d16", 2, k => ({ am: [R(3, 6), R(8, 17), R(19, 60), 7, 18][k % 5] }), p => ({ goal: ["ticket"], lock: 1, sol: [[0, set("amzius", p.am)], [0, If(["<", "amzius", 7])], [1, set("kaina", 0)], [0, Elif(["<", "amzius", 18])], [1, set("kaina", 5)], [0, Else()], [1, set("kaina", 10)], [0, pr("kaina")]], dis: [],
  bugs: [[3, Elif([">", "amzius", 18]), "cond"], [1, If(["<", "amzius", 18]), "elif"], [6, set("kaina", 5), "branch"]] }));
addP("d17", 2, k => { const v = [R(2, 15), R(16, 30), R(31, 45)]; const o = [[0, 1, 2], [1, 2, 0], [2, 0, 1], [1, 0, 2], [0, 2, 1]][k % 5]; return { a: v[o[0]], b: v[o[1]], c: v[o[2]] }; }, p => ({ goal: ["min3"], lock: 3, sol: [[0, set("a", p.a)], [0, set("b", p.b)], [0, set("c", p.c)], [0, set("m", "a")], [0, If(["<", "b", "m"])], [1, set("m", "b")], [0, If(["<", "c", "m"])], [1, set("m", "c")], [0, pr("m")]], dis: [[1, set("m", "a")]],
  bugs: [[4, If([">", "b", "m"]), "cond"], [7, set("m", "b"), "wrongvar"], [6, If(["<", "c", "b"]), "cond"]] }));
addP("d18", 3, () => ({ n: pk([6, 8, 9, 10, 12, 14, 15, 16]) }), p => ({ goal: ["divs"], lock: 1, sol: [[0, set("n", p.n)], [0, set("k", 0)], [0, For("i", 1, "n")], [1, If(["==", ["%", "n", "i"], 0])], [2, aug("k", "+", 1)], [0, pr("k")]], dis: [[2, aug("k", "+", "i")]],
  bugs: [[3, If(["==", ["%", "i", "n"], 0]), "cond"], [2, For("i", 1, ["-", "n", 1]), "bound"], [4, aug("k", "+", "i"), "accum"]] }));
addP("d19", 2, () => { const k = pk([5, 10, 15, 20]); return { s: pk([0, 10, 20]), k, t: k * R(4, 7) + pk([0, 5, 20]) }; }, p => ({ goal: ["save", p.t, p.k], lock: 1, sol: [[0, set("suma", p.s)], [0, set("men", 0)], [0, Wh(["<", "suma", p.t])], [1, aug("suma", "+", p.k)], [1, aug("men", "+", 1)], [0, pr("men")]], dis: [[1, aug("men", "+", p.k)]],
  bugs: [[5, pr("suma"), "wrongvar"], [4, aug("men", "+", p.k), "accum"], [1, set("men", 1), "init"]] }));
addP("d20", 3, () => ({ n: R(4, 8) }), p => ({ goal: ["fib", p.n], lock: 2, sol: [[0, set("a", 0)], [0, set("b", 1)], [0, For("i", 1, p.n)], [1, set("c", ["+", "a", "b"])], [1, set("a", "b")], [1, set("b", "c")], [0, pr("a")]], dis: [[1, set("b", "a")]],
  bugs: [[5, set("b", "a"), "swap"], [3, set("c", ["+", "a", "i"]), "wrongvar"]] }));
addP("d21", 2, () => ({ a: R(2, 5), b: R(12, 20) }), p => ({ goal: ["sumrange", p.a, p.b], lock: 0, sol: [[0, def("suma", ["a", "b"])], [1, set("s", 0)], [1, For("i", "a", "b")], [2, aug("s", "+", "i")], [1, ret("s")], [0, pr(call("suma", p.a, p.b))]], dis: [[2, ret("s")]],
  bugs: [[4, ret("b"), "fnbody"], [1, set("s", "a"), "init"], [5, pr(call("suma", p.b, p.a)), "argorder"]] }));
addP("d22", 3, () => { let n = R(123, 987); if(n % 10 === 0) n += 3; return { n }; }, p => ({ goal: ["rev"], lock: 1, sol: [[0, set("n", p.n)], [0, set("r", 0)], [0, Wh([">", "n", 0])], [1, set("r", ["+", ["*", "r", 10], ["%", "n", 10]])], [1, set("n", ["//", "n", 10])], [0, pr("r")]], dis: [[1, set("r", ["+", "r", ["%", "n", 10]])]],
  bugs: [[3, set("r", ["+", "r", ["%", "n", 10]]), "accum"], [3, set("r", ["+", ["*", "r", 10], ["//", "n", 10]]), "divmod"]] }));
addP("d23", 1, k => ({ s: [R(55, 90), R(20, 45), 50][k % 3] }), p => ({ goal: ["disc"], lock: 1, sol: [[0, set("suma", p.s)], [0, If([">=", "suma", 50])], [1, set("suma", ["-", "suma", 10])], [0, pr("suma")]], dis: [[0, If([">=", "suma", 10])]],
  bugs: [[1, If([">", "suma", 50]), "cond"], [2, set("suma", ["-", 10, "suma"]), "argorder"]] }));
addP("d24", 3, () => ({ n: R(3, 5) }), p => ({ goal: ["tri", p.n], lock: 0, sol: [[0, set("k", 0)], [0, For("i", 1, p.n)], [1, For("j", 1, "i")], [2, aug("k", "+", 1)], [0, pr("k")]], dis: [[1, aug("k", "+", 1)]],
  bugs: [[2, For("j", 1, p.n), "bound"], [3, aug("k", "+", "j"), "accum"]] }));

/* Sintaksės klaidos (priklauso nuo kalbos): keičiamas tik rodomos eilutės tekstas. */
const SYN = {
  py: [
    { k: "colon", ok: s => OPEN[s[0]], f: t => t.replace(/:$/, "") },
    { k: "eqeq", ok: s => (s[0] === "if" || s[0] === "while" || s[0] === "elif") && /==/.test(lineTxt(s, "py")), f: t => t.replace(" == ", " = ") },
    { k: "paren", ok: s => s[0] === "print", f: t => t.replace(/\)$/, "") }
  ],
  cpp: [
    { k: "semi", ok: s => s[0] === "set" || s[0] === "aug" || s[0] === "print" || s[0] === "ret", f: t => t.replace(/;$/, "") },
    { k: "parenc", ok: s => s[0] === "if" || s[0] === "while", f: t => t.replace(") {", " {") },
    { k: "cout", ok: s => s[0] === "print" || s[0] === "prints", f: t => t.replace("cout <<", "cout >>") },
    { k: "brace", ok: s => s[0] === "for" || s[0] === "while" || s[0] === "if", f: t => t.replace(/ \{$/, "") }
  ]
};

/* ================= generavimas ================= */
const eqTok = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
function mkTrace(tp){
  for(let n = 0; n < 60; n++){
    const g = tp.g(), r = run(g.lines, 120);
    if(r.err || r.neg || r.big || r.steps.length > 46) continue;
    const ask = g.ask; let ans, type = "num";
    if(ask.k === "out"){ if(!r.tokens.length) continue; ans = r.tokens.join(" ");
      if(g.opts) type = "choice"; else if(r.tokens.length > 1) type = "seq"; if(r.tokens.length > 8) continue; }
    else if(ask.k === "val"){ if(!(ask.v in r.vars)) continue; ans = String(r.vars[ask.v]); }
    else if(ask.k === "count"){ ans = String(r.steps.filter(s => s.i === ask.line).length); }
    let popts = null;
    if(ask.k === "formal" || ask.k === "actual"){ type = "choice"; ans = ask.k;
      const d = g.lines.find(l => l[1][0] === "def")[1], c = g.lines.find(l => l[1][0] === "set" && Array.isArray(l[1][2]) && l[1][2][0] === "call")[1];
      popts = { formal: d[2], actual: c[2][2], w1: [d[1], c[1]], w2: [c[2][2][0], c[1]] }; }
    return { kind: "trace", id: tp.id, lv: tp.lv, t: tp.t, rule: tp.r, lines: g.lines, ask, type, ans, opts: g.opts || null, popts, res: r };
  }
  return null;
}
function parsData(tp){
  const ds = []; for(let k = 0; k < 5; k++){ const m = tp.mk(tp.par(k)); const r = run(m.sol, 300); ds.push({ m, exp: r.tokens, res: r }); }
  return ds;
}
function mkPars(tp){
  for(let n = 0; n < 40; n++){
    const ds = parsData(tp), m = ds[0].m;
    if(ds.some(d => d.res.err || d.res.neg || d.res.big || !d.exp.length)) continue;
    const pool = m.sol.slice(m.lock).map((l, i) => ({ id: i + m.lock, l })).concat(m.dis.map((l, i) => ({ id: m.sol.length + i, l })));
    return { kind: "pars", id: tp.id, lv: "d", t: tp.t, goal: m.goal, lock: m.lock, sol: m.sol, dis: m.dis, pool, need: m.sol.length - m.lock, exp: ds[0].exp, res: ds[0].res, ds };
  }
  return null;
}
/* Patikrina mokinio sudėtą programą: order – eilučių numeriai (0…sol−1 – sprendimo, toliau – klaidinančios). */
function checkPars(task, order){
  let first = null;
  for(let k = 0; k < task.ds.length; k++){
    const m = task.ds[k].m, all = m.sol.concat(m.dis), lines = m.sol.slice(0, m.lock).concat(order.map(i => all[i])), r = run(lines, 300);
    const ok = !r.err && eqTok(r.tokens, task.ds[k].exp);
    if(k === 0) first = { ok, res: r, lines };
    if(!ok) return { ok: false, res: first.res, lines: first.lines, hidden: k > 0 && first.ok };
  }
  return { ok: true, res: first.res, lines: first.lines };
}
function mkBug(tp){
  for(let n = 0; n < 40; n++){
    const m = tp.mk(tp.par(R(0, 4))), good = run(m.sol, 300); if(good.err || !m.bugs.length) continue;
    const b = pk(m.bugs), lines = m.sol.map((l, i) => i === b[0] ? [l[0], b[1]] : l), bad = run(lines, 300);
    if(bad.err || bad.neg || bad.big || !bad.tokens.length || eqTok(bad.tokens, good.tokens) || bad.steps.length > 60) continue;
    return { kind: "bug", id: tp.id + "b" + m.bugs.indexOf(b), lv: "e", t: tp.t, goal: m.goal, lines, sol: m.sol, line: b[0], rule: b[2], exp: good.tokens, got: bad.tokens, res: bad, good };
  }
  return null;
}
function mkSyn(tp, L){
  for(let n = 0; n < 40; n++){
    const m = tp.mk(tp.par(0)), kinds = SYN[L].slice().sort(() => Math.random() - .5);
    for(const sk of kinds){
      const c = m.sol.map((l, i) => i).filter(i => sk.ok(m.sol[i][1], m.sol[i][0])); if(!c.length) continue;
      const line = pk(c);
      return { kind: "syn", id: tp.id + "s" + sk.k, lv: "e", t: tp.t, goal: m.goal, lines: m.sol, line, rule: sk.k, lang: L, fix: sk.f, dedent: sk.dedent || 0 };
    }
  }
  return null;
}
const byLv = lv => TPL.filter(t => t.lv === lv);
/* Raundo užduotys: nuo lengvesnių prie sunkesnių, pirmiausia – seniai matyti šablonai. seen – { id: paskutinio rodymo numeris }. */
function pickN(list, n, seen){
  const tier = i => i < n * 0.38 ? 1 : i < n * 0.75 ? 2 : 3, used = new Set(), res = [];
  for(let i = 0; i < n; i++){
    const want = tier(i);
    let c = list.filter(t => !used.has(t.id) && t.t === want); if(!c.length) c = list.filter(t => !used.has(t.id)); if(!c.length) c = list;
    c = c.slice().sort((a, b) => (seen[a.id] || 0) - (seen[b.id] || 0) || Math.random() - .5);
    const top = c.filter(t => (seen[t.id] || 0) === (seen[c[0].id] || 0)), ch = pk(top); used.add(ch.id); res.push(ch);
  }
  return res;
}
function round(lv, L, seen){
  seen = seen || {}; let ts = [];
  if(lv === "d") ts = pickN(PAR, 6, seen).map(mkPars);
  else if(lv === "e"){ const ps = pickN(PAR, 8, seen); ts = ps.map((tp, i) => i % 4 === 2 ? mkSyn(tp, L) : mkBug(tp) || mkSyn(tp, L)); }
  else if(lv === "x"){
    const a = pickN(byLv("k"), 2, seen).concat(pickN(byLv("p"), 2, seen), pickN(byLv("c"), 2, seen), pickN(byLv("f"), 1, seen)).map(mkTrace);
    const ps = pickN(PAR, 3, seen); ts = a.concat([mkPars(ps[0]), mkBug(ps[1]) || mkSyn(ps[1], L), mkBug(ps[2]) || mkSyn(ps[2], L)]);
    ts = [ts[0], ts[2], ts[4], ts[1], ts[7], ts[3], ts[8], ts[5], ts[6], ts[9]];
  }
  else ts = pickN(byLv(lv), 8, seen).map(mkTrace);
  return ts.filter(Boolean);
}
/* pagrindinės programos kintamieji (C++ aprašo eilutei užduotyse „Sudėk programą“) */
function topVars(lines){ const vs = []; let f = false; lines.forEach(l => { const s = l[1]; if(l[0] === 0) f = s[0] === "def"; if(!f && (s[0] === "set" || s[0] === "for") && !vs.includes(s[1])) vs.push(s[1]); }); return vs; }
root.MK_PA = { topVars, render, run, round, checkPars, mkTrace, mkPars, mkBug, mkSyn, TPL, PAR, SYN, lineTxt, ex, eqTok };
})(typeof window !== "undefined" ? window : globalThis);
