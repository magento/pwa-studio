import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export const useSearchTrigger = props => {
    const { onClick } = props;

    const { pathname } = useLocation();

    const handleClick = useCallback(() => {
        onClick();
    }, [onClick]);

    return {
        handleClick,
        // Disable the search trigger on the search page.
        isDisabled: pathname === '/search.html'
    };
};
