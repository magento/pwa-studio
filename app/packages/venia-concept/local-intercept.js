/**
 * Custom interceptors for the project.
 *
 * This project has a section in its package.json:
 *    "pwa-studio": {
 *        "targets": {
 *            "intercept": "./local-intercept.js"
 *        }
 *    }
 *
 * This instructs Buildpack to invoke this file during the intercept phase,
 * as the very last intercept to run.
 *
 * A project can intercept targets from any of its dependencies. In a project
 * with many customizations, this function would tap those targets and add
 * or modify functionality from its dependencies.
 */

function localIntercept(targets) {
    /**************************************
     * Targetables *
     ***************************************/
    const fs = require('fs');
    const path = require('path');
    const globby = require('globby');
    const { Targetables } = require('@magento/pwa-buildpack');

    //  Define the path to @magento packages
    const magentoPath = 'node_modules/@magento';

    // Define targetables for the project
    const targetables = Targetables.using(targets);

    // Find our .targetables.js files
    (async () => {
        const paths = await globby('src/components', {
            expandDirectories: {
                files: ['*.targetables.js']
            }
        });

        paths.forEach(myPath => {
            const relativePath = myPath
                .replace('.targetables', '')
                .replace(
                    `src/components`,
                    `${magentoPath}/venia-ui/lib/components`
                );
            const absolutePath = path.resolve(relativePath);

            fs.stat(absolutePath, (err, stat) => {
                if (!err && stat && stat.isFile()) {
                    // Retrieve the react component from our cache (so we can use it more than once if necessary)
                    const component = getReactComponent(
                        relativePath.replace('node_modules/', '')
                    );

                    /**
                     * Load the targetables file for the component and execute the interceptComponent function
                     * We also pass in the component itself so we don't need to load it in the file
                     */
                    const componentInterceptor = require('./' + myPath);
                    componentInterceptor.interceptComponent(component);
                }
            });
        });
    })();

    /**********************************************
     * Components Cache for Targetables and Styles*
     ***********************************************/
    // Create a cache of components so our styling and intercepts can use the same object
    const componentsCache = [];
    function getReactComponent(modulePath) {
        if (componentsCache[modulePath] !== undefined) {
            return componentsCache[modulePath];
        }

        componentsCache[modulePath] = targetables.reactComponent(modulePath);
        return componentsCache[modulePath];
    }

    /**********************************************
     * Component Overrides *
     ***********************************************/
    const moduleOverridePlugin = require('./src/targets/moduleOverrideWebpackPlugin');
    const componentOverrideMapping = require('./src/targets/componentOverrideMapping');

    targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
        new moduleOverridePlugin(componentOverrideMapping).apply(compiler);
    });
}

module.exports = localIntercept;
