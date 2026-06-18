async function initNotifications(){

  try{

    await loadNotifications();

    renderNotifications();
    renderNotificationStats();
    renderNotificationBadge();

    bindNotificationClicks();
    bindMarkAllRead();

    lucide.createIcons();

  }

  catch(error){

    console.error(
      'INIT ERROR',
      error
    );

  }

}


document.addEventListener(

  'DOMContentLoaded',

  initNotifications

);

let IS_REFRESHING = false;

async function refreshNotificationCenter(){

  if(IS_REFRESHING)
    return;

  IS_REFRESHING = true;

  try{

    await loadNotifications();

    renderNotifications();
    renderNotificationStats();
    renderNotificationBadge();

  }

  catch(error){

    console.error(
      'REFRESH NOTIFICATION ERROR',
      error
    );

  }

  finally{

    IS_REFRESHING = false;

  }

}
document.addEventListener(

  'visibilitychange',

  async function(){

    if(document.hidden)
      return;

    await refreshNotificationCenter();

  }

);

setInterval(

  async function(){

    if(document.hidden)
      return;

    await refreshNotificationCenter();

  },

  30000
);

function bindMarkAllRead(){

  const button =

    document.getElementById(
      'mark-all-btn'
    );

  if(!button) return;

  button.addEventListener(

    'click',

    async function(){

      try{

       await markAllNotificationsRead();

       await refreshNotificationCenter();
      }

      catch(error){

        console.error(
          'MARK ALL READ ERROR',
          error
        );

      }

    }

  );

}


