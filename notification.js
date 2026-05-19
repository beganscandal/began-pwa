console.log(
  "BEGAN NOTIFICATION SYSTEM LOADED"
);

// =========================
// CONFIG
// =========================

const NOTIFICATION_API = "https://script.google.com/macros/s/AKfycbza5dLHKWO8iizfjp_8CaT_QsNQ50e4zxf40mt_mfinlvhnMqCwpLxdrrBh7fEc79Fs/exec?action=notificationStatus";
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
        NOTIFICATION_API
      );

    const data =
      await res.json();

    const currentVersion =
      Number(
        data.article || 0
      );

    console.log({

      currentVersion,
      LAST_ARTICLE_VERSION

    });

    // ADA ARTIKEL BARU
    if(
      currentVersion >
      LAST_ARTICLE_VERSION
    ){

      console.log(
        "ARTIKEL BARU TERDETEKSI"
      );

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
