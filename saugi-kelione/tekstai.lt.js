/* Saugi kelionė (2 versija) – visi mokiniui rodomi tekstai. Sakiniai trumpi: žaidžia pirmokai. */
window.MK_T = {
  title: "Saugi kelionė",
  h1: ["Saugi", "kelionė"],
  lead: "Nuvesk vaiką į mokyklą. Laikyk mygtuką – ir jis eina!",
  note: "Žaidimas moko saugaus elgesio gatvėje, bet nepakeičia suaugusiojo pamokų prie tikros gatvės.",
  levels: {
    sviesoforas: ["Šviesoforas", "Raudona, žalia, mirksi"],
    pereja: ["Perėja", "Apsidairyk ir eik"],
    tamsa: ["Tamsus metas", "Atšvaitas, lietus, rūkas"],
    misrus: ["Visas kelias", "Ilga kelionė į mokyklą"]
  },
  walk: "EITI",
  aria: { walk: "Laikyk nuspaudęs – vaikas eina", lookL: "Pažiūrėti į kairę", lookR: "Pažiūrėti į dešinę",
    ears: "Nusiimti ausines", phone: "Įsidėti telefoną", hood: "Nusiimti gobtuvą", scene: "Gatvė" },
  hint: {
    first: "Laikyk mygtuką – vaikas eina. Paleisk – jis sustoja.",
    go: "Einam toliau!",
    light: "Žiūrėk į šviesoforą.",
    zebra: "Apsidairyk: kairė ir dešinė.",
    dead: "Šviesoforas nedega. Apsidairyk!",
    drive: "Atsargiai – kiemas!",
    short: "Kur eisi per gatvę?",
    ball: "Kamuolys nuriedėjo į gatvę! Ką darai?",
    dog: "Šuniukas nubėgo į gatvę! Ką darai?",
    friend: "Draugas šaukia iš kitos pusės! Ką darai?",
    signs: "Kuriuo keliu eisi?",
    bike: "Kuria puse eisi?",
    refl: "Lauke tamsu. Ką pasiimsi?",
    ears: "Tu su ausinėmis!", phone: "Tavo rankoje telefonas!", hood: "Gobtuvas užstoja akis!"
  },
  bad: {
    red: "Raudona – stok ir lauk!",
    blink: "Žalia mirksi. Nebepradėk eiti!",
    amb: "Važiuoja greitoji! Praleisk ją.",
    late: "Palauk, kol automobiliai sustos.",
    look: "Pirma apsidairyk: kairė ir dešinė.",
    car: "Automobilis arti. Palauk!",
    bus: "Autobusas užstoja kelią. Palauk, kol nuvažiuos.",
    ears: "Nusiimk ausines – turi girdėti gatvę.",
    phone: "Įsidėk telefoną – žiūrėk į kelią.",
    hood: "Nusiimk gobtuvą – turi matyti gatvę.",
    drive: "Važiuoja automobilis. Palauk!",
    short: "Čia perėjos nėra. Eik iki perėjos.",
    ball: "Paskui kamuolį į gatvę nebėk!",
    dog: "Paskui šuniuką į gatvę nebėk!",
    friend: "Per gatvę nebėk. Eik iki perėjos.",
    signs: "Raudonas apskritimas – eiti draudžiama.",
    bike: "Čia dviračių takas. Eik pėsčiųjų puse.",
    refl: "Tamsoje vairuotojas tavęs nemato. Reikia atšvaito!"
  },
  good: {
    light: "Žalia ir automobiliai stovi – einam!",
    amb: "Greitoji pravažiavo. Dabar galima!",
    zebra: "Apsidairei ir perėjai saugiai!",
    stops: "Automobilis sustojo ir praleido tave.",
    bus: "Autobusas nuvažiavo – dabar viskas matyti.",
    drive: "Palaukei – šaunu!",
    short: "Taip! Gatvę pereiname perėjoje.",
    ball: "Teisingai. Kamuolį paduos suaugęs.",
    dog: "Teisingai. Šuniuką pašauksime iš čia.",
    friend: "Teisingai. Pamojai ir eini iki perėjos.",
    signs: "Taip! Mėlynas ženklas – pėsčiųjų takas.",
    bike: "Taip! Čia eina pėstieji.",
    refl: "Atšvaitas šviečia – vairuotojai tave mato!"
  },
  praise: ["Puiku!", "Šaunu!", "Valio!", "Saugiai!"],
  result: (ok, n) => `Nuėjai iki mokyklos! Saugiai iš pirmo karto: ${ok} iš ${n}.`,
  badges: {
    title: "Kuprinės ženkliukai",
    none: "Eik saugiai – ir ant kuprinės atsiras ženkliukų!",
    next: n => `Dar <b>${n}</b> ${n % 10 === 1 && n % 100 !== 11 ? "saugus žingsnis" : (n % 10 >= 2 && n % 10 <= 9 && (n % 100 < 10 || n % 100 >= 20) ? "saugūs žingsniai" : "saugių žingsnių")} iki naujo ženkliuko.`,
    all: "Visi ženkliukai surinkti. Tu – saugaus kelio meistras!"
  },
  learn: [
    { name: "Šviesoforas", level: 0, html: `<p><b>Raudonas žmogeliukas</b> – stok ir lauk.</p><p><b>Žalias žmogeliukas</b> – galima eiti, bet pirmiausia pažiūrėk, ar automobiliai sustojo.</p><p><b>Mirksintis žalias</b> – tuoj užsidegs raudonas. Jei dar neįėjai į perėją, palauk.</p><p>Jei atvažiuoja <b>greitoji su sirena</b>, praleisk ją, net jei dega žalia.</p><span class="mk-ex">Per raudoną neini niekada, net jei gatvė tuščia.</span>` },
    { name: "Perėja", level: 1, html: `<p>Gatvę pereik <b>perėjoje</b>. Prieš eidamas sustok, pažiūrėk į kairę ir į dešinę.</p><ul><li>Eik tik tada, kai automobiliai toli arba sustojo.</li><li>Nusiimk ausines ir gobtuvą, įsidėk telefoną.</li><li>Jei stovi autobusas – palauk, kol jis nuvažiuos.</li><li>Paskui kamuolį į gatvę nebėk.</li></ul>` },
    { name: "Tamsus metas", level: 2, html: `<p>Tamsoje vairuotojas vaiką be atšvaito gali pamatyti per vėlai. <b>Atšvaitas</b> šviečia, kai į jį krenta automobilio šviesa.</p><p>Segk atšvaitą ant drabužių ar kuprinės išorėje. Rinkis šviesius drabužius.</p>` }
  ]
};
