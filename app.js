(() => {
  "use strict";

  const ONE_SIGNAL_APP_ID = "37e11236-e95b-4d5d-b925-f7b5f8308cdd";
  const SAFARI_WEB_ID = "web.onesignal.auto.14469d21-a548-446f-9323-a0e21fc14d38";
  const DASHBOARD_URL = "https://barkahgarment.com/began-partner-dashboard-dev";
  const DASHBOARD_ORIGINS = new Set([
    "https://barkahgarment.com",
    "https://www.barkahgarment.com"
  ]);
  const ACTIVATION_TIMEOUT_MS = 35000;

  const params = new URLSearchParams(window.location.search);
  const partnerId = String(
    params.get("partner") || params.get("partnerId") || ""
  ).trim();
  const toko = String(params.get("toko") || "").trim();

  const button = document.getElementById("enableNotif");
  const closeButton = document.getElementById("closeAlert");
  const subtitle = document.querySelector(".auth-sub");

  let busy = false;
  let oneSignalReadyPromise = null;
  let finalStateReached = false;
  let operationEpoch = 0;

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

  function buildDashboardUrl(status) {
    const target = new URL(DASHBOARD_URL);
    target.searchParams.set("push", status);
    return target.toString();
  }

  function redirectToDashboard(status) {
    window.location.replace(buildDashboardUrl(status));
  }

  function closeAccessPage(reason = "cancelled") {
    if (finalStateReached) return;

    operationEpoch += 1;
    busy = false;
    oneSignalReadyPromise = null;

    setUi(
      "KEMBALI KE DASHBOARD",
      "Aktivasi notifikasi ditutup. Anda dapat mencobanya kembali kapan saja.",
      true
    );

    const notified = notifyDashboard("BEGAN_PUSH_CANCELLED", { reason });

    window.setTimeout(() => {
      if (notified) {
        window.close();
      }

      window.setTimeout(() => {
        if (!window.closed) {
          redirectToDashboard("cancelled");
        }
      }, 500);
    }, 80);
  }

  function assertOperation(epoch) {
    if (epoch !== operationEpoch || finalStateReached) {
      throw new Error("OPERATION_CANCELLED");
    }
  }

  function finishSuccess() {
    if (finalStateReached) return;
    finalStateReached = true;
    operationEpoch += 1;

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
      const timeoutId = window.setTimeout(() => {
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

  async function waitForSubscription(OneSignal, epoch, timeoutMs = 15000) {
    const startedAt = Date.now();

    while (Date.now() - startedAt < timeoutMs) {
      assertOperation(epoch);

      if (isSubscriptionReady(OneSignal)) {
        return true;
      }

      await new Promise((resolve) => window.setTimeout(resolve, 250));
    }

    assertOperation(epoch);
    return isSubscriptionReady(OneSignal);
  }

  async function waitForExternalId(
    OneSignal,
    expectedId,
    epoch,
    timeoutMs = 8000
  ) {
    if (!expectedId) return true;

    const startedAt = Date.now();

    while (Date.now() - startedAt < timeoutMs) {
      assertOperation(epoch);

      if (String(OneSignal.User.externalId || "") === expectedId) {
        return true;
      }

      await new Promise((resolve) => window.setTimeout(resolve, 200));
    }

    assertOperation(epoch);
    return String(OneSignal.User.externalId || "") === expectedId;
  }

  async function syncPartnerIdentity(OneSignal, epoch) {
    assertOperation(epoch);

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
      assertOperation(epoch);
    }

    await OneSignal.login(partnerId);
    assertOperation(epoch);

    const identityReady = await waitForExternalId(
      OneSignal,
      partnerId,
      epoch
    );

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
    const epoch = ++operationEpoch;

    setUi("CONNECTING...", "Menghubungkan notifikasi partner...", true);

    const watchdog = window.setTimeout(() => {
      if (epoch !== operationEpoch || finalStateReached) return;

      operationEpoch += 1;
      busy = false;
      oneSignalReadyPromise = null;

      setUi(
        "COBA LAGI",
        "Aktivasi membutuhkan waktu terlalu lama. Periksa koneksi dan izin browser, lalu coba kembali.",
        false
      );

      notifyDashboard("BEGAN_PUSH_DENIED", { reason: "activation_timeout" });
    }, ACTIVATION_TIMEOUT_MS);

    try {
      if (!partnerId) {
        throw new Error("PARTNER_ID_MISSING");
      }

      const OneSignal = await getOneSignal();
      assertOperation(epoch);

      if (!OneSignal.Notifications.isPushSupported()) {
        throw new Error("PUSH_NOT_SUPPORTED");
      }

      if (isBrowserPermissionBlocked()) {
        finishDenied("permission_blocked", true);
        return;
      }

      if (!isBrowserPermissionGranted(OneSignal)) {
        await OneSignal.Notifications.requestPermission();
        assertOperation(epoch);
      }

      if (!isBrowserPermissionGranted(OneSignal)) {
        finishDenied("permission_not_granted", isBrowserPermissionBlocked());
        return;
      }

      if (!OneSignal.User.PushSubscription.optedIn) {
        await OneSignal.User.PushSubscription.optIn();
        assertOperation(epoch);
      }

      const subscriptionReady = await waitForSubscription(OneSignal, epoch);
      if (!subscriptionReady) {
        throw new Error("ONESIGNAL_SUBSCRIPTION_TIMEOUT");
      }

      await syncPartnerIdentity(OneSignal, epoch);
      assertOperation(epoch);
      finishSuccess();
    } catch (error) {
      const code = String(error && error.message ? error.message : error);

      if (code.includes("OPERATION_CANCELLED") || epoch !== operationEpoch) {
        return;
      }

      console.error("BEGAN PUSH ACTIVATION FAILED", error);
      busy = false;

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

      notifyDashboard("BEGAN_PUSH_DENIED", { reason: code });
    } finally {
      window.clearTimeout(watchdog);
      if (epoch === operationEpoch && !finalStateReached) {
        busy = false;
      }
    }
  }

  async function preparePage() {
    if (!button) return;

    button.addEventListener("click", activatePush);
    closeButton?.addEventListener("click", () => closeAccessPage("close_button"));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeAccessPage("escape_key");
      }
    });

    if (!partnerId) {
      setUi(
        "KEMBALI KE DASHBOARD",
        "Partner ID tidak ditemukan. Aktifkan notifikasi melalui dashboard partner.",
        false
      );
      return;
    }

    setUi("CONNECTING...", "Menyiapkan sistem notifikasi...", true);
    const epoch = ++operationEpoch;

    try {
      const OneSignal = await getOneSignal();
      assertOperation(epoch);

      if (!OneSignal.Notifications.isPushSupported()) {
        throw new Error("PUSH_NOT_SUPPORTED");
      }

      if (isSubscriptionReady(OneSignal)) {
        await syncPartnerIdentity(OneSignal, epoch);
        assertOperation(epoch);
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
      const code = String(error && error.message ? error.message : error);

      if (code.includes("OPERATION_CANCELLED") || epoch !== operationEpoch) {
        return;
      }

      console.error("BEGAN PUSH PREPARE FAILED", error);
      busy = false;
      oneSignalReadyPromise = null;

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
        "Sistem notifikasi belum tersambung. Anda dapat menutup halaman ini atau mencoba lagi.",
        false
      );
    }
  }

  preparePage();
})();
