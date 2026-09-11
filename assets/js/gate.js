document.addEventListener('DOMContentLoaded', function () {
  var title = document.getElementById('gateTitle');
  var button = document.getElementById('enterButton');
  var gate = document.getElementById('gate');

  document.body.style.overflow = 'hidden';

  setTimeout(function () { title.classList.add('show'); }, 300);
  setTimeout(function () { button.classList.add('show'); }, 900);

  button.addEventListener('click', function () {
    document.body.dispatchEvent(new CustomEvent('siteEntered'));
    document.body.style.overflow = 'auto';
    gate.style.opacity = '0';
    setTimeout(function () {
      gate.style.display = 'none';
    }, 500);
  });
});
