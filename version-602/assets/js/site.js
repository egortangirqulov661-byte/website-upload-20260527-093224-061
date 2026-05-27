(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var toggle = document.querySelector("[data-menu-toggle]");
    var mobile = document.querySelector("[data-mobile-nav]");
    if (toggle && mobile) {
      toggle.addEventListener("click", function () {
        mobile.classList.toggle("is-open");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var heroIndex = 0;

    function showHero(index) {
      if (!slides.length) {
        return;
      }
      heroIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === heroIndex);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === heroIndex);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showHero(Number(dot.getAttribute("data-hero-dot")) || 0);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showHero(heroIndex + 1);
      }, 5200);
    }

    var inputs = Array.prototype.slice.call(document.querySelectorAll("[data-search-input]"));
    var selects = Array.prototype.slice.call(document.querySelectorAll("[data-filter-select]"));
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));

    function currentKeyword() {
      var value = "";
      inputs.forEach(function (input) {
        if (document.activeElement === input || input.value) {
          value = input.value.trim().toLowerCase();
        }
      });
      return value;
    }

    function currentCategory() {
      var value = "all";
      selects.forEach(function (select) {
        if (select.value && select.value !== "all") {
          value = select.value;
        }
      });
      return value;
    }

    function applyFilters() {
      var keyword = currentKeyword();
      var category = currentCategory();
      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-year"),
          card.getAttribute("data-type")
        ].join(" ").toLowerCase();
        var cardCategory = card.getAttribute("data-category") || "";
        var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var matchCategory = category === "all" || cardCategory === category;
        card.classList.toggle("is-hidden", !(matchKeyword && matchCategory));
      });
    }

    inputs.forEach(function (input) {
      input.addEventListener("input", applyFilters);
    });

    selects.forEach(function (select) {
      select.addEventListener("change", applyFilters);
    });

    document.querySelectorAll("img").forEach(function (img) {
      img.addEventListener("error", function () {
        img.style.visibility = "hidden";
      }, { once: true });
    });
  });
})();
