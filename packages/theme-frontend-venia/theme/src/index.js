import Peregrine from '@magento/peregrine';

import { extract } from 'src/utils';

import './index.css';

const app = new Peregrine();
const container = document.getElementById('root');

extract(import('src/view/App'))
    .then(App => {
        app.component = App;
        app.mount(container);
    })
    .catch(error => {
        throw error;
    });

export default app;
