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

function renderPostMedia(post) {

    const mediaUrl =
        post.image ||
        post.imageUrl ||
        post.mediaUrl ||
        '';

    if (!mediaUrl) {
        return '';
    }

    return `
        <div class="post-media">
            <img
                class="post-image"
                src="${mediaUrl}"
                alt=""
            >
        </div>
    `;
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

      ${renderReplyFeed()}

    </main>
  `;
}

function renderHeader() {
  return `
    <header class="post-header">

      <button
        class="post-back-btn"
        onclick="history.back()"
      >
        <i class="fas fa-arrow-left"></i>
      </button>

      <h1 class="post-header-title">
        Partner Discussion
      </h1>

      <button class="post-menu-btn">
        <i class="fas fa-ellipsis-v"></i>
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
        ${escapeHtml(post.content)}
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
function renderActionBar(post) {

  return `
    <section class="post-action-bar">

      <button
        class="action-btn"
        data-action="like"
      >
        ❤️
        <span>Like</span>
      </button>

      <button
        class="action-btn"
        data-action="reply"
      >
        💬
        <span>Reply</span>
      </button>

      <button
        class="action-btn"
        data-action="share"
      >
        ↗
        <span>Share</span>
      </button>

    </section>
  `;
}
function renderReplyComposer() {

  return `
    <section class="reply-composer">

      <div class="reply-composer-avatar">
        B
      </div>

      <div class="reply-composer-body">

        <textarea
          id="reply-input"
          class="reply-input"
          placeholder="Write your reply..."
        ></textarea>

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

function renderReplyFeed() {

  return `
    <section id="reply-list">

      <div class="reply-loading">

        Loading replies...

      </div>

    </section>
  `;
}
