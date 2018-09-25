import { createElement } from 'react';
import { storiesOf } from '@storybook/react';
import Option from '../option';
import tileClasses from '../tile.css';

const stories = storiesOf('Product Options/Tile', module);

const randColor = () => Math.floor(Math.random()*128);

const tileItem = () => {
    return {
        backgroundColor: `${randColor()} ${randColor()} ${randColor()}`,
        name: 'hey',
        onclick: () => console.log('hey')
    }
}

const tileItemDisabled = () => {
    return {
        backgroundColor: `${randColor()} ${randColor()} ${randColor()}`,
        name: 'disabled',
        onclick: () => console.log('hey'),
        opts: {
			'disabled': 'disabled'
			}
    }
}

const tileItemSelected = () => {
    return {
		backgroundColor: `${randColor()} ${randColor()} ${randColor()}`,
		name: 'Selected',
		onclick: () => console.log('hey'),
		isSelected: true
    }
}

stories.add(
    'Tile', () => (
        <Option
            item={tileItem()}
            classes={tileClasses}
        > Test </Option>
    )
);

stories.add(
    'Tile disabled', () => (
        <Option
            name={'test'}
            item={tileItemDisabled()}
            classes={tileClasses}
        > Test </Option>
    )
);

stories.add(
    'Tile selected', () => (
        <Option
            name={'test'}
            item={tileItemSelected()}
            classes={tileClasses}
        > Test </Option>
    )
);
