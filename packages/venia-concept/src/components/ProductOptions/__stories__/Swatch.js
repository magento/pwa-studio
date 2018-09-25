import { createElement } from 'react';
import { storiesOf } from '@storybook/react';
import Option from '../option';
import Options from '../options';
import swatchClasses from '../swatch.css';

const stories = storiesOf('Product Options/Swatch', module);

const randColor = () => Math.floor(Math.random()*128);

const swatchItem = {
    backgroundColor: '128 0 0',
    name: 'Swatch',
    onclick: () => console.log('Swatch')
}

const randomSwatchItem = () => {
    return {
        item: {
            backgroundColor: `${randColor()} ${randColor()} ${randColor()}`,
            name: 'Swatch',
            onclick: () => console.log('Swatch')
        },
        classes: swatchClasses
    }
}

const swatchItemDisabled = {
    backgroundColor: '128 0 0',
    name: 'disabled',
    onclick: () => console.log('Swatch'),
    opts: {
        'disabled': 'disabled'
    }
}

const swatchItemSelected = {
    backgroundColor: '128 0 0',
    name: 'Selected',
    onclick: () => console.log('Swatch'),
    isSelected: true
}

const swatchItems = [randomSwatchItem(), randomSwatchItem(), randomSwatchItem(), randomSwatchItem(), randomSwatchItem(), randomSwatchItem(), randomSwatchItem()];

stories.add(
    'Swatch', () => (
        <Option
            item={swatchItem}
            classes={swatchClasses}
        />
    )
);

stories.add(
    'Swatch disabled', () => (
        <Option
            item={swatchItemDisabled}
            classes={swatchClasses}
        />
    )
);


stories.add(
    'Swatch selected', () => (
        <Option
            item={swatchItemSelected}
            classes={swatchClasses}
        />
    )
);


stories.add(
    'Swatch options', () => (
        <Options
            options={swatchItems}
        />
    )
);

