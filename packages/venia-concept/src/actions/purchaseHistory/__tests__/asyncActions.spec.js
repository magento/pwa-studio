import { dispatch, getState } from 'src/store';
import { getPurchaseHistory } from '../asyncActions';
import actions from '../actions';
import * as api from '../api';

jest.mock('src/store');

jest.mock('../api', () => ({
    fetchPurchaseHistory: jest.fn()
}));

const thunkArgs = [dispatch, getState];

afterEach(() => {
    dispatch.mockClear();
});

test('getPurchaseHistory() to return a thunk', () => {
    expect(getPurchaseHistory()).toBeInstanceOf(Function);
});

test('getPurchaseHistory thunk dispatches actions on success', async () => {
    const response = {
        items: []
    };

    api.fetchPurchaseHistory.mockResolvedValueOnce(response);

    await getPurchaseHistory()(...thunkArgs);

    expect(dispatch).toHaveBeenNthCalledWith(
        1,
        actions.fetchPurchaseHistoryRequest()
    );
    expect(dispatch).toHaveBeenNthCalledWith(2, actions.setItems(response));
});

test('getPurchaseHistory thunk dispatches actions on error', async () => {
    const error = new Error();

    api.fetchPurchaseHistory.mockResolvedValueOnce(error);

    await getPurchaseHistory()(...thunkArgs);

    expect(dispatch).toHaveBeenNthCalledWith(
        1,
        actions.fetchPurchaseHistoryRequest()
    );
    expect(dispatch).toHaveBeenNthCalledWith(2, actions.setItems(error));
});
