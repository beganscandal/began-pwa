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

  if(window.opener){

    window.opener.postMessage({

      type:
      "BEGAN_PUSH_DENIED"

    },

    "https://www.barkahgarment.com"

    );

    setTimeout(()=>{

      window.close();

    },1200);

  }

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

      await new Promise((resolve,reject)=>{

  sdk.onload = resolve;

  sdk.onerror = reject;

});
    }

    // =========================
    // INIT
    // =========================

    window.OneSignalDeferred =
      window.OneSignalDeferred || [];

    await new Promise(resolve=>{

      OneSignalDeferred.push(
        async function(OneSignal){

          await OneSignal.init({

            appId:
"37e11236-e95b-4d5d-b925-f7b5f8308cdd",

            safari_web_id:
"web.onesignal.auto.14469d21-a548-446f-9323-a0e21fc14d38",

            notifyButton: {
              enable: true,
            },

          });

          resolve();

        }
      );

    });

    window.BEGAN_ONESIGNAL_READY =
      true;

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

OneSignal.User.PushSubscription.optedIn;
        
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

          if(window.opener){

  window.opener.postMessage({

    type:
    "BEGAN_PUSH_SUCCESS"

  },

  "https://www.barkahgarment.com"

  );

  setTimeout(()=>{

    window.close();

  },1200);

}else{

  window.location.href =

"https://www.barkahgarment.com/began-partner-dashboard-dev?push=success";

}
          return;

        }

        const permission =

await OneSignal.Notifications.requestPermission();

        if(

  permission === "granted" ||

  permission === true

){

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

          if(window.opener){

  window.opener.postMessage({

    type:
    "BEGAN_PUSH_SUCCESS"

  },

  "https://www.barkahgarment.com"

  );

  setTimeout(()=>{

    window.close();

  },1200);

}else{

  window.location.href =

"https://www.barkahgarment.com/began-partner-dashboard-dev?push=success";

}

return;
          
        }else{

  clearTimeout(failSafe);

  if(window.opener){

    window.opener.postMessage({

      type:
      "BEGAN_PUSH_DENIED"

    },

    "https://www.barkahgarment.com"

    );

    setTimeout(()=>{

      window.close();

    },1200);

  }else{

    window.location.href =

"https://www.barkahgarment.com/began-partner-dashboard-dev?push=denied";

  }

}
    
}catch(err){
  console.log(err);

  clearTimeout(failSafe);

  if(window.opener){

    window.opener.postMessage({

      type:
      "BEGAN_PUSH_DENIED"

    },

    "https://www.barkahgarment.com"

    );

    setTimeout(()=>{

      window.close();

    },1200);

  }

}

},1200);

}catch(err){

  console.log(err);

  if(btn){

    btn.disabled = false;

    btn.innerHTML =
      "TRY AGAIN";
  }

}
}

const enableBtn =
document.getElementById(
  "enableNotif"
);

if(enableBtn){

  enableBtn.onclick =
    initPush;

}
