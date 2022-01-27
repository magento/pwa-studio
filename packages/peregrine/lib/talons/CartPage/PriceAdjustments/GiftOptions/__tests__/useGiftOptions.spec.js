import React from 'react';
import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { act, renderHook } from '@testing-library/react-hooks';

import typePolicies from '@magento/peregrine/lib/Apollo/policies';

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
                printed_card_included: false,
                prices: {
                    gift_options: {
                        printed_card: {
                            currency: 'USD',
                            value: 10
                        }
                    }
                }
            }
        }
    }
};

const setGiftOptionsOnCartMock1 = {
    request: {
        query: DEFAULT_OPERATIONS.setGiftOptionsOnCartMutation,
        variables: {
            cartId: '123',
            giftReceiptIncluded: true,
            printedCardIncluded: true
        }
    },
    newData: jest.fn(() => ({
        data: {
            cart: {
                __typename: 'Cart',
                id: '123',
                gift_receipt_included: true,
                printed_card_included: true
            }
        }
    }))
};

const mockFormValues2 = {
    cardTo: 'to2',
    cardFrom: 'from2',
    cardMessage: 'message2',
    includeGiftReceipt: true,
    includePrintedCard: false
};

const setGiftOptionsOnCartMock2 = generateMockForSetGiftOptionsOnCart(
    mockFormValues2
);

const mockFormValues3 = {
    cardTo: '',
    cardFrom: '',
    cardMessage: '',
    includeGiftReceipt: false,
    includePrintedCard: false
};

const setGiftOptionsOnCartMock3 = generateMockForSetGiftOptionsOnCart(
    mockFormValues3
);

const initialProps = undefined;

const cache = new InMemoryCache({
    typePolicies
});

