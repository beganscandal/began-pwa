const API_URL =
'https://script.google.com/macros/s/AKfycbxRunAOKJdMTGvFygNheoQ6r3L6DK6Wg81vIMVQWZq_ThM0vml9LafIiXmqTzZjbTo1qg/exec';

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
