/* ============================================================
   Herramienta: POTENCIAS (potenciación)
   Evalúa expresiones con ^ (exponentes enteros, negativos y
   fraccionarios = raíces), ·, ÷, √ y paréntesis. Muestra el
   resultado (fracción exacta cuando se puede) y, si reconoce
   una propiedad de igual base, el paso.
   Ej: 2^3·2^4 = 2^7 = 128 · (2^3)^2 = 2^6 = 64 · 2^-2 = 1/4 · 8^(1/3) = 2
   ============================================================ */
(function () {
  "use strict";

  /* ---------- formato con fracciones ---------- */
  function round9(n) { const r = Math.round(n * 1e9) / 1e9; return Object.is(r, -0) ? 0 : r; }
  function approxFrac(x) {
    const sign = x < 0 ? -1 : 1; x = Math.abs(x);
    for (let d = 1; d <= 1000; d++) { const n = Math.round(x * d); if (Math.abs(n / d - x) < 1e-7) return { n: sign * n, d: d }; }
    return null;
  }
  function fracTex(f) { return `\\tfrac{${f.n}}{${f.d}}`; }
  function numTex(x) {
    x = round9(x);
    if (Number.isInteger(x)) return String(x);
    const f = approxFrac(x);
    if (f && f.d !== 1) return fracTex(f);
    return String(x);
  }

  /* ---------- léxico ---------- */
  function normalize(src) {
    return src.replace(/[−–—]/g, "-").replace(/[×·]/g, "*").replace(/÷/g, "/").replace(/ra[ií]z|sqrt/gi, "√").replace(/\s+/g, "");
  }
  function tokenize(s) {
    const t = []; let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (/[0-9.]/.test(c)) { let j = i + 1; while (j < s.length && /[0-9.]/.test(s[j])) j++; t.push({ t: "num", v: parseFloat(s.slice(i, j)) }); i = j; }
      else if (c === "√") { t.push({ t: "sqrt" }); i++; }
      else if ("+-*/^".includes(c)) { t.push({ t: "op", v: c }); i++; }
      else if (c === "(") { t.push({ t: "(" }); i++; }
      else if (c === ")") { t.push({ t: ")" }); i++; }
      else throw new Error("Símbolo no reconocido: «" + c + "»");
    }
    return t;
  }

  /* ---------- parser recursivo → AST ----------
     E := T (('+'|'-') T)*
     T := F (('*'|'/') F | F implícito)*
     F := ('-'|'+')F | √F | Atom ('^' F)?
     Atom := num | '(' E ')'
  */
  function parseExpr(tokens) {
    let pos = 0;
    const peek = () => tokens[pos];
    const eat = () => tokens[pos++];
    function E() {
      let n = T();
      while (peek() && peek().t === "op" && (peek().v === "+" || peek().v === "-")) { const op = eat().v; n = { type: op, a: n, b: T() }; }
      return n;
    }
    function T() {
      let n = F();
      while (peek()) {
        const tk = peek();
        if (tk.t === "op" && (tk.v === "*" || tk.v === "/")) { const op = eat().v; n = { type: op, a: n, b: F() }; }
        else if (tk.t === "num" || tk.t === "(" || tk.t === "sqrt") { n = { type: "*", a: n, b: F() }; } // multiplicación implícita
        else break;
      }
      return n;
    }
    function F() {
      const tk = peek();
      if (tk && tk.t === "op" && tk.v === "-") { eat(); return { type: "neg", a: F() }; }
      if (tk && tk.t === "op" && tk.v === "+") { eat(); return F(); }
      if (tk && tk.t === "sqrt") { eat(); return { type: "sqrt", a: F() }; }
      let base = Atom();
      if (peek() && peek().t === "op" && peek().v === "^") { eat(); base = { type: "^", a: base, b: F() }; }
      return base;
    }
    function Atom() {
      const tk = peek();
      if (!tk) throw new Error("Expresión incompleta.");
      if (tk.t === "num") { eat(); return { type: "num", val: tk.v }; }
      if (tk.t === "(") { eat(); const e = E(); if (!peek() || peek().t !== ")") throw new Error("Falta cerrar un paréntesis."); eat(); return e; }
      if (tk.t === "sqrt") { eat(); return { type: "sqrt", a: F() }; }
      throw new Error("Se esperaba un número o un paréntesis.");
    }
    const ast = E();
    if (pos < tokens.length) throw new Error("Sobran símbolos en la expresión.");
    return ast;
  }

  /* ---------- evaluación ---------- */
  function ev(n) {
    switch (n.type) {
      case "num": return n.val;
      case "neg": return -ev(n.a);
      case "+": return ev(n.a) + ev(n.b);
      case "-": return ev(n.a) - ev(n.b);
      case "*": return ev(n.a) * ev(n.b);
      case "/": { const d = ev(n.b); if (d === 0) throw new Error("No se puede dividir por cero."); return ev(n.a) / d; }
      case "^": {
        const a = ev(n.a), b = ev(n.b), r = Math.pow(a, b);
        if (!isFinite(r) || isNaN(r)) throw new Error("Potencia no definida en los reales (¿base negativa con exponente fraccionario?). Para complejos usá «Números imaginarios».");
        return r;
      }
      case "sqrt": { const a = ev(n.a); if (a < 0) throw new Error("Raíz de un número negativo: usá «Números imaginarios»."); return Math.sqrt(a); }
    }
    throw new Error("Expresión inválida.");
  }

  /* ---------- paso según la propiedad ---------- */
  function describe(n, resTex) {
    // potencia de una potencia: (a^m)^p = a^{m·p}
    if (n.type === "^" && n.a.type === "^" && n.a.a.type === "num" && n.a.b.type === "num" && n.b.type === "num") {
      const b = n.a.a.val, m = n.a.b.val, p = n.b.val;
      return `(${b}^{${m}})^{${p}} = ${b}^{${m}\\cdot${p}} = ${b}^{${m * p}} = ${resTex}`;
    }
    // potencia simple a^E
    if (n.type === "^" && n.a.type === "num") {
      const B = n.a.val, Eexp = ev(n.b);
      if (Number.isInteger(Eexp) && Eexp < 0) return `${B}^{${Eexp}} = \\dfrac{1}{${B}^{${-Eexp}}} = ${resTex}`;
      if (!Number.isInteger(Eexp)) {
        const f = approxFrac(Eexp);
        if (f && f.d > 1) {
          const rad = f.n === 1 ? `\\sqrt[${f.d}]{${B}}` : `\\sqrt[${f.d}]{${B}^{${f.n}}}`;
          return `${B}^{${fracTex(f)}} = ${rad} = ${resTex}`;
        }
      }
      return `${B}^{${Eexp}} = ${resTex}`;
    }
    // igual base: a^m · a^n = a^{m+n}  /  a^m ÷ a^n = a^{m-n}
    if ((n.type === "*" || n.type === "/") && n.a.type === "^" && n.b.type === "^" &&
      n.a.a.type === "num" && n.b.a.type === "num" && n.a.a.val === n.b.a.val &&
      n.a.b.type === "num" && n.b.b.type === "num") {
      const B = n.a.a.val, m = n.a.b.val, k = n.b.b.val;
      if (n.type === "*") return `${B}^{${m}} \\cdot ${B}^{${k}} = ${B}^{${m}+${k}} = ${B}^{${m + k}} = ${resTex}`;
      return `\\dfrac{${B}^{${m}}}{${B}^{${k}}} = ${B}^{${m}-${k}} = ${B}^{${m - k}} = ${resTex}`;
    }
    return null;
  }

  /* ---------- UI ---------- */
  const EXAMPLES = ["2^3*2^4", "(2^3)^2", "2^-2", "8^(1/3)", "16^(3/4)", "(2/3)^2", "5^0", "2^10"];

  function build(container) {
    container.innerHTML = `
      <div class="tool">
        <div class="field">
          <label>Escribí una potencia o expresión con exponentes</label>
          <input class="input input--mono" id="pw-expr" value="2^3*2^4" placeholder="ej: 2^3*2^4  ·  (2^3)^2  ·  2^-2  ·  8^(1/3)" autocomplete="off" />
        </div>
        <div class="op-keys" id="pw-keys">
          <button data-ins="^" title="Potencia">^</button>
          <button data-ins="*">×</button>
          <button data-ins="/">÷</button>
          <button data-ins="+">+</button>
          <button data-ins="-">−</button>
          <button data-ins="√">√</button>
          <button data-ins="(">(</button>
          <button data-ins=")">)</button>
        </div>
        <p class="muted" style="font-size:12.5px">
          Usá <code>^</code> para la potencia. Exponentes <strong>negativos</strong> (<code>2^-2</code>) y
          <strong>fraccionarios</strong> = raíces (<code>8^(1/3)</code>, poné el exponente entre paréntesis).
          El resultado sale como fracción cuando es exacto.
        </p>
        <div class="venn-chips" id="pw-ex">${EXAMPLES.map(e => `<button data-ex="${e}">${e}</button>`).join("")}</div>
        <div id="pw-out"></div>
        <div class="callout" style="margin-top:18px">
          <strong class="callout__tag">Propiedades de igual base</strong>
          $$ a^{m}\\cdot a^{n}=a^{m+n} \\qquad a^{m}\\div a^{n}=a^{m-n} \\qquad (a^{m})^{n}=a^{m\\cdot n} \\qquad a^{0}=1 \\qquad a^{-n}=\\tfrac{1}{a^{n}} $$
        </div>
      </div>`;

    const input = container.querySelector("#pw-expr");
    const out = container.querySelector("#pw-out");

    container.querySelector("#pw-keys").addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      const ins = b.dataset.ins;
      const s = input.selectionStart ?? input.value.length, eN = input.selectionEnd ?? input.value.length;
      input.value = input.value.slice(0, s) + ins + input.value.slice(eN);
      input.focus(); input.selectionStart = input.selectionEnd = s + ins.length;
      run();
    });
    container.querySelector("#pw-ex").addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      input.value = b.dataset.ex; input.focus(); run();
    });

    function run() {
      const raw = input.value.trim();
      if (!raw) { out.innerHTML = `<div class="result-box empty">Escribí una potencia para ver el resultado.</div>`; return; }
      try {
        const ast = parseExpr(tokenize(normalize(raw)));
        const val = ev(ast);
        if (!isFinite(val)) throw new Error("El resultado no está definido.");
        const resTex = numTex(val);
        const step = describe(ast, resTex);
        out.innerHTML =
          (step ? `<div class="callout" style="margin-top:18px"><strong class="callout__tag">Cómo se resuelve</strong><div>$$ ${step} $$</div></div>` : "") +
          `<div class="result-box" style="border-style:solid">
             <div style="font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Resultado</div>
             <div style="font-size:24px;font-weight:700">$$ ${resTex} $$</div>
           </div>`;
        if (window.MathJaxRender) window.MathJaxRender(out);
      } catch (err) {
        out.innerHTML = `<div class="error-text">⚠️ ${err.message}</div>`;
      }
    }

    input.addEventListener("input", run);
    input.addEventListener("keydown", e => { if (e.key === "Enter") run(); });
    run();
  }

  window.Tools = window.Tools || {};
  window.Tools.potencias = build;
})();
