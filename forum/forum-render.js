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

      <div
  class="
    forum-open-post
  "
  data-post-id="
    ${post.postId}
  "
>

  <p class="forum-content">

    ${post.content || ''}

  </p>

</div>

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

    <iframe
      class="forum-media-iframe"
      src="${
        post.videoUrl.includes('/preview')
        ? post.videoUrl
        : post.videoUrl.replace(
            'https://drive.google.com/uc?export=view&id=',
            'https://drive.google.com/file/d/'
          ) + '/preview'
      }"
      allow="autoplay"
      allowfullscreen
      loading="lazy"
    >
    </iframe>

  </div>
  `
  : ''
}

<div class="forum-actions">

  <button
    class="forum-like-btn"
    data-post-id="${post.postId}"
  >

    ❤️

    <span class="forum-like-count">

      ${post.likeCount || 0}

    </span>

  </button>

  <button
    class="
      forum-open-post
      forum-reply-btn
    "
    data-post-id="${post.postId}"
  >

    💬

    <span>

      ${post.replyCount || 0}

    </span>

  </button>

  </div>

    
    <button
  class="
    forum-open-post
    forum-reply-btn
  "
  data-post-id="
    ${post.postId}
  "
>

  Lihat Diskusi
  (
    ${post.replyCount || 0}
  )

</button>
</div>


  `).join('');

}
