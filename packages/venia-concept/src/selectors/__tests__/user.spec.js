import { getUserInformation } from '../user';

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
