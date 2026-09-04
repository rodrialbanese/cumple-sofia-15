# Invitación XV Sofía — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a single-page, mobile-first birthday invitation site for Sofía's XV años (09/10/2026), replicating the interaction pattern studied from `latarjetadigital.app/pili-15s/` (entry gate, hero+countdown, AOS scroll-reveal, hidden-YouTube background music) recolored to bordó/white, with an RSVP form that writes to a Google Sheet.

**Architecture:** Static site — `index.html` + `assets/css/styles.css` + several small vanilla-JS files (no build step, no framework). Two small logic modules (`countdown.js`, `rsvp.js`) are written UMD-lite (plain global functions + a `module.exports` guard) so they can be unit-tested with Node's built-in test runner and also loaded directly via `<script>` in the browser. The only dynamic behavior is a client-side `fetch` to a Google Apps Script Web App that appends RSVP rows to a Google Sheet. Deployed to Vercel's free tier with no custom domain.

**Tech Stack:** HTML5, CSS3 (mobile-first, `@media (min-width: 768px)` for larger screens), vanilla JS (ES5-compatible, classic `<script defer>` — no modules/bundler), AOS 2.3.1 (CDN) for scroll animations, YouTube IFrame API (hidden player) for background music, Google Apps Script + Google Sheets for RSVP storage, Node.js ≥18 (`node --test`) for unit tests, Vercel for hosting.

## Global Constraints

- Sitio estático de una sola página, sin build step, sin frameworks (HTML/CSS/JS vanilla).
- Mobile-first: estilos base pensados para ~375–430px de ancho; refinamientos para pantallas grandes solo dentro de `@media (min-width: 768px)`.
- Todo el texto visible en mayúsculas, tipografía **Montserrat** (400/700) vía Google Fonts.
- Paleta fija: bordó `#6d2130`, bordó oscuro `#4a1620` (footer), blanco `#ffffff`.
- El countdown muestra días/horas/minutos/segundos — **nunca la fecha**.
- Animaciones de scroll con **AOS** (`data-aos="fade-up"`, `data-aos-once="true"`) — disparo único por sección.
- Música: iframe de YouTube oculto (1×1px) que arranca únicamente tras el click en "INGRESAR" (gesto de usuario — evita el bloqueo de autoplay de iOS/Android).
- RSVP: un solo `fetch` (`mode: 'no-cors'`) desde el navegador a un Google Apps Script Web App. Sin backend propio, sin base de datos propia.
- Sin dominio propio: deploy a Vercel (plan free), subdominio automático tipo `sofia-15.vercel.app`.
- Node.js ≥18 es una dependencia **solo de desarrollo** (para correr `node --test`) — no forma parte del sitio publicado.
- Fuera de alcance (no implementar): sistema multi-evento, subida de fotos propia, datos bancarios para regalos, panel de administración de RSVPs.

---

### Task 1: Inicializar repositorio y estructura de carpetas

**Files:**
- Create: `.gitignore`
- Create: `index.html` (stub mínimo)
- Create: `assets/css/styles.css` (vacío)
- Create: `assets/js/countdown.js` (vacío)
- Create: `assets/js/rsvp.js` (vacío)
- Create: `assets/js/gate.js` (vacío)
- Create: `assets/js/music.js` (vacío)
- Create: `assets/js/rsvp-form.js` (vacío)
- Create: `assets/js/main.js` (vacío)
- Create: `tests/countdown.test.js` (vacío, se completa en Task 4)
- Create: `tests/rsvp.test.js` (vacío, se completa en Task 9)

**Interfaces:**
- Produces: la estructura de carpetas (`assets/css/`, `assets/js/`, `assets/img/` se crea implícitamente cuando se agregue la foto en Task 12, `tests/`, `google-apps-script/` se crea en Task 11) que todas las tareas siguientes asumen como existente.

- [ ] **Step 1: Inicializar el repo git**

```bash
git init
```

Expected: `Initialized empty Git repository in .../invitacion/.git/`

- [ ] **Step 2: Crear `.gitignore`**

```
.superpowers/
node_modules/
.DS_Store
```

- [ ] **Step 3: Crear los archivos stub**

Crear cada archivo vacío en las rutas listadas arriba en "Files" (contenido vacío por ahora — se completan en tareas siguientes). Usar el editor para crear:
- `index.html` con contenido `<!-- stub -->`
- `assets/css/styles.css` con contenido vacío
- `assets/js/countdown.js`, `assets/js/rsvp.js`, `assets/js/gate.js`, `assets/js/music.js`, `assets/js/rsvp-form.js`, `assets/js/main.js` con contenido vacío
- `tests/countdown.test.js`, `tests/rsvp.test.js` con contenido vacío

- [ ] **Step 4: Confirmar que Node ≥18 está disponible**

```bash
node --version
```

Expected: `v18.x.x` o superior. Si es menor, instalar una versión reciente de Node antes de continuar (se necesita para `node --test` en Tasks 4 y 9).

