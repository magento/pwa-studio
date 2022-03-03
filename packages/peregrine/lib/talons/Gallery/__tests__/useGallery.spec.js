import React from 'react';
import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { renderHook } from '@testing-library/react-hooks';

import typePolicies from '../../../Apollo/policies';
import {
    mockGetStoreConfigMOS,
    mockGetStoreConfigAC
} from '../__fixtures__/apolloMocks';

import { useGallery } from '../useGallery';

import defaultOperations from '../gallery.gql';
import mosOperations from '../gallery.gql.ce';
import acOperations from '../gallery.gql.ee';

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

test('returns store config AC', async () => {
    defaultOperations.getStoreConfigQuery = acOperations.getStoreConfigQuery;

    const { result, waitForNextUpdate } = renderHookWithProviders({
        mocks: [mockGetStoreConfigAC]
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

test('returns store config MOS', async () => {
    defaultOperations.getStoreConfigQuery = mosOperations.getStoreConfigQuery;

    const { result, waitForNextUpdate } = renderHookWithProviders({
        mocks: [mockGetStoreConfigMOS]
    });

    // I am unsure why this test renders without a loading state whereas the AC
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
