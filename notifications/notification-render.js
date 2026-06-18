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

    const url =
      n.url ||
      (
        n.postId
        ? '/forum/post/?postId=' + encodeURIComponent(n.postId)
        : ''
      );

    const unreadDot =

      !n.isRead

        ? `
          <span
            class="inline-block w-2 h-2 rounded-full bg-accent badge-pulse mr-2 shrink-0"
          ></span>
        `

        : '';
    const timeAgo =
  formatTimeAgo(
    n.createdAt
  );

    return `

      <div
        class="notif-item rounded-2xl p-4 border border-white/5 flex gap-3"
        data-notification-id="${n.notificationId || ''}"
        data-url="${url}"
      >

        <div
          class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-lg shrink-0"
        >
          ${getTypeIcon(n.type)}
        </div>

        <div class="flex-1 min-w-0">

  <div
    class="flex items-start justify-between gap-2"
  >

    <p
      class="text-sm font-semibold flex items-center min-w-0"
    >

      ${unreadDot}

      <span class="truncate">

        ${n.message || ''}

      </span>

    </p>

    <span
      class="text-[10px] text-white/35 shrink-0"
    >

      ${timeAgo}

    </span>

  </div>

  <p
    class="text-xs text-white/35"
  >

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
    );const unreadChip =
  document.querySelector(
    '[data-filter="unread"]'
  );

if(unreadChip){

  unreadChip.innerHTML =
    unreadCount > 0
      ? `
        Unread
        <span
          class="inline-block w-2 h-2 rounded-full bg-accent badge-pulse ml-1"
        ></span>
      `
      : 'Unread';

}

 if(unreadEl){

  unreadEl.innerHTML =
    unreadCount > 0
      ? `
        <span
          class="inline-block w-2 h-2 rounded-full bg-accent badge-pulse mr-2"
        ></span>
        ${unreadCount}
      `
      : '0';

}

  if(announcementEl)
    announcementEl.textContent =
      announcementCount;

  if(reserveEl)
    reserveEl.textContent =
      reserveCount;

}

function bindNotificationClicks(){

  document.addEventListener(

    'click',

    async function(e){

      const card =

        e.target.closest(
          '.notif-item'
        );

      if(!card) return;

      const url =
        card.dataset.url;

      const notificationId =
        card.dataset.notificationId;

      if(notificationId){

        try{

          await markNotificationRead(
            notificationId
          );
          await loadNotifications();

renderNotifications();
renderNotificationStats();
renderNotificationBadge();

        }catch(error){

          console.error(
            'MARK READ ERROR',
            error
          );

        }

      }

      if(!url) return;

      BeganDeepLink.open(url);

    }

  );

}

function renderNotificationBadge(){

  const badge =
    document.getElementById(
      'nav-badge'
    );

  if(!badge) return;

  const unreadCount =
    NotificationState.notifications
      .filter(n => !n.isRead)
      .length;

  badge.style.display =
    unreadCount > 0
      ? 'block'
      : 'none';

}

function formatTimeAgo(dateString){

  const now =
    new Date();

  const date =
    new Date(dateString);

  const diff =
    Math.floor(
      (now - date) / 1000
    );

  if(diff < 60)
    return diff + 's ago';

  if(diff < 3600)
    return Math.floor(diff / 60) + 'm ago';

  if(diff < 86400)
    return Math.floor(diff / 3600) + 'h ago';

  if(diff < 604800)
    return Math.floor(diff / 86400) + 'd ago';

  return date.toLocaleDateString(
    'id-ID'
  );

}

function formatTimeAgo(dateString){

  if(!dateString)
    return '';

  const date =
    new Date(dateString);

  if(isNaN(date))
    return '';

  ...
}
