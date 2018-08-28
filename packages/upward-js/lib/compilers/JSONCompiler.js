const AbstractCompiler = require('./AbstractCompiler');

class JSONCompiler extends AbstractCompiler {
    static get supportedExtensions() {
        return ['.json'];
    }
    async compile(contents) {
        return JSON.parse(contents);
    }
}

module.exports = JSONCompiler;
