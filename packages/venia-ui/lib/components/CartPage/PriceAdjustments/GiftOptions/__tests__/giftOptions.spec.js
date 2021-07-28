import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import GiftOptions from '../giftOptions';

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = { cartId: 'fakeCartId' };
    const api = {};
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

jest.mock('@apollo/client', () => {
    const queryResult = {
        data: {
            cart: {
                include_gift_receipt: true,
                include_printed_card: false,
                gift_message: 'Sample Message'
            }
        },
        error: null,
        loading: false
    };

    const useQuery = jest.fn(() => queryResult);

    const useMutation = jest.fn(() => [() => {}]);

    return {
        gql: jest.fn(),
        useApolloClient: jest.fn(() => ({
            cache: {}
        })),
        useQuery,
        useMutation
    };
});

beforeAll(() => {
    // informed's random ids make snapshots unstable
    jest.spyOn(Math, 'random').mockReturnValue(0);
});

test('it renders gift options in venia cart page', () => {
    const instance = createTestInstance(<GiftOptions />);

    expect(instance.toJSON()).toMatchSnapshot();
});
