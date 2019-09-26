import { useCallback } from 'react';

/**
 * Returns props necessary to render a Suggestions component.
 *
 * @param {Object} props
 * @param {Object[]} props.filters - array of filter objects
 * @param {Object[]} props.items - array of product objects
 * @param {Function} props.setVisible - updates `visible` state
 * @param {Boolean} props.visible - whether the component is visible
 */
export const useSuggestions = props => {
    const { filters, items, setVisible, visible } = props;

    const onNavigate = useCallback(() => {
        setVisible(false);
    }, [setVisible]);

    const shouldRender = !!(visible && filters && items && items.length);
    let categories = null;

    if (shouldRender) {
        const categoryFilter =
            filters.find(({ name }) => name === 'Category') || {};

        categories = categoryFilter.filter_items || [];
    }

    return {
        categories,
        onNavigate,
        shouldRender
    };
};
