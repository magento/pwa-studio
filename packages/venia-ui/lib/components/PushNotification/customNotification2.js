/*
* Line 1 below checks if the browser supports service workers.
* If yes, lines 2 and 3 set the worker to activate once the page is fully loaded. It’s a best practice to delay service worker activation until after the page is loaded. Low-end devices will get errors if workers are activated while the page is loading.
*/

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/service-worker.js');
  });
}

/* Below function checks permission is allowed or not */
function isPushSupported() {
  /*  checks if user has granted permission to Push notifications */
  if (Notification.permission === 'denied') {
    alert('User has blocked push notification.');
    return;
  }

  /*  Checks if current browser supports Push notification  */
  if (!('PushManager' in window)) {
    alert('Sorry, Push notification isn\'t supported in your browser.');
    return;
  }

  /*  Get `push notification` subscription id
  If `serviceWorker` is registered and ready  */
  navigator.serviceWorker.ready
    .then(function (registration) {
      registration.pushManager.getSubscription()
      .catch(function (error) {
        console.error('Error occurred while enabling push ', error);
      });
    });
}

/* Below function Request Permissions from user for push notifications */
function subscribePush() {
  //Subscribes user to Push notifications
  registration.pushManager.subscribe({
    userVisibleOnly: true //Set user to see every notification
  })
  .then(function (subscription) {
    toast('Subscribed successfully.');
    console.info('Push notification subscribed.');
    console.log(subscription);
  })
  .catch(function (error) {
    console.error('Push notification subscription error: ', error);
  });
}

/* Below function gives a way to user to unsubscribe push notifications */
function unsubscribePush() {
  navigator.serviceWorker.ready
  .then(function(registration) {
    //Get subscription
    registration.pushManager.getSubscription()
    .then(function (subscription) {
      //If no `push subscription`, then return
      if(!subscription) {
        alert('Unable to unregister push notification.');
        return;
      }

      //Unsubscribes user
      subscription.unsubscribe()
        .then(function () {
          toast('Unsubscribed successfully.');
          console.info('Push notification unsubscribed.');
        })
        .catch(function (error) {
          console.error(error);
        });
    })
    .catch(function (error) {
      console.error('Failed to unsubscribe push notification.');
    });
  })
}