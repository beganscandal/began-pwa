(() => {
  "use strict";

  const ONE_SIGNAL_APP_ID = "37e11236-e95b-4d5d-b925-f7b5f8308cdd";
  const SAFARI_WEB_ID = "web.onesignal.auto.14469d21-a548-446f-9323-a0e21fc14d38";
  const DASHBOARD_URL = "https://barkahgarment.com/began-partner-dashboard-dev";
  const DASHBOARD_ORIGINS = new Set([
    "https://barkahgarment.com",
    "https://www.barkahgarment.com"
  ]); 

  const params = new URLSearchParams(window.location.search);
  const partnerId = String(
    params.get("partner") || params.get("partnerId") || ""
  ).trim();
  const toko = String(params.get("toko") || "").trim();

  const button = document.getElementById("enableNotif");
  const subtitle = document.querySelector(".auth-sub");

  let busy = false;
  let oneSignalReadyPromise = null;
  let finalStateReached = false;

  function setUi(label, message, disabled = false) {
    if (button) {
      button.textContent = label;
      button.disabled = disabled;
    }

    if (subtitle && message) {
      subtitle.textContent = message;
    }
  }

  function getDashboardOrigin() {
    try {
      const referrerOrigin = new URL(document.referrer).origin;
      if (DASHBOARD_ORIGINS.has(referrerOrigin)) {
        return referrerOrigin;
      }
    } catch (error) {
      // The page may be opened without a referrer. Use the canonical origin.
    }

    return "https://barkahgarment.com";
  }

  function notifyDashboard(type, extra = {}) {
    if (!window.opener || window.opener.closed) {
      return false;
    }

    try {
      window.opener.postMessage(
        {
          type,
          partnerId,
          ...extra
        },
        getDashboardOrigin()
      );
      return true;
    } catch (error) {
      console.warn("BEGAN PUSH POSTMESSAGE FAILED", error);
      return false;
    }
  }

  function redirectToDashboard(status) {
    const target = new URL(DASHBOARD_URL);
    target.searchParams.set("push", status);
    window.location.replace(target.toString());
  }

  function finishSuccess() {
    if (finalStateReached) return;
    finalStateReached = true;

    setUi("🔥 ALERT ACTIVE", "Notifikasi artikel terbaru sudah aktif.", true);

    const notified = notifyDashboard("BEGAN_PUSH_SUCCESS", {
      subscriptionActive: true
    });

    window.setTimeout(() => {
      if (notified) {
        window.close();
      }

      window.setTimeout(() => {
        if (!window.closed) {
          redirectToDashboard("success");
        }
      }, 700);
    }, 900);
  }

  function finishDenied(reason, blocked = false) {
    finalStateReached = false;
    busy = false;

    notifyDashboard("BEGAN_PUSH_DENIED", { reason });

    if (blocked) {
      setUi(
        "NOTIFIKASI DIBLOKIR",
        "Buka info situs di browser, ubah izin Notifikasi menjadi Izinkan, lalu kembali ke halaman ini.",
        false
      );
      return;
    }

    setUi(
      "COBA LAGI",
      "Izin notifikasi belum diberikan. Tekan lagi lalu pilih Izinkan pada dialog browser.",
      false
    );
  }

  function loadSdkScript() {
    if (document.querySelector('script[data-began-onesignal-sdk="1"]')) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const sdk = document.createElement("script");
      sdk.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
      sdk.defer = true;
      sdk.dataset.beganOnesignalSdk = "1";
      sdk.onload = resolve;
      sdk.onerror = () => reject(new Error("ONESIGNAL_SDK_LOAD_FAILED"));
      document.head.appendChild(sdk);
    });
  }

  async function getOneSignal() {
    if (oneSignalReadyPromise) {
      return oneSignalReadyPromise;
    }

    oneSignalReadyPromise = new Promise(async (resolve, reject) => {
      let timeoutId = window.setTimeout(() => {
        reject(new Error("ONESIGNAL_INIT_TIMEOUT"));
      }, 20000);

      try {
        window.OneSignalDeferred = window.OneSignalDeferred || [];

        if (!document.querySelector('script[src*="OneSignalSDK.page.js"]')) {
          await loadSdkScript();
        }

        window.OneSignalDeferred.push(async function (OneSignal) {
          try {
            await OneSignal.init({
              appId: ONE_SIGNAL_APP_ID,
              safari_web_id: SAFARI_WEB_ID,
              notifyButton: { enable: false },
              autoResubscribe: true,
              serviceWorkerPath: "/OneSignalSDKWorker.js",
              serviceWorkerParam: { scope: "/" }
            });

            window.clearTimeout(timeoutId);
            resolve(OneSignal);
          } catch (error) {
            window.clearTimeout(timeoutId);
            reject(error);
          }
        });
      } catch (error) {
        window.clearTimeout(timeoutId);
        reject(error);
      }
    });

    oneSignalReadyPromise.catch(() => {
      oneSignalReadyPromise = null;
    });

    return oneSignalReadyPromise;
  }

  function isBrowserPermissionGranted(OneSignal) {
    return Boolean(
      OneSignal.Notifications.permission === true ||
      (typeof Notification !== "undefined" && Notification.permission === "granted")
    );
  }

  function isBrowserPermissionBlocked() {
    return Boolean(
      typeof Notification !== "undefined" &&
      Notification.permission === "denied"
    );
  }

  function isSubscriptionReady(OneSignal) {
    const subscription = OneSignal.User && OneSignal.User.PushSubscription;
    if (!subscription) return false;

    return Boolean(
      subscription.optedIn === true &&
      (subscription.token || subscription.id)
    );
  }

  async function waitForSubscription(OneSignal, timeoutMs = 15000) {
    const startedAt = Date.now();

    while (Date.now() - startedAt < timeoutMs) {
      if (isSubscriptionReady(OneSignal)) {
        return true;
      }

      await new Promise((resolve) => window.setTimeout(resolve, 250));
    }

    return isSubscriptionReady(OneSignal);
  }

  async function waitForExternalId(OneSignal, expectedId, timeoutMs = 8000) {
    if (!expectedId) return true;

    const startedAt = Date.now();

    while (Date.now() - startedAt < timeoutMs) {
      if (String(OneSignal.User.externalId || "") === expectedId) {
        return true;
      }

      await new Promise((resolve) => window.setTimeout(resolve, 200));
    }

    return String(OneSignal.User.externalId || "") === expectedId;
  }

  async function syncPartnerIdentity(OneSignal) {
    if (!partnerId) {
      throw new Error("PARTNER_ID_MISSING");
    }

    const previousExternalId = localStorage.getItem(
      "began_onesignal_external_id"
    );

    if (
      previousExternalId &&
      previousExternalId !== partnerId &&
      typeof OneSignal.logout === "function"
    ) {
      await OneSignal.logout();
    }

    await OneSignal.login(partnerId);

    const identityReady = await waitForExternalId(OneSignal, partnerId);
    if (!identityReady) {
      throw new Error("ONESIGNAL_IDENTITY_SYNC_TIMEOUT");
    }

    localStorage.setItem("began_onesignal_external_id", partnerId);

    try {
      const tags = { partner: partnerId };
      if (toko) tags.toko = toko;
      OneSignal.User.addTags(tags);
    } catch (error) {
      // External ID is the targeting authority. Tags are helpful metadata and
      // must not invalidate an otherwise healthy push subscription.
      console.warn("BEGAN PUSH TAG SYNC FAILED", error);
    }
  }

  async function activatePush() {
    if (busy || finalStateReached) return;

    busy = true;
    setUi("CONNECTING...", "Menghubungkan notifikasi partner...", true);

    try {
      if (!partnerId) {
        throw new Error("PARTNER_ID_MISSING");
      }

      const OneSignal = await getOneSignal();

      if (!OneSignal.Notifications.isPushSupported()) {
        throw new Error("PUSH_NOT_SUPPORTED");
      }

      if (isBrowserPermissionBlocked()) {
        finishDenied("permission_blocked", true);
        return;
      }

      if (!isBrowserPermissionGranted(OneSignal)) {
        // requestPermission() does not return "granted" in Web SDK v16.
        // The supported authority is OneSignal.Notifications.permission.
        await OneSignal.Notifications.requestPermission();
      }

      if (!isBrowserPermissionGranted(OneSignal)) {
        finishDenied("permission_not_granted", isBrowserPermissionBlocked());
        return;
      }

      if (!OneSignal.User.PushSubscription.optedIn) {
        await OneSignal.User.PushSubscription.optIn();
      }

      const subscriptionReady = await waitForSubscription(OneSignal);
      if (!subscriptionReady) {
        throw new Error("ONESIGNAL_SUBSCRIPTION_TIMEOUT");
      }

      await syncPartnerIdentity(OneSignal);
      finishSuccess();
    } catch (error) {
      console.error("BEGAN PUSH ACTIVATION FAILED", error);
      busy = false;

      const code = String(error && error.message ? error.message : error);

      if (code.includes("PARTNER_ID_MISSING")) {
        setUi(
          "KEMBALI KE DASHBOARD",
          "Partner ID tidak ditemukan. Tutup halaman ini lalu aktifkan notifikasi dari dashboard partner.",
          false
        );
        return;
      }

      if (code.includes("PUSH_NOT_SUPPORTED")) {
        setUi(
          "DEVICE NOT SUPPORTED",
          "Browser atau perangkat ini belum mendukung web push notification.",
          true
        );
        return;
      }

      setUi(
        "COBA LAGI",
        "Koneksi notifikasi belum berhasil. Pastikan internet aktif lalu tekan Coba Lagi.",
        false
      );
    }
  }

  async function preparePage() {
    if (!button) return;

    button.addEventListener("click", activatePush);

    if (!partnerId) {
      setUi(
        "KEMBALI KE DASHBOARD",
        "Partner ID tidak ditemukan. Aktifkan notifikasi melalui dashboard partner.",
        false
      );
      return;
    }

    setUi("CONNECTING...", "Menyiapkan sistem notifikasi...", true);

    try {
      const OneSignal = await getOneSignal();

      if (!OneSignal.Notifications.isPushSupported()) {
        throw new Error("PUSH_NOT_SUPPORTED");
      }

      if (isSubscriptionReady(OneSignal)) {
        await syncPartnerIdentity(OneSignal);
        finishSuccess();
        return;
      }

      if (isBrowserPermissionBlocked()) {
        finishDenied("permission_blocked", true);
        return;
      }

      busy = false;
      setUi(
        "🔔 AKTIFKAN ALERT ARTIKEL BARU",
        "Tekan tombol lalu pilih Izinkan pada dialog notifikasi browser.",
        false
      );
    } catch (error) {
      console.error("BEGAN PUSH PREPARE FAILED", error);
      busy = false;
      oneSignalReadyPromise = null;
      setUi(
        "COBA LAGI",
        "Sistem notifikasi belum tersambung. Pastikan internet aktif lalu coba lagi.",
        false
      );
    }
  }

  preparePage();
})();
