/* ============================================================
   CONTENIDO DE ESTUDIO
   Basado en los apuntes de "Introducción a la Matemática" (UNSa - Sede Orán)
   Unidades: Lógica · Conjuntos · Números Reales / Valor Absoluto · Complejos
   ============================================================ */
window.APP_DATA = {
  units: [

  /* ===================================================================
     UNIDAD 1 — NOCIONES DE LÓGICA
     =================================================================== */
  {
    id: "logica",
    glyph: "∴",
    icon: "logic",
    title: "Nociones de Lógica",
    desc: "Proposiciones, conectivos, tablas de verdad, leyes y cuantificadores.",
    tool: "logica",
    html: `
      <p class="lead">La <strong>lógica proposicional</strong> estudia las proposiciones y las formas válidas de razonar con ellas. Es la base del lenguaje matemático.</p>

      <div class="callout def">
        <strong class="callout__tag">Definición</strong>
        Una <strong>proposición</strong> es toda oración declarativa de la que se puede afirmar que es <em>verdadera (V)</em> o <em>falsa (F)</em>, pero no ambas a la vez.
      </div>
      <p>Las proposiciones simples se simbolizan con letras: \\(p,\\ q,\\ r,\\dots\\) Al combinarlas con <strong>conectivos lógicos</strong> se obtienen proposiciones compuestas.</p>

      <h2>Conectivos lógicos y tablas de verdad</h2>
      <p>Cada conectivo se define por su <strong>tabla de verdad</strong>, que indica el valor de la proposición compuesta según los valores de las simples.</p>

      <h3>Negación &nbsp;\\(\\sim p\\)</h3>
      <p>Invierte el valor de verdad. Se lee «no \\(p\\)», «no es cierto que \\(p\\)».</p>

      <h3>Conjunción &nbsp;\\(p \\wedge q\\)</h3>
      <p>«\\(p\\) <strong>y</strong> \\(q\\)». Es verdadera <strong>solo</strong> cuando ambas lo son. Equivalentes lingüísticos: <em>pero, sin embargo, además, también, mas</em>.</p>

      <h3>Disyunción inclusiva &nbsp;\\(p \\vee q\\)</h3>
      <p>«\\(p\\) <strong>o</strong> \\(q\\)». Es falsa solo cuando ambas son falsas (basta una verdadera).</p>

      <h3>Disyunción exclusiva &nbsp;\\(p \\veebar q\\)</h3>
      <p>«o bien \\(p\\), o bien \\(q\\)». Verdadera cuando los valores son <strong>distintos</strong>.</p>

      <h3>Condicional &nbsp;\\(p \\rightarrow q\\)</h3>
      <p>«si \\(p\\) entonces \\(q\\)». \\(p\\) es el <em>antecedente</em> y \\(q\\) el <em>consecuente</em>. Es falsa <strong>únicamente</strong> cuando el antecedente es V y el consecuente F.</p>

      <h3>Bicondicional &nbsp;\\(p \\leftrightarrow q\\)</h3>
      <p>«\\(p\\) <strong>si y solo si</strong> \\(q\\)». Verdadera cuando ambas tienen el <strong>mismo</strong> valor.</p>

      <div class="tbl-wrap">
      <table class="tbl">
        <thead><tr>
          <th>\\(p\\)</th><th>\\(q\\)</th>
          <th>\\(\\sim p\\)</th><th>\\(p\\wedge q\\)</th><th>\\(p\\vee q\\)</th>
          <th>\\(p\\veebar q\\)</th><th>\\(p\\rightarrow q\\)</th><th>\\(p\\leftrightarrow q\\)</th>
        </tr></thead>
        <tbody>
          <tr><td>V</td><td>V</td><td class="v-false">F</td><td class="v-true">V</td><td class="v-true">V</td><td class="v-false">F</td><td class="v-true">V</td><td class="v-true">V</td></tr>
          <tr><td>V</td><td>F</td><td class="v-false">F</td><td class="v-false">F</td><td class="v-true">V</td><td class="v-true">V</td><td class="v-false">F</td><td class="v-false">F</td></tr>
          <tr><td>F</td><td>V</td><td class="v-true">V</td><td class="v-false">F</td><td class="v-true">V</td><td class="v-true">V</td><td class="v-true">V</td><td class="v-false">F</td></tr>
          <tr><td>F</td><td>F</td><td class="v-true">V</td><td class="v-false">F</td><td class="v-false">F</td><td class="v-false">F</td><td class="v-true">V</td><td class="v-true">V</td></tr>
        </tbody>
      </table>
      </div>
      <div class="callout tip">
        <strong class="callout__tag">Truco</strong>
        ¿Querés practicar con cualquier fórmula? Usá la <a href="#/tool/logica">Generadora de tablas de verdad</a> al final de esta unidad.
      </div>

      <h2>Formas lingüísticas del condicional</h2>
      <p>Todas estas expresiones representan \\(p \\rightarrow q\\):</p>
      <ul>
        <li>Si \\(p\\), entonces \\(q\\) — \\(p\\) implica \\(q\\)</li>
        <li>\\(p\\) solo si \\(q\\) — \\(q\\) si \\(p\\) — \\(q\\) siempre que \\(p\\)</li>
        <li>\\(p\\) es <strong>suficiente</strong> para \\(q\\) — \\(q\\) es <strong>necesario</strong> para \\(p\\)</li>
        <li>Puesto que \\(p\\), \\(q\\) — \\(p\\), por lo tanto \\(q\\) — \\(p\\), en consecuencia \\(q\\)</li>
      </ul>

      <h2>Negaciones de proposiciones compuestas</h2>
      <div class="formula-box">
        $$ \\sim(p \\vee q) \\equiv \\sim p \\,\\wedge\\, \\sim q $$
        $$ \\sim(p \\wedge q) \\equiv \\sim p \\,\\vee\\, \\sim q $$
        $$ \\sim(p \\rightarrow q) \\equiv p \\,\\wedge\\, \\sim q $$
        $$ \\sim(p \\leftrightarrow q) \\equiv (\\sim p \\leftrightarrow q) \\equiv (p \\leftrightarrow \\sim q) $$
      </div>
      <p>La negación de un condicional <strong>no</strong> es otro condicional: es una conjunción.</p>

      <h2>Condicionales asociadas</h2>
      <p>A partir de \\(p \\rightarrow q\\) (directa) se forman:</p>
      <div class="tbl-wrap">
      <table class="tbl">
        <thead><tr><th>Nombre</th><th>Forma</th></tr></thead>
        <tbody>
          <tr><td>Directa</td><td>\\(p \\rightarrow q\\)</td></tr>
          <tr><td>Recíproca</td><td>\\(q \\rightarrow p\\)</td></tr>
          <tr><td>Contraria</td><td>\\(\\sim p \\rightarrow \\sim q\\)</td></tr>
          <tr><td>Contrarrecíproca</td><td>\\(\\sim q \\rightarrow \\sim p\\)</td></tr>
        </tbody>
      </table>
      </div>
      <div class="callout">
        <strong class="callout__tag">Equivalencia clave</strong>
        La directa es <strong>lógicamente equivalente</strong> a su contrarrecíproca:
        $$ (p \\rightarrow q) \\equiv (\\sim q \\rightarrow \\sim p) $$
      </div>

      <h2>Leyes del álgebra proposicional</h2>
      <div class="formula-box">
        $$ \\textbf{Involución: } \\sim(\\sim p) \\equiv p $$
        $$ \\textbf{Idempotencia: } (p\\wedge p)\\equiv p \\quad (p\\vee p)\\equiv p $$
        $$ \\textbf{Conmutativa: } p\\wedge q\\equiv q\\wedge p \\quad p\\vee q\\equiv q\\vee p $$
        $$ \\textbf{Asociativa: } (p\\wedge q)\\wedge r\\equiv p\\wedge(q\\wedge r) $$
        $$ \\textbf{Distributiva: } p\\wedge(q\\vee r)\\equiv (p\\wedge q)\\vee(p\\wedge r) $$
        $$ \\textbf{De Morgan: } \\sim(p\\wedge q)\\equiv\\, \\sim p\\,\\vee\\sim q $$
      </div>

      <h2>Cuantificadores</h2>
      <p>Permiten convertir <em>funciones proposicionales</em> \\(p(x)\\) en proposiciones.</p>
      <ul>
        <li><strong>Universal</strong> \\(\\forall x: p(x)\\) — «para todo \\(x\\)…»</li>
        <li><strong>Existencial</strong> \\(\\exists x / p(x)\\) — «existe un \\(x\\) tal que…»</li>
      </ul>
      <p>Sus negaciones intercambian el cuantificador y niegan la función:</p>
      <div class="formula-box">
        $$ \\sim\\big(\\forall x: p(x)\\big) \\equiv \\exists x / \\sim p(x) $$
        $$ \\sim\\big(\\exists x / p(x)\\big) \\equiv \\forall x : \\sim p(x) $$
      </div>
    `,
    quiz: [
      { q: "¿Cuándo es FALSO el condicional \\(p \\rightarrow q\\)?",
        opts: ["Cuando p es V y q es F", "Cuando ambas son F", "Cuando p es F y q es V", "Nunca"],
        a: 0, exp: "El condicional solo es falso con antecedente verdadero y consecuente falso." },
      { q: "La negación de \\(p \\wedge q\\) es:",
        opts: ["\\(\\sim p \\wedge \\sim q\\)", "\\(\\sim p \\vee \\sim q\\)", "\\(p \\vee q\\)", "\\(\\sim p \\rightarrow q\\)"],
        a: 1, exp: "Por la ley de De Morgan: \\(\\sim(p\\wedge q)\\equiv\\,\\sim p\\,\\vee\\sim q\\)." },
      { q: "¿Cuál es la contrarrecíproca de \\(p \\rightarrow q\\)?",
        opts: ["\\(q \\rightarrow p\\)", "\\(\\sim p \\rightarrow \\sim q\\)", "\\(\\sim q \\rightarrow \\sim p\\)", "\\(p \\wedge \\sim q\\)"],
        a: 2, exp: "La contrarrecíproca es \\(\\sim q \\rightarrow \\sim p\\) y es equivalente a la directa." },
      { q: "La disyunción exclusiva \\(p \\veebar q\\) es verdadera cuando:",
        opts: ["Ambas son verdaderas", "Los valores de p y q son distintos", "Ambas son falsas", "Al menos una es verdadera"],
        a: 1, exp: "La exclusiva es V cuando p y q tienen valores de verdad distintos." },
      { q: "«\\(p\\) es suficiente para \\(q\\)» se simboliza:",
        opts: ["\\(q \\rightarrow p\\)", "\\(p \\rightarrow q\\)", "\\(p \\leftrightarrow q\\)", "\\(\\sim p \\vee q\\)"],
        a: 1, exp: "«p suficiente para q» y «q necesario para p» equivalen a \\(p\\rightarrow q\\)." },
      { q: "\\(\\sim(\\forall x: p(x))\\) equivale a:",
        opts: ["\\(\\forall x: \\sim p(x)\\)", "\\(\\exists x / \\sim p(x)\\)", "\\(\\exists x / p(x)\\)", "\\(\\forall x: p(x)\\)"],
        a: 1, exp: "Negar el universal lo convierte en existencial negando la función." },
      { q: "\\(\\sim(p \\rightarrow q)\\) es equivalente a:",
        opts: ["\\(\\sim p \\rightarrow \\sim q\\)", "\\(p \\wedge \\sim q\\)", "\\(\\sim p \\vee q\\)", "\\(q \\rightarrow p\\)"],
        a: 1, exp: "Negar un condicional da una conjunción: \\(p \\wedge \\sim q\\)." },
      { q: "¿Cuál de estas oraciones es una proposición?",
        opts: ["¡Ojalá apruebe!", "\\(x + 5 = 12\\)", "El 15 es un número primo", "Cerrá la puerta"],
        a: 2, exp: "Solo «el 15 es primo» es declarativa y tiene valor de verdad (es falsa). Las demás son deseo, función proposicional y orden." },
      { q: "Una proposición que es siempre verdadera, sin importar los valores, se llama:",
        opts: ["Contradicción", "Contingencia", "Tautología", "Bicondicional"],
        a: 2, exp: "Tautología: V en todas las filas. Contradicción: F en todas. Contingencia: depende." },
      { q: "«\\(q\\) es necesario para \\(p\\)» se simboliza:",
        opts: ["\\(p \\rightarrow q\\)", "\\(q \\rightarrow p\\)", "\\(p \\leftrightarrow q\\)", "\\(q \\wedge p\\)"],
        a: 0, exp: "«q necesario para p» equivale a «p solo si q», es decir \\(p \\rightarrow q\\)." },
      { q: "Si \\(p\\) es V y \\(q\\) es F, ¿cuánto vale \\(p \\wedge \\sim q\\)?",
        opts: ["V", "F", "Depende de r", "No se puede saber"],
        a: 0, exp: "\\(\\sim q\\) es V, y V \\(\\wedge\\) V = V." },
      { q: "La recíproca de \\(p \\rightarrow q\\) es:",
        opts: ["\\(\\sim p \\rightarrow \\sim q\\)", "\\(q \\rightarrow p\\)", "\\(\\sim q \\rightarrow \\sim p\\)", "\\(p \\wedge q\\)"],
        a: 1, exp: "La recíproca intercambia antecedente y consecuente: \\(q \\rightarrow p\\)." },
      { q: "\\(\\sim(\\exists x / p(x))\\) equivale a:",
        opts: ["\\(\\exists x / \\sim p(x)\\)", "\\(\\forall x : \\sim p(x)\\)", "\\(\\forall x : p(x)\\)", "\\(\\exists x / p(x)\\)"],
        a: 1, exp: "Negar el existencial lo convierte en universal negando la función." },
    ],
    cards: [
      { q: "¿Qué es una proposición?", a: "Oración declarativa que es V o F, pero no ambas." },
      { q: "Tabla de \\(p \\wedge q\\)", a: "Verdadera SOLO si ambas son verdaderas." },
      { q: "Tabla de \\(p \\vee q\\)", a: "Falsa SOLO si ambas son falsas." },
      { q: "¿Cuándo es falso \\(p \\rightarrow q\\)?", a: "Solo cuando p = V y q = F." },
      { q: "\\(p \\leftrightarrow q\\) es verdadera…", a: "Cuando p y q tienen el mismo valor de verdad." },
      { q: "De Morgan", a: "\\(\\sim(p\\wedge q)\\equiv\\sim p\\,\\vee\\sim q\\) y \\(\\sim(p\\vee q)\\equiv\\sim p\\,\\wedge\\sim q\\)" },
      { q: "Equivalencia de la directa", a: "\\((p\\rightarrow q)\\equiv(\\sim q\\rightarrow\\sim p)\\) (contrarrecíproca)." },
      { q: "Disyunción exclusiva \\(p \\veebar q\\)", a: "Verdadera cuando p y q tienen valores DISTINTOS." },
      { q: "Tipos de proposición compuesta", a: "Tautología (siempre V), Contradicción (siempre F), Contingencia (depende)." },
      { q: "p suficiente / q necesario", a: "«p suficiente para q» = «q necesario para p» = \\(p \\rightarrow q\\)." },
      { q: "Las 4 condicionales asociadas", a: "Directa \\(p\\to q\\), Recíproca \\(q\\to p\\), Contraria \\(\\sim p\\to\\sim q\\), Contrarrecíproca \\(\\sim q\\to\\sim p\\)." },
      { q: "Negación de un cuantificador", a: "Se cambia \\(\\forall\\leftrightarrow\\exists\\) y se niega la función: \\(\\sim(\\forall x:p(x))\\equiv\\exists x/\\sim p(x)\\)." },
    ]
  },

  /* ===================================================================
     UNIDAD 2 — TEORÍA DE CONJUNTOS
     =================================================================== */
  {
    id: "conjuntos",
    glyph: "∪",
    icon: "sets",
    title: "Teoría de Conjuntos",
    desc: "Pertenencia, inclusión, operaciones, diagramas de Venn y De Morgan.",
    tool: "conjuntos",
    html: `
      <p class="lead">Un <strong>conjunto</strong> es un concepto primitivo (no se define). Los términos primitivos de la teoría son: <em>conjunto</em>, <em>elemento</em> y <em>pertenece</em>.</p>

      <h2>Notación</h2>
      <p>Hay dos formas de definir un conjunto:</p>
      <ul>
        <li><strong>Por extensión:</strong> se nombra cada elemento. \\(A = \\{1,2,3,4,5\\}\\)</li>
        <li><strong>Por comprensión:</strong> se da una propiedad. \\(A = \\{x \\in \\mathbb{N} \\mid 1 \\le x \\le 5\\}\\)</li>
      </ul>
      <p>La <strong>pertenencia</strong> vincula un elemento con un conjunto: \\(1 \\in A\\), \\(\\;4 \\notin A\\).</p>

      <h2>Relaciones entre conjuntos</h2>
      <h3>Inclusión \\(\\subset\\)</h3>
      <p>\\(A\\) está incluido en \\(B\\) si todo elemento de \\(A\\) pertenece a \\(B\\):</p>
      <div class="formula-box">$$ A \\subset B \\;\\Leftrightarrow\\; \\forall x: (x \\in A \\rightarrow x \\in B) $$</div>
      <p>Propiedades: <strong>reflexiva</strong> \\((A\\subset A)\\), <strong>transitiva</strong> \\((A\\subset B \\wedge B\\subset C \\Rightarrow A\\subset C)\\) y <strong>antisimétrica</strong>.</p>

      <h3>Igualdad</h3>
      <div class="formula-box">$$ A = B \\;\\Leftrightarrow\\; (A \\subset B \\,\\wedge\\, B \\subset A) $$</div>
      <p>Es reflexiva, simétrica y transitiva. El orden y la repetición de elementos no importan: \\(\\{0,3\\} = \\{3,0\\}\\).</p>

      <h2>Conjuntos especiales</h2>
      <ul>
        <li><strong>Vacío</strong> \\(\\varnothing = \\{\\,\\}\\): no tiene elementos. Es <strong>único</strong> y \\(\\varnothing \\subset A\\) para todo \\(A\\).</li>
        <li><strong>Unitario:</strong> tiene un solo elemento, p. ej. \\(\\{2\\}\\).</li>
        <li><strong>Universal</strong> \\(U\\): contiene todos los elementos del tema de referencia.</li>
      </ul>

      <h2>Operaciones entre conjuntos</h2>
      <div class="callout">
        <strong class="callout__tag">Visualizá</strong>
        Probá todas estas operaciones en el <a href="#/tool/conjuntos">Laboratorio de conjuntos (diagramas de Venn)</a>.
      </div>

      <h3>Complemento \\(A^{c}\\)</h3>
      <div class="formula-box">$$ A^{c} = \\{x \\in U \\mid x \\notin A\\} = U - A $$</div>

      <h3>Intersección \\(A \\cap B\\)</h3>
      <div class="formula-box">$$ A \\cap B = \\{x \\mid x \\in A \\,\\wedge\\, x \\in B\\} $$</div>
      <p>Idempotente, conmutativa y asociativa. Si \\(A\\cap B = \\varnothing\\) los conjuntos son <strong>disjuntos</strong>.</p>

      <h3>Unión \\(A \\cup B\\)</h3>
      <div class="formula-box">$$ A \\cup B = \\{x \\mid x \\in A \\,\\vee\\, x \\in B\\} $$</div>
      <p>Idempotente, conmutativa, asociativa y distributiva respecto de la intersección.</p>

      <h3>Diferencia \\(A - B\\)</h3>
      <div class="formula-box">$$ A - B = \\{x \\mid x \\in A \\,\\wedge\\, x \\notin B\\} $$</div>
      <p><strong>No</strong> es conmutativa ni asociativa: \\(A - B \\neq B - A\\).</p>

      <h3>Diferencia simétrica \\(A \\,\\triangle\\, B\\)</h3>
      <div class="formula-box">$$ A \\,\\triangle\\, B = (A - B) \\cup (B - A) $$</div>
      <p>Reúne los elementos que están en uno u otro, pero <strong>no en ambos</strong>.</p>

      <h2>Leyes de De Morgan</h2>
      <div class="formula-box">
        $$ (A \\cap B)^{c} = A^{c} \\cup B^{c} $$
        $$ (A \\cup B)^{c} = A^{c} \\cap B^{c} $$
      </div>
      <p>El complemento de la intersección es la unión de los complementos, y viceversa.</p>

      <div class="callout warn">
        <strong class="callout__tag">¡Cuidado!</strong>
        La <strong>pertenencia</strong> \\((\\in)\\) vincula un <em>elemento</em> con un conjunto; la <strong>inclusión</strong> \\((\\subset)\\) vincula un <em>conjunto</em> con otro conjunto.
        Por ejemplo, en \\(A = \\{1, \\{2\\}, 3, \\{2,3\\}, \\varnothing, 4\\}\\):
        \\(\\{2\\} \\in A\\) es V, pero \\(\\{2\\} \\subset A\\) es F.
      </div>
    `,
    quiz: [
      { q: "¿Qué significa \\(A \\subset B\\)?",
        opts: ["Algunos elementos de A están en B", "Todo elemento de A pertenece a B", "A y B son disjuntos", "A = B"],
        a: 1, exp: "Inclusión: todo elemento de A pertenece a B." },
      { q: "\\(A \\cap B\\) está formado por elementos que están…",
        opts: ["en A o en B", "en A y en B", "solo en A", "ni en A ni en B"],
        a: 1, exp: "La intersección requiere pertenecer a ambos." },
      { q: "\\((A \\cup B)^{c}\\) es igual a:",
        opts: ["\\(A^{c} \\cup B^{c}\\)", "\\(A^{c} \\cap B^{c}\\)", "\\(A \\cap B\\)", "\\(A^{c} - B\\)"],
        a: 1, exp: "Ley de De Morgan: el complemento de la unión es la intersección de los complementos." },
      { q: "El conjunto vacío \\(\\varnothing\\)…",
        opts: ["No está incluido en ningún conjunto", "Está incluido en todo conjunto", "Es igual al universal", "Tiene un elemento"],
        a: 1, exp: "\\(\\varnothing \\subset A\\) para todo A, y es único." },
      { q: "\\(A \\,\\triangle\\, B\\) (diferencia simétrica) es:",
        opts: ["\\((A-B)\\cup(B-A)\\)", "\\(A\\cap B\\)", "\\((A\\cap B)^{c}\\)", "\\(A\\cup B\\)"],
        a: 0, exp: "Es la unión de las dos diferencias." },
      { q: "Si \\(A = \\{1,\\{2\\},3\\}\\), ¿cuál es verdadera?",
        opts: ["\\(\\{2\\} \\subset A\\)", "\\(2 \\in A\\)", "\\(\\{2\\} \\in A\\)", "\\(\\{1\\} \\in A\\)"],
        a: 2, exp: "\\(\\{2\\}\\) es un elemento de A, por eso \\(\\{2\\}\\in A\\)." },
      { q: "La diferencia \\(A - B\\) es:",
        opts: ["Conmutativa", "No conmutativa", "Siempre vacía", "Igual a la unión"],
        a: 1, exp: "\\(A - B \\neq B - A\\) en general." },
      { q: "Con \\(A=\\{r,s,t\\}\\), ¿cuál afirmación es correcta?",
        opts: ["\\(r \\subset A\\)", "\\(\\{r\\} \\in A\\)", "\\(\\{r\\} \\subset A\\)", "\\(r \\notin A\\)"],
        a: 2, exp: "\\(\\{r\\}\\) es un subconjunto de A, por eso \\(\\{r\\}\\subset A\\). En cambio \\(r\\) es elemento, no subconjunto." },
      { q: "\\(M = \\{x / x\\) es múltiplo de 5 menor o igual a \\(20\\}\\) por extensión es:",
        opts: ["\\(\\{5,10,15\\}\\)", "\\(\\{5,10,15,20\\}\\)", "\\(\\{0,5,10,15,20\\}\\)", "\\(\\{1,5,10,20\\}\\)"],
        a: 1, exp: "Múltiplos de 5 hasta 20: 5, 10, 15 y 20." },
      { q: "Entre \\(\\{\\varnothing\\}\\), \\(\\{0\\}\\) y \\(\\varnothing\\):",
        opts: ["Son todos iguales", "Son todos distintos", "\\(\\{\\varnothing\\}=\\varnothing\\)", "\\(\\{0\\}=\\varnothing\\)"],
        a: 1, exp: "\\(\\varnothing\\) no tiene elementos; \\(\\{\\varnothing\\}\\) tiene un elemento (el vacío); \\(\\{0\\}\\) tiene al 0. Los tres difieren." },
      { q: "Con \\(A=\\{1,2,3,4\\}\\) y \\(B=\\{2,4,6,8\\}\\), \\(A\\cap B\\) es:",
        opts: ["\\(\\{2,4\\}\\)", "\\(\\{1,3\\}\\)", "\\(\\{6,8\\}\\)", "\\(\\{2,4,6,8\\}\\)"],
        a: 0, exp: "Los elementos comunes a ambos son 2 y 4." },
      { q: "El conjunto \\(\\{x \\in \\mathbb{N} / x < 1\\}\\) es:",
        opts: ["Unitario", "Infinito", "Vacío", "Igual a \\(\\mathbb{N}\\)"],
        a: 2, exp: "No hay naturales menores que 1, así que es vacío." },
    ],
    cards: [
      { q: "Por comprensión vs por extensión", a: "Comprensión: propiedad \\(\\{x\\mid p(x)\\}\\). Extensión: lista de elementos." },
      { q: "Definición de igualdad de conjuntos", a: "\\(A=B \\Leftrightarrow A\\subset B \\wedge B\\subset A\\)" },
      { q: "Intersección \\(A\\cap B\\)", a: "\\(\\{x \\mid x\\in A \\wedge x\\in B\\}\\)" },
      { q: "Unión \\(A\\cup B\\)", a: "\\(\\{x \\mid x\\in A \\vee x\\in B\\}\\)" },
      { q: "Complemento \\(A^c\\)", a: "\\(\\{x\\in U \\mid x\\notin A\\} = U - A\\)" },
      { q: "De Morgan en conjuntos", a: "\\((A\\cap B)^c = A^c\\cup B^c\\) y \\((A\\cup B)^c = A^c\\cap B^c\\)" },
      { q: "¿\\(\\in\\) o \\(\\subset\\)?", a: "\\(\\in\\): elemento–conjunto. \\(\\subset\\): conjunto–conjunto." },
      { q: "Diferencia \\(A - B\\)", a: "\\(\\{x \\mid x\\in A \\wedge x\\notin B\\}\\). No es conmutativa." },
      { q: "Diferencia simétrica \\(A\\triangle B\\)", a: "\\((A-B)\\cup(B-A)\\): en uno u otro, pero no en ambos." },
      { q: "Propiedades del vacío", a: "Es único y \\(\\varnothing\\subset A\\) para todo conjunto A." },
      { q: "Conjuntos disjuntos", a: "Aquellos en que \\(A\\cap B = \\varnothing\\) (no comparten elementos)." },
    ]
  },

  /* ===================================================================
     UNIDAD 3 — NÚMEROS REALES Y VALOR ABSOLUTO
     =================================================================== */
  {
    id: "reales",
    glyph: "ℝ",
    icon: "reals",
    title: "Números Reales y Valor Absoluto",
    desc: "Conjuntos numéricos, módulo, distancia, propiedades, ecuaciones e inecuaciones.",
    tool: "reales",
    html: `
      <p class="lead">Los <strong>números reales</strong> \\(\\mathbb{R}\\) se representan sobre una recta. El <strong>valor absoluto</strong> mide la distancia de un número al origen.</p>

      <h2>Conjuntos numéricos</h2>
      <p>Cada conjunto numérico amplía al anterior. La cadena de inclusión es:</p>
      <div class="formula-box">$$ \\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R} \\subset \\mathbb{C} \\qquad \\mathbb{R} = \\mathbb{Q} \\cup \\mathbb{I} $$</div>
      <div class="tbl-wrap">
      <table class="tbl tbl--left">
        <thead><tr><th>Conjunto</th><th>Símbolo</th><th>Qué incluye</th><th>Ejemplos</th></tr></thead>
        <tbody>
          <tr><td>Naturales</td><td>\\(\\mathbb{N}\\)</td><td>Los números que permiten contar (enteros positivos).</td><td>\\(1,\\ 2,\\ 3,\\ 50,\\ 100\\)</td></tr>
          <tr><td>Enteros</td><td>\\(\\mathbb{Z}\\)</td><td>Los naturales, sus negativos y el cero. No tienen parte decimal.</td><td>\\(-9,\\ -2,\\ 0,\\ 1,\\ 6\\)</td></tr>
          <tr><td>Racionales</td><td>\\(\\mathbb{Q}\\)</td><td>Los que se escriben como fracción \\(a/b\\;(b\\neq0)\\). Decimales exactos y periódicos.</td><td>\\(\\tfrac12,\\ -3{,}75,\\ 0{,}\\overline{3}\\)</td></tr>
          <tr><td>Irracionales</td><td>\\(\\mathbb{I}\\)</td><td>Expresión decimal infinita no periódica; no se pueden escribir como fracción.</td><td>\\(\\sqrt2,\\ \\pi,\\ e,\\ 0{,}58763\\dots\\)</td></tr>
          <tr><td>Reales</td><td>\\(\\mathbb{R}\\)</td><td>La unión de racionales e irracionales (\\(\\mathbb{R}=\\mathbb{Q}\\cup\\mathbb{I}\\)).</td><td>\\(-5,\\ \\tfrac34,\\ \\pi,\\ 8{,}2\\)</td></tr>
          <tr><td>Imaginarios</td><td>\\(\\mathbb{I}m\\)</td><td>Su cuadrado es negativo; dan solución a raíces de números negativos. \\(i=\\sqrt{-1}\\).</td><td>\\(i,\\ -5i,\\ 2i\\)</td></tr>
          <tr><td>Complejos</td><td>\\(\\mathbb{C}\\)</td><td>Extensión de los reales con la unidad imaginaria, de la forma \\(z=a+bi\\).</td><td>\\(2+3i,\\ -1+i,\\ 5\\)</td></tr>
        </tbody>
      </table>
      </div>
      <div class="callout tip">
        <strong class="callout__tag">Jugá con esto</strong>
        Poné a prueba la clasificación en el juego <a href="#/games/classify">Clasificá el número</a>.
      </div>

      <h2>Propiedades de las operaciones básicas</h2>

      <h3>Suma (adición) y resta (sustracción)</h3>
      <div class="tbl-wrap"><table class="tbl tbl--left">
        <thead><tr><th>Propiedad</th><th>Qué dice</th><th>Forma</th></tr></thead>
        <tbody>
          <tr><td>Conmutativa</td><td>El orden de los sumandos no altera el resultado.</td><td>\\(a+b=b+a\\)</td></tr>
          <tr><td>Asociativa</td><td>El modo de agrupar los sumandos no varía el resultado.</td><td>\\((a+b)+c=a+(b+c)\\)</td></tr>
          <tr><td>Elemento neutro</td><td>Todo número sumado a cero da el mismo número.</td><td>\\(a+0=a\\)</td></tr>
        </tbody>
      </table></div>
      <p class="muted" style="font-size:13px">La <strong>resta no</strong> es conmutativa ni asociativa: \\(a-b\\neq b-a\\).</p>

      <h3>Multiplicación y división</h3>
      <div class="tbl-wrap"><table class="tbl tbl--left">
        <thead><tr><th>Propiedad</th><th>Qué dice</th><th>Forma</th></tr></thead>
        <tbody>
          <tr><td>Conmutativa</td><td>El orden de los factores no altera el producto.</td><td>\\(a\\cdot b=b\\cdot a\\)</td></tr>
          <tr><td>Asociativa</td><td>El modo de agrupar los factores no varía el resultado.</td><td>\\((a\\cdot b)\\cdot c=a\\cdot(b\\cdot c)\\)</td></tr>
          <tr><td>Elemento neutro</td><td>Todo número multiplicado por 1 da el mismo número.</td><td>\\(a\\cdot 1=a\\)</td></tr>
          <tr><td>Distributiva</td><td>El producto se reparte en cada término de la suma o resta.</td><td>\\(a\\cdot(b+c)=a\\cdot b+a\\cdot c\\)</td></tr>
        </tbody>
      </table></div>
      <p class="muted" style="font-size:13px">La <strong>división no</strong> es conmutativa ni asociativa, y <strong>nunca</strong> se divide por cero.</p>

      <h3>Potenciación (potencia)</h3>
      <div class="tbl-wrap"><table class="tbl tbl--left">
        <thead><tr><th>Propiedad</th><th>Qué dice</th><th>Forma</th></tr></thead>
        <tbody>
          <tr><td>Producto de igual base</td><td>Se suman los exponentes.</td><td>\\(a^{m}\\cdot a^{n}=a^{m+n}\\)</td></tr>
          <tr><td>Cociente de igual base</td><td>Se restan los exponentes.</td><td>\\(a^{m}\\div a^{n}=a^{m-n}\\)</td></tr>
          <tr><td>Potencia de una potencia</td><td>Se multiplican los exponentes.</td><td>\\((a^{m})^{n}=a^{m\\cdot n}\\)</td></tr>
          <tr><td>Distributiva (·, ÷)</td><td>Se distribuye respecto del producto y el cociente.</td><td>\\((a\\cdot c)^{n}=a^{n}\\cdot c^{n}\\)</td></tr>
          <tr><td>Exponente cero / uno</td><td>Todo número (≠0) elevado a 0 da 1; elevado a 1, da sí mismo.</td><td>\\(a^{0}=1,\\quad a^{1}=a\\)</td></tr>
        </tbody>
      </table></div>
      <div class="callout warn">
        <strong class="callout__tag">¡Cuidado!</strong>
        La potencia <strong>no</strong> se distribuye en sumas ni restas:
        $$ (a+b)^{n}\\neq a^{n}+b^{n} \\qquad \\text{ej.: } (3+2)^{2}=25\\neq 3^{2}+2^{2}=13 $$
      </div>

      <h3>Radicación (raíz)</h3>
      <div class="tbl-wrap"><table class="tbl tbl--left">
        <thead><tr><th>Propiedad</th><th>Qué dice</th><th>Forma</th></tr></thead>
        <tbody>
          <tr><td>Raíz de un producto</td><td>La raíz se distribuye en el producto.</td><td>\\(\\sqrt[n]{a\\cdot b}=\\sqrt[n]{a}\\cdot\\sqrt[n]{b}\\)</td></tr>
          <tr><td>Raíz de un cociente</td><td>La raíz se separa en dividendo y divisor.</td><td>\\(\\sqrt[n]{\\tfrac{a}{b}}=\\dfrac{\\sqrt[n]{a}}{\\sqrt[n]{b}}\\)</td></tr>
          <tr><td>Exponente fraccionario</td><td>La raíz se escribe como potencia de exponente fraccionario.</td><td>\\(\\sqrt[n]{a^{m}}=a^{m/n}\\)</td></tr>
        </tbody>
      </table></div>
      <div class="callout warn">
        <strong class="callout__tag">¡Cuidado!</strong>
        La raíz <strong>no</strong> se distribuye en sumas ni restas:
        $$ \\sqrt{a+b}\\neq\\sqrt{a}+\\sqrt{b} \\qquad \\text{ej.: } \\sqrt{16+9}=5\\neq\\sqrt{16}+\\sqrt{9}=7 $$
        Recordá además que \\(\\sqrt{x^{2}}=|x|\\).
      </div>
      <div class="callout tip">
        <strong class="callout__tag">Jugá con esto</strong>
        Repasá todas estas reglas en <a href="#/games/vof">Verdadero o Falso contrarreloj</a>.
      </div>

      <h2>Valor absoluto (módulo)</h2>
      <div class="callout def">
        <strong class="callout__tag">Definición</strong>
        $$ |\\alpha| = \\begin{cases} \\alpha & \\text{si } \\alpha \\ge 0 \\\\ -\\alpha & \\text{si } \\alpha < 0 \\end{cases} $$
        El valor absoluto es siempre <strong>no negativo</strong>.
      </div>
      <p>Ejemplos: \\(|3| = 3\\), \\(\\;|-9| = 9\\), \\(\\;|-0{,}5| = 0{,}5\\).</p>

      <h3>Interpretación geométrica</h3>
      <p>\\(|x|\\) es la <strong>distancia</strong> del punto de abscisa \\(x\\) al origen. Por eso \\(|x| = a\\) (con \\(a>0\\)) tiene dos soluciones: \\(x = \\pm a\\).</p>
      <div class="callout tip">
        <strong class="callout__tag">Distancia entre dos puntos</strong>
        $$ d(x,y) = |x - y| = |y - x| $$
        Ej.: la distancia entre \\(-4\\) y \\(-2\\) es \\(|-4-(-2)| = |-2| = 2\\).
      </div>

      <h2>Propiedades del módulo</h2>
      <div class="formula-box">
        $$ |x| \\ge 0 \\qquad |x|^{2} = x^{2} \\qquad \\sqrt{x^{2}} = |x| $$
        $$ |x| = |-x| \\qquad -|x| \\le x \\le |x| $$
        $$ |x\\cdot y| = |x|\\cdot|y| \\qquad \\left|\\tfrac{x}{y}\\right| = \\tfrac{|x|}{|y|}\\;(y\\neq0) $$
        $$ |x + y| \\le |x| + |y| \\quad\\text{(desigualdad triangular)} $$
        $$ \\big|\\,|x| - |y|\\,\\big| \\le |x - y| $$
      </div>
      <div class="tbl-wrap"><table class="tbl tbl--left">
        <thead><tr><th>Propiedad</th><th>Ejemplo</th><th>Descripción</th></tr></thead>
        <tbody>
          <tr><td>\\(|x|\\ge 0\\)</td><td>\\(|-2|=2\\ge 0\\)</td><td>El valor absoluto siempre es positivo o cero.</td></tr>
          <tr><td>\\(|x|=|-x|\\)</td><td>\\(|4|=|-4|=4\\)</td><td>Un número y su opuesto tienen el mismo valor absoluto.</td></tr>
          <tr><td>\\(|x\\cdot y|=|x|\\cdot|y|\\)</td><td>\\(|-2\\cdot 7|=|-2|\\cdot|7|=14\\)</td><td>El módulo de un producto es el producto de los módulos.</td></tr>
          <tr><td>\\(\\left|\\tfrac{x}{y}\\right|=\\tfrac{|x|}{|y|}\\)</td><td>\\(\\left|\\tfrac{8}{-5}\\right|=\\tfrac{|8|}{|-5|}=\\tfrac{8}{5}\\)</td><td>El módulo de un cociente es el cociente de los módulos.</td></tr>
        </tbody>
      </table></div>

      <h2>Ecuaciones e inecuaciones con módulo</h2>
      <div class="callout">
        <strong class="callout__tag">Reglas fundamentales (con \\(c>0\\))</strong>
        $$ |x| = a \\;\\Leftrightarrow\\; x = a \\,\\vee\\, x = -a $$
        $$ |x| < c \\;\\Leftrightarrow\\; -c < x < c $$
        $$ |x| > c \\;\\Leftrightarrow\\; x > c \\,\\vee\\, x < -c $$
      </div>
      <p>Para módulos desplazados, \\(|x - a| < c\\) describe los puntos cuya distancia a \\(a\\) es menor que \\(c\\):</p>
      <div class="formula-box">$$ |x - a| < c \\;\\Leftrightarrow\\; a - c < x < a + c $$</div>

      <h3>Ejemplos resueltos</h3>
      <p><strong>a)</strong> \\(|x+1| = 2 \\Rightarrow x+1 = \\pm 2 \\Rightarrow x_1 = 1 \\;\\vee\\; x_2 = -3\\).</p>
      <p><strong>b)</strong> \\(|x| < 3 \\Rightarrow -3 < x < 3 \\Rightarrow x \\in (-3, 3)\\).</p>
      <p><strong>c)</strong> \\(|x-3| > 2 \\Rightarrow x > 5 \\;\\vee\\; x < 1 \\Rightarrow x \\in (-\\infty,1)\\cup(5,+\\infty)\\).</p>

      <div class="callout tip">
        <strong class="callout__tag">Resolvé al instante</strong>
        Usá el <a href="#/tool/reales">Resolutor de inecuaciones con valor absoluto</a> para ver el conjunto solución y el intervalo en la recta.
      </div>

      <h2>Intervalos</h2>
      <div class="tbl-wrap">
      <table class="tbl">
        <thead><tr><th>Notación</th><th>Significado</th><th>Conjunto</th></tr></thead>
        <tbody>
          <tr><td>\\((a,b)\\)</td><td>abierto</td><td>\\(\\{x \\mid a < x < b\\}\\)</td></tr>
          <tr><td>\\([a,b]\\)</td><td>cerrado</td><td>\\(\\{x \\mid a \\le x \\le b\\}\\)</td></tr>
          <tr><td>\\([a,b)\\)</td><td>semiabierto</td><td>\\(\\{x \\mid a \\le x < b\\}\\)</td></tr>
          <tr><td>\\((a,+\\infty)\\)</td><td>no acotado</td><td>\\(\\{x \\mid x > a\\}\\)</td></tr>
        </tbody>
      </table>
      </div>
    `,
    quiz: [
      { q: "Por definición, \\(\\sqrt{x^{2}}\\) es igual a:",
        opts: ["\\(x\\)", "\\(|x|\\)", "\\(-x\\)", "\\(x^2\\)"],
        a: 1, exp: "Siempre \\(\\sqrt{x^2}=|x|\\), porque la raíz es no negativa." },
      { q: "\\(|x| < 3\\) equivale a:",
        opts: ["\\(x > 3\\)", "\\(-3 < x < 3\\)", "\\(x < -3\\)", "\\(x = \\pm 3\\)"],
        a: 1, exp: "\\(|x|<c \\Leftrightarrow -c<x<c\\)." },
      { q: "\\(|x| > 2\\) equivale a:",
        opts: ["\\(-2 < x < 2\\)", "\\(x > 2 \\;\\vee\\; x < -2\\)", "\\(0 < x < 2\\)", "\\(x = 2\\)"],
        a: 1, exp: "\\(|x|>c \\Leftrightarrow x>c \\vee x<-c\\)." },
      { q: "La solución de \\(|x+1| = 2\\) es:",
        opts: ["\\(x = 1\\)", "\\(x = 1 \\;\\vee\\; x = -3\\)", "\\(x = -1\\)", "No tiene solución"],
        a: 1, exp: "\\(x+1=\\pm2\\Rightarrow x=1\\) o \\(x=-3\\)." },
      { q: "La distancia entre \\(-4\\) y \\(-2\\) es:",
        opts: ["\\(6\\)", "\\(-2\\)", "\\(2\\)", "\\(-6\\)"],
        a: 2, exp: "\\(|-4-(-2)| = |-2| = 2\\)." },
      { q: "La desigualdad triangular dice:",
        opts: ["\\(|x+y| \\ge |x|+|y|\\)", "\\(|x+y| \\le |x|+|y|\\)", "\\(|x+y| = |x|-|y|\\)", "\\(|xy| = |x|+|y|\\)"],
        a: 1, exp: "\\(|x+y| \\le |x| + |y|\\)." },
      { q: "¿Tiene solución \\(|x| = -2\\)?",
        opts: ["Sí, \\(x = -2\\)", "Sí, \\(x = \\pm 2\\)", "No, el módulo nunca es negativo", "Sí, \\(x=2\\)"],
        a: 2, exp: "El valor absoluto es siempre \\(\\ge 0\\); no puede ser \\(-2\\)." },
      { q: "El número \\(\\sqrt{4}\\) pertenece a:",
        opts: ["Solo a los irracionales \\(\\mathbb{I}\\)", "A \\(\\mathbb{N},\\mathbb{Z},\\mathbb{Q}\\) y \\(\\mathbb{R}\\)", "Solo a \\(\\mathbb{R}\\)", "A ninguno"],
        a: 1, exp: "\\(\\sqrt{4}=2\\), que es natural, entero, racional y real." },
      { q: "\\(\\sqrt{16+9}\\) es igual a:",
        opts: ["\\(\\sqrt{16}+\\sqrt{9}=7\\)", "\\(\\sqrt{25}=5\\)", "\\(25\\)", "\\(12{,}5\\)"],
        a: 1, exp: "La raíz NO se distribuye en la suma: \\(\\sqrt{16+9}=\\sqrt{25}=5\\), no 7." },
      { q: "El resultado de \\(5 - \\pi\\) es un número:",
        opts: ["Racional", "Irracional", "Entero", "Natural"],
        a: 1, exp: "Restar un irracional (\\(\\pi\\)) a un entero da un irracional." },
      { q: "Si \\(x=\\sqrt{18}+\\sqrt{32}\\), entonces \\(x^2\\) es:",
        opts: ["\\(50\\)", "\\(48\\)", "\\(98\\)", "\\(7\\sqrt{2}\\)"],
        a: 2, exp: "\\(\\sqrt{18}+\\sqrt{32}=3\\sqrt2+4\\sqrt2=7\\sqrt2\\), y \\((7\\sqrt2)^2=49\\cdot2=98\\)." },
      { q: "Racionalizar \\(\\dfrac{3}{\\sqrt{2}}\\) da:",
        opts: ["\\(\\dfrac{3\\sqrt2}{2}\\)", "\\(\\dfrac{3}{2}\\)", "\\(3\\sqrt2\\)", "\\(\\dfrac{\\sqrt2}{3}\\)"],
        a: 0, exp: "Multiplicando arriba y abajo por \\(\\sqrt2\\): \\(\\dfrac{3\\sqrt2}{2}\\)." },
      { q: "\\(2(x+y)=2x+2y\\) es la propiedad:",
        opts: ["Asociativa", "Conmutativa", "Distributiva", "Elemento neutro"],
        a: 2, exp: "Es la propiedad distributiva del producto respecto de la suma." },
      { q: "\\(a^{m}\\cdot a^{n}\\) (producto de igual base) es igual a:",
        opts: ["\\(a^{m\\cdot n}\\)", "\\(a^{m+n}\\)", "\\(a^{m-n}\\)", "\\(a^{m}+a^{n}\\)"],
        a: 1, exp: "En el producto de igual base se SUMAN los exponentes: \\(a^{m+n}\\)." },
      { q: "\\((a^{m})^{n}\\) (potencia de una potencia) es igual a:",
        opts: ["\\(a^{m+n}\\)", "\\(a^{m\\cdot n}\\)", "\\(a^{m-n}\\)", "\\(a^{m^{n}}\\)"],
        a: 1, exp: "Potencia de una potencia: se MULTIPLICAN los exponentes, \\(a^{m\\cdot n}\\)." },
      { q: "¿Cuánto vale \\(a^{0}\\) con \\(a\\neq 0\\)?",
        opts: ["\\(0\\)", "\\(1\\)", "\\(a\\)", "No está definido"],
        a: 1, exp: "Todo número distinto de cero elevado a 0 da 1." },
      { q: "El elemento neutro de la multiplicación es:",
        opts: ["\\(0\\)", "\\(1\\)", "El mismo número", "\\(-1\\)"],
        a: 1, exp: "\\(a\\cdot 1=a\\): el neutro multiplicativo es 1 (el de la suma es 0)." },
      { q: "\\(\\sqrt[n]{a^{m}}\\) escrito como potencia es:",
        opts: ["\\(a^{n/m}\\)", "\\(a^{m/n}\\)", "\\(a^{m\\cdot n}\\)", "\\(a^{m-n}\\)"],
        a: 1, exp: "El radicando pasa a exponente fraccionario: \\(\\sqrt[n]{a^{m}}=a^{m/n}\\)." },
      { q: "¿Cuál es FALSA?",
        opts: ["\\((a\\cdot b)^{n}=a^{n}b^{n}\\)", "\\((a+b)^{2}=a^{2}+b^{2}\\)", "\\(\\sqrt[n]{ab}=\\sqrt[n]{a}\\sqrt[n]{b}\\)", "\\(a^{m}\\cdot a^{n}=a^{m+n}\\)"],
        a: 1, exp: "La potencia NO se distribuye en la suma: \\((a+b)^{2}=a^{2}+2ab+b^{2}\\), no \\(a^{2}+b^{2}\\)." },
    ],
    cards: [
      { q: "Cadena de conjuntos numéricos", a: "\\(\\mathbb{N}\\subset\\mathbb{Z}\\subset\\mathbb{Q}\\subset\\mathbb{R}\\); además \\(\\mathbb{R}=\\mathbb{Q}\\cup\\mathbb{I}\\)." },
      { q: "¿La raíz se distribuye en la suma?", a: "NO: \\(\\sqrt{a+b}\\neq\\sqrt a+\\sqrt b\\). Ej: \\(\\sqrt{16+9}=5\\neq7\\)." },
      { q: "Racionalizar denominador", a: "Multiplicar num. y denom. por la raíz (o el conjugado) para quitar la raíz del denominador." },
      { q: "Propiedad distributiva", a: "\\(a(b+c)=ab+ac\\)." },
      { q: "Definición de \\(|\\alpha|\\)", a: "\\(\\alpha\\) si \\(\\alpha\\ge0\\); \\(-\\alpha\\) si \\(\\alpha<0\\). Siempre \\(\\ge0\\)." },
      { q: "\\(\\sqrt{x^2} = ?\\)", a: "\\(|x|\\)" },
      { q: "\\(|x| < c\\) (c>0)", a: "\\(-c < x < c\\)" },
      { q: "\\(|x| > c\\) (c>0)", a: "\\(x > c \\;\\vee\\; x < -c\\)" },
      { q: "\\(|x| = a\\) (a>0)", a: "\\(x = a \\;\\vee\\; x = -a\\)" },
      { q: "Distancia entre x e y", a: "\\(|x - y| = |y - x|\\)" },
      { q: "Desigualdad triangular", a: "\\(|x + y| \\le |x| + |y|\\)" },
      { q: "Producto de igual base", a: "\\(a^{m}\\cdot a^{n}=a^{m+n}\\) (se suman los exponentes)." },
      { q: "Cociente de igual base", a: "\\(a^{m}\\div a^{n}=a^{m-n}\\) (se restan los exponentes)." },
      { q: "Potencia de una potencia", a: "\\((a^{m})^{n}=a^{m\\cdot n}\\) (se multiplican)." },
      { q: "Exponente fraccionario", a: "\\(\\sqrt[n]{a^{m}}=a^{m/n}\\)." },
      { q: "¿La potencia/raíz se distribuye en sumas?", a: "NO: \\((a+b)^{n}\\neq a^{n}+b^{n}\\) y \\(\\sqrt{a+b}\\neq\\sqrt a+\\sqrt b\\)." },
      { q: "Elementos neutros", a: "Suma: 0 (\\(a+0=a\\)). Producto: 1 (\\(a\\cdot1=a\\))." },
    ]
  },

  /* ===================================================================
     UNIDAD 4 — NÚMEROS COMPLEJOS
     =================================================================== */
  {
    id: "complejos",
    glyph: "ℂ",
    icon: "complex",
    title: "Números Complejos",
    desc: "Pares ordenados, unidad imaginaria, forma binómica, conjugado, módulo y potencias de i.",
    tool: "complejos",
    html: `
      <p class="lead">Un <strong>número complejo</strong> es un par ordenado de números reales. Amplían a los reales y permiten resolver \\(x^2 = -1\\).</p>

      <div class="callout def">
        <strong class="callout__tag">Definición</strong>
        $$ \\mathbb{C} = \\{(a,b) \\mid a \\in \\mathbb{R} \\,\\wedge\\, b \\in \\mathbb{R}\\} $$
        \\(\\operatorname{Re}(z) = a\\) (parte real), \\(\\operatorname{Im}(z) = b\\) (parte imaginaria).
      </div>
      <p>Geométricamente, \\(z=(a,b)\\) es un punto del plano: la abscisa es la parte real y la ordenada la imaginaria.</p>

      <h2>Igualdad</h2>
      <div class="formula-box">$$ (a,b) = (c,d) \\;\\Leftrightarrow\\; a = c \\,\\wedge\\, b = d $$</div>

      <h2>Operaciones</h2>
      <div class="formula-box">
        $$ (a,b) + (c,d) = (a+c,\\; b+d) $$
        $$ (a,b)\\cdot(c,d) = (ac - bd,\\; ad + bc) $$
      </div>
      <p>La suma y el producto son conmutativos y asociativos. Neutro aditivo \\((0,0)\\), neutro multiplicativo \\((1,0)\\).</p>

      <h2>Unidad imaginaria</h2>
      <div class="callout">
        <strong class="callout__tag">Clave</strong>
        \\(i = (0,1)\\), y al multiplicarla por sí misma:
        $$ i^{2} = (0,1)\\cdot(0,1) = (-1,0) = -1 $$
        Por lo tanto \\(i = \\sqrt{-1}\\).
      </div>

      <h2>Forma binómica</h2>
      <p>Como \\((a,0)=a\\) y \\((0,b)=b\\,i\\), todo complejo se escribe:</p>
      <div class="formula-box">$$ z = (a,b) = a + b\\,i $$</div>
      <p>Es la forma más cómoda para operar (se trabaja como binomios, recordando que \\(i^2 = -1\\)).</p>

      <h2>Conjugado</h2>
      <div class="formula-box">$$ \\overline{z} = \\overline{a + bi} = a - bi $$</div>
      <p>Propiedades: \\(\\overline{\\overline{z}} = z\\), \\(\\;\\overline{z+w} = \\overline{z}+\\overline{w}\\), \\(\\;\\overline{z\\cdot w} = \\overline{z}\\cdot\\overline{w}\\).</p>
      <div class="formula-box">
        $$ z + \\overline{z} = 2\\operatorname{Re}(z) = 2a $$
        $$ z \\cdot \\overline{z} = a^{2} + b^{2} = |z|^{2} $$
      </div>

      <h2>Módulo</h2>
      <p>Es la distancia del punto \\((a,b)\\) al origen:</p>
      <div class="formula-box">$$ |z| = |a + bi| = \\sqrt{a^{2} + b^{2}} $$</div>

      <h2>Cociente</h2>
      <p>Se multiplica numerador y denominador por el conjugado del denominador:</p>
      <div class="formula-box">$$ \\frac{z}{w} = \\frac{z \\cdot \\overline{w}}{|w|^{2}} $$</div>

      <h2>Potencias de la unidad imaginaria</h2>
      <div class="formula-box">
        $$ i^{0}=1 \\quad i^{1}=i \\quad i^{2}=-1 \\quad i^{3}=-i \\quad i^{4}=1 $$
      </div>
      <p>Se repiten en ciclo de 4. Para \\(i^{n}\\), se divide \\(n\\) entre 4 y se usa el resto \\(r\\): \\(\\;i^{n} = i^{r}\\).</p>
      <div class="callout tip">
        <strong class="callout__tag">Ejemplo</strong>
        \\(i^{23}\\): como \\(23 = 4\\cdot5 + 3\\), el resto es 3, entonces \\(i^{23} = i^{3} = -i\\).
      </div>

      <h2>Raíz de reales negativos</h2>
      <div class="formula-box">$$ \\sqrt{-x} = i\\sqrt{x}\\quad (x \\ge 0) $$</div>
      <p>Ej.: \\(\\sqrt{-16} = 4i\\), \\(\\;\\sqrt{-8} = 2\\sqrt{2}\\,i\\).</p>
      <div class="callout warn">
        <strong class="callout__tag">¡Cuidado!</strong>
        Si \\(a,b>0\\), <strong>no</strong> vale \\(\\sqrt{-a}\\cdot\\sqrt{-b} = \\sqrt{ab}\\). Por ejemplo \\(\\sqrt{-25}\\cdot\\sqrt{-4} = 5i\\cdot2i = 10i^2 = -10 \\neq \\sqrt{100}=10\\).
      </div>

      <div class="callout tip">
        <strong class="callout__tag">Calculadora</strong>
        Operá complejos (suma, producto, cociente, módulo, conjugado y potencias de \\(i\\)) en la <a href="#/tool/complejos">Calculadora de complejos</a>.
      </div>
    `,
    quiz: [
      { q: "El valor de \\(i^{2}\\) es:",
        opts: ["\\(1\\)", "\\(-1\\)", "\\(i\\)", "\\(-i\\)"],
        a: 1, exp: "Por definición \\(i^2 = -1\\)." },
      { q: "El conjugado de \\(z = 3 - 5i\\) es:",
        opts: ["\\(-3 + 5i\\)", "\\(3 + 5i\\)", "\\(-3 - 5i\\)", "\\(5 - 3i\\)"],
        a: 1, exp: "Se cambia el signo de la parte imaginaria: \\(\\overline{z}=3+5i\\)." },
      { q: "El módulo de \\(z = 3 + 4i\\) es:",
        opts: ["\\(7\\)", "\\(5\\)", "\\(25\\)", "\\(\\sqrt{7}\\)"],
        a: 1, exp: "\\(|z|=\\sqrt{3^2+4^2}=\\sqrt{25}=5\\)." },
      { q: "\\(z\\cdot\\overline{z}\\) es igual a:",
        opts: ["\\(2a\\)", "\\(a^2 + b^2 = |z|^2\\)", "\\(a^2 - b^2\\)", "\\(2bi\\)"],
        a: 1, exp: "El producto de un complejo por su conjugado es \\(|z|^2\\)." },
      { q: "\\(i^{23}\\) es igual a:",
        opts: ["\\(1\\)", "\\(i\\)", "\\(-i\\)", "\\(-1\\)"],
        a: 2, exp: "\\(23 = 4\\cdot5+3\\), resto 3, entonces \\(i^{23}=i^3=-i\\)." },
      { q: "\\((2,3) + (1,-1)\\) es igual a:",
        opts: ["\\((3,2)\\)", "\\((2,-3)\\)", "\\((3,-2)\\)", "\\((1,4)\\)"],
        a: 0, exp: "Se suma componente a componente: \\((2+1,\\;3-1)=(3,2)\\)." },
      { q: "\\(\\sqrt{-16}\\) es igual a:",
        opts: ["\\(4\\)", "\\(4i\\)", "\\(-4\\)", "\\(16i\\)"],
        a: 1, exp: "\\(\\sqrt{-16}=i\\sqrt{16}=4i\\)." },
      { q: "El inverso multiplicativo de \\(z=(a,b)\\) es:",
        opts: ["\\((-a,-b)\\)", "\\(\\left(\\tfrac{a}{a^2+b^2},\\tfrac{-b}{a^2+b^2}\\right)\\)", "\\((a,-b)\\)", "\\((b,a)\\)"],
        a: 1, exp: "\\(z^{-1}=\\dfrac{\\overline z}{|z|^2}=\\left(\\tfrac{a}{a^2+b^2},\\tfrac{-b}{a^2+b^2}\\right)\\)." },
      { q: "\\((2+i)-(3+i)\\) es igual a:",
        opts: ["\\(-1\\)", "\\(-1+2i\\)", "\\(5+2i\\)", "\\(1\\)"],
        a: 0, exp: "Restando parte a parte: \\((2-3)+(1-1)i=-1+0i=-1\\)." },
      { q: "\\((6i)^2\\) es igual a:",
        opts: ["\\(36\\)", "\\(-36\\)", "\\(36i\\)", "\\(-6\\)"],
        a: 1, exp: "\\((6i)^2=36i^2=36(-1)=-36\\)." },
      { q: "Para dividir \\(z/w\\) se multiplica por:",
        opts: ["El opuesto de w", "El conjugado del denominador", "El módulo de z", "La unidad imaginaria"],
        a: 1, exp: "Se multiplica numerador y denominador por \\(\\overline w\\): \\(\\dfrac{z\\overline w}{|w|^2}\\)." },
      { q: "\\(\\dfrac{1}{i}\\) es igual a:",
        opts: ["\\(i\\)", "\\(-i\\)", "\\(1\\)", "\\(-1\\)"],
        a: 1, exp: "\\(\\dfrac{1}{i}\\cdot\\dfrac{-i}{-i}=\\dfrac{-i}{-i^2}=\\dfrac{-i}{1}=-i\\)." },
      { q: "Un complejo es imaginario puro cuando:",
        opts: ["Su parte imaginaria es 0", "Su parte real es 0", "Es igual a su conjugado", "Su módulo es 0"],
        a: 1, exp: "Si \\(\\operatorname{Re}(z)=0\\), z es de la forma \\((0,b)=bi\\): imaginario puro." },
    ],
    cards: [
      { q: "¿Qué es un número complejo?", a: "Un par ordenado \\((a,b)\\) de reales; \\(z = a + bi\\)." },
      { q: "Valor de \\(i^2\\)", a: "\\(-1\\)" },
      { q: "Suma de complejos", a: "\\((a,b)+(c,d)=(a+c,\\,b+d)\\)" },
      { q: "Producto de complejos", a: "\\((a,b)(c,d)=(ac-bd,\\,ad+bc)\\)" },
      { q: "Conjugado de \\(a+bi\\)", a: "\\(a - bi\\)" },
      { q: "Módulo de \\(a+bi\\)", a: "\\(\\sqrt{a^2+b^2}\\)" },
      { q: "Potencias de i (ciclo)", a: "\\(i^0=1,\\ i^1=i,\\ i^2=-1,\\ i^3=-i\\) y se repite." },
      { q: "Cociente z/w", a: "Multiplicar por el conjugado: \\(\\dfrac{z\\overline{w}}{|w|^2}\\)." },
      { q: "Inverso multiplicativo \\(z^{-1}\\)", a: "\\(\\dfrac{\\overline z}{|z|^2}=\\left(\\dfrac{a}{a^2+b^2},\\dfrac{-b}{a^2+b^2}\\right)\\)." },
      { q: "Neutros en \\(\\mathbb{C}\\)", a: "Aditivo \\((0,0)\\); multiplicativo \\((1,0)\\)." },
      { q: "\\(\\sqrt{-x}\\) con \\(x\\ge0\\)", a: "\\(i\\sqrt{x}\\). Ej: \\(\\sqrt{-16}=4i\\)." },
      { q: "Complejo real / imaginario puro", a: "Real: \\(\\operatorname{Im}(z)=0\\). Imaginario puro: \\(\\operatorname{Re}(z)=0\\)." },
    ]
  }

  ]
};
