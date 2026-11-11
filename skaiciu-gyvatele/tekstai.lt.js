/* Skaičių gyvatėlė – visi mokiniui rodomi tekstai (lietuvių k.). Verčiant kopijuoti šį failą ir keisti tik tekstus. */
(function(){
"use strict";
const many = (n, one, few, lots) => { const d = n % 10, h = n % 100; return d === 1 && h !== 11 ? one : d >= 2 && (h < 10 || h >= 20) ? few : lots; };
const pts = n => `${n} ${many(n, "taškas", "taškai", "taškų")}`;
window.MK_T = {
  title: "Skaičių gyvatėlė",
  heroTitle: "Skaičių <em>gyvatėlė</em>",
  hero: "Vesk gyvatėlę per lauką ir rink tik taisyklę atitinkančius skaičius. Netinkamas skaičius ar siena atima gyvybę.",
  heroLabel: "Žaidimo laukas: žalia gyvatėlė šliaužia tarp skaičių.",
  note: "Valdymas: brauk pirštu, spausk rodykles ekrane arba klaviatūroje (tinka ir W, A, S, D). Rezultatai saugomi tik šiame įrenginyje.",
  levels: [
    { name: "Kartotiniai", sub: "Skaičių 2, 3, 4, 5, 6, 9 ir 10 kartotiniai" },
    { name: "Dalikliai", sub: "Surink visus skaičiaus daliklius" },
    { name: "Pirminiai skaičiai", sub: "Pirminis ar sudėtinis?" },
    { name: "Dalumo požymiai", sub: "Triženkliai skaičiai: ar dalijasi iš 2, 3, 5, 9, 10?" }
  ],
  record: n => `Rekordas: ${n}`,

  /* ---------- taisyklės ---------- */
  ruleLabel: "Taisyklė",
  rule: {
    mult: r => `Rink skaičiaus <b>${r.k}</b> kartotinius`,
    div: r => `Rink skaičiaus <b>${r.N}</b> daliklius`,
    prime: () => `Rink <b>pirminius</b> skaičius`,
    comp: () => `Rink <b>sudėtinius</b> skaičius`,
    dvs: r => `Rink skaičius, kurie dalijasi iš <b>${r.k}</b>`
  },

  /* ---------- žaidimo eiga ---------- */
  ready: "Pasiruošk!",
  newRule: "Nauja taisyklė!",
  go: "Pirmyn!",
  crashWall: "Atsitrenkei į sieną. Bandom iš vidurio!",
  crashSelf: "Gyvatėlė įkando sau. Bandom iš vidurio!",
  pause: "Pauzė",
  pauseBtn: "Pauzė",
  resume: "Tęsti",
  quit: "Baigti žaidimą",
  next: "Toliau →",
  results: "Rezultatai",
  points: "Taškai",
  livesLabel: n => `Gyvybių liko: ${n}`,
  pipsLabel: (n, t) => `Surinkta ${n} iš ${t}`,
  boardLabel: "Žaidimo laukas",
  dpad: { up: "Aukštyn", down: "Žemyn", left: "Kairėn", right: "Dešinėn" },
  keysHint: "Valdyk rodyklėmis arba W, A, S, D. Tarpas – pauzė.",

  /* ---------- paaiškinimai suvalgius netinkamą skaičių ---------- */
  wrongHead: n => `${n} – ne tas skaičius!`,
  hintSum: "Kaip atpažinti?",
  okOnField: list => `Lauke tinka: <b>${list.join(", ")}</b>.`,
  why: {
    mult: d => `<b>${d.n}</b> nėra skaičiaus ${d.k} kartotinis: ${d.n} : ${d.k} = ${d.q}, liek. ${d.r}.`,
    div: d => `<b>${d.n}</b> nėra skaičiaus ${d.N} daliklis: ${d.N} : ${d.n} = ${d.q}, liek. ${d.r}.`,
    divBig: d => `<b>${d.n}</b> didesnis už ${d.N}, todėl negali būti jo daliklis.`,
    prime: d => `<b>${d.n}</b> nėra pirminis skaičius: ${d.n} = ${d.a} · ${d.b}, taigi jis turi daugiau nei du daliklius.`,
    comp: d => `<b>${d.n}</b> nėra sudėtinis skaičius: jis dalijasi tik iš 1 ir iš ${d.n}, taigi yra pirminis.`,
    dvs2: d => `<b>${d.n}</b> baigiasi nelyginiu skaitmeniu ${d.last}, todėl nesidalija iš 2.`,
    dvs5: d => `<b>${d.n}</b> baigiasi skaitmeniu ${d.last}, o ne 0 ar 5, todėl nesidalija iš 5.`,
    dvs10: d => `<b>${d.n}</b> baigiasi skaitmeniu ${d.last}, o ne 0, todėl nesidalija iš 10.`,
    dvsS: d => `<b>${d.n}</b>: skaitmenų suma ${d.digits.join(" + ")} = ${d.s}. ${d.s} nesidalija iš ${d.k}, todėl ir ${d.n} nesidalija iš ${d.k}.`
  },
  hint: {
    mult: r => `Skaičiaus ${r.k} kartotiniai dalijasi iš ${r.k} be liekanos: ${r.k}, ${r.k * 2}, ${r.k * 3}, ${r.k * 4}…`,
    div: r => `Skaičiaus ${r.N} daliklis – skaičius, iš kurio ${r.N} dalijasi be liekanos.`,
    prime: () => `Pirminis skaičius turi lygiai du daliklius: 1 ir patį save (2, 3, 5, 7, 11…).`,
    comp: () => `Sudėtinis skaičius turi daugiau nei du daliklius, pvz., 6 = 2 · 3.`,
    dvs: r => ({
      2: "Iš 2 dalijasi skaičiai, kurie baigiasi 0, 2, 4, 6 arba 8.",
      3: "Iš 3 dalijasi skaičiai, kurių skaitmenų suma dalijasi iš 3.",
      5: "Iš 5 dalijasi skaičiai, kurie baigiasi 0 arba 5.",
      9: "Iš 9 dalijasi skaičiai, kurių skaitmenų suma dalijasi iš 9.",
      10: "Iš 10 dalijasi skaičiai, kurie baigiasi 0."
    })[r.k]
  },

  /* ---------- rezultatai ---------- */
  winTitle: "Raundas įveiktas!",
  loseTitle: "Gyvybės baigėsi",
  resPts: pts,
  resRec: n => `rekordas ${n}`,
  resNewRec: "naujas rekordas!",
  resGot: (n, t) => `Surinkta skaičių: ${n} iš ${t}.`,
  resCrash: n => `Atsitrenkta: ${n} ${many(n, "kartą", "kartus", "kartų")}.`,
  resErrs: "Suvalgyti netinkami skaičiai:",
  resClean: "Nė vieno netinkamo skaičiaus!",

  /* ---------- „Noriu pasimokyti“ ---------- */
  learn: [
    { name: "Kartotinis", level: 0, html: `<p>Skaičiaus <b>kartotinis</b> – skaičius, kuris iš jo dalijasi be liekanos. Kartotinius gauname daugindami skaičių iš 1, 2, 3, 4…</p>
      <span class="mk-ex">Skaičiaus 6 kartotiniai: 6, 12, 18, 24, 30, 36…</span>
      <p>Kaip patikrinti? Padalyk. 42 : 6 = 7 – liekanos nėra, vadinasi, 42 yra skaičiaus 6 kartotinis. 44 : 6 = 7, liek. 2 – ne kartotinis.</p>
      <p>Kartotinių yra be galo daug, o mažiausias kartotinis – pats skaičius.</p>` },
    { name: "Daliklis", level: 1, html: `<p>Skaičiaus <b>daliklis</b> – skaičius, iš kurio jis dalijasi be liekanos.</p>
      <span class="mk-ex">Skaičiaus 24 dalikliai: 1, 2, 3, 4, 6, 8, 12, 24</span>
      <p>Daliklius patogu ieškoti poromis: 1 · 24, 2 · 12, 3 · 8, 4 · 6.</p>
      <ul><li>1 yra kiekvieno skaičiaus daliklis.</li><li>Pats skaičius irgi yra savo daliklis.</li><li>Daliklis niekada nebūna didesnis už patį skaičių.</li></ul>` },
    { name: "Pirminiai ir sudėtiniai skaičiai", level: 2, html: `<p><b>Pirminis</b> skaičius turi lygiai du daliklius: 1 ir patį save.</p>
      <span class="mk-ex">Pirminiai iki 30: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29</span>
      <p><b>Sudėtinis</b> skaičius turi daugiau nei du daliklius, pvz., 15 = 3 · 5 (dalikliai: 1, 3, 5, 15).</p>
      <ul><li>Skaičius 1 nėra nei pirminis, nei sudėtinis – jis turi tik vieną daliklį.</li><li>2 – vienintelis lyginis pirminis skaičius.</li></ul>
      <p>Kaip patikrinti? Bandyk dalyti iš 2, 3, 5, 7. Pvz., 51 = 3 · 17 – sudėtinis, o 53 nesidalija nė iš vieno – pirminis.</p>` },
    { name: "Dalumo požymiai", level: 3, html: `<p>Dalumo požymiai leidžia nedalijant pasakyti, ar skaičius dalijasi be liekanos.</p>
      <ul><li><b>Iš 2</b> – paskutinis skaitmuo lyginis (0, 2, 4, 6, 8).</li><li><b>Iš 5</b> – paskutinis skaitmuo 0 arba 5.</li><li><b>Iš 10</b> – paskutinis skaitmuo 0.</li>
      <li><b>Iš 3</b> – skaitmenų suma dalijasi iš 3.</li><li><b>Iš 9</b> – skaitmenų suma dalijasi iš 9.</li></ul>
      <span class="mk-ex">738: 7 + 3 + 8 = 18. 18 dalijasi ir iš 3, ir iš 9 – vadinasi, 738 taip pat.</span>
      <span class="mk-ex">472: 4 + 7 + 2 = 13. 13 nesidalija iš 3 – vadinasi, 472 nesidalija nei iš 3, nei iš 9.</span>` }
  ]
};
})();
