import { dispatch } from 'src/store';
import actions from '../actions';
import { getPurchaseHistory } from '../asyncActions';
import mockData from '../mockData';

jest.mock('src/store');

const thunkArgs = [dispatch];

afterEach(() => {
    dispatch.mockClear();
});

describe('getPurchaseHistory', () => {
    test('it returns a thunk', () => {
        expect(getPurchaseHistory()).toBeInstanceOf(Function);
    });

    test('its thunk returns undefined', async () => {
        const result = await getPurchaseHistory()(...thunkArgs);

        expect(result).toBeUndefined();
    });

    test('its thunk dispatches actions on success', async () => {
        await getPurchaseHistory()(...thunkArgs);

        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.getPurchaseHistory.request()
        );
        expect(dispatch).toHaveBeenNthCalledWith(
            2,
            actions.getPurchaseHistory.receive(mockData)
        );
    });

    test('its thunk dispatches actions on failure', async () => {
        const error = new Error('error');

        dispatch
            .mockImplementationOnce(() => {})
            // Force the error condition.
            .mockImplementationOnce(() => {
                throw error;
            });

        await getPurchaseHistory()(...thunkArgs);

        expect(dispatch).toHaveBeenCalledTimes(3);
        // The first and second calls to dispatch have been mocked (see above).
        expect(dispatch).toHaveBeenNthCalledWith(
            3,
            actions.getPurchaseHistory.receive(error)
        );
    });
});
