import {
    handleMessageFromSW,
    registerMessageHandler
} from '@magento/venia-ui/lib/util/swUtils';
import { HTML_UPDATE_AVAILABLE } from '@magento/venia-ui/lib/constants/messageTypes';
import app from '@magento/peregrine/lib/store/actions/app';

import store from './store';

function registerMessageHandlers() {
    registerMessageHandler(HTML_UPDATE_AVAILABLE, () => {
        store.dispatch(app.htmlUpdateAvailable());
    });
}

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

                registerMessageHandlers();
            })
            .catch(() => {
                window.console.warn('Failed to load Workbox.');
            });
    }
};
