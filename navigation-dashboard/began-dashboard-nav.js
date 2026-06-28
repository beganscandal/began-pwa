(function(){
 
'use strict';

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

  const wrapper =
    document.querySelector(
      '.menu-wrapper'
    );

  if(!wrapper){

    console.warn(
      '[BEGAN NAV] menu-wrapper not found'
    );

    return;
  }

  wrapper.innerHTML = `

<div class="began-nav">

<button
class="began-nav__item active"
data-nav="dashboard">
Dashboard
</button>

<button
class="began-nav__item"
data-nav="kategori">
Kategori Produk
</button>

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
hidden></span>
</button>

<button
class="began-nav__item"
data-nav="notification">
Notifications
<span
id="notification-badge"
class="began-nav__badge"
hidden></span>
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
}

 function bindNavigation(){

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

          location.href =
'https://www.barkahgarment.com/began-partner-dashboard-dev';

        break;

        case 'kategori':

          document
            .querySelector(
              '.filter-dropdown'
            )
            ?.click();

        break;

        case 'history':

          document
            .querySelector(
              '.menu-item.history'
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

 document.addEventListener(

  'DOMContentLoaded',

  function(){

    injectNavigation();

    bindNavigation();

    renderNotificationBadge();

    renderForumBadge();

  }

);

})();
