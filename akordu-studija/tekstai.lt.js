/* Akordų studija – visi mokiniui rodomi tekstai (lietuvių k.).
   Verčiant į kitą kalbą užtenka išversti šį failą.
   Sąvokos pagal „Pagrindinio ugdymo muzikos bendrosios programos įgyvendinimo rekomendacijas“ (7–8 kl.):
   akordas, akordų seka, septakordas, nonakordas, pritarimas dainai, 12-os taktų bliuzo forma, bliuzo harmonija. */
window.MK_T = {
  title: "Akordų studija",
  h1: "Akordų <em>studija</em>",
  hero: "Rink akordus klavišais, atpažink juos iš klausos, pritark dainoms ir sugrok 12-os taktų bliuzą – už žvaigždutes į tavo grupę ateis nauji muzikantai.",
  note: "Pagal Muzikos bendrosios programos įgyvendinimo rekomendacijas, 7–8 klasės: akordai ir būdingos jų sekos, septakordas, nonakordas, pritarimas dainai, 12-os taktų bliuzo forma. Rezultatai saugomi tik šiame įrenginyje.",
  points: "Taškai",
  next: "Toliau →",
  results: "Rezultatai",
  check: "Tikrinti",
  listen: "Klausyk",
  stop: "Stop",
  clear: "Išvalyti",
  hint: "Užuomina (−5)",
  hintRoot: (s, n) => `Akordo <b>${s}</b> pagrindinis garsas – <b>${n}</b>.`,
  quit: "Baigti žaidimą",
  levels: [
    { id: "trigarsiai", name: "Mažorinis ir minorinis", sub: "Surink akordą iš trijų garsų" },
    { id: "septakordai", name: "Septakordas ir nonakordas", sub: "Keturių ir penkių garsų akordai" },
    { id: "klausa", name: "Iš klausos", sub: "Mažorinis, minorinis ar septakordas?" },
    { id: "pritarimas", name: "Pritarimas dainai", sub: "Kuris akordas tinka taktui?" },
    { id: "bliuzas", name: "12 taktų bliuzas", sub: "Bliuzo forma ir harmonija" },
    { id: "koncertas", name: "Koncertas", sub: "Visko po truputį" }
  ],
  /* garsų pavadinimai ir raidinis žymėjimas */
  sol: ["do", "re", "mi", "fa", "sol", "la", "si"],
  sharp: "♯", flat: "♭",
  sysLabel: "Garso „si“ raidė akorduose:",
  sysB: "B (si), B♭ (si bemol)",
  sysH: "H (si), B (si bemol)",
  quality: { M: "mažorinis akordas", m: "minorinis akordas", 7: "septakordas", 9: "nonakordas" },
  qShort: { M: "Mažorinis", m: "Minorinis", 7: "Septakordas", 9: "Nonakordas" },
  formula: {
    M: "Mažorinis akordas: nuo pagrindinio garso – <b>4 pustoniai</b>, tada dar <b>3 pustoniai</b>.",
    m: "Minorinis akordas: nuo pagrindinio garso – <b>3 pustoniai</b>, tada dar <b>4 pustoniai</b>.",
    7: "Septakordas (žymimas 7): mažorinis akordas (4 + 3 pustoniai) ir dar vienas garsas – <b>3 pustoniais aukščiau</b> už viršutinį.",
    9: "Nonakordas (žymimas 9): septakordas (4 + 3 + 3 pustoniai) ir dar vienas garsas – <b>4 pustoniais aukščiau</b> už viršutinį."
  },
  semi: "Pustonis – atstumas tarp dviejų gretimų klavišų (skaičiuok ir juodus).",
  /* klavišų užduotys */
  qBuild: s => `Surink akordą <b>${s}</b>: paliesk jo garsus klaviatūroje.`,
  qMorph: (a, b) => `Dabar pažymėtas akordas <b>${a}</b>. Pakeisk <b>vieną</b> garsą, kad gautum <b>${b}</b>.`,
  qAdd7: (a, b) => `Pažymėtas akordas <b>${a}</b>. Pridėk vieną garsą, kad gautum septakordą <b>${b}</b>.`,
  qAdd9: (a, b) => `Pažymėtas septakordas <b>${a}</b>. Pridėk vieną garsą, kad gautum nonakordą <b>${b}</b>.`,
  qMid: s => `Pažymėti du akordo <b>${s}</b> garsai. Pridėk trūkstamą vidurinį garsą.`,
  qFix: s => `Čia turėjo būti akordas <b>${s}</b>, bet vienas garsas netikslus. Pataisyk jį.`,
  qName: "Koks tai akordas? Klavišus gali paliesti ir paklausyti.",
  chosen: "Tavo garsai:",
  none: "dar nė vieno",
  needN: n => `Šiame akorde skirtingų garsų: ${n}. Pažymėk lygiai tiek klavišų.`,
  dup: "Tas pats garsas pažymėtas dviejose oktavose. Palik tik vieną.",
  fbCount: (good, bad, miss) => `Dar ne. Tinkamų garsų: <b>${good}</b>` + (bad ? `, netinkamų: <b>${bad}</b>` : "") + (miss ? `, dar trūksta: <b>${miss}</b>` : "") + ". Pabandyk dar kartą!",
  retry: "Pabandyk dar kartą",
  retryBody: "Suskaičiuok pustonius nuo pagrindinio garso. Jei reikia – spausk „Užuomina“.",
  wrongOpt: "Ne šis. Palygink pažymėtus garsus su akordo pavadinimu ir rink dar kartą.",
  okHead: (p, n) => `${p} +${n}`,
  failHead: "Teisingas atsakymas:",
  whyChord: (s, q, notes) => `<b>${s}</b> – ${q}: <b>${notes}</b>.`,
  whySteps: { M: "Tarp garsų: 4 ir 3 pustoniai.", m: "Tarp garsų: 3 ir 4 pustoniai.", 7: "Tarp garsų: 4, 3 ir 3 pustoniai. Tarp kraštinių garsų – septimos intervalas.", 9: "Tarp garsų: 4, 3, 3 ir 4 pustoniai. Tarp kraštinių garsų – nonos intervalas." },
  whyMorph: { M: "Vidurinis garsas (tercija) pakilo pustoniu – akordas tapo mažorinis.", m: "Vidurinis garsas (tercija) nusileido pustoniu – akordas tapo minorinis." },
  anyOct: "Akordo garsus galima imti bet kurioje oktavoje – skambės tas pats akordas.",
  sumMore: "Kaip suskaičiuoti?",
  sumForm: "Visa 12-os taktų forma",
  earRetry: "Ne. Paklausyk dar kartą ir rink iš naujo.",
  transRetry: "Ne. Suskaičiuok I, IV ir V laipsnius nuo naujos tonikos ir rink dar kartą.",
  oddPick: "Šis kitoks",
  /* klausa */
  qEar: "Paklausyk akordo. Koks jis?",
  qOdd: "Skamba trys akordai. Du – tos pačios rūšies, vienas – kitoks. Kuris?",
  oddN: i => `${i} akordas`,
  again: "Dar kartą",
  earWhy: (s, q, notes) => `Skambėjo <b>${s}</b> – ${q} (${notes}).`,
  earTip: { M: "Mažorinis akordas dažniausiai skamba šviesiai.", m: "Minorinis akordas dažniausiai skamba liūdniau, ramiau.", 7: "Septakorde – keturi garsai; jis skamba įtemptai, tarsi lauktų tęsinio." },
  oddWhy: list => `Skambėjo: ${list}.`,
  soundOff: "Garsas išjungtas. Įjunk jį mygtuku viršuje dešinėje – be garso šių užduočių neįveiksi.",
  /* pritarimas dainai */
  qHarm: "Parink kiekvienam taktui akordą: melodijos garsai turi būti akordo garsai. Paliesk taktą, tada akordą.",
  qHarmKey: s => `Melodija ${s} tonacijoje.`,
  barN: i => `${i} taktas`,
  palette: "Akordai:",
  harmNeed: "Parink akordą kiekvienam taktui.",
  harmRetry: n => `Netinka ${n === 1 ? "vienas taktas" : n + " taktai"} – jie pažymėti. Palygink melodijos garsus su akordo garsais.`,
  harmLine: (i, notes, s, cn) => `${i} taktas: ${notes} → <b>${s}</b> (${cn})`,
  harmOk: "Paklausyk, kaip grupė pritaria melodijai.",
  /* bliuzas */
  qBfill: s => `12-os taktų bliuzas ${s} tonacijoje. Užpildyk tuščius taktus: paliesk taktą, tada akordą.`,
  qBerr: s => `12-os taktų bliuzas ${s} tonacijoje. Viename takte – ne tas akordas. Kuriame?`,
  qBtrans: (a, list, b) => `${a} tonacijoje bliuzo harmoniją sudaro ${list}. Kurie akordai ją sudaro ${b} tonacijoje?`,
  bNeed: "Užpildyk visus tuščius taktus.",
  bRetry: n => `Netinka ${n === 1 ? "vienas taktas" : n + " taktai"} – jie pažymėti. Prisimink: 4 taktai, 4 taktai, 4 taktai.`,
  bErrRetry: "Šis taktas geras. Paklausyk bliuzo ir ieškok dar kartą.",
  bWhy: (I, IV, V) => `Bliuzo harmoniją sudaro trys akordai: I laipsnio (<b>${I}</b>), IV laipsnio (<b>${IV}</b>) ir V laipsnio (<b>${V}</b>).`,
  bForm: (I, IV, V) => `1 sakinys: ${I} | ${I} | ${I} | ${I}<br>2 sakinys: ${IV} | ${IV} | ${I} | ${I}<br>3 sakinys: ${V} | ${IV} | ${I} | ${I}`,
  bErrWhy: (i, s) => `${i} takte turi skambėti <b>${s}</b>.`,
  bTransWhy: (k, a, b, c) => `Skaičiuok laipsnius nuo tonikos <b>${k}</b>: I – ${a}, IV – ${b}, V – ${c}.`,
  bListen: "Paklausyk, kaip skamba",
  join: (a, b, c) => `${a}, ${b} ir ${c}`,
  /* rezultatai */
  resTitle: (ok, n) => `Iš pirmo karto: ${ok} iš ${n}`,
  resText: (pts, who) => `Surinkai ${pts} taškų.` + (who ? ` Į grupę atėjo: ${who}!` : ""),
  /* grupė */
  bandTitle: "Mano grupė",
  bandJam: "Groti bliuzą",
  bandMore: (n, who) => `Dar ${n} ⭐ – ir prisijungs ${who}.`,
  bandFull: "Visa grupė scenoje. Paliesk muzikantą – jis nutils arba vėl gros.",
  bandTap: "Grojant paliesk muzikantą – jis nutils arba vėl gros.",
  band: [
    { name: "Ugnė", role: "klavišiniai", who: "klavišininkė Ugnė" },
    { name: "Rokas", role: "bosinė gitara", who: "bosistas Rokas" },
    { name: "Matas", role: "būgnai", who: "būgnininkas Matas" },
    { name: "Emilija", role: "gitara", who: "gitaristė Emilija" },
    { name: "Jonas", role: "saksofonas", who: "saksofonininkas Jonas" }
  ],
  /* „Noriu pasimokyti“ */
  learn: [
    { level: 0, name: "Akordas, raidės ir pustoniai", html: `
      <p><b>Akordas</b> – keli (trys ar daugiau) vienu metu skambantys garsai. Akordais pritariama dainoms gitara, ukulele ar klavišiniu instrumentu.</p>
      <p>Akordai žymimi raidėmis pagal pagrindinį garsą:</p>
      <span class="mk-ex">do – C · re – D · mi – E · fa – F · sol – G · la – A · si – B (arba H – pagal klasės susitarimą)</span>
      <p><b>Diezas ♯</b> pakelia garsą pustoniu, <b>bemolis ♭</b> – pažemina. Klaviatūroje tai dažniausiai juodi klavišai: tarp do ir re yra do♯ (tas pats klavišas – re♭).</p>
      <p><b>Pustonis</b> – atstumas tarp dviejų gretimų klavišų, skaičiuojant ir juodus. Nuo mi iki fa ir nuo si iki do juodo klavišo nėra – ten iškart pustonis.</p>` },
    { level: 0, name: "Mažorinis ir minorinis akordas", html: `
      <p>Abu akordus sudaro trys garsai, skiriasi tik vidurinis.</p>
      <span class="mk-ex">C (mažorinis): do – mi – sol → 4 ir 3 pustoniai</span>
      <span class="mk-ex">Cm (minorinis): do – mi♭ – sol → 3 ir 4 pustoniai</span>
      <p>Mažorinis akordas dažniausiai skamba šviesiai, linksmai, minorinis – liūdniau, ramiau.</p>
      <p>Žymėjimas: vien didžioji raidė (C, G, F) – mažorinis akordas; raidė su <b>m</b> (Am, Dm, Em) – minorinis.</p>` },
    { level: 1, name: "Septakordas ir nonakordas", html: `
      <p><b>Septakordas</b> ir <b>nonakordas</b> – akordai, tarp kurių kraštinių garsų yra septimos ar nonos intervalas.</p>
      <span class="mk-ex">G7: sol – si – re – fa → 4, 3 ir 3 pustoniai</span>
      <span class="mk-ex">G9: sol – si – re – fa – la → 4, 3, 3 ir 4 pustoniai</span>
      <p>Populiariojoje muzikoje, bliuze ir džiaze septakordai žymimi skaičiumi 7 (G7, C7, F7), nonakordai – skaičiumi 9. Septakordas skamba įtemptai – po jo norisi išgirsti kitą akordą (po G7 – akordą C).</p>` },
    { level: 3, name: "Pritarimas dainai ir akordų sekos", html: `
      <p>Akordas tinka taktui, kai to takto melodijos garsai yra akordo garsai. Pavyzdžiui, taktui „mi – sol – do“ tinka C (do – mi – sol), o taktui „re – fa – si“ – G7 (sol – si – re – fa).</p>
      <p>Būdingos akordų sekos:</p>
      <span class="mk-ex">C – F – G7 – C</span>
      <span class="mk-ex">C – Am – F – G7</span>
      <span class="mk-ex">Am – Dm – E7 – Am</span>
      <p>Daina dažniausiai baigiama I laipsnio (tonikos) akordu – tada ji skamba užbaigtai.</p>` },
    { level: 4, name: "12-os taktų bliuzo forma", html: `
      <p>Bliuzo posmą sudaro trys muzikiniai sakiniai po 4 taktus – iš viso 12 taktų. Bliuzo harmoniją C tonacijoje sudaro C, F7 ir G7 akordų kaita:</p>
      <span class="mk-ex">C | C | C | C<br>F7 | F7 | C | C<br>G7 | F7 | C | C</span>
      <p>Tai I, IV ir V laipsnių akordai. Kitoje tonacijoje laipsnius skaičiuok nuo naujos tonikos, pvz., G tonacijoje: sol (I), do (IV), re (V) → G, C7, D7.</p>
      <p>Muzikantai šią seką kartais šiek tiek keičia, bet pagrindas lieka tas pats.</p>` }
  ]
};
