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

function normalizeName(name) {
  return String(name || '').trim().toLowerCase();
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);

  if (data.tipo === 'trivia') {
    var triviaSheet = getOrCreateSheet('Trivia', ['Fecha', 'Nombre', 'Puntaje']);
    var target = normalizeName(data.nombre);
    var existingNames = triviaSheet.getDataRange().getValues().slice(1).map(function (row) {
      return normalizeName(row[1]);
    });
    // Ya jugó con este mismo nombre — ignoramos el reenvío y nos quedamos
    // con su primer resultado, en vez de agregar una fila duplicada.
    if (existingNames.indexOf(target) === -1) {
      triviaSheet.appendRow([new Date(), data.nombre, data.puntaje]);
    }
  } else {
    var rsvpSheet = getOrCreateSheet('RSVP', ['Fecha', 'Nombre', 'Apellido', 'Cantidad', 'Confirma', 'Comentario']);
    rsvpSheet.appendRow([
      new Date(),
      data.nombre,
      data.apellido,
      data.cantidad,
      data.confirma,
      data.comentario
    ]);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function triviaLeaderboardData() {
  var sheet = getOrCreateSheet('Trivia', ['Fecha', 'Nombre', 'Puntaje']);
  var rows = sheet.getDataRange().getValues();
  var entries = [];
  // rows[0] is the header row.
  for (var i = 1; i < rows.length; i++) {
    var fecha = rows[i][0];
    var nombre = rows[i][1];
    var puntaje = rows[i][2];
    if (nombre === '' || nombre === null) continue;
    entries.push({
      nombre: nombre,
      puntaje: puntaje,
      fecha: fecha instanceof Date ? fecha.getTime() : fecha
    });
  }
  // Mayor puntaje primero; a igual puntaje, quien envió antes.
  entries.sort(function (a, b) {
    if (b.puntaje !== a.puntaje) return b.puntaje - a.puntaje;
    return a.fecha - b.fecha;
  });
  return entries;
}

function doGet(e) {
  var payload = { ok: true };

  if (e.parameter.action === 'trivia-leaderboard') {
    payload = { ok: true, entries: triviaLeaderboardData() };
  }

  var json = JSON.stringify(payload);

  // Si viene ?callback=nombreDeFuncion, respondemos JSONP para poder leer
  // los datos desde el navegador sin chocar con CORS.
  if (e.parameter.callback) {
    return ContentService
      .createTextOutput(e.parameter.callback + '(' + json + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}
