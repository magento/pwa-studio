const JSXSnippetParser = require('./JSXSnippetParser');
const Operation = require('./Operation');

/**
 * Processor for JSX nodes in an AST, which receives a list of instructions and
 * then a sequence of nodes from the plugin visitor.
 *
 * For every JSX node, JSXModifier will check its library of operations to see
 * if one matches, and if so, it will run the requested operation on the node.
 *
 * @class JSXModifier
 */
class JSXModifier {
    constructor(requests, babel, visitor) {
        this.parser = new JSXSnippetParser(babel, visitor.filename);
        this.visitor = visitor;
        this.operations = new Set(
            requests.map(request =>
                Operation.fromRequest(request, {
                    parser: this.parser,
                    file: this.visitor.file,
                    babel
                })
            )
        );
        this.unmatchedOperations = new Set(this.operations);
        this.visited = new WeakMap();
        this.visitor.file.metadata.warnings = [];
    }
    runMatchingOperations(openingPath) {
        const path = openingPath.parentPath;
        // detach node so that we preserve its identity, even if the operation
        // changes the value of path.node. Otherwise, we won't cache the node we
        // actually visited, and we may end up infinitely recurring.
        const originalNode = path.node;
        const hasAlreadyRun = this.visited.get(originalNode) || new Set();
        for (const operation of this.operations) {
            if (operation.match(path) && !hasAlreadyRun.has(operation)) {
                this.unmatchedOperations.delete(operation);
                operation.run(path);
                hasAlreadyRun.add(operation);
                if (!operation.global) {
                    this.operations.delete(operation);
                }
                this.visited.set(originalNode, hasAlreadyRun);
                if (path.removed || !path.node) {
                    break;
                } else if (path.node !== originalNode) {
                    this.visited.set(path.node, hasAlreadyRun);
                }
            }
        }
    }

    parseJSXParam(params) {
        return this.parser.parseElement(
            this.parser.normalizeElement(params.jsx)
        );
    }

    warnUnmatchedOperations() {
        const { warnings } = this.visitor.file.metadata;
        for (const operation of this.unmatchedOperations) {
            warnings.push(
                `JSX operation:\n${operation}\nnever found an element matching '${
                    operation.element
                }'`
            );
        }
    }
}

module.exports = JSXModifier;
