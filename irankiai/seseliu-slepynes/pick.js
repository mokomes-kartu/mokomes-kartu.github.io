/* Surenka kambarius į slepynes-kambariai.js ir kiekvieną dar kartą patikrina. node pick.js [WRITE=1] */
const fs = require('fs'), S = require('./solver.js'), L = S.L, H = require('./hand.js');
const F1 = ['over:1', 'side:1', 'end:0', 'over:0', 'side:0', 'over2:0', 'two:0', 'hv:1', 'sweep:2', 'rothv:0'];
const F2 = ['b-side1:2', 'b-over1:0', 'b-end1:2', 'b-side1:1', 'b-two1:2', 'b-over2:0', 'b-side1:0', 'b-end-2b:2', 'b-end1:0', 'b-over-2b:1'];
const get = a => { const [f, i] = a.split(':'); const ls = fs.readFileSync('out2/' + f + '.txt', 'utf8').split('\n').filter(l => l.startsWith('{"tpl"')); return JSON.parse(ls[+i]).lv; };
const r4 = v => Math.round(v * 1e4) / 1e4, lampS = l => '{ ' + Object.entries(l).map(([k, v]) => k + ': ' + (Array.isArray(v) ? '[' + v.join(', ') + ']' : r4(v))).join(', ') + ' }';
function fmt(lv){ let s = '    { map: [' + lv.map.map(r => JSON.stringify(r)).join(', ') + '],\n      lamps: [' + lv.lamps.map(lampS).join(', ') + ']';
  if(lv.ropes) s += ', ropes: ' + JSON.stringify(lv.ropes); if(lv.cables) s += ', cables: ' + JSON.stringify(lv.cables); if(lv.cat) s += ', cat: ' + JSON.stringify(lv.cat); return s + ' }'; }
function verify(lv, name){ const P = L.parse(lv), dyn = S.isDyn(P); let ok, info;
  if(dyn){ const b = S.solveDyn(lv, { maxT: 900 }), ns = S.solveDyn(Object.assign({}, lv, { cat: null }), { noShadow: !P.cat, LIM: 40, maxT: 800 }); ok = b.ok && !ns.ok; info = 'laikinis: su atsarga ' + (b.ok ? b.t.toFixed(1) + ' s' : 'NE') + ', be šešėlių/katino ' + (ns.ok ? 'ĮVEIKIAMAS' : 'ne'); }
  else { const acts = P.boxes.length + P.cheese.length + P.ropes.length + P.cables.length, ns = S.solveStatic(lv, { noAct: true, noShadow: true, LIM: 40 }), na = acts ? S.solveStatic(lv, { noAct: true, LIM: 40 }) : { ok: false }, r = S.solveStatic(lv, { maxStates: 4000 }); ok = r.ok && !ns.ok && !na.ok; info = 'statinis: ' + (r.ok ? 'veiksmų ' + r.depth : 'NE') + ', be šešėlių ' + (ns.ok ? 'ĮVEIKIAMAS' : 'ne') + (acts ? ', be veiksmų ' + (na.ok ? 'ĮVEIKIAMAS' : 'ne') : ''); }
  console.log((ok ? 'OK  ' : 'BLOGAI ') + name + ' – ' + info + ' – tūbelių ' + P.tubes.length); return ok; }
const floors = [['1', F1.map(get)], ['2', process.env.NOF2 ? [] : F2.map(get)], ['b', H]]; let all = true;
for(const [id, rooms] of floors) rooms.forEach((lv, i) => { if(!verify(lv, id + '-' + (i + 1))) all = false; });
const out = '/* Šešėlių slėpynės – kambariai. Ženklų reikšmės aprašytos faile slepynes-logika.js.\n   Kiekvienas kambarys patikrintas programa: įveikiamas paliekant atsargą, o be daiktų šešėlių (ar be veiksmų – stūmimo, graužimo) durų pasiekti neįmanoma. */\nwindow.MK_SLK = { floors: [\n' +
  floors.map(([id, rooms]) => '  { id: "' + id + '", rooms: [\n' + rooms.map(fmt).join(',\n') + '\n  ] }').join(',\n') + '\n] };\n';
fs.writeFileSync('rooms.js', out); fs.writeFileSync('rooms.json', JSON.stringify(floors)); if(process.env.WRITE && (all || process.env.FORCE)){ fs.writeFileSync('' + __dirname + '/../../seseliu-dirbtuve/slepynes-kambariai.js', out); console.log('įrašyta'); } else console.log(all ? 'viskas gerai (neįrašyta)' : 'YRA BLOGŲ – neįrašyta');
