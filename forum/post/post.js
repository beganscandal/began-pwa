(function(){

'use strict';

async function init(){

    const root =
        document.getElementById(
            'post-page'
        );

    // tampilkan skeleton dulu
    root.innerHTML =
        renderPostSkeleton();

    try {

        const params =
            new URLSearchParams(
                location.search
            );

        const postId =
            params.get('postId');

        const data =
            await getPost(postId);

        const post =
            data.post || {};

        root.innerHTML =
    renderPostPage(post);

await loadReplies(postId);

bindImagePicker();

bindVideoPicker();

bindReplySubmit(postId);

    } catch(err){

        console.error(err);

        root.innerHTML = `
            <div class="post-error">
                Failed to load discussion
            </div>
        `;

    }

}
    
document.addEventListener(
    'DOMContentLoaded',
    init
);

})();

async function loadReplies(postId){

    const data =
        await getReplies(postId);

    const replies =
        data.replies || [];

    const feed =
        document.querySelector(
            '.reply-feed'
        );

    if(!feed){
        return;
    }

    feed.outerHTML =
        renderReplyFeed(replies);

}

function bindReplySubmit(postId){

    const btn =
        document.getElementById(
            'reply-submit-btn'
        );

    if(!btn){
        return;
    }

    btn.addEventListener(
        'click',
        async function(){

            const input =
                document.getElementById(
                    'reply-input'
                );

            const content =
                input.value.trim();

            if(!content){
                return;
            }

            btn.disabled = true;

            try{

                await createReply({

                    postId:postId,

                    parentReplyId:'',

                    partnerId:'TEST',

                    toko:'TOKO TEST',

                    partnerName:'TOKO TEST',

                    content:content

                });

                input.value = '';

                await loadReplies(postId);

            }catch(err){

                console.error(err);

            }

            btn.disabled = false;

        }
    );

}
