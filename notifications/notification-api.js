const API_URL =
'https://script.google.com/macros/s/AKfycbxrfnq_pWhnMk8C4nX2cEfNVFrp64dnU-7G6UGhB3XNQMazbvGvk1c9Gxg7Dx5b9yfqng/exec';

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
