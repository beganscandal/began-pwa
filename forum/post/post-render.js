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


function renderPostMedia(post){

    const mediaUrl =
        post.image ||
        post.imageUrl ||
        post.mediaUrl ||
        '';

    return `
        <div class="post-media-container">

            ${
                mediaUrl
                ? `
                <img
                    class="post-image"
                    src="${mediaUrl}"
                    alt=""
                >
                `
                : `
                <div class="post-media-placeholder">

                    No Media

                </div>
                `
            }

        </div>
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
                ${escapeHtml(reply.content)}
            </div>

            ${renderReplyMedia(reply)}

            <div class="reply-actions">

                <button class="reply-action-btn">
                    ❤️ ${reply.likeCount || 0}
                </button>

                <button class="reply-action-btn">
                    ↩ Reply
                </button>

            </div>

        </article>
    `;
}
function renderReplyMedia(reply){

    const mediaUrl =
        reply.image ||
        reply.imageUrl ||
        reply.mediaUrl ||
        '';

    if(!mediaUrl){
        return '';
    }

    return `
        <div class="reply-media">
            <img
                class="reply-image"
                src="${mediaUrl}"
                alt=""
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

window.renderPostPage =
    renderPostPage;

window.renderPostSkeleton =
    renderPostSkeleton;

window.renderReplyFeed =
    renderReplyFeed;

window.renderReplySkeleton =
    renderReplySkeleton;
