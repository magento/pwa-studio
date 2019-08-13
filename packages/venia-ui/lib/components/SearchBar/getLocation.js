// TODO: derive from store config when available
export default (searchValue, categoryId) => {
    // start with the current uri
    const uri = new URL('/search.html', window.location);

    // update the query params
    uri.searchParams.set('query', searchValue);
    uri.searchParams.set('category', categoryId);

    const { pathname, search } = uri;

    // return only the pieces React Router wants
    return { pathname, search };
};
