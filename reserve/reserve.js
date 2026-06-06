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

  var reserveRealtimeTimer = null;
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
  var reserveSound =
new Audio(
'https://pwa.barkahgarment.com/assets/checkout.mp3'
);

reserveSound.volume = 0.5;

var LAST_RESERVE_ACTIVITY = '';

var LAST_SOUND_TIME = 0;

  async function refreshReserveAnalytics(){

  try{

    const res = await fetch(
      window.BEGAN_RESERVE_API +
      '?action=getReserveProducts&_=' +
      Date.now()
    );

    const data =
      await res.json();

    if(!data.success){
      return;
    }

    const products =
      (data.products || [])
        .map(normalizeReserveProduct);

    
  products.forEach(function(product){

  var productId =
    product.productId ||
    product.id;

  var existingProduct =
    getProduct(productId);

  var card =
    Render.findCard(
      rootEl,
      productId
    );

  if(
    !card ||
    !existingProduct
  ){
    return;
  }

  Object.assign(
  existingProduct,
  product
);

    Render.syncRealtimeAnalytics(
  card,
  existingProduct
);

Render.syncCard(
  card,
  productId,
  existingProduct
);
});
      }catch(err){

    console.error(
      '[Reserve] Analytics refresh failed',
      err
    );

  }

}
  function getProductIdFromTarget(target) {
    var node = target.closest('[data-product-id]');
    return node ? node.dataset.productId : null;
  }

  function getProduct(productId) {

  return (
    window.BEGAN_PRODUCTS || []
  ).find(function(product){

    return (
      (
        product.productId ||
        product.id
      ) === productId
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
    openDrawer();

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

  function generateOrderId(partner) {

  var partnerId =
    String(partner?.id || 'UNKNOWN')
      .replace(/[^A-Z0-9]/gi, '')
      .toUpperCase();

  var tokoShort =
    String(partner?.toko || 'TOKO')
      .replace(/[^A-Z0-9]/gi, '')
      .toUpperCase()
      .substring(0, 10);

  var now = new Date();

  var timestamp =
    now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    String(now.getHours()).padStart(2, '0');
    
  return (
    'RSV-' +
    partnerId +
    '-' +
    tokoShort +
    '-' +
    timestamp
  );

}

  function handleConfirmReserve() {
    if (isConfirming) return;

    var items = Cart.getItems();
    if (!items.length) return;
    


    var payload =
  Cart.buildConfirmPayload();

payload.orderId =
  generateOrderId(
    payload.partner
  );
    console.log(
  '[FRONTEND ORDER ID]',
  payload.orderId
);
    setConfirmLoading(true);
    CartRender.showDrawerStatus('Menyimpan reserve ke sistem...', false);

    console.log(
  '[CLICK CONFIRM]',
  Date.now()
);
    var savedPayload =
  Cart.buildConfirmPayload();

savedPayload.orderId =
  payload.orderId;

    console.log(
  '[WA OPEN]',
  Date.now()
);

const waResult =
  Whatsapp.sendReserveConfirmation(
    savedPayload,
    {}
  );

console.log(
  '[WA RESULT]',
  waResult
);
    Cart.clear();

closeDrawer();

CartRender.showDrawerStatus(
  '',
  false
);
    setConfirmLoading(false);

    Api.submitReserve(payload)

  .then(function(apiResponse){

    console.log(
      '[Reserve Saved]',
      apiResponse
    );

  })

  .catch(function(err){

  console.error(
    '[Reserve Save Failed]',
    err
  );

  console.error(
    '[ERROR NAME]',
    err?.name
  );

  console.error(
    '[ERROR MESSAGE]',
    err?.message
  );

  console.error(
    '[ERROR STRING]',
    String(err)
  );

});
  
  }
    
    
  function clearVideoEmbed() {
    if (videoIframe) videoIframe.src = '';
  }

 function closeVideoModal() {

  clearVideoEmbed();

  if (videoDialog) {
    videoDialog.hidden = true;

videoDialog.removeAttribute(
  'open'
);
}
 }
    
 function openVideoModal(btn) {

  var embedUrl =
    btn.dataset.videoEmbed;

  if (!embedUrl || !videoDialog)
    return;

  if (videoTitle) {
    videoTitle.textContent =
      btn.dataset.videoTitle ||
      'Video Sample';
  }

  if (videoIframe) {
    videoIframe.src = embedUrl;
  }

  if (videoExternal) {
    videoExternal.href =
      btn.dataset.videoExternal ||
      embedUrl;
  }

  videoDialog.hidden = false;

videoDialog.setAttribute(
  'open',
  ''
);

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

     productId:
    p.productId,

    reserveId:
  p.reserveId,

productName:
  p.productName,

price:
  Number(p.price || 0),

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
    
    unitLabel:
  Template.getUnitLabel(
    p.category
  ),
    
    gallery: String(p.image || '')
  .split('|')
  .map(function(src, index){

    return {
      src: src.trim(),
      label: '#' + (index + 1)
    };

  })
  .filter(function(item){

    return item.src;

  }),

videoSample: (() => {

  const rawUrl =
    (p.videoUrl || '')
    .toString()
    .trim();

  if (!rawUrl) return null;

  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\/shorts\/)([^#\&\?]*).*/;

  const match =
    rawUrl.match(regExp);

  const videoId =
    match?.[2];

  if (!videoId) return null;

  return {

    videoId,

    embedUrl:
`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1`,

    externalUrl:
      rawUrl,

    title:
      p.productName ||
      'Video Sample'

  };

})(),
    
  analytics: {

  totalReserveQty:
    p.totalReserveCache,

  totalPartner:
    p.totalPartnersCache,

  topSize:
    p.topSizeCache,

  unitLabel:
    Template.getUnitLabel(
      p.category
    )
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

    partnerReserves:
  p.partnerReserves || [],

partnerReservesMore:
  p.partnerReservesMore || [],

partnerReservesExtra:
  p.partnerReservesExtra || 0

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
  function injectReserveHeader(){

  if(
    document.querySelector(
      '.reserve-header'
    )
  ){
    return;
  }

  if(!rootEl) return;

  rootEl.insertAdjacentHTML(
    'afterbegin',
    `
    <header class="reserve-header">

      <h1 class="reserve-header__title">
        RESERVE SYSTEM
      </h1>

      <p class="reserve-header__subtitle">
Produksi mengikuti kebutuhan size dan qty partner. Setiap produk telah tersedia dalam bentuk sampel produk real. Priority 01 memperoleh alokasi produksi lebih awal.
</p>
    </header>
    `
  );

}
  function unlockReserveAudio(){

  reserveSound.muted = true;

  reserveSound.play()

  .then(function(){

    reserveSound.pause();

    reserveSound.currentTime = 0;

    reserveSound.muted = false;

  })

  .catch(function(){});

}
  function showReserveToast(message){

  let toast =
    document.getElementById(
      'reserve-toast'
    );

  if(!toast){

    toast =
      document.createElement(
        'div'
      );

    toast.id =
      'reserve-toast';

    document.body.appendChild(
      toast
    );

  }

  toast.textContent =
    message;

  toast.classList.add(
    'show'
  );

  setTimeout(function(){

    toast.classList.remove(
      'show'
    );

  },3000);

}
  function playReserveNotification(
  message
){

  const now =
    Date.now();

  if(
    now -
    LAST_SOUND_TIME <
    3000
  ){
    return;
  }

  LAST_SOUND_TIME =
    now;

  reserveSound.currentTime = 0;

  reserveSound.play()
    .catch(function(){});

  showReserveToast(
    message
  );

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
injectReserveHeader();
    document.addEventListener(
  'click',
  unlockReserveAudio,
  { once:true }
);
    
    if (videoDialog) {
      videoIframe = videoDialog.querySelector('[data-video-iframe]');
      videoExternal = videoDialog.querySelector('[data-video-external]');
      videoTitle = document.getElementById('reserve-video-title');
      videoDialog.addEventListener(
  'click',
  onVideoDialogClick
);
     
}

  if (
  !document.getElementById(
    'reserve-video-dialog'
  )
) {

  document.body.insertAdjacentHTML(
    'beforeend',
    `
    <div
      id="reserve-video-dialog"
      class="reserve-video-dialog"
      hidden>

      <div class="reserve-video-dialog__inner">

        <header class="reserve-video-dialog__head">

          <h2
            id="reserve-video-title"
            class="reserve-video-dialog__title">

            Video Sample

          </h2>

          <button
            type="button"
            class="reserve-video-dialog__close"
            data-action="close-video">

            ×

          </button>

        </header>

        <div class="reserve-video-dialog__body">

          <div class="reserve-video-dialog__embed-wrap">

            <iframe
  class="reserve-video-dialog__iframe"
  data-video-iframe
  src=""
  allow="autoplay; encrypted-media; picture-in-picture"
  allowfullscreen
  playsinline>
</iframe>
          </div>

          <a
            class="reserve-video-dialog__external"
            data-video-external
            href="#"
            target="_blank">

            Buka di tab baru

          </a>

        </div>

      </div>

    </div>
    `
  );

  
 videoDialog =
  document.getElementById(
    'reserve-video-dialog'
  );

videoIframe =
  videoDialog.querySelector(
    '[data-video-iframe]'
  );

videoExternal =
  videoDialog.querySelector(
    '[data-video-external]'
  );

videoTitle =
  document.getElementById(
    'reserve-video-title'
  );

videoDialog.addEventListener(
  'click',
  onVideoDialogClick
);

}
    Cart.init();

bootReserve();
    
    reserveRealtimeTimer =
  setInterval(

    refreshReserveAnalytics,

    5000

  );


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

