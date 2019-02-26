import { transparentPlaceholder } from 'src/shared/images';

export const itemMock = {
    id: 1,
    name: 'Joust Duffle Bag',
    size: '43',
    color: 'Navy Blue',
    qty: 1,
    titleImageSrc: transparentPlaceholder,
    price: 27,
    sku: '24-MB01'
};

export const otherItemsMock = [
    {
        id: 1,
        name: 'Joust Duffle Bag',
        size: '42',
        color: 'Navy Blue',
        qty: 1,
        titleImageSrc: transparentPlaceholder,
        price: 27,
        sku: '24-MB01'
    },
    {
        id: 2,
        name: 'Joust Duffle Bag',
        size: '40',
        color: 'Navy Blue',
        qty: 1,
        titleImageSrc: transparentPlaceholder,
        price: 27,
        sku: '24-MB01'
    },
    {
        id: 3,
        name: 'Joust Duffle Bag',
        size: '45',
        color: 'Navy Blue',
        qty: 1,
        titleImageSrc: transparentPlaceholder,
        price: 27,
        sku: '24-MB01'
    },
    {
        id: 4,
        name: 'Joust Duffle Bag',
        size: '47',
        color: 'Navy Blue',
        qty: 1,
        titleImageSrc: transparentPlaceholder,
        price: 27,
        sku: '24-MB01'
    },
    {
        id: 5,
        name: 'Joust Duffle Bag',
        size: '39',
        color: 'Navy Blue',
        qty: 1,
        titleImageSrc: transparentPlaceholder,
        price: 27,
        sku: '24-MB01'
    }
];

export const orderDetailsMock = {
    orderNo: 84322,
    orderDate: 'June 24, 2018',
    total: '$393.00',
    products: 3,
    shippingMethod: 'Free Shipping',
    delivered: 'July 9, 2018',
    paymentMethod: 'Visa ending in 0022',
    billingAddress: 'Same as Shipping',
    shippingAddress: '6146 Honey Bluff Parkway',
    items: '$393.00',
    shippingAndHandling: '$0.00',
    estimatedTax: '$7.50'
};
