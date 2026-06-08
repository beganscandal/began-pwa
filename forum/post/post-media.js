(function(window){

'use strict'; 

function renderPostMedia(post){

    if(!post.mediaUrl){
        return '';
    }

    return `
        <img
            class="post-image"
            src="${post.mediaUrl}"
            alt=""
        >
    `;
}

window.renderPostMedia = renderPostMedia;

})(window); 
