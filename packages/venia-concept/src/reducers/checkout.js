import { handleActions } from 'redux-actions';

import actions from 'src/actions/checkout';

export const name = 'checkout';

const initialState = {
    editing: null,
    step: 'cart',
    submitting: false
};

const reducerMap = {
    [actions.begin]: state => {
        return {
            ...state,
            editing: null,
            step: 'form'
        };
    },
    [actions.edit]: (state, { payload }) => {
        return {
            ...state,
            editing: payload
        };
    },
    [actions.input.submit]: state => {
        return {
            ...state,
            submitting: true
        };
    },
    [actions.input.accept]: state => {
        return {
            ...state,
            editing: null,
            step: 'form',
            submitting: false
        };
    },
    [actions.input.reject]: state => {
        return {
            ...state,
            submitting: false
        };
    },
    [actions.order.submit]: state => {
        return {
            ...state,
            submitting: true
        };
    },
    [actions.order.accept]: state => {
        return {
            ...state,
            editing: null,
            step: 'receipt',
            submitting: false
        };
    },
    [actions.order.reject]: state => {
        return {
            ...state,
            submitting: false
        };
    },
    [actions.reset]: () => initialState
};

export default handleActions(reducerMap, initialState);
