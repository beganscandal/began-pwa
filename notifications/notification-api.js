const API_URL =
'https://script.google.com/macros/s/AKfycbydgJLrza0hdt5tjc-9juiuzg-QWnoNeUfARzjCpBQaXEp0tn0QiWEO_V4kYFZ2TGbEdA/exec';

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
