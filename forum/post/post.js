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

        const data =
            await getPost(
                postId
            );

        const post =
            data.post || {};

        root.innerHTML =
            renderPostPage(
                post
            );

        await loadReplies(
            postId
        );

        bindImagePicker();
         
        bindVideoPicker();

        bindReplyPreviewActions();

        bindReplySubmit(
            postId
        );
        bindReplyMention();
       

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
