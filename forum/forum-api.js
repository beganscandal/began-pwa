const API_URL =
  'https://script.google.com/macros/s/AKfycbyDkv3Yk3rrfF8xsymCMU_0F3auP0lHjXxkO9KqPxWExQEg6B36x9x9TgV6i945gZVpEA/exec';

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

function bindPostSubmit(){

  const btn =
    document.getElementById(
      'post-btn'
    );

  if(!btn){
    return;
  }

  btn.addEventListener(
    'click',
    async function(){

      const content =
        document
          .getElementById(
            'post-content'
          )
          .value
          .trim();

      const category =
        document
          .getElementById(
            'post-category'
          )
          .value;

      if(!content){
        return;
      }

      const partner =
        JSON.parse(
          localStorage.getItem(
            'began_partner'
          ) || '{}'
        );

      if(
        !partner.id ||
        !partner.toko
      ){
        alert(
          'Partner session tidak ditemukan'
        );
        return;
      }

      btn.disabled = true;

      try{

        await createPost({

          partnerId:
            partner.id,

          toko:
            partner.toko,

          partnerName:
            partner.toko,

          category:
            category,

          content:
            content

        });

        location.reload();

      }catch(err){

        console.error(err);

      }finally{

        btn.disabled = false;

      }

    }
  );

}
