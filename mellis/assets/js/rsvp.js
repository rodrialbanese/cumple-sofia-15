function validateRsvp(formValues) {
  var errors = [];
  var nombre = (formValues.nombre || '').trim();
  if (!nombre) errors.push('nombre');

  var apellido = (formValues.apellido || '').trim();
  if (!apellido) errors.push('apellido');

  var cantidad = Number(formValues.cantidad);
  if (!Number.isInteger(cantidad) || cantidad < 1) errors.push('cantidad');

  if (formValues.confirma !== 'si' && formValues.confirma !== 'no') errors.push('confirma');

  if (errors.length > 0) {
    return { ok: false, errors: errors };
  }

  return {
    ok: true,
    payload: {
      nombre: nombre,
      apellido: apellido,
      cantidad: cantidad,
      confirma: formValues.confirma,
      comentario: (formValues.comentario || '').trim(),
      timestamp: new Date().toISOString()
    }
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { validateRsvp: validateRsvp };
}
