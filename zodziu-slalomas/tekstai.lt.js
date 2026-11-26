/* Žodžių slalomas – visi mokiniui rodomi tekstai (lietuvių k.). Verčiant užtenka išversti šį failą (žodžių formos – zodziai.js).
   Terminai – pagal Lietuvių kalbos ir literatūros bendrąją programą: 5 kl. – asmenuojamosios veiksmažodžio formos, tiesioginės nuosakos laikai;
   6 kl. – nuosakos (tiesioginė, tariamoji, liepiamoji); 7 kl. – neasmenuojamosios veiksmažodžio formos: dalyvis (veikiamieji ir neveikiamieji
   dalyviai, dalyvių laikai), pusdalyvis, padalyvis; 8 kl. – kartojimas. */
window.MK_T = {
  title: "Žodžių slalomas",
  h1: "Žodžių slalomas",
  lead: "Leiskis kalno trasa ir važiuok tik pro tuos vartus, ant kurių – reikiamos formos veiksmažodis.",
  note: n => `Trasose – ${n} skirtingų žodžių, tad vartai beveik nesikartoja.`,
  tracksT: "Trasos",
  grade: g => `${g} kl.`,
  tracks: {
    t1: { name: "Laikų trasa", sub: "Esamasis, būtasis kartinis, būtasis dažninis, būsimasis laikas ir bendratis", grade: "5" },
    t2: { name: "Nuosakų trasa", sub: "Tiesioginė, tariamoji ir liepiamoji nuosaka", grade: "6" },
    t3: { name: "Dalyvis, pusdalyvis, padalyvis", sub: "Neasmenuojamosios veiksmažodžio formos", grade: "7" },
    t4: { name: "Veikiamieji ir neveikiamieji", sub: "Dalyvių rūšys", grade: "7" },
    t5: { name: "Dalyvių laikai", sub: "Esamojo ir būtojo laiko dalyviai", grade: "7" },
    t6: { name: "Didysis slalomas", sub: "Visos veiksmažodžio formos – greitesnė trasa", grade: "8" }
  },
  /* tikslai: [vardininkas, galininkas (po „Važiuok pro“)] */
  targets: {
    B: ["bendratis", "BENDRATĮ"], E: ["esamasis laikas", "ESAMĄJĮ LAIKĄ"], K: ["būtasis kartinis laikas", "BŪTĄJĮ KARTINĮ LAIKĄ"], D: ["būtasis dažninis laikas", "BŪTĄJĮ DAŽNINĮ LAIKĄ"],
    S: ["būsimasis laikas", "BŪSIMĄJĮ LAIKĄ"], TIES: ["tiesioginė nuosaka", "TIESIOGINĘ NUOSAKĄ"], T: ["tariamoji nuosaka", "TARIAMĄJĄ NUOSAKĄ"], L: ["liepiamoji nuosaka", "LIEPIAMĄJĄ NUOSAKĄ"],
    DAL: ["dalyvis", "DALYVĮ"], P: ["pusdalyvis", "PUSDALYVĮ"], A: ["padalyvis", "PADALYVĮ"], VEIK: ["veikiamasis dalyvis", "VEIKIAMĄJĮ DALYVĮ"], NEV: ["neveikiamasis dalyvis", "NEVEIKIAMĄJĮ DALYVĮ"],
    DES: ["esamojo laiko dalyvis", "ESAMOJO LAIKO DALYVĮ"], DBUT: ["būtojo laiko dalyvis", "BŪTOJO LAIKO DALYVĮ"]
  },
  /* kiekvienos žodžio formos pavadinimas paaiškinimui */
  cats: {
    B: "bendratis", E: "esamasis laikas", K: "būtasis kartinis laikas", D: "būtasis dažninis laikas", S: "būsimasis laikas", T: "tariamoji nuosaka", L: "liepiamoji nuosaka",
    VE: "veikiamasis esamojo laiko dalyvis", VB: "veikiamasis būtojo laiko dalyvis", NE: "neveikiamasis esamojo laiko dalyvis", NB: "neveikiamasis būtojo laiko dalyvis", P: "pusdalyvis", A: "padalyvis"
  },
  hud: {
go: "Važiuok pro", exit: "Baigti", start: "Paliesk kortelę su tinkamu žodžiu – ir pirmyn!", startKeys: "Rodyklės ← → keičia vėžę.",
    startFree: "Vairuoji pats: vilk pirštu į šonus. Paliesk ekraną – ir pirmyn!", startFreeKeys: "Vairuoji pats: laikyk rodykles ← → arba vilk pele. Spausk rodyklę – ir pirmyn!",
    newTarget: "Naujas tikslas!", gate: (i, n) => `${i} / ${n}`, finish: "FINIŠAS", startArch: "STARTAS"
  },
  fb: {
    ok: ["Tiksliai!", "Švariai!", "Puikus posūkis!", "Taip!", "Šaunu!"],
    wrong: (w, cat, right) => `„${w}“ – ${cat}. Tiko „${right}“.`
  },
  rep: {
    title: "Trasa įveikta!", gates: (a, b) => `Teisingi vartai: ${a} iš ${b}`, crystals: n => `Kristalai: +${n}`, mistakes: "Kur suklydai",
    row: (w, cat) => `„${w}“ – ${cat}`, again: "Dar kartą", menu: "Į trasų sąrašą", next: "Kita trasa",
    line: ["Trasa klastinga – pabandyk dar kartą ir drąsiau stabdyk.", "Geras važiavimas!", "Tobula trasa – nė vienos klaidos!"],
    outfit: n => `Atrakinta nauja apranga: ${n}!`
  },
  ctrlT: "Valdymas",
  ctrl: { cards: ["Kortelėmis", "Paliesk kortelę su žodžiu – slidininkas pats nuvažiuos į tą vėžę."], free: ["Vairuoju pats", "Vilk pirštu į šonus arba laikyk rodykles – slidininką vairuoji pats."] },
  outfitsT: "Apranga", crystalsT: n => `Tavo kristalai: ${n}`, outfitLock: n => `nuo ${n}`,
  outfits: ["Raudona", "Mėlyna", "Žalia", "Violetinė", "Oranžinė", "Auksinė"],
  learnT: "Trenerio užrašai",
  learn: [
    { name: "Asmenuojamosios formos ir laikai (5 kl.)", html: "<p>Veiksmažodis asmenuojamas: <i>aš bėgu, tu bėgi, jis bėga, mes bėgame, jūs bėgate</i>. Tiesioginė nuosaka turi keturis laikus:</p><p><b>esamasis</b> – <i>bėgu, rašo</i>; <b>būtasis kartinis</b> – <i>bėgau, rašė</i>; <b>būtasis dažninis</b> – <i>bėgdavau, rašydavo</i> (priesaga <b>-dav-</b>); <b>būsimasis</b> – <i>bėgsiu, rašys</i> (priesaga <b>-s-</b>).</p><p><b>Bendratis</b> – pagrindinė veiksmažodžio forma, atsako į klausimą <i>ką daryti? ką veikti?</i> ir baigiasi <b>-ti</b>: <i>bėgti, rašyti</i>.</p>" },
    { name: "Nuosakos (6 kl.)", html: "<p><b>Tiesioginė nuosaka</b> sako, kas vyksta, vyko ar vyks: <i>skaitau, skaičiau, skaitysiu</i>.</p><p><b>Tariamoji nuosaka</b> reiškia galimą ar norimą veiksmą: <i>skaityčiau, skaitytum, skaitytų, skaitytume, skaitytumėte</i>.</p><p><b>Liepiamoji nuosaka</b> reiškia liepimą, raginimą, prašymą: <i>skaityk, skaitykime, skaitykite</i> (priesaga <b>-k-</b>).</p>" },
    { name: "Dalyvis (7 kl.)", html: "<p><b>Dalyvis</b> – neasmenuojamoji veiksmažodžio forma, turinti ir veiksmažodžio, ir būdvardžio ypatybių: jis linksniuojamas ir atsako į klausimus <i>koks? kokia? ką darantis? ką padarytas?</i></p><p><b>Veikiamieji dalyviai</b> reiškia paties veikėjo veiksmą: esamojo laiko – <i>bėgantis, rašanti</i>; būtojo laiko – <i>bėgęs, rašiusi</i>.</p><p><b>Neveikiamieji dalyviai</b> reiškia ypatybę, atsiradusią dėl kito veikėjo veiksmo: esamojo laiko – <i>rašomas, nešama</i>; būtojo laiko – <i>rašytas, nešta</i>.</p>" },
    { name: "Pusdalyvis ir padalyvis (7 kl.)", html: "<p><b>Pusdalyvis</b> reiškia šalutinį to paties veikėjo veiksmą ir turi priesagą <b>-dam-</b>: <i>eidamas dainavo, skaitydama šypsojosi</i>. Jis kaitomas tik gimine ir skaičiumi.</p><p><b>Padalyvis</b> reiškia šalutinį veiksmą, kurį atlieka kitas veikėjas arba kuris veikėjo neturi; jis nekaitomas: <i>saulei tekant, lietui nustojus</i>. Esamojo laiko – <b>-ant, -int</b>, būtojo – <b>-us</b>.</p>" },
    { name: "Kaip važiuoti", html: "<p>Ant artėjančių vartų – trys žodžiai, tie patys žodžiai rodomi ir kortelėse apačioje. Važiuok pro vartus su tinkamos formos žodžiu.</p><p><b>Kortelėmis:</b> paliesk kortelę su tinkamu žodžiu (arba spausk rodykles ← →) – slidininkas persirikiuos į tą vėžę. <b>Vairuoju pats:</b> vilk pirštu į šonus arba laikyk rodykles – slidininkas važiuoja ten, kur jį vedi.</p><p>Kol tikslas tas pats, tempas vis didėja. Prieš naują tikslą trasa pasuka – rodyklių skydai įspėja, kad užduotis keisis, o tempas trumpam sulėtėja. Pakeliui rink kristalus: už juos atrakinama nauja apranga.</p>" }
  ]
};
