(function () {
    const input = document.getElementById("globalSearchInput");
    const button = document.getElementById("globalSearchButton");
    const results = document.getElementById("searchResults");
    const summary = document.getElementById("searchSummary");
    const movies = Array.isArray(window.SEARCH_MOVIES) ? window.SEARCH_MOVIES : [];

    function card(movie) {
        return [
            '<article class="movie-card standard">',
            '<a class="poster-link" href="' + movie.url + '" aria-label="观看 ' + escapeHtml(movie.title) + '">',
            '<img src="' + movie.poster + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
            '<span class="play-chip">立即观看</span>',
            '</a>',
            '<div class="movie-card-body">',
            '<div class="movie-meta-row"><a href="' + movie.categoryUrl + '">' + escapeHtml(movie.category) + '</a><span>' + escapeHtml(movie.year) + '</span></div>',
            '<h3><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h3>',
            '<p>' + escapeHtml(movie.oneLine) + '</p>',
            '<div class="tag-row"><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.genre) + '</span></div>',
            '</div>',
            '</article>'
        ].join("");
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function runSearch() {
        const params = new URLSearchParams(window.location.search);
        const query = (input.value || params.get("q") || "").trim().toLowerCase();
        input.value = query;

        if (!query) {
            results.innerHTML = movies.slice(0, 40).map(card).join("");
            summary.textContent = "已展示热门影片，可输入关键词缩小范围。";
            return;
        }

        const matched = movies.filter(function (movie) {
            return [movie.title, movie.region, movie.year, movie.genre, movie.tags, movie.category]
                .join(" ")
                .toLowerCase()
                .includes(query);
        });

        results.innerHTML = matched.slice(0, 160).map(card).join("");
        summary.textContent = "找到 " + matched.length + " 部相关影片，当前显示前 " + Math.min(matched.length, 160) + " 部。";
    }

    if (button && input && results && summary) {
        button.addEventListener("click", runSearch);
        input.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                runSearch();
            }
        });
        runSearch();
    }
}());
