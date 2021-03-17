import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { MemoryRouter } from 'react-router-dom';
import MegaMenu from '../megaMenu';

jest.mock('../../../classify');

jest.mock('@magento/peregrine/lib/talons/MegaMenu/useMegaMenu', () => ({
    useMegaMenu: jest.fn().mockReturnValue({
        megaMenuData: {
            id: 1,
            name: 'Clothing',
            children: [
                {
                    id: 2,
                    name: 'Women',
                    url_path: 'women',
                    url_suffix: '.html',
                    children: [
                        {
                            id: 5,
                            name: 'Bottoms',
                            url_path: 'bottoms',
                            url_suffix: '.html',
                            isActive: true,
                            children: []
                        }
                    ]
                },
                {
                    id: 3,
                    name: 'Men',
                    url_path: 'men',
                    url_suffix: '.html',
                    children: []
                },
                {
                    id: 4,
                    name: 'Gear',
                    url_path: 'gear',
                    url_suffix: '.html',
                    children: []
                }
            ]
        },
        activeCategoryId: 5
    })
}));

test('it renders correctly', () => {
    const instance = createTestInstance(
        <MemoryRouter>
            <MegaMenu />
        </MemoryRouter>
    );

    expect(instance.toJSON()).toMatchSnapshot();
});
