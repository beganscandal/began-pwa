function readPartnerFromUrl(){

    const params =
        new URLSearchParams(
            window.location.search
        );

    const rawPartner =
        params.get('partner');

    if(rawPartner){

        try{

            return JSON.parse(
                decodeURIComponent(rawPartner)
            );

        }catch(error){

            try{

                return JSON.parse(
                    atob(rawPartner)
                );

            }catch(innerError){}

        }

    }

    const partnerId =
        params.get('partnerId') ||
        params.get('partner_id') ||
        params.get('id');

    const toko =
        params.get('toko') ||
        params.get('partnerName') ||
        params.get('name');

    if(!partnerId || !toko){
        return null;
    }

    return {

        id :
            partnerId,

        toko :
            toko,

        name :
            params.get('name') || toko,

        whatsapp :
            params.get('whatsapp') || '',

        tier :
            params.get('tier') || ''

    };

}

function hydratePartnerSessionFromUrl(){

    const partner =
        readPartnerFromUrl();

    if(
        !partner ||
        !partner.id ||
        !partner.toko
    ){
        return null;
    }

    localStorage.setItem(
        'began_partner',
        JSON.stringify(partner)
    );

    try{

        const url =
            new URL(window.location.href);

        [
            'partner',
            'partnerId',
            'partner_id',
            'id',
            'toko',
            'partnerName',
            'name',
            'whatsapp',
            'tier'
        ].forEach(function(key){

            url.searchParams.delete(key);

        });

        window.history.replaceState(
            {},
            document.title,
            url.pathname + url.search + url.hash
        );

    }catch(error){}

    return partner;

}

hydratePartnerSessionFromUrl();




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
