/* Akordų studija – muzikos teorijos variklis ir užduočių generatoriai (be tekstų; tekstai – tekstai.lt.js).
   Garsai žymimi: L – raidės numeris (0 = do/C … 6 = si), acc – alteracija (−1 bemolis, 0, +1 diezas), pc – pustonių klasė 0–11. */
(function(root){
"use strict";
const LPC = [0, 2, 4, 5, 7, 9, 11], LET = "CDEFGAB";
/* akordo sandara: [raidžių žingsnis, pustoniai nuo pagrindinio garso] */
const ST = {
  M: [[0, 0], [2, 4], [4, 7]],
  m: [[0, 0], [2, 3], [4, 7]],
  7: [[0, 0], [2, 4], [4, 7], [6, 10]],
  9: [[0, 0], [2, 4], [4, 7], [6, 10], [8, 14]]
};
const LO = 60, HI = 77;                       /* klaviatūra: do (C4) – fa (F5) */
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = a.slice(); for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

function mk(l, a, q){
  const rpc = (LPC[l] + a + 12) % 12;
  const notes = ST[q].map(([ls, semi]) => {
    const L = (l + ls) % 7, pc = (rpc + semi) % 12, acc = ((pc - LPC[L] + 18) % 12) - 6;
    return { L, acc, pc, semi };
  });
  return { id: LET[l] + (a > 0 ? "#" : a < 0 ? "b" : "") + (q === "M" ? "" : q), l, a, q, rpc, notes, pcs: notes.map(n => n.pc) };
}
const cache = {};
function ch(s){
  if(cache[s]) return cache[s];
  const m = /^([A-G])([#b]?)(m|7|9)?$/.exec(s); if(!m) throw new Error("Blogas akordas: " + s);
  return cache[s] = mk(LET.indexOf(m[1]), m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0, m[3] || "M");
}
/* to paties pagrindinio garso kitos rūšies akordas */
const alt = (c, q) => ch(LET[c.l] + (c.a > 0 ? "#" : c.a < 0 ? "b" : "") + (q === "M" ? "" : q));
/* mažorinės gamos laipsnis (0 = I) nuo akordo pagrindinio garso */
function degree(c, d, q){
  const L = (c.l + d) % 7, pc = (c.rpc + LPC[d]) % 12, acc = ((pc - LPC[L] + 18) % 12) - 6;
  return ch(LET[L] + (acc > 0 ? "#" : acc < 0 ? "b" : "") + (q === "M" ? "" : q));
}
/* akordo klavišai klaviatūroje (pagrindinis garsas apačioje, kas netelpa – oktava žemiau) */
function voice(c){ const r = LO + c.rpc; return c.notes.map(n => { let m = r + n.semi; while(m > HI) m -= 12; return m; }).sort((a, b) => a - b); }
const samePcs = (a, b) => a.pcs.length === b.pcs.length && a.pcs.every(p => b.pcs.includes(p));

const POOL = {
  easy: ["C", "F", "G", "Am", "Dm", "Em"],
  M: ["C", "G", "D", "A", "E", "F", "Bb", "Eb", "Ab", "B"],
  m: ["Am", "Em", "Dm", "Gm", "Cm", "Fm", "Bm", "F#m", "C#m", "Bbm"],
  7: ["G7", "C7", "F7", "D7", "A7", "E7", "B7", "Bb7", "Eb7"],
  9: ["C9", "G9", "D9", "F9", "A9", "E9", "Bb9"]
};
const ALL = [].concat(POOL.M, POOL.m, POOL[7], POOL[9]).map(ch);

/* ---------- akordų užduotys ---------- */
function taker(){ const used = {}; return list => { const f = list.filter(s => !used[s]); const s = pick(f.length ? f : list); used[s] = 1; return ch(s); }; }
function nameTask(c, qs){
  /* klaidingi variantai: tas pats pagrindinis garsas (kita rūšis) ir akordai, turintys bendrų garsų */
  const same = qs.filter(q => q !== c.q).map(q => alt(c, q));
  const near = shuffle(ALL.filter(x => x.l !== c.l || x.a !== c.a).filter(x => qs.includes(x.q) && x.pcs.filter(p => c.pcs.includes(p)).length >= 2));
  const far = shuffle(ALL.filter(x => qs.includes(x.q) && (x.l !== c.l || x.a !== c.a)));
  const opts = [c];
  [].concat(shuffle(same).slice(0, 2), near, far).forEach(x => { if(opts.length < 4 && !opts.some(o => o.id === x.id || samePcs(o, x))) opts.push(x); });
  const sh = shuffle(opts);
  return { type: "name", ch: c, opts: sh, ans: sh.indexOf(c) };
}
const build = (c, kind, from) => ({ type: "build", kind: kind || "build", ch: c, from: from || null, pre: from ? voice(from) : [] });
/* „mid“ – pažymėti kraštiniai garsai, trūksta vidurinio; „fix“ – vienas (ne pagrindinis) garsas paslinktas per pustonį */
function buildMid(c){ const v = voice(c), r = LO + c.rpc; return { type: "build", kind: "mid", ch: c, from: null, pre: v.filter(m => (m - r + 24) % 12 !== c.notes[1].semi) }; }
function buildFix(c){
  const v = voice(c), r = LO + c.rpc, cand = [];
  v.forEach((m, i) => { if((m - r + 24) % 12 === 0) return; [-1, 1].forEach(d => { const x = m + d; if(x >= LO && x <= HI && !c.pcs.includes(x % 12) && !v.includes(x)) cand.push([i, x]); }); });
  const [i, x] = pick(cand), pre = v.slice(); pre[i] = x;
  return { type: "build", kind: "fix", ch: c, from: null, pre: pre.sort((a, b) => a - b) };
}

function roundTriads(){
  const t = taker(), hard = POOL.M.concat(POOL.m).filter(s => !POOL.easy.includes(s));
  const kinds = ["build", "name", "mid", "build", "morph", "name", "fix", "build", "morph", "fix"];
  return kinds.map((k, i) => {
    const c = t(i < 3 ? POOL.easy : hard);
    if(k === "name") return nameTask(c, ["M", "m"]);
    if(k === "morph") return build(c, "morph", alt(c, c.q === "M" ? "m" : "M"));
    if(k === "mid") return buildMid(c);
    if(k === "fix") return buildFix(c);
    return build(c);
  });
}
function roundSevenths(){
  const t = taker();
  const kinds = ["add7", "build7", "name7", "fix", "build7", "name7", "add9", "name9", "fix", "build9"];
  return kinds.map(k => {
    if(k === "add7"){ const c = t(POOL[7]); return build(c, "add7", alt(c, "M")); }
    if(k === "build7") return build(t(POOL[7]), "build7");
    if(k === "fix") return buildFix(t(POOL[7]));
    if(k === "name7") return nameTask(t(POOL[7]), ["M", "m", "7"]);
    if(k === "add9"){ const c = t(POOL[9]); return build(c, "add9", alt(c, "7")); }
    if(k === "name9") return nameTask(t(POOL[9]), ["M", "7", "9"]);
    return build(t(POOL[9]), "build9");
  });
}
/* ---------- klausa ---------- */
function earTask(qs, t){ const q = pick(qs), c = t(POOL[q]); return { type: "ear", ch: c, opts: qs, ans: qs.indexOf(q) }; }
function oddTask(pair){
  const [qa, qb] = Math.random() < .5 ? pair : pair.slice().reverse();
  const a = shuffle(POOL[qa]).slice(0, 2).map(ch);
  const b = ch(pick(POOL[qb].filter(s => !a.some(x => x.l === ch(s).l && x.a === ch(s).a))));
  const chs = shuffle([a[0], a[1], b]);
  return { type: "odd", chs, ans: chs.indexOf(b) };
}
function roundEar(){
  const t = taker(), r = [];
  for(let i = 0; i < 4; i++) r.push(earTask(["M", "m"], t));
  for(let i = 0; i < 4; i++) r.push(earTask(["M", "m", "7"], t));
  r.push(oddTask(["M", "m"]), oddTask(["m", "7"]));
  return r;
}

/* ---------- pritarimas dainai ---------- */
const KEYS_MAJ = ["C", "G", "F", "D"], KEYS_MIN = ["Am", "Dm", "Em"];
const PROG = {
  maj3: [[0, 1, 2, 0], [0, 0, 2, 0], [0, 2, 2, 0], [1, 0, 2, 0], [0, 1, 0, 2], [0, 2, 0, 0]],
  maj4: [[0, 3, 1, 2], [0, 3, 2, 0], [3, 1, 2, 0], [0, 1, 3, 2], [0, 3, 1, 0], [3, 1, 0, 2]],
  min3: [[0, 1, 2, 0], [0, 0, 2, 0], [0, 1, 0, 2], [1, 0, 2, 0]],
  min4: [[0, 3, 1, 2], [0, 3, 2, 0], [0, 1, 3, 2], [3, 1, 2, 0]]
};
function palette(key, four){
  const k = ch(key);
  if(k.q === "M"){ const p = [k, degree(k, 3, "M"), degree(k, 4, "7")]; if(four) p.push(degree(k, 5, "m")); return p; }
  /* minore: i, iv, V7 (+ VI) – laipsniai skaičiuojami nuo minoro tonikos */
  const iv = mk((k.l + 3) % 7, 0, "m"), V = mk((k.l + 4) % 7, 0, "7"), p = [k, ch(iv.id), ch(V.id)];
  if(four){ const pc = (k.rpc + 8) % 12, L = (k.l + 5) % 7, acc = ((pc - LPC[L] + 18) % 12) - 6; p.push(ch(LET[L] + (acc > 0 ? "#" : acc < 0 ? "b" : ""))); }
  return p;
}
const RHY = [[1, 1, 1, 1], [2, 1, 1], [1, 1, 2], [2, 2], [1, 2, 1], [1, 1, 1, 1]];
function fits(pcs, c){ return pcs.every(p => c.pcs.includes(p)); }
function melodyBar(c, pal, prev, last){
  const cand = []; for(let m = LO; m <= HI; m++) if(c.pcs.includes(m % 12)) cand.push(m);
  for(let tr = 0; tr < 80; tr++){
    const rh = pick(RHY), notes = []; let p = prev;
    rh.forEach((d, i) => {
      let pool = cand.filter(m => Math.abs(m - p) <= 7 && (m !== p || Math.random() < .2));
      if(last && i === rh.length - 1){ const r = cand.filter(m => m % 12 === c.rpc); pool = r.filter(m => Math.abs(m - p) <= 9); if(!pool.length) pool = r; }
      if(!pool.length) pool = cand;
      const m = pick(pool), n = c.notes.find(x => x.pc === m % 12);
      notes.push({ m, d, L: n.L, acc: n.acc }); p = m;
    });
    const pcs = Array.from(new Set(notes.map(n => n.m % 12)));
    if(pcs.length >= 2 && pal.filter(x => fits(pcs, x)).length === 1) return notes;
  }
  return null;
}
function harmTask(o){
  for(let tr = 0; tr < 50; tr++){
    const minor = o.minor, key = pick(minor ? KEYS_MIN : KEYS_MAJ), pal = palette(key, o.four);
    const prog = pick(PROG[(minor ? "min" : "maj") + (o.four ? 4 : 3)]);
    let prev = rnd(64, 70), ok = true; const bars = [];
    for(let i = 0; i < 4 && ok; i++){
      const c = pal[prog[i]], notes = melodyBar(c, pal, prev, i === 3 && prog[i] === 0);
      if(!notes){ ok = false; break; }
      prev = notes[notes.length - 1].m; bars.push({ c: prog[i], notes, pre: false });
    }
    if(!ok) continue;
    shuffle([0, 1, 2, 3]).slice(0, o.pre || 0).forEach(i => bars[i].pre = true);
    return { type: "harm", key: ch(key), minor, pal, bars, showNotes: !!o.showNotes };
  }
  throw new Error("harmTask");
}
function roundHarm(){
  return [
    harmTask({ pre: 2, showNotes: true }), harmTask({ pre: 1, showNotes: true }),
    harmTask({ four: true, pre: 1, showNotes: true }), harmTask({ four: true }),
    harmTask({ minor: true, pre: 1 }), harmTask({ minor: Math.random() < .5, four: true })
  ];
}

/* ---------- 12-os taktų bliuzo forma ---------- */
const BKEYS = ["C", "G", "F", "D", "A", "E"], FORM = [0, 0, 0, 0, 1, 1, 0, 0, 2, 1, 0, 0];
const blues3 = key => { const k = ch(key); return [k, degree(k, 3, "7"), degree(k, 4, "7")]; };
function bluesFill(key, nMiss, distract){
  const three = blues3(key), k = ch(key), pal = three.slice();
  if(distract) pal.push(degree(k, 1, "7"), degree(k, 5, "m"));
  /* trūkstami taktai: bent po vieną kiekvieno akordo */
  let miss;
  do { miss = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]).slice(0, nMiss).sort((a, b) => a - b); }
  while(nMiss >= 3 && [0, 1, 2].some(x => !miss.some(i => FORM[i] === x)));
  return { type: "bfill", key: k, three, pal: distract ? shuffle(pal) : pal, form: FORM.slice(), miss };
}
function bluesErr(key){
  const three = blues3(key), bad = rnd(1, 11), wrong = pick([0, 1, 2].filter(x => x !== FORM[bad]));
  const form = FORM.slice(); form[bad] = wrong;
  return { type: "berr", key: ch(key), three, form, bad, right: FORM[bad] };
}
function bluesTrans(key){
  const k = ch(key), from = pick(BKEYS.filter(s => s !== key && (key === "C" || s === "C")));
  const good = blues3(key);
  const opts = shuffle([good, [k, degree(k, 2, "7"), degree(k, 4, "7")], [k, degree(k, 3, "7"), degree(k, 5, "7")], [k, degree(k, 1, "7"), degree(k, 5, "7")]]);
  return { type: "btrans", key: k, from: ch(from), from3: blues3(from), opts, ans: opts.indexOf(good) };
}
function roundBlues(){
  const ks = shuffle(BKEYS.filter(s => s !== "C"));
  return [
    bluesFill("C", 3), bluesFill(ks[0], 4), bluesErr("C"), bluesTrans(ks[1]),
    bluesFill(ks[2], 5, true), bluesErr(ks[3]), bluesTrans(ks[4]), bluesFill(ks[0], 7, true)
  ];
}
function roundMix(){
  const t = taker(), ks = shuffle(BKEYS);
  return [
    build(t(POOL.M.concat(POOL.m).filter(s => !POOL.easy.includes(s)))),
    nameTask(t(POOL.m.concat(POOL[7])), ["M", "m", "7"]),
    earTask(["M", "m", "7"], t),
    build(t(POOL[7]), "build7"),
    harmTask({ four: true }),
    bluesFill(ks[0], 5, true),
    oddTask(["M", "m"]),
    build(t(POOL[9]), "build9"),
    harmTask({ minor: true, four: true }),
    bluesTrans(ks[1] === "C" ? ks[2] : ks[1])
  ];
}
const api = { LPC, ST, LO, HI, ch, alt, degree, voice, POOL, ALL, FORM, BKEYS, blues3, palette, fits, shuffle, pick, rnd,
  rounds: { trigarsiai: roundTriads, septakordai: roundSevenths, klausa: roundEar, pritarimas: roundHarm, bliuzas: roundBlues, koncertas: roundMix },
  gen: { nameTask, build, earTask, oddTask, harmTask, bluesFill, bluesErr, bluesTrans } };
if(typeof module !== "undefined" && module.exports) module.exports = api; else root.MK_MUZ = api;
})(typeof window !== "undefined" ? window : globalThis);
