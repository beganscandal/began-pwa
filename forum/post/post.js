(function(){

'use strict';

async function init(){

    const root =
        document.getElementById(
            'post-page'
        );

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

        bindReplySubmit(
            postId
        );

    }catch(err){

        console.error(err);

    }

}

document.addEventListener(
    'DOMContentLoaded',
    init
);

})();
