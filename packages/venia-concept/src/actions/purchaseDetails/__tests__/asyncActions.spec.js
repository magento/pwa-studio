import { dispatch, getState } from 'src/store';
import { fetchOrderDetails } from '../asyncActions';

//TODO: write the rest part of the test when fetching async action will be in working condition(currently it's mock)
jest.mock('src/store');

const thunkArgs = [dispatch, getState];

test('fetchOrderDetails() to return a thunk', () => {
    expect(fetchOrderDetails()).toBeInstanceOf(Function);
});

test('fetchOrderDetails thunk returns undefined', async () => {
    const thunk = fetchOrderDetails();

    await expect(thunk(...thunkArgs)).resolves.toBeUndefined();
});
