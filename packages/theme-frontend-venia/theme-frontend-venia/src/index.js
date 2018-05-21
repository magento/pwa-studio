import Peregrine from '@magento/peregrine';

import './index.css';

const app = new Peregrine({
    apiBase: new URL('/graphql', location.origin).toString(),
    __tmp_webpack_public_path__: __webpack_public_path__
});

app.mount(document.getElementById('root'));

if (process.env.SERVICE_WORKER && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register(process.env.SERVICE_WORKER)
            .then(registration => {
                console.log('Service worker registered: ', registration);
            })
            .catch(error => {
                console.log('Service worker registration failed: ', error);
            });
    });
}

export default app;
