(function(){

'use strict';

function closeMobileNav(){

  const menu =
    document.querySelector(
      '.mobile_menu'
    );

  if(menu){

    menu.classList.remove(
      'active'
    );

  }

}

function gotoDashboard(e){

  e.preventDefault();

  closeMobileNav();

  location.href =
'https://www.barkahgarment.com/began-partner-dashboard-dev';

}

function gotoReserve(e){

  e.preventDefault();

  closeMobileNav();

  window.BeganPwaBridge.open(

'https://www.barkahgarment.com/reserve-system'

  );

}

function gotoForum(e){

  e.preventDefault();

  closeMobileNav();

  window.BeganPwaBridge.open(

'https://pwa.barkahgarment.com/forum/'

  );

}

function gotoNotification(e){

  e.preventDefault();

  closeMobileNav();

  window.BeganPwaBridge.open(

'https://pwa.barkahgarment.com/notifications/index.html'

  );

}

function gotoContact(e){

  e.preventDefault();

  closeMobileNav();

  window.open(

'https://wa.me/6285759709855?text=Halo%20BEGAN',

'_blank'

  );

}

document
.querySelectorAll('.nav-dashboard')
.forEach(btn=>{

btn.addEventListener(
'click',
gotoDashboard
);

});

document
.querySelectorAll('.nav-reserve')
.forEach(btn=>{

btn.addEventListener(
'click',
gotoReserve
);

});

document
.querySelectorAll('.nav-forum')
.forEach(btn=>{

btn.addEventListener(
'click',
gotoForum
);

});

document
.querySelectorAll('.nav-notification')
.forEach(btn=>{

btn.addEventListener(
'click',
gotoNotification
);

});

document
.querySelectorAll('.nav-contact')
.forEach(btn=>{

btn.addEventListener(
'click',
gotoContact
);

});

})();
/* ==========================================
   BEGAN INTERNAL QA ACCESS
   NAVIGATION ONLY FOR BGN-250 / ADMIN1
========================================== */

const INTERNAL_QA_IDS = [
  'BGN-250'
];

const INTERNAL_QA_STORES = [
  'ADMIN1'
];

function getPartnerSession(){

  try{

    return JSON.parse(
      localStorage.getItem(
        'began_partner'
      ) || '{}'
    );

  }catch(error){

    return {};

  }

}

const partner =
  getPartnerSession();

const partnerId =
  String(
    partner.id || ''
  )
  .trim()
  .toUpperCase();

const partnerStore =
  String(
    partner.toko || ''
  )
  .trim()
  .toUpperCase();

const HAS_NAV_ACCESS =

  INTERNAL_QA_IDS.includes(
    partnerId
  )

  ||

  INTERNAL_QA_STORES.includes(
    partnerStore
  );

console.log(
  '[BEGAN NAV QA]',
  {
    partnerId,
    partnerStore,
    HAS_NAV_ACCESS
  }
);

if(!HAS_NAV_ACCESS){

  console.log(
    '[BEGAN NAV] Hidden for partner'
  );

  return;
}