const renderHookWithProviders = ({
    renderHookOptions = { initialProps },
    mocks = [getGiftOptionsMock1]
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

        await act(() => {
            result.current.optionsFormProps.getApi({
                getState: jest.fn().mockImplementation(() => {
                    return {};
                })
            });
        });

        // Check data while loading
        expect(result.current).toMatchInlineSnapshot(`
            Object {
              "cancelGiftMessageButtonProps": Object {
                "disabled": true,
                "onClick": [Function],
                "priority": "low",
                "type": "button",
              },
              "cardFromProps": Object {
                "disabled": true,
                "field": "cardFrom",
                "validate": [Function],
              },
              "cardMessageProps": Object {
                "disabled": true,
                "field": "cardMessage",
                "validate": [Function],
              },
              "cardToProps": Object {
                "disabled": true,
                "field": "cardTo",
                "validate": [Function],
              },
              "editGiftMessageButtonProps": Object {
                "disabled": true,
                "onClick": [Function],
                "priority": "normal",
                "type": "button",
              },
              "errors": Map {
                "setGiftOptionsOnCartMutation" => undefined,
                "getGiftOptionsQuery" => undefined,
              },
              "giftMessageCheckboxProps": Object {
                "disabled": false,
                "field": "includeGiftMessage",
                "onValueChange": [Function],
              },
              "giftMessageResult": Object {
                "cardFrom": "",
                "cardMessage": "",
                "cardTo": "",
              },
              "giftReceiptProps": Object {
                "field": "includeGiftReceipt",
                "onChange": [Function],
              },
              "hasGiftMessage": false,
              "loading": true,
              "optionsFormProps": Object {
                "getApi": [Function],
                "initialValues": Object {
                  "cardFrom": "",
                  "cardMessage": "",
                  "cardTo": "",
                  "includeGiftMessage": false,
                  "includeGiftReceipt": false,
                  "includePrintedCard": false,
                },
              },
              "printedCardPrice": Object {},
              "printedCardProps": Object {
                "field": "includePrintedCard",
                "onChange": [Function],
              },
              "saveGiftMessageButtonProps": Object {
                "disabled": true,
                "onClick": [Function],
                "priority": "normal",
                "type": "button",
              },
              "savingOptions": Array [],
              "showGiftMessageResult": false,
            }
        `);

        // Wait for query to finish loading
        await waitForNextUpdate();

        // Check data after load
        expect(result.current).toMatchInlineSnapshot(`
            Object {
              "cancelGiftMessageButtonProps": Object {
                "disabled": false,
                "onClick": [Function],
                "priority": "low",
                "type": "button",
              },
              "cardFromProps": Object {
                "disabled": false,
                "field": "cardFrom",
                "validate": [Function],
              },
              "cardMessageProps": Object {
                "disabled": false,
                "field": "cardMessage",
                "validate": [Function],
              },
              "cardToProps": Object {
                "disabled": false,
                "field": "cardTo",
                "validate": [Function],
              },
              "editGiftMessageButtonProps": Object {
                "disabled": false,
                "onClick": [Function],
                "priority": "normal",
                "type": "button",
              },
              "errors": Map {
                "setGiftOptionsOnCartMutation" => undefined,
                "getGiftOptionsQuery" => undefined,
              },
              "giftMessageCheckboxProps": Object {
                "disabled": false,
                "field": "includeGiftMessage",
                "onValueChange": [Function],
              },
              "giftMessageResult": Object {
                "cardFrom": "from",
                "cardMessage": "message",
                "cardTo": "to",
              },
              "giftReceiptProps": Object {
                "field": "includeGiftReceipt",
                "onChange": [Function],
              },
              "hasGiftMessage": true,
              "loading": false,
              "optionsFormProps": Object {
                "getApi": [Function],
                "initialValues": Object {
                  "cardFrom": "from",
                  "cardMessage": "message",
                  "cardTo": "to",
                  "includeGiftMessage": true,
                  "includeGiftReceipt": false,
                  "includePrintedCard": false,
                },
              },
              "printedCardPrice": Object {
                "currency": "USD",
                "value": 10,
              },
              "printedCardProps": Object {
                "field": "includePrintedCard",
                "onChange": [Function],
              },
              "saveGiftMessageButtonProps": Object {
                "disabled": false,
                "onClick": [Function],
                "priority": "normal",
                "type": "button",
              },
              "savingOptions": Array [],
              "showGiftMessageResult": true,
            }
        `);
    });

    it('returns mutation data when user select gift receipt', async () => {
        const { result, waitForValueToChange } = renderHookWithProviders({
            mocks: [setGiftOptionsOnCartMock1]
        });

        const fieldName = result.current.giftReceiptProps.field;
        const element = {
            target: {
                name: fieldName
            }
        };

        expect(result.current.savingOptions).toEqual([]);

        // Test without form api
        await act(() => {
            result.current.giftReceiptProps.onChange(element);
        });

        // Test checkbox checked
        await act(() => {
            result.current.optionsFormProps.getApi({
                getState: jest.fn().mockImplementation(() => {
                    return {};
                }),
                getValue: jest.fn().mockReturnValue(true)
            });

            result.current.giftReceiptProps.onChange(element);
        });

        expect(result.current.savingOptions).toContain(fieldName);

        // Wait for value to change
        await waitForValueToChange(() => result.current.savingOptions);

        expect(result.current.savingOptions).toEqual([]);
    });

    it('returns mutation data when user adds gift message', async () => {
        const { result, waitForValueToChange } = renderHookWithProviders({
            mocks: [setGiftOptionsOnCartMock2]
        });

        expect(result.current.savingOptions).toEqual([]);

        // Toggle Gift Message section
        await act(() => {
            result.current.giftMessageCheckboxProps.onValueChange(true);
        });

        // Test without form api
        await act(() => {
            result.current.saveGiftMessageButtonProps.onClick();
        });

        // Test with invalid form
        await act(() => {
            result.current.optionsFormProps.getApi({
                getState: jest.fn().mockImplementation(() => {
                    return {
                        invalid: true
                    };
                }),
                getValue: jest.fn().mockImplementation(field => {
                    return mockFormValues2[field];
                }),
                validate: jest.fn()
            });

            result.current.saveGiftMessageButtonProps.onClick();
        });

        // Test with valid form
        await act(() => {
            result.current.optionsFormProps.getApi({
                getState: jest.fn().mockImplementation(() => {
                    return {
                        invalid: false
                    };
                }),
                getValue: jest.fn().mockImplementation(field => {
                    return mockFormValues2[field];
                }),
                validate: jest.fn()
            });

            result.current.saveGiftMessageButtonProps.onClick();
        });

        expect(result.current.savingOptions).toContain('giftMessage');

        // Wait for value to change
        await waitForValueToChange(() => result.current.savingOptions);

        expect(result.current.savingOptions).toEqual([]);
        expect(result.current.showGiftMessageResult).toBe(true);

        // Start Edit Gift Message
        await act(() => {
            result.current.editGiftMessageButtonProps.onClick();
        });

        expect(result.current.showGiftMessageResult).toBe(false);

        // Cancel Edit Gift Message
        await act(() => {
            result.current.cancelGiftMessageButtonProps.onClick();
        });

        expect(result.current.showGiftMessageResult).toBe(true);
    });

    it('returns mutation data when user removes gift message', async () => {
        const { result, waitForValueToChange } = renderHookWithProviders({
            mocks: [getGiftOptionsMock1, setGiftOptionsOnCartMock3]
        });

        expect(result.current.savingOptions).toEqual([]);

        // Test without form api
        await act(() => {
            result.current.giftMessageCheckboxProps.onValueChange(false);
        });

        // Toggle form
        await act(() => {
            result.current.giftMessageCheckboxProps.onValueChange(true);
        });

        // Removes Gift Message
        await act(() => {
            result.current.optionsFormProps.getApi({
                getState: jest.fn().mockImplementation(() => {
                    return {
                        invalid: false
                    };
                }),
                getValue: jest.fn().mockImplementation(field => {
                    return mockFormValues3[field];
                }),
                setError: jest.fn,
                setValues: jest.fn()
            });

            result.current.giftMessageCheckboxProps.onValueChange(false);
        });

        expect(result.current.savingOptions).toContain('giftMessage');

        // Wait for value to change
        await waitForValueToChange(() => result.current.savingOptions);

        expect(result.current.savingOptions).toEqual([]);
    });
});
