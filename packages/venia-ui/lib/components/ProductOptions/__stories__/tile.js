import React from 'react';

import Tile from '../tile';

import { storiesOf } from '@storybook/react';

const stories = storiesOf('Components/ProductOptions/Tile', module);

const TileStory = props => {
    const onClick = () => console.log('Click!');
    return (
        <Tile
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
    return <TileStory />;
});

stories.add('Selected', () => {
    return <TileStory isSelected={true} />;
});