import { dispatch, getState } from 'src/store';
import actions from '../actions';
import { closeDrawer, toggleDrawer, toggleSearch } from '../asyncActions';

jest.mock('src/store');

const thunkArgs = [dispatch, getState];

afterEach(() => {
    dispatch.mockClear();
});

test('toggleDrawer() to return a thunk', () => {
    expect(toggleDrawer()).toBeInstanceOf(Function);
});

test('toggleDrawer thunk returns undefined', async () => {
    const payload = 'FOO';
    const result = await toggleDrawer(payload)(...thunkArgs);

    expect(result).toBeUndefined();
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
    const result = await closeDrawer()(...thunkArgs);

    expect(result).toBeUndefined();
});

test('closeDrawer thunk dispatches actions', async () => {
    await closeDrawer()(...thunkArgs);

    expect(dispatch).toHaveBeenCalledWith(actions.toggleDrawer(null));
    expect(dispatch).toHaveBeenCalledTimes(1);
});

test('toggleSearch() to return a thunk ', () => {
    expect(toggleSearch()).toBeInstanceOf(Function);
});

test('toggleSearch thunk returns undefined', async () => {
    const result = await toggleSearch()(...thunkArgs);

    expect(result).toBeUndefined();
});

test('toggleSearch thunk dispatches actions', async () => {
    await toggleSearch()(...thunkArgs);

    expect(dispatch).toHaveBeenCalledTimes(1);
});
