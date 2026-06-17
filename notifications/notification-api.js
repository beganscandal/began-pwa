const API_URL =
'https://script.google.com/macros/s/AKfycbxjeVhbSCmljJBhoD0vlmTlzkRpFvnr1n_DG80bwtJWgpjEqE9p7SSDWDNVlB4PARReoA/exec';

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
