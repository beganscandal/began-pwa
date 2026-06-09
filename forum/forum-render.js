function renderPosts(posts) {

  const feed =
    document.getElementById('dynamic-feed');

  if (!feed) return;

  feed.innerHTML = posts.map(post => `

   <div
  class="forum-card"
  data-post-id="${post.postId}">

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

${
  post.imageUrl
  ? `
  <div class="forum-media">
    <img
      src="${post.imageUrl}"
      alt="Post Image"
      class="forum-media-image"
      loading="lazy"
    >
  </div>
  `
  : ''
}

${
  post.videoUrl
  ? `
  <div class="forum-media">
    <video
      class="forum-media-video"
      controls
      preload="metadata"
    >
      <source
        src="${post.videoUrl}"
        type="video/mp4">
    </video>
  </div>
  `
  : ''
}

<div class="forum-actions">
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
