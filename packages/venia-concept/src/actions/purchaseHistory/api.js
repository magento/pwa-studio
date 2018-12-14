const purchaseHistoryMock = {
    items: [
        {
            item_id: 27,
            name: 'Crown Summit Backpack',
            image: {
                file: '/image.jpg'
            }
        },
        {
            item_id: 28,
            name: 'Crown Summit Backpack',
            image: {
                file: '/image.jpg'
            }
        }
    ]
};

// TODO: make a request here. Move to rest service.
export const fetchPurchaseHistory = () =>
    new Promise(resolve => {
        setTimeout(() => resolve(purchaseHistoryMock), 1000);
    });
