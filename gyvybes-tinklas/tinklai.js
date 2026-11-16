/* MokomėsKartu.lt – „Gyvybės tinklas“ (8 kl., biologija): ekosistemų duomenys (kas kuo minta) ir organizmų piešiniai.
   Pavadinimai ir visi tekstai – tekstai.lt.js. Čia tik ryšiai ir SVG piešimas. */
(function(){
"use strict";
const K = "#121a33", S = `stroke="${K}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"`;
const L = (d, w, c) => `<path d="${d}" fill="none" stroke="${c || K}" stroke-width="${w || 2}" stroke-linecap="round" stroke-linejoin="round"/>`;
const C = (x, y, r, f, s) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" ${s === 0 ? "" : S}/>`;
const E = (x, y, rx, ry, f, s, extra) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}" ${s === 0 ? "" : S} ${extra || ""}/>`;
const P = (d, f, extra) => `<path d="${d}" fill="${f}" ${S} ${extra || ""}/>`;
const eye = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r || 1.8}" fill="${K}"/>`;

/* ---------- augalai ---------- */
const tree = (c1, c2, fr) => `<rect x="28" y="36" width="8" height="22" rx="2" fill="#8a5a2b" ${S}/>${C(21, 31, 12, c1)}${C(43, 31, 12, c1)}${C(32, 20, 14, c2)}${E(32, 31, 13, 8, c1, 0)}${fr ? [[22, 30], [40, 34], [33, 18], [44, 24], [26, 20]].map(p => C(p[0], p[1], 3.2, fr)).join("") : ""}`;
const conifer = () => `<rect x="29" y="50" width="6" height="9" fill="#8a5a2b" ${S}/>${P("M32 28 54 52H10Z", "#2f7d4f")}${P("M32 16 50 38H14Z", "#3a9460")}${P("M32 5 45 24H19Z", "#49a870")}`;
const bush = (c, dot) => `${L("M8 56H56", 2)}${P("M10 55q-7-14 7-19q1-14 15-13q13-1 15 13q14 5 7 19Z", c)}${[[20, 42], [32, 32], [44, 42], [27, 49], [39, 50], [33, 42]].map(p => C(p[0], p[1], 3.2, dot)).join("")}`;
const grass = () => `${[[10, 26, -4], [18, 12, 2], [27, 20, -3], [35, 8, 3], [44, 18, -2], [52, 28, 4]].map(([x, y, k]) => P(`M${x - 3} 58Q${x + k - 2} ${y + 18} ${x + k * 2} ${y}Q${x + k + 4} ${y + 20} ${x + 4} 58Z`, "#5fb84a")).join("")}${L("M6 58H58", 2)}`;
const flower = (pet, cen, n, leaf) => { let s = L("M32 58V30", 3, "#2f7d4f") + (leaf || P("M32 50q-12-2-14-12q12 0 14 12Z", "#5fb84a") + P("M32 46q12-2 14-12q-12 0-14 12Z", "#5fb84a")); for(let i = 0; i < n; i++){ const a = i / n * 6.283; s += C(32 + 10 * Math.cos(a), 20 + 10 * Math.sin(a), 6, pet); } return s + C(32, 20, 6, cen); };
const clover = () => `${L("M32 58V34M32 52q-10-2-13-8M32 50q10-2 13-8", 3, "#2f7d4f")}${C(15, 41, 6, "#5fb84a")}${C(49, 39, 6, "#5fb84a")}${C(32, 20, 12, "#e86aa6")}${L("M26 14q2 3 0 6M32 11q2 4 0 8M38 14q-2 3 0 6M27 24q3 2 0 5M37 24q-3 2 0 5", 1.6, "#a83a72")}`;
const thistle = () => `${L("M32 58V30", 3, "#2f7d4f")}${P("M32 52 20 48 24 44 14 40 22 38 18 32 32 40Z", "#5fb84a")}${P("M32 48 44 44 40 40 50 36 42 34 46 28 32 36Z", "#5fb84a")}${P("M22 30q0-12 10-12q10 0 10 12q-10 5-20 0Z", "#4a9a55")}${P("M23 19 20 8 26 15 28 5 32 14 36 5 38 15 44 8 41 19Z", "#a35bd6")}`;
const reed = () => `${L("M20 58V16M34 58V8M46 58V20", 2.6, "#4a8a3c")}${P("M34 58q14-10 20-26q-14 8-20 26Z", "#6cbf55")}${P("M20 58q-10-8-13-20q10 6 13 20Z", "#6cbf55")}<rect x="17" y="10" width="6" height="16" rx="3" fill="#8a5a2b" ${S}/><rect x="31" y="4" width="6" height="18" rx="3" fill="#8a5a2b" ${S}/><rect x="43" y="14" width="6" height="15" rx="3" fill="#8a5a2b" ${S}/>${L("M4 58q7-4 14 0t14 0t14 0t14 0", 2.4, "#2a8fc4")}`;
const lily = () => `${E(32, 40, 28, 16, "#bfe6f7")}${E(20, 38, 10, 6, "#5fb84a")}${E(42, 34, 9, 5.5, "#6cc457")}${E(34, 46, 11, 6, "#4fa843")}${E(49, 44, 6, 3.6, "#6cc457")}${L("M20 38h8M42 34h7M34 46h9", 1.6)}`;
const drop = () => `${C(32, 32, 26, "#cfeefa")}`;
const phyto = () => `${drop()}${C(22, 24, 6, "#5fc04a")}${E(40, 22, 9, 4.5, "#7dd15a", 1, `transform="rotate(20 40 22)"`)}${C(44, 40, 7, "#49a83d")}${E(25, 42, 8, 4, "#8bdc62", 1, `transform="rotate(-30 25 42)"`)}${C(33, 32, 3.4, "#5fc04a")}${C(22, 24, 1.6, "#2f7d2f", 0)}${C(44, 40, 2, "#2f7d2f", 0)}`;
const zoo = () => `${drop()}${P("M22 36q0-16 14-16q12 0 12 14q0 14-13 14q-13 0-13-12Z", "#f7d9b0")}${C(40, 28, 3, K, 0)}${L("M36 20q-6-10-16-8M34 20q-10-4-18 2M22 44l-6 8M30 40q4 2 8 0M30 35q4 2 8 0", 1.8)}${C(32, 38, 3.2, "#e8935a", 0)}`;
const seaweed = c => `${L("M32 58V40M32 48q-10-6-13-20M32 46q10-8 13-22M32 40q-3-14 1-30M19 28q-5-6-4-14M45 24q5-6 4-14", 7, K)}${L("M32 58V40M32 48q-10-6-13-20M32 46q10-8 13-22M32 40q-3-14 1-30M19 28q-5-6-4-14M45 24q5-6 4-14", 4, c)}${L("M10 59H54", 2)}`;
const wheat = () => `${[[18, 4], [32, 0], [46, 5]].map(([x, o]) => `${L(`M${x} 58V${22 + o}`, 2.4, "#b98a1e")}${[0, 1, 2].map(i => E(x - 4, 12 + o + i * 7, 4, 5.5, "#f2c443", 1, `transform="rotate(-25 ${x - 4} ${12 + o + i * 7})"`) + E(x + 4, 12 + o + i * 7, 4, 5.5, "#f2c443", 1, `transform="rotate(25 ${x + 4} ${12 + o + i * 7})"`)).join("")}${E(x, 6 + o, 3.6, 5.5, "#f2c443")}`).join("")}`;
const cabbage = () => `${P("M8 48q-4-14 8-16q-4 12 6 20Z", "#5fa84a")}${P("M56 48q4-14-8-16q4 12-6 20Z", "#5fa84a")}${C(32, 36, 20, "#a8dc8a")}${L("M32 16q-14 8-10 26M32 16q14 8 10 26M22 30q10-6 20 0M32 16v38", 1.8, "#4a8a3c")}`;
const strawb = () => `${P("M14 26q-2-10 6-14q4 6 2 14Z", "#5fb84a")}${P("M50 26q2-10-6-14q-4 6-2 14Z", "#5fb84a")}${P("M32 58q-22-12-18-28q6-8 18-4q12-4 18 4q4 16-18 28Z", "#e63946")}${P("M22 24l10-8l10 8l-10 4Z", "#3a9460")}${[[24, 34], [32, 38], [40, 34], [28, 44], [36, 46], [32, 30]].map(p => C(p[0], p[1], 1.4, "#ffe08a", 0)).join("")}`;

