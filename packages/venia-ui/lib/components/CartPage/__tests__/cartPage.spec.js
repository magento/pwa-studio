import React from 'react';
import ReactDOM from 'react-dom';
import { createTestInstance } from '@magento/peregrine';
import { useLazyQuery } from '@apollo/react-hooks';

import CartPage from '../cartPage';
import { HeadProvider } from '../../Head';

jest.mock('../PriceAdjustments', () => 'PriceAdjustments');
jest.mock('../PriceSummary', () => 'PriceSummary');
jest.mock('../ProductListing', () => 'ProductListing');

jest.mock('@apollo/react-hooks', () => {
    const runQuery = jest.fn();
    const queryResult = {
        data: null,
        error: null,
        loading: false
    };
    const useLazyQuery = jest.fn(() => [runQuery, queryResult]);

    return { useLazyQuery };
});

jest.mock('@magento/peregrine/lib/context/app', () => {
    const api = {
        toggleDrawer: jest.fn()
    };
    const state = {};
    const useAppContext = jest.fn(() => [state, api]);

    return { useAppContext };
});

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const api = {};
    const state = { cartId: 'cart123' };
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

jest.mock('@magento/peregrine/lib/context/user', () => {
    const api = {};
    const state = { isSignedIn: false };
    const useUserContext = jest.fn(() => [state, api]);

    return { useUserContext };
});

beforeAll(() => {
    /**
     * Mocking ReactDOM.createPortal because of incompatabilities
     * between ReactDOM and react-test-renderer.
     *
     * More info: https://github.com/facebook/react/issues/11565
     */
    ReactDOM.createPortal = jest.fn(element => {
        return element;
    });
});

afterAll(() => {
    ReactDOM.createPortal.mockClear();
});

test('renders empty cart text (no adjustments, list or summary) if cart is empty', () => {
    useLazyQuery.mockReturnValueOnce([
        jest.fn(),
        {
            data: {
                cart: {
                    total_quantity: 0
                }
            }
        }
    ]);

    const instance = createTestInstance(
        <HeadProvider>
            <CartPage />
        </HeadProvider>
    );
    expect(instance.toJSON()).toMatchSnapshot();
});

test('renders components if cart has items', () => {
    useLazyQuery.mockReturnValueOnce([
        jest.fn(),
        {
            data: {
                cart: {
                    total_quantity: 1
                }
            }
        }
    ]);

    const instance = createTestInstance(
        <HeadProvider>
            <CartPage />
        </HeadProvider>
    );
    expect(instance.toJSON()).toMatchSnapshot();
});
