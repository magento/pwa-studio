const requiredProp = '<i class="material-icons green">check_box</i>';

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

/**
 * Function for rendering a prop entry
 */
const renderPropEntry = ({ key, required, defaultValue, propDescription }) => {
    return `| \`${key}\` | ${required} | ${defaultValue} | ${propDescription}|\n`;
};

/**
 * Function for generating the table for props
 */
const renderClassPropsTable = props => {
    let result = `## Props\n\n `;

    let propsKeys = Object.keys(props);

    if (propsKeys.length > 0) {
        result +=
            '|Name|Required|Default|Description|\n|---|:---:|:---:|---|\n';

        propsKeys.forEach(key => {
            let prop = props[key];

            result += renderPropEntry({
                key: key,
                required: prop.required ? requiredProp : '`-`',
                defaultValue: prop.defaultValue
                    ? `\`${prop.defaultValue.value}\``
                    : '`-`',
                propDescription: prop.description ? prop.description : '`-`'
            });
        });
    }
    result += '{:style="table-layout:auto"}\n';

    return result;
};

/**
 * Main render function
 */
const renderClassDocs = ({
    description,
    props,
    propsOverrides,
    githubSource
}) => {
    return `${description}

[View Source](${githubSource})

${renderClassPropsTable(overrideProps(props, propsOverrides))}
`;
};

module.exports = renderClassDocs;
