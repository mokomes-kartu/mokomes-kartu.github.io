/* Meteorologijos stotis – visi mokiniui rodomi tekstai (lietuvių k.).
   Verčiant į kitą kalbą užtenka nukopijuoti šį failą ir išversti reikšmes; žaidimo kodo keisti nereikia.
   Stočių pavadinimai (id → [miestas, šalis]) taip pat verčiami. Skaičių duomenys – stotys.js. */
window.MK_T = {
  title: "Meteorologijos stotis",
  h1: "Meteorologijos <em>stotis</em>",
  hero: "Tu – meteorologijos stoties darbuotojas. Skaityk, skaičiuok ir braižyk klimatogramas, o už kiekvieną sėkmę įsijungs nauja stotis pasaulio tinkle.",
  note: "Turinys pagal Geografijos bendrąją programą (6 kl. „Atmosfera, orai ir klimatas“: klimatograma, temperatūros amplitudė, vidutinė metų oro temperatūra, vidutinis metų kritulių kiekis, šiluminė juosta). Stočių duomenys apvalinti, apytiksliai daugiamečiai vidurkiai. Rezultatai saugomi tik šiame įrenginyje.",
  points: "Taškai",
  levels: [
    ["Skaityk klimatogramą", "kreivė – temperatūra, stulpeliai – krituliai"],
    ["Skaičiuok iš lentelės", "amplitudė, metų vidurkis, kritulių suma"],
    ["Sudaryk klimatogramą", "pagal lentelę užbaik braižinį"],
    ["Šiluminės juostos", "karštoji, vidutinių platumų, šaltoji"],
    ["Klimato detektyvas", "palygink tris stotis"]
  ],
  next: "Toliau", results: "Rezultatai", check: "Patikrinti", confirm: "Taip, šis mėnuo", pick: "Pasirinkta",
  okHead: (praise, pts) => `${praise} +${pts} tšk.`,
  failHead: "Šį kartą nepavyko – štai kaip reikėjo",
  retryHead: "Dar ne tai – pabandyk dar kartą",
  rule: "Taisyklė ir pavyzdys",
  resTitle: (ok, n) => ok === n ? "Visos stotys atsakė!" : ok >= n * 0.6 ? "Gera pamaina!" : "Pirma pamaina baigta",
  resText: (pts, lit) => `Surinkta taškų: ${pts}.` + (lit ? ` Tinkle įsijungė naujų stočių: ${lit}.` : ""),
  months: ["sausis", "vasaris", "kovas", "balandis", "gegužė", "birželis", "liepa", "rugpjūtis", "rugsėjis", "spalis", "lapkritis", "gruodis"],
  monthsGen: ["sausio", "vasario", "kovo", "balandžio", "gegužės", "birželio", "liepos", "rugpjūčio", "rugsėjo", "spalio", "lapkričio", "gruodžio"],
  monthsShort: ["Sau", "Vas", "Kov", "Bal", "Geg", "Bir", "Lie", "Rgp", "Rgs", "Spa", "Lap", "Gru"],
  seasons: ["žiema", "pavasaris", "vasara", "ruduo"],
  seasonMonths: ["gruodis, sausis, vasaris", "kovas, balandis, gegužė", "birželis, liepa, rugpjūtis", "rugsėjis, spalis, lapkritis"],
  belts: ["Karštoji juosta", "Vidutinių platumų juosta", "Šaltoji juosta"],
  beltsShort: ["karštoji", "vidutinių platumų", "šaltoji"],
  lat: (v) => `${Math.abs(v).toString().replace(".", ",")}° ${v >= 0 ? "š. pl." : "p. pl."}`,
  /* tinklas */
  netTitle: "Pasaulio stočių tinklas",
  netText: (n, tot) => `Įsijungė stočių: ${n} iš ${tot}. Už kiekvieną iš pirmo karto teisingą atsakymą apie stotį ji įsijungia tinkle.`,
  netTap: "Bakstelėk įsijungusią stotį – pamatysi jos klimatogramą.",
  netEmpty: "Kol kas nė viena stotis neįsijungusi. Atsakyk teisingai – ir pirmoji užsidegs!",
  ranks: [[0, "Naujokas"], [6, "Stebėtojas"], [15, "Meteorologas"], [28, "Klimatologas"], [42, "Stoties vedėjas"], [56, "Klimato žinovas"]],
  rankLabel: "Laipsnis",
  cardMean: "Vidutinė metų temperatūra", cardAmp: "Temperatūros amplitudė", cardSum: "Metų kritulių kiekis", cardBelt: "Šiluminė juosta",
  stations: {
    "vilnius": ["Vilnius", "Lietuva"], "klaipeda": ["Klaipėda", "Lietuva"], "reikjavikas": ["Reikjavikas", "Islandija"], "londonas": ["Londonas", "Jungtinė Karalystė"],
    "paryzius": ["Paryžius", "Prancūzija"], "berlynas": ["Berlynas", "Vokietija"], "varsuva": ["Varšuva", "Lenkija"], "roma": ["Roma", "Italija"],
    "madridas": ["Madridas", "Ispanija"], "atenai": ["Atėnai", "Graikija"], "stambulas": ["Stambulas", "Turkija"], "maskva": ["Maskva", "Rusija"],
    "peterburgas": ["Sankt Peterburgas", "Rusija"], "stokholmas": ["Stokholmas", "Švedija"], "helsinkis": ["Helsinkis", "Suomija"], "kijevas": ["Kijevas", "Ukraina"],
    "viena": ["Viena", "Austrija"], "lisabona": ["Lisabona", "Portugalija"], "oslas": ["Oslas", "Norvegija"], "ulan-batoras": ["Ulan Batoras", "Mongolija"],
    "pekinas": ["Pekinas", "Kinija"], "tokijas": ["Tokijas", "Japonija"], "almata": ["Almata", "Kazachstanas"], "niujorkas": ["Niujorkas", "JAV"],
    "cikaga": ["Čikaga", "JAV"], "torontas": ["Torontas", "Kanada"], "vankuveris": ["Vankuveris", "Kanada"], "los-andzelas": ["Los Andželas", "JAV"],
    "ankoridzas": ["Ankoridžas", "JAV, Aliaska"], "kairas": ["Kairas", "Egiptas"], "sidnejus": ["Sidnėjus", "Australija"], "melburnas": ["Melburnas", "Australija"],
    "pertas": ["Pertas", "Australija"], "oklandas": ["Oklandas", "Naujoji Zelandija"], "keiptaunas": ["Keiptaunas", "Pietų Afrika"], "johanesburgas": ["Johanesburgas", "Pietų Afrika"],
    "buenos-aires": ["Buenos Airės", "Argentina"], "santjagas": ["Santjagas", "Čilė"], "usuaja": ["Ušuaja", "Argentina"], "singapuras": ["Singapūras", "Singapūras"],
    "kvala-lumpuras": ["Kvala Lumpūras", "Malaizija"], "dzakarta": ["Džakarta", "Indonezija"], "bankokas": ["Bankokas", "Tailandas"], "manausas": ["Manausas", "Brazilija"],
    "kinsasa": ["Kinšasa", "Kongo Demokratinė Respublika"], "akra": ["Akra", "Gana"], "dakaras": ["Dakaras", "Senegalas"], "timbuktu": ["Timbuktu", "Malis"],
    "fortaleza": ["Fortaleza", "Brazilija"], "nairobis": ["Nairobis", "Kenija"], "kitas": ["Kitas", "Ekvadoras"], "lima": ["Lima", "Peru"],
    "longjyrbienas": ["Longjyrbienas", "Norvegija, Svalbardas"], "murmanskas": ["Murmanskas", "Rusija"], "norilskas": ["Norilskas", "Rusija"], "troms": ["Tromsė", "Norvegija"]
  },
  q: {
    tie: "Jei keli mėnesiai atrodo vienodai, tinka bet kuris iš jų.",
    station: (name, country) => `Stotis: ${name} (${country})`,
    warm: "Kuris mėnuo šilčiausias? Bakstelėk jo stulpelį, tada patvirtink.",
    cold: "Kuris mėnuo šalčiausias? Bakstelėk jo stulpelį, tada patvirtink.",
    wet: "Kuriuo mėnesiu iškrinta daugiausia kritulių? Bakstelėk to mėnesio stulpelį, tada patvirtink.",
    dry: "Kuriuo mėnesiu iškrinta mažiausiai kritulių? Bakstelėk to mėnesio stulpelį, tada patvirtink.",
    countT: (th, above) => `Kiek mėnesių vidutinė oro temperatūra ${above ? "aukštesnė" : "žemesnė"} nei ${th < 0 ? "−" + Math.abs(th) : th} °C? Pažiūrėk į brūkšninę liniją.`,
    countP: (th) => `Kiek mėnesių iškrinta daugiau nei ${th} mm kritulių? Pažiūrėk į brūkšninę liniją.`,
    readT: (m) => `Maždaug kokia vidutinė oro temperatūra ${m} mėnesį?`,
    readP: (m) => `Maždaug kiek mm kritulių iškrinta ${m} mėnesį?`,
    cmpT: (a, b) => `Kada vidutiniškai šilčiau: ${a} ar ${b} mėnesį?`,
    cmpP: (a, b) => `Kada iškrinta daugiau kritulių: ${a} ar ${b} mėnesį?`,
    season: "Kuriuo metų laiku iškrinta daugiausia kritulių? (Žiema – gruodis, sausis, vasaris; pavasaris – kovas–gegužė; vasara – birželis–rugpjūtis; ruduo – rugsėjis–lapkritis.)",
    amp: "Apskaičiuok temperatūros amplitudę (šilčiausio ir šalčiausio mėnesių vidutinių temperatūrų skirtumą).",
    mean: "Apskaičiuok vidutinę metų oro temperatūrą (apvalink iki sveiko skaičiaus).",
    sum: "Apskaičiuok metų kritulių kiekį (sudėk visų mėnesių kritulius).",
    summer: (months) => `Kiek mm kritulių iškrinta per tris mėnesius: ${months}?`,
    cmpAmp: "Kuri stotis turi didesnę temperatūros amplitudę?",
    cmpMean: "Kuri stotis turi aukštesnę vidutinę metų temperatūrą?",
    stationA: "Stotis A", stationB: "Stotis B",
    build: (T) => T ? "Nubraižyk temperatūros kreivę: pagal lentelę pažymėk trūkstamų mėnesių taškus." : "Nubraižyk kritulių stulpelius: pagal lentelę nustatyk trūkstamų mėnesių aukštį.",
    buildHelp: "Bakstelėk tuščią mėnesį grafike (arba „‹“ ir „›“), tada tikslink mygtukais − ir +.",
    beltClimo: "Kuriai šiluminei juostai priklauso ši stotis? Spręsk pagal klimatogramą.",
    beltLat: (name, lat) => `${name} yra ${lat} Kurioje šiluminėje juostoje ji yra?`,
    beltPick: (belt) => `Kuri klimatograma tinka stočiai, esančiai juostoje: ${belt.toLowerCase()}?`,
    beltOdd: "Dvi iš šių trijų stočių yra vienoje šiluminėje juostoje. Kuri stotis – iš kitos juostos?",
    warmest: "Kuri stotis (A, B ar C) turi aukščiausią vidutinę metų temperatūrą?",
    coldest: "Kuri stotis turi žemiausią vidutinę metų temperatūrą?",
    ampMax: "Kurios stoties temperatūros amplitudė didžiausia – metų laikai čia skiriasi labiausiai?",
    ampMin: "Kurios stoties temperatūros amplitudė mažiausia – metai praeina beveik be metų laikų skirtumų?",
    wettest: "Kurioje stotyje per metus iškrinta daugiausia kritulių?",
    driest: "Kurioje stotyje per metus iškrinta mažiausiai kritulių?",
    south: "Viena iš šių stočių yra pietų pusrutulyje. Kuri? (Užuomina: kada čia šilčiausia?)",
    north: "Dvi stotys yra pietų pusrutulyje, viena – šiaurės. Kuri stotis šiaurės pusrutulyje?",
    which: "Atsakymas", revealed: "Stotys"
  },
  concept: [
    ["Kas yra klimatas?", ["Vidutinė orų būklė per 30 metų ar ilgesnį laikotarpį", "Šiandienos oras", "Orai per vieną savaitę", "Vėjo greitis ryte"], 0,
      "Orai kinta kiekvieną dieną ir sezoną, o klimatas – tai vidutinė orų būklė per 30 metų ar ilgesnį laikotarpį. Todėl klimatogramose rodomi daugelio metų mėnesių vidurkiai."],
    ["Ką klimatogramoje rodo kreivė?", ["Vidutinę mėnesio oro temperatūrą", "Kritulių kiekį", "Vėjo kryptį", "Debesuotumą"], 0,
      "Kreivė (taškai, sujungti linija) rodo kiekvieno mėnesio vidutinę oro temperatūrą – jos skalė kairėje (°C)."],
    ["Ką klimatogramoje rodo stulpeliai?", ["Mėnesio kritulių kiekį (mm)", "Vidutinę temperatūrą", "Saulėtų dienų skaičių", "Oro slėgį"], 0,
      "Stulpeliai rodo, kiek milimetrų kritulių iškrinta per mėnesį – jų skalė dešinėje (mm)."],
    ["Kaip apskaičiuoti temperatūros amplitudę?", ["Iš šilčiausio mėnesio temperatūros atimti šalčiausio mėnesio temperatūrą", "Sudėti visų mėnesių temperatūras", "Šilčiausią mėnesį padalinti iš šalčiausio", "Sudėti šilčiausią ir šalčiausią mėnesius"], 0,
      "Amplitudė rodo, kiek metų viduje keičiasi temperatūra: didžiausia vidutinė mėnesio temperatūra minus mažiausia. Pavyzdžiui, +19 − (−4) = 23 °C."],
    ["Kaip apskaičiuoti vidutinę metų oro temperatūrą?", ["Sudėti 12 mėnesių vidutines temperatūras ir padalinti iš 12", "Sudėti 12 mėnesių temperatūras ir daugiau nieko nedaryti", "Paimti šilčiausio mėnesio temperatūrą", "Šilčiausio ir šalčiausio mėnesių temperatūras sudėti ir padalinti iš 2"], 0,
      "Vidutinė metų temperatūra – tai 12 mėnesių vidutinių temperatūrų vidurkis: sumą dalijame iš 12. (Šilčiausio ir šalčiausio mėnesių vidurkis duotų tik apytikslį skaičių.)"],
    ["Kaip apskaičiuoti metų kritulių kiekį?", ["Sudėti visų 12 mėnesių kritulių kiekius", "Rasti vidutinį mėnesio kiekį ir nieko daugiau", "Paimti šlapiausią mėnesį", "Atimti sausiausią mėnesį iš šlapiausio"], 0,
      "Metų kritulių kiekis – tai visų 12 mėnesių kritulių suma (milimetrais)."],
    ["Kur matuojama temperatūra ir krituliai?", ["Meteorologijos stotyse", "Tik kalnuose", "Tik jūroje", "Tik oro uostuose"], 0,
      "Meteorologijos stotys visame pasaulyje matuoja temperatūrą, kritulius, vėją ir kitus rodiklius. Iš daugelio metų matavimų sudaromos klimatogramos."]
  ],
  beltConcept: [
    ["Kuo arčiau pusiaujo, tuo vidutinė metų temperatūra paprastai…", ["didesnė", "mažesnė", "tokia pati", "niekada nesikeičia"], 0,
      "Prie pusiaujo Saulės spinduliai krinta stačiau, todėl šiluma pasiskirsto nevienodai: kuo toliau nuo pusiaujo (į šiaurę ar pietus), tuo vidutiniškai šalčiau."],
    ["Kuri šiluminė juosta yra aplink pusiaujį?", ["Karštoji", "Šaltoji", "Vidutinių platumų", "Tokios juostos nėra"], 0,
      "Karštoji juosta driekiasi abipus pusiaujo – tarp šiaurės ir pietų atogrąžų (apie 23,5° platumos)."],
    ["Kurioje šiluminėje juostoje yra Lietuva?", ["Vidutinių platumų", "Karštojoje", "Šaltojoje", "Visose trijose"], 0,
      "Lietuva yra apie 54–56° š. pl. – tarp atogrąžos ir poliarinio rato, vidutinių platumų juostoje."],
    ["Kur yra šaltosios juostos?", ["Aplink ašigalius (už poliarinių ratų)", "Aplink pusiaują", "Tik kalnuose", "Tik jūrų pakrantėse"], 0,
      "Šaltosios juostos driekiasi aplink Šiaurės ir Pietų ašigalius – nuo poliarinių ratų (apie 66,5° platumos) iki ašigalių."]
  ],
  learn: [
    { name: "Orai ir klimatas", level: 0, html:
      `<p>Orai kinta kiekvieną dieną ir kiekvieną sezoną – šiandien lyja, rytoj šviečia saulė. <b>Klimatas</b> – tai <b>vidutinė orų būklė per 30 metų ar ilgesnį laikotarpį</b>.</p>
       <p><b>Meteorologijos stotys</b> kasdien matuoja oro temperatūrą ir kritulius. Iš daugelio metų duomenų apskaičiuojami kiekvieno mėnesio vidurkiai, iš kurių sudaroma <b>klimatograma</b>.</p>` },
    { name: "Klimatograma: kaip skaityti", level: 0, html:
      `<div data-demo="vilnius"></div>
       <p><b>Klimatograma</b> vienu paveikslu parodo, kokia yra vidutinė oro temperatūra ir kiek iškrenta kritulių kiekvieną mėnesį.</p>
       <p><b>Raudona kreivė</b> – vidutinė mėnesio temperatūra, skalė <b>kairėje</b> (°C). <b>Mėlyni stulpeliai</b> – mėnesio krituliai, skalė <b>dešinėje</b> (mm). Apačioje – mėnesiai nuo sausio iki gruodžio.</p>
       <p>Kaip skaityti: 1) rask mėnesį apačioje; 2) temperatūrai – raudonas taškas ir skalė kairėje; 3) krituliams – stulpelio viršus ir skalė dešinėje. Šiame žaidime visos klimatogramos nubraižytos ta pačia skale, todėl jas lengva lyginti.</p>` },
    { name: "Amplitudė, vidurkis, kritulių suma", level: 1, html:
      `<p><b>Temperatūros amplitudė</b> = didžiausia vidutinė mėnesio temperatūra − mažiausia vidutinė mėnesio temperatūra. Pavyzdys: liepa +19 °C, sausis −4 °C: 19 − (−4) = <b>23 °C</b>. Kuo amplitudė didesnė, tuo labiau skiriasi vasara ir žiema.</p>
       <p><b>Vidutinė metų oro temperatūra</b>: sudėk 12 mėnesių vidutines temperatūras ir padalink iš 12. Pavyzdys: suma 87, 87 : 12 ≈ 7,3, vadinasi, apie <b>7 °C</b>.</p>
       <p><b>Metų kritulių kiekis</b>: sudėk 12 mėnesių kritulius (mm).</p>` },
    { name: "Šiluminės juostos", level: 3, html:
      `<div data-demo="belts"></div>
       <p>Žemėje yra trys <b>šiluminės juostos</b>. Kuo toliau nuo pusiaujo, tuo vidutiniškai šalčiau.</p>
       <p><b>Karštoji juosta</b> – abipus pusiaujo, tarp atogrąžų (apie 23,5° š. pl. ir 23,5° p. pl.). <b>Vidutinių platumų juostos</b> – nuo atogrąžų iki poliarinių ratų (apie 66,5°). <b>Šaltosios juostos</b> – aplink ašigalius, už poliarinių ratų.</p>
       <p>Apytikslė pastaba pagal klimatogramą: karštojoje juostoje būna šilta visus metus (kiekvieną mėnesį apie +20 °C ar daugiau); šaltojoje net šilčiausią mėnesį vėsu (iki +15 °C); vidutinių platumų juostoje metų laikai ryškūs. Tikrasis skirstymas – pagal geografinę platumą, todėl kalnuose ar prie šaltų srovių klimatas gali neatitikti „taisyklės“.</p>` },
    { name: "Kaip sudaryti klimatogramą", level: 2, html:
      `<p>1) Nubrėžk mėnesių ašį (sausis–gruodis). 2) Kairėje pažymėk temperatūros skalę (°C), dešinėje – kritulių skalę (mm). 3) Kiekvieno mėnesio temperatūrai pažymėk tašką ir sujunk taškus kreive. 4) Kiekvieno mėnesio krituliams nubrėžk stulpelį iki reikiamo aukščio.</p>
       <p>Tikrindamas pasitelk lentelę: pažiūrėk į skaičių ir pasižiūrėk, ar taškas ties ta skale. Atkreipk dėmesį į minuso ženklą – žemiau nulio taškas turi būti po nulio linija.</p>` },
    { name: "Šiaurės ir pietų pusrutulis", level: 4, html:
      `<p>Žemės pusrutuliuose metų laikai yra priešingi: kai šiaurės pusrutulyje vasara, pietų pusrutulyje – žiema. Todėl pietų pusrutulio klimatogramoje šilčiausi mėnesiai yra gruodis–vasaris, o šalčiausi – birželis–rugpjūtis.</p>
       <p>Pavyzdys: Sidnėjuje (pietų pusrutulis) šilčiausias mėnuo – sausis, Vilniuje – liepa.</p>` }
  ],
  expl: {
    warm: (m, v) => `Šilčiausias mėnuo – ${m}: vidutinė temperatūra ${v} °C. Šilčiausią mėnesį kreivė pakyla aukščiausiai.`,
    cold: (m, v) => `Šalčiausias mėnuo – ${m}: vidutinė temperatūra ${v} °C. Šalčiausią mėnesį kreivė nusileidžia žemiausiai.`,
    wet: (m, v) => `Daugiausia kritulių iškrinta ${m} mėnesį – apie ${v} mm. Tai aukščiausias mėlynas stulpelis.`,
    dry: (m, v) => `Mažiausiai kritulių iškrinta ${m} mėnesį – apie ${v} mm. Tai žemiausias mėlynas stulpelis.`,
    countT: (list, n, th, above) => `Mėnesiai, kai temperatūra ${above ? "aukštesnė" : "žemesnė"} nei ${th} °C: ${list || "nė vieno"}. Iš viso: ${n}.`,
    countP: (list, n, th) => `Mėnesiai, kai krituliai viršija ${th} mm: ${list || "nė vieno"}. Iš viso: ${n}.`,
    readT: (m, v) => `Tiksli ${m} mėnesio vidutinė temperatūra – ${v} °C. Skaitydamas grafiką, žiūrėk, kuriam skalės brūkšniui artimiausias raudonas taškas.`,
    readP: (m, v) => `Tikslus ${m} mėnesio kritulių kiekis – ${v} mm. Žiūrėk, kuriai dešinės skalės linijai artimiausias stulpelio viršus.`,
    cmpT: (m1, v1, m2, v2) => `${m1} mėnesį – ${v1} °C, ${m2} mėnesį – ${v2} °C. Aukščiau esantis kreivės taškas rodo aukštesnę temperatūrą.`,
    cmpP: (m1, v1, m2, v2) => `${m1} mėnesį – ${v1} mm, ${m2} mėnesį – ${v2} mm. Aukštesnis stulpelis rodo daugiau kritulių.`,
    season: (parts, best) => `Kritulių sumos: ${parts}. Daugiausia – ${best}.`,
    amp: (mx, mxm, mn, mnm, a) => `Šilčiausias – ${mxm} (${mx} °C), šalčiausias – ${mnm} (${mn} °C). Amplitudė = ${mx} − (${mn}) = ${a} °C.`,
    ampPos: (mx, mxm, mn, mnm, a) => `Šilčiausias – ${mxm} (${mx} °C), šalčiausias – ${mnm} (${mn} °C). Amplitudė = ${mx} − ${mn} = ${a} °C.`,
    mean: (nums, s, m) => `Suma: ${nums} = ${s}. Vidurkis = ${s} : 12 ≈ ${m}. Vadinasi, vidutinė metų temperatūra – apie ${Math.round(s / 12)} °C.`,
    sum: (nums, s) => `${nums} = ${s} mm per metus.`,
    summer: (nums, s) => `${nums} = ${s} mm.`,
    cmpAmp: (a, b, wa, wb) => `${wa}: amplitudė ${a} °C, ${wb}: amplitudė ${b} °C. Didesnė amplitudė – ${a > b ? wa : wb}.`,
    cmpMean: (a, b, wa, wb) => `${wa}: vidutinė metų temperatūra apie ${a} °C, ${wb}: apie ${b} °C. Aukštesnė – ${a > b ? wa : wb}.`,
    build: "Kiekvieno mėnesio skaičių lentelėje atitinka vienas taškas (kreivei) arba vienas stulpelis (krituliams). Skaičiuok nuo nulio linijos; neigiami skaičiai – žemiau nulio.",
    buildFail: "Raudoni taškai ar stulpeliai – ne toje vietoje, žali brūkšniai rodo, kur turėjo būti.",
    beltClimo: (name, mn, mx, belt) => `${name}: šalčiausias mėnuo ${mn} °C, šilčiausias ${mx} °C. ${belt}`,
    beltClimoHot: "Visus metus šilta (kiekvieną mėnesį apie +20 °C ar daugiau) – tai karštoji juosta.",
    beltClimoCold: "Net šilčiausią mėnesį vėsu (iki +15 °C) – tai šaltoji juosta.",
    beltClimoMid: "Yra ir šiltų, ir šaltų mėnesių, metų laikai ryškūs – tai vidutinių platumų juosta.",
    beltLat: (name, lat, belt) => `${name} yra ${lat} ${belt}`,
    beltLatHot: "Karštoji juosta – tarp atogrąžų (iki apie 23,5° platumos).",
    beltLatMid: "Vidutinių platumų juosta – nuo apie 23,5° iki 66,5° platumos.",
    beltLatCold: "Šaltoji juosta – už poliarinių ratų (nuo apie 66,5° platumos iki ašigalio).",
    beltPick: (belt) => `Rasta: ${belt.toLowerCase()}. Pagal klimatogramą: karštojoje – visus metus šilta, šaltojoje – visus metus vėsu, vidutinių platumų – ryškūs metų laikai.`,
    beltOdd: (list, odd) => `${list}. Kitoje juostoje – ${odd}.`,
    detect: (rows) => rows,
    south: "Pietų pusrutulyje metų laikai priešingi: šilčiausias mėnuo čia gruodis–vasaris. Taip atpažįstama pietų pusrutulio stotis.",
    north: "Šiaurės pusrutulyje šilčiausias mėnuo – birželis–rugpjūtis (liepa), o pietų pusrutulyje – gruodis–vasaris."
  },
  hints: {
    month: "Paieškok aukščiausio taško ar stulpelio ir žiūrėk, kuriam mėnesiui jis priklauso.",
    countT: "Skaičiuok kreivės taškus, esančius virš (arba po) brūkšnine linija.",
    countP: "Skaičiuok stulpelius, kurie yra aukščiau už brūkšninę liniją.",
    read: "Pažiūrėk į gretimas skalės linijas ir rask artimiausią.",
    cmp: "Palygink dviejų mėnesių taškus ar stulpelius: kuris aukščiau?",
    season: "Sudėk tris to metų laiko mėnesių stulpelius – kurios trejetos suma didžiausia?",
    amp: "Rask šilčiausio ir šalčiausio mėnesių skaičius ir atimk mažesnįjį iš didesniojo. Atsargiai su minusu.",
    mean: "Sudėk 12 skaičių ir padalink iš 12. Pasirink artimiausią atsakymą.",
    sum: "Sudėk visų 12 mėnesių skaičius.",
    cmpS: "Apskaičiuok abiem stotims ir palygink.",
    beltClimo: "Pažiūrėk: ar visus metus šilta? Ar visus metus vėsu? Ar yra ryškūs metų laikai?",
    beltLat: "Atogrąžos – apie 23,5°, poliariniai ratai – apie 66,5° platumos.",
    beltPick: "Kuri klimatograma atitinka šią juostą: visus metus šilta, visus metus vėsu ar ryškūs metų laikai?",
    detect: "Pagalvok, ką rodo klimatograma, ir palygink visas tris."
  }
};
