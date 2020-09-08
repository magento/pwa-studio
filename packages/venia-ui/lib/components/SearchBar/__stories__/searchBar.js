import React from 'react';
import { storiesOf } from '@storybook/react';
import { IntlProvider } from 'react-intl';

import SearchBar from '../searchBar';
import defaultClasses from '../searchBar.css';

const stories = storiesOf('Components/SearchBar', module);

stories.add('Search Bar', () => (
    <IntlProvider locale="en-US">
        <SearchBar classes={defaultClasses} isOpen={true} />
    </IntlProvider>
));
