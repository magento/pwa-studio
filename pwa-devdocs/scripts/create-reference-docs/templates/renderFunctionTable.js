const overrideProps = require('./overrideProps');

function renderFunctionEntry({ name, type, description }) {
    return `| \`${name}\` | \`${type}\` | ${description} |\n`;
}

const renderFunctionTable = ({ props, propsOverrides }) => {
    let renderedContent = `
## Props

| Name | Type | Description |
| --- | :---: | --- |
`;

    let mergedProps = overrideProps(props, propsOverrides);

    let propKeys = Object.keys(mergedProps);

    propKeys.forEach(key => {
        let prop = mergedProps[key];

        templateValues = {
            name: key,
            type: prop.type ? prop.type.names.join(', ') : '`-`',
            description: prop.description ? prop.description : '`-`'
        };
        renderedContent += renderFunctionEntry(templateValues);
    });

    renderedContent += '{:style="table-layout:auto"}';

    return renderedContent;
};

module.exports = renderFunctionTable;
