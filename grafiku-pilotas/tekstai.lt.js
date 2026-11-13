/* Grafikų pilotas – visi mokiniui rodomi tekstai (lietuvių k.). Verčiant keisti tik šį failą.
   Terminai – pagal Matematikos bendrąją programą (e-seimas.lrs.lt), 10 ir II gimnazijos klasė, „Tiesinė ir kvadratinė funkcijos“:
   „tiesės krypties koeficientas k, postūmio koeficientas b“; „braižomi jos grafiko (parabolės) eskizai“; grafikų transformacijos. */
(function(){
"use strict";
const nf = x => { const v = Math.round(x * 1000) / 1000; return (v < 0 ? "−" : "") + String(Math.abs(v)).replace(".", ","); };
const np = x => x < 0 ? `(${nf(x)})` : nf(x);   // neigiamas skaičius skliaustuose
const sqm = m => m === 0 ? "x²" : `(x ${m < 0 ? "+" : "−"} ${nf(Math.abs(m))})²`;
const cn = n => n === 0 ? "" : n < 0 ? ` − ${nf(-n)}` : ` + ${nf(n)}`;
const pt = (x, y) => `(${nf(x)}; ${nf(y)})`;
window.MK_T = {
  nf, pt,
  title: "Grafikų pilotas",
  heroA: "Grafikų", heroB: "pilotas",
  hero: "Zondas skrenda tiksliai funkcijos grafiku. Apskaičiuok koeficientus, kad jis surinktų visus švyturius ir aplenktų asteroidus. Pirmiausia skaičiuok, tada leisk!",
  levels: [
    ["Krypties koeficientas k", "y = kx + b, kai b žinomas"],
    ["Tiesė per du švyturius", "Rask ir k, ir b"],
    ["Kokia tiesės lygtis?", "Perskaityk grafiką"],
    ["Parabolės trasa", "y = a(x − m)² + n"],
    ["Pilotų egzaminas", "Visos temos kartu · 10 užduočių"]
  ],
  mapH: "Žvaigždėlapis",
  mapP: (n, m, r) => n >= m ? `Visas žvaigždynas užsidegė! Tavo laipsnis – ${r}.` : `Uždegta ${n} iš ${m} žvaigždžių. Laipsnis: ${r}. Kiekviena užduotis, išspręsta iš pirmo ar antro karto, uždega žvaigždę.`,
  mapEmpty: "Žvaigždynas dar tamsus – išspręsk pirmąją užduotį.",
  ranks: ["Kadetas", "Pilotas", "Navigatorius", "Kapitonas", "Admirolas"],
  pts: "Taškai",
  next: "Toliau", finish: "Baigti",
  why: "Kaip apskaičiuoti?",
  launch: "Leisti zondą", tries: n => `Liko bandymų: ${n}`,
  goalLine: "Nustatyk koeficientus taip, kad zondas praskristų pro visus švyturius.",
  goalK: b => `Trasa prasideda taške (0; ${nf(b)}), todėl b = ${nf(b)}. Rask krypties koeficientą k.`,
  goalPar: "Nustatyk a, m ir n taip, kad parabolė eitų pro visus švyturius.",
  goalPar3: "Viršūnės švyturio nėra – pasinaudok parabolės simetrija.",
  goalPara: c => `Senoji trasa: ${c}. Naujoji turi būti jai lygiagreti ir eiti pro švyturį.`,
  goalMC: "Zondas jau skrenda šia tiese. Kokia jos lygtis?",
  oldRoute: "senoji trasa",
  beacons: "Švyturiai", asteroid: "asteroidas",
  res: {
    ok: "Visi švyturiai surinkti!",
    miss: (p) => `Zondas nepataikė į švyturį ${p}.`,
    crash: "Zondas atsitrenkė į asteroidą!",
    last: "Bandymai baigėsi. Žiūrėk paaiškinimą."
  },
  ok: ["Tiksliai!", "Puikus skrydis!", "Teisingai!", "Šaunu!"],
  bad: "Ne visai.",
  res2: (ok, n, pts) => `Išspręsta iš pirmo ar antro karto: ${ok} iš ${n}. Taškai: ${pts}.`,
  newStars: n => `Uždegta naujų žvaigždžių: ${n}.`,
  /* paaiškinimai */
  wK: (x, y, b, k) => `Taškas ${pt(x, y)} yra tiesėje, todėl ${nf(y)} = k · ${np(x)} + ${np(b)}. Iš čia k = (${nf(y)} − ${np(b)}) : ${np(x)} = <b>${nf(k)}</b>.`,
  wKb: (x1, y1, x2, y2, k, b) => `k = (y₂ − y₁) : (x₂ − x₁) = (${nf(y2)} − ${np(y1)}) : (${nf(x2)} − ${np(x1)}) = <b>${nf(k)}</b>.<br>b = y₁ − k · x₁ = ${nf(y1)} − ${np(k)} · ${np(x1)} = <b>${nf(b)}</b>.`,
  wPara: (k, x, y, b) => `Lygiagrečių tiesių krypties koeficientai lygūs, todėl k = <b>${nf(k)}</b>. Tada b = ${nf(y)} − ${np(k)} · ${np(x)} = <b>${nf(b)}</b>.`,
  wPar: (m, n, x, y, a) => `Viršūnė ${pt(m, n)}, todėl y = a${sqm(m)}${cn(n)}. Įstatome švyturį ${pt(x, y)}: ${nf(y)} = a · ${nf((x - m) * (x - m))}${cn(n)}, todėl a = <b>${nf(a)}</b>.`,
  wPar3: (x1, x2, y, m) => `Švyturiai ${pt(x1, y)} ir ${pt(x2, y)} turi vienodą y reikšmę, todėl jie simetriški parabolės ašies atžvilgiu: m = (${nf(x1)} + ${np(x2)}) : 2 = <b>${nf(m)}</b>.`,
  wPar3b: (x1, y1, x3, y3, m, a, n) => `Įstatome abu taškus į y = a${sqm(m)} + n: ${nf(y1)} = ${nf((x1 - m) * (x1 - m))}a + n ir ${nf(y3)} = ${nf((x3 - m) * (x3 - m))}a + n. Atėmę gauname a = <b>${nf(a)}</b>, tada n = <b>${nf(n)}</b>.`,
  wAns: s => `Teisinga trasa: <b>${s}</b>.`,
  wMC: "Iš grafiko perskaityk du taškus su sveikomis koordinatėmis, apskaičiuok k = (y₂ − y₁) : (x₂ − x₁), o b – taške, kur tiesė kerta y ašį.",
  tipK: "Jei k > 0, tiesė kyla (iš kairės į dešinę), jei k < 0 – leidžiasi. Kuo |k| didesnis, tuo tiesė statesnė.",
  tipB: "b – tai y reikšmė, kai x = 0, t. y. taškas, kuriame tiesė kerta y ašį.",
  tipA: "Jei a > 0, parabolės šakos nukreiptos aukštyn, jei a < 0 – žemyn. Kuo |a| didesnis, tuo parabolė siauresnė.",
  tipMN: "Grafikas y = a(x − m)² + n gaunamas iš y = ax²: pastumiamas m vienetų išilgai x ašies ir n vienetų išilgai y ašies. Viršūnė – taške (m; n).",
  learn: [
    { name: "Tiesinė funkcija y = kx + b", level: 0, html: `<p>Tiesinės funkcijos grafikas – tiesė. <b>k</b> – tiesės krypties koeficientas, <b>b</b> – postūmio koeficientas.</p>
      <ul><li>k &gt; 0 – tiesė kyla, k &lt; 0 – leidžiasi, k = 0 – tiesė lygiagreti x ašiai.</li><li>Kuo |k| didesnis, tuo tiesė statesnė.</li><li>b – taškas (0; b), kuriame tiesė kerta y ašį.</li></ul>
      <span class="mk-ex">y = 2x − 3: kai x = 0, y = −3; x padidėjus 1, y padidėja 2.</span>` },
    { name: "Tiesė per du taškus", level: 1, html: `<p>Jei tiesė eina pro taškus (x₁; y₁) ir (x₂; y₂), tai</p>
      <span class="mk-ex">k = (y₂ − y₁) : (x₂ − x₁),&nbsp;&nbsp; b = y₁ − k · x₁</span>
      <p>Pavyzdys: (1; 1) ir (3; 5). k = (5 − 1) : (3 − 1) = 2, b = 1 − 2 · 1 = −1, todėl y = 2x − 1.</p>
      <p>Patikrink: įstatyk antrą tašką – 2 · 3 − 1 = 5 ✓.</p>` },
    { name: "Lygtis iš grafiko ir lygiagrečios tiesės", level: 2, html: `<p>Iš grafiko: rask tašką, kur tiesė kerta y ašį (tai b), ir dar vieną tašką su sveikomis koordinatėmis. Tada k = y pokytis : x pokyčio.</p>
      <p><b>Lygiagrečių tiesių</b> krypties koeficientai lygūs: y = 2x + 1 ir y = 2x − 4 yra lygiagrečios.</p>` },
    { name: "Parabolė y = a(x − m)² + n", level: 3, html: `<p>Kvadratinės funkcijos y = x² grafikas – parabolė su viršūne (0; 0).</p>
      <ul><li><b>a</b>: a &gt; 0 – šakos aukštyn, a &lt; 0 – žemyn; |a| &gt; 1 – siauresnė, |a| &lt; 1 – platesnė.</li><li><b>m</b>: grafikas pastumiamas išilgai x ašies (y = (x − 2)² – 2 vienetus į dešinę).</li><li><b>n</b>: grafikas pastumiamas išilgai y ašies.</li></ul>
      <p>Viršūnė yra taške <b>(m; n)</b>. Kad rastum a, įstatyk dar vieną tašką.</p>
      <span class="mk-ex">Viršūnė (1; −2), taškas (3; 6): 6 = a · 2² − 2, a = 2. y = 2(x − 1)² − 2</span>` },
    { name: "Parabolės simetrija", level: 3, html: `<p>Parabolė simetriška tiesės x = m atžvilgiu. Jei du taškai turi vienodą y reikšmę, viršūnės x koordinatė yra jų viduryje:</p>
      <span class="mk-ex">(−1; 5) ir (3; 5) → m = (−1 + 3) : 2 = 1</span>
      <p>Tada, žinodamas dar vieną tašką, gali rasti a ir n.</p>` }
  ]
};
})();
