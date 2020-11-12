export const priceSummaryResponse = {
    cart: {
        prices: {
            subtotal_excluding_tax: {
                value: 20
            },
            grand_total: {
                value: 30
            },
            discounts: [
                {
                    amount: {
                        value: 5
                    }
                }
            ],
            applied_taxes: [
                {
                    amount: {
                        value: 7
                    }
                }
            ]
        },
        applied_gift_cards: [
            {
                code: 'GiftCardCode'
            }
        ],
        shipping_addresses: [
            {
                firstname: 'Veronica',
                lastname: 'Costello',
                street: ['6146 Honey Bluff Parkway'],
                city: 'Calder',
                region: {
                    code: 'MI',
                    label: 'Michigan'
                },
                country: {
                    code: 'US',
                    label: 'US'
                }
            }
        ],
        items: [
            {
                id: '43',
                prices: {
                    total_item_discount: {
                        value: 37.7
                    },
                    price: {
                        value: 29
                    }
                },
                product: {
                    name: 'Elisa EverCool&trade; Tee',
                    sku: 'WS06'
                },
                quantity: 4
            }
        ]
    }
};
