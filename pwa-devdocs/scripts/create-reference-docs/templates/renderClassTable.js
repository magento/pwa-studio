const overrideProps = require('./overrideProps');

function renderClassEntry({ key, required, defaultValue, propDescription }) {
    return `| \`${key}\` | ${required} | ${defaultValue} | ${propDescription}|\n`;
}

const requiredProp = '<i class="material-icons green">check_box</i>';

const renderClassTable = ({ props, propsOverrides }) => {
    let renderedContent = `
## Props

| Name | Required | Default | Description |
| --- | :---: | :---: | --- |
`;

    let mergedProps = overrideProps(props, propsOverrides);

    let propKeys = Object.keys(mergedProps);

    propKeys.forEach(key => {
        let prop = mergedProps[key];

        let templateValues = {
            key: key,
            required: prop.required ? requiredProp : '`-`',
            defaultValue: prop.defaultValue
                ? `\`${prop.defaultValue.value}\``
                : '`-`',
            propDescription: prop.description ? prop.description : '`-`'
        };
        renderedContent += renderClassEntry(templateValues);
    });

    renderedContent += '{:style="table-layout:auto"}';

    return renderedContent;
};

module.exports = renderClassTable;
