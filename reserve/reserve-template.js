/**
 * RESERVE SYSTEM — Templates & static data
 */

(function (global) {
  'use strict';

  var SIZE_GROUPS = {

  apparel: {

    sizes: [
      'S',
      'M',
      'L',
      'XL',
      'XXL'
    ],

    unitLabel: 'pcs'

  },

  footwear: {

    sizes: [
      '39',
      '40',
      '41',
      '42',
      '43',
      '44'
    ],

    unitLabel: 'prs'

  },

  accessories: {

    sizes: [
      'ALL SIZE'
    ],

    unitLabel: 'pcs'

  },

  fragrance: {

    sizes: [
      '30ml',
      '50ml'
    ],

    unitLabel: 'btl'

  }

};
  var STATUS_LABELS = {
    UPCOMING: 'UPCOMING',
    RESERVE_OPEN: 'RESERVE OPEN',
    PRODUCTION: 'PRODUCTION',
    FINISHED: 'FINISHED',
    CLOSED: 'CLOSED'
  };

  var PAYMENT_MODES = [
    { id: 'FULL_PAYMENT', label: 'Full Payment', hint: 'Diskon 5% · PRIORITY 01' },
    { id: 'DP_50', label: 'DP 50%', hint: 'PRIORITY 02' },
    { id: 'NON_PRIORITY', label: 'Non Priority', hint: 'PRIORITY 03' }
  ];

  var PARTNER_COLLAPSED_VISIBLE = 6;

  var RESERVE_PRODUCTS = [
    {
  id: 'prod-heaven-acid',

  sizeGroup: 'apparel',

  name: 'HEAVEN ACID WASH',
      description: 'Kaos Oversize 16s Pigment Washed',
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80',
      imageFallback: 'https://placehold.co/800x640/0a0a0a/c9a962?text=HEAVEN',
      status: 'RESERVE_OPEN',
      unitPrice: 185000,
      trackingBadge: 'TRACKABLE PRODUCTION',
      trackingNote: 'Terhubung CV Barkah Abhipraya Production Tracking',
      productionTimeline: {
        start: '12 Juni 2026',
        finish: '28 Juni 2026'
      },
      gallery: [
        { src: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&auto=format&fit=crop&q=80', label: 'Front' },
        { src: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&auto=format&fit=crop&q=80', label: 'Back' },
        { src: 'https://images.unsplash.com/photo-1622445275570-cca0d153ff9e?w=400&auto=format&fit=crop&q=80', label: 'Detail' },
        { src: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&auto=format&fit=crop&q=80', label: 'Tag' },
        { src: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&auto=format&fit=crop&q=80', label: 'Wash' }
      ],
      analytics: { totalReservePcs: 1240, totalPartner: 86, topSize: 'L' },
      progress: { target: 2000, collected: 1240 },
      videoSample: {
        title: 'Heaven Acid Wash — Video Sample',
        embedUrl: 'https://www.youtube.com/embed/1La4QzGeaaQ?rel=0&modestbranding=1',
        externalUrl: 'https://www.youtube.com/watch?v=1La4QzGeaaQ'
      },
      partnerReserves: [
        { name: 'TOKO BANDUNG', priority: 'PRIORITY 01', qty: 24 },
        { name: 'TOKO SURABAYA', priority: 'PRIORITY 02', qty: 12 },
        { name: 'TOKO MALANG', priority: 'PRIORITY 02', qty: 8 },
        { name: 'TOKO YOGYA', priority: 'PRIORITY 03', qty: 6 },
        { name: 'TOKO BALI', priority: 'PRIORITY 03', qty: 6 }
      ],
      partnerReservesMore: [
        { name: 'TOKO JAKARTA', priority: 'PRIORITY 01', qty: 20 },
        { name: 'TOKO BEKASI', priority: 'PRIORITY 02', qty: 9 },
        { name: 'TOKO DEPOK', priority: 'PRIORITY 02', qty: 7 },
        { name: 'TOKO TANGERANG', priority: 'PRIORITY 03', qty: 5 },
        { name: 'TOKO BOGOR', priority: 'PRIORITY 03', qty: 4 },
        { name: 'TOKO SOLO', priority: 'PRIORITY 03', qty: 4 },
        { name: 'TOKO PEKANBARU', priority: 'PRIORITY 03', qty: 3 },
        { name: 'TOKO MAKASSAR', priority: 'PRIORITY 03', qty: 3 },
        { name: 'TOKO PALEMBANG', priority: 'PRIORITY 03', qty: 2 },
        { name: 'TOKO BALIKPAPAN', priority: 'PRIORITY 03', qty: 2 },
        { name: 'TOKO MANADO', priority: 'PRIORITY 03', qty: 2 },
        { name: 'TOKO PADANG', priority: 'PRIORITY 03', qty: 1 }
      ],
      partnerReservesExtra: 12
    },
    {     
  id: 'prod-inferno-zip',

  sizeGroup: 'apparel',

  name: 'INFERNO ZIP HOODIE',
      description: 'Hoodie Oversize Fleece 420GSM',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80',
      imageFallback: 'https://placehold.co/800x640/0a0a0a/ff4d2a?text=INFERNO',
      status: 'UPCOMING',
      unitPrice: 325000,
      trackingBadge: 'TRACKABLE PRODUCTION',
      trackingNote: 'Terhubung CV Barkah Abhipraya Production Tracking',
      productionTimeline: {
        start: '20 Juni 2026',
        finish: '15 Juli 2026'
      },
      gallery: [
        { src: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&auto=format&fit=crop&q=80', label: 'Front' },
        { src: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&auto=format&fit=crop&q=80', label: 'Back' },
        { src: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&auto=format&fit=crop&q=80', label: 'Detail' },
        { src: 'https://images.unsplash.com/photo-1578587018453-892bacefd3f2?w=400&auto=format&fit=crop&q=80', label: 'Zip' },
        { src: 'https://images.unsplash.com/photo-1611312449504-6fe349814ad6?w=400&auto=format&fit=crop&q=80', label: 'Fleece' }
      ],
      analytics: { totalReservePcs: 412, totalPartner: 34, topSize: 'XL' },
      progress: { target: 1500, collected: 412 },
      videoSample: {
        title: 'Inferno Zip Hoodie — Video Sample',
        embedUrl: 'https://www.youtube.com/embed/M7lc1UVf-VE?rel=0&modestbranding=1',
        externalUrl: 'https://www.youtube.com/watch?v=M7lc1UVf-VE'
      },
      partnerReserves: [
        { name: 'TOKO JAKARTA', priority: 'PRIORITY 01', qty: 18 },
        { name: 'TOKO SEMARANG', priority: 'PRIORITY 02', qty: 10 },
        { name: 'TOKO MEDAN', priority: 'PRIORITY 03', qty: 4 }
      ],
      partnerReservesMore: [
        { name: 'TOKO BANDUNG', priority: 'PRIORITY 02', qty: 8 },
        { name: 'TOKO SURABAYA', priority: 'PRIORITY 02', qty: 6 },
        { name: 'TOKO DENPASAR', priority: 'PRIORITY 03', qty: 5 },
        { name: 'TOKO YOGYA', priority: 'PRIORITY 03', qty: 4 },
        { name: 'TOKO MALANG', priority: 'PRIORITY 03', qty: 3 },
        { name: 'TOKO SOLO', priority: 'PRIORITY 03', qty: 3 },
        { name: 'TOKO SERANG', priority: 'PRIORITY 03', qty: 2 },
        { name: 'TOKO CIREBON', priority: 'PRIORITY 03', qty: 2 }
      ],
      partnerReservesExtra: 8
    }
  ];

  function getProductById(productId) {
    return RESERVE_PRODUCTS.find(function (p) {
      return (
  (p.productId || p.id) === productId
);
    }) || null;
  }

function getSizesByGroup(group){

  var cfg =
    SIZE_GROUPS[group];

  return cfg
    ? cfg.sizes
    : [];

}

function getUnitLabel(group){

  var cfg =
    SIZE_GROUPS[group];

  return cfg
    ? cfg.unitLabel
    : 'pcs';

}

  function getTemplateIds() {
    return {
      card: 'reserve-card-template',
      sizeQtyRow: 'reserve-size-qty-row-template',
      paymentOption: 'reserve-payment-option-template',
      partnerRow: 'reserve-partner-row-template',
      galleryThumb: 'reserve-gallery-thumb-template',
      cartReviewItem: 'reserve-cart-review-item-template',
      cartSizeLine: 'reserve-cart-size-line-template',
      drawerItem: 'reserve-drawer-item-template',
      drawerSizeLine: 'reserve-drawer-size-line-template',
      drawerPaymentOption: 'reserve-drawer-payment-option-template'
    };
  }

  function queryTemplate(id) {
    var el = document.getElementById(id);
    if (!el || el.tagName !== 'TEMPLATE') {
      throw new Error('[Reserve] Template not found: #' + id);
    }
    return el;
  }

  function cloneFragment(templateId) {
    return queryTemplate(templateId).content.cloneNode(true);
  }

  global.ReserveTemplate = {
    SIZE_GROUPS: SIZE_GROUPS,
getSizesByGroup: getSizesByGroup,
getUnitLabel: getUnitLabel,
    STATUS_LABELS: STATUS_LABELS,
    PAYMENT_MODES: PAYMENT_MODES,
    PARTNER_COLLAPSED_VISIBLE: PARTNER_COLLAPSED_VISIBLE,
    RESERVE_PRODUCTS: RESERVE_PRODUCTS,
    getProductById: getProductById,
    getTemplateIds: getTemplateIds,
    queryTemplate: queryTemplate,
    cloneFragment: cloneFragment
  };
})(typeof window !== 'undefined' ? window : this);

(function(){

  if(
    document.getElementById(
      'reserve-card-template'
    )
  ){
    return;
  }

  document.body.insertAdjacentHTML(
    'beforeend',
    `

  <!-- Product card -->
  <template id="reserve-card-template">
    <article class="reserve-card" role="listitem">
      <div class="reserve-card__media-wrap">
        <div class="reserve-card__media">
          <img class="reserve-card__thumb" data-product-image src="" alt="" width="800" height="640" loading="lazy" decoding="async">
          <div class="reserve-card__media-overlay" aria-hidden="true"></div>
          <span class="reserve-card__badge" data-status-badge data-status=""></span>
          <div class="reserve-card__media-caption">
            <h3 class="reserve-card__name" data-product-name></h3>
            <p class="reserve-card__desc" data-product-desc></p>
          </div>
          <button type="button" class="reserve-card__video-btn" data-action="open-video" hidden>
            <span class="reserve-card__video-icon" aria-hidden="true">▶</span>
            Lihat Video Sample
          </button>
        </div>
        <div class="reserve-gallery" data-gallery role="list" aria-label="Galeri produk"></div>
      </div>

      <header class="reserve-card__product-meta">

  <h3 class="reserve-card__title">

    <span data-product-title></span>

    <span class="reserve-card__separator">
      •
    </span>

    <span
      class="reserve-card__subtitle-inline"
      data-product-subtitle>
    </span>

  </h3>

  <p class="reserve-card__unit-price">

    <span class="reserve-card__unit-price-label">
      Harga Retail & Pesanan
    </span>

    <span data-product-unit-price>
      Rp0 / pcs
    </span>

  </p>

</header>
        
        <section
  class="reserve-production-status"
  data-tracking-block>

  <div class="reserve-progress">

    <div class="reserve-progress__head">

      <span
        class="reserve-progress__label">

        Production Status

      </span>

      <span
        class="reserve-progress__pct"
        data-progress-pct>

        0%

      </span>

    </div>

    <div
      class="reserve-progress__track">

      <div
        class="reserve-progress__fill"
        data-progress-fill>
      </div>

    </div>

  </div>

  <div
    class="reserve-tracking-row">

    <span
      class="reserve-trust__badge"
      data-tracking-badge>
    </span>

    <span
      class="reserve-tracking-note"
      data-tracking-note>
    </span>

  </div>

</section>
        
        <ul class="reserve-analytics" aria-label="Analytics">
          <li class="reserve-analytics__item">
            <span class="reserve-analytics__value"><span data-analytics-pcs>0</span></span>
            <span class="reserve-analytics__label">Reserve</span>
          </li>
          <li class="reserve-analytics__item">
            <span class="reserve-analytics__value" data-analytics-partners>0</span>
            <span class="reserve-analytics__label">Partner</span>
          </li>
          <li class="reserve-analytics__item">
            <span class="reserve-analytics__value" data-analytics-top-size>-</span>
            <span class="reserve-analytics__label">Top Size</span>
          </li>
        </ul>

        
        <section class="reserve-timeline" aria-label="Estimasi produksi">
          <div class="reserve-timeline__row">
            <span class="reserve-timeline__label">Produksi Dimulai</span>
            <span class="reserve-timeline__value" data-timeline-start>—</span>
          </div>
          <div class="reserve-timeline__row">
            <span class="reserve-timeline__label">Estimasi Selesai</span>
            <span class="reserve-timeline__value" data-timeline-finish>—</span>
          </div>
        </section>

        <section class="reserve-partners" data-partner-section aria-label="Partner reserve">
          <h4 class="reserve-block-title">Partner Reserve</h4>
          <ul class="reserve-partners__list" data-partner-list-visible role="list"></ul>
          <ul class="reserve-partners__list reserve-partners__list--extra" data-partner-list-extra role="list"></ul>
          <button type="button" class="reserve-partners__toggle" data-action="toggle-partners" hidden aria-expanded="false"></button>
        </section>

        <section class="reserve-allocation" aria-label="Alokasi per size">
          <h4 class="reserve-block-title">Alokasi Size</h4>
          <div class="reserve-size-qty-list" data-size-qty-list></div>
        </section>

        <section class="reserve-card__payment" aria-label="Mode pembayaran">
          <h4 class="reserve-block-title">Payment Mode</h4>
          <div class="reserve-payment-group" data-payment-group role="radiogroup"></div>
        </section>

        <section class="reserve-card__summary" aria-label="Ringkasan alokasi">
          <div class="reserve-summary__pcs"><span data-summary-pcs>0 pcs</span></div>
          <dl class="reserve-summary" data-summary-breakdown>
            <div class="reserve-summary__row">
              <dt>Subtotal</dt>
              <dd data-summary-subtotal>Rp0</dd>
            </div>
            <div class="reserve-summary__row reserve-summary__row--discount" data-discount-row hidden>
              <dt>Diskon 5%</dt>
              <dd data-summary-discount>−Rp0</dd>
            </div>
            <div class="reserve-summary__row" data-summary-paid-row hidden>
              <dt data-summary-paid-label>Total Dibayar</dt>
              <dd data-summary-paid-now>Rp0</dd>
            </div>
            <div class="reserve-summary__row" data-summary-remaining-row hidden>
              <dt data-summary-remaining-label>Sisa Pembayaran</dt>
              <dd data-summary-remaining>Rp0</dd>
            </div>
            <div class="reserve-summary__row reserve-summary__row--final" data-summary-final-row hidden>
              <dt>Total Final</dt>
              <dd data-summary-final>Rp0</dd>
            </div>
            <div class="reserve-summary__row reserve-summary__row--priority">
              <dt>Your Priority</dt>
              <dd><span class="reserve-priority" data-summary-priority>PRIORITY 03</span></dd>
            </div>
          </dl>
        </section>
      </div>

      <div
  class="reserve-closed-panel"
  data-reserve-closed-panel
  hidden>

  <div class="reserve-closed-panel__icon">
    🔒
  </div>

  <div class="reserve-closed-panel__content">

    <strong>
      PESANAN DITUTUP
    </strong>

    <p>
      Reserve telah berakhir.
      Pantau progres produksi
      pada bagian status produksi.
    </p>

  </div>

</div>


      <div class="reserve-card__action-bar">
        <button type="button" class="reserve-cta reserve-cta--add" data-action="add-to-reserve">
          Tambah ke Reserve
        </button>
      </div>
    </article>
  </template>

  <template id="reserve-size-qty-row-template">
    <div class="reserve-size-qty-row" data-size-qty-row>
      <span class="reserve-size-qty-row__label" data-size-label></span>
      <div class="reserve-qty reserve-qty--compact" role="group">
        <button type="button" class="reserve-qty__btn" data-action="size-qty-minus" aria-label="Kurangi">−</button>
        <span class="reserve-qty__value" data-size-qty-value aria-live="polite">0</span>
        <button type="button" class="reserve-qty__btn" data-action="size-qty-plus" aria-label="Tambah">+</button>
      </div>
    </div>
  </template>

  <template id="reserve-gallery-thumb-template">
    <button type="button" class="reserve-gallery__thumb" data-action="select-gallery" aria-pressed="false">
      <img data-gallery-thumb-img src="" alt="" width="72" height="72" loading="lazy">
      <span class="reserve-gallery__thumb-label" data-gallery-thumb-label></span>
    </button>
  </template>

  <template id="reserve-partner-row-template">

  <li
    class="reserve-partner-row"
    role="listitem">

    <div
      class="reserve-partner-row__header">

      <span
        class="reserve-partner-row__name"
        data-partner-name>
      </span>

      <span
        class="reserve-partner-row__qty">

        <span data-partner-qty>
          0
        </span>

        <span data-partner-unit>
          PCS
        </span>

      </span>

    </div>

    <span
      class="reserve-partner-row__priority"
      data-partner-priority>
    </span>

  </li>

</template>
  <template id="reserve-payment-option-template">
    <label class="reserve-payment-option">
      <input type="radio" class="reserve-payment-option__input" name="" value="">
      <span class="reserve-payment-option__copy">
        <span class="reserve-payment-option__text" data-payment-label></span>
        <span class="reserve-payment-option__hint" data-payment-hint></span>
      </span>
    </label>
  </template>

  <template id="reserve-drawer-item-template">
    <article class="reserve-drawer-item" data-drawer-item role="listitem">
      <header class="reserve-drawer-item__head">
        <div>
          <h3 class="reserve-drawer-item__name" data-drawer-item-name></h3>
          <p class="reserve-drawer-item__unit-price">
            Harga Reserve <span data-drawer-item-unit-price>Rp0 / pcs</span>
          </p>
        </div>
        <button type="button" class="reserve-drawer-item__remove" data-action="remove-cart-item" aria-label="Hapus reserve">×</button>
      </header>
      <div class="reserve-drawer-item__sizes" data-drawer-size-editor aria-label="Edit alokasi size"></div>
      <p class="reserve-drawer-item__total">
        <span class="reserve-drawer-item__total-label">TOTAL</span>
        <span data-drawer-item-total-pcs>0</span>
<span data-drawer-item-unit>PCS</span>
      </p>
      <div class="reserve-drawer-item__payment-wrap">
        <span class="reserve-block-title">Payment Mode</span>
        <div class="reserve-drawer-item__payment" data-drawer-payment-group role="radiogroup"></div>
      </div>
      <dl class="reserve-drawer-item__meta" data-drawer-item-payment-meta></dl>
    </article>
  </template>

  <template id="reserve-drawer-size-line-template">
    <div class="reserve-drawer-size-line" data-drawer-size-line>
      <span class="reserve-drawer-size-line__label" data-drawer-size-label>S</span>
      <div class="reserve-drawer-size-line__controls">
        <div class="reserve-qty reserve-qty--compact" role="group">
          <button type="button" class="reserve-qty__btn" data-action="cart-size-minus" aria-label="Kurangi">−</button>
          <span class="reserve-qty__value" data-drawer-size-qty aria-live="polite">0</span>
          <button type="button" class="reserve-qty__btn" data-action="cart-size-plus" aria-label="Tambah">+</button>
        </div>
        <span
  class="reserve-drawer-size-line__unit"
  data-drawer-size-unit>
  PCS
</span>
      </div>
    </div>
  </template>

  <template id="reserve-drawer-payment-option-template">
    <label class="reserve-drawer-pay">
      <input type="radio" class="reserve-drawer-pay__input" name="" value="">
      <span data-drawer-payment-label></span>
    </label>
  </template>
`
  );
})();
