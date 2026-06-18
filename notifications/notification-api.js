const API_URL =
'https://script.google.com/macros/s/AKfycbyVKbJ1YrFgAKWbaZdrdGVzYbl1PgeAKt07McE0lmVRDxICFQFv1CeKUSpHr5KrpEfEHA/exec'; 

async function getNotifications(){

  const partner = JSON.parse(
    localStorage.getItem(
      'began_partner'
    ) || '{}'
  );

  const url =
    API_URL +
    '?action=getNotifications' +
    '&partnerId=' +
    encodeURIComponent(
      partner.id
    );

  console.log(
    'FETCH URL',
    url
  );

  const response =
    await fetch(url);

  return response.json();

}

async function markNotificationRead(notificationId){

  const partner =
    JSON.parse(
      localStorage.getItem(
        'began_partner'
      ) || '{}'
    );

  const response =
    await fetch(
      API_URL,
      {
        method:'POST',
        body:JSON.stringify({
          action:'markNotificationRead',
          payload:{
            notificationId:notificationId,
            partnerId:partner.id
          }
        })
      }
    );

  return response.json();

}

async function markAllNotificationsRead(){

  const partner =
    JSON.parse(
      localStorage.getItem(
        'began_partner'
      ) || '{}'
    );

  const response =
    await fetch(
      API_URL,
      {
        method:'POST',
        body:JSON.stringify({
          action:'markAllNotificationsRead',
          payload:{
            partnerId:partner.id
          }
        })
      }
    );

  return response.json();

}

async function loadNotifications(){

  const result =
    await getNotifications();

  NotificationState.notifications =
    result.notifications || [];

  return result;

}
