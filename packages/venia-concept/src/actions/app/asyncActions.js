import actions from './actions';

export const toggleDrawer = name => async dispatch =>
    dispatch(actions.toggleDrawer(name));

export const closeDrawer = () => async dispatch =>
    dispatch(actions.toggleDrawer(null));

export const toggleSearch = () => async dispatch =>
    dispatch(actions.toggleSearch(null));

export const executeSearch = (query, history, categoryId) =>
    async function thunk(dispatch) {
        console.log('Category id', categoryId);
        const searchQuery = categoryId
            ? `query=${query}&category=${categoryId}`
            : `query=${query}`;
        history.push(`/search.html?${searchQuery}`);
        dispatch(actions.executeSearch(query));
    };
