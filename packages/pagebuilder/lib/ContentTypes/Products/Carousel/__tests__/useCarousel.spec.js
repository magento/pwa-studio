import React from 'react';
import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { renderHook } from '@testing-library/react-hooks';

import typePolicies from '@magento/peregrine/lib/Apollo/policies';
import { mockGetWishlistConfig } from '../__fixtures__/apolloMocks';
import { useCarousel } from '../useCarousel';

jest.mock(
    '@magento/peregrine/lib/hooks/useCustomerWishlistSkus/useCustomerWishlistSkus',
    () => ({
        useCustomerWishlistSkus: jest.fn()
    })
);

const cache = new InMemoryCache({
    typePolicies
});

const renderHookWithProviders = ({
    renderHookOptions = {},
    mocks = [mockGetWishlistConfig]
} = {}) => {
    const wrapper = ({ children }) => (
        <MockedProvider mocks={mocks} addTypename={true} cache={cache}>
            {children}
        </MockedProvider>
    );

    return renderHook(useCarousel, { wrapper, ...renderHookOptions });
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
