/*
 * Every IT Euro — shared behaviour.
 * Loaded synchronously in <head> so the "js" class is set (and any language redirect happens)
 * before first paint; everything else waits for DOMContentLoaded.
 * No tracking and no cookies. The only thing ever stored is a language you pick yourself in the
 * language switcher (localStorage key "every-it-euro-lang"); it never leaves your browser.
 */
document.documentElement.classList.add('js');

var LANG_KEY = 'every-it-euro-lang';

/*
 * Language selection. English pages live in the site root, translations in /de/, /fr/, /es/, /it/
 * and /pl/. Only root (English) pages redirect, so a link to a translated page is always respected:
 *   1. a language the visitor picked earlier in the switcher wins;
 *   2. otherwise the first supported language in the browser/device preferences is used;
 *   3. otherwise the page stays in English.
 */
(function () {
  'use strict';
  var SUPPORTED = ['en', 'de', 'fr', 'es', 'it', 'pl'];
  var root = document.documentElement;
  if (root.getAttribute('lang') !== 'en' || root.hasAttribute('data-no-lang-redirect')) return;

  var target = null;
  var stored = null;
  try { stored = window.localStorage.getItem(LANG_KEY); } catch (e) { /* storage unavailable */ }
  if (stored && SUPPORTED.indexOf(stored) !== -1) {
    target = stored;
  } else {
    var prefs = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || ''];
    for (var i = 0; i < prefs.length; i++) {
      var code = String(prefs[i]).toLowerCase().split('-')[0];
      if (SUPPORTED.indexOf(code) !== -1) { target = code; break; }
    }
  }
  if (!target || target === 'en') return;
  var file = window.location.pathname.split('/').pop();
  window.location.replace(target + '/' + file + window.location.search + window.location.hash);
})();

