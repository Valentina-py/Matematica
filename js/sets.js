/* ============================================================
   Laboratorio de CONJUNTOS
   - Evaluador de EXPRESIONES simbólicas con A, B, C y U
     (∪ unión, ∩ intersección, − diferencia, △ dif. simétrica, ' complemento)
   - Diagrama de Venn de 3 conjuntos que resalta las regiones del resultado
   - Cálculo con elementos reales escritos por el usuario
   ============================================================ */
(function () {
  "use strict";

  /* ---------- utilidades de conjuntos ---------- */
  function parseSet(str) { return [...new Set(str.split(/[,\s]+/).map(s => s.trim()).filter(Boolean))]; }
  function fmt(arr) { return arr.length ? "{ " + arr.join(", ") + " }" : "∅"; }

  /* ---------- parser de expresiones ---------- */
  // Normaliza a símbolos canónicos: ∪ ∩ - Δ ' ( )  y operandos A B C U
  function normalize(src) {
    return src
      .replace(/ᶜ|’/g, "'")
      .replace(/c/g, "'")     // "c" minúscula = complemento (los conjuntos van en mayúscula)
      .replace(/[∪+]/g, "∪")
      .replace(/[∩&*.]/g, "∩")
      .replace(/[△∆]/g, "Δ")
      .replace(/[\\]/g, "-")
      .replace(/[−–—]/g, "-")
      .replace(/[\^]/g, "Δ")
      .replace(/\s+/g, "");
  }
  function tokenize(s) {
    const t = [];
    for (const ch of s) {
      if ("ABCU".includes(ch)) t.push({ t: "set", v: ch });
      else if ("∪∩-Δ".includes(ch)) t.push({ t: "op", v: ch });
      else if (ch === "'") t.push({ t: "post" });
      else if (ch === "(" || ch === ")") t.push({ t: ch });
      else if (/[a-z]/.test(ch)) throw new Error("Usá conjuntos en mayúscula: A, B, C, U.");
      else throw new Error("Símbolo no reconocido: «" + ch + "»");
    }
    return t;
  }
  const PREC = { "∩": 3, "∪": 2, "-": 2, "Δ": 2 };
  function toRPN(tokens) {
    const out = [], ops = [];
    tokens.forEach(tk => {
      if (tk.t === "set") out.push(tk);
      else if (tk.t === "post") out.push(tk);              // complemento (postfijo) → directo a salida
      else if (tk.t === "op") {
        while (ops.length) {
          const top = ops[ops.length - 1];
          if (top.t === "op" && PREC[top.v] >= PREC[tk.v]) out.push(ops.pop());
          else break;
        }
        ops.push(tk);
      } else if (tk.t === "(") ops.push(tk);
      else if (tk.t === ")") {
        while (ops.length && ops[ops.length - 1].t !== "(") out.push(ops.pop());
        if (!ops.length) throw new Error("Paréntesis sin abrir.");
        ops.pop();
      }
    });
    while (ops.length) { const o = ops.pop(); if (o.t === "(") throw new Error("Paréntesis sin cerrar."); out.push(o); }
    return out;
  }
  // Evalúa el RPN de forma genérica. ops define el comportamiento de cada operador.
  function evalRPN(rpn, val, ops) {
    const st = [];
    rpn.forEach(tk => {
      if (tk.t === "set") st.push(val(tk.v));
      else if (tk.t === "post") { if (!st.length) throw new Error("Expresión incompleta."); st.push(ops.comp(st.pop())); }
      else { if (st.length < 2) throw new Error("Expresión incompleta."); const b = st.pop(), a = st.pop(); st.push(ops[tk.v](a, b)); }
    });
    if (st.length !== 1) throw new Error("Expresión mal formada.");
    return st[0];
  }
  function usedSets(tokens) { const s = new Set(); tokens.forEach(t => { if (t.t === "set") s.add(t.v); }); return s; }

  /* ---------- Diagrama de Venn de 3 conjuntos ---------- */
  // regiones: onlyA onlyB onlyC AB AC BC ABC none
  const REGIONS = {
    onlyA: { A: 1, B: 0, C: 0 }, onlyB: { A: 0, B: 1, C: 0 }, onlyC: { A: 0, B: 0, C: 1 },
    AB: { A: 1, B: 1, C: 0 }, AC: { A: 1, B: 0, C: 1 }, BC: { A: 0, B: 1, C: 1 },
    ABC: { A: 1, B: 1, C: 1 }, none: { A: 0, B: 0, C: 0 },
  };
  const CIR = { A: [118, 104], B: [202, 104], C: [160, 172] }, R = 72;
  const circle = (k, fill) => `<circle cx="${CIR[k][0]}" cy="${CIR[k][1]}" r="${R}" fill="${fill}"/>`;
  function mask(id, excl) {
    return `<mask id="${id}"><rect x="0" y="0" width="340" height="270" fill="white"/>${excl.map(k => circle(k, "black")).join("")}</mask>`;
  }
  function venn3(shaded, useC) {
    const f = "var(--accent)";
    const shape = {
      onlyA: `<circle cx="118" cy="104" r="72" fill="${f}" mask="url(#mBC)"/>`,
      onlyB: `<circle cx="202" cy="104" r="72" fill="${f}" mask="url(#mAC)"/>`,
      onlyC: `<circle cx="160" cy="172" r="72" fill="${f}" mask="url(#mAB)"/>`,
      AB: `<g clip-path="url(#cA)"><circle cx="202" cy="104" r="72" fill="${f}" mask="url(#mC)"/></g>`,
      AC: `<g clip-path="url(#cA)"><circle cx="160" cy="172" r="72" fill="${f}" mask="url(#mB)"/></g>`,
      BC: `<g clip-path="url(#cB)"><circle cx="160" cy="172" r="72" fill="${f}" mask="url(#mA)"/></g>`,
      ABC: `<g clip-path="url(#cA)"><g clip-path="url(#cB)">${circle("C", f)}</g></g>`,
      none: `<rect x="6" y="6" width="328" height="258" fill="${f}" mask="url(#mABC)"/>`,
    };
    const fills = [...shaded].map(k => shape[k]).join("");
    const cLine = useC ? `<circle cx="160" cy="172" r="72" fill="none" stroke="var(--text)" stroke-width="2"/><text x="160" y="252" font-size="16" font-weight="700" fill="var(--text)" text-anchor="middle">C</text>` : "";
    return `
    <svg viewBox="0 0 340 270" class="venn-svg" style="max-width:420px;width:100%">
      <defs>
        <clipPath id="cA"><circle cx="118" cy="104" r="72"/></clipPath>
        <clipPath id="cB"><circle cx="202" cy="104" r="72"/></clipPath>
        ${mask("mBC", ["B", "C"])}${mask("mAC", ["A", "C"])}${mask("mAB", ["A", "B"])}
        ${mask("mA", ["A"])}${mask("mB", ["B"])}${mask("mC", ["C"])}
        ${mask("mABC", ["A", "B", "C"])}
      </defs>
      <rect x="6" y="6" width="328" height="258" rx="12" fill="var(--surface-2)" stroke="var(--border)"/>
      <text x="20" y="26" font-size="13" fill="var(--muted)" font-weight="700">U</text>
      <g style="fill-opacity:.55">${fills}</g>
      <circle cx="118" cy="104" r="72" fill="none" stroke="var(--text)" stroke-width="2"/>
      <circle cx="202" cy="104" r="72" fill="none" stroke="var(--text)" stroke-width="2"/>
      ${cLine}
      <text x="74" y="96" font-size="16" font-weight="700" fill="var(--text)">A</text>
      <text x="240" y="96" font-size="16" font-weight="700" fill="var(--text)">B</text>
    </svg>`;
  }

  /* ---------- ejemplos rápidos ---------- */
  const EXAMPLES = ["A∪B", "A∩B", "A−B", "A△B", "A'", "A∩(B∪C)", "(A∪B)−C", "(A∩B)∪C", "(A∪B)'"];

  function build(container) {
    container.innerHTML = `
      <div class="tool">
        <div class="field">
          <label>Escribí la expresión de conjuntos</label>
          <input class="input input--mono" id="sx-expr" placeholder="ej: A∩(B∪C)" value="A∩(B∪C)" autocomplete="off" />
        </div>
        <div class="op-keys" id="sx-keys">
          <button data-ins="∪" title="Unión">∪</button>
          <button data-ins="∩" title="Intersección">∩</button>
          <button data-ins="−" title="Diferencia">−</button>
          <button data-ins="△" title="Diferencia simétrica">△</button>
          <button data-ins="'" title="Complemento">′</button>
          <button data-ins="(">(</button>
          <button data-ins=")">)</button>
          <button data-ins="A">A</button>
          <button data-ins="B">B</button>
          <button data-ins="C">C</button>
          <button data-ins="U">U</button>
        </div>
        <p class="muted" style="font-size:12.5px">
          <code>∪</code> unión · <code>∩</code> intersección · <code>−</code> diferencia ·
          <code>△</code> dif. simétrica · <code>′</code> complemento (también <code>A'</code> o <code>Ac</code>).
          También se aceptan <code>+ &amp; - ^</code>.
        </p>
        <div class="venn-chips" id="sx-ex">${EXAMPLES.map(e => `<button data-ex="${e}">${e}</button>`).join("")}</div>

        <hr style="border:none;border-top:1px solid var(--border);margin:20px 0">
        <p class="muted" style="font-size:13px">Cargá los elementos (separados por coma o espacio) para ver el resultado por extensión:</p>
        <div class="venn-set-input">
          <div class="field"><label>Conjunto A</label><input class="input" id="sx-A" value="1, 2, 3, 4"></div>
          <div class="field"><label>Conjunto B</label><input class="input" id="sx-B" value="3, 4, 5, 6"></div>
          <div class="field"><label>Conjunto C</label><input class="input" id="sx-C" value="4, 6, 7, 8"></div>
          <div class="field"><label>Universal U</label><input class="input" id="sx-U" value="1,2,3,4,5,6,7,8,9,10"></div>
        </div>
        <div id="sx-out"></div>
      </div>`;

    const $ = id => container.querySelector(id);
    const input = $("#sx-expr"), out = $("#sx-out");

    $("#sx-keys").addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      const ins = b.dataset.ins;
      const s = input.selectionStart ?? input.value.length, eN = input.selectionEnd ?? input.value.length;
      input.value = input.value.slice(0, s) + ins + input.value.slice(eN);
      input.focus(); input.selectionStart = input.selectionEnd = s + ins.length;
      run();
    });
    $("#sx-ex").addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      input.value = b.dataset.ex; input.focus(); run();
    });

    function prettyExpr(s) {
      return normalize(s).replace(/'/g, "ᶜ");
    }

    function run() {
      const raw = input.value.trim();
      if (!raw) { out.innerHTML = `<div class="result-box empty">Escribí una expresión para ver el diagrama.</div>`; return; }
      try {
        const norm = normalize(raw);
        const tokens = tokenize(norm);
        const used = usedSets(tokens);
        const rpn = toRPN(tokens);

        // 1) Regiones del Venn: evaluar la pertenencia lógica en cada región
        const boolOps = { "∪": (a, b) => a || b, "∩": (a, b) => a && b, "-": (a, b) => a && !b, "Δ": (a, b) => a !== b, comp: a => !a };
        const shaded = new Set();
        for (const key in REGIONS) {
          const reg = REGIONS[key];
          const belongs = evalRPN(rpn, v => v === "U" ? true : !!reg[v], boolOps);
          if (belongs) shaded.add(key);
        }
        const showC = used.has("C");

        // 2) Resultado por extensión usando los elementos cargados
        const A = parseSet($("#sx-A").value), B = parseSet($("#sx-B").value),
              C = parseSet($("#sx-C").value), Uin = parseSet($("#sx-U").value);
        const universe = [...new Set([...Uin, ...A, ...B, ...C])];
        const setOps = {
          "∪": (a, b) => a.filter(x => true).concat(b).filter((x, i, arr) => arr.indexOf(x) === i),
          "∩": (a, b) => a.filter(x => b.includes(x)),
          "-": (a, b) => a.filter(x => !b.includes(x)),
          "Δ": (a, b) => a.filter(x => !b.includes(x)).concat(b.filter(x => !a.includes(x))),
          comp: a => universe.filter(x => !a.includes(x)),
        };
        const setVal = v => v === "U" ? universe.slice() : v === "A" ? A.slice() : v === "B" ? B.slice() : v === "C" ? C.slice() : [];
        const resultSet = evalRPN(rpn, setVal, setOps);
        // ordenar (numérico si se puede)
        const ord = resultSet.slice().sort((x, y) => {
          const nx = parseFloat(x), ny = parseFloat(y);
          if (!isNaN(nx) && !isNaN(ny)) return nx - ny;
          return String(x).localeCompare(String(y));
        });

        out.innerHTML = `
          <div class="venn-wrap" style="margin-top:18px">${venn3(shaded, showC)}</div>
          <div class="result-box">
            <div style="font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">${prettyExpr(raw)}</div>
            <div style="font-size:20px;font-weight:700;font-family:ui-monospace,monospace">${fmt(ord)}</div>
          </div>`;
      } catch (err) {
        out.innerHTML = `<div class="error-text">⚠️ ${err.message}</div>`;
      }
    }

    container.querySelectorAll("#sx-A,#sx-B,#sx-C,#sx-U").forEach(el => el.addEventListener("input", run));
    input.addEventListener("input", run);
    input.addEventListener("keydown", e => { if (e.key === "Enter") run(); });
    run();
  }

  window.Tools = window.Tools || {};
  window.Tools.conjuntos = build;
})();
