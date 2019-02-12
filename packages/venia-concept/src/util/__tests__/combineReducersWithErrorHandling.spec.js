import combineReducersWithErrorHandling from '../combineReducersWithErrorHandling';
import { combineReducers } from 'redux';
import app from 'src/actions/app';
const APP_DISMISS_ERROR = app.markErrorHandled.toString();

jest.mock('redux');

const rootReducer = jest.fn(() => ({ other: 'stuff' }));
combineReducers.mockImplementation(() => rootReducer);

let reducer = combineReducersWithErrorHandling({});

jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});
beforeEach(jest.clearAllMocks);
afterAll(() => {
    console.error.mockRestore();
    console.log.mockRestore();
});

test('creates state with unhandled errors list if none exists', () => {
    const reducer = combineReducersWithErrorHandling({});
    const state = reducer({}, { type: 'init' });
    expect(combineReducers).toHaveBeenCalled();
    expect(rootReducer).toHaveBeenCalled();
    expect(state).toHaveProperty('unhandledErrors', []);
});

test('hides unhandledErrors property from redux', () => {
    const state = reducer(
        { unhandledErrors: [], additional: 'properties' },
        { type: 'init' }
    );
    expect(rootReducer.mock.calls[0][0]).not.toHaveProperty('unhandledErrors');
    expect(state).toHaveProperty('unhandledErrors', []);
});

test('puts error records in unhandledErrors if no slice handled them', () => {
    const error = new Error('foo');
    const state = reducer(
        { unhandledErrors: [], additional: 'properties' },
        { type: 'anything', payload: error, error: true }
    );
    expect(state.unhandledErrors.length).toBe(1);
    expect(state.unhandledErrors[0]).toMatchObject({
        error
    });

    const secondError = new Error('bar');
    const secondState = reducer(state, {
        type: 'anything',
        payload: {},
        error: secondError
    });
    expect(secondState.unhandledErrors.length).toBe(2);
    expect(secondState.unhandledErrors[1]).toMatchObject({
        error: secondError
    });
});

test('does not add an error if a slice indicates it "handled" it by having it as a property', () => {
    rootReducer.mockImplementation((state, { type, payload }) =>
        type === 'CART_ERROR'
            ? { ...state, cart: { iGotThis: payload } }
            : state
    );
    const cartError = new Error('toBeHandled');
    const state = reducer(
        { cart: {} },
        { type: 'CART_ERROR', payload: cartError }
    );
    expect(state.unhandledErrors.length).toBe(0);
});

test('handles APP_DISMISS_ERROR action and removes dismissed error', () => {
    const oldEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    const handledError = new Error('blkpth');
    const unhandledError = new Error('ack');
    const state = [
        { type: 'anything', error: true, payload: handledError },
        { type: 'anythingelse', error: true, payload: unhandledError }
    ].reduce(reducer, {});
    expect(state.unhandledErrors.length).toBe(2);
    expect(state.unhandledErrors[0].error).toBe(handledError);
    expect(state.unhandledErrors[1].error).toBe(unhandledError);

    const newState = reducer(state, {
        type: APP_DISMISS_ERROR,
        payload: handledError
    });

    expect(newState.unhandledErrors.length).toBe(1);
    expect(newState.unhandledErrors[0].error).toBe(unhandledError);
    expect(console.error).not.toHaveBeenCalled();
    process.env.NODE_ENV = oldEnv;
});

test('logs if dismissed error was not found and in dev mode', () => {
    const oldEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    const notFoundError = new Error('blkpth');
    const unhandledError = new Error('ack');
    const state = reducer(
        {},
        { type: 'anythingelse', error: true, payload: unhandledError }
    );

    const newState = reducer(state, {
        type: APP_DISMISS_ERROR,
        payload: notFoundError
    });

    expect(newState.unhandledErrors.length).toBe(1);
    expect(newState.unhandledErrors[0].error).toBe(unhandledError);
    expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('not present'),
        notFoundError
    );
    process.env.NODE_ENV = oldEnv;
});
