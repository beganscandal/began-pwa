
// =========================
// BEGAN PWA INSTALL SYSTEM
// =========================

let deferredPrompt = null;

// =========================
// INSTALLED CHECK
// =========================

const IS_STANDALONE =

window.matchMedia(
  "(display-mode: standalone)"
).matches

||

window.navigator.standalone === true;

if(IS_STANDALONE){

  console.log(
    "PWA ALREADY INSTALLED"
  );

}else{

  initPWAInstall();

}

// =========================
// INIT
// =========================

function initPWAInstall(){

  injectPWAInstallUI();

  detectAndroidInstall();

  detectIOSInstall();

}

// =========================
// ANDROID INSTALL
// =========================

function detectAndroidInstall(){

  window.addEventListener(

    "beforeinstallprompt",

    (e)=>{

      e.preventDefault();

      deferredPrompt = e;

      console.log(
        "ANDROID INSTALL READY"
      );

      showPWAInstall();

    }

  );

}

// =========================
// IOS INSTALL
// =========================

function detectIOSInstall(){

  const IS_IOS =

  /iPad|iPhone|iPod/.test(
    navigator.userAgent
  )

  ||

  (
    navigator.platform ===
    "MacIntel"

    &&

    navigator.maxTouchPoints > 1
  );

  if(!IS_IOS) return;

  if(IS_STANDALONE) return;

  setTimeout(()=>{

    showPWAInstall();

  },2500);

}

// =========================
// UI
// =========================

function injectPWAInstallUI(){

  if(
    document.querySelector(
      ".began-pwa-install"
    )
  ) return;

  const style =
  document.createElement("style");

  style.innerHTML = `

  .began-pwa-install{

    position:fixed;

    inset:0;

    background:
    rgba(0,0,0,.82);

    z-index:9999999;

    display:none;

    justify-content:center;
    align-items:center;

    padding:20px;

    backdrop-filter:blur(8px);

  }

  .began-pwa-box{

    width:100%;
    max-width:360px;

    background:#050505;

    border-radius:28px;

    border:
    1px solid rgba(57,255,20,.2);

    overflow:hidden;

    position:relative;

    box-shadow:
    0 0 50px rgba(57,255,20,.12);

  }

  .began-pwa-top{

    padding:30px;

    text-align:center;

  }

  .began-pwa-logo{

    width:82px;

    margin-bottom:20px;

  }

  .began-pwa-title{

    color:white;

    font-size:28px;

    font-weight:800;

    line-height:1.1;

    margin-bottom:16px;

  }

  .began-pwa-sub{

    color:#aaa;

    font-size:15px;

    line-height:1.6;

  }

  .began-pwa-btn{

    width:100%;

    border:none;

    background:#39FF14;

    color:black;

    font-size:18px;

    font-weight:800;

    padding:20px;

    cursor:pointer;

  }

  .began-pwa-close{

    position:absolute;

    top:14px;
    right:14px;

    width:34px;
    height:34px;

    border-radius:999px;

    background:
    rgba(255,255,255,.06);

    color:white;

    border:none;

    cursor:pointer;

  }

  .began-pwa-ios{

    margin-top:18px;

    color:#39FF14;

    font-size:13px;

    line-height:1.6;

  }

  `;

  document.head.appendChild(
    style
  );

  const html =
  document.createElement("div");

  html.className =
    "began-pwa-install";

  html.innerHTML = `

  <div class="began-pwa-box">

    <button class="began-pwa-close">
      ✕
    </button>

    <div class="began-pwa-top">

      <img
        class="began-pwa-logo"
        src="https://pwa.barkahgarment.com/assets/logo-icon-512.png"
      >

      <div class="began-pwa-title">
        INSTALL<br>
        BEGAN DASHBOARD
      </div>

      <div class="began-pwa-sub">

        Akses dashboard lebih cepat,
        fullscreen, realtime alert,
        dan notifikasi product terbaru.

      </div>

      <div class="began-pwa-ios">

        iPhone Safari:<br>
        Tap Share → Add To Home Screen

      </div>

    </div>

    <button class="began-pwa-btn">

      INSTALL SEKARANG

    </button>

  </div>

  `;

  document.body.appendChild(
    html
  );

  // CLOSE

  html
  .querySelector(
    ".began-pwa-close"
  )
  .onclick = ()=>{

    html.style.display =
      "none";

  };

  // BUTTON

  html
  .querySelector(
    ".began-pwa-btn"
  )
  .onclick = async ()=>{

    if(deferredPrompt){

      deferredPrompt.prompt();

      await deferredPrompt.userChoice;

      deferredPrompt = null;

      html.style.display =
        "none";

    }

  };

}

// =========================
// SHOW
// =========================

function showPWAInstall(){

  const el =
  document.querySelector(
    ".began-pwa-install"
  );

  if(!el) return;

  el.style.display =
    "flex";

}
