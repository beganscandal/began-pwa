/**
 * RESERVE SYSTEM — Template cloning & DOM updates
 */

(function (global) {
  'use strict';

  var Template = global.ReserveTemplate;
  var State = global.ReserveState;
  var Checkout = global.ReserveCheckout;

  function setText(root, selector, text) {
    var el = root.querySelector(selector);
    if (el) el.textContent = text;
  }

  function appendPartnerRow(listEl, partner) {
    var fragment = Template.cloneFragment(Template.getTemplateIds().partnerRow);
    var row = fragment.querySelector('.reserve-partner-row');
    if (!row) return;

    setText(row, '[data-partner-name]', partner.name);
    setText(row, '[data-partner-priority]', partner.priority);
    setText(row, '[data-partner-qty]', String(partner.qty));

    var priorityEl = row.querySelector('[data-partner-priority]');
    if (priorityEl) {
      priorityEl.dataset.priorityLevel = partner.priority.replace(/\s/g, '');
    }

    listEl.appendChild(fragment);
  }

  function buildPartnerSection(cardEl, product, expanded) {
    var visibleList = cardEl.querySelector('[data-partner-list-visible]');
    var extraList = cardEl.querySelector('[data-partner-list-extra]');
    var toggleBtn = cardEl.querySelector('[data-action="toggle-partners"]');
    if (!visibleList || !extraList) return;

    var primary = product.partnerReserves || [];
    var more = product.partnerReservesMore || [];
    var limit = Template.PARTNER_COLLAPSED_VISIBLE;
    var visible = primary.slice(0, limit);
    var extra = primary.slice(limit).concat(more);
    var extraCount = product.partnerReservesExtra || extra.length;

    visibleList.innerHTML = '';
    extraList.innerHTML = '';

    visible.forEach(function (p) {
      appendPartnerRow(visibleList, p);
    });

    extra.forEach(function (p) {
      appendPartnerRow(extraList, p);
    });

    var section = cardEl.querySelector('[data-partner-section]');
    if (section) {
      section.classList.toggle('is-expanded', expanded);
      section.dataset.expanded = expanded ? 'true' : 'false';
    }

    if (toggleBtn) {
      if (extraCount > 0 && extra.length > 0) {
        toggleBtn.hidden = false;
        toggleBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        toggleBtn.innerHTML =
          (expanded ? 'SEMBUNYIKAN' : '+' + extraCount + ' PARTNER LAINNYA') +
          ' <span class="reserve-partners__chevron" aria-hidden="true">' +
          (expanded ? '▲' : '▼') + '</span>';
      } else {
        toggleBtn.hidden = true;
      }
    }
  }

  function buildSizeQtyRows(cardEl, productId, state, product) {
    var container = cardEl.querySelector('[data-size-qty-list]');
    if (!container) return;

    container.innerHTML = '';
    var sizes =
  (
    product.realtimeSizes ||
    product.sizes ||
    []
  ).map(function(size){

    return size.sizeLabel;

  });
    
sizes.forEach(function (size) {
      var fragment = Template.cloneFragment(Template.getTemplateIds().sizeQtyRow);
      var row = fragment.querySelector('[data-size-qty-row]');
      if (!row) return;

      row.dataset.size = size;
      setText(row, '[data-size-label]', size);

      var qty = state.sizeQty[size] || 0;
      setText(row, '[data-size-qty-value]', String(qty));

      row.querySelectorAll('[data-action="size-qty-minus"], [data-action="size-qty-plus"]').forEach(function (btn) {
        btn.dataset.size = size;
        btn.dataset.productId = productId;
      });

      var minusBtn = row.querySelector('[data-action="size-qty-minus"]');
      if (minusBtn) minusBtn.disabled = qty <= State.MIN_QTY;

      container.appendChild(fragment);
    });
  }

  function buildPaymentOptions(cardEl, productId, selectedMode) {
    var container = cardEl.querySelector('[data-payment-group]');
    if (!container) return;

    container.innerHTML = '';
    Template.PAYMENT_MODES.forEach(function (mode) {
      var fragment = Template.cloneFragment(Template.getTemplateIds().paymentOption);
      var label = fragment.querySelector('.reserve-payment-option');
      var input = fragment.querySelector('input[type="radio"]');
      if (!label || !input) return;

      var inputId = productId + '-pay-' + mode.id;
      input.id = inputId;
      input.name = 'payment-' + productId;
      input.value = mode.id;
      input.dataset.productId = productId;
      input.checked = mode.id === selectedMode;

      setText(label, '[data-payment-label]', mode.label);
      setText(label, '[data-payment-hint]', mode.hint || '');
      label.setAttribute('for', inputId);
      if (mode.id === selectedMode) label.classList.add('is-active');
      container.appendChild(fragment);
    });
  }

  function buildGallery(cardEl, product, state) {

  var productId =
    product.productId ||
    product.id;

  var container =
    cardEl.querySelector('[data-gallery]');

  if(
    !container ||
    !product.gallery ||
    !product.gallery.length
  ){
    return;
  }

  container.innerHTML = '';

  product.gallery.forEach(function(item, index){

    var fragment =
      Template.cloneFragment(
        Template.getTemplateIds().galleryThumb
      );

    var btn =
      fragment.querySelector(
        '[data-action="select-gallery"]'
      );

    if(!btn) return;

    btn.dataset.imageIndex =
      String(index);

    btn.dataset.productId =
      productId;

    btn.setAttribute(
      'aria-label',
      item.label || 'Gambar produk'
    );

    var img =
      btn.querySelector(
        '[data-gallery-thumb-img]'
      );

    if(img){

      img.src = item.src;

      img.alt =
        product.name +
        ' — ' +
        (item.label || '');

    }

    var labelEl =
      btn.querySelector(
        '[data-gallery-thumb-label]'
      );

    if(labelEl){
      labelEl.textContent =
        item.label || '';
    }

    if(
      index === state.heroImageIndex
    ){
      btn.classList.add('is-active');
    }

    container.appendChild(fragment);

  });

}
  function setHeroImage(cardEl, product, index) {
    var gallery = product.gallery && product.gallery.length ? product.gallery : [{ src: product.image }];
    var item = gallery[index] || gallery[0];
    var img = cardEl.querySelector('[data-product-image]');
    if (!img || !item) return;

    img.src = item.src;
    img.onerror = function () {
      if (product.imageFallback) {
        img.onerror = null;
        img.src = product.imageFallback;
      }
    };

    cardEl.querySelectorAll('[data-action="select-gallery"]').forEach(function (btn) {
      var active = Number(btn.dataset.imageIndex) === index;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function populateProgress(
  cardEl,
  trackingBadge
){

  var STATUS_PROGRESS = {

    'PESANAN DIBUKA': 10,
    'PROSES PRODUKSI': 50,
    'SELESAI PRODUKSI': 90,
    'PENGIRIMAN': 100

  };

  var percent =
    STATUS_PROGRESS[
      String(trackingBadge || '')
        .trim()
        .toUpperCase()
    ] || 10;

  setText(
    cardEl,
    '[data-progress-pct]',
    percent + '%'
  );

  var fill =
    cardEl.querySelector(
      '[data-progress-fill]'
    );

  if(fill){

    fill.style.width =
      percent + '%';

  }

  var track =
    cardEl.querySelector(
      '.reserve-progress__track'
    );

  if(track){

    track.setAttribute(
      'aria-valuenow',
      String(percent)
    );

  }

}

  function populateTimeline(cardEl, timeline) {
    if (!timeline) return;
    setText(cardEl, '[data-timeline-start]', timeline.start || '—');
    setText(cardEl, '[data-timeline-finish]', timeline.finish || '—');
  }

  function populateTracking(
  cardEl,
  product
){

  setText(
    cardEl,
    '[data-tracking-badge]',
    product.trackingBadge || ''
  );

  setText(
    cardEl,
    '[data-tracking-note]',
    product.trackingNote || ''
  );

  var block =
    cardEl.querySelector(
      '[data-tracking-block]'
    );

  if(block){

    block.hidden =
      !product.trackingBadge;

  }

}

  function applyReserveStatus(
  cardEl,
  product
){
    
    console.log(
  'STATUS CHECK',
  product.productName,
  product.status,
  product.reserveStatus
);

  const isOpen =
  String(
    product.status || ''
  )
  .trim()
  .toUpperCase() ===
  'RESERVE_OPEN';

  const closedPanel =
    cardEl.querySelector(
      '[data-reserve-closed-panel]'
    );

  const addBtn =
    cardEl.querySelector(
      '[data-action="add-to-reserve"]'
    );

  const sizeSection =
    cardEl.querySelector(
      '.reserve-allocation'
    );

  const paymentSection =
    cardEl.querySelector(
      '.reserve-card__payment'
    );

  const summarySection =
    cardEl.querySelector(
      '.reserve-card__summary'
    );

  if(isOpen){

    if(closedPanel)
      closedPanel.hidden = true;

    if(addBtn)
      addBtn.hidden = false;

    if(sizeSection)
      sizeSection.hidden = false;

    if(paymentSection)
      paymentSection.hidden = false;

    if(summarySection)
      summarySection.hidden = false;

    return;

  }

  if(closedPanel)
    closedPanel.hidden = false;

  if(addBtn)
    addBtn.hidden = true;

  if(sizeSection)
    sizeSection.hidden = true;

  if(paymentSection)
    paymentSection.hidden = true;

  if(summarySection)
    summarySection.hidden = true;

}
  
  function populateAnalytics(cardEl, analytics) {
    setText(
  cardEl,
  '[data-analytics-pcs]',
  Checkout.formatNumber(
    analytics.totalReserveQty
  )
);
    setText(cardEl, '[data-analytics-partners]', Checkout.formatNumber(analytics.totalPartner));
    setText(cardEl, '[data-analytics-top-size]', analytics.topSize);
  }

  function setupVideoButton(cardEl, product) {
    var btn = cardEl.querySelector('[data-action="open-video"]');
    if (!btn || !product.videoSample) {
      if (btn) btn.hidden = true;
      return;
    }
    btn.hidden = false;
    btn.dataset.action = 'open-video';
    btn.dataset.videoEmbed = product.videoSample.embedUrl || '';
    btn.dataset.videoExternal = product.videoSample.externalUrl || '';
    btn.dataset.videoTitle = product.videoSample.title || 'Video Sample';
  }

  function populateSummary(cardEl, state, product) {
    var summary = Checkout.calculateSummary(state);
    setText(cardEl, '[data-summary-subtotal]', Checkout.formatCurrency(summary.subtotal));
    setText(cardEl, '[data-summary-discount]', '−' + Checkout.formatCurrency(summary.discount));
    setText(cardEl, '[data-summary-final]', Checkout.formatCurrency(summary.finalAmount));
    setText(cardEl, '[data-summary-priority]', summary.priorityLabel);
    setText(cardEl, '[data-summary-pcs]', String(summary.totalPcs) + ' pcs');

    if (product) {
      setText(cardEl, '[data-product-unit-price]', Checkout.formatUnitPrice(product.unitPrice));
    }

    var discountRow = cardEl.querySelector('[data-discount-row]');
    if (discountRow) discountRow.hidden = !summary.hasDiscount;

    var paidRow = cardEl.querySelector('[data-summary-paid-row]');
    var remainingRow = cardEl.querySelector('[data-summary-remaining-row]');
    var finalRow = cardEl.querySelector('[data-summary-final-row]');
    var paidLabel = cardEl.querySelector('[data-summary-paid-label]');
    var remainingLabel = cardEl.querySelector('[data-summary-remaining-label]');

    if (paidRow) paidRow.hidden = summary.totalPcs < 1;
    if (remainingRow) remainingRow.hidden = summary.totalPcs < 1;
    if (finalRow) finalRow.hidden = summary.paymentMode !== 'DP_50' || summary.totalPcs < 1;

    setText(cardEl, '[data-summary-paid-now]', Checkout.formatCurrency(summary.paidNow));
    setText(cardEl, '[data-summary-remaining]', Checkout.formatCurrency(summary.remaining));

    if (summary.paymentMode === 'FULL_PAYMENT') {
      if (paidLabel) paidLabel.textContent = 'Total Dibayar';
      if (remainingLabel) remainingLabel.textContent = 'Sisa Pembayaran';
    } else if (summary.paymentMode === 'DP_50') {
      if (paidLabel) paidLabel.textContent = 'DP Dibayar Sekarang';
      if (remainingLabel) remainingLabel.textContent = 'Sisa Pelunasan';
    } else {
      if (paidLabel) paidLabel.textContent = 'Belum Ada Pembayaran';
      if (remainingLabel) remainingLabel.textContent = 'Sisa Pembayaran';
    }

    var priorityEl = cardEl.querySelector('[data-summary-priority]');
    if (priorityEl) priorityEl.dataset.priorityLevel = summary.priority;

    var addBtn = cardEl.querySelector('[data-action="add-to-reserve"]');
    if (addBtn) addBtn.disabled = summary.totalPcs < 1;
  }

  function syncCard(cardEl, productId, product) {
    var state = State.getState(productId);
    if (!state || !product) return;

    buildSizeQtyRows(cardEl, productId, state, product);
    updatePaymentActive(cardEl, state.paymentMode);
    populateSummary(cardEl, state, product);
    setHeroImage(cardEl, product, state.heroImageIndex);
    buildPartnerSection(cardEl, product, state.partnersExpanded);
  }

  function updatePaymentActive(cardEl, selectedMode) {
    cardEl.querySelectorAll('.reserve-payment-option').forEach(function (label) {
      var input = label.querySelector('input[type="radio"]');
      var isActive = input && input.value === selectedMode;
      label.classList.toggle('is-active', isActive);
      if (input) input.checked = isActive;
    });
  }

  function createProductCard(product) {

  var productId =
    product.productId ||
    product.id;

  var fragment =
    Template.cloneFragment(
      Template.getTemplateIds().card
    );

  var cardEl =
    fragment.querySelector(
      '.reserve-card'
    );

  if(!cardEl){
    return null;
  }

  cardEl.dataset.productId =
    productId;

  var state =
    State.getState(productId);

  if(!state){
    return null;
  }

  setText(
    cardEl,
    '[data-product-name]',
    product.name
  );

  setText(
    cardEl,
    '[data-product-desc]',
    product.description
  );

  setText(
    cardEl,
    '[data-product-title]',
    product.name
  );

  setText(
    cardEl,
    '[data-product-subtitle]',
    product.description
  );

  var badge =
    cardEl.querySelector(
      '[data-status-badge]'
    );

  if(badge){

 const reserveStatus =
  String(
    product.status || ''
  ).toUpperCase();

  const STATUS_LABELS = {

    RESERVE_OPEN:
      'PESANAN DIBUKA',

    RESERVE_CLOSE:
      'PESANAN DITUTUP'

  };

  badge.textContent =
    STATUS_LABELS[
      reserveStatus
    ] || reserveStatus;

  badge.dataset.status =
    reserveStatus;

}
  populateAnalytics(
    cardEl,
    product.analytics
  );
    
    populateProgress(
  cardEl,
  product.trackingBadge
);

 
  populateTimeline(
    cardEl,
    product.productionTimeline || {
      start:
        product.EstimasiTanggalProduksi,

      finish:
        product.EstimasiSelesaiProduksi
    }
  );

  populateTracking(
    cardEl,
    product
  );

    applyReserveStatus(
  cardEl,
  product
);

  setupVideoButton(
    cardEl,
    product
  );

  buildGallery(
    cardEl,
    product,
    state
  );

  setHeroImage(
    cardEl,
    product,
    state.heroImageIndex
  );

  buildPartnerSection(
    cardEl,
    product,
    state.partnersExpanded
  );

  buildSizeQtyRows(
    cardEl,
    productId,
    state,
    product
  );

  buildPaymentOptions(
    cardEl,
    productId,
    state.paymentMode
  );

  populateSummary(
    cardEl,
    state,
    product
  );

  return cardEl;

}

  function renderProductGrid(container, products) {
    if (!container) return;
    container.innerHTML = '';
    products.forEach(function (product) {
      var card = createProductCard(product);
      if (card) container.appendChild(card);
    });
  }

  function findCard(root, productId) {
    return root.querySelector('.reserve-card[data-product-id="' + productId + '"]');
  }
  
function syncRealtimeAnalytics(
  cardEl,
  product
){

  populateAnalytics(
    cardEl,
    product.analytics
  );

 populateProgress(
  cardEl,
  product.trackingBadge
);

  var productId =
  product.productId ||
  product.id;

var state =
  State.getState(
    productId
  );
  
  if(state){

    buildPartnerSection(
      cardEl,
      product,
      state.partnersExpanded
    );

  }

}  

  function syncRealtimeSizes(
  cardEl,
  currentProduct,
  latestProduct
){

  var oldSizes =
  (
    currentProduct.realtimeSizes ||
    currentProduct.sizes ||
    []
  ).map(function(size){

    return size.sizeLabel;

  });

var newSizes =
  (
    latestProduct.realtimeSizes ||
    latestProduct.sizes ||
    []
  ).map(function(size){

    return size.sizeLabel;

  });
    
  if(
    JSON.stringify(oldSizes)
    ===
    JSON.stringify(newSizes)
  ){
    return;
  }

 currentProduct.realtimeSizes =
  latestProduct.realtimeSizes ||
  latestProduct.sizes ||
  [];
    
 var productId =
  latestProduct.productId ||
  latestProduct.id;

var state =
  State.getState(
    productId
  );

  if(!state){
    return;
  }

  newSizes.forEach(function(size){

    if(
      !(size in state.sizeQty)
    ){

      state.sizeQty[size] = 0;

    }

  });

  buildSizeQtyRows(
    cardEl,
    productId,
    state,
    latestProduct
  );

}
  global.ReserveRender = {
  renderProductGrid: renderProductGrid,
  syncCard: syncCard,
  findCard: findCard,
  setHeroImage: setHeroImage,
  buildPartnerSection: buildPartnerSection,
    syncRealtimeSizes: syncRealtimeSizes,
  syncRealtimeAnalytics: syncRealtimeAnalytics
};
})(typeof window !== 'undefined' ? window : this);
