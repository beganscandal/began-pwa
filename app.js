const params =
new URLSearchParams(
  window.location.search
);

const partnerId =
params.get("partner") || "";

const toko =
params.get("toko") || "";

async function initPush(){

  const btn =
  document.getElementById(
    "enableNotif"
  );

  if(btn){

    btn.disabled = true;

    btn.innerHTML =
      "CONNECTING...";
  }
  const failSafe = setTimeout(()=>{

  window.parent.postMessage({

    type:
    "BEGAN_PUSH_DENIED"

  },"*");

},25000);

  try{

    // =========================
    // LOAD SDK
    // =========================

    if(!window.OneSignal){

      const sdk =
      document.createElement(
        "script"
      );

      sdk.src =
"https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";

      sdk.defer = true;

      document.head.appendChild(
        sdk
      );

      await new Promise(resolve=>{

        sdk.onload = resolve;

      });

    }

    // =========================
    // INIT
    // =========================

    window.OneSignalDeferred =
  window.OneSignalDeferred || [];


    OneSignalDeferred.push(

      async function(OneSignal){
       if(!window.BEGAN_ONESIGNAL_READY){

 await OneSignal.init({

  appId:
  "c8acf160-3a17-450f-a33e-5993db724cff",

  serviceWorkerPath:
  "https://pwa.barkahgarment.com/OneSignalSDKWorker.js",

  serviceWorkerUpdaterPath:
  "https://pwa.barkahgarment.com/OneSignalSDKUpdaterWorker.js",

  
  notifyButton:{
    enable:false
  }

});
  window.BEGAN_ONESIGNAL_READY =
  true;

}

        console.log(
          "ONESIGNAL READY"
        );

        if(btn){

          btn.innerHTML =
            "ALLOW NOTIFICATION";
        }

        // =========================
        // DELAY
        // =========================

        setTimeout(async()=>{

          try{

            const alreadySubscribed =

await OneSignal
.User
.PushSubscription
.optedIn;

if(alreadySubscribed){

  if(partnerId){

    await OneSignal.login(
      partnerId
    );

    await OneSignal.User.addTag(
      "partner",
      partnerId
    );

  }

  if(toko){

    await OneSignal.User.addTag(
      "toko",
      toko
    );

  }

  if(btn){

    btn.innerHTML =
      "🔥 ALERT ACTIVE";
  }

  clearTimeout(failSafe);

  window.parent.postMessage({

    type:
    "BEGAN_PUSH_SUCCESS"

  },"*");

  return;


}
       const permission =

await OneSignal.Notifications.requestPermission();

if(permission === "granted"){

  if(partnerId){

    await OneSignal.login(
      partnerId
    );

    await OneSignal.User.addTag(
      "partner",
      partnerId
    );

  }

  if(toko){

    await OneSignal.User.addTag(
      "toko",
      toko
    );

  }

  if(btn){

    btn.innerHTML =
      "🔥 ALERT ACTIVE";
  }

  clearTimeout(failSafe);

  window.parent.postMessage({

    type:
    "BEGAN_PUSH_SUCCESS"

  },"*");

}
            // =========================
            // DENIED
            // =========================

            else{
clearTimeout(failSafe);
              window.parent.postMessage({

                type:
                "BEGAN_PUSH_DENIED"

              },"*");

            }

          }catch(err){

            console.log(err);
clearTimeout(failSafe);
            window.parent.postMessage({

              type:
              "BEGAN_PUSH_DENIED"

            },"*");

          }

        },1200);

      }

    );

  }catch(err){

    console.log(err);

    if(btn){

      btn.disabled = false;

      btn.innerHTML =
        "TRY AGAIN";
    }

  }

}

document
.getElementById(
  "enableNotif"
)
.onclick = initPush;
