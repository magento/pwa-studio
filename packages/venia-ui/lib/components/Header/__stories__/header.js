import React from 'react';
import { storiesOf } from '@storybook/react';

import Header from '../header';
import defaultClasses from '../header.module.css';

const stories = storiesOf('Venia/Header', module);

stories.add('Default', () => {
    return <Header classes={defaultClasses} />;
});
