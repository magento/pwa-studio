const { extname, normalize } = require('path');
const CompiledResources = {
    GraphQLDocument: require('./GraphQLDocument'),
    MustacheTemplate: require('./MustacheTemplate'),
    JSONDocument: require('./JSONDocument')
};

const byExtension = new Map();

for (const Resource of Object.values(CompiledResources)) {
    for (const extension of Resource.supportedExtensions) {
        byExtension.set(extension, Resource);
    }
}

module.exports = Object.assign(CompiledResources, {
    forFileOfType(filenameOrExtension) {
        const normalized = normalize(filenameOrExtension);
        const extension = normalized.startsWith('.')
            ? normalized
            : extname(normalized);
        return byExtension.get(extension);
    }
});
