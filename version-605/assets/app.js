(function () {
  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle("is-active", i === current);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle("is-active", i === current);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    showSlide(0);
    setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var searchInput = document.querySelector(".movie-search");
  var sortSelect = document.querySelector(".movie-sort");
  var grid = document.querySelector(".movie-grid");

  function applyFilters() {
    var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
    if (!cards.length) {
      return;
    }
    var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    var visibleCount = 0;

    cards.forEach(function (card) {
      var text = [
        card.getAttribute("data-title") || "",
        card.getAttribute("data-tags") || "",
        card.getAttribute("data-year") || "",
        card.textContent || ""
      ].join(" ").toLowerCase();
      var visible = !query || text.indexOf(query) !== -1;
      card.style.display = visible ? "" : "none";
      if (visible) {
        visibleCount += 1;
      }
    });

    document.body.classList.toggle("has-no-results", visibleCount === 0);
  }

  function applySort() {
    if (!grid || !sortSelect) {
      return;
    }
    var value = sortSelect.value;
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));
    if (value === "default") {
      cards.sort(function (a, b) {
        return 0;
      });
    }
    if (value === "year-desc") {
      cards.sort(function (a, b) {
        return Number(b.getAttribute("data-year") || 0) - Number(a.getAttribute("data-year") || 0);
      });
    }
    if (value === "year-asc") {
      cards.sort(function (a, b) {
        return Number(a.getAttribute("data-year") || 0) - Number(b.getAttribute("data-year") || 0);
      });
    }
    if (value === "score-desc") {
      cards.sort(function (a, b) {
        return Number(b.getAttribute("data-score") || 0) - Number(a.getAttribute("data-score") || 0);
      });
    }
    cards.forEach(function (card) {
      grid.appendChild(card);
    });
    applyFilters();
  }

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", applySort);
  }
})();

function setupStaticPlayer(streamUrl) {
  var box = document.querySelector(".player-box");
  var video = document.querySelector(".player-box video");
  var cover = document.querySelector(".player-cover");

  if (!box || !video || !streamUrl) {
    return;
  }

  function bindSource() {
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
      return Promise.resolve();
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      return Promise.resolve();
    }

    video.src = streamUrl;
    return Promise.resolve();
  }

  function start() {
    bindSource().then(function () {
      box.classList.add("is-playing");
      video.setAttribute("controls", "controls");
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {
          box.classList.remove("is-playing");
        });
      }
    });
  }

  if (cover) {
    cover.addEventListener("click", start);
  }

  video.addEventListener("click", function () {
    if (video.paused) {
      start();
    }
  });
}
