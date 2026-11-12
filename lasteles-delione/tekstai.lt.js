/* Ląstelės dėlionė – visi mokiniui rodomi tekstai (lietuvių k.).
   Verčiant į kitą kalbą užtenka nukopijuoti šį failą ir išversti reikšmes; žaidimo kodo keisti nereikia.
   Ląstelės struktūrų raktai: nuc – branduolys, mem – plazminė membrana, wall – sienelė, cyto – citozolis, chl – chloroplastas, vac – centrinė vakuolė, mit – mitochondrija. */
window.MK_T = {
  title: "Ląstelės dėlionė",
  h1: "Ląstelės <em>dėlionė</em>",
  hero: "Sudėk augalinę ir gyvūninę ląstelę, sužinok, ką veikia kiekviena jos struktūra, ir surask klaidas piešiniuose.",
  note: "Piešiniai supaprastinti: tikrose ląstelėse yra ir daugiau struktūrų. Rezultatai saugomi tik šiame įrenginyje.",
  points: "Taškai",
  next: "Toliau →",
  results: "Rezultatai",
  nextCell: "Kita ląstelė →",
  wrong: "Neteisingai.",
  explain: "Paaiškinimas",
  resTitle: (ok, n) => `${ok} iš ${n}`,
  resText: p => `${p} ${p % 10 === 1 && p % 100 !== 11 ? "taškas" : p % 10 >= 2 && (p % 100 < 10 || p % 100 > 20) ? "taškai" : "taškų"}.`,
  cellName: { p: "Augalinė ląstelė", a: "Gyvūninė ląstelė" },
  cellAlt: { p: "Augalinės ląstelės piešinys", a: "Gyvūninės ląstelės piešinys" },

  levels: [
    ["Augalinė ar gyvūninė?", "Atpažink ląstelę iš požymių"],
    ["Sudėk ląstelę", "Kiekvieną struktūrą – į savo vietą"],
    ["Kas ką daro?", "Ląstelės struktūrų funkcijos"],
    ["Rask klaidą", "Kas piešinyje negerai?"]
  ],

  /* vardininkas, galininkas („rodo į ...“), kaip atrodo piešinyje, ką daro */
  parts: {
    nuc:  { n: "Branduolys",        acc: "branduolį",         where: "didelis apvalus violetinis kūnelis",
            info: "Branduolys – paveldimos informacijos saugojimo vieta." },
    mem:  { n: "Plazminė membrana", acc: "plazminę membraną", where: "plonas oranžinis sluoksnis, gaubiantis ląstelės vidų",
            info: "Plazminė membrana atlieka medžiagų pernašą: per ją medžiagos patenka į ląstelę ir pasišalina iš jos." },
    wall: { n: "Ląstelės sienelė",  acc: "ląstelės sienelę",  where: "storas žalias išorinis sluoksnis",
            info: "Ląstelės sienelė atlieka apsauginę funkciją. Ji būdinga augalų ląstelėms, gyvūninė ląstelė sienelės neturi." },
    cyto: { n: "Citozolis",         acc: "citozolį",          where: "jis užpildo visą tarpą tarp kitų struktūrų",
            info: "Citozolis – ląstelės užpildas: jame yra kitos ląstelės struktūros." },
    chl:  { n: "Chloroplastas",     acc: "chloroplastą",      where: "žalias ovalus kūnelis",
            info: "Chloroplastuose vyksta fotosintezė. Jų turi augalų ląstelės, o gyvūnų ląstelės neturi." },
    vac:  { n: "Centrinė vakuolė",  acc: "centrinę vakuolę",  where: "didelė šviesiai mėlyna ertmė ląstelės viduryje",
            info: "Centrinėje vakuolėje kaupiamos ląstelinės sultys. Ji būdinga augalų ląstelėms." },
    mit:  { n: "Mitochondrija",     acc: "mitochondriją",     where: "mažas pailgas oranžinis kūnelis",
            info: "Mitochondrijose vyksta ląstelinis kvėpavimas." }
  },

  /* ---------- 1 lygis ---------- */
  l1: {
    askDraw: "Kokia tai ląstelė?",
    askFeat: "Kuriai ląstelei tinka šis požymis?",
    opts: { p: "Augalinė", a: "Gyvūninė", b: "Abi" },
    right: { p: "Teisingas atsakymas – <b>augalinė</b>.", a: "Teisingas atsakymas – <b>gyvūninė</b>.", b: "Teisingas atsakymas – <b>abi</b>." },
    draw: {
      p: "Tai augalinė ląstelė: ji kampuota, turi storą ląstelės sienelę, žalių chloroplastų ir didelę centrinę vakuolę.",
      a: "Tai gyvūninė ląstelė: ji apvalesnė, ją gaubia tik plazminė membrana – nėra nei sienelės, nei chloroplastų, nei didelės centrinės vakuolės."
    },
    /* a: p – augalinė, a – gyvūninė, b – abi */
    feats: [
      { t: "Turi chloroplastų",                      a: "p", ex: "Chloroplastų turi augalų ląstelės – juose vyksta fotosintezė. Gyvūnų ląstelės chloroplastų neturi." },
      { t: "Turi ląstelės sienelę",                  a: "p", ex: "Ląstelės sienelę turi augalinė ląstelė. Gyvūninę ląstelę gaubia tik plazminė membrana." },
      { t: "Turi didelę centrinę vakuolę",           a: "p", ex: "Didelė centrinė vakuolė būdinga augalų ląstelėms: joje kaupiamos ląstelinės sultys." },
      { t: "Joje vyksta fotosintezė",                a: "p", ex: "Fotosintezė vyksta chloroplastuose, o jų turi tik augalų ląstelės." },
      { t: "Sienelė atlieka apsauginę funkciją",       a: "p", ex: "Sienelė atlieka apsauginę funkciją. Gyvūninė ląstelė sienelės neturi." },
      { t: "Iš tokių ląstelių sudarytas medžio lapas", a: "p", ex: "Medis – augalas, todėl jo lapai sudaryti iš augalinių ląstelių." },
      { t: "Turi branduolį",                         a: "b", ex: "Branduolį turi ir augalinė, ir gyvūninė ląstelė – jame saugoma paveldima informacija." },
      { t: "Turi plazminę membraną",                 a: "b", ex: "Plazminę membraną turi abi ląstelės. Augalinėje ląstelėje ji yra po sienele." },
      { t: "Turi citozolį",                        a: "b", ex: "Citozolis užpildo ir augalinę, ir gyvūninę ląstelę – jame yra kitos struktūros." },
      { t: "Turi mitochondrijų",                     a: "b", ex: "Mitochondrijų turi abi ląstelės – jose vyksta ląstelinis kvėpavimas." },
      { t: "Joje vyksta ląstelinis kvėpavimas",        a: "b", ex: "Ląstelinis kvėpavimas vyksta mitochondrijose, o jų turi ir augalų, ir gyvūnų ląstelės." },
      { t: "Neturi ląstelės sienelės – ją gaubia tik plazminė membrana", a: "a", ex: "Gyvūninė ląstelė sienelės neturi. Augalinė ląstelė turi ir plazminę membraną, ir sienelę." },
      { t: "Iš tokių ląstelių sudarytas žmogaus kūnas", a: "a", ex: "Žmogaus, kaip ir gyvūnų, kūnas sudarytas iš gyvūninių ląstelių." },
      { t: "Iš tokių ląstelių sudaryti katės raumenys", a: "a", ex: "Katė – gyvūnas, todėl jos kūnas sudarytas iš gyvūninių ląstelių." }
    ]
  },

  /* ---------- 2 lygis ---------- */
  l2: {
    hint: "Tempk struktūrą į jos vietą piešinyje. Arba paspausk struktūrą, o tada – vietą.",
    tray: "Ląstelės struktūros",
    bin: "Šioje ląstelėje nėra",
    slot: "Laisva vieta",
    done: "Ląstelė sudėta!",
    okHead: (praise, name) => `${praise} ${name} +10`,
    misplaced: (name, where) => `${name} – ne ten. Piešinyje tai ${where}. Teisinga vieta pažymėta.`,
    exists: (name, where) => `${name} šioje ląstelėje yra: piešinyje tai ${where}. Teisinga vieta pažymėta.`,
    absent: {
      chl: "Gyvūninė ląstelė chloroplastų neturi – jie būdingi augalų ląstelėms. Chloroplasto vieta – „Šioje ląstelėje nėra“.",
      wall: "Gyvūninė ląstelė sienelės neturi – ją gaubia tik plazminė membrana. Sienelės vieta – „Šioje ląstelėje nėra“."
    },
    absentOk: {
      chl: "Gyvūninė ląstelė chloroplastų neturi – jie būdingi augalų ląstelėms.",
      wall: "Gyvūninė ląstelė sienelės neturi – ją gaubia tik plazminė membrana."
    }
  },

  /* ---------- 3 lygis ---------- */
  l3: {
    ask: "Paspausk raidę prie tos ląstelės struktūros, kuri atlieka šią funkciją:",
    right: (letter, name) => `Teisingas atsakymas – <b>${letter}</b> (${name}).`,
    funcs: [
      { part: "nuc",  t: "Čia saugoma paveldima informacija" },
      { part: "mem",  t: "Atlieka medžiagų pernašą" },
      { part: "mem",  t: "Per ją medžiagos patenka į ląstelę ir pasišalina iš jos" },
      { part: "wall", t: "Atlieka apsauginę funkciją (augalų ląstelėse)" },
      { part: "cyto", t: "Yra ląstelės užpildas – jame išsidėsčiusios kitos struktūros" },
      { part: "chl",  t: "Čia vyksta fotosintezė" },
      { part: "vac",  t: "Čia kaupiamos ląstelinės sultys" },
      { part: "mit",  t: "Čia vyksta ląstelinis kvėpavimas" }
    ]
  },

  /* ---------- 4 lygis ---------- */
  l4: {
    ask: { p: "Tai <b>augalinė</b> ląstelė. Piešinyje arba sąraše yra viena klaida – paspausk ją.",
           a: "Tai <b>gyvūninė</b> ląstelė. Piešinyje arba sąraše yra viena klaida – paspausk ją." },
    right: letter => `Klaida – <b>${letter}</b>.`,
    label: (letter, accTrue, accShown) => `Raidė ${letter} rodo į ${accTrue}, o ne į ${accShown}.`,
    extra: {
      chl: "Gyvūninė ląstelė chloroplastų neturi – jie būdingi augalų ląstelėms.",
      wall: "Gyvūninė ląstelė sienelės neturi – ją gaubia tik plazminė membrana. Sienelė būdinga augalų ląstelėms."
    }
  },

  /* ---------- „Noriu pasimokyti“ ---------- */
  learn: [
    { icon: "p", name: "Augalinė ir gyvūninė ląstelė", level: 0, html:
      `<p>Visi organizmai sudaryti iš <b>ląstelių</b>. Augalų ir gyvūnų ląstelės turi bendrų struktūrų, bet ir skiriasi.</p>
       <p><b>Abi turi:</b> plazminę membraną, citozolį, branduolį, mitochondrijų.</p>
       <p><b>Tik augalinė turi:</b> ląstelės sienelę, chloroplastų, didelę centrinę vakuolę.</p>
       <span class="mk-ex">Kaip atskirti piešinyje: augalinė – kampuota, su storu išoriniu sluoksniu ir žaliais chloroplastais; gyvūninė – apvalesnė, ją gaubia tik plazminė membrana.</span>` },
    { icon: "a", name: "Kur kuri struktūra?", level: 1, html:
      `<ul><li><b>Ląstelės sienelė</b> – pats išorinis, storas augalinės ląstelės sluoksnis.</li>
       <li><b>Plazminė membrana</b> – plonas sluoksnis, gaubiantis ląstelės vidų (augalinėje ląstelėje – po sienele).</li>
       <li><b>Citozolis</b> – ląstelės užpildas, jame išsidėsčiusios kitos struktūros.</li>
       <li><b>Branduolys</b> – didelis apvalus kūnelis.</li>
       <li><b>Centrinė vakuolė</b> – didelė ertmė augalinės ląstelės viduryje.</li>
       <li><b>Chloroplastai</b> – žali ovalūs kūneliai.</li>
       <li><b>Mitochondrijos</b> – maži pailgi kūneliai.</li></ul>` },
    { icon: "f", name: "Ką daro kiekviena struktūra?", level: 2, html:
      `<ul><li><b>Branduolys</b> – paveldimos informacijos saugojimas.</li>
       <li><b>Plazminė membrana</b> – medžiagų pernaša.</li>
       <li><b>Ląstelės sienelė</b> – apsauginė funkcija.</li>
       <li><b>Citozolis</b> – ląstelės užpildas: jame yra kitos struktūros.</li>
       <li><b>Chloroplastuose</b> vyksta fotosintezė.</li>
       <li><b>Centrinė vakuolė</b> – ląstelinių sulčių kaupimas.</li>
       <li><b>Mitochondrijose</b> vyksta ląstelinis kvėpavimas.</li></ul>` },
    { icon: "e", name: "Dažniausios klaidos", level: 3, html:
      `<ul><li>Gyvūninei ląstelei nupiešiama <b>sienelė</b> arba <b>chloroplastai</b> – jų ten nėra.</li>
       <li>Supainiojama <b>sienelė</b> ir <b>plazminė membrana</b>: sienelė – išorėje ir stora, plazminė membrana – po ja ir plona.</li>
       <li>Supainiojami <b>chloroplastai</b> (fotosintezė) ir <b>mitochondrijos</b> (ląstelinis kvėpavimas).</li>
       <li>Centrinė vakuolė painiojama su branduoliu: branduolys mažesnis ir yra citozolyje, šalia vakuolės.</li></ul>` }
  ]
};
