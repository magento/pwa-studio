import { createElement } from 'react';

// memoization cache
const cache = new Map();

export const filterProps = (props = {}, blacklist = []) =>
    Object.entries(props).reduce((r, [k, v]) => {
        if (!blacklist.includes(k)) {
            r[k] = v;
        }
        return r;
    }, {});

const fromRenderProp = (elementType, customProps = []) => {
    const isComposite = typeof elementType === 'function';

    // if `elementType` is a function, it can be a component
    if (isComposite) {
        return elementType;
    }

    // hash arguments for memoization
    const key = `${elementType}//${customProps.join(',')}`;

    // only create a new component if not cached
    // otherwise React will unmount on every render
    if (!cache.has(key)) {
        // create an SFC that renders a node of `elementType`
        // and filter any props that shouldn't be written to the DOM
        const Factory = props =>
            createElement(elementType, filterProps(props, customProps));

        Factory.displayName = `${elementType}FromRenderProp`;
        cache.set(key, Factory);
    }

    return cache.get(key);
};

export default fromRenderProp;
