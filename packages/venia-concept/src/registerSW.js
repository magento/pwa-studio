import { handleMessageFromSW } from '@magento/venia-ui/lib/util/swUtils';

export const registerSW = () => {
    if (
        process.env.NODE_ENV === 'production' ||
        process.env.DEV_SERVER_SERVICE_WORKER_ENABLED
    ) {
        navigator.serviceWorker
            .register('/sw.js')
            .then(() => {
                window.console.log('SW Registered');
            })
            .catch(() => {
                window.console.warn('Failed to register SW.');
            });

        navigator.serviceWorker.addEventListener('message', e => {
            const { type, payload } = e.data;
            handleMessageFromSW(type, payload, e);
        });
    }
};
