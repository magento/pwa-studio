import { createElement } from 'react';
import ReactDOM from 'react-dom';
import bootstrap from '@magento/peregrine';

import reducer from 'src/store/reducers/app';
import './index.css';

const { Provider, store } = bootstrap({
    apiBase: new URL('/graphql', location.origin).toString(),
    __tmp_webpack_public_path__: __webpack_public_path__
});

// add the `app` reducer for global state
store.addReducer('app', reducer);

ReactDOM.render(<Provider />, document.getElementById('root'));

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

export { store };
