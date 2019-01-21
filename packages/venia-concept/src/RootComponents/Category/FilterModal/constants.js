import React from 'react';
import ColorOption from './ColorOption';
import { colorItems } from './ColorOption/constants';

export const filterIconName = 'search';
export const filterInnerText = 'Search for a specific filter...';

export const filterOptions = [
    {
        id: 1,
        name: 'Size',
        RenderOption: () => <div />
    },
    {
        id: 2,
        name: 'Price',
        RenderOption: () => <div />
    },
    {
        id: 3,
        name: 'Brand',
        RenderOption: () => <div />
    },
    {
        id: 4,
        name: 'Color',
        items: colorItems,
        RenderOption: ColorOption
    },
    {
        id: 5,
        name: 'Style',
        RenderOption: () => <div />
    }
];
