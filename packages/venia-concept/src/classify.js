import React from 'react';

const merge = (...args) => Object.assign({}, ...args);

const classify = classes => WrappedComponent => {
    const Classified = props => (
        <WrappedComponent {...props} classes={merge(classes, props.classes)} />
    );
    Classified.displayName = `Classified(${WrappedComponent.displayName ||
        WrappedComponent.name ||
        'Component'})`;
    return Classified;
};

export default classify;
