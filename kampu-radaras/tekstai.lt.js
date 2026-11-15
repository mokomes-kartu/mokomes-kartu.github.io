/* Kampų radaras – visi mokiniui rodomi tekstai (lietuvių k.).
   Verčiant į kitą kalbą užtenka išversti šį failą. Terminai – pagal Matematikos bendrąją programą:
   vienetinis apskritimas, posūkio kampas, tikslios reikšmės, arcsin, arccos, arctg, sprendiniai nurodytame intervale. */
window.MK_T = {
  title: "Kampų radaras",
  h1: "Kampų <em>radaras</em>",
  hero: "Esi radaro operatorius: vienetinis apskritimas – tavo ekranas. Nukreipk spindulį, rask tikslias sinuso, kosinuso ir tangento reikšmes, pagauk visus lygties sprendinius.",
  note: "Pagal Matematikos bendrąją programą: III gimnazijos kl. „Sinusas, kosinusas ir tangentas“, IV gimnazijos kl. „Trigonometrinės lygtys“. Radianai – išplėstinio kurso tema. Rezultatai saugomi tik šiame įrenginyje.",
  points: "Taškai", next: "Toliau →", results: "Rezultatai", check: "Tikrinti", quit: "Baigti", explain: "Paaiškinimas",
  modeDeg: "Laipsniai", modeRad: "Radianai", modeHint: "Radianai – išplėstinis kursas",
  levels: [
    { id: "posukis", name: "Posūkio kampas", sub: "Teigiami, neigiami ir didesni už pilną apsisukimą kampai" },
    { id: "reiksmes", name: "Tikslios reikšmės", sub: "sin, cos, tg – naudojantis vienetiniu apskritimu" },
    { id: "paieska", name: "Kampų paieška", sub: "sin α = a, cos α = a, tg α = a; arcsin, arccos, arctg" },
    { id: "sarysiai", name: "Ženklai ir sąryšiai", sub: "Ketvirčiai, sin²α + cos²α = 1, smailieji kampai" },
    { id: "intervalai", name: "Lygtys intervale", sub: "IV kl.: sprendiniai nurodytame intervale" },
    { id: "vbe", name: "VBE treniruotė", sub: "10 mišrių užduočių" }
  ],
  fnW: { sin: "sinusas", cos: "kosinusas", tg: "tangentas" },
  arcName: { sin: "arcsin a", cos: "arccos a", tg: "arctg a" },
  none: "nė vieno", and: " ir ",
  undef: "neapibrėžtas", pos: "teigiama", neg: "neigiama", zero: "lygi nuliui",
  quadName: q => `${q} ketvirtis`,
  qAim: a => `Nukreipk radaro spindulį: posūkio kampas <b>α = ${a}</b>. Paliesk tašką apskritime.`,
  qCoterm: a => `Kuris posūkio kampas baigiasi tame pačiame apskritimo taške kaip <b>${a}</b>?`,
  qQuad: a => `Kuriame ketvirtyje baigiasi posūkio kampas <b>${a}</b>?`,
  qConvR: a => `Išreikšk radianais: <b>${a}</b>`,
  qConvD: a => `Išreikšk laipsniais: <b>${a}</b>`,
  qVal: e => `Apskaičiuok tikslią reikšmę: <b>${e}</b>`,
  qEq: (e, iv) => `Pažymėk <b>visus</b> kampus α ∈ ${iv}, kuriems <b>${e}</b>.`,
  qArc: e => `Kam lygu <b>${e}</b>?`,
  qSign: e => `Kokio ženklo yra sandauga <b>${e}</b>?`,
  qCmp: big => `Kuri reikšmė <b>${big ? "didžiausia" : "mažiausia"}</b>? Pagalvok, kur taškai yra apskritime.`,
  qPyth: (given, q, ask) => `<b>${given}</b>, α – ${q} ketvirčio kampas. Kam lygu <b>${ask}</b>?`,
  qRed: e => `Išreikšk smailiojo kampo funkcija: <b>${e}</b> = ?`,
  qMulti: (e, iv) => `Išspręsk lygtį <b>${e}</b>, kai <b>x ∈ ${iv}</b>. Pažymėk visus sprendinius.`,
  qCount: (e, iv) => `Kiek sprendinių turi lygtis <b>${e}</b> intervale <b>${iv}</b>?`,
  qGen: e => `Kuri formulė užrašo <b>visus</b> lygties <b>${e}</b> sprendinius (k ∈ Z)?`,
  qNosol: "Kuri lygtis <b>neturi</b> sprendinių?",
  okHead: (praise, pts) => `${praise} +${pts}`,
  retry: "Dar ne. Pabandyk dar kartą.",
  retryPts: (miss, extra) => `Dar ne: ${miss ? `trūksta ${miss}` : ""}${miss && extra ? ", " : ""}${extra ? `nereikalingų ${extra}` : ""}. Pataisyk ir tikrink dar kartą.`,
  failHead: "Šįkart nepavyko. Teisingas atsakymas pažymėtas žaliai.",
  /* paaiškinimų dalys */
  wFull: full => `Pilnas apsisukimas – ${full}.`,
  wSame: (a, base, expr) => `${a} = ${expr}, todėl spindulys sustoja ten pat, kur ${base}.`,
  wNeg: "Neigiamas kampas sukamas pagal laikrodžio rodyklę, teigiamas – prieš.",
  wAim0: (a, where) => `Kampas atidedamas nuo teigiamosios x pusašės prieš laikrodžio rodyklę. ${a} – ${where}.`,
  onAxis: "ant koordinačių ašies",
  inQuad: (q, lo, hi) => `${q} ketvirtyje (tarp ${lo} ir ${hi})`,
  wQuad: (a, q) => `Atsakymas: ${a} baigiasi <b>${q} ketvirtyje</b>.`,
  wConv: (full, half) => `${full} atitinka ${half} radianų, todėl laipsnius dauginame iš π/180, o radianus – iš 180/π.`,
  wPoint: (a, x, y) => `Taško, atitinkančio ${a}, koordinatės: (cos; sin) = (${x}; ${y}).`,
  wRef: (a, q, ref) => `${a} – ${q} ketvirtis, kampas su x ašimi – ${ref}.`,
  wSigns: (q, s, c) => `${q} ketvirtyje sinusas ${s}, kosinusas ${c}.`,
  signP: "teigiamas", signN: "neigiamas",
  wRes: (e, v) => `Todėl <b>${e} = ${v}</b>.`,
  wTg: (e, s, c, v) => `tg α = sin α : cos α, todėl ${e} = ${s} : ${c} = <b>${v}</b>.`,
  wTgUndef: e => `tg α = sin α : cos α, o čia cos α = 0 – dalyti iš nulio negalima, todėl <b>${e} neapibrėžtas</b>.`,
  wEqSin: (v, list) => `sin α – taško ordinatė (y). Tiesė y = ${v} kerta vienetinį apskritimą taškuose: <b>${list}</b>.`,
  wEqCos: (v, list) => `cos α – taško abscisė (x). Tiesė x = ${v} kerta vienetinį apskritimą taškuose: <b>${list}</b>.`,
  wEqTg: (v, list) => `Tangento reikšmės kartojasi kas pusę apsisukimo: tiesė per koordinačių pradžią kerta apskritimą dviejuose priešinguose taškuose: <b>${list}</b>.`,
  wArc: (name, range, e, p, others) => `${name} – kampas iš intervalo ${range}. ${e} = <b>${p}</b>.${others ? ` Kiti variantai (${others}) arba nepriklauso šiam intervalui, arba jų reikšmė kita.` : ""}`,
  wSign: (a1, q1, f1, s1, a2, q2, f2, s2, res) => `${a1} – ${q1} ketvirtis: ${f1} ${s1}. ${a2} – ${q2} ketvirtis: ${f2} ${s2}. Sandauga <b>${res}</b>.`,
  lt0: "< 0", gt0: "> 0",
  wCmp: (fn, coord, list) => `${fn} – taško ${coord}. Apytikslės reikšmės: ${list}.`,
  ordinate: "ordinatė (kuo aukščiau taškas, tuo reikšmė didesnė)", abscissa: "abscisė (kuo dešiniau taškas, tuo reikšmė didesnė)",
  wPyth: (sq, other, q, sign, res) => `sin²α + cos²α = 1, todėl ${sq}, taigi ${other}. ${q} ketvirtyje ši reikšmė ${sign}: <b>${res}</b>.`,
  wPythTg: (s, c, v) => ` Tada tg α = sin α : cos α = ${s} : ${c} = <b>${v}</b>.`,
  wRed: (a, expr, q, fn, sign, res) => `${a} = ${expr} – ${q} ketvirtis, ten ${fn} ${sign}. Funkcijos pavadinimas nesikeičia, nes kampą skaičiuojame nuo x ašies: <b>${res}</b>.`,
  wMulti: (turn, full, list) => `Viename apsisukime: ${turn}. Pridedame arba atimame ${full} ir paliekame tik tuos, kurie patenka į intervalą: <b>${list}</b>.`,
  wCount: n => `Iš viso <b>${n}</b>.`,
  wGenSin: (v, p, f) => `sin x = a sprendiniai: x = (−1)<sup>k</sup>·arcsin a + ${f}, k ∈ Z. arcsin ${v} = ${p}.`,
  wGenCos: (v, p, f) => `cos x = a sprendiniai: x = ±arccos a + ${f}, k ∈ Z. arccos ${v} = ${p}.`,
  wGenTg: (v, p, f) => `tg x = a sprendiniai: x = arctg a + ${f}, k ∈ Z. arctg ${v} = ${p}.`,
  wNosol: (e, approx) => `Sinuso ir kosinuso reikšmės priklauso intervalui [−1; 1]. Lygtyje ${e} dešinė pusė ≈ ${approx} – į šį intervalą nepatenka. Tangentas gali įgyti bet kurią reikšmę.`,
  resTitle: (ok, n) => `${ok} iš ${n} iš pirmo karto`,
  resText: (p, m) => `Surinkai ${p} taškų. Įvaldyta kampų: ${m} iš 16.`,
  goalT: "Radaro žemėlapis",
  goalText: (m, rank, next) => `Laipsnis: <b>${rank}</b>. Įvaldyta kampų: ${m} iš 16.${next ? ` Kampas įvaldomas, kai su juo teisingai iš pirmo karto atsakai 3 kartus.` : " Visas apskritimas tavo!"}`,
  ranks: ["Stažuotojas", "Radaro operatorius", "Dispečeris", "Navigatorius", "Vyriausiasis navigatorius"],
  learn: [
    { name: "Vienetinis apskritimas ir posūkio kampas", level: 0, html: `<p><b>Vienetinis apskritimas</b> – apskritimas, kurio centras koordinačių pradžioje, o spindulys lygus 1. <b>Posūkio kampas</b> atidedamas nuo teigiamosios x pusašės: teigiamas – prieš laikrodžio rodyklę, neigiamas – pagal ją.</p>
      <p>Pilnas apsisukimas – 360°. Kampai, kurie skiriasi 360°·k, baigiasi tame pačiame taške.</p><span class="mk-ex">750° = 2 · 360° + 30° → tas pats taškas kaip 30°.<br>−60° → tas pats taškas kaip 300°.</span>` },
    { name: "Sinusas, kosinusas ir tangentas", level: 1, html: `<p>Jei posūkio kampą α atitinka apskritimo taškas (x; y), tai <b>cos α = x</b>, <b>sin α = y</b>, <b>tg α = sin α : cos α</b> (kai cos α ≠ 0).</p>
      <p>Smailiųjų kampų tikslios reikšmės:</p><div class="tbl" data-tbl></div>
      <span class="mk-ex">Kitiems kampams: surask kampą su x ašimi (30°, 45° ar 60°), paimk jo reikšmę ir parink ženklą pagal ketvirtį. Pvz., 210° – III ketvirtis, kampas su ašimi 30°: sin 210° = −1/2.</span>` },
    { name: "Ženklai ketvirčiuose", level: 3, html: `<ul><li>I ketvirtis: sin &gt; 0, cos &gt; 0, tg &gt; 0;</li><li>II ketvirtis: sin &gt; 0, cos &lt; 0, tg &lt; 0;</li><li>III ketvirtis: sin &lt; 0, cos &lt; 0, tg &gt; 0;</li><li>IV ketvirtis: sin &lt; 0, cos &gt; 0, tg &lt; 0.</li></ul>
      <p>Sinuso ir kosinuso reikšmės priklauso intervalui [−1; 1] ir kartojasi kas 360°, tangento – kas 180°.</p><span class="mk-ex">sin²α + cos²α = 1. Jei sin α = 3/5 ir α – II ketvirčio kampas, tai cos α = −4/5.</span>` },
    { name: "arcsin, arccos, arctg", level: 2, html: `<ul><li><b>arcsin a</b> – kampas iš [−90°; 90°], kurio sinusas lygus a (|a| ≤ 1);</li><li><b>arccos a</b> – kampas iš [0°; 180°], kurio kosinusas lygus a (|a| ≤ 1);</li><li><b>arctg a</b> – kampas iš (−90°; 90°), kurio tangentas lygus a.</li></ul>
      <span class="mk-ex">arcsin(−1/2) = −30°, arccos(−1/2) = 120°, arctg(−1) = −45°.</span>` },
    { name: "Trigonometrinės lygtys", level: 4, html: `<p>Paprasčiausių lygčių sprendiniai (k ∈ Z):</p><ul><li>sin x = a: x = (−1)<sup>k</sup>·arcsin a + 180°·k;</li><li>cos x = a: x = ±arccos a + 360°·k;</li><li>tg x = a: x = arctg a + 180°·k.</li></ul>
      <p><b>Sprendiniai nurodytame intervale:</b> surask sprendinius viename apsisukime (apskritime), tada pridėk arba atimk 360° (tangentui – 180°) ir palik tik patenkančius į intervalą.</p>
      <span class="mk-ex">sin x = 1/2, x ∈ [−180°; 360°]: viename apsisukime 30° ir 150°; 30° − 360° ir 150° − 360° į intervalą nepatenka. Ats.: 30°, 150°.</span>` },
    { name: "Radianai (išplėstinis kursas)", level: 0, html: `<p>Kampų dydžiai gali būti reiškiami ne tik laipsniais, bet ir radianais: <b>180° = π rad</b>.</p>
      <ul><li>30° = π/6, 45° = π/4, 60° = π/3, 90° = π/2;</li><li>laipsnius keičiame radianais daugindami iš π/180, radianus laipsniais – iš 180/π.</li></ul><span class="mk-ex">Meniu viršuje gali perjungti visą žaidimą į radianus.</span>` }
  ]
};
