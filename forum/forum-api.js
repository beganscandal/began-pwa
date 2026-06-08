const API_URL =
  'https://script.google.com/macros/s/AKfycby6RaIhL2mCRlWr9K2ePvIEyxztY9c3YXhaeJw4dlkRAF3rp6O5vl1augJKhhYzGJRcwQ/exec';

window.getBoard = async function () {

  const response = await fetch(
    API_URL + '?action=getBoard'
  );

  return response.json();

};

window.getPost = async function (postId) {

  const response = await fetch(
    API_URL +
    '?action=getPost' +
    '&postId=' +
    encodeURIComponent(postId)
  );

  return response.json();

};
window.getReplies = async function(postId){

  const response = await fetch(
    API_URL +
    '?action=getReplies' +
    '&postId=' +
    encodeURIComponent(postId)
  );

  return response.json();

};

window.createReply = async function(payload){

  const response = await fetch(
    API_URL,
    {
      method:'POST',
      body:JSON.stringify({
        action:'createReply',
        payload:payload
      })
    }
  );

  return response.json();

};