/* ---------- bestuburiai ---------- */
const snail = (shell, water) => `${P("M8 52q-2-10 8-10h30l8-10q4 2 2 8q-2 12-12 12Z", water ? "#b9a27a" : "#e8c79a")}${L("M52 34l2-8M56 36l5-6", 2)}${C(30, 34, 15, shell)}${L("M30 34q5-1 4-6q-2-5-8-3q-6 3-4 10q3 7 11 5", 2)}`;
const slug = () => `${P("M6 50q2-14 20-14h14q8 0 12-8q6 2 4 10q-2 12-14 12Z", "#b5713c")}${L("M52 28l1-8M56 30l5-7", 2)}${P("M22 37q6-8 16-2q-2 6-16 2Z", "#d08a52")}${eye(53, 33, 1.4)}`;
const mussel = () => `${P("M8 46Q8 16 38 12Q58 20 54 40Q34 56 8 46Z", "#2f4b8f")}${L("M12 44Q20 22 40 16M18 46Q28 28 46 22M26 48Q36 36 50 30", 1.8, "#8fa8dc")}`;
const amph = () => `${[[14, 40, 6], [20, 30, 7], [29, 23, 8], [39, 22, 8], [48, 27, 7], [53, 36, 6]].map(p => C(p[0], p[1], p[2], "#e3b56b")).join("")}${L("M20 36l-4 10M27 31l-2 11M35 30v11M43 31l3 10M52 42l4 6M10 44l-4 6", 1.8)}${eye(52, 34, 1.5)}${L("M56 32l5-6M55 30l2-8", 1.6)}`;
const beetle = (body, head, spots) => `${L("M18 28l-9-5M46 28l9-5M17 38H7M47 38h10M19 48l-8 7M45 48l8 7", 2.2)}${C(32, 15, 7.5, head)}${E(32, 38, 15, 18, body)}${L("M32 21v34", 1.8)}${(spots || []).map(p => C(p[0], p[1], 3, K, 0)).join("")}${L("M28 9l-4-6M36 9l4-6", 1.8)}`;
const aphid = () => `${L("M22 44l-6 10M32 46v10M42 44l6 10M46 26l8-10M42 24l2-12", 2)}${P("M12 36q0-14 16-14q20 0 22 10q2 14-18 14q-20 0-20-10Z", "#8fd45a")}${C(46, 30, 2, K, 0)}${L("M12 34l-6-4M12 38l-6 2", 1.8)}`;
const hopper = () => `${L("M30 40l-6 14M40 38l2 14M52 26l8-12M50 24l2-14", 2)}${E(30, 34, 22, 8, "#6cc457", 1, `transform="rotate(-8 30 34)"`)}${C(50, 28, 7, "#58ad47")}${P("M24 34 12 12 16 10 34 36Z", "#4a9a3c")}${L("M12 12 4 40", 2.2)}${eye(53, 26)}`;
const cater = c => `${[[12, 42], [22, 36], [32, 40], [42, 36]].map(p => C(p[0], p[1], 8, c)).join("")}${C(52, 40, 8, "#3f8f3a")}${L("M12 50v5M22 44v6M32 48v6M42 44v6", 2)}${eye(55, 38)}${L("M54 32l3-6M50 32l-1-6", 1.6)}`;
const bee = () => `${E(22, 22, 11, 7, "#d8f0ff", 1, `transform="rotate(-25 22 22)"`)}${E(38, 20, 11, 7, "#d8f0ff", 1, `transform="rotate(20 38 20)"`)}${E(30, 40, 19, 13, "#ffc61a")}<path d="M24 28v24M34 27v26" stroke="${K}" stroke-width="5" fill="none"/>${C(50, 38, 7.5, "#3a3020")}${L("M54 32l5-6M51 31l1-7", 1.8)}${C(52, 37, 1.3, "#fff", 0)}`;
const nymph = () => `${L("M22 30l-10-8M22 36H9M24 42l-9 8M38 30l8-9M40 38h10M36 44l8 8", 2)}${P("M14 44q-4-10 6-18q8-6 20-4q10 2 12 10q0 6-8 6q-8 12-20 14q-8 0-10-8Z", "#8f9a52")}${L("M24 34q4 6 12 2M20 42q6 4 14-2", 1.6)}${C(44, 26, 4, "#3a3020")}${C(50, 32, 4, "#3a3020")}`;
const tick = (c, legs) => `${L("M22 28l-12-8M20 34H7M20 40l-12 6M24 46l-9 11M42 28l12-8M44 34h13M44 40l12 6M40 46l9 11", 2.2)}${E(32, 38, 14, 16, c)}${C(32, 19, 6, "#5a2d1a")}${legs ? "" : L("M26 34q6-6 12 0", 1.6)}`;
const worm = () => `${L("M8 44q8-18 16-2t16-2t16-10", 12, K)}${L("M8 44q8-18 16-2t16-2t16-10", 8, "#f08fa0")}${L("M26 39l3 6", 1.6, "#c05a70")}${L("M31 44l3-5", 1.6, "#c05a70")}`;
const mold = () => `${P("M6 44Q14 16 40 12Q58 12 58 24Q52 50 22 54Q10 54 6 44Z", "#b07a3c")}${L("M12 46Q30 30 54 18", 1.8, "#7a4f1f")}${[[24, 36, 7], [38, 28, 8], [44, 40, 5], [30, 24, 4.5]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="${p[2]}" fill="#d9e8d2" stroke="${K}" stroke-width="1.6" stroke-dasharray="1.5 3" stroke-linecap="round"/>`).join("")}`;
const bact = () => `${C(30, 30, 22, "#eaf6ff")}<rect x="40" y="48" width="18" height="7" rx="3.5" fill="#8a5a2b" ${S} transform="rotate(45 44 48)"/>${[[20, 22, 30], [34, 20, -20], [24, 36, -40], [38, 34, 50], [30, 28, 80]].map(p => `<rect x="${p[0] - 6}" y="${p[1] - 2.6}" width="12" height="5.2" rx="2.6" fill="#7bc8a4" stroke="${K}" stroke-width="1.5" transform="rotate(${p[2]} ${p[0]} ${p[1]})"/>`).join("")}`;

/* ---------- žuvys, varliagyviai, ropliai ---------- */
const fish = o => { const h = o.h || 11, rx = o.rx || 20; return `${P(`M${28 + rx - 4} 32L60 ${32 - h}V${32 + h}Z`, o.fin)}${P(`M22 ${32 - h + 2}q8-${o.dors || 9} 16 0Z`, o.fin)}${E(28, 32, rx, h, o.body)}${o.belly ? `<path d="M${28 - rx + 3} 34q${rx - 3} ${h + 2} ${2 * rx - 8} 0q-${rx - 4} ${h - 4}-${2 * rx - 8} 0Z" fill="${o.belly}"/>` : ""}${o.str ? [22, 29, 36, 42].map(x => L(`M${x} ${32 - h + 3}v${h + 2}`, 2.6, o.str)).join("") : ""}${o.spots ? [[22, 30], [30, 34], [36, 29], [28, 27], [40, 34]].map(p => C(p[0], p[1], 1.6, o.spots, 0)).join("") : ""}${L(`M${28 - rx + 9} ${32 - h * .6}q3 ${h * .6} 0 ${h * 1.2}`, 1.6)}${P(`M26 ${32 + h * .5}l6 ${h * .5 + 3}l4-${h * .5 + 1}Z`, o.fin)}${eye(28 - rx + 6, 30, 2)}`; };
const flat = () => `${P("M10 34Q20 10 42 14Q54 18 54 34Q52 52 34 54Q14 54 10 34Z", "#b08a52")}${P("M50 32l10-8v18Z", "#8f6c3a")}${[[24, 26], [36, 22], [42, 36], [28, 42], [34, 33]].map(p => C(p[0], p[1], 2.6, "#f08a2c", 0)).join("")}${eye(18, 30, 2)}${eye(22, 38, 2)}${L("M12 40q3 2 5 0", 1.6)}`;
const frog = (c, warts) => `${P("M8 54q-2-10 8-12l6 6Z", c)}${P("M56 54q2-10-8-12l-6 6Z", c)}${E(32, 42, 19, 13, c)}${E(32, 46, 11, 7, "#f3efc8", 0)}${C(22, 26, 7, c)}${C(42, 26, 7, c)}${C(22, 25, 3.4, "#fff")}${C(42, 25, 3.4, "#fff")}${eye(22, 25, 1.6)}${eye(42, 25, 1.6)}${L("M24 37q8 5 16 0", 2)}${warts ? [[18, 40], [46, 42], [30, 33], [40, 50]].map(p => C(p[0], p[1], 1.8, "#6b4a2a", 0)).join("") : ""}${L("M10 56h10M44 56h10", 2.4)}`;
const lizard = () => `${L("M24 26l-10-6M26 38l-12 6M40 26l8-8M42 36l10 6", 2.4)}${L("M54 12Q40 14 36 28T16 44Q8 46 6 56", 11, K)}${L("M54 12Q40 14 36 28T16 44Q8 46 6 56", 7, "#8fa84a")}${L("M46 15Q40 18 37 28", 2, "#5d7a2a")}${eye(52, 11, 1.5)}`;
const snake = () => `${L("M50 14Q30 10 28 24T44 40T22 54H10", 12, K)}${L("M50 14Q30 10 28 24T44 40T22 54H10", 8, "#4a4f45")}${C(47, 15, 3, "#ffd21f", 0)}${eye(53, 12, 1.4)}${L("M57 15l5 1", 1.6, "#e63946")}`;

/* ---------- paukščiai ---------- */
const bird = o => `${L("M26 46v10M34 46v10M22 56h8M30 56h8", 2)}${P("M14 40 2 46 4 36Z", o.wing)}${E(28, 36, 17, 12, o.body, 1, `transform="rotate(-12 28 36)"`)}${o.belly ? `<path d="M16 40q10 10 26 0q-10 12-26 0Z" fill="${o.belly}"/>` : ""}${P("M14 36q10-10 22-2q-8 8-22 2Z", o.wing)}${C(44, 22, 9, o.head || o.body)}${o.cheek ? E(45, 25, 5, 4, o.cheek, 0) : ""}${o.cap ? `<path d="M36 20q8-9 16 0q-8-4-16 0Z" fill="${o.cap}" ${S}/>` : ""}${P(`M52 20l${o.beak || 7} 3l-${o.beak || 7} 3Z`, o.bk || "#f0a800")}${eye(46, 20)}`;
const raptor = o => `${L("M6 54H58", 4, "#8a5a2b")}${L("M26 50v4M38 50v4", 3, "#f0a800")}${P("M32 60l-7-14h14Z", o.wing)}${E(32, 36, 14, 18, o.body)}${E(32, 40, 8, 11, o.belly, 0)}${L("M27 34h10M26 40h12M28 46h8", 1.6, o.bar || "#7a4f1f")}${P("M18 28q-4 14 4 22q2-12 0-22Z", o.wing)}${P("M46 28q4 14-4 22q-2-12 0-22Z", o.wing)}${C(32, 15, 10, o.head || o.body)}${P("M29 16h6l-1 6q-2 3-4 0Z", "#f0a800")}${C(27, 13, 2.6, "#ffd21f")}${C(37, 13, 2.6, "#ffd21f")}${eye(27, 13, 1.2)}${eye(37, 13, 1.2)}`;
const owl = () => `${L("M6 56H58", 4, "#8a5a2b")}${E(32, 36, 17, 20, "#9a6b3c")}${E(32, 42, 10, 12, "#f1dcae", 0)}${L("M27 38q2 2 4 0M33 38q2 2 4 0M30 45q2 2 4 0", 1.6, "#9a6b3c")}${P("M15 30q-5 12 3 22q2-10 0-22Z", "#7a4b2a")}${P("M49 30q5 12-3 22q-2-10 0-22Z", "#7a4b2a")}${C(25, 24, 8, "#fff")}${C(39, 24, 8, "#fff")}${C(25, 24, 3.6, K, 0)}${C(39, 24, 3.6, K, 0)}${P("M29 28h6l-3 6Z", "#f0a800")}`;
const wader = o => `${L("M26 40v18M34 40v18M22 58h6M30 58h6", 2.2, o.leg)}${P("M12 36 2 40 8 28Z", o.wing)}${E(26, 32, 16, 10, o.body)}${P("M12 32q10-8 22 0q-10 6-22 0Z", o.wing)}${L("M38 30Q46 26 42 16T48 8", 8, K)}${L("M38 30Q46 26 42 16T48 8", 4.5, o.neck || o.body)}${C(48, 8, 5.5, o.neck || o.body)}${P("M53 6l10 4l-10 2Z", o.bk)}${eye(49, 7, 1.4)}${o.crest ? L("M44 6l-8-2", 2) : ""}`;
const duck = o => `${L("M2 50q7-4 14 0t14 0t14 0t14 0", 2.4, "#2a8fc4")}${P("M6 40q2 12 22 12q20 0 24-10q-4-8-18-8q-14 0-28 6Z", o.body)}${o.wing ? P("M16 40q10-6 24 0q-10 6-24 0Z", o.wing) : ""}${L(o.long ? "M44 38Q52 30 44 20T48 10" : "M44 36Q48 30 46 22", 9, K)}${L(o.long ? "M44 38Q52 30 44 20T48 10" : "M44 36Q48 30 46 22", 5.5, o.neck || o.body)}${C(o.long ? 48 : 46, o.long ? 10 : 20, 6.5, o.head || o.body)}${P(o.long ? "M53 8l9 3l-9 3Z" : "M51 18l9 3l-9 3Z", o.bk)}${eye(o.long ? 49 : 47, o.long ? 9 : 19, 1.4)}${o.tail ? L("M8 40l-6-10", 2.4) : ""}`;

/* ---------- žinduoliai ---------- */
const mammal = o => { const rx = o.rx || 17, ry = o.ry || 10, ll = o.leg || 10, by = 54 - ll - ry + 3, hx = o.neck ? 49 : 47, hy = o.neck ? by - 14 : by - 5, hr = o.hr || 8, c = o.c, d = o.d || c;
  let s = "";
  if(o.tail === "bushy") s += P(`M${30 - rx + 3} ${by}q-16 2-14-16q2-10 10-8q-4 12 8 16Z`, d);
  else if(o.tail === "fox") s += P(`M${30 - rx + 4} ${by}q-12 2-18 10q4 6 12 2q6-3 8-8Z`, d) + P(`M2 ${by + 9}q2 6 8 4q-2-4-8-4Z`, "#fff");
  else if(o.tail === "thin") s += L(`M${30 - rx + 2} ${by}q-10-2-12-12`, 2.6, o.tc || K);
  else if(o.tail === "long") s += L(`M${30 - rx + 2} ${by + 2}q-12 2-12-12`, 6, K) + L(`M${30 - rx + 2} ${by + 2}q-12 2-12-12`, 3.2, d);
  else if(o.tail === "flat") s += E(30 - rx - 2, by + 6, 9, 4.5, "#5a3d22", 1, `transform="rotate(20 ${30 - rx - 2} ${by + 6})"`);
  else if(o.tail === "short") s += C(30 - rx, by - 1, 3.6, o.tc || "#fff");
  else if(o.tail === "otter") s += P(`M${30 - rx + 4} ${by - 2}q-14 4-18 14q10 0 20-6Z`, d);
  const lw = o.lw || 5; [30 - rx * .55, 30 - rx * .2, 30 + rx * .3, 30 + rx * .65].forEach(x => { s += `<rect x="${x - lw / 2}" y="${by + ry - 4}" width="${lw}" height="${ll + 1}" rx="2" fill="${d}" ${S}/>`; });
  if(o.neck) s += P(`M${30 + rx - 10} ${by - 2}L${hx - 6} ${hy + 2}L${hx + 4} ${hy + 6}L${30 + rx - 1} ${by + 4}Z`, c);
  s += E(30, by, rx, ry, c);
  if(o.belly) s += `<path d="M${30 - rx + 4} ${by + 3}q${rx - 4} ${ry} ${2 * rx - 8} 0q-${rx - 4} ${ry - 3}-${2 * rx - 8} 0Z" fill="${o.belly}"/>`;
  if(o.spots) s += [[22, by - 3], [30, by + 2], [36, by - 4], [26, by + 4], [40, by + 2]].map(p => C(p[0], p[1], 1.5, o.spots, 0)).join("");
  if(o.ear === "long") s += P(`M${hx - 3} ${hy - 5}q-6-16 0-20q5 6 4 19Z`, c) + P(`M${hx + 2} ${hy - 6}q-1-16 5-19q4 8-1 19Z`, c);
  else if(o.ear === "point") s += P(`M${hx - 6} ${hy - 4}l1-10l7 6Z`, c) + P(`M${hx + 1} ${hy - 7}l5-8l3 10Z`, c);
  else if(o.ear === "tuft") s += P(`M${hx - 6} ${hy - 4}l0-11l7 7Z`, c) + P(`M${hx + 1} ${hy - 7}l5-9l3 11Z`, c) + L(`M${hx - 6} ${hy - 15}l-2-4M${hx + 6} ${hy - 16}l1-4`, 1.8);
  else s += C(hx - 4, hy - 6, 3.6, c) + C(hx + 3, hy - 7, 3.6, c);
  s += C(hx, hy, hr, c);
  s += E(hx + hr - 1, hy + 2, o.sn || 5, 3.8, o.snc || c) + C(hx + hr + (o.sn || 5) - 3, hy + 1, 1.7, K, 0) + eye(hx + 1, hy - 2, 1.6);
  if(o.horn) s += L(`M${hx - 2} ${hy - 8}l-2-9M${hx + 3} ${hy - 8}l3-9`, 2);
  return s; };
const hedgehog = () => `${P("M6 50 4 42 9 40 7 32 13 32 13 24 19 26 21 18 27 22 31 15 35 22 41 18 42 26 48 26 46 34 50 46Z", "#7a5a3a")}${P("M40 50q0-12 10-12q8 2 12 10q-2 4-10 2Z", "#f1dcae")}${C(61, 47, 2, K, 0)}${eye(52, 44, 1.6)}${L("M12 52h6M30 52h6M44 52h6", 3)}${L("M8 50H52", 2)}`;
const seal = () => `${P("M4 50q10-2 14-10q6-14 20-16q4-8 12-8q8 2 8 10q0 8-8 10q2 12-10 16q-14 4-36-2Z", "#8d99a6")}${P("M30 44q4 10 14 8q-2-8-14-8Z", "#6f7b88")}${P("M4 50l-2-8l8 4Z", "#6f7b88")}${[[26, 36], [34, 32], [22, 44], [40, 40]].map(p => C(p[0], p[1], 1.6, "#5a6672", 0)).join("")}${eye(50, 22, 1.8)}${C(57, 25, 1.6, K, 0)}${L("M54 28l6 2M54 29l5 4", 1.2)}`;

const IC = {
  azuolas: () => tree("#4e9f4e", "#63b85a", "#b07a3c"), egle: conifer, melyne: () => bush("#4e9f4e", "#3d4fb0"), lazdynas: () => bush("#6cb85a", "#a0662e"),
  zole: grass, dobilas: clover, kiaulpiene: () => flower("#ffd21f", "#f0a800", 8, P("M32 54 18 50 22 46 14 44 22 40 32 46Z", "#5fb84a") + P("M32 52 46 48 42 44 50 42 42 38 32 44Z", "#5fb84a")),
  fitopl: phyto, nendre: reed, plude: lily, banguolis: () => seaweed("#b0344f"),
  kvieciai: wheat, usnis: thistle, rugiagele: () => flower("#3f6fe0", "#27348a", 9), obelis: () => tree("#4e9f4e", "#63b85a", "#e63946"), kopustas: cabbage, braske: strawb, barstis: () => flower("#fff", "#e8f0c8", 10, P("M32 54 14 50 20 44 10 40 22 36 32 44Z", "#4a9a3c") + P("M32 52 50 48 44 42 54 38 42 34 32 42Z", "#4a9a3c")),
  vovere: () => mammal({ c: "#d9762b", d: "#b85a1c", tail: "bushy", belly: "#fff3dc", ear: "point", rx: 13, ry: 9, leg: 7, hr: 7, sn: 4 }),
  pele: () => mammal({ c: "#b08d6a", d: "#8f6c4a", tail: "thin", tc: "#e8a0a8", belly: "#f6ead8", rx: 13, ry: 8, leg: 4, hr: 7, sn: 5, lw: 4 }),
  pelenas: () => mammal({ c: "#8f8474", d: "#6e6456", tail: "short", tc: "#6e6456", belly: "#d9d2c4", rx: 15, ry: 9, leg: 3, hr: 7, sn: 4, lw: 4 }),
  stirna: () => mammal({ c: "#c98a4a", d: "#a56c32", tail: "short", belly: "#f6ead8", ear: "point", rx: 15, ry: 8, leg: 18, neck: 1, hr: 6.5, sn: 5, lw: 3.6 }),
  kiskis: () => mammal({ c: "#b89a72", d: "#967a54", tail: "short", belly: "#f6ead8", ear: "long", rx: 14, ry: 10, leg: 8, hr: 7.5, sn: 4 }),
  lape: () => mammal({ c: "#e8792b", d: "#c25a1a", tail: "fox", belly: "#fff3dc", ear: "point", rx: 15, ry: 8, leg: 11, hr: 7, sn: 6, snc: "#fff3dc", lw: 4 }),
  vilkas: () => mammal({ c: "#8a8f98", d: "#6b7078", tail: "long", belly: "#d9dde3", ear: "point", rx: 17, ry: 9, leg: 14, hr: 8, sn: 7, lw: 4.5 }),
  lusis: () => mammal({ c: "#d9a55c", d: "#b8843c", tail: "short", tc: "#3a3020", belly: "#f6ead8", ear: "tuft", spots: "#7a4f1f", rx: 16, ry: 9, leg: 14, hr: 8, sn: 4, lw: 5 }),
  kiaune: () => mammal({ c: "#7a4b2a", d: "#5a3418", tail: "otter", belly: "#ffd98a", ear: "round", rx: 17, ry: 7, leg: 6, hr: 6.5, sn: 5, lw: 4 }),
  zebenkstis: () => mammal({ c: "#b5713c", d: "#8f5426", tail: "thin", tc: "#8f5426", belly: "#fff", ear: "round", rx: 18, ry: 6, leg: 5, hr: 6, sn: 4, lw: 3.6 }),
  bebras: () => mammal({ c: "#7a5230", d: "#5a3a1e", tail: "flat", belly: "#a87a50", rx: 17, ry: 11, leg: 4, hr: 8, sn: 5 }),
  udra: () => mammal({ c: "#6b4a30", d: "#523620", tail: "otter", belly: "#d9c4a4", rx: 18, ry: 8, leg: 5, hr: 7, sn: 5, snc: "#d9c4a4", lw: 4.5 }),
  kate: () => mammal({ c: "#f0a04a", d: "#c97a2a", tail: "long", belly: "#fff3dc", ear: "point", rx: 15, ry: 9, leg: 10, hr: 8, sn: 3.5, snc: "#fff3dc", lw: 4.5 }),
  audine: () => mammal({ c: "#3a2a20", d: "#241812", tail: "otter", ear: "round", rx: 18, ry: 7, leg: 5, hr: 6.5, sn: 4.5, snc: "#f1e6d6", lw: 4 }),
  mangutas: () => mammal({ c: "#9a8468", d: "#3a3020", tail: "fox", belly: "#c9b89a", ear: "round", rx: 16, ry: 10, leg: 7, hr: 8, sn: 5, snc: "#3a3020", lw: 4.5 }),
  ezys: hedgehog, ruonis: seal,
  kinivarpa: () => beetle("#6b4226", "#3a2416"), boruze: () => beetle("#e63946", "#1c1c28", [[26, 30], [38, 30], [24, 42], [40, 42], [28, 50], [36, 50]]), meslavabalis: () => beetle("#2b3350", "#1c1c28"),
  viksras: () => cater("#8fd45a"), amaras: aphid, skeriukas: hopper, kamane: bee, sraige: () => snail("#d99a4a"), kudrinuke: () => snail("#7a6a4a", 1), sliuzas: slug,
  zoopl: zoo, midija: mussel, soniplauka: amph, lerva: nymph,
  zyle: () => bird({ body: "#f2d23c", wing: "#5f7fa8", head: "#1c1c28", cheek: "#fff", bk: "#3a3020", beak: 5 }),
  genys: () => bird({ body: "#f4f1e8", wing: "#1c1c28", head: "#f4f1e8", cap: "#e63946", bk: "#5a5a66", beak: 11, belly: "#e86a5a" }),
  dagilis: () => bird({ body: "#c9a06a", wing: "#ffd21f", head: "#fff", cap: "#e63946", bk: "#f1dcae", beak: 6 }),
  strazdas: () => bird({ body: "#3a3a44", wing: "#26262e", bk: "#f0a800", beak: 8 }),
  kurapka: () => bird({ body: "#b0a08a", wing: "#8a6a4a", head: "#e89a5a", belly: "#7a4b2a", bk: "#d9c9a4", beak: 5 }),
  vanagas: () => raptor({ body: "#6f7b88", wing: "#525d69", belly: "#f4efe4", bar: "#b0623a" }),
  suopis: () => raptor({ body: "#8a5a34", wing: "#6b4226", belly: "#f1dcae", bar: "#8a5a34" }),
  zuvininkas: () => raptor({ body: "#5a4636", wing: "#46362a", belly: "#fff", head: "#fff", bar: "#c9b89a" }),
  peleda: owl,
  gandras: () => wader({ body: "#fff", wing: "#1c1c28", bk: "#e63946", leg: "#e63946" }),
  garnys: () => wader({ body: "#9aa6b4", wing: "#5f6b7a", neck: "#e9eef3", bk: "#f0a800", leg: "#8a7a4a", crest: 1 }),
  gulbe: () => duck({ body: "#fff", bk: "#f08a2c", long: 1 }),
  ledine: () => duck({ body: "#f4f1e8", wing: "#3a3020", head: "#f4f1e8", bk: "#e89a9a", tail: 1 }),
  kormoranas: () => duck({ body: "#26262e", wing: "#1c1c28", bk: "#d9c44a", long: 1 }),
  kuoja: () => fish({ body: "#c9d3dc", belly: "#f4f6f8", fin: "#e8563a", h: 11 }),
  auksle: () => fish({ body: "#a8c4d8", belly: "#f4f6f8", fin: "#8fa8b8", h: 7, rx: 19, dors: 5 }),
  eserys: () => fish({ body: "#9ab84a", belly: "#f1edc0", fin: "#e8563a", str: "#3d5a1e", h: 11, dors: 12 }),
  lydeka: () => fish({ body: "#6b8f4a", belly: "#e9edc4", fin: "#8a7a3a", spots: "#e9edc4", h: 7.5, rx: 23, dors: 5 }),
  strimele: () => fish({ body: "#7fa8c9", belly: "#f4f6f8", fin: "#5f88a8", h: 8, rx: 20, dors: 6 }),
  sprotas: () => fish({ body: "#9ab4c4", belly: "#f4f6f8", fin: "#7a94a4", h: 6.5, rx: 17, dors: 5 }),
  menke: () => fish({ body: "#a89868", belly: "#f1ecd8", fin: "#8a7a4a", spots: "#6b5a30", h: 10, rx: 22, dors: 8 }),
  lasisa: () => fish({ body: "#b8c4d0", belly: "#f6d9d0", fin: "#8a96a4", spots: "#3a3a44", h: 9.5, rx: 22, dors: 7 }),
  grundalas: () => fish({ body: "#6b6458", belly: "#b8ae9a", fin: "#3a342c", h: 10, rx: 18, dors: 13 }),
  plekšne: flat,
  varle: () => frog("#7ab648"), rupuze: () => frog("#a8824a", 1), driezas: lizard, zaltys: snake,
  sliekas: worm, bakterijos: bact, pelesis: mold, erke: () => tick("#8a4a2a"), blusa: () => tick("#5a3418", 1)
};

/* ---------- ekosistemos: eats[ėdikas] = [maistas…]; soft – ryšiai, kurie gamtoje pasitaiko, bet tinkle nežymimi ---------- */
const ECO = [
  { id: "miskas", nat: true,
    eats: { vovere: ["egle", "lazdynas", "azuolas"], pele: ["azuolas", "lazdynas", "melyne"], stirna: ["melyne", "azuolas", "lazdynas"], kinivarpa: ["egle"], viksras: ["azuolas"],
      zyle: ["viksras"], genys: ["kinivarpa", "egle"], kiaune: ["vovere", "pele", "zyle"], lape: ["pele"], peleda: ["pele"], vilkas: ["stirna"], lusis: ["stirna"], vanagas: ["zyle", "genys"] },
    sk: ["sliekas", "bakterijos", "pelesis"], par: ["erke"],
    inv: { id: "mangutas", eats: ["pele"], by: [] } },
  { id: "pieva", nat: true,
    eats: { skeriukas: ["zole", "dobilas"], pelenas: ["zole", "dobilas", "kiaulpiene"], kiskis: ["dobilas", "zole", "kiaulpiene"], sraige: ["kiaulpiene", "dobilas"], kamane: ["dobilas", "kiaulpiene"],
      varle: ["skeriukas", "sraige"], driezas: ["skeriukas"], zaltys: ["varle"], gandras: ["varle", "pelenas", "skeriukas", "driezas"], lape: ["pelenas", "kiskis"], suopis: ["pelenas"] },
    sk: ["sliekas", "meslavabalis", "bakterijos"], par: ["erke"] },
  { id: "ezeras", nat: true,
    eats: { zoopl: ["fitopl"], kudrinuke: ["plude"], gulbe: ["plude"], bebras: ["nendre"], kuoja: ["zoopl", "kudrinuke", "plude"], auksle: ["zoopl"], lerva: ["zoopl"],
      eserys: ["auksle", "lerva", "zoopl"], lydeka: ["kuoja", "auksle", "eserys"], garnys: ["kuoja", "auksle", "eserys"], udra: ["kuoja", "eserys", "lydeka"], zuvininkas: ["lydeka", "kuoja"] },
    sk: ["bakterijos"], par: [],
    inv: { id: "audine", eats: ["kuoja", "eserys"], by: [] } },
  { id: "jura", nat: true,
    eats: { zoopl: ["fitopl"], midija: ["fitopl"], soniplauka: ["banguolis"], strimele: ["zoopl"], sprotas: ["zoopl"], menke: ["strimele", "sprotas"], "plekšne": ["midija", "soniplauka"],
      lasisa: ["strimele", "sprotas"], ruonis: ["menke", "strimele", "lasisa", "plekšne"], ledine: ["midija"], kormoranas: ["plekšne", "strimele"] },
    sk: ["bakterijos"], par: [],
    inv: { id: "grundalas", eats: ["midija", "soniplauka"], by: ["menke", "kormoranas"] } },
  { id: "laukas", nat: false,
    eats: { amaras: ["kvieciai"], pelenas: ["kvieciai", "rugiagele"], kiskis: ["kvieciai"], kurapka: ["kvieciai", "usnis", "amaras"], dagilis: ["usnis"],
      boruze: ["amaras"], zebenkstis: ["pelenas"], suopis: ["pelenas"], lape: ["pelenas", "kiskis", "kurapka"], vanagas: ["dagilis", "kurapka"] },
    sk: ["sliekas", "bakterijos"], par: [] },
  { id: "sodas", nat: false,
    eats: { amaras: ["obelis", "kopustas"], viksras: ["kopustas"], sliuzas: ["braske", "kopustas"], boruze: ["amaras"], zyle: ["viksras", "amaras"], ezys: ["sliuzas", "viksras"],
      rupuze: ["sliuzas"], strazdas: ["braske", "sliuzas", "viksras"], kate: ["zyle", "strazdas"], vanagas: ["zyle", "strazdas"] },
    sk: ["sliekas", "bakterijos", "pelesis"], par: ["blusa"] }
];
/* grupės: G gamintojas, A augalėdis, P plėšrūnas, M minta ir augalais, ir gyvūnais, S skaidytojas, Z parazitas.
   strict – plėšrūnai, kurie augalais tikrai neminta (klaida skaičiuojama); kitiems netikėtas ryšys tik „nežymimas“. */
const G = "azuolas egle melyne lazdynas zole dobilas kiaulpiene fitopl nendre plude banguolis kvieciai usnis rugiagele obelis kopustas braske barstis".split(" ");
const STRICT = "vilkas lusis vanagas peleda suopis zuvininkas garnys udra ruonis menke lydeka eserys zebenkstis boruze varle driezas zaltys rupuze kate gandras kormoranas lasisa strimele sprotas auksle lerva audine grundalas".split(" ");
const ROLE = {};
G.forEach(g => ROLE[g] = "G");
ECO.forEach(e => { const all = Object.assign({}, e.eats); if(e.inv) all[e.inv.id] = e.inv.eats;
  for(const k in all){ const pl = all[k].some(f => ROLE[f] === "G" || G.includes(f)), an = all[k].some(f => !G.includes(f)); const r = pl && an ? "M" : pl ? "A" : "P"; if(ROLE[k] && ROLE[k] !== r) ROLE[k] = "M"; else ROLE[k] = r; }
  e.sk.forEach(s => ROLE[s] = "S"); e.par.forEach(s => ROLE[s] = "Z"); });
ROLE.meslavabalis = "S";
window.MK_TINKLAI = { ECO, ROLE, STRICT, IC, isG: id => ROLE[id] === "G",
  icon: (id, size) => `<svg viewBox="0 0 64 64" width="${size || 48}" height="${size || 48}" aria-hidden="true">${(IC[id] || (() => ""))()}</svg>`,
  inner: id => (IC[id] || (() => ""))() };
})();
