const AbstractCompiler = require('./AbstractCompiledResource');

class JSONCompiler extends AbstractCompiler {
    static get supportedExtensions() {
        return ['.json'];
    }
    async compile() {
        this.contents = JSON.parse(this.source);
    }
    async render() {
        return this.contents;
    }
}

module.exports = JSONCompiler;
