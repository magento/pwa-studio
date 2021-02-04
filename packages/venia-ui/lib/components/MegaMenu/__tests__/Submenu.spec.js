import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { MemoryRouter } from 'react-router-dom';

import Submenu from '../submenu';

jest.mock('../../../classify');

describe('Submenu renders correctly', () => {
    const props = {
        items: [
            {
                id: 1,
                name: 'Bottoms',
                url_path: 'bottoms',
                url_suffix: '.html',
                children: [
                    {
                        id: 3,
                        name: 'Pants',
                        url_path: 'pants',
                        url_suffix: '.html',
                        isActive: false,
                        children: []
                    }
                ]
            },
            {
                id: 2,
                name: 'Tops',
                url_path: 'tops',
                url_suffix: '.html',
                isActive: false,
                children: []
            }
        ],
        rootCategoryName: 'Clothing',
        firstLevelCategoryName: 'Women'
    };
    test('it renders correctly', () => {
        const instance = createTestInstance(
            <MemoryRouter>
                <Submenu {...props} />
            </MemoryRouter>
        );

        expect(instance.toJSON()).toMatchSnapshot();
    });
});
