const isMap = obj => obj instanceof Map;

function optionalMap(props, propName, componentName) {
    const prop = props[propName];
    const type = typeof prop;

    if (prop != null && !isMap(prop)) {
        return new Error(
            `Invalid prop \`${propName}\` of type \`${type}\` supplied to \`${componentName}\`, expected \`Map\`.`
        );
    }
}

function requiredMap(props, propName, componentName) {
    const prop = props[propName];
    const type = typeof prop;

    if (prop == null || !isMap(prop)) {
        return new Error(
            `Invalid prop \`${propName}\` of type \`${type}\` supplied to \`${componentName}\`, expected \`Map\`.`
        );
    }
}

optionalMap.isRequired = requiredMap;

export default optionalMap;
