import React from 'react';

import ButtonGroup from '../buttonGroup';

import { storiesOf } from '@storybook/react';

import { Edit2 as EditIcon, Home, Menu, Trash2 } from 'react-feather';

const stories = storiesOf('Components/ButtonGroup', module);

const ICON_DIMENSIONS = { width: '16px', height: '16px' };

stories.add('Single Text', () => {
    const items = [
        {
            key: 'Edit',
            ariaLabel: 'Edit',
            text: 'Edit'
        }
    ];
    return <ButtonGroup items={items} />;
});

stories.add('Single Icon', () => {
    const items = [
        {
            key: 'Edit',
            ariaLabel: 'Edit',
            leftIcon: <EditIcon {...ICON_DIMENSIONS} />
        }
    ];
    return <ButtonGroup items={items} />;
});

stories.add('Single Text Left Icon', () => {
    const items = [
        {
            key: 'Edit',
            ariaLabel: 'Edit',
            leftIcon: <EditIcon {...ICON_DIMENSIONS} />,
            text: 'Edit'
        }
    ];
    return <ButtonGroup items={items} />;
});

stories.add('Single Text Right Icon', () => {
    const items = [
        {
            key: 'Edit',
            ariaLabel: 'Edit',
            rightIcon: <EditIcon {...ICON_DIMENSIONS} />,
            text: 'Edit'
        }
    ];
    return <ButtonGroup items={items} />;
});

stories.add('Multiple Text', () => {
    const items = [
        {
            key: 'Edit',
            ariaLabel: 'Edit',
            active: true,
            text: 'Edit'
        },
        {
            key: 'Delete',
            ariaLabel: 'Delete',
            text: 'Delete'
        },
        {
            key: 'Menu',
            ariaLabel: 'Menu',
            text: 'Menu'
        }
    ];
    return <ButtonGroup items={items} />;
});

stories.add('Multiple Icon', () => {
    const items = [
        {
            key: 'Home',
            ariaLabel: 'Home',
            leftIcon: <Home {...ICON_DIMENSIONS} />
        },
        {
            key: 'Edit',
            ariaLabel: 'Edit',
            active: true,
            leftIcon: <EditIcon {...ICON_DIMENSIONS} />
        },
        {
            key: 'Delete',
            ariaLabel: 'Delete',
            leftIcon: <Trash2 {...ICON_DIMENSIONS} />
        },
        {
            key: 'Menu',
            ariaLabel: 'Menu',
            leftIcon: <Menu {...ICON_DIMENSIONS} />
        }
    ];
    return <ButtonGroup items={items} />;
});

stories.add('Multiple Text Icon', () => {
    const items = [
        {
            key: 'Home',
            ariaLabel: 'Home',
            text: 'Home',
            leftIcon: <Home {...ICON_DIMENSIONS} />
        },
        {
            key: 'Edit',
            ariaLabel: 'Edit',
            active: true,
            text: 'Edit',
            leftIcon: <EditIcon {...ICON_DIMENSIONS} />
        },
        {
            key: 'Delete',
            ariaLabel: 'Delete',
            text: 'Delete',
            leftIcon: <Trash2 {...ICON_DIMENSIONS} />
        },
        {
            key: 'Menu',
            ariaLabel: 'Menu',
            text: 'Menu',
            leftIcon: <Menu {...ICON_DIMENSIONS} />,
            rightIcon: <Menu {...ICON_DIMENSIONS} />
        }
    ];
    return <ButtonGroup items={items} />;
});
