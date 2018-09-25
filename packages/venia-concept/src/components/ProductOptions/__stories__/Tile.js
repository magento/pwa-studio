import { createElement } from 'react';
import { storiesOf } from '@storybook/react';
import Option from '../option';
import Options from '../options';
import tileClasses from '../tile.css';

const stories = storiesOf('Product Options/Tile', module);


const tileItem = () => {
    return {
        backgroundColor: '0 0 0',
        name: 'hey',
        onclick: () => console.log('hey')
    }
}

const tileItemDisabled = () => {
    return {
        ...tileItem(),
        isDisabled: true
    }
}

const tileItemSelected = () => {
    return {
        ...tileItem(),
		isSelected: true
    }
}

const tileListItem = () => {
    return {
        item: {
            ...tileItem(),
            isSelected: true
        },
        classes: tileClasses,
        children: 'Test'
    }
}


const tileItems = [tileListItem(), tileListItem(), tileListItem(), tileListItem(), tileListItem(), tileListItem() ];

stories.add(
    'Tile', () => (
        <Option
            item={tileItem()}
            classes={tileClasses}
        > Test </Option>
    )
);

stories.add(
    'Tile disabled', () => (
        <Option
            name={'test'}
            item={tileItemDisabled()}
            classes={tileClasses}
        > Test </Option>
    )
);

stories.add(
    'Tile selected', () => (
        <Option
            name={'test'}
            item={tileItemSelected()}
            classes={tileClasses}
        > Test </Option>
    )
);

stories.add(
    'Tile list', () => (
        <Options
            options={tileItems}
        />
    )
);
