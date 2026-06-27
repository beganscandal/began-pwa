/**
 * RESERVE SYSTEM — WhatsApp confirmation message builder
 */

(function (global) {
  'use strict';

  var Checkout = global.ReserveCheckout;
  var Template = global.ReserveTemplate;

  function lineBreak() {
    return '\n';
  }

  function sectionBreak() {
    return '\n================================\n';
  }

  function formatSizeLines(item) {

  var product =
    (window.BEGAN_PRODUCTS || [])
      .find(function(product){

        return (
          product.id ===
          item.productId
        );

      });

  if(!product){
    return '';
  }

 var sizes =
  product.realtimeSizes || [];
    
  var lines =
    Checkout.getActiveSizeLines(
      item.sizeQty,
      sizes
    );

  var unitLabel =
    getUnitLabel(item);

  return lines
  .map(function(row){

    return (
      row.sizeLabel +
      ' : ' +
      row.qty +
      ' ' +
      unitLabel
    );

  })
    
    .join(lineBreak());

}
  function getUnitLabel(item){

  var product =
    (window.BEGAN_PRODUCTS || [])
      .find(function(product){

        return (
          product.id ===
          item.productId
        );

      });

  if(!product){
    return 'pcs';
  }

  return (
    product.unitLabel ||
    'pcs'
  );

}
  function formatItemBlock(item) {
    var parts = [];
    parts.push(item.productName || item.productId);
    parts.push(lineBreak());
    parts.push(formatSizeLines(item));
    parts.push(lineBreak());
    parts.push('Total Qty : ' + item.totalPcs + ' ' + getUnitLabel(item));
    parts.push(lineBreak());
    parts.push('Payment :');
    parts.push(item.paymentLabel || Checkout.getPaymentModeLabel(item.paymentMode));
    parts.push(lineBreak());
    parts.push('Priority :');
    parts.push(item.priorityLabel || Checkout.formatPriorityLabel(item.priority));
    parts.push(lineBreak());
    parts.push('Subtotal :');
    parts.push(Checkout.formatCurrency(item.subtotal));

    if (item.paymentMode === 'FULL_PAYMENT') {
      if (item.discount > 0) {
        parts.push(lineBreak());
        parts.push('Discount 5% :');
        parts.push(Checkout.formatCurrency(item.discount));
      }
      parts.push(lineBreak());
      parts.push('Total Dibayar :');
      parts.push(Checkout.formatCurrency(item.paidNow));
      parts.push(lineBreak());
      parts.push('Sisa Pembayaran :');
      parts.push(Checkout.formatCurrency(0));
    } else if (item.paymentMode === 'DP_50') {
      parts.push(lineBreak());
      parts.push('DP Dibayar :');
      parts.push(Checkout.formatCurrency(item.paidNow));
      parts.push(lineBreak());
      parts.push('Sisa Pelunasan :');
      parts.push(Checkout.formatCurrency(item.remaining));
    } else {
      parts.push(lineBreak());
      parts.push('Belum Ada Pembayaran');
      parts.push(lineBreak());
      parts.push('Sisa Pembayaran :');
      parts.push(Checkout.formatCurrency(item.remaining));
    }

    return parts.join(lineBreak());
  }

  function getReserveSnapshot(){

  if(
    !window.ReserveCart ||
    !window.ReserveCart.getAggregateState
  ){
    return null;
  }

  return window.ReserveCart.getAggregateState();

}

  function buildMessage(payload, apiResponse) {

    console.log(
    '[WA PAYLOAD]',
    payload
  );
    
    var snapshot =
    getReserveSnapshot();

  var partnerData =
  payload.partner || {};

var partner =
  partnerData.toko ||
  partnerData.id ||
  payload.toko ||
  payload.partnerId ||
  'Partner';

  var items =
    payload.reserveItems ||
    (snapshot && snapshot.reserveItems) ||
    [];

    var agg =
    payload.totals ||
    snapshot ||
    {};
    
    var orderId =
  payload.orderId || '';


    
    var parts = [];
    parts.push('RESERVE_SYSTEM_BEGAN');
    parts.push(lineBreak());
    parts.push('Partner :');
    parts.push(partner);

    if (orderId) {
      parts.push(lineBreak());
      parts.push('Order ID : ' + orderId);
    }

    items.forEach(function (item) {
      parts.push(sectionBreak());
      parts.push(formatItemBlock(item));
    });

    parts.push(sectionBreak());
    parts.push('TOTAL RESERVE :');
    parts.push(Checkout.formatNumber(agg.totalQty || 0) + ' item');
    parts.push(lineBreak());
    parts.push('Subtotal :');
    parts.push(Checkout.formatCurrency(agg.subtotal || 0));

    if ((agg.discount || 0) > 0) {
      parts.push(lineBreak());
      parts.push('Total Diskon :');
      parts.push(Checkout.formatCurrency(agg.discount));
    }

    parts.push(lineBreak());
    parts.push('Total Dibayar Sekarang :');
    parts.push(Checkout.formatCurrency(agg.paidNow || 0));
    parts.push(lineBreak());
    parts.push('Total Sisa Pelunasan :');
    parts.push(Checkout.formatCurrency(agg.remaining || 0));

    return parts.join(lineBreak());
  }

  function getWhatsAppNumber() {
    var config = global.BEGAN_RESERVE_CONFIG || {};
    var partner = global.ReserveState ? global.ReserveState.getPartnerContext() : {};
    return partner.whatsappNumber || config.whatsappNumber || '';
  }

  function openWhatsApp(message){

  var number =
    String(getWhatsAppNumber())
    .replace(/\D/g, '');

  if (!number) {
    console.warn(
      '[Reserve WhatsApp] No whatsappNumber configured'
    );
    return false;
  }

  var url =
    'https://wa.me/' +
    number +
    '?text=' +
    encodeURIComponent(message);

  try {

    var partner =
      JSON.parse(
        localStorage.getItem(
          'began_partner'
        ) || '{}'
      );

    localStorage.setItem(

      'began_reserve_checkout_success',

      JSON.stringify({

  timestamp: Date.now(),

  partnerId:
    partner.id || '',

  partnerName:
    partner.toko ||
    partner.name ||
    'PARTNER BEGAN'

})
    );

  } catch(err){

    console.warn(err);

  }

  console.log(
    '[WA URL]',
    url
  );

  var popup =
    window.open(
      url,
      '_blank'
    );

  console.log(
    '[WA WINDOW]',
    popup
  );
    if (!popup) {

  console.warn(
    '[Reserve WhatsApp] Popup blocked'
  );

  window.location.href = url;

}

  return true;
}  
  
function sendReserveConfirmation(
  payload,
  apiResponse
) {

  var message =
    buildMessage(
      payload,
      apiResponse
    );

  console.info(
    '[Reserve WhatsApp] Message prepared',
    message
  );

  return openWhatsApp(
  message
);
  
}
  global.ReserveWhatsapp = {
    buildMessage: buildMessage,
    openWhatsApp: openWhatsApp,
    sendReserveConfirmation: sendReserveConfirmation
  };
})(typeof window !== 'undefined' ? window : this);
