import {
    VALID_SERVICE_WORKER_ENVIRONMENT,
    handleMessageFromSW
} from '@magento/peregrine/lib/util/swUtils';

export const registerSW = () => {

    /*
    *   urlBase64ToUnit8Array function takes Vapid public key from determineAppServerKey() and converts it into applicationServerKey ( array of string )
    */
    function urlBase64ToUnit8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
      
        const rowData = window.atob(base64);
        const outputArray = new Uint8Array(rowData.length);
      
        for(let i=0; i < rowData.length; i++) {
          outputArray[i] = rowData.charCodeAt(i);
        }
        return outputArray;
      }

    /*
    *   determineAppServerKey function decides Vapid public key
    */
    function determineAppServerKey() {
        var vapidPublicKey = "BKPiCScwtjE_fhIsgciiFF7_RfNungJgpX9EQYTsufBL6Hkue6NJsfxx6ZhqOebUdNZgXlRw-Wh5x5hdbg8q3Qw"
        return urlBase64ToUnit8Array(vapidPublicKey);
      }

    if (!VALID_SERVICE_WORKER_ENVIRONMENT && globalThis.navigator) {
        window.navigator.serviceWorker
            .register('/sw.js')
            .then(async (response) => {
                console.log('SW Registered trunnnnn');
                const subscription = await response.pushManager.getSubscription();
                return await response.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: determineAppServerKey()
                });
            })
            .catch(() => {
                /**
                 * console.* statements are removed by webpack
                 * in production mode. window.console.* are not.
                 */
                window.console.warn('Failed to register SW.akshattt');
            });

        navigator.serviceWorker.addEventListener('message', e => {
            const { type, payload } = e.data;
            handleMessageFromSW(type, payload, e);
        });
    }
};
