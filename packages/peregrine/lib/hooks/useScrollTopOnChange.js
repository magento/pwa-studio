import { useEffect } from 'react';

/**
 * A hook that scrolls to the top of the page when the watched argument changes.
 *
 * @param {any} watched item to observe for changes to run the scroll effect
 */
export const useScrollTopOnChange = watched => {
    useEffect(() => {
        window.scrollTo({
            behavior: 'smooth',
            left: 0,
            top: 0
        });
    }, [watched]);
};
