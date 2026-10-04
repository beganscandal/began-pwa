let BOTTOM_NAV_BINDED = false;   

function openNotificationDestination(
  type,
  url
){

  if(!url){
    return;
  }

  const normalizedType =
    String(type || '')
      .toLowerCase();

  if(
    ['reserve','checkout','article']
      .includes(normalizedType)
  ){

    if(
      window.BeganPwaBridge

      &&

      typeof
      window.BeganPwaBridge.open
      === 'function'
    ){

      window.BeganPwaBridge.open(url);

    }

    return;
  }

  if(
    window.BeganDeepLink

    &&

    typeof
    window.BeganDeepLink.open
    === 'function'
  ){

    window.BeganDeepLink.open(url);

    return;
  }

  window.location.href = url;
}

window.openNotificationDestination =
  openNotificationDestination;

let NOTIFICATION_HANDLERS_BOUND = false;
window.NOTIFICATION_ACTION_BUSY = false;

async function initNotifications(){
  try{
  if(!NOTIFICATION_HANDLERS_BOUND){
    NOTIFICATION_HANDLERS_BOUND = true;
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
  await refreshNotificationCenter();
  }catch(error){
    console.error('INIT ERROR', error);
    setNotificationError(error);
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
  setNotificationError();


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
    setNotificationError(error);

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

      if(button.disabled || window.NOTIFICATION_ACTION_BUSY) return;
      window.NOTIFICATION_ACTION_BUSY = true;
      button.disabled = true;
      const label = button.textContent;
      button.textContent = 'Memproses…';
      button.setAttribute('aria-busy', 'true');
      try{

       await markAllNotificationsRead();

       await refreshNotificationCenter();
      }

      catch(error){

        console.error(
          'MARK ALL READ ERROR',
          error
        );
        setNotificationError(error, true);

      }finally{
        window.NOTIFICATION_ACTION_BUSY = false;
        button.disabled = false;
        button.textContent = label;
        button.setAttribute('aria-busy', 'false');
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

      if(!notificationId || button.disabled || window.NOTIFICATION_ACTION_BUSY)
        return;

      window.NOTIFICATION_ACTION_BUSY = true;
      button.disabled = true;
      button.classList.add('animate-pulse');
      button.setAttribute('aria-busy', 'true');
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
        setNotificationError(error, true);

      }finally{
        window.NOTIFICATION_ACTION_BUSY = false;
        button.disabled = false;
        button.classList.remove('animate-pulse');
        button.setAttribute('aria-busy', 'false');
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
            'https://barkahgarment.com/began-partner-dashboard-dev'
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
            'https://barkahgarment.com/reserve-system'
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
        'https://barkahgarment.com/began-partner-dashboard-dev'
      );

    }

  );

}

function setNotificationError(error, mutation = false){
  let status = document.getElementById('notification-load-status');
  if(!error){
    status?.remove();
    return;
  }
  if(!status){
    status = document.createElement('div');
    status.id = 'notification-load-status';
    status.className = 'rounded-2xl p-4 border border-white/15 mb-5 text-sm';
    status.setAttribute('role', 'alert');
    document.getElementById('notif-list').before(status);
  }
  const missingSession = error.message === 'PARTNER_NOT_FOUND';
  status.replaceChildren();
  const message = document.createElement('p');
  message.textContent = missingSession
    ? 'Sesi partner tidak tersedia. Kembali ke Dashboard untuk masuk.'
    : mutation
      ? 'Status tindakan belum dapat dipastikan. Muat ulang notifikasi sebelum mencoba lagi.'
      : 'Notifikasi belum dapat dimuat. Silakan coba lagi.';
  status.append(message);
  if(!missingSession){
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.textContent = 'Coba lagi';
    retry.className = 'mt-2 px-3 py-1.5 rounded-full border border-white/15';
    retry.addEventListener('click', () => refreshNotificationCenter());
    status.append(retry);
  }
  document.querySelectorAll('[data-template-id^="stat-"][data-template-id$="-value"]').forEach(element => {
    if(element.textContent.trim() === 'loading...') element.textContent = '—';
  });
  if(!NotificationState.notifications.length){
    document.getElementById('empty-state').classList.add('hidden');
  }
}
