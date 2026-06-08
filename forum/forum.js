document.addEventListener(
  'DOMContentLoaded',
  async function() {

    try {

      const data =
        await getBoard();
      console.log('DATA', data);
      
      renderPosts(data.posts);

    } catch(err) {

      console.error(err);

    }

  }
);
