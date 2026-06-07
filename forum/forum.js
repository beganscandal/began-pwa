document.addEventListener(
  'DOMContentLoaded',
  async function() {

    try {

      const data =
        await getBoard();

      renderPosts(data.posts);

    } catch(err) {

      console.error(err);

    }

  }
);
