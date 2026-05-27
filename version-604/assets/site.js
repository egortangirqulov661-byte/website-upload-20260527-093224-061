(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function setupMobileMenu() {
        var toggle = document.querySelector('[data-menu-toggle]');
        var menu = document.querySelector('[data-mobile-menu]');
        if (!toggle || !menu) {
            return;
        }

        toggle.addEventListener('click', function () {
            menu.classList.toggle('open');
        });
    }

    function setupHeroCarousel() {
        var carousel = document.querySelector('[data-hero-carousel]');
        if (!carousel) {
            return;
        }

        var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                var index = Number(dot.getAttribute('data-hero-dot')) || 0;
                show(index);
                start();
            });
        });

        carousel.addEventListener('mouseenter', stop);
        carousel.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function setupSearch() {
        var input = document.querySelector('[data-search-input]');
        var clear = document.querySelector('[data-search-clear]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
        if (!input || cards.length === 0) {
            return;
        }

        function normalize(value) {
            return String(value || '').trim().toLowerCase();
        }

        function haystack(card) {
            return [
                card.getAttribute('data-title'),
                card.getAttribute('data-year'),
                card.getAttribute('data-region'),
                card.getAttribute('data-type'),
                card.getAttribute('data-tags'),
                card.textContent
            ].join(' ').toLowerCase();
        }

        function apply() {
            var keyword = normalize(input.value);
            cards.forEach(function (card) {
                var matched = !keyword || haystack(card).indexOf(keyword) !== -1;
                card.classList.toggle('is-hidden', !matched);
            });
        }

        input.addEventListener('input', apply);
        if (clear) {
            clear.addEventListener('click', function () {
                input.value = '';
                apply();
                input.focus();
            });
        }
    }

    ready(function () {
        setupMobileMenu();
        setupHeroCarousel();
        setupSearch();
    });
}());
