import { useCallback } from 'react';
import { useGlobalContext } from '@magento/peregrine/lib/context/global';
import makeOptimizedUrl from '../util/makeUrl';

/**
 * Injects the origin into the makeOptimizedUrl function and returns it.
 */
export const useResourceUrl = () => {
    const { origin } = useGlobalContext();

    const resourceUrl = useCallback(
        /**
         *
         * @param {string} path
         * @param {Object} options
         * @returns
         */
        (path, options = {}) => makeOptimizedUrl(path, { ...options, origin }),
        [origin]
    );

    return resourceUrl;
};
