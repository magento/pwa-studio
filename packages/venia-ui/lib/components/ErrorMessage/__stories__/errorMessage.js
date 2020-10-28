/* eslint-disable react/jsx-no-literals */
import React from 'react';
import { storiesOf } from '@storybook/react';

import ErrorMessage from '../errorMessage';

const stories = storiesOf('Components/ErrorMessage', module);

/*
 *  Story definitions.
 */

stories.add('Default', () => {
    return <ErrorMessage>Custom text</ErrorMessage>;
});
