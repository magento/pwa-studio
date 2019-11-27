const debug = require('debug')('pwa-buildpack:ModuleReplacementPlugin');

const path = require('path');
const extensions = require('@magento/venia-concept/extensions.json');

function getFileName(request) {
    return path.parse(request).name;
}

function getRelativePath(from, to) {
    const relativePath = path.relative(from, to);

    debug('New relative path to asset', relativePath);

    return relativePath;
}

class ModuleReplacementPlugin {
    apply(compiler) {
        compiler.hooks.normalModuleFactory.tap(
            'ModuleReplacementPlugin',
            nmf => {
                nmf.hooks.beforeResolve.tap(
                    'ModuleReplacementPlugin',
                    result => {
                        const filename = getFileName(result.request);
                        if (extensions.hasOwnProperty(filename)) {
                            const newResource = extensions[filename];
                            const newResourcePath = getRelativePath(
                                result.context,
                                path.resolve(newResource)
                            );
                            debug(
                                '\nReplacing',
                                result.request,
                                ' with ',
                                newResourcePath
                            );
                            result.request = newResourcePath;
                        }
                    }
                );
            }
        );
    }
}

module.exports = ModuleReplacementPlugin;
