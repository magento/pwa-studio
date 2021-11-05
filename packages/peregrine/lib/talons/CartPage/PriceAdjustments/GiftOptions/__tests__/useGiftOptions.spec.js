import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { act, renderHook } from '@testing-library/react-hooks';

import DEFAULT_OPERATIONS from '../giftOptions.gql';
import { useGiftOptions } from '../useGiftOptions';

// Could not figure out fakeTimers. Just mock debounce and call callback.
jest.mock('lodash.debounce', () => {
    return callback => args => callback(args);
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
                id: '123',
                gift_message: {
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

const renderHookWithProviders = ({
    renderHookOptions = {},
    mocks = [
        getGiftOptionsMock1,
        setGiftOptionsOnCartMock1,
        setGiftOptionsOnCartMock2
    ]
} = {}) => {
    const wrapper = ({ children }) => (
        <MockedProvider
            mocks={mocks}
            addTypename={false}
            defaultOptions={{
                watchQuery: { fetchPolicy: 'no-cache' },
                query: { fetchPolicy: 'no-cache' }
            }}
        >
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
                "field": "cardFrom",
              },
              "cardMessageProps": Object {
                "field": "cardMessage",
              },
              "cardToProps": Object {
                "field": "cardTo",
              },
              "giftReceiptProps": Object {
                "field": "includeGiftReceipt",
              },
              "loading": true,
              "optionsFormProps": Object {
                "initialValues": undefined,
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
                "field": "cardFrom",
              },
              "cardMessageProps": Object {
                "field": "cardMessage",
              },
              "cardToProps": Object {
                "field": "cardTo",
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

    it('returns mutation data when user updates form', async () => {
        const { result, waitForNextUpdate } = renderHookWithProviders();

        // Wait for query to finish loading
        await waitForNextUpdate();

        // Update form data - 1
        await act(() => {
            result.current.optionsFormProps.onValueChange(mockFormValues1);
        });

        expect(setGiftOptionsOnCartMock1.newData).toHaveBeenCalled();

        // Update form data - 2
        await act(() => {
            result.current.optionsFormProps.onValueChange(mockFormValues2);
        });

        expect(setGiftOptionsOnCartMock2.newData).toHaveBeenCalled();
    });
});
