/* Tikimybių medis – visi mokiniui rodomi tekstai (lietuvių k.).
   Verčiant į kitą kalbą užtenka išversti šį failą.
   Terminai – pagal Matematikos bendrąją programą (IV gimnazijos klasė, „Duomenys ir tikimybės“):
   bandymas, baigtis, palankios baigtys, tikimybių medis, nesutaikomi įvykiai, nepriklausomi ir priklausomi įvykiai,
   grąžintinis ir negrąžintinis ėmimas, priešingas įvykis, įvykiai „A ir B“, „A arba B“;
   išplėstinis kursas: deriniai, Bernulio bandymai, atsitiktinis dydis, skirstinio lentelė, matematinė viltis. */
(function(){
const kartus = k => k === 1 ? "1 kartą" : k + " kartus";
/* Giminės žodeliai šablonams (vyriškoji / moteriškoji). */
const G = {
  m: { abu: "abu", pirmas: "pirmas", antras: "antras", vienas: "vienas", kitas: "kitas", du: "du", visi3: "visi trys", bentv: "bent vienas", nev: "nė vienas", lygv: "lygiai vienas" },
  f: { abu: "abi", pirmas: "pirma", antras: "antra", vienas: "viena", kitas: "kita", du: "dvi", visi3: "visos trys", bentv: "bent viena", nev: "nė viena", lygv: "lygiai viena" }
};
window.MK_T = {
  title: "Tikimybių medis",
  h1: "Tikimybių <em>medis</em>",
  hero: "Užaugink tikimybių medį: surašyk šakų tikimybes, pažymėk įvykiui palankias baigtis ir apskaičiuok tikimybę. Tada 1000 bandymų parodys, ar neapsirikai.",
  note: "Pagal Matematikos bendrąją programą: IV gimnazijos klasė, „Duomenys ir tikimybės“ (tikimybių medžiai, grąžintinis ir negrąžintinis ėmimas, įvykiai „A ir B“, „A arba B“). 5 lygis – išplėstinio kurso temos. Rezultatai saugomi tik šiame įrenginyje.",
  points: "Taškai", next: "Toliau →", check: "Tikrinti baigtis", quit: "Baigti", task: "Užduotis",
  adv: "Išplėstinis kursas",
  levels: [
    { id: "nepriklausomi", name: "Nepriklausomi įvykiai", sub: "Dviejų etapų bandymai, grąžintinis ėmimas, „A ir B“" },
    { id: "negrazintinis", name: "Negrąžintinis ėmimas", sub: "Priklausomi įvykiai: antro etapo tikimybės keičiasi" },
    { id: "arba", name: "„Ir“, „arba“, „bent vienas“", sub: "Kelios palankios baigtys, priešingas įvykis" },
    { id: "trys", name: "Trijų etapų bandymai", sub: "Aštuonios baigtys: „lygiai du“, „bent vienas“" },
    { id: "isplestinis", name: "Bernulio bandymai ir atsitiktinis dydis", sub: "Išplėstinis kursas: deriniai, skirstinio lentelė, matematinė viltis" },
    { id: "vbe", name: "VBE treniruotė", sub: "8 mišrios užduotys iš visų temų" }
  ],
  G,
  /* --- užduoties eiga --- */
  stage: k => k + " etapas",
  legend: "Žymėjimas:",
  qProb: ev => `Kokia tikimybė, kad <b>${ev}</b>?`,
  step1: "1 žingsnis. Užpildyk medį",
  step2: "2 žingsnis. Pažymėk palankias baigtis",
  step3: "3 žingsnis. Apskaičiuok tikimybę",
  askEdge: (k, name, prev) => `Kokia geltonai pažymėtos šakos tikimybė? <span class="sm">${k}: „${name}“${prev.length ? `, kai prieš tai – ${prev.map(p => "„" + p + "“").join(", ")}` : ""}.</span>`,
  edgeNo: "Ne. Pagalvok, kiek liko tinkamų ir kiek iš viso – bandyk dar kartą.",
  edgeNoInd: "Ne. Vienos šakutės tikimybių suma lygi 1 – bandyk dar kartą.",
  askLeaves: ev => `Dešinėje – visos bandymo baigtys. Paliesk tas, kurios palankios įvykiui „<b>${ev}</b>“.`,
  leavesOk: "Teisingai – palankios baigtys pažymėtos.",
  leavesBad: "Ne visai. Žaliai apvestos baigtys – palankios šiam įvykiui.",
  askAnswer: ev => `Kokia tikimybė, kad <b>${ev}</b>?`,
  ansHint: "Išilgai šakų tikimybes daugink, skirtingų baigčių tikimybes sudėk.",
  ok: () => ["Teisingai!", "Puiku!", "Tiksliai!", "Taip!"][Math.floor(Math.random() * 4)],
  bad: "Šį kartą ne.",
  right: v => `Teisingas atsakymas: ${v}.`,
  how: "Kaip apskaičiuoti?",
  exPaths: "Palankios baigtys ir jų tikimybės (išilgai šakų dauginame):",
  exSum: "Baigtys nesutaikomos, todėl jų tikimybes sudedame:",
  exOne: "Palanki tik viena baigtis, tad sudėti nieko nereikia.",
  exCompl: (pn, v) => `Greitesnis kelias – priešingas įvykis: nepalanki tik baigtis ${pn}, todėl P = 1 − ${v}.`,
  simT: "1000 bandymų kompiuteryje",
  sim: (k, pct, th) => `Įvykis įvyko <b>${k}</b> kartus iš 1000 – santykinis dažnis ${pct}&nbsp;%. Apskaičiuota tikimybė – ${th}&nbsp;%.`,
  resTitle: p => p >= 85 ? "Puikus derlius!" : p >= 60 ? "Geras derlius!" : p >= 30 ? "Medis auga" : "Dar pabandyk",
  resText: (pts, max, trees) => `Surinkai ${pts} iš ${max} taškų. Tavo sode jau ${trees} iš 18 medžių.`,
  gardenT: "Mano sodas",
  gardenP: (n, rank) => `Už kiekvieną žvaigždutę sode užauga medis. Užauginta: <b>${n} iš 18</b>. Laipsnis: <b>${rank}</b>.`,
  ranks: ["Sodininko mokinys", "Daigų augintojas", "Sodininkas", "Vyresnysis sodininkas", "Sodo meistras"],

  /* --- ėmimo (dviejų spalvų) kontekstai: A – stebimas požymis --- */
  urn: [
    { id: "rutuliai", g: "m", sg: "rutulys", pl: "rutuliai", repl: [true, false],
      A: { k: "R", sg: "raudonas", pl: "raudoni", col: "#d9412f" }, B: { k: "M", sg: "mėlynas", pl: "mėlyni", col: "#2f7fd6" },
      intro: (a, b) => `Dėžėje yra rutuliai: raudonų – ${a}, mėlynų – ${b}.`,
      take: { 2: "Atsitiktinai vienas po kito ištraukiami du rutuliai.", 3: "Atsitiktinai vienas po kito ištraukiami trys rutuliai." },
      rY: "Ištrauktas rutulys kaskart grąžinamas į dėžę (grąžintinis ėmimas).", rN: "Ištraukti rutuliai į dėžę negrąžinami (negrąžintinis ėmimas)." },
    { id: "zetonai", g: "m", sg: "žetonas", pl: "žetonai", repl: [true, false],
      A: { k: "J", sg: "juodas", pl: "juodi", col: "#3b4252" }, B: { k: "B", sg: "baltas", pl: "balti", col: "#9aa5b8" },
      intro: (a, b) => `Maišelyje yra žetonai: juodų – ${a}, baltų – ${b}.`,
      take: { 2: "Nežiūrint vienas po kito ištraukiami du žetonai.", 3: "Nežiūrint vienas po kito ištraukiami trys žetonai." },
      rY: "Ištrauktas žetonas kaskart įmetamas atgal (grąžintinis ėmimas).", rN: "Ištraukti žetonai atgal nededami (negrąžintinis ėmimas)." },
    { id: "korteles", g: "f", sg: "kortelė", pl: "kortelės", repl: [true, false],
      A: { k: "Ž", sg: "žalia", pl: "žalios", col: "#2f9e58" }, B: { k: "G", sg: "geltona", pl: "geltonos", col: "#d99a00" },
      intro: (a, b) => `Ant stalo užverstos kortelės: žalių – ${a}, geltonų – ${b}.`,
      take: { 2: "Atsitiktinai viena po kitos atverčiamos dvi kortelės.", 3: "Atsitiktinai viena po kitos atverčiamos trys kortelės." },
      rY: "Atversta kortelė kaskart vėl užverčiama ir sumaišoma su kitomis (grąžintinis ėmimas).", rN: "Atverstos kortelės lieka atverstos (negrąžintinis ėmimas)." },
    { id: "saldainiai", g: "m", sg: "saldainis", pl: "saldainiai", repl: [false],
      A: { k: "Š", sg: "šokoladinis", pl: "šokoladiniai", col: "#7a4b2a" }, B: { k: "V", sg: "vaisinis", pl: "vaisiniai", col: "#e0569a" },
      intro: (a, b) => `Vazoje yra vienodai suvynioti saldainiai: šokoladinių – ${a}, vaisinių – ${b}.`,
      take: { 2: "Tomas nežiūrėdamas vieną po kito paima ir suvalgo du saldainius.", 3: "Tomas nežiūrėdamas vieną po kito paima ir suvalgo tris saldainius." },
      rY: "", rN: "Suvalgyti saldainiai, aišku, negrąžinami (negrąžintinis ėmimas)." },
    { id: "lemputes", g: "f", sg: "lemputė", pl: "lemputės", repl: [false],
      A: { k: "B", sg: "brokuota", pl: "brokuotos", col: "#c2410c" }, B: { k: "K", sg: "kokybiška", pl: "kokybiškos", col: "#2f9e58" },
      intro: (a, b) => `Dėžėje yra lemputės: brokuotų – ${a}, kokybiškų – ${b}.`,
      take: { 2: "Kontrolierė atsitiktinai vieną po kitos paima dvi lemputes.", 3: "Kontrolierė atsitiktinai vieną po kitos paima tris lemputes." },
      rY: "", rN: "Patikrintos lemputės atgal nededamos (negrąžintinis ėmimas)." },
    { id: "bilietai", g: "m", sg: "bilietas", pl: "bilietai", repl: [false],
      A: { k: "I", sg: "išmoktas", pl: "išmokti", col: "#2f9e58" }, B: { k: "N", sg: "neišmoktas", pl: "neišmokti", col: "#8a94a6" },
      intro: (a, b) => `Įskaitos bilietų yra ${a + b}. Ugnė išmoko ${a} iš jų, o ${b} – ne.`,
      take: { 2: "Ugnė atsitiktinai vieną po kito traukia du bilietus.", 3: "Ugnė atsitiktinai vieną po kito traukia tris bilietus." },
      rY: "", rN: "Ištraukti bilietai atgal nededami (negrąžintinis ėmimas)." }
  ],
  /* --- trijų spalvų ėmimas (du etapai) --- */
  urn3: [
    { id: "rutuliai3", g: "m", sg: "rutulys", pl: "rutuliai", repl: [true, false],
      outs: [{ k: "R", sg: "raudonas", pl: "raudoni", col: "#d9412f" }, { k: "M", sg: "mėlynas", pl: "mėlyni", col: "#2f7fd6" }, { k: "Ž", sg: "žalias", pl: "žali", col: "#2f9e58" }],
      intro: c => `Dėžėje yra rutuliai: raudonų – ${c[0]}, mėlynų – ${c[1]}, žalių – ${c[2]}.`,
      take: "Atsitiktinai vienas po kito ištraukiami du rutuliai.",
      rY: "Ištrauktas rutulys kaskart grąžinamas į dėžę (grąžintinis ėmimas).", rN: "Ištraukti rutuliai į dėžę negrąžinami (negrąžintinis ėmimas)." },
    { id: "flomasteriai", g: "m", sg: "flomasteris", pl: "flomasteriai", repl: [false],
      outs: [{ k: "J", sg: "juodas", pl: "juodi", col: "#3b4252" }, { k: "M", sg: "mėlynas", pl: "mėlyni", col: "#2f7fd6" }, { k: "R", sg: "raudonas", pl: "raudoni", col: "#d9412f" }],
      intro: c => `Penale yra flomasteriai: juodų – ${c[0]}, mėlynų – ${c[1]}, raudonų – ${c[2]}.`,
      take: "Neda nežiūrėdama vieną po kito ištraukia du flomasterius.",
      rY: "", rN: "Ištraukti flomasteriai atgal nededami (negrąžintinis ėmimas)." },
    { id: "kojines", g: "f", sg: "kojinė", pl: "kojinės", repl: [false],
      outs: [{ k: "P", sg: "pilka", pl: "pilkos", col: "#8a94a6" }, { k: "J", sg: "juoda", pl: "juodos", col: "#3b4252" }, { k: "M", sg: "mėlyna", pl: "mėlynos", col: "#2f7fd6" }],
      intro: c => `Stalčiuje sumaišytos kojinės: pilkų – ${c[0]}, juodų – ${c[1]}, mėlynų – ${c[2]}.`,
      take: "Tamsoje viena po kitos ištraukiamos dvi kojinės.",
      rY: "", rN: "Ištrauktos kojinės atgal nededamos (negrąžintinis ėmimas)." }
  ],
  /* Įvykių šablonai ėmimo kontekstams (c – kontekstas, w – giminės žodeliai, A, B – požymiai). */
  ev: {
    AA: (c, w, A) => `${w.abu} ${c.pl} bus ${A.pl}`,
    AB: (c, w, A, B) => `${w.pirmas} ${c.sg} bus ${A.sg}, o ${w.antras} – ${B.sg}`,
    same: (c, w, A, B) => `${w.abu} ${c.pl} bus ${A.pl} arba ${w.abu} – ${B.pl}`,
    diff: (c, w, A, B) => `${w.vienas} ${c.sg} bus ${A.sg}, o ${w.kitas} – ${B.sg} (bet kuria tvarka)`,
    least: (c, w, A) => `${w.bentv} ${c.sg} bus ${A.sg}`,
    none: (c, w, A) => `${w.nev} ${c.sg} nebus ${A.sg}`,
    secondA: (c, w, A) => `${w.antras} ${c.sg} bus ${A.sg}`,
    AAA: (c, w, A) => `${w.visi3} ${c.pl} bus ${A.pl}`,
    exact1: (c, w, A) => `${w.lygv} ${c.sg} bus ${A.sg}`,
    exact2: (c, w, A) => `lygiai ${w.du} ${c.pl} bus ${A.pl}`,
    most2: (c, w, A) => `bent ${w.du} ${c.pl} bus ${A.pl}`,
    samec: (c, w) => `${w.abu} ${c.pl} bus tos pačios spalvos`,
    diffc: (c) => `${c.pl} bus skirtingų spalvų`
  },
  /* --- nepriklausomų etapų kontekstai: S – „sėkmė“, F – priešinga baigtis --- */
  ind: [
    { id: "baudos", n: [2, 3], ps: [[7, 10], [8, 10], [6, 10], [9, 10]], dec: true,
      S: { k: "T", sg: "pataiko", col: "#2f9e58" }, F: { k: "N", sg: "nepataiko", col: "#8a94a6" },
      intro: (p, n) => `Krepšininkė baudos metimą pataiko su tikimybe ${p[0]}. Ji meta ${n === 2 ? "du" : "tris"} kartus, metimų rezultatai nepriklauso vienas nuo kito.`,
      ev: { all2: "ji pataikys abu kartus", all3: "ji pataikys visus tris kartus", none: "ji nepataikys nė karto", least: "ji pataikys bent vieną kartą", exact1: "ji pataikys lygiai vieną kartą", exact2: "ji pataikys lygiai du kartus", most2: "ji pataikys bent du kartus", SF: "pirmą kartą ji pataikys, o antrą – ne" } },
    { id: "moneta", n: [2, 3], ps: [[1, 2]], dec: false,
      S: { k: "H", sg: "herbas", col: "#d99a00" }, F: { k: "S", sg: "skaičius", col: "#2f7fd6" },
      intro: (p, n) => `Simetriška moneta metama ${n === 2 ? "du" : "tris"} kartus.`,
      ev: { all2: "abu kartus atvirs herbas", all3: "visus tris kartus atvirs herbas", none: "herbas neatvirs nė karto", least: "herbas atvirs bent vieną kartą", exact1: "herbas atvirs lygiai vieną kartą", exact2: "herbas atvirs lygiai du kartus", most2: "herbas atvirs bent du kartus", SF: "pirmą kartą atvirs herbas, o antrą – skaičius" } },
    { id: "kauliukas", n: [2, 3], ps: [[1, 6]], dec: false,
      S: { k: "6", sg: "šešios akutės", col: "#d9412f" }, F: { k: "–", sg: "ne šešios", col: "#8a94a6" },
      intro: (p, n) => `Standartinis šešiasienis lošimo kauliukas ridenamas ${n === 2 ? "du" : "tris"} kartus.`,
      ev: { all2: "abu kartus atvirs šešios akutės", all3: "visus tris kartus atvirs šešios akutės", none: "šešios akutės neatvirs nė karto", least: "šešios akutės atvirs bent vieną kartą", exact1: "šešios akutės atvirs lygiai vieną kartą", exact2: "šešios akutės atvirs lygiai du kartus", most2: "šešios akutės atvirs bent du kartus", SF: "pirmą kartą atvirs šešios akutės, o antrą – ne" } },
    { id: "ratas", n: [2, 3], ps: [[1, 4], [1, 3], [2, 5], [3, 8]], dec: false,
      S: { k: "Ž", sg: "žalias sektorius", col: "#2f9e58" }, F: { k: "K", sg: "kitas sektorius", col: "#8a94a6" },
      intro: (p, n) => `Laimės rato rodyklė žaliame sektoriuje sustoja su tikimybe ${p[0]}. Ratas sukamas ${n === 2 ? "du" : "tris"} kartus.`,
      ev: { all2: "abu kartus rodyklė sustos žaliame sektoriuje", all3: "visus tris kartus rodyklė sustos žaliame sektoriuje", none: "rodyklė nė karto nesustos žaliame sektoriuje", least: "rodyklė bent kartą sustos žaliame sektoriuje", exact1: "rodyklė lygiai vieną kartą sustos žaliame sektoriuje", exact2: "rodyklė lygiai du kartus sustos žaliame sektoriuje", most2: "rodyklė bent du kartus sustos žaliame sektoriuje", SF: "pirmą kartą rodyklė sustos žaliame sektoriuje, o antrą – ne" } },
    { id: "sauliai", n: [2, 3], ps: [[7, 10], [8, 10], [6, 10], [9, 10], [5, 10]], dec: true, differ: true,
      S: { k: "T", sg: "pataiko", col: "#2f9e58" }, F: { k: "N", sg: "nepataiko", col: "#8a94a6" },
      stages: ["1 šaulys", "2 šaulys", "3 šaulys"],
      intro: (p, n) => n === 2 ? `Du šauliai šauna į taikinį po vieną kartą, nepriklausomai vienas nuo kito. Pirmasis pataiko su tikimybe ${p[0]}, antrasis – ${p[1]}.` : `Trys šauliai šauna į taikinį po vieną kartą, nepriklausomai vienas nuo kito. Pirmasis pataiko su tikimybe ${p[0]}, antrasis – ${p[1]}, trečiasis – ${p[2]}.`,
      ev: { all2: "pataikys abu šauliai", all3: "pataikys visi trys šauliai", none: "nepataikys nė vienas šaulys", least: "pataikys bent vienas šaulys", exact1: "pataikys lygiai vienas šaulys", exact2: "pataikys lygiai du šauliai", most2: "pataikys bent du šauliai", SF: "pirmasis šaulys pataikys, o antrasis – ne" } },
    { id: "orai", n: [2], ps: [[3, 10], [4, 10], [2, 10], [6, 10], [7, 10]], dec: true, differ: true,
      S: { k: "L", sg: "lyja", col: "#2f7fd6" }, F: { k: "N", sg: "nelyja", col: "#d99a00" },
      stages: ["šeštadienis", "sekmadienis"],
      intro: p => `Sinoptikų vertinimu, tikimybė, kad šeštadienį lis, lygi ${p[0]}, o kad sekmadienį – ${p[1]}. Laikykime šiuos įvykius nepriklausomais.`,
      ev: { all2: "lis abi dienas", none: "nelis nė vieną dieną", least: "lis bent vieną iš šių dienų", exact1: "lis lygiai vieną iš šių dienų", SF: "šeštadienį lis, o sekmadienį – ne" } },
    { id: "signalizacija", n: [2], ps: [[9, 10], [8, 10], [7, 10]], dec: true, differ: true,
      S: { k: "S", sg: "suveikia", col: "#2f9e58" }, F: { k: "N", sg: "nesuveikia", col: "#c2410c" },
      stages: ["1 jutiklis", "2 jutiklis"],
      intro: p => `Sandėlyje įrengti du vienas nuo kito nepriklausomi dūmų jutikliai. Kilus dūmams pirmasis suveikia su tikimybe ${p[0]}, antrasis – ${p[1]}.`,
      ev: { all2: "kilus dūmams suveiks abu jutikliai", none: "nesuveiks nė vienas jutiklis", least: "suveiks bent vienas jutiklis", exact1: "suveiks lygiai vienas jutiklis", SF: "pirmasis jutiklis suveiks, o antrasis – ne" } },
    { id: "seklos", n: [2, 3], ps: [[9, 10], [8, 10], [7, 10]], dec: true,
      S: { k: "D", sg: "sudygsta", col: "#2f9e58" }, F: { k: "N", sg: "nesudygsta", col: "#8a94a6" },
      stages: ["1 sėkla", "2 sėkla", "3 sėkla"],
      intro: (p, n) => `Kiekviena šios veislės sėkla sudygsta su tikimybe ${p[0]}, nepriklausomai nuo kitų. Pasėtos ${n === 2 ? "dvi sėklos" : "trys sėklos"}.`,
      ev: { all2: "sudygs abi sėklos", all3: "sudygs visos trys sėklos", none: "nesudygs nė viena sėkla", least: "sudygs bent viena sėkla", exact1: "sudygs lygiai viena sėkla", exact2: "sudygs lygiai dvi sėklos", most2: "sudygs bent dvi sėklos", SF: "pirma sėkla sudygs, o antra – ne" } }
  ],

  /* --- 5 lygis (išplėstinis kursas) --- */
  kartus,
  bern: [
    { id: "moneta", p: [[1, 2]], n: [3, 4, 5], intro: n => `Simetriška moneta metama ${kartus(n)}.`, exact: k => `herbas atvirs lygiai ${kartus(k)}`, least: "herbas atvirs bent vieną kartą", s: "herbas" },
    { id: "kauliukas", p: [[1, 6]], n: [3, 4], intro: n => `Šešiasienis lošimo kauliukas ridenamas ${kartus(n)}.`, exact: k => `šešios akutės atvirs lygiai ${kartus(k)}`, least: "šešios akutės atvirs bent vieną kartą", s: "šešios akutės" },
    { id: "testas", p: [[1, 4]], n: [3, 4], intro: n => `Teste yra ${n} klausimai, kiekvienas turi 4 atsakymų variantus, iš kurių teisingas tik vienas. Mokinys visus atsakymus renkasi atsitiktinai.`, exact: k => `jis teisingai atsakys lygiai į ${k === 1 ? "1 klausimą" : k + " klausimus"}`, least: "jis teisingai atsakys bent į vieną klausimą", s: "teisingas atsakymas" },
    { id: "ratas", p: [[1, 3], [2, 3]], n: [3, 4], intro: (n, p) => `Laimės ratas sukamas ${kartus(n)}. Kiekvieną kartą laimima su tikimybe ${p}.`, exact: k => `bus laimėta lygiai ${kartus(k)}`, least: "bus laimėta bent vieną kartą", s: "laimėjimas" },
    { id: "baudos", p: [[8, 10], [6, 10], [7, 10]], n: [3], dec: true, intro: (n, p) => `Krepšininkas baudos metimą pataiko su tikimybe ${p}. Jis meta ${kartus(n)}, metimai nepriklausomi.`, exact: k => `jis pataikys lygiai ${kartus(k)}`, least: "jis pataikys bent vieną kartą", s: "pataikymas" },
    { id: "daigai", p: [[9, 10], [8, 10]], n: [3], dec: true, intro: (n, p) => `Sėkla sudygsta su tikimybe ${p}, nepriklausomai nuo kitų. Pasėtos ${n} sėklos.`, exact: k => `sudygs lygiai ${k === 1 ? "1 sėkla" : k + " sėklos"}`, least: "sudygs bent viena sėkla", s: "sudygusi sėkla" }
  ],
  bernQ1: (n, k) => `Keliais būdais iš ${n} bandymų galima parinkti ${k === 1 ? "tą vieną, kuris bus sėkmingas" : "tuos " + k + ", kurie bus sėkmingi"}? (Derinių skaičius)`,
  bernEx: (n, k, C, p, q, res) => `Bernulio bandymų formulė: derinių skaičius · p<sup>${k}</sup> · q<sup>${n - k}</sup>, kur p = ${p} – sėkmės, q = ${q} – nesėkmės tikimybė.<br>Derinių skaičius C<sub>${n}</sub><sup>${k}</sup> = ${C}. Tikimybė: ${C} · ${p}<sup>${k}</sup> · ${q}<sup>${n - k}</sup> = <b>${res}</b>.`,
  bernLeastEx: (n, q, qn, res) => `„Bent vieną kartą“ – priešingas įvykiui „nė karto“. P(nė karto) = ${q}<sup>${n}</sup> = ${qn}, todėl P = 1 − ${qn} = <b>${res}</b>.`,
  comb: [
    { id: "rutuliai", intro: (a, b, m) => `Dėžėje yra ${a} raudoni ir ${b} mėlyni rutuliai – iš viso ${a + b}. Vienu metu atsitiktinai ištraukiami ${m} rutuliai.`, a: [4, 5, 6], b: [3, 4, 5], ev: (k, m) => k === m ? `visi ${m} rutuliai bus raudoni` : `lygiai ${k} iš jų bus ${k === 1 ? "raudonas" : "raudoni"}`, A: "raudonų", B: "mėlynų" },
    { id: "komanda", intro: (a, b, m) => `Būrelį lanko ${a} merginos ir ${b} vaikinai – iš viso ${a + b}. Burtais išrenkama ${m} mokinių komanda.`, a: [4, 5, 6], b: [3, 4], ev: (k, m) => k === m ? `komandoje bus vien merginos` : `komandoje bus lygiai ${k === 1 ? "1 mergina" : k + " merginos"}`, A: "merginų", B: "vaikinų" },
    { id: "klausimai", intro: (a, b, m) => `Egzamino klausimų yra ${a + b}, Jonas moka ${a} iš jų. Bilietą sudaro ${m} atsitiktinai parinkti klausimai.`, a: [5, 6, 7], b: [3, 4], ev: (k, m) => k === m ? `Jonas mokės visus ${m} bilieto klausimus` : `Jonas mokės lygiai ${k === 1 ? "1 bilieto klausimą" : k + " bilieto klausimus"}`, A: "mokamų", B: "nemokamų" },
    { id: "detales", intro: (a, b, m) => `Partijoje yra ${a} kokybiškos ir ${b} brokuotos detalės – iš viso ${a + b}. Patikrai atsitiktinai paimamos ${m} detalės.`, a: [5, 6, 7], b: [3, 4], ev: (k, m) => k === m ? `visos ${m} paimtos detalės bus kokybiškos` : `lygiai ${k} iš jų bus ${k === 1 ? "kokybiška" : "kokybiškos"}`, A: "kokybiškų", B: "brokuotų" }
  ],
  combQ1: (N, m) => `Keliais būdais iš ${N} galima parinkti ${m} (tvarka nesvarbi)? (Derinių skaičius)`,
  combEx: (N, m, tot, a, k, b, fav, res, A, B) => `Visų baigčių skaičius – derinių skaičius C<sub>${N}</sub><sup>${m}</sup> = ${tot}.<br>Palankių baigčių: ${k} iš ${a} ${A} ir ${m - k} iš ${b} ${B} – C<sub>${a}</sub><sup>${k}</sup> · C<sub>${b}</sub><sup>${m - k}</sup> = ${fav}.<br>P = ${fav} : ${tot} = <b>${res}</b>.`,
  combC: (N, m, c) => `C<sub>${N}</sub><sup>${m}</sup> = ${c} – tvarka nesvarbi, todėl skaičiuojame derinius.`,
  dist: [
    { id: "ratas", x: [[0, 1, 2, 5], [1, 2, 3, 4], [0, 2, 4, 10]], intro: "Atsitiktinis dydis X – taškų skaičius, gaunamas vieną kartą pasukus žaidimo ratą. Jo skirstinio lentelė:" },
    { id: "ivarciai", x: [[0, 1, 2, 3]], intro: "Atsitiktinis dydis X – komandos per rungtynes įmuštų įvarčių skaičius. Jo skirstinio lentelė:" },
    { id: "loterija", desc: true, x: [[0, 2, 5, 10], [0, 1, 5, 20]], intro: "Atsitiktinis dydis X – momentinės loterijos bilieto laimėjimas eurais. Jo skirstinio lentelė:" },
    { id: "autobusai", x: [[0, 1, 2, 3]], intro: "Atsitiktinis dydis X – per rytą pavėlavusių autobusų skaičius. Jo skirstinio lentelė:" },
    { id: "dviraciai", x: [[0, 1, 2, 3, 4]], intro: "Atsitiktinis dydis X – per dieną parduotų dviračių skaičius. Jo skirstinio lentelė:" },
    { id: "klaidos", x: [[0, 1, 2, 3]], intro: "Atsitiktinis dydis X – spaudos klaidų skaičius knygos puslapyje. Jo skirstinio lentelė:" }
  ],
  distQ1: "Kokia tikimybė turi būti vietoje klaustuko?",
  distQ2: "Kam lygi atsitiktinio dydžio X matematinė viltis (vidurkis)?",
  distEx1: (sum, res) => `Visų skirstinio lentelės tikimybių suma lygi 1. Žinomų tikimybių suma – ${sum}, todėl trūkstama tikimybė 1 − ${sum} = <b>${res}</b>.`,
  distEx2: (terms, res) => `Matematinė viltis – reikšmių ir jų tikimybių sandaugų suma: ${terms} = <b>${res}</b>.`,
  rv: {
    intro: (c, a, b, repl) => `${c.intro(a, b)} ${c.take[2]} ${repl ? c.rY : c.rN} Atsitiktinis dydis X rodo, kiek iš šių dviejų yra „${c.A.pl}“.`,
    q1: k => `Kam lygi tikimybė P(X = ${k})?`,
    ex1: (k, parts, res) => `P(X = ${k}) = ${parts} = <b>${res}</b>.`
  },
  xRow: "X", pRow: "P",

  /* --- teorija --- */
  learn: [
    { name: "Tikimybių medis", level: 0, html: `<p><b>Bandymas</b> gali vykti keliais etapais (pvz., du kartus traukiamas rutulys). <b>Tikimybių medyje</b> kiekvienas etapas – nauja šakutė, ant kiekvienos šakos rašoma to etapo baigties tikimybė.</p><ul><li>Iš vieno taško išeinančių šakų tikimybių suma visada lygi 1.</li><li>Kiekvienas kelias nuo medžio pradžios iki galo – viena viso bandymo <b>baigtis</b>.</li><li>Baigties tikimybė – išilgai kelio esančių tikimybių <b>sandauga</b>.</li></ul><span class="mk-ex">Dėžėje 3 raudoni ir 2 mėlyni rutuliai, traukiame du kartus, grąžindami. P(R, tada M) = 3/5 · 2/5 = 6/25.</span>` },
    { name: "Grąžintinis ir negrąžintinis ėmimas", level: 1, html: `<p><b>Grąžintinis ėmimas:</b> ištrauktas daiktas grąžinamas, todėl antro etapo tikimybės tokios pat kaip pirmo – įvykiai <b>nepriklausomi</b>.</p><p><b>Negrąžintinis ėmimas:</b> daiktas negrąžinamas, todėl antrame etape daiktų lieka vienu mažiau, o tikimybės priklauso nuo to, kas ištraukta pirma – įvykiai <b>priklausomi</b>.</p><span class="mk-ex">3 raudoni ir 2 mėlyni rutuliai, negrąžiname. Jei pirmas raudonas, lieka 2 raudoni iš 4: P(R, tada R) = 3/5 · 2/4 = 6/20 = 3/10.</span>` },
    { name: "Įvykiai „A ir B“, „A arba B“", level: 2, html: `<p><b>„Ir“</b> – einame vienu keliu per kelis etapus: tikimybes <b>dauginame</b>.</p><p><b>„Arba“</b> – įvykiui palankios kelios skirtingos baigtys. Skirtingos baigtys yra <b>nesutaikomi įvykiai</b> (negali įvykti kartu), todėl jų tikimybes <b>sudedame</b>.</p><span class="mk-ex">Moneta metama du kartus. „Lygiai vienas herbas“ – tai baigtys HS arba SH: 1/4 + 1/4 = 1/2.</span><p>Pirmiausia visada pažymėk <b>visas</b> palankias baigtis – dažniausia klaida yra vieną praleisti (pvz., pamiršti kitą tvarką).</p>` },
    { name: "Priešingas įvykis ir „bent vienas“", level: 2, html: `<p>Įvykio ir jam <b>priešingo įvykio</b> tikimybių suma lygi 1. Kai palankių baigčių daug, o nepalankių – viena, patogiau skaičiuoti per priešingą įvykį.</p><span class="mk-ex">„Bent vienas pataikymas iš trijų“ priešingas įvykiui „nė vieno pataikymo“: P = 1 − P(nė vieno).</span><p>Būtinojo įvykio tikimybė lygi 1, negalimojo – 0.</p>` },
    { name: "Trijų etapų bandymai", level: 3, html: `<p>Trijų etapų medis su dviem baigtimis kiekviename etape turi 2 · 2 · 2 = 8 baigtis. Skaičiuojama taip pat: išilgai kelio dauginame, skirtingus kelius sudedame.</p><ul><li>„Lygiai du“ – trys keliai (nesėkmė gali būti pirma, antra arba trečia).</li><li>„Bent du“ – „lygiai du“ arba „visi trys“.</li><li>„Bent vienas“ – 1 − P(nė vieno).</li></ul>` },
    { name: "Išplėstinis kursas: deriniai, Bernulio bandymai, atsitiktinis dydis", level: 4, html: `<p><b>Deriniai</b> – rinkiniai, kuriuose elementų tvarka nesvarbi. Derinių iš n po k skaičius: C<sub>n</sub><sup>k</sup> = n! : (k! · (n − k)!).</p><p><b>Bernulio bandymai</b> – n vienodų nepriklausomų bandymų, kurių kiekvieno sėkmės tikimybė p, nesėkmės q = 1 − p. Tikimybė, kad sėkmė ištiks lygiai k kartų: C<sub>n</sub><sup>k</sup> · p<sup>k</sup> · q<sup>n − k</sup>.</p><p><b>Atsitiktinio dydžio skirstinio lentelėje</b> surašomos visos jo reikšmės ir jų tikimybės; tikimybių suma lygi 1. <b>Matematinė viltis</b> (atsitiktinio dydžio vidurkis) – reikšmių ir jų tikimybių sandaugų suma.</p><span class="mk-ex">X: 0, 1, 2; P: 0,5; 0,3; 0,2. Matematinė viltis: 0 · 0,5 + 1 · 0,3 + 2 · 0,2 = 0,7.</span>` }
  ]
};
})();
