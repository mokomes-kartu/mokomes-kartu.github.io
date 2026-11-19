/* Rivertono taksi – visi mokiniui rodomi tekstai (lietuviški ir angliški). Verčiant užtenka išversti šį failą.
   Pagrindas: Užsienio kalbos (pirmosios) bendroji programa, 5–6 kl. (A2 / A2+): 26.1.7 „Vietovės mieste ir kaime, atstumas, kelias, judėjimas“,
   26.9.3–26.9.4 (erdvė, judėjimas, kryptis), 26.11.4 ir 26.14.1 (nurodymai, kaip iš vienos vietos patekti į kitą), 26.6.2.11 (Prepositions of time, place, movement).
   Anglų kalba – britiškasis variantas (chemist's, cinema, petrol station, car park, turning). */
window.MK_T = {
  title: "Rivertono taksi",
  kick: "Anglų kalba · 6 klasė",
  lead: "Tu – taksi vairuotojas Anglijos miestelyje Rivertone. Keleiviai kalba tik angliškai: suprask, kur jiems reikia, ir nuvežk. Navigacijos nėra – yra tik keleivio žodžiai.",
  licence: "Vairuotojo pažymėjimas",
  coins: (w, tot) => `Piniginė: £${w} · iš viso uždirbta: £${tot}`,
  guide: (a, b) => `Miesto gidas: ${a} iš ${b} vietų`,
  ranks: [[0, "Mokinys vairuotojas"], [80, "Jaunesnysis vairuotojas"], [200, "Taksi vairuotojas"], [400, "Patyręs vairuotojas"], [700, "Rivertono žinovas"], [1100, "Rivertono legenda"]],
  shiftsT: "Pamainos",
  shifts: [
    { id: "p1", name: "Rytinė pamaina", sub: "Vietos mieste: kur žmonėms reikia? (the bakery, the chemist's, the town hall…)" },
    { id: "p2", name: "Namų adresai", sub: "Kur tas namas? next to, opposite, between, behind, on the corner of…" },
    { id: "p3", name: "Kelio nurodymai", sub: "Go straight on, take the second turning on the left, it's on your right…" },
    { id: "p4", name: "Ilgi maršrutai", sub: "Keturių posūkių maršrutai ir reikalai pakeliui: first, then, before, after that…" },
    { id: "p5", name: "Radijo iškvietimai", sub: "Klausymas: keleivį tik girdi. Tekstą galima atsiversti, bet tai – užuomina." },
    { id: "p6", name: "Vairuotojo egzaminas", sub: "8 keleiviai, visų rūšių užsakymai." }
  ],
  fares: n => `${n} keleiviai`,
  bookT: "Pasikalbėjimų knygelė (noriu pasimokyti)",
  guideT: "Miesto gidas",
  guideNote: "Vieta įrašoma į gidą, kai keleivį į ją nuveži be klaidų ir be užuominos.",
  note: "Žaidimas nieko nesiunčia – pažanga saugoma tik šiame įrenginyje.",
  how: {
    t: "Kaip vairuoti",
    touch: "Viskas valdoma vienu nykščiu – vairalazde apačioje dešinėje: stumk aukštyn – važiuoji, į kairę ar į dešinę – suki, žemyn – stabdai ir važiuoji atgal. Virš vairalazdės – mygtukas „Čia!“: privažiuok prie pat pastato, arčiau jo šaligatvio (pastatas apsibrėš geltonai), ir paspausk.",
    keys: "Klaviatūra: rodyklės arba W A S D – važiuoti ir sukti, tarpas arba Enter – „Čia!“, M – žemėlapis, V – vertimas, R – grįžti į pradžią.",
    rule: "Dispečerė angliškai praneša, kur laukia keleivis. Jis laukia ne amžinai (juostelė viršuje) – nespėsi, mokėsi £2 ir gausi rodyklę. Už nuvežimą – £10, o be klaidų ir užuominų – dar £2 arbatpinigių. Baudos: ne ten atvežei – £2, vertimas – £1, pravažiavai raudoną šviesoforą – £2, atsitrenkei į kitą automobilį – £1. Rivertone važiuojama dešiniąja kelio puse, kaip Lietuvoje (tikroje Didžiojoje Britanijoje važiuojama kaire). Geltona rodyklė prieš taksi ir geltonas ratas rodo, kur MAŽDAUG važiuoti – tikslią vietą rasi tik supratęs angliškus žodžius. Rodyklę galima išjungti mygtuku „Rodyklė“.",
    ok: "Supratau, važiuojam"
  },
  hud: {
    quit: "Į garažą", fsOn: "Visas ekranas", fsOff: "Išeiti iš viso ekrano", map: "Žemėlapis", mapClose: "Uždaryti žemėlapį", listen: "Paklausyti", tr: "Vertimas (−£1)", back: "Į pradžią", here: "Čia!",
    showText: "Rodyti tekstą (−£1)", fare: (a, b) => `${a}/${b}`, money: n => (n < 0 ? "−£" + (-n) : "£" + n),
    joy: "Vairalazdė: aukštyn – važiuoti, į šonus – sukti, žemyn – stabdyti ir atgal", mapHint: "Stumdyk pirštu ar pele. Didink ir mažink dviem pirštais, pelės ratuku arba + / −. Šiaurė – viršuje.",
    help: "Rodyklė", helpL: "Pagalbinė rodyklė: rodo apytikslę vietą", helpOn: "Pagalbinė rodyklė įjungta: ji rodo, kur maždaug važiuoti. Tikslią vietą rasi pagal angliškus žodžius.", helpOff: "Pagalbinė rodyklė išjungta – važiuok tik pagal angliškus žodžius.",
    nearCall: "Keleivis kažkur netoli (geltonas ratas). Toliau ieškok pagal dispečerės žodžius.", nearFare: "Tikslas kažkur netoli (geltonas ratas). Tikslų pastatą rask pagal keleivio žodžius."
  },
  call: {
    at: ["Pick up a passenger outside {D}.", "Paimkite keleivį: važiuokite į {D}."],
    corner: ["A passenger is waiting on the corner of {S} and {A}.", "Keleivis laukia „{S}“ ir „{A}“ gatvių kampe."],
    stretch: ["A passenger is waiting in {S}, between {A} and {B}.", "Keleivis laukia „{S}“ gatvėje, tarp „{A}“ ir „{B}“ gatvių."],
    n: k => `Call ${k}:`,
    tip: "Keleivio iš tolo nematyti – jį pamatysi tik privažiavęs (geltonas žiedas). Sustok šalia.",
    late: "Keleivis nesulaukė ir paskambino dar kartą. Bauda £2. Įjungiau geltoną rodyklę – paskubėk.",
    trT: "Iškvietimo vertimas"
  },
  fine: {
    red: "Red light! Raudonas šviesoforas – bauda £2.",
    crash: "Careful! Atsitrenkei į kitą automobilį – bauda £1.",
    lineRed: "Raudonas šviesoforas", lineCrash: "Susidūrimai", lineLate: "Keleivis nesulaukė", lineHint: "Vertimai ir užuominos", lineWrong: "Ne ten atvežta", lineTip: "Arbatpinigiai"
  },
  shop: {
    t: "Garažas: taksi spalva", buy: p => `Pirkti už £${p}`, use: "Naudoti", on: "Naudojama", poor: "Dar neužtenka pinigų.",
    cars: [["classic", "Geltonas klasikinis", 0], ["black", "Londono juodas", 60], ["red", "Raudonas", 140], ["blue", "Mėlynas", 240], ["green", "Žalias", 360], ["pink", "Rožinis", 500]]
  },
  disp: "Dispečerė",
  pass: "Keleivis",
  boarding: "Keleivis lipa į automobilį…",
  listenOnly: "Radijo iškvietimas – paklausyk, ką sako keleivis.",
  noVoice: "Šis įrenginys neturi angliško balso, todėl tekstas rodomas iškart.",
  startPose: "Kryptys skaičiuojamos nuo čia ir nuo to, kur dabar atsuktas automobilis. Pasiklydai? Spausk „Į pradžią“.",
  noLot: "Čia nėra pastato. Sustok gatvėje prie pat pastato – jis apsibrėš geltonai.",
  slow: "Pirma sustok.",
  stop1: "✓ Pirmas sustojimas. Keleivis tuoj grįš… Važiuojam toliau!",
  tooEarly: (a) => `Dar ne čia. Keleivis pirmiausia norėjo kitur – įsiskaityk į žodžius first, then, before, after.`,
  backDone: "Grąžinau į vietą, kur įlipo keleivis.",
  wrong: {
    t: "Ne ten!",
    here: what => `Čia – ${what}.`,
    asked: "Keleivis sakė:",
    think: "Perskaityk dar kartą ir pagalvok, kurie žodžiai svarbiausi.",
    means: "Lietuviškai:",
    gps: "Įjungiau žalią rodyklę – ji rodo, kur reikėjo važiuoti. Nuvežk keleivį.",
    again: "Bandau dar kartą"
  },
  hint: { t: "Vertimas (užuomina)", ok: "Aišku" },
  done: {
    t: ["Atvykome!", "Tiksliai čia!", "Thank you, driver!", "Here we are!", "Perfect, thank you!"],
    said: "Keleivis sakė:", means: "Lietuviškai:", words: "Įsidėmėk:", pay: (n, tip) => n > 0 ? `Uždarbis: £${n}` + (tip ? " + £" + tip + " arbatpinigių už tvarkingą kelionę" : "") : "Uždarbio už šią kelionę nėra – klaidos ir užuominos suvalgė viską.",
    guide: w => `Į miesto gidą įrašyta: ${w}.`, next: "Važiuoti toliau"
  },
  end: {
    t: "Pamainos kvitas", fares: "Kelionės", total: n => `Pamainos uždarbis: ${n < 0 ? "−£" + (-n) : "£" + n}`,
    s3: "Puiki pamaina – keleiviai tave rekomenduos!", s2: "Gera pamaina. Mažiau baudų – ir uždarbis bus dar didesnis.", s1: "Pamaina baigta, bet baudos suvalgė uždarbį. Atsiversk pasikalbėjimų knygelę ir pabandyk dar kartą.",
    again: "Dar viena tokia pamaina", menu: "Į garažą"
  },
  quitQ: "Baigti pamainą? Šios pamainos uždarbis nebus įskaitytas.",
  yes: "Baigti", no: "Tęsti",
  houseLt: c => `${c} namas`,
  gardenLt: "sodelis (ne pastatas)",
  /* ---------- miestas ---------- */
  streets: ["Hill Road", "North Street", "High Street", "Green Road", "London Road", "Lake Lane"],
  avenues: ["Oak Avenue", "Mill Lane", "Rose Lane", "West Bank", "East Bank", "Queen's Road", "Victoria Road", "King's Road"],
  river: "River Rill",
  colours: [
    { id: "red", en: "red", lt: "raudonas", a: "raudoną" }, { id: "blue", en: "blue", lt: "mėlynas", a: "mėlyną" },
    { id: "green", en: "green", lt: "žalias", a: "žalią" }, { id: "yellow", en: "yellow", lt: "geltonas", a: "geltoną" },
    { id: "white", en: "white", lt: "baltas", a: "baltą" }, { id: "orange", en: "orange", lt: "oranžinis", a: "oranžinį" },
    { id: "pink", en: "pink", lt: "rožinis", a: "rožinį" }, { id: "brown", en: "brown", lt: "rudas", a: "rudą" }
  ],
  /* n – vardininkas, a – galininkas (į ką?), g – kilmininkas (šalia ko?); need – keleivio sakiniai be vietos pavadinimo */
  places: [
    { id: "bank", en: "bank", n: "bankas", a: "banką", g: "banko", need: [["I need to get some money from my account.", "Man reikia pasiimti pinigų iš savo sąskaitos."], ["I want to change euros into pounds.", "Noriu išsikeisti eurus į svarus."]] },
    { id: "post", en: "post office", n: "paštas", a: "paštą", g: "pašto", need: [["I want to send a parcel to my grandmother.", "Noriu išsiųsti siuntinį močiutei."], ["I need to buy some stamps for my postcards.", "Man reikia nusipirkti pašto ženklų atvirukams."]] },
    { id: "library", en: "library", n: "biblioteka", a: "biblioteką", g: "bibliotekos", need: [["I want to borrow a book about dinosaurs.", "Noriu pasiskolinti knygą apie dinozaurus."], ["I have to return these books today.", "Šiandien turiu grąžinti šias knygas."]] },
    { id: "school", en: "school", n: "mokykla", a: "mokyklą", g: "mokyklos", need: [["My lessons start at eight o'clock.", "Mano pamokos prasideda aštuntą valandą."], ["I'm a teacher and my pupils are waiting for me.", "Esu mokytojas, manęs laukia mokiniai."]] },
    { id: "hospital", en: "hospital", n: "ligoninė", a: "ligoninę", g: "ligoninės", need: [["My brother broke his leg and I want to visit him.", "Mano brolis susilaužė koją, noriu jį aplankyti."], ["I'm a nurse and my night shift starts soon.", "Esu slaugytoja, netrukus prasideda mano naktinė pamaina."]] },
    { id: "chemist", en: "chemist's", n: "vaistinė", a: "vaistinę", g: "vaistinės", need: [["I need some medicine for my cough.", "Man reikia vaistų nuo kosulio."], ["I've got a headache and I need some tablets.", "Man skauda galvą, reikia tablečių."]] },
    { id: "bakery", en: "bakery", n: "kepykla", a: "kepyklą", g: "kepyklos", need: [["I need to buy some fresh bread.", "Man reikia nusipirkti šviežios duonos."], ["I want to order a birthday cake.", "Noriu užsakyti gimtadienio tortą."]] },
    { id: "supermarket", en: "supermarket", n: "prekybos centras", a: "prekybos centrą", g: "prekybos centro", need: [["I need to buy food for the whole week.", "Man reikia nupirkti maisto visai savaitei."], ["We've got no milk, eggs or vegetables at home.", "Namie neturime nei pieno, nei kiaušinių, nei daržovių."]] },
    { id: "cafe", en: "café", n: "kavinė", a: "kavinę", g: "kavinės", need: [["I'd like a cup of hot chocolate and a piece of cake.", "Norėčiau puodelio karšto šokolado ir gabalėlio pyrago."], ["I'm meeting a friend for a cup of coffee.", "Susitinku su draugu išgerti kavos."]] },
    { id: "restaurant", en: "restaurant", n: "restoranas", a: "restoraną", g: "restorano", need: [["We want to have a big family dinner tonight.", "Šįvakar norime didelės šeimos vakarienės."], ["I'm a chef and I have to cook for fifty guests.", "Esu virėjas ir turiu gaminti penkiasdešimčiai svečių."]] },
    { id: "cinema", en: "cinema", n: "kino teatras", a: "kino teatrą", g: "kino teatro", need: [["I want to see the new film.", "Noriu pažiūrėti naują filmą."], ["The film starts in twenty minutes!", "Filmas prasideda po dvidešimties minučių!"]] },
    { id: "theatre", en: "theatre", n: "teatras", a: "teatrą", g: "teatro", need: [["I've got tickets for a play tonight.", "Turiu bilietus į šio vakaro spektaklį."], ["I'm an actor and I'm on stage this evening.", "Esu aktorius ir šįvakar vaidinu scenoje."]] },
    { id: "museum", en: "museum", n: "muziejus", a: "muziejų", g: "muziejaus", need: [["I want to see how people lived a thousand years ago.", "Noriu pamatyti, kaip žmonės gyveno prieš tūkstantį metų."], ["Our class is going to see an exhibition about ancient Egypt.", "Mūsų klasė eina žiūrėti parodos apie senovės Egiptą."]] },
    { id: "police", en: "police station", n: "policijos nuovada", a: "policijos nuovadą", g: "policijos nuovados", need: [["Somebody has stolen my bike!", "Kažkas pavogė mano dviratį!"], ["I found a wallet in the street and I want to hand it in.", "Gatvėje radau piniginę ir noriu ją atiduoti."]] },
    { id: "fire", en: "fire station", n: "gaisrinė", a: "gaisrinę", g: "gaisrinės", need: [["I'm a firefighter and my shift starts soon.", "Esu ugniagesys, netrukus prasideda mano pamaina."], ["Our class is visiting the firefighters today.", "Mūsų klasė šiandien lankosi pas ugniagesius."]] },
    { id: "railway", en: "railway station", n: "geležinkelio stotis", a: "geležinkelio stotį", g: "geležinkelio stoties", need: [["My train leaves at five o'clock.", "Mano traukinys išvyksta penktą valandą."], ["I'm meeting my aunt. Her train arrives soon.", "Pasitinku tetą. Jos traukinys netrukus atvyks."]] },
    { id: "bus", en: "bus station", n: "autobusų stotis", a: "autobusų stotį", g: "autobusų stoties", need: [["I need to catch the coach to London.", "Man reikia suspėti į tarpmiestinį autobusą į Londoną."], ["My bus to the seaside leaves in half an hour.", "Mano autobusas prie jūros išvyksta po pusvalandžio."]] },
    { id: "hotel", en: "hotel", n: "viešbutis", a: "viešbutį", g: "viešbučio", need: [["I'm a tourist and I need a room for two nights.", "Esu turistas, man reikia kambario dviem naktims."], ["I've booked a room for the weekend.", "Esu užsisakęs kambarį savaitgaliui."]] },
    { id: "church", en: "church", n: "bažnyčia", a: "bažnyčią", g: "bažnyčios", need: [["My sister is getting married today.", "Mano sesuo šiandien tuokiasi."], ["I sing in the choir every Sunday morning.", "Kiekvieną sekmadienio rytą giedu chore."]] },
    { id: "pool", en: "swimming pool", n: "baseinas", a: "baseiną", g: "baseino", need: [["I've got my swimsuit and goggles with me.", "Su savimi turiu maudymosi kostiumėlį ir plaukimo akinius."], ["My swimming lesson starts soon.", "Netrukus prasideda mano plaukimo pamoka."]] },
    { id: "sports", en: "sports centre", n: "sporto centras", a: "sporto centrą", g: "sporto centro", need: [["I've got basketball training today.", "Šiandien turiu krepšinio treniruotę."], ["I want to play badminton with my friends.", "Noriu su draugais pažaisti badmintoną."]] },
    { id: "market", en: "market", n: "turgus", a: "turgų", g: "turgaus", bld: false, need: [["I want to buy fresh fruit and vegetables from the farmers.", "Noriu nusipirkti šviežių vaisių ir daržovių iš ūkininkų."], ["I sell honey at my stall every Saturday.", "Kiekvieną šeštadienį savo prekystalyje pardavinėju medų."]] },
    { id: "petrol", en: "petrol station", n: "degalinė", a: "degalinę", g: "degalinės", need: [["My car has run out of petrol. I need to buy a can.", "Mano automobiliui baigėsi benzinas. Reikia nusipirkti bakelį."], ["Driver, your tank is nearly empty. Let's fill it up.", "Vairuotojau, jūsų bakas beveik tuščias. Prisipilkime."]] },
    { id: "townhall", en: "town hall", n: "rotušė", a: "rotušę", g: "rotušės", need: [["I have a meeting with the mayor.", "Turiu susitikimą su meru."], ["The mayor is giving a speech and I must be there.", "Meras sako kalbą, privalau ten būti."]] },
    { id: "zoo", en: "zoo", n: "zoologijos sodas", a: "zoologijos sodą", g: "zoologijos sodo", bld: false, need: [["My children want to see lions and giraffes.", "Mano vaikai nori pamatyti liūtus ir žirafas."], ["I'm a zookeeper and the monkeys are hungry.", "Esu zoologijos sodo prižiūrėtojas, o beždžionės alkanos."]] },
    { id: "dentist", en: "dentist's", n: "odontologo kabinetas", a: "odontologo kabinetą", g: "odontologo kabineto", need: [["I've got a terrible toothache.", "Man baisiai skauda dantį."], ["I need to have my teeth checked.", "Man reikia pasitikrinti dantis."]] },
    { id: "hairdresser", en: "hairdresser's", n: "kirpykla", a: "kirpyklą", g: "kirpyklos", need: [["I need a haircut.", "Man reikia apsikirpti."], ["My hair is too long. I want a new style.", "Mano plaukai per ilgi. Noriu naujos šukuosenos."]] },
    { id: "carpark", en: "car park", n: "automobilių stovėjimo aikštelė", a: "automobilių stovėjimo aikštelę", g: "automobilių stovėjimo aikštelės", bld: false, need: [["I need to get back to my car. I parked it this morning.", "Man reikia grįžti prie savo automobilio. Pastačiau jį šįryt."], ["My own car is waiting for me there with all my bags.", "Ten manęs laukia mano paties automobilis su visais krepšiais."]] },
    { id: "park", en: "park", n: "parkas", a: "parką", g: "parko", bld: false, need: [["I want to walk my dog under the trees.", "Noriu pavedžioti šunį po medžiais."], ["The children want to play on the grass and feed the ducks.", "Vaikai nori pažaisti ant žolės ir palesinti antis."]] },
    { id: "stadium", en: "stadium", n: "stadionas", a: "stadioną", g: "stadiono", need: [["I've got tickets for the football match.", "Turiu bilietus į futbolo rungtynes."], ["Our team is playing in the final today.", "Mūsų komanda šiandien žaidžia finale."]] },
    { id: "bookshop", en: "bookshop", n: "knygynas", a: "knygyną", g: "knygyno", need: [["I want to buy a new English dictionary.", "Noriu nusipirkti naują anglų kalbos žodyną."], ["I need to buy a notebook and a novel for my holiday.", "Man reikia nusipirkti užrašų knygelę ir romaną atostogoms."]] },
    { id: "toyshop", en: "toy shop", n: "žaislų parduotuvė", a: "žaislų parduotuvę", g: "žaislų parduotuvės", need: [["I need a teddy bear for my little sister.", "Man reikia pliušinio meškiuko mažajai sesei."], ["My son wants a new board game for his birthday.", "Mano sūnus gimtadieniui nori naujo stalo žaidimo."]] },
    { id: "florist", en: "florist's", n: "gėlių parduotuvė", a: "gėlių parduotuvę", g: "gėlių parduotuvės", need: [["I want to buy some roses for my mum.", "Noriu nupirkti mamai rožių."], ["I need a bunch of flowers for my teacher.", "Man reikia gėlių puokštės mokytojai."]] },
    { id: "petshop", en: "pet shop", n: "gyvūnų prekių parduotuvė", a: "gyvūnų prekių parduotuvę", g: "gyvūnų prekių parduotuvės", need: [["I need some food for my hamster.", "Man reikia maisto žiurkėnui."], ["I want to buy a bigger cage for my parrot.", "Noriu nupirkti papūgai didesnį narvą."]] },
    { id: "gallery", en: "art gallery", n: "dailės galerija", a: "dailės galeriją", g: "dailės galerijos", need: [["I want to see the new exhibition of paintings.", "Noriu pamatyti naują paveikslų parodą."], ["I'm an artist and my pictures are on show there.", "Esu dailininkė, ten eksponuojami mano paveikslai."]] },
    { id: "playground", en: "playground", n: "žaidimų aikštelė", a: "žaidimų aikštelę", g: "žaidimų aikštelės", bld: false, need: [["My little brother wants to go on the swings and the slide.", "Mano mažasis brolis nori pasisupti sūpynėmis ir nučiuožti nuo čiuožyklos."], ["The children want to play on the climbing frame.", "Vaikai nori pažaisti ant laipiojimo karkaso."]] },
    { id: "clothes", en: "clothes shop", n: "drabužių parduotuvė", a: "drabužių parduotuvę", g: "drabužių parduotuvės", need: [["I need a new jacket for the winter.", "Man reikia naujos striukės žiemai."], ["I want to try on some jeans and T-shirts.", "Noriu pasimatuoti džinsų ir marškinėlių."]] },
    { id: "castle", en: "castle", n: "pilis", a: "pilį", g: "pilies", need: [["I want to see where the king and queen lived.", "Noriu pamatyti, kur gyveno karalius ir karalienė."], ["Tourists love its old stone walls and towers.", "Turistai dievina jos senas akmenines sienas ir bokštus."]] }
  ],
  /* ---------- užsakymų šablonai ---------- */
  frames: [
    ["Take me to {D}, please.", "Prašau nuvežti mane į {D}."],
    ["I need to get to {D}.", "Man reikia nuvykti į {D}."],
    ["Could you drive me to {D}?", "Ar galėtumėte nuvežti mane į {D}?"],
    ["Let's go to {D}.", "Važiuojame į {D}."],
    ["I'd like to go to {D}, please.", "Norėčiau nuvažiuoti į {D}."],
    ["Can you take me to {D}?", "Ar galite nuvežti mane į {D}?"]
  ],
  needTail: ["Take me there, please.", "Prašau nuvežti mane ten."],
  house: ["house", "namą"],
  desc: {
    place: ["the {P}", "{Pa}"],
    next: ["the house next to the {P}", "namą šalia {Pg}"],
    nextc: ["the {C} house next to the {P}", "{Ca} namą šalia {Pg}"],
    opp: ["the house opposite the {P}", "namą priešais {Pa}"],
    between: ["the house between the {P} and the {Q}", "namą tarp {Pg} ir {Qg}"],
    behind: ["the house behind the {P}", "namą už {Pg}"],
    corner: ["the {C} house on the corner of {S} and {A}", "{Ca} namą „{S}“ ir „{A}“ gatvių kampe"],
    stretch: ["the {C} house in {S}, between {A} and {B}", "{Ca} namą „{S}“ gatvėje, tarp „{A}“ ir „{B}“ gatvių"],
    notcol: ["the house next to the {P} – not the {C} one, the other one", "namą šalia {Pg} – ne {Ca}, o kitą"]
  },
  multi: {
    m1: ["First, take me to {X}. Then drive to {Y}.", "Pirmiausia nuvežkite mane į {X}. Tada važiuokite į {Y}."],
    m2: ["Take me to {Y}, but first stop at {X}.", "Nuvežkite mane į {Y}, bet pirma užsukime į {X}."],
    m3: ["Before we go to {Y}, I need to stop at {X}.", "Prieš važiuojant į {Y}, man reikia užsukti į {X}."],
    m4: ["Let's go to {X}. After that, I need to get to {Y}.", "Važiuojame į {X}. Po to man reikia į {Y}."],
    m5: ["We'll go to {Y} after we visit {X}.", "Į {Y} važiuosime po to, kai aplankysime {X}."]
  },
  ord: [["first", "pirmą", "pirmas"], ["second", "antrą", "antras"], ["third", "trečią", "trečias"]],
  lr: { L: ["left", "kairę", "kairėje"], R: ["right", "dešinę", "dešinėje"] },
  then: [["Then ", "Tada "], ["After that, ", "Po to "]],
  route: {
    go: ["Go straight on.", "Važiuokite tiesiai."],
    bridge: ["Go over the bridge.", "Pervažiuokite tiltą."],
    past: ["Go past the {P}.", "Pravažiuokite pro {Pa}."],
    turnN: ["Take the {N} turning on the {LR}.", "Sukite į {Na} posūkį {LRk}."],
    lights: ["Turn {LR} at the traffic lights.", "Prie šviesoforo sukite į {LRa}."],
    end: ["Go to the end of the road and turn {LR}.", "Važiuokite iki kelio galo ir sukite į {LRa}."],
    into: ["Turn {LR} into {S}.", "Sukite į {LRa}, į „{S}“ gatvę."],
    nth: ["It's the {N} building on your {LR}.", "Tai {Nn} pastatas jūsų {LRk}."],
    next: ["It's on your {LR}, next to the {P}.", "Namas bus jūsų {LRk}, šalia {Pg}."],
    opp: ["It's on your {LR}, opposite the {P}.", "Namas bus jūsų {LRk}, priešais {Pa}."]
  },
  /* trumpi paaiškinimai po kelionės ir po klaidos */
  notes: {
    place: "the + vietos pavadinimas: „the {P}“ – {Pn}.",
    need: "Keleivis nepasakė vietos pavadinimo – ją reikia suprasti iš sakinio. Ten, kur tai daroma, yra „the {P}“ – {Pn}.",
    next: "next to – šalia (tame pačiame šaligatvyje, iškart greta).",
    nextc: "next to – šalia. Spalva sakoma prieš daiktavardį: the {C} house.",
    opp: "opposite – priešais (kitoje tos pačios gatvės pusėje, tiesiai prieš).",
    between: "between … and … – tarp … ir … (namas stovi viduryje tarp dviejų pastatų).",
    behind: "behind – už (kitoje pastato pusėje; privažiuojama iš kitos gatvės).",
    corner: "on the corner of … and … – dviejų gatvių kampe (sankryžoje).",
    stretch: "in High Street – (kurioje gatvėje?) High Street gatvėje; between … and … čia reiškia gatvės atkarpą tarp dviejų skersinių gatvių.",
    notcol: "not the {C} one, the other one – ne {Ca}, o kitą. „one“ pakeičia žodį „house“.",
    turnN: "take the first / second / third turning on the left – suk į pirmą / antrą / trečią posūkį kairėje. Skaičiuojami tik posūkiai toje pusėje.",
    lights: "at the traffic lights – prie šviesoforo.",
    end: "go to the end of the road – važiuok iki kelio galo (kol kelias baigiasi).",
    into: "turn left into Mill Lane – suk į kairę, į Mill Lane gatvę. Pavadinimai užrašyti ant kelio.",
    bridge: "go over the bridge – pervažiuok tiltą. Posūkiai skaičiuojami jau už tilto.",
    past: "go past the … – pravažiuok pro … (nesustok).",
    nth: "the first / second / third building on your left – pirmas / antras / trečias pastatas tavo kairėje (skaičiuok nuo posūkio; sodeliai – ne pastatai).",
    lr: "on your left / on your right – kairėje / dešinėje žiūrint vairuotojo akimis, ta kryptimi, kuria važiuoji.",
    m1: "first … then … – pirmiausia … tada … (tvarka tokia, kaip pasakyta).",
    m2: "but first – bet pirma: antra pasakyta vieta lankoma PIRMIAU.",
    m3: "before we go to … – prieš važiuojant į …: pirmiausia važiuojama į antrąją pasakytą vietą.",
    m4: "after that – po to.",
    m5: "after we visit … – po to, kai aplankysime …: pirmiausia važiuojama į antrąją pasakytą vietą."
  },
  /* ---------- pasikalbėjimų knygelė ---------- */
  book: [
    { t: "Kaip keleivis prašo nuvežti", rows: [["Take me to the station, please.", "Prašau nuvežti mane į stotį."], ["I need to get to the bank.", "Man reikia nuvykti į banką."], ["Could you drive me to the hotel?", "Ar galėtumėte nuvežti mane į viešbutį?"], ["I'd like to go to the museum.", "Norėčiau nuvažiuoti į muziejų."], ["Stop here, please. / Here we are!", "Prašau sustoti čia. / Štai ir atvykome!"]], p: "Prieš vietos pavadinimą sakoma the: the library, the post office. Britai sako the chemist's (vaistinė), the dentist's, the hairdresser's – su 's, nes tai „vaistininko, odontologo, kirpėjo“ vieta." },
    { t: "Kur tai yra? Vietos prielinksniai", rows: [["next to the bakery", "šalia kepyklos"], ["opposite the school", "priešais mokyklą (kitoje gatvės pusėje)"], ["between the bank and the café", "tarp banko ir kavinės"], ["behind the church", "už bažnyčios"], ["on the corner of High Street and Mill Lane", "High Street ir Mill Lane gatvių kampe"], ["in London Road", "London Road gatvėje"]], p: "Spalva eina prieš daiktavardį: the red house. Kad nekartotų žodžio house, anglai sako one: not the red one, the other one – ne raudoną, o kitą." },
    { t: "Kelio nurodymai", rows: [["Go straight on.", "Važiuok (eik) tiesiai."], ["Turn left. / Turn right.", "Suk į kairę. / Suk į dešinę."], ["Take the second turning on the left.", "Suk į antrą posūkį kairėje."], ["Turn right at the traffic lights.", "Prie šviesoforo suk į dešinę."], ["Go to the end of the road.", "Važiuok iki kelio galo."], ["Go over the bridge.", "Pervažiuok (pereik) tiltą."], ["Go past the cinema.", "Pravažiuok (praeik) pro kino teatrą."], ["It's the third building on your right.", "Tai trečias pastatas tavo dešinėje."]], p: "Nurodymams vartojama liepiamoji nuosaka – veiksmažodis be to ir be įvardžio: Go, Turn, Take. Left ir right visada skaičiuojami vairuotojo akimis – ta kryptimi, kuria judi. Eilės skaitvardžiai: first, second, third." },
    { t: "Kas pirma, kas paskui", rows: [["First … Then …", "Pirmiausia … Tada …"], ["After that …", "Po to …"], ["… but first stop at the bank.", "… bet pirma užsukime į banką."], ["Before we go to the station, …", "Prieš važiuodami į stotį, …"], ["We'll go to the zoo after we visit the café.", "Į zoologijos sodą važiuosime po to, kai aplankysime kavinę."]], p: "Atsargiai su before, after ir but first: sakinyje pirmiau pasakyta vieta nebūtinai lankoma pirmiau." },
    { t: "Gatvės ir miestas", rows: [["street, road, lane, avenue", "gatvė, kelias, gatvelė, alėja (visi – gatvių pavadinimuose)"], ["crossroads", "sankryža"], ["traffic lights", "šviesoforas"], ["bridge / river", "tiltas / upė"], ["Pick up a passenger outside the bank.", "Paimkite keleivį prie banko."], ["red light / fine", "raudonas šviesoforo signalas / bauda"], ["turning", "posūkis (šoninė gatvė)"], ["building", "pastatas"]], p: "Tikroje Didžiojoje Britanijoje važiuojama kairiąja kelio puse. Rivertone, kad būtų įprasta, važiuojama dešine – kaip Lietuvoje." }
  ],
  bookPlaces: "Vietos mieste (Places in town)"
};
