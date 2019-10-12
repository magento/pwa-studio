import { createTestInstance } from '@magento/peregrine';
import React from 'react';
import Products from '../products';

jest.mock('@apollo/react-hooks', () => ({
    useQuery: jest.fn()
}));
import { useQuery } from '@apollo/react-hooks';
jest.mock('../../../../../Gallery', () => jest.fn());
import Gallery from '../../../../../Gallery';
const mockGallery = Gallery.mockImplementation(() => 'Gallery');

test('render products with no props & no products', () => {
    useQuery.mockImplementation(() => {
        return {
            data: {
                products: {
                    items: []
                }
            },
            error: false,
            loading: false
        };
    });

    const component = createTestInstance(<Products />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('render products with all props & no products', () => {
    useQuery.mockImplementation(() => {
        return {
            data: {
                products: {
                    items: []
                }
            },
            error: false,
            loading: false
        };
    });

    const productsProps = {
        skus: ['TEST-1', 'TEST-2'],
        textAlign: 'right',
        border: 'solid',
        borderColor: 'red',
        borderWidth: '10px',
        borderRadius: '15px',
        marginTop: '10px',
        marginRight: '10px',
        marginBottom: '10px',
        marginLeft: '10px',
        paddingTop: '10px',
        paddingRight: '10px',
        paddingBottom: '10px',
        paddingLeft: '10px',
        cssClasses: ['test-class']
    };

    const component = createTestInstance(<Products {...productsProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('render products with loading state', () => {
    useQuery.mockImplementation(() => {
        return {
            data: {
                products: {
                    items: []
                }
            },
            error: false,
            loading: true
        };
    });

    const component = createTestInstance(<Products />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('render products with error state', () => {
    useQuery.mockImplementation(() => {
        return {
            data: {
                products: {
                    items: []
                }
            },
            error: true,
            loading: false
        };
    });

    const component = createTestInstance(<Products />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('render products and ensure order is correct passed to Gallery', () => {
    useQuery.mockImplementation(() => {
        return {
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
        };
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
