const util = require('util');
const babel = require('@babel/core');
const figures = require('figures');

class SingleImportError extends Error {
    constructor(statement, details) {
        const msg = `Bad import statement: ${util.inspect(
            statement
        )}. SingleImportStatement must be an ES Module static import statement of the form specified at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import, which imports exactly one binding.`;
        super(details ? `${msg} \n\nDetails: ${details}` : msg);
        Error.captureStackTrace(this, SingleImportStatement);
    }
}

/**
 * Represents a static import statement in an ES module. SingleImportStatemnts
 * are used inside TargetableESModule methods to keep track of the new
 * dependencies being added to the module, and to resolve conflicts when they
 * occur.
 *
 * The typical way to add new imports to a TargetableESModule is to pass a
 * static import statement. The import statement can accomplish two things:
 *
 *  - It's already a familiar syntax
 *  - It contains the module path, the exports of the module to import, and the local binding names for those imports
 *
 * That's _almost_ all we need to do the import management we need, including
 * deduping and scope conflict resolution.
 */
class SingleImportStatement {
    /**
     * @param {string} statement A static import statement
     */
    constructor(statement) {
        this.originalStatement = statement;
        this.statement = this._normalizeStatement(statement);
        this.node = this._parse();
        this.binding = this._getBinding();
        this.source = this._getSource();
        this.imported = this._getImported(); // must come after this._getBinding
    }
    /**
     * Creates a new SingleImportStatement object with a different binding.
     *
     * @param {string} newBinding - Binding to rename.
     *
     * @returns {SingleImportStatement} A new SingleImportStatement that is a copy
     * of this one, but with the binding renamed. The `originalStatement` and
     * `statement` properties are rewritten to use the new binding.
     */
    changeBinding(newBinding) {
        const { imported, local } = this.node.specifiers[0];
        let position = local;
        let binding = newBinding;

        const mustAlias = imported && imported.start === local.start;
        if (mustAlias) {
            // looks like we're exporting the imported identifier as local, so
            // amend it to alias to the new binding.
            // Don't replace any characters; start and end are the same index.
            position = {
                start: imported.end,
                end: imported.end
            };
            binding = ` as ${newBinding}`;
        }

        const start = this.statement.slice(0, position.start);
        const end = this.statement.slice(position.end);

        return new SingleImportStatement(start + binding + end);
    }
    /**
     * When interpolated as a string, a SingleImportStatement becomes the value
     * of its `binding` property.
     *
     * @returns string
     */
    toString() {
        return this.binding;
    }
    _normalizeStatement(statementArg) {
        if (typeof statementArg !== 'string') {
            throw new SingleImportError(statementArg);
        }

        let statement = statementArg.trim(); // it feels bad to modify arguments

        // semicolons because line breaks are no guarantee in a bundler
        if (!statement.endsWith(';')) {
            statement += ';';
        }

        // affordance to add "import" so that you can say
        // `new ImportStatement('X from "x"')` which is less redundant than
        // `new ImportStatement('import X from "x"')`
        if (!statement.startsWith('import')) {
            statement = `import ${statement}`;
        }

        return statement + '\n';
    }
    _parse() {
        let node;
        try {
            node = babel.parseSync(this.statement, {
                filename: 'import-statement.js',
                sourceType: 'module'
            });
        } catch (e) {
            let msg = e.message;
            let indicator = '\n\t';
            for (let index = 0; index < e.pos; index++) {
                indicator += figures.line;
            }
            msg += `${indicator}v\n\t${this.statement}`;
            throw new SingleImportError(this.originalStatement, msg);
        }
        try {
            node = node.program.body[0];
        } catch (e) {
            throw new SingleImportError(
                this.originalStatement,
                `Unexpected AST structure: ${util.inspect(node, { depth: 1 })}`
            );
        }
        if (node.type !== 'ImportDeclaration') {
            throw new SingleImportError(
                this.originalStatement,
                `Node type was ${node.type}`
            );
        }
        return node;
    }
    _getBinding() {
        const bindings = this.node.specifiers.map(({ local }) => local.name);
        if (bindings.length !== 1) {
            throw new SingleImportError(
                this.originalStatement,
                `Import ${bindings.length} bindings: ${bindings.join(
                    ', '
                )}. Imports for these targets must have exactly one binding, which will be used in generated code.`
            );
        }
        return bindings[0];
    }
    _getSource() {
        return this.node.source.value;
    }
    _getImported() {
        const { type, imported } = this.node.specifiers[0];
        switch (type) {
            case 'ImportNamespaceSpecifier':
                return '*';
            case 'ImportDefaultSpecifier':
                return 'default';
            default:
                return imported.name;
        }
    }
}

module.exports = SingleImportStatement;
