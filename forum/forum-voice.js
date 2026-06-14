document.addEventListener(

  'DOMContentLoaded',

  function(){

    bindVoiceSubmit();

  }

);

document.addEventListener(

  'click',

  function(e){

    if(

      e.target.closest(

        '[data-template-id="stat-2"]'

      )

    ){

      openVoiceDrawer();

    }

  }

);
function bindVoiceSubmit(){

  document.addEventListener(

    'click',

    async function(e){

      const button =

        e.target.closest(
          '#voice-submit'
        );

      if(!button){

        return;

      }

      await submitPartnerVoice(
        button
      );

    }

  );

}

async function submitPartnerVoice(
  button
){

  try{

    const partner =

      JSON.parse(

        localStorage.getItem(
          'began_partner'
        ) || '{}'

      );

    const category =

      document.getElementById(
        'voice-category'
      )?.value
      ?.trim();

    const suggestion =

      document.getElementById(
        'voice-suggestion'
      )?.value
      ?.trim();

    if(

      !partner.id ||

      !partner.toko

    ){

      alert(
        'Partner tidak ditemukan.'
      );

      return;

    }

    if(

      !category ||

      !suggestion

    ){

      alert(
        'Lengkapi kategori dan masukan.'
      );

      return;

    }

    button.disabled = true;

    button.textContent =
      'Mengirim...';

    const response =

      await fetch(

        FORUM_API_URL,

        {

          method:'POST',

          headers:{

            'Content-Type':
              'application/json'

          },

          body:JSON.stringify({

            action:
              'submitVoice',

            payload:{

              partnerId:
                partner.id,

              toko:
                partner.toko,

              category:
                category,

              suggestion:
                suggestion

            }

          })

        }

      );

    const result =

      await response.json();

    if(

      !result.success

    ){

      throw new Error(

        result.message ||

        'Gagal'

      );

    }
   
    showVoiceSuccess();

  }

  catch(error){

    alert(

      error.message ||

      'Terjadi kesalahan'

    );

  }

  finally{

    if(

  document.body.contains(
    button
  )

){

  button.disabled =
    false;

  button.textContent =
    'Kirim Suara Partner';

}

}
}  

function showVoiceSuccess(){

  document
    .getElementById(
      'voice-form'
    )
    ?.classList.add(
      'hidden'
    );

  document
    .getElementById(
      'voice-success'
    )
    ?.classList.remove(
      'hidden'
    );

}

function openVoiceDrawer(){

  document
    .getElementById(
      'voice-modal'
    )
    ?.classList.remove(
      'hidden'
    );

  document
    .getElementById(
      'voice-form'
    )
    ?.classList.remove(
      'hidden'
    );

  document
    .getElementById(
      'voice-success'
    )
    ?.classList.add(
      'hidden'
    );

 const category =

  document.getElementById(
    'voice-category'
  );

if(category){

  category.value = '';

}

 const suggestion =

  document.getElementById(
    'voice-suggestion'
  );

if(suggestion){

  suggestion.value = '';

}

  document.body.style.overflow =
    'hidden';

}


function closeVoiceDrawer(){

  document
    .getElementById(
      'voice-modal'
    )
    ?.classList.add(
      'hidden'
    );

  document.body.style.overflow =
    '';

}

document.addEventListener(

  'click',

  function(e){

    if(

      e.target.closest(
        '#voice-close'
      )

      ||

      e.target.closest(
        '#voice-success-close'
      )

    ){

      closeVoiceDrawer();

    }

  }

);

document.addEventListener(

  'click',

  function(e){

    const modal =

      document.getElementById(
        'voice-modal'
      );

    if(

      e.target === modal

    ){

      closeVoiceDrawer();

    }

  }

);
