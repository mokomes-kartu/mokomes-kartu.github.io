/* Bebro sklypai – visi mokiniui rodomi tekstai (lietuvių k.). Verčiant keisti tik šį failą.
   Terminai – pagal Matematikos bendrąją programą (3 kl.: „Apibrėžiami ploto matavimo vienetai kvadratiniu centimetru (cm2),
   kvadratiniu metru (m2).“, „Praktikuojamasi apskaičiuoti kvadrato, stačiakampio plotą.“, „…ir plotą figūros, sudarytos iš kelių
   stačiakampių/kvadratų.“, „Išsiaiškinama, kaip nubraižyti nurodyto ploto stačiakampį.“; 4 kl.: „Mokomasi apskaičiuoti kvadrato,
   stačiakampio plotą ir iš kvadratų bei stačiakampių sudarytų figūrų plotus.“). */
(function(){
"use strict";
const lg = n => { const a = Math.abs(n); return a % 10 === 1 && a % 100 !== 11 ? "langelis" : (a % 10 >= 2 && (a % 100 < 10 || a % 100 >= 20)) ? "langeliai" : "langelių"; };
const lgA = n => { const a = Math.abs(n); return a % 10 === 1 && a % 100 !== 11 ? "langelį" : (a % 10 >= 2 && (a % 100 < 10 || a % 100 >= 20)) ? "langelius" : "langelių"; };
const u2 = u => u + "²";
window.MK_T = {
  title: "Bebro sklypai",
  heroA: "Bebro", heroB: "sklypai",
  hero: "Bebras Rimas dalija žemę sklypais. Skaičiuok plotą, braižyk lysves ir tvorų linijomis padalyk lauką į sklypus – kiekviename turi būti vienas skaičius, lygus sklypo plotui.",
  levels: [
    ["Kiek ploto?", "3 kl. · stačiakampio ir kvadrato plotas"],
    ["Nubraižyk lysvę", "3 kl. · nurodyto ploto stačiakampis"],
    ["Sklypų galvosūkis", "3 kl. · padalyk lauką į sklypus"],
    ["Sudėtinės figūros", "4 kl. · figūros iš kelių stačiakampių"],
    ["Didysis laukas", "4 kl. · didesni sklypų galvosūkiai"],
    ["Bebro egzaminas", "3–4 kl. · visos temos kartu · 10 užduočių"]
  ],
  colH: "Bebro kaimas",
  colP: (n, got, all, rank) => got >= all ? `Visas kaimas sužaliavo (${all} sklypų). Tavo laipsnis – ${rank}!` : `Užduočių iš pirmo karto: ${n}. Pasodinta sklypų: ${got} iš ${all} (kas 3 užduotys – naujas sklypas). Laipsnis: ${rank}.`,
  ranks: ["Padėjėjas", "Sodininkas", "Matininkas", "Architektas", "Bebras statytojas"],
  pts: "Taškai", next: "Toliau →", finish: "Baigti", rule: "Taisyklė",
  bad: a => `Ne visai. Teisingas atsakymas: ${a}`, badPlain: "Ne visai.",
  res: (ok, total, pts, gain) => `Iš pirmo karto: ${ok} iš ${total}. Taškai: ${pts}.` + (gain ? `<br><b>Kaime pasodinta naujų sklypų: ${gain}.</b>` : ""),
  unitName: { cm: "cm²", m: "m²" },
  cells: lg, cellsA: lgA,

  /* ---------- „Kiek ploto?“ ---------- */
  items: [
    ["Daržo lysvė", "lysvės", "m"], ["Bebro kiemas", "kiemo", "m"], ["Žaidimų aikštelė", "aikštelės", "m"], ["Sodo veja", "vejos", "m"],
    ["Gėlių darželis", "darželio", "m"], ["Bebro svetainė", "svetainės", "m"], ["Mokyklos kiemas", "kiemo", "m"], ["Obelų sodas", "sodo", "m"],
    ["Piešimo kortelė", "kortelės", "cm"], ["Atvirukas", "atviruko", "cm"], ["Plytelė", "plytelės", "cm"], ["Knygos viršelis", "viršelio", "cm"],
    ["Dailės kartonas", "kartono", "cm"], ["Lipdukas", "lipduko", "cm"]
  ],
  q1: {
    cells: (a, b) => `Bebras sudėjo lysvę iš langelių: ${b} eilutės po ${a} ${lg(a)}. Kiek langelių sudaro lysvę? (Kiekvienas langelis – 1 m².)`,
    gridCount: "Kiek langelių sudaro šį stačiakampį? Kiekvienas langelis – 1 m².",
    rect: (it, a, b, u) => `${it[0]} yra stačiakampio formos: ilgis ${a} ${u}, plotis ${b} ${u}. Koks ${it[1]} plotas?`,
    square: (it, a, u) => `${it[0]} yra kvadrato formos, jo kraštinė ${a} ${u}. Koks ${it[1]} plotas?`,
    rev: (it, A, a, u) => `${it[0]} yra stačiakampio formos. Jos plotas ${A} ${u}², ilgis ${a} ${u}. Koks plotis?`,
    revSq: (A) => `Kvadrato plotas ${A} cm². Kokia kvadrato kraštinė?`,
    cmp: (n1, n2) => `Kuris sklypas didesnis?`,
    tiles: (a, b) => `Bebras klijuoja plyteles ant grindų: grindys ${a} m ilgio ir ${b} m pločio. Kiekviena plytelė dengia 1 m². Kiek plytelių reikės?`,
    unit: q => q,
    unitQ: "Kokiais vienetais geriausia matuoti šį plotą?",
    cmpOpt: (n) => n, same: "Lygūs"
  },
  unitItems: [
    ["Sąsiuvinio lapo plotas", "cm"], ["Futbolo aikštės plotas", "m"], ["Pašto ženklo plotas", "cm"], ["Klasės grindų plotas", "m"],
    ["Atviruko plotas", "cm"], ["Mokyklos kiemo plotas", "m"], ["Segtuko viršelio plotas", "cm"], ["Daržo plotas", "m"],
    ["Bilieto plotas", "cm"], ["Tvenkinio plotas", "m"], ["Plokštelės (pvz., sagos) plotas", "cm"], ["Sporto salės grindų plotas", "m"]
  ],
  unitOpts: ["cm²", "m²"],
  w1: {
    cells: (a, b, A) => `Langelių yra ${b} eilutės po ${a}. ${a} × ${b} = ${A}. Tiek langelių ir vadinama plotu: ${A} ${lg(A)}.`,
    rect: (a, b, A, u) => `Stačiakampio plotas = ilgis × plotis: ${a} × ${b} = ${A} ${u}².`,
    square: (a, A, u) => `Kvadrato abi kraštinės vienodos, todėl plotas = kraštinė × kraštinė: ${a} × ${a} = ${A} ${u}².`,
    rev: (A, a, b, u) => `Žinome plotą ir vieną kraštinę, ieškome kitos: ${A} : ${a} = ${b}. Patikrinam: ${a} × ${b} = ${A}.`,
    revSq: (A, a) => `Kvadrato plotas = kraštinė × kraštinė. Kokį skaičių padauginus iš savęs gauname ${A}? ${a} × ${a} = ${A}, todėl kraštinė ${a} cm.`,
    cmp: (A, B, a, b, c, d) => A === B ? `Abu sklypai vienodo ploto: ${a} × ${b} = ${A} ir ${c} × ${d} = ${B}. Skirtingos formos stačiakampiai gali turėti vienodą plotą.` : `Pirmo sklypo plotas ${a} × ${b} = ${A}, antro – ${c} × ${d} = ${B}. ${A > B ? "Didesnis pirmas" : "Didesnis antras"}.`,
    tiles: (a, b, A) => `Kiek plytelių telpa, tiek ir ploto: ${a} × ${b} = ${A} m², todėl reikia ${A} plytelių.`,
    unit: (cm) => cm ? `Mažus daiktus matuojame kvadratiniais centimetrais (cm²): tai kvadratėlis, kurio kraštinė 1 cm.` : `Dideles vietas matuojame kvadratiniais metrais (m²): tai kvadratas, kurio kraštinė 1 m.`,
    more: "Kvadratinis centimetras (cm²) – kvadratas, kurio kraštinė 1 cm. Kvadratinis metras (m²) – kvadratas, kurio kraštinė 1 m."
  },

  /* ---------- „Nubraižyk lysvę“ ---------- */
  q2: {
    free: A => `Nubraižyk lysvę, kurios plotas ${A} ${lg(A)} (stačiakampis). Tempk pirštu arba pele per laukelius.`,
    anchor: A => `Nubraižyk lysvę, kurios plotas ${A} ${lg(A)}. Lysvėje turi būti bebro vėliavėlė. Tempk pirštu arba pele.`,
    width: (A, w) => `Nubraižyk lysvę, kurios plotas ${A} ${lg(A)} ir plotis ${w} ${lg(w)} (stulpelių). Tempk pirštu arba pele.`,
    square: A => `Nubraižyk kvadratinę lysvę, kurios plotas ${A} ${lg(A)}. Tempk pirštu arba pele.`,
    two: (A, B) => `Nubraižyk dvi lysves, kurios nesiliestų: pirma – ${A} ${lg(A)}, antra – ${B} ${lg(B)}. Pradėk nuo pirmos.`,
    twoSecond: (B) => `Dabar nubraižyk antrą lysvę – ${B} ${lg(B)}.`
  },
  hint2: "Tempk nuo vieno kampo iki priešingo. Stačiakampio plotas = ilgis × plotis.",
  f2: {
    wrongArea: (w, h, a, A) => `Tavo lysvė ${w} × ${h} = ${a} ${lg(a)}. Reikia ${A}.`,
    blocked: "Lysvėje negali būti medžių ar akmenų.",
    noFlag: "Lysvėje turi būti bebro vėliavėlė.",
    width: w => `Lysvės plotis turi būti ${w} ${lg(w)}.`,
    notSq: "Kvadrato kraštinės vienodos.",
    overlap: "Lysvės persidengia – antra turi būti kitoje vietoje."
  },
  w2: {
    pairs: (A, list) => `Plotas ${A} gali būti sudarytas taip: ${list}. Stačiakampio plotas = ilgis × plotis.`,
    sq: (A, a) => `Kvadrato plotas ${A} = ${a} × ${a}.`
  },
  fail2: "Pelėdžiukas parodo, kuris sklypas tiktų:",

  /* ---------- sklypų galvosūkis ---------- */
  q3: {
    intro: (n, nPl) => `Tvorų linijomis padalyk lauką į ${nPl} stačiakampių sklypų. Kiekviename sklype turi būti vienas skaičius, ir jis lygus sklypo plotui. Tempk pirštu nuo vieno kampo iki kito.`,
    help: "Tempk per laukelius – pamatysi sklypo matmenis. Bakstelėk sklypą, kad jį pašalintum.",
    dims: (w, h) => `${w} × ${h}`,
    check: "Patikrinti", undo: "Atšaukti", reset: "Pradėti iš naujo", hint: "Užuomina",
    bad0: "Šiame sklype nėra skaičiaus. Kiekviename sklype turi būti vienas skaičius.",
    bad2: "Šiame sklype per daug skaičių. Turi būti tik vienas.",
    badA: (w, h, a, N) => `Šis sklypas ${w} × ${h} = ${a} ${lg(a)}, o skaičius sako ${N}.`,
    open: n => `Dar neuždengta langelių: ${n}.`,
    solved: "Visi sklypai sudėti!",
    hinted: "Pelėdžiukas parodė vieną sklypą.",
    noHint: "Visi sklypai jau sudėti teisingai!",
    wrongPlots: "Kai kurie sklypai neteisingi – paspausk „Pradėti iš naujo“ arba pašalink netinkamus (bakstelėk)."
  },
  w3: (list) => `Kiekvieno sklypo plotas lygus ilgis × plotis: ${list}. Taip ir surandame stačiakampį, kurio plotas sutampa su skaičiumi.`,
  w3more: "Patarimas: pradėk nuo didžiausio skaičiaus arba nuo skaičiaus, kuris turi tik vieną vietą, kur tilptų. Langeliai prie kampų ir kraštų dažnai turi tik vieną galimą sklypą.",

  /* ---------- sudėtinės figūros ---------- */
  q4: {
    comp: (it, u) => `${it[0]} turi tokią formą (matmenys ${u}). Koks ${it[1]} plotas?`,
    compPlain: u => `Sodininkas Rimas nubraižė lauko planą (matmenys ${u}). Koks lauko plotas?`,
    frame: (it, u) => `Aplink tvenkinį yra takelis. Išorinis stačiakampis ir tvenkinys parodyti brėžinyje (matmenys ${u}). Koks paties takelio plotas?`,
    big: (it, a, b, u) => `${it[0]} yra stačiakampio formos: ilgis ${a} ${u}, plotis ${b} ${u}. Koks ${it[1]} plotas?`,
    cmp: "Kuri figūra didesnio ploto?",
    figA: "A figūra", figB: "B figūra", same: "Lygios",
    two: (it1, it2, u) => `Bebras turi du sklypus (matmenys ${u}). Kuris didesnis?`,
    cover: (a, b, u) => `Bebras nori uždengti visą figūrą kvadratinėmis plytelėmis, kurių kiekviena dengia 1 ${u}². Kiek plytelių reikės? (Matmenys ${u}.)`
  },
  w4: {
    cut: (W, H, cuts, u, A) => `Įsivaizduok didelį stačiakampį ${W} × ${H} = ${W * H} ${u}². ${cuts.length > 1 ? "Atimk išpjautas dalis" : "Atimk išpjautą dalį"}: ${cuts.map(c => `${c[0]} × ${c[1]} = ${c[0] * c[1]}`).join(" ir ")}. ${W * H} − ${cuts.reduce((s, c) => s + c[0] * c[1], 0)} = ${A} ${u}².`,
    parts: (parts, u, A) => `Arba padalink figūrą į stačiakampius: ${parts.map(p => `${p[0]} × ${p[1]} = ${p[0] * p[1]}`).join(", ")}. Sudėk: ${parts.map(p => p[0] * p[1]).join(" + ")} = ${A} ${u}².`,
    frame: (W, H, w, h, u, A) => `Visas stačiakampis: ${W} × ${H} = ${W * H} ${u}². Tvenkinys: ${w} × ${h} = ${w * h} ${u}². Takelio plotas = ${W * H} − ${w * h} = ${A} ${u}².`,
    big: (a, b, A, u) => `Plotas = ilgis × plotis: ${a} × ${b} = ${A} ${u}². (Dauginant iš dviženklio skaičiaus, daugink stulpeliu.)`,
    cmp: (A, B) => A === B ? `Abi figūros vienodo ploto: ${A} ir ${B}.` : `A figūros plotas ${A}, B figūros – ${B}. ${A > B ? "A didesnė" : "B didesnė"}.`,
    cover: (A, u) => `Kiek kvadratinių vienetų telpa, tiek ir plytelių: ${A}.`,
    hid: (expr, val, u) => `Kraštinę „?“ rasime iš priešingos pusės kraštinių: ${expr} = ${val} ${u}.`
  },
  w4more: "Sudėtinės figūros plotą galima rasti dviem būdais: padalink ją į stačiakampius ir sudėk jų plotus, arba pridėk trūkstamą dalį iki didelio stačiakampio ir atimk ją.",

  /* ---------- pasimokyti ---------- */
  learn: [
    { name: "Kas yra plotas?", level: 0, html: `<p>Plotas rodo, kiek vietos užima figūra. Jį matuojame kvadratėliais.</p>
      <p><b>1 cm²</b> (kvadratinis centimetras) – kvadratas, kurio kraštinė 1 cm. Juo matuojame mažus daiktus: atviruką, lipduką.</p>
      <p><b>1 m²</b> (kvadratinis metras) – kvadratas, kurio kraštinė 1 m. Juo matuojame didesnes vietas: kiemą, grindis, lauką.</p>
      <span class="mk-ex">Jei figūrą dengia 12 vienodų kvadratėlių, jos plotas 12 kvadratinių vienetų.</span>` },
    { name: "Stačiakampio ir kvadrato plotas", level: 0, html: `<p>Stačiakampį galima padalyti į eilutes ir stulpelius. Langelių skaičius = eilučių skaičius × langelių eilutėje.</p>
      <p><b>Stačiakampio plotas = ilgis × plotis.</b></p>
      <span class="mk-ex">Ilgis 6 m, plotis 4 m → 6 × 4 = 24 m².</span>
      <p>Kvadrato kraštinės vienodos, todėl <b>kvadrato plotas = kraštinė × kraštinė</b>.</p>
      <span class="mk-ex">Kraštinė 5 cm → 5 × 5 = 25 cm².</span>` },
    { name: "Nežinomas ilgis arba plotis", level: 0, html: `<p>Jei žinome plotą ir vieną kraštinę, kitą randame dalyba.</p>
      <span class="mk-ex">Plotas 24 m², ilgis 6 m → plotis 24 : 6 = 4 m, nes 6 × 4 = 24.</span>
      <p>Tokį patį plotą gali turėti skirtingi stačiakampiai: 12 = 1 × 12 = 2 × 6 = 3 × 4.</p>` },
    { name: "Kaip nubraižyti nurodyto ploto stačiakampį?", level: 1, html: `<p>Pagalvok apie daugybos lentelę: kokie du skaičiai, sudauginti, duoda reikiamą plotą?</p>
      <span class="mk-ex">Reikia 8 langelių: 1 × 8, 2 × 4, 4 × 2 arba 8 × 1.</span>
      <p>Tada patikrink, ar tokia lysvė telpa laukelyje ir ar joje nėra medžių ar akmenų.</p>` },
    { name: "Sklypų galvosūkis: kaip spręsti?", level: 2, html: `<p>Kiekvieną skaičių reikia „apjuosti“ stačiakampiu, kurio plotas lygus tam skaičiui. Sklypai neturi persidengti ir turi uždengti visą lauką.</p>
      <ul><li>Skaičiuok galimus stačiakampius: 6 = 1 × 6 = 2 × 3 (ir atvirkščiai).</li>
      <li>Pradėk nuo skaičių, kurie turi mažai vietos: kampuose, prie kraštų, šalia kitų skaičių.</li>
      <li>Jei langelis galėtų priklausyti tik vienam sklypui – dėk jį iš karto.</li>
      <li>Klaidą pataisyti galima: bakstelėk sklypą ir jis pasišalins.</li></ul>` },
    { name: "Figūros iš kelių stačiakampių", level: 3, html: `<p>Sudėtingos figūros plotą randame dviem būdais.</p>
      <p><b>1) Padalink į stačiakampius</b> ir sudėk jų plotus.</p>
      <span class="mk-ex">L formos sodas: 5 × 2 = 10 ir 3 × 4 = 12. Iš viso 10 + 12 = 22 m².</span>
      <p><b>2) Papildyk iki didelio stačiakampio</b> ir atimk išpjautą dalį.</p>
      <span class="mk-ex">Didelis 8 × 6 = 48 m², išpjova 3 × 2 = 6 m². 48 − 6 = 42 m².</span>` }
  ],
  learnHeroNote: ""
};
})();
