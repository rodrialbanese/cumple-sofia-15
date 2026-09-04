var ytPlayer = null;
var isMusicPlaying = false;

function onYouTubeIframeAPIReady() {
  ytPlayer = new YT.Player('youtubePlayer', {
    height: '1',
    width: '1',
    videoId: CONFIG.youtubeVideoId,
    playerVars: { autoplay: 0, rel: 0, playsinline: 1 }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('musicToggle');

  document.body.addEventListener('siteEntered', function () {
    toggle.classList.add('visible');
    toggle.textContent = '❙❙';
    isMusicPlaying = true;
    if (ytPlayer && ytPlayer.playVideo) {
      ytPlayer.playVideo();
    }
  });

  toggle.addEventListener('click', function () {
    if (!ytPlayer) return;
    if (isMusicPlaying) {
      ytPlayer.pauseVideo();
      toggle.textContent = '▶';
    } else {
      ytPlayer.playVideo();
      toggle.textContent = '❙❙';
    }
    isMusicPlaying = !isMusicPlaying;
  });
});
