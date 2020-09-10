const path = require('path');
const { getCombinedLocales } = require('../plugins/LocalizationPlugin');

function localizationLoader() {
    if (this.cacheable) this.cacheable();

    return getCombinedLocales(path.parse(this.resourcePath).name);
}

module.exports = localizationLoader;
