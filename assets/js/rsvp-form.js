document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('rsvpForm');
  var feedback = document.getElementById('rsvpFeedback');
  var submitButton = form.querySelector('button[type="submit"].btn');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (form.dataset.submitting === 'true') {
      return;
    }

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
    form.dataset.submitting = 'true';
    if (submitButton) {
      submitButton.disabled = true;
    }

    fetch(CONFIG.googleAppsScriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(result.payload)
    })
      .then(function () {
        feedback.textContent = '¡Confirmación recibida! Gracias.';
        form.reset();
        form.dataset.submitting = 'false';
        if (submitButton) {
          submitButton.disabled = false;
        }
      })
      .catch(function () {
        feedback.textContent = 'No pudimos enviar tu confirmación. Probá de nuevo en un momento.';
        form.dataset.submitting = 'false';
        if (submitButton) {
          submitButton.disabled = false;
        }
      });
  });
});
