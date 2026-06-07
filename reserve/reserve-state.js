/**
 * RESERVE SYSTEM — Per-product draft state & partner context (prototype)
 */

(function (global) {
  'use strict';

  var DEFAULT_PAYMENT = 'FULL_PAYMENT';
  var MIN_QTY = 0;
  var MAX_QTY = 99;
  
  var cardStates = Object.create(null);

  function createEmptySizeQty(sizes) {
    var map = Object.create(null);
    (sizes || []).forEach(function (size) {
      map[size] = 0;
    });
    return map;
  }

  function cloneSizeQty(sizeQty) {
    var copy = Object.create(null);
    Object.keys(sizeQty || {}).forEach(function (key) {
      copy[key] = sizeQty[key];
    });
    return copy;
  }

  function createInitialState(product, sizes) {
    return {
      productId: 
        product.productId ||
        product.id,
      
      unitPrice: product.unitPrice,
      sizeQty: createEmptySizeQty(sizes),
      paymentMode: DEFAULT_PAYMENT,
      heroImageIndex: 0,
      partnersExpanded: false
    };
  }

  function initProductStates(products) {

  cardStates =
    Object.create(null);

 products.forEach(function(product){

  var productId =
    product.productId ||
    product.id;

  var sizes =
    (product.realtimeSizes || [])
      .map(function(size){

        return size.sizeLabel;

      });

  cardStates[productId] =
    createInitialState(
      product,
      sizes
    );

});
  return cardStates;

}

  function getState(productId) {
    return cardStates[productId] || null;
  }

  function setSizeQty(productId, size, qty) {
    var state = cardStates[productId];
    if (!state || !(size in state.sizeQty)) return null;
    state.sizeQty[size] = Math.max(MIN_QTY, Math.min(MAX_QTY, qty));
    return state;
  }

  function incrementSizeQty(
  productId,
  size,
  delta
){

  var state =
    cardStates[productId];

  if(!state){
    return null;
  }

  var current =
    state.sizeQty[size] || 0;

  return setSizeQty(
    productId,
    size,
    current + delta
  );

}
  function setPaymentMode(productId, mode) {
    var state = cardStates[productId];
    if (!state) return null;
    state.paymentMode = mode;
    return state;
  }

  function loadDraftFromCartItem(item, sizes) {
    var state = cardStates[item.productId];
    if (!state) return null;
    state.sizeQty = cloneSizeQty(item.sizeQty);
    state.paymentMode = item.paymentMode;
    return state;
  }

  function setHeroImageIndex(productId, index) {
    var state = cardStates[productId];
    if (!state) return null;
    state.heroImageIndex = index;
    return state;
  }

  function togglePartnersExpanded(productId) {
    var state = cardStates[productId];
    if (!state) return null;
    state.partnersExpanded = !state.partnersExpanded;
    return state;
  }

  function resetAllocation(productId, sizes) {
    var state = cardStates[productId];
    if (!state) return null;
    state.sizeQty = createEmptySizeQty(sizes);
    return state;
  }

  function getPartnerContext(){

  try{

    var raw =
      localStorage.getItem(
        'began_partner'
      );

    /*
    =========================
    DEV MODE BYPASS
    =========================
    */

    if(
      !raw &&
      window.RESERVE_DEV_MODE
    ){

      console.warn(
        'RESERVE DEV MODE ACTIVE'
      );

      return {

        id: 'DEV001',

        toko: 'DEV STORE'

      };

    }

    if(!raw){

      throw new Error(
        'PARTNER_SESSION_MISSING'
      );
    }

    var partner =
      JSON.parse(raw);

    if(
      !partner ||
      !partner.id ||
      !partner.toko
    ){

      throw new Error(
        'INVALID_PARTNER_SESSION'
      );
    }

    return {

      id:
        partner.id,

      toko:
        partner.toko

    };

  }catch(err){

    console.error(
      'Partner Context Error',
      err
    );

    throw err;
  }

}
  global.ReserveState = {
    MIN_QTY: MIN_QTY,
    MAX_QTY: MAX_QTY,
    
    initProductStates: initProductStates,
    getState: getState,
    setSizeQty: setSizeQty,
    incrementSizeQty: incrementSizeQty,
    setPaymentMode: setPaymentMode,
    loadDraftFromCartItem: loadDraftFromCartItem,
    setHeroImageIndex: setHeroImageIndex,
    togglePartnersExpanded: togglePartnersExpanded,
    resetAllocation: resetAllocation,
    getPartnerContext: getPartnerContext,
    
    cloneSizeQty: cloneSizeQty,
    createEmptySizeQty: createEmptySizeQty,
    createInitialState: createInitialState
  };
})(typeof window !== 'undefined' ? window : this);
