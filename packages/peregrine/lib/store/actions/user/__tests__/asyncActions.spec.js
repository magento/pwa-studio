import actions from '../actions';
import { resetPassword } from '../asyncActions';

jest.mock('../../../../RestApi');
jest.mock('../../../../util/simplePersistence');

const dispatch = jest.fn();
const getState = jest.fn(() => ({
    user: { isSignedIn: false }
}));
const thunkArgs = [dispatch, getState];

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
