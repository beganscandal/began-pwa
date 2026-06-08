(function(){

'use strict';

async function init(){

    const params =
        new URLSearchParams(location.search);

    const postId =
        params.get('postId');

    const post =
        await getPost(postId);

    const root =
        document.getElementById('post-page');

    root.innerHTML =
        renderPostPage(post);

}

document.addEventListener(
    'DOMContentLoaded',
    init
);

})();
