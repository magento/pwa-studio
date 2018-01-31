import Peregrine from '@magento/peregrine';

import { extract } from 'src/utils';

import './index.css';

const app = new Peregrine();
const container = document.getElementById('root');

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register(`${process.env.THEME_PATH}/sw.js`)
            .then(registration => {
                console.log('Service worker registered: ', registration);
            })
            .catch(error => {
                console.log('Service worker registration failed: ', error);
            });
    });
}

extract(import('src/view/App'))
    .then(App => {
        app.component = App;
        app.mount(container);
    })
    .catch(error => {
        throw error;
    });

export default app;
