const loaderUtils = require('loader-utils');

const BLANK_LINE = '\n\n';

module.exports = function buildRichContentRendererArray(source) {
    // remove placeholder export, which only exists so linters don't complain
    const docString = source.slice(0, source.indexOf(BLANK_LINE));
    let importStatements = '';
    const exportMembers = [];

    const { renderers } = loaderUtils.getOptions(this);

    for (const r of renderers) {
        importStatements += `import * as ${
            r.componentName
        } from '${r.packageName || ''}${r.importPath || ''}';\n`;
        exportMembers.push(r.componentName);
    }

    return `${docString}

${importStatements}
export default [
    ${exportMembers.join(',\n    ')}
];
 `;
};
