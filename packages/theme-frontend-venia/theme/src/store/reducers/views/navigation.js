import { handleActions } from 'redux-actions';

const initialState = {
    open: false
};

const reducer = handleActions(
    {
        TOGGLE_NAVIGATION(state, { payload }) {
            const nextOpen = payload != null ? !!payload : !state.open;

            return {
                ...state,
                open: nextOpen
            };
        }
    },
    initialState
);

export default reducer;
