/*
 * Worked example "Buying firewalls" — five-year cost-of-ownership calculator.
 * The reader enters their own quotes; the default values in the HTML are fictitious examples.
 * The page is fully readable without JavaScript.
 */
(function () {
  'use strict';

  function init() {
    var form = document.getElementById('tco-form');
    var out = document.getElementById('tco-result');
    if (!form || !out) return;
    form.hidden = false;

    var lang = document.documentElement.lang || 'en';
    var money, pct;
    try {
      money = new Intl.NumberFormat(lang, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
      pct = new Intl.NumberFormat(lang, { style: 'percent', maximumFractionDigits: 0 });
    } catch (e) {
      money = { format: function (n) { return '€' + Math.round(n); } };
      pct = { format: function (n) { return Math.round(n * 100) + '%'; } };
    }
    var yearsIn = document.getElementById('tco-years');
    var yearsOut = document.getElementById('tco-years-out');
    // "{n} years" label: the HTML holds the translated pattern for 1 and for more years.
    var yearLabelOne = yearsOut.getAttribute('data-one') || '{n} year';
    var yearLabelMany = yearsOut.getAttribute('data-many') || '{n} years';

    function num(input) {
      var v = Number(input.value);
      return isFinite(v) ? v : 0;
    }
    function set(key, text) {
      out.querySelectorAll('[data-out="' + key + '"]').forEach(function (el) { el.textContent = text; });
    }

    function update() {
      var years = Math.max(1, Math.min(10, Math.round(num(yearsIn))));
      var label = (years === 1 ? yearLabelOne : yearLabelMany).replace('{n}', years);
      yearsOut.textContent = label;
      set('years', label);

      form.querySelectorAll('.tco-offer').forEach(function (fs) {
        var id = fs.getAttribute('data-offer');
        var v = {};
        fs.querySelectorAll('input[data-k]').forEach(function (i) { v[i.getAttribute('data-k')] = Math.max(i.hasAttribute('min') ? Number(i.min) : -Infinity, num(i)); });

        var hardware = v.hw + (v.repl >= 1 && v.repl <= years ? v.hw : 0);
        var subs = 0;
        for (var y = 1; y <= years; y++) subs += v.sub * Math.pow(1 + v.chg / 100, y - 1);
        var total = hardware + subs + v.once;

        set(id + '-hw', money.format(hardware));
        set(id + '-sub', money.format(subs));
        set(id + '-once', money.format(v.once));
        set(id + '-total', money.format(total));
        set(id + '-share', total > 0 ? pct.format(subs / total) : '–');
      });
    }

    form.addEventListener('input', update);
    form.addEventListener('submit', function (e) { e.preventDefault(); update(); });
    update();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
