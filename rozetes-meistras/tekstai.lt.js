/* MokomėsKartu.lt – „Rozetės meistras“ (9 kl., matematika): visi mokiniui rodomi tekstai. */
(function(){
"use strict";
const cO = "O – apskritimo centras.";
const fr = (a, b) => `<span class="mk-fr" aria-label="${a} iš ${b}"><span>${a}</span><span>${b}</span></span>`;
const ex = s => `<span class="ex">${s}</span>`;
/* taisyklės (užuominoms ir teorijai) */
const R = {
  c: "Centrinis kampas lygus lankui, į kurį jis remiasi.",
  full: "Visi centriniai kampai aplink centrą kartu sudaro 360°.",
  iso: "Spinduliai lygūs, todėl trikampis, kurio dvi kraštinės – spinduliai, yra lygiašonis: kampai prie pagrindo lygūs.",
  i: "Įbrėžtinis kampas lygus pusei centrinio kampo, kuris remiasi į tą patį lanką (pusei to lanko).",
  same: "Įbrėžtiniai kampai, kurie remiasi į tą patį lanką, yra lygūs.",
  d: "Įbrėžtinis kampas, kuris remiasi į skersmenį, yra status: 180° : 2 = 90°.",
  t: "Liestinė statmena spinduliui, nubrėžtam į lietimosi tašką.",
  tt: "Iš vieno taško nubrėžtų liestinių atkarpos iki lietimosi taškų yra lygios.",
  ch: "Susikertančių stygų atkarpų sandaugos lygios: AE · EB = CE · ED.",
  quad: "Keturkampyje OAPB du kampai statūs (liestinė statmena spinduliui), o keturkampio kampų suma – 360°."
};
const SEG = { a: "AE", b: "EB", c: "CE", d: "ED" };

const tasks = {
  /* ---------- 1 lygis: centrinis kampas ir lankas ---------- */
  c1: p => ({ q: `${cO} Centrinis kampas AOB lygus ${p.a}°. Kiek laipsnių turi lankas AB, į kurį jis remiasi (x)?`, hint: R.c,
    why: `Centrinis kampas lygus lankui, į kurį jis remiasi: lankas AB = ∠AOB = ${p.a}°.` }),
  c1b: p => ({ q: `${cO} ∠AOB = ${p.a}°. Kiek laipsnių turi didesnysis lankas ACB (x)?`, hint: "Mažesnysis lankas AB lygus centriniam kampui, o visas apskritimas turi 360°.",
    why: `Mažesnysis lankas AB = ${p.a}° (lygus centriniam kampui). Visas apskritimas turi 360°, todėl lankas ACB = 360° − ${p.a}° = ${360 - p.a}°.` }),
  c2: p => ({ q: `${cO} Lankas AB turi ${p.a}°. Rask centrinį kampą AOB (x).`, hint: R.c,
    why: `Centrinis kampas lygus lankui, į kurį jis remiasi: x = ${p.a}°.` }),
  c3: p => ({ q: `${cO} Spinduliai dalija skritulį į ${p.n} išpjovas. Rask centrinį kampą x.`, hint: R.full,
    why: `Centriniai kampai aplink tašką O kartu sudaro 360°: x = 360° − ${p.g.length > 1 ? "(" + p.g.join("° + ") + "°)" : p.g[0] + "°"} = ${p.x}°.` }),
  c4: p => ({ q: `${cO} AB – skersmuo, ∠AOC = ${p.a}°. Rask kampą COB (x).`, hint: "Skersmuo eina per centrą, todėl kampas AOB ištiestinis – 180°.",
    why: `AB – skersmuo, todėl kampai AOC ir COB kartu sudaro 180°: x = 180° − ${p.a}° = ${180 - p.a}°.` }),
  c5: p => ({ q: `${cO} ∠AOB = ${p.a}°. Rask kampą OAB (x).`, hint: R.iso,
    why: `OA = OB (spinduliai), todėl trikampis AOB lygiašonis: ∠OAB = ∠OBA. x = (180° − ${p.a}°) : 2 = ${(180 - p.a) / 2}°.` }),
  c6: p => ({ q: `${cO} ∠OAB = ${p.b}°. Rask centrinį kampą AOB (x).`, hint: R.iso,
    why: `OA = OB (spinduliai), todėl ∠OBA = ∠OAB = ${p.b}°. x = 180° − 2 · ${p.b}° = ${180 - 2 * p.b}°.` }),
  c7: p => ({ q: `${cO} Taškai dalija apskritimą į ${p.n} lygių lankų. Rask kampą AOB (x).`, hint: "Pirmiausia rask vieno lanko didumą: 360° padalyk iš lankų skaičiaus.",
    why: `Vienas lankas: 360° : ${p.n} = ${p.u}°.${p.k > 1 ? ` Lanką AB sudaro ${p.k} tokie lankai: ${p.k} · ${p.u}° = ${p.v}°.` : ""} Centrinis kampas lygus lankui: x = ${p.v}°.` }),
  c8: p => ({ q: `${cO} Taškai dalija apskritimą į ${p.n} lygių lankų. Rask kampą OAB (x).`, hint: "Pirmiausia rask centrinį kampą AOB, tada pasinaudok tuo, kad OA = OB.",
    why: `Vienas lankas: 360° : ${p.n} = ${p.u}°${p.k > 1 ? `, lankas AB = ${p.k} · ${p.u}° = ${p.v}°` : ""}, todėl ∠AOB = ${p.v}°. Trikampis AOB lygiašonis (OA = OB): x = (180° − ${p.v}°) : 2 = ${(180 - p.v) / 2}°.` }),
  c9: p => ({ q: `${cO} Lankas AB turi ${p.a}°, lankas BC – ${p.b}°. Rask kampą AOC (x).`, hint: "Trys lankai kartu sudaro visą apskritimą – 360°.",
    why: `Lankas AC = 360° − ${p.a}° − ${p.b}° = ${p.x}°. Centrinis kampas AOC lygus šiam lankui: x = ${p.x}°.` }),
  c10: p => ({ q: `${cO} Nuspalvinta išpjova AOB sudaro ${fr(p.k, p.n)} skritulio. Rask jos centrinį kampą x.`, hint: "Visą skritulį atitinka 360° kampas. Rask tokią pat jo dalį.",
    why: `Visą skritulį atitinka 360°. x = 360° ${p.k > 1 ? `: ${p.n} · ${p.k}` : `: ${p.n}`} = ${p.v}°.` }),
  c11: p => ({ q: `${cO} AC – skersmuo, ∠OAB = ${p.b}°. Rask kampą BOC (x).`, hint: "Trikampis AOB lygiašonis. Kampai AOB ir BOC kartu sudaro 180°.",
    why: `OA = OB, todėl ∠OBA = ∠OAB = ${p.b}°, o ∠AOB = 180° − 2 · ${p.b}° = ${180 - 2 * p.b}°. Kampai AOB ir BOC kartu sudaro 180° (AC – skersmuo): x = 180° − ${180 - 2 * p.b}° = ${2 * p.b}°. Pastebėk: centrinis kampas BOC dvigubai didesnis už įbrėžtinį kampą BAC.` }),

  /* ---------- 2 lygis: įbrėžtinis kampas ---------- */
  i1: p => ({ q: `${cO} Centrinis kampas AOB = ${p.a}°. Rask įbrėžtinį kampą ACB (x).`, hint: R.i,
    why: `Kampai ACB ir AOB remiasi į tą patį lanką AB. Įbrėžtinis kampas lygus pusei centrinio: x = ${p.a}° : 2 = ${p.a / 2}°.` }),
  i2: p => ({ q: `${cO} Įbrėžtinis kampas ACB = ${p.a / 2}°. Rask centrinį kampą AOB (x).`, hint: R.i,
    why: `Kampai AOB ir ACB remiasi į tą patį lanką AB. Centrinis kampas dvigubai didesnis už įbrėžtinį: x = 2 · ${p.a / 2}° = ${p.a}°.` }),
  i3: p => ({ q: `Lankas AB turi ${p.a}°. Rask įbrėžtinį kampą ACB (x).`, hint: R.i,
    why: `Įbrėžtinis kampas lygus pusei lanko, į kurį jis remiasi: x = ${p.a}° : 2 = ${p.a / 2}°.` }),
  i4: p => ({ q: `Įbrėžtinis kampas ACB = ${p.a / 2}°. Kiek laipsnių turi lankas AB, į kurį jis remiasi (x)?`, hint: R.i,
    why: `Lankas dvigubai didesnis už į jį besiremiantį įbrėžtinį kampą: x = 2 · ${p.a / 2}° = ${p.a}°.` }),
  i5: p => ({ q: `Taškai A, B, C ir D yra apskritime. ∠ACB = ${p.a / 2}°. Rask kampą ADB (x).`, hint: R.same,
    why: `Kampai ACB ir ADB – įbrėžtiniai ir remiasi į tą patį lanką AB, todėl jie lygūs: x = ${p.a / 2}°.` }),
  i6: p => ({ q: `${cO} ∠AOB = ${p.a}°, taškas C yra mažesniajame lanke AB. Rask kampą ACB (x).`, hint: "Į kurį lanką remiasi kampas ACB? Ne į tą, kuriame yra pats taškas C.",
    why: `Kampas ACB remiasi į didesnįjį lanką AB: 360° − ${p.a}° = ${360 - p.a}°. Įbrėžtinis kampas lygus pusei lanko: x = ${360 - p.a}° : 2 = ${180 - p.a / 2}°.` }),
  i7: p => ({ q: `Didesnysis lankas AB turi ${360 - p.a}°. Rask kampą ACB (x).`, hint: R.i,
    why: `Kampas ACB remiasi į didesnįjį lanką AB (taškas C yra kitame lanke): x = ${360 - p.a}° : 2 = ${180 - p.a / 2}°.` }),
  i8: p => ({ q: `Trikampio ABC viršūnės yra apskritime. Lankas AB turi ${p.a}°, lankas BC – ${p.b}°. Rask kampą ABC (x).`, hint: "Kampas ABC remiasi į lanką AC, kuriame nėra taško B.",
    why: `Kampas ABC remiasi į lanką AC: 360° − ${p.a}° − ${p.b}° = ${360 - p.a - p.b}°. x = ${360 - p.a - p.b}° : 2 = ${(360 - p.a - p.b) / 2}°.` }),
  i9: p => ({ q: `Trikampio ABC viršūnės yra apskritime. ∠A = ${p.A}°, ∠B = ${p.B}°. Kiek laipsnių turi lankas AB (x)?`, hint: "Į lanką AB remiasi kampas C. Pirmiausia rask jį.",
    why: `∠C = 180° − ${p.A}° − ${p.B}° = ${p.C}°. Kampas C remiasi į lanką AB, todėl lankas dvigubai didesnis: x = 2 · ${p.C}° = ${2 * p.C}°.` }),
  i10: p => ({ q: `Trikampio ABC viršūnės yra apskritime. Lankas AB turi ${p.a}°, lankas BC – ${p.b}°. Rask kampus x ir y.`, hint: "Kiekvienas trikampio kampas remiasi į priešais jį esantį lanką.",
    why: `Kampas A (x) remiasi į lanką BC: x = ${p.b}° : 2 = ${p.b / 2}°. Kampas C (y) remiasi į lanką AB: y = ${p.a}° : 2 = ${p.a / 2}°.` }),
  i11: p => ({ q: `${cO} Taškas C yra mažesniajame lanke AB, ∠ACB = ${p.g}°. Rask centrinį kampą AOB (x).`, hint: "Kampas ACB remiasi į didesnįjį lanką AB. Rask jį, tada – mažesnįjį lanką.",
    why: `Kampas ACB remiasi į didesnįjį lanką AB, kuris turi 2 · ${p.g}° = ${2 * p.g}°. Mažesnysis lankas AB = 360° − ${2 * p.g}° = ${360 - 2 * p.g}°, o centrinis kampas AOB jam lygus: x = ${360 - 2 * p.g}°.` }),
  i13: p => ({ q: `Trikampio ABC viršūnės yra apskritime, AB = AC, ∠A = ${p.v}°. Kiek laipsnių turi lankas AB (x)?`, hint: "Į lanką AB remiasi kampas C. Trikampis lygiašonis – rask kampą C.",
    why: `Trikampis lygiašonis (AB = AC): ∠C = (180° − ${p.v}°) : 2 = ${(180 - p.v) / 2}°. Kampas C remiasi į lanką AB: x = 2 · ${(180 - p.v) / 2}° = ${180 - p.v}°.` }),
  i14: p => ({ q: `${cO} Įbrėžtinis kampas ACB = ${p.b}°. Rask kampą OAB (x).`, hint: "Pirmiausia rask centrinį kampą AOB, tada pasinaudok tuo, kad OA = OB.",
    why: `Centrinis kampas AOB = 2 · ${p.b}° = ${2 * p.b}° (remiasi į tą patį lanką AB). Trikampis AOB lygiašonis (OA = OB): x = (180° − ${2 * p.b}°) : 2 = ${90 - p.b}°.` }),

  /* ---------- 3 lygis: skersmuo ir statusis kampas ---------- */
  d1: p => ({ q: `${cO} AB – skersmuo, ∠CAB = ${p.A}°. Rask kampą ABC (x).`, hint: R.d,
    why: `Kampas ACB remiasi į skersmenį (lanką, turintį 180°), todėl ∠ACB = 180° : 2 = 90°. x = 180° − 90° − ${p.A}° = ${90 - p.A}°.` }),
  d2: p => ({ q: `${cO} AB – skersmuo, lankas BC turi ${p.t}°. Rask kampą ABC (x).`, hint: "Kampas ABC remiasi į lanką AC. Pusapskritimis turi 180°.",
    why: `Pusapskritimis turi 180°, todėl lankas AC = 180° − ${p.t}° = ${180 - p.t}°. Kampas ABC remiasi į lanką AC: x = ${180 - p.t}° : 2 = ${90 - p.t / 2}°.` }),
  d3a: p => ({ q: `${cO} AB – skersmuo, ∠CAB = ${p.A}°. Rask kampą OCB (x).`, hint: "Kampas ACB remiasi į skersmenį. Trikampis OCB lygiašonis, nes OC = OB.",
    why: `∠ACB = 90° (remiasi į skersmenį), todėl ∠ABC = 90° − ${p.A}° = ${90 - p.A}°. OC = OB (spinduliai), tad trikampis OCB lygiašonis: x = ∠OBC = ${90 - p.A}°.` }),
  d3b: p => ({ q: `${cO} AB – skersmuo, ∠OCB = ${90 - p.A}°. Rask kampą OCA (x).`, hint: R.d,
    why: `Kampas ACB remiasi į skersmenį, todėl ∠ACB = 90°. x = 90° − ${90 - p.A}° = ${p.A}°.` }),
  d4: p => ({ q: `${cO} AB – skersmuo, ∠BOC = ${p.t}°. Rask trikampio ABC kampus x ir y.`, hint: "Kampas A remiasi į tą patį lanką BC kaip ir centrinis kampas BOC. Kampas C remiasi į skersmenį.",
    why: `Kampas A (x) – įbrėžtinis, remiasi į tą patį lanką BC kaip ir centrinis kampas BOC: x = ${p.t}° : 2 = ${p.t / 2}°. ∠ACB = 90° (remiasi į skersmenį), todėl y = 90° − ${p.t / 2}° = ${90 - p.t / 2}°.` }),
  d5: p => ({ q: `${cO} AB – skersmuo, ∠CAB = ${p.A}°, ∠ABD = ${p.Bd}°. Rask kampą CBD (x).`, hint: "Kampą CBD sudaro du kampai: ABC ir ABD. Kampas ACB remiasi į skersmenį.",
    why: `∠ACB = 90° (remiasi į skersmenį), todėl ∠ABC = 90° − ${p.A}° = ${90 - p.A}°. x = ∠ABC + ∠ABD = ${90 - p.A}° + ${p.Bd}° = ${90 - p.A + p.Bd}°.` }),
  d6: p => ({ q: `${cO} AB – skersmuo, ∠CAB = ${p.A}°. Rask kampą ADB (x).`, hint: R.d,
    why: `Kampas ADB remiasi į skersmenį AB, todėl jis status: x = 90°. Kampo CAB didumo čia neprireikė.` }),
  d8: p => ({ q: `${cO} AB – skersmuo, ∠CAB = ${p.A}°. Kiek laipsnių turi lankas AC (x)?`, hint: "Kampas CAB remiasi į lanką BC. Pusapskritimis turi 180°.",
    why: `Kampas CAB remiasi į lanką BC, todėl lankas BC = 2 · ${p.A}° = ${2 * p.A}°. Pusapskritimis turi 180°: x = 180° − ${2 * p.A}° = ${180 - 2 * p.A}°.` }),
  d9: p => ({ q: `Stačiakampio ABCD viršūnės yra apskritime, O – įstrižainių susikirtimo taškas. ∠CAB = ${p.b}°. Rask kampą AOB (x).`, hint: "Status įbrėžtinis kampas remiasi į skersmenį, todėl įstrižainės – skersmenys, o OA = OB.",
    why: `Stačiakampio kampas ABC status, o status įbrėžtinis kampas remiasi į skersmenį – todėl AC yra skersmuo, O – apskritimo centras. OA = OB (spinduliai), tad ∠OBA = ∠OAB = ${p.b}°. x = 180° − 2 · ${p.b}° = ${180 - 2 * p.b}°.` }),
  d10: p => ({ q: `${cO} AB – skersmuo, styga BC lygi spinduliui. Rask kampą ${p.w ? "CAB" : "ABC"} (x).`, hint: "Sujunk O su C. Koks trikampis OBC, jei visos jo kraštinės lygios spinduliui?",
    why: `OB = OC = BC, todėl trikampis OBC lygiakraštis: ∠ABC = 60°. ∠ACB = 90° (remiasi į skersmenį), todėl ∠CAB = 90° − 60° = 30°. Atsakymas: x = ${p.w ? 30 : 60}°.` }),
  d11: p => ({ q: `${cO} AB – skersmuo, ∠CAB = ${p.A}°. Rask kampą AOC (x).`, hint: "Trikampis AOC lygiašonis, nes OA = OC.",
    why: `OA = OC (spinduliai), todėl ∠OCA = ∠OAC = ${p.A}°. x = 180° − 2 · ${p.A}° = ${180 - 2 * p.A}°.` }),

  /* ---------- 4 lygis: liestinės ir kampai ---------- */
  t1: p => ({ q: `${cO} Tiesė AP liečia apskritimą taške A, ∠AOP = ${p.h}°. Rask kampą APO (x).`, hint: R.t,
    why: `Liestinė statmena spinduliui, nubrėžtam į lietimosi tašką: ∠OAP = 90°. x = 180° − 90° − ${p.h}° = ${90 - p.h}°.` }),
  t2: p => ({ q: `${cO} Tiesė AP liečia apskritimą taške A, ∠APO = ${90 - p.h}°. Rask kampą AOP (x).`, hint: R.t,
    why: `Liestinė statmena spinduliui, nubrėžtam į lietimosi tašką: ∠OAP = 90°. x = 180° − 90° − ${90 - p.h}° = ${p.h}°.` }),
  t3: p => ({ q: `${cO} PA ir PB – apskritimo liestinės (A ir B – lietimosi taškai), ∠APB = ${180 - 2 * p.h}°. Rask kampą AOB (x).`, hint: R.quad,
    why: `∠OAP = ∠OBP = 90° (liestinė statmena spinduliui). Keturkampio OAPB kampų suma 360°: x = 360° − 90° − 90° − ${180 - 2 * p.h}° = ${2 * p.h}°.` }),
  t4: p => ({ q: `${cO} PA ir PB – apskritimo liestinės (A ir B – lietimosi taškai), ∠AOB = ${2 * p.h}°. Rask kampą APB (x).`, hint: R.quad,
    why: `∠OAP = ∠OBP = 90° (liestinė statmena spinduliui). Keturkampio OAPB kampų suma 360°: x = 360° − 90° − 90° − ${2 * p.h}° = ${180 - 2 * p.h}°.` }),
  t5: p => ({ q: `PA ir PB – apskritimo liestinės (A ir B – lietimosi taškai), ∠APB = ${180 - 2 * p.h}°. Rask kampą PAB (x).`, hint: R.tt,
    why: `Iš vieno taško nubrėžtų liestinių atkarpos lygios: PA = PB. Trikampis PAB lygiašonis: x = (180° − ${180 - 2 * p.h}°) : 2 = ${p.h}°.` }),
  t6: p => ({ q: `${cO} PA ir PB – apskritimo liestinės, ∠APB = ${180 - 2 * p.h}°. Rask kampą AOP (x).`, hint: "Trikampiai OAP ir OBP lygūs, todėl OP dalija kampą APB pusiau. Liestinė statmena spinduliui.",
    why: `Trikampiai OAP ir OBP lygūs (OA = OB, PA = PB, OP – bendra), todėl ∠APO = ${180 - 2 * p.h}° : 2 = ${90 - p.h}°. ∠OAP = 90° (liestinė statmena spinduliui): x = 90° − ${90 - p.h}° = ${p.h}°.` }),
  t15: p => ({ q: `${cO} PA ir PB – apskritimo liestinės, ∠OPA = ${90 - p.h}°. Rask kampą AOB (x).`, hint: "Trikampis OAP statusis. Trikampiai OAP ir OBP lygūs.",
    why: `∠OAP = 90° (liestinė statmena spinduliui), todėl ∠AOP = 90° − ${90 - p.h}° = ${p.h}°. Trikampiai OAP ir OBP lygūs (OA = OB, PA = PB, OP – bendra), tad ∠BOP = ${p.h}°. x = 2 · ${p.h}° = ${2 * p.h}°.` }),
  t16: p => ({ q: `${cO} PA ir PB – apskritimo liestinės, AC – skersmuo, ∠APB = ${180 - 2 * p.h}°. Rask kampą BOC (x).`, hint: "Pirmiausia keturkampyje OAPB rask kampą AOB. Kampai AOB ir BOC kartu sudaro 180°.",
    why: `Keturkampyje OAPB: ∠AOB = 360° − 90° − 90° − ${180 - 2 * p.h}° = ${2 * p.h}°. Kampai AOB ir BOC kartu sudaro 180° (AC – skersmuo): x = 180° − ${2 * p.h}° = ${180 - 2 * p.h}°.` }),
  t7: p => ({ q: `${cO} Tiesė AK liečia apskritimą taške A, ∠AOB = ${p.a}°. Rask kampą KAB tarp liestinės ir stygos (x).`, hint: "Trikampis AOB lygiašonis – rask kampą OAB. Kampas OAK status.",
    why: `Trikampis AOB lygiašonis (OA = OB): ∠OAB = (180° − ${p.a}°) : 2 = ${90 - p.a / 2}°. Liestinė statmena spinduliui: ∠OAK = 90°. x = 90° − ${90 - p.a / 2}° = ${p.a / 2}°.` }),
  t13: p => ({ q: `PA ir PB – apskritimo liestinės (A ir B – lietimosi taškai), ∠APB = ${180 - 2 * p.h}°. Rask įbrėžtinį kampą ACB (x).`, hint: "Nubrėžk spindulius į lietimosi taškus – gausi centrinį kampą AOB.",
    why: `Nubrėžkime spindulius OA ir OB. Keturkampyje OAPB: ∠AOB = 360° − 90° − 90° − ${180 - 2 * p.h}° = ${2 * p.h}°. Kampas ACB – įbrėžtinis, remiasi į tą patį lanką AB: x = ${2 * p.h}° : 2 = ${p.h}°.` }),

  /* ---------- 5 lygis: atkarpų ilgiai ---------- */
  t8: p => ({ q: `${cO} PA ir PB – apskritimo liestinės (A ir B – lietimosi taškai). OA = ${p.r}, PA = ${p.a}. Rask PB (x).`, hint: R.tt,
    why: `Iš vieno taško nubrėžtų liestinių atkarpos iki lietimosi taškų lygios: PB = PA = ${p.a}. Spindulio ilgio čia neprireikė.` }),
  t9: p => ({ q: `${cO} Tiesė PA liečia apskritimą taške A. OA = ${p.r}, PA = ${p.a}. Rask OP (x).`, hint: "Liestinė statmena spinduliui, todėl trikampis OAP statusis. Taikyk Pitagoro teoremą.",
    why: `∠OAP = 90° (liestinė statmena spinduliui), todėl trikampis OAP statusis, OP – įžambinė. OP² = ${p.r}² + ${p.a}² = ${p.r * p.r} + ${p.a * p.a} = ${p.c * p.c}, x = ${p.c}.` }),
  t10: p => ({ q: `${cO} Tiesė PA liečia apskritimą taške A. OA = ${p.r}, OP = ${p.c}. Rask PA (x).`, hint: "Liestinė statmena spinduliui, todėl trikampis OAP statusis. Taikyk Pitagoro teoremą.",
    why: `∠OAP = 90° (liestinė statmena spinduliui), todėl trikampis OAP statusis, OP – įžambinė. PA² = ${p.c}² − ${p.r}² = ${p.c * p.c} − ${p.r * p.r} = ${p.a * p.a}, x = ${p.a}.` }),
  t11: p => ({ q: `${cO} Tiesė PA liečia apskritimą taške A. PA = ${p.a}, OP = ${p.c}. Rask spindulį OA (x).`, hint: "Liestinė statmena spinduliui, todėl trikampis OAP statusis. Taikyk Pitagoro teoremą.",
    why: `∠OAP = 90° (liestinė statmena spinduliui), todėl trikampis OAP statusis, OP – įžambinė. OA² = ${p.c}² − ${p.a}² = ${p.c * p.c} − ${p.a * p.a} = ${p.r * p.r}, x = ${p.r}.` }),
  t12: p => ({ q: `${cO} PA ir PB – apskritimo liestinės (A ir B – lietimosi taškai). OA = ${p.r}, PA = ${p.a}. Rask keturkampio OAPB perimetrą P.`, hint: "OB = OA (spinduliai), PB = PA (liestinių atkarpos).",
    why: `OB = OA = ${p.r} (spinduliai), PB = PA = ${p.a} (liestinių atkarpos iš vieno taško lygios). P = 2 · (${p.r} + ${p.a}) = ${2 * (p.r + p.a)}.` }),
  t14a: p => ({ q: `Apskritimas liečia trikampio ABC kraštines taškuose K, L ir M. AK = ${p.a}, BK = ${p.b}, CL = ${p.c}. Rask trikampio perimetrą P.`, hint: "Iš kiekvienos viršūnės išeina dvi lygios liestinių atkarpos.",
    why: `Liestinių atkarpos iš vieno taško lygios: AM = AK = ${p.a}, BL = BK = ${p.b}, CM = CL = ${p.c}. P = 2 · (${p.a} + ${p.b} + ${p.c}) = ${2 * (p.a + p.b + p.c)}.` }),
  t14b: p => ({ q: `Apskritimas liečia trikampio ABC kraštines taškuose K, L ir M. AB = ${p.a + p.b}, BC = ${p.b + p.c}, AK = ${p.a}. Rask CM (x).`, hint: "Eik ratu: BK = AB − AK, BL = BK, CL = BC − BL, CM = CL.",
    why: `BK = AB − AK = ${p.a + p.b} − ${p.a} = ${p.b}. BL = BK = ${p.b} (liestinių atkarpos iš taško B). CL = BC − BL = ${p.b + p.c} − ${p.b} = ${p.c}. CM = CL = ${p.c} (liestinių atkarpos iš taško C).` }),
  s1: p => { const g = ["a", "b", "c", "d"].filter(k => k !== p.u), o = { a: "b", b: "a", c: "d", d: "c" }[p.u], pr = "ab".includes(p.u) ? p.c * p.d : p.a * p.b;
    return { q: `Stygos AB ir CD susikerta taške E. ${g.map(k => `${SEG[k]} = ${p[k]}`).join(", ")}. Rask ${SEG[p.u]} (x).`, hint: R.ch,
      why: `Susikertančių stygų atkarpų sandaugos lygios: AE · EB = CE · ED. Įrašome: ${"ab".includes(p.u) ? `${p.u === "a" ? "x" : p.a} · ${p.u === "b" ? "x" : p.b} = ${p.c} · ${p.d}` : `${p.a} · ${p.b} = ${p.u === "c" ? "x" : p.c} · ${p.u === "d" ? "x" : p.d}`}. x = ${pr} : ${p[o]} = ${p[p.u]}.` }; },
  s2: p => ({ q: `Stygos AB ir CD susikerta taške E, kuris dalija stygą CD pusiau. AE = ${p.a}, EB = ${p.b}. Rask CE (x).`, hint: R.ch + " Čia CE = ED = x.",
    why: `AE · EB = CE · ED. Kadangi CE = ED = x, gauname x · x = ${p.a} · ${p.b} = ${p.a * p.b}, todėl x = ${p.x} (nes ${p.x} · ${p.x} = ${p.a * p.b}).` }),
  s3: p => ({ q: `Stygos AB ir CD susikerta taške E. AE = ${p.a}, EB = ${p.b}, CE = ${p.c}. Rask visos stygos CD ilgį.`, hint: R.ch + " Pirmiausia rask ED.",
    why: `AE · EB = CE · ED: ${p.a} · ${p.b} = ${p.c} · ED, todėl ED = ${p.a * p.b} : ${p.c} = ${p.d}. CD = CE + ED = ${p.c} + ${p.d} = ${p.c + p.d}.` }),
  s4: p => ({ q: `${cO} Skersmuo AB statmenas stygai CD ir dalija ją pusiau taške E. AE = ${p.a}, CE = ${p.h}. Rask apskritimo spindulį r.`, hint: R.ch + " Rask EB, tada skersmenį AB.",
    why: `ED = CE = ${p.h}. AE · EB = CE · ED: ${p.a} · EB = ${p.h} · ${p.h}, todėl EB = ${p.h * p.h} : ${p.a} = ${p.e}. Skersmuo AB = ${p.a} + ${p.e} = ${p.a + p.e}, r = ${p.a + p.e} : 2 = ${(p.a + p.e) / 2}.` }),
  s8: p => ({ q: `Stygos AB ir CD susikerta taške E. AE = ${p.a}, EB = ${p.b}, CD = ${p.c + p.d}, atkarpa CE trumpesnė už ED. Rask CE (x).`, hint: "Pažymėk CE = x, tada ED = CD − x. Gausi kvadratinę lygtį.",
    why: `Jei CE = x, tai ED = ${p.c + p.d} − x. AE · EB = CE · ED: x · (${p.c + p.d} − x) = ${p.a * p.b}, t. y. x² − ${p.c + p.d}x + ${p.a * p.b} = 0. Lygties sprendiniai: ${p.c} ir ${p.d}. CE trumpesnė už ED, todėl x = ${p.c}.` }),

  /* ---------- egzamino papildomos ---------- */
  s5: p => ({ q: `Stygos AB ir CD susikerta taške E. ∠DAB = ${p.v}°, ∠ABC = ${p.u}°. Rask kampą AED (x).`, hint: "Trikampyje AED trūksta kampo D. Jis remiasi į tą patį lanką AC kaip ir kampas ABC.",
    why: `Kampai ADC ir ABC – įbrėžtiniai, remiasi į tą patį lanką AC, todėl ∠ADC = ${p.u}°. Trikampio AED kampų suma 180°: x = 180° − ${p.v}° − ${p.u}° = ${180 - p.u - p.v}°.` }),
  s6: p => ({ q: `Stygos AB ir CD susikerta taške E. ∠BCD = ${p.v}°, ∠ADC = ${p.u}°. Rask kampus x ir y.`, hint: "Kampai BAD ir BCD remiasi į tą patį lanką BD. Tada žiūrėk į trikampį AED.",
    why: `Kampai BAD (x) ir BCD – įbrėžtiniai, remiasi į tą patį lanką BD: x = ${p.v}°. Trikampio AED kampų suma 180°: y = 180° − ${p.v}° − ${p.u}° = ${180 - p.u - p.v}°.` }),
  m1: p => ({ q: `${cO} Trikampio ABC viršūnės yra apskritime. ∠OAB = ${p.p}°, ∠OBC = ${p.q}°. Rask kampą OCA (x).`, hint: "Trikampiai OAB, OBC ir OCA lygiašoniai: kiekvienas duotas kampas trikampyje ABC pasikartoja dar kartą.",
    why: `Trikampiai OAB, OBC ir OCA lygiašoniai (jų šoninės kraštinės – spinduliai), todėl ∠OBA = ${p.p}°, ∠OCB = ${p.q}°, ∠OAC = x. Trikampio ABC kampų suma: 2 · ${p.p}° + 2 · ${p.q}° + 2x = 180°, taigi x = 90° − ${p.p}° − ${p.q}° = ${90 - p.p - p.q}°.` }),
  m2: p => ({ q: `${cO} AB – skersmuo, tiesė BK liečia apskritimą taške B, ∠BAC = ${p.A}°. Rask kampą CBK (x).`, hint: "Kampas ACB remiasi į skersmenį. Liestinė BK statmena skersmeniui AB.",
    why: `∠ACB = 90° (remiasi į skersmenį), todėl ∠ABC = 90° − ${p.A}° = ${90 - p.A}°. Liestinė statmena spinduliui: ∠ABK = 90°. x = 90° − ${90 - p.A}° = ${p.A}°.` })
};

window.MK_T = {
  tasks, fr,
  title: "Rozetės meistras",
  heroA: "Rozetės", heroB: "meistras",
  hero: "Katedros rozetei reikia naujų vitražų. Padėk vitražų meistrei Rūtai: apskaičiuok kampus, lankus ir atkarpas apskritime – kiekvienas išspręstas brėžinys virsta spalvotu stiklu.",
  heroAria: "Vitražų meistrė Rūta su skriestuvu dirbtuvėje prie katedros rozetės ir brėžinio",
  pts: "Taškai", next: "Toliau →", finish: "Baigti",
  check: "Tikrinti", del: "Ištrinti skaitmenį",
  tries: n => `Bandymai: ${n} / 3`,
  empty: "Įrašyk atsakymą: paliesk langelį ir surink skaičių.",
  miss: "Dar ne. Pagalvok ir pabandyk dar kartą.",
  missPart: "Dalis atsakymų teisingi – pataisyk raudonus langelius.",
  hint: "Užuomina:",
  shown: "Parodžiau teisingą atsakymą.",
  boxAria: id => `Atsakymas ${id}`,
  figAria: "Užduoties brėžinys",
  res: (ok, n, p) => `Iš pirmo karto išspręsta: ${ok} iš ${n}. Taškai: ${p}.`,
  colH: "Katedros rozetė",
  colP: (n, rank) => `Įstatyta stiklų: <b>${n} iš 18</b>. Kiekvienas lygis – vienas rozetės žiedlapis, kiekviena žvaigždutė – naujas stiklas. Tavo vardas dirbtuvėje: <b>${rank}</b>.`,
  colAria: n => `Katedros rozetė: įstatyta ${n} iš 18 stiklų`,
  ranks: ["Mokinys", "Pameistrys", "Vitražistas", "Rozetės meistras"],
  levels: [
    { id: "centriniai", name: "Centrinis kampas ir lankas", sub: "Lankai laipsniais, išpjovos, spinduliai" },
    { id: "ibreztiniai", name: "Įbrėžtinis kampas", sub: "Pusė centrinio kampo, tas pats lankas" },
    { id: "skersmuo", name: "Skersmuo ir statusis kampas", sub: "Kampas, kuris remiasi į skersmenį" },
    { id: "liestines", name: "Liestinės", sub: "Liestinė statmena spinduliui" },
    { id: "ilgiai", name: "Atkarpų ilgiai", sub: "Liestinių atkarpos, susikertančios stygos" },
    { id: "egzaminas", name: "Meistro egzaminas", sub: "10 kelių žingsnių galvosūkių" }
  ],
  terms: { styga: "styga", skersmuo: "skersmuo", liestine: "liestinė", kirstine: "kirstinė", ispjova: "išpjova", nuopjova: "nuopjova", spindulys: "spindulys" },
  learn: [
    { name: "Apskritimo žodynėlis", level: 0, html: `
      <div class="lfig" data-f="terms"></div>
      <ul><li><b>Styga</b> – atkarpa, jungianti du apskritimo taškus. <b>Skersmuo</b> – styga, einanti per centrą.</li>
      <li><b>Liestinė</b> – tiesė, turinti su apskritimu vieną bendrą tašką (lietimosi tašką).</li>
      <li><b>Kirstinė</b> – tiesė, kertanti apskritimą dviejuose taškuose.</li>
      <li><b>Skritulio išpjova</b> – skritulio dalis, kurią riboja du spinduliai ir lankas.</li>
      <li><b>Skritulio nuopjova</b> – skritulio dalis, kurią riboja styga ir lankas.</li></ul>` },
    { name: "Centrinis kampas ir lankas", level: 0, html: `
      <p><b>Centrinis kampas</b> – kampas, kurio viršūnė yra apskritimo centre, o kraštinės – spinduliai.</p>
      <div class="lfig" data-f="c1"></div>
      <p>Apskritimo lankas matuojamas ne tik ilgio vienetais, bet ir laipsniais: <b>lankas turi tiek laipsnių, kiek centrinis kampas, kuris į jį remiasi.</b> Visas apskritimas – 360°, pusapskritimis – 180°.</p>
      ${ex("Jei ∠AOB = 70°, tai lankas AB = 70°, o likęs lankas – 360° − 70° = 290°.")}
      <p>Spinduliai lygūs, todėl trikampis AOB visada lygiašonis: ∠OAB = ∠OBA = (180° − ∠AOB) : 2.</p>` },
    { name: "Įbrėžtinis kampas", level: 1, html: `
      <p><b>Įbrėžtinis kampas</b> – kampas, kurio viršūnė yra apskritime, o kraštinės kerta apskritimą.</p>
      <div class="lfig" data-f="i1"></div>
      <p><b>Įbrėžtinis kampas lygus pusei centrinio kampo, kuris remiasi į tą patį lanką</b> (taigi – pusei to lanko).</p>
      ${ex("Jei ∠AOB = 100°, tai ∠ACB = 100° : 2 = 50°.")}
      <p><b>Įbrėžtiniai kampai, kurie remiasi į tą patį lanką, yra lygūs.</b></p>
      <p>Atidžiai: kampas remiasi į tą lanką, kuris yra jo viduje – tame lanke nėra kampo viršūnės. Jei viršūnė yra mažesniajame lanke, kampas remiasi į didesnįjį lanką ir yra bukasis.</p>` },
    { name: "Kampas, kuris remiasi į skersmenį", level: 2, html: `
      <div class="lfig" data-f="d1"></div>
      <p>Skersmuo dalija apskritimą į du pusapskritimius po 180°. Įbrėžtinis kampas, kuris remiasi į skersmenį, lygus 180° : 2 = 90° – <b>jis visada status.</b></p>
      ${ex("AB – skersmuo, ∠CAB = 35°. Tada ∠ACB = 90°, ∠ABC = 90° − 35° = 55°.")}
      <p>Ir atvirkščiai: jei įbrėžtinis kampas status, jis remiasi į skersmenį.</p>` },
    { name: "Liestinė ir spindulys", level: 3, html: `
      <div class="lfig" data-f="t3"></div>
      <p><b>Liestinė statmena spinduliui, nubrėžtam į lietimosi tašką.</b> Todėl trikampis OAP statusis, o keturkampyje OAPB du kampai statūs:</p>
      ${ex("∠AOB + ∠APB = 360° − 90° − 90° = 180°.")}
      <p><b>Iš vieno taško nubrėžtų liestinių atkarpos iki lietimosi taškų yra lygios:</b> PA = PB. Todėl trikampis PAB lygiašonis, o trikampiai OAP ir OBP lygūs.</p>` },
    { name: "Liestinių atkarpos ir susikertančios stygos", level: 4, html: `
      <div class="lfig" data-f="s1"></div>
      <p><b>Jei dvi stygos susikerta, tai vienos stygos atkarpų sandauga lygi kitos stygos atkarpų sandaugai:</b></p>
      ${ex("AE · EB = CE · ED")}
      ${ex("AE = 3, EB = 8, CE = 4. Tada 3 · 8 = 4 · ED, ED = 24 : 4 = 6.")}
      <p>Liestinė statmena spinduliui, todėl trikampiui OAP galima taikyti Pitagoro teoremą: OP² = OA² + PA².</p>
      <p>Jei apskritimas liečia visas trikampio kraštines, iš kiekvienos viršūnės išeina dvi lygios liestinių atkarpos.</p>` }
  ]
};
})();
