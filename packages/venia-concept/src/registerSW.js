import {
    registerWorkboxInstance,
    handleMessageFromSW
} from '@magento/venia-ui/lib/util/swUtils';

export const registerSW = () => {
    if (
        process.env.NODE_ENV === 'production' ||
        process.env.DEV_SERVER_SERVICE_WORKER_ENABLED
    ) {
        import('workbox-window')
            .then(({ Workbox }) => {
                const wb = new Workbox('/sw.js');

                wb.addEventListener('activated', event => {
                    if (!event.isUpdate) {
                        window.console.log(
                            'Service worker activated for the first time.'
                        );
                    } else {
                        window.console.log('Service worker updated.');
                    }
                    registerWorkboxInstance(wb);
                });

                wb.addEventListener('message', e => {
                    const { type, payload } = e.data;
                    handleMessageFromSW(type, payload);
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
