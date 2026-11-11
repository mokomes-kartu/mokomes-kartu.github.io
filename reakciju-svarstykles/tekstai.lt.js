/* Reakcijų svarstyklės – visi mokiniui rodomi tekstai (lietuvių k.).
   Verčiant į kitą kalbą užtenka nukopijuoti šį failą ir išversti reikšmes. */
window.MK_T = {
  title: "Reakcijų svarstyklės",
  h1: ["Reakcijų", "svarstyklės"],
  hero: "Išlygink cheminę lygtį: atomų kairėje ir dešinėje turi būti po lygiai.",
  note: "Keisti galima tik koeficientus – indeksai formulėse lieka tokie, kokie yra. Rezultatai saugomi tik šiame įrenginyje.",
  levels: [
    ["Jungimosi reakcijos", "Iš dviejų medžiagų – viena"],
    ["Degimas ir skilimas", "Kuras, deguonis ir skylančios medžiagos"],
    ["Rūgštys, bazės, druskos", "Neutralizacija, mainai ir pavadavimas"],
    ["Koks tipas? + sunkesnės", "Atpažink reakcijos tipą ir įveik kietus riešutus"]
  ],
  points: "Taškai",
  taskBal: "Parink koeficientus, kad lygtis būtų išlyginta.",
  taskType: "Kokio tipo ši reakcija?",
  reactants: "Reagentai",
  products: "Produktai",
  atomsWord: "atomų",
  countersHead: "Atomų skaičius: kairėje · dešinėje",
  check: "Tikrinti",
  next: "Toliau →",
  results: "Rezultatai",
  hintSum: "Patarimas",
  whySum: "Paaiškinimas",
  inc: f => `Didinti koeficientą prie ${f}`,
  dec: f => `Mažinti koeficientą prie ${f}`,
  coef: (f, k) => `${f}: koeficientas ${k}`,
  scaleLabel: (l, r, ok) => ok ? `Svarstyklės išlygintos: po ${l} atomų abiejose pusėse.` : `Svarstyklės pasvirusios: kairėje ${l} atomų, dešinėje ${r}.`,
  notYet: els => `Dar neišlyginta. Nesutampa: <b>${els.join(", ")}</b>. Turi dar vieną bandymą.`,
  reducible: "Lygtis išlyginta, bet koeficientus galima sutrumpinti: padalyk juos visus iš to paties skaičiaus.",
  okFirst: "Išlyginta iš pirmo karto!",
  okSecond: "Išlyginta iš antro karto.",
  fail: "Šį kartą nepavyko.",
  wrongType: "Neteisingai.",
  answerIs: "Išlyginta lygtis:",
  atomsLine: "Atomai:",
  typeIs: "Reakcijos tipas:",
  types: {
    J: "jungimosi reakcija",
    S: "skilimo reakcija",
    P: "pavadavimo reakcija",
    M: "mainų reakcija",
    D: "degimo (oksidacijos) reakcija",
    O: "oksidacijos-redukcijos reakcija"
  },
  typeBtn: { J: "Jungimosi", S: "Skilimo", P: "Pavadavimo", M: "Mainų" },
  typeWhy: {
    J: "Iš kelių medžiagų susidaro viena sudėtingesnė medžiaga: A + B → AB.",
    S: "Iš vienos sudėtinės medžiagos susidaro kelios paprastesnės: AB → A + B.",
    P: "Vieninė medžiaga pavaduoja vieną iš elementų sudėtinėje medžiagoje: A + BC → AC + B.",
    M: "Dvi sudėtinės medžiagos apsikeičia sudedamosiomis dalimis: AB + CD → AD + CB.",
    D: "Medžiaga reaguoja su deguonimi, išsiskiria šiluma. Degant anglies ir vandenilio junginiams susidaro CO<sub>2</sub> ir H<sub>2</sub>O.",
    O: "Šioje reakcijoje keičiasi elementų oksidacijos laipsniai; į keturis pagrindinius tipus ji netelpa."
  },
  hintComb: "Pirmiausia išlygink anglį (C), tada vandenilį (H), o deguonį (O) palik pabaigai – jis yra keliose medžiagose.",
  hintGroup: "Atomų grupės skliaustuose (pvz., OH, SO<sub>4</sub>, NO<sub>3</sub>) dažniausiai nesuyra – skaičiuok jas kaip visumą. Pradėk nuo sudėtingiausios formulės.",
  hintEl: (el, l, r, m) => `Pradėk nuo <b>${el}</b>: kairėje jo ${l}, dešinėje ${r}. Mažiausias bendras kartotinis – ${m}, tiek atomų turi būti abiejose pusėse.`,
  hintGeneric: "Pradėk nuo sudėtingiausios formulės, o vieninių medžiagų (pvz., O<sub>2</sub>, H<sub>2</sub>) koeficientus rink paskutinius.",
  resultTitle: (ok, n) => `${ok} iš ${n}`,
  resultText: p => `${p} ${p % 10 === 1 && p % 100 !== 11 ? "taškas" : p % 10 >= 2 && (p % 100 < 10 || p % 100 > 20) ? "taškai" : "taškų"} iš 80.`,
  learn: [
    { ic: "k", name: "Koeficientas ir indeksas", level: 0, html: `<p><b>Indeksas</b> – mažas skaičius formulėje. Jis rodo, kiek to elemento atomų yra vienoje molekulėje: H<sub>2</sub>O – du vandenilio atomai ir vienas deguonies.</p>
      <p><b>Koeficientas</b> – skaičius prieš formulę. Jis rodo, kiek molekulių dalyvauja reakcijoje: 2H<sub>2</sub>O – dvi vandens molekulės, taigi 4 H ir 2 O atomai.</p>
      <span class="mk-ex">Lyginant lygtį keičiami tik koeficientai. Pakeitus indeksą gaunama kita medžiaga: H<sub>2</sub>O – vanduo, H<sub>2</sub>O<sub>2</sub> – vandenilio peroksidas.</span>` },
    { ic: "m", name: "Masės tvermės dėsnis", level: 0, html: `<p>Reakcijos metu atomai neatsiranda ir neišnyksta – jie tik persigrupuoja į naujas medžiagas. Todėl reagentų masė lygi produktų masei.</p>
      <p>Lygtis išlyginta, kai <b>kiekvieno elemento</b> atomų kairėje ir dešinėje yra po lygiai. Svarstyklės žaidime rodo būtent tai.</p>
      <span class="mk-ex">2H<sub>2</sub> + O<sub>2</sub> → 2H<sub>2</sub>O: kairėje 4 H ir 2 O, dešinėje 4 H ir 2 O.</span>` },
    { ic: "s", name: "Kaip lyginti žingsnis po žingsnio", level: 1, html: `<ul><li>Suskaičiuok kiekvieno elemento atomus abiejose pusėse.</li><li>Pradėk nuo sudėtingiausios formulės ir nuo elemento, kuris yra tik vienoje medžiagoje kiekvienoje pusėje.</li>
      <li>Jei atomų skaičiai skiriasi (pvz., 2 ir 3), ieškok mažiausio bendro kartotinio (6).</li><li>Vieninių medžiagų (O<sub>2</sub>, H<sub>2</sub>, metalų) koeficientus rink paskutinius.</li>
      <li>Patikrink visus elementus dar kartą ir, jei galima, sutrumpink koeficientus.</li></ul>
      <span class="mk-ex">Al + O<sub>2</sub> → Al<sub>2</sub>O<sub>3</sub>. Deguonies 2 ir 3 → reikia 6: 3O<sub>2</sub> ir 2Al<sub>2</sub>O<sub>3</sub>. Tada Al: 4. Atsakymas: 4Al + 3O<sub>2</sub> → 2Al<sub>2</sub>O<sub>3</sub>.</span>` },
    { ic: "d", name: "Degimo reakcijos", level: 1, html: `<p>Degant medžiagoms, sudarytoms iš anglies ir vandenilio (kartais ir deguonies), susidaro anglies dioksidas ir vanduo.</p>
      <p>Lygink tokia tvarka: <b>C → H → O</b>. Jei deguoniui reikėtų trupmeninio koeficiento, padaugink visus koeficientus iš 2.</p>
      <span class="mk-ex">C<sub>2</sub>H<sub>6</sub> + O<sub>2</sub> → CO<sub>2</sub> + H<sub>2</sub>O. C: 2CO<sub>2</sub>; H: 3H<sub>2</sub>O; O dešinėje 7 – nelyginis, todėl viską dauginame iš 2: 2C<sub>2</sub>H<sub>6</sub> + 7O<sub>2</sub> → 4CO<sub>2</sub> + 6H<sub>2</sub>O.</span>` },
    { ic: "t", name: "Reakcijų tipai", level: 3, html: `<ul><li><b>Jungimosi:</b> A + B → AB. Pvz., 2Mg + O<sub>2</sub> → 2MgO.</li><li><b>Skilimo:</b> AB → A + B. Pvz., 2H<sub>2</sub>O<sub>2</sub> → 2H<sub>2</sub>O + O<sub>2</sub>.</li>
      <li><b>Pavadavimo:</b> A + BC → AC + B. Pvz., Zn + 2HCl → ZnCl<sub>2</sub> + H<sub>2</sub>.</li><li><b>Mainų:</b> AB + CD → AD + CB. Pvz., AgNO<sub>3</sub> + NaCl → AgCl + NaNO<sub>3</sub>.</li></ul>
      <p>Rūgšties ir bazės reakcija (<b>neutralizacija</b>) yra mainų reakcija: susidaro druska ir vanduo.</p>
      <span class="mk-ex">Žiūrėk, kiek ir kokių medžiagų yra kairėje ir dešinėje: vieninės (iš vieno elemento) ar sudėtinės.</span>` }
  ]
};
