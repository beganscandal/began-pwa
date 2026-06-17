window.BeganDeepLink = (function(){

  function forumPost(postId){
    return '/forum/post/?postId=' + encodeURIComponent(postId);
  }

  function normalize(url){
    if(!url){
      return '/notifications/';
    }

    try{
      const parsed = new URL(url, location.origin);

      if(parsed.origin !== location.origin){
        return '/notifications/';
      }

      return parsed.pathname + parsed.search + parsed.hash;
    }catch(err){
      return '/notifications/';
    }
  }

  function open(url){
    window.location.href = normalize(url);
  }

  return {
    forumPost,
    normalize,
    open
  };

})();
