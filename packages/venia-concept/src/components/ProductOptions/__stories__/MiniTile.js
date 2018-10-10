import React from 'react';
import { storiesOf } from '@storybook/react';
import Option from '../option';
import Options from '../options';
import miniTileClasses from '../miniTile.css';
import { miniTile, miniTileDisabled, miniTileDisabledAndSelected, miniTileSelected, miniTiles} from '../mock_data';
import 'src/index.css';

const stories = storiesOf('Product Options/Mini Tile', module);

stories.add(
    'Mini Tile', () => (
        <Option
            item={miniTile}
            classes={miniTileClasses}>
            Test
        </Option>
    )
);

stories.add(
    'Mini Tile disabled', () => (
        <Option
            item={miniTileDisabled}
            classes={miniTileClasses}>
            Test
        </Option>
    )
);


stories.add(
    'Mini Tile selected', () => (
        <Option
            item={miniTileSelected}
            classes={miniTileClasses}>
            Test
        </Option>
    )
);

stories.add(
    'Mini Tile disabled and selected', () => (
        <Option
            item={miniTileDisabledAndSelected}
            classes={miniTileClasses}>
            Test
        </Option>
    )
);



stories.add(
    'Mini Tile list', () => (
        <Options
            options={miniTiles}
            >
        </Options>
    )
);


