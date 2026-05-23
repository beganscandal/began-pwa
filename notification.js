console.log(
  "BEGAN NOTIFICATION SYSTEM LOADED"
);

// =========================
// CONFIG
// =========================

const NOTIFICATION_API =
"https://script.google.com/macros/s/AKfycbza5dLHKWO8iizfjp_8CaT_QsNQ50e4zxf40mt_mfinlvhnMqCwpLxdrrBh7fEc79Fs/exec?action=notificationStatus";

// =========================
// SOUND
// =========================

const newDropSound =
new Audio(
  "https://cdn.prod.website-files.com/69c14cdea8e1d469f0564d69/6a07b03b3076e93739d1d7bb_new%20article%20drop.mp3"
);

newDropSound.volume = 0.8;

// =========================
// AUDIO UNLOCK
// =========================

function unlockNotifAudio(){

  newDropSound.muted = true;

  newDropSound.play()

  .then(()=>{

    newDropSound.pause();

    newDropSound.currentTime = 0;

    newDropSound.muted = false;

  })

  .catch(()=>{});
}

document.addEventListener(
  "click",
  unlockNotifAudio,
  { once:true }
);

document.addEventListener(
  "touchstart",
  unlockNotifAudio,
  { once:true }
);

// =========================
// LAST VERSION
// =========================
let NEW_DROP_ACTIVE = false;
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
    currentVersion
  );

  localStorage.setItem(
    "newDropSeenAt",
    Date.now()
  );

  newDropSound.play()
  .catch(()=>{});

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

  .a55-lite .new-drop-overlay{

    backdrop-filter:none;

  }

  .a55-lite .new-drop-popup{

    animation:none;

    box-shadow:none;

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

checkArticleUpdate();

const unread =
localStorage.getItem(
  "articleUnread"
);

if(unread === "true"){

  showNotificationBadge();
}

function showNewDropOverlay(data){

  if(NEW_DROP_ACTIVE) return;

  

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
// PUSH OVERLAY SYSTEM
// =========================

injectPushOverlay();

function injectPushOverlay(){

  if(
    document.querySelector(
      "#began-push-overlay"
    )
  ) return;

  // =========================
  // STYLE
  // =========================

  const style =
  document.createElement(
    "style"
  );

  style.innerHTML = `

#began-push-overlay{

position:fixed;

inset:0;

display:none;

justify-content:center;
align-items:center;

background:
rgba(0,0,0,.45);

backdrop-filter:
blur(10px);

z-index:999999;

padding:
max(20px,env(safe-area-inset-top))
20px
max(20px,env(safe-area-inset-bottom));

}

.began-push-box{

position:relative;

width:100%;
max-width:420px;

height:85vh;

border-radius:28px;

overflow:hidden;

background:#050505;

border:
1px solid rgba(57,255,20,.15);

box-shadow:
0 0 60px rgba(57,255,20,.12);

}

.began-push-frame{

width:100%;
height:100%;

border:none;

background:#050505;

}

.began-push-close{

position:absolute;

top:14px;
right:14px;

width:34px;
height:34px;

border-radius:999px;

display:flex;
justify-content:center;
align-items:center;

background:
rgba(255,255,255,.08);

border:
1px solid rgba(255,255,255,.08);

color:white;

font-size:13px;

cursor:pointer;

z-index:10;

backdrop-filter:
blur(10px);

}

.a55-lite #began-push-overlay{

backdrop-filter:none;

}

`;

  document.head.appendChild(
    style
  );

  // =========================
  // HTML
  // =========================

  const overlay =
  document.createElement(
    "div"
  );

  overlay.id =
    "began-push-overlay";

  overlay.innerHTML = `

<div class="began-push-box">

<div
class="began-push-close">

✕

</div>

<iframe
id="began-push-frame"
class="began-push-frame">
</iframe>

</div>

`;

  document.body.appendChild(
    overlay
  );

  // =========================
  // CLOSE BUTTON
  // =========================

  overlay
  .querySelector(
    ".began-push-close"
  )
  .onclick =
  closePushOverlay;

}

// =========================
// OPEN PUSH
// =========================

window.openPushOverlay =
function(){

  const partner =
    JSON.parse(

      localStorage.getItem(
        "began_partner"
      ) || "{}"

    );

  const partnerId =
    partner.id || "";

  const toko =
    partner.toko || "";

  const frame =
    document.getElementById(
      "began-push-frame"
    );

  const overlay =
    document.getElementById(
      "began-push-overlay"
    );

  if(!frame || !overlay) return;

  frame.src =

`https://pwa.barkahgarment.com
/?partner=${encodeURIComponent(partnerId)}
&toko=${encodeURIComponent(toko)}`;

  overlay.style.display =
    "flex";

  // FAILSAFE
  setTimeout(()=>{

    overlay.style.display =
      "none";

  },25000);

};

// =========================
// CLOSE
// =========================

function closePushOverlay(){

  const overlay =
    document.getElementById(
      "began-push-overlay"
    );

  const frame =
    document.getElementById(
      "began-push-frame"
    );

  if(overlay){

    overlay.style.display =
      "none";

  }

  if(frame){

    frame.src = "about:blank";

  }

}

// =========================
// LISTENER
// =========================

window.addEventListener(

  "message",

  (event)=>{

    // SUCCESS
    if(
      event.data.type ===
      "BEGAN_PUSH_SUCCESS"
    ){

      closePushOverlay();

      alert(
        "🔥 ALERT DROP ACTIVE"
      );

    }

    // DENIED
    if(
      event.data.type ===
      "BEGAN_PUSH_DENIED"
    ){

      closePushOverlay();

      alert(
        "Notification belum diaktifkan."
      );

    }

  }

);
