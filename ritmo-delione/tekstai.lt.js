/* Ritmo dėlionė – visi mokiniui rodomi tekstai (lietuvių k.).
   Verčiant į kitą kalbą užtenka išversti šį failą. Ritmo skiemenys (syl) – pagal pradinio ugdymo muzikos
   rekomendacijas: tam, ti-ti, tiri-diri, ti-di-ri, tim-ri, ššš; kiti (ilgoms natoms) – žaidimo sutartiniai. */
window.MK_T = {
  title: "Ritmo dėlionė",
  h1: "Ritmo <em>dėlionė</em>",
  hero: "Dėliok ritmo korteles į taktus, klausyk, kaip būgnininkas Tadas juos sugroja, ir surink visą orkestrą!",
  note: "Pagal Muzikos bendrąją programą, 3–4 klasės: natos ir pauzės, ritmo piramidė nuo sveikosios iki šešioliktinių, metras. Rezultatai saugomi tik šiame įrenginyje.",
  points: "Taškai",
  next: "Toliau →",
  results: "Rezultatai",
  check: "Tikrinti",
  listen: "Klausyk",
  stop: "Stop",
  quit: "Baigti žaidimą",
  levels: [
    { id: "piramide", name: "Ritmo piramidė", sub: "Sveikoji, pusinė, ketvirtinė, aštuntinės" },
    { id: "taktai", name: "Taktų dėlionė", sub: "Pauzės, natos su tašku, 2, 3 ir 4 dalių metras" },
    { id: "sesiolik", name: "Šešioliktinės ir triolės", sub: "Greiti ritmai – skaičiuok pats" },
    { id: "klaida", name: "Rask klaidą", sub: "Kuris taktas netinka? Koks metras?" },
    { id: "klausa", name: "Klausyk!", sub: "Atpažink ritmą iš klausos, ritmo diktantas" },
    { id: "koncertas", name: "Didysis koncertas", sub: "Visko po truputį" }
  ],
  /* kortelių pavadinimai: n – vardininkas, k – kiek trunka žodžiais */
  cards: {
    w: "sveikoji nata", hd: "pusinė nata su tašku", h: "pusinė nata", qd: "ketvirtinė nata su tašku", q: "ketvirtinė nata",
    ee: "dvi aštuntinės natos", e: "aštuntinė nata", ssss: "keturios šešioliktinės natos", ds: "punktyrinis ritmas: aštuntinė su tašku ir šešioliktinė",
    tri: "aštuntinių triolė", qr: "ketvirtinė pauzė", er: "aštuntinė pauzė", hr: "pusinė pauzė"
  },
  syl: { w: "ta-a-a-am", hd: "ta-a-am", h: "ta-am", qd: "tam-m", q: "tam", ee: "ti-ti", e: "ti", ssss: "tiri-diri", ds: "tim-ri", tri: "ti-di-ri", qr: "ššš", er: "š", hr: "ššš-ššš" },
  meterName: n => `${n} dalių metras`,
  barN: i => `${i} taktas`,
  /* užduočių tekstai */
  qFillAll: "Sudėk <b>visas</b> korteles taip, kad kiekvienas taktas būtų pilnas.",
  qFillExtra: n => `Užpildyk visus taktus. ${n === 1 ? "Viena kortelė liks" : n + " kortelės liks"} – ne visos tinka!`,
  qFillCount: m => `Užpildyk taktus: kiekviename turi būti lygiai <b>${m}</b> ${m === 1 ? "dalis" : "dalys"}. Skaičiuok – kortelių ilgis čia nebepadės.`,
  qSame: "Kuri grupė trunka <b>tiek pat</b>, kiek ši kortelė?",
  qWrong: m => `Metras – <b>${m} dalių</b>. Viename takte dalių skaičius netinka. Kuriame?`,
  qMeter: "Suskaičiuok dalis kiekviename takte. <b>Koks čia metras?</b>",
  qEar: "Paklausyk. Kurį ritmą groja Tadas?",
  qDict: "Ritmo diktantas: paklausyk ir sudėk korteles ta pačia tvarka.",
  tapBar: "Paliesk taktą, į kurį dėsi, tada – kortelę.",
  noFit: left => left ? `Netelpa! Šiame takte liko vietos tik ${left}.` : "Šis taktas jau pilnas. Paliesk kitą taktą.",
  removed: "Kortelė grąžinta. Pagalvok, kur ji tiktų geriau.",
  retry: "Dar ne. Pabandyk dar kartą!",
  retryBars: "Ne visi taktai pilni. Žiūrėk skaičius po kortelėmis ir pataisyk.",
  retryEar: "Ne šis. Paklausyk dar kartą ir skaičiuok garsus.",
  retryDict: n => n ? `Pradžia gera – pirmos ${n === 1 ? "kortelės" : n + " kortelių"} nekeisk. Paklausyk dar kartą.` : "Jau pirma kortelė ne ta. Paklausyk dar kartą.",
  okHead: (praise, pts) => `${praise} +${pts}`,
  failHead: "Šįkart nepavyko – pažiūrėk, kaip turėjo būti:",
  sing: "Paskanduok kartu su Tadu!",
  sumLine: (i, sum, tot, need) => `${i} taktas: ${sum} = <b>${tot}</b>${tot === String(need) ? " ✓" : ` – reikia ${need}`}`,
  sameWhy: (a, b) => `Kortelė trunka <b>${a}</b>. Teisinga grupė: ${b}.`,
  meterWhy: (sum, n) => `Kiekviename takte: ${sum}. Tai <b>${n} dalių metras</b> (${n}/4).`,
  wrongWhy: (i, sum, tot, need) => `${i} takte: ${sum} = <b>${tot}</b>, o reikia ${need}.`,
  earWhy: "Tadas grojo šį ritmą. Skanduok:",
  beats: v => v,
  unit: "Ketvirtinė nata = 1 dalis",
  resTitle: (ok, n) => `${ok} iš ${n} be klaidų`,
  resText: (p, got) => `Surinkai ${p} taškų.` + (got ? ` Į orkestrą atėjo: ${got}!` : ""),
  orchT: "Mano orkestras",
  orchText: (n, need, nextName) => need ? `Užduočių be klaidų: ${n}. Dar ${need} – ir ateis ${nextName}.` : `Užduočių be klaidų: ${n}. Visas orkestras jau groja!`,
  orch: ["Lazdelės", "Trikampis", "Marakasai", "Tamburinas", "Ksilofonas", "Lėkštės", "Varpeliai", "Kanklės"],
  orchAcc: ["lazdelės", "trikampis", "marakasai", "tamburinas", "ksilofonas", "lėkštės", "varpeliai", "kanklės"],
  learn: [
    { name: "Ritmo piramidė", level: 0, html: `<p>Kiekviena nata trunka dvigubai trumpiau už ankstesnę:</p><div class="pyr" data-pyr></div>
      <p>1 sveikoji = 2 pusinės = 4 ketvirtinės = 8 aštuntinės = 16 šešioliktinių.</p><span class="mk-ex">Žaidime ketvirtinė nata skaičiuojama kaip <b>1 dalis</b>. Tada pusinė – 2 dalys, sveikoji – 4, aštuntinė – ½, šešioliktinė – ¼.</span>` },
    { name: "Metras ir taktas", level: 1, html: `<p>Muzika suskirstyta į <b>taktus</b>. Metras parodo, kiek dalių telpa į vieną taktą:</p>
      <ul><li><b>2/4</b> – 2 dalių metras: takte dvi ketvirtinės (viens, du).</li><li><b>3/4</b> – 3 dalių metras: takte trys ketvirtinės (viens, du, trys).</li><li><b>4/4</b> – 4 dalių metras: takte keturios ketvirtinės.</li></ul>
      <span class="mk-ex">Taktas pilnas, kai visų natų ir pauzių trukmės kartu sudaro lygiai tiek dalių, kiek rodo metras.</span>` },
    { name: "Pauzės ir natos su tašku", level: 1, html: `<p><b>Pauzė</b> – tyla, kuri irgi turi trukmę: ketvirtinė pauzė trunka 1 dalį, pusinė – 2, aštuntinė – ½.</p>
      <p><b>Taškas</b> šalia natos pailgina ją per pusę jos trukmės:</p><ul><li>pusinė su tašku = 2 + 1 = 3 dalys;</li><li>ketvirtinė su tašku = 1 + ½ = 1½ dalies.</li></ul>` },
    { name: "Šešioliktinės, punktyrinis ritmas ir triolė", level: 2, html: `<ul><li><b>Keturios šešioliktinės</b> (tiri-diri) kartu trunka 1 dalį.</li>
      <li><b>Punktyrinis ritmas</b> (tim-ri): aštuntinė su tašku ir šešioliktinė – ilgas ir trumpas garsas, kartu 1 dalis.</li>
      <li><b>Triolė</b> (ti-di-ri): trys vienodi garsai per 1 dalį, pažymėti skaičiumi 3.</li></ul>` },
    { name: "Ritmo skiemenys", level: 4, html: `<p>Ritmą lengviau perskaityti skanduojant skiemenimis:</p>
      <ul><li>ketvirtinė – <b>tam</b>;</li><li>dvi aštuntinės – <b>ti-ti</b>;</li><li>keturios šešioliktinės – <b>tiri-diri</b>;</li><li>triolė – <b>ti-di-ri</b>;</li><li>punktyrinis ritmas – <b>tim-ri</b>;</li><li>pauzė – <b>ššš</b>.</li></ul>` }
  ]
};
