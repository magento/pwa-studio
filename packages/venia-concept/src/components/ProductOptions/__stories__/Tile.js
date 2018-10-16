import React from 'react';
import { storiesOf } from '@storybook/react';
import Option from '../option';
import Options from '../options';
import {
    tileItem,
    tileOptions,
    tileItemDisabled,
    tileItemSelected,
    tileItemDisabledAndSelected,
    tileItems
} from '../mock_data';
import 'src/index.css';

const stories = storiesOf('Product Options/Tile', module);

stories.add('Tile', () => (
    <Option item={tileItem()} {...tileOptions()}>
        <p>Test</p>
    </Option>
));

stories.add('Tile disabled', () => (
    <Option name={'test'} item={tileItemDisabled()} {...tileOptions()}>
        {' '}
        Test{' '}
    </Option>
));

stories.add('Tile selected', () => (
    <Option name={'test'} item={tileItemSelected()} {...tileOptions()}>
        {' '}
        Test{' '}
    </Option>
));

stories.add('Tile selected and disabled', () => (
    <Option
        name={'test'}
        item={tileItemDisabledAndSelected()}
        {...tileOptions()}
    >
        {' '}
        Test{' '}
    </Option>
));

stories.add('Tile list', () => <Options options={tileItems} />);
