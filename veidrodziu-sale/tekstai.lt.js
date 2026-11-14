/* Veidrodžių salė – visi mokiniui rodomi tekstai (lietuvių k.). Verčiant keisti tik šį failą.
   Terminai – pagal Fizikos bendrąją programą (7 kl., 26.2.1 „Šviesos reiškiniai“: „šviesos atspindys nuo veidrodinių
   (plokščių, išgaubtų ir įgaubtų) ir nelygių paviršių“, „plokščiojo veidrodžio“, „kritimo ir atspindžio kampus“,
   „atspindžio dėsnius“) ir pagrindinio ugdymo fizikos BP įgyvendinimo rekomendacijas (7 kl.: „braižomas daikto atvaizdas
   plokščiame veidrodyje“, periskopo schema, tyrimas su dviem veidrodžiais, sustatytais stačiu kampu). */
(function(){
"use strict";
const kr = n => (n % 10 === 1 && n % 100 !== 11) ? "kristalas" : (n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20)) ? "kristalai" : "kristalų";
const vd = n => (n % 10 === 1 && n % 100 !== 11) ? "veidrodį" : (n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20)) ? "veidrodžius" : "veidrodžių";
const lg = n => n === 1 ? "langelį" : n < 10 ? "langelius" : "langelių";
window.MK_T = {
  title: "Veidrodžių salė",
  heroA: "Veidrodžių", heroB: "salė",
  hero: "Nukreipk šviesos spindulį veidrodžiais taip, kad jis uždegtų visus kristalus. Pirma apgalvok spindulio kelią pagal atspindžio dėsnį – žibintas įsijungia tik tada, kai paspaudi mygtuką.",
  levels: [
    ["Atspindžio dėsnis", "Kritimo ir atspindžio kampai"],
    ["Pasuk veidrodžius", "Nukreipk spindulį į kristalus"],
    ["Pastatyk veidrodžius", "Pats suplanuok spindulio kelią"],
    ["Atvaizdas veidrodyje", "Plokščiasis veidrodis, laikrodžiai, užrašai"],
    ["Optikos meistro egzaminas", "Visos temos kartu · 10 užduočių"]
  ],
  colH: "Kristalų siena",
  colP: (n, got, all, rank) => got >= all ? `Visa siena šviečia (${all} kristalai). Tavo laipsnis – ${rank}!` : `Iš pirmo karto išspręsta užduočių: ${n}. Šviečia ${got} iš ${all} kristalų (kas 3 užduotys – naujas kristalas). Laipsnis: ${rank}.`,
  ranks: ["Naujokas", "Mokinys", "Pameistrys", "Šviesos žinovas", "Optikos meistras"],
  pts: "Taškai",
  next: "Toliau →", finish: "Baigti",
  rule: "Taisyklė",
  bad: a => `Ne visai. Teisingas atsakymas: ${a}`,
  badPlain: "Ne visai.",
  res: (ok, total, pts, gain) => `Iš pirmo karto: ${ok} iš ${total}. Taškai: ${pts}.` + (gain ? `<br><b>Kristalų sienoje įsižiebė naujų kristalų: ${gain}.</b>` : ""),

  /* ---------- brėžinių užrašai ---------- */
  fig: { mirror: "veidrodis", normal: "statmuo", inc: "krintantis", ref: "atsispindėjęs", eye: "akis", obj: "daiktas", m1: "1 veidrodis", m2: "2 veidrodis" },

  /* ---------- 1 lygis: kampai ---------- */
  q1: {
    ref: a => `Šviesos spindulys krinta į plokščiąjį veidrodį. Kritimo kampas lygus <b>${a}°</b>. Koks atspindžio kampas?`,
    mirInc: f => `Kampas tarp krintančio spindulio ir veidrodžio paviršiaus lygus <b>${f}°</b>. Koks kritimo kampas?`,
    mirRef: f => `Kampas tarp krintančio spindulio ir veidrodžio paviršiaus lygus <b>${f}°</b>. Koks atspindžio kampas?`,
    between: a => `Kritimo kampas lygus <b>${a}°</b>. Koks kampas tarp krintančio ir atsispindėjusio spindulių?`,
    half: b => `Kampas tarp krintančio ir atsispindėjusio spindulių lygus <b>${b}°</b>. Koks kritimo kampas?`,
    refMir: a => `Kritimo kampas lygus <b>${a}°</b>. Koks kampas tarp atsispindėjusio spindulio ir veidrodžio paviršiaus?`,
    grow: x => `Veidrodį pasukome taip, kad kritimo kampas padidėjo <b>${x}°</b>. Kiek padidėjo kampas tarp krintančio ir atsispindėjusio spindulių?`,
    zero: "Spindulys krinta į veidrodį išilgai statmens (statmenai veidrodžio paviršiui). Koks kritimo kampas?",
    zero2: "Spindulys krinta į veidrodį išilgai statmens (statmenai veidrodžio paviršiui). Kur jis atsispindės?",
    pick: "Kuriame brėžinyje šviesos spindulio atspindys nuo plokščiojo veidrodžio pavaizduotas teisingai?",
    two: a => `Du plokštieji veidrodžiai sustatyti stačiu kampu. Spindulys krinta į pirmąjį veidrodį, kritimo kampas <b>${a}°</b>. Koks kritimo kampas į antrąjį veidrodį?`,
    two2: "Du plokštieji veidrodžiai sustatyti stačiu kampu. Spindulys atsispindi nuo abiejų. Kaip nukreiptas išeinantis spindulys, palyginti su krintančiu į pirmąjį veidrodį?",
    peri1: "Periskopo veidrodžiai pasukti 45° kampu į spindulį. Koks spindulio kritimo kampas į periskopo veidrodį?",
    peri2: "Periskope spindulys krinta į veidrodį 45° kritimo kampu. Kokiu kampu pasisuka spindulys, atsispindėjęs nuo vieno veidrodžio?"
  },
  o1: {
    zero2: ["Grįš atgal tuo pačiu keliu", "Nuslys veidrodžio paviršiumi", "Pereis kiaurai veidrodį", "Atsispindės 45° kampu į šoną"],
    two2: ["Lygiagretus jam, bet priešingos krypties", "Statmenas jam", "Tos pačios krypties – eina toliau", "Sudaro su juo 45° kampą"],
    grow0: "Nepasikeitė"
  },
  w1: {
    law: "Atspindžio dėsnis: atspindžio kampas lygus kritimo kampui. Abu kampai matuojami nuo statmens, iškelto į veidrodį spindulio kritimo taške (ne nuo veidrodžio paviršiaus).",
    ref: a => `Atspindžio kampas lygus kritimo kampui, todėl jis taip pat ${a}°.`,
    mirInc: (f, a) => `Kritimo kampas matuojamas nuo statmens, o statmuo su veidrodžiu sudaro 90° kampą: 90° − ${f}° = ${a}°.`,
    mirRef: (f, a) => `Pirma randame kritimo kampą: 90° − ${f}° = ${a}°. Atspindžio kampas jam lygus – ${a}°.`,
    between: (a, b) => `Atspindžio kampas lygus kritimo kampui (${a}°). Kampas tarp spindulių – abiejų kampų suma: ${a}° + ${a}° = ${b}°.`,
    half: (b, a) => `Kampas tarp spindulių sudarytas iš dviejų lygių kampų – kritimo ir atspindžio: ${b}° : 2 = ${a}°.`,
    refMir: (a, f) => `Atspindžio kampas lygus ${a}°. Iki veidrodžio paviršiaus lieka 90° − ${a}° = ${f}°.`,
    grow: (x, y) => `Padidėjus kritimo kampui ${x}°, tiek pat padidėja ir atspindžio kampas. Kampas tarp spindulių padidėja ${x}° + ${x}° = ${y}°.`,
    zero: "Kritimo kampas matuojamas nuo statmens. Kai spindulys eina išilgai statmens, kritimo kampas lygus 0°, atspindžio kampas – taip pat 0°.",
    zero2: "Kritimo kampas lygus 0°, todėl ir atspindžio kampas lygus 0° – spindulys grįžta atgal išilgai statmens tuo pačiu keliu.",
    pick: "Teisingame brėžinyje atsispindėjęs spindulys yra kitoje statmens pusėje ir su statmeniu sudaro tokį patį kampą kaip krintantis. Spindulys negrįžta atgal tuo pačiu keliu (nebent krinta išilgai statmens) ir nepereina kiaurai veidrodžio.",
    two: (a, b) => `Nuo pirmojo veidrodžio spindulys atsispindi ${a}° kampu. Veidrodžių statmenys sudaro statųjį kampą, todėl kritimo kampas į antrąjį veidrodį lygus 90° − ${a}° = ${b}°.`,
    two2: "Po dviejų atspindžių spindulys iš viso pasisuka 180°: nuo stačiu kampu sustatytų veidrodžių jis grįžta lygiagrečiai krintančiam spinduliui, tik priešinga kryptimi. Taip veikia atšvaitai.",
    peri1: "Veidrodis pasuktas 45° kampu į spindulį, todėl kampas tarp spindulio ir statmens taip pat 90° − 45° = 45°.",
    peri2: "Kritimo kampas 45°, atspindžio kampas taip pat 45°. Kampas tarp krintančio ir atsispindėjusio spindulių: 45° + 45° = 90° – spindulys pasuka stačiu kampu. Du tokie veidrodžiai periskope spindulį pasuka du kartus."
  },
  concept1: [
    { q: "Nuo ko matuojamas šviesos spindulio kritimo kampas?", o: ["Nuo statmens, iškelto į paviršių kritimo taške", "Nuo veidrodžio paviršiaus", "Nuo atsispindėjusio spindulio", "Nuo grindų"], w: "Kritimo kampas – kampas tarp krintančio spindulio ir statmens, iškelto į paviršių spindulio kritimo taške. Atspindžio kampas matuojamas nuo to paties statmens." },
    { q: "Lygiagrečių spindulių pluoštas krinta į nelygų paviršių (pavyzdžiui, popieriaus lapą). Kaip jis atsispindi?", o: ["Spinduliai atsispindi įvairiomis kryptimis", "Visi spinduliai atsispindi ta pačia kryptimi", "Spinduliai neatsispindi visai", "Visi spinduliai grįžta atgal tuo pačiu keliu"], w: "Nelygaus paviršiaus maži ploteliai pasukti skirtingai, todėl kiekvienas spindulys atsispindi pagal atspindžio dėsnį, bet vis kita kryptimi. Todėl popieriuje savo atvaizdo nematome." },
    { q: "Lygiagrečių spindulių pluoštas krinta į plokščiąjį veidrodį. Kokie bus atsispindėję spinduliai?", o: ["Taip pat lygiagretūs vienas kitam", "Išsiskirs į visas puses", "Susirinks į vieną tašką", "Išnyks"], w: "Visų spindulių kritimo kampai vienodi, todėl vienodi ir atspindžio kampai – nuo plokščiojo veidrodžio spinduliai atsispindi lygiagrečiai." },
    { q: "Kodėl matome daiktus, kurie patys nešviečia (pavyzdžiui, knygą)?", o: ["Nuo jų atsispindėjusi šviesa patenka į akis", "Iš akių į daiktus sklinda spinduliai", "Daiktai visada šiek tiek šviečia patys", "Juos apšviečia veidrodžiai"], w: "Nešviečiančius kūnus matome todėl, kad nuo jų paviršiaus atsispindėjusi šviesa patenka į mūsų akis." },
    { q: "Lazerio spindulys sklinda švariu oru. Kodėl jo paties iš šono nematome, o matome tik šviesią dėmę ant sienos?", o: ["Matome tik spindulio apšviestus kūnus", "Lazerio šviesa per silpna", "Spindulys sklinda per greitai", "Oras sugeria visą šviesą"], w: "Pats spindulys yra nematomas – matomi tik jo apšviesti kūnai. Jei ore yra dulkių ar rūko, spindulio kelias pasidaro matomas, nes šviesa atsispindi nuo smulkių dalelių." },
    { q: "Vienalytėje skaidrioje terpėje (pavyzdžiui, ore) šviesa sklinda…", o: ["tiesiai", "lanku", "zigzagais", "ratu"], w: "Vienalytėje terpėje šviesa sklinda tiesiai. Todėl už neskaidraus kūno susidaro šešėlis, o spindulio eigą brėžiame tiesiomis linijomis." },
    { q: "Kritimo kampas padidėjo. Kas atsitiko atspindžio kampui?", o: ["Padidėjo tiek pat", "Sumažėjo tiek pat", "Nepasikeitė", "Padidėjo dvigubai"], w: "Atspindžio kampas visada lygus kritimo kampui, todėl kinta kartu su juo." },
    { q: "Kuriame prietaise spindulio kryptis keičiama dviem plokščiaisiais veidrodžiais?", o: ["Periskope", "Lupoje", "Termometre", "Akiniuose"], w: "Periskope du plokštieji veidrodžiai pasukti 45° kampu: kiekvienas spindulį pasuka stačiu kampu, todėl galima žiūrėti virš kliūties." }
  ],

  /* ---------- 2 ir 3 lygiai: galvosūkiai ---------- */
  p2: n => `Bakstelėk veidrodį – jis pasisuks. Sustatyk veidrodžius taip, kad spindulys uždegtų <b>${n === 1 ? "kristalą" : "visus " + n + " kristalus"}</b>. Ne visi veidrodžiai būtinai reikalingi.`,
  p3: (n, m, lock) => `Bakstelėk tuščią langelį – atsiras veidrodis; bakstelėk dar kartą – jis pasisuks, trečią kartą – dings. Turi <b>${m} ${vd(m)}</b>. Uždek <b>${n === 1 ? "kristalą" : "visus " + n + " kristalus"}</b>.` + (lock ? " Veidrodžiai su varžtais pritvirtinti – jų judinti negalima." : ""),
  left: (a, m) => `Veidrodžiai: ${a} / ${m}`,
  go: "Įjungti žibintą",
  tries: n => n === 1 ? "Liko 1 bandymas" : `Liko ${n} bandymai`,
  noMore: "Visi veidrodžiai jau panaudoti – nuimk kurį nors.",
  locked: "Šis veidrodis pritvirtintas.",
  fail: (lit, all, left) => `Šviečia kristalų: ${lit} iš ${all}. Pažiūrėk, kur spindulys pasuko ne ten, pataisyk ir bandyk dar kartą. ${left === 1 ? "Liko 1 bandymas." : "Liko " + left + " bandymai."}`,
  failEnd: "Nepavyko. Pažiūrėk į sprendimą – jis parodytas salėje.",
  win: n => `Šviečia visi kristalai! Spindulys atsispindėjo ${n} ${n === 1 ? "kartą" : "kartus"}.`,
  spare: " Sutaupei veidrodžių: +2 taškai.",
  wPuz: n => `Kiekvienas veidrodis pasuktas 45° kampu į spindulį: kritimo kampas 45°, atspindžio kampas 45°, todėl spindulys kaskart pasuka stačiu (90°) kampu. Šioje salėje spindulys atsispindėjo ${n} ${n === 1 ? "kartą" : "kartus"}.`,
  wPuzMore: "Sek spindulį nuo žibinto: tuščiais langeliais jis eina tiesiai, kolona jį sustabdo, o veidrodis nukreipia į tą pusę, į kurią atsuktas jo paviršius. Veidrodžiai dvipusiai – atspindi abi pusės.",
  sol: "Sprendimas",

  /* ---------- 4 lygis: atvaizdas ---------- */
  q4: {
    tap: "Žvakė stovi priešais plokščiąjį veidrodį. Bakstelėk langelį, kuriame matysime žvakės atvaizdą.",
    dist: d => `Daiktas stovi <b>${d} cm</b> atstumu nuo plokščiojo veidrodžio. Kokiu atstumu už veidrodžio matomas jo atvaizdas?`,
    dist2: d => `Mergaitė stovi <b>${d} m</b> atstumu nuo plokščiojo veidrodžio. Koks atstumas tarp mergaitės ir jos atvaizdo?`,
    appr: x => `Berniukas priėjo prie plokščiojo veidrodžio <b>${x} cm</b> arčiau. Kiek sumažėjo atstumas tarp berniuko ir jo atvaizdo?`,
    back: (d, x) => `Daiktas buvo <b>${d} cm</b> nuo plokščiojo veidrodžio. Jį atitraukė dar <b>${x} cm</b> toliau. Koks dabar atstumas tarp daikto ir jo atvaizdo?`,
    dig: "Veidrodyje matomas elektroninio laikrodžio atvaizdas. Kiek valandų rodo pats laikrodis?",
    ana: "Veidrodyje matomas sieninio laikrodžio (be skaičių) atvaizdas. Kiek valandų rodo pats laikrodis?",
    word: w => `Ant marškinėlių užrašyta <b>${w}</b>. Kaip šis užrašas atrodys plokščiajame veidrodyje?`
  },
  w4: {
    law: "Atvaizdas plokščiajame veidrodyje yra tokio pat dydžio kaip daiktas ir nutolęs už veidrodžio tiek pat, kiek daiktas yra priešais veidrodį. Kairė ir dešinė pusės atvaizde susikeitusios.",
    tap: n => `Daiktas yra per ${n} ${lg(n)} nuo veidrodžio, todėl atvaizdas – toje pačioje eilutėje, per ${n} ${lg(n)} kitoje veidrodžio pusėje.`,
    dist: d => `Atvaizdas už veidrodžio nutolęs tiek pat, kiek daiktas priešais veidrodį – ${d} cm.`,
    dist2: (d, s) => `Atvaizdas už veidrodžio yra ${d} m atstumu. Nuo mergaitės iki atvaizdo: ${d} m + ${d} m = ${s} m.`,
    appr: (x, y) => `Berniukas priartėjo prie veidrodžio ${x} cm, atvaizdas – taip pat ${x} cm. Atstumas tarp jų sumažėjo ${x} cm + ${x} cm = ${y} cm.`,
    back: (d, x, n, s) => `Dabar daiktas yra ${d} cm + ${x} cm = ${n} cm nuo veidrodžio, atvaizdas – tiek pat už veidrodžio. Atstumas tarp jų: ${n} cm · 2 = ${s} cm.`,
    dig: (seen, real) => `Veidrodis sukeičia kairę ir dešinę: skaitmenų tvarka apsiverčia, o skaitmuo 2 atrodo kaip 5 (ir atvirkščiai). Atvaizde matome „${seen}“, vadinasi, laikrodis rodo ${real}.`,
    ana: (seen, real) => `Veidrodis sukeičia kairę ir dešinę, todėl rodyklės atrodo pasuktos į priešingą pusę. Atvaizde matome ${seen}, o iš tikrųjų yra ${real} (tiek pat rodyklėms trūksta iki 12, kiek atvaizde jos nuėjusios nuo 12).`,
    word: "Plokščiajame veidrodyje susikeičia kairė ir dešinė: raidės eina atvirkščia tvarka ir kiekviena apsukta. Viršus ir apačia lieka savo vietose."
  },
  concept4: [
    { q: "Koks daikto atvaizdo dydis plokščiajame veidrodyje?", o: ["Toks pat kaip daikto", "Dvigubai mažesnis", "Dvigubai didesnis", "Priklauso nuo veidrodžio dydžio"], w: "Plokščiajame veidrodyje atvaizdas yra tokio pat dydžio kaip daiktas." },
    { q: "Stovėdama priešais plokščiąjį veidrodį, pakeli dešinę ranką. Kurią ranką, atrodo, pakelia tavo atvaizdas?", o: ["Kairę", "Dešinę", "Abi", "Nė vienos"], w: "Atvaizde kairė ir dešinė susikeitusios, todėl atrodo, kad atvaizdas pakėlė kairę ranką." },
    { q: "Ant greitosios pagalbos automobilio priekio užrašas dažnai užrašomas „atvirkščiai“. Kodėl?", o: ["Kad priekyje važiuojantis vairuotojas jį teisingai perskaitytų veidrodėlyje", "Kad užrašas būtų gražesnis", "Kad jį būtų galima perskaityti tamsoje", "Kad užrašas nenubluktų"], w: "Galinio vaizdo veidrodėlis sukeičia kairę ir dešinę, todėl „atvirkščias“ užrašas jame atrodo įprastai." },
    { q: "Ar atvaizdą plokščiajame veidrodyje galima gauti ekrane, pastatytame už veidrodžio?", o: ["Ne, nes už veidrodžio šviesos spindulių nėra – atvaizdas menamasis", "Taip, visada", "Taip, jei kambaryje tamsu", "Taip, jei veidrodis didelis"], w: "Spinduliai nuo veidrodžio atsispindi ir už jo nepatenka. Mums tik atrodo, kad jie sklinda iš taško už veidrodžio, todėl toks atvaizdas vadinamas menamuoju – ekrane jo gauti negalima." },
    { q: "Kokiame veidrodyje matome sumažintą atvaizdą, bet aprėpiame daugiau erdvės (toks veidrodis statomas sankryžose)?", o: ["Išgaubtame", "Plokščiajame", "Įgaubtame", "Bet kuriame"], w: "Išgaubtame veidrodyje atvaizdas sumažintas, užtat matyti platesnis vaizdas. Todėl tokie veidrodžiai statomi sankryžose ir naudojami automobilių šoniniuose veidrodėliuose." },
    { q: "Koks veidrodis surenka šviesą teleskope reflektoriuje?", o: ["Įgaubtas", "Išgaubtas", "Plokščiasis", "Dvipusis"], w: "Įgaubtas veidrodis lygiagrečius spindulius surenka. Todėl jis naudojamas teleskopuose reflektoriuose ir žibintuose." },
    { q: "Katė sėdi 50 cm atstumu nuo plokščiojo veidrodžio ir mato savo atvaizdą. Kas tikrai tiesa?", o: ["Atvaizdas yra 50 cm už veidrodžio", "Atvaizdas yra veidrodžio paviršiuje", "Atvaizdas yra 25 cm už veidrodžio", "Atvaizdas yra 100 cm už veidrodžio"], w: "Atvaizdas už veidrodžio nutolęs tiek pat, kiek daiktas priešais veidrodį – 50 cm." },
    { q: "Raidė „A“ ir raidė „R“ žiūri į plokščiąjį veidrodį. Kurios raidės atvaizdas atrodo taip pat kaip pati raidė?", o: ["Tik „A“", "Tik „R“", "Abiejų", "Nė vienos"], w: "Veidrodis sukeičia kairę ir dešinę. Raidės „A“ kairė ir dešinė pusės vienodos, todėl jos atvaizdas nepasikeičia, o „R“ atvaizdas apsuktas." }
  ],
  words: ["LAZERIS", "KAMPAS", "FIZIKA", "ŠVIESA", "RAKTAS", "KELIAS", "DEŠINĖ", "KAIRĖ", "LĘŠIS", "SPALVA", "ŽIBINTAS", "PRIZMĖ", "ŠEŠĖLIS", "SPINDULYS"],

  /* ---------- „Noriu pasimokyti“ ---------- */
  learn: [
    { name: "Kaip sklinda šviesa", level: 0, html: "<p>Vienalytėje terpėje (pavyzdžiui, ore) šviesa sklinda <b>tiesiai</b>. Šviesos sklidimo kryptį brėžinyje rodo <b>šviesos spindulys</b> – tiesė su rodykle.</p><p>Pats spindulys nematomas: matome tik jo apšviestus kūnus. Nešviečiančius daiktus matome todėl, kad nuo jų atsispindėjusi šviesa patenka į akis.</p>" },
    { name: "Atspindžio dėsnis", level: 0, html: "<p>Spindulio kritimo taške į veidrodį iškeliamas <b>statmuo</b> (brūkšninė linija, su veidrodžiu sudaranti 90° kampą).</p><p><b>Kritimo kampas</b> – kampas tarp krintančio spindulio ir statmens. <b>Atspindžio kampas</b> – kampas tarp atsispindėjusio spindulio ir statmens.</p><p><b>Atspindžio kampas lygus kritimo kampui.</b> Krintantis spindulys, atsispindėjęs spindulys ir statmuo yra vienoje plokštumoje.</p><p>Dažna klaida – kampą matuoti nuo veidrodžio paviršiaus. Jei žinomas kampas tarp spindulio ir veidrodžio, kritimo kampas lygus 90° minus tas kampas.</p>" },
    { name: "Lygus ir nelygus paviršius", level: 0, html: "<p>Nuo plokščiojo veidrodžio lygiagretūs spinduliai atsispindi taip pat lygiagrečiai – todėl veidrodyje matome aiškų atvaizdą.</p><p>Nuo nelygaus paviršiaus (popieriaus, sienos) spinduliai atsispindi įvairiomis kryptimis, nors kiekvienas spindulys paklūsta atspindžio dėsniui. Atvaizdo nematome, bet patį paviršių matome iš visų pusių.</p>" },
    { name: "Veidrodis, pasuktas 45° kampu", level: 1, html: "<p>Kai veidrodis pasuktas 45° kampu į spindulį, kritimo kampas lygus 45°, atspindžio kampas – taip pat 45°. Kampas tarp krintančio ir atsispindėjusio spindulių: 45° + 45° = <b>90°</b>. Spindulys pasuka stačiu kampu.</p><p>Taip veikia <b>periskopas</b>: du veidrodžiai, pasukti 45° kampu, spindulį pasuka du kartus, ir galima žiūrėti virš kliūties.</p><p>Žaidimo salėje visi veidrodžiai pasukti būtent taip. Jie dvipusiai, o spindulys tuščiais langeliais eina tiesiai.</p>" },
    { name: "Du veidrodžiai stačiu kampu", level: 0, html: "<p>Jei du plokštieji veidrodžiai sustatyti stačiu kampu ir spindulys į pirmąjį krinta kampu α, tai į antrąjį jis krinta kampu 90° − α.</p><p>Po abiejų atspindžių spindulys grįžta <b>lygiagrečiai</b> krintančiam spinduliui, tik priešinga kryptimi. Šiuo principu veikia atšvaitai.</p>" },
    { name: "Atvaizdas plokščiajame veidrodyje", level: 3, html: "<p>Daikto atvaizdas plokščiajame veidrodyje:</p><ul><li>yra <b>tokio pat dydžio</b> kaip daiktas;</li><li>yra už veidrodžio <b>tokiu pat atstumu</b>, kokiu daiktas – priešais veidrodį;</li><li>yra <b>menamasis</b> – ekrane jo gauti negalima;</li><li>kairė ir dešinė pusės jame <b>susikeitusios</b>.</li></ul><p>Todėl atstumas tarp daikto ir atvaizdo dvigubai didesnis už atstumą iki veidrodžio, o laikrodžio ar užrašo atvaizdas atrodo „apsuktas“.</p>" },
    { name: "Išgaubti ir įgaubti veidrodžiai", level: 3, html: "<p><b>Išgaubtame</b> veidrodyje atvaizdas sumažintas, bet matoma daugiau erdvės – tokie veidrodžiai statomi sankryžose, naudojami automobilių šoniniuose veidrodėliuose.</p><p><b>Įgaubtas</b> veidrodis lygiagrečius spindulius surenka – jis naudojamas teleskopuose reflektoriuose, žibintuose.</p>" }
  ]
};
})();
