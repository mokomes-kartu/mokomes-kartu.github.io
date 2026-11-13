/* Stoties laikrodis – visi mokiniui rodomi tekstai (lietuvių k.). Verčiant keisti tik šį failą. */
(function(){
"use strict";
const many = (n, one, few, lots) => { const d = n % 10, h = n % 100; return d === 1 && h !== 11 ? one : d >= 2 && (h < 10 || h >= 20) ? few : lots; };
const bilietus = n => `${n} ${many(n, "bilietą", "bilietus", "bilietų")}`;
/* Šiuose šablonuose naudojami tik praeities/ateities 3 asmens daiktavardžiai ir veiksmažodžiai, kurie nesiskiria lyčiai. */
window.MK_T = {
  title: "Stoties laikrodis",
  names: ["Mikas", "Ugnė", "Rokas", "Gabija", "Jonas", "Emilija", "Tadas", "Austėja", "Lukas", "Kamilė", "Dovydas", "Liepa"],
  heroA: "Stoties", heroB: "laikrodis",
  hero: "Tu – stoties budėtojas. Skaityk laikrodį, skaičiuok kelionės trukmę ir paleisk traukinius laiku!",
  levels: [
    ["Laikrodžio rodyklės", "Skaityk ir sukink laikrodį"],
    ["Kiek truko?", "Kelionės ir veiklos trukmė"],
    ["Kada bus?", "Pradžia ir trukmė – kada pabaiga"],
    ["Tvarkaraštis", "Rask traukinį lentoje"],
    ["Sekundės, minutės, valandos", "Smulkink ir stambink"],
    ["Kalendorius", "Dienos, savaitės, mėnesiai"],
    ["Budėtojo egzaminas", "Visų temų mišinys"]
  ],
  trainH: "Mano traukinys",
  trainP: n => `Surinkai ${bilietus(n)}. Už bilietus prie traukinio prikabinami nauji vagonai.`,
  wagons: ["Garvežys", "Pašto vagonas", "Obuolių vagonas", "Žaislų vagonas", "Knygų vagonas", "Cirko vagonas", "Stiklinis vagonas", "Auksinis vagonas"],
  locked: n => `Reikia ${n}`,
  unlocked: name => `Prikabintas naujas vagonas: ${name}!`,
  howH: "Kaip žaisti?",
  how: [
    "Perskaityk užduotį ir pažiūrėk į laikrodį ar lentą.",
    "Pasirink atsakymą arba pasuk laikrodžio rodykles ir spausk „Patikrinti“.",
    "Neskubėk – laikmačio nėra. Suklydus gausi užuominą ir bandysi dar kartą.",
    "Už teisingą atsakymą iš pirmo karto – 2 bilietai, iš antro – 1. Bilietai prikabina vagonus."
  ],
  keys: "Kompiuteryje: laikrodžio rodyklę gali tempti pele arba spausti mygtukus.",
  /* nuorodos / mygtukai */
  check: "Patikrinti",
  nextBtn: "Toliau →",
  hourMinus: "− val.", hourPlus: "+ val.", minMinus: "− min", minPlus: "+ min",
  setHint0: "Tempk ilgąją rodyklę (minutes) aplink laikrodį. Valandų rodyklė pati pasislenka.",
  dragAria: "Laikrodis: tempk minučių rodyklę",
  shortHand: "trumpoji rodyklė – valandos", longHand: "ilgoji rodyklė – minutės",
  tickets: "Bilietai",
  resTitle: (ok, n) => `${ok} iš ${n}`,
  resText: (ok, n, g) => `Iš pirmo karto: ${ok} iš ${n}. Surinkai ${bilietus(g)}.`,
  good: ["Puiku!", "Teisingai!", "Šaunu!", "Valio!", "Kaip gerai!", "Nuostabu!"],
  tryAgain: "Dar ne visai. Pabandyk dar kartą!",
  secondOk: "Dabar teisingai!",
  sorry: "Šįkart nepavyko – žiūrėk, kaip skaičiuoti.",
  /* užduočių klausimai */
  places: ["stoties", "mokyklos", "kino teatro", "bibliotekos", "virtuvės", "sporto salės", "miesto aikštės", "parduotuvės", "ligoninės", "bažnyčios bokšto"],
  readQ: p => `Kiek laiko rodo ${p} laikrodis?`,
  readQmin: p => `Koks laikas ${p} laikrodyje? Suskaičiuok minutes atidžiai.`,
  whichQ: t => `Kuris laikrodis rodo ${t}?`,
  setQ: (what, t) => `${what} ${t}. Pasuk laikrodžio rodykles į šį laiką.`,
  setWhat: ["Traukinys išvyksta", "Pamoka prasideda", "Filmas prasideda", "Pietūs prasideda", "Koncertas prasideda", "Ekskursija prasideda", "Treniruotė prasideda", "Autobusas atvažiuoja", "Laivelis išplaukia", "Pyragas išimamas iš orkaitės"],
  h24Q: (what, t) => `${what} ${t}. Pasuk laikrodžio rodykles į šį laiką (laikrodis rodo 12 valandų).`,
  conv24Q: (what, t) => `${what} ${t}. Kiek tai būtų 12 valandų laikrodyje?`,
  /* trukmė */
  durScen: [
    { ic: "train", q: (a, b) => `Traukinys išvyko ${a}, o atvyko ${b}. Kiek laiko jis keliavo?` },
    { ic: "bus", q: (a, b) => `Autobusas išvažiavo ${a}, o atvažiavo ${b}. Kiek laiko jis važiavo?` },
    { ic: "boat", q: (a, b) => `Laivelis išplaukė ${a}, o atplaukė ${b}. Kiek laiko jis plaukė?` },
    { ic: "film", q: (a, b) => `Filmas prasidėjo ${a}, o baigėsi ${b}. Kiek laiko jis truko?` },
    { ic: "note", q: (a, b) => `Koncertas prasidėjo ${a}, o baigėsi ${b}. Kiek laiko jis truko?` },
    { ic: "pot", q: (a, b) => `Pyragas orkaitėje kepė nuo ${a} iki ${b}. Kiek laiko jis kepė?` },
    { ic: "ball", q: (a, b) => `Treniruotė prasidėjo ${a}, o baigėsi ${b}. Kiek laiko ji truko?` },
    { ic: "book", q: (a, b, n) => `${n} pradėjo skaityti ${a}, o baigė ${b}. Kiek laiko skaitė ${n}?` },
    { ic: "brush", q: (a, b, n) => `${n} pradėjo piešti ${a}, o baigė ${b}. Kiek laiko piešė ${n}?` },
    { ic: "train", q: (a, b) => `Ekskursija prasidėjo ${a}, o baigėsi ${b}. Kiek laiko ji truko?` }
  ],
  durClocksScen: [
    { ic: "train", q: () => `Traukinys išvyko, kai laikrodis rodė pradžią, o atvyko, kai rodė pabaigą. Kiek laiko jis keliavo?` },
    { ic: "bus", q: () => `Autobusas važiavo nuo pirmo laikrodžio laiko iki antro. Kiek laiko jis važiavo?` },
    { ic: "film", q: () => `Filmas prasidėjo, kai laikrodis rodė pradžią, o baigėsi, kai rodė pabaigą. Kiek laiko jis truko?` },
    { ic: "boat", q: () => `Laivelis išplaukė pagal pirmą laikrodį, o atplaukė pagal antrą. Kiek laiko jis plaukė?` },
    { ic: "pot", q: () => `Pyragas kepė nuo pirmo laikrodžio laiko iki antro. Kiek laiko jis kepė?` },
    { ic: "ball", q: () => `Treniruotė prasidėjo ir baigėsi pagal du laikrodžius. Kiek laiko ji truko?` },
    { ic: "note", q: () => `Koncertas prasidėjo, kai laikrodis rodė pradžią, o baigėsi, kai rodė pabaigą. Kiek laiko jis truko?` }
  ],
  clockStart: "pradžia", clockEnd: "pabaiga",
  leftScen: [
    { ic: "book", q: (now, t) => `Dabar ${now}. Pamoka baigsis ${t}. Kiek minučių liko iki pabaigos?` },
    { ic: "train", q: (now, t) => `Dabar ${now}. Traukinys išvyksta ${t}. Kiek minučių liko laukti?` },
    { ic: "film", q: (now, t) => `Dabar ${now}. Filmas prasideda ${t}. Kiek minučių liko iki filmo?` },
    { ic: "pot", q: (now, t) => `Dabar ${now}. Pyragas bus iškeptas ${t}. Kiek minučių liko kepti?` },
    { ic: "ball", q: (now, t) => `Dabar ${now}. Rungtynės prasideda ${t}. Kiek minučių liko?` },
    { ic: "bus", q: (now, t) => `Dabar ${now}. Autobusas atvažiuos ${t}. Kiek minučių reikės laukti?` }
  ],
  cmpQ: (n1, a1, b1, n2, a2, b2) => `${n1} keliavo nuo ${a1} iki ${b1}, o ${n2} – nuo ${a2} iki ${b2}. Kas keliavo ilgiau?`,
  cmpEq: "Vienodai",
  /* kada bus */
  endScen: [
    { ic: "train", q: (a, d) => `Traukinys išvyksta ${a} ir važiuos ${d}. Kada jis atvažiuos?` },
    { ic: "bus", q: (a, d) => `Autobusas išvažiuoja ${a} ir važiuos ${d}. Kada jis atvažiuos?` },
    { ic: "boat", q: (a, d) => `Laivelis išplaukia ${a} ir plauks ${d}. Kada jis atplauks?` },
    { ic: "film", q: (a, d) => `Filmas prasideda ${a} ir trunka ${d}. Kada jis baigsis?` },
    { ic: "note", q: (a, d) => `Koncertas prasideda ${a} ir trunka ${d}. Kada jis baigsis?` },
    { ic: "pot", q: (a, d) => `Pyragas įdedamas į orkaitę ${a} ir kepa ${d}. Kada jį reikia išimti?` },
    { ic: "ball", q: (a, d) => `Treniruotė prasideda ${a} ir trunka ${d}. Kada ji baigsis?` },
    { ic: "book", q: (a, d, n) => `${n} pradeda skaityti ${a} ir skaitys ${d}. Kada ${n} baigs?` }
  ],
  endSetQ: (sc, a, d) => sc,
  startScen: [
    { ic: "train", q: (e, d) => `Traukinys atvyko ${e}. Kelionė truko ${d}. Kada jis išvyko?` },
    { ic: "bus", q: (e, d) => `Autobusas atvažiavo ${e}. Kelionė truko ${d}. Kada jis išvažiavo?` },
    { ic: "film", q: (e, d) => `Filmas baigėsi ${e} ir truko ${d}. Kada jis prasidėjo?` },
    { ic: "note", q: (e, d) => `Koncertas baigėsi ${e} ir truko ${d}. Kada jis prasidėjo?` },
    { ic: "pot", q: (e, d) => `Pyragas išimtas ${e}. Jis kepė ${d}. Kada jį įdėjo į orkaitę?` },
    { ic: "ball", q: (e, d) => `Treniruotė baigėsi ${e} ir truko ${d}. Kada ji prasidėjo?` },
    { ic: "boat", q: (e, d) => `Laivelis atplaukė ${e}. Kelionė truko ${d}. Kada jis išplaukė?` }
  ],
  twoScen: [
    { ic: "bus", q: (a, p, s, r) => `Autobusas išvažiavo ${a}. Pirmą kelio dalį jis važiavo ${p}, paskui ${s} stovėjo, o dar ${r} važiavo. Kada jis atvažiavo?` },
    { ic: "train", q: (a, p, s, r) => `Traukinys išvyko ${a}. Jis važiavo ${p}, stotelėje stovėjo ${s}, o paskui važiavo dar ${r}. Kada jis atvyko?` },
    { ic: "boat", q: (a, p, s, r) => `Laivelis išplaukė ${a}. Plaukė ${p}, uoste pastovėjo ${s}, o tada plaukė dar ${r}. Kada jis atplaukė?` },
    { ic: "ball", q: (a, p, s, r) => `Treniruotė prasidėjo ${a}. Pirma dalis truko ${p}, pertrauka – ${s}, o antra dalis – ${r}. Kada treniruotė baigėsi?` }
  ],
  readyScen: [
    { ic: "book", q: (t, w, r) => `Pamokos prasideda ${t}. Kelias į mokyklą užtrunka ${w}, o apsirengti ir pavalgyti reikia ${r}. Kada reikia atsikelti?` },
    { ic: "train", q: (t, w, r) => `Traukinys išvyksta ${t}. Iki stoties eiti ${w}, o susikrauti kuprinę reikia ${r}. Kada reikia pradėti ruoštis?` },
    { ic: "film", q: (t, w, r) => `Filmas prasideda ${t}. Iki kino teatro važiuoti ${w}, o bilietus pirkti ir eilėje stovėti – ${r}. Kada reikia išeiti iš namų?` },
    { ic: "ball", q: (t, w, r) => `Treniruotė prasideda ${t}. Iki salės eiti ${w}, o persirengti reikia ${r}. Kada reikia išeiti iš namų?` }
  ],
  /* tvarkaraštis */
  boardH: "Išvykimo lenta", boardNr: "Nr.", boardTo: "Kur", boardDep: "Išvyksta", boardArr: "Atvyksta",
  stations: ["Obelynas", "Ežerynė", "Pušynas", "Kalnelis", "Šaltinėlis", "Žydrynė", "Beržynas", "Gojelis", "Vyturėlis", "Upelynas"],
  trainLabel: (nr, to) => `Nr. ${nr} → ${to}`,
  boardFirstQ: (n, t) => `${n} atėjo į stotį ${t}. Kuris traukinys išvyks pirmas?`,
  boardWaitQ: (n, t) => `${n} atėjo į stotį ${t} ir lauks pirmo traukinio. Kiek laiko ${n} lauks?`,
  boardShortQ: "Kurio traukinio kelionė trumpiausia?",
  boardLongQ: "Kurio traukinio kelionė ilgiausia?",
  boardDurQ: (nr, to) => `Kiek laiko trunka kelionė traukiniu Nr. ${nr} į ${to}?`,
  boardBothQ: (n, early, late) => `${n} nori išvykti ne anksčiau kaip ${early} ir atvykti ne vėliau kaip ${late}. Kuris traukinys tinka?`,
  boardHomeQ: (n, nr, w) => `${n} nori suspėti į traukinį Nr. ${nr}. Iki stoties eiti ${w}. Kada reikia išeiti iš namų?`,
  boardAfterQ: (n, nr, t) => `${n} atvyko traukiniu Nr. ${nr}. Autobusas į kaimą išvažiuoja ${t}. Kiek laiko ${n} lauks autobuso?`,
  /* vienetai */
  unitFitQ: "Kuris matavimo vienetas čia tinkamiausias?",
  unitFit: [
    ["Kiek laiko trunka širdies dūžis?", "s"], ["Kiek laiko trunka žioviavimas?", "s"], ["Kiek laiko trunka plojimas delnais?", "s"],
    ["Kiek laiko trunka pamoka mokykloje?", "min"], ["Kiek laiko užtrunka išsivalyti dantis?", "min"], ["Kiek laiko užtrunka suvalgyti sumuštinį?", "min"],
    ["Kiek laiko trunka mokyklos diena?", "val"], ["Kiek laiko trunka naktinis miegas?", "val"], ["Kiek laiko trunka kelionė traukiniu į kitą miestą?", "val"],
    ["Kiek laiko trunka sprintas 100 metrų?", "s"], ["Kiek laiko užtrunka nusiplauti rankas?", "s"], ["Kiek laiko trunka futbolo rungtynių kėlinys?", "min"],
    ["Kiek laiko trunka pilnametražis filmas?", "val"], ["Kiek laiko užtrunka įpilti stiklinę vandens?", "s"], ["Kiek laiko trunka pertrauka tarp pamokų?", "min"],
    ["Kiek laiko trunka skrydis lėktuvu per vandenyną?", "val"], ["Kiek laiko trunka mirktelėjimas?", "s"], ["Kiek laiko užtrunka iškepti blynus?", "min"],
    ["Kiek laiko trunka čiaudulys?", "s"],
    ["Kiek laiko trunka vienas dainos posmelis?", "s"], ["Kiek laiko trunka krepšinio kėlinys?", "min"],
    ["Kiek laiko trunka keliavimas autobusu į kitą šalį?", "val"], ["Kiek laiko trunka vienas žingsnis?", "s"], ["Kiek laiko užtrunka pietauti mokyklos valgykloje?", "min"],
    ["Kiek laiko trunka darbo diena?", "val"], ["Kiek laiko užtrunka suvalgyti jogurtą?", "min"],
    ["Kiek laiko užtrunka užrišti batų raištelį?", "s"],
    ["Kiek laiko užtrunka užsidėti kepurę?", "s"],
    ["Kiek laiko trunka pasakos klausymasis prieš miegą?", "min"], ["Kiek laiko trunka skrydis lėktuvu iš Vilniaus į Londoną?", "val"],
    ["Kiek laiko užtrunka nusimaudyti po dušu?", "min"], ["Kiek laiko trunka šuolis į aukštį?", "s"]
  ],
  unitNames: { s: "sekundės", min: "minutės", val: "valandos" },
  toSecQ: (txt, n) => `${txt} Kiek tai sekundžių?`,
  toMinSecQ: (txt) => `${txt} Kiek tai minučių ir sekundžių?`,
  toMinQ: (txt) => `${txt} Kiek tai minučių?`,
  toHourMinQ: (txt) => `${txt} Kiek tai valandų ir minučių?`,
  wholeQ: (a, b) => `Pratęsk: ${a} = ?`,
  secScen: ["Daina groja", "Reklama trunka", "Šokio pasirodymas truko", "Kvėpavimo pratimas truko", "Šuolis į vandenį truko", "Nuotykių filmuko anonsas trunka"],
  minScen: ["Filmas trunka", "Ekskursija truko", "Treniruotė truko", "Kelionė autobusu truko", "Pyragas kepė", "Muziejuje praleista", "Žygis truko", "Pasakos skaitymas truko"],
  cmpUnitQ: (x, y) => `Kas ilgiau: ${x} ar ${y}?`,
  /* kalendorius */
  months: ["sausio", "vasario", "kovo", "balandžio", "gegužės", "birželio", "liepos", "rugpjūčio", "rugsėjo", "spalio", "lapkričio", "gruodžio"],
  monthsNom: ["Sausis", "Vasaris", "Kovas", "Balandis", "Gegužė", "Birželis", "Liepa", "Rugpjūtis", "Rugsėjis", "Spalis", "Lapkritis", "Gruodis"],
  weekdays: ["pirmadienis", "antradienis", "trečiadienis", "ketvirtadienis", "penktadienis", "šeštadienis", "sekmadienis"],
  weekdaysPl: ["pirmadienių", "antradienių", "trečiadienių", "ketvirtadienių", "penktadienių", "šeštadienių", "sekmadienių"],
  wdShort: ["Pr", "An", "Tr", "Kt", "Pn", "Št", "Sk"],
  date: (m, d) => `${T_months[m]} ${d} d.`,
  calWdQ: (m, d) => `Kokia savaitės diena yra ${m} ${d} d.? Pažiūrėk į kalendorių.`,
  calBetweenQ: (m1, d1, m2, d2) => `Pažiūrėk į kalendorių. Kiek dienų praėjo nuo ${m1} ${d1} d. iki ${m2} ${d2} d.?`,
  calWeeksQ: (m, d, w) => `Kelionė prasideda ${m} ${d} d. Po ${w} ${many(w, "savaitės", "savaičių", "savaičių")} bus šventė. Kokia tai data?`,
  calCountQ: (wd) => `Kiek ${wd} yra šiame mėnesyje? Suskaičiuok kalendoriuje.`,
  calLeftQ: (m, d, len) => `Šiandien ${m} ${d} d. Šis mėnuo turi ${len} d. Kiek dienų liko iki mėnesio pabaigos?`,
  calCrossQ: (m, d, n, len) => `Šiandien ${m} ${d} d. Kokia data bus po ${n} ${many(n, "dienos", "dienų", "dienų")}? Šis mėnuo turi ${len} d.`,
  calWdPlusQ: (wd, n) => `Šiandien ${wd}. Kokia savaitės diena bus po ${n} d.?`,
  daysSuffix: n => `${n} d.`,
  /* paaiškinimai */
  ok: "Teisingai!",
  bad: "Pažiūrėkime, kaip skaičiuoti",
  explain: {
    read: (h, m, nearH) => {
      const q = Math.floor(m / 5), r = m % 5;
      const min = m === 0 ? `Ilgoji rodyklė rodo ties 12 – tai 0 min, valanda pilna.` :
        r === 0 ? `Ilgoji rodyklė rodo ties skaičiumi ${q}: ${q} · 5 = ${m} min.` :
        `Ilgoji rodyklė už skaičiaus ${q || 12} dar ${r} ${many(r, "brūkšnelį", "brūkšnelius", "brūkšnelių")}: ${q * 5} + ${r} = ${m} min.`;
      return `Trumpoji rodyklė rodo valandas: jau praėjo ${h}${m === 0 ? ", todėl lygiai " + h + " val." : ""}. ${min} Laikas: ${h}:${String(m).padStart(2, "0")}.`;
    },
    swap: "Trumpoji rodyklė – valandos, ilgoji – minutės. Nesupainiok jų!",
    set: (h, m) => {
      const q = Math.floor(m / 5), r = m % 5;
      const mm = r === 0 ? `ilgoji rodyklė – ties skaičiumi ${q || 12}` : `ilgoji rodyklė – už skaičiaus ${q || 12} dar ${r} ${many(r, "brūkšnelis", "brūkšneliai", "brūkšnelių")}`;
      return `Trumpoji rodyklė – ties ${h}, ${mm}.`;
    },
    h24: (h24) => `Po pietų valandos skaičiuojamos toliau: 12 val. dienos po 12 eina 13. Norint rasti laikrodžio skaičių, iš ${h24} atimk 12: ${h24} − 12 = ${h24 - 12}.`,
    dur: (parts, total) => `Skaičiuok per pilnas valandas: ${parts.join(" + ")} = ${total}.`,
    durSame: (a, b, total) => `Valanda ta pati, todėl atimk minutes: ${b} − ${a} = ${total}.`,
    add: steps => steps.join(" ") ,
    sub: steps => steps.join(" "),
    two: (total, parts) => `Sudėk visas dalis: ${parts.join(" + ")} = ${total}. Tada pridėk prie pradžios laiko.`,
    ready: (total, parts) => `Pirma sudėk visą reikalingą laiką: ${parts.join(" + ")} = ${total}. Tada atimk jį iš pradžios laiko.`,
    boardFirst: "Pirmas išvyksta tas traukinys, kurio išvykimo laikas yra artimiausias po atėjimo laiko.",
    boardBoth: "Patikrink abu reikalavimus: išvyksta ne per anksti IR atvyksta ne per vėlai. Tinka tik vienas traukinys.",
    boardShort: "Kiekvieno traukinio kelionės trukmė = atvykimo laikas − išvykimo laikas.",
    units: (a, b) => `${a}. ${b}`,
    min60: "1 min = 60 s, 1 val. = 60 min.",
    cal: "Dienų skirtumas – tai atimtis: didesnė data − mažesnė data.",
    weekAdd: "Savaitėje 7 dienos, todėl po 1 savaitės data padidėja 7: po 2 savaičių – 14, po 3 – 21.",
    wdMod: "Savaitė kartojasi kas 7 dienas. Po 7 dienų – ta pati savaitės diena, todėl skaičiuok tik likusias dienas.",
    left: "Dienų iki mėnesio pabaigos = mėnesio dienų skaičius − šiandienos data.",
    cross: "Pridėk dienas. Jei data viršija mėnesio dienų skaičių, atimk jį – likutis yra kito mėnesio data."
  },
  /* „Noriu pasimokyti“ */
  topics: [
    { name: "Kaip skaityti laikrodį", level: 0, html: `<p>Laikrodis turi dvi rodykles: <b>trumpoji – valandos</b>, <b>ilgoji – minutės</b>.</p><p>Ilgajai rodyklei apsisukus aplink laikrodį, praeina <b>60 min</b> = <b>1 valanda</b>. Kiekvienas skaičius – 5 min: ties 1 – 5 min, ties 2 – 10 min, ties 3 – 15 min, ties 6 – 30 min, ties 9 – 45 min.</p><span class="mk-ex">Tarp skaičių yra brūkšneliai – kiekvienas lygus 1 min.</span><p>Kai ilgoji rodyklė rodo ties 12, valanda pilna, pvz., 7:00.</p>` },
    { name: "12 ir 24 valandų laikas", level: 0, html: `<p>Parą sudaro 24 valandos, o laikrodis rodo tik 12. Todėl per parą trumpoji rodyklė apsisuka du kartus.</p><p>Po pietų valandos skaičiuojamos toliau: 13, 14, 15 … 24. Norėdamas rasti skaičių ant laikrodžio, <b>atimk 12</b>.</p><span class="mk-ex">15:20 – laikrodyje trumpoji rodyklė ties 3 (15 − 12 = 3), ilgoji – ties 4.</span>` },
    { name: "Kiek truko? (trukmė)", level: 1, html: `<p>Trukmė = pabaigos laikas − pradžios laikas. Patogu skaičiuoti <b>per pilną valandą</b>.</p><span class="mk-ex">Nuo 8:50 iki 9:25:<br>8:50 → 9:00 yra 10 min,<br>9:00 → 9:25 yra 25 min.<br>10 + 25 = 35 min.</span><p>Jei praėjo kelios valandos, valandas skaičiuok atskirai: nuo 8:20 iki 11:05 = 40 min (iki 9:00) + 2 val. (iki 11:00) + 5 min = 2 val. 45 min.</p>` },
    { name: "Kada bus? (pridėk ir atimk)", level: 2, html: `<p>Žinai pradžią ir trukmę – laiką <b>pridėk</b>. Žinai pabaigą ir trukmę – <b>atimk</b>.</p><span class="mk-ex">8:50 + 35 min:<br>iki 9:00 – 10 min, dar 25 min → 9:25.</span><span class="mk-ex">9:25 − 40 min:<br>nuo 9:25 iki 9:00 – 25 min, dar 15 min → 8:45.</span><p>Kai reikia kelių dalių (kelias, pasiruošimas), pirma sudėk visas dalis.</p>` },
    { name: "Tvarkaraštis", level: 3, html: `<p>Tvarkaraštyje (lentoje) surašyti išvykimo ir atvykimo laikai. Perskaityk klausimą ir ieškok <b>tik to, ko klausia</b>.</p><ul><li>Pirmas po tavo atėjimo – pirmas išvykimo laikas, <b>vėlesnis</b> už tavo atėjimo laiką.</li><li>Kelionės trukmė = atvykimas − išvykimas.</li><li>Kai traukinys turi tikti pagal du reikalavimus – patikrink abu.</li></ul>` },
    { name: "Sekundės, minutės, valandos", level: 4, html: `<p><b>1 min = 60 s</b> ir <b>1 val. = 60 min</b>.</p><p>Minutes verčiant į sekundes – <b>dauginame iš 60</b>: 3 min = 3 · 60 = 180 s. Sekundes verčiant į minutes – <b>dalijame iš 60</b>: 150 s = 2 min 30 s (nes 150 = 120 + 30).</p><span class="mk-ex">2 val. 15 min = 2 · 60 + 15 = 135 min.</span><p>Trumpiausiems dalykams (mirktelėjimas, plojimas) tinka sekundės, pamokai – minutės, ilgai dienai – valandos.</p>` },
    { name: "Kalendorius", level: 5, html: `<p>Savaitėje <b>7 dienos</b>: pirmadienis, antradienis, trečiadienis, ketvirtadienis, penktadienis, šeštadienis, sekmadienis.</p><p>Kalendoriuje viena eilutė – viena savaitė. Po <b>7 dienų</b> būna ta pati savaitės diena, o data padidėja 7.</p><span class="mk-ex">Nuo spalio 5 d. iki spalio 19 d. praėjo 19 − 5 = 14 d. (2 savaitės).</span><p>Mėnesiai turi skirtingą dienų skaičių (28, 30 ar 31). Perėjus per mėnesio galą, atimk mėnesio dienų skaičių.</p>` }
  ]
};
/* pagalbinis masyvas date() funkcijai */
const T_months = window.MK_T.months;
})();
