/**
 *
 * @param targets
 */
function localIntercept(targets) {
    require("@gomage/plugin-braintree-three-d-secure/Intercepts/brainTreeDropIn")(targets);
}

module.exports = localIntercept;
