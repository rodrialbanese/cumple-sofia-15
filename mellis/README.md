# Invitación — Mellis (Cami y Fran, Nuestros XV)

Sitio estático de una sola página para la tarjeta de invitación online de Cami y Fran (14 de
noviembre 2026, Salón Comedor Chañarense). Mismo esqueleto que `cumple-sofia-15` (countdown, gate
de entrada, RSVP y música), con tema plateado y fondo de bolas de boliche.

## Desarrollo local

Abrir `index.html` directamente en el navegador. No requiere build ni servidor.

Esta invitación **no** tiene botón "Cómo llegar", sección de Dress Code ni sección de Regalo —
se sacaron del boilerplate original a pedido.

## Estado actual

- [x] Paleta de colores (`assets/css/styles.css`) — tema plateado
- [x] Nombre, ocasión, fecha y lugar del evento
- [x] `CONFIG.eventDate` en `index.html`
- [x] Hero con fondo `assets/img/bolas.jpg` (bolas de boliche)
- [x] Íconos animados (`assets/img/icons/*.webp`) recoloreados a plateado desde los de Sofi, uno
      por sección (bola, calendario, mapa, carpeta de fotos, sobre de RSVP)
- [x] `CONFIG.googlePhotosAlbumUrl` (álbum colaborativo de Google Photos)
- [x] `CONFIG.googleAppsScriptUrl` — RSVP conectado a su propia Google Sheet
- [x] `qr.html` + `qr.png` — pantalla/código QR para proyectar y que suban fotos al álbum
- [x] Pusheado a GitHub (`rodrialbanese/cumple-sofia-15`, carpeta `mellis/`)
- [ ] Deploy en Vercel — en curso, ver nota abajo
- [ ] `direccion` de "¿Dónde?" (ver `content.json`)
- [ ] Imágenes de fondo para las 4 esquinas de `#gate` (ver `.deco-water` en `styles.css`)
- [ ] `CONFIG.youtubeVideoId` (música de fondo); si se deja vacío, el botón de música se oculta solo

## RSVP: conectar la Google Sheet

La planilla destino ya existe: https://docs.google.com/spreadsheets/d/1SSfUtwNZTe20OQ4p8McJiIBDKzoYw9n_tBHVpe-ac_o
Falta atarle el script que recibe las confirmaciones del formulario:

1. Abrir esa Google Sheet.
2. Menú **Extensiones → Apps Script**.
3. Borrar el contenido del editor y pegar el de `google-apps-script/rsvp/Code.gs` de esta carpeta.
4. Guardar, y en **Implementar → Nueva implementación**: tipo "Aplicación web", ejecutar como "Yo",
   acceso "Cualquier usuario".
5. Autorizar los permisos que pida Google (son de esta misma cuenta/planilla).
6. Copiar la URL que termina en `/exec` y pegarla en `CONFIG.googleAppsScriptUrl` de `index.html`
   (y en `content.json`, campo `config.googleAppsScriptUrl`).

El script crea solo la hoja "RSVP" con las columnas (Fecha, Nombre, Apellido, Cantidad, Confirma,
Comentario) la primera vez que alguien confirma.

## Deploy

Pensado para desplegarse en Vercel como un proyecto nuevo con **Root Directory = `mellis`**,
dentro del mismo repo de GitHub (`cumple-sofia-15`), con su propio dominio (o un nombre elegido
dentro de `*.vercel.app`, vía Project Name).

**Traba conocida:** al importar el repo en Vercel, la carpeta `mellis` puede no aparecer en el
selector de Root Directory aunque ya esté pusheada a `main` (confirmado con `git ls-tree
origin/main`). Pendiente de resolver — probar escribiendo `mellis` a mano en el campo en vez de
navegarlo, revisar permisos del GitHub App de Vercel sobre este repo, o reintentar la importación
desde cero.

## Nota de seguridad

Igual que en el proyecto principal: el Web App de Apps Script con acceso "Cualquier usuario" es un
endpoint de escritura sin autenticación. Aceptable para un evento privado y chico, pero tenerlo
presente.
