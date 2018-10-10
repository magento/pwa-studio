import React from 'react';
import { storiesOf } from '@storybook/react';
import Option from '../option';
import Options from '../options';
import swatchClasses from '../swatch.css';
import { swatchItem, swatchItemDisabled, swatchItemSelected, swatchItems } from '../mock_data';
import 'src/index.css';

const stories = storiesOf('Product Options/Swatch', module);

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

