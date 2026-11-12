/* Genetikos laboratorija – visi mokiniui rodomi tekstai (lietuvių k.). Verčiant keisti tik šį failą.
   Terminai – pagal vidurinio ugdymo biologijos BP ir jos įgyvendinimo rekomendacijas (29.3.3 „Paveldimumas ir kintamumas“)
   bei pagrindinio ugdymo (10 kl.) 27.1.1 „Genetika“. */
(function(){
"use strict";
const many = (n, one, few, lots) => { const d = n % 10, h = n % 100; return d === 1 && h !== 11 ? one : d >= 2 && (h < 10 || h >= 20) ? few : lots; };
window.MK_T = {
  title: "Genetikos laboratorija",
  heroA: "Genetikos", heroB: "laboratorija",
  hero: "Kryžmink, pildyk Peneto gardelę ir prognozuok palikuonis. Kiekvienas teisingai išspręstas uždavinys papildo laboratorijos kolekciją.",
  levels: [
    ["Monohibridinis kryžminimas", "Dominuojantis ir recesyvinis alelis · 10 kl. kartojimas"],
    ["Analizuojamasis ir nepilnas dominavimas", "Nežinomas genotipas, tarpinis fenotipas"],
    ["Kodominavimas: kraujo grupės", "ABO sistema"],
    ["Su lytimi sukibęs paveldėjimas", "Hemofilija, daltonizmas, hemizigota"],
    ["Dihibridinis kryžminimas", "Du nesukibę genai, 9 : 3 : 3 : 1"],
    ["VBE treniruotė", "Visos temos kartu · 10 uždavinių"]
  ],
  colH: "Laboratorijos kolekcija",
  colP: (n, max) => n >= max ? `Kolekcija pilna (${n}). Puikus darbas!` : `Kolekcijoje ${n} iš ${max}. Kiekvienas teisingai išspręstas uždavinys prideda po vieną pavyzdį.`,
  colEmpty: "Dar tuščia – išspręsk pirmą uždavinį.",
  pts: "Taškai",
  task: (i, n) => `${i} / ${n}`,
  g1H: "1 žingsnis. Gametos",
  gStepQ: who => `Kokias gametas sudaro ${who}?`,
  gridH: "2 žingsnis. Peneto gardelė",
  gridHelp: "Paliesk langelius – sujunk gametas (arba užpildyk visą gardelę).",
  gridFill: "Užpildyti visą gardelę",
  gridH2: "Peneto gardelė",
  qH: "3 žingsnis. Klausimas",
  qH1: "Klausimas",
  next: "Toliau",
  finish: "Baigti",
  ok: ["Teisingai!", "Puiku!", "Tiksliai!", "Šaunu!"],
  bad: "Ne visai.",
  right: a => `Teisingas atsakymas: <b>${a}</b>.`,
  why: "Kaip spręsti?",
  ptsPlus: n => `+${n}`,
  mother: "motina", father: "tėvas", motherG: "motina", fatherG: "tėvas",
  motherT: "Motina", fatherT: "Tėvas",
  p1: "1 augalas", p2: "2 augalas", p1G: "1 augalas", p2G: "2 augalas",
  female: "♀", male: "♂",
  gamOnly: a => `tik ${a}`,
  gamAnd: (a, b) => `${a} ir ${b}`,
  gamList: l => l.join(", "),
  gamWhy: (g, list, n) => n === 1 ? `Genotipas ${g} – homozigota, todėl visos gametos vienodos: ${list}. Gametoje yra tik po vieną kiekvieno geno alelį.` : `Kiekvienoje gametoje yra tik po vieną kiekvieno geno alelį. Genotipas ${g} sudaro ${n} skirtingų tipų gametas: ${list}.`,
  gamWhyDi: (g, list) => `Nesukibę genai į gametas patenka nepriklausomai: kiekvienas vieno geno alelis derinasi su kiekvienu kito geno aleliu. ${g} → ${list}. Gametoje negali būti dviejų to paties geno alelių (pvz., „Aa“).`,
  /* ---- požymiai ---- */
  tr: {
    seedC: { name: "sėklų spalva", D: "geltonos", R: "žalios", pD: "geltonų sėklų žirnis", pR: "žalių sėklų žirnis", q: ph => `Kokia dalis palikuonių sėklų bus ${ph}?`, cnt: (n, ph) => `Gauta ${n} sėklų. Kiek iš jų tikėtina bus ${ph}?`, fact: "Žirnių geltona sėklų spalva (A) dominuoja prieš žalią (a)." },
    seedS: { name: "sėklų forma", D: "glotnios", R: "raukšlėtos", pD: "glotnių sėklų žirnis", pR: "raukšlėtų sėklų žirnis", q: ph => `Kokia dalis palikuonių sėklų bus ${ph}?`, cnt: (n, ph) => `Gauta ${n} sėklų. Kiek iš jų tikėtina bus ${ph}?`, fact: "Žirnių glotni sėklų forma (B) dominuoja prieš raukšlėtą (b)." },
    flower: { name: "žiedų spalva", D: "violetiniai", R: "balti", pD: "violetinių žiedų žirnis", pR: "baltų žiedų žirnis", q: ph => `Kokia dalis palikuonių turės ${ph === "violetiniai" ? "violetinius" : "baltus"} žiedus?`, cnt: (n, ph) => `Išaugo ${n} augalų. Kiek iš jų tikėtina turės ${ph === "violetiniai" ? "violetinius" : "baltus"} žiedus?`, fact: "Žirnių violetinė žiedų spalva (A) dominuoja prieš baltą (a)." },
    albin: { name: "albinizmas", D: "normalios pigmentacijos", R: "albinosai", pD: "", pR: "", q: ph => ph === "albinosai" ? "Kokia tikimybė, kad vaikas bus albinosas?" : "Kokia tikimybė, kad vaikas bus normalios pigmentacijos?", fact: "Albinizmą lemia recesyvinis alelis (a): melanino pigmentas nesigamina. Normalią pigmentaciją lemia dominuojantis alelis (A)." },
    inc: { name: "žiedų spalva (nepilnas dominavimas)", AA: "raudoni", Aa: "rožiniai", aa: "balti", pAA: "raudonų žiedų augalas", pAa: "rožinių žiedų augalas", paa: "baltų žiedų augalas", q: ph => `Kokia dalis palikuonių turės ${({ raudoni: "raudonus", "rožiniai": "rožinius", balti: "baltus" })[ph]} žiedus?`, fact: "Nepilnas dominavimas: heterozigotos (Aa) fenotipas tarpinis – žiedai rožiniai (AA – raudoni, aa – balti)." }
  },
  /* ---- kryžminimo aprašai ---- */
  crossPlants: (a, b) => `Kryžminami ${a} ir ${b}.`,
  crossAlbin: (m, f) => `Albinizmas paveldimas kaip recesyvinis požymis. ${m} ${f}`,
  albinParent: (who, g) => g === "aa" ? `${who} – albinosas (${g}).` : g === "Aa" ? `${who} normalios pigmentacijos, heterozigota (${g}).` : `${who} normalios pigmentacijos, homozigota (${g}).`,
  plantG: (name, g) => `${name} (${g})`,
  phenoQ: "Koks palikuonių fenotipų santykis?",
  genoQ: "Koks palikuonių genotipų santykis?",
  hetQ: "Kokia dalis palikuonių bus heterozigotos?",
  all: l => `visi ${l}`, allF: l => `visos ${l}`,
  ratio: (nums, labels) => `${nums.join(" : ")} (${labels.join(" : ")})`,
  gRatio: (nums, labels) => nums.map((n, i) => `${n} ${labels[i]}`).join(" : "),
  allG: g => `visi ${g}`,
  explGrid: (cells, total) => `Gardelėje ${total} vienodai tikėtini langeliai: ${cells}.`,
  explPheno: parts => `Fenotipai: ${parts}.`,
  explP: (k, n, p) => `Tinka ${k} iš ${n} langelių, todėl tikimybė ${p}.`,
  explCnt: (n, p, a) => `Tikimybė ${p}, todėl ${n} · ${p} = ${a}. Tai tikėtinas skaičius; tikri rezultatai gali šiek tiek skirtis.`,
  /* ---- analizuojamasis kryžminimas ---- */
  testIntro: (d, r, res) => `${d[0].toUpperCase() + d.slice(1)} (genotipas nežinomas) sukryžmintas su ${r} (aa). ${res}`,
  testRes1: (n1, n2, a, b) => `Gauta ${a.replace(/os$/, "ų")} sėklų: ${n1}, ${b.replace(/os$/, "ų")}: ${n2}.`,
  testRes2: (n, a) => `Visos ${n} gautos sėklos ${a}.`,
  testQ: "Koks tiriamojo augalo genotipas?",
  testWhy: g => g === "Aa" ? "Recesyvinė homozigota (aa) sudaro tik a gametas, todėl palikuonių fenotipas atskleidžia tiriamojo augalo gametas. Atsirado recesyvinio fenotipo palikuonių – vadinasi, tiriamasis augalas sudaro ir a gametas: jis heterozigota Aa (skilimas 1 : 1)." : "Recesyvinė homozigota (aa) sudaro tik a gametas. Visi palikuonys dominuojančio fenotipo (Aa) – vadinasi, tiriamasis augalas sudaro tik A gametas: jis homozigota AA.",
  testConcQ: "Kodėl atliekant analizuojamąjį kryžminimą tiriamasis organizmas kryžminamas su recesyvine homozigota?",
  testConcA: ["Jos gametose yra tik recesyvinis alelis, todėl palikuonių fenotipai parodo, kokias gametas sudaro tiriamasis organizmas", "Recesyvinė homozigota visada užgožia dominuojantį alelį", "Taip gaunama daugiau palikuonių", "Recesyvinės homozigotos nesudaro gametų, todėl netrukdo tyrimui"],
  testConcWhy: "Recesyvinė homozigota (aa) sudaro tik vieno tipo gametas (a), kurios neužgožia jokio alelio. Todėl kiekvieno palikuonio fenotipą lemia tiriamojo organizmo gametos alelis: skilimas 1 : 1 rodo heterozigotą, vienodi palikuonys – dominuojančią homozigotą.",
  incSameQ: "Kuo ypatingas šis kryžminimas, lyginant su pilnu dominavimu?",
  incSameA: ["Fenotipų santykis sutampa su genotipų santykiu (1 : 2 : 1)", "Fenotipų santykis yra 3 : 1, kaip ir pilno dominavimo atveju", "Visi palikuonys yra rožiniai", "Heterozigotų neatsiranda"],
  incSameWhy: "Esant nepilnam dominavimui, heterozigotos fenotipas tarpinis, todėl kiekvienas genotipas turi savo fenotipą: 1 AA (raudoni) : 2 Aa (rožiniai) : 1 aa (balti). Esant pilnam dominavimui AA ir Aa atrodytų vienodai – būtų 3 : 1.",
  /* ---- ABO ---- */
  aboIntro: (m, f) => `Motinos genotipas ${m}, tėvo – ${f}.`,
  aboPhenIntro: (m, f) => `Motinos kraujo grupė ${m}, tėvo – ${f}. Tėvų genotipai nežinomi.`,
  aboPossQ: "Kokių kraujo grupių gali būti šių tėvų vaikai?",
  aboProbQ: g => `Kokia tikimybė, kad vaiko kraujo grupė bus ${g}?`,
  aboInfIntro: (m, c) => `Motinos kraujo grupė ${m}, vaiko – ${c}.`,
  aboInfQ: "Kokios kraujo grupės tėvas NEGALI būti šio vaiko tėvas?",
  aboWhyGen: "ABO kraujo grupes lemia trys aleliai: Iᴬ ir Iᴮ yra kodominuojantys (genotipe Iᴬ Iᴮ pasireiškia abu – grupė AB), o i – recesyvinis (grupė 0 tik genotipe ii).",
  aboWhyPoss: (list) => `Galimi vaikų genotipai: ${list}.`,
  aboWhyPhen: (m, f) => `Grupė A gali būti Iᴬ Iᴬ arba Iᴬ i, grupė B – Iᴮ Iᴮ arba Iᴮ i. Imame visus galimus tėvų genotipus: ${m} ir ${f}.`,
  aboWhyInf: (c, need, no) => `Vaikas su grupe ${c} gauna po vieną alelį iš abiejų tėvų. ${need} Todėl tėvas negali būti ${no} grupės.`,
  aboNeed0: "Vaikas ii, todėl i alelį turėjo gauti ir iš tėvo.",
  aboNeedAB: "Motina negali duoti Iᴮ, todėl Iᴮ alelį vaikas gavo iš tėvo.",
  aboNone: "nė viena (bet kuri tinka)",
  grp: "grupė",
  /* ---- su lytimi sukibęs ---- */
  xl: {
    hem: { name: "hemofilija", L: "H", sickM: "sergantis hemofilija", sickF: "serganti hemofilija", desc: "Hemofiliją lemia recesyvinis alelis Xʰ, esantis X chromosomoje." },
    dal: { name: "daltonizmas", L: "D", sickM: "daltonikas", sickF: "daltonikė", desc: "Daltonizmą lemia recesyvinis alelis Xᵈ, esantis X chromosomoje." }
  },
  xlMother: (g, s) => `Motina ${s} (${g})`,
  xlFather: (g, s) => `tėvas ${s} (${g}).`,
  xlHealthyF: "sveika", xlCarrier: "sveika, bet nešiotoja", xlSickF: d => d,
  xlHealthyM: "sveikas", xlSickM: d => d,
  xlQSon: d => `Kokia tikimybė, kad šių tėvų SŪNUS bus ${d}?`,
  xlQSonAll: d => `Kokia tikimybė, kad šių tėvų vaikas bus ${d} sūnus?`,
  xlQDauCar: "Kokia tikimybė, kad šių tėvų DUKTĖ bus nešiotoja?",
  xlQDauSick: d => `Kokia tikimybė, kad šių tėvų DUKTĖ bus ${d}?`,
  xlWhySon: (k, n, p) => `Sūnūs – tai langeliai su Y chromosoma (${n}). Iš jų ${k} su recesyviniu aleliu, todėl tikimybė ${p}.`,
  xlWhyAll: (k, p) => `Skaičiuojami visi 4 langeliai (sūnūs ir dukterys). Tinka ${k}, todėl tikimybė ${p}.`,
  xlWhyDau: (k, n, p) => `Dukterys – tai langeliai su dviem X chromosomomis (${n}). Iš jų tinka ${k}, todėl tikimybė ${p}.`,
  xlWhyGen: "Vyras turi vieną X chromosomą – jis hemizigota, todėl vienas recesyvinis alelis X chromosomoje jau pasireiškia. Sūnus X chromosomą gauna iš motinos, o Y – iš tėvo.",
  hemiQ: "Kodėl su X chromosoma sukibusios recesyvinės ligos (pvz., hemofilija) dažniau pasireiškia vyrams?",
  hemiA: ["Vyras turi vieną X chromosomą – jis hemizigota, todėl vienas recesyvinis alelis jau pasireiškia", "Y chromosomoje yra dominuojantis ligos alelis", "Vyrai X chromosomą gauna iš tėvo", "Moterų X chromosomose ligos alelių nebūna"],
  hemiWhy: "Moteriai (XX) liga pasireiškia tik turint du recesyvinius alelius (Xʰ Xʰ); turėdama vieną ji yra nešiotoja. Vyras (XY) šio geno alelį turi tik vieną – jis hemizigota, todėl Xʰ Y jau serga. Sūnus X chromosomą gauna iš motinos.",
  son: "sūnus", dau: "duktė", child: "Vaikas",
  /* ---- dihibridinis ---- */
  diIntro: (a, b) => `Žirniai: geltona sėklų spalva (A) dominuoja prieš žalią (a), glotni sėklų forma (B) – prieš raukšlėtą (b). Genai nesukibę. Kryžminami ${a} ir ${b}.`,
  diPh: { AB: "geltonos glotnios", Ab: "geltonos raukšlėtos", aB: "žalios glotnios", ab: "žalios raukšlėtos" },
  diQ: ph => `Kokia dalis palikuonių sėklų bus ${ph}?`,
  diPhenoQ: "Koks palikuonių fenotipų santykis?",
  diGamQ: "Kiek skirtingų tipų gametų sudaro organizmas, kurio genotipas AaBbCc (genai nesukibę)?",
  diGamWhy: "Kiekvienas heterozigotinis genas padvigubina gametų tipų skaičių: 2 · 2 · 2 = 2³ = 8.",
  diWhyGen: "Nesukibę genai paveldimi nepriklausomai, todėl kiekviena 4 tipų gameta gali susijungti su kiekviena kitos gameta – 16 langelių.",
  /* ---- rezultatai ---- */
  res: (ok, n, pts) => `Teisingi žingsniai: ${ok} iš ${n}. ${pts} ${many(pts, "taškas", "taškai", "taškų")}.`,
  resCol: n => `Kolekcija papildyta ${n} ${many(n, "pavyzdžiu", "pavyzdžiais", "pavyzdžių")}.`,
  /* ---- teorija ---- */
  learn: [
    { name: "Pagrindinės sąvokos", level: 0, html: `<p><b>Genas</b> – DNR atkarpa, turinti informaciją apie požymį. To paties geno formos vadinamos <b>aleliais</b>; kiekvienoje alelių poroje vienas alelis gautas iš tėvo, kitas – iš motinos.</p>
      <ul><li><b>Dominuojantis alelis</b> (A) pasireiškia ir heterozigotoje, <b>recesyvinis</b> (a) – tik homozigotoje aa.</li><li><b>Homozigota</b> – du vienodi aleliai (AA, aa), <b>heterozigota</b> – skirtingi (Aa).</li><li><b>Genotipas</b> – organizmo alelių rinkinys, <b>fenotipas</b> – pasireiškę požymiai.</li></ul>` },
    { name: "Monohibridinis kryžminimas ir Peneto gardelė", level: 0, html: `<p>Gametoje yra tik po vieną kiekvieno geno alelį. Peneto gardelėje vieno tėvo gametas rašome viršuje, kito – kairėje, o langeliuose sujungiame.</p>
      <span class="mk-ex">Aa × Aa → 1 AA : 2 Aa : 1 aa, fenotipai 3 : 1</span><span class="mk-ex">Aa × aa → 1 Aa : 1 aa, fenotipai 1 : 1</span>
      <p>Tikimybė = tinkančių langelių skaičius / visų langelių skaičius.</p>` },
    { name: "Analizuojamasis kryžminimas", level: 1, html: `<p>Dominuojančio fenotipo organizmas (AA ar Aa?) kryžminamas su recesyvine homozigota aa. Ji sudaro tik a gametas, todėl palikuonys „parodo“ tiriamojo gametas.</p>
      <span class="mk-ex">visi dominuojantys → AA</span><span class="mk-ex">skilimas 1 : 1 → Aa</span>` },
    { name: "Nepilnas dominavimas", level: 1, html: `<p>Heterozigotos fenotipas tarpinis. Pvz., AA – raudoni žiedai, Aa – rožiniai, aa – balti.</p><span class="mk-ex">Aa × Aa → 1 raudoni : 2 rožiniai : 1 balti</span><p>Fenotipų santykis sutampa su genotipų santykiu.</p>` },
    { name: "Kodominavimas: ABO kraujo grupės", level: 2, html: `<p>Trys aleliai: Iᴬ, Iᴮ ir i. Iᴬ ir Iᴮ – kodominuojantys (abu pasireiškia), i – recesyvinis.</p>
      <ul><li>A: Iᴬ Iᴬ arba Iᴬ i</li><li>B: Iᴮ Iᴮ arba Iᴮ i</li><li>AB: Iᴬ Iᴮ</li><li>0: i i</li></ul><span class="mk-ex">Iᴬ i × Iᴮ i → A, B, AB, 0 po ¼</span>` },
    { name: "Su lytimi sukibęs paveldėjimas", level: 3, html: `<p>Genas yra X chromosomoje. Moteris (XX) gali būti homozigota arba heterozigota – <b>nešiotoja</b> (Xᴴ Xʰ). Vyras (XY) turi vieną X – jis <b>hemizigota</b>, todėl Xʰ Y serga.</p>
      <p>Sūnus X chromosomą gauna iš motinos, duktė – po vieną iš abiejų tėvų.</p><span class="mk-ex">Xᴴ Xʰ × Xᴴ Y → pusė sūnų serga, pusė dukterų – nešiotojos</span>` },
    { name: "Dihibridinis kryžminimas", level: 4, html: `<p>Du nesukibę genai paveldimi nepriklausomai. AaBb sudaro 4 tipų gametas: AB, Ab, aB, ab. Gardelė 4 × 4 = 16 langelių.</p>
      <span class="mk-ex">AaBb × AaBb → 9 : 3 : 3 : 1</span><span class="mk-ex">AaBb × aabb → 1 : 1 : 1 : 1</span>
      <p>Patogu dauginti tikimybes: P(aabb) = ¼ · ¼ = 1/16.</p>` }
  ],
  learnH: "Noriu pasimokyti"
};
})();
