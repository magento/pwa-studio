import React from 'react';
import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { renderHook } from '@testing-library/react-hooks';

import typePolicies from '@magento/peregrine/lib/Apollo/policies';
import {
    mockGetWishlistConfigCE,
    mockGetWishlistConfigEE
} from '../__fixtures__/apolloMocks';

import { useCarousel } from '../useCarousel';

import defaultOperations from '../carousel.gql';
import ceOperations from '../carousel.gql.ce';
import eeOperations from '../carousel.gql.ee';

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
    mocks = []
} = {}) => {
    const wrapper = ({ children }) => (
        <MockedProvider mocks={mocks} addTypename={true} cache={cache}>
            {children}
        </MockedProvider>
    );

    return renderHook(useCarousel, { wrapper, ...renderHookOptions });
};

test('returns store config EE', async () => {
    defaultOperations.getWishlistConfigQuery =
        eeOperations.getWishlistConfigQuery;

    const { result, waitForNextUpdate } = renderHookWithProviders({
        mocks: [mockGetWishlistConfigEE]
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
            "id": 1,
            "magento_wishlist_general_is_enabled": "1",
          },
        }
    `);
});

test('returns store config CE', async () => {
    defaultOperations.getWishlistConfigQuery =
        ceOperations.getWishlistConfigQuery;

    const { result, waitForNextUpdate } = renderHookWithProviders({
        mocks: [mockGetWishlistConfigCE]
    });

    // I am unsure why this test renders without a loading state whereas the EE
    // test renders with a loading (null) state.
    expect(result.current).toMatchInlineSnapshot(`
        Object {
          "storeConfig": Object {
            "id": 1,
            "magento_wishlist_general_is_enabled": "1",
          },
        }
    `);

    await waitForNextUpdate();

    expect(result.current).toMatchInlineSnapshot(`
        Object {
          "storeConfig": Object {
            "id": 1,
            "magento_wishlist_general_is_enabled": "1",
          },
        }
    `);
});
