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
