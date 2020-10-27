import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { MockedProvider } from '@apollo/client/testing';
import { gql, InMemoryCache } from '@apollo/client';

import { act } from 'react-test-renderer';
import typePolicies from '../../../../Apollo/policies';

import useGiftOptions from '../useGiftOptions';

const GET_GIFT_OPTIONS = gql`
    query getGiftOptions($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            include_gift_receipt
            include_printed_card
            gift_message
        }
    }
`;

const mockRequest = {
    request: {
        query: GET_GIFT_OPTIONS,
        skip: false,
        variables: {
            cartId: 'cart123'
        }
    },
    result: {
        data: {
            cart: {
                id: 'cart123',
                include_gift_receipt: true,
                include_printed_card: false,
                gift_message: ''
            }
        }
    }
};
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

    return <i {...talonProps} />;
};

const props = {
    queries: {
        getGiftOptionsQuery: GET_GIFT_OPTIONS
    }
};

test('it returns the proper shape', () => {
    const component = createTestInstance(
        <MockedProvider mocks={[mockRequest]} addTypename={true}>
            <Component {...props} />
        </MockedProvider>
    );
    const talonProps = component.root.findByType('i').props;

    expect(talonProps).toMatchObject({
        includeGiftReceipt: expect.any(Boolean),
        includePrintedCard: expect.any(Boolean),
        giftMessage: expect.any(String),
        toggleIncludeGiftReceiptFlag: expect.any(Function),
        toggleIncludePrintedCardFlag: expect.any(Function),
        updateGiftMessage: expect.any(Function)
    });
});

test('it writes to cache after query returns data', async () => {
    expect.assertions(2);

    const cache = new InMemoryCache({ typePolicies });

    expect(cache.data.data).toEqual({});

    createTestInstance(
        <MockedProvider mocks={[mockRequest]} cache={cache} addTypename={true}>
            <Component {...props} />
        </MockedProvider>
    );

    // Wait for the query to finish loading
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(cache.data.data).toMatchObject({
        ROOT_QUERY: {
            'cart:Cart': {
                id: 'cart123',
                include_gift_receipt: true,
                include_printed_card: false,
                gift_message: ''
            }
        }
    });
});

test('it updates cache after updating gift message', async () => {
    expect.assertions(1);
    const cache = new InMemoryCache({ typePolicies });

    const component = createTestInstance(
        <MockedProvider mocks={[mockRequest]} cache={cache} addTypename={true}>
            <Component {...props} />
        </MockedProvider>
    );
    // Wait a little longer for everything to fully render
    await new Promise(resolve => setTimeout(resolve, 10));

    const instance = component.root.findByType('i');

    const { updateGiftMessage } = instance.props;

    act(() => {
        updateGiftMessage({
            target: {
                value: 'Hello World'
            }
        });
    });
    // Wait for throttled message update
    await new Promise(resolve => setTimeout(resolve, 1000));

    expect(cache.data.data).toMatchObject({
        ROOT_QUERY: {
            'cart:Cart': {
                __ref: 'Cart'
            }
        },
        Cart: {
            id: 'cart123',
            include_gift_receipt: true,
            include_printed_card: false,
            gift_message: 'Hello World'
        }
    });
});

test('it updates cache after toggling including gift receipt flag', async () => {
    expect.assertions(1);
    const cache = new InMemoryCache({ typePolicies });

    const component = createTestInstance(
        <MockedProvider mocks={[mockRequest]} cache={cache} addTypename={true}>
            <Component {...props} />
        </MockedProvider>
    );
    // Wait a little longer for everything to fully render
    await new Promise(resolve => setTimeout(resolve, 10));

    const instance = component.root.findByType('i');

    const { toggleIncludeGiftReceiptFlag } = instance.props;

    act(() => {
        toggleIncludeGiftReceiptFlag();
    });

    expect(cache.data.data).toMatchObject({
        ROOT_QUERY: {
            'cart:Cart': {
                __ref: 'Cart'
            }
        },
        Cart: {
            id: 'cart123',
            include_gift_receipt: false,
            include_printed_card: false,
            gift_message: ''
        }
    });
});

test('it updates cache after toggling including gift printed card flag', async () => {
    expect.assertions(1);
    const cache = new InMemoryCache({ typePolicies });

    const component = createTestInstance(
        <MockedProvider mocks={[mockRequest]} cache={cache} addTypename={true}>
            <Component {...props} />
        </MockedProvider>
    );
    // Wait a little longer for everything to fully render
    await new Promise(resolve => setTimeout(resolve, 10));

    const instance = component.root.findByType('i');

    const { toggleIncludePrintedCardFlag } = instance.props;

    act(() => {
        toggleIncludePrintedCardFlag();
    });

    expect(cache.data.data).toMatchObject({
        ROOT_QUERY: {
            'cart:Cart': {
                __ref: 'Cart'
            }
        },
        Cart: {
            id: 'cart123',
            include_gift_receipt: true,
            include_printed_card: true,
            gift_message: ''
        }
    });
});
