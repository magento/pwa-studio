import React from 'react';
import { storiesOf } from '@storybook/react';

import ErrorView from '../errorView';

const stories = storiesOf('Venia/ErrorView', module);

stories.add('Default', () => <ErrorView />);
stories.add('with props', () => (
    <ErrorView
        header={"I'm a teapot"}
        message={'Here is my handle, here is my spout'}
        buttonPrompt={'Tip me over and pour me out!'}
        onClick={() => alert('Poured!')}
    />
));
