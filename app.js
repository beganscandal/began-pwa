const params = new URLSearchParams(window.location.search);
const partnerId = params.get("partner") || "";
const toko = params.get("toko") || "";

// ========================================================
// 1. PRELOAD SDK ONESIGNAL (Wajib di awal)
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
      notifyButton: { enable: false },
    });

    window.BEGAN_ONESIGNAL_READY = true;
    console.log("ONESIGNAL READY IN BACKGROUND");

    const btn = document.getElementById("enableNotif");
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = "ALLOW NOTIFICATION";
    }
  });
})();

// ========================================================
// 2. FUNGSI SYNC & LOGIN (DIPISAH SUPAYA TIDAK MEMBLOCK SAFARI)
// ========================================================
async function syncOneSignalTags() {
  try {
    if (partnerId) {
      await window.OneSignal.login(partnerId);
      await window.OneSignal.User.addTag("partner", partnerId);
    }
    if (toko) {
      await window.OneSignal.User.addTag("toko", toko);
    }
  } catch (e) {
    console.error("Gagal sinkronisasi tags:", e);
  }
}

// ========================================================
// 3. FUNGSI KLIK UTAMA (DIJAMIN LOLOS POP-UP BLOCKER SAFARI)
// ========================================================
function initPush() {
  const btn = document.getElementById("enableNotif");

  if (!window.BEGAN_ONESIGNAL_READY) {
    if (btn) btn.innerHTML = "LOADING SDK... TRY AGAIN";
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = "CONNECTING...";
  }

  const failSafe = setTimeout(() => {
    if (window.opener) {
      window.opener.postMessage({ type: "BEGAN_PUSH_DENIED" }, "https://www.barkahgarment.com");
    }
    setTimeout(() => { window.close(); }, 1200);
  }, 25000);

  // TRIK SAFARI: Langsung panggil requestPermission() murni menggunakan .then() 
  // Tanpa keyword 'await' di depan agar tidak memutus rantai klik manusia di mata iOS
  window.OneSignal.Notifications.requestPermission()
    .then(async (permission) => {
      if (permission === "granted") {
        
        // Jalankan proses login & tagging di background setelah izin didapat
        await syncOneSignalTags();

        if (btn) btn.innerHTML = "🔥 ALERT ACTIVE";
        clearTimeout(failSafe);

        if (window.opener) {
          window.opener.postMessage({ type: "BEGAN_PUSH_SUCCESS" }, "https://www.barkahgarment.com");
        }
        setTimeout(() => { window.close(); }, 1200);
      } else {
        // Jika permission denied / ditolak
        clearTimeout(failSafe);
        if (window.opener) {
          window.opener.postMessage({ type: "BEGAN_PUSH_DENIED" }, "https://www.barkahgarment.com");
        }
        setTimeout(() => { window.close(); }, 1200);
      }
    })
    .catch((err) => {
      console.error("Safari Native Push Error:", err);
      clearTimeout(failSafe);
      if (window.opener) {
        window.opener.postMessage({ type: "BEGAN_PUSH_DENIED" }, "https://www.barkahgarment.com");
      }
      setTimeout(() => { window.close(); }, 1200);
    });
}

// ========================================================
// 4. BIND EVENT TOMBOL
// ========================================================
const enableBtn = document.getElementById("enableNotif");
if (enableBtn) {
  if (!window.BEGAN_ONESIGNAL_READY) {
    enableBtn.disabled = true;
    enableBtn.innerHTML = "INITIALIZING...";
  }
  enableBtn.onclick = initPush;
}
