/**
 * RESERVE SYSTEM — Reserve cart state + localStorage persistence
 */

(function (global) {
  'use strict';

  var Checkout = global.ReserveCheckout;
  var State = global.ReserveState;
  var Template = global.ReserveTemplate;

  var STORAGE_KEY = 'began_reserve_cart_v1';
  var items = [];
  var listeners = [];

  function subscribe(fn) {
    if (typeof fn === 'function') listeners.push(fn);
    return function unsubscribe() {
      listeners = listeners.filter(function (l) {
        return l !== fn;
      });
    };
  }

  function notify() {
    persist();
    listeners.forEach(function (fn) {
      fn(getSnapshot());
    });
  }

  function generateReserveId() {
    return 'rsv-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
  }

  function applySummaryToItem(item, summary) {
    item.totalPcs = summary.totalPcs;
    item.subtotal = summary.subtotal;
    item.discount = summary.discount;
    item.finalAmount = summary.finalAmount;
    item.paidNow = summary.paidNow;
    item.remaining = summary.remaining;
    item.priority = summary.priority;
    item.priorityLabel = summary.priorityLabel;
    item.paymentLabel = summary.paymentLabel;
    item.hasDiscount = summary.hasDiscount;
    return item;
  }

  function recalculateItem(item) {
    var summary = Checkout.calculateFromAllocation(
      item.unitPrice,
      item.sizeQty,
      item.paymentMode
    );
    return applySummaryToItem(item, summary);
  }

  function buildCartItem(product, state) {

  var item = {

    cartId:
  generateReserveId(),

reserveId:
  product.reserveId || '',

    productId:
      product.productId || '',

    name:
  product.name ||
  product.productName,
    
    unitPrice:
  Number(
    product.unitPrice ||
    product.price ||
    0
  ),

    sizeQty:
      State.cloneSizeQty(
        state.sizeQty
      ),

    paymentMode:
      state.paymentMode ||
      'NON_PRIORITY',
    
    reserveStatus:
  product.reserveStatus ||
  'RESERVE_OPEN',

    addedAt:
      Date.now()

  };

  return recalculateItem(item);

}
  function getAggregateState() {
    var agg = Checkout.calculateCartAggregate(items);
    return {
      reserveItems: items.slice(),
      count: items.length,
      totalQty: agg.totalQty,
      subtotal: agg.subtotal,
      discount: agg.discount,
      paidNow: agg.paidNow,
      remaining: agg.remaining,
      finalAmount: agg.finalAmount,
      grandTotal: agg.paidNow
    };
  }

  function getSnapshot() {
    return getAggregateState();
  }

  function getItems() {
    return items.slice();
  }

  function findIndex(
  productId,
  paymentMode
){
  return items.findIndex(function(item){

    return (
      item.productId === productId &&
      item.paymentMode === paymentMode
    );

  });
}
  
  function getItem(
  productId,
  paymentMode
){
  var idx =
    findIndex(
      productId,
      paymentMode
    );

  return idx >= 0
    ? items[idx]
    : null;
}
  function persist() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          version: 2,
          items: items,
          savedAt: Date.now()
        })
      );
    } catch (err) {
      console.warn('[Reserve] cart persist failed', err);
    }
  }

  function loadFromStorage() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var data = JSON.parse(raw);
      if (data && Array.isArray(data.items)) {
        items = data.items
.filter(function(item){

  return (
    item &&
    item.productId &&
    item.sizeQty
  );

})
.map(function(item){

  item.cartId =
    item.cartId ||
    generateReserveId();

  item.reserveId =
    item.reserveId || '';

  item.paymentMode =
    item.paymentMode ||
    'NON_PRIORITY';

  item.reserveStatus =
    item.reserveStatus ||
    'RESERVE_OPEN';

  return recalculateItem(item);

});      }
    } catch (err) {
      console.warn('[Reserve] cart load failed', err);
      items = [];
    }
  }

  function addFromProduct(product, state) {
    if (!product || !state) return { ok: false, reason: 'invalid' };

    var totalPcs = Checkout.getTotalPcs(state.sizeQty);
    if (totalPcs < 1) {
      return { ok: false, reason: 'empty_allocation' };
      reserveId:
  product.reserveId,
    }

    var idx =
  findIndex(
  product.productId,
  state.paymentMode
)

var cartItem;
    
    if (idx >= 0) {
      cartItem = items[idx];
      cartItem.sizeQty = State.cloneSizeQty(state.sizeQty);
      cartItem.paymentMode = state.paymentMode;
      recalculateItem(cartItem);
    } else {
      cartItem = buildCartItem(product, state);
      items.push(cartItem);
    }

    notify();
    return { ok: true, item: cartItem };
  }

  function updateItemSizeQty(
  productId,
  paymentMode,
  size,
  qty
) {
    var item = getItem(
  productId,
  paymentMode
);
    if (!item || !(size in item.sizeQty)) return null;

    item.sizeQty[size] = Math.max(State.MIN_QTY, Math.min(State.MAX_QTY, qty));

    if (Checkout.getTotalPcs(item.sizeQty) < 1) {
      removeItem(
  productId,
  paymentMode
);
      return null;
    }

    recalculateItem(item);
    notify();
    return item;
  }

  function incrementItemSizeQty(
  productId,
  paymentMode,
  size,
  delta
) {
    var item = getItem(
  productId,
  paymentMode
);
    if (!item) return null;
    return updateItemSizeQty(
  productId,
  paymentMode,
  size,
  (item.sizeQty[size] || 0) + delta
);
  }

  function updateItemPayment(
  productId,
  oldPaymentMode,
  newPaymentMode
){

  var item =
    getItem(
      productId,
      oldPaymentMode
    );

  if(!item){
    return null;
  }

  var existing =
    getItem(
      productId,
      newPaymentMode
    );

  if(existing){

    Object.keys(
      item.sizeQty || {}
    ).forEach(function(size){

      existing.sizeQty[size] =
        (
          existing.sizeQty[size] || 0
        ) +
        (
          item.sizeQty[size] || 0
        );

    });

    recalculateItem(existing);

    removeItem(
      productId,
      oldPaymentMode
    );

    notify();

    return existing;
  }

  item.paymentMode =
    newPaymentMode;

  recalculateItem(item);

  notify();

  return item;
}
  function removeItem(
  productId,
  paymentMode
) {
    var before = items.length;
    items = items.filter(function (item) {
      return !(
  item.productId === productId &&
  item.paymentMode === paymentMode
);
    });
    if (items.length !== before) notify();
  }

  function clear() {
    if (items.length) {
      items = [];
      notify();
    }
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      /* ignore */
    }
  }

  function getItemSizes(item){

  var product =
    (window.BEGAN_PRODUCTS || [])
      .find(function(product){

        return (
          product.productId ===
          item.productId
        );

      });

  if(!product){
    return [];
  }

  return (
  product.realtimeSizes ||
product.sizes ||
[]
    
).map(function(size){

  return {

    sizeId:
      size.sizeId || '',

    sizeLabel:
      size.sizeLabel || '',

    sizeGroup:
      size.sizeGroup || '',

    category:
      size.category || ''

  };

});
}

