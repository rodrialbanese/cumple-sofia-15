// ============================================================
// "¿Quién conoce más a la cumpleañera?" — datos del juego.
//
// Completá este archivo con las preguntas y respuestas reales de Sofi.
// No hace falta saber programar: solo reemplazar los textos entre
// comillas "..." y el número/valor que marca la respuesta correcta.
// Cuando termines, avisame y armo la página del juego con esto.
// ============================================================

// ---- 1) SOBRE ELLA (opción múltiple — dropdown de 4 opciones) ----
// Cada pregunta tiene 4 "options" y "correct" indica CUÁL de esas 4
// es la correcta, contando desde 0 (la primera opción es la 0, la
// segunda la 1, la tercera la 2, la cuarta la 3).
//
// Ejemplo ya completo:
//   {
//     question: "Peli o serie favorita",
//     options: ["Stranger Things", "Friends", "La Casa de Papel", "Élite"],
//     correct: 0   <- porque "Stranger Things" es la opción en la posición 0
//   },
//
// Las 3 opciones incorrectas también las elegís vos — poné otras
// respuestas creíbles (no algo obviamente falso) para que sea un
// desafío real para los invitados.

var TRIVIA_SOBRE_ELLA = [
  {
    question: "Peli o serie favorita",
    options: ["Stranger Things", "Friends", "La Casa de Papel", "Élite"],
    correct: 0,
  },
  {
    question: "Artista o banda favorita",
    options: ["Karol G", "Bad Bunny", "Taylor Swift", "Shakira"],
    correct: 0,
  },
  {
    question: "Animal favorito",
    options: ["Perro", "Gato", "Conejo", "Panda"],
    correct: 0,
  },
  {
    question: "Frase típica de ella",
    options: ["\"Obvio\"", "\"Re mal\"", "\"Ay, no sé\"", "\"Igual\""],
    correct: 0,
  },
  {
    question: "Su mayor miedo",
    options: ["Las arañas", "La oscuridad", "Las alturas", "Los payasos"],
    correct: 0,
  },
  {
    question: "Lugar soñado para viajar",
    options: ["Japón", "Italia", "Nueva York", "Grecia"],
    correct: 0,
  },
  {
    question: "Comida favorita",
    options: ["Milanesa con papas", "Sushi", "Pizza", "Asado"],
    correct: 0,
  },
  {
    question: "Talento oculto",
    options: ["Canta muy bien", "Baila muy bien", "Dibuja genial", "Imita voces"],
    correct: 0,
  },
  {
    question: "Es adicta a...",
    options: ["Al mate", "Al chocolate", "Al celular", "A las series"],
    correct: 0,
  },
  {
    question: "Su mayor hobby",
    options: ["Bailar", "Dibujar", "Andar en bici", "Escuchar música"],
    correct: 0,
  },
  // Podés agregar más preguntas copiando y pegando un bloque como este.
];

// ---- 2) ¿ALGUNA VEZ...? (Sí / No) ----
// "correct" es true si la respuesta real es SÍ, o false si es NO.

var TRIVIA_ALGUNA_VEZ = [
  { question: "Fue a un recital", correct: true },
  { question: "Se subió a un avión", correct: true },
  { question: "Se escapó de más", correct: false },
  { question: "Conoció a un famoso", correct: false },
  { question: "Lloró por amor", correct: false },
  // Agregá más acá, mismo formato: { question: "...", correct: true },
];

// ---- 3) ¿QUÉ TEAM ES? (esto o lo otro) ----
// "correct" vale "A" si ella prefiere optionA, o "B" si prefiere optionB.

var TRIVIA_QUE_TEAM = [
  { optionA: "Frío", optionB: "Calor", correct: "A" },
  { optionA: "Gatos", optionB: "Perros", correct: "A" },
  { optionA: "Mate", optionB: "Café", correct: "A" },
  { optionA: "Playa", optionB: "Montaña", correct: "A" },
  { optionA: "Pizza", optionB: "Sushi", correct: "A" },
  // Agregá más acá, mismo formato: { optionA: "...", optionB: "...", correct: "A" },
];
