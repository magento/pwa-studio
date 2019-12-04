const debug = require('debug')('pwa-buildpack:ModuleReplacementPlugin');

const fs = require('fs');
const path = require('path');

function getExtensionDependencies(projectRoot) {
    const { dependencies } = require(path.join(projectRoot, 'package.json'));
    const depNames = Object.keys(dependencies);
    const extDeps = depNames.filter(name => {
        const extJsonPath = require.resolve(
            path.join(name, 'extensions.json'),
            {
                paths: [projectRoot]
            }
        );
        if (fs.existsSync(extJsonPath)) {
            debug('Found extensions.json for %s at %s', name, extJsonPath);
            return true;
        } else {
            return false;
        }
    });
    debug('Found extensions.json files for: %s', extDeps);
    return extDeps;
}

function generateExtensionsObj(deps, context) {
    return deps.reduce((out, depname) => {
        const absoluteExtJsonPath = require.resolve(
            path.join(depname, 'extensions.json'),
            { paths: [context] }
        );
        const extJson = require(absoluteExtJsonPath);
        for (const [target, localPath] of Object.entries(extJson)) {
            out[target] = path.resolve(absoluteExtJsonPath, '..', localPath);
        }
        return out;
    }, {});
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
    debug('\nReplacing', result.request, ' with ', newResourcePath);
    result.request = newResourcePath;
}

function replaceWithNodeModule(result, newResource) {
    const moduleEntryPath = getModuleEntryPath(result.context, newResource);
    debug('\nReplacing', result.request, ' with ', moduleEntryPath);
    result.request = moduleEntryPath;
}

class ModuleReplacementPlugin {
    apply(compiler) {
        const { context } = compiler.options;
        const deps = getExtensionDependencies(context);
        const extensions = generateExtensionsObj(deps, context);
        debug('Generated Extensions object from dependencies', extensions);
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
                                    'Path to resource is invalid. Unable to replace',
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
