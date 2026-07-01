/**
 * RESERVE SYSTEM — Runtime configuration (Apps Script + WhatsApp)
 * Set appsScriptUrl to your deployed Web App URL before production..
 */
window.RESERVE_DEV_MODE = false;
window.BEGAN_DASHBOARD_API =
'https://script.google.com/macros/s/AKfycbzuIjJZWc_o6qaUUKgyZ8m4qYJLzvJax6Pil1sdEhvNCgL6EO7s74pZnjnPY3Z8f32Z/exec';

(function (global) {
  'use strict';

  global.BEGAN_RESERVE_CONFIG = {
    /** Google Apps Script Web App URL (POST JSON) */
    appsScriptUrl: '',
    /** Production / admin WhatsApp (country code, no +) */
    whatsappNumber: '6285759709855',
    /** true = simulate successful save when appsScriptUrl is empty */
    useMockApi: false,
    /** Apps Script action name */
    apiAction: 'confirmReserve'
  };
})(typeof window !== 'undefined' ? window : this);

