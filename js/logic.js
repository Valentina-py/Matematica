/* ============================================================
   Generador de TABLAS DE VERDAD
   Parser de proposiciones lógicas → tabla de verdad + clasificación
   ============================================================ */
(function () {
  "use strict";

  // Normaliza símbolos alternativos a un set canónico
  function normalize(src) {
    return src
      .replace(/<->|<=>|↔|≡/g, "=")
      .replace(/->|=>|⇒|→|⊃/g, ">")
      .replace(/¬|!|~|∼/g, "~")
      .replace(/∧|&&|·|\*/g, "&")
      .replace(/∨|\|\||\+/g, "|")
      .replace(/⊻|⊕|\^/g, "#")     // xor interno
      .replace(/\s+/g, "");
  }

  // Tokeniza
  function tokenize(s) {
    const tokens = [];
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (/[a-zA-Z]/.test(c)) tokens.push({ t: "var", v: c });
      else if ("~&|#>=".includes(c)) tokens.push({ t: "op", v: c });
      else if (c === "(" || c === ")") tokens.push({ t: c });
      else throw new Error("Símbolo no reconocido: «" + c + "»");
    }
    return tokens;
  }

  // Precedencia (mayor = más fuerte)
  const PREC = { "~": 5, "&": 4, "#": 3, "|": 3, ">": 2, "=": 1 };
  const RIGHT = { "~": true, ">": true }; // asociatividad derecha

  // Shunting-yard → RPN
  function toRPN(tokens) {
    const out = [], ops = [];
    tokens.forEach(tk => {
      if (tk.t === "var") out.push(tk);
      else if (tk.t === "op") {
        while (ops.length) {
          const top = ops[ops.length - 1];
          if (top.t === "op" &&
             (PREC[top.v] > PREC[tk.v] || (PREC[top.v] === PREC[tk.v] && !RIGHT[tk.v]))) {
            out.push(ops.pop());
          } else break;
        }
        ops.push(tk);
      } else if (tk.t === "(") ops.push(tk);
      else if (tk.t === ")") {
        while (ops.length && ops[ops.length - 1].t !== "(") out.push(ops.pop());
        if (!ops.length) throw new Error("Paréntesis sin cerrar/abrir");
        ops.pop();
      }
    });
    while (ops.length) {
      const o = ops.pop();
      if (o.t === "(") throw new Error("Paréntesis sin cerrar");
      out.push(o);
    }
    return out;
  }

  // Evalúa RPN con una asignación de variables
  function evalRPN(rpn, env) {
    const st = [];
    rpn.forEach(tk => {
      if (tk.t === "var") st.push(env[tk.v]);
      else {
        if (tk.v === "~") {
          if (st.length < 1) throw new Error("Expresión incompleta");
          st.push(!st.pop());
          return;
        }
        if (st.length < 2) throw new Error("Expresión incompleta");
        const b = st.pop(), a = st.pop();
        switch (tk.v) {
          case "&": st.push(a && b); break;
          case "|": st.push(a || b); break;
          case "#": st.push(a !== b); break;        // xor
          case ">": st.push(!a || b); break;        // condicional
          case "=": st.push(a === b); break;        // bicondicional
        }
      }
    });
    if (st.length !== 1) throw new Error("Expresión mal formada");
    return st[0];
  }

  function getVars(tokens) {
    const set = [];
    tokens.forEach(t => { if (t.t === "var" && !set.includes(t.v)) set.push(t.v); });
    return set.sort();
  }

  // pretty: vuelve a símbolos lindos para mostrar el encabezado
  function pretty(src) {
    return src
      .replace(/<->|<=>/g, "↔").replace(/->|=>/g, "→")
      .replace(/~/g, "¬").replace(/&/g, "∧").replace(/\|/g, "∨")
      .replace(/\^/g, "⊻");
  }

  function build(container) {
    container.innerHTML = `
      <div class="tool">
        <div class="field">
          <label>Escribí una proposición</label>
          <input class="input input--mono" id="lg-expr" placeholder="ej: (p & q) > r" value="(p > q) = (~q > ~p)" autocomplete="off" />
        </div>
        <div class="op-keys" id="lg-keys">
          <button data-ins="~">¬</button>
          <button data-ins="&">∧</button>
          <button data-ins="|">∨</button>
          <button data-ins="^">⊻</button>
          <button data-ins=">">→</button>
          <button data-ins="=">↔</button>
          <button data-ins="(">(</button>
          <button data-ins=")">)</button>
          <button data-ins="p">p</button>
          <button data-ins="q">q</button>
          <button data-ins="r">r</button>
        </div>
        <div class="btn-row">
          <button class="btn btn--primary" id="lg-go">Generar tabla</button>
          <button class="btn" id="lg-clear">Limpiar</button>
        </div>
        <p class="muted" style="font-size:12.5px">
          Operadores: <code>~ ¬</code> negación · <code>&amp; ∧</code> y · <code>| ∨</code> o ·
          <code>^ ⊻</code> o exclusiva · <code>&gt; → -&gt;</code> condicional · <code>= ↔ &lt;-&gt;</code> bicondicional.
        </p>
        <div id="lg-out"></div>
      </div>`;

    const input = container.querySelector("#lg-expr");
    const out = container.querySelector("#lg-out");

    container.querySelector("#lg-keys").addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      const ins = b.dataset.ins;
      const s = input.selectionStart ?? input.value.length;
      const eN = input.selectionEnd ?? input.value.length;
      input.value = input.value.slice(0, s) + ins + input.value.slice(eN);
      input.focus();
      input.selectionStart = input.selectionEnd = s + ins.length;
    });

    function run() {
      const raw = input.value.trim();
      if (!raw) { out.innerHTML = `<div class="result-box empty">Escribí una proposición para ver su tabla.</div>`; return; }
      try {
        const norm = normalize(raw);
        const tokens = tokenize(norm);
        const vars = getVars(tokens);
        if (vars.length === 0) throw new Error("Falta al menos una variable (p, q, …)");
        if (vars.length > 5) throw new Error("Máximo 5 variables para mantener la tabla legible.");
        const rpn = toRPN(tokens);

        const rows = 1 << vars.length;
        let body = "", trues = 0;
        for (let i = 0; i < rows; i++) {
          const env = {};
          vars.forEach((v, k) => { env[v] = !((i >> (vars.length - 1 - k)) & 1); });
          const res = evalRPN(rpn, env);
          if (res) trues++;
          const cells = vars.map(v => `<td class="${env[v] ? "v-true" : "v-false"}">${env[v] ? "V" : "F"}</td>`).join("");
          body += `<tr>${cells}<td class="${res ? "v-true" : "v-false"}"><strong>${res ? "V" : "F"}</strong></td></tr>`;
        }
        const head = vars.map(v => `<th>${v}</th>`).join("") + `<th>${pretty(raw)}</th>`;

        let tipo, chip;
        if (trues === rows) { tipo = "Tautología"; chip = "tip"; }
        else if (trues === 0) { tipo = "Contradicción"; chip = "warn"; }
        else { tipo = "Contingencia"; chip = ""; }

        out.innerHTML = `
          <div class="callout ${chip}" style="margin-top:18px">
            <strong class="callout__tag">Clasificación</strong>
            <strong>${tipo}</strong> · ${trues} de ${rows} filas verdaderas.
          </div>
          <div class="tbl-wrap">
            <table class="tbl"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>
          </div>`;
        if (window.MathJaxRender) window.MathJaxRender(out);
      } catch (err) {
        out.innerHTML = `<div class="error-text">⚠️ ${err.message}</div>`;
      }
    }

    container.querySelector("#lg-go").addEventListener("click", run);
    container.querySelector("#lg-clear").addEventListener("click", () => { input.value = ""; input.focus(); run(); });
    input.addEventListener("keydown", e => { if (e.key === "Enter") run(); });
    run();
  }

  window.Tools = window.Tools || {};
  window.Tools.logica = build;
})();
