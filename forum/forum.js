document.addEventListener(
  'DOMContentLoaded',
  async function() {

    if(window.lucide){
      lucide.createIcons();
    }

    try {

      const data =
        await getBoard();

      renderPosts(data.posts);

      initPostNavigation();

      bindPostImagePicker();

      bindPostSubmit();

    } catch(err) {

      console.error(err);

    }

  }
);
function initPostNavigation() {

  const feed =
    document.getElementById(
      'dynamic-feed'
    );

  if (!feed) return;

  feed.addEventListener(
    'click',
    function(e){

      const card =
        e.target.closest(
          '.forum-card'
        );

      if (!card) return;

     const postId =
  card.dataset.postId;

window.location.href =
  '/forum/post/?postId=' +
  encodeURIComponent(postId);      

    }
  );

}

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

  console.error(
    'BEGAN PARTNER SESSION',
    partner
  );

  console.error(
    'RAW STORAGE',
    localStorage.getItem(
      'began_partner'
    )
  );

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
function bindPostImagePicker(){

  const btn =
    document.getElementById(
      'post-image-btn'
    );

  const input =
    document.getElementById(
      'post-image-input'
    );

  if(
    !btn ||
    !input
  ){
    return;
  }

  btn.addEventListener(
    'click',
    function(){

      input.click();

    }
  );

}
