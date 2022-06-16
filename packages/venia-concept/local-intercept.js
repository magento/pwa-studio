/* eslint-disable */
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

const { Targetables } = require('@magento/pwa-buildpack');

module.exports = targets => {
    const moduleOverridePlugin = require('./src/targets/moduleOverrideWebpackPlugin');
    const componentOverrideMapping = require('./src/targets/componentOverrideMapping');

    targets.of('@magento/venia-ui').routes.tap(routes => {
        routes.push(
            {
                name: 'SignIn',
                pattern: '/sign-in',
                path: require.resolve('./src/components/SignIn')
            },
            {
                name: 'ForgotPassword',
                pattern: '/forgot-password',
                path: require.resolve('./src/components/ForgotPassword')
            }
        );
        return routes;
    });

    const peregrineTargets = targets.of('@magento/peregrine');
    const talonsTarget = peregrineTargets.talons;
    talonsTarget.tap(talonWrapperConfig => {
        //talonWrapperConfig.Header.useStoreSwitcher.wrapWith(require.resolve('./src/hooks/useStoreSwitcher'))
        talonWrapperConfig.Header.useAccountTrigger.wrapWith(
            require.resolve('./src/talons/useAccountTrigger')
        );
        talonWrapperConfig.ForgotPassword.useForgotPassword.wrapWith(
            require.resolve('./src/talons/useForgotPassword')
        );
        //talonWrapperConfig.SignIn.useSignIn.wrapWith(require.resolve('./src/talons/useSignIn'))
        // talonWrapperConfig.RootComponents.Product.useProduct.wrapWith(require.resolve('./src/talons/RootComponents/Product/useProduct'))
        // talonWrapperConfig.RootComponents.Category.useCategory.wrapWith(require.resolve('./src/talons/RootComponents/Category/useCategory'))
    });

    // const { Targetables } = require('@magento/pwa-buildpack');
    const targetables = Targetables.using(targets);

    /**************************************
     * Targetables *
     ***************************************/

    const fs = require('fs');
    const path = require('path');
    const globby = require('globby');

    //  Define the path to @magento packages
    const magentoPath = 'node_modules/@magento';

    // Context loader allows us to execute functions in the targeted file
    const requireContextLoader = require('babel-plugin-require-context-hook/register')();

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

    /**************************************
     * Styles *
     ***************************************/

    // Find our css files
    // (async () => {
    //     const paths = await globby('src/components', {
    //         expandDirectories: {
    //             extensions: ['css', 'scss']
    //         }
    //     });

    //     paths.forEach(myPath => {
    //         const relativePath = myPath
    //             .replace(
    //                 `src/components`,
    //                 `${magentoPath}/venia-ui/lib/components`
    //             );
    //         const absolutePath = path.resolve(relativePath);

    //         fs.stat(absolutePath, (err, stat) => {
    //             if (!err && stat && stat.isFile()) {

    //                 /**
    //                  * This means we have matched a local file to something in venia-ui!
    //                  * Find the JS  component from our CSS file name
    //                  * */
    //                 const jsComponent = relativePath
    //                     .replace('node_modules/', '')
    //                     .replace('.css', '.js');

    //                 /** Load the relevant venia-ui component */
    //                 const eSModule = targetables.reactComponent(jsComponent);
    //                 const module = targetables.module(jsComponent);

    //                 /** Add import for our custom CSS classes */
    //                 eSModule.addImport(`import localClasses from "${myPath}"`);
    //                 console.log('MY PATH ----> ', myPath);

    //                 /** Update the useStyle() method to inject our additional custom css */
    //                 module.insertAfterSource(
    //                     'const classes = useStyle(defaultClasses, ',
    //                     'localClasses, '
    //                 );
    //             }
    //         });
    //     });
    // })();

    /**********************************************
     * Components Cache for Targetables and Styles*
     ***********************************************/

    // Create a cache of components so our styling and intercepts can use the same object
    let componentsCache = [];
    function getReactComponent(modulePath) {
        if (componentsCache[modulePath] !== undefined) {
            return componentsCache[modulePath];
        }

        return (componentsCache[modulePath] = targetables.reactComponent(
            modulePath
        ));
    }

    /**********************************************
     * Component Overrides *
     ***********************************************/

    targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
        new moduleOverridePlugin(componentOverrideMapping).apply(compiler);
    });
};
