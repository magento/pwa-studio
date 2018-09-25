import { createElement } from 'react';
import { storiesOf } from '@storybook/react';
import Option from '../option';
import Options from '../options';
import swatchClasses from '../swatch.css';

const stories = storiesOf('Product Options/Swatch', module);

const randColor = () => Math.floor(Math.random()*255);

const randomSwatchItem = () => {
    return {
        item: {
            ...swatchItem,
            backgroundColor: `${randColor()} ${randColor()} ${randColor()}`,
        },
        classes: swatchClasses
    }
}

const swatchItem = {
    backgroundColor: '128 0 0',
    name: 'Swatch',
    onclick: () => console.log('Swatch')
}

const swatchItemDisabled = {
    ...swatchItem,
    isDisabled: true
}

const swatchItemSelected = {
    ...swatchItem,
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

