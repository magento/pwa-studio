import { useEffect } from 'react';

const getSearchParam = (parameter = '', location = window.location) => {
    const params = new URLSearchParams(location.search);

    return params.get(parameter) || '';
};

/**
 * A [React Hook]{@link https://reactjs.org/docs/hooks-intro.html} that gets
 * a search parameter from a URL and calls a provided setter function with
 * the corresponding value.
 *
 * @kind function
 *
 * @param {PropObject} props An Object containing the location, parameter, and setter function.
 */
export const useSearchParam = props => {
    /**
     * @typedef PropObject
     * @type {object}
     *
     * @property {string} location The URL location to search for
     * @property {string} parameter The parameter to search for in the URL
     * @property {function} setValue A setter function that is passed the parameter value found in the URL
     */
    const { location, parameter, setValue } = props;
    const value = getSearchParam(parameter, location);

    useEffect(() => {
        setValue(value);
    }, [setValue, value]);
};
