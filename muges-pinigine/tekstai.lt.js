/* Mugės piniginė – visi mokiniui rodomi tekstai (lietuvių k.). Verčiant keisti tik šį failą.
   Terminai – pagal Matematikos bendrąją programą (2 kl., „Finansiniai skaičiavimai“): „tą pačią pinigų sumą išreikšti
   įvairiais banknotų, monetų, banknotų ir monetų deriniais“, „kurią euro dalį sudaro 50 ct“, „pabrangimas, atpigimas,
   nuolaida“, „kainos užrašomos eurais ir centais“. Žymėjimas „Eur“ ir „ct“ – kaip programoje. */
(function(){
"use strict";
/* suma centais → „3 Eur 70 ct“ */
const fmt = c => { const e = Math.floor(c / 100), k = c % 100; return e && k ? `${e} Eur ${k} ct` : e ? `${e} Eur` : `${k} ct`; };
const pl = (n, a) => a[(n % 10 === 1 && n % 100 !== 11) ? 0 : (n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20)) ? 1 : 2];
const pin = n => n + " " + pl(n, ["pinigu", "pinigais", "pinigų"]);
const b = s => `<b>${s}</b>`;

window.MK_T = {
  fmt,
  title: "Mugės piniginė",
  heroA: "Mugės", heroB: "piniginė",
  hero: "Mugėje tiek gėrybių! Suskaičiuok monetas ir banknotus, sumokėk tiksliai ir prisipirk pilną krepšelį.",
  heroAria: "Vaikas su pinigine prie mugės prekystalio",
  levels: [
    ["Sumokėk tiksliai", "Monetos ir banknotai"],
    ["Tiek pat, bet kitaip", "Ta pati suma kitais pinigais"],
    ["Pabrango ar atpigo?", "Nauja kaina ir nuolaida"],
    ["Du pirkiniai", "Kiek kainuoja abu kartu?"],
    ["Grąža", "Kiek pinigų gausi atgal?"],
    ["Didysis apsipirkimas", "Visko po truputį · 10 užduočių"]
  ],
  colH: "Mano pirkiniai",
  colP: (n, all) => n >= all ? `Nupirkai visas ${all} mugės gėrybes. Tu – tikras pirkėjas!` : `Nupirkta: ${n} iš ${all}. Išspręsk užduotį – ir pirkinys atsiras čia.`,
  basket: "Krepšelyje",
  /* prekės: [id, kas?, ką?, mažiausia kaina ct, didžiausia kaina ct] */
  goods: [
    ["obuolys", "Obuolys", "obuolį", 30, 90], ["morka", "Morka", "morką", 20, 80], ["riestainis", "Riestainis", "riestainį", 40, 95],
    ["saldainis", "Saldainis", "saldainį", 10, 60], ["piestukas", "Pieštukas", "pieštuką", 30, 95], ["balionas", "Balionas", "balioną", 50, 150],
    ["svilpukas", "Švilpukas", "švilpuką", 80, 240], ["pienas", "Pienas", "pieną", 90, 190], ["ledai", "Ledai", "ledus", 110, 250],
    ["duona", "Duona", "duoną", 120, 280], ["gele", "Gėlė", "gėlę", 100, 350], ["kojines", "Kojinės", "kojines", 200, 450],
    ["suris", "Sūris", "sūrį", 250, 480], ["puodelis", "Puodelis", "puodelį", 250, 600], ["masinele", "Mašinėlė", "mašinėlę", 250, 700],
    ["pyragas", "Pyragas", "pyragą", 300, 650], ["laivelis", "Laivelis", "laivelį", 300, 800], ["kamuolys", "Kamuolys", "kamuolį", 350, 800],
    ["medus", "Medus", "medų", 400, 750], ["knyga", "Knyga", "knygą", 400, 950], ["kepure", "Kepurė", "kepurę", 450, 1100],
    ["aitvaras", "Aitvaras", "aitvarą", 500, 1200], ["meskiukas", "Meškiukas", "meškiuką", 600, 1450], ["bugnelis", "Būgnelis", "būgnelį", 800, 1800]
  ],
  trayH: "Ant prekystalio",
  trayEmpty: "Paliesk pinigą – jis atsidurs čia.",
  walletH: "Tavo piniginė",
  tillH: "Pinigai",
  sum: s => `Padėta: ${b(s)}`,
  sumHidden: "Kiek padėjai? Suskaičiuok pats!",
  cnt: n => `Pinigų: ${b(n)}`,
  pay: "Mokėti", check: "Tikrinti", next: "Toliau", finish: "Baigti",
  tagOld: "buvo", paidL: "Duodi",
  q: {
    pay: (g, p) => `${g} kainuoja ${b(p)}. Sumokėk tiksliai!`,
    count: (s, n, min) => min ? `Čia – ${b(s)}. Sudėk tiek pat kuo mažiau pinigų: tik ${b(pin(n))}.` : `Čia – ${b(s)}. Sudėk tiek pat kitaip: lygiai ${b(pin(n))}.`,
    half: "Kurią euro dalį sudaro 50 ct?",
    halfO: ["Pusę euro", "Visą eurą", "Du eurus"],
    coins: c => `Kiek monetų po ${b(c + " ct")} sudaro 1 Eur?`,
    cmp: "Kurioje piniginėje daugiau pinigų?",
    cmpO: ["Kairėje", "Dešinėje", "Po lygiai"],
    cmpL: "Kairė", cmpR: "Dešinė",
    up: (g, p, d) => `${g} kainavo ${b(p)}. Šiandien pabrango ${b(d)}. Sumokėk naują kainą!`,
    down: (g, p, d) => `${g} kainavo ${b(p)}. Šiandien atpigo ${b(d)}. Sumokėk naują kainą!`,
    disc: (g, p, d) => `${g} kainuoja ${b(p)}. Tau – nuolaida ${b(d)}. Sumokėk kainą su nuolaida!`,
    two: (a, pa, c, pc) => `Perki ${a} (${b(pa)}) ir ${c} (${b(pc)}). Sumokėk už abu pirkinius!`,
    three: (a, pa, c, pc, d, pd) => `Perki ${a} (${b(pa)}), ${c} (${b(pc)}) ir ${d} (${b(pd)}). Sumokėk už viską!`,
    change: (g, p, paid) => `${g} kainuoja ${b(p)}. Duodi ${b(paid)}. Sudėk grąžą, kurią turi gauti!`
  },
  low: "Per mažai. Pridėk pinigų!",
  high: "Per daug. Nuimk kelis pinigus!",
  lowBy: d => `Dar trūksta ${b(d)}.`,
  highBy: d => `Padėjai ${b(d)} per daug.`,
  cntBad: (n) => `Suma teisinga! Bet pinigų turi būti lygiai ${b(n)}.`,
  calc: e => `Pirma apskaičiuok: ${b(e)}.`,
  empty: "Pirma padėk pinigų ant prekystalio.",
  okPay: ["Ačiū, gero pirkinio!", "Kaip tik tiek! Ačiū!", "Tiksliai! Prašom.", "Puikiai suskaičiuota!"],
  okChange: "Teisingai – tokia ir grąža!",
  okSame: "Teisingai – ta pati suma kitais pinigais!",
  show: "Pažiūrėk, kaip galima:",
  eq: (l, r) => `${l} = ${b(r)}`,
  whyHalf: "1 Eur = 100 ct. 50 ct + 50 ct = 100 ct, todėl 50 ct – pusė euro.",
  whyCoins: (c, n) => `1 Eur = 100 ct. ${n} monetos po ${c} ct – tai ${Array(n > 5 ? 0 : n).fill(c).join(" + ") || (n + " kartų po " + c)} = 100 ct.`,
  whyCoinsN: (c, n) => `1 Eur = 100 ct. Reikia ${n} monetų po ${c} ct: suskaičiuok po ${c} iki 100.`,
  whyCmp: (l, r) => `Kairėje – ${b(l)}, dešinėje – ${b(r)}. Svarbu ne kiek pinigų, o kokia jų vertė.`,
  bad: "Ne visai.",
  res: (ok, total, got) => `Iš pirmo karto: ${ok} iš ${total}.` + (got ? ` Nauji pirkiniai: ${got}.` : ""),
  aria: { coin: v => `${v} moneta`, note: v => `${v} banknotas`, remove: "nuimti", scene: "Mugės prekystalis" }
};
})();
