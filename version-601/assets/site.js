
(function () {
  const menuButton = document.querySelector('[data-mobile-menu]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  document.addEventListener('error', function (event) {
    const target = event.target;

    if (!target || target.tagName !== 'IMG') {
      return;
    }

    const holder = target.closest('.poster, .mini-poster, .detail-poster, .hero-poster');

    if (holder) {
      holder.classList.add('is-missing');
      holder.dataset.title = target.dataset.fallbackTitle || target.alt || '热门片库';
    }

    target.remove();
  }, true);

  function setupHero() {
    const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
    const prev = document.querySelector('[data-hero-prev]');
    const next = document.querySelector('[data-hero-next]');

    if (!slides.length) {
      return;
    }

    let index = 0;
    let timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function restart() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }

    restart();
  }

  function getQuery(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name) || '';
  }

  function createCard(movie) {
    const title = escapeHtml(movie.title);
    const description = escapeHtml(movie.oneLine || movie.summary || '');
    const tags = (movie.genre || '')
      .split(/[ \/,，、;；|]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(function (tag) {
        return '<span>' + escapeHtml(tag) + '</span>';
      })
      .join('');

    return [
      '<a class="movie-card" href="movies/' + movie.id + '.html" title="' + title + '">',
      '  <figure class="poster" data-title="' + title + '">',
      '    <img src="' + movie.cover + '" alt="' + title + ' 海报" class="poster-img" loading="lazy" data-fallback-title="' + title + '">',
      '    <span class="year-badge">' + escapeHtml(movie.year || '') + '</span>',
      '    <span class="play-hover">▶</span>',
      '  </figure>',
      '  <div class="movie-card-body">',
      '    <h3>' + title + '</h3>',
      '    <p>' + description.slice(0, 90) + '</p>',
      '    <div class="movie-meta">',
      '      <span>' + escapeHtml(movie.region || '') + '</span>',
      '      <span>' + escapeHtml(movie.type || '') + '</span>',
      '    </div>',
      '    <div class="tag-row">' + tags + '</div>',
      '  </div>',
      '</a>'
    ].join('\n');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function setupSearch() {
    const results = document.getElementById('searchResults');
    const summary = document.getElementById('searchSummary');

    if (!results || !summary || !window.MOVIE_DATA) {
      return;
    }

    const input = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    const regionFilter = document.getElementById('regionFilter');
    const yearFilter = document.getElementById('yearFilter');
    const reset = document.getElementById('resetSearch');

    input.value = getQuery('q');

    function render() {
      const keyword = input.value.trim().toLowerCase();
      const type = typeFilter.value;
      const region = regionFilter.value;
      const year = yearFilter.value.trim();

      const filtered = window.MOVIE_DATA.filter(function (movie) {
        const haystack = [
          movie.title,
          movie.region,
          movie.type,
          movie.year,
          movie.genre,
          movie.oneLine,
          movie.summary,
          (movie.tags || []).join(' ')
        ].join(' ').toLowerCase();

        if (keyword && !haystack.includes(keyword)) {
          return false;
        }

        if (type && movie.type !== type) {
          return false;
        }

        if (region && movie.region !== region) {
          return false;
        }

        if (year && String(movie.year) !== year) {
          return false;
        }

        return true;
      }).sort(function (a, b) {
        return Number(b.heat || 0) - Number(a.heat || 0);
      });

      summary.textContent = '共找到 ' + filtered.length + ' 部内容，当前展示前 120 部。';
      results.innerHTML = filtered.slice(0, 120).map(createCard).join('\n');
    }

    [input, typeFilter, regionFilter, yearFilter].forEach(function (element) {
      if (element) {
        element.addEventListener('input', render);
        element.addEventListener('change', render);
      }
    });

    if (reset) {
      reset.addEventListener('click', function () {
        input.value = '';
        typeFilter.value = '';
        regionFilter.value = '';
        yearFilter.value = '';
        render();
      });
    }

    render();
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupHero();
    setupSearch();
  });
})();
