import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import CartOptions from '../cartOptions';

const renderer = new ShallowRenderer();

jest.mock('@apollo/react-hooks', () => ({
    useMutation: jest.fn().mockImplementation(() => [
        jest.fn(),
        {
            error: null
        }
    ])
}));

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = {
        details: {}
    };
    const api = { updateItemInCart: jest.fn() };
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

jest.mock('@magento/peregrine/lib/hooks/useAwaitQuery', () => {
    const useAwaitQuery = jest.fn().mockResolvedValue({ data: { cart: {} } });

    return { useAwaitQuery };
});

jest.mock('react-intl', () => {
    const props = { locale: 'en-US' };
    const useIntl = jest.fn(() => props);

    return { useIntl };
});

test('it renders the correct tree', () => {
    const props = {
        cartItem: {
            id: 99,
            product: {
                name: 'cartItem name',
                price: {
                    regularPrice: {
                        amount: {
                            value: 99
                        }
                    }
                }
            },
            quantity: 99
        },
        configItem: {
            __typename: 'simple'
        },
        currencyCode: 'USD',
        endEditItem: jest.fn(),
        updateCart: jest.fn()
    };

    const tree = renderer.render(<CartOptions {...props} />);

    expect(tree).toMatchSnapshot();
});
