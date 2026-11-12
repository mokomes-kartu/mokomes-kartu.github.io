/* Raidžių gyvatėlė – visi mokiniui rodomi tekstai (lietuvių k.) ir žodžių sąrašai (anglų žodis + lietuviškas vertimas).
   Verčiant į kitą kalbą kopijuoti šį failą, keisti tekstus ir vertimus (antras eilutės elementas). */
(function(){
"use strict";
const many = (n, one, few, lots) => { const d = n % 10, h = n % 100; return d === 1 && h !== 11 ? one : d >= 2 && d <= 9 && (h < 10 || h >= 20) ? few : lots; };
/* [anglų žodis, vertimas, (nebūtina) patarimas, kaip įsiminti rašybą] */
const L = [
  { id: "gyvunai", art: "paw", name: "Gyvūnai", sub: "Paukščiai, žvėrys ir ūkio gyvūnai", words: [
    ["bird", "paukštis"], ["duck", "antis"], ["frog", "varlė"], ["fish", "žuvis"], ["horse", "arklys", "Žodyje horse paskutinė e netariama."],
    ["mouse", "pelė", "Garsas [aus] čia rašomas „ou“."], ["sheep", "avis", "Sheep: po sh – dvi e."], ["snake", "gyvatė"], ["tiger", "tigras"], ["spider", "voras"],
    ["rabbit", "triušis", "Rabbit: dvi b."], ["monkey", "beždžionė", "Monkey baigiasi -ey."], ["parrot", "papūga", "Parrot: dvi r."], ["turtle", "vėžlys"],
    ["giraffe", "žirafa", "Giraffe: dvi f."], ["elephant", "dramblys", "Elephant: garsas [f] čia rašomas „ph“."] ] },
  { id: "maistas", art: "apple", name: "Maistas ir gėrimai", sub: "Ką valgome ir geriame", words: [
    ["soup", "sriuba", "Soup: garsas [u:] rašomas „ou“."], ["milk", "pienas"], ["bread", "duona", "Bread: garsas [e] rašomas „ea“."], ["cake", "pyragas"], ["apple", "obuolys", "Apple: dvi p."],
    ["juice", "sula", "Juice: garsas [u:] rašomas „ui“."], ["water", "vanduo"], ["cheese", "sūris", "Cheese: po ch – dvi e."], ["banana", "bananas", "Banana: trys a ir dvi n."],
    ["carrot", "morka", "Carrot: dvi r."], ["orange", "apelsinas"], ["tomato", "pomidoras"], ["potato", "bulvė"], ["chicken", "vištiena", "Chicken: garsas [č] čia rašomas „ch“, o [k] – „ck“."],
    ["sandwich", "sumuštinis", "Sandwich: d netariama, o gale – „wich“."], ["breakfast", "pusryčiai", "Breakfast = break + fast, bet skaitoma [brekfast]."] ] },
  { id: "gamta", art: "leaf", name: "Gamta ir metų laikai", sub: "Oras, augalai ir metų laikai", words: [
    ["snow", "sniegas"], ["rain", "lietus", "Rain: garsas [ei] rašomas „ai“."], ["wind", "vėjas"], ["cloud", "debesis", "Cloud: garsas [au] rašomas „ou“."], ["river", "upė"], ["grass", "žolė", "Grass: dvi s."],
    ["flower", "gėlė", "Flower = flow + er."], ["forest", "miškas"], ["spring", "pavasaris"], ["summer", "vasara", "Summer: dvi m."], ["autumn", "ruduo", "Autumn: paskutinė n netariama."],
    ["winter", "žiema"], ["weather", "oras", "Weather: garsas [e] rašomas „ea“."], ["rainbow", "vaivorykštė", "Rainbow = rain + bow."], ["mountain", "kalnas", "Mountain: garsas [au] rašomas „ou“."],
    ["island", "sala", "Island: s netariama."] ] },
  { id: "miestas", art: "bus", name: "Miestas ir transportas", sub: "Vietos mieste, keliai ir transportas", words: [
    ["bike", "dviratis"], ["taxi", "taksi"], ["boat", "valtis", "Boat: garsas [ou] rašomas „oa“."], ["road", "kelias", "Road: garsas [ou] rašomas „oa“."], ["shop", "parduotuvė"], ["park", "parkas"],
    ["train", "traukinys", "Train: garsas [ei] rašomas „ai“."], ["plane", "lėktuvas"], ["street", "gatvė", "Street: dvi e."], ["bridge", "tiltas", "Bridge: garsas [dž] rašomas „dge“."],
    ["market", "turgus"], ["station", "stotis", "Station: garsas [šn] rašomas „-tion“."], ["library", "biblioteka", "Library rašomas su r po b (ne „liberty“)."],
    ["hospital", "ligoninė"], ["airport", "oro uostas", "Airport = air + port."], ["cinema", "kino teatras"] ] },
  { id: "sportas", art: "ball", name: "Kūnas ir sportas", sub: "Kūno dalys ir sporto šakos", words: [
    ["head", "galva", "Head: garsas [e] rašomas „ea“."], ["hand", "ranka"], ["nose", "nosis"], ["foot", "pėda", "Foot: dvi o."], ["knee", "kelis", "Knee: k netariama, gale – dvi e."],
    ["mouth", "burna", "Mouth: garsas [au] rašomas „ou“."], ["finger", "pirštas"], ["shoulder", "petys", "Shoulder: po sh – „oul“, tada d; garsas [ou] rašomas „ou“."], ["stomach", "pilvas", "Stomach: „ch“ čia skaitoma [k]."],
    ["swim", "plaukti"], ["jump", "šokti"], ["ball", "kamuolys", "Ball: dvi l."], ["skate", "čiuožti"], ["tennis", "tenisas", "Tennis: dvi n."], ["football", "futbolas", "Football = foot + ball."], ["running", "bėgimas", "Running: dvi n."] ] },
  { id: "mokykla", art: "book", name: "Mokykla", sub: "Mokomieji dalykai ir reikmenys", words: [
    ["book", "knyga", "Book: dvi o."], ["desk", "suolas"], ["chair", "kėdė", "Chair: garsas [ea] rašomas „air“."], ["board", "lenta"], ["class", "klasė", "Class: dvi s."], ["ruler", "liniuotė"],
    ["pencil", "pieštukas"], ["eraser", "trintukas"], ["lesson", "pamoka", "Lesson: dvi s."], ["school", "mokykla", "School: „ch“ čia skaitoma [k], o gale – dvi o."], ["friend", "draugas", "Friend: ie, o ne ei."],
    ["teacher", "mokytojas", "Teacher: garsas [i:] rašomas „ea“."], ["music", "muzika"], ["history", "istorija"], ["science", "gamtos mokslai", "Science: garsas [s] čia rašomas „sc“."], ["homework", "namų darbai", "Homework = home + work."] ] },
  { id: "namai", art: "house", name: "Namai ir šeima", sub: "Kambariai, baldai ir šeimos nariai", words: [
    ["lamp", "lempa"], ["sofa", "sofa"], ["room", "kambarys", "Room: dvi o."], ["house", "namas", "House: garsas [au] rašomas „ou“."], ["table", "stalas"], ["sister", "sesuo"],
    ["mother", "mama", "Mother: raidė o, nors skaitoma [a]."], ["father", "tėtis"], ["brother", "brolis", "Brother: raidė o, nors skaitoma [a]."], ["window", "langas"], ["kitchen", "virtuvė", "Kitchen: garsas [č] rašomas „tch“."],
    ["garden", "sodas"], ["family", "šeima"], ["bedroom", "miegamasis", "Bedroom = bed + room."], ["bathroom", "vonios kambarys", "Bathroom = bath + room."], ["grandma", "močiutė"] ] },
  { id: "profesijos", art: "helmet", name: "Profesijos", sub: "Kuo dirba žmonės (sunkesni žodžiai)", words: [
    ["nurse", "slaugytoja"], ["baker", "kepėjas"], ["pilot", "lakūnas"], ["doctor", "gydytojas"], ["farmer", "ūkininkas"], ["driver", "vairuotojas"], ["singer", "dainininkas"], ["artist", "dailininkas"],
    ["waiter", "padavėjas", "Waiter: garsas [ei] rašomas „ai“."], ["dentist", "dantistas"], ["builder", "statybininkas", "Builder: garsas [i] rašomas „ui“."], ["soldier", "kareivis", "Soldier: d prieš i, skaitoma [soldžer]."],
    ["mechanic", "mechanikas", "Mechanic: „ch“ čia skaitoma [k]."], ["scientist", "mokslininkas", "Scientist: garsas [s] čia rašomas „sc“."], ["engineer", "inžinierius", "Engineer baigiasi -eer."],
    ["policeman", "policininkas"] ] }
];
window.MK_T = {
  title: "Raidžių gyvatėlė",
  heroTitle: "Raidžių <em>gyvatėlė</em>",
  hero: "Perskaityk lietuvišką žodį ir gyvatėle suvalgyk angliško žodžio raides iš eilės. Niekas nesiskuba – gyvatėlė juda tik tada, kai tu ją pastumi.",
  heroLabel: "Žaidimo laukas: žalia gyvatėlė renka raides žodžiui „cat“.",
  note: "Valdymas: bakstelėk raidę – gyvatėlė pati nueis iki jos. Arba stumk ją po vieną langelį rodyklėmis, braukimu ar klaviatūros klavišais (rodyklės arba W, A, S, D). Rezultatai saugomi tik šiame įrenginyje.",
  levels: L.map(l => ({ id: l.id, art: l.art, name: l.name, sub: l.sub })),
  champion: { id: "cempionas", art: "cup", name: "Raidžių čempionas", sub: "Ilgesni žodžiai iš visų temų" },
  words: L.map(l => l.words.map(w => ({ w: w[0], t: w[1], n: w[2] || "" }))),
  best: n => `Žvaigždučių: ${n} iš 3`,

  /* ---------- žaidimo eiga ---------- */
  clueLabel: "Parašyk angliškai",
  speak: "Išgirsti žodį angliškai",
  slotsLabel: (got, total, word) => `Surinkta ${got} iš ${total} raidžių`,
  wordOf: (i, n) => `Žodis ${i} iš ${n}`,
  livesLabel: n => `Gyvybių liko: ${n}`,
  boardLabel: "Žaidimo laukas: gyvatėlė ir raidžių lentelės",
  dpad: { up: "Aukštyn", down: "Žemyn", left: "Kairėn", right: "Dešinėn" },
  keysHint: "Rodyklės arba W, A, S, D – vienas langelis. Bakstelėjus raidę, gyvatėlė nueina iki jos.",
  bumpWall: "Čia siena – pasirink kitą kryptį.",
  bumpSelf: "Čia gyvatėlės kūnas – pasirink kitą kryptį.",
  blocked: "Kelią užstoja kita raidė – apeik ją rodyklėmis.",
  shrank: "Gyvatėlė užsisukusi – jos uodega sutrumpėjo, kad galėtų judėti.",
  startHead: "Sudėk žodžius",
  startBody: "Kiekvienam lietuviškam žodžiui suvalgyk angliško žodžio raides tokia eile, kaip jos rašomos. Suvalgius netinkamą raidę prarandama gyvybė, bet pelėdžiukas visada paaiškina.",
  go: "Pradėti",
  hintBtn: "Parodyti kitą raidę (žodis nebus laikomas išmoktu)",
  hintNote: "Kita raidė sužibo. Šis žodis neįskaitomas į „Mano žodyną“.",
  okLetter: (l) => `✓ ${l}`,
  wordDone: (w, t) => `✓ ${w} – ${t}`,
  wrongHead: (need, got) => `Reikėjo raidės „${need}“, o ne „${got}“`,
  wrongBody: t => `Žodis „${t}“ angliškai rašomas taip:`,
  wrongTipSum: "Kaip įsiminti?",
  wrongTipDefault: "Pabandyk žodį perskaityti garsiai po raidę ir dar kartą pažiūrėk, kaip jis užrašytas viršuje.",
  next: "Toliau →",
  results: "Rezultatai",
  winTitle: "Visi žodžiai sudėti!",
  loseTitle: "Gyvybės baigėsi",
  resWords: (n, t) => `Sudėta žodžių: ${n} iš ${t}.`,
  resLearned: n => `Išmokta be klaidų ir užuominų: ${n}.`,
  resMissed: "Šiuos žodžius dar pakartok:",
  resClean: "Visi žodžiai be klaidų!",
  resNewSkin: name => `Atrakinta nauja gyvatėlė: ${name}!`,

  /* ---------- Mano žodynas ir gyvatėlių kolekcija ---------- */
  dictHead: "Mano žodynas",
  dictP: "Žodis patenka į žodyną, kai jį sudedi iš pirmo karto – be klaidų ir be užuominos.",
  dictCount: (n, t) => `Išmokta žodžių: ${n} iš ${t}`,
  dictOpen: "Parodyti išmoktus žodžius",
  dictEmpty: "Kol kas čia tuščia – sudėk pirmus žodžius!",
  levelCount: (n, t) => `${n} iš ${t} žodžių išmokta`,
  collHead: "Gyvatėlių kolekcija",
  collP: "Kuo daugiau žodžių išmoksti, tuo daugiau gyvatėlių atrakini. Pasirink, kuri šliauš tavo žaidime.",
  skins: [{ name: "Žaliukė" }, { name: "Saulutė" }, { name: "Bangelė" }, { name: "Avietė" }, { name: "Karūnėlė" }],
  skinNeed: n => `${n} ${many(n, "žodis", "žodžiai", "žodžių")}`,
  skinLocked: n => `Atrakinsi išmokęs ${n} ${many(n, "žodį", "žodžius", "žodžių")}`,
  skinPick: name => `Pasirinkti gyvatėlę: ${name}`,
  skinSel: "Pasirinkta",

  /* ---------- „Noriu pasimokyti“ ---------- */
  learnTips: {
    head: "Rašybos patarimai",
    html: `<p>Anglų kalboje raidės ir garsai ne visada sutampa, todėl žodžius verta įsiminti žiūrint, kaip jie užrašyti.</p>
      <ul><li>Skaitykite žodį garsiai <b>po raidę</b>: c – a – t, o paskui visą.</li>
      <li>Ieškok <b>žodžio dalių</b>: <i>rainbow = rain + bow</i>, <i>football = foot + ball</i>, <i>homework = home + work</i>.</li>
      <li>Atsimink <b>garsų poras</b>: ou (<i>cloud, mouse</i>), ea (<i>bread, head</i>), ai (<i>rain, train</i>), ch (<i>chair, cheese</i>), sh (<i>sheep</i>).</li>
      <li>Kai kurios raidės <b>netariamos</b>: <i>knee, island, autumn</i>.</li>
      <li>Dvigubos raidės: <i>apple, rabbit, carrot, tennis</i>.</li></ul>
      <span class="mk-ex">Paprašyti pasakyti paraidžiui galima taip: <b>Can you spell your name?</b></span>`
  },
  learnWords: (name, list) => `<p>Šios temos žodžiai ir jų vertimas:</p><ul>${list.map(w => `<li><b>${w.w}</b> – ${w.t}${w.n ? `<br><small>${w.n}</small>` : ""}</li>`).join("")}</ul>`
};
})();
