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

        await OneSignal.init({

          appId:
"c8acf160-3a17-450f-a33e-5993db724cff",

          serviceWorkerPath:
"/OneSignalSDKWorker.js",

          notifyButton:{
            enable:false
          }

        });

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

            const permission =

              await OneSignal
              .Notifications
              .requestPermission();

            // =========================
            // SUCCESS
            // =========================

            if(permission){

              if(partnerId){

                OneSignal.login(
                  partnerId
                );

                OneSignal.User.addTag(
                  "partner",
                  partnerId
                );

              }

              if(toko){

                OneSignal.User.addTag(
                  "toko",
                  toko
                );

              }

              if(btn){

                btn.innerHTML =
                  "🔥 ALERT ACTIVE";
              }

              window.parent.postMessage({

                type:
                "BEGAN_PUSH_SUCCESS"

              },"*");

            }

            // =========================
            // DENIED
            // =========================

            else{

              window.parent.postMessage({

                type:
                "BEGAN_PUSH_DENIED"

              },"*");

            }

          }catch(err){

            console.log(err);

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
