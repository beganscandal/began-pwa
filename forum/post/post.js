(function(){ 

'use strict'; 

async function init(){
   
    const root =
        document.getElementById(
            'post-page'
        );

    if(!root){

        return;

    }

    root.innerHTML =
        renderPostSkeleton();

    try{

        const params =
            new URLSearchParams(
                location.search
            );

       const postId =
    params.get(
        'postId'
    );

if(!postId){

    BeganDeepLink.open(
        '/forum/'
    );

    return;

}
        
const viewedKey =
    'forum_view_' +
    postId;

if(
    !sessionStorage.getItem(
        viewedKey
    )
){

    await incrementPostViewCount(
        postId
    );

    sessionStorage.setItem(
        viewedKey,
        '1'
    );

}

const data =
    await getPost(
        postId
    );
         

        const post =
            data.post || {};

        await loadMentionPartners();

        root.innerHTML =
            renderPostPage(post);
         if(window.lucide){
  lucide.createIcons();
}

              
        bindMentionAutocomplete();
        await loadReplies(
            postId
        );

        bindImagePicker();
         
        bindVideoPicker();

        bindReplyPreviewActions();

        bindReplySubmit(
            postId
        );
       

bindActionBar();

bindPostLike();
        bindGlobalNavigation();
       if(
  window.BeganNotificationRealtime
){

  BeganNotificationRealtime.init();

}
       
        

    }catch(err){

        console.error(err);

        root.innerHTML = `

            <div class="post-error">

                Gagal memuat diskusi.

            </div>

        `;

    }

}

document.addEventListener(
    'DOMContentLoaded',
    init
);

})();

function bindGlobalNavigation(){

  if(
    document.body.dataset
      .globalNavBound === 'true'
  ){
    return;
  }

  document.body.dataset
    .globalNavBound = 'true';

  document.addEventListener(
    'click',
    function(event){

      const desktop =
        event.target.closest(
          '[data-global-nav]'
        );

      const mobile =
        event.target.closest(
          '[data-mobile-nav]'
        );

      const item =
        desktop || mobile;

      if(!item){
        return;
      }

      switch(

        item.dataset.globalNav ||
        item.dataset.mobileNav

      ){

        case 'dashboard':

          BeganPwaBridge.open(
            'https://www.barkahgarment.com/began-partner-dashboard-dev'
          );

          break;

        case 'forum':

          BeganDeepLink.open(
            '/forum/'
          );

          break;

        case 'updates':

          BeganDeepLink.open(
            '/notifications/'
          );

          break;

        case 'reserve':

          BeganPwaBridge.open(
            'https://www.barkahgarment.com/reserve-system'
          );

          break;

      }

    }

  );

}
