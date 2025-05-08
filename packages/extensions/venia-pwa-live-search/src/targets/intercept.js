module.exports = targets => {
    const { Targetables } = require('@magento/pwa-buildpack');

    const targetables = Targetables.using(targets);

    targetables.setSpecialFeatures('esModules', 'cssModules');
};