- [ ] **Step 5: Commit inicial**

```bash
git add .gitignore index.html assets tests
git commit -m "chore: scaffold project structure"
```

---

### Task 2: Markup completo de `index.html` con contenido real

**Files:**
- Modify: `index.html` (reemplaza el stub del Task 1)

**Interfaces:**
- Produces: los ids que usan las tareas siguientes — `#gate`, `#gateTitle`, `#gateMessage`, `#enterButton`, `#hero`, `#countDays`, `#countHours`, `#countMinutes`, `#countSeconds`, `#photosAlbumLink`, `#rsvpForm` (con campos `nombre`, `cantidad`, `confirma` (radios), `comentario`), `#rsvpFeedback`, `#musicToggle`, `#youtubePlayer`. También produce el objeto global `CONFIG` (inline script) que usan `main.js`, `music.js` y `rsvp-form.js`.
- Consumes: nada (es la base).

- [ ] **Step 1: Escribir el HTML completo**

Reemplazar todo el contenido de `index.html` con:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MIS XV SOFI</title>
  <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.1/aos.css">
  <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>

  <script>
    var CONFIG = {
      eventDate: '2026-10-09T21:00:00-03:00',
      googlePhotosAlbumUrl: 'https://photos.app.goo.gl/REEMPLAZAR_CON_TU_ALBUM',
      googleAppsScriptUrl: 'https://script.google.com/macros/s/REEMPLAZAR_CON_TU_ID/exec',
      youtubeVideoId: 'REEMPLAZAR_CON_TU_VIDEO_ID'
    };
  </script>

  <div id="gate">
    <h1 id="gateTitle">MIS XV SOFI</h1>
    <p id="gateMessage">Quiero que seas parte de este momento tan importante para mí</p>
    <button id="enterButton">INGRESAR</button>
  </div>

  <div id="youtubePlayer" style="position:absolute;width:1px;height:1px;overflow:hidden;"></div>
  <button id="musicToggle" aria-label="Música">❙❙</button>

  <div id="hero">
    <h1>MIS <strong>XV</strong><br>SOFI</h1>
    <div class="countdown">
      <div class="box"><span class="num" id="countDays">0</span><span class="lbl">DÍAS</span></div>
      <div class="box"><span class="num" id="countHours">00</span><span class="lbl">HORAS</span></div>
      <div class="box"><span class="num" id="countMinutes">00</span><span class="lbl">MIN</span></div>
      <div class="box"><span class="num" id="countSeconds">00</span><span class="lbl">SEG</span></div>
    </div>
  </div>

  <section class="section blanco" data-aos="fade-up" data-aos-once="true">
    <h2>¿CUÁNDO?</h2>
    <p>9 DE OCTUBRE 2026<br>21:00 HS</p>
  </section>

  <section class="section bordo" data-aos="fade-up" data-aos-once="true">
    <h2>¿DÓNDE?</h2>
    <p>LOLA MORA — ESPAÑA 746</p>
    <a class="btn" href="https://www.google.com/maps/search/?api=1&query=Lola+Mora+Espa%C3%B1a+746" target="_blank" rel="noopener noreferrer">CÓMO LLEGAR</a>
  </section>

  <section class="section blanco" data-aos="fade-up" data-aos-once="true">
    <h2>TE INVITO A FESTEJAR ESTA NOCHE <strong>¡IRREPETIBLE!</strong></h2>
  </section>

  <section class="section bordo" data-aos="fade-up" data-aos-once="true">
    <h2>QUIERO VER TUS FOTOS</h2>
    <p>SUBÍ TUS FOTOS DEL EVENTO A MI ÁLBUM COMPARTIDO</p>
    <a class="btn" id="photosAlbumLink" href="#" target="_blank" rel="noopener noreferrer">IR AL ÁLBUM</a>
  </section>

  <section class="section blanco" data-aos="fade-up" data-aos-once="true">
    <h2>REGALOS</h2>
    <p>LOS REGALOS SE RECIBEN EN LA URNA DEL SALÓN</p>
  </section>

  <section class="section bordo" data-aos="fade-up" data-aos-once="true">
    <h2>CONFIRMÁ TU ASISTENCIA</h2>
    <form id="rsvpForm">
      <div>
        <label for="rsvpNombre">NOMBRE</label>
        <input id="rsvpNombre" name="nombre" type="text" required>
      </div>
      <div>
        <label for="rsvpCantidad">CANTIDAD DE PERSONAS</label>
        <input id="rsvpCantidad" name="cantidad" type="number" min="1" value="1" required>
      </div>
      <div class="radios">
        <label><input type="radio" name="confirma" value="si" checked> ¡CONFIRMO!</label>
        <label><input type="radio" name="confirma" value="no"> NO PODRÉ ASISTIR</label>
      </div>
      <div>
        <label for="rsvpComentario">COMENTARIO (OPCIONAL)</label>
        <textarea id="rsvpComentario" name="comentario" rows="3"></textarea>
      </div>
      <button type="submit" class="btn">CONFIRMAR</button>
      <p id="rsvpFeedback" aria-live="polite"></p>
    </form>
  </section>

  <footer id="footer">
    MIS XV SOFI · 9 DE OCTUBRE 2026
  </footer>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.1/aos.js" defer></script>
  <script src="https://www.youtube.com/iframe_api"></script>
  <script src="assets/js/countdown.js" defer></script>
  <script src="assets/js/rsvp.js" defer></script>
  <script src="assets/js/gate.js" defer></script>
  <script src="assets/js/music.js" defer></script>
  <script src="assets/js/rsvp-form.js" defer></script>
  <script src="assets/js/main.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Verificación manual**

