import { useEffect } from 'react';

const getSearchParam = (parameter = '', location = window.location) => {
    const params = new URLSearchParams(location.search);

    return params.get(parameter) || '';
};

export const useSearchParam = props => {
    const { location, parameter, setValue } = props;
    const value = getSearchParam(parameter, location);

    useEffect(() => {
        setValue(value);
    }, [setValue, value]);
};
