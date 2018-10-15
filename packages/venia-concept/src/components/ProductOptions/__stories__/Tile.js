import React from 'react';
import { storiesOf } from '@storybook/react';
import Option from '../option';
import Options from '../options';
import tileClasses from '../tile.css';
import {
    tileItem,
    tileItemDisabled,
    tileItemSelected,
    tileItemDisabledAndSelected,
    tileItems
} from '../mock_data';
import 'src/index.css';

const stories = storiesOf('Product Options/Tile', module);

stories.add('Tile', () => (
    <Option item={tileItem()} classes={tileClasses}>
        {' '}
        Test{' '}
    </Option>
));

stories.add('Tile disabled', () => (
    <Option name={'test'} item={tileItemDisabled()} classes={tileClasses}>
        {' '}
        Test{' '}
    </Option>
));

stories.add('Tile selected', () => (
    <Option name={'test'} item={tileItemSelected()} classes={tileClasses}>
        {' '}
        Test{' '}
    </Option>
));

stories.add('Tile selected and disabled', () => (
    <Option
        name={'test'}
        item={tileItemDisabledAndSelected()}
        classes={tileClasses}
    >
        {' '}
        Test{' '}
    </Option>
));

stories.add('Tile list', () => <Options options={tileItems} />);
