/* Molekulių dirbtuvė – visi mokiniui rodomi tekstai (lietuvių k.). Kitų kalbų versijai keisti tik šį failą
   (cheminių pavadinimų sudarymo taisyklės – molekules.js; jas kalbai taip pat reikės pritaikyti). */
window.MK_T = (function(){
const sub = n => n;
const T = {};
T.title = "Molekulių dirbtuvė";
T.h1 = "Molekulių <em>dirbtuvė</em>";
T.hero = "Sudėk molekulę iš atomų, pavadink ją pagal IUPAC ir surask visus izomerus. Organinė chemija 11–12 klasei.";
T.note = "Pagal chemijos bendrąją programą (III gimnazijos klasė): alkanai, alkenai, alkinai, alkoholiai, aldehidai, ketonai, karboksirūgštys ir halogeninti angliavandeniliai. Pavadinimai rašomi taip, kaip valstybiniuose brandos egzaminuose (pvz., 2-butanolis). Čia nerodome cis/trans izomerų.";
T.points = "Taškai";
T.levels = [
  ["Alkanai", "C₁–C₁₀: pavadinimas ir formulė"],
  ["Alkenai ir alkinai", "Dvigubas ir trigubas ryšys, jo vieta"],
  ["Šakotos grandinės", "Metilas ir etilas, numeravimas"],
  ["Alkoholiai ir karbonilo junginiai", "–OH, aldehidai, ketonai"],
  ["Rūgštys ir halogeninti", "–COOH, –Cl, –Br"],
  ["Izomerų medžioklė", "Rask visas struktūras su tokia pačia formule"],
  ["Mišrus egzaminas", "10 užduočių iš visų temų"]
];
T.cls = { ane: "Alkanai", ene: "Alkenai", yne: "Alkinai", alc: "Alkoholiai", ald: "Aldehidai", ket: "Ketonai", acid: "Karboksirūgštys", hal: "Halogeninti angliavandeniliai" };
T.clsOne = { ane: "alkanas", ene: "alkenas", yne: "alkinas", alc: "alkoholis", ald: "aldehidas", ket: "ketonas", acid: "karboksirūgštis", hal: "halogenintas angliavandenilis" };
T.taskOf = (i, n, lv) => `${i} / ${n} · ${lv}`;
T.build = nm => `Sudaryk molekulę: <b>${nm}</b>`;
T.buildHow = "Pasirink atomą, bakstelėk „+“ ir pridėk naują. Ryšį pakeisi bakstelėjęs liniją tarp atomų.";
T.buildHowC = "Pasirink atomą, bakstelėk „+“ ir pridėk anglies atomą. Vandenilių pridėti nereikia – jie skaičiuojami patys.";
T.nameQ = "Koks šios medžiagos pavadinimas?";
T.classQ = "Kuriai organinių junginių klasei ji priklauso?";
T.formQ = "Kokia šios molekulės formulė?";
T.tool = { C: "C", OH: "OH", O: "=O", Cl: "Cl", Br: "Br", F: "F", del: "Trinti" };
T.toolTitle = { C: "Anglies atomas", OH: "Hidroksigrupė –OH", O: "Dvigubas ryšys su deguonimi =O", Cl: "Chloras", Br: "Bromas", F: "Fluoras", del: "Ištrinti galinį atomą" };
T.undo = "↶ Atšaukti"; T.clear = "Išvalyti"; T.check = "Tikrinti"; T.next = "Toliau"; T.results = "Rezultatai";
T.formulaNow = "Tavo formulė";
T.sel = (lab) => `Pasirinktas atomas: <b>${lab}</b>. Bakstelėk „+“, kad prie jo pridėtum atomą.`;
T.noSock = "Šis atomas jau turi visus ryšius. Pasirink kitą atomą arba pakeisk ryšį.";
T.valMsg = "Anglis turi ne daugiau kaip 4 ryšius, deguonis – 2, halogenas – 1.";
T.bondMsg = "Čia ryšio pakeisti negalima – atomui trūktų valentingumo.";
T.onlySingle = "Šiame lygyje yra tik pavieniai ryšiai.";
T.eraseOnly = "Ištrinti galima tik galinį atomą (turintį vieną ryšį).";
T.hintFormula = f => `Užuomina: reikiama formulė – <b>${f}</b>.`;
T.hintBtn = "Užuomina";
T.tries = "Bandymai";

/* ---- atsakymai ir paaiškinimai ---- */
T.okHead = (p, pts) => `${p} +${pts} tšk.`;
T.badHead = "Dar ne visai.";
T.secondHead = "Ne šį kartą";
T.tryAgain = "Pabandyk dar kartą";
T.buildOk = nm => `Taip – tai <b>${nm}</b>.`;
T.buildBadFormula = (mine, need, dc, dh) => {
  let hint = "";
  if(dc < 0) hint = "Trūksta anglies atomų.";
  else if(dc > 0) hint = "Anglies atomų per daug.";
  else if(dh !== 0) hint = "Anglies atomų tiek, kiek reikia, bet vandenilių skaičius kitoks – patikrink, ar ryšiai tinkami.";
  else hint = "Patikrink, ar yra visi reikalingi atomai (O, halogenai).";
  return `Tavo molekulės formulė – <b>${mine}</b>, o reikia <b>${need}</b>. ${hint}`;
};
T.buildBadSame = (f, mineName) => `Formulė tinka (<b>${f}</b>), bet atomai sujungti kitaip.` + (mineName ? ` Tavo molekulė vadinasi <b>${mineName}</b>.` : "");
T.buildBadOther = mineName => mineName ? `Tavo molekulė vadinasi <b>${mineName}</b>.` : "Tokios molekulės pagal žaidimo taisykles pavadinti negalima (pvz., ilgesnės šakos) – pabandyk kitaip.";
T.revealHead = "Štai teisingas sprendimas";
T.explain = "Kaip pavadinti?";
T.moreNum = "Pakaitai ir numeravimas";

const grpName = { alc: "–OH grupė", ald: "–CHO grupė", ket: "C=O grupė", acid: "–COOH grupė" };
const sufName = { ane: "-anas", ene: "-enas", yne: "-inas", alc: "-olis", ald: "-alis", ket: "-onas", acid: "-ano rūgštis" };
const subTxt = { metil: "metil (–CH₃)", etil: "etil (–C₂H₅)", chlor: "chlor (–Cl)", brom: "brom (–Br)", fluor: "fluor (–F)", jod: "jod (–I)" };
const multN = ["", "", "2 ×", "3 ×", "4 ×", "5 ×", "6 ×"];
T.nameSteps = function(t){
  const out = []; const g = t.kind ? grpName[t.kind] : null;
  const typ = t.kind || t.type;
  if(t.kind) out.push(`<b>1. Grandinė.</b> Renkamės ilgiausią anglies grandinę, kurioje yra ${g}: ${t.len} C → <b>${t.stem}-</b>.`);
  else if(t.type === "ene") out.push(`<b>1. Grandinė.</b> Renkamės ilgiausią grandinę, kurioje yra dvigubas ryšys: ${t.len} C → <b>${t.stem}-</b>.`);
  else if(t.type === "yne") out.push(`<b>1. Grandinė.</b> Renkamės ilgiausią grandinę, kurioje yra trigubas ryšys: ${t.len} C → <b>${t.stem}-</b>.`);
  else out.push(`<b>1. Grandinė.</b> Renkamės ilgiausią anglies grandinę: ${t.len} C → <b>${t.stem}-</b>.`);
  const end = { ane: "Visi ryšiai pavieniai", ene: "Yra dvigubas ryšys C=C", yne: "Yra trigubas ryšys C≡C", alc: "Yra –OH grupė (alkoholis)", ald: "Yra –CHO grupė (aldehidas)", ket: "Yra C=O grupė grandinės viduje (ketonas)", acid: "Yra –COOH grupė (karboksirūgštis)" }[typ];
  out.push(`<b>2. Galūnė.</b> ${end} → <b>${sufName[typ]}</b>.`);
  const what = t.kind ? g : t.type === "ene" ? "dvigubas ryšys" : t.type === "yne" ? "trigubas ryšys" : null;
  const loc = t.kind ? t.pcl : t.ul;
  if(t.reason === "fixed") out.push(`<b>3. Numeravimas.</b> Aldehido ir rūgšties grupė visada yra grandinės pradžioje – tai C1.`);
  else if(t.reason === "pc" || t.reason === "ul") out.push(`<b>3. Numeravimas.</b> Numeruojame nuo to galo, kuris arčiau grupės ar kartotinio ryšio: ${what} prasideda nuo C${loc}.`);
  else if(t.reason === "sl") out.push(`<b>3. Numeravimas.</b> ${what ? "Grupė ar kartotinis ryšys gauna tą patį numerį iš abiejų galų, todėl" : "Abiejų galų numeracija pradžioje vienoda, todėl"} numeruojame taip, kad pakaitų numeriai būtų kuo mažesni: <b>${t.sl.join(", ")}</b> (kitaip būtų ${t.revSl.join(", ")}).`);
  else if(t.reason === "al") out.push(`<b>3. Numeravimas.</b> Numeriai abiem kryptimis tie patys, todėl mažesnį numerį gauna pakaitas, kurio pavadinimas pirmesnis abėcėlėje.`);
  else if(t.reason === "sym") out.push(`<b>3. Numeravimas.</b> Molekulė simetriška – abu galai vienodi, tad numeruoti galima iš bet kurio.`);
  else if(t.len > 1 && what) out.push(`<b>3. Numeravimas.</b> ${what[0].toUpperCase() + what.slice(1)} – prie C${loc}.`);
  let omit = "";
  if(!t.hals){
    if((t.type === "ene" || t.type === "yne") && !t.kind && t.len <= 3) omit = "Vietos žymėti nereikia – kitaip jis negali būti.";
    if(t.kind === "alc" && t.len <= 2) omit = "Vietos žymėti nereikia – OH grupė gali būti tik C1 (arba C2 – tas pats).";
    if(t.kind === "ket" && t.len <= 4 && !t.subs.length) omit = "Vietos žymėti nereikia – C=O grupė gali būti tik viduje, o abu variantai vienodi.";
  }
  if(omit) out.push(`<i>${omit}</i>`);
  if(t.subs.length){
    const by = {}; t.subs.forEach(s => (by[s.nm] = by[s.nm] || []).push(s.loc));
    const names = Object.keys(by);
    const parts = names.map(nm => { const l = by[nm].sort((a, b) => a - b); return `${l.length > 1 ? multN[l.length] + " " : ""}<b>${subTxt[nm]}</b> prie C${l.join(", C")}`; });
    out.push(`<b>4. Pakaitai.</b> ${parts.join("; ")}.${names.length > 1 ? " Pavadinime juos rašome <b>abėcėlės tvarka</b>." : ""}${Object.values(by).some(l => l.length > 1) ? " Du vienodi – <b>di-</b>, trys – <b>tri-</b>." : ""}`);
  }
  out.push(`<b>Pavadinimas:</b> <b>${t.name}</b>`);
  return out;
};
T.classWhy = {
  ane: "Visi ryšiai tarp anglies atomų pavieniai, kitų atomų nėra (tik C ir H) – tai <b>alkanas</b> (CₙH₂ₙ₊₂).",
  ene: "Yra dvigubas ryšys C=C – tai <b>alkenas</b> (CₙH₂ₙ).",
  yne: "Yra trigubas ryšys C≡C – tai <b>alkinas</b> (CₙH₂ₙ₋₂).",
  alc: "Yra hidroksigrupė –OH prie sotaus anglies atomo – tai <b>alkoholis</b>.",
  ald: "Grandinės gale yra –CHO grupė (C=O ir vienas H) – tai <b>aldehidas</b>.",
  ket: "Anglies grandinės viduje yra C=O grupė – tai <b>ketonas</b>.",
  acid: "Grandinės gale yra –COOH grupė (C=O ir –OH prie to paties C) – tai <b>karboksirūgštis</b>.",
  hal: "Vandenilį pakeitė halogeno atomas (–Cl, –Br ...) – tai <b>halogenintas angliavandenilis</b>."
};
T.formWhy = (parts, h, f) => `Prie kiekvieno C suskaičiuojame vandenilius, kad jis turėtų 4 ryšius: ${parts} → ${h} H. Formulė – <b>${f}</b>.`;
T.formWhyAl = (n, f) => `Alkanų bendroji formulė CₙH₂ₙ₊₂: kai n = ${n}, H = 2·${n} + 2 = ${2 * n + 2}. Formulė – <b>${f}</b>.`;
T.formWhyEne = (n, f) => `Alkenų bendroji formulė CₙH₂ₙ: kai n = ${n}, H = ${2 * n}. Formulė – <b>${f}</b>.`;
T.formWhyYne = (n, f) => `Alkinų bendroji formulė CₙH₂ₙ₋₂: kai n = ${n}, H = 2·${n} − 2 = ${2 * n - 2}. Formulė – <b>${f}</b>.`;

/* ---- bendrosios formulės ---- */
T.gFwd = (nm, n) => `${nm[0].toUpperCase() + nm.slice(1)} turi <b>${n}</b> anglies atom${n % 10 === 1 && n !== 11 ? "ą" : "ų"}. Kiek vandenilio atomų jis turi?`;
T.gRev = (nm, h) => `${nm[0].toUpperCase() + nm.slice(1)} turi <b>${h}</b> vandenilio atomų. Kiek anglies atomų jis turi?`;
T.gRec = dat => `Kuri formulė gali priklausyti <b>${dat}</b>?`;
T.gWhyFwd = (nm, gen, n, calc, H) => `Bendroji ${nm.replace(/as$/, "ų")} formulė <b>${gen}</b>. Kai n = ${n}: H = ${calc} = <b>${H}</b>.`;
T.gWhyRev = (nm, gen, H, n) => `Bendroji formulė <b>${gen}</b>. Iš H = ${H} randame n = <b>${n}</b>.`;
T.gWhyRec = (dat, gen, n, calc, H) => `Formulė turi atitikti <b>${gen}</b>. Kai n = ${n}, H = ${calc} = ${H}, todėl tinka <b>C${n}H${H}</b>.`.replace(/C(\d+)H(\d+)/, (m, a, b) => `C<sub>${a}</sub>H<sub>${b}</sub>`);

/* ---- izomerų medžioklė ---- */
T.huntQ = (what, f, n) => `Rask visus ${what}, kurių formulė <b>${f}</b>. Iš viso jų yra <b>${n}</b>.`;
T.huntFound = (a, b) => `Rasta ${a} iš ${b}`;
T.huntNew = nm => `Naujas izomeras: <b>${nm}</b>!`;
T.huntDup = nm => `<b>${nm}</b> jau turi. Ieškok kitos struktūros.`;
T.huntDupSame = "Šią molekulę jau turi (tik nupiešta kitaip – grandinę galima lenkti bet kaip, svarbu, kas su kuo sujungta).";
T.huntBadF = (mine, need) => `Formulė netinka: tavo molekulė <b>${mine}</b>, o reikia <b>${need}</b>.`;
T.huntBadC = what => `Formulė tinka, bet šioje užduotyje ieškome tik šių junginių: ${what}.`;
T.huntBadN = "Tokios molekulės pagal žaidimo taisykles pavadinti negalima.";
T.huntHint = nm => `Užuomina: vienas iš likusių vadinasi <b>${nm}</b>.`;
T.huntShow = "Rodyti likusius";
T.huntDoneH = n => `Radai visus ${n}!`;
T.huntDoneB = f => `Visi turi tą pačią molekulinę formulę <b>${f}</b>, bet skirtingą sandarą – tai <b>struktūriniai izomerai</b>: skiriasi pavadinimais ir savybėmis.`;
T.huntEnd = (a, b, f) => `Rasta ${a} iš ${b}. Visos šios molekulės turi formulę <b>${f}</b>, bet skirtingą sandarą – struktūriniai izomerai.`;
T.huntInter = "Aldehidai ir ketonai su ta pačia formule – tarpklasiniai izomerai (C=O grupė gale arba grandinės viduje).";
T.huntCis = "Čia cis/trans (erdvinių) izomerų nesiskiriame – skaičiuojami tik struktūriniai.";
T.slotRevealed = "atskleista";
T.hunts = [
  { id: "ane4", lvl: "e", specs: [{ cls: "ane", n: 4 }], what: "alkanus" },
  { id: "ene4", lvl: "e", specs: [{ cls: "ene", n: 4 }], what: "alkenus" },
  { id: "alc3", lvl: "e", specs: [{ cls: "alc", n: 3 }], what: "alkoholius" },
  { id: "hal3", lvl: "e", specs: [{ cls: "hal", n: 3, x: "Cl", k: 1 }], what: "halogenintus angliavandenilius su vienu Cl" },
  { id: "acid4", lvl: "e", specs: [{ cls: "acid", n: 4 }], what: "karboksirūgštis" },
  { id: "ane5", lvl: "e", specs: [{ cls: "ane", n: 5 }], what: "alkanus" },
  { id: "alc4", lvl: "m", specs: [{ cls: "alc", n: 4 }], what: "alkoholius" },
  { id: "hal4", lvl: "m", specs: [{ cls: "hal", n: 4, x: "Cl", k: 1 }], what: "halogenintus angliavandenilius su vienu Cl" },
  { id: "hal3b", lvl: "m", specs: [{ cls: "hal", n: 3, x: "Cl", k: 2 }], what: "halogenintus angliavandenilius su dviem Cl" },
  { id: "ane6", lvl: "m", specs: [{ cls: "ane", n: 6 }], what: "alkanus" },
  { id: "ene5", lvl: "m", specs: [{ cls: "ene", n: 5 }], what: "alkenus" },
  { id: "yne5", lvl: "m", specs: [{ cls: "yne", n: 5 }], what: "alkinus" },
  { id: "ak4", lvl: "m", specs: [{ cls: "ald", n: 4 }, { cls: "ket", n: 4 }], what: "aldehidus ir ketonus", inter: true },
  { id: "acid5", lvl: "m", specs: [{ cls: "acid", n: 5 }], what: "karboksirūgštis" },
  { id: "alc5", lvl: "h", specs: [{ cls: "alc", n: 5 }], what: "alkoholius" },
  { id: "ane7", lvl: "h", specs: [{ cls: "ane", n: 7 }], what: "alkanus" },
  { id: "ak5", lvl: "h", specs: [{ cls: "ald", n: 5 }, { cls: "ket", n: 5 }], what: "aldehidus ir ketonus", inter: true },
  { id: "hal5", lvl: "h", specs: [{ cls: "hal", n: 5, x: "Cl", k: 1 }], what: "halogenintus angliavandenilius su vienu Cl" },
  { id: "hal4b", lvl: "h", specs: [{ cls: "hal", n: 4, x: "Cl", k: 2 }], what: "halogenintus angliavandenilius su dviem Cl" }
];

/* ---- rezultatai ir albumas ---- */
T.resTitle = (s, n) => s >= n - 0.01 ? "Be klaidų!" : s >= n * 0.6 ? "Gerai padirbėta!" : "Dar pasitreniruok";
T.resText = (pts, fresh) => `Surinkta taškų: <b>${pts}</b>.` + (fresh ? ` Į albumą pridėta naujų molekulių: <b>${fresh}</b>.` : "");
T.albumTitle = "Mano molekulių albumas";
T.albumEmpty = "Čia atsiras kiekviena teisingai sudaryta ar surasta molekulė.";
T.albumText = (n, rank, left, nx) => `Albume: <b>${n}</b> molekulių. Laipsnis: <b>${rank}</b>.` + (left ? ` Iki laipsnio „${nx}“ – dar ${left}.` : " Aukščiausias laipsnis!");
T.ranks = [["Stažuotojas", 0], ["Laborantas", 5], ["Chemikas", 15], ["Sintezės specialistas", 35], ["Vyresnysis chemikas", 70], ["Molekulių meistras", 120]];

/* ---- noriu pasimokyti ---- */
const tb = rows => `<table class="tb">${rows.map((r, i) => `<tr>${r.map(c => i ? `<td>${c}</td>` : `<th>${c}</th>`).join("")}</tr>`).join("")}</table>`;
T.learn = [
  { name: "Alkanai: pavadinimai C₁–C₁₀ ir formulė", level: 0, html:
    `<p>Alkanai – angliavandeniliai, kuriuose visi ryšiai pavieniai. Bendroji formulė: <b>CₙH₂ₙ₊₂</b>. Pavadinimas = skaičiaus šaknis + <b>-anas</b>.</p>` +
    tb([["C atomų", "Pavadinimas", "Formulė"], ["1", "metanas", "CH₄"], ["2", "etanas", "C₂H₆"], ["3", "propanas", "C₃H₈"], ["4", "butanas", "C₄H₁₀"], ["5", "pentanas", "C₅H₁₂"], ["6", "heksanas", "C₆H₁₄"], ["7", "heptanas", "C₇H₁₆"], ["8", "oktanas", "C₈H₁₈"], ["9", "nonanas", "C₉H₂₀"], ["10", "dekanas", "C₁₀H₂₂"]]) +
    `<p>Gretimi nariai skiriasi viena <b>CH₂</b> grupe – tai <b>homologai</b>, o jų eilė – <b>homologinė eilė</b>.</p>` },
  { name: "Alkenai ir alkinai", level: 1, html:
    `<p><b>Alkenai</b> turi vieną dvigubą ryšį C=C, bendroji formulė <b>CₙH₂ₙ</b>, galūnė <b>-enas</b>. <b>Alkinai</b> – vieną trigubą ryšį, formulė <b>CₙH₂ₙ₋₂</b>, galūnė <b>-inas</b>.</p>` +
    `<p>Grandinę numeruojame nuo to galo, kuris arčiau kartotinio ryšio, ir prieš pavadinimą rašome mažesnį jo numerį: <b>1-butenas</b> (CH₂=CH–CH₂–CH₃), <b>2-butenas</b> (CH₃–CH=CH–CH₃).</p>` +
    `<p>Eteno ir propeno vietos žymėti nereikia (<b>etenas</b>, <b>propenas</b>), nes kitaip negali būti.</p>` },
  { name: "Šakotos grandinės: kaip pavadinti", level: 2, html:
    `<ol><li><b>Ilgiausia grandinė</b> (alkenuose – ilgiausia, kurioje yra dvigubas ryšys). Ji duoda pavadinimo šaknį.</li>
     <li><b>Numeruojame</b> iš to galo, kad grupė ar kartotinis ryšys gautų mažesnį numerį; jei tas pats – kad <b>pakaitų numeriai būtų mažiausi</b>.</li>
     <li><b>Pakaitai</b> (šakos): metilas –CH₃, etilas –C₂H₅. Prieš juos rašome numerį: <b>2-metil</b>.</li>
     <li>Keli vienodi: <b>di-</b>, <b>tri-</b> (2,2-dimetil). Skirtingi – <b>abėcėlės tvarka</b> (etil prieš metil): 3-etil-2-metilpentanas.</li></ol>` +
    `<p>Pavyzdys: CH₃–CH(CH₃)–CH₂–CH₃ → grandinė 4 C (butanas), metilas prie C2 → <b>2-metilbutanas</b>.</p>` },
  { name: "Funkcinės grupės ir klasės", level: 3, html:
    tb([["Grupė", "Klasė", "Galūnė", "Pavyzdys"], ["–OH", "alkoholiai", "-olis", "2-propanolis"], ["–CHO (gale)", "aldehidai", "-alis", "propanalis"], ["C=O (viduje)", "ketonai", "-onas", "2-pentanonas"], ["–COOH (gale)", "karboksirūgštys", "-ano rūgštis", "etano rūgštis"], ["–Cl, –Br", "halogeninti angliavandeniliai", "chlor-, brom-", "2-chlorpropanas"]]) +
    `<p>Alkoholio ir ketono grupės vietą žymime numeriu (<b>2-butanolis</b>, <b>2-pentanonas</b>). Aldehido ir rūgšties grupė visada C1, todėl numerio nereikia (<b>butanalis</b>, <b>butano rūgštis</b>).</p>` +
    `<p>Halogeno atomus vardijame kaip pakaitus: <b>1,2-dichloretanas</b>, <b>2-brompropanas</b>.</p>` },
  { name: "Izomerai", level: 5, html:
    `<p><b>Struktūriniai izomerai</b> turi tą pačią molekulinę formulę, bet skirtingą atomų sujungimo tvarką. Pvz., C₄H₁₀: <b>butanas</b> ir <b>2-metilpropanas</b>.</p>` +
    `<p><b>Tarpklasiniai izomerai</b>: aldehidai ir ketonai (C₃H₆O: propanalis ir propanonas), karboksirūgštys ir esteriai.</p>` +
    `<p>Kaip ieškoti: pirmiausia nubrėžk ilgiausią grandinę, tada trumpink ją po vieną C ir dėliok šaką į visas skirtingas vietas. Tą pačią molekulę galima nupiešti įvairiai – lyginame sujungimus, o ne piešinį.</p>` },
  { name: "Kaip statyti molekulę žaidime", html:
    `<p>1. Pasirink atomą (jis apvestas). 2. Bakstelėk „+“ – ten atsiras naujas atomas su pasirinktu įrankiu. 3. Bakstelėk liniją tarp dviejų atomų, kad ryšys taptų dvigubas ar trigubas. 4. Vandenilių dėti nereikia – jie užpildo likusius ryšius (CH₃, CH₂, CH).</p>` +
    `<p>Anglis visada turi 4 ryšius, deguonis – 2, halogenas – 1. Grandinę gali lenkti bet kaip: svarbu, kas su kuo sujungta.</p>` }
];
return T;
})();
