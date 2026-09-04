const test = require('node:test');
const assert = require('node:assert/strict');
const { getTimeRemaining, formatTwoDigits } = require('../assets/js/countdown.js');

test('getTimeRemaining calcula dias, horas, minutos y segundos exactos', () => {
  const now = new Date('2026-01-01T00:00:00-03:00');
  const target = new Date('2026-01-03T02:03:04-03:00');
  const result = getTimeRemaining(target, now);
  assert.equal(result.days, 2);
  assert.equal(result.hours, 2);
  assert.equal(result.minutes, 3);
  assert.equal(result.seconds, 4);
});

test('getTimeRemaining devuelve todo en cero cuando la fecha ya paso', () => {
  const now = new Date('2026-10-10T00:00:00-03:00');
  const target = new Date('2026-10-09T21:00:00-03:00');
  const result = getTimeRemaining(target, now);
  assert.deepEqual(result, { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
});

test('formatTwoDigits agrega cero a la izquierda para numeros de un digito', () => {
  assert.equal(formatTwoDigits(4), '04');
  assert.equal(formatTwoDigits(23), '23');
});
