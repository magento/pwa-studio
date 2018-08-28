class AbstractCompiler {
    static get supportedExtensions() {
        throw new Error(
            'Internal error: Compilers must define supported file extensions.'
        );
    }
    constructor(io) {
        this.io = io;
    }
    compile(contents) {
        throw new Error(
            'Internal error: Compilers must define a `compile()` method.'
        );
    }
}

module.exports = AbstractCompiler;
