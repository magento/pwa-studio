///////////////////////
//Tile Item Mock Data//
///////////////////////

const baseOptions = {
    isDisabled: false,
    label: 'test',
    value_index: 0
};

export const tileItem = (text = 'test') => {
    return {
        backgroundColor: '0 0 0',
        name: text,
        ...baseOptions
    };
};

export const tileItemDisabled = () => {
    return {
        ...tileItem(),
        isDisabled: true
    };
};

export const tileItemSelected = () => {
    return {
        ...tileItem(),
        isSelected: true
    };
};

export const tileItemDisabledAndSelected = () => {
    return {
        ...tileItem(),
        isDisabled: true,
        isSelected: true
    };
};

export const tileOptions = (text = 'test') => {
    return {
        attributeCode: 'size',
        handleClick: () => {
            window.alert('hello world');
        },
        children: text
    };
};

export const tileItems = Array(10)
    .fill(undefined)
    .map((item, index) => {
        return {
            item: tileItem(),
            ...tileOptions(index.toString())
        };
    });

///////////////////////
//Mini Tile Mock Data//
///////////////////////

export const miniTile = {
    backgroundColor: '0 0 0',
    name: 'disabled',
    ...baseOptions
};

export const miniTileDisabled = {
    ...miniTile,
    isDisabled: true
};

export const miniTileSelected = {
    ...miniTile,
    isSelected: true
};

export const miniTileDisabledAndSelected = {
    ...miniTile,
    isSelected: true,
    isDisabled: true
};

export const miniTileOptions = () => {
    return {
        handleClick: () => {
            window.alert('hello world');
        },
        attributeCode: 'sleeve',
        children: 'Test'
    };
};

export const miniTiles = Array(4)
    .fill(undefined)
    .map(() => {
        return {
            item: miniTile,
            ...miniTileOptions()
        };
    });

////////////////////
//Swatch Mock Data//
////////////////////

const randColor = () => Math.floor(Math.random() * 255);

const randomSwatchItem = () => {
    return {
        item: {
            ...swatchItem,
            swatchColor: `${randColor()} ${randColor()} ${randColor()}`
        },
        attributeCode: 'color',
        handleClick: () => {
            window.alert('hello world');
        }
    };
};

export const swatchItem = {
    swatchColor: `${randColor()} ${randColor()} ${randColor()}`,
    name: 'Swatch',
    onclick: () => console.log('Swatch'),
    ...baseOptions
};

export const swatchItemDisabled = {
    ...swatchItem,
    isDisabled: true
};

export const swatchItemSelected = {
    ...swatchItem,
    isSelected: true
};

export const swatchOptions = {
    attributeCode: 'color',
    handleClick: () => {
        window.alert('hello world');
    }
};

export const swatchItems = Array(8)
    .fill(undefined)
    .map(() => {
        return randomSwatchItem();
    });
