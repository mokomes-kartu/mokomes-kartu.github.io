/* Medžiagų laboratorija – visi mokiniui rodomi tekstai ir užduočių duomenys (lietuvių k.).
   Temos ir terminai – pagal Gamtos mokslų bendrąją programą (pradinis ugdymas):
   3 kl. „Medžiagų būsenos“, „Vandens apytakos ratas“, „Tirpumas“; 4 kl. „Mišiniai“, „Medžiagų kitimai“
   (lydymasis, kietėjimas, garavimas, kondensacija; puvimas, degimas, rūdijimas; grįžtamieji pokyčiai). */
window.MK_T = {
  title: "Medžiagų laboratorija",
  h1: "Medžiagų <em>laboratorija</em>",
  hero: "Šildyk, šaldyk, tirpink ir atskirk! Atlik laboratorijos užduotis ir užpildyk atradimų lentyną.",
  note: "Temos pagal Gamtos mokslų bendrąją programą (3–4 klasės). Rezultatai saugomi tik šiame įrenginyje.",
  points: "Taškai",
  levels: [
    ["Kieta, skysta ar dujos?", "Medžiagų būsenos ir jų kitimas"],
    ["Vandens kelionė", "Garavimas, kondensacija ir vandens apytakos ratas"],
    ["Tirpsta ar netirpsta?", "Tirpumas ir kaip paspartinti tirpimą"],
    ["Atskirk mišinį", "Sietas, filtras, magnetas ir garinimas"],
    ["Kas pasikeitė?", "Grįžtamieji ir negrįžtamieji kitimai"],
    ["Laboratorijos egzaminas", "Visos užduotys kartu"]
  ],
  next: "Toliau →",
  results: "Rezultatai",
  taskOf: (i, n) => `Užduotis ${i} iš ${n}`,
  okHead: (p) => `${p}`,
  tryAgain: "Pabandyk dar kartą!",
  shown: "Žiūrėk, kaip teisingai:",
  resTitle: (ok, n) => `${ok} iš ${n} iš pirmo karto`,
  resText: (n) => n ? `Atradimų lentynoje naujų lipdukų: ${n}!` : "Lentynoje laukia dar daug lipdukų – žaisk toliau!",
  shelfTitle: "Mano atradimų lentyna",
  shelfText: (n, all) => n >= all ? `Visi ${all} lipdukai surinkti – tu tikras mokslininkas!` : `Lipdukų: ${n} iš ${all}. Lipdukas atsiranda, kai užduotį atlieki iš pirmo karto.`,
  ranks: ["Laboranto mokinys", "Laborantas", "Tyrėjas", "Mokslininkas", "Profesorius"],

  /* ---------- medžiagos (raktas → [pavadinimas, kaip pasakyti „ką?“]) ---------- */
  names: {
    ledas: "ledas", vanduo: "vanduo", garai: "vandens garai",
    sokoladas: "šokoladas", sokoladasS: "išsilydęs šokoladas", sviestas: "sviestas", sviestasS: "išsilydęs sviestas", vaskas: "vaškas", vaskasS: "išsilydęs vaškas",
    akmuo: "akmuo", saukstas: "medinis šaukštas", smelis: "smėlis", cukrus: "cukrus", moneta: "moneta",
    pienas: "pienas", sultys: "sultys", aliejus: "aliejus", medus: "medus",
    balionas: "oras balione", burbulai: "burbuliukai limonade",
    kava: "tirpi kava", miltai: "miltai", kreida: "kreidos milteliai", kruopos: "kruopos", akmenukai: "akmenukai", zirniai: "žirniai",
    vinutes: "geležinės vinutės", rutuliukai: "plieniniai rutuliukai", savarzeles: "plieninės sąvaržėlės", drozles: "geležies drožlės",
    druska: "druska", pjuvenos: "medžio pjuvenos", karoliukai: "plastiko karoliukai"
  },

  /* 1 lygis: būsenos */
  stateQ: name => `Kokios būsenos yra <b>${name}</b>?`,
  states: { k: "Kieta", s: "Skysta", d: "Dujos" },
  stateWhy: {
    k: "Kietas kūnas turi savo formą – ji nepasikeičia, kai įdedi į kitą indą.",
    s: "Skystis neturi savo formos – jis įgauna indo formą, bet užima tą patį tūrį.",
    d: "Dujos neturi nei savo formos, nei tūrio – jos užpildo visą indą."
  },
  sortItems: [
    ["akmuo", "k"], ["ledas", "k", "Ledas – kieta vandens būsena: kubelis išlaiko savo formą."], ["saukstas", "k"],
    ["smelis", "k", "Smėlis byra kaip skystis, bet kiekviena smiltelė yra mažas kietas akmenėlis su savo forma."],
    ["cukrus", "k", "Cukraus kristalėliai – kieti, kiekvienas turi savo formą."], ["sokoladas", "k"], ["moneta", "k"], ["vaskas", "k", "Žvakės vaškas kambaryje kietas. Skystas jis tampa tik įkaitintas."],
    ["vanduo", "s"], ["pienas", "s"], ["sultys", "s"], ["aliejus", "s"], ["medus", "s", "Medus tąsus ir teka lėtai, bet jis skystis – įgauna indo formą."],
    ["balionas", "d"], ["garai", "d", "Vandens garai – dujinė vandens būsena. Jų nematome."], ["burbulai", "d", "Burbuliukuose limonade yra dujų."]
  ],

  /* 1 lygis: būsenos kitimas (šildyti / šaldyti) */
  heat: "Šildyti", cool: "Šaldyti",
  chainQ: (from, to) => `Kaip iš <b>${from}</b> gauti <b>${to}</b>?`,
  chainHint: "Spausk „Šildyti“ arba „Šaldyti“. Gali prireikti kelių žingsnių.",
  proc: { lyd: "Lydymasis", kiet: "Kietėjimas", gar: "Garavimas", kond: "Kondensacija" },
  procWhy: {
    lyd: "Lydymasis – kai šildoma kieta medžiaga tampa skysta.",
    kiet: "Kietėjimas – kai šaldomas skystis tampa kietas (vanduo užšąla).",
    gar: "Garavimas – kai skystis virsta dujomis (garais).",
    kond: "Kondensacija – kai atvėsę garai vėl virsta skysčiu (lašeliais)."
  },
  noChange: { hot: "Jau ir taip karšta – šildant toliau, būsena nebesikeičia.", cold: "Jau ir taip kieta – šaldant toliau, būsena nebesikeičia.", chocHot: "Šokoladas jau skystas. Per daug kaitinamas jis gali prisvilti!" },
  chainOk: "Pavyko! Stebėk, kas vyko:",
  chainExtra: n => `Pavyko, bet ${n === 1 ? "buvo 1 nereikalingas žingsnis" : `buvo nereikalingų žingsnių: ${n}`}. Pagalvok, kuris kelias trumpiausias.`,

  /* 2 lygis: virsmai gamtoje */
  sitQ: "Kas čia vyksta?",
  situations: [
    ["Pavasarį sniegas ištirpsta.", "lyd", "sniegas"],
    ["Ledai saulėje tirpsta ir varva.", "lyd", "ledai"],
    ["Ant stogo tirpsta varveklis.", "lyd", "varveklis"],
    ["Sviestas keptuvėje išsilydo.", "lyd", "sviestas"],
    ["Prie degančios žvakės dagties vaškas tampa skystas.", "lyd", "zvake"],
    ["Žiemą ežeras užšąla.", "kiet", "ezeras"],
    ["Vanduo šaldiklyje virsta ledo kubeliais.", "kiet", "saldiklis"],
    ["Išsilydęs šokoladas šaldytuve sustingsta.", "kiet", "sokoladas"],
    ["Vaško lašas ant stalo sukietėja.", "kiet", "zvake"],
    ["Po lietaus balos išdžiūsta.", "gar", "bala"],
    ["Ant virvės išdžiūsta skalbiniai.", "gar", "skalbiniai"],
    ["Verdant puode vandens vis mažėja.", "gar", "puodas"],
    ["Saulė šildo jūrą, ir vanduo kyla į orą.", "gar", "jura"],
    ["Šlapi plaukai išdžiūsta.", "gar", "plaukai"],
    ["Ryte ant žolės atsiranda rasa.", "kond", "rasa"],
    ["Ant šaltos stiklinės iš šaldytuvo atsiranda lašelių.", "kond", "stikline"],
    ["Po dušo vonioje aprasoja veidrodis.", "kond", "veidrodis"],
    ["Įėjus iš šalčio į šiltą kambarį, aprasoja akiniai.", "kond", "akiniai"],
    ["Ant puodo dangčio susikaupia vandens lašų.", "kond", "puodas"],
    ["Aukštai danguje garai atvėsta ir susidaro debesys.", "kond", "debesis"]
  ],
  cycleQ: "Sudėk vandens kelionę iš eilės. Bakstelėk korteles ta tvarka, kaip viskas vyksta gamtoje.",
  cycleStart: "Pradžia:",
  cycle: [
    ["Saulė šildo jūrą – vanduo garuoja ir kyla į orą.", "gar"],
    ["Aukštai garai atvėsta – susidaro debesys.", "kond"],
    ["Iš debesų iškrenta lietus ar sniegas.", "kri"],
    ["Vanduo upėmis nuteka atgal į jūrą.", "upe"]
  ],
  cycleWhy: "Tai vandens apytakos ratas: garavimas → kondensacija (debesys) → krituliai (lietus, sniegas) → upės neša vandenį atgal į jūrą. Ratas niekada nesibaigia!",
  cycleWrong: "Ne ta tvarka. Pagalvok: kas turi įvykti, kad atsirastų debesys?",
  waterQ: [
    ["Kaip dūmai iš gamyklos kamino gali patekti į upę?", ["Su lietumi", "Su vėju į jūros dugną", "Niekaip"], 0, "Teršalai iš oro susimaišo su lietaus lašais ir su krituliais patenka į dirvą, upes ir ežerus. Todėl tarša keliauja kartu su vandens apytakos ratu."],
    ["Kas iškrenta iš debesų žiemą?", ["Sniegas", "Rasa", "Garai"], 0, "Žiemą danguje šalta, todėl iš debesų iškrenta sniegas. Rasa susidaro ant žolės, o ne krenta iš debesų."],
    ["Kuris elgesys tausoja vandenį?", ["Užsukti čiaupą valant dantis", "Ilgai praustis po dušu", "Palikti čiaupą lašėti"], 0, "Švarus geriamas vanduo – brangus gamtos išteklius. Užsukdami čiaupą jį tausojame."],
    ["Iš kur atsiranda debesys?", ["Iš atvėsusių vandens garų", "Iš dūmų", "Iš sniego"], 0, "Garai kyla aukštyn, ten šalčiau, todėl jie kondensuojasi į mažyčius lašelius – taip susidaro debesys."],
    ["Kodėl balos greičiau išdžiūsta saulėtą dieną?", ["Šilta – vanduo greičiau garuoja", "Saulė sugeria balas", "Vanduo užšąla"], 0, "Kuo šilčiau, tuo greičiau vanduo garuoja."]
  ],

  /* 3 lygis: tirpumas */
  dissQ: name => `Įberk <b>${name}</b> į vandenį ir pamaišyk. Kaip manai, ar ištirps?`,
  diss: { yes: "Ištirps", no: "Neištirps" },
  dissItems: [
    ["cukrus", 1, "Cukrus ištirpsta – vanduo lieka skaidrus, bet saldus."],
    ["druska", 1, "Druska ištirpsta – vanduo tampa sūrus, bet druskos nebesimato."],
    ["kava", 1, "Tirpi kava ištirpsta ir nuspalvina vandenį."],
    ["medus", 1, "Medus ištirpsta, ypač šiltame vandenyje."],
    ["smelis", 0, "Smėlis netirpsta – pamaišius jis nusėda ant dugno."],
    ["akmenukai", 0, "Akmenukai netirpsta – guli dugne."],
    ["aliejus", 0, "Aliejus netirpsta – jis susirenka ant vandens paviršiaus."],
    ["miltai", 0, "Miltai netirpsta – vanduo tampa drumstas, o ilgainiui miltai nusėda."],
    ["kreida", 0, "Kreidos milteliai netirpsta – vanduo drumstas, paskui jie nusėda."],
    ["pjuvenos", 0, "Medžio pjuvenos netirpsta – jos plūduriuoja."],
    ["karoliukai", 0, "Plastiko karoliukai netirpsta."],
    ["kruopos", 0, "Kruopos netirpsta – jos nusėda ant dugno."]
  ],
  fastQ: name => `Kurioje stiklinėje <b>${name}</b> ištirps greičiau?`,
  fast: {
    temp: ["Šiltas vanduo", "Šaltas vanduo", "Šiltame vandenyje medžiagos tirpsta greičiau."],
    stir: ["Maišome šaukšteliu", "Nemaišome", "Maišant medžiaga tirpsta greičiau."],
    size: ["Smulkūs kristalėliai", "Vienas didelis gabalas", "Susmulkinta medžiaga tirpsta greičiau nei vienas didelis gabalas."]
  },
  fastName: { cukrus: "cukrus", druska: "druska" },

  /* 4 lygis: mišiniai */
  mixQ: names => `Atskirk mišinį: <b>${names}</b>. Pasirink įrankį.`,
  mixNext: "Kas toliau? Pasirink kitą įrankį.",
  tools: { sietas: "Sietas", magnetas: "Magnetas", vanduo: "Įpilti vandens", filtras: "Filtras", garinti: "Garinti" },
  toolDo: {
    sietas: n => `Sietas sulaikė stambius: ${n}.`,
    magnetas: n => `Magnetas pritraukė: ${n}.`,
    vanduo: n => `Įpylėme vandens – ištirpo: ${n}.`,
    filtras: n => `Filtras sulaikė: ${n}. Pro jį prateka tik vanduo (su ištirpusiomis medžiagomis).`,
    garinti: n => `Vanduo išgaravo – liko ${n}.`
  },
  toolNo: {
    sietas: "Sietas atskiria tik stambius gabalėlius nuo smulkių. Čia nėra ką sijoti.",
    magnetas: "Magnetas traukia tik geležinius ir plieninius daiktus. Čia jų nėra.",
    vanduo: "Vandens pilti nereikia – čia nėra ko ištirpinti (arba vanduo jau yra).",
    filtras: "Filtras sulaiko netirpias daleles iš vandens. Čia dar nėra vandens arba nėra ką sulaikyti.",
    garinti: "Dar per anksti garinti – mišinyje liko netirpių dalelių arba nėra vandens.",
    mix: "Taip medžiagų neatskirsi – pagalvok apie jų savybes."
  },
  mixDone: "Visos medžiagos atskirtos!",
  dissolved: n => `Ištirpo: ${n}`,
  mixWhy: "Mišinio medžiagos atskiriamos pagal jų savybes: dydį (sietas), traukimą magnetu, tirpumą vandenyje (įpilti vandens ir filtruoti), o ištirpusi medžiaga atgaunama garinant.",

  /* 5 lygis: kitimai */
  chQ: text => `${text} Ar galima grąžinti medžiagą atgal?`,
  ch: { rev: "Grįžtamasis – galima grąžinti", irr: "Negrįžtamasis – atsiranda nauja medžiaga" },
  changes: [
    ["Ledas ištirpo.", 1, "lyd", "Vanduo vėl užšals šaldiklyje – tai grįžtamasis kitimas."],
    ["Vanduo šaldiklyje užšalo.", 1, "kiet", "Ledą galima vėl ištirpdyti – kitimas grįžtamasis."],
    ["Bala išdžiūvo.", 1, "gar", "Vanduo virto garais, garai gali vėl kondensuotis – kitimas grįžtamasis."],
    ["Ant žolės susidarė rasa.", 1, "kond", "Rasa saulėje vėl išgaruos – kitimas grįžtamasis."],
    ["Šokoladas išsilydė.", 1, "lyd", "Atšaldytas šokoladas vėl sukietės – kitimas grįžtamasis."],
    ["Sviestas keptuvėje išsilydė.", 1, "lyd", "Atvėsęs sviestas vėl sukietės."],
    ["Druska ištirpo vandenyje.", 1, null, "Išgarinę vandenį vėl gausime druskos – kitimas grįžtamasis."],
    ["Vaškas aplink dagtį išsilydė.", 1, "lyd", "Atvėsęs vaškas vėl sukietėja – lydymasis grįžtamas. (O kai žvakė dega, vaškas sudega – tai jau negrįžtamas kitimas.)"],
    ["Sudegė popieriaus lapas.", 0, "deg", "Iš pelenų ir dūmų popieriaus nebeatgausi – degant atsiranda naujų medžiagų."],
    ["Laužas sudegino malkas.", 0, "deg", "Liko pelenai ir dūmai – malkų nebeatgausi."],
    ["Žvakė sudegė iki galo.", 0, "deg", "Degant vaškas virsta kitomis medžiagomis – žvakės nebeatgausi."],
    ["Obuolys supuvo.", 0, "puv", "Puvimas – negrįžtamas kitimas: supuvusio obuolio nebeatgausi."],
    ["Lapai kompostinėje supuvo.", 0, "puv", "Pūdami lapai virsta nauja medžiaga – kompostu."],
    ["Vinis surūdijo.", 0, "rud", "Rūdys – nauja medžiaga. Geležis rūdija, kai yra vandens ir deguonies."],
    ["Dviračio grandinė surūdijo lietuje.", 0, "rud", "Rūdijimas – negrįžtamas kitimas."],
    ["Kiaušinis išvirė.", 0, null, "Virtas kiaušinis vėl žalias nebebus – baltymas pasikeitė negrįžtamai."],
    ["Duona skrudintuve paskrudo.", 0, null, "Paskrudusi duona vėl balta nebebus – atsirado naujų medžiagų."],
    ["Pienas surūgo.", 0, null, "Surūgęs pienas šviežias nebebus – kitimas negrįžtamas."]
  ],
  kindQ: text => `${text} Koks tai kitimas?`,
  kinds: { lyd: "Lydymasis", kiet: "Kietėjimas", gar: "Garavimas", kond: "Kondensacija" },
  rustQ: ["Kur geležinė vinis surūdys greičiausiai?", ["Drėgnoje vietoje", "Sausame stiklainyje", "Aliejaus stiklainyje"], 0, "Geležis rūdija tada, kai aplinkoje yra deguonies ir vandens. Drėgnoje vietoje yra abiejų."],

  learn: [
    { name: "Medžiagų būsenos", level: 0, html: `<p><b>Kieta</b> medžiaga turi savo formą (akmuo, ledas). <b>Skysta</b> įgauna indo formą (vanduo, pienas). <b>Dujos</b> užpildo visą indą (oras balione).</p>
      <p>Šildant ir šaldant būsena keičiasi: <b>lydymasis</b> (kieta → skysta), <b>kietėjimas</b> (skysta → kieta), <b>garavimas</b> (skysta → dujos), <b>kondensacija</b> (dujos → skysta).</p>` },
    { name: "Vandens apytakos ratas", level: 1, html: `<p>Saulė šildo vandenį – jis <b>garuoja</b>. Aukštai garai atvėsta ir <b>kondensuojasi</b> – susidaro debesys. Iš debesų krenta <b>krituliai</b> (lietus, sniegas). Upės neša vandenį atgal į jūrą.</p>
      <p>Švarų vandenį reikia tausoti, nes tarša keliauja kartu su vandeniu.</p>` },
    { name: "Tirpumas", level: 2, html: `<p>Kai kurios medžiagos vandenyje <b>ištirpsta</b> (cukrus, druska), kitos – ne (smėlis, aliejus, miltai).</p>
      <p>Tirpimą paspartina: <b>šiltas vanduo</b>, <b>maišymas</b> ir <b>susmulkinimas</b>.</p>` },
    { name: "Kaip atskirti mišinį?", level: 3, html: `<ul><li><b>Sietas</b> – stambūs gabalėliai nuo smulkių.</li><li><b>Magnetas</b> – geležiniai ir plieniniai daiktai.</li>
      <li><b>Įpilti vandens</b> – ištirpsta tirpios medžiagos (druska, cukrus).</li><li><b>Filtras</b> – sulaiko netirpias daleles (smėlį, miltus).</li><li><b>Garinti</b> – vanduo išgaruoja, lieka ištirpusi medžiaga.</li></ul>` },
    { name: "Medžiagų kitimai", level: 4, html: `<p><b>Grįžtamieji</b> kitimai – būsenos kitimai: lydymasis, kietėjimas, garavimas, kondensacija (taip pat ir tirpimas vandenyje).</p>
      <p><b>Negrįžtamieji</b> – atsiranda naujų medžiagų: <b>degimas</b>, <b>puvimas</b>, <b>rūdijimas</b>, kepimas, virimas.</p>` }
  ]
};
