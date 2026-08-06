(() => {
  "use strict";

  const PWA_ORIGIN = "https://pwa.barkahgarment.com";
  const STYLE_ID = "began-push-modal-ux-style";
  const DISMISS_PREFIX = "began_push_prompt_dismissed_";

  function readPartnerId() {
    try {
      const partner = JSON.parse(localStorage.getItem("began_partner") || "{}");
      return String(partner.id || "").trim();
    } catch (error) {
      return "";
    }
  }

  function dismissKey() {
    return `${DISMISS_PREFIX}${readPartnerId() || "guest"}`;
  }

  function isDismissedForSession() {
    try {
      return sessionStorage.getItem(dismissKey()) === "yes";
    } catch (error) {
      return false;
    }
  }

  function rememberDismissal() {
    try {
      sessionStorage.setItem(dismissKey(), "yes");
    } catch (error) {
      // Session storage can be unavailable in restricted browser modes.
    }
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .push-permission-layer {
        background: rgba(0, 0, 0, .42) !important;
        backdrop-filter: blur(3px);
      }

      .push-permission-modal {
        position: relative !important;
        max-width: 360px !important;
        padding: 28px 22px 22px !important;
        border-color: rgba(57, 255, 20, .22) !important;
        box-shadow: 0 18px 55px rgba(0, 0, 0, .5) !important;
      }

      .push-permission-close {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 34px;
        height: 34px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(255, 255, 255, .1);
        border-radius: 999px;
        background: rgba(255, 255, 255, .07);
        color: #fff;
        font-size: 16px;
        line-height: 1;
        cursor: pointer;
      }

      .push-permission-description {
        margin: -8px 0 18px;
        color: #aaa;
        font-size: 13px;
        line-height: 1.55;
      }

      .began-push-result-toast {
        position: fixed;
        left: 50%;
        bottom: max(18px, env(safe-area-inset-bottom));
        z-index: 1000001;
        width: min(360px, calc(100vw - 28px));
        transform: translateX(-50%);
        padding: 16px 48px 16px 16px;
        border: 1px solid rgba(57, 255, 20, .22);
        border-radius: 16px;
        background: #080808;
        color: #fff;
        box-shadow: 0 18px 50px rgba(0, 0, 0, .5);
        font-size: 13px;
        line-height: 1.5;
      }

      .began-push-result-toast button {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 32px;
        height: 32px;
        border: 0;
        border-radius: 999px;
        background: rgba(255, 255, 255, .08);
        color: #fff;
        cursor: pointer;
      }

      @media (max-width: 767px) {
        .push-permission-layer {
          align-items: flex-end !important;
          padding: 12px !important;
          background: rgba(0, 0, 0, .28) !important;
        }

        .push-permission-modal {
          max-width: 440px !important;
          border-radius: 22px !important;
          margin-bottom: max(0px, env(safe-area-inset-bottom));
        }
      }
    `;

    document.head.appendChild(style);
  }

  function closeModal(layer, remember = true) {
    if (!layer) return;
    if (remember) rememberDismissal();

    const laterButton = layer.querySelector(".push-permission-later");
    if (laterButton) {
      laterButton.click();
      return;
    }

    layer.remove();
  }

  function enhanceModal(layer) {
    if (!layer || layer.dataset.beganPushUxReady === "1") return;
    layer.dataset.beganPushUxReady = "1";

    if (isDismissedForSession()) {
      window.setTimeout(() => closeModal(layer, false), 0);
      return;
    }

    injectStyles();

    const modal = layer.querySelector(".push-permission-modal");
    if (!modal) return;

    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Aktifkan pemberitahuan artikel terbaru");

    const title = modal.querySelector(".push-permission-title");
    if (title) {
      title.textContent = "Aktifkan Pemberitahuan Artikel Terbaru";
    }

    if (!modal.querySelector(".push-permission-description")) {
      const description = document.createElement("div");
      description.className = "push-permission-description";
      description.textContent =
        "Anda dapat menutup pemberitahuan ini kapan saja dan mengaktifkannya kembali dari tombol dashboard.";

      const actions = modal.querySelector(".push-permission-actions");
      modal.insertBefore(description, actions || null);
    }

    const closeButton = document.createElement("button");
    closeButton.className = "push-permission-close";
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "Tutup");
    closeButton.textContent = "✕";
    closeButton.addEventListener("click", () => closeModal(layer));
    modal.appendChild(closeButton);

    const enableButton = modal.querySelector(".push-permission-enable");
    if (enableButton) {
      enableButton.textContent = "Aktifkan Pemberitahuan";
      enableButton.addEventListener("click", rememberDismissal, { once: true });
    }

    const laterButton = modal.querySelector(".push-permission-later");
    if (laterButton) {
      laterButton.textContent = "Nanti";
      laterButton.addEventListener("click", rememberDismissal, { once: true });
    }

    modal.addEventListener("click", (event) => event.stopPropagation());
    layer.addEventListener("click", (event) => {
      if (event.target === layer) closeModal(layer);
    });
  }

  function wrapAutomaticModal() {
    const original = window.showPushPermissionModal;
    if (typeof original !== "function" || original.__beganPushUxWrapped) return false;

    function wrappedShowPushPermissionModal(...args) {
      if (isDismissedForSession()) return;
      return original.apply(this, args);
    }

    wrappedShowPushPermissionModal.__beganPushUxWrapped = true;
    window.showPushPermissionModal = wrappedShowPushPermissionModal;
    return true;
  }

  function showResultToast(message) {
    injectStyles();

    document.querySelector(".began-push-result-toast")?.remove();

    const toast = document.createElement("div");
    toast.className = "began-push-result-toast";
    toast.innerHTML = `<span></span><button type="button" aria-label="Tutup">✕</button>`;
    toast.querySelector("span").textContent = message;
    toast.querySelector("button").addEventListener("click", () => toast.remove());
    document.body.appendChild(toast);

    window.setTimeout(() => toast.remove(), 8000);
  }

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof Element)) continue;

        if (node.matches?.(".push-permission-layer")) {
          enhanceModal(node);
        }

        node.querySelectorAll?.(".push-permission-layer").forEach(enhanceModal);
      }
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
  document.querySelectorAll(".push-permission-layer").forEach(enhanceModal);

  const wrapTimer = window.setInterval(() => {
    if (wrapAutomaticModal()) {
      window.clearInterval(wrapTimer);
    }
  }, 250);
  window.setTimeout(() => window.clearInterval(wrapTimer), 20000);

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeModal(document.querySelector(".push-permission-layer"));
  });

  window.addEventListener("message", (event) => {
    if (event.origin !== PWA_ORIGIN || !event.data) return;

    if (event.data.type === "BEGAN_PUSH_DENIED") {
      showResultToast(
        "Notifikasi belum aktif. Periksa izin notifikasi browser lalu coba kembali dari tombol dashboard."
      );
    }

    if (event.data.type === "BEGAN_PUSH_CANCELLED") {
      showResultToast(
        "Aktivasi notifikasi ditutup. Anda dapat mencobanya kembali kapan saja dari tombol dashboard."
      );
    }

    if (event.data.type === "BEGAN_PUSH_SUCCESS") {
      document.querySelector(".began-push-result-toast")?.remove();
    }
  });
})();
