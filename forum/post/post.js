(async function(){

  const params =
    new URLSearchParams(
      location.search
    );

  const postId =
    params.get('id');

  console.log(
    'POST ID:',
    postId
  );

})();
