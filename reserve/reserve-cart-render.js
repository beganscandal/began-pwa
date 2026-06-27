/**
 * RESERVE SYSTEM —Ringkasan Reserve drawer UI 
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
  {
    label: 'Payment',
    value: item.paymentLabel,
    priority: false
  },

  {
    label: 'Priority',
    value: formatPriority(
      item.priority
    ),
    priority: true,
    level: item.priority
  },

  {
    label: 'Subtotal',
    value: Checkout.formatCurrency(
      item.subtotal
    ),
    priority: false
  }
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
  (
    product.productId ||
    product.id
  ) === item.productId
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
  Number(
    item.sizeQty?.[size] || 0
  );

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

  btn.dataset.paymentMode =
    item.paymentMode;

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
      input.dataset.oldPaymentMode =
  item.paymentMode;
      input.checked = mode.id === item.paymentMode;

      setText(label, '[data-drawer-payment-label]', mode.label);
      label.setAttribute('for', inputId);
      if (mode.id === item.paymentMode) label.classList.add('is-active');

      container.appendChild(fragment);
    });
  }
  function formatPriority(priority){

  switch(priority){

    case 'PRIORITY_01':
      return 'PRIORITY 01';

    case 'PRIORITY_02':
      return 'PRIORITY 02';

    default:
      return 'PRIORITY 03';

  }

}

  function renderDrawerItem(item) {
    var fragment = Template.cloneFragment(Template.getTemplateIds().drawerItem);
    var block = fragment.querySelector('[data-drawer-item]');
    if (!block) return null;

    block.dataset.productId = item.productId;
    const product =
  (window.BEGAN_PRODUCTS || [])
    .find(function(product){

      return (
        (
          product.productId ||
          product.id
        ) === item.productId
      );

    });

const priorityBadge =
  block.querySelector(
    '[data-drawer-priority]'
  );

if(priorityBadge){

  priorityBadge.textContent =
    formatPriority(
      item.priority
    );

}    
    
    const thumb =
  block.querySelector(
    '[data-drawer-item-thumb]'
  );

if(
  thumb &&
  product
){
  
  var thumbImage =
  String(product.image || '')
    .split('|')
    .map(function(url){
      return url.trim();
    })
    .filter(Boolean)[0] || '';


thumb.src =
  thumbImage ||
  product.imageFallback ||
  '';

  thumb.alt =
    product.productName ||
    product.name ||
    '';

  thumb.onerror =
    function(){

      if(
        product.imageFallback &&
        thumb.src !==
        product.imageFallback
      ){
        thumb.src =
          product.imageFallback;
      }

    };

}
    const retailPrice =
  Number(
    product?.unitPrice || 0
  ) * 2;

setText(
  block,
  '[data-drawer-item-retail]',
  Checkout.formatCurrency(
    retailPrice
  )
);
  
    const itemSubtotal =
  Number(
    item.subtotal ||
    (
      Number(item.totalPcs || 0) *
      Number(
        item.unitPrice ||
        item.price ||
        0
      )
    )
  );
    const beforeDiscount =
  block.querySelector(
    '[data-drawer-before-discount]'
  );

if(beforeDiscount){

  beforeDiscount.hidden =
    item.paymentMode !== 'FULL_PAYMENT'

}

setText(
  block,
  '[data-drawer-item-subtotal]',
  Checkout.formatCurrency(
    itemSubtotal
  )
);
    setText(
  block,
  '[data-drawer-item-name]',
  item.productName ||
  item.name ||
  '-'
);
    setText(
  block,
  '[data-drawer-item-unit-price]',
  Checkout.formatUnitPrice(

    Number(
      item.unitPrice ||
      item.price ||
      0
    )

  )
);
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

  function ensureFab(){

  let fab =
    document.getElementById(
      'reserve-fab'
    );

  if(fab){
    return fab;
  }

  fab =
    document.createElement(
      'button'
    );

  fab.type = 'button';

  fab.id = 'reserve-fab';

  fab.className =
    'reserve-fab';

  fab.hidden = true;

  fab.setAttribute(
    'data-action',
    'open-drawer'
  );

  fab.setAttribute(
    'aria-expanded',
    'false'
  );

  fab.innerHTML = `

    <span class="reserve-fab__label">

    <i
      data-lucide="shopping-cart"
      class="reserve-fab__icon">
    </i>

    RINGKASAN RESERVE

  </span>

    <span class="reserve-fab__count">

      (
        <span data-cart-count>
          0
        </span>
      )

    </span>

  `;

  
fab.addEventListener(
  'click',
  function(){

    const drawer =
      document.getElementById(
        'reserve-drawer-root'
      );

    if(!drawer){
      return;
    }

    drawer.classList.add(
      'is-open'
    );

  }
);

  document
    .getElementById(
      'reserve-app'
    )
    ?.appendChild(
      fab
    );

  return fab;

}
  
function ensureDrawerRoot(){

  let root =
    document.getElementById(
      'reserve-drawer-root'
    );

  if(
  root &&
  root.querySelector(
    '[data-drawer-list]'
  )
){
  return root;
}
  if(root){
  root.remove();
}

  root =
    document.createElement(
      'div'
    );

  root.id =
    'reserve-drawer-root';

  root.className =
    'reserve-drawer-root';

  root.setAttribute(
    'aria-hidden',
    'true'
  );

  root.innerHTML = `

    <div
      class="reserve-drawer-backdrop"
      data-action="close-drawer"
      aria-hidden="true">
    </div>

    <aside
      id="reserve-drawer"
      class="reserve-drawer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reserve-drawer-title">

      <header class="reserve-drawer__head">

        <h2 id="reserve-drawer-title">
          Ringkasan Reserve
        </h2>

        <button
          type="button"
          class="reserve-drawer__close"
          data-action="close-drawer"
          aria-label="Tutup ringkasan">

          ×

        </button>

      </header>
<div class="reserve-drawer__content">
      <div class="reserve-drawer__body">

        <p
          class="reserve-drawer__empty"
          data-drawer-empty
          hidden>

          Belum ada alokasi reserve.

        </p>

        <div
          class="reserve-drawer__list"
          data-drawer-list
          role="list">
        </div>

      </div>

      <footer class="reserve-drawer__foot">

        <p
          class="reserve-drawer__status"
          data-drawer-status
          hidden
          role="alert">
        </p>

        <dl class="reserve-drawer__totals">

          <div class="reserve-drawer__total-row">
            <dt>Total Reserve</dt>
            <dd data-drawer-total-qty>
              0 PCS
            </dd>
          </div>

          <div class="reserve-drawer__total-row">
            <dt>Subtotal</dt>
            <dd data-drawer-subtotal>
              Rp0
            </dd>
          </div>

          <div
            class="reserve-drawer__total-row reserve-drawer__total-row--discount"
            data-drawer-discount-row
            hidden>

            <dt>Total Diskon 5%</dt>

            <dd data-drawer-discount>
              −Rp0
            </dd>

          </div>

          <div class="reserve-drawer__total-row reserve-drawer__total-row--highlight">
            <dt>Total Dibayar Sekarang</dt>

            <dd data-drawer-paid-now>
              Rp0
            </dd>
          </div>

          <div class="reserve-drawer__total-row">
            <dt>Total Sisa Pelunasan</dt>

            <dd data-drawer-remaining>
              Rp0
            </dd>
          </div>

          <div class="reserve-drawer__total-row reserve-drawer__total-row--final">
            <dt>Total Nilai Reserve</dt>

            <dd data-drawer-final>
              Rp0
            </dd>
          </div>

        </dl>

        <button
          type="button"
          class="reserve-cta reserve-cta--confirm"
          data-action="confirm-reserve">

          <span data-confirm-label>
            CONFIRM RESERVE
          </span>

        </button>

      </footer>
</div>
    </aside>

  `;

 document
  .getElementById(
    'reserve-app'
  )
  ?.appendChild(root);

  
root
  .querySelectorAll(
    '[data-action="close-drawer"]'
  )
  .forEach(function(btn){

    btn.addEventListener(
      'click',
      function(){

        root.classList.remove(
          'is-open'
        );

      }
    );

  });



  return root;

}


  function bindElements() { 
    fabEl = ensureFab();
    drawerRoot = ensureDrawerRoot(); 
    listEl = document.querySelector( '[data-drawer-list]' );
    countEl = document.querySelector( '[data-cart-count]' );
    emptyEl = document.querySelector( '[data-drawer-empty]' );
    discountRow = document.querySelector( '[data-drawer-discount-row]' ); 
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
  showDrawerStatus: showDrawerStatus,
  ensureDrawerRoot: ensureDrawerRoot,
  ensureFab: ensureFab
};

})(typeof window !== 'undefined' ? window : this);
