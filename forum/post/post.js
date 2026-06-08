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

      const data =
        await getPost(postId);

      const post =
        data.post;

      document
      .getElementById('post-page')
      .innerHTML = `

      <div class="post-page">

        <header class="post-header">

          <button id="back-btn">
            ←
          </button>

          <h2>
            Discussion
          </h2>

          <button>
            ⋮
          </button>

        </header>

        <div class="post-body">

          <div class="post-author">

            <div class="post-avatar">
              ${(post.toko || '?')
                .charAt(0)}
            </div>

            <div class="post-meta">

              <div class="post-toko">
                ${post.toko || ''}
              </div>

              <div class="
                post-category
                showcase
              ">
                ${post.category || ''}
              </div>

            </div>

          </div>

          <h1 class="post-title">
            ${post.title || ''}
          </h1>

          <p class="post-content">
            ${post.content || ''}
          </p>

          <div class="post-stats">

            ❤️ ${post.likeCount || 0}

            💬 ${post.replyCount || 0}

          </div>

        </div>

        <div class="post-actions">

          <div
            class="post-action-btn"
            id="like-btn"
            data-post-id="${post.postId}"
          >
            ❤️ Like
          </div>

          <div
            class="post-action-btn"
          >
            💬 Reply
          </div>

        </div>

        <div class="reply-section">

          <div class="reply-title">

            Balasan
            (${post.replyCount || 0})

          </div>

          <div id="reply-list">

            Belum ada balasan

          </div>

        </div>

        <div class="reply-composer">

          <textarea
            class="reply-input"
            placeholder="
              Tulis balasan...
            "
          ></textarea>

          <div class="reply-footer">

            <div>
              📷 🎥
            </div>

            <button
              class="reply-send"
            >
              Kirim
            </button>

          </div>

        </div>

      </div>

      `;

    } catch(err) {

      console.error(err);

    }

  }
);
