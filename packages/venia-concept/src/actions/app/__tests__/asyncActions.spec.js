import { store } from 'src';
import actions from '../actions';
import { closeDrawer, loadReducers, toggleDrawer } from '../asyncActions';

// `src/index.js` performs side effects and depends on magic webpack globals
// all we need is the store it exports, so we mock it
jest.mock('src');

const { addReducer, dispatch, getState } = store;
const thunkArgs = [dispatch, getState];

afterEach(() => {
    addReducer.mockClear();
    dispatch.mockClear();
});

test('toggleDrawer() to return a thunk', () => {
    expect(toggleDrawer()).toBeInstanceOf(Function);
});

test('toggleDrawer thunk returns undefined', async () => {
    const payload = 'FOO';
    const thunk = toggleDrawer(payload);

    await expect(thunk(...thunkArgs)).resolves.toBeUndefined();
});

test('toggleDrawer thunk dispatches actions', async () => {
    const payload = 'FOO';
    await toggleDrawer(payload)(...thunkArgs);

    expect(dispatch).toHaveBeenCalledWith(actions.toggleDrawer(payload));
    expect(dispatch).toHaveBeenCalledTimes(1);
});

test('closeDrawer() to return a thunk ', () => {
    expect(closeDrawer()).toBeInstanceOf(Function);
});

test('closeDrawer thunk returns undefined', async () => {
    const thunk = closeDrawer();

    await expect(thunk(...thunkArgs)).resolves.toBeUndefined();
});

test('closeDrawer thunk dispatches actions', async () => {
    await closeDrawer()(...thunkArgs);

    expect(dispatch).toHaveBeenCalledWith(actions.toggleDrawer(null));
    expect(dispatch).toHaveBeenCalledTimes(1);
});

test('loadReducers() to return a thunk ', () => {
    expect(closeDrawer()).toBeInstanceOf(Function);
});

test('loadReducers thunk returns undefined', async () => {
    const payload = [];
    const thunk = loadReducers(payload);

    await expect(thunk(...thunkArgs)).resolves.toBeUndefined();
});

test('loadReducers thunk adds reducers to the store', async () => {
    const payload = [
        { default: () => {}, name: 'ONE' },
        { default: () => {}, name: 'TWO' }
    ];
    await loadReducers(payload)(...thunkArgs);

    expect(dispatch).not.toHaveBeenCalled();
    payload.forEach(({ default: reducer, name }, i) => {
        expect(addReducer).toHaveBeenNthCalledWith(1 + i, name, reducer);
    });
});
