import React from 'react';
import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { renderHook } from '@testing-library/react-hooks';

import typePolicies from '../../../Apollo/policies';
import {
    mockGetStoreConfigCE,
    mockGetStoreConfigEE
} from '../__fixtures__/apolloMocks';

import { useGallery } from '../useGallery';

import defaultOperations from '../gallery.gql';
import ceOperations from '../gallery.gql.ce';
import eeOperations from '../gallery.gql.ee';

jest.mock(
    '../../../hooks/useCustomerWishlistSkus/useCustomerWishlistSkus',
    () => ({
        useCustomerWishlistSkus: jest.fn()
    })
);

const cache = new InMemoryCache({
    typePolicies
});

const renderHookWithProviders = ({
    renderHookOptions = {},
    mocks = []
} = {}) => {
    const wrapper = ({ children }) => (
        <MockedProvider mocks={mocks} addTypename={true} cache={cache}>
            {children}
        </MockedProvider>
    );

    return renderHook(useGallery, { wrapper, ...renderHookOptions });
};

test('returns store config EE', async () => {
    defaultOperations.getStoreConfigQuery = eeOperations.getStoreConfigQuery;

    const { result, waitForNextUpdate } = renderHookWithProviders({
        mocks: [mockGetStoreConfigEE]
    });

    expect(result.current).toMatchInlineSnapshot(`
        Object {
          "storeConfig": null,
        }
    `);

    await waitForNextUpdate();

    expect(result.current).toMatchInlineSnapshot(`
        Object {
          "storeConfig": Object {
            "enable_multiple_wishlists": "1",
            "magento_wishlist_general_is_enabled": "1",
            "product_url_suffix": ".html",
            "store_code": "default",
          },
        }
    `);
});

test('returns store config CE', async () => {
    defaultOperations.getStoreConfigQuery = ceOperations.getStoreConfigQuery;

    const { result, waitForNextUpdate } = renderHookWithProviders({
        mocks: [mockGetStoreConfigCE]
    });

    // I am unsure why this test renders without a loading state whereas the EE
    // test renders with a loading (null) state.
    expect(result.current).toMatchInlineSnapshot(`
        Object {
          "storeConfig": Object {
            "magento_wishlist_general_is_enabled": "1",
            "product_url_suffix": ".html",
            "store_code": "default",
          },
        }
    `);

    await waitForNextUpdate();

    expect(result.current).toMatchInlineSnapshot(`
        Object {
          "storeConfig": Object {
            "magento_wishlist_general_is_enabled": "1",
            "product_url_suffix": ".html",
            "store_code": "default",
          },
        }
    `);
});
