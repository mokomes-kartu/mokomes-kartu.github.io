/* Grafikų pilotas – visi mokiniui rodomi tekstai (lietuvių k.). Verčiant keisti tik šį failą.
   Terminai – pagal Matematikos bendrąją programą (e-seimas.lrs.lt), 10 ir II gimnazijos klasė, „Tiesinė ir kvadratinė funkcijos“:
   „tiesės krypties koeficientas k, postūmio koeficientas b“; „braižomi jos grafiko (parabolės) eskizai“; grafikų transformacijos;
   8 kl. „Tiesinis sąryšis“ (lentelės, grafikas). */
(function(){
"use strict";
const nf = x => { const v = Math.round(x * 1000) / 1000; return (v < 0 ? "−" : "") + String(Math.abs(v)).replace(".", ","); };
const np = x => x < 0 ? `(${nf(x)})` : nf(x);   // neigiamas skaičius skliaustuose
const sqm = m => m === 0 ? "x²" : `(x ${m < 0 ? "+" : "−"} ${nf(Math.abs(m))})²`;
const cn = n => n === 0 ? "" : n < 0 ? ` − ${nf(-n)}` : ` + ${nf(n)}`;
const pt = (x, y) => `(${nf(x)}; ${nf(y)})`;
const vnt = s => s === 1 ? "vienetu" : "vienetais";
const gt = v => v > 0 ? "&gt;" : "&lt;";
const wKb = (x1, y1, x2, y2, k, b) => `k = (y₂ − y₁) : (x₂ − x₁) = (${nf(y2)} − ${np(y1)}) : (${nf(x2)} − ${np(x1)}) = <b>${nf(k)}</b>.<br>b = y₁ − k · x₁ = ${nf(y1)} − ${np(k)} · ${np(x1)} = <b>${nf(b)}</b>.`;
const wPar3b = (x1, y1, x3, y3, m, a, n) => `Įstatome abu taškus į y = a${sqm(m)} + n: ${nf(y1)} = ${nf((x1 - m) * (x1 - m))}a + n ir ${nf(y3)} = ${nf((x3 - m) * (x3 - m))}a + n. Atėmę gauname a = <b>${nf(a)}</b>, tada n = <b>${nf(n)}</b>.`;
const HID = "Švyturiai paslėpti – jie pasirodys, kai zondas pro juos praskris.";
window.MK_T = {
  nf, pt,
  title: "Grafikų pilotas",
  heroA: "Grafikų", heroB: "pilotas",
  hero: "Zondas skrenda tiksliai funkcijos grafiku. Apskaičiuok koeficientus, kad jis surinktų visus švyturius ir aplenktų asteroidus. Pirmiausia skaičiuok, tada leisk!",
  levels: [
    ["Tiesinė funkcija", "k ir b, lentelė, tekstinis uždavinys"],
    ["Tiesė per švyturius", "Du taškai, ašys, lygiagreti, susikirtimas, postūmis"],
    ["Grafikų skaitymas", "Lygtis ↔ grafikas, koeficientų ženklai"],
    ["Parabolės trasa", "y = a(x − m)² + n, nuliai, transformacijos"],
    ["Pilotų egzaminas", "10 skirtingų užduočių tipų"]
  ],
  mapH: "Žvaigždėlapis",
  mapP: (n, m, r) => n >= m ? `Visas žvaigždynas užsidegė! Tavo laipsnis – ${r}.` : `Uždegta ${n} iš ${m} žvaigždžių. Laipsnis: ${r}. Kiekviena užduotis, išspręsta iš pirmo ar antro karto, uždega žvaigždę.`,
  mapEmpty: "Žvaigždynas dar tamsus – išspręsk pirmąją užduotį.",
  ranks: ["Kadetas", "Pilotas", "Navigatorius", "Kapitonas", "Admirolas"],
  pts: "Taškai",
  next: "Toliau", finish: "Baigti",
  why: "Kaip apskaičiuoti?",
  launch: "Leisti zondą", tries: n => `Liko bandymų: ${n}`,
  /* užduočių sąlygos */
  goalLine: "Nustatyk koeficientus taip, kad zondas praskristų pro visus švyturius.",
  goalK: b => `Trasa kerta y ašį taške (0; ${nf(b)}), todėl b = ${nf(b)}. Rask krypties koeficientą k.`,
  goalKpt: k => `Trasos krypties koeficientas k = ${nf(k)}. Rask b, kad zondas praskristų pro švyturį.`,
  goalTable: `Trasa pateikta lentele. Rask jos lygtį y = kx + b. ${HID}`,
  goalWord: (t, xy) => `${t}<small>${xy}. Užrašyk šią priklausomybę lygtimi y = kx + b. ${HID}</small>`,
  goalAxes: (p, q) => `Trasa turi kirsti x ašį taške ${pt(p, 0)}, o y ašį – taške ${pt(0, q)}.`,
  goalPara: c => `Senoji trasa: ${c}. Naujoji turi būti jai lygiagreti ir eiti pro švyturį.`,
  goalInter: (e1, e2) => `Senųjų trasų ${e1} ir ${e2} susikirtimo taške paslėptas švyturys. Naujoji trasa turi eiti pro jį ir pro matomą švyturį.`,
  goalShift: (e, d) => `Senoji trasa: ${e}. Naujoji – ta pati, tik ${d}. ${HID}`,
  goalPar: "Nustatyk a, m ir n taip, kad parabolė eitų pro visus švyturius. Vienas švyturys paslėptas.",
  goalPar3: "Nustatyk a, m ir n. Viršūnės švyturio nėra – pasinaudok parabolės simetrija.",
  goalRoots: "Parabolė turi kirsti x ašį dviejuose švyturiuose ir eiti pro trečią. Rask a, m ir n.",
  goalStd: e => `Trasos lygtis: ${e}. Užrašyk ją pavidalu y = a(x − m)² + n. ${HID}`,
  goalMC: "Zondas jau skrenda šia tiese. Kokia jos lygtis?",
  goalParMC: "Zondas jau skrenda šia parabole. Kokia jos lygtis?",
  goalMCG: e => `Kuris grafikas yra funkcijos <b>${e}</b> grafikas?`,
  goalSignL: "Kokie šios tiesės y = kx + b koeficientų k ir b ženklai?",
  goalSignP: "Parabolė y = a(x − m)² + n. Kokie koeficiento a ir viršūnės ordinatės n ženklai?",
  signL: ["k &gt; 0, b &gt; 0", "k &gt; 0, b &lt; 0", "k &lt; 0, b &gt; 0", "k &lt; 0, b &lt; 0"],
  signP: ["a &gt; 0, n &gt; 0", "a &gt; 0, n &lt; 0", "a &lt; 0, n &gt; 0", "a &lt; 0, n &lt; 0"],
  /* postūmių aprašai */
  shift: (dx, dy) => "pastumta " + [dx ? `${Math.abs(dx)} ${vnt(Math.abs(dx))} ${dx > 0 ? "į dešinę" : "į kairę"}` : "", dy ? `${Math.abs(dy)} ${vnt(Math.abs(dy))} ${dy > 0 ? "aukštyn" : "žemyn"}` : ""].filter(Boolean).join(" ir "),
  flip: "atspindėta simetriškai x ašies atžvilgiu",
  stretch: "visos jos y reikšmės padaugintos iš 2",
  /* žodiniai uždaviniai: b ir k ribos, sąlyga, x ir y reikšmė */
  words: [
    { b: [3, 6], k: [-0.5, -1, -1.5, -2], t: (b, k) => `Bake yra ${nf(b)} m³ vandens. Atsukus čiaupą, kas valandą išteka po ${nf(-k)} m³.`, xy: "x – laikas valandomis, y – vandens kiekis bake (m³)" },
    { b: [4, 6], k: [-0.5, -1], t: (b, k) => `Uždegtos žvakės aukštis – ${nf(b)} cm. Kas valandą ji sutrumpėja ${nf(-k)} cm.`, xy: "x – laikas valandomis, y – žvakės aukštis (cm)" },
    { b: [1, 3], k: [0.5, 1], t: (b, k) => `Taupyklėje yra ${nf(b)} €. Kas savaitę Ugnė įdeda dar po ${nf(k)} €.`, xy: "x – savaičių skaičius, y – pinigų suma (€)" },
    { b: [-5, -1], k: [0.5, 1, 1.5, 2], t: (b, k) => `Ankstų rytą oro temperatūra buvo ${nf(b)} °C. Kas valandą ji pakildavo ${nf(k)} °C.`, xy: "x – valandų skaičius nuo ryto, y – temperatūra (°C)" },
    { b: [-6, -3], k: [0.5, 1, 1.5], t: (b, k) => `Naras yra ${nf(-b)} m gylyje. Jis kyla į paviršių po ${nf(k)} m per minutę.`, xy: "x – laikas minutėmis, y – naro padėtis metrais (vandens paviršius – 0, gylis – neigiamas)" },
    { b: [1, 3], k: [0.5, 1], t: (b, k) => `Pupelės daigo aukštis – ${nf(b)} cm. Kas parą jis paauga ${nf(k)} cm.`, xy: "x – parų skaičius, y – daigo aukštis (cm)" },
    { b: [4, 6], k: [-1, -1.5, -2], t: (b, k) => `Dronas skrenda ${nf(b)} m aukštyje ir kas sekundę nusileidžia ${nf(-k)} m.`, xy: "x – laikas sekundėmis, y – drono aukštis (m)" },
    { b: [1, 5], k: [-1, -1.5, -2], t: (b, k) => `Vakare lauke buvo ${nf(b)} °C. Kas valandą temperatūra nukrisdavo ${nf(-k)} °C.`, xy: "x – valandų skaičius nuo vakaro, y – temperatūra (°C)" },
    { b: [-4, -1], k: [1, 2], t: (b, k) => `Šaldiklyje buvo ${nf(b)} °C. Jį išjungus, temperatūra kas valandą pakildavo ${nf(k)} °C.`, xy: "x – laikas valandomis, y – temperatūra (°C)" }
  ],
  oldRoute: "senoji trasa",
  res: {
    ok: "Visi švyturiai surinkti!",
    miss: (p) => `Zondas nepataikė į švyturį ${p}.`,
    missHid: "Zondas nepataikė į paslėptą švyturį.",
    crash: "Zondas atsitrenkė į asteroidą!",
    last: "Bandymai baigėsi. Žiūrėk paaiškinimą."
  },
  ok: ["Tiksliai!", "Puikus skrydis!", "Teisingai!", "Šaunu!"],
  bad: "Ne visai.",
  res2: (ok, n, pts) => `Išspręsta iš pirmo ar antro karto: ${ok} iš ${n}. Taškai: ${pts}.`,
  newStars: n => `Uždegta naujų žvaigždžių: ${n}.`,
  /* paaiškinimai */
  wK: (x, y, b, k) => `Taškas ${pt(x, y)} yra tiesėje, todėl ${nf(y)} = k · ${np(x)} + ${np(b)}. Iš čia k = (${nf(y)} − ${np(b)}) : ${np(x)} = <b>${nf(k)}</b>.`,
  wKpt: (k, x, y, b) => `Įstatome švyturį į y = ${k === 1 ? "" : k === -1 ? "−" : nf(k)}x + b: ${nf(y)} = ${np(k)} · ${np(x)} + b, todėl b = ${nf(y)} − ${np(k)} · ${np(x)} = <b>${nf(b)}</b>.`,
  wKb,
  wTable: (x1, y1, x2, y2, k, b) => `Paimkime du lentelės stulpelius ${pt(x1, y1)} ir ${pt(x2, y2)}.<br>` + wKb(x1, y1, x2, y2, k, b),
  wWord: (b, k) => `Pradinė reikšmė (kai x = 0) yra b = <b>${nf(b)}</b>. Kas vieną x vienetą y ${k > 0 ? "padidėja" : "sumažėja"} ${nf(Math.abs(k))}, todėl k = <b>${nf(k)}</b>${k < 0 ? " (dydis mažėja – k neigiamas)" : ""}.`,
  wAxes: (p, q, k) => `Taškas ${pt(0, q)} yra y ašyje, todėl b = <b>${nf(q)}</b>. Įstatome ${pt(p, 0)}: 0 = k · ${np(p)} + ${np(q)}, todėl k = ${nf(-q)} : ${np(p)} = <b>${nf(k)}</b>.`,
  wPara: (k, x, y, b) => `Lygiagrečių tiesių krypties koeficientai lygūs, todėl k = <b>${nf(k)}</b>. Tada b = ${nf(y)} − ${np(k)} · ${np(x)} = <b>${nf(b)}</b>.`,
  wInter: (r1, r2, k1, b1, k2, b2, xi, yi) => `Susikirtimo taške y reikšmės lygios: ${r1} = ${r2}. Iš čia x = (${nf(b2)} − ${np(b1)}) : (${nf(k1)} − ${np(k2)}) = ${nf(xi)}, y = ${nf(yi)}. Paslėptas švyturys – taške ${pt(xi, yi)}.`,
  wShiftY: (b0, dy, b, k) => `Postūmis išilgai y ašies keičia tik b: b = ${nf(b0)} ${dy > 0 ? "+" : "−"} ${nf(Math.abs(dy))} = <b>${nf(b)}</b>. Krypties koeficientas nesikeičia: k = <b>${nf(k)}</b>.`,
  wShiftX: (expr, k, b) => `Pastumiant tiesę išilgai x ašies, x pakeičiamas: ${expr}. Taigi k = <b>${nf(k)}</b> (nesikeičia), b = <b>${nf(b)}</b>.`,
  wFlip: (e0, e) => `Atspindint x ašies atžvilgiu, visos y reikšmės keičia ženklą: y = −(${e0}) = ${e}.`,
  wStretch: (e0, e) => `Padauginus visas y reikšmes iš 2: y = 2 · (${e0}) = ${e}.`,
  wPShift: (m0, dx, m, n0, dy, n, a) => [dx ? `Postūmis išilgai x ašies keičia m: m = ${nf(m0)} ${dx > 0 ? "+" : "−"} ${nf(Math.abs(dx))} = <b>${nf(m)}</b>.` : `m nesikeičia: m = <b>${nf(m)}</b>.`, dy ? `Postūmis išilgai y ašies keičia n: n = ${nf(n0)} ${dy > 0 ? "+" : "−"} ${nf(Math.abs(dy))} = <b>${nf(n)}</b>.` : `n nesikeičia: n = <b>${nf(n)}</b>.`, `a nesikeičia: a = <b>${nf(a)}</b>.`].join("<br>"),
  wParams: (a, m, n) => `Taigi a = <b>${nf(a)}</b>, m = <b>${nf(m)}</b>, n = <b>${nf(n)}</b>.`,
  wPar: (m, n, x, y, a) => `Viršūnė ${pt(m, n)}, todėl y = a${sqm(m)}${cn(n)}. Įstatome švyturį ${pt(x, y)}: ${nf(y)} = a · ${nf((x - m) * (x - m))}${cn(n)}, todėl a = <b>${nf(a)}</b>.`,
  wPar3: (x1, x2, y, m) => `Švyturiai ${pt(x1, y)} ir ${pt(x2, y)} turi vienodą y reikšmę, todėl jie simetriški parabolės ašies atžvilgiu: m = (${nf(x1)} + ${np(x2)}) : 2 = <b>${nf(m)}</b>.`,
  wPar3b,
  wRoots: (x1, x2, m) => `Nuliai ${nf(x1)} ir ${nf(x2)} simetriški parabolės ašies atžvilgiu: m = (${nf(x1)} + ${np(x2)}) : 2 = <b>${nf(m)}</b>.`,
  wStd: (a, B, m, n) => `Parabolės y = ax² + bx + c viršūnės abscisė m = −b : (2a) = ${nf(-B)} : ${np(2 * a)} = <b>${nf(m)}</b>. Viršūnės ordinatė – funkcijos reikšmė, kai x = ${nf(m)}: n = <b>${nf(n)}</b>. Koeficientas prie x² nesikeičia: a = <b>${nf(a)}</b>.`,
  wMCGL: (k, b) => `Kai x = 0, y = ${nf(b)} – tiesė kerta y ašį taške ${pt(0, b)}. Kadangi k = ${nf(k)} ${gt(k)} 0, tiesė ${k > 0 ? "kyla" : "leidžiasi"}: x padidėjus 1, y ${k > 0 ? "padidėja" : "sumažėja"} ${nf(Math.abs(k))}.`,
  wMCGP: (a, m, n) => `Viršūnė – taške ${pt(m, n)}. Kadangi a = ${nf(a)} ${gt(a)} 0, šakos nukreiptos ${a > 0 ? "aukštyn" : "žemyn"}${Math.abs(a) > 1 ? ", parabolė siauresnė už y = x²" : Math.abs(a) < 1 ? ", parabolė platesnė už y = x²" : ""}.`,
  wSignL: (k, b) => `Tiesė ${k > 0 ? "kyla" : "leidžiasi"} (žiūrint iš kairės į dešinę), todėl k ${gt(k)} 0. Ji kerta y ašį ${b > 0 ? "virš" : "žemiau"} koordinačių pradžios, todėl b ${gt(b)} 0.`,
  wSignP: (a, n) => `Šakos nukreiptos ${a > 0 ? "aukštyn" : "žemyn"}, todėl a ${gt(a)} 0. Viršūnė yra ${n > 0 ? "virš" : "žemiau"} x ašies, todėl n ${gt(n)} 0.`,
  wAns: s => `Teisinga trasa: <b>${s}</b>.`,
  wMC: "Iš grafiko perskaityk du taškus su sveikomis koordinatėmis, apskaičiuok k = (y₂ − y₁) : (x₂ − x₁), o b – taške, kur tiesė kerta y ašį.",
  tipK: "Jei k > 0, tiesė kyla (iš kairės į dešinę), jei k < 0 – leidžiasi. Kuo |k| didesnis, tuo tiesė statesnė.",
  tipB: "b – tai y reikšmė, kai x = 0, t. y. taškas, kuriame tiesė kerta y ašį.",
  tipA: "Jei a > 0, parabolės šakos nukreiptos aukštyn, jei a < 0 – žemyn. Kuo |a| didesnis, tuo parabolė siauresnė.",
  tipMN: "Grafikas y = a(x − m)² + n gaunamas iš y = ax²: pastumiamas m vienetų išilgai x ašies ir n vienetų išilgai y ašies. Viršūnė – taške (m; n).",
  tipShift: "Grafiką y = f(x) pastūmus a vienetų į dešinę, gaunama y = f(x − a); pastūmus b vienetų aukštyn – y = f(x) + b. Atspindint x ašies atžvilgiu – y = −f(x).",
  tipStd: "Išskleidus y = a(x − m)² + n gaunama y = ax² − 2amx + am² + n, todėl b = −2am, iš čia m = −b : (2a).",
  learn: [
    { name: "Tiesinė funkcija y = kx + b", level: 0, html: `<p>Tiesinės funkcijos grafikas – tiesė. <b>k</b> – tiesės krypties koeficientas, <b>b</b> – postūmio koeficientas.</p>
      <ul><li>k &gt; 0 – tiesė kyla, k &lt; 0 – leidžiasi, k = 0 – tiesė lygiagreti x ašiai.</li><li>Kuo |k| didesnis, tuo tiesė statesnė.</li><li>b – taškas (0; b), kuriame tiesė kerta y ašį.</li></ul>
      <span class="mk-ex">y = 2x − 3: kai x = 0, y = −3; x padidėjus 1, y padidėja 2.</span>` },
    { name: "Lentelė ir tekstinis uždavinys", level: 0, html: `<p>Jei lentelėje x kas kartą padidėja vienodai ir y kas kartą pakinta vienodai, tai tiesinė priklausomybė.</p>
      <span class="mk-ex">x: 0, 1, 2, 3 → y: 5, 3, 1, −1. b = 5 (kai x = 0), k = −2 (x padidėjus 1, y sumažėja 2): y = −2x + 5</span>
      <p>Tekstiniame uždavinyje <b>b</b> – pradinė reikšmė (kai x = 0), o <b>k</b> – pokytis per vieną x vienetą (mažėjant – neigiamas).</p>` },
    { name: "Tiesė per du taškus", level: 1, html: `<p>Jei tiesė eina pro taškus (x₁; y₁) ir (x₂; y₂), tai</p>
      <span class="mk-ex">k = (y₂ − y₁) : (x₂ − x₁),&nbsp;&nbsp; b = y₁ − k · x₁</span>
      <p>Pavyzdys: (1; 1) ir (3; 5). k = (5 − 1) : (3 − 1) = 2, b = 1 − 2 · 1 = −1, todėl y = 2x − 1.</p>
      <p>Jei tiesė kerta y ašį taške (0; q), tai iškart b = q.</p>` },
    { name: "Lygiagrečios ir susikertančios tiesės", level: 1, html: `<p><b>Lygiagrečių tiesių</b> krypties koeficientai lygūs: y = 2x + 1 ir y = 2x − 4 yra lygiagrečios.</p>
      <p><b>Susikirtimo taškas</b>: sulygink dešiniąsias puses.</p>
      <span class="mk-ex">2x + 1 = −x + 7 → 3x = 6 → x = 2, y = 5. Taškas (2; 5).</span>` },
    { name: "Grafiko postūmiai ir atspindys", level: 1, html: `<ul><li>y = f(x) + b – grafikas pastumiamas b vienetų aukštyn (jei b &lt; 0 – žemyn);</li><li>y = f(x − a) – grafikas pastumiamas a vienetų į dešinę (jei a &lt; 0 – į kairę);</li><li>y = −f(x) – grafikas atspindimas x ašies atžvilgiu.</li></ul>
      <span class="mk-ex">y = 2x + 1 pastūmus 3 į dešinę: y = 2(x − 3) + 1 = 2x − 5</span>` },
    { name: "Lygtis iš grafiko", level: 2, html: `<p>Tiesei: rask tašką, kur tiesė kerta y ašį (tai b), ir dar vieną tašką su sveikomis koordinatėmis. Tada k = y pokytis : x pokyčio.</p>
      <p>Parabolei: rask viršūnę (m; n) ir dar vieną tašką – iš jo apskaičiuok a. Šakos aukštyn – a &gt; 0, žemyn – a &lt; 0.</p>` },
    { name: "Parabolė y = a(x − m)² + n", level: 3, html: `<p>Kvadratinės funkcijos y = x² grafikas – parabolė su viršūne (0; 0).</p>
      <ul><li><b>a</b>: a &gt; 0 – šakos aukštyn, a &lt; 0 – žemyn; |a| &gt; 1 – siauresnė, |a| &lt; 1 – platesnė.</li><li><b>m</b>: grafikas pastumiamas išilgai x ašies (y = (x − 2)² – 2 vienetus į dešinę).</li><li><b>n</b>: grafikas pastumiamas išilgai y ašies.</li></ul>
      <p>Viršūnė yra taške <b>(m; n)</b>. Kad rastum a, įstatyk dar vieną tašką.</p>
      <span class="mk-ex">Viršūnė (1; −2), taškas (3; 6): 6 = a · 2² − 2, a = 2. y = 2(x − 1)² − 2</span>` },
    { name: "Parabolės simetrija ir nuliai", level: 3, html: `<p>Parabolė simetriška tiesės x = m atžvilgiu. Jei du taškai turi vienodą y reikšmę (pvz., abu nuliai, kai y = 0), viršūnės abscisė yra jų viduryje:</p>
      <span class="mk-ex">Nuliai −1 ir 3 → m = (−1 + 3) : 2 = 1</span>
      <p>Tada, žinodamas dar vieną tašką, gali rasti a ir n.</p>` },
    { name: "y = ax² + bx + c → viršūnė", level: 3, html: `<p>Viršūnės abscisė <b>m = −b : (2a)</b>, o ordinatė n – funkcijos reikšmė, kai x = m.</p>
      <span class="mk-ex">y = x² − 4x + 1: m = 4 : 2 = 2, n = 4 − 8 + 1 = −3, todėl y = (x − 2)² − 3</span>` }
  ]
};
})();