(function () {
  'use strict';

  /*
   * Interface strings: assets/js/i18n/en.js (always loaded) defines the English texts; a translation file
   * (de.js, fr.js, …) loaded after it overrides them key by key. Missing translations fall back to English.
   */
  function mergeStrings(base, over) {
    if (!over || typeof base !== 'object' || Array.isArray(base)) return over !== undefined ? over : base;
    var out = {};
    Object.keys(base).forEach(function (k) {
      out[k] = (over[k] === undefined) ? base[k] : mergeStrings(base[k], over[k]);
    });
    return out;
  }
  var S = mergeStrings(window.EveryItEuroStringsEn || {}, window.EveryItEuroStrings);

  /* ---------- Language switcher: remember an explicit choice ---------- */
  function initLanguageSwitch() {
    document.querySelectorAll('.lang-switch a[data-lang]').forEach(function (a) {
      a.addEventListener('click', function () {
        try { window.localStorage.setItem(LANG_KEY, a.getAttribute('data-lang')); } catch (e) { /* storage unavailable */ }
      });
    });
  }

  /* ---------- Mobile navigation ---------- */
  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('site-nav');
    if (!toggle || !nav) return;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    }
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ---------- Clipboard helper (shared with other scripts) ---------- */
  function copyText(text, statusEl) {
    function done(msg) {
      if (statusEl) {
        statusEl.textContent = msg;
        window.setTimeout(function () { statusEl.textContent = ''; }, 4000);
      }
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(
        function () { done(S.copied); },
        function () { done(S.copyFailed); }
      );
    } else {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(S.copied); }
      catch (err) { done(S.copyFailed); }
      document.body.removeChild(ta);
    }
  }
  /* Replace {name} placeholders in a translated string. */
  function fmt(str, values) {
    return String(str).replace(/\{(\w+)\}/g, function (m, k) { return values[k] !== undefined ? values[k] : m; });
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  window.EveryItEuro = { copyText: copyText, fmt: fmt, escapeHtml: escapeHtml, strings: S };

  /* ---------- Print buttons ---------- */
  function initPrint() {
    document.querySelectorAll('[data-print]').forEach(function (btn) {
      btn.hidden = false;
      btn.addEventListener('click', function () { window.print(); });
    });
  }

  /* ---------- "What happens when you spend €100?" explorer ---------- */
  /* Level of each dimension per profile. The explanatory notes are in assets/js/i18n/<lang>.js. */
  var PROFILES = {
    'eu-full': { sales: 'eu', rd: 'eu', ip: 'eu', infra: 'eu', profit: 'mixed', tax: 'eu', law: 'eu', eco: 'eu' },
    'eu-on-hyperscaler': { sales: 'eu', rd: 'eu', ip: 'eu', infra: 'mixed', profit: 'mixed', tax: 'mixed', law: 'mixed', eco: 'mixed' },
    'reseller': { sales: 'eu', rd: 'non-eu', ip: 'non-eu', infra: 'depends', profit: 'mixed', tax: 'mixed', law: 'non-eu', eco: 'mixed' },
    'global-with-eu-ops': { sales: 'eu', rd: 'mixed', ip: 'non-eu', infra: 'mixed', profit: 'non-eu', tax: 'depends', law: 'non-eu', eco: 'mixed' },
    'open-source-eu-integrator': { sales: 'eu', rd: 'depends', ip: 'depends', infra: 'eu', profit: 'eu', tax: 'eu', law: 'eu', eco: 'eu' }
  };
  var DIMENSIONS = ['sales', 'rd', 'ip', 'infra', 'profit', 'tax', 'law', 'eco'];

  function initExplorer() {
    var root = document.getElementById('euro-explorer');
    if (!root) return;
    var output = root.querySelector('[data-explorer-output]');
    var radios = root.querySelectorAll('input[name="profile"]');

    function render(profileKey) {
      var profile = PROFILES[profileKey];
      if (!profile) return;
      var T = S.explorer;
      var html = '';
      DIMENSIONS.forEach(function (d) {
        var level = profile[d];
        html += '<div class="dim-row">' +
          '<div class="dim-name">' + escapeHtml(T.dimensions[d]) + '</div>' +
          '<div><div class="scale" data-level="' + level + '" aria-hidden="true"><i></i><i></i><i></i></div>' +
          '<span class="scale-label">' + escapeHtml(T.levels[level]) + '</span></div>' +
          '<div class="dim-note">' + escapeHtml(T.notes[profileKey][d]) + '</div>' +
          '</div>';
      });
      output.innerHTML = html;
    }

    radios.forEach(function (r) {
      r.addEventListener('change', function () { if (r.checked) render(r.value); });
    });
    var checked = root.querySelector('input[name="profile"]:checked');
    render(checked ? checked.value : 'eu-full');
  }

  /* ---------- Procurement checklist ---------- */
  function initChecklist() {
    var root = document.getElementById('checklist');
    if (!root) return;
    var boxes = root.querySelectorAll('input[type="checkbox"]');
    var progress = document.querySelector('[data-checklist-progress]');
    var status = document.querySelector('[data-checklist-status]');

    function update() {
      var done = 0;
      boxes.forEach(function (b) { if (b.checked) done++; });
      if (progress) progress.textContent = fmt(S.checklist.progress, { done: done, total: boxes.length });
    }
    boxes.forEach(function (b) { b.addEventListener('change', update); });
    update();

    var copyBtn = document.querySelector('[data-checklist-copy]');
    if (copyBtn) {
      copyBtn.hidden = false;
      copyBtn.addEventListener('click', function () {
        var lines = ['# ' + S.checklist.markdownTitle, '', S.checklist.markdownSource + ': ' + window.location.href.split('#')[0], ''];
        root.querySelectorAll('.checklist-group').forEach(function (g) {
          var h = g.querySelector('h3');
          lines.push('## ' + (h ? h.textContent.trim() : ''));
          g.querySelectorAll('li').forEach(function (li) {
            var input = li.querySelector('input');
            var q = li.querySelector('.q');
            lines.push('- [' + (input && input.checked ? 'x' : ' ') + '] ' + (q ? q.textContent.trim() : ''));
          });
          lines.push('');
        });
        copyText(lines.join('\n'), status);
      });
    }
    var resetBtn = document.querySelector('[data-checklist-reset]');
    if (resetBtn) {
      resetBtn.hidden = false;
      resetBtn.addEventListener('click', function () {
        boxes.forEach(function (b) { b.checked = false; });
        update();
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initLanguageSwitch();
    initNav();
    initPrint();
    initExplorer();
    initChecklist();
  });
})();
