let PARTNER_MENTIONS = [];
 
let mentionBound = false;

async function loadMentionPartners(){

  try{

    const response =

      await fetch(

        'https://script.google.com/macros/s/AKfycbwPDFvz4K19zuY2FY-IoeMF5WONSafuTTAwWW_cMJAn0L9TlHVpYtMUJzZlAMx1QRWw0Q/exec?action=partners'

      );

    const result =

      await response.json();

    if(

      result.success

    ){

      PARTNER_MENTIONS =

        result.partners || [];

      console.log(

        'PARTNER_MENTIONS',

        PARTNER_MENTIONS

      );

    }

  }

  catch(error){

    console.error(error);

  }

}

function bindMentionAutocomplete(){

  if(

    mentionBound

  ){

    return;

  }

  mentionBound = true;

  document.addEventListener(

    'input',

    function(e){

      const textarea =

        e.target.closest(

          '#post-content, .reply-input'

        );

      if(

        !textarea

      ){

        return;

      }

      handleMentionInput(

        textarea

      );

    }

  );

}


function handleMentionInput(

  textarea

){

  if(

    !PARTNER_MENTIONS.length

  ){

    return;

  }

  const value =

    textarea.value;

  const match =

    value.match(

      /(?:^|\s)@([^\s@]*)$/

    );

  if(

    !match

  ){

    hideMentionDropdown();

    return;

  }

  const keyword =

    match[1]
      .toLowerCase();

  const results =

    PARTNER_MENTIONS

      .filter(function(partner){

        return (

          partner.toko
            .toLowerCase()
            .includes(

              keyword

            )

        );

      })

      .slice(0,5);

  renderMentionDropdown(

    results,

    textarea,

    match

  );

}

function renderMentionDropdown(

  partners,

  textarea,

  match

){

  hideMentionDropdown();

  if(

    partners.length === 0

  ){

    return;

  }

  const dropdown =

    document.createElement(

      'div'

    );

  dropdown.id =

    'mention-dropdown';

  dropdown.className =

    'mention-dropdown';

  dropdown.innerHTML =

    partners

      .map(function(partner){

        return `

          <button

            type="button"

            class="mention-item"

            data-toko="${partner.toko}"

          >

            @${partner.toko}

          </button>

        `;

      })

      .join('');

  const container =

    textarea.closest(

      '.flex-1'

    )

    ||

    textarea.closest(

      '.reply-composer-body'

    );

  if(

    !container

  ){

    return;

  }

  container.style.position =

    'relative';

  container.appendChild(

    dropdown

  );

  dropdown.addEventListener(

    'click',

    function(e){

      const item =

        e.target.closest(

          '.mention-item'

        );

      if(

        !item

      ){

        return;

      }

      const toko =

        item.dataset.toko;

      const mentionText =

        match[0];

      textarea.value =

        textarea.value.replace(

          mentionText,

          mentionText.replace(

            /@([^\s@]*)$/,

            '@' + toko + ' '

          )

        );

      hideMentionDropdown();

      textarea.focus();

    }

  );

}
function hideMentionDropdown(){

  const old =
    document.getElementById(
      'mention-dropdown'
    );

  if(old){

    old.remove();

  }

}

document.addEventListener(

  'click',

  function(e){

    if(

      e.target.closest(

        '#mention-dropdown'

      )

    ){

      return;

    }

    if(

      e.target.closest(

        '#post-content, .reply-input'

      )

    ){

      return;

    }

    hideMentionDropdown();

  }

);

document.addEventListener(

  'click',

  function(e){

    if(

      e.target.closest(

        '#mention-dropdown'

      )

    ){

      return;

    }

    if(

      e.target.closest(

        '#post-content, .reply-input'

      )

    ){

      return;

    }

    hideMentionDropdown();

  }

);

document.addEventListener(

  'click',

  function(e){

    if(

      e.target.closest(

        '#mention-dropdown'

      )

    ){

      return;

    }

    if(

      e.target.closest(

        '#post-content, .reply-input'

      )

    ){

      return;

    }

    hideMentionDropdown();

  }

);
function escapeHtml(text){

    return String(
        text || ''
    )

    .replace(
        /&/g,
        '&amp;'
    )

    .replace(
        /</g,
        '&lt;'
    )

    .replace(
        />/g,
        '&gt;'
    )

    .replace(
        /"/g,
        '&quot;'
    )

    .replace(
        /'/g,
        '&#39;'
    );

}
function formatMentions(text){

    if(!text){

        return '';

    }

    let html = escapeHtml(

        text

    );

    [...PARTNER_MENTIONS]

        .sort(function(a,b){

            return (

                b.toko.length -
                a.toko.length

            );

        })

        .forEach(function(partner){

            const escaped =

                partner.toko.replace(

                    /[.*+?^${}()|[\]\\]/g,

                    '\\$&'

                );

            const regex =

                new RegExp(

                    `@${escaped}(?=\\s|$)`,

                    'g'

                );

            html = html.replace(

                regex,

                `<span class="mention-text">@${partner.toko}</span>`

            );

        });

    return html.replace(

        /\n/g,

        '<br>'

    );

}
function safeFormatMentions(text){

    try{

        if(
            typeof formatMentions !== 'function'
        ){

            return escapeHtml(
                text || ''
            );

        }

        let html = formatMentions(
            text || ''
        );

        html = html.replace(
            /@ALL\b/gi,
            '<span class="mention-all">@ALL</span>'
        );

        return html;

    }

    catch(error){

        console.error(
            'Mention formatter error:',
            error
        );

        return escapeHtml(
            text || ''
        );

    }

}
