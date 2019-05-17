import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Body from '../body';

jest.mock('src/components/LoadingIndicator', () => {
    return {
        __esModule: true,
        loadingIndicator: <img src="mock_loading_indicator" />
    };
});
jest.mock('../editItem', () => {
    return {
        __esModule: true,
        default: () => <span>Mock Edit Item Dialog</span>
    };
});
jest.mock('../productList', () => {
    return {
        __esModule: true,
        default: () => <span>Mock Product List</span>
    };
});

const baseProps = {
    beginEditItem: jest.fn(),
    cart: {
        details: {
            currency: {
                quote_currency_code: 'US'
            },
            items: []
        },
        editItem: {
            item_id: 12,
            name: 'mock_item',
            options: [],
            price: 99,
            qty: 1
        },
        isEditingItem: false,
        isLoading: false,
        isUpdatingItem: false,
        totals: {
            items: []
        }
    },
    endEditItem: jest.fn(),
    isCartEmpty: false,
    isMiniCartMaskOpen: false,
    removeItemFromCart: jest.fn(),
    updateItemInCart: jest.fn()
};

test('renders the product list when appropriate', () => {
    const tree = createTestInstance(
        <Body {...baseProps} />
    ).toJSON();

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

    const tree = createTestInstance(
        <Body {...testProps} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
});

test('renders the empty mini cart when appropriate', () => {
    const testProps = {
        ...baseProps,
        isCartEmpty: true
    };

    const tree = createTestInstance(
        <Body {...testProps} />
    ).toJSON();

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

    const tree = createTestInstance(
        <Body {...testProps} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
});