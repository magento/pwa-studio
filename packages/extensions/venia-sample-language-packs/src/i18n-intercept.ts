// Some bad auto-generated TS - just showing an example of using TS in an extension.
module.exports = (targets: {
    of: (arg0: string) => any;
    name: string | number;
}) => {
    const builtins = targets.of('@magento/pwa-buildpack');

    builtins.specialFeatures.tap(
        (features: { [x: string]: { i18n: boolean } }) => {
            features[targets.name] = { i18n: true };
        }
    );
};
