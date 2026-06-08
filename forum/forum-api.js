const API_URL =
  'https://script.google.com/macros/s/AKfycbxgrLYCtxbHDwRfozT4xBDVBq7JS7c847AkA_pYwNdOoxCNH-9_vnhJgcfLrE1DDAO0rQ/exec';

async function getBoard() {

  const response = await fetch(
    API_URL + '?action=getBoard'
  );

  return response.json();

}

async function getPost(postId) {

  const response = await fetch(
    API_URL +
    '?action=getPost' +
    '&postId=' +
    encodeURIComponent(postId)
  );

  return response.json();

}
