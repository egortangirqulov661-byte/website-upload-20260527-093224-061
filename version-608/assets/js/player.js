(function () {
  function setupVideoPlayer(source) {
    var video = document.getElementById('movie-player');
    var overlay = document.getElementById('player-overlay');
    var button = document.getElementById('player-button');
    var attached = false;

    if (!video || !overlay || !button || !source) {
      return;
    }

    function attach() {
      if (attached) {
        return;
      }

      attached = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          maxBufferLength: 30,
          capLevelToPlayerSize: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function play() {
      attach();
      overlay.classList.add('is-hidden');
      video.controls = true;
      var result = video.play();

      if (result && typeof result.catch === 'function') {
        result.catch(function () {
          video.controls = true;
        });
      }
    }

    overlay.addEventListener('click', play);

    button.addEventListener('click', function (event) {
      event.stopPropagation();
      play();
    });

    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });

    video.addEventListener('play', function () {
      overlay.classList.add('is-hidden');
    });
  }

  window.setupVideoPlayer = setupVideoPlayer;
})();
