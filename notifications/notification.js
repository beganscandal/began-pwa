let BOTTOM_NAV_BINDED = false;  

async function initNotifications(){

  try{

    await loadNotifications();
    renderNotifications();
    renderNotificationStats();
    renderNotificationBadge();
    bindNotificationClicks();
    bindMarkAllRead();
    bindNotificationFilters();
    bindNotificationStats();
    bindDeleteNotifications();
    bindBottomNavigation();
    bindFabRefresh();
    bindExploreForum();
    bindBackButton();

    lucide.createIcons();

  }

  catch(error){

    console.error(
      'INIT ERROR',
      error
    );

  }

}

document.addEventListener(

  'DOMContentLoaded',

  initNotifications

);

let IS_REFRESHING = false;

async function refreshNotificationCenter(){

  if(IS_REFRESHING)
    return;

  IS_REFRESHING = true;
  togglePullIndicator(true);


  try{

    await loadNotifications();

    renderNotifications();
    renderNotificationStats();
    renderNotificationBadge();
    

  }

  catch(error){

    console.error(
      'REFRESH NOTIFICATION ERROR',
      error
    );

  }

  finally{

     togglePullIndicator(false);
    IS_REFRESHING = false;

  }

}
document.addEventListener(

  'visibilitychange',

  async function(){

    if(document.hidden)
      return;

    await refreshNotificationCenter();

  }

);

setInterval(

  async function(){

    if(document.hidden)
      return;

    await refreshNotificationCenter();

  },

  30000
);

function bindMarkAllRead(){

  const button =

    document.getElementById(
      'mark-all-btn'
    );

  if(!button) return;

  button.addEventListener(

    'click',

    async function(){

      try{

       await markAllNotificationsRead();

       await refreshNotificationCenter();
      }

      catch(error){

        console.error(
          'MARK ALL READ ERROR',
          error
        );

      }

    }

  );

}
function bindNotificationStats(){

  const announcementCard =

    document.querySelector(
      '[data-template-id="stat-2"]'
    );

  if(announcementCard){

    announcementCard.addEventListener(

      'click',

      function(){

        const chip =

          document.querySelector(
            '[data-filter="announcement"]'
          );

        if(chip){

          chip.click();

        }

      }

    );

  }

}

function bindNotificationFilters(){

  document.addEventListener(

    'click',

    function(e){

      const chip =

        e.target.closest(
          '.filter-chip'
        );

      if(!chip) return;

      const filter =
        chip.dataset.filter;

      NotificationState.activeFilter =
        filter;

      document
        .querySelectorAll(
          '.filter-chip'
        )
        .forEach(function(item){

          item.classList.remove(
            'active',
            'bg-white',
            'text-black'
          );

          item.classList.add(
            'border',
            'border-white/15',
            'text-white/60'
          );

        });

      chip.classList.add(
        'active',
        'bg-white',
        'text-black'
      );

      chip.classList.remove(
        'border',
        'border-white/15',
        'text-white/60'
      );

      renderNotifications();

    }

  );

}

function bindDeleteNotifications(){

  document.addEventListener(

    'click',

    async function(e){

      const button =

        e.target.closest(
          '.notif-delete-btn'
        );

      if(!button)
        return;

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();


      const notificationId =

        button.dataset.notificationId;

      if(!notificationId)
        return;

      try{

        await deleteNotification(
          notificationId
        );

        await refreshNotificationCenter();

      }

      catch(error){

        console.error(
          'DELETE NOTIFICATION ERROR',
          error
        );

      }

    }

  );

}

function bindBottomNavigation(){

  if(BOTTOM_NAV_BINDED)
    return;

  BOTTOM_NAV_BINDED = true;

  document.addEventListener(

    'click',

    function(event){

      const item =
        event.target.closest(
          '[data-nav]'
        );

      if(!item)
        return;

      event.preventDefault();

      switch(item.dataset.nav){

        case 'home':

          BeganPwaBridge.open(
            'https://www.barkahgarment.com/began-partner-dashboard-dev'
          );

          break;

        case 'forum':

          BeganDeepLink.open(
            '/forum/'
          );

          break;

        case 'notifications':

          BeganDeepLink.open(
            '/notifications/'
          );

          break;

        case 'reserve':

          BeganPwaBridge.open(
            'https://www.barkahgarment.com/reserve-system'
          );

          break;

      }

    }

  );

}

function bindFabRefresh(){

  const fab =
    document.getElementById('fab');

  if(!fab)
    return;

  fab.addEventListener(

    'click',

    async function(event){

      event.preventDefault();
      event.stopPropagation();

      const icon =
        fab.querySelector('i');

      fab.disabled = true;

      if(icon){

        icon.classList.add(
          'animate-spin'
        );

      }

      try{

        await refreshNotificationCenter();

      }

      catch(error){

        console.error(
          'FAB REFRESH ERROR',
          error
        );

      }

      finally{

        setTimeout(function(){

          fab.disabled = false;

          if(icon){

            icon.classList.remove(
              'animate-spin'
            );

          }

        }, 500);

      }

    }

  );

}
function togglePullIndicator(show){

  const indicator =
    document.getElementById(
      'pull-indicator'
    );

  if(!indicator)
    return;

  if(show){

    indicator.classList.remove(
      'opacity-0',
      '-translate-y-full'
    );

  }

  else{

    indicator.classList.add(
      'opacity-0',
      '-translate-y-full'
    );

  }

}
function bindExploreForum(){

  const button =

    document.querySelector(
      '[data-template-id="empty-btn"]'
    );

  if(!button)
    return;

  button.addEventListener(

    'click',

    function(event){

      event.preventDefault();
      event.stopPropagation();

      BeganDeepLink.open(
        '/forum/'
      );

    }

  );

}

function bindBackButton(){

  const button =
    document.getElementById(
      'back-btn'
    );

  if(!button)
    return;

  button.addEventListener(

    'click',

    function(event){

      event.preventDefault();
      event.stopPropagation();

      const sameOriginReferrer =

        document.referrer &&
        document.referrer.includes(
          location.origin
        );

      if(sameOriginReferrer){

        window.history.back();

        return;

      }

      BeganPwaBridge.open(
        'https://www.barkahgarment.com/began-partner-dashboard-dev'
      );

    }

  );

}
