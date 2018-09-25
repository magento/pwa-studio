import { createElement } from 'react';
import { storiesOf } from '@storybook/react';
import Option from '../option';
import Options from '../options';
import miniTileClasses from '../miniTile.css';

const stories = storiesOf('Product Options/Mini Tile', module);

const miniTile = {
    backgroundColor: '0 0 0',
    name: 'disabled',
    onclick: () => console.log('hey')
}

const miniTileDisabled = {
    ...miniTile,
    isDisabled: true
}

const miniTileSelected = {
    ...miniTile,
    isSelected: true
}

const miniTileItem = () => {
    return (
        {
            item: {
                ...miniTile
            },
            classes: miniTileClasses,
            children: 'Test'
        }
    );
}

const miniTiles = [miniTileItem(), miniTileItem(), miniTileItem(), miniTileItem(), miniTileItem(), miniTileItem() ];

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
    'Mini Tile list', () => (
        <Options
            options={miniTiles}
            >
        </Options>
    )
);


