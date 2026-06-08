(function(window){

'use strict';

function renderReplies(replies){

    if(!replies.length){

        return `
            <div class="empty-state">
                No replies yet
            </div>
        `;
    }

    return replies.map(function(reply){

        return `
            <div class="reply-card">
                ${reply.content}
            </div>
        `;

    }).join('');
}

window.renderReplies = renderReplies;

})(window);
