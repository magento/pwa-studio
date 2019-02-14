const requiredProp = '<i class="material-icons green">check_box</i>';

function renderEntry({ key, required, defaultValue, propDescription }) {
    return `| \`${key}\` | ${required} | ${defaultValue} | ${propDescription}|\n`;
}

module.exports = ({ props, propsOverrides }) => {
    let renderedContent = `
## Props

| Name | Required | Default | Description |
| --- | :---: | :---: | --- |
`;

    let propKeys = Object.keys(props);

    propKeys.forEach(key => {
        let prop = propsOverrides
            ? Object.assign(props[key], propsOverrides[key])
            : props[key];

        let templateValues = {
            key: key,
            required: prop.required ? requiredProp : '`-`',
            defaultValue: prop.defaultValue ? `\`${prop.defaultValue.value}\`` : '`-`',
            propDescription: prop.description?prop.description:'`-`'
        };

        renderedContent += renderEntry(templateValues);
    });

    renderedContent += '{:style="table-layout:auto"}';


    return renderedContent;
};
