const test = require('node:test');
const assert = require('node:assert/strict');
const { validateRsvp } = require('../assets/js/rsvp.js');

test('validateRsvp acepta datos completos y devuelve el payload normalizado', () => {
  const result = validateRsvp({ nombre: '  Ana Perez  ', cantidad: '2', confirma: 'si', comentario: '  Que emocion!  ' });
  assert.equal(result.ok, true);
  assert.equal(result.payload.nombre, 'Ana Perez');
  assert.equal(result.payload.cantidad, 2);
  assert.equal(result.payload.confirma, 'si');
  assert.equal(result.payload.comentario, 'Que emocion!');
  assert.equal(typeof result.payload.timestamp, 'string');
});

test('validateRsvp rechaza cuando falta el nombre', () => {
  const result = validateRsvp({ nombre: '   ', cantidad: '1', confirma: 'si' });
  assert.equal(result.ok, false);
  assert.deepEqual(result.errors, ['nombre']);
});

test('validateRsvp rechaza cantidad invalida', () => {
  const result = validateRsvp({ nombre: 'Ana', cantidad: '0', confirma: 'no' });
  assert.equal(result.ok, false);
  assert.deepEqual(result.errors, ['cantidad']);
});

test('validateRsvp rechaza cuando no se eligio confirma', () => {
  const result = validateRsvp({ nombre: 'Ana', cantidad: '1', confirma: '' });
  assert.equal(result.ok, false);
  assert.deepEqual(result.errors, ['confirma']);
});
