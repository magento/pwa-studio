import { flatten } from '../useOrderConfirmationPage';

describe('#flatten', () => {
    it('returns flat cart data', () => {
        const data = {
            cart: {
                email: 'email',
                shipping_addresses: [
                    {
                        selected_shipping_method: {
                            carrier_title: 'carrier',
                            method_title: 'method'
                        },
                        city: 'city',
                        country: {
                            label: 'country'
                        },
                        firstname: 'firstname',
                        lastname: 'lastname',
                        postcode: 'postcode',
                        region: {
                            label: 'region'
                        },
                        shippingMethod: 'carrier - method',
                        street: ['street']
                    }
                ],
                total_quantity: 1
            }
        };

        const expected = {
            city: 'city',
            country: 'country',
            email: 'email',
            firstname: 'firstname',
            lastname: 'lastname',
            postcode: 'postcode',
            region: 'region',
            shippingMethod: 'carrier - method',
            street: ['street'],
            totalItemQuantity: 1
        };
        expect(flatten(data)).toEqual(expected);
    });
});
