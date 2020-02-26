import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const getSearchParam = (parameter = '', location = window.location) => {
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
 * @param {Object} props An object containing the parameter and setter function.
 * @param {String} props.parameter The parameter to search for
 * @param {Function} props.setValue A setter function that is passed the parameter value found in the URL
 */
export const useSearchParam = props => {
    const location = useLocation();
    const { parameter, setValue } = props;
    const value = getSearchParam(parameter, location);

    useEffect(() => {
        setValue(value);
    }, [setValue, value]);
};
