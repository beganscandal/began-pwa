(function(global){

'use strict';

global.renderAnnouncements =
  renderAnnouncements;

  function updateAnnouncementCount(
  announcements
){

  const stat =
    document.querySelector(

      '[data-template-id="stat-3-value"]'

    );

  if(!stat){

    return;

  }

  stat.textContent =

    announcements.length;

}


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
  updateAnnouncementCount(
  announcements || []
);

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

 container

  .querySelectorAll(
    '[data-announcement]'
  )

    .forEach(function(el){

      el.remove();

    });

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

}
  
  function escapeAnnouncementHtml(
  str
){

  if(str == null){

    return '';

  }

  return String(str)

    .replace(/&/g,'&amp;')

    .replace(/</g,'&lt;')

    .replace(/>/g,'&gt;')

    .replace(/"/g,'&quot;')

    .replace(/'/g,'&#39;');

}
function buildAnnouncementCard(
  item
){

    return `

  <article
    data-announcement
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

      </div>

      <h3
        class="
          canva-text
          font-semibold
          text-white
        "
        style="
          font-size:18px;
        ">
${escapeAnnouncementHtml(
  item.title || ''
)}
      </h3>

      <p
        class="
          canva-text
          text-gray-400
          text-sm
          mt-1
        ">
 ${escapeAnnouncementHtml(
  item.content || ''
).replace(
  /\n/g,
  '<br>'
)}
      </p>
             ${
  item.image
  ? `
    <div class="mt-3">

      <img
        src="${item.image}"
        alt="Announcement"
        class="w-full rounded-lg"
        loading="lazy">

    </div>
  `
  : ''        
}
${
  item.videoUrl
  ? `

    <button
      type="button"
      data-announcement-video="${item.videoUrl}"
      class="
        w-full
        mt-3
        mb-3
        rounded-lg
        border
        border-red-500/30
        bg-red-500/10
        text-red-400
        py-3
        font-semibold
      ">

      ▶ Lihat Video Promosi

    </button>

  `
  : ''
}

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

      </div>

    </article>

  `;

}

})(window);

function convertYoutubeEmbed(
  url
){

  if(!url){

    return '';

  }

  if(

    url.includes(
      'youtube.com/embed/'
    )

  ){

    return url;

  }

  if(

    url.includes(
      'youtu.be/'
    )

  ){

    const id =

      url.split(
        'youtu.be/'
      )[1]

      ?.split('?')[0];

    return `https://www.youtube.com/embed/${id}`;

  }

  if(

    url.includes(
      'watch?v='
    )

  ){

    const id =

      new URL(url)

        .searchParams

        .get('v');

    return `https://www.youtube.com/embed/${id}`;

  }

  return '';

}

