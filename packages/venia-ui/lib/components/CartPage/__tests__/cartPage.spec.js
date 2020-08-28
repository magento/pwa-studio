import React from 'react';
import ReactDOM from 'react-dom';
import { createTestInstance } from '@magento/peregrine';
import { useCartPage } from '@magento/peregrine/lib/talons/CartPage/useCartPage';

import CartPage from '../cartPage';
import { HeadProvider } from '../../Head';

jest.mock('../../../classify');
jest.mock('../../StockStatusMessage', () => 'StockStatusMessage');
jest.mock('../PriceAdjustments', () => 'PriceAdjustments');
jest.mock('../PriceSummary', () => 'PriceSummary');
jest.mock('../ProductListing', () => 'ProductListing');

jest.mock('@magento/peregrine/lib/talons/CartPage/useCartPage', () => {
    const useCartPageTalon = jest.requireActual(
        '@magento/peregrine/lib/talons/CartPage/useCartPage'
    );
    const spy = jest.spyOn(useCartPageTalon, 'useCartPage');

    return Object.assign(useCartPageTalon, { useCartPage: spy });
});

const talonProps = {
    hasItems: false,
    handleSignIn: jest.fn(),
    isSignedIn: false,
    isCartUpdating: false,
    setIsCartUpdating: jest.fn(),
    shouldShowLoadingIndicator: false
};

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

test('renders a loading indicator when talon indicates', () => {
    // Arrange.
    const myTalonProps = {
        ...talonProps,
        shouldShowLoadingIndicator: true
    };
    useCartPage.mockReturnValueOnce(myTalonProps);

    // Act.
    const instance = createTestInstance(
        <HeadProvider>
            <CartPage />
        </HeadProvider>
    );

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});

test('renders empty cart text (no adjustments, list or summary) if cart is empty', () => {
    // Arrange.
    useCartPage.mockReturnValueOnce(talonProps);

    // Act.
    const instance = createTestInstance(
        <HeadProvider>
            <CartPage />
        </HeadProvider>
    );

    // Assert.
    expect(document.getElementsByTagName('title')[0].innerHTML).toBe(
        'Cart - Venia'
    );
    expect(instance.toJSON()).toMatchSnapshot();
});

test('renders components if cart has items', () => {
    // Arrange.
    const myTalonProps = {
        ...talonProps,
        hasItems: true
    };
    useCartPage.mockReturnValueOnce(myTalonProps);

    // Act.
    const instance = createTestInstance(
        <HeadProvider>
            <CartPage />
        </HeadProvider>
    );

    // Assert.
    expect(document.getElementsByTagName('title')[0].innerHTML).toBe(
        'Cart - Venia'
    );
    expect(instance.toJSON()).toMatchSnapshot();
});
