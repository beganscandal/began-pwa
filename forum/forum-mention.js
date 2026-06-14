let PARTNER_MENTIONS = []; 

async function loadMentionPartners(){

  try{

    const response =

      await fetch(

       "https://script.google.com/macros/s/AKfycbwPDFvz4K19zuY2FY-IoeMF5WONSafuTTAwWW_cMJAn0L9TlHVpYtMUJzZlAMx1QRWw0Q/exec?action=partners"

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

  document.addEventListener(

    'input',

    function(e){

      const textarea =

        e.target.closest(

          '#post-content, .reply-input'

        );

      if(!textarea){

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

  textarea.parentElement.appendChild(
    dropdown
);

    dropdown.addEventListener(
    'click',
    function(e){

      const item =
        e.target.closest(
          '.mention-item'
        );

      if(!item){
        return;
      }

      const toko =
        item.dataset.toko;

     const start =

  match.index;

const before =

  textarea.value.substring(

    0,

    start

  );

textarea.value =

  before +

  ' @' +

  toko +

  ' ';

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

      !e.target.closest(

        '#mention-dropdown'

      )

    ){

      hideMentionDropdown();

    }

  }

);
