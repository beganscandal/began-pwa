
// GALAXY A55 ULTRA LITE
// Chrome 148 + Android 16

// =========================
// A55 DETECTION
// =========================

(function(){

const ua =
navigator.userAgent;

const IS_GALAXY_A55 =
/SM-A556/i.test(ua);

const IS_CHROME_148 =
/Chrome\/148/i.test(ua);

const IS_ANDROID_16 =
/Android 16/i.test(ua);

if(
IS_GALAXY_A55 &&
IS_CHROME_148 &&
IS_ANDROID_16
){

document.body.classList.add(
"a55-lite"
);

console.log(
"A55 ULTRA LITE ENABLED"
);

}

})();

// =========================
// IOS SAFE DETECTION
// =========================

const IS_IOS =

/iPad|iPhone|iPod/.test(
  navigator.userAgent
)

||

(
  navigator.platform === "MacIntel"
  &&
  navigator.maxTouchPoints > 1
);

// =========================
// DEBUG
// =========================

console.log(
  "BEGAN NOTIFICATION SYSTEM LOADED"
);

console.log({
  IS_IOS,
  userAgent:
  navigator.userAgent
});

// =========================
// GLOBAL ERROR DEBUG
// =========================

window.onerror =
function(msg,url,line,col,error){

  console.log({

    msg,
    url,
    line,
    col,
    error

  });

};

// =========================
// CONFIG
// =========================

const NOTIFICATION_API =
"https://script.google.com/macros/s/AKfycbza5dLHKWO8iizfjp_8CaT_QsNQ50e4zxf40mt_mfinlvhnMqCwpLxdrrBh7fEc79Fs/exec?action=notificationStatus";


const partnerData =
JSON.parse(
  localStorage.getItem(
    "began_partner"
  ) || "{}"
);

const partnerId =
partnerData.id || "";

const PARTNER_ARTICLE_KEY =

partnerId
? `article_seen_${partnerId}`
: "article_seen_guest";
// =========================
// SOUND
// =========================

const newDropSound =
new Audio(
  "https://cdn.prod.website-files.com/69c14cdea8e1d469f0564d69/6a07b03b3076e93739d1d7bb_new%20article%20drop.mp3"
);

newDropSound.volume = 0.5;

// =========================
// AUDIO UNLOCK
// =========================

let AUDIO_UNLOCKED = false;

function unlockNotifAudio(){

  if(AUDIO_UNLOCKED) return;

  AUDIO_UNLOCKED = true;

  try{

    newDropSound.muted = true;

    const p =
    newDropSound.play();

    if(p){

      p.then(()=>{

        newDropSound.pause();

        newDropSound.currentTime = 0;

        newDropSound.muted = false;

      })

      .catch(()=>{});

    }

  }catch(err){

    console.log(
      "AUDIO UNLOCK FAILED",
      err
    );

  }

}

document.addEventListener(

  "click",

  unlockNotifAudio,

  { once:true }

);

// =========================
// PUSH OVERLAY
// =========================

console.log(
  "BEFORE PUSH OVERLAY"
);

// =========================
// PUSH OVERLAY
// =========================

window.openPushOverlay =
function(){

  console.log(
    "OPEN PUSH OVERLAY"
  );

  try{

    const partnerData =
    JSON.parse(

      localStorage.getItem(
        "began_partner"
      ) || "{}"

    );

    const partnerId =
    partnerData.id || "";

    const toko =
    partnerData.toko || "";

    const url =

`https://pwa.barkahgarment.com/?partner=${partnerId}&toko=${encodeURIComponent(toko)}`;

    console.log({
      partnerId,
      toko,
      url
    });
  // =========================
  // IOS DETECTION
  // =========================

  const IS_IOS =

/iPad|iPhone|iPod/.test(
  navigator.userAgent
)

||

(
  navigator.platform === "MacIntel" &&
  navigator.maxTouchPoints > 1
);
  // =========================
  // IPHONE SAFARI
  // =========================

  if(IS_IOS){

      // IOS < 16.4
      const iosVersionMatch =

      navigator.userAgent.match(
        /OS (\d+)_/
      );

      const iosVersion =

      iosVersionMatch
      ?
      parseInt(
        iosVersionMatch[1]
      )
      :
      0;

      console.log({
        iosVersion
      });

      if(iosVersion < 16){

        alert(
`iPhone ini belum support push notification Safari.

Minimal iOS 16.4 untuk web push.`
        );

        return;

      }

      window.location.href =
      url;

      return;

    }
  // =========================
  // ANDROID / DESKTOP
  // =========================

  window.open(

    url,

    "BEGAN_PUSH",

    "width=420,height=620"

  );

 }catch(err){

    console.log(
      "PUSH OVERLAY ERROR",
      err
    );

  }

};
window.addEventListener(

  "load",

  ()=>{

    setTimeout(()=>{

      const pushBtn =
      document.getElementById(
        "push-btn"
      );

      if(!pushBtn){

        console.log(
          "PUSH BTN NOT FOUND"
        );

        return;
      }

      console.log(
        "PUSH BTN ATTACHED"
      );

      pushBtn.onclick =
      window.openPushOverlay;

    },1200);

  }

);

