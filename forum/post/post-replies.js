let selectedReplyImageUrl = '';

let selectedReplyVideoUrl = '';

let selectedReplyImageFile = null;

let selectedReplyVideoFile = null;

let selectedInlineImageFile = null;

let selectedInlineVideoFile = null;

let selectedInlineImageUrl = '';

let selectedInlineVideoUrl = '';

let selectedMentionToko = '';

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
        

bindInlineReplyComposer();

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

            if(

    !content &&
    !selectedReplyImageFile &&
    !selectedReplyVideoFile

){

    return;

}
            btn.disabled = true;
            const originalText =
    btn.textContent;

btn.textContent =
    'Sending...';

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

   selectedReplyImageUrl =
    upload.fileUrl;

}

if(selectedReplyVideoFile){

    const base64 =
        await fileToBase64(
            selectedReplyVideoFile
        );

    const upload =
        await uploadReplyVideo({

            fileName:
                selectedReplyVideoFile.name,

            mimeType:
                selectedReplyVideoFile.type,

            base64:
                base64.split(',')[1]

        });

    selectedReplyVideoUrl =
        upload.videoUrl;

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
                btn.textContent =
        originalText;


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
function bindInlineReplyComposer(){

    document
        .querySelectorAll(
            '.reply-inline-btn'
        )
        .forEach(

            function(btn){

                btn.onclick =
                    function(){

                        const toko =
                            btn.dataset.toko;

                        const replyId =
                            btn.dataset.replyId;

                        if(
                            !toko ||
                            !replyId
                        ){

                            return;

                        }
                        selectedInlineImageFile = null;

selectedInlineVideoFile = null;

selectedInlineImageUrl = '';

selectedInlineVideoUrl = '';

                        document
                            .querySelectorAll(
                                '.reply-inline-root'
                            )
                            .forEach(

                                function(root){

                                    root.innerHTML =
                                        '';

                                }

                            );

                        const root =
                            document.getElementById(

                                'reply-inline-' +
                                replyId

                            );
                        
                        if(!root){

                            return;

                        }

                        root.innerHTML =

                            renderInlineComposer(

                                toko,
                                replyId

                            );
                        bindInlineReplySubmit(
                            root
                        );
                        bindInlineImagePicker();
                        bindInlineVideoPicker();

                    };

            }

        );

}

function bindInlineImagePicker(){

    document
        .querySelectorAll(
            '.reply-inline-image-btn'
        )
        .forEach(

            function(btn){

                btn.onclick =
                    function(){

                        const composer =
                            btn.closest(
                                '.reply-inline-composer'
                            );

                        if(!composer){

                            return;

                        }

                        composer
                            .querySelector(
                                '.reply-inline-image-input'
                            )
                            ?.click();

                    };

            }

        );

    document
        .querySelectorAll(
            '.reply-inline-image-input'
        )
        .forEach(

            function(input){

                input.onchange =
                    function(e){

                        const file =
                            e.target.files[0];

                        if(!file){

                            return;

                        }

                        selectedInlineImageFile =
                            file;

                        const composer =
                            input.closest(
                                '.reply-inline-composer'
                            );

                        const preview =
                            composer?.querySelector(
                                '.reply-inline-preview'
                            );

                        if(!preview){

                            return;

                        }

                        const url =
                            URL.createObjectURL(
                                file
                            );

                        preview.innerHTML = `

                            <div class="reply-preview-card">

                                <img
                                    class="reply-preview-image"
                                    src="${url}"
                                >

                                <button
                                    class="remove-inline-media"
                                    type="button"
                                >

                                    ✕

                                </button>

                            </div>

                        `;
                        bindInlineRemoveMedia();

                    };

            }

        );

}
function bindInlineVideoPicker(){

    document
        .querySelectorAll(
            '.reply-inline-video-btn'
        )
        .forEach(

            function(btn){

                btn.onclick =
                    function(){

                        const composer =
                            btn.closest(
                                '.reply-inline-composer'
                            );

                        if(!composer){

                            return;

                        }

                        composer
                            .querySelector(
                                '.reply-inline-video-input'
                            )
                            ?.click();

                    };

            }

        );

    document
        .querySelectorAll(
            '.reply-inline-video-input'
        )
        .forEach(

            function(input){

                input.onchange =
                    function(e){

                        const file =
                            e.target.files[0];

                        if(!file){

                            return;

                        }

                        selectedInlineVideoFile =
                            file;

                        const composer =
                            input.closest(
                                '.reply-inline-composer'
                            );

                        const preview =
                            composer?.querySelector(
                                '.reply-inline-preview'
                            );

                        if(!preview){

                            return;

                        }

                        const url =
                            URL.createObjectURL(
                                file
                            );

                        preview.innerHTML = `

                            <div class="reply-preview-card">

                                <video
                                    class="
                                        reply-preview-video
                                    "
                                    controls
                                    src="${url}"
                                ></video>

                                <button
                                    class="
                                        remove-inline-media
                                    "
                                    type="button"
                                >

                                    ✕

                                </button>

                            </div>

                        `;
                        bindInlineRemoveMedia();

                    };

            }

        );

}
function bindInlineRemoveMedia(){

    document
        .querySelectorAll(
            '.remove-inline-media'
        )
        .forEach(

            function(btn){

                btn.onclick =
                    function(){

                        const composer =
                            btn.closest(
                                '.reply-inline-composer'
                            );

                        if(!composer){

                            return;

                        }

                        const preview =
                            composer.querySelector(
                                '.reply-inline-preview'
                            );

                        if(preview){

                            preview.innerHTML = '';

                        }

                        selectedInlineImageFile =
                            null;

                        selectedInlineVideoFile =
                            null;

                        selectedInlineImageUrl =
                            '';

                        selectedInlineVideoUrl =
                            '';

                        const imageInput =
    composer.querySelector(
        '.reply-inline-image-input'
    );

if(imageInput){

    imageInput.value = '';

}
                       const videoInput =
    composer.querySelector(
        '.reply-inline-video-input'
    );

if(videoInput){

    videoInput.value = '';

}

                    };

            }

        );

}

function bindInlineReplySubmit(
    root
){

    const btn =
        root.querySelector(
            '.reply-inline-submit-btn'
        );

    if(!btn){

        return;

    }

    btn.onclick =
        async function(){

            if(btn.disabled){

                return;

            }

            const composer =
                btn.closest(
                    '.reply-inline-composer'
                );

            if(!composer){

                return;

            }

            const textarea =
                composer.querySelector(
                    '.reply-inline-input'
                );

            const content =
                textarea?.value.trim();

           if(

    !content &&
    !selectedInlineImageFile &&
    !selectedInlineVideoFile

){

    return;

}

            btn.disabled = true;

            const originalText =
                btn.textContent;

            btn.textContent =
                'Sending...';

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
        
            if(selectedInlineImageFile){

    const base64 =

        await fileToBase64(

            selectedInlineImageFile

        );

    const upload =

        await uploadReplyImage({

            fileName:
                selectedInlineImageFile.name,

            mimeType:
                selectedInlineImageFile.type,

            base64:
                base64
                    .split(',')[1]

        });

    selectedInlineImageUrl =

        upload.fileUrl;
}                    
                
    if(selectedInlineVideoFile){

    const base64 =

        await fileToBase64(

            selectedInlineVideoFile

        );

    const upload =

        await uploadReplyVideo({

            fileName:
                selectedInlineVideoFile.name,

            mimeType:
                selectedInlineVideoFile.type,

            base64:
                base64
                    .split(',')[1]

        });

    selectedInlineVideoUrl =

        upload.videoUrl;

}

                await createReply({

                    postId:
                        new URLSearchParams(
                            location.search
                        ).get(
                            'postId'
                        ),

                    partnerId:
                        partner.id,

                    toko:
                        partner.toko,

                    partnerName:
                        partner.toko,

                    content:
                        content,
                  
                    imageUrl: 
                selectedInlineImageUrl,

                    videoUrl:
                selectedInlineVideoUrl

                });

                
            selectedInlineImageFile =
            null;

            selectedInlineVideoFile =
            null;

            selectedInlineImageUrl =
            '';

            selectedInlineVideoUrl =
            '';
                await loadReplies(

                    new URLSearchParams(
                        location.search
                    ).get(
                        'postId'
                    )

                );

            }catch(err){

                console.error(
                    err
                );

            }finally{

                btn.disabled =
                    false;

                btn.textContent =
                    originalText;

            }

        };

}
window.loadReplies =
    loadReplies;

window.bindReplySubmit =
    bindReplySubmit;
