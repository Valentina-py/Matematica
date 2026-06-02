/* ============================================================
   Herramientas numéricas:
   1) Calculadora de NÚMEROS COMPLEJOS
   2) Resolutor de VALOR ABSOLUTO (ecuaciones e inecuaciones)
   ============================================================ */
(function () {
  "use strict";

  /* ---------- utilidades de formato ---------- */
  function nice(n) {
    if (!isFinite(n)) return "∞";
    const r = Math.round(n * 1e6) / 1e6;
    return Object.is(r, -0) ? "0" : String(r);
  }
  function fmtComplex(a, b) {
    a = Math.round(a * 1e6) / 1e6; b = Math.round(b * 1e6) / 1e6;
    if (b === 0) return nice(a);
    if (a === 0) return (b === 1 ? "i" : b === -1 ? "-i" : nice(b) + "i");
    const bi = (b === 1 ? "i" : b === -1 ? "-i" : nice(Math.abs(b)) + "i");
    return nice(a) + (b > 0 ? " + " : " - ") + (Math.abs(b) === 1 ? "i" : nice(Math.abs(b)) + "i");
  }

  /* ============================================================
     1) CALCULADORA DE COMPLEJOS
     ============================================================ */
  function buildComplex(container) {
    container.innerHTML = `
      <div class="tool">
        <p class="muted mt-0" style="font-size:13px">Definí \\(z = a + bi\\) y \\(w = c + di\\), elegí una operación y obtené el resultado paso a paso.</p>
        <div class="field-row">
          <div class="field"><label>z — parte real (a)</label><input class="input" id="cx-a" type="number" value="3"></div>
          <div class="field"><label>z — parte imaginaria (b)</label><input class="input" id="cx-b" type="number" value="4"></div>
        </div>
        <div class="field-row">
          <div class="field"><label>w — parte real (c)</label><input class="input" id="cx-c" type="number" value="1"></div>
          <div class="field"><label>w — parte imaginaria (d)</label><input class="input" id="cx-d" type="number" value="-2"></div>
        </div>
        <div class="field">
          <label>Operación</label>
          <select class="input" id="cx-op">
            <option value="add">z + w  (suma)</option>
            <option value="sub">z − w  (resta)</option>
            <option value="mul">z · w  (producto)</option>
            <option value="div">z / w  (cociente)</option>
            <option value="modz">|z|  (módulo de z)</option>
            <option value="conjz">z̄  (conjugado de z)</option>
            <option value="ipow">iⁿ  (potencia de i)</option>
          </select>
        </div>
        <div class="field hidden" id="cx-nwrap">
          <label>Exponente n (entero ≥ 0)</label>
          <input class="input" id="cx-n" type="number" value="23" min="0">
        </div>
        <div id="cx-out"></div>
      </div>`;

    const $ = id => container.querySelector(id);
    const out = $("#cx-out");
    const opSel = $("#cx-op");
    const nWrap = $("#cx-nwrap");

    function vals() {
      return {
        a: parseFloat($("#cx-a").value) || 0, b: parseFloat($("#cx-b").value) || 0,
        c: parseFloat($("#cx-c").value) || 0, d: parseFloat($("#cx-d").value) || 0,
        n: parseInt($("#cx-n").value, 10) || 0
      };
    }

    function run() {
      const { a, b, c, d, n } = vals();
      const op = opSel.value;
      nWrap.classList.toggle("hidden", op !== "ipow");
      let res = "", steps = "";

      switch (op) {
        case "add":
          res = fmtComplex(a + c, b + d);
          steps = `\\((${fmtComplex(a,b)}) + (${fmtComplex(c,d)}) = (${nice(a)}+${nice(c)}) + (${nice(b)}+${nice(d)})i\\)`;
          break;
        case "sub":
          res = fmtComplex(a - c, b - d);
          steps = `\\((${fmtComplex(a,b)}) - (${fmtComplex(c,d)}) = (${nice(a)}-${nice(c)}) + (${nice(b)}-${nice(d)})i\\)`;
          break;
        case "mul": {
          const re = a * c - b * d, im = a * d + b * c;
          res = fmtComplex(re, im);
          steps = `\\((ac-bd) + (ad+bc)i = (${nice(a*c)}-${nice(b*d)}) + (${nice(a*d)}+${nice(b*c)})i\\)`;
          break;
        }
        case "div": {
          const den = c * c + d * d;
          if (den === 0) { out.innerHTML = `<div class="error-text">⚠️ No se puede dividir: w = 0.</div>`; return; }
          const re = (a * c + b * d) / den, im = (b * c - a * d) / den;
          res = fmtComplex(re, im);
          steps = `\\(\\dfrac{z\\cdot\\overline{w}}{|w|^2} = \\dfrac{(${nice(a*c+b*d)}) + (${nice(b*c-a*d)})i}{${nice(den)}}\\)`;
          break;
        }
        case "modz": {
          const m = Math.sqrt(a * a + b * b);
          res = nice(m);
          steps = `\\(|z| = \\sqrt{a^2+b^2} = \\sqrt{${nice(a*a)}+${nice(b*b)}} = \\sqrt{${nice(a*a+b*b)}}\\)`;
          break;
        }
        case "conjz":
          res = fmtComplex(a, -b);
          steps = `\\(\\overline{z} = a - bi\\)`;
          break;
        case "ipow": {
          if (n < 0) { out.innerHTML = `<div class="error-text">⚠️ Usá un exponente entero ≥ 0.</div>`; return; }
          const r = n % 4;
          const map = ["1", "i", "-1", "-i"];
          res = map[r];
          steps = `\\(i^{${n}}:\\ ${n} = 4\\cdot${Math.floor(n/4)} + ${r} \\Rightarrow i^{${n}} = i^{${r}} = ${map[r]}\\)`;
          break;
        }
      }

      out.innerHTML = `
        <div class="result-box">
          <div style="font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Resultado</div>
          <div style="font-size:22px;font-weight:700">\\(${res.replace(/-/g,"-")}\\)</div>
          <div style="margin-top:10px;font-size:13.5px;color:var(--muted)">${steps}</div>
        </div>`;
      if (window.MathJaxRender) window.MathJaxRender(out);
    }

    container.querySelectorAll("input,select").forEach(el => el.addEventListener("input", run));
    run();
  }

  /* ============================================================
     2) RESOLUTOR DE VALOR ABSOLUTO
     |x - a|  OP  c
     ============================================================ */
  function buildReales(container) {
    container.innerHTML = `
      <div class="tool">
        <p class="muted mt-0" style="font-size:13px">Resolvé \\(|x - a|\\ \\square\\ c\\). Poné \\(a=0\\) para trabajar con \\(|x|\\).</p>
        <div class="venn-set-input">
          <div class="field" style="flex:1"><label>Centro a (en |x − a|)</label><input class="input" id="va-a" type="number" value="3"></div>
          <div class="field" style="flex:1">
            <label>Relación</label>
            <select class="input" id="va-op">
              <option value="eq">|x − a| = c</option>
              <option value="lt" selected>|x − a| &lt; c</option>
              <option value="le">|x − a| ≤ c</option>
              <option value="gt">|x − a| &gt; c</option>
              <option value="ge">|x − a| ≥ c</option>
            </select>
          </div>
          <div class="field" style="flex:1"><label>Valor c</label><input class="input" id="va-c" type="number" value="2"></div>
        </div>
        <div id="va-out"></div>
      </div>`;

    const $ = id => container.querySelector(id);
    const out = $("#va-out");

    function solve() {
      const a = parseFloat($("#va-a").value) || 0;
      const c = parseFloat($("#va-c").value);
      const op = $("#va-op").value;
      if (isNaN(c)) { out.innerHTML = `<div class="result-box empty">Completá el valor de c.</div>`; return; }

      const lo = a - c, hi = a + c;
      let sol = "", note = "", lineType = "none";

      if (op === "eq") {
        if (c < 0) { sol = "\\(\\varnothing\\)  (sin solución)"; note = "El módulo nunca es negativo."; }
        else if (c === 0) { sol = `\\(x = ${nice(a)}\\)`; lineType = "point0"; }
        else { sol = `\\(x = ${nice(lo)} \\;\\vee\\; x = ${nice(hi)}\\)`; lineType = "two"; }
      } else if (op === "lt") {
        if (c <= 0) { sol = "\\(\\varnothing\\)  (sin solución)"; note = c < 0 ? "El módulo nunca es negativo." : "El módulo no puede ser estrictamente menor que 0."; }
        else { sol = `\\(${nice(lo)} < x < ${nice(hi)}\\quad\\Rightarrow\\quad x \\in (${nice(lo)},\\,${nice(hi)})\\)`; lineType = "open"; }
      } else if (op === "le") {
        if (c < 0) { sol = "\\(\\varnothing\\)  (sin solución)"; note = "El módulo nunca es negativo."; }
        else if (c === 0) { sol = `\\(x = ${nice(a)}\\)`; lineType = "point0"; }
        else { sol = `\\(${nice(lo)} \\le x \\le ${nice(hi)}\\quad\\Rightarrow\\quad x \\in [${nice(lo)},\\,${nice(hi)}]\\)`; lineType = "closed"; }
      } else if (op === "gt") {
        if (c < 0) { sol = "\\(x \\in \\mathbb{R}\\)  (todos los reales)"; note = "El módulo siempre es mayor que un negativo."; lineType = "all"; }
        else if (c === 0) { sol = `\\(x \\neq ${nice(a)}\\quad\\Rightarrow\\quad x \\in \\mathbb{R} - \\{${nice(a)}\\}\\)`; lineType = "allbut"; }
        else { sol = `\\(x < ${nice(lo)} \\;\\vee\\; x > ${nice(hi)}\\quad\\Rightarrow\\quad x \\in (-\\infty,\\,${nice(lo)}) \\cup (${nice(hi)},\\,+\\infty)\\)`; lineType = "outopen"; }
      } else if (op === "ge") {
        if (c <= 0) { sol = "\\(x \\in \\mathbb{R}\\)  (todos los reales)"; note = "El módulo siempre es ≥ 0."; lineType = "all"; }
        else { sol = `\\(x \\le ${nice(lo)} \\;\\vee\\; x \\ge ${nice(hi)}\\quad\\Rightarrow\\quad x \\in (-\\infty,\\,${nice(lo)}] \\cup [${nice(hi)},\\,+\\infty)\\)`; lineType = "outclosed"; }
      }

      out.innerHTML = `
        <div class="result-box">
          <div style="font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Conjunto solución</div>
          <div style="font-size:17px;font-weight:600">${sol}</div>
          ${note ? `<div style="margin-top:8px;font-size:13px;color:var(--muted)">${note}</div>` : ""}
        </div>
        ${numberLine(lo, hi, a, lineType)}`;
      if (window.MathJaxRender) window.MathJaxRender(out);
    }

    // Recta numérica SVG simple
    function numberLine(lo, hi, a, type) {
      if (type === "none") return "";
      const W = 420, H = 70, padX = 30, midY = 38;
      const min = Math.min(lo, hi, a) - 2, max = Math.max(lo, hi, a) + 2;
      const span = max - min || 1;
      const X = v => padX + (v - min) / span * (W - 2 * padX);
      const accent = "var(--accent)";
      let seg = "", pts = "";
      const lineBase = `<line x1="${padX}" y1="${midY}" x2="${W-padX}" y2="${midY}" stroke="var(--border)" stroke-width="2"/>`;
      const dot = (x, filled) => `<circle cx="${x}" cy="${midY}" r="6" fill="${filled ? accent : "var(--surface)"}" stroke="${accent}" stroke-width="2.5"/>`;
      const band = (x1, x2) => `<line x1="${x1}" y1="${midY}" x2="${x2}" y2="${midY}" stroke="${accent}" stroke-width="5"/>`;
      const lbl = (x, t) => `<text x="${x}" y="${midY+22}" text-anchor="middle" font-size="12" fill="var(--muted)">${t}</text>`;

      if (type === "two") { pts = dot(X(lo), true) + dot(X(hi), true) + lbl(X(lo), nice(lo)) + lbl(X(hi), nice(hi)); }
      else if (type === "point0") { pts = dot(X(a), true) + lbl(X(a), nice(a)); }
      else if (type === "open" || type === "closed") {
        seg = band(X(lo), X(hi));
        pts = dot(X(lo), type === "closed") + dot(X(hi), type === "closed") + lbl(X(lo), nice(lo)) + lbl(X(hi), nice(hi));
      } else if (type === "outopen" || type === "outclosed") {
        seg = band(padX, X(lo)) + band(X(hi), W - padX);
        pts = dot(X(lo), type === "outclosed") + dot(X(hi), type === "outclosed") + lbl(X(lo), nice(lo)) + lbl(X(hi), nice(hi));
      } else if (type === "all") { seg = band(padX, W - padX); }
      else if (type === "allbut") { seg = band(padX, W - padX); pts = `<circle cx="${X(a)}" cy="${midY}" r="6" fill="var(--surface)" stroke="${accent}" stroke-width="2.5"/>` + lbl(X(a), nice(a)); }

      return `<div class="tbl-wrap" style="text-align:center"><svg viewBox="0 0 ${W} ${H}" class="venn-svg" style="max-width:460px">${lineBase}${seg}${pts}</svg></div>`;
    }

    container.querySelectorAll("input,select").forEach(el => el.addEventListener("input", solve));
    solve();
  }

  window.Tools = window.Tools || {};
  window.Tools.complejos = buildComplex;
  window.Tools.reales = buildReales;
})();
