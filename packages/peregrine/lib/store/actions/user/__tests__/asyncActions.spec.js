import { Magento2 } from '../../../../RestApi';
import actions from '../actions';
import {
    signIn,
    signOut,
    getUserDetails,
    resetPassword
} from '../asyncActions';

jest.mock('../../../../RestApi');
jest.mock('../../../../util/simplePersistence');

const { request } = Magento2;
const dispatch = jest.fn();
const getState = jest.fn(() => ({
    user: { isSignedIn: false }
}));
const thunkArgs = [dispatch, getState];

const credentials = {
    username: 'USERNAME',
    password: 'PASSWORD'
};

describe('signIn', () => {
    test('it returns a thunk', () => {
        expect(signIn()).toBeInstanceOf(Function);
    });

    test('its thunk returns undefined', async () => {
        const result = await signIn(credentials)(...thunkArgs);

        expect(result).toBeUndefined();
    });

    test('its thunk dispatches actions on success', async () => {
        await signIn(credentials)(...thunkArgs);

        expect(dispatch).toHaveBeenCalledTimes(5);
        expect(dispatch).toHaveBeenNthCalledWith(1, actions.signIn.request());
        expect(dispatch).toHaveBeenNthCalledWith(2, actions.signIn.receive());
        // getUserDetails
        expect(dispatch).toHaveBeenNthCalledWith(3, expect.any(Function));
        // removeCart
        expect(dispatch).toHaveBeenNthCalledWith(4, expect.any(Function));
        // getCartDetails
        expect(dispatch).toHaveBeenNthCalledWith(5, expect.any(Function));
    });

    test('its thunk dispatches actions on error', async () => {
        // Test setup.
        const error = new Error('ERROR');
        request.mockRejectedValueOnce(error);

        // Execute the function.
        await signIn(credentials)(...thunkArgs);

        // Make assertions.
        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenNthCalledWith(1, actions.signIn.request());
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.signIn.receive(error)
        );
    });

    test('its thunk makes requests on success', async () => {
        await signIn(credentials)(...thunkArgs);

        expect(request).toHaveBeenCalledTimes(1);

        const tokenRequest = request.mock.calls[0];
        const tokenEndpoint = tokenRequest[0];
        const tokenParams = tokenRequest[1];

        expect(tokenEndpoint).toBe('/rest/V1/integration/customer/token');
        expect(tokenParams).toHaveProperty('method', 'POST');
        expect(tokenParams).toHaveProperty('body');

        const tokenBody = JSON.parse(tokenParams.body);
        expect(tokenBody).toEqual({
            username: `${credentials.username}`,
            password: `${credentials.password}`
        });
    });
});

describe('signOut', () => {
    const mockParam = {
        history: {
            go: jest.fn()
        }
    };

    test('it returns a thunk', () => {
        expect(signOut(mockParam)).toBeInstanceOf(Function);
    });

    test('its thunk dispatches actions on success', async () => {
        await signOut(mockParam)(...thunkArgs);

        expect(dispatch).toHaveBeenCalledTimes(3);
        expect(dispatch).toHaveBeenNthCalledWith(1, actions.reset());
        const removeCart = expect.any(Function);
        expect(dispatch).toHaveBeenNthCalledWith(2, removeCart);
        const getCartDetails = expect.any(Function);
        expect(dispatch).toHaveBeenNthCalledWith(3, getCartDetails);
    });
});

describe('getUserDetails', () => {
    test('it returns a thunk', () => {
        expect(getUserDetails()).toBeInstanceOf(Function);
    });

    test('its thunk returns undefined', async () => {
        const result = await getUserDetails()(...thunkArgs);

        expect(result).toBeUndefined();
    });

    test('its thunk dispatches actions on success', async () => {
        getState.mockImplementationOnce(() => ({
            user: { isSignedIn: true }
        }));

        await getUserDetails()(...thunkArgs);

        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.getDetails.request()
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.getDetails.receive()
        );
    });

    test('its thunk dispatches actions on error', async () => {
        getState.mockImplementationOnce(() => ({
            user: { isSignedIn: true }
        }));
        const error = new Error('ERROR');
        request.mockRejectedValueOnce(error);

        await getUserDetails()(...thunkArgs);

        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.getDetails.request()
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.getDetails.receive(error)
        );
    });

    test('its thunk doesnt dispatch actions if the user is not signed in', async () => {
        getState.mockImplementationOnce(() => ({
            user: { isSignedIn: false }
        }));

        await getUserDetails()(...thunkArgs);

        expect(dispatch).not.toHaveBeenCalled();
    });
});

describe('resetPassword', () => {
    const email = 'test@test.com';

    test('resetPassword() returns a thunk', () => {
        expect(resetPassword({ email })).toBeInstanceOf(Function);
    });

    test('resetPassword thunk dispatches actions on success', async () => {
        await resetPassword({ email })(...thunkArgs);

        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.resetPassword.request()
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.resetPassword.receive()
        );
    });
});
