/* Turgaus aikštė – visi mokiniui rodomi tekstai (lietuvių k.). Verčiant keisti tik šį failą.
   Terminai – pagal Ekonomikos ir verslumo bendrąją programą (10 ir II gimnazijos klasė) ir jos įgyvendinimo rekomendacijas:
   „paklausos ir pasiūlos dėsniai“, „kainos formavimosi mechanizmas“, „paklausos ir pasiūlos veiksniai“, „rinkos pusiausvyra (kaina ir kiekis)“,
   „rinkos kaina“, „stygius“, „perteklius“, „vartotojų išlaidos“, „pardavimų pajamos“, „kaštai“, „pastovūs kaštai“, „savikaina“,
   „pelnas“, „nuostolis“, „lūžio (nenuostolingos gamybos pradžios) taškas“, „alternatyvieji kaštai“, „pakaitalas“. */
(function(){
"use strict";
const eur = n => String(n).replace("-", "−") + " €";
const UP = "kyla", DN = "krinta";

window.MK_T = {
  eur,
  title: "Turgaus aikštė",
  heroA: "Turgaus", heroB: "aikštė",
  hero: "Tu – turgaus prekeivės Onos patarėjas. Skaityk paklausos ir pasiūlos lenteles bei grafikus, nustatyk kainą ir atidaryk turgų: pamatysi, ar prekių užteks visiems pirkėjams.",
  heroAria: "Turgaus aikštė: prekeivė Ona prie prekystalio, pirkėjai su krepšiais",
  pts: "Taškai",
  next: "Toliau", finish: "Baigti", open: "Atidaryti turgų", again: "Bandyti dar kartą",
  rule: "Paaiškinimas",
  bad: a => `Teisingas atsakymas: ${a}`, badPlain: "Šį kartą nepavyko.",
  tries: n => n === 1 ? "Liko 1 bandymas." : `Liko ${n} bandymai.`,
  setHint: "Pasirink ir spausk „Atidaryti turgų“.",
  price: "Kaina", qty: "Kiekis", priceE: "Kaina, €", dem: "Paklausa", sup: "Pasiūla",
  demQ: "Paklausos kiekis", supQ: "Pasiūlos kiekis", profitCol: "Pelnas, €",
  pickRow: "Paliesk lentelės eilutę – pasirinksi kainą.",
  yourPrice: "Tavo kaina", yourQty: "Parduodamas kiekis",
  funcNote: u => `P – kaina (€), Q – kiekis (${u})`,
  dLine: f => `Paklausa: ${f}`, sLine: f => `Pasiūla: ${f}`,
  change: "Pokytis",
  cap: {
    eq: (q, u) => `Rinkos pusiausvyra: parduota ${q} ${u}, visi patenkinti.`,
    short: (n, u) => `Stygius – ${n} ${u}: dalis pirkėjų liko be prekės.`,
    surplus: (n, u) => `Perteklius – ${n} ${u}: dalis prekių liko neparduota.`,
    profit: n => `Dienos pelnas – ${eur(n)}.`, loss: n => `Dienos nuostolis – ${eur(n)}.`, zero: "Pelnas – 0 €: pajamos lygios kaštams.",
    wait: "Turgus dar uždarytas."
  },

  /* prekės: [vardininkas, kilmininkas, matavimo vienetas, prekės spalva, stogelio spalva, mažiausia ir didžiausia kaina] */
  goods: [
    ["braškės", "braškių", "kg", "#e5243b", "#ff8a8a", 3, 9],
    ["medus", "medaus", "vnt.", "#f2a900", "#ffd166", 5, 12],
    ["duona", "duonos", "vnt.", "#b9772c", "#e9c38f", 2, 7],
    ["sūris", "sūrio", "vnt.", "#ffd43b", "#9bd0ff", 4, 11],
    ["ledai", "ledų", "vnt.", "#ff8fc7", "#b9e6ff", 1, 6],
    ["gėlių puokštės", "gėlių puokščių", "vnt.", "#c264ff", "#e6c8ff", 5, 14],
    ["moliniai puodeliai", "molinių puodelių", "vnt.", "#c9703d", "#f0b48a", 6, 15],
    ["vilnonės kojinės", "vilnonių kojinių", "vnt.", "#5b7bd5", "#c9d6ff", 5, 12],
    ["obuoliai", "obuolių", "kg", "#7bd13a", "#c8f0a0", 1, 6],
    ["mėlynės", "mėlynių", "l", "#3b4cc0", "#b8c2ff", 4, 10],
    ["voveraitės", "voveraičių", "kg", "#ff9f1c", "#ffe0a8", 6, 14],
    ["uogienė", "uogienės", "vnt.", "#b0224f", "#ffb3c7", 3, 9],
    ["kava", "kavos", "vnt.", "#6f4e37", "#d9c2a7", 2, 6],
    ["marškinėliai", "marškinėlių", "vnt.", "#13a8d6", "#a8e4f5", 8, 16],
    ["agurkai", "agurkų", "kg", "#2f9e44", "#b2f2bb", 1, 6],
    ["žvakės", "žvakių", "vnt.", "#f4e3b1", "#ffc9a3", 3, 10]
  ],

  levels: [
    ["Paklausa ir pasiūla", "Lentelė: dėsniai, stygius, perteklius, pusiausvyra"],
    ["Rinkos grafikas", "Paklausos ir pasiūlos kreivės, rinkos kaina"],
    ["Veiksniai", "Kas pasislenka – paklausa ar pasiūla – ir kaip keičiasi kaina"],
    ["Funkcijos", "Apskaičiuok rinkos pusiausvyrą iš formulių"],
    ["Prekystalio verslas", "Pajamos, kaštai, pelnas, lūžio taškas"],
    ["Turgaus egzaminas", "10 mišrių sunkesnių užduočių"]
  ],

  q: {
    setEq: g => `Tai ${g} rinka. Nustatyk kainą, kuriai esant bus rinkos pusiausvyra.`,
    setGap: (g, n, u, sh) => `Tai ${g} rinka. Nustatyk kainą, kuriai esant susidarys ${n} ${u} ${sh ? "stygius" : "perteklius"}.`,
    state: (g, p) => `${cap(g)} rinka. Prekeiviai nustatė ${eur(p)} kainą. Kas susidarys rinkoje?`,
    law: (g, p1, p2, dem) => `${cap(g)} rinka. Kaina ${p2 > p1 ? "pakilo" : "nukrito"} nuo ${p1} iki ${eur(p2)}. Kaip pasikeitė ${dem ? "paklausos" : "pasiūlos"} kiekis?`,
    sold: (g, p, u) => `${cap(g)} rinka. Kaina – ${eur(p)}. Kiek ${u} bus iš tikrųjų parduota?`,
    spend: g => `${cap(g)} rinka. Apskaičiuok vartotojų išlaidas (kiek eurų pirkėjai išleis šiai prekei), kai rinka pusiausvyra.`,
    read: (g, p, u, dem) => `${cap(g)} rinka. Kiek ${u} ${dem ? "pirkėjai nori pirkti" : "pardavėjai siūlo parduoti"}, kai kaina ${eur(p)}?`,
    which: dem => `Kreivės pažymėtos raidėmis A ir B. Kuri iš jų – ${dem ? "paklausos" : "pasiūlos"} kreivė ir kodėl?`,
    qEq: (g, u) => `${cap(g)} rinka. Koks yra rinkos pusiausvyros kiekis (${u})?`,
    shiftF: (g, why) => `${cap(g)} rinka. ${why} Nustatyk naują rinkos pusiausvyros kainą.`,
    shift1: (g, s) => `${cap(g)} rinka. ${s} Kas pasikeičia?`,
    shift2: "Kaip dėl to pasikeis rinkos kaina ir parduodamas kiekis?",
    profit: (g, n, u, p, v, F) => `Ona per dieną pardavė ${n} ${u} ${g} po ${eur(p)}. Vienam vienetui pagaminti ji išleidžia ${eur(v)}, o už prekystalio vietą moka ${eur(F)} per dieną (pastovūs kaštai). Koks Onos dienos pelnas?`,
    pl: (g, n, u, p, v, F) => `Ona per dieną pardavė ${n} ${u} ${g} po ${eur(p)}. Vienam vienetui pagaminti ji išleidžia ${eur(v)}, o už prekystalio vietą moka ${eur(F)} per dieną. Pelnas ar nuostolis?`,
    be: (g, u, p, v, F) => `Ona parduoda ${g} po ${eur(p)}. Vienam vienetui pagaminti ji išleidžia ${eur(v)}, o už prekystalio vietą moka ${eur(F)} per dieną (pastovūs kaštai). Rask lūžio tašką: kiek ${u} reikia parduoti, kad pajamos padengtų visus kaštus?`,
    best: (g, v, F) => `Lentelėje – kiek ${g} pirkėjai nupirktų per dieną esant kiekvienai kainai. Vienam vienetui pagaminti Ona išleidžia ${eur(v)}, prekystalio vieta kainuoja ${eur(F)} per dieną. Pasirink kainą, su kuria dienos pelnas bus didžiausias.`,
    cost: (g, n, u, raw, F) => `Ona pagamino ${n} ${u} ${g}: žaliavoms išleido ${eur(raw)}, o prekystalio vieta kainavo ${eur(F)}. Kokia vieno vieneto savikaina?`,
    priceFor: (g, n, u, s, t) => `Vieno ${g} vieneto savikaina – ${eur(s)}. Ona tikisi parduoti ${n} ${u}. Kokią kainą nustatyti, kad pelnas būtų ${eur(t)}?`,
    alt: (who, list, pick) => `Šeštadienį ${who} gali rinktis tik vieną iš trijų veiklų: ${list}. Pasirinko: ${pick}. Kokie šio pasirinkimo alternatyvieji kaštai?`
  },

  o: {
    short: (n, u) => `Stygius – ${n} ${u}`, surplus: (n, u) => `Perteklius – ${n} ${u}`, eq: "Rinkos pusiausvyra",
    dec: (n, u) => `Sumažėjo ${n} ${u}`, inc: (n, u) => `Padidėjo ${n} ${u}`, same: "Nepasikeitė",
    which: (l, down) => `${l}, nes kainai kylant kiekis ${down ? "mažėja" : "didėja"}`,
    s1: ["Paklausa padidėja", "Paklausa sumažėja", "Pasiūla padidėja", "Pasiūla sumažėja"],
    s2: [`Kaina ${UP}, kiekis didėja`, `Kaina ${UP}, kiekis mažėja`, `Kaina ${DN}, kiekis didėja`, `Kaina ${DN}, kiekis mažėja`],
    profit: n => `Pelnas – ${eur(n)}`, loss: n => `Nuostolis – ${eur(n)}`
  },

  fb: {
    price: (p, qd, qs, u) => `Kai kaina ${eur(p)}, pirkėjai nori pirkti ${qd} ${u}, o pardavėjai siūlo ${qs} ${u}` + (qd > qs ? ` – stygius ${qd - qs} ${u}.` : qd < qs ? ` – perteklius ${qs - qd} ${u}.` : " – rinkos pusiausvyra."),
    upHint: " Kai prekės trūksta, kaina kyla.", downHint: " Kai prekės per daug, kaina krinta.",
    needGap: (n, u, sh) => ` Reikia ${n} ${u} ${sh ? "stygiaus" : "pertekliaus"}.`,
    be: (n, u, rev, cost) => `Pardavus ${n} ${u}: pajamos ${eur(rev)}, kaštai ${eur(cost)} – ` + (rev > cost ? `pelnas ${eur(rev - cost)}. Lūžio taškas pasiekiamas anksčiau.` : `nuostolis ${eur(cost - rev)}. Reikia parduoti daugiau.`),
    best: (p, q, v, F, pr) => `Kai kaina ${eur(p)}: (${p} − ${v}) · ${q} − ${F} = ${eur(pr)}. Yra pelningesnė kaina.`
  },

  w: {
    eq: (P, Q, u) => ({ body: `Rinkos pusiausvyra – kai paklausos kiekis lygus pasiūlos kiekiui. Kai kaina ${eur(P)}, abu kiekiai lygūs ${Q} ${u}.`, more: "Jei kaina žemesnė, pirkėjai nori pirkti daugiau, nei pardavėjai siūlo, – susidaro stygius ir kaina kyla. Jei kaina aukštesnė, susidaro perteklius ir kaina krinta. Taip formuojasi rinkos kaina." }),
    gap: (p, qd, qs, u) => ({ body: `Kai kaina ${eur(p)}: paklausos kiekis ${qd} ${u}, pasiūlos kiekis ${qs} ${u}.`, more: qd > qs ? `Paklausos kiekis didesnis: ${qd} − ${qs} = ${qd - qs} ${u} – tai stygius. Stygius susidaro, kai kaina žemesnė už rinkos pusiausvyros kainą.` : qd < qs ? `Pasiūlos kiekis didesnis: ${qs} − ${qd} = ${qs - qd} ${u} – tai perteklius. Perteklius susidaro, kai kaina aukštesnė už rinkos pusiausvyros kainą.` : "Kiekiai lygūs – tai rinkos pusiausvyra: nėra nei stygiaus, nei pertekliaus." }),
    law: (dem, q1, q2, u) => ({ body: dem ? `Paklausos dėsnis: kainai kylant paklausos kiekis mažėja, kainai krintant – didėja.` : `Pasiūlos dėsnis: kainai kylant pasiūlos kiekis didėja, kainai krintant – mažėja.`, more: `Lentelėje: buvo ${q1} ${u}, tapo ${q2} ${u}. Skirtumas – ${Math.abs(q2 - q1)} ${u}.` }),
    sold: (p, qd, qs, u) => ({ body: `Parduoti galima tik tiek, kiek pirkėjai nori pirkti IR kiek pardavėjai siūlo, – mažesnįjį iš dviejų kiekių.`, more: `Kai kaina ${eur(p)}: paklausos kiekis ${qd} ${u}, pasiūlos kiekis ${qs} ${u}. Parduodama ${Math.min(qd, qs)} ${u}` + (qd > qs ? ` (kitiems pirkėjams prekės neužtenka).` : ` (likusios prekės lieka neparduotos).`) }),
    spend: (P, Q, u) => ({ body: `Vartotojų išlaidos = kaina · nupirktas kiekis.`, more: `Rinkos pusiausvyra: kaina ${eur(P)}, kiekis ${Q} ${u}. ${P} · ${Q} = ${eur(P * Q)}.` }),
    read: (dem, p, q, u) => ({ body: dem ? `Paklausos kiekis – kiek pirkėjai nori ir gali nupirkti esant tam tikrai kainai.` : `Pasiūlos kiekis – kiek pardavėjai nori ir gali parduoti esant tam tikrai kainai.`, more: `Nuo ${eur(p)} kainos eik horizontaliai iki ${dem ? "paklausos" : "pasiūlos"} kreivės, tada žemyn iki kiekio ašies: ${q} ${u}.` }),
    which: (dem, l) => ({ body: dem ? `Paklausos kreivė leidžiasi žemyn: kuo aukštesnė kaina, tuo mažiau pirkėjai nori pirkti (paklausos dėsnis). Tai kreivė ${l}.` : `Pasiūlos kreivė kyla aukštyn: kuo aukštesnė kaina, tuo daugiau pardavėjai nori parduoti (pasiūlos dėsnis). Tai kreivė ${l}.`, more: "Kreivių susikirtimo taškas rodo rinkos pusiausvyrą: jos kainą ir kiekį." }),
    func: (lhs, rhs, k, c, P, qline, shiftLine) => ({ body: `Rinkos pusiausvyra: paklausos kiekis = pasiūlos kiekis.`, more: `${shiftLine ? shiftLine + "<br>" : ""}${lhs} = ${rhs}<br>${k}P = ${c}<br>P = ${eur(P)}<br>${qline}` }),
    funcGap: (p, dl, ql, qd, qs, u) => ({ body: `Įstatyk kainą į abi formules ir palygink kiekius.`, more: `Paklausa: ${dl} = ${qd} ${u}.<br>Pasiūla: ${ql} = ${qs} ${u}.<br>` + (qd > qs ? `${qd} − ${qs} = ${qd - qs} ${u} – stygius.` : qd < qs ? `${qs} − ${qd} = ${qs - qd} ${u} – perteklius.` : "Kiekiai lygūs – rinkos pusiausvyra.") }),
    shift: (fk, c, d) => ({
      body: (c === "D" ? `Tai paklausos veiksnys (${fk}): prie kiekvienos kainos pirkėjai nori pirkti ${d > 0 ? "daugiau" : "mažiau"} – paklausos kreivė pasislenka į ${d > 0 ? "dešinę" : "kairę"}.`
        : `Tai pasiūlos veiksnys (${fk}): prie kiekvienos kainos pardavėjai siūlo ${d > 0 ? "daugiau" : "mažiau"} – pasiūlos kreivė pasislenka į ${d > 0 ? "dešinę" : "kairę"}.`),
      more: (c === "D" ? (d > 0 ? "Paklausai padidėjus susidaro stygius, todėl kaina kyla, o pardavėjai siūlo daugiau: nauja rinkos pusiausvyra – aukštesnė kaina ir didesnis kiekis." : "Paklausai sumažėjus susidaro perteklius, todėl kaina krinta, o pardavėjai siūlo mažiau: nauja rinkos pusiausvyra – žemesnė kaina ir mažesnis kiekis.")
        : (d > 0 ? "Pasiūlai padidėjus susidaro perteklius, todėl kaina krinta, o pirkėjai perka daugiau: nauja rinkos pusiausvyra – žemesnė kaina ir didesnis kiekis." : "Pasiūlai sumažėjus susidaro stygius, todėl kaina kyla, o pirkėjai perka mažiau: nauja rinkos pusiausvyra – aukštesnė kaina ir mažesnis kiekis."))
    }),
    profit: (n, p, v, F) => ({ body: `Pelnas = pardavimų pajamos − visi kaštai.`, more: `Pajamos: ${n} · ${p} = ${eur(n * p)}.<br>Kaštai: ${n} · ${v} + ${F} = ${eur(n * v + F)}.<br>${n * p} − ${n * v + F} = ${eur(n * p - n * v - F)}` + (n * p < n * v + F ? " – kaštai didesni už pajamas, tai nuostolis." : ".") }),
    be: (p, v, F, n, u) => ({ body: `Lūžio (nenuostolingos gamybos pradžios) taškas – kiekis, kurį pardavus pajamos lygios visiems kaštams: nėra nei pelno, nei nuostolio.`, more: `Kiekvienas parduotas vienetas, atskaičius jo gamybos išlaidas, duoda ${p} − ${v} = ${eur(p - v)}. Pastoviems kaštams padengti reikia ${F} : ${p - v} = ${n} ${u}.<br>Patikrinimas: pajamos ${n} · ${p} = ${eur(n * p)}; kaštai ${n} · ${v} + ${F} = ${eur(n * v + F)}.` }),
    best: (rows, bp) => ({ body: `Pelningiausia kaina – ${eur(bp)}. Didžiausia kaina ar didžiausias parduotas kiekis dar nereiškia didžiausio pelno.`, more: "Pelnas = (kaina − vieneto gamybos išlaidos) · kiekis − pastovūs kaštai:<br>" + rows.join("<br>") }),
    bestRow: (p, v, q, F, pr) => `${eur(p)}: (${p} − ${v}) · ${q} − ${F} = ${eur(pr)}`,
    cost: (raw, F, n, s) => ({ body: `Savikaina – visi kaštai, tenkantys vienam pagamintam vienetui.`, more: `Visi kaštai: ${raw} + ${F} = ${eur(raw + F)}. Vienam vienetui: ${raw + F} : ${n} = ${eur(s)}.` }),
    priceFor: (s, n, t, p) => ({ body: `Pelnas = (kaina − savikaina) · kiekis.`, more: `Nuo vieno vieneto reikia uždirbti ${t} : ${n} = ${eur(t / n)}. Kaina: ${s} + ${t / n} = ${eur(p)}.` }),
    alt: (best, name) => ({ body: `Alternatyvieji kaštai – geriausios galimybės, kurios atsisakoma pasirinkus kitą, vertė.`, more: `Atsisakyta dviejų veiklų; vertingesnė iš jų – ${name} (${eur(best)}). Tai ir yra alternatyvieji kaštai. Abiejų atsisakytų veiklų sumuoti nereikia: vienu metu būtų galima rinktis tik vieną.` })
  },

  /* funkcijų poslinkių priežastys: [tekstas(k, u), kreivė, ženklas] */
  shiftF: [
    [(k, u) => `Po sėkmingos reklamos pirkėjai prie kiekvienos kainos nori pirkti ${k} ${u} daugiau.`, "D", 1],
    [(k, u) => `Atvykus turistams pirkėjai prie kiekvienos kainos nori pirkti ${k} ${u} daugiau.`, "D", 1],
    [(k, u) => `Atpigus pakaitalui pirkėjai prie kiekvienos kainos nori pirkti ${k} ${u} mažiau.`, "D", -1],
    [(k, u) => `Sumažėjus gyventojų pajamoms pirkėjai prie kiekvienos kainos nori pirkti ${k} ${u} mažiau.`, "D", -1],
    [(k, u) => `Į turgų atvyko naujų pardavėjų: prie kiekvienos kainos siūloma ${k} ${u} daugiau.`, "S", 1],
    [(k, u) => `Atpigus žaliavoms pardavėjai prie kiekvienos kainos siūlo ${k} ${u} daugiau.`, "S", 1],
    [(k, u) => `Pabrangus žaliavoms pardavėjai prie kiekvienos kainos siūlo ${k} ${u} mažiau.`, "S", -1],
    [(k, u) => `Dalis pardavėjų pasitraukė iš turgaus: prie kiekvienos kainos siūloma ${k} ${u} mažiau.`, "S", -1]
  ],
  shiftFLine: (c, f) => `Nauja ${c === "D" ? "paklausa" : "pasiūla"}: ${f}.`,

  /* veiksnių pavadinimai paaiškinimuose */
  fk: {
    oras: "orai ir sezonas", pak: "pakaitalo kaina", pap: "kartu vartojamos prekės kaina", paj: "pirkėjų pajamos", sk: "pirkėjų skaičius", mada: "mada ir pomėgiai", luk: "pirkėjų lūkesčiai",
    zal: "žaliavų ir kitų išteklių kainos", tech: "technologijos", pard: "pardavėjų skaičius", mok: "mokesčiai ir subsidijos", gam: "gamtos sąlygos ir derlius"
  },
  /* situacijos: [rinka (kilmininkas), tekstas, kreivė D/S, kryptis +1/−1, veiksnys] */
  sits: [
    ["ledų", "Sinoptikai praneša: visą savaitę laikysis 30 °C karštis.", "D", 1, "oras"],
    ["braškių", "Gydytojai per televiziją pasakojo, kad braškės labai naudingos sveikatai.", "D", 1, "mada"],
    ["kavos", "Smarkiai pabrango arbata – kavos pakaitalas.", "D", 1, "pak"],
    ["medaus", "Į miestelį atvyko daug turistų – turguje pirkėjų dvigubai daugiau.", "D", 1, "sk"],
    ["marškinėlių", "Gyventojų pajamos padidėjo – žmonės gali daugiau išleisti drabužiams.", "D", 1, "paj"],
    ["vilnonių kojinių", "Prasidėjo labai šalta žiema.", "D", 1, "oras"],
    ["gėlių puokščių", "Artėja Motinos diena.", "D", 1, "oras"],
    ["žvakių", "Artėja Vėlinės.", "D", 1, "oras"],
    ["dviračių", "Smarkiai pabrango benzinas – žmonės ieško pigesnio būdo nei automobilis nuvažiuoti į darbą.", "D", 1, "pak"],
    ["molinių puodelių", "Žinoma nuomonės formuotoja parodė, kad arbatą geria tik iš molinio puodelio, – tai tapo madinga.", "D", 1, "mada"],
    ["uogienės", "Atpigo blynų miltai – žmonės dažniau kepa blynus, o blynai valgomi su uogiene.", "D", 1, "pap"],
    ["obuolių", "Pirkėjai išgirdo, kad kitą savaitę obuoliai brangs, ir skuba jų apsirūpinti jau dabar.", "D", 1, "luk"],
    ["sūrio", "Pabrango mėsa – sumuštiniams žmonės dažniau renkasi sūrį.", "D", 1, "pak"],
    ["mėlynių", "Mokyklose vyksta sveikos mitybos savaitė – vaikai prašo tėvų pirkti uogų.", "D", 1, "mada"],
    ["agurkų", "Prasidėjo raugimo metas – daug šeimų perka agurkus žiemos atsargoms.", "D", 1, "oras"],
    ["ledų", "Visą savaitę lyja ir vėsu.", "D", -1, "oras"],
    ["kavos", "Arbata – kavos pakaitalas – atpigo perpus.", "D", -1, "pak"],
    ["marškinėlių", "Daug miestelio gyventojų neteko darbo – jų pajamos sumažėjo.", "D", -1, "paj"],
    ["voveraičių", "Žiniasklaida pranešė apie apsinuodijimus grybais – žmonės ėmė grybų vengti.", "D", -1, "mada"],
    ["medaus", "Turizmo sezonas baigėsi – turguje pirkėjų gerokai mažiau.", "D", -1, "sk"],
    ["molinių puodelių", "Molinė keramika išėjo iš mados – populiarūs tapo stikliniai puodeliai.", "D", -1, "mada"],
    ["duonos", "Išpopuliarėjo mityba be duonos.", "D", -1, "mada"],
    ["uogienės", "Pabrango blynų miltai – žmonės rečiau kepa blynus, prie kurių valgoma uogienė.", "D", -1, "pap"],
    ["vilnonių kojinių", "Žiema neįprastai šilta.", "D", -1, "oras"],
    ["obuolių", "Kriaušės – obuolių pakaitalas – atpigo perpus.", "D", -1, "pak"],
    ["gėlių puokščių", "Šventės praėjo – progų dovanoti gėles sumažėjo.", "D", -1, "oras"],
    ["braškių", "Pirkėjai tikisi, kad po savaitės braškės atpigs, ir pirkimą atideda.", "D", -1, "luk"],
    ["agurkų", "Šiemet dauguma miestelio gyventojų agurkų užsiaugino patys savo daržuose.", "D", -1, "sk"],
    ["žvakių", "Vėlinės praėjo.", "D", -1, "oras"],
    ["sūrio", "Atpigo mėsa – sumuštiniams žmonės dažniau renkasi ją, o ne sūrį.", "D", -1, "pak"],
    ["braškių", "Orai šiemet labai palankūs – braškių derlius rekordinis.", "S", 1, "gam"],
    ["duonos", "Atpigo miltai – pagrindinė duonos žaliava.", "S", 1, "zal"],
    ["medaus", "Į turgų atvyko dešimt naujų bitininkų.", "S", 1, "pard"],
    ["marškinėlių", "Siuvykla įsigijo naujas, našesnes siuvimo mašinas.", "S", 1, "tech"],
    ["sūrio", "Valstybė ūkininkams skyrė subsidiją už kiekvieną pagamintą sūrį.", "S", 1, "mok"],
    ["molinių puodelių", "Atpigo elektra, kuria kaitinamos keramikų degimo krosnys.", "S", 1, "zal"],
    ["obuolių", "Pavasarį nebuvo šalnų – obuolių užderėjo kaip niekad daug.", "S", 1, "gam"],
    ["agurkų", "Ūkininkai pasistatė šildomus šiltnamius ir užaugina daugiau agurkų.", "S", 1, "tech"],
    ["kavos", "Panaikintas kavos pupelių importo muitas – kavinėms pupelės atpigo.", "S", 1, "mok"],
    ["voveraičių", "Po lietingos savaitės miškuose pridygo daugybė voveraičių.", "S", 1, "gam"],
    ["uogienės", "Atpigo cukrus – svarbi uogienės žaliava.", "S", 1, "zal"],
    ["mėlynių", "Nutiestas naujas kelias į uogingus miškus – uogautojų, parduodančių mėlynes, gerokai padaugėjo.", "S", 1, "pard"],
    ["gėlių puokščių", "Atpigo šiltnamių šildymas – gėlių augintojų kaštai sumažėjo.", "S", 1, "zal"],
    ["ledų", "Ledų gamintojas įdiegė automatinę liniją ir per valandą pagamina dvigubai daugiau.", "S", 1, "tech"],
    ["žvakių", "Atpigo vaškas – žvakių žaliava.", "S", 1, "zal"],
    ["braškių", "Gegužės šalnos sunaikino didelę dalį braškių žiedų.", "S", -1, "gam"],
    ["duonos", "Miltai pabrango trečdaliu.", "S", -1, "zal"],
    ["medaus", "Dėl ligos žuvo daug bičių šeimų.", "S", -1, "gam"],
    ["marškinėlių", "Padidėjo siuvėjų darbo užmokestis – gamintojų kaštai išaugo.", "S", -1, "zal"],
    ["sūrio", "Pabrango pienas – sūrio žaliava.", "S", -1, "zal"],
    ["molinių puodelių", "Pabrango elektra, kuria kaitinamos keramikų degimo krosnys.", "S", -1, "zal"],
    ["obuolių", "Kruša nudaužė didelę dalį obuolių derliaus.", "S", -1, "gam"],
    ["kavos", "Dėl sausros kavos pupelių derlius menkas – pupelės kavinėms pabrango.", "S", -1, "zal"],
    ["voveraičių", "Vasara labai sausa – miškuose grybų beveik nėra.", "S", -1, "gam"],
    ["vilnonių kojinių", "Pabrango vilna – kojinių žaliava.", "S", -1, "zal"],
    ["agurkų", "Pabrango trąšos ir šiltnamių šildymas.", "S", -1, "zal"],
    ["ledų", "Valstybė padidino mokesčius ledų gamintojams.", "S", -1, "mok"],
    ["mėlynių", "Dalis uogautojų išvyko dirbti kitur – mėlynių pardavėjų turguje sumažėjo.", "S", -1, "pard"],
    ["uogienės", "Pabrango stiklainiai ir cukrus.", "S", -1, "zal"],
    ["gėlių puokščių", "Šaltą žiemą šiltnamių šildymas pabrango dvigubai.", "S", -1, "zal"]
  ],

  /* alternatyvieji kaštai: žmonės [vardininkas] ir veiklos [ką daryti, kaip įvardyti paaiškinime] */
  people: ["Ona", "Jonas", "Miglė", "Tomas", "Rūta", "Lukas"],
  acts: [
    ["prekiauti turguje", "prekyba turguje"], ["padėti kavinėje", "darbas kavinėje"], ["prižiūrėti kaimynų vaikus", "vaikų priežiūra"],
    ["vesti ekskursiją turistams", "ekskursija"], ["skinti obuolius ūkyje", "obuolių skynimas"], ["taisyti dviračius", "dviračių taisymas"],
    ["fotografuoti šventę", "fotografavimas"], ["mokyti vaikus groti gitara", "gitaros pamokos"], ["išvežioti užsakymus dviračiu", "užsakymų vežiojimas"]
  ],
  actItem: (a, n) => `${a} (uždirbtų ${eur(n)})`,

  /* „Mano turgus“ */
  colH: "Mano turgus",
  colP: (pts, open, total, rank, nextIn) => `Iš viso uždirbta taškų: <b>${pts}</b>. Atidaryta prekystalių: <b>${open} iš ${total}</b>. Tavo vardas – <b>${rank}</b>.${nextIn ? ` Iki kito prekystalio trūksta ${nextIn} tšk.` : " Visa aikštė pilna!"}`,
  ranks: ["Pameistrys", "Prekeivis", "Turgaus žinovas", "Pirklys", "Aikštės šeimininkas"],
  res: (ok, total, pts, stalls) => `Iš pirmo karto – ${ok} iš ${total}. Uždirbta ${pts} tšk.` + (stalls.length ? ` Naujas prekystalis aikštėje: ${stalls.join(", ")}!` : ""),

  learn: [
    { name: "Paklausa ir pasiūla. Dėsniai", level: 0, html: `<p><b>Paklausa</b> rodo, kiek prekės pirkėjai nori ir gali nupirkti esant įvairioms kainoms. <b>Paklausos dėsnis:</b> kainai kylant paklausos kiekis mažėja, kainai krintant – didėja.</p><p><b>Pasiūla</b> rodo, kiek prekės pardavėjai nori ir gali parduoti esant įvairioms kainoms. <b>Pasiūlos dėsnis:</b> kainai kylant pasiūlos kiekis didėja, kainai krintant – mažėja.</p><span class="mk-ex">Braškės po 4 €: pirkėjai nori 80 kg, pardavėjai siūlo 40 kg. Po 6 €: pirkėjai nori 60 kg, pardavėjai siūlo 60 kg.</span>` },
    { name: "Rinkos pusiausvyra, stygius ir perteklius", level: 0, html: `<p><b>Rinkos pusiausvyra</b> – kai paklausos kiekis lygus pasiūlos kiekiui. Tokia kaina vadinama rinkos (pusiausvyros) kaina.</p><ul><li>Kaina <b>žemesnė</b> už pusiausvyros kainą → pirkėjai nori daugiau, nei siūloma → <b>stygius</b> → kaina kyla.</li><li>Kaina <b>aukštesnė</b> → siūloma daugiau, nei norima pirkti → <b>perteklius</b> → kaina krinta.</li></ul><p>Parduodama visada tik mažesnioji iš dviejų kiekių. <b>Vartotojų išlaidos</b> = kaina · nupirktas kiekis.</p>` },
    { name: "Rinkos grafikas", level: 1, html: `<p>Grafike vertikalioje ašyje – kaina, horizontalioje – kiekis. <b>Paklausos kreivė</b> leidžiasi žemyn, <b>pasiūlos kreivė</b> kyla aukštyn. Jų susikirtimo taškas – rinkos pusiausvyra (kaina ir kiekis).</p><p>Norėdamas sužinoti kiekį, nuo kainos eik horizontaliai iki kreivės ir leiskis žemyn iki kiekio ašies. Tarpas tarp kreivių toje pačioje kainos linijoje – stygius (žemiau pusiausvyros) arba perteklius (aukščiau).</p>` },
    { name: "Paklausos ir pasiūlos veiksniai", level: 2, html: `<p>Kai keičiasi ne pačios prekės kaina, o kitos sąlygos, pasislenka visa kreivė.</p><p><b>Paklausos veiksniai:</b> pirkėjų pajamos, pirkėjų skaičius, pakaitalų ir kartu vartojamų prekių kainos, mada ir pomėgiai, lūkesčiai, orai ir sezonas.</p><p><b>Pasiūlos veiksniai:</b> žaliavų ir kitų išteklių kainos, technologijos, pardavėjų skaičius, mokesčiai ir subsidijos, gamtos sąlygos.</p><ul><li>Paklausa padidėja → kaina kyla, kiekis didėja.</li><li>Paklausa sumažėja → kaina krinta, kiekis mažėja.</li><li>Pasiūla padidėja → kaina krinta, kiekis didėja.</li><li>Pasiūla sumažėja → kaina kyla, kiekis mažėja.</li></ul>` },
    { name: "Pusiausvyra iš funkcijų", level: 3, html: `<p>Paklausą ir pasiūlą galima užrašyti formulėmis, kur P – kaina, Q – kiekis.</p><span class="mk-ex">Paklausa: Q = 120 − 10P. Pasiūla: Q = 20P − 30.<br>120 − 10P = 20P − 30 → 30P = 150 → P = 5 €.<br>Q = 120 − 10 · 5 = 70.</span><p>Jei paklausa prie kiekvienos kainos padidėja 30 vienetų, nauja paklausa: Q = 150 − 10P. Tada 150 − 10P = 20P − 30 → P = 6 €.</p>` },
    { name: "Pajamos, kaštai, pelnas ir lūžio taškas", level: 4, html: `<p><b>Pardavimų pajamos</b> = kaina · parduotas kiekis. <b>Pelnas</b> = pajamos − visi kaštai. Jei kaštai didesni už pajamas, gaunamas <b>nuostolis</b>.</p><p><b>Pastovūs kaštai</b> (pvz., prekystalio vieta) nepriklauso nuo to, kiek parduodama. <b>Savikaina</b> – visi kaštai, tenkantys vienam vienetui.</p><p><b>Lūžio taškas</b> – kiekis, kurį pardavus pajamos lygios kaštams.</p><span class="mk-ex">Kaina 8 €, vieneto gamyba 5 €, vieta 60 €. Vienas vienetas duoda 8 − 5 = 3 €. Lūžio taškas: 60 : 3 = 20 vnt.</span>` },
    { name: "Alternatyvieji kaštai", level: 4, html: `<p>Ištekliai (laikas, pinigai) riboti, todėl renkantis vieną tenka atsisakyti kito. <b>Alternatyvieji kaštai</b> – geriausios atsisakytos galimybės vertė.</p><span class="mk-ex">Galima: prekiauti turguje (80 €), dirbti kavinėje (60 €) arba prižiūrėti vaikus (45 €). Pasirinkus turgų, alternatyvieji kaštai – 60 €.</span>` }
  ]
};
function cap(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
})();
