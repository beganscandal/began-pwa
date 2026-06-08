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

    } catch(err) {

      console.error(err);

    }

  }
);
