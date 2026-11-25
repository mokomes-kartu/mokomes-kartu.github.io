/* Šešėlių dirbtuvė – visi mokiniui rodomi tekstai (lietuvių k.). Verčiant užtenka išversti šį failą.
   Tema – Dailės bendroji programa, 7–8 kl.: „Šviesa ir šešėliai“, „Apimtinių trimačių formų vaizdavimas plokštumoje“, „toninė įvairovė“.
   „Savasis šešėlis“ ir „krintantis šešėlis“ – įprasti piešimo mokymo terminai (programoje jie atskirai neįvardyti). */
window.MK_T = {
  title: "Šešėlių dirbtuvė",
  h1: "Šešėlių dirbtuvė",
  lead: "Valdyk lempą ir stebėk, kaip šviesa ir šešėliai parodo daikto apimtį.",
  note: n => `Dirbtuvės lentynose – daiktų: ${n}. Kiekvieną kartą ant stalo atsiduria vis kiti.`,
  seen: (a, n) => `Tavo jau matyti daiktai: ${a} iš ${n}`,
  levelsT: "Užduotys",
  grade: "7–8 kl.",
  levels: {
    l1: { name: "Šešėlio kryptis", sub: "Suk lempą aplink daiktą, kad šešėlis kristų į pažymėtą vietą" },
    l2: { name: "Šešėlio ilgis", sub: "Kelk ir leisk lempą: žemai – šešėlis ilgas, aukštai – trumpas" },
    l3: { name: "Kur lempa?", sub: "Pagal šešėlį nuspręsk, iš kur šviečia šviesa" },
    l4: { name: "Šviesiausia ir tamsiausia", sub: "Parodyk šviesiausią ir tamsiausią daikto vietą" },
    l5: { name: "Tonai", sub: "Gipsiniai modeliai: rikiuok vietas nuo šviesiausios iki tamsiausios" },
    l6: { name: "Natiurmortas", sub: "Keli daiktai kartu ir visų rūšių užduotys" }
  },
  ins: {
    dir: "Suk lempą, kad šešėlis uždengtų punktyru pažymėtą plotą.",
    len: "Suk, kelk ir leisk lempą, kad šešėlis uždengtų punktyru pažymėtą plotą.",
    lamp: "Lempa paslėpta. Pagal šešėlį nuspręsk, kurioje vietoje ji šviečia.",
    spot1: "Paliesk šviesiausią daikto vietą.",
    spot2: "Dabar paliesk tamsiausią daikto vietą.",
    spot1m: "Paliesk šviesiausią vietą ant daiktų.",
    spot2m: "Dabar paliesk tamsiausią vietą ant daiktų.",
    tone: "Paliesk pažymėtas vietas iš eilės – nuo šviesiausios iki tamsiausios."
  },
  hint: {
    dirT: "Vilk pirštu į šonus – lempa suksis aplink daiktą.", lenT: "Vilk pirštu: į šonus – lempa sukasi, aukštyn ir žemyn – kyla ir leidžiasi.",
    dirK: "Vilk pele į šonus arba spausk rodykles ← →. Enter – tikrinti.", lenK: "Vilk pele arba spausk rodykles: ← → suka, ↑ ↓ kelia ir leidžia. Enter – tikrinti.",
    lamp: "Paliesk vieną iš sunumeruotų lempų.", spot: "Paliesk daiktą toje vietoje.", tone: "Paliesk raide pažymėtą vietą."
  },
  btn: { check: "Tikrinti", next: "Toliau", finish: "Baigti", exit: "Baigti" },
  hud: { task: (i, n) => `${i} / ${n}`, order: "Eilė:" },
  fb: {
    okDir: "Sutampa! Šešėlis visada krinta į priešingą pusę nei šviesa.",
    okLen: "Sutampa! Kuo žemiau lempa, tuo ilgesnis šešėlis.",
    missSide: "Šešėlis krinta ne į tą pusę. Suk lempą aplink daiktą.",
    missShort: "Šešėlis per trumpas – nuleisk lempą žemiau.",
    missLong: "Šešėlis per ilgas – pakelk lempą aukščiau.",
    missNear: "Beveik! Dar truputį pataisyk lempos vietą.",
    okLamp: "Teisingai! Lempa visada yra priešingoje pusėje nei šešėlis.",
    lampOpp: "Ne. Šešėlis krinta tolyn nuo lempos, todėl lempa – kitoje daikto pusėje.",
    lampHigh: "Ne. Taip aukštai pakelta lempa mestų trumpesnį šešėlį.",
    lampLow: "Ne. Taip žemai nuleista lempa mestų ilgesnį šešėlį.",
    lampSide: "Ne. Iš čia šviečiant šešėlis kristų į kitą pusę.",
    okSpot1: "Taip! Šviesiausia ten, kur paviršius atsuktas tiesiai į lempą.",
    noSpot1: "Čia ne šviesiausia vieta. Ieškok paviršiaus, atsukto į lempą.",
    okSpot2: "Taip! Tamsiausia ten, kur šviesa nepasiekia, – tai savasis daikto šešėlis.",
    noSpot2: "Čia ne tamsiausia vieta. Ieškok pusės, nusuktos nuo lempos.",
    spotMiss: "Paliesk patį daiktą.",
    toneOk: "Taip!",
    toneNo: "Ne – tarp likusių yra šviesesnė vieta. Pažiūrėk atidžiau.",
    toneDone: "Puiku! Nuo šviesos iki šešėlio – taip dailininkai mato tonus.",
    reveal: "Teisingas atsakymas parodytas. Įsižiūrėk ir eik toliau."
  },
  rep: {
    title: "Darbas baigtas!", points: (a, b) => `Taškai: ${a} iš ${b}`, fresh: n => `Nauji daiktai tavo kolekcijoje: ${n}`,
    line: ["Šešėliai dar slepia paslapčių – pabandyk dar kartą.", "Geras darbas!", "Meistriškai – šviesą ir šešėlius matai kaip dailininkas!"],
    again: "Dar kartą", next: "Kita užduotis", menu: "Į užduočių sąrašą"
  },
  learnT: "Dailininko užrašai",
  learn: [
    { name: "Šviesa ir šešėlis", html: "<p>Kai į daiktą šviečia lempa, viena jo pusė būna <b>apšviesta</b>, o kita lieka <b>šešėlyje</b>. Kur šviesa nepasiekia paties daikto paviršiaus, matome <b>savąjį šešėlį</b>. Šešėlis, kurį daiktas meta ant stalo ar ant kitų daiktų, vadinamas <b>krintančiu šešėliu</b>.</p><p>Būtent šviesa ir šešėliai leidžia suprasti, kad daiktas yra trimatis, o ne plokščias.</p>" },
    { name: "Šešėlio kryptis ir ilgis", html: "<p>Šešėlis visada krinta į <b>priešingą pusę</b> nei šviesa: lempa kairėje – šešėlis dešinėje.</p><p>Kuo <b>žemiau</b> šviesos šaltinis, tuo šešėlis <b>ilgesnis</b>; kuo <b>aukščiau</b> – tuo <b>trumpesnis</b>. Taip būna ir lauke: vidurdienį šešėliai trumpi, o vakare ilgi.</p>" },
    { name: "Tonai ir apimtis", html: "<p>Piešdami apimtį dailininkai naudoja <b>tonus</b> – nuo šviesiausio iki tamsiausio. Šviesiausia ten, kur paviršius atsuktas tiesiai į šviesą. Kuo labiau paviršius nuo šviesos nusisuka, tuo tonas tamsesnis.</p><p>Laipsniški tonų perėjimai padeda plokščiame lape pavaizduoti apimtinę, trimatę formą. Todėl mokantis piešti dažnai piešiami balti gipsiniai modeliai – ant jų tonai matyti geriausiai.</p>" },
    { name: "Kaip dirbti dirbtuvėje", html: "<p>Lempą valdyk vilkdamas pirštu ar pele per ekraną: į šonus – lempa sukasi aplink daiktą, aukštyn ir žemyn – kyla ir leidžiasi. Kai šešėlis sutampa su punktyru, spausk <b>Tikrinti</b>.</p><p>Kitose užduotyse tiesiog paliesk reikiamą vietą: lempą, daikto paviršių arba raide pažymėtą tašką. Už kiekvieną užduotį gauni iki 3 taškų – kuo mažiau klaidų, tuo daugiau.</p>" }
  ],
  daiktai: {
    kubas: "Kubas", gretasienis: "Stačiakampis gretasienis", rutulys: "Rutulys", ritinys: "Ritinys", kugis: "Kūgis", piramide: "Piramidė", prizme3: "Trikampė prizmė", prizme6: "Šešiakampė prizmė", pusrutulis: "Pusrutulis", toras: "Žiedas",
    oktaedras: "Oktaedras", nupjautinis: "Nupjautinis kūgis", tetraedras: "Trikampė piramidė", vamzdis: "Vamzdis", laiptuota: "Laiptuota piramidė", obeliskas: "Obeliskas", zvaigzde: "Žvaigždė", sirdis: "Širdis", menulis: "Mėnulio pjautuvas", krumpliaratis: "Krumpliaratis",
    puodelis: "Puodelis", arbatinukas: "Arbatinukas", asotis: "Ąsotis", vaza: "Vaza", butelis: "Butelis", stikline: "Stiklinė", taure: "Taurė", dubuo: "Dubuo", lekste: "Lėkštė", puodas: "Puodas", keptuve: "Keptuvė", druskine: "Druskinė", kocelas: "Kočėlas",
    piltuvelis: "Piltuvėlis", termosas: "Termosas", zvakide: "Žvakidė", zvake: "Žvakė", kavinukas: "Kavinukas", kibiras: "Kibiras", laistytuvas: "Laistytuvas", statine: "Statinė", grustuve: "Grūstuvė", puodyne: "Puodynė", gele: "Gėlė vazone", "siulu-rite": "Siūlų ritė", akvariumas: "Akvariumas",
    obuolys: "Obuolys", kriause: "Kriaušė", apelsinas: "Apelsinas", citrina: "Citrina", slyva: "Slyva", vysnios: "Vyšnios", arbuzas: "Arbūzas", moliugas: "Moliūgas", morka: "Morka", baklazanas: "Baklažanas", pomidoras: "Pomidoras", baravykas: "Baravykas", musmire: "Musmirė",
    bananas: "Bananas", braske: "Braškė", ananasas: "Ananasas", svogunas: "Svogūnas", cesnakas: "Česnakas", kiausinis: "Kiaušinis", gile: "Gilė", paprika: "Paprika", ridikelis: "Ridikėlis", kukuruzas: "Kukurūzo burbuolė", eglute: "Eglutė", medis: "Medis", akmuo: "Akmuo", kristalas: "Kristalas",
    suris: "Sūris", tortas: "Tortas", keksiukas: "Keksiukas", ledai: "Ledai", spurga: "Spurga", duona: "Duonos kepalas", saldainis: "Saldainis", mesainis: "Mėsainis",
    kamuolys: "Kamuolys", vilkelis: "Vilkelis", "ziedu-piramide": "Žiedų piramidė", kubeliai: "Kubelių bokštas", "sniego-senis": "Sniego senis", raketa: "Raketa", keglis: "Kėglis", pestininkas: "Šachmatų pėstininkas", "bokstas-s": "Šachmatų bokštas", rikis: "Šachmatų rikis",
    matrioska: "Matrioška", robotas: "Robotas", masinele: "Mašinėlė", traukinukas: "Garvežys", laivelis: "Laivelis", namelis: "Namelis", pilis: "Pilies bokštas", svyturys: "Švyturys", malunas: "Vėjo malūnas", bugnas: "Būgnas", varpelis: "Varpelis", skrybele: "Skrybėlė", kepure: "Kepurė",
    karuna: "Karūna", dovana: "Dovanų dėžutė", knyga: "Knyga", "knygu-kruva": "Knygų krūva", piestukas: "Pieštukas", piestukine: "Pieštukinė", zadintuvas: "Žadintuvas", "smelio-laikrodis": "Smėlio laikrodis", zibintas: "Žibintas", "staline-lempa": "Stalinė lempa", gaublys: "Gaublys",
    planeta: "Planetos modelis", trofejus: "Nugalėtojo taurė", taburete: "Taburetė", staliukas: "Staliukas", kede: "Kėdė", laiptai: "Laiptai", arka: "Arka", kolona: "Kolona", svarmuo: "Svarmuo", lamzdelis: "Lamzdelis", birbyne: "Birbynė", kankles: "Kanklės", lagaminas: "Lagaminas",
    batas: "Aulinis batas", varztas: "Varžtas", fotoaparatas: "Fotoaparatas", inkilas: "Inkilas", palapine: "Palapinė", sulinys: "Šulinys", "kelio-kugis": "Kelio kūgis", antis: "Guminė antis", pingvinas: "Pingvinas", meskiukas: "Pliušinis meškiukas", sraige: "Sraigė", boruze: "Boružė",
    vezlys: "Vėžlys", paukstelis: "Paukštelis", ufo: "Skraidanti lėkštė"
  }
};
