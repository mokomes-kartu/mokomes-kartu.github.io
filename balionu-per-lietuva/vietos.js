/* Balionu per Lietuvą – vietų koordinatės (platuma, ilguma) ir skrydžių sudėtis. Tekstų čia nėra (jie – tekstai.lt.js).
   t: m – miestas (s: 1 sostinė, 2 didieji, 3 kiti), u – upė (r: raktas MK_KARTA.rivers), e – ežeras, j – jūra / marios,
      k – kaimyninė šalis (c: šalies kodas), r – etnografinis regionas, d – pasaulio kryptis, v – žymi vieta (m: 3D modelis).
   Miestų ir žymių vietų koordinatės surašytos ranka (tikslumas ~1 km); sutikrinta su upėmis iš Natural Earth.
   Nida, kopos ir Stelmužė pastumtos ~1 km, kad žemėlapyje atsidurtų sausumoje; Aukštojo kalvos vieta – ±3 km (į vakarus nuo Medininkų). */
window.MK_VIETOS = {
  list: [
    { id: "vilnius", t: "m", s: 1, at: [54.687, 25.280] }, { id: "kaunas", t: "m", s: 2, at: [54.897, 23.892] }, { id: "klaipeda", t: "m", s: 2, at: [55.711, 21.135] },
    { id: "siauliai", t: "m", s: 2, at: [55.933, 23.317] }, { id: "panevezys", t: "m", s: 2, at: [55.735, 24.358] }, { id: "alytus", t: "m", s: 3, at: [54.396, 24.046] },
    { id: "marijampole", t: "m", s: 3, at: [54.557, 23.350] }, { id: "mazeikiai", t: "m", s: 3, at: [56.312, 22.340] }, { id: "jonava", t: "m", s: 3, at: [55.073, 24.280] },
    { id: "utena", t: "m", s: 3, at: [55.498, 25.600] }, { id: "kedainiai", t: "m", s: 3, at: [55.288, 23.975] }, { id: "telsiai", t: "m", s: 3, at: [55.984, 22.247] },
    { id: "taurage", t: "m", s: 3, at: [55.252, 22.290] }, { id: "ukmerge", t: "m", s: 3, at: [55.249, 24.757] }, { id: "visaginas", t: "m", s: 3, at: [55.598, 26.438] },
    { id: "plunge", t: "m", s: 3, at: [55.911, 21.845] }, { id: "kretinga", t: "m", s: 3, at: [55.890, 21.242] }, { id: "palanga", t: "m", s: 3, at: [55.918, 21.068] },
    { id: "silute", t: "m", s: 3, at: [55.349, 21.483] }, { id: "druskininkai", t: "m", s: 3, at: [54.016, 23.972] }, { id: "rokiskis", t: "m", s: 3, at: [55.962, 25.587] },
    { id: "birzai", t: "m", s: 3, at: [56.201, 24.756] }, { id: "trakai", t: "m", s: 3, at: [54.638, 24.934] }, { id: "anyksciai", t: "m", s: 3, at: [55.526, 25.103] },
    { id: "zarasai", t: "m", s: 3, at: [55.731, 26.246] }, { id: "varena", t: "m", s: 3, at: [54.211, 24.573] }, { id: "jurbarkas", t: "m", s: 3, at: [55.078, 22.767] },
    { id: "raseiniai", t: "m", s: 3, at: [55.381, 23.116] }, { id: "nida", t: "m", s: 3, at: [55.300, 20.985] }, { id: "birstonas", t: "m", s: 3, at: [54.606, 24.031] },
    { id: "nemunas", t: "u", r: "nemunas", at: [55.07, 22.9] }, { id: "neris", t: "u", r: "neris", at: [54.93, 24.75] }, { id: "sventoji", t: "u", r: "sventoji", at: [55.42, 24.95] },
    { id: "nevezis", t: "u", r: "nevezis", at: [55.45, 24.0] }, { id: "merkys", t: "u", r: "merkys", at: [54.33, 24.75] }, { id: "sesupe", t: "u", r: "sesupe", at: [54.7, 23.15] },
    { id: "venta", t: "u", r: "venta", at: [56.1, 22.75] },
    { id: "druksiai", t: "e", at: [55.62, 26.58], rad: 9 }, { id: "tauragnas", t: "e", at: [55.443, 25.870], rad: 8 }, { id: "plateliai", t: "e", at: [56.045, 21.858], rad: 8 },
    { id: "galve", t: "e", at: [54.662, 24.933], rad: 8 }, { id: "vistytis", t: "e", at: [54.432, 22.726], rad: 8 }, { id: "dusia", t: "e", at: [54.30, 23.70], rad: 8 },
    { id: "kaunomarios", t: "e", at: [54.86, 24.10], rad: 10 },
    { id: "kursiumarios", t: "j", z: "marios", at: [55.35, 21.15] }, { id: "baltija", t: "j", z: "jura", at: [55.75, 20.7] },
    { id: "latvija", t: "k", c: "LVA", at: [56.7, 24.2] }, { id: "baltarusija", t: "k", c: "BLR", at: [54.4, 26.6] }, { id: "lenkija", t: "k", c: "POL", at: [53.9, 22.9] }, { id: "rusija", t: "k", c: "RUS", at: [54.75, 21.8] },
    { id: "siaure", t: "d", d: "N", at: [56.25, 23.8] }, { id: "pietus", t: "d", d: "S", at: [54.05, 24.2] }, { id: "rytai", t: "d", d: "E", at: [55.4, 26.4] }, { id: "vakarai", t: "d", d: "W", at: [55.75, 21.4] },
    { id: "aukstaitija", t: "r", at: [55.65, 25.0] }, { id: "zemaitija", t: "r", at: [55.85, 22.3] }, { id: "dzukija", t: "r", at: [54.28, 24.55] }, { id: "suvalkija", t: "r", at: [54.68, 23.2] }, { id: "mazoji", t: "r", at: [55.42, 21.55] },
    { id: "gediminas", t: "v", m: "pilis", at: [54.687, 25.291] }, { id: "trakupilis", t: "v", m: "pilis", at: [54.652, 24.934] }, { id: "kernave", t: "v", m: "kalva", at: [54.886, 24.853] },
    { id: "kryziukalnas", t: "v", m: "kryziai", at: [56.015, 23.417] }, { id: "kopos", t: "v", m: "kopa", at: [55.286, 20.965] }, { id: "palangostiltas", t: "v", m: "tiltas", at: [55.920, 21.050] },
    { id: "kaunopilis", t: "v", m: "pilis", at: [54.899, 23.885] }, { id: "rumsiskes", t: "v", m: "sodyba", at: [54.867, 24.200] }, { id: "puntukas", t: "v", m: "akmuo", at: [55.484, 25.059] },
    { id: "aukstojas", t: "v", m: "kalva", at: [54.529, 25.625] }, { id: "stelmuze", t: "v", m: "medis", at: [55.824, 26.200] }, { id: "europoscentras", t: "v", m: "stulpas", at: [54.906, 25.319] },
    { id: "ventesragas", t: "v", m: "svyturys", at: [55.341, 21.190] }, { id: "birzupilis", t: "v", m: "pilis", at: [56.203, 24.752] }, { id: "medininkai", t: "v", m: "pilis", at: [54.539, 25.650] },
    { id: "raudone", t: "v", m: "pilis", at: [55.097, 23.130] }, { id: "pazaislis", t: "v", m: "baznycia", at: [54.876, 24.022] }
  ],
  /* ežerai, kurių nėra Natural Earth duomenyse: supaprastinti kontūrai (elipsės) tikroje vietoje ir tikro dydžio: [platuma, ilguma, a km, b km, posūkis °] */
  handLakes: [[55.443, 25.870, 4.7, 0.6, 5], [56.045, 21.858, 3.4, 1.15, 100], [54.662, 24.933, 1.5, 0.75, 110], [54.432, 22.726, 2.9, 1.95, 100], [55.867, 23.303, 2.3, 1.6, 20]],
  /* etnografinių regionų zonos – APYTIKSLĖS (oficialios EKGT ribos eina seniūnijų ribomis ir turi 10–15 km pereinamąsias zonas). [ilguma, platuma]; kas nepatenka – Aukštaitija */
  regions: {
    mazoji: [[20.9, 55.9], [21.07, 55.87], [21.30, 55.86], [21.45, 55.68], [21.62, 55.52], [21.90, 55.38], [22.20, 55.22], [22.45, 55.13], [22.60, 55.04], [22.60, 54.9], [20.9, 54.9]],
    zemaitija: [[20.9, 56.6], [23.05, 56.6], [23.05, 56.30], [23.12, 56.05], [23.36, 55.93], [23.32, 55.70], [23.30, 55.50], [23.45, 55.30], [23.42, 55.06], [23.0, 55.04], [22.60, 55.04], [22.45, 55.13], [22.20, 55.22], [21.90, 55.38], [21.62, 55.52], [21.45, 55.68], [21.30, 55.86], [21.07, 55.87], [20.9, 55.9]],
    suvalkija: [[22.60, 55.04], [23.0, 55.04], [23.42, 55.06], [23.78, 54.94], [23.92, 54.88], [24.0, 54.70], [23.95, 54.58], [23.80, 54.48], [23.50, 54.40], [23.30, 54.33], [23.15, 54.25], [22.6, 54.2], [22.5, 54.6]],
    dzukija: [[24.0, 54.70], [24.45, 54.80], [24.82, 54.80], [25.28, 54.72], [25.80, 54.78], [26.3, 54.7], [26.3, 53.8], [23.3, 53.8], [23.15, 54.25], [23.30, 54.33], [23.50, 54.40], [23.80, 54.48], [23.95, 54.58]]
  },
  regionColor: { aukstaitija: "#bfe6a0", zemaitija: "#f6dc8c", dzukija: "#c9bdf2", suvalkija: "#f7b9c9", mazoji: "#9ee0cf" },
  flights: [
    { id: "s1", n: 8, types: ["m"], first: ["vilnius", "kaunas", "klaipeda"] },
    { id: "s2", n: 8, types: ["u", "e", "j"], first: ["nemunas", "baltija", "neris"] },
    { id: "s3", n: 8, types: ["d", "k"], extra: ["baltija"] },
    { id: "s4", n: 8, types: ["r"], fill: ["telsiai", "alytus", "marijampole", "utena", "klaipeda", "panevezys", "druskininkai", "silute"] },
    { id: "s5", n: 8, types: ["v"] },
    { id: "s6", n: 10, types: ["m", "u", "e", "j", "k", "r", "v"], noLabels: true }
  ]
};
