const debug = require('../../util/debug').makeFileLogger(__filename);
const path = require('path');

const ServiceWorkerPlugin = require('../plugins/ServiceWorkerPlugin');

module.exports = function({ mode, context, fileName, paths, esModuleRule }) {
    debug('Creating service worker config');
    const config = {
        mode,
        context,
        entry: {
            serviceWorker: path.resolve(paths.src, 'ServiceWorker', fileName)
        },
        output: {
            path: paths.output,
            publicPath: '/',
            filename: fileName,
            strictModuleExceptionHandling: true,
            chunkFilename: 'sw-[chunkhash].js'
        },
        module: {
            rules: [esModuleRule]
        },
        plugins: [
            new ServiceWorkerPlugin({
                mode,
                paths,
                fileName,
                injectManifest: true,
                injectManifestConfig: {
                    include: [/\.js$/],
                    swSrc: `./${fileName}`,
                    swDest: `./${fileName}`
                }
            })
        ]
    };
    debug('Done creating service worker config.');
    return config;
};
