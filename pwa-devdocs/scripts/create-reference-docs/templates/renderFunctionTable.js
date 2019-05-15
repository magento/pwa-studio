const overrideProps = require('./overrideProps');

function renderFunctionEntry({ name, type, description }) {
    return `| \`${name}\` | \`${type}\` | ${description} |\n`;
}

const renderFunctionTable = ({ props, propsOverrides, githubSource }) => {
    let renderedContent = '\n\n## Parameters\n\n';

    let mergedProps = overrideProps(props, propsOverrides);
    let propKeys = Object.keys(mergedProps);

    if (propKeys.length > 0) {
        renderedContent +=
            '| Name | Type | Description |\n| --- | :---: | --- |\n';

        propKeys.forEach(key => {
            let prop = mergedProps[key];

            templateValues = {
                name: key,
                type: prop.type ? prop.type.names.join(', ') : '`-`',
                description: prop.description ? prop.description : '`-`'
            };
            renderedContent += renderFunctionEntry(templateValues);
        });

        renderedContent += '{:style="table-layout:auto"}\n';
    } else {
        renderedContent += 'This function does not take any parameters.\n';
    }

    renderedContent += `\n[View Source](${githubSource})`;

    return renderedContent;
};

module.exports = renderFunctionTable;
