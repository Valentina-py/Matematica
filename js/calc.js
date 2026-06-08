/* ============================================================
   Herramienta: CALCULADORA (reales y complejos)
   Evalúa expresiones con + - * / ^ √ , paréntesis, número i,
   módulo |z|, conjugado conj(), potencias enteras/negativas/
   fraccionarias (= raíces) y fracciones en la salida.
   Reconoce propiedades de igual base y las muestra como paso.
   Ej: 2^3*2^4=128 · 8^(1/3)=2 · 2^-2=1/4 · (1+i)(1-i)=2 ·
       i^23=-i · √-16=4i · |3+4i|=5 · conj(2+3i)=2-3i
   ============================================================ */
(function () {
  "use strict";

  /* ---------- aritmética compleja ---------- */
  const C = (re, im) => ({ re: re, im: im || 0 });
  function cadd(a, b) { return C(a.re + b.re, a.im + b.im); }
  function csub(a, b) { return C(a.re - b.re, a.im - b.im); }
  function cneg(a) { return C(-a.re, -a.im); }
  function cmul(a, b) { return C(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re); }
  function cdiv(a, b) { const d = b.re * b.re + b.im * b.im; return C((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d); }
  function cpowInt(z, n) {
    const neg = n < 0; n = Math.abs(n);
    let r = C(1, 0), base = z;
    while (n > 0) { if (n & 1) r = cmul(r, base); base = cmul(base, base); n >>= 1; }
    return neg ? cdiv(C(1, 0), r) : r;
  }
  function csqrt(z) {
    const r = Math.hypot(z.re, z.im);
    let re = Math.sqrt(Math.max(0, (r + z.re) / 2)), im = Math.sqrt(Math.max(0, (r - z.re) / 2));
    if (z.im < 0) im = -im;
    return C(re, im);
  }

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
    return (f && f.d !== 1) ? fracTex(f) : String(x);
  }
  function nice(n) { return isFinite(n) ? numTex(n) : "∞"; }
  function fmt(z) {
    const re = round9(z.re), im = round9(z.im);
    if (im === 0) return numTex(re);
    const neg = im < 0, a = Math.abs(im);
    const coef = Math.abs(a - 1) < 1e-12 ? "" : numTex(a);
    const imPart = coef + "i";
    if (re === 0) return (neg ? "-" : "") + imPart;
    return numTex(re) + (neg ? " - " : " + ") + imPart;
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
      else if (/[a-zA-Z]/.test(c)) {
        let j = i + 1; while (j < s.length && /[a-zA-Z]/.test(s[j])) j++;
        const w = s.slice(i, j).toLowerCase(); i = j;
        if (w === "i") t.push({ t: "i" });
        else if (w === "conj") t.push({ t: "func", v: "conj" });
        else throw new Error("No reconozco «" + w + "». Usá i, conj o √.");
      }
      else if (c === "√") { t.push({ t: "sqrt" }); i++; }
      else if ("+-*/^".includes(c)) { t.push({ t: "op", v: c }); i++; }
      else if (c === "(") { t.push({ t: "(" }); i++; }
      else if (c === ")") { t.push({ t: ")" }); i++; }
      else if (c === "|") { t.push({ t: "bar" }); i++; }
      else throw new Error("Símbolo no reconocido: «" + c + "»");
    }
    return t;
  }
  // las barras | abren o cierran un módulo según el contexto
  function classifyBars(tokens) {
    const out = []; let depth = 0;
    const valueEnds = tk => tk && (tk.t === "num" || tk.t === "i" || tk.t === ")" || tk.t === "mclose");
    for (const tk of tokens) {
      if (tk.t === "bar") {
        if (depth > 0 && valueEnds(out[out.length - 1])) { out.push({ t: "mclose" }); depth--; }
        else { out.push({ t: "mopen" }); depth++; }
      } else out.push(tk);
    }
    return out;
  }

  /* ---------- parser recursivo → AST ---------- */
  function parseExpr(tokens) {
    let pos = 0;
    const peek = () => tokens[pos];
    const eat = () => tokens[pos++];
    const starts = tk => tk && (tk.t === "num" || tk.t === "i" || tk.t === "(" || tk.t === "sqrt" || tk.t === "func" || tk.t === "mopen");
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
        else if (starts(tk)) { n = { type: "*", a: n, b: F() }; }
        else break;
      }
      return n;
    }
    function F() {
      const tk = peek();
      if (tk && tk.t === "op" && tk.v === "-") { eat(); return { type: "neg", a: F() }; }
      if (tk && tk.t === "op" && tk.v === "+") { eat(); return F(); }
      if (tk && tk.t === "sqrt") { eat(); return { type: "sqrt", a: F() }; }
      if (tk && tk.t === "func") { eat(); return { type: tk.v, a: F() }; }
      let base = Atom();
      if (peek() && peek().t === "op" && peek().v === "^") { eat(); base = { type: "^", a: base, b: F() }; }
      return base;
    }
    function Atom() {
      const tk = peek();
      if (!tk) throw new Error("Expresión incompleta.");
      if (tk.t === "num") { eat(); return { type: "num", val: tk.v }; }
      if (tk.t === "i") { eat(); return { type: "i" }; }
      if (tk.t === "(") { eat(); const e = E(); if (!peek() || peek().t !== ")") throw new Error("Falta cerrar un paréntesis."); eat(); return e; }
      if (tk.t === "mopen") { eat(); const e = E(); if (!peek() || peek().t !== "mclose") throw new Error("Falta cerrar la barra | del módulo."); eat(); return { type: "mod", a: e }; }
      throw new Error("Se esperaba un número, i o un paréntesis.");
    }
    const ast = E();
    if (pos < tokens.length) throw new Error("Sobran símbolos (¿faltó un operador o cerrar | ?).");
    return ast;
  }

  /* ---------- evaluación ---------- */
  function cpow(a, b) {
    if (Math.abs(b.im) > 1e-9) throw new Error("El exponente debe ser real.");
    const E = b.re;
    if (Math.abs(E - Math.round(E)) < 1e-9) return cpowInt(a, Math.round(E)); // entero (vale para complejos)
    if (Math.abs(a.im) > 1e-9) throw new Error("Exponente fraccionario solo para base real (sin i).");
    const A = a.re;
    if (A >= 0) return C(Math.pow(A, E), 0);
    const f = approxFrac(E);
    if (f && f.d % 2 === 1) { const r = Math.pow(Math.abs(A), E); return C((f.n % 2 === 0 ? 1 : -1) * r, 0); }
    throw new Error("Raíz de índice par de un número negativo: no es real (usá la forma compleja).");
  }
  function ev(n) {
    switch (n.type) {
      case "num": return C(n.val, 0);
      case "i": return C(0, 1);
      case "neg": return cneg(ev(n.a));
      case "+": return cadd(ev(n.a), ev(n.b));
      case "-": return csub(ev(n.a), ev(n.b));
      case "*": return cmul(ev(n.a), ev(n.b));
      case "/": { const b = ev(n.b); if (b.re * b.re + b.im * b.im === 0) throw new Error("No se puede dividir por cero."); return cdiv(ev(n.a), b); }
      case "^": return cpow(ev(n.a), ev(n.b));
      case "sqrt": return csqrt(ev(n.a));
      case "conj": { const a = ev(n.a); return C(a.re, -a.im); }
      case "mod": { const a = ev(n.a); return C(Math.hypot(a.re, a.im), 0); }
    }
    throw new Error("Expresión inválida.");
  }
  function evReal(n) { const z = ev(n); return Math.abs(z.im) < 1e-9 ? z.re : NaN; }

  /* ---------- paso según la propiedad de potencias ---------- */
  function describe(n, resTex) {
    if (n.type === "^" && n.a.type === "^" && n.a.a.type === "num" && n.a.b.type === "num" && n.b.type === "num") {
      const b = n.a.a.val, m = n.a.b.val, p = n.b.val;
      return `(${b}^{${m}})^{${p}} = ${b}^{${m}\\cdot${p}} = ${b}^{${m * p}} = ${resTex}`;
    }
    if (n.type === "^" && n.a.type === "num") {
      const B = n.a.val, E = evReal(n.b);
      if (!isFinite(E)) return null;
      if (Number.isInteger(E) && E < 0) return `${B}^{${E}} = \\dfrac{1}{${B}^{${-E}}} = ${resTex}`;
      if (!Number.isInteger(E)) {
        const f = approxFrac(E);
        if (f && f.d > 1) {
          const body = f.n === 1 ? `${B}` : `${B}^{${f.n}}`;
          const rad = f.d === 2 ? `\\sqrt{${body}}` : `\\sqrt[${f.d}]{${body}}`;
          return `${B}^{${fracTex(f)}} = ${rad} = ${resTex}`;
        }
      }
      return `${B}^{${E}} = ${resTex}`;
    }
    if ((n.type === "*" || n.type === "/") && n.a.type === "^" && n.b.type === "^" &&
      n.a.a.type === "num" && n.b.a.type === "num" && n.a.a.val === n.b.a.val &&
      n.a.b.type === "num" && n.b.b.type === "num") {
      const B = n.a.a.val, m = n.a.b.val, k = n.b.b.val;
      if (n.type === "*") return `${B}^{${m}} \\cdot ${B}^{${k}} = ${B}^{${m}+${k}} = ${B}^{${m + k}} = ${resTex}`;
      return `\\dfrac{${B}^{${m}}}{${B}^{${k}}} = ${B}^{${m}-${k}} = ${B}^{${m - k}} = ${resTex}`;
    }
    return null;
  }

  function evaluate(src) { return parseExpr(classifyBars(tokenize(normalize(src)))); }

  /* ---------- UI ---------- */
  const EXAMPLES = ["2^3*2^4", "2^-2", "8^(1/3)", "(1+i)(1-i)", "i^23", "√-16", "|3+4i|", "conj(2+3i)"];

  function build(container) {
    container.innerHTML = `
      <div class="tool">
        <div class="field">
          <label>Escribí una operación (real o compleja)</label>
          <input class="input input--mono" id="cl-expr" value="2^3*2^4" placeholder="ej: 2^-2 · 8^(1/3) · (1+i)(1-i) · |3+4i|" autocomplete="off" />
        </div>
        <div class="op-keys" id="cl-keys">
          <button data-ins="i">i</button>
          <button data-ins="^" title="Potencia">^</button>
          <button data-ins="+">+</button>
          <button data-ins="-">−</button>
          <button data-ins="*">×</button>
          <button data-ins="/">÷</button>
          <button data-ins="√">√</button>
          <button data-ins="(">(</button>
          <button data-ins=")">)</button>
          <button data-ins="|" title="Módulo |z|">|&nbsp;|</button>
          <button data-ins="conj(" title="Conjugado">conj</button>
        </div>
        <p class="muted" style="font-size:12.5px">
          Potencias con <code>^</code> (negativas <code>2^-2</code>, fraccionarias = raíces <code>8^(1/3)</code>),
          número <code>i</code>, <code>√</code> de negativos, módulo <code>|z|</code> y conjugado <code>conj(...)</code>.
          La <code>√</code>/<code>conj</code> toman solo lo que sigue (usá paréntesis); fracciones con <code>/</code>.
        </p>
        <div class="venn-chips" id="cl-ex">${EXAMPLES.map(e => `<button data-ex="${e}">${e}</button>`).join("")}</div>
        <div id="cl-out"></div>
        <div class="callout" style="margin-top:18px">
          <strong class="callout__tag">Propiedades de igual base</strong>
          $$ a^{m}\\cdot a^{n}=a^{m+n} \\quad a^{m}\\div a^{n}=a^{m-n} \\quad (a^{m})^{n}=a^{m\\cdot n} \\quad a^{0}=1 \\quad a^{-n}=\\tfrac{1}{a^{n}} \\quad a^{m/n}=\\sqrt[n]{a^{m}} $$
        </div>
      </div>`;

    const input = container.querySelector("#cl-expr");
    const out = container.querySelector("#cl-out");

    container.querySelector("#cl-keys").addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      const ins = b.dataset.ins;
      const s = input.selectionStart ?? input.value.length, eN = input.selectionEnd ?? input.value.length;
      input.value = input.value.slice(0, s) + ins + input.value.slice(eN);
      input.focus(); input.selectionStart = input.selectionEnd = s + ins.length;
      run();
    });
    container.querySelector("#cl-ex").addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      input.value = b.dataset.ex; input.focus(); run();
    });

    function run() {
      const raw = input.value.trim();
      if (!raw) { out.innerHTML = `<div class="result-box empty">Escribí una operación para ver el resultado.</div>`; return; }
      try {
        const ast = evaluate(raw);
        const z = ev(ast);
        if (!isFinite(z.re) || !isFinite(z.im)) throw new Error("El resultado no está definido.");
        const resTex = fmt(z);
        const step = describe(ast, resTex);
        const isComplex = Math.abs(round9(z.im)) > 0;
        const conj = C(z.re, -z.im), mod = Math.hypot(z.re, z.im);
        out.innerHTML =
          (step ? `<div class="callout" style="margin-top:18px"><strong class="callout__tag">Cómo se resuelve</strong><div>$$ ${step} $$</div></div>` : "") +
          `<div class="result-box" style="border-style:solid${step ? "" : ";margin-top:18px"}">
             <div style="font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Resultado</div>
             <div style="font-size:24px;font-weight:700">\\(${resTex}\\)</div>
           </div>` +
          (isComplex ? `<div class="stat-row" style="margin-top:14px">
             <div class="stat"><div class="stat__num">\\(${nice(z.re)}\\)</div><div class="stat__label">Parte real</div></div>
             <div class="stat"><div class="stat__num">\\(${nice(z.im)}\\)</div><div class="stat__label">Parte imaginaria</div></div>
             <div class="stat"><div class="stat__num">\\(${nice(mod)}\\)</div><div class="stat__label">Módulo |z|</div></div>
             <div class="stat"><div class="stat__num" style="font-size:20px">\\(${fmt(conj)}\\)</div><div class="stat__label">Conjugado</div></div>
           </div>` : "");
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
  window.Tools.calc = build;
})();
