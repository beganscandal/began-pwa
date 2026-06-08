function renderPosts(posts) {

  const feed =
    document.getElementById('dynamic-feed');

  if (!feed) return;

  feed.innerHTML = posts.map(post => `

    <div class="forum-card">

      <div class="forum-card-header">

        <div class="forum-avatar">
          ${(post.partnerName || '?').charAt(0)}
        </div>

        <div class="forum-user">

          <div class="forum-author">
            ${post.partnerName || 'Partner'}
          </div>

          <div class="forum-meta">
            ${post.toko || ''}
          </div>

        </div>

      </div>

      <div class="forum-tag">
        ${post.category || ''}
      </div>

      <h3 class="forum-title">
        ${post.title || ''}
      </h3>

      <p class="forum-content">
        ${post.content || ''}
      </p>

      <div class="forum-actions">

        <span>
          ❤️ ${post.likeCount || 0}
        </span>

        <span>
          💬 ${post.replyCount || 0}
        </span>

      </div>

    </div>

  `).join('');

}
