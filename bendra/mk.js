/* MokomėsKartu.lt – bendri 1–4 klasių žaidimų įrankiai:
   garsai ir muzika (Web Audio), pelėdžiukas, žvaigždutės, lygių meniu, rezultatų langas. */
(function(){
"use strict";
const MK = window.MK = {};

/* ---------- saugykla (tik vaiko įrenginyje) ---------- */
MK.get = function(k, d){ try{ const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); }catch(e){ return d; } };
MK.set = function(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} };

/* ---------- atsitiktinumas ---------- */
MK.rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
MK.pick = a => a[Math.floor(Math.random() * a.length)];
MK.shuffle = a => { a = a.slice(); for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
MK.wait = ms => new Promise(r => setTimeout(r, ms));
MK.esc = s => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]));

/* ---------- garsas ---------- */
const prefs = Object.assign({ sfx: true, music: true }, MK.get("mk-garsas", {}));
let ctx = null, out = null, musicBus = null, noiseBuf = null;
function ac(){
  if(!ctx){
    const C = window.AudioContext || window.webkitAudioContext; if(!C) return null;
    ctx = new C();
    out = ctx.createGain(); out.gain.value = 0.9; out.connect(ctx.destination);
    musicBus = ctx.createGain(); musicBus.gain.value = prefs.music ? 1 : 0; musicBus.connect(out);
  }
  if(ctx.state === "suspended") ctx.resume();
  return ctx;
}
const hz = m => 440 * Math.pow(2, (m - 69) / 12);
function tone(f, t, d, o){
  o = o || {}; const c = ac(); if(!c) return;
  const osc = c.createOscillator(), g = c.createGain(), v = o.vol || 0.18;
  osc.type = o.type || "sine"; osc.frequency.setValueAtTime(f, t);
  if(o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + d);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(v, t + (o.att || 0.01));
  g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  osc.connect(g); g.connect(o.bus || out); osc.start(t); osc.stop(t + d + 0.05);
}
function noise(t, d, o){
  o = o || {}; const c = ac(); if(!c) return;
  if(!noiseBuf){
    noiseBuf = c.createBuffer(1, c.sampleRate, c.sampleRate);
    const ch = noiseBuf.getChannelData(0); for(let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
  }
  const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
  s.buffer = noiseBuf; f.type = o.type || "bandpass"; f.Q.value = o.q || 1.2;
  f.frequency.setValueAtTime(o.f || 800, t); if(o.fTo) f.frequency.exponentialRampToValueAtTime(o.fTo, t + d);
  g.gain.setValueAtTime(o.vol || 0.25, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  s.connect(f); f.connect(g); g.connect(out); s.start(t); s.stop(t + d + 0.05);
}
const fx = fn => function(){
  if(!prefs.sfx) return; const c = ac(); if(!c) return;
  fn.apply(null, [c.currentTime + 0.01].concat([].slice.call(arguments)));
};
MK.sfx = {
  tap:    fx(t => tone(880, t, 0.07, { type: "triangle", vol: 0.1 })),
  hop:    fx((t, i, down) => { const m = down ? 79 - (i % 12) : 67 + (i % 12); tone(hz(m), t, 0.16, { vol: 0.2, to: hz(m + (down ? -5 : 7)) }); }),
  good:   fx(t => [72, 76, 79, 84].forEach((m, i) => tone(hz(m), t + i * 0.07, 0.25, { type: "triangle", vol: 0.16 }))),
  bad:    fx(t => { tone(hz(62), t, 0.18, { type: "triangle", vol: 0.13 }); tone(hz(58), t + 0.16, 0.26, { type: "triangle", vol: 0.13 }); }),
  star:   fx((t, i) => tone(hz(84 + [0, 4, 7][(i || 0) % 3]), t, 0.5, { vol: 0.15 })),
  win:    fx(t => [[72, 0], [76, .12], [79, .24], [84, .36], [79, .5], [84, .62]].forEach(([m, d]) => tone(hz(m), t + d, 0.32, { type: "square", vol: 0.05 }))),
  whoosh: fx(t => noise(t, 0.35, { f: 400, fTo: 2400, vol: 0.18 })),
  dig:    fx(t => { noise(t, 0.12, { f: 300, vol: 0.35, type: "lowpass" }); noise(t + 0.18, 0.12, { f: 260, vol: 0.3, type: "lowpass" }); }),
  vroom:  fx(t => tone(90, t, 0.45, { type: "sawtooth", vol: 0.05, to: 260 })),
  beep:   fx((t, hi) => tone(hi ? 1046 : 523, t, hi ? 0.4 : 0.15, { type: "square", vol: 0.06 })),
  coins:  fx(t => [88, 91, 96, 93, 100].forEach((m, i) => tone(hz(m), t + i * 0.06, 0.2, { type: "triangle", vol: 0.08 })))
};

/* Fono melodija – originali, muzikinės dėžutės skambesys. Harmonija: C – Am – F – G | C – Am – F G – C. */
const MEL = [67,0,64,0,72,0,67,0,  69,0,72,0,76,0,72,0,  65,0,69,0,72,0,77,0,  74,0,71,0,67,0,71,74,
             76,0,74,72,67,0,64,0, 69,0,72,0,69,67,64,0, 65,0,69,0,67,0,71,74, 72,0,0,0,0,0,0,0];
const BAS = [48,43, 45,52, 41,48, 43,50, 48,43, 45,52, 41,43, 48,0];
const EIGHTH = 0.3;
let musicOn = false, nextT = 0, step = 0, timer = null;
function schedule(){
  if(!ctx) return;
  while(nextT < ctx.currentTime + 0.6){
    const i = step % MEL.length, m = MEL[i];
    if(m){ tone(hz(m), nextT, 0.9, { vol: 0.045, bus: musicBus }); tone(hz(m + 12), nextT, 0.3, { vol: 0.01, bus: musicBus }); }
    if(i % 4 === 0){ const b = BAS[(i / 4) % BAS.length]; if(b) tone(hz(b), nextT, 1.1, { type: "triangle", vol: 0.05, bus: musicBus }); }
    nextT += EIGHTH; step++;
  }
}
MK.music = {
  start(){ if(musicOn) return; const c = ac(); if(!c) return; musicOn = true; nextT = c.currentTime + 0.15; step = 0; timer = setInterval(schedule, 150); schedule(); },
  stop(){ musicOn = false; clearInterval(timer); }
};
/* Pirmas vaiko paspaudimas leidžia naršyklei groti garsą. */
MK.unlock = function(){ ac(); MK.music.start(); };
document.addEventListener("visibilitychange", () => { if(!ctx) return; if(document.hidden) ctx.suspend(); else ctx.resume(); });

/* ---------- piešiniai ---------- */
MK.owl = cls => `<svg class="mk-owl ${cls || ""}" viewBox="0 0 120 124" aria-hidden="true">
  <path d="M26 34 34 6 52 26Z M94 34 86 6 68 26Z" fill="#7a4b2a"/>
  <ellipse cx="60" cy="70" rx="45" ry="47" fill="#a8693a"/>
  <path d="M17 70Q4 92 22 106Q30 90 30 76Z M103 70Q116 92 98 106Q90 90 90 76Z" fill="#7a4b2a"/>
  <ellipse cx="60" cy="84" rx="28" ry="29" fill="#f6dcae"/>
  <path d="M50 80q4 4 8 0M62 80q4 4 8 0M56 92q4 4 8 0" fill="none" stroke="#d9b27a" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="41" cy="50" r="18" fill="#fff"/><circle cx="79" cy="50" r="18" fill="#fff"/>
  <g class="mk-eyes"><circle cx="43" cy="52" r="8.5" fill="#121a33"/><circle cx="77" cy="52" r="8.5" fill="#121a33"/>
  <circle cx="46" cy="49" r="2.8" fill="#fff"/><circle cx="80" cy="49" r="2.8" fill="#fff"/></g>
  <path d="M53 63h14l-7 10Z" fill="#ff9f1c"/>
  <circle cx="27" cy="66" r="5" fill="#ff8aa0" opacity=".55"/><circle cx="93" cy="66" r="5" fill="#ff8aa0" opacity=".55"/>
  <path d="M47 116l-4 6M52 116v7M57 116l4 6M63 116l-4 6M68 116v7M73 116l4 6" stroke="#ff9f1c" stroke-width="3.5" stroke-linecap="round"/>
</svg>`;
const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.8l3 6.5 7.1.8-5.3 4.8 1.5 7L12 17.4l-6.3 3.5 1.5-7L1.9 9.1 9 8.3z"/></svg>';
MK.starRow = (n, cls) => `<span class="mk-srow ${cls || ""}" aria-label="${n} iš 3 žvaigždučių">${[0, 1, 2].map(i => `<span class="mk-star${i < n ? " on" : ""}" style="--i:${i}">${STAR}</span>`).join("")}</span>`;
const ICONS = {
  music: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V5l11-2v13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><circle cx="6.5" cy="18" r="3" fill="currentColor"/><circle cx="17.5" cy="16" r="3" fill="currentColor"/></svg>',
  sfx: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>'
};

/* ---------- viršutinė juosta ---------- */
MK.top = function(o){
  const h = document.createElement("header"); h.className = "mk-top";
  h.innerHTML = `<a class="mk-back" href="/#klase-${o.grade}" aria-label="Grįžti į ${o.grade} klasės puslapį"><span aria-hidden="true">←</span><span class="mk-back-t">${o.grade} klasė</span></a>
    <div class="mk-title">${MK.esc(o.title)}</div>
    <div class="mk-tg">${["music", "sfx"].map(k => `<button type="button" class="mk-ico${prefs[k] ? "" : " off"}" data-k="${k}" aria-pressed="${prefs[k]}" aria-label="${k === "music" ? "Muzika" : "Garsai"}">${ICONS[k]}</button>`).join("")}</div>`;
  h.addEventListener("click", e => {
    const b = e.target.closest(".mk-ico"); if(!b) return;
    const k = b.dataset.k; prefs[k] = !prefs[k]; MK.set("mk-garsas", prefs);
    b.classList.toggle("off", !prefs[k]); b.setAttribute("aria-pressed", prefs[k]);
    if(k === "music"){ ac(); if(musicBus) musicBus.gain.setTargetAtTime(prefs.music ? 1 : 0, ctx.currentTime, 0.05); MK.music.start(); }
    else MK.sfx.tap();
  });
  return h;
};

/* ---------- pelėdžiuko kalbos burbulas ---------- */
MK.say = function(el, html, mood){
  if(!el) return;
  const b = el.querySelector(".mk-bubble"), owl = el.querySelector(".mk-owl");
  b.innerHTML = `<span class="mk-bt">${html}</span>`;
  b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop");
  if(owl){ owl.classList.remove("hop", "shake"); void owl.offsetWidth; owl.classList.add(mood === "bad" ? "shake" : "hop"); }
};
MK.guide = (html, cls) => `<div class="mk-guide ${cls || ""}">${MK.owl()}<div class="mk-bubble" role="status" aria-live="polite"><span class="mk-bt">${html}</span></div></div>`;
MK.praise = () => MK.pick(["Puiku!", "Teisingai!", "Šaunu!", "Valio!", "Kaip gerai!", "Nuostabu!"]);

/* ---------- progreso taškeliai ---------- */
MK.dots = function(el, total){
  el.className = "mk-dots"; el.innerHTML = Array.from({ length: total }, () => "<i></i>").join("");
  const d = el.children;
  return {
    cur(i){ for(const x of d) x.classList.remove("cur"); if(d[i]) d[i].classList.add("cur"); },
    mark(i, ok){ if(d[i]){ d[i].classList.remove("cur"); d[i].classList.add(ok ? "ok" : "miss"); } }
  };
};

/* ---------- žvaigždutės ---------- */
MK.starsFor = (ok, total) => ok / total >= 0.85 ? 3 : ok / total >= 0.6 ? 2 : 1;
MK.best = function(game, level, stars){
  const all = MK.get("mk-" + game, {});
  if(stars != null && stars > (all[level] || 0)){ all[level] = stars; MK.set("mk-" + game, all); }
  return all;
};

/* ---------- lygių meniu ---------- */
MK.levels = function(el, o){
  const best = MK.best(o.game);
  el.classList.add("mk-lvls");
  el.innerHTML = o.levels.map((l, i) => `<button type="button" class="mk-lvl" data-i="${i}" style="--d:${i * 80}ms">
      <span class="mk-lvl-art" aria-hidden="true">${l.art || ""}</span>
      <span class="mk-lvl-t"><b>${l.name}</b><small>${l.sub}</small></span>
      ${MK.starRow(best[l.id] || 0, "sm")}</button>`).join("");
  el.onclick = e => { const b = e.target.closest(".mk-lvl"); if(!b) return; MK.unlock(); MK.sfx.tap(); o.onPick(+b.dataset.i); };
};

/* ---------- konfeti ---------- */
MK.confetti = function(n){
  const box = document.createElement("div"); box.className = "mk-confetti"; box.setAttribute("aria-hidden", "true");
  const cols = ["#ff4f5e", "#ff8a1f", "#ffc61a", "#7bd13a", "#13a8d6", "#6b4dff", "#ff3d9a"];
  let html = "";
  for(let i = 0; i < (n || 46); i++){
    html += `<i style="left:${Math.random() * 100}%;background:${cols[i % cols.length]};--x:${(Math.random() * 2 - 1) * 90}px;--r:${Math.random() * 720 - 360}deg;animation-delay:${Math.random() * 0.5}s;animation-duration:${1.6 + Math.random() * 1.2}s;${i % 3 ? "" : "border-radius:50%;"}"></i>`;
  }
  box.innerHTML = html; document.body.appendChild(box);
  setTimeout(() => box.remove(), 3600);
};

/* ---------- rezultatų langas ---------- */
MK.result = function(o){
  const titles = ["", "Gerai pasistengei!", "Labai gerai!", "Nuostabu!"];
  const ov = document.createElement("div"); ov.className = "mk-ov";
  ov.innerHTML = `<div class="mk-res" role="dialog" aria-modal="true" aria-labelledby="mkResT">
      ${MK.owl("big hop")}
      ${MK.starRow(o.stars, "big")}
      <h2 id="mkResT">${o.title || titles[o.stars]}</h2>
      <p>${o.text}</p>
      <div class="mk-res-b">
        ${o.next ? `<button type="button" class="mk-btn" data-a="next">${o.nextLabel || "Kitas lygis →"}</button>` : ""}
        <button type="button" class="mk-btn${o.next ? " alt" : ""}" data-a="again">Dar kartą</button>
        <button type="button" class="mk-btn ghost" data-a="menu">${o.menuLabel || "Visi lygiai"}</button>
      </div></div>`;
  document.body.appendChild(ov);
  const stars = ov.querySelectorAll(".mk-srow.big .mk-star");
  stars.forEach((s, i) => { if(i < o.stars) setTimeout(() => { s.classList.add("show"); MK.sfx.star(i); }, 450 + i * 330); });
  if(o.stars >= 2) setTimeout(() => { MK.confetti(); MK.sfx.win(); }, 450 + o.stars * 330);
  ov.addEventListener("click", e => {
    const b = e.target.closest("[data-a]"); if(!b) return;
    MK.sfx.tap(); ov.remove();
    const f = o[b.dataset.a]; if(f) f();
  });
  setTimeout(() => { const f = ov.querySelector("[data-a]"); if(f) f.focus({ preventScroll: true }); }, 60);
};

/* ---------- trupmenos užrašas ---------- */
MK.frac = (a, b, cls) => `<span class="mk-fr ${cls || ""}" aria-label="${a} iš ${b}"><span>${a}</span><span>${b}</span></span>`;

/* ---------- bendras stilius ---------- */
const css = `
:root{--paper:#fff9e6;--grid:#f3e3ae;--ink:#121a33;--soft:#5f5a45;--card:#fff;--good:#2fb36b;--bad:#ff6b4a;
  --ac:#ff4f5e;--ac-ink:#fff;--ac-soft:#ffe3e6;--kid:"Grandstander","Chalkboard SE","Comic Sans MS",system-ui,sans-serif;
  --body:"Manrope",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color-scheme:light}
*,*::before,*::after{box-sizing:border-box}
[hidden]{display:none!important}
html,body{min-height:100%}
body{margin:0;background-color:var(--paper);color:var(--ink);font:16px/1.45 var(--body);
  background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);
  background-size:22px 22px;background-position:-1px -1px;-webkit-tap-highlight-color:transparent;overscroll-behavior-y:contain}
button{font:inherit;color:inherit}
:focus-visible{outline:3px solid #2f6bff;outline-offset:3px}
.mk-app{max-width:760px;margin:0 auto;min-height:100vh;min-height:100dvh;display:flex;flex-direction:column;
  padding-left:max(14px,env(safe-area-inset-left,0px));padding-right:max(14px,env(safe-area-inset-right,0px));padding-block:8px 18px}
.mk-top{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:10px;padding:4px 0 10px}
.mk-back{display:inline-flex;align-items:center;gap:6px;height:44px;padding:0 14px;border-radius:999px;background:var(--card);
  border:2.5px solid var(--ink);text-decoration:none;font:800 15px/1 var(--body);box-shadow:0 4px 0 rgba(18,26,51,.2)}
.mk-back span:first-child{font-size:20px}
.mk-title{font:800 clamp(19px,4.6vw,26px)/1.1 var(--kid);text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mk-tg{display:flex;gap:6px}
.mk-ico{width:44px;height:44px;border-radius:50%;border:2.5px solid var(--ink);background:var(--card);display:grid;place-items:center;cursor:pointer;
  box-shadow:0 4px 0 rgba(18,26,51,.2);position:relative;padding:0}
.mk-ico svg{width:22px;height:22px}
.mk-ico.off{opacity:.5}
.mk-ico.off::after{content:"";position:absolute;width:30px;height:3px;background:var(--ink);border-radius:2px;transform:rotate(-45deg)}
@media (max-width:420px){.mk-back-t{display:none}.mk-back{padding:0 13px}}
.mk-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:54px;padding:10px 24px;border:0;border-radius:999px;cursor:pointer;
  background:var(--ac);color:var(--ac-ink);font:800 20px/1 var(--kid);box-shadow:0 6px 0 rgba(18,26,51,.28);transition:transform .1s,box-shadow .1s}
.mk-btn:active{transform:translateY(4px);box-shadow:0 2px 0 rgba(18,26,51,.28)}
.mk-btn.alt{background:var(--card);color:var(--ink);box-shadow:inset 0 0 0 2.5px var(--ink),0 6px 0 rgba(18,26,51,.2)}
.mk-btn.ghost{background:transparent;color:var(--ink);box-shadow:none;text-decoration:underline;text-underline-offset:4px;min-height:44px}
.mk-btn[disabled]{opacity:.45;pointer-events:none}
.mk-hero{display:grid;justify-items:center;text-align:center;gap:6px;padding:6px 0 14px}
.mk-hero h1{margin:0;font:800 clamp(36px,9vw,58px)/1 var(--kid);letter-spacing:-.01em;text-wrap:balance}
.mk-hero h1 em{font-style:normal;color:var(--ac)}
.mk-hero p{margin:0;max-width:34ch;color:var(--soft);font-weight:600}
.mk-hero-art{width:min(260px,70vw)}
.mk-lvls{display:grid;gap:12px;width:100%;max-width:520px;margin:0 auto}
.mk-lvl{display:grid;grid-template-columns:64px minmax(0,1fr) auto;align-items:center;gap:14px;padding:12px 16px 12px 12px;text-align:left;cursor:pointer;
  background:var(--card);border:0;border-radius:24px;box-shadow:0 6px 0 rgba(18,26,51,.16),inset 0 0 0 2.5px var(--ink);
  animation:mkIn .45s backwards cubic-bezier(.2,1.4,.4,1);animation-delay:var(--d);transition:transform .12s}
.mk-lvl:hover{transform:translateY(-2px) rotate(-.6deg)}
.mk-lvl:active{transform:translateY(3px)}
.mk-lvl-art{width:64px;height:64px;border-radius:18px;background:var(--ac-soft);display:grid;place-items:center;font:800 24px/1 var(--kid);color:var(--ink)}
.mk-lvl-art svg{width:56px;height:56px}
.mk-lvl-t b{display:block;font:800 22px/1.1 var(--kid)}
.mk-lvl-t small{display:block;color:var(--soft);font-weight:700;font-size:14.5px;margin-top:2px}
.mk-srow{display:inline-flex;gap:2px}
.mk-star svg{width:22px;height:22px;display:block;fill:#e6dcc0}
.mk-star.on svg{fill:#ffc61a;filter:drop-shadow(0 1.5px 0 #d99a00)}
.mk-srow.big .mk-star svg{width:58px;height:58px}
.mk-srow.big{gap:6px}
.mk-srow.big .mk-star.on svg{fill:#e6dcc0;filter:none}
.mk-srow.big .mk-star.on.show svg{fill:#ffc61a;filter:drop-shadow(0 3px 0 #d99a00);animation:mkStar .55s cubic-bezier(.2,1.6,.4,1)}
.mk-srow.big .mk-star:nth-child(2){transform:translateY(-10px)}
.mk-guide{display:grid;grid-template-columns:72px minmax(0,1fr);align-items:center;gap:10px}
.mk-guide .mk-owl{width:72px;height:74px}
.mk-bubble{position:relative;background:var(--card);border:2.5px solid var(--ink);border-radius:20px;padding:10px 14px;font:800 18px/1.3 var(--kid);min-height:48px;
  display:flex;align-items:center}
.mk-bt .mk-fr{font-size:.95em;margin:0 .15em}
.mk-bubble::before{content:"";position:absolute;left:-11px;top:50%;width:18px;height:18px;background:var(--card);border-left:2.5px solid var(--ink);border-bottom:2.5px solid var(--ink);transform:translateY(-50%) rotate(45deg)}
.mk-bubble.pop{animation:mkPop .35s cubic-bezier(.2,1.6,.4,1)}
.mk-owl .mk-eyes{transform-origin:60px 52px;animation:mkBlink 4.5s infinite}
.mk-owl.hop{animation:mkHop .5s cubic-bezier(.3,1.6,.5,1)}
.mk-owl.shake{animation:mkShake .45s}
.mk-dots{display:flex;justify-content:center;gap:7px;flex-wrap:wrap}
.mk-dots i{width:14px;height:14px;border-radius:50%;background:#fff;box-shadow:inset 0 0 0 2.5px #d8c99a;transition:.2s}
.mk-dots i.cur{box-shadow:inset 0 0 0 3px var(--ink);transform:scale(1.2)}
.mk-dots i.ok{background:var(--good);box-shadow:none}
.mk-dots i.miss{background:#ffb347;box-shadow:none}
.mk-fr{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;font:800 1em/1 var(--kid);margin:0 .08em}
.mk-fr>span{padding:0 .14em;line-height:1.05}
.mk-fr>span+span{border-top:.09em solid currentColor;padding-top:.04em}
.mk-ov{position:fixed;inset:0;z-index:50;display:grid;place-items:center;padding:16px;background:rgba(255,249,230,.86);backdrop-filter:blur(3px);animation:mkFade .25s}
.mk-res{width:min(420px,100%);background:var(--card);border-radius:32px;padding:22px 20px 18px;text-align:center;display:grid;justify-items:center;gap:8px;
  box-shadow:inset 0 0 0 3px var(--ink),0 10px 0 rgba(18,26,51,.18);animation:mkIn .5s cubic-bezier(.2,1.4,.4,1)}
.mk-res .mk-owl.big{width:96px;height:99px}
.mk-res h2{margin:4px 0 0;font:800 30px/1.1 var(--kid)}
.mk-res p{margin:0;color:var(--soft);font-weight:700;font-size:17px}
.mk-res-b{display:grid;gap:10px;width:100%;margin-top:10px}
.mk-confetti{position:fixed;inset:0;pointer-events:none;z-index:60;overflow:hidden}
.mk-confetti i{position:absolute;top:-16px;width:10px;height:14px;border-radius:2px;animation:mkFall linear forwards}
.mk-shake{animation:mkShake .45s}
.mk-pulse{animation:mkPulse 1s infinite}
@keyframes mkIn{from{opacity:0;transform:translateY(14px) scale(.96)}}
@keyframes mkFade{from{opacity:0}}
@keyframes mkPop{0%{transform:scale(.85)}100%{transform:none}}
@keyframes mkHop{30%{transform:translateY(-12px) scaleY(1.04)}60%{transform:translateY(0) scaleY(.95)}}
@keyframes mkShake{20%{transform:translateX(-7px) rotate(-3deg)}40%{transform:translateX(6px) rotate(3deg)}60%{transform:translateX(-4px)}80%{transform:translateX(3px)}}
@keyframes mkBlink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
@keyframes mkStar{0%{transform:scale(0) rotate(-40deg)}100%{transform:none}}
@keyframes mkPulse{50%{transform:scale(1.1)}}
@keyframes mkFall{to{transform:translate(var(--x),105vh) rotate(var(--r))}}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition:none!important}}
`;
const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
})();
