export const queryStringToObject = queryString => {
    const params = new URLSearchParams(queryString.slice(1));

    return Array.from(params.entries()).reduce(
        (acc, [key, value]) => ({ ...acc, [key]: value }),
        {}
    );
};

export const objectToQueryString = obj =>
    '?' +
    Object.entries(obj)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
