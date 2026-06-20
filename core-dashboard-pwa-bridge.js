function getBeganPartnerSession(){

  try{

    return JSON.parse(
      localStorage.getItem('began_partner') || '{}'
    );

  }catch(error){

    return {};

  }

}

function buildBeganPwaUrl(baseUrl){

  const partner =
    getBeganPartnerSession();

  const url =
    new URL(baseUrl);

  if(
    !partner ||
    !partner.id ||
    !partner.toko
  ){
    return url.toString();
  }

  url.searchParams.set(
    'partnerId',
    partner.id
  );

  url.searchParams.set(
    'toko',
    partner.toko
  );

  if(partner.name){
    url.searchParams.set(
      'name',
      partner.name
    );
  }

  if(partner.whatsapp){
    url.searchParams.set(
      'whatsapp',
      partner.whatsapp
    );
  }

  if(partner.tier){
    url.searchParams.set(
      'tier',
      partner.tier
    );
  }

  return url.toString();

}

function openBeganPwaPage(baseUrl){

  window.location.href =
    buildBeganPwaUrl(baseUrl);

}

function setBeganPwaFrame(frame, baseUrl){

  if(!frame){
    return;
  }

  frame.src =
    buildBeganPwaUrl(baseUrl);

}

window.BeganPwaBridge = {
  buildUrl: buildBeganPwaUrl,
  open: openBeganPwaPage,
  setFrame: setBeganPwaFrame
};
