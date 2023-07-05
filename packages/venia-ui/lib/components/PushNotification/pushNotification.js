// import { subscribe } from "graphql";

// Note: below code should move to new file i.e. - subscribeUser.js
/*  You must check for subscription every time user accesses your app, 
  * cause subscription ( subscriptionObject ) may change 
*/
navigator.serviceWorker.ready.then(reg => {
  reg.pushManager.getSubscription.then(sub => {
    if(sub == undefined) {
      // ask user to subscribe
    } else {
      // user is already subscribed, just update your database
    }
  });
});

// 

// Note: below code must be callled in App's main JavaScript
/*  Subscribe to PUSH SERVICE
  * This request goes to the agent ( browser )
  * Browser will return serviceWorkerRegistration object
  * use serviceWorkerRegistration object to access pushManager API
  * and request to subscribe to the PUSH SERVICE
  * PUSH SERVICE returns a subscription object ( which includes a URL and Public key )
  * save this ( subscription object ) data to your server
*/
navigator.serviceWorker.getRegistration().then(reg => {
    reg.pushManager.subscribe({
      userVisibleOnly: true
    }).then(sub => {
      // send sub.toJSON() to server
    });
});

// move below code in new file sendPushNotifications.js
/* Here, we are using Google's webPush Library to send notifications from Node.js server

*/
const webPush = require('web-push');

function sendMessages(pushSubscription) {
  const payload = "here is payload";
  const options = {
    // gcmAPIKey = 'Your server key'
    TTL: 60 // max time for push service to retry delivery
  };
  webPush.sendNotification(pushSubscription, payload, options);
}
