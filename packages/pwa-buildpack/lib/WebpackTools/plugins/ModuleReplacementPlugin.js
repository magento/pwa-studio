const debug = require('debug')('pwa-buildpack:ModuleReplacementPlugin');

const fs = require('fs');
const path = require('path');

function getExtensionDependencies(storefrontRoot) {
    const { dependencies } = require(path.join(storefrontRoot, 'package.json'));
    const depNames = Object.keys(dependencies);
    const extDeps = depNames.filter(name => {
        const extJsonPath = require.resolve(path.join(name, 'extensions.js'), {
            paths: [storefrontRoot]
        });
        if (fs.existsSync(extJsonPath)) {
            return true;
        } else {
            return false;
        }
    });
    debug('Found extensions.js files for: %s', extDeps);
    return extDeps;
}

function generateExtensionsObj(deps, context) {
    return deps.reduce((out, depName) => {
        const absoluteExtJsPath = require.resolve(
            path.join(depName, 'extensions.js'),
            { paths: [context] }
        );
        const extJson = require(absoluteExtJsPath);
        for (const [target, getExtensionPath] of Object.entries(extJson)) {
            out[target] = {
                depName,
                getExtensionPath
            };
        }
        return out;
    }, {});
}

function getExtensionsConfig(storefrontRoot, options) {
    const extensionsConfigJsPath = path.join(
        storefrontRoot,
        'extensions.config.js'
    );
    if (fs.existsSync(extensionsConfigJsPath)) {
        const config = require(extensionsConfigJsPath);
        return config({
            ...options,
            projectRoot: storefrontRoot
        });
    } else {
        return null;
    }
}

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

function getModuleEntryPath(projectRoot, rawModulePath) {
    return require.resolve(rawModulePath, { paths: [projectRoot] });
}

function isFile(filePath) {
    return fs.existsSync(getRelativePath('', path.resolve(filePath)));
}

function replaceWithFile(result, newResource) {
    const newResourcePath = getRelativePath(
        result.context,
        path.resolve(newResource)
    );
    debug('\nReplacing File', result.request, ' with ', newResourcePath);
    result.request = newResourcePath;
}

function replaceWithNodeModule(result, newResource) {
    const moduleEntryPath = getModuleEntryPath(result.context, newResource);
    debug('\nReplacing Module', result.request, ' with ', moduleEntryPath);
    result.request = moduleEntryPath;
}

function getExtensionOptions(extensionsConfig, depName, target) {
    return (
        (extensionsConfig &&
            extensionsConfig[depName] &&
            extensionsConfig[depName][target]) ||
        null
    );
}

class ModuleReplacementPlugin {
    constructor(options) {
        this.options = options;
    }

    apply(compiler) {
        const { context: storefrontRoot } = compiler.options;
        const deps = getExtensionDependencies(storefrontRoot);
        const extensions = generateExtensionsObj(deps, storefrontRoot);
        const extensionsConfig = getExtensionsConfig(
            storefrontRoot,
            this.options
        );
        debug('Generated Extensions object from dependencies', extensions);
        compiler.hooks.normalModuleFactory.tap(
            'ModuleReplacementPlugin',
            nmf => {
                nmf.hooks.beforeResolve.tap(
                    'ModuleReplacementPlugin',
                    result => {
                        try {
                            const filename = getFileName(result.request);
                            if (extensions.hasOwnProperty(filename)) {
                                const {
                                    depName,
                                    getExtensionPath
                                } = extensions[filename];
                                const extensionOptions = getExtensionOptions(
                                    extensionsConfig,
                                    depName,
                                    filename
                                );
                                const resourceLocalPath = getExtensionPath(
                                    extensionOptions
                                );
                                const newResource = require.resolve(
                                    path.join(depName, resourceLocalPath)
                                );
                                if (isFile(newResource)) {
                                    replaceWithFile(result, newResource);
                                } else if (isNodeModule(newResource)) {
                                    replaceWithNodeModule(result, newResource);
                                } else {
                                    throw new Error(
                                        `Path to resource is invalid. Unable to replace ${
                                            result.request
                                        } with ${newResource}`
                                    );
                                }
                            }
                        } catch (err) {
                            debug(err);
                        }
                    }
                );
            }
        );
    }
}

module.exports = ModuleReplacementPlugin;
