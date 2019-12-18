import {
    VALID_SERVICE_WORKER_ENVIRONMENT,
    handleMessageFromSW
} from '@magento/venia-ui/lib/util/swUtils';

export const registerSW = () => {
    if (VALID_SERVICE_WORKER_ENVIRONMENT) {
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
