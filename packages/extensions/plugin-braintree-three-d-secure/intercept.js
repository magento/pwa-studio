const path = require('path');

module.exports = function intercept(pluginTarget) {
    const buildBus = pluginTarget._parent;
    const veniaUi = buildBus.targetProviders.get('@magento/venia-ui');

    const paymentTypes = veniaUi._tapables.checkoutPagePaymentTypes;

    if (paymentTypes && typeof paymentTypes === 'object') {
        paymentTypes.brainTreeDropIn = path.resolve(
            __dirname,
            'Interceptors/BrainTreeDropIn.js'
        );
    }
};
