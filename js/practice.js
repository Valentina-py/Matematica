/* ============================================================
   TRABAJOS PRÁCTICOS — ejercicios con solución revelable
   Basados en los TP N°1 a N°4 (Matemática · 1er Año · 2026)
   Cada ejercicio: { q: enunciado, sol: solución paso a paso }
   ============================================================ */
window.APP_DATA = window.APP_DATA || {};
window.APP_DATA.practica = [

  /* =============================== TP 1 — LÓGICA =============================== */
  {
    id: "tp1", unit: "logica", glyph: "∴",
    title: "TP N°1 · Nociones de Lógica",
    desc: "Proposiciones, simbolización, tablas de verdad, cuantificadores y demostraciones.",
    exercises: [
      {
        q: "<strong>1.</strong> Indicá cuáles de estas expresiones son proposiciones y, si es posible, su valor de verdad:<br>a) El número 15 es primo. &nbsp; b) ¡Ojalá apruebe! &nbsp; c) \\(x+5=12\\) &nbsp; d) Orán pertenece a Salta. &nbsp; e) ¿Viste el video? &nbsp; f) \\(3^2+4^2=5^2\\) &nbsp; g) Los naturales pares son enteros. &nbsp; h) Prohibido cruzar en rojo. &nbsp; i) Cerrá la puerta. &nbsp; j) 1013 es múltiplo de 13.",
        sol: "<strong>Proposiciones:</strong> a) Sí, <em>Falsa</em> (15 = 3·5, no es primo). d) Sí, <em>Verdadera</em>. f) Sí, <em>Verdadera</em> (9+16=25). g) Sí, <em>Verdadera</em>. j) Sí, <em>Falsa</em> (1013 no es múltiplo de 13).<br><strong>No son proposiciones:</strong> b) deseo · c) función proposicional (depende de \\(x\\)) · e) pregunta · h) e i) órdenes."
      },
      {
        q: "<strong>2.</strong> Escribí en forma simbólica:<br>a) Si las exportaciones disminuyen, bajarán las utilidades.<br>b) Los enteros y las fracciones son racionales.<br>c) Los precios son altos si y solo si los costos aumentan.<br>e) Si aumenta la demanda, aumenta la oferta, y viceversa.",
        sol: "a) \\(p \\rightarrow q\\) &nbsp;(p: disminuyen exportaciones; q: bajan utilidades).<br>b) \\(p \\wedge q\\) &nbsp;(conjunción «y»).<br>c) \\(p \\leftrightarrow q\\) &nbsp;(«si y solo si»).<br>e) \\(p \\leftrightarrow q\\) &nbsp;(«y viceversa» indica bicondicional)."
      },
      {
        q: "<strong>4.</strong> Con p: <em>estudio sistemáticamente</em>, q: <em>rindo bien el parcial</em>, r: <em>me voy de vacaciones</em>, simbolizá:<br>a) Si estudio, rendiré bien.<br>b) No estudio, pero me iré de vacaciones.<br>c) Me iré de vacaciones si y solo si rindo bien y estudio.<br>d) No es cierto que, si no estudio, rinda bien.",
        sol: "a) \\(p \\rightarrow q\\)<br>b) \\(\\sim p \\wedge r\\) &nbsp;(«pero» es conjunción)<br>c) \\(r \\leftrightarrow (q \\wedge p)\\)<br>d) \\(\\sim(\\sim p \\rightarrow q)\\), que equivale a \\(\\sim p \\wedge \\sim q\\)."
      },
      {
        q: "<strong>5.</strong> Simbolizá y negá: «Si el precio baja, entonces la demanda aumenta».",
        sol: "p: el precio baja; q: la demanda aumenta. &nbsp;Enunciado: \\(p \\rightarrow q\\).<br>Negación: \\(\\sim(p \\rightarrow q) \\equiv p \\wedge \\sim q\\).<br>Retraducción: «El precio baja y (sin embargo) la demanda no aumenta»."
      },
      {
        q: "<strong>6.</strong> Si \\(p\\) y \\(r\\) son verdaderas y \\(q\\) es falsa, hallá el valor de verdad de \\((p \\wedge \\sim q) \\rightarrow (r \\vee q)\\).",
        sol: "\\(\\sim q = V\\), entonces \\(p \\wedge \\sim q = V \\wedge V = V\\).<br>\\(r \\vee q = V \\vee F = V\\).<br>Condicional: \\(V \\rightarrow V = \\boldsymbol{V}\\) (verdadera)."
      },
      {
        q: "<strong>12.</strong> Simbolizá con cuantificadores y negá:<br>a) Todo número entero es racional.<br>d) Existe un real \\(x\\) tal que \\(x^2 = -1\\).",
        sol: "a) \\(\\forall x \\in \\mathbb{Z}: x \\in \\mathbb{Q}\\) &nbsp;(<em>V</em>). &nbsp;Negación: \\(\\exists x \\in \\mathbb{Z} / x \\notin \\mathbb{Q}\\) (<em>F</em>).<br>d) \\(\\exists x \\in \\mathbb{R} / x^2 = -1\\) &nbsp;(<em>F</em>, ningún real al cuadrado da negativo). &nbsp;Negación: \\(\\forall x \\in \\mathbb{R}: x^2 \\neq -1\\) (<em>V</em>)."
      },
      {
        q: "<strong>13.</strong> Demostrá (método directo): «La suma de dos números impares es par».",
        sol: "Sean dos impares \\(a = 2m+1\\) y \\(b = 2n+1\\) con \\(m,n \\in \\mathbb{Z}\\).<br>\\(a + b = (2m+1)+(2n+1) = 2m + 2n + 2 = 2(m+n+1)\\).<br>Como \\(m+n+1 \\in \\mathbb{Z}\\), la suma es múltiplo de 2, es decir <strong>par</strong>. \\(\\blacksquare\\)"
      },
      {
        q: "<strong>13.</strong> Demostrá (método indirecto / contrarrecíproco): «Si \\(x^2\\) es par, entonces \\(x\\) es par».",
        sol: "Probamos la contrarrecíproca: «si \\(x\\) es impar, entonces \\(x^2\\) es impar».<br>Si \\(x = 2k+1\\), entonces \\(x^2 = 4k^2+4k+1 = 2(2k^2+2k)+1\\), que es <strong>impar</strong>.<br>Como la contrarrecíproca es verdadera, la directa también lo es. \\(\\blacksquare\\)"
      },
    ]
  },

  /* =============================== TP 2 — CONJUNTOS =============================== */
  {
    id: "tp2", unit: "conjuntos", glyph: "∪",
    title: "TP N°2 · Teoría de Conjuntos",
    desc: "Notación, pertenencia e inclusión, operaciones, diagramas de Venn y problemas con encuestas.",
    exercises: [
      {
        q: "<strong>2.</strong> Sea \\(A=\\{r,s,t\\}\\). Decidí si son correctas:<br>a) \\(r \\in A\\) &nbsp; b) \\(r \\subset A\\) &nbsp; c) \\(\\{r\\} \\in A\\) &nbsp; d) \\(\\{r\\} \\subset A\\) &nbsp; e) \\(a \\notin A\\)",
        sol: "a) <strong>Correcta</strong>: \\(r\\) es elemento de A.<br>b) <strong>Incorrecta</strong>: \\(r\\) es un elemento, no un conjunto; no puede «incluirse».<br>c) <strong>Incorrecta</strong>: \\(\\{r\\}\\) no es elemento de A (los elementos son \\(r,s,t\\)).<br>d) <strong>Correcta</strong>: \\(\\{r\\}\\) es subconjunto de A.<br>e) <strong>Correcta</strong>: \\(a\\) no figura entre los elementos."
      },
      {
        q: "<strong>3.</strong> Expresá por extensión:<br>a) \\(S=\\{x / x\\) es color del semáforo\\(\\}\\)<br>c) \\(M=\\{x / x\\) múltiplo de 5 \\(\\le 20\\}\\)<br>d) \\(E=\\{x \\in \\mathbb{Z} / -2 \\le x \\le 2\\}\\)",
        sol: "a) \\(S = \\{\\text{rojo, amarillo, verde}\\}\\)<br>c) \\(M = \\{5, 10, 15, 20\\}\\)<br>d) \\(E = \\{-2, -1, 0, 1, 2\\}\\)"
      },
      {
        q: "<strong>6.</strong> Entre \\(\\{\\varnothing\\}\\), \\(\\{0\\}\\) y \\(\\varnothing\\), ¿cuáles son diferentes?",
        sol: "Los <strong>tres son distintos</strong>:<br>· \\(\\varnothing\\) no tiene elementos (cardinal 0).<br>· \\(\\{\\varnothing\\}\\) tiene <em>un</em> elemento: el conjunto vacío (cardinal 1).<br>· \\(\\{0\\}\\) tiene un elemento: el número 0 (cardinal 1).<br>\\(\\{\\varnothing\\} \\neq \\{0\\}\\) porque \\(\\varnothing \\neq 0\\)."
      },
      {
        q: "<strong>8.</strong> Con \\(A=\\{1,2,3,4\\}\\), \\(B=\\{2,4,6,8\\}\\), \\(C=\\{3,4,5,6\\}\\) y \\(\\mathcal{U}=\\{x\\in\\mathbb{N}/x<10\\}\\), hallá:<br>i) \\(A\\cup B\\) &nbsp; vii) \\(A\\cap B\\cap C\\) &nbsp; viii) \\((A\\cap B)\\cup C\\) &nbsp; ix) \\((A\\cup B)\\cap C\\)",
        sol: "i) \\(A\\cup B = \\{1,2,3,4,6,8\\}\\)<br>vii) \\(A\\cap B = \\{2,4\\}\\); \\(\\{2,4\\}\\cap C = \\{4\\}\\). Entonces \\(A\\cap B\\cap C=\\{4\\}\\).<br>viii) \\((A\\cap B)\\cup C = \\{2,4\\}\\cup\\{3,4,5,6\\} = \\{2,3,4,5,6\\}\\).<br>ix) \\(A\\cup B=\\{1,2,3,4,6,8\\}\\); \\(\\cap C = \\{3,4,6\\}\\)."
      },
      {
        q: "<strong>13.a)</strong> Encuesta a 100 técnicos sobre los sistemas A, B y C:<br>· 24 usan C &nbsp;· 9 solo B &nbsp;· 7 solo C y B &nbsp;· 43 ninguno &nbsp;· 8 solo C y A &nbsp;· 6 los tres &nbsp;· 13 usan A y B.<br>Hallá: (1) ¿cuántos usan solo A?  (2) ¿al menos dos sistemas?  (3) ¿cuántos usan B?",
        sol: "Armamos el Venn de adentro hacia afuera. Centro (A∩B∩C) = 6.<br>· Solo C y B = 7; solo C y A = 8. Entonces «solo C» = 24 − (6+7+8) = <strong>3</strong>.<br>· A y B = 13 incluye el centro: solo A y B = 13 − 6 = <strong>7</strong>.<br>· Total clasificados = 100 − 43 = 57.<br><strong>(2) Al menos dos:</strong> (solo A&B)+(solo C&B)+(solo C&A)+(centro) = 7+7+8+6 = <strong>28</strong>.<br><strong>(1) Solo A:</strong> 57 − [solo B (9) + solo C (3) + los de «al menos dos» (28)] = 57 − 40 = <strong>17</strong>.<br><strong>(3) Usan B:</strong> solo B (9) + solo B&C (7) + solo A&B (7) + centro (6) = <strong>29</strong>."
      },
      {
        q: "<strong>13.b)</strong> Encuesta a 100 técnicos: 40 desarrollo · 20 solo soporte · 10 desarrollo y redes solamente · 5 las tres · 15 desarrollo y soporte · 25 ninguna · 8 solo redes. ¿Cuántos trabajan en al menos un área?",
        sol: "«Al menos un área» = total − ninguna = 100 − 25 = <strong>75</strong> técnicos.<br>(Verificación parcial: desarrollo = 40 incluye sus intersecciones; «desarrollo y soporte» = 15 con 5 en las tres ⇒ solo desarrollo y soporte = 10.)"
      },
    ]
  },

  /* =============================== TP 3 — NÚMEROS REALES =============================== */
  {
    id: "tp3", unit: "reales", glyph: "ℝ",
    title: "TP N°3 · Números Reales",
    desc: "Clasificación de números, propiedades de potenciación y radicación, racionalización.",
    exercises: [
      {
        q: "<strong>2.</strong> Decidí si el resultado es racional (Q) o irracional (I):<br>a) \\(\\sqrt{4}\\cdot\\sqrt{49}\\) &nbsp; b) \\(5-\\pi\\) &nbsp; c) \\((\\sqrt{7})^2\\) &nbsp; e) \\(\\dfrac{\\sqrt{20}}{\\sqrt{9}}\\) &nbsp; f) \\(\\sqrt{10}-1\\)",
        sol: "a) \\(2\\cdot 7 = 14\\) → <strong>Q</strong>.<br>b) irracional menos… da <strong>I</strong> (\\(\\pi\\) es irracional).<br>c) \\((\\sqrt7)^2 = 7\\) → <strong>Q</strong>.<br>e) \\(\\dfrac{\\sqrt{20}}{3}\\): \\(\\sqrt{20}\\) es irracional → <strong>I</strong>.<br>f) \\(\\sqrt{10}\\) irracional → <strong>I</strong>."
      },
      {
        q: "<strong>3.</strong> Verdadero o falso (justificá):<br>a) \\(\\sqrt{16+9}=\\sqrt{16}+\\sqrt{9}\\) &nbsp; b) \\(\\sqrt{(-6)^2}=6\\) &nbsp; c) \\((3+2)^2=3^2+2^2\\)",
        sol: "a) <strong>Falso</strong>: \\(\\sqrt{25}=5\\) pero \\(\\sqrt{16}+\\sqrt9=4+3=7\\). La raíz no se distribuye en la suma.<br>b) <strong>Verdadero</strong>: \\(\\sqrt{(-6)^2}=\\sqrt{36}=6=|-6|\\).<br>c) <strong>Falso</strong>: \\((3+2)^2=25\\) pero \\(3^2+2^2=13\\). El cuadrado no se distribuye."
      },
      {
        q: "<strong>5.</strong> ¿Cuáles igualdades son ciertas? Corregí las falsas:<br>a) \\(\\sqrt[3]{-64}=-8\\) &nbsp; c) \\(\\sqrt[4]{256}=2^2\\) &nbsp; d) \\(9^{1/2}=-3\\) &nbsp; f) \\(64^{-2/3}=4^{-2}\\)",
        sol: "a) <strong>Falsa</strong>: \\(\\sqrt[3]{-64}=-4\\) (porque \\((-4)^3=-64\\)).<br>c) <strong>Verdadera</strong>: \\(\\sqrt[4]{256}=4=2^2\\).<br>d) <strong>Falsa</strong>: \\(9^{1/2}=\\sqrt9=3\\) (la raíz principal es positiva).<br>f) <strong>Verdadera</strong>: \\(64^{2/3}=(\\sqrt[3]{64})^2=4^2=16\\), así que \\(64^{-2/3}=\\tfrac1{16}=4^{-2}\\)."
      },
      {
        q: "<strong>9.</strong> Si \\(x=\\sqrt{18}+\\sqrt{32}\\), entonces \\(x^2\\) es igual a: a) 48  b) 50  c) 98  d) Ninguna.",
        sol: "Simplificamos: \\(\\sqrt{18}=3\\sqrt2\\) y \\(\\sqrt{32}=4\\sqrt2\\), entonces \\(x=7\\sqrt2\\).<br>\\(x^2=(7\\sqrt2)^2=49\\cdot2=98\\). → opción <strong>c) 98</strong>."
      },
      {
        q: "<strong>11.</strong> Resolvé sumando radicales semejantes:<br>a) \\(\\sqrt{18}+\\sqrt{50}+\\sqrt{2}-\\sqrt{8}\\)",
        sol: "Pasamos todo a \\(\\sqrt2\\):<br>\\(\\sqrt{18}=3\\sqrt2,\\ \\sqrt{50}=5\\sqrt2,\\ \\sqrt2=\\sqrt2,\\ \\sqrt8=2\\sqrt2\\).<br>\\(3\\sqrt2+5\\sqrt2+\\sqrt2-2\\sqrt2 = (3+5+1-2)\\sqrt2 = \\boldsymbol{7\\sqrt2}\\)."
      },
      {
        q: "<strong>12.</strong> Racionalizá:<br>a) \\(\\dfrac{3}{\\sqrt2}\\) &nbsp; d) \\(\\dfrac{\\sqrt2+\\sqrt3}{\\sqrt2-\\sqrt3}\\)",
        sol: "a) Multiplico por \\(\\dfrac{\\sqrt2}{\\sqrt2}\\): \\(\\dfrac{3\\sqrt2}{2}\\).<br>d) Multiplico por el conjugado \\(\\dfrac{\\sqrt2+\\sqrt3}{\\sqrt2+\\sqrt3}\\):<br>numerador \\((\\sqrt2+\\sqrt3)^2 = 2+2\\sqrt6+3 = 5+2\\sqrt6\\); denominador \\((\\sqrt2)^2-(\\sqrt3)^2 = 2-3 = -1\\).<br>Resultado: \\(\\dfrac{5+2\\sqrt6}{-1} = -5-2\\sqrt6\\)."
      },
    ]
  },

  /* =============================== TP 4 — NÚMEROS COMPLEJOS =============================== */
  {
    id: "tp4", unit: "complejos", glyph: "ℂ",
    title: "TP N°4 · Números Complejos",
    desc: "Operaciones con pares y forma binómica, inverso, raíces de negativos y conjugados.",
    exercises: [
      {
        q: "<strong>1.</strong> Efectuá con pares ordenados:<br>a) \\([(-1,2)+(2,-3)]+(0,1)\\) &nbsp; d) \\((-1,1)^3+(0,1)^2\\)",
        sol: "a) \\((-1,2)+(2,-3)=(1,-1)\\); luego \\((1,-1)+(0,1)=(1,0)\\).<br>d) \\((0,1)^2=i^2=-1=(-1,0)\\). Para \\((-1,1)^3\\): en binómica \\(-1+i\\); \\((-1+i)^2 = 1-2i+i^2 = -2i\\); \\((-1+i)^3=(-2i)(-1+i)=2i-2i^2 = 2+2i\\).<br>Suma: \\((2+2i)+(-1)=1+2i=(1,2)\\)."
      },
      {
        q: "<strong>2.</strong> Encontrá \\(z^{-1}\\) (inverso multiplicativo) de:<br>a) \\(z=(3,-1)\\) &nbsp; e) \\(z=(0,1)\\)",
        sol: "Fórmula: \\(z^{-1}=\\left(\\dfrac{a}{a^2+b^2},\\ \\dfrac{-b}{a^2+b^2}\\right)\\).<br>a) \\(a^2+b^2 = 9+1 = 10\\): \\(z^{-1}=\\left(\\tfrac{3}{10},\\tfrac{1}{10}\\right)\\).<br>e) \\(z=(0,1)=i\\): \\(a^2+b^2=1\\), \\(z^{-1}=(0,-1)=-i\\). (Coherente con \\(1/i=-i\\).)"
      },
      {
        q: "<strong>3.b)</strong> Calculá \\(\\bigl|(-2+i)-(-3+i)\\bigr|\\).",
        sol: "Primero la resta: \\((-2+i)-(-3+i) = (-2+3)+(1-1)i = 1+0i = 1\\).<br>Módulo: \\(|1| = \\sqrt{1^2+0^2} = \\boldsymbol{1}\\)."
      },
      {
        q: "<strong>3.j) y k)</strong> Calculá: j) \\((6i)^2\\) &nbsp; k) \\((3+\\sqrt{-4})^2\\)",
        sol: "j) \\((6i)^2 = 36i^2 = 36(-1) = -36\\).<br>k) \\(\\sqrt{-4}=2i\\), entonces \\((3+2i)^2 = 9 + 12i + 4i^2 = 9 + 12i - 4 = 5 + 12i\\)."
      },
      {
        q: "<strong>3.p)</strong> Llevá a la forma \\(a+bi\\): \\(\\dfrac{1+3i}{2-2i}\\).",
        sol: "Multiplico por el conjugado del denominador \\((2+2i)\\):<br>Numerador: \\((1+3i)(2+2i) = 2+2i+6i+6i^2 = 2+8i-6 = -4+8i\\).<br>Denominador: \\((2-2i)(2+2i) = 4 - 4i^2 = 4+4 = 8\\).<br>Resultado: \\(\\dfrac{-4+8i}{8} = -\\tfrac12 + i\\)."
      },
      {
        q: "<strong>4.b)</strong> Escribí sin radicandos negativos y en forma \\(a+bi\\): \\(\\sqrt{-4}\\cdot\\sqrt{-16}\\).",
        sol: "<strong>¡Cuidado!</strong> No se multiplica bajo una sola raíz. Primero cada una:<br>\\(\\sqrt{-4}=2i\\), \\(\\sqrt{-16}=4i\\).<br>\\(2i\\cdot4i = 8i^2 = -8\\). &nbsp;(Si hubieras hecho \\(\\sqrt{64}=8\\) estaría mal: el resultado correcto es \\(-8\\).)"
      },
      {
        q: "<strong>5.</strong> Con \\(Z_1=-1+2i\\), \\(Z_2=-1-2i\\), \\(Z_3=2i\\), calculá \\(Z_1 + i - (\\overline{Z_2 - Z_3})\\).",
        sol: "\\(Z_2 - Z_3 = (-1-2i)-(2i) = -1-4i\\).<br>Conjugado: \\(\\overline{-1-4i} = -1+4i\\).<br>\\(Z_1 + i = (-1+2i)+i = -1+3i\\).<br>Resto: \\((-1+3i)-(-1+4i) = 0 - i = \\boldsymbol{-i}\\)."
      },
    ]
  },

];
