import { useState, useCallback } from 'react';

/**
 * Returns props necessary to render a Password component.
 *
 * @returns {{
 *  visible: boolean,
 *  togglePasswordVisibility: function,
 * }}
 */
export const usePassword = () => {
    const [visible, setVisbility] = useState(false);

    const togglePasswordVisibility = useCallback(() => {
        setVisbility(!visible);
    }, [visible]);

    return {
        visible,
        togglePasswordVisibility
    };
};
