/**
 * Render the table for the function parameters
 */
const renderFunctionParameters = parameters => {
    let content = '## Parameters\n\n';

    if (parameters.length > 0) {
        content += '|Name | Type | Description |\n| --- | :---: | --- |\n';

        parameters.forEach(value => {
            content += `| \`${value.name}\`| \`${value.type.names[0]}\`|${
                value.description
            }|\n`;
        });
        content += '{:style="table-layout:auto"}';
    } else {
        content += 'This function has no parameters.';
    }

    return content;
};

/**
 * Render the table about the returned object
 */
const renderReturnObject = returnObject => {
    if (returnObject) {
        let result = `
## Returned object

| Property | Type | Description |
| :---: | :---: | --- |
`;
        returnObject.properties.forEach(property => {
            result += `|${property.name}|\`${property.type.names[0]}\`|${
                property.description
            }|\n`;
        });
        return result;
    }
    return '';
};

/**
 * Main render function
 */
const renderFunctionDocs = ({
    description,
    githubSource,
    parameters,
    returnData
}) => {
    return `${description}

[View Source](${githubSource})

${parameters ? renderFunctionParameters(parameters) : ''}
${renderReturnObject(returnData)}`;
};

module.exports = renderFunctionDocs;
