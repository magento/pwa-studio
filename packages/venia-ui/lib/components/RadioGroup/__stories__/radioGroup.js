import React from 'react';
import { storiesOf } from '@storybook/react';

import RadioGroup from '../radioGroup';

const stories = storiesOf('Components/RadioGroup', module);

const items = [
    { label: 'one', value: '1' },
    { label: 'holy moly two has a lot of content', value: '2' },
    { label: 'three', value: '3' },
    { label: 'four', value: '4' },
    { label: 'five', value: '5' },
    { label: 'six six six six six', value: '6' },
    { label: 'this 7th one', value: '7' }
];

stories.add('Default', () => {
    return <RadioGroup items={items} />;
});

stories.add('With a message', () => {
    return <RadioGroup items={items} message={'I am a message.'} />;
});

stories.add('with disabled items', () => {
    return (
        <RadioGroup
            items={[
                { label: 'one', value: '1' },
                { label: 'two', value: '2', disabled: true },
                { label: 'three', value: '3' }
            ]}
        />
    );
});

stories.add('Constrained width', () => {
    return (
        <div style={{ backgroundColor: 'aliceblue', width: '360px' }}>
            <RadioGroup items={items} />
        </div>
    );
});
