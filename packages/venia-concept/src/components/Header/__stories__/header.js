import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { storiesOf } from '@storybook/react';
import { Header } from '../header';
import defaultClasses from '../header.css';
import 'src/index.css';

import { store } from 'src/store';

const stories = storiesOf('Header', module);

stories.add('Search Bar Closed', () => (
    <Provider store={store}>
        <Router>
            <Header classes={defaultClasses} searchOpen={false} />
        </Router>
    </Provider>
));

stories.add('Search Bar Open', () => (
    <Provider store={store}>
        <Router>
            <Header classes={defaultClasses} searchOpen={true} />
        </Router>
    </Provider>
));
