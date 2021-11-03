const createPlugin = require('tailwindcss/plugin');

const plugins = [
    // base plugins
    require('./root')
    // component plugins
];

const includePlugins = pluginApi => {
    const { theme } = pluginApi;
    const config = theme('venia.plugins');

    for (const [id, plugin] of plugins) {
        try {
            if (
                // config is null or undefined, so include all plugins
                config == null ||
                // config is an array, so treat it as a safelist
                (Array.isArray(config) && config.includes(id)) ||
                // config is an object, so treat it as a blocklist
                config[id] !== false
            ) {
                plugin(pluginApi);
            }
        } catch (error) {
            console.error('`theme.venia.plugins` must be an array or object');
        }
    }
};

module.exports = createPlugin(includePlugins);
