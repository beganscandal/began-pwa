async function initNotifications(){

  try{

    await loadNotifications();

    renderNotifications();
    renderNotificationStats();
    renderNotificationBadge();

    bindNotificationClicks();
    bindMarkAllRead();
    bindNotificationFilters();

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
