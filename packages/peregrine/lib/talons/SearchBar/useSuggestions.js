import { useCallback } from 'react';

/**
 * Returns props necessary to render a Suggestions component.
 *
 * @param {Object} props
 * @param {Object} props.filters - filters applied to the search
 * @param {Object} props.items - product data from search results
 * @param {Function} props.setVisible - callback to set `visible` state
 * @param {Boolean} props.visible - whether the component is visible
 */
export const useSuggestions = props => {
    const { displayResult, filters, items, setVisible, visible } = props;

    // hide after navigating to a suggested product
    const onNavigate = useCallback(() => {
        setVisible(false);
    }, [setVisible]);

    // avoid rendering if data is empty
    const shouldRender = !!(
        visible &&
        displayResult &&
        filters &&
        items &&
        items.length
    );
    let categories = null;

    // find categories, but only if the component is going to render
    if (shouldRender) {
        const categoryFilter =
            filters.find(({ label }) => label === 'Category') || {};

        categories = categoryFilter.options || [];
    }

    return {
        categories,
        onNavigate,
        shouldRender
    };
};
