import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { MemoryRouter } from 'react-router-dom';

import SubmenuColumn from '../submenuColumn';

jest.mock('../../../classify');

describe('Submenu column renders correctly', () => {
    const props = {
        category: {
            id: 1,
            name: 'Pants',
            url_path: 'pants',
            children: [
                {
                    id: 2,
                    name: 'Jeans',
                    url_path: 'jeans',
                    isActive: true,
                    children: []
                }
            ]
        },
        categoryUrlSuffix: '.html'
    };

    test('it renders correctly', () => {
        const instance = createTestInstance(
            <MemoryRouter>
                <SubmenuColumn {...props} />
            </MemoryRouter>
        );

        expect(instance.toJSON()).toMatchSnapshot();
    });

    test('it renders active state', () => {
        const instance = createTestInstance(
            <MemoryRouter>
                <SubmenuColumn {...props} />
            </MemoryRouter>
        );

        const activeLink = instance.root.findByProps({
            className: 'linkActive'
        });
        expect(activeLink.props.children).toEqual('Jeans');
    });
});
