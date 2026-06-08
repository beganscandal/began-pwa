(function(window){

'use strict';

async function getPost(postId){

    return ForumAPI.getPost(postId);

}

window.getPost = getPost;

})(window);
