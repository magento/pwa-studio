import { createActions } from 'redux-actions';

import { store } from 'src';

const prefix = 'APP';
const actionTypes = ['TOGGLE_DRAWER'];

const actions = createActions(...actionTypes, { prefix });
export default actions;

/* async action creators */

export const loadReducers = payload =>
    async function thunk() {
        try {
            const reducers = await Promise.all(payload);

            reducers.forEach(({ default: reducer, name }) => {
                store.addReducer(name, reducer);
            });
        } catch (error) {
            console.log(error);
        }
    };

export const toggleDrawer = name => async dispatch =>
    dispatch(actions.toggleDrawer(name));

export const closeDrawer = () => async dispatch =>
    dispatch(actions.toggleDrawer(null));
