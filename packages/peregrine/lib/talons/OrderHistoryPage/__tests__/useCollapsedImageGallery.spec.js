import React, { useEffect } from 'react';
import { useCollapsedImageGallery } from '../useCollapsedImageGallery';
import { useQuery } from '@apollo/client';
import createTestInstance from '../../../util/createTestInstance';

jest.mock('@apollo/client', () => ({
    useQuery: jest.fn()
}));

const log = jest.fn();
const Component = props => {
    const talonProps = useCollapsedImageGallery({ ...props });

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return null;
};

test('returns correct shape', () => {
    useQuery.mockReturnValue({ data: 'getProducyThumbnailQuery Response' });

    const props = {
        imageCount: 4,
        items: [{ product_sku: 'sku1' }, { product_sku: 'sku2' }],
        queries: {}
    };

    createTestInstance(<Component {...props} />);

    const talonProps = log.mock.calls[0][0];
    const queryOptionProps = useQuery.mock.calls[0][1];

    expect(talonProps).toMatchSnapshot();
    expect(queryOptionProps).toMatchSnapshot();
});
