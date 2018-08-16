import { closeDrawer, loadReducers, toggleDrawer } from '../asyncActions';
import { mockDispatch, mockGetState } from 'src';

// `src/index.js` performs side effects and depends on magic webpack globals
// all we need is the store it exports, so we mock it
jest.mock('src');

const thunkArgs = [mockDispatch, mockGetState];

test('toggleDrawer() to return a thunk', () => {
    expect(toggleDrawer()).toBeInstanceOf(Function);
});

test('toggleDrawer thunk returns undefined', async () => {
    const payload = 'FOO';
    const thunk = toggleDrawer(payload);

    await expect(thunk(...thunkArgs)).resolves.toBeUndefined();
});

test('closeDrawer() to return a thunk ', () => {
    expect(closeDrawer()).toBeInstanceOf(Function);
});

test('closeDrawer thunk returns undefined', async () => {
    const thunk = closeDrawer();

    await expect(thunk(...thunkArgs)).resolves.toBeUndefined();
});

test('loadReducers() to return a thunk ', () => {
    expect(closeDrawer()).toBeInstanceOf(Function);
});

test('loadReducers thunk returns undefined', async () => {
    const payload = [];
    const thunk = loadReducers(payload);

    await expect(thunk(...thunkArgs)).resolves.toBeUndefined();
});
