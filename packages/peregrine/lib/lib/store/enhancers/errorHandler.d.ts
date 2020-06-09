/**
 * Store enhancer which returns a StoreCreator, which accepts a
 * root reducer and an initial state and returns a new store.
 * It is in this function that we can intercept the root reducer
 * and wrap it with error handling.
 */
export default function createErrorHandlingStore(createStore: any): (reducer: any, ...args: any[]) => any;
