import { useCallback } from 'react';

import { useDOMQuery } from './useDOMQuery';

const getTitle = elements => {
    try {
        return elements[0].innerText;
    } catch (err) {
        return document.title || '';
    }
};

/**
 * A hook that will return current page title and an updater.
 */
export const usePageTitle = () => {
    const [elements, { setInnerText }] = useDOMQuery('title');
    const updateTitle = useCallback(
        newTitle => {
            setInnerText(newTitle);
        },
        [setInnerText]
    );
    return [getTitle(elements), updateTitle];
};
