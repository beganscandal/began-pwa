const API_URL =
  'https://script.google.com/macros/s/AKfycbzhrc8wHczK0dwIsh8YfrKyYhi3rDj55Xmi96rTNmstuhEFdXJJo9t_--G4EutGNc3pbw/exec';

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

window.uploadReplyImage =
  async function(payload){

    const response =
      await fetch(
        API_URL,
        {
          method:'POST',
          body:JSON.stringify({
            action:
              'uploadReplyImage',
            payload:
              payload
          })
        }
      );

    return response.json();

  };

window.createPost =
  async function(payload){

    const response =
      await fetch(
        API_URL,
        {
          method:'POST',
          body:JSON.stringify({
            action:'createPost',
            payload:payload
          })
        }
      );

    return response.json();

  };


