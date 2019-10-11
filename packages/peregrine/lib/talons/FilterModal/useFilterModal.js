import { useCallback, useEffect, useRef } from 'react';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useCatalogContext } from '@magento/peregrine/lib/context/catalog';

/**
 * Filter Modal talon.
 *
 * @returns {{
 *   drawer: String,
 *   handleClose: function
 * }}
 */
export const useFilterModal = () => {
    const [{ drawer }, { closeDrawer }] = useAppContext();
    const [, catalogApi] = useCatalogContext();
    const { setToApplied } = catalogApi.actions.filterOption;
    // If the user closes the drawer without clicking "Apply filters" we need to
    // make sure we reset to the last applied filters (url param values).
    const prevDrawer = useRef(null);
    useEffect(() => {
        if (prevDrawer.current === 'filter' && drawer === null) {
            setToApplied();
        }
        prevDrawer.current = drawer;
    }, [drawer, setToApplied]);

    const handleClose = useCallback(() => {
        closeDrawer();
    }, [closeDrawer]);

    return {
        drawer,
        handleClose
    };
};