window.addEventListener(

  "message",

  (event)=>{

    if(

      event.origin !==
      "https://pwa.barkahgarment.com"

    ) return;

    const pushBtn =
    document.getElementById(
      "push-btn"
    );

   const partnerData =
JSON.parse(
  localStorage.getItem(
    "began_partner"
  ) || "{}"
);

const partnerId =
partnerData.id || "";
    if(

      event.data.type ===
      "BEGAN_PUSH_SUCCESS"

    ){

      localStorage.setItem(

        `push_confirmed_${partnerId}`,

        "yes"

      );

      if(pushBtn){

  pushBtn.innerHTML =
    "🔥 ALERT ACTIVE";

  pushBtn.disabled =
    true;

  setTimeout(()=>{

    pushBtn.style.display =
      "none";

  },1200);

}
    }
    }


);
window.addEventListener(

  "load",

  ()=>{

    const pushBtn =
    document.getElementById(
      "push-btn"
    );

    if(!pushBtn) return;

    const partnerData =
JSON.parse(
  localStorage.getItem(
    "began_partner"
  ) || "{}"
);
    const partnerId =
partnerData.id || "";

    const confirmed =

    localStorage.getItem(

      `push_confirmed_${partnerId}`

    );

    if(confirmed){

      pushBtn.style.display =
        "none";

    }

  }

);


// =========================
// LAST VERSION
// =========================
let NEW_DROP_ACTIVE = false;
let PUSH_OVERLAY_ACTIVE = false;

let NEW_DROP_SOUND_PLAYED =

sessionStorage.getItem(
"began_newdrop_sound"
) === "true";

let LAST_ARTICLE_VERSION =
Number(
  localStorage.getItem(
    "lastArticleVersion"
  ) || 0
);

// =========================
// CHECK UPDATE
// =========================

async function
checkArticleUpdate(){

  try{

    const res =
      await fetch(

        NOTIFICATION_API +
        "&t=" + Date.now()

      );

    const data =
      await res.json();

    const currentVersion =
      Number(
        data.article || 0
      );
    
    window.CURRENT_ARTICLE_VERSION =
currentVersion;
    if(
currentVersion >
LAST_ARTICLE_VERSION
){

sessionStorage.removeItem(
"began_newdrop_sound"
);

NEW_DROP_SOUND_PLAYED =
false;

}

    console.log({

      currentVersion,
      LAST_ARTICLE_VERSION

    });

    // =========================
    // ADA ARTIKEL BARU
    // =========================

    if(
  currentVersion >
  LAST_ARTICLE_VERSION
){

  console.log(
    "ARTIKEL BARU TERDETEKSI"
  );

  localStorage.setItem(
    "articleUnread",
    "true"
  );

  localStorage.setItem(
    "lastArticleVersion",
    currentVersion);
    LAST_ARTICLE_VERSION =
currentVersion;
  

  localStorage.setItem(
    "newDropSeenAt",
    Date.now()
  );

  if(!NEW_DROP_SOUND_PLAYED){

NEW_DROP_SOUND_PLAYED =
true;

sessionStorage.setItem(
"began_newdrop_sound",
"true"
);

try{

  newDropSound.currentTime = 0;

  newDropSound.play()
  .catch(()=>{});

}catch(err){

  console.log(
    "PLAY SOUND FAILED",
    err
  );

}
}
  showNotificationBadge();
      if(data.drop_image){

  const preload =
    new Image();

  preload.src =
    data.drop_image;

}
showNewDropOverlay(data);
      scrollToNewDrop();


    }

  }catch(err){

    console.log(
      "NOTIFICATION ERROR",
      err
    );

}
}

