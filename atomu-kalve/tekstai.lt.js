/* Atomų kalvė – visi mokiniui rodomi tekstai (lietuvių k.). Verčiant keisti tik šį failą.
   Terminai – pagal Chemijos bendrąją programą (8 kl., 28.1.1 „Atomo sandara“, 28.1.2 „Periodinis dėsnis“):
   „atomo sandara (branduolys ir elektronai)“, „branduolyje yra protonai ir neutronai“, „masės skaičius“,
   „elektronų pasiskirstymas sluoksniuose atomuose ir jonuose“, „elektroninės sandaros schemos“, „izotopai“,
   „santykinė atominė masė“, „periodinė elementų sistema“, „periodai ir grupės“, „1 (IA)“ ir „17 (VIIA)“ grupės. */
(function(){
"use strict";
const pl = (n, a) => { n = Math.abs(n); return a[(n % 10 === 1 && n % 100 !== 11) ? 0 : (n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20)) ? 1 : 2]; };
/* galininkas (po „turi“, „atiduoda“) */
const pr = n => n + " " + pl(n, ["protoną", "protonus", "protonų"]);
const ne = n => n + " " + pl(n, ["neutroną", "neutronus", "neutronų"]);
const el = n => n + " " + pl(n, ["elektroną", "elektronus", "elektronų"]);
const sl = n => n + " " + pl(n, ["elektronų sluoksnį", "elektronų sluoksnius", "elektronų sluoksnių"]);
/* vardininkas (po „yra“) */
const prN = n => n + " " + pl(n, ["protonas", "protonai", "protonų"]);
const neN = n => n + " " + pl(n, ["neutronas", "neutronai", "neutronų"]);
const elN = n => n + " " + pl(n, ["elektronas", "elektronai", "elektronų"]);
const dec = x => String(x).replace(".", ",");
const ORD = ["", "pirmame", "antrame", "trečiame", "ketvirtame"];
const GRP = { 1: "1 (IA)", 2: "2 (IIA)", 13: "13 (IIIA)", 14: "14 (IVA)", 15: "15 (VA)", 16: "16 (VIA)", 17: "17 (VIIA)", 18: "18 (VIIIA)" };
const cfgT = c => c.join(", ");
const cfgLong = c => c.map((v, i) => `${ORD[i + 1]} sluoksnyje – ${v}`).join(", ");

window.MK_T = {
  pr, ne, el, sl, dec, GRP, cfgT,
  title: "Atomų kalvė",
  heroA: "Atomų", heroB: "kalvė",
  hero: "Kalvėje atomai kalami iš dalelių: protonų, neutronų ir elektronų. Perskaityk užsakymą, apskaičiuok, kiek kurių dalelių reikia, ir nukalk atomą, izotopą ar joną.",
  heroAria: "Kalvė: meistrė su kūju prie priekalo, virš kurio švyti atomas",
  /* elementai: [simbolis, vardininkas, kilmininkas] */
  els: [null,
    ["H", "vandenilis", "vandenilio"], ["He", "helis", "helio"], ["Li", "litis", "ličio"], ["Be", "berilis", "berilio"], ["B", "boras", "boro"],
    ["C", "anglis", "anglies"], ["N", "azotas", "azoto"], ["O", "deguonis", "deguonies"], ["F", "fluoras", "fluoro"], ["Ne", "neonas", "neono"],
    ["Na", "natris", "natrio"], ["Mg", "magnis", "magnio"], ["Al", "aliuminis", "aliuminio"], ["Si", "silicis", "silicio"], ["P", "fosforas", "fosforo"],
    ["S", "siera", "sieros"], ["Cl", "chloras", "chloro"], ["Ar", "argonas", "argono"], ["K", "kalis", "kalio"], ["Ca", "kalcis", "kalcio"]],
  levels: [
    ["Atomo sandara", "Protonai, neutronai, elektronai ir masės skaičius"],
    ["Elektronų sluoksniai", "Elektroninės sandaros schemos: nuo 1 iki 20 elemento"],
    ["Periodinė elementų sistema", "Periodai, grupės, metalai ir nemetalai"],
    ["Izotopai", "Tas pats elementas – skirtingas neutronų skaičius"],
    ["Jonai", "Atomas atiduoda arba prisijungia elektronus"],
    ["Meistro egzaminas", "Visos temos kartu · 10 užduočių"]
  ],
  colH: "Kalvės lentyna",
  colP: (got, gold, rank, next) => got >= 20 && gold >= 20
    ? `Visi 20 elementų nukalti auksu. Tavo vardas – ${rank}!`
    : `Nukalta elementų: ${got} iš 20 (auksinių: ${gold}). Elementas patenka į lentyną, kai jo užsakymą įvykdai iš pirmo karto; nukalęs tris kartus, gauni auksinį. Vardas: ${rank}.` + (next ? ` ${next}` : ""),
  colNext: (n, rank) => `Iki vardo „${rank}“ trūksta: ${n}.`,
  ranks: ["Pameistrys", "Kalvis", "Vyresnysis kalvis", "Meistras", "Didysis atomų meistras"],
  pts: "Taškai",
  next: "Toliau →", finish: "Baigti",
  rule: "Paaiškinimas",
  bad: a => `Ne visai. Teisingas atsakymas: ${a}`,
  badPlain: "Ne visai.",
  res: (ok, total, pts, gain) => `Iš pirmo karto: ${ok} iš ${total}. Taškai: ${pts}.` + (gain.length ? `<br><b>${gain.length > 1 ? "Nauji elementai lentynoje" : "Naujas elementas lentynoje"}: ${gain.join(", ")}!</b>` : ""),

  /* ---------- valdymas ---------- */
  check: "Kalti!",
  checkTap: "Tikrinti",
  tableBtn: "Periodinė elementų sistema",
  tableH: "Periodinė elementų sistema (1–20 elementai)",
  tableP: "Langelyje: viršuje – elemento numeris (protonų skaičius), viduryje – simbolis, apačioje – santykinė atominė masė. Stulpeliai – grupės, eilutės – periodai.",
  tableClose: "Uždaryti",
  period: "periodas", group: "grupė",
  lblP: "Protonai", lblN: "Neutronai", lblE: "Elektronai",
  lblSh: i => `${i} sluoksnis`,
  locked: (p, n) => `Branduolys jau nukaltas: ${p} p⁺ ir ${n} n⁰`,
  atomAria: "Atomo modelis: branduolys ir elektronų sluoksniai",
  selNone: "Paliesk elemento langelį.",
  sel: (s, n) => `Pasirinkta: ${s} (${n})`,
  againTap: "Ne tas elementas. Turi dar vieną bandymą.",
  forged: name => `Nukalta: ${name}!`,
  found: name => `Teisingai – ${name}!`,
  /* užuominos po pirmo nesėkmingo kalimo (atsakymo neišduoda) */
  hP: "Dar ne. Netinka protonų skaičius: jis lygus elemento numeriui periodinėje elementų sistemoje (apatinis skaičius prie simbolio). Turi dar vieną bandymą.",
  hN: "Dar ne. Protonų skaičius geras, bet netinka neutronų skaičius: masės skaičius = protonai + neutronai. Turi dar vieną bandymą.",
  hEAtom: "Dar ne. Branduolys geras, bet atomas turi būti neutralus – elektronų turi būti tiek pat, kiek protonų. Turi dar vieną bandymą.",
  hEIon: "Dar ne. Branduolys geras, bet netinka elektronų skaičius: jono krūvis parodo, kiek elektronų atiduota (+) arba prisijungta (−). Turi dar vieną bandymą.",
  hTotalAtom: "Dar ne. Netinka bendras elektronų skaičius: atome elektronų tiek pat, kiek protonų. Turi dar vieną bandymą.",
  hTotalIon: "Dar ne. Netinka bendras elektronų skaičius: pažiūrėk į jono krūvį – kiek elektronų atiduota (+) arba prisijungta (−). Turi dar vieną bandymą.",
  hShell: "Dar ne. Elektronų skaičius geras, bet jie ne tuose sluoksniuose: pildyk nuo branduolio – pirmame telpa 2, antrame 8. Turi dar vieną bandymą.",

  /* ---------- klausimai ---------- */
  q: {
    build: nuc => `Užsakymas: nukalk atomą ${nuc}. Sudėk reikiamą protonų, neutronų ir elektronų skaičių.`,
    buildW: (gen, A) => `Užsakymas: nukalk <b>${gen}</b> atomą, kurio masės skaičius <b>${A}</b>. Protonų skaičių rask periodinėje elementų sistemoje.`,
    count: (kind, nuc) => `Kiek ${["protonų", "neutronų", "elektronų"][kind]} yra atome ${nuc}?`,
    readAtom: "Meistrė nukalė šį atomą. Kuris užrašas jį apibūdina?",
    massOf: (p, n) => `Atomo branduolyje yra ${prN(p)} ir ${neN(n)}. Koks šio atomo masės skaičius?`,
    whichEl: (A, n) => `Atomo masės skaičius ${A}, o jo branduolyje yra ${neN(n)}. Kurio elemento tai atomas?`,
    stmt: "Kuris teiginys teisingas?",
    shells: gen => `Užsakymas: paskirstyk <b>${gen}</b> atomo elektronus sluoksniuose.`,
    whoScheme: "Kurio elemento atomo elektroninės sandaros schema čia pavaizduota?",
    outer: nom => `Kiek elektronų yra elemento <b>${nom}</b> atomo išoriniame sluoksnyje?`,
    nShells: nom => `Keliuose sluoksniuose išsidėstę elemento <b>${nom}</b> atomo elektronai?`,
    whichCfg: gen => `Kaip elektronai pasiskirstę <b>${gen}</b> atomo sluoksniuose?`,
    findErr: gen => `Pameistrys nupiešė <b>${gen}</b> atomo elektroninės sandaros schemą. Ar ji teisinga?`,
    samePair: "Kurios poros elementų atomai išoriniame sluoksnyje turi vienodą elektronų skaičių?",
    tapCfg: c => `Paliesk elementą, kurio atomo elektronų pasiskirstymas sluoksniuose yra <b>${cfgT(c)}</b>.`,
    tapPG: (per, grp) => `Paliesk elementą, kuris yra <b>${per} periode</b>, <b>${GRP[grp]} grupėje</b>.`,
    tapSO: (s, o) => `Paliesk elementą, kurio atomas turi <b>${sl(s)}</b>, o išoriniame sluoksnyje – <b>${el(o)}</b>.`,
    tapRel: (a, b) => `Paliesk elementą, kuris yra tame pačiame periode kaip <b>${a}</b> ir toje pačioje grupėje kaip <b>${b}</b>.`,
    tapMass: (A, n) => `Paliesk elementą, kurio atomo masės skaičius <b>${A}</b>, o branduolyje yra <b>${neN(n)}</b>.`,
    posToShell: (nom, per, grp) => `Elementas <b>${nom}</b> yra ${per} periode, ${GRP[grp]} grupėje. Ką tai pasako apie jo atomą?`,
    similar: gen => `Kurio elemento savybės panašiausios į <b>${gen}</b> savybes?`,
    metal: "Kuris iš šių elementų yra metalas?",
    nonmetal: "Kuris iš šių elementų yra nemetalas?",
    iso: (gen, A) => `Užsakymas: nukalk <b>${gen}</b> izotopą, kurio masės skaičius <b>${A}</b>.`,
    isoOf: nuc => `Kuris atomas yra atomo ${nuc} izotopas?`,
    isoPair: "Kurioje poroje abu atomai yra to paties elemento izotopai?",
    isoDiff: (a, b) => `Kuo skiriasi izotopų ${a} ir ${b} atomai?`,
    isoN: (a, b) => `Kiek neutronų daugiau turi ${b} atomas negu ${a} atomas?`,
    isoWho: (p, n) => `Atomo branduolyje yra ${prN(p)} ir ${neN(n)}. Kuris tai izotopas?`,
    abund: (gen, ar, a, b) => `${gen[0].toUpperCase() + gen.slice(1)} santykinė atominė masė – ${ar}. Gamtoje dažniausi du jo izotopai: ${a} ir ${b}. Kurio izotopo atomų gamtoje daugiau?`,
    arCalc: (nom, parts) => `Tarkime, gamtoje esantį elementą <b>${nom}</b> sudaro: ${parts}. Kokia apytikslė jo santykinė atominė masė?`,
    arPart: (pct, nuc) => `${dec(pct)} % atomų ${nuc}`,
    ion: nuc => `Užsakymas: nukalk joną ${nuc}. Sudėk reikiamą protonų, neutronų ir elektronų skaičių.`,
    ionShells: ion => `Užsakymas: paskirstyk jono ${ion} elektronus sluoksniuose.`,
    ionE: ion => `Kiek elektronų turi jonas ${ion}?`,
    whoPart: (p, e) => `Dalelėje yra ${prN(p)} ir ${elN(e)}. Kuri tai dalelė?`,
    whoPartFig: "Kuri dalelė čia pavaizduota?",
    howIon: (gen, ion) => `Kaip ${gen} atomas virsta jonu ${ion}?`,
    whichIon: (nom, grp) => `Elementas <b>${nom}</b> yra ${GRP[grp]} grupėje. Kokiu jonu virsta jo atomas?`,
    sameAs: gen => `Kuris jonas turi tiek pat elektronų, kiek <b>${gen}</b> atomas?`
  },
  atomOf: s => `${s} atomas`, ionOf: s => `${s} jonas`,
  o: {
    shellOuter: (s, o) => `${sl(s)}, išoriniame sluoksnyje – ${el(o)}`,
    errNone: "Schema teisinga",
    err1: "Ne – pirmame sluoksnyje per daug elektronų",
    err2: "Ne – antrame sluoksnyje per daug elektronų",
    errTot: "Ne – elektronų skaičius nelygus protonų skaičiui",
    errGap: "Ne – naujas sluoksnis pradėtas, nors ankstesnis dar neužpildytas",
    dN: "Neutronų skaičiumi", dP: "Protonų skaičiumi", dE: "Elektronų skaičiumi", dS: "Elektronų sluoksnių skaičiumi",
    both: "Abiejų po lygiai",
    gives: n => `Atiduoda ${el(n)}`, takes: n => `Prisijungia ${el(n)}`,
    givesP: n => `Atiduoda ${pr(n)}`, takesP: n => `Prisijungia ${pr(n)}`
  },

  /* ---------- paaiškinimai ---------- */
  w: {
    build: (nuc, z, A, e, q) => ({
      body: `${nuc}: protonų ${z}, neutronų ${A} − ${z} = ${A - z}, elektronų ${e}.`,
      more: `<p>Apatinis skaičius prie simbolio – protonų skaičius (${z}), viršutinis – masės skaičius (${A}).</p><p>Masės skaičius = protonai + neutronai, todėl neutronų yra ${A} − ${z} = ${A - z}.</p>` +
        (q ? `<p>Jono krūvis ${q > 0 ? q + "+" : -q + "−"}: atomas ${q > 0 ? "atidavė " + el(q) : "prisijungė " + el(-q)}, todėl elektronų ${z} ${q > 0 ? "−" : "+"} ${Math.abs(q)} = ${e}. Protonų skaičius nepasikeitė.</p>` : `<p>Atomas neutralus: elektronų tiek pat, kiek protonų – ${z}.</p>`)
    }),
    count: (kind, z, A) => ({
      body: [`Protonų yra ${z} – tai apatinis skaičius prie simbolio.`, `Neutronų yra ${A} − ${z} = ${A - z}.`, `Elektronų yra ${z} – tiek pat, kiek protonų.`][kind],
      more: [`Protonų skaičius lygus elemento numeriui periodinėje elementų sistemoje. Viršutinis skaičius (${A}) – masės skaičius, o ne protonų skaičius.`,
        `Masės skaičius (${A}) = protonai + neutronai. Protonų yra ${z}, todėl neutronų – ${A} − ${z} = ${A - z}.`,
        `Atomas neutralus, todėl elektronų tiek pat, kiek protonų (${z}). Masės skaičius (${A}) elektronų skaičiaus neparodo.`][kind]
    }),
    readAtom: (nuc, z, n) => ({ body: `Tai ${nuc}: ${prN(z)} – toks elemento numeris; masės skaičius ${z} + ${n} = ${z + n}.`, more: `Apačioje rašomas protonų skaičius, viršuje – masės skaičius (protonai + neutronai). Simbolį parodo protonų skaičius.` }),
    massOf: (p, n) => ({ body: `Masės skaičius = protonai + neutronai = ${p} + ${n} = ${p + n}.`, more: `Elektronai į masės skaičių neįskaičiuojami.` }),
    whichEl: (A, n, nom, s) => ({ body: `Protonų yra ${A} − ${n} = ${A - n}. ${A - n} numeris periodinėje elementų sistemoje – ${nom} (${s}).`, more: `Elementą parodo protonų skaičius: masės skaičius − neutronai = protonai.` }),
    stmt: (t, fixes) => ({ body: t, more: `<p>Kiti teiginiai klaidingi:</p><ul>${fixes.map(x => `<li>${x}</li>`).join("")}</ul>` }),
    shells: (gen, z, c, ion) => ({
      body: `${ion ? "Jonas " + ion : gen[0].toUpperCase() + gen.slice(1) + " atomas"} turi ${el(z)}: ${cfgLong(c)}. Schema: ${cfgT(c)}.`,
      more: `<p>Elektronai sluoksnius pildo nuo branduolio: pirmame telpa 2, antrame – 8. Kai trečiame yra 8 elektronai, pradedamas pildyti ketvirtas (kalis, kalcis).</p>`
    }),
    whoScheme: (c, z, nom) => ({ body: `Schemoje ${c.join(" + ")} = ${z} ${pl(z, ["elektronas", "elektronai", "elektronų"])}, vadinasi, ir ${prN(z)}. Tai ${nom}.`, more: `Atome elektronų tiek pat, kiek protonų, o protonų skaičius – elemento numeris periodinėje elementų sistemoje.` }),
    outer: (nom, c) => ({ body: `${cfgT(c)} – išoriniame (${c.length}-ame) sluoksnyje yra ${elN(c[c.length - 1])}.`, more: `Išorinis sluoksnis – toliausiai nuo branduolio esantis sluoksnis, kuriame yra elektronų.` }),
    nShells: (nom, c, per) => ({ body: `${cfgT(c)} – elektronai išsidėstę ${c.length} ${pl(c.length, ["sluoksnyje", "sluoksniuose", "sluoksnių"])}.`, more: `Sluoksnių skaičius sutampa su periodo numeriu: ${nom} yra ${per} periode.` }),
    whichCfg: (gen, z, c) => ({ body: `${gen[0].toUpperCase() + gen.slice(1)} atomas turi ${el(z)}: ${cfgT(c)}.`, more: `Pirmame sluoksnyje telpa 2 elektronai, antrame – 8. Kai trečiame yra 8, pradedamas pildyti ketvirtas sluoksnis. Elektronų suma turi būti lygi protonų skaičiui (${z}).` }),
    findErr: (kind, z, c, bad) => ({
      body: kind === "none" ? `Schema teisinga: ${cfgT(c)}, iš viso ${el(z)}.` : `Teisinga schema – ${cfgT(c)}, o nupiešta ${cfgT(bad)}.`,
      more: { none: `Pirmame sluoksnyje 2, antrame ne daugiau kaip 8, elektronų suma lygi protonų skaičiui (${z}).`,
        e1: "Pirmame sluoksnyje telpa tik 2 elektronai.", e2: "Antrame sluoksnyje telpa tik 8 elektronai.",
        tot: `Atome elektronų turi būti tiek pat, kiek protonų (${z}), o schemoje jų ${bad ? bad.reduce((a, b) => a + b, 0) : ""}.`,
        gap: "Kitas sluoksnis pradedamas pildyti tik tada, kai ankstesnis užpildytas." }[kind]
    }),
    samePair: (a, b, o, grp) => ({ body: `${a} ir ${b} – abu išoriniame sluoksnyje turi po ${el(o)}.`, more: `Jie yra toje pačioje ${GRP[grp]} grupėje. Vienos grupės elementų atomų išoriniuose sluoksniuose elektronų skaičius vienodas.` }),
    tapCfg: (c, z, nom, s) => ({ body: `${c.join(" + ")} = ${z}, tai ${z}-as elementas – ${nom} (${s}).`, more: `Sluoksnių yra ${c.length} – tai ${c.length} periodas.` }),
    tapPG: (per, grp, nom, s) => ({ body: `${per} periodo ir ${GRP[grp]} grupės susikirtime yra ${nom} (${s}).`, more: `Periodai – eilutės, grupės – stulpeliai.` }),
    tapSO: (sN, o, nom, s, per, grp) => ({ body: `${sN} ${pl(sN, ["sluoksnis", "sluoksniai", "sluoksnių"])} – ${per} periodas; ${elN(o)} išoriniame sluoksnyje – ${GRP[grp]} grupė. Tai ${nom} (${s}).`, more: `Periodo numeris parodo sluoksnių skaičių, o A grupės numeris – išorinio sluoksnio elektronų skaičių (išimtis – helis: jo atome tik 2 elektronai).` }),
    tapRel: (per, grp, nom, s) => ({ body: `Tai ${per} periodas ir ${GRP[grp]} grupė – ${nom} (${s}).`, more: `Periodai – eilutės, grupės – stulpeliai.` }),
    tapMass: (A, n, nom, s) => ({ body: `Protonų: ${A} − ${n} = ${A - n}. ${A - n}-as elementas – ${nom} (${s}).`, more: `Masės skaičius = protonai + neutronai.` }),
    posToShell: (per, grp, o) => ({ body: `${per} periodas – ${sl(per)}; ${GRP[grp]} grupė – išoriniame sluoksnyje ${el(o)}.`, more: `Periodo numeris parodo sluoksnių skaičių, o A grupės numeris – išorinio sluoksnio elektronų skaičių.` }),
    similar: (a, b, grp) => ({ body: `${b[0].toUpperCase() + b.slice(1)} – toje pačioje ${GRP[grp]} grupėje kaip ir ${a}.`, more: `Vienos grupės elementai turi panašias savybes, nes jų atomų išoriniuose sluoksniuose elektronų skaičius vienodas.` }),
    metal: (nom, isM) => ({ body: `${nom[0].toUpperCase() + nom.slice(1)} – ${isM ? "metalas" : "nemetalas"}.`, more: `Iš pirmųjų 20 elementų metalai yra litis, berilis, natris, magnis, aliuminis, kalis ir kalcis – jie yra periodų pradžioje (kairėje). Nemetalai – dešinėje, taip pat vandenilis.` }),
    iso: (gen, z, A) => ({ body: `${gen[0].toUpperCase() + gen.slice(1)} atome visada ${prN(z)}; neutronų ${A} − ${z} = ${A - z}; elektronų ${z}.`, more: `Izotopai – to paties elemento atomai: protonų skaičius vienodas, skiriasi tik neutronų skaičius ir masės skaičius.` }),
    isoOf: (a, b) => ({ body: `${b} – tas pats elementas (tiek pat protonų), bet kitas masės skaičius.`, more: `Izotopų protonų skaičius vienodas, skiriasi neutronų skaičius. Atomai su vienodu masės skaičiumi, bet skirtingu protonų skaičiumi yra skirtingų elementų atomai.` }),
    isoDiff: (a, b, na, nb) => ({ body: `Skiriasi neutronų skaičius: ${a} turi ${ne(na)}, o ${b} – ${ne(nb)}.`, more: `Protonų ir elektronų skaičius, elektronų sluoksnių skaičius izotopų atomuose vienodi.` }),
    isoN: (a, b, z, A1, A2) => ({ body: `${A2} − ${A1} = ${A2 - A1}. Protonų abiejuose atomuose po ${z}, todėl skiriasi tik neutronai.`, more: `${a}: ${A1} − ${z} = ${A1 - z} neutr.; ${b}: ${A2} − ${z} = ${A2 - z} neutr.` }),
    isoWho: (p, n, nuc) => ({ body: `${prN(p)} – tai nurodo elementą; masės skaičius ${p} + ${n} = ${p + n}. Tai ${nuc}.`, more: `Elementą parodo protonų skaičius, o izotopą – masės skaičius.` }),
    abund: (ar, A, nuc) => ({ body: `Santykinė atominė masė ${ar} artimesnė skaičiui ${A}, todėl daugiau yra ${nuc} atomų.`, more: `Santykinė atominė masė apskaičiuojama atsižvelgiant į elemento izotopų paplitimą gamtoje: kurio izotopo daugiau, to masės skaičiui ji ir artimesnė.` }),
    arCalc: (calc, ans) => ({ body: `${calc} ≈ ${ans}.`, more: `Kiekvieno izotopo masės skaičius dauginamas iš jo dalies (procentai : 100) ir sandaugos sudedamos. Rezultatas artimesnis to izotopo masės skaičiui, kurio gamtoje daugiau.` }),
    ionE: (ion, z, q, e) => ({ body: `${ion}: protonų ${z}, krūvis ${q > 0 ? q + "+" : -q + "−"}, todėl elektronų ${z} ${q > 0 ? "−" : "+"} ${Math.abs(q)} = ${e}.`, more: `Teigiamąjį krūvį turintis jonas elektronų turi mažiau negu protonų (atomas elektronus atidavė), neigiamąjį – daugiau (atomas elektronus prisijungė).` }),
    whoPart: (p, e, name) => ({ body: p === e ? `Protonų ir elektronų po lygiai (${p}) – tai neutralus atomas: ${name}.` : `${prN(p)} – tai nurodo elementą. Elektronų ${e > p ? "daugiau" : "mažiau"} ${Math.abs(p - e)} – krūvis ${p > e ? (p - e) + "+" : (e - p) + "−"}. Tai ${name}.`, more: `Elementą parodo protonų skaičius. Krūvis = protonų skaičius − elektronų skaičius.` }),
    howIon: (ion, q, z) => ({ body: q > 0 ? `Atomas atiduoda ${el(q)}: lieka ${z} p⁺ ir ${z - q} e⁻ – krūvis ${q}+.` : `Atomas prisijungia ${el(-q)}: yra ${z} p⁺ ir ${z - q} e⁻ – krūvis ${-q}−.`, more: `Atomui virstant jonu keičiasi tik elektronų skaičius. Protonų skaičius branduolyje nesikeičia – kitaip tai būtų kito elemento atomas.` }),
    whichIon: (grp, ion, q) => ({
      body: q > 0 ? `${GRP[grp]} grupės metalo atomas išoriniame sluoksnyje turi ${el(q)} ir ${q === 1 ? "jį" : "juos"} atiduoda – susidaro ${ion}.` : `${GRP[grp]} grupės nemetalo atomui iki 8 elektronų išoriniame sluoksnyje trūksta ${-q} – tiek jis ir prisijungia. Susidaro ${ion}.`,
      more: `Metalų atomai, virsdami jonais, elektronus atiduoda (krūvis +), nemetalų – prisijungia (krūvis −).`
    }),
    sameAs: (ion, e, gen) => ({ body: `${ion} turi ${el(e)} – tiek pat, kiek ${gen} atomas.`, more: `Elektronų skaičius jone = protonų skaičius − krūvis. Pvz., Na⁺: 11 − 1 = 10; Cl⁻: 17 + 1 = 18.` })
  },

  /* ---------- teiginiai: [teisingi], [klaidingas, pataisymas] ---------- */
  stmts: [
    { t: ["Atomo branduolyje yra protonai ir neutronai.", "Elektronai juda aplink atomo branduolį.", "Atomas neutralus, nes jame protonų ir elektronų yra po lygiai.",
        "Masės skaičius lygus protonų ir neutronų skaičių sumai.", "Protonų skaičius parodo, kuris tai cheminis elementas.",
        "Protonas turi teigiamąjį krūvį, elektronas – neigiamąjį, o neutronas krūvio neturi.", "To paties cheminio elemento visų atomų branduoliuose protonų skaičius vienodas.",
        "Neutronų skaičius randamas iš masės skaičiaus atėmus protonų skaičių."],
      f: [["Atomo branduolyje yra protonai ir elektronai.", "Branduolyje yra protonai ir neutronai, o elektronai juda aplink branduolį."],
        ["Neutronai juda aplink atomo branduolį.", "Aplink branduolį juda elektronai; neutronai yra branduolyje."],
        ["Masės skaičius lygus protonų ir elektronų skaičių sumai.", "Masės skaičius = protonai + neutronai."],
        ["Atome neutronų visada yra tiek pat, kiek protonų.", "Nebūtinai: natrio atome (masės skaičius 23) yra 11 protonų ir 12 neutronų."],
        ["Neutronas turi neigiamąjį krūvį.", "Neutronas krūvio neturi; neigiamąjį krūvį turi elektronas."],
        ["Elektronas turi teigiamąjį krūvį.", "Elektrono krūvis neigiamasis; teigiamąjį krūvį turi protonas."],
        ["Atomas neutralus, nes jame protonų ir neutronų yra po lygiai.", "Atomas neutralus, nes po lygiai yra protonų ir elektronų."],
        ["Neutronų skaičius parodo, kuris tai cheminis elementas.", "Elementą parodo protonų skaičius."],
        ["Masės skaičius parodo, kiek elektronų yra atome.", "Elektronų atome tiek, kiek protonų; masės skaičius = protonai + neutronai."],
        ["Skirtingų cheminių elementų atomai gali turėti vienodą protonų skaičių.", "Kiekvieno elemento protonų skaičius savas – jis ir nurodo elementą."]] },
    { t: ["Pirmame elektronų sluoksnyje telpa ne daugiau kaip 2 elektronai.", "Antrame elektronų sluoksnyje telpa ne daugiau kaip 8 elektronai.",
        "Elektronai pirmiausia užpildo arčiausiai branduolio esantį sluoksnį.", "Kalio atomo devynioliktas elektronas yra ketvirtame sluoksnyje.",
        "Neono atomo abu elektronų sluoksniai užpildyti: 2, 8.", "Atome elektronų visuose sluoksniuose iš viso yra tiek, kiek protonų branduolyje."],
      f: [["Pirmame elektronų sluoksnyje telpa 8 elektronai.", "Pirmame sluoksnyje telpa tik 2 elektronai."],
        ["Antrame elektronų sluoksnyje telpa ne daugiau kaip 2 elektronai.", "Antrame sluoksnyje telpa 8 elektronai."],
        ["Elektronai pirmiausia užpildo toliausiai nuo branduolio esantį sluoksnį.", "Sluoksniai pildomi nuo branduolio."],
        ["Visuose sluoksniuose telpa po 2 elektronus.", "2 elektronai telpa tik pirmame sluoksnyje, antrame – 8."],
        ["Kalio atomo visi 19 elektronų išsidėstę trijuose sluoksniuose.", "Kalio schema – 2, 8, 8, 1: keturi sluoksniai."],
        ["Ličio atomo visi 3 elektronai yra pirmame sluoksnyje.", "Pirmame sluoksnyje telpa tik 2, todėl ličio schema – 2, 1."],
        ["Elektronų sluoksnių skaičius atome visada lygus elektronų skaičiui.", "Pvz., natrio atome 11 elektronų, o sluoksnių tik 3."]] },
    { t: ["To paties periodo elementų atomai turi vienodą elektronų sluoksnių skaičių.", "1 (IA) grupės elementų atomai išoriniame sluoksnyje turi po 1 elektroną.",
        "17 (VIIA) grupės elementų atomai išoriniame sluoksnyje turi po 7 elektronus.", "Periodo numeris parodo, kiek elektronų sluoksnių turi to periodo elementų atomai.",
        "Vienos grupės elementai turi panašias savybes.", "Periodinėje elementų sistemoje elementai išdėstyti protonų skaičiaus didėjimo tvarka.",
        "Trečiame periode metalai (Na, Mg, Al) yra kairėje, o nemetalai (P, S, Cl, Ar) – dešinėje."],
      f: [["To paties periodo elementų atomai išoriniame sluoksnyje turi vienodą elektronų skaičių.", "Vienodas išorinių elektronų skaičius – tos pačios grupės, o ne periodo elementų."],
        ["Tos pačios grupės elementų atomai turi vienodą elektronų sluoksnių skaičių.", "Vienodas sluoksnių skaičius – to paties periodo elementų."],
        ["Periodo numeris parodo, kiek elektronų yra išoriniame sluoksnyje.", "Periodo numeris parodo sluoksnių skaičių."],
        ["Periodinėje elementų sistemoje elementai išdėstyti neutronų skaičiaus didėjimo tvarka.", "Elementai išdėstyti protonų skaičiaus didėjimo tvarka."],
        ["Panašiausios savybės – to paties periodo gretimų elementų.", "Panašias savybes turi vienos grupės elementai."],
        ["17 (VIIA) grupės elementų atomai išoriniame sluoksnyje turi po 1 elektroną.", "17 (VIIA) grupės – po 7 elektronus; po 1 – 1 (IA) grupės."],
        ["Trečiame periode metalai yra dešinėje, o nemetalai – kairėje.", "Atvirkščiai: metalai kairėje, nemetalai dešinėje."],
        ["Trečio periodo elementų atomai turi po 2 elektronų sluoksnius.", "Trečio periodo – po 3 sluoksnius."]] },
    { t: ["Izotopai – to paties cheminio elemento atomai, kurių branduoliuose skiriasi neutronų skaičius.", "To paties elemento izotopų branduoliuose protonų skaičius vienodas.",
        "To paties elemento izotopų masės skaičiai skiriasi.", "To paties elemento izotopų atomai turi vienodą elektronų skaičių.",
        "Santykinė atominė masė apskaičiuojama atsižvelgiant į elemento izotopų paplitimą gamtoje."],
      f: [["Izotopai – skirtingų cheminių elementų atomai, kurių masės skaičius vienodas.", "Izotopai – to paties elemento atomai."],
        ["To paties elemento izotopų branduoliuose protonų skaičius skirtingas.", "Protonų skaičius vienodas – juk tai tas pats elementas."],
        ["To paties elemento izotopų branduoliuose neutronų skaičius vienodas.", "Būtent neutronų skaičiumi izotopai ir skiriasi."],
        ["To paties elemento izotopų atomai turi skirtingą elektronų skaičių.", "Elektronų tiek pat, kiek protonų, – vienodai."],
        ["To paties elemento izotopų masės skaičiai vienodi.", "Masės skaičiai skiriasi, nes skiriasi neutronų skaičius."],
        ["To paties elemento izotopai periodinėje elementų sistemoje užima skirtingus langelius.", "Jie yra tame pačiame langelyje – protonų skaičius vienodas."]] },
    { t: ["Atomas, atidavęs elektroną, virsta teigiamąjį krūvį turinčiu jonu.", "Atomas, prisijungęs elektroną, virsta neigiamąjį krūvį turinčiu jonu.",
        "Atomui virstant jonu, protonų skaičius branduolyje nesikeičia.", "Jone protonų ir elektronų skaičius nevienodas.",
        "1 (IA) grupės metalų atomai, virsdami jonais, atiduoda po 1 elektroną.", "17 (VIIA) grupės nemetalų atomai, virsdami jonais, prisijungia po 1 elektroną."],
      f: [["Atomas, atidavęs elektroną, virsta neigiamąjį krūvį turinčiu jonu.", "Atidavus elektroną, protonų lieka daugiau – krūvis teigiamasis."],
        ["Atomas virsta jonu, kai pasikeičia protonų skaičius jo branduolyje.", "Keičiasi tik elektronų skaičius."],
        ["Jone protonų ir elektronų yra po lygiai.", "Po lygiai jų yra atome; jone – nevienodai."],
        ["1 (IA) grupės metalų atomai, virsdami jonais, prisijungia po 1 elektroną.", "Jie atiduoda po 1 elektroną."],
        ["17 (VIIA) grupės nemetalų atomai, virsdami jonais, atiduoda po 7 elektronus.", "Jie prisijungia po 1 elektroną."],
        ["Atomui virstant jonu, pasikeičia neutronų skaičius.", "Neutronų skaičius nesikeičia – keičiasi tik elektronų skaičius."],
        ["Jone Na⁺ elektronų daugiau negu protonų.", "Na⁺: 11 protonų ir 10 elektronų – elektronų mažiau."]] }
  ],

  /* ---------- „Noriu pasimokyti“ ---------- */
  learn: [
    { name: "Atomo sandara", level: 0, html: `<p>Atomą sudaro <b>branduolys</b> ir aplink jį judantys <b>elektronai</b> (e⁻). Branduolyje yra <b>protonai</b> (p⁺) ir <b>neutronai</b> (n⁰).</p>
      <ul><li>Protonas turi teigiamąjį krūvį, elektronas – neigiamąjį, neutronas krūvio neturi.</li><li>Atomas neutralus: elektronų tiek pat, kiek protonų.</li><li>Protonų skaičius parodo, kuris tai elementas – jis lygus elemento numeriui periodinėje elementų sistemoje.</li></ul>` },
    { name: "Užrašas su masės skaičiumi", level: 0, html: `<p>Prie elemento simbolio rašomi du skaičiai: <b>viršuje – masės skaičius</b> (protonai + neutronai), <b>apačioje – protonų skaičius</b>.</p>
      <span class="mk-ex"><span class="nuc"><span class="ix"><sup>23</sup><sub>11</sub></span>Na</span>: protonų 11, neutronų 23 − 11 = 12, elektronų 11.</span><p>Neutronų skaičius = masės skaičius − protonų skaičius.</p>` },
    { name: "Elektronų sluoksniai", level: 1, html: `<p>Elektronai aplink branduolį išsidėstę <b>sluoksniais</b>. Sluoksniai pildomi nuo branduolio:</p>
      <ul><li>pirmame sluoksnyje telpa 2 elektronai;</li><li>antrame – 8;</li><li>kai trečiame yra 8 elektronai, pradedamas pildyti ketvirtas (kalis ir kalcis).</li></ul>
      <span class="mk-ex">Fosforas (15 elektronų): 2, 8, 5. Kalcis (20 elektronų): 2, 8, 8, 2.</span><p>Toks užrašas arba piešinys vadinamas elektroninės sandaros schema.</p>` },
    { name: "Periodai ir grupės", level: 2, html: `<p>Periodinėje elementų sistemoje elementai išdėstyti protonų skaičiaus didėjimo tvarka. Eilutės vadinamos <b>periodais</b>, stulpeliai – <b>grupėmis</b>.</p>
      <ul><li>Periodo numeris parodo, kiek elektronų sluoksnių turi atomas.</li><li>A grupės numeris parodo, kiek elektronų yra išoriniame sluoksnyje (išimtis – helis: jo atome tik 2 elektronai).</li><li>Vienos grupės elementai turi panašias savybes.</li><li>Metalai yra periodų pradžioje (kairėje), nemetalai – dešinėje.</li></ul>
      <span class="mk-ex">Siera: 3 periodas, 16 (VIA) grupė → 3 sluoksniai, išoriniame – 6 elektronai: 2, 8, 6.</span>` },
    { name: "Izotopai ir santykinė atominė masė", level: 3, html: `<p><b>Izotopai</b> – to paties elemento atomai, kurių branduoliuose protonų skaičius vienodas, o neutronų – skirtingas. Todėl skiriasi ir jų masės skaičiai.</p>
      <span class="mk-ex"><span class="nuc"><span class="ix"><sup>35</sup><sub>17</sub></span>Cl</span> – 18 neutronų, <span class="nuc"><span class="ix"><sup>37</sup><sub>17</sub></span>Cl</span> – 20 neutronų. Protonų abiejuose po 17.</span>
      <p><b>Santykinė atominė masė</b> apskaičiuojama atsižvelgiant į izotopų paplitimą gamtoje. Jei chloro atomų su masės skaičiumi 35 yra apie 75 %, o su 37 – apie 25 %, tai 35 · 0,75 + 37 · 0,25 = 35,5.</p>` },
    { name: "Jonai", level: 4, html: `<p>Atomas, atidavęs arba prisijungęs elektronų, virsta <b>jonu</b>. Protonų skaičius nesikeičia.</p>
      <ul><li>Atidavė elektronų – protonų daugiau – krūvis teigiamasis: Na⁺, Mg²⁺.</li><li>Prisijungė elektronų – elektronų daugiau – krūvis neigiamasis: Cl⁻, O²⁻.</li><li>1 (IA) grupės metalų atomai atiduoda po 1 elektroną, 17 (VIIA) grupės nemetalų atomai prisijungia po 1 elektroną.</li></ul>
      <span class="mk-ex">Na (2, 8, 1) → Na⁺ (2, 8): 11 p⁺ ir 10 e⁻.<br>Cl (2, 8, 7) → Cl⁻ (2, 8, 8): 17 p⁺ ir 18 e⁻.</span>` }
  ]
};
})();
