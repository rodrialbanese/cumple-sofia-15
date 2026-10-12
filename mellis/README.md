# Invitación — Mellis

Sitio estático de una sola página para la tarjeta de invitación online. Boilerplate copiado de la
estructura de `cumple-sofia-15` (misma lógica de countdown, gate de entrada, RSVP y música),
con paleta de colores y contenido pendientes de definir.

## Desarrollo local

Abrir `index.html` directamente en el navegador. No requiere build ni servidor.

Esta invitación **no** tiene botón "Cómo llegar", sección de Dress Code ni sección de Regalo —
se sacaron del boilerplate original a pedido.

## Pendiente de definir

- [x] Paleta de colores (`assets/css/styles.css`) — tema plateado
- [x] Nombre, ocasión, fecha y lugar del evento
- [x] `CONFIG.eventDate` en `index.html`
- [x] `CONFIG.googlePhotosAlbumUrl` (álbum colaborativo de Google Photos)
- [x] `CONFIG.googleAppsScriptUrl` — RSVP conectado a la Google Sheet
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
dentro del mismo repo de GitHub (`cumple-sofia-15`), con su propio dominio.

## Nota de seguridad

Igual que en el proyecto principal: el Web App de Apps Script con acceso "Cualquier usuario" es un
endpoint de escritura sin autenticación. Aceptable para un evento privado y chico, pero tenerlo
presente.
