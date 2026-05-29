/**
 * RESERVE SYSTEM — Pricing, discount & priority logic
 */

(function (global) {
  'use strict';

  var DISCOUNT_RATE = 0.05;
  var DP_RATE = 0.5;

  var PRIORITY_MAP = {
    FULL_PAYMENT: 'PRIORITY_01',
    DP_50: 'PRIORITY_02',
    NON_PRIORITY: 'PRIORITY_03'
  };

  var PAYMENT_LABELS = {
    FULL_PAYMENT: 'FULL PAYMENT',
    DP_50: 'DP 50%',
    NON_PRIORITY: 'NON PRIORITY'
  };

  function getPriority(paymentMode) {
    return PRIORITY_MAP[paymentMode] || PRIORITY_MAP.NON_PRIORITY;
  }

  function formatPriorityLabel(priorityCode) {
    if (!priorityCode) return 'PRIORITY 03';
    return String(priorityCode).replace(/_/g, ' ');
  }

  function getPaymentModeLabel(paymentMode) {
    return PAYMENT_LABELS[paymentMode] || paymentMode;
  }

  function getTotalPcs(sizeQty) {
    if (!sizeQty) return 0;
    return Object.keys(sizeQty).reduce(function (sum, size) {
      return sum + (sizeQty[size] || 0);
    }, 0);
  }

  function getActiveSizeLines(sizeQty, sizesOrder) {
    var order = sizesOrder || Object.keys(sizeQty || {});
    var lines = [];
    order.forEach(function (size) {
      var qty = sizeQty[size] || 0;
      if (qty > 0) lines.push({ size: size, qty: qty });
    });
    return lines;
  }

  function toAllocations(sizeQty, sizesOrder) {
    return getActiveSizeLines(sizeQty, sizesOrder).map(function (line) {
      return { size: line.size, qty: line.qty };
    });
  }

  function calculateProgress(collected, target) {
    var safeTarget = target > 0 ? target : 1;
    var pct = Math.min(100, Math.round((collected / safeTarget) * 100));
    return {
      collected: collected,
      target: target,
      percent: pct
    };
  }

  function calculateSummary(state) {
    if (!state) return emptySummary();

    var totalPcs = getTotalPcs(state.sizeQty);
    var subtotal = state.unitPrice * totalPcs;
    var paymentMode = state.paymentMode || 'NON_PRIORITY';
    var priority = getPriority(paymentMode);

    var discount = 0;
    var finalAmount = subtotal;
    var paidNow = 0;
    var remaining = 0;
    var hasDiscount = false;

    if (totalPcs < 1) {
      return emptySummary();
    }

    if (paymentMode === 'FULL_PAYMENT') {
      hasDiscount = true;
      discount = Math.round(subtotal * DISCOUNT_RATE);
      finalAmount = subtotal - discount;
      paidNow = finalAmount;
      remaining = 0;
    } else if (paymentMode === 'DP_50') {
      finalAmount = subtotal;
      paidNow = Math.round(subtotal * DP_RATE);
      remaining = finalAmount - paidNow;
    } else {
      finalAmount = subtotal;
      paidNow = 0;
      remaining = subtotal;
    }

    return {
      totalPcs: totalPcs,
      unitPrice: state.unitPrice,
      subtotal: subtotal,
      discount: discount,
      discountRate: hasDiscount ? DISCOUNT_RATE : 0,
      finalAmount: finalAmount,
      paidNow: paidNow,
      remaining: remaining,
      priority: priority,
      priorityLabel: formatPriorityLabel(priority),
      paymentMode: paymentMode,
      paymentLabel: getPaymentModeLabel(paymentMode),
      hasDiscount: hasDiscount
    };
  }

  function emptySummary() {
    return {
      totalPcs: 0,
      unitPrice: 0,
      subtotal: 0,
      discount: 0,
      discountRate: 0,
      finalAmount: 0,
      paidNow: 0,
      remaining: 0,
      priority: PRIORITY_MAP.NON_PRIORITY,
      priorityLabel: 'PRIORITY 03',
      paymentMode: 'NON_PRIORITY',
      paymentLabel: 'NON PRIORITY',
      hasDiscount: false
    };
  }

  function calculateFromAllocation(unitPrice, sizeQty, paymentMode) {
    return calculateSummary({
      unitPrice: unitPrice,
      sizeQty: sizeQty,
      paymentMode: paymentMode
    });
  }

  function calculateCartAggregate(items) {
    var aggregate = {
      totalQty: 0,
      subtotal: 0,
      discount: 0,
      paidNow: 0,
      remaining: 0,
      finalAmount: 0,
      productCount: (items || []).length
    };

    (items || []).forEach(function (item) {
      aggregate.totalQty += item.totalPcs || 0;
      aggregate.subtotal += item.subtotal || 0;
      aggregate.discount += item.discount || 0;
      aggregate.paidNow += item.paidNow || 0;
      aggregate.remaining += item.remaining || 0;
      aggregate.finalAmount += item.finalAmount || 0;
    });

    return aggregate;
  }

  function calculateCartGrandTotal(items) {
    return calculateCartAggregate(items).paidNow;
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  function formatNumber(value) {
    return new Intl.NumberFormat('id-ID').format(value);
  }

  function formatUnitPrice(unitPrice) {
    return formatCurrency(unitPrice) + ' / pcs';
  }

  global.ReserveCheckout = {
    DISCOUNT_RATE: DISCOUNT_RATE,
    DP_RATE: DP_RATE,
    PRIORITY_MAP: PRIORITY_MAP,
    PAYMENT_LABELS: PAYMENT_LABELS,
    getPriority: getPriority,
    formatPriorityLabel: formatPriorityLabel,
    getPaymentModeLabel: getPaymentModeLabel,
    getTotalPcs: getTotalPcs,
    getActiveSizeLines: getActiveSizeLines,
    toAllocations: toAllocations,
    calculateProgress: calculateProgress,
    calculateFromAllocation: calculateFromAllocation,
    calculateSummary: calculateSummary,
    calculateCartAggregate: calculateCartAggregate,
    calculateCartGrandTotal: calculateCartGrandTotal,
    formatCurrency: formatCurrency,
    formatNumber: formatNumber,
    formatUnitPrice: formatUnitPrice
  };
})(typeof window !== 'undefined' ? window : this);
