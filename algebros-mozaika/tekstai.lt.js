/* Algebros mozaika – visi mokiniui rodomi tekstai (lietuvių k.). Verčiant keisti tik šį failą.
   Terminai – pagal Matematikos bendrąją programą (8 kl., „Raidiniai reiškiniai“): „vienanario, dvinario, trinario,
   daugianario sąvokos“, „sudauginti du raidinius reiškinius“, „greitosios daugybos formulės (kubų formulės nenagrinėjamos)“,
   „iš kvadratinio trinario išskirti dvinario kvadratą“, „Daugianariai skaidomi dauginamaisiais (iškėlimas prieš skliaustus,
   greitosios daugybos formulių taikymas, grupavimas)“; „panašieji nariai“ – 5 kl. sąvoka. */
(function(){
"use strict";
const ex = s => `<b class="ex">${s}</b>`;
const F1 = "(<i>a</i> + <i>b</i>)<sup>2</sup> = <i>a</i><sup>2</sup> + 2<i>ab</i> + <i>b</i><sup>2</sup>";
const F2 = "(<i>a</i> − <i>b</i>)<sup>2</sup> = <i>a</i><sup>2</sup> − 2<i>ab</i> + <i>b</i><sup>2</sup>";
const F3 = "(<i>a</i> − <i>b</i>)(<i>a</i> + <i>b</i>) = <i>a</i><sup>2</sup> − <i>b</i><sup>2</sup>";
const pl = (n, a) => { n = Math.abs(n); return a[(n % 10 === 1 && n % 100 !== 11) ? 0 : (n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20)) ? 1 : 2]; };

window.MK_T = {
  ex, F1, F2, F3,
  title: "Algebros mozaika",
  heroA: "Algebros", heroB: "mozaika",
  hero: "Padėk mozaikos meistrei Ievai: reiškinių sandaugą sudėk plotų lentelėje, taikyk greitosios daugybos formules ir skaidyk daugianarius dauginamaisiais. Laiko niekas neskaičiuoja – pirma pagalvok, tada dėk plytelę.",
  heroAria: "Mozaikos meistrė Ieva prie sienos, kurioje iš plytelių sudėta sandauga (x + 2)(x + 3)",
  levels: [
    ["Sandaugos lentelė", "Vienanaris, dvinaris ir jų daugyba"],
    ["Greitosios daugybos formulės", "(a ± b)² ir (a − b)(a + b)"],
    ["Iškėlimas prieš skliaustus", "Bendras daugiklis"],
    ["Skaidymas pagal formules", "a² − b² ir a² ± 2ab + b²"],
    ["Grupavimas", "Keturi nariai – du dauginamieji"],
    ["Dvinario kvadratas", "Išskirk dvinario kvadratą"],
    ["Meistro egzaminas", "Visos temos · 10 užduočių"]
  ],
  colH: "Mozaikų galerija",
  colP: (pts, got, all, rank, need) => got >= all
    ? `Surinkta taškų: ${pts}. Galerijoje – visos ${all} mozaikos. Tavo vardas – ${rank}!`
    : `Surinkta taškų: ${pts}. Mozaikų: ${got} iš ${all}. Iki kitos mozaikos trūksta ${need} tšk. Vardas: ${rank}.`,
  orn: ["Aušra", "Gintaras", "Marios", "Pieva", "Vakaras", "Šilas", "Rasa", "Žarija", "Lelija", "Vėtra", "Šerkšnas", "Karūna"],
  ranks: ["Mokinys", "Pameistrys", "Plytelių klojėjas", "Mozaikos meistras", "Didysis meistras"],
  pts: "Taškai",
  check: "Tikrinti",
  next: "Toliau →", nextStep: "Kitas žingsnis →", finish: "Baigti",
  rule: "Taisyklė",
  step: (i, n) => `${i} žingsnis iš ${n}`,
  bad: a => `Teisingas atsakymas: ${a}`,
  badPlain: "Šį kartą nepavyko.",
  hintSlots: "Paliesk langelį, tada – plytelę iš lentynos.",
  hintRow: "Liesk plyteles lentynoje – jos sugula į atsakymą. Paliesta atsakyme plytelė grįžta atgal.",
  trayAria: "Plytelių lentyna",
  empty: "?",
  nSlots: k => `Netinka ${k} ${pl(k, ["plytelė", "plytelės", "plytelių"])} – ${k === 1 ? "ji pažymėta" : "jos pažymėtos"} raudonai. Pakeisk ir tikrink dar kartą.`,
  nRow: (bad, miss) => (bad ? `Atsakyme yra ${bad} ${pl(bad, ["netinkama plytelė", "netinkamos plytelės", "netinkamų plytelių"])}. ` : "") + (miss ? `Trūksta ${miss} ${pl(miss, ["plytelės", "plytelių", "plytelių"])}. ` : "") + "Pataisyk ir tikrink dar kartą.",
  nPartSum: "Lygybė teisinga, bet atsakyme dar liko panašiųjų narių. Sutrauk juos.",
  nPartProd: "Lygybė teisinga, bet išskaidyta ne iki galo – vieną dauginamąjį dar galima skaidyti.",
  nPartFact: "Lygybė teisinga, bet skliaustuose dar liko bendras daugiklis. Iškelk daugiau.",
  res: (ok, total, pts, gain) => `Iš pirmo karto išspręsta užduočių: ${ok} iš ${total}. Taškų: ${pts}.` + (gain.length ? ` Galerijoje – ${gain.length === 1 ? "nauja mozaika" : "naujos mozaikos"}: ${gain.join(", ")}!` : ""),

  q: {
    grid: "Sudaugink. Į kiekvieną lentelės langelį įdėk tinkamą sandaugą.",
    sum: "Dabar sutrauk panašiuosius narius ir sudėk atsakymą iš plytelių.",
    side: "Žinomas visas mozaikos plotas ir viena kraštinė. Sudėk kitą kraštinę.",
    name: "Suprastink mintyse. Kaip vadinamas gautas reiškinys?",
    exp: "Pritaikyk greitosios daugybos formulę ir sudėk atsakymą iš plytelių.",
    which: "Kuri lygybė teisinga?",
    num: "Kaip tai patogu apskaičiuoti be skaičiuotuvo?",
    miss: "Įdėk trūkstamus skaičius, kad lygybė būtų teisinga.",
    fact: "Iškelk bendrą daugiklį prieš skliaustus – kuo didesnį, kad skliaustuose bendro daugiklio nebeliktų.",
    factNeg: "Iškelk prieš skliaustus neigiamą daugiklį.",
    bin: "Iškelk prieš skliaustus bendrą daugiklį – visą dvinarį. Sudėk sandaugą iš plytelių.",
    prod: "Išskaidyk dauginamaisiais iki galo. Sudėk sandaugą iš plytelių.",
    whichDs: "Kurį reiškinį galima išskaidyti dauginamaisiais pagal formulę <i>a</i><sup>2</sup> − <i>b</i><sup>2</sup> = (<i>a</i> − <i>b</i>)(<i>a</i> + <i>b</i>)?",
    whichPs: "Kuris trinaris yra dvinario kvadratas?",
    grp1: "Sugrupuok narius poromis ir iš kiekvienos poros iškelk bendrą daugiklį. Kuris užrašas teisingas?",
    grp2: "Dabar iškelk bendrą dvinarį – sudėk sandaugą iš plytelių.",
    sq: "Išskirk dvinario kvadratą: įdėk trūkstamus skaičius.",
    fill: "Papildyk trinarį, kad jis būtų dvinario kvadratas."
  },
  nameOpts: ["Vienanaris", "Dvinaris", "Trinaris", "Daugianaris, turintis 4 narius"],
  area: h => `Plotas: ${h}`,
  picNeed: (j, b, c, x) => `Kvadratui su kraštine ${x} + ${j} reikia: vienos plytelės ${x}<sup>2</sup>, ${2 * j} juostelių ${x} ir ${j * j} ${pl(j * j, ["vieneto", "vienetų", "vienetų"])}. Turime: ${b} ${pl(b, ["juostelę", "juosteles", "juostelių"])} ${x} ir ${c} ${pl(c, ["vienetą", "vienetus", "vienetų"])}.`,
  picAria: "Plytelių kvadratas: x kvadrato plytelė, x juostelės ir vienetai",

  w: {
    grid: lines => `Kiekvieną pirmojo daugiklio narį padaugink iš kiekvieno antrojo daugiklio nario:<br>${lines.join("<br>")}`,
    sum: (cells, like, res) => `Lentelėje gauti nariai: ${cells}.<br>Panašieji nariai: ${like}.<br>Atsakymas: ${ex(res)}.`,
    side: (lines, res) => `Kiekvienas lentelės langelis yra kraštinių sandauga, todėl langelį dalijame iš žinomos kraštinės:<br>${lines.join("<br>")}<br>Kita kraštinė: ${ex(res)}.`,
    name: (res, n, nm) => `Suprastinus gaunama ${ex(res)}. Narių – ${n}, todėl tai ${nm}.`,
    names: ["vienanaris", "dvinaris", "trinaris", "daugianaris, turintis 4 narius"],
    sq: (f, a, b, a2, m, b2, res) => `Formulė: ${f}.<br>Čia <i>a</i> = ${a}, <i>b</i> = ${b}.<br><i>a</i><sup>2</sup> = ${a2}; &nbsp; 2<i>ab</i> = ${m}; &nbsp; <i>b</i><sup>2</sup> = ${b2}.<br>Atsakymas: ${ex(res)}.`,
    ds: (a, b, a2, b2, res) => `Formulė: ${F3}.<br>Čia <i>a</i> = ${a}, <i>b</i> = ${b}.<br><i>a</i><sup>2</sup> = ${a2}; &nbsp; <i>b</i><sup>2</sup> = ${b2}.<br>Atsakymas: ${ex(res)}. Vidurinių narių nelieka: −<i>ab</i> ir +<i>ab</i> vienas kitą panaikina.`,
    which: t => `Teisinga lygybė: ${ex(t)}. Dažniausios klaidos – pamiršti vidurinį narį 2<i>ab</i> arba supainioti ženklus.`,
    num: (line) => `${ex(line)}<br>Skaičių užrašome kaip apvalaus skaičiaus ir mažo skaičiaus sumą arba skirtumą ir taikome formulę – nepamiršk vidurinio nario 2<i>ab</i>.`,
    numds: (line) => `${ex(line)}<br>Dauginamieji vienodai nutolę nuo apvalaus skaičiaus, todėl tinka formulė ${F3}.`,
    miss: (n, n2, m, s) => `Vidurinis narys yra 2<i>ab</i>: ${m} = 2 · <i>x</i> · ${n}, todėl <i>b</i> = ${n}. Paskutinis narys – <i>b</i><sup>2</sup> = ${n}<sup>2</sup> = ${n2}. Formulė: ${s}.`,
    fact: (out, lines, res) => `Didžiausias bendras daugiklis – ${ex(out)}. Kiekvieną narį dalijame iš jo:<br>${lines.join("<br>")}<br>Atsakymas: ${ex(res)}.<br>Pasitikrink: sudauginus atgal turi gautis pradinis reiškinys.`,
    bin: (b, res) => `Abu dėmenys turi tą patį daugiklį ${b}. Jį iškeliame prieš skliaustus, o kituose skliaustuose lieka tai, kas buvo prie jo: ${ex(res)}.`,
    fds: (src, a, b, res) => `${src} yra dviejų kvadratų skirtumas: <i>a</i> = ${a}, <i>b</i> = ${b}. Pagal formulę <i>a</i><sup>2</sup> − <i>b</i><sup>2</sup> = (<i>a</i> − <i>b</i>)(<i>a</i> + <i>b</i>) gauname ${ex(res)}.`,
    fps: (a, b, s, res) => `Pirmasis narys yra ${a} kvadratas, paskutinis – ${b} kvadratas, o vidurinis narys lygus jų dvigubai sandaugai 2 · ${a} · ${b}. Todėl pagal formulę <i>a</i><sup>2</sup> ${s} 2<i>ab</i> + <i>b</i><sup>2</sup> = (<i>a</i> ${s} <i>b</i>)<sup>2</sup> gauname ${ex(res)}.`,
    fpre: (c, inner, res) => `Pirmiausia iškeliame bendrą daugiklį ${c}: gauname ${c}(${inner}). Tada skliaustuose taikome greitosios daugybos formulę: ${ex(res)}.`,
    whichDs: ok => `${ex(ok)} yra dviejų kvadratų skirtumas, todėl formulė tinka. Kvadratų sumos <i>a</i><sup>2</sup> + <i>b</i><sup>2</sup> pagal šią formulę išskaidyti negalima, o kituose reiškiniuose antrasis narys nėra kvadratas.`,
    whichPs: (ok, a, b, res) => `${ex(ok)}: kraštiniai nariai yra ${a} ir ${b} kvadratai, o vidurinis narys lygus 2 · ${a} · ${b}. Todėl tai ${ex(res)}. Kituose trinariuose netinka vidurinis narys arba paskutinio nario ženklas.`,
    grp1: inter => `Iš kiekvienos poros iškeliame bendrą daugiklį taip, kad skliaustuose liktų tas pats dvinaris: ${ex(inter)}. Kai iškeliamas neigiamas daugiklis, skliaustuose narių ženklai pasikeičia.`,
    grp2: (inter, b, res) => `Reiškinyje ${inter} abu dėmenys turi bendrą daugiklį ${b}. Iškėlę jį prieš skliaustus gauname ${ex(res)}.`,
    csq: (v, b, k, k2, c, rem, sq, res) => `Vidurinio nario koeficientą dalijame pusiau: ${b} : 2 = ${k}. Dvinario kvadratas ${sq} turi laisvąjį narį ${k2}. Turime ${c}, todėl skirtumą prirašome atskirai: ${c} − ${k2} = ${rem}.<br>Atsakymas: ${ex(res)}.`,
    fill: (b, k, k2, res) => `Vidurinis narys yra 2<i>ab</i>, todėl <i>b</i> – pusė koeficiento: ${b} : 2 = ${k}. Trūkstamas narys – <i>b</i><sup>2</sup> = ${k2}. Gauname ${ex(res)}.`
  },
  rules: {
    mul: "Dauginant vienanarius, koeficientai sudauginami, o to paties kintamojo laipsnių rodikliai sudedami: 3<i>x</i> · 2<i>x</i> = 6<i>x</i><sup>2</sup>. Vienodų ženklų daugiklių sandauga teigiama, skirtingų – neigiama.",
    like: "Panašieji nariai turi tą pačią raidinę dalį. Juos sutraukiant sudedami tik koeficientai: 3<i>x</i> + 2<i>x</i> = 5<i>x</i>.",
    side: "Daugyba ir dalyba – atvirkštiniai veiksmai: jei kraštinė · kraštinė = plotas, tai plotas : kraštinė = kita kraštinė.",
    name: "Vienanaris – skaičių ir kintamųjų sandauga, pvz., 6<i>x</i><sup>2</sup>. Daugianaris – vienanarių suma. Dvinaris turi du narius, trinaris – tris. Prieš skaičiuojant narius, panašiuosius narius reikia sutraukti.",
    sq: `${F1}<br>${F2}<br>Vidurinis narys – dviguba abiejų narių sandauga.`,
    ds: `${F3}`,
    fact: "Iškeliant prieš skliaustus: skaičius – didžiausias bendras koeficientų daliklis, kintamasis – mažiausiu laipsniu, kuriuo jis yra visuose nariuose.",
    fds: `<i>a</i><sup>2</sup> − <i>b</i><sup>2</sup> = (<i>a</i> − <i>b</i>)(<i>a</i> + <i>b</i>)<br><i>a</i><sup>2</sup> + 2<i>ab</i> + <i>b</i><sup>2</sup> = (<i>a</i> + <i>b</i>)<sup>2</sup><br><i>a</i><sup>2</sup> − 2<i>ab</i> + <i>b</i><sup>2</sup> = (<i>a</i> − <i>b</i>)<sup>2</sup>`,
    grp: "Grupavimas: narius suskirstome poromis, iš kiekvienos poros iškeliame bendrą daugiklį, o tada iškeliame bendrą dvinarį.",
    csq: "<i>x</i><sup>2</sup> + <i>bx</i> + <i>c</i>: imame pusę koeficiento <i>b</i>, užrašome dvinario kvadratą ir prirašome, kiek laisvasis narys <i>c</i> skiriasi nuo tos pusės kvadrato."
  },

  learn: [
    { name: "Vienanaris, dvinaris, trinaris, daugianaris", level: 0, html: `<p><b>Vienanaris</b> – skaičių ir kintamųjų sandauga: <b class="ex">5</b> <b class="ex">3<i>x</i></b> <b class="ex">−2<i>x</i><sup>2</sup></b> <b class="ex">4<i>ab</i></b></p>
      <p><b>Daugianaris</b> – vienanarių suma. Daugianaris, turintis du narius, vadinamas <b>dvinariu</b> (pvz., <i>x</i> + 3), turintis tris – <b>trinariu</b> (pvz., <i>x</i><sup>2</sup> + 5<i>x</i> + 6).</p>
      <p><b>Panašieji nariai</b> turi tą pačią raidinę dalį. Juos galima sutraukti: <span class="mk-ex">3<i>x</i> + 2<i>x</i> = 5<i>x</i>, &nbsp; <i>x</i><sup>2</sup> + 4<i>x</i> − <i>x</i> + 2 = <i>x</i><sup>2</sup> + 3<i>x</i> + 2</span></p>` },
    { name: "Kaip sudauginti du raidinius reiškinius", level: 0, html: `<p>Kiekvieną pirmojo daugiklio narį dauginame iš kiekvieno antrojo daugiklio nario, tada sutraukiame panašiuosius narius.</p>
      <p>Patogu įsivaizduoti stačiakampį, kurio kraštinės – daugikliai. Jo plotas susideda iš mažesnių stačiakampių – langelių sandaugų:</p>
      <span class="mk-ex">(<i>x</i> + 2)(<i>x</i> + 3) = <i>x</i> · <i>x</i> + <i>x</i> · 3 + 2 · <i>x</i> + 2 · 3 = <i>x</i><sup>2</sup> + 3<i>x</i> + 2<i>x</i> + 6 = <i>x</i><sup>2</sup> + 5<i>x</i> + 6</span>
      <p>Ženklai: (−) · (−) = (+), &nbsp; (−) · (+) = (−). Pavyzdžiui, −2 · (−5) = 10, o <i>x</i> · (−5) = −5<i>x</i>.</p>` },
    { name: "Greitosios daugybos formulės", level: 1, html: `<span class="mk-ex">${F1}</span><span class="mk-ex">${F2}</span><span class="mk-ex">${F3}</span>
      <p>Pavyzdžiai: (<i>x</i> + 5)<sup>2</sup> = <i>x</i><sup>2</sup> + 10<i>x</i> + 25; &nbsp; (3<i>x</i> − 2)<sup>2</sup> = 9<i>x</i><sup>2</sup> − 12<i>x</i> + 4; &nbsp; (<i>x</i> − 7)(<i>x</i> + 7) = <i>x</i><sup>2</sup> − 49.</p>
      <p>Dažna klaida: (<i>x</i> + 5)<sup>2</sup> NĖRA <i>x</i><sup>2</sup> + 25 – trūksta vidurinio nario 2 · <i>x</i> · 5 = 10<i>x</i>. Plotų lentelėje jį sudaro du vienodi stačiakampiai.</p>
      <p>Formulės padeda ir skaičiuoti: 49<sup>2</sup> = (50 − 1)<sup>2</sup> = 2500 − 100 + 1 = 2401; &nbsp; 52 · 48 = (50 + 2)(50 − 2) = 2500 − 4 = 2496.</p>` },
    { name: "Iškėlimas prieš skliaustus", level: 2, html: `<p>Jei visi daugianario nariai turi bendrą daugiklį, jį galima iškelti prieš skliaustus – tai daugybos atvirkštinis veiksmas.</p>
      <span class="mk-ex">6<i>x</i><sup>2</sup> + 9<i>x</i> = 3<i>x</i> · 2<i>x</i> + 3<i>x</i> · 3 = 3<i>x</i>(2<i>x</i> + 3)</span>
      <p>Iškeliame kuo daugiau: skaičių – didžiausią bendrą koeficientų daliklį, kintamąjį – mažiausiu laipsniu. Skliaustuose lieka tai, kas gaunama kiekvieną narį padalijus iš iškelto daugiklio.</p>
      <p>Iškeliant neigiamą daugiklį, skliaustuose ženklai pasikeičia: −3<i>x</i> − 12 = −3(<i>x</i> + 4).</p>
      <p>Bendras daugiklis gali būti ir visas dvinaris: <i>a</i>(<i>x</i> + 2) + <i>b</i>(<i>x</i> + 2) = (<i>x</i> + 2)(<i>a</i> + <i>b</i>).</p>` },
    { name: "Skaidymas dauginamaisiais pagal formules", level: 3, html: `<p>Greitosios daugybos formules galima skaityti ir iš dešinės į kairę:</p>
      <span class="mk-ex"><i>a</i><sup>2</sup> − <i>b</i><sup>2</sup> = (<i>a</i> − <i>b</i>)(<i>a</i> + <i>b</i>)</span><span class="mk-ex"><i>a</i><sup>2</sup> + 2<i>ab</i> + <i>b</i><sup>2</sup> = (<i>a</i> + <i>b</i>)<sup>2</sup></span><span class="mk-ex"><i>a</i><sup>2</sup> − 2<i>ab</i> + <i>b</i><sup>2</sup> = (<i>a</i> − <i>b</i>)<sup>2</sup></span>
      <p>Pavyzdžiai: <i>x</i><sup>2</sup> − 9 = (<i>x</i> − 3)(<i>x</i> + 3); &nbsp; 4<i>x</i><sup>2</sup> − 25 = (2<i>x</i> − 5)(2<i>x</i> + 5); &nbsp; <i>x</i><sup>2</sup> + 6<i>x</i> + 9 = (<i>x</i> + 3)<sup>2</sup>.</p>
      <p>Jei yra bendras daugiklis, pirmiausia iškelk jį: 2<i>x</i><sup>2</sup> − 18 = 2(<i>x</i><sup>2</sup> − 9) = 2(<i>x</i> − 3)(<i>x</i> + 3).</p>
      <p>Kvadratų sumos <i>x</i><sup>2</sup> + 9 pagal šias formules išskaidyti negalima.</p>` },
    { name: "Grupavimas", level: 4, html: `<p>Kai narių keturi ir bendro daugiklio visiems nėra, narius grupuojame poromis:</p>
      <span class="mk-ex"><i>ax</i> + <i>ay</i> + <i>bx</i> + <i>by</i> = <i>a</i>(<i>x</i> + <i>y</i>) + <i>b</i>(<i>x</i> + <i>y</i>) = (<i>x</i> + <i>y</i>)(<i>a</i> + <i>b</i>)</span>
      <p>Skliaustuose turi likti tas pats dvinaris – tada jį galima iškelti. Jei iškeliamas neigiamas daugiklis, ženklai skliaustuose pasikeičia:</p>
      <span class="mk-ex"><i>ax</i> + <i>ay</i> − <i>bx</i> − <i>by</i> = <i>a</i>(<i>x</i> + <i>y</i>) − <i>b</i>(<i>x</i> + <i>y</i>) = (<i>x</i> + <i>y</i>)(<i>a</i> − <i>b</i>)</span>
      <p>Kartais narius pirma reikia sukeisti vietomis, kad greta atsidurtų turintys bendrą daugiklį.</p>` },
    { name: "Dvinario kvadrato išskyrimas", level: 5, html: `<p>Iš kvadratinio trinario <i>x</i><sup>2</sup> + <i>bx</i> + <i>c</i> galima išskirti dvinario kvadratą:</p>
      <span class="mk-ex"><i>x</i><sup>2</sup> + 6<i>x</i> + 5 = (<i>x</i><sup>2</sup> + 6<i>x</i> + 9) − 9 + 5 = (<i>x</i> + 3)<sup>2</sup> − 4</span>
      <p>1. Pusė vidurinio nario koeficiento: 6 : 2 = 3 – tai antrasis dvinario narys. &nbsp; 2. Jo kvadratas: 3<sup>2</sup> = 9. &nbsp; 3. Turime 5, o reikia 9, todėl prirašome 5 − 9 = −4.</p>
      <p>Plytelėmis: <i>x</i><sup>2</sup> plytelė, 6 juostelės <i>x</i> (po 3 prie dviejų kraštinių) ir vienetai kampe. Kampui užpildyti reikia 9 vienetų, o turime 5 – trūksta 4.</p>
      <p>Jei vidurinis narys neigiamas: <i>x</i><sup>2</sup> − 8<i>x</i> + 10 = (<i>x</i> − 4)<sup>2</sup> − 6.</p>` }
  ]
};
})();
