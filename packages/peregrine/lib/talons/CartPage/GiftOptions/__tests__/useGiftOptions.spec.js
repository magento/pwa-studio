import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { MockedProvider } from '@apollo/client/testing';
import { gql, InMemoryCache } from '@apollo/client';

import waitForExpect from 'wait-for-expect';

import { act } from 'react-test-renderer';
import typePolicies from '../../../../Apollo/policies';

import useGiftOptions from '../useGiftOptions';

/* eslint-disable graphql/template-strings */
const GET_GIFT_OPTIONS = gql`
    query getGiftOptions($cartId: String!) {
        cart(cart_id: $cartId) @client {
            id
            include_gift_receipt
            include_printed_card
            gift_message
        }
    }
`;
/* eslint-enable graphql/template-strings */

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = {
        cartId: 'cart123'
    };

    const api = {};

    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

jest.mock('lodash.throttle', () => {
    return callback => {
        return callback;
    };
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
            gift_message: 'GiftMessage'
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
        expect(component.root.findByType('i').props).toMatchObject({
            includeGiftReceipt: true,
            includePrintedCard: false,
            giftMessage: 'GiftMessage',
            toggleIncludeGiftReceiptFlag: expect.any(Function),
            toggleIncludePrintedCardFlag: expect.any(Function),
            updateGiftMessage: expect.any(Function)
        });
    });

    expect(cacheWriteSpy).not.toHaveBeenCalled();
});

test('it updates cache after updating gift message', async () => {
    const cacheWriteSpy = jest.spyOn(cache, 'writeQuery');

    const component = createTestInstance(
        <MockedProvider cache={cache} addTypename={true} resolvers={{}}>
            <Component {...props} />
        </MockedProvider>
    );

    // Wait until the data has loaded
    await waitForExpect(() => {
        expect(component.root.findByType('i').props.giftMessage).toEqual(
            'GiftMessage'
        );
    });

    const instance = component.root.findByType('i');

    const { updateGiftMessage } = instance.props;

    act(() => {
        updateGiftMessage({
            target: {
                value: 'Hello World'
            }
        });
    });

    expect(component.root.findByType('i').props.giftMessage).toEqual(
        'Hello World'
    );

    expect(cacheWriteSpy).toHaveBeenCalledTimes(1);
    expect(cacheWriteSpy.mock.calls[0][0]).toMatchObject({
        data: {
            cart: {
                gift_message: 'Hello World'
            }
        }
    });
});

test('it updates cache after toggling including gift receipt flag', async () => {
    const cacheWriteSpy = jest.spyOn(cache, 'writeQuery');

    const component = createTestInstance(
        <MockedProvider cache={cache} addTypename={true} resolvers={{}}>
            <Component {...props} />
        </MockedProvider>
    );

    // Wait until the data has loaded
    await waitForExpect(() => {
        expect(component.root.findByType('i').props.giftMessage).toEqual(
            'GiftMessage'
        );
    });

    const instance = component.root.findByType('i');

    const { toggleIncludeGiftReceiptFlag } = instance.props;

    expect(instance.props.includeGiftReceipt).toBeTruthy();

    act(() => {
        toggleIncludeGiftReceiptFlag();
    });

    expect(instance.props.includeGiftReceipt).toBeFalsy();

    expect(cacheWriteSpy).toHaveBeenCalledTimes(1);
    expect(cacheWriteSpy.mock.calls[0][0]).toMatchObject({
        data: {
            cart: {
                include_gift_receipt: false
            }
        }
    });
});

test('it toggles the include printed card flag state and in the cache', async () => {
    const cacheWriteSpy = jest.spyOn(cache, 'writeQuery');

    const component = createTestInstance(
        <MockedProvider cache={cache} addTypename={true} resolvers={{}}>
            <Component {...props} />
        </MockedProvider>
    );

    // Wait until the data has loaded
    await waitForExpect(() => {
        expect(component.root.findByType('i').props.giftMessage).toEqual(
            'GiftMessage'
        );
    });

    const instance = component.root.findByType('i');

    const { toggleIncludePrintedCardFlag } = instance.props;

    expect(instance.props.includePrintedCard).toBeFalsy();

    act(() => {
        toggleIncludePrintedCardFlag();
    });

    expect(instance.props.includePrintedCard).toBeTruthy();

    expect(cacheWriteSpy).toHaveBeenCalledTimes(1);
    expect(cacheWriteSpy.mock.calls[0][0]).toMatchObject({
        data: {
            cart: {
                include_printed_card: true
            }
        }
    });
});
