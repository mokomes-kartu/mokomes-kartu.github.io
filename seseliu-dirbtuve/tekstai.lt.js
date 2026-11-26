/* Šešėlių dirbtuvė – visi mokiniui rodomi tekstai (lietuvių k.). Verčiant užtenka išversti šį failą.
   Tema – šviesa ir šešėlis. Dailės bendrojoje programoje „Šviesa ir šešėliai“, „Apimtinių trimačių formų vaizdavimas plokštumoje“, „toninė įvairovė“ – 7–8 kl. turinys;
   pelytės žaidimas („Šešėlių slėpynės“) tinka ir jaunesniems, todėl žaidimas rodomas 4–8 kl.
   „Savasis šešėlis“ ir „krintantis šešėlis“ – įprasti piešimo mokymo terminai (programoje jie atskirai neįvardyti). */
window.MK_T = {
  title: "Šešėlių dirbtuvė",
  h1: "Šešėlių dirbtuvė",
  lead: "Nuvesk pelytę per naktinę dirbtuvę slėpdamasis šešėliuose ir atpažink daiktus iš jų šešėlių – taip mokaisi suprasti, kaip krinta šviesa ir kur atsiranda šešėlis.",
  note: n => `Dirbtuvės lentynose – daiktų: ${n}. Kiekvieną kartą ant stalo atsiduria vis kiti.`,
  seen: (a, n) => `Tavo jau matyti daiktai: ${a} iš ${n}`,
  levelsT: "Žaidimai",
  modes: {
    slepynes: { name: "Šešėlių slėpynės", sub: "Naktis dirbtuvėje: vesk pelytę iki durų – slėpkis šešėliuose, stumdyk dėžes, graužk sūrį ir virves" },
    teatras: { name: "Kieno šešėlis?", sub: "Šešėlių teatras: kuo greičiau atpažink, kurio daikto šešėlis ant širmos" },
    ivadas: { name: "Lempos pamoka", sub: "Trumpas įvadas: šešėlio kryptis, ilgis, šviesiausia ir tamsiausia vieta" }
  },
  sl: { az: "◄ sukti lempą ►", el: "aukštis" },
  grade: "4–8 kl.",
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
    { name: "Kaip žaisti", html: "<p><b>Šešėlių slėpynės.</b> Vesk pelytę pirštu (vairalazdė atsiranda ten, kur palieti ekraną) arba rodyklėmis. Šviesoje pildosi pastebėjimo juosta – spėk pasislėpti šešėlyje, kol ji neprisipildė. Priėjęs prie mėlynos dėžės, sūrio, virvės kuoliuko ar kabelio, spausk veiksmo mygtuką (kompiuteryje – tarpo klavišą): pelytė stums arba grauš. Jei lempa pastebi, kambarys prasideda iš naujo.</p><p><b>Kieno šešėlis?</b> Ant širmos – paslėpto daikto šešėlis. Kuo greičiau paliesk daiktą, kuriam jis priklauso. Teisingi atsakymai iš eilės didina taškų daugiklį, klaida atima laiko.</p>" }
  ],
  teatras: { time: "Laikas", score: n => `${n} tšk.`, go: "Kieno šešėlis?", stage: ["Daiktas vartosi", "Šešėlis suspaustas", "Matyti tik dalis šešėlio", "Viskas kartu"], stageUp: "Sunkiau!", ok: ["Taip!", "Tiksliai!", "Greita akis!"], no: n => `Ne – tai ${n}.`,
    title: "Laikas baigėsi!", res: (ok, n) => `Atpažinti šešėliai: ${ok} iš ${n}`, best: n => `Ilgiausia serija: ${n}`, lines: ["Šešėliai apgaulingi – pabandyk dar kartą.", "Gera akis!", "Šešėlių teatro žvaigždė!"] },
  slepynes: {
    floors: [{ name: "1 aukštas", sub: "Šešėliai ir lempos" }, { name: "2 aukštas", sub: "Stumdomos dėžės" }, { name: "Bandomieji kambariai", sub: "Sūris, virvė, kabelis ir katinas" }],
    pickT: "Pasirink kambarį", pickS: (d, n) => `Įveikta kambarių: ${d} iš ${n}`, soon: "Kiti aukštai – netrukus.",
    room: n => `${n} kambarys`, tubes: (a, n) => `Tūbelės ${a}/${n}`, act: { push: "Stumti", gnaw: "Graužti", none: "Veiksmas" }, keyHint: "tarpas", restart: "Pradėti kambarį iš naujo",
    kinds: { one: "Šešėlis krinta tolyn nuo lempos. Slėpkis už daiktų ir bėk prie durų.", two: "Dvi lempos: saugu tik ten, kur nepasiekia nė viena.", sw: "Lempa sukiojasi – kartu juda ir šešėliai. Lauk tinkamos akimirkos.", hv: "Lempa kyla ir leidžiasi: kai ji žemai, šešėliai ilgi, kai aukštai – trumpi.", rot: "Lempa sukasi ratu. Bėk, kai šviesa nusisuka, ir slėpkis už daiktų." },
    tips: { "1-1": "Vesk pelytę pirštu arba rodyklėmis. Šešėlis krinta tolyn nuo lempos – slėpkis už daiktų ir bėk prie durų.", "2-1": "Mėlyną dėžę galima pastumti: prieik prie jos ir spausk „Stumti“. Pastumta dėžė mes šešėlį kitur.", "b-1": "Sūrį galima pragraužti: prieik prie jo ir spausk „Graužti“.", "b-2": "Virvė laiko pakabintą maišą. Nugraužk ją prie kuoliuko – maišas nukris ir mes šešėlį.", "b-3": "Ieškok raudono kištuko ant grindų: nugraužus kabelį lempa užges.", "b-4": "Katinas vaikšto pirmyn ir atgal. Eik jo šešėlyje, bet neprisiliesk!" },
    seen: "Lempa pastebėjo! Kambarys prasideda iš naujo.", cat: "Katinas pagavo! Kambarys prasideda iš naujo.", stuck: "Į tą pusę dėžė nepasistumia.", tube: "Dažų tūbelė!", door: "Pavyko!", next: "Kitas kambarys", rooms: "Kambarių sąrašas",
    won: "Kambarys įveiktas!", wonL: ["Pavyko! Kitą kartą pabandyk nepakliūti lempoms.", "Gerai slapstaisi!", "Tobula – nė karto nepastebėta ir visos tūbelės surinktos!"], res: (t, n, f) => `Dažų tūbelės: ${t} iš ${n} · pastebėta kartų: ${f}`, hint3: "Trims žvaigždutėms: nė karto nepakliūk ir surink visas tūbeles." },
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
