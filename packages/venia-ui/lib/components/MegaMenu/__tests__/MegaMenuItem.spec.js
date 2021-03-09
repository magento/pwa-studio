import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { MemoryRouter } from 'react-router-dom';

import MegaMenuItem from '../megaMenuItem';

jest.mock('../../../classify');

describe('Mega menu item renders correctly', () => {
    const props = {
        category: {
            id: 1,
            name: 'Women',
            url_path: 'women',
            url_suffix: '.html',
            isActive: true,
            children: [
                {
                    id: 2,
                    name: 'Bottoms',
                    url_path: 'bottoms',
                    url_suffix: '.html',
                    children: []
                },
                {
                    id: 3,
                    name: 'Tops',
                    url_path: 'tops',
                    url_suffix: '.html',
                    isActive: false,
                    children: []
                }
            ]
        },
        rootCategoryName: 'Clothing',
        activeCategoryId: 1
    };

    test('it renders correctly', () => {
        const instance = createTestInstance(
            <MemoryRouter>
                <MegaMenuItem {...props} />
            </MemoryRouter>
        );

        expect(instance.toJSON()).toMatchSnapshot();
    });

    test('it marks the active category', () => {
        const instance = createTestInstance(
            <MemoryRouter>
                <MegaMenuItem {...props} />
            </MemoryRouter>
        );

        expect(instance.toJSON().children[0].props.className).toEqual(
            'megaMenuLinkActive'
        );
        expect(instance.toJSON().children[0].props.href).toEqual('/women.html');
        expect(instance.toJSON().children[0].children[0]).toEqual('Women');
    });

    test('it does not render submenu when item does not have children', () => {
        const categoryWithoutChildren = {
            id: 3,
            name: 'Tops',
            url_path: 'tops',
            url_suffix: '.html',
            isActive: false,
            children: []
        };

        const instance = createTestInstance(
            <MemoryRouter>
                <MegaMenuItem category={categoryWithoutChildren} />
            </MemoryRouter>
        );

        expect(instance.toJSON().children.length).toEqual(1);
        expect(instance.toJSON()).toMatchSnapshot();
    });
});
