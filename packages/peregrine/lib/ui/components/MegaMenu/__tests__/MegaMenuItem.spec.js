import React from 'react';
import { Link } from 'react-router-dom';
import { act } from 'react-test-renderer';

import { createTestInstance } from '@magento/peregrine';

import MegaMenuItem from '../megaMenuItem';

jest.mock('../../../classify');
jest.mock('../../Icon', () => props => <mock-Icon {...props} />);
jest.mock('../submenu', () => props => <mock-Submenu {...props} />);
jest.mock('react', () => {
    const React = jest.requireActual('react');
    const memoSpy = jest.spyOn(React, 'useMemo');

    return Object.assign(React, {
        useMemo: memoSpy
    });
});

const mockHandleKeyDown = jest.fn();

jest.mock('react-router-dom', () => ({
    Link: jest.fn(() => props => <mock-Link {...props} />)
}));

jest.mock('@magento/peregrine/lib/talons/MegaMenu/useMegaMenuItem', () => ({
    useMegaMenuItem: jest.fn(() => {
        return {
            isFocused: false,
            isActive: false,
            handleMenuItemFocus: jest.fn(),
            handleCloseSubMenu: jest.fn(),
            isMenuActive: false,
            handleKeyDown: mockHandleKeyDown
        };
    })
}));

let inputProps = {};

const Component = () => {
    return <MegaMenuItem {...inputProps} />;
};

const givenDefaultValues = () => {
    inputProps = {
        activeCategoryId: 1,
        category: {
            id: 1,
            name: 'Women',
            url_path: 'women',
            isActive: true,
            children: [
                {
                    id: 2,
                    name: 'Bottoms',
                    url_path: 'bottoms',
                    children: []
                },
                {
                    id: 3,
                    name: 'Tops',
                    url_path: 'tops',
                    isActive: false,
                    children: []
                }
            ]
        },
        rootCategoryName: 'Clothing',
        categoryUrlSuffix: '.html',
        mainNavWidth: 200,
        subMenuState: 'test',
        disableFocus: false
    };
};

describe('Mega menu item renders correctly', () => {
    beforeEach(() => {
        givenDefaultValues();
    });

    test('it renders correctly', () => {
        const instance = createTestInstance(<Component />);

        expect(instance.toJSON()).toMatchSnapshot();
    });

    test('it marks the active category', () => {
        const { root } = createTestInstance(<Component />);

        expect(root.findByType(Link).props.className).toEqual('megaMenuLink');
        expect(root.findByType(Link).props.to).toEqual('/women.html');
        expect(root.findByType(Link).props.children[0]).toEqual('Women');
    });

    it('should call a11yClick', () => {
        const { root } = createTestInstance(<Component />);

        act(() => {
            root.findByType(Link).props.onKeyDown();
        });

        expect(mockHandleKeyDown).toHaveBeenCalled();
    });

    test('it does not render submenu when item does not have children', () => {
        const categoryWithoutChildren = {
            id: 3,
            name: 'Tops',
            url_path: 'tops',
            isActive: false,
            children: []
        };

        const instance = createTestInstance(
            <Component category={categoryWithoutChildren} />
        );

        expect(instance.toJSON().children.length).toEqual(1);
        expect(instance.toJSON()).toMatchSnapshot();
    });
});
