const API_URL =
'https://script.google.com/macros/s/AKfycby5tLVAANe2WzaDenx_OVz5Aj1kiUpyALfgJ3y7x0aFdXtIopOPNuyhvASDu1jJfyJrDQ/exec';

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
