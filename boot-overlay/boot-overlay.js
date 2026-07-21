/*!
 * BEGAN Partner Dashboard Boot Overlay
 * Functional production state machine v2.0
 */
(function (window, document) {
  "use strict";

  if (window.BeganBootOverlay) return;

  const LOGO_URL = "https://cdn.prod.website-files.com/69c14cdea8e1d469f0564d69/69ee58d1c5ce06f715e84130_Untitled%20(1000%20x%20420%20px).png";
  const STEP_ORDER = ["session", "server", "inventory", "dashboard"];
  const STEPS = {
    session: "Memulihkan sesi partner",
    server: "Menghubungkan server BEGAN",
    inventory: "Menyinkronkan stok terbaru",
    dashboard: "Menyiapkan dashboard"
  };

  const state = {
    mounted: false,
    visible: false,
    overlay: null,
    title: null,
    subtitle: null,
    progressBar: null,
    percent: null,
    retryButton: null,
    steps: {}
  };

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function setProgress(percent) {
    const value = Math.max(0, Math.min(100, Number(percent) || 0));
    if (state.progressBar) state.progressBar.style.width = value + "%";
    if (state.percent) state.percent.textContent = value + "%";
  }

  function updateStep(id, status, label) {
    const step = state.steps[id];
    if (!step) return;

    step.root.classList.remove("is-active", "is-done", "is-error");
    if (status === "active") step.root.classList.add("is-active");
    if (status === "done") step.root.classList.add("is-done");
    if (status === "error") step.root.classList.add("is-error");

    step.status.textContent = label || ({
      pending: "Menunggu",
      active: "Proses",
      done: "Selesai",
      error: "Gagal"
    }[status] || "Menunggu");
  }

  function reset() {
    STEP_ORDER.forEach(function (id) {
      updateStep(id, "pending");
    });
    state.title.textContent = "MENYIAPKAN DASHBOARD";
    state.subtitle.textContent = "Mohon tunggu, sesi partner sedang dipulihkan.";
    state.retryButton.hidden = true;
    state.retryButton.onclick = null;
    setProgress(0);
  }

  function buildStep(id) {
    const root = element("li", "began-boot-step");
    root.dataset.step = id;

    const icon = element("span", "began-boot-step-icon");
    icon.setAttribute("aria-hidden", "true");
    const label = element("span", "began-boot-step-label", STEPS[id]);
    const status = element("span", "began-boot-step-status", "Menunggu");

    root.append(icon, label, status);
    state.steps[id] = { root: root, status: status };
    return root;
  }

  function mount() {
    if (state.mounted || !document.body) return state.overlay;

    const overlay = element("div", "began-boot-overlay");
    overlay.id = "began-boot-overlay";
    overlay.setAttribute("role", "status");
    overlay.setAttribute("aria-live", "polite");
    overlay.setAttribute("aria-atomic", "true");
    overlay.setAttribute("aria-hidden", "true");

    const card = element("section", "began-boot-card");
    card.setAttribute("aria-labelledby", "began-boot-title");

    const logo = element("img", "began-boot-logo");
    logo.src = LOGO_URL;
    logo.alt = "BEGAN";
    logo.width = 210;
    logo.height = 88;

    const tagline = element("p", "began-boot-tagline", "UNTIL GOD SAYS SO.");
    state.title = element("h2", "began-boot-title", "MENYIAPKAN DASHBOARD");
    state.title.id = "began-boot-title";
    state.subtitle = element("p", "began-boot-subtitle", "Mohon tunggu, sesi partner sedang dipulihkan.");

    const list = element("ol", "began-boot-steps");
    STEP_ORDER.forEach(function (id) {
      list.append(buildStep(id));
    });

    const track = element("div", "began-boot-progress-track");
    track.setAttribute("aria-hidden", "true");
    state.progressBar = element("span", "began-boot-progress-bar");
    track.append(state.progressBar);
    state.percent = element("span", "began-boot-percent", "0%");

    state.retryButton = element("button", "began-boot-retry", "COBA LAGI");
    state.retryButton.type = "button";
    state.retryButton.hidden = true;

    const footer = element("p", "began-boot-footer", "ESTABLISHED IN HEAVEN");

    card.append(logo, tagline, state.title, state.subtitle, list, track, state.percent, state.retryButton, footer);
    overlay.append(card);
    document.body.append(overlay);

    state.overlay = overlay;
    state.mounted = true;
    reset();
    return overlay;
  }

  function ensureMounted() {
    if (!state.mounted) mount();
    return state.mounted;
  }

  function show(options) {
    if (!ensureMounted()) return;
    reset();
    const partnerName = options && options.partnerName;
    if (partnerName) {
      state.subtitle.textContent = "Memulihkan akses untuk " + partnerName + ".";
    }
    state.overlay.classList.remove("is-exiting", "has-error");
    state.overlay.classList.add("is-visible");
    state.overlay.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("began-booting");
    state.visible = true;
  }

  function activate(id, message) {
    if (!ensureMounted()) return;
    updateStep(id, "active");
    if (message) state.subtitle.textContent = message;
    const index = STEP_ORDER.indexOf(id);
    setProgress(index < 0 ? 0 : index * 25 + 10);
  }

  function complete(id, message) {
    if (!ensureMounted()) return;
    updateStep(id, "done");
    if (message) state.subtitle.textContent = message;
    const index = STEP_ORDER.indexOf(id);
    setProgress(index < 0 ? 0 : (index + 1) * 25);
  }

  function fail(id, message, onRetry) {
    if (!ensureMounted()) return;
    updateStep(id, "error");
    state.overlay.classList.add("has-error");
    state.title.textContent = "KONEKSI TERGANGGU";
    state.subtitle.textContent = message || "Dashboard belum berhasil dimuat.";
    state.retryButton.hidden = typeof onRetry !== "function";
    state.retryButton.onclick = typeof onRetry === "function" ? onRetry : null;
  }

  function hide(options) {
    if (!state.mounted || !state.visible) {
      document.documentElement.classList.remove("began-session-pending", "began-booting");
      return;
    }

    const immediate = options && options.immediate;
    state.overlay.classList.add("is-exiting");
    const delay = immediate || window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 220;

    window.setTimeout(function () {
      state.overlay.classList.remove("is-visible", "is-exiting", "has-error");
      state.overlay.setAttribute("aria-hidden", "true");
      document.documentElement.classList.remove("began-session-pending", "began-booting");
      state.visible = false;
    }, delay);
  }

  function success(partnerName) {
    complete("dashboard", "Dashboard siap digunakan" + (partnerName ? " oleh " + partnerName + "." : "."));
    state.title.textContent = "DASHBOARD SIAP";
    window.setTimeout(hide, 180);
  }

  function readPartnerCandidate() {
    try {
      const params = new URLSearchParams(window.location.search);
      const queryId = (params.get("partnerId") || "").trim().toUpperCase();
      const queryStore = (params.get("toko") || "").trim();

      if (queryId && queryStore) {
        const queryPartner = {
          id: queryId,
          toko: queryStore,
          name: params.get("name") || queryStore,
          whatsapp: params.get("whatsapp") || "",
          tier: params.get("tier") || ""
        };

        localStorage.setItem("began_partner", JSON.stringify(queryPartner));

        ["partnerId", "toko", "name", "whatsapp", "tier"].forEach(function (key) {
          params.delete(key);
        });

        const cleanUrl = window.location.pathname + (params.toString() ? "?" + params.toString() : "") + window.location.hash;
        window.history.replaceState({}, document.title, cleanUrl);
        return queryPartner;
      }

      const saved = JSON.parse(localStorage.getItem("began_partner") || "null");
      if (saved && saved.id && saved.toko) return saved;
    } catch (error) {
      console.warn("BEGAN bootstrap session read failed", error);
    }

    return null;
  }

  function revealLogin() {
    localStorage.removeItem("began_partner");
    document.documentElement.classList.remove("began-session-pending");
    const login = document.getElementById("login-overlay");
    if (login) login.style.display = "flex";
    hide({ immediate: true });
  }

  function startSessionBootstrap() {
    const partner = readPartnerCandidate();
    if (!partner) {
      document.documentElement.classList.remove("began-session-pending");
      return;
    }

    show({ partnerName: partner.toko });
    complete("session", "Sesi " + partner.toko + " ditemukan.");
    activate("server", "Menghubungkan dashboard ke server BEGAN.");

    let serverReady = false;
    let inventoryReady = false;
    const startedAt = Date.now();

    function inspectRealState() {
      try {
        if (!serverReady && typeof PARTNERS !== "undefined" && Object.keys(PARTNERS).length) {
          if (!PARTNERS[partner.id]) {
            revealLogin();
            return true;
          }

          serverReady = true;
          complete("server", "Server terhubung dan sesi terverifikasi.");
          activate("inventory", "Mengambil stok dan produk terbaru.");
        }

        if (serverReady && !inventoryReady && typeof INITIAL_DATA_LOADED !== "undefined" && INITIAL_DATA_LOADED) {
          inventoryReady = true;
          complete("inventory", "Stok terbaru berhasil disinkronkan.");
          activate("dashboard", "Menyelesaikan tampilan partner.");
        }

        const login = document.getElementById("login-overlay");
        const loginHidden = login && window.getComputedStyle(login).display === "none";
        const dashboardReady = typeof APP_READY !== "undefined" && APP_READY;

        if (inventoryReady && dashboardReady && window.CURRENT_PARTNER_DATA && loginHidden) {
          success(window.CURRENT_PARTNER_DATA.toko || partner.toko);
          return true;
        }
      } catch (error) {
        console.warn("BEGAN bootstrap state check failed", error);
      }

      if (Date.now() - startedAt > 35000) {
        fail(serverReady ? "inventory" : "server", "Dashboard belum berhasil dimuat. Periksa koneksi lalu coba lagi.", function () {
          window.location.reload();
        });
        return true;
      }

      return false;
    }

    const poll = window.setInterval(function () {
      if (inspectRealState()) window.clearInterval(poll);
    }, 120);

    window.addEventListener("beganDashboardBootReady", inspectRealState, { once: true });
  }

  window.BeganBootOverlay = Object.freeze({
    show: show,
    activate: activate,
    complete: complete,
    fail: fail,
    hide: hide,
    success: success,
    isVisible: function () { return state.visible; }
  });

  mount();
  startSessionBootstrap();
})(window, document);