function showNotificationBadge(){

  const badges =
    document.querySelectorAll(
      ".notif-dot"
    );

  badges.forEach(badge => {

    badge.style.display =
      "block";

  });
}

// =========================
// START
// =========================
injectNewDropOverlay();
function injectNewDropOverlay(){
 if(
  document.querySelector(
    ".new-drop-overlay"
  )
) return;

  const style =
  document.createElement("style");
    
  style.innerHTML = `

  .new-drop-overlay{

  position:fixed;

  inset:0;
  
  padding:
max(20px, env(safe-area-inset-top))
20px
max(20px, env(safe-area-inset-bottom));

  background:
  rgba(0,0,0,.82);

  z-index:999999;

  display:none;

  justify-content:center;
  align-items:center;

  backdrop-filter:blur(8px);

}

.a55-lite .new-drop-overlay{

  backdrop-filter:none;

}

.new-drop-popup{

  width:100%;
  max-width:900px;

  background:#050505;

  border:
  1px solid rgba(57,255,20,.18);

  border-radius:28px;

  overflow:hidden;

  position:relative;

  display:grid;

  grid-template-columns:
  1fr 1fr;

  box-shadow:
  0 0 60px rgba(57,255,20,.12);
  animation:
dropFade .25s ease;

}

.new-drop-image{

  width:100%;
  height:100%;

  object-fit:cover;

  min-height:420px;

  display:block;

  filter:
  contrast(1.05)
  brightness(.92);

}

.new-drop-content{

  display:flex;

  flex-direction:column;

  justify-content:center;

  padding:50px;

  position:relative;

}

.new-drop-content::after{

  content:"";

  position:absolute;

  bottom:0;
  left:0;
  right:0;

  height:120px;

  background:
  radial-gradient(
    rgba(57,255,20,.25),
    transparent 70%
  );

  filter:blur(40px);

}

.new-drop-close{

  position:absolute;

  top:18px;
  right:18px;

  width:34px;
  height:34px;

  border-radius:999px;

  background:
  rgba(255,255,255,.06);

  border:
  1px solid rgba(255,255,255,.08);

  color:white;

  display:flex;
  justify-content:center;
  align-items:center;

  z-index:3;
  cursor:pointer;

}

.new-drop-badge{

  display:inline-flex;

  width:max-content;

  padding:6px 14px;

  border-radius:999px;

  border:
  1px solid #39FF14;

  color:#39FF14;

  font-size:11px;

  letter-spacing:2px;

  margin-bottom:20px;

}

.new-drop-title{

  color:white;

  font-size:
clamp(
  34px,
  6vw,
  64px
);

  line-height:.92;

  font-weight:900;

  text-transform:uppercase;

}


.new-drop-sub{

  margin-top:26px;

  color:white;

  font-size:20px;

  line-height:1.5;

}


.new-drop-footer{

  margin-top:40px;

  color:#999;

  letter-spacing:5px;

  font-size:10px;

}

@media(max-width:767px){

  .new-drop-popup{

    grid-template-columns:
    1fr;

    max-width:360px;
   
  }

  .new-drop-image{

    min-height:260px;

  }

  .new-drop-content{

    padding:28px;

  }

 
  .new-drop-sub{

    font-size:15px;

  }

}

  
  `;

  document.head.appendChild(style);

  const overlay =
  document.createElement("div");

  overlay.className =
    "new-drop-overlay";

  overlay.innerHTML = `

    <div class="new-drop-popup">

  <div class="new-drop-close">
    ✕
  </div>

  <img
    class="new-drop-image"
    src=""
  >

  <div class="new-drop-content">

    <div class="new-drop-badge">
      NEW DROP
    </div>

    <div class="new-drop-title">
    </div>

    <div class="new-drop-sub">
    </div>

    <div class="new-drop-footer">
      TAP ANYWHERE TO CONTINUE
    </div>

  </div>

</div>
  `;

  document.body.appendChild(
    overlay
  );

}

