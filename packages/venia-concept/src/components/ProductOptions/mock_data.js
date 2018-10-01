import tileClasses from './tile.css';
import miniTileClasses from './miniTile.css';
import swatchClasses from './swatch.css';

///////////////////////
//Tile Item Mock Data//
///////////////////////

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
        },
        classes: tileClasses,
        children: text
    }
}


///////////////////////
//Mini Tile Mock Data//
///////////////////////

export const tileItems = Array(10).fill(undefined).map((item, index) => {
    return tileListItem(index.toString());
})

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

export const miniTiles = Array(4).fill(undefined).map(() => {
    return miniTileItem();
})

////////////////////
//Swatch Mock Data//
////////////////////

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

export const swatchItem = {
    backgroundColor: '128 0 0',
    name: 'Swatch',
    onclick: () => console.log('Swatch')
}

export const swatchItemDisabled = {
    ...swatchItem,
    isDisabled: true
}

export const swatchItemSelected = {
    ...swatchItem,
    isSelected: true
}

export const swatchItems = Array(8).fill(undefined).map(() => {
    return randomSwatchItem();
})

