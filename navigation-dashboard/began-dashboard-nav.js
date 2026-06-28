(function(){
 
'use strict';
 
 let NAV_BINDED = false;

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

<button
class="began-nav__item active"
data-nav="dashboard">

Dashboard

</button>

<div class="
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

<button
class="began-nav__item"
data-nav="reserve">

Produk Reserve

</button>

<button
class="began-nav__item"
data-nav="forum">

Forum

<span
id="forum-badge"
class="began-nav__badge"
hidden>
</span>

</button>

<button
class="began-nav__item"
data-nav="notification">

Notifications

<span
id="notification-badge"
class="began-nav__badge"
hidden>
</span>

</button>

<button
class="began-nav__item"
data-nav="history">

Riwayat Belanja

</button>

<button
class="began-nav__item"
data-nav="panduan">

Panduan

</button>

<button
class="began-nav__item"
data-nav="contact">

Contact

</button>

</div>

`;

  oldWrapper.insertAdjacentElement(
    'afterend',
    navContainer
  );
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
 function bindNavigation(){

  if(NAV_BINDED){
    return;
  }

  NAV_BINDED = true;

  // ==========================
  // NAVIGATION CLICK
  // ==========================

  document.addEventListener(

    'click',

    function(event){

      const item =
        event.target.closest(
          '[data-nav]'
        );

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
'#began-nav-v2 .began-nav-kategori'
);

const icon =
document.querySelector(
'.began-nav__icon'
);

if(!dropdown) break;

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

          document
            .querySelector(
              '.btn-history'
            )
            ?.click();

        break;

        case 'panduan':

          document
            .querySelector(
              '.menu-item.panduan'
            )
            ?.click();

        break;

        case 'contact':

          document
            .querySelector(
              '.menu-item.contact'
            )
            ?.click();

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

    }

  );

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

wrap.classList.remove('active');

const icon =
document.querySelector(
'.began-nav__icon'
);

if(icon){

icon.src =
'https://pwa.barkahgarment.com/assets/toggleDown.jpg';

}

});
}
 function renderNotificationBadge(){

  const badge =
    document.getElementById(
      'notification-badge'
    );

  if(!badge)
    return;

  const unread =
    Number(
      localStorage.getItem(
        'began_notification_unread'
      ) || 0
    );

  if(unread <= 0){

    badge.hidden = true;
    return;
  }

  badge.hidden = false;

  badge.textContent =
    unread > 99
      ? '99+'
      : unread;

}

 function renderForumBadge(){

  const badge =
    document.getElementById(
      'forum-badge'
    );

  if(!badge)
    return;

  const unread =
    Number(
      localStorage.getItem(
        'began_forum_unread'
      ) || 0
    );

  if(unread <= 0){

    badge.hidden = true;
    return;
  }

  badge.hidden = false;

  badge.textContent =
    unread > 99
      ? '99+'
      : unread;

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

        renderNotificationBadge();

        renderForumBadge();

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
window.addEventListener(

  'load',

  waitDashboardReady

);

 })();
