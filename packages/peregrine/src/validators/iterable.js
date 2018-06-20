const isIterable = obj => typeof obj[Symbol.iterator] === 'function';

function optionalIterable(props, propName, componentName) {
    const prop = props[propName];

    if (prop != null && !isIterable(prop)) {
        return new Error(
            `Invalid prop \`${propName}\` supplied to \`${componentName}\`. Validation failed.`
        );
    }
}

function requiredIterable(props, propName, componentName) {
    const prop = props[propName];

    if (!isIterable(prop)) {
        return new Error(
            `Invalid prop \`${propName}\` supplied to \`${componentName}\`. Validation failed.`
        );
    }
}

optionalIterable.isRequired = requiredIterable;

export default optionalIterable;
