let PARTNER_MENTIONS = [];
async function loadMentionPartners(){

  try{

    const response =

      await fetch(

        FORUM_API_URL +

        '?action=partners'

      );

    const result =

      await response.json();

    if(

      result.success

    ){

      PARTNER_MENTIONS =

        result.partners || [];

    }

  }

  catch(error){

    console.error(error);

  }

}
