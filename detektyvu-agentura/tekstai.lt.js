/* Detektyvų agentūra – visi mokiniui rodomi tekstai (lietuvių k.) ir anglų kalbos medžiaga.
   Verčiant į kitą kalbą (latvių, estų) reikia išversti tik lietuviškus tekstus; anglų k. užduotys (T.en) lieka tos pačios.
   Anglų kalbos medžiaga: veiksmų ir įvykių sąrašai, veiksmažodžiai, dedukcijos ir sąlygos sakinių užduotys. */
window.MK_T = {
  title: "Detektyvų agentūra",
  h1: "Detektyvų <em>agentūra</em>",
  hero: "Esi jaunasis detektyvas. Skaityk įkalčius angliškai, rink liudininkų parodymus ir gaudyk nusikaltėlius – kiekvienas atsakymas turi atitikti tai, kas iš tiesų įvyko.",
  note: "Medžiaga pagal Užsienio kalbos (pirmosios) bendrąją programą, 7–8 kl. (27.6.2). Rezultatai saugomi tik šiame įrenginyje.",
  points: "Taškai",
  next: "Toliau →",
  results: "Rezultatai",
  check: "Patikrinti",
  explain: "Paaiškinimas",
  okHead: (praise, pts) => `${praise} +${pts}`,
  retryHead: "Dar ne tas. Pažiūrėk į įkalčius dar kartą.",
  failHead: "Šįkart nepavyko – štai kaip tai atrodo:",
  correctIs: "Teisingas variantas:",
  resTitle: (ok, n) => `${ok} iš ${n} iš pirmo karto`,
  resText: (p, caught) => `${p} ${p % 10 === 1 && p % 100 !== 11 ? "taškas" : p % 10 >= 2 && (p % 100 < 10 || p % 100 > 20) ? "taškai" : "taškų"}.` + (caught ? ` Sugautas nusikaltėlis: ${caught}!` : ""),

  /* pasiruošimo užduočių antraštės */
  q: {
    pick: "Kuris sakinys atitinka įkalčius?",
    gap: "Įrašyk tinkamą formą.",
    pic: "Kuris paveikslas atitinka sakinį?",
    clue: "Įkalčiai",
    sit: "Situacija",
    time: "laikas",
    now: "dabar",
    ded: "Ką galima daryti išvadą iš įkalčių?",
    cond: "Kuris sakinys tiksliai atitinka situaciją?",
    caseFile: "Bylos lapas"
  },
  laneNow: "DABAR",
  nb: { when: "KADA?", now: "DABAR:", ended: "baigta", still: "tęsiasi iki dabar", result: "rezultatas matomas", noDate: "datos nėra" },

  /* lygiai */
  levels: [
    ["Kas vyko tuo metu?", "Past Simple ar Past Continuous"],
    ["Kas buvo anksčiau?", "Dar ir Past Perfect"],
    ["Bylos lapas", "Past Simple ar Present Perfect"],
    ["Dedukcija", "must, might, can't"],
    ["Jei… tai…", "Sąlygos sakiniai: 0, 1, 2, 3"],
    ["Didžioji byla", "Viskas kartu"]
  ],

  /* galerija ir laipsniai */
  galTitle: "Sugautų nusikaltėlių galerija",
  locked: "Dar laisvėje",
  caught: "SUGAUTAS",
  villains: ["Mr Ferret", "Lady Crow", "Baron Mole", "Miss Magpie", "Count Raven", "Dr Badger", "Madame Lynx", "Sir Weasel", "Colonel Heron", "Professor Moth", "Ms Gecko", "Captain Hare"],
  villainNeed: [5, 15, 30, 50, 75, 105, 140, 180, 225, 275, 330, 400],
  ranks: [[0, "Stažuotojas"], [1, "Žvalgas"], [3, "Seklys"], [5, "Inspektorius"], [8, "Vyriausiasis inspektorius"], [10, "Komisaras"], [12, "Detektyvų legenda"]],
  galText: (n, left, name, rank) => (left > 0
    ? `Tavo laipsnis: <b>${rank}</b>. Atsakymų iš pirmo karto: ${n}. Iki nusikaltėlio „${name}“ sugavimo liko ${left}.`
    : `Tavo laipsnis: <b>${rank}</b>. Atsakymų iš pirmo karto: ${n}. Visi nusikaltėliai sugauti – tu detektyvų legenda!`),

  /* paaiškinimai po atsakymo: santykių tipai (1–2 lygiai) */
  rel: {
    INT: { n: "Past Continuous + Past Simple", t: "Veiksmas jau <b>vyko</b>, kai įvyko trumpas įvykis. Vykstančiam veiksmui vartojame <b>was / were + -ing</b> (Past Continuous), trumpam įvykiui – Past Simple." },
    SEQ: { n: "Past Simple + Past Simple", t: "Įvykiai ėjo <b>vienas po kito</b>: pirma vienas, tada kitas. Abu veiksmai – Past Simple. Žodžiai <i>when</i> ir <i>as soon as</i> rodo: tai, kas po jų, įvyko pirmiau." },
    PERF: { n: "Past Perfect", t: "Veiksmas jau buvo <b>baigtas anksčiau</b> nei kitas praeities įvykis. Anksčiau įvykusiam veiksmui vartojame <b>had + 3 forma</b> (Past Perfect), vėlesniam – Past Simple." }
  },
  relWhy: {
    INT: (a, b) => `Paveiksle žalia juosta (<i>${a}</i>) driekiasi per pat oranžinę liniją (<i>${b}</i>): veiksmas dar vyko, kai įvyko įvykis.`,
    SEQ: (a, b) => `Paveiksle oranžinė linija (<i>${b}</i>) yra pirmiau, o žalia juosta (<i>${a}</i>) prasideda tik po jos.`,
    PERF: (a, b) => `Paveiksle žalia juosta (<i>${a}</i>) baigiasi dar prieš oranžinę liniją (<i>${b}</i>): veiksmas jau buvo baigtas.`
  },
  /* 3 lygis */
  ppWhy: {
    ps: { n: "Past Simple", t: "Kai nurodytas <b>baigtas praeities laikas</b> (yesterday, last night, at 9 p.m., two hours ago, in 2019, on Monday), vartojame <b>Past Simple</b>. Su tokiu laiku Present Perfect nevartojamas." },
    since: { n: "Present Perfect", t: "Kai veiksmas ar būsena <b>prasidėjo praeityje ir tęsiasi iki dabar</b> (<i>since</i> – nuo kada, <i>for</i> – kiek laiko), vartojame <b>has / have + 3 forma</b> (Present Perfect)." },
    sofar: { n: "Present Perfect", t: "Kai laikotarpis <b>dar nesibaigė</b> (<i>so far</i> – kol kas, iki šiol), vartojame <b>has / have + 3 forma</b> (Present Perfect): skaičiuojame, kiek jau įvyko." }
  },
  pp: {
    sinceWhen: s => `Laikas nurodytas žodžiu <i>${s}</i>: būsena dar tęsiasi.`,
    psWhen: s => `Nurodytas baigtas laikas: <i>${s}</i>.`
  },
  /* 4 lygis */
  dedWhy: {
    must: { n: "must", t: "<b>must</b> – esame beveik tikri (apie 100 %): įkalčiai aiškiai rodo, kad taip yra. Apie praeitį: <b>must have + 3 forma</b>." },
    cant: { n: "can't", t: "<b>can't</b> – esame beveik tikri, kad taip NĖRA (apie 0 %): įkalčiai tai paneigia. Apie praeitį: <b>can't have + 3 forma</b>." },
    might: { n: "might", t: "<b>might</b> – įkalčių nepakanka, galima ir taip, ir kitaip (apie 50 %). Apie praeitį: <b>might have + 3 forma</b>." }
  },
  meter: { cant: "can't", might: "might", must: "must" },
  /* 5 lygis */
  condWhy: {
    zero: { n: "Zero conditional", t: "<b>If + Present Simple, Present Simple</b> – visada teisinga taisyklė ar įprotis. Čia If beveik reiškia „kai“." },
    first: { n: "First conditional", t: "<b>If + Present Simple, will + veiksmažodis</b> – tikėtina ateitis. Po <i>if</i> niekada nevartojame <i>will</i>." },
    second: { n: "Second conditional", t: "<b>If + Past Simple, would + veiksmažodis</b> – menamas ar mažai tikėtinas dabartis (iš tikrųjų taip nėra). Su <i>be</i> dažniausiai sakoma <i>were</i>: <i>If I were you…</i>" },
    third: { n: "Third conditional", t: "<b>If + Past Perfect, would have + 3 forma</b> – kas galėjo nutikti praeityje, bet nenutiko. Praeities nebepakeisi." }
  },
  condKind: { zero: "Zero conditional", first: "First conditional", second: "Second conditional", third: "Third conditional" },

  /* „Noriu pasimokyti“ */
  learn: [
    { name: "Past Simple ar Past Continuous", level: 0,
      html: `<p>Kai vienas veiksmas <b>vyko</b>, o kitas jį <b>nutraukė</b>:</p><span class="mk-ex">Tom <b>was watching</b> TV when the phone <b>rang</b>.</span><p>Vykstantis veiksmas – <b>was / were + -ing</b>, trumpas įvykis – Past Simple.</p><p>Kai įvykiai ėjo vienas po kito, abu – Past Simple:</p><span class="mk-ex">When the phone <b>rang</b>, Tom <b>closed</b> the window.</span><p>Pirma suskambo telefonas, tada Tomas uždarė langą.</p>` },
    { name: "Past Perfect – kas buvo anksčiau", level: 1,
      html: `<p>Kai du praeities įvykiai, o vienas jų buvo <b>baigtas dar anksčiau</b>, anksčiau įvykusį veiksmą rašome su <b>had + 3 forma</b>:</p><span class="mk-ex">When the guard arrived, the thief <b>had</b> already <b>left</b>.</span><p>Pirma vagis išėjo, paskui atėjo sargybinis. Žodžiai <i>already</i>, <i>before</i>, <i>by the time</i> dažnai lydi Past Perfect.</p>` },
    { name: "Past Simple ar Present Perfect", level: 2,
      html: `<p><b>Past Simple</b> – kai aiškus baigtas laikas:</p><span class="mk-ex">The thief <b>stole</b> the diamond <u>last night</u>.</span><p><b>Present Perfect (has / have + 3 forma)</b> – kai laikas nebaigtas ar tęsiasi iki dabar:</p><span class="mk-ex">He <b>has lived</b> here <u>since</u> 2015.</span><span class="mk-ex">She <b>has found</b> two clues <u>so far</u>.</span><p>Su <i>yesterday, last night, in 2019, ago</i> Present Perfect nevartojamas.</p>` },
    { name: "Dedukcija: must, might, can't", level: 3,
      html: `<p>Kai spėjame pagal įkalčius, sakome, kiek esame tikri:</p><span class="mk-ex">The lights are on. He <b>must</b> be at home. <i>(beveik tikrai taip)</i></span><span class="mk-ex">He <b>might</b> be at home. <i>(galbūt)</i></span><span class="mk-ex">He <b>can't</b> be at home – he is in Paris. <i>(neįmanoma)</i></span><p>Apie praeitį: <i>must have taken, might have taken, can't have taken</i>.</p>` },
    { name: "Sąlygos sakiniai (0, 1, 2, 3)", level: 4,
      html: `<p><b>Zero:</b> If you heat ice, it melts. <i>(visada)</i></p><p><b>First:</b> If it rains, we will stay at home. <i>(tikėtina ateitis)</i></p><p><b>Second:</b> If I had a car, I would drive to work. <i>(menama dabartis)</i></p><p><b>Third:</b> If I had left earlier, I would have caught the bus. <i>(praeitis, kuri nebepasikeis)</i></p><p>Po <i>if</i> niekada nerašome <i>will</i> ar <i>would</i>.</p>` }
  ],

  /* ====================== ANGLŲ KALBOS MEDŽIAGA ====================== */
  en: {
    names: [
      ["Tom", "Tom"], ["Anna", "Anna"], ["Ben", "Ben"], ["Kate", "Kate"], ["Jack", "Jack"], ["Mia", "Mia"], ["Max", "Max"], ["Lily", "Lily"],
      ["Sam", "Sam"], ["Emma", "Emma"], ["The cook", "the cook"], ["The gardener", "the gardener"], ["The guard", "the guard"], ["The maid", "the maid"],
      ["The driver", "the driver"], ["The thief", "the thief"], ["The waiter", "the waiter"], ["The painter", "the painter"]
    ],
    /* veiksmai: [pagrindinė forma, -ing, Past Simple, 3 forma] */
    acts: [
      ["cook dinner", "cooking dinner", "cooked dinner", "cooked dinner"],
      ["write a letter", "writing a letter", "wrote a letter", "written a letter"],
      ["paint the fence", "painting the fence", "painted the fence", "painted the fence"],
      ["wash the car", "washing the car", "washed the car", "washed the car"],
      ["clean the kitchen", "cleaning the kitchen", "cleaned the kitchen", "cleaned the kitchen"],
      ["water the flowers", "watering the flowers", "watered the flowers", "watered the flowers"],
      ["bake a cake", "baking a cake", "baked a cake", "baked a cake"],
      ["feed the ducks", "feeding the ducks", "fed the ducks", "fed the ducks"],
      ["plant roses", "planting roses", "planted roses", "planted roses"],
      ["polish the silver", "polishing the silver", "polished the silver", "polished the silver"],
      ["repair a bike", "repairing a bike", "repaired a bike", "repaired a bike"],
      ["sweep the yard", "sweeping the yard", "swept the yard", "swept the yard"],
      ["draw a map", "drawing a map", "drew a map", "drawn a map"],
      ["knit a scarf", "knitting a scarf", "knitted a scarf", "knitted a scarf"],
      ["peel potatoes", "peeling potatoes", "peeled potatoes", "peeled potatoes"],
      ["study maths", "studying maths", "studied maths", "studied maths"],
      ["listen to the radio", "listening to the radio", "listened to the radio", "listened to the radio"],
      ["play chess", "playing chess", "played chess", "played chess"],
      ["watch TV", "watching TV", "watched TV", "watched TV"],
      ["do the crossword", "doing the crossword", "did the crossword", "done the crossword"],
      ["pack a suitcase", "packing a suitcase", "packed a suitcase", "packed a suitcase"],
      ["lock the gate", "locking the gate", "locked the gate", "locked the gate"],
      ["hide the key", "hiding the key", "hid the key", "hidden the key"],
      ["call the police", "calling the police", "called the police", "called the police"]
    ],
    /* trumpi įvykiai (Past Simple) */
    evs: [
      "the phone rang", "the lights went out", "the alarm went off", "the doorbell rang", "the clock struck nine", "a dog barked",
      "the music stopped", "it started to rain", "somebody shouted", "a car stopped outside", "the door slammed", "thunder rumbled",
      "the guard came in", "the police arrived", "the postman knocked", "the detective got there"
    ],
    /* 3 lygis: [pagrindinė, Past Simple, 3 forma, papildinys, rezultatas dabar] */
    verbs: [
      ["steal", "stole", "stolen", "the diamond", "The diamond is not in the case now."],
      ["break", "broke", "broken", "the window", "The window is broken now."],
      ["open", "opened", "opened", "the safe", "The safe is open now."],
      ["lose", "lost", "lost", "the key", "The key is missing now."],
      ["take", "took", "taken", "the painting", "The wall is empty now."],
      ["find", "found", "found", "a footprint", "The footprint is in the notebook."],
      ["write", "wrote", "written", "a note", "The note is on the table."],
      ["eat", "ate", "eaten", "the cake", "The plate is empty now."],
      ["drop", "dropped", "dropped", "the knife", "The knife is on the floor."],
      ["hide", "hid", "hidden", "the map", "Nobody can see the map now."],
      ["buy", "bought", "bought", "a ticket", "The ticket is in his pocket."],
      ["sell", "sold", "sold", "the car", "The garage is empty now."],
      ["forget", "forgot", "forgotten", "the password", "He can't open the file now."],
      ["catch", "caught", "caught", "the thief", "The thief is in a cell now."],
      ["send", "sent", "sent", "a letter", "The letter is on its way now."],
      ["paint", "painted", "painted", "the door", "The door is green now."],
      ["see", "saw", "seen", "the suspect", "The witness knows his face now."],
      ["leave", "left", "left", "the building", "The building is empty now."]
    ],
    pastTimes: ["yesterday evening", "last night", "at 9 p.m.", "two hours ago", "in 2019", "on Monday", "last week", "at midnight", "yesterday morning", "ten minutes ago", "on Friday afternoon", "three days ago"],
    /* būsenos: [pagrindinė, Past Simple, 3 forma, frazė] (has/have + 3 forma su since/for) */
    states: [
      ["live", "lived", "lived", "in the old house"],
      ["work", "worked", "worked", "at the museum"],
      ["know", "knew", "known", "the victim"],
      ["be", "was", "been", "missing"],
      ["have", "had", "had", "a green car"],
      ["wait", "waited", "waited", "outside the bank"],
      ["stay", "stayed", "stayed", "at the hotel"],
      ["study", "studied", "studied", "Spanish"]
    ],
    sinceTimes: ["since Monday", "for three days", "since 2015", "for ten years", "since January", "for two weeks", "since last summer", "for a long time"],
    /* [pagrindinė, Past Simple, 3 forma, daiktas] su so far + skaičius */
    counts: ["twice", "three times", "four times"],

    /* 4 lygis: [įkalčiai[], sakinys su ___, atsakymas, trumpas paaiškinimas lietuviškai] */
    ded: [
      [["The lights are on.", "Tom's car is outside."], "Tom ___ be at home.", "must", "Šviesa dega, o automobilis prie namų – beveik tikrai jis namie."],
      [["Anna's bag is on the desk.", "Her laptop is open."], "Anna ___ be in the office.", "must", "Daiktai ant stalo rodo, kad ji kažkur netoli, beveik tikrai biure."],
      [["The dog is barking at the door.", "Somebody is knocking."], "There ___ be someone outside.", "must", "Kažkas beldžia – beveik tikrai už durų kažkas yra."],
      [["The footprints are huge.", "Only Big Bob wears size 48 shoes."], "The thief ___ be Big Bob.", "must", "Tokią avalynę nešioja tik Bobas – išvada beveik tikra."],
      [["He hasn't slept for two days.", "He has worked all night."], "He ___ be very tired.", "must", "Dvi paras nemiegojęs žmogus beveik tikrai pavargęs."],
      [["The cake is gone.", "Only the cat was in the kitchen.", "There are crumbs on its nose."], "The cat ___ have eaten the cake.", "must", "Trupiniai ant nosies ir niekas kitas nebuvo virtuvėje – beveik tikrai ji."],
      [["The window is broken.", "There is a football in the room."], "The ball ___ have broken the window.", "must", "Kamuolys kambaryje ir sudužęs langas – labai tikėtina priežastis."],
      [["The ground is wet.", "The sky was full of dark clouds this morning."], "It ___ have rained.", "must", "Šlapia žemė ir tamsūs debesys – beveik tikrai lijo."],
      [["The safe is open.", "Only the manager knows the code.", "The manager was here at 8 p.m."], "The manager ___ have opened it.", "must", "Kodą žino tik vadovas, o jis buvo čia – beveik tikrai jis atrakino."],
      [["Mia has chocolate on her face and hands.", "The ice cream box is empty."], "Mia ___ have eaten the ice cream.", "must", "Šokoladas ant veido ir tuščia dėžutė – beveik tikrai ji suvalgė."],
      [["Sam is wearing a thick coat and a hat.", "He is shivering."], "Sam ___ be cold.", "must", "Dreba ir vilki storai – beveik tikrai šaltuka."],
      [["There are twelve students in the class.", "Eleven are here."], "One student ___ be absent.", "must", "12 − 11 = 1: vieno mokinio nėra, tai aišku."],
      [["The thief left muddy boots at the door.", "The only muddy path leads from the garden gate."], "The thief ___ have come through the garden.", "must", "Purvini batai ir vienintelis purvinas takas – beveik tikrai per sodą."],
      [["The candle is still smoking.", "It is still warm."], "Someone ___ have blown it out a minute ago.", "must", "Dar rūksta ir šilta – ją ką tik užpūtė."],
      [["Nobody saw Kate leave.", "Her bike is still here."], "Kate ___ be in the building.", "must", "Niekas nematė išeinant ir dviratis čia – beveik tikrai ji viduje."],
      [["The guard heard the alarm at 10 p.m.", "The painting was there at 9:55 and gone at 10:05."], "The thief ___ have taken it between 9:55 and 10:05.", "must", "Tarp tų dviejų laikų paveikslas dingo – kitaip ir negali būti."],

      [["Mr Green was in Paris on Monday.", "The robbery was in Vilnius on Monday."], "Mr Green ___ be the thief.", "cant", "Tą dieną jis buvo Paryžiuje – negalėjo vogti Vilniuje."],
      [["The door was locked from inside.", "All the windows are shut."], "The thief ___ have come in through the window.", "cant", "Langai uždaryti – pro juos įlįsti neįmanoma."],
      [["The suspect is only six years old.", "The safe weighs 100 kilos."], "He ___ have carried the safe.", "cant", "Šešiametis neįstengtų pakelti 100 kg."],
      [["The guard has been in hospital since Friday.", "The theft happened on Saturday."], "The guard ___ have stolen the necklace.", "cant", "Šeštadienį jis buvo ligoninėje – negalėjo vogti."],
      [["The footprints are size 38.", "The gardener's feet are size 46."], "The gardener ___ have left the footprints.", "cant", "Jo pėda gerokai didesnė – negalėjo būti jo pėdsakai."],
      [["The shop closes at 5 p.m.", "It is 8 p.m. now."], "The shop ___ be open.", "cant", "Parduotuvė jau uždaryta – atidaryta būti negali."],
      [["The painting was stolen at midnight.", "At midnight Jack was at home with his family."], "Jack ___ be the thief.", "cant", "Dvylikta valanda jis buvo namie su šeima – negali būti vagis."],
      [["The man says he is a doctor.", "He doesn't know what a stethoscope is."], "He ___ be a real doctor.", "cant", "Tikras gydytojas žinotų – todėl tikriausiai ne gydytojas."],
      [["The letter is in blue ink.", "The accountant never uses blue ink."], "The accountant ___ have written the letter.", "cant", "Jis niekada nenaudoja mėlyno rašalo – greičiausiai ne jis."],
      [["Emma was asleep at 3 a.m.", "Two witnesses saw her in bed."], "Emma ___ have broken the window at 3 a.m.", "cant", "Ji miegojo – negalėjo išdaužti lango."],
      [["The robber has been in prison since 2018.", "The crime took place in 2022."], "He ___ have done it.", "cant", "2022 m. jis jau sėdėjo kalėjime – negalėjo to padaryti."],
      [["The coach to Riga leaves at 7 a.m.", "The suspect was seen in Vilnius at 8 a.m."], "The suspect ___ have been on that coach.", "cant", "Aštuntą valandą buvo Vilniuje – autobusu išvykti negalėjo."],
      [["The cake is still whole.", "Nobody has touched the plate."], "Somebody ___ have eaten a piece.", "cant", "Pyragas sveikas – gabalo niekas nesuvalgė."],
      [["Lily is afraid of water.", "She never goes near the lake."], "Lily ___ be the swimming champion.", "cant", "Bijanti vandens – plaukimo čempione būti negali."],

      [["Two people have the key: Ann and Ben.", "The thief used a key."], "Ann ___ be the thief.", "might", "Raktą turi du žmonės – Ana galėjo būti vagis, bet galėjo ir Benas."],
      [["Somebody left a red scarf.", "Both Kate and Mia wear red scarves."], "The scarf ___ be Kate's.", "might", "Raudonus šalikus nešioja abi – galbūt Kates, galbūt Mijos."],
      [["The cat is not in the house.", "The garden gate is open."], "The cat ___ be in the street.", "might", "Vartai atviri, bet kačių niekas nematė – gal gatvėje, o gal ir ne."],
      [["The weather forecast says:", "50 % chance of rain tonight."], "It ___ rain tonight.", "might", "Tikimybė 50 % – gali lyti, gali ir nelyti."],
      [["Peter didn't come to school.", "He had a cold last week."], "He ___ be ill again.", "might", "Praeitą savaitę sirgo, bet tikros priežasties nežinome – galbūt."],
      [["The thief carried a big bag.", "We can't see what was inside."], "He ___ have taken the jewels.", "might", "Maišas didelis, bet turinio nematėme – galbūt papuošalai."],
      [["A tall man was near the bank.", "Tom, Ed and Ron are all tall."], "It ___ have been Ed.", "might", "Trys aukšti vyrai – tai galėjo būti Edas, bet ir kiti."],
      [["Lena's phone is off.", "She switches it off in the cinema or on a plane."], "Lena ___ be at the cinema.", "might", "Du galimi paaiškinimai – gal kine, o gal lėktuve."],
      [["There is a light in the attic.", "The family is away, but a neighbour has a spare key."], "The neighbour ___ be there.", "might", "Raktą turi kaimynas, bet kitų įrodymų nėra – galbūt jis."],
      [["The letter has no name on it.", "The handwriting is careful and neat."], "A teacher ___ have written it.", "might", "Tvarkingas raštas – galbūt mokytojas, bet ne tikrai."],
      [["The car is gone.", "Dad said he would go shopping or visit Grandma."], "Dad ___ have gone shopping.", "might", "Dvi galimybės – parduotuvė arba močiutė, tad galbūt."],
      [["The clock stopped at 6:15.", "Maybe the battery died. Maybe somebody stopped it."], "Somebody ___ have stopped it.", "might", "Du galimi paaiškinimai – gal kažkas sustabdė, gal baterija."],
      [["Two suspects, but only one alibi is proved: Rita's.", "Nobody knows where Dan was."], "Dan ___ have done it.", "might", "Danas neįrodė alibi – galbūt jis, bet įrodymų dar nėra."],
      [["A boy in a blue cap bought the knife.", "Twenty boys in this town have blue caps."], "The boy ___ be a student from our school.", "might", "Dvidešimt vaikinų su kepuraitėmis – galbūt iš mūsų mokyklos."],
      [["A coin is under the sofa.", "Nobody remembers who dropped it."], "Grandpa ___ have dropped it.", "might", "Niekas neprisimena – gal senelis, gal kas kitas."],
      [["There are three doors in the corridor.", "One of them leads to the cellar."], "The prisoner ___ be in the cellar.", "might", "Viena iš trijų durų veda į rūsį – galbūt jis ten."]
    ],

    /* 5 lygis: [tipas, situacija, teisingas, klaidingas, klaidingas] */
    cond: [
      ["zero", "Rule (always true): heat turns ice into water.", "If you heat ice, it melts.", "If you heated ice, it would melt.", "If you had heated ice, it would have melted."],
      ["zero", "Rule (always true): plants without light turn yellow.", "If a plant doesn't get light, it turns yellow.", "If a plant didn't get light, it would turn yellow.", "If a plant hadn't got light, it would have turned yellow."],
      ["zero", "Every time the alarm rings, the guards run to the main hall.", "If the alarm rings, the guards run to the main hall.", "If the alarm rang, the guards would run to the main hall.", "If the alarm had rung, the guards would have run to the main hall."],
      ["zero", "Habit: when Sam is nervous, he always bites his nails.", "If Sam is nervous, he bites his nails.", "If Sam were nervous, he would bite his nails.", "If Sam had been nervous, he would have bitten his nails."],
      ["zero", "Rule (always true): red and blue paint make purple.", "If you mix red and blue, you get purple.", "If you mixed red and blue, you would get purple.", "If you had mixed red and blue, you would have got purple."],
      ["zero", "Rule: every winter the lake freezes when it gets colder than zero.", "If the temperature falls below zero, the lake freezes.", "If the temperature fell below zero, the lake would freeze.", "If the temperature had fallen below zero, the lake would have frozen."],
      ["zero", "Rule: you can never enter the lab without a pass.", "If you don't have a pass, you can't enter the lab.", "If you won't have a pass, you can't enter the lab.", "If you hadn't had a pass, you couldn't have entered the lab."],
      ["zero", "Habit: Mum is always cross when we come home late.", "If we come home late, Mum is cross.", "If we came home late, Mum would be cross.", "If we had come home late, Mum would have been cross."],
      ["zero", "Rule (always true): metal gets bigger when it gets hot.", "If metal gets hot, it expands.", "If metal got hot, it would expand.", "If metal had got hot, it would have expanded."],
      ["zero", "Rule at the agency: when you press the green button, the door always opens.", "If you press the green button, the door opens.", "If you pressed the green button, the door would open.", "If you had pressed the green button, the door would have opened."],

      ["first", "Tomorrow the detective may visit the museum. It is a real possibility.", "If the detective visits the museum, he will find clues.", "If the detective will visit the museum, he finds clues.", "If the detective visited the museum, he would find clues."],
      ["first", "Dark clouds. Rain is likely this evening. We have a picnic plan.", "If it rains this evening, we will cancel the picnic.", "If it will rain this evening, we cancel the picnic.", "If it rained this evening, we would cancel the picnic."],
      ["first", "Tomorrow's test. Kate really can pass if she studies tonight.", "If Kate studies tonight, she will pass the test.", "If Kate studied tonight, she would pass the test.", "If Kate had studied tonight, she would have passed the test."],
      ["first", "Warning: the ice on the lake is thin. Somebody may walk on it.", "If you walk on the ice, you will fall in.", "If you will walk on the ice, you fall in.", "If you walked on the ice, you would fall in."],
      ["first", "The guard may forget to lock the gate tonight. Then the thief can get in.", "If the guard forgets to lock the gate, the thief will get in.", "If the guard forgot to lock the gate, the thief would get in.", "If the guard had forgotten to lock the gate, the thief would have got in."],
      ["first", "Next week's trip: tickets are available. Ben may buy them today.", "If Ben buys the tickets, we will go to the museum.", "If Ben bought the tickets, we would go to the museum.", "If Ben will buy the tickets, we go to the museum."],
      ["first", "Warning: don't touch the wire. It may be live.", "If you touch the wire, you will get a shock.", "If you touched the wire, you would get a shock.", "If you will touch the wire, you get a shock."],
      ["first", "Tomorrow Anna may see the thief in the street.", "If Anna sees the thief, she will call the police.", "If Anna saw the thief, she would call the police.", "If Anna had seen the thief, she would have called the police."],
      ["first", "The bus is late tonight. We may have to walk.", "If the bus doesn't come soon, we will walk.", "If the bus won't come soon, we walk.", "If the bus didn't come soon, we would walk."],
      ["first", "The cake is in the oven. It may burn if nobody checks it.", "If nobody takes the cake out, it will burn.", "If nobody took the cake out, it would burn.", "If nobody had taken the cake out, it would have burned."],

      ["second", "Fact: Tom isn't rich. He dreams about a yacht.", "If Tom were rich, he would buy a yacht.", "If Tom is rich, he will buy a yacht.", "If Tom had been rich, he would have bought a yacht."],
      ["second", "Fact: The detective doesn't have a car. He walks everywhere.", "If the detective had a car, he wouldn't walk everywhere.", "If the detective has a car, he won't walk everywhere.", "If the detective had had a car, he wouldn't have walked everywhere."],
      ["second", "Fact: I am not the director of the museum.", "If I were the director, I would open the museum on Mondays.", "If I am the director, I will open the museum on Mondays.", "If I had been the director, I would have opened the museum on Mondays."],
      ["second", "Fact: Mia can't fly, but she wishes she could.", "If Mia could fly, she would visit every country.", "If Mia can fly, she will visit every country.", "If Mia had been able to fly, she would have visited every country."],
      ["second", "Fact: There is no witness. The police don't know who did it.", "If there were a witness, the police would know who did it.", "If there is a witness, the police will know who did it.", "If there had been a witness, the police would have known who did it."],
      ["second", "Fact: We live in a small town without a cinema.", "If we lived in a big city, we would go to the cinema every week.", "If we live in a big city, we will go to the cinema every week.", "If we had lived in a big city, we would have gone to the cinema every week."],
      ["second", "Fact: Ben doesn't know the password, so he can't open the file.", "If Ben knew the password, he could open the file.", "If Ben would know the password, he could open the file.", "If Ben had known the password, he could have opened the file."],
      ["second", "Fact: The thief isn't clever. He always leaves fingerprints.", "If the thief were clever, he wouldn't leave fingerprints.", "If the thief is clever, he won't leave fingerprints.", "If the thief had been clever, he wouldn't have left fingerprints."],
      ["second", "Fact: It is July and very hot. It isn't snowing.", "If it snowed in July, everybody would be surprised.", "If it snows in July, everybody will be surprised.", "If it had snowed in July, everybody would have been surprised."],
      ["second", "Fact: Lily doesn't have time. She works every day.", "If Lily had more time, she would learn to play the piano.", "If Lily has more time, she will learn to play the piano.", "If Lily had had more time, she would have learned to play the piano."],

      ["third", "Fact: Nobody locked the door last night. The thief walked in.", "If somebody had locked the door, the thief wouldn't have walked in.", "If somebody locked the door, the thief wouldn't walk in.", "If somebody locks the door, the thief won't walk in."],
      ["third", "Fact: Tom got up late yesterday, so he missed the bus.", "If Tom hadn't got up late, he wouldn't have missed the bus.", "If Tom didn't get up late, he wouldn't miss the bus.", "If Tom doesn't get up late, he won't miss the bus."],
      ["third", "Fact: The guard fell asleep last night, so the painting was stolen.", "If the guard hadn't fallen asleep, the painting wouldn't have been stolen.", "If the guard didn't fall asleep, the painting wouldn't be stolen.", "If the guard doesn't fall asleep, the painting won't be stolen."],
      ["third", "Fact: It rained all day on Sunday, so we didn't have the picnic.", "If it hadn't rained, we would have had the picnic.", "If it didn't rain, we would have the picnic.", "If it doesn't rain, we will have the picnic."],
      ["third", "Fact: Anna didn't study, so she failed the exam last week.", "If Anna had studied, she would have passed the exam.", "If Anna studied, she would pass the exam.", "If Anna studies, she will pass the exam."],
      ["third", "Fact: The detective found a footprint, and then he caught the thief.", "If the detective hadn't found the footprint, he wouldn't have caught the thief.", "If the detective didn't find the footprint, he wouldn't catch the thief.", "If the detective doesn't find the footprint, he won't catch the thief."],
      ["third", "Fact: Ben wore gloves on Tuesday night, so the police found no fingerprints.", "If Ben hadn't worn gloves, the police would have found fingerprints.", "If Ben didn't wear gloves, the police would find fingerprints.", "If Ben doesn't wear gloves, the police will find fingerprints."],
      ["third", "Fact: We didn't take umbrellas yesterday, so we got wet.", "If we had taken umbrellas, we wouldn't have got wet.", "If we took umbrellas, we wouldn't get wet.", "If we take umbrellas, we won't get wet."],
      ["third", "Fact: The cook left the oven on, and the kitchen filled with smoke last night.", "If the cook had turned the oven off, the kitchen wouldn't have filled with smoke.", "If the cook turned the oven off, the kitchen wouldn't fill with smoke.", "If the cook turns the oven off, the kitchen won't fill with smoke."],
      ["third", "Fact: Mia didn't see the sign, so she took the wrong road yesterday.", "If Mia had seen the sign, she wouldn't have taken the wrong road.", "If Mia saw the sign, she wouldn't take the wrong road.", "If Mia sees the sign, she won't take the wrong road."]
    ]
  }
};
