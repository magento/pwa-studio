const AbstractCompiler = require('./AbstractCompiler');
const gql = require('graphql-tag');

class GraphQLCompiler extends AbstractCompiler {
    static get supportedExtensions() {
        return ['.graphql', '.gql'];
    }
    async compile(contents) {
        return gql(contents);
    }
}

module.exports = GraphQLCompiler;
