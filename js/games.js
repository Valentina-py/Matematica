/* ============================================================
   JUEGOS DE APRENDIZAJE
   1) Clasificá el número  (ℕ ℤ ℚ 𝕀 ℂ)
   2) Verdadero o Falso contrarreloj (propiedades de operaciones)
   3) Memotest matemático (emparejar símbolo/nombre/fórmula)
   4) Potencias de iⁿ (elegí el valor lo más rápido posible)
   Cada juego guarda su mejor marca en localStorage.
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- utilidades ---------------- */
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function render(el) { if (window.MathJaxRender) window.MathJaxRender(el); }
  function fmtTime(s) { const m = Math.floor(s / 60), r = s % 60; return m + ":" + String(r).padStart(2, "0"); }

  /* ---------------- timers (se limpian al navegar) ---------------- */
  let intervals = [], timeouts = [];
  function every(fn, ms) { const id = setInterval(fn, ms); intervals.push(id); return id; }
  function after(fn, ms) { const id = setTimeout(fn, ms); timeouts.push(id); return id; }
  function stopAll() {
    intervals.forEach(clearInterval); timeouts.forEach(clearTimeout);
    intervals = []; timeouts = [];
  }

  /* ---------------- mejores marcas ---------------- */
  const GKEY = "estudioMat.games.v1";
  function loadG() { try { return JSON.parse(localStorage.getItem(GKEY)) || {}; } catch { return {}; } }
  function saveG(o) { try { localStorage.setItem(GKEY, JSON.stringify(o)); } catch { } }
  function getBest(id) { return loadG()[id]; }
  function setBest(id, val) { const o = loadG(); o[id] = val; saveG(o); }

  /* ---------------- helpers de UI ---------------- */
  function shell(container, hudHTML) {
    container.innerHTML =
      `<div class="game">
         <div class="game-hud">${hudHTML}</div>
         <div class="game-body" id="gbody"></div>
       </div>`;
    return container.querySelector("#gbody");
  }
  function resultScreen(container, title, statsHTML, bestHTML) {
    container.innerHTML =
      `<div class="card center game-result">
         <div class="game-result__title">${title}</div>
         <div class="game-result__stats">${statsHTML}</div>
         ${bestHTML ? `<div class="game-result__best">${bestHTML}</div>` : ""}
         <div class="btn-row" style="justify-content:center;margin-top:6px">
           <button class="btn btn--primary" id="g-replay">Jugar de nuevo</button>
           <a class="btn" href="#/games">Otros juegos</a>
         </div>
       </div>`;
    render(container);
    return container.querySelector("#g-replay");
  }

  /* ============================================================
     1) CLASIFICÁ EL NÚMERO
     ============================================================ */
  const SETS = [
    { k: "N", tex: "\\mathbb{N}", name: "Naturales" },
    { k: "Z", tex: "\\mathbb{Z}", name: "Enteros" },
    { k: "Q", tex: "\\mathbb{Q}", name: "Racionales" },
    { k: "I", tex: "\\mathbb{I}", name: "Irracionales" },
    { k: "C", tex: "\\mathbb{C}", name: "Complejos" },
  ];
  const NUMBERS = [
    { tex: "5", k: "N", why: "Entero positivo: es natural." },
    { tex: "100", k: "N", why: "Entero positivo: es natural." },
    { tex: "\\sqrt{9}", k: "N", why: "\\(\\sqrt9=3\\), un número natural." },
    { tex: "\\sqrt[3]{8}", k: "N", why: "\\(\\sqrt[3]{8}=2\\), un número natural." },
    { tex: "0", k: "Z", why: "El cero es entero, pero no natural." },
    { tex: "-7", k: "Z", why: "Negativo sin parte decimal: entero." },
    { tex: "-100", k: "Z", why: "Negativo sin parte decimal: entero." },
    { tex: "-\\sqrt{16}", k: "Z", why: "\\(-\\sqrt{16}=-4\\): entero." },
    { tex: "\\tfrac{1}{2}", k: "Q", why: "Fracción de enteros: racional." },
    { tex: "-3{,}75", k: "Q", why: "Decimal exacto: racional." },
    { tex: "\\tfrac{3}{4}", k: "Q", why: "Fracción de enteros: racional." },
    { tex: "-\\tfrac{2}{5}", k: "Q", why: "Fracción de enteros: racional." },
    { tex: "0{,}\\overline{3}", k: "Q", why: "Decimal periódico: racional." },
    { tex: "1{,}25", k: "Q", why: "Decimal exacto: racional." },
    { tex: "\\sqrt{2}", k: "I", why: "Decimal infinito no periódico: irracional." },
    { tex: "\\pi", k: "I", why: "Decimal infinito no periódico: irracional." },
    { tex: "e", k: "I", why: "Número de Euler: irracional." },
    { tex: "\\sqrt{5}", k: "I", why: "Raíz no exacta: irracional." },
    { tex: "\\sqrt{7}", k: "I", why: "Raíz no exacta: irracional." },
    { tex: "i", k: "C", why: "Unidad imaginaria \\(i=\\sqrt{-1}\\): complejo." },
    { tex: "2i", k: "C", why: "Imaginario puro: es complejo." },
    { tex: "-5i", k: "C", why: "Imaginario puro: es complejo." },
    { tex: "2+3i", k: "C", why: "Tiene parte imaginaria: complejo." },
    { tex: "-1+i", k: "C", why: "Tiene parte imaginaria: complejo." },
  ];

  function classify(container) {
    function start() {
      const deck = shuffle(NUMBERS);
      let i = 0, score = 0, lives = 3, answered = false;

      const body = shell(container,
        `<div class="game-hud__item"><span class="game-hud__label">Puntaje</span><span class="game-hud__val" id="g-score">0</span></div>
         <div class="game-hud__item"><span class="game-hud__label">Vidas</span><span class="game-hud__val" id="g-lives">●●●</span></div>
         <div class="game-hud__item"><span class="game-hud__label">N°</span><span class="game-hud__val"><span id="g-i">1</span>/${deck.length}</span></div>`);
      const elScore = container.querySelector("#g-score");
      const elLives = container.querySelector("#g-lives");
      const elI = container.querySelector("#g-i");

      function paint() {
        answered = false;
        const it = deck[i];
        elI.textContent = i + 1;
        body.innerHTML =
          `<p class="game-ask">¿A qué conjunto pertenece este número?</p>
           <div class="classify-number">\\(${it.tex}\\)</div>
           <div class="classify-sets" id="g-sets">
             ${SETS.map(s => `<button class="classify-set" data-k="${s.k}">
                 <span class="classify-set__sym">\\(${s.tex}\\)</span>
                 <span class="classify-set__name">${s.name}</span></button>`).join("")}
           </div>
           <div class="game-feedback" id="g-fb"></div>
           <div class="btn-row" id="g-nav" style="justify-content:center"></div>`;
        render(body);

        const fb = container.querySelector("#g-fb");
        const nav = container.querySelector("#g-nav");
        container.querySelector("#g-sets").addEventListener("click", e => {
          const b = e.target.closest(".classify-set"); if (!b || answered) return;
          answered = true;
          const k = b.dataset.k;
          container.querySelectorAll(".classify-set").forEach(el => {
            el.disabled = true;
            if (el.dataset.k === it.k) el.classList.add("correct");
            else if (el.dataset.k === k) el.classList.add("wrong");
          });
          const ok = k === it.k;
          const setName = SETS.find(s => s.k === it.k).name;
          if (ok) { score++; elScore.textContent = score; fb.className = "game-feedback ok show"; fb.innerHTML = "¡Correcto! " + it.why; }
          else {
            lives--; elLives.textContent = "●●●●".slice(0, lives).padEnd(3, "○");
            fb.className = "game-feedback no show";
            fb.innerHTML = `Era <strong>${setName}</strong>. ${it.why}`;
          }
          render(fb);
          const last = i >= deck.length - 1 || lives <= 0;
          nav.innerHTML = `<button class="btn btn--primary" id="g-next">${last ? "Ver resultado →" : "Siguiente →"}</button>`;
          container.querySelector("#g-next").addEventListener("click", () => {
            if (last) finish(); else { i++; paint(); }
          });
        });
      }

      function finish() {
        const total = deck.length;
        let best = getBest("classify") || 0;
        const record = score > best;
        if (record) setBest("classify", score);
        best = getBest("classify");
        const replay = resultScreen(container, "Clasificá el número",
          `<span class="game-result__big">${score}</span> aciertos de ${total}` +
          (lives <= 0 ? `<div class="muted" style="margin-top:6px">Te quedaste sin vidas.</div>` : ""),
          record ? "¡Nuevo récord! 🏆" : `Tu mejor marca: ${best} aciertos`);
        replay.addEventListener("click", start);
      }

      // vidas iniciales
      elLives.textContent = "●●●";
      paint();
    }
    start();
  }

  /* ============================================================
     2) VERDADERO O FALSO CONTRARRELOJ
     ============================================================ */
  const VOF_TIME = 60;
  const VOF = [
    { q: "\\(\\sqrt{a+b}=\\sqrt{a}+\\sqrt{b}\\)", v: false, exp: "La raíz no se distribuye en la suma." },
    { q: "\\((a\\cdot b)^{n}=a^{n}\\cdot b^{n}\\)", v: true, exp: "La potencia sí se distribuye en el producto." },
    { q: "\\(a^{m}\\cdot a^{n}=a^{m+n}\\)", v: true, exp: "Producto de igual base: se suman los exponentes." },
    { q: "\\(a^{m}\\cdot a^{n}=a^{m\\cdot n}\\)", v: false, exp: "Se SUMAN los exponentes, no se multiplican." },
    { q: "\\((a^{m})^{n}=a^{m\\cdot n}\\)", v: true, exp: "Potencia de una potencia: se multiplican." },
    { q: "\\(a^{0}=1\\) (con \\(a\\neq 0\\))", v: true, exp: "Todo número distinto de 0 elevado a 0 da 1." },
    { q: "\\(a^{0}=0\\)", v: false, exp: "Da 1, no 0 (con \\(a\\neq 0\\))." },
    { q: "\\((a+b)^{2}=a^{2}+b^{2}\\)", v: false, exp: "Falta el doble producto: \\((a+b)^2=a^2+2ab+b^2\\)." },
    { q: "\\(\\sqrt{a\\cdot b}=\\sqrt{a}\\cdot\\sqrt{b}\\) (con \\(a,b\\ge 0\\))", v: true, exp: "La raíz sí se distribuye en el producto." },
    { q: "\\(a^{m}\\div a^{n}=a^{m-n}\\)", v: true, exp: "Cociente de igual base: se restan los exponentes." },
    { q: "\\(|x\\cdot y|=|x|\\cdot|y|\\)", v: true, exp: "El módulo de un producto es el producto de los módulos." },
    { q: "\\(|x+y|=|x|+|y|\\)", v: false, exp: "En general es \\(\\le\\) (desigualdad triangular)." },
    { q: "\\(\\sqrt{x^{2}}=x\\)", v: false, exp: "Es \\(|x|\\), porque la raíz es no negativa." },
    { q: "\\(\\sqrt{x^{2}}=|x|\\)", v: true, exp: "Siempre vale \\(\\sqrt{x^2}=|x|\\)." },
    { q: "\\(a\\cdot(b+c)=a\\cdot b+a\\cdot c\\)", v: true, exp: "Propiedad distributiva." },
    { q: "\\(a-b=b-a\\)", v: false, exp: "La resta no es conmutativa." },
    { q: "\\(a+b=b+a\\)", v: true, exp: "La suma es conmutativa." },
    { q: "\\(|-a|=|a|\\)", v: true, exp: "Un número y su opuesto tienen el mismo módulo." },
    { q: "El elemento neutro de la multiplicación es 1.", v: true, exp: "\\(a\\cdot 1=a\\)." },
    { q: "El elemento neutro de la suma es 1.", v: false, exp: "Es 0: \\(a+0=a\\)." },
    { q: "\\(i^{2}=-1\\)", v: true, exp: "Por definición de la unidad imaginaria." },
    { q: "\\(\\sqrt{-4}=2i\\)", v: true, exp: "\\(\\sqrt{-4}=i\\sqrt{4}=2i\\)." },
    { q: "\\(\\dfrac{a}{0}=0\\)", v: false, exp: "No se puede dividir por cero." },
    { q: "\\(\\sqrt[n]{a^{m}}=a^{m/n}\\)", v: true, exp: "El radicando pasa a exponente fraccionario." },
    { q: "\\((a\\cdot b)\\cdot c=a\\cdot(b\\cdot c)\\)", v: true, exp: "La multiplicación es asociativa." },
  ];

  function vof(container) {
    function start() {
      const deck = shuffle(VOF);
      let i = 0, score = 0, timeLeft = VOF_TIME, locked = false, tid = 0;

      const body = shell(container,
        `<div class="game-hud__item game-hud__item--grow">
           <span class="game-hud__label">Tiempo</span>
           <div class="game-timer"><span id="g-bar" style="width:100%"></span></div>
         </div>
         <div class="game-hud__item"><span class="game-hud__label">Aciertos</span><span class="game-hud__val" id="g-score">0</span></div>`);
      const bar = container.querySelector("#g-bar");
      const elScore = container.querySelector("#g-score");

      tid = every(() => {
        timeLeft--;
        bar.style.width = Math.max(0, timeLeft / VOF_TIME * 100) + "%";
        if (timeLeft <= 0) { clearInterval(tid); finish(); }
      }, 1000);

      function paint() {
        locked = false;
        const it = deck[i % deck.length];
        body.innerHTML =
          `<div class="vof-statement">${it.q}</div>
           <div class="vof-buttons" id="g-vof">
             <button class="btn vof-btn vof-btn--v" data-v="1">Verdadero</button>
             <button class="btn vof-btn vof-btn--f" data-v="0">Falso</button>
           </div>
           <div class="game-feedback" id="g-fb"></div>`;
        render(body);
        const fb = container.querySelector("#g-fb");
        container.querySelector("#g-vof").addEventListener("click", e => {
          const b = e.target.closest(".vof-btn"); if (!b || locked) return;
          locked = true;
          const said = b.dataset.v === "1";
          const ok = said === it.v;
          if (ok) { score++; elScore.textContent = score; fb.className = "game-feedback ok show"; fb.innerHTML = "✓ " + it.exp; }
          else { fb.className = "game-feedback no show"; fb.innerHTML = `✗ Es <strong>${it.v ? "Verdadero" : "Falso"}</strong>. ${it.exp}`; }
          render(fb);
          container.querySelectorAll(".vof-btn").forEach(x => x.disabled = true);
          after(() => { i++; if (timeLeft > 0) paint(); }, 850);
        });
      }

      function finish() {
        stopAll();
        let best = getBest("vof") || 0;
        const record = score > best;
        if (record) setBest("vof", score);
        best = getBest("vof");
        const replay = resultScreen(container, "Verdadero o Falso",
          `<span class="game-result__big">${score}</span> respuestas correctas en ${VOF_TIME}s`,
          record ? "¡Nuevo récord! 🏆" : `Tu mejor marca: ${best}`);
        replay.addEventListener("click", start);
      }

      paint();
    }
    start();
  }

  /* ============================================================
     3) MEMOTEST MATEMÁTICO
     ============================================================ */
  // cada par: dos caras { m: latex }  o  { t: texto }
  const MEMO_PAIRS = [
    [{ m: "\\mathbb{N}" }, { t: "Naturales" }],
    [{ m: "\\mathbb{Z}" }, { t: "Enteros" }],
    [{ m: "\\mathbb{Q}" }, { t: "Racionales" }],
    [{ m: "\\mathbb{I}" }, { t: "Irracionales" }],
    [{ m: "\\mathbb{C}" }, { t: "Complejos" }],
    [{ m: "i^{2}" }, { m: "-1" }],
    [{ m: "\\sqrt{x^{2}}" }, { m: "|x|" }],
    [{ m: "a^{m}\\cdot a^{n}" }, { m: "a^{m+n}" }],
    [{ m: "(a^{m})^{n}" }, { m: "a^{m\\cdot n}" }],
    [{ m: "a^{0}" }, { m: "1" }],
    [{ m: "|x\\cdot y|" }, { m: "|x|\\,|y|" }],
    [{ m: "\\sqrt[n]{a^{m}}" }, { m: "a^{m/n}" }],
    [{ m: "\\sqrt{-1}" }, { m: "i" }],
    [{ m: "|3+4i|" }, { m: "5" }],
  ];
  const MEMO_N = 8; // pares por partida → 16 cartas
  function faceHTML(f) { return f.m != null ? `\\(${f.m}\\)` : f.t; }

  function memo(container) {
    function start() {
      const chosen = shuffle(MEMO_PAIRS).slice(0, MEMO_N);
      let cards = [];
      chosen.forEach((pair, p) => { cards.push({ p, f: pair[0] }); cards.push({ p, f: pair[1] }); });
      cards = shuffle(cards);

      let flipped = [], matchedCount = 0, moves = 0, lock = false, elapsed = 0, tid = 0;

      const body = shell(container,
        `<div class="game-hud__item"><span class="game-hud__label">Movimientos</span><span class="game-hud__val" id="g-moves">0</span></div>
         <div class="game-hud__item"><span class="game-hud__label">Pares</span><span class="game-hud__val"><span id="g-pairs">0</span>/${MEMO_N}</span></div>
         <div class="game-hud__item"><span class="game-hud__label">Tiempo</span><span class="game-hud__val" id="g-time">0:00</span></div>`);
      const elMoves = container.querySelector("#g-moves");
      const elPairs = container.querySelector("#g-pairs");
      const elTime = container.querySelector("#g-time");

      tid = every(() => { elapsed++; elTime.textContent = fmtTime(elapsed); }, 1000);

      body.innerHTML = `<div class="memo-grid" id="g-grid">${cards.map((c, i) =>
        `<button class="memo-card" data-i="${i}">
           <span class="memo-card__face memo-card__cover">?</span>
           <span class="memo-card__face memo-card__content">${faceHTML(c.f)}</span>
         </button>`).join("")}</div>`;
      render(body);

      container.querySelector("#g-grid").addEventListener("click", e => {
        const b = e.target.closest(".memo-card"); if (!b || lock) return;
        const i = +b.dataset.i;
        if (b.classList.contains("is-flipped") || b.classList.contains("is-matched")) return;
        b.classList.add("is-flipped");
        flipped.push(i);
        if (flipped.length === 2) {
          moves++; elMoves.textContent = moves;
          const [a, c] = flipped;
          if (cards[a].p === cards[c].p) {
            container.querySelectorAll(`.memo-card[data-i="${a}"],.memo-card[data-i="${c}"]`).forEach(x => { x.classList.add("is-matched"); });
            matchedCount++; elPairs.textContent = matchedCount;
            flipped = [];
            if (matchedCount === MEMO_N) { clearInterval(tid); after(finish, 350); }
          } else {
            lock = true;
            after(() => {
              container.querySelectorAll(`.memo-card[data-i="${a}"],.memo-card[data-i="${c}"]`).forEach(x => x.classList.remove("is-flipped"));
              flipped = []; lock = false;
            }, 800);
          }
        }
      });

      function finish() {
        const prev = getBest("memo");
        const record = !prev || moves < prev.moves || (moves === prev.moves && elapsed < prev.secs);
        if (record) setBest("memo", { moves, secs: elapsed });
        const best = getBest("memo");
        const replay = resultScreen(container, "Memotest completado",
          `<span class="game-result__big">${moves}</span> movimientos · ${fmtTime(elapsed)}`,
          record ? "¡Nuevo récord! 🏆" : `Tu mejor marca: ${best.moves} movimientos (${fmtTime(best.secs)})`);
        replay.addEventListener("click", start);
      }
    }
    start();
  }

  /* ============================================================
     4) POTENCIAS DE iⁿ
     ============================================================ */
  const IPOW_TIME = 60;
  const IPOW_OPTS = [
    { tex: "1", r: 0 }, { tex: "i", r: 1 }, { tex: "-1", r: 2 }, { tex: "-i", r: 3 },
  ];
  function ipow(container) {
    function start() {
      let score = 0, streak = 0, bestStreak = 0, timeLeft = IPOW_TIME, n = 0, tid = 0, last = "";

      const body = shell(container,
        `<div class="game-hud__item game-hud__item--grow">
           <span class="game-hud__label">Tiempo</span>
           <div class="game-timer"><span id="g-bar" style="width:100%"></span></div>
         </div>
         <div class="game-hud__item"><span class="game-hud__label">Aciertos</span><span class="game-hud__val" id="g-score">0</span></div>
         <div class="game-hud__item"><span class="game-hud__label">Racha</span><span class="game-hud__val" id="g-streak">0</span></div>`);
      const bar = container.querySelector("#g-bar");
      const elScore = container.querySelector("#g-score");
      const elStreak = container.querySelector("#g-streak");

      tid = every(() => {
        timeLeft--;
        bar.style.width = Math.max(0, timeLeft / IPOW_TIME * 100) + "%";
        if (timeLeft <= 0) { clearInterval(tid); finish(); }
      }, 1000);

      function nextN() { n = Math.floor(Math.random() * 100); }

      let lastMsg = "";
      function paint() {
        body.innerHTML =
          `<p class="game-ask">¿Cuánto vale esta potencia de \\(i\\)?</p>
           <div class="ipow-q">\\(i^{${n}} = \\;?\\)</div>
           <div class="ipow-opts" id="g-opts">
             ${IPOW_OPTS.map(o => `<button class="btn ipow-opt" data-r="${o.r}">\\(${o.tex}\\)</button>`).join("")}
           </div>
           <div class="game-feedback ${last ? "show " + last : ""}" id="g-fb">${last ? lastMsg : ""}</div>`;
        render(body);
        container.querySelector("#g-opts").addEventListener("click", e => {
          const b = e.target.closest(".ipow-opt"); if (!b) return;
          const r = +b.dataset.r;
          const correct = n % 4;
          if (r === correct) {
            score++; streak++; bestStreak = Math.max(bestStreak, streak);
            last = "ok"; lastMsg = `✓ \\(i^{${n}} = ${IPOW_OPTS[correct].tex}\\)`;
          } else {
            streak = 0;
            last = "no"; lastMsg = `✗ \\(i^{${n}} = ${IPOW_OPTS[correct].tex}\\)`;
          }
          elScore.textContent = score; elStreak.textContent = streak;
          if (timeLeft > 0) { nextN(); paint(); }
        });
      }

      function finish() {
        stopAll();
        const prev = getBest("ipow");
        const record = !prev || score > prev.score;
        if (record) setBest("ipow", { score, streak: bestStreak });
        const best = getBest("ipow");
        const replay = resultScreen(container, "Potencias de iⁿ",
          `<span class="game-result__big">${score}</span> aciertos en ${IPOW_TIME}s · mejor racha ${bestStreak}`,
          record ? "¡Nuevo récord! 🏆" : `Tu mejor marca: ${best.score} aciertos`);
        replay.addEventListener("click", start);
      }

      nextN(); paint();
    }
    start();
  }

  /* ============================================================
     5) ORDENÁ LA CADENA
     ============================================================ */
  const CHAIN_ROUNDS = [
    { title: "Ordená los conjuntos por inclusión (de menor a mayor)", sep: "⊂", items: ["\\mathbb{N}", "\\mathbb{Z}", "\\mathbb{Q}", "\\mathbb{R}", "\\mathbb{C}"] },
    { title: "Ordená los números de menor a mayor", sep: "&lt;", items: ["-3", "-\\tfrac{1}{2}", "0", "\\sqrt{2}", "\\pi"] },
    { title: "Ordená de menor a mayor", sep: "&lt;", items: ["\\sqrt{2}", "\\sqrt{5}", "3", "\\sqrt{16}"] },
    { title: "Ordená las potencias de menor a mayor", sep: "&lt;", items: ["2^{0}", "2^{1}", "2^{2}", "2^{3}"] },
    { title: "Ordená los módulos de menor a mayor", sep: "&lt;", items: ["|3i|", "|4|", "|3+4i|", "|6|"] },
    { title: "Ordená de menor a mayor", sep: "&lt;", items: ["-\\sqrt{2}", "-1", "0", "1", "\\sqrt{3}"] },
  ];
  function chain(container) {
    function start() {
      const rounds = shuffle(CHAIN_ROUNDS);
      let r = 0, mistakes = 0, elapsed = 0, tid = 0, placed = 0, lock = false;
      const body = shell(container,
        `<div class="game-hud__item"><span class="game-hud__label">Ronda</span><span class="game-hud__val"><span id="g-r">1</span>/${rounds.length}</span></div>
         <div class="game-hud__item"><span class="game-hud__label">Errores</span><span class="game-hud__val" id="g-mis">0</span></div>
         <div class="game-hud__item"><span class="game-hud__label">Tiempo</span><span class="game-hud__val" id="g-time">0:00</span></div>`);
      const elR = container.querySelector("#g-r"), elMis = container.querySelector("#g-mis"), elTime = container.querySelector("#g-time");
      tid = every(() => { elapsed++; elTime.textContent = fmtTime(elapsed); }, 1000);

      function paint() {
        lock = false; placed = 0;
        const round = rounds[r]; elR.textContent = r + 1;
        const sep = round.sep || "&lt;";
        const chips = shuffle(round.items.map((tex, idx) => ({ tex, idx })));
        body.innerHTML =
          `<p class="game-ask">${round.title}</p>
           <div class="chain-slots">${round.items.map((_, i) => `<span class="chain-slot" data-pos="${i}">${i + 1}</span>`).join(`<span class="chain-arrow">${sep}</span>`)}</div>
           <div class="chain-pool" id="g-pool">${chips.map(c => `<button class="chain-chip" data-idx="${c.idx}">\\(${c.tex}\\)</button>`).join("")}</div>
           <div class="game-feedback" id="g-fb"></div>`;
        render(body);
        const slots = container.querySelectorAll(".chain-slot");
        const fb = container.querySelector("#g-fb");
        container.querySelector("#g-pool").addEventListener("click", e => {
          const b = e.target.closest(".chain-chip"); if (!b || lock) return;
          const idx = +b.dataset.idx;
          if (idx === placed) {
            const slot = slots[placed];
            slot.innerHTML = b.innerHTML; slot.classList.add("filled");
            b.remove(); placed++;
            if (placed === round.items.length) {
              lock = true;
              fb.className = "game-feedback ok show"; fb.innerHTML = "¡Orden correcto!";
              after(() => { if (r < rounds.length - 1) { r++; paint(); } else finish(); }, 700);
            }
          } else {
            mistakes++; elMis.textContent = mistakes;
            b.classList.add("shake"); after(() => b.classList.remove("shake"), 400);
          }
        });
      }
      function finish() {
        clearInterval(tid);
        const prev = getBest("chain");
        const record = !prev || mistakes < prev.mistakes || (mistakes === prev.mistakes && elapsed < prev.secs);
        if (record) setBest("chain", { mistakes, secs: elapsed });
        const best = getBest("chain");
        const replay = resultScreen(container, "Ordená la cadena",
          `<span class="game-result__big">${mistakes}</span> errores · ${fmtTime(elapsed)}`,
          record ? "¡Nuevo récord! 🏆" : `Tu mejor marca: ${best.mistakes} errores (${fmtTime(best.secs)})`);
        replay.addEventListener("click", start);
      }
      paint();
    }
    start();
  }

  /* ============================================================
     6) CONSTRUCTOR DE TABLAS DE VERDAD
     ============================================================ */
  const TT_ROWS = [[true, true], [true, false], [false, true], [false, false]];
  const TRUTH_PROPS = [
    { tex: "p \\wedge q", res: [true, false, false, false] },
    { tex: "p \\vee q", res: [true, true, true, false] },
    { tex: "p \\rightarrow q", res: [true, false, true, true] },
    { tex: "p \\leftrightarrow q", res: [true, false, false, true] },
    { tex: "p \\veebar q", res: [false, true, true, false] },
    { tex: "\\sim(p \\wedge q)", res: [false, true, true, true] },
    { tex: "p \\wedge \\sim q", res: [false, true, false, false] },
    { tex: "\\sim p \\vee q", res: [true, false, true, true] },
  ];
  function truthbuild(container) {
    function start() {
      const deck = shuffle(TRUTH_PROPS).slice(0, 6);
      let i = 0, score = 0;
      const body = shell(container,
        `<div class="game-hud__item"><span class="game-hud__label">Tabla</span><span class="game-hud__val"><span id="g-i">1</span>/${deck.length}</span></div>
         <div class="game-hud__item"><span class="game-hud__label">Aciertos</span><span class="game-hud__val" id="g-score">0</span></div>`);
      const elI = container.querySelector("#g-i"), elScore = container.querySelector("#g-score");
      function paint() {
        const prop = deck[i]; elI.textContent = i + 1;
        const ans = [null, null, null, null];
        body.innerHTML =
          `<p class="game-ask">Completá la columna de \\(${prop.tex}\\). Tocá cada celda para cambiar entre V y F.</p>
           <div class="tbl-wrap"><table class="tbl"><thead><tr><th>\\(p\\)</th><th>\\(q\\)</th><th>\\(${prop.tex}\\)</th></tr></thead>
           <tbody id="g-rows">${TT_ROWS.map((row, k) => `<tr>
              <td class="${row[0] ? "v-true" : "v-false"}">${row[0] ? "V" : "F"}</td>
              <td class="${row[1] ? "v-true" : "v-false"}">${row[1] ? "V" : "F"}</td>
              <td><button class="tt-btn" data-k="${k}">?</button></td></tr>`).join("")}</tbody></table></div>
           <div class="btn-row" style="justify-content:center"><button class="btn btn--primary" id="g-check">Comprobar</button></div>
           <div class="game-feedback" id="g-fb"></div>`;
        render(body);
        const fb = container.querySelector("#g-fb");
        container.querySelector("#g-rows").addEventListener("click", e => {
          const b = e.target.closest(".tt-btn"); if (!b || b.disabled) return;
          const k = +b.dataset.k;
          ans[k] = ans[k] === null ? true : ans[k] === true ? false : null;
          b.textContent = ans[k] === null ? "?" : ans[k] ? "V" : "F";
          b.className = "tt-btn" + (ans[k] === null ? "" : ans[k] ? " v-true" : " v-false");
        });
        container.querySelector("#g-check").addEventListener("click", () => {
          const ok = prop.res.every((v, k) => ans[k] === v);
          container.querySelectorAll(".tt-btn").forEach((b, k) => { b.disabled = true; b.classList.add(ans[k] === prop.res[k] ? "cell-ok" : "cell-bad"); });
          if (ok) { score++; elScore.textContent = score; fb.className = "game-feedback ok show"; fb.innerHTML = "✓ ¡Tabla correcta!"; }
          else { fb.className = "game-feedback no show"; fb.innerHTML = "✗ Hay errores: mirá las celdas en rojo."; }
          const last = i >= deck.length - 1;
          container.querySelector("#g-check").outerHTML = `<button class="btn btn--primary" id="g-next">${last ? "Ver resultado →" : "Siguiente →"}</button>`;
          container.querySelector("#g-next").addEventListener("click", () => { if (last) finish(); else { i++; paint(); } });
        });
      }
      function finish() {
        const best = getBest("truthbuild") || 0; const record = score > best;
        if (record) setBest("truthbuild", score);
        const replay = resultScreen(container, "Tablas de verdad",
          `<span class="game-result__big">${score}</span> tablas correctas de ${deck.length}`,
          record ? "¡Nuevo récord! 🏆" : `Tu mejor marca: ${getBest("truthbuild")}`);
        replay.addEventListener("click", start);
      }
      paint();
    }
    start();
  }

  /* ============================================================
     7) VENN A CIEGAS
     ============================================================ */
  function venn2(shaded) {
    const f = "var(--accent)", W = 250, H = 168, ax = 98, bx = 152, cy = 84, R = 56;
    const shapes = {
      onlyA: `<circle cx="${ax}" cy="${cy}" r="${R}" fill="${f}" mask="url(#v-mb)"/>`,
      onlyB: `<circle cx="${bx}" cy="${cy}" r="${R}" fill="${f}" mask="url(#v-ma)"/>`,
      AB: `<g clip-path="url(#v-ca)"><circle cx="${bx}" cy="${cy}" r="${R}" fill="${f}"/></g>`,
      none: `<rect x="4" y="4" width="${W - 8}" height="${H - 8}" fill="${f}" mask="url(#v-mab)"/>`,
    };
    const fills = shaded.map(k => shapes[k]).join("");
    return `<svg viewBox="0 0 ${W} ${H}" class="venn-svg" style="max-width:330px;width:100%">
      <defs>
        <clipPath id="v-ca"><circle cx="${ax}" cy="${cy}" r="${R}"/></clipPath>
        <mask id="v-ma"><rect width="${W}" height="${H}" fill="white"/><circle cx="${ax}" cy="${cy}" r="${R}" fill="black"/></mask>
        <mask id="v-mb"><rect width="${W}" height="${H}" fill="white"/><circle cx="${bx}" cy="${cy}" r="${R}" fill="black"/></mask>
        <mask id="v-mab"><rect width="${W}" height="${H}" fill="white"/><circle cx="${ax}" cy="${cy}" r="${R}" fill="black"/><circle cx="${bx}" cy="${cy}" r="${R}" fill="black"/></mask>
      </defs>
      <rect x="4" y="4" width="${W - 8}" height="${H - 8}" rx="12" fill="var(--surface-2)" stroke="var(--border)"/>
      <text x="16" y="22" font-size="12" fill="var(--muted)" font-weight="700">U</text>
      <g style="fill-opacity:.55">${fills}</g>
      <circle cx="${ax}" cy="${cy}" r="${R}" fill="none" stroke="var(--text)" stroke-width="2"/>
      <circle cx="${bx}" cy="${cy}" r="${R}" fill="none" stroke="var(--text)" stroke-width="2"/>
      <text x="${ax - 34}" y="${cy + 4}" font-size="15" font-weight="700" fill="var(--text)">A</text>
      <text x="${bx + 24}" y="${cy + 4}" font-size="15" font-weight="700" fill="var(--text)">B</text>
    </svg>`;
  }
  const VENN_EXPR = [
    { tex: "A \\cup B", reg: ["onlyA", "onlyB", "AB"] },
    { tex: "A \\cap B", reg: ["AB"] },
    { tex: "A - B", reg: ["onlyA"] },
    { tex: "B - A", reg: ["onlyB"] },
    { tex: "A \\,\\triangle\\, B", reg: ["onlyA", "onlyB"] },
    { tex: "A^{c}", reg: ["onlyB", "none"] },
    { tex: "B^{c}", reg: ["onlyA", "none"] },
    { tex: "(A \\cap B)^{c}", reg: ["onlyA", "onlyB", "none"] },
    { tex: "(A \\cup B)^{c}", reg: ["none"] },
    { tex: "A", reg: ["onlyA", "AB"] },
    { tex: "B", reg: ["onlyB", "AB"] },
  ];
  function vennguess(container) {
    function start() {
      let score = 0, lives = 3, answered = false;
      const body = shell(container,
        `<div class="game-hud__item"><span class="game-hud__label">Puntaje</span><span class="game-hud__val" id="g-score">0</span></div>
         <div class="game-hud__item"><span class="game-hud__label">Vidas</span><span class="game-hud__val" id="g-lives">●●●</span></div>`);
      const elScore = container.querySelector("#g-score"), elLives = container.querySelector("#g-lives");
      function paint() {
        answered = false;
        const correct = VENN_EXPR[Math.floor(Math.random() * VENN_EXPR.length)];
        const opts = shuffle([correct, ...shuffle(VENN_EXPR.filter(e => e.tex !== correct.tex)).slice(0, 3)]);
        body.innerHTML =
          `<p class="game-ask">¿Qué operación de conjuntos está sombreada?</p>
           <div class="venn-wrap">${venn2(correct.reg)}</div>
           <div class="classify-sets" id="g-opts">${opts.map(o => `<button class="classify-set venn-opt" data-tex="${o.tex}"><span class="classify-set__sym">\\(${o.tex}\\)</span></button>`).join("")}</div>
           <div class="game-feedback" id="g-fb"></div>
           <div class="btn-row" id="g-nav" style="justify-content:center"></div>`;
        render(body);
        const fb = container.querySelector("#g-fb"), nav = container.querySelector("#g-nav");
        container.querySelector("#g-opts").addEventListener("click", e => {
          const b = e.target.closest(".venn-opt"); if (!b || answered) return;
          answered = true;
          const ok = b.dataset.tex === correct.tex;
          container.querySelectorAll(".venn-opt").forEach(el => {
            el.disabled = true;
            if (el.dataset.tex === correct.tex) el.classList.add("correct");
            else if (el === b) el.classList.add("wrong");
          });
          if (ok) { score++; elScore.textContent = score; fb.className = "game-feedback ok show"; fb.innerHTML = "¡Correcto!"; }
          else { lives--; elLives.textContent = "●●●●".slice(0, lives).padEnd(3, "○"); fb.className = "game-feedback no show"; fb.innerHTML = `Era \\(${correct.tex}\\).`; }
          render(fb);
          const over = lives <= 0;
          nav.innerHTML = `<button class="btn btn--primary" id="g-next">${over ? "Ver resultado →" : "Siguiente →"}</button>`;
          container.querySelector("#g-next").addEventListener("click", () => { if (over) finish(); else paint(); });
        });
      }
      function finish() {
        const best = getBest("vennguess") || 0; const record = score > best;
        if (record) setBest("vennguess", score);
        const replay = resultScreen(container, "Venn a ciegas",
          `<span class="game-result__big">${score}</span> aciertos`,
          record ? "¡Nuevo récord! 🏆" : `Tu mejor marca: ${getBest("vennguess")} aciertos`);
        replay.addEventListener("click", start);
      }
      paint();
    }
    start();
  }

  /* ============================================================
     8) AHORCADO MATEMÁTICO
     ============================================================ */
  const HANG_MAX = 6;
  const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const HANG_WORDS = [
    { w: "POTENCIA", h: "Base elevada a un exponente." },
    { w: "RADICANDO", h: "Lo que está dentro de la raíz." },
    { w: "CONJUGADO", h: "De \\(a+bi\\) es \\(a-bi\\)." },
    { w: "MODULO", h: "Distancia al origen; el valor absoluto." },
    { w: "RACIONAL", h: "Se escribe como fracción de enteros." },
    { w: "IRRACIONAL", h: "Decimal infinito no periódico." },
    { w: "COMPLEJO", h: "Número de la forma \\(a+bi\\)." },
    { w: "IMAGINARIO", h: "\\(i\\), cuyo cuadrado es \\(-1\\)." },
    { w: "EXPONENTE", h: "Cuántas veces se multiplica la base." },
    { w: "TAUTOLOGIA", h: "Proposición siempre verdadera." },
    { w: "CONJUNCION", h: "El conectivo «y» (∧)." },
    { w: "DISYUNCION", h: "El conectivo «o» (∨)." },
    { w: "NEGACION", h: "Invierte el valor de verdad." },
    { w: "INTERSECCION", h: "\\(A\\cap B\\): los elementos comunes." },
    { w: "COMPLEMENTO", h: "\\(A^{c}\\): lo que no está en A." },
    { w: "DISTRIBUTIVA", h: "\\(a(b+c)=ab+ac\\)." },
    { w: "CONMUTATIVA", h: "El orden no altera el resultado." },
    { w: "BINOMICA", h: "Forma \\(a+bi\\) de un complejo." },
    { w: "PROPOSICION", h: "Oración con valor V o F." },
  ];
  function hangSVG(e) {
    const parts = [
      '<circle cx="80" cy="40" r="10"/>',
      '<line x1="80" y1="50" x2="80" y2="78"/>',
      '<line x1="80" y1="58" x2="66" y2="68"/>',
      '<line x1="80" y1="58" x2="94" y2="68"/>',
      '<line x1="80" y1="78" x2="68" y2="92"/>',
      '<line x1="80" y1="78" x2="92" y2="92"/>',
    ];
    return `<svg id="g-svg" class="hang-svg" viewBox="0 0 130 110" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
      <line x1="20" y1="100" x2="60" y2="100"/><line x1="34" y1="100" x2="34" y2="14"/>
      <line x1="34" y1="14" x2="80" y2="14"/><line x1="80" y1="14" x2="80" y2="30"/>
      ${parts.slice(0, e).join("")}</svg>`;
  }
  function hangman(container) {
    function start() {
      const deck = shuffle(HANG_WORDS);
      let i = 0, score = 0, errors = 0, guessed, done = false;
      const body = shell(container,
        `<div class="game-hud__item"><span class="game-hud__label">Resueltas</span><span class="game-hud__val" id="g-score">0</span></div>
         <div class="game-hud__item"><span class="game-hud__label">Errores</span><span class="game-hud__val" id="g-err">0/${HANG_MAX}</span></div>
         <div class="game-hud__item"><span class="game-hud__label">Palabra</span><span class="game-hud__val"><span id="g-i">1</span>/${deck.length}</span></div>`);
      const elScore = container.querySelector("#g-score"), elErr = container.querySelector("#g-err"), elI = container.querySelector("#g-i");
      function paint() {
        errors = 0; guessed = {}; done = false; elErr.textContent = "0/" + HANG_MAX; elI.textContent = i + 1;
        const word = deck[i].w;
        body.innerHTML =
          `<div class="hang-top">${hangSVG(0)}<div class="hang-hint"><span class="game-hud__label">Pista</span>${deck[i].h}</div></div>
           <div class="hang-word" id="g-word"></div>
           <div class="hang-keys" id="g-keys">${ALPHA.map(L => `<button class="hang-key" data-l="${L}">${L}</button>`).join("")}</div>
           <div class="game-feedback" id="g-fb"></div>`;
        render(body);
        const wordEl = container.querySelector("#g-word"), fb = container.querySelector("#g-fb");
        function drawWord() { wordEl.innerHTML = word.split("").map(ch => `<span class="hang-letter">${guessed[ch] ? ch : ""}</span>`).join(""); }
        function updateSVG() { const s = container.querySelector("#g-svg"); if (s) s.outerHTML = hangSVG(errors); }
        drawWord();
        container.querySelector("#g-keys").addEventListener("click", e => {
          const b = e.target.closest(".hang-key"); if (!b || done || b.disabled) return;
          const L = b.dataset.l; b.disabled = true;
          if (word.indexOf(L) >= 0) {
            guessed[L] = true; b.classList.add("hit"); drawWord();
            if (word.split("").every(ch => guessed[ch])) {
              done = true; score++; elScore.textContent = score;
              fb.className = "game-feedback ok show"; fb.innerHTML = "¡Palabra resuelta!";
              after(() => { if (i < deck.length - 1) { i++; paint(); } else finish(); }, 800);
            }
          } else {
            errors++; b.classList.add("miss"); elErr.textContent = errors + "/" + HANG_MAX; updateSVG();
            if (errors >= HANG_MAX) { done = true; fb.className = "game-feedback no show"; fb.innerHTML = `La palabra era <strong>${word}</strong>.`; after(finish, 1300); }
          }
        });
      }
      function finish() {
        const best = getBest("hangman") || 0; const record = score > best;
        if (record) setBest("hangman", score);
        const replay = resultScreen(container, "Ahorcado matemático",
          `<span class="game-result__big">${score}</span> palabras resueltas`,
          record ? "¡Nuevo récord! 🏆" : `Tu mejor marca: ${getBest("hangman")} palabras`);
        replay.addEventListener("click", start);
      }
      paint();
    }
    start();
  }

  /* ============================================================
     9) CONECTÁ (emparejar dos columnas)
     ============================================================ */
  const CONNECT_POOL = [
    ["i^{2}", "-1"], ["i^{0}", "1"], ["\\sqrt{-16}", "4i"], ["|6+8i|", "10"],
    ["2^{3}", "8"], ["\\sqrt{144}", "12"], ["i^{3}", "-i"], ["\\overline{2-3i}", "2+3i"],
    ["(1+i)(1-i)", "2"], ["3^{2}", "9"], ["|5i|", "5"], ["\\sqrt[3]{27}", "3"],
  ];
  function connect(container) {
    function start() {
      const ROUNDS = 3; let r = 0, mistakes = 0, elapsed = 0, tid = 0;
      const body = shell(container,
        `<div class="game-hud__item"><span class="game-hud__label">Ronda</span><span class="game-hud__val"><span id="g-r">1</span>/${ROUNDS}</span></div>
         <div class="game-hud__item"><span class="game-hud__label">Errores</span><span class="game-hud__val" id="g-mis">0</span></div>
         <div class="game-hud__item"><span class="game-hud__label">Tiempo</span><span class="game-hud__val" id="g-time">0:00</span></div>`);
      const elR = container.querySelector("#g-r"), elMis = container.querySelector("#g-mis"), elTime = container.querySelector("#g-time");
      tid = every(() => { elapsed++; elTime.textContent = fmtTime(elapsed); }, 1000);
      function paint() {
        elR.textContent = r + 1;
        const pairs = shuffle(CONNECT_POOL).slice(0, 5);
        let matched = 0, selLeft = null, lock = false;
        const lefts = pairs.map((p, idx) => ({ tex: p[0], id: idx }));
        const rights = shuffle(pairs.map((p, idx) => ({ tex: p[1], id: idx })));
        body.innerHTML =
          `<p class="game-ask">Conectá cada expresión con su valor: tocá una de la izquierda y luego su par a la derecha.</p>
           <div class="connect-cols" id="g-board">
             <div class="connect-col">${lefts.map(l => `<button class="connect-item" data-side="L" data-id="${l.id}">\\(${l.tex}\\)</button>`).join("")}</div>
             <div class="connect-col">${rights.map(x => `<button class="connect-item" data-side="R" data-id="${x.id}">\\(${x.tex}\\)</button>`).join("")}</div>
           </div>
           <div class="game-feedback" id="g-fb"></div>`;
        render(body);
        container.querySelector("#g-board").addEventListener("click", e => {
          const b = e.target.closest(".connect-item"); if (!b || lock || b.classList.contains("matched")) return;
          if (b.dataset.side === "L") {
            container.querySelectorAll('.connect-item[data-side="L"]').forEach(x => x.classList.remove("sel"));
            selLeft = b; b.classList.add("sel"); return;
          }
          if (!selLeft) return;
          if (b.dataset.id === selLeft.dataset.id) {
            b.classList.add("matched"); selLeft.classList.add("matched"); selLeft.classList.remove("sel"); selLeft = null; matched++;
            if (matched === pairs.length) { lock = true; after(() => { if (r < ROUNDS - 1) { r++; paint(); } else finish(); }, 600); }
          } else {
            mistakes++; elMis.textContent = mistakes; lock = true;
            const l = selLeft; b.classList.add("bad"); l.classList.add("bad");
            after(() => { b.classList.remove("bad"); l.classList.remove("bad", "sel"); selLeft = null; lock = false; }, 500);
          }
        });
      }
      function finish() {
        clearInterval(tid);
        const prev = getBest("connect");
        const record = !prev || mistakes < prev.mistakes || (mistakes === prev.mistakes && elapsed < prev.secs);
        if (record) setBest("connect", { mistakes, secs: elapsed });
        const best = getBest("connect");
        const replay = resultScreen(container, "Conectá",
          `<span class="game-result__big">${mistakes}</span> errores · ${fmtTime(elapsed)}`,
          record ? "¡Nuevo récord! 🏆" : `Tu mejor marca: ${best.mistakes} errores (${fmtTime(best.secs)})`);
        replay.addEventListener("click", start);
      }
      paint();
    }
    start();
  }

  /* ============================================================
     10) OPERÁ COMPLEJOS CONTRARRELOJ
     ============================================================ */
  const CX_TIME = 60;
  const CX_Q = [
    { q: "(2+3i)+(1-i)", opts: ["3+2i", "1+4i", "3+4i", "2+2i"], a: 0 },
    { q: "(2+3i)-(1-i)", opts: ["1+4i", "1+2i", "3+2i", "1-4i"], a: 0 },
    { q: "(1+i)(1-i)", opts: ["2", "0", "2i", "1+i"], a: 0 },
    { q: "i^{2}", opts: ["-1", "1", "i", "-i"], a: 0 },
    { q: "i^{7}", opts: ["-i", "i", "-1", "1"], a: 0 },
    { q: "i^{20}", opts: ["1", "-1", "i", "-i"], a: 0 },
    { q: "|3+4i|", opts: ["5", "7", "25", "\\sqrt{7}"], a: 0 },
    { q: "\\overline{2-5i}", opts: ["2+5i", "-2+5i", "2-5i", "-2-5i"], a: 0 },
    { q: "\\sqrt{-25}", opts: ["5i", "-5", "5", "25i"], a: 0 },
    { q: "(2i)^{2}", opts: ["-4", "4", "-2", "2i"], a: 0 },
    { q: "(1+i)^{2}", opts: ["2i", "2", "1+2i", "-2i"], a: 0 },
    { q: "\\dfrac{1}{i}", opts: ["-i", "i", "1", "-1"], a: 0 },
    { q: "(2+i)+(2-i)", opts: ["4", "4i", "2", "0"], a: 0 },
    { q: "i^{13}", opts: ["i", "-i", "1", "-1"], a: 0 },
    { q: "\\overline{-1+i}", opts: ["-1-i", "1-i", "-1+i", "1+i"], a: 0 },
    { q: "(4+2i)-(1+5i)", opts: ["3-3i", "3+3i", "5+7i", "3-7i"], a: 0 },
    { q: "|-6i|", opts: ["6", "-6", "6i", "36"], a: 0 },
    { q: "\\sqrt{-49}", opts: ["7i", "-7", "7", "49i"], a: 0 },
  ];
  function cxquiz(container) {
    function start() {
      const deck = shuffle(CX_Q); let i = 0, score = 0, timeLeft = CX_TIME, locked = false, tid = 0;
      const body = shell(container,
        `<div class="game-hud__item game-hud__item--grow"><span class="game-hud__label">Tiempo</span><div class="game-timer"><span id="g-bar" style="width:100%"></span></div></div>
         <div class="game-hud__item"><span class="game-hud__label">Aciertos</span><span class="game-hud__val" id="g-score">0</span></div>`);
      const bar = container.querySelector("#g-bar"), elScore = container.querySelector("#g-score");
      tid = every(() => { timeLeft--; bar.style.width = Math.max(0, timeLeft / CX_TIME * 100) + "%"; if (timeLeft <= 0) { clearInterval(tid); finish(); } }, 1000);
      function paint() {
        locked = false;
        const it = deck[i % deck.length];
        const opts = shuffle(it.opts.map((o, k) => ({ o, ok: k === it.a })));
        body.innerHTML =
          `<p class="game-ask">Calculá:</p>
           <div class="vof-statement">\\(${it.q}\\)</div>
           <div class="ipow-opts" id="g-opts">${opts.map(o => `<button class="btn ipow-opt" data-ok="${o.ok ? 1 : 0}">\\(${o.o}\\)</button>`).join("")}</div>
           <div class="game-feedback" id="g-fb"></div>`;
        render(body);
        const fb = container.querySelector("#g-fb");
        container.querySelector("#g-opts").addEventListener("click", e => {
          const b = e.target.closest(".ipow-opt"); if (!b || locked) return;
          locked = true;
          const correct = it.opts[it.a];
          if (b.dataset.ok === "1") { score++; elScore.textContent = score; fb.className = "game-feedback ok show"; fb.innerHTML = "✓ ¡Correcto!"; }
          else { fb.className = "game-feedback no show"; fb.innerHTML = `✗ Era \\(${correct}\\).`; }
          render(fb);
          container.querySelectorAll(".ipow-opt").forEach(x => x.disabled = true);
          after(() => { i++; if (timeLeft > 0) paint(); }, 800);
        });
      }
      function finish() {
        stopAll();
        const best = getBest("cxquiz") || 0; const record = score > best;
        if (record) setBest("cxquiz", score);
        const replay = resultScreen(container, "Operá complejos",
          `<span class="game-result__big">${score}</span> correctas en ${CX_TIME}s`,
          record ? "¡Nuevo récord! 🏆" : `Tu mejor marca: ${getBest("cxquiz")}`);
        replay.addEventListener("click", start);
      }
      paint();
    }
    start();
  }

  /* ============================================================
     11) CAZÁ EL ERROR
     ============================================================ */
  const SPOT_TIME = 60;
  const SPOT = [
    { s: "(a+b)^{2}=a^{2}+b^{2}", ok: false, exp: "Falta el doble producto: \\((a+b)^2=a^2+2ab+b^2\\)." },
    { s: "\\sqrt{16+9}=\\sqrt{16}+\\sqrt{9}=7", ok: false, exp: "\\(\\sqrt{25}=5\\), no 7." },
    { s: "i^{2}=-1", ok: true, exp: "Por definición de \\(i\\)." },
    { s: "\\sqrt{-4}\\cdot\\sqrt{-9}=\\sqrt{36}=6", ok: false, exp: "\\(2i\\cdot3i=6i^2=-6\\)." },
    { s: "(2^{3})^{2}=2^{6}", ok: true, exp: "Potencia de potencia: se multiplican." },
    { s: "2^{3}\\cdot2^{4}=2^{12}", ok: false, exp: "Igual base: se suman \\(=2^{7}\\)." },
    { s: "9^{1/2}=3", ok: true, exp: "La raíz principal es positiva." },
    { s: "9^{1/2}=-3", ok: false, exp: "La raíz principal es \\(+3\\)." },
    { s: "\\sqrt{(-6)^{2}}=6", ok: true, exp: "\\(\\sqrt{x^2}=|x|\\)." },
    { s: "\\sqrt{(-6)^{2}}=-6", ok: false, exp: "Es \\(|-6|=6\\)." },
    { s: "|-7|=7", ok: true, exp: "Correcto." },
    { s: "\\overline{3-5i}=3+5i", ok: true, exp: "Se cambia el signo de la parte imaginaria." },
    { s: "\\overline{3-5i}=-3+5i", ok: false, exp: "La parte real no cambia: \\(3+5i\\)." },
    { s: "|3+4i|=7", ok: false, exp: "\\(\\sqrt{9+16}=5\\)." },
    { s: "i^{23}=-i", ok: true, exp: "\\(23=4\\cdot5+3\\Rightarrow i^{3}=-i\\)." },
    { s: "(3+2)^{2}=25", ok: true, exp: "\\(5^2=25\\)." },
    { s: "a^{0}=0", ok: false, exp: "Es 1 (con \\(a\\neq0\\))." },
    { s: "\\sqrt[3]{-64}=-4", ok: true, exp: "\\((-4)^3=-64\\)." },
    { s: "\\dfrac{a}{0}=0", ok: false, exp: "No se puede dividir por cero." },
  ];
  function spot(container) {
    function start() {
      const deck = shuffle(SPOT); let i = 0, score = 0, timeLeft = SPOT_TIME, locked = false, tid = 0;
      const body = shell(container,
        `<div class="game-hud__item game-hud__item--grow"><span class="game-hud__label">Tiempo</span><div class="game-timer"><span id="g-bar" style="width:100%"></span></div></div>
         <div class="game-hud__item"><span class="game-hud__label">Aciertos</span><span class="game-hud__val" id="g-score">0</span></div>`);
      const bar = container.querySelector("#g-bar"), elScore = container.querySelector("#g-score");
      tid = every(() => { timeLeft--; bar.style.width = Math.max(0, timeLeft / SPOT_TIME * 100) + "%"; if (timeLeft <= 0) { clearInterval(tid); finish(); } }, 1000);
      function paint() {
        locked = false;
        const it = deck[i % deck.length];
        body.innerHTML =
          `<p class="game-ask">¿El paso está bien o tiene un error?</p>
           <div class="vof-statement">\\(${it.s}\\)</div>
           <div class="vof-buttons" id="g-vof">
             <button class="btn vof-btn vof-btn--v" data-v="1">Está bien</button>
             <button class="btn vof-btn vof-btn--f" data-v="0">Hay un error</button>
           </div>
           <div class="game-feedback" id="g-fb"></div>`;
        render(body);
        const fb = container.querySelector("#g-fb");
        container.querySelector("#g-vof").addEventListener("click", e => {
          const b = e.target.closest(".vof-btn"); if (!b || locked) return;
          locked = true;
          const said = b.dataset.v === "1";
          if (said === it.ok) { score++; elScore.textContent = score; fb.className = "game-feedback ok show"; fb.innerHTML = "✓ " + it.exp; }
          else { fb.className = "game-feedback no show"; fb.innerHTML = `✗ ${it.ok ? "Estaba bien." : "Tenía un error."} ${it.exp}`; }
          render(fb);
          container.querySelectorAll(".vof-btn").forEach(x => x.disabled = true);
          after(() => { i++; if (timeLeft > 0) paint(); }, 900);
        });
      }
      function finish() {
        stopAll();
        const best = getBest("spot") || 0; const record = score > best;
        if (record) setBest("spot", score);
        const replay = resultScreen(container, "Cazá el error",
          `<span class="game-result__big">${score}</span> correctas en ${SPOT_TIME}s`,
          record ? "¡Nuevo récord! 🏆" : `Tu mejor marca: ${getBest("spot")}`);
        replay.addEventListener("click", start);
      }
      paint();
    }
    start();
  }

  /* ---------------- export ---------------- */
  window.Games = { classify, vof, memo, ipow, chain, truthbuild, vennguess, hangman, connect, cxquiz, spot, stopAll, getBest };
})();
