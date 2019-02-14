const AbstractCompiledResource = require('./AbstractCompiledResource');
const gql = require('graphql-tag');

class GraphQLDocument extends AbstractCompiledResource {
    static get supportedExtensions() {
        return ['.graphql', '.gql'];
    }
    async compile() {
        this._contents = gql(this.source);
        return this;
    }
    async render() {
        return this._contents;
    }
}

module.exports = GraphQLDocument;
