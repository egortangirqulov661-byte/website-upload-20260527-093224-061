(function () {
    function boot(box) {
        var video = box.querySelector("video");
        var button = box.querySelector(".play-mask");
        var url = video ? video.getAttribute("data-play-url") : "";
        var ready = false;
        var hls = null;

        function load() {
            if (!video || !url) {
                return;
            }

            if (!ready) {
                ready = true;
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = url;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        maxBufferLength: 30,
                        enableWorker: true
                    });
                    hls.loadSource(url);
                    hls.attachMedia(video);
                } else {
                    video.src = url;
                }
            }

            if (button) {
                button.classList.add("hidden");
            }

            video.controls = true;
            var promise = video.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(function () {});
            }
        }

        if (button) {
            button.addEventListener("click", load);
        }

        if (video) {
            video.addEventListener("click", function () {
                if (video.paused) {
                    load();
                }
            });
        }

        window.addEventListener("pagehide", function () {
            if (hls) {
                hls.destroy();
            }
        });
    }

    document.querySelectorAll(".player-box").forEach(boot);
})();
