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
      return p.id === productId;
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

<!-- SEMUA TEMPLATE DARI reserve.html -->

<template id="reserve-card-template">

...
FULL TEMPLATE
...

</template>

<template id="reserve-size-qty-row-template">

...
FULL TEMPLATE
...

</template>

<template id="reserve-gallery-thumb-template">

...
FULL TEMPLATE
...

</template>

<template id="reserve-partner-row-template">

...
FULL TEMPLATE
...

</template>

<template id="reserve-payment-option-template">

...
FULL TEMPLATE
...

</template>

<template id="reserve-drawer-item-template">

...
FULL TEMPLATE
...

</template>

<template id="reserve-drawer-size-line-template">

...
FULL TEMPLATE
...

</template>

<template id="reserve-drawer-payment-option-template">

...
FULL TEMPLATE
...

</template>

`
  );

})();
