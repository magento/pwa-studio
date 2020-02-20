import { useCallback } from 'react';

/**
 * Returns props necessary to render an SwitchStore component.
 *
 * @param {object} props
 * @param {function} props.showSwitchStore - callback that displays sign in view
 * @return {{
 *   handleSwitchStore: function
 * }}
 */
export const useSwitchStore = props => {
    const { showSwitchStore } = props;

    const handleSwitchStore = useCallback(() => {
        showSwitchStore();
    }, [showSwitchStore]);

    return { handleSwitchStore };
};
