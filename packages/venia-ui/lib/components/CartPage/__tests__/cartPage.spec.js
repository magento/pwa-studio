import React from 'react';
import ReactDOM from 'react-dom';
import { createTestInstance, useToasts } from '@magento/peregrine';
import { useCartPage } from '@magento/peregrine/lib/talons/CartPage/useCartPage';

import CartPage from '../cartPage';

jest.mock('../../../components/Head', () => ({
    StoreTitle: () => 'Title'
}));

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

jest.mock('@magento/peregrine', () => ({
    ...jest.requireActual('@magento/peregrine'),
    useToasts: jest.fn().mockReturnValue([
        {},
        {
            addToast: jest.fn()
        }
    ])
}));

const talonProps = {
    hasItems: false,
    handleSignIn: jest.fn().mockName('handleSignIn'),
    isSignedIn: false,
    isCartUpdating: false,
    setIsCartUpdating: jest.fn().mockName('setIsCartUpdating'),
    shouldShowLoadingIndicator: false,
    onAddToWishlistSuccess: jest.fn().mockName('onAddToWishlistSuccess'),
    wishlistSuccessProps: null
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
    const instance = createTestInstance(<CartPage />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});

test('renders empty cart text (no adjustments, list or summary) if cart is empty', () => {
    // Arrange.
    useCartPage.mockReturnValueOnce(talonProps);

    // Act.
    const instance = createTestInstance(<CartPage />);

    // Assert.
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
    const instance = createTestInstance(<CartPage />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});

test('renders toast if wishlistSuccessProps is not falsy', () => {
    const addToast = jest.fn();
    useToasts.mockReturnValueOnce([{}, { addToast }]);

    const myTalonProps = {
        ...talonProps,
        wishlistSuccessProps: { message: 'Successfully added to wishlist' }
    };
    useCartPage.mockReturnValueOnce(myTalonProps);

    createTestInstance(<CartPage />);

    expect(addToast.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          Object {
            "icon": <Icon
              size={20}
              src={
                Object {
                  "$$typeof": Symbol(react.forward_ref),
                  "propTypes": Object {
                    "color": [Function],
                    "size": [Function],
                  },
                  "render": [Function],
                }
              }
            />,
            "message": "Successfully added to wishlist",
          },
        ]
    `);
});
