import { getCountries } from 'src/actions/directory';
import { getUserDetails } from 'src/actions/user';
import actions from './actions';

export const toggleDrawer = name => async dispatch =>
    dispatch(actions.toggleDrawer(name));

export const closeDrawer = () => async dispatch =>
    dispatch(actions.toggleDrawer(null));

export const fetchInitialApplicationData = () => dispatch => {
    dispatch(getCountries());

    dispatch(getUserDetails());
};
