import { getOrderInformation, getAccountInformation } from '../checkoutReceipt';

test('getOrderInformation returns order', () => {
    const order = { id: 1, shipping_address: {} };
    const state = {
        checkoutReceipt: {
            order
        }
    };

    expect(getOrderInformation(state)).toEqual(order);
});

test('getAccountInformation returns account information', () => {
    const email = 'test@example.com';
    const firstName = 'First Name';
    const lastName = 'Last Name';
    const state = {
        checkoutReceipt: {
            order: {
                shipping_address: {
                    email,
                    firstname: firstName,
                    lastname: lastName
                }
            }
        }
    };

    expect(getAccountInformation(state)).toEqual({
        email,
        firstName,
        lastName
    });
});
