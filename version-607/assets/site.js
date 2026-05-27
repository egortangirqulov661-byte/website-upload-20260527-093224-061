(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function normalize(text) {
    return (text || "").toString().trim().toLowerCase();
  }

  function setupMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener("click", function () {
      panel.classList.toggle("is-open");
      toggle.textContent = panel.classList.contains("is-open") ? "×" : "☰";
    });
  }

  function setupSearchForms() {
    document.querySelectorAll("[data-search-form]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = form.querySelector("input[name='q']");
        var value = input ? input.value.trim() : "";
        if (value) {
          window.location.href = "./search.html?q=" + encodeURIComponent(value);
        } else {
          window.location.href = "./search.html";
        }
      });
    });
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var index = 0;
    var timer;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function restart() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        restart();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        restart();
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        restart();
      });
    });
    show(0);
    restart();
  }

  function setupLocalFilters() {
    var input = document.querySelector("[data-filter-input]");
    var year = document.querySelector("[data-year-filter]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-filter-card]"));
    if (!input || !cards.length) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var q = params.get("q") || "";
    input.value = q;

    function apply() {
      var keyword = normalize(input.value);
      var selectedYear = year ? year.value : "";
      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-tags"),
          card.getAttribute("data-year")
        ].join(" "));
        var yearOk = !selectedYear || card.getAttribute("data-year") === selectedYear;
        var keywordOk = !keyword || haystack.indexOf(keyword) !== -1;
        card.classList.toggle("is-filter-hidden", !(yearOk && keywordOk));
      });
    }

    input.addEventListener("input", apply);
    if (year) {
      year.addEventListener("change", apply);
    }
    apply();
  }

  window.initPlayer = function (source) {
    var video = document.querySelector("[data-player-video]");
    var overlay = document.querySelector("[data-player-overlay]");
    var start = document.querySelector("[data-player-start]");
    var error = document.querySelector("[data-player-error]");
    if (!video || !overlay || !source) {
      return;
    }
    var loaded = false;
    var loading = false;
    var hls = null;

    function setError(message) {
      if (error) {
        error.textContent = message || "";
      }
    }

    function loadSource() {
      if (loaded || loading) {
        return Promise.resolve();
      }
      loading = true;
      setError("");
      return new Promise(function (resolve) {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
          loaded = true;
          loading = false;
          resolve();
          return;
        }
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(source);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            loaded = true;
            loading = false;
            resolve();
          });
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              loading = false;
              setError("暂时无法加载影片，请稍后再试");
              if (hls) {
                hls.destroy();
                hls = null;
              }
            }
          });
          return;
        }
        loading = false;
        setError("当前浏览器暂不支持播放");
        resolve();
      });
    }

    function play() {
      loadSource().then(function () {
        overlay.classList.add("is-hidden");
        video.controls = true;
        var promise = video.play();
        if (promise && promise.catch) {
          promise.catch(function () {
            overlay.classList.remove("is-hidden");
          });
        }
      });
    }

    function toggle() {
      if (video.paused) {
        play();
      } else {
        video.pause();
      }
    }

    overlay.addEventListener("click", play);
    if (start) {
      start.addEventListener("click", function (event) {
        event.stopPropagation();
        play();
      });
    }
    video.addEventListener("click", toggle);
  };

  ready(function () {
    setupMenu();
    setupSearchForms();
    setupHero();
    setupLocalFilters();
  });
})();
