var ytPlayer = null;
var isMusicPlaying = false;

function onYouTubeIframeAPIReady() {
  if (!CONFIG.youtubeVideoId) return;
  ytPlayer = new YT.Player('youtubePlayer', {
    height: '1',
    width: '1',
    videoId: CONFIG.youtubeVideoId,
    playerVars: { autoplay: 0, rel: 0, playsinline: 1, start: CONFIG.youtubeStartSeconds || 0 }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('musicToggle');
  if (!CONFIG.youtubeVideoId) {
    toggle.style.display = 'none';
    return;
  }

  document.body.addEventListener('siteEntered', function () {
    toggle.classList.add('visible');
    toggle.textContent = '❙❙';
    if (ytPlayer && ytPlayer.playVideo) {
      ytPlayer.playVideo();
      isMusicPlaying = true;
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
