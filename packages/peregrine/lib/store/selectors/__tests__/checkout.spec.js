import { getAccountInformation } from '../checkout';

test('getAccountInformation returns account information', () => {
    const email = 'test@example.com';
    const firstName = 'First Name';
    const lastName = 'Last Name';
    const state = {
        receipt: {
            order: {
                billing_address: {
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
