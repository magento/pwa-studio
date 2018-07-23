import { createElement } from 'react';

const merge = (...args) => Object.assign({}, ...args);

const classify = defaultClasses => WrappedComponent => props => {
    const { className } = props;
    const classNameAsObject = className ? { root: className } : null;
    const classes = merge(defaultClasses, classNameAsObject, props.classes);

    return <WrappedComponent {...props} classes={classes} />;
};

export default classify;
