const { extname } = require('path');
const CompiledResources = {
    GraphQLDocument: require('./GraphQLDocument'),
    JSONObject: require('./JSONObject'),
    MustacheTemplate: require('./MustacheTemplate')
};

const byExtension = new Map();

for (const Resource of Object.values(CompiledResources)) {
    for (const extension of Resource.supportedExtensions) {
        byExtension.set(extension, Resource);
    }
}

module.exports = Object.assign(CompiledResources, {
    forFileOfType(filenameOrExtension) {
        const extension = filenameOrExtension.startsWith('.')
            ? filenameOrExtension
            : extname(filenameOrExtension);
        return byExtension.get(extension);
    }
});
