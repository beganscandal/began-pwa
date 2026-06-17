const API_URL =
'https://script.google.com/macros/s/AKfycbyhxBNJIYnUJHCsgnLyjG9EIDKvKrRPGhgnTUF3VjTbqmA5Ars16U_SxPpT0Ox5SUwROw/exec';

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
