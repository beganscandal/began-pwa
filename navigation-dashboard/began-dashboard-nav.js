(function(){  
  
'use strict';
  
  let NAV_NOTIFICATIONS = [];

let IS_NAV_NOTIFICATION_REFRESHING =
  false;
 let NAV_BINDED = false;
  let NOTIFICATION_TIMER = null;
  let resizeTimer;
  let LAST_NAV_MODE = null;

  
  const NOTIFICATION_API =
'https://script.google.com/macros/s/AKfycbyOrOoPCY8tHo5GMlGaW9eOyxA3O-7Q_-Y3NNGZAuxhe_In0ZwxBy2dHYySDNvsuIfyKg/exec';

const partner = JSON.parse(
  localStorage.getItem(
    'began_partner'
  ) || '{}'
);

const ENABLE_NAV =

  String(
    partner.id || ''
  )
  .trim()
  .toUpperCase()

  ===

  'BGN-250'

  ||

  String(
    partner.toko || ''
  )
  .trim()
  .toUpperCase()

  ===

  'ADMIN1';

if(!ENABLE_NAV){
  return;
}

 function injectNavigation(){

  const oldWrapper =
    document.querySelector(
      '.menu-wrapper'
    );

  if(!oldWrapper){

    console.warn(
      '[BEGAN NAV] menu-wrapper not found'
    );

    return;
  }

  if(
    document.getElementById(
      'began-nav-v2'
    )
  ){
    return;
  }

  const navContainer =
    document.createElement('div');

  navContainer.id =
    'began-nav-v2';

  navContainer.innerHTML = `

  

<div class="began-nav">

<button class="began-nav__item active"
data-nav="dashboard">
Dashboard
</button>

<button class="began-nav__item"
data-nav="reserve">
Produk Reserve
</button>

<button class="began-nav__item"
data-nav="forum">
Forum
</button>


<button class="began-nav__item"
data-nav="notification">
Notifications
<span id="notification-badge"
class="began-nav__badge"
hidden></span>
</button>

<button class="began-nav__item"
data-nav="history">
Riwayat Belanja
</button>

<button class="began-nav__item"
data-nav="panduan">
Panduan
</button>

<button class="began-nav__item"
data-nav="contact">
Contact
</button>

<div class="
filter-dropdown
began-nav-kategori">

<button
class="began-nav__item began-nav__kategori-btn"
data-nav="kategori">

<span class="began-nav__label">
KATEGORI PRODUCT
</span>

<img
class="began-nav__icon"
src="https://pwa.barkahgarment.com/assets/toggleDown.jpg">

</button>

</div>

</div>
`;

  oldWrapper.insertAdjacentElement(
    'afterend',
    navContainer
  );
   oldWrapper.style.display = 'none';
  const oldPanel =

  document.querySelector(
    '.filter-dropdown-panel'
  );

const newKategori =

  navContainer.querySelector(
    '.began-nav-kategori'
  );

if(
  oldPanel &&
  newKategori
){

  newKategori.appendChild(
    oldPanel
  );

}

  console.log(
    '[BEGAN NAV] injected'
  );

}

  function renderPortraitNavigation(){

  if(window.innerWidth > 479){
    return;
  }

  if(
    document.getElementById(
      'began-nav-portrait'
    )
  ){
    return;
  }

  const desktopNav =
    document.getElementById(
      'began-nav-v2'
    );

  if(!desktopNav){
    return;
  }

  desktopNav.style.display = 'none';

  const portrait =
    document.createElement('div');

  portrait.id =
    'began-nav-portrait';

  portrait.innerHTML = `

  <div class="began-portrait-utils">

<button class="portrait-util"
data-nav="notification">

<span class="portrait-badge"
id="portrait-notification-badge"
hidden></span>

🔔

</button>

<button class="portrait-util"
data-nav="history">
🧾
</button>

<button class="portrait-util"
data-nav="panduan">
📖
</button>

<button class="portrait-util whatsapp"
data-nav="contact">

<img
src="https://pwa.barkahgarment.com/assets/whatsappIcon.png"
alt="WhatsApp">

</button>

</div>

<div class="began-portrait-main">

<button class="portrait-main active"
data-nav="dashboard">
Dashboard
</button>

<button class="portrait-main"
data-nav="reserve">
Produk Reserve
</button>

<button class="portrait-main"
data-nav="forum">
Forum
</button>

</div>

`;
    desktopNav.insertAdjacentElement(
  'afterend',
  portrait
);
    const kategori =
  document.querySelector(
    '.began-nav-kategori'
  );

const portraitMain =
  portrait.querySelector(
    '.began-portrait-main'
  );

if(
  kategori &&
  portraitMain
){
  portraitMain.appendChild(
    kategori
  );
}
  }
    
    function updatePortraitNavigation(){

  const desktop =
    document.getElementById(
      'began-nav-v2'
    );

  const portrait =
    document.getElementById(
      'began-nav-portrait'
    );
      const isPortrait =
  window.innerWidth <= 479;

  const kategori =
  document.querySelector(
    '#began-nav-portrait .began-nav-kategori'
  ) ||
  document.querySelector(
    '#began-nav-v2 .began-nav-kategori'
  );

 if(isPortrait){

  if(LAST_NAV_MODE !== 'portrait'){
  LAST_NAV_MODE = 'portrait';
}else{
  return;
}
  if(!portrait){

    renderPortraitNavigation();

  }

    const portraitMain =
      document.querySelector(
        '.began-portrait-main'
      );

    if(
      kategori &&
      portraitMain &&
      !portraitMain.contains(kategori)
    ){

      portraitMain.appendChild(
        kategori
      );

    }

    if(desktop){

      desktop.style.display = 'none';

    }

 }else{

  if(LAST_NAV_MODE !== 'desktop'){
  LAST_NAV_MODE = 'desktop';
}else{
  return;
}
  if(
  kategori &&
  desktop
){

  const nav =
    desktop.querySelector(
      '.began-nav'
    );

  if(
    nav &&
    kategori.parentNode !== nav
  ){

    nav.appendChild(
      kategori
    );

  }

}
    portrait?.remove();

    if(desktop){

      desktop.style.display = '';

    }

  }

}
 function bindNavigation(){

  if(NAV_BINDED){
    return;
  }

  NAV_BINDED = true;

  // ==========================
  // NAVIGATION CLICK
  // ==========================

 ['click','touchend'].forEach(function(type){

  document.addEventListener(type,function(event){

    const item =
      event.target.closest('[data-nav]');

    if(!item){
      return;
    }

    event.preventDefault();

    switch(item.dataset.nav){

      case 'dashboard':

        BeganPwaBridge.open(
'https://www.barkahgarment.com/began-partner-dashboard-dev'
        );

      break;

      case 'kategori':

        const dropdown =
          document.querySelector(
            '.began-nav-kategori'
          );

        if(!dropdown){
          break;
        }

        const icon =
          dropdown.querySelector(
            '.began-nav__icon'
          );

        const opened =
          dropdown.classList.toggle(
            'active'
          );

        if(icon){

          icon.src =
            opened
              ? 'https://pwa.barkahgarment.com/assets/toggleUp.jpg'
              : 'https://pwa.barkahgarment.com/assets/toggleDown.jpg';

        }

      break;

      case 'history':
        document.querySelector('.btn-history')?.click();
      break;

      case 'panduan':
        document.querySelector('.menu-item.panduan')?.click();
      break;

      case 'contact':
        document.querySelector('.menu-item.contact')?.click();
      break;

      case 'reserve':
        BeganPwaBridge.open(
'https://www.barkahgarment.com/reserve-system'
        );
      break;

      case 'forum':
        BeganPwaBridge.open(
'https://pwa.barkahgarment.com/forum/'
        );
      break;

      case 'notification':
        BeganPwaBridge.open(
'https://pwa.barkahgarment.com/notifications/index.html'
        );
      break;

    }

  }, { passive:false });

});
  // ==========================
  // CLOSE DROPDOWN OUTSIDE
  // ==========================

document.addEventListener(

  'click',

  function(event){

    const wrap =
      document.querySelector(
        '.began-nav-kategori'
      );

    if(
      !wrap ||
      wrap.contains(event.target)
    ){
      return;
    }

    wrap.classList.remove(
      'active'
    );

    const icon =
      wrap.querySelector(
        '.began-nav__icon'
      );

    if(icon){

      icon.src =
'https://pwa.barkahgarment.com/assets/toggleDown.jpg';

    }

  }

);
 }

  async function refreshNotificationBadge(){

  if(
    IS_NAV_NOTIFICATION_REFRESHING
  ){
    return;
  }

  IS_NAV_NOTIFICATION_REFRESHING =
    true;

  try{

    const partner = JSON.parse(

      localStorage.getItem(
        'began_partner'
      ) || '{}'

    );

    if(!partner.id){
      return;
    }

 

 const response = await fetch(

  NOTIFICATION_API +

  '?action=getNotifications' +

  '&partnerId=' +

  encodeURIComponent(
    partner.id
  )

);
    const result =
      await response.json();

    NAV_NOTIFICATIONS =
      result.notifications || [];

    renderNotificationBadge();

  }

  catch(error){

    console.error(
      '[BEGAN NAV]',
      error
    );

  }

  finally{

    IS_NAV_NOTIFICATION_REFRESHING =
      false;

  }

}
  function renderNotificationBadge(){

  const badges = document.querySelectorAll(
    '#notification-badge, #portrait-notification-badge'
  );

  const unreadCount =
    NAV_NOTIFICATIONS.filter(
      n => !n.isRead
    ).length;

  badges.forEach(function(badge){

    if(!badge) return;

    if(unreadCount <= 0){

      badge.hidden = true;
      badge.textContent = '';
      return;
    }

    badge.hidden = false;

    badge.textContent =
      unreadCount > 99
      ? '99+'
      : unreadCount;

  });

}
function waitDashboardReady(){

  console.log(
    '[BEGAN NAV] waiting dashboard'
  );

  let attempts = 0;

  const timer = setInterval(

    function(){

      attempts++;

      const wrapper =
        document.querySelector(
          '.menu-wrapper'
        );

      const partner =
        localStorage.getItem(
          'began_partner'
        );

      if(
        wrapper &&
        partner
      ){

        clearInterval(timer);

        console.log(
          '[BEGAN NAV] dashboard ready'
        );

       injectNavigation();

bindNavigation();

updatePortraitNavigation();


window.addEventListener(
  'resize',
  function(){

    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(
      updatePortraitNavigation,
      200
    );

  }
);
refreshNotificationBadge();

        return;

      }

      if(attempts >= 40){

        clearInterval(timer);

        console.warn(
          '[BEGAN NAV] timeout'
        );

      }

    },

    500

  );

}
 if(!NOTIFICATION_TIMER){

  NOTIFICATION_TIMER =

    setInterval(

      async function(){

        if(document.hidden){
          return;
        }

        await refreshNotificationBadge();

      },

      30000

    );

}
  
 if(document.readyState === 'loading'){

  document.addEventListener(
    'DOMContentLoaded',
    waitDashboardReady
  );

}else{

  waitDashboardReady();

}
 })();
