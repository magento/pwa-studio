/**
 * This "loader" codegens a module from scratch that just imports and
 * re-exports an array of Rich Content Renderers that extensions have
 * registered via the `richContentRenderers` target.
 * It's only meant to be used for the one specific
 * `./components/RichContent/richContentRenderers.js` module file.
 * {@see ./venia-ui-intercept}
 *
 * TODO: This is a cheap hardcode, written as a first pass before we had
 * general-purpose transformModules target. Refactor to use that!
 *
 * @module VeniaUI/Targets
 */
const BLANK_LINE = '\n\n';

module.exports = function buildRichContentRendererArray(source) {
    // The actual source is almost empty, save an explanatory comment.
    // Remove placeholder export, which only exists so linters don't complain
    const docString = source.slice(0, source.indexOf(BLANK_LINE));
    let importStatements = '';
    const exportMembers = [];

    const { renderers } = this.query;

    for (const r of renderers) {
        importStatements += `import * as ${r.componentName} from '${
            r.importPath
        }';\n`;
        exportMembers.push(r.componentName);
    }

    return `${docString}

${importStatements}
export default [
    ${exportMembers.join(',\n    ')}
];
 `;
};
