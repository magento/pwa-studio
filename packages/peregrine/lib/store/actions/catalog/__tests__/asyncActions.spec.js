import actions from '../actions';
import { setCurrentPage, setPrevPageTotal } from '../asyncActions';

const dispatch = jest.fn();
const getState = jest.fn();
const thunkArgs = [dispatch, getState];

describe('setCurrentPage', () => {
    const PAYLOAD = 2;

    test('it returns a thunk', () => {
        expect(setCurrentPage(PAYLOAD)).toBeInstanceOf(Function);
    });

    test('its thunk returns undefined', async () => {
        const result = await setCurrentPage(PAYLOAD)(...thunkArgs);

        expect(result).toBeUndefined();
    });

    test('its thunk dispatches actions', async () => {
        await setCurrentPage(PAYLOAD)(...thunkArgs);

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.setCurrentPage.receive(PAYLOAD)
        );
    });
});

describe('setPrevPageTotal', () => {
    const PAYLOAD = 10;

    test('it returns a thunk', () => {
        expect(setPrevPageTotal(PAYLOAD)).toBeInstanceOf(Function);
    });

    test('its thunk returns undefined', async () => {
        const result = await setPrevPageTotal(PAYLOAD)(...thunkArgs);

        expect(result).toBeUndefined();
    });

    test('its thunk dispatches actions', async () => {
        await setPrevPageTotal(PAYLOAD)(...thunkArgs);

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenNthCalledWith(
            1,
            actions.setPrevPageTotal.receive(PAYLOAD)
        );
    });
});
