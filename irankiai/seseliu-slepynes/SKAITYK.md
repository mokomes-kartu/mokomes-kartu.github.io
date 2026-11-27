# „Šešėlių slėpynių“ kambarių įrankiai (ne žaidimo dalis)

Čia – programos, kuriomis kuriami ir tikrinami kambariai. Žaidimui jų nereikia; laikomos tam, kad būtų galima kurti kitus aukštus.
Visos naudoja tą pačią logiką kaip žaidimas (`/seseliu-dirbtuve/slepynes-logika.js`). Paleidžiama su `node` šiame aplanke.

- `solver.js` – tikrintuvas: ar kambarys įveikiamas (su atsarga), ar neįveikiamas be šešėlių / be veiksmų; mažiausias veiksmų skaičius, planas.
- `gen2.js <šablonas> <bandymų> <sėkla> <kiek rodyti> [dėžių] [min. veiksmų] [maks. veiksmų]` – atsitiktinių kambarių paieška pagal lempų šabloną.
- `hand.js` + `check.js` – ranka sudėlioti kambariai (sūris, virvė, kabelis, katinas) ir jų tikrinimas.
- `pick.js` – surenka pasirinktus kambarius iš `out2/` ir `hand.js`, visus dar kartą patikrina; su `WRITE=1` įrašo `slepynes-kambariai.js`.
- `plans.js` + `bot.js` – sprendimo keliai ir botas, kuris kambarius pereina naršyklėje tikru klaviatūros valdymu (reikia `python3 -m http.server 8201` svetainės šaknyje).

## Kaip tikrinama (nuo 2026-11-27)
- Ar įveikiamas – vertinama atsargiai (šešėlio kraštai laikomi apšviestais, juosta iki ~65 %).
- Ar NEįveikiamas kitaip – vertinama palankiausiai žaidėjui (`opt`): visa juosta, be atsargų. Taip tikrinama: be šešėlių, be katino ir be kiekvieno atskiro daikto (kiekvienos dėžės, sūrio, virvės, kabelio) kambarys turi būti neįveikiamas.
- `gazemap.js <nr.>` – parodo, kur katinas kada nors mato (slėptuvėms dėlioti).

## 3 aukštas (2026-11-27)
- `hand3.js` – ranka sudėlioti 3 aukšto kambariai; tikrinami `node check.js <nr.> 3`. `w.js` – žemėlapis ir pasiekiamumas pasirinktoje kambario būsenoje.
- Tikrintuvas moka: jungiklius (akimirksniu), grindų mygtukus (lempa nedega, kol ant mygtuko dėžė ar pati pelytė), groteles (dėžės neužstumiamos), jungiklį su laikmačiu (`reachT` – „langas“, kol lempa užgesusi).
- Žybsinčios lempos (`blink`) logikoje yra, bet tikrintuvas jas vertina tik apytiksliai (`blinkLIM`) – patikimai tinka tik ilgiems kambariams; 9 × 15 kambaryje dėžė beveik niekada nebūna būtina.
