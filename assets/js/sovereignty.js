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

  var LEVELS = {
    low: {
      label: 'LOW SOVEREIGNTY RELEVANCE',
      text: 'Technological sovereignty is unlikely to be a deciding factor for this system. Evaluate it on the usual criteria — security, quality, cost, support — and keep basic exit options (data export, open standards) in the contract.'
    },
    medium: {
      label: 'MEDIUM SOVEREIGNTY RELEVANCE',
      text: 'Sovereignty is a relevant secondary criterion. Include supplier jurisdiction, data portability and exit options in the evaluation, and consider European options where they are competitive.'
    },
    high: {
      label: 'HIGH SOVEREIGNTY RELEVANCE',
      text: 'Dependency on this supplier could materially affect your organisation. Make sovereignty an explicit part of the risk assessment: document jurisdiction and ownership, require on-premises or offline operation where feasible, secure data and configuration export, and actively evaluate European or open-source alternatives.'
    },
    strategic: {
      label: 'STRATEGIC TECHNOLOGY',
      text: 'This system combines high importance with significant dependency. Treat it as strategic technology: involve management and the CISO, assess geopolitical and legal scenarios (sanctions, export restrictions, acquisition, cloud withdrawal), design a tested exit or continuity plan, and give European and open alternatives serious, documented consideration.'
    }
  };

  function init() {
    var form = document.getElementById('assessment');
    if (!form) return;
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
        errorBox.innerHTML = '<p><strong>Please answer all questions.</strong> ' + missing.length +
          ' question' + (missing.length > 1 ? 's are' : ' is') + ' still open. If you do not know the answer, choose “Not sure”.</p><ul>' +
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
          if (kind === 'impact') impact.push('Unclear: ' + reason);
          else dep.push('Unclear: ' + reason);
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
        rule = 'The system is part of critical infrastructure or OT, is operationally important, and shows three or more dependency factors.';
      } else if (impact.length >= 5 && dep.length >= 5) {
        level = 'strategic';
        rule = 'Five or more importance factors combined with five or more dependency factors.';
      } else if ((impact.length >= 3 && dep.length >= 2) || (criticalContext && dep.length >= 1) || (is('security') && dep.length >= 3)) {
        level = 'high';
        rule = criticalContext && dep.length >= 1
          ? 'Critical infrastructure or OT context combined with at least one dependency factor.'
          : (impact.length >= 3 && dep.length >= 2
            ? 'Three or more importance factors combined with two or more dependency factors.'
            : 'A security control with three or more dependency factors.');
      } else if ((impact.length >= 1 && dep.length >= 1) || impact.length >= 3 || dep.length >= 4) {
        level = 'medium';
        rule = 'Some importance and some dependency, but not enough to reach the high threshold.';
      } else {
        level = 'low';
        rule = 'Few importance factors and/or few dependency factors.';
      }

      renderResult(level, rule, impact, dep, ok, open);
      updateHash(a);
      result.hidden = false;
      if (focusResult) result.focus();
    }

    function list(items) {
      if (!items.length) return '<p class="text-muted">None identified.</p>';
      return '<ul class="reasons">' + items.map(function (i) { return '<li>' + escapeHtml(i) + '</li>'; }).join('') + '</ul>';
    }

    var lastMarkdown = '';
    function renderResult(level, rule, impact, dep, ok, open) {
      var L = LEVELS[level];
      result.setAttribute('data-level', level);
      result.innerHTML =
        '<h2 class="h3">Outcome</h2>' +
        '<div class="meter" aria-hidden="true"><span></span><span></span><span></span><span></span></div>' +
        '<div class="meter-labels" aria-hidden="true"><span>Low</span><span>Medium</span><span>High</span><span>Strategic</span></div>' +
        '<p class="result-level">' + L.label + '</p>' +
        '<p>' + L.text + '</p>' +
        '<h3>Why this classification?</h3><p>' + escapeHtml(rule) + '</p>' +
        '<div class="grid grid-2">' +
        '<div><h4>Importance factors (' + impact.length + ')</h4>' + list(impact) + '</div>' +
        '<div><h4>Dependency factors (' + dep.length + ')</h4>' + list(dep) + '</div>' +
        '</div>' +
        (ok.length ? '<h4>Mitigating factors</h4>' + list(ok) : '') +
        (open.length ? '<h4>Open questions to resolve with the supplier</h4>' + list(open) : '') +
        '<p class="note">This outcome follows the published rules below. It is not a scientific score and does not replace a formal risk assessment.</p>' +
        '<div class="btn-row no-print">' +
        '<button type="button" class="btn btn-blue btn-sm" data-act="copy">Copy as Markdown</button>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-act="link">Copy shareable link</button>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-act="print">Print / save as PDF</button>' +
        '</div><p class="note" role="status" data-copy-status></p>';

      lastMarkdown = [
        '# Technology Sovereignty Assessment',
        '',
        '**Outcome:** ' + L.label,
        '',
        L.text,
        '',
        '**Rule applied:** ' + rule,
        '',
        '## Importance factors',
        impact.map(function (i) { return '- ' + i; }).join('\n') || '- None identified',
        '',
        '## Dependency factors',
        dep.map(function (i) { return '- ' + i; }).join('\n') || '- None identified',
        '',
        ok.length ? '## Mitigating factors\n' + ok.map(function (i) { return '- ' + i; }).join('\n') + '\n' : '',
        open.length ? '## Open questions\n' + open.map(function (i) { return '- ' + i; }).join('\n') + '\n' : '',
        '_Generated with the Technology Sovereignty Assessment (' + window.location.href.split('#')[0] + '). Not a scientific score._'
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
