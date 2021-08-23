import { useState } from 'react';
import { useEventListener } from '@magento/peregrine';

export const useSubmenuBlurHandler = (props) => {

    const { mainNavRef } = props
    const [disableFocus, setDisableFocus] = useState(false);

    // Reset menu if clicked outside
    const handleClickOutside = e => {
        if (mainNavRef && mainNavRef.current && !mainNavRef.current.contains(e.target)) {
            props.setSubMenuState(false);
            setDisableFocus(true);
        }
    };

    // Bind and unbind event listener to both mouse and key events
    useEventListener(globalThis, "mousedown", handleClickOutside)
    useEventListener(globalThis, "mouseout", handleClickOutside)
    useEventListener(globalThis, "keydown", handleClickOutside)

    return {
        disableFocus
    };
}