function updatePushButton(){

  const btn =
  document.getElementById(
    "push-btn"
  );

  if(!btn) return;

  if(

  typeof Notification !==
  "undefined"

  &&

  Notification.permission ===
  "granted"

){

    btn.style.display =
      "none";

  }

}


checkArticleUpdate();
updatePushButton();

const unread =
localStorage.getItem(
  "articleUnread"
);

if(unread === "true"){

  showNotificationBadge();
}

function showNewDropOverlay(data){
  if(
  localStorage.getItem(
    PARTNER_ARTICLE_KEY
  ) === String(
    window.CURRENT_ARTICLE_VERSION
  )
){

  return;

}

  if(NEW_DROP_ACTIVE) return;
  
  if(PUSH_OVERLAY_ACTIVE){

    return;
    }

  

  const overlay =
    document.querySelector(
      ".new-drop-overlay"
    );

  if(!overlay){

  return;
    
  }
  NEW_DROP_ACTIVE = true;

  
  const popup =
  overlay.querySelector(
    ".new-drop-popup"
  );

if(popup){

  popup.onclick = (e)=>{

    e.stopPropagation();

  };

}

  const image =
    overlay.querySelector(
      ".new-drop-image"
    );

  const title =
    overlay.querySelector(
      ".new-drop-title"
    );

  const sub =
    overlay.querySelector(
      ".new-drop-sub"
    );

  if(
  image &&
  data.drop_image &&
  image.src !== data.drop_image
){

  image.src =
    data.drop_image;

}
  if(title){

    const safeTitle =
String(
  data.drop_title || ""
).trim();

title.innerText =
  safeTitle ||
  "NEW DROP";
  }

  if(sub){

    const safeSub =
String(
  data.drop_subtitle || ""
).trim();

sub.innerText =
  safeSub ||
  "New article available.";
  }

  overlay.style.display =
    "flex";
 
  const close = ()=>{

    localStorage.setItem(
  PARTNER_ARTICLE_KEY,
  String(
    window.CURRENT_ARTICLE_VERSION
  )
);

    overlay.style.display =
      "none";

    NEW_DROP_ACTIVE = false;

  };

  overlay.onclick = close;

  const closeBtn =
    overlay.querySelector(
      ".new-drop-close"
    );

  if(closeBtn){

    closeBtn.onclick = close;
  }

  setTimeout(close, 6000);

}


function scrollToNewDrop(){

  requestAnimationFrame(()=>{

    setTimeout(()=>{

      let firstDrop =
        document.querySelector(
          ".new-drop"
        );

      if(!firstDrop){

  setTimeout(()=>{

    firstDrop =
      document.querySelector(
        ".new-drop"
      );

    if(!firstDrop) return;

    firstDrop.scrollIntoView({

      behavior:
document.body.classList.contains(
  "a55-lite"
)
? "auto"
: "smooth",

      block:"center"

    });

  },1200);

  return;
}
      firstDrop.scrollIntoView({

        behavior:
document.body.classList.contains(
  "a55-lite"
)
? "auto"
: "smooth",

        block:"center"

      });

    },1400);

  });

}

// =========================
// IOS REDIRECT RESULT
// =========================

const pushResult =

new URLSearchParams(
  window.location.search
).get("push");

if(pushResult === "success"){

  const partnerData =
  JSON.parse(
    localStorage.getItem(
      "began_partner"
    ) || "{}"
  );

  const partnerId =
  partnerData.id || "";

  localStorage.setItem(

    `push_confirmed_${partnerId}`,

    "yes"

  );

}
document.addEventListener(

  "visibilitychange",

  ()=>{

    if(
      document.hidden
    ){

      const layer =
      document.querySelector(
        ".push-permission-layer"
      );

      if(layer){

        layer.remove();

      }

      PUSH_OVERLAY_ACTIVE =
      false;

    }

  }

);

