const API_URL =
  'https://script.google.com/macros/s/AKfycby-6JRp4k_wDbOplmY6Rn8wH0q6LEdlpw48I04KiHjovKI2mi2qI3fw3a-du1lVtE7j8w/exec';

async function getBoard() {

  const response = await fetch(
    API_URL + '?action=getBoard'
  );

  return response.json();

} 
