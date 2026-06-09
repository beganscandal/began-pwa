const API_URL =
  'https://script.google.com/macros/s/AKfycby5YtYYG-89BznbVk1T12KCKCZV0Nl8e8cI1Ad415o2cf9XpfWOOD0ZkA9KhUVH77JAgA/exec';

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

window.uploadPostImage =
  async function(payload){

    const response =
      await fetch(
        API_URL,
        {
          method:'POST',
          body:JSON.stringify({
            action:'uploadPostImage',
            payload:payload
          })
        }
      );

    return response.json();

  };
window.uploadPostVideo =
  async function(payload){

    const response =
      await fetch(
        API_URL,
        {
          method:'POST',
          body:JSON.stringify({
            action:'uploadPostVideo',
            payload:payload
          })
        }
      );

    return response.json();

  };
window.uploadPostImage =
  async function(payload){

    const response =
      await fetch(
        API_URL,
        {
          method:'POST',
          body:JSON.stringify({
            action:
              'uploadPostImage',
            payload:
              payload
          })
        }
      );

    return response.json();

  };
