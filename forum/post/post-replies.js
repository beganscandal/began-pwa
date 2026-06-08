async function loadReplies(postId){

    const container =
        document.querySelector(
            '.reply-feed'
        );

    if(!container){
        return;
    }

    container.innerHTML =
        renderReplySkeleton();

    try{

        const data =
            await getReplies(postId);

        container.innerHTML =
            renderReplyFeed(
                data.replies || []
            );

    }catch(err){

        console.error(err);

    }

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

            const textarea =
                document.getElementById(
                    'reply-input'
                );

            const content =
                textarea.value.trim();

            if(!content){
                return;
            }

            btn.disabled = true;

            try{

               const partner =
    JSON.parse(
        localStorage.getItem(
            'began_partner'
        ) || '{}'
    );

await createReply({

    postId:
        postId,

    parentReplyId:
        '',

    partnerId:
        partner.id,

    toko:
        partner.toko,

    partnerName:
        partner.toko,

    content:
        content

});
                textarea.value = '';

                await loadReplies(
                    postId
                );

            }catch(err){

                console.error(err);

            }

            btn.disabled = false;

        }
    );

}
