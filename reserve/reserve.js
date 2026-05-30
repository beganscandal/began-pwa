/**
 * RESERVE SYSTEM — Entry point & event delegation
 */

(function () {
  'use strict';

  var Template = window.ReserveTemplate;
  var State = window.ReserveState;
  var Render = window.ReserveRender;
  var Cart = window.ReserveCart;
  var Api = window.ReserveApi;
  var Whatsapp = window.ReserveWhatsapp;
  var CartRender = window.ReserveCartRender;

  var rootEl = null;
  var gridEl = null;
  var videoDialog = null;
  var drawerRoot = null;
  var fabEl = null;
  var confirmBtn = null;
  var videoIframe = null;
  var videoExternal = null;
  var videoTitle = null;
  var isConfirming = false;

  function getProductIdFromTarget(target) {
    var node = target.closest('[data-product-id]');
    return node ? node.dataset.productId : null;
  }

  function getProduct(productId) {

  return (
    window.BEGAN_PRODUCTS || []
  ).find(function(product){

    return (
      product.id === productId
    );

  }) || null;

}

  function syncProductCard(productId) {
    var product = getProduct(productId);
    var card = Render.findCard(rootEl, productId);
    if (card && product) Render.syncCard(card, productId, product);
  }

  function handleSizeQtyChange(productId, size, delta) {
    State.incrementSizeQty(productId, size, delta);
    syncProductCard(productId);
  }

  function handlePaymentChange(input) {
    var productId = input.dataset.productId;
    if (!productId) return;
    State.setPaymentMode(productId, input.value);
    syncProductCard(productId);
  }

  function handleGallerySelect(btn) {
    var productId = btn.dataset.productId;
    var index = Number(btn.dataset.imageIndex);
    if (!productId || Number.isNaN(index)) return;

    State.setHeroImageIndex(productId, index);
    var product = getProduct(productId);
    var card = Render.findCard(rootEl, productId);
    if (card && product) Render.setHeroImage(card, product, index);
  }

  function handleTogglePartners(btn) {
    var productId = getProductIdFromTarget(btn);
    if (!productId) return;

    State.togglePartnersExpanded(productId);
    var product = getProduct(productId);
    var card = Render.findCard(rootEl, productId);
    var state = State.getState(productId);
    if (card && product && state) {
      Render.buildPartnerSection(card, product, state.partnersExpanded);
    }
  }

  function handleAddToReserve(btn) {
    var productId = getProductIdFromTarget(btn);
    var product = getProduct(productId);
    var state = State.getState(productId);
    if (!product || !state) return;

    var result = Cart.addFromProduct(product, state);
    if (!result.ok) {
      btn.classList.add('is-shake');
      window.setTimeout(function () {
        btn.classList.remove('is-shake');
      }, 400);
      return;
    }

    State.resetAllocation(
  productId,
  (product.realtimeSizes || [])
    .map(function(size){

      return size.sizeLabel;

    })
);
    syncProductCard(productId);
    CartRender.showDrawerStatus('Ditambahkan ke ringkasan reserve.', false);

    btn.classList.add('is-pressed');
    window.setTimeout(function () {
      btn.classList.remove('is-pressed');
    }, 200);
  }

  function handleCartSizeChange(productId, size, delta) {
    Cart.incrementItemSizeQty(productId, size, delta);
  }

  function handleCartPaymentChange(input) {
    var productId = input.dataset.productId;
    if (!productId) return;
    Cart.updateItemPayment(productId, input.value);
  }

  function handleRemoveCartItem(productId) {
    if (!productId) return;
    Cart.removeItem(productId);
  }

  function openDrawer() {
    if (!drawerRoot) return;
    CartRender.showDrawerStatus('', false);
    drawerRoot.classList.add('is-open');
    drawerRoot.setAttribute('aria-hidden', 'false');
    if (fabEl) fabEl.setAttribute('aria-expanded', 'true');
    document.body.classList.add('reserve-drawer-open');
  }

  function closeDrawer() {
    if (!drawerRoot) return;
    drawerRoot.classList.remove('is-open');
    drawerRoot.setAttribute('aria-hidden', 'true');
    if (fabEl) fabEl.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('reserve-drawer-open');
  }

  function setConfirmLoading(loading) {
    isConfirming = loading;
    if (!confirmBtn) confirmBtn = document.querySelector('[data-action="confirm-reserve"]');
    if (!confirmBtn) return;

    confirmBtn.disabled = loading;
    confirmBtn.classList.toggle('is-loading', loading);

    var label = confirmBtn.querySelector('[data-confirm-label]');
    if (label) {
      label.textContent = loading ? 'MENYIMPAN...' : 'CONFIRM RESERVE';
    }
  }

  function handleConfirmReserve() {
    if (isConfirming) return;

    var items = Cart.getItems();
    if (!items.length) return;

    var payload = Cart.buildConfirmPayload();
    setConfirmLoading(true);
    CartRender.showDrawerStatus('Menyimpan reserve ke sistem...', false);

    Api.submitReserve(payload)
      .then(function (apiResponse) {
        Cart.mergeApiResponse(apiResponse);
        var savedPayload = Cart.buildConfirmPayload();
        savedPayload.orderId = apiResponse.orderId;

        console.log('[Reserve] CONFIRM RESERVE — saved', {
          payload: savedPayload,
          apiResponse: apiResponse
        });

        CartRender.showDrawerStatus('Reserve tersimpan. Membuka WhatsApp...', false);

        Whatsapp.sendReserveConfirmation(savedPayload, apiResponse);

        Cart.clear();
        closeDrawer();
        CartRender.showDrawerStatus('', false);
      })
      .catch(function (err) {
        console.error('[Reserve] CONFIRM failed', err);
        CartRender.showDrawerStatus(
          err.message || 'Gagal menyimpan reserve. WhatsApp tidak dibuka.',
          true
        );
      })
      .finally(function () {
        setConfirmLoading(false);
      });
  }

  function clearVideoEmbed() {
    if (videoIframe) videoIframe.src = '';
  }

  function closeVideoModal() {
    clearVideoEmbed();
    if (videoDialog && videoDialog.open) videoDialog.close();
  }

  function openVideoModal(btn) {
    var embedUrl = btn.dataset.videoEmbed;
    if (!embedUrl || !videoDialog) return;

    if (videoTitle) videoTitle.textContent = btn.dataset.videoTitle || 'Video Sample';
    if (videoIframe) videoIframe.src = embedUrl;
    if (videoExternal) videoExternal.href = btn.dataset.videoExternal || embedUrl;

    if (typeof videoDialog.showModal === 'function') {
      videoDialog.showModal();
    } else {
      videoDialog.setAttribute('open', '');
    }
  }

  function onDocumentClick(event) {
    var actionEl = event.target.closest('[data-action]');
    if (!actionEl) return;

    var action = actionEl.dataset.action;
    var productId = actionEl.dataset.productId || getProductIdFromTarget(actionEl);

    switch (action) {
      case 'size-qty-minus':
        handleSizeQtyChange(productId, actionEl.dataset.size, -1);
        break;
      case 'size-qty-plus':
        handleSizeQtyChange(productId, actionEl.dataset.size, 1);
        break;
      case 'cart-size-minus':
        handleCartSizeChange(productId, actionEl.dataset.size, -1);
        break;
      case 'cart-size-plus':
        handleCartSizeChange(productId, actionEl.dataset.size, 1);
        break;
      case 'select-gallery':
        event.preventDefault();
        handleGallerySelect(actionEl);
        break;
      case 'toggle-partners':
        event.preventDefault();
        handleTogglePartners(actionEl);
        break;
      case 'add-to-reserve':
        handleAddToReserve(actionEl);
        break;
      case 'open-drawer':
        openDrawer();
        break;
      case 'close-drawer':
        event.preventDefault();
        closeDrawer();
        break;
      case 'confirm-reserve':
        handleConfirmReserve();
        break;
      case 'remove-cart-item':
        handleRemoveCartItem(productId);
        break;
      case 'open-video':
        event.preventDefault();
        openVideoModal(actionEl);
        break;
      case 'close-video':
        event.preventDefault();
        closeVideoModal();
        break;
      default:
        break;
    }
  }

  function onDocumentChange(event) {
    var target = event.target;
    if (target.matches('input[type="radio"][data-product-id]')) {
      if (target.name && target.name.indexOf('drawer-payment-') === 0) {
        handleCartPaymentChange(target);
      } else {
        handlePaymentChange(target);
      }
    }
  }

  function onVideoDialogClick(event) {
    if (event.target === videoDialog) closeVideoModal();
  }

  function normalizeReserveProduct(p){

  return {

    id:
      p.productId,

    name:
      p.productName,

    description:
      p.shortDescription,

    status:
      p.reserveStatus,

    image:
      p.image,

    imageFallback:
      p.imageFallback,

    unitPrice:
      p.price,

    sizeGroup:
      p.category,

    gallery: [
      {
        src: p.image,
        label: 'Product'
      }
    ],

    analytics: {
      totalReservePcs:
        p.totalReserveCache,

      totalPartner:
        p.totalPartnersCache,

      topSize:
        p.topSizeCache
    },

    progress: {
      collected:
        p.totalReserveCache,

      target:
        p.totalReserveCache
    },

    productionTimeline: {
      start:
        p.EstimasiTanggalProduksi,

      finish:
        p.EstimasiSelesaiProduksi
    },

    trackingBadge:
      p.trackingBadge,

    trackingNote:
      p.trackingNote,

    realtimeSizes:
      p.sizes || [],

    partnerReserves: [],
    partnerReservesMore: [],
    partnerReservesExtra: 0

  };

}

  async function bootReserve(){

  try {

    const res = await fetch(
      window.BEGAN_RESERVE_API +
      '?action=getReserveProducts'
    );

    const data =
      await res.json();

    if(!data.success){

  throw new Error(
    data.message ||
    'Reserve API failed'
  );

}

    const products =
  (data.products || [])
    .map(
      normalizeReserveProduct
    );

if(!products.length){

  console.warn(
    '[Reserve] No products found'
  );

}

    window.BEGAN_PRODUCTS =
      products;

    State.initProductStates(
      products
    );

    Render.renderProductGrid(
      gridEl,
      products
    );

  } catch(err){

    console.error(
      '[Reserve] Boot failed',
      err
    );

  }

}

  function init() {
    rootEl = document.getElementById('reserve-app');
    gridEl = document.getElementById('reserve-product-grid');
    videoDialog = document.getElementById('reserve-video-dialog');
    drawerRoot = document.getElementById('reserve-drawer-root');
    fabEl = document.getElementById('reserve-fab');
    confirmBtn = document.querySelector('[data-action="confirm-reserve"]');

    if (!rootEl || !gridEl) {
      console.error('[Reserve] Missing #reserve-app or #reserve-product-grid');
      return;
    }

    if (videoDialog) {
      videoIframe = videoDialog.querySelector('[data-video-iframe]');
      videoExternal = videoDialog.querySelector('[data-video-external]');
      videoTitle = document.getElementById('reserve-video-title');
      videoDialog.addEventListener('close', clearVideoEmbed);
      videoDialog.addEventListener('click', onVideoDialogClick);
    }

    Cart.init();

bootReserve();

CartRender.init();

    document.addEventListener('click', onDocumentClick);
    document.addEventListener('change', onDocumentChange);

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      closeVideoModal();
      closeDrawer();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
