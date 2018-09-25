import tileClasses from './tile.css';

export const tileItem = () => {
    return {
        backgroundColor: '0 0 0',
        name: 'hey',
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

export const tileListItem = () => {
    return {
        item: {
            ...tileItem(),
            isSelected: true
        },
        classes: tileClasses,
        children: 'Test'
    }
}


export const tileItems = [tileListItem(), tileListItem(), tileListItem(), tileListItem(), tileListItem(), tileListItem() ];
