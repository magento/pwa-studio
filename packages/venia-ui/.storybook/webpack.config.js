const base_config = require('../webpack.config.js');

module.exports = async storybookBaseConfig => {
    const conf = await base_config();
    storybookBaseConfig.module = conf.module;
    storybookBaseConfig.resolve = conf.resolve;
    return storybookBaseConfig;
};
