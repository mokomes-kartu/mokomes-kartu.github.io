/* Skaičių bėgikas – visi mokiniui rodomi tekstai (lietuvių k.). Verčiant keisti tik šį failą. */
(function(){
"use strict";
const many = (n, one, few, lots) => { const d = n % 10, h = n % 100; return d === 1 && h !== 11 ? one : d >= 2 && (h < 10 || h >= 20) ? few : lots; };
const monetas = n => `${n} ${many(n, "monetą", "monetas", "monetų")}`;
const monetu = n => `${n} ${many(n, "monetos", "monetų", "monetų")}`;
window.MK_T = {
  title: "Skaičių bėgikas",
  heroA: "Skaičių", heroB: "bėgikas",
  hero: "Rask, koks skaičius bus toliau, ir bėk pro tuos vartus! Bėgikė visada palauks, kol pagalvosi.",
  levels: [
    ["Po 2, po 5, po 10", "Skaičiai iki 100"],
    ["Dešimtimis ir šimtais", "Skaičiai iki 1000"],
    ["Atgal!", "Skaičiai mažėja"],
    ["Rask taisyklę", "Kokia taisyklė? Ko trūksta?"],
    ["Lyginiai ir nelyginiai", "Bėk pro tinkamą skaičių"]
  ],
  wardrobe: "Bėgikės spinta",
  wardrobeP: total => `Surinkai ${monetas(total)}. Už monetas atsirakina nauja apranga – paspausk ją ir apsirenk.`,
  locked: n => `Reikia ${monetu(n)}`,
  outfits: ["Oranžinė", "Mėlyna", "Žalia", "Violetinė", "Raudona", "Auksinė"],
  howH: "Kaip žaisti?",
  how: [
    "Viršuje – skaičių seka. Pagalvok, koks skaičius bus toliau.",
    "Paspausk skaičių apačioje arba brauk pirštu į kairę ir dešinę.",
    "Neskubėk: prie vartų bėgikė sustoja ir laukia tavęs.",
    "Pataikius iš pirmo karto – 3 monetos, greitai – dar 1."
  ],
  keys: "Kompiuteryje: rodyklės ← → ir tarpas arba klavišai 1, 2, 3.",
  go: "Bėgam!",
  next: "Kas toliau?",
  ruleQ: "Kokia taisyklė?",
  missQ: "Ko trūksta?",
  even: "Bėk pro LYGINĮ skaičių",
  odd: "Bėk pro NELYGINĮ skaičių",
  evenW: "lyginis", oddW: "nelyginis",
  coins: "Monetos",
  start: "Pažiūrėk į seką viršuje. Kai pasiruoši, spausk „Bėgam!“",
  think: "Galvok ramiai – kai pasirinksi, bėgsime toliau.",
  wait: "Aš palauksiu! Pasirink vieną skaičių.",
  fast: "Greitai! +1 moneta",
  good: ["Puiku!", "Teisingai!", "Šaunu!", "Valio!", "Kaip gerai!"],
  again: "Pabandyk dar kartą.",
  /* Užuominos suklydus (atsakymo nesako) */
  hintUp: (s, last) => `Kiekvienas kitas skaičius ${s} didesnis. Kiek bus ${last} + ${s}?`,
  hintDown: (s, last) => `Kiekvienas kitas skaičius ${s} mažesnis. Kiek bus ${last} − ${s}?`,
  hintDbl: last => `Kiekvienas kitas skaičius – dvigubai didesnis. Kiek bus ${last} + ${last}?`,
  hintRule: (a, b) => `Pažiūrėk į du skaičius iš eilės: ${a} ir ${b}. Kiek reikia pridėti arba atimti?`,
  hintMiss: (a, b) => `Pažiūrėk į kaimynus ${a} ir ${b}. Kokia taisyklė? Tada rasi trūkstamą.`,
  hintEven: "Lyginis skaičius dalijasi iš 2. Pažiūrėk į paskutinį skaitmenį: 0, 2, 4, 6 ar 8 – lyginis.",
  hintOdd: "Nelyginis skaičius nesidalija iš 2. Pažiūrėk į paskutinį skaitmenį: 1, 3, 5, 7 ar 9 – nelyginis.",
  /* Paaiškinimas po teisingo atsakymo */
  okUp: (last, s, a) => `${last} + ${s} = ${a}`,
  okDown: (last, s, a) => `${last} − ${s} = ${a}`,
  okDbl: (last, a) => `${last} + ${last} = ${a}`,
  okEven: n => `${n} – lyginis: dalijasi iš 2.`,
  okOdd: n => `${n} – nelyginis: nesidalija iš 2.`,
  ruleUp: s => `+${s}`, ruleDown: s => `−${s}`, ruleDbl: "dvigubai",
  resText: (ok, n, c) => `Iš pirmo karto: ${ok} iš ${n}. Surinkai ${monetas(c)}.`,
  unlocked: name => `Atsirakino nauja apranga: ${name}!`,
  ariaRunner: "Bėgikė",
  ariaLane: (i, v) => `${i} takelis: ${v}`
};
})();
