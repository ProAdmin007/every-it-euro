/*
 * Worked example "€50,000 for firewalls" — recalculates the split when the budget or the
 * channel share changes. The vendor ratios come from the data-share attributes in the HTML,
 * which are derived from each vendor's published annual figures (see the page's sources).
 * The page is fully readable without JavaScript (default: €50,000, 20% channel share).
 */
(function () {
  'use strict';

  function init() {
    var root = document.getElementById('example');
    var form = document.getElementById('example-form');
    if (!root || !form) return;
    form.hidden = false;

    var budgetIn = document.getElementById('ex-budget');
    var channelIn = document.getElementById('ex-channel');
    var channelOut = document.getElementById('ex-channel-out');
    var lang = document.documentElement.lang || 'en';
    var money, pct;
    try {
      money = new Intl.NumberFormat(lang, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
      pct = new Intl.NumberFormat(lang, { style: 'percent', maximumFractionDigits: 0 });
    } catch (e) {
      money = { format: function (n) { return '€' + Math.round(n); } };
      pct = { format: function (n) { return Math.round(n * 100) + '%'; } };
    }
    var round100 = function (n) { return Math.round(n / 100) * 100; };

    function update() {
      var budget = Math.max(0, Math.min(10000000, Number(budgetIn.value) || 0));
      var channel = Math.max(0, Math.min(40, Number(channelIn.value) || 0)) / 100;
      channelOut.textContent = pct.format(channel);

      root.querySelectorAll('.example-vendor').forEach(function (card) {
        var vendorShare = budget * (1 - channel);
        var rows = Array.prototype.slice.call(card.querySelectorAll('tbody tr[data-seg]'));
        var exact = rows.map(function (row) {
          var share = row.hasAttribute('data-share') ? Number(row.getAttribute('data-share')) : null;
          return share === null ? budget * channel : vendorShare * share;
        });
        // Round each amount to €100, then correct the largest one so the rows add up to the total.
        var rounded = exact.map(round100);
        var diff = round100(budget) - rounded.reduce(function (a, b) { return a + b; }, 0);
        var largest = exact.indexOf(Math.max.apply(null, exact));
        rounded[largest] += diff;
        rows.forEach(function (row, i) {
          row.querySelector('[data-amount]').textContent = money.format(rounded[i]);
        });
        card.querySelector('[data-total]').textContent = money.format(round100(budget));

        // Bar: segment widths in a 0–100 viewBox (SVG attributes, so the strict CSP is respected).
        var x = 0;
        var bar = document.querySelector('.split-bar[data-vendor="' + card.getAttribute('data-vendor') + '"]');
        if (!bar) return;
        bar.querySelectorAll('rect[data-seg]').forEach(function (rect) {
          var s = rect.hasAttribute('data-share') ? Number(rect.getAttribute('data-share')) * (1 - channel) : channel;
          var w = s * 100;
          rect.setAttribute('x', x.toFixed(2));
          rect.setAttribute('width', w.toFixed(2));
          x += w;
        });
      });
    }

    budgetIn.addEventListener('input', update);
    channelIn.addEventListener('input', update);
    form.addEventListener('submit', function (e) { e.preventDefault(); update(); });
    update();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
