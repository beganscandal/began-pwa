async function initNotifications(){

  try{

    const result =
      await getNotifications();

    console.log(
      'NOTIFICATION API',
      result
    );

    NotificationState.notifications =
      result.notifications || [];

    console.log(
      'STATE',
      NotificationState.notifications
    );

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

        await loadNotifications();

        renderNotifications();
        renderNotificationStats();
        renderNotificationBadge();

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