Abrir `index.html` directamente en un navegador (doble click o `file:///.../index.html`). Confirmar:
- No hay errores 404 en la consola para `styles.css` ni para los `.js` (van a estar vacíos, pero deben cargar con status 200).
- Se ve el texto de la pantalla de entrada ("MIS XV SOFI", el mensaje, el botón "INGRESAR") sin estilos (sin CSS todavía es esperado).
- Debajo (sin scroll animado todavía) están todas las secciones con su texto: ¿CUÁNDO?, ¿DÓNDE?, la frase, fotos, regalos, RSVP, footer.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add full page markup with real content"
```

---

### Task 3: Estilos base mobile-first

**Files:**
- Modify: `assets/css/styles.css` (reemplaza el archivo vacío del Task 1)

**Interfaces:**
- Consumes: los ids/clases producidos en Task 2 (`#gate`, `#hero`, `.section.blanco`, `.section.bordo`, `#musicToggle`, `#rsvpForm`, etc).
- Produces: nada que otras tareas de JS consuman directamente (es solo presentación), salvo la clase `.show` (usada por `gate.js` en Task 6) y la clase `.visible` (usada por `music.js` en Task 8), que deben quedar definidas acá.

- [ ] **Step 1: Escribir el CSS completo**

Reemplazar todo el contenido de `assets/css/styles.css` con:

```css
:root {
  --color-bordo: #6d2130;
  --color-bordo-oscuro: #4a1620;
  --color-blanco: #ffffff;
  --font-principal: 'Montserrat', Arial, sans-serif;
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  font-family: var(--font-principal);
  text-transform: uppercase;
  background: var(--color-blanco);
  overflow-x: hidden;
}

/* Pantalla de entrada */
#gate {
  position: fixed;
  inset: 0;
  background: var(--color-blanco);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 0 32px;
  text-align: center;
  transition: opacity .5s ease;
}
#gate h1, #gate p, #gate button {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity .8s ease, transform .8s ease;
}
#gate h1.show, #gate p.show, #gate button.show {
  opacity: 1;
  transform: translateY(0);
}
#gate h1 {
  color: var(--color-bordo);
  font-size: 1.8rem;
  letter-spacing: 1px;
  margin: 0 0 16px;
  font-weight: 700;
}
#gate p {
  color: var(--color-bordo);
  font-size: .85rem;
  letter-spacing: .5px;
  line-height: 1.6;
  margin: 0 0 28px;
  font-weight: 400;
}
#gate button {
  background: var(--color-bordo);
  color: var(--color-blanco);
  border: none;
  padding: 14px 32px;
  font-size: 1rem;
  letter-spacing: 1px;
  cursor: pointer;
  font-family: inherit;
}

/* Hero */
#hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--color-blanco);
  background-image: linear-gradient(180deg, rgba(30,8,15,.55), rgba(74,22,32,.8)), url('../img/hero.jpg');
  background-size: cover;
  background-position: center;
  padding: 24px;
}
#hero h1 {
  font-size: 2.2rem;
  font-weight: 400;
  letter-spacing: 2px;
  margin: 0 0 28px;
}
#hero h1 strong { font-weight: 700; }

.countdown { display: flex; gap: 14px; }
.countdown .box { text-align: center; min-width: 52px; }
.countdown .num { display: block; font-size: 1.8rem; font-weight: 700; }
.countdown .lbl { font-size: .62rem; letter-spacing: 1px; opacity: .85; }

/* Secciones alternadas */
.section { padding: 56px 24px; text-align: center; }
.section.blanco { background: var(--color-blanco); color: var(--color-bordo); }
.section.bordo { background: var(--color-bordo); color: var(--color-blanco); }
.section h2 { font-size: 1rem; letter-spacing: 1.5px; margin: 0 0 14px; font-weight: 700; }
.section p { font-size: .85rem; line-height: 1.6; margin: 0; font-weight: 400; }
.section .btn {
  display: inline-block;
  margin-top: 20px;
  border: 1px solid currentColor;
  padding: 12px 28px;
  font-size: .75rem;
  letter-spacing: 1.5px;
  text-decoration: none;
  color: inherit;
  background: none;
  font-family: inherit;
  cursor: pointer;
}

/* RSVP */
#rsvpForm {
  max-width: 320px;
  margin: 24px auto 0;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
#rsvpForm label { font-size: .7rem; letter-spacing: 1px; display: block; margin-bottom: 6px; }
#rsvpForm input, #rsvpForm textarea {
  width: 100%;
  padding: 10px;
  border: none;
  font-family: inherit;
  font-size: .85rem;
  text-transform: none;
}
#rsvpForm .radios { display: flex; gap: 16px; text-transform: none; font-size: .8rem; }
#rsvpFeedback { margin-top: 14px; font-size: .8rem; }

/* Footer */
#footer {
  background: var(--color-bordo-oscuro);
  color: var(--color-blanco);
  text-align: center;
  padding: 32px 24px;
  font-size: .75rem;
  letter-spacing: 1px;
}

/* Botón flotante de música */
#musicToggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--color-bordo);
  color: var(--color-blanco);
  border: none;
  display: none;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  z-index: 90;
  cursor: pointer;
}
#musicToggle.visible { display: flex; }

@media (min-width: 768px) {
  #gate h1 { font-size: 2.4rem; }
  #hero h1 { font-size: 3rem; }
  .section { padding: 80px 24px; max-width: 720px; margin-left: auto; margin-right: auto; }
}
```

