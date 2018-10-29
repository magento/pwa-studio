// TODO: implement selectors

export const getOrderDetails = () => [
    { property: 'Order No', value: 84322 },
    { property: 'Order Date', value: 'June 24, 2018' },
    { property: 'Total', value: '$393.00' },
    { property: 'Products', value: 3 }
];

export const getShipmentDetails = () => [
    { property: 'Method', value: 'Free Shipping' },
    { property: 'Delivered', value: 'July 9, 2018' }
];

export const getPaymentDetails = () => [
    { property: 'Method', value: 'Visa ending in 0022' },
    { property: 'Billing Address', value: 'Same as Shipping' },
    { property: 'Shipping Address', value: '6146 Honey Bluff Parkway' }
];

export const getOrderSummary = () => [
    { property: 'Items', value: '$393.00' },
    { property: 'Shipping and Handling', value: '$0.00' },
    { property: 'Estimated Tax', value: '$7.50' }
];

export const getOtherItems = () => [{}, {}];
