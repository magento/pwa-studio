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
        }
    ];

    return {
        items: mockData
    };
};
