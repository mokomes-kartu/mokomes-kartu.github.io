/* Genetikos konsultacija – visi mokiniui rodomi tekstai (lietuvių k.). Verčiant užtenka išversti šį failą.
   Terminai – pagal Biologijos bendrąją programą (III gimnazijos klasė, „Paveldimumas ir kintamumas“): alelis, genotipas, fenotipas,
   homozigota, heterozigota, hemizigota, dominuojantis ir recesyvinis alelis, su lytimi sukibęs paveldėjimas, dihibridinis kryžminimas,
   analizuojamasis kryžminimas, kodominavimas, nepilnas dominavimas, sukibę genai, genealoginis medis. */
(function(){
"use strict";
const GT = { AA: "AA", Aa: "Aa", aa: "aa", "A?": "AA arba Aa", XAXA: "XᴬXᴬ", XAXa: "XᴬXᵃ", XaXa: "XᵃXᵃ", "XA?": "XᴬXᴬ arba XᴬXᵃ", XAY: "XᴬY", XaY: "XᵃY" };
const fr = a => a.d === 1 ? String(a.n) : a.n + "/" + a.d;
const cls = { "A_": "A_", aa: "aa", "B_": "B_", bb: "bb", "C_": "C_", cc: "cc" };
const ph2 = tg => `${tg[0] === "A_" ? "geltonų" : "žalių"} ${tg[1] === "B_" ? "glotnių" : "raukšlėtų"}`;
const col = { RR: "raudonais", Rr: "rožiniais", rr: "baltais" }, hgt = { "T_": "aukšti", tt: "žemi" };
const abo = g => ({ AO: "Iᴬi", BO: "Iᴮi", AB: "IᴬIᴮ", OO: "ii", AA: "IᴬIᴬ", BB: "IᴮIᴮ" })[g];

window.MK_T = {
  GT, fr,
  title: "Genetikos konsultacija",
  kicker: "Genetikos konsultacija · 11–12 klasė · biologija (VBE)",
  h1: "Genetikos konsultacija",
  lead: "Į konsultaciją ateina šeimos su genealoginiais medžiais. Ištirk medį: surask įrodymą, koks paveldėjimo tipas, nustatyk šeimos narių genotipus ir apskaičiuok riziką būsimiems vaikams. Kryžminimų stale – užduotys be Peneto gardelės: tikimybių daugyba, sukibę genai, nežinomo genotipo nustatymas iš palikuonių.",
  note: "Šeimos ir ligos išgalvotos. Visuose medžiuose galioja retų ligų uždavinių prielaida: į šeimą atėję sveiki asmenys ligos alelio neturi. Turinys – pagal Biologijos bendrąją programą, III gimnazijos klasė, „Paveldimumas ir kintamumas“. Rezultatai saugomi tik šiame įrenginyje.",
  fileT: "Konsultanto kortelė", shiftsT: "Darbo dienos", manualT: "Žinynas",
  ranks: ["Praktikantas", "Jaunesnysis konsultantas", "Konsultantas", "Vyresnysis konsultantas", "Genetikos ekspertas"],
  career: o => `Ištirta šeimų: ${o.cases} · stalo užduočių: ${o.bench} · atsakymų iš pirmo karto: ${o.ok} iš ${o.all}`,
  shifts: [
    { id: "d1", name: "Pirmoji priėmimo diena", sub: "4 šeimos: autosominis recesyvinis ir autosominis dominantinis paveldėjimas.", code: "4 medžiai" },
    { id: "d2", name: "Sudėtingi atvejai", sub: "4 šeimos: su X chromosoma sukibęs paveldėjimas, tikimybės keliems vaikams, „galbūt nešiotojas“.", code: "4 medžiai · sunkiau" },
    { id: "d3", name: "Kryžminimų stalas", sub: "6 užduotys: dihibridinis ir trihibridinis kryžminimas, kraujo grupės ir rezus, sukibę genai, analizuojamasis kryžminimas.", code: "6 užduotys" },
    { id: "d4", name: "Atestacija", sub: "2 sunkios šeimos ir 4 stalo užduotys – viskas kartu.", code: "egzaminas" }
  ],
  caseN: (i, n) => `Šeima ${i} iš ${n}`, taskN: (i, n) => `Užduotis ${i} iš ${n}`,
  caseIntro: "Šeimoje paveldima reta liga. Tamsūs simboliai – sergantys asmenys, kvadratas – vyras, apskritimas – moteris. Į šeimą atėję sveiki asmenys ligos alelio neturi.",
  step: ["1. Paveldėjimo tipas", "2. Genotipai", "3. Rizika"],
  s1q: "Koks šios ligos paveldėjimo tipas? Pasirink ir medyje paliesk asmenį, kuris tai įrodo.",
  modes: { AR: "Autosominis recesyvinis", AD: "Autosominis dominantinis", XR: "Recesyvinis, sukibęs su X chromosoma" },
  s1pick: "Paliesk įrodantį asmenį medyje", s1sel: c => `Įrodymas: ${c}`,
  s1need: "Pasirink tipą ir paliesk asmenį medyje.",
  s1ok: "Teisingai – ir tipas, ir įrodymas.",
  s1badType: "Tipas netinka. Užuomina: pirmiausia pažiūrėk, ar sergantys vaikai turi sergantį tėvą ar motiną; tada – ar serga ir moterys.",
  s1badEv: { AR: "Tipas teisingas, bet šis asmuo to neįrodo. Sergantis sūnus tiktų ir su X sukibusiam paveldėjimui – ieškok asmens, kuris tą galimybę atmeta.", AD: "Tipas teisingas, bet šis asmuo to neįrodo. Ieškok atvejo, kai liga perduota iš tėvo sūnui.", XR: "Tipas teisingas, bet šis asmuo to neįrodo. Ieškok sergančio asmens, kurio tėvas atėjo į šeimą ir yra sveikas." },
  s1why: {
    AR: c => `${c} serga, nors abu jos tėvai sveiki – požymis recesyvinis. Ji – moteris, o jos tėvas sveikas: jei alelis būtų X chromosomoje, tėvas būtų perdavęs dukrai sveiką X ir ji nesirgtų. Vadinasi, paveldėjimas autosominis recesyvinis.`,
    AD: c => `Liga pasireiškia kiekvienoje kartoje, kiekvienas sergantis turi sergantį tėvą ar motiną, o jų sutuoktiniai, atėję į šeimą, alelio neturi – požymis dominantinis. ${c} ligą paveldėjo iš tėvo: sūnus iš tėvo gauna Y chromosomą, todėl alelis negali būti X chromosomoje. Paveldėjimas autosominis dominantinis.`,
    XR: c => `${c} serga, nors abu tėvai sveiki – požymis recesyvinis. Jo tėvas atėjo į šeimą ir alelio neturi, todėl alelį sūnus galėjo gauti tik iš motinos – su X chromosoma. Serga tik vyrai (hemizigotos). Paveldėjimas recesyvinis, sukibęs su X chromosoma.`
  },
  s2q: "Nustatyk pažymėtų asmenų genotipus: paliesk asmenį, tada pasirink genotipą.",
  s2legend: { AR: "A – normalus alelis, a – ligos alelis.", AD: "A – ligos alelis (dominuojantis), a – normalus alelis.", XR: "Xᴬ – X chromosoma su normaliu aleliu, Xᵃ – su ligos aleliu." },
  s2pick: c => `Asmens ${c} genotipas:`, s2none: "Paliesk medyje asmenį su klaustuku.",
  s2need: "Pažymėk visų asmenų su klaustuku genotipus.",
  s2ok: "Visi genotipai teisingi.", s2bad: k => `Netikslu: ${k} iš pažymėtų genotipų neteisingi (raudoni). Pataisyk.`, s2show: "Teisingi genotipai ir pagrindimas:",
  why: {
    aff: "serga, o recesyvinis požymis pasireiškia tik homozigotoje",
    inlaw: "atėjo į šeimą ir yra sveikas – ligos alelio neturi",
    parAff: "sveikas, bet turi sergantį vaiką – nešiotojas",
    kidAff: "sveikas, bet vienas iš tėvų serga (aa) – iš jo tikrai gavo a",
    unk23: "sveikas, abu tėvai – nešiotojai: genotipo nustatyti negalima (nešiotojas su tikimybe 2/3)",
    unk: "sveikas; vienas iš tėvų gali būti nešiotojas, kitas alelio neturi – nustatyti negalima",
    adAff: "serga ir turi sveiką tėvą, motiną ar vaiką – heterozigota",
    adH: "sveikas – dominuojančio ligos alelio neturi", adIn: "atėjo į šeimą ir yra sveikas – ligos alelio neturi",
    xM1: "sergantis vyras – hemizigota, jo vienintelėje X chromosomoje yra ligos alelis", xM0: "sveikas vyras – jo X chromosomoje normalus alelis",
    xCarKid: "sveika, bet turi sergantį sūnų – nešiotoja", xCarFa: "sveika, bet jos tėvas serga – iš jo tikrai gavo Xᵃ",
    xUnk: "sveika, jos motina nešiotoja: gali būti ir nešiotoja, ir ne (tikimybė 1/2)"
  },
  s3q: "Apskaičiuok ir įrašyk tikimybę paprastąja arba dešimtaine trupmena (pvz., 3/8 arba 0,375).",
  ans: "Tikimybė", check: "Tikrinti", empty: "Įrašyk atsakymą.", next: "Toliau", nextCase: "Kita šeima", nextTask: "Kita užduotis", finish: "Dienos ataskaita",
  ok1: "Teisingai.", ok2: "Teisingai iš antro karto.", hintT: "Netikslu. Užuomina:", solT: "Netikslu. Sprendimas:", right: "Teisingas atsakymas:",
  /* klausimai apie medį: w – asmens (-ų) kodai */
  q: {
    A1: w => ({ q: `${w[0]} tuokiasi su sveiku žmogumi, kuris yra šios ligos nešiotojas. Kokia tikimybė, kad jų vaikas sirgs?`, h: `Pirma nustatyk ${w[0]} genotipą: vienas iš jo tėvų serga.`, s: `${w[0]} – nešiotojas (Aa), nes vienas iš tėvų serga (aa). Aa × Aa: tikimybė gauti aa = 1/2 · 1/2 = 1/4.` }),
    A2: w => ({ q: `${w[0]} tuokiasi su sveiku žmogumi, kurio tėvai sveiki, bet sesuo serga šia liga. Kokia tikimybė, kad jų vaikas sirgs?`, h: "Sveikas sergančiojo brolis ar sesuo yra nešiotojas ne su tikimybe 1/2, o 2/3 (iš AA, Aa, Aa – aa atmetame).", s: `${w[0]} – Aa (tikimybė 1). Partneris – nešiotojas su tikimybe 2/3. Vaikas aa: 1 · 2/3 · 1/4 = 1/6.` }),
    A3: w => ({ q: `${w[0]} tuokiasi su žmogumi, kuris serga šia liga. Kokia tikimybė, kad jų vaikas sirgs?`, h: `${w[0]} – nešiotojas (Aa), partneris – aa.`, s: `Aa × aa: iš ${w[0]} vaikas gauna a su tikimybe 1/2, iš partnerio – visada a. Tikimybė 1/2.` }),
    A4: w => ({ q: `${w[0]} tuokiasi su sveiku žmogumi, kuris yra šios ligos nešiotojas. Kokia tikimybė, kad jų vaikas sirgs?`, h: `${w[0]} sveikas, o abu jo tėvai nešiotojai. Kokia tikimybė, kad jis pats nešiotojas?`, s: `${w[0]} – nešiotojas su tikimybe 2/3 (sveikas Aa × Aa palikuonis). Vaikas aa: 2/3 · 1/4 = 1/6.` }),
    A5: w => ({ q: `${w[0]} tuokiasi su sveiku žmogumi, kuris yra šios ligos nešiotojas. Kokia tikimybė, kad jų vaikas sirgs?`, h: `Eik per kartas: ${w[0]} tėvas ar motina iš šios šeimos yra nešiotojas su tikimybe 2/3, o alelį vaikui perduoda su tikimybe 1/2.`, s: `Tikimybė, kad ${w[0]} nešiotojas: 2/3 · 1/2 = 1/3. Vaikas aa: 1/3 · 1/4 = 1/12.` }),
    A6: w => ({ q: `${w[0]} ir ${w[1]} laukiasi dar vieno vaiko. Kokia tikimybė, kad jis bus sveikas, bet ligos alelio nešiotojas?`, h: "Abu tėvai – Aa. Kokią dalį palikuonių sudaro Aa?", s: "Aa × Aa → 1/4 AA, 1/2 Aa, 1/4 aa. Sveikas nešiotojas (Aa): 1/2." }),
    A7: w => ({ q: `${w[0]} ir ${w[1]} planuoja dar du vaikus. Kokia tikimybė, kad abu bus sveiki?`, h: "Vieno vaiko tikimybė būti sveikam – 3/4; vaikai nepriklausomi.", s: "(3/4)² = 9/16." }),
    A8: w => ({ q: `${w[0]} ir ${w[1]} planuoja dar tris vaikus. Kokia tikimybė, kad bent vienas iš jų sirgs?`, h: "Patogiau per priešingą įvykį: visi trys sveiki.", s: "1 − (3/4)³ = 1 − 27/64 = 37/64." }),
    A9: w => ({ q: `${w[0]} ir ${w[1]} laukiasi dar vieno vaiko. Kokia tikimybė, kad tai bus serganti mergaitė?`, h: "Du nepriklausomi įvykiai: vaikas serga (aa) ir vaikas – mergaitė.", s: "1/4 · 1/2 = 1/8." }),
    A10: w => ({ q: `${w[0]} tuokiasi su sveiku žmogumi, kurio tėvai sveiki, bet brolis serga šia liga. Kokia tikimybė, kad jų vaikas sirgs?`, h: "Abu būsimi tėvai – sveiki sergančiųjų broliai ar seserys: kiekvienas nešiotojas su tikimybe 2/3.", s: "2/3 · 2/3 · 1/4 = 1/9." }),
    A11: w => ({ q: `${w[0]} susituokė su šios ligos nešiotoju. Jie planuoja du vaikus. Kokia tikimybė, kad bent vienas sirgs?`, h: `${w[0]} – Aa. Priešingas įvykis: abu vaikai sveiki.`, s: "Aa × Aa: sveikas vaikas – 3/4. 1 − (3/4)² = 7/16." }),
    D1: w => ({ q: `${w[0]} tuokiasi su sveiku žmogumi. Kokia tikimybė, kad jų vaikas sirgs?`, h: `${w[0]} serga ir turi sveiką tėvą ar motiną – koks jo genotipas?`, s: `${w[0]} – Aa, partneris – aa. Aa × aa: 1/2 Aa (serga), 1/2 aa. Tikimybė 1/2.` }),
    D2: w => ({ q: `${w[0]} ir sveikas partneris planuoja tris vaikus. Kokia tikimybė, kad bent vienas sirgs?`, h: "Aa × aa: vienas vaikas sveikas su tikimybe 1/2. Priešingas įvykis – visi trys sveiki.", s: "1 − (1/2)³ = 7/8." }),
    D3: w => ({ q: `${w[0]} tuokiasi su sveiku žmogumi. Kokia tikimybė, kad jų pirmas vaikas bus sveikas berniukas?`, h: "Du nepriklausomi įvykiai: sveikas (aa) ir berniukas.", s: "1/2 · 1/2 = 1/4." }),
    D4: w => ({ q: `${w[0]} tuokiasi su žmogumi, kuris irgi serga šia liga (vienas iš partnerio tėvų sveikas). Kokia tikimybė, kad jų vaikas sirgs?`, h: "Abu – heterozigotos (Aa). Serga visi, kas turi bent vieną A.", s: "Aa × Aa: 1/4 AA, 1/2 Aa, 1/4 aa. Serga AA ir Aa: 3/4." }),
    D5: w => ({ q: `${w[0]} tuokiasi su žmogumi, kuris irgi serga šia liga (vienas iš partnerio tėvų sveikas). Kokia tikimybė, kad jų vaikas bus homozigotinis pagal ligos alelį (AA)?`, h: "Abu tėvai – Aa.", s: "Aa × Aa: AA tikimybė 1/2 · 1/2 = 1/4." }),
    D6: w => ({ q: `${w[0]} ir sveikas partneris planuoja du vaikus. Kokia tikimybė, kad abu bus sveiki?`, h: "Aa × aa: sveikas vaikas – 1/2.", s: "(1/2)² = 1/4." }),
    D7: w => ({ q: `${w[0]} (sveikas) tuokiasi su sveiku žmogumi. Kokia tikimybė, kad jų vaikas sirgs šia liga?`, h: "Ar sveikas žmogus gali turėti dominuojantį ligos alelį?", s: `Dominuojantis alelis visada pasireiškia, todėl sveikas ${w[0]} yra aa. aa × aa: tikimybė 0.` }),
    X1: w => ({ q: `${w[0]} ir jos vyras laukiasi sūnaus. Kokia tikimybė, kad sūnus sirgs?`, h: `${w[0]} – nešiotoja (XᴬXᵃ). Sūnus X chromosomą gauna tik iš motinos.`, s: "Sūnus iš motinos gauna Xᴬ arba Xᵃ su tikimybe 1/2. Tikimybė 1/2." }),
    X2: w => ({ q: `${w[0]} ir jos vyras laukiasi vaiko, lytis dar nežinoma. Kokia tikimybė, kad vaikas sirgs?`, h: "Sirgti gali tik sūnus: reikia, kad gimtų sūnus ir kad jis gautų Xᵃ.", s: "XᴬXᵃ × XᴬY: 1/2 (sūnus) · 1/2 (gauna Xᵃ) = 1/4. Dukros neserga." }),
    X3: w => ({ q: `${w[0]} tuokiasi su sveiku vyru. Kokia tikimybė, kad jų vaikas sirgs?`, h: `${w[0]} motina – nešiotoja, tad ji pati nešiotoja su tikimybe 1/2.`, s: `${w[0]} nešiotoja su tikimybe 1/2. Tada vaikas serga su tikimybe 1/4. Iš viso: 1/2 · 1/4 = 1/8.` }),
    X4: w => ({ q: `${w[0]} tuokiasi su sveiku vyru, jų pirmas vaikas – sūnus. Kokia tikimybė, kad jis sirgs?`, h: `${w[0]} nešiotoja su tikimybe 1/2; nešiotojos sūnus serga su tikimybe 1/2.`, s: "1/2 · 1/2 = 1/4." }),
    X5: w => ({ q: `${w[0]} (serga) tuokiasi su moterimi, kuri ligos alelio neturi. Kokia tikimybė, kad jų dukra bus ligos alelio nešiotoja?`, h: "Dukra visada gauna tėvo X chromosomą.", s: `${w[0]} – XᵃY. Kiekviena dukra iš jo gauna Xᵃ, iš motinos – Xᴬ: visos dukros XᴬXᵃ. Tikimybė 1.` }),
    X6: w => ({ q: `${w[0]} tuokiasi su vyru, kuris serga šia liga. Kokia tikimybė, kad jų vaikas sirgs?`, h: `${w[0]} tėvas serga, todėl ji – nešiotoja (XᴬXᵃ). Šioje šeimoje sirgti gali ir dukros.`, s: "XᴬXᵃ × XᵃY: sūnūs – 1/2 serga; dukros – 1/2 XᵃXᵃ (serga). Iš viso 1/2." }),
    X7: w => ({ q: `${w[0]} ir jos vyras susilaukė dar dviejų sūnų. Kokia tikimybė, kad abu sveiki?`, h: "Nešiotojos sūnus sveikas su tikimybe 1/2; sūnūs nepriklausomi.", s: "(1/2)² = 1/4." }),
    X8: w => ({ q: `${w[0]} ištekėjo už sveiko vyro ir susilaukė dviejų sūnų. Kokia tikimybė, kad abu sveiki?`, h: `Du atvejai: ${w[0]} nešiotoja (1/2) arba ne (1/2). Kiekvienam atvejui suskaičiuok atskirai ir sudėk.`, s: "Jei ne nešiotoja (1/2): abu sveiki su tikimybe 1. Jei nešiotoja (1/2): (1/2)² = 1/4. Iš viso: 1/2 · 1 + 1/2 · 1/4 = 5/8." }),
    X9: w => ({ q: `${w[0]} tuokiasi su sveiku vyru. Kokia tikimybė, kad jų pirmas vaikas bus sergantis berniukas?`, h: `${w[0]} tėvas serga – ji tikrai nešiotoja.`, s: "XᴬXᵃ × XᴬY: 1/2 (berniukas) · 1/2 (gauna Xᵃ) = 1/4." })
  },
  /* kryžminimų stalas */
  benchIntro: "Kryžminimų stalas",
  grow: "Auginti palikuonis", growMore: "Auginti dar 80", grown: n => `Užauginta palikuonių: ${n}`, hit: "ieškomi", miss: "kiti", expect: (p, n) => `Pagal tikimybę ${p} tikėtina apie ${n} ieškomų.`,
  benchTry: "Atsakęs galėsi užauginti palikuonis ir palyginti su savo skaičiavimu.",
  genoPick: "Sudėk nežinomo augalo genotipą:", numAns: "Atsakymas",
  b: {
    B1: v => ({ q: `Žirnių sėklų spalva: A – geltona, a – žalia; forma: B – glotni, b – raukšlėta. Genai nesukibę. Kryžminami AaBb × AaBb. Kokia tikimybė, kad palikuonis bus ${ph2(v.tg)} sėklų (${v.tg.join(" ")})?`, h: "Nebraižyk 4×4 gardelės: kiekvieną geną skaičiuok atskirai ir tikimybes sudaugink.", s: `Aa × Aa: ${v.tg[0]} – ${v.tg[0] === "A_" ? "3/4" : "1/4"}. Bb × Bb: ${v.tg[1]} – ${v.tg[1] === "B_" ? "3/4" : "1/4"}. Sandauga – atsakymas.` }),
    B1g: v => ({ q: `Kryžminami AaBb × AaBb (genai nesukibę). Kokia tikimybė, kad palikuonio genotipas bus ${v.tg.join("")}?`, h: "Aa × Aa duoda 1/4 AA, 1/2 Aa, 1/4 aa. Tas pats kitam genui. Tikimybes sudaugink.", s: `${v.tg[0]} – ${v.tg[0] === "Aa" ? "1/2" : "1/4"}; ${v.tg[1]} – ${v.tg[1] === "Bb" ? "1/2" : "1/4"}. Sandauga – atsakymas.` }),
    B2: v => ({ q: `Žirniai: A – geltonos sėklos, a – žalios; B – glotnios, b – raukšlėtos (genai nesukibę). Kryžminami ${v.pr[0]}${v.pr[2]} × ${v.pr[1]}${v.pr[3]}. Kokia tikimybė, kad palikuonis bus ${ph2(v.tg)} sėklų (${v.tg.join(" ")})?`, h: `Skaičiuok atskirai: ${v.pr[0]} × ${v.pr[1]} ir ${v.pr[2]} × ${v.pr[3]}.`, s: `Iš ${v.pr[0]} × ${v.pr[1]} rask ${v.tg[0]} dalį, iš ${v.pr[2]} × ${v.pr[3]} – ${v.tg[1]} dalį, ir sudaugink.` }),
    B3: v => ({ q: `Trihibridinis kryžminimas: AaBbCc × AaBbCc, genai nesukibę, visi trys požymiai visiškai dominuoja. Kokia tikimybė, kad palikuonio fenotipas bus ${v.tg.join(" ")}?`, h: "Kiekvienam genui: dominuojantis fenotipas – 3/4, recesyvinis – 1/4. Sudaugink tris tikimybes.", s: v.tg.map(x => (x[1] === "_" ? "3/4" : "1/4")).join(" · ") + " – atsakymas." }),
    B4: v => ({ q: `Tėvų kraujo grupių genotipai: ${abo(v.pr[0])} ${v.pr[2]} ir ${abo(v.pr[1])} ${v.pr[3]} (D – teigiamas rezus faktorius, d – neigiamas; genai nesukibę). Kokia tikimybė, kad vaiko kraujo grupė bus ${v.grp}, o rezus faktorius ${v.rh === "D_" ? "teigiamas" : "neigiamas"}?`, h: "Atskirai rask kraujo grupės tikimybę (ABO sistema, kodominavimas) ir rezus faktoriaus tikimybę, tada sudaugink.", s: `ABO: ${abo(v.pr[0])} × ${abo(v.pr[1])} – surašyk keturis derinius ir rask ${v.grp} grupės dalį. Rezus: ${v.pr[2]} × ${v.pr[3]} – rask ${v.rh === "D_" ? "D_" : "dd"} dalį. Sandauga – atsakymas.` }),
    B5: v => ({ q: `Analizuojamasis kryžminimas: nežinomo genotipo žirnis geltonomis glotniomis sėklomis sukryžmintas su žaliu raukšlėtu (aabb). Užauginti ${v.n} palikuonys – jų fenotipai lentelėje. Koks nežinomo augalo genotipas?`, h: "Jei tarp palikuonių atsiranda recesyvinis požymis (aa arba bb), nežinomas augalas pagal tą geną heterozigotinis.", s: "Yra žalių (aa) – augalas Aa; nėra – AA. Yra raukšlėtų (bb) – augalas Bb; nėra – BB." }),
    B6: v => ({ q: `Genai A ir B yra toje pačioje chromosomoje (sukibę). Diheterozigota AB/ab sukryžminta su ab/ab. Užauginta ${v.n} palikuonių – jų fenotipai lentelėje. Apskaičiuok krosingoverio dažnį procentais (dešimtųjų tikslumu).`, h: "Rekombinantai – tie palikuonys, kurių požymių derinio neturėjo nė vienas iš tėvų: A_ bb ir aa B_.", s: `Rekombinantų: ${v.r}. Dažnis = ${v.r} : ${v.n} · 100 %.` }),
    B7: v => ({ q: `Kryžminami AaBb × AaBb (A – geltonos sėklos, a – žalios; B – glotnios, b – raukšlėtos; genai nesukibę). Užauginta ${v.n} sėklų. Kiek iš jų tikėtina ${ph2(v.tg)}?`, h: "Pirma rask šio fenotipo tikimybę (9/16, 3/16 ar 1/16), tada padaugink iš sėklų skaičiaus.", s: `Tikimybė ${fr(v.p)}. ${v.n} · ${fr(v.p)} – atsakymas.` }),
    B8: v => ({ q: `Albinizmą lemia autosominis recesyvinis alelis a, hemofiliją – recesyvinis alelis h X chromosomoje. Tėvai: Aa XᴴXʰ ir Aa XᴴY. Kokia tikimybė, kad jų vaikas bus ${({ sonBoth: "albinosas hemofilija sergantis sūnus", healthy: "sveikas pagal abu požymius (ne albinosas ir neserga hemofilija)", dauCarAlb: "albinosė dukra – hemofilijos alelio nešiotoja", hemNonAlb: "hemofilija sergantis, bet ne albinosas" })[v.k]}?`, h: "Autosominį ir su lytimi sukibusį požymį skaičiuok atskirai (tarp visų vaikų), tada sudaugink.", s: `Aa × Aa: aa – 1/4, A_ – 3/4. XᴴXʰ × XᴴY tarp visų vaikų: sergantis sūnus – 1/4, dukra nešiotoja – 1/4, neserga – 3/4. Sudaugink reikiamas dalis.` }),
    B9: v => ({ q: `Žiedų spalva paveldima nepilno dominavimo būdu (RR – raudoni, Rr – rožiniai, rr – balti), augalo aukštis – visiškai dominuojant (T – aukštas, t – žemas); genai nesukibę. Kryžminami RrTt × RrTt. Kokia tikimybė, kad palikuonis bus ${col[v.tg[0]]} žiedais ir ${hgt[v.tg[1]].slice(0, -1)}as?`.replace("aukštas", "aukštas").replace("žemas", "žemas"), h: "Rr × Rr: 1/4 RR, 1/2 Rr, 1/4 rr. Tt × Tt: 3/4 aukštų, 1/4 žemų. Sudaugink.", s: `${v.tg[0]} – ${v.tg[0] === "Rr" ? "1/2" : "1/4"}; ${v.tg[1] === "T_" ? "aukštas – 3/4" : "žemas – 1/4"}. Sandauga – atsakymas.` })
  },
  rep: {
    head: "Dienos ataskaita", pts: (a, b) => `Taškai: ${a} iš ${b}`, first: (a, b) => `Iš pirmo karto: ${a} iš ${b} žingsnių`,
    stars: ["Dar reikia pasikartoti – atsiversk žinyną ir bandyk iš naujo.", "Diena užskaityta. Atidžiau ieškok įrodymų medyje.", "Geras darbas. Iki aukščiausio įvertinimo trūksta nedaug.", "Puikiai: tikslūs įrodymai ir skaičiavimai."],
    next: "Kita diena", again: "Kartoti dieną", menu: "Į kabinetą"
  },
  manual: [
    { name: "Kaip skaityti genealoginį medį", html: "<p>Kvadratas – vyras, apskritimas – moteris, tamsus simbolis – sergantis asmuo. Horizontali linija jungia sutuoktinius, nuo jos žemyn – vaikai. Kartos žymimos romėniškais skaičiais, asmenys kartoje – arabiškais (II-3).</p><p><b>Recesyvinis požymis:</b> sergantis vaikas gimsta sveikiems tėvams. <b>Dominantinis:</b> kiekvienas sergantis turi sergantį tėvą ar motiną, liga matoma kiekvienoje kartoje.</p><p><b>Sukibęs su X:</b> dažniausiai serga vyrai; sergančio sūnaus motina – nešiotoja; iš tėvo sūnui toks alelis neperduodamas. Jei serga dukra, o jos tėvas sveikas – recesyvinis alelis ne X chromosomoje.</p>" },
    { name: "Genotipai ir „galbūt nešiotojas“", html: "<p>Sveiko sergančiojo brolio ar sesers (tėvai Aa × Aa) genotipas nežinomas: iš trijų sveikų variantų (AA, Aa, Aa) du – nešiotojai, todėl tikimybė <b>2/3</b>, ne 1/2.</p><p>Nešiotojos (XᴬXᵃ) dukra yra nešiotoja su tikimybe <b>1/2</b>. Sergančio vyro (XᵃY) dukros – visos nešiotojos.</p><p class='ex'>Rizika = P(tėvas nešiotojas) · P(motina nešiotoja) · P(vaikas serga, jei abu nešiotojai)</p>" },
    { name: "Tikimybės keliems vaikams", html: "<p>Kiekvienas vaikas – nepriklausomas įvykis: tikimybės dauginamos. „Bent vienas“ skaičiuojamas per priešingą įvykį.</p><p class='ex'>Abu sveiki: (3/4)² = 9/16<br>Bent vienas iš trijų serga: 1 − (3/4)³ = 37/64<br>Serganti mergaitė: 1/4 · 1/2 = 1/8</p><p>Jei tėvo ar motinos genotipas nežinomas, kiekvieną galimą atvejį skaičiuok atskirai ir sudėk.</p>" },
    { name: "Dihibridinis kryžminimas be gardelės", html: "<p>Kai genai nesukibę, kiekvienas paveldimas nepriklausomai. Kiekvienam genui atskirai rask reikiamo genotipo ar fenotipo dalį ir tikimybes <b>sudaugink</b>.</p><p class='ex'>AaBb × AaBb: A_ bb = 3/4 · 1/4 = 3/16<br>AaBbCc × AaBbCc: aabbcc = (1/4)³ = 1/64</p><p>Tas pats tinka kraujo grupėms su rezus faktoriumi ir autosominiam požymiui kartu su sukibusiu su X.</p>" },
    { name: "Analizuojamasis kryžminimas ir sukibę genai", html: "<p><b>Analizuojamasis kryžminimas</b> – su recesyvine homozigota (aabb). Palikuonių fenotipai tiesiogiai parodo nežinomo tėvo gametas: jei atsiranda recesyvinis požymis, tėvas pagal tą geną heterozigotinis.</p><p><b>Sukibę genai</b> yra toje pačioje chromosomoje ir paveldimi kartu; naujus derinius sukuria krosingoveris.</p><p class='ex'>Krosingoverio dažnis = rekombinantų skaičius : visų palikuonių skaičius · 100 %</p>" }
  ]
};
})();
