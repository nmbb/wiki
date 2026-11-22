/* Timeline retro — filtros por estado, familia e plataforma. */
(function () {
  'use strict';
  function init() {
    var root = document.querySelector('.hex-timeline');
    if (!root) return;
    var scroller = root.querySelector('#hex-timeline-window');
    var cards = Array.from(root.querySelectorAll('.moment'));
    var buttons = Array.from(root.querySelectorAll('.filters [data-filter]'));
    if (!scroller || !cards.length || !buttons.length) return;
    function apply(value) {
      buttons.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.filter === value));
      });
      cards.forEach(function (card) {
        var match = value === 'all' || [card.dataset.state, card.dataset.platform, card.dataset.family].includes(value);
        card.hidden = !match;
        card.style.display = match ? '' : 'none';
      });
      scroller.scrollLeft = 0;
    }
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {apply(btn.dataset.filter);});
    });
    var next = root.querySelector('#hex-next');
    var prev = root.querySelector('#hex-prev');
    if (next) next.addEventListener('click', function () {scroller.scrollBy({left:690,behavior:'smooth'});});
    if (prev) prev.addEventListener('click', function () {scroller.scrollBy({left:-690,behavior:'smooth'});});
    apply('all');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
