import { createElement } from 'react';
import { storiesOf } from '@storybook/react';
import Option from '../option';
import SwatchList from '../swatchList';

const stories = storiesOf('Product Options/Option', module);

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
    'Option', () => (
        <Option item={swatchItem()}/>
    )
);

stories.add(
    'Option disabled', () => (
        <Option
            item={swatchItemDisabled()}
        />
    )
);


stories.add(
    'Option selected', () => (
        <Option
            item={swatchItemSelected()}
        />
    )
);


stories.add(
    'Option list', () => (
        <SwatchList
            items={swatchItems}
        />
    )
);

