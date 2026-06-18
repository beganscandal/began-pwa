const API_URL =
  'https://script.google.com/macros/s/AKfycbyVKbJ1YrFgAKWbaZdrdGVzYbl1PgeAKt07McE0lmVRDxICFQFv1CeKUSpHr5KrpEfEHA/exec';

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

};

window.uploadReplyImage =
async function(payload){

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
              'uploadReplyImage',

            payload:
              payload

          })
        }
      );

    const text =
      await response.text();

    return JSON.parse(text);

  }catch(err){

    console.error(
      'UPLOAD REPLY FAILED',
      err
    );

    throw err;

  }

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

async function togglePostLike(
  payload
){

  const response =
    await fetch(
      API_URL,
      {

        method:'POST',

        body:JSON.stringify({

          action:
            'togglePostLike',

          payload:
            payload

        })

      }
    );

  return response.json();

}

window.uploadReplyVideo =
  async function(payload){

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
              'uploadReplyVideo',

            payload:
              payload

          })

        }
      );

    const text =
      await response.text();

    return JSON.parse(text);

  };

window.incrementPostViewCount =
    async function(postId){

        const response =
            await fetch(
                API_URL,
                {
                    method:'POST',

                    body:JSON.stringify({

                        action:
                            'incrementPostViewCount',

                        postId:
                            postId

                    })

                }
            );

        return response.json();

    };

async function getTopPartners(){

  const response =

    await fetch(

      `${API_URL}?action=getTopPartners`

    );

  return response.json();

}

async function submitVoice(
  payload
){

  const response =

    await fetch(

      API_URL,

      {

        method:'POST',

        headers:{

          'Content-Type':
            'application/json'

        },

        body:JSON.stringify({

          action:
            'submitVoice',

          payload:
            payload

        })

      }

    );

  return response.json();

}
