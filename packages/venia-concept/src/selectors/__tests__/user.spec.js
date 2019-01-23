import {
    getUserInformation,
    getCurrentUser,
    getAccountAddressList
} from '../user';

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

test('getCurrentUser returns user', () => {
    const currentUser = {};
    const state = {
        user: {
            currentUser
        }
    };

    expect(getCurrentUser(state)).toBe(currentUser);
});

test('getUserInformation returns user information', () => {
    const email = 'user@example.com';
    const firstname = 'Example';
    const lastname = 'User';

    const state = {
        user: {
            currentUser: {
                email,
                firstname,
                lastname
            }
        }
    };

    expect(getUserInformation(state)).toEqual({
        email,
        firstname,
        lastname,
        fullname: expect.stringMatching(new RegExp(`${firstname}.*${lastname}`))
    });
});
