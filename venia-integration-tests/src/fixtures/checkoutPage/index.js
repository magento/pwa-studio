export const checkoutPageRoute = 'checkout';

export const checkoutShippingData = {
    gb: {
        countryCode: 'GB',
        street1: 'Great Russell St',
        city: 'London',
        region: 'England',
        postCode: 'WC1B 3DG',
        telephone: '+44 1234 5678'
    },
    us: {
        countryCode: 'US',
        street1: '111 57th Street',
        street2: 'Suite 1000',
        city: 'New New York',
        regionCode: 'NY',
        regionId: '43',
        postCode: '10019',
        telephone: '+12345678909'
    }
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

export const defaultGiftOptionsData = {
    includeGiftReceipt: true,
    includePrintedCard: true,
    cardMessage: 'Space. It Seems To Go On Forever.'
};
export const defaultPaymentMethod = 'Credit Card';

export const defaultShippingMethods = {
    free: {
        code: 'free',
        label: 'Free'
    },
    flatrate: {
        code: 'flatrate',
        label: 'Fixed'
    }
};
