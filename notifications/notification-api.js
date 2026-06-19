const API_URL =
'https://script.google.com/macros/s/AKfycbyOrOoPCY8tHo5GMlGaW9eOyxA3O-7Q_-Y3NNGZAuxhe_In0ZwxBy2dHYySDNvsuIfyKg/exec'; 
function hydrateNotificationPartnerSession(){

  const params =
    new URLSearchParams(
      window.location.search
    );

  let partner = null;

  const rawPartner =
    params.get('partner');

  if(rawPartner){

    try{

      partner =
        JSON.parse(
          decodeURIComponent(rawPartner)
        );

    }catch(error){

      try{

        partner =
          JSON.parse(
            atob(rawPartner)
          );

      }catch(innerError){}

    }

  }

  if(!partner){

    const partnerId =
      params.get('partnerId') ||
      params.get('partner_id') ||
      params.get('id');

    const toko =
      params.get('toko') ||
      params.get('partnerName') ||
      params.get('name');

    if(partnerId && toko){

      partner = {
        id:partnerId,
        toko:toko,
        name:params.get('name') || toko,
        whatsapp:params.get('whatsapp') || '',
        tier:params.get('tier') || ''
      };

    }

  }

  if(
    !partner ||
    !partner.id ||
    !partner.toko
  ){
    return;
  }

  localStorage.setItem(
    'began_partner',
    JSON.stringify(partner)
  );

  try{

    const url =
      new URL(window.location.href);

    [
      'partner',
      'partnerId',
      'partner_id',
      'id',
      'toko',
      'partnerName',
      'name',
      'whatsapp',
      'tier'
    ].forEach(function(key){
      url.searchParams.delete(key);
    });

    window.history.replaceState(
      {},
      document.title,
      url.pathname + url.search + url.hash
    );

  }catch(error){}

}

hydrateNotificationPartnerSession();


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

async function deleteNotification(
  notificationId
){

  const partner =

    JSON.parse(

      localStorage.getItem(
        'began_partner'
      ) || '{}'

    );

  if(!partner.id){

    throw new Error(
      'PARTNER_NOT_FOUND'
    );

  }

  const response =
    await fetch(
      API_URL,
      {
        method:'POST',
        body:JSON.stringify({
          action:'deleteNotification',
          payload:{
            notificationId :
              notificationId,

            partnerId :
              partner.id
          }
        })
      }
    );

  const result =
    await response.json();

  if(!result.success){

    throw new Error(
      result.message ||
      'DELETE_NOTIFICATION_FAILED'
    );

  }

  return result;

}
