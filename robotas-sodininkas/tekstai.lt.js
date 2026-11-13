/* Robotas sodininkas – visi mokiniui rodomi tekstai (lietuvių k.). Verčiant keisti tik šį failą.
   Terminai – pagal Informatikos bendrąją programą ir pagrindinio ugdymo informatikos BP įgyvendinimo rekomendacijas
   (5–6 kl. 27.2.2 „Programų samprata ir vykdymas“, 27.2.3 „Programų kūrimas“: „pasirinkimo, kartojimo komandas, jų sekas“,
   27.2.5 „Programos testavimas ir tobulinimas“; 6 kl. pasiekimas B3.3 „aprašo ir vykdo kelių veiksmų paprogrames“). */
(function(){
"use strict";
const blk = n => n % 10 === 1 && n % 100 !== 11 ? "blokas" : n % 10 >= 2 && n % 10 <= 9 && (n % 100 < 10 || n % 100 > 20) ? "blokai" : "blokų";
const blkG = n => n % 10 === 1 && n % 100 !== 11 ? "bloko" : "blokų";
const kart = n => n % 10 === 1 && n % 100 !== 11 ? "kartą" : n % 10 >= 2 && n % 10 <= 9 && (n % 100 < 10 || n % 100 > 20) ? "kartus" : "kartų";
const gel = n => n % 10 === 1 && n % 100 !== 11 ? "gėlę" : n % 10 >= 2 && n % 10 <= 9 && (n % 100 < 10 || n % 100 > 20) ? "gėles" : "gėlių";
window.MK_T = {
  blk, kart,
  title: "Robotas sodininkas",
  heroA: "Robotas", heroB: "sodininkas",
  hero: "Sudėliok programą iš komandų blokų: robotas ją įvykdys, palaistys gėles ir grįš į įkrovimo stotelę. Kuo taupesnė programa – tuo geriau.",
  levels: [
    ["Komandų seka", "Komandos vykdomos paeiliui"],
    ["Kartojimo komanda", "Trumpesnė programa su „Kartok“"],
    ["Pasirinkimo komanda", "Viena programa – du sodai"],
    ["Paprogramė", "Aprašyk kartą, kviesk kelis kartus · 6 kl."],
    ["Rask ir pataisyk klaidą", "Testuok ir taisyk programas"]
  ],
  /* kolekcija */
  gardenH: "Mano sodas",
  gardenP: (n, m) => n >= m ? `Sodas pilnas – ${n} gėlių! Tu – tikras programuotojas.` : `Sode auga ${n} iš ${m} gėlių. Už kiekvieną išspręstą užduotį pasodinama nauja gėlė.`,
  gardenEmpty: "Sodas dar tuščias – išspręsk pirmą užduotį ir pasodink gėlę.",
  colorsH: "Roboto spalva",
  colorLocked: n => `Atrakinama surinkus ${n} ⭐`,
  colorNames: ["Mėtinė", "Saulės", "Dangaus", "Aviečių", "Auksinė"],
  /* žaidimas */
  pts: "Taškai",
  goal: (f) => f ? `Palaistyk ${f === 1 ? "gėlę" : "visas gėles (" + f + ")"} ir nuvesk robotą į įkrovimo stotelę.` : "Nuvesk robotą į įkrovimo stotelę.",
  goal2: "Ta pati programa turi tikti abiem sodams.",
  limit: n => `Ne daugiau kaip ${n} ${blkG(n)}`,
  used: (n, m) => m ? `${n} / ${m} ${blkG(m)}` : `${n} ${blk(n)}`,
  bugIntro: "Ši programa turi klaidą. Paleisk ją, pažiūrėk, kur robotas suklysta, ir pataisyk. Blokų skaičius neturi didėti.",
  garden: i => `${i} sodas`,
  run: "Paleisti", stop: "Sustabdyti", clear: "Išvalyti", reset: "Iš naujo",
  speed: "Greičiau",
  main: "Programa", proc: "Paprogramė P",
  procHint: "Čia aprašyk, ką robotas darys, kai bus iškviesta paprogramė P.",
  emptySlot: "Paliesk komandą apačioje – ji atsiras čia",
  slotIn: "+ dėti čia",
  palette: "Komandos",
  paletteHint: "Paliesk komandą – ji įsidės pažymėtoje vietoje. Paliesk bloką programoje, kad naujas bloką dėtum po juo.",
  del: "Ištrinti",
  /* blokų pavadinimai */
  b: {
    F: "Pirmyn", L: "Kairėn", R: "Dešinėn", W: "Laistyk", P: "Kviesk P",
    rep: n => `Kartok ${n} ${kart(n)}`, repShort: "Kartok",
    ifFlower: "Jei ant langelio gėlė", ifWall: "Jei priekyje kliūtis", ifShortF: "Jei gėlė", ifShortW: "Jei kliūtis",
    els: "kitaip"
  },
  bTip: { F: "1 langelis pirmyn", L: "pasisuka 90° į kairę", R: "pasisuka 90° į dešinę", W: "palaisto gėlę po savimi", P: "vykdo paprogramę P" },
  /* pranešimai po paleidimo */
  r: {
    ok: "Pavyko! Gėlės palaistytos, robotas įsikrovė.",
    okLong: (n, m) => `Robotas pasiekė tikslą, bet programa per ilga: ${n} ${blk(n)}, o galima ne daugiau kaip ${m}. Sutrumpink ją.`,
    okLongTip: ["", "", "Pabandyk kartojimo komandą „Kartok“.", "Viena programa abiem sodams – naudok „Jei …“ ir „Kartok“.", "Pasikartojančius veiksmus aprašyk paprogramėje P.", "Pataisyk klaidą, o ne pridėk naujų blokų."],
    bump: (s) => `Bum! Robotas atsitrenkė į gyvatvorę (${s} žingsnis). Raudonai pažymėtas blokas, kurį vykdant tai nutiko.`,
    waste: (s) => `Robotas laistė takelį be gėlės (${s} žingsnis) – vanduo iššvaistytas.`,
    flowers: n => `Programa baigėsi, bet liko nepalaistytų gėlių: ${n}.`,
    goal: "Programa baigėsi, bet robotas nepasiekė įkrovimo stotelės.",
    long: "Robotas vykdė per daug žingsnių. Patikrink kartojimo skaičius.",
    empty: "Programa tuščia – pridėk komandų.",
    inGarden: i => `${i} sode: `,
    procEmpty: "Programoje kviečiama paprogramė P, bet ji tuščia.",
    tries: n => `Bandymas ${n}`
  },
  showSol: "Parodyti sprendimą",
  solShown: "Sprendimas įkeltas į programą. Paleisk ir pažiūrėk, kaip jis veikia.",
  next: "Toliau", finish: "Baigti",
  why: "Pavyzdinis sprendimas",
  wOk: ["Programa veikia!", "Puiku – programa veikia!", "Šaunu!", "Teisingai!"],
  wUsed: (n, best) => n <= best ? `Tavo programa – ${n} ${blk(n)}. Tai taupiausias žinomas sprendimas.` : `Tavo programa – ${n} ${blk(n)}. Galima ir trumpiau: ${best} ${blk(best)}.`,
  wSol: "Žiūrėk, kaip galima buvo išspręsti:",
  wMiss: "Nieko tokio – programuotojai taip pat taiso klaidas.",
  wSame: "Tam pačiam uždaviniui galima sukurti keletą skirtingų programų – svarbu, kad jos veiktų ir būtų aiškios.",
  tip: [
    "Komandos vykdomos paeiliui – eilutė po eilutės. „Kairėn“ ir „Dešinėn“ robotą tik pasuka vietoje; kryptis skaičiuojama nuo roboto, ne nuo ekrano.",
    "Kartojimo komanda vykdo savo viduje esančius blokus nurodytą kartų skaičių. Ieškok, kuri veiksmų dalis kartojasi.",
    "Pasirinkimo (šakojimo) komanda „Jei …“ patikrina sąlygą: jei ji teisinga, vykdomi viršutiniai blokai, jei ne – blokai po „kitaip“. Todėl ta pati programa gali tikti skirtingiems sodams.",
    "Paprogramė – atskirai aprašyta veiksmų seka su pavadinimu. Aprašai ją vieną kartą, o kvieti tiek kartų, kiek reikia.",
    "Testuoti – reiškia paleisti programą ir patikrinti, ar ji daro tai, kas nurodyta sąlygoje. Pažiūrėk, kuriame žingsnyje robotas suklysta, ir taisyk tą vietą."
  ],
  bugTip: {
    turn: "Klaida buvo posūkyje: viena „Kairėn“ ir „Dešinėn“ komanda buvo sukeista.",
    count: "Klaida buvo kartojimo skaičiuje: kartojimo komanda vykdė per mažai arba per daug kartų.",
    swap: "Klaida buvo komandų tvarkoje: dvi gretimos komandos buvo sukeistos vietomis.",
    move: "Klaida buvo komandoje: vietoje vienos komandos stovėjo kita.",
    branch: "Klaida buvo pasirinkimo komandoje: blokai buvo ne toje šakoje (ne „jei“, o „kitaip“ dalyje arba atvirkščiai)."
  },
  res: (ok, n, pts) => `Išspręsta iš pirmo ar antro bandymo: ${ok} iš ${n}. Taškai: ${pts}.`,
  newFlowers: n => `Sode pasodinta naujų gėlių: ${n}.`,
  newColor: c => `Atrakinta nauja roboto spalva: ${c}!`,
  learn: [
    { name: "Algoritmas ir komandų seka", level: 0, html: `<p><b>Algoritmas</b> – tiksliai aprašyta veiksmų seka uždaviniui išspręsti. Programa – algoritmas, užrašytas komandomis, kurias supranta vykdytojas (čia – robotas).</p>
      <p>Programos komandos vykdomos <b>paeiliui, eilutė po eilutės</b>. Robotas turi 4 komandas:</p>
      <ul><li><b>Pirmyn</b> – pajuda vienu langeliu ta kryptimi, į kurią žiūri;</li><li><b>Kairėn / Dešinėn</b> – pasisuka vietoje 90°;</li><li><b>Laistyk</b> – palaisto gėlę langelyje, kuriame stovi.</li></ul>
      <p>Svarbu: kairė ir dešinė – <b>roboto</b>. Jei robotas žiūri į tave (žemyn), jo kairė yra ekrano dešinėje.</p>` },
    { name: "Kartojimo komanda", level: 1, html: `<p><b>Kartojimo komanda</b> „Kartok N kartų“ vykdo savo viduje esančius blokus N kartų.</p>
      <span class="mk-ex">Pirmyn, Laistyk, Pirmyn, Laistyk, Pirmyn, Laistyk (6 blokai)<br>= Kartok 3 kartus [Pirmyn, Laistyk] (3 blokai)</span>
      <p>Kaip rasti, ką kartoti? Pažiūrėk į kelią ir ieškok vienodų gabalų, pavyzdžiui, „laiptelio“: pirmyn, pasisuk, pirmyn, pasisuk atgal.</p>
      <p>Kartojimo komanda gali būti ir kitos kartojimo komandos viduje.</p>` },
    { name: "Pasirinkimo (šakojimo) komanda", level: 2, html: `<p><b>Pasirinkimo komanda</b> „Jei sąlyga … kitaip …“ pirmiausia patikrina sąlygą.</p>
      <ul><li>Jei sąlyga <b>teisinga</b> – vykdomi blokai viršutinėje dalyje;</li><li>jei <b>neteisinga</b> – blokai dalyje „kitaip“ (ji gali būti ir tuščia).</li></ul>
      <p>Robotas gali tikrinti dvi sąlygas: „ant langelio gėlė“ (nepalaistyta) ir „priekyje kliūtis“ (gyvatvorė ar sodo kraštas).</p>
      <span class="mk-ex">Kartok 6 kartus [Pirmyn, Jei ant langelio gėlė [Laistyk]]</span>
      <p>Tokia programa tiks bet kuriam tiesiam takui, kad ir kur augtų gėlės. Todėl kiekvieną užduotį tikriname dviejuose skirtinguose soduose.</p>` },
    { name: "Paprogramė (6 kl.)", level: 3, html: `<p><b>Paprogramė</b> – atskirai aprašyta kelių veiksmų seka, turinti pavadinimą (čia – P).</p>
      <p>Paprogramę aprašai vieną kartą, o pagrindinėje programoje ją <b>kvieti</b> bloku „Kviesk P“ tiek kartų, kiek reikia.</p>
      <span class="mk-ex">P: Pirmyn, Laistyk, Kairėn<br>Programa: Kviesk P, Dešinėn, Kviesk P, Pirmyn, Kviesk P</span>
      <p>Taip didelis uždavinys <b>skaidomas</b> į mažesnes dalis, o programa tampa trumpesnė ir aiškesnė.</p>` },
    { name: "Programos testavimas ir taisymas", level: 4, html: `<p><b>Testuoti</b> programą – tai ją vykdyti ir tikrinti, ar ji atlieka tai, kas nurodyta uždavinio sąlygoje.</p>
      <ul><li>Paleisk programą ir stebėk, kuris blokas tuo metu vykdomas (jis paryškinamas).</li><li>Rask pirmą vietą, kur robotas padaro ne tai, ko reikia.</li><li>Pataisyk tą vietą ir testuok dar kartą.</li></ul>
      <p>Programą verta testuoti su keliais skirtingais duomenų rinkiniais (pas mus – keliais sodais). Tam pačiam uždaviniui galima sukurti keletą skirtingų programų.</p>` }
  ]
};
})();
