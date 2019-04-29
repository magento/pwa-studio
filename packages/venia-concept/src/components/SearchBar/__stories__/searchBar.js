import React from 'react';
import { storiesOf } from '@storybook/react';
import { SearchBar } from '../searchBar';
import defaultClasses from '../searchBar.css';

const stories = storiesOf('SearchBar', module);

stories.('Search Bar', () => (
    <SearchBar classes={defaultClasses} isOpen={false} />
));
