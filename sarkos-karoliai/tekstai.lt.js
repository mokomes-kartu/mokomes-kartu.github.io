/* Šarkos karoliai – visi mokiniui rodomi tekstai (lietuvių k.). Verčiant keisti tik šį failą.
   Terminai – pagal Matematikos bendrąją programą (1 klasė, „Modeliai ir sąryšiai. Dėsningumai“):
   „Tyrinėjamos objektų sekos iš 2–3 pasikartojančių narių grupių (pvz.: ABAB..; AABAAB...) – mokomasi jas atpažinti ir
   apibūdinti, pratęsti, rasti trūkstamus narius, sudaryti seką pagal nurodytą taisyklę, sukurti savo.“
   Žaidime: seka – vėrinys, narys – karoliukas, „grupė“ ir „taisyklė“ – kaip programoje. */
(function(){
"use strict";
window.MK_T = {
  title: "Šarkos karoliai",
  heroA: "Šarkos", heroB: "karoliai",
  hero: "Šarka Karolina veria karolius. Surask, kas kartojasi, ir padėk jai suverti gražiausius vėrinius!",
  heroAria: "Šarka tupi ant šakos, po šaka kabo karolių vėrinys",
  sceneAria: "Vėrinys kabo ant šakos",

  levels: [
    ["Pratęsk vėrinį", "Kokie karoliukai toliau?"],
    ["Kurio trūksta?", "Surask pamestą karoliuką"],
    ["Kas kartojasi?", "Surask grupę ir taisyklę"],
    ["Pagal taisyklę", "Suverk, kaip nurodyta"],
    ["Sukurk savo", "Sugalvok savo taisyklę"]
  ],

  /* užduočių klausimai (pelėdžiuko burbule) */
  q: {
    ext: "Pratęsk vėrinį. Kuris karoliukas toliau?",
    gap1: "Vieno karoliuko trūksta. Kurio?",
    gap2: "Trūksta dviejų karoliukų. Kurių?",
    unit: "Kuri karoliukų grupė kartojasi?",
    pick: "Kuris vėrinys suvertas pagal šią taisyklę?",
    rule: "Suverk vėrinį pagal taisyklę.",
    make2: "Sukurk vėrinį. Grupėje – 2 karoliukai.",
    make3: "Sukurk vėrinį. Grupėje – 3 karoliukai.",
    makeAll3: "Sukurk vėrinį. Grupėje – 3 skirtingi karoliukai.",
    makeFree: "Sukurk vėrinį, kokį nori. Tik kad grupė kartotųsi!"
  },
  ruleLabel: "Taisyklė",
  ruleRepeat: "ir vėl iš pradžių",
  and: "ir",
  trayLabel: "Karoliukai",
  optUnit: "Grupės",
  optPick: "Vėriniai",

  /* užuominos suklydus (atsakymo nepasako) */
  hint1: "Dar ne. Pažiūrėk: grupės nuspalvintos.",
  hint2: "Žiūrėk į apibrauktą karoliuką. Čia reikia tokio pat!",
  choiceBad: "Dar ne. Pabandyk kitą.",
  pickBad: "Dar ne. Pirštu eik per vėrinį ir sakyk taisyklę.",

  /* užduotis baigta */
  repeats: "Kartojasi:",
  fixed: "Dabar teisingai! Kartojasi:",
  shown: "Štai teisingas atsakymas. Kartojasi:",
  makeOk: "Kaip gražu! Tavo grupė:",

  /* „Sukurk savo“ – kodėl dar negerai */
  makeAll: "Panaudok visus padėklo karoliukus.",
  makeSame: "Grupėje turi būti skirtingų karoliukų.",
  makeBad: p => `Pirmi ${p} karoliukai – tavo grupė. Apibrauktas karoliukas jos nepakartoja.`,
  makeFreeBad: "Dar nesikartoja. Pirmi 2 arba 3 karoliukai turi kartotis.",
  makeFill: "Suverk visus karoliukus ir spausk „Tikrinti“.",

  next: "Toliau",
  finish: "Baigti",
  check: "Tikrinti",
  undo: "Nuimti",
  listen: "Paklausyk",
  chip: "Lobis",

  /* kolekcija */
  lobisH: "Šarkos lobis",
  lobisP: (n, left) => left > 0
    ? `Vėrinių be klaidų: ${n}. Iki naujo karoliuko – dar ${left}.`
    : `Vėrinių be klaidų: ${n}. Visi karoliukai jau tavo!`,
  lobisLock: n => `nuo ${n}`,
  galH: "Mano vėriniai",
  galEmpty: "Čia kabės vėriniai, kuriuos sukursi lygyje „Sukurk savo“.",

  res: (ok, total, fresh) => `Be klaidų: ${ok} iš ${total}.` + (fresh ? ` Naujas karoliukas lobyje – ${fresh}!` : ""),

  /* karoliukų pavadinimai (ekrano skaitytuvams): [pavadinimas, giminė: 0 – vyr., 1 – mot.] */
  shapes: {
    ci: ["rutuliukas", 0], sq: ["kubelis", 0], tr: ["trikampis", 0], he: ["širdelė", 1], st: ["žvaigždutė", 1],
    fl: ["gėlytė", 1], dr: ["lašelis", 0], mo: ["mėnulis", 0], di: ["deimantas", 0]
  },
  colors: { r: ["raudonas", "raudona"], y: ["geltonas", "geltona"], b: ["mėlynas", "mėlyna"], g: ["žalias", "žalia"], v: ["violetinis", "violetinė"] },
  small: ["mažas", "maža"],
  blank: "tuščia vieta",
  locked: "dar neatrakinta"
};
})();
