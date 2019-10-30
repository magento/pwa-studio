import { useEffect, useState } from 'react';

export const useFilterFooter = props => {
    const { hasFilters, isOpen } = props;
    const [touched, setTouched] = useState();

    useEffect(() => {
        if (isOpen) {
            setTouched(value => value || hasFilters);
        } else {
            setTouched(false);
        }
    }, [hasFilters, isOpen]);

    return { touched };
};
