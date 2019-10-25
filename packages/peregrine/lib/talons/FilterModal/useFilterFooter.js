import { useEffect, useState } from 'react';

export const useFilterFooter = props => {
    const { hasFilters } = props;
    const [touched, setTouched] = useState();

    useEffect(() => {
        setTouched(value => value || hasFilters);
    }, [hasFilters]);

    return { touched };
};
