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
        attributeCode: 'fashion_size',
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
        handleClick: () => {
            console.log('hello world');
        },
        children: text,
        attributeCode: 'fashion_size'
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

export const miniTile = () => {
    return {
        backgroundColor: '0 0 0',
        name: 'disabled',
        attributeCode: 'fashion_material',
        ...baseOptions
    };
};

export const miniTileDisabled = {
    ...miniTile(),
    isDisabled: true
};

export const miniTileSelected = {
    ...miniTile(),
    isSelected: true
};

export const miniTileDisabledAndSelected = {
    ...miniTile(),
    isSelected: true,
    isDisabled: true
};

export const miniTileOptions = {
    attributeCode: 'fashion_material',
    children: 'Test'
};

export const miniTiles = Array(4)
    .fill(undefined)
    .map(() => {
        return {
            item: miniTile(),
            ...miniTileOptions
        };
    });

////////////////////
//Swatch Mock Data//
////////////////////

const randColor = () => {
    let num = Math.floor(Math.random() * 255);
    let numString = num.toString(16);
    if (numString.length == 1) {
        // Need to pad 0
        return '0' + numString;
    } else {
        return numString;
    }
};

const randomSwatchItem = () => {
    return {
        item: {
            ...swatchItem,
            backgroundColor: `#${randColor()}${randColor()}${randColor()}`
        },
        attributeCode: 'fashion_color'
    };
};

export const swatchItem = {
    backgroundColor: `#${randColor()}${randColor()}${randColor()}`,
    name: 'Swatch',
    onclick: () => console.log('Swatch'),
    attributeCode: 'fashion_color',
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
    attributeCode: 'fashion_color'
};

export const swatchItems = Array(8)
    .fill(undefined)
    .map(() => {
        return randomSwatchItem();
    });
