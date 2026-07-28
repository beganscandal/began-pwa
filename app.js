const params =
new URLSearchParams(
  window.location.search
);

const partnerId =
params.get("partner") ||
params.get("partnerId") ||
"";
const toko =
params.get("toko") || "";

async function initPush(){

  console.log(
    "INIT PUSH START"
  );

  const btn =
  document.getElementById(
    "enableNotif"
  );

  // =========================
  // IOS UNSUPPORTED CHECK
  // =========================

  const isIOS =

/iPad|iPhone|iPod/.test(
  navigator.userAgent
) ||

(
  navigator.platform === "MacIntel" &&
  navigator.maxTouchPoints > 1
);

const unsupportedIOS =

isIOS &&

!(
  "PushManager" in window
);
  if(unsupportedIOS){

    console.log(
      "IOS PUSH NOT SUPPORTED"
    );

    const sub =
    document.querySelector(
      ".auth-sub"
    );

    if(sub){

      sub.innerHTML =

"iPhone ini belum support push notification Safari.<br><br>Minimal iOS 16.4 diperlukan.";

    }

    if(btn){

      btn.disabled = true;

      btn.innerHTML =
        "DEVICE NOT SUPPORTED";
    }

    return;

  }

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

    "https://barkahgarment.com"

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

  sdk.onload = ()=>{

  console.log(
    "SDK LOADED"
  );

  resolve();

};

  sdk.onerror = reject;

});
    }

    // =========================
    // INIT ONCE
    // =========================

    window.OneSignalDeferred =
      window.OneSignalDeferred || [];

    if(!window.BEGAN_ONESIGNAL_INIT_PROMISE){

      window.BEGAN_ONESIGNAL_INIT_PROMISE =
      new Promise((resolve,reject)=>{

        OneSignalDeferred.push(
          async function(OneSignal){
            try{

              if(!window.BEGAN_ONESIGNAL_INITIALIZED){

                console.log(
    "ONESIGNAL INIT START"
  );

                await OneSignal.init({

                  appId:
  "37e11236-e95b-4d5d-b925-f7b5f8308cdd",

                  safari_web_id:
  "web.onesignal.auto.14469d21-a548-446f-9323-a0e21fc14d38",

                  notifyButton: {
                    enable: false,
                  },

                });

                window.BEGAN_ONESIGNAL_INITIALIZED =
                  true;

                console.log(
    "ONESIGNAL INIT SUCCESS"
  );

              }

              resolve(OneSignal);

            }catch(err){

              reject(err);

            }

          }
        );

      });

    }

    const OneSignal =
    await window.BEGAN_ONESIGNAL_INIT_PROMISE;

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
    // IDENTITY SYNC
    // =========================

    const syncIdentity = async (retry)=>{

      if(!partnerId){

        console.log(
          "ONESIGNAL IDENTITY SKIPPED"
        );

        return true;

      }

      const lastExternalId =
      localStorage.getItem(
        "began_onesignal_external_id"
      );

      if(
        lastExternalId &&
        lastExternalId !== partnerId
      ){

        console.log(
          "ONESIGNAL PARTNER SWITCH",
          {
            from:
            lastExternalId,
            to:
            partnerId
          }
        );

        if(OneSignal.logout){

          await OneSignal.logout();

        }

      }

      await OneSignal.login(
        partnerId
      );

      localStorage.setItem(
        "began_onesignal_external_id",
        partnerId
      );

      await OneSignal.User.addTag(
        "partner",
        partnerId
      );

      if(toko){

        await OneSignal.User.addTag(
          "toko",
          toko
        );

      }

      let tags = {};

      if(
        OneSignal.User &&
        typeof OneSignal.User.getTags === "function"
      ){

        tags =
        await OneSignal.User.getTags();

      }

      const partnerOk =
      String(tags.partner || "") ===
      String(partnerId);

      const tokoOk =
      !toko ||
      String(tags.toko || "") ===
      String(toko);

      if(
        partnerOk &&
        tokoOk
      ){

        console.log(
          "ONESIGNAL IDENTITY VERIFIED",
          tags
        );

        return true;

      }

      console.log(
        "ONESIGNAL TAG VERIFY FAILED",
        tags
      );

      if(!retry){

        return syncIdentity(true);

      }

      return false;

    };

    const identitySynced =
    await syncIdentity(false);

    if(!identitySynced){

      throw new Error(
        "ONESIGNAL_IDENTITY_SYNC_FAILED"
      );

    }

    // =========================
    // DIRECT FLOW
    // =========================
      try{

        const alreadySubscribed =

!!(
  OneSignal.User &&
  OneSignal.User.PushSubscription &&
  OneSignal.User.PushSubscription.optedIn
);
        
        if(alreadySubscribed){

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

  "https://barkahgarment.com"

  );

  setTimeout(()=>{

    window.close();
  },1200);

}else{

  window.location.href =

"https://barkahgarment.com/began-partner-dashboard-dev?push=success";

}
          return;

        }

       console.log(
  "REQUEST PERMISSION START"
);

const permission =

await OneSignal.Notifications.requestPermission();

console.log(
  permission
);

        if(

  permission === "granted" ||

  permission === true

){

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

  "https://barkahgarment.com"

  );

  setTimeout(()=>{

    window.close();

  },1200);

}else{

  window.location.href =

"https://barkahgarment.com/began-partner-dashboard-dev?push=success";

}

return;
          
        }else{

  clearTimeout(failSafe);

  if(window.opener){

    window.opener.postMessage({

      type:
      "BEGAN_PUSH_DENIED"

    },

    "https://barkahgarment.com"

    );

    setTimeout(()=>{

      window.close();

    },1200);

  }else{

    window.location.href =

"https://barkahgarment.com/began-partner-dashboard-dev?push=denied";

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

    "https://barkahgarment.com"

    );

    setTimeout(()=>{

      window.close();

    },1200);

  }

}

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
