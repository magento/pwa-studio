import tileClasses from './tile.css';
import miniTileClasses from './miniTile.css';

export const tileItem = (text='test') => {
    return {
        backgroundColor: '0 0 0',
        name: text,
        onclick: () => console.log('hey')
    }
}

export const tileItemDisabled = () => {
    return {
        ...tileItem(),
        isDisabled: true
    }
}

export const tileItemSelected = () => {
    return {
        ...tileItem(),
		isSelected: true
    }
}

export const tileListItem = (text='test') => {
    return {
        item: {
            ...tileItem(text),
            isSelected: true
        },
        classes: tileClasses,
        children: text
    }
}


export const tileItems = () => {
    let items = [];
    for( let i = 0; i < 20; i+=2) {
        items.push(tileListItem(i.toString()));
    }
    return items;
}

export const miniTile = {
    backgroundColor: '0 0 0',
    name: 'disabled',
    onclick: () => console.log('hey')
}

export const miniTileDisabled = {
    ...miniTile,
    isDisabled: true
}

export const miniTileSelected = {
    ...miniTile,
    isSelected: true
}

export const miniTileItem = () => {
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

export const miniTiles = [miniTileItem(), miniTileItem(), miniTileItem(), miniTileItem(), miniTileItem(), miniTileItem() ];

