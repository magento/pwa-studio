import { fetchOrderDetails } from '../asyncActions';

const dispatch = jest.fn();
const getState = jest.fn();
const thunkArgs = [dispatch, getState];

// TODO: write the rest part of the test when fetching async action will be in working condition(currently it's mock)
test('fetchOrderDetails() to return a thunk', () => {
    expect(fetchOrderDetails()).toBeInstanceOf(Function);
});

test('fetchOrderDetails thunk returns undefined', async () => {
    const thunk = fetchOrderDetails();

    await expect(thunk(...thunkArgs)).resolves.toBeUndefined();
});
