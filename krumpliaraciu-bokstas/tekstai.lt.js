/* MokomėsKartu.lt – „Krumpliaračių bokštas“ (7 kl., matematika): visi mokiniui rodomi tekstai. */
(function(){
"use strict";
const nf = x => String(Math.round(x * 100) / 100).replace(".", ",").replace("-", "−");
/* žodžio forma pagal skaičių: "vns.|dgs.|kilm." */
const f = (n, s) => { const p = s.split("|"), d = n % 10, h = n % 100; return n + " " + (d === 1 && h !== 11 ? p[0] : d >= 2 && (h < 10 || h >= 20) ? p[1] : p[2]); };
const DANT = "dantį|dantis|dantų", KART = "kartą|kartus|kartų", DANTV = "dantis|dantys|dantų";
const dv = (a, b) => { const q = a / b; return (Math.abs(q * 100 - Math.round(q * 100)) < 1e-9 ? "= " : "≈ ") + nf(q); };
const ex = s => `<span class="ex">${s}</span>`;

window.MK_T = {
  nf, f,
  title: "Krumpliaračių bokštas",
  heroA: "Krumpliaračių", heroB: "bokštas",
  hero: "Miesto bokšto laikrodis sustojo. Padėk laikrodininkei Ugnei: parink krumpliaračius, vitražus ir greičius taip, kad viskas sutaptų. Pirma apskaičiuok – tada suk.",
  heroAria: "Laikrodininkė Ugnė bokšto dirbtuvėje prie dviejų sukibusių krumpliaračių",
  pts: "Taškai", next: "Toliau →", finish: "Baigti", again: "Bandyti dar kartą",
  runG: "Sukti", runR: "Tikrinti plotą", runS: "Važiuoti",
  tries: n => `Bandymai: ${n} / 3`,
  hit: "Pavyko!", miss: "Dar ne.", hint: "Užuomina:",
  bad: "Dar ne. Pagalvok ir pabandyk dar kartą.",
  bad2: a => `Teisingas atsakymas: ${a}`,
  shown: "Parodžiau teisingą sprendimą.",
  res: (ok, n, p) => `Iš pirmo karto: ${ok} iš ${n}. Surinkta taškų: ${p}.`,
  kinds: { T: "Tiesioginis proporcingumas", A: "Atvirkštinis proporcingumas", N: "Nei vienas, nei kitas" },
  qKind: "Koks tai sąryšis?",
  levels: [
    ["Tiesiogiai ar atvirkščiai?", "Atpažink sąryšį iš situacijos ir lentelės"],
    ["Krumpliaračiai", "Dantų skaičius ir apsisukimai"],
    ["Lentelės ir grafikai", "Skaičių poros, I/O lentelės, grafikas"],
    ["Vitražas ir kelias", "Pastovus plotas, pastovus kelias"],
    ["Meistro uždaviniai", "Tiesioginis ar atvirkštinis? Nuspręsk ir apskaičiuok"],
    ["Bokšto egzaminas", "10 mišrių užduočių"]
  ],
  colH: "Bokšto mechanizmas",
  colP: (n, rank) => n >= 12 ? `Visi 12 krumpliaračių vietoje – laikrodis eina! Tavo vardas dirbtuvėje: <b>${rank}</b>.`
    : `Sumontuota krumpliaračių: <b>${n} / 12</b>. Kiekviena lygyje pelnyta žvaigždutė – naujas krumpliaratis. Sumontuok 12 ir laikrodis vėl eis. Dabar tu – <b>${rank}</b>.`,
  ranks: ["Mokinys", "Pameistrys", "Laikrodininkas", "Bokšto meistras"],
  gear: { teeth: z => f(z, DANTV), teethQ: "? dantų", turns: "aps.", idle: "tarpinis" },
  rect: { area: "Plotas", need: "Reikia" },
  trip: { road: "Kelias", time: "Laikas", goal: "Tikslas", from: "Kalvė", to: "Bokštas" },
  tabX: "x", tabY: "y",
  heads: { A: [["Greitis, km/h", "Laikas, h"], ["Plotis, dm", "Aukštis, dm"], ["Darbininkai", "Dienos"], ["Dantys", "Apsisukimai"], ["Kaina, €", "Kiekis, vnt."]],
           T: [["Laikas, h", "Kelias, km"], ["Kiekis, vnt.", "Kaina, €"], ["Dažai, l", "Plotas, m²"], ["Kraštinė, cm", "Perimetras, cm"]] },

  /* ---------- 1 lygis: situacijos ---------- */
  sit: [
    { k: "T", t: "Bandelės kaina nesikeičia. Dydžiai: nupirktų bandelių skaičius ir už jas sumokėta suma.", w: "Kiek kartų daugiau bandelių, tiek kartų didesnė suma. Santykis suma : skaičius pastovus – tai vienos bandelės kaina." },
    { k: "T", t: "Automobilis važiuoja pastoviu greičiu. Dydžiai: važiavimo laikas ir nuvažiuotas kelias.", w: "Per 2 kartus ilgesnį laiką nuvažiuojama 2 kartus daugiau. Santykis kelias : laikas pastovus – tai greitis." },
    { k: "T", t: "Dydžiai: kvadrato kraštinės ilgis ir kvadrato perimetras.", w: "P = 4 · a. Kraštinę padidinus 3 kartus, perimetras taip pat padidėja 3 kartus. Santykis P : a visada 4." },
    { k: "T", t: "Vinys vienodos. Dydžiai: vinių skaičius ir jų bendra masė.", w: "Kiek kartų daugiau vinių, tiek kartų didesnė masė. Santykis masė : skaičius pastovus – tai vienos vinies masė." },
    { k: "T", t: "Iš čiaupo vanduo teka tolygiai. Dydžiai: laikas ir pribėgusio vandens tūris.", w: "Per 3 kartus ilgesnį laiką pribėga 3 kartus daugiau vandens. Santykis tūris : laikas pastovus." },
    { k: "T", t: "Valandos atlygis pastovus. Dydžiai: dirbtų valandų skaičius ir uždarbis.", w: "Dirbus 2 kartus ilgiau, uždirbama 2 kartus daugiau. Santykis uždarbis : valandos pastovus – tai valandos atlygis." },
    { k: "T", t: "Dažų sluoksnis visur vienodas. Dydžiai: nudažytos sienos plotas ir sunaudotų dažų kiekis.", w: "2 kartus didesniam plotui reikia 2 kartus daugiau dažų. Santykis pastovus." },
    { k: "T", t: "Žemėlapio mastelis vienas. Dydžiai: atstumas žemėlapyje ir tikrasis atstumas vietovėje.", w: "Kiek kartų didesnis atstumas žemėlapyje, tiek kartų didesnis ir tikrasis atstumas – jų santykį nusako mastelis." },
    { k: "T", t: "Pyragas kepamas pagal tą patį receptą. Dydžiai: porcijų skaičius ir reikalingas miltų kiekis.", w: "3 kartus daugiau porcijų – 3 kartus daugiau miltų. Santykis miltai : porcijos pastovus." },
    { k: "T", t: "Krumpliaratis sukasi. Dydžiai: jo apsisukimų skaičius ir pro sukibimo vietą praėjusių dantų skaičius.", w: "Per kiekvieną apsisukimą praeina tiek pat dantų. 2 kartus daugiau apsisukimų – 2 kartus daugiau dantų." },
    { k: "T", t: "Spausdintuvas spausdina tolygiai. Dydžiai: spausdinimo laikas ir atspausdintų lapų skaičius.", w: "Per 2 kartus ilgesnį laiką atspausdinama 2 kartus daugiau lapų. Santykis lapai : laikas pastovus." },
    { k: "T", t: "Dydžiai: lygiakraščio trikampio kraštinės ilgis ir jo perimetras.", w: "P = 3 · a. Kraštinę padidinus 2 kartus, perimetras padidėja 2 kartus. Santykis P : a visada 3." },

    { k: "A", t: "Kelias tas pats. Dydžiai: važiavimo greitis ir laikas, per kurį kelias įveikiamas.", w: "Kiek kartų didesnis greitis, tiek kartų trumpesnis laikas. Sandauga greitis · laikas pastovi – tai kelias." },
    { k: "A", t: "Stačiakampio plotas nesikeičia. Dydžiai: stačiakampio ilgis ir plotis.", w: "Ilgį padidinus 2 kartus, plotis turi sumažėti 2 kartus. Sandauga ilgis · plotis pastovi – tai plotas." },
    { k: "A", t: "Visi darbininkai dirba vienodai sparčiai. Dydžiai: darbininkų skaičius ir laikas tam pačiam darbui atlikti.", w: "3 kartus daugiau darbininkų tą patį darbą atlieka per 3 kartus trumpesnį laiką. Sandauga darbininkai · laikas pastovi." },
    { k: "A", t: "Pinigų suma ta pati. Dydžiai: vieno metro grandinės kaina ir kiek metrų grandinės galima nupirkti už visą sumą.", w: "Kai kaina 2 kartus didesnė, už tuos pačius pinigus nuperkama 2 kartus mažiau. Sandauga kaina · kiekis pastovi – tai turima suma." },
    { k: "A", t: "Baseinas tas pats, siurbliai vienodi. Dydžiai: siurblių skaičius ir baseino pripildymo laikas.", w: "2 kartus daugiau siurblių pripildo baseiną per 2 kartus trumpesnį laiką. Sandauga pastovi." },
    { k: "A", t: "Tortas dalijamas lygiomis dalimis. Dydžiai: valgytojų skaičius ir vienam tenkančio gabalo masė.", w: "Kai valgytojų 2 kartus daugiau, kiekvieno gabalas 2 kartus mažesnis. Sandauga pastovi – tai viso torto masė." },
    { k: "A", t: "Du krumpliaračiai sukibę, varantysis ratas nesikeičia. Dydžiai: varomojo rato dantų skaičius ir jo apsisukimų skaičius per minutę.", w: "Kuo daugiau dantų turi varomasis ratas, tuo lėčiau jis sukasi: 2 kartus daugiau dantų – 2 kartus mažiau apsisukimų. Sandauga dantys · apsisukimai pastovi." },
    { k: "A", t: "Pašaro atsarga ta pati. Dydžiai: gyvūnų skaičius ir dienų, kurioms užteks pašaro, skaičius.", w: "2 kartus daugiau gyvūnų tą patį pašarą suės per 2 kartus trumpesnį laiką. Sandauga pastovi." },
    { k: "A", t: "Virvė karpoma lygiais gabalais. Dydžiai: vieno gabalo ilgis ir gabalų skaičius.", w: "Kuo ilgesni gabalai, tuo jų mažiau: 3 kartus ilgesnių gabalų išeina 3 kartus mažiau. Sandauga pastovi – tai visos virvės ilgis." },
    { k: "A", t: "Grindys tos pačios. Dydžiai: vienos plytelės plotas ir reikalingų plytelių skaičius.", w: "2 kartus didesnių plytelių reikia 2 kartus mažiau. Sandauga pastovi – tai grindų plotas." },
    { k: "A", t: "Atstumas tas pats. Dydžiai: žingsnio ilgis ir žingsnių skaičius.", w: "Kuo ilgesnis žingsnis, tuo mažiau žingsnių. Sandauga žingsnio ilgis · žingsnių skaičius pastovi – tai atstumas." },
    { k: "A", t: "Sulčių kiekis tas pats. Dydžiai: stiklinės talpa ir pripilamų stiklinių skaičius.", w: "Į 2 kartus didesnes stiklines sulčių užteks 2 kartus mažiau stiklinių. Sandauga pastovi – tai visas sulčių kiekis." },

    { k: "N", t: "Dydžiai: žmogaus amžius ir jo ūgis.", w: "Dvigubai vyresnis žmogus nėra dvigubai aukštesnis (ir ne dvigubai žemesnis). Nei santykis, nei sandauga nėra pastovūs." },
    { k: "N", t: "Dydžiai: kvadrato kraštinės ilgis ir kvadrato plotas.", w: "Kraštinę padidinus 2 kartus, plotas padidėja 4 kartus (S = a · a). Abu dydžiai didėja, bet ne tiek pat kartų – tai ne tiesioginis proporcingumas." },
    { k: "N", t: "Taksi: 2 € įsėdimo mokestis ir 1 € už kiekvieną kilometrą. Dydžiai: nuvažiuotas kelias ir kelionės kaina.", w: "2 km kainuoja 4 €, o 4 km – 6 €: kelias padidėjo 2 kartus, o kaina – ne. Dėl pastovaus įsėdimo mokesčio santykis nepastovus." },
    { k: "N", t: "Knygoje 200 puslapių. Dydžiai: perskaitytų puslapių skaičius ir likusių puslapių skaičius.", w: "Vienas dydis didėja, kitas mažėja, bet pastovi yra jų SUMA (200), o ne sandauga. Perskaičius 50 lieka 150, perskaičius 100 lieka 100: perskaityta 2 kartus daugiau, o liko ne 2 kartus mažiau." },
    { k: "N", t: "Stačiakampio perimetras nesikeičia. Dydžiai: stačiakampio ilgis ir plotis.", w: "Kai perimetras pastovus, pastovi ilgio ir pločio SUMA, o ne sandauga. Pavyzdžiui, kai perimetras 20: 2 ir 8, 4 ir 6 – ilgis padidėjo 2 kartus, o plotis sumažėjo ne 2 kartus." },
    { k: "N", t: "Brolis 3 metais vyresnis už seserį. Dydžiai: sesers amžius ir brolio amžius.", w: "Pastovus yra SKIRTUMAS (3 metai), o ne santykis: 2 ir 5, 4 ir 7 – sesers amžius padidėjo 2 kartus, o brolio – ne." },
    { k: "N", t: "Žvakė dega tolygiai. Dydžiai: degimo laikas ir likusios žvakės aukštis.", w: "Aukštis kas valandą sumažėja tiek pat centimetrų, bet sandauga laikas · aukštis nepastovi. Tolygus mažėjimas dar nėra atvirkštinis proporcingumas." },
    { k: "N", t: "Dydžiai: kubo briaunos ilgis ir kubo tūris.", w: "Briauną padidinus 2 kartus, tūris padidėja 8 kartus. Abu dydžiai didėja, bet ne tiek pat kartų." },
    { k: "N", t: "Dydžiai: paros valanda ir oro temperatūra lauke.", w: "Temperatūra per parą ir kyla, ir krinta – ji nesusijusi su valanda nei pastoviu santykiu, nei pastovia sandauga." },
    { k: "N", t: "Turnyre kiekvienas žaidėjas sužaidžia po vieną partiją su kiekvienu kitu. Dydžiai: žaidėjų skaičius ir visų partijų skaičius.", w: "2 žaidėjai sužaidžia 1 partiją, 4 žaidėjai – 6 partijas: žaidėjų 2 kartus daugiau, o partijų – 6 kartus daugiau." },
    { k: "N", t: "Mėnesio mokestis: 5 € abonentinis ir 2 € už kiekvieną gigabaitą. Dydžiai: sunaudotų gigabaitų skaičius ir mėnesio sąskaita.", w: "1 GB – 7 €, 2 GB – 9 €: gigabaitų 2 kartus daugiau, o sąskaita – ne. Dėl pastovaus abonentinio mokesčio santykis nepastovus." },
    { k: "N", t: "Dydžiai: mokinio ūgis ir jo matematikos pažymys.", w: "Tarp šių dydžių apskritai nėra sąryšio – nei santykis, nei sandauga nėra pastovūs." }
  ],

  /* ---------- „Kaip pasikeis?“ ---------- */
  chgOpts: n => [`Padidės ${n} kartus`, `Sumažės ${n} kartus`, "Nepasikeis", "Negalima nustatyti"],
  chg: [
    { k: "A", id: "darb", t: (n, up) => `Darbininkų skaičius ${up ? "padidėjo" : "sumažėjo"} ${n} kartus (visi dirba vienodai sparčiai). Kaip pasikeis laikas, per kurį jie atliks tą patį darbą?`, w: "Darbininkų skaičius ir laikas tam pačiam darbui – atvirkščiai proporcingi dydžiai." },
    { k: "A", id: "greit", t: (n, up) => `Sunkvežimiuko greitis ${up ? "padidėjo" : "sumažėjo"} ${n} kartus. Kaip pasikeis laikas, per kurį jis įveiks tą patį kelią?`, w: "Kai kelias tas pats, greitis ir laikas – atvirkščiai proporcingi dydžiai." },
    { k: "A", id: "rect", t: (n, up) => `Stačiakampio vitražo plotį ${up ? "padidino" : "sumažino"} ${n} kartus, o plotas turi likti tas pats. Kaip turi pasikeisti aukštis?`, w: "Kai plotas pastovus, plotis ir aukštis – atvirkščiai proporcingi dydžiai." },
    { k: "A", id: "gear", t: (n, up) => `Varomąjį krumpliaratį pakeitė kitu, turinčiu ${n} kartus ${up ? "daugiau" : "mažiau"} dantų (varantysis ratas sukasi kaip sukęsis). Kaip pasikeis varomojo rato apsisukimų skaičius per minutę?`, w: "Varomojo rato dantų skaičius ir jo apsisukimų skaičius – atvirkščiai proporcingi dydžiai." },
    { k: "A", id: "kaina", t: (n, up) => `Grandinės metro kaina ${up ? "padidėjo" : "sumažėjo"} ${n} kartus. Kaip pasikeis grandinės ilgis, kurį galima nupirkti už tą pačią pinigų sumą?`, w: "Kai suma ta pati, kaina ir kiekis – atvirkščiai proporcingi dydžiai." },
    { k: "A", id: "xyA", t: (n, up) => `Dydžiai x ir y atvirkščiai proporcingi. x reikšmė ${up ? "padidėjo" : "sumažėjo"} ${n} kartus. Kaip pasikeitė y reikšmė?`, o: n => [`Padidėjo ${n} kartus`, `Sumažėjo ${n} kartus`, "Nepasikeitė", "Negalima nustatyti"], w: "Atvirkščiai proporcingų dydžių sandauga x · y pastovi." },
    { k: "T", id: "kelias", t: (n, up) => `Traukinys važiuoja pastoviu greičiu. Važiavimo laikas ${up ? "padidėjo" : "sumažėjo"} ${n} kartus. Kaip pasikeis nuvažiuotas kelias?`, w: "Kai greitis pastovus, laikas ir kelias – tiesiogiai proporcingi dydžiai." },
    { k: "T", id: "prek", t: (n, up) => `Vienodų varžtų perkama ${n} kartus ${up ? "daugiau" : "mažiau"}. Kaip pasikeis už juos mokama suma?`, w: "Kai kaina pastovi, kiekis ir suma – tiesiogiai proporcingi dydžiai." },
    { k: "T", id: "kvadr", t: (n, up) => `Kvadrato kraštinę ${up ? "padidino" : "sumažino"} ${n} kartus. Kaip pasikeis kvadrato perimetras?`, w: "Kvadrato kraštinė ir perimetras (P = 4 · a) – tiesiogiai proporcingi dydžiai." },
    { k: "T", id: "nA", t: (n, up) => `Du krumpliaračiai sukibę, jų niekas nekeičia. Varantysis ratas apsisuko ${n} kartus ${up ? "daugiau" : "mažiau"} kartų negu vakar. Kaip pasikeitė varomojo rato apsisukimų skaičius?`, o: n => [`Padidėjo ${n} kartus`, `Sumažėjo ${n} kartus`, "Nepasikeitė", "Negalima nustatyti"], w: "Kai dantų skaičiai nesikeičia, abiejų ratų apsisukimų skaičiai – tiesiogiai proporcingi dydžiai." },
    { k: "T", id: "xyT", t: (n, up) => `Dydžiai x ir y tiesiogiai proporcingi. x reikšmė ${up ? "padidėjo" : "sumažėjo"} ${n} kartus. Kaip pasikeitė y reikšmė?`, o: n => [`Padidėjo ${n} kartus`, `Sumažėjo ${n} kartus`, "Nepasikeitė", "Negalima nustatyti"], w: "Tiesiogiai proporcingų dydžių santykis y : x pastovus." }
  ],
  chgW: (k, n, up, base) => `${base} ${k === "A" ? `Vienam dydžiui ${up ? "padidėjus" : "sumažėjus"} ${n} kartus, kitas ${up ? "sumažėja" : "padidėja"} ${n} kartus – kitaip sandauga nebūtų ta pati.` : `Vienam dydžiui ${up ? "padidėjus" : "sumažėjus"} ${n} kartus, kitas taip pat ${up ? "padidėja" : "sumažėja"} ${n} kartus – kitaip santykis nebūtų tas pats.`}`,

  /* ---------- klausimai ---------- */
  q: {
    tabRec: "Lentelėje – dviejų dydžių reikšmės. Koks tai sąryšis?",
    tMiss: k => `Lentelėje – ${k === "A" ? "atvirkščiai" : "tiesiogiai"} proporcingų dydžių reikšmės. Koks skaičius turi būti vietoje klaustuko?`,
    tWhich: k => `Kurioje lentelėje dydžius x ir y sieja ${k === "A" ? "atvirkštinis" : "tiesioginis"} proporcingumas?`,
    gWhich: k => `Kuris grafikas vaizduoja ${k === "A" ? "atvirkštinį" : "tiesioginį"} proporcingumą?`,
    gRead: (k, X) => `Grafike pavaizduotas ${k === "A" ? "atvirkštinis" : "tiesioginis"} proporcingumas. Kam lygi y reikšmė, kai x = ${X}?`,
    gProd: "Grafike pavaizduotas atvirkštinis proporcingumas. Kam lygi sandauga x · y bet kuriame grafiko taške?",
    pair: (k, x, y) => `Dydžiai x ir y ${k === "A" ? "atvirkščiai" : "tiesiogiai"} proporcingi. Kai x = ${x}, tai y = ${nf(y)}. Kuri skaičių pora (x; y) taip pat priklauso šiam sąryšiui?`,
    g1: (zA, nA, zB) => `Ratas A turi ${f(zA, DANT)}, ratas B – ${f(zB, DANT)}. Ratas A apsisuka ${f(nA, KART)}. Kiek kartų per tą laiką apsisuka ratas B?`,
    g2: (zA, nA, nB) => `Ratas A turi ${f(zA, DANT)}. Kol jis apsisuka ${f(nA, KART)}, ratas B turi apsisukti lygiai ${f(nB, KART)}. Parink ratui B dantų skaičių.`,
    g3: (zA, zB, nB) => `Ratas A turi ${f(zA, DANT)}, ratas B – ${f(zB, DANT)}. Ratas B turi apsisukti lygiai ${f(nB, KART)}. Kiek kartų reikia apsukti ratą A?`,
    g4: (zA, zC, zB, nA) => `Trys ratai sukibę iš eilės: A turi ${f(zA, DANT)}, tarpinis C – ${f(zC, DANT)}, B – ${f(zB, DANT)}. Ratas A apsisuka ${f(nA, KART)}. Kiek kartų apsisuka ratas B?`,
    g5: (k, more) => `Ratas B turi ${k} kartus ${more ? "daugiau" : "mažiau"} dantų negu ratas A. Kuris teiginys teisingas?`,
    g5o: (k, more) => [`B apsisuka ${k} kartus ${more ? "mažiau" : "daugiau"} kartų negu A`, `B apsisuka ${k} kartus ${more ? "daugiau" : "mažiau"} kartų negu A`, "Abu ratai apsisuka po tiek pat kartų", `B apsisuka ${k} apsisukimais ${more ? "mažiau" : "daugiau"} negu A`],
    g6: (nA, zB, nB) => `Kol ratas A apsisuka ${f(nA, KART)}, ratas B, turintis ${f(zB, DANT)}, apsisuka ${f(nB, KART)}. Kiek dantų turi ratas A?`,
    rSet: (S, w1, h1, w2) => `Bokšto langui skirta ${S} dm² spalvoto stiklo. Senasis vitražas buvo ${w1} dm pločio ir ${h1} dm aukščio. Naujojo plotis – ${w2} dm, o plotas turi likti tas pats. Parink aukštį.`,
    rCh: (w1, h1, w2) => `Stačiakampio vitražo plotis ${w1} dm, aukštis ${h1} dm. Meistrė nori kito vitražo – tokio paties ploto, bet ${w2} dm pločio. Koks turi būti jo aukštis?`,
    sSet: (v1, t1, t2) => `Sunkvežimiukas veža krumpliaratį iš kalvės į bokštą. Važiuodamas ${v1} km/h greičiu, jis atvyksta per ${nf(t1)} h. Parink greitį, kad tuo pačiu keliu atvyktų lygiai per ${nf(t2)} h.`,
    sCh: (v1, t1, v2) => `Važiuodamas ${v1} km/h greičiu, sunkvežimiukas kelią iš kalvės į bokštą įveikia per ${nf(t1)} h. Per kiek laiko jis įveiks tą patį kelią važiuodamas ${v2} km/h greičiu?`
  },
  par: { zB: "Rato B dantys", nA: "Rato A apsisukimai", h: "Aukštis", v: "Greitis" },
  hintG: "abiejų sukibusių ratų sandauga „dantų skaičius · apsisukimų skaičius“ yra vienoda.",
  hintR: "plotas pastovus: plotis · aukštis turi būti toks pat kaip senojo vitražo.",
  hintS: "kelias pastovus: greitis · laikas turi būti toks pat kaip anksčiau.",
  r: {
    g: (n, ok, nB) => ok ? `Ratas B apsisuko ${nf(n)} k. – kaip tik!` : `Ratas B apsisuko ${Math.abs(n * 100 - Math.round(n * 100)) > 1e-6 ? "≈ " : ""}${nf(n)} k., o reikėjo ${nf(nB)} k.`,
    rr: (w, h, S) => `Plotas: ${w} · ${h} = ${w * h} dm²${w * h === S ? " – kaip tik!" : `, o reikia ${S} dm².`}`,
    s: (t, t2) => `Atvyko per ${nf(t)} h${Math.abs(t - t2) < 1e-9 ? " – kaip tik!" : `, o reikėjo per ${nf(t2)} h.`}`
  },
  /* ---------- paaiškinimai ---------- */
  w: {
    tabA: (xs, ys) => `Sandauga x · y visur ta pati: ${xs.slice(0, 3).map((x, i) => `${nf(x)} · ${nf(ys[i])} = ${nf(x * ys[i])}`).join(", ")}… Tai atvirkštinis proporcingumas.`,
    tabT: (xs, ys) => `Santykis y : x visur tas pats: ${xs.slice(0, 3).map((x, i) => `${nf(ys[i])} : ${nf(x)} = ${nf(ys[i] / x)}`).join(", ")}… Tai tiesioginis proporcingumas.`,
    tabN: (xs, ys, why) => { let a = [0, 1], b = [0, 1]; const n = xs.length, df = (p, q) => Math.abs(p - q) > 1e-9;
      for(let i = 0; i < n; i++) for(let j = n - 1; j > i; j--){ if(df(ys[i] * xs[j], ys[j] * xs[i])) a = [i, j]; if(df(xs[i] * ys[i], xs[j] * ys[j])) b = [i, j]; }
      return `Santykis nepastovus: ${nf(ys[a[0]])} : ${nf(xs[a[0]])} ${dv(ys[a[0]], xs[a[0]])}, bet ${nf(ys[a[1]])} : ${nf(xs[a[1]])} ${dv(ys[a[1]], xs[a[1]])}. Sandauga taip pat nepastovi: ${nf(xs[b[0]])} · ${nf(ys[b[0]])} = ${nf(xs[b[0]] * ys[b[0]])}, bet ${nf(xs[b[1]])} · ${nf(ys[b[1]])} = ${nf(xs[b[1]] * ys[b[1]])}. ${why}`; },
    nSum: "Čia pastovi suma x + y.", nLin: "Čia y kaskart padidėja tiek pat, bet santykis nepastovus.", nSq: "Čia y = x · x.", nDec: "Čia y mažėja tolygiai, bet sandauga nepastovi.",
    tMissA: (x0, y0, x, y) => `Atvirkščiai proporcingų dydžių sandauga pastovi: ${nf(x0)} · ${nf(y0)} = ${nf(x0 * y0)}. Todėl ieškomas skaičius ${nf(x0 * y0)} : ${nf(x)} = <b>${nf(y)}</b>.`,
    tMissT: (x0, y0, x, y) => `Tiesiogiai proporcingų dydžių santykis pastovus: ${nf(y0)} : ${nf(x0)} = ${nf(y0 / x0)}. Todėl ieškomas skaičius ${nf(y0 / x0)} · ${nf(x)} = <b>${nf(y)}</b>.`,
    tWhichA: (L, xs, ys) => `Lentelėje ${L} sandauga x · y visur lygi ${nf(xs[0] * ys[0])}. Kitose lentelėse sandauga keičiasi (vienoje iš jų pastovus santykis – ten tiesioginis proporcingumas).`,
    tWhichT: (L, xs, ys) => `Lentelėje ${L} santykis y : x visur lygus ${nf(ys[0] / xs[0])}. Kitose lentelėse santykis keičiasi.`,
    gWhichA: L => `Atvirkštinio proporcingumo grafikas – kreivė (grafikas ${L}): x didėjant y mažėja vis lėčiau, kreivė artėja prie ašių, bet jų neliečia. Tiesė, kuri leidžiasi žemyn, nėra atvirkštinis proporcingumas – jos taškų sandauga x · y nepastovi.`,
    gWhichT: L => `Tiesioginio proporcingumo grafikas – tiesė, einanti per koordinačių pradžios tašką (0; 0) (grafikas ${L}). Tiesė, kuri neina per (0; 0), tiesioginio proporcingumo nevaizduoja.`,
    gReadA: (px, py, X, y) => `Pasirink aiškų grafiko tašką, pavyzdžiui, (${px}; ${py}): sandauga x · y = ${px * py}. Kai x = ${X}, tai y = ${px * py} : ${X} = <b>${nf(y)}</b>.`,
    gReadT: (px, py, X, y) => `Pasirink aiškų grafiko tašką, pavyzdžiui, (${px}; ${py}): santykis y : x = ${nf(py / px)}. Kai x = ${X}, tai y = ${nf(py / px)} · ${X} = <b>${nf(y)}</b>.`,
    gProd: (px, py) => `Paimk bet kurį tašką, pavyzdžiui, (${px}; ${py}): ${px} · ${py} = <b>${px * py}</b>. Kituose taškuose sandauga tokia pati – tuo ir pasižymi atvirkštinis proporcingumas.`,
    pairA: (x, y, a, b) => `Sandauga turi likti ${nf(x)} · ${nf(y)} = ${nf(x * y)}. Tinka pora (${nf(a)}; ${nf(b)}): ${nf(a)} · ${nf(b)} = ${nf(a * b)}.`,
    pairT: (x, y, a, b) => `Santykis turi likti ${nf(y)} : ${nf(x)} = ${nf(y / x)}. Tinka pora (${nf(a)}; ${nf(b)}): ${nf(b)} : ${nf(a)} = ${nf(b / a)}.`,
    g: (zA, nA, zB, nB) => `Sukibę ratai pasisuka per tiek pat dantų, todėl sandauga dantys · apsisukimai abiem vienoda. Ratas A: ${zA} · ${nf(nA)} = ${nf(zA * nA)} dantų. Ratas B: ${nf(zA * nA)} : ${zB} = <b>${nf(nB)}</b> aps.`,
    g2: (zA, nA, zB, nB) => `Ratas A pasisuka per ${zA} · ${nA} = ${zA * nA} dantų. Ratas B per tiek pat dantų turi apsisukti ${nB} kartus, todėl jam reikia ${zA * nA} : ${nB} = <b>${zB}</b> dantų. Kuo daugiau kartų ratas turi apsisukti, tuo mažiau dantų jam reikia (atvirkštinis proporcingumas).`,
    g3: (zA, nA, zB, nB) => `Ratas B turi pasisukti per ${zB} · ${nB} = ${zB * nB} dantų. Ratui A tam reikia ${zB * nB} : ${zA} = <b>${nf(nA)}</b> aps. Pastaba: kai ratų nekeičiame, A ir B apsisukimų skaičiai tiesiogiai proporcingi.`,
    g4: (zA, nA, zB, nB, zC) => `Tarpinis ratas C tik perduoda judesį: visi trys ratai pasisuka per tiek pat dantų. A: ${zA} · ${nf(nA)} = ${nf(zA * nA)} dantų, todėl B: ${nf(zA * nA)} : ${zB} = <b>${nf(nB)}</b> aps. Rato C dantų skaičius (${zC}) atsakymui įtakos neturi.`,
    g5: (k, more) => `Sandauga dantys · apsisukimai abiem ratams vienoda. Jei dantų ${k} kartus ${more ? "daugiau" : "mažiau"}, apsisukimų turi būti ${k} kartus ${more ? "mažiau" : "daugiau"}. „Kartais“, o ne „apsisukimais“ – tai atvirkštinis proporcingumas.`,
    g6: (zA, nA, zB, nB) => `Ratas B pasisuko per ${zB} · ${nB} = ${zB * nB} dantų. Ratas A per tiek pat dantų apsisuko ${nA} kartus, todėl jis turi ${zB * nB} : ${nA} = <b>${zA}</b> dantų.`,
    r: (S, w1, h1, w2, h2) => `Plotas pastovus: ${w1} · ${h1} = ${S} dm². Naujasis aukštis: ${S} : ${w2} = <b>${h2} dm</b>. Plotis ${w2 > w1 ? "padidėjo" : "sumažėjo"}, todėl aukštis ${w2 > w1 ? "sumažėjo" : "padidėjo"} tiek pat kartų.`,
    s: (v1, t1, v2, t2) => `Kelias pastovus: ${v1} · ${nf(t1)} = ${nf(v1 * t1)} km. Tada ${nf(v1 * t1)} : ${nf(t2)} = ${v2} km/h, o ${nf(v1 * t1)} : ${v2} = ${nf(t2)} h. Didesnis greitis – trumpesnis laikas (atvirkštinis proporcingumas).`,
    wpA: (r, a, b, c, x) => `${r} Tai atvirkštinis proporcingumas – sandauga pastovi: ${a} · ${b} = ${a * b}. Tada ${a * b} : ${c} = <b>${x}</b>.`,
    wpT: (r, a, b, c, x) => `${r} Tai tiesioginis proporcingumas – santykis pastovus: ${a} : ${b} = ${c} : x. Iš proporcijos x = ${b} · ${c} : ${a} = <b>${x}</b>.`
  },

  /* ---------- 5 lygis: tekstiniai uždaviniai. ar – a ir c rėžiai [nuo, iki, žingsnis] arba sąrašas; br – b ir x ---------- */
  wp: [
    { k: "A", id: "darb", ar: [2, 12], br: [2, 24], u: "d.", r: "Daugiau darbininkų – mažiau dienų tam pačiam darbui.",
      q: (a, b, c) => `${f(a, "darbininkas|darbininkai|darbininkų")} bokšto sieną nutinkuoja per ${f(b, "dieną|dienas|dienų")}. Per kiek dienų tą patį darbą atliktų ${f(c, "darbininkas|darbininkai|darbininkų")}, jei visi dirba vienodai sparčiai?` },
    { k: "A", id: "siurb", ar: [2, 10], br: [2, 24], u: "h", r: "Daugiau siurblių – trumpesnis laikas.",
      q: (a, b, c) => `${f(a, "siurblys|siurbliai|siurblių")} išpumpuoja vandenį iš bokšto rūsio per ${b} h. Per kiek valandų tai padarytų ${f(c, "toks pat siurblys|tokie patys siurbliai|tokių pačių siurblių")}?` },
    { k: "A", id: "stakl", ar: [2, 9], br: [2, 30], u: "h", r: "Daugiau staklių – trumpesnis laikas tam pačiam užsakymui.",
      q: (a, b, c) => `${a} vienodos staklės krumpliaračių užsakymą pagamina per ${b} h. Per kiek valandų tą patį užsakymą pagamintų ${c} tokios staklės?` },
    { k: "A", id: "pasar", ar: [2, 9], br: [3, 30], u: "d.", r: "Daugiau arklių – tų pačių atsargų užtenka trumpiau.",
      q: (a, b, c) => `Šieno atsargų ${a} arkliams užtenka ${f(b, "dienai|dienoms|dienų")}. Kelioms dienoms tų pačių atsargų užtektų ${c} arkliams?` },
    { k: "A", id: "dezes", ar: [4, 30, 2], br: [3, 40], u: "", r: "Kuo daugiau telpa į vieną dėžę, tuo mažiau dėžių reikia.",
      q: (a, b, c) => `Jei į vieną dėžę telpa ${a} vnt. varžtų, visiems varžtams sudėti reikia ${b} dėžių. Kiek dėžių reikėtų, jei į vieną dėžę tilptų ${c} vnt.?` },
    { k: "A", id: "kaina", ar: [2, 12], br: [2, 36], u: "m", r: "Kuo brangesnis metras, tuo mažiau metrų nuperkama už tą pačią sumą.",
      q: (a, b, c) => `Už turimus pinigus meistrė gali nupirkti ${b} m grandinės, kai metras kainuoja ${a} €. Kiek metrų grandinės ji nupirktų už tuos pačius pinigus, jei metras kainuotų ${c} €?` },
    { k: "A", id: "dvir", ar: [10, 12, 15, 18, 20, 24, 30], br: [10, 90], u: "min", r: "Didesnis greitis – trumpesnis laikas tam pačiam keliui.",
      q: (a, b, c) => `Pasiuntinys dviračiu kelią nuo kalvės iki bokšto įveikia per ${b} min, važiuodamas ${a} km/h greičiu. Per kiek minučių jis įveiktų tą patį kelią važiuodamas ${c} km/h greičiu?` },
    { k: "A", id: "plyt", ar: [2, 12], br: [10, 120], u: "", r: "Kuo didesnė plytelė, tuo mažiau plytelių reikia toms pačioms grindims.",
      q: (a, b, c) => `Bokšto grindims iškloti reikia ${b} plytelių, kurių kiekvienos plotas ${a} dm². Kiek plytelių reikėtų, jei vienos plytelės plotas būtų ${c} dm²?` },
    { k: "A", id: "krump", ar: [8, 10, 12, 15, 16, 18, 20, 24, 30, 36, 40], br: [2, 30], u: "", r: "Kuo daugiau dantų turi sukibęs ratas, tuo mažiau kartų jis apsisuka.",
      q: (a, b, c) => `Du krumpliaračiai sukibę. Pirmasis turi ${f(a, DANT)} ir per minutę apsisuka ${f(b, KART)}. Kiek kartų per minutę apsisuka antrasis, turintis ${f(c, DANT)}?` },
    { k: "A", id: "sunkv", ar: [2, 12], br: [3, 30], u: "", r: "Kuo didesnė keliamoji galia, tuo mažiau reisų reikia.",
      q: (a, b, c) => `Smėlį bokšto remontui ${a} t keliamosios galios sunkvežimis suveža per ${f(b, "reisą|reisus|reisų")}. Per kiek reisų tą patį smėlį suvežtų ${c} t keliamosios galios sunkvežimis?` },
    { k: "A", id: "eilut", ar: [20, 24, 25, 30, 32, 36, 40, 45, 48], br: [40, 240], u: "", r: "Kuo daugiau eilučių puslapyje, tuo mažiau puslapių.",
      q: (a, b, c) => `Bokšto metraštis perrašomas į naują knygą. Jei puslapyje būtų ${f(a, "eilutė|eilutės|eilučių")}, knyga turėtų ${f(b, "puslapį|puslapius|puslapių")}. Kiek puslapių ji turėtų, jei puslapyje būtų ${f(c, "eilutė|eilutės|eilučių")}?` },
    { k: "A", id: "virve", ar: [2, 12], br: [2, 40], u: "", r: "Kuo ilgesni gabalai, tuo jų mažiau.",
      q: (a, b, c) => `Visą varpo virvės ritinį sukarpius gabalais po ${a} m, išeina ${f(b, "gabalas|gabalai|gabalų")}. Kiek gabalų išeitų, jei kiekvieno ilgis būtų ${c} m?` },

    { k: "T", id: "pirk", ar: [2, 12], br: [4, 96], u: "€", r: "Daugiau krumpliaračių – didesnė suma.",
      q: (a, b, c) => `Už ${f(a, "vienodą krumpliaratį|vienodus krumpliaračius|vienodų krumpliaračių")} meistrė sumokėjo ${b} €. Kiek eurų kainuotų ${f(c, "toks krumpliaratis|tokie krumpliaračiai|tokių krumpliaračių")}?` },
    { k: "T", id: "trauk", ar: [2, 9], br: [60, 720, 10], u: "km", r: "Ilgesnis laikas – ilgesnis kelias (greitis pastovus).",
      q: (a, b, c) => `Važiuodamas pastoviu greičiu traukinys per ${a} h nuvažiuoja ${b} km. Kiek kilometrų jis nuvažiuotų per ${c} h?` },
    { k: "T", id: "gamyb", ar: [2, 9], br: [10, 240, 2], u: "", r: "Ilgesnis laikas – daugiau detalių.",
      q: (a, b, c) => `Staklės per ${a} h pagamina ${f(b, "detalę|detales|detalių")}. Kiek detalių jos pagamintų per ${c} h, dirbdamos taip pat sparčiai?` },
    { k: "T", id: "dazai", ar: [2, 12], br: [10, 120], u: "m²", r: "Daugiau dažų – didesnis nudažomas plotas.",
      q: (a, b, c) => `${a} l dažų užtenka nudažyti ${b} m² bokšto sienos. Kiek kvadratinių metrų sienos galima nudažyti ${c} l tokių dažų?` },
    { k: "T", id: "velav", ar: [2, 14], br: [4, 90], u: "s", r: "Daugiau parų – didesnis atsilikimas.",
      q: (a, b, c) => `Bokšto laikrodis per ${f(a, "parą|paras|parų")} atsilieka ${b} s. Kiek sekundžių jis atsiliktų per ${f(c, "parą|paras|parų")}, jei vėluotų taip pat tolygiai?` },
    { k: "T", id: "mase", ar: [2, 12], br: [3, 90], u: "kg", r: "Daugiau krumpliaračių – didesnė masė.",
      q: (a, b, c) => `${f(a, "vienodas krumpliaratis|vienodi krumpliaračiai|vienodų krumpliaračių")} sveria ${b} kg. Kiek kilogramų sveria ${f(c, "toks krumpliaratis|tokie krumpliaračiai|tokių krumpliaračių")}?` },
    { k: "T", id: "atlyg", ar: [2, 12], br: [10, 180], u: "€", r: "Daugiau darbo valandų – didesnis atlygis.",
      q: (a, b, c) => `Už ${a} h darbo pameistrys gauna ${b} €. Kiek eurų jis gautų už ${c} h, jei valandos atlygis tas pats?` },
    { k: "T", id: "svyt", ar: [4, 30, 2], br: [3, 60], u: "", r: "Ilgesnis laikas – daugiau svyravimų.",
      q: (a, b, c) => `Laikrodžio švytuoklė per ${a} s susvyruoja ${f(b, KART)}. Kiek kartų ji susvyruotų per ${c} s?` },
    { k: "T", id: "degal", ar: [2, 12], br: [20, 240, 5], u: "km", r: "Daugiau degalų – ilgesnis kelias.",
      q: (a, b, c) => `${a} l degalų sunkvežimiukui užtenka ${b} km. Kiek kilometrų jis nuvažiuotų su ${c} l degalų?` },
    { k: "T", id: "brez", ar: [2, 12], br: [2, 60], u: "m", r: "Ilgesnė atkarpa brėžinyje – didesnis tikrasis ilgis (mastelis tas pats).",
      q: (a, b, c) => `Bokšto brėžinyje ${a} cm atitinka ${b} m tikrojo aukščio. Kiek metrų atitinka ${c} cm tame pačiame brėžinyje?` }
  ],

  /* ---------- „Noriu pasimokyti“ ---------- */
  learn: [
    { name: "Tiesioginis proporcingumas (prisimink)", level: 0, html: `<p>Du dydžiai <b>tiesiogiai proporcingi</b>, kai vienam padidėjus (sumažėjus) kelis kartus, kitas padidėja (sumažėja) <b>tiek pat kartų</b>.</p>
      <p>Tada jų <b>santykis pastovus</b>: ${ex("y : x = pastovus skaičius")}</p>
      <p>Pavyzdys: 3 varžtai kainuoja 6 €, 6 varžtai – 12 €, 9 varžtai – 18 €. Visur 6 : 3 = 12 : 6 = 18 : 9 = 2.</p>
      <p>Grafikas – tiesė, einanti per tašką (0; 0).</p>` },
    { name: "Atvirkštinis proporcingumas", level: 0, html: `<p>Du dydžiai <b>atvirkščiai proporcingi</b>, kai vienam padidėjus kelis kartus, kitas <b>sumažėja tiek pat kartų</b>.</p>
      <p>Tada jų <b>sandauga pastovi</b>: ${ex("x · y = pastovus skaičius")}</p>
      <p>Pavyzdys: tas pats 120 km kelias. Greitis 30 km/h – 4 h, 60 km/h – 2 h, 40 km/h – 3 h. Visur 30 · 4 = 60 · 2 = 40 · 3 = 120.</p>
      <p>Kiti pavyzdžiai: stačiakampio ilgis ir plotis, kai plotas pastovus; darbininkų skaičius ir laikas tam pačiam darbui.</p>` },
    { name: "Kaip atskirti?", level: 0, html: `<ul><li>Abu dydžiai kinta <b>ta pačia kryptimi tiek pat kartų</b> → tiesioginis proporcingumas (tikrink santykį).</li>
      <li>Dydžiai kinta <b>priešingomis kryptimis tiek pat kartų</b> → atvirkštinis proporcingumas (tikrink sandaugą).</li>
      <li>Jei pastovi <b>suma</b> ar <b>skirtumas</b> (perskaityti ir likę puslapiai, brolio ir sesers amžius) arba yra pastovus priedas (taksi įsėdimo mokestis) – tai <b>nei vienas, nei kitas</b>.</li></ul>
      <p>Patarimas: paimk dvi skaičių poras ir patikrink – ar tas pats santykis? ar ta pati sandauga?</p>` },
    { name: "Krumpliaračiai", level: 1, html: `<p>Sukibusių krumpliaračių dantys prasilenkia po vieną, todėl abu ratai pasisuka per <b>tiek pat dantų</b>:</p>
      <p>${ex("dantys · apsisukimai = pastovu")}</p>
      <p>Pavyzdys: ratas A turi 12 dantų ir apsisuka 6 kartus – tai 72 dantys. Ratas B turi 24 dantis, todėl apsisuka 72 : 24 = 3 kartus.</p>
      <p>Daugiau dantų – mažiau apsisukimų. Tarpinis ratas tarp jų atsakymo nekeičia – jis tik perduoda judesį.</p>` },
    { name: "Lentelė ir grafikas", level: 2, html: `<p><b>Lentelėje</b> (ji dar vadinama įvesties–išvesties lentele) tikrink kiekvieną stulpelį: jei x · y visur vienoda – atvirkštinis proporcingumas, jei y : x visur vienodas – tiesioginis.</p>
      <p><b>Grafike</b> atvirkštinį proporcingumą vaizduoja kreivė: x didėjant, y mažėja vis lėčiau; kreivė artėja prie ašių, bet jų neliečia. Tiesioginį proporcingumą vaizduoja tiesė per (0; 0).</p>
      <p>Norėdamas rasti reikšmę, kurios grafike nematyti, paimk aiškų tašką, apskaičiuok sandaugą (arba santykį) ir pritaikyk ją.</p>` },
    { name: "Kaip spręsti uždavinį", level: 4, html: `<ol><li>Nuspręsk: daugiau vieno – daugiau ar mažiau kito?</li>
      <li><b>Atvirkštinis:</b> sudaugink žinomą porą, tada padalyk iš trečio skaičiaus. Pavyzdys: 6 darbininkai – 12 dienų, 9 darbininkai – ? 6 · 12 = 72, 72 : 9 = 8 dienos.</li>
      <li><b>Tiesioginis:</b> sudaryk proporciją. Pavyzdys: 4 l dažų – 28 m², 6 l – ? 4 : 28 = 6 : x, x = 28 · 6 : 4 = 42 m².</li>
      <li>Patikrink, ar atsakymas protingas: jei darbininkų daugiau, dienų turi būti mažiau.</li></ol>` }
  ]
};
})();
