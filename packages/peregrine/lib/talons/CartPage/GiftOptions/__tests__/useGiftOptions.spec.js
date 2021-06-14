import React from 'react';
import { Form } from 'informed';
import { createTestInstance } from '@magento/peregrine';
import { MockedProvider } from '@apollo/client/testing';
import { gql, InMemoryCache } from '@apollo/client';

import waitForExpect from 'wait-for-expect';

import { act } from 'react-test-renderer';
import typePolicies from '../../../../Apollo/policies';

import useGiftOptions from '../useGiftOptions';

const GET_GIFT_OPTIONS = gql`
    query getGiftOptions($cartId: String!) {
        cart(cart_id: $cartId) @client {
            id
            include_gift_receipt
            include_printed_card
            local_gift_message
        }
    }
`;

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = {
        cartId: 'cart123'
    };

    const api = {};

    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

const Component = props => {
    const talonProps = useGiftOptions(props);

    return (
        <Form {...talonProps.optionsFormProps}>
            <i {...talonProps} />
        </Form>
    );
};

const props = {
    queries: {
        getGiftOptionsQuery: GET_GIFT_OPTIONS
    }
};

const cache = new InMemoryCache({ typePolicies });

beforeEach(() => {
    cache.restore({
        ROOT_QUERY: {
            __typename: 'Query',
            'cart:Cart': {
                __ref: 'Cart'
            }
        },
        Cart: {
            __typename: 'Cart',
            id: 'cart123',
            include_gift_receipt: true,
            include_printed_card: false,
            local_gift_message: 'GiftMessage'
        }
    });
});

test('it returns the proper shape after data loads', async () => {
    const cacheWriteSpy = jest.spyOn(cache, 'writeQuery');

    const component = createTestInstance(
        <MockedProvider cache={cache} addTypename={true} resolvers={{}}>
            <Component {...props} />
        </MockedProvider>
    );

    // Wait until the data has loaded
    await waitForExpect(() => {
        const received = component.root.findByType('i').props;
        expect(received).toEqual({
            cardMessageProps: {
                field: 'cardMessage',
                initialValue: '',
                keepState: true
            },
            giftReceiptProps: {
                field: 'includeGiftReceipt',
                initialValue: false
            },
            optionsFormProps: {
                getApi: expect.any(Function),
                onValueChange: expect.any(Function)
            },
            printedCardProps: {
                field: 'includePrintedCard',
                initialValue: false
            },
            shouldPromptForMessage: expect.any(Function)
        });
    });

    expect(cacheWriteSpy).not.toHaveBeenCalled();
});

test('it updates the cache after receiving user input', async () => {
    const cacheWriteSpy = jest.spyOn(cache, 'writeQuery');

    const { root } = createTestInstance(
        <MockedProvider cache={cache} addTypename={true} resolvers={{}}>
            <Component {...props} />
        </MockedProvider>
    );

    act(() => {
        root.findByType('i').props.optionsFormProps.onValueChange({
            cardMessage: 'hello',
            includeGiftReceipt: false,
            includePrintedCard: true
        });
    });

    expect(cacheWriteSpy).toHaveBeenCalledTimes(1);
    expect(cacheWriteSpy.mock.calls[0][0]).toMatchObject({
        data: {
            cart: {
                local_gift_message: 'hello',
                include_gift_receipt: false,
                include_printed_card: true
            }
        }
    });
});
