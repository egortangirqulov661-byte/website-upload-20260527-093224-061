import { H as Hls } from "./hls-vendor.js";

(function () {
  function initPlayer(shell) {
    var video = shell.querySelector("video");
    var button = shell.querySelector(".play-cover");
    var url = shell.getAttribute("data-play");
    var hlsInstance = null;
    var prepared = false;

    function prepare() {
      if (prepared || !video || !url) {
        return;
      }
      prepared = true;
      video.controls = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
      } else if (Hls.isSupported()) {
        hlsInstance = new Hls();
        hlsInstance.loadSource(url);
        hlsInstance.attachMedia(video);
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
          if (shell.classList.contains("playing")) {
            var retry = video.play();
            if (retry && typeof retry.catch === "function") {
              retry.catch(function () {});
            }
          }
        });
      } else {
        video.src = url;
      }
    }

    function play() {
      prepare();
      shell.classList.add("playing");
      var result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(function () {
          shell.classList.remove("playing");
        });
      }
    }

    if (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        play();
      });
    }

    shell.addEventListener("click", function (event) {
      if (event.target === video && prepared) {
        return;
      }
      play();
    });

    video.addEventListener("play", function () {
      shell.classList.add("playing");
    });

    video.addEventListener("pause", function () {
      if (!video.currentTime) {
        shell.classList.remove("playing");
      }
    });
  }

  document.querySelectorAll("[data-player]").forEach(initPlayer);
})();
