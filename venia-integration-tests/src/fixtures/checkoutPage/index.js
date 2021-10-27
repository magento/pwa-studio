export const checkoutPageRoute = 'checkout';

export const checkoutCustomer1 = {
    firstName: 'JohnTest',
    lastName: 'SmithTest',
    street1: '123 Test Drive',
    street2: 'Apt 123',
    city: 'Culver',
    postCode: '90230',
    regionId: '12',
    telephone: '1234567890',
    email: 'test@example.com',
    region: 'California',
    countryCode: 'US',
    addressCombined: 'Culver, California 90230 US',
    countryFull: 'United States'
};

export const checkoutCustomer2 = {
    firstName: 'John1',
    lastName: 'Smith2',
    street1: '456 Demo street',
    street2: 'Apt 456',
    city: 'Austin',
    postCode: '78759',
    regionId: '57',
    telephone: '1234567890',
    email: 'updated@example.com',
    region: 'Texas',
    countryCode: 'US',
    addressCombined: 'Austin, Texas 78759 US',
    countryFull: 'United States'
};

export const checkoutCustomer3 = {
    firstName: 'Veda',
    lastName: 'Peta',
    street1: '987 Alameda street',
    street2: 'Apt 555',
    city: 'San Antonio',
    postCode: '78201',
    regionId: '57',
    telephone: '67893456',
    region: 'Texas',
    countryCode: 'US',
    addressCombined: 'San Antonio, Texas 78201 US',
    countryFull: 'United States'
};

export const checkoutShippingData = {
    countryCode: 'US',
    street1: '111 57th Street',
    street2: 'Suite 1000',
    city: 'New New York',
    regionId: '43',
    postCode: '10019',
    telephone: '+12345678909',
    region: 'New York'
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
        name: 'Harrison Ford Jr.',
        number: '5555 5555 5555 4444',
        expiration: '0125',
        cvv: '123',
        updatedCardHolderName: 'Bender Rodríguez',
        shortDescription: 'MasterCard ending in 4444'
    }
];

export const defaultPaymentMethod = 'Credit Card';
export const defaultShippingMethod = 'Free';
export const fixedShippingMethod = 'Fixed';
export const fixedShippingMethodCode = 'flatrate';
