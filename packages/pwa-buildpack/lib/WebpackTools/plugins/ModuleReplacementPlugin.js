const debug = require('debug')('pwa-buildpack:ModuleReplacementPlugin');

const fs = require('fs');
const path = require('path');
// eslint-disable-next-line node/no-extraneous-require
const extensions = require('@magento/venia-concept/extensions.json');

function getFileName(request) {
    return path.parse(request).base;
}

function getRelativePath(from, to) {
    return path.relative(from, to);
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
                            if (
                                fs.existsSync(
                                    getRelativePath(
                                        '',
                                        path.resolve(newResource)
                                    )
                                )
                            ) {
                                debug(
                                    '\nReplacing',
                                    result.request,
                                    ' with ',
                                    newResourcePath
                                );
                                result.request = newResourcePath;
                            } else {
                                debug(
                                    'Path to resouce does not exist. Unable to replace Module',
                                    result.request,
                                    'with',
                                    newResourcePath
                                );
                            }
                        }
                    }
                );
            }
        );
    }
}

module.exports = ModuleReplacementPlugin;
