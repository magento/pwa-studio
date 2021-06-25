import { handleActions } from 'redux-actions';

import actions from '../actions/app';

export const name = 'app';

// as far as the server is concerned, the app is always online
const isServer = !globalThis.navigator;
const isOnline = !isServer && navigator.onLine;
const hasBeenOffline = !isServer && !navigator.onLine;

const initialState = {
    drawer: null,
    hasBeenOffline,
    isOnline,
    isPageLoading: false,
    overlay: false,
    pending: {},
    searchOpen: false
};

const reducerMap = {
    [actions.toggleDrawer]: (state, { payload }) => {
        return {
            ...state,
            drawer: payload,
            overlay: !!payload
        };
    },
    [actions.toggleSearch]: state => {
        return {
            ...state,
            searchOpen: !state.searchOpen
        };
    },
    [actions.setOnline]: state => {
        return {
            ...state,
            isOnline: true
        };
    },
    [actions.setOffline]: state => {
        return {
            ...state,
            isOnline: false,
            hasBeenOffline: true
        };
    },
    [actions.setPageLoading]: (state, { payload }) => {
        return {
            ...state,
            isPageLoading: !!payload
        };
    }
};

export default handleActions(reducerMap, initialState);
