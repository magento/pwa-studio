import React from 'react';
import { storiesOf } from '@storybook/react';

import SearchBar from '../searchBar';
import defaultClasses from '../searchBar.module.css';

const stories = storiesOf('Components/SearchBar', module);

stories.add('Search Bar', () => (
    <SearchBar classes={defaultClasses} isOpen={true} />
));
