(function(global){

'use strict';

global.renderAnnouncements =
  renderAnnouncements;

function renderAnnouncements(
  announcements
){

}

})(window);

function renderAnnouncements(
  announcements
){

  const container =
    document.getElementById(
      'announcement-container'
    );

  if(!container){

    return;

  }

  /*
   * hide jika kosong
   */

  if(

    !announcements ||

    !announcements.length

  ){

    container.style.display =
      'none';

    return;

  }

  container.style.display =
    '';

  /*
   * hapus loading
   */

  container

    .querySelectorAll(

      '[data-announcement-loading]'

    )

    .forEach(function(el){

      el.remove();

    });

}
const title =

  container.querySelector(
    'h2'
  );

function buildAnnouncementCard(
  item
){

  return `

    <article
      class="
        canva-card
        rounded-xl
        p-4
        mb-3
        border-l-4
        border-amber-500
      "
      style="
        background:rgb(26,26,26);
      ">

      ...

    </article>

  `;

}
<div
class="
flex
items-center
gap-2
mb-2
">

<span
class="
bg-amber-500/20
text-amber-400
text-[10px]
font-bold
px-2
py-0.5
rounded
">

PENGUMUMAN

</span>

${
  item.isPinned

    ?

    `
    <span
    class="
    bg-red-500/20
    text-red-400
    text-[10px]
    font-bold
    px-2
    py-0.5
    rounded
    ">

    PINNED

    </span>
    `

    :

    ''

}
<h3
class="
canva-text
font-semibold
text-white
"
style="
color:rgb(255,255,255);
font-weight:600;
font-size:18px;
">

${escapeHtml(

  item.title || ''

)}

</h3>

<p
class="
canva-text
text-gray-400
text-sm
mt-1
"
style="
color:rgb(156,163,175);
font-size:15px;
">

${escapeHtml(

  item.content || ''

)}

</p>

<div
class="
flex
items-center
gap-3
mt-3
text-xs
text-gray-500
">

<span>

BEGAN OFFICIAL

</span>

<span>

${formatRelativeTime(

  item.createdAt

)}

</span>

</div>
announcements.forEach(

  function(item){

    container.insertAdjacentHTML(

      'beforeend',

      buildAnnouncementCard(
        item
      )

    );

  }

);
