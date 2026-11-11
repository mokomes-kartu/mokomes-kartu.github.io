/* Švarus miestas – visi mokiniui rodomi tekstai (lietuvių k.). Verčiant keisti tik šį failą. */
(function(){
"use strict";
const many = (n, one, few, lots) => { const d = n % 10, h = n % 100; return d === 1 && h !== 11 ? one : d >= 2 && (h < 10 || h >= 20) ? few : lots; };
const augalai = n => `${n} ${many(n, "augalas", "augalai", "augalų")}`;
const daiktai = n => `${n} ${many(n, "daiktą", "daiktus", "daiktų")}`;
const taskai = n => `${n} ${many(n, "taškas", "taškai", "taškų")}`;
window.MK_T = {
  title: "Švarus miestas",
  heroA: "Švarus", heroB: "miestas",
  hero: "Gaudyk krentančius daiktus ir mesk juos į tinkamą konteinerį. Kuo geriau rūšiuoji, tuo žalesnis parkas!",
  heroLabel: n => `Miesto kiemas su parku. Parke auga ${augalai(n)}.`,
  levels: [
    ["Popierius ir stiklas", "Mėlynas ir žalias konteineriai"],
    ["Plastikas ir metalas", "Prisideda geltonas konteineris"],
    ["Maisto atliekos", "Prisideda rudas konteineris"],
    ["Tikras rūšiuotojas", "Taromatas ir mišrios atliekos"]
  ],
  record: n => `Rekordas: ${n}`,
  bins: {
    popierius: "Popierius", stiklas: "Stiklas", plastikas: "Plastikas ir metalas",
    maistas: "Maisto atliekos", taromatas: "Taromatas", misrios: "Mišrios atliekos"
  },
  /* Paaiškinimas suklydus: kur daiktą mesti ir kodėl (pagal konteinerį). */
  why: {
    popierius: n => `<b>${n}</b> – popierius. Jis keliauja į mėlyną konteinerį ir virsta nauju popieriumi.`,
    stiklas: n => `<b>${n}</b> – stiklas. Jis keliauja į žalią konteinerį ir išlydomas iš naujo.`,
    plastikas: n => `<b>${n}</b> – plastiko arba metalo pakuotė. Ji keliauja į geltoną konteinerį.`,
    maistas: n => `<b>${n}</b> – maisto likučiai. Jie keliauja į rudą konteinerį ir virsta kompostu.`,
    taromatas: n => `<b>${n}</b> turi užstato ženklą. Tokią pakuotę nešame į taromatą.`,
    misrios: n => `<b>${n}</b> neperdirbama, todėl keliauja į mišrių atliekų konteinerį.`
  },
  /* Daiktai: [pavadinimas, atskiras paaiškinimas (jei reikia)] */
  items: {
    laikrastis: ["Laikraštis"], deze: ["Kartoninė dėžė"], sasiuvinis: ["Sąsiuvinis"], vokas: ["Vokas"], popmaiselis: ["Popierinis maišelis"],
    stiklainis: ["Stiklainis"], aliejus: ["Aliejaus buteliukas"], kvepalai: ["Kvepalų buteliukas"],
    sampunas: ["Šampūno buteliukas"], jogurtas: ["Jogurto indelis"], maiselis: ["Plastikinis maišelis"], konservai: ["Konservų skardinė"], folija: ["Folija"],
    grauztukas: ["Obuolio graužtukas"], zieve: ["Banano žievė"], lukstai: ["Kiaušinio lukštai"], arbata: ["Arbatos pakelis"],
    butelis: ["Gėrimo butelis"], skardine: ["Gėrimo skardinė"],
    servetele: ["Naudota servetėlė", "<b>Naudota servetėlė</b> yra nešvari, todėl neperdirbama. Ji keliauja į mišrių atliekų konteinerį."],
    puodelis: ["Sudužęs puodelis", "<b>Sudužęs puodelis</b> yra iš keramikos, ne iš stiklo. Jis keliauja į mišrių atliekų konteinerį."],
    sepetelis: ["Senas dantų šepetėlis", "<b>Senas dantų šepetėlis</b> pagamintas iš kelių medžiagų, todėl neperdirbamas. Jis keliauja į mišrių atliekų konteinerį."]
  },
  start: "Daiktai jau krenta! Spausk konteinerį, į kurį reikia mesti.",
  wrong: "Ne ten!",
  missed: "Nespėjai!",
  combo2: "Serija! Dabar taškai dvigubi.",
  combo3: "Puiki serija! Taškai trigubi.",
  plant: "Parke išaugo naujas augalas!",
  comboChip: m => `×${m}`,
  comboLabel: m => `Serija: taškai dauginami iš ${m}`,
  go: "Toliau",
  pts: "Taškai",
  cnt: (i, n) => `${i} / ${n}`,
  livesLabel: n => `Liko lapelių: ${n}`,
  keys: "Kompiuteryje konteinerį galima pasirinkti ir skaičių klavišais.",
  goalEmpty: "Parkas dar tuščias. Teisingai surūšiuok 5 daiktus – ir išaugs pirmas augalas!",
  goal: (n, t, k) => `Parke auga ${augalai(n)} iš ${t}. Dar ${daiktai(k)} – ir išaugs naujas!`,
  goalAll: "Parkas visiškai sužaliavo. Tu tikras rūšiuotojas!",
  resOk: (ok, n) => `Teisingai surūšiavai: ${ok} iš ${n}.`,
  resOut: (ok, n) => `Lapeliai baigėsi. Teisingai surūšiavai: ${ok} iš ${n}.`,
  resPts: p => `Surinkai: ${taskai(p)}.`,
  resNew: "Naujas rekordas!",
  resBest: p => `Tavo rekordas: ${p}.`
};
})();
