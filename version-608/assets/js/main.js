(function () {
  var toggle = document.querySelector('[data-nav-toggle]');
  var panel = document.querySelector('[data-mobile-panel]');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  var forms = document.querySelectorAll('[data-search-form]');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('input');
      var value = input ? input.value.trim() : '';
      var target = './search.html';

      if (value) {
        target += '?q=' + encodeURIComponent(value);
      }

      window.location.href = target;
    });
  });

  var grid = document.querySelector('[data-search-grid]');
  var keywordInput = document.querySelector('[data-filter-keyword]');
  var yearSelect = document.querySelector('[data-filter-year]');
  var typeSelect = document.querySelector('[data-filter-type]');

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function applyFilter() {
    if (!grid) {
      return;
    }

    var keyword = normalize(keywordInput && keywordInput.value);
    var year = yearSelect ? yearSelect.value : '';
    var type = typeSelect ? typeSelect.value : '';
    var cards = grid.querySelectorAll('.movie-card');

    cards.forEach(function (card) {
      var pool = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-keywords')
      ].join(' '));
      var matchesKeyword = !keyword || pool.indexOf(keyword) !== -1;
      var matchesYear = !year || card.getAttribute('data-year') === year;
      var matchesType = !type || card.getAttribute('data-type') === type;

      card.classList.toggle('is-hidden', !(matchesKeyword && matchesYear && matchesType));
    });
  }

  if (grid) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';

    if (keywordInput && query) {
      keywordInput.value = query;
    }

    [keywordInput, yearSelect, typeSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });

    applyFilter();
  }
})();
