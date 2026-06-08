function getPartnerContext(){

    if(
        window.FORUM_DEV &&
        window.FORUM_DEV.ENABLED
    ){

        return {

            id :
                window.FORUM_DEV.PARTNER_ID,

            toko :
                window.FORUM_DEV.TOKO,

            partnerName :
                window.FORUM_DEV.TOKO,

            isDev : true

        };

    }

    const partner =
        JSON.parse(
            localStorage.getItem(
                'began_partner'
            ) || '{}'
        );

    return {

        id :
            partner.id || '',

        toko :
            partner.toko || '',

        partnerName :
            partner.toko || '',

        isDev : false

    };

}
