import { createElement } from 'react';
import { storiesOf } from '@storybook/react';
import Swatch from '../swatch';
import SwatchList from '../swatchList';
import Option from '../option';
import Options from '../options';

const stories = storiesOf('Product Options/Swatch', module);

const randColor = () => Math.floor(Math.random()*128);

const swatchItem = () => {
    return {
        id: `${randColor()} ${randColor()} ${randColor()}`,
        name: 'hey',
        onclick: () => console.log('hey')
    }
}

const swatchItems = [swatchItem(), swatchItem(), swatchItem(), swatchItem(), swatchItem(), swatchItem(), swatchItem()];

stories.add(
    'Swatch', () => (
        <Swatch item={swatchItem()}/>
    )
);

stories.add(
    'Swatch disabled', () => (
        <Swatch
            item={swatchItem()}
        />
    )
);

stories.add(
    'Swatch list', () => (
        <SwatchList items={swatchItems}
        />
    )
);

