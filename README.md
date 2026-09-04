# Invitación XV Sofía

Sitio estático de una sola página para la invitación de los XV años de Sofía (9 de octubre de 2026).

## Desarrollo local

Abrir `index.html` directamente en el navegador. No requiere build ni servidor.

## Tests

Requiere Node.js >= 18.

```bash
node --test
```

## Configuración

Los valores editables están en el objeto `CONFIG` dentro de `index.html`:
- `eventDate`: fecha y hora del evento (ISO con offset de Argentina, `-03:00`).
- `googlePhotosAlbumUrl`: link del álbum colaborativo de Google Photos.
- `googleAppsScriptUrl`: URL de la implementación del Apps Script (ver `google-apps-script/Code.gs`).
- `youtubeVideoId`: ID del video de YouTube usado como música de fondo.

> **Nota:** el mensaje "¡Confirmación recibida! Gracias." que ve el usuario al confirmar solo indica que la solicitud se envió (el `fetch` usa `mode: 'no-cors'`, por lo que la respuesta del servidor es opaca y no se puede inspeccionar). No confirma que la fila realmente se haya guardado en la Google Sheet. Después de cada prueba de envío, verificá siempre directamente en la Sheet que la fila haya llegado.

> **Nota de seguridad:** el Web App de Apps Script, una vez implementado con acceso "Cualquier usuario", es un endpoint de escritura sin autenticación: cualquiera que tenga la URL podría enviar filas. Para un evento privado y chico es un compromiso aceptable, pero es bueno tenerlo presente.

## Deploy

Publicado en Vercel (plan free), conectado a [github.com/rodrialbanese/cumple-sofia-15](https://github.com/rodrialbanese/cumple-sofia-15) — cada push a `main` dispara un deploy automático.

**URL en producción:** https://cumple-sofia-15.vercel.app/
