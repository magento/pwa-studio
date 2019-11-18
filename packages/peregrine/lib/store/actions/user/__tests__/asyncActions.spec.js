import { Magento2 } from '../../../../RestApi';
import actions from '../actions';
import { getUserDetails, resetPassword } from '../asyncActions';

jest.mock('../../../../RestApi');
jest.mock('../../../../util/simplePersistence');

const { request } = Magento2;
const dispatch = jest.fn();
const getState = jest.fn(() => ({
    user: { isSignedIn: false }
}));
const thunkArgs = [dispatch, getState];

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
