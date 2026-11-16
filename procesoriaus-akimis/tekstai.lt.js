/* MokomėsKartu.lt – „Procesoriaus akimis“ (8–10 kl., informatika): visi mokiniui rodomi tekstai. */
(function(){
"use strict";
const c = s => `<code>${s}</code>`;
const D = L => L === "py" ? "//" : "/";
/* teorijos pavyzdys abiem kalbomis */
const two = (py, cpp) => `<div class="lc2"><div><small>Python</small><pre>${py}</pre></div><div><small>C++</small><pre>${cpp}</pre></div></div>`;

window.MK_T = {
  title: "Procesoriaus akimis",
  heroH: "Procesoriaus <em>akimis</em>",
  heroP: "Skaityk programą taip, kaip ją vykdo kompiuteris – eilutė po eilutės. Sek kintamųjų reikšmes, dėliok programas ir gaudyk klaidas.",
  artAria: "Čipas – procesorius su rankomis ir kojomis – rodo į vykdomą programos eilutę; šalia – atminties stalčiai su kintamųjų reikšmėmis ir ekranas.",
  langLabel: "Programavimo kalba",
  langNote: { py: "Programos rodomos Python kalba.", cpp: "Programos rodomos C++ kalba (tik pagrindinė dalis – be #include ir main)." },
  langs: { py: "Python", cpp: "C++" },
  levels: [
    { id: "k", name: "Kintamieji", sub: "Reikšmių priskyrimas, veiksmai, dalyba ir liekana" },
    { id: "p", name: "Pasirinkimo komanda", sub: "if, else, kelios sąlygos, „ir“, „arba“, „ne“" },
    { id: "c", name: "Kartojimo komanda", sub: "Ciklai for ir while, kaupimas, skaičiavimas" },
    { id: "d", name: "Sudėk programą", sub: "Surikiuok eilutes – viena jų nereikalinga" },
    { id: "e", name: "Rask klaidą", sub: "Programos derinimas: sintaksės ir loginės klaidos" },
    { id: "f", name: "Paprogramės", sub: "Parametrai, return, reikšmės perdavimas (9–10 kl.)" },
    { id: "x", name: "Programuotojo egzaminas", sub: "10 mišrių užduočių" }
  ],
  boardH: "Mikroschemų plokštė",
  boardP: (n, all, rank) => `Kiekviena iš pirmo karto išspręsta naujo tipo užduotis įlituoja po mikroschemą. Įlituota: <b>${n} iš ${all}</b>. Tavo vardas: <b>${rank}</b>.`,
  ranks: [[0, "Naujokas"], [8, "Kodo skaitytojas"], [25, "Derintojas"], [50, "Programuotojas"], [85, "Algoritmų meistras"], [128, "Procesoriaus brolis"]],
  boardAria: (n, all) => `Mikroschemų plokštė: įlituota ${n} iš ${all} mikroschemų.`,
  pts: "taškai",
  figAria: "Programos tekstas",
  and: " ir ",
  q: {
    out: "Ką ši programa išves į ekraną?",
    seq: "Ką ši programa išves į ekraną? Skaičius rašyk iš eilės, tarp jų – tarpas.",
    val: v => `Kokia bus kintamojo ${c(v)} reikšmė, kai programa bus įvykdyta?`,
    count: n => `Kiek kartų bus įvykdyta ${n}-oji eilutė?`,
    formal: fn => `Kurie yra paprogramės ${c(fn)} <b>formalieji</b> parametrai?`,
    actual: fn => `Kurie <b>faktiniai</b> parametrai perduodami kviečiant paprogramę ${c(fn)}?`,
    pars: "Sudėk programą: liesk eilutes tokia tvarka, kokia jos turi būti programoje. Viena eilutė gali būti nereikalinga.",
    pars0: "Sudėk programą: liesk eilutes tokia tvarka, kokia jos turi būti programoje.",
    bug: (exp, got) => `Programoje yra <b>loginė klaida</b>: ji išveda ${c(got)}, o turėtų išvesti ${c(exp)}. Paliesk eilutę, kurioje klaida.`,
    syn: "Programa nepasileidžia – joje yra <b>sintaksės klaida</b>. Paliesk eilutę, kurioje ji yra."
  },
  goalL: "Užduotis",
  optBoth: "Abu žodžius",
  optNone: "Nieko neišves",
  goals: {
    sum: n => `Programa turi apskaičiuoti ir išvesti visų sveikųjų skaičių nuo 1 iki ${n} sumą.`,
    max2: () => "Programa turi išvesti didesnįjį iš skaičių a ir b.",
    evens: (a, b) => `Programa turi suskaičiuoti, kiek lyginių skaičių yra nuo ${a} iki ${b} (imtinai), ir išvesti jų kiekį.`,
    swap: () => "Programa turi sukeisti kintamųjų a ir b reikšmes vietomis ir jas išvesti.",
    fact: n => `Programa turi apskaičiuoti ir išvesti sandaugą 1 · 2 · … · ${n}.`,
    digsum: () => "Programa turi apskaičiuoti ir išvesti skaičiaus n skaitmenų sumą.",
    down: n => `Programa turi išvesti skaičius nuo ${n} iki 1 mažėjimo tvarka.`,
    dbl: n => `Skaičius 1 dvigubinamas tol, kol tampa ne mažesnis už ${n}. Programa turi išvesti, kiek kartų jis buvo padvigubintas.`,
    sqsum: (a, b) => `Programa turi, naudodama paprogramę kv, apskaičiuoti ir išvesti skaičių ${a} ir ${b} kvadratų sumą.`,
    absd: () => "Programa turi išvesti, kiek skiriasi skaičiai a ir b (iš didesniojo atimamas mažesnysis).",
    pow: (a, k) => `Programa turi apskaičiuoti ir išvesti laipsnį ${a}<sup>${k}</sup> (sandaugą iš ${k} dauginamųjų, lygių ${a}).`,
    mult: (n, k) => `Programa turi išvesti visus skaičius nuo 1 iki ${n}, kurie dalijasi iš ${k}.`,
    gcd: () => "Programa turi Euklido algoritmu rasti ir išvesti skaičių a ir b didžiausiąjį bendrąjį daliklį.",
    odds: n => `Programa turi apskaičiuoti ir išvesti nelyginių skaičių nuo 1 iki ${n} sumą.`,
    ticket: () => "Bilieto kaina: vaikams iki 7 metų – 0 €, nuo 7 iki 17 metų – 5 €, nuo 18 metų – 10 €. Programa turi išvesti bilieto kainą pagal amžių.",
    min3: () => "Programa turi išvesti mažiausią iš skaičių a, b ir c.",
    divs: () => "Programa turi suskaičiuoti ir išvesti, kiek daliklių turi skaičius n.",
    save: (t, k) => `Kas mėnesį į taupyklę įdedama po ${k} €. Programa turi išvesti, po kelių mėnesių taupyklėje bus ne mažiau kaip ${t} €.`,
    fib: n => `Fibonačio seka: 0, 1, 1, 2, 3, 5, 8, 13, … (kiekvienas narys – dviejų ankstesnių suma). Programa turi išvesti narį, iki kurio nuo 0 nueinama per ${n} žingsnius.`,
    sumrange: (a, b) => `Programa turi, naudodama paprogramę suma, apskaičiuoti ir išvesti visų sveikųjų skaičių nuo ${a} iki ${b} sumą.`,
    rev: () => "Programa turi išvesti skaičių n, užrašytą atvirkščia skaitmenų tvarka.",
    disc: () => "Jei pirkinių suma ne mažesnė kaip 50 €, taikoma 10 € nuolaida. Programa turi išvesti mokėtiną sumą.",
    tri: n => `Pirmoje eilėje – 1 kėdė, antroje – 2, trečioje – 3 ir t. t. Programa turi po vieną suskaičiuoti, kiek kėdžių yra ${n} eilėse, ir išvesti jų skaičių.`
  },
  /* taisyklės paaiškinimams; L – "py" arba "cpp" */
  rules: {
    prec: () => "Reiškinyje pirmiausia atliekami veiksmai skliaustuose, tada daugyba ir dalyba, galiausiai – sudėtis ir atimtis.",
    seq: () => "Komandos vykdomos iš eilės, po vieną. Priskyrimo sakinyje pirmiausia apskaičiuojama dešinioji pusė (su dabartinėmis kintamųjų reikšmėmis), tada rezultatas įrašomas į kintamąjį kairėje.",
    copy: () => "Sakinys b = a nukopijuoja reikšmę. Vėliau pakeitus a, kintamojo b reikšmė nepasikeičia.",
    swap: () => "Dviejų kintamųjų reikšmėms sukeisti reikia trečio, pagalbinio, kintamojo: jame išsaugoma reikšmė, kuri kitaip dingtų.",
    swapbad: () => "Priskyrus kintamajam naują reikšmę, senoji dingsta. Todėl a = b, o po to b = a reikšmių nesukeičia – abu kintamieji tampa vienodi.",
    divmod: L => `Sveikųjų skaičių dalyba ${c(D(L))} atmeta liekaną, o ${c("%")} grąžina dalybos liekaną. ${c("n % 10")} – paskutinis skaitmuo, ${c("n " + D(L) + " 10")} – skaičius be paskutinio skaitmens.`,
    aug: () => `${c("x += 3")} reiškia tą patį, ką ${c("x = x + 3")}. Taip pat veikia ${c("-=")} ir ${c("*=")}.`,
    ifelse: () => "Pasirinkimo komanda: jei sąlyga teisinga, vykdoma pirmoji šaka, jei klaidinga – šaka po else. Visada įvykdoma tik viena iš jų.",
    elif: () => "Sąlygos tikrinamos iš eilės nuo viršaus. Įvykdoma tik pirmoji šaka, kurios sąlyga teisinga, – likusios nebetikrinamos.",
    twoif: () => "Tai atskiros pasirinkimo komandos (ne else šakos): kiekviena sąlyga tikrinama iš naujo, jau su pakeistomis kintamųjų reikšmėmis.",
    nested: () => "Vidinė pasirinkimo komanda tikrinama tik tada, kai programa patenka į tą išorinės komandos šaką, kurioje ji parašyta.",
    and: L => `Loginė operacija „ir“ (${c(L === "py" ? "and" : "&&")}) teisinga tik tada, kai teisingos abi sąlygos.`,
    or: L => `Loginė operacija „arba“ (${c(L === "py" ? "or" : "||")}) teisinga, kai teisinga bent viena sąlyga.`,
    not: L => `Loginė operacija „ne“ (${c(L === "py" ? "not" : "!")}) apverčia sąlygą: teisinga tampa klaidinga, o klaidinga – teisinga.`,
    ifonly: () => "Jei sąlyga klaidinga, o else šakos nėra, pasirinkimo komandos sakiniai praleidžiami ir programa tęsiama toliau.",
    acc: () => "Kaupimas: prieš ciklą kintamajam suteikiama pradinė reikšmė, o kiekvieną kartą kartojant ji papildoma.",
    range: L => L === "py" ? `${c("range(a, b)")} pateikia skaičius nuo a iki b − 1: pats skaičius b į ciklą nepatenka.` : `Ciklas kartojamas tol, kol sąlyga (pvz., ${c("i <= 5")}) teisinga; po kiekvieno kartojimo ${c("i++")} padidina i vienetu.`,
    step: L => L === "py" ? `Trečias ${c("range")} skaičius – žingsnis: ${c("range(2, 9, 2)")} duoda 2, 4, 6, 8. Neigiamas žingsnis skaičiuoja atgal.` : `${c("i += 2")} didina i po 2, ${c("i--")} mažina po 1. Ciklas baigiamas, kai sąlyga tampa klaidinga.`,
    forif: () => "Pasirinkimo komanda ciklo viduje tikrinama kiekvieną kartą iš naujo – su nauja ciklo kintamojo reikšme.",
    while: () => "Ciklas while kartojamas tol, kol sąlyga teisinga. Sąlyga tikrinama prieš kiekvieną kartojimą; kai ji tampa klaidinga, programa tęsiama po ciklo.",
    digits: L => `${c("n % 10")} paima paskutinį skaitmenį, ${c("n " + D(L) + " 10")} jį nubraukia. Kartojant tai cikle, peržiūrimi visi skaičiaus skaitmenys.`,
    fib: () => "Kiekvieną kartą kintamųjų reikšmės „pasislenka“. Svarbi priskyrimų tvarka: dešinėje pusėje naudojamos dar senos reikšmės.",
    nestloop: () => "Vidinis ciklas visas įvykdomas kiekvieną kartą, kai kartojamas išorinis ciklas.",
    euclid: () => "Euklido algoritmas: didžiausiasis bendrasis daliklis randamas kartojant dalybą su liekana tol, kol liekana tampa lygi 0.",
    last: () => "Sakinys s = … reikšmę kiekvieną kartą pakeičia (nekaupia), todėl po ciklo lieka tik paskutinio kartojimo rezultatas.",
    fn: () => "Paprogramė gauna reikšmes per parametrus, o sakinys return grąžina rezultatą į tą vietą, iš kurios paprogramė buvo iškviesta.",
    fnret: () => "Įvykdžius return, paprogramės darbas iškart baigiamas – tolesni jos sakiniai nebevykdomi.",
    byval: () => "Parametras gauna reikšmės kopiją (reikšmės perdavimas). Keičiant parametrą paprogramėje, pagrindinės programos kintamasis nesikeičia, net jei jų vardai vienodi.",
    proc: () => "Paprogramė gali nieko negrąžinti – tiesiog atlikti veiksmus (pvz., išvesti). Kiekvienas iškvietimas ją įvykdo iš naujo su naujomis parametrų reikšmėmis.",
    order: () => "Faktiniai parametrai priskiriami formaliesiems iš eilės: pirmas – pirmam, antras – antram. Vardai nesvarbūs, svarbi tik tvarka.",
    params: () => "Formalieji parametrai rašomi paprogramės antraštėje. Faktiniai parametrai – tai reikšmės, kurios perduodamos kviečiant paprogramę.",
    /* loginės klaidos */
    init: () => "Neteisinga pradinė reikšmė: kaupti reikia pradėti nuo tinkamo skaičiaus (sumą ir kiekį – nuo 0).",
    init0: () => "Sandaugos pradinė reikšmė turi būti 1: padauginus iš 0, rezultatas visada 0.",
    bound: () => "Neteisingos ciklo ribos: ciklas kartojamas ne tiek kartų, kiek reikia.",
    bound0: () => "Ciklas pradedamas nuo 0, todėl sandauga iškart tampa lygi 0.",
    accum: () => "Neteisingas veiksmas ciklo viduje: reikšmė keičiama ne taip, kaip reikalauja užduotis.",
    cond: () => "Neteisinga sąlyga: ne tas palyginimo ženklas arba lyginami ne tie dydžiai.",
    branch: () => "Šioje šakoje atliekamas ne tas veiksmas.",
    wrongvar: () => "Naudojamas ne tas kintamasis.",
    stepbug: () => "Neteisingas žingsnis: dalis skaičių praleidžiama arba paimami nereikalingi.",
    fnbody: () => "Paprogramė grąžina ne tą reikšmę.",
    nocall: () => "Paprogramė neiškviečiama ten, kur jos reikia.",
    argorder: () => "Sukeista tvarka: atimant ir perduodant parametrus tvarka svarbi.",
    /* sintaksės klaidos */
    colon: () => "Python kalboje antraštės (if, else, for, while, def) eilutė turi baigtis dvitaškiu.",
    eqeq: () => `Lyginama dviem lygybės ženklais ${c("==")}. Vienas ${c("=")} reiškia priskyrimą, todėl sąlygoje tai sintaksės klaida.`,
    paren: () => "Kiekvienas atidarytas skliaustas turi būti uždarytas.",
    semi: () => "C++ kalboje sakinys turi baigtis kabliataškiu.",
    parenc: () => "C++ kalboje sąlyga rašoma skliaustuose – čia trūksta uždarančiojo skliausto.",
    cout: () => `Išvedant rašoma ${c("cout <<")}. Ženklai ${c(">>")} vartojami tik įvedant (${c("cin >>")}).`,
    brace: () => `Blokas toliau uždaromas skliaustu ${c("}")}, bet šioje eilutėje trūksta jį atidarančio ${c("{")}.`
  },
  /* vykdymo eigos žingsnių paaiškinimai */
  note: s => {
    const n = s.n, b = x => `<b>${x}</b>`;
    switch(n.k){
      case "set": return `Kintamajam ${b(n.v)} priskiriama reikšmė ${b(n.val)}.`;
      case "out": return `Į ekraną išvedama: ${b(n.val)}.`;
      case "if": return n.c ? "Sąlyga teisinga – vykdoma ši šaka." : "Sąlyga klaidinga – ši šaka praleidžiama.";
      case "else": return "Nė viena sąlyga nebuvo teisinga – vykdoma else šaka.";
      case "for": return `Ciklo kintamasis ${b(n.v)} = ${b(n.val)} – vykdomi kartojami sakiniai.`;
      case "forend": return "Ciklas baigtas – programa tęsiama po jo.";
      case "wh": return n.c ? "Sąlyga teisinga – kartojame." : "Sąlyga klaidinga – ciklas baigtas.";
      case "call": return `Kviečiama paprogramė ${b(n.f)}; jos parametrai gauna reikšmes: ${b(n.a.join(", "))}.`;
      case "ret": return `Paprogramė grąžina ${b(n.val)}.`;
    }
    return "";
  },
  errs: {
    indent: "Ši eilutė atitraukta, bet prieš ją nėra antraštės (if, for, while…), kuriai ji priklausytų.",
    empty: "Po šios antraštės turi eiti bent viena jai priklausanti (atitraukta) eilutė.",
    else: "Šaka else gali eiti tik iškart po if bloko.",
    name: v => `Kintamasis ${c(v)} naudojamas anksčiau, nei jam priskirta reikšmė.`,
    nofn: v => `Paprogramė ${c(v)} kviečiama anksčiau, nei ji aprašyta.`,
    zero: "Programoje dalijama iš nulio.",
    loop: "Programa niekada nesibaigia – ciklo sąlyga visą laiką lieka teisinga.",
    ret: "Sakinys return gali būti tik paprogramės viduje.",
    wrong: (exp, got) => `Programa veikia, bet išveda ${got ? c(got) : "ne tai"}, o turėtų išvesti ${c(exp)}.`,
    none: exp => `Programa nieko neišveda, o turėtų išvesti ${c(exp)}.`,
    hidden: "Su šiais duomenimis rezultatas teisingas, tačiau su kitais pradiniais duomenimis programa suklystų. Gera programa turi veikti su visais duomenimis.",
    line: n => `${n} eilutė: `
  },
  ui: {
    check: "Tikrinti", next: "Toliau", finish: "Baigti", again: "Bandyk dar kartą",
    hint: "Dar ne. Užuomina: pažiūrėk, kaip procesorius vykdo pirmuosius žingsnius, ir tęsk pats.",
    hintBug: "Ne ši eilutė. Pabandyk mintyse įvykdyti programą žingsnis po žingsnio ir palygink su užduotimi.",
    hintSyn: "Ne ši eilutė. Atidžiai peržiūrėk skyrybos ženklus ir skliaustus kiekvienoje eilutėje.",
    ans: "Tavo atsakymas", space: "tarpas", del: "Trinti",
    mem: "Atmintis", memFn: f => `Atmintis (paprogramė ${f})`, memEmpty: "kol kas tuščia", scr: "Ekranas", scrEmpty: "–",
    step: (i, n) => `${i} žingsnis iš ${n}`, start: "Pradžia: dar neįvykdyta nė viena eilutė.", prev: "Atgal", fwd: "Žingsnis", play: "Vykdyti", all: "Visa eiga",
    hintEnd: "Toliau – pats!",
    trace: "Vykdymo eiga pažingsniui", traceBug: "Kaip vykdoma programa su klaida", traceSol: "Kaip vykdoma teisinga programa",
    right: "Teisingas atsakymas:", fixed: "Taip turi būti:", solH: "Vienas iš teisingų sprendimų:",
    prog: "Programa", pool: "Eilutės", poolEmpty: "Visos eilutės panaudotos.", locked: "Pradiniai duomenys (nejudinami)",
    need: (k, n) => `Įdėta eilučių: ${k} iš ${n}`, up: "Aukštyn", down: "Žemyn", remove: "Išimti",
    tries: n => n === 1 ? "Liko 1 bandymas." : `Liko ${n} bandymai.`,
    okPars: "Programa veikia teisingai!", shown: "Pažiūrėk sprendimą",
    okHead: ["Teisingai!", "Puiku!", "Tiksliai!", "Šaunu!"], badHead: "Šį kartą nepavyko",
    lineAria: n => `${n} eilutė`
  },
  res: (ok, n, pts) => `Iš pirmo karto: ${ok} iš ${n}. Taškai: ${pts}.`,
  learn: [
    { name: "Kaip kompiuteris vykdo programą", level: 0, html: `<p>Kompiuteris programą vykdo <b>pažingsniui</b>: po vieną eilutę, iš viršaus į apačią. Jis nieko „nenuspėja“ – daro tiksliai tai, kas parašyta.</p>
      <p><b>Kintamasis</b> – tai atminties vieta, turinti vardą. <b>Reikšmės priskyrimas</b> ${c("x = x + 2")} vykdomas taip: pirmiausia apskaičiuojama dešinioji pusė, tada rezultatas įrašomas į kintamąjį kairėje. Senoji reikšmė dingsta.</p>
      ${two("a = 5\nb = a\na = a + 3\nprint(a, b)", "int a = 5;\nint b = a;\na = a + 3;\ncout << a << \" \" << b << endl;")}
      <span class="mk-ex">Atmintyje: a = 5 → b = 5 → a = 8. Išvedama: 8 5 (b nepasikeitė!).</span>
      <p>Skaitydamas programą, užsirašyk kintamųjų reikšmes po kiekvienos eilutės – tai vadinama <b>tarpinių rezultatų stebėjimu</b>.</p>` },
    { name: "Sveikųjų skaičių dalyba ir liekana", level: 0, html: `<p>Dalijant sveikuosius skaičius gaunamas <b>dalmuo</b> ir <b>liekana</b>: 17 padalijus iš 5, dalmuo 3, liekana 2.</p>
      ${two("print(17 // 5)   # 3\nprint(17 % 5)    # 2", "cout << 17 / 5 << endl;   // 3\ncout << 17 % 5 << endl;   // 2")}
      <ul><li>${c("n % 10")} – paskutinis skaičiaus skaitmuo;</li><li>${c("n // 10")} (C++: ${c("n / 10")}) – skaičius be paskutinio skaitmens;</li><li>${c("n % 2 == 0")} – skaičius lyginis.</li></ul>
      <span class="mk-ex">n = 47: dešimtys 47 // 10 = 4, vienetai 47 % 10 = 7.</span>` },
    { name: "Pasirinkimo komanda", level: 1, html: `<p><b>Pasirinkimo komanda</b> leidžia programai rinktis: jei sąlyga teisinga – vykdoma viena šaka, kitaip – kita.</p>
      ${two("if a > b:\n    m = a\nelse:\n    m = b", "if (a > b) {\n    m = a;\n} else {\n    m = b;\n}")}
      <ul><li>Kai sąlygų kelios (${c("elif")} arba ${c("else if")}), jos tikrinamos iš eilės ir įvykdoma tik <b>pirmoji</b> teisinga šaka.</li>
      <li>Du atskiri ${c("if")} – tai dvi atskiros komandos: tikrinamos abi.</li>
      <li>„ir“ (${c("and")}, ${c("&&")}) – teisingos abi sąlygos; „arba“ (${c("or")}, ${c("||")}) – bent viena; „ne“ (${c("not")}, ${c("!")}) – priešingai.</li></ul>` },
    { name: "Kartojimo komanda", level: 2, html: `<p><b>Kartojimo komanda</b> (ciklas) tuos pačius sakinius vykdo daug kartų.</p>
      ${two("s = 0\nfor i in range(1, 5):\n    s += i\nprint(s)", "int s = 0;\nfor (int i = 1; i <= 4; i++) {\n    s += i;\n}\ncout << s << endl;")}
      <span class="mk-ex">i = 1, 2, 3, 4 → s = 1, 3, 6, 10. Išvedama 10. Python: range(1, 5) – skaičiai nuo 1 iki 4 (5 nepatenka).</span>
      <p>Ciklas <b>while</b> kartojamas tol, kol sąlyga teisinga. Sąlyga tikrinama prieš kiekvieną kartojimą.</p>
      ${two("x = 1\nwhile x < 20:\n    x = x * 2", "int x = 1;\nwhile (x < 20) {\n    x = x * 2;\n}")}
      <span class="mk-ex">x = 1 → 2 → 4 → 8 → 16 → 32. Kai x = 32, sąlyga klaidinga – ciklas baigtas.</span>` },
    { name: "Kaip sudėti ir patikrinti programą", level: 3, html: `<p>Daugumos programų planas panašus: <b>pradinės reikšmės → veiksmai (dažnai cikle) → rezultato išvedimas</b>.</p>
      <ul><li>Kintamajam reikšmė turi būti priskirta anksčiau, nei jis naudojamas.</li><li>Sakiniai, kurie turi būti kartojami ar vykdomi tik esant sąlygai, rašomi bloko viduje (Python – atitraukti, C++ – tarp ${c("{ }")}).</li><li>Rezultatas dažniausiai išvedamas po ciklo, o ne jo viduje.</li></ul>
      <p>Programą reikia <b>testuoti</b> su keliais skirtingais duomenų rinkiniais: su vienais duomenimis ji gali veikti atsitiktinai, o su kitais – suklysti.</p>` },
    { name: "Programos derinimas: sintaksės ir loginės klaidos", level: 4, html: `<p><b>Sintaksės klaida</b> – pažeistos kalbos rašybos taisyklės (trūksta dvitaškio, kabliataškio, skliausto). Tokia programa iš viso nepasileidžia.</p>
      <p><b>Loginė klaida</b> – programa pasileidžia, bet daro ne tai, ko reikia: neteisinga pradinė reikšmė, ciklo ribos, sąlyga ar veiksmas.</p>
      <p>Logines klaidas padeda rasti <b>derinimas</b>: programa testuojama, vykdoma pažingsniui ir stebimi tarpiniai rezultatai – kurioje eilutėje kintamasis pirmą kartą įgyja ne tą reikšmę, ten ir klaida.</p>
      <span class="mk-ex">Dažnos klaidos: suma pradedama ne nuo 0; sandauga – ne nuo 1; ciklas sukasi vienu kartu per mažai; supainioti &lt; ir &gt;; = vietoje ==.</span>` },
    { name: "Paprogramės ir parametrai", level: 5, html: `<p><b>Paprogramė</b> – pavadinta programos dalis, kurią galima iškviesti daug kartų. Ji panaši į matematinę funkciją: gauna reikšmes ir grąžina rezultatą.</p>
      ${two("def kv(x):\n    return x * x\n\nprint(kv(3) + kv(4))", "int kv(int x) {\n    return x * x;\n}\n\ncout << kv(3) + kv(4) << endl;")}
      <ul><li><b>Formalieji parametrai</b> rašomi paprogramės antraštėje (čia – x).</li><li><b>Faktiniai parametrai</b> – reikšmės, perduodamos kviečiant (čia – 3 ir 4).</li><li>Parametras gauna reikšmės <b>kopiją</b>: keičiant jį paprogramėje, pagrindinės programos kintamasis nesikeičia.</li><li>${c("return")} grąžina rezultatą ir iškart baigia paprogramės darbą.</li></ul>
      <span class="mk-ex">kv(3) = 9, kv(4) = 16 → išvedama 25.</span>` }
  ]
};
})();
