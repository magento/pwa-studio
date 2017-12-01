import { createElement } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import store from 'src/store';
import App from 'src/view/App';

import './index.css';

const app = (
    <Provider store={store}>
        <Router>
            <App />
        </Router>
    </Provider>
);

document.addEventListener('DOMContentLoaded', () =>
    render(app, document.getElementById('root'))
);
