/**
 * Function takes location object, filters through it and creates
 * new query params with preserved values from the array.
 * @param {object} location
 * @param {array} queries
 */
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
