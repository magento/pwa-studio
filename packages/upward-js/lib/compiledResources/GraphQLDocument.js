const AbstractCompiledResource = require('./AbstractCompiledResource');
const gql = require('graphql-tag');

class GraphQLDocument extends AbstractCompiledResource {
    static get supportedExtensions() {
        return ['.graphql', '.gql'];
    }
    async compile() {
        this._contents = gql(await this.getSource('utf8'));
        return this;
    }
    async render() {
        if (!this._contents) {
            await this.compile();
        }
        return this._contents;
    }
}

module.exports = GraphQLDocument;
