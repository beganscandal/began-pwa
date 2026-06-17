function getTypeIcon(type){

  switch(

    String(type || '')
      .toLowerCase()

  ){

    case 'reply':
    case 'mention':
      return '💬';

    case 'announcement':
      return '📢';

    case 'reserve':
      return '📦';

    case 'article':
      return '🔥';

    case 'checkout':
      return '🛒';

    case 'production':
      return '🏭';

    case 'shipping':
      return '🚚';

    default:
      return '🔔';

  }

}

function renderNotifications(){

  const list =

    document.getElementById(
      'notif-list'
    );

  const items =

    NotificationState
      .notifications || [];

  if(!items.length){

    list.innerHTML = '';

    document
      .getElementById(
        'empty-state'
      )
      .classList
      .remove('hidden');

    return;

  }

  document
    .getElementById(
      'empty-state'
    )
    .classList
    .add('hidden');

  list.innerHTML =

    items.map(function(n){

      return `

      <div
        class="notif-item rounded-2xl p-4 border border-white/5 flex gap-3"
        data-url="${n.url || ''}"
      >

        <div
          class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-lg shrink-0"
        >
          ${getTypeIcon(n.type)}
        </div>

        <div class="flex-1">

          <p class="text-sm font-semibold">

            ${n.message || ''}

          </p>

          <p class="text-xs text-white/35">

            ${n.type || ''}

          </p>

        </div>

      </div>

      `;

    }).join('');

}

function renderNotificationStats(){

  const items =
    NotificationState.notifications || [];

  const unreadCount =

    items.filter(
      n => !n.isRead
    ).length;

  const announcementCount =

    items.filter(
      n =>
      String(
        n.type || ''
      ).toLowerCase() ===
      'announcement'
    ).length;

  const reserveCount =

    items.filter(
      n =>
      String(
        n.type || ''
      ).toLowerCase() ===
      'reserve'
    ).length;

  const unreadEl =
    document.querySelector(
      '[data-template-id="stat-1-value"]'
    );

  const announcementEl =
    document.querySelector(
      '[data-template-id="stat-2-value"]'
    );

  const reserveEl =
    document.querySelector(
      '[data-template-id="stat-3-value"]'
    );

  if(unreadEl)
    unreadEl.textContent =
      unreadCount;

  if(announcementEl)
    announcementEl.textContent =
      announcementCount;

  if(reserveEl)
    reserveEl.textContent =
      reserveCount;

}
 
