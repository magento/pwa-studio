import React from 'react';

import Swatch from '../swatch';

import { storiesOf } from '@storybook/react';

const stories = storiesOf('Components/ProductOptions/Swatch', module);

const SwatchStory = props => {
    const onClick = () => console.log('Click!');
    return (
        <Swatch
            item={{
                label: 'Test Label',
                value_index: 2
            }}
            onClick={onClick}
            {...props}
        />
    );
};

stories.add('Base', () => {
    return <SwatchStory />;
});

stories.add('Base (with swatch_data)', () => {
    const item = {
        label: 'Test Label',
        value_index: 2,
        swatch_data: {
            value: '#fee1d2'
        }
    };
    return <SwatchStory item={item} />;
});

stories.add('Selected', () => {
    return <SwatchStory isSelected={true} />;
});
