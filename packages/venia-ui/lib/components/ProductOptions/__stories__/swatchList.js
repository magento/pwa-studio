import React from 'react';

import SwatchList from '../swatchList';

import { storiesOf } from '@storybook/react';

const stories = storiesOf('Components/ProductOptions/SwatchList', module);

const SwatchListStory = props => {
    const onClick = () => console.log('Click!');
    return (
        <SwatchList
            items={[
                {
                    label: 'Red',
                    value_index: 0,
                    swatch_data: {
                        value: '#f00505'
                    }
                },
                {
                    label: 'Green',
                    value_index: 1,
                    swatch_data: {
                        value: '#43f005'
                    }
                },
                {
                    label: 'Blue',
                    value_index: 2,
                    swatch_data: {
                        value: '#0505f0'
                    }
                },
                {
                    label: 'Yellow',
                    value_index: 3,
                    swatch_data: {
                        value: '#FFFF00'
                    }
                }
            ]}
            selectedValue={{
                label: 'Green'
            }}
            onSelectionChange={onClick}
            getItemKey={onClick}
            {...props}
        />
    );
};

stories.add('Base', () => {
    return <SwatchListStory />;
});