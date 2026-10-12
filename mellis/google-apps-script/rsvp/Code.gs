function getOrCreateSheet(name, headerRow) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headerRow);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(headerRow);
  }
  return sheet;
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);

  var rsvpSheet = getOrCreateSheet('RSVP', ['Fecha', 'Nombre', 'Apellido', 'Cantidad', 'Confirma', 'Comentario']);
  rsvpSheet.appendRow([
    new Date(),
    data.nombre,
    data.apellido,
    data.cantidad,
    data.confirma,
    data.comentario
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
