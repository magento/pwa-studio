import { createElement } from 'react';
import { storiesOf } from '@storybook/react';
import Option from '../option';
import Options from '../options';

const stories = storiesOf('Product Options/Option', module);

const randColor = () => Math.floor(Math.random()*128);

const swatchItem = () => {
    return {
        id: `${randColor()} ${randColor()} ${randColor()}`,
        name: 'hey',
        onclick: () => console.log('hey')
    }
}

const swatchItems = [swatchItem(), swatchItem(), swatchItem(), swatchItem(), swatchItem(), swatchItem(), swatchItem()];

const swatchOption = {
    name: 'Swatches',
    type: 'color',
    values: swatchItems
}

const tileOption = {
    name: 'test',
    values: swatchItems
}

const options = [tileOption, swatchOption]


stories.add(
    'Swatch Option', () => (
        <Option
            {...swatchOption}
        />
    )
);

stories.add(
    'Tile Option', () => (
        <Option
            {...tileOption}
        />
    )
);




stories.add(
    'Options', () => (
        <Options
            options={options}
        />
    )
);

