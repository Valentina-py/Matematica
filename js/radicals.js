/* ============================================================
   Herramienta: SUMA DE RADICALES (raíces cuadradas semejantes)
   Simplifica cada raíz extrayendo el mayor cuadrado perfecto,
   agrupa los radicales semejantes y suma los coeficientes.
   Ej: 3√20 − 5√45 + 2√80 − √125 = −6√5
   Soporta coeficientes enteros o fracciones a/b. Solo raíces cuadradas.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- fracciones ---------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; }
  function frac(n, d) { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return { n: n / g, d: d / g }; }
  function fadd(x, y) { return frac(x.n * y.d + y.n * x.d, x.d * y.d); }
  function fmulInt(x, k) { return frac(x.n * k, x.d); }
  function fToTex(x) { return x.d === 1 ? String(x.n) : `\\tfrac{${x.n}}{${x.d}}`; }
  function fAbs(x) { return { n: Math.abs(x.n), d: x.d }; }

  /* ---------- mayor cuadrado perfecto: √R = out·√in ---------- */
  function simplifySqrt(R) {
    if (R === 0) return { out: 0, in: 0 };
    let out = 1, inn = R;
    for (let k = 2; k * k <= inn; k++) { while (inn % (k * k) === 0) { inn /= k * k; out *= k; } }
    return { out: out, in: inn };
  }

  /* ---------- normalizar y parsear ---------- */
  function normalize(src) {
    return src.replace(/[−–—]/g, "-").replace(/ra[ií]z|sqrt/gi, "√").replace(/[·*]/g, "").replace(/\s+/g, "");
  }
  // Devuelve términos [{coef:frac, rad:int}] (rad=1 ⇒ término sin raíz)
  function parse(s) {
    const terms = [];
    let i = 0;
    while (i < s.length) {
      let sign = 1;
      if (s[i] === "+") { i++; }
      else if (s[i] === "-") { sign = -1; i++; }
      else if (terms.length > 0) throw new Error("Falta un signo + o − entre términos.");
      const numM = /^(\d+)(?:\/(\d+))?/.exec(s.slice(i));
      let coef = null;
      if (numM) {
        const n = parseInt(numM[1], 10), d = numM[2] ? parseInt(numM[2], 10) : 1;
        if (d === 0) throw new Error("Hay un denominador 0.");
        coef = frac(sign * n, d); i += numM[0].length;
      }
      if (s[i] === "√") {
        i++;
        const radM = /^(\d+)/.exec(s.slice(i));
        if (!radM) throw new Error("Después de √ tiene que ir el radicando (un número).");
        const rad = parseInt(radM[1], 10); i += radM[0].length;
        terms.push({ coef: coef || frac(sign, 1), rad: rad });
      } else if (coef !== null) {
        terms.push({ coef: coef, rad: 1 });
      } else {
        throw new Error("Símbolo inesperado: «" + (s[i] || "") + "».");
      }
    }
    return terms;
  }

  /* ---------- a LaTeX ---------- */
  function termTexSigned(coef, rad) {
    if (coef.n === 0) return "0";
    const neg = coef.n < 0, a = fAbs(coef);
    let body;
    if (rad === 1) body = fToTex(a);
    else { const c = (a.n === 1 && a.d === 1) ? "" : fToTex(a); body = c + "\\sqrt{" + rad + "}"; }
    return (neg ? "-" : "") + body;
  }
  function sumTex(terms) {
    const nz = terms.filter(t => t.coef.n !== 0);
    if (!nz.length) return "0";
    let s = "";
    nz.forEach((t, i) => {
      const neg = t.coef.n < 0, a = fAbs(t.coef);
      let body;
      if (t.rad === 1) body = fToTex(a);
      else { const c = (a.n === 1 && a.d === 1) ? "" : fToTex(a); body = c + "\\sqrt{" + t.rad + "}"; }
      s += i === 0 ? (neg ? "-" : "") + body : (neg ? " - " : " + ") + body;
    });
    return s;
  }
  function numbersSumTex(coefs) {
    let s = "";
    coefs.forEach((c, i) => {
      const neg = c.n < 0, a = fToTex(fAbs(c));
      s += i === 0 ? (neg ? "-" : "") + a : (neg ? " - " : " + ") + a;
    });
    return s;
  }

  /* ---------- UI ---------- */
  const EXAMPLES = ["3√20-5√45+2√80-√125", "√18+√50+√2-√8", "√12+√27", "2√3+5√3", "√48-√3", "√8+√18-√2"];

  function build(container) {
    container.innerHTML = `
      <div class="tool">
        <div class="field">
          <label>Escribí la suma de radicales</label>
          <input class="input input--mono" id="rad-expr" value="3√20-5√45+2√80-√125" placeholder="ej: 3√20-5√45+2√80-√125" autocomplete="off" />
        </div>
        <div class="op-keys" id="rad-keys">
          <button data-ins="√" title="Raíz cuadrada">√</button>
          <button data-ins="+">+</button>
          <button data-ins="-">−</button>
          <button data-ins="/" title="Fracción">/</button>
        </div>
        <p class="muted" style="font-size:12.5px">
          Usá <code>√</code> (o escribí <code>raiz</code> / <code>sqrt</code>) y uní términos con <code>+</code> y <code>−</code>.
          Coeficientes enteros o fracciones <code>a/b</code>. Solo raíces cuadradas.
        </p>
        <div class="venn-chips" id="rad-ex">${EXAMPLES.map(e => `<button data-ex="${e}">${e}</button>`).join("")}</div>
        <div id="rad-out"></div>
      </div>`;

    const input = container.querySelector("#rad-expr");
    const out = container.querySelector("#rad-out");

    container.querySelector("#rad-keys").addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      const ins = b.dataset.ins;
      const s = input.selectionStart ?? input.value.length, eN = input.selectionEnd ?? input.value.length;
      input.value = input.value.slice(0, s) + ins + input.value.slice(eN);
      input.focus(); input.selectionStart = input.selectionEnd = s + ins.length;
      run();
    });
    container.querySelector("#rad-ex").addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      input.value = b.dataset.ex; input.focus(); run();
    });

    function run() {
      const raw = input.value.trim();
      if (!raw) { out.innerHTML = `<div class="result-box empty">Escribí una expresión para ver el resultado.</div>`; return; }
      try {
        const terms = parse(normalize(raw));
        if (!terms.length) throw new Error("Escribí una expresión.");
        const originalTex = sumTex(terms);

        // Paso 1: simplificar cada raíz
        const step1 = [];
        terms.forEach(t => {
          if (t.rad > 1) {
            const sp = simplifySqrt(t.rad);
            if (sp.out > 1) {
              const nc = fmulInt(t.coef, sp.out), nr = sp.in <= 1 ? 1 : sp.in;
              const why = sp.in === 1 ? `\\sqrt{${t.rad}}=${sp.out}` : `\\sqrt{${t.rad}}=${sp.out}\\sqrt{${sp.in}}`;
              step1.push(`${termTexSigned(t.coef, t.rad)} = ${termTexSigned(nc, nr)}\\quad\\small(${why})`);
            }
          }
        });

        // Términos simplificados + agrupar por radicando
        const simp = terms.map(t => {
          if (t.rad === 1) return { coef: t.coef, rad: 1 };
          const sp = simplifySqrt(t.rad);
          return { coef: fmulInt(t.coef, sp.out), rad: sp.in <= 1 ? 1 : sp.in };
        });
        const groups = {};
        simp.forEach(t => { (groups[t.rad] = groups[t.rad] || []).push(t.coef); });

        const rads = Object.keys(groups).map(Number);
        const order = rads.filter(r => r !== 1).sort((a, b) => a - b).concat(rads.includes(1) ? [1] : []);

        const step2 = [];
        const resultTerms = [];
        order.forEach(rad => {
          const coefs = groups[rad];
          const total = coefs.reduce((acc, c) => fadd(acc, c), frac(0, 1));
          resultTerms.push({ coef: total, rad: rad });
          if (coefs.length > 1) {
            const radPart = rad === 1 ? "" : `\\sqrt{${rad}}`;
            step2.push(`(${numbersSumTex(coefs)})${radPart} = ${termTexSigned(total, rad)}`);
          }
        });
        const finalTex = sumTex(resultTerms);

        let html = `
          <div class="result-box" style="margin-top:18px">
            <div style="font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Expresión</div>
            <div>$$ ${originalTex} $$</div>
          </div>`;
        if (step1.length) {
          html += `<div class="callout"><strong class="callout__tag">Paso 1 · Simplificar cada raíz</strong>
            ${step1.map(l => `<div>$$ ${l} $$</div>`).join("")}</div>`;
        }
        if (step2.length) {
          html += `<div class="callout"><strong class="callout__tag">Paso 2 · Agrupar radicales semejantes</strong>
            ${step2.map(l => `<div>$$ ${l} $$</div>`).join("")}</div>`;
        }
        html += `
          <div class="result-box" style="border-style:solid">
            <div style="font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Resultado</div>
            <div style="font-size:24px;font-weight:700">$$ ${finalTex} $$</div>
          </div>`;
        out.innerHTML = html;
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
  window.Tools.radicales = build;
})();
