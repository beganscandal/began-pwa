document.addEventListener(
  'DOMContentLoaded',
  async function() {

    try {

      const params =
        new URLSearchParams(
          window.location.search
        );

      const postId =
        params.get('id');

      console.log(
        'POST ID:',
        postId
      );

      const data =
        await getPost(postId);

      console.log(
        'POST DATA:',
        data
      );
      
      const post = data.post;

document
  .getElementById('post-detail')
  .innerHTML = `

<div class="post-page">

  <div class="post-header">

    <div class="post-avatar">
      ${(post.partnerName || '?')
        .charAt(0)}
    </div>

    <div>

      <div class="post-author">
        ${post.toko}
      </div>

      <div class="post-category">
        ${post.category}
      </div>

    </div>

  </div>

  <h1 class="post-title">
    ${post.title}
  </h1>

  <div class="post-content">
    ${post.content}
  </div>

  <div class="post-actions">

    <button
      id="like-btn"
      data-post-id="${post.postId}">
      ❤️ ${post.likeCount}
    </button>

    <span>
      💬 ${post.replyCount}
    </span>

  </div>

  <hr>

  <div id="reply-composer">

    Reply composer
    (next step)

  </div>

  <div id="reply-list">

    Reply list
    (next step)

  </div>

</div>

`; 

    } catch(err) {

      console.error(err);

    }

  }
);

