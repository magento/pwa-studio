const { inspect } = require('util');
const path = require('path');
const fs = require('fs');

class Operation {
    get jsx() {
        if (!this.params.jsx) {
            return undefined;
        }
        if (!this._jsx) {
            this._jsx = this.parser.parseElement(
                this.parser.normalizeElement(this.params.jsx)
            );
        }
        return this._jsx;
    }
    constructor(request, { parser, file, babel }) {
        this.request = request;
        this.babel = babel;

        const { element, operation, params } = request.options;
        this.params = params || {};
        this.operation = operation;
        this.element = element;

        this.parser = parser;
        this.file = file;

        this.global = this.params.global;

        if (typeof element !== 'string') {
            throw new Error(
                `JSX operation:\n${this}\n is invalid: first argument must be a string which will be used to find matching elements`
            );
        }

        this.matcherText = this.parser.normalizeElement(element);
        const matcherAST = this.parser.parseElement(this.matcherText);
        this.matcherName = this._getSource(matcherAST.openingElement.name);
        this.requiredAttributes = new Map();
        for (const { name, value } of matcherAST.openingElement.attributes) {
            this.requiredAttributes.set(
                this._getSource(name),
                this._getSource(value)
            );
        }
        this.state = {};
        this.setup(this.request);
    }
    _getSource(node) {
        return this.matcherText.slice(node.start, node.end);
    }
    _shouldEnterElement(path) {
        const tag = path.get('openingElement');
        const elementName = tag.get('name').toString();
        if (elementName !== this.matcherName) {
            return false;
        }

        const numAttributesPresent = tag.node.attributes.length;

        const numAttributesRequired = this.requiredAttributes.size;

        if (numAttributesPresent < numAttributesRequired) {
            // even if one matches, it won't be enough!
            return false;
        }
        return true;
    }
    _matchesAttributes(attributePaths) {
        const matchMap = new Map(this.requiredAttributes);
        for (const attr of attributePaths) {
            const attributeName = attr.get('name').toString();
            if (!matchMap.has(attributeName)) {
                // no requirement for this attribute, ignore
                continue;
            }
            const expected = matchMap.get(attributeName);
            const actual = attr.get('value').toString();
            if (expected === actual) {
                matchMap.delete(attributeName);
                continue;
            } else {
                return false; // explicitly a rejection
            }
        }
        const allRequiredAttributesMatch = matchMap.size === 0;
        return allRequiredAttributesMatch;
    }
    match(path) {
        return this.matchElement(path);
    }
    matchElement(path) {
        return (
            this._shouldEnterElement(path) &&
            this._matchesAttributes(path.get('openingElement.attributes'))
        );
    }
    run() {
        throw new Error(
            `${
                this.constructor.name
            } has not implemented a .run(path) method for the operation "${
                this.operation
            }".`
        );
    }
    setup() {}
    toString(indentSpaces = 2) {
        const { element, operation, params } = this.request.options;
        let args = inspect(element);
        if (params) {
            args += `, ${inspect(params)}`;
        }
        if (args.includes('\n')) {
            args += '\n';
        }
        const indent = Array.from({ length: indentSpaces }, () => ' ').join('');
        return `${indent}${operation}JSX(${args})`
            .split('\n')
            .join(`\n${indent}`);
    }
    /**
     * Define a new JSX operation by name and implementation, which can then be requested by name by a transformRequest and executed by the Babel plugin.
     *
     * @static
     * @param {string} opName - Name of the operation
     * @param {typeof Operation} OperationType - A subclass of Operation with overrides for the `run` method and optionally the `match` and/or `setup` methods.
     * @memberof Operation
     */
    static define(opName, OperationType) {
        Operation.defined[opName] = OperationType;
    }
    static fromRequest(request, { parser, file, babel }) {
        const { operation } = request.options;
        const MatchingOperation = this.defined[operation];
        if (MatchingOperation) {
            return new MatchingOperation(request, { parser, file, babel });
        }
        throw new Error(
            `Invalid request ${inspect(
                request
            )}: operation name "${operation}" unrecognized`
        );
    }
}

// Several operations have such a similar implementation that we're just
// gonna use a tempate class for them.
class SimpleOperation extends Operation {
    run(path) {
        path[this.operation](this.jsx);
    }
}

Operation.defined = {
    insertAfter: SimpleOperation,
    insertBefore: SimpleOperation,
    remove: SimpleOperation
};

/**
 * Register a new JSX operation just by creating a new file in this directory
 * that exports a run function, or a { setup, match, run } tuple.
 *
 * The below code will scan this directory for those files, and then define
 * operations named after the filenames themselves.
 *
 */
const ignore = new Set(['index.js']);
for (const filename of fs.readdirSync(path.join(__dirname, 'operations'))) {
    if (!ignore.has(filename)) {
        Operation.define(
            filename.split('.')[0],
            require(`./operations/${filename}`)(Operation)
        );
    }
}

module.exports = Operation;

/** Type definitions related to: Operation */

/**
 * Defines an operation that can be run on the source of React component during build.
 *
 * @interface OperationDefinition
 *
 */

/**
 * Run the actual operation, modifying the passed AST in place.
 * @function
 * @name OperationDefinition#run
 * @param {BabelNodePath} path - [Babel `NodePath`](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md#paths object to use, representing the current JSX element in the file's syntax tree.
 * @returns {undefined}
 */

/**
 * Test the current JSX element to see if this operation should run on it.
 * Overrides the default implementation of `match`, which matches using the JSX
 * name and properties in `this.request.element`. The default implementation is
 * can be called at `this.defaultMatch(path)` or `self.defaultMatch()` using
 * the second `self` argument.
 * @function
 * @name OperationDefinition#match
 * @param {BabelNodePath} path - [Babel `NodePath`](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md#paths object to match, representing the current JSX element in the file's syntax tree.
 */

/**
 * Initialize the operation, setting up any custom data structures and reading
 * any metadata about the file.
 * @function
 * @name OperationDefinition#setup
 * @param {TransformRequest} request - The TransformRequest passed to this instance. Also available at `this.request`.
 */
