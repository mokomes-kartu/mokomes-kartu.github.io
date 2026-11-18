/* Karpinių langas – visi mokiniui rodomi tekstai (lietuvių k.). Verčiant keisti tik šį failą.
   Terminai – pagal Matematikos bendrąją programą (2 kl.: „Nagrinėjamos simetriškos ašies atžvilgiu figūros, mokomasi užbaigti ar
   sukurti ašies atžvilgiu simetrišką piešinį languotame ar taškuotame popieriuje, kai pavaizduota vertikali arba horizontali
   simetrijos ašis.“; 3 kl.: „ieškoma tiesės atžvilgiu simetriškų figūrų (pvz., sulenkiant popierių sutampa atvaizdai …)“) ir
   NŠA „Rekomendacijos 2-os klasės matematikos mokytojams“ („Figūros simetrijos ašis – tai tiesė, per kurią sulenkus figūrą,
   abiejose tiesės pusėse esančios figūros dalys sutampa.“). */
(function(){
"use strict";
const kn = n => n % 10 === 1 && n % 100 !== 11 ? "naujas karpinys" : (n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20)) ? "nauji karpiniai" : "naujų karpinių";
window.MK_T = {
  title: "Karpinių langas",
  heroA: "Karpinių", heroB: "langas",
  hero: "Karpytoja Ugnė puošia langą popieriaus karpiniais. Lankstyk lapą, užbaik simetriškus karpinius ir surink juos visus ant savo lango!",
  levels: [
    ["Ar tai simetrijos ašis?", "2 kl. · sulenk ir pažiūrėk, ar dalys sutampa"],
    ["Užbaik karpinį", "2 kl. · vertikali simetrijos ašis"],
    ["Aukštyn ir žemyn", "2 kl. · horizontali ašis ir dvi ašys"],
    ["Kas išeis išlanksčius?", "2–3 kl. · sulenktas lapas"],
    ["Kiek simetrijos ašių?", "2 kl. · rask visas figūros ašis"],
    ["Karpinių dvynės", "3 kl. · figūros, simetriškos viena kitai"],
    ["Meistrės išbandymas", "2–3 kl. · visko po truputį"]
  ],
  pts: "taškai",
  next: "Toliau →", finish: "Baigti →",
  yes: "Taip", no: "Ne",
  check: "Tikrinti", clear: "Išvalyti",
  foldLine: "lenkimo linija",
  folded: "Sulenktas lapas",
  q: {
    judge: "Ar brūkšninė tiesė yra šios figūros simetrijos ašis?",
    completeV: "Užbaik karpinį: brūkšninė tiesė turi būti jo simetrijos ašis. Liesk langelius geltonoje pusėje.",
    completeH: "Užbaik karpinį: brūkšninė tiesė turi būti jo simetrijos ašis. Liesk langelius geltonoje pusėje.",
    completeD: "Šis karpinys turi dvi simetrijos ašis. Užbaik jį geltonuose langeliuose.",
    fold1: "Ugnė sulenkė lapą pusiau ir iškirpo figūrą. Kuris karpinys išeis išlanksčius?",
    fold2: "Ugnė sulenkė lapą du kartus ir iškirpo figūrą. Kuris karpinys išeis išlanksčius?",
    axes: "Paliesk visas tieses, kurios yra figūros simetrijos ašys. Jei ašių nėra – nežymėk nė vienos.",
    pairJudge: "Ar figūros yra simetriškos viena kitai brūkšninės tiesės atžvilgiu?",
    pairDraw: "Nupiešk figūrą, simetrišką duotajai brūkšninės tiesės atžvilgiu. Liesk langelius geltonoje pusėje."
  },
  judge: {
    yes: "Sulenkus per šią tiesę abi dalys sutampa – tai simetrijos ašis.",
    no: "Sulenkus per šią tiesę dalys nesutampa – tai ne simetrijos ašis.",
    cell: "Vienoje pusėje yra langelis, kurio kitoje pusėje nėra.",
    trans: "Antroji dalis tokia pati, bet neapversta. Simetriška dalis atrodo kaip atspindys veidrodyje.",
    off: "Ši figūra simetriška, bet jos simetrijos ašis eina kitur – per patį figūros vidurį.",
    dir: "Ši figūra turi simetrijos ašį, tik ne šią tiesę."
  },
  pair: {
    yes: "Sulenkus lapą per tiesę figūros sutampa – jos simetriškos viena kitai.",
    no: "Sulenkus lapą per tiesę figūros nesutampa.",
    trans: "Antroji figūra tik perkelta, o ne apversta kaip veidrodyje.",
    shift: "Antroji figūra pastumta į šoną nuo savo vietos.",
    dist: "Figūros nevienodai nutolusios nuo tiesės.",
    cell: "Figūros skiriasi vienu langeliu."
  },
  wrongLead: "Ne visai.",
  comp: {
    ok: "Abi pusės sutampa!",
    okD: "Karpinys simetriškas abiejų ašių atžvilgiu!",
    okP: "Figūros simetriškos viena kitai!",
    rows: "Dar ne visai. Rodyklėmis pažymėjau eilutes, kuriose yra klaida. Pataisyk ir tikrink dar kartą.",
    cols: "Dar ne visai. Rodyklėmis pažymėjau stulpelius, kuriuose yra klaida. Pataisyk ir tikrink dar kartą.",
    empty: "Pirma paliesk langelius geltonoje pusėje.",
    fail: "Štai kaip turėjo būti. Kiekvienas langelis ir jo pora kitoje pusėje yra vienodai nutolę nuo ašies."
  },
  fold: {
    ok: "Lenkimo linija tapo karpinio simetrijos ašimi.",
    ok2: "Abi lenkimo linijos tapo karpinio simetrijos ašimis.",
    bad: "Ne šis. Pažiūrėk, kaip lapas išsilanksto: lenkimo linija tampa simetrijos ašimi."
  },
  axes: {
    more: "Dar ne visas ašis radai. Paieškok dar.",
    less: "Ne visos pažymėtos tiesės yra simetrijos ašys. Pagalvok: ar sulenkus per tiesę dalys sutaptų?",
    mix: "Ne visai. Patikrink kiekvieną tiesę: ar sulenkus per ją dalys sutaptų?",
    n: k => k === 0 ? "Ši figūra neturi nė vienos simetrijos ašies." : k === 1 ? "Ši figūra turi 1 simetrijos ašį." : `Ši figūra turi ${k} simetrijos ašis.`,
    inf: "Apskritimas turi be galo daug simetrijos ašių – tinka kiekviena tiesė, einanti per jo centrą.",
    show: "Žalios tiesės – simetrijos ašys.",
    notes: {
      lygiagretainis: "Sulenkus šią figūrą jos dalys nesutampa, nors ji atrodo „tvarkinga“.",
      staciakampis: "Per kampus einančios tiesės netinka – sulenkus per jas kampai nesutampa.",
      malunelis: "Šią figūrą galima pasukti, bet sulenkus dalys nesutampa.",
      n: "Šią raidę galima apsukti, bet sulenkus dalys nesutampa.",
      z: "Šią raidę galima apsukti, bet sulenkus dalys nesutampa.",
      kvadratas: "Kvadratas – taisyklingasis keturkampis: jo ašys eina ir per kraštinių vidurius, ir per kampus.",
      trikampis3: "Lygiakraščio trikampio ašys eina per kiekvieną viršūnę.",
      sesiakampis: "Taisyklingasis šešiakampis turi net 6 simetrijos ašis.",
      penkiakampis: "Taisyklingasis penkiakampis turi 5 simetrijos ašis."
    }
  },
  res: (ok, total, pts, gain) => `Iš pirmo karto – ${ok} iš ${total}. Taškai: ${pts}.` + (gain ? ` Ant lango – ${gain} ${kn(gain)}!` : ""),
  colH: "Mano langas",
  colP: (n, total, rank) => `Surinkta karpinių: ${n} iš ${total}. Laipsnis: ${rank}. Karpinys pakabinamas, kai užduotį su juo išsprendi iš pirmo karto.`,
  ranks: ["Naujokas", "Pameistrys", "Karpytojas", "Meistras", "Didysis meistras"],
  mine: "Mano sukurti karpiniai",
  free: {
    btn: "Kurk savo karpinį",
    h: "Kurk savo karpinį",
    p: "Liesk langelius – karpinys pats tampa simetriškas. Kai patiks, pakabink jį ant lango.",
    one: "1 simetrijos ašis", two: "2 simetrijos ašys",
    save: "Pakabinti ant lango", back: "← Į pradžią",
    saved: "Karpinys kabo ant tavo lango!",
    empty: "Pirma paliesk bent kelis langelius.",
    color: "Popieriaus spalva"
  },
  names: {
    sirdele: "Širdelė", eglute: "Eglutė", namelis: "Namelis", grybas: "Grybas", taure: "Taurė", deimantas: "Deimantas", raketa: "Raketa",
    zmogeliukas: "Žmogeliukas", medis: "Medis", kate: "Katė", tulpe: "Tulpė", obuolys: "Obuolys", karuna: "Karūna", asotis: "Ąsotis",
    varpelis: "Varpelis", inkaras: "Inkaras", snaige: "Snaigė",
    egle: "Eglė", drugelis: "Drugelis", pilis: "Pilis", zvaigzde: "Žvaigždė", robotas: "Robotas", peleda: "Pelėda", boruze: "Boružė",
    vaza: "Vaza", taure2: "Didelė taurė", sketis: "Skėtis", balionas: "Oro balionas", tulpe2: "Tulpė su lapais", raketa2: "Greita raketa",
    namas: "Namas", snaige2: "Didelė snaigė", saule: "Saulė", remelis: "Rėmelis", zmogus: "Žmogus",
    egle3: "Aukšta eglė", sirdis: "Širdis", drugelis2: "Didelis drugelis", pilis2: "Didelė pilis", kate2: "Katės galva", zvaigzde2: "Didelė žvaigždė",
    snaige3: "Puošni snaigė", saule2: "Didelė saulė", gele: "Gėlė", robotas2: "Didelis robotas", raketa3: "Kosminė raketa", vaza2: "Didelė vaza",
    inkaras2: "Didelis inkaras", grybas2: "Baravykas", ledai: "Ledai", karuna2: "Karaliaus karūna", obuolys2: "Didelis obuolys", varpas: "Varpas"
  },
  learn: [
    { name: "Kas yra simetrijos ašis?", level: 0, html: `<p><b>Figūros simetrijos ašis</b> – tai tiesė, per kurią sulenkus figūrą, abiejose tiesės pusėse esančios figūros dalys sutampa.</p>
      <p>Figūra, turinti simetrijos ašį, vadinama <b>simetriška</b>.</p>
      <span class="mk-ex">Patikrink pats: sulenk popieriaus lapą pusiau, iškirpk pusę širdelės ir išlankstyk. Lenkimo linija – širdelės simetrijos ašis.</span>` },
    { name: "Kaip užbaigti simetrišką figūrą?", level: 1, html: `<p>Kiekvienas nuspalvintas langelis turi <b>porą</b> kitoje ašies pusėje.</p>
      <ul><li>Pora yra <b>toje pačioje eilutėje</b> (kai ašis vertikali) arba <b>tame pačiame stulpelyje</b> (kai ašis horizontali).</li>
      <li>Abu langeliai <b>vienodai nutolę nuo ašies</b>: jei vienas yra trečias nuo ašies, tai ir kitas – trečias.</li></ul>
      <span class="mk-ex">Skaičiuok langelius nuo ašies: 1, 2, 3… – ir tiek pat į kitą pusę.</span>` },
    { name: "Kiek simetrijos ašių gali turėti figūra?", level: 4, html: `<p>Figūra gali turėti <b>vieną</b> simetrijos ašį, <b>daugiau negu vieną</b>, <b>be galo daug</b> arba <b>neturėti nė vienos</b>.</p>
      <ul><li>Širdelė – 1 ašis.</li><li>Stačiakampis – 2 ašys.</li><li>Kvadratas – 4 ašys.</li><li>Apskritimas – be galo daug ašių.</li></ul>
      <span class="mk-ex">Tikrink kiekvieną tiesę atskirai: ar sulenkus per ją dalys sutaptų?</span>` },
    { name: "Figūros, simetriškos viena kitai", level: 5, html: `<p>Dvi figūros yra <b>simetriškos viena kitai tiesės atžvilgiu</b>, jei sulenkus lapą per tą tiesę jos sutampa.</p>
      <ul><li>Antroji figūra atrodo kaip pirmosios atspindys veidrodyje.</li><li>Abi figūros vienodai nutolusios nuo tiesės.</li></ul>
      <span class="mk-ex">Jei figūra yra per 2 langelius nuo tiesės, tai ir jos dvynė – per 2 langelius.</span>` }
  ]
};
})();
