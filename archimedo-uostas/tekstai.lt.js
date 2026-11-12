/* Archimedo uostas – visi mokiniui rodomi tekstai (lietuvių k.). Verčiant keisti tik šį failą.
   Terminai – pagal Fizikos bendrąją programą ir pagrindinio ugdymo fizikos BP įgyvendinimo rekomendacijas
   (9 kl., 28.2.4 „Slėgis“: Archimedo jėga, kūnų plūduriavimo sąlygos; 28.2.2 sunkio jėga). */
(function(){
"use strict";
const nf = x => String(+(+x).toFixed(6)).replace(".", ",");
window.MK_T = {
  nf,
  title: "Archimedo uostas",
  heroA: "Archimedo", heroB: "uostas",
  hero: "Tapk uosto kapitonu: spręsk, kas plauks, o kas skęs, skaičiuok Archimedo jėgą ir pakrauk laivą taip, kad jis nenuskęstų. Už darbą gausi naujų laivų.",
  levels: [
    ["Plauks ar skęs?", "Sunkio jėga prieš Archimedo jėgą"],
    ["Archimedo jėga", "F = ρ · g · V, vienetų vertimas"],
    ["Krovinio kapitonas", "Kiek dėžių pakrauti, kad nenuskęstų"],
    ["Plūduriuojantis kūnas", "Kiek panyra ir kodėl"],
    ["Uosto egzaminas", "Visos temos kartu · 10 užduočių"]
  ],
  fleetH: "Uosto laivynas",
  fleetP: (n, m) => n >= m ? `Visas laivynas sutelktas (${n}). Tu – tikras kapitonas!` : `Uoste ${n} iš ${m} laivų. Už 1 žvaigždutę gausi pirmą lygio laivą, už 3 žvaigždutes – antrą.`,
  fleetEmpty: "Uostas dar tuščias – išspręsk pirmąjį lygį.",
  ships: ["Valtis", "Plaustas", "Baidarė", "Burlaivis", "Barža", "Krovininis", "Povandeninis", "Balionas", "Ledlaužis", "Žvejų laivas"],
  shipLocked: lv => `Atrakink: ${lv}`,
  pts: "Taškai",
  task: (i, n) => `${i} / ${n}`,
  next: "Toliau", finish: "Baigti",
  ok: ["Teisingai!", "Puiku!", "Tiksliai!", "Šaunu!"],
  bad: "Ne visai.",
  why: "Kaip spręsti?",
  ptsPlus: n => `+${n}`,
  newShip: n => `Į uostą atplaukė nauji laivai: ${n}!`,
  res: (ok, n, pts) => `Iš pirmo karto teisingai: ${ok} iš ${n}. Taškai: ${pts}.`,
  /* ---- 1 lygis ---- */
  liquid: "Skystis", body: "Kūnas", gas: "Dujos",
  liquids: { water: "vanduo", sea: "jūros vanduo", kero: "žibalas", oil: "augalinis aliejus", air: "oras" },
  rho: "tankis", liquidsIn: { water: "vandenyje", sea: "jūros vandenyje", kero: "žibale", oil: "aliejuje" },
  items: { cork: "kamštinis plūdurys", pine: "pušies rąstas", oak: "ąžuolo kaladė", ice: "ledo luitas", glass: "stiklo blokas", alu: "aliuminio luitas", steel: "plieno rutulys", copper: "vario rutulys", lead: "švino kubas", box: "sandari dėžė su balastu", plastic: "plastikinis kubas", wax: "parafino luitas", balloon: "oro balionas" },
  q1: "Kas nutiks paleidus kūną?",
  o1: { float: "Iškils į paviršių ir plūduriuos", sink: "Nuskęs", hover: "Liks pakibęs skystyje", up: "Pakils į orą", stay: "Liks ant žemės" },
  givenFull: (P, F) => `Sunkio jėga <b>P = ${P} N</b>. Jei kūnas būtų visiškai panardintas, Archimedo jėga būtų <b>F = ${F} N</b>.`,
  givenMass: (m, F) => `Kūno masė <b>${m} kg</b> (g ≈ 10 N/kg). Jei kūnas būtų visiškai panardintas, Archimedo jėga būtų <b>F = ${F} N</b>.`,
  givenAir: (V, P) => `Balionas užpildytas dujomis, jo tūris <b>${V} m³</b>. Oro tankis 1,3 kg/m³, g ≈ 10 N/kg. Viso baliono su krepšiu sunkio jėga <b>P = ${P} N</b>.`,
  w1float: (P, F, pct) => ({ head: "Plūduriuos.", body: `Archimedo jėga (${F} N, jei panardintas visas) didesnė už sunkio jėgą (${P} N), todėl kūnas kyla aukštyn. Iškilęs jis panyra tik tiek, kad Archimedo jėga susilygintų su sunkio jėga.`, more: `Panirusi dalis: ${P} ÷ ${F} ≈ <b>${pct} %</b> tūrio. Plūduriavimo sąlyga: F<sub>A</sub> &gt; P – kyla, F<sub>A</sub> = P – plūduriuoja.` }),
  w1sink: (P, F) => ({ head: "Nuskęs.", body: `Sunkio jėga (${P} N) didesnė už didžiausią galimą Archimedo jėgą (${F} N, kai kūnas visas panardintas), todėl ji kūno nepakels.`, more: `Jei P &gt; F<sub>A</sub>, kūnas skęsta. Net visiškai panardintas jis negauna pakankamai stumiančios jėgos.` }),
  w1hover: (P) => ({ head: "Liks pakibęs.", body: `Kai panardinto kūno Archimedo jėga lygi sunkio jėgai (${P} N), jėgos susibalansuoja – kūnas nei kyla, nei skęsta. Taip veikia povandeniniai laivai su balasto bakais.`, more: `F<sub>A</sub> = P: jėgų atstojamoji lygi nuliui, kūnas lieka ramybės būsenos.` }),
  w1up: (P, F) => ({ head: "Pakils.", body: `Kūnai plūduriuoja ne tik skysčiuose, bet ir dujose. Oro išstumiama Archimedo jėga (1,3 · 10 · tūris = ${F} N) didesnė už sunkio jėgą (${P} N).`, more: `Balionas kyla, kol Archimedo jėga susilygina su sunkio jėga – oras retėja, todėl pakilimas turi ribą.` }),
  w1stay: (P, F) => ({ head: "Neiškils.", body: `Oro išstumiama Archimedo jėga (${F} N) mažesnė už sunkio jėgą (${P} N), todėl balionas nuo žemės nekyla.`, more: `Kad kiltų, reikia daugiau dujų (didesnio tūrio) arba lengvesnio krovinio.` }),
  /* ---- 2 lygis ---- */
  fullyIn: "Kūnas visiškai panardintas.", halfIn: "Kūno panardinta lygiai pusė tūrio.",
  q2full: (V, u, l, rho) => `Skystis: <b>${l}</b> (tankis ${rho} kg/m³). Kūno tūris <b>${V} ${u}</b>, jis visiškai panardintas. Kokia Archimedo jėga jį veikia? (g ≈ 10 N/kg)`,
  q2half: (V, u, l, rho) => `Skystis: <b>${l}</b> (tankis ${rho} kg/m³). Kūno tūris <b>${V} ${u}</b>, panardinta lygiai pusė jo tūrio. Kokia Archimedo jėga jį veikia? (g ≈ 10 N/kg)`,
  q2vol: (F, l, rho) => `Skystis: <b>${l}</b> (tankis ${rho} kg/m³). Visiškai panardintą kūną veikia <b>${F} N</b> Archimedo jėga. Koks kūno tūris? (g ≈ 10 N/kg)`,
  w2full: (V, u, Vm, rho, F) => ({ head: `F = ${F} N`, body: `Archimedo jėga lygi išstumto skysčio svoriui: F = ρ · g · V. Tūrį reikia išreikšti m³: ${V} ${u} = ${Vm} m³.`, more: `F = ${rho} · 10 · ${Vm} = <b>${F} N</b>.` }),
  w2half: (V, u, Vm, rho, F) => ({ head: `F = ${F} N`, body: `Archimedo jėgą lemia tik panardintoji tūrio dalis – čia ji lygi pusei: ${V} ${u} ÷ 2. Tūrį reikia išreikšti m³.`, more: `V<sub>panirusio</sub> = ${Vm} m³, F = ${rho} · 10 · ${Vm} = <b>${F} N</b>.` }),
  w2vol: (F, rho, V) => ({ head: `V = ${nf(V)} dm³`, body: `Iš F = ρ · g · V išreiškiame tūrį: V = F ÷ (ρ · g).`, more: `V = ${nf(F)} ÷ (${rho} · 10) = ${nf(F / (rho * 10))} m³ = <b>${nf(V)} dm³</b> (1 m³ = 1000 dm³).` }),
  /* ---- 3 lygis ---- */
  q3: (P0, w, rho, l, V, Fmax) => `Barža sveria <b>${P0} N</b>. Jos korpuso tūris iki borto viršaus – <b>${V} dm³</b>. Plauksi: <b>${l}</b> (tankis ${rho} kg/m³). Vienos dėžės sunkio jėga – <b>${w} N</b>. Kiek daugiausia dėžių galima pakrauti, kad barža dar neįsileistų vandens? (g ≈ 10 N/kg)`,
  crates: "dėžių",
  go3: "Nuleisti į vandenį",
  tries: n => `Bandymai: ${n}`,
  t3float: (n, pct) => `Barža plūduriuoja. Panirusi ${pct} % korpuso, dar telpa dėžių.`,
  t3sink: "Per daug! Barža nuskendo.",
  t3ok: n => `Tiksliai – daugiau dėžių nebetilptų.`,
  t3less: "Plaukia, bet dar telpa daugiau – pridėk dėžių.",
  t3more: "Per sunku – barža nuskęstų. Sumažink dėžių skaičių.",
  t3fail: "Bandymai baigėsi. Žiūrėk sprendimą.",
  w3: (rho, V, Fmax, P0, w, rem, n) => ({ head: `Daugiausia ${n} dėž.`, body: `Barža neskęsta, kol Archimedo jėga (visiškai panardinus korpusą) bent tokia, kaip visa sunkio jėga: P<sub>visa</sub> ≤ F<sub>max</sub>.`, more: `F<sub>max</sub> = ρ · g · V = ${rho} · 10 · ${nf(V / 1000)} = <b>${nf(Fmax)} N</b>.<br>Krovinio sunkio jėga ≤ ${nf(Fmax)} − ${P0} = <b>${nf(rem)} N</b>.<br>Dėžių: ${nf(rem)} ÷ ${w} = ${nf(rem / w)}, todėl telpa <b>${n}</b>.` }),
  /* ---- 4 lygis ---- */
  q4eq: (P, l) => `Plaustas plūduriuoja <b>${l}</b>. Jo sunkio jėga – <b>${P} N</b>. Kokia Archimedo jėga jį veikia?`,
  q4vol: (P, l, rho) => `Laivelis plūduriuoja skystyje: <b>${l}</b> (tankis ${rho} kg/m³). Jo sunkio jėga <b>${P} N</b>. Koks panirusios dalies tūris? (g ≈ 10 N/kg)`,
  q4pct: (b, bn, rb, l, rl) => `Kūnas: <b>${bn}</b> (tankis ${rb} kg/m³) plūduriuoja skystyje: <b>${l}</b> (tankis ${rl} kg/m³). Kiek procentų jo tūrio panyra?`,
  q4c: { river2sea: "Laivas iš upės (1000 kg/m³) įplaukia į jūrą (1030 kg/m³). Krovinys nesikeičia. Kaip pasikeis laivo grimzlė (panirimo gylis)?", sea2river: "Laivas iš jūros (1030 kg/m³) įplaukia į upę (1000 kg/m³). Krovinys nesikeičia. Kaip pasikeis laivo grimzlė (panirimo gylis)?", unload: "Iš plūduriuojančios baržos iškraunama dalis krovinio. Kaip pasikeis jos grimzlė?", load: "Į plūduriuojančią baržą pakraunama daugiau krovinio. Kaip pasikeis Archimedo jėga, kuri ją veikia?" },
  o4c: { less: "Sumažės (panirs mažiau)", more: "Padidės (panirs giliau)", same: "Nepasikeis", aUp: "Padidės", aDown: "Sumažės", aSame: "Nepasikeis" },
  w4eq: (P, l) => ({ head: `F = ${P} N`, body: `Plūduriuojantis kūnas ramus, todėl jėgų atstojamoji lygi nuliui: Archimedo jėga aukštyn lygi sunkio jėgai žemyn.`, more: `F<sub>A</sub> = P = <b>${P} N</b>.` }),
  w4vol: (P, rho, V) => ({ head: `V = ${nf(V)} dm³`, body: `Plūduriuojant F = P, o F = ρ · g · V<sub>panirusio</sub>.`, more: `V<sub>panirusio</sub> = ${nf(P)} ÷ (${rho} · 10) = ${nf(P / (rho * 10))} m³ = <b>${nf(V)} dm³</b>.` }),
  w4pct: (rb, rl, pct) => ({ head: `${pct} %`, body: `Plūduriuojant F = P: ρ<sub>skysčio</sub> · g · V<sub>panirusio</sub> = ρ<sub>kūno</sub> · g · V. Sutrumpinus g ir dalijant iš ρ<sub>skysčio</sub> gauname: V<sub>panirusio</sub> ÷ V = ρ<sub>kūno</sub> ÷ ρ<sub>skysčio</sub>.`, more: `${rb} ÷ ${rl} = ${nf(rb / rl)} = <b>${pct} %</b>.` }),
  w4river2sea: { head: "Panirs mažiau.", body: "Laivo sunkio jėga nepasikeitė, todėl Archimedo jėga turi likti tokia pati. Jūros vandens tankis didesnis, todėl pakanka mažesnio išstumto vandens tūrio.", more: "F = ρ · g · V<sub>panirusio</sub> nekinta, o ρ didėja – vadinasi, V<sub>panirusio</sub> mažėja." },
  w4sea2river: { head: "Panirs giliau.", body: "Laivo sunkio jėga nepasikeitė, todėl Archimedo jėga turi likti tokia pati. Upės vandens tankis mažesnis, todėl reikia didesnio išstumto vandens tūrio.", more: "F = ρ · g · V<sub>panirusio</sub> nekinta, o ρ mažėja – vadinasi, V<sub>panirusio</sub> didėja." },
  w4unload: { head: "Panirs mažiau.", body: "Iškrovus dalį krovinio sunkio jėga sumažėja, todėl mažesnės Archimedo jėgos pakanka – laivas iškyla.", more: "F<sub>A</sub> = P: mažesnė sunkio jėga → mažesnė Archimedo jėga → mažesnis išstumto vandens tūris." },
  w4load: { head: "Padidės.", body: "Barža vis dar plūduriuoja, todėl Archimedo jėga lygi sunkio jėgai. Sunkio jėga padidėjo, tad padidės ir Archimedo jėga – barža panirs giliau.", more: "F<sub>A</sub> = P: didėja P, todėl didėja ir F<sub>A</sub> (kol barža dar plūduriuoja)." },
  /* ---- pasimokyti ---- */
  learn: [
    { name: "Archimedo jėga", level: 1, html: `<p>Į skystį ar dujas panardintą kūną skystis stumia <b>aukštyn</b>. Ši jėga vadinama <b>Archimedo jėga</b>.</p><p>Ji lygi <b>išstumto skysčio svoriui</b>:</p><span class="mk-ex">F<sub>A</sub> = ρ · g · V</span><ul><li>ρ – skysčio tankis (vandens apie 1000 kg/m³);</li><li>g ≈ 10 N/kg – laisvojo kritimo pagreitis;</li><li>V – <b>panirusios</b> kūno dalies tūris.</li></ul>` },
    { name: "Plūduriavimo sąlygos", level: 0, html: `<p>Panardintą kūną veikia dvi jėgos: sunkio jėga <b>P</b> žemyn ir Archimedo jėga <b>F<sub>A</sub></b> aukštyn.</p><ul><li>F<sub>A</sub> &gt; P – kūnas <b>kyla</b> ir iškyla į paviršių;</li><li>F<sub>A</sub> = P – kūnas <b>plūduriuoja</b> (jei panardintas visas – pakimba);</li><li>F<sub>A</sub> &lt; P – kūnas <b>skęsta</b>.</li></ul><p>Iškilęs kūnas panyra tiek, kad F<sub>A</sub> susilygintų su P.</p>` },
    { name: "Kaip skaičiuoti: vienetai", level: 1, html: `<p>Formulėje tūrį rašyk <b>m³</b>:</p><span class="mk-ex">1 dm³ = 1 l = 0,001 m³</span><span class="mk-ex">1 cm³ = 0,000001 m³</span><p>Pavyzdys: 2 dm³ vandenyje (1000 kg/m³): F = 1000 · 10 · 0,002 = <b>20 N</b>.</p>` },
    { name: "Dalinai panirę kūnai", level: 3, html: `<p>Plūduriuojantis kūnas: F<sub>A</sub> = P, todėl</p><span class="mk-ex">ρ<sub>skysčio</sub> · g · V<sub>panirusio</sub> = P</span><p>Jei kūnas vienalytis, panirusi tūrio dalis lygi tankių santykiui: <b>V<sub>panirusio</sub> ÷ V = ρ<sub>kūno</sub> ÷ ρ<sub>skysčio</sub></b>. Pavyzdžiui, ledas (900 kg/m³) vandenyje panyra 90 %.</p>` },
    { name: "Laivai ir kroviniai", level: 2, html: `<p>Laivas neskęsta, jei jo visa sunkio jėga (su kroviniu) ne didesnė už Archimedo jėgą, kai panardintas visas korpusas:</p><span class="mk-ex">P<sub>visa</sub> ≤ ρ · g · V<sub>korpuso</sub></span><p>Krovinio galima pakrauti: F<sub>max</sub> − P<sub>laivo</sub>. Sūrus jūros vanduo tankesnis, todėl laivas jame panyra mažiau.</p>` },
    { name: "Dujos ir balionai", level: 0, html: `<p>Archimedo jėga veikia ir dujose: oras stumia balioną aukštyn. Oro tankis apie 1,3 kg/m³, todėl 100 m³ baliono Archimedo jėga ≈ 1300 N.</p><p>Balionas kyla, kai ši jėga didesnė už viso baliono (dujų, apvalkalo, krepšio) sunkio jėgą.</p>` }
  ]
};
})();
