/**
 * Handle unhandled errors by setting a global error state.
 *
 * "store slice" reducers may want to handle errors in a custom way, in order
 * to display more specific error states (such as form field validation).
 *
 * These reducers can indicate that an error is handled and needs no more UI
 * response, by assigning the error object to the `error` property on their
 * store slice.
 *
 * This reducer activates when the action has an `error` property. It then
 * checks each store slice for an `error` property which equals the error in
 * the action, indicating that the error has already been handled. If it
 * detects that the error is not present in any store slice, it assumes the
 * error is unhandled and pushes it into an `errors` array property on the root
 * store.
 *
 * This `errors` collection represents unhandled errors to be displayed in the
 * next render. To dismiss an error, dispatch the ERROR_DISMISS action with the
 * error as payload, and this reducer will remove it from the array.
 *
 */
import app from 'src/actions/app';
import errorRecord from 'src/util/createErrorRecord';
const APP_DISMISS_ERROR = app.markErrorHandled.toString();

/**
 * This function returns the name of the slice for logging purposes, and
 * undefined if no slice handling this error is found. It uses
 * Object.entries() to create a [name, sliceObject] pair for each slice;
 * the iteratee only tests the value, but we destructure the name into the
 * final return value. For instance, the cart slice is represented as an
 * entry ["cart", cartState]. If cartState has any property whose value is
 * the provided error, then this function will return the string "cart".
 *
 * @param {object} fullStoreState
 * @param {Error} error
 *
 */
function sliceHandledError(state, error) {
    const foundEntry = Object.entries(state).find(
        ([, slice]) =>
            typeof slice === 'object' &&
            // A slice is considered to have "handled" the error if it
            // includes a root property (of any name) with the error as a
            // value. This is the pattern with existing reducers.
            Object.values(slice).includes(error)
    );
    if (foundEntry) {
        // Return the name of the slice.
        return foundEntry[0];
    }
}

/**
 * This reducer handles the full store state (all slices) and adds any
 * unhandled errors (as defined by the selector function
 * sliceHandledError() defined above) to a root `unhandledErrors`
 * collection. It also handles the app-level action `APP_DISMISS_ERROR` by
 * removing the passed error from that collection. Any global error UI can
 * use this action (as a click handler, for instance) to dismiss the error.
 *
 * @param {object} fullStoreState
 * @param {object} action
 */
function errorReducer(state, action) {
    const { unhandledErrors } = state;
    const { type, payload } = action;

    // The `error` property should be boolean and the payload is the error
    // itself, but just in case someone got that wrong...
    let error;
    if (action.error instanceof Error) {
        error = action.error;
    } else if (payload instanceof Error) {
        error = payload;
    } else {
        // No error, so nothing this reducer can do.
        return state;
    }
    if (type === APP_DISMISS_ERROR) {
        const errorsMinusDismissed = unhandledErrors.filter(
            record => record.error !== error
        );
        // If the array is the same size, then the error wasn't here
        // but it should have been!
        if (
            process.env.NODE_ENV === 'development' &&
            errorsMinusDismissed.length == unhandledErrors.length
        ) {
            console.error(
                'Received ${APP_DISMISS_ERROR} action, but provided error "${error}" was not present in the state.unhandledErrors collection. The error object in the action payload must be strictly equal to the error to be dismissed.',
                error
            );
        }
        return {
            ...state,
            unhandledErrors: errorsMinusDismissed
        };
    }

    // Handle any other action that may have produced an error.
    const sliceHandled = sliceHandledError(state, error);
    if (!sliceHandled) {
        // No one took this one. Add it to the unhandled list.
        const allErrors = [
            // Dedupe errors in case this one is dispatched repeatedly
            ...new Set(unhandledErrors).add(
                errorRecord(
                    error,
                    // `errorRecord()` requires the window argument for
                    // testability, through injection of the
                    // non-idempotent Date and Math methods for IDs.
                    window,
                    // Also call `errorRecord()` with the current
                    // context, which is the root reducer; that enables
                    // it to trim useful stack traces by omitting
                    // useless lines.
                    this
                )
            )
        ];
        return {
            ...state,
            unhandledErrors: allErrors
        };
    }
    // If we get here, a slice DID handle it and indicated that by
    // setting it as a root property of the slice.
    return state;
}

/**
 * Wrapper function for a Redux reducer which adds an error reducer and a root
 * `unhandledErrors` collection to state. Since many reducers validate their
 * state objects, they will error if they see the "unrecognized"
 * `unhandledErrors` property. This function hides that property by extracting
 * it from state, then running the passed root reducer on the clean state, then
 * recombining the state and transforming it with the error reducer.
 *
 * @param {Function} rootReducer Original root reducer.
 */
function wrapReducerWithErrorHandling(rootReducer) {
    return function errorHandlingRootReducer(state = {}, action) {
        const { unhandledErrors = [], ...restOfState } = state;
        const nextState = rootReducer(restOfState, action);
        nextState.unhandledErrors = unhandledErrors;
        // Apply errorReducer in the context of this root reducer,
        // so it can trim stack traces using `this`.
        return errorReducer.call(errorHandlingRootReducer, nextState, action);
    };
}

/**
 * Store enhancer which returns a StoreCreator, which accepts a
 * root reducer and an initial state and returns a new store.
 * It is in this function that we can intercept the root reducer
 * and wrap it with error handling.
 */
export default function createErrorHandlingStore(createStore) {
    return (reducer, ...args) =>
        createStore(wrapReducerWithErrorHandling(reducer), ...args);
}
