import actions from './actions';

export const toggleDrawer = name => async dispatch =>
    dispatch(actions.toggleDrawer(name));

export const closeDrawer = () => async dispatch =>
    dispatch(actions.toggleDrawer(null));

/** @deprecated in PWA Studio v8.0.0 (Magento 2.4.1). */
export const toggleSearch = () => async dispatch =>
    dispatch(actions.toggleSearch());
