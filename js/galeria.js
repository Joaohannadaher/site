/**
 * galeria.js — Carrega galeria dinamicamente via fotos.json
 * Requer: window.IMOVEL_ID definido na página antes deste script
 */
(function () {
  var id        = window.IMOVEL_ID;
  var container = document.getElementById('gallery-container');
  if (!container || !id) return;

  // Detecta profundidade: páginas em /imoveis/ usam ../, raiz usa ./
  var base = window.location.pathname.indexOf('/imoveis/') !== -1 ? '../' : './';
  var jsonUrl = base + 'fotos.json';

  fetch(jsonUrl)
    .then(function (r) {
      if (!r.ok) throw new Error('fotos.json não encontrado');
      return r.json();
    })
    .then(function (dados) {
      var imovel = dados[id];
      if (!imovel || imovel.fotos.length === 0) {
        mostrarPlaceholder(container);
        return;
      }
      construirGaleria(container, base, imovel.pasta, imovel.fotos);
    })
    .catch(function () {
      mostrarPlaceholder(container, true);
    });

  // ── PLACEHOLDER ──────────────────────────────────────────────────────────
  function mostrarPlaceholder(el, erro) {
    el.innerHTML =
      '<div class="gallery-placeholder">' +
        '<div class="placeholder-icon">' +
          '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">' +
            '<rect x="3" y="3" width="18" height="18" rx="2"/>' +
            '<circle cx="8.5" cy="8.5" r="1.5"/>' +
            '<path d="M21 15l-5-5L5 21"/>' +
          '</svg>' +
        '</div>' +
        '<p class="placeholder-title">' + (erro ? 'Erro ao carregar fotos' : 'Fotos em breve') + '</p>' +
        '<p class="placeholder-sub">' +
          (erro
            ? 'Abra o site via servidor local (ex: python -m http.server).'
            : 'As imagens deste imóvel serão adicionadas em breve.') +
        '</p>' +
      '</div>';
  }

  // ── GALERIA SWIPER ────────────────────────────────────────────────────────
  function construirGaleria(el, base, pasta, fotos) {
    var pastaEnc = encodeURIComponent(pasta);
    var imgBase  = base + 'imagens2/' + pastaEnc + '/';

    var slides = fotos.map(function (f) {
      return '<div class="swiper-slide"><img src="' + imgBase + encodeURIComponent(f) +
             '" alt="" loading="lazy" onerror="this.closest(\'.swiper-slide\').style.display=\'none\'"/></div>';
    }).join('');

    el.innerHTML =
      '<div class="swiper swiper-main" id="swiperMain">' +
        '<div class="swiper-wrapper">' + slides + '</div>' +
        '<div class="swiper-button-next"></div>' +
        '<div class="swiper-button-prev"></div>' +
        '<div class="swiper-pagination"></div>' +
      '</div>' +
      '<div class="swiper swiper-thumb" id="swiperThumb" style="margin-top:12px">' +
        '<div class="swiper-wrapper">' + slides + '</div>' +
      '</div>';

    requestAnimationFrame(function () {
      var thumb = new Swiper('#swiperThumb', {
        spaceBetween: 8,
        slidesPerView: Math.min(fotos.length, 6),
        freeMode: true,
        watchSlidesProgress: true,
        breakpoints: { 0: { slidesPerView: Math.min(fotos.length, 4) }, 768: { slidesPerView: Math.min(fotos.length, 6) } }
      });
      new Swiper('#swiperMain', {
        spaceBetween: 0,
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        pagination: { el: '.swiper-pagination', clickable: true },
        thumbs: { swiper: thumb },
        keyboard: { enabled: true }
      });
    });
  }
})();
