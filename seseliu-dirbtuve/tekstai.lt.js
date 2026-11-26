/* Šešėlių dirbtuvė – visi mokiniui rodomi tekstai (lietuvių k.). Verčiant užtenka išversti šį failą.
   Tema – Dailės bendroji programa, 7–8 kl.: „Šviesa ir šešėliai“, „Apimtinių trimačių formų vaizdavimas plokštumoje“, „toninė įvairovė“.
   „Savasis šešėlis“ ir „krintantis šešėlis“ – įprasti piešimo mokymo terminai (programoje jie atskirai neįvardyti). */
window.MK_T = {
  title: "Šešėlių dirbtuvė",
  h1: "Šešėlių dirbtuvė",
  lead: "Atpažink šešėlius, tapyk tonais ir slėpkis nuo šviesos – taip mokaisi matyti, kaip šviesa ir šešėliai parodo daikto apimtį.",
  note: n => `Dirbtuvės lentynose – daiktų: ${n}. Kiekvieną kartą ant stalo atsiduria vis kiti.`,
  seen: (a, n) => `Tavo jau matyti daiktai: ${a} iš ${n}`,
  levelsT: "Žaidimai",
  modes: {
    teatras: { name: "Kieno šešėlis?", sub: "Šešėlių teatras: kuo greičiau atpažink, kurio daikto šešėlis ant širmos" },
    molbertas: { name: "Tapytojo molbertas", sub: "Nuspalvink piešinio zonas tinkamais tonais – taip, kaip krinta šviesa" },
    slepynes: { name: "Šešėlių slėpynės", sub: "Naktis dirbtuvėje: nuvesk pelytę iki durų slepdamasis nuo lempų šešėliuose" },
    ivadas: { name: "Lempos pamoka", sub: "Trumpas įvadas: šešėlio kryptis, ilgis, šviesiausia ir tamsiausia vieta" }
  },
  sl: { az: "◄ sukti lempą ►", el: "aukštis" },
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
    dirT: "Stumdyk geltoną rutuliuką – lempa suksis aplink daiktą.", lenT: "Apatinis slankiklis lempą suka, dešinysis – kelia ir leidžia.",
    dirK: "Stumdyk slankiklį arba spausk rodykles ← →. Enter – tikrinti.", lenK: "Slankikliai arba rodyklės: ← → suka, ↑ ↓ kelia ir leidžia. Enter – tikrinti.",
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
    { name: "Kaip nutapyti šešėlį", html: "<p>Dailininkai daiktą dalija į tonų zonas. <b>Šviesa</b> – ten, kur paviršius atsuktas į lempą: šviesiausias tonas. <b>Pustonis</b> – kur šviesa krinta įstrižai: šiek tiek tamsiau. <b>Savasis šešėlis</b> – nuo lempos nusukta pusė: tamsu. <b>Atspindys</b> – šešėlio pusės apačia, kurią truputį apšviečia nuo stalo atsimušusi šviesa: šviesiau nei savasis šešėlis. <b>Krintantis šešėlis</b> ant stalo – tamsiausias.</p>" },
    { name: "Kaip žaisti", html: "<p><b>Kieno šešėlis?</b> Ant širmos – paslėpto daikto šešėlis. Kuo greičiau paliesk daiktą, kuriam jis priklauso. Teisingi atsakymai iš eilės didina taškų daugiklį, klaida atima laiko.</p><p><b>Tapytojo molbertas.</b> Pasirink toną paletėje ir paliesk piešinio zoną. Kai nuspalvinsi visas, spausk „Tikrinti“. Kartais reikia atvirkščiai – pagal gatavą piešinį nustatyti lempą dviem slankikliais.</p><p><b>Šešėlių slėpynės.</b> Vesk pelytę vairalazde arba rodyklėmis. Šviesoje pildosi pastebėjimo juosta – spėk pasislėpti šešėlyje. Rink dažų tūbeles ir pasiek duris.</p>" }
  ],
  teatras: { time: "Laikas", score: n => `${n} tšk.`, go: "Kieno šešėlis?", stage: ["Daiktas sukasi", "Daiktas vartosi", "Šešėlis ištemptas"], stageUp: "Sunkiau!", ok: ["Taip!", "Tiksliai!", "Greita akis!"], no: n => `Ne – tai ${n}.`,
    title: "Laikas baigėsi!", res: (ok, n) => `Atpažinti šešėliai: ${ok} iš ${n}`, best: n => `Ilgiausia serija: ${n}`, lines: ["Šešėliai apgaulingi – pabandyk dar kartą.", "Gera akis!", "Šešėlių teatro žvaigždė!"] },
  molbertas: { task: (i, n) => `Piešinys ${i} / ${n}`, paint: "Nuspalvink zonas tonais – pagal tai, iš kur šviečia lempa.", paintOff: "Lempa dar išjungta. Numatyk, kur bus šviesa ir šešėliai, ir nuspalvink zonas.", match: "Nustatyk lempą taip, kad daiktas atrodytų kaip piešinyje.",
    tones: ["šviesa", "pustonis", "atspindys", "savasis šešėlis", "krintantis šešėlis"], check: "Tikrinti", next: "Toliau", finish: "Baigti",
    okPaint: "Puiku! Šviesa – į lempą atsuktoje pusėje, tamsiausia – krintantis šešėlis.", noPaint: n => `Dar ne: netinkamai nuspalvintų zonų – ${n}. Pažiūrėk, iš kur šviečia lempa.`, reveal: "Štai kaip tai nutapytų dailininkas.",
    okMatch: "Sutampa! Šešėlis krinta į priešingą pusę nei lempa.", noSide: "Šešėlis krinta ne į tą pusę – pasuk lempą.", noHigh: "Šešėlis per trumpas – nuleisk lempą.", noLow: "Šešėlis per ilgas – pakelk lempą.", near: "Beveik! Dar truputį.",
    title: "Piešiniai baigti!", points: (a, b) => `Taškai: ${a} iš ${b}`, lines: ["Tonai dar painiojasi – pabandyk dar kartą.", "Gražūs piešiniai!", "Tikras tonų meistras!"] },
  slepynes: { room: (i, n) => `Kambarys ${i} / ${n}`, tips: ["Vesk pelytę pirštu arba rodyklėmis. Šešėlis krinta tolyn nuo lempos – slėpkis už daiktų ir bėk prie durų.", "Lempa sukiojasi – kartu juda ir šešėliai. Lauk tinkamos akimirkos.", "Dvi lempos šviečia iš skirtingų pusių – ir šešėliai krinta į skirtingas puses.", "Lempa kyla ir leidžiasi: kai ji žemai, šešėliai ilgi, kai aukštai – trumpi.", "Paskutinis kambarys: viena lempa sukasi ratu, kita kilnojasi."],
    seen: "Pastebėjo! Grįžti į pradžią.", tube: "Dažų tūbelė!", tubes: n => `Tūbelės: ${n}`, door: "Kambarys įveiktas!", lost: "Širdelių nebeliko – kambarį pradedi iš naujo.", next: "Kitas kambarys", joy: "Vesk pelytę: vilk pirštu arba spausk rodykles.",
    title: "Dirbtuvė perbėgta!", res: (t, n) => `Dažų tūbelės: ${t} iš ${n}`, hearts: n => `Prarasta širdelių: ${n}`, hint: n => `Trims žvaigždutėms surink bent ${n} tūbelių ir prarask ne daugiau kaip 2 širdeles.`, lines: ["Lempos buvo budrios – pabandyk dar kartą.", "Gerai slapstaisi!", "Šešėlių meistras – lempos tavęs beveik nematė!"] },
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
