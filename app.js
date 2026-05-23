async function initPush(){

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

      await OneSignal.Notifications.requestPermission();

      alert(
        "🔥 ALERT DROP ACTIVE"
      );

      window.location.href =
"https://www.barkahgarment.com/began-partner-dashboard-dev";

    }

  );

}

document
.getElementById(
  "enableNotif"
)
.onclick = initPush;
