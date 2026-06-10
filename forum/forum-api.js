const API_URL =
  'https://script.google.com/macros/s/AKfycbycwDjEbvDOvpxB2DDxQn23pbHlVaFlfXmkiqS6zG7YtZRPgULKDI7DVpp9f_GXiZO0_Q/exec';

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

  console.log(
    'UPLOAD PAYLOAD',
    payload
  );

  try{

    const response =
      await fetch(
        API_URL,
        {
          method:'POST',

          headers:{
            'Content-Type':
              'text/plain;charset=utf-8'
          },

          body:JSON.stringify({

            action:
              'uploadPostImage',

            payload:
              payload

          })
        }
      );

    console.log(
      'RESPONSE STATUS',
      response.status
    );

    const text =
      await response.text();

    console.log(
      'RAW RESPONSE',
      text
    );

    return JSON.parse(text);

  }catch(err){

    console.error(
      'UPLOAD FETCH FAILED',
      err
    );

    throw err;

  }

};window.uploadPostVideo =
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
