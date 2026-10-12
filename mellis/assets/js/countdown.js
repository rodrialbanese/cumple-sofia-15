function getTimeRemaining(targetDate, now) {
  var total = targetDate.getTime() - now.getTime();
  if (total <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  var days = Math.floor(total / (1000 * 60 * 60 * 24));
  var hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  var minutes = Math.floor((total / (1000 * 60)) % 60);
  var seconds = Math.floor((total / 1000) % 60);
  return { total: total, days: days, hours: hours, minutes: minutes, seconds: seconds };
}

function formatTwoDigits(value) {
  return String(value).padStart(2, '0');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getTimeRemaining: getTimeRemaining, formatTwoDigits: formatTwoDigits };
}
