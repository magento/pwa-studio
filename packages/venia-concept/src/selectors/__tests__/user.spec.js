import { getCurrentUser, getAccountAddressList } from '../user';

test('getCurrentUser returns user', () => {
    const currentUser = {};
    const state = {
        user: {
            currentUser
        }
    };

    expect(getCurrentUser(state)).toBe(currentUser);
});

test('getAccountAddressList returns array of addresses', () => {
    const defaultShippingAddress = {
        id: 1,
        default_shipping: true
    };
    const defaultBillingAddress = {
        id: 2,
        default_billing: true
    };

    const state = {
        user: {
            currentUser: {
                addresses: [defaultShippingAddress, defaultBillingAddress]
            }
        }
    };

    const result = getAccountAddressList(state);

    const idArray = [defaultBillingAddress.id, defaultShippingAddress.id];
    result.forEach((resultItem, index) => {
        expect(result[index]).toEqual({
            title: expect.any(String),
            address: expect.objectContaining({
                id: idArray[index]
            })
        });
    });
});
