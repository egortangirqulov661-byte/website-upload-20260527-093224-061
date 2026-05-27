(function () {
    const navToggle = document.querySelector("[data-nav-toggle]");
    const mainNav = document.querySelector("[data-main-nav]");

    if (navToggle && mainNav) {
        navToggle.addEventListener("click", function () {
            mainNav.classList.toggle("is-open");
        });
    }

    const hero = document.querySelector("[data-hero]");
    if (hero) {
        const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
        const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
        let current = 0;
        let timer = null;

        function showSlide(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function startAutoPlay() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                const index = Number(dot.getAttribute("data-hero-dot"));
                showSlide(index);
                startAutoPlay();
            });
        });

        if (slides.length > 1) {
            startAutoPlay();
        }
    }

    document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
        const search = scope.querySelector("[data-card-search]");
        const year = scope.querySelector("[data-card-year]");
        const list = scope.parentElement.querySelector("[data-card-list]") || document;
        const cards = Array.from(list.querySelectorAll("[data-movie-card]"));

        function applyFilter() {
            const query = search ? search.value.trim().toLowerCase() : "";
            const selectedYear = year ? year.value : "";

            cards.forEach(function (card) {
                const haystack = [
                    card.getAttribute("data-title"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-genre"),
                    card.getAttribute("data-category"),
                    card.getAttribute("data-year")
                ].join(" ").toLowerCase();
                const matchQuery = !query || haystack.includes(query);
                const matchYear = !selectedYear || card.getAttribute("data-year") === selectedYear;
                card.setAttribute("data-card-hidden", String(!(matchQuery && matchYear)));
            });
        }

        if (search) {
            search.addEventListener("input", applyFilter);
        }
        if (year) {
            year.addEventListener("change", applyFilter);
        }
    });
}());
