import {
    SHOULD_ENABLE_SERVICE_WORKER,
    handleMessageFromSW
} from '@magento/venia-ui/lib/util/swUtils';

// process.env.DEV_SERVER_SERVICE_WORKER_ENABLED is a string representation of a boolean value
export const registerSW = () => {
    if (SHOULD_ENABLE_SERVICE_WORKER) {
        navigator.serviceWorker
            .register('/sw.js')
            .then(() => {
                console.log('SW Registered');
            })
            .catch(() => {
                /**
                 * console.* statements are removed by webpack
                 * in production mode. window.console.* are not.
                 */
                window.console.warn('Failed to register SW.');
            });

        navigator.serviceWorker.addEventListener('message', e => {
            const { type, payload } = e.data;
            handleMessageFromSW(type, payload, e);
        });
    }
};
