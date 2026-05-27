(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var header = document.querySelector("[data-header]");
        var toggle = document.querySelector("[data-menu-toggle]");
        var hero = document.querySelector("[data-hero]");
        var filterForms = document.querySelectorAll("[data-local-filter]");

        function updateHeader() {
            if (!header) {
                return;
            }
            if (window.scrollY > 20) {
                header.classList.add("is-scrolled");
            } else {
                header.classList.remove("is-scrolled");
            }
        }

        updateHeader();
        window.addEventListener("scroll", updateHeader, { passive: true });

        if (toggle && header) {
            toggle.addEventListener("click", function () {
                header.classList.toggle("menu-open");
            });
        }

        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
            var prev = hero.querySelector("[data-hero-prev]");
            var next = hero.querySelector("[data-hero-next]");
            var current = 0;
            var timer = null;

            function show(index) {
                if (!slides.length) {
                    return;
                }
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("active", slideIndex === current);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("active", dotIndex === current);
                });
            }

            function start() {
                stop();
                timer = window.setInterval(function () {
                    show(current + 1);
                }, 5000);
            }

            function stop() {
                if (timer) {
                    window.clearInterval(timer);
                    timer = null;
                }
            }

            if (prev) {
                prev.addEventListener("click", function () {
                    show(current - 1);
                    start();
                });
            }

            if (next) {
                next.addEventListener("click", function () {
                    show(current + 1);
                    start();
                });
            }

            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function () {
                    show(index);
                    start();
                });
            });

            hero.addEventListener("mouseenter", stop);
            hero.addEventListener("mouseleave", start);
            show(0);
            start();
        }

        filterForms.forEach(function (form) {
            var input = form.querySelector(".js-filter-input");
            var list = document.querySelector("[data-card-list]");
            var empty = document.querySelector("[data-empty-state]");
            if (!input || !list) {
                return;
            }
            var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));
            input.addEventListener("input", function () {
                var keyword = input.value.trim().toLowerCase();
                var visible = 0;
                cards.forEach(function (card) {
                    var text = (card.getAttribute("data-search") || "").toLowerCase();
                    var matched = !keyword || text.indexOf(keyword) !== -1;
                    card.style.display = matched ? "" : "none";
                    if (matched) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle("show", visible === 0);
                }
            });
        });

        var searchInput = document.querySelector("[data-search-page-input]");
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q") || "";
        if (searchInput) {
            searchInput.value = query;
        }

        if (window.SearchIndex) {
            renderSearch(query);
        }
    });

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function renderSearch(query) {
        var resultBox = document.querySelector("[data-search-results]");
        var empty = document.querySelector("[data-search-empty]");
        var title = document.querySelector("[data-search-title]");
        var desc = document.querySelector("[data-search-desc]");
        if (!resultBox) {
            return;
        }
        var term = normalize(query);
        var pool = window.SearchIndex || [];
        var results = term ? pool.filter(function (item) {
            return normalize(item.search).indexOf(term) !== -1;
        }) : pool.slice(0, 80);
        resultBox.innerHTML = results.slice(0, 240).map(renderSearchCard).join("");
        if (title) {
            title.textContent = term ? "搜索结果" : "精选影片";
        }
        if (desc) {
            desc.textContent = term ? "以下内容与当前关键词相关。" : "输入关键词后可继续查找更多影片。";
        }
        if (empty) {
            empty.classList.toggle("show", results.length === 0);
        }
    }

    function renderSearchCard(item) {
        return [
            '<article class="movie-card poster-card">',
            '    <a href="./' + escapeHtml(item.url) + '" class="poster-link">',
            '        <span class="poster-image">',
            '            <img src="./' + item.cover + '.jpg" alt="' + escapeHtml(item.title) + '" loading="lazy">',
            '            <span class="poster-shade"></span>',
            '            <span class="poster-meta"><span>' + escapeHtml(item.category) + '</span><span>' + escapeHtml(item.region) + '</span></span>',
            '        </span>',
            '        <span class="poster-info">',
            '            <strong>' + escapeHtml(item.title) + '</strong>',
            '            <em>' + escapeHtml(item.oneLine) + '</em>',
            '            <span class="poster-foot"><span>' + escapeHtml(item.year) + '</span><span>' + escapeHtml(item.type) + '</span></span>',
            '        </span>',
            '    </a>',
            '</article>'
        ].join("\n");
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
})();
