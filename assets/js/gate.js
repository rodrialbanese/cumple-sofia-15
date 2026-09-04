document.addEventListener('DOMContentLoaded', function () {
  var title = document.getElementById('gateTitle');
  var message = document.getElementById('gateMessage');
  var button = document.getElementById('enterButton');
  var gate = document.getElementById('gate');

  setTimeout(function () { title.classList.add('show'); }, 300);
  setTimeout(function () { message.classList.add('show'); }, 900);
  setTimeout(function () { button.classList.add('show'); }, 1500);

  button.addEventListener('click', function () {
    gate.style.opacity = '0';
    setTimeout(function () {
      gate.style.display = 'none';
      document.body.dispatchEvent(new CustomEvent('siteEntered'));
    }, 500);
  });
});
