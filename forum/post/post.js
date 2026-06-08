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
      
      const post =
  data.post;

document
  .getElementById(
    'post-detail'
  )
  .innerHTML = `

    <h1>
      ${post.title}
    </h1>

    <p>
      ${post.toko}
    </p>

    <p>
      ${post.content}
    </p>

    <div>
      ❤️ ${post.likeCount}
      💬 ${post.replyCount}
    </div>

  `;


    } catch(err) {

      console.error(err);

    }

  }
);

