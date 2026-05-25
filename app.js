const params = new URLSearchParams(window.location.search);
const partnerId = params.get("partner") || "";
const toko = params.get("toko") || "";

// ========================================================
// 1. STRATEGI SAFARI: LOAD & INIT SDK SAAT HALAMAN DIBUKA
// ========================================================
(async function preloadOneSignal() {
  if (!window.OneSignal) {
    const sdk = document.createElement("script");
    sdk.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
    sdk.defer = true;
    document.head.appendChild(sdk);

    await new Promise(resolve => { sdk.onload = resolve; });
  }

  window.OneSignalDeferred = window.OneSignalDeferred || [];
  OneSignalDeferred.push(async function(OneSignal) {
    await OneSignal.init({
      appId: "37e11236-e95b-4d5d-b925-f7b5f8308cdd",
      safari_web_id: "web.onesignal.auto.14469d21-a548-446f-9323-a0e21fc14d38",
      notifyButton: {
        enable: false, // Diset false agar widget bawaan OS tidak mengganggu tombol custom
      },
    });

    window.BEGAN_ONESIGNAL_READY = true;
    console.log("ONESIGNAL READY IN BACKGROUND");

    // Aktifkan kembali tombol jika SDK sudah ready
    const btn = document.getElementById("enableNotif");
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = "ALLOW NOTIFICATION";
    }
  });
})();

// ========================================================
// 2. FUNGSI KLIK TOMBOL (CEPAT & INSTAN TANPA SCRIPT LOADING)
// ========================================================
async function initPush() {
  const btn = document.getElementById("enableNotif");

  // Jika di background SDK-nya belum kelar download, cegah eksekusi
  if (!window.BEGAN_ONESIGNAL_READY) {
    if (btn) btn.innerHTML = "LOADING SDK... TRY AGAIN";
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = "CONNECTING...";
  }

  // FAILSAFE TIMEOUT
  const failSafe = setTimeout(() => {
    if (window.opener) {
      window.opener.postMessage({ type: "BEGAN_PUSH_DENIED" }, "https://www.barkahgarment.com");
    }
    setTimeout(() => { window.close(); }, 1200);
  }, 25000);

  try {
    // Jalankan langsung tanpa setTimeout pembungkus agar lolos dari Pop-up Blocker Safari
    const alreadySubscribed = await window.OneSignal.User.PushSubscription.optedIn;

    if (alreadySubscribed) {
      if (partnerId) {
        await window.OneSignal.login(partnerId);
        await window.OneSignal.User.addTag("partner", partnerId);
      }
      if (toko) {
        await window.OneSignal.User.addTag("toko", toko);
      }

      if (btn) btn.innerHTML = "🔥 ALERT ACTIVE";
      clearTimeout(failSafe);

      if (window.opener) {
        window.opener.postMessage({ type: "BEGAN_PUSH_SUCCESS" }, "https://www.barkahgarment.com");
      }
      setTimeout(() => { window.close(); }, 1200);
      return;
    }

    // Pemicu Native Prompt Dialog (Wajib instan setelah user-click di Safari)
    const permission = await window.OneSignal.Notifications.requestPermission();

    if (permission === "granted") {
      if (partnerId) {
        await window.OneSignal.login(partnerId);
        await window.OneSignal.User.addTag("partner", partnerId);
      }
      if (toko) {
        await window.OneSignal.User.addTag("toko", toko);
      }

      if (btn) btn.innerHTML = "🔥 ALERT ACTIVE";
      clearTimeout(failSafe);

      if (window.opener) {
        window.opener.postMessage({ type: "BEGAN_PUSH_SUCCESS" }, "https://www.barkahgarment.com");
      }
      setTimeout(() => { window.close(); }, 1200);
    } else {
      // Jika user memilih deny/block
      clearTimeout(failSafe);
      if (window.opener) {
        window.opener.postMessage({ type: "BEGAN_PUSH_DENIED" }, "https://www.barkahgarment.com");
      }
      setTimeout(() => { window.close(); }, 1200);
    }

  } catch (err) {
    console.error("Error during push flow:", err);
    clearTimeout(failSafe);
    if (window.opener) {
      window.opener.postMessage({ type: "BEGAN_PUSH_DENIED" }, "https://www.barkahgarment.com");
    }
    setTimeout(() => { window.close(); }, 1200);
  }
}

// ========================================================
// 3. EVENT BINDING TOMBOL
// ========================================================
const enableBtn = document.getElementById("enableNotif");
if (enableBtn) {
  // Jika saat tombol ke-render SDK belum siap, berikan state memuat
  if (!window.BEGAN_ONESIGNAL_READY) {
    enableBtn.disabled = true;
    enableBtn.innerHTML = "INITIALIZING...";
  }
  enableBtn.onclick = initPush;
}
