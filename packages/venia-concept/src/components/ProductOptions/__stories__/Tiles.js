import { createElement } from 'react';
import { storiesOf } from '@storybook/react';
import Tile from '../tile';
import TileList from '../tileList';


const stories = storiesOf('Product Options/Tile', module);

const tileItems = () => {
    const items = [];
    for(let i = 0; i < 10; i++) {
        const newItem = {};
        newItem['id'] = i;
        newItem['name'] = 'Test';
        items.push(newItem);
    };
    return items;
}



const tileItem = {
    id: '0',
    name: 'Test'
}


stories.add(
    'Tile', () => (
        <Tile
            name={'test'}
            item={tileItem}
        />
    )
);

stories.add(
    'Tile list', () => (
        <TileList
            items={tileItems()}
        />
    )
);
