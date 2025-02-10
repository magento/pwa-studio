/**
 *
 * @param targets
 */
function localIntercept(targets) {
    require('@adobe/plugin-braintree-three-d-secure/Intercepts/brainTreeDropIn')(
        targets
    );
}

module.exports = localIntercept;
