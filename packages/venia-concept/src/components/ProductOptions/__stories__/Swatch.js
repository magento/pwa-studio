import React from 'react';
import { storiesOf } from '@storybook/react';
import Option from '../option';
import Options from '../options';
import {
    swatchItem,
    swatchItemDisabled,
    swatchItemSelected,
    swatchItems,
    swatchOptions
} from '../mock_data';
import 'src/index.css';

const stories = storiesOf('Product Options/Swatch', module);

stories.add('Swatch', () => <Option item={swatchItem} {...swatchOptions} />);

stories.add('Swatch disabled', () => (
    <Option item={swatchItemDisabled} {...swatchOptions} />
));

stories.add('Swatch selected', () => (
    <Option item={swatchItemSelected} {...swatchOptions} />
));

stories.add('Swatch options', () => <Options options={swatchItems} />);
