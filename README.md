# Estudio de Matemática — Plataforma interactiva

Sitio web de estudio para **Introducción a la Matemática**, con teoría, herramientas
interactivas, práctica guiada, autoevaluación y seguimiento de progreso. Pensado para
estudiar en cualquier momento: en la compu o en el celular.

## Contenido

Cuatro unidades basadas en los apuntes de la cátedra:

1. **Nociones de Lógica** — proposiciones, conectivos, tablas de verdad, leyes y cuantificadores.
2. **Teoría de Conjuntos** — pertenencia, inclusión, operaciones, Venn y De Morgan.
3. **Números Reales y Valor Absoluto** — clasificación de números, módulo, distancia, propiedades, racionalización, ecuaciones e inecuaciones.
4. **Números Complejos** — forma binómica, conjugado, módulo, cociente y potencias de *i*.

## Herramientas interactivas

- **Generador de tablas de verdad** — escribí cualquier proposición y obtené su tabla + clasificación (tautología / contradicción / contingencia).
- **Diagramas de Venn** — se iluminan según la operación, y cálculo con conjuntos reales.
- **Resolutor de valor absoluto** — resuelve `|x − a| □ c` y dibuja el intervalo en la recta numérica.
- **Calculadora de complejos** — suma, resta, producto, cociente, módulo, conjugado y potencias de *i*.

## Práctica

- **Ejercicios de los Trabajos Prácticos (TP N°1 a N°4)** con solución paso a paso revelable.
- **Flashcards** por unidad (tarjetas que se dan vuelta).
- **Autoevaluación** con quizzes por unidad y un **quiz general** mezclado.
- **Progreso** guardado en el navegador (localStorage): teoría leída + mejor puntaje.

## Cómo subirlo a Vercel

Es un sitio **estático** (HTML/CSS/JS, sin build). Tres opciones:

### Opción A — Arrastrar y soltar (la más simple)
1. Entrá a <https://vercel.com> e iniciá sesión.
2. **Add New → Project → Deploy** y arrastrá esta carpeta `web/`.
3. Listo: Vercel te da una URL pública.

### Opción B — Con la CLI de Vercel
```bash
npm i -g vercel
cd web
vercel        # seguí los pasos; cuando pregunte, aceptá los valores por defecto
vercel --prod # para publicarlo en producción
```

### Opción C — Desde GitHub
1. Subí la carpeta `web/` a un repositorio de GitHub.
2. En Vercel: **Add New → Project → Import** ese repo.
3. Framework Preset: **Other**. Root Directory: la carpeta donde está `index.html`.
4. **Deploy**.

> No hace falta configurar build ni output: al ser estático, Vercel sirve los archivos tal cual.

## Probarlo localmente

Abrí `index.html` directamente en el navegador, o levantá un servidor:

```bash
# con Python
python -m http.server 5173
# o con Node
npx serve .
```
Luego abrí <http://localhost:5173>.

## Estructura

```
web/
├── index.html
├── vercel.json
├── css/styles.css
└── js/
    ├── data.js      # teoría, quizzes y flashcards de las 4 unidades
    ├── practice.js  # ejercicios de los TP con solución
    ├── logic.js     # generador de tablas de verdad
    ├── complex.js   # calculadora de complejos + valor absoluto
    ├── sets.js      # diagramas de Venn
    └── app.js       # router, navegación, iconos, progreso, quiz, flashcards, práctica
```

Las fórmulas se renderizan con **KaTeX** (desde CDN). El sitio necesita conexión a internet
para cargar KaTeX y las fuentes; el resto funciona de forma local.
