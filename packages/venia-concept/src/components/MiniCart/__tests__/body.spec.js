import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Body from '../body';

jest.mock('../editItem');
jest.mock('../emptyMiniCart');
jest.mock('../productList');

jest.mock('src/components/LoadingIndicator', () => {
    return {
        __esModule: true,
        loadingIndicator: '( Loading Indicator Component Here )'
    };
});

const baseProps = {
    beginEditItem: jest.fn(),
    cart: {
        details: {},
        totals: {}
    }
};

test('renders the product list when appropriate', () => {
    const tree = createTestInstance(<Body {...baseProps} />).toJSON();

    expect(tree).toMatchSnapshot();
});

test('renders the loading indicator when appropriate', () => {
    const testProps = {
        ...baseProps,
        cart: {
            ...baseProps.cart,
            isLoading: true
        }
    };

    const tree = createTestInstance(<Body {...testProps} />).toJSON();

    expect(tree).toMatchSnapshot();
});

test('renders the empty mini cart when appropriate', () => {
    const testProps = {
        ...baseProps,
        isCartEmpty: true
    };

    const tree = createTestInstance(<Body {...testProps} />).toJSON();

    expect(tree).toMatchSnapshot();
});

test('renders the edit item dialog when appropriate', () => {
    const testProps = {
        ...baseProps,
        cart: {
            ...baseProps.cart,
            isEditingItem: true
        }
    };

    const tree = createTestInstance(<Body {...testProps} />).toJSON();

    expect(tree).toMatchSnapshot();
});
