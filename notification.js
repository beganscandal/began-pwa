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

//  showNewDropOverlay({

  //  title:
    //  data.drop_title,

   // subtitle:
    //  data.drop_subtitle,

    //image:
      //data.drop_image

  //});

 // showNewDropSection();

//}
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

checkArticleUpdate();
showNewDropSection();
renderNewDropTest();
const unread =
localStorage.getItem(
  "articleUnread"
);

if(unread === "true"){

  showNotificationBadge();
}

function showNewDropSection(){

  const section =
    document.getElementById(
      "new-drop-section"
    );

  if(!section) return;

  section.style.display =
    "block";

  setTimeout(()=>{

    section.scrollIntoView({

      behavior:"smooth"

    });

  }, 800);
  

}

function renderNewDropTest(){

  const grid =
    document.querySelector(
      ".new-drop-grid"
    );

  if(!grid) return;

  grid.innerHTML = `

    <div class="new-drop-card">

      <img
        class="new-drop-image"
        src="https://cdn.prod.website-files.com/69c14cdea8e1d469f0564d69/682e65df4d96f4b8d629f2f8_20s-black-boxy.jpg"
      >

      <div class="new-drop-content">

        <div class="new-drop-title">

          NEW DROP 20s BOXY

        </div>

        <div class="new-drop-subtitle">

          Oversize boxy premium cotton combed.
          Ready stock priority partner access.

        </div>

      </div>

    </div>

  `;

}
