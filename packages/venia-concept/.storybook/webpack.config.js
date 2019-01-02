const base_config = require('../webpack.config.js');

module.exports = async storybookBaseConfig => {
    const conf = await base_config();
    storybookBaseConfig.plugins = conf.plugins.concat(
        storybookBaseConfig.plugins
    );
    storybookBaseConfig.module = conf.module;
    storybookBaseConfig.resolve = conf.resolve;
    return storybookBaseConfig;
};
