# Invitación digital — XV años de Sofía

## Contexto

Invitación web para un evento único: los XV años de Sofía, 09/10/2026, 21:00 hs, salón Lola Mora (España 746). No es un sistema multi-evento — es un sitio de una sola página, hecho a medida para este cumpleaños puntual, sin panel de administración ni reutilización prevista para otros eventos.

Referencias estudiadas:
- `latarjetadigital.app/pili-15s/` — plugin propio de WordPress ("La Tarjeta Digital"). Se obtuvo el HTML/CSS/JS real de la pantalla de entrada, el bloque de countdown, el patrón de secciones con info-boxes, la animación de scroll (librería **AOS**), y el mecanismo de música (iframe de YouTube oculto disparado por click). Este es el patrón que se replica, recoloreado a bordó/blanco.
- `invitaciondigital.top/5592-cumple-de-paulina` — sitio exportado desde Canva Sites. Se descartó como referencia de implementación (no da control de código); solo aportó la idea de countdown + formulario + mapa.

## Datos del evento

- Nombre: Sofía, cumple 15 años.
- Fecha/hora: 9 de octubre de 2026, 21:00 hs.
- Lugar: Salón Lola Mora, España 746.
- Regalos: se reciben en una urna en el salón (sin datos bancarios).
- Música: se define más adelante (pendiente elegir el video de YouTube).
- Dominio: no se compra dominio propio — se usa el subdominio gratuito que asigna Vercel.

## Arquitectura

- Sitio estático de una sola página: `index.html` + `styles.css` + `script.js` + carpeta `assets/` (fotos de Sofía, ícono/favicon). Sin build step, sin framework.
- Librería externa: **AOS** (Animate On Scroll, vía CDN) para las animaciones de entrada de cada sección al hacer scroll.
- Fuente: **Montserrat** (400/700, vía Google Fonts), todo el texto en mayúsculas.
- Repo en GitHub, deploy automático a **Vercel** (plan free). Sin dominio propio → URL tipo `sofia-15.vercel.app`.
- Único punto dinámico: el envío del formulario de RSVP, que hace un `fetch` directo desde el navegador a un **Google Apps Script Web App** (sin backend propio).
- Diseño **mobile-first**: se diseña primero para ~375-430px de ancho y se adapta hacia arriba.

## Estructura de la página (orden de scroll)

1. **Pantalla de entrada (gate)** — fondo blanco, texto bordó (`#6d2130`). Título "MIS XV SOFI", texto "Quiero que seas parte de este momento tan importante para mí", botón "INGRESAR". Los tres elementos aparecen con fade + slide-up escalonado (título a los 0.3s, texto a los 0.9s, botón a los 1.5s), replicando el mecanismo exacto visto en el sitio de referencia (opacity/transform + clases `.show` agregadas por `setTimeout`).
2. **Hero** — se muestra al tocar "INGRESAR". Pantalla completa con foto de Sofía de fondo + overlay bordó semitransparente para legibilidad. Texto "MIS XV SOFI" + countdown (días / horas / minutos / segundos, **sin fecha visible**). En mobile ocupa el 100% del viewport: es lo único visible antes de scrollear.
3. **¿Cuándo?** — fondo blanco, texto bordó. "9 de Octubre 2026 · 21:00 hs".
4. **¿Dónde?** — fondo bordó, texto blanco. "Lola Mora — España 746" + botón "CÓMO LLEGAR" que abre Google Maps.
5. **Frase** — fondo blanco. "Te invito a festejar esta noche ¡irrepetible!".
6. **Fotos** — fondo bordó. "Subí tus fotos del evento a mi álbum compartido" + botón "IR AL ÁLBUM" (enlace a álbum de Google Photos).
7. **Regalos** — fondo blanco. "Los regalos se reciben en la urna del salón".
8. **RSVP** — fondo bordó. Formulario de confirmación (ver abajo) + botón "CONFIRMAR".
9. **Footer** — fondo bordó oscuro. Nombre del evento. El botón flotante de música (play/pause) queda visible de forma persistente desde que se toca "INGRESAR".

Las secciones 3 a 8 entran con animación AOS `fade-up`, disparada una sola vez la primera vez que entran en viewport (`data-aos-once="true"`).

## RSVP

Formulario único (no un formulario por invitado) con estos campos:
- Nombre
- Cantidad de personas
- Confirma / no confirma (radio: "¡CONFIRMO!" / "NO PODRÉ ASISTIR")
- Comentario libre (opcional)

Al enviar, un `fetch` en `script.js` postea los datos a un Google Apps Script Web App, que agrega una fila a una Google Sheet con columnas: fecha/hora de envío, nombre, cantidad, confirma sí/no, comentario. La Sheet la controla el usuario directamente (sin backend ni base de datos propia). El script y los pasos de configuración de la Sheet se entregan durante la implementación.

## Galería de fotos

Álbum de Google Photos compartido, creado aparte por el usuario. El sitio solo tiene un botón/enlace hacia ese álbum ("IR AL ÁLBUM"); no se implementa subida de archivos propia.

## Música de fondo

Mismo mecanismo que el sitio de referencia: un iframe de YouTube oculto (1×1 px, sin controles visibles) que arranca a reproducirse cuando el usuario toca "INGRESAR" (el audio se dispara por ese gesto, evitando el bloqueo de autoplay de iOS/Android). Aparece un botón flotante circular (bordó) de play/pause, visible de forma persistente después de entrar. El video/canción específica queda pendiente de que el usuario lo indique.

## Fuera de alcance

- Sistema multi-evento o reutilizable — es un sitio hecho a medida para este evento puntual.
- Dominio propio.
- Subida de fotos propia en el sitio (se usa Google Photos en su lugar).
- Datos bancarios para regalos (solo urna).
- Panel de administración para ver RSVPs — se consultan directo en la Google Sheet.

## Verificación

- Probar en un teléfono real (iOS Safari y Android Chrome) sobre el deploy de Vercel, no sobre el visor de mockups usado durante el diseño (que tuvo problemas de carga de scripts/CDN en red móvil, no representativos del sitio final).
- Confirmar que el countdown calcula bien la cuenta atrás contra la fecha real del evento.
- Confirmar que tocar "INGRESAR" dispara el audio en iOS Safari (política de autoplay más estricta).
- Enviar un RSVP de prueba y confirmar que aparece la fila en la Google Sheet.
- Revisar que las animaciones AOS solo se disparen una vez por sección al scrollear.
