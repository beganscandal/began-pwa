let selectedImageUrl = '';
let selectedVideoUrl = '';

let isUploadingImage = false;
let isUploadingVideo = false;

document.addEventListener(
  'DOMContentLoaded',
  async function() {

    if(window.lucide){
      lucide.createIcons();
    }

    try {

      const data =
        await getBoard();

      renderPosts(data.posts);

      initPostNavigation();

      bindPostImagePicker();
      bindPostVideoPicker();

      bindPostSubmit();

    } catch(err) {

      console.error(err);

    }

  }
);
function initPostNavigation() {

  const feed =
    document.getElementById(
      'dynamic-feed'
    );

  if (!feed) return;

  feed.addEventListener(
    'click',
    function(e){

      const card =
        e.target.closest(
          '.forum-card'
        );

      if (!card) return;

     const postId =
  card.dataset.postId;

window.location.href =
  '/forum/post/?postId=' +
  encodeURIComponent(postId);      

    }
  );

}

function bindPostSubmit(){

  const btn =
    document.getElementById(
      'post-btn'
    );

  if(!btn){
    return;
  }

  btn.addEventListener(
    'click',
    async function(){

      const content =
        document
          .getElementById(
            'post-content'
          )
          .value
          .trim();

      const category =
        document
          .getElementById(
            'post-category'
          )
          .value;

      if(!content){
        return;
      }

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

  console.error(
    'BEGAN PARTNER SESSION',
    partner
  );

  console.error(
    'RAW STORAGE',
    localStorage.getItem(
      'began_partner'
    )
  );

  alert(
    'Partner session tidak ditemukan'
  );

  return;
}
      btn.disabled = true;

      try{

       await createPost({

  partnerId:
    partner.id,

  toko:
    partner.toko,

  partnerName:
    partner.toko,

  category:
    category,

  content:
    content,

  imageUrl:
    selectedImageUrl,

  videoUrl:
    selectedVideoUrl

});
        location.reload();

      }catch(err){

        console.error(err);

      }finally{

        btn.disabled = false;

      }

    }
  );

}
function bindPostImagePicker(){

  const btn =
    document.getElementById(
      'post-image-btn'
    );

  const input =
    document.getElementById(
      'post-image-input'
    );

  const postBtn =
    document.getElementById(
      'post-btn'
    );

  if(
    !btn ||
    !input ||
    !postBtn
  ){
    return;
  }

  btn.addEventListener(
    'click',
    function(){

      input.click();

    }
  );

  input.addEventListener(
    'change',
    async function(){

      const file =
        input.files[0];

      if(!file){
        return;
      }

      const previewUrl =
        URL.createObjectURL(
          file
        );

      isUploadingImage = true;

      postBtn.disabled = true;

      renderPreview(

        `
        <img
          src="${previewUrl}"
          class="post-preview-image"
        >
        `,

        'Mengunggah gambar...',

        'uploading'

      );

      try{

        const base64 =
          await fileToBase64(
            file
          );

        const result =
          await uploadPostImage({

            fileName:
              file.name,

            mimeType:
              file.type,

            base64:
              base64

          });

        selectedImageUrl =
          result.imageUrl;

        isUploadingImage = false;

        renderPreview(

          `
          <img
            src="${previewUrl}"
            class="post-preview-image"
          >
          `,

          '✓ Gambar siap diposting',

          'success'

        );

        if(
          !isUploadingVideo
        ){

          postBtn.disabled =
            false;

        }

      }catch(err){

        isUploadingImage = false;

        renderPreview(

          '',

          '✕ Upload gambar gagal',

          'error'

        );

        postBtn.disabled =
          false;

        console.error(
          'UPLOAD IMAGE',
          err
        );

      }

    }
  );

}
function bindPostVideoPicker(){

  const btn =
    document.getElementById(
      'post-video-btn'
    );

  const input =
    document.getElementById(
      'post-video-input'
    );

  if(
    !btn ||
    !input
  ){
    return;
  }

  btn.addEventListener(
    'click',
    function(){

      input.click();

    }
  );

  input.addEventListener(
    'change',
    async function(){

      const file =
        input.files[0];

      if(!file){
        return;
      }

      try{

        const base64 =
          await fileToBase64(
            file
          );

        const result =
          await uploadPostVideo({

            fileName:
              file.name,

            mimeType:
              file.type,

            base64:
              base64

          });

        selectedVideoUrl =
          result.videoUrl;

        console.log(
          'VIDEO URL',
          selectedVideoUrl
        );

      }catch(err){

        console.error(
          'UPLOAD VIDEO',
          err
        );

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
              .split(',')[1]
          );

        };

      reader.onerror =
        reject;

      reader.readAsDataURL(file);

    }
  );

}

function renderPreview(
  html,
  status,
  statusClass
){

  document
    .getElementById(
      'post-media-preview'
    )
    .innerHTML = `

      <div class="preview-card">

        ${html}

        <div
          class="
            preview-status
            ${statusClass}
          "
        >
          ${status}
        </div>

      </div>

    `;

}
