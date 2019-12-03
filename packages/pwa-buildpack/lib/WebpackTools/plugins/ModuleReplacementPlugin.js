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

function isNodeModule(modulePath) {
    return (
        fs.existsSync(modulePath) &&
        fs.existsSync(path.join(modulePath, 'package.json'))
    );
}

function getModuleEntryPath(modulePath) {
    return path.join(
        modulePath,
        require(path.join(modulePath, 'package.json')).main
    );
}

function isValidFile(filePath) {
    return fs.existsSync(getRelativePath('', path.resolve(filePath)));
}

function replaceWithFile(result, newResource) {
    const newResourcePath = getRelativePath(
        result.context,
        path.resolve(newResource)
    );
    debug('\nReplacing', result.request, ' with ', newResourcePath);
    result.request = newResourcePath;
}

function replaceWithModule(result, newResource) {
    const moduleEntryPath = getModuleEntryPath(newResource);
    debug('\nReplacing', result.request, ' with ', moduleEntryPath);
    result.request = moduleEntryPath;
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
                            if (isValidFile(newResource)) {
                                replaceWithFile(result, newResource);
                            } else if (isNodeModule(newResource)) {
                                replaceWithModule(result, newResource);
                            } else {
                                debug(
                                    'Path to resouce does not exist. Unable to replace Module',
                                    result.request,
                                    'with',
                                    newResource
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
