import React from 'react';
import { storiesOf } from '@storybook/react';
import SearchBar from '../searchBar';
import defaultClasses from '../searchBar.css';

const stories = storiesOf('Components/SearchBar', module);

const historyMock = {
    push: () => {}
};

stories.add('Search Bar', () => (
    <SearchBar
        classes={defaultClasses}
        isOpen={true}
        location={{}}
        history={historyMock}
    />
));
