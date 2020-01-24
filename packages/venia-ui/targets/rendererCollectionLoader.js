const loaderUtils = require('loader-utils');

const sectionIndex = (source, name) => {
    const line = `/* ${name.toUpperCase()} */\n`;
    const index = source.indexOf(line);
    if (index === -1) {
        throw new Error(`"${line.trim()}" not found in ${source}`);
    }
    return index + line.length;
};

const insertAtSection = (source, section, addition) => {
    const index = sectionIndex(source, section);
    return source.slice(0, index) + addition + source.slice(index);
};

module.exports = function buildRichContentRendererArray(source) {
    const { renderers } = loaderUtils.getOptions(this);
    let importStatements = '';
    let exportComponents = '';
    renderers.forEach(([renderer, filepath]) => {
        importStatements += `import * as ${renderer} from '${filepath}';\n`;
        exportComponents += `    ${renderer},\n`;
    });
    const sourceWithImports = insertAtSection(
        source,
        'imports',
        importStatements
    );
    const sourceWithExports = insertAtSection(
        sourceWithImports,
        'exports',
        exportComponents
    );
    return sourceWithExports;
};
