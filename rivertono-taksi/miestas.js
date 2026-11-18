/* Rivertono taksi – miesto planas ir užsakymų generatorius (be tekstų: visi sakiniai sudaromi iš tekstai.lt.js šablonų).
   Miestas: 6 skersinės gatvės (šiaurė–pietūs, AX) ir 5 išilginės (vakarai–rytai, SY); upė tarp 3-ios ir 4-os skersinės gatvės, tiltai – tik 2-oje ir 4-oje išilginėje gatvėje.
   Kiekviename kvartale 6 sklypai: 3 prie šiaurinės gatvės ir 3 prie pietinės. */
(function(root){
"use strict";
const AX = [0, 220, 440, 600, 820, 1040], SY = [0, 170, 340, 510, 680], RW = 17, BC = [0, 1, 3, 4], PAV = 8;
const LIGHTS = new Set(["1,1", "4,1", "1,3", "4,3", "0,2", "5,2", "2,4", "3,0"]);
const SEED = 11;
function mulberry(a){ return function(){ a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const hEdge = (i, j) => i >= 0 && i < 5 && j >= 0 && j <= 4 && (i !== 2 || j === 1 || j === 3);
const vEdge = (i, j) => i >= 0 && i <= 5 && j >= 0 && j < 4;

function build(T, seed){
  const rs = mulberry(seed == null ? SEED : seed);
  const sh = a => { a = a.slice(); for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(rs() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const lots = [];
  for(const br of [0, 1, 2, 3]) for(const bc of BC) for(const row of [0, 1]) for(const k of [0, 1, 2]){
    const bx = AX[bc] + RW + PAV, bw = AX[bc + 1] - AX[bc] - 2 * (RW + PAV), w = bw / 3;
    const by = SY[br] + RW + PAV, bh = SY[br + 1] - SY[br] - 2 * (RW + PAV), h = (bh - 12) / 2;
    const x0 = bx + k * w, y0 = row === 0 ? by : by + bh - h;
    lots.push({ id: lots.length, bc, br, row, k, st: row === 0 ? br : br + 1, side: row === 0 ? "S" : "N", x0, y0, w, h, cx: x0 + w / 2, cy: y0 + h / 2, kind: "house", bld: true });
  }
  const order = sh(lots.map(l => l.id));
  T.places.forEach((p, n) => { const l = lots[order[n]]; l.kind = "place"; l.place = p.id; l.bld = p.bld !== false; });
  for(let n = T.places.length; n < T.places.length + 12; n++){ const l = lots[order[n]]; l.kind = "garden"; l.bld = false; }
  const cols = T.colours.map(c => c.id);
  for(const l of lots) if(l.kind === "house"){
    const nb = lots.filter(m => m.kind === "house" && m.col && ((m.bc === l.bc && m.br === l.br && m.row === l.row && Math.abs(m.k - l.k) <= 2) || (m.st === l.st && m.bc === l.bc && m.k === l.k))).map(m => m.col);
    const free = cols.filter(c => !nb.includes(c)); l.col = free[Math.floor(rs() * free.length)];
  }
  return lots;
}

function make(T, seed){
  const lots = build(T, seed);
  const P = {}; T.places.forEach(p => P[p.id] = p);
  const C = {}; T.colours.forEach(c => C[c.id] = c);
  const placeLot = {}; lots.forEach(l => { if(l.kind === "place") placeLot[l.place] = l; });
  const houses = lots.filter(l => l.kind === "house");
  const rowOf = l => lots.filter(m => m.bc === l.bc && m.br === l.br && m.row === l.row).sort((a, b) => a.k - b.k);
  const nextTo = (a, b) => a.bc === b.bc && a.br === b.br && a.row === b.row && Math.abs(a.k - b.k) === 1;
  const opposite = (a, b) => a.st === b.st && a.side !== b.side && a.bc === b.bc && a.k === b.k;
  const behind = (a, b) => a.bc === b.bc && a.br === b.br && a.k === b.k && a.row !== b.row;
  const cornerAv = l => l.k === 0 ? l.bc : l.k === 2 ? l.bc + 1 : -1;

  /* ar sklypas atitinka aprašą */
  function match(d, l){
    if(d.t === "place") return l.kind === "place" && l.place === d.p;
    if(l.kind !== "house") return false;
    const p = d.p && placeLot[d.p], q = d.q && placeLot[d.q];
    switch(d.t){
      case "next": return nextTo(l, p);
      case "nextc": return nextTo(l, p) && l.col === d.c;
      case "notcol": return nextTo(l, p) && l.col !== d.c;
      case "opp": return opposite(l, p);
      case "behind": return behind(l, p);
      case "between": return l.k === 1 && nextTo(l, p) && nextTo(l, q) && p !== q;
      case "corner": return l.col === d.c && l.st === d.s && cornerAv(l) === d.a;
      case "stretch": return l.col === d.c && l.st === d.s && l.bc === d.a;
    }
    return false;
  }
  const uniq = d => lots.filter(l => match(d, l)).length === 1;

  /* visi galimi „kur tas namas?“ aprašai */
  const prep = { next: [], nextc: [], notcol: [], opp: [], behind: [], between: [], corner: [], stretch: [] };
  for(const h of houses){
    for(const pl of lots) if(pl.kind === "place"){
      if(nextTo(h, pl)){
        const hn = houses.filter(x => nextTo(x, pl));
        if(hn.length === 1) prep.next.push({ t: "next", p: pl.place, lot: h.id });
        else { prep.nextc.push({ t: "nextc", p: pl.place, c: h.col, lot: h.id }); const o = hn.find(x => x !== h); prep.notcol.push({ t: "notcol", p: pl.place, c: o.col, lot: h.id }); }
      }
      if(opposite(h, pl)) prep.opp.push({ t: "opp", p: pl.place, lot: h.id });
      if(behind(h, pl)) prep.behind.push({ t: "behind", p: pl.place, lot: h.id });
    }
    if(h.k === 1){ const r = rowOf(h); if(r[0].kind === "place" && r[2].kind === "place"){ const pq = Math.random() < 0.5 ? [r[0], r[2]] : [r[2], r[0]]; prep.between.push({ t: "between", p: pq[0].place, q: pq[1].place, lot: h.id }); } }
    if(cornerAv(h) >= 0){ const d = { t: "corner", c: h.col, s: h.st, a: cornerAv(h), lot: h.id }; if(uniq(d)) prep.corner.push(d); }
    { const d = { t: "stretch", c: h.col, s: h.st, a: h.bc, lot: h.id }; if(uniq(d)) prep.stretch.push(d); }
  }
  for(const k in prep) prep[k] = prep[k].filter(uniq);

  /* aprašo tekstas: [angliškai, lietuviškai] */
  const fill = (s, m) => s.replace(/\{(\w+)\}/g, (_, k) => m[k] != null ? m[k] : "{" + k + "}");
  function pmap(d){
    const m = {};
    if(d.p){ const p = P[d.p]; m.P = p.en; m.Pa = p.a; m.Pg = p.g; m.Pn = p.n; }
    if(d.q){ const q = P[d.q]; m.Q = q.en; m.Qa = q.a; m.Qg = q.g; }
    if(d.c){ m.C = C[d.c].en; m.Ca = C[d.c].a; }
    if(d.t === "corner"){ m.S = T.streets[d.s]; m.A = T.avenues[d.a]; }
    if(d.t === "stretch"){ m.S = T.streets[d.s]; m.A = T.avenues[d.a]; m.B = T.avenues[d.a + 1]; }
    return m;
  }
  const descText = d => { const m = pmap(d); return [fill(T.desc[d.t][0], m), fill(T.desc[d.t][1], m)]; };
  const noteText = (k, d) => fill(T.notes[k] || "", d ? pmap(d) : {});

  /* ---------- maršrutai ---------- */
  const leftOf = d => [d[1], -d[0]];
  function sideRoad(i, j, d, s){
    const l = leftOf(d), v = s === "L" ? l : [-l[0], -l[1]];
    return v[0] !== 0 ? hEdge(Math.min(i, i + v[0]), j) : vEdge(i, Math.min(j, j + v[1]));
  }
  /* sankryžos priekyje; b – prieš ją pervažiuotas tiltas */
  function ahead(cur, d){
    const out = [];
    if(d[0] !== 0){
      let i = cur.mid ? (d[0] > 0 ? cur.bc + 1 : cur.bc) : cur.i + d[0], first = true;
      if(!cur.mid && !hEdge(Math.min(cur.i, i), cur.j)) return out;
      while(i >= 0 && i <= 5){
        const prev = i - d[0];
        if(!first && !hEdge(Math.min(prev, i), cur.j)) break;
        out.push({ i, j: cur.j, b: (cur.mid && first) ? false : Math.min(prev, i) === 2 });
        first = false; i += d[0];
      }
    } else {
      for(let j = cur.j + d[1]; j >= 0 && j <= 4; j += d[1]) out.push({ i: cur.i, j, b: false });
    }
    return out;
  }
  function genRoute(pick, h, nTurns, rnd){
    const tokens = [{ t: "go" }], sig = [];
    let cur = { mid: true, bc: pick.bc, j: pick.st, x: pick.cx }, d = [h, 0];
    for(let leg = 0; leg < nTurns; leg++){
      let list = ahead(cur, d); if(!list.length) return null;
      const ti = Math.floor(rnd() * Math.min(list.length, 4)), nd = list[ti];
      const sides = ["L", "R"].filter(s => sideRoad(nd.i, nd.j, d, s)); if(!sides.length) return null;
      const s = sides[Math.floor(rnd() * sides.length)];
      let from = 0; for(let n = 0; n <= ti; n++) if(list[n].b) from = n;
      const bridge = list.slice(0, ti + 1).some(n => n.b);
      const eff = list.slice(from, ti + 1);
      const opts = [];
      const cnt = eff.filter(n => sideRoad(n.i, n.j, d, s)).length; if(cnt <= 3) opts.push({ t: "turnN", n: cnt, s }, { t: "turnN", n: cnt, s });
      if(LIGHTS.has(nd.i + "," + nd.j) && !eff.slice(0, -1).some(n => LIGHTS.has(n.i + "," + n.j))) opts.push({ t: "lights", s }, { t: "lights", s });
      if(ti === list.length - 1 && !(d[0] !== 0 ? hEdge(Math.min(nd.i, nd.i + d[0]), nd.j) : vEdge(nd.i, Math.min(nd.j, nd.j + d[1])))) opts.push({ t: "end", s }, { t: "end", s });
      opts.push({ t: "into", s, name: d[0] !== 0 ? T.avenues[nd.i] : T.streets[nd.j] });
      const tk = opts[Math.floor(rnd() * opts.length)];
      if(bridge) tokens.push({ t: "bridge" });
      else if(d[0] !== 0 && rnd() < 0.4){
        const x0 = cur.mid ? cur.x : AX[cur.i], x1 = AX[nd.i];
        const ps = lots.filter(l => l.kind === "place" && l.st === cur.j && (l.cx - x0) * d[0] > 30 && (x1 - l.cx) * d[0] > 20);
        if(ps.length) tokens.push({ t: "past", p: ps[Math.floor(rnd() * ps.length)].place });
      }
      tokens.push(tk); sig.push((bridge ? "b+" : "") + tk.t + (tk.t === "turnN" ? tk.n : ""));
      const l = leftOf(d); d = s === "L" ? l : [-l[0], -l[1]]; cur = { i: nd.i, j: nd.j };
    }
    if(d[0] === 0) return null;
    const bc = d[0] > 0 ? cur.i : cur.i - 1; if(!BC.includes(bc) || !hEdge(bc, cur.j)) return null;
    const cands = [];
    for(const side of ["S", "N"]){
      const br = side === "S" ? cur.j : cur.j - 1; if(br < 0 || br > 3) continue;
      const row = lots.filter(l => l.bc === bc && l.br === br && l.side === side).sort((a, b) => (a.k - b.k) * d[0]);
      const lr = (side === "S" ? 1 : -1) === -d[0] ? "L" : "R";
      row.forEach((t, n) => {
        if(t.kind !== "house") return;
        if(row.slice(0, n + 1).every(x => x.bld)) cands.push({ lot: t, f: { t: "nth", n: n + 1, s: lr } }, { lot: t, f: { t: "nth", n: n + 1, s: lr } });
        for(const p of row) if(p.kind === "place" && nextTo(p, t) && row.filter(x => x.kind === "house" && nextTo(x, p)).length === 1) cands.push({ lot: t, f: { t: "next", s: lr, p: p.place } });
        const o = lots.find(x => opposite(x, t)); if(o && o.kind === "place") cands.push({ lot: t, f: { t: "opp", s: lr, p: o.place } });
      });
    }
    if(!cands.length) return null;
    const c = cands[Math.floor(rnd() * cands.length)];
    tokens.push(c.f); sig.push(c.f.t + (c.f.t === "nth" ? c.f.n : ""));
    return { tokens, target: c.lot, sig: sig.join(">") };
  }
  function routeText(tokens){
    const en = [], lt = []; let turns = 0, prev = "";
    for(const k of tokens){
      const m = {};
      if(k.s){ m.LR = T.lr[k.s][0]; m.LRa = T.lr[k.s][1]; m.LRk = T.lr[k.s][2]; }
      if(k.n){ m.N = T.ord[k.n - 1][0]; m.Na = T.ord[k.n - 1][1]; m.Nn = T.ord[k.n - 1][2]; }
      if(k.p){ m.P = P[k.p].en; m.Pa = P[k.p].a; m.Pg = P[k.p].g; }
      if(k.name) m.S = k.name;
      let a = fill(T.route[k.t][0], m), b = fill(T.route[k.t][1], m);
      const isTurn = ["turnN", "lights", "end", "into"].includes(k.t);
      if(isTurn && (turns > 0 || prev === "bridge" || prev === "past")){ const th = T.then[turns === 2 ? 1 : 0]; a = th[0] + a[0].toLowerCase() + a.slice(1); b = th[1] + b[0].toLowerCase() + b.slice(1); }
      if(isTurn) turns++;
      prev = k.t; en.push(a); lt.push(b);
    }
    return [en.join(" "), lt.join(" ")];
  }

  /* ---------- pamainos ---------- */
  const PLAN = {
    p1: ["PLACE", "NEED", "PLACE", "NEED", "PLACE", "NEED"],
    p2: ["PREP", "PREP", "PREP", "PREP", "PREP", "PREP"],
    p3: ["R2", "R2", "R2", "R2", "R2", "R2"],
    p4: ["R4", "MULTI", "R4", "MULTI", "R4", "MULTI"],
    p5: ["NEED", "PREP", "R2", "MULTI", "PREP", "R2"],
    p6: ["NEED", "PREP", "R2", "MULTI", "R4", "PREP", "MULTI", "R4"]
  };
  const dist = (a, b) => Math.hypot(a.cx - b.cx, a.cy - b.cy);
  function genShift(id, rnd){
    rnd = rnd || Math.random;
    const pk = a => a[Math.floor(rnd() * a.length)];
    const used = new Set(), structs = new Set(), fares = [];
    const pickup = (far) => { for(let n = 0; n < 400; n++){ const l = pk(lots); if(l.kind !== "garden" && !used.has(l.id) && (!far || dist(l, far) > 230)) return l; } return null; };
    function simple(kind){ /* vienos vietos aprašas: {d, lot, struct, notes} */
      for(let n = 0; n < 300; n++){
        if(kind === "PLACE"){ const p = pk(T.places), l = placeLot[p.id]; if(used.has(l.id)) continue; return { d: { t: "place", p: p.id }, lot: l, struct: "PLACE", note: "place" }; }
        const key = pk(Object.keys(prep)), c = prep[key].length && pk(prep[key]); if(!c || used.has(c.lot)) continue;
        return { d: c, lot: lots[c.lot], struct: "PREP:" + key, note: key };
      }
      return null;
    }
    for(const type of PLAN[id]){
      let f = null;
      for(let tries = 0; tries < 600 && !f; tries++){
        if(type === "PLACE"){
          const s = simple("PLACE"), fr = Math.floor(rnd() * T.frames.length), st = "PLACE:f" + fr; if(!s || structs.has(st)) continue;
          const t = descText(s.d), pu = pickup(s.lot); if(!pu) continue;
          f = { type, struct: st, pickup: pu.id, stops: [s.lot.id], en: T.frames[fr][0].replace("{D}", t[0]), lt: T.frames[fr][1].replace("{D}", t[1]), notes: [noteText("place", s.d)] };
        } else if(type === "NEED"){
          const p = pk(T.places), n = Math.floor(rnd() * p.need.length), st = "NEED:" + p.id + n, l = placeLot[p.id]; if(structs.has(st) || used.has(l.id)) continue;
          const pu = pickup(l); if(!pu) continue;
          f = { type, struct: st, pickup: pu.id, stops: [l.id], en: p.need[n][0] + " " + T.needTail[0], lt: p.need[n][1] + " " + T.needTail[1], notes: [noteText("need", { t: "place", p: p.id })] };
        } else if(type === "PREP"){
          const s = simple("PREP"); if(!s || structs.has(s.struct)) continue;
          const fr = Math.floor(rnd() * T.frames.length), t = descText(s.d), pu = pickup(s.lot); if(!pu) continue;
          f = { type, struct: s.struct, pickup: pu.id, stops: [s.lot.id], en: T.frames[fr][0].replace("{D}", t[0]), lt: T.frames[fr][1].replace("{D}", t[1]), notes: [noteText(s.note, s.d)], d: s.d };
        } else if(type === "R2" || type === "R4"){
          const pu = pickup(null); if(!pu) continue;
          const h = rnd() < 0.5 ? 1 : -1, r = genRoute(pu, h, type === "R2" ? 2 : 4, rnd); if(!r) continue;
          const st = type + ":" + r.sig; if(structs.has(st) || used.has(r.target.id) || r.target.id === pu.id || dist(r.target, pu) < 120) continue;
          const t = routeText(r.tokens), kinds = [...new Set(r.tokens.map(k => k.t).filter(k => k !== "go"))];
          f = { type, struct: st, pickup: pu.id, heading: h, stops: [r.target.id], en: t[0], lt: t[1], tokens: r.tokens, notes: kinds.map(k => noteText(k)).concat([T.notes.lr]) };
        } else if(type === "MULTI"){
          const key = pk(Object.keys(T.multi)), st = "MULTI:" + key; if(structs.has(st)) continue;
          const a = simple("PLACE"), b = simple(rnd() < 0.6 ? "PREP" : "PLACE"); if(!a || !b || a.lot === b.lot || dist(a.lot, b.lot) < 150) continue;
          const ta = descText(a.d), tb = descText(b.d), pu = pickup(a.lot); if(!pu || pu === b.lot) continue;
          f = { type, struct: st, pickup: pu.id, stops: [a.lot.id, b.lot.id], en: T.multi[key][0].replace("{X}", ta[0]).replace("{Y}", tb[0]), lt: T.multi[key][1].replace("{X}", ta[1]).replace("{Y}", tb[1]), notes: [T.notes[key]].concat(b.note !== "place" ? [noteText(b.note, b.d)] : []), ds: [a.d, b.d] };
        }
      }
      if(!f) return null;
      f.listen = id === "p5";
      structs.add(f.struct); used.add(f.pickup); f.stops.forEach(s => used.add(s)); fares.push(f);
    }
    return fares;
  }
  /* sklypas, prie kurio stovi automobilis (x, y) */
  function lotAt(x, y){
    let j = -1; for(let n = 0; n < SY.length; n++) if(Math.abs(y - SY[n]) <= RW + 2) j = n;
    if(j < 0) return null;
    const c = lots.filter(l => l.st === j && Math.abs(x - l.cx) <= l.w / 2);
    if(!c.length) return null;
    const want = y < SY[j] ? "N" : "S";
    return c.find(l => l.side === want) || c[0];
  }
  return { AX, SY, RW, PAV, BC, LIGHTS, hEdge, vEdge, lots, placeLot, prep, match, genShift, genRoute, routeText, lotAt, descText, PLAN };
}
root.MK_MIESTAS = { make };
if(typeof module !== "undefined") module.exports = { make };
})(typeof window !== "undefined" ? window : globalThis);
