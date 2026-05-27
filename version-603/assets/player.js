(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        Array.prototype.slice.call(document.querySelectorAll(".player")).forEach(function (player) {
            var video = player.querySelector("video");
            var overlay = player.querySelector(".player-overlay");
            var stream = player.getAttribute("data-stream");
            var attached = false;
            var hls = null;

            function attach() {
                if (!video || !stream || attached) {
                    return Promise.resolve();
                }
                attached = true;
                return new Promise(function (resolve) {
                    if (video.canPlayType("application/vnd.apple.mpegurl")) {
                        video.src = stream;
                        resolve();
                        return;
                    }
                    if (window.Hls && window.Hls.isSupported()) {
                        hls = new window.Hls({
                            enableWorker: true,
                            lowLatencyMode: true
                        });
                        hls.loadSource(stream);
                        hls.attachMedia(video);
                        if (window.Hls.Events && window.Hls.Events.MANIFEST_PARSED) {
                            hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                                resolve();
                            });
                        }
                        window.setTimeout(resolve, 900);
                        return;
                    }
                    video.src = stream;
                    resolve();
                });
            }

            function start() {
                if (overlay) {
                    overlay.classList.add("is-hidden");
                }
                attach().then(function () {
                    var playPromise = video.play();
                    if (playPromise && typeof playPromise.catch === "function") {
                        playPromise.catch(function () {});
                    }
                });
            }

            if (overlay) {
                overlay.addEventListener("click", start);
            }

            if (video) {
                video.addEventListener("play", function () {
                    if (overlay) {
                        overlay.classList.add("is-hidden");
                    }
                });
                video.addEventListener("click", function () {
                    if (!attached) {
                        start();
                    }
                });
            }

            window.addEventListener("beforeunload", function () {
                if (hls && typeof hls.destroy === "function") {
                    hls.destroy();
                }
            });
        });
    });
})();
