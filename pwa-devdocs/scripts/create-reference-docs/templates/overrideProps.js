/**
 * Function for overriding template props
 */
const overrideProps = (props, propsOverrides) => {
    if (propsOverrides == undefined) {
        return props;
    }
    let result = Object.assign({}, props);

    let propKeys = Object.keys(props);

    propKeys.forEach(key => {
        if (propsOverrides[key]) {
            result[key] = propsOverrides[key];
        }
    });

    return result;
};

module.exports = overrideProps;
