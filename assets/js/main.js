document.addEventListener('DOMContentLoaded', function () {
  AOS.init({ duration: 400, once: true });

  var photosLink = document.getElementById('photosAlbumLink');
  if (photosLink) {
    photosLink.href = CONFIG.googlePhotosAlbumUrl;
  }

  var targetDate = new Date(CONFIG.eventDate);
  var dayEl = document.getElementById('countDays');
  var hourEl = document.getElementById('countHours');
  var minEl = document.getElementById('countMinutes');
  var secEl = document.getElementById('countSeconds');

  function renderCountdown() {
    var remaining = getTimeRemaining(targetDate, new Date());
    dayEl.textContent = remaining.days;
    hourEl.textContent = formatTwoDigits(remaining.hours);
    minEl.textContent = formatTwoDigits(remaining.minutes);
    secEl.textContent = formatTwoDigits(remaining.seconds);
  }

  renderCountdown();
  setInterval(renderCountdown, 1000);
});
