/*
 * EU Tech Compass — fills the ad units that are actually visible.
 *
 * The build places two side rails (wide screens) and one inline unit (narrower screens);
 * CSS hides whichever does not fit. AdSense fills the first unprocessed <ins class="adsbygoogle">
 * in the document, so units start as "adsbygoogle-pending" and only visible ones are promoted.
 * Hidden units never request an ad. When the window is resized, newly visible units are filled.
 */
(function () {
  'use strict';

  function fill() {
    var units = document.querySelectorAll('ins.adsbygoogle-pending');
    for (var i = 0; i < units.length; i++) {
      var unit = units[i];
      if (unit.offsetParent === null || unit.offsetWidth === 0) continue;
      unit.classList.remove('adsbygoogle-pending');
      unit.classList.add('adsbygoogle');
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        /* an ad that fails to load must never break the page */
      }
    }
  }

  // "Cookie settings" in the footer re-opens Google's consent message (Google's documented API).
  document.addEventListener('click', function (e) {
    var target = e.target;
    if (!target || !target.closest || !target.closest('.consent-settings')) return;
    window.googlefc = window.googlefc || {};
    window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
    window.googlefc.callbackQueue.push(function () {
      if (typeof window.googlefc.showRevocationMessage === 'function') window.googlefc.showRevocationMessage();
    });
  });

  var timer;
  window.addEventListener('resize', function () {
    clearTimeout(timer);
    timer = setTimeout(fill, 300);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fill);
  } else {
    fill();
  }
})();
