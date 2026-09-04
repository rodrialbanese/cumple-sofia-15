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
