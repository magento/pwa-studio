export const preserveQueryParams = (location, queries) => {
    if (!location) return null;
    const newQueryParam = new URLSearchParams();
    const { search } = location;
    const queryParams = new URLSearchParams(search);
    queries.map(name => {
        const value = queryParams.get(name);
        if (!value) return;
        newQueryParam.set(name, value);
    });
    return newQueryParam;
};
