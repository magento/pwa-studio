import { handleMessageFromSW } from '@magento/venia-ui/lib/util/swUtils';

export const registerSW = () => {
    if (
        process.env.NODE_ENV === 'production' ||
        process.env.DEV_SERVER_SERVICE_WORKER_ENABLED
    ) {
        import('workbox-window')
            .then(({ Workbox }) => {
                const wb = new Workbox('/sw.js');

                navigator.serviceWorker.addEventListener('message', e => {
                    const { type, payload } = e.data;
                    handleMessageFromSW(type, payload, e);
                });

                wb.register()
                    .then(() => {
                        window.console.log('SW Registered');
                    })
                    .catch(() => {
                        window.console.warn('Failed to register SW.');
                    });
            })
            .catch(() => {
                window.console.warn('Failed to load Workbox.');
            });
    }
};
