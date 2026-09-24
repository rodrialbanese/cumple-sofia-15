// Lógica y datos compartidos por trivia-live-host.html y
// trivia-live-play.html. Aplana TRIVIA_SOBRE_ELLA / TRIVIA_ALGUNA_VEZ /
// TRIVIA_QUE_TEAM (definidas en trivia-data.js) en una sola lista de
// preguntas estilo Kahoot, para no duplicar contenido en ningún lado.
function buildLiveQuestions() {
  var list = [];
  TRIVIA_SOBRE_ELLA.forEach(function (q) {
    list.push({
      type: "mc4",
      question: q.question,
      options: q.options,
      correctIndex: q.correct,
    });
  });
  TRIVIA_ALGUNA_VEZ.forEach(function (q) {
    list.push({
      type: "choice2",
      question: q.question,
      options: ["Sí", "No"],
      correctIndex: q.correct ? 0 : 1,
    });
  });
  TRIVIA_QUE_TEAM.forEach(function (q) {
    list.push({
      type: "choice2",
      question: "¿Qué team es?",
      options: [q.optionA, q.optionB],
      correctIndex: q.correct === "A" ? 0 : 1,
    });
  });
  return list;
}

// Puntaje estilo Kahoot: cuanto más rápido contestás bien, más puntos.
var LIVE_SCORING = {
  windowMs: 15000,
  maxPoints: 1000,
  minPoints: 100,
};

function liveComputePoints(correct, elapsedMs) {
  if (!correct) return 0;
  var capped = Math.min(Math.max(elapsedMs, 0), LIVE_SCORING.windowMs);
  var scaled = Math.round(
    LIVE_SCORING.maxPoints * (1 - capped / LIVE_SCORING.windowMs)
  );
  return Math.max(LIVE_SCORING.minPoints, scaled);
}

// Colores del set de respuestas, dentro de la paleta del sitio (nada de
// rojo/azul/amarillo/verde de Kahoot original).
var LIVE_OPTION_STYLES = [
  { bg: "#6f8a68", shape: "▲" },
  { bg: "#c9a94f", shape: "◆" },
  { bg: "#8a6a6a", shape: "●" },
  { bg: "#3d4a3a", shape: "■" },
];

function liveJsonp(url) {
  return new Promise(function (resolve, reject) {
    var cbName = "liveCb" + Date.now() + Math.floor(Math.random() * 100000);
    var script = document.createElement("script");
    window[cbName] = function (data) {
      resolve(data);
      delete window[cbName];
      script.remove();
    };
    script.onerror = function () {
      reject(new Error("jsonp failed"));
      delete window[cbName];
      script.remove();
    };
    script.src = url + (url.indexOf("?") >= 0 ? "&" : "?") + "callback=" + cbName;
    document.body.appendChild(script);
  });
}

function livePost(apiUrl, body) {
  return fetch(apiUrl, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(body),
  });
}
