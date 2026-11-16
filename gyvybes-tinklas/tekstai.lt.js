/* MokomėsKartu.lt – „Gyvybės tinklas“ (8 kl., biologija): visi mokiniui rodomi tekstai.
   Organizmų pavadinimai: n – vns. vardininkas, d – dgs. vardininkas, k – dgs. kilmininkas, i – dgs. įnagininkas. */
(function(){
"use strict";
const o = s => { const p = s.split("|"); return { n: p[0], d: p[1], k: p[2], i: p[3] }; };
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const nf = x => String(x).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
const org = {
  azuolas: o("ąžuolas|ąžuolai|ąžuolų|ąžuolais"), egle: o("eglė|eglės|eglių|eglėmis"), melyne: o("mėlynė|mėlynės|mėlynių|mėlynėmis"), lazdynas: o("lazdynas|lazdynai|lazdynų|lazdynais"),
  zole: o("žolė|žolė|žolės|žole"), dobilas: o("dobilas|dobilai|dobilų|dobilais"), kiaulpiene: o("kiaulpienė|kiaulpienės|kiaulpienių|kiaulpienėmis"),
  fitopl: o("fitoplanktonas|fitoplanktonas|fitoplanktono|fitoplanktonu"), nendre: o("nendrė|nendrės|nendrių|nendrėmis"), plude: o("plūdė|plūdės|plūdžių|plūdėmis"), banguolis: o("banguolis|banguoliai|banguolių|banguoliais"),
  kvieciai: o("kviečiai|kviečiai|kviečių|kviečiais"), usnis: o("usnis|usnys|usnių|usnimis"), rugiagele: o("rugiagėlė|rugiagėlės|rugiagėlių|rugiagėlėmis"),
  obelis: o("obelis|obelys|obelų|obelimis"), kopustas: o("kopūstas|kopūstai|kopūstų|kopūstais"), braske: o("braškė|braškės|braškių|braškėmis"),
  vovere: o("voverė|voverės|voverių|voverėmis"), pele: o("pelė|pelės|pelių|pelėmis"), pelenas: o("pelėnas|pelėnai|pelėnų|pelėnais"), stirna: o("stirna|stirnos|stirnų|stirnomis"),
  kiskis: o("kiškis|kiškiai|kiškių|kiškiais"), lape: o("lapė|lapės|lapių|lapėmis"), vilkas: o("vilkas|vilkai|vilkų|vilkais"), lusis: o("lūšis|lūšys|lūšių|lūšimis"),
  kiaune: o("kiaunė|kiaunės|kiaunių|kiaunėmis"), zebenkstis: o("žebenkštis|žebenkštys|žebenkščių|žebenkštimis"), bebras: o("bebras|bebrai|bebrų|bebrais"), udra: o("ūdra|ūdros|ūdrų|ūdromis"),
  kate: o("katė|katės|kačių|katėmis"), audine: o("kanadinė audinė|kanadinės audinės|kanadinių audinių|kanadinėmis audinėmis"), mangutas: o("mangutas|mangutai|mangutų|mangutais"),
  ezys: o("ežys|ežiai|ežių|ežiais"), ruonis: o("ruonis|ruoniai|ruonių|ruoniais"),
  kinivarpa: o("kinivarpa|kinivarpos|kinivarpų|kinivarpomis"), boruze: o("boružė|boružės|boružių|boružėmis"), meslavabalis: o("mėšlavabalis|mėšlavabaliai|mėšlavabalių|mėšlavabaliais"),
  viksras: o("vikšras|vikšrai|vikšrų|vikšrais"), amaras: o("amaras|amarai|amarų|amarais"), skeriukas: o("skėriukas|skėriukai|skėriukų|skėriukais"), kamane: o("kamanė|kamanės|kamanių|kamanėmis"),
  sraige: o("sraigė|sraigės|sraigių|sraigėmis"), kudrinuke: o("kūdrinukė|kūdrinukės|kūdrinukių|kūdrinukėmis"), sliuzas: o("šliužas|šliužai|šliužų|šliužais"),
  zoopl: o("zooplanktonas|zooplanktonas|zooplanktono|zooplanktonu"), midija: o("midija|midijos|midijų|midijomis"), soniplauka: o("šoniplauka|šoniplaukos|šoniplaukų|šoniplaukomis"),
  lerva: o("laumžirgio lerva|laumžirgių lervos|laumžirgių lervų|laumžirgių lervomis"),
  zyle: o("zylė|zylės|zylių|zylėmis"), genys: o("genys|geniai|genių|geniais"), dagilis: o("dagilis|dagiliai|dagilių|dagiliais"), strazdas: o("strazdas|strazdai|strazdų|strazdais"), kurapka: o("kurapka|kurapkos|kurapkų|kurapkomis"),
  vanagas: o("vanagas|vanagai|vanagų|vanagais"), suopis: o("suopis|suopiai|suopių|suopiais"), zuvininkas: o("žuvininkas|žuvininkai|žuvininkų|žuvininkais"), peleda: o("pelėda|pelėdos|pelėdų|pelėdomis"),
  gandras: o("gandras|gandrai|gandrų|gandrais"), garnys: o("garnys|garniai|garnių|garniais"), gulbe: o("gulbė|gulbės|gulbių|gulbėmis"), ledine: o("ledinė antis|ledinės antys|ledinių ančių|ledinėmis antimis"), kormoranas: o("kormoranas|kormoranai|kormoranų|kormoranais"),
  kuoja: o("kuoja|kuojos|kuojų|kuojomis"), auksle: o("aukšlė|aukšlės|aukšlių|aukšlėmis"), eserys: o("ešerys|ešeriai|ešerių|ešeriais"), lydeka: o("lydeka|lydekos|lydekų|lydekomis"),
  strimele: o("strimelė|strimelės|strimelių|strimelėmis"), sprotas: o("šprotas|šprotai|šprotų|šprotais"), menke: o("menkė|menkės|menkių|menkėmis"), lasisa: o("lašiša|lašišos|lašišų|lašišomis"),
  grundalas: o("juodažiotis grundalas|juodažiočiai grundalai|juodažiočių grundalų|juodažiočiais grundalais"), "plekšne": o("plekšnė|plekšnės|plekšnių|plekšnėmis"),
  varle: o("varlė|varlės|varlių|varlėmis"), rupuze: o("rupūžė|rupūžės|rupūžių|rupūžėmis"), driezas: o("driežas|driežai|driežų|driežais"), zaltys: o("žaltys|žalčiai|žalčių|žalčiais"),
  sliekas: o("sliekas|sliekai|sliekų|sliekais"), bakterijos: o("bakterijos|bakterijos|bakterijų|bakterijomis"), pelesis: o("pelėsis|pelėsiai|pelėsių|pelėsiais"), erke: o("erkė|erkės|erkių|erkėmis"), blusa: o("blusa|blusos|blusų|blusomis")
};
/* tikslesnis „kuo minta“ (įnagininkas) kai kuriems ryšiams: "ėdikas>maistas" */
const part = {
  "vovere>egle": "eglių sėklomis", "vovere>azuolas": "ąžuolų gilėmis", "vovere>lazdynas": "lazdynų riešutais", "pele>azuolas": "ąžuolų gilėmis", "pele>lazdynas": "lazdynų riešutais", "pele>melyne": "mėlynių uogomis",
  "stirna>melyne": "mėlynių ūgliais", "stirna>azuolas": "ąžuolų lapais ir gilėmis", "stirna>lazdynas": "lazdynų lapais ir ūgliais", "kinivarpa>egle": "eglių luobu po žieve", "viksras>azuolas": "ąžuolų lapais", "genys>egle": "eglių sėklomis",
  "kamane>dobilas": "dobilų nektaru ir žiedadulkėmis", "kamane>kiaulpiene": "kiaulpienių nektaru ir žiedadulkėmis", "gulbe>plude": "plūdėmis ir kitais vandens augalais", "bebras>nendre": "nendrėmis ir kitais pakrančių augalais",
  "dagilis>usnis": "usnių sėklomis", "kurapka>usnis": "usnių ir kitų piktžolių sėklomis", "kurapka>kvieciai": "kviečių grūdais", "pelenas>kvieciai": "kviečių grūdais ir želmenimis", "kiskis>kvieciai": "kviečių želmenimis",
  "pelenas>rugiagele": "rugiagėlių sėklomis", "amaras>kvieciai": "kviečių sultimis", "amaras>obelis": "obelų lapų sultimis", "amaras>kopustas": "kopūstų sultimis", "strazdas>braske": "braškių uogomis",
  "sliuzas>braske": "braškių uogomis ir lapais", "viksras>kopustas": "kopūstų lapais", "sliuzas>kopustas": "kopūstų lapais", "soniplauka>banguolis": "banguoliais ir kitais dumbliais", "midija>fitopl": "iš vandens košiamu fitoplanktonu"
};
const GR = { G: "gamintojas", A: "augalėdis", P: "plėšrūnas", S: "skaidytojas", Z: "parazitas" };
const GRD = { G: "Gamintojai", A: "Augalėdžiai", P: "Plėšrūnai", S: "Skaidytojai", Z: "Parazitai" };
const ord = ["", "pirmam", "antram", "trečiam", "ketvirtam", "penktam"], rom = ["", "I", "II", "III", "IV", "V"];
const f = (n, w) => { const p = w.split("|"), d = n % 10, h = n % 100; return n + " " + (d === 1 && h !== 11 ? p[0] : d >= 2 && (h < 10 || h >= 20) ? p[1] : p[2]); };
const ex = s => `<span class="mk-ex">${s}</span>`;

window.MK_T = {
  org, part, cap, nf, f, GR, GRD, ord, rom,
  title: "Gyvybės tinklas",
  heroA: "Gyvybės", heroB: "tinklas",
  hero: "Gamtininkė Rasa tyrinėja Lietuvos ekosistemas: kas kuo minta, kur keliauja energija ir kas nutiks, jei viena rūšis išnyks. Padėk jai sudėti mitybos grandines ir tinklus.",
  heroAria: "Gamtininkė Rasa su žiūronais prie ežero ir miško; virš jos – mitybos grandinė žolė, kiškis, lapė",
  pts: "Taškai", next: "Toliau →", finish: "Baigti", check: "Tikrinti", giveUp: "Parodyk likusius",
  eco: { miskas: "Miškas", pieva: "Pieva", ezeras: "Ežeras", jura: "Baltijos jūra", laukas: "Javų laukas", sodas: "Sodas ir daržas" },
  ecoIn: { miskas: "miške", pieva: "pievoje", ezeras: "ežere", jura: "Baltijos jūroje", laukas: "javų lauke", sodas: "sode ir darže" },
  ecoTag: e => `Ekosistema: ${e}`,
  levels: [
    { id: "grandine", name: "Mitybos grandinė", sub: "Sudėk grandinę nuo gamintojo iki plėšrūno" },
    { id: "grupes", name: "Kas yra kas?", sub: "Gamintojai, gyvėdžiai, skaidytojai" },
    { id: "tinklas", name: "Mitybos tinklas", sub: "Sujunk rodyklėmis: kas kuo minta" },
    { id: "energija", name: "Lygmenys ir energija", sub: "Mitybos lygmenys, energijos kelias" },
    { id: "stabilumas", name: "Kas nutiks, jei…?", sub: "Išnyko rūšis, atkeliavo invazinė" },
    { id: "egzaminas", name: "Ekologo egzaminas", sub: "10 mišrių užduočių" }
  ],
  colH: "Rasos lauko užrašai", colOpen: "Atversti užrašus",
  colP: (n, all, rank) => `Organizmas patenka į užrašus, kai užduotį su juo išsprendi iš pirmo karto. Aprašyta: <b>${n} iš ${all}</b>. Tavo vardas: <b>${rank}</b>.`,
  ranks: ["Stebėtojas", "Jaunasis gamtininkas", "Ekologas", "Rezervato sargas"],
  colNew: n => `Nauji organizmai užrašuose: ${n}`,
  res: (ok, n, p) => `Iš pirmo karto: ${ok} iš ${n}. Taškai: ${p}.`,
  bad: "Dar ne. Pagalvok ir pabandyk dar kartą.",
  ans: a => `Teisingas atsakymas: ${a}`,
  shown: "Parodžiau teisingą sprendimą.",
  /* --- grandinė --- */
  ordQ: e => `Sudėk mitybos grandinę ${e}. Pradėk nuo gamintojo.`,
  ordHint: "Paliesk organizmą – jis atsistos į pirmą laisvą vietą. Rodyklė rodo, kam atitenka maisto medžiagos ir energija.",
  ordBad1: n => n === 1 ? "Viena rodyklė neteisinga (pažymėta raudonai). Pataisyk." : `Neteisingų rodyklių: ${n} (pažymėtos raudonai). Pataisyk.`,
  ordBadStart: "Grandinė turi prasidėti gamintoju – augalu ar dumbliu.",
  chainWhy: (names, sent) => `${ex(names.join(" → "))}${sent} Rodyklė visada nukreipta nuo suėdamo organizmo į tą, kuris juo minta.`,
  eatS: (e, f) => `${cap(e)} minta ${f}.`,
  misQ: "Kurio organizmo trūksta šioje mitybos grandinėje?",
  misWhy: (x, prev, next) => `Čia tinka <b>${x}</b>${prev ? `: ${prev}` : ""}${next ? `${prev ? ", o " : ": "}${next}` : ""}.`,
  misP: (x, f) => `${x} minta ${f}`, misN: (e, x) => `${e} minta ${x}`,
  rightQ: "Kuri mitybos grandinė užrašyta teisingai?",
  rightWhy: "Grandinė prasideda gamintoju, o rodyklė rodo nuo suėdamo organizmo į tą, kuris juo minta. Atvirkščiai užrašytoje grandinėje energija „keliautų“ iš plėšrūno į augalą – taip nebūna.",
  /* --- grupės --- */
  sortQ: e => `Suskirstyk organizmus į funkcines grupes (${e}).`,
  sortHint: "Paliesk organizmą, tada – grupę.",
  sortBad1: n => `Ne savo grupėje: ${n}. Pažymėjau raudonai – pataisyk.`,
  sortWhyG: "pats pasigamina organinių medžiagų fotosintezės metu",
  sortWhyE: f => `minta ${f}`,
  sortWhyX: { sliekas: "minta negyvų augalų liekanomis dirvožemyje", bakterijos: "skaido negyvų organizmų liekanas iki mineralinių medžiagų", pelesis: "grybas, skaidantis negyvas organines medžiagas", meslavabalis: "minta gyvūnų mėšlu ir padeda jam suirti",
    erke: "siurbia gyvūnų kraują, bet šeimininko nenužudo", blusa: "siurbia gyvūnų kraują, bet šeimininko nenužudo" },
  sortLine: (n, g, why) => `<b>${cap(n)}</b> – ${g}: ${why}.`,
  oddQ: "Trys iš šių organizmų priklauso tai pačiai funkcinei grupei. Kuris – ne?",
  oddWhy: (x, gx, g3) => `${g3} čia trys, o <b>${x}</b> – ${gx}.`,
  pickQ: g => ({ G: "Kuris iš šių organizmų yra gamintojas?", A: "Kuris iš šių organizmų yra augalėdis?", P: "Kuris iš šių organizmų yra plėšrūnas?", S: "Kuris iš šių organizmų yra skaidytojas?", Z: "Kuris iš šių organizmų yra parazitas?" }[g]),
  /* --- tinklas --- */
  netQ: (e, n) => `Sudėk mitybos tinklą ${e}: surask visus mitybos ryšius (jų yra ${n}).`,
  netHint: "Pirmiausia paliesk organizmą, kurį ėda, tada – tą, kuris juo minta. Rodyklė nusibrėš pati.",
  netSel: n => `Pasirinkta: <b>${n}</b>. Dabar paliesk, kas šiuo organizmu minta.`,
  netCnt: (a, b) => `Ryšiai: ${a} / ${b}`, netErr: n => `Klaidos: ${n}`,
  netOk: (f, e) => `✓ ${f} → ${e}`,
  netDup: "Šis ryšys jau pažymėtas.",
  netRev: (f, e) => `Atvirkščiai! ${cap(e)} minta ${f}, todėl rodyklė turi eiti į ėdantįjį: pirma paliesk tą, kurį ėda.`,
  netG: n => `${cap(n)} – gamintojai: nieko neėda, o organinių medžiagų pasigamina fotosintezės metu.`,
  netA: n => `${cap(n)} – augalėdžiai, gyvūnais neminta.`,
  netP: n => `${cap(n)} – plėšrūnai, augalais neminta.`,
  netSoft: "Tokio ryšio šiame tinkle nežymime. Ieškok svarbiausių mitybos ryšių.",
  netWhy: (n, list) => `Šiame tinkle – ${f(n, "mitybos ryšys|mitybos ryšiai|mitybos ryšių")}: ${list}. Mitybos tinklas – tai kelios susipynusios mitybos grandinės.`,
  /* --- lygmenys ir energija --- */
  lvlQ: x => `Kuriam mitybos lygmeniui šioje grandinėje priklauso <b>${x}</b>?`,
  lvlOpt: i => `${rom[i]} (${ord[i]})`,
  lvlWhy: (x, i) => `Gamintojai sudaro I mitybos lygmenį, jais mintantys augalėdžiai – II, augalėdžius ėdantys plėšrūnai – III ir t. t. Šioje grandinėje <b>${x}</b> yra ${i}-as narys, taigi priklauso ${rom[i]} lygmeniui.`,
  twoQ: "Kuris šio tinklo organizmas skirtingose mitybos grandinėse priklauso skirtingiems mitybos lygmenims?",
  twoWhy: (x, a, b, ca, cb) => `<b>${cap(x)}</b>: grandinėje ${ex(ca)} – ${rom[a]} lygmuo, o grandinėje ${ex(cb)} – ${rom[b]} lygmuo. Mitybos tinkle tas pats organizmas gali priklausyti keliems lygmenims.`,
  cntQ: x => `Kiek skirtingų mitybos grandinių šiame tinkle baigiasi organizmu <b>${x}</b>? Kiekviena grandinė prasideda gamintoju.`,
  cntWhy: (n, list) => `Tokių grandinių – ${n}:${ex(list)}Eik nuo organizmo atgal prieš rodykles iki kiekvieno gamintojo – kiekvienas skirtingas kelias yra atskira grandinė.`,
  e1Q: (d, E, r, w) => `${cap(d)} su maistu per parą gavo ${nf(E)}\u00a0kJ energijos. ${nf(r)}\u00a0kJ jie išeikvojo kvėpuodami ir judėdami (ši energija virto šiluma), ${nf(w)}\u00a0kJ pasišalino su nesuvirškintomis maisto liekanomis. Kiek energijos jie sukaupė savo kūne?`,
  e1Why: (E, r, w, s) => `${ex(`${nf(E)} − ${nf(r)} − ${nf(w)} = ${nf(s)}\u00a0kJ`)}Tik ši kūne sukaupta energija gali atitekti kitam mitybos lygmeniui.`,
  e1bQ: (d, E, r, w) => `${cap(d)} su maistu gavo ${nf(E)}\u00a0kJ energijos. ${nf(r)}\u00a0kJ išeikvojo kvėpuodami ir judėdami, ${nf(w)}\u00a0kJ pasišalino su nesuvirškintomis liekanomis, o likusią energiją sukaupė kūne. Kiek procentų gautos energijos jie sukaupė?`,
  e1bWhy: (E, r, w, s, p) => `Sukaupta: ${ex(`${nf(E)} − ${nf(r)} − ${nf(w)} = ${nf(s)}\u00a0kJ`)}Procentais: ${ex(`${nf(s)} : ${nf(E)} · 100\u00a0% = ${p}\u00a0%`)}Didžioji gautos energijos dalis prarandama.`,
  e2Q: (chain, E, x, lv) => `Mitybos grandinė: ${chain}. Gamintojai sukaupė ${nf(E)}\u00a0kJ energijos. Tarkime, kad kiekvienam aukštesniam mitybos lygmeniui atitenka 10\u00a0% žemesniojo sukauptos energijos. Kiek energijos atiteks organizmui <b>${x}</b> (${rom[lv]} lygmuo)?`,
  e2Why: steps => `Kiekvienam lygmeniui – dešimtadalis ankstesnio: ${ex(steps)}Todėl aukščiausių lygmenų organizmų būna nedaug, o grandinės – trumpos.`,
  e3Q: (a, A, b, B) => `${cap(a)} sukaupė ${nf(A)}\u00a0kJ energijos. Kitas šios mitybos grandinės lygmuo – ${b} – iš šio maisto sukaupė ${nf(B)}\u00a0kJ. Kiek procentų energijos perėjo iš vieno mitybos lygmens į kitą?`,
  e3Why: (A, B, p) => `${ex(`${nf(B)} : ${nf(A)} · 100\u00a0% = ${p}\u00a0%`)}Kita energijos dalis buvo išeikvota (virto šiluma) arba liko nesuėsta ir nesuvirškinta.`,
  pyrQ: l => `Energijos piramidėje parodyta, kiek energijos sukaupė kiekvienas mitybos lygmuo. Kiek kartų daugiau energijos sukaupė gamintojai nei ${rom[l]} lygmens organizmai?`,
  pyrWhy: (a, b, r) => `${ex(`${nf(a)} : ${nf(b)} = ${r}`)}Kuo aukštesnis mitybos lygmuo, tuo mažiau energijos jam lieka – todėl piramidė siaurėja į viršų.`,
  pyrL: i => `${rom[i]} lygmuo`, kj: v => `${nf(v)}\u00a0kJ`, times: r => f(r, "kartą|kartus|kartų"), pct: p => `${p}\u00a0%`,
  /* --- stabilumas --- */
  wGone: (X, Yk, e) => `Mitybos tinklas ${e}. Tarkime, kad <b>išnyko ${X}</b>. Kaip iš pradžių pasikeis <b>${Yk}</b> gausumas?`,
  wMore: (Xk, Yk, e) => `Mitybos tinklas ${e}. Tarkime, kad <b>labai padaugėjo ${Xk}</b>. Kaip iš pradžių pasikeis <b>${Yk}</b> gausumas?`,
  wInv: { mangutas: "Miške apsigyveno invazinė rūšis – mangutas (usūrinis šuo). Tinkle parodyta, kuo jis minta.",
    audine: "Prie ežero išplito invazinė rūšis – kanadinė audinė, pabėgusi iš žvėrelių fermų. Tinkle parodyta, kuo ji minta.",
    grundalas: "Į Baltijos jūrą su laivų balastiniu vandeniu pateko invazinė rūšis – juodažiotis grundalas. Tinkle parodyta, kuo jis minta ir kas ėda jį." },
  wInvQ: Yk => `Kaip iš pradžių pasikeis <b>${Yk}</b> gausumas?`,
  wOpt: { upE: "Padaugės – sumažės natūralių priešų", upF: "Padaugės – bus daugiau maisto", dnF: "Sumažės – bus mažiau maisto", dnE: "Sumažės – padaugės natūralių priešų" },
  wWhy: {
    gone: {
      prey: (X, Y, Z) => `${cap(X.d)} minta ${Y.i}. Kai ${X.k} nebelieka, ${Y.k} suėdama mažiau – jų padaugėja.`,
      pred: (X, Y, Z) => `${cap(Y.d)} minta ${X.i}. Kai ${X.k} nebelieka, ${Y.k} maisto sumažėja – jų sumažėja.`,
      comp: (X, Y, Z) => `${cap(X.d)} ir ${Y.d} – konkurentai: abi rūšys minta ${Z.i}. Kai ${X.k} nebelieka, ${Y.d} turi daugiau maisto – jų padaugėja.`,
      down2: (X, Y, Z) => `${cap(X.d)} minta ${Z.i}, o ${Z.d} – ${Y.i}. Kai ${X.k} nebelieka, ${Z.k} padaugėja, todėl ${Y.k} suėdama daugiau – jų sumažėja.`,
      up2: (X, Y, Z) => `${cap(Z.d)} minta ${X.i}, o ${Y.d} – ${Z.i}. Kai ${X.k} nebelieka, sumažėja ${Z.k}, todėl ${Y.d} turi mažiau maisto – jų sumažėja.`
    },
    more: {
      prey: (X, Y, Z) => `${cap(X.d)} minta ${Y.i}. Kai ${X.k} padaugėja, ${Y.k} suėdama daugiau – jų sumažėja.`,
      pred: (X, Y, Z) => `${cap(Y.d)} minta ${X.i}. Kai ${X.k} padaugėja, ${Y.d} turi daugiau maisto – jų padaugėja.`,
      comp: (X, Y, Z) => `${cap(X.d)} ir ${Y.d} – konkurentai: abi rūšys minta ${Z.i}. Kai ${X.k} padaugėja, ${Y.d} turi mažiau maisto – jų sumažėja.`,
      down2: (X, Y, Z) => `${cap(X.d)} minta ${Z.i}, o ${Z.d} – ${Y.i}. Kai ${X.k} padaugėja, ${Z.k} sumažėja, todėl ${Y.k} suėdama mažiau – jų padaugėja.`,
      up2: (X, Y, Z) => `${cap(Z.d)} minta ${X.i}, o ${Y.d} – ${Z.i}. Kai ${X.k} padaugėja, padaugėja ir ${Z.k}, todėl ${Y.d} turi daugiau maisto – jų padaugėja.`
    }
  },
  wTail: " Vėliau pokyčiai persiduoda toliau per visą mitybos tinklą – todėl ekosistemoje viskas susiję.",
  /* --- sąvokų klausimai: lv – lygis (0…4), q, a – teisingas, x – klaidingi, w – paaiškinimas --- */
  con: [
    { lv: 0, q: "Ką rodo rodyklė mitybos grandinėje?", a: "Kam atitenka maisto medžiagos ir energija", x: ["Kas ką medžioja ir veja", "Kuris organizmas didesnis", "Kuris organizmas greitesnis"], w: "Rodyklė nukreipta nuo suėdamo organizmo į tą, kuris juo minta: taip keliauja maisto medžiagos ir energija." },
    { lv: 0, q: "Kuo prasideda kiekviena mitybos grandinė?", a: "Gamintoju", x: ["Augalėdžiu", "Plėšrūnu", "Skaidytoju"], w: "Gamintojai (augalai, dumbliai) organinių medžiagų pasigamina patys, todėl jais prasideda visos mitybos grandinės." },
    { lv: 0, q: "Iš kur energijos gauna gamintojai?", a: "Iš Saulės šviesos", x: ["Iš suėstų gyvūnų", "Iš dirvožemio", "Iš kitų augalų"], w: "Fotosintezės metu augalai ir dumbliai Saulės šviesos energiją sukaupia organinėse medžiagose." },
    { lv: 1, q: "Kuo parazitas skiriasi nuo plėšrūno?", a: "Parazitas minta šeimininko sąskaita, bet paprastai jo nenužudo", x: ["Parazitas minta tik augalais", "Parazitas visada didesnis už savo auką", "Parazitas pats gamina organines medžiagas"], w: "Plėšrūnas auką sugauna ir suėda. Parazitas (pvz., erkė) gyvena ant šeimininko ar jo viduje ir juo minta, bet šeimininkas paprastai lieka gyvas." },
    { lv: 1, q: "Kurie organizmai priskiriami gyvėdžiams?", a: "Augalėdžiai, plėšrūnai ir parazitai", x: ["Tik plėšrūnai", "Gamintojai ir skaidytojai", "Tik augalėdžiai"], w: "Gyvėdžiai minta kitais gyvais organizmais: augalėdžiai – augalais, plėšrūnai – gyvūnais, parazitai – šeimininko sąskaita." },
    { lv: 1, q: "Ką ekosistemoje veikia skaidytojai?", a: "Skaido negyvų organizmų liekanas iki mineralinių medžiagų", x: ["Gamina organines medžiagas iš šviesos", "Medžioja silpnus gyvūnus", "Apdulkina augalus"], w: "Skaidytojai (bakterijos, grybai, sliekai) negyvas liekanas paverčia mineralinėmis medžiagomis, kurias vėl pasisavina augalai." },
    { lv: 1, q: "Kas nutiktų ekosistemoje, jei išnyktų visi skaidytojai?", a: "Kauptųsi negyvos liekanos, o augalams pritrūktų mineralinių medžiagų", x: ["Niekas nepasikeistų", "Padaugėtų plėšrūnų", "Augalai imtų augti greičiau"], w: "Be skaidytojų medžiagos nebegrįžtų į dirvožemį: liekanos kauptųsi, o gamintojams trūktų mineralinių medžiagų." },
    { lv: 2, q: "Kuo mitybos tinklas skiriasi nuo mitybos grandinės?", a: "Tinklą sudaro kelios susipynusios grandinės", x: ["Tinkle nėra gamintojų", "Tinkle rodyklės nukreiptos atvirkščiai", "Tinklą sudaro tik plėšrūnai"], w: "Dauguma organizmų minta ne vienu maistu ir patys yra kelių rūšių maistas, todėl grandinės susipina į mitybos tinklą." },
    { lv: 3, q: "Kodėl mitybos grandinėje retai būna daugiau kaip 4–5 nariai?", a: "Kiekvienam aukštesniam lygmeniui lieka vis mažiau energijos", x: ["Plėšrūnai nemėgsta vieni kitų", "Trūksta vietos ekosistemoje", "Gamintojai užauga per lėtai"], w: "Iš lygmens į lygmenį pereina tik nedidelė energijos dalis, todėl penktam ar šeštam nariui jos beveik nebelieka." },
    { lv: 3, q: "Kur dingsta didžioji dalis energijos, kurią gyvūnas gauna su maistu?", a: "Išeikvojama kvėpuojant ir judant (virsta šiluma) bei pasišalina su nesuvirškintomis liekanomis", x: ["Visa sukaupiama kūne", "Grįžta atgal augalams", "Perduodama Saulei"], w: "Tik maža energijos dalis sukaupiama kūne. Kita išeikvojama gyvybinei veiklai ir išsisklaido kaip šiluma arba lieka nesuvirškinta." },
    { lv: 3, q: "Kodėl ekosistemoje plėšrūnų būna mažiau nei augalėdžių?", a: "Plėšrūnams atitenka tik maža augalėdžių sukauptos energijos dalis", x: ["Plėšrūnai gyvena trumpiau", "Augalėdžiai greičiau bėga", "Plėšrūnams reikia mažiau maisto"], w: "Energijos piramidė siaurėja: kuo aukštesnis lygmuo, tuo mažiau energijos, todėl jis gali išmaitinti mažiau organizmų." },
    { lv: 3, q: "Kuris teiginys apie energijos piramidę teisingas?", a: "Daugiausia energijos sukaupę gamintojai", x: ["Daugiausia energijos sukaupę aukščiausio lygmens plėšrūnai", "Visi lygmenys sukaupę po lygiai energijos", "Energijos kiekis didėja kylant piramide"], w: "Piramidės pagrindas – gamintojai. Kiekvienas aukštesnis lygmuo gauna tik dalį žemesniojo sukauptos energijos." },
    { lv: 4, q: "Kuri ekosistema stabilesnė – natūralus miškas ar javų laukas?", a: "Miškas: jame daugiau rūšių ir mitybos ryšių", x: ["Javų laukas: jame mažiau rūšių", "Javų laukas: jį prižiūri žmogus", "Abi vienodai stabilios"], w: "Natūralioje ekosistemoje rūšių daug: išnykus vienai, ja mitę organizmai randa kito maisto. Dirbtinėje ekosistemoje rūšių mažai, todėl ji be žmogaus priežiūros greitai pakinta." },
    { lv: 4, q: "Kuri iš šių ekosistemų yra dirbtinė?", a: "Javų laukas", x: ["Pelkė", "Ežeras", "Giria"], w: "Dirbtines ekosistemas (lauką, sodą, tvenkinį) sukuria ir prižiūri žmogus. Pelkė, ežeras, giria – natūralios ekosistemos." },
    { lv: 4, q: "Kas yra invazinė rūšis?", a: "Į naują vietovę patekusi rūšis, kuri plinta ir kenkia vietinėms rūšims", x: ["Bet kuri reta, saugoma rūšis", "Rūšis, kuri minta tik augalais", "Rūšis, kuri gyvena tik vandenyje"], w: "Invazinės rūšys į naują vietovę patenka dėl žmogaus veiklos, sparčiai plinta ir išstumia vietines rūšis arba jas ėda." },
    { lv: 4, q: "Kodėl invazinė rūšis naujoje vietoje dažnai labai greitai išplinta?", a: "Čia ji neturi natūralių priešų", x: ["Ji visada didesnė už vietines rūšis", "Ją globoja žmonės", "Ji nieko neėda"], w: "Tėvynėje rūšies gausumą riboja plėšrūnai, parazitai ir konkurentai. Naujoje vietoje jų dažnai nėra, todėl rūšis sparčiai dauginasi." },
    { lv: 4, q: "Pievoje išplito invazinis augalas – Sosnovskio barštis. Jis užauga labai aukštas ir užstoja šviesą. Kaip tai paveiks pievos mitybos tinklą?", a: "Sumažės vietinių augalų, o paskui – ir jais mintančių gyvūnų", x: ["Padaugės vietinių augalų", "Niekas nepasikeis – tai tik augalas", "Padaugės visų pievos gyvūnų"], w: "Barštis nustelbia vietinius pievos augalus. Sumažėjus gamintojų įvairovei, maisto netenka augalėdžiai, o paskui – ir jais mintantys plėšrūnai." },
    { lv: 4, q: "Kodėl mitybos tinklas, kuriame daug ryšių, yra stabilesnis?", a: "Sumažėjus vienos rūšies, ja mitę organizmai gali misti kitomis", x: ["Daugiau ryšių – daugiau plėšrūnų", "Organizmai mažiau juda", "Tokiame tinkle nėra skaidytojų"], w: "Jei organizmas turi kelis maisto šaltinius, vieno iš jų netektis jo nepražudo. Todėl rūšių įvairovė saugo ekosistemos stabilumą." }
  ],
  learn: [
    { name: "Gamintojai, gyvėdžiai, skaidytojai", level: 1, html: `<p>Pagal tai, kaip organizmai apsirūpina maisto medžiagomis, jie skirstomi į <b>funkcines grupes</b>:</p><ul><li><b>Gamintojai</b> – augalai ir dumbliai. Organinių medžiagų jie pasigamina patys fotosintezės metu, naudodami Saulės šviesos energiją.</li><li><b>Gyvėdžiai</b> minta kitais gyvais organizmais: <b>augalėdžiai</b> – augalais, <b>plėšrūnai</b> – gyvūnais, <b>parazitai</b> – šeimininko sąskaita (pvz., erkė siurbia kraują).</li><li><b>Skaidytojai</b> – bakterijos, grybai, sliekai. Jie skaido negyvų organizmų liekanas iki mineralinių medžiagų, kurias vėl pasisavina augalai.</li></ul><p>Kai kurie gyvūnai (pvz., kuoja, kurapka, strazdas) minta ir augalais, ir gyvūnais.</p>` },
    { name: "Mitybos grandinė", level: 0, html: `<p><b>Mitybos grandinė</b> rodo, kas kuo minta. Ji visada prasideda <b>gamintoju</b>.</p>${ex("žolė → skėriukas → varlė → gandras")}<p>Rodyklė nukreipta <b>nuo suėdamo organizmo į tą, kuris juo minta</b> – ta kryptimi keliauja maisto medžiagos ir energija. Todėl rašome „žolė → skėriukas“, o ne atvirkščiai.</p>` },
    { name: "Mitybos tinklas", level: 2, html: `<p>Dauguma gyvūnų minta ne vienu maistu, o juos pačius ėda keli skirtingi plėšrūnai. Todėl mitybos grandinės susipina į <b>mitybos tinklą</b>.</p>${ex("zooplanktonas → aukšlė → ešerys → lydeka<br>zooplanktonas → kuoja → lydeka")}<p>Abi grandinės – to paties ežero tinklo dalys. Kuo daugiau tinkle ryšių, tuo ekosistema stabilesnė.</p>` },
    { name: "Mitybos lygmenys", level: 3, html: `<p>Organizmo vieta mitybos grandinėje vadinama <b>mitybos lygmeniu</b>:</p><ul><li>I lygmuo – gamintojai;</li><li>II lygmuo – augalėdžiai;</li><li>III lygmuo – augalėdžiais mintantys plėšrūnai;</li><li>IV ir V lygmuo – plėšrūnai, mintantys kitais plėšrūnais.</li></ul><p>Mitybos tinkle tas pats organizmas gali priklausyti keliems lygmenims: ešerys, suėdęs zooplanktono, yra III lygmenyje, o suėdęs aukšlę – IV.</p>` },
    { name: "Energijos kelias ir piramidė", level: 3, html: `<p>Iš vieno mitybos lygmens į kitą pereina <b>tik dalis energijos</b>. Didžiąją gautos energijos dalį organizmas išeikvoja kvėpuodamas ir judėdamas (ji virsta šiluma), dalis pasišalina su nesuvirškintomis liekanomis. Tik kūne sukaupta energija atitenka tam, kas šį organizmą suės.</p><p>Dažnai skaičiuojama, kad kitam lygmeniui atitenka maždaug dešimtadalis energijos:</p>${ex("gamintojai 10 000\u00a0kJ → augalėdžiai 1000\u00a0kJ → plėšrūnai 100\u00a0kJ")}<p>Todėl <b>energijos piramidė</b> siaurėja į viršų, o mitybos grandinės būna trumpos.</p>` },
    { name: "Ekosistemų stabilumas ir invazinės rūšys", level: 4, html: `<p>Ekosistemoje viskas susiję. Išnykus ar labai padaugėjus vienai rūšiai:</p><ul><li>jos <b>maisto</b> (grobio) padaugėja arba sumažėja;</li><li>ja <b>mintančių</b> organizmų gausumas keičiasi ta pačia kryptimi;</li><li><b>konkurentams</b> – tiems, kurie minta tuo pačiu maistu, – maisto lieka daugiau arba mažiau.</li></ul><p><b>Natūralios</b> ekosistemos (miškas, pelkė, ežeras) stabilesnės už <b>dirbtines</b> (javų lauką, sodą), nes jose daugiau rūšių ir mitybos ryšių.</p><p><b>Invazinės rūšys</b> (Lietuvoje – Sosnovskio barštis, kanadinė audinė, mangutas, juodažiotis grundalas ir kt.) naujoje vietoje neturi natūralių priešų, todėl sparčiai plinta ir sutrikdo vietinius mitybos ryšius.</p>` }
  ]
};
})();
