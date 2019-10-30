import React from 'react';
import { storiesOf } from '@storybook/react';

import Header from '../header';
import defaultClasses from '../header.css';

const stories = storiesOf('Header', module);
const noop = () => {};

stories.add('Search Bar Closed', () => (
    <Header
        classes={defaultClasses}
        searchOpen={false}
        toggleSearch={noop}
    />
));

stories.add('Search Bar Open', () => (
    <Header
        classes={defaultClasses}
        searchOpen={true}
        toggleSearch={noop}
    />
));
