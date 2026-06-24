(function(){

'use strict';

let notifications = [];

let previousUnreadCount = 0;

let isRefreshing = false;

let timer = null;

const POLLING_INTERVAL = 15000;

const notificationAudio =

  new Audio(

'https://pwa.barkahgarment.com/assets/alertNotificationSound.mp3'

  );

notificationAudio.preload =
  'auto';

function getPartner(){

  try{

    return JSON.parse(

      localStorage.getItem(
        'began_partner'
      ) || '{}'

    );

  }catch(error){

    return {};

  }

}

function getApiUrl(){

  if(window.API_URL){
    return window.API_URL;
  }

  if(window.FORUM_API_URL){
    return window.FORUM_API_URL;
  }

  if(window.BEGAN_FORUM_API){
    return window.BEGAN_FORUM_API;
  }

  console.warn(
    '[NOTIFICATION REALTIME] API_URL not found'
  );

  return null;

}

function getUnreadCount(){

  return notifications.filter(

    function(notification){

      return !notification.isRead;

    }

  ).length;

}

function renderBadge(){

  const desktopBadge =

    document.getElementById(
      'began-notification-badge'
    );

  const mobileBadge =

    document.getElementById(
      'began-mobile-notification-badge'
    );

  const unreadCount =
    getUnreadCount();

  const show =
    unreadCount > 0;

  if(desktopBadge){

    desktopBadge.hidden =
      !show;

  }

  if(mobileBadge){

    mobileBadge.hidden =
      !show;

  }

}

function playSoundIfNeeded(){

  const unreadCount =
    getUnreadCount();

  if(

    previousUnreadCount > 0 &&

    unreadCount >
    previousUnreadCount

  ){

    notificationAudio.currentTime =
      0;

    notificationAudio.play()

      .catch(function(){});

  }

  previousUnreadCount =
    unreadCount;

}

async function load(){

  const partner =
    getPartner();

  if(!partner.id){
    return;
  }

  const apiUrl =
    getApiUrl();

  if(!apiUrl){
    return;
  }

  try{

    const response =

      await fetch(

        apiUrl +

        '?action=getNotifications' +

        '&partnerId=' +

        encodeURIComponent(
          partner.id
        )

      );

    const data =
      await response.json();

    notifications =

      data.notifications || [];

    playSoundIfNeeded();

    renderBadge();

  }catch(error){

    console.error(

      '[NOTIFICATION REALTIME]',

      error

    );

  }

}

async function refresh(){

  if(isRefreshing){
    return;
  }

  isRefreshing = true;

  try{

    await load();

  }finally{

    isRefreshing = false;

  }

}

function start(){

  refresh();

  if(timer){
    return;
  }

  timer = setInterval(

    refresh,

    POLLING_INTERVAL

  );

}

function stop(){

  if(!timer){
    return;
  }

  clearInterval(timer);

  timer = null;

}

document.addEventListener(

  'visibilitychange',

  function(){

    if(document.hidden){
      return;
    }

    refresh();

  }

);

window.BeganNotificationRealtime = {

  init: start,

  refresh: refresh,

  stop: stop,

  getUnreadCount: getUnreadCount

};

})();
