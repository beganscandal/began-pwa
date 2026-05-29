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

  if(!Template){
    return '';
  }

  var product =
    Template.getProductById(
      item.productId
    );

  if(!product){
    return '';
  }

  var sizes =
    Template.getSizesByGroup(
      product.sizeGroup
    );

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
  row.size +
  ' : ' +
  row.qty +
  ' ' +
  unitLabel
);

    })
    .join(lineBreak());

}
function getUnitLabel(item){

  if(!Template){
    return 'pcs';
  }

  var product =
    Template.getProductById(
      item.productId
    );

  if(!product){
    return 'pcs';
  }

  return Template.getUnitLabel(
    product.sizeGroup
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

  function buildMessage(payload, apiResponse) {
    var partner = payload.toko || payload.partnerId || 'Partner';
    var items = payload.reserveItems || [];
    var agg = payload.totals || {};
    var orderId = apiResponse && apiResponse.orderId ? apiResponse.orderId : '';

    var parts = [];
    parts.push('RESERVE SYSTEM BEGAN');
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

  function openWhatsApp(message) {
    var number = String(getWhatsAppNumber()).replace(/\D/g, '');
    if (!number) {
      console.warn('[Reserve WhatsApp] No whatsappNumber configured');
      return false;
    }
    var url = 'https://wa.me/' + number + '?text=' + encodeURIComponent(message);
    window.open(url, '_blank', 'noopener,noreferrer');
    return true;
  }

  function sendReserveConfirmation(payload, apiResponse) {
    var message = buildMessage(payload, apiResponse);
    console.info('[Reserve WhatsApp] Message prepared', message);
    return openWhatsApp(message);
  }

  global.ReserveWhatsapp = {
    buildMessage: buildMessage,
    openWhatsApp: openWhatsApp,
    sendReserveConfirmation: sendReserveConfirmation
  };
})(typeof window !== 'undefined' ? window : this);
