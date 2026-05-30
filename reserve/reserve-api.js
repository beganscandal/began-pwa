/**
 * RESERVE SYSTEM — Apps Script API client
 * POST reserve first → receive orderId / reserveIds → then WhatsApp
 */
window.BEGAN_RESERVE_API =
'https://script.google.com/macros/s/AKfycbyvyLXPBD7X7JlWXdCaSlO9MSy6pW4AiavEtQd2scemwcLHUgNy67hSW26s4zUCB0Vpqw/exec';

(function (global) {
  'use strict';

  function getConfig() {

  return {

    appsScriptUrl:
      window.BEGAN_RESERVE_API || '',

    useMockApi:
      !window.BEGAN_RESERVE_API,

    apiAction:
      'createReserveOrder'

  };

}

  function shouldUseMock(config) {
    return config.useMockApi || !config.appsScriptUrl;
  }

  function mockSubmit(payload) {
    return new Promise(function (resolve) {
      window.setTimeout(function () {
        var orderId = 'ORD-' + Date.now();
        resolve({
          ok: true,
          orderId: orderId,
          reserveItems: (payload.reserveItems || []).map(function (item, index) {
            return {
              reserveId: item.reserveId || 'RSV-MOCK-' + (index + 1),
              productId: item.productId,
              orderId: orderId
            };
          }),
          message: 'Mock save successful — set appsScriptUrl for production'
        });
      }, 600);
    });
  }

  function parseResponseBody(response) {
    return response.text().then(function (text) {
      if (!text) return {};
      try {
        return JSON.parse(text);
      } catch (err) {
        return { raw: text };
      }
    });
  }

  function submitReserve(payload) {
    var config = getConfig();

    if (shouldUseMock(config)) {
      console.info('[Reserve API] Mock mode — simulating Apps Script save');
      return mockSubmit(payload);
    }

    var body = {
      action: config.apiAction || 'confirmReserve',
      data: payload
    };

    return fetch(config.appsScriptUrl, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(function (response) {
        return parseResponseBody(response).then(function (data) {
          if (!response.ok) {
            var err = new Error(data.message || 'Reserve save failed (' + response.status + ')');
            err.status = response.status;
            err.data = data;
            throw err;
          }
          if (data.ok === false) {
            var failErr = new Error(data.message || 'Reserve save rejected');
            failErr.data = data;
            throw failErr;
          }
          return {
            ok: true,
            orderId: data.orderId,
            reserveItems: data.reserveItems || [],
            message: data.message || 'Reserve saved'
          };
        });
      });
  }

  global.ReserveApi = {
    getConfig: getConfig,
    submitReserve: submitReserve
  };
})(typeof window !== 'undefined' ? window : this);
