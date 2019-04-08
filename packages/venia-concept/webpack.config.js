const Buildpack = require('@magento/pwa-buildpack');

module.exports = async function setupBuildpackBuild(webpackCliEnv) {
    const config = await Buildpack.configureWebpack({
        context: __dirname,
        rootComponentPaths: [
            await Buildpack.resolveModuleDirectory(
                '@magento/venia-library',
                'esm/RootComponents'
            )
        ],
        webpackCliEnv
    });
    // Modify Webpack configuration object here if necessary.
    config.resolve.alias['@magento/venia-drivers'] = 'src/drivers';
    return config;
};
