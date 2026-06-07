/* ============================================================
   Herramienta: NÚMEROS IMAGINARIOS / COMPLEJOS (evaluador de expresiones)
   Escribís una expresión con i, √ de negativos, potencias y paréntesis,
   y devuelve el resultado en forma binómica a+bi, con Re, Im, módulo y conjugado.
   Ej: (2+3i)+(1-i) · (1+i)(1-i) · i^23 · √-16 · (3+4i)/(1-2i)
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
  function cpow(z, n) {
    let neg = n < 0; n = Math.abs(n);
    let r = C(1, 0), base = z;
    while (n > 0) { if (n & 1) r = cmul(r, base); base = cmul(base, base); n >>= 1; }
    return neg ? cdiv(C(1, 0), r) : r;
  }
  function csqrt(z) {
    const r = Math.hypot(z.re, z.im);
    let re = Math.sqrt(Math.max(0, (r + z.re) / 2));
    let im = Math.sqrt(Math.max(0, (r - z.re) / 2));
    if (z.im < 0) im = -im;
    return C(re, im);
  }

  /* ---------- formato (muestra fracciones cuando el valor es exacto) ---------- */
  function round9(n) { const r = Math.round(n * 1e9) / 1e9; return Object.is(r, -0) ? 0 : r; }
  function approxFrac(x) {
    const sign = x < 0 ? -1 : 1; x = Math.abs(x);
    for (let d = 1; d <= 64; d++) {
      const n = Math.round(x * d);
      if (Math.abs(n / d - x) < 1e-7) return { n: sign * n, d: d };
    }
    return null;
  }
  // número → LaTeX: entero, fracción \tfrac, o decimal
  function numTex(x) {
    x = round9(x);
    if (Number.isInteger(x)) return String(x);
    const f = approxFrac(x);
    if (f && f.d !== 1) return `\\tfrac{${f.n}}{${f.d}}`;
    return String(x);
  }
  function nice(n) { return isFinite(n) ? numTex(n) : "∞"; }
  // complejo → LaTeX en forma a+bi
  function fmt(z) {
    const re = round9(z.re), im = round9(z.im);
    if (im === 0) return numTex(re);
    const neg = im < 0, a = Math.abs(im);
    const coef = Math.abs(a - 1) < 1e-12 ? "" : numTex(a);
    const imPart = coef + "i";
    if (re === 0) return (neg ? "-" : "") + imPart;
    return numTex(re) + (neg ? " - " : " + ") + imPart;
  }

  /* ---------- parser (tokenizar → implícitos/unario → RPN → evaluar) ---------- */
  function normalize(src) { return src.replace(/[−–—]/g, "-").replace(/ra[ií]z|sqrt/gi, "√").replace(/\s+/g, ""); }
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
  const valueEnds = tk => tk && (tk.t === "num" || tk.t === "i" || tk.t === ")" || tk.t === "mclose");
  function prep(tokens) {
    const out = []; let depth = 0;
    for (const raw of tokens) {
      let tk = raw;
      // las barras | abren o cierran un módulo según el contexto
      if (tk.t === "bar") {
        tk = (depth > 0 && valueEnds(out[out.length - 1])) ? (depth--, { t: "mclose" }) : (depth++, { t: "mopen" });
      }
      const prev = out[out.length - 1];
      if (prev) {
        const endsFactor = prev.t === "num" || prev.t === "i" || prev.t === ")" || prev.t === "mclose";
        const startsFactor = tk.t === "num" || tk.t === "i" || tk.t === "(" || tk.t === "sqrt" || tk.t === "mopen" || tk.t === "func";
        if (endsFactor && startsFactor) out.push({ t: "op", v: "*" });
      }
      if (tk.t === "op" && (tk.v === "+" || tk.v === "-")) {
        const p = out[out.length - 1];
        const unary = !p || p.t === "op" || p.t === "(" || p.t === "sqrt" || p.t === "mopen" || p.t === "func";
        if (unary) { if (tk.v === "-") out.push({ t: "op", v: "u-" }); continue; }
      }
      out.push(tk);
    }
    return out;
  }
  const PREC = { "+": 2, "-": 2, "*": 3, "/": 3, "^": 4, "u-": 5, "sqrt": 5, "conj": 5 };
  const RIGHT = { "^": true, "u-": true, "sqrt": true, "conj": true };
  function toRPN(tokens) {
    const out = [], ops = [];
    for (const tk of tokens) {
      if (tk.t === "num" || tk.t === "i") out.push(tk);
      else if (tk.t === "sqrt") ops.push({ t: "op", v: "sqrt" });
      else if (tk.t === "func") ops.push({ t: "op", v: tk.v });
      else if (tk.t === "op") {
        const o1 = tk.v;
        while (ops.length) {
          const top = ops[ops.length - 1];
          if (top.t !== "op") break;
          const o2 = top.v;
          if (RIGHT[o1] ? PREC[o2] > PREC[o1] : PREC[o2] >= PREC[o1]) out.push(ops.pop());
          else break;
        }
        ops.push({ t: "op", v: o1 });
      }
      else if (tk.t === "(" || tk.t === "mopen") ops.push(tk);
      else if (tk.t === ")") {
        while (ops.length && ops[ops.length - 1].t !== "(") {
          if (ops[ops.length - 1].t === "mopen") throw new Error("Barra | sin cerrar dentro de paréntesis.");
          out.push(ops.pop());
        }
        if (!ops.length) throw new Error("Paréntesis sin abrir.");
        ops.pop();
      }
      else if (tk.t === "mclose") {
        while (ops.length && ops[ops.length - 1].t !== "mopen") {
          if (ops[ops.length - 1].t === "(") throw new Error("Paréntesis sin cerrar dentro de | |.");
          out.push(ops.pop());
        }
        if (!ops.length) throw new Error("Falta abrir la barra | del módulo.");
        ops.pop();
        out.push({ t: "op", v: "mod" });
      }
    }
    while (ops.length) {
      const o = ops.pop();
      if (o.t === "(") throw new Error("Paréntesis sin cerrar.");
      if (o.t === "mopen") throw new Error("Falta cerrar la barra | del módulo.");
      out.push(o);
    }
    return out;
  }
  function evalRPN(rpn) {
    const st = [];
    for (const tk of rpn) {
      if (tk.t === "num") st.push(C(tk.v, 0));
      else if (tk.t === "i") st.push(C(0, 1));
      else {
        const v = tk.v;
        if (v === "sqrt") { if (!st.length) throw new Error("Expresión incompleta."); st.push(csqrt(st.pop())); }
        else if (v === "u-") { if (!st.length) throw new Error("Expresión incompleta."); st.push(cneg(st.pop())); }
        else if (v === "mod") { if (!st.length) throw new Error("Expresión incompleta."); const a = st.pop(); st.push(C(Math.hypot(a.re, a.im), 0)); }
        else if (v === "conj") { if (!st.length) throw new Error("Expresión incompleta."); const a = st.pop(); st.push(C(a.re, -a.im)); }
        else {
          if (st.length < 2) throw new Error("Expresión incompleta.");
          const b = st.pop(), a = st.pop();
          if (v === "+") st.push(cadd(a, b));
          else if (v === "-") st.push(csub(a, b));
          else if (v === "*") st.push(cmul(a, b));
          else if (v === "/") { if (b.re * b.re + b.im * b.im === 0) throw new Error("No se puede dividir por cero."); st.push(cdiv(a, b)); }
          else if (v === "^") {
            if (Math.abs(b.im) > 1e-9 || Math.abs(b.re - Math.round(b.re)) > 1e-9) throw new Error("El exponente debe ser un número entero.");
            st.push(cpow(a, Math.round(b.re)));
          }
        }
      }
    }
    if (st.length !== 1) throw new Error("Expresión mal formada.");
    return st[0];
  }
  function evaluate(src) { return evalRPN(toRPN(prep(tokenize(normalize(src))))); }

  /* ---------- UI ---------- */
  const EXAMPLES = ["(2+3i)+(1-i)", "(1+i)(1-i)", "i^23", "√-16", "(3+4i)/(1-2i)", "|3+4i|", "conj(2+3i)", "(1+i)/2"];

  function build(container) {
    container.innerHTML = `
      <div class="tool">
        <div class="field">
          <label>Escribí una expresión con números imaginarios</label>
          <input class="input input--mono" id="im-expr" value="(2+3i)+(1-i)" placeholder="ej: (1+i)(1-i)  ·  i^23  ·  √-16" autocomplete="off" />
        </div>
        <div class="op-keys" id="im-keys">
          <button data-ins="i">i</button>
          <button data-ins="+">+</button>
          <button data-ins="-">−</button>
          <button data-ins="*">×</button>
          <button data-ins="/">÷</button>
          <button data-ins="^">^</button>
          <button data-ins="√">√</button>
          <button data-ins="(">(</button>
          <button data-ins=")">)</button>
          <button data-ins="|" title="Módulo: escribí |z|">|&nbsp;|</button>
          <button data-ins="conj(" title="Conjugado de z">conj</button>
        </div>
        <p class="muted" style="font-size:12.5px">
          Operá con <code>i</code>, potencias <code>^</code>, <code>√</code> de negativos (\\(\\sqrt{-16}=4i\\)),
          <strong>módulo</strong> <code>|z|</code> (\\(|3+4i|=5\\)), <strong>conjugado</strong> <code>conj(...)</code> y paréntesis.
          <br>La <code>√</code> y <code>conj</code> toman <strong>solo lo que sigue</strong>: para varios términos usá paréntesis, p. ej. <code>√(16+9)</code>.
          Las <strong>fracciones</strong> van con <code>/</code> (<code>(1+i)/2</code>); la multiplicación puede ser implícita (<code>(1+i)(1-i)</code>).
        </p>
        <div class="venn-chips" id="im-ex">${EXAMPLES.map(e => `<button data-ex="${e}">${e}</button>`).join("")}</div>
        <div id="im-out"></div>
      </div>`;

    const input = container.querySelector("#im-expr");
    const out = container.querySelector("#im-out");

    container.querySelector("#im-keys").addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      const ins = b.dataset.ins;
      const s = input.selectionStart ?? input.value.length, eN = input.selectionEnd ?? input.value.length;
      input.value = input.value.slice(0, s) + ins + input.value.slice(eN);
      input.focus(); input.selectionStart = input.selectionEnd = s + ins.length;
      run();
    });
    container.querySelector("#im-ex").addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      input.value = b.dataset.ex; input.focus(); run();
    });

    function run() {
      const raw = input.value.trim();
      if (!raw) { out.innerHTML = `<div class="result-box empty">Escribí una expresión para ver el resultado.</div>`; return; }
      try {
        const z = evaluate(raw);
        if (!isFinite(z.re) || !isFinite(z.im)) throw new Error("El resultado no está definido.");
        const mod = Math.hypot(z.re, z.im);
        const conj = C(z.re, -z.im);
        out.innerHTML = `
          <div class="result-box" style="border-style:solid;margin-top:18px">
            <div style="font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Resultado (forma binómica)</div>
            <div style="font-size:24px;font-weight:700">\\(${fmt(z)}\\)</div>
          </div>
          <div class="stat-row" style="margin-top:14px">
            <div class="stat"><div class="stat__num">\\(${nice(z.re)}\\)</div><div class="stat__label">Parte real</div></div>
            <div class="stat"><div class="stat__num">\\(${nice(z.im)}\\)</div><div class="stat__label">Parte imaginaria</div></div>
            <div class="stat"><div class="stat__num">\\(${nice(mod)}\\)</div><div class="stat__label">Módulo |z|</div></div>
            <div class="stat"><div class="stat__num" style="font-size:20px">\\(${fmt(conj)}\\)</div><div class="stat__label">Conjugado</div></div>
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
  window.Tools.imaginarios = build;
})();
