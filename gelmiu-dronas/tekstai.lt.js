/* Gelmių dronas – visi mokiniui rodomi tekstai (lietuvių k.). Verčiant keisti tik šį failą.
   Terminai – pagal Matematikos bendrąją programą (6 kl., „Natūralieji ir sveikieji skaičiai“): „neigiamieji ir teigiamieji
   sveikieji skaičiai, skaičiui priešingas skaičius, sveikųjų skaičių aibė“, „skaičių tiesė“, „algebrinės skaičių sumos
   samprata“, „koordinačių plokštuma“, „koordinatinis ketvirtis“ („koordinačių ašys nepriklauso ketvirčiams“). */
(function(){
"use strict";
const f = n => n < 0 ? "−" + (-n) : "" + n;
const p = n => n < 0 ? "(" + f(n) + ")" : "" + n;
const pl = (n, a) => { n = Math.abs(n); return a[(n % 10 === 1 && n % 100 !== 11) ? 0 : (n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20)) ? 1 : 2]; };
const pad = n => n + " " + pl(n, ["padalą", "padalas", "padalų"]);
const lan = n => n + " " + pl(n, ["langelį", "langelius", "langelių"]);
const kart = n => n + " " + pl(n, ["kartą", "kartus", "kartų"]);
const cmd = s => `<span class="cmd">${s}</span>`;
const ex = s => `<b class="ex">${s}</b>`;
const pt = (x, y) => `(${f(x)}; ${f(y)})`;
const QN = ["", "I", "II", "III", "IV"];

window.MK_T = {
  f, p, pad, pt,
  title: "Gelmių dronas",
  heroA: "Gelmių", heroB: "dronas",
  hero: "Valdyk tyrimų droną, kuris ir skrenda, ir neria. Jūros lygis – nulis, virš jo – teigiamieji skaičiai, po vandeniu – neigiamieji. Pirma apskaičiuok, tada duok komandą.",
  sceneAria: "Skaičių tiesė nuo jūros dugno iki dangaus: jūros lygis pažymėtas nuliu",
  gridAria: "Koordinačių plokštuma",
  levels: [
    ["Skaičių tiesė", "Sveikieji ir priešingi skaičiai, palyginimas"],
    ["Sudėtis", "Komandos „+“: aukštyn ir žemyn"],
    ["Atimtis", "Komandos „−“ ir algebrinė suma"],
    ["Daugyba ir dalyba", "Ženklų taisyklės, komandos „·“ ir „:“"],
    ["Sonaro žemėlapis", "Koordinačių plokštuma ir ketvirčiai"],
    ["Didžioji ekspedicija", "Visos temos kartu · 10 užduočių"]
  ],
  colH: "Ekspedicijos radiniai",
  colP: (n, got, all, rank, need) => got >= all
    ? `Surinkti visi ${all} radiniai. Tavo laipsnis – ${rank}!`
    : `Iš pirmo karto išspręsta užduočių: ${n}. Radinių: ${got} iš ${all}. Iki kito radinio trūksta: ${need}. Laipsnis: ${rank}.`,
  finds: ["Žuvėdros plunksna", "Gintaro gabalėlis", "Kriauklė", "Sidabrinė žuvis", "Jūrų žvaigždė", "Medūza", "Krabas", "Butelis su laišku", "Senas inkaras", "Lobių skrynia"],
  ranks: ["Jūreivis", "Vairininkas", "Šturmanas", "Kapitonas", "Gelmių tyrėjas"],
  pts: "Taškai",
  next: "Toliau →", finish: "Baigti",
  rule: "Paaiškinimas",
  bad: a => `Ne visai. Teisingas atsakymas: ${a}`,
  badPlain: "Ne visai.",
  res: (ok, total, pts, gain) => `Iš pirmo karto: ${ok} iš ${total}. Taškai: ${pts}.` + (gain.length ? `<br><b>${gain.length > 1 ? "Nauji radiniai" : "Naujas radinys"}: ${gain.join(", ")}!</b>` : ""),

  /* ---------- valdymas ---------- */
  fly: "Skristi čia",
  mark: "Pažymėti šį tašką",
  check: "Tikrinti",
  reset: "Iš naujo",
  selNone: "Paliesk skalę ir pasirink padalą.",
  sel: n => `Pasirinkta padala: ${n}`,
  selPtNone: "Paliesk tašką koordinačių plokštumoje.",
  selPt: (x, y) => `Pasirinktas taškas: ${pt(x, y)}`,
  again: "Ne ten. Dronas grįžo atgal – turi dar vieną bandymą.",
  againPt: "Ne tas taškas. Turi dar vieną bandymą.",
  againOrd: "Eilė dar netiksli. Pabandyk dar kartą.",
  ordHint: "Liesk skaičius iš eilės. Suklydai? Paliesk skaičių eilėje – jis grįš atgal.",
  fuel: "Kuras",
  cards: "Komandų kortelės",
  logEmpty: "Čia matysi kiekvienos komandos skaičiavimą.",
  routeQ: (S, G, M, hz) => `Nuvesk droną nuo <b>${S}</b> iki signalo ties <b>${G}</b>. Kuro užteks tik <b>${M} komandoms</b> – pirma apskaičiuok, tada rinkis korteles.` + (hz ? ` <span class="hzl">Raudonoje juostoje (stipri srovė ar vėjo gūsis) sustoti negalima, praskristi – galima.</span>` : ""),
  outOf: "Ši komanda išvestų droną už skalės ribų – ji nevykdoma.",
  notDiv: (x, v) => `${x} nesidalija iš ${v} be liekanos – ši komanda nevykdoma.`,
  hitHaz: n => `Dronas sustojo raudonoje juostoje ties ${n}.`,
  noFuel: "Kuras baigėsi, o signalas nepasiektas.",
  retry: n => ` Dronas grąžinamas į pradžią. Liko bandymų: ${n}.`,
  resetBtn: "Grąžinti droną į pradžią (bandymas prarandamas)",
  gaveUp: "Maršrutas nutrauktas.",
  dead: "Nė vienos likusios komandos įvykdyti nebegalima.",
  win: "Signalas pasiektas!",
  failEnd: "Parodau vieną teisingą maršrutą.",
  wRoute: eqs => `Maršrutas: ${eqs.join("; ")}.`,
  wRouteMore: [
    "",
    "Pridėti teigiamąjį skaičių – kilti aukštyn, pridėti neigiamąjį – leistis žemyn. Verta iš anksto apskaičiuoti, kiek padalų skiria droną ir signalą.",
    "Atimti skaičių – tas pats, kas pridėti jam priešingą skaičių: komanda − (−4) kelia droną 4 padalas aukštyn, o komanda − 4 leidžia 4 padalas žemyn.",
    "Dauginant ar dalijant iš neigiamojo skaičiaus dronas pereina į kitą nulio pusę. Vienodų ženklų skaičių sandauga ir dalmuo teigiami, skirtingų – neigiami.",
    "",
    "Kiekvieną komandą skaičiuok mintyse prieš paliesdamas kortelę: sudėtis ir atimtis stumia droną, daugyba ir dalyba keičia jo atstumą nuo nulio."
  ],

  /* ---------- 1 lygis: skaičių tiesė ---------- */
  q: {
    place: n => `Nuskraidink droną ties skaičiumi <b>${n}</b>.`,
    opp: n => `Dronas yra ties skaičiumi <b>${n}</b>. Nuskraidink jį ties <b>priešingu skaičiumi</b>.`,
    between: (a, b) => `Pažymėk sveikąjį skaičių, kuris yra <b>didesnis už ${a}</b>, bet <b>mažesnis už ${b}</b>.`,
    step: (a, d, up) => `Dronas yra ties <b>${a}</b>. Jis ${up ? "pakyla" : "nusileidžia"} <b>${pad(d)}</b> ${up ? "aukštyn" : "žemyn"}. Pažymėk, kur jis atsidurs.`,
    cmp: max => `Kuris skaičius <b>${max ? "didžiausias" : "mažiausias"}</b>?`,
    stmt: "Kuri nelygybė <b>teisinga</b>?",
    order: asc => `Surikiuok skaičius nuo <b>${asc ? "mažiausio iki didžiausio" : "didžiausio iki mažiausio"}</b>.`,
    fact: "Kuris teiginys <b>teisingas</b>?",
    pred: (a, c) => `Dronas yra ties <b>${a}</b>. Komanda: ${cmd(c)}. Pažymėk, kur dronas atsidurs.`,
    which: (a, b) => `Dronas yra ties <b>${a}</b>, o signalas – ties <b>${b}</b>. Kuri komanda nuves droną tiesiai prie signalo?`,
    zero: a => `Kurį skaičių reikia pridėti prie <b>${a}</b>, kad suma būtų lygi <b>0</b>?`,
    calc: e => `Apskaičiuok: ${ex(e)}`,
    equiv: c => `Kuri komanda nuves droną <b>ten pat</b>, kaip ir komanda ${cmd(c)}?`,
    back: (c, b) => `Įvykdęs komandą ${cmd(c)}, dronas atsidūrė ties <b>${b}</b>. Pažymėk, kur jis buvo prieš tai.`,
    sign: e => `Koks reiškinio ${ex(e)} reikšmės ženklas? Skaičiuoti nebūtina.`,
    miss: e => `Kurį skaičių reikia įrašyti vietoje langelio? ${ex(e)}`,
    tapPt: (x, y) => `Sonaras aptiko signalą taške <b>${pt(x, y)}</b>. Pažymėk šį tašką koordinačių plokštumoje.`,
    readPt: l => `Kokios taško <b>${l}</b> koordinatės?`,
    quad: (x, y) => `Kuriame koordinatiniame ketvirtyje yra taškas <b>${pt(x, y)}</b>?`,
    whichPt: q => `Kuris taškas yra <b>${QN[q]} ketvirtyje</b>?`,
    move: (x, y, dx, dy) => `Dronas yra taške <b>${pt(x, y)}</b>. Jis paslenka <b>${lan(Math.abs(dx))} į ${dx > 0 ? "dešinę" : "kairę"}</b> ir <b>${lan(Math.abs(dy))} ${dy > 0 ? "aukštyn" : "žemyn"}</b>. Pažymėk, kur jis atsidurs.`
  },
  ctx: [
    { s: -1, k: "fish", t: m => `Žuvis plaukia <b>${m} m gylyje</b>. Jūros lygis – tai 0. Pažymėk skalėje skaičių, kuris rodo žuvies padėtį.` },
    { s: 1, k: "gull", t: m => `Žuvėdra skrenda <b>${m} m aukštyje</b> virš jūros lygio. Pažymėk skalėje skaičių, kuris rodo žuvėdros padėtį.` },
    { s: -1, k: "anchor", t: m => `Inkaras nuleistas <b>${m} m žemiau jūros lygio</b>. Pažymėk skalėje skaičių, kuris rodo inkaro padėtį.` },
    { s: 1, k: "balloon", t: m => `Oro zondas pakilo <b>${m} m virš jūros lygio</b>. Pažymėk skalėje skaičių, kuris rodo zondo padėtį.` }
  ],
  signOpts: ["Teigiamas", "Neigiamas", "Reikšmė lygi 0"],
  quadOpts: ["I ketvirtyje", "II ketvirtyje", "III ketvirtyje", "IV ketvirtyje", "Nė viename – taškas yra ašyje"],
  factsT: [
    "Nulis nėra nei teigiamasis, nei neigiamasis skaičius.",
    "Kiekvienas neigiamasis skaičius yra mažesnis už nulį.",
    "Skaičiui 0 priešingas skaičius yra 0.",
    "Dviejų priešingų skaičių suma lygi nuliui.",
    "Iš dviejų neigiamųjų skaičių didesnis tas, kuris skaičių tiesėje yra arčiau nulio.",
    "Kiekvienas teigiamasis skaičius yra didesnis už bet kurį neigiamąjį skaičių.",
    "Skaičiui −7 priešingas skaičius yra 7."
  ],
  factsF: [
    ["−8 yra didesnis už −3, nes 8 > 3.", "−8 &lt; −3: skaičių tiesėje −8 yra žemiau (toliau nuo nulio į neigiamą pusę)."],
    ["Skaičiui −4 priešingas skaičius yra −4.", "Skaičiui −4 priešingas skaičius yra 4."],
    ["Nulis yra neigiamasis skaičius.", "Nulis nėra nei teigiamasis, nei neigiamasis."],
    ["Kiekvienas neigiamasis skaičius yra didesnis už nulį.", "Neigiamieji skaičiai yra mažesni už nulį."],
    ["Skaičius −1 yra mažiausias sveikasis skaičius.", "Mažiausio sveikojo skaičiaus nėra: −2 &lt; −1, −3 &lt; −2 ir taip toliau."],
    ["Dviejų priešingų skaičių suma visada neigiama.", "Priešingų skaičių suma lygi 0, pavyzdžiui, −5 + 5 = 0."],
    ["Priešingi skaičiai skaičių tiesėje yra toje pačioje nulio pusėje.", "Priešingi skaičiai yra skirtingose nulio pusėse, vienodai nuo jo nutolę."],
    ["Tarp skaičių −3 ir −1 nėra nė vieno sveikojo skaičiaus.", "Tarp −3 ir −1 yra sveikasis skaičius −2."],
    ["Skaičius −10 yra didesnis už skaičių 1.", "Bet kuris neigiamasis skaičius mažesnis už bet kurį teigiamąjį: −10 &lt; 1."],
    ["Skaičiui 6 priešingas skaičius yra 0.", "Skaičiui 6 priešingas skaičius yra −6."]
  ],

  /* ---------- paaiškinimai ---------- */
  w: {
    place: n => ({ body: n < 0 ? `Skaičius ${f(n)} neigiamasis – jis yra ${pad(-n)} žemiau nulio (po vandeniu).` : `Skaičius ${n} teigiamasis – jis yra ${pad(n)} aukščiau nulio (virš vandens).`,
      more: "Skaičių tiesėje nulis skiria teigiamuosius ir neigiamuosius skaičius. Mūsų tiesė vertikali: kuo aukščiau, tuo skaičius didesnis. Vadovėliuose tiesė dažniausiai horizontali – ten didesni skaičiai yra dešiniau." }),
    ctx: (m, n) => ({ body: n < 0 ? `Gylis matuojamas žemyn nuo jūros lygio, todėl padėtis žymima neigiamuoju skaičiumi: ${f(n)}.` : `Aukštis matuojamas aukštyn nuo jūros lygio, todėl padėtis žymima teigiamuoju skaičiumi: ${n}.`,
      more: "Jūros lygis – tai nulis. Tai, kas yra virš jo, žymime teigiamaisiais skaičiais, kas žemiau – neigiamaisiais." }),
    opp: n => ({ body: `Skaičiui ${f(n)} priešingas skaičius yra ${f(-n)}.`, more: "Priešingi skaičiai skaičių tiesėje yra vienodai nutolę nuo nulio, tik skirtingose jo pusėse. Jų suma lygi nuliui." }),
    between: (a, c, b) => ({ body: `Tarp ${f(a)} ir ${f(b)} yra tik vienas sveikasis skaičius – ${f(c)}: ${f(a)} &lt; ${f(c)} &lt; ${f(b)}.`, more: "Skaičių tiesėje didesnis skaičius visada yra aukščiau (horizontalioje tiesėje – dešiniau)." }),
    step: (a, d, up, r) => ({ body: `Nuo ${f(a)} skaičiuojame ${pad(d)} ${up ? "aukštyn" : "žemyn"} ir sustojame ties ${f(r)}.`, more: (a > 0 && r < 0) || (a < 0 && r > 0) ? "Pakeliui dronas kerta nulį – jūros lygį. Nulis taip pat yra padala." : "Judant aukštyn skaičiai didėja, judant žemyn – mažėja." }),
    cmp: (max, r) => ({ body: `${max ? "Didžiausias" : "Mažiausias"} skaičius – ${f(r)}: skaičių tiesėje jis yra ${max ? "aukščiausiai" : "žemiausiai"}.`, more: "Iš dviejų neigiamųjų skaičių didesnis tas, kuris arčiau nulio, pavyzdžiui, −3 > −8. Kiekvienas neigiamasis skaičius mažesnis už nulį ir už bet kurį teigiamąjį skaičių." }),
    stmt: (s, big, small) => ({ body: `Teisinga nelygybė: ${s}.`, more: `Skaičių tiesėje ${f(big)} yra aukščiau už ${f(small)}, todėl ${f(big)} didesnis.` }),
    order: (list, asc) => ({ body: `Teisinga eilė: ${list}.`, more: `Skaičių tiesėje tai – ${asc ? "iš apačios į viršų" : "iš viršaus į apačią"}. Neigiamieji skaičiai mažesni už nulį, o iš jų mažesnis tas, kuris toliau nuo nulio.` }),
    fact: (t, wrong) => ({ body: `Teisingas teiginys: „${t}“`, more: wrong.map(x => `<p>✗ „${x[0]}“ – ${x[1]}</p>`).join("") }),
    add: (a, b, r) => ({ body: `${f(a)} + ${p(b)} = ${f(r)}.`,
      more: (b > 0 ? `Pridėti teigiamąjį skaičių ${b} – pakilti ${pad(b)} aukštyn.` : `Pridėti neigiamąjį skaičių ${f(b)} – nusileisti ${pad(-b)} žemyn.`) + ` Nuo ${f(a)} ${b > 0 ? "kylame" : "leidžiamės"}` + ((a > 0 && r < 0) || (a < 0 && r > 0) ? ", kertame nulį" : "") + ` ir sustojame ties ${f(r)}.` }),
    which: (a, b, c) => ({ body: `Tinka komanda ${c}: ${f(a)} ${c} = ${f(b)}.`, more: `Nuo ${f(a)} iki ${f(b)} reikia ${b > a ? "pakilti" : "nusileisti"} ${pad(Math.abs(b - a))}. ${b > a ? "Kylame – pridedame teigiamąjį skaičių." : "Leidžiamės – pridedame neigiamąjį skaičių."}` }),
    zero: a => ({ body: `${f(a)} + ${p(-a)} = 0.`, more: "Priešingų skaičių suma lygi nuliui: dronas grįžta į jūros lygį." }),
    sub: (a, b, r) => ({ body: `${f(a)} − ${p(b)} = ${f(a)} + ${p(-b)} = ${f(r)}.`,
      more: "Atimti skaičių – tas pats, kas pridėti jam priešingą skaičių. " + (b < 0 ? `Todėl atimant neigiamąjį skaičių ${f(b)} dronas kyla ${pad(-b)} aukštyn.` : `Todėl atimant teigiamąjį skaičių ${b} dronas leidžiasi ${pad(b)} žemyn.`) }),
    equiv: (c, c2) => ({ body: `Komanda ${c} veikia taip pat, kaip komanda ${c2}.`, more: "Atimti skaičių – tas pats, kas pridėti jam priešingą skaičių. Todėl „− (−4)“ ir „+ 4“ yra ta pati komanda, taip pat „+ (−4)“ ir „− 4“." }),
    back: (a, c, b, inv) => ({ body: `Dronas buvo ties ${f(a)}: ${f(a)} ${c} = ${f(b)}.`, more: `Norint grįžti atgal, reikia atlikti atvirkštinį veiksmą: ${f(b)} ${inv} = ${f(a)}.` }),
    alg: (e, re, steps, r) => ({ body: `${e} = ${f(r)}.`, more: `Kiekvieną atimtį pakeičiame priešingo skaičiaus pridėjimu – gauname algebrinę sumą: ${re}. Sudedame iš eilės: ${steps.join("; ")}.` }),
    sign2: (same, div) => ({ body: same ? `Abiejų skaičių ženklai vienodi, todėl ${div ? "dalmuo" : "sandauga"} teigiama${div ? "s" : ""}.` : `Skaičių ženklai skirtingi, todėl ${div ? "dalmuo" : "sandauga"} neigiama${div ? "s" : ""}.`, more: "Dviejų vienodų ženklų skaičių sandauga ir dalmuo yra teigiami, skirtingų ženklų – neigiami." }),
    sign3: (steps, neg) => ({ body: `Dauginame iš eilės: ${steps.join("; ")}. Reikšmė ${neg ? "neigiama" : "teigiama"}.`, more: "Jei neigiamųjų dauginamųjų skaičius lyginis, sandauga teigiama, jei nelyginis – neigiama." }),
    sign0: () => ({ body: "Vienas dauginamasis lygus 0, todėl visa sandauga lygi 0.", more: "Bet kurį skaičių padauginę iš nulio gauname nulį. Nulis nėra nei teigiamasis, nei neigiamasis." }),
    mul: (e, a, b, r, div) => ({ body: `${e} = ${f(r)}.`, more: `${Math.abs(a)} ${div ? ":" : "·"} ${Math.abs(b)} = ${Math.abs(r)}. Ženklai ${(a < 0) === (b < 0) ? "vienodi" : "skirtingi"}, todėl ${div ? "dalmuo" : "sandauga"} ${(a < 0) === (b < 0) ? "teigiama" : "neigiama"}${div ? "s" : ""}.` }),
    miss: (inv, chk) => ({ body: `${inv}.`, more: `Tikriname: ${chk}.` }),
    predMul: (a, k, r) => ({ body: `${f(a)} · ${p(k)} = ${f(r)}.`, more: Math.abs(k) === 1 ? "Padauginę skaičių iš −1 gauname jam priešingą skaičių: dronas pereina į kitą nulio pusę tuo pačiu atstumu." : `Atstumas nuo nulio padidėja ${kart(Math.abs(k))}` + (k < 0 ? ", o neigiamasis daugiklis perkelia droną į kitą nulio pusę." : ", dronas lieka toje pačioje nulio pusėje.") }),
    predDiv: (a, k, r) => ({ body: `${f(a)} : ${p(k)} = ${f(r)}.`, more: `Atstumas nuo nulio sumažėja ${kart(Math.abs(k))}` + (k < 0 ? ", o neigiamasis daliklis perkelia droną į kitą nulio pusę." : ", dronas lieka toje pačioje nulio pusėje.") }),
    expr: (e, steps, r) => ({ body: `${e} = ${f(r)}.`, more: `Pirmiausia atliekame veiksmus skliaustuose, tada daugybą ir dalybą, galiausiai – sudėtį ir atimtį: ${steps.join("; ")}.` }),
    word: (e, r, u, more) => ({ body: `${e} = ${f(r)}${u}.`, more }),
    tapPt: (x, y) => ({ body: `Taškas ${pt(x, y)}: nuo koordinačių pradžios ${x === 0 ? "į šalis nejudame" : lan(Math.abs(x)) + (x > 0 ? " į dešinę" : " į kairę")}, tada ${y === 0 ? "aukštyn ar žemyn nejudame" : lan(Math.abs(y)) + (y > 0 ? " aukštyn" : " žemyn")}.`,
      more: "Pirmoji koordinatė (x) rodo vietą išilgai horizontaliosios ašies: teigiama – į dešinę, neigiama – į kairę. Antroji koordinatė (y) – išilgai vertikaliosios ašies: teigiama – aukštyn, neigiama – žemyn." }),
    readPt: (l, x, y) => ({ body: `Taško ${l} koordinatės yra ${pt(x, y)}.`, more: `Iš taško nuleidžiame statmenis į ašis: x ašyje randame ${f(x)}, y ašyje – ${f(y)}. Pirmoji visada rašoma x koordinatė, antroji – y.` }),
    quad: (x, y, q) => ({ body: `Taško ${pt(x, y)} pirmoji koordinatė ${x > 0 ? "teigiama" : "neigiama"}, antroji – ${y > 0 ? "teigiama" : "neigiama"}. Tai ${QN[q]} ketvirtis.`, more: "Ketvirčiai numeruojami prieš laikrodžio rodyklę: I – (+; +), II – (−; +), III – (−; −), IV – (+; −). Koordinačių ašys ketvirčiams nepriklauso." }),
    quadAxis: (x, y) => ({ body: `Taško ${pt(x, y)} ${x === 0 && y === 0 ? "abi koordinatės lygios 0 – tai koordinačių pradžia, abiejų ašių susikirtimo taškas" : x === 0 ? "pirmoji koordinatė lygi 0, todėl jis yra y ašyje" : "antroji koordinatė lygi 0, todėl jis yra x ašyje"}.`, more: "Koordinačių ašys nepriklauso nė vienam ketvirčiui." }),
    whichPt: (l, x, y, q) => ({ body: `${QN[q]} ketvirtyje yra taškas ${l}${pt(x, y)}.`, more: "I ketvirtis – (+; +), II – (−; +), III – (−; −), IV – (+; −)." }),
    move: (x, y, dx, dy, nx, ny) => ({ body: `Dronas atsidurs taške ${pt(nx, ny)}.`, more: `Judant į ${dx > 0 ? "dešinę" : "kairę"} keičiasi pirmoji koordinatė: ${f(x)} + ${p(dx)} = ${f(nx)}. Judant ${dy > 0 ? "aukštyn" : "žemyn"} keičiasi antroji: ${f(y)} + ${p(dy)} = ${f(ny)}.` })
  },

  /* ---------- tekstiniai uždaviniai: a ir b – atsitiktiniai skaičiai iš nurodytų rėžių ---------- */
  words: {
    add: [
      { a: [-12, -1], b: [2, 15], c: (a, b) => a + b, u: " °C", t: (a, b) => `Ryte termometras rodė <b>${f(a)} °C</b>. Iki vidurdienio temperatūra pakilo <b>${b} °C</b>. Kokia temperatūra buvo vidurdienį?`, e: (a, b) => `${f(a)} + ${b}`, m: "Temperatūra pakilo – pridedame teigiamąjį skaičių." },
      { a: [-6, 7], b: [3, 12], c: (a, b) => a - b, u: " °C", t: (a, b) => `Vakare buvo <b>${f(a)} °C</b>. Per naktį temperatūra nukrito <b>${b} °C</b>. Kokia temperatūra buvo ryte?`, e: (a, b) => `${f(a)} + (−${b})`, m: "Temperatūra nukrito – pridedame neigiamąjį skaičių." },
      { a: [12, 30], b: [2, 11], c: (a, b) => -a + b, u: " m", t: (a, b) => `Naras buvo <b>${a} m gylyje</b>, taigi jo padėtis buvo ${f(-a)} m. Jis pakilo <b>${b} m</b> aukštyn. Kokia nario padėtis dabar?`, e: (a, b) => `${f(-a)} + ${b}`, m: "Naras kyla – pridedame teigiamąjį skaičių. Jis vis dar po vandeniu, todėl padėtis neigiama." },
      { a: [-9, 6], b: [2, 9], c: (a, b) => a - b, u: "", t: (a, b) => `Žaidime Ugnės rezultatas buvo <b>${f(a)}</b>. Už klaidą jos rezultatas pasikeitė <b>${f(-b)}</b>. Koks rezultatas dabar?`, e: (a, b) => `${f(a)} + (−${b})`, m: "Baudos taškai – neigiamasis skaičius, jį pridedame prie rezultato." },
      { a: [-20, -3], b: [5, 30], c: (a, b) => a + b, u: " €", t: (a, b) => `Tomo sąskaitos likutis buvo <b>${f(a)} €</b> (Tomas skolingas). Jis įmokėjo <b>${b} €</b>. Koks likutis dabar?`, e: (a, b) => `${f(a)} + ${b}`, m: "Įmoka didina likutį – pridedame teigiamąjį skaičių." }
    ],
    sub: [
      { a: [-3, 9], b: [-15, -4], c: (a, b) => a - b, u: " °C", t: (a, b) => `Dieną buvo <b>${f(a)} °C</b>, o naktį – <b>${f(b)} °C</b>. Kiek laipsnių skiriasi dienos ir nakties temperatūra?`, e: (a, b) => `${f(a)} − ${p(b)}`, m: "Iš didesnės temperatūros atimame mažesnę. Atimti neigiamąjį skaičių – tas pats, kas pridėti jam priešingą." },
      { a: [3, 15], b: [2, 12], c: (a, b) => a + b, u: " m", t: (a, b) => `Žuvėdra skrenda <b>${a} m aukštyje</b>, o žuvis plaukia <b>${b} m gylyje</b> tiesiai po ja. Koks atstumas tarp žuvėdros ir žuvies?`, e: (a, b) => `${a} − (−${b})`, m: "Žuvies padėtis žymima neigiamuoju skaičiumi. Iš aukštesnės padėties atimame žemesnę." },
      { a: [-9, 9], b: [-9, 9], c: (a, b) => b - a, u: "", t: (a, b) => `Dronas buvo ties <b>${f(a)}</b>, o dabar yra ties <b>${f(b)}</b>. Kiek pasikeitė jo padėtis? (Pokytis = nauja padėtis − ankstesnė padėtis.)`, e: (a, b) => `${f(b)} − ${p(a)}`, m: "Teigiamas pokytis reiškia, kad dronas pakilo, neigiamas – kad nusileido." }
    ],
    mul: [
      { a: [2, 6], b: [2, 9], c: (a, b) => -a * b, u: " m", t: (a, b) => `Dronas neria tolygiai: kas minutę jo padėtis pasikeičia <b>${f(-a)} m</b>. Kiek pasikeis jo padėtis per <b>${b} min.</b>?`, e: (a, b) => `${f(-a)} · ${b}`, m: "Tas pats neigiamas pokytis kartojasi kelis kartus – dauginame. Ženklai skirtingi, todėl sandauga neigiama." },
      { a: [2, 6], b: [2, 9], c: (a, b) => -a, u: " °C", t: (a, b) => `Per <b>${b} dienas</b> temperatūra iš viso pasikeitė <b>${f(-a * b)} °C</b>, kasdien vienodai. Kiek ji pasikeisdavo per vieną dieną?`, e: (a, b) => `${f(-a * b)} : ${b}`, m: "Visą pokytį daliname iš dienų skaičiaus. Ženklai skirtingi, todėl dalmuo neigiamas." },
      { a: [2, 9], b: [2, 9], c: (a, b) => -a * b, u: "", t: (a, b) => `Žaidime už kiekvieną klaidą rezultatas pasikeičia <b>${f(-a)}</b>. Domas suklydo <b>${kart(b)}</b>. Kiek dėl klaidų pasikeitė jo rezultatas?`, e: (a, b) => `${f(-a)} · ${b}`, m: "Tas pats neigiamas pokytis kartojasi kelis kartus – dauginame." }
    ]
  },

  /* ---------- „Noriu pasimokyti“ ---------- */
  learn: [
    { name: "Sveikieji skaičiai ir skaičių tiesė", level: 0, html: "<p><b>Teigiamieji sveikieji skaičiai</b> – tai 1, 2, 3, … <b>Neigiamieji sveikieji skaičiai</b> – tai −1, −2, −3, … Visi jie kartu su nuliu sudaro <b>sveikųjų skaičių aibę</b>. Nulis nėra nei teigiamasis, nei neigiamasis.</p><p>Neigiamaisiais skaičiais žymime tai, kas yra „žemiau nulio“: temperatūrą šąlant, gylį po jūros lygiu, skolą.</p><p>Žaidime skaičių tiesė vertikali: <b>jūros lygis – tai 0</b>, virš vandens – teigiamieji skaičiai, po vandeniu – neigiamieji. Vadovėliuose tiesė dažniausiai horizontali: teigiamieji skaičiai – dešinėje nuo nulio, neigiamieji – kairėje.</p>" },
    { name: "Priešingi skaičiai ir palyginimas", level: 0, html: "<p><b>Priešingi skaičiai</b> skaičių tiesėje yra vienodai nutolę nuo nulio, tik skirtingose jo pusėse: 5 ir −5, −2 ir 2. Skaičiui 0 priešingas yra 0.</p><p><b>Palyginimas.</b> Didesnis tas skaičius, kuris skaičių tiesėje yra aukščiau (horizontalioje tiesėje – dešiniau):</p><ul><li>kiekvienas neigiamasis skaičius mažesnis už 0 ir už bet kurį teigiamąjį;</li><li>iš dviejų neigiamųjų didesnis tas, kuris arčiau nulio: <b>−3 > −8</b>.</li></ul><span class=\"mk-ex\">−8 &lt; −3 &lt; 0 &lt; 4</span>" },
    { name: "Sudėtis", level: 1, html: "<p>Sudėtį patogu įsivaizduoti kaip judėjimą skaičių tiese:</p><ul><li><b>pridėti teigiamąjį</b> skaičių – kilti aukštyn;</li><li><b>pridėti neigiamąjį</b> skaičių – leistis žemyn.</li></ul><span class=\"mk-ex\">−3 + 5 = 2 (nuo −3 penkios padalos aukštyn)<br>−3 + (−5) = −8 (nuo −3 penkios padalos žemyn)<br>4 + (−9) = −5 (leidžiamės ir kertame nulį)</span><p>Priešingų skaičių suma lygi nuliui: −6 + 6 = 0.</p><p>Neigiamasis skaičius po veiksmo ženklo rašomas skliaustuose: 4 + (−9).</p>" },
    { name: "Atimtis ir algebrinė suma", level: 2, html: "<p><b>Atimti skaičių – tas pats, kas pridėti jam priešingą skaičių.</b></p><span class=\"mk-ex\">2 − 7 = 2 + (−7) = −5<br>−2 − (−6) = −2 + 6 = 4<br>−4 − 3 = −4 + (−3) = −7</span><p>Todėl kiekvieną reiškinį su sudėtimi ir atimtimi galima užrašyti kaip <b>algebrinę sumą</b> – vien tik sudėties veiksmais:</p><span class=\"mk-ex\">−3 + 7 − 5 − (−2) = −3 + 7 + (−5) + 2 = 1</span>" },
    { name: "Daugyba ir dalyba", level: 3, html: "<p>Pirmiausia dauginame arba daliname skaičius be ženklų, tada nustatome rezultato ženklą:</p><ul><li>ženklai <b>vienodi</b> – rezultatas <b>teigiamas</b>: (−4) · (−5) = 20, −18 : (−3) = 6;</li><li>ženklai <b>skirtingi</b> – rezultatas <b>neigiamas</b>: −4 · 5 = −20, 18 : (−3) = −6.</li></ul><p>Padauginę skaičių iš −1 gauname jam priešingą skaičių. Padauginę iš 0 gauname 0.</p><p>Žaidime komanda „· (−2)“ droną nukelia dvigubai toliau nuo nulio ir į kitą jo pusę.</p>" },
    { name: "Koordinačių plokštuma", level: 4, html: "<p>Koordinačių plokštumą sudaro dvi statmenos skaičių tiesės – <b>koordinačių ašys</b>: horizontalioji x ir vertikalioji y. Jos kertasi koordinačių pradžioje – taške (0; 0).</p><p>Taško vieta nusakoma skaičių pora <b>(x; y)</b>: pirmoji koordinatė rodo, kiek eiti į dešinę (jei teigiama) ar į kairę (jei neigiama), antroji – kiek aukštyn ar žemyn.</p><p>Ašys dalija plokštumą į keturis <b>koordinatinius ketvirčius</b>: I – (+; +), II – (−; +), III – (−; −), IV – (+; −). Taškai, esantys ašyse, ketvirčiams nepriklauso.</p>" },
    { name: "Kaip įveikti maršrutų užduotis", level: 5, html: "<p>Maršruto užduotyje dronas turi pasiekti signalą, o kuro užtenka tik kelioms komandoms. Kortelių yra daugiau, nei reikia, todėl spėlioti neverta.</p><ul><li>Pirmiausia apskaičiuok, kiek padalų ir kuria kryptimi skiria droną nuo signalo.</li><li>Kiekvienos kortelės poveikį apskaičiuok mintyse: + (−4) – žemyn, − (−4) – aukštyn.</li><li>Raudonoje juostoje sustoti negalima, bet praskristi pro ją galima – kartais užtenka sukeisti komandų eilę.</li></ul>" }
  ]
};
})();
