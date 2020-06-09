import actions from './actions';

export const toggleDrawer = name => async dispatch =>
    dispatch(actions.toggleDrawer(name));

export const closeDrawer = () => async dispatch =>
    dispatch(actions.toggleDrawer(null));

export const toggleSearch = () => async dispatch =>
    dispatch(actions.toggleSearch());

export const setPageLoading = pageLoading => async dispatch =>
    dispatch(actions.setPageLoading(pageLoading));
