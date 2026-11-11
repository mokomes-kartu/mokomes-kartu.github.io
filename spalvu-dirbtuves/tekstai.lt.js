/* „Spalvų dirbtuvės“ – visi mokiniui rodomi tekstai (lietuvių k.).
   Verčiant į kitą kalbą užtenka nukopijuoti šį failą ir pakeisti tekstus; žaidimo kodo keisti nereikia. */
(function(){
"use strict";
const many = (n, one, few, lots) => { const d = n % 10, h = n % 100; return d === 1 && h !== 11 ? one : d >= 2 && (h < 10 || h >= 20) ? few : lots; };
const works = n => `${n} ${many(n, "darbas", "darbai", "darbų")}`;
const join = a => a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " ir " + a[a.length - 1];

window.MK_T = {
  title: "Spalvų dirbtuvės",
  h1: "Spalvų <em>dirbtuvės</em>",
  hero: "Padėk dailininkui sumaišyti dažus ir nutapyk visus galerijos darbus!",
  levels: {
    maisymas: ["Maišyk spalvas", "Dvi spalvos virsta trečia"],
    siltos: ["Šilta ar šalta?", "Saulės ir sniego spalvos"],
    tonai: ["Šviesiau ar tamsiau", "Balti ir juodi dažai"],
    paveikslas: ["Užbaik paveikslą", "Didysis dailininko darbas"]
  },

  /* dažų pavadinimai (tūbelės ir sumaišytos spalvos) */
  color: { R: "raudona", Y: "geltona", B: "mėlyna", RY: "oranžinė", BY: "žalia", BR: "violetinė", BRY: "ruda", C: "žydra", W: "balta", K: "juoda" },
  /* „Nudažyk lapą žalia spalva“ */
  colorWith: { RY: "oranžine spalva", BY: "žalia spalva", BR: "violetine spalva" },
  tubeLabel: name => `${name} dažai`,
  times: (n, name) => `${n} lašai: ${name}`,

  /* daiktai: [pavadinimas, ką? (galininkas)] */
  things: {
    apelsinas: ["Apelsinas", "apelsiną"], morka: ["Morka", "morką"], moliugas: ["Moliūgas", "moliūgą"], zuvele: ["Auksinė žuvelė", "auksinę žuvelę"],
    lapas: ["Lapas", "lapą"], varle: ["Varlė", "varlę"], agurkas: ["Agurkas", "agurką"],
    slyva: ["Slyva", "slyvą"], vynuoges: ["Vynuogės", "vynuoges"], baklazanas: ["Baklažanas", "baklažaną"]
  },
  /* paveikslai: pavadinimas ir sritys (ką nudažyti – galininkas) */
  pictures: {
    namelis: { name: "Namelis pievoje", parts: ["dangų", "žolę", "namelio sieną", "stogą"] },
    laivas: { name: "Laivelis jūroje", parts: ["jūrą", "laivelį", "burę", "saulę"] },
    gele: { name: "Gėlė vazoje", parts: ["vazą", "lapus", "žiedlapius", "žiedo vidurį"] }
  },

  /* 1 lygis */
  askMix: (thing, colorWith) => `Nudažyk <b>${thing}</b> ${colorWith}. Kurias dvi spalvas sumaišysi?`,
  got: name => `Išėjo ${name}. Pabandyk kitaip!`,
  mixFact: { RY: "Raudona ir geltona kartu – oranžinė.", BY: "Geltona ir mėlyna kartu – žalia.", BR: "Raudona ir mėlyna kartu – violetinė." },

  /* 2 lygis */
  askWarm: name => `<b>${name}</b> – šilta ar šalta spalva?`,
  warm: "Šilta", cold: "Šalta",
  warmFact: {
    R: "Raudona – šilta spalva, kaip ugnis.", RY: "Oranžinė – šilta spalva, kaip laužo liepsna.", Y: "Geltona – šilta spalva, kaip saulė.",
    B: "Mėlyna – šalta spalva, kaip gilus vanduo.", C: "Žydra – šalta spalva, kaip ledas.", BR: "Violetinė – šalta spalva, kaip vakaro šešėliai."
  },

  /* 3 lygis */
  askTone: "Padaryk tokią pat spalvą kaip pavyzdyje. Lašink baltus arba juodus dažus!",
  sample: "Pavyzdys", mine: "Tavo spalva",
  lighter: "Balti dažai spalvą šviesina.", darker: "Juodi dažai spalvą tamsina.",
  tooLight: "Per šviesu. Pabandyk dar kartą!", tooDark: "Per tamsu. Pabandyk dar kartą!",
  needMore: "Dar ne tokia. Pabandyk dar kartą!",

  /* 4 lygis */
  askPic: part => `Nudažyk <b>${part}</b>. Sumaišyk tokią spalvą, apie kokią galvoja dailininkas!`,
  wrongPic: "Ne visai ta spalva. Pabandyk dar kartą!",
  picDone: name => `Paveikslas „${name}“ baigtas!`,

  /* bendri */
  again: "Pabandyk dar kartą!",
  look: "Žiūrėk:",
  recipe: parts => `Reikia: ${join(parts)}.`,
  empty: "Pirma įlašink dažų į paletę!",
  newInGallery: "<b>Naujas darbas galerijoje!</b>",
  reset: "Iš naujo", check: "Tikrinti", paint: "Dažyti",
  paletteLabel: "Paletė",
  done: "Dirbtuvės šiandien užsidaro. Puikiai padirbėta!",
  result: (n, t) => `Iš pirmo karto pavyko: ${n} iš ${t}.`,
  resNew: n => `Į galeriją pateko ${n} ${many(n, "naujas darbas", "nauji darbai", "naujų darbų")}.`,
  resGallery: (n, t) => `Galerijoje jau ${n} iš ${t}.`,
  goalEmpty: "Galerija dar tuščia. Nudažyk daiktą iš pirmo karto – ir jis atsiras galerijoje!",
  goal: (n, t) => `Galerijoje ${works(n)} iš ${t}.`,
  goalAll: "Galerija pilna. Tu tikras dailininkas!",
  openGallery: "Atversti galeriją",
  gallery: "Mano galerija",
  cardThing: (color, parts) => `${color[0].toUpperCase() + color.slice(1)} spalva: ${join(parts)}.`,
  cardPic: "Tavo nutapytas paveikslas.",
  back: "Grįžti", ok: "Gerai",
  of: t => `iš ${t}`,
  dabsLabel: (n, t) => `Atlikta užduočių: ${n} iš ${t}`,
  heroLabel: n => `Dailininkas prie molberto. Galerijoje ${works(n)}.`
};
})();
