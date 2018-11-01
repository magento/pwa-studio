// TODO: implement selectors
import dressPicture from './dress.jpg';

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

export const getItem = () => {
    return {
        id: 1,
        name: 'Joust Duffle Bag',
        size: '43',
        color: 'Navy Blue',
        qty: 1,
        titleImageSrc: dressPicture,
        price: 27,
        sku: '24-MB01'
    };
};

export const getOtherItems = () => [
    {
        id: 1,
        name: 'Joust Duffle Bag',
        size: '42',
        color: 'Navy Blue',
        qty: 1,
        titleImageSrc: dressPicture,
        price: 27,
        sku: '24-MB01'
    },
    {
        id: 2,
        name: 'Joust Duffle Bag',
        size: '40',
        color: 'Navy Blue',
        qty: 1,
        titleImageSrc: dressPicture,
        price: 27,
        sku: '24-MB01'
    },
    {
        id: 3,
        name: 'Joust Duffle Bag',
        size: '45',
        color: 'Navy Blue',
        qty: 1,
        titleImageSrc: dressPicture,
        price: 27,
        sku: '24-MB01'
    },
    {
        id: 4,
        name: 'Joust Duffle Bag',
        size: '47',
        color: 'Navy Blue',
        qty: 1,
        titleImageSrc: dressPicture,
        price: 27,
        sku: '24-MB01'
    },
    {
        id: 5,
        name: 'Joust Duffle Bag',
        size: '39',
        color: 'Navy Blue',
        qty: 1,
        titleImageSrc: dressPicture,
        price: 27,
        sku: '24-MB01'
    }
];
