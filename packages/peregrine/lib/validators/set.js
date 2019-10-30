const isSet = obj => obj instanceof Set;

function optionalSet(props, propName, componentName) {
    const prop = props[propName];
    const type = typeof prop;

    if (prop != null && !isSet(prop)) {
        return new Error(
            `Invalid prop \`${propName}\` of type \`${type}\` supplied to \`${componentName}\`, expected \`Set\`.`
        );
    }
}

function requiredSet(props, propName, componentName) {
    const prop = props[propName];
    const type = typeof prop;

    if (prop == null || !isSet(prop)) {
        return new Error(
            `Invalid prop \`${propName}\` of type \`${type}\` supplied to \`${componentName}\`, expected \`Set\`.`
        );
    }
}

optionalSet.isRequired = requiredSet;

export default optionalSet;
