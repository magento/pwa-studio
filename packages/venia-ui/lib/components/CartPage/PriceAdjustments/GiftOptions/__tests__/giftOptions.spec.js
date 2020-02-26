import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import GiftOptions from '../giftOptions';

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = { cartId: 'fakeCartId' };
    const api = {};
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

jest.mock('@apollo/react-hooks', () => {
    const runQuery = jest.fn();
    const queryResult = {
        data: {
            gift_options: {
                include_gift_receipt: true,
                include_printed_card: false,
                gift_message: 'Sample Message'
            }
        },
        error: null,
        loading: false
    };

    const useLazyQuery = jest.fn(() => [runQuery, queryResult]);

    const useMutation = jest.fn(() => [() => {}]);

    return { useLazyQuery, useMutation };
});

test('it renders gift options in venia cart page', () => {
    const instance = createTestInstance(<GiftOptions />);

    expect(instance.toJSON()).toMatchSnapshot();
});
