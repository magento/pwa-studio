import React from 'react';
import { storiesOf } from '@storybook/react';

import { useAppContext } from '@magento/peregrine/lib/context/app';

import Header from '../header';
import defaultClasses from '../header.css';

const stories = storiesOf('Venia/Header', module);

stories.add('Search Bar Closed', () => <Header classes={defaultClasses} />);

stories.add('Search Bar Open', () => {
    // Stories are wrapped in AppContextProvider in `./storybook/config.js`.
    const Wrapper = () => {
        const [, api] = useAppContext();
        const { toggleSearch } = api;

        // Open the search
        toggleSearch();

        return <Header classes={defaultClasses} />;
    };

    return <Wrapper />;
});
