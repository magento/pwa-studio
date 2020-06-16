import React from 'react';

// memoization cache
const cache = new Map();

export const filterProps = (props = {}, exclusions = []) =>
    Object.entries(props).reduce((r, [k, v]) => {
        if (!exclusions.includes(k)) {
            r[k] = v;
        }
        return r;
    }, {});

const fromRenderProp = (elementType, customProps = []) => {
    const isComposite = typeof elementType === 'function';

    // if `elementType` is a function, it's already a component
    if (isComposite) {
        return elementType;
    }

    // sort and de-dupe `customProps`
    const uniqueCustomProps = Array.from(new Set([...customProps].sort()));

    // hash arguments for memoization
    const key = `${elementType}//${uniqueCustomProps.join(',')}`;

    // only create a new component if not cached
    // otherwise React will unmount on every render
    if (!cache.has(key)) {
        // create an SFC that renders a node of type `elementType`
        // and filter any props that shouldn't be written to the DOM
        const Component = props =>
            React.createElement(
                elementType,
                filterProps(props, uniqueCustomProps)
            );

        Component.displayName = `fromRenderProp(${elementType})`;
        cache.set(key, Component);
    }

    return cache.get(key);
};

export default fromRenderProp;
