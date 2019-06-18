import { useCallback } from 'react';

import { useDOMQuery } from './useDOMQuery';

/**
 * A hook that will return current page title and an updater.
 */
export const usePageTitle = () => {
    const [, { setInnerText }] = useDOMQuery('title');
    const updateTitle = useCallback(
        newTitle => {
            setInnerText(newTitle);
        },
        [setInnerText]
    );
    return updateTitle;
};
