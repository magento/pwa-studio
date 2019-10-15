import { useCallback, useEffect, useRef } from 'react';
import { useAppContext } from '@magento/peregrine/lib/context/app';

import { useFilterState } from './useFilterState';

/**
 * Filter Modal talon.
 *
 * @returns {{
 *   drawer: String,
 *   filterApi: any,
 *   filterState: any,
 *   handleClose: function
 * }}
 */
export const useFilterModal = () => {
    const [{ drawer }, { closeDrawer }] = useAppContext();
    const [filterState, filterApi] = useFilterState();
    const prevDrawer = useRef(null);

    // If the user closes the drawer without clicking "Apply filters" we need to
    // make sure we reset to the last applied filters (url param values).
    useEffect(() => {
        if (prevDrawer.current === 'filter' && drawer === null) {
            console.log('TODO: apply filters');
        }
        prevDrawer.current = drawer;
    }, [drawer]);

    const handleClose = useCallback(() => {
        closeDrawer();
    }, [closeDrawer]);

    return {
        drawer,
        filterApi,
        filterState,
        handleClose
    };
};
