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

function createNodeModulePath(rawPath) {
    return rawPath.includes('node_modules')
        ? rawPath
        : path.join('node_modules', rawPath);
}

function isNodeModule(rawModulePath) {
    const modulePath = createNodeModulePath(rawModulePath);
    return (
        fs.existsSync(modulePath) &&
        fs.existsSync(path.join(modulePath, 'package.json'))
    );
}

function getModuleEntryPath(rawModulePath) {
    const modulePath = createNodeModulePath(rawModulePath);
    const packageJsonPath = path.resolve(path.join(modulePath, 'package.json'));
    const packageJson = require(packageJsonPath);
    return path.join(modulePath, packageJson.main);
}

function isFile(filePath) {
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

function replaceWithNodeModule(result, newResource) {
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
                            if (isFile(newResource)) {
                                replaceWithFile(result, newResource);
                            } else if (isNodeModule(newResource)) {
                                replaceWithNodeModule(result, newResource);
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
