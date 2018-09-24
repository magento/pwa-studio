import { createElement } from 'react';
import { storiesOf } from '@storybook/react';
import Swatch from '../swatch';
import SwatchList from '../swatchList';

const stories = storiesOf('Product Options/Swatch', module);

const randColor = () => Math.floor(Math.random()*128);

const swatchItem = () => {
    return {
        id: `${randColor()} ${randColor()} ${randColor()}`,
        name: 'hey',
        onclick: () => console.log('hey')
    }
}


const swatchItemDisabled = () => {
    return {
        id: `${randColor()} ${randColor()} ${randColor()}`,
        name: 'disabled',
        onclick: () => console.log('hey'),
        opts: {
			'disabled': 'disabled'
			}
    }
}

const swatchItemSelected = () => {
    return {
		id: `${randColor()} ${randColor()} ${randColor()}`,
		name: 'Selected',
		onclick: () => console.log('hey'),
		isSelected: true
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
            item={swatchItemDisabled()}
        />
    )
);


stories.add(
    'Swatch selected', () => (
        <Swatch
            item={swatchItemSelected()}
        />
    )
);


stories.add(
    'Swatch list', () => (
        <SwatchList
            items={swatchItems}
        />
    )
);

