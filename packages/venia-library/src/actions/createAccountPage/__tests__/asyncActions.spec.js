import { dispatch, getState } from 'src/store';
jest.mock('src/store');
const thunkArgs = [dispatch, getState];

import { createAccount } from '../index';

const mockPayload = {
    accountInfo: {
        customer: {
            email: 'EMAIL'
        },
        password: 'PASSWORD'
    },
    history: {
        push: jest.fn()
    }
};

afterEach(() => {
    dispatch.mockClear();
});

describe('createAccount', () => {
    test('it returns a thunk', () => {
        expect(createAccount(mockPayload)).toBeInstanceOf(Function);
    });

    test('its thunk returns undefined', async () => {
        const result = await createAccount(mockPayload)(...thunkArgs);

        expect(result).toBeUndefined();
    });

    test('its thunk dispatches actions', async () => {
        await createAccount(mockPayload)(...thunkArgs);

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(expect.any(Function));
    });

    test('its thunk pushes to history', async () => {
        await createAccount(mockPayload)(...thunkArgs);

        const mockHistoryPush = mockPayload.history.push;
        expect(mockHistoryPush).toHaveBeenCalledTimes(1);
        expect(mockHistoryPush).toHaveBeenCalledWith('/');
    });
});
