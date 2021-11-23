import React from 'react';
import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { act, renderHook } from '@testing-library/react-hooks';

import typePolicies from '@magento/peregrine/lib/Apollo/policies';

import DEFAULT_OPERATIONS from '../giftOptions.gql';
import { useGiftOptions } from '../useGiftOptions';

const { isEqual } = require('lodash');

// Could not figure out fakeTimers. Just mock debounce and call callback.
jest.mock('lodash.debounce', () => {
    return callback => args => callback(args);
});

jest.mock('lodash', () => {
    return {
        isEqual: jest.fn().mockReturnValue(false)
    };
});

jest.mock('@magento/peregrine/lib/context/cart', () => ({
    useCartContext: jest.fn().mockReturnValue([{ cartId: '123' }])
}));

const generateMockForSetGiftOptionsOnCart = mockedData => ({
    request: {
        query: DEFAULT_OPERATIONS.setGiftOptionsOnCartMutation,
        variables: {
            cartId: '123',
            giftMessage: {
                from: mockedData.cardFrom || '',
                to: mockedData.cardTo || '',
                message: mockedData.cardMessage || ''
            },
            giftReceiptIncluded: mockedData.includeGiftReceipt,
            printedCardIncluded: mockedData.includePrintedCard
        }
    },
    newData: jest.fn(() => ({
        data: {
            cart: {
                __typename: 'Cart',
                id: '123',
                gift_message: {
                    __typename: 'GiftMessage',
                    from: mockedData.cardFrom || '',
                    to: mockedData.cardTo || '',
                    message: mockedData.cardMessage || ''
                },
                gift_receipt_included: mockedData.includeGiftReceipt,
                printed_card_included: mockedData.includePrintedCard
            }
        }
    }))
});

const getGiftOptionsMock1 = {
    request: {
        query: DEFAULT_OPERATIONS.getGiftOptionsQuery,
        variables: { cartId: '123' }
    },
    result: {
        data: {
            cart: {
                __typename: 'Cart',
                id: '123',
                gift_message: {
                    from: 'from',
                    to: 'to',
                    message: 'message'
                },
                gift_receipt_included: false,
                printed_card_included: false
            }
        }
    }
};

const mockFormValues1 = {
    cardTo: 'to2',
    cardFrom: 'from2',
    cardMessage: 'message2',
    includeGiftReceipt: true,
    includePrintedCard: false
};

const setGiftOptionsOnCartMock1 = generateMockForSetGiftOptionsOnCart(
    mockFormValues1
);

const mockFormValues2 = {
    includeGiftReceipt: false,
    includePrintedCard: true
};

const setGiftOptionsOnCartMock2 = generateMockForSetGiftOptionsOnCart(
    mockFormValues2
);

const initialProps = {
    shouldSubmit: false
};

const cache = new InMemoryCache({
    typePolicies
});

const renderHookWithProviders = ({
    renderHookOptions = { initialProps },
    mocks = [
        getGiftOptionsMock1,
        setGiftOptionsOnCartMock1,
        setGiftOptionsOnCartMock2
    ]
} = {}) => {
    const wrapper = ({ children }) => (
        <MockedProvider mocks={mocks} cache={cache} addTypename={true}>
            {children}
        </MockedProvider>
    );

    return renderHook(useGiftOptions, { wrapper, ...renderHookOptions });
};

describe('#useGiftOptions', () => {
    it('returns correct shape while and after loading', async () => {
        const { result, waitForNextUpdate } = renderHookWithProviders();

        // Check data while loading
        expect(result.current).toMatchInlineSnapshot(`
            Object {
              "cardFromProps": Object {
                "allowEmptyString": true,
                "field": "cardFrom",
              },
              "cardMessageProps": Object {
                "allowEmptyString": true,
                "field": "cardMessage",
              },
              "cardToProps": Object {
                "allowEmptyString": true,
                "field": "cardTo",
              },
              "errors": Map {
                "setGiftOptionsOnCartMutation" => undefined,
                "getGiftOptionsQuery" => undefined,
              },
              "giftReceiptProps": Object {
                "field": "includeGiftReceipt",
              },
              "loading": true,
              "optionsFormProps": Object {
                "initialValues": Object {
                  "cardFrom": "",
                  "cardMessage": "",
                  "cardTo": "",
                  "includeGiftReceipt": false,
                  "includePrintedCard": false,
                },
                "onValueChange": [Function],
              },
              "printedCardProps": Object {
                "field": "includePrintedCard",
              },
            }
        `);

        // Wait for query to finish loading
        await waitForNextUpdate();

        // Check data after load
        expect(result.current).toMatchInlineSnapshot(`
            Object {
              "cardFromProps": Object {
                "allowEmptyString": true,
                "field": "cardFrom",
              },
              "cardMessageProps": Object {
                "allowEmptyString": true,
                "field": "cardMessage",
              },
              "cardToProps": Object {
                "allowEmptyString": true,
                "field": "cardTo",
              },
              "errors": Map {
                "setGiftOptionsOnCartMutation" => undefined,
                "getGiftOptionsQuery" => undefined,
              },
              "giftReceiptProps": Object {
                "field": "includeGiftReceipt",
              },
              "loading": false,
              "optionsFormProps": Object {
                "initialValues": Object {
                  "cardFrom": "from",
                  "cardMessage": "message",
                  "cardTo": "to",
                  "includeGiftReceipt": false,
                  "includePrintedCard": false,
                },
                "onValueChange": [Function],
              },
              "printedCardProps": Object {
                "field": "includePrintedCard",
              },
            }
        `);
    });

    it('returns mutation data when user updates form and data is not the same', async () => {
        const { result, rerender } = renderHookWithProviders();

        // Update form data - 1
        await act(() => {
            result.current.optionsFormProps.onValueChange(mockFormValues1);
        });

        // Validate that the cache is updated
        const preCacheData1 = cache.readQuery({
            query: DEFAULT_OPERATIONS.getGiftOptionsQuery
        });

        expect(preCacheData1).toMatchInlineSnapshot(`
            Object {
              "cart": Object {
                "__typename": "Cart",
                "gift_message": Object {
                  "from": "from2",
                  "message": "message2",
                  "to": "to2",
                },
                "gift_receipt_included": true,
                "id": "123",
                "printed_card_included": false,
              },
            }
        `);

        rerender({
            shouldSubmit: true
        });

        expect(setGiftOptionsOnCartMock1.newData).toHaveBeenCalled();

        // Update form data - 2
        await act(() => {
            result.current.optionsFormProps.onValueChange(mockFormValues2);
        });

        // Validate that the cache is updated
        const preCacheData2 = cache.readQuery({
            query: DEFAULT_OPERATIONS.getGiftOptionsQuery
        });

        expect(preCacheData2).toMatchInlineSnapshot(`
            Object {
              "cart": Object {
                "__typename": "Cart",
                "gift_message": Object {
                  "from": "",
                  "message": "",
                  "to": "",
                },
                "gift_receipt_included": false,
                "id": "123",
                "printed_card_included": true,
              },
            }
        `);

        rerender({
            shouldSubmit: true
        });

        expect(setGiftOptionsOnCartMock2.newData).toHaveBeenCalled();
    });

    it('does not return mutation data when user updates form and data is the same', async () => {
        // Emulate form data was not changed
        isEqual.mockReturnValue(true);

        const { result, rerender } = renderHookWithProviders();

        await act(() => {
            result.current.optionsFormProps.onValueChange(mockFormValues1);
        });

        rerender({
            shouldSubmit: true
        });

        expect(setGiftOptionsOnCartMock1.newData).not.toHaveBeenCalled();
    });
});
