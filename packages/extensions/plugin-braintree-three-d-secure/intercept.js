/**
 *
 * @param targets
 */
function localIntercept(targets) {
    require('@magento/plugin-braintree-three-d-secure/Intercepts/brainTreeDropIn')(
        targets
    );
}

module.exports = localIntercept;
