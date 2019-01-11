import actions from './actions';

export const toggleDrawer = name => async dispatch =>
    dispatch(actions.toggleDrawer(name));

export const closeDrawer = () => async dispatch =>
    dispatch(actions.toggleDrawer(null));

export const toggleSearch = () => async dispatch =>
    dispatch(actions.toggleSearch());

export const executeSearch = (query, history, categoryId) =>
    async function thunk(dispatch) {
        let searchQuery = `query=${query}`;
        if (categoryId) searchQuery += `&category=${categoryId}`;
        history.push(`/search.html?${searchQuery}`);
        dispatch(actions.executeSearch(query));
    };
