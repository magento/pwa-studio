const yaml = require('js-yaml');

module.exports = function(source) {
    if (this.cacheable) {
        this.cacheable();
    }

    try {
        const json = yaml.safeLoad(source);

        return json;
    } catch (error) {
        this.emitError(error);

        return null;
    }
};
