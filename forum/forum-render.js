function renderPosts(posts) {

  const feed =
    document.getElementById('forum-feed');

  if (!feed) {
    console.error('forum-feed not found');
    return;
  }

  feed.innerHTML = posts.map(post => `
    <div class="forum-post">
      <div class="forum-post-header">
        <strong>${post.partnerName}</strong>
      </div>

      <h3>${post.title}</h3>

      <p>${post.content}</p>

      <small>${post.category}</small>
    </div>
  `).join('');

}

function renderBoardPosts(posts) {

  const feed =
    document.getElementById('dynamic-feed');

  if (!feed) {
    console.error('dynamic-feed not found');
    return;
  }

  feed.innerHTML = posts.map(post => `
    <div class="forum-card">

      <div class="forum-author">
        ${post.partnerName}
      </div>

      <div class="forum-category">
        ${post.category}
      </div>

      <h3>
        ${post.title}
      </h3>

      <p>
        ${post.content}
      </p>

    </div>
  `).join('');

}
