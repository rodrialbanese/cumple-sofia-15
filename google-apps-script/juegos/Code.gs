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

  // El cliente puede mandar el mismo pedido dos veces por caminos
  // distintos (sendBeacon + fetch) casi al mismo tiempo. Sin esto, los
  // dos podrían leer la planilla "todavía no está" antes de que el otro
  // termine de escribir, y quedar duplicado. El lock serializa el
  // chequeo-y-escritura para que eso no pueda pasar.
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    if (data.tipo === 'trivia') {
      var triviaSheet = getOrCreateSheet('Trivia', ['Fecha', 'Nombre', 'Puntaje']);
      triviaSheet.appendRow([new Date(), data.nombre, data.puntaje]);
    } else if (data.tipo === 'live-control') {
      setLiveState({
        gameId: data.gameId,
        phase: data.phase,
        questionIndex: data.questionIndex,
        startedAt: data.startedAt
      });
    } else if (data.tipo === 'live-join') {
      var playersSheet = getOrCreateSheet('LiveJugadores', ['Fecha', 'GameId', 'Nombre']);
      var already = playersSheet.getDataRange().getValues().slice(1).some(function (row) {
        return String(row[1]) === String(data.gameId) && row[2] === data.nombre;
      });
      if (!already) {
        playersSheet.appendRow([new Date(), data.gameId, data.nombre]);
      }
    } else if (data.tipo === 'live-answer') {
      var answersSheet = getOrCreateSheet('LiveRespuestas', [
        'Fecha', 'GameId', 'PreguntaIndex', 'Nombre', 'RespuestaIndex', 'Correcta', 'Puntos'
      ]);
      var alreadyAnswered = answersSheet.getDataRange().getValues().slice(1).some(function (row) {
        return String(row[1]) === String(data.gameId) &&
          Number(row[2]) === Number(data.questionIndex) &&
          row[3] === data.nombre;
      });
      if (!alreadyAnswered) {
        answersSheet.appendRow([
          new Date(),
          data.gameId,
          data.questionIndex,
          data.nombre,
          data.respuestaIndex,
          data.correcta,
          data.puntos
        ]);
      }
    }
  } finally {
    lock.releaseLock();
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---- Trivia en vivo (estilo Kahoot) ----

function getLiveState() {
  var raw = PropertiesService.getScriptProperties().getProperty('liveState');
  if (!raw) {
    return { gameId: 0, phase: 'idle', questionIndex: -1, startedAt: 0 };
  }
  return JSON.parse(raw);
}

function setLiveState(state) {
  PropertiesService.getScriptProperties().setProperty('liveState', JSON.stringify(state));
}

function liveJoinedNames(gameId) {
  var sheet = getOrCreateSheet('LiveJugadores', ['Fecha', 'GameId', 'Nombre']);
  return sheet.getDataRange().getValues().slice(1)
    .filter(function (row) { return String(row[1]) === String(gameId); })
    .map(function (row) { return row[2]; });
}

function liveAnswerRows(gameId) {
  var sheet = getOrCreateSheet('LiveRespuestas', [
    'Fecha', 'GameId', 'PreguntaIndex', 'Nombre', 'RespuestaIndex', 'Correcta', 'Puntos'
  ]);
  return sheet.getDataRange().getValues().slice(1)
    .filter(function (row) { return String(row[1]) === String(gameId); });
}

function liveStateData() {
  var state = getLiveState();
  var answerCount = liveAnswerRows(state.gameId).filter(function (row) {
    return Number(row[2]) === Number(state.questionIndex);
  }).length;
  return {
    gameId: state.gameId,
    phase: state.phase,
    questionIndex: state.questionIndex,
    startedAt: state.startedAt,
    joined: liveJoinedNames(state.gameId),
    answerCount: answerCount
  };
}

function liveLeaderboardData() {
  var state = getLiveState();
  var rows = liveAnswerRows(state.gameId);
  var totals = {};
  rows.forEach(function (row) {
    var nombre = row[3];
    var puntos = Number(row[6]) || 0;
    if (!totals[nombre]) totals[nombre] = { nombre: nombre, puntos: 0, respondidas: 0 };
    totals[nombre].puntos += puntos;
    totals[nombre].respondidas += 1;
  });
  var entries = Object.keys(totals).map(function (k) { return totals[k]; });
  entries.sort(function (a, b) { return b.puntos - a.puntos; });
  return entries;
}

function liveQuestionStatsData() {
  var state = getLiveState();
  var rows = liveAnswerRows(state.gameId).filter(function (row) {
    return Number(row[2]) === Number(state.questionIndex);
  });
  var counts = [0, 0, 0, 0];
  rows.forEach(function (row) {
    var idx = Number(row[4]);
    if (idx >= 0 && idx < counts.length) counts[idx]++;
  });
  return { counts: counts, total: rows.length };
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
  } else if (e.parameter.action === 'live-state') {
    payload = Object.assign({ ok: true }, liveStateData());
  } else if (e.parameter.action === 'live-leaderboard') {
    payload = { ok: true, entries: liveLeaderboardData() };
  } else if (e.parameter.action === 'live-question-stats') {
    payload = Object.assign({ ok: true }, liveQuestionStatsData());
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
