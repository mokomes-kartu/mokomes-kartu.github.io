/* Kraujo kelias – kraujotakos žemėlapis (kryptinis grafas), iškvietimų katalogas ir budėjimų sudarymas.
   Tekstų čia nėra: pavadinimai imami iš tekstai.lt.js pagal raktus. Veikia ir naršyklėje, ir Node (patikroms). */
(function(root){
"use strict";
/* Kraujagyslės: [id, iš, į, taškai, rūšis (h širdis, a arterija, v vena, c kapiliarai), deguonis (1 daug, 0 mažai), pavadinimų raktai, papildomai] */
const RAW = [
  ["h1","RA","RV",[[410,600],[418,668],[430,735]],"h",0,["ra"],{valve:[418,668,"av","tv"]}],
  ["h2","RV","PT",[[430,735],[478,690],[490,610],[490,500]],"h",0,["rv"],{valve:[490,575,"sl","pv"]}],
  ["h3","LA","LV",[[600,600],[594,668],[585,735]],"h",1,["la"],{valve:[594,668,"av","mv"]}],
  ["h4","LV","AR1",[[585,735],[545,690],[535,610],[535,440]],"h",1,["lv","aorta"],{valve:[535,575,"sl","aov"]}],
  ["pa1","PT","LRa",[[490,500],[420,470],[340,480],[290,540]],"a",0,["pa_R"]],
  ["pb1","LRa","LRv",[[290,540],[245,580],[232,630],[255,680],[310,690]],"c",0,[],{site:"LR"}],
  ["pv1","LRv","LA",[[310,690],[350,660],[400,625],[500,606],[600,600]],"v",1,["pvn"],{behind:1}],
  ["pa2","PT","LLa",[[490,500],[580,468],[660,480],[710,540]],"a",0,["pa_L"]],
  ["pb2","LLa","LLv",[[710,540],[755,580],[768,630],[745,680],[690,690]],"c",0,[],{site:"LL"}],
  ["pv2","LLv","LA",[[690,690],[665,662],[632,628],[600,600]],"v",1,["pvn"]],
  ["a1","AR1","AR2",[[535,440],[585,425],[640,440]],"a",1,["aorta"]],
  ["a2","AR1","HN",[[535,440],[540,380],[548,300]],"a",1,["car"]],
  ["a3","AR1","ARa",[[535,440],[470,415],[330,395],[215,405],[150,560],[110,760],[92,930]],"a",1,["arm_aR"]],
  ["b_ar","ARa","ARv",[[92,930],[88,1010],[108,1060],[132,1010],[132,930]],"c",1,[],{site:"AR"}],
  ["v_ar","ARv","VC1",[[132,930],[150,760],[190,560],[250,445],[360,440],[440,440]],"v",0,["arm_vR"]],
  ["a4","AR2","ALa",[[640,440],[700,405],[785,405],[850,560],[890,760],[908,930]],"a",1,["arm_aL"]],
  ["b_al","ALa","ALv",[[908,930],[912,1010],[892,1060],[868,1010],[868,930]],"c",1,[],{site:"AL"}],
  ["v_al","ALv","VJ",[[868,930],[850,760],[810,560],[750,450],[660,400],[600,372],[500,368],[455,380]],"v",0,["arm_vL"]],
  ["a5","AR2","D1",[[640,440],[652,520],[645,650],[615,800],[565,890],[540,930]],"a",1,["aorta"],{behind:1}],
  ["a_br","HN","BRa",[[548,300],[558,210]],"a",1,["car"]],
  ["b_br","BRa","BRv",[[558,210],[545,120],[500,85],[455,120],[442,210]],"c",1,[],{site:"BR"}],
  ["v_br","BRv","HV",[[442,210],[452,300]],"v",0,["jug"]],
  ["b_th","HN","HV",[[548,300],[524,326],[476,326],[452,300]],"c",1,[],{site:"TH"}],
  ["v_h","HV","VJ",[[452,300],[455,380]],"v",0,["jug"]],
  ["v_s1","VJ","VC1",[[455,380],[440,440]],"v",0,["svc"]],
  ["v_s2","VC1","RA",[[440,440],[425,520],[410,600]],"v",0,["svc"]],
  ["a_li","D1","LIV",[[540,930],[495,918],[430,935],[370,960]],"a",1,["hep_a"]],
  ["a_st","D1","STa",[[540,930],[600,925],[660,945]],"a",1,["st_a"]],
  ["a6","D1","D2",[[540,930],[540,1130]],"a",1,["aorta"]],
  ["b_st","STa","STv",[[660,945],[715,975],[715,1030],[665,1050]],"c",1,[],{site:"ST"}],
  ["v_st","STv","P2",[[665,1050],[600,1075],[520,1088],[500,1090]],"v",0,["st_v"]],
  ["a_pa","D2","PAa",[[540,1130],[590,1140],[630,1150]],"a",1,["pa_a"]],
  ["a7","D2","D3",[[540,1130],[540,1260]],"a",1,["aorta"]],
  ["b_pa","PAa","PAv",[[630,1150],[690,1165],[700,1205],[650,1215]],"c",1,[],{site:"PA"}],
  ["v_pa","PAv","P1",[[650,1215],[590,1200],[520,1188],[500,1185]],"v",0,["pa_v"]],
  ["a_kr","D3","KRa",[[540,1260],[480,1240],[410,1212],[370,1200]],"a",1,["ren_aR"]],
  ["a_kl","D3","KLa",[[540,1260],[610,1275],[670,1290]],"a",1,["ren_aL"]],
  ["a8","D3","D5",[[540,1260],[540,1400]],"a",1,["aorta"]],
  ["b_kr","KRa","KRv",[[370,1200],[325,1192],[305,1240],[335,1278]],"c",1,[],{site:"KR"}],
  ["v_kr","KRv","VK",[[335,1278],[395,1308],[460,1325]],"v",0,["ren_vR"]],
  ["b_kl","KLa","KLv",[[670,1290],[715,1298],[728,1345],[690,1372]],"c",1,[],{site:"KL"}],
  ["v_kl","KLv","VK",[[690,1372],[610,1362],[520,1345],[460,1325]],"v",0,["ren_vL"]],
  ["a_in","D5","INa",[[540,1400],[590,1405],[610,1450],[585,1480]],"a",1,["in_a"]],
  ["a9","D5","D6",[[540,1400],[540,1600]],"a",1,["aorta"]],
  ["b_in","INa","INv",[[585,1480],[580,1550],[520,1590],[470,1550],[480,1480]],"c",1,[],{site:"IN"}],
  ["v_in","INv","P0",[[480,1480],[500,1440],[500,1420]],"v",0,["in_v"]],
  ["p01","P0","P1",[[500,1420],[500,1185]],"v",0,["portal"]],
  ["p12","P1","P2",[[500,1185],[500,1090]],"v",0,["portal"]],
  ["p2l","P2","LIV",[[500,1090],[480,1040],[430,1000],[370,960]],"v",0,["portal"]],
  ["b_li","LIV","LIVv",[[370,960],[310,960],[280,1010],[310,1060],[380,1075]],"c",1,[],{site:"LI"}],
  ["v_li","LIVv","VL",[[380,1075],[420,1078],[460,1075]],"v",0,["hep_v"]],
  ["a_gr","D6","GRa",[[540,1600],[470,1612],[395,1665],[372,1800],[375,1900]],"a",1,["leg_aR"]],
  ["a_gl","D6","GLa",[[540,1600],[600,1650],[625,1800],[620,1900]],"a",1,["leg_aL"]],
  ["b_gr","GRa","GRv",[[375,1900],[380,1950],[410,1975],[430,1945],[425,1900]],"c",1,[],{site:"GR"}],
  ["v_gr","GRv","V0",[[425,1900],[425,1800],[445,1700],[460,1640]],"v",0,["leg_vR"]],
  ["b_gl","GLa","GLv",[[620,1900],[615,1950],[590,1975],[568,1945],[572,1900]],"c",1,[],{site:"GL"}],
  ["v_gl","GLv","V0",[[572,1900],[570,1800],[520,1690],[460,1640]],"v",0,["leg_vL"]],
  ["i1","V0","VK",[[460,1640],[460,1325]],"v",0,["ivc"]],
  ["i2","VK","VL",[[460,1325],[460,1075]],"v",0,["ivc"]],
  ["i3","VL","RA",[[460,1075],[460,900],[385,850],[352,760],[365,660],[410,600]],"v",0,["ivc"]]
];
const SITES = ["BR","TH","AR","AL","LI","ST","PA","IN","KR","KL","GR","GL","LR","LL"];
const LUNGS = ["pb1","pb2"];

/* Catmull-Rom glotninimas → tankūs taškai kas ~6 vienetus */
function sample(p){
  const out = []; const n = p.length;
  for(let i = 0; i < n - 1; i++){
    const p0 = p[Math.max(0,i-1)], p1 = p[i], p2 = p[i+1], p3 = p[Math.min(n-1,i+2)];
    const d = Math.hypot(p2[0]-p1[0], p2[1]-p1[1]), k = Math.max(2, Math.round(d/6));
    for(let j = 0; j < k; j++){
      const t = j/k, t2 = t*t, t3 = t2*t;
      out.push([0.5*((2*p1[0])+(-p0[0]+p2[0])*t+(2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*t2+(-p0[0]+3*p1[0]-3*p2[0]+p3[0])*t3),
                0.5*((2*p1[1])+(-p0[1]+p2[1])*t+(2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*t2+(-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t3)]);
    }
  }
  out.push(p[n-1].slice()); return out;
}
const E = {}, EL = [], OUT = {}, NODE = {};
RAW.forEach(r => {
  const e = { id:r[0], from:r[1], to:r[2], raw:r[3], kind:r[4], oxy:r[5], nm:r[6] };
  Object.assign(e, r[7] || {});
  e.pts = sample(e.raw); e.cum = [0];
  for(let i = 1; i < e.pts.length; i++) e.cum.push(e.cum[i-1] + Math.hypot(e.pts[i][0]-e.pts[i-1][0], e.pts[i][1]-e.pts[i-1][1]));
  e.len = e.cum[e.cum.length-1];
  if(e.valve){ let b = 0, bd = 1e9; e.pts.forEach((q,i) => { const d = Math.hypot(q[0]-e.valve[0], q[1]-e.valve[1]); if(d < bd){ bd = d; b = i; } }); e.valveS = e.cum[b]; }
  E[e.id] = e; EL.push(e); (OUT[e.from] = OUT[e.from] || []).push(e);
  NODE[e.from] = e.raw[0]; NODE[e.to] = e.raw[e.raw.length-1];
});
function at(e, s){
  s = Math.max(0, Math.min(e.len, s)); let lo = 0, hi = e.cum.length - 1;
  while(hi - lo > 1){ const m = (lo+hi) >> 1; if(e.cum[m] <= s) lo = m; else hi = m; }
  const a = e.pts[lo], b = e.pts[hi], f = (s - e.cum[lo]) / ((e.cum[hi] - e.cum[lo]) || 1), dx = b[0]-a[0], dy = b[1]-a[1], l = Math.hypot(dx,dy) || 1;
  return { x:a[0]+dx*f, y:a[1]+dy*f, tx:dx/l, ty:dy/l };
}
EL.forEach(e => { const p = at(e, Math.min(48, e.len)), o = e.pts[0], l = Math.hypot(p.x-o[0], p.y-o[1]) || 1; e.dir = [(p.x-o[0])/l, (p.y-o[1])/l]; });
const bedOf = {}; EL.forEach(e => { if(e.site) bedOf[e.site] = e.id; });

/* Trumpiausias atstumas nuo kiekvieno mazgo iki bet kurios tikslo kraujagyslės pradžios (kryptinis grafas) */
function distTo(goal, block){
  const G = {}; goal.forEach(g => G[g] = 1); const d = {}; Object.keys(NODE).forEach(n => d[n] = Infinity);
  for(let it = 0; it < 80; it++){ let ch = false;
    EL.forEach(e => { if(e.id === block) return; const c = G[e.id] ? 0 : e.len + d[e.to]; if(c < d[e.from] - 1e-6){ d[e.from] = c; ch = true; } });
    if(!ch) break; }
  return d;
}
function costVia(e, goal, d){ return goal.indexOf(e.id) >= 0 ? 0 : e.len + d[e.to]; }
/* Trumpiausias kelias (kraujagyslių id sąrašas) nuo mazgo iki tikslo kraujagyslės imtinai */
function pathFrom(node, goal){
  const d = distTo(goal), path = []; let n = node, guard = 0;
  while(guard++ < 80){
    const outs = OUT[n]; let best = null, bc = Infinity;
    outs.forEach(e => { const c = costVia(e, goal, d); if(c < bc){ bc = c; best = e; } });
    path.push(best.id); if(goal.indexOf(best.id) >= 0) break; n = best.to;
  }
  return path;
}

/* ---------- iškvietimai ---------- */
/* tipas, nešėjas (E eritrocitas, P plazma, L leukocitas, T trombocitas), start – kur prasideda, steps – tikslai */
const CALLS = [];
function add(type, car, key, o){ CALLS.push(Object.assign({ id:type + "_" + key, type, car, place:key }, o)); }
["BR","TH","AR","AL","LI","ST","PA","IN","KR","KL","GR","GL"].forEach(s => add("o2","E",s,{ steps:[{ edges:[bedOf[s]], needOxy:1 }] }));
["BR","AR","AL","LI","ST","IN","KR","GR","GL"].forEach(s => add("co2","E",s,{ steps:[{ edges:[bedOf[s]] },{ edges:LUNGS }] }));
["GR","GL","AR"].forEach(s => add("sprint","E",s,{ fast:1, steps:[{ edges:[bedOf[s]], needOxy:1 },{ edges:[bedOf[s]], needOxy:1 }] }));
["BR","GR","AL","LI","AR"].forEach(s => add("glu","P",s,{ start:["b_in",0.55], steps:[{ edges:[bedOf[s]] }] }));
["LI","GR"].forEach(s => add("ins","P",s,{ start:["b_pa",0.55], steps:[{ edges:[bedOf[s]] }] }));
["GR","AL","LI"].forEach(s => add("waste","P",s,{ start:[bedOf[s],0.55], steps:[{ edges:[bedOf.KR, bedOf.KL] }] }));
add("water","P","IN",{ start:["b_in",0.55], steps:[{ edges:[bedOf.KR, bedOf.KL] }] });
["BR","TH","GL","KR"].forEach(s => add("tab","P",s,{ start:["b_in",0.55], steps:[{ edges:[bedOf[s]] }] }));
[["AR","TH"],["AR","GR"],["AL","KL"],["AL","BR"],["AR","LL"]].forEach(p => add("inj","P",p[1],{ from:p[0], start:[p[0] === "AR" ? "v_ar" : "v_al",0.12], steps:[{ edges:[bedOf[p[1]]] }] }));
["TH","AR","GL","LR","LL","IN","KR"].forEach(s => add("inf","L",s,{ scene:"phago", steps:[{ edges:[bedOf[s]] }] }));
["AR","AL","GR","GL"].forEach(s => add("wound","T",s,{ scene:"plug", steps:[{ edges:[bedOf[s]] }] }));
const TOUR = { id:"tour_0", type:"tour", car:"E", place:"LA", steps:[{ edges:LUNGS },{ edges:["h3"] }] };

/* Budėjimai: kiek iškvietimų ir iš kokių tipų grupių (kiekviena grupė duoda vieną iškvietimą) */
const SHIFTS = [
  { id:"b1", groups:[["tour"],["o2"],["co2"]], easy:1, hints:1, pick:0 },
  { id:"b2", groups:[["o2","co2"],["inf"],["wound"],["glu"],["sprint"]], easy:1, hints:0, pick:1 },
  { id:"b3", groups:[["glu"],["ins"],["waste","water"],["tab"],["inj"]], easy:1, hints:0, pick:1, plan:1 },
  { id:"b4", n:6, any:1, easy:0, hints:0, pick:1, plan:1 },
  { id:"b5", n:8, any:1, easy:0, hints:0, pick:1, plan:1, exam:1 }
];
const TYPES = ["o2","co2","sprint","glu","ins","waste","water","tab","inj","inf","wound"];
function shuffle(a, rnd){ a = a.slice(); for(let i = a.length-1; i > 0; i--){ const j = Math.floor(rnd()*(i+1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
/* Raunde nesikartoja nei tipas, nei vieta; pirmiausia imami dar nematyti iškvietimai */
function makeShift(sh, seen, rnd){
  rnd = rnd || Math.random; seen = seen || {};
  for(let tries = 0; tries < 200; tries++){
    let types;
    if(sh.any) types = shuffle(TYPES, rnd).slice(0, sh.n);
    else types = sh.groups.map(g => g[Math.floor(rnd()*g.length)]);
    const used = {}, res = []; let ok = true;
    for(const t of types){
      if(t === "tour"){ res.push(TOUR); continue; }
      let c = shuffle(CALLS.filter(x => x.type === t && !used[x.place] && !(x.from && used[x.from])), rnd);
      const fresh = c.filter(x => !seen[x.id]); if(fresh.length) c = fresh;
      if(!c.length){ ok = false; break; }
      res.push(c[0]); used[c[0].place] = 1;
    }
    if(ok) return sh.any ? res : res;
  }
  throw new Error("makeShift");
}
const api = { E, EL, OUT, NODE, SITES, LUNGS, bedOf, at, distTo, costVia, pathFrom, CALLS, TOUR, SHIFTS, TYPES, makeShift };
if(typeof module !== "undefined" && module.exports) module.exports = api; else root.MK_KK = api;
})(typeof window !== "undefined" ? window : globalThis);
