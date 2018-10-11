import { handleActions } from 'redux-actions';

import actions from 'src/actions/app';

export const name = 'app';

const initialState = {
    drawer: null,
    overlay: false,
    searchOpen: false,
    pending: {}
};

const reducerMap = {
    [actions.toggleDrawer]: (state, { payload }) => {
        return {
            ...state,
            drawer: payload,
            overlay: !!payload
        };
    },
    [actions.toggleSearch]: (state, { payload }) => {
        return {
            ...state,
            searchOpen : !payload
        };
    }
};

export default handleActions(reducerMap, initialState);
