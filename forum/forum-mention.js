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
