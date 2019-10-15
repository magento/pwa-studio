import React, { Fragment, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * This extension component renders children into the DOM after React mounts.
 *
 * @example
 * <Extension targetId={'extension-point-1'}>
 *   <MyExtensionComponent>
 * </Extension>
 *
 * @param {String} props.targetId id of injection target for extension
 * @param {ReactNode} props.children
 */
export const Extension = props => {
    const { children, targetId } = props;
    const [isMounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const extensionPoint = document.getElementById(targetId);

    // Only render after the initial mount, and only if the extension point has
    // been found.
    return isMounted && !!extensionPoint
        ? createPortal(<Fragment>{children}</Fragment>, extensionPoint)
        : null;
};
