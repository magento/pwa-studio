import { handleActions } from 'redux-actions';

import actions from '../actions/app';

export const name = 'app';

const initialState = {
    drawer: null,
    hasBeenOffline: !navigator.onLine,
    isOnline: navigator.onLine,
    overlay: false,
    searchOpen: false,
    query: '',
    pending: {},
    storeView: 'en', // Absolunet
    locale: 'en' // Absolunet
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
    [actions.setStoreView]: (state, { storeViewCode }) => {
        return { 
            ...state,
            storeView: storeViewCode
        }
    },
    [actions.setLocale]: (state, { locale }) => {
        return { 
            ...state,
            locale: locale
        }
    }
};

export default handleActions(reducerMap, initialState);
