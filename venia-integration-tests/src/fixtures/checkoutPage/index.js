export const checkoutPageRoute = 'checkout';

export const checkoutShippingData = {
    countryCode: 'US',
    street1: '111 57th Street',
    street2: 'Suite 1000',
    city: 'New New York',
    regionId: '43',
    postCode: '10019',
    telephone: '+12345678909'
};

export const checkoutBillingData = [
    {
        name: 'Philip J. Fry',
        number: '4111 1111 1111 1111',
        expiration: '0125',
        cvv: '123',
        updatedCardHolderName: 'Bender Rodríguez',
        shortDescription: 'Visa ending in 1111'
    },
    {
        number: '5555 5555 5555 4444',
        expiration: '0125',
        cvv: '123',
        updatedCardHolderName: 'Bender Rodríguez',
        shortDescription: 'MasterCard ending in 4444'
    }
];

export const defaultPaymentMethod = 'Credit Card';
export const defaultShippingMethod = 'Free';
