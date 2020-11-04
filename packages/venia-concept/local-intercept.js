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

function localIntercept(targets) {
    const myTheme = Targetables.using(targets);

    const button = myTheme.reactComponent('@magento/venia-ui/lib/components/Button/button.js');

    const CustomButton = button.addImport("CustomButton from '@magento/venia-concept/src/CustomButton/CustomButton.js'");
    button.replaceJSX('button', `<${CustomButton} className={rootClassName} type={type} disabled={disabled} {...restProps}>{children}</${CustomButton}>`);

    // etc for all other things you might want to customize with your theme...
}


module.exports = localIntercept;
