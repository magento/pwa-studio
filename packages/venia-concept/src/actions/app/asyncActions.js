import { store } from 'src';
import actions from './actions';

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
