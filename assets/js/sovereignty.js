/*
 * Technology Sovereignty Assessment.
 *
 * Deliberately simple, transparent rules (documented on the page) — this is a
 * conversation starter for a risk assessment, not a scientific score.
 * Each answer carries a data-effect attribute in the HTML:
 *   impact  — raises the importance of the system
 *   dep     — indicates a dependency or loss of control
 *   unknown — "Not sure": treated cautiously as impact/dependency and listed as an open question
 *   ok      — reduces concern (mitigating factor)
 * Answers are never stored or sent anywhere. A shareable link encodes them in the URL fragment only.
 */
(function () {
  'use strict';

  function init() {
    var form = document.getElementById('assessment');
    if (!form) return;
    /* Interface strings: assets/js/i18n/<lang>.js. Answer texts and reasons are in the HTML. */
    var T = window.EveryItEuro.strings.assessment;
    var fmt = window.EveryItEuro.fmt;
    var result = document.getElementById('assessment-result');
    var errorBox = document.getElementById('assessment-error');
    var fieldsets = Array.prototype.slice.call(form.querySelectorAll('fieldset[data-q]'));

    form.querySelectorAll('[data-js-only]').forEach(function (el) { el.hidden = false; });

    function answers() {
      var a = {};
      fieldsets.forEach(function (fs) {
        var checked = fs.querySelector('input:checked');
        a[fs.getAttribute('data-q')] = checked || null;
      });
      return a;
    }

    function evaluate(focusResult) {
      var a = answers();
      var missing = fieldsets.filter(function (fs) { return !a[fs.getAttribute('data-q')]; });
      if (missing.length) {
        errorBox.hidden = false;
        errorBox.innerHTML = '<p><strong>' + escapeHtml(T.missingTitle) + '</strong> ' +
          escapeHtml(fmt(T.missingCount, { n: missing.length })) + '</p><ul>' +
          missing.map(function (fs) {
            var leg = fs.querySelector('legend');
            return '<li><a href="#' + fs.id + '">' + escapeHtml(leg ? leg.textContent : fs.id) + '</a></li>';
          }).join('') + '</ul>';
        errorBox.focus();
        result.hidden = true;
        return;
      }
      errorBox.hidden = true;

      var impact = [], dep = [], ok = [], open = [];
      fieldsets.forEach(function (fs) {
        var input = a[fs.getAttribute('data-q')];
        var effect = input.getAttribute('data-effect');
        var kind = fs.getAttribute('data-kind');
        var reason = input.getAttribute('data-reason') || '';
        var question = (fs.querySelector('legend') || {}).textContent || '';
        if (effect === 'impact') impact.push(reason);
        else if (effect === 'dep') dep.push(reason);
        else if (effect === 'ok' && reason) ok.push(reason);
        else if (effect === 'unknown') {
          open.push(question.trim());
          if (kind === 'impact') impact.push(fmt(T.unclear, { reason: reason }));
          else dep.push(fmt(T.unclear, { reason: reason }));
        }
      });

      var is = function (key) {
        var input = a[key];
        return !!input && (input.getAttribute('data-effect') === 'impact' || input.getAttribute('data-effect') === 'unknown');
      };
      var criticalContext = is('ci') || is('ot');
      var operationalWeight = is('critical') || is('outage');
      var level, rule;

      if (criticalContext && operationalWeight && dep.length >= 3) {
        level = 'strategic';
        rule = T.rules.strategicCritical;
      } else if (impact.length >= 5 && dep.length >= 5) {
        level = 'strategic';
        rule = T.rules.strategicFiveFive;
      } else if ((impact.length >= 3 && dep.length >= 2) || (criticalContext && dep.length >= 1) || (is('security') && dep.length >= 3)) {
        level = 'high';
        rule = criticalContext && dep.length >= 1
          ? T.rules.highCritical
          : (impact.length >= 3 && dep.length >= 2 ? T.rules.highThreeTwo : T.rules.highSecurity);
      } else if ((impact.length >= 1 && dep.length >= 1) || impact.length >= 3 || dep.length >= 4) {
        level = 'medium';
        rule = T.rules.medium;
      } else {
        level = 'low';
        rule = T.rules.low;
      }

      renderResult(level, rule, impact, dep, ok, open);
      updateHash(a);
      result.hidden = false;
      if (focusResult) result.focus();
    }

    function list(items) {
      if (!items.length) return '<p class="text-muted">' + escapeHtml(T.none) + '</p>';
      return '<ul class="reasons">' + items.map(function (i) { return '<li>' + escapeHtml(i) + '</li>'; }).join('') + '</ul>';
    }

    var lastMarkdown = '';
    function renderResult(level, rule, impact, dep, ok, open) {
      var L = T.levels[level];
      var M = T.md;
      var h = escapeHtml;
      result.setAttribute('data-level', level);
      result.innerHTML =
        '<h2 class="h3">' + h(T.outcome) + '</h2>' +
        '<div class="meter" aria-hidden="true"><span></span><span></span><span></span><span></span></div>' +
        '<div class="meter-labels" aria-hidden="true">' + T.meter.map(function (m) { return '<span>' + h(m) + '</span>'; }).join('') + '</div>' +
        '<p class="result-level">' + h(L.label) + '</p>' +
        '<p>' + h(L.text) + '</p>' +
        '<h3>' + h(T.why) + '</h3><p>' + h(rule) + '</p>' +
        '<div class="grid grid-2">' +
        '<div><h4>' + h(fmt(T.importance, { n: impact.length })) + '</h4>' + list(impact) + '</div>' +
        '<div><h4>' + h(fmt(T.dependency, { n: dep.length })) + '</h4>' + list(dep) + '</div>' +
        '</div>' +
        (ok.length ? '<h4>' + h(T.mitigating) + '</h4>' + list(ok) : '') +
        (open.length ? '<h4>' + h(T.openQuestions) + '</h4>' + list(open) : '') +
        '<p class="note">' + h(T.disclaimer) + '</p>' +
        '<div class="btn-row no-print">' +
        '<button type="button" class="btn btn-blue btn-sm" data-act="copy">' + h(T.copyMarkdown) + '</button>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-act="link">' + h(T.copyLink) + '</button>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-act="print">' + h(T.print) + '</button>' +
        '</div><p class="note" role="status" data-copy-status></p>';

      var bullets = function (items) { return items.map(function (i) { return '- ' + i; }).join('\n') || '- ' + M.none; };
      lastMarkdown = [
        '# ' + M.title,
        '',
        '**' + M.outcome + ':** ' + L.label,
        '',
        L.text,
        '',
        '**' + M.rule + ':** ' + rule,
        '',
        '## ' + M.importance,
        bullets(impact),
        '',
        '## ' + M.dependency,
        bullets(dep),
        '',
        ok.length ? '## ' + M.mitigating + '\n' + bullets(ok) + '\n' : '',
        open.length ? '## ' + M.open + '\n' + bullets(open) + '\n' : '',
        '_' + fmt(M.footer, { url: window.location.href.split('#')[0] }) + '_'
      ].join('\n');
    }

    result.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-act]');
      if (!btn) return;
      var status = result.querySelector('[data-copy-status]');
      var act = btn.getAttribute('data-act');
      if (act === 'copy') window.EveryItEuro.copyText(lastMarkdown, status);
      if (act === 'link') window.EveryItEuro.copyText(window.location.href, status);
      if (act === 'print') window.print();
    });

    /* Shareable state in the URL fragment: #a=key:value,key:value (never sent to a server). */
    function updateHash(a) {
      var parts = Object.keys(a).map(function (k) { return k + ':' + a[k].value; });
      if (history.replaceState) history.replaceState(null, '', '#a=' + parts.join(','));
    }
    function restoreFromHash() {
      var m = /^#a=(.+)$/.exec(window.location.hash);
      if (!m) return false;
      var restored = 0;
      decodeURIComponent(m[1]).split(',').forEach(function (pair) {
        var kv = pair.split(':');
        if (!/^[a-z_]+$/.test(kv[0] || '') || !/^[a-z-]+$/.test(kv[1] || '')) return;
        var input = form.querySelector('fieldset[data-q="' + kv[0] + '"] input[value="' + kv[1] + '"]');
        if (input) { input.checked = true; restored++; }
      });
      return restored === fieldsets.length;
    }

    form.addEventListener('submit', function (e) { e.preventDefault(); evaluate(true); });
    form.addEventListener('reset', function () {
      result.hidden = true;
      errorBox.hidden = true;
      if (history.replaceState) history.replaceState(null, '', window.location.pathname);
    });

    if (restoreFromHash()) evaluate(false);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
