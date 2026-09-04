document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('rsvpForm');
  var feedback = document.getElementById('rsvpFeedback');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var confirmaInput = form.querySelector('input[name="confirma"]:checked');

    var result = validateRsvp({
      nombre: form.nombre.value,
      cantidad: form.cantidad.value,
      confirma: confirmaInput ? confirmaInput.value : '',
      comentario: form.comentario.value
    });

    if (!result.ok) {
      feedback.textContent = 'Revisá los campos obligatorios (nombre, cantidad y confirmación).';
      return;
    }

    feedback.textContent = 'Enviando...';

    fetch(CONFIG.googleAppsScriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(result.payload)
    })
      .then(function () {
        feedback.textContent = '¡Confirmación recibida! Gracias.';
        form.reset();
      })
      .catch(function () {
        feedback.textContent = 'No pudimos enviar tu confirmación. Probá de nuevo en un momento.';
      });
  });
});
