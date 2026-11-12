/*
 * Every IT Euro — shared behaviour.
 * Loaded synchronously in <head> so the "js" class is set before first paint;
 * everything else waits for DOMContentLoaded. No tracking, no storage, no cookies.
 */
document.documentElement.classList.add('js');

(function () {
  'use strict';

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
        function () { done('Copied to clipboard.'); },
        function () { done('Copying failed. Please select and copy the text manually.'); }
      );
    } else {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done('Copied to clipboard.'); }
      catch (err) { done('Copying failed. Please select and copy the text manually.'); }
      document.body.removeChild(ta);
    }
  }
  window.EveryItEuro = { copyText: copyText };

  /* ---------- Print buttons ---------- */
  function initPrint() {
    document.querySelectorAll('[data-print]').forEach(function (btn) {
      btn.hidden = false;
      btn.addEventListener('click', function () { window.print(); });
    });
  }

  /* ---------- "What happens when you spend €100?" explorer ---------- */
  var LEVEL_LABELS = {
    'eu': 'Largely in Europe',
    'mixed': 'Mixed',
    'non-eu': 'Largely outside Europe',
    'depends': 'Depends on the set-up'
  };

  var DIMENSIONS = [
    { key: 'sales', name: 'Sales, support and services' },
    { key: 'rd', name: 'Engineering and R&D' },
    { key: 'ip', name: 'Intellectual property' },
    { key: 'infra', name: 'Infrastructure operation' },
    { key: 'profit', name: 'Profits and shareholder returns' },
    { key: 'tax', name: 'Corporate tax base' },
    { key: 'law', name: 'Jurisdiction and control' },
    { key: 'eco', name: 'Ecosystem and skills' }
  ];

  var PROFILES = {
    'eu-full': {
      sales: ['eu', 'Local sales, support and consulting teams are typically employed in Europe.'],
      rd: ['eu', 'Product development happens mainly in Europe, building engineering depth here.'],
      ip: ['eu', 'Source code, patents and know-how are owned by a European entity.'],
      infra: ['eu', 'Runs on the vendor’s own or other European-operated infrastructure, or on yours.'],
      profit: ['mixed', 'Profits accrue to a European company; dividends go to its shareholders, who may be located anywhere.'],
      tax: ['eu', 'Profits are generally taxed where the company is resident and operates — here, in Europe.'],
      law: ['eu', 'The supplier and its parent are subject primarily to European law.'],
      eco: ['eu', 'Revenue funds European hiring, partners, start-ups and spin-offs over time.']
    },
    'eu-on-hyperscaler': {
      sales: ['eu', 'Customer-facing teams are usually European.'],
      rd: ['eu', 'The application itself is developed in Europe.'],
      ip: ['eu', 'The application IP is European; the underlying platform IP is not.'],
      infra: ['mixed', 'Data may sit in EU regions, but the infrastructure is operated by a non-European provider.'],
      profit: ['mixed', 'Part of every euro pays platform fees that flow to the infrastructure provider.'],
      tax: ['mixed', 'The vendor pays tax in Europe; the platform provider’s share is taxed according to its own structure.'],
      law: ['mixed', 'The vendor is European, but its infrastructure provider may be subject to non-European law with extraterritorial reach.'],
      eco: ['mixed', 'Strengthens European software skills, while deepening reliance on a non-European platform.']
    },
    'reseller': {
      sales: ['eu', 'The reseller or integrator employs local staff and keeps its margin in Europe.'],
      rd: ['non-eu', 'Core product development takes place wherever the vendor has its engineering centres.'],
      ip: ['non-eu', 'The product IP is owned by the non-European vendor.'],
      infra: ['depends', 'Depends on whether the product runs on-premises or in the vendor’s cloud.'],
      profit: ['mixed', 'The reseller margin stays local; licence and subscription revenue goes to the vendor.'],
      tax: ['mixed', 'The reseller pays tax locally; the vendor’s share is taxed according to its corporate structure.'],
      law: ['non-eu', 'Updates, licensing and product roadmap are controlled by the vendor and its home jurisdiction.'],
      eco: ['mixed', 'Builds valuable local implementation skills, but not product-development capability.']
    },
    'global-with-eu-ops': {
      sales: ['eu', 'Large vendors often employ many people in Europe in sales, support and operations.'],
      rd: ['mixed', 'Some global vendors run significant R&D centres in Europe; core decisions are usually taken elsewhere.'],
      ip: ['non-eu', 'IP is usually held by the parent company or an IP-holding entity outside Europe.'],
      infra: ['mixed', 'European data centres may be used, but operated under the parent company’s control.'],
      profit: ['non-eu', 'Profits ultimately accrue to the parent company and its shareholders.'],
      tax: ['depends', 'European subsidiaries pay tax here; how much profit is taxed in Europe depends on the corporate and transfer-pricing structure.'],
      law: ['non-eu', 'The parent company remains subject to its home jurisdiction, which may claim extraterritorial reach.'],
      eco: ['mixed', 'Creates European jobs and skills, while strategic capability is concentrated at headquarters.']
    },
    'open-source-eu-integrator': {
      sales: ['eu', 'Support, integration and hosting are bought from European service providers.'],
      rd: ['depends', 'Development may be global or European; check who actually maintains the code.'],
      ip: ['depends', 'An open licence lets anyone use, inspect and fork the code — control matters more than ownership.'],
      infra: ['eu', 'You or a European provider run the software on infrastructure you choose.'],
      profit: ['eu', 'Service revenue stays largely with European providers.'],
      tax: ['eu', 'Service providers are taxed where they operate.'],
      law: ['eu', 'An open licence cannot be withdrawn by a foreign authority; you control the deployment.'],
      eco: ['eu', 'Funds European maintainers and providers — if you actually contribute or pay for support.']
    }
  };

  function initExplorer() {
    var root = document.getElementById('euro-explorer');
    if (!root) return;
    var output = root.querySelector('[data-explorer-output]');
    var radios = root.querySelectorAll('input[name="profile"]');

    function render(profileKey) {
      var profile = PROFILES[profileKey];
      if (!profile) return;
      var html = '';
      DIMENSIONS.forEach(function (d) {
        var entry = profile[d.key];
        var level = entry[0];
        html += '<div class="dim-row">' +
          '<div class="dim-name">' + d.name + '</div>' +
          '<div><div class="scale" data-level="' + level + '" aria-hidden="true"><i></i><i></i><i></i></div>' +
          '<span class="scale-label">' + LEVEL_LABELS[level] + '</span></div>' +
          '<div class="dim-note">' + entry[1] + '</div>' +
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
      if (progress) progress.textContent = done + ' of ' + boxes.length + ' questions answered';
    }
    boxes.forEach(function (b) { b.addEventListener('change', update); });
    update();

    var copyBtn = document.querySelector('[data-checklist-copy]');
    if (copyBtn) {
      copyBtn.hidden = false;
      copyBtn.addEventListener('click', function () {
        var lines = ['# Digital Sovereignty Procurement Checklist', '', 'Source: ' + window.location.href.split('#')[0], ''];
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
    initNav();
    initPrint();
    initExplorer();
    initChecklist();
  });
})();
