document.addEventListener(

  'DOMContentLoaded',

  function(){

    bindVoiceSubmit();

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

    button.disabled =
      false;

    button.textContent =
      'Kirim Suara Partner';

  }

}

function showVoiceSuccess(){

  const container =

    document.querySelector(

      '[data-template-id="drawer-container"]'

    );

  if(!container){

    return;

  }

  container.innerHTML = `

    <div class="text-center py-10">

      <div class="text-4xl mb-4">

        ✅

      </div>

      <h3
        class="text-white font-bold text-xl">

        Terima kasih

      </h3>

      <p
        class="text-gray-400 mt-2">

        Suara Anda membantu menentukan produk dan reserve berikutnya.

      </p>

    </div>

  `;

}
