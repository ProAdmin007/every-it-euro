/*
 * European Technology Alternatives — client-side filtering.
 *
 * The company cards are pre-rendered into alternatives.html from data/companies.json
 * by tools/build.py, so the full list is readable without JavaScript.
 * This script only adds search and filtering on top of that markup.
 * Filter state is mirrored in the query string so filtered views can be shared.
 */
(function () {
  'use strict';

  function init() {
    var root = document.getElementById('alternatives');
    if (!root) return;

    var cards = Array.prototype.slice.call(root.querySelectorAll('.company'));
    var search = document.getElementById('f-search');
    var country = document.getElementById('f-country');
    var cls = document.getElementById('f-class');
    var openSource = document.getElementById('f-opensource');
    var onPrem = document.getElementById('f-onprem');
    var chips = Array.prototype.slice.call(document.querySelectorAll('.chip[data-category]'));
    var countEl = document.getElementById('results-count');
    var emptyEl = document.getElementById('results-empty');
    var resetBtn = document.getElementById('f-reset');

    document.querySelectorAll('[data-js-only]').forEach(function (el) { el.hidden = false; });

    var category = 'All';

    function setCategory(cat) {
      category = cat;
      chips.forEach(function (c) {
        c.setAttribute('aria-pressed', String(c.getAttribute('data-category') === cat));
      });
    }

    function apply() {
      var q = (search.value || '').trim().toLowerCase();
      var terms = q ? q.split(/\s+/) : [];
      var c = country.value;
      var k = cls.value;
      var shown = 0;

      cards.forEach(function (card) {
        var cats = (card.getAttribute('data-categories') || '').split('|');
        var text = card.getAttribute('data-search') || '';
        var ok =
          (category === 'All' || cats.indexOf(category) !== -1) &&
          (!c || card.getAttribute('data-country') === c) &&
          (!k || card.getAttribute('data-class') === k) &&
          (!openSource.checked || card.getAttribute('data-opensource') !== 'No') &&
          (!onPrem.checked || card.getAttribute('data-onprem') !== 'No') &&
          terms.every(function (t) { return text.indexOf(t) !== -1; });
        card.hidden = !ok;
        if (ok) shown++;
      });

      var T = window.EveryItEuro.strings.alternatives;
      countEl.textContent = shown === cards.length
        ? window.EveryItEuro.fmt(T.showingAll, { total: cards.length })
        : window.EveryItEuro.fmt(T.showingSome, { shown: shown, total: cards.length });
      emptyEl.hidden = shown !== 0;
      syncUrl(q, c, k);
    }

    function syncUrl(q, c, k) {
      if (!window.history.replaceState || !window.URLSearchParams) return;
      var p = new URLSearchParams();
      if (category !== 'All') p.set('category', category);
      if (q) p.set('q', q);
      if (c) p.set('country', c);
      if (k) p.set('class', k);
      if (openSource.checked) p.set('opensource', '1');
      if (onPrem.checked) p.set('onprem', '1');
      var qs = p.toString();
      window.history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : '') + window.location.hash);
    }

    function restore() {
      if (!window.URLSearchParams) return;
      var p = new URLSearchParams(window.location.search);
      var cat = p.get('category');
      if (cat && chips.some(function (ch) { return ch.getAttribute('data-category') === cat; })) setCategory(cat);
      if (p.get('q')) search.value = p.get('q');
      if (p.get('country')) country.value = p.get('country');
      if (p.get('class')) cls.value = p.get('class');
      openSource.checked = p.get('opensource') === '1';
      onPrem.checked = p.get('onprem') === '1';
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        setCategory(chip.getAttribute('data-category'));
        apply();
      });
    });
    var debounce;
    search.addEventListener('input', function () {
      window.clearTimeout(debounce);
      debounce = window.setTimeout(apply, 120);
    });
    [country, cls, openSource, onPrem].forEach(function (el) { el.addEventListener('change', apply); });
    resetBtn.addEventListener('click', function () {
      search.value = '';
      country.value = '';
      cls.value = '';
      openSource.checked = false;
      onPrem.checked = false;
      setCategory('All');
      apply();
      search.focus();
    });
    document.getElementById('filter-form').addEventListener('submit', function (e) { e.preventDefault(); apply(); });

    restore();
    apply();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
