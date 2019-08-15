/**
 * @fileoverview Returns a query parameter's value or
 * an empty string if not found.
 */

const getQueryParameterValue = ({
    location = window.location,
    queryParameter = ''
}) => {
    const params = new URLSearchParams(location.search);
    return params.get(queryParameter) || '';
};

export default getQueryParameterValue;
