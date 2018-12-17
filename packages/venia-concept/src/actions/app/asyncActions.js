import actions from './actions';

export const toggleDrawer = name => async dispatch =>
    dispatch(actions.toggleDrawer(name));

export const closeDrawer = () => async dispatch =>
    dispatch(actions.toggleDrawer(null));

export const toggleSearch = () => async dispatch =>
    dispatch(actions.toggleSearch());

export const executeSearch = (query, history) =>
    async function thunk(dispatch) {
        history.push(`/search.html?query=` + query);
        dispatch(actions.executeSearch(query));
    };
