document.addEventListener(
  'DOMContentLoaded',
  async function() {

    try {

      const data =
        await getBoard();

      console.log('DATA', data);

      renderPosts(data.posts);

initPostNavigation();

bindPostSubmit();

    } catch(err) {

      console.error(err);

    }

  }
);

function initPostNavigation() {

  const feed =
    document.getElementById(
      'dynamic-feed'
    );

  if (!feed) return;

  feed.addEventListener(
    'click',
    function(e){

      const card =
        e.target.closest(
          '.forum-card'
        );

      if (!card) return;

     const postId =
  card.dataset.postId;

window.location.href =
  '/forum/post/?postId=' +
  encodeURIComponent(postId);      

    }
  );

}
