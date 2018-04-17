import Peregrine from '@magento/peregrine';

import getNamedExport from 'src/util/getNamedExport';
import './index.css';

const app = new Peregrine();
const container = document.getElementById('root');

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register(process.env.SERVICE_WORKER_FILE_NAME)
            .then(registration => {
                console.log('Service worker registered: ', registration);
            })
            .catch(error => {
                console.log('Service worker registration failed: ', error);
            });
    });
}

getNamedExport(import('src/components/App'))
    .then(App => {
        app.component = App;
        app.mount(container);
    })
    .catch(error => {
        throw error;
    });

export default app;
