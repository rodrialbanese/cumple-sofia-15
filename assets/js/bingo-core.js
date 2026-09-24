// Lógica compartida para generar cartones de forma determinística a partir
// de un número de cartón. El mismo cardId siempre produce el mismo cartón,
// tanto en bingo.html (invitado) como en bingo-host.html (verificación).
function bingoMulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function bingoShuffledIndices(n, rand) {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Devuelve los 16 índices (posiciones dentro de BINGO_SONGS) del cartón.
function bingoCardIndices(cardId, songsLength) {
  const rand = bingoMulberry32(cardId * 2654435761);
  return bingoShuffledIndices(songsLength, rand).slice(0, 16);
}

function bingoCardSongs(cardId, songs) {
  return bingoCardIndices(cardId, songs.length).map((i) => songs[i]);
}

// Las 8 líneas ganadoras de una grilla 4x4 (4 filas + 4 columnas).
function bingoLines() {
  const lines = [];
  for (let r = 0; r < 4; r++) lines.push([r * 4, r * 4 + 1, r * 4 + 2, r * 4 + 3]);
  for (let c = 0; c < 4; c++) lines.push([c, c + 4, c + 8, c + 12]);
  return lines;
}
