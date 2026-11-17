/* Abėcėlės biblioteka – visi mokiniui rodomi tekstai ir žodžiai (lietuvių k.). Verčiant keisti tik šį failą.
   Pagrindas – Lietuvių kalbos ir literatūros bendroji programa, 5 klasė: 28.4.3 „toliau mokomasi skirti garsą ir raidę,
   išmokstama abėcėlė“; 28.4.2 „Mokomasi rasti reikiamą informaciją žodynuose“; 28.4.1 „Susipažįstama su „Dabartinės
   lietuvių kalbos žodynu“, „Mokomuoju lietuvių kalbos rašybos ir kirčiavimo žodynu““.
   Žodžių rinkiniai parenkami taip, kad mokyklinė raidžių eilė ir didžiųjų žodynų tvarka (kur a ir ą, e, ę ir ė,
   i, į ir y, u, ų ir ū laikomos lygiavertėmis) duotų tą patį atsakymą – tai tikrina žaidimo kodas. */
(function(){
"use strict";
const taskai = n => n % 10 === 1 && n % 100 !== 11 ? "taškas" : n % 10 >= 2 && (n % 100 < 10 || n % 100 > 20) ? "taškai" : "taškų";
const knygu = n => n % 10 === 1 && n % 100 !== 11 ? "knyga" : n % 10 >= 2 && (n % 100 < 10 || n % 100 > 20) ? "knygos" : "knygų";
const nth = ["pirmą", "antrą", "trečią", "ketvirtą", "penktą", "šeštą", "septintą"];
const nthN = ["pirma", "antra", "trečia", "ketvirta", "penkta", "šešta", "septinta"];
window.MK_T = {
  title: "Abėcėlės biblioteka",
  h1: "Abėcėlės <em>biblioteka</em>",
  hero: "Bibliotekoje knygos ir žodynų žodžiai išdėstyti abėcėlės tvarka. Sustatyk knygas į lentynas, rask žodžiui vietą ir tinkamą žodyno puslapį.",
  note: "Pagal Lietuvių kalbos ir literatūros bendrąją programą (5 kl.): „išmokstama abėcėlė“, „mokomasi rasti reikiamą informaciją žodynuose“. Rezultatai saugomi tik šiame įrenginyje.",
  abc: "aąbcčdeęėfghiįyjklmnoprsštuųūvzž",
  points: "Taškai", check: "Tikrinti", next: "Toliau →", results: "Rezultatai", clear: "Iš naujo",
  peek: "Pasižiūrėti abėcėlę", peekNote: "Pasižiūrėjus abėcėlę, ši užduotis į „Mano biblioteką“ neįskaitoma.",
  levels: [
    ["Raidžių eilė", "32 raidės: kuri po kurios?"],
    ["Pirmoji raidė", "Sustatyk knygas pagal pirmą raidę"],
    ["Antra ir trečia raidė", "Kai žodžiai prasideda vienodai"],
    ["Kur knygos vieta?", "Įterpk naują knygą į lentyną"],
    ["Žodyno puslapis", "Kuriame puslapyje ieškoti žodžio?"],
    ["Bibliotekininko egzaminas", "Visos užduotys, ilgesnės lentynos"]
  ],
  q: {
    after: l => `Kuri raidė abėcėlėje eina iškart <b>po</b> raidės <span class="bigl">${l}</span>?`,
    before: l => `Kuri raidė abėcėlėje eina iškart <b>prieš</b> raidę <span class="bigl">${l}</span>?`,
    gap: "Kuri raidė praleista?",
    orderL: "Sustatyk raides abėcėlės tvarka. Bakstelėk raides iš eilės.",
    orderW: "Sustatyk knygas į lentyną abėcėlės tvarka. Bakstelėk knygas iš eilės – nuo pirmos iki paskutinės.",
    insert: w => `Lentynoje knygos jau sustatytos abėcėlės tvarka. Kur turi stovėti nauja knyga „<b>${w}</b>“? Bakstelėk tinkamą tarpą.`,
    page: w => `Žodyno puslapio viršuje parašyti pirmasis ir paskutinis to puslapio žodžiai. Kuriame puslapyje ieškosi žodžio „<b>${w}</b>“?`,
    onPage: (a, b) => `Žodyno puslapis prasideda žodžiu „<b>${a}</b>“ ir baigiasi žodžiu „<b>${b}</b>“. Kuris žodis yra šiame puslapyje?`,
    notOnPage: (a, b) => `Žodyno puslapis prasideda žodžiu „<b>${a}</b>“ ir baigiasi žodžiu „<b>${b}</b>“. Kurio žodžio šiame puslapyje <b>nėra</b>?`
  },
  slotHint: "Jei suklydai, bakstelėk knygą lentynoje – ji grįš atgal.",
  slotHintL: "Jei suklydai, bakstelėk raidę eilėje – ji grįš atgal.",
  gapLabel: i => `Tarpas ${i}`, pageLabel: i => `${i} puslapis`,
  retryHead: "Dar ne visai.",
  retryOrder: (ok, n) => ok === 0 ? "Nė viena knyga dar ne savo vietoje. Pradėk nuo tos, kurios pirma raidė abėcėlėje anksčiausia." : `Savo vietoje stovi ${ok} iš ${n}. Kai raidės sutampa, žiūrėk į kitą raidę.`,
  retryOrderL: (ok, n) => `Savo vietoje ${ok} iš ${n}. Mintyse pasakyk abėcėlę nuo pradžių.`,
  retryPick: "Šis variantas netinka – jis išbrauktas. Pabandyk dar kartą.",
  retryInsert: "Ne čia. Palygink naujos knygos pavadinimą su kaimyninėmis knygomis paraidžiui.",
  okHead: (praise, pts) => `${praise} +${pts}`, failHead: "Šįkart nepavyko – pažiūrėk, kaip reikėjo.",
  explain: "Paaiškinimas",
  why: {
    strip: "Paryškintos raidės abėcėlėje:",
    orderL: s => `Teisinga tvarka: <b>${s}</b>.`,
    orderW: "Teisinga tvarka (paryškinta raidė, pagal kurią žodis skiriasi nuo ankstesnio):",
    ruleFirst: "Pirmos raidės skirtingos – užtenka palyginti jas.",
    ruleNext: "Kai pirmos raidės vienodos, lyginame antras; jei ir jos vienodos – trečias, ir taip toliau.",
    prefix: (a, b) => `Žodis „${a}“ yra žodžio „${b}“ pradžia – trumpesnis žodis eina pirmiau.`,
    pair: (a, b, la, lb, i) => `„${a}“ eina prieš „${b}“: lyginame ${nth[i]} raidę – <b>${la}</b> abėcėlėje yra anksčiau už <b>${lb}</b>.`,
    insert: w => `Knyga „${w}“ turi stovėti čia:`,
    after: (l, r) => `Po raidės <b>${l}</b> eina <b>${r}</b>.`,
    before: (l, r) => `Prieš raidę <b>${l}</b> eina <b>${r}</b>.`,
    gap: r => `Praleista raidė <b>${r}</b>.`,
    page: (w, a, b) => `Žodis „${w}“ yra tarp žodžių „${a}“ ir „${b}“.`,
    notPage: (w, a, b, before) => before ? `Žodis „${w}“ eina dar prieš pirmąjį puslapio žodį „${a}“, todėl jis būtų ankstesniame puslapyje.` : `Žodis „${w}“ eina jau po paskutinio puslapio žodžio „${b}“, todėl jis būtų tolesniame puslapyje.`,
    tricky: {
      "į": "Atsimink: i, į, y, j – raidė y eina po į ir prieš j.", "y": "Atsimink: i, į, y, j – raidė y eina po į ir prieš j.", "i": "Atsimink: i, į, y, j – raidė y eina po į ir prieš j.", "j": "Atsimink: i, į, y, j – raidė y eina po į ir prieš j.",
      "u": "Atsimink: u, ų, ū, v.", "ų": "Atsimink: u, ų, ū, v.", "ū": "Atsimink: u, ų, ū, v.",
      "e": "Atsimink: e, ę, ė, f.", "ę": "Atsimink: e, ę, ė, f.", "ė": "Atsimink: e, ę, ė, f.",
      "p": "Lietuvių abėcėlėje nėra q – po p iškart eina r.", "r": "Lietuvių abėcėlėje nėra q – po p iškart eina r.",
      "v": "Lietuvių abėcėlėje nėra w ir x – po v iškart eina z.", "z": "Lietuvių abėcėlėje nėra w ir x – po v eina z, o paskutinė raidė – ž.", "ž": "Paskutinė abėcėlės raidė – ž.",
      "c": "Raidės su paukščiuku eina iškart po savo „porininkės“: c, č.", "č": "Raidės su paukščiuku eina iškart po savo „porininkės“: c, č.",
      "s": "Raidės su paukščiuku eina iškart po savo „porininkės“: s, š.", "š": "Raidės su paukščiuku eina iškart po savo „porininkės“: s, š.",
      "a": "Nosinė raidė eina iškart po paprastos: a, ą.", "ą": "Nosinė raidė eina iškart po paprastos: a, ą."
    }
  },
  resTitle: (ok, n) => `${ok} iš ${n} iš pirmo karto`,
  resText: (pts, added, rank) => `${pts} ${taskai(pts)}.` + (added ? ` Į tavo biblioteką atkeliavo ${added} ${knygu(added)}.` : "") + (rank ? ` Naujas vardas: ${rank}!` : ""),
  libTitle: "Mano biblioteka",
  libText: (n, max, rank, left, nextRank) => n >= max ? `Visos ${max} lentynų vietos užpildytos. Tavo vardas – ${rank}.` : `Knygų: ${n} iš ${max}. Vardas: ${rank}.` + (nextRank ? ` Iki vardo „${nextRank}“ liko ${left}.` : "") + " Knygą gauni už kiekvieną užduotį, išspręstą iš pirmo karto ir nepasižiūrėjus abėcėlės.",
  ranks: ["Skaitytojas", "Knygų nešiotojas", "Bibliotekininko padėjėjas", "Bibliotekininkas", "Vyriausiasis bibliotekininkas", "Abėcėlės meistras"],
  rankNeed: [0, 8, 24, 48, 80, 120],
  learn: [
    { name: "Lietuvių kalbos abėcėlė", level: 0, html: `<p>Dabartinę lietuvių abėcėlę sudaro <b>32 raidės</b>:</p><span class="mk-ex abcx">A Ą B C Č D E Ę Ė F G H I Į Y J K L M N O P R S Š T U Ų Ū V Z Ž</span><p>Sunkiausios vietos:</p><ul><li>nosinės raidės eina iškart po paprastų: <b>a, ą</b>; <b>e, ę, ė</b>; <b>i, į</b>; <b>u, ų, ū</b>;</li><li><b>y</b> eina po <b>į</b> ir prieš <b>j</b>: i, į, y, j;</li><li>raidės su paukščiuku eina po savo porininkių: <b>c, č</b>; <b>s, š</b>; <b>z, ž</b>;</li><li>abėcėlėje nėra q, w, x: po <b>p</b> eina <b>r</b>, po <b>v</b> – <b>z</b>.</li></ul>` },
    { name: "Kaip rikiuoti žodžius abėcėlės tvarka", level: 1, html: `<p>1. Lygink <b>pirmas</b> raides: žodis, kurio pirma raidė abėcėlėje anksčiau, eina pirmiau.</p><p>2. Jei pirmos raidės vienodos, lygink <b>antras</b>; jei ir jos vienodos – <b>trečias</b>, ir taip toliau.</p><p>3. Jei vienas žodis yra kito pradžia, trumpesnis eina pirmiau.</p><span class="mk-ex">kalnas, kalva, kamuolys, katė<br>ka<b>l</b>nas ir ka<b>m</b>uolys: l anksčiau už m<br>kal<b>n</b>as ir kal<b>v</b>a: n anksčiau už v</span>` },
    { name: "Kur įterpti naują žodį", level: 3, html: `<p>Naują žodį lygink su lentynos žodžiais iš eilės, kol rasi pirmą žodį, kuris abėcėlėje eina <b>vėliau</b> už naująjį. Naujas žodis stoja prieš jį.</p><span class="mk-ex">lapas, liepa, <u>lokys</u>, lova<br>„lokys“: po „liepa“ (i anksčiau už o), prieš „lova“ (k anksčiau už v)</span>` },
    { name: "Kaip ieškoti žodžio žodyne", level: 4, html: `<p>Žodynuose žodžiai išdėstyti abėcėlės tvarka. Puslapio viršuje dažnai parašyti <b>pirmasis ir paskutinis</b> to puslapio žodžiai – jie padeda greitai rasti reikiamą puslapį.</p><p>Žodis yra puslapyje, jei abėcėlėje jis eina <b>po</b> pirmojo ir <b>prieš</b> paskutinįjį puslapio žodį (arba su vienu iš jų sutampa).</p><span class="mk-ex">Puslapis: kardas – kelias<br>„katė“ – yra (po „kardas“, prieš „kelias“)<br>„kiškis“ – nėra (jau po „kelias“)</span><p>5 klasėje susipažįstama su „Dabartinės lietuvių kalbos žodynu“ ir „Mokomuoju lietuvių kalbos rašybos ir kirčiavimo žodynu“.</p>` },
    { name: "Ar žinai? Didieji žodynai", level: null, html: `<p>Dideliuose lietuvių kalbos žodynuose raidės <b>a</b> ir <b>ą</b>, <b>e</b>, <b>ę</b> ir <b>ė</b>, <b>i</b>, <b>į</b> ir <b>y</b>, <b>u</b>, <b>ų</b> ir <b>ū</b> rikiuojant žodžius dažniausiai laikomos lygiavertėmis, todėl, pavyzdžiui, žodžių, prasidedančių raide <b>y</b>, ieškok ten pat, kur ir prasidedančių raide <b>i</b>.</p><p>Šiame žaidime žodžiai parinkti taip, kad abu būdai – ir mokyklinė raidžių eilė, ir žodynų tvarka – duotų tą patį atsakymą.</p>` }
  ],
  /* žodžiai (knygų pavadinimai ir žodyno žodžiai) – bendriniai daiktavardžiai, mažosiomis raidėmis */
  words: ("abrikosas adata agurkas aguona aikštė aitvaras akmuo akiniai albumas alyva ančiukas angelas antis apelsinas apynys arbata arbūzas arklys asilas atostogos audra auksas ausis aušra avietė avilys avis " +
    "ąsotis ąžuolas " +
    "bananas banga baravykas barsukas batas bebras beržas bičiulis bitė bokštas braškė broliai bulvė burė būgnas " +
    "centras cirkas citrina cukrus " +
    "čekis česnakas čiaupas čiuožykla " +
    "daina dalgis dangus dantis daržas debesis degtukas delnas diena dobilas dovana draugas drugelis dubuo duona durys dviratis " +
    "eglė eilėraštis elnias erelis ešerys ežeras ežys ėdžios ėriukas " +
    "fabrikas fėja fleita fontanas futbolas " +
    "gaidys gandras garvežys gatvė gegutė gėlė gilė giria gitara grybas griaustinis gulbė gyvatė " +
    "herbas himnas horizontas " +
    "ieva ilgesys indas inkaras inkilas iškaba išdaiga įlanka įrankis įspūdis yla " +
    "jautis javai jazminas jonvabalis jūra juokas jurginas " +
    "kačiukas kalnas kalva kamuolys kardas karūna karvė kaštonas katė kelias kepurė kiškis klevas knyga kopūstas kregždė kriaušė kumelė kurmis kviečiai " +
    "lagaminas laikrodis laivas langas lapas lapė laumė ledas lėktuvas lelija liepa lietus lokys lopšys lova lūšis " +
    "malūnas mama margutis mašina medis medus mėnulis meška miestas miškas molis morka mokykla musė muzika " +
    "namas naktis narcizas nendrė nosis nykštukas nuotrauka nuotykis " +
    "obelis obuolys oras ožka ožys " +
    "paltas pasaka paukštis pelė pelėda pienas pieva pilis pirštinė plaštakė pupa pušis pyragas " +
    "ragana raktas rasa ratas riešutas rytas ropė rožė rugiai ruduo rūkas rūta " +
    "sagė salotos saulė sausainis senelis sesuo sidabras skėtis sliekas smėlis sniegas sodas sraigė stalas stirna stogas suolas sūris svogūnas " +
    "šaka šaltinis šaukštas šermukšnis šernas šiaudas širdis šluota šokis šuo šviesa " +
    "takas tėtis tigras tiltas tinklas traukinys triušis trobelė tulpė tvora " +
    "ugnis uodas uoga uosis upė upelis uostas ūdra ūkis ūsai " +
    "vabalas vaikas vainikas vakaras vanduo varlė varna vasara vėjas vėliava veidrodis vilkas višta voras voverė vyšnia " +
    "zebras zylė zuikis " +
    "žaibas žaislas žąsis žemė žiedas žiema žirnis žmogus žolė žuvis žvaigždė žvirblis").split(" "),
  nthN
};
})();