- [ ] **Step 2: Verificación manual**

Abrir `index.html` en el navegador con las herramientas de desarrollador en modo responsive a ~390px de ancho. Confirmar:
- La pantalla de entrada se ve centrada, fondo blanco, texto bordó (aunque invisible por `opacity:0` hasta que `gate.js` exista — eso es esperado en este punto, se resuelve en Task 6).
- Si se fuerza temporalmente `opacity:1` desde el inspector en `#gate h1`, se ve la tipografía Montserrat en bordó.
- Las secciones debajo alternan fondo blanco/texto bordó y fondo bordó/texto blanco correctamente.

- [ ] **Step 3: Commit**

```bash
git add assets/css/styles.css
git commit -m "feat: add mobile-first styles with bordo/blanco alternating sections"
```

---

### Task 4: Lógica pura del countdown (TDD)

**Files:**
- Modify: `assets/js/countdown.js`
- Test: `tests/countdown.test.js`

**Interfaces:**
- Produces: `getTimeRemaining(targetDate: Date, now: Date) -> { total: number, days: number, hours: number, minutes: number, seconds: number }` y `formatTwoDigits(value: number) -> string`. Ambas exportadas también vía `module.exports` para Node.
- Consumes: nada.

- [ ] **Step 1: Escribir los tests (deben fallar)**

Reemplazar `tests/countdown.test.js` con:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const { getTimeRemaining, formatTwoDigits } = require('../assets/js/countdown.js');

test('getTimeRemaining calcula dias, horas, minutos y segundos exactos', () => {
  const now = new Date('2026-01-01T00:00:00-03:00');
  const target = new Date('2026-01-03T02:03:04-03:00');
  const result = getTimeRemaining(target, now);
  assert.equal(result.days, 2);
  assert.equal(result.hours, 2);
  assert.equal(result.minutes, 3);
  assert.equal(result.seconds, 4);
});

