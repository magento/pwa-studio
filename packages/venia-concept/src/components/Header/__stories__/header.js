import React from 'react';
import { storiesOf } from '@storybook/react';

import Header from '../header';
import defaultClasses from '../header.css';
import 'src/index.css';
import { Adapter } from 'src/drivers';
import store from 'src/store';

const stories = storiesOf('Header', module);
const apiBase = new URL('/graphql', location.origin).toString();
const noop = () => {};

stories.add('Search Bar Closed', () => (
    <Adapter
        apiBase={apiBase}
        apollo={{ link: Adapter.apolloLink(apiBase) }}
        store={store}
    >
        <Header
            classes={defaultClasses}
            searchOpen={false}
            toggleSearch={noop}
        />
    </Adapter>
));

stories.add('Search Bar Open', () => (
    <Adapter
        apiBase={apiBase}
        apollo={{ link: Adapter.apolloLink(apiBase) }}
        store={store}
    >
        <Header
            classes={defaultClasses}
            searchOpen={true}
            toggleSearch={noop}
        />
    </Adapter>
));
