import { createElement } from 'react';
import { storiesOf } from '@storybook/react';
import Option from '../option';
import swatchClasses from '../swatch.css';

const stories = storiesOf('Product Options/Swatch', module);

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
        opts: {
			'disabled': 'disabled'
			}
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
    'Swatch', () => (
        <Option
            item={swatchItem()}
            classes={swatchClasses}
        />
    )
);

stories.add(
    'Swatch disabled', () => (
        <Option
            item={swatchItemDisabled()}
            classes={swatchClasses}
        />
    )
);


stories.add(
    'Swatch selected', () => (
        <Option
            item={swatchItemSelected()}
            classes={swatchClasses}
        />
    )
);
