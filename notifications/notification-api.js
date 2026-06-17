const API_URL =
'https://script.google.com/macros/s/AKfycbwvjyVqI53uMp9v5Ebj9jXoUI-pLgjwop7LSp86rykmPCIfsoFQquSpJLN33f2CltYw/exec';

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
