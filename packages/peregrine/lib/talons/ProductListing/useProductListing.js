export const useProductListing = () => {
    const mockData = [
        {
            id: '123',
            prices: {
                price: {
                    value: 50
                },
                row_total: {
                    value: 100
                }
            },
            product: {
                name: 'Simple Product',
                sku: 'SKU123',
                small_image: {
                    url: 'https://via.placeholder.com/800',
                    label: 'Simple Product Image'
                }
            },
            quantity: 2
        },
        {
            id: '456',
            prices: {
                price: {
                    value: 50
                },
                row_total: {
                    value: 100
                }
            },
            product: {
                name: 'Configurable Product',
                sku: 'SKU456',
                small_image: {
                    url: 'https://via.placeholder.com/800',
                    label: 'Configurable Product Image'
                }
            },
            quantity: 1,
            configurable_options: [
                {
                    option_label: 'Color',
                    value_label: 'White'
                },
                {
                    option_label: 'Size',
                    value_label: 'L'
                }
            ]
        }
    ];

    return {
        items: mockData
    };
};
