import BrowserPersistence from '../../../../util/simplePersistence';
import actions from '../actions';
import {
    getUserDetails,
    resetPassword,
    signOut,
    setToken,
    clearToken
} from '../asyncActions';

jest.mock('../../../../RestApi');

const dispatch = jest.fn();
const getState = jest.fn(() => ({
    user: { isSignedIn: false }
}));

const mockEvict = jest.fn();
const mockGarbageClean = jest.fn();
const mockPersist = jest.fn();
const mockClearCacheData = jest.fn();
const thunkArgs = [
    dispatch,
    getState,
    {
        apolloClient: {
            cache: {
                evict: mockEvict,
                gc: mockGarbageClean
            },
            clearCacheData: mockClearCacheData,
            persistor: {
                persistor: {
                    storage: {
                        key: 'unit test key'
                    }
                },
                persist: mockPersist
            }
        }
    }
];

const fetchUserDetails = jest
    .fn()
    .mockResolvedValue({ data: { customer: {} } });
const revokeToken = jest.fn().mockResolvedValue({});
const mockToken = jest.fn(() => {});
const mockRemoveItem = jest.fn();
const mockSetItem = jest.fn();

jest.mock('../../../../util/simplePersistence', () => {
    return jest.fn().mockImplementation(() => {
        return {
            removeItem: () => mockRemoveItem(),
            setItem: () => mockSetItem()
        };
    });
});

beforeEach(() => {
    BrowserPersistence.mockClear();
    mockSetItem.mockClear();
});

describe('getUserDetails', () => {
    test('it returns a thunk', () => {
        expect(getUserDetails({ fetchUserDetails })).toBeInstanceOf(Function);
    });

    test('its thunk returns undefined', async () => {
        const result = await getUserDetails({ fetchUserDetails })(...thunkArgs);

        expect(result).toBeUndefined();
    });

    test('its thunk dispatches actions on success', async () => {
        getState.mockImplementationOnce(() => ({
            user: { isSignedIn: true }
        }));

        await getUserDetails({ fetchUserDetails })(...thunkArgs);

        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.getDetails.request()
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.getDetails.receive({})
        );
    });

    test('its thunk dispatches actions on error', async () => {
        getState.mockImplementationOnce(() => ({
            user: { isSignedIn: true }
        }));
        const error = new Error('ERROR');
        fetchUserDetails.mockRejectedValueOnce(error);

        await getUserDetails({ fetchUserDetails })(...thunkArgs);

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

        await getUserDetails({ fetchUserDetails })(...thunkArgs);

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

describe('signOut', () => {
    test('signOut returns a thunk', () => {
        expect(signOut({ revokeToken })).toBeInstanceOf(Function);
    });

    test('signOut thunk invokes revokeToken and dispatches actions', async () => {
        await signOut({ revokeToken })(...thunkArgs);

        expect(revokeToken).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledTimes(3);
    });

    test('signOut thunk catches revokeToken error and proceeds', async () => {
        const consoleSpy = jest.spyOn(console, 'error');
        revokeToken.mockRejectedValueOnce(new Error('Revoke Token Error'));

        await signOut({ revokeToken })(...thunkArgs);

        expect(revokeToken).toHaveBeenCalledTimes(1);
        expect(consoleSpy).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledTimes(3);

        consoleSpy.mockRestore();
    });
});

describe('setToken', () => {
    test('setToken returns a thunk', () => {
        expect(setToken(mockToken)).toBeInstanceOf(Function);
    });

    test('setToken thunk sets token in storage and dispatches actions', async () => {
        await setToken(mockToken)(...thunkArgs);

        expect(mockSetItem).toHaveBeenCalled();
        expect(dispatch).toHaveBeenCalled();
    });
});

describe('clearToken', () => {
    test('clearToken returns a thunk', () => {
        expect(clearToken()).toBeInstanceOf(Function);
    });

    test('clearToken thunk clears token from storage and dispatches actions', async () => {
        await clearToken()(...thunkArgs);

        expect(mockRemoveItem).toHaveBeenCalled();
        expect(dispatch).toHaveBeenCalled();
    });
});
