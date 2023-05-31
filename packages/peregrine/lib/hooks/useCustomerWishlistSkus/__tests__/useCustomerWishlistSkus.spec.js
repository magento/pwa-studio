import React from 'react';
import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { renderHook } from '@testing-library/react-hooks';

import typePolicies from '@magento/peregrine/lib/Apollo/policies';

import operations from '../customerWishlist.gql.ee';
import {
    mockGetWishlistItemsPage1,
    mockGetWishlistItemsPage2
} from '../__fixtures__/apolloMocks';
import { useCustomerWishlistSkus } from '../useCustomerWishlistSkus';

jest.mock('../../../context/user', () => ({
    useUserContext: jest.fn().mockReturnValue([{ isSignedIn: true }])
}));

const cache = new InMemoryCache({
    typePolicies
});

const renderHookWithProviders = ({
    renderHookOptions = {},
    mocks = [mockGetWishlistItemsPage1, mockGetWishlistItemsPage2]
} = {}) => {
    const wrapper = ({ children }) => (
        <MockedProvider mocks={mocks} addTypename={true} cache={cache}>
            {children}
        </MockedProvider>
    );

    return renderHook(useCustomerWishlistSkus, {
        wrapper,
        ...renderHookOptions
    });
};

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
