import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { MemoryRouter } from 'react-router-dom';

import Submenu from '../submenu';

jest.mock('../../../classify');
jest.mock('../submenuColumn', () => props => <mock-SubmenuColumn {...props} />);
jest.mock('react', () => {
    const React = jest.requireActual('react');
    const callbackSpy = jest.spyOn(React, 'useCallback');

    return Object.assign(React, {
        callbackSpy: callbackSpy
    });
});

const handleCloseSubMenu = jest.fn().mockName('handleCloseSubMenu');

describe('Submenu renders correctly', () => {
    const props = {
        items: [
            {
                id: 1,
                name: 'Bottoms',
                url_path: 'bottoms',
                children: [
                    {
                        id: 3,
                        name: 'Pants',
                        url_path: 'pants',
                        isActive: false,
                        children: []
                    }
                ]
            },
            {
                id: 2,
                name: 'Tops',
                url_path: 'tops',
                isActive: false,
                children: []
            }
        ],
        rootCategoryName: 'Clothing',
        firstLevelCategoryName: 'Women',
        categoryUrlSuffix: '.html',
        handleCloseSubMenu,
        isFocused: false,
        subMenuState: false
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
