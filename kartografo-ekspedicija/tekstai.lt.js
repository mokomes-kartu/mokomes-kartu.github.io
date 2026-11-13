/* Kartografo ekspedicija – visi mokiniui rodomi tekstai (lietuvių k.).
   Verčiant į kitą kalbą užtenka nukopijuoti šį failą ir išversti reikšmes; žaidimo kodo keisti nereikia.
   Vietų, miestų ir žemynų pavadinimai (miestai – zemelapis.js) taip pat verčiami. */
window.MK_T = {
  title: "Kartografo ekspedicija",
  h1: "Kartografo <em>ekspedicija</em>",
  hero: "Tu – ekspedicijos kartografas. Nustatyk kryptis, išmatuok atstumus žemėlapyje ir surask vietas pagal koordinates – už kiekvieną sėkmę pasodinama vėliavėlė naujame žemyne.",
  note: "Turinys pagal Geografijos bendrąją programą (6–7 kl.): pasaulio kryptys, mastelis, geografinės koordinatės. Rezultatai saugomi tik šiame įrenginyje.",
  points: "Taškai",
  levels: [
    ["Pasaulio kryptys", "kompasas, šiaurės rodyklė, posūkiai"],
    ["Mastelis ir atstumai", "liniuotė, 1 : 100 000, linijinis mastelis"],
    ["Platuma ir ilguma", "koordinatės, lygiagretės, dienovidiniai"],
    ["Ekspedicijos egzaminas", "visko po truputį"]
  ],
  dirs: ["šiaurė", "šiaurės rytai", "rytai", "pietryčiai", "pietūs", "pietvakariai", "vakarai", "šiaurės vakarai"],
  dirsGen: ["šiaurės", "šiaurės rytų", "rytų", "pietryčių", "pietų", "pietvakarių", "vakarų", "šiaurės vakarų"],
  dirsAcc: ["šiaurę", "šiaurės rytus", "rytus", "pietryčius", "pietus", "pietvakarius", "vakarus", "šiaurės vakarus"],
  screenDirs: ["aukštyn", "aukštyn ir į dešinę", "į dešinę", "žemyn ir į dešinę", "žemyn", "žemyn ir į kairę", "į kairę", "aukštyn ir į kairę"],
  places: [
    ["tent", "palapinė", "palapinės"], ["lighthouse", "švyturys", "švyturio"], ["lake", "ežeras", "ežero"],
    ["mountain", "kalnas", "kalno"], ["cave", "urvas", "urvo"], ["bridge", "tiltas", "tilto"],
    ["mill", "malūnas", "malūno"], ["port", "uostas", "uosto"], ["well", "šulinys", "šulinio"],
    ["fire", "laužas", "laužo"], ["castle", "pilis", "pilies"], ["ruins", "griuvėsiai", "griuvėsių"],
    ["forest", "miškas", "miško"], ["village", "kaimas", "kaimo"]
  ],
  q: {
    dirmap: (a, b) => `Kuria kryptimi nuo ${a} yra ${b}?`,
    dirmapNorth: "Šiaurė žemėlapyje pažymėta rodykle Š – ji gali rodyti ne aukštyn.",
    turn: (dir, ang, cw) => `Stovi veidu į ${dir}. Pasisuki ${ang}° ${cw ? "pagal" : "prieš"} laikrodžio rodyklę. Kur dabar žiūri?`,
    needle: "Raudona kompaso rodyklė rodo šiaurę. Kuria kryptimi žiūri tu (juoda rodyklė)?",
    hands: {
      right: dir => `Stovi veidu į ${dir} ir ištiesi dešinę ranką į šoną. Kuria kryptimi ji rodo?`,
      left: dir => `Stovi veidu į ${dir} ir ištiesi kairę ranką į šoną. Kuria kryptimi ji rodo?`,
      back: dir => `Stovi veidu į ${dir}. Kuria kryptimi nukreipta tavo nugara?`
    },
    sun: [
      ["Ryte stovi veidu į tekančią saulę (ji teka maždaug rytuose). Kuria kryptimi yra tavo nugara?", 6, "Saulė teka maždaug rytuose, o nugara visada priešinga veidui – vakarai."],
      ["Vakare saulė leidžiasi (maždaug vakaruose). Kuria kryptimi žiūri, jei stovi veidu į leidžiamą saulę?", 6, "Saulė leidžiasi maždaug vakaruose, tad veidu žiūri į vakarus."],
      ["Vidurdienį Lietuvoje saulė pakyla aukščiausiai. Kuria kryptimi ji matoma?", 4, "Mūsų platumose vidurdienį saulė būna pietuose."],
      ["Vidurdienį Lietuvoje saulė šviečia iš pietų. Kuria kryptimi krenta tavo šešėlis?", 0, "Šešėlis krenta priešinga saulei kryptimi: saulė pietuose, o šešėlis – šiaurėje."],
      ["Vidurdienį stovi veidu į saulę. Kuri kryptis yra už tavo nugaros?", 0, "Vidurdienį saulė pietuose, tad veidu žiūri į pietus, o nugara – į šiaurę."],
      ["Ryte saulė šviečia tau tiesiai į nugarą. Kuria kryptimi žiūri?", 6, "Ryte saulė teka rytuose. Jei ji už nugaros, žiūri priešinga kryptimi – į vakarus."]
    ],
    opp: dir => `Kuri kryptis yra priešinga krypčiai „${dir}“?`,
    oppWalk: dir => `Eini į ${dir}, tada apsisuki ir eini atgal. Kuria kryptimi eini dabar?`,
    scaleName: m => `1 cm – ${m}`,
    ruler: (scale, a, b) => `Mastelis: ${scale}. Liniuotė pridėta nuo ${a} iki ${b}. Koks tikrasis atstumas?`,
    num2real: (scale) => `Mastelis ${scale}. Kiek tikrovėje atitinka 1 cm žemėlapyje?`,
    name2num: (name) => `Vardinis mastelis: ${name}. Koks tai skaitinis mastelis?`,
    calc: (scale, cm) => `Mastelis ${scale}. Žemėlapyje atstumas ${cm}. Koks tikrasis atstumas?`,
    real2map: (scale, real) => `Mastelis ${scale}. Tikrovėje atstumas ${real}. Kiek centimetrų jis užims žemėlapyje?`,
    bar: (a, b) => `Linijinis mastelis rodo atstumą kilometrais. Koks atstumas tikrovėje nuo ${a} iki ${b}?`,
    cmp: (s1, s2, real) => `Tą patį ${real} ilgio kelią nubraižome dviejuose žemėlapiuose: ${s1} ir ${s2}. Kuriame žemėlapyje jis atrodys ilgesnis?`,
    cmpEq: "Vienodai",
    city2coord: city => `Raudonas taškas rodo miestą ${city}. Kokios apytikslės jo geografinės koordinatės?`,
    coord2city: c => `Kuris miestas yra apytiksliai ties ${c}?`,
    pt2coord: "Kokios raudonu tašku pažymėtos vietos geografinės koordinatės?",
    coord2pt: c => `Kuris taškas yra ties ${c}?`,
    hemi: "Kuriuose pusrutuliuose yra raudonas taškas? (Pusiaujas ir nulinis dienovidinis nubraižyti storiau.)",
    eq: "Kuri linija yra pusiaujas?",
    prime: "Kuri linija yra nulinis (Grinvičo) dienovidinis?",
    concept: [
      ["Kurios linijos žemėlapyje rodo geografinę platumą?", ["Lygiagretės", "Dienovidiniai"], 0, "Platumą rodo lygiagretės – linijos, einančios lygiagrečiai pusiaujui (iš vakarų į rytus)."],
      ["Kurios linijos žemėlapyje rodo geografinę ilgumą?", ["Dienovidiniai", "Lygiagretės"], 0, "Ilgumą rodo dienovidiniai – linijos, jungiančios Šiaurės ir Pietų ašigalius."],
      ["Lygiagretės eina…", ["iš vakarų į rytus", "iš šiaurės į pietus"], 0, "Lygiagretės lygiagrečios pusiaujui, todėl eina iš vakarų į rytus."],
      ["Dienovidiniai jungia…", ["Šiaurės ir Pietų ašigalius", "Rytus ir Vakarus"], 0, "Dienovidinis – linija, einanti iš vieno ašigalio į kitą."],
      ["Nuo kurios linijos skaičiuojama geografinė platuma?", ["Nuo pusiaujo", "Nuo nulinio (Grinvičo) dienovidinio", "Nuo Šiaurės ašigalio"], 0, "Platuma skaičiuojama nuo pusiaujo (0°) iki ašigalių (90°)."],
      ["Nuo kurios linijos skaičiuojama geografinė ilguma?", ["Nuo nulinio (Grinvičo) dienovidinio", "Nuo pusiaujo", "Nuo Pietų ašigalio"], 0, "Ilguma skaičiuojama nuo nulinio (Grinvičo) dienovidinio į rytus ir į vakarus."],
      ["Kokia pusiaujo geografinė platuma?", ["0°", "45°", "90°"], 0, "Pusiaujas yra 0° platumos lygiagretė."],
      ["Kokia nulinio (Grinvičo) dienovidinio geografinė ilguma?", ["0°", "90°", "180°"], 0, "Nulinis dienovidinis – tai 0° ilgumos linija."],
      ["Kokia Šiaurės ašigalio geografinė platuma?", ["90° š. pl.", "0°", "90° p. pl."], 0, "Šiaurės ašigalis yra 90° šiaurės platumos."],
      ["Žemėje yra du pusrutuliai pagal pusiaują. Jie vadinami…", ["Šiaurės ir Pietų pusrutuliais", "Rytų ir Vakarų pusrutuliais"], 0, "Pusiaujas Žemę dalija į Šiaurės ir Pietų pusrutulius."]
    ]
  },
  hemiOpts: ["Šiaurės ir Rytų", "Šiaurės ir Vakarų", "Pietų ir Rytų", "Pietų ir Vakarų"],
  hemiLoc: { eurazija: "Eurazijoje", afrika: "Afrikoje", s_amerika: "Šiaurės Amerikoje", p_amerika: "Pietų Amerikoje", australija: "Australijoje" },
  unitCm: n => `${String(n).replace(".", ",")} cm`,
  coord: (lat, lon) => {
    const la = lat === 0 ? "0° pl." : `${Math.abs(lat)}° ${lat > 0 ? "š." : "p."} pl.`;
    const lo = lon === 0 ? "0° ilg." : `${Math.abs(lon)}° ${lon > 0 ? "r." : "v."} ilg.`;
    return `${la}, ${lo}`;
  },
  axisLat: v => v === 0 ? "0°" : `${Math.abs(v)}°${v > 0 ? "Š" : "P"}`,
  axisLon: v => v === 0 || Math.abs(v) === 180 ? `${Math.abs(v)}°` : `${Math.abs(v)}°${v > 0 ? "R" : "V"}`,
  axisLegend: "Š – šiaurės, P – pietų platuma; R – rytų, V – vakarų ilguma",
  rulerNote: "Liniuotės padalos – centimetrai",
  barKm: "km",
  ex: {
    dirmap: (north, b, a, dir) => north
      ? `Šiaurė – žemėlapio viršuje (rodyklė Š). ${b} yra ${dir} kryptimi nuo ${a}.`
      : `Rodyklė Š rodo ne aukštyn, todėl pasuk žemėlapį mintyse, kad ji rodytų aukštyn. Tada ${b} yra ${dir} kryptimi nuo ${a}.`,
    dirmapRot: sd => `Šiaurės rodyklė čia rodo ${sd}.`,
    turn: (cw, ang, seq, res) => `${cw ? "Pagal laikrodžio rodyklę" : "Prieš laikrodžio rodyklę"} kryptys keičiasi taip: ${seq}. Kiekvienas 45° posūkis – į gretimą kryptį, todėl ${ang}° posūkis (${ang / 45} × 45°) nuveda į ${res}.`,
    needle: res => `Mintyse pasuk kompasą taip, kad raudona rodyklė rodytų aukštyn (šiaurė). Juoda rodyklė tada rodys į ${res}.`,
    hands: (f, part, res) => `Veidu žiūri į ${f}. ${part === "right" ? "Dešinė ranka – 90° pagal laikrodžio rodyklę nuo veido krypties" : part === "left" ? "Kairė ranka – 90° prieš laikrodžio rodyklę nuo veido krypties" : "Nugara – priešinga kryptis (180°)"} – tai ${res}.`,
    opp: (dir, res) => `Priešingos kryptys yra poros: šiaurė–pietūs, rytai–vakarai, šiaurės rytai–pietvakariai, šiaurės vakarai–pietryčiai. Priešinga krypčiai „${dir}“ yra ${res}.`,
    ruler: (cm, scale, per, real) => `Liniuotė rodo ${cm}. ${scale}: 1 cm žemėlapyje atitinka ${per} tikrovėje. ${cm} × ${per} = ${real}.`,
    rulerNum: (n, per) => `${n} reiškia, kad 1 cm žemėlapyje atitinka ${n.replace("1 : ", "")} cm tikrovėje, t. y. ${per}.`,
    num2real: (n, per) => `${n}: 1 cm žemėlapyje = ${n.replace("1 : ", "")} cm tikrovėje. 100 cm = 1 m, 100 000 cm = 1 km. Tad 1 cm atitinka ${per}.`,
    name2num: (name, num) => `${name} – tai 1 cm žemėlapyje = ${name.replace("1 cm – ", "")} tikrovėje. Verčiame į centimetrus: gauname ${num}.`,
    calc: (cm, per, real) => `${cm} × ${per} = ${real}.`,
    real2map: (real, per, cm) => `Žemėlapyje 1 cm atitinka ${per}. Tikrovės atstumą ${real} dalijame iš ${per}: gauname ${cm}.`,
    bar: (k, unit, real) => `Atstumas yra ${k} ilgio vienetų, kurių kiekvienas atitinka ${unit}. ${k} × ${unit} = ${real}.`,
    cmp: (s1, c1, s2, c2) => `Kuo mažesnis skaičius po dvitaškio, tuo daugiau detalių ir ilgesnis atstumas. ${s1}: kelias užima ${c1}; ${s2}: ${c2}.`,
    city2coord: (city, lat, lon) => `${city}: ${lat}, ${lon} (apytiksliai). Platumą skaitome iš kairiojo krašto – kiek laipsnių nuo pusiaujo ir į kurią pusę (š. ar p.), ilgumą – iš apatinio krašto (r. ar v. nuo nulinio dienovidinio).`,
    coord2city: (city, c) => `Ties ${c} yra ${city}. Raskite lygiagretę (platumą) ir dienovidinį (ilgumą) – ten, kur jos susikerta, ir yra miestas.`,
    pt2coord: (c, loc) => `Taškas yra ties ${c}${loc ? " – " + loc : ""}. Platumą rodo lygiagretė (kairėje pažymėtas skaičius), ilgumą – dienovidinis (apačioje).`,
    coord2pt: (c, l) => `Taškas ${l} yra ties ${c}: ten susikerta ta lygiagretė ir tas dienovidinis. Kiti taškai sutampa tik pagal vieną koordinatę.`,
    hemi: (lat, lon, loc) => `${loc ? "Taškas yra " + loc + ". " : ""}Jis ${lat > 0 ? "virš pusiaujo – Šiaurės" : "žemiau pusiaujo – Pietų"} pusrutulyje ir ${lon > 0 ? "į rytus nuo nulinio dienovidinio – Rytų" : "į vakarus nuo nulinio dienovidinio – Vakarų"} pusrutulyje.`,
    eq: "Pusiaujas – 0° platumos lygiagretė, einanti per Žemės vidurį iš vakarų į rytus.",
    prime: "Nulinis (Grinvičo) dienovidinis – 0° ilgumos linija, einanti iš Šiaurės ašigalio į Pietų ašigalį per Grinvičą (Londone)."
  },
  hint: {
    dirmap: "Pirma suraskite šiaurės rodyklę Š, tada pažiūrėkite, kaip nuo pirmos vietos reikia eiti iki antros.",
    turn: "Pasisukime žingsnis po žingsnio: kiekvienas 45° posūkis – gretima kryptis.",
    needle: "Įsivaizduok, kad pasuki kompasą, kol raudona rodyklė rodo aukštyn.",
    hands: "Ištiesk dešinę ranką – ji 90° pagal laikrodžio rodyklę nuo veido krypties.",
    sun: "Prisimink, kur saulė teka, kur būna vidurdienį ir kur leidžiasi.",
    opp: "Priešinga kryptis – tiksliai priešingoje pusėje, kaip ant kompaso rožės.",
    ruler: "Pirma nuskaityk atstumą liniuote (cm), tada padaugink iš to, ką reiškia 1 cm.",
    conv: "Prisimink: 1 m = 100 cm, 1 km = 100 000 cm.",
    real2map: "Atstumą tikrovėje reikia padalyti iš to, ką reiškia 1 cm.",
    bar: "Žiūrėk, kuriame ilgumos padale baigiasi atstumas, ir kiek kilometrų atitinka vienas padalas.",
    cmp: "Apskaičiuok, kiek centimetrų užima kelias kiekviename žemėlapyje.",
    coord: "Pirma nustatyk platumą (kairėje) – kiek laipsnių ir š. ar p.; tada ilgumą (apačioje) – r. ar v.",
    hemi: "Žiūrėk, ar taškas virš ar žemiau pusiaujo ir ar į rytus ar į vakarus nuo nulinio dienovidinio.",
    lines: "Pusiaujas – 0° platuma, o nulinis dienovidinis – 0° ilguma. Raskite linijas su 0°.",
    concept: "Pagalvok, ką reiškia lygiagretė ir dienovidinis."
  },
  rule: "Taisyklė",
  next: "Toliau →",
  results: "Rezultatai",
  okHead: (praise, pts) => `${praise} +${pts}`,
  retryHead: "Dar ne visai – pabandyk dar kartą.",
  failHead: "Šįkart nepavyko – štai kaip.",
  resTitle: (ok, n) => `${ok} iš ${n} iš pirmo karto`,
  resText: (p, flag) => `${p} ${p % 10 === 1 && p % 100 !== 11 ? "taškas" : p % 10 >= 2 && (p % 100 < 10 || p % 100 > 20) ? "taškai" : "taškų"}.` + (flag ? ` Nauja vėliavėlė: ${flag}!` : ""),
  flagsTitle: "Mano ekspedicijos žemėlapis",
  flags: ["Europa", "Azija", "Afrika", "Šiaurės Amerika", "Pietų Amerika", "Australija ir Okeanija", "Antarktida"],
  flagNeed: [6, 18, 36, 60, 90, 130, 180],
  flagsText: (n, left, nextName) => left > 0
    ? `Iš pirmo karto teisingų atsakymų: ${n}. Dar ${left} – ir ${nextName} bus pasodinta vėliavėlė.`
    : `Iš pirmo karto teisingų atsakymų: ${n}. Visi žemynai aplankyti – puiki ekspedicija!`,
  locked: "dar neaplankyta",
  learn: [
    { name: "Pasaulio kryptys", level: 0, html: `<p>Kryptys, kurias rodo kompasas, vadinamos <b>pasaulio kryptimis</b> (horizonto kryptimis). Pagrindinės keturios: <b>šiaurė, rytai, pietūs, vakarai</b>. Tarp jų yra dar keturios: <b>šiaurės rytai, pietryčiai, pietvakariai, šiaurės vakarai</b>.</p>
      <p>Kompaso rodyklė (raudona) visada rodo <b>šiaurę</b>. Žemėlapyje šiaurė paprastai būna viršuje, o rytai – dešinėje. Bet jei žemėlapyje nupiešta rodyklė <b>Š</b>, visada žiūrėk į ją!</p>
      <p>Priešingos kryptys: šiaurė–pietūs, rytai–vakarai, šiaurės rytai–pietvakariai, šiaurės vakarai–pietryčiai. Saulė teka maždaug rytuose, vidurdienį būna pietuose, o leidžiasi maždaug vakaruose.</p>` },
    { name: "Mastelis ir atstumai", level: 1, html: `<p><b>Mastelis</b> parodo, kiek kartų tikrovė sumažinta žemėlapyje. Jį galima užrašyti trimis būdais:</p>
      <p>• <b>skaitiniu</b>: 1 : 100 000 – 1 cm žemėlapyje atitinka 100 000 cm tikrovėje, t. y. 1 km;<br>• <b>vardiniu</b>: „1 cm – 1 km“;<br>• <b>linijiniu</b>: nubraižyta linija su kilometrų padalomis.</p>
      <p>Atstumą žemėlapyje išmatuok liniuote (cm) ir padaugink iš to, ką reiškia 1 cm: <b>tikrasis atstumas = atstumas žemėlapyje × mastelis</b>. Pavyzdys: 3 cm, o 1 cm – 2 km → 3 × 2 = 6 km.</p>
      <p>Perskaičiuoti padeda: 1 m = 100 cm, 1 km = 100 000 cm. Kuo mažesnis skaičius po dvitaškio (pvz., 1 : 10 000), tuo daugiau detalių ir tuo ilgesnis tas pats atstumas žemėlapyje.</p>` },
    { name: "Geografinės koordinatės", level: 2, html: `<p>Vietos padėtį Žemėje nusako <b>geografinės koordinatės</b>: <b>geografinė platuma</b> ir <b>geografinė ilguma</b>. Jos matuojamos laipsniais.</p>
      <p><b>Platuma</b> rodo, kiek laipsnių vieta nutolusi nuo <b>pusiaujo</b> į šiaurę (<b>š. pl.</b>) arba į pietus (<b>p. pl.</b>). Ji nuo 0° (pusiaujas) iki 90° (ašigaliai).</p>
      <p><b>Ilguma</b> rodo, kiek laipsnių vieta nutolusi nuo <b>nulinio (Grinvičo) dienovidinio</b> į rytus (<b>r. ilg.</b>) arba į vakarus (<b>v. ilg.</b>). Ji nuo 0° iki 180°.</p>
      <p>Pavyzdys: Vilnius – apie 55° š. pl., 25° r. ilg. Platumą visada rašome pirma.</p>` },
    { name: "Lygiagretės ir dienovidiniai", level: 2, html: `<p>Žemėlapyje nubraižytos linijos sudaro <b>geografinį tinklą</b>.</p>
      <p><b>Lygiagretės</b> – linijos, einančios lygiagrečiai pusiaujui, iš vakarų į rytus. Jos rodo <b>platumą</b>. Ilgiausia lygiagretė – <b>pusiaujas</b> (0°).</p>
      <p><b>Dienovidiniai</b> – linijos, jungiančios <b>Šiaurės ir Pietų ašigalius</b>. Jie rodo <b>ilgumą</b>. Pagrindinis dienovidinis – <b>nulinis (Grinvičo)</b>.</p>
      <p>Pusiaujas Žemę dalija į <b>Šiaurės ir Pietų pusrutulius</b>. Nulinis dienovidinis kartu su 180° dienovidiniu – į <b>Rytų ir Vakarų pusrutulius</b>.</p>` }
  ]
};
