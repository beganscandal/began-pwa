// =========================
// BEGAN PWA INSTALL SYSTEM
// Minimal browser handoff for Samsung Internet -> Google Chrome.
// Keeps the existing barkahgarment.com + pwa.barkahgarment.com architecture.
// =========================

(() => {
  "use strict";

  const ua = navigator.userAgent || "";
  const isAndroid = /Android/i.test(ua);
  const isSamsungInternet = /SamsungBrowser/i.test(ua);
  const isIOS =
    /iPad|iPhone|iPod/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  const installHandoffRequested =
    new URLSearchParams(window.location.search).get("pwaInstall") === "1";

  let deferredPrompt = null;
  let installUi = null;
  let installMode = "waiting";
  let sessionWatcher = null;
  let chromePromptFallbackTimer = null;

  if (isStandalone) {
    console.log("BEGAN PWA ALREADY INSTALLED");
    return;
  }

  init();

  function init() {
    injectPWAInstallUI();

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    if (isSamsungInternet && isAndroid) {
      // Never invoke Samsung Internet's generated APK installer. On affected
      // devices it can be rejected by Play Protect as targeting old Android.
      startSessionWatcher(() => {
        installMode = "open-chrome";
        configureInstallUI();
        showPWAInstall();
      });
      return;
    }

    if (isIOS) {
      startSessionWatcher(() => {
        installMode = "ios";
        configureInstallUI();
        window.setTimeout(showPWAInstall, 1800);
      });
      return;
    }

    if (installHandoffRequested) {
      // The dashboard bootstrap consumes partnerId/toko first. Once its
      // localStorage session exists, remove handoff parameters before install
      // so partner identity does not become part of the installed start URL.
      startSessionWatcher(() => {
        cleanInstallHandoffQuery();
        installMode = deferredPrompt ? "install" : "waiting";
        configureInstallUI();
        showPWAInstall();
        armChromePromptFallback();
      });
    }
  }

  function onBeforeInstallPrompt(event) {
    event.preventDefault();

    if (isSamsungInternet && isAndroid) {
      deferredPrompt = null;
      return;
    }

    deferredPrompt = event;

    startSessionWatcher(() => {
      cleanInstallHandoffQuery();
      installMode = "install";
      configureInstallUI();
      showPWAInstall();
      clearChromePromptFallback();
    });
  }

  function onAppInstalled() {
    deferredPrompt = null;
    clearChromePromptFallback();

    try {
      localStorage.setItem("began_pwa_installed", "1");
    } catch (error) {
      console.warn("BEGAN PWA INSTALL FLAG FAILED", error);
    }

    hidePWAInstall();
  }

  function readPartnerIdentity() {
    let stored = null;

    try {
      stored = JSON.parse(localStorage.getItem("began_partner") || "null");
    } catch (error) {
      console.warn("BEGAN PARTNER SESSION READ FAILED", error);
    }

    const params = new URLSearchParams(window.location.search);
    const id = String(
      stored?.id || params.get("partnerId") || params.get("partner") || ""
    ).trim();
    const toko = String(stored?.toko || params.get("toko") || "").trim();

    return { id, toko };
  }

  function hasPartnerIdentity() {
    const partner = readPartnerIdentity();
    return Boolean(partner.id && partner.toko);
  }

  function startSessionWatcher(onReady) {
    if (hasPartnerIdentity()) {
      onReady();
      return;
    }

    if (sessionWatcher) return;

    sessionWatcher = window.setInterval(() => {
      if (!hasPartnerIdentity()) return;

      window.clearInterval(sessionWatcher);
      sessionWatcher = null;
      onReady();
    }, 800);
  }

  function buildChromeInstallUrl() {
    const target = new URL(window.location.href);
    const partner = readPartnerIdentity();

    target.searchParams.delete("chromeFallback");
    target.searchParams.set("pwaInstall", "1");

    if (partner.id) target.searchParams.set("partnerId", partner.id);
    if (partner.toko) target.searchParams.set("toko", partner.toko);

    // Do not carry unnecessary personal fields between browsers.
    target.searchParams.delete("partner");
    target.searchParams.delete("name");
    target.searchParams.delete("whatsapp");
    target.searchParams.delete("tier");
    target.hash = "";

    return target;
  }

  function openCurrentDashboardInChrome() {
    const chromeTarget = buildChromeInstallUrl();
    const fallbackTarget = new URL(chromeTarget.toString());
    fallbackTarget.searchParams.set("chromeFallback", "1");

    const intentUrl =
      `intent://${chromeTarget.host}${chromeTarget.pathname}${chromeTarget.search}` +
      "#Intent;scheme=https;package=com.android.chrome;" +
      `S.browser_fallback_url=${encodeURIComponent(fallbackTarget.toString())};end`;

    window.location.href = intentUrl;
  }

  function cleanInstallHandoffQuery() {
    const current = new URL(window.location.href);
    const removable = [
      "pwaInstall",
      "chromeFallback",
      "partnerId",
      "partner",
      "toko",
      "name",
      "whatsapp",
      "tier"
    ];

    let changed = false;
    removable.forEach((key) => {
      if (!current.searchParams.has(key)) return;
      current.searchParams.delete(key);
      changed = true;
    });

    if (changed) {
      window.history.replaceState({}, document.title, current.toString());
    }
  }

  function armChromePromptFallback() {
    clearChromePromptFallback();

    chromePromptFallbackTimer = window.setTimeout(() => {
      if (deferredPrompt) return;
      installMode = "manual-chrome";
      configureInstallUI();
    }, 5000);
  }

  function clearChromePromptFallback() {
    if (!chromePromptFallbackTimer) return;
    window.clearTimeout(chromePromptFallbackTimer);
    chromePromptFallbackTimer = null;
  }

  function injectPWAInstallUI() {
    if (document.querySelector(".began-pwa-install")) {
      installUi = document.querySelector(".began-pwa-install");
      return;
    }

    const style = document.createElement("style");
    style.textContent = `
      .began-pwa-install {
        position: fixed;
        inset: 0;
        z-index: 9999999;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background: rgba(0, 0, 0, .84);
        backdrop-filter: blur(8px);
      }

      .began-pwa-box {
        position: relative;
        width: 100%;
        max-width: 360px;
        overflow: hidden;
        border: 1px solid rgba(57, 255, 20, .2);
        border-radius: 28px;
        background: #050505;
        box-shadow: 0 0 50px rgba(57, 255, 20, .12);
      }

      .began-pwa-top {
        padding: 30px;
        text-align: center;
      }

      .began-pwa-logo {
        display: block;
        width: 82px;
        margin: 0 auto 20px;
      }

      .began-pwa-title {
        margin-bottom: 16px;
        color: #fff;
        font-size: 27px;
        font-weight: 800;
        line-height: 1.1;
      }

      .began-pwa-sub {
        color: #aaa;
        font-size: 14px;
        line-height: 1.6;
      }

      .began-pwa-note {
        margin-top: 16px;
        color: #39ff14;
        font-size: 12px;
        font-weight: 700;
        line-height: 1.5;
      }

      .began-pwa-btn {
        width: 100%;
        border: 0;
        padding: 20px;
        background: #39ff14;
        color: #000;
        cursor: pointer;
        font-size: 17px;
        font-weight: 900;
      }

      .began-pwa-btn:disabled {
        cursor: wait;
        opacity: .55;
      }

      .began-pwa-close {
        position: absolute;
        top: 14px;
        right: 14px;
        width: 34px;
        height: 34px;
        border: 0;
        border-radius: 999px;
        background: rgba(255, 255, 255, .06);
        color: #fff;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);

    installUi = document.createElement("div");
    installUi.className = "began-pwa-install";
    installUi.setAttribute("role", "dialog");
    installUi.setAttribute("aria-modal", "true");
    installUi.setAttribute("aria-label", "Install BEGAN Dashboard");
    installUi.innerHTML = `
      <div class="began-pwa-box">
        <button class="began-pwa-close" type="button" aria-label="Tutup">✕</button>
        <div class="began-pwa-top">
          <img
            class="began-pwa-logo"
            src="https://pwa.barkahgarment.com/assets/logoFont-512.png"
            alt="BEGAN"
          >
          <div class="began-pwa-title"></div>
          <div class="began-pwa-sub"></div>
          <div class="began-pwa-note"></div>
        </div>
        <button class="began-pwa-btn" type="button"></button>
      </div>
    `;

    document.body.appendChild(installUi);

    installUi.querySelector(".began-pwa-close").addEventListener("click", hidePWAInstall);
    installUi.querySelector(".began-pwa-btn").addEventListener("click", onInstallButtonClick);
  }

  function configureInstallUI() {
    if (!installUi) return;

    const title = installUi.querySelector(".began-pwa-title");
    const sub = installUi.querySelector(".began-pwa-sub");
    const note = installUi.querySelector(".began-pwa-note");
    const button = installUi.querySelector(".began-pwa-btn");

    button.disabled = false;

    if (installMode === "open-chrome") {
      const fallback = new URLSearchParams(window.location.search).get("chromeFallback") === "1";

      title.innerHTML = "INSTALL<br>BEGAN DASHBOARD";
      sub.textContent = fallback
        ? "Google Chrome belum dapat dibuka. Pastikan Chrome sudah terpasang dan aktif di HP ini."
        : "Instalasi dilanjutkan melalui Google Chrome agar tidak diblokir Google Play Protect.";
      note.textContent = fallback
        ? "Setelah Chrome aktif, kembali ke halaman ini lalu tekan tombol di bawah."
        : "Partner ID dibawa otomatis. Tidak perlu login ulang.";
      button.textContent = fallback ? "COBA BUKA CHROME LAGI" : "BUKA CHROME & INSTALL";
      return;
    }

    if (installMode === "ios") {
      title.innerHTML = "INSTALL<br>BEGAN DASHBOARD";
      sub.textContent = "Di iPhone, instalasi dilakukan melalui menu Safari.";
      note.textContent = "Tap Share → Add to Home Screen → Add.";
      button.textContent = "LIHAT CARA INSTALL";
      return;
    }

    if (installMode === "manual-chrome") {
      title.innerHTML = "INSTALL<br>BEGAN DASHBOARD";
      sub.textContent = "Prompt otomatis belum tersedia. Instal langsung melalui menu Google Chrome.";
      note.textContent = "Tap ⋮ → Add to Home screen / Install app.";
      button.textContent = "TAMPILKAN PETUNJUK";
      return;
    }

    if (installMode === "install") {
      title.innerHTML = "INSTALL<br>BEGAN DASHBOARD";
      sub.textContent = "Akses dashboard lebih cepat, fullscreen, realtime alert, dan notifikasi artikel terbaru.";
      note.textContent = "Satu kali instal. Partner ID tetap tersimpan di perangkat ini.";
      button.textContent = "INSTALL SEKARANG";
      return;
    }

    title.innerHTML = "MENYIAPKAN<br>INSTALASI";
    sub.textContent = "Google Chrome sedang memeriksa kesiapan BEGAN Dashboard.";
    note.textContent = "Tunggu beberapa detik.";
    button.textContent = "MENYIAPKAN...";
    button.disabled = true;
  }

  async function onInstallButtonClick() {
    if (installMode === "open-chrome") {
      openCurrentDashboardInChrome();
      return;
    }

    if (installMode === "ios") {
      window.alert(
        "Cara install BEGAN di iPhone:\n\n" +
        "1. Buka halaman ini di Safari.\n" +
        "2. Tap ikon Share (kotak dengan panah ke atas).\n" +
        "3. Pilih Add to Home Screen.\n" +
        "4. Tap Add."
      );
      return;
    }

    if (installMode === "manual-chrome") {
      window.alert(
        "Cara install BEGAN di Google Chrome:\n\n" +
        "1. Tap menu ⋮ di kanan atas.\n" +
        "2. Pilih Install app atau Add to Home screen.\n" +
        "3. Tap Install."
      );
      return;
    }

    if (!deferredPrompt) return;

    const prompt = deferredPrompt;
    deferredPrompt = null;

    prompt.prompt();
    const choice = await prompt.userChoice;

    if (choice?.outcome === "accepted") {
      hidePWAInstall();
      return;
    }

    installMode = "manual-chrome";
    configureInstallUI();
  }

  function showPWAInstall() {
    if (!installUi || !hasPartnerIdentity()) return;
    installUi.style.display = "flex";
  }

  function hidePWAInstall() {
    if (!installUi) return;
    installUi.style.display = "none";
  }
})();
