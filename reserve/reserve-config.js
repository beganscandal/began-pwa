/**
 * RESERVE SYSTEM — Runtime configuration (Apps Script + WhatsApp)
 * Set appsScriptUrl to your deployed Web App URL before production.
 */
(function (global) {
  'use strict';

  global.BEGAN_RESERVE_CONFIG = {
    /** Google Apps Script Web App URL (POST JSON) */
    appsScriptUrl: '',
    /** Production / admin WhatsApp (country code, no +) */
    whatsappNumber: '6285759709855',
    /** true = simulate successful save when appsScriptUrl is empty */
    useMockApi: true,
    /** Apps Script action name */
    apiAction: 'confirmReserve'
  };
})(typeof window !== 'undefined' ? window : this);
