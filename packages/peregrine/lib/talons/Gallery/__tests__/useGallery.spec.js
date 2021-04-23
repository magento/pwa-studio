import React from 'react';
import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { renderHook } from '@testing-library/react-hooks';

import typePolicies from '../../../Apollo/policies';
import operations from '../gallery.gql.ee';
import {
    mockGetWishlistConfig,
    mockGetWishlistItemsPage1,
    mockGetWishlistItemsPage2
} from '../__fixtures__/apolloMocks';
import { useGallery } from '../useGallery';

jest.mock('../../../context/user', () => ({
    useUserContext: jest.fn().mockReturnValue([{ isSignedIn: true }])
}));

const cache = new InMemoryCache({
    typePolicies
});

const renderHookWithProviders = ({
    renderHookOptions = {},
    mocks = [
        mockGetWishlistConfig,
        mockGetWishlistItemsPage1,
        mockGetWishlistItemsPage1,
        mockGetWishlistItemsPage2
    ]
} = {}) => {
    const wrapper = ({ children }) => (
        <MockedProvider mocks={mocks} addTypename={true} cache={cache}>
            {children}
        </MockedProvider>
    );

    return renderHook(useGallery, { wrapper, ...renderHookOptions });
};

test('returns store config', async () => {
    const { result, waitForNextUpdate } = renderHookWithProviders();

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
            "id": 1,
            "magento_wishlist_general_is_enabled": "1",
          },
        }
    `);
});

test('pre-caches wishlist items', async () => {
    const { waitForNextUpdate } = renderHookWithProviders();

    await waitForNextUpdate();

    const preCacheData = cache.readQuery({
        query: operations.getProductsInWishlistsQuery
    });

    expect(preCacheData).toMatchInlineSnapshot(`
        Object {
          "customerWishlistProducts": Array [
            "Dress",
            "Shirt",
          ],
        }
    `);
});