test('getTimeRemaining devuelve todo en cero cuando la fecha ya paso', () => {
  const now = new Date('2026-10-10T00:00:00-03:00');
  const target = new Date('2026-10-09T21:00:00-03:00');
  const result = getTimeRemaining(target, now);
  assert.deepEqual(result, { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
});

test('formatTwoDigits agrega cero a la izquierda para numeros de un digito', () => {
  assert.equal(formatTwoDigits(4), '04');
  assert.equal(formatTwoDigits(23), '23');
});
```

- [ ] **Step 2: Correr los tests para confirmar que fallan**

```bash
node --test tests/countdown.test.js
```

Expected: FAIL — `TypeError: Cannot read properties of undefined` o `Cannot find module` porque `countdown.js` está vacío y no exporta nada todavía.

- [ ] **Step 3: Implementar `countdown.js`**

Reemplazar `assets/js/countdown.js` con:

```js
function getTimeRemaining(targetDate, now) {
  var total = targetDate.getTime() - now.getTime();
  if (total <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  var days = Math.floor(total / (1000 * 60 * 60 * 24));
  var hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  var minutes = Math.floor((total / (1000 * 60)) % 60);
  var seconds = Math.floor((total / 1000) % 60);
  return { total: total, days: days, hours: hours, minutes: minutes, seconds: seconds };
}

function formatTwoDigits(value) {
  return String(value).padStart(2, '0');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getTimeRemaining: getTimeRemaining, formatTwoDigits: formatTwoDigits };
}
```

- [ ] **Step 4: Correr los tests para confirmar que pasan**

```bash
node --test tests/countdown.test.js
```

Expected: PASS — salida termina con `# fail 0`.

- [ ] **Step 5: Commit**

```bash
git add assets/js/countdown.js tests/countdown.test.js
git commit -m "feat: add pure countdown calculation logic with tests"
```

---

### Task 5: Wiring del countdown en vivo y animaciones AOS

**Files:**
- Modify: `assets/js/main.js`

**Interfaces:**
- Consumes: `getTimeRemaining`, `formatTwoDigits` (Task 4, globales por `<script>` sin módulos), `CONFIG.eventDate` y `CONFIG.googlePhotosAlbumUrl` (Task 2), ids `#countDays/#countHours/#countMinutes/#countSeconds` y `#photosAlbumLink` (Task 2), global `AOS` (cargado por CDN en Task 2).
- Produces: nada que otras tareas consuman (es el punto de arranque final de la página).

- [ ] **Step 1: Escribir `main.js`**

Reemplazar `assets/js/main.js` con:

```js
document.addEventListener('DOMContentLoaded', function () {
  AOS.init({ duration: 400, once: true });

  var photosLink = document.getElementById('photosAlbumLink');
  if (photosLink) {
    photosLink.href = CONFIG.googlePhotosAlbumUrl;
  }

  var targetDate = new Date(CONFIG.eventDate);
  var dayEl = document.getElementById('countDays');
  var hourEl = document.getElementById('countHours');
  var minEl = document.getElementById('countMinutes');
  var secEl = document.getElementById('countSeconds');

  function renderCountdown() {
    var remaining = getTimeRemaining(targetDate, new Date());
    dayEl.textContent = remaining.days;
    hourEl.textContent = formatTwoDigits(remaining.hours);
    minEl.textContent = formatTwoDigits(remaining.minutes);
    secEl.textContent = formatTwoDigits(remaining.seconds);
  }

  renderCountdown();
  setInterval(renderCountdown, 1000);
});
```

- [ ] **Step 2: Verificación manual**

Abrir `index.html` en el navegador (herramientas de desarrollador abiertas, sin errores en consola). Confirmar:
- Los números del countdown en el hero cambian cada segundo.
- El botón "IR AL ÁLBUM" apunta a la URL de `CONFIG.googlePhotosAlbumUrl` (verificable inspeccionando el elemento).
- Al scrollear, cada sección (`.section`) aparece con un fade-up suave la primera vez que entra en pantalla, y no se repite si se vuelve a scrollear hacia arriba y abajo.

- [ ] **Step 3: Commit**

```bash
git add assets/js/main.js
git commit -m "feat: wire live countdown rendering and AOS scroll animations"
```

---

### Task 6: Pantalla de entrada (gate) con animación escalonada

**Files:**
- Modify: `assets/js/gate.js`

**Interfaces:**
- Consumes: ids `#gateTitle`, `#gateMessage`, `#enterButton`, `#gate` (Task 2), clase CSS `.show` (Task 3).
- Produces: evento personalizado `siteEntered` disparado en `document.body` cuando el usuario toca "INGRESAR" — lo consume `music.js` (Task 8).

- [ ] **Step 1: Escribir `gate.js`**

Reemplazar `assets/js/gate.js` con:

```js
document.addEventListener('DOMContentLoaded', function () {
  var title = document.getElementById('gateTitle');
  var message = document.getElementById('gateMessage');
  var button = document.getElementById('enterButton');
  var gate = document.getElementById('gate');

  setTimeout(function () { title.classList.add('show'); }, 300);
  setTimeout(function () { message.classList.add('show'); }, 900);
  setTimeout(function () { button.classList.add('show'); }, 1500);

  button.addEventListener('click', function () {
    gate.style.opacity = '0';
    setTimeout(function () {
      gate.style.display = 'none';
      document.body.dispatchEvent(new CustomEvent('siteEntered'));
    }, 500);
  });
});
```

- [ ] **Step 2: Verificación manual**

Recargar `index.html`. Confirmar:
- El título aparece primero (fade + slide-up), luego el mensaje, luego el botón, en ese orden y con esa cadencia (~0.3s, 0.9s, 1.5s).
- Al tocar "INGRESAR", la pantalla de entrada se desvanece y desaparece, dejando ver el hero con el countdown.

- [ ] **Step 3: Commit**

```bash
git add assets/js/gate.js
git commit -m "feat: add staggered entry gate animation and enter interaction"
```

---

### Task 7: Música de fondo (YouTube oculto) y botón flotante

**Files:**
- Modify: `assets/js/music.js`

**Interfaces:**
- Consumes: evento `siteEntered` (Task 6), `CONFIG.youtubeVideoId` (Task 2), id `#youtubePlayer` y `#musicToggle` (Task 2), clase CSS `.visible` (Task 3), global `YT` (cargado por `https://www.youtube.com/iframe_api` en Task 2, que llama a `onYouTubeIframeAPIReady` cuando está listo).
- Produces: nada que otras tareas consuman.

- [ ] **Step 1: Escribir `music.js`**

Reemplazar `assets/js/music.js` con:

```js
var ytPlayer = null;
var isMusicPlaying = false;

function onYouTubeIframeAPIReady() {
  ytPlayer = new YT.Player('youtubePlayer', {
    height: '1',
    width: '1',
    videoId: CONFIG.youtubeVideoId,
    playerVars: { autoplay: 0, rel: 0, playsinline: 1 }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('musicToggle');

  document.body.addEventListener('siteEntered', function () {
    toggle.classList.add('visible');
    toggle.textContent = '❙❙';
    isMusicPlaying = true;
    if (ytPlayer && ytPlayer.playVideo) {
      ytPlayer.playVideo();
    }
  });

  toggle.addEventListener('click', function () {
    if (!ytPlayer) return;
    if (isMusicPlaying) {
      ytPlayer.pauseVideo();
      toggle.textContent = '▶';
    } else {
      ytPlayer.playVideo();
      toggle.textContent = '❙❙';
    }
    isMusicPlaying = !isMusicPlaying;
  });
});
```

- [ ] **Step 2: Verificación manual**

Con un `CONFIG.youtubeVideoId` real temporal (cualquier video de YouTube para probar), recargar la página y tocar "INGRESAR". Confirmar:
- Aparece el botón circular flotante abajo a la derecha.
- Se escucha el audio del video (sin verse ningún reproductor visible).
- Tocar el botón pausa/reanuda el audio y cambia el ícono entre `❙❙` y `▶`.

- [ ] **Step 3: Commit**

```bash
git add assets/js/music.js
git commit -m "feat: add hidden YouTube background music with floating toggle"
```

---

### Task 8: Lógica pura de validación de RSVP (TDD)

**Files:**
- Modify: `assets/js/rsvp.js`
- Test: `tests/rsvp.test.js`

**Interfaces:**
- Produces: `validateRsvp(formValues: {nombre, cantidad, confirma, comentario}) -> {ok: false, errors: string[]} | {ok: true, payload: {nombre, cantidad, confirma, comentario, timestamp}}`. Exportada también vía `module.exports`.
- Consumes: nada.

- [ ] **Step 1: Escribir los tests (deben fallar)**

Reemplazar `tests/rsvp.test.js` con:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const { validateRsvp } = require('../assets/js/rsvp.js');

test('validateRsvp acepta datos completos y devuelve el payload normalizado', () => {
  const result = validateRsvp({ nombre: '  Ana Perez  ', cantidad: '2', confirma: 'si', comentario: '  Que emocion!  ' });
  assert.equal(result.ok, true);
  assert.equal(result.payload.nombre, 'Ana Perez');
  assert.equal(result.payload.cantidad, 2);
  assert.equal(result.payload.confirma, 'si');
  assert.equal(result.payload.comentario, 'Que emocion!');
  assert.equal(typeof result.payload.timestamp, 'string');
});

test('validateRsvp rechaza cuando falta el nombre', () => {
  const result = validateRsvp({ nombre: '   ', cantidad: '1', confirma: 'si' });
  assert.equal(result.ok, false);
  assert.deepEqual(result.errors, ['nombre']);
});

test('validateRsvp rechaza cantidad invalida', () => {
  const result = validateRsvp({ nombre: 'Ana', cantidad: '0', confirma: 'no' });
  assert.equal(result.ok, false);
  assert.deepEqual(result.errors, ['cantidad']);
});

test('validateRsvp rechaza cuando no se eligio confirma', () => {
  const result = validateRsvp({ nombre: 'Ana', cantidad: '1', confirma: '' });
  assert.equal(result.ok, false);
  assert.deepEqual(result.errors, ['confirma']);
});
```

- [ ] **Step 2: Correr los tests para confirmar que fallan**

```bash
node --test tests/rsvp.test.js
```

Expected: FAIL porque `rsvp.js` está vacío y no exporta `validateRsvp`.

- [ ] **Step 3: Implementar `rsvp.js`**

Reemplazar `assets/js/rsvp.js` con:

```js
function validateRsvp(formValues) {
  var errors = [];
  var nombre = (formValues.nombre || '').trim();
  if (!nombre) errors.push('nombre');

  var cantidad = Number(formValues.cantidad);
  if (!Number.isInteger(cantidad) || cantidad < 1) errors.push('cantidad');

  if (formValues.confirma !== 'si' && formValues.confirma !== 'no') errors.push('confirma');

  if (errors.length > 0) {
    return { ok: false, errors: errors };
  }

  return {
    ok: true,
    payload: {
      nombre: nombre,
      cantidad: cantidad,
      confirma: formValues.confirma,
      comentario: (formValues.comentario || '').trim(),
      timestamp: new Date().toISOString()
    }
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { validateRsvp: validateRsvp };
}
```

- [ ] **Step 4: Correr los tests para confirmar que pasan**

```bash
node --test tests/rsvp.test.js
```

Expected: PASS — salida termina con `# fail 0`.

- [ ] **Step 5: Commit**

```bash
git add assets/js/rsvp.js tests/rsvp.test.js
git commit -m "feat: add pure rsvp validation logic with tests"
```

---

### Task 9: Wiring del formulario RSVP (fetch al Apps Script)

**Files:**
- Modify: `assets/js/rsvp-form.js`

**Interfaces:**
- Consumes: `validateRsvp` (Task 8), `CONFIG.googleAppsScriptUrl` (Task 2), id `#rsvpForm` (con campos `nombre`, `cantidad`, radios `confirma`, `comentario`) y `#rsvpFeedback` (Task 2).
- Produces: nada que otras tareas consuman.

- [ ] **Step 1: Escribir `rsvp-form.js`**

Reemplazar `assets/js/rsvp-form.js` con:

```js
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('rsvpForm');
  var feedback = document.getElementById('rsvpFeedback');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var confirmaInput = form.querySelector('input[name="confirma"]:checked');

    var result = validateRsvp({
      nombre: form.nombre.value,
      cantidad: form.cantidad.value,
      confirma: confirmaInput ? confirmaInput.value : '',
      comentario: form.comentario.value
    });

    if (!result.ok) {
      feedback.textContent = 'Revisá los campos obligatorios (nombre, cantidad y confirmación).';
      return;
    }

    feedback.textContent = 'Enviando...';

    fetch(CONFIG.googleAppsScriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(result.payload)
    })
      .then(function () {
        feedback.textContent = '¡Confirmación recibida! Gracias.';
        form.reset();
      })
      .catch(function () {
        feedback.textContent = 'No pudimos enviar tu confirmación. Probá de nuevo en un momento.';
      });
  });
});
```

- [ ] **Step 2: Verificación manual (parcial, sin backend real todavía)**

Recargar la página, completar el formulario de RSVP y enviarlo. Con `CONFIG.googleAppsScriptUrl` todavía en su valor placeholder, confirmar en la pestaña Network del navegador que:
- Se dispara una petición `POST` hacia esa URL (aunque falle por no existir todavía).
- Si se deja algún campo obligatorio vacío, aparece el mensaje de error sin llegar a hacer la petición.

La verificación end-to-end completa (fila real en la Sheet) se hace en Task 11, una vez que exista el Apps Script real.

- [ ] **Step 3: Commit**

```bash
git add assets/js/rsvp-form.js
git commit -m "feat: wire rsvp form submission to google apps script"
```

---

### Task 10: Google Apps Script para guardar RSVPs en Sheets

**Files:**
- Create: `google-apps-script/Code.gs`

**Interfaces:**
- Consumes: el `payload` JSON enviado por `rsvp-form.js` (Task 9): `{nombre, cantidad, confirma, comentario, timestamp}`.
- Produces: filas en la Google Sheet asociada.

- [ ] **Step 1: Escribir `Code.gs`**

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Fecha', 'Nombre', 'Cantidad', 'Confirma', 'Comentario']);
  }

  sheet.appendRow([
    new Date(),
    data.nombre,
    data.cantidad,
    data.confirma,
    data.comentario
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

- [ ] **Step 2: Crear la Google Sheet y desplegar el script**

1. Crear una Google Sheet nueva en sheets.google.com (por ejemplo, llamada "RSVP Sofía 15").
2. Ir a **Extensiones → Apps Script**.
3. Borrar el contenido de `Code.gs` que abre por defecto y pegar el código del Step 1.
4. Guardar el proyecto (ícono de disco, nombrarlo "RSVP Sofía").
5. Ir a **Implementar → Nueva implementación**.
6. Tipo: **Aplicación web**. Ejecutar como: **Yo**. Quién tiene acceso: **Cualquier usuario**.
7. Implementar y autorizar los permisos que pida Google (es tu propia cuenta, es esperado).
8. Copiar la **URL de la aplicación web** que se genera (termina en `/exec`).

- [ ] **Step 3: Pegar la URL real en `index.html`**

En `index.html` (Task 2), reemplazar el valor `'https://script.google.com/macros/s/REEMPLAZAR_CON_TU_ID/exec'` de `CONFIG.googleAppsScriptUrl` por la URL real copiada en el Step 2.

- [ ] **Step 4: Verificación end-to-end**

Recargar `index.html`, completar y enviar el formulario de RSVP. Confirmar:
- Aparece el mensaje "¡Confirmación recibida! Gracias.".
- En la Google Sheet aparece una nueva fila con fecha, nombre, cantidad, confirma y comentario correctos (la primera vez también aparece la fila de encabezados).

- [ ] **Step 5: Commit**

```bash
git add google-apps-script/Code.gs index.html
git commit -m "feat: add google apps script backend for rsvp storage"
```

---

### Task 11: Configuración final de assets pendientes

**Files:**
- Modify: `index.html` (valores de `CONFIG`)
- Create: `assets/img/hero.jpg` (foto real de Sofía, provista por el usuario)

**Interfaces:**
- Consumes: nada nuevo — solo completa valores que Tasks 2, 5, 7 y 9 ya usan.

- [ ] **Step 1: Foto de fondo del hero**

Conseguir una foto de Sofía en formato horizontal (apaisada), buena resolución pero no excesiva (idealmente ≤500KB para que cargue rápido en el celular), y guardarla como `assets/img/hero.jpg`. El CSS del Task 3 ya la referencia en `#hero { background-image: ... url('../img/hero.jpg'); }` — no requiere ningún otro cambio de código.

- [ ] **Step 2: Álbum de Google Photos**

1. Crear un álbum nuevo en Google Photos (photos.google.com).
2. Activar "Colaborativo" para que los invitados puedan agregar sus propias fotos.
3. Copiar el link para compartir.
4. En `index.html`, reemplazar el valor de `CONFIG.googlePhotosAlbumUrl` por ese link.

- [ ] **Step 3: Video/canción de fondo**

1. Elegir el video de YouTube de la canción deseada.
2. De la URL del video (`https://www.youtube.com/watch?v=XXXXXXXXXXX`), copiar el ID (los 11 caracteres después de `v=`).
3. En `index.html`, reemplazar el valor de `CONFIG.youtubeVideoId` por ese ID.

- [ ] **Step 4: Verificación manual**

Recargar `index.html` y confirmar:
- El hero muestra la foto real de Sofía de fondo (con el overlay bordó encima, texto legible).
- El botón "IR AL ÁLBUM" abre el álbum de Google Photos real.
- Al tocar "INGRESAR" se escucha la canción elegida.

- [ ] **Step 5: Commit**

```bash
git add index.html assets/img/hero.jpg
git commit -m "chore: set final config values (hero photo, photos album, music)"
```

---

### Task 12: Deploy a Vercel

**Files:**
- Create: `README.md`

**Interfaces:**
- Consumes: el proyecto completo de las tareas anteriores.

- [ ] **Step 1: Escribir `README.md`**

```markdown
# Invitación XV Sofía

Sitio estático de una sola página para la invitación de los XV años de Sofía (9 de octubre de 2026).

## Desarrollo local

Abrir `index.html` directamente en el navegador. No requiere build ni servidor.

## Tests

Requiere Node.js >= 18.

```bash
node --test tests/
```

## Configuración

Los valores editables están en el objeto `CONFIG` dentro de `index.html`:
- `eventDate`: fecha y hora del evento (ISO con offset de Argentina, `-03:00`).
- `googlePhotosAlbumUrl`: link del álbum colaborativo de Google Photos.
- `googleAppsScriptUrl`: URL de la implementación del Apps Script (ver `google-apps-script/Code.gs`).
- `youtubeVideoId`: ID del video de YouTube usado como música de fondo.

## Deploy

Conectado a Vercel (plan free) para deploy automático en cada push a `main`.
```

- [ ] **Step 2: Crear el repositorio en GitHub**

1. Crear un repositorio nuevo y vacío en GitHub (por ejemplo `cumple-sofia-15`), sin inicializarlo con README (ya existe uno local).
2. Conectar el repo local:

```bash
git remote add origin https://github.com/<tu-usuario>/cumple-sofia-15.git
git branch -M main
git push -u origin main
```

Expected: el push termina sin errores y el código aparece en GitHub.

- [ ] **Step 3: Conectar Vercel**

1. Entrar a vercel.com e iniciar sesión (se puede con la cuenta de GitHub).
2. **Add New → Project**, elegir el repositorio `cumple-sofia-15`.
3. Framework Preset: **Other** (sitio estático, sin build). Build Command: vacío. Output Directory: `.` (raíz).
4. Deploy.

- [ ] **Step 4: Verificación en producción**

1. Abrir la URL que asigna Vercel (tipo `cumple-sofia-15.vercel.app`) desde un teléfono real (iOS y Android si es posible), conectado a datos móviles (no a la red de esta PC).
2. Confirmar: pantalla de entrada con animación escalonada, click en "INGRESAR" revela el hero con foto y countdown, el audio arranca, el scroll revela cada sección una sola vez, el botón "CÓMO LLEGAR" abre Maps, "IR AL ÁLBUM" abre Google Photos, y el envío de un RSVP de prueba efectivamente agrega una fila a la Google Sheet.
3. Si algo no funciona igual que en local (por ejemplo, el audio no arranca en iOS Safari), confirmarlo específicamente tocando "INGRESAR" de nuevo — iOS a veces requiere el gesto directamente sobre el elemento que dispara el audio, lo cual ya está cubierto porque el `play` ocurre dentro del mismo handler de click del botón.

- [ ] **Step 5: Commit y push final**

```bash
git add README.md
git commit -m "docs: add setup and deploy instructions"
git push
```

---

## Resumen de verificación final

- [ ] `node --test tests/` pasa sin fallos.
- [ ] El sitio abre correctamente en un celular real (iOS y Android), fuera de la red de la PC de desarrollo.
- [ ] El countdown nunca muestra la fecha, solo días/horas/minutos/segundos.
- [ ] Cada sección hace fade-up una sola vez al scrollear.
- [ ] El audio arranca solo después de tocar "INGRESAR".
- [ ] Un RSVP de prueba aparece como fila nueva en la Google Sheet.
