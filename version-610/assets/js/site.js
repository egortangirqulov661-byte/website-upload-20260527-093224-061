(function () {
    var body = document.body;
    var menuButton = document.querySelector(".menu-toggle");

    if (menuButton) {
        menuButton.addEventListener("click", function () {
            var open = body.classList.toggle("menu-open");
            menuButton.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }

    document.querySelectorAll(".mobile-nav-link").forEach(function (link) {
        link.addEventListener("click", function () {
            body.classList.remove("menu-open");
            if (menuButton) {
                menuButton.setAttribute("aria-expanded", "false");
            }
        });
    });

    document.querySelectorAll("[data-hero]").forEach(function (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }

        function start() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5600);
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                start();
            });
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                show(dotIndex);
                start();
            });
        });

        show(0);
        start();
    });

    document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
        var form = scope.querySelector("[data-filter-form]");
        var queryInput = scope.querySelector("[data-filter-query]");
        var yearInput = scope.querySelector("[data-filter-year]");
        var categoryInput = scope.querySelector("[data-filter-category]");
        var reset = scope.querySelector("[data-filter-reset]");
        var empty = scope.querySelector("[data-empty-state]");
        var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-movie-card]"));

        function matchYear(card, value) {
            if (!value) {
                return true;
            }
            if (value === "classic") {
                var year = parseInt(card.dataset.year, 10);
                return year && year <= 2015;
            }
            return String(card.dataset.year || "").indexOf(value) !== -1;
        }

        function apply() {
            var query = queryInput ? queryInput.value.trim().toLowerCase() : "";
            var year = yearInput ? yearInput.value : "";
            var category = categoryInput ? categoryInput.value : "";
            var shown = 0;

            cards.forEach(function (card) {
                var haystack = String(card.dataset.search || "").toLowerCase();
                var visible = true;
                if (query && haystack.indexOf(query) === -1) {
                    visible = false;
                }
                if (!matchYear(card, year)) {
                    visible = false;
                }
                if (category && card.dataset.category !== category) {
                    visible = false;
                }
                card.hidden = !visible;
                if (visible) {
                    shown += 1;
                }
            });

            if (empty) {
                empty.hidden = shown !== 0;
            }
        }

        if (form) {
            form.addEventListener("input", apply);
            form.addEventListener("change", apply);
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                apply();
            });
        }

        if (reset) {
            reset.addEventListener("click", function () {
                if (queryInput) {
                    queryInput.value = "";
                }
                if (yearInput) {
                    yearInput.value = "";
                }
                if (categoryInput) {
                    categoryInput.value = "";
                }
                apply();
            });
        }

        apply();
    });
})();

function initMoviePlayer(streamUrl) {
    var video = document.getElementById("moviePlayer");
    var start = document.getElementById("playerStart");

    if (!video || !start || !streamUrl) {
        return;
    }

    var attached = false;
    var hls = null;

    function attach() {
        if (attached) {
            return Promise.resolve();
        }

        attached = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = streamUrl;
            video.load();
            return Promise.resolve();
        }

        if (window.Hls && window.Hls.isSupported()) {
            return new Promise(function (resolve) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    maxBufferLength: 24
                });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    resolve();
                });
                hls.on(window.Hls.Events.ERROR, function (_, data) {
                    if (!data || !data.fatal || !hls) {
                        return;
                    }
                    if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                        hls.startLoad();
                    } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                        hls.recoverMediaError();
                    }
                });
            });
        }

        video.src = streamUrl;
        video.load();
        return Promise.resolve();
    }

    function play() {
        start.classList.add("is-hidden");
        attach().then(function () {
            var result = video.play();
            if (result && typeof result.catch === "function") {
                result.catch(function () {
                    start.classList.remove("is-hidden");
                });
            }
        });
    }

    start.addEventListener("click", play);
    video.addEventListener("click", function () {
        if (video.paused) {
            play();
        }
    });
}
