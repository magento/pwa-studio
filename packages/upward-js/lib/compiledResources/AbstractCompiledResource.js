class AbstractCompiledResource {
    static get supportedExtensions() {
        throw new Error(
            'Internal error: CompiledResources must define static supported file extensions.'
        );
    }
    constructor(source, io) {
        if (this.constructor === AbstractCompiledResource) {
            throw new Error(
                'Internal error: Cannot instantiate AbstractCompiledResource directly'
            );
        }
        if (typeof source !== 'string') {
            throw new Error(
                `Must construct a CompiledResource with string source. Was supplied a ${typeof source}: ${source}`
            );
        }
        this.source = source;
        this.io = io;
    }
    async compile() {
        throw new Error(
            'Internal error: CompiledResources must define a compile method.'
        );
    }
    async render() {
        throw new Error(
            'Internal error: CompiledResources must define a render method.'
        );
    }
}

module.exports = AbstractCompiledResource;
