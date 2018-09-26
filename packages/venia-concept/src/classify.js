import React from 'react';

const merge = (...args) => Object.assign({}, ...args);

const classify = classes => WrappedComponent => props => (
    <WrappedComponent {...props} classes={merge(classes, props.classes)} />
);

export default classify;
