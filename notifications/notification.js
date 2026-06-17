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
