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
- `sok.js` – mažų dėžių galvosūkių paieška 3 eilučių arenoje (naudota 3-6 kambariui); `alt.js <rinkinys> <nr.> <tipas> <i>` – parodo, kaip kambarį galima įveikti be nurodyto veiksmo (kai tikrintuvas sako „nebūtinas“).
- Dėžė kaip skydas: stumiant dėžę link lempos pelytė lieka jos šešėlyje. 3-8 kambaryje tai sprendimo dalis; kitur, kad nesugadintų sumanymo, dėžės ribojamos grotelėmis ar tuneliais.

## Judančios lempos kartu su veiksmais (2026-11-28)
- `solver.js` → `solveTime(lv, o)`: paieška laike per visas kambario būsenas (stūmimas, jungikliai, graužimas; be laikmačių ir katino). Lempų judėjimas turi būti periodinis, o periodas – sveikas pustakčių skaičius (`speedFor(n)`; pvz., 12,5 s = 340 pustakčių). Parinktys kaip `solveStatic` (`opt`, `skip`, `noAct`, `noShadow`), dar `path` (kelias kas pustaktį + veiksmų laikai), `goal`, `from`, `world`, `s0` (pvz., ar pasiekiama tūbelė).
- `check.js`, `pick.js`, `plans.js`, `bot.js` tokius kambarius atpažįsta patys (`isTimeAct`). Botas eina pagal laiką, o veiksmą spaudžia atėjus jo laikui.
- 3-8 „Slėptuvė iš dviejų dėžių“: durų lempa + iš šono šluojantis prožektorius. Derinant paaiškėjo: jei prožektoriaus mostas daug platesnis už spindulį, užtenka vienos dėžės (prabėgama); jei siauresnis – nebeįveikiama net su slėptuve. Tinka tik siaura juosta (mostas ≈ spindulio pusplotis + 0,15); patikrinta (0,5; 0,65), (0,55; 0,7), (0,6; 0,75).
- Dėl šio kambario pakeista `action` (slepynes-logika.js): jei arčiausia dėžė įremta, o greta yra kita, kurią galima pastumti, – stumiama ši. Visi 34 kambariai po pakeitimo patikrinti iš naujo.
