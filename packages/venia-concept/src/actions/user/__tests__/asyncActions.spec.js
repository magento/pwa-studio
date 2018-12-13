import { RestApi } from '@magento/peregrine';

import { dispatch, getState } from 'src/store';
import {
    mockGetItem,
    mockSetItem,
    mockRemoveItem
} from '@magento/util/simplePersistence';
import actions from '../actions';
import {
    signIn,
    getUserDetails,
    completePasswordReset,
    createAccount,
    createNewUserRequest,
    assignGuestCartToCustomer,
    resetPassword
} from '../asyncActions';

jest.mock('src/store');

const thunkArgs = [dispatch, getState];
const { request } = RestApi.Magento2;

const credentials = {
    username: 'USERNAME',
    password: 'PASSWORD'
};

const accountInfo = {
    customer: {
        email: 'EMAIL'
    },
    password: 'PASSWORD'
};

beforeAll(() => {
    getState.mockImplementation(() => ({
        user: { isSignedIn: false }
    }));
});

afterEach(() => {
    dispatch.mockClear();
    request.mockClear();
    getState.mockClear();
    mockGetItem.mockClear();
    mockSetItem.mockClear();
    mockRemoveItem.mockClear();
});

afterAll(() => {
    getState.mockRestore();
});

test('signIn() returns a thunk', () => {
    expect(signIn()).toBeInstanceOf(Function);
});

test('getUserDetails() returns a thunk', () => {
    expect(getUserDetails()).toBeInstanceOf(Function);
});

test('createAccount() returns a thunk', () => {
    expect(createAccount()).toBeInstanceOf(Function);
});

test('createNewUserRequest() returns a thunk', () => {
    expect(createNewUserRequest()).toBeInstanceOf(Function);
});

test('assignGuestCartToCustomer() returns a thunk', () => {
    expect(assignGuestCartToCustomer()).toBeInstanceOf(Function);
});

test('signIn thunk dispatches resetSignInError', async () => {
    await signIn(credentials)(...thunkArgs);

    expect(dispatch).toHaveBeenCalledWith(actions.resetSignInError.request());
});

test('signIn thunk dispatches signIn', async () => {
    await signIn(credentials)(...thunkArgs);

    expect(dispatch).toHaveBeenCalledWith(actions.signIn.receive());
});

test('signIn thunk dispatches signInError on failed request', async () => {
    const error = new Error('ERROR');
    request.mockRejectedValueOnce(error);
    await signIn(credentials)(...thunkArgs);
    expect(dispatch).toHaveBeenNthCalledWith(
        2,
        actions.signInError.receive(error)
    );
});

test('signIn thunk makes request to get customer token with credentials', async () => {
    await signIn(credentials)(...thunkArgs);

    const firstRequest = request.mock.calls[0];

    expect(firstRequest[0]).toBe('/rest/V1/integration/customer/token');
    expect(firstRequest[1]).toHaveProperty('method', 'POST');
    expect(JSON.parse(firstRequest[1].body)).toEqual({
        username: `${credentials.username}`,
        password: `${credentials.password}`
    });
});

test('signIn thunk makes request to get customer details after sign in', async () => {
    await signIn(credentials)(...thunkArgs);

    const secondRequest = request.mock.calls[1];

    expect(secondRequest[0]).toBe('/rest/V1/customers/me');
    expect(secondRequest[1]).toHaveProperty('method', 'GET');
});

test('getUserDetails thunk makes request to get customer details if user is signed in', async () => {
    getState.mockImplementationOnce(() => ({
        user: { isSignedIn: false }
    }));

    await getUserDetails()(...thunkArgs);

    expect(request.mock.calls).toHaveLength(0);

    getState.mockImplementationOnce(() => ({
        user: { isSignedIn: true }
    }));

    await getUserDetails()(...thunkArgs);

    const firstRequest = request.mock.calls[0];

    expect(firstRequest[0]).toBe('/rest/V1/customers/me');
    expect(firstRequest[1]).toHaveProperty('method', 'GET');
});

test('getUserDetails thunk dispatches resetSignInError', async () => {
    getState.mockImplementationOnce(() => ({
        user: { isSignedIn: true }
    }));

    await getUserDetails()(...thunkArgs);

    expect(dispatch).toHaveBeenCalledWith(actions.resetSignInError.request());
});

test('getUserDetails thunk dispatches signInError on failed request', async () => {
    const error = new Error('ERROR');
    getState.mockImplementationOnce(() => ({
        user: { isSignedIn: true }
    }));
    request.mockRejectedValueOnce(error);
    await getUserDetails()(...thunkArgs);
    expect(dispatch).toHaveBeenNthCalledWith(
        2,
        actions.signInError.receive(error)
    );
});

test('createNewUserRequest thunk dispatches resetCreateAccountError', async () => {
    await createNewUserRequest(accountInfo)(...thunkArgs);

    expect(dispatch).toHaveBeenCalledWith(
        actions.resetCreateAccountError.request()
    );
});

test('createNewUserRequest thunk dispatches signIn', async () => {
    await createNewUserRequest(accountInfo)(...thunkArgs);

    expect(dispatch).toHaveBeenNthCalledWith(2, expect.any(Function));
});

test('createNewUserRequest thunk dispatches assignGuestCartToCustomer', async () => {
    await createNewUserRequest(accountInfo)(...thunkArgs);

    expect(dispatch).toHaveBeenNthCalledWith(3, expect.any(Function));
});

test('createNewUserRequest thunk dispatches createAccountError on invalid account info', async () => {
    const error = new TypeError('ERROR');
    request.mockRejectedValueOnce(error);

    try {
        await createNewUserRequest({})(...thunkArgs);
    } catch (e) {}

    expect(dispatch).toHaveBeenNthCalledWith(
        2,
        actions.createAccountError.receive(error)
    );
});

test('assignGuestCartToCustomer thunk retrieves guest cart with guestCartId', async () => {
    getState.mockImplementationOnce(() => ({
        user: { isSignedIn: false, id: 'ID', storeId: 'STORE_ID' }
    }));

    const storedGuestCartId = 'STORED_GUEST_CART_ID';
    mockGetItem.mockImplementationOnce(() => storedGuestCartId);

    await assignGuestCartToCustomer({})(...thunkArgs);

    const firstRequest = request.mock.calls[0];
    expect(mockGetItem).toHaveBeenCalledWith('guestCartId');
    expect(firstRequest[0]).toBe(`/rest/V1/guest-carts/STORED_GUEST_CART_ID`);
    expect(firstRequest[1]).toHaveProperty('method', 'PUT');
});

test('assignGuestCartToCustomer thunk dispatches removeGuestCart()', async () => {
    await assignGuestCartToCustomer({})(...thunkArgs);
    expect(dispatch).toHaveBeenNthCalledWith(1, expect.any(Function));
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
            actions.resetPassword.request(email)
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.resetPassword.receive(email)
        );
    });
});

describe('completePasswordReset', () => {
    const payload = 'test';

    test('completePasswordReset() to return a thunk', () => {
        expect(completePasswordReset()).toBeInstanceOf(Function);
    });

    test('completePasswordReset thunk returns undefined', async () => {
        const result = await completePasswordReset(payload)(...thunkArgs);
        expect(result).toBeUndefined();
    });

    test('completePasswordReset thunk dispatches actions', async () => {
        await completePasswordReset(payload)(...thunkArgs);

        expect(dispatch).toHaveBeenCalledWith(
            actions.completePasswordReset(payload)
        );
        expect(dispatch).toHaveBeenCalledTimes(1);
    });
});
