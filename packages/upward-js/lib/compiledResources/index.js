const { extname } = require('path');
const Compilers = {
    GraphQL: require('./GraphQLCompiler'),
    JSON: require('./JSONCompiler'),
    Mustache: require('./MustacheCompiler')
};

const passThroughCompiler = {
    compile: source => source
};

const compilersByExtension = new Map();

for (const Compiler of Object.values(Compilers)) {
    for (const extension of Compiler.supportedExtensions) {
        compilersByExtension.set(extension, Compiler);
    }
}

module.exports = Object.assign(Compilers, {
    async forFileOfType(filenameOrExtension) {
        const extension = filenameOrExtension.startsWith('.')
            ? filenameOrExtension
            : extname(filenameOrExtension);
        return compilersByExtension.get(extension) || passThroughCompiler;
    }
});
