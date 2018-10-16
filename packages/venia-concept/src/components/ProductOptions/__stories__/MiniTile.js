import React from 'react';
import { storiesOf } from '@storybook/react';
import Option from '../option';
import Options from '../options';
import {
    miniTile,
    miniTileDisabled,
    miniTileDisabledAndSelected,
    miniTileSelected,
    miniTileOptions,
    miniTiles
} from '../mock_data';
import 'src/index.css';

const stories = storiesOf('Product Options/Mini Tile', module);

stories.add('Mini Tile', () => (
    <Option item={miniTile()} {...miniTileOptions}>
        Test
    </Option>
));

stories.add('Mini Tile disabled', () => (
    <Option item={miniTileDisabled} {...miniTileOptions}>
        Test
    </Option>
));

stories.add('Mini Tile selected', () => (
    <Option item={miniTileSelected} {...miniTileOptions}>
        Test
    </Option>
));

stories.add('Mini Tile disabled and selected', () => (
    <Option item={miniTileDisabledAndSelected} {...miniTileOptions}>
        Test
    </Option>
));

stories.add('Mini Tile list', () => <Options options={miniTiles} />);
