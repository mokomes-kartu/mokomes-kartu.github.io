/* Bokštinis kranas – visi mokiniui rodomi tekstai (lietuvių k.). Verčiant keisti tik šį failą.
   Terminai – pagal NŠA „Rekomendacijas 3-ios klasės matematikos mokytojams“ (2026-08-31): „gretimi matavimo vienetai“,
   „smulkiname matavimo vienetus“, „stambiname matavimo vienetus“, „matiniai skaičiai“; Matematikos bendroji programa:
   2 kl. – mm ir cm, cm ir m, g ir kg, kg ir t sąryšiai; 3 kl. – decimetras, „smulkinti / stambinti gretimus matavimo vienetus“. */
(function(){
"use strict";
const U = { mm: 1, cm: 10, dm: 100, m: 1000, kg: 1, t: 1000 };
const NB = " ";
const inU = (v, u) => (v / U[u]) + NB + u;
/* „1 m 5 dm = 150 cm“ (jei jau užrašyta tais vienetais – tik užrašas) */
const conv = (it, u) => it.f === u ? it.label : it.label + " = " + inU(it.v, u);
const b = s => "<b>" + s + "</b>";

window.MK_T = {
  title: "Bokštinis kranas",
  heroTitle: "Bokštinis <em>kranas</em>",
  heroText: "Valdyk kraną ir pastatyk miestelį! Sijų, blokų ir dėžių užrašai – skirtingais matavimo vienetais, tad prieš keldamas gerai paskaičiuok.",
  planTitle: "Statybų planas",
  planText: "Pasirink sklypą. Kiekvienas statinys – kelios skirtingos užduotys iš eilės.",
  townTitle: "Mano miestelis",
  townText: n => n === 0 ? "Kol kas čia tuščia pieva. Pastatyk pirmą statinį!" : n >= 6 ? "Visas miestelis pastatytas. Dabar gali siekti trijų žvaigždučių kiekviename sklype!" : "Pastatyta statinių: " + n + " iš 6.",
  ranks: ["Krano mokinys", "Kranininko padėjėjas", "Kranininkas", "Vyresnysis kranininkas", "Statybų meistras"],
  rankAt: [0, 3, 7, 12, 17],
  rankLine: (r, s) => "Tavo pareigos: " + b(r) + " · žvaigždučių: " + s + " iš 18",
  notesBtn: "Meistro užrašai",
  notesTitle: "Meistro užrašai",
  notesText: "Čia surašyta viskas, ko reikia statybose. Atsiversk, kai tik suabejosi.",
  close: "Užverti",
  sites: [
    { name: "Sodo namelis", sub: "metrai ir centimetrai" },
    { name: "Autobusų stotelė", sub: "decimetrai, centimetrai ir metrai" },
    { name: "Dirbtuvės", sub: "milimetrai ir centimetrai" },
    { name: "Krovos aikštelė", sub: "kilogramai ir tonos" },
    { name: "Mokykla", sub: "visi ilgio vienetai" },
    { name: "Apžvalgos bokštas", sub: "meistro egzaminas" }
  ],
  stageOf: (i, n) => (i + 1) + " užduotis iš " + n,
  mistakes: n => "Klaidos: " + n,
  toPlan: "Į planą",
  grab: "Kabinti", drop: "Paleisti",
  joyHint: "Kranas",
  /* užduočių rūšys */
  shape: {
    tarpas: { name: "Perdanga", ask: s => "Uždenk tarpą sijomis. Tarpo ilgis – " + b(s.target.label) + "." },
    trukstama: { name: "Nebaigta perdanga", ask: s => "Dalis sijų jau padėta. Užbaik perdangą: visas ilgis – " + b(s.target.label) + "." },
    antra: { name: "Antra eilė", ask: () => "Padėk antrą sijų eilę. Ji turi būti " + b("lygiai tokio pat ilgio") + " kaip apatinė." },
    kolona: { name: "Kolona", ask: s => "Sukrauk koloną iš blokų. Kolonos aukštis – " + b(s.target.label) + "." },
    dvi: { name: "Du tarpai", ask: s => "Uždenk abu tarpus: kairysis – " + b(s.targets[0].label) + ", dešinysis – " + b(s.targets[1].label) + "." },
    stogas: { name: "Stogas", ask: () => "Krauk stogo sijas " + b("nuo ilgiausios iki trumpiausios") + "." },
    krova: { name: "Sunkvežimis", ask: s => "Pakrauk sunkvežimį. Krovinio masė turi būti lygiai " + b(s.target.label) + "." },
    trukstama_m: { name: "Nebaigtas krovinys", ask: s => "Dalis krovinio jau sukrauta. Visa krovinio masė turi būti " + b(s.target.label) + "." },
    priekaba: { name: "Sunkvežimis su priekaba", ask: s => "Į priekabą (kairėje) – " + b(s.targets[0].label) + ", į sunkvežimį (dešinėje) – " + b(s.targets[1].label) + "." },
    svarstykles: { name: "Svarstyklės", ask: () => "Išlygink svarstykles: dešinėje lėkštėje turi būti " + b("tiek pat") + ", kiek kairėje." },
    rikiavimas: { name: "Rietuvė", ask: () => "Krauk dėžes vieną ant kitos " + b("nuo sunkiausios iki lengviausios") + "." }
  },
  placed: "Padėta:", nothing: "dar nieko",
  left: "kairėje", right: "dešinėje",
  /* žodžiai pagal detalės rūšį */
  w: {
    sija: { one: "sija", acc: "siją", gen: "sijų", more: "ilgesnė", q: "ilgis", tooBig: "visos likusios sijos per ilgos", deadTail: "Vadinasi, kuri nors jau padėta sija netinka. Nukelk ją atgal: privesk prie jos kablį ir spausk „Kabinti“. Nukelti galima pradedant nuo paskutinės padėtos.", overDead: "Gal netinka kuri nors anksčiau padėta sija? Paskutinę padėtą siją galima nukelti atgal.", back: "Sija grįžo į sandėlį.", near: "Nuleisk kablį prie sijos, kurią nori kelti." },
    blokas: { one: "blokas", acc: "bloką", gen: "blokų", more: "aukštesnis", q: "aukštis", tooBig: "visi likę blokai per aukšti", deadTail: "Vadinasi, kuris nors jau padėtas blokas netinka. Nukelk jį atgal: privesk prie jo kablį ir spausk „Kabinti“. Nukelti galima pradedant nuo viršutinio.", overDead: "Gal netinka kuris nors anksčiau padėtas blokas? Viršutinį bloką galima nukelti atgal.", back: "Blokas grįžo į sandėlį.", near: "Nuleisk kablį prie bloko, kurį nori kelti." },
    deze: { one: "dėžė", acc: "dėžę", gen: "dėžių", more: "sunkesnė", q: "masė", tooBig: "visos likusios dėžės per sunkios", deadTail: "Vadinasi, kuri nors jau padėta dėžė netinka. Nukelk ją atgal: privesk prie jos kablį ir spausk „Kabinti“. Nukelti galima pradedant nuo paskutinės padėtos.", overDead: "Gal netinka kuri nors anksčiau padėta dėžė? Paskutinę padėtą dėžę galima nukelti atgal.", back: "Dėžė grįžo į sandėlį.", near: "Nuleisk kablį prie dėžės, kurią nori kelti." }
  },
  tut: [
    "Vairalazde (arba rodyklėmis) nuvesk kablį prie sijos sandėlyje.",
    "Kablys prie sijos! Spausk „Kabinti“ (arba tarpo klavišą).",
    "Vežk siją į dešinę – virš statinio – ir spausk „Paleisti“.",
    "Jei apsirikai, padėtą siją gali nukelti atgal: privesk kablį ir spausk „Kabinti“."
  ],
  offRack: "← Sandėlis", offSite: "Statinys →", offSiteM: "Krovinys →",
  /* meistro pranešimai */
  okHead: ["Tiksliai!", "Puikus darbas!", "Kaip iš brėžinio!", "Šaunu, meistre!", "Tvirtai pastatyta!"],
  okNext: "Statom toliau", okLast: "Baigti statinį",
  badHead: "Stop! Netinka.",
  badAgain: "Bandau dar kartą",
  hintHead: "Meistras pataria",
  hintOk: "Supratau",
  sumOk: (items, t, u) => {
    const a = items.map(i => i.label).join(" + "), c = items.map(i => inU(i.v, u)).join(" + ");
    const s = inU(items.reduce((x, i) => x + i.v, 0), u);
    let o = a; if(a !== c) o += " =<br>= " + c; if(items.length > 1) o += " = " + b(s); else if(a !== c) o = a + " = " + b(c);
    return "<p class='eq'>" + o + (t && t.f !== u ? " = " + b(t.label) : "") + "</p>";
  },
  orderOk: (items, u, w) => "<p class='eq'>" + items.map(i => conv(i, u)).join("<br>") + "</p><p>Kai visi matiniai skaičiai užrašyti tais pačiais vienetais, palyginti lengva.</p>",
  over: (items, t, u, w, isBal) => {
    const s = items.reduce((x, i) => x + i.v, 0);
    return "<p class='eq'>" + items.map(i => conv(i, u)).join("<br>") + "</p><p>Iš viso: " + items.map(i => inU(i.v, u)).join(" + ") + " = " + b(inU(s, u)) + ".</p>" +
      "<p>" + (isBal ? "Kairėje lėkštėje yra " : "Reikia ") + b(conv(t, u)) + ". Per daug " + b(inU(s - t.v, u)) + ".</p>" +
      "<p>" + w.one.charAt(0).toUpperCase() + w.one.slice(1) + " grįžta į sandėlį. Pirmiausia visus matinius skaičius užrašyk tais pačiais vienetais.</p>";
  },
  pairOk: (L, R, u, nL, nR) => "<p class='eq'>" + nL + ": " + L.map(i => i.label).join(" + ") + " = " + b(inU(L.reduce((x, i) => x + i.v, 0), u)) +
    "<br>" + nR + ": " + R.map(i => inU(i.v, u)).join(" + ") + " = " + b(inU(R.reduce((x, i) => x + i.v, 0), u)) + "</p><p>Abiejose pusėse po lygiai.</p>",
  pairL: { antra: "Apatinė eilė", svarstykles: "Kairėje" }, pairR: { antra: "Viršutinė eilė", svarstykles: "Dešinėje" },
  zoneName: ["Kairysis tarpas", "Dešinysis tarpas"], zoneNameM: ["Priekaba", "Sunkvežimis"],
  wrongOrder: (it, big, u, w) => "<p class='eq'>" + conv(it, u) + "<br>" + conv(big, u) + "</p><p>Sandėlyje dar liko " + w.more + " " + w.one + ": " + b(big.label) + ". Ją reikia dėti pirmiau.</p>",
  dead: (rem, u, w) => "<p>Dar trūksta " + b(inU(rem, u)) + ", o " + w.tooBig + ".</p><p>" + w.deadTail + "</p>",
  overDead: w => "<p>" + w.overDead + "</p>",
  rel: { "m>cm": "1 m = 100 cm", "m>dm": "1 m = 10 dm", "dm>cm": "1 dm = 10 cm", "cm>mm": "1 cm = 10 mm", "dm>mm": "1 dm = 100 mm", "m>mm": "1 m = 1000 mm", "t>kg": "1 t = 1000 kg" },
  remember: "Prisimink: ",
  /* statinio pabaiga */
  endTitle: ["", "Statinys baigtas!", "Statinys baigtas – labai gerai!", "Statinys baigtas – puikiai!"],
  endText: (name, m) => "„" + name + "“ jau stovi miestelyje. " + (m === 0 ? "Nė vienos klaidos!" : m === 1 ? "Tik viena klaida." : "Klaidų: " + m + "."),
  endLook: "Pažiūrėti statinį", lookBack: "Paliesk ekraną – langas sugrįš.", finBuild: "Karkasas baigtas – statybininkai užbaigia statinį!",
  signs: ["SODO NAMELIS", "AUTOBUSŲ STOTELĖ", "DIRBTUVĖS", "SANDĖLIS", "MOKYKLA", "APŽVALGOS BOKŠTAS"],
  endNext: "Kitas sklypas →", endAgain: "Statyti dar kartą", endPlan: "Į statybų planą",
  newRank: r => "Naujos pareigos: " + r + "!",
  quit: "Ar tikrai grįžti į planą? Šio statinio darbai nebus išsaugoti.",
  /* „Noriu pasimokyti“ – meistro užrašų knygelė */
  notes: [
    { name: "Ilgio matavimo vienetai", html: "<p>Ilgį matuojame " + b("milimetrais (mm)") + ", " + b("centimetrais (cm)") + ", " + b("decimetrais (dm)") + " ir " + b("metrais (m)") + ".</p>" +
      "<table class='ut'><tr><td>1 cm</td><td>= 10 mm</td></tr><tr><td>1 dm</td><td>= 10 cm</td></tr><tr><td>1 m</td><td>= 10 dm</td></tr><tr><td>1 m</td><td>= 100 cm</td></tr><tr><td>1 m</td><td>= 1000 mm</td></tr></table>" +
      "<p>Milimetrai ir centimetrai, centimetrai ir decimetrai, decimetrai ir metrai – " + b("gretimi matavimo vienetai") + ": kiekvienas kitas yra 10 kartų stambesnis.</p>" },
    { name: "Kaip smulkinti matavimo vienetus", html: "<p>" + b("Smulkiname") + ", kai stambesnius vienetus keičiame smulkesniais. Smulkesnių vienetų reikia daugiau, todėl skaičius " + b("padidėja") + ".</p>" +
      "<p class='eq'>3 m = 3 · 100 cm = 300 cm<br>7 dm = 7 · 10 cm = 70 cm<br>12 cm = 12 · 10 mm = 120 mm</p>" },
    { name: "Kaip stambinti matavimo vienetus", html: "<p>" + b("Stambiname") + ", kai smulkesnius vienetus keičiame stambesniais. Stambesnių vienetų reikia mažiau, todėl skaičius " + b("sumažėja") + ".</p>" +
      "<p class='eq'>400 cm = 4 m<br>60 cm = 6 dm<br>250 mm = 25 cm</p>" },
    { name: "Matiniai skaičiai su dviem vienetais", html: "<p>Kartais ilgis užrašomas dviem vienetais. Paversk abi dalis tuo pačiu vienetu ir sudėk.</p>" +
      "<p class='eq'>1 m 20 cm = 100 cm + 20 cm = 120 cm<br>2 m 5 dm = 20 dm + 5 dm = 25 dm<br>4 dm 5 cm = 40 cm + 5 cm = 45 cm<br>13 cm 5 mm = 130 mm + 5 mm = 135 mm</p>" +
      "<p>Atsargiai: " + b("1 m 5 dm = 150 cm") + ", o " + b("1 m 5 cm = 105 cm") + ". Skaičiai tie patys, bet vienetai kiti!</p>" },
    { name: "Kaip sudėti ir palyginti", html: "<p>Prieš sudėdamas ar lygindamas visus matinius skaičius užrašyk " + b("tais pačiais vienetais") + ".</p>" +
      "<p class='eq'>150 cm + 1 m 5 dm = 150 cm + 150 cm = 300 cm = 3 m</p><p class='eq'>Kas ilgesnis: 17 dm ar 1 m 60 cm?<br>17 dm = 170 cm, 1 m 60 cm = 160 cm.<br>Ilgesnis – 17 dm.</p>" },
    { name: "Masės matavimo vienetai", html: "<p>Masę matuojame " + b("gramais (g)") + ", " + b("kilogramais (kg)") + " ir " + b("tonomis (t)") + ".</p>" +
      "<table class='ut'><tr><td>1 kg</td><td>= 1000 g</td></tr><tr><td>1 t</td><td>= 1000 kg</td></tr></table>" +
      "<p class='eq'>2 t = 2000 kg<br>1 t 250 kg = 1000 kg + 250 kg = 1250 kg<br>3500 kg = 3 t 500 kg</p>" },
    { name: "Kaip valdyti kraną", html: "<p>" + b("Telefone:") + " kairėje – vairalazdė. Į šonus – važiuoja vežimėlis, aukštyn ir žemyn – kyla ir leidžiasi kablys. Dešinėje – mygtukas „Kabinti“ / „Paleisti“.</p>" +
      "<p>" + b("Kompiuteryje:") + " rodyklės (arba W, A, S, D) ir tarpo klavišas.</p><p>Krovinį paleisk virš statinio – jis pats atsiguls į vietą. Paleistas kitur, grįš į sandėlį. Padėtą paskutinę detalę galima nukelti atgal. Laikas neskaičiuojamas – neskubėk.</p>" }
  ]
};
})();
