const File = require('../File');

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
        if (source !== '' && !source) {
            throw new Error(
                `${
                    this.constructor.name
                } first argument must be a string, buffer, or File source`
            );
        }
        this.source = source;
        this.io = io;
    }
    async getSource(encoding) {
        const contents = await File.readToEnd(this.source);
        const wantsString =
            encoding !== 'binary' &&
            encoding !== 'buffer' &&
            typeof encoding === 'string';
        if (Buffer.isBuffer(contents) && wantsString) {
            return contents.toString(encoding);
        }
        if (!Buffer.isBuffer(contents) && !wantsString) {
            return Buffer.from(contents);
        }
        return contents;
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
