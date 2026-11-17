/* Mechanizmų aikštelė – visi mokiniui rodomi tekstai (lietuvių k.). Verčiant keisti tik šį failą.
   Terminai – pagal Fizikos bendrąją programą (9 ir I gimnazijos klasė, 28.3 „Mechaninis darbas, galia ir energija“:
   28.3.1 „Mechaninis darbas ir galia“, 28.3.3 „Paprastieji mechanizmai“ – jėgos momentas, momentų taisyklė,
   paprastųjų mechanizmų naudingumo koeficientas, auksinė mechanikos taisyklė) ir pagrindinio ugdymo fizikos BP
   įgyvendinimo rekomendacijas (sverto pusiausvyros sąlyga F1d1 = F2d2, jėgos petys, kilnojamasis ir nekilnojamasis
   skridiniai, nuožulnioji plokštuma, A = Fs). */
(function(){
"use strict";
const nf = x => String(+(+x).toFixed(4)).replace(".", ",").replace("-", "−");
const N = x => nf(x) + " N";
const sum = a => a.reduce((s, x) => s + x, 0);
/* Momentų eilutė vienai sverto pusei: „4 N · 0,3 m = 1,2 N·m“ (+ suma, jei jėgų kelios). */
const side = list => {
  const parts = list.map(w => `${N(w.F)} · ${nf(w.d)} m = ${nf(w.F * w.d)} N·m`);
  return parts.join("; ") + (list.length > 1 ? `; iš viso <b>${nf(sum(list.map(w => w.F * w.d)))} N·m</b>` : "");
};
const typeName = { N: "nekilnojamuoju skridiniu", K: "kilnojamuoju skridiniu", KN: "kilnojamuoju ir nekilnojamuoju skridiniais" };

window.MK_T = {
  nf,
  title: "Mechanizmų aikštelė",
  heroA: "Mechanizmų", heroB: "aikštelė",
  hero: "Statybų aikštelėje sunkius krovinius kelia ne raumenys, o protas. Subalansuok svertus, parink skridinius ir nuožulniąsias plokštumas, skaičiuok darbą ir naudingumo koeficientą – ir pastatyk savo bokštą.",
  metaDesc: "9 klasės fizikos žaidimas: paprastieji mechanizmai – jėgos momentas, momentų taisyklė, skridiniai, nuožulnioji plokštuma, auksinė mechanikos taisyklė ir naudingumo koeficientas.",
  levels: [
    ["Sverto pusiausvyra", "Pakabink krovinį taip, kad svertas nepasvirtų"],
    ["Jėgos momentas", "M = F · d, momentų taisyklė"],
    ["Skridiniai", "Kilnojamasis ir nekilnojamasis"],
    ["Auksinė taisyklė", "Darbas, galia, nuožulnioji plokštuma"],
    ["Naudingumo koeficientas", "Naudingas ir visas darbas"],
    ["Meistro egzaminas", "Visos temos kartu · 10 užduočių"]
  ],
  towerH: "Mano bokštas",
  towerP: (n, m, rank) => n >= m ? `Bokštas baigtas – visi ${m} aukštų ir vėliava! Tavo laipsnis: <b>${rank}</b>.`
    : `Pastatyta aukštų: ${n} iš ${m}. Kiekviena žvaigždutė – naujas aukštas. Tavo laipsnis: <b>${rank}</b>.`,
  ranks: ["Pameistrys", "Mechanikas", "Meistras", "Vyresnysis meistras", "Inžinierius", "Vyriausiasis inžinierius"],
  learnH: "Noriu pasimokyti",
  pts: "Taškai",
  next: "Toliau", finish: "Baigti",
  why: "Kaip apskaičiuoti?",
  okH: () => ["Teisingai!", "Puiku!", "Tiksliai!", "Šaunu, meistre!"][Math.floor(Math.random() * 4)],
  badH: c => `Teisingas atsakymas: ${c}`,
  res: (ok, total, pts) => `Iš pirmo karto išspręsta: ${ok} iš ${total}. Surinkta taškų: ${pts}.`,
  newFloor: n => n === 1 ? "Bokšte – naujas aukštas!" : `Bokšte – nauji aukštai: ${n}!`,
  resTitle0: "Pabandyk dar kartą",
  barAn: "naudingas darbas", barAv: "visas darbas", barLoss: "nuostoliai",

  /* ---------- svertas (interaktyvios užduotys) ---------- */
  beam: {
    release: "Paleisti svertą",
    retry: "Bandyti dar kartą",
    pickPeg: "Paliesk kabliuką ant sverto – ten bus pakabintas krovinys.",
    pickWt: "Pasirink krovinį – jis bus pakabintas ant pažymėto kabliuko.",
    give: F => `Tavo krovinys: <b>${N(F)}</b>`,
    distCm: "atstumas nuo atramos taško, cm", distM: "atstumas nuo atramos taško, m",
    posTxt: (F, skin) => skin === "lab"
      ? `Laboratorinis svertas remiasi viduryje. Pakabink <b>${N(F)}</b> svarelį taip, kad svertas liktų pusiausviras.`
      : `Lenta paremta viduryje. Pakabink <b>${N(F)}</b> krovinį taip, kad lenta liktų pusiausvira.`,
    posAnyTxt: (F, skin) => skin === "lab"
      ? `Svertas nepusiausviras. Turi vieną <b>${N(F)}</b> svarelį – pakabink jį ten, kur reikia, kad svertas nusistovėtų. Pirmiausia nuspręsk, kurioje pusėje.`
      : `Lenta nepusiausvira. Turi vieną <b>${N(F)}</b> krovinį – pakabink jį ten, kur reikia, kad lenta nusistovėtų. Pirmiausia nuspręsk, kurioje pusėje.`,
    wtTxt: skin => skin === "lab"
      ? "Krovinį galima kabinti tik ant pažymėto kabliuko. Kurį svarelį pakabinti, kad svertas liktų pusiausviras?"
      : "Krovinį galima kabinti tik ant pažymėto kabliuko. Kurį krovinį pakabinti, kad lenta liktų pusiausvira?",
    tiltL: "Svertas pasviro į kairę – kairės pusės jėgų momentas didesnis. Palygink abiejų pusių momentus (F · d) ir pabandyk dar kartą.",
    tiltR: "Svertas pasviro į dešinę – dešinės pusės jėgų momentas didesnis. Palygink abiejų pusių momentus (F · d) ir pabandyk dar kartą.",
    ok1: "Svertas pusiausviras!",
    ok2: "Dabar svertas pusiausviras.",
    shown: (F, d) => `Teisingas sprendimas: ${N(F)} krovinys – ${nf(d)} m nuo atramos taško.`,
    why: (L, R) => ({
      body: "Svertas pusiausviras, kai jį į vieną ir į kitą pusę sukančių jėgų momentai lygūs (momentų taisyklė).",
      more: `<p>Kairėje: ${side(L)}.</p><p>Dešinėje: ${side(R)}.</p><p>Momentai lygūs – svertas nepasvyra.</p>`
    })
  },

  /* ---------- klausimai su atsakymų variantais ---------- */
  q: {
    m1: (ctx, F, dcm) => `${ctx} Rankenos galą jis veikia <b>${N(F)}</b> jėga, statmena rankenai. Jėgos petys <b>d = ${nf(dcm)} cm</b>. Koks šios jėgos momentas?`,
    m1ctx: ["Meistras veržliarakčiu veržia veržlę.", "Vairuotojas raktu atsuka rato varžtą.", "Santechnikas raktu suka vamzdžio jungtį."],
    m2: (a, b) => `Du meistrai suka vienodas veržles. Meistras A raktą veikia <b>${N(a.F)}</b> jėga, petys <b>${nf(a.d)} cm</b>. Meistras B – <b>${N(b.F)}</b> jėga, petys <b>${nf(b.d)} cm</b>. Kurio jėgos momentas didesnis?`,
    m2opts: ["Meistro A", "Meistro B", "Momentai vienodi"],
    m3: (M, dcm) => `Varžtui atsukti reikia <b>${nf(M)} N·m</b> jėgos momento. Rakto rankenos ilgis (jėgos petys) – <b>${nf(dcm)} cm</b>. Kokia jėga reikia veikti rankenos galą?`,
    m4: (M, F) => `Varžtui atsukti reikia <b>${nf(M)} N·m</b> jėgos momento, o meistras gali veikti raktą <b>${N(F)}</b> jėga. Kokio ilgio turi būti jėgos petys?`,
    m5: (P, d1, d2) => `Darbininkas laužtuvu kelia akmenį. Akmuo spaudžia trumpąjį laužtuvo galą <b>P = ${N(P)}</b> jėga, jos petys <b>d₁ = ${nf(d1)} m</b>. Darbininkas spaudžia ilgąjį galą, jo jėgos petys <b>d₂ = ${nf(d2)} m</b>. Kokia jėga F jis atsveria akmenį?`,
    m6: (d1, d2) => `Laužtuvo trumpasis petys <b>d₁ = ${nf(d1)} m</b>, ilgasis <b>d₂ = ${nf(d2)} m</b>. Kiek kartų šiuo svertu laimima jėgos?`,
    m6opt: k => `${nf(k)} kartus`,
    m7: () => "Svertas pusiausviras. Kokia jėga jį veikia klaustuku pažymėtas krovinys?",
    m8: () => "Svertas dar paremtas atramėlėmis. Kas nutiks, kai jas ištrauksime?",
    m8opts: ["Persvers kairė pusė", "Liks pusiausviras", "Persvers dešinė pusė"],
    s1: (t, P) => `Krovinys, kurio svoris <b>P = ${N(P)}</b>, tolygiai keliamas ${typeName[t]}. Skridinio svorio ir trinties nepaisome. Kokia jėga F reikia traukti lyną?`,
    s2: (t, P, Ps) => `Krovinys, kurio svoris <b>P = ${N(P)}</b>, tolygiai keliamas ${typeName[t]}. Kilnojamasis skridinys pats sveria <b>${N(Ps)}</b>. Trinties nepaisome. Kokia jėga F reikia traukti lyną?`,
    s3: (t, h) => `Krovinys ${typeName[t]} keliamas į <b>h = ${nf(h)} m</b> aukštį. Kiek metrų lyno reikia ištraukti?`,
    s4: (t, Fm, Ps) => `Darbininkas lyną gali traukti ne didesne kaip <b>${N(Fm)}</b> jėga. Jis kelia krovinius ${typeName[t]}${Ps ? `; kilnojamasis skridinys sveria <b>${N(Ps)}</b>` : ""}. Trinties nepaisome. Kokio didžiausio svorio krovinį jis gali tolygiai pakelti?`,
    s5: (t, s) => `Krovinys keliamas ${typeName[t]}. Darbininkas ištraukė <b>${nf(s)} m</b> lyno. Kiek pakilo krovinys?`,
    s7: (t, P, F) => `Krovinys, kurio svoris <b>P = ${N(P)}</b>, tolygiai keliamas ${typeName[t]}. Trinties nėra, bet lyną tenka traukti <b>F = ${N(F)}</b> jėga – daugiau nei pusė krovinio svorio, nes sveria ir pats kilnojamasis skridinys. Kiek jis sveria?`,
    s8: (P, Fm) => `Reikia tolygiai pakelti krovinį, kurio svoris <b>${N(P)}</b>. Darbininkas lyną gali traukti ne didesne kaip <b>${N(Fm)}</b> jėga. Skridinių svorio ir trinties nepaisome. Kurį skridinį jam rinktis?`,
    s8opts: ["Tik nekilnojamąjį", "Tik kilnojamąjį", "Tinka ir kilnojamasis, ir nekilnojamasis", "Vieno skridinio neužteks"],
    s6: (P, h) => `Krovinys, kurio svoris <b>P = ${N(P)}</b>, kilnojamuoju skridiniu tolygiai pakeliamas į <b>h = ${nf(h)} m</b> aukštį. Skridinio svorio ir trinties nepaisome. Kokį darbą atlieka lyną traukiantis darbininkas?`,
    g1: (ctx, P, h, l) => `${ctx} Krovinio svoris <b>P = ${N(P)}</b>, aukštis <b>h = ${nf(h)} m</b>, nuožulniosios plokštumos ilgis <b>l = ${nf(l)} m</b>. Trinties nepaisome. Kokia jėga F reikia traukti krovinį išilgai plokštumos?`,
    g1ctx: ["Dėžė nuožulniąja plokštuma tolygiai užtraukiama į sunkvežimio kėbulą.", "Statinė lentomis tolygiai užridenama ant pakylos.", "Vežimėlis su plytomis tolygiai užtraukiamas ant pastolių."],
    g2: (P, Fm, h) => `Krovinį, kurio svoris <b>P = ${N(P)}</b>, reikia užtraukti į <b>h = ${nf(h)} m</b> aukštį, bet traukti galima ne didesne kaip <b>${N(Fm)}</b> jėga. Trinties nepaisome. Kokio mažiausio ilgio nuožulniosios plokštumos reikia?`,
    g3: (P, h) => `Nekilnojamuoju skridiniu krovinys, kurio svoris <b>P = ${N(P)}</b>, tolygiai pakeliamas į <b>h = ${nf(h)} m</b> aukštį. Kokį darbą atlieka keliamoji jėga?`,
    g4: (P, F, h1) => `Svertu keliamas akmuo, kurio svoris <b>${N(P)}</b>; ilgąjį sverto galą pakanka spausti <b>${N(F)}</b> jėga. Akmuo pakilo <b>${nf(h1)} cm</b>. Kiek nusileido ilgasis sverto galas?`,
    g5: (P, h, t) => `Keltuvas krovinį, kurio svoris <b>P = ${N(P)}</b>, tolygiai pakelia į <b>h = ${nf(h)} m</b> aukštį per <b>t = ${nf(t)} s</b>. Kokia keltuvo galia?`,
    g6: (A, Nw) => `Keltuvo galia <b>${nf(Nw)} W</b>. Per kiek laiko jis atliks <b>${nf(A)} J</b> darbą?`,
    g7: (ctx, F, s) => `${ctx} <b>${N(F)}</b> jėga, veikiančia judėjimo kryptimi, ir nuvaro <b>s = ${nf(s)} m</b>. Kokį darbą atlieka ši jėga?`,
    g7ctx: ["Darbininkas lygiu keliu stumia vežimėlį", "Darbininkė lygiu keliu traukia karutį", "Krautuvas lygiu keliu stumia dėžę"],
    e1: (P, h, F, l) => `Dėžė, kurios svoris <b>P = ${N(P)}</b>, nuožulniąja plokštuma tolygiai užtraukiama į <b>h = ${nf(h)} m</b> aukštį. Plokštumos ilgis <b>l = ${nf(l)} m</b>, dėžė traukiama <b>F = ${N(F)}</b> jėga. Koks plokštumos naudingumo koeficientas?`,
    e2: (P, F, h) => `Kilnojamuoju skridiniu krovinys, kurio svoris <b>P = ${N(P)}</b>, pakeliamas į <b>h = ${nf(h)} m</b> aukštį. Lynas traukiamas <b>F = ${N(F)}</b> jėga. Koks skridinio naudingumo koeficientas?`,
    e3: (P, h1, F, h2) => `Svertu akmuo, kurio svoris <b>P = ${N(P)}</b>, pakeliamas <b>${nf(h1)} m</b>. Ilgasis sverto galas spaudžiamas <b>F = ${N(F)}</b> jėga ir nusileidžia <b>${nf(h2)} m</b>. Koks sverto naudingumo koeficientas?`,
    e4: (An, eta) => `Kroviniui pakelti reikia <b>${nf(An)} J</b> naudingo darbo. Mechanizmo naudingumo koeficientas <b>${nf(eta)} %</b>. Kokį visą darbą teks atlikti?`,
    e5: (P, h, l, eta) => `Dėžė, kurios svoris <b>P = ${N(P)}</b>, užtraukiama į <b>h = ${nf(h)} m</b> aukštį nuožulniąja plokštuma, kurios ilgis <b>l = ${nf(l)} m</b>, o naudingumo koeficientas <b>${nf(eta)} %</b>. Kokia jėga F traukiama dėžė?`,
    e6: (Av, eta) => `Keldamas krovinį mechanizmu, darbininkas iš viso atliko <b>${nf(Av)} J</b> darbą. Mechanizmo naudingumo koeficientas <b>${nf(eta)} %</b>. Koks naudingas darbas?`
  },

  /* ---------- paaiškinimai ---------- */
  w: {
    m1: (F, dcm, M) => ({ body: "Jėgos momentas lygus jėgos ir jos peties sandaugai: M = F · d. Petį reikia išreikšti metrais.",
      more: `<p>d = ${nf(dcm)} cm = ${nf(dcm / 100)} m.</p><p>M = ${N(F)} · ${nf(dcm / 100)} m = <b>${nf(M)} N·m</b>.</p>` }),
    m2: (a, b) => ({ body: "Didesnė jėga dar nereiškia didesnio momento – svarbi jėgos ir peties sandauga.",
      more: `<p>A: ${N(a.F)} · ${nf(a.d / 100)} m = <b>${nf(a.F * a.d / 100)} N·m</b>.</p><p>B: ${N(b.F)} · ${nf(b.d / 100)} m = <b>${nf(b.F * b.d / 100)} N·m</b>.</p>` }),
    m3: (M, dcm, F) => ({ body: "Iš M = F · d išreiškiame jėgą: F = M : d. Petį verčiame metrais.",
      more: `<p>d = ${nf(dcm)} cm = ${nf(dcm / 100)} m.</p><p>F = ${nf(M)} N·m : ${nf(dcm / 100)} m = <b>${N(F)}</b>.</p>` }),
    m4: (M, F, dcm) => ({ body: "Iš M = F · d išreiškiame petį: d = M : F.",
      more: `<p>d = ${nf(M)} N·m : ${N(F)} = ${nf(dcm / 100)} m = <b>${nf(dcm)} cm</b>.</p><p>Kuo ilgesnis petys, tuo mažesnės jėgos reikia tam pačiam momentui.</p>` }),
    m5: (P, d1, d2, F) => ({ body: "Sverto pusiausvyros sąlyga: F₁ · d₁ = F₂ · d₂. Čia P · d₁ = F · d₂.",
      more: `<p>F = P · d₁ : d₂ = ${N(P)} · ${nf(d1)} m : ${nf(d2)} m = <b>${N(F)}</b>.</p><p>Ilgasis petys ${nf(d2 / d1)} kartus ilgesnis, todėl jėgos reikia ${nf(d2 / d1)} kartus mažesnės.</p>` }),
    m6: (d1, d2, k) => ({ body: "Svertas pusiausviras, kai jėgos atvirkščiai proporcingos jų pečiams. Kiek kartų ilgesnis petys, tiek kartų mažesnės jėgos pakanka.",
      more: `<p>d₂ : d₁ = ${nf(d2)} m : ${nf(d1)} m = <b>${nf(k)}</b>.</p><p>Jėgos laimima ${nf(k)} kartus.</p>` }),
    m7: (L, R, F, d) => ({ body: "Taikome momentų taisyklę: į vieną pusę sukančių jėgų momentų suma lygi į kitą pusę sukančių jėgų momentų sumai.",
      more: `<p>Žinoma pusė: ${side(L)}.</p><p>Ieškoma jėga veikia ${nf(d)} m petimi: F = ${nf(sum(L.map(w => w.F * w.d)))} N·m : ${nf(d)} m = <b>${N(F)}</b>.</p>${R.length ? "" : ""}` }),
    m8: (L, R) => ({ body: "Lyginame ne jėgas, o jų momentus. Persveria ta pusė, kurios jėgų momentas didesnis.",
      more: `<p>Kairėje: ${side(L)}.</p><p>Dešinėje: ${side(R)}.</p>` }),
    s1: (t, P, F) => t === "N"
      ? { body: "Nekilnojamasis skridinys jėgos laimėjimo neduoda – jis tik pakeičia jėgos kryptį.", more: `<p>F = P = <b>${N(F)}</b>. Užtat traukti galima žemyn, o tai patogiau.</p>` }
      : { body: "Kilnojamasis skridinys kabo ant dviejų lyno šakų, todėl kiekvienai tenka pusė krovinio svorio – jėgos laimima 2 kartus." + (t === "KN" ? " Nekilnojamasis skridinys tik pakeičia jėgos kryptį." : ""),
          more: `<p>F = P : 2 = ${N(P)} : 2 = <b>${N(F)}</b>.</p>` },
    s2: (P, Ps, F) => ({ body: "Lynas laiko ir krovinį, ir patį kilnojamąjį skridinį. Jų bendras svoris pasiskirsto dviem lyno šakoms.",
      more: `<p>F = (P + P<sub>skr</sub>) : 2 = (${N(P)} + ${N(Ps)}) : 2 = <b>${N(F)}</b>.</p>` }),
    s3: (t, h, s) => t === "N"
      ? { body: "Nekilnojamuoju skridiniu nei jėgos laimima, nei kelio pralaimima.", more: `<p>Lyno ištraukiama tiek, kiek pakyla krovinys: <b>${nf(s)} m</b>.</p>` }
      : { body: "Kilnojamuoju skridiniu laimima jėgos 2 kartus, todėl 2 kartus pralaimima kelio (auksinė mechanikos taisyklė).",
          more: `<p>Kai krovinys pakyla h, sutrumpėja abi lyno šakos, todėl lyno ištraukiama 2 · h = 2 · ${nf(h)} m = <b>${nf(s)} m</b>.</p>` },
    s4: (t, Fm, Ps, P) => t === "N"
      ? { body: "Nekilnojamasis skridinys jėgos laimėjimo neduoda.", more: `<p>Didžiausias krovinio svoris lygus didžiausiai traukos jėgai: <b>${N(P)}</b>.</p>` }
      : { body: "Kilnojamuoju skridiniu jėgos laimima 2 kartus.", more: Ps
          ? `<p>Dvi lyno šakos kartu laiko 2 · ${N(Fm)} = ${N(2 * Fm)}.</p><p>Iš to ${N(Ps)} tenka pačiam skridiniui: P = ${N(2 * Fm)} − ${N(Ps)} = <b>${N(P)}</b>.</p>`
          : `<p>P = 2 · F = 2 · ${N(Fm)} = <b>${N(P)}</b>.</p>` },
    s5: (t, s, h) => t === "N"
      ? { body: "Nekilnojamuoju skridiniu kelio nepralaimima.", more: `<p>Krovinys pakyla tiek, kiek ištraukiama lyno: <b>${nf(h)} m</b>.</p>` }
      : { body: "Kilnojamuoju skridiniu kelio pralaimima 2 kartus: krovinys pakyla perpus mažiau, nei ištraukiama lyno.", more: `<p>h = s : 2 = ${nf(s)} m : 2 = <b>${nf(h)} m</b>.</p>` },
    s7: (P, F, Ps) => ({ body: "Dvi lyno šakos kartu laiko ir krovinį, ir kilnojamąjį skridinį: 2 · F = P + P<sub>skr</sub>.",
      more: `<p>P<sub>skr</sub> = 2 · F − P = 2 · ${N(F)} − ${N(P)} = <b>${N(Ps)}</b>.</p>` }),
    s8: (P, Fm, c) => ({ body: "Nekilnojamuoju skridiniu reikia jėgos F = P, kilnojamuoju – F = P : 2.",
      more: `<p>Nekilnojamuoju reikėtų ${N(P)}, kilnojamuoju – ${N(P / 2)}. Darbininkas gali traukti ${N(Fm)} jėga.</p><p>${c === 0 ? "Jėgos pakanka abiem atvejais – tinka abu skridiniai." : c === 1 ? `${N(Fm)} mažiau nei ${N(P)}, bet ne mažiau nei ${N(P / 2)} – tinka tik kilnojamasis skridinys.` : `${N(Fm)} mažiau net už ${N(P / 2)} – vieno skridinio neužteks, reikėtų kelių kilnojamųjų skridinių.`}</p>` }),
    s6: (P, h, A) => ({ body: "Darbininkas traukia perpus mažesne jėga, bet dvigubai ilgesnį kelią – darbo laimėjimo nėra.",
      more: `<p>F = ${N(P)} : 2 = ${N(P / 2)}; lyno ištraukiama s = 2 · ${nf(h)} m = ${nf(2 * h)} m.</p><p>A = F · s = ${N(P / 2)} · ${nf(2 * h)} m = <b>${nf(A)} J</b> (tiek pat, kiek P · h).</p>` }),
    g1: (P, h, l, F) => ({ body: "Be trinties darbas traukiant plokštuma lygus darbui keliant stačiai: F · l = P · h (auksinė mechanikos taisyklė).",
      more: `<p>F = P · h : l = ${N(P)} · ${nf(h)} m : ${nf(l)} m = <b>${N(F)}</b>.</p><p>Kelias ${nf(l / h)} kartus ilgesnis už aukštį, todėl jėgos reikia ${nf(l / h)} kartus mažesnės.</p>` }),
    g2: (P, Fm, h, l) => ({ body: "Kiek kartų norime laimėti jėgos, tiek kartų turi būti ilgesnis kelias: F · l = P · h.",
      more: `<p>l = P · h : F = ${N(P)} · ${nf(h)} m : ${N(Fm)} = <b>${nf(l)} m</b>.</p>` }),
    g3: (P, h, A) => ({ body: "Kai jėga veikia išilgai judėjimo krypties, darbas A = F · s. Tolygiai keliant jėga lygi krovinio svoriui, o kelias – aukščiui.",
      more: `<p>A = P · h = ${N(P)} · ${nf(h)} m = <b>${nf(A)} J</b>.</p>` }),
    g4: (P, F, h1, h2) => ({ body: "Kiek kartų laimime jėgos, tiek kartų pralaimime kelio.",
      more: `<p>Jėgos laimima ${N(P)} : ${N(F)} = ${nf(P / F)} kartus.</p><p>Todėl ilgasis galas nueina ${nf(P / F)} kartus didesnį kelią: ${nf(P / F)} · ${nf(h1)} cm = <b>${nf(h2)} cm</b>.</p>` }),
    g5: (P, h, t, Nw) => ({ body: "Galia rodo, kokį darbą jėga atlieka per laiko vienetą: N = A : t.",
      more: `<p>A = P · h = ${N(P)} · ${nf(h)} m = ${nf(P * h)} J.</p><p>N = ${nf(P * h)} J : ${nf(t)} s = <b>${nf(Nw)} W</b>.</p>` }),
    g6: (A, Nw, t) => ({ body: "Iš N = A : t išreiškiame laiką: t = A : N.",
      more: `<p>t = ${nf(A)} J : ${nf(Nw)} W = <b>${nf(t)} s</b>.</p>` }),
    g7: (F, s, A) => ({ body: "Kai jėga veikia išilgai judėjimo krypties, mechaninis darbas lygus jėgos ir kelio sandaugai: A = F · s.",
      more: `<p>A = ${N(F)} · ${nf(s)} m = <b>${nf(A)} J</b>.</p>` }),
    e1: (P, h, F, l, eta) => ({ body: "Naudingumo koeficientas rodo, kurią viso darbo dalį sudaro naudingas darbas: η = A<sub>n</sub> : A<sub>v</sub> · 100 %.",
      more: `<p>Naudingas darbas: A<sub>n</sub> = P · h = ${N(P)} · ${nf(h)} m = ${nf(P * h)} J.</p><p>Visas darbas: A<sub>v</sub> = F · l = ${N(F)} · ${nf(l)} m = ${nf(F * l)} J.</p><p>η = ${nf(P * h)} J : ${nf(F * l)} J · 100 % = <b>${nf(eta)} %</b>.</p>` }),
    e2: (P, F, h, eta) => ({ body: "Krovinys pakyla h, o lyno ištraukiama 2 · h. Naudingas darbas – krovinio pakėlimas, visas – traukos jėgos darbas.",
      more: `<p>A<sub>n</sub> = P · h = ${N(P)} · ${nf(h)} m = ${nf(P * h)} J.</p><p>A<sub>v</sub> = F · 2h = ${N(F)} · ${nf(2 * h)} m = ${nf(F * 2 * h)} J.</p><p>η = ${nf(P * h)} J : ${nf(F * 2 * h)} J · 100 % = <b>${nf(eta)} %</b>.</p>` }),
    e3: (P, h1, F, h2, eta) => ({ body: "Naudingas darbas – akmens pakėlimas, visas – jėgos, spaudžiančios ilgąjį galą, darbas.",
      more: `<p>A<sub>n</sub> = ${N(P)} · ${nf(h1)} m = ${nf(P * h1)} J.</p><p>A<sub>v</sub> = ${N(F)} · ${nf(h2)} m = ${nf(F * h2)} J.</p><p>η = ${nf(P * h1)} J : ${nf(F * h2)} J · 100 % = <b>${nf(eta)} %</b>.</p>` }),
    e4: (An, eta, Av) => ({ body: "Visas darbas visada didesnis už naudingą. Iš η = A<sub>n</sub> : A<sub>v</sub> gauname A<sub>v</sub> = A<sub>n</sub> : η.",
      more: `<p>η = ${nf(eta)} % = ${nf(eta / 100)}.</p><p>A<sub>v</sub> = ${nf(An)} J : ${nf(eta / 100)} = <b>${nf(Av)} J</b>.</p>` }),
    e5: (P, h, l, eta, F) => ({ body: "Pirmiausia randame naudingą darbą, tada visą darbą, o iš jo – traukos jėgą.",
      more: `<p>A<sub>n</sub> = P · h = ${N(P)} · ${nf(h)} m = ${nf(P * h)} J.</p><p>A<sub>v</sub> = A<sub>n</sub> : η = ${nf(P * h)} J : ${nf(eta / 100)} = ${nf(P * h / (eta / 100))} J.</p><p>F = A<sub>v</sub> : l = ${nf(P * h / (eta / 100))} J : ${nf(l)} m = <b>${N(F)}</b>.</p>` }),
    e6: (Av, eta, An) => ({ body: "Naudingas darbas – tai viso darbo dalis, kurią rodo naudingumo koeficientas: A<sub>n</sub> = η · A<sub>v</sub>.",
      more: `<p>A<sub>n</sub> = ${nf(eta / 100)} · ${nf(Av)} J = <b>${nf(An)} J</b>.</p><p>Likusi dalis (${nf(Av - An)} J) sunaudojama trinčiai nugalėti ir pačiam mechanizmui judinti.</p>` })
  },

  /* ---------- teorijos klausimai: [klausimas, teisingas, klaidingi…, paaiškinimas] ---------- */
  concepts: {
    m: [
      ["Kas yra jėgos petys?", "Trumpiausias atstumas nuo sukimosi ašies iki tiesės, išilgai kurios veikia jėga", ["Viso sverto ilgis", "Atstumas tarp dviejų svertą veikiančių jėgų", "Jėgos ir atstumo sandauga"], "Jėgos ir jos peties sandauga vadinama jėgos momentu: M = F · d."],
      ["Durų rankena tvirtinama toli nuo vyrių. Kodėl?", "Kuo didesnis petys, tuo didesnį momentą sukuria ta pati jėga", ["Kad durys būtų sunkesnės", "Kuo mažesnis petys, tuo didesnis jėgos momentas", "Kad jėgos momentas būtų lygus nuliui"], "M = F · d: prie pat vyrių petys mažas, todėl durims atidaryti reikėtų daug didesnės jėgos."],
      ["Kokiais vienetais matuojamas jėgos momentas?", "N·m", ["N", "W", "N/m"], "Momentas – jėgos (N) ir peties (m) sandauga, todėl jo vienetas – niutonmetras, N·m."]
    ],
    s: [
      ["Kuris skridinys neduoda jėgos laimėjimo, o tik pakeičia jėgos kryptį?", "Nekilnojamasis", ["Kilnojamasis", "Ir kilnojamasis, ir nekilnojamasis", "Nė vienas"], "Nekilnojamojo skridinio ašis pritvirtinta, abi lyno šakos įtemptos vienodai: F = P."],
      ["Kilnojamuoju skridiniu jėgos laimima 2 kartus. O kelio?", "Pralaimima 2 kartus – lyno reikia ištraukti dvigubai daugiau", ["Taip pat laimima 2 kartus", "Kelias nesikeičia", "Pralaimima 4 kartus"], "Tai auksinė mechanikos taisyklė: kiek kartų laimime jėgos, tiek kartų pralaimime kelio."],
      ["Kodėl patogu naudoti nekilnojamąjį skridinį, nors jėgos juo nelaimima?", "Lyną galima traukti žemyn – pakeičiama jėgos kryptis", ["Sumažėja krovinio svoris", "Atliekama mažiau darbo", "Krovinys kyla dvigubai greičiau"], "Traukti žemyn patogiau nei kelti aukštyn, nors jėga lieka tokia pati."],
      ["Kilnojamasis skridinys pats turi svorį. Kaip tai pakeičia jėgą, kuria reikia traukti lyną?", "Jėga padidėja – keliamas ir krovinys, ir skridinys", ["Jėga sumažėja", "Jėga nepasikeičia", "Jėga tampa lygi skridinio svoriui"], "F = (P + P<sub>skr</sub>) : 2 – lyno šakos laiko ir krovinį, ir skridinį."],
      ["Prie kilnojamojo skridinio pridėtas nekilnojamasis, kad lyną būtų galima traukti žemyn. Kiek kartų dabar laimima jėgos?", "2 kartus – nekilnojamasis tik pakeičia kryptį", ["4 kartus", "3 kartus", "Jėgos nebelaimima"], "Jėgos laimėjimą duoda tik kilnojamasis skridinys."]
    ],
    g: [
      ["Ką teigia auksinė mechanikos taisyklė?", "Kiek kartų laimime jėgos, tiek kartų pralaimime kelio", ["Kiek kartų laimime jėgos, tiek kartų laimime ir kelio", "Paprastieji mechanizmai sumažina atliekamą darbą", "Kuo ilgesnis svertas, tuo mažesnį darbą reikia atlikti"], "Todėl darbo laimėjimo neduoda nė vienas paprastasis mechanizmas."],
      ["Ar paprastasis mechanizmas gali sumažinti darbą, kurio reikia kroviniui pakelti?", "Ne – darbo laimėjimo neduoda nė vienas mechanizmas", ["Taip, jei svertas pakankamai ilgas", "Taip, kilnojamasis skridinys darbą sumažina perpus", "Taip, jei nuožulnioji plokštuma labai nuolaidi"], "Mechanizmais laimime jėgos arba kelio, bet ne darbo."],
      ["Į tą patį aukštį veda dvi nuožulniosios plokštumos: trumpa stati ir ilga nuolaidi. Trinties nepaisome. Kuria krovinį užtraukti reikia mažesnės jėgos?", "Ilga nuolaidžia", ["Trumpa stačia", "Abiem reikia vienodos jėgos", "Abiem atvejais jėga lygi krovinio svoriui"], "F · l = P · h: kuo ilgesnė plokštuma, tuo mažesnės jėgos reikia."],
      ["Į tą patį aukštį veda dvi nuožulniosios plokštumos: trumpa stati ir ilga nuolaidi. Trinties nepaisome. Kuria užtraukiant krovinį atliekamas didesnis darbas?", "Darbas vienodas", ["Ilga nuolaidžia", "Trumpa stačia", "Priklauso nuo to, kaip greitai traukiama"], "Abiem atvejais A = P · h. Ilgesne plokštuma traukiama mažesne jėga, bet ilgesnį kelią."],
      ["Du keltuvai pakėlė vienodus krovinius į tą patį aukštį: pirmasis per 10 s, antrasis per 20 s. Kuris teiginys teisingas?", "Darbas vienodas, bet pirmojo galia didesnė", ["Pirmasis atliko didesnį darbą", "Galia vienoda, skiriasi tik darbas", "Antrojo keltuvo galia didesnė"], "Darbas A = P · h vienodas. Galia N = A : t – kas tą patį darbą atlieka greičiau, tas galingesnis."],
      ["Kada jėga neatlieka mechaninio darbo?", "Kai jėgos veikiamas kūnas nepajuda", ["Kai kūnas juda jėgos kryptimi", "Kai jėga labai didelė", "Kai kūnas juda lėtai"], "Mechaninis darbas atliekamas tik tada, kai jėgos veikiamas kūnas pasislenka: A = F · s."]
    ],
    e: [
      ["Kodėl tikro mechanizmo naudingumo koeficientas visada mažesnis už 100 %?", "Dalis darbo sunaudojama trinčiai nugalėti ir pačiam mechanizmui judinti", ["Nes mechanizmais laimima jėgos", "Nes naudingas darbas didesnis už visą", "Nes kroviniai būna per sunkūs"], "Visas darbas = naudingas darbas + darbas trinčiai nugalėti ir mechanizmo dalims kelti."],
      ["Krovinys užtraukiamas nuožulniąja plokštuma. Kuris darbas yra naudingas?", "Darbas, kurio reikia kroviniui pakelti į aukštį h (P · h)", ["Traukos jėgos darbas visu plokštumos ilgiu (F · l)", "Trinties jėgos darbas", "Visų jėgų darbų suma"], "F · l – tai visas darbas. Naudingas darbas – tik tai, dėl ko mechanizmas naudojamas: krovinio pakėlimas."],
      ["Mechanizmo naudingumo koeficientas 80 %. Ką tai reiškia?", "Naudingas darbas sudaro 80 % viso atlikto darbo", ["Mechanizmu laimima jėgos 80 kartų", "Naudinga tik 20 % atlikto darbo", "Visas darbas sudaro 80 % naudingo darbo"], "η = A<sub>n</sub> : A<sub>v</sub> · 100 %. Likę 20 % – nuostoliai."],
      ["Kaip padidinti nuožulniosios plokštumos naudingumo koeficientą?", "Sumažinti trintį, pavyzdžiui, krovinį vežti ant ratukų", ["Krovinį traukti greičiau", "Traukti didesne jėga", "Nudažyti plokštumą"], "Kuo mažesnė trintis, tuo mažesnė viso darbo dalis prarandama."],
      ["Ar mechanizmo naudingumo koeficientas gali būti 120 %?", "Ne – naudingas darbas negali būti didesnis už visą atliktą darbą", ["Taip, jei mechanizmas labai geras", "Taip, jei svertas labai ilgas", "Taip, jei visai nėra trinties"], "Net ir be trinties η būtų lygus 100 %, bet ne didesnis – tai išplaukia iš energijos tvermės dėsnio."]
    ]
  },

  /* ---------- „Noriu pasimokyti“ ---------- */
  learn: [
    { name: "Svertas ir jo pusiausvyra", level: 0, html: `<p><b>Svertas</b> – kietas kūnas, galintis suktis apie atramos tašką (ašį). Sūpynės, laužtuvas, žirklės, svarstyklės – visa tai svertai.</p>
      <p><b>Jėgos petys</b> (d) – trumpiausias atstumas nuo sukimosi ašies iki tiesės, išilgai kurios veikia jėga.</p>
      <p>Svertas pusiausviras, kai jį veikiančios jėgos atvirkščiai proporcingos jų pečiams:</p>
      <span class="mk-ex">F₁ · d₁ = F₂ · d₂</span>
      <p>Pavyzdys: kairėje 6 N svarelis kabo 0,2 m nuo atramos. Kur dešinėje pakabinti 4 N svarelį? 6 N · 0,2 m = 4 N · d₂, taigi d₂ = 0,3 m.</p>` },
    { name: "Jėgos momentas ir momentų taisyklė", level: 1, html: `<p><b>Jėgos momentas</b> rodo, kaip stipriai jėga suka kūną:</p>
      <span class="mk-ex">M = F · d &nbsp;(vienetas – N·m)</span>
      <p>Petį visada versk metrais: 25 cm = 0,25 m. Pavyzdys: 40 N · 0,25 m = 10 N·m.</p>
      <p><b>Momentų taisyklė:</b> kūnas pusiausviras, kai jį į vieną pusę sukančių jėgų momentų suma lygi į kitą pusę sukančių jėgų momentų sumai. Ji tinka ir tada, kai svertą veikia daugiau nei dvi jėgos.</p>
      <p>Didesnė jėga dar nereiškia didesnio momento: 20 N jėga, kurios petys 0,4 m (8 N·m), suka stipriau nei 30 N jėga, kurios petys 0,2 m (6 N·m).</p>` },
    { name: "Skridiniai", level: 2, html: `<p><b>Nekilnojamasis skridinys</b> (jo ašis pritvirtinta) jėgos laimėjimo neduoda: F = P. Jis tik pakeičia jėgos kryptį – galima traukti žemyn.</p>
      <p><b>Kilnojamasis skridinys</b> kyla kartu su kroviniu. Krovinį laiko dvi lyno šakos, todėl jėgos laimima 2 kartus:</p>
      <span class="mk-ex">F = P : 2</span>
      <p>Užtat lyno reikia ištraukti dvigubai daugiau: krovinys pakyla h, lyno galas – 2h.</p>
      <p>Jei skridinys pats sveria, lynas kelia ir jį: F = (P + P<sub>skr</sub>) : 2.</p>` },
    { name: "Mechaninis darbas ir galia", level: 3, html: `<p><b>Mechaninis darbas</b> atliekamas, kai jėgos veikiamas kūnas pasislenka. Kai jėga veikia išilgai judėjimo krypties:</p>
      <span class="mk-ex">A = F · s &nbsp;(vienetas – džaulis, J)</span>
      <p>Keliant krovinį tolygiai, A = P · h. Pavyzdys: 500 N krovinį pakelti į 4 m aukštį – 2000 J darbo.</p>
      <p><b>Galia</b> rodo, kaip sparčiai atliekamas darbas:</p>
      <span class="mk-ex">N = A : t &nbsp;(vienetas – vatas, W)</span>
      <p>Pavyzdys: 2000 J per 10 s – 200 W galia.</p>` },
    { name: "Auksinė mechanikos taisyklė ir nuožulnioji plokštuma", level: 3, html: `<p><b>Auksinė mechanikos taisyklė:</b> kiek kartų laimime jėgos, tiek kartų pralaimime kelio. Todėl darbo laimėjimo neduoda nė vienas paprastasis mechanizmas.</p>
      <p><b>Nuožulnioji plokštuma.</b> Be trinties darbas traukiant plokštuma lygus darbui keliant stačiai:</p>
      <span class="mk-ex">F · l = P · h</span>
      <p>Pavyzdys: 600 N dėžę reikia užkelti į 1 m aukštį 3 m ilgio plokštuma: F = 600 N · 1 m : 3 m = 200 N. Jėgos laimėta 3 kartus, kelio pralaimėta 3 kartus.</p>` },
    { name: "Naudingumo koeficientas", level: 4, html: `<p>Tikruose mechanizmuose dalis darbo sunaudojama trinčiai nugalėti ir pačiam mechanizmui judinti. Todėl <b>visas darbas</b> (A<sub>v</sub>) didesnis už <b>naudingą</b> (A<sub>n</sub>).</p>
      <span class="mk-ex">η = A<sub>n</sub> : A<sub>v</sub> · 100 %</span>
      <p>Pavyzdys: 600 N dėžė užtraukiama į 1 m aukštį 4 m ilgio plokštuma, traukiant 200 N jėga. A<sub>n</sub> = 600 J, A<sub>v</sub> = 200 N · 4 m = 800 J, η = 75 %.</p>
      <p>Naudingumo koeficientas visada mažesnis už 100 %.</p>` }
  ]
};
})();
