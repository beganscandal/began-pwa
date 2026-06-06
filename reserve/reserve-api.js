/**
 * RESERVE SYSTEM — Apps Script API client
 * POST reserve first → receive orderId / reserveIds → then WhatsApp
 */
window.BEGAN_RESERVE_API =
'https://script.google.com/macros/s/AKfycbw4mu0uuhnprRIcM0Jeft4y8QlPqc6J79NlIoj-d6KD_glSEXrCACM9X6-387_0QO8Wcg/exec';

(function (global) {
  'use strict';

  function getConfig() {

  return {

    appsScriptUrl:
      window.BEGAN_RESERVE_API || '',

    useMockApi: false,
      
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
          items: (payload.items || []).map(function (item, index) {
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

    if(!config.appsScriptUrl){

  throw new Error(
    'Apps Script URL missing'
  );

}

    if (shouldUseMock(config)) {
      console.info('[Reserve API] Mock mode — simulating Apps Script save');
      return mockSubmit(payload);
    }

    var body = Object.assign(
  {
    action:
      config.apiAction ||
      'createReserveOrder'
  },
  payload
);
    if(
  !payload ||
  !Array.isArray(payload.items)
){
  throw new Error(
    'Invalid reserve payload'
  );
}

if(!payload.items.length){
  throw new Error(
    'Reserve items empty'
  );
}

if(
  !payload.partner ||
  !payload.partner.id
){
  throw new Error(
    'Partner ID missing'
  );
}
    var controller =
  new AbortController();

var timeout =
  setTimeout(function(){

    controller.abort();

  }, 20000);
    
   return fetch(config.appsScriptUrl, {
  method: 'POST',
  headers: {
    'Content-Type':
      'text/plain;charset=utf-8'
  },
  body: JSON.stringify(body),
     signal: controller.signal
})
      .then(function (response) {
        return parseResponseBody(response).then(function (data) {

          if(
  !data ||
  typeof data !== 'object'
){
  throw new Error(
    'Invalid API response'
  );
}
          if (!response.ok) {
            var err = new Error(data.message || 'Reserve save failed (' + response.status + ')');
            err.status = response.status;
            err.data = data;
            throw err;
          }
          if (
  data.ok === false ||
  data.success === false            
) {      
            var failErr = 
              new Error(data.message || 'Reserve save rejected'
              );
            
            failErr.data = data;
            
            throw failErr;
          }

          return {
            ok: true,
            orderId: data.orderId,
            items: data.items || [],
            message: data.message || 'Reserve saved'
          };
        });
      })
    .finally(function(){

  clearTimeout(timeout);

});
  }
  
  

  global.ReserveApi = {
    getConfig: getConfig,
    submitReserve: submitReserve
  };
})(typeof window !== 'undefined' ? window : this);
