import React, { Fragment } from 'react';

const extensionMap = new Map();

/**
 * Gets any extensions registered for an id and returns the component.
 * @param {string} props.id id of the portal within the map
 */
export const Portal = ({ id }) => {
    const components = extensionMap.get(id);
    return <Fragment>{components}</Fragment>;
};

/**
 * This extension component renders children into the DOM after React mounts.
 *
 * @example
 * <Extension targetId={'extension-point-1'}>
 *   <MyExtensionComponent>
 * </Extension>
 *
 * @param {String} [props.targetId=root] id of injection target for extension
 * @param {ReactNode} props.children
 */
export const Extension = props => {
    const { children, targetId = 'root' } = props;

    // Add new extensions.
    const existing = extensionMap.get(targetId) || [];
    existing.push(children);

    // Store in the map.
    extensionMap.set(targetId, existing);

    // Return nothing because rendering happens from the @Portal component.
    return null;
};
