const API_URL =
  'https://script.google.com/macros/s/AKfycbw4q9A745LrtEXGfuyGoP9vwa9qGNiNvnWmUz1rTQ6PBD0cpwYBB-RAonz_HC853ZS-lw/exec';

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
