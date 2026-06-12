
function getInitials(name) {

    if (!name) return '?';

   return name
        .trim()
        .split(' ')
        .map(function(word){
            return word.charAt(0);
        })
        .join('')
        .substring(0, 2)
        .toUpperCase();

}
function escapeHtml(str) {

    if (str == null) return '';

    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

}


function renderPostPage(post) {

  return `

    ${renderHeader()}

    <main class="post-page-content">

      ${renderPostCard(post)}

      ${renderActionBar(post)}

      ${renderReplyComposer()}

      <div id="reply-feed-root">

        ${renderReplySkeleton()}

      </div>

    </main>

  `;

}


function bindImagePicker(){

    const btn =
        document.getElementById(
            'reply-image-btn'
        );

    const input =
        document.getElementById(
            'reply-image-input'
        );

    const preview =
        document.getElementById(
            'reply-media-preview'
        );

    if(!btn || !input || !preview){

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
        function(e){

            const file =
                e.target.files[0];

            if(!file){

                return;

            }

            selectedReplyImageFile =
                file;

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
            class="remove-reply-media"
            type="button"
        >

            ✕

        </button>

    </div>

`;
                 }
    );

}
          
function bindReplyPreviewActions(){

    const preview =
        document.getElementById(
            'reply-media-preview'
        );

    if(!preview){

        return;

    }

    preview.addEventListener(
        'click',
        function(e){

            const removeBtn =
                e.target.closest(
                    '.remove-reply-media'
                );

            if(!removeBtn){

                return;

            }

            selectedReplyImageFile =
                null;

            document.getElementById(
                'reply-image-input'
            ).value = '';

            preview.innerHTML = '';

        }
    );

}

function bindVideoPicker(){

    const btn =
        document.getElementById(
            'reply-video-btn'
        );

    const input =
        document.getElementById(
            'reply-video-input'
        );

    const preview =
        document.getElementById(
            'reply-media-preview'
        );

    if(!btn || !input || !preview){
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
        function(e){

            const file =
                e.target.files[0];

            if(!file){

                return;

            }

            selectedReplyVideoFile =
                file;

            const url =
                URL.createObjectURL(
                    file
                );

            preview.innerHTML = `

                <div class="reply-preview-card">

                    <video
                        class="reply-preview-video"
                        controls
                        src="${url}"
                    >
                    </video>

                    <button
                        class="remove-reply-media"
                        type="button"
                    >

                        ✕

                    </button>

                </div>

            `;

        }
    );

}
function renderHeader(){

    return `

        <header class="post-header">

            <button
                class="post-back-btn"
                onclick="
                    if(history.length > 1){

                        history.back();

                    }else{

                        location.href='/forum/';

                    }
                "
            >

                ←

            </button>

            <h1 class="post-header-title">

                Partner Discussion

            </h1>

            <button
                class="post-menu-btn"
                onclick="
                    togglePostMenu();
                "
            >

                ☰

            </button>

        </header>

    `;

}
function renderPostCard(post) {

  return `
    <article class="post-card">

      <div class="post-author">

        <div class="post-avatar">
          ${getInitials(post.toko)}
        </div>

        <div class="post-author-meta">

          <div class="post-author-name">
            ${escapeHtml(post.toko)}
          </div>

          <div class="post-category-badge">
            ${escapeHtml(post.category || 'DISCUSSION')}
          </div>

        </div>

      </div>

      <h2 class="post-title">
        ${escapeHtml(post.title)}
      </h2>

      <div class="post-content">
  ${
    escapeHtml(
      post.content
    ).replace(
      /\n/g,
      '<br>'
    )
  }
</div>

      ${renderPostMedia(post)}

      <div class="post-meta">

        <span>
          ❤️ ${post.likeCount || 0}
        </span>

        <span>
          💬 ${post.replyCount || 0}
        </span>

        <span>
          👁 ${post.viewCount || 0}
        </span>

      </div>

    </article>
  `;
}


function renderPostMedia(post){

  if(post.videoUrl){

    const iframeUrl =
      post.videoUrl.includes(
        '/preview'
      )
      ? post.videoUrl
      : post.videoUrl.replace(

          'https://drive.google.com/uc?export=view&id=',

          'https://drive.google.com/file/d/'

        ) + '/preview';

    return `

      <div
        class="
          post-media-container
        "
      >

        <iframe

          class="
            post-video
          "

          src="${iframeUrl}"

          allowfullscreen

          loading="lazy"

        >
        </iframe>

      </div>

    `;

  }

  const imageUrl =
    post.image ||
    post.imageUrl ||
    post.mediaUrl ||
    '';

  if(!imageUrl){

    return '';

  }

  return `

    <div
      class="
        post-media-container
      "
    >

      <img

        class="
          post-image
        "

        src="${imageUrl}"

      >

    </div>

  `;

}

function renderActionBar(post) {

  return `

    <section class="post-action-bar">

      <button
        class="action-btn"
        id="post-like-btn"
        data-post-id="${post.postId}"
      >

        ❤️

        <span>

          ${post.likeCount || 0}

        </span>

      </button>

      <button
        class="action-btn"
        id="post-reply-btn"
      >

        💬

        <span>

          Reply

        </span>

      </button>

      <button
        class="action-btn"
        id="post-share-action-btn"
      >

        ↗

        <span>

          Share

        </span>

      </button>

    </section>

  `;

}

function renderReplyComposer() {

  return `
    <section
    class="reply-composer"
    id="reply-composer-root"
>

      ${
        (() => {

          const partner =
            JSON.parse(
              localStorage.getItem(
                'began_partner'
              ) || '{}'
            );

          return `

            <div
              class="
                reply-composer-avatar
              "
            >

              ${
                getInitials(
                  partner.toko
                )
              }

            </div>

          `;

        })()
      }

      <div class="reply-composer-body">

        <textarea
          id="reply-input"
          class="reply-input"
          placeholder="Write your reply..."
        ></textarea>

        <input
          id="reply-image-input"
          type="file"
          accept="image/*"
          hidden
        >

        <input
          id="reply-video-input"
          type="file"
          accept="video/*"
          hidden
        >

        <div
          id="reply-media-preview"
          class="reply-media-preview"
        ></div>

        <div class="reply-toolbar">

          <div class="reply-toolbar-left">

            <button
              id="reply-image-btn"
              type="button"
            >
              🖼
            </button>

            <button
              id="reply-video-btn"
              type="button"
            >
              🎥
            </button>

          </div>

          <button
            id="reply-submit-btn"
            class="reply-submit-btn"
          >
            Send
          </button>

        </div>

      </div>

    </section>
  `;
}

function renderInlineComposer(
    toko,
    replyId
){

    return `

        <section
    class="
        reply-composer
        reply-inline-composer
    "
    data-reply-id="${replyId}"
    data-toko="${escapeHtml(toko)}"
>

            <div
                class="
                    reply-composer-avatar
                "
            >

                ${
                    getInitials(
                        JSON.parse(
                            localStorage.getItem(
                                'began_partner'
                            ) || '{}'
                        ).toko
                    )
                }

            </div>

            <div
                class="
                    reply-composer-body
                "
            >

                <textarea

                    class="
                        reply-input
                        reply-inline-input
                    "

                    placeholder="
                        Write your reply...
                    "

                >@${escapeHtml(toko)} </textarea>

                <input

                    class="
                        reply-inline-image-input
                    "

                    type="file"

                    accept="image/*"

                    hidden

                >

                <input

                    class="
                        reply-inline-video-input
                    "

                    type="file"

                    accept="video/*"

                    hidden

                >

                <div

                    class="
                        reply-media-preview
                        reply-inline-preview
                    "

                ></div>

                <div
                    class="
                        reply-toolbar
                    "
                >

                    <div
                        class="
                            reply-toolbar-left
                        "
                    >

                        <button

                            class="
                                reply-inline-image-btn
                            "

                            type="button"
                        >

                            🖼

                        </button>

                        <button

                            class="
                                reply-inline-video-btn
                            "

                            type="button"
                        >

                            🎥

                        </button>

                    </div>

                    <button

                        class="
                            reply-submit-btn
                            reply-inline-submit-btn
                        "

                        data-reply-id="${replyId}"

                        data-toko="${escapeHtml(toko)}"

                    >

                        Send

                    </button>

                </div>

            </div>

        </section>

    `;

}
function renderReplyFeed(replies) {

    replies = replies || [];

    if (!replies.length) {

        return `
            <section class="reply-feed">

                <div class="reply-feed-title">
    Replies (${replies.length})
</div>

                ${renderEmptyState()}

            </section>
        `;
    }

    return `
        <section class="reply-feed">

            <div class="reply-feed-title">
                Replies (${replies.length})
            </div>

            ${replies
                .map(renderReplyCard)
                .join('')}

        </section>
    `;
}

function renderReplyCard(reply) {

    return `
        <article class="reply-card">

            <div class="reply-card-header">

                <div class="reply-avatar">
                    ${getInitials(reply.toko)}
                </div>

                <div class="reply-info">

                    <div class="reply-name">
                        ${escapeHtml(reply.toko)}
                    </div>

                    <div class="reply-time">
                        ${escapeHtml(
                            reply.createdAt || ''
                        )}
                    </div>

                </div>

            </div>

            <div class="reply-text">
    ${
      formatMentions(

        reply.content

      ).replace(

        /\n/g,

        '<br>'

      )
    }
</div>
           
            ${renderReplyMedia(reply)}

            <div class="reply-actions">

                <button class="reply-action-btn">
                    ❤️ ${reply.likeCount || 0}
                </button>

              <button
    class="
        reply-action-btn
        reply-inline-btn
    "
    data-toko="${escapeHtml(reply.toko)}"
    data-reply-id="${reply.replyId}"
>
    ↩ Reply
</button>

            </div>
            <div
    class="reply-inline-root"
    id="reply-inline-${reply.replyId}"
></div>

        </article>
    `;
}

function renderReplyMedia(reply){

    if(reply.videoUrl){

        const iframeUrl =

            reply.videoUrl.includes(
                '/preview'
            )

            ? reply.videoUrl

            : reply.videoUrl.replace(

                'https://drive.google.com/uc?export=view&id=',

                'https://drive.google.com/file/d/'

              ) + '/preview';

        return `

            <div class="reply-media">

                <iframe

                    class="reply-video"

                    src="${iframeUrl}"

                    loading="lazy"

                    allowfullscreen

                >
                </iframe>

            </div>

        `;

    }

    const imageUrl =

        reply.image ||

        reply.imageUrl ||

        reply.mediaUrl ||

        '';

    if(!imageUrl){

        return '';

    }

    return `

        <div class="reply-media">

            <img

                class="reply-image"

                src="${imageUrl}"

                loading="lazy"

            >

        </div>

    `;

}
function renderEmptyState() {

    return `
        <section class="reply-empty">

            <div class="reply-empty-icon">
                💬
            </div>

            <div class="reply-empty-title">
                No replies yet
            </div>

            <div class="reply-empty-subtitle">
                Be the first partner to contribute
            </div>

        </section>
    `;
}


function renderPostSkeleton() {

    return `
        
        <section class="post-skeleton">
        

            <div class="post-skeleton-card">

                <div class="skeleton-row">

                    <div class="skeleton skeleton-avatar"></div>

                    <div class="skeleton-user">

                        <div class="skeleton skeleton-name"></div>

                        <div class="skeleton skeleton-badge"></div>

                    </div>

                </div>

                <div class="skeleton skeleton-title"></div>

                <div class="skeleton skeleton-content"></div>

                <div class="skeleton skeleton-content short"></div>

                <div class="skeleton skeleton-image"></div>

            </div>
       
        </section>
    `;
}

function renderReplySkeleton() {

    return `
        <section class="reply-skeleton-list">

            ${renderSingleReplySkeleton()}
            ${renderSingleReplySkeleton()}
            ${renderSingleReplySkeleton()}

        </section>
    `;
}
function renderSingleReplySkeleton() {

    return `
        <div class="reply-skeleton">

            <div class="skeleton skeleton-avatar"></div>

            <div class="reply-skeleton-body">

                <div class="skeleton skeleton-name"></div>

                <div class="skeleton skeleton-content"></div>

                <div class="skeleton skeleton-content short"></div>

            </div>

        </div>
    `;
}

function bindActionBar(){

    const replyBtn =
        document.getElementById(
            'post-reply-btn'
        );

    if(replyBtn){

        replyBtn.addEventListener(
            'click',
            function(){

                document
                    .getElementById(
                        'reply-input'
                    )
                    ?.focus();

            }
        );

    }

    const shareBtn =
        document.getElementById(
            'post-share-action-btn'
        );

    if(shareBtn){

        shareBtn.addEventListener(
            'click',
            async function(){

                try{

                    if(navigator.share){

                        await navigator.share({

                            title:
                                'BEGAN Discussion',

                            url:
                                location.href

                        });

                    }else{

                        await navigator
                            .clipboard
                            .writeText(
                                location.href
                            );

                        alert(
                            'Link berhasil disalin'
                        );

                    }

                }catch(err){

                    console.error(err);

                }

            }
        );

    }

}
function bindPostLike(){

    const btn =

        document.getElementById(
            'post-like-btn'
        );

    if(!btn){

        return;

    }

    btn.addEventListener(
        'click',
        async function(){

            if(btn.disabled){

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

                const result =

                    await togglePostLike({

                        postId:

                            btn.dataset.postId,

                        partnerId:

                            partner.id

                    });

                btn.querySelector(
                    'span'
                ).textContent =

                    result.likeCount;

            }catch(err){

                console.error(err);

            }finally{

                btn.disabled = false;

            }

        }
    );

} 
window.renderPostPage =
    renderPostPage;

window.renderPostSkeleton =
    renderPostSkeleton;

window.renderReplyFeed =
    renderReplyFeed;

window.renderReplySkeleton =
    renderReplySkeleton;

window.bindActionBar =
    bindActionBar;

window.bindPostLike =
    bindPostLike;

window.bindImagePicker =
    bindImagePicker;

window.bindVideoPicker =
    bindVideoPicker;

window.bindReplyPreviewActions =
    bindReplyPreviewActions;
