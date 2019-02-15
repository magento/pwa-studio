const AbstractCompiledResource = require('./AbstractCompiledResource');

class JSONDocument extends AbstractCompiledResource {
    static get supportedExtensions() {
        return ['.json'];
    }
    async compile() {
        this._contents = JSON.parse(this.source);
        return this._contents;
    }
    async render() {
        return this._contents;
    }
}

module.exports = JSONDocument;
