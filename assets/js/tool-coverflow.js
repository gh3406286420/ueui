/* 工具页 Coverflow 3D 卡片轮播（页面滚动驱动） */
(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var grid = document.querySelector('.tool-grid');
    if (!grid) return;

    var cards = Array.prototype.slice.call(grid.children);
    if (!cards.length) return;

    // 构建 Coverflow 结构
    var wrapper = document.createElement('div');
    wrapper.className = 'tool-coverflow';

    var viewport = document.createElement('div');
    viewport.className = 'tool-coverflow__viewport';
    viewport.tabIndex = 0;
    viewport.setAttribute('aria-label', '工具卡片轮播');

    var track = document.createElement('div');
    track.className = 'tool-coverflow__track';
    viewport.appendChild(track);

    // 页面滚动驱动：给轮播区域足够高的滚动行程
    wrapper.style.height = (cards.length * 100) + 'vh';

    wrapper.appendChild(viewport);
    grid.replaceWith(wrapper);

    // 把原卡片移入 track
    cards.forEach(function (card, index) {
      card.classList.add('coverflow-card');
      card.setAttribute('data-index', index);
      track.appendChild(card);
    });

    var count = cards.length;
    var pos = 0;

    function render() {
      cards.forEach(function (card, index) {
        var offset = index - pos;
        var abs = Math.abs(offset);
        var scale = Math.max(0.72, 1 - abs * 0.14);
        var rotateY = offset * -28;
        var translateX = offset * 58;
        var translateZ = abs * -90;
        var opacity = Math.max(0.25, 1 - abs * 0.3);
        var zIndex = 100 - abs;

        card.style.transform =
          'translate(-50%, -50%) translateX(' + translateX + 'px) ' +
          'translateZ(' + translateZ + 'px) rotateY(' + rotateY + 'deg) scale(' + scale + ')';
        card.style.opacity = opacity;
        card.style.zIndex = zIndex;
        card.classList.toggle('is-active', Math.abs(offset) < 0.5);
        card.classList.toggle('is-adjacent', abs >= 0.5 && abs < 1.5);
      });

      viewport.setAttribute('aria-activedescendant', 'tool-card-' + Math.round(pos));
    }

    function go(index) {
      if (index < 0) index = count - 1;
      if (index >= count) index = 0;
      pos = index;
      render();
    }

    function next() { go(Math.round(pos) + 1); }
    function prev() { go(Math.round(pos) - 1); }

    function updateFromScroll() {
      var rect = wrapper.getBoundingClientRect();
      var viewportHeight = window.innerHeight;
      var total = wrapper.offsetHeight - viewportHeight;
      var progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      var nextPos = progress * (count - 1);
      if (Math.abs(nextPos - pos) > 0.001) {
        pos = nextPos;
        render();
      }
    }

    window.addEventListener('scroll', updateFromScroll, { passive: true });
    window.addEventListener('resize', updateFromScroll);
    updateFromScroll();

    viewport.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      }
    });

    render();
  });
})();
