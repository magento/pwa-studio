import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { MockedProvider } from '@apollo/client/testing';
import { gql, InMemoryCache } from '@apollo/client';

import waitForExpect from 'wait-for-expect';

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
                gift_message: 'GiftMessage'
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

jest.mock('lodash.throttle', () => {
    // eslint-disable-next-line
    return (callback, delay, config) => {
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

test('it returns the proper shape after data loads', async () => {
    const component = createTestInstance(
        <MockedProvider mocks={[mockRequest]} addTypename={true}>
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
});

test('it updates cache after updating gift message', async () => {
    const cache = new InMemoryCache({ typePolicies });

    const cacheWriteSpy = jest.spyOn(cache, 'writeQuery');

    const component = createTestInstance(
        <MockedProvider mocks={[mockRequest]} cache={cache} addTypename={true}>
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

    // First write is when the data is loaded initially.
    // Second write is after the value is toggled.
    expect(cacheWriteSpy).toHaveBeenCalledTimes(2);
    expect(cacheWriteSpy.mock.calls[1][0]).toMatchObject({
        data: {
            cart: {
                gift_message: 'Hello World'
            }
        }
    });
});

test('it updates cache after toggling including gift receipt flag', async () => {
    const cache = new InMemoryCache({ typePolicies });

    const cacheWriteSpy = jest.spyOn(cache, 'writeQuery');

    const component = createTestInstance(
        <MockedProvider mocks={[mockRequest]} cache={cache} addTypename={true}>
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

    // First write is when the data is loaded initially.
    // Second write is after the value is toggled.
    expect(cacheWriteSpy).toHaveBeenCalledTimes(2);
    expect(cacheWriteSpy.mock.calls[1][0]).toMatchObject({
        data: {
            cart: {
                include_gift_receipt: false
            }
        }
    });
});

test('it toggles the include printed card flag state and in the cache', async () => {
    const cache = new InMemoryCache({ typePolicies });

    const cacheWriteSpy = jest.spyOn(cache, 'writeQuery');

    const component = createTestInstance(
        <MockedProvider mocks={[mockRequest]} cache={cache} addTypename={true}>
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

    // First write is when the data is loaded initially.
    // Second write is after the value is toggled.
    expect(cacheWriteSpy).toHaveBeenCalledTimes(2);
    expect(cacheWriteSpy.mock.calls[1][0]).toMatchObject({
        data: {
            cart: {
                include_printed_card: true
            }
        }
    });
});
