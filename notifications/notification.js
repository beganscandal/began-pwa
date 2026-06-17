async function initNotifications(){

  try{

    const result =

      await getNotifications();

    NotificationState
      .notifications =

      result.notifications || [];

    renderNotifications();

  }

  catch(error){

    console.error(error);

  }

}

document.addEventListener(

  'DOMContentLoaded',

  initNotifications

);