function buildConfirmPayload() {

  var partner =
    State.getPartnerContext();

  var agg =
    getAggregateState();

  var normalizedItems = [];

  items.forEach(function(item){

    var allocations =
      Checkout.toAllocations(
        item.sizeQty,
        getItemSizes(item)
      );

    allocations.forEach(function(alloc){

      normalizedItems.push({

        reserveId:
          item.reserveId,

        productId:
  item.productId,

        reserveStatusSnapshot:
  item.reserveStatus,
        
        sizeId:
          alloc.sizeId,

        qty:
          alloc.qty,

        paymentModeSnapshot:
  item.paymentMode,

        priceSnapshot:
          item.unitPrice,

        subtotal:
          alloc.qty *
          item.unitPrice,

        sizeLabelSnapshot:
          alloc.sizeLabel,

        sizeGroupSnapshot:
          alloc.sizeGroup ||

          '',

        categorySnapshot:
          alloc.category ||

          ''

      });

    });

  });

  if(!partner){
  throw new Error(
    'Partner context missing'
  );
}

if(!partner.id){
  throw new Error(
    'Partner ID missing'
  );
}

if(!partner.toko){
  throw new Error(
    'Partner toko missing'
  );
}

if(!normalizedItems.length){
  throw new Error(
    'Reserve items empty'
  );
}

  return {

    partner: {
      
id:
  partner.id || '',
      
      toko:
        partner.toko || '',

      name:
        partner.name || '',

      whatsapp:
        partner.whatsapp || '',

      tier:
        partner.tier ||
        'REGULAR'

    },
    productId:
  item.productId,
    
reserveId:
  item.reserveId,

    priceSnapshot:
  item.unitPrice,

productName:
  item.name,
    

    topSizeSnapshot:
      '',

    sourceChannel:
      'DASHBOARD',

    confirmedAt:
      new Date()
        .toISOString(),

    totals: {

      totalQty:
        agg.totalQty,

      subtotal:
        agg.subtotal,

      discount:
        agg.discount,

      paidNow:
        agg.paidNow,

      remaining:
        agg.remaining,

      finalAmount:
        agg.finalAmount

    },

    items:
      normalizedItems

  };

}


  function mergeApiResponse(apiResponse) {

  if(
    !apiResponse ||
    !apiResponse.orderId
  ){
    return;
  }

}

  function init() {
    loadFromStorage();
  }

  global.ReserveCart = {
    STORAGE_KEY: STORAGE_KEY,
    init: init,
    subscribe: subscribe,
    getSnapshot: getSnapshot,
    getAggregateState: getAggregateState,
    getItems: getItems,
    getItem: getItem,
    addFromProduct: addFromProduct,
    updateItemSizeQty: updateItemSizeQty,
    incrementItemSizeQty: incrementItemSizeQty,
    updateItemPayment: updateItemPayment,
    removeItem: removeItem,
    clear: clear,
    buildConfirmPayload: buildConfirmPayload,
    mergeApiResponse: mergeApiResponse,
    loadFromStorage: loadFromStorage
  };
})(typeof window !== 'undefined' ? window : this);
