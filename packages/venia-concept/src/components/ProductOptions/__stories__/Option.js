import React from 'react';
import { storiesOf } from '@storybook/react';
import Option from '../option';
import optionClasses from '../option.css';
import 'src/index.css';

const stories = storiesOf('Product Options/Option', module);

const randColor = () => Math.floor(Math.random()*128);

const swatchItem = () => {
    return {
        backgroundColor: `${randColor()} ${randColor()} ${randColor()}`,
        name: 'hey',
        onclick: () => console.log('hey')
    }
}


const swatchItemDisabled = () => {
    return {
        backgroundColor: `${randColor()} ${randColor()} ${randColor()}`,
        name: 'disabled',
        onclick: () => console.log('hey'),
        isDisabled: true
    }
}

const swatchItemSelected = () => {
    return {
		backgroundColor: `${randColor()} ${randColor()} ${randColor()}`,
		name: 'Selected',
		onclick: () => console.log('hey'),
		isSelected: true
    }
}

stories.add(
    'Option', () => (
        <Option
            item={swatchItem()}
            classes={optionClasses}
        />
    )
);

stories.add(
    'Option disabled', () => (
        <Option
            item={swatchItemDisabled()}
            classes={optionClasses}
        />
    )
);


stories.add(
    'Option selected', () => (
        <Option
            item={swatchItemSelected()}
            classes={optionClasses}
        />
    )
);
