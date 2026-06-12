let selectedReplyImageUrl = '';

let selectedReplyVideoUrl = '';

let selectedReplyImageFile = null;

let selectedReplyVideoFile = null;

async function loadReplies(postId){

    const container =
        document.getElementById(
            'reply-feed-root'
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

                if(
    !partner.id ||
    !partner.toko
){
    alert(
        'Partner session tidak ditemukan'
    );

    return;
}

if(selectedReplyImageFile){

    const base64 =
        await fileToBase64(
            selectedReplyImageFile
        );

    const upload =
        await uploadReplyImage({

            fileName:
                selectedReplyImageFile.name,

            mimeType:
                selectedReplyImageFile.type,

            base64:
                base64.split(',')[1]

        });

   selectedReplyImageUrl = upload.fileUrl;

}

await createReply({

    postId:
        postId,

    partnerId:
        partner.id,

    toko:
        partner.toko,

    partnerName:
        partner.toko,

    content:
        content,

    imageUrl:
        selectedReplyImageUrl,
       

    videoUrl:
        selectedReplyVideoUrl

});

                textarea.value = '';

selectedReplyImageUrl = '';

selectedReplyVideoUrl = '';

selectedReplyImageFile = null;

selectedReplyVideoFile = null;

const imageInput =
    document.getElementById(
        'reply-image-input'
    );

if(imageInput){

    imageInput.value = '';

}
const preview =
    document.getElementById(
        'reply-media-preview'
    );

if(preview){

    preview.innerHTML = '';

}
                
const videoInput =
    document.getElementById(
        'reply-video-input'
    );

if(videoInput){

    videoInput.value = '';

}
                await loadReplies(
                    postId
                );

            }catch(err){

                console.error(err);

            }finally{

                btn.disabled = false;

            }

        }
    );

}
function fileToBase64(file){

    return new Promise(

        function(resolve,reject){

            const reader =
                new FileReader();

            reader.onload =
                function(){

                    resolve(
                        reader.result
                    );

                };

            reader.onerror =
                reject;

            reader.readAsDataURL(
                file
            );

        }

    );

}


window.loadReplies =
    loadReplies;

window.bindReplySubmit =
    bindReplySubmit;
