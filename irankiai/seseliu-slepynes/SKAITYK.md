# „Šešėlių slėpynių“ kambarių įrankiai (ne žaidimo dalis)

Čia – programos, kuriomis kuriami ir tikrinami kambariai. Žaidimui jų nereikia; laikomos tam, kad būtų galima kurti kitus aukštus.
Visos naudoja tą pačią logiką kaip žaidimas (`/seseliu-dirbtuve/slepynes-logika.js`). Paleidžiama su `node` šiame aplanke.

- `solver.js` – tikrintuvas: ar kambarys įveikiamas (su atsarga), ar neįveikiamas be šešėlių / be veiksmų; mažiausias veiksmų skaičius, planas.
- `gen2.js <šablonas> <bandymų> <sėkla> <kiek rodyti> [dėžių] [min. veiksmų] [maks. veiksmų]` – atsitiktinių kambarių paieška pagal lempų šabloną.
- `hand.js` + `check.js` – ranka sudėlioti kambariai (sūris, virvė, kabelis, katinas) ir jų tikrinimas.
- `pick.js` – surenka pasirinktus kambarius iš `out2/` ir `hand.js`, visus dar kartą patikrina; su `WRITE=1` įrašo `slepynes-kambariai.js`.
- `plans.js` + `bot.js` – sprendimo keliai ir botas, kuris kambarius pereina naršyklėje tikru klaviatūros valdymu (reikia `python3 -m http.server 8201` svetainės šaknyje).
