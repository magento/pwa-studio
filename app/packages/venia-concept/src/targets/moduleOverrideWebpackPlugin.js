const path = require('path');
const glob = require('glob');

module.exports = class NormalModuleOverridePlugin {
    constructor(moduleOverrideMap) {
        this.name = 'NormalModuleOverridePlugin';
        this.moduleOverrideMap = moduleOverrideMap;
    }

    requireResolveIfCan(id, options = undefined) {
        try {
            return require.resolve(id, options);
        } catch (e) {
            return undefined;
        }
    }
    resolveModulePath(context, request) {
        const filePathWithoutExtension = path.resolve(context, request);
        const files = glob.sync(`${filePathWithoutExtension}@(|.*)`);
        if (files.length === 0) {
            throw new Error(`There is no file '${filePathWithoutExtension}'`);
        }
        if (files.length > 1) {
            throw new Error(`There is more than one file '${filePathWithoutExtension}'`);
        }

        return require.resolve(files[0]);
    }

    resolveModuleOverrideMap(context, map) {
        return Object.keys(map).reduce(
            (result, x) => ({
                ...result,
                [require.resolve(x)]: this.requireResolveIfCan(map[x]) || this.resolveModulePath(context, map[x])
            }),
            {}
        );
    }

    apply(compiler) {
        if (Object.keys(this.moduleOverrideMap).length === 0) {
            return;
        }

        const moduleMap = this.resolveModuleOverrideMap(compiler.context, this.moduleOverrideMap);

        compiler.hooks.normalModuleFactory.tap(this.name, nmf => {
            nmf.hooks.beforeResolve.tap(this.name, resolve => {
                if (!resolve) {
                    return;
                }

                const moduleToReplace = this.requireResolveIfCan(resolve.request, {
                    paths: [resolve.context]
                });
                if (moduleToReplace && moduleMap[moduleToReplace]) {
                    resolve.request = moduleMap[moduleToReplace];
                }

                return resolve;
            });
        });
    }
};
