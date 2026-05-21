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

      newDropSound.play()
      .catch(()=>{});

    }

  }catch(err){

    console.log(
      "NOTIFICATION ERROR",
      err
    );

  }
}

// =========================
// START
// =========================

checkArticleUpdate();
