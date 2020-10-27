const { inspect } = require('util');
const babel = require('@babel/core');
/**
 * Mocks the "path" object received by Babel plugin visitor methods.
 * Incomplete; only implemented it enough for current tests.
 */
class MockBabelNodePath {
    constructor(source, options, node) {
        this._source = source;
        this._options = options || {};
        this.node =
            node ||
            babel.parseSync(source, {
                plugins: ['syntax-jsx'],
                filename: 'mock-node-path-file.js',
                sourceType: 'module',
                ...options
            }).program.body[0].expression;
    }
    get(dotPath) {
        let result;
        try {
            result = dotPath
                .split('.')
                .reduce((node, segment) => node[segment], this.node);
        } catch (e) {
            throw new Error(
                `Path ${dotPath} not found in node: ${inspect(this.node)}`
            );
        }
        if (!result || typeof result !== 'object') {
            return result;
        }
        if (Array.isArray(result)) {
            return result.map(
                node => new MockBabelNodePath(this._source, this._options, node)
            );
        }
        return new MockBabelNodePath(this._source, this._options, result);
    }
    toString() {
        return this._source.slice(this.node.start, this.node.end);
    }
}

module.exports = MockBabelNodePath;
