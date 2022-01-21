import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { renderHook } from '@testing-library/react-hooks';

import DEFAULT_OPERATIONS from '../giftOptionsSection.gql';
import { useGiftOptionsSection } from '../useGiftOptionsSection';

const getGiftOptionsConfigMock1 = {
    request: {
        query: DEFAULT_OPERATIONS.getGiftOptionsConfigQuery
    },
    result: {
        data: {
            storeConfig: {
                id: '123',
                allow_order: '0',
                allow_gift_receipt: '0',
                allow_printed_card: '0'
            }
        }
    }
};

const getGiftOptionsConfigMock2 = {
    request: {
        query: DEFAULT_OPERATIONS.getGiftOptionsConfigQuery
    },
    result: {
        data: {
            storeConfig: {
                id: '123',
                allow_order: '1',
                allow_gift_receipt: '1',
                allow_printed_card: '1'
            }
        }
    }
};

const renderHookWithProviders = ({
    renderHookOptions = {},
    mocks = [getGiftOptionsConfigMock1]
} = {}) => {
    const wrapper = ({ children }) => (
        <MockedProvider mocks={mocks} addTypename={false}>
            {children}
        </MockedProvider>
    );

    return renderHook(useGiftOptionsSection, { wrapper, ...renderHookOptions });
};

describe('#useGiftOptionsSection', () => {
    it('returns correct shape while and after loading', async () => {
        const { result, waitForNextUpdate } = renderHookWithProviders();

        // Check data while loading
        expect(result.current).toMatchInlineSnapshot(`
            Object {
              "giftOptionsConfigData": Object {},
              "isLoading": true,
              "isVisible": false,
            }
        `);

        // Wait for query to finish loading
        await waitForNextUpdate();

        // Check data after load
        expect(result.current).toMatchInlineSnapshot(`
            Object {
              "giftOptionsConfigData": Object {
                "allow_gift_receipt": "0",
                "allow_order": "0",
                "allow_printed_card": "0",
                "id": "123",
              },
              "isLoading": false,
              "isVisible": false,
            }
        `);
    });

    it('returns correct shape after load and is visible', async () => {
        const { result, waitForNextUpdate } = renderHookWithProviders({
            renderHookOptions: {
                initialProps: {
                    operations: {}
                }
            },
            mocks: [getGiftOptionsConfigMock2]
        });

        // Wait for query to finish loading
        await waitForNextUpdate();

        expect(result.current).toMatchInlineSnapshot(`
            Object {
              "giftOptionsConfigData": Object {
                "allow_gift_receipt": "1",
                "allow_order": "1",
                "allow_printed_card": "1",
                "id": "123",
              },
              "isLoading": false,
              "isVisible": true,
            }
        `);
    });
});
