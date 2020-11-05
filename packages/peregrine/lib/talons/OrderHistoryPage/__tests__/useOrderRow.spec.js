import React, { useEffect } from 'react';
import { act } from 'react-test-renderer';
import { useQuery } from '@apollo/client';

import createTestInstance from '../../../util/createTestInstance';
import { useOrderRow } from '../useOrderRow';

jest.mock('@apollo/client', () => {
    const apolloClient = jest.requireActual('@apollo/client');

    return {
        ...apolloClient,
        useQuery: jest.fn()
    };
});

const log = jest.fn();
const Component = props => {
    const talonProps = useOrderRow({ ...props });

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return null;
};

const defaultProps = {
    queries: { getProductThumbnailsQuery: 'getProductThumbnailsQuery' },
    items: [{ product_url_key: 'sku1' }, { product_url_key: 'sku2' }]
};
const items = [
    { thumbnail: { url: 'sku1 thumbnail url' }, url_key: 'sku1' },
    { thumbnail: { url: 'sku2 thumbnail url' }, url_key: 'sku2' }
];
const dataResponse = {
    data: {
        products: {
            items
        }
    },
    loading: false
};

test('returns correct shape', () => {
    useQuery.mockReturnValue(dataResponse);
    createTestInstance(<Component {...defaultProps} />);

    const talonProps = log.mock.calls[0][0];

    expect(talonProps).toMatchSnapshot();
});

test('filters out items not in the request', () => {
    useQuery.mockReturnValue({
        data: {
            products: {
                items: [
                    ...items,
                    {
                        thumbnail: { url: 'bundle-sku thumbnail url' },
                        url_key: 'bundle-sku'
                    }
                ]
            }
        },
        loading: false
    });

    createTestInstance(<Component {...defaultProps} />);

    const talonProps = log.mock.calls[0][0];

    expect(talonProps.imagesData).toHaveLength(2);
});

test('callback toggles open state', () => {
    useQuery.mockReturnValue(dataResponse);
    createTestInstance(<Component {...defaultProps} />);

    const talonProps = log.mock.calls[0][0];

    act(() => {
        talonProps.handleContentToggle();
    });

    const newTalonProps = log.mock.calls[1][0];

    expect(talonProps.isOpen).toBe(false);
    expect(newTalonProps.isOpen).toBe(true);
});
