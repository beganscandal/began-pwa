/**
 * RESERVE SYSTEM — Ringkasan Reserve drawer UI
 */

(function (global) {
  'use strict';

  var Template = global.ReserveTemplate;
  var Checkout = global.ReserveCheckout;
  var Cart = global.ReserveCart;
  var State = global.ReserveState;

  var fabEl = null;
  var drawerRoot = null;
  var listEl = null;
  var countEl = null;
  var emptyEl = null;
  var discountRow = null;

  function setText(root, selector, text) {
    var el = root.querySelector(selector);
    if (el) el.textContent = text;
  }

  function buildPaymentMetaRows(item) {
    var rows = [
      { label: 'Payment', value: item.paymentLabel, priority: false },
      { label: 'Priority', value: item.priorityLabel, priority: true, level: item.priority },
      { label: 'Subtotal', value: Checkout.formatCurrency(item.subtotal), priority: false }
    ];

    if (item.paymentMode === 'FULL_PAYMENT') {
      if (item.hasDiscount) {
        rows.push({
          label: 'Diskon 5%',
          value: '−' + Checkout.formatCurrency(item.discount),
          discount: true
        });
      }
      rows.push({
        label: 'Total Dibayar',
        value: Checkout.formatCurrency(item.paidNow),
        highlight: true
      });
      rows.push({
        label: 'Sisa Pembayaran',
        value: Checkout.formatCurrency(0),
        priority: false
      });
    } else if (item.paymentMode === 'DP_50') {
      rows.push({
        label: 'DP Dibayar Sekarang',
        value: Checkout.formatCurrency(item.paidNow),
        highlight: true
      });
      rows.push({
        label: 'Sisa Pelunasan',
        value: Checkout.formatCurrency(item.remaining),
        priority: false
      });
      rows.push({
        label: 'Total Final',
        value: Checkout.formatCurrency(item.finalAmount),
        final: true
      });
    } else {
      rows.push({
        label: 'Belum Ada Pembayaran',
        value: Checkout.formatCurrency(0),
        muted: true
      });
      rows.push({
        label: 'Sisa Pembayaran',
        value: Checkout.formatCurrency(item.remaining),
        highlight: true
      });
    }

    return rows;
  }

  function renderPaymentMeta(container, item) {
    if (!container) return;
    container.innerHTML = '';

    buildPaymentMetaRows(item).forEach(function (row) {
      var div = document.createElement('div');
      div.className = 'reserve-drawer-item__meta-row';
      if (row.discount) div.classList.add('reserve-drawer-item__meta-row--discount');
      if (row.highlight) div.classList.add('reserve-drawer-item__meta-row--highlight');
      if (row.final) div.classList.add('reserve-drawer-item__meta-row--final');

      var dt = document.createElement('dt');
      dt.textContent = row.label;
      var dd = document.createElement('dd');
      if (row.priority) {
        var span = document.createElement('span');
        span.className = 'reserve-priority';
        span.textContent = row.value;
        span.dataset.priorityLevel = row.level;
        dd.appendChild(span);
      } else {
        dd.textContent = row.value;
      }

      div.appendChild(dt);
      div.appendChild(dd);
      container.appendChild(div);
    });
  }

  function buildDrawerSizeEditor(
  container,
  item
){

  container.innerHTML = '';

  var product =
  (window.BEGAN_PRODUCTS || [])
    .find(function(product){

      return (
        product.productId ===
        item.productId
      );

    });

  if(!product){
    return;
  }

  var sizes =
  (product.realtimeSizes || [])
    .map(function(size){

      return size.sizeLabel;

    });
  sizes.forEach(function(size){

    var fragment =
      Template.cloneFragment(
        Template
          .getTemplateIds()
          .drawerSizeLine
      );

    var row =
      fragment.querySelector(
        '[data-drawer-size-line]'
      );

    if(!row){
      return;
    }

    var qty =
      item.sizeQty[size] || 0;

    setText(
      row,
      '[data-drawer-size-label]',
      size + ' :'
    );

    setText(
      row,
      '[data-drawer-size-qty]',
      String(qty)
    );

    row.querySelectorAll(
      '[data-action="cart-size-minus"], [data-action="cart-size-plus"]'
    ).forEach(function(btn){

      btn.dataset.productId =
        item.productId;

      btn.dataset.size =
        size;

    });

    var minusBtn =
      row.querySelector(
        '[data-action="cart-size-minus"]'
      );

    if(minusBtn){

      minusBtn.disabled =
        qty <= State.MIN_QTY;

    }

    container.appendChild(
      fragment
    );

  });

}

  function buildDrawerPaymentOptions(container, item) {
    container.innerHTML = '';
    Template.PAYMENT_MODES.forEach(function (mode) {
      var fragment = Template.cloneFragment(Template.getTemplateIds().drawerPaymentOption);
      var label = fragment.querySelector('.reserve-drawer-pay');
      var input = fragment.querySelector('input[type="radio"]');
      if (!label || !input) return;

      var inputId = 'drawer-pay-' + item.productId + '-' + mode.id;
      input.id = inputId;
      input.name = 'drawer-payment-' + item.productId;
      input.value = mode.id;
      input.dataset.productId = item.productId;
      input.checked = mode.id === item.paymentMode;

      setText(label, '[data-drawer-payment-label]', mode.label);
      label.setAttribute('for', inputId);
      if (mode.id === item.paymentMode) label.classList.add('is-active');

      container.appendChild(fragment);
    });
  }

  function renderDrawerItem(item) {
    var fragment = Template.cloneFragment(Template.getTemplateIds().drawerItem);
    var block = fragment.querySelector('[data-drawer-item]');
    if (!block) return null;

    block.dataset.productId = item.productId;
    setText(block, '[data-drawer-item-name]', item.productName);
    setText(block, '[data-drawer-item-unit-price]', Checkout.formatUnitPrice(item.unitPrice));
    setText(block, '[data-drawer-item-total-pcs]', String(item.totalPcs));

    var editor = block.querySelector('[data-drawer-size-editor]');
    if (editor) buildDrawerSizeEditor(editor, item);

    var paymentGroup = block.querySelector('[data-drawer-payment-group]');
    if (paymentGroup) buildDrawerPaymentOptions(paymentGroup, item);

    var meta = block.querySelector('[data-drawer-item-payment-meta]');
    renderPaymentMeta(meta, item);

    return block;
  }

  function renderDrawerList(items) {
    if (!listEl) return;
    listEl.innerHTML = '';

    if (!items.length) {
      if (emptyEl) emptyEl.hidden = false;
      return;
    }

    if (emptyEl) emptyEl.hidden = true;

    items.forEach(function (item) {
      var block = renderDrawerItem(item);
      if (block) listEl.appendChild(block);
    });
  }

  function updateDrawerTotals(snapshot) {
    setText(document, '[data-drawer-total-qty]', Checkout.formatNumber(snapshot.totalQty) + ' PCS');
    setText(document, '[data-drawer-subtotal]', Checkout.formatCurrency(snapshot.subtotal));
    setText(document, '[data-drawer-discount]', '−' + Checkout.formatCurrency(snapshot.discount));
    setText(document, '[data-drawer-paid-now]', Checkout.formatCurrency(snapshot.paidNow));
    setText(document, '[data-drawer-remaining]', Checkout.formatCurrency(snapshot.remaining));
    setText(document, '[data-drawer-final]', Checkout.formatCurrency(snapshot.finalAmount));

    if (discountRow) {
      discountRow.hidden = snapshot.discount <= 0;
    }
  }

  function updateFab(snapshot) {
    if (!fabEl) return;
    var hasItems = snapshot.count > 0;
    fabEl.hidden = !hasItems;
    fabEl.classList.toggle('is-visible', hasItems);

    if (countEl) {
      countEl.textContent = String(snapshot.count);
    }
  }

  function showDrawerStatus(message, isError) {
    var el = document.querySelector('[data-drawer-status]');
    if (!el) return;
    if (!message) {
      el.hidden = true;
      el.textContent = '';
      el.classList.remove('is-error', 'is-success');
      return;
    }
    el.hidden = false;
    el.textContent = message;
    el.classList.toggle('is-error', !!isError);
    el.classList.toggle('is-success', !isError);
  }

  function renderCart(snapshot) {
    updateFab(snapshot);
    renderDrawerList(snapshot.reserveItems || []);
    updateDrawerTotals(snapshot);
  }

  function bindElements() {
    fabEl = document.getElementById('reserve-fab');
    drawerRoot = document.getElementById('reserve-drawer-root');
    listEl = document.querySelector('[data-drawer-list]');
    countEl = document.querySelector('[data-cart-count]');
    emptyEl = document.querySelector('[data-drawer-empty]');
    discountRow = document.querySelector('[data-drawer-discount-row]');
  }

  function init() {
    bindElements();
    Cart.subscribe(renderCart);
    renderCart(Cart.getSnapshot());
  }

  global.ReserveCartRender = {
    init: init,
    renderCart: renderCart,
    renderDrawerList: renderDrawerList,
    showDrawerStatus: showDrawerStatus
  };
})(typeof window !== 'undefined' ? window : this);
