import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { storiesOf } from '@storybook/react';
import Header from '../header';
import defaultClasses from '../header.css';
import shrink from '../shrink.css';
import grow from '../grow.css';
import outline from '../outline.css';
import arrow from '../arrow.css';
import 'src/index.css';
//import { createStore } from 'redux';
//import { app } from '../../../reducers/app';

import { store } from '../../../store';

const stories = storiesOf('Header', module);

stories.add('Color', () => (
    <Router>
        <Provider store={store}>
            <Header classes={defaultClasses} />
        </Provider>
    </Router>
));

stories.add('Shrink', () => (
    <Router>
        <Provider store={store}>
            <Header classes={shrink} />
        </Provider>
    </Router>
));

stories.add('Grow', () => (
    <Router>
        <Provider store={store}>
            <Header classes={grow} />
        </Provider>
    </Router>
));

stories.add('Outline', () => (
    <Router>
        <Provider store={store}>
            <Header classes={outline} />
        </Provider>
    </Router>
));

stories.add('Arrow', () => (
    <Router>
        <Provider store={store}>
            <Header classes={arrow} />
        </Provider>
    </Router>
));
