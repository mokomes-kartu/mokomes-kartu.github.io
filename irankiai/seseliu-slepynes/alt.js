/* Parodo, kaip kambarys įveikiamas be nurodyto veiksmo (palankiai): node alt.js <rinkinys> <nr.> <tipas> <i> */
const S = require('./solver.js'), L = S.L, H = require(process.argv[2] === 'b' ? './hand.js' : './hand' + process.argv[2] + '.js'), lv = H[+process.argv[3] - 1], t = process.argv[4], i = +process.argv[5];
const r = S.solveStatic(lv, { opt: true, plan: true, maxDepth: 30, maxStates: 8000, skip: a => a.type === t && a.i === i });
console.log(r.ok, r.states, r.plan && r.plan.map(p => (p.act ? p.act.type + p.act.i + (p.act.type === 'push' ? '(' + p.act.dc + ',' + p.act.dr + ')' : '') : 'durys') + ' [' + p.path.length + ': ' + p.path.filter((_, k, a) => k % Math.ceil(a.length / 6) === 0 || k === a.length - 1).map(q => q[0] + ',' + q[1]).join(' ') + ']').join('\n'));
