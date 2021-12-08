import React from 'react';

import { useMegaMenuItem } from '../useMegaMenuItem';
import { createTestInstance } from '@magento/peregrine';

const Component = props => {
    const talonProps = useMegaMenuItem(props);

    return <i talonProps={talonProps} />;
};

const getTalonProps = props => {
    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    const update = newProps => {
        tree.update(<Component {...{ ...props, ...newProps }} />);

        return root.findByType('i').props.talonProps;
    };

    return { talonProps, tree, update };
};

const defaultProps = {
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
    activeCategoryId: 1,
    subMenuState: true
};

jest.mock('react', () => {
    const React = jest.requireActual('react');
    const memoSpy = jest.spyOn(React, 'useMemo');
    const stateSpy = jest.spyOn(React, 'useState');
    const callbackSpy = jest.spyOn(React, 'useCallback');

    return Object.assign(React, {
        useMemo: memoSpy,
        useState: stateSpy,
        useCallback: callbackSpy
    });
});

test('Should return correct shape', () => {
    const { talonProps } = getTalonProps(defaultProps);

    expect(talonProps).toMatchSnapshot();
});

test('handleMenuItemFocus to be called', () => {
    const props = {
        ...defaultProps
    };
    const { talonProps } = getTalonProps(props);

    talonProps.handleMenuItemFocus();

    expect(talonProps.isMenuActive).toEqual(false);
});

test('handleCloseSubMenu to be called', () => {
    const props = {
        ...defaultProps
    };
    const { talonProps } = getTalonProps(props);

    talonProps.handleCloseSubMenu();

    expect(talonProps.isMenuActive).toEqual(false);
});

test('handleKeyDown called with Escape key', () => {
    const e = { key: 'Escape' };

    const props = {
        ...defaultProps
    };
    const { talonProps } = getTalonProps(props);

    talonProps.handleKeyDown(e);

    expect(talonProps.isFocused).toEqual(false);
});

test('handleKeyDown called with ArrowDown key', () => {
    const e = { key: 'ArrowDown', preventDefault: jest.fn() };
    const props = {
        ...defaultProps
    };
    const { talonProps } = getTalonProps(props);

    talonProps.handleKeyDown(e);

    expect(talonProps.isFocused).toEqual(false);
});

test('handleKeyDown called with Tab and shiftKey', () => {
    const e = { key: 'Tab', shiftKey: true };

    const props = {
        ...defaultProps
    };
    const { talonProps } = getTalonProps(props);

    talonProps.handleKeyDown(e);

    expect(talonProps.isFocused).toEqual(false);
});
