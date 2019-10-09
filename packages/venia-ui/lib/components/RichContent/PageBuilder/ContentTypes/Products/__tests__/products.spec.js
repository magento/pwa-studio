import { createTestInstance } from '@magento/peregrine';
import React from 'react';
import Products from '../products';

jest.mock('@magento/venia-drivers', () => ({
    Query: jest.fn()
}));
import { Query } from '@magento/venia-drivers';
jest.mock('../../../../../Gallery', () => jest.fn());
import Gallery from '../../../../../Gallery';
const mockGallery = Gallery.mockImplementation(() => 'Gallery');

test('render products with no props & no products', () => {
    Query.mockImplementation(({ children }) => {
        return children({
            data: {
                products: {
                    items: []
                }
            },
            error: false,
            loading: false
        });
    });

    const component = createTestInstance(<Products />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('render products with loading state', () => {
    Query.mockImplementation(({ children }) => {
        return children({
            data: {
                products: {
                    items: []
                }
            },
            error: false,
            loading: true
        });
    });

    const component = createTestInstance(<Products />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('render products with error state', () => {
    Query.mockImplementation(({ children }) => {
        return children({
            data: {
                products: {
                    items: []
                }
            },
            error: true,
            loading: false
        });
    });

    const component = createTestInstance(<Products />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('render products and ensure order is correct passed to Gallery', () => {
    Query.mockImplementation(({ children }) => {
        return children({
            data: {
                products: {
                    items: [
                        {
                            sku: 'TEST-2'
                        },
                        {
                            sku: 'TEST-1'
                        }
                    ]
                }
            },
            error: false,
            loading: false
        });
    });

    const productProps = {
        skus: ['TEST-1', 'TEST-2']
    };

    createTestInstance(<Products {...productProps} />);
    expect(mockGallery).toHaveBeenCalledWith(
        expect.objectContaining({
            items: [
                {
                    sku: 'TEST-1'
                },
                {
                    sku: 'TEST-2'
                }
            ]
        }),
        expect.anything()
    );
});
