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

    location.href =
        '/forum/';

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
