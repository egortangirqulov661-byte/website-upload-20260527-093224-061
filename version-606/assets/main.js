(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (menuButton && mobileNav) {
        menuButton.addEventListener("click", function () {
            mobileNav.classList.toggle("open");
        });
    }

    document.querySelectorAll("[data-hero-slider]").forEach(function (slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dot"));
        var index = 0;
        var timer = null;

        function show(next) {
            if (!slides.length) {
                return;
            }

            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, position) {
                slide.classList.toggle("active", position === index);
            });
            dots.forEach(function (dot, position) {
                dot.classList.toggle("active", position === index);
            });
        }

        function play() {
            clearInterval(timer);
            timer = setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot, position) {
            dot.addEventListener("click", function () {
                show(position);
                play();
            });
        });

        show(0);
        play();
    });

    var filterGrid = document.querySelector("[data-filter-grid]");

    if (filterGrid) {
        var input = document.querySelector("[data-search-input]");
        var typeSelect = document.querySelector("[data-type-filter]");
        var regionSelect = document.querySelector("[data-region-filter]");
        var yearSelect = document.querySelector("[data-year-filter]");
        var emptyState = document.querySelector("[data-empty-state]");
        var cards = Array.prototype.slice.call(filterGrid.querySelectorAll("[data-movie-card]"));

        function value(node) {
            return node ? node.value.trim().toLowerCase() : "";
        }

        function applyFilter() {
            var keyword = value(input);
            var type = value(typeSelect);
            var region = value(regionSelect);
            var year = value(yearSelect);
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = [
                    card.dataset.title,
                    card.dataset.region,
                    card.dataset.type,
                    card.dataset.year,
                    card.dataset.genre,
                    card.dataset.tags
                ].join(" ").toLowerCase();

                var matched = true;

                if (keyword && haystack.indexOf(keyword) === -1) {
                    matched = false;
                }

                if (type && String(card.dataset.type || "").toLowerCase() !== type) {
                    matched = false;
                }

                if (region && String(card.dataset.region || "").toLowerCase().indexOf(region) === -1) {
                    matched = false;
                }

                if (year && String(card.dataset.year || "").toLowerCase() !== year) {
                    matched = false;
                }

                card.style.display = matched ? "" : "none";
                if (matched) {
                    visible += 1;
                }
            });

            if (emptyState) {
                emptyState.classList.toggle("visible", visible === 0);
            }
        }

        [input, typeSelect, regionSelect, yearSelect].forEach(function (node) {
            if (node) {
                node.addEventListener("input", applyFilter);
                node.addEventListener("change", applyFilter);
            }
        });
    }
})();
