import React from 'react';
import TestRenderer from 'react-test-renderer';
import ProductFullDetail from '../ProductFullDetail';

jest.mock('src/classify');

const mockConfigurableProduct = {
    __typename: 'ConfigurableProduct',
    sku: 'SKU123',
    name: 'Mock Configrable Product',
    price: {
        regularPrice: {
            amount: {
                currency: 'USD',
                value: 123
            }
        }
    },
    description: 'Mock configurable product has a description!',
    media_gallery_entries: [
        {
            label: 'Base Product - Image 1',
            position: 1,
            disabled: false,
            file: '/base/image-1.jpg'
        },
        {
            label: 'Base Product Image 2',
            position: 2,
            disabled: false,
            file: '/base/image-2.jpg'
        }
    ],
    configurable_options: [
        {
            attribute_code: 'configurable_option',
            attribute_id: '1',
            id: 1,
            label: 'Configurable Option',
            values: [
                {
                    default_label: 'Option 1',
                    label: 'Option 1',
                    store_label: 'Option 1',
                    use_default_value: true,
                    value_index: 1
                },
                {
                    default_label: 'Option 2',
                    label: 'Option 2',
                    store_label: 'Option 2',
                    use_default_value: true,
                    value_index: 2
                }
            ]
        }
    ],
    variants: [
        {
            attributes: [
                {
                    code: 'configurable_option',
                    value_index: 1
                }
            ],
            product: {
                id: 123,
                media_gallery_entries: [
                    {
                        disabled: false,
                        file: '/variant/image-1.jpg',
                        label: 'Mock Configurable Product - Variant 1',
                        position: 1
                    }
                ],
                sku: 'SKU123-CO1',
                stock_status: 'IN_STOCK'
            }
        }
    ]
};

test('Configurable Product has correct media gallery image count', async () => {
    const { root } = TestRenderer.create(
        <ProductFullDetail
            product={mockConfigurableProduct}
            isAddingItem={false}
            classes={{}}
            addToCart={jest.fn()}
        />
    );
    const { instance } = root.children[0];

    expect(instance.mediaGalleryEntries).toHaveLength(2);
    instance.setState({
        optionSelections: new Map([['1', 1]])
    });
    expect(instance.mediaGalleryEntries).toHaveLength(3);
});
