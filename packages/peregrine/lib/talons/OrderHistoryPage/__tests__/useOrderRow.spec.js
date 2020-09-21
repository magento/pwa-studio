import React, { useEffect } from 'react';
import { act } from 'react-test-renderer';
import { useQuery } from '@apollo/client';

import createTestInstance from '../../../util/createTestInstance';
import { useOrderRow } from '../useOrderRow';

jest.mock('@apollo/client', () => ({
    useQuery: jest.fn()
}));

const log = jest.fn();
const Component = props => {
    const talonProps = useOrderRow({ ...props });

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return null;
};

test('returns correct shape', () => {
    const items = [
        { thumbnail: { url: 'sku1 thumbnail url' } },
        { thumbnail: { url: 'sku2 thumbnail url' } }
    ];
    useQuery.mockReturnValue({ data: { products: { items } }, loading: false });
    createTestInstance(
        <Component
            queries={{ getProductThumbnailsQuery: 'getProductThumbnailsQuery' }}
            items={[{ product_sku: 'sku1' }, { product_sku: 'sku2' }]}
        />
    );

    const talonProps = log.mock.calls[0][0];

    expect(talonProps).toMatchSnapshot();
});

test('callback toggles open state', () => {
    const items = [
        { thumbnail: { url: 'sku1 thumbnail url' } },
        { thumbnail: { url: 'sku2 thumbnail url' } }
    ];
    useQuery.mockReturnValue({ data: { products: { items } }, loading: false });
    createTestInstance(
        <Component
            queries={{ getProductThumbnailsQuery: 'getProductThumbnailsQuery' }}
            items={[{ product_sku: 'sku1' }, { product_sku: 'sku2' }]}
        />
    );

    const talonProps = log.mock.calls[0][0];

    act(() => {
        talonProps.handleContentToggle();
    });

    const newTalonProps = log.mock.calls[1][0];

    expect(talonProps.isOpen).toBe(false);
    expect(newTalonProps.isOpen).toBe(true);
});
